// Voyager Security Monitor v1. One enabled action, Voyager Security blocking queue, Concurrent OFF.
// Observation and review only: never bans, sends chat, changes points or changes giveaway eligibility.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
public class CPHInline
{
    private const string Store = "VoyagerSecurityStateV1", FeedStore = "VoyagerSecurityFeedV1";
    private static readonly object Gate = new object();
    private static JObject Feed;
    private const long Day = 86400000L;
    public bool Execute()
    {
        string kind = CPH.GetEventType().ToString(), requestId = Read("requestId");
        bool native = new [] { "TwitchPresentViewers", "TwitchChatMessage", "TwitchFollow", "TwitchSuspiciousUserMessage", "TwitchSuspiciousUserUpdate", "TwitchUserBanned", "TwitchUserUnbanned" }.Contains(kind);
        if (Flag("isTest") || Flag("isFromSharedChatGuest")) return true;
        string op = native ? "" : Read("securityOperation");
        if (!native && !new [] { "snapshot", "lookup", "profile", "review", "settings", "feed", "import", "remove_report" }.Contains(op)) return true;
        if (!native) { Guid g; if (!Guid.TryParse(requestId, out g)) return false; }
        lock (Gate)
        {
            try
            {
                long now = Now(); JObject state = Load();
                if (native)
                {
                    Capture(state, kind, now);
                    if (kind == "TwitchPresentViewers") { Pool(state); EnrichBatch(state); Cleanup(state, now); RefreshFeed(state, false); }
                    Save(state); return true;
                }
                JArray done = (JArray)state["requests"];
                if (done.Any(x => (string)x == requestId)) { Reply(state, requestId, ""); return true; }
                if (op == "lookup")
                {
                    string login = Read("securityLogin").Trim().TrimStart('@').ToLowerInvariant();
                    if (!Login(login)) throw new Exception("Enter a Twitch login (letters, numbers and underscores). Do not enter a URL.");
                    var info = CPH.TwitchGetUserInfoByLogin(login);
                    if (info == null || !Id(info.UserId)) throw new Exception("Twitch did not resolve that login. This does not prove the account is banned or compromised.");
                    JObject row = User(state, info.UserId, info.UserLogin, info.UserName, false); Enrich(row, true); state["selectedId"] = info.UserId;
                }
                else if (op == "profile") { JObject row = RequireUser(state); Enrich(row, true); state["selectedId"] = row["id"]; }
                else if (op == "review") Review(state, now);
                else if (op == "settings") Settings(state);
                else if (op == "feed") RefreshFeed(state, true);
                else if (op == "import") Import(state, now);
                else if (op == "remove_report") { string key = Read("reportId"); JArray reports = (JArray)state["reports"]; for (int i = reports.Count - 1; i >= 0; i--) if ((string)reports[i]["key"] == key) reports.RemoveAt(i); Audit(state, "remove_report", "", "Removed report " + Cut(key, 100)); }
                Pool(state); Cleanup(state, now);
                if (op != "snapshot") { done.Add(requestId); while (done.Count > 500) done.RemoveAt(0); }
                Save(state); Reply(state, requestId, ""); return true;
            }
            catch (Exception ex)
            {
                CPH.LogWarn("[Voyager Security] " + ex.Message);
                if (!native) Reply(null, requestId, ex.Message);
                return false;
            }
        }
    }
    private JObject Load()
    {
        string raw = CPH.GetGlobalVar<string>(Store, true);
        JObject s = String.IsNullOrEmpty(raw) ? new JObject { ["schema"] = 1, ["startedAt"] = Now(), ["users"] = new JObject(), ["health"] = new JObject(), ["audit"] = new JArray(), ["reports"] = new JArray(), ["requests"] = new JArray(), ["settings"] = new JObject { ["version"] = 0, ["feedEnabled"] = true, ["protectedLogins"] = "mda009" } } : JObject.Parse(raw);
        if ((int?)s["schema"] != 1 || !(s["users"] is JObject) || !(s["health"] is JObject) || !(s["audit"] is JArray) || !(s["reports"] is JArray) || !(s["requests"] is JArray) || !(s["settings"] is JObject)) throw new Exception("Invalid saved security ledger; it was preserved.");
        return s;
    }
    private void Save(JObject s) { s["updatedAt"] = Now(); CPH.SetGlobalVar(Store, s.ToString(Formatting.None), true); }
    private JObject User(JObject state, string id, string login, string name, bool seen)
    {
        if (!Id(id)) throw new Exception("Missing or invalid Twitch account ID.");
        JObject users = (JObject)state["users"], row = users[id] as JObject;
        if (row == null)
        {
            if (users[id] != null) throw new Exception("Invalid saved security account; data was preserved.");
            if (users.Count >= 10000) { state["health"]["capacityWarning"] = "10,000-account limit reached. New accounts are not collected until inactive unreviewed records expire."; throw new Exception("Security account capacity reached. Review retention in the setup guide."); }
            row = new JObject { ["id"] = id, ["addedAt"] = Now(), ["firstSeenAt"] = seen ? Now() : 0, ["lastSeenAt"] = seen ? Now() : 0, ["messages"] = new JArray(), ["messageIds"] = new JArray(), ["entryAttempts"] = new JArray(), ["events"] = new JArray(), ["aliases"] = new JArray(), ["review"] = new JObject { ["version"] = 0, ["status"] = "unreviewed", ["note"] = "", ["relatedIds"] = new JArray() } }; users[id] = row;
        }
        login = login.Trim().ToLowerInvariant();
        if (Login(login))
        {
            string prior = (string)row["login"] ?? ""; if (prior.Length > 0 && prior != login) { JArray aliases = (JArray)row["aliases"]; if (!aliases.Any(x => (string)x == prior)) aliases.Add(prior); while (aliases.Count > 10) aliases.RemoveAt(0); }
            row["login"] = login;
        }
        if (!String.IsNullOrWhiteSpace(name)) row["name"] = Cut(name, 100);
        if (seen) { if (N(row["firstSeenAt"]) == 0) row["firstSeenAt"] = Now(); row["lastSeenAt"] = Now(); }
        return row;
    }
    private void Capture(JObject s, string kind, long now)
    {
        s["health"][kind] = now;
        if (kind == "TwitchPresentViewers")
        {
            object raw; if (!CPH.TryGetArg<object>("users", out raw) || raw == null) { s["health"]["presenceWarning"] = "Present Viewers supplied no user list."; return; }
            JArray incoming = raw as JArray ?? JArray.FromObject(raw), present = new JArray();
            foreach (JObject u in incoming.OfType<JObject>())
            {
                string id = Text(u,"id","userId","UserId"); if (!Id(id)) continue;
                if (s["users"][id] == null && ((JObject)s["users"]).Count >= 10000) { s["health"]["capacityWarning"] = "Account limit reached; presence coverage is partial."; continue; }
                JObject row = User(s,id,Text(u,"userName","login","userLogin","UserLogin"),Text(u,"displayName","user","UserName"),true); row["presenceAt"] = now; present.Add(id);
            }
            s["presence"] = present; s["presenceAt"] = now; s["isLive"] = Flag("isLive"); s["health"]["presenceWarning"] = ""; return;
        }
        string uid = Read("userId"); if (!Id(uid)) { s["health"][kind+"Warning"] = "Event had no Twitch userId; ignored."; return; }
        bool active = kind == "TwitchChatMessage" || kind == "TwitchSuspiciousUserMessage";
        JObject r = User(s,uid,Read("userName"),Read("user"),active);
        if (kind == "TwitchFollow") { r["followObservedAt"] = now; return; }
        if (kind == "TwitchUserBanned" || kind == "TwitchUserUnbanned") { r["channelBanned"] = kind == "TwitchUserBanned"; r["banUpdatedAt"] = now; Event(r,kind,now,Cut(Read("reason"),250)); return; }
        if (kind.StartsWith("TwitchSuspiciousUser",StringComparison.Ordinal))
        {
            string status = Read("lowTrustStatus").ToLowerInvariant();
            if (new [] { "restricted", "active_monitoring", "no_treatment", "none" }.Contains(status)) { r["lowTrustStatus"] = status; r["lowTrustAt"] = now; if (status == "none" || status == "no_treatment") { r["banEvasionEvaluation"] = "unknown"; r["sharedBanCount"] = 0; } }
            string evaluation = Read("banEvasionEvaluation").ToLowerInvariant();
            if (new [] { "possible", "likely", "unknown" }.Contains(evaluation)) r["banEvasionEvaluation"] = evaluation;
            object shared; if (CPH.TryGetArg<object>("sharedBanChannelIds",out shared) && shared != null) { try { r["sharedBanCount"] = JArray.FromObject(shared).Count; } catch { } }
            r["suspiciousEventAt"] = now; Event(r,kind,now,status.Length == 0 ? "Native event received; inspect Twitch Mod View for details." : status); return;
        }
        string messageId = Read("msgId"); if (messageId.Length == 0) messageId = Read("messageId");
        JArray ids = (JArray)r["messageIds"];
        if (messageId.Length > 0) { if (ids.Any(x=>(string)x==messageId)) return; ids.Add(Cut(messageId,128)); while(ids.Count>100) ids.RemoveAt(0); }
        string text = Read("rawInput").Trim(); if (text.Length == 0) return;
        string normal = Regex.Replace(Cut(text,500).ToLowerInvariant(),@"\s+"," "); string command = normal.Split(' ')[0];
        bool entryCommand = command == "!ticket" || command == "!enter";
        r["messageCount"] = N(r["messageCount"]) + 1; r["lastChatAt"] = now;
        JArray messages = (JArray)r["messages"];
        messages.Add(new JObject { ["at"] = now, ["hash"] = Hash(normal), ["length"] = normal.Length, ["command"] = normal.StartsWith("!"), ["entry"] = entryCommand }); while (messages.Count > 20) messages.RemoveAt(0);
        int repeats=messages.Count(m=>N(m["at"])>=now-60000 && (string)m["hash"]==Hash(normal));
        if (!normal.StartsWith("!") && normal.Length>=20 && repeats>=4 && !((JArray)r["events"]).Any(e=>(string)e["kind"]=="RepeatBurst"&&N(e["at"])>now-60000)) Event(r,"RepeatBurst",now,repeats+" identical non-command messages observed within 60 seconds.");
        if (entryCommand)
        {
            JObject session = CurrentPool();
            if (session != null && (string)session["mode"] == "chat" && (bool?)session["entriesOpen"] == true)
            {
                JArray attempts = (JArray)r["entryAttempts"]; attempts.Add(new JObject { ["at"] = now, ["giveawayId"] = (string)session["id"] ?? "", ["command"] = command }); while (attempts.Count > 30) attempts.RemoveAt(0);
                int burst=attempts.Count(a=>N(a["at"])>=now-60000);if(burst>=5&&!((JArray)r["events"]).Any(e=>(string)e["kind"]=="EntryBurst"&&N(e["at"])>now-60000))Event(r,"EntryBurst",now,burst+" !ticket/!enter attempts during open entries within 60 seconds. Attempts are not extra accepted tickets.");
            }
        }
    }
    private JObject CurrentPool()
    {
        string raw = CPH.GetGlobalVar<string>("VoyagerGiveawayStateV1",true); if (String.IsNullOrEmpty(raw)) return null;
        JObject g = JObject.Parse(raw); return g["session"] as JObject ?? g["preview"] as JObject;
    }
    private void Pool(JObject s)
    {
        try
        {
            JObject pool = CurrentPool(); s["pool"] = new JObject { ["id"] = pool == null ? "" : (string)pool["id"] ?? "", ["title"] = pool == null ? "No giveaway loaded" : (string)pool["title"], ["open"] = pool != null && (bool?)pool["entriesOpen"] == true, ["readAt"] = Now(), ["entrants"] = new JArray() };
            if (pool == null) return; JArray entrants = pool["pool"] as JArray; if (entrants == null) return;
            foreach (JObject e in entrants.OfType<JObject>())
            {
                if ((string)e["platform"] != "twitch" || !Id((string)e["id"])) continue;
                if (s["users"][(string)e["id"]] == null && ((JObject)s["users"]).Count >= 10000) { s["health"]["capacityWarning"] = "Account limit reached; giveaway coverage is partial."; continue; }
                User(s,(string)e["id"],(string)e["login"] ?? "",(string)e["name"] ?? "",false);
                ((JArray)s["pool"]["entrants"]).Add(new JObject { ["id"] = e["id"], ["enteredAt"] = e["enteredAt"], ["ticketNumber"] = e["ticketNumber"] });
            }
            s["health"]["poolWarning"] = "";
        }
        catch { s["health"]["poolWarning"] = "Giveaway state could not be read. Pool coverage is unavailable."; s["pool"] = null; }
    }
    private void EnrichBatch(JObject s)
    {
        var entrantIds = new HashSet<string>(((JArray)(s["pool"]?["entrants"] ?? new JArray())).Select(x=>(string)x["id"]));
        var users = ((JObject)s["users"]).Properties().Select(p=>(JObject)p.Value).Where(r=>Now()-N(r["profileAttemptAt"])>Day && (entrantIds.Contains((string)r["id"]) || Now()-N(r["presenceAt"])<15*60000)).OrderByDescending(r=>entrantIds.Contains((string)r["id"])).ThenBy(r=>N(r["profileAttemptAt"])).Take(2).ToList();
        foreach (JObject r in users) Enrich(r,false);
    }
    private void Enrich(JObject r, bool manual)
    {
        if (manual && Now()-N(r["profileAttemptAt"])<60000) return;
        r["profileAttemptAt"] = Now();
        try
        {
            var info = CPH.TwitchGetExtendedUserInfoById((string)r["id"]);
            if (info == null || info.UserId != (string)r["id"]) throw new Exception("Profile unavailable. Not evidence of a ban.");
            if (info.CreatedAt.Year >= 2005) { DateTime utc = info.CreatedAt.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(info.CreatedAt,DateTimeKind.Utc) : info.CreatedAt.ToUniversalTime(); r["createdAt"] = new DateTimeOffset(utc).ToUnixTimeMilliseconds(); }
            r["profileAt"] = Now(); r["profileError"] = "";
            if (Login(info.UserLogin ?? "")) r["login"] = info.UserLogin.ToLowerInvariant();
            if (!String.IsNullOrWhiteSpace(info.UserName)) r["name"] = Cut(info.UserName,100);
        }
        catch { r["profileError"] = "Profile lookup unavailable; retry later. No banned/deleted status inferred."; }
    }
    private void RefreshFeed(JObject s, bool force)
    {
        if (!(bool)s["settings"]["feedEnabled"] && !force) return;
        LoadFeed(); long now = Now();
        if (now-N(Feed["attemptAt"]) < (force ? 60000L : 6*3600000L)) return;
        Feed["attemptAt"] = now;
        try
        {
            var req = (HttpWebRequest)WebRequest.Create("https://api.twitchinsights.net/v1/bots/all"); req.Timeout=10000;req.ReadWriteTimeout=10000;req.AllowAutoRedirect=false;req.UserAgent="Voyager-Security/1.0";
            JObject data;
            using(var response=(HttpWebResponse)req.GetResponse()) using(var reader=new StreamReader(response.GetResponseStream(),Encoding.UTF8))
            {
                char[] buffer=new char[4096];int count;var body=new StringBuilder();
                while((count=reader.Read(buffer,0,buffer.Length))>0) { body.Append(buffer,0,count);if(body.Length>12000000)throw new Exception("Feed too large."); }
                data=JObject.Parse(body.ToString());
            }
            JArray bots=data["bots"] as JArray; if(bots==null||bots.Count==0||bots.Count>200000)throw new Exception("Unexpected or empty bot-list response; existing cache preserved.");
            var names=new HashSet<string>(StringComparer.Ordinal);
            foreach(JToken b in bots) { JArray row=b as JArray;if(row==null||row.Count<1||!Login((string)row[0] ?? ""))throw new Exception("Unexpected bot-list record; existing cache preserved.");names.Add(((string)row[0]).ToLowerInvariant()); }
            Feed["logins"]=new JArray(names.OrderBy(x=>x));Feed["fetchedAt"]=now;Feed["error"]="";
        }
        catch(Exception) { Feed["error"]="Twitch Insights could not be refreshed. Cached matches are labelled; no account is cleared by a failed lookup."; }
        CPH.SetGlobalVar(FeedStore,Feed.ToString(Formatting.None),true);
    }
    private void LoadFeed()
    {
        if(Feed!=null)return;string raw=CPH.GetGlobalVar<string>(FeedStore,true);
        try { Feed=String.IsNullOrEmpty(raw)?new JObject { ["logins"]=new JArray() }:JObject.Parse(raw);if(!(Feed["logins"] is JArray))throw new Exception(); }
        catch { Feed=new JObject { ["logins"]=new JArray(),["error"]="Stored feed cache unavailable; refresh required." }; }
    }
    private JObject RequireUser(JObject s) { string id=Read("securityUserId");JObject row=Id(id)?s["users"][id] as JObject:null;if(row==null)throw new Exception("Select an observed account or use Look up account first.");return row; }
    private void Review(JObject s,long now)
    {
        JObject row=RequireUser(s),review=(JObject)row["review"];if(Read("caseVersion")!=N(review["version"]).ToString(CultureInfo.InvariantCulture))throw new Exception("This case changed in another dock. Refresh and review again.");
        string status=Read("reviewStatus"),note=Read("reviewNote").Trim();
        if(!new [] { "unreviewed","watch","trusted","cleared","confirmed_bot","confirmed_abuse","confirmed_alt","confirmed_compromised","confirmed_impersonation" }.Contains(status))throw new Exception("Invalid review status.");
        if(note.Length<5||note.Length>2000)throw new Exception("Add an evidence/reason note (5–2,000 characters).");
        string[] related=Read("relatedIds").Split(new [] { ',', ' ', '\n','\r' },StringSplitOptions.RemoveEmptyEntries).Distinct().ToArray();
        if(related.Length>10||related.Any(id=>!Id(id)||id==(string)row["id"]||s["users"][id]==null))throw new Exception("Related accounts must be different observed Twitch IDs; up to ten.");
        if(status=="confirmed_alt"&&related.Length==0)throw new Exception("A confirmed alt review needs a related Twitch ID and supporting evidence in the note.");
        row["review"]=new JObject { ["version"]=N(review["version"])+1,["status"]=status,["note"]=note,["relatedIds"]=new JArray(related),["at"]=now };
        Audit(s,"review",(string)row["id"],status+": "+note);
    }
    private void Settings(JObject s)
    {
        JObject config=(JObject)s["settings"];if(Read("settingsVersion")!=N(config["version"]).ToString())throw new Exception("Settings changed in another dock. Refresh first.");
        string[] names=Read("protectedLogins").ToLowerInvariant().Split(new [] {',',' ','\n','\r'},StringSplitOptions.RemoveEmptyEntries).Distinct().ToArray();if(names.Length>30||names.Any(x=>!Login(x)))throw new Exception("Use up to 30 exact Twitch logins to check for similar names.");
        config["feedEnabled"]=Flag("feedEnabled");config["protectedLogins"]=String.Join(", ",names);config["version"]=N(config["version"])+1;Audit(s,"settings","","Security source settings updated.");
    }
    private void Import(JObject s,long now)
    {
        string raw=Read("securityReports");if(raw.Length>1000000)throw new Exception("Report import exceeds 1 MB.");JArray rows=JArray.Parse(raw);if(rows.Count<1||rows.Count>1000)throw new Exception("Import between 1 and 1,000 reports at a time.");
        JArray target=(JArray)s["reports"];if(target.Count+rows.Count>5000)throw new Exception("Report limit is 5,000; remove obsolete reports first.");
        foreach(JObject r in rows.OfType<JObject>())
        {
            string id=(string)r["id"]??"",login=((string)r["login"]??"").ToLowerInvariant(),source=((string)r["source"]??"").Trim(),category=(string)r["category"]??"",url=(string)r["url"]??"",note=((string)r["evidence"]??"").Trim();Uri uri;DateTimeOffset date;
            if((!Id(id)&&!Login(login))||(id.Length>0&&!Id(id))||(login.Length>0&&!Login(login)))throw new Exception("Each report needs a valid Twitch ID or login.");
            if(!new [] { "bot","banned","compromised","impersonation","alt","abuse" }.Contains(category)||source.Length<2||source.Length>120||note.Length<5||note.Length>1000)throw new Exception("Every report needs a category, source and evidence note.");
            if(url.Length>1000||(url.Length>0&&(!Uri.TryCreate(url,UriKind.Absolute,out uri)||(uri.Scheme!="https"&&uri.Scheme!="http"))))throw new Exception("Evidence links must be http or https URLs.");
            if(!DateTimeOffset.TryParse((string)r["observedAt"],CultureInfo.InvariantCulture,DateTimeStyles.AssumeUniversal,out date)||date.ToUnixTimeMilliseconds()>now+Day)throw new Exception("Every report needs a valid observation date, not in the future.");
            string key=Hash(id+"|"+login+"|"+source+"|"+category+"|"+date.ToUnixTimeMilliseconds());if(target.Any(x=>(string)x["key"]==key))continue;
            target.Add(new JObject { ["key"]=key,["id"]=id,["login"]=login,["source"]=source,["category"]=category,["url"]=url,["evidence"]=note,["observedAt"]=date.ToUnixTimeMilliseconds(),["importedAt"]=now });
        }
        if(rows.Any(x=>!(x is JObject)))throw new Exception("Invalid report row. Import was not saved.");Audit(s,"import","",rows.Count+" external report rows reviewed/imported. These are source claims, not confirmed verdicts.");
    }
    private void Cleanup(JObject s,long now)
    {
        JObject users=(JObject)s["users"];var pool=new HashSet<string>(((JArray)(s["pool"]?["entrants"]??new JArray())).Select(x=>(string)x["id"]));var keep=new HashSet<string>();
        foreach(JProperty p in users.Properties()) foreach(JToken id in (JArray)(p.Value["review"]?["relatedIds"]??new JArray()))keep.Add((string)id);
        foreach(JProperty p in users.Properties().ToList())
        {
            JObject r=(JObject)p.Value;foreach(string key in new [] { "messages","entryAttempts" }) { JArray a=(JArray)r[key];for(int i=a.Count-1;i>=0;i--)if(now-N(a[i]["at"])>7*Day)a.RemoveAt(i); }
            if((string)r["review"]["status"]=="unreviewed"&&!pool.Contains(p.Name)&&!keep.Contains(p.Name)&&now-Math.Max(N(r["lastSeenAt"]),N(r["addedAt"]))>30*Day)p.Remove();
        }
        if(users.Count<10000)s["health"]["capacityWarning"]="";
    }
    private void Reply(JObject s,string request,string error)
    {
        JObject reply=new JObject { ["type"]="voyager.security.v1",["schema"]=1,["requestId"]=request,["serverAt"]=Now(),["ok"]=s!=null,["error"]=error };
        if(s!=null)
        {
            LoadFeed();var names=new HashSet<string>(((JArray)Feed["logins"]).Select(x=>(string)x),StringComparer.Ordinal);bool enabled=(bool)s["settings"]["feedEnabled"];
            var rows=new JArray();foreach(JProperty p in ((JObject)s["users"]).Properties()) { JObject r=(JObject)p.Value.DeepClone();r.Remove("messageIds");r["feedMatch"]=enabled&&names.Contains((string)r["login"]??"");rows.Add(r); }
            foreach(string k in new [] { "startedAt","updatedAt","presence","presenceAt","isLive","health","settings","reports","pool","audit","selectedId" })reply[k]=s[k]?.DeepClone();
            reply["users"]=rows;reply["feed"]=new JObject { ["source"]="Twitch Insights",["url"]="https://twitchinsights.net/bots",["enabled"]=enabled,["count"]=names.Count,["fetchedAt"]=Feed["fetchedAt"],["attemptAt"]=Feed["attemptAt"],["error"]=Feed["error"] };
        }
        CPH.WebsocketBroadcastJson(reply.ToString(Formatting.None));
    }
    private static void Event(JObject r,string kind,long now,string detail) { JArray a=(JArray)r["events"];a.Add(new JObject { ["kind"]=kind,["at"]=now,["detail"]=detail });while(a.Count>20)a.RemoveAt(0); }
    private static void Audit(JObject s,string op,string id,string note) { JArray a=(JArray)s["audit"];a.Add(new JObject { ["at"]=Now(),["operation"]=op,["id"]=id,["note"]=Cut(note,2100) });while(a.Count>1000)a.RemoveAt(0); }
    private static bool Id(string s) { return s!=null&&Regex.IsMatch(s,@"^[0-9]{1,25}$"); }
    private static bool Login(string s) { return s!=null&&Regex.IsMatch(s,@"^[a-zA-Z0-9_]{1,25}$"); }
    private static string Cut(string s,int n) { return s.Length>n?s.Substring(0,n):s; }
    private static long N(JToken t) { if(t==null||t.Type==JTokenType.Null)return 0;long n;if(!Int64.TryParse((string)t,out n)||n<0)throw new Exception("Invalid numeric security record; saved data preserved.");return n; }
    private static long Now() { return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(); }
    private static string Text(JObject o,params string[] keys) { foreach(string k in keys) { string v=(string)o[k];if(!String.IsNullOrWhiteSpace(v))return v; }return ""; }
    private string Read(string key) { object v;return CPH.TryGetArg<object>(key,out v)&&v!=null?Convert.ToString(v,CultureInfo.InvariantCulture):""; }
    private bool Flag(string key) { bool v;return Boolean.TryParse(Read(key),out v)&&v; }
    private static string Hash(string value) { using(var sha=SHA256.Create())return BitConverter.ToString(sha.ComputeHash(Encoding.UTF8.GetBytes(value))).Replace("-","").ToLowerInvariant(); }
}
// End of Voyager Security Monitor v1.
