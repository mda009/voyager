// Voyager Ticket Giveaway v1.4. One enabled action: Voyager - Ticket Giveaway.
// Dedicated blocking queue: Voyager Tickets; Concurrent OFF. See TICKET_GIVEAWAY_SETUP.html.
// Independent ticket ledger. Never writes points, groups or VoyagerGiveawayStateV1.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
public class CPHInline
{
    private const string Store="VoyagerTicketGiveawayV1";
    private const long TicketMs=600000,MaxTickets=1000000000;
    private static readonly object Gate=new object();
    private static readonly string ProcessSession=Guid.NewGuid().ToString();
    private static readonly string[] Platforms={"twitch","youtube","kick"};
    public bool Execute()
    {
        string kind=CPH.GetEventType().ToString(),requestId=Read("requestId"),op=Read("ticketOperation");
        bool commandEvent=kind=="CommandTriggered";
        bool presence=kind.EndsWith("PresentViewers",StringComparison.Ordinal);
        bool chat=new[]{"TwitchChatMessage","YouTubeMessage","KickChatMessage"}.Contains(kind);
        bool reset=new[]{"TwitchStreamOffline","TwitchStreamOnline","KickStreamOffline","KickStreamOnline","YouTubeBroadcastEnded","YouTubeBroadcastStarted","YouTubeBroadcastMonitoringEnded"}.Contains(kind);
        string platform=kind.StartsWith("Twitch")?"twitch":kind.StartsWith("YouTube")?"youtube":kind.StartsWith("Kick")?"kick":"";
        if(commandEvent)
        {
            // Command triggers strip the command from rawInput in Starts With mode.
            // Never allow an unsupported command source to reach the operator path.
            platform=Read("commandSource").Trim().ToLowerInvariant();
            string commandType=Read("commandType").Trim().ToLowerInvariant();
            if(!Platforms.Contains(platform)||(commandType.Length>0&&commandType!="message"))return true;
            chat=true;
        }
        bool native=(presence||chat||reset)&&platform.Length>0;
        if(Flag("isTest")||Flag("isInternal")||Flag("isFromSharedChatGuest"))return true;
        // Chat/events cannot invoke operator operations, even if extra arguments exist.
        if(!native && !new[]{"sync","create","setTracking","enablePlatforms","pause","resume","lock","reopen","adjust","block","unblock","draw","reroll","confirm","complete","archive","show","hide","lookup","exportArchive"}.Contains(op))return true;
        Guid rid;if(!native&&!Guid.TryParse(requestId,out rid))return false;
        lock(Gate)
        {
            JObject s=null;string message="",replyPlatform="",replyBroadcast="";
            try
            {
                long now=Now();s=Load();JObject c=s["campaign"] as JObject;
                if(native)
                {
                    if(chat)
                    {
                        string textField;string cmd=CommandWord(ChatText(commandEvent,out textField));
                        bool entry=new[]{"!entry","!entergiveaway","!voyagerenter"}.Contains(cmd);
                        bool recognised=entry||new[]{"!tickets","!voyagertickets","!ticketgiveaway"}.Contains(cmd);
                        // A presence timer running does not prove chat reaches this action.
                        // Ordinary chat is sampled at most once per 15 seconds, without storing its body.
                        var ingress=s["chatIngress"][platform] as JObject;
                        if(recognised||ingress==null||now-N(ingress["lastAt"])>=15000)
                        {
                            s["chatIngress"][platform]=new JObject{["lastAt"]=now,["eventType"]=kind,["route"]=commandEvent?"command":"chat",["textField"]=textField,["hasUserId"]=ValidId(Read("userId")),["command"]=cmd.StartsWith("!",StringComparison.Ordinal)?Clean(cmd,40):"",["recognised"]=recognised};
                            if(!recognised){Save(s);Broadcast(s,"",null,"");}
                        }
                        if(!recognised)return true;
                        Expire(s,now);c=s["campaign"] as JObject;
                        JObject health=new JObject{["lastAt"]=now,["route"]=commandEvent?"command":"chat",["result"]="received",["command"]=cmd,["textField"]=textField,["eventType"]=kind,["userId"]=Read("userId"),["userName"]=Clean(Read("userName"),100),["replyStatus"]="not_requested"};
                        string id=Read("userId");
                        if(c==null||!ValidId(id))
                        {
                            health["result"]=c==null?"no_campaign":"missing_user_id";s["chatHealth"][platform]=health;
                            if(c!=null)CPH.LogWarn("[Voyager Tickets] "+platform+" entry received without a valid userId. Use its native chat trigger or Command Triggered with the original chat arguments.");
                            Save(s);Broadcast(s,"",null,"");return true;
                        }
                        var identity=Identity(platform,id,Read("userName"),Read("user"));string key=(string)identity["key"];
                        JObject users=(JObject)c["users"],u=users[key] as JObject;
                        // Registration is idempotent by stable platform ID. A reply cooldown must
                        // never reject registration, especially after a viewer just checked !tickets.
                        JObject replies=(JObject)s["chatReplies"];
                        if(!((JArray)c["platforms"]).Any(x=>(string)x==platform))
                        {
                            health["result"]="platform_disabled";
                            message="[Voyager Tickets] This giveaway is not enabled for "+platform+" yet. Please ask the streamer to enable it in Ticketed giveaway > Entry platforms.";
                        }
                        else if(cmd=="!ticketgiveaway")
                        {
                            health["result"]="status";
                            message="[Voyager Tickets] "+Clean((string)c["title"],70)+" — "+(string)c["status"]+". Join: !entergiveaway. 1 ticket / 10 tracked live minutes. Balance: !tickets.";
                        }
                        else if(entry)
                        {
                            if((string)c["status"]!="open"){health["result"]="closed";message="[Voyager Tickets] Entries are "+(string)c["status"]+" for "+Clean((string)c["title"],80)+".";}
                            else
                            {
                                bool joined=u==null;
                                if(joined){u=Join(c,identity,now);Audit(c,"join",key,0,"Chat entry",now);}
                                health["result"]=(bool)u["blocked"]?"excluded":joined?"registered":"already_registered";
                                message=(bool)u["blocked"]?"[Voyager Tickets] Your entry is excluded. Please contact the streamer.":"[Voyager Tickets] "+Clean((string)u["name"],40)+", you're registered. "+N(u["tickets"])+" tickets. Earn 1 per 10 tracked live minutes; !tickets checks your balance.";
                            }
                        }
                        else
                        {
                            health["result"]="balance";
                            message=u==null?"[Voyager Tickets] Join with !entergiveaway to start earning tickets.":"[Voyager Tickets] "+Clean((string)u["name"],40)+": "+N(u["tickets"])+" tickets ("+N(u["earned"])+" watchtime, "+Signed(u["manual"])+" manual)."+((bool)u["blocked"]?" Entry excluded.":"");
                        }
                        string result=(string)health["result"];
                        string replyKey=key+"|"+(entry?"entry":cmd=="!ticketgiveaway"?"status":"balance")+"|"+(result=="already_registered"?"registered":result);
                        bool newlyJoined=result=="registered";
                        if(!newlyJoined&&now-N(replies[replyKey])<15000){message="";health["replyStatus"]="duplicate_suppressed";}
                        else{replies[replyKey]=now;health["replyStatus"]="pending";}
                        if(replies.Count>20000)foreach(var p in replies.Properties().Where(x=>N(x.Value)<now-60000).ToList())p.Remove();
                        s["chatHealth"][platform]=health;
                        replyPlatform=platform;replyBroadcast=Read("broadcast.id");if(replyBroadcast.Length==0)replyBroadcast=Read("broadcastId");
                    }
                    else if(presence){Presence(s,platform,now);Expire(s,now);}
                    else {ResetPresence(s,platform);s["presence"][platform]["live"]=kind.EndsWith("Online")||kind.EndsWith("Started");s["presence"][platform]["lastEventAt"]=now;Expire(s,now);}
                    Save(s);if(message.Length>0){bool submitted=SendChat(replyPlatform,message,replyBroadcast);s["chatHealth"][replyPlatform]["replyStatus"]=submitted?"submitted":"failed";Save(s);}Broadcast(s,"",null,"");return true;
                }
                bool expired=Expire(s,now);if(expired)Save(s);
                if(op=="sync"){Broadcast(s,requestId,null,"");return true;}
                if(op=="exportArchive")
                {
                    string id=Read("ticketArchiveId");Guid archiveId;
                    if(!Guid.TryParse(id,out archiveId)||!((JArray)s["archives"]).Any(x=>(string)x["id"]==id))throw new Exception("Choose a saved giveaway archive.");
                    string raw=CPH.GetGlobalVar<string>(ArchiveKey(id),true);if(String.IsNullOrEmpty(raw))throw new Exception("The archived ledger is unavailable.");
                    Broadcast(s,requestId,JObject.Parse(raw),"");return true;
                }
                if(((JArray)s["requests"]).Any(x=>(string)x==requestId)){Broadcast(s,requestId,null,"");return true;}
                long expires=ArgLong("ticketExpiresAt",1,9007199254740991L);
                if(now>expires||expires>now+90000)throw new Exception("This command expired. Refresh before trying again.");
                if(ArgLong("ticketControlRevision",0,9007199254740991L)!=N(s["controlRevision"])||Read("ticketCampaignId")!=(string)((s["campaign"] as JObject)?["id"]??""))throw new Exception("The giveaway changed. Review the refreshed state before trying again.");
                c=s["campaign"] as JObject;
                if(op=="setTracking")
                {
                    long minutes=ArgLong("ticketTwitchIntervalMinutes",1,10);
                    if(minutes!=N(s["tracking"]["twitchIntervalMinutes"]))
                    {
                        s["tracking"]["twitchIntervalMinutes"]=minutes;ResetPresence(s,"twitch");
                        if(c!=null)Audit(c,"tracking_interval","",0,"Expected Twitch interval: "+minutes+" minute(s). Saved watchtime retained; next sample starts a new baseline.",now);
                    }
                }
                else if(op=="lookup")Lookup(s);
                else if(op=="create")
                {
                    if(c!=null)throw new Exception("Archive the current ticketed giveaway before creating the next one.");
                    string title=Required("ticketTitle",160);long ends=ArgLong("ticketEndsAt",now+60000,now+366L*86400000);
                    JArray selected=JArray.Parse(Read("ticketPlatforms"));if(selected.Count==0||selected.Count>3||selected.Any(x=>!Platforms.Contains((string)x))||selected.Select(x=>(string)x).Distinct().Count()!=selected.Count)throw new Exception("Choose the giveaway platforms.");
                    c=new JObject{["id"]=Guid.NewGuid().ToString(),["title"]=title,["startedAt"]=now,["endsAt"]=ends,["status"]="open",["rateMs"]=TicketMs,["platforms"]=selected,["users"]=new JObject(),["draws"]=new JArray(),["audit"]=new JArray(),["excludedLogins"]=new JArray(RequiredOrEmpty("ticketExclude",2000).Split(new[]{',',';','\n'},StringSplitOptions.RemoveEmptyEntries).Select(x=>x.Trim().TrimStart('@').ToLowerInvariant()).Where(x=>x.Length>0))};
                    s["campaign"]=c;s["chatHealth"]=new JObject();s["chatIngress"]=new JObject();s["chatReplies"]=new JObject();s["presence"]=new JObject();s["directory"]=new JObject();s["view"]="panel";s["reveal"]=null;s["celebration"]=null;Audit(c,"created","",0,"1 ticket / 10 minutes",now);
                }
                else if(op=="show"||op=="hide"){s["view"]=op=="show"?"panel":"hidden";}
                else
                {
                    if(c==null)throw new Exception("Create a ticketed giveaway first.");
                    var draws=(JArray)c["draws"];var last=draws.Last as JObject;string status=(string)c["status"];
                    if(new[]{"draw","reroll","confirm","archive","complete"}.Contains(op)&&last!=null&&now<N(last["at"])+(N(last["sequenceVersion"])==2?50000:20000))throw new Exception("Wait for the giveaway countdown, buildup and wheel to finish.");
                    if(op=="enablePlatforms")
                    {
                        if(draws.Count>0||status=="completed"||now>=N(c["endsAt"]))throw new Exception("Platforms cannot change after the deadline, first draw or completion.");
                        JArray selected=JArray.Parse(Read("ticketPlatforms"));
                        if(selected.Count==0||selected.Count>3||selected.Any(x=>x.Type!=JTokenType.String||!Platforms.Contains((string)x))||selected.Select(x=>(string)x).Distinct().Count()!=selected.Count)throw new Exception("Choose valid giveaway platforms.");
                        // Additive only: existing entrants, tickets and eligibility remain intact.
                        var enabled=(JArray)c["platforms"];var added=selected.Select(x=>(string)x).Where(p=>!enabled.Any(x=>(string)x==p)).ToList();
                        foreach(string p in added){enabled.Add(p);ResetPresence(s,p);foreach(var reply in ((JObject)s["chatReplies"]).Properties().Where(x=>x.Name.StartsWith(p+":id:",StringComparison.Ordinal)).ToList())reply.Remove();}
                        if(added.Count>0)Audit(c,"platforms_enabled","",0,"Enabled "+String.Join(", ",added)+"; existing tickets preserved",now);
                    }
                    else if(op=="pause"||op=="resume"||op=="lock"||op=="reopen")
                    {
                        if(draws.Count>0||status=="completed")throw new Exception("Entry collection cannot change after a draw or completion.");
                        if(op=="pause"&&status!="open"||op=="resume"&&status!="paused"||op=="lock"&&!new[]{"open","paused"}.Contains(status)||op=="reopen"&&status!="locked")throw new Exception("This entry control is unavailable in the current state.");
                        if((op=="resume"||op=="reopen")&&now>=N(c["endsAt"]))throw new Exception("The collection deadline has passed.");
                        c["status"]=op=="pause"?"paused":op=="lock"?"locked":"open";s["presence"]=new JObject();Audit(c,op,"",0,"Operator control",now);
                    }
                    else if(op=="adjust"||op=="block"||op=="unblock")
                    {
                        if(draws.Count>0||status=="completed")throw new Exception("Tickets and eligibility are frozen after the first draw.");
                        string key=Read("ticketUserKey");JObject u=c["users"][key] as JObject,identity=s["directory"][key] as JObject;
                        if(u==null){if(identity==null)throw new Exception("Select a known account or look up a Twitch login first.");if(!((JArray)c["platforms"]).Any(x=>(string)x==(string)identity["platform"]))throw new Exception("This platform is not enabled for the giveaway.");u=Join(c,identity,now);}
                        if(ArgLong("ticketExpectedBalance",0,MaxTickets)!=N(u["tickets"]))throw new Exception("This user's ticket balance changed. Review it and try again.");
                        string reason=Required("ticketReason",240);
                        if(op=="adjust")
                        {
                            long delta=ArgLong("ticketDelta",-100000,100000);if(delta==0)throw new Exception("Enter a non-zero ticket adjustment.");
                            long balance=N(u["tickets"])+delta;if(balance<0||balance>MaxTickets)throw new Exception("The ticket balance must stay between 0 and 1 billion.");
                            if(Total(c)+delta>MaxTickets)throw new Exception("Giveaway ticket capacity reached.");
                            u["manual"]=Signed(u["manual"])+delta;u["tickets"]=balance;Audit(c,"manual",key,delta,reason,now);
                        }
                        else{u["blocked"]=op=="block";Audit(c,op,key,0,reason,now);}
                    }
                    else if(op=="draw"||op=="reroll")
                    {
                        if(!new[]{"locked","drawn"}.Contains(status))throw new Exception("Lock ticket collection before drawing.");
                        if(op=="draw"&&last!=null&&(string)last["status"]=="selected")throw new Exception("Confirm or reroll the selected winner first.");
                        if(op=="reroll"&&(last==null||(string)last["status"]!="selected"))throw new Exception("There is no unconfirmed winner to reroll.");
                        var used=new HashSet<string>(draws.Select(x=>(string)x["winner"]["key"]));
                        var pool=((JObject)c["users"]).Properties().Select(x=>(JObject)x.Value).Where(u=>!(bool)u["blocked"]&&!used.Contains((string)u["key"])&&N(u["tickets"])>0).OrderBy(u=>(string)u["key"],StringComparer.Ordinal).ToList();
                        long total=pool.Sum(u=>N(u["tickets"]));if(total<1||total>MaxTickets)throw new Exception("No eligible tickets remain.");
                        long winningTicket=RandomBelow((int)total)+1,cumulative=0;JObject winner=null;foreach(var u in pool){cumulative+=N(u["tickets"]);if(winningTicket<=cumulative){winner=u;break;}}
                        if(op=="reroll")last["status"]="rerolled";
                        var draw=new JObject{["id"]=Guid.NewGuid().ToString(),["at"]=now,["sequenceVersion"]=2,["wheelMs"]=30000,["revealDelayMs"]=50000,["claimStartsAt"]=now+60000L,["claimDeadline"]=now+120000L,["status"]="selected",["winner"]=winner.DeepClone(),["totalTickets"]=total,["winningTicket"]=winningTicket,["eligibleAccounts"]=pool.Count,["weights"]=new JArray(pool.Select(u=>new JObject{["key"]=u["key"],["tickets"]=u["tickets"]}))};
                        draws.Add(draw);c["status"]="drawn";s["reveal"]=new JObject{["id"]=draw["id"],["at"]=now,["winner"]=winner["name"],["platform"]=winner["platform"],["title"]=c["title"],["drawId"]=draw["id"],["sequenceVersion"]=2,["wheelMs"]=30000,["revealDelayMs"]=50000,["claimStartsAt"]=draw["claimStartsAt"],["claimDeadline"]=draw["claimDeadline"]};s["celebration"]=null;s["view"]="reveal";Audit(c,op,(string)winner["key"],0,"Winning ticket "+winningTicket+" / "+total,now);
                    }
                    else if(op=="confirm")
                    {
                        if(last==null||(string)last["status"]!="selected")throw new Exception("There is no winner awaiting confirmation.");
                        if(N(last["claimDeadline"])>0&&now>=N(last["claimDeadline"]))throw new Exception("The 60-second claim window has ended. Reroll to choose the next winner.");
                        last["status"]="confirmed";last["confirmedAt"]=now;s["celebration"]=new JObject{["id"]=Guid.NewGuid().ToString(),["at"]=now,["winner"]=last["winner"]["name"]};s["view"]="celebration";Audit(c,"confirmed",(string)last["winner"]["key"],0,"Winner confirmed",now);
                    }
                    else if(op=="complete")
                    {
                        if(last!=null&&(string)last["status"]=="selected")throw new Exception("Confirm or reroll the selected winner first.");c["status"]="completed";s["presence"]=new JObject();Audit(c,"completed","",0,"Operator ended campaign",now);
                    }
                    else if(op=="archive")
                    {
                        if(status!="completed")throw new Exception("Complete the giveaway before archiving it.");
                        if(((JArray)s["archives"]).Count>=1000)throw new Exception("Archive index capacity reached; export the ledger before extending it.");
                        string id=(string)c["id"];CPH.SetGlobalVar(ArchiveKey(id),c.ToString(Formatting.None),true);
                        ((JArray)s["archives"]).Add(new JObject{["id"]=id,["title"]=c["title"],["startedAt"]=c["startedAt"],["endsAt"]=c["endsAt"],["archivedAt"]=now,["tickets"]=Total(c),["accounts"]=((JObject)c["users"]).Count});s["campaign"]=null;s["presence"]=new JObject();s["directory"]=new JObject();s["view"]="hidden";s["reveal"]=null;s["celebration"]=null;
                    }
                }
                s["controlRevision"]=N(s["controlRevision"])+1;var done=(JArray)s["requests"];done.Add(requestId);while(done.Count>500)done.RemoveAt(0);Save(s);
                if(op=="create"&&Flag("ticketAnnounce"))foreach(string p in ((JArray)c["platforms"]).Select(x=>(string)x))SendChat(p,"[Voyager Tickets] "+Clean((string)c["title"],80)+" is open! Join with !entergiveaway. Earn 1 ticket per 10 tracked live minutes. !tickets for your balance.","");
                Broadcast(s,requestId,null,"");return true;
            }
            catch(Exception ex){CPH.LogWarn("[Voyager Tickets] "+ex.Message);if(!native){try{s=Load();}catch{s=null;}Broadcast(s,requestId,null,ex.Message);}return false;}
        }
    }
    private JObject Load()
    {
        string raw=CPH.GetGlobalVar<string>(Store,true);
        JObject s=String.IsNullOrEmpty(raw)?new JObject{["schema"]=1,["revision"]=0,["controlRevision"]=0,["campaign"]=null,["presence"]=new JObject(),["directory"]=new JObject(),["chatReplies"]=new JObject(),["requests"]=new JArray(),["archives"]=new JArray(),["view"]="hidden"}:JObject.Parse(raw);
        if((int?)s["schema"]!=1||!(s["presence"] is JObject)||!(s["directory"] is JObject)||!(s["requests"] is JArray)||!(s["archives"] is JArray)||!(s["chatReplies"] is JObject))throw new Exception("Invalid ticket ledger; saved data was preserved.");
        if(s["chatHealth"]==null)s["chatHealth"]=new JObject();
        if(!(s["chatHealth"] is JObject))throw new Exception("Invalid ticket chat diagnostics; saved data was preserved.");
        if(s["chatIngress"]==null)s["chatIngress"]=new JObject();
        if(!(s["chatIngress"] is JObject))throw new Exception("Invalid ticket chat reception diagnostics; saved data was preserved.");
        if(s["tracking"]==null)s["tracking"]=new JObject{["twitchIntervalMinutes"]=1};
        if(!(s["tracking"] is JObject)||s["tracking"]["twitchIntervalMinutes"]?.Type!=JTokenType.Integer||N(s["tracking"]["twitchIntervalMinutes"])<1||N(s["tracking"]["twitchIntervalMinutes"])>10)throw new Exception("Invalid ticket tracking settings; saved data was preserved.");
        s["backendVersion"]="1.4";
        N(s["revision"]);N(s["controlRevision"]);var c=s["campaign"] as JObject;
        if(c!=null){if(!(c["users"] is JObject)||!(c["audit"] is JArray)||!(c["draws"] is JArray)||!(c["platforms"] is JArray)||N(c["rateMs"])!=TicketMs)throw new Exception("Invalid ticket campaign; data preserved.");foreach(var p in ((JObject)c["users"]).Properties()){var u=p.Value as JObject;if(u==null||N(u["earned"])+Signed(u["manual"])!=N(u["tickets"])||N(u["watchMs"])/TicketMs!=N(u["earned"])||u["blocked"]?.Type!=JTokenType.Boolean)throw new Exception("Invalid ticket balance; data preserved.");}if(Total(c)>MaxTickets)throw new Exception("Ticket total exceeds supported capacity.");}return s;
    }
    private void Presence(JObject s,string platform,long now)
    {
        JObject c=s["campaign"] as JObject;var all=(JObject)s["presence"];JObject p=all[platform] as JObject;if(p==null){p=new JObject();all[platform]=p;}
        long last=N(p["lastAt"]),gap=now-last;bool same=(string)p["session"]==ProcessSession;
        long interval=platform=="twitch"?N(s["tracking"]["twitchIntervalMinutes"])*60000:60000;
        long maxGap=interval+30000;
        // Receipt is separate from the last valid baseline: a stopped timer must not look live.
        p["receivedAt"]=now;p["eventsReceived"]=N(p["eventsReceived"])+1;p["expectedIntervalMs"]=interval;p["allowedGapMs"]=maxGap;
        if(same&&last>0&&gap>=0&&gap<20000){p["duplicateEvents"]=N(p["duplicateEvents"])+1;return;}
        p["lastEventAt"]=now;p["warning"]="";p["count"]=0;p["rawCount"]=0;p["matchedCount"]=0;p["creditedCount"]=0;p["addedTickets"]=0;p["invalidCount"]=0;p["unmatchedSample"]=new JArray();
        p["gapMs"]=same&&last>0?Math.Max(0,gap):0;
        bool live;bool knownLive=Boolean.TryParse(Read("isLive"),out live);p["live"]=knownLive?(JToken)live:JValue.CreateNull();
        string stopped=c==null?"no_campaign":!((JArray)c["platforms"]).Any(x=>(string)x==platform)?"platform_disabled":(string)c["status"]!="open"?"collection_closed":!knownLive?"missing_live_flag":!live?"offline":"";
        if(stopped.Length>0){ResetPresence(s,platform);p["trackingStatus"]=stopped;if(stopped=="missing_live_flag")p["warning"]="Present Viewers did not supply isLive. Attach the native platform trigger directly to Voyager - Ticket Giveaway.";return;}
        object raw;JArray incoming=null;
        if(!CPH.TryGetArg<object>("users",out raw)||raw==null){ResetPresence(s,platform);p["trackingStatus"]="missing_users";p["warning"]="Present Viewers did not supply users. Attach its native trigger directly to this action.";return;}
        try{incoming=raw as JArray??(raw is string?JArray.Parse((string)raw):JArray.FromObject(raw));}
        catch{ResetPresence(s,platform);p["trackingStatus"]="invalid_users";p["warning"]="Present Viewers users is not a valid list. Inspect this action's incoming arguments.";return;}
        if(incoming.Count>50000){ResetPresence(s,platform);p["trackingStatus"]="invalid_users";p["warning"]="Presence list exceeds capacity.";return;}
        p["rawCount"]=incoming.Count;
        bool accrue=same&&last>0&&gap>=20000&&gap<=maxGap;
        p["trackingStatus"]=accrue?"tracking":same&&last>0&&gap>maxGap?"gap_reset":"baseline";
        var before=new HashSet<string>(((JArray)(p["present"]??new JArray())).Select(x=>(string)x));var current=new HashSet<string>();var users=(JObject)c["users"];var directory=(JObject)s["directory"];
        p["registeredCount"]=users.Properties().Count(x=>(string)x.Value["platform"]==platform);
        long total=Total(c),matched=0,credited=0,awarded=0,invalid=0;
        foreach(JToken token in incoming)
        {
            JObject row=token as JObject;if(row==null){invalid++;continue;}
            string id=Text(row,"id","userId","UserId");if(!ValidId(id)){invalid++;continue;}
            var identity=Identity(platform,id,Text(row,"userName","userLogin","login","UserLogin"),Text(row,"displayName","user","UserName","name","display"));string key=(string)identity["key"];if(!current.Add(key))continue;
            if(directory[key]!=null||directory.Count<20000)directory[key]=identity;
            var u=users[key] as JObject;if(u==null){if(((JArray)p["unmatchedSample"]).Count<3)((JArray)p["unmatchedSample"]).Add(identity.DeepClone());continue;}matched++;
            // A presence row may omit names. Retain the chat identity instead of replacing it with an ID.
            if(((string)identity["login"]).Length>0)u["login"]=identity["login"];
            if((string)identity["name"]!=id)u["name"]=identity["name"];
            u["lastSeenAt"]=now;
            if(!accrue||!before.Contains(key)||(bool)u["blocked"])continue;
            long duration=Math.Max(0,Math.Min(now,N(c["endsAt"]))-Math.Max(last,Math.Max(N(c["startedAt"]),N(u["joinedAt"]))));
            long watch=checked(N(u["watchMs"])+duration),earned=watch/TicketMs,added=earned-N(u["earned"]);
            if(total+added>MaxTickets){p["warning"]="Ticket capacity reached; collection paused.";c["status"]="paused";p["trackingStatus"]="capacity";continue;}
            total+=added;u["watchMs"]=watch;u["earned"]=earned;u["tickets"]=N(u["tickets"])+added;
            if(duration>0){credited++;u["watchUpdatedAt"]=now;p["lastCreditedAt"]=now;}
            if(added>0){u["lastTicketAt"]=now;awarded+=added;}
        }
        if(same&&last>0&&gap>maxGap)p["warning"]="Received samples "+(gap/60000.0).ToString("0.0",CultureInfo.InvariantCulture)+" minutes apart; expected "+(interval/60000)+" minute(s). No time was added for this gap. Check the interval setting and queue.";
        if(current.Count==0){p["trackingStatus"]=incoming.Count>0?"unreadable_ids":"empty";p["warning"]=incoming.Count>0?"Presence rows contain no valid account IDs; no time credited.":"Presence list is empty. Check the platform's Present Viewers settings and chat connection.";}
        else if(matched==0){p["trackingStatus"]="no_registered_present";p["warning"]="Presence updates are arriving, but none of these accounts match this giveaway's registered platform IDs.";}
        p["invalidCount"]=invalid;p["matchedCount"]=matched;p["creditedCount"]=credited;p["addedTickets"]=awarded;
        p["lastAt"]=now;p["session"]=ProcessSession;p["present"]=new JArray(current);p["count"]=current.Count;
    }
    private JObject Join(JObject c,JObject identity,long now)
    {
        string key=(string)identity["key"],login=(string)identity["login"],platform=(string)identity["platform"];var users=(JObject)c["users"];
        if(users.Count>=20000)throw new Exception("20,000-account capacity reached.");
        bool blocked=((JArray)c["excludedLogins"]).Any(x=>(string)x==login||(string)x==platform+":"+login||(string)x==key.ToLowerInvariant());
        var u=(JObject)identity.DeepClone();u["joinedAt"]=now;u["watchMs"]=0;u["earned"]=0;u["manual"]=0;u["tickets"]=0;u["blocked"]=blocked;users[key]=u;return u;
    }
    private void Lookup(JObject s)
    {
        string login=Required("ticketLogin",25).TrimStart('@').ToLowerInvariant();if(login.Any(c=>!(Char.IsLetterOrDigit(c)||c=='_')))throw new Exception("Enter a Twitch login.");
        var info=CPH.TwitchGetUserInfoByLogin(login);if(info==null||!ValidId(info.UserId))throw new Exception("Twitch could not resolve this account. Check the login and connection.");
        var identity=Identity("twitch",info.UserId,info.UserLogin,info.UserName);var dir=(JObject)s["directory"];if(dir.Count>=20000&&dir[(string)identity["key"]]==null)throw new Exception("Account directory capacity reached.");dir[(string)identity["key"]]=identity;s["selectedKey"]=identity["key"];
    }
    private static JObject Identity(string platform,string id,string login,string name){login=Clean(login,100).TrimStart('@').ToLowerInvariant();name=Clean(name,100);return new JObject{["key"]=platform+":id:"+id,["id"]=id,["platform"]=platform,["login"]=login,["name"]=name.Length>0?name:login.Length>0?login:id};}
    private static void ResetPresence(JObject s,string p){JObject row=s["presence"][p] as JObject;if(row==null){row=new JObject();s["presence"][p]=row;}row["lastAt"]=0;row["present"]=new JArray();row["session"]=ProcessSession;row["trackingStatus"]="baseline_pending";row["count"]=0;row["matchedCount"]=0;row["creditedCount"]=0;row["addedTickets"]=0;}
    private static bool Expire(JObject s,long now){var c=s["campaign"] as JObject;if(c!=null&&new[]{"open","paused"}.Contains((string)c["status"])&&now>=N(c["endsAt"])){c["status"]="locked";c["lockedAt"]=N(c["endsAt"]);s["presence"]=new JObject();s["controlRevision"]=N(s["controlRevision"])+1;Audit(c,"deadline","",0,"Collection deadline reached",now);return true;}return false;}
    private static void Audit(JObject c,string op,string key,long amount,string reason,long now){JArray a=(JArray)c["audit"];if(a.Count>=100000)throw new Exception("Audit capacity reached; export before extending this campaign.");a.Add(new JObject{["at"]=now,["operation"]=op,["key"]=key,["amount"]=amount,["reason"]=reason});}
    private static long Total(JObject c){return ((JObject)c["users"]).Properties().Sum(x=>N(x.Value["tickets"]));}
    private static int RandomBelow(int bound){ulong range=1UL<<32,limit=range-range%(ulong)bound;byte[] bytes=new byte[4];using(var rng=RandomNumberGenerator.Create()){uint v;do{rng.GetBytes(bytes);v=BitConverter.ToUInt32(bytes,0);}while((ulong)v>=limit);return (int)(v%(uint)bound);}}
    private void Save(JObject s){s["revision"]=N(s["revision"])+1;s["updatedAt"]=Now();CPH.SetGlobalVar(Store,s.ToString(Formatting.None),true);}
    private void Broadcast(JObject s,string id,JObject archive,string error){try{JObject clean=s==null?null:(JObject)s.DeepClone();if(clean!=null){clean.Remove("chatReplies");clean.Remove("requests");foreach(var p in ((JObject)clean["presence"]).Properties()){((JObject)p.Value).Remove("present");((JObject)p.Value).Remove("session");}}CPH.WebsocketBroadcastJson(new JObject{["type"]="voyager.tickets.v1",["schema"]=1,["ok"]=error.Length==0,["error"]=error,["requestId"]=id,["serverAt"]=Now(),["state"]=clean,["archive"]=archive}.ToString(Formatting.None));}catch(Exception ex){CPH.LogWarn("[Voyager Tickets] Saved state; broadcast unavailable: "+ex.Message);}}
    private bool SendChat(string platform,string message,string broadcast){try{if(platform=="twitch")CPH.SendMessage(message,true,true);else if(platform=="kick")CPH.SendKickMessage(message,true,true);else if(platform=="youtube"){if(broadcast.Length>0)CPH.SendYouTubeMessage(message,true,true,broadcast);else{var broadcasts=CPH.YouTubeGetMonitoredBroadcasts();if(broadcasts==null||broadcasts.Count!=1)throw new Exception("Monitor one YouTube broadcast or use its originating chat command.");CPH.SendYouTubeMessageToLatestMonitored(message,true,true);}}return true;}catch(Exception ex){CPH.LogWarn("[Voyager Tickets] Chat submission failed: "+ex.Message);return false;}}
    private string ChatText(bool commandEvent,out string field){foreach(string key in commandEvent?new[]{"command"}:new[]{"message","rawInput","messageStripped"}){string value=Read(key);if(!String.IsNullOrWhiteSpace(value)){field=key;return value;}}field="missing";return "";}
    private static string CommandWord(string text){text=(text??"").Trim().Trim('\u200B','\uFEFF').Trim();int i=0;while(i<text.Length&&!Char.IsWhiteSpace(text[i]))i++;return text.Substring(0,i).ToLowerInvariant();}
    private static string ArchiveKey(string id){return "VoyagerTicketArchive_"+Guid.Parse(id).ToString("N");}
    private static bool ValidId(string id){return !String.IsNullOrWhiteSpace(id)&&id.Length<=128&&!id.Any(Char.IsControl)&&!id.Equals("anonymous",StringComparison.OrdinalIgnoreCase);}
    private static string Text(JObject o,params string[] keys){foreach(var k in keys){var t=o[k];if(t!=null&&(t.Type==JTokenType.String||t.Type==JTokenType.Integer)&&!String.IsNullOrWhiteSpace((string)t))return (string)t;}return "";}
    private static string Clean(string s,int length){s=new String((s??"").Where(c=>!Char.IsControl(c)).ToArray()).Trim();return s.Length>length?s.Substring(0,length):s;}
    private static long Signed(JToken t){long n;if(t==null)return 0;if(!Int64.TryParse(t.ToString(),NumberStyles.Integer,CultureInfo.InvariantCulture,out n)||n< -MaxTickets||n>9007199254740991L)throw new Exception("Invalid saved ticket number.");return n;}
    private static long N(JToken t){long n=Signed(t);if(n<0)throw new Exception("Invalid negative ticket number.");return n;}
    private long ArgLong(string k,long min,long max){long n;if(!Int64.TryParse(Read(k),NumberStyles.Integer,CultureInfo.InvariantCulture,out n)||n<min||n>max)throw new Exception("Invalid "+k+".");return n;}
    private string RequiredOrEmpty(string k,int max){string s=Read(k);if(s.Length>max||s.Any(c=>Char.IsControl(c)&&c!='\n'))throw new Exception("Invalid "+k+".");return s.Trim();}
    private string Required(string k,int max){string s=RequiredOrEmpty(k,max);if(s.Length==0)throw new Exception("Enter "+k+".");return s;}
    private bool Flag(string k){bool b;return Boolean.TryParse(Read(k),out b)&&b;}
    private string Read(string k){object v;return CPH.TryGetArg<object>(k,out v)&&v!=null?Convert.ToString(v,CultureInfo.InvariantCulture):"";}
    private static long Now(){return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();}
}
