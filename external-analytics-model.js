/* Validate each external provider separately; failed reads cannot erase saved data. */
(()=>{'use strict';
function merge(base,response){
 const M=window.VoyagerHomeModel;
 if(response?.schema!==1||!response.sources||typeof response.sources!=='object')throw Error('Invalid external analytics response.');
 let snapshots=[...base.snapshots],rank=base.rank,streams=base.streams;const accepted=[],rejected={};
 for(const source of ['TwitchMetrics','TwitchTracker']){
  const entry=response.sources[source];if(!entry?.snapshot)continue;
  try{
   const s=M.snapshot(entry.snapshot);if(s.source!==source||!s.fetchedAt||s.fetchedAt!==entry.lastSuccessAt)throw Error('Source identity or retrieval time did not match.');
   const r=source==='TwitchTracker'?M.ranking(entry.rank):null;
   if(r&&(r.source!==source||r.fetchedAt!==s.fetchedAt))throw Error('Ranking source or retrieval time did not match.');
   const old=snapshots.find(x=>x.source===source&&x.end===s.end);
   if(!old||!old.fetchedAt||old.fetchedAt<=s.fetchedAt){snapshots=snapshots.filter(x=>x.source!==source||x.end!==s.end);snapshots.push(s);}
   if(source==='TwitchTracker'&&(!rank?.fetchedAt||rank.fetchedAt<=s.fetchedAt))rank=r;
   if(source==='TwitchMetrics'&&entry.streams?.rows?.length&&(!streams.rows.length||streams.source===source)&&entry.streams.updated>=streams.updated){
    try{
     if(entry.streams.source!==source)throw Error('Unexpected stream-log source.');
     const checked=M.bundle({schema:1,channel:'mda009',savedAt:0,snapshots:[s],rank:null,streams:entry.streams}).streams;
     const dates=new Set(checked.rows.map(x=>x.date));streams={...checked,rows:[...streams.rows.filter(x=>!dates.has(x.date)),...checked.rows].sort((a,b)=>a.date.localeCompare(b.date)).slice(-500)};
    }catch(e){rejected[source]='Summary refreshed; recent stream log retained: '+e.message;}
   }
   accepted.push(source);
  }catch(e){rejected[source]=e.message;}
 }
 snapshots.sort((a,b)=>a.end.localeCompare(b.end)||a.updated.localeCompare(b.updated));
 return {data:accepted.length?M.bundle({...base,snapshots:snapshots.slice(-400),rank,streams}):base,accepted,rejected};
}
window.VoyagerExternalModel={merge};
})();
