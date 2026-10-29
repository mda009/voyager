// Sorted event windows preserve absolute alert timing and support preview seeks.
export function lowerBound(rows, time, key='at') {
  let lo=0,hi=rows.length;
  while(lo<hi){const mid=(lo+hi)>>>1;if(rows[mid][key]<time)lo=mid+1;else hi=mid;}
  return lo;
}
export function upperBound(rows, time, key='at') {
  let lo=0,hi=rows.length;
  while(lo<hi){const mid=(lo+hi)>>>1;if(rows[mid][key]<=time)lo=mid+1;else hi=mid;}
  return lo;
}
export class SoundTimeline {
  constructor(rows){this.rows=rows.slice().sort((a,b)=>a.at-b.at);}
  visit(after,time,maxAge,callback){
    const start=Math.max(upperBound(this.rows,after),lowerBound(this.rows,time-maxAge));
    const end=upperBound(this.rows,time);
    for(let i=start;i<end;i++)callback(this.rows[i]);
  }
}
// Generate noise once, before weapons start. AudioBuffers are reusable across
// source nodes and later AudioContexts with the same sample rate.
export class NoiseBank {
  constructor(){this.buffers=new Map();this.generated=0;}
  get(context,duration){
    const key=context.sampleRate+':'+duration;
    if(!this.buffers.has(key)){
      const buffer=context.createBuffer(1,Math.floor(context.sampleRate*duration),context.sampleRate);
      const data=buffer.getChannelData(0);
      for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length)**2;
      this.buffers.set(key,buffer);this.generated++;
    }
    return this.buffers.get(key);
  }
  prepare(context){for(const duration of [.09,.16,.22,.35,.75,1.4,2.5,2.7])this.get(context,duration);}
}
