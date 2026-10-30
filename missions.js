/* Voyager Control > Missions (2.13). Edit weekly missions, see who finished, and pay rewards through the
   Points Ledger's audited preview/apply (the same path as Points > member controls). */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,missions=[],paying=false,points=null;
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
    const t=view.types[m.type]||{},max=m.type==='earnPoints'?10000000:t.max||7;if(t.max===1)m.target=1;
    const goal=el('input');goal.type='number';goal.min='1';goal.max=String(max);goal.value=m.target;goal.disabled=max===1;goal.oninput=()=>{m.target=Number(goal.value);};
    const lg=el('label','','Goal ('+(view.types[m.type]?.unit||'')+')');lg.append(goal);
    const reward=el('input');reward.type='number';reward.min='0';reward.max='1000000';reward.value=m.reward;reward.oninput=()=>{m.reward=Number(reward.value);};
    const lr=el('label','','Reward (points)');lr.append(reward);
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
  const owed=$('owed');owed.textContent='';
  const rows=view.payables.slice().sort((a,b)=>(a.status==='paid')-(b.status==='paid')||b.week-a.week);
  for(const p of rows){
    const li=el('li','cm-owe');li.dataset.status=p.status;
    const who=el('div');who.append(el('b','',p.name),el('span','',p.title+' · '+(p.label||(p.week===view.week.id?'this week':'last week'))));
    li.append(who,el('span','cm-amt','+'+p.reward.toLocaleString()),el('span','cm-st',p.status==='paid'?'Paid':!p.payable?'No points account':p.status==='failed'?'Failed':'Owed'));
    if(p.note)li.title=p.note;owed.append(li);
  }
  if(!rows.length)owed.append(el('li','cm-empty','Nothing owed yet.'));
  const sup=view.support||{},subTypes=missions.some(m=>view.types[m.type]?.support);
  $('sub-status').hidden=!subTypes;
  $('sub-status').textContent=!sup.updatedAt?'Subscriber missions are waiting for data. Install Voyager - Community Tracker, update Voyager - Stream Stats to v6 and keep Voyager running (it reads subs through the Public website publisher).':sup.tracked+' recent subscribers and gifters tracked · last read '+new Date(sup.updatedAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})+'.';
  const due=rows.filter(p=>p.status!=='paid'&&p.payable);
  $('pay-summary').textContent=due.length?due.length+' payments · '+due.reduce((a,p)=>a+p.reward,0).toLocaleString()+' points':'All paid';
  $('pay-all').disabled=paying||!due.length||!points?.transportReady;
}
async function load(){try{view=await api('/api/community');if(!missions.length||!document.querySelector('.cm-missions input:focus'))missions=view.missions.map(({id,title,type,target,reward,platform,enabled})=>({id,title,type,target,reward,platform,enabled}));render();}catch(e){notice(e.message,true);}}
$('show-missions').onclick=async()=>{try{const showing=view?.panel?.visible&&view.panel.config.kind==='missions';const r=await api('/api/community/panel',showing?{visible:false}:{config:{...(view?.panel?.config||{}),kind:'missions'},visible:true});view.panel=r.panel;notice(showing?'Missions panel hidden.':'Missions panel is on stream. Change its size and position in Seasons › Show on stream.');renderShow();}catch(e){notice(e.message,true);}};
function renderShow(){const on=view?.panel?.visible&&view.panel.config.kind==='missions';$('show-missions').textContent=on?'Hide from stream':'Show on stream';}
$('add-mission').onclick=()=>{missions.push({id:'m'+Date.now().toString(36),title:'New mission',type:'earnPoints',target:300,reward:100,enabled:true});render();};
$('save-missions').onclick=async()=>{try{view=await api('/api/community/missions',{missions});missions=view.missions.map(({id,title,type,target,reward,platform,enabled})=>({id,title,type,target,reward,platform,enabled}));notice('Missions saved.');render();}catch(e){notice(e.message,true);}};
$('pay-all').onclick=async()=>{
  const due=view.payables.filter(p=>p.status!=='paid'&&p.payable);if(!due.length)return;
  if(!confirm('Pay '+due.length+' mission rewards ('+due.reduce((a,p)=>a+p.reward,0).toLocaleString()+' points)?'))return;
  paying=true;render();let ok=0,bad=0;
  for(const p of due){
    const reason=(p.scope==='season'?p.title+' ('+p.label+')':'Mission: '+p.title+' (week of '+new Date(p.week).toLocaleDateString()+')').slice(0,200);
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
if(!hosted){$('not-hosted').hidden=false;}else{load();setInterval(()=>{if(!paying&&!document.querySelector('.cm-missions :focus'))load();},30000);}
if(window.VoyagerPointsConnection&&new URLSearchParams(location.search).get('demo')!=='1'){
  points=new window.VoyagerPointsConnection(window.VOYAGER_CONFIG||{});
  points.addEventListener('status',e=>{const s=$('points-status'),st=e.detail?.state;s.dataset.state=st==='live'?'ok':st==='error'||st==='offline'?'error':'wait';s.textContent=st==='live'?'Points Ledger connected':'Points Ledger · '+(e.detail?.message||st);render();});
  points.connect();
}
})();
