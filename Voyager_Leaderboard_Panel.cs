// Voyager Leaderboard Panel v1.3 — shared leaderboard and ticket giveaway panel. One blocking queue; Concurrent OFF; no triggers.
// Stores display choices and a read-only copy of saved Versus rankings. Never changes points.
// Voyager - Stream Stats remains the dashboard and OBS data source.
using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
public class CPHInline
{
    private const string Store = "VoyagerLeaderboardPanelV1";
    private const string Seed = @"{""schema"": 1, ""epoch"": ""11111111-2222-4333-8444-555555555555"", ""revision"": 0, ""visible"": false, ""expiresAt"": 0, ""updatedAt"": 0, ""config"": {""kind"": ""watchtime"", ""platform"": ""twitch"", ""limit"": 10, ""speed"": 14, ""width"": 356, ""top"": 132, ""right"": 16, ""opacity"": 40, ""duration"": 0, ""title"": """"}, ""sourceSettings"": {""statsActionName"": ""Voyager - Stream Stats"", ""sources"": {""twitch"": {""leaderboardMode"": ""native"", ""watchtimeUnits"": ""minutes"", ""persisted"": true, ""followers"": """", ""subscriptions"": """", ""watchtime"": """", ""months"": """", ""gifts"": """"}, ""youtube"": {""leaderboardMode"": ""native"", ""watchtimeUnits"": ""minutes"", ""persisted"": true, ""followers"": """", ""subscriptions"": """", ""watchtime"": """", ""months"": """", ""gifts"": """"}, ""kick"": {""leaderboardMode"": ""native"", ""watchtimeUnits"": ""minutes"", ""persisted"": true, ""followers"": """", ""subscriptions"": """", ""watchtime"": """", ""months"": """", ""gifts"": """"}}, ""excluded"": """"}, ""requests"": []}";
    private static readonly object Gate = new object();
    public bool Execute()
    {
        string op=Read("leaderboardPanelOperation"), requestId=Read("requestId"); Guid request;
        if(op=="publishPilots") return PublishPilots(requestId);
        if(op!="snapshot" && op!="show" && op!="hide" && op!="configure") return true;
        if(!Guid.TryParse(requestId,out request)) return false;
        lock(Gate)
        {
            try
            {
                string raw=CPH.GetGlobalVar<string>(Store,true);
                JObject s=String.IsNullOrEmpty(raw)?JObject.Parse(Seed):JObject.Parse(raw);
                if(String.IsNullOrEmpty(raw)) s["epoch"]=Guid.NewGuid().ToString();
                Guid epoch;
                if((int?)s["schema"]!=1 || !Guid.TryParse((string)s["epoch"],out epoch) || !(s["requests"] is JArray)) throw new Exception("Invalid saved leaderboard panel. Data was preserved.");
                Integer(s,"revision",0,9007199254740990L); Integer(s,"updatedAt",0,9007199254740991L); Integer(s,"expiresAt",0,9007199254740991L);
                if(s["visible"]==null || s["visible"].Type!=JTokenType.Boolean) throw new Exception("Invalid panel visibility.");
                s["config"]=Config(s["config"] as JObject); s["sourceSettings"]=Sources(s["sourceSettings"] as JObject);
                if(String.IsNullOrEmpty(raw)) Save(s);
                if(op!="snapshot")
                {
                    JArray requests=(JArray)s["requests"];
                    foreach(JToken done in requests) if((string)done==requestId){Reply(s,requestId,false,"");return true;}
                    long expected;
                    if(Read("baseEpoch")!=(string)s["epoch"] || !Int64.TryParse(Read("baseRevision"),out expected) || expected!=(long)s["revision"]) throw new Exception("Panel settings changed in another dock. Refresh the panel and try again.");
                    if(op=="show" || op=="configure")
                    {
                        string payload=Read("panelPayload"); if(payload.Length>16000) throw new Exception("Panel settings are too large.");
                        JObject input=JObject.Parse(payload);s["config"]=Config(input["config"] as JObject);s["sourceSettings"]=Sources(input["sourceSettings"] as JObject);
                    }
                    long now=Now();
                    if(op=="show"){s["visible"]=true;long duration=(long)s["config"]["duration"];s["expiresAt"]=duration==0?0:now+duration*1000;}
                    if(op=="hide"){s["visible"]=false;s["expiresAt"]=0;}
                    s["updatedAt"]=now;s["revision"]=(long)s["revision"]+1;requests.Add(requestId);while(requests.Count>100)requests.RemoveAt(0);Save(s);
                }
                Reply(s,requestId,op!="snapshot","");return true;
            }
            catch(Exception ex){CPH.LogWarn("[Voyager Leaderboard Panel] "+ex.Message);Reply(null,requestId,false,ex.Message);return false;}
        }
    }
    private bool PublishPilots(string requestId)
    {
        lock(Gate) try
        {
            Guid id; if(!Guid.TryParse(requestId,out id))throw new Exception("Invalid pilot sync request.");
            string raw=Read("pilotLeaderboardJson");if(raw.Length>100000)throw new Exception("Pilot snapshot is too large.");
            JObject input=JObject.Parse(raw);long now=Now();
            if(Integer(input,"schema",1,1)!=1 || Text(input,"source",50)!="voyager-versus-rankings")throw new Exception("Unsupported pilot rankings.");
            long generated=Integer(input,"generatedAt",1,9007199254740991L);
            if(generated<now-60000 || generated>now+60000)throw new Exception("Pilot snapshot expired. Reconnect the game host.");
            JArray values=input["rows"] as JArray;if(values==null || values.Count>100)throw new Exception("Invalid pilot rows.");
            long total=Integer(input,"totalRecords",values.Count,9007199254740991L),invalid=Integer(input,"invalidRecords",0,9007199254740991L);
            if(values.Count!=Math.Min(100L,total))throw new Exception("Incomplete pilot snapshot.");
            var seen=new HashSet<string>(StringComparer.Ordinal);var rows=new List<JObject>();
            foreach(JToken token in values)
            {
                JObject row=token as JObject;if(row==null)throw new Exception("Invalid pilot record.");
                string login=Text(row,"login",25).ToLowerInvariant(),name=Text(row,"name",100);
                if((login.Length==0 || login.Any(c=>!((c>='a' && c<='z') || (c>='0' && c<='9') || c=='_'))) || !seen.Add(login))throw new Exception("Invalid or duplicate pilot identity.");
                long wins=Integer(row,"wins",0,9007199254740991L),losses=Integer(row,"losses",0,9007199254740991L),draws=Integer(row,"draws",0,9007199254740991L),battles=Integer(row,"battles",1,9007199254740991L);
                if(wins+losses+draws!=battles)throw new Exception("Pilot battle totals do not match.");
                rows.Add(new JObject{["key"]="twitch:login:"+login,["platform"]="twitch",["login"]=login,["name"]=name.Length>0?name:login,["value"]=wins,["wins"]=wins,["losses"]=losses,["draws"]=draws,["battles"]=battles,["winRate"]=Math.Round(100.0*wins/battles,1)});
            }
            string previous=CPH.GetGlobalVar<string>("VoyagerPilotLeaderboardV1",true);
            if(!String.IsNullOrEmpty(previous))
            {
                JObject old=JObject.Parse(previous);
                if((string)old["requestId"]==requestId)return true;
                if((long?)old["generatedAt"]>generated)throw new Exception("An older pilot snapshot was ignored.");
            }
            JObject result=new JObject{["schema"]=1,["source"]="voyager-versus-rankings",["requestId"]=requestId,["generatedAt"]=generated,["publishedAt"]=now,["totalRecords"]=total,["invalidRecords"]=invalid,["rows"]=new JArray(rows.OrderByDescending(x=>(long)x["wins"]).ThenBy(x=>(long)x["losses"]).ThenBy(x=>(string)x["name"],StringComparer.OrdinalIgnoreCase).ThenBy(x=>(string)x["login"],StringComparer.Ordinal))};
            CPH.SetGlobalVar("VoyagerPilotLeaderboardV1",result.ToString(Formatting.None),true);return true;
        }
        catch(Exception ex){CPH.LogWarn("[Voyager Pilot Leaderboard] "+ex.Message);return false;}
    }
    private JObject Config(JObject raw)
    {
        if(raw==null)throw new Exception("Panel configuration is missing.");
        string kind=Text(raw,"kind",20),platform=Text(raw,"platform",20),title=Text(raw,"title",80);
        if(kind!="watchtime" && kind!="months" && kind!="gifts" && kind!="points" && kind!="pilots" && kind!="tickets")throw new Exception("Choose a leaderboard.");
        if(platform!="all" && platform!="twitch" && platform!="youtube" && platform!="kick")throw new Exception("Choose a platform.");
        if(kind=="tickets" && platform!="all")throw new Exception("Ticket giveaways show all participating platforms.");
        if(kind=="gifts" && platform=="all")throw new Exception("Choose one platform for gifted-sub totals.");
        if(kind=="pilots" && platform!="twitch")throw new Exception("Pilot rankings use Twitch battles.");
        JObject c=new JObject{["kind"]=kind,["platform"]=platform,["title"]=title};
        foreach(string k in new[]{"limit","speed","width","top","right","opacity","duration"})
        {
            long min=k=="limit"?5:k=="width"?320:0,max=k=="limit"?10:k=="speed"?40:k=="width"?480:k=="top"?600:k=="right"?1440:k=="opacity"?95:600;
            c[k]=Integer(raw,k,min,max);
        }
        if((long)c["right"]+(long)c["width"]>1920)throw new Exception("Panel must fit inside the canvas.");return c;
    }
    private JObject Sources(JObject raw)
    {
        if(raw==null || !(raw["sources"] is JObject))throw new Exception("Leaderboard sources are missing.");
        string action=Text(raw,"statsActionName",128);if(action.Length==0)throw new Exception("Stream Stats action name is missing.");
        JToken excluded=raw["excluded"];if(excluded==null || excluded.Type!=JTokenType.String || ((string)excluded).Length>3000)throw new Exception("Invalid leaderboard exclusions.");
        JObject all=new JObject();
        foreach(string p in new[]{"twitch","youtube","kick"})
        {
            JObject input=raw["sources"][p] as JObject;if(input==null)throw new Exception("Missing source: "+p);
            string mode=Text(input,"leaderboardMode",20),units=Text(input,"watchtimeUnits",20);
            if(mode!="native" && mode!="custom")throw new Exception("Invalid leaderboard mode.");
            if(units!="seconds" && units!="minutes" && units!="hours")throw new Exception("Invalid watch-time units.");
            if(input["persisted"]==null || input["persisted"].Type!=JTokenType.Boolean)throw new Exception("Missing storage choice.");
            JObject s=new JObject{["leaderboardMode"]=mode,["watchtimeUnits"]=units,["persisted"]=(bool)input["persisted"],["followers"]="",["subscriptions"]=""};
            foreach(string key in new[]{"watchtime","months","gifts"}){string variable=Text(input,key,128);if(variable.IndexOf('%')>=0)throw new Exception("Use variable names without % signs.");s[key]=variable;}
            all[p]=s;
        }
        return new JObject{["statsActionName"]=action,["sources"]=all,["excluded"]=(string)excluded};
    }
    private string Text(JObject o,string key,int max){JToken t=o[key];if(t==null || t.Type!=JTokenType.String)throw new Exception("Missing "+key+".");string v=((string)t).Trim();if(v.Length>max)throw new Exception(key+" is too long.");foreach(char c in v)if(c<32 || c==127)throw new Exception("Invalid "+key+".");return v;}
    private long Integer(JObject o,string key,long min,long max){JToken t=o[key];long n;if(t==null || t.Type!=JTokenType.Integer || !Int64.TryParse(t.ToString(),out n) || n<min || n>max)throw new Exception("Invalid "+key+".");return n;}
    private void Save(JObject s){CPH.SetGlobalVar(Store,s.ToString(Formatting.None),true);}
    private void Reply(JObject state,string requestId,bool changed,string error){JObject clean=state==null?null:(JObject)state.DeepClone();if(clean!=null)clean.Remove("requests");CPH.WebsocketBroadcastJson(new JObject{["type"]="voyager.leaderboard.panel.v1",["schema"]=1,["serverAt"]=Now(),["requestId"]=requestId,["ok"]=error.Length==0,["change"]=changed,["state"]=clean,["error"]=error}.ToString(Formatting.None));}
    private long Now(){return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();}
    private string Read(string key){object value;return CPH.TryGetArg<object>(key,out value)&&value!=null?Convert.ToString(value,CultureInfo.InvariantCulture)??"":"";}
}
