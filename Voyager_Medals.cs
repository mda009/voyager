// Voyager Medals v1.1 - data for Voyager's medal system (Voyager 2.18) and the !medals chat command.
// Action name: Voyager - Medals. One Core > C# > Execute C# Code sub-action (this whole file). Untick Concurrent.
// Trigger: Core > Commands > Command Triggered: !medals (Permitted: Everyone; Twitch, YouTube and Kick sources).
// The Voyager host runs this action about once a minute (medalExport=1). It only READS:
//   Voyager - Community Tracker: watch time, months subscribed, gifted subs, first seen;
//   Voyager - Fleet Alerts: Bits, Kicks, follows, gift drops and Super Chats;
//   Voyager Giveaway Engine: confirmed winners.
// The host also runs it with medalSay to post medal announcements in chat.
// It never changes points, tickets, groups or giveaways.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    private static readonly string[] Platforms = { "twitch", "youtube", "kick" };
    public bool Execute()
    {
        try
        {
            string say = Read("medalSay");
            if (say.Length > 0) { Say(say.Length > 450 ? say.Substring(0, 450) : say); return true; }
            if (Read("medalExport") == "1") { Export(); return true; }
            if (Flag("isTest") || Flag("isFromSharedChatGuest")) return true;
            string command = Read("command").Trim().ToLowerInvariant();
            if (command != "!medals") return true;
            string platform = Read("commandSource").Trim().ToLowerInvariant();
            if (platform != "twitch" && platform != "youtube" && platform != "kick") return true;
            string name = Read("user"); if (name.Length == 0) name = Read("userName");
            var ev = new JObject
            {
                ["type"] = "voyager.medals.event", ["v"] = 1, ["kind"] = "medals", ["platform"] = platform,
                ["userId"] = Read("userId"), ["login"] = Read("userName").TrimStart('@').ToLowerInvariant(), ["name"] = name
            };
            CPH.WebsocketBroadcastJson(ev.ToString(Formatting.None));
            return true;
        }
        catch (Exception ex) { CPH.LogWarn("[Voyager Medals] " + ex.Message); return false; }
    }

    private void Export()
    {
        long since = Math.Max(0, ArgNumber("since"));
        var users = new JArray(); var crew = new JArray(); var gifts = new JArray(); var chats = new JArray(); var wins = new JArray(); var warnings = new JArray();
        try
        {
            string raw = CPH.GetGlobalVar<string>("VoyagerCommunityStateV1", true);
            if (!String.IsNullOrEmpty(raw))
            {
                JObject state = JObject.Parse(raw);
                foreach (string platform in Platforms)
                {
                    JObject list = state["platforms"]?[platform]?["users"] as JObject;
                    if (list == null) continue;
                    var rows = new List<JObject>();
                    foreach (JProperty p in list.Properties())
                    {
                        JObject u = p.Value as JObject; if (u == null) continue;
                        long watch = L(u["watchSeconds"]), months = L(u["months"]), gift = L(u["gifts"]);
                        long changed = Math.Max(Math.Max(L(u["lastSeenAt"]), L(u["watchUpdatedAt"])), Math.Max(L(u["monthsUpdatedAt"]), L(u["giftsUpdatedAt"])));
                        if (changed < since) continue;
                        if (watch < 60 && months <= 0 && gift <= 0) continue;
                        rows.Add(new JObject
                        {
                            ["key"] = platform + ":" + p.Name, ["name"] = Cut((string)u["name"] ?? (string)u["login"] ?? p.Name, 80), ["login"] = Cut((string)u["login"] ?? "", 80),
                            ["watchSeconds"] = watch, ["months"] = months, ["gifts"] = gift, ["firstSeenAt"] = L(u["firstSeenAt"])
                        });
                    }
                    foreach (JObject r in rows.OrderByDescending(x => (long)x["watchSeconds"]).Take(10000)) users.Add(r);
                }
            }
        }
        catch (Exception ex) { warnings.Add("Community Tracker: " + ex.Message); }
        try
        {
            string raw = CPH.GetGlobalVar<string>("VoyagerFleetAlertsV1", true);
            if (!String.IsNullOrEmpty(raw))
            {
                JObject s = JObject.Parse(raw);
                JObject roster = s["crew"] as JObject;
                if (roster != null)
                {
                    var rows = new List<JObject>();
                    foreach (JProperty p in roster.Properties())
                    {
                        JObject u = p.Value as JObject; if (u == null) continue;
                        if (Math.Max(L(u["lastEventAt"]), L(u["firstSeenAt"])) < since) continue;
                        rows.Add(new JObject
                        {
                            ["key"] = p.Name, ["name"] = Cut((string)u["name"] ?? "", 80), ["login"] = Cut((string)u["login"] ?? "", 80),
                            ["bits"] = L(u["bits"]), ["kicks"] = L(u["kicks"]), ["follow"] = L(u["follow"]), ["firstSeenAt"] = L(u["firstSeenAt"])
                        });
                    }
                    foreach (JObject r in rows.Take(10000)) crew.Add(r);
                }
                JArray history = s["history"] as JArray;
                if (history != null)
                {
                    // Index loops, not LINQ: LINQ over a JArray needs an extra System.dll reference in Streamer.bot.
                    for (int h = 0; h < history.Count; h++)
                    {
                        JObject e = history[h] as JObject; if (e == null) continue;
                        if ((bool?)e["test"] == true) continue;
                        long at = L(e["receivedAt"]);
                        if (at < since - 600000L) continue;
                        string platform = (string)e["platform"] ?? "twitch", id = (string)e["userId"] ?? "", source = (string)e["source"] ?? "";
                        if (id.Length == 0 || id.Length > 128) continue;
                        int stage = (int?)e["stage"] ?? 0;
                        if (stage == 3) gifts.Add(new JObject { ["id"] = (string)e["id"] ?? "", ["key"] = platform + ":" + id, ["amount"] = L(e["amount"]), ["at"] = at });
                        if (source == "YouTubeSuperChat" || source == "YouTubeSuperSticker")
                        {
                            long micro; if (!Int64.TryParse((string)e["microAmount"] ?? "", NumberStyles.Integer, CultureInfo.InvariantCulture, out micro) || micro < 0) micro = 0;
                            chats.Add(new JObject { ["id"] = (string)e["id"] ?? "", ["key"] = platform + ":" + id, ["micro"] = micro, ["at"] = at });
                        }
                    }
                }
            }
        }
        catch (Exception ex) { warnings.Add("Fleet Alerts: " + ex.Message); }
        try
        {
            string raw = CPH.GetGlobalVar<string>("VoyagerGiveawayStateV1", true);
            if (!String.IsNullOrEmpty(raw))
            {
                JArray audit = JObject.Parse(raw)["audit"] as JArray;
                if (audit != null)
                {
                    for (int a = 0; a < audit.Count; a++)
                    {
                        JObject d = audit[a] as JObject; if (d == null) continue;
                        if ((string)d["status"] != "confirmed") continue;
                        JObject w = d["winner"] as JObject; if (w == null) continue;
                        long at = L(d["confirmedAt"]); if (at == 0) at = L(d["at"]);
                        if (at < since - 86400000L) continue;
                        wins.Add(new JObject
                        {
                            ["id"] = (string)d["id"] ?? "", ["platform"] = (string)w["platform"] ?? "", ["userId"] = (string)w["id"] ?? "",
                            ["login"] = Cut((string)w["login"] ?? "", 80), ["name"] = Cut((string)w["name"] ?? "", 80), ["at"] = at
                        });
                    }
                }
            }
        }
        catch (Exception ex) { warnings.Add("Giveaways: " + ex.Message); }
        var payload = new JObject
        {
            ["type"] = "voyager.medals.data", ["v"] = 1, ["requestId"] = Read("requestId"), ["at"] = Now(), ["since"] = since,
            ["users"] = users, ["crew"] = crew, ["giftEvents"] = gifts, ["superChats"] = chats, ["wins"] = wins, ["warnings"] = warnings
        };
        CPH.WebsocketBroadcastJson(payload.ToString(Formatting.None));
    }

    private void Say(string message)
    {
        foreach (string platform in Platforms)
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
            catch (Exception ex) { CPH.LogWarn("[Voyager Medals] " + platform + " message failed: " + ex.Message); }
        }
    }
    private static long Now() { return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(); }
    private static long L(JToken t)
    {
        JValue v = t as JValue; if (v == null || v.Value == null) return 0;
        double d; return Double.TryParse(Convert.ToString(v.Value, CultureInfo.InvariantCulture), NumberStyles.Float, CultureInfo.InvariantCulture, out d) && d > 0 && d < 9e15 ? (long)d : 0;
    }
    private static string Cut(string s, int max) { s = s ?? ""; return s.Length > max ? s.Substring(0, max) : s; }
    private long ArgNumber(string key) { long n; return Int64.TryParse(Read(key), NumberStyles.Integer, CultureInfo.InvariantCulture, out n) && n >= 0 ? n : -1; }
    private bool Flag(string key) { bool value; return Boolean.TryParse(Read(key), out value) && value; }
    private string Read(string key) { object value; return CPH.TryGetArg<object>(key, out value) && value != null ? Convert.ToString(value, CultureInfo.InvariantCulture) : ""; }
}
// End of Voyager Medals v1.1.
