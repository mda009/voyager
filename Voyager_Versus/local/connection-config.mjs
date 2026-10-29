// Reads and edits the Streamer.bot connection in config.js for the Settings page.
// Only the four connection lines are changed; comments and every other setting are kept as written.
// The password is never returned, only whether one is set.

const KEYS={host:'string',port:'number',password:'string',requireAuthentication:'boolean'};
const line=key=>new RegExp('^(\\s*'+key+'\\s*:\\s*)("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|[0-9]+|true|false)(\\s*,?)','m');

function value(text,key){
  const m=text.match(line(key));if(!m)return undefined;const raw=m[2];
  if(raw==='true'||raw==='false')return raw==='true';
  if(/^[0-9]+$/.test(raw))return Number(raw);
  if(raw.startsWith('"'))try{return JSON.parse(raw);}catch{return undefined;}
  return raw.slice(1,-1).replace(/\\(.)/g,'$1');
}

export function readConnection(text){
  if(!/VOYAGER_CONFIG\s*=/.test(text))throw new Error('config.js does not contain window.VOYAGER_CONFIG.');
  const host=value(text,'host'),port=value(text,'port'),password=value(text,'password'),auth=value(text,'requireAuthentication');
  return {host:typeof host==='string'?host:'127.0.0.1',port:Number.isInteger(port)?port:8080,hasPassword:typeof password==='string'&&password.length>0,requireAuthentication:auth===true};
}

export function validateConnection(input){
  const out={};
  if(input.host!==undefined){const host=String(input.host).trim();if(!/^[A-Za-z0-9.-]{1,253}$|^\[?[0-9A-Fa-f:]{2,39}\]?$/.test(host))throw new Error('Enter a computer name or IP address, such as 127.0.0.1.');out.host=host;}
  if(input.port!==undefined){const port=Number(input.port);if(!Number.isInteger(port)||port<1||port>65535)throw new Error('The port must be a number from 1 to 65535.');out.port=port;}
  if(input.clearPassword===true)out.password='';
  else if(typeof input.password==='string'&&input.password.length){if(input.password.length>256||/[\r\n]/.test(input.password))throw new Error('That password cannot be saved.');out.password=input.password;}
  if(input.requireAuthentication!==undefined)out.requireAuthentication=input.requireAuthentication===true;
  return out;
}

export function updateConnection(text,input){
  const changes=validateConnection(input);readConnection(text);
  let next=text;
  for(const [key,v] of Object.entries(changes)){
    const literal=KEYS[key]==='string'?JSON.stringify(v):String(v),rx=line(key);
    if(rx.test(next))next=next.replace(rx,(_,a,__,c)=>a+literal+c);
    else{
      const open=next.match(/VOYAGER_CONFIG\s*=\s*\{/);if(!open)throw new Error('config.js does not contain window.VOYAGER_CONFIG.');
      const at=open.index+open[0].length;next=next.slice(0,at)+'\n  '+key+': '+literal+','+next.slice(at);
    }
  }
  return next;
}
