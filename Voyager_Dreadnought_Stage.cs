// Voyager Dreadnought Stage v1.4. One action: Voyager - Dreadnought Stage. No triggers: Voyager runs it (DoAction) when the
// Dreadnought stage comes up and goes down. It moves the OBS scene item that holds your game (a nested scene or a group,
// named on Voyager Control › Voyager Dreadnought › Stage) into the picture-in-picture window with a short animation, and
// moves it back afterwards. The item's original transform is kept in a Streamer.bot global so a restart can still restore it.
// Arguments from Voyager: stagePhase (on|off), stageScene, stageSource, stageX, stageY, stageW, stageH, stageMs, stageHide (JSON list of
// source names to hide while the stage is up; they are shown again on off, only the ones that were visible before).
// v1.4: stagePhase show|hide with stageSources (JSON list) shows or hides those sources in the current scene (or stageScene when
// named) — Voyager's timed sources (Screen & overlays › Layout), e.g. a referral code for 30 s every 10 minutes.
// If Compile reports CS0012 "The type 'Uri' is defined in an assembly that is not referenced": click Find Refs (or References › add System.dll), then Compile again.
using System;using System.Globalization;using System.Threading;using Newtonsoft.Json;using Newtonsoft.Json.Linq;
public class CPHInline {
 const string Store="VoyagerDreadnoughtStageV1";static readonly object Gate=new object();
 public bool Execute(){
  string phase=Read("stagePhase"),scene=Read("stageScene"),source=Read("stageSource");
  string requestId=Read("requestId");
  if(phase=="show"||phase=="hide"){Toggle(phase=="show",scene,requestId);return true;}
  if(phase!="on"&&phase!="off"){Report(requestId,phase,false,"No stagePhase argument: this action is run by Voyager, it needs no triggers.");return true;}
  if(scene.Length==0||source.Length==0){Report(requestId,phase,false,"Scene or game source not named yet (Voyager Control › Voyager Dreadnought › Stage).");return true;}
  double x=Num("stageX",1252),y=Num("stageY",704),w=Num("stageW",640),h=Num("stageH",360);int ms=(int)Math.Max(200,Math.Min(4000,Num("stageMs",1200)));
  lock(Gate){try{
   // The window is given on Voyager's 1920 x 1080 layout; scale it to the OBS canvas (a 2560 x 1440 or 3840 x 2160 canvas puts it in the same corner).
   double[] canvas=Canvas();double fx=canvas[0]/1920.0,fy=canvas[1]/1080.0;x*=fx;y*=fy;w*=fx;h*=fy;
   long id=ItemId(scene,source);JObject cur=Transform(scene,id);JObject saved=Saved();
   double[] from=Rect(cur);
   if(phase=="on"){
    if(saved==null||(string)saved["scene"]!=scene||(long)saved["id"]!=id){saved=new JObject{["scene"]=scene,["id"]=id,["source"]=source,["t"]=cur,["at"]=DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()};CPH.SetGlobalVar(Store,saved.ToString(Formatting.None),true);}
    else from=Rect(cur);
    Animate(scene,id,from,new double[]{x,y,w,h},ms);
    string hid=Hide(scene,saved);
    Report(requestId,phase,true,"'"+source+"' moved to the picture-in-picture window ("+Math.Round(w)+"x"+Math.Round(h)+" at "+Math.Round(x)+","+Math.Round(y)+" on a "+canvas[0]+"x"+canvas[1]+" canvas) in "+ms+" ms."+hid);
   }else{
    if(saved==null){Report(requestId,phase,true,"Nothing to restore (the game was never moved).");return true;}
    JObject t=(JObject)saved["t"];double[] to=Rect(t);
    string shown=Unhide(saved);
    Animate(scene,id,from,to,ms);
    // Exact original transform back (scale or bounds mode, alignment, crop are untouched).
    JObject restore=new JObject{["positionX"]=t["positionX"],["positionY"]=t["positionY"],["scaleX"]=t["scaleX"],["scaleY"]=t["scaleY"],["alignment"]=t["alignment"],["boundsType"]=t["boundsType"],["boundsAlignment"]=t["boundsAlignment"]};
    if((string)t["boundsType"]!="OBS_BOUNDS_NONE"){restore["boundsWidth"]=t["boundsWidth"];restore["boundsHeight"]=t["boundsHeight"];}
    Set(scene,id,restore);CPH.SetGlobalVar(Store,"",true);
    Report(requestId,phase,true,"'"+source+"' restored to its place."+shown);
   }
  }catch(Exception e){Report(requestId,phase,false,e.Message);}}
  return true;
 }
 // Top-left rectangle the item covers now: position adjusted for its alignment, size from OBS' computed width/height.
 double[] Rect(JObject t){double px=D(t["positionX"]),py=D(t["positionY"]),w=D(t["width"]),h=D(t["height"]);int a=(int)D(t["alignment"]);
  double left=px-((a&1)!=0?0:(a&2)!=0?w:w/2),top=py-((a&4)!=0?0:(a&8)!=0?h:h/2);return new double[]{left,top,w,h};}
 // Animate position and size with the item in "scale to inner bounds" mode and top-left alignment, so any source size fits the window.
 void Animate(string scene,long id,double[] from,double[] to,int ms){
  int steps=Math.Max(6,ms/33);
  for(int i=1;i<=steps;i++){double k=(double)i/steps;k=k<.5?4*k*k*k:1-Math.Pow(-2*k+2,3)/2; // ease in-out cubic
   double x=from[0]+(to[0]-from[0])*k,y=from[1]+(to[1]-from[1])*k,w=Math.Max(1,from[2]+(to[2]-from[2])*k),h=Math.Max(1,from[3]+(to[3]-from[3])*k);
   Set(scene,id,new JObject{["positionX"]=x,["positionY"]=y,["alignment"]=5,["boundsType"]="OBS_BOUNDS_SCALE_INNER",["boundsAlignment"]=0,["boundsWidth"]=w,["boundsHeight"]=h});
   if(i<steps)Thread.Sleep(ms/steps);}
 }
 void Set(string scene,long id,JObject t){CPH.ObsSendRaw("SetSceneItemTransform","{\"sceneName\":"+JsonConvert.ToString(scene)+",\"sceneItemId\":"+id+",\"sceneItemTransform\":"+t.ToString(Formatting.None)+"}");}
 JObject Transform(string scene,long id){string raw=CPH.ObsSendRaw("GetSceneItemTransform","{\"sceneName\":"+JsonConvert.ToString(scene)+",\"sceneItemId\":"+id+"}");if(String.IsNullOrWhiteSpace(raw))throw new Exception("No reply from OBS (is the OBS connection on in Streamer.bot?).");
  JObject t=JObject.Parse(raw)["sceneItemTransform"] as JObject;if(t==null)throw new Exception("OBS gave no transform for item "+id+" in '"+scene+"'.");return t;}
 long ItemId(string scene,string source){string raw=CPH.ObsSendRaw("GetSceneItemId","{\"sceneName\":"+JsonConvert.ToString(scene)+",\"sourceName\":"+JsonConvert.ToString(source)+"}");
  if(String.IsNullOrWhiteSpace(raw))throw new Exception("No reply from OBS (is the OBS connection on in Streamer.bot?).");JToken id=JObject.Parse(raw)["sceneItemId"];
  if(id==null)throw new Exception("'"+source+"' is not directly in the scene '"+scene+"'. Items in that scene: "+Items(scene)+". Put your game and camera in one nested scene or group inside the live scene and name that here.");return (long)id;}
 string Items(string scene){try{string raw=CPH.ObsSendRaw("GetSceneItemList","{\"sceneName\":"+JsonConvert.ToString(scene)+"}");JArray items=JObject.Parse(raw)["sceneItems"] as JArray;if(items==null)return "(scene '"+scene+"' not found in OBS: check the scene name)";
  var names=new System.Collections.Generic.List<string>();foreach(JObject it in items)names.Add((string)it["sourceName"]+((bool?)it["isGroup"]==true?" (group)":(string)it["sourceType"]=="OBS_SOURCE_TYPE_SCENE"?" (scene)":""));return names.Count==0?"(none)":String.Join(", ",names);}catch{return "(could not list)";}}
 // Tells Voyager what OBS did, so the Dreadnought page's checklist can show it (and logs the same line in Streamer.bot).
 void Report(string requestId,string phase,bool ok,string message){Report(requestId,phase,ok,message,"");}
 void Report(string requestId,string phase,bool ok,string message,string sources){if(ok)CPH.LogInfo("[Voyager Stage] "+message);else CPH.LogWarn("[Voyager Stage] "+message);
  try{CPH.WebsocketBroadcastJson(new JObject{["type"]="voyager.stage.result",["v"]=1,["requestId"]=requestId,["phase"]=phase,["ok"]=ok,["message"]=message,["sources"]=sources,["backendVersion"]="1.4",["at"]=DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}.ToString(Formatting.None));}catch{}}
 // v1.4: show or hide the named sources (stageSources) in the current program scene, or in `scene` when Voyager names one. Nothing is remembered.
 void Toggle(bool on,string scene,string requestId){string raw=Read("stageSources");JArray names;try{names=String.IsNullOrWhiteSpace(raw)?new JArray():JArray.Parse(raw);}catch{names=new JArray();}
  if(names.Count==0){Report(requestId,on?"show":"hide",false,"No stageSources named.");return;}
  if(scene.Length==0){try{scene=(string)JObject.Parse(CPH.ObsSendRaw("GetCurrentProgramScene","{}"))["currentProgramSceneName"];}catch(Exception e){Report(requestId,on?"show":"hide",false,"Could not read the current OBS scene: "+e.Message);return;}}
  var done=new System.Collections.Generic.List<string>();var missing=new System.Collections.Generic.List<string>();
  lock(Gate){foreach(JToken n in names){string name=(string)n;if(String.IsNullOrWhiteSpace(name))continue;JObject hit=Find(scene,name);if(hit==null){missing.Add(name);continue;}
   if((bool?)hit["enabled"]==on){done.Add(name);continue;}try{SetEnabled((string)hit["scene"],(long)hit["id"],on);done.Add(name);}catch(Exception e){missing.Add(name+" (failed: "+e.Message+")");}}}
  Report(requestId,on?"show":"hide",missing.Count==0,(done.Count>0?(on?"Shown: ":"Hidden: ")+String.Join(", ",done)+" in '"+scene+"'.":"")+(missing.Count>0?" Not found in '"+scene+"': "+String.Join(", ",missing)+".":""),raw);}
 // Hide the named sources (anywhere in the scene, including inside groups) that are visible now; remember them for Unhide.
 string Hide(string scene,JObject saved){string raw=Read("stageHide");JArray names;try{names=String.IsNullOrWhiteSpace(raw)?new JArray():JArray.Parse(raw);}catch{names=new JArray();}
  JArray hidden=saved["hidden"] as JArray??new JArray();var missing=new System.Collections.Generic.List<string>();
  foreach(JToken n in names){string name=(string)n;if(String.IsNullOrWhiteSpace(name))continue;bool already=false;foreach(JObject h in hidden)if(String.Equals((string)h["name"],name,StringComparison.OrdinalIgnoreCase))already=true;if(already)continue;
   JObject hit=Find(scene,name);if(hit==null){missing.Add(name);continue;}
   if((bool?)hit["enabled"]!=true)continue;SetEnabled((string)hit["scene"],(long)hit["id"],false);hidden.Add(new JObject{["scene"]=hit["scene"],["id"]=hit["id"],["name"]=name});}
  saved["hidden"]=hidden;CPH.SetGlobalVar(Store,saved.ToString(Formatting.None),true);
  var hiddenNames=new System.Collections.Generic.List<string>();foreach(JObject h in hidden)hiddenNames.Add((string)h["name"]);
  return (hiddenNames.Count>0?" Hidden: "+String.Join(", ",hiddenNames)+".":"")+(missing.Count>0?" Not found in '"+scene+"': "+String.Join(", ",missing)+".":"");}
 string Unhide(JObject saved){JArray hidden=saved["hidden"] as JArray;if(hidden==null||hidden.Count==0)return "";var names=new System.Collections.Generic.List<string>();
  foreach(JObject h in hidden){try{SetEnabled((string)h["scene"],(long)h["id"],true);names.Add((string)h["name"]);}catch(Exception e){names.Add((string)h["name"]+" (failed: "+e.Message+")");}}
  return " Shown again: "+String.Join(", ",names)+".";}
 void SetEnabled(string scene,long id,bool on){CPH.ObsSendRaw("SetSceneItemEnabled","{\"sceneName\":"+JsonConvert.ToString(scene)+",\"sceneItemId\":"+id+",\"sceneItemEnabled\":"+(on?"true":"false")+"}");}
 // A source by name in the scene, or inside one of its groups: {scene (scene or group name), id, enabled}.
 JObject Find(string scene,string name){try{string raw=CPH.ObsSendRaw("GetSceneItemList","{\"sceneName\":"+JsonConvert.ToString(scene)+"}");JArray items=JObject.Parse(raw)["sceneItems"] as JArray;if(items==null)return null;
   foreach(JObject it in items){if(String.Equals((string)it["sourceName"],name,StringComparison.OrdinalIgnoreCase))return new JObject{["scene"]=scene,["id"]=it["sceneItemId"],["enabled"]=it["sceneItemEnabled"]};}
   foreach(JObject it in items){if((bool?)it["isGroup"]!=true)continue;string g=(string)it["sourceName"];string graw=CPH.ObsSendRaw("GetGroupSceneItemList","{\"sceneName\":"+JsonConvert.ToString(g)+"}");JArray gi=JObject.Parse(graw)["sceneItems"] as JArray;if(gi==null)continue;
    foreach(JObject x in gi)if(String.Equals((string)x["sourceName"],name,StringComparison.OrdinalIgnoreCase))return new JObject{["scene"]=g,["id"]=x["sceneItemId"],["enabled"]=x["sceneItemEnabled"]};}
  }catch{}return null;}
 // OBS canvas (base) size; 1920 x 1080 when OBS does not answer.
 double[] Canvas(){try{string raw=CPH.ObsSendRaw("GetVideoSettings","{}");JObject v=JObject.Parse(raw);double bw=D(v["baseWidth"]),bh=D(v["baseHeight"]);if(bw>=320&&bh>=180)return new double[]{bw,bh};}catch{}return new double[]{1920,1080};}
 JObject Saved(){string raw=CPH.GetGlobalVar<string>(Store,true);if(String.IsNullOrWhiteSpace(raw))return null;try{return JObject.Parse(raw);}catch{return null;}}
 double D(JToken v){return v==null?0:Convert.ToDouble(v.ToString(),CultureInfo.InvariantCulture);}
 double Num(string k,double d){string v=Read(k);double n;return Double.TryParse(v,NumberStyles.Float,CultureInfo.InvariantCulture,out n)?n:d;}
 string Read(string k){object v;return CPH.TryGetArg<object>(k,out v)&&v!=null?Convert.ToString(v,CultureInfo.InvariantCulture).Trim():"";}
}
