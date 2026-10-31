// Voyager Membership Card v1 - the !voyager glass membership card (Voyager 2.19).
// Action name: Voyager - Membership Card. One Core > C# > Execute C# Code sub-action (this whole file). Untick Concurrent.
// Triggers:
//   Core > Commands > Command Triggered: !voyager (Everyone; Twitch, YouTube and Kick). Move it here from "Silver Membership On Screen".
//   Core > Groups > User Added to Group (any group). Only SILVER, GOLD and PLATINUM GROUP are used: they play the tier-up card.
// It reads your existing membership groups (BLUE/SILVER/GOLD/PLATINUM GROUP) and the "points" user variable, works out the
// leaderboard position, and tells the Voyager host (WebSocket broadcast). The host builds the card and shows it in OBS.
// It never changes points, groups, tickets or giveaways: !upgrade and the purchase actions stay exactly as they are.
// The host also runs it with cardSay to reply in chat.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    private static readonly string[] Tiers = { "blue", "silver", "gold", "platinum" };
    private static readonly string[] Buckets = { "mdavoyagersilver", "mdavoyagergold", "mdavoyagerplatinum" };
    public bool Execute()
    {
        try
        {
            string say = Read("cardSay");
            if (say.Length > 0) { Say(say.Length > 450 ? say.Substring(0, 450) : say); return true; }
            if (Flag("isTest") || Flag("isFromSharedChatGuest")) return true;
            string group = Read("group.name").Trim().ToUpperInvariant();
            if (group.Length > 0) { GroupAdded(group); return true; }
            string command = Read("command").Trim().ToLowerInvariant();
            if (command != "!voyager") return true;
            string platform = Read("commandSource").Trim().ToLowerInvariant();
            if (platform != "twitch" && platform != "youtube" && platform != "kick") return true;
            string name = Read("user"); if (name.Length == 0) name = Read("userName");
            string id = Read("userId"), login = Read("userName").TrimStart('@').ToLowerInvariant();
            JObject ev = Event("card", platform, id, login, name);
            ev["input"] = Cut(Read("rawInput").Trim(), 80);
            CPH.WebsocketBroadcastJson(ev.ToString(Formatting.None));
            return true;
        }
        catch (Exception ex) { CPH.LogWarn("[Voyager Membership Card] " + ex.Message); return false; }
    }
    private void GroupAdded(string group)
    {
        int tier = Array.IndexOf(new[] { "BLUE GROUP", "SILVER GROUP", "GOLD GROUP", "PLATINUM GROUP" }, group);
        if (tier < 1) return; // Blue is given on first chat: no ceremony.
        int count; if (!Int32.TryParse(Read("group.user.count"), NumberStyles.Integer, CultureInfo.InvariantCulture, out count) || count < 1) return;
        for (int i = 0; i < Math.Min(count, 20); i++)
        {
            string prefix = "group.user" + i + ".";
            string platform = Read(prefix + "userType").ToLowerInvariant();
            if (platform != "twitch" && platform != "youtube" && platform != "kick") continue;
            string login = Read(prefix + "userName").ToLowerInvariant();
            if (Buckets.Contains(login)) continue;
            JObject ev = Event("tierup", platform, Read(prefix + "userId"), login, Read(prefix + "user"));
            ev["tier"] = Tiers[tier];
            CPH.WebsocketBroadcastJson(ev.ToString(Formatting.None));
        }
    }
    private JObject Event(string kind, string platform, string id, string login, string name)
    {
        long points = -1, rank = 0, members = 0;
        try { Points(platform, id, login, out points, out rank, out members); } catch (Exception ex) { CPH.LogWarn("[Voyager Membership Card] points: " + ex.Message); }
        return new JObject
        {
            ["type"] = "voyager.card.event", ["v"] = 1, ["kind"] = kind, ["platform"] = platform, ["userId"] = Cut(id, 128), ["login"] = Cut(login, 80),
            ["name"] = Cut(name.Length > 0 ? name : login, 80), ["tier"] = Tier(platform, id, login), ["points"] = points, ["rank"] = rank, ["members"] = members
        };
    }
    // Highest of PLATINUM, GOLD, SILVER and BLUE GROUP; everyone else gets the Blue Explorer card (as before).
    private string Tier(string platform, string id, string login)
    {
        string[] groups = { "PLATINUM GROUP", "GOLD GROUP", "SILVER GROUP" };
        for (int g = 0; g < groups.Length; g++)
        {
            try
            {
                if (!CPH.GroupExists(groups[g])) continue;
                var users = CPH.UsersInGroup(groups[g]);
                if (users == null) continue;
                foreach (var u in users)
                {
                    if (u == null) continue;
                    if (!String.IsNullOrEmpty((u.Type ?? "")) && !String.Equals(u.Type, platform, StringComparison.OrdinalIgnoreCase)) continue;
                    if ((id.Length > 0 && u.Id == id) || (login.Length > 0 && String.Equals(u.Login ?? "", login, StringComparison.OrdinalIgnoreCase))) return Tiers[3 - g];
                }
            }
            catch (Exception ex) { CPH.LogWarn("[Voyager Membership Card] " + groups[g] + ": " + ex.Message); }
        }
        return "blue";
    }
    // The viewer's "points" balance and their place on that platform's points leaderboard (bucket accounts left out).
    private void Points(string platform, string id, string login, out long points, out long rank, out long members)
    {
        points = -1; rank = 0; members = 0;
        object records;
        if (platform == "twitch") records = CPH.GetTwitchUsersVar<object>("points", true);
        else if (platform == "youtube") records = CPH.GetYouTubeUsersVar<object>("points", true);
        else records = CPH.GetKickUsersVar<object>("points", true);
        if (records == null) return;
        var values = new List<long>();
        foreach (JToken token in JArray.FromObject(records))
        {
            string uid = (string)token["UserId"] ?? "", ulogin = ((string)token["UserLogin"] ?? "").ToLowerInvariant();
            if (Buckets.Contains(ulogin)) continue;
            JValue raw = token["Value"] as JValue; if (raw == null || raw.Value == null) continue;
            double n; if (!Double.TryParse(Convert.ToString(raw.Value, CultureInfo.InvariantCulture), NumberStyles.Float, CultureInfo.InvariantCulture, out n)) continue;
            long v = (long)Math.Floor(n); values.Add(v);
            if ((id.Length > 0 && uid == id) || (id.Length == 0 && login.Length > 0 && ulogin == login)) points = v;
        }
        members = values.Count;
        if (points >= 0) { long p = points; rank = values.Count(x => x > p) + 1; }
    }
    private void Say(string message)
    {
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
            catch (Exception ex) { CPH.LogWarn("[Voyager Membership Card] " + platform + " message failed: " + ex.Message); }
        }
    }
    private static string Cut(string s, int max) { s = s ?? ""; return s.Length > max ? s.Substring(0, max) : s; }
    private bool Flag(string key) { bool value; return Boolean.TryParse(Read(key), out value) && value; }
    private string Read(string key) { object value; return CPH.TryGetArg<object>(key, out value) && value != null ? Convert.ToString(value, CultureInfo.InvariantCulture) : ""; }
}
// End of Voyager Membership Card v1.
