// Voyager YouTube subscriber count (2.41.0): the number a "YouTube subscribers (live count)" community goal follows.
// Streamer.bot has no subscriber-count reading for YouTube, so this PC asks YouTube's own Data API (channels.list,
// 1 quota unit per read, every 5 minutes) with an API key that is stored only in this PC's data folder and is never
// sent to a page. Without a key the streamer can type the number in by hand. YouTube reports the exact number below
// 1,000 subscribers and a rounded one (three significant figures) above it.
import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {join} from 'node:path';

const EVERY_MS=5*60000,RETRY_MS=60000;
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
// A channel is named by its id (UC…, 24 characters), its @handle, or a youtube.com link to either.
export function parseChannel(text){
  const t=clean(text,200);if(!t)return null;
  const id=t.match(/(?:^|\/channel\/)(UC[A-Za-z0-9_-]{22})(?:$|[/?#])/);if(id)return {kind:'id',value:id[1]};
  const h=t.match(/(?:^|youtube\.com\/)@([A-Za-z0-9._-]{3,30})(?:$|[/?#])/i);if(h)return {kind:'handle',value:'@'+h[1]};
  return null;
}

export class YoutubeSubs{
  constructor({dataDir,now=Date.now,fetcher=globalThis.fetch,api=process.env.VOYAGER_YOUTUBE_API||'https://www.googleapis.com/youtube/v3',onReading=()=>{},log=()=>{}}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'youtube-subs.json');this.now=now;this.fetcher=fetcher;this.api=api;this.onReading=onReading;this.log=log;
    this.channel='';this.key='';this.reading=null;this.title='';this.error='';this.triedAt=0;this.busy=false;
  }
  async load(){
    try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.channel=parseChannel(raw.channel)?clean(raw.channel,200):'';this.key=typeof raw.key==='string'?raw.key:'';this.title=clean(raw.title,80);
      if(raw.reading&&Number.isFinite(Number(raw.reading.value)))this.reading={value:Math.max(0,Math.round(Number(raw.reading.value))),at:Number(raw.reading.at)||0,source:raw.reading.source==='manual'?'manual':'youtube'};}catch{}
    return this;
  }
  async persist(){try{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,channel:this.channel,key:this.key,title:this.title,reading:this.reading},null,1));await rename(tmp,this.file);}catch{}}
  // What pages may see: never the key itself.
  view(){return {channel:this.channel,title:this.title,hasKey:Boolean(this.key),automatic:Boolean(this.key&&this.channel),reading:this.reading,error:this.error,triedAt:this.triedAt,everyMinutes:EVERY_MS/60000};}
  configure(input={}){
    if(input.channel!==undefined){const c=clean(input.channel,200);if(c&&!parseChannel(c))throw new Error('Enter the channel\'s @handle (for example @MDA009), its channel ID (starts with UC), or its YouTube link.');if(c!==this.channel){this.channel=c;this.title='';this.triedAt=0;}}
    if(typeof input.apiKey==='string'&&input.apiKey.trim()){const k=input.apiKey.trim();if(!/^AIza[0-9A-Za-z_-]{30,60}$/.test(k))throw new Error('That does not look like a YouTube Data API key (it starts with AIza).');this.key=k;this.triedAt=0;this.error='';}
    if(input.clearKey===true){this.key='';this.error='';}
    if(input.manual!==undefined&&input.manual!==null&&input.manual!==''){const n=Number(input.manual);if(!Number.isSafeInteger(n)||n<0||n>1e9)throw new Error('The subscriber count must be a whole number.');this.set(n,'manual');}
    void this.persist();return this.view();
  }
  set(value,source){this.reading={value,at:this.now(),source};this.onReading({value,at:this.reading.at,source});}
  // Called every few seconds; reads at most every 5 minutes (a failed read is retried after a minute).
  async tick({wanted=true}={}){
    if(this.busy||!wanted||!this.key||!this.channel)return null;const now=this.now();
    if(now-this.triedAt<(this.error?RETRY_MS:EVERY_MS))return null;
    this.busy=true;this.triedAt=now;
    try{
      const c=parseChannel(this.channel),url=this.api+'/channels?part=statistics,snippet&'+(c.kind==='id'?'id=':'forHandle=')+encodeURIComponent(c.value);
      // The key travels in a header, not in the address.
      const res=await this.fetcher(url,{headers:{'X-goog-api-key':this.key,Accept:'application/json'},signal:AbortSignal.timeout(15000)});
      const data=await res.json().catch(()=>null);
      if(!res.ok){const why=clean(data?.error?.message,160);throw new Error(res.status===403&&/quota/i.test(why)?'YouTube\'s daily quota for this key is used up; it resets at midnight Pacific time.':res.status===400||res.status===403?'YouTube refused the API key'+(why?': '+why:'.'):'YouTube answered '+res.status+(why?': '+why:'.'));}
      const item=data?.items?.[0];if(!item)throw new Error('YouTube found no channel called '+c.value+'.');
      if(item.statistics?.hiddenSubscriberCount)throw new Error('This channel hides its subscriber count. Show it in YouTube Studio › Settings › Channel › Advanced settings, or type the number in by hand.');
      const n=Number(item.statistics?.subscriberCount);if(!Number.isFinite(n)||n<0)throw new Error('YouTube did not send a subscriber count.');
      this.title=clean(item.snippet?.title,80);this.error='';this.set(Math.round(n),'youtube');await this.persist();return this.reading;
    }catch(e){this.error=/abort|timeout/i.test(e?.name+' '+e?.message)?'YouTube did not answer in time.':clean(e?.message,240)||'Could not read YouTube.';this.log(this.error);return null;}
    finally{this.busy=false;}
  }
}
