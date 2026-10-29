/* Presentation only: bucket balances and targets always come from the Points Ledger. */
(()=>{'use strict';
const tiers=['silver','gold','platinum'], number=window.VoyagerPoints.num;
const integer=new Intl.NumberFormat('en-AU',{maximumFractionDigits:2});
const percent=new Intl.NumberFormat('en-AU',{minimumFractionDigits:1,maximumFractionDigits:1});
const compact=new Intl.NumberFormat('en-AU',{notation:'compact',maximumFractionDigits:1});
function bucket(data,key){
 const raw=data?.buckets?.[key],points=number(raw?.points),target=number(raw?.target);
 const valid=!!raw&&!raw.error&&points!==null&&target!==null&&target>0;
 const ratio=valid?points/target*100:null,available=valid&&Number.isFinite(ratio);
 const complete=available&&points>=target;
 // Do not round a not-yet-reached target up to 100% on screen.
 const display=available&&ratio<100&&ratio>99.9?99.9:ratio;
 return{key,available,complete,points,target,fill:available?Math.min(100,Math.max(0,ratio)):0,
  percentage:available?(Math.abs(display)>=1000?compact:percent).format(display)+'%':'—',
  balance:available?integer.format(points)+' / '+integer.format(target)+' pts':raw?'Points unavailable':'Waiting for points',
  note:complete?'GOAL MET':''};
}
function freshness(data,receivedAt,now=Date.now()){
 const scan=number(data?.lastScanAt),server=number(data?.serverAt);
 // Compare server timestamps to one another to allow for different PC clocks.
 if(scan===null||server===null||scan<=0||server<=0||scan>server+5000||receivedAt===null)return false;
 return Math.max(0,server-scan)+Math.max(0,now-receivedAt)<=300000;
}
window.VoyagerBucketOverlay={tiers,bucket,freshness};
})();
