// Voyager Points Ledger v4.4.1. Named Execute C# Code: Voyager Points Ledger.
// Action: Voyager - Points Ledger. Timer: 120 seconds, Lines 0, Repeat + Enabled.
// Timer scans remain read-only. Explicit administrator previews/apply can adjust points and groups.
using System;
using System.IO;
using System.Text;
using System.Globalization;
using System.Collections.Generic;
using Streamer.bot.Plugin.Interface.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    // SOURCES: Twitch 'points' is your existing persisted points field.
    // Array order is Twitch, YouTube, Kick. Blank means not configured.
    private static readonly string[] Platforms = { "twitch", "youtube", "kick" };
    private static readonly string[] PointsFields = { "points", "points", "points" };
    private static readonly string[] LifetimeEarnedFields = { "", "", "" };
    private static readonly string[] LifetimeUpgradeSpentFields = { "", "", "" };
    private const bool Persisted = true;
    private static readonly string[] GroupKeys = { "blue", "silver", "gold", "platinum", "vip", "emerald" };
    private static readonly string[] GroupNames = { "BLUE GROUP", "SILVER GROUP", "GOLD GROUP", "PLATINUM GROUP", "VIP GROUP", "" };
    private static readonly string[] BucketKeys = { "silver", "gold", "platinum" };
    private static readonly string[] BucketLogins = { "mdavoyagersilver", "mdavoyagergold", "mdavoyagerplatinum" };
    private static readonly decimal[] BucketTargets = { 72000m, 120000m, 200000m };
    private const string BucketPointsField = "points";
    // Optional absolute folder. Blank uses %LOCALAPPDATA%\MDA009\VoyagerPoints.
    private const string DataFolderOverride = "";
    private static readonly object LedgerLock = new object();
    private const string CaptureArgument = "voyagerPointsCaptureV1";
    private static JObject CachedState;
    private static string CachedFolder = "", LastCaptureError = "";
    private static long LastCheckpointAt = 0, LastCaptureErrorAt = 0;

    public bool Execute()
    {
        if (Arg("global.userId").Length > 0) return RecordMovement();
        if (Arg("pointsOperation").StartsWith("admin_", StringComparison.Ordinal)) return AdminRequest(Arg("pointsOperation"), Arg("requestId"));
        string requestId = Arg("requestId");
        try
        {
            lock (LedgerLock)
            {
                ValidateSettings();
                string folder = Folder();
                JObject state = Load(folder);
                string op = Arg("pointsOperation");
                if (op == "repair_history") { RepairSavedMovements(state, folder); Broadcast(Snapshot(state, folder), requestId); return true; }
                if (op == "history")
                {
                    Broadcast(History(folder, Arg("pointsUserKey"), Arg("pointsBefore"), Arg("pointsLimit")), requestId);
                    return true;
                }
                if (op != "" && op != "snapshot" && op != "scan") throw new Exception("Unknown points operation.");
                bool needsScan = op != "snapshot" || Now() - (long)state["lastScanAt"] >= 120000L;
                if (needsScan && UpgradeInProgress())
                {
                    JObject waiting = Snapshot(state, folder);
                    ((JArray)waiting["issues"]).Add("Existing Voyager upgrade is in progress. Automatic scan deferred until the next refresh to avoid an intermediate tier.");
                    Broadcast(waiting, requestId);
                    return true;
                }
                if (needsScan) Scan(state, folder);
                Broadcast(Snapshot(state, folder), requestId);
            }
            return true;
        }
        catch (Exception ex)
        {
            CPH.LogWarn("[Voyager Points] " + ex.Message);
            Broadcast(new JObject { ["ok"] = false, ["error"] = ex.Message }, requestId);
            return false;
        }
    }

    // Administration is invoked only by explicit preview/apply operations from the control page.
    // Read-only timer/history requests never call this path. Preview plans are kept on the server.
    private static readonly Dictionary<string, JObject> AdminPlans = new Dictionary<string, JObject>();
    private const long AdminPreviewLifetime = 300000L;
    private bool AdminRequest(string operation, string requestId)
    {
        try
        {
            ValidateSettings();
            JObject result;
            // Network work runs outside the ledger lock. Never publish credentials in any packet.
            JObject subscribers = operation == "admin_preview" && Arg("adminTask") == "subscribers" ? FetchSubscribers() : null;
            lock (LedgerLock)
            {
                string folder = Folder(); JObject state = Load(folder);
                if (operation == "admin_preview") result = AdminPreview(state, subscribers);
                else if (operation == "admin_apply") result = AdminApply(state, folder, Arg("adminPlanId"));
                else if (operation == "admin_status") result = AdminStatus(folder, Arg("adminPlanId"));
                else throw new Exception("Unknown administration operation.");
                Broadcast(result, requestId);
            }
            return true;
        }
        catch (Exception ex)
        {
            CPH.LogWarn("[Voyager Admin] " + ex.Message);
            bool safeToPreview = false;
            if (operation == "admin_apply") { try { safeToPreview = !File.Exists(AdminReceiptPath(Folder(), Arg("adminPlanId"))); } catch { } }
            Broadcast(new JObject { ["ok"] = false, ["error"] = ex.Message, ["operation"] = operation, ["safeToPreview"] = safeToPreview }, requestId);
            return false;
        }
    }
    private JObject AdminPreview(JObject state, JObject subscribers)
    {
        if (UpgradeInProgress()) throw new Exception("A Voyager upgrade is running. Wait for it to finish, then preview again.");
        var expired = new List<string>();
        foreach (var plan in AdminPlans) if (Now() > (long)plan.Value["expiresAt"]) expired.Add(plan.Key);
        foreach (string id in expired) AdminPlans.Remove(id);
        if (AdminPlans.Count >= 20) throw new Exception("Several previews are already open. Wait five minutes or close the other control pages.");
        string task = Arg("adminTask"), reason = Arg("adminReason").Trim();
        if (reason.Length < 3 || reason.Length > 200) throw new Exception("Enter an audit reason between 3 and 200 characters.");
        var rows = new JArray(); string title = "";
        string mode = Arg("adminImportMode");
        if (task == "points" || task == "group_add" || task == "group_remove")
        {
            JObject who = AdminMember(state); JArray beforeGroups = AdminGroups(who);
            JObject row = AdminRow(who, beforeGroups); rows.Add(row);
            if (task == "points")
            {
                long delta;
                if (!Int64.TryParse(Arg("adminDelta"), NumberStyles.Integer, CultureInfo.InvariantCulture, out delta) || delta == 0 || Math.Abs((decimal)delta) > 1000000000m)
                    throw new Exception("Use a nonzero whole point adjustment, up to 1,000,000,000 points.");
                int p = PlatformIndex((string)who["platform"]); decimal before;
                JObject current = ReadWrittenUser(p, (string)who["id"]);
                if (current == null || !Number(current["points"], out before)) throw new Exception("This account has no numeric saved points balance. Initialize it through your existing currency system, then refresh.");
                if (Decimal.Truncate(before) != before) throw new Exception("This balance contains fractions. Review it in Streamer.bot before using whole point adjustments.");
                decimal after = before + delta;
                if (after < 0 || after > 9007199254740991m) throw new Exception("The adjustment would leave a negative or unsupported balance.");
                row["beforePoints"] = before; row["afterPoints"] = after; row["delta"] = delta;
                row["writtenTicks"] = current["writtenTicks"].DeepClone(); row["change"] = true;
                title = (delta > 0 ? "Add " : "Deduct ") + Math.Abs(delta).ToString(CultureInfo.InvariantCulture) + " points";
            }
            else
            {
                string key = Arg("adminGroup"); AdminGroupIndex(key);
                JArray after = (JArray)beforeGroups.DeepClone();
                if (task == "group_add") { if (!Contains(after, key)) after.Add(key); }
                else RemoveGroupKey(after, key);
                row["afterGroups"] = after; row["change"] = !SameGroups(beforeGroups, after);
                row["message"] = (bool)row["change"] ? "" : "Already in the requested state";
                title = (task == "group_add" ? "Add to " : "Remove from ") + GroupNames[AdminGroupIndex(key)];
            }
        }
        else if (task == "bucket")
        {
            int b = AdminBucketIndex(Arg("adminBucket"));
            var account = CPH.TwitchGetUserInfoByLogin(BucketLogins[b]);
            if (account == null || String.IsNullOrEmpty(account.UserId)) throw new Exception("Could not resolve the configured bucket account. Nothing was changed.");
            JObject who = new JObject { ["key"] = "twitch:" + account.UserId, ["id"] = account.UserId, ["platform"] = "twitch", ["login"] = BucketLogins[b], ["name"] = BucketLogins[b] };
            JObject current = ReadWrittenUser(0, account.UserId); decimal before;
            if (current == null || !Number(current["points"], out before)) throw new Exception("This bucket has no numeric saved balance. Initialize its points variable in your existing currency system, then refresh.");
            if (Decimal.Truncate(before) != before) throw new Exception("This bucket contains fractional points. Review its saved balance in Streamer.bot first.");
            string edit = Arg("adminBucketMode"); long amount;
            if ((edit != "add" && edit != "deduct" && edit != "set") || !Int64.TryParse(Arg("adminBucketAmount"), NumberStyles.Integer, CultureInfo.InvariantCulture, out amount) || amount < 0 || amount > 1000000000L || (edit != "set" && amount == 0))
                throw new Exception("Choose Add, Deduct or Set exact balance and enter a whole amount up to 1,000,000,000. Zero is allowed for Set exact balance.");
            decimal after = edit == "set" ? amount : before + (edit == "add" ? amount : -amount), delta = after - before;
            if (after < 0 || after > 9007199254740991m || Math.Abs(delta) > 1000000000m) throw new Exception("The bucket adjustment would leave a negative or unsupported balance, or change more than 1,000,000,000 points.");
            JObject row = AdminRow(who, new JArray()); row["accountType"] = "bucket"; row["bucketKey"] = BucketKeys[b]; row["bucketTarget"] = BucketTargets[b];
            row["beforePoints"] = before; row["afterPoints"] = after; row["delta"] = (long)delta; row["writtenTicks"] = current["writtenTicks"].DeepClone();
            row["change"] = delta != 0; row["message"] = delta == 0 ? "Already at the requested balance" : "Administrator bucket adjustment";
            rows.Add(row); title = (edit == "set" ? "Set " : edit == "add" ? "Add to " : "Deduct from ") + BucketKeys[b] + " bucket";
        }
        else if (task == "clear")
        {
            string key = Arg("adminGroup"); int g = AdminGroupIndex(key); title = "Clear " + GroupNames[g];
            var people = CPH.UsersInGroup(GroupNames[g]);
            if (people == null) throw new Exception("Could not read the selected group. Nothing was changed.");
            var seen = new Dictionary<string, bool>();
            foreach (var person in people)
            {
                string platform = (person.Type ?? "").ToLowerInvariant(), id = person.Id ?? "";
                if (Array.IndexOf(Platforms, platform) < 0 || id.Length == 0) throw new Exception("The group contains an unsupported account. Review that account in Streamer.bot before clearing.");
                JObject who = new JObject { ["key"] = platform + ":" + id, ["id"] = id, ["platform"] = platform, ["name"] = person.Username ?? person.Login ?? id, ["login"] = person.Login ?? "" };
                if (seen.ContainsKey((string)who["key"])) continue; seen[(string)who["key"]] = true;
                JObject row = AdminRow(who, AdminGroups(who)); RemoveGroupKey((JArray)row["afterGroups"], key);
                row["change"] = true; rows.Add(row);
            }
        }
        else if (task == "subscribers")
        {
            if (subscribers == null) throw new Exception("No complete subscriber list is available.");
            if (mode != "protect" && mode != "exact") throw new Exception("Choose an import mode.");
            title = "Import active Twitch subscribers";
            foreach (JObject sub in (JArray)subscribers["users"])
            {
                JObject who = Identity(sub); JArray before = AdminGroups(who); JObject row = AdminRow(who, before);
                int rank = (int)sub["subscriberTier"]; string target = GroupKeys[rank - 1];
                row["subscriberTier"] = rank; row["targetGroup"] = target;
                row["sourceTiers"] = sub["sourceTiers"].DeepClone(); row["sourceNote"] = sub["sourceNote"].DeepClone();
                if (IsBucket("twitch", (string)who["login"])) row["message"] = "Giveaway bucket account excluded";
                else if (mode == "protect" && AdminCoreRank(before) > rank) row["message"] = "Higher Voyager tier preserved";
                else
                {
                    JArray after = (JArray)before.DeepClone();
                    for (int g = 0; g < 4; g++) RemoveGroupKey(after, GroupKeys[g]);
                    after.Add(target); row["afterGroups"] = after; row["change"] = !SameGroups(before, after);
                    row["message"] = (bool)row["change"] ? "" : "Already mapped";
                }
                rows.Add(row);
            }
        }
        else throw new Exception("Choose points, a bucket balance, a group change, group clearing, or subscriber import.");
        int changed = 0; foreach (JObject row in rows) if ((bool)row["change"]) changed++;
        var result = new JObject { ["ok"] = true, ["operation"] = "admin_preview", ["planId"] = Guid.NewGuid().ToString("N"), ["task"] = task,
            ["title"] = title, ["reason"] = reason, ["rows"] = rows, ["changes"] = changed, ["createdAt"] = Now(), ["expiresAt"] = Now() + AdminPreviewLifetime,
            ["importMode"] = mode, ["group"] = Arg("adminGroup"), ["channel"] = subscribers == null ? "" : (string)subscribers["channel"],
            ["fetchedAt"] = subscribers == null ? 0L : (long)subscribers["fetchedAt"] };
        if (subscribers != null) result["subscriberFetch"] = subscribers["summary"].DeepClone();
        if (task == "bucket") { result["bucketKey"] = Arg("adminBucket"); result["bucketMode"] = Arg("adminBucketMode"); }
        AdminPlans[(string)result["planId"]] = (JObject)result.DeepClone(); return result;
    }
    private JObject AdminMember(JObject state)
    {
        string key = Arg("adminUserKey"); JObject who;
        if (key.Length > 0)
        {
            who = ((JObject)state["users"])[key] as JObject;
            if (who == null) throw new Exception("Member not found in the ledger. Refresh, or use Twitch username lookup.");
            who = Identity(who);
        }
        else
        {
            string login = Arg("adminTwitchLogin").Trim().TrimStart('@').ToLowerInvariant();
            if (login.Length < 1 || login.Length > 25) throw new Exception("Enter a Twitch login name.");
            foreach (char ch in login) if (!(ch >= 'a' && ch <= 'z') && !(ch >= '0' && ch <= '9') && ch != '_') throw new Exception("Use the Twitch login name, without a URL or spaces.");
            var user = CPH.TwitchGetUserInfoByLogin(login);
            if (user == null || String.IsNullOrEmpty(user.UserId)) throw new Exception("Twitch could not resolve this username. Nothing was changed.");
            who = new JObject { ["key"] = "twitch:" + user.UserId, ["id"] = user.UserId, ["platform"] = "twitch", ["login"] = user.UserLogin, ["name"] = user.UserName };
        }
        if (IsBucket((string)who["platform"], (string)who["login"])) throw new Exception("Giveaway bucket accounts are excluded from individual member edits.");
        PlatformIndex((string)who["platform"]); return who;
    }
    private static JObject AdminRow(JObject who, JArray groups)
    { var row = Identity(who); row["beforeGroups"] = groups.DeepClone(); row["afterGroups"] = groups.DeepClone(); row["change"] = false; row["message"] = ""; return row; }
    private static int AdminBucketIndex(string key)
    {
        int b = Array.IndexOf(BucketKeys, key);
        if (b < 0) throw new Exception("Choose a configured Silver, Gold or Platinum bucket.");
        // Reuse the native movement listener and its exact points field for these accounts.
        if (BucketPointsField != PointsFields[0]) throw new Exception("BucketPointsField must match the Twitch PointsFields entry for tracked bucket edits. Both are points in the supplied setup.");
        return b;
    }
    private int AdminGroupIndex(string key)
    {
        int g = Array.IndexOf(GroupKeys, key);
        if (g < 0 || g >= 5 || String.IsNullOrWhiteSpace(GroupNames[g])) throw new Exception("Choose Blue, Silver, Gold, Platinum or VIP.");
        if (!CPH.GroupExists(GroupNames[g])) throw new Exception("Group not found: " + GroupNames[g]); return g;
    }
    private static Streamer.bot.Plugin.Interface.Enums.Platform AdminPlatform(string platform)
    {
        if (platform == "twitch") return Streamer.bot.Plugin.Interface.Enums.Platform.Twitch;
        if (platform == "youtube") return Streamer.bot.Plugin.Interface.Enums.Platform.YouTube;
        if (platform == "kick") return Streamer.bot.Plugin.Interface.Enums.Platform.Kick;
        throw new Exception("Unsupported member platform.");
    }
    private JArray AdminGroups(JObject who)
    {
        var result = new JArray();
        for (int g = 0; g < 5; g++)
        {
            AdminGroupIndex(GroupKeys[g]);
            if (CPH.UserIdInGroup((string)who["id"], AdminPlatform((string)who["platform"]), GroupNames[g])) result.Add(GroupKeys[g]);
        }
        return result;
    }
    private static void RemoveGroupKey(JArray groups, string key) { for (int i = groups.Count - 1; i >= 0; i--) if ((string)groups[i] == key) groups.RemoveAt(i); }
    private static int AdminCoreRank(JArray groups) { for (int g = 3; g >= 0; g--) if (Contains(groups, GroupKeys[g])) return g + 1; return 0; }
    private static bool SameGroups(JArray a, JArray b) { if (a.Count != b.Count) return false; foreach (string key in a) if (!Contains(b, key)) return false; return true; }
    private static string AdminReceiptPath(string folder, string planId)
    {
        Guid id; if (!Guid.TryParseExact(planId, "N", out id)) throw new Exception("Invalid preview ID.");
        string path = Path.Combine(folder, "admin"); Directory.CreateDirectory(path); return Path.Combine(path, "operation-" + planId + ".json");
    }
    private static void AdminSave(string path, JObject report)
    {
        string temp = path + ".tmp"; byte[] bytes = new UTF8Encoding(false).GetBytes(report.ToString(Formatting.Indented));
        using (var stream = new FileStream(temp, FileMode.Create, FileAccess.Write, FileShare.None)) { stream.Write(bytes, 0, bytes.Length); stream.Flush(true); }
        if (File.Exists(path)) File.Replace(temp, path, null); else File.Move(temp, path);
    }
    private JObject AdminStatus(string folder, string planId)
    {
        string path = AdminReceiptPath(folder, planId);
        if (File.Exists(path)) { JObject report = JObject.Parse(File.ReadAllText(path, Encoding.UTF8)); report["ok"] = true; report["operation"] = "admin_result"; return report; }
        return new JObject { ["ok"] = true, ["operation"] = "admin_status", ["planId"] = planId, ["status"] = "not_started", ["message"] = "No saved execution record. The request may still be queued. Check again before starting a new adjustment." };
    }
    private JObject AdminApply(JObject state, string folder, string planId)
    {
        string path = AdminReceiptPath(folder, planId);
        // At-most-once: a repeated apply (including after restart) only returns the saved receipt.
        if (File.Exists(path)) return AdminStatus(folder, planId);
        JObject plan;
        if (!AdminPlans.TryGetValue(planId, out plan) || Now() > (long)plan["expiresAt"]) throw new Exception("Preview expired or Streamer.bot restarted. Create a fresh preview.");
        if (Arg("adminConfirm") != "APPLY") throw new Exception("Review the preview and confirm Apply changes.");
        if (UpgradeInProgress()) throw new Exception("A Voyager upgrade is running. Wait and preview again.");
        string task = (string)plan["task"];
        if (task == "clear" && Arg("adminClearConfirm") != GroupNames[AdminGroupIndex((string)plan["group"])]) throw new Exception("Type the exact group name to confirm clearing.");
        if ((int)plan["changes"] == 0) throw new Exception("This preview contains no changes.");
        // Preflight every affected row before the first write. Do not apply a stale batch.
        foreach (JObject row in (JArray)plan["rows"])
        {
            if (!(bool)row["change"]) continue;
            if (task != "bucket" && !SameGroups(AdminGroups(row), (JArray)row["beforeGroups"])) throw new Exception("Membership changed since preview for " + (string)row["name"] + ". Preview again.");
            if (task == "points" || task == "bucket") AdminCheckBalance(row);
        }
        JObject report = (JObject)plan.DeepClone(); report["operation"] = "admin_result"; report["status"] = "in_progress"; report["startedAt"] = Now();
        report["results"] = new JArray(); report["completed"] = 0; report["failed"] = 0;
        AdminSave(path, report); // durable intent BEFORE any point/group write
        foreach (JObject row in (JArray)plan["rows"])
        {
            if (!(bool)row["change"]) continue;
            var result = Identity(row); result["status"] = "in_progress"; result["message"] = "Execution started; inspect current values if interrupted.";
            ((JArray)report["results"]).Add(result); AdminSave(path, report);
            try
            {
                if (task != "bucket" && !SameGroups(AdminGroups(row), (JArray)row["beforeGroups"])) throw new Exception("Membership changed during the batch; skipped. Preview again.");
                AdminAudit(state, folder, row, plan, "requested", "");
                if (task == "points" || task == "bucket") AdminAdjust(row, plan, result);
                else AdminSetGroups(row, result);
                result["status"] = "completed"; result["message"] = "Verified in Streamer.bot";
                AdminAudit(state, folder, row, plan, "completed", "Verified in Streamer.bot");
                report["completed"] = (int)report["completed"] + 1;
            }
            catch (Exception ex)
            {
                result["status"] = "review"; result["message"] = ex.Message;
                report["failed"] = (int)report["failed"] + 1;
                try { if (task != "bucket") result["actualGroups"] = AdminGroups(row); if (task == "points" || task == "bucket") { decimal actual; result["actualPoints"] = Number(ReadOne(PlatformIndex((string)row["platform"]), (string)row["id"]), out actual) ? new JValue(actual) : JValue.CreateNull(); } }
                catch { }
                AdminAudit(state, folder, row, plan, "review", ex.Message);
            }
            AdminSave(path, report);
        }
        report["status"] = (int)report["failed"] > 0 ? "partial" : "completed"; report["finishedAt"] = Now();
        AdminSave(path, report); AdminPlans.Remove(planId); Save(state, folder); return report;
    }
    private void AdminCheckBalance(JObject row)
    {
        if ((string)row["accountType"] == "bucket")
        {
            int b = AdminBucketIndex((string)row["bucketKey"]);
            if ((string)row["platform"] != "twitch" || !String.Equals((string)row["login"], BucketLogins[b], StringComparison.OrdinalIgnoreCase)) throw new Exception("The bucket account configuration changed. Create a fresh preview.");
        }
        JObject current = ReadWrittenUser(PlatformIndex((string)row["platform"]), (string)row["id"]); decimal balance;
        if (current == null || !Number(current["points"], out balance) || balance != (decimal)row["beforePoints"] || (long)current["writtenTicks"] != (long)row["writtenTicks"])
            throw new Exception("The balance changed since preview. Preview the adjustment again.");
    }
    private void AdminAdjust(JObject row, JObject plan, JObject result)
    {
        AdminCheckBalance(row); int p = PlatformIndex((string)row["platform"]); long delta = (long)row["delta"];
        CPH.SetArgument("voyagerMovementPlatform", Platforms[p]); CPH.SetArgument("voyagerMovementUserId", (string)row["id"]);
        CPH.SetArgument("voyagerMovementScope", "current"); CPH.SetArgument("voyagerMovementReason", "adjustment");
        CPH.SetArgument("voyagerMovementAction", "Voyager control / " + (string)plan["reason"]); CPH.SetArgument("voyagerMovementDelta", delta);
        CPH.SetArgument("voyagerFlowId", (string)plan["planId"]); BeginMovement();
        var ids = new List<string> { (string)row["id"] };
        // Increment the existing variable, never replace it with a stale browser balance.
        if (p == 0) CPH.IncrementTwitchUsersVarById(ids, PointsFields[p], delta, Persisted);
        else if (p == 1) CPH.IncrementYouTubeUsersVarById(ids, PointsFields[p], delta, Persisted);
        else CPH.IncrementKickUsersVarById(ids, PointsFields[p], delta, Persisted);
        EndMovement(); decimal after;
        if (!Number(ReadOne(p, (string)row["id"]), out after)) throw new Exception("Adjustment was sent but the resulting balance is unavailable. Inspect history before another adjustment.");
        result["actualPoints"] = after;
        if (after != (decimal)row["afterPoints"]) throw new Exception("Adjustment was sent, but the resulting balance differs from preview. Another points action may have run. Inspect history; do not repeat blindly.");
    }
    private void AdminSetGroups(JObject row, JObject result)
    {
        JArray before = (JArray)row["beforeGroups"], after = (JArray)row["afterGroups"];
        var platform = AdminPlatform((string)row["platform"]); string id = (string)row["id"];
        // Add destination first. A failed addition cannot strip an existing core tier.
        foreach (string key in after) if (!Contains(before, key))
        {
            string name = GroupNames[AdminGroupIndex(key)];
            if (!CPH.AddUserIdToGroup(id, platform, name) || !CPH.UserIdInGroup(id, platform, name)) throw new Exception("Could not add to " + name + ". Review this member's groups.");
        }
        foreach (string key in before) if (!Contains(after, key))
        {
            string name = GroupNames[AdminGroupIndex(key)];
            if (!CPH.RemoveUserIdFromGroup(id, platform, name) || CPH.UserIdInGroup(id, platform, name)) throw new Exception("Could not remove from " + name + ". Some earlier changes may have completed.");
        }
        JArray actual = AdminGroups(row); result["actualGroups"] = actual;
        if (!SameGroups(actual, after)) throw new Exception("Groups changed during execution. Review this member before trying again.");
    }
    private static void AdminAudit(JObject state, string folder, JObject row, JObject plan, string outcome, string message)
    {
        var entry = Identity(row); entry["kind"] = "admin"; entry["task"] = plan["task"].DeepClone(); entry["outcome"] = outcome;
        if ((string)row["accountType"] == "bucket") { entry["accountType"] = "bucket"; entry["bucketKey"] = row["bucketKey"].DeepClone(); }
        entry["transactionId"] = plan["planId"].DeepClone(); entry["reason"] = "adjustment"; entry["actionLabel"] = plan["title"].DeepClone();
        entry["note"] = (string)plan["reason"] + (message.Length > 0 ? " / " + message : ""); entry["delta"] = null;
        entry["evidence"] = "administrator operation receipt; numeric totals come from native events";
        entry["plannedBeforePoints"] = row["beforePoints"] == null ? JValue.CreateNull() : row["beforePoints"].DeepClone();
        entry["plannedAfterPoints"] = row["afterPoints"] == null ? JValue.CreateNull() : row["afterPoints"].DeepClone();
        entry["plannedBeforeGroups"] = row["beforeGroups"].DeepClone(); entry["plannedAfterGroups"] = row["afterGroups"].DeepClone();
        Commit(state, folder, entry);
    }
    private JObject FetchSubscribers()
    {
        var broadcaster = CPH.TwitchGetBroadcaster();
        if (broadcaster == null || String.IsNullOrEmpty(broadcaster.UserId)) throw new Exception("Connect your Twitch broadcaster account in Streamer.bot first.");
        string token = CPH.TwitchOAuthToken, clientId = CPH.TwitchClientId;
        if (String.IsNullOrEmpty(token) || String.IsNullOrEmpty(clientId)) throw new Exception("Reconnect your Twitch broadcaster account in Streamer.bot.");
        long started = Now();
        JObject previous = ReadSubscriberPages(broadcaster.UserId, broadcaster.UserLogin, token, clientId, started);
        // A reported total is not a checksum for a live paginated list. Require two
        // complete consecutive reads to agree on the identities and tiers we will map.
        // A third read permits one change while fetching without accepting an unstable list.
        for (int pass = 2; pass <= 3; pass++)
        {
            JObject current = ReadSubscriberPages(broadcaster.UserId, broadcaster.UserLogin, token, clientId, started);
            if (SameSubscriberAccounts((JArray)previous["users"], (JArray)current["users"]))
            {
                JObject summary = (JObject)current["summary"];
                summary["verificationPasses"] = pass;
                summary["verificationNote"] = "Two consecutive complete reads matched on account IDs and highest returned tiers.";
                summary["countNote"] = (int)summary["uniqueUsers"] != (int)summary["reportedTotal"]
                    ? "Twitch's reported total differs from the unique account count. Review the listed accounts; the import uses these verified account IDs."
                    : "";
                return current;
            }
            previous = current;
        }
        throw new Exception("Twitch subscriber membership changed between complete reads. Nothing was changed. Wait a moment, then preview again.");
    }
    private static bool SameSubscriberAccounts(JArray left, JArray right)
    {
        if (left.Count != right.Count) return false;
        var tiers = new Dictionary<string, int>();
        foreach (JObject user in left) tiers[(string)user["id"]] = (int)user["subscriberTier"];
        foreach (JObject user in right)
        {
            int tier;
            if (!tiers.TryGetValue((string)user["id"], out tier) || tier != (int)user["subscriberTier"]) return false;
        }
        return true;
    }
    private JObject ReadSubscriberPages(string broadcasterId, string channel, string token, string clientId, long started)
    {
        var users = new JArray(); var seen = new Dictionary<string, JObject>(); var cursors = new Dictionary<string, bool>();
        string cursor = ""; int total = -1, records = 0, pages = 0, totalMin = Int32.MaxValue, totalMax = 0;
        do
        {
            if (Now() - started > 90000L || cursors.Count > 1000) throw new Exception("Twitch subscriber fetch exceeded its limit. No changes were made; try a fresh preview.");
            string url = "https://api.twitch.tv/helix/subscriptions?broadcaster_id=" + Uri.EscapeDataString(broadcasterId) + "&first=100";
            if (cursor.Length > 0) url += "&after=" + Uri.EscapeDataString(cursor);
            var request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
            request.Method = "GET"; request.Timeout = 15000; request.ReadWriteTimeout = 15000; request.AllowAutoRedirect = false;
            request.Headers["Authorization"] = "Bearer " + token; request.Headers["Client-Id"] = clientId;
            JObject page;
            try
            {
                using (var response = (System.Net.HttpWebResponse)request.GetResponse())
                using (var reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8)) page = JObject.Parse(reader.ReadToEnd());
            }
            catch (System.Net.WebException ex)
            {
                var response = ex.Response as System.Net.HttpWebResponse; int code = response == null ? 0 : (int)response.StatusCode;
                if (response != null) response.Dispose();
                if (code == 401 || code == 403) throw new Exception("Twitch denied subscriber access. Reconnect the broadcaster account in Streamer.bot and authorize channel:read:subscriptions, then preview again.");
                if (code == 429) throw new Exception("Twitch rate limit reached. Wait a minute, then preview again. No changes were made.");
                throw new Exception("Could not fetch the complete Twitch subscriber list" + (code == 0 ? " (network or timeout)" : " (HTTP " + code + ")") + ". No changes were made.");
            }
            JArray list = page["data"] as JArray; int pageTotal;
            if (list == null || !Int32.TryParse((string)page["total"], out pageTotal) || pageTotal < 0) throw new Exception("Twitch returned an incomplete subscriber response. Nothing was changed.");
            total = pageTotal; totalMin = Math.Min(totalMin, total); totalMax = Math.Max(totalMax, total); pages++;
            foreach (JToken item in list)
            {
                JObject sub = item as JObject;
                if (sub == null) throw new Exception("Twitch returned an invalid subscriber record. Nothing was changed.");
                string id = (string)sub["user_id"], login = (string)sub["user_login"], tier = (string)sub["tier"];
                int rank = tier == "1000" ? 1 : tier == "2000" ? 2 : tier == "3000" ? 3 : 0;
                if (String.IsNullOrEmpty(id) || String.IsNullOrEmpty(login) || rank == 0 || (string)sub["broadcaster_id"] != broadcasterId) throw new Exception("Twitch returned an invalid subscriber record. Nothing was changed.");
                records++;
                // Twitch may return more than one subscription record for an account.
                // One user gets one preview row; highest returned tier wins regardless of page order.
                JObject user;
                if (seen.TryGetValue(id, out user))
                {
                    JArray tiers = (JArray)user["sourceTiers"];
                    if (!Contains(tiers, rank.ToString(CultureInfo.InvariantCulture))) tiers.Add(rank);
                    if (rank > (int)user["subscriberTier"]) user["subscriberTier"] = rank;
                    continue;
                }
                user = new JObject { ["key"] = "twitch:" + id, ["platform"] = "twitch", ["id"] = id, ["login"] = login.ToLowerInvariant(), ["name"] = (string)sub["user_name"] ?? login,
                    ["subscriberTier"] = rank, ["sourceTiers"] = new JArray(rank), ["sourceNote"] = "" };
                seen[id] = user; users.Add(user);
            }
            JObject pagination = page["pagination"] as JObject;
            if (pagination == null) throw new Exception("Twitch returned no pagination information. Nothing was changed.");
            if (pagination["cursor"] != null && pagination["cursor"].Type != JTokenType.String) throw new Exception("Twitch returned an invalid pagination cursor. Nothing was changed.");
            if (pagination["cursor"] == null && pagination.Count > 0) throw new Exception("Twitch returned incomplete pagination information. Nothing was changed.");
            cursor = (string)pagination["cursor"] ?? "";
            if (cursor.Length > 0) { if (cursors.ContainsKey(cursor)) throw new Exception("Twitch pagination did not advance. Nothing was changed."); cursors[cursor] = true; }
        } while (cursor.Length > 0);
        // An exhausted cursor chain defines the end of this read. Totals are retained
        // for review, not used to truncate the list or reject duplicate/overlapping pages.
        int mixedTiers = 0;
        foreach (JObject user in users)
        {
            JArray tiers = (JArray)user["sourceTiers"], sorted = new JArray();
            for (int rank = 1; rank <= 3; rank++) if (Contains(tiers, rank.ToString(CultureInfo.InvariantCulture))) sorted.Add(rank);
            user["sourceTiers"] = sorted;
            if (sorted.Count > 1)
            {
                mixedTiers++;
                user["sourceNote"] = "Multiple Twitch tier records; highest returned tier used. Review this mapping.";
            }
        }
        return new JObject { ["users"] = users, ["channel"] = channel, ["fetchedAt"] = Now(),
            ["summary"] = new JObject { ["reportedTotal"] = total, ["reportedTotalMin"] = totalMin, ["reportedTotalMax"] = totalMax, ["pages"] = pages,
                ["records"] = records, ["uniqueUsers"] = users.Count, ["duplicateRecords"] = records - users.Count, ["mixedTierUsers"] = mixedTiers, ["tierPolicy"] = "highest_returned" } };
    }

    // Compatibility with v2 hooks. Counts come from verified writes or native variable events.
    public bool CaptureUpgradeBefore()
    {
        decimal cost;
        if (!Number(Arg("voyagerUpgradeCost"), out cost)) return true;
        CPH.SetArgument("voyagerMovementReason", "upgrade");
        CPH.SetArgument("voyagerMovementScope", "current");
        CPH.SetArgument("voyagerMovementPlatform", Arg("userType"));
        CPH.SetArgument("voyagerMovementDelta", -cost);
        CPH.SetArgument("voyagerMovementAction", "Legacy upgrade hook");
        return BeginMovement();
    }
    public bool RecordUpgradeAfter() { return EndMovement(); }

    // Optional: call after completed tier additions/removals, resets or expiry actions.
    // Captures all completed changes immediately; the independent timer is still required.
    public bool RecordTierChanges()
    {
        try { lock (LedgerLock) { string folder = Folder(); JObject state = Load(folder); Scan(state, folder); } }
        catch (Exception ex) { CPH.LogWarn("[Voyager Points] Tier audit failed: " + ex.Message); }
        return true;
    }

    // Native trigger: Core > Global Variables > User Global Variable Updated.
    // Filter persisted=Yes, all usernames and platforms. No point-writing action is replaced.
    public bool RecordMovement()
    {
        try
        {
            lock (LedgerLock)
            {
                ValidateSettings(); string folder = Folder(); JObject state = Load(folder);
                string platform = Arg("global.userType").ToLowerInvariant();
                int p = Array.IndexOf(Platforms, platform); if (p < 0) return true;
                string field = Arg("global.name"); bool persisted;
                if (!Boolean.TryParse(Arg("global.persisted"), out persisted) || persisted != Persisted || field != PointsFields[p]) return true;
                string id = Arg("global.userId"), login = Arg("global.userLogin").ToLowerInvariant();
                if (id.Length == 0) throw new Exception("Variable event has no global.userId.");
                object timestamp; if (!CPH.TryGetArg<object>("global.lastWrite", out timestamp)) throw new Exception("Variable event has no global.lastWrite.");
                long ticks = WrittenTicks(timestamp); if (ticks == 0) throw new Exception("Variable event timestamp is invalid.");
                long happened = new DateTimeOffset(new DateTime(ticks, DateTimeKind.Utc)).ToUnixTimeMilliseconds();
                // Delayed duplicate deliveries beyond the receipt window cannot be safely counted.
                if (happened < (long)state["movementStartedAt"] || happened < Now() - 172800000L) return true;
                string key = platform + ":" + id; decimal before, after;
                bool hadBefore = Number(Raw("global.oldValue"), out before), hasAfter = Number(Raw("global.newValue"), out after);
                string eventId = Fingerprint(key, field, ticks, hadBefore ? (decimal?)before : null, hasAfter ? (decimal?)after : null);
                JObject receipts = (JObject)state["movementReceipts"];
                state["lastMovementListenerAt"] = Now();
                string existingId = EquivalentId(receipts, eventId);
                if (existingId != null)
                {
                    JObject existingReceipt = (JObject)receipts[existingId];
                    string knownNative = (string)existingReceipt["nativeEventId"];
                    if (String.IsNullOrEmpty(knownNative) && (string)existingReceipt["evidence"] == "native variable event") knownNative = existingId;
                    if (!String.IsNullOrEmpty(knownNative) && knownNative != eventId)
                        Commit(state, folder, new JObject { ["kind"] = "capture_review", ["key"] = key, ["name"] = login, ["eventId"] = eventId,
                            ["note"] = "Distinct native timestamp collides with one millisecond hook identity. Retained for review; no duplicate amount counted." });
                    else if (String.IsNullOrEmpty(knownNative))
                        Commit(state, folder, new JObject { ["kind"] = "capture_confirmation", ["key"] = key, ["eventId"] = existingId, ["nativeEventId"] = eventId });
                    SaveOccasionally(state, folder); return true;
                }
                // Never count a second amount when a nearby hook may describe this write.
                if (NearbyHook(receipts, eventId))
                {
                    Commit(state, folder, new JObject { ["kind"] = "capture_review", ["key"] = key, ["name"] = login,
                        ["eventId"] = eventId, ["note"] = "Native event is near a verified hook with different timing; retained for review, not counted twice." });
                    SaveOccasionally(state, folder); return true;
                }
                if (hadBefore && hasAfter && before == after) { SaveOccasionally(state, folder); return true; }
                JObject who = new JObject { ["key"] = key, ["id"] = id, ["platform"] = platform, ["login"] = login, ["name"] = Arg("global.userName") };
                if (((string)who["name"]).Length == 0) who["name"] = login.Length == 0 ? id : login;
                JObject row = ((JObject)state["users"])[key] as JObject;
                row = row == null ? NewUser(who, hadBefore ? (decimal?)before : null) : (JObject)row.DeepClone();
                EnsureMovementCounters(row);
                JObject old = (JObject)row.DeepClone();
                if ((row["captureOpeningPoints"] == null || row["captureOpeningPoints"].Type == JTokenType.Null) && hadBefore) row["captureOpeningPoints"] = before;
                row["name"] = who["name"]; if (login.Length > 0) row["login"] = login;
                bool bucket = IsBucket(platform, (string)row["login"]);
                // Event totals never use snapshot deltas, so polling and delayed events cannot double count.
                decimal? delta = hadBefore && hasAfter ? (decimal?)(after - before) : null;
                if (delta.HasValue) { AddCounter(row, "capturedIn", Math.Max(0, delta.Value)); AddCounter(row, "capturedOut", Math.Max(0, -delta.Value)); }
                row["movementCount"] = (long)row["movementCount"] + 1;
                if (ticks >= ((long?)row["balanceWrittenTicks"] ?? 0L))
                {
                    row["points"] = hasAfter ? new JValue(after) : JValue.CreateNull();
                    row["pointsAt"] = Now(); row["pointsFresh"] = hasAfter; row["balanceWrittenTicks"] = ticks;
                }
                string labelId = EquivalentId((JObject)state["movementLabels"], eventId);
                JObject label = labelId == null ? null : ((JObject)state["movementLabels"])[labelId] as JObject;
                string reason = label == null ? "unclassified" : (string)label["reason"];
                ApplyCategory(row, reason, delta, 1);
                JObject entry = UserEvent("movement", old, row);
                entry["beforePoints"] = hadBefore ? new JValue(before) : JValue.CreateNull(); entry["afterPoints"] = hasAfter ? new JValue(after) : JValue.CreateNull();
                entry["delta"] = delta.HasValue ? new JValue(delta.Value) : JValue.CreateNull();
                entry["eventId"] = eventId; entry["labelSourceId"] = labelId; entry["happenedAt"] = happened; entry["reason"] = reason;
                entry["evidence"] = "native variable event"; entry["accountType"] = bucket ? "bucket" : "member";
                entry["actionLabel"] = label == null ? "" : (string)label["actionLabel"];
                entry["transactionId"] = label == null ? "" : (string)label["transactionId"];
                entry["note"] = delta.HasValue ? "" : "Variable created, removed or nonnumeric. Unknown values are not treated as zero.";
                Commit(state, folder, entry); SaveOccasionally(state, folder);
            }
        }
        catch (Exception ex) { CaptureError(ex); }
        return true;
    }

    // Hooks verify stored writes and supply descriptions. Native and hook deliveries are deduplicated.
    // Existing hooks surround known writes; tracking never changes their amounts.
    public bool BeginPurchaseFlow() { CPH.SetArgument("voyagerFlowId", Guid.NewGuid().ToString("N")); return true; }
    public bool ReconcileAfterReset() { return RecordTierChanges(); }
    public bool BeginMovement()
    {
        CPH.SetArgument("voyagerMovementCapture", "");
        try
        {
            string platform = Arg("voyagerMovementPlatform").ToLowerInvariant();
            if (platform.Length == 0) platform = Arg("userType").ToLowerInvariant();
            int p = PlatformIndex(platform); string scope = Arg("voyagerMovementScope");
            string id = Arg("voyagerMovementUserId");
            if (id.Length == 0) id = scope == "target" ? Arg("targetUserId") : Arg("userId");
            if (id.Length == 0) throw new Exception("No user ID for movement label.");
            string reason = Arg("voyagerMovementReason");
            if (reason == "membership_purchase" && Arg("voyagerPurchaseOrigin") == "fast_track") reason = "fast_track_purchase";
            else if (reason == "membership_purchase" && Arg("voyagerPurchaseOrigin") == "upgrade") reason = "upgrade";
            decimal expected; if (!Number(Arg("voyagerMovementDelta"), out expected)) throw new Exception("Movement label needs an expected signed delta.");
            object raw = ReadOne(p, id); decimal before; if (!Number(raw, out before)) return true;
            CPH.SetArgument("voyagerMovementCapture", new JObject { ["key"] = platform + ":" + id, ["id"] = id, ["platform"] = platform,
                ["field"] = PointsFields[p], ["before"] = before, ["reason"] = reason, ["expected"] = expected,
                ["startedTicks"] = DateTime.UtcNow.Ticks, ["actionLabel"] = Arg("voyagerMovementAction"), ["transactionId"] = Arg("voyagerFlowId").Length > 0 ? Arg("voyagerFlowId") : Guid.NewGuid().ToString("N") }.ToString(Formatting.None));
        }
        catch (Exception ex) { CPH.LogWarn("[Voyager Points] Label start skipped: " + ex.Message); }
        return true;
    }
    public bool EndMovement()
    {
        try
        {
            string raw = Arg("voyagerMovementCapture"); CPH.SetArgument("voyagerMovementCapture", "");
            if (raw.Length == 0) return true;
            JObject capture = JObject.Parse(raw); int p = PlatformIndex((string)capture["platform"]);
            if (PointsFields[p] != (string)capture["field"]) return true;
            // LastWrite binds the label to one actual stored update, not a nearby scan.
            JObject sample = ReadWrittenUser(p, (string)capture["id"]);
            decimal after; if (sample == null || !Number(sample["points"], out after)) return true;
            decimal before = (decimal)capture["before"], expected = (decimal)capture["expected"];
            long ticks = (long?)sample["writtenTicks"] ?? 0L, start = (long)capture["startedTicks"];
            if (after - before != expected || expected == 0 || ticks / 10000L < start / 10000L || ticks > DateTime.UtcNow.Ticks || DateTime.UtcNow.Ticks - start > TimeSpan.FromMinutes(1).Ticks)
            { CPH.LogWarn("[Voyager Points] Label did not match one expected write; movement stays unclassified."); return true; }
            string eventId = Fingerprint((string)capture["key"], PointsFields[p], ticks, before, after);
            lock (LedgerLock)
            {
                string folder = Folder(); JObject state = Load(folder);
                JObject label = new JObject { ["eventId"] = eventId, ["reason"] = capture["reason"], ["actionLabel"] = capture["actionLabel"], ["transactionId"] = capture["transactionId"] };
                StoreLabel(state, folder, label, (string)capture["key"]);
                // Record an already verified write when its native delivery is absent.
                // This path only changes the audit ledger, never the currency balance.
                if (EquivalentId((JObject)state["movementReceipts"], eventId) == null &&
                    !NearbyTransition((JObject)state["movementReceipts"], eventId) &&
                    !OtherWriteInWindow((JObject)state["movementReceipts"], eventId, start, ticks))
                    RecordVerifiedWrite(state, folder, label, "verified currency hook", false);
                SaveOccasionally(state, folder);
            }
        }
        catch (Exception ex) { CaptureError(ex); }
        return true;
    }
    private JObject ReadWrittenUser(int p, string id)
    {
        List<UserVariableValue<object>> records;
        if (p == 0) records = CPH.GetTwitchUsersVar<object>(PointsFields[p], Persisted);
        else if (p == 1) records = CPH.GetYouTubeUsersVar<object>(PointsFields[p], Persisted);
        else records = CPH.GetKickUsersVar<object>(PointsFields[p], Persisted);
        if (records == null) return null;
        foreach (var record in records)
        {
            if (record.UserId != id) continue;
            decimal value; return new JObject { ["points"] = Number(record.Value, out value) ? new JValue(value) : JValue.CreateNull(), ["writtenTicks"] = WrittenTicks(record.LastWrite) };
        }
        return null;
    }
    private object ReadOne(int p, string id)
    {
        if (p == 0) return CPH.GetTwitchUserVarById<object>(id, PointsFields[p], Persisted);
        if (p == 1) return CPH.GetYouTubeUserVarById<object>(id, PointsFields[p], Persisted);
        return CPH.GetKickUserVarById<object>(id, PointsFields[p], Persisted);
    }
    public bool RecordGroupAdded() { return RecordGroupEvent("added"); }
    public bool RecordGroupRemoved() { return RecordGroupEvent("removed"); }
    public bool RecordGroupCleared() { return RecordGroupEvent("cleared"); }
    private bool RecordGroupEvent(string operation)
    {
        try
        {
            int g = Array.IndexOf(GroupNames, Arg("group.name")); if (g < 0 || GroupNames[g].Length == 0) return true;
            lock (LedgerLock)
            {
                string folder = Folder(); JObject state = Load(folder); string group = GroupKeys[g];
                var people = new JArray();
                if (operation == "cleared")
                {
                    foreach (JProperty prop in ((JObject)state["users"]).Properties())
                    { JObject row = (JObject)prop.Value; if (Contains((JArray)(row["eventGroups"] ?? row["groups"]), group)) people.Add(Identity(row)); }
                }
                else
                {
                    int count; if (!Int32.TryParse(Arg("group.user.count"), out count) || count < 0) throw new Exception("Group event missing group.user.count.");
                    for (int i = 0; i < count; i++)
                    {
                        string prefix = "group.user" + i + ".", platform = Arg(prefix + "userType").ToLowerInvariant(), id = Arg(prefix + "userId");
                        if (Array.IndexOf(Platforms, platform) < 0 || id.Length == 0) continue;
                        people.Add(new JObject { ["key"] = platform + ":" + id, ["platform"] = platform, ["id"] = id, ["login"] = Arg(prefix + "userName").ToLowerInvariant(), ["name"] = Arg(prefix + "user") });
                    }
                }
                foreach (JObject who in people)
                {
                    JObject existing = ((JObject)state["users"])[(string)who["key"]] as JObject;
                    JObject row = existing == null ? NewUser(who, null) : (JObject)existing.DeepClone();
                    JObject old = (JObject)row.DeepClone();
                    JArray groups = (JArray)(row["eventGroups"] ?? row["groups"]).DeepClone();
                    string fromTier = Tier(groups); JArray beforeGroups = (JArray)groups.DeepClone();
                    if (operation == "added") { if (!Contains(groups, group)) groups.Add(group); }
                    else for (int i = groups.Count - 1; i >= 0; i--) if ((string)groups[i] == group) groups.RemoveAt(i);
                    row["eventGroups"] = groups; row["groups"] = groups.DeepClone(); row["tier"] = Tier(groups);
                    row["groupsAt"] = Now(); row["membershipFresh"] = true;
                    JObject entry = UserEvent("membership", old, row); entry["delta"] = null;
                    entry["beforeTier"] = fromTier; entry["beforeGroups"] = beforeGroups;
                    entry["group"] = group; entry["groupOperation"] = operation; entry["evidence"] = "native group event";
                    Commit(state, folder, entry);
                }
                state["lastGroupListenerAt"] = Now(); SaveOccasionally(state, folder);
            }
        }
        catch (Exception ex) { CaptureError(ex); }
        return true;
    }
    private static bool Contains(JArray array, string value) { for (int i = 0; i < array.Count; i++) if ((string)array[i] == value) return true; return false; }
    private static void EnsureMovementCounters(JObject row)
    {
        foreach (string field in new string[] { "capturedIn", "capturedOut", "earnedTracked", "upgradeSpent", "purchaseSpent", "fastTrackIn", "fastTrackOut", "otherOut", "otherIn", "unclassifiedIn", "unclassifiedOut", "movementCount" })
            if (row[field] == null) row[field] = 0;
        if (row["captureOpeningPoints"] == null) row["captureOpeningPoints"] = null;
    }
    private static void AddCounter(JObject row, string field, decimal delta) { row[field] = ((decimal?)row[field] ?? 0m) + delta; }
    private static void ApplyCategory(JObject row, string reason, decimal? delta, int sign)
    {
        EnsureMovementCounters(row); if (!delta.HasValue) return;
        decimal value = delta.Value;
        if (reason == "upgrade" && value < 0) AddCounter(row, "upgradeSpent", -value * sign);
        else if (reason == "membership_purchase" && value < 0) AddCounter(row, "purchaseSpent", -value * sign);
        else if (reason == "fast_track_credit" && value > 0) AddCounter(row, "fastTrackIn", value * sign);
        else if (reason == "fast_track_purchase" && value < 0) AddCounter(row, "fastTrackOut", -value * sign);
        else if (Array.IndexOf(new string[] { "reward", "referral", "welcome", "streak", "first_words" }, reason) >= 0 && value > 0) AddCounter(row, "earnedTracked", value * sign);
        else if (reason == "unclassified" || String.IsNullOrEmpty(reason)) AddCounter(row, value >= 0 ? "unclassifiedIn" : "unclassifiedOut", Math.Abs(value) * sign);
        else if (value < 0) AddCounter(row, "otherOut", -value * sign);
        else AddCounter(row, "otherIn", value * sign);
    }
    // v4.4: use equal numeric transitions and millisecond precision only.
    // Do not round nearby timestamps into a match or infer a reason from an amount.
    private static bool SplitEvent(string id, out string key, out string field, out long ticks, out decimal before, out decimal after)
    {
        key = field = ""; ticks = 0; before = after = 0;
        if (String.IsNullOrEmpty(id)) return false;
        string[] parts = id.Split('|');
        if (parts.Length != 5 || !Int64.TryParse(parts[2], out ticks) || ticks <= 621355968000000000L ||
            ticks > DateTime.MaxValue.Ticks || !Number(parts[3], out before) || !Number(parts[4], out after)) return false;
        key = parts[0]; field = parts[1]; return true;
    }
    private static bool SameTransition(string a, string b, out long ta, out long tb)
    {
        string ka, fa, kb, fb; decimal ba, aa, bb, ab;
        ta = tb = 0;
        return SplitEvent(a, out ka, out fa, out ta, out ba, out aa) && SplitEvent(b, out kb, out fb, out tb, out bb, out ab) &&
            ka == kb && fa == fb && ba == bb && aa == ab;
    }
    private static string EquivalentId(JObject records, string id)
    {
        if (records[id] != null) return id;
        string found = null; string prefix = id.Substring(0, id.IndexOf('|') + 1);
        foreach (JProperty candidate in records.Properties())
        {
            if (!candidate.Name.StartsWith(prefix, StringComparison.Ordinal)) continue;
            long a, b;
            if (!SameTransition(id, candidate.Name, out a, out b) || a / 10000L != b / 10000L || (a % 10000L != 0 && b % 10000L != 0)) continue;
            if (found != null) return null; // Ambiguous: never select the first candidate.
            found = candidate.Name;
        }
        return found;
    }
    private static bool NearbyTransition(JObject records, string id)
    {
        foreach (JProperty candidate in records.Properties())
        {
            long a, b;
            if (SameTransition(id, candidate.Name, out a, out b) && Math.Abs(a - b) <= TimeSpan.FromMinutes(1).Ticks) return true;
        }
        return false;
    }
    private static bool NearbyHook(JObject records, string id)
    {
        foreach (JProperty candidate in records.Properties())
        {
            string evidence = (string)candidate.Value["evidence"] ?? "native variable event";
            long a, b;
            if (evidence != "native variable event" && SameTransition(id, candidate.Name, out a, out b) && Math.Abs(a - b) <= TimeSpan.FromMinutes(1).Ticks) return true;
        }
        return false;
    }
    private static bool OtherWriteInWindow(JObject records, string id, long start, long end)
    {
        string key, field; long ticks; decimal before, after;
        if (!SplitEvent(id, out key, out field, out ticks, out before, out after)) return true;
        foreach (JProperty candidate in records.Properties())
        {
            if (!candidate.Name.StartsWith(key + "|", StringComparison.Ordinal)) continue;
            string ck, cf; long ct; decimal cb, ca;
            if (candidate.Name != id && SplitEvent(candidate.Name, out ck, out cf, out ct, out cb, out ca) &&
                ck == key && cf == field && ct >= start && ct <= end) return true;
        }
        return false;
    }
    private static bool StoreLabel(JObject state, string folder, JObject original, string key)
    {
        string sourceId = (string)original["eventId"];
        JObject labels = (JObject)state["movementLabels"], receipts = (JObject)state["movementReceipts"];
        string id = EquivalentId(receipts, sourceId) ?? sourceId;
        JObject label = (JObject)original.DeepClone(); label["eventId"] = id;
        if (sourceId != id) label["sourceEventId"] = sourceId;
        JObject previous = labels[id] as JObject;
        if (previous != null && (string)previous["reason"] != (string)label["reason"])
        { label["reason"] = "unclassified"; label["actionLabel"] = "Conflicting labels; review original actions"; }
        JObject receipt = receipts[id] as JObject;
        bool alreadyLinked = sourceId == id || (string)labels[sourceId]?["matchedEventId"] == id || (string)previous?["sourceEventId"] == sourceId;
        if (previous != null && (string)previous["reason"] == (string)label["reason"] && alreadyLinked &&
            (receipt == null || (string)receipt["reason"] == (string)label["reason"])) return false;
        JObject entry = new JObject { ["kind"] = "label", ["key"] = key, ["label"] = label };
        JObject current = ((JObject)state["users"])[key] as JObject;
        if (receipt != null && current != null)
        {
            JObject row = (JObject)current.DeepClone(); decimal delta;
            decimal? amount = Number(receipt["delta"], out delta) ? (decimal?)delta : null;
            ApplyCategory(row, (string)receipt["reason"], amount, -1); ApplyCategory(row, (string)label["reason"], amount, 1);
            entry["user"] = row;
        }
        Commit(state, folder, entry); return receipt != null;
    }
    private static bool RecordVerifiedWrite(JObject state, string folder, JObject label, string evidence, bool historical)
    {
        string id = (string)label["eventId"], key, field; long ticks; decimal before, after;
        if (!SplitEvent(id, out key, out field, out ticks, out before, out after) || before == after ||
            EquivalentId((JObject)state["movementReceipts"], id) != null) return false;
        JObject current = ((JObject)state["users"])[key] as JObject;
        if (current == null) return false; // A first-ever balance still needs its normal baseline.
        int p = PlatformIndex((string)current["platform"]);
        long happened = (ticks - 621355968000000000L) / 10000L;
        if (field != PointsFields[p] || (string)current["source"] != Signature(p) || happened < (long)state["movementStartedAt"] ||
            happened < ((long?)current["trackingStartedAt"] ?? 0L)) return false;
        JObject row = (JObject)current.DeepClone(); EnsureMovementCounters(row);
        decimal delta = after - before;
        AddCounter(row, "capturedIn", Math.Max(0, delta)); AddCounter(row, "capturedOut", Math.Max(0, -delta));
        row["movementCount"] = (long)row["movementCount"] + 1;
        JObject savedLabel = ((JObject)state["movementLabels"])[id] as JObject ?? label;
        ApplyCategory(row, (string)savedLabel["reason"], delta, 1);
        // Preserve the current balance, groups, opening balance and source timestamps.
        // Only the audit counters change, including when replaying old evidence.
        JObject entry = UserEvent("movement", current, row);
        entry["beforePoints"] = before; entry["afterPoints"] = after; entry["delta"] = delta;
        entry["eventId"] = id; entry["happenedAt"] = happened; entry["reason"] = savedLabel["reason"];
        entry["actionLabel"] = savedLabel["actionLabel"]; entry["transactionId"] = savedLabel["transactionId"];
        entry["evidence"] = evidence; entry["accountType"] = IsBucket((string)row["platform"], (string)row["login"]) ? "bucket" : "member";
        entry["labelSourceId"] = id;
        entry["note"] = historical ? "Audit recovered from a verified currency hook and matching saved snapshot. No points awarded." : "Stored balance change verified by the currency hook. Native delivery is deduplicated. No additional points awarded.";
        Commit(state, folder, entry); return true;
    }
    private static string SnapshotFingerprint(JObject entry)
    {
        JObject user = entry["user"] as JObject;
        decimal before, after; long ticks = (long?)user?["balanceWrittenTicks"] ?? 0L;
        if ((string)entry["kind"] != "update" || user == null || ticks == 0 ||
            !Number(entry["beforePoints"], out before) || !Number(entry["afterPoints"], out after) || before == after) return "";
        int p = Array.IndexOf(Platforms, (string)user["platform"]);
        if (p < 0 || (string)user["source"] != Signature(p)) return "";
        return Fingerprint((string)entry["key"], PointsFields[p], ticks, before, after);
    }
    private static void RepairSavedMovements(JObject state, string folder)
    {
        // Read the complete available journal before writing a single repair record.
        // Old files remain untouched. Receipts/labels are supplemented from history
        // because the checkpoint only retains the last 48 hours of these indexes.
        string[] files = Directory.GetFiles(folder, "ledger-*.jsonl"); Array.Sort(files, StringComparer.Ordinal);
        JObject movements = new JObject(), labels = new JObject(); var snapshots = new Dictionary<string, bool>();
        foreach (string file in files)
            foreach (string line in File.ReadLines(file, Encoding.UTF8))
            {
                if (String.IsNullOrWhiteSpace(line)) continue;
                JObject e = JObject.Parse(line); string kind = (string)e["kind"];
                if (kind == "movement")
                    movements[(string)e["eventId"]] = new JObject { ["at"] = e["at"], ["reason"] = e["reason"], ["delta"] = e["delta"], ["evidence"] = e["evidence"], ["happenedAt"] = e["happenedAt"] };
                else if (kind == "label")
                {
                    JObject label = (JObject)e["label"].DeepClone(); label["at"] = e["at"].DeepClone();
                    string id = (string)label["eventId"]; labels[id] = label;
                    if (movements[id] != null) movements[id]["reason"] = label["reason"].DeepClone();
                    string source = (string)label["sourceEventId"];
                    if (!String.IsNullOrEmpty(source) && labels[source] != null) labels[source]["matchedEventId"] = id;
                }
                string snapshot = SnapshotFingerprint(e); if (snapshot.Length > 0) snapshots[snapshot] = true;
            }
        // Preserve currently loaded receipts even if the user archived older journals.
        foreach (JProperty p in ((JObject)state["movementReceipts"]).Properties()) movements[p.Name] = p.Value.DeepClone();
        foreach (JProperty p in ((JObject)state["movementLabels"]).Properties())
            if (labels[p.Name] == null) labels[p.Name] = p.Value.DeepClone();
        string backup = Path.Combine(folder, "repair-backups", "movement-4.4-" + DateTime.UtcNow.ToString("yyyyMMdd-HHmmss-fff", CultureInfo.InvariantCulture) + "-" + Guid.NewGuid().ToString("N").Substring(0, 8));
        Directory.CreateDirectory(backup);
        File.Copy(Path.Combine(folder, "checkpoint.json"), Path.Combine(backup, "checkpoint.json"));
        foreach (string file in files) File.Copy(file, Path.Combine(backup, Path.GetFileName(file)));
        int relabelled = 0, recovered = 0, unresolved = 0, already = 0;
        decimal recoveredIn = 0, recoveredOut = 0;
        var ids = new List<string>(); foreach (JProperty p in labels.Properties()) ids.Add(p.Name);
        foreach (string id in ids)
        {
            JObject label = (JObject)labels[id]; string key, field; long ticks; decimal before, after;
            if (!SplitEvent(id, out key, out field, out ticks, out before, out after) || before == after) { unresolved++; continue; }
            if (label["matchedEventId"] != null) { already++; continue; }
            string matched = EquivalentId(movements, id);
            if (matched != null)
            {
                ((JObject)state["movementReceipts"])[matched] = movements[matched].DeepClone();
                if (StoreLabel(state, folder, label, key)) relabelled++; else already++;
                movements[matched] = ((JObject)state["movementReceipts"])[matched].DeepClone();
                continue;
            }
            // Recovery requires the identical stored timestamp and before/after values,
            // with no competing write or label for this account in a one-minute window.
            if ((string)label["reason"] == "unclassified" || !snapshots.ContainsKey(id) ||
                OtherWriteInWindow(movements, id, ticks - TimeSpan.FromMinutes(1).Ticks, ticks + TimeSpan.FromMinutes(1).Ticks) ||
                OtherWriteInWindow(labels, id, ticks - TimeSpan.FromMinutes(1).Ticks, ticks + TimeSpan.FromMinutes(1).Ticks))
            { unresolved++; continue; }
            ((JObject)state["movementLabels"])[id] = label.DeepClone();
            if (RecordVerifiedWrite(state, folder, label, "verified hook + saved snapshot", true))
            {
                recovered++; recoveredIn += Math.Max(0, after - before); recoveredOut += Math.Max(0, before - after);
                movements[id] = ((JObject)state["movementReceipts"])[id].DeepClone();
            }
            else unresolved++;
        }
        JObject report = new JObject { ["at"] = Now(), ["relabelled"] = relabelled, ["recovered"] = recovered, ["unresolved"] = unresolved,
            ["alreadyProcessed"] = already, ["recoveredIn"] = recoveredIn, ["recoveredOut"] = recoveredOut, ["backupFolder"] = backup,
            ["note"] = "Audit history only. Current points, tiers, bucket balances and reward rules were not changed. Unresolved records remain for review." };
        Commit(state, folder, new JObject { ["kind"] = "repair_summary", ["key"] = "ledger:repair", ["name"] = "Movement audit repair", ["report"] = report });
        Save(state, folder);
    }

    private static string Fingerprint(string key, string field, long ticks, decimal? before, decimal? after)
    { return key + "|" + field + "|" + ticks.ToString(CultureInfo.InvariantCulture) + "|" + (before.HasValue ? before.Value.ToString("G29", CultureInfo.InvariantCulture) : "?") + "|" + (after.HasValue ? after.Value.ToString("G29", CultureInfo.InvariantCulture) : "?"); }
    private static long WrittenTicks(object raw)
    {
        if (raw == null) return 0;
        if (raw is DateTime) return ((DateTime)raw).ToUniversalTime().Ticks;
        if (raw is DateTimeOffset) return ((DateTimeOffset)raw).UtcDateTime.Ticks;
        JValue token = raw as JValue; if (token != null) return WrittenTicks(token.Value);
        DateTime value; return DateTime.TryParse(Convert.ToString(raw, CultureInfo.InvariantCulture), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out value) ? value.ToUniversalTime().Ticks : 0;
    }
    private object Raw(string key) { object value; return CPH.TryGetArg<object>(key, out value) ? value : null; }
    private void CaptureError(Exception ex)
    {
        CPH.LogError("[Voyager Points] Capture failed: " + ex.Message);
        LastCaptureError = ex.Message; LastCaptureErrorAt = Now();
    }
    private static void SaveOccasionally(JObject state, string folder) { if (Now() - LastCheckpointAt >= 5000L) Save(state, folder); }
    private static JArray RecentView(JArray recent)
    { var result = new JArray(); foreach (JObject e in recent) if ((string)e["kind"] != "label" && (string)e["kind"] != "capture_confirmation") result.Add(e.DeepClone()); return result; }
    private static void Decorate(JObject movement, JObject label)
    { movement["reason"] = label["reason"].DeepClone(); movement["actionLabel"] = label["actionLabel"].DeepClone(); movement["transactionId"] = label["transactionId"].DeepClone(); }

    private void Scan(JObject state, string folder)
    {
        long now = Now(); var issues = new JArray(); var samples = new JObject();
        string configured = CPH.GetGlobalVar<string>("sup_Currency_Core_Var", true);
        if (!String.IsNullOrEmpty(configured))
            for (int p = 0; p < 3; p++) if (configured != PointsFields[p]) { issues.Add("StreamUP uses '" + configured + "' but the ledger uses '" + PointsFields[p] + "' for " + Platforms[p] + ". Align sources in the C# configuration before relying on coverage."); break; }
        bool[] balanceOK = new bool[3]; bool[] earnedOK = new bool[3]; bool[] spentOK = new bool[3];
        for (int p = 0; p < Platforms.Length; p++)
        {
            string[] fields = { PointsFields[p], LifetimeEarnedFields[p], LifetimeUpgradeSpentFields[p] };
            string[] columns = { "points", "earned", "spent" };
            for (int f = 0; f < fields.Length; f++)
            {
                if (String.IsNullOrWhiteSpace(fields[f])) continue;
                try
                {
                    JObject values = ReadField(p, fields[f]);
                    foreach (JProperty property in values.Properties())
                    {
                        JObject incoming = (JObject)property.Value, target = samples[property.Name] as JObject;
                        if (target == null) { target = Identity(incoming); samples[property.Name] = target; }
                        target[columns[f]] = incoming["points"].DeepClone();
                        if (f == 0) target["writtenTicks"] = incoming["writtenTicks"].DeepClone();
                    }
                    if (f == 0) balanceOK[p] = true; else if (f == 1) earnedOK[p] = true; else spentOK[p] = true;
                }
                catch (Exception ex) { issues.Add(Platforms[p] + " / " + fields[f] + ": " + ex.Message); }
            }
        }
        bool groupsOK = true;
        for (int g = 0; g < GroupNames.Length; g++)
        {
            if (String.IsNullOrWhiteSpace(GroupNames[g])) continue;
            try
            {
                if (!CPH.GroupExists(GroupNames[g])) throw new Exception("Group not found: " + GroupNames[g]);
                var members = CPH.UsersInGroup(GroupNames[g]);
                if (members == null) throw new Exception("Group could not be read: " + GroupNames[g]);
                foreach (var member in members)
                {
                    string platform = (member.Type ?? "").Trim().ToLowerInvariant(), id = member.Id ?? "", login = (member.Login ?? "").ToLowerInvariant();
                    if (Array.IndexOf(Platforms, platform) < 0 || id.Length == 0) continue;
                    string key = platform + ":" + id;
                    JObject row = samples[key] as JObject;
                    if (row == null) { row = new JObject { ["key"] = key, ["id"] = id, ["login"] = login, ["name"] = member.Username ?? login, ["platform"] = platform }; samples[key] = row; }
                    if (row["groups"] == null) row["groups"] = new JArray();
                    ((JArray)row["groups"]).Add(GroupKeys[g]);
                }
            }
            catch (Exception ex) { groupsOK = false; issues.Add(ex.Message); }
        }
        // Keep known users even if a variable is removed; never turn missing points into zero.
        JObject users = (JObject)state["users"];
        foreach (JProperty property in users.Properties())
            if (samples[property.Name] == null) samples[property.Name] = Identity((JObject)property.Value);
        foreach (JProperty property in samples.Properties())
        {
            JObject sample = (JObject)property.Value;
            
            int p = PlatformIndex((string)sample["platform"]);
            JObject previous = users[property.Name] as JObject;
            decimal starting; bool numeric = Number(sample["points"], out starting);
            JObject row = previous == null ? NewUser(sample, numeric ? (decimal?)starting : null) : (JObject)previous.DeepClone();
            JObject old = previous == null ? null : (JObject)previous.DeepClone();
            row["name"] = sample["name"].DeepClone(); row["login"] = sample["login"].DeepClone();
            bool sourceChanged = (string)row["source"] != Signature(p);
            if (sourceChanged) ResetBalanceTracking(row, numeric ? (decimal?)starting : null, Signature(p));
            if (balanceOK[p])
            {
                if (numeric) ObservePoints(row, starting); else row["points"] = null;
                row["balanceWrittenTicks"] = sample["writtenTicks"] == null ? 0L : (long)sample["writtenTicks"];
                row["pointsAt"] = now;
            }
            else if (PointsFields[p].Length == 0) { row["points"] = null; row["pointsAt"] = 0; }
            row["pointsFresh"] = balanceOK[p];
            if (earnedOK[p]) row["earned"] = sample["earned"] == null ? null : sample["earned"].DeepClone();
            else if (LifetimeEarnedFields[p].Length == 0) row["earned"] = null;
            if (spentOK[p]) row["spent"] = sample["spent"] == null ? null : sample["spent"].DeepClone();
            else if (LifetimeUpgradeSpentFields[p].Length == 0) row["spent"] = null;
            row["earnedFresh"] = earnedOK[p]; row["spentFresh"] = spentOK[p];
            if (groupsOK) { row["groups"] = sample["groups"] == null ? new JArray() : sample["groups"].DeepClone(); row["tier"] = Tier((JArray)row["groups"]); row["groupsAt"] = now; }
            row["membershipFresh"] = groupsOK; row["seenAt"] = now;
            if (row["eventGroups"] == null && groupsOK) row["eventGroups"] = row["groups"].DeepClone();
            EnsureMovementCounters(row);
            if (numeric && (long)row["movementCount"] == 0 && (row["captureOpeningPoints"] == null || row["captureOpeningPoints"].Type == JTokenType.Null)) row["captureOpeningPoints"] = starting;
            // Record only meaningful value/status changes, not every refresh timestamp.
            if (old == null || sourceChanged || Changed(old, row))
            {
                JObject entry = UserEvent(old == null ? "baseline" : sourceChanged ? "source" : "update", old, row);
                entry["evidence"] = "snapshot reconciliation";
                entry["accountType"] = IsBucket((string)row["platform"], (string)row["login"]) ? "bucket" : "member";
                entry["note"] = "Snapshot only; not added to captured credits or debits. Check native capture if movements are missing.";
                Commit(state, folder, entry);
            }
            else users[property.Name] = row;
        }
        var buckets = new JObject();
        for (int b = 0; b < BucketKeys.Length; b++)
        {
            var bucket = new JObject { ["key"] = BucketKeys[b], ["login"] = BucketLogins[b], ["target"] = BucketTargets[b], ["points"] = null, ["at"] = now };
            try
            {
                decimal value;
                if (!Number(CPH.GetTwitchUserVar<object>(BucketLogins[b], BucketPointsField, Persisted), out value)) throw new Exception("Points not found or not numeric.");
                bucket["points"] = value;
            }
            catch (Exception ex) { bucket["error"] = ex.Message; issues.Add(BucketLogins[b] + ": " + ex.Message); }
            JObject old = ((JObject)state["buckets"])[BucketKeys[b]] as JObject;
            if (old == null || !JToken.DeepEquals(old["points"], bucket["points"]) || !JToken.DeepEquals(old["target"], bucket["target"]) || (string)old["login"] != BucketLogins[b])
                Commit(state, folder, new JObject { ["kind"] = "bucket", ["key"] = "bucket:" + BucketKeys[b], ["name"] = BucketLogins[b], ["before"] = old == null ? null : old.DeepClone(), ["bucket"] = bucket });
            foreach (JProperty prop in users.Properties())
            {
                JObject u = (JObject)prop.Value;
                if ((string)u["platform"] == "twitch" && String.Equals((string)u["login"], BucketLogins[b], StringComparison.OrdinalIgnoreCase))
                { bucket["userKey"] = u["key"].DeepClone(); bucket["capturedIn"] = u["capturedIn"].DeepClone(); bucket["capturedOut"] = u["capturedOut"].DeepClone(); break; }
            }
            buckets[BucketKeys[b]] = bucket;
        }
        state["buckets"] = buckets; state["issues"] = issues; state["lastScanAt"] = now;
        Save(state, folder);
    }
    private JObject ReadField(int p, string field)
    {
        if (String.IsNullOrWhiteSpace(field)) throw new Exception("Points variable not configured for " + Platforms[p]);
        object records;
        if (p == 0) records = CPH.GetTwitchUsersVar<object>(field, Persisted);
        else if (p == 1) records = CPH.GetYouTubeUsersVar<object>(field, Persisted);
        else records = CPH.GetKickUsersVar<object>(field, Persisted);
        if (records == null) throw new Exception("User records could not be read.");
        JArray list = JArray.FromObject(records); JObject result = new JObject();
        for (int i = 0; i < list.Count; i++)
        {
            JToken item = list[i]; string id = (string)item["UserId"] ?? "";
            if (id.Length == 0) continue; // Stable platform IDs prevent renames splitting history.
            decimal points; bool valid = Number(item["Value"], out points);
            string login = ((string)item["UserLogin"] ?? "").ToLowerInvariant();
            string key = Platforms[p] + ":" + id;
            result[key] = new JObject { ["key"] = key, ["id"] = id, ["platform"] = Platforms[p], ["login"] = login, ["name"] = (string)item["UserName"] ?? login, ["points"] = valid ? new JValue(points) : JValue.CreateNull(), ["writtenTicks"] = WrittenTicks(item["LastWrite"]) };
        }
        return result;
    }
    private static JObject Identity(JObject x) { return new JObject { ["key"] = x["key"].DeepClone(), ["id"] = x["id"].DeepClone(), ["platform"] = x["platform"].DeepClone(), ["login"] = x["login"].DeepClone(), ["name"] = x["name"].DeepClone() }; }
    private static JObject NewUser(JObject who, decimal? starting)
    {
        JObject row = Identity(who); row["groups"] = new JArray(); row["tier"] = "unknown";
        EnsureMovementCounters(row);
        row["earned"] = null; row["spent"] = null; row["firstSeenAt"] = Now(); row["groupsAt"] = 0;
        ResetBalanceTracking(row, starting, Signature(PlatformIndex((string)who["platform"])));
        return row;
    }
    private static void ResetBalanceTracking(JObject row, decimal? starting, string source)
    {
        row["source"] = source; row["points"] = starting.HasValue ? new JValue(starting.Value) : JValue.CreateNull();
        row["openingPoints"] = row["points"].DeepClone(); row["observedIncreases"] = 0; row["observedDecreases"] = 0;
        row["upgradeTracked"] = 0; row["upgradeCount"] = 0; row["trackingStartedAt"] = Now(); row["pointsAt"] = 0;
    }
    private static void ObservePoints(JObject row, decimal value)
    {
        decimal before;
        if (Number(row["points"], out before))
        {
            decimal delta = value - before;
            if (delta > 0) row["observedIncreases"] = (decimal)row["observedIncreases"] + delta;
            else if (delta < 0) row["observedDecreases"] = (decimal)row["observedDecreases"] - delta;
        }
        else if (row["openingPoints"].Type == JTokenType.Null) row["openingPoints"] = value;
        row["points"] = value; row["pointsAt"] = Now(); row["pointsFresh"] = true;
    }
    private static string Tier(JArray groups)
    {
        string tier = "none"; string[] core = { "blue", "silver", "gold", "platinum" };
        for (int t = 0; t < core.Length; t++) for (int i = 0; i < groups.Count; i++) if ((string)groups[i] == core[t]) tier = core[t];
        return tier;
    }
    private static bool Changed(JObject before, JObject after)
    {
        string[] fields = { "points", "groups", "earned", "spent", "name", "login", "pointsFresh", "membershipFresh", "earnedFresh", "spentFresh" };
        foreach (string field in fields) if (!JToken.DeepEquals(before[field], after[field])) return true;
        return false;
    }
    private static JObject UserEvent(string kind, JObject before, JObject row)
    {
        decimal from, to;
        return new JObject { ["kind"] = kind, ["key"] = row["key"].DeepClone(), ["name"] = row["name"].DeepClone(), ["platform"] = row["platform"].DeepClone(),
            ["beforePoints"] = before == null ? null : before["points"].DeepClone(), ["afterPoints"] = row["points"].DeepClone(),
            ["delta"] = before != null && Number(before["points"], out from) && Number(row["points"], out to) ? new JValue(to - from) : JValue.CreateNull(),
            ["beforeTier"] = before == null ? "unknown" : (string)before["tier"], ["afterTier"] = (string)row["tier"],
            ["beforeGroups"] = before == null ? new JArray() : before["groups"].DeepClone(), ["afterGroups"] = row["groups"].DeepClone(), ["user"] = row };
    }
    private JObject ActingUser()
    {
        string platform = Arg("voyagerAuditPlatform"); if (platform.Length == 0) platform = Arg("userType"); platform = platform.ToLowerInvariant();
        int p = PlatformIndex(platform); string id = Arg("voyagerAuditUserId"); if (id.Length == 0) id = Arg("userId");
        if (id.Length == 0) throw new Exception("No target userId in the action arguments.");
        string login = Arg("voyagerAuditUserLogin"); if (login.Length == 0) login = Arg("userName");
        string name = Arg("user"); if (name.Length == 0) name = login;
        if (IsBucket(platform, login)) throw new Exception("Bucket accounts are excluded from member upgrade spending.");
        return new JObject { ["key"] = platform + ":" + id, ["id"] = id, ["platform"] = platform, ["login"] = login.ToLowerInvariant(), ["name"] = name };
    }
    private static int PlatformIndex(string p) { int i = Array.IndexOf(Platforms, p); if (i < 0) throw new Exception("Unknown platform. Supply userType or voyagerAuditPlatform: twitch, youtube or kick."); return i; }
    private bool UpgradeInProgress()
    {
        string raw = CPH.GetGlobalVar<string>("mda009_voyager_upgrade_gate", false);
        if (String.IsNullOrWhiteSpace(raw)) return false;
        return (bool?)JObject.Parse(raw)["busy"] == true;
    }
    private static string Signature(int p) { return Platforms[p] + ":" + PointsFields[p] + ":" + Persisted; }
    private static bool IsBucket(string platform, string login) { if (platform != "twitch") return false; foreach (string b in BucketLogins) if (String.Equals(b, login, StringComparison.OrdinalIgnoreCase)) return true; return false; }
    private static void ValidateSettings()
    {
        if (PointsFields.Length != 3 || LifetimeEarnedFields.Length != 3 || LifetimeUpgradeSpentFields.Length != 3) throw new Exception("Each source array needs Twitch, YouTube and Kick entries, in that order.");
        if (GroupNames.Length != GroupKeys.Length || BucketKeys.Length != BucketLogins.Length || BucketKeys.Length != BucketTargets.Length) throw new Exception("Keep each group or bucket configuration array the same length as its matching arrays.");
        for (int i = 0; i < BucketKeys.Length; i++)
            if (Array.IndexOf(BucketKeys, BucketKeys[i]) != i || String.IsNullOrWhiteSpace(BucketLogins[i]) || BucketTargets[i] <= 0) throw new Exception("Each bucket needs a unique key, an account login and a positive target.");
    }

    private static string Folder()
    {
        string root = DataFolderOverride.Length > 0 ? DataFolderOverride : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "MDA009", "VoyagerPoints");
        if (!Path.IsPathRooted(root)) throw new Exception("Set an absolute ledger folder in DataFolderOverride.");
        Directory.CreateDirectory(root); return root;
    }
    private static JObject Load(string folder)
    {
        if (CachedState != null && CachedFolder == folder) return CachedState;
        string path = Path.Combine(folder, "checkpoint.json");
        JObject state = File.Exists(path) ? JObject.Parse(File.ReadAllText(path, Encoding.UTF8)) : new JObject { ["schema"] = 1, ["seq"] = 0L, ["createdAt"] = Now(), ["lastScanAt"] = 0L, ["users"] = new JObject(), ["buckets"] = new JObject(), ["receipts"] = new JObject(), ["recent"] = new JArray(), ["issues"] = new JArray(), ["journalFile"] = "" };
        if ((int?)state["schema"] != 1 || !(state["users"] is JObject) || !(state["recent"] is JArray)) throw new Exception("Ledger checkpoint is invalid. Keep the files and restore a backup; do not reset it.");
        if (state["movementStartedAt"] == null) state["movementStartedAt"] = Now() - 60000L;
        foreach (string key in new string[] { "movementReceipts", "movementLabels" }) if (state[key] == null) state[key] = new JObject();
        foreach (JProperty prop in ((JObject)state["users"]).Properties()) EnsureMovementCounters((JObject)prop.Value);
        string[] files = Directory.GetFiles(folder, "ledger-*.jsonl"); Array.Sort(files, StringComparer.Ordinal);
        foreach (string file in files)
        {
            if (String.CompareOrdinal(Path.GetFileName(file), (string)state["journalFile"]) < 0) continue;
            string name = Path.GetFileName(file);
            long offset = name == (string)state["journalFile"] ? ((long?)state["journalOffset"] ?? 0L) : 0L;
            using (var stream = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                if (offset < 0 || offset > stream.Length) throw new Exception("Ledger journal was shortened. Restore the complete ledger folder.");
                stream.Seek(offset, SeekOrigin.Begin);
                using (var reader = new StreamReader(stream, Encoding.UTF8))
                {
                    string line;
                    while ((line = reader.ReadLine()) != null)
                    {
                        if (String.IsNullOrWhiteSpace(line)) continue;
                        JObject entry = JObject.Parse(line);
                        if ((long)entry["seq"] <= (long)state["seq"]) continue;
                        if ((long)entry["seq"] != (long)state["seq"] + 1) throw new Exception("Gap in ledger history. Restore the complete ledger folder.");
                        Apply(state, entry);
                    }
                    state["journalOffset"] = stream.Length;
                    state["journalFile"] = name;
                }
            }
        }
        var expired = new List<string>();
        foreach (JProperty receipt in ((JObject)state["receipts"]).Properties()) if (Now() - (long)receipt.Value > 86400000L) expired.Add(receipt.Name);
        foreach (string id in expired) ((JObject)state["receipts"]).Remove(id);
        CachedState = state; CachedFolder = folder; return state;
    }
    private static void Commit(JObject state, string folder, JObject entry)
    {
        entry["seq"] = (long)state["seq"] + 1L; entry["at"] = Now();
        string name = "ledger-" + DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) + ".jsonl";
        byte[] bytes = new UTF8Encoding(false).GetBytes(entry.ToString(Formatting.None) + "\n");
        long offset;
        using (var stream = new FileStream(Path.Combine(folder, name), FileMode.Append, FileAccess.Write, FileShare.Read)) { stream.Write(bytes, 0, bytes.Length); stream.Flush(true); offset = stream.Length; }
        Apply(state, entry); state["journalFile"] = name;
        state["journalOffset"] = offset;
    }
    private static void Apply(JObject state, JObject entry)
    {
        if (entry["user"] is JObject) ((JObject)state["users"])[(string)entry["key"]] = entry["user"].DeepClone();
        if (entry["bucket"] is JObject) ((JObject)state["buckets"])[(string)entry["bucket"]["key"]] = entry["bucket"].DeepClone();
        if (entry["auditId"] != null) ((JObject)state["receipts"])[(string)entry["auditId"]] = entry["at"].DeepClone();
        if ((string)entry["kind"] == "membership") state["lastGroupListenerAt"] = entry["at"].DeepClone();
        if ((string)entry["kind"] == "movement")
        {
            ((JObject)state["movementReceipts"])[(string)entry["eventId"]] = new JObject { ["at"] = entry["at"], ["reason"] = entry["reason"], ["delta"] = entry["delta"], ["evidence"] = entry["evidence"], ["happenedAt"] = entry["happenedAt"] };
            state["lastMovementAt"] = entry["at"].DeepClone();
            if ((string)entry["evidence"] == "native variable event") state["lastMovementListenerAt"] = entry["at"].DeepClone();
            else { state["verifiedHookCount"] = ((long?)state["verifiedHookCount"] ?? 0L) + 1; if ((string)entry["evidence"] == "verified currency hook") state["lastVerifiedHookAt"] = entry["at"].DeepClone(); }
            string sourceId = (string)entry["labelSourceId"];
            if (!String.IsNullOrEmpty(sourceId) && ((JObject)state["movementLabels"])[sourceId] is JObject)
                ((JObject)state["movementLabels"])[sourceId]["matchedEventId"] = entry["eventId"].DeepClone();
            state["capturedEventCount"] = ((long?)state["capturedEventCount"] ?? 0L) + 1;
        }
        if ((string)entry["kind"] == "label")
        {
            JObject label = (JObject)entry["label"].DeepClone(); label["at"] = entry["at"].DeepClone();
            string eventId = (string)label["eventId"]; ((JObject)state["movementLabels"])[eventId] = label;
            state["lastLabelAt"] = entry["at"].DeepClone();
            string sourceId = (string)label["sourceEventId"];
            if (!String.IsNullOrEmpty(sourceId) && sourceId != eventId && ((JObject)state["movementLabels"])[sourceId] is JObject)
                ((JObject)state["movementLabels"])[sourceId]["matchedEventId"] = eventId;
            JObject receipt = ((JObject)state["movementReceipts"])[eventId] as JObject;
            if (receipt != null) receipt["reason"] = label["reason"].DeepClone();
            foreach (JObject e in (JArray)state["recent"]) if ((string)e["eventId"] == eventId) Decorate(e, label);
        }
        if ((string)entry["kind"] == "capture_confirmation")
        {
            JObject receipt = ((JObject)state["movementReceipts"])[(string)entry["eventId"]] as JObject;
            if (receipt != null) receipt["nativeEventId"] = entry["nativeEventId"].DeepClone();
            state["lastMovementListenerAt"] = entry["at"].DeepClone();
        }
        if ((string)entry["kind"] == "capture_review") state["captureReviewCount"] = ((long?)state["captureReviewCount"] ?? 0L) + 1;
        if ((string)entry["kind"] == "repair_summary") state["lastRepair"] = entry["report"].DeepClone();
        JArray recent = (JArray)state["recent"]; JObject summary = (JObject)entry.DeepClone(); summary.Remove("user"); recent.Add(summary);
        while (recent.Count > 300) recent.RemoveAt(0);
        state["seq"] = entry["seq"].DeepClone();
    }
    private static void Save(JObject state, string folder)
    {
        foreach (string key in new string[] { "movementReceipts", "movementLabels" })
        {
            var expired = new List<string>();
            foreach (JProperty prop in ((JObject)state[key]).Properties()) if (Now() - ((long?)prop.Value["at"] ?? Now()) > 172800000L) expired.Add(prop.Name);
            foreach (string id in expired) ((JObject)state[key]).Remove(id);
        }
        string path = Path.Combine(folder, "checkpoint.json"), temporary = Path.Combine(folder, "checkpoint.tmp"), backup = Path.Combine(folder, "checkpoint.previous.json");
        byte[] bytes = new UTF8Encoding(false).GetBytes(state.ToString(Formatting.None));
        using (var stream = new FileStream(temporary, FileMode.Create, FileAccess.Write, FileShare.None)) { stream.Write(bytes, 0, bytes.Length); stream.Flush(true); }
        if (File.Exists(path)) File.Replace(temporary, path, backup); else File.Move(temporary, path);
        LastCheckpointAt = Now();
    }
    private static JObject Snapshot(JObject state, string folder)
    {
        JArray users = new JArray();
        foreach (JProperty p in ((JObject)state["users"]).Properties())
            if (!IsBucket((string)p.Value["platform"], (string)p.Value["login"]))
            {
                JObject row = (JObject)p.Value.DeepClone(); decimal balance, opening;
                row["captureGap"] = Number(row["points"], out balance) && Number(row["captureOpeningPoints"], out opening) ? new JValue(balance - opening - ((decimal?)row["capturedIn"] ?? 0m) + ((decimal?)row["capturedOut"] ?? 0m)) : JValue.CreateNull();
                users.Add(row);
            }
        int pendingLabels = 0;
        foreach (JProperty label in ((JObject)state["movementLabels"]).Properties()) if (label.Value["matchedEventId"] == null && EquivalentId((JObject)state["movementReceipts"], label.Name) == null) pendingLabels++;
        var sources = new JObject();
        for (int p = 0; p < Platforms.Length; p++) sources[Platforms[p]] = new JObject { ["points"] = PointsFields[p], ["earned"] = LifetimeEarnedFields[p], ["spent"] = LifetimeUpgradeSpentFields[p], ["persisted"] = Persisted };
        return new JObject { ["ok"] = true, ["operation"] = "snapshot", ["serverAt"] = Now(), ["lastScanAt"] = state["lastScanAt"].DeepClone(), ["createdAt"] = state["createdAt"].DeepClone(), ["seq"] = state["seq"].DeepClone(), ["users"] = users, ["buckets"] = state["buckets"].DeepClone(), ["recent"] = RecentView((JArray)state["recent"]),
            ["ledgerVersion"] = 4, ["movementTrackingVersion"] = "4.4.1", ["repairAvailable"] = true, ["lastRepair"] = state["lastRepair"] == null ? null : state["lastRepair"].DeepClone(), ["verifiedHookCount"] = (long?)state["verifiedHookCount"] ?? 0L, ["lastVerifiedHookAt"] = (long?)state["lastVerifiedHookAt"] ?? 0L, ["lastLabelAt"] = (long?)state["lastLabelAt"] ?? 0L, ["captureReviewCount"] = (long?)state["captureReviewCount"] ?? 0L, ["adminVersion"] = 1, ["bucketAdminVersion"] = 1, ["pendingLabels"] = pendingLabels, ["movementStartedAt"] = state["movementStartedAt"].DeepClone(), ["lastMovementAt"] = (long?)state["lastMovementAt"] ?? 0L, ["lastMovementListenerAt"] = (long?)state["lastMovementListenerAt"] ?? 0L, ["lastGroupListenerAt"] = (long?)state["lastGroupListenerAt"] ?? 0L, ["capturedEventCount"] = (long?)state["capturedEventCount"] ?? 0L, ["captureError"] = LastCaptureError, ["captureErrorAt"] = LastCaptureErrorAt, ["issues"] = state["issues"].DeepClone(), ["sources"] = sources, ["folder"] = folder };
    }
    private JObject History(string folder, string userKey, string cursor, string requestedLimit)
    {
        long before; if (!Int64.TryParse(cursor, out before) || before <= 0) before = Int64.MaxValue;
        int limit; if (!Int32.TryParse(requestedLimit, out limit)) limit = 100;
        limit = Math.Max(1, Math.Min(2000, limit));
        string[] files = Directory.GetFiles(folder, "ledger-*.jsonl"); Array.Sort(files, StringComparer.Ordinal); Array.Reverse(files);
        JArray result = new JArray(); bool more = false; var labels = new JObject();
        foreach (string file in files)
        {
            string[] lines = File.ReadAllLines(file, Encoding.UTF8);
            for (int i = lines.Length - 1; i >= 0; i--)
            {
                if (String.IsNullOrWhiteSpace(lines[i])) continue; JObject e = JObject.Parse(lines[i]);
                if ((string)e["kind"] == "capture_confirmation") continue;
                if ((string)e["kind"] == "label") { JObject label = (JObject)e["label"]; if (labels[(string)label["eventId"]] == null) labels[(string)label["eventId"]] = label.DeepClone(); continue; }
                if (e["eventId"] != null && labels[(string)e["eventId"]] is JObject) Decorate(e, (JObject)labels[(string)e["eventId"]]);
                if ((long)e["seq"] >= before || (userKey.Length > 0 && (string)e["key"] != userKey)) continue;
                if (!HistoryMatches(e)) continue;
                if (result.Count >= limit) { more = true; break; }
                e.Remove("user"); result.Add(e);
            }
            if (more) break;
        }
        return new JObject { ["ok"] = true, ["operation"] = "history", ["entries"] = result, ["hasMore"] = more, ["nextBefore"] = result.Count > 0 ? (long)result[result.Count - 1]["seq"] : 0L };
    }
    private bool HistoryMatches(JObject e)
    {
        long from, to, time = (long?)e["happenedAt"] ?? (long)e["at"];
        if (Int64.TryParse(Arg("pointsFrom"), out from) && time < from) return false;
        if (Int64.TryParse(Arg("pointsTo"), out to) && time > to) return false;
        string platform = Arg("pointsPlatform"); if (platform.Length > 0 && platform != "all" && (string)e["platform"] != platform) return false;
        string query = Arg("pointsQuery").Trim();
        if (query.Length > 0)
        {
            bool found = false;
            foreach (string field in new string[] { "name", "key", "actionLabel", "transactionId", "note" })
                if (((string)e[field] ?? "").IndexOf(query, StringComparison.OrdinalIgnoreCase) >= 0) found = true;
            if (!found) return false;
        }
        string filter = Arg("pointsKind"), kind = (string)e["kind"];
        if (filter == "" || filter == "all") return true;
        if (filter == "admin") return kind == "admin";
        if (filter == "movement") return kind == "movement";
        if (filter == "tier") return kind == "membership" || (kind != "baseline" && e["beforeTier"] != null && (string)e["beforeTier"] != (string)e["afterTier"]);
        if (filter == "upgrade") return kind == "movement" && (string)e["reason"] == "upgrade";
        if (filter == "unclassified") return kind == "movement" && (string)e["reason"] == "unclassified";
        if (filter == "in") return kind == "movement" && ((decimal?)e["delta"] ?? 0m) > 0;
        if (filter == "out") return kind == "movement" && ((decimal?)e["delta"] ?? 0m) < 0;
        if (filter == "bucket") return kind == "bucket" || (string)e["accountType"] == "bucket";
        if (filter == "snapshot") return kind == "baseline" || kind == "source" || kind == "update";
        return false;
    }
    private void Broadcast(JObject packet, string requestId) { packet["type"] = "voyager.points.v1"; packet["schema"] = 1; packet["requestId"] = requestId; CPH.WebsocketBroadcastJson(packet.ToString(Formatting.None)); }
    private string Arg(string key) { object raw; return CPH.TryGetArg<object>(key, out raw) && raw != null ? Convert.ToString(raw, CultureInfo.InvariantCulture) : ""; }
    private static bool Number(object raw, out decimal value)
    {
        value = 0; if (raw == null || raw is bool) return false;
        JToken token = raw as JToken; if (token != null && token.Type != JTokenType.Integer && token.Type != JTokenType.Float && token.Type != JTokenType.String) return false;
        return Decimal.TryParse(Convert.ToString(raw, CultureInfo.InvariantCulture), NumberStyles.Float, CultureInfo.InvariantCulture, out value) && value >= -9007199254740991m && value <= 9007199254740991m;
    }
    private static long Now() { return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(); }
}
// End of Voyager Points Ledger v4.4.1.

// End of Voyager Points Ledger v4.4.1.
