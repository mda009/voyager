// Voyager Stream Stats v5 - native community ledger and optional stored user sources.
// Action: Voyager - Stream Stats (dedicated Voyager Stats queue).
// Sub-actions, in this order:
// 1. Twitch > Followers > Get Follower Count
// 2. Twitch > Subscribers > Get Subscriber Count
// 3. Core > C# > Execute C# Code (this entire file)
// No triggers, waits, chat messages, or giveaway actions are required.
// This action only reads counters, user variables, memberships and giveaway state.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    private static readonly string[] Platforms = { "twitch", "youtube", "kick" };
    private static readonly string[] Groups = { "blue", "silver", "gold", "platinum", "vip" };
    public bool Execute()
    {
        string requestId = Read("requestId");
        var payload = new JObject { ["type"] = "voyager.stream.stats.v1", ["requestId"] = requestId, ["serverAt"] = Now(), ["schema"] = 1 };
        try
        {
            string raw = Read("ccSources");
            if (raw.Length > 12000) throw new Exception("Data source settings are too large.");
            var settings = raw.Length == 0 ? new JObject() : JObject.Parse(raw);
            var metrics = new JObject(); var boards = new JObject();
            JObject community = null; string communityError = "";
            try { string nativeRaw = CPH.GetGlobalVar<string>("VoyagerCommunityStateV1", true); if (!String.IsNullOrEmpty(nativeRaw)) { community = JObject.Parse(nativeRaw); if ((int?)community["schema"] != 1) throw new Exception("Unsupported community ledger schema."); if (!(community["platforms"] is JObject)) throw new Exception("Invalid community ledger platforms."); foreach (JProperty entry in ((JObject)community["platforms"]).Properties()) { JObject p = entry.Value as JObject; if (p == null || !(p["users"] is JObject)) throw new Exception("Invalid community user records: " + entry.Name); } } }
            catch (Exception ex) { communityError = ex.Message; }
            payload["communityVersion"] = 1;
            payload["pointsLeaderboardVersion"] = 1;
            payload["pilotLeaderboardVersion"] = 1;
            payload["communityStartedAt"] = community == null ? null : community["startedAt"];
            foreach (string platform in Platforms)
            {
                var source = settings[platform] as JObject ?? new JObject();
                bool persisted = (bool?)source["persisted"] ?? true;
                metrics[platform] = new JObject
                {
                    ["followers"] = Counter(source, "followers", persisted, platform == "twitch" ? "followerCount" : ""),
                    ["subscriptions"] = Counter(source, "subscriptions", persisted, platform == "twitch" ? "subscriberCount" : "")
                };
                boards[platform] = (string)source["leaderboardMode"] != "custom" ? NativeBoards(platform, community, communityError) : new JObject
                {
                    ["watchtime"] = Leaderboard(platform, source, "watchtime", persisted),
                    ["months"] = Leaderboard(platform, source, "months", persisted),
                    ["gifts"] = Leaderboard(platform, source, "gifts", persisted)
                };
                // Read the same persisted balance used by Voyager points and Versus.
                // Independent of watch-time mode and temporary-variable preferences.
                JObject points = Leaderboard(platform, new JObject { ["points"] = "points" }, "points", true);
                points["mode"] = "voyager"; points["basis"] = "current_balance";
                points["persisted"] = true; boards[platform]["points"] = points;
            }
            boards["twitch"]["pilots"] = Pilots();
            var members = new JObject();
            foreach (string key in Groups)
            {
                try
                {
                    string group = key.ToUpperInvariant() + " GROUP";
                    if (!CPH.GroupExists(group)) { members[key] = Missing("Group not found: " + group); continue; }
                    var users = CPH.UsersInGroup(group);
                    if (users == null) { members[key] = Missing("Group could not be read."); continue; }
                    var unique = new HashSet<string>(StringComparer.Ordinal);
                    foreach (var u in users)
                    {
                        if (u == null) continue;
                        string identity = !String.IsNullOrWhiteSpace(u.Id) ? "id:" + u.Id : "login:" + (u.Login ?? "").ToLowerInvariant();
                        if (identity == "login:") continue;
                        unique.Add((u.Type ?? "").ToLowerInvariant() + ":" + identity);
                    }
                    members[key] = Value(unique.Count, "Streamer.bot group");
                }
                catch (Exception ex) { members[key] = Missing(ex.Message); }
            }
            payload["metrics"] = metrics; payload["boards"] = boards; payload["members"] = members;
            payload["giveaway"] = Giveaway(); payload["ok"] = true;
        }
        catch (Exception ex) { payload["ok"] = false; payload["error"] = ex.Message; CPH.LogWarn("[Voyager Stream Stats] " + ex.Message); }
        CPH.WebsocketBroadcastJson(payload.ToString(Formatting.None));
        return (bool?)payload["ok"] == true;
    }
    private JObject Pilots()
    {
        var result=new JObject{["mode"]="versus",["basis"]="saved_battle_wins",["status"]="unconfigured",["rows"]=new JArray(),["readAt"]=Now()};
        try
        {
            string raw=CPH.GetGlobalVar<string>("VoyagerPilotLeaderboardV1",true);
            if(String.IsNullOrEmpty(raw)){result["reason"]="Start Voyager Versus, connect Streamer.bot and install the Pilot Leaderboard update. Saved rankings sync automatically.";return result;}
            JObject data=JObject.Parse(raw);JArray rows=data["rows"] as JArray;
            if((int?)data["schema"]!=1 || (string)data["source"]!="voyager-versus-rankings" || rows==null || rows.Count>100)throw new Exception("Invalid saved pilot rankings. Reconnect the updated Versus host.");
            double published,total,invalid;
            if(!Number(data["publishedAt"],out published) || !Number(data["totalRecords"],out total) || !Number(data["invalidRecords"],out invalid))throw new Exception("Invalid pilot sync metadata.");
            var seen=new HashSet<string>(StringComparer.Ordinal);
            foreach(JToken r in rows)
            {
                double wins,losses,draws,battles;string login=(string)r["login"]??"";
                if((login.Length==0 || login.Length>25 || login.Any(c=>!((c>='a' && c<='z') || (c>='0' && c<='9') || c=='_'))) || !seen.Add(login) || !Number(r["wins"],out wins) || !Number(r["losses"],out losses) || !Number(r["draws"],out draws) || !Number(r["battles"],out battles) || wins%1!=0 || losses%1!=0 || draws%1!=0 || battles<=0 || wins+losses+draws!=battles || (double?)r["value"]!=wins)throw new Exception("Invalid saved pilot totals. Reconnect the Versus host to resync.");
            }
            result["status"]="ok";result["rows"]=rows.DeepClone();result["totalRecords"]=total;result["publishedAt"]=published;result["invalidRecords"]=invalid;
            result["reason"]=rows.Count==0?"No completed live battles saved yet.":"";
            string warning=Now()-published>180000?"Showing last saved rankings. Start Voyager Versus and connect Streamer.bot to resume syncing.":"";
            if(invalid>0)warning+=(warning.Length>0?" ":"")+invalid+" invalid ranking records skipped.";
            result["warning"]=warning;result["stale"]=Now()-published>180000;
        }
        catch(Exception ex){result["status"]="error";result["reason"]=ex.Message;}
        return result;
    }
    private JObject Counter(JObject source, string key, bool persisted, string nativeArg)
    {
        try
        {
            string variable = Variable(source, key);
            object raw;
            if (variable.Length > 0)
            {
                raw = CPH.GetGlobalVar<object>(variable, persisted);
                double n;
                if (!Number(raw, out n) || n % 1 != 0) return Missing("Counter is missing or is not a non-negative whole number: " + variable);
                return Value(n, "Stored counter: " + variable);
            }
            if (nativeArg.Length > 0)
            {
                double n;
                if (!CPH.TryGetArg<object>(nativeArg, out raw) || !Number(raw, out n) || n % 1 != 0)
                    return Missing("Add the Twitch " + (key == "followers" ? "Get Follower Count" : "Get Subscriber Count") + " sub-action before this C# code.");
                return Value(n, "Twitch channel count");
            }
            return new JObject { ["status"] = "unconfigured", ["value"] = null, ["reason"] = "Connect a saved counter or enter a manual total in Settings." };
        }
        catch (Exception ex) { return Missing(ex.Message); }
    }
    private JObject Leaderboard(string platform, JObject source, string kind, bool persisted)
    {
        var result = new JObject { ["status"] = "unconfigured", ["rows"] = new JArray(), ["readAt"] = Now() };
        try
        {
            string variable = Variable(source, kind);
            if (variable.Length == 0) { result["reason"] = "Choose your saved " + kind + " user variable in Settings."; return result; }
            string units = (string)source["watchtimeUnits"] ?? "minutes";
            if (kind == "watchtime" && units != "seconds" && units != "minutes" && units != "hours") throw new Exception("Choose seconds, minutes or hours for watch time.");
            object records;
            if (platform == "twitch") records = CPH.GetTwitchUsersVar<object>(variable, persisted);
            else if (platform == "youtube") records = CPH.GetYouTubeUsersVar<object>(variable, persisted);
            else records = CPH.GetKickUsersVar<object>(variable, persisted);
            if (records == null) throw new Exception("The saved user variable could not be read.");
            var values = JArray.FromObject(records);
            var rows = new Dictionary<string, JObject>(StringComparer.Ordinal);
            int invalid = 0, excluded = 0;
            foreach (var token in values)
            {
                string id = (string)token["UserId"] ?? "", login = (string)token["UserLogin"] ?? "", name = (string)token["UserName"] ?? login;
                if (kind == "points" && platform == "twitch" && new [] { "mdavoyagersilver", "mdavoyagergold", "mdavoyagerplatinum" }.Contains(login.ToLowerInvariant())) { excluded++; continue; }
                double n;
                if (!Number(token["Value"], out n) || (kind != "watchtime" && n % 1 != 0) || (id.Length == 0 && login.Length == 0)) { invalid++; continue; }
                if (kind == "watchtime") n /= units == "seconds" ? 3600.0 : units == "minutes" ? 60.0 : 1.0;
                string identity = id.Length > 0 ? "id:" + id : "login:" + login.ToLowerInvariant();
                rows[identity] = new JObject { ["key"] = platform + ":" + identity, ["name"] = name, ["login"] = login, ["platform"] = platform, ["value"] = Math.Round(n, 4), ["lastWrite"] = token["LastWrite"] == null ? null : token["LastWrite"].DeepClone() };
            }
            result["status"] = "ok"; result["variable"] = variable; result["units"] = kind == "watchtime" ? "hours" : kind;
            result["totalRecords"] = rows.Count; result["invalidRecords"] = invalid; result["excludedRecords"] = excluded;
            result["rows"] = new JArray(rows.Values.OrderByDescending(x => (double)x["value"]).ThenBy(x => (string)x["name"], StringComparer.OrdinalIgnoreCase).Take(100));
            if (rows.Count == 0) result["reason"] = kind == "points" ? "No saved Voyager points balances found for this platform." : "No numeric records found. Check the variable name and persisted setting.";
            else if (invalid > 0) result["reason"] = invalid + " invalid records skipped.";
        }
        catch (Exception ex) { result["status"] = "error"; result["reason"] = ex.Message; }
        return result;
    }
    private JObject NativeBoards(string platform, JObject ledger, string error)
    {
        var boards = new JObject();
        JObject meta = ledger == null ? null : ledger["platforms"]?[platform] as JObject;
        JObject users = meta == null ? null : meta["users"] as JObject;
        foreach (string kind in new [] { "watchtime", "months", "gifts" })
        {
            string basis = kind == "watchtime" ? "live_chat_presence" : kind == "months" || platform == "twitch" ? "platform_reported" : "observed_since_tracking";
            var rows = new List<JObject>(); int invalid = 0;
            if (users != null) foreach (JProperty property in users.Properties())
            {
                JObject u = property.Value as JObject; if (u == null) { invalid++; continue; }
                double value; JToken token = u[kind == "watchtime" ? "watchSeconds" : kind];
                if (token == null) continue;
                if (!Number(token, out value) || value % 1 != 0) { invalid++; continue; }
                if (value <= 0) continue;
                if (kind == "watchtime") value /= 3600.0;
                rows.Add(new JObject { ["key"] = platform + ":" + property.Name, ["name"] = (string)u["name"] ?? (string)u["login"] ?? property.Name, ["login"] = (string)u["login"] ?? "", ["platform"] = platform, ["value"] = Math.Round(value, 4), ["basis"] = basis, ["lastWrite"] = u[kind == "watchtime" ? "watchUpdatedAt" : kind + "UpdatedAt"] });
            }
            string reason = error.Length > 0 ? error : ledger == null ? "Install/enable Voyager - Community Tracker to begin collecting native records." : rows.Count == 0 ? (kind == "watchtime" ? "Waiting for consecutive live presence samples. Set Present Viewers to one minute." : kind == "months" ? "Waiting for platform subscription/membership events with tenure." : platform == "twitch" ? "Waiting for a public gift event with a shared lifetime total." : "Waiting for observed gift events.") : "";
            boards[kind] = new JObject { ["status"] = error.Length > 0 ? "error" : "ok", ["mode"] = "native", ["basis"] = basis, ["units"] = kind == "watchtime" ? "hours" : kind, ["totalRecords"] = rows.Count, ["invalidRecords"] = invalid, ["reason"] = reason, ["startedAt"] = meta == null ? null : meta["startedAt"], ["lastEventAt"] = meta == null ? null : meta["lastEventAt"], ["lastPresenceAt"] = meta == null ? null : meta["lastPresenceAt"], ["live"] = meta == null ? null : meta["live"], ["warning"] = meta == null ? "" : (string)meta["warning"] ?? "", ["rows"] = new JArray(rows.OrderByDescending(x => (double)x["value"]).ThenBy(x => (string)x["name"], StringComparer.OrdinalIgnoreCase).Take(100)) };
        }
        return boards;
    }
    private JObject Giveaway()
    {
        try
        {
            string raw = CPH.GetGlobalVar<string>("VoyagerGiveawayStateV1", true);
            if (String.IsNullOrEmpty(raw)) return new JObject { ["status"] = "none" };
            var state = JObject.Parse(raw); var session = state["session"] as JObject; var preview = state["preview"] as JObject; var display = session ?? preview;
            if (display == null) return new JObject { ["status"] = "none" };
            var draws = display["draws"] as JArray ?? new JArray();
            // Index the JSON array directly. Calling a LINQ extension on JArray
            // can require extra System binding-interface references in the editor.
            JToken current = null;
            string currentDrawId = (string)display["currentDrawId"];
            for (int i = 0; i < draws.Count; i++)
            {
                JToken candidate = draws[i];
                if ((string)candidate["id"] != currentDrawId) continue;
                current = candidate;
                break;
            }
            return new JObject { ["title"] = (string)display["title"], ["status"] = current != null ? (string)current["status"] : ((bool?)display["entriesOpen"] == true ? "open" : "locked"), ["mode"] = (string)display["mode"], ["count"] = (display["pool"] as JArray ?? new JArray()).Count, ["winner"] = current == null ? "" : (string)current["winner"]["name"] };
        }
        catch { return new JObject { ["status"] = "unavailable" }; }
    }
    private static string Variable(JObject source, string key)
    {
        string value = ((string)source[key] ?? "").Trim();
        if (value.Length > 128 || value.Any(Char.IsControl)) throw new Exception("Invalid variable name.");
        return value;
    }
    private static bool Number(object raw, out double value)
    {
        value = 0;
        if (raw == null || raw is bool) return false;
        var token = raw as JToken;
        if (token != null && token.Type != JTokenType.Integer && token.Type != JTokenType.Float && token.Type != JTokenType.String) return false;
        string text = Convert.ToString(raw, CultureInfo.InvariantCulture);
        return Double.TryParse(text, NumberStyles.Float, CultureInfo.InvariantCulture, out value) && !Double.IsNaN(value) && !Double.IsInfinity(value) && value >= 0 && value <= 9007199254740991D;
    }
    private static JObject Value(double value, string source) { return new JObject { ["status"] = "ok", ["value"] = value, ["source"] = source, ["readAt"] = Now() }; }
    private static JObject Missing(string reason) { return new JObject { ["status"] = "error", ["value"] = null, ["reason"] = reason }; }
    private string Read(string name) { object value; return CPH.TryGetArg<object>(name, out value) && value != null ? Convert.ToString(value) : ""; }
    private static long Now() { return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(); }
}
// End of Voyager Stream Stats v5.
