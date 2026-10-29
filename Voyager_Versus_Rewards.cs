// v2.5 delivery repair; existing v2 payment receipts are retained.
// Streamer.bot action: Voyager Versus Rewards v2.5
// One Execute C# Code sub-action, dedicated BLOCKING queue, no chat trigger.
// Credits the existing persisted Twitch user variable "points". Not Twitch Channel Points.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    private static readonly object Gate = new object();
    private const string PointsField = "points";
    private const long MaxPoints = 9007199254740991L;
    private string Arg(string name) { object value; return CPH.TryGetArg<object>(name, out value) && value != null ? Convert.ToString(value, CultureInfo.InvariantCulture) : ""; }
    private static bool Uuid(string s) { return Regex.IsMatch(s ?? "", @"^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$"); }
    private static string Hash(string text) { using (var sha = SHA256.Create()) return BitConverter.ToString(sha.ComputeHash(Encoding.UTF8.GetBytes(text))).Replace("-", "").ToLowerInvariant(); }
    private static long Now() { return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(); }
    private string ReadGlobal(string key) { return CPH.GetGlobalVar<string>(key, true) ?? ""; }
    private long Balance(string userId)
    {
        object raw = CPH.GetTwitchUserVarById<object>(userId, PointsField, true);
        if (raw == null) return 0;
        decimal n;
        if (!Decimal.TryParse(Convert.ToString(raw, CultureInfo.InvariantCulture), NumberStyles.Number, CultureInfo.InvariantCulture, out n) || n != Decimal.Truncate(n) || n < 0 || n > MaxPoints)
            throw new Exception("The saved points balance is not a supported non-negative whole number. Nothing was changed.");
        return (long)n;
    }
    public bool Execute()
    {
        if (Arg("vvOperation") == "available") return AnnounceAvailable();
        if (Arg("vvOperation") == "chat") return AnnounceMatch();
        string request = Arg("vvRequestId"), client = Arg("vvClientId");
        if (!Uuid(request) || !Uuid(client)) { CPH.LogError("Voyager Versus v2: missing request/client IDs. Update the local host as well as this action."); return false; }
        JObject answer;
        try
        {
            lock (Gate)
            {
                string op = Arg("vvOperation");
                if (op == "health") answer = new JObject { ["ok"] = true, ["protocol"] = 2, ["field"] = PointsField, ["persisted"] = true, ["chatProtocol"] = 1, ["codeVersion"] = "2.5.0" };
                else if (op == "inspect" || op == "pay") answer = Reward(op == "pay");
                else throw new Exception("Unknown reward operation.");
            }
        }
        catch (Exception e) { answer = new JObject { ["ok"] = false, ["status"] = "review", ["reason"] = e.Message }; CPH.LogError("Voyager Versus: " + e.Message); }
        answer["requestId"] = request; answer["clientId"] = client; answer["protocol"] = 2;
        answer["type"] = "voyager.versus.reward.response"; answer["codeVersion"] = "2.5.0";
        // Independent confirmation paths. A failure to deliver a reply must never
        // change or erase the durable payment receipt above.
        string response = answer.ToString(Formatting.None);
        try { CPH.SetGlobalVar("voyagerVersusResponse_" + client, response, false); }
        catch (Exception e) { CPH.LogWarn("Voyager Versus temporary response: " + e.Message); }
        try { CPH.WebsocketBroadcastJson(response); }
        catch (Exception e) { CPH.LogWarn("Voyager Versus response broadcast: " + e.Message); }
        return (bool?)answer["ok"] == true;
    }
    private JObject Reward(bool pay)
    {
        string id = Arg("vvRewardId"), role = Arg("vvRole"), userId = Arg("vvUserId"), login = Arg("vvLogin");
        if (!Regex.IsMatch(id, @"^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_[01]$") || (role != "winner" && role != "runnerUp")) throw new Exception("Invalid saved battle reward identity or role.");
        long target = role == "winner" ? 50L : 0L; // Never trust an amount passed over WebSocket.
        string legacy = ReadGlobal("voyagerVersusReceipt_" + id), key = "voyagerVersusReceiptV2_" + id, raw = ReadGlobal(key);
        string[] old = legacy.Split('|'); bool recoveredId = false;
        if (!Regex.IsMatch(userId, @"^\d{1,25}$"))
        {
            if (old.Length == 3 && Regex.IsMatch(old[1], @"^\d{1,25}$")) userId = old[1];
            else
            {
                if (!Regex.IsMatch(login, @"^[a-z0-9_]{1,25}$")) throw new Exception("Missing Twitch user ID and valid login; no payment was made.");
                var found = CPH.TwitchGetUserInfoByLogin(login);
                if (found == null || !Regex.IsMatch(found.UserId ?? "", @"^\d{1,25}$")) throw new Exception("Twitch could not resolve this account. Check its login in the saved history.");
                userId = found.UserId;
            }
            recoveredId = true;
        }
        var user = CPH.TwitchGetUserInfoById(userId);
        if (user == null || user.UserId != userId) throw new Exception("Twitch could not verify user ID " + userId + ". Nothing was changed.");
        long before = Balance(userId), paid = 0; bool uncertain = false, conflict = false, verified = false;
        string reason = "Unpaid reward ready for credit.";
        JObject receipt = null;
        if (raw.Length > 0)
        {
            try { receipt = JObject.Parse(raw); } catch { uncertain = true; reason = "Unreadable v2 receipt; verify the original points movement."; }
            if (receipt != null)
            {
                conflict = (string)receipt["userId"] != userId || (string)receipt["role"] != role || (string)receipt["id"] != id;
                verified = !conflict && ((string)receipt["status"] == "credited" || (string)receipt["status"] == "settled");
                if (verified) { paid = (long?)receipt["paidTotal"] ?? 0; reason = "Already settled; no duplicate payment."; }
                else { uncertain = true; reason = (string)receipt["error"] ?? "An earlier payment was interrupted. Check the points history before resolving it."; }
            }
        }
        else if (legacy.Length > 0)
        {
            long oldAmount;
            if (old.Length == 3 && old[1] == userId && Int64.TryParse(old[2], out oldAmount) && oldAmount >= 0 && oldAmount <= 200 && old[0] == "credited")
            { paid = oldAmount; reason = "Legacy receipt records " + paid + " points already paid. No automatic deduction."; }
            else { uncertain = true; conflict = old.Length == 3 && old[1] != userId; reason = "Legacy receipt is pending, mismatched or unreadable. Check the original points movement."; }
        }
        else if (Arg("vvSourceStatus") == "credited") { uncertain = true; reason = "Local history says credited but Streamer.bot has no receipt. Verify whether it was paid."; }
        if (paid > MaxPoints || paid < 0) throw new Exception("Invalid paid amount in receipt; manual review required.");
        string fingerprint = Hash(id + "\n" + userId + "\n" + role + "\n" + legacy + "\n" + raw + "\n" + Arg("vvSourceStatus"));
        bool manual = Arg("vvResolution") == "confirmed_unpaid";
        if (manual && !verified && !conflict)
        {
            if (Arg("vvNote").Trim().Length < 8) throw new Exception("Record how you verified this reward was not received.");
            paid = 0; uncertain = false; recoveredId = false; reason = "Operator verified this original reward was unpaid.";
        }
        bool review = uncertain || conflict || recoveredId;
        if (recoveredId) reason = "Recovered Twitch ID " + userId + "; confirm this is the original battle participant before crediting.";
        long delta = Math.Max(0, target - paid);
        string status = review ? "review" : verified ? (paid > target ? "legacy_paid" : target == 0 ? "no_reward" : "credited") : delta > 0 ? "ready" : paid > target ? "legacy_paid" : target == 0 ? "no_reward" : "credited";
        JObject answer = new JObject { ["ok"] = true, ["id"] = id, ["role"] = role, ["userId"] = userId, ["login"] = user.UserLogin, ["name"] = user.UserName,
            ["amount"] = target, ["balance"] = before, ["paid"] = uncertain ? JValue.CreateNull() : new JValue(paid), ["delta"] = review ? 0 : delta,
            ["status"] = status, ["reason"] = reason, ["fingerprint"] = fingerprint, ["canResolve"] = !verified && !conflict,
            ["legacyReceipt"] = legacy, ["verified"] = verified, ["identityRecovered"] = recoveredId };
        if (!pay) return answer;
        long expires; if (!Int64.TryParse(Arg("vvExpiresAt"), out expires) || Now() > expires) throw new Exception("Payment request expired in the action queue. Preview and retry.");
        if (Arg("vvExpected") != fingerprint) throw new Exception("The receipt changed since preview. Preview the history again; nothing was changed.");
        if (review) return answer;
        if (verified) return answer;
        // A legacy success flag has no before/after proof. Keep it reviewable; do not seal it as verified v2.
        if (!manual && raw.Length == 0 && legacy.Length > 0 && delta == 0) return answer;
        if (before > MaxPoints - delta) throw new Exception("This credit would exceed the supported points range.");
        JObject next = new JObject { ["version"] = 2, ["id"] = id, ["userId"] = userId, ["role"] = role, ["amount"] = target,
            ["status"] = "pending", ["before"] = before, ["expectedAfter"] = before + delta, ["paidTotal"] = paid, ["delta"] = delta,
            ["legacyReceipt"] = legacy, ["previousReceipt"] = raw, ["manualResolution"] = manual, ["operatorNote"] = Arg("vvNote"), ["at"] = Now() };
        CPH.SetGlobalVar(key, next.ToString(Formatting.None), true); // Persist intent before touching points.
        try
        {
            if (delta > 0)
            {
                Label(userId, delta, id, "BeginMovement");
                CPH.IncrementOrCreateTwitchUsersVarById(new List<string> { userId }, PointsField, delta, true);
                Label(userId, delta, id, "EndMovement");
            }
            long after = Balance(userId); next["after"] = after;
            if (after != before + delta)
            {
                next["status"] = "review"; next["error"] = after == before ? "Points write made no observed change. Check the currency variable and user account, then resolve as unpaid." : "Balance changed unexpectedly; another points action may have run. Review the original movement before retrying.";
                CPH.SetGlobalVar(key, next.ToString(Formatting.None), true);
                answer["status"] = "review"; answer["reason"] = next["error"]; answer["delta"] = 0; answer["paid"] = JValue.CreateNull(); answer["canResolve"] = true; return answer;
            }
            next["paidTotal"] = paid + delta; next["status"] = delta > 0 ? "credited" : "settled"; next["verifiedAt"] = Now();
            CPH.SetGlobalVar(key, next.ToString(Formatting.None), true);
            answer["status"] = paid + delta > target ? "legacy_paid" : target == 0 ? "no_reward" : "credited";
            answer["paid"] = paid + delta; answer["deltaApplied"] = delta; answer["before"] = before; answer["after"] = after; answer["balance"] = after; answer["verified"] = true; answer["canResolve"] = false;
            answer["reason"] = delta > 0 ? "Verified +" + delta + " points: " + before + " → " + after + "." : reason;
            CPH.LogInfo("Voyager Versus: " + user.UserLogin + ", " + role + ", verified delta " + delta + ", receipt " + id); return answer;
        }
        catch (Exception e)
        {
            next["error"] = "Payment interrupted: " + e.Message; CPH.SetGlobalVar(key, next.ToString(Formatting.None), true);
            answer["status"] = "review"; answer["reason"] = next["error"]; answer["delta"] = 0; answer["paid"] = JValue.CreateNull(); answer["canResolve"] = true; return answer;
        }
    }
    private void Label(string id, long delta, string reward, string method)
    {
        try
        {
            if (method == "BeginMovement")
            {
                CPH.SetArgument("voyagerMovementScope", "current"); CPH.SetArgument("voyagerMovementPlatform", "twitch"); CPH.SetArgument("voyagerMovementUserId", id);
                CPH.SetArgument("voyagerMovementReason", "reward"); CPH.SetArgument("voyagerMovementDelta", delta);
                CPH.SetArgument("voyagerMovementAction", "Voyager Versus win / history repair"); CPH.SetArgument("voyagerFlowId", reward);
            }
            CPH.ExecuteMethod("Voyager Points Ledger", method);
        }
        catch (Exception e) { CPH.LogWarn("Voyager Versus movement label: " + e.Message); }
    }
    private bool AnnounceMatch()
    {
        string id = Arg("vvAnnouncementId"), text = Arg("vvChatText"); long expiresAt;
        if (!Uuid(id) || !Int64.TryParse(Arg("vvExpiresAt"), out expiresAt)) return false;
        text = Regex.Replace(text, @"[\x00-\x1f\x7f]", " ").Trim();
        if (!text.StartsWith("Voyager Versus | ") || text.Length > 450) return false;
        string key = "voyagerVersusChat_" + id;
        lock (Gate)
        {
            string receipt = ReadGlobal(key); if (receipt.Length > 0) return receipt == "sent";
            if (Now() > expiresAt || expiresAt > Now() + 15000L) return false;
            CPH.SetGlobalVar(key, "pending", true);
            try
            {
                CPH.SendMessage(text, true, true);
                CPH.SetGlobalVar(key, "sent", true);
                return true;
            }
            catch (Exception e)
            {
                CPH.LogError("Voyager Versus match chat needs review: " + id + ". " + e.Message);
                return false;
            }
        }
    }
    private bool AnnounceAvailable()
    {
        string id = Arg("vvAnnouncementId"); long expiresAt;
        if (!Uuid(id) || !Int64.TryParse(Arg("vvExpiresAt"), out expiresAt)) return false;
        string key = "voyagerVersusAnnouncement_" + id;
        lock (Gate)
        {
            string receipt = ReadGlobal(key); if (receipt.Length > 0) return receipt == "sent";
            if (Now() > expiresAt) return false;
            CPH.SetGlobalVar(key, "pending", true);
            try { CPH.SendMessage("Voyager Versus is ready! Type !versus to call for a challenger. Winner: 50 Voyager points | Runner-up: 0 points. New calls every 45 minutes.", true, true); CPH.SetGlobalVar(key, "sent", true); return true; }
            catch (Exception e) { CPH.LogError("Voyager Versus announcement needs review: " + id + ". " + e.Message); return false; }
        }
    }
}
