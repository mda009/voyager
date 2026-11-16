import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {TicketGranter,grantRow} from '../local/tickets.mjs';

async function make(state,{grantError='',reply=true}={}){const dir=await mkdtemp(join(tmpdir(),'voyager-tix-'));let now=1e12,n=0;const calls=[];
  const g=new TicketGranter({dataDir:dir,now:()=>now,uuid:()=>'req-'+(++n)});
  g.run=async args=>{calls.push(args);if(!reply)return {ok:true};queueMicrotask(()=>{
    if(args.ticketOperation==='sync')g.resolve({type:'voyager.tickets.v1',ok:true,requestId:args.requestId,state:state()});
    else g.resolve({type:'voyager.tickets.v1',ok:!grantError,error:grantError,requestId:args.requestId,state:{...state(),lastGrant:{tickets:JSON.parse(args.ticketGrants).reduce((a,r)=>a+r.tickets,0),accounts:JSON.parse(args.ticketGrants).length,skipped:0}}});});return {ok:true};};
  return {g,calls,at:ms=>{now+=ms;},now:()=>now};}
const open=()=>({controlRevision:7,campaign:{id:'camp-1',title:'Grand draw',status:'open',platforms:['twitch','youtube'],draws:[]}});
const pilots=[{key:'twitch:111',name:'Ace',tickets:10},{key:'youtube:UCabc',name:'Nova',tickets:20},{key:'kick:9',name:'Kix',tickets:10},{key:'twitch:@loginonly',name:'NoId',tickets:10},{key:'twitch:222',name:'Zero',tickets:0}];

test('a grant syncs, then asks the action to add tickets to the accounts on enabled platforms',async()=>{
  assert.deepEqual(grantRow(pilots[0]),{platform:'twitch',id:'111',login:'',name:'Ace',tickets:10});assert.equal(grantRow(pilots[3]),null);assert.equal(grantRow(pilots[4]),null);
  const {g,calls}=await make(open);const job=g.grant({id:'boss-1',reason:'Dreadnought victory',grants:pilots});assert.equal(job.rows.length,3);assert.equal(job.noId,1);
  assert.equal(await g.tick({connected:false}),null,'waits for Streamer.bot');await g.tick({connected:true});
  assert.deepEqual(calls.map(c=>c.ticketOperation),['sync','grant']);const sent=calls[1];assert.equal(sent.ticketCampaignId,'camp-1');assert.equal(sent.ticketControlRevision,'7');assert.equal(sent.ticketReason,'Dreadnought victory');
  assert.deepEqual(JSON.parse(sent.ticketGrants).map(r=>[r.platform,r.id,r.tickets]),[['twitch','111',10],['youtube','UCabc',20]],'Kick is not enabled for this giveaway');
  const h=g.view().history[0];assert.equal(h.status,'granted');assert.match(h.message,/30 tickets to 2 accounts in "Grand draw" \(1 without an account id\)/);assert.equal(g.view().waiting.length,0);
  g.grant({id:'boss-1',reason:'again',grants:pilots});assert.equal(g.view().waiting.length,0,'one grant per battle');
});

test('no ticketed giveaway, or one already drawn: nothing is granted and the reason is kept',async()=>{
  let a=await make(()=>({controlRevision:1,campaign:null}));a.g.grant({id:'b1',reason:'r',grants:pilots});await a.g.tick({connected:true});assert.equal(a.g.view().history[0].status,'skipped');assert.match(a.g.view().history[0].message,/No ticketed giveaway is running/);assert.equal(a.calls.length,1);
  a=await make(()=>({controlRevision:1,campaign:{id:'c',title:'Old',status:'completed',platforms:['twitch'],draws:[{}]}}));a.g.grant({id:'b2',reason:'r',grants:pilots});await a.g.tick({connected:true});assert.match(a.g.view().history[0].message,/already been drawn/);
  a=await make(open);const j=a.g.grant({id:'b3',reason:'r',grants:[pilots[3]]});assert.equal(j.status,'skipped');assert.match(j.message,/account id/);
});

test('refused grants fail with the action\'s reason; an unreachable Streamer.bot is retried, then given up after 30 minutes',async()=>{
  let a=await make(open,{grantError:'Giveaway ticket capacity reached.'});a.g.grant({id:'b1',reason:'r',grants:pilots});await a.g.tick({connected:true});assert.equal(a.g.view().history[0].status,'failed');assert.match(a.g.view().history[0].message,/capacity/);
  a=await make(open);a.g.run=async()=>({ok:false,message:'Voyager is not connected to Streamer.bot'});a.g.grant({id:'b2',reason:'r',grants:pilots});await a.g.tick({connected:true});
  assert.equal(a.g.view().waiting.length,1,'kept for a retry');assert.equal(await a.g.tick({connected:true}),null,'not again inside a minute');a.at(61000);await a.g.tick({connected:true});assert.equal(a.g.view().waiting.length,1);
  a.at(31*60000);await a.g.tick({connected:true});assert.equal(a.g.view().history[0].status,'failed');assert.match(a.g.view().history[0].message,/Gave up after 30 minutes/);
});
