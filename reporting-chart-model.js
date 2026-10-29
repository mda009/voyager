/* Calendar-based reporting charts. Missing data is never converted to zero. */
(()=>{'use strict';
const M=window.VoyagerTwitchAnalyticsModel;
const present=n=>typeof n==='number'&&Number.isFinite(n);
function csvRow(r){
 const minutes=r.metrics.minutesStreamed??(r.metrics.hoursStreamed===undefined?null:r.metrics.hoursStreamed*60);
 return {date:r.start,average:r.metrics.averageViewers??null,peak:r.metrics.peakViewers??null,hours:minutes===null?null:minutes/60,detail:r.source+' · daily report',reported:true};
}
function publicRows(streams){
 const dates=new Map();
 for(const r of streams?.rows||[]){if(!dates.has(r.date))dates.set(r.date,[]);dates.get(r.date).push(r);}
 return [...dates].map(([date,rows])=>{
  const hours=rows.reduce((n,r)=>n+r.hours,0);
  return {date,average:hours?rows.reduce((n,r)=>n+r.average*r.hours,0)/hours:null,peak:Math.max(...rows.map(r=>r.peak)),hours,reported:true,detail:(streams.source||'Public log')+' · '+rows.length+' listed stream'+(rows.length===1?'':'s')+' · '+[...new Set(rows.map(r=>r.category).filter(Boolean))].join(', ')};
 });
}
function build(context,home,{source='auto',metric='average',now=Date.now()}={}){
 const reports=context?.reports||[],selection=context?.selected||'range:30',range=selection.startsWith('range:'),preset=range?selection.slice(6):'',saved=range?null:reports.find(r=>M.key(r)===selection),sets=M.reportSets(reports),set=sets.find(s=>s.id===(saved?M.reportSetKey(saved):context?.reportSetId))||sets[0];
 const calendar=M.calendarDay(set?.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone,now),targetEnd=M.shiftDay(calendar.day,-1);
 const csv=M.dailyReports(set?.reports||[],calendar.day).rows.map(csvRow),pub=publicRows(home?.streams).filter(r=>r.date<=calendar.day),useful=r=>present(r.average)||present(r.peak);
 let start=range&&preset!=='latest'?M.shiftDay(targetEnd,1-Number(preset)):saved?.start||'',end=range&&preset!=='latest'?targetEnd:saved?.end||'';
 const inWindow=r=>(!start||r.date>=start)&&(!end||r.date<=end);
 // Automatic chooses one source; never blend public samples with official daily totals.
 const chosen=source==='csv'||source==='auto'&&csv.some(r=>inWindow(r)&&useful(r))?'csv':'public';
 const all=(chosen==='csv'?csv:pub).sort((a,b)=>a.date.localeCompare(b.date));
 if(preset==='latest'){
  if(chosen==='csv'){
   const latest=M.reportingWindow(reports,'latest',set?.id||'',now);start=end=latest.start;
  }else start=end=all.filter(useful).at(-1)?.date||'';
 }
 // A chart of an individual whole-period report requires daily rows; never divide its totals into days.
 const requestedStart=start,requestedEnd=end;
 let limited=false;
 if(start&&end&&start<M.shiftDay(end,-59)){start=M.shiftDay(end,-59);limited=true;}
 const byDate=new Map(all.map(r=>[r.date,r])),rows=[];
 if(start&&end)for(let date=start;date<=end;date=M.shiftDay(date,1))rows.push(byDate.get(date)||{date,average:null,peak:null,hours:null,detail:'No figures supplied for this date',reported:false});
 const available=rows.filter(r=>present(r[metric])),latest=all.filter(r=>r.date<=(requestedEnd||calendar.day)&&present(r[metric])).at(-1)?.date||'',missing=rows.filter(r=>!present(r[metric])).map(r=>r.date),trailing=[];
 for(let i=rows.length-1;i>=0&&!present(rows[i][metric]);i--)trailing.unshift(rows[i].date);
 return {source:chosen,sourceName:chosen==='csv'?(set?.source||'Uploaded Twitch reports'):home?.streams?.source||'Public stream log',timezone:calendar.zone,timezoneFallback:calendar.fallback,reportTimezone:set?.timezone||calendar.zone,calendarDate:calendar.day,targetEnd,start:requestedStart,end:requestedEnd,rows,available:available.length,missing,trailing,latest,limited,preset,selection,metric,publicUpdated:home?.streams?.updated||'',hasDailyCSV:csv.length>0};
}
window.VoyagerReportingChartModel={build};
})();
