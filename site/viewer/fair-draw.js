/* Voyager fair-draw verifier (v1). Runs in the viewer's browser with Web Crypto; nothing is sent anywhere.
   It repeats exactly what the Streamer.bot Giveaway Engine did:
   - the commitment s0 was published when the entrant list locked; draw n used seed s(n), and SHA-256 applied n times to s(n) gives s0;
   - the entrant list fingerprint is SHA-256 of "platform<TAB>name" lines joined with newlines, in pool order;
   - draw n's position = HMAC-SHA256(key = s(n), "voyager-draw-v1:" + c) for c = 0, 1, …, first 4 bytes big-endian,
     rejected while >= 2^32 - 2^32 % count, then value % count, counted over the entrants not yet drawn. */
(function(g){'use strict';
const subtle=()=>{const s=g.crypto&&g.crypto.subtle;if(!s)throw new Error('This browser cannot run the check (Web Crypto is unavailable).');return s;};
const hexToBytes=h=>{if(!/^[0-9a-f]{64}$/.test(h||''))throw new Error('Not a 64-character seed.');const b=new Uint8Array(32);for(let i=0;i<32;i++)b[i]=parseInt(h.slice(i*2,i*2+2),16);return b;};
const toHex=buf=>[...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,'0')).join('');
async function sha256(bytes){return new Uint8Array(await subtle().digest('SHA-256',bytes));}
async function sha256Hex(bytes){return toHex(await sha256(bytes));}
async function chainLeadsTo(seedHex,n,commitment){let b=hexToBytes(seedHex);for(let i=0;i<n;i++)b=await sha256(b);return toHex(b)===commitment;}
async function poolHash(entrants){return sha256Hex(new TextEncoder().encode(entrants.map(([p,n])=>p+'\t'+n).join('\n')));}
async function proofIndex(seedHex,count){
  if(!Number.isInteger(count)||count<1)throw new Error('Nobody was left to draw.');
  const key=await subtle().importKey('raw',hexToBytes(seedHex),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const limit=2**32-(2**32%count);
  for(let c=0;c<4096;c++){
    const d=new DataView(await subtle().sign('HMAC',key,new TextEncoder().encode('voyager-draw-v1:'+c)));
    const v=d.getUint32(0,false);if(v<limit)return v%count;
  }
  throw new Error('Could not derive a position.');
}
// Checks a published proof. Returns a list of {ok, text} steps and the recomputed winners.
async function verify(proof){
  const steps=[],add=(ok,text)=>steps.push({ok,text});
  if(!proof||proof.version!==1)return {steps:[{ok:false,text:'This proof format is not supported.'}],ok:false};
  const entrants=Array.isArray(proof.entrants)?proof.entrants:null;
  if(entrants){
    const h=await poolHash(entrants);
    add(h===proof.poolHash&&entrants.length===proof.size,`The ${entrants.length} published entrants match the fingerprint locked before the draw.`);
  }else add(null,`The entrant list (${proof.size} entrants) was too long to publish, so only the seed can be checked here.`);
  const positions=entrants?entrants.map((_,i)=>i):null;
  for(const d of Array.isArray(proof.draws)?proof.draws:[]){
    if(!d.seed){add(null,`Draw ${d.n} has not been revealed yet.`);continue;}
    const chain=await chainLeadsTo(d.seed,d.n,proof.commitment);
    add(chain,`Draw ${d.n}: its seed belongs to the fingerprint published at lock time.`);
    if(positions){
      const idx=await proofIndex(d.seed,positions.length),pos=positions[idx],[,name]=entrants[pos];
      const matches=idx===d.index&&(d.winner==null||d.winner===name);
      add(matches,d.winner?`Draw ${d.n}: the seed picks entry ${pos+1}, ${name}.`:`Draw ${d.n}: the seed picks entry ${pos+1} (this pick was re-drawn, not confirmed).`);
      positions.splice(idx,1);
    }
  }
  return {steps,ok:steps.every(s=>s.ok!==false)};
}
g.VoyagerFairDraw={sha256Hex,poolHash,proofIndex,chainLeadsTo,verify,hexToBytes};
})(globalThis);
