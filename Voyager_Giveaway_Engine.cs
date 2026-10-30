// Action name: Voyager - Giveaway Engine. One Execute C# Code sub-action only.
// Use the dedicated Voyager Giveaways queue with Blocking ON; action Concurrent OFF.
// Add ONE Core > Commands > Command Triggered trigger for !ticket / !enter.
// No waits, OBS sub-actions, Tawmae picker or group-reset action.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    private static readonly object Gate = new object();
    private const string Store = "VoyagerGiveawayStateV1";
    private static readonly string[] Keys = { "blue", "silver", "gold", "platinum", "vip" };
    private static readonly string[] Groups = { "BLUE GROUP", "SILVER GROUP", "GOLD GROUP", "PLATINUM GROUP", "VIP GROUP" };

    public bool Execute()
    {
        lock (Gate)
        {
            string requestId = Read("requestId");
            JObject state = null;
            try
            {
                string raw = CPH.GetGlobalVar<string>(Store, true);
                state = String.IsNullOrEmpty(raw) ? EmptyState() : JObject.Parse(raw);
                if ((int?)state["schema"] != 1) throw new Exception("Unsupported saved giveaway state. Export/back up the global variable before changing versions.");
                // Migrate existing saved group giveaways without changing their pool or picks.
                if (state["controlRevision"] == null) state["controlRevision"] = (long)state["revision"];
                state["engineVersion"] = 9;
                // Chat commands have their own path. Chat arguments can never run operator commands.
                if (CPH.GetEventType().ToString() == "CommandTriggered")
                {
                    JObject entrant = AddChatEntry(state);
                    if (entrant != null)
                    {
                        state["revision"] = (long)state["revision"] + 1;
                        // A ticket must be committed before it is shown or confirmed in chat.
                        CPH.SetGlobalVar(Store, state.ToString(Formatting.None), true);
                        try { Reply(state, "", ""); }
                        catch (Exception broadcastError) { CPH.LogError("[Voyager Giveaway] Ticket saved; overlay update failed: " + broadcastError.Message); }
                        SendEntryConfirmation(entrant);
                        // Optional image lookup happens after the ticket and chat confirmation.
                        // An unavailable picture never rejects the entry or retries its chat reply.
                        ResolveEntrantAvatar(entrant);
                        state["revision"] = (long)state["revision"] + 1;
                        CPH.SetGlobalVar(Store, state.ToString(Formatting.None), true);
                        Reply(state, "", "");
                    }
                    return true;
                }
                string op = Read("operation");
                if (op == "sync")
                {
                    // An open preview is refreshed from the groups, never from a browser's list.
                    // Locked sessions are never rebuilt by a sync or reconnection.
                    if (RefreshOpenPreview(state)) CPH.SetGlobalVar(Store, state.ToString(Formatting.None), true);
                    Reply(state, requestId, ""); return true;
                }
                Guid parsed;
                if (!Guid.TryParse(requestId, out parsed)) throw new Exception("Missing request ID. Open Giveaway_Control.html to run this action.");
                if (((JArray)state["requests"]).Any(x => (string)x == requestId)) { Reply(state, requestId, ""); return true; }
                long expected;
                string controlRevision = Read("controlRevision");
                long actual = controlRevision.Length > 0 ? (long)state["controlRevision"] : (long)state["revision"];
                if (!Int64.TryParse(controlRevision.Length > 0 ? controlRevision : Read("revision"), out expected) || expected != actual)
                    throw new Exception("The giveaway changed in another window. State refreshed; review it before trying again.");
                Apply(state, op);
                if (op == "create")
                {
                    var created = (JObject)state["session"];
                    // Keep the full supported title within a single short chat message.
                    created["startAnnouncement"] = new JObject
                    {
                        ["message"] = "[Voyager] A giveaway has begun: " + ChatText((string)created["title"], 160),
                        ["platforms"] = new JObject
                        {
                            ["twitch"] = new JObject { ["status"] = "pending" },
                            ["youtube"] = new JObject { ["status"] = "pending" },
                            ["kick"] = new JObject { ["status"] = "pending" }
                        }
                    };
                }
                state["controlRevision"] = (long)state["controlRevision"] + 1;
                state["revision"] = (long)state["revision"] + 1;
                var requests = (JArray)state["requests"];
                requests.Add(requestId);
                while (requests.Count > 200) requests.RemoveAt(0);
                // Save before broadcasting: reconnecting a controller must recover the same winner.
                CPH.SetGlobalVar(Store, state.ToString(Formatting.None), true);
                if (op == "create")
                {
                    // The session and request ID are committed before any chat sends.
                    // Syncs, duplicate requests and later operations never resend this announcement.
                    SendStartAnnouncement((JObject)state["session"]);
                    state["revision"] = (long)state["revision"] + 1;
                    CPH.SetGlobalVar(Store, state.ToString(Formatting.None), true);
                }
                var locked = state["session"] as JObject;
                if ((op == "create" || op == "closeEntries") && locked?["proof"] is JObject && (bool?)locked["proof"]["announced"] != true)
                {
                    // Posted after the lock is saved, so the fingerprint in chat always matches the saved pool.
                    SendProofAnnouncement(locked);
                    state["revision"] = (long)state["revision"] + 1;
                    CPH.SetGlobalVar(Store, state.ToString(Formatting.None), true);
                }
                Reply(state, requestId, "");
                return true;
            }
            catch (Exception ex)
            {
                CPH.LogError("[Voyager Giveaway] " + ex.Message);
                // Re-read committed state. Never broadcast partially applied, uncommitted changes.
                try { string raw = CPH.GetGlobalVar<string>(Store, true); state = String.IsNullOrEmpty(raw) ? EmptyState() : JObject.Parse(raw); }
                catch { state = null; }
                Reply(state, requestId, ex.Message);
                return false;
            }
        }
    }

    private void Apply(JObject state, string op)
    {
        long now = Now();
        var session = state["session"] as JObject;
        var reveal = state["reveal"] as JObject;
        bool building = reveal != null && now < (long)reveal["at"] + RevealDelay(reveal) && (string)state["view"] == "reveal";
        if (op == "hide") { state["view"] = "hidden"; return; }
        if (building && op != "confirm") throw new Exception("The giveaway countdown, buildup and wheel are running. Wait for the winner, or hide the overlay.");
        // Hiding does not bypass the draw lock, and replay never resets a claim deadline.
        if ((op == "draw" || op == "reroll" || op == "new" || op == "create" || op == "preview") && reveal != null && now < (long)reveal["at"] + RevealDelay(reveal))
            throw new Exception("Wait for the current reveal to finish before changing the draw.");
        if (op == "new")
        {
            if (session != null && Current(session) != null && (string)Current(session)["status"] == "selected")
            { var old = Current(session); old["status"] = "not_confirmed"; UpdateAudit(state, old); }
            state["session"] = null; state["preview"] = null; state["celebration"] = null; state["reveal"] = null; state["view"] = "hidden";
            return;
        }
        if (op == "preview")
        {
            if (session != null) throw new Exception("This giveaway already has a saved pool. Use Show pool, or start a new giveaway to change its groups.");
            if (Read("mode") != "groups") throw new Exception("Open member previews are only available for group giveaways.");
            var previous = state["preview"] as JObject;
            var open = CreateSession(false, true);
            if (previous != null) { open["id"] = (string)previous["id"]; open["createdAt"] = (long)previous["createdAt"]; }
            state["preview"] = open; state["view"] = "pool"; state["reveal"] = null;
            return;
        }
        if (op == "create")
        {
            if (session != null) throw new Exception("Use New giveaway before loading another pool.");
            string mode = Read("mode");
            if (mode != "" && mode != "groups" && mode != "chat") throw new Exception("Unsupported giveaway mode.");
            bool showingPreview = state["preview"] is JObject && (string)state["view"] == "pool";
            state["session"] = CreateSession(mode == "chat");
            // Group pools are final once locked: commit the fair-draw proof now, before any draw.
            if (mode != "chat") state["session"]["proof"] = MakeProof((JArray)state["session"]["pool"], now);
            state["preview"] = null;
            state["view"] = mode == "chat" || showingPreview ? "pool" : "hidden"; state["reveal"] = null;
            return;
        }
        if (op == "test")
        {
            state["view"] = "reveal";
            state["reveal"] = new JObject { ["id"] = Guid.NewGuid().ToString(), ["at"] = now, ["winner"] = "MDA009 · TEST", ["title"] = "TEST REVEAL — no winner drawn", ["claimDeadline"] = now + 120000L, ["claimStartsAt"] = now + 60000L, ["sequenceVersion"] = 2, ["wheelMs"] = 30000, ["revealDelayMs"] = 50000, ["test"] = true };
            return;
        }
        if (session == null) throw new Exception("Load and lock the member pool, or open impromptu entries, before drawing.");
        if (op == "pool") { state["view"] = "pool"; return; }
        if (op == "closeEntries" || op == "reopenEntries")
        {
            if ((string)session["mode"] != "chat") throw new Exception("Entry controls are only available for impromptu giveaways.");
            if (((JArray)session["draws"]).Count > 0) throw new Exception("Entries cannot reopen after the first draw. Start a new giveaway instead.");
            bool opening = op == "reopenEntries";
            if ((bool)session["entriesOpen"] == opening) throw new Exception(opening ? "Entries are already open." : "Entries are already closed.");
            if (opening && ((JArray)session["pool"]).Count >= 50000) throw new Exception("The 50,000-entry limit has been reached.");
            session["entriesOpen"] = opening;
            session[opening ? "openedAt" : "closedAt"] = now;
            // The entrant list is final when entries close: commit the fair-draw proof then.
            // Reopening (only possible before the first draw) discards it; the next close commits a new one.
            session["proof"] = opening ? null : MakeProof((JArray)session["pool"], now);
            state["view"] = "pool"; state["reveal"] = null;
            return;
        }
        JObject current = Current(session);
        if (op == "confirm")
        {
            if (current == null || (string)current["status"] != "selected") throw new Exception("There is no winner awaiting confirmation.");
            if (now < (long)current["at"] + RevealDelay(current)) throw new Exception("Wait until the winner is revealed.");
            if ((long)current["claimDeadline"] > 0 && now >= (long)current["claimDeadline"]) throw new Exception("The claim window has expired. Reroll to choose someone else.");
            current["status"] = "confirmed"; current["confirmedAt"] = now;
            UpdateAudit(state, current);
            // Commit the claim and its animation together. Syncs and repeated requests
            // retain this event's original ID/time; they never start a new celebration.
            state["celebration"] = new JObject
            {
                ["id"] = Guid.NewGuid().ToString(), ["drawId"] = (string)current["id"],
                ["at"] = now, ["winner"] = (string)current["winner"]["name"]
            };
            state["reveal"] = null; state["view"] = "celebration";
            return;
        }
        if (op == "replay")
        {
            if (current == null) throw new Exception("Draw a winner first.");
            state["reveal"] = MakeReveal(session, current, now, (string)current["status"] == "confirmed");
            state["view"] = "reveal"; return;
        }
        if (op != "draw" && op != "reroll") throw new Exception("Unknown giveaway operation.");
        if ((string)session["mode"] == "chat" && (bool)session["entriesOpen"])
            throw new Exception("Close entries before drawing a winner.");
        if (op == "reroll" && (current == null || (string)current["status"] != "selected"))
            throw new Exception("Only an unconfirmed winner can be rerolled.");
        if (op == "draw" && current != null && (string)current["status"] == "selected")
            throw new Exception("Confirm this winner or use Reroll before drawing again.");
        var used = new HashSet<string>(((JArray)session["draws"]).Select(x => (string)x["winner"]["key"]), StringComparer.Ordinal);
        var eligible = ((JArray)session["pool"]).OfType<JObject>().Where(x => !used.Contains((string)x["key"])).ToList();
        if (eligible.Count == 0) throw new Exception("No eligible entrants remain in this locked pool.");
        // Validate eligibility before marking the previous pick as rerolled.
        if (op == "reroll") { current["status"] = "rerolled"; UpdateAudit(state, current); }
        // Fair draw: draw n uses the n-th seed of the hash chain committed when the pool locked.
        // Sessions saved by older engine versions have no proof and keep the plain secure draw.
        var proof = session["proof"] as JObject;
        int drawNumber = ((JArray)session["draws"]).Count + 1, index;
        if (proof != null && (int?)proof["version"] == 1)
        {
            var seeds = (JArray)proof["seeds"];
            if (drawNumber > seeds.Count) throw new Exception("This giveaway has used all " + seeds.Count + " fair-draw seeds. Start a new giveaway.");
            index = ProofIndex((string)seeds[drawNumber - 1], eligible.Count);
        }
        else index = UniformIndex(eligible.Count);
        int claimSeconds = 60; // All new giveaways receive a full 60-second claim window.
        session["claimSeconds"] = claimSeconds;
        var draw = new JObject
        {
            ["id"] = Guid.NewGuid().ToString(), ["sessionId"] = (string)session["id"],
            ["title"] = (string)session["title"], ["mode"] = (string)session["mode"] ?? "groups", ["groups"] = session["groups"].DeepClone(),
            ["winner"] = eligible[index].DeepClone(),
            ["proof"] = proof != null ? new JObject { ["n"] = drawNumber, ["index"] = index } : null,
            ["eligibleCount"] = eligible.Count, ["at"] = now,
            ["sequenceVersion"] = 2, ["wheelMs"] = 30000, ["revealDelayMs"] = 50000, ["claimStartsAt"] = now + 60000L,
            ["claimDeadline"] = claimSeconds > 0 ? now + 60000L + claimSeconds * 1000L : 0L,
            ["status"] = "selected"
        };
        ((JArray)session["draws"]).Add(draw);
        session["currentDrawId"] = (string)draw["id"];
        ((JArray)state["audit"]).Add(draw.DeepClone());
        while (((JArray)state["audit"]).Count > 1000) ((JArray)state["audit"]).RemoveAt(0);
        state["reveal"] = MakeReveal(session, draw, now, false); state["view"] = "reveal";
        CPH.LogInfo("[Voyager Giveaway] " + (string)draw["id"] + " | " + (string)draw["title"] + " | winner " + (string)draw["winner"]["name"] + " | pool " + eligible.Count);
    }

    private bool RefreshOpenPreview(JObject state)
    {
        var previous = state["preview"] as JObject;
        if (state["session"] is JObject || previous == null) return false;
        try
        {
            var open = CreateSession(false, true, previous);
            open["id"] = (string)previous["id"]; open["createdAt"] = (long)previous["createdAt"];
            state["preview"] = open;
        }
        catch (Exception ex)
        {
            // Keep the last known names, but label them unavailable instead of current.
            previous["error"] = ex.Message;
        }
        state["revision"] = (long)state["revision"] + 1;
        // Do not change controlRevision: automatic refreshes cannot invalidate a lock command.
        return true;
    }

    private string Setting(JObject settings, string name)
    {
        if (settings == null) return Read(name);
        var value = settings[name];
        var values = value as JArray;
        return values != null ? String.Join(",", values.Select(x => (string)x)) : value == null ? "" : value.ToString();
    }

    private JObject CreateSession(bool chat, bool preview = false, JObject settings = null)
    {
        var selected = Setting(settings, "groups").Split(',').Select(x => x.Trim().ToLowerInvariant()).Where(x => x.Length > 0).Distinct().ToList();
        if (!chat && (selected.Count == 0 || selected.Any(x => !Keys.Contains(x)))) throw new Exception("Choose at least one supported membership group.");
        selected = Keys.Where(selected.Contains).ToList();
        string title = Setting(settings, "title").Trim();
        if (title.Length == 0 || title.Length > 160) throw new Exception("Enter a prize title of 1–160 characters.");
        int claimSeconds = 60;
        var excluded = new HashSet<string>(Setting(settings, "excludeLogins").Split(new[] { ',', '\n', '\r', ' ', ';' }, StringSplitOptions.RemoveEmptyEntries).Select(NormalizeExclusion), StringComparer.Ordinal);
        if (chat) return new JObject
        {
            ["id"] = Guid.NewGuid().ToString(), ["mode"] = "chat", ["createdAt"] = Now(), ["title"] = title,
            ["groups"] = new JArray(), ["claimSeconds"] = claimSeconds,
            ["excludeLogins"] = new JArray(excluded.OrderBy(x => x)), ["duplicatesRemoved"] = 0,
            ["entriesOpen"] = true, ["openedAt"] = Now(), ["closedAt"] = 0,
            ["pool"] = new JArray(), ["draws"] = new JArray(), ["currentDrawId"] = ""
        };
        var rows = new List<JObject>();
        foreach (string key in selected)
        {
            string group = Groups[Array.IndexOf(Keys, key)];
            if (!CPH.GroupExists(group)) throw new Exception("Group not found: " + group + ". The pool was not created.");
            var users = CPH.UsersInGroup(group);
            if (users == null) throw new Exception("Unable to read " + group + ". The pool was not created.");
            foreach (var user in users)
            {
                if (user == null) throw new Exception("Invalid member record in " + group + ". Check that group before drawing.");
                string id = (user.Id ?? "").Trim();
                string login = (user.Login ?? "").Trim().ToLowerInvariant();
                string name = String.IsNullOrWhiteSpace(user.Username) ? login : user.Username.Trim();
                string platform = (user.Type ?? "").Trim().ToLowerInvariant();
                if (String.IsNullOrEmpty(platform) || String.IsNullOrEmpty(name) || (id.Length == 0 && login.Length == 0))
                    throw new Exception("Member identity is incomplete in " + group + ". Check that group before drawing.");
                rows.Add(new JObject { ["id"] = id, ["login"] = login, ["name"] = name, ["platform"] = platform, ["group"] = key });
            }
        }
        // Resolve login-only records to known IDs before merging overlapping groups.
        var idsByLogin = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var row in rows.Where(x => (string)x["id"] != "" && (string)x["login"] != ""))
        {
            string alias = (string)row["platform"] + ":" + (string)row["login"];
            string id = (string)row["id"];
            if (idsByLogin.ContainsKey(alias) && idsByLogin[alias] != id)
                throw new Exception("Conflicting user IDs for " + (string)row["login"] + ". Refresh the memberships before drawing.");
            idsByLogin[alias] = id;
        }
        var blockedKeys = new HashSet<string>(StringComparer.Ordinal);
        foreach (var row in rows.Where(x => excluded.Contains((string)x["login"])))
            blockedKeys.Add(Identity(row, idsByLogin));
        var pool = new Dictionary<string, JObject>(StringComparer.Ordinal);
        int excludedRows = 0;
        foreach (var row in rows)
        {
            if (blockedKeys.Contains(Identity(row, idsByLogin))) { excludedRows++; continue; }
            string id = (string)row["id"], login = (string)row["login"], platform = (string)row["platform"];
            string resolved;
            if (id.Length == 0 && idsByLogin.TryGetValue(platform + ":" + login, out resolved)) id = resolved;
            string key = platform + (id.Length > 0 ? ":id:" + id : ":login:" + login);
            JObject member;
            if (!pool.TryGetValue(key, out member))
            {
                member = new JObject { ["key"] = key, ["id"] = id, ["login"] = login, ["name"] = (string)row["name"], ["platform"] = platform, ["groups"] = new JArray() };
                pool.Add(key, member);
            }
            var tiers = (JArray)member["groups"];
            if (!tiers.Any(x => (string)x == (string)row["group"])) tiers.Add((string)row["group"]);
        }
        if (pool.Count == 0 && !preview) throw new Exception("The selected groups have no eligible members after exclusions.");
        if (pool.Count > 50000) throw new Exception("This control panel supports up to 50,000 unique members per locked pool.");
        return new JObject
        {
            ["id"] = Guid.NewGuid().ToString(), ["mode"] = "groups", ["createdAt"] = Now(), ["title"] = title,
            ["preview"] = preview, ["entriesOpen"] = preview, ["updatedAt"] = Now(), ["error"] = "",
            ["groups"] = new JArray(selected), ["claimSeconds"] = claimSeconds,
            ["excludeLogins"] = new JArray(excluded.OrderBy(x => x)),
            ["duplicatesRemoved"] = rows.Count - excludedRows - pool.Count,
            ["pool"] = new JArray(pool.Values.OrderBy(x => (string)x["name"], StringComparer.OrdinalIgnoreCase)),
            ["draws"] = new JArray(), ["currentDrawId"] = ""
        };
    }

    private JObject AddChatEntry(JObject state)
    {
        var session = state["session"] as JObject;
        if (session == null || (string)session["mode"] != "chat" || (bool?)session["entriesOpen"] != true) return null;
        string command = Read("command").Trim().ToLowerInvariant();
        string platform = Read("commandSource").Trim().ToLowerInvariant();
        if ((command != "!ticket" && command != "!enter") || Read("commandType").ToLowerInvariant() != "message") return null;
        if (platform != "twitch" && platform != "youtube" && platform != "kick") return null;
        if (String.Equals(Read("isInternal"), "true", StringComparison.OrdinalIgnoreCase)) return null;
        string id = Read("userId").Trim();
        string login = Read("userName").Trim().TrimStart('@').ToLowerInvariant();
        string name = Read("user").Trim();
        if (name.Length == 0) name = Read("userName").Trim();
        // IDs (especially YouTube channel IDs) are case-sensitive. Display names are never identity keys.
        if (id.Length == 0 || name.Length == 0) throw new Exception("Chat entry has no userId or name. Check the Command Triggered action arguments in Action History.");
        var exclusions = new HashSet<string>(((JArray)session["excludeLogins"]).Select(x => (string)x), StringComparer.Ordinal);
        if (exclusions.Contains(login) || exclusions.Contains(platform + ":" + login)) return null;
        // Also support an exact platform:id:ID exclusion, without lowercasing the incoming ID.
        if (exclusions.Contains(platform + ":id:" + id)) return null;
        var pool = (JArray)session["pool"];
        string key = platform + ":id:" + id;
        if (pool.Any(x => (string)x["key"] == key)) return null;
        if (pool.Count >= 50000) return null;
        var entrant = new JObject
        {
            ["key"] = key, ["id"] = id, ["login"] = login, ["name"] = name, ["platform"] = platform,
            ["groups"] = new JArray(), ["enteredAt"] = Now(), ["entryCommand"] = command,
            ["ticketNumber"] = pool.Count + 1, ["confirmationState"] = "pending",
            ["avatarUrl"] = EntryAvatarFromArguments(),
            ["broadcastId"] = platform == "youtube" ? (Read("broadcast.id").Length > 0 ? Read("broadcast.id") : Read("broadcastId")) : ""
        };
        pool.Add(entrant);
        if (pool.Count == 50000)
        {
            session["entriesOpen"] = false; session["closedAt"] = Now();
            session["proof"] = MakeProof(pool, Now());
            state["controlRevision"] = (long)state["controlRevision"] + 1;
            CPH.LogInfo("[Voyager Giveaway] Entries closed at the 50,000-entry limit.");
        }
        return entrant;
    }

    private string SafeAvatarUrl(string value)
    {
        Uri uri;
        if (String.IsNullOrWhiteSpace(value) || value.Length > 4096) return "";
        return Uri.TryCreate(value.Trim(), UriKind.Absolute, out uri) && uri.Scheme == "https" && String.IsNullOrEmpty(uri.UserInfo) ? uri.AbsoluteUri : "";
    }

    private string EntryAvatarFromArguments()
    {
        // YouTube command events include userProfileUrl. Other platform versions
        // may supply a sender image too. Never use broadcaster/target/recipient images.
        foreach (string argument in new [] { "userProfileUrl", "userProfileImageUrl", "user.profilePicture" })
        {
            string url = SafeAvatarUrl(Read(argument));
            if (url.Length > 0) return url;
        }
        return "";
    }

    private void ResolveEntrantAvatar(JObject entrant)
    {
        if ((string)entrant["avatarUrl"] != "" || (string)entrant["platform"] != "twitch") return;
        try
        {
            var user = CPH.TwitchGetExtendedUserInfoById((string)entrant["id"]);
            if (user != null) entrant["avatarUrl"] = SafeAvatarUrl(user.ProfileImageUrl);
        }
        catch (Exception ex)
        {
            CPH.LogInfo("[Voyager Giveaway] Profile image unavailable; showing initials: " + ex.Message);
        }
    }

    private void SendStartAnnouncement(JObject session)
    {
        var announcement = (JObject)session["startAnnouncement"];
        string message = (string)announcement["message"];
        foreach (string platform in new [] { "twitch", "youtube", "kick" })
        {
            var result = (JObject)announcement["platforms"][platform];
            try
            {
                if (platform == "twitch") CPH.SendMessage(message, true, true);
                else if (platform == "kick") CPH.SendKickMessage(message, true, true);
                else
                {
                    var broadcasts = CPH.YouTubeGetMonitoredBroadcasts();
                    if (broadcasts == null || broadcasts.Count == 0)
                    {
                        result["status"] = "skipped";
                        result["reason"] = "No YouTube broadcast is being monitored.";
                        continue;
                    }
                    if (broadcasts.Count != 1)
                        throw new Exception("Monitor one YouTube broadcast to identify the giveaway chat.");
                    CPH.SendYouTubeMessageToLatestMonitored(message, true, true);
                }
                // These APIs return void; submitted does not guarantee delivery.
                result["status"] = "submitted";
                result["at"] = Now();
            }
            catch (Exception ex)
            {
                result["status"] = "error";
                result["reason"] = ex.Message;
                CPH.LogError("[Voyager Giveaway] Giveaway created, but its " + platform + " start announcement failed: " + ex.Message);
                // A failed platform must not cancel the giveaway or block other chats.
            }
        }
    }

    private void SendEntryConfirmation(JObject entrant)
    {
        string platform = (string)entrant["platform"];
        string ticket = ((int)entrant["ticketNumber"]).ToString("D4");
        // Prefix is fixed so a display name can never become a slash command. Keep below YouTube's message limit.
        string name = ChatText((string)entrant["name"], 60);
        string message = "[Voyager] " + name + ", you're entered! Ticket #" + ticket + ". Good luck!";
        try
        {
            if (platform == "twitch") CPH.SendMessage(message, true, true);
            else if (platform == "kick") CPH.SendKickMessage(message, true, true);
            else if (platform == "youtube")
            {
                string broadcastId = (string)entrant["broadcastId"];
                if (!String.IsNullOrWhiteSpace(broadcastId)) CPH.SendYouTubeMessage(message, true, true, broadcastId);
                else
                {
                    var broadcasts = CPH.YouTubeGetMonitoredBroadcasts();
                    if (broadcasts == null || broadcasts.Count != 1)
                        throw new Exception("Cannot identify the originating YouTube broadcast. Monitor one broadcast, or check broadcast.id in the command's arguments.");
                    CPH.SendYouTubeMessageToLatestMonitored(message, true, true);
                }
            }
            else throw new Exception("Unsupported confirmation platform.");
            // Streamer.bot's send methods return void: submitted is not a delivery receipt.
            entrant["confirmationState"] = "submitted";
            entrant["confirmationAt"] = Now();
        }
        catch (Exception ex)
        {
            entrant["confirmationState"] = "error";
            entrant["confirmationError"] = ex.Message;
            CPH.LogError("[Voyager Giveaway] Ticket #" + ticket + " is saved, but its " + platform + " confirmation failed: " + ex.Message);
        }
    }
    private static string ChatText(string text, int maximum)
    {
        string clean = new String((text ?? "").Where(c => !Char.IsControl(c)).ToArray()).Trim();
        if (clean.Length <= maximum) return clean;
        int length = maximum;
        if (Char.IsHighSurrogate(clean[length - 1])) length--;
        return clean.Substring(0, length);
    }

    private static string NormalizeExclusion(string value)
    {
        value = value.Trim().TrimStart('@');
        int marker = value.IndexOf(":id:", StringComparison.OrdinalIgnoreCase);
        return marker < 0 ? value.ToLowerInvariant() : value.Substring(0, marker).ToLowerInvariant() + ":id:" + value.Substring(marker + 4);
    }
    private static string Identity(JObject row, Dictionary<string, string> aliases)
    {
        string id = (string)row["id"], login = (string)row["login"], platform = (string)row["platform"], resolved;
        if (id.Length == 0 && aliases.TryGetValue(platform + ":" + login, out resolved)) id = resolved;
        return platform + (id.Length > 0 ? ":id:" + id : ":login:" + login);
    }
    // ---------- Fair-draw proof (v1) ----------
    // When the pool locks, Voyager makes a chain of 64 seeds: s64 is random and each s(k) = SHA-256(s(k+1)).
    // s0 (the commitment) and the entrant list fingerprint are published before any draw. Draw n uses s(n);
    // revealing s(n) afterwards proves it belongs to the commitment without revealing any later seed.
    // Index rule (the public site repeats it): HMAC-SHA256(key = s(n), "voyager-draw-v1:" + c) for c = 0, 1, …;
    // the first 4 bytes as a big-endian number, rejected if >= 2^32 - 2^32 % count; index = value % count.
    private const int ProofSeeds = 64, ProofListLimit = 5000;
    private static JObject MakeProof(JArray pool, long now)
    {
        var lines = new List<string>(); var entrants = new JArray();
        foreach (var entrant in pool.OfType<JObject>())
        {
            string platform = ProofText((string)entrant["platform"], 20), name = ProofText((string)entrant["name"], 100);
            lines.Add(platform + "\t" + name);
            if (pool.Count <= ProofListLimit) entrants.Add(new JArray(platform, name));
        }
        byte[] seed = new byte[32];
        using (var rng = RandomNumberGenerator.Create()) rng.GetBytes(seed);
        var chain = new List<string> { Hex(seed) };
        for (int i = 0; i < ProofSeeds; i++) { seed = Sha(seed); chain.Add(Hex(seed)); }
        chain.Reverse(); // chain[0] = s0 (commitment) … chain[64] = s64
        return new JObject
        {
            ["version"] = 1, ["committedAt"] = now, ["commitment"] = chain[0],
            ["poolHash"] = Hex(Sha(Encoding.UTF8.GetBytes(String.Join("\n", lines)))), ["size"] = lines.Count,
            ["entrants"] = pool.Count <= ProofListLimit ? (JToken)entrants : JValue.CreateNull(),
            ["seeds"] = new JArray(chain.Skip(1)), ["announced"] = false
        };
    }
    public static int ProofIndex(string seedHex, int count)
    {
        if (count <= 0) throw new ArgumentOutOfRangeException("count");
        ulong range = 1UL << 32, limit = range - range % (ulong)count;
        using (var hmac = new HMACSHA256(FromHex(seedHex)))
        {
            for (int c = 0; c < 4096; c++)
            {
                byte[] d = hmac.ComputeHash(Encoding.UTF8.GetBytes("voyager-draw-v1:" + c));
                uint value = ((uint)d[0] << 24) | ((uint)d[1] << 16) | ((uint)d[2] << 8) | d[3];
                if ((ulong)value < limit) return (int)(value % (uint)count);
            }
        }
        throw new Exception("Fair-draw index could not be derived.");
    }
    public static string ProofText(string value, int maximum)
    {
        string clean = new String((value ?? "").Where(c => !Char.IsControl(c)).ToArray()).Trim();
        if (clean.Length > maximum) { int length = maximum; if (Char.IsHighSurrogate(clean[length - 1])) length--; clean = clean.Substring(0, length); }
        return clean;
    }
    public static byte[] Sha(byte[] data) { using (var sha = SHA256.Create()) return sha.ComputeHash(data); }
    public static string Hex(byte[] data) { var b = new StringBuilder(data.Length * 2); foreach (byte x in data) b.Append(x.ToString("x2")); return b.ToString(); }
    public static byte[] FromHex(string hex)
    {
        if (hex == null || hex.Length != 64) throw new Exception("Invalid fair-draw seed.");
        var bytes = new byte[32];
        for (int i = 0; i < 32; i++) bytes[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
        return bytes;
    }
    private void SendProofAnnouncement(JObject session)
    {
        var proof = session?["proof"] as JObject;
        if (proof == null || (bool?)proof["announced"] == true) return;
        proof["announced"] = true;
        string message = "[Voyager] Entries locked: " + (int)proof["size"] + " entrants. Fair-draw fingerprint " + ((string)proof["commitment"]).Substring(0, 16) + ". After the draw, the proof is on the Voyager website.";
        foreach (string platform in new[] { "twitch", "youtube", "kick" })
        {
            try
            {
                if (platform == "twitch") CPH.SendMessage(message, true, true);
                else if (platform == "kick") CPH.SendKickMessage(message, true, true);
                else
                {
                    var broadcasts = CPH.YouTubeGetMonitoredBroadcasts();
                    if (broadcasts == null || broadcasts.Count != 1) continue;
                    CPH.SendYouTubeMessageToLatestMonitored(message, true, true);
                }
            }
            catch (Exception ex) { CPH.LogError("[Voyager Giveaway] Fair-draw fingerprint was saved, but the " + platform + " message failed: " + ex.Message); }
        }
    }

    private static int UniformIndex(int count)
    {
        if (count <= 0) throw new ArgumentOutOfRangeException("count");
        // Rejection sampling avoids modulo bias; never use System.Random for a draw.
        ulong range = 1UL << 32, limit = range - range % (ulong)count;
        byte[] bytes = new byte[4]; uint value;
        using (var rng = RandomNumberGenerator.Create())
        {
            do { rng.GetBytes(bytes); value = BitConverter.ToUInt32(bytes, 0); } while ((ulong)value >= limit);
        }
        return (int)((ulong)value % (ulong)count);
    }
    private static JObject EmptyState() { return new JObject { ["schema"] = 1, ["engineVersion"] = 9, ["revision"] = 0, ["controlRevision"] = 0, ["session"] = null, ["preview"] = null, ["celebration"] = null, ["view"] = "hidden", ["reveal"] = null, ["audit"] = new JArray(), ["requests"] = new JArray() }; }
    private static JObject Current(JObject session) { return ((JArray)session["draws"]).OfType<JObject>().FirstOrDefault(x => (string)x["id"] == (string)session["currentDrawId"]); }
    private static long RevealDelay(JObject value) { return (int?)value["sequenceVersion"] == 2 ? 50000L : 20000L; }
    private static JObject MakeReveal(JObject session, JObject draw, long at, bool confirmed)
    {
        return new JObject { ["id"] = Guid.NewGuid().ToString(), ["drawId"] = (string)draw["id"], ["at"] = at, ["winner"] = (string)draw["winner"]["name"], ["platform"] = (string)session["mode"] == "chat" ? (string)draw["winner"]["platform"] : "", ["title"] = (string)session["title"], ["claimDeadline"] = confirmed ? 0L : (long)draw["claimDeadline"], ["claimStartsAt"] = (long?)draw["claimStartsAt"] ?? (long)draw["at"] + 30000L, ["sequenceVersion"] = (int?)draw["sequenceVersion"] ?? 1, ["wheelMs"] = (int?)draw["sequenceVersion"] == 2 ? 30000 : 0, ["revealDelayMs"] = RevealDelay(draw), ["test"] = false };
    }
    private static void UpdateAudit(JObject state, JObject draw)
    {
        var a = (JArray)state["audit"];
        for (int i = 0; i < a.Count; i++) if ((string)a[i]["id"] == (string)draw["id"]) { a[i] = draw.DeepClone(); break; }
    }
    private void Reply(JObject state, string requestId, string error)
    {
        CPH.WebsocketBroadcastJson(JsonConvert.SerializeObject(new { type = "voyager.giveaway.state.v1", requestId = requestId, ok = error.Length == 0, error = error, serverAt = Now(), state = state }));
    }
    private string Read(string name) { object value; return CPH.TryGetArg<object>(name, out value) && value != null ? Convert.ToString(value) : ""; }
    private static long Now() { return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(); }
}
// End of Voyager Giveaway Engine v9.
