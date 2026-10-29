// Voyager Twitch Analytics v1. Dedicated blocking queue; Concurrent OFF.
// Counts messages in this channel by UTC day, including offline chat. No chat text is stored.
using System;
using System.Globalization;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
public class CPHInline
{
    private const string Store = "VoyagerTwitchAnalyticsV1";
    private static readonly object Gate = new object();
    public bool Execute()
    {
        bool chat = CPH.GetEventType().ToString() == "TwitchChatMessage";
        string requestId = Read("requestId");
        if (Flag("isTest") || Flag("isFromSharedChatGuest")) return true;
        if (!chat && Read("analyticsOperation") != "snapshot") return true;
        Guid id;
        if (!chat && !Guid.TryParse(requestId, out id)) return false;
        lock (Gate)
        {
            try
            {
                long now = Now(); string day = DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
                string raw = CPH.GetGlobalVar<string>(Store, true);
                JObject s = String.IsNullOrEmpty(raw) ? new JObject { ["schema"] = 1, ["startedAt"] = now, ["history"] = new JArray() } : JObject.Parse(raw);
                if ((int?)s["schema"] != 1 || !(s["history"] is JArray)) throw new Exception("Invalid analytics ledger; saved data was preserved.");
                JObject today = s["today"] as JObject;
                if (s["today"] != null && (today == null || !(today["users"] is JObject) || !(today["messageIds"] is JArray) || !(today["minutes"] is JObject))) throw new Exception("Invalid saved day; data was preserved.");
                if (today == null || (string)today["date"] != day)
                {
                    JArray history = (JArray)s["history"];
                    if (today != null) history.Add(Summary(today));
                    while (history.Count > 30) history.RemoveAt(0);
                    today = new JObject { ["date"] = day, ["messages"] = 0, ["users"] = new JObject(), ["messageIds"] = new JArray(), ["minutes"] = new JObject(), ["firstCapturedAt"] = 0, ["lastCapturedAt"] = 0, ["warning"] = "" };
                    s["today"] = today;
                }
                if (chat)
                {
                    string uid = Read("userId"), mid = Read("msgId");
                    if (mid.Length == 0) mid = Read("messageId");
                    if (uid.Length == 0 || uid.Length > 40 || !uid.All(Char.IsDigit)) throw new Exception("Chat event is missing a valid Twitch userId.");
                    JArray ids = (JArray)today["messageIds"];
                    if (mid.Length > 0 && ids.Any(x => (string)x == mid)) return true;
                    if (mid.Length > 0) { ids.Add(mid.Length > 160 ? mid.Substring(0,160) : mid); while (ids.Count > 10000) ids.RemoveAt(0); }
                    else today["warning"] = "Some events had no message ID and could not be deduplicated.";
                    JObject users = (JObject)today["users"];
                    if (users[uid] == null)
                    {
                        if (users.Count < 50000) users[uid] = true;
                        else today["warning"] = "50,000 distinct-account limit reached; unique chatters is a lower bound.";
                    }
                    today["messages"] = N(today["messages"]) + 1;
                    if (N(today["firstCapturedAt"]) == 0) today["firstCapturedAt"] = now;
                    today["lastCapturedAt"] = now;
                    JObject minutes = (JObject)today["minutes"];
                    string minute = (now / 60000).ToString(CultureInfo.InvariantCulture);
                    minutes[minute] = N(minutes[minute]) + 1;
                    foreach (JProperty p in minutes.Properties().ToList()) { long m; if (!Int64.TryParse(p.Name, out m) || m < now / 60000 - 5) p.Remove(); }
                }
                CPH.SetGlobalVar(Store, s.ToString(Formatting.None), true);
                if (!chat)
                {
                    long total = 0, minute = now / 60000;
                    for (long m = minute - 5; m < minute; m++) total += N(today["minutes"][m.ToString(CultureInfo.InvariantCulture)]);
                    Reply(new JObject { ["type"] = "voyager.twitch.analytics.v1", ["schema"] = 1, ["ok"] = true, ["requestId"] = requestId, ["generatedAt"] = now, ["startedAt"] = s["startedAt"], ["today"] = Summary(today), ["messagesPerMinute"] = total / 5.0, ["history"] = s["history"].DeepClone() });
                }
                return true;
            }
            catch (Exception ex)
            {
                CPH.LogWarn("[Voyager Twitch Analytics] " + ex.Message);
                if (!chat) Reply(new JObject { ["type"] = "voyager.twitch.analytics.v1", ["schema"] = 1, ["ok"] = false, ["requestId"] = requestId, ["error"] = ex.Message });
                return false;
            }
        }
    }
    private JObject Summary(JObject d) { return new JObject { ["date"] = d["date"], ["messages"] = N(d["messages"]), ["uniqueChatters"] = ((JObject)d["users"]).Count, ["firstCapturedAt"] = N(d["firstCapturedAt"]), ["lastCapturedAt"] = N(d["lastCapturedAt"]), ["warning"] = (string)d["warning"] ?? "" }; }
    private void Reply(JObject data) { CPH.WebsocketBroadcastJson(data.ToString(Formatting.None)); }
    private string Read(string key) { object value; return CPH.TryGetArg<object>(key, out value) && value != null ? Convert.ToString(value, CultureInfo.InvariantCulture) ?? "" : ""; }
    private bool Flag(string key) { bool value; return Boolean.TryParse(Read(key), out value) && value; }
    private long N(JToken value) { long n; return value != null && Int64.TryParse(value.ToString(), NumberStyles.Integer, CultureInfo.InvariantCulture, out n) ? n : 0; }
    private long Now() { return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(); }
}
