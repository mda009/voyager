/* Twitch reports are stored at their original granularity. Daily unique counts are never summed. */
(()=>{'use strict';
const groups={audience:'Audience',engagement:'Chat & engagement',growth:'Growth & subscriptions',earnings:'Revenue & ads',discovery:'Discovery & content'};
const catalog=[
 ['averageViewers','Average viewers','audience','number','Average Concurrent Viewers'],['peakViewers','Peak viewers','audience','count','Max Viewers|Peak Concurrent Viewers'],['uniqueViewers','Unique viewers','audience','count',''],['liveViews','Live views','audience','count',''],['minutesWatched','Minutes watched','audience','number',''],['hoursWatched','Hours watched','audience','number',''],['minutesStreamed','Minutes streamed','audience','number','Minutes Broadcast'],['hoursStreamed','Hours streamed','audience','number','Hours Broadcast'],
 ['uniqueChatters','Unique chatters','engagement','count','Unique Chat Participants|Chatters'],['chatMessages','Chat messages','engagement','count','Chat Messages Sent|Messages Sent'],['chattersPercent','Viewers who chatted','engagement','percent',''],['channelPointRedemptions','Channel point redemptions','engagement','count',''],['pollVotes','Poll votes','engagement','count',''],['predictionParticipants','Prediction participants','engagement','count',''],
 ['follows','Follows','growth','count','New Followers'],['subscriptions','Subscriptions','growth','count','Subs'],['paidSubscriptions','Paid subscriptions','growth','count','Paid Subs|Total Paid Subs'],['primeSubscriptions','Prime subscriptions','growth','count','Prime Subs'],['giftedSubscriptions','Gifted subscriptions','growth','count','Gift Subs|Total Gifted Subs'],['tier1Subscriptions','Tier 1 subscriptions','growth','count','Tier 1 Subs'],['tier2Subscriptions','Tier 2 subscriptions','growth','count','Tier 2 Subs'],['tier3Subscriptions','Tier 3 subscriptions','growth','count','Tier 3 Subs'],['subscriptionPoints','Subscription points','growth','number','Sub Points'],
 ['revenue','Estimated revenue','earnings','money','Revenue|Total Revenue'],['subscriptionRevenue','Subscription revenue','earnings','money','Sub Revenue'],['primeRevenue','Prime revenue','earnings','money','Prime Sub Revenue'],['giftRevenue','Gift subscription revenue','earnings','money','Gift Sub Revenue|Gifted Subs Revenue'],['adRevenue','Ad revenue','earnings','money','Ads Revenue'],['bitsRevenue','Bits revenue','earnings','money',''],['bits','Bits used','earnings','count','Bits'],['adMinutes','Ad minutes','earnings','number','Ad Breaks (Minutes)'],['adsPerHour','Ad minutes per hour','earnings','number','Ad Time Per Hour (Minutes)'],
 ['clipsCreated','Clips created','discovery','count',''],['clipViews','Clip views','discovery','count',''],['vodViews','VOD views','discovery','count',''],['raidViewersPercent','Viewers from raids','discovery','percent','Raid Viewers (%)'],['promotionImpressions','Promotion impressions','discovery','count',''],['promotionClicks','Promotion clicks','discovery','count',''],['notificationImpressions','Go-live notification impressions','discovery','count',''],['notificationClicks','Go-live notification clicks','discovery','count',''],
 ['hostsRaidsViewersPercent','Viewers from hosts and raids','discovery','percent','Hosts and Raids Viewers (%)'],['featuredClipViews','Featured clip views','discovery','count',''],['unfeaturedClipViews','Unfeatured clip views','discovery','count',''],
 ['engagedViewers','Engaged viewers','engagement','count',''],['newEngagedViewers','New engaged viewers','engagement','count',''],['returningEngagedViewers','Returning engaged viewers','engagement','count',''],
 ['adSecondsPerHour','Ad time per hour (seconds)','earnings','number','Ad Time (Seconds) Per Hour'],['turboRevenue','Turbo revenue','earnings','money',''],['gameSalesRevenue','Game sales revenue','earnings','money',''],['extensionsRevenue','Extensions revenue','earnings','money',''],['bountiesRevenue','Bounties revenue','earnings','money',''],['otherBitsRevenue','Other Bits interactions revenue','earnings','money',''],['hypeChatRevenue','Hype Chat revenue','earnings','money',''],
 ['giftedTier1Subscriptions','Gifted Tier 1 subscriptions','growth','count','Gifted Tier 1 subs'],['giftedTier2Subscriptions','Gifted Tier 2 subscriptions','growth','count','Gifted Tier 2 subs'],['giftedTier3Subscriptions','Gifted Tier 3 subscriptions','growth','count','Gifted Tier 3 subs'],['multiMonthGiftedSubscriptions','Multi-month gifted subscriptions','growth','count','Total Multi-Month Gifted subs'],['multiMonthGiftedTier1','Multi-month gifted Tier 1 subscriptions','growth','count','Multi-Month Gifted Tier 1 subs'],['multiMonthGiftedTier2','Multi-month gifted Tier 2 subscriptions','growth','count','Multi-Month Gifted Tier 2 subs'],['multiMonthGiftedTier3','Multi-month gifted Tier 3 subscriptions','growth','count','Multi-Month Gifted Tier 3 subs']
// Growth fields retain signed changes/corrections from the source export.
// This policy applies to CSV, saved reports, JSON restores and manual edits alike.
].map(([key,label,group,unit,aliases])=>({key,label,group,unit,aliases,allowNegative:group==='growth'}));
const byKey=Object.fromEntries(catalog.map(m=>[m.key,m])),norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
const aliases=new Map();for(const m of catalog)for(const a of [m.key,m.label,...m.aliases.split('|').filter(Boolean)])aliases.set(norm(a),m);
function object(v,label){if(!v||typeof v!=='object'||Array.isArray(v))throw Error(label+' must be an object.');return v;}
function text(v,max=100){return String(v??'').trim().slice(0,max);}
function date(v){const s=text(v);if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(Date.parse(s))||new Date(s).toISOString().slice(0,10)!==s)throw Error('Use a valid YYYY-MM-DD date.');return s;}
function number(v,unit='number',label='Value',allowNegative=false){
 if(v===null||v===undefined||v==='')return null;
 if(typeof v!=='string'&&typeof v!=='number')throw Error(label+' must be numeric.');
 let s=String(v).trim();if(!s||['—','–','-','--','N/A'].includes(s.toUpperCase()))return null;
 const original=s,money=unit==='money',signed=money||allowNegative&&unit!=='percent';
 if(unit==='percent')s=s.replace(/%$/,'').trim();
 if(signed)s=s.replace(/\u2212/g,'-');
 if(money){
  // Revenue adjustments keep their sign. Parentheses are accounting negatives.
  const accounting=s.startsWith('(')&&s.endsWith(')');if(accounting)s=s.slice(1,-1).trim();
  s=s.replace(/^([+-]?)\s*[£€$]\s*/,'$1');
  if(accounting){if(/^[+-]/.test(s))throw Error(label+': conflicting signs in '+JSON.stringify(original.slice(0,80))+'.');s='-'+s;}
 }
 const valid=signed?/^[+-]?(?:(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/:/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
 if(!valid.test(s))throw Error(label+': value '+JSON.stringify(original.slice(0,80))+' is not a valid '+(money?'amount. Use a decimal point (for example -1.25 or 2.5e-7), or leave blank.':signed?(unit==='count'?'whole number. Positive and negative values are accepted, or leave blank.':'number. Positive and negative values are accepted, or leave blank.'):'non-negative number. Use a decimal point, or leave blank.'));
 const n=Number(s.replace(/,/g,''));if(!Number.isFinite(n)||Math.abs(n)>Number.MAX_SAFE_INTEGER||unit==='count'&&!Number.isSafeInteger(n)||unit==='percent'&&n>100||n===0&&/[1-9]/.test(s.split(/[eE]/)[0]))throw Error(label+': value '+JSON.stringify(original.slice(0,80))+' is outside its allowed range.');return n;
}
function breakdown(rows,name){if(!Array.isArray(rows)||rows.length>300)throw Error(name+': maximum 300 rows.');const seen=new Set();let sum=0;const out=rows.map(r=>{object(r,name);const label=text(r.label,100),value=number(r.percent,'percent',name);if(!label||value===null||seen.has(label.toLowerCase()))throw Error(name+': each row needs a distinct label and percentage.');seen.add(label.toLowerCase());sum+=value;return{label,percent:value};});if(sum>100.5)throw Error(name+': percentages exceed 100% (allowing rounding).');return out.sort((a,b)=>b.percent-a.percent||a.label.localeCompare(b.label));}
function report(r){object(r,'Report');const start=date(r.start),end=date(r.end);if(start>end)throw Error('Report start must be on or before its end.');const timezone=text(r.timezone,80);if(!timezone)throw Error('Enter the time zone shown in the source report.');const currency=text(r.currency).toUpperCase();if(currency&&!/^[A-Z]{3}$/.test(currency))throw Error('Currency must be a three-letter code, such as AUD or USD.');
 const metrics={};object(r.metrics||{},'Metrics');for(const [key,value]of Object.entries(r.metrics||{})){const m=Object.hasOwn(byKey,key)?byKey[key]:null;if(!m)throw Error('Unknown metric key: '+key+'. Put additional fields in extras.');const n=number(value,m.unit,m.label,m.allowNegative);if(n!==null)metrics[key]=n;}
 if(metrics.averageViewers!==undefined&&metrics.peakViewers!==undefined&&metrics.averageViewers>metrics.peakViewers)throw Error('Average viewers cannot exceed peak viewers.');
 const extras=r.extras||[];if(!Array.isArray(extras)||extras.length>120)throw Error('Maximum 120 additional metrics per report.');const seen=new Set();const extraRows=extras.map(x=>{object(x,'Additional metric');const label=text(x.label,100),unit=x.unit||'number';if(!['count','number','money','percent'].includes(unit))throw Error('Invalid additional metric unit.');if(!label||seen.has(label.toLowerCase()))throw Error('Additional metrics need distinct names.');seen.add(label.toLowerCase());return{label,unit,value:number(x.value,unit,label)};}).filter(x=>x.value!==null);
 if(!currency&&(catalog.some(m=>m.unit==='money'&&metrics[m.key]!==undefined)||extraRows.some(x=>x.unit==='money')))throw Error('Enter the currency used in this report before saving revenue.');
 const countries=breakdown(r.countries||[],'Countries'),devices=breakdown(r.devices||[],'Devices'),sources=breakdown(r.sources||[],'Discovery sources');
 if(!Object.keys(metrics).length&&!extraRows.length&&!countries.length&&!devices.length&&!sources.length)throw Error('Enter at least one metric or audience breakdown.');
 return{start,end,title:text(r.title,120)||'Twitch analytics',timezone,currency,source:text(r.source,120)||'Twitch Creator Dashboard',metrics,extras:extraRows,countries,devices,sources,notes:text(r.notes,2000),updatedAt:Number.isSafeInteger(r.updatedAt)&&r.updatedAt>0?r.updatedAt:Date.now()};
}
function key(r){return[r.start,r.end,r.title,r.source,r.timezone].join('|');}
function bundle(b){object(b,'Report file');if(b.schema!==1||String(b.channel).toLowerCase()!=='mda009'||!Array.isArray(b.reports)||b.reports.length>400)throw Error('Use a Voyager Twitch report file for mda009, with at most 400 reports.');const reports=b.reports.map(report),seen=new Set();for(const r of reports){if(seen.has(key(r)))throw Error('Duplicate report periods/titles in this file.');seen.add(key(r));}return{schema:1,channel:'mda009',savedAt:Number.isSafeInteger(b.savedAt)?b.savedAt:0,reports:reports.sort((a,b)=>b.end.localeCompare(a.end)||b.start.localeCompare(a.start)||a.title.localeCompare(b.title))};}
function merge(b,rows){const map=new Map(b.reports.map(r=>[key(r),r]));for(const r of rows)map.set(key(r),report(r));return bundle({...b,savedAt:Date.now(),reports:[...map.values()]});}
function table(raw){if(typeof raw!=='string'||raw.length>3000000)throw Error('CSV must be under 3 MB.');raw=raw.replace(/^\uFEFF/,'');const first=raw.split(/\r?\n/)[0],delimiter=first.includes('\t')?'\t':first.includes(';')&&!first.includes(',')?';':',';const rows=[];let row=[],cell='',quoted=false,closed=false;
 for(let i=0;i<raw.length;i++){const c=raw[i];if(quoted){if(c==='"'){if(raw[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;continue;}if(c==='"'){if(cell||closed)throw Error('Malformed CSV quoting.');quoted=true;continue;}if(c===delimiter||c==='\n'||c==='\r'){row.push(cell);cell='';closed=false;if(c!==delimiter){if(c==='\r'&&raw[i+1]==='\n')i++;if(row.some(x=>x.trim()))rows.push(row);row=[];}continue;}if(closed){if(c.trim())throw Error('Unexpected text after a CSV quote.');}else cell+=c;}
 if(quoted)throw Error('CSV contains an unclosed quote.');row.push(cell);if(row.some(x=>x.trim()))rows.push(row);if(rows.length<2)throw Error('CSV needs a header and at least one data row.');const width=rows[0].length;if(width>150||rows.length>401||rows.some(r=>r.length!==width))throw Error('CSV must have matching column counts, at most 150 columns and 400 data rows.');const headers=rows[0].map(norm);if(headers.some((h,i)=>!h||headers.indexOf(h)!==i))throw Error('CSV headers must be non-empty and distinct.');return rows;
}
function csvDate(s,format){s=text(s);if(/^\d{4}-\d{2}-\d{2}$/.test(s))return date(s);const words=s.match(/^(?:(?:Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?),?\s+)?([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);if(words){const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],names=['january','february','march','april','may','june','july','august','september','october','november','december'],month=words[1].toLowerCase(),index=months.indexOf(month.slice(0,3));if(index>=0&&[months[index],names[index],'sept'].includes(month)&&!(month==='sept'&&index!==8))return date(words[3]+'-'+String(index+1).padStart(2,'0')+'-'+words[2].padStart(2,'0'));}const m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);if(!m||!['DMY','MDY'].includes(format))throw Error('Use Twitch dates such as Tue Aug 04 2026, YYYY-MM-DD, or select the matching day/month/year or month/day/year format.');return date(m[3]+'-'+(format==='DMY'?m[2]:m[1]).padStart(2,'0')+'-'+(format==='DMY'?m[1]:m[2]).padStart(2,'0'));}
// Infer numeric order only when at least one date makes it unambiguous.
function detectDateFormat(raws,selection='AUTO'){
 if(selection!=='AUTO')return selection;
 let dmy=false,mdy=false,numeric=false;
 for(const raw of raws){const [heads,...rows]=table(raw),i=heads.map(norm).findIndex(h=>['date','day'].includes(h));if(i<0)continue;for(const row of rows){const match=text(row[i]).match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);if(!match)continue;numeric=true;if(Number(match[1])>12)dmy=true;if(Number(match[2])>12)mdy=true;}}
 if(dmy&&mdy)throw Error('These files use different numeric date orders. Import them separately and choose the matching date format.');
 if(numeric&&!dmy&&!mdy)throw Error('These dates could be day/month/year or month/day/year. Choose Dates in CSV below to confirm the order.');
 return dmy?'DMY':mdy?'MDY':'ISO';
}
function fromCSV(raw,meta={}){if(!meta.dateFormat||meta.dateFormat==='AUTO')meta={...meta,dateFormat:detectDateFormat([raw])};const [headers,...rows]=table(raw),hn=headers.map(norm),di=hn.findIndex(h=>['date','day'].includes(h));if(hn.filter(h=>['date','day'].includes(h)).length>1)throw Error('Use one Date or Day column.');if(di<0&&rows.length>1)throw Error('Multiple CSV rows need a Date or Day column.');if(hn.includes('gameid')||hn.includes('extensionid'))throw Error('This appears to be a game or extension analytics export, not a channel report.');const seen=new Set();return rows.map((cells,rowIndex)=>{
 const r={...meta,title:di>=0?'Twitch daily report':meta.title||'Twitch analytics',metrics:{},extras:[],countries:[],devices:[],sources:[],notes:''};if(di>=0)r.start=r.end=csvDate(cells[di],meta.dateFormat);
 const notes=[];headers.forEach((header,i)=>{if(i===di)return;const value=cells[i].trim(),m=aliases.get(hn[i]);if(!value||['-','--','—','–','N/A'].includes(value.toUpperCase()))return;if(['channel','channelname','broadcaster','broadcastername'].includes(hn[i])){if(value.replace(/^@/,'').toLowerCase()!=='mda009')throw Error('CSV channel does not match mda009.');return;}if(hn[i]==='currency'){if(r.currency&&value.toUpperCase()!==r.currency.toUpperCase())throw Error('CSV currency does not match the selected currency.');r.currency=value;return;}if(m){if(Object.hasOwn(r.metrics,m.key))throw Error('Two columns map to '+m.label+'. Remove the duplicate column.');r.metrics[m.key]=number(value,m.unit,m.label+' (row '+(rowIndex+2)+(di>=0?', '+r.start:'')+')',m.allowNegative);}else{let n;try{n=number(value,value.endsWith('%')?'percent':'number',header);}catch{notes.push(header+': '+value);return;}r.extras.push({label:header,value:n,unit:value.endsWith('%')?'percent':'number'});}});r.notes=notes.join('\n');const valid=report(r);if(seen.has(key(valid)))throw Error('This CSV contains duplicate dates. Import daily exports with one row per date, or separate stream summaries.');seen.add(key(valid));return valid;
 });}
// CSV imports supplement matching reports. Blank/absent cells never erase a saved metric.
// Batch conflicts are rejected; conflicts with saved reports are reviewed before applying.
function combine(left,right,policy,changes){const a=report(left),b=report(right);if(key(a)!==key(b))throw Error('Cannot combine different report periods.');if(a.currency&&b.currency&&a.currency!==b.currency)throw Error('Different currencies for '+b.start+'. Use the same source currency, or a separate report title.');const out={...a,metrics:{...a.metrics},extras:a.extras.map(x=>({...x})),currency:b.currency||a.currency,updatedAt:Math.max(a.updatedAt,b.updatedAt)};
 const decide=(label,old,value,unit)=>{if(old===undefined||old===null)return value;if(old===value)return old;if(policy==='strict')throw Error('Selected CSV files disagree on '+b.start+' · '+label+'. Import them separately and review which value to keep.');changes?.push({date:b.start,title:b.title,label,previous:old,incoming:value,unit,currency:out.currency});return policy==='keep'?old:value;};
 for(const[k,v]of Object.entries(b.metrics))out.metrics[k]=decide(byKey[k].label,out.metrics[k],v,byKey[k].unit);
 for(const x of b.extras){const old=out.extras.find(v=>v.label.toLowerCase()===x.label.toLowerCase());if(old){if(old.unit!==x.unit)throw Error('Units differ for '+x.label+' on '+b.start+'.');old.value=decide(x.label,old.value,x.value,x.unit);}else out.extras.push({...x});}
 for(const name of ['countries','devices','sources'])if(b[name].length){if(a[name].length&&JSON.stringify(a[name])!==JSON.stringify(b[name]))throw Error('CSV cannot replace saved audience breakdowns. Use Manage Twitch reports.');out[name]=b[name];}
 out.notes=[...new Set([a.notes,b.notes].filter(Boolean))].join('\n').slice(0,2000);return report(out);
}
function combineCSV(rows){const map=new Map();for(const value of rows){const r=report(value),k=key(r);map.set(k,map.has(k)?combine(map.get(k),r,'strict'):r);}if(map.size>400)throw Error('Maximum 400 daily reports per import.');return[...map.values()].sort((a,b)=>b.end.localeCompare(a.end)||a.title.localeCompare(b.title));}
function planCSV(b,rows,policy='update'){if(!['update','keep'].includes(policy))throw Error('Choose how to handle existing values.');const valid=bundle(b),incoming=combineCSV(rows),map=new Map(valid.reports.map(r=>[key(r),r])),conflicts=[],review=[];let added=0,matched=0;for(const r of incoming){const old=map.get(key(r));const next=old?(matched++,combine(old,r,policy,conflicts)):(added++,r);map.set(key(r),next);review.push(next);}return{next:bundle({...valid,savedAt:Date.now(),reports:[...map.values()]}),rows:review,added,matched,conflicts};}
function fromBreakdown(raw,name){if(!raw.trim())return[];const rows=table(raw);if(rows[0].length!==2||norm(rows[0][1])!=='percent')throw Error(name+': use two columns, label,percent.');return breakdown(rows.slice(1).map(r=>({label:r[0],percent:r[1]})),name);}
function toBreakdown(rows){return rows.length?'label,percent\n'+rows.map(r=>'"'+r.label.replace(/"/g,'""')+'",'+r.percent).join('\n'):'';}
// Reporting windows are display-only. They must never be written back as source reports.
const nonAdditive=new Set(['uniqueViewers','uniqueChatters','engagedViewers','newEngagedViewers','returningEngagedViewers','predictionParticipants']);
const weightedMetrics=new Set(['averageViewers','adsPerHour','adSecondsPerHour']);
function reportSetKey(r){return JSON.stringify([r.source,r.timezone,r.currency]);}
function reportSets(reports){
 const map=new Map();for(const r of reports){const id=reportSetKey(r);if(!map.has(id))map.set(id,{id,source:r.source,timezone:r.timezone,currency:r.currency,reports:[]});map.get(id).reports.push(r);}
 return [...map.values()].map(s=>({...s,latest:s.reports.reduce((v,r)=>r.end>v?r.end:v,''),daily:s.reports.filter(r=>r.start===r.end&&r.title==='Twitch daily report').length})).sort((a,b)=>Number(b.daily>0)-Number(a.daily>0)||b.latest.localeCompare(a.latest)||b.daily-a.daily||a.id.localeCompare(b.id));
}
function shiftDay(day,offset){const d=new Date(date(day)+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+offset);return d.toISOString().slice(0,10);}
function calendarDay(timezone,now=Date.now()){
 let zone=timezone,fallback=false,formatter;
 try{formatter=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});}catch{zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';fallback=true;formatter=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});}
 const parts=Object.fromEntries(formatter.formatToParts(new Date(now)).map(p=>[p.type,p.value]));return{day:parts.year+'-'+parts.month+'-'+parts.day,zone,fallback};
}
function streamedMinutes(r){return r.metrics.minutesStreamed??(r.metrics.hoursStreamed===undefined?null:r.metrics.hoursStreamed*60);}
function dailyReports(reports,through='9999-12-31'){
 const dailyMap=new Map();let duplicates=0;
 // Callers pass one source / time zone / currency set. A calendar day contributes once.
 for(const r of reports.filter(r=>r.start===r.end&&r.end<=through).sort((a,b)=>Number(b.title==='Twitch daily report')-Number(a.title==='Twitch daily report')||b.updatedAt-a.updatedAt||key(a).localeCompare(key(b)))){if(dailyMap.has(r.start)){duplicates++;continue;}dailyMap.set(r.start,r);}
 return{rows:[...dailyMap.values()].sort((a,b)=>b.start.localeCompare(a.start)),duplicates};
}
function reportingWindow(reports,preset='30',setId='',now=Date.now()){
 if(!['30','14','7','latest'].includes(String(preset)))throw Error('Choose 30 days, 14 days, 7 days or latest stream.');
 preset=String(preset);const sets=reportSets(reports),set=sets.find(s=>s.id===setId)||sets[0],calendar=calendarDay(set?.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone,now);
 const candidates=set?.reports||[],daily=dailyReports(candidates,calendar.day),allDaily=daily.rows,duplicates=daily.duplicates;
 let start,end,days,rows,sourceReport=null,note='';
 if(preset==='latest'){
  const timed=allDaily.filter(r=>streamedMinutes(r)!==null);sourceReport=timed.length?timed.find(r=>streamedMinutes(r)>0)||null:allDaily[0]||null;
  start=end=sourceReport?.start||'';days=1;rows=sourceReport?[sourceReport]:[];
  note=sourceReport?(timed.length?'Latest recorded stream day. Daily exports cannot separate multiple streams on one day or a stream crossing midnight.':'Latest report day; streaming time was not supplied, so the latest stream cannot be identified.'):timed.length?'No imported day has recorded streaming time above zero.':'Upload daily reports with Minutes Streamed to find the latest stream.';
 }else{days=Number(preset);end=shiftDay(calendar.day,-1);start=shiftDay(end,1-days);rows=allDaily.filter(r=>r.start>=start&&r.end<=end);sourceReport=candidates.filter(r=>r.start===start&&r.end===end).sort((a,b)=>b.updatedAt-a.updatedAt||key(a).localeCompare(key(b)))[0]||rows[0]||null;}
 const exact=preset==='latest'?sourceReport:candidates.filter(r=>r.start===start&&r.end===end).sort((a,b)=>b.updatedAt-a.updatedAt||key(a).localeCompare(key(b)))[0]||null;
 const metrics={},metricNotes={},dailyAverages={},sum=values=>values.reduce((a,b)=>a+b,0),countNote=n=>n+' of '+days+' dates reported';
 for(const m of catalog){
  if(exact&&Object.hasOwn(exact.metrics,m.key)){metrics[m.key]=exact.metrics[m.key];metricNotes[m.key]=preset==='latest'?'Source-reported day':'Source-reported whole period';continue;}
  const available=rows.filter(r=>Object.hasOwn(r.metrics,m.key));
  if(nonAdditive.has(m.key)||m.unit==='percent'){
   metricNotes[m.key]='Needs a source report for the whole period; daily unique counts and shares are not added.';
   if(nonAdditive.has(m.key)&&available.length)dailyAverages[m.key]={value:sum(available.map(r=>r.metrics[m.key]))/available.length,count:available.length};
   continue;
  }
  if(weightedMetrics.has(m.key)){
   const weighted=rows.filter(r=>streamedMinutes(r)>0&&Object.hasOwn(r.metrics,m.key)),weight=sum(weighted.map(streamedMinutes));
   if(weight>0){metrics[m.key]=sum(weighted.map(r=>r.metrics[m.key]*streamedMinutes(r)))/weight;metricNotes[m.key]='Weighted by streaming time · '+weighted.length+' streaming days with both values';}
   else metricNotes[m.key]='Needs streaming time and this metric on the same reported days.';
   continue;
  }
  if(available.length){metrics[m.key]=m.key==='peakViewers'?Math.max(...available.map(r=>r.metrics[m.key])):sum(available.map(r=>r.metrics[m.key]));metricNotes[m.key]=(m.key==='peakViewers'?'Highest reported peak':'Total')+' · '+countNote(available.length);}
 }
 const hasData=!!exact||rows.length>0;
 const r=hasData?{start,end,title:preset==='latest'?'Latest stream':'Previous '+days+' days',source:set.source,timezone:set.timezone,currency:set.currency,metrics,extras:exact?.extras||[],countries:exact?.countries||[],devices:exact?.devices||[],sources:exact?.sources||[],notes:exact?.notes||'',updatedAt:Math.max(0,...rows.map(r=>r.updatedAt),exact?.updatedAt||0)}:null;
 const summary=[preset==='latest'?(start?start+'. ':'')+note:days+' complete days · '+start+' to '+end+'. '+(exact?'Whole-period source report available. ':'' )+countNote(rows.length)+'. Missing dates are not treated as zero.',set?set.source+' · '+set.timezone+(set.currency?' · '+set.currency:'')+'.':'No report set available.',calendar.fallback?'Window dates use '+calendar.zone+' because the report time zone is not a recognised time-zone name.':'',duplicates?'Overlapping daily reports are counted once per date.':'',!hasData&&preset!=='latest'?'No uploaded reports cover this window. Import recent CSVs or select an individual saved report.':''].filter(Boolean).join(' ');
 return{report:r,preset,start,end,days,calendarDate:calendar.day,calendarTimezone:set?.timezone||calendar.zone,coveredDays:rows.length,exact:!!exact,sourceReport,setId:set?.id||'',sets,dailyAverages,metricNotes,summary};
}
window.VoyagerTwitchAnalyticsModel={catalog,groups,byKey,date,number,report,bundle,merge,key,table,detectDateFormat,fromCSV,combineCSV,planCSV,fromBreakdown,toBreakdown,reportSetKey,reportSets,shiftDay,calendarDay,dailyReports,reportingWindow};
})();
