// Minimal Streamer.bot WebSocket stand-in for tests: says Hello, answers every request
// with {status:'ok'} and lets a test push chat events to the connected host.
import http from 'node:http';
import {createHash} from 'node:crypto';

function frame(text){
  const payload=Buffer.from(text),len=payload.length;
  const head=len<126?Buffer.from([0x81,len]):len<65536?Buffer.from([0x81,126,len>>8,len&255]):(()=>{const b=Buffer.alloc(10);b[0]=0x81;b[1]=127;b.writeBigUInt64BE(BigInt(len),2);return b;})();
  return Buffer.concat([head,payload]);
}
function* frames(buffer){
  let offset=0;
  while(buffer.length-offset>=2){
    const b1=buffer[offset+1],masked=(b1&128)!==0;let len=b1&127,pos=offset+2;
    if(len===126){if(buffer.length<pos+2)break;len=buffer.readUInt16BE(pos);pos+=2;}
    else if(len===127){if(buffer.length<pos+8)break;len=Number(buffer.readBigUInt64BE(pos));pos+=8;}
    const mask=masked?buffer.subarray(pos,pos+4):null;if(masked)pos+=4;
    if(buffer.length<pos+len)break;
    const data=Buffer.from(buffer.subarray(pos,pos+len));if(mask)for(let i=0;i<data.length;i++)data[i]^=mask[i&3];
    yield {opcode:buffer[offset]&15,data,end:pos+len};offset=pos+len;
  }
}
export async function startFakeStreamerBot({port=0,password='',actions=[],onDoAction=null}={}){
  const sockets=new Set(),received=[];
  const server=http.createServer((req,res)=>{res.writeHead(426);res.end();});
  server.on('upgrade',(req,socket)=>{
    const accept=createHash('sha1').update(req.headers['sec-websocket-key']+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
    socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+accept+'\r\n\r\n');
    sockets.add(socket);let pending=Buffer.alloc(0);
    const send=obj=>socket.writable&&socket.write(frame(JSON.stringify(obj)));
    socket.on('data',chunk=>{
      pending=Buffer.concat([pending,chunk]);let used=0;
      for(const f of frames(pending)){
        used=f.end;
        if(f.opcode===8){socket.end();return;}
        if(f.opcode!==1)continue;
        let msg;try{msg=JSON.parse(f.data.toString());}catch{continue;}
        received.push(msg);
        if(msg.id)send(msg.request==='GetActions'?{id:msg.id,status:'ok',actions}:{id:msg.id,status:'ok'});
        if(msg.request==='DoAction'&&onDoAction){const reply=onDoAction(msg);if(reply)setTimeout(()=>send({event:{source:'General',type:'Custom'},data:reply}),20);}
      }
      pending=pending.subarray(used);
    });
    socket.on('close',()=>sockets.delete(socket));socket.on('error',()=>sockets.delete(socket));
    send(password?{request:'Hello',authentication:{salt:'salt',challenge:'challenge'}}:{request:'Hello'});
  });
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  return {
    url:'ws://127.0.0.1:'+server.address().port+'/',received,
    connected:()=>sockets.size>0,
    chat(login,text,id){const msg={event:{source:'Twitch',type:'ChatMessage'},data:{user:{id:String(100000+login.length),login,name:login},text,messageId:id}};for(const s of sockets)s.write(frame(JSON.stringify(msg)));},
    async close(){for(const s of sockets)s.destroy();await new Promise(r=>server.close(r));}
  };
}
