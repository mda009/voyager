/* Voyager winner eligibility rules (2.12; 2.16: recent impromptu winners can enter but can't be drawn). Works out who should be left out of a new giveaway, with the reason,
   from data Voyager already has: past confirmed winners (Giveaway Engine history) and Security reviews.
   The result is added to the giveaway's exclusion list before the pool locks, so the Streamer.bot engine
   (and the fair-draw proof) only ever see eligible entrants. Nothing is changed in Streamer.bot or Security. */
(function(g){'use strict';
const KEY='VoyagerEligibilityV1',DAY=86400000;
const DEFAULTS={recentWin:true,recentDays:30,flagged:true,accountAge:false,accountDays:30};
const FLAGGED=s=>s==='watchlist'||String(s||'').startsWith('confirmed_');
const LABEL={watchlist:'on the Security watchlist',confirmed_bot:'confirmed bot',confirmed_alt:'confirmed alt account',confirmed_abuse:'confirmed abuse',confirmed_compromised:'confirmed compromised account',confirmed_impersonation:'confirmed impersonation'};
const days=(v,d)=>{const n=Math.round(Number(v));return Number.isFinite(n)&&n>=1&&n<=365?n:d;};
function normalize(raw){const r=raw&&typeof raw==='object'?raw:{};return {recentWin:r.recentWin!==false,recentDays:days(r.recentDays,30),flagged:r.flagged!==false,accountAge:r.accountAge===true,accountDays:days(r.accountDays,30)};}
function load(){try{return normalize(JSON.parse(g.localStorage?.getItem(KEY)||'{}'));}catch{return {...DEFAULTS};}}
function save(rules){const n=normalize(rules);try{g.localStorage?.setItem(KEY,JSON.stringify(n));}catch{}return n;}
// giveawayState: the saved Giveaway Engine state (audit = past draws). security: VoyagerSecurityStateV1 or null.
// Returns [{platform, login, id, name, reason, kind}] — kind 'noWin' (may enter an impromptu giveaway, can't be drawn)
// or 'exclude' (left out of the pool). Only impromptu (chat) wins count; Silver, Gold and Platinum giveaways never do.
const impromptu=d=>d?.mode?d.mode==='chat':!(Array.isArray(d?.groups)&&d.groups.length);
function compute(rules,giveawayState,security,now=Date.now()){
  const r=normalize(rules),out=new Map();
  const add=(platform,login,id,name,reason,kind='exclude')=>{const k=platform+':'+(id?'id:'+id:'login:'+login),old=out.get(k);if(!old||old.kind==='noWin'&&kind==='exclude')out.set(k,{platform,login:login||'',id:id||'',name:name||login||id,reason,kind});};
  if(r.recentWin){
    for(const d of Array.isArray(giveawayState?.audit)?giveawayState.audit:[]){
      const at=Number(d?.confirmedAt||d?.at||0);if(d?.status!=='confirmed'||!d.winner||!impromptu(d)||now-at>r.recentDays*DAY)continue;
      const w=d.winner,ago=Math.max(0,Math.floor((now-at)/DAY));
      add(String(w.platform||'twitch').toLowerCase(),String(w.login||'').toLowerCase(),String(w.id||''),w.name,'won an impromptu giveaway '+(ago===0?'today':ago===1?'yesterday':ago+' days ago'),'noWin');
    }
  }
  const users=security&&typeof security.users==='object'?security.users:{};
  for(const [id,row] of Object.entries(users)){
    if(!row||typeof row!=='object')continue;const login=String(row.login||'').toLowerCase(),name=row.name||login;
    if(r.flagged&&FLAGGED(row.review?.status))add('twitch',login,id,name,LABEL[row.review.status]||'flagged by Security');
    const created=Number(row.createdAt||0);
    if(r.accountAge&&created>0&&now-created<r.accountDays*DAY){const age=Math.floor((now-created)/DAY);add('twitch',login,id,name,'account '+age+(age===1?' day':' days')+' old');}
  }
  return [...out.values()];
}
// Exclusion text the engine understands: group pools match logins; chat entries also match platform:id:ID.
function exclusions(rows,chat){
  const set=new Set();
  for(const x of rows){
    if(chat){if(x.id)set.add(x.platform+':id:'+x.id);else if(x.login)set.add(x.platform+':'+x.login);}
    else if(x.login)set.add(x.login);
  }
  return [...set];
}
// Splits rows for a giveaway: impromptu giveaways leave out 'exclude' rows and mark 'noWin' rows as entered-but-not-drawable;
// member (Silver/Gold/Platinum) giveaways ignore the recent-winner rule entirely.
function split(rows,chat){return {exclude:rows.filter(x=>x.kind!=='noWin'),noWin:chat?rows.filter(x=>x.kind==='noWin'):[]};}
function merge(manual,extra){
  const parts=String(manual||'').split(/[,\n;]+/).map(s=>s.trim()).filter(Boolean),seen=new Set(parts.map(s=>s.toLowerCase()));
  for(const e of extra)if(!seen.has(e.toLowerCase())){parts.push(e);seen.add(e.toLowerCase());}
  return parts.join(', ');
}
g.VoyagerEligibility={DEFAULTS,normalize,load,save,compute,exclusions,split,merge,FLAGGED};
})(globalThis);
