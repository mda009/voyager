/* Voyager Control > Missions (2.13). Edit weekly missions, see who finished, and pay rewards through the
   Points Ledger's audited preview/apply (the same path as Points > member controls). */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,missions=[],paying=false,points=null,medalNames={};
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const when=t=>new Date(t).toLocaleString(undefined,{weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'});
function render(){
  if(!view)return;
  renderShow();
  $('week-note').textContent='This week ends '+when(view.week.endsAt)+' · '+view.members+' members tracked';
  const box=$('missions');box.textContent='';
  missions.forEach((m,i)=>{
    const live=view.missions.find(x=>x.id===m.id);
    const card=el('article','card cm-mission'+(m.enabled?'':' off'));
    const head=el('div','cm-mhead');
    const title=el('input','cm-title');title.value=m.title;title.maxLength=40;title.setAttribute('aria-label','Mission name');title.oninput=()=>{m.title=title.value;};
    const on=el('label','cm-on');const cb=el('input');cb.type='checkbox';cb.checked=m.enabled;cb.onchange=()=>{m.enabled=cb.checked;render();};on.append(cb,' On');
    const del=el('button','link','Remove');del.type='button';del.onclick=()=>{missions.splice(i,1);render();};
    head.append(title,on,del);card.append(head);
    const row=el('div','cm-fields');
    const type=el('select');for(const [k,t] of Object.entries(view.types)){const o=el('option','',t.label);o.value=k;o.selected=k===m.type;type.append(o);}type.onchange=()=>{m.type=type.value;render();};
    const lt=el('label','','What to do');lt.append(type);
    const mid=view.missionMedals?.[m.type];if(mid){const tag=el('span','cm-medal','⬢ Works toward '+(medalNames[mid]||mid));tag.title='Progress this week counts toward the '+(medalNames[mid]||mid)+' medal too.';lt.append(tag);}
    const t=view.types[m.type]||{},max=m.type==='earnPoints'?10000000:t.max||7;if(t.max===1)m.target=1;
    const goal=el('input');goal.type='number';goal.min='1';goal.max=String(max);goal.value=m.target;goal.disabled=max===1;goal.oninput=()=>{m.target=Number(goal.value);};
    const lg=el('label','','Goal ('+(view.types[m.type]?.unit||'')+')');lg.append(goal);
    const reward=el('input');reward.type='number';reward.min='0';reward.max=String(view.rewardMax||50);reward.value=m.reward;reward.oninput=()=>{m.reward=Math.min(view.rewardMax||50,Number(reward.value));};reward.onchange=()=>{reward.value=m.reward;};
    const lr=el('label','','Reward (max '+(view.rewardMax||50)+' points)');lr.append(reward);
    const plat=el('select');for(const [k,label] of Object.entries(view.platforms||{all:'All platforms'})){const o=el('option','',label);o.value=k;o.selected=k===(m.platform||'all');plat.append(o);}plat.onchange=()=>{m.platform=plat.value;};
    const lp=el('label','','Platform');lp.append(plat);
    row.append(lt,lg,lr,lp);card.append(row);
    if(t.support)card.append(el('p','st-hint cm-sub-hint',m.type==='subscribe'?'Counts a new sub, a renewal (resub / membership milestone) or a gifted sub received this week.':m.type==='giftSubs'?'Counts subs or memberships gifted this week. Anonymous gifts can\'t be credited.':'Counts anyone who renews this week with at least this many months.'));
    if(live){
      const stat=el('div','cm-stat');stat.append(el('b','',String(live.completed)),' finished · '+live.started+' started');card.append(stat);
      const ul=el('ul','cm-progress');
      for(const p of live.top.slice(0,5)){const li=el('li');const bar=el('span','cm-bar');const fill=el('i');fill.style.width=Math.round(p.progress/live.target*100)+'%';bar.append(fill);li.append(el('span','cm-name',p.name),bar,el('span','cm-num',p.done?'✓':p.progress+' / '+live.target));ul.append(li);}
      if(!live.top.length)ul.append(el('li','cm-empty','Nobody has started yet this week.'));
      card.append(ul);
    }else card.append(el('p','st-hint','Save to start tracking this mission.'));
    box.append(card);
  });
  $('add-mission').disabled=missions.length>=8;
  renderIdeas();
  const owed=$('owed');owed.textContent='';
  const rows=view.payables.slice().sort((a,b)=>(a.status==='paid')-(b.status==='paid')||b.week-a.week);
  for(const p of rows){
    const li=el('li','cm-owe');li.dataset.status=p.status;
    const who=el('div');who.append(el('b','',p.name),el('span','',p.title+' · '+(p.label||(p.week===view.week.id?'this week':'last week'))));
    li.append(who,el('span','cm-amt','+'+p.reward.toLocaleString()),el('span','cm-st',p.status==='paid'?'Paid':p.status==='accruing'?'Accruing · paid when the run ends':!p.payable?'No points account':p.status==='failed'?'Failed':'Owed'));
    if(p.note)li.title=p.note;owed.append(li);
  }
  if(!rows.length)owed.append(el('li','cm-empty','Nothing owed yet.'));
  const sup=view.support||{},subTypes=missions.some(m=>view.types[m.type]?.support);
  $('sub-status').hidden=!subTypes;
  $('sub-status').textContent=!sup.updatedAt?'Subscriber missions are waiting for data. Install Voyager - Community Tracker, update Voyager - Stream Stats to v6 and keep Voyager running (it reads subs through the Public website publisher).':sup.tracked+' recent subscribers and gifters tracked · last read '+new Date(sup.updatedAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})+'.';
  const due=rows.filter(p=>p.status!=='paid'&&p.payable);
  $('pay-summary').textContent=due.length?due.length+' payments · '+due.reduce((a,p)=>a+p.reward,0).toLocaleString()+' points':'All paid';
  $('pay-all').disabled=paying||!due.length||!points?.transportReady;
  // 2.21.12 auto-pay status
  const ap=view.autoPay,cb=$('autopay'),pill=$('autopay-pill');if(ap&&cb){if(document.activeElement!==cb)cb.checked=!!ap.enabled;
    const ago=at=>at?Math.max(0,Math.round((Date.now()-at)/60000))+' min ago':'';
    if(!ap.enabled){pill.dataset.state='';pill.textContent='Off · pay by hand';}
    else if(ap.busy){pill.dataset.state='wait';pill.textContent='Paying…';}
    else if(ap.last?.failed){pill.dataset.state='warn';pill.textContent=ap.last.failed+' failed '+ago(ap.last.at)+(ap.last.message?' · '+ap.last.message.slice(0,80):'');}
    else if(ap.pending){pill.dataset.state='wait';pill.textContent=ap.pending+' waiting · pays when Streamer.bot is connected';}
    else{pill.dataset.state='ok';pill.textContent='On · '+(ap.last?.at?'last paid '+ago(ap.last.at):'nothing owed');}}
}
async function load(){try{view=await api('/api/community');if(!missions.length||!document.querySelector('.cm-missions input:focus'))missions=view.missions.map(({id,title,type,target,reward,platform,enabled})=>({id,title,type,target,reward,platform,enabled}));render();}catch(e){notice(e.message,true);}}
$('show-missions').onclick=async()=>{try{const showing=view?.panel?.visible&&view.panel.config.kind==='missions';const r=await api('/api/community/panel',showing?{visible:false}:{config:{...(view?.panel?.config||{}),kind:'missions'},visible:true});view.panel=r.panel;notice(showing?'Missions panel hidden.':'Missions panel is on stream. Change its size and position in Seasons › Show on stream.');renderShow();}catch(e){notice(e.message,true);}};
function renderShow(){const on=view?.panel?.visible&&view.panel.config.kind==='missions';$('show-missions').textContent=on?'Hide from stream':'Show on stream';}
$('add-mission').onclick=()=>{missions.push({id:'m'+Date.now().toString(36),title:'New mission',type:'earnPoints',target:300,reward:25,enabled:true});render();};
// 2.20.21: mission ideas, each tied to a medal. Add one, then Save missions.
function renderIdeas(){
  const box=$('ideas');if(!box||!view?.ideas)return;box.textContent='';
  for(const idea of view.ideas){
    const have=missions.some(m=>m.id===idea.id),card=el('div','cm-idea');
    const mid=view.missionMedals?.[idea.type];
    card.append(el('b','',idea.title),el('span','cm-idea-what',idea.blurb),el('span','cm-medal','⬢ '+(medalNames[mid]||mid||'')+' · +'+idea.reward+' pts'));
    const b=el('button','',have?'Added':'+ Add');b.type='button';b.disabled=have||missions.length>=8;
    b.onclick=()=>{missions.push({id:idea.id,title:idea.title,type:idea.type,target:idea.target,reward:idea.reward,platform:'all',enabled:true});render();notice(idea.title+' added. Save missions to start it (up to 8 missions).');};
    card.append(b);box.append(card);
  }
}
(async()=>{try{if(!hosted)return;const r=await fetch('/api/admin');token=token||(await r.json()).token;const m=await(await fetch('/api/medals',{headers:{'X-Voyager-Token':token}})).json();medalNames=Object.fromEntries((m.catalogue||[]).map(x=>[x.id,x.name]));if(view)render();}catch{}})();
$('save-missions').onclick=async()=>{try{view=await api('/api/community/missions',{missions});missions=view.missions.map(({id,title,type,target,reward,platform,enabled})=>({id,title,type,target,reward,platform,enabled}));notice('Missions saved.');render();}catch(e){notice(e.message,true);}};
$('autopay').onchange=async()=>{try{const r=await api('/api/community/autopay',{enabled:$('autopay').checked});view.autoPay=r.autoPay;render();notice($('autopay').checked?'Auto-pay on: owed points are paid as they come.':'Auto-pay off: use Pay all owed now.');}catch(e){notice(e.message,true);}};
$('pay-all').onclick=async()=>{
  const due=view.payables.filter(p=>p.status!=='paid'&&p.payable);if(!due.length)return;
  if(!confirm('Pay '+due.length+' mission rewards ('+due.reduce((a,p)=>a+p.reward,0).toLocaleString()+' points)?'))return;
  paying=true;render();let ok=0,bad=0;
  for(const p of due){
    const reason=(p.scope==='boss'?'Voyager Dreadnought: '+p.title+' ('+new Date(p.week).toLocaleDateString()+')':p.scope==='season'?p.title+' ('+p.label+')':p.scope==='surge'?p.title+' ('+p.label+')':'Mission: '+p.title+' (week of '+new Date(p.week).toLocaleDateString()+')').slice(0,200);
    try{
      const plan=await points.call('admin_preview',{adminTask:'points',adminUserKey:p.key,adminTwitchLogin:'',adminDelta:String(p.reward),adminReason:reason});
      if(!plan?.planId)throw new Error(plan?.error||'No preview returned.');
      const result=await points.call('admin_apply',{adminPlanId:plan.planId,adminConfirm:'APPLY',adminClearConfirm:''});
      if(result?.ok===false)throw new Error(result.error||'Not applied.');
      await api('/api/community/payout',{week:p.week,missionId:p.missionId,key:p.key,status:'paid',note:reason});ok++;
    }catch(e){bad++;await api('/api/community/payout',{week:p.week,missionId:p.missionId,key:p.key,status:'failed',note:e.message}).catch(()=>{});}
    notice('Paying… '+(ok+bad)+' of '+due.length);
  }
  paying=false;notice(bad?ok+' paid, '+bad+' failed. Hover a failed row to see why, then try again.':'All '+ok+' rewards paid. They show in Points history.',bad>0);await load();
};
// 2.16.1: subscriber rewards follow the Currency System's own sub and gift points (read from Points history).
const GIFT_EVENTS=['TwitchGiftSub','KickGiftSubscription','YouTubeMembershipGift'],SUB_EVENTS=['TwitchSub','TwitchReSub','KickSubscription','KickResubscription','YouTubeNewSponsor','YouTubeMemberMileStone'];
const ALIGN_DEFAULTS={supporter:250,gifter:250,veteran:125,crew:250,'gift-fleet':200};let detected=null,alignEdited=false,autoTried=false;
const mode=list=>{const c=new Map();for(const v of list)c.set(v,(c.get(v)||0)+1);return [...c.entries()].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0]?.[0]??null;};
async function readAllocation(){
  const found={gift:[],sub:[]};
  for(const [kind,events] of [['gift',GIFT_EVENTS],['sub',SUB_EVENTS]])for(const ev of events){
    try{const r=await points.call('history',{pointsQuery:ev,pointsKind:'all',pointsPlatform:'all',pointsLimit:'300'});
      for(const e of r?.entries||[])if(e.actionLabel==='StreamUP / '+ev&&Number(e.delta)>0)found[kind].push(Number(e.delta));}catch{}
  }
  return {gift:mode(found.gift),sub:mode(found.sub),giftCount:found.gift.length,subCount:found.sub.length};
}
function renderAlign(){
  const st=$('align-state');if(!detected){st.dataset.state='wait';st.textContent=points?.transportReady?'Reading points history…':'Waiting for Points Ledger';return;}
  const parts=[];if(detected.gift!==null)parts.push(detected.gift.toLocaleString()+' per gift ('+detected.giftCount+' seen)');if(detected.sub!==null)parts.push(detected.sub.toLocaleString()+' per sub ('+detected.subCount+' seen)');
  st.dataset.state=parts.length?'ok':'wait';st.textContent=parts.length?'Found: '+parts.join(' · '):'No sub or gift events in Points history yet';
  if(!alignEdited){if(detected.gift!==null)$('align-gift').value=detected.gift;if(detected.sub!==null)$('align-sub').value=detected.sub;}
}
for(const id of ['align-gift','align-sub'])$(id).addEventListener('input',()=>{alignEdited=true;});
async function applyAlign(gift,sub,auto){
  const G=Number.isInteger(gift)&&gift>=0?gift:sub,S=Number.isInteger(sub)&&sub>=0?sub:gift;if(!Number.isInteger(G)||!Number.isInteger(S))throw new Error('Enter the points per gifted sub (and per sub if different).');
  const cap=v=>Math.min(view?.rewardMax||50,v);// missions are capped at 50 points (2.20.21); season goals keep the full payout
  const next=missions.map(m=>m.type==='subscribe'?{...m,reward:cap(S)}:m.type==='giftSubs'?{...m,reward:cap(G)}:m.type==='loyalSub'?{...m,reward:cap(Math.round(S/2))}:m);
  view=await api('/api/community/missions',{missions:next});missions=view.missions.map(({id,title,type,target,reward,platform,enabled})=>({id,title,type,target,reward,platform,enabled}));
  // 2.20.48: community goals keep the rewards you set on the Community goals page; only the supporter bonus follows.
  view=await api('/api/community/season',{supportBonus:G});
  $('align-note').textContent=(auto?'Matched automatically: ':'Saved: ')+'Crew Supporter '+cap(S)+', Fleet Gifter '+cap(G)+', Veteran Crew '+cap(Math.round(S/2))+' (missions max '+(view?.rewardMax||50)+'), supporter bonus '+G+'.';
  render();
}
$('align-apply').onclick=async()=>{try{await applyAlign(parseInt($('align-gift').value,10),parseInt($('align-sub').value,10),false);notice('Subscriber rewards now match your Currency System.');}catch(e){notice(e.message,true);}};
async function detectAllocation(){
  if(autoTried||!points?.transportReady||!view)return;autoTried=true;
  detected=await readAllocation();renderAlign();
  if(detected.gift===null&&detected.sub===null)return;
  // Untouched defaults are matched automatically once; anything you edited yourself is left for the button.
  const untouched=missions.filter(m=>ALIGN_DEFAULTS[m.id]!==undefined).every(m=>m.reward===ALIGN_DEFAULTS[m.id])&&(view.goals||[]).filter(g=>ALIGN_DEFAULTS[g.id]!==undefined).every(g=>g.reward===ALIGN_DEFAULTS[g.id]);
  if(untouched)try{await applyAlign(detected.gift,detected.sub,true);notice('Subscriber rewards were matched to your Currency System ('+(detected.gift??detected.sub)+' per gift).');}catch(e){notice(e.message,true);}
}
setInterval(()=>{if(!autoTried)detectAllocation();},3000);
if(!hosted){$('not-hosted').hidden=false;}else{load();setInterval(()=>{if(!paying&&!document.querySelector('.cm-missions :focus'))load();},30000);}
if(window.VoyagerPointsConnection&&new URLSearchParams(location.search).get('demo')!=='1'){
  points=new window.VoyagerPointsConnection(window.VOYAGER_CONFIG||{});
  points.addEventListener('status',e=>{const s=$('points-status'),st=e.detail?.state;s.dataset.state=st==='live'?'ok':st==='error'||st==='offline'?'error':'wait';s.textContent=st==='live'?'Points Ledger connected':'Points Ledger · '+(e.detail?.message||st);render();if(st==='live')detectAllocation();else renderAlign();});
  points.connect();
}
})();
