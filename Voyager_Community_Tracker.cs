// Voyager Community Tracker v1. Native Streamer.bot events only.
// Dedicated blocking queue: Voyager Community. Concurrent OFF. One enabled copy.
// Persists one independent JSON ledger; never changes points, groups or giveaways.
using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    private const string StateKey = "VoyagerCommunityStateV1";
    private static readonly object Gate = new object();
    private static readonly string Session = Guid.NewGuid().ToString("N");
    private const long MaxGapMs = 90000; // Set Present Viewers to one minute.
    public bool Execute()
    {
        if (Flag("isTest") || Flag("isFromSharedChatGuest")) return true;
        string kind = CPH.GetEventType().ToString();
        string platform = kind.StartsWith("Twitch", StringComparison.Ordinal) ? "twitch" : kind.StartsWith("YouTube", StringComparison.Ordinal) ? "youtube" : kind.StartsWith("Kick", StringComparison.Ordinal) ? "kick" : "";
        if (platform.Length == 0 || kind.IndexOf("SharedChat", StringComparison.OrdinalIgnoreCase) >= 0) return true;
        bool presence = kind == "TwitchPresentViewers" || kind == "YouTubePresentViewers" || kind == "KickPresentViewers";
        bool reset = kind == "TwitchStreamOffline" || kind == "TwitchStreamOnline" || kind == "KickStreamOffline" || kind == "KickStreamOnline" || kind == "YouTubeBroadcastEnded" || kind == "YouTubeBroadcastStarted";
        bool supported = presence || reset || kind == "TwitchSub" || kind == "TwitchReSub" || kind == "TwitchGiftSub" || kind == "TwitchGiftBomb" || kind == "YouTubeNewSponsor" || kind == "YouTubeMemberMileStone" || kind == "YouTubeMembershipGift" || kind == "KickSubscription" || kind == "KickResubscription" || kind == "KickGiftSubscription" || kind == "KickMassGiftSubscription";
        if (!supported) return true;
        lock (Gate)
        {
            try
            {
                long now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                // Never replace malformed existing data with a blank ledger.
                string raw = CPH.GetGlobalVar<string>(StateKey, true);
                JObject state = String.IsNullOrEmpty(raw) ? new JObject { ["schema"] = 1, ["startedAt"] = now, ["platforms"] = new JObject() } : JObject.Parse(raw);
                if ((int?)state["schema"] != 1) throw new Exception("Unsupported community ledger schema.");
                JObject platforms = ObjectAt(state, "platforms"), p = ObjectAt(platforms, platform), users = ObjectAt(p, "users");
                if (p["startedAt"] == null) p["startedAt"] = now;
                p["lastEventAt"] = now; p["lastEvent"] = kind; p["warning"] = "";
                if (reset) { p["session"] = Session; p["lastTickAt"] = 0; p["present"] = new JArray(); p["live"] = kind.EndsWith("Online") || kind.EndsWith("Started"); }
                else if (presence) Presence(p, users, now);
                else if (platform == "twitch") Twitch(kind, users, now);
                else if (platform == "youtube") YouTube(kind, p, users, now);
                else Kick(kind, p, users, now);
                state["updatedAt"] = now;
                CPH.SetGlobalVar(StateKey, state.ToString(Formatting.None), true);
                return true;
            }
            catch (Exception ex) { CPH.LogWarn("[Voyager Community] " + ex.Message); return false; }
        }
    }
    private void Presence(JObject p, JObject users, long now)
    {
        // Missing isLive is not evidence that the stream is live.
        if (!Flag("isLive")) { p["live"] = false; p["lastTickAt"] = 0; p["present"] = new JArray(); return; }
        object raw; if (!CPH.TryGetArg<object>("users", out raw) || raw == null) { p["warning"] = "Present Viewers did not supply users."; p["lastTickAt"] = 0; p["present"] = new JArray(); return; }
        JArray incoming = raw as JArray ?? JArray.FromObject(raw);
        long last = Long(p["lastTickAt"]), gap = now - last;
        bool sameSession = (string)p["session"] == Session;
        if (sameSession && last > 0 && gap >= 0 && gap < 20000) return; // Duplicate triggers cannot add a second interval.
        bool eligible = sameSession && last > 0 && gap >= 20000 && gap <= MaxGapMs;
        var before = new HashSet<string>(StringComparer.Ordinal); JArray previous = p["present"] as JArray;
        if (previous != null) for (int i = 0; i < previous.Count; i++) before.Add((string)previous[i]);
        var current = new HashSet<string>(StringComparer.Ordinal); var ids = new JArray();
        for (int i = 0; i < incoming.Count; i++)
        {
            JObject u = incoming[i] as JObject; if (u == null) continue;
            string id = Text(u, "id", "userId", "UserId"); if (!ValidId(id) || !current.Add(id)) continue;
            string login = Text(u, "userName", "userLogin", "login", "UserLogin"), name = Text(u, "displayName", "user", "UserName");
            JObject record = User(users, id, login, name, now); ids.Add(id);
            if (eligible && before.Contains(id)) { record["watchSeconds"] = checked(Long(record["watchSeconds"]) + gap / 1000); record["watchUpdatedAt"] = now; }
        }
        if (sameSession && last > 0 && gap > MaxGapMs) p["warning"] = "Presence gap exceeded 90 seconds; no time credited. Set Present Viewers to one minute.";
        p["session"] = Session; p["lastTickAt"] = now; p["lastPresenceAt"] = now; p["present"] = ids; p["live"] = true;
    }
    private void Twitch(string kind, JObject users, long now)
    {
        string id = Read("userId"), login = Read("userName"), name = Read("user");
        if (kind == "TwitchSub") Maximum(users, id, login, name, "months", 1, now);
        if (kind == "TwitchReSub") Maximum(users, id, login, name, "months", ArgNumber("cumulative"), now);
        if (kind == "TwitchGiftSub")
        {
            Maximum(users, Read("recipientId"), Read("recipientUserName"), Read("recipientUser"), "months", ArgNumber("cumulativeMonths"), now);
            if (!Flag("anonymous") && Flag("totalSubsGiftedShared")) Maximum(users, id, login, name, "gifts", ArgNumber("totalSubsGifted"), now);
        }
        if (kind == "TwitchGiftBomb" && !Flag("anonymous") && Flag("totalGiftsShared")) Maximum(users, id, login, name, "gifts", ArgNumber("totalGifts"), now);
        // Twitch reports a cumulative total: taking a maximum makes bomb + child events idempotent.
    }
    private void YouTube(string kind, JObject p, JObject users, long now)
    {
        string id = Read("userId"), login = Read("userName"), name = Read("user");
        if (kind == "YouTubeNewSponsor") Maximum(users, id, login, name, "months", 1, now);
        if (kind == "YouTubeMemberMileStone") Maximum(users, id, login, name, "months", ArgNumber("months"), now);
        if (kind != "YouTubeMembershipGift" || !ValidId(id)) return;
        long count = ArgNumber("count"); string eventId = Read("id");
        if (String.IsNullOrEmpty(eventId) || eventId.Length > 512 || count < 1 || count > 1000000000L) { p["warning"] = "Membership gift missing its event ID or count; skipped."; return; }
        JObject record = User(users, id, login, name, now);
        AddObservedGift(record, "yt:" + eventId, count, now);
    }
    private void Kick(string kind, JObject p, JObject users, long now)
    {
        string id = Read("userId"), login = Read("userName"), name = Read("user");
        if (kind == "KickSubscription" || kind == "KickResubscription") { Maximum(users, id, login, name, "months", ArgNumber("monthsSubscribed"), now); return; }
        if (!ValidId(id) || Flag("anonymous")) return;
        string start = Read("subscribedAt"); DateTimeOffset time;
        if (!DateTimeOffset.TryParse(start, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out time)) { p["warning"] = "Gift missing subscription timestamp; skipped."; return; }
        JObject record = User(users, id, login, name, now);
        if (kind == "KickGiftSubscription")
        {
            string recipient = Read("recipient.userId");
            if (ValidId(recipient)) AddObservedGift(record, "kick:" + recipient + ":" + time.ToUnixTimeSeconds(), 1, now);
            else p["warning"] = "Gift missing recipient ID; skipped.";
        }
        else if (kind == "KickMassGiftSubscription")
        {
            long count = ArgNumber("count"); if (count < 1 || count > 10000) { p["warning"] = "Invalid mass gift count; skipped."; return; }
            int found = 0;
            for (int i = 0; i < count; i++) { string recipient = Read("recipient." + i + ".userId"); if (!ValidId(recipient)) continue; AddObservedGift(record, "kick:" + recipient + ":" + time.ToUnixTimeSeconds(), 1, now); found++; }
            if (found != count) p["warning"] = "Some gift recipients were unavailable; only identified recipients were counted.";
        }
        // The same recipient/time receipt deduplicates mass gifts and their single-recipient events.
    }
    private static void AddObservedGift(JObject record, string receipt, long count, long now)
    {
        JObject seen = ObjectAt(record, "giftReceipts"); if (seen[receipt] != null) return;
        if (seen.Count >= 50000) throw new Exception("Gift receipt limit reached for a user. Ledger was preserved; archive it before extending capacity.");
        seen[receipt] = now; record["gifts"] = checked(Long(record["gifts"]) + count); record["giftsUpdatedAt"] = now;
    }
    private static void Maximum(JObject users, string id, string login, string name, string key, long value, long now)
    {
        if (!ValidId(id) || value < 1 || value > 1000000000L) return;
        JObject record = User(users, id, login, name, now);
        if (value > Long(record[key])) { record[key] = value; record[key + "UpdatedAt"] = now; }
    }
    private static JObject User(JObject users, string id, string login, string name, long now)
    {
        JObject record = users[id] as JObject;
        if (record == null && users[id] != null) throw new Exception("Invalid saved community user: " + id);
        if (record == null) { record = new JObject { ["id"] = id, ["firstSeenAt"] = now, ["watchSeconds"] = 0 }; users[id] = record; }
        if (!String.IsNullOrWhiteSpace(login)) record["login"] = Cut(login, 100);
        if (!String.IsNullOrWhiteSpace(name)) record["name"] = Cut(name, 100);
        record["lastSeenAt"] = now; return record;
    }
    private static JObject ObjectAt(JObject parent, string key) { JObject value = parent[key] as JObject; if (value == null) { if (parent[key] != null) throw new Exception("Invalid ledger object: " + key); value = new JObject(); parent[key] = value; } return value; }
    private static string Text(JObject value, params string[] keys) { foreach (string key in keys) { string s = (string)value[key]; if (!String.IsNullOrWhiteSpace(s)) return s; } return ""; }
    private static string Cut(string value, int n) { return value.Length > n ? value.Substring(0, n) : value; }
    private static bool ValidId(string id) { return !String.IsNullOrWhiteSpace(id) && id.Length <= 128 && !id.Equals("anonymous", StringComparison.OrdinalIgnoreCase); }
    private static long Long(JToken value) { if (value == null) return 0; long n; if (!Int64.TryParse(Convert.ToString(value, CultureInfo.InvariantCulture), NumberStyles.Integer, CultureInfo.InvariantCulture, out n) || n < 0) throw new Exception("Invalid saved community number; ledger preserved."); return n; }
    private long ArgNumber(string key) { long n; return Int64.TryParse(Read(key), NumberStyles.Integer, CultureInfo.InvariantCulture, out n) && n >= 0 ? n : -1; }
    private bool Flag(string key) { bool value; return Boolean.TryParse(Read(key), out value) && value; }
    private string Read(string key) { object value; return CPH.TryGetArg<object>(key, out value) && value != null ? Convert.ToString(value, CultureInfo.InvariantCulture) : ""; }
}
// End of Voyager Community Tracker v1.
