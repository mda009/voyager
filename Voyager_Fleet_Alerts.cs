// Voyager Fleet Alerts v1.6. One action: Voyager - Fleet Alerts.
// Separate blocking queue: Voyager Fleet. No delay/wait; animation timing is saved.
using System;using System.Collections.Generic;using System.Globalization;using System.Linq;using Newtonsoft.Json;using Newtonsoft.Json.Linq;
public class CPHInline {
 const string Store="VoyagerFleetAlertsV1";static readonly object Gate=new object();
 static readonly Dictionary<string,int> Stages=new Dictionary<string,int>{{"TwitchFollow",1},{"TwitchSub",2},{"TwitchGiftSub",3},{"TwitchGiftBomb",3},{"TwitchReSub",4},{"TwitchCheer",5},{"TwitchRaid",6},
 {"YouTubeNewSubscriber",1},{"YouTubeNewSponsor",2},{"YouTubeMembershipGift",3},{"YouTubeGiftMembershipReceived",2},{"YouTubeMemberMileStone",4},{"YouTubeSuperChat",5},{"YouTubeSuperSticker",5},{"YouTubeJewelsGifted",5},
 {"KickFollow",1},{"KickSubscription",2},{"KickGiftSubscription",3},{"KickMassGiftSubscription",3},{"KickResubscription",4},{"KickKicksGifted",5}};
 static readonly int[] Durations={0,16,16,18,20,14,28};
 public bool Execute(){string kind=CPH.GetEventType().ToString(),op=Read("fleetOperation"),requestId=Read("requestId");bool native=Stages.ContainsKey(kind);if(kind=="CommandTriggered"||Flag("isTest")||Flag("isInternal")||Flag("isFromSharedChatGuest"))return true;if(!native&&!new[]{"sync","settings","test","skip","clear","replay","lumiaSettings","lumiaTest","playback"}.Contains(op))return true;Guid rid;if(!native&&!Guid.TryParse(requestId,out rid))return false;
 lock(Gate){JObject s=null;try{long now=Now();s=Load();bool trimmed=Prune(s,now);if(native){if(kind=="TwitchGiftSub"&&(Flag("fromGiftBomb")||ArgOr("subBombCount",0)>0))return true;
 JObject e=NativeEvent(kind,now);string id=(string)e["userId"],login=(string)e["login"],sourceId=(string)e["sourceId"];
 string identity=sourceId.Length>0?kind+":"+sourceId:"";
 // Use stable native timestamps only, never a time bucket that could hide a second real gift.
 string timestamp=First("followedAt","subscribedAt","kicks.createdAt","publishedAt");
 if(identity.Length==0&&id.Length>0&&timestamp.Length>0)identity=kind+":"+id+":"+timestamp+":"+(string)e["recipient"]+":"+e["amount"];
 var seen=(JArray)s["seen"];if(identity.Length>0&&seen.Any(x=>(string)x==identity)){if(trimmed)Save(s);return true;}

 Record(s,e,id,login,now);Enqueue(s,e,now);if(identity.Length>0){seen.Add(identity);while(seen.Count>5000)seen.RemoveAt(0);}Save(s);Broadcast(s,"","");return true;}
 if(op=="sync"){if(trimmed)Save(s);Broadcast(s,requestId,"");return true;}
 if(op=="playback"){Playback(s,requestId,now);return true;}
 if(((JArray)s["requests"]).Any(x=>(string)x==requestId)){Broadcast(s,requestId,"");return true;}
 long expires=Arg("fleetExpiresAt",1,9007199254740991L);if(expires<now||expires>now+90000)throw new Exception("Command expired. Refresh before trying again.");if(Arg("fleetControlRevision",0,9007199254740991L)!=N(s["controlRevision"]))throw new Exception("Fleet controls changed. Review the latest state.");
 if(op=="lumiaSettings"){
 bool enabled;if(!Boolean.TryParse(Read("fleetLumiaEnabled"),out enabled))throw new Exception("Choose whether Lumia cues are enabled.");
 var commands=new JObject();for(int stage=1;stage<=5;stage++){string value=Read("fleetLumiaCommand"+stage).Trim();if(value.Length>100||value.Any(Char.IsControl))throw new Exception("Lumia command names must be at most 100 characters without line breaks.");commands[stage.ToString()]=value;}
 string raidCommand=Read("fleetLumiaCommand6");object raidArg;if(!CPH.TryGetArg<object>("fleetLumiaCommand6",out raidArg))raidCommand=(string)s["lumia"]["commands"]["6"]??"";raidCommand=raidCommand.Trim();if(raidCommand.Length>100||raidCommand.Any(Char.IsControl))throw new Exception("Invalid Lumia raid command.");commands["6"]=raidCommand;
 if(enabled&&!commands.Properties().Any(x=>((string)x.Value).Length>0))throw new Exception("Enter at least one Lumia command.");
 s["lumia"]=new JObject{["enabled"]=enabled,["commands"]=commands};
 }
 if(op=="lumiaTest"){
 int stage=(int)Arg("fleetStage",1,6);if(!(bool)s["lumia"]["enabled"])throw new Exception("Enable and save Lumia cues first.");if(String.IsNullOrWhiteSpace((string)s["lumia"]["commands"][stage.ToString()]))throw new Exception("This stage has no saved Lumia command.");
 Remember(s,requestId);s["controlRevision"]=N(s["controlRevision"])+1;SendLumia(s,stage,null,requestId,now);Broadcast(s,requestId,"");return true;
 }
 if(op=="settings"){bool enabled;if(!Boolean.TryParse(Read("fleetEnabled"),out enabled))throw new Exception("Choose whether fleet alerts are enabled.");double volume;if(!Double.TryParse(Read("fleetVolume"),NumberStyles.Float,CultureInfo.InvariantCulture,out volume)||Double.IsNaN(volume)||volume<0||volume>1)throw new Exception("Volume must be between zero and one.");s["enabled"]=enabled;s["volume"]=volume;if(!enabled)Cancel(s,null,"disabled");}
 if(op=="test"){int stage=(int)Arg("fleetStage",1,6);string name=Clean(Read("fleetName"),80);if(name.Length==0)name="MDA009";var e=Event(stage,name,Arg("fleetAmount",1,1000000),Arg("fleetMonths",1,1200),"",true,now);string platform=Read("fleetPlatform").ToLowerInvariant();if(platform.Length==0)platform="twitch";if(!new[]{"twitch","youtube","kick"}.Contains(platform))throw new Exception("Choose Twitch, YouTube or Kick.");string source=Read("fleetSource");if(source.Length==0)source=DefaultSource(platform,stage);if(!Stages.ContainsKey(source)||Stages[source]!=stage||Platform(source)!=platform)throw new Exception("Choose an event matching the platform and stage.");e["platform"]=platform;e["source"]=source;if(source=="YouTubeSuperChat"||source=="YouTubeSuperSticker")e["amount"]=1;Enqueue(s,e,now);}
 if(op=="clear")Cancel(s,null,"cancelled");
 if(op=="skip"){var queue=(JArray)s["queue"];JObject first=queue.First as JObject;if(first==null)throw new Exception("There is no alert to skip.");if(Read("fleetEventId")!=(string)first["id"])throw new Exception("The current alert changed. Refresh before skipping.");Cancel(s,(string)first["id"],"skipped");long start=now+350;foreach(JObject e in queue){e["startAt"]=start;e["endAt"]=start+N(e["duration"])*1000;start=N(e["endAt"])+700;var h=((JArray)s["history"]).OfType<JObject>().FirstOrDefault(x=>(string)x["id"]==(string)e["id"]);if(h!=null){h["startAt"]=e["startAt"];h["endAt"]=e["endAt"];}}}
 if(op=="replay"){var original=((JArray)s["history"]).OfType<JObject>().FirstOrDefault(x=>(string)x["id"]==Read("fleetEventId"));if(original==null)throw new Exception("Select a recent alert to replay.");var e=Event((int)original["stage"],(string)original["name"],N(original["amount"]),N(original["months"]),(string)original["tier"],true,now);e["replayOf"]=original["id"];foreach(string field in new[]{"recipient","platform","source","displayAmount","currencyCode","microAmount","supportName","isUpgrade","gifter"})if(original[field]!=null)e[field]=original[field].DeepClone();Enqueue(s,e,now);}
 var requests=(JArray)s["requests"];requests.Add(requestId);while(requests.Count>500)requests.RemoveAt(0);s["controlRevision"]=N(s["controlRevision"])+1;Save(s);Broadcast(s,requestId,"");return true;
 }catch(Exception ex){CPH.LogWarn("[Voyager Fleet] "+ex.Message);if(!native){try{s=Load();}catch{s=null;}Broadcast(s,requestId,ex.Message);}return false;}}}
 JObject Load(){string raw=CPH.GetGlobalVar<string>(Store,true);var s=String.IsNullOrWhiteSpace(raw)?new JObject{["schema"]=1,["revision"]=0,["controlRevision"]=0,["enabled"]=true,["volume"]=.32,["queue"]=new JArray(),["history"]=new JArray(),["crew"]=new JObject(),["totals"]=new JObject{["follow"]=0,["sub"]=0,["gift"]=0,["resub"]=0,["bits"]=0},["seen"]=new JArray(),["requests"]=new JArray(),["warning"]=""}:JObject.Parse(raw);
 if((int?)s["schema"]!=1||!(s["queue"] is JArray)||!(s["history"] is JArray)||!(s["crew"] is JObject)||!(s["totals"] is JObject)||!(s["seen"] is JArray)||!(s["requests"] is JArray)||s["enabled"]?.Type!=JTokenType.Boolean)throw new Exception("Invalid saved fleet alert state. Data was preserved.");foreach(JObject e in (JArray)s["queue"])if((int?)e["stage"]<1||(int?)e["stage"]>6||N(e["endAt"])<=N(e["startAt"]))throw new Exception("Invalid saved alert timing. Data was preserved.");if(s["lumia"]==null)s["lumia"]=new JObject{["enabled"]=false,["commands"]=new JObject{["1"]="VoyagerFollow",["2"]="VoyagerSubscription",["3"]="VoyagerGift",["4"]="VoyagerResub",["5"]="VoyagerBits"}};
 if(s["lumia"]["enabled"]?.Type!=JTokenType.Boolean||!(s["lumia"]["commands"] is JObject))throw new Exception("Invalid Lumia settings. Data was preserved.");
 if(s["lumia"]["commands"]["6"]==null)s["lumia"]["commands"]["6"]="";
 return s;}
 // The OBS source may acknowledge only an alert that has just started.
 // Saving the receipt before dispatch prevents duplicate cues across sources/reconnects.
 void Playback(JObject s,string requestId,long now){
 long expires=Arg("fleetExpiresAt",1,9007199254740991L);if(expires<now||expires>now+90000)throw new Exception("Playback cue expired.");
 var e=((JArray)s["queue"]).OfType<JObject>().FirstOrDefault(x=>(string)x["id"]==Read("fleetEventId"));
 if(e==null)throw new Exception("This alert is no longer queued.");
 if(e["lumiaCue"]!=null){Broadcast(s,requestId,"");return;}
 if(!(bool)s["enabled"]||!(bool)s["lumia"]["enabled"]){Broadcast(s,requestId,"");return;}
 if(now<N(e["startAt"])||now>N(e["startAt"])+5000||now>=N(e["endAt"]))throw new Exception("Lumia cue skipped: the alert is outside its start window.");
 SendLumia(s,(int)e["stage"],e,requestId,now);Broadcast(s,requestId,"");
 }
 void SendLumia(JObject s,int stage,JObject e,string requestId,long now){
 string command=(string)s["lumia"]["commands"][stage.ToString()]??"";if(command.Length==0)return;
 if(command.Length>100||command.Any(Char.IsControl))throw new Exception("Invalid saved Lumia command.");
 var cue=new JObject{["eventId"]=e==null?"":(string)e["id"],["requestId"]=requestId,["stage"]=stage,["command"]=command,["at"]=now,["status"]="attempted",["message"]="Dispatch attempted; delivery not confirmed."};
 CueState(s,e,cue);Save(s);
 try{CPH.LumiaSendCommand(command);cue["status"]="sent";cue["message"]="Sent to the Streamer.bot Lumia integration; light execution is not confirmed.";}
 catch(Exception){cue["status"]="error";cue["message"]="Lumia command failed. Check Integrations > Lumia Stream and the saved command name.";CPH.LogWarn("[Voyager Fleet] Lumia command failed; the visual alert continues.");}
 CueState(s,e,cue);Save(s);
 }
 static void CueState(JObject s,JObject e,JObject cue){s["lumiaLast"]=cue.DeepClone();if(e==null)return;e["lumiaCue"]=cue.DeepClone();var h=((JArray)s["history"]).OfType<JObject>().FirstOrDefault(x=>(string)x["id"]==(string)e["id"]);if(h!=null)h["lumiaCue"]=cue.DeepClone();}
 static void Remember(JObject s,string requestId){var requests=(JArray)s["requests"];requests.Add(requestId);while(requests.Count>500)requests.RemoveAt(0);}
 static JObject Event(int stage,string name,long amount,long months,string tier,bool test,long now){return new JObject{["id"]=Guid.NewGuid().ToString(),["stage"]=stage,["name"]=name,["amount"]=amount,["months"]=months,["tier"]=tier??"",["recipient"]="",["test"]=test,["receivedAt"]=now,["duration"]=Durations[stage],["status"]="received"};}
 static bool Prune(JObject s,long now){bool changed=false;foreach(JObject e in ((JArray)s["queue"]).OfType<JObject>().Where(x=>N(x["endAt"])<=now).ToList()){var h=((JArray)s["history"]).OfType<JObject>().FirstOrDefault(x=>(string)x["id"]==(string)e["id"]);if(h!=null&& (string)h["status"]=="queued")h["status"]="elapsed";e.Remove();changed=true;}return changed;}
 static void Enqueue(JObject s,JObject e,long now){var queue=(JArray)s["queue"];if(!(bool)s["enabled"]){if((bool)e["test"])throw new Exception("Enable fleet alerts before sending a test or replay to OBS.");e["status"]="disabled";}else if(queue.Count>=300){if((bool)e["test"])throw new Exception("The alert queue is full. Clear or skip alerts first.");s["warning"]="Alert queue reached 300 items. New activity is recorded in history but cannot be displayed until space is available.";e["status"]="queue_full";}else{long start=Math.Max(now+350,queue.Count==0?0:N(queue.Last["endAt"])+700);e["startAt"]=start;e["endAt"]=start+N(e["duration"])*1000;e["status"]="queued";queue.Add(e);s["warning"]="";}var history=(JArray)s["history"];history.Add(e.DeepClone());while(history.Count>500)history.RemoveAt(0);}
 static void Cancel(JObject s,string id,string status){var q=(JArray)s["queue"];foreach(JObject e in q.OfType<JObject>().Where(x=>id==null||(string)x["id"]==id).ToList()){var h=((JArray)s["history"]).OfType<JObject>().FirstOrDefault(x=>(string)x["id"]==(string)e["id"]);if(h!=null)h["status"]=status;e.Remove();}s["warning"]="";}
 static void Record(JObject s,JObject e,string id,string login,long now){
 string source=(string)e["source"],platform=(string)e["platform"]??"twitch",metric=new[]{"","follow","sub","gift","resub","bits","raidViewers"}[(int)e["stage"]];
 if(source=="YouTubeGiftMembershipReceived")metric="giftReceived";
 if(source=="YouTubeNewSponsor"&&(bool?)e["isUpgrade"]==true)metric="membershipUpgrade";
 if(source=="YouTubeSuperChat")metric="superChat";if(source=="YouTubeSuperSticker")metric="superSticker";if(source=="YouTubeJewelsGifted")metric="jewels";if(source=="KickKicksGifted")metric="kicks";
 var totals=(JObject)s["totals"];totals[metric]=checked(N(totals[metric])+N(e["amount"]));
 if((int)e["stage"]==6)totals["raids"]=N(totals["raids"])+1;
 bool otherSupport=(int)e["stage"]==5&&platform!="twitch";if(otherSupport)totals["otherSupportEvents"]=N(totals["otherSupportEvents"])+1;
 if(String.IsNullOrWhiteSpace(id)||id.Length>128)return;var crew=(JObject)s["crew"];string key=platform+":"+id;JObject u=crew[key] as JObject;
 if(u==null){if(crew.Count>=50000){s["warning"]="Fleet roster capacity reached; alert totals remain recorded.";return;}u=new JObject{["id"]=id,["platform"]=platform,["name"]=e["name"],["login"]=login,["stage"]=0,["firstSeenAt"]=now,["follow"]=0,["sub"]=0,["gift"]=0,["resub"]=0,["bits"]=0};crew[key]=u;}
 u["name"]=e["name"];u["login"]=login;u["lastEventAt"]=now;u[metric]=checked(N(u[metric])+N(e["amount"]));if((int)e["stage"]<5)u["stage"]=Math.Max(N(u["stage"]),(int)e["stage"]);if((int)e["stage"]==4)u["months"]=Math.Max(N(u["months"]),N(e["months"]));
 }
 static string Platform(string source){return source.StartsWith("YouTube",StringComparison.Ordinal)?"youtube":source.StartsWith("Kick",StringComparison.Ordinal)?"kick":"twitch";}
 static string DefaultSource(string platform,int stage){if(stage==6){if(platform!="twitch")throw new Exception("Incoming raids use the native Twitch Raid trigger.");return "TwitchRaid";}return (platform=="youtube"?new[]{"","YouTubeNewSubscriber","YouTubeNewSponsor","YouTubeMembershipGift","YouTubeMemberMileStone","YouTubeSuperChat"}:platform=="kick"?new[]{"","KickFollow","KickSubscription","KickMassGiftSubscription","KickResubscription","KickKicksGifted"}:new[]{"","TwitchFollow","TwitchSub","TwitchGiftBomb","TwitchReSub","TwitchCheer"})[stage];}
 JObject NativeEvent(string kind,long now){
 string platform=Platform(kind),id=Clean(Read("userId"),128),login=Clean(First("userLogin","userName","login"),100),name=Clean(First("user","displayName","userName","userLogin"),80);
 if(Flag("anonymous")||Flag("isAnonymous")){id="";login="";name="Anonymous supporter";}if(name.Length==0)name="A new Voyager";
 int stage=Stages[kind];long amount=1,months=1;
 if(kind=="TwitchGiftBomb")amount=ArgOr("gifts",1);
 if(kind=="YouTubeMembershipGift"||kind=="KickMassGiftSubscription")amount=ArgOr("count",1);
 if(kind=="TwitchRaid")amount=ArgOr("viewers",1);
 if(kind=="TwitchCheer")amount=ArgOr("bits",0);
 if(kind=="KickKicksGifted")amount=ArgOr("kicks.amount",0);
 if(kind=="YouTubeJewelsGifted")amount=ArgOr("gift.jewelsAmount",0);
 if(amount<1||amount>1000000000)throw new Exception("Unsupported alert quantity; check the native event arguments.");
 if(kind=="TwitchReSub")months=Math.Max(1,ArgOr("cumulative",1));
 if(kind=="KickResubscription")months=Math.Max(1,ArgOr("monthsSubscribed",1));
 if(kind=="YouTubeMemberMileStone")months=Math.Max(1,ArgOr("months",1));
 var e=Event(stage,name,amount,months,Clean(First("levelName","tier"),80),false,now);e["platform"]=platform;e["userId"]=id;e["login"]=login;e["source"]=kind;
 e["sourceId"]=Clean(First("msgId","messageId","eventId"),250);
 if(kind=="YouTubeMembershipGift"||kind=="YouTubeGiftMembershipReceived")e["sourceId"]=Clean(First("messageId","eventId","id"),250);
 if(kind=="TwitchGiftSub")e["recipient"]=Clean(First("recipientUser","recipientUserName"),80);
 if(kind=="KickGiftSubscription")e["recipient"]=Clean(First("recipient.userName","recipient.userLogin"),80);
 if(kind=="YouTubeGiftMembershipReceived")e["gifter"]=Clean(First("gifterUser","gifterUserName"),80);
 if(kind=="YouTubeNewSponsor")e["isUpgrade"]=Flag("isUpgrade");
 if(kind=="YouTubeSuperChat"||kind=="YouTubeSuperSticker"){e["displayAmount"]=Clean(Read("amount"),60);e["currencyCode"]=Clean(Read("currencyCode"),12);e["microAmount"]=Clean(Read("microAmount"),32);}
 if(kind=="KickKicksGifted")e["supportName"]=Clean(Read("kicks.name"),80);
 if(kind=="YouTubeJewelsGifted")e["supportName"]=Clean(Read("gift.name"),80);
 return e;
 }

 void Save(JObject s){s["revision"]=N(s["revision"])+1;s["updatedAt"]=Now();CPH.SetGlobalVar(Store,s.ToString(Formatting.None),true);}
 void Broadcast(JObject s,string id,string error){try{JObject state=s==null?null:(JObject)s.DeepClone();if(state!=null){state["backendVersion"]="1.6";state.Remove("requests");state.Remove("seen");}CPH.WebsocketBroadcastJson(new JObject{["type"]="voyager.fleet.alerts.v1",["schema"]=1,["ok"]=error.Length==0,["error"]=error,["requestId"]=id,["serverAt"]=Now(),["state"]=state}.ToString(Formatting.None));}catch(Exception e){CPH.LogWarn("[Voyager Fleet] State saved; broadcast unavailable: "+e.Message);}}
 static string Clean(string s,int max){s=new String((s??"").Where(c=>!Char.IsControl(c)).ToArray()).Trim();return s.Length>max?s.Substring(0,max):s;}
 static long N(JToken t){long n;if(t==null)return 0;if(!Int64.TryParse(t.ToString(),out n)||n<0||n>9007199254740991L)throw new Exception("Invalid fleet number.");return n;}
 long Arg(string k,long min,long max){long n;if(!Int64.TryParse(Read(k),NumberStyles.Integer,CultureInfo.InvariantCulture,out n)||n<min||n>max)throw new Exception("Invalid "+k+".");return n;}
 long ArgOr(string k,long fallback){long n;return Int64.TryParse(Read(k),NumberStyles.Integer,CultureInfo.InvariantCulture,out n)?n:fallback;}
 bool Flag(string k){bool v;return Boolean.TryParse(Read(k),out v)&&v;}string Read(string k){object v;return CPH.TryGetArg<object>(k,out v)&&v!=null?Convert.ToString(v,CultureInfo.InvariantCulture):"";}string First(params string[] keys){foreach(string k in keys){string v=Read(k);if(v.Length>0)return v;}return "";}static long Now(){return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();}
}
