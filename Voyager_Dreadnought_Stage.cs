// Voyager Dreadnought Stage v1.0. One action: Voyager - Dreadnought Stage. No triggers: Voyager runs it (DoAction) when the
// Dreadnought stage comes up and goes down. It moves the OBS scene item that holds your game (a nested scene or a group,
// named on Voyager Control › Voyager Dreadnought › Stage) into the picture-in-picture window with a short animation, and
// moves it back afterwards. The item's original transform is kept in a Streamer.bot global so a restart can still restore it.
// Arguments from Voyager: stagePhase (on|off), stageScene, stageSource, stageX, stageY, stageW, stageH, stageMs.
using System;using System.Globalization;using System.Threading;using Newtonsoft.Json;using Newtonsoft.Json.Linq;
public class CPHInline {
 const string Store="VoyagerDreadnoughtStageV1";static readonly object Gate=new object();
 public bool Execute(){
  string phase=Read("stagePhase"),scene=Read("stageScene"),source=Read("stageSource");
  if(phase!="on"&&phase!="off"){CPH.LogWarn("[Voyager Stage] No stagePhase argument: this action is run by Voyager, it needs no triggers.");return true;}
  if(scene.Length==0||source.Length==0){CPH.LogWarn("[Voyager Stage] Scene or game source not named yet (Voyager Control › Voyager Dreadnought › Stage).");return true;}
  double x=Num("stageX",1252),y=Num("stageY",704),w=Num("stageW",640),h=Num("stageH",360);int ms=(int)Math.Max(200,Math.Min(4000,Num("stageMs",1200)));
  lock(Gate){try{
   long id=ItemId(scene,source);JObject cur=Transform(scene,id);JObject saved=Saved();
   double[] from=Rect(cur);
   if(phase=="on"){
    if(saved==null||(string)saved["scene"]!=scene||(long)saved["id"]!=id){saved=new JObject{["scene"]=scene,["id"]=id,["source"]=source,["t"]=cur,["at"]=DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()};CPH.SetGlobalVar(Store,saved.ToString(Formatting.None),true);}
    else from=Rect(cur);
    Animate(scene,id,from,new double[]{x,y,w,h},ms);
    CPH.LogInfo("[Voyager Stage] '"+source+"' moved to the picture-in-picture window ("+w+"x"+h+" at "+x+","+y+") in "+ms+" ms.");
   }else{
    if(saved==null){CPH.LogInfo("[Voyager Stage] Nothing to restore (the game was never moved).");return true;}
    JObject t=(JObject)saved["t"];double[] to=Rect(t);
    Animate(scene,id,from,to,ms);
    // Exact original transform back (scale or bounds mode, alignment, crop are untouched).
    JObject restore=new JObject{["positionX"]=t["positionX"],["positionY"]=t["positionY"],["scaleX"]=t["scaleX"],["scaleY"]=t["scaleY"],["alignment"]=t["alignment"],["boundsType"]=t["boundsType"],["boundsAlignment"]=t["boundsAlignment"]};
    if((string)t["boundsType"]!="OBS_BOUNDS_NONE"){restore["boundsWidth"]=t["boundsWidth"];restore["boundsHeight"]=t["boundsHeight"];}
    Set(scene,id,restore);CPH.SetGlobalVar(Store,"",true);
    CPH.LogInfo("[Voyager Stage] '"+source+"' restored to its place.");
   }
  }catch(Exception e){CPH.LogWarn("[Voyager Stage] "+e.Message);}}
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
  if(id==null)throw new Exception("'"+source+"' is not directly in the scene '"+scene+"'. Put your game and camera in one nested scene or group inside the live scene and name that here.");return (long)id;}
 JObject Saved(){string raw=CPH.GetGlobalVar<string>(Store,true);if(String.IsNullOrWhiteSpace(raw))return null;try{return JObject.Parse(raw);}catch{return null;}}
 double D(JToken v){return v==null?0:Convert.ToDouble(v.ToString(),CultureInfo.InvariantCulture);}
 double Num(string k,double d){string v=Read(k);double n;return Double.TryParse(v,NumberStyles.Float,CultureInfo.InvariantCulture,out n)?n:d;}
 string Read(string k){object v;return CPH.TryGetArg<object>(k,out v)&&v!=null?Convert.ToString(v,CultureInfo.InvariantCulture).Trim():"";}
}
