(()=>{'use strict';
const tierNames={blue:'Blue Explorer',silver:'Silver Sentinel',gold:'Gold Commander',platinum:'Platinum Vanguard',vip:'Ruby VIP',emerald:'Emerald Elite',none:'No core tier',unknown:'Tier unavailable'};
const rank={none:0,blue:1,silver:2,gold:3,platinum:4};
const num=x=>x===null||x===undefined||typeof x==='boolean'||typeof x==='object'||(typeof x==='string'&&!x.trim())?null:Number.isFinite(Number(x))&&Math.abs(Number(x))>=0&&Math.abs(Number(x))<=Number.MAX_SAFE_INTEGER?Number(x):null;
function members(data,filters={}){return(data?.users||[]).filter(r=>{const q=String(filters.query||'').toLowerCase();return(!q||[r.name,r.login,r.id].some(v=>String(v||'').toLowerCase().includes(q)))&&(!filters.platform||filters.platform==='all'||r.platform===filters.platform)&&(!filters.tier||filters.tier==='all'||r.tier===filters.tier||(r.groups||[]).includes(filters.tier));}).sort((a,b)=>String(a.name).localeCompare(String(b.name))||a.key.localeCompare(b.key));}
function metric(row,key){if(key==='points'&&row.pointsFresh===false)return null;if(key==='earned'&&row.earnedFresh===false)return null;if(key==='spent'&&row.spentFresh===false)return null;return num(row[key]);}
function leaders(rows,key){return rows.filter(r=>metric(r,key)!==null).sort((a,b)=>metric(b,key)-metric(a,key)||String(a.name).localeCompare(String(b.name))||a.key.localeCompare(b.key)).slice(0,20);}
const reasons={unclassified:'Unclassified change',reward:'Earned reward',referral:'Referral bonus',welcome:'Welcome bonus',streak:'Stream streak bonus',first_words:'First words reward',upgrade:'!upgrade purchase',membership_purchase:'Membership purchase',fast_track_credit:'Fast-track credit',fast_track_purchase:'Fast-track purchase',bucket_transfer:'Giveaway bucket contribution',prime_adjustment:'Prime adjustment',adjustment:'Administrator adjustment',redemption:'Redemption'};
function movement(e){if(e.kind==='repair_summary')return 'Saved movement history repaired';if(e.kind==='capture_review')return 'Movement needs review';if(e.kind==='admin')return e.actionLabel||'Administrator change';if(e.kind==='movement')return reasons[e.reason]||e.reason||'Unclassified change';if(e.kind==='membership')return (tierNames[e.group]||e.group)+' · '+e.groupOperation;if(e.kind==='baseline')return 'Opening snapshot';if(e.kind==='source')return 'Points source changed · new baseline';if(e.kind==='upgrade')return 'Confirmed !upgrade';if(e.kind==='bucket')return 'Giveaway bucket update';const from=rank[e.beforeTier],to=rank[e.afterTier];if(from!==undefined&&to!==undefined&&from!==to)return(to>from?'Tier up':'Tier down')+' · '+tierNames[e.beforeTier]+' → '+tierNames[e.afterTier];if(e.beforeTier!==e.afterTier)return 'Membership status updated';if(JSON.stringify(e.beforeGroups)!==JSON.stringify(e.afterGroups))return 'Membership badges changed';if(e.delta>0)return 'Observed points increase';if(e.delta<0)return 'Observed points decrease';return 'Member data updated';}
function csv(rows){return rows.map(row=>row.map(v=>{let s=v===null||v===undefined?'':String(v);if(typeof v==='string'&&/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(',')).join('\r\n');}
function captureHealth(data,connected,now=Date.now()){
 if(!data)return {text:'Waiting for ledger',active:false};
 if(!connected)return {text:'Disconnected · saved totals',active:false};
 if(data.captureError)return {text:'Capture needs attention',active:false};
 if(data.pendingLabels||data.captureReviewCount)return {text:'Some movements need matching',active:false};
 const latest=Math.max(data.lastMovementListenerAt||0,data.lastVerifiedHookAt||0);
 if(!latest)return {text:'Waiting for a points change',active:false};
 if(now-latest>900000)return {text:'No recent points activity',active:false};
 return {text:'Movement capture active',active:true};
}
window.VoyagerPoints={captureHealth,reasons,tierNames,num,members,leaders,metric,movement,csv};
})();
