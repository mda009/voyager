// Public website publisher. Builds the public feed from allow-listed data and uploads it
// to a GitHub repository branch that the public site reads. The token never leaves this PC
// except to api.github.com, and is never sent back to any page.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';

const FILE='public-site.json',FEED='public-feed.json',PROOFS='public-proofs.json',MAX_PROOFS=20;
export const BRANCH='public-data';
const MIN_UPLOAD_MS=60000,KEEPALIVE_MS=300000,COLLECT_STALE_MS=120000;

export class PublicSite{
  constructor({dataDir,model,fetchImpl=globalThis.fetch,apiBase=process.env.VOYAGER_GITHUB_API||'https://api.github.com',now=Date.now}){
    Object.assign(this,{dataDir,model,fetchImpl,apiBase,now});
    this.settings=model.normalizeSettings({});this.token='';this.winners=[];this.proofs={};
    this.collected=null;this.collectedAt=0;this.feed=null;this.feedJson='';
    this.upload={lastAt:0,lastJson:'',lastError:'',busy:false,nextAt:0,failures:0,lastOkAt:0};
    this.saving=Promise.resolve();
  }
  async load(){
    try{
      const raw=JSON.parse(await readFile(join(this.dataDir,FILE),'utf8'));
      this.settings=this.model.normalizeSettings(raw.settings);
      this.token=typeof raw.token==='string'?raw.token:'';
      this.winners=Array.isArray(raw.winners)?raw.winners.slice(0,this.model.LIMITS.winners):[];
    }catch{}
    try{const raw=JSON.parse(await readFile(join(this.dataDir,PROOFS),'utf8'));for(const [id,p] of Object.entries(raw&&typeof raw==='object'?raw:{})){const clean=/^[a-z0-9]{1,16}$/i.test(id)&&this.model.sanitizeProof(p);if(clean)this.proofs[id]={...clean,title:String(p.title||'').slice(0,120)};}}catch{}
    return this;
  }
  persist(){
    const data=JSON.stringify({schema:1,settings:this.settings,token:this.token,winners:this.winners},null,2);
    this.saving=this.saving.then(async()=>{const tmp=join(this.dataDir,FILE+'.tmp');await writeFile(tmp,data);await rename(tmp,join(this.dataDir,FILE));}).catch(()=>{});
    return this.saving;
  }
  // What pages may see: settings and status, never the token itself.
  view(){
    const u=this.upload,s=this.settings;
    const site=s.publish.siteUrl||(s.publish.repo?pagesUrl(s.publish.repo):'');
    return {settings:s,hasToken:Boolean(this.token),siteUrl:site,
      feedUrl:s.publish.repo?`https://raw.githubusercontent.com/${s.publish.repo}/${BRANCH}/feed.json`:'',
      collector:{connected:this.now()-this.collectedAt<COLLECT_STALE_MS,lastAt:this.collectedAt,sources:this.collected?.sources||null},
      upload:{enabled:s.publish.enabled&&Boolean(s.publish.repo&&this.token),lastAt:u.lastAt,lastOkAt:u.lastOkAt,lastError:u.lastError,busy:u.busy}};
  }
  async configure(input){
    if(!input||typeof input!=='object')throw new Error('Settings are missing.');
    const next=this.model.normalizeSettings(input.settings??this.settings);
    if(input.settings?.publish?.repo&&!next.publish.repo)throw new Error('Enter the GitHub repository as owner/name, for example mda009/voyager.');
    if(typeof input.token==='string'&&input.token.trim()){
      const t=input.token.trim();
      if(!/^(github_pat_|ghp_)[A-Za-z0-9_]{20,255}$/.test(t))throw new Error('That does not look like a GitHub token. Create a fine-grained token (it starts with github_pat_).');
      this.token=t;
    }
    if(input.clearToken===true)this.token='';
    this.settings=next;this.upload.lastError='';this.upload.failures=0;this.upload.nextAt=0;
    await this.persist();this.rebuild();return this.view();
  }
  // Fair-draw proofs: the latest version of each giveaway's proof, newest 20 kept.
  storeProofs(giveaways){
    let changed=false;
    for(const g of giveaways){
      if(!g.proof)continue;const next={...g.proof,title:g.title};
      if(JSON.stringify(this.proofs[g.id])!==JSON.stringify(next)){this.proofs[g.id]=next;changed=true;}
    }
    const ids=Object.keys(this.proofs).sort((a,b)=>(this.proofs[b].committedAt||0)-(this.proofs[a].committedAt||0));
    for(const id of ids.slice(MAX_PROOFS)){delete this.proofs[id];changed=true;}
    if(changed){const data=JSON.stringify(this.proofs),tmp=join(this.dataDir,PROOFS+'.tmp');this.saving=this.saving.then(async()=>{await writeFile(tmp,data);await rename(tmp,join(this.dataDir,PROOFS));}).catch(()=>{});}
    return changed;
  }
  proofFiles(){return Object.entries(this.proofs).map(([id,p])=>({path:'proofs/'+id+'.json',content:JSON.stringify(this.model.publicProof(p,this.settings))}));}
  proof(id){const p=this.proofs[id];return p?this.model.publicProof(p,this.settings):null;}
  receive(raw){
    this.collected=this.model.sanitizeCollected(raw);this.collectedAt=this.now();
    if(this.storeProofs(this.collected.giveaways))this.proofsChangedAt=this.now();
    const before=this.winners.length&&this.winners[0].key;
    this.winners=this.model.mergeWinners(this.winners,this.collected.giveaways,this.now());
    if((this.winners[0]&&this.winners[0].key)!==before)this.persist();
    this.rebuild();return {ok:true,feed:this.feed};
  }
  setVersus(fn){this.versusSource=fn;}
  setCommunity(fn){this.communitySource=fn;}
  rebuild(online=true){
    const v=this.versusSource?.()||{};
    const live=online&&this.now()-this.collectedAt<COLLECT_STALE_MS;
    this.feed=this.model.buildFeed({collected:this.collected||{},settings:this.settings,pilots:v.pilots||[],versus:v.versus||null,winners:this.winners,online:live,now:this.now(),proofIds:new Set(Object.keys(this.proofs)),community:this.communitySource?.()||null});
    const comparable=JSON.stringify({...this.feed,generatedAt:0,proofs:this.proofsChangedAt||0});
    this.feedJson=JSON.stringify(this.feed);this.rebuiltAt=this.now();
    if(comparable!==this.comparable||this.now()-(this.writtenAt||0)>=60000){
      if(comparable!==this.comparable){this.comparable=comparable;this.changedAt=this.now();}
      this.writtenAt=this.now();const json=this.feedJson,tmp=join(this.dataDir,FEED+'.tmp');
      this.saving=this.saving.then(async()=>{await writeFile(tmp,json);await rename(tmp,join(this.dataDir,FEED));}).catch(()=>{});
    }
    return this.feed;
  }
  // Called about once a second by the host.
  async tick(){
    const u=this.upload,s=this.settings,now=this.now();
    if(now-(this.rebuiltAt||0)>=10000)this.rebuild();
    if(!s.publish.enabled||!s.publish.repo||!this.token||u.busy||now<u.nextAt)return;
    const changed=this.changedAt>u.lastAt;
    if(!(changed&&now-u.lastAt>=MIN_UPLOAD_MS)&&now-u.lastAt<KEEPALIVE_MS)return;
    await this.push();
  }
  async push(timeoutMs=20000){
    const u=this.upload;u.busy=true;
    try{
      await uploadFeed({fetchImpl:this.fetchImpl,apiBase:this.apiBase,repo:this.settings.publish.repo,token:this.token,content:JSON.stringify(this.feed,null,1),files:this.proofFiles(),timeoutMs});
      u.lastAt=u.lastOkAt=this.now();u.lastError='';u.failures=0;u.nextAt=0;
    }catch(e){
      u.lastAt=this.now();u.failures++;u.lastError=e.message;
      u.nextAt=this.now()+Math.min(900000,60000*2**Math.min(4,u.failures-1));
    }finally{u.busy=false;}
  }
  // On shutdown: publish once more marked offline, so the site says the stream tools are off.
  async goOffline(){
    if(!this.settings.publish.enabled||!this.settings.publish.repo||!this.token||!this.feed)return;
    this.rebuild(false);await this.push(4000).catch(()=>{});
  }
}

export function pagesUrl(repo){
  const [owner,name]=repo.split('/');const host=owner.toLowerCase()+'.github.io';
  return name.toLowerCase()===host?`https://${host}/`:`https://${host}/${name}/`;
}

// Replaces the public-data branch with a single commit holding feed.json (and fair-draw proofs), so the branch never grows.
export async function uploadFeed({fetchImpl,apiBase,repo,token,content,files=[],timeoutMs=20000}){
  const call=async(method,path,body)=>{
    const r=await fetchImpl(apiBase+'/repos/'+repo+path,{method,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Voyager-Public-Site','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(timeoutMs)});
    if(!r.ok){const e=new Error(explain(r.status));e.status=r.status;throw e;}
    return r.json();
  };
  const tree=await call('POST','/git/trees',{tree:[{path:'feed.json',mode:'100644',type:'blob',content},...files.filter(f=>/^proofs\/[a-z0-9]{1,16}\.json$/i.test(f.path)).map(f=>({path:f.path,mode:'100644',type:'blob',content:f.content}))]});
  const commit=await call('POST','/git/commits',{message:'Update Voyager public feed',tree:tree.sha,parents:[]});
  try{await call('PATCH','/git/refs/heads/'+BRANCH,{sha:commit.sha,force:true});}
  catch(e){if(e.status!==404&&e.status!==422)throw e;await call('POST','/git/refs',{ref:'refs/heads/'+BRANCH,sha:commit.sha});}
  return commit.sha;
}
function explain(status){
  if(status===401)return 'GitHub rejected the token. It may have expired; create a new one and paste it in Publishing.';
  if(status===403||status===404)return 'The token cannot write to that repository. Check the repository name, and that the token has Contents: Read and write for it.';
  if(status===409)return 'The repository is empty. Upload the Voyager project to it first (see PUBLISHING.md).';
  if(status===429)return 'GitHub is limiting requests. Voyager will retry automatically.';
  return 'GitHub returned an error ('+status+'). Voyager will retry automatically.';
}
