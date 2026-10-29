/* One dated chart and table, refreshed after CSV imports, source updates and date rollover. */
(()=>{'use strict';
const $=id=>document.getElementById(id),M=window.VoyagerReportingChartModel,demo=new URLSearchParams(location.search).get('demo')==='1';
const fmt=(n,d=0)=>n===null||n===undefined?'—':Number(n).toLocaleString('en-AU',{maximumFractionDigits:d});
const date=(value,long=false)=>value?new Date(value+'T12:00:00Z').toLocaleDateString('en-AU',{day:'numeric',month:'short',...(long?{year:'numeric'}:{}),timeZone:'UTC'}):'Not available';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
let lastCalendar='';
function span(dates){return dates.length===1?date(dates[0]):date(dates[0])+' – '+date(dates.at(-1));}
function render(){
 const view=M.build(window.VoyagerReports?.chartContext(),window.VoyagerHome?.chartData(),{source:$('performance-chart-source').value,metric:$('performance-chart-metric').value});
 lastCalendar=view.calendarDate;
 const labels={average:'Average viewers',peak:'Peak viewers'},metric=labels[view.metric],svg=$('performance-chart'),NS='http://www.w3.org/2000/svg';
 const make=(tag,attrs,text,parent=svg)=>{const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;parent.append(n);return n;};
 svg.replaceChildren();
 const top=15,bottom=200,left=48,right=744,max=Math.max(10,...view.rows.map(r=>r[view.metric]??0))*1.15;
 for(let i=0;i<5;i++){const y=top+(bottom-top)*i/4;make('line',{x1:left,y1:y,x2:right,y2:y,stroke:'#263b50','stroke-dasharray':'3 5'});make('text',{x:left-9,y:y+3,fill:'#8099b2','font-size':10,'text-anchor':'end'},fmt(max*(1-i/4)));}
 if(view.rows.length){
  const cell=(right-left)/view.rows.length;
  view.rows.forEach((r,i)=>{
   const x=left+(i+.5)*cell,value=r[view.metric],missing=value===null||value===undefined,group=make('g',{'data-date':r.date,'data-value':missing?'missing':value});
   if(missing){make('line',{x1:x-3,y1:bottom-7,x2:x+3,y2:bottom-1,stroke:'#d0ac75','stroke-width':1.5},undefined,group);make('line',{x1:x-3,y1:bottom-1,x2:x+3,y2:bottom-7,stroke:'#d0ac75','stroke-width':1.5},undefined,group);}
   else if(value===0)make('circle',{cx:x,cy:bottom-3,r:2.5,fill:'#90c8e7'},undefined,group);
   else{const height=value/max*(bottom-top);make('rect',{x:x-cell*.3,y:bottom-height,width:cell*.6,height:Math.max(1,height),rx:2,fill:r.date===view.latest?'#c8eaff':'#639ac2'},undefined,group);}
   make('title',{},date(r.date,true)+' · '+(missing?'No '+metric.toLowerCase()+' supplied':fmt(value,1)+' '+metric.toLowerCase())+' · '+r.detail,group);
   if(view.rows.length<=8||i===0||i===view.rows.length-1||i%Math.ceil(view.rows.length/7)===0&&i<view.rows.length-2)make('text',{x,y:221,fill:'#a5bdd2','font-size':9,'text-anchor':'middle'},date(r.date));
  });
 }else make('text',{x:396,y:105,fill:'#9ab1c8','font-size':12,'text-anchor':'middle'},'No daily data available for this selection');
 svg.setAttribute('aria-label',metric+' from '+date(view.start,true)+' to '+date(view.end,true)+'. '+view.available+' dates reported; '+view.missing.length+' dates unavailable. Full values are in Explore chart dates.');
 const fresh=$('reporting-freshness');fresh.replaceChildren();
 for(const [label,value,note]of [
  [view.preset==='latest'?'Latest recorded stream day':'Selected window through',date(view.end,true),view.preset==='latest'?'Latest recorded day may lag newer streams.':view.selection.startsWith('range:')?'Complete days · today is excluded':date(view.start)+' – '+date(view.end)],
  ['Latest chart data',view.latest?date(view.latest,true):'Awaiting figures',(demo?'Demo · ':'')+view.sourceName],
  ['Chart coverage',view.available+' / '+view.rows.length+' dates',view.missing.length?'Unreported dates stay blank.':'All chart dates have this metric.']
 ]){const card=el('article');card.append(el('span',label),el('b',value),el('small',note));fresh.append(card);}
 const status=$('reporting-chart-status');status.dataset.stale=String(!view.available||view.trailing.length>0);
 status.textContent=view.trailing.length?'No '+metric.toLowerCase()+' supplied for '+span(view.trailing)+'. '+(view.source==='csv'?'Upload a newer Twitch CSV to fill those dates.':'Refresh external data or upload a Twitch CSV containing these dates.'):!view.available?'No daily viewer figures are available. Upload a Twitch daily CSV or choose the public stream log.':view.preset==='latest'?'Showing the latest recorded stream day: '+date(view.end,true)+'. The most recent complete calendar day is '+date(view.targetEnd,true)+'.':'Chart data reaches '+date(view.end,true)+'.'+(view.missing.length?' Earlier dates have gaps; see the date table.':'');
 const basis=view.source==='csv'?'Daily figures from the selected uploaded report set.':'Public stream start dates are UTC. Multiple listed streams on a date use an hours-weighted average and the highest peak; public hours can be rounded.';
 $('performance-chart-note').textContent=(demo?'Fictional preview. ':'')+view.sourceName+' · window dates use '+view.timezone+'. '+basis+' × = not supplied; dot = reported zero. '+(view.source==='public'&&view.publicUpdated?'Log checked '+date(view.publicUpdated,true)+'; checking a source does not create newer stream rows. ':'')+(view.timezoneFallback?'Unrecognised report time zone; window uses browser time zone. ':'')+(view.limited?'Latest 60 calendar dates shown. ':'')+'The chart and uploaded report cards share the reporting-window control. Public summary figures retain their own provider dates.';
 $('stream-log-count').textContent=view.available+' reported dates · '+view.sourceName;
 $('stream-log-caption').textContent=(view.start?date(view.start,true)+' – '+date(view.end,true)+'. ':'')+'Missing dates and missing metrics are shown as —. A missing date does not prove that no stream took place. '+(view.source==='public'?'Values cover only listed streams.':'Daily exports cannot separate multiple streams on the same day.');
 const body=$('home-streams');body.replaceChildren();for(const r of [...view.rows].reverse()){const tr=el('tr');for(const value of [date(r.date,true),r.detail,fmt(r.average,1),fmt(r.peak),fmt(r.hours,1)])tr.append(el('td',value));body.append(tr);}
 if(!view.rows.length){const tr=el('tr'),td=el('td','No daily rows for this selection. Upload a daily report or select a different window.');td.colSpan=5;tr.append(td);body.append(tr);}
}
for(const id of ['performance-chart-source','performance-chart-metric'])$(id).addEventListener('change',render);
for(const name of ['voyager:reports-updated','voyager:performance-updated'])window.addEventListener(name,render);
// Also advances the public fallback when no CSV reports are stored.
setInterval(()=>{const context=window.VoyagerReports?.chartContext(),view=M.build(context,window.VoyagerHome?.chartData());if(view.calendarDate!==lastCalendar)render();},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});window.addEventListener('focus',render);
render();
})();
