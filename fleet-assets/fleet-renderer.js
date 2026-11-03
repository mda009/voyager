(()=>{function $s(r,e,t="at"){let i=0,n=r.length;for(;i<n;){let s=i+n>>>1;r[s][t]<e?i=s+1:n=s}return i}function Yr(r,e,t="at"){let i=0,n=r.length;for(;i<n;){let s=i+n>>>1;r[s][t]<=e?i=s+1:n=s}return i}var Js=class{constructor(e){this.rows=e.slice().sort((t,i)=>t.at-i.at)}visit(e,t,i,n){let s=Math.max(Yr(this.rows,e),$s(this.rows,t-i)),a=Yr(this.rows,t);for(let o=s;o<a;o++)n(this.rows[o])}},Ks=class{constructor(){this.buffers=new Map,this.generated=0}get(e,t){let i=e.sampleRate+":"+t;if(!this.buffers.has(i)){let n=e.createBuffer(1,Math.floor(e.sampleRate*t),e.sampleRate),s=n.getChannelData(0);for(let a=0;a<s.length;a++)s[a]=(Math.random()*2-1)*(1-a/s.length)**2;this.buffers.set(i,n),this.generated++}return this.buffers.get(i)}prepare(e){for(let t of[.09,.16,.22,.35,.75,1.4,2.5,2.7])this.get(e,t)}};var au=0,ec=1,ou=2;var tc=1,fo=2,Bi=3,yn=0,Ut=1,gt=2,Mn=0,kt=1,Ns=2,ic=3,nc=4,lu=5,Ur=100,cu=101,hu=102,uu=103,du=104,pu=200,mu=201,fu=202,gu=203,vu=204,_u=205,xu=206,yu=207,Mu=208,Su=209,bu=210,Tu=211,wu=212,Eu=213,Au=214,go=0,vo=1,_o=2,Fs=3,xo=4,yo=5,Mo=6,So=7,Cu=0,Ru=1,Pu=2,en=0,Iu=1,Lu=2,Uu=3,bo=4,Du=5,Nu=6,Fu=7;var rc=300,Dr=301,Fn=302,Nr=303,To=304,Bs=306,fr=1e3,gr=1001,Ia=1002,Ui=1003,Bu=1004;var Os=1005;var Di=1006,wo=1007;var Bn=1008;var Oi=1009,sc=1010,ac=1011,Fr=1012,Eo=1013,On=1014,yi=1015,Br=1016,Ao=1017,Co=1018,Or=1020,oc=35902,lc=35899,Ou=1021,zu=1022,Mi=1023,zs=1026,Gs=1027,Ro=1028,Po=1029,Gu=1030,cc=1031;var hc=1033,Io=33776,Lo=33777,Uo=33778,Do=33779,uc=35840,dc=35841,pc=35842,mc=35843,fc=36196,gc=37492,vc=37496,_c=37808,xc=37809,yc=37810,Mc=37811,Sc=37812,bc=37813,Tc=37814,wc=37815,Ec=37816,Ac=37817,Cc=37818,Rc=37819,Pc=37820,Ic=37821,Lc=36492,Uc=36494,Dc=36495,Nc=36283,Fc=36284,Bc=36285,Oc=36286;var cs=2300,La=2301,Ra=2302,Vl=2400,Hl=2401,Wl=2402;var ku=3201;var Vu=0,Hu=1,zn="",xt="srgb",Un="srgb-linear",hs="linear",rt="srgb";var Ln=7680;var Wu=512,Xu=513,ju=514,zc=515,qu=516,Yu=517,Zu=518,Ju=519,Ua=35044,Kt=35048;var Gc="300 es",Ji=2e3,us=2001;var Ki=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i!==void 0&&i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let n=i[e];if(n!==void 0){let s=n.indexOf(t);s!==-1&&n.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let n=i.slice(0);for(let s=0,a=n.length;s<a;s++)n[s].call(this,e);e.target=null}}},Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],wh=1234567,pr=Math.PI/180,vr=180/Math.PI;function Li(){let r=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,i=4294967295*Math.random()|0;return(Bt[255&r]+Bt[r>>8&255]+Bt[r>>16&255]+Bt[r>>24&255]+"-"+Bt[255&e]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[63&t|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[255&i]+Bt[i>>8&255]+Bt[i>>16&255]+Bt[i>>24&255]).toLowerCase()}function Ne(r,e,t){return Math.max(e,Math.min(t,r))}function Xl(r,e){return(r%e+e)%e}function as(r,e,t){return(1-t)*r+t*e}function vi(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function nt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(4294967295*r);case Uint16Array:return Math.round(65535*r);case Uint8Array:return Math.round(255*r);case Int32Array:return Math.round(2147483647*r);case Int16Array:return Math.round(32767*r);case Int8Array:return Math.round(127*r);default:throw new Error("Invalid component type.")}}var Si={DEG2RAD:pr,RAD2DEG:vr,generateUUID:Li,clamp:Ne,euclideanModulo:Xl,mapLinear:function(r,e,t,i,n){return i+(r-e)*(n-i)/(t-e)},inverseLerp:function(r,e,t){return r!==e?(t-r)/(e-r):0},lerp:as,damp:function(r,e,t,i){return as(r,e,1-Math.exp(-t*i))},pingpong:function(r,e=1){return e-Math.abs(Xl(r,2*e)-e)},smoothstep:function(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e))*r*(3-2*r)},smootherstep:function(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e))*r*r*(r*(6*r-15)+10)},randInt:function(r,e){return r+Math.floor(Math.random()*(e-r+1))},randFloat:function(r,e){return r+Math.random()*(e-r)},randFloatSpread:function(r){return r*(.5-Math.random())},seededRandom:function(r){r!==void 0&&(wh=r);let e=wh+=1831565813;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296},degToRad:function(r){return r*pr},radToDeg:function(r){return r*vr},isPowerOfTwo:function(r){return!(r&r-1)&&r!==0},ceilPowerOfTwo:function(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))},floorPowerOfTwo:function(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))},setQuaternionFromProperEuler:function(r,e,t,i,n){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),h=a((e+i)/2),d=s((e-i)/2),p=a((e-i)/2),u=s((i-e)/2),m=a((i-e)/2);switch(n){case"XYX":r.set(o*h,l*d,l*p,o*c);break;case"YZY":r.set(l*p,o*h,l*d,o*c);break;case"ZXZ":r.set(l*d,l*p,o*h,o*c);break;case"XZX":r.set(o*h,l*m,l*u,o*c);break;case"YXY":r.set(l*u,o*h,l*m,o*c);break;case"ZYZ":r.set(l*m,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}},normalize:nt,denormalize:vi},J=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ne(this.x,e.x,t.x),this.y=Ne(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ne(this.x,e,t),this.y=Ne(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ne(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ne(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),n=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*n+e.x,this.y=s*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},$e=class{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,s,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],d=i[n+3],p=s[a+0],u=s[a+1],m=s[a+2],g=s[a+3];if(o===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=d);if(o===1)return e[t+0]=p,e[t+1]=u,e[t+2]=m,void(e[t+3]=g);if(d!==g||l!==p||c!==u||h!==m){let f=1-o,v=l*p+c*u+h*m+d*g,_=v>=0?1:-1,x=1-v*v;if(x>Number.EPSILON){let T=Math.sqrt(x),w=Math.atan2(T,v*_);f=Math.sin(f*w)/T,o=Math.sin(o*w)/T}let y=o*_;if(l=l*f+p*y,c=c*f+u*y,h=h*f+m*y,d=d*f+g*y,f===1-o){let T=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=T,c*=T,h*=T,d*=T}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,n,s,a){let o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],d=s[a],p=s[a+1],u=s[a+2],m=s[a+3];return e[t]=o*m+h*d+l*u-c*p,e[t+1]=l*m+h*p+c*d-o*u,e[t+2]=c*m+h*u+o*p-l*d,e[t+3]=h*m-o*d-l*p-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,n=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),d=o(s/2),p=l(i/2),u=l(n/2),m=l(s/2);switch(a){case"XYZ":this._x=p*h*d+c*u*m,this._y=c*u*d-p*h*m,this._z=c*h*m+p*u*d,this._w=c*h*d-p*u*m;break;case"YXZ":this._x=p*h*d+c*u*m,this._y=c*u*d-p*h*m,this._z=c*h*m-p*u*d,this._w=c*h*d+p*u*m;break;case"ZXY":this._x=p*h*d-c*u*m,this._y=c*u*d+p*h*m,this._z=c*h*m+p*u*d,this._w=c*h*d-p*u*m;break;case"ZYX":this._x=p*h*d-c*u*m,this._y=c*u*d+p*h*m,this._z=c*h*m-p*u*d,this._w=c*h*d+p*u*m;break;case"YZX":this._x=p*h*d+c*u*m,this._y=c*u*d+p*h*m,this._z=c*h*m-p*u*d,this._w=c*h*d-p*u*m;break;case"XZY":this._x=p*h*d-c*u*m,this._y=c*u*d-p*h*m,this._z=c*h*m+p*u*d,this._w=c*h*d+p*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],n=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],p=i+o+d;if(p>0){let u=.5/Math.sqrt(p+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(a-n)*u}else if(i>o&&i>d){let u=2*Math.sqrt(1+i-o-d);this._w=(h-l)/u,this._x=.25*u,this._y=(n+a)/u,this._z=(s+c)/u}else if(o>d){let u=2*Math.sqrt(1+o-i-d);this._w=(s-c)/u,this._x=(n+a)/u,this._y=.25*u,this._z=(l+h)/u}else{let u=2*Math.sqrt(1+d-i-o);this._w=(a-n)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ne(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,n=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+n*c-s*l,this._y=n*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,n=this._y,s=this._z,a=this._w,o=a*e._w+i*e._x+n*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let u=1-t;return this._w=u*a+t*this._w,this._x=u*i+t*this._x,this._y=u*n+t*this._y,this._z=u*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,p=Math.sin(t*h)/c;return this._w=a*d+this._w*p,this._x=i*d+this._x*p,this._y=n*d+this._y*p,this._z=s*d+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},S=class r{constructor(e=0,t=0,i=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Eh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Eh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*n,this.y=s[1]*t+s[4]*i+s[7]*n,this.z=s[2]*t+s[5]*i+s[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,n=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*n-o*i),h=2*(o*t-s*n),d=2*(s*i-a*t);return this.x=t+l*c+a*d-o*h,this.y=i+l*h+o*c-s*d,this.z=n+l*d+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*n,this.y=s[1]*t+s[5]*i+s[9]*n,this.z=s[2]*t+s[6]*i+s[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ne(this.x,e.x,t.x),this.y=Ne(this.y,e.y,t.y),this.z=Ne(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ne(this.x,e,t),this.y=Ne(this.y,e,t),this.z=Ne(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ne(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,n=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return pl.copy(this).projectOnVector(e),this.sub(pl)}reflect(e){return this.sub(pl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ne(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=2*Math.random()-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},pl=new S,Eh=new $e,Le=class r{constructor(e,t,i,n,s,a,o,l,c){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c)}set(e,t,i,n,s,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],p=i[2],u=i[5],m=i[8],g=n[0],f=n[3],v=n[6],_=n[1],x=n[4],y=n[7],T=n[2],w=n[5],R=n[8];return s[0]=a*g+o*_+l*T,s[3]=a*f+o*x+l*w,s[6]=a*v+o*y+l*R,s[1]=c*g+h*_+d*T,s[4]=c*f+h*x+d*w,s[7]=c*v+h*y+d*R,s[2]=p*g+u*_+m*T,s[5]=p*f+u*x+m*w,s[8]=p*v+u*y+m*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*s*h+i*o*l+n*s*c-n*a*l}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,p=o*l-h*s,u=c*s-a*l,m=t*d+i*p+n*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/m;return e[0]=d*g,e[1]=(n*c-h*i)*g,e[2]=(o*i-n*a)*g,e[3]=p*g,e[4]=(h*t-n*l)*g,e[5]=(n*s-o*t)*g,e[6]=u*g,e[7]=(i*l-c*t)*g,e[8]=(a*t-i*s)*g,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-n*c,n*l,-n*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ml.makeScale(e,t)),this}rotate(e){return this.premultiply(ml.makeRotation(-e)),this}translate(e,t){return this.premultiply(ml.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ml=new Le;function kc(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function _r(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Ku(){let r=_r("canvas");return r.style.display="block",r}var Ah={};function xr(r){r in Ah||(Ah[r]=!0,console.warn(r))}function $u(r,e,t){return new Promise(function(i,n){setTimeout(function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:n();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}},t)})}var Ch=new Le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Rh=new Le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sp(){let r={enabled:!0,workingColorSpace:Un,spaces:{},convert:function(n,s,a){return this.enabled!==!1&&s!==a&&s&&a&&(this.spaces[s].transfer===rt&&(n.r=Zi(n.r),n.g=Zi(n.g),n.b=Zi(n.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[s].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===rt&&(n.r=mr(n.r),n.g=mr(n.g),n.b=mr(n.b))),n},workingToColorSpace:function(n,s){return this.convert(n,this.workingColorSpace,s)},colorSpaceToWorking:function(n,s){return this.convert(n,s,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===""?hs:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,s=this.workingColorSpace){return n.fromArray(this.spaces[s].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,s,a){return n.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,s){return xr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(n,s)},toWorkingColorSpace:function(n,s){return xr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(n,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return r.define({[Un]:{primaries:e,whitePoint:i,transfer:hs,toXYZ:Ch,fromXYZ:Rh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:xt},outputColorSpaceConfig:{drawingBufferColorSpace:xt}},[xt]:{primaries:e,whitePoint:i,transfer:rt,toXYZ:Ch,fromXYZ:Rh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:xt}}}),r}var Je=sp();function Zi(r){return r<.04045?.0773993808*r:Math.pow(.9478672986*r+.0521327014,2.4)}function mr(r){return r<.0031308?12.92*r:1.055*Math.pow(r,.41666)-.055}var Jn,Da=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Jn===void 0&&(Jn=_r("canvas")),Jn.width=e.width,Jn.height=e.height;let n=Jn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),i=Jn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=_r("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let n=i.getImageData(0,0,e.width,e.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=255*Zi(s[a]/255);return i.putImageData(n,0,0),t}if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(255*Zi(t[i]/255)):t[i]=Zi(t[i]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},ap=0,yr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ap++}),this.uuid=Li(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(fl(n[a].image)):s.push(fl(n[a]))}else s=fl(n);i.url=s}return t||(e.images[this.uuid]=i),i}};function fl(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Da.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var op=0,gl=new S,zt=class r extends Ki{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,i=1001,n=1001,s=1006,a=1008,o=1023,l=1009,c=r.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:op++}),this.uuid=Li(),this.name="",this.source=new yr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new J(0,0),this.repeat=new J(1,1),this.center=new J(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(gl).x}get height(){return this.source.getSize(gl).y}get depth(){return this.source.getSize(gl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let n=this[t];n!==void 0?n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[t]=i:console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`)}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==rc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fr:e.x=e.x-Math.floor(e.x);break;case gr:e.x=e.x<0?0:1;break;case Ia:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case fr:e.y=e.y-Math.floor(e.y);break;case gr:e.y=e.y<0?0:1;break;case Ia:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};zt.DEFAULT_IMAGE=null,zt.DEFAULT_MAPPING=rc,zt.DEFAULT_ANISOTROPY=1;var Ke=class r{constructor(e=0,t=0,i=0,n=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,s,l=e.elements,c=l[0],h=l[4],d=l[8],p=l[1],u=l[5],m=l[9],g=l[2],f=l[6],v=l[10];if(Math.abs(h-p)<.01&&Math.abs(d-g)<.01&&Math.abs(m-f)<.01){if(Math.abs(h+p)<.1&&Math.abs(d+g)<.1&&Math.abs(m+f)<.1&&Math.abs(c+u+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,y=(u+1)/2,T=(v+1)/2,w=(h+p)/4,R=(d+g)/4,P=(m+f)/4;return x>y&&x>T?x<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(x),n=w/i,s=R/i):y>T?y<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(y),i=w/n,s=P/n):T<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(T),i=R/s,n=P/s),this.set(i,n,s,t),this}let _=Math.sqrt((f-m)*(f-m)+(d-g)*(d-g)+(p-h)*(p-h));return Math.abs(_)<.001&&(_=1),this.x=(f-m)/_,this.y=(d-g)/_,this.z=(p-h)/_,this.w=Math.acos((c+u+v-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ne(this.x,e.x,t.x),this.y=Ne(this.y,e.y,t.y),this.z=Ne(this.z,e.z,t.z),this.w=Ne(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ne(this.x,e,t),this.y=Ne(this.y,e,t),this.z=Ne(this.z,e,t),this.w=Ne(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ne(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Na=class extends Ki{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Di,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Ke(0,0,e,t),this.scissorTest=!1,this.viewport=new Ke(0,0,e,t);let n={width:e,height:t,depth:i.depth},s=new zt(n);this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:Di,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i,this.textures[n].isArrayTexture=this.textures[n].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new yr(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ni=class extends Na{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},ds=class extends zt{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Ui,this.minFilter=Ui,this.wrapR=gr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Fa=class extends zt{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Ui,this.minFilter=Ui,this.wrapR=gr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Zt=class{constructor(e=new S(1/0,1/0,1/0),t=new S(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(mi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(mi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=mi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,mi):mi.fromBufferAttribute(s,a),mi.applyMatrix4(e.matrixWorld),this.expandByPoint(mi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Qs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Qs.copy(i.boundingBox)),Qs.applyMatrix4(e.matrixWorld),this.union(Qs)}let n=e.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mi),mi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Zr),ea.subVectors(this.max,Zr),Kn.subVectors(e.a,Zr),$n.subVectors(e.b,Zr),Qn.subVectors(e.c,Zr),an.subVectors($n,Kn),on.subVectors(Qn,$n),Cn.subVectors(Kn,Qn);let t=[0,-an.z,an.y,0,-on.z,on.y,0,-Cn.z,Cn.y,an.z,0,-an.x,on.z,0,-on.x,Cn.z,0,-Cn.x,-an.y,an.x,0,-on.y,on.x,0,-Cn.y,Cn.x,0];return!!vl(t,Kn,$n,Qn,ea)&&(t=[1,0,0,0,1,0,0,0,1],!!vl(t,Kn,$n,Qn,ea)&&(ta.crossVectors(an,on),t=[ta.x,ta.y,ta.z],vl(t,Kn,$n,Qn,ea)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(mi).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wi)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Wi=[new S,new S,new S,new S,new S,new S,new S,new S],mi=new S,Qs=new Zt,Kn=new S,$n=new S,Qn=new S,an=new S,on=new S,Cn=new S,Zr=new S,ea=new S,ta=new S,Rn=new S;function vl(r,e,t,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){Rn.fromArray(r,s);let o=n.x*Math.abs(Rn.x)+n.y*Math.abs(Rn.y)+n.z*Math.abs(Rn.z),l=e.dot(Rn),c=t.dot(Rn),h=i.dot(Rn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var lp=new Zt,Jr=new S,_l=new S,oi=class{constructor(e=new S,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):lp.setFromPoints(e).getCenter(i);let n=0;for(let s=0,a=e.length;s<a;s++)n=Math.max(n,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Jr.subVectors(e,this.center);let t=Jr.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),n=.5*(i-this.radius);this.center.addScaledVector(Jr,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_l.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Jr.copy(e.center).add(_l)),this.expandByPoint(Jr.copy(e.center).sub(_l))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Xi=new S,xl=new S,ia=new S,ln=new S,yl=new S,na=new S,Ml=new S,mn=class{constructor(e=new S,t=new S(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Xi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Xi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Xi.copy(this.origin).addScaledVector(this.direction,t),Xi.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){xl.copy(e).add(t).multiplyScalar(.5),ia.copy(t).sub(e).normalize(),ln.copy(this.origin).sub(xl);let s=.5*e.distanceTo(t),a=-this.direction.dot(ia),o=ln.dot(this.direction),l=-ln.dot(ia),c=ln.lengthSq(),h=Math.abs(1-a*a),d,p,u,m;if(h>0)if(d=a*l-o,p=a*o-l,m=s*h,d>=0)if(p>=-m)if(p<=m){let g=1/h;d*=g,p*=g,u=d*(d+a*p+2*o)+p*(a*d+p+2*l)+c}else p=s,d=Math.max(0,-(a*p+o)),u=-d*d+p*(p+2*l)+c;else p=-s,d=Math.max(0,-(a*p+o)),u=-d*d+p*(p+2*l)+c;else p<=-m?(d=Math.max(0,-(-a*s+o)),p=d>0?-s:Math.min(Math.max(-s,-l),s),u=-d*d+p*(p+2*l)+c):p<=m?(d=0,p=Math.min(Math.max(-s,-l),s),u=p*(p+2*l)+c):(d=Math.max(0,-(a*s+o)),p=d>0?s:Math.min(Math.max(-s,-l),s),u=-d*d+p*(p+2*l)+c);else p=a>0?-s:s,d=Math.max(0,-(a*p+o)),u=-d*d+p*(p+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),n&&n.copy(xl).addScaledVector(ia,p),u}intersectSphere(e,t){Xi.subVectors(e.center,this.origin);let i=Xi.dot(this.direction),n=Xi.dot(Xi)-i*i,s=e.radius*e.radius;if(n>s)return null;let a=Math.sqrt(s-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return!(e.radius<0)&&this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,p=this.origin;return c>=0?(i=(e.min.x-p.x)*c,n=(e.max.x-p.x)*c):(i=(e.max.x-p.x)*c,n=(e.min.x-p.x)*c),h>=0?(s=(e.min.y-p.y)*h,a=(e.max.y-p.y)*h):(s=(e.max.y-p.y)*h,a=(e.min.y-p.y)*h),i>a||s>n?null:((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),d>=0?(o=(e.min.z-p.z)*d,l=(e.max.z-p.z)*d):(o=(e.max.z-p.z)*d,l=(e.min.z-p.z)*d),i>l||o>n?null:((o>i||i!=i)&&(i=o),(l<n||n!=n)&&(n=l),n<0?null:this.at(i>=0?i:n,t)))}intersectsBox(e){return this.intersectBox(e,Xi)!==null}intersectTriangle(e,t,i,n,s){yl.subVectors(t,e),na.subVectors(i,e),Ml.crossVectors(yl,na);let a,o=this.direction.dot(Ml);if(o>0){if(n)return null;a=1}else{if(!(o<0))return null;a=-1,o=-o}ln.subVectors(this.origin,e);let l=a*this.direction.dot(na.crossVectors(ln,na));if(l<0)return null;let c=a*this.direction.dot(yl.cross(ln));if(c<0||l+c>o)return null;let h=-a*ln.dot(Ml);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},fe=class r{constructor(e,t,i,n,s,a,o,l,c,h,d,p,u,m,g,f){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c,h,d,p,u,m,g,f)}set(e,t,i,n,s,a,o,l,c,h,d,p,u,m,g,f){let v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=n,v[1]=s,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=h,v[10]=d,v[14]=p,v[3]=u,v[7]=m,v[11]=g,v[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,n=1/er.setFromMatrixColumn(e,0).length(),s=1/er.setFromMatrixColumn(e,1).length(),a=1/er.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,n=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let p=a*h,u=a*d,m=o*h,g=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=u+m*c,t[5]=p-g*c,t[9]=-o*l,t[2]=g-p*c,t[6]=m+u*c,t[10]=a*l}else if(e.order==="YXZ"){let p=l*h,u=l*d,m=c*h,g=c*d;t[0]=p+g*o,t[4]=m*o-u,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=u*o-m,t[6]=g+p*o,t[10]=a*l}else if(e.order==="ZXY"){let p=l*h,u=l*d,m=c*h,g=c*d;t[0]=p-g*o,t[4]=-a*d,t[8]=m+u*o,t[1]=u+m*o,t[5]=a*h,t[9]=g-p*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let p=a*h,u=a*d,m=o*h,g=o*d;t[0]=l*h,t[4]=m*c-u,t[8]=p*c+g,t[1]=l*d,t[5]=g*c+p,t[9]=u*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let p=a*l,u=a*c,m=o*l,g=o*c;t[0]=l*h,t[4]=g-p*d,t[8]=m*d+u,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=u*d+m,t[10]=p-g*d}else if(e.order==="XZY"){let p=a*l,u=a*c,m=o*l,g=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=p*d+g,t[5]=a*h,t[9]=u*d-m,t[2]=m*d-u,t[6]=o*h,t[10]=g*d+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(cp,e,hp)}lookAt(e,t,i){let n=this.elements;return Qt.subVectors(e,t),Qt.lengthSq()===0&&(Qt.z=1),Qt.normalize(),cn.crossVectors(i,Qt),cn.lengthSq()===0&&(Math.abs(i.z)===1?Qt.x+=1e-4:Qt.z+=1e-4,Qt.normalize(),cn.crossVectors(i,Qt)),cn.normalize(),ra.crossVectors(Qt,cn),n[0]=cn.x,n[4]=ra.x,n[8]=Qt.x,n[1]=cn.y,n[5]=ra.y,n[9]=Qt.y,n[2]=cn.z,n[6]=ra.z,n[10]=Qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],p=i[9],u=i[13],m=i[2],g=i[6],f=i[10],v=i[14],_=i[3],x=i[7],y=i[11],T=i[15],w=n[0],R=n[4],P=n[8],I=n[12],G=n[1],k=n[5],O=n[9],N=n[13],U=n[2],V=n[6],j=n[10],K=n[14],$=n[3],ue=n[7],Se=n[11],_e=n[15];return s[0]=a*w+o*G+l*U+c*$,s[4]=a*R+o*k+l*V+c*ue,s[8]=a*P+o*O+l*j+c*Se,s[12]=a*I+o*N+l*K+c*_e,s[1]=h*w+d*G+p*U+u*$,s[5]=h*R+d*k+p*V+u*ue,s[9]=h*P+d*O+p*j+u*Se,s[13]=h*I+d*N+p*K+u*_e,s[2]=m*w+g*G+f*U+v*$,s[6]=m*R+g*k+f*V+v*ue,s[10]=m*P+g*O+f*j+v*Se,s[14]=m*I+g*N+f*K+v*_e,s[3]=_*w+x*G+y*U+T*$,s[7]=_*R+x*k+y*V+T*ue,s[11]=_*P+x*O+y*j+T*Se,s[15]=_*I+x*N+y*K+T*_e,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],n=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],p=e[10],u=e[14];return e[3]*(+s*l*d-n*c*d-s*o*p+i*c*p+n*o*u-i*l*u)+e[7]*(+t*l*u-t*c*p+s*a*p-n*a*u+n*c*h-s*l*h)+e[11]*(+t*c*d-t*o*u-s*a*d+i*a*u+s*o*h-i*c*h)+e[15]*(-n*o*h-t*l*d+t*o*p+n*a*d-i*a*p+i*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],p=e[10],u=e[11],m=e[12],g=e[13],f=e[14],v=e[15],_=d*f*c-g*p*c+g*l*u-o*f*u-d*l*v+o*p*v,x=m*p*c-h*f*c-m*l*u+a*f*u+h*l*v-a*p*v,y=h*g*c-m*d*c+m*o*u-a*g*u-h*o*v+a*d*v,T=m*d*l-h*g*l-m*o*p+a*g*p+h*o*f-a*d*f,w=t*_+i*x+n*y+s*T;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/w;return e[0]=_*R,e[1]=(g*p*s-d*f*s-g*n*u+i*f*u+d*n*v-i*p*v)*R,e[2]=(o*f*s-g*l*s+g*n*c-i*f*c-o*n*v+i*l*v)*R,e[3]=(d*l*s-o*p*s-d*n*c+i*p*c+o*n*u-i*l*u)*R,e[4]=x*R,e[5]=(h*f*s-m*p*s+m*n*u-t*f*u-h*n*v+t*p*v)*R,e[6]=(m*l*s-a*f*s-m*n*c+t*f*c+a*n*v-t*l*v)*R,e[7]=(a*p*s-h*l*s+h*n*c-t*p*c-a*n*u+t*l*u)*R,e[8]=y*R,e[9]=(m*d*s-h*g*s-m*i*u+t*g*u+h*i*v-t*d*v)*R,e[10]=(a*g*s-m*o*s+m*i*c-t*g*c-a*i*v+t*o*v)*R,e[11]=(h*o*s-a*d*s-h*i*c+t*d*c+a*i*u-t*o*u)*R,e[12]=T*R,e[13]=(h*g*n-m*d*n+m*i*p-t*g*p-h*i*f+t*d*f)*R,e[14]=(m*o*n-a*g*n-m*i*l+t*g*l+a*i*f-t*o*f)*R,e[15]=(a*d*n-h*o*n+h*i*l-t*d*l-a*i*p+t*o*p)*R,this}scale(e){let t=this.elements,i=e.x,n=e.y,s=e.z;return t[0]*=i,t[4]*=n,t[8]*=s,t[1]*=i,t[5]*=n,t[9]*=s,t[2]*=i,t[6]*=n,t[10]*=s,t[3]*=i,t[7]*=n,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),n=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,s,a){return this.set(1,i,s,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){let n=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,d=o+o,p=s*c,u=s*h,m=s*d,g=a*h,f=a*d,v=o*d,_=l*c,x=l*h,y=l*d,T=i.x,w=i.y,R=i.z;return n[0]=(1-(g+v))*T,n[1]=(u+y)*T,n[2]=(m-x)*T,n[3]=0,n[4]=(u-y)*w,n[5]=(1-(p+v))*w,n[6]=(f+_)*w,n[7]=0,n[8]=(m+x)*R,n[9]=(f-_)*R,n[10]=(1-(p+g))*R,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){let n=this.elements,s=er.set(n[0],n[1],n[2]).length(),a=er.set(n[4],n[5],n[6]).length(),o=er.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),e.x=n[12],e.y=n[13],e.z=n[14],fi.copy(this);let l=1/s,c=1/a,h=1/o;return fi.elements[0]*=l,fi.elements[1]*=l,fi.elements[2]*=l,fi.elements[4]*=c,fi.elements[5]*=c,fi.elements[6]*=c,fi.elements[8]*=h,fi.elements[9]*=h,fi.elements[10]*=h,t.setFromRotationMatrix(fi),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,n,s,a,o=2e3,l=!1){let c=this.elements,h=2*s/(t-e),d=2*s/(i-n),p=(t+e)/(t-e),u=(i+n)/(i-n),m,g;if(l)m=s/(a-s),g=a*s/(a-s);else if(o===Ji)m=-(a+s)/(a-s),g=-2*a*s/(a-s);else{if(o!==us)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);m=-a/(a-s),g=-a*s/(a-s)}return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=d,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,n,s,a,o=2e3,l=!1){let c=this.elements,h=2/(t-e),d=2/(i-n),p=-(t+e)/(t-e),u=-(i+n)/(i-n),m,g;if(l)m=1/(a-s),g=a/(a-s);else if(o===Ji)m=-2/(a-s),g=-(a+s)/(a-s);else{if(o!==us)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);m=-1/(a-s),g=-s/(a-s)}return c[0]=h,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=d,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},er=new S,fi=new fe,cp=new S(0,0,0),hp=new S(1,1,1),cn=new S,ra=new S,Qt=new S,Ph=new fe,Ih=new $e,Fe=class r{constructor(e=0,t=0,i=0,n=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let n=e.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],d=n[2],p=n[6],u=n[10];switch(t){case"XYZ":this._y=Math.asin(Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ne(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(p,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Ph.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ph,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ih.setFromEuler(this),this.setFromQuaternion(Ih,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Fe.DEFAULT_ORDER="XYZ";var Mr=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},up=0,Lh=new S,tr=new $e,ji=new fe,sa=new S,Kr=new S,dp=new S,pp=new $e,Uh=new S(1,0,0),Dh=new S(0,1,0),Nh=new S(0,0,1),Fh={type:"added"},mp={type:"removed"},ir={type:"childadded",child:null},Sl={type:"childremoved",child:null},_t=class r extends Ki{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=Li(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new S,t=new Fe,i=new $e,n=new S(1,1,1);t._onChange(function(){i.setFromEuler(t,!1)}),i._onChange(function(){t.setFromQuaternion(i,void 0,!1)}),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new fe},normalMatrix:{value:new Le}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return tr.setFromAxisAngle(e,t),this.quaternion.multiply(tr),this}rotateOnWorldAxis(e,t){return tr.setFromAxisAngle(e,t),this.quaternion.premultiply(tr),this}rotateX(e){return this.rotateOnAxis(Uh,e)}rotateY(e){return this.rotateOnAxis(Dh,e)}rotateZ(e){return this.rotateOnAxis(Nh,e)}translateOnAxis(e,t){return Lh.copy(e).applyQuaternion(this.quaternion),this.position.add(Lh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Uh,e)}translateY(e){return this.translateOnAxis(Dh,e)}translateZ(e){return this.translateOnAxis(Nh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ji.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?sa.copy(e):sa.set(e,t,i);let n=this.parent;this.updateWorldMatrix(!0,!1),Kr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ji.lookAt(Kr,sa,this.up):ji.lookAt(sa,Kr,this.up),this.quaternion.setFromRotationMatrix(ji),n&&(ji.extractRotation(n.matrixWorld),tr.setFromRotationMatrix(ji),this.quaternion.premultiply(tr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fh),ir.child=e,this.dispatchEvent(ir),ir.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(mp),Sl.child=e,this.dispatchEvent(Sl),Sl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ji.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ji.multiply(e.parent.matrixWorld)),e.applyMatrix4(ji),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fh),ir.child=e,this.dispatchEvent(ir),ir.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){let s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Kr,e,dp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Kr,pp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let n={};function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON())),this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));n.material=o}else n.material=s(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];n.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),p=a(e.skeletons),u=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),p.length>0&&(i.skeletons=p),u.length>0&&(i.animations=u),m.length>0&&(i.nodes=m)}return i.object=n,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let n=e.children[i];this.add(n.clone())}return this}};_t.DEFAULT_UP=new S(0,1,0),_t.DEFAULT_MATRIX_AUTO_UPDATE=!0,_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var gi=new S,qi=new S,bl=new S,Yi=new S,nr=new S,rr=new S,Bh=new S,Tl=new S,wl=new S,El=new S,Al=new Ke,Cl=new Ke,Rl=new Ke,Pi=class r{constructor(e=new S,t=new S,i=new S){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),gi.subVectors(e,t),n.cross(gi);let s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(e,t,i,n,s){gi.subVectors(n,t),qi.subVectors(i,t),bl.subVectors(e,t);let a=gi.dot(gi),o=gi.dot(qi),l=gi.dot(bl),c=qi.dot(qi),h=qi.dot(bl),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;let p=1/d,u=(c*l-o*h)*p,m=(a*h-o*l)*p;return s.set(1-u-m,m,u)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,Yi)!==null&&Yi.x>=0&&Yi.y>=0&&Yi.x+Yi.y<=1}static getInterpolation(e,t,i,n,s,a,o,l){return this.getBarycoord(e,t,i,n,Yi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Yi.x),l.addScaledVector(a,Yi.y),l.addScaledVector(o,Yi.z),l)}static getInterpolatedAttribute(e,t,i,n,s,a){return Al.setScalar(0),Cl.setScalar(0),Rl.setScalar(0),Al.fromBufferAttribute(e,t),Cl.fromBufferAttribute(e,i),Rl.fromBufferAttribute(e,n),a.setScalar(0),a.addScaledVector(Al,s.x),a.addScaledVector(Cl,s.y),a.addScaledVector(Rl,s.z),a}static isFrontFacing(e,t,i,n){return gi.subVectors(i,t),qi.subVectors(e,t),gi.cross(qi).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gi.subVectors(this.c,this.b),qi.subVectors(this.a,this.b),.5*gi.cross(qi).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,s){return r.getInterpolation(e,this.a,this.b,this.c,t,i,n,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,n=this.b,s=this.c,a,o;nr.subVectors(n,i),rr.subVectors(s,i),Tl.subVectors(e,i);let l=nr.dot(Tl),c=rr.dot(Tl);if(l<=0&&c<=0)return t.copy(i);wl.subVectors(e,n);let h=nr.dot(wl),d=rr.dot(wl);if(h>=0&&d<=h)return t.copy(n);let p=l*d-h*c;if(p<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(nr,a);El.subVectors(e,s);let u=nr.dot(El),m=rr.dot(El);if(m>=0&&u<=m)return t.copy(s);let g=u*c-l*m;if(g<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(rr,o);let f=h*m-u*d;if(f<=0&&d-h>=0&&u-m>=0)return Bh.subVectors(s,n),o=(d-h)/(d-h+(u-m)),t.copy(n).addScaledVector(Bh,o);let v=1/(f+g+p);return a=g*v,o=p*v,t.copy(i).addScaledVector(nr,a).addScaledVector(rr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Qu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hn={h:0,s:0,l:0},aa={h:0,s:0,l:0};function Pl(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+6*(e-r)*t:t<.5?e:t<2/3?r+6*(e-r)*(2/3-t):r}var me=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,i,n=Je.workingColorSpace){return this.r=e,this.g=t,this.b=i,Je.colorSpaceToWorking(this,n),this}setHSL(e,t,i,n=Je.workingColorSpace){if(e=Xl(e,1),t=Ne(t,0,1),i=Ne(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Pl(a,s,e+1/3),this.g=Pl(a,s,e),this.b=Pl(a,s,e-1/3)}return Je.colorSpaceToWorking(this,n),this}setStyle(e,t=xt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=xt){let i=Qu[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zi(e.r),this.g=Zi(e.g),this.b=Zi(e.b),this}copyLinearToSRGB(e){return this.r=mr(e.r),this.g=mr(e.g),this.b=mr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=xt){return Je.workingToColorSpace(Ot.copy(this),e),65536*Math.round(Ne(255*Ot.r,0,255))+256*Math.round(Ne(255*Ot.g,0,255))+Math.round(Ne(255*Ot.b,0,255))}getHexString(e=xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(Ot.copy(this),t);let i=Ot.r,n=Ot.g,s=Ot.b,a=Math.max(i,n,s),o=Math.min(i,n,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case i:l=(n-s)/d+(n<s?6:0);break;case n:l=(s-i)/d+2;break;case s:l=(i-n)/d+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(Ot.copy(this),t),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e=xt){Je.workingToColorSpace(Ot.copy(this),e);let t=Ot.r,i=Ot.g,n=Ot.b;return e!==xt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*i)},${Math.round(255*n)})`}offsetHSL(e,t,i){return this.getHSL(hn),this.setHSL(hn.h+e,hn.s+t,hn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(hn),e.getHSL(aa);let i=as(hn.h,aa.h,t),n=as(hn.s,aa.s,t),s=as(hn.l,aa.l,t);return this.setHSL(i,n,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,n=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*n,this.g=s[1]*t+s[4]*i+s[7]*n,this.b=s[2]*t+s[5]*i+s[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ot=new me;me.NAMES=Qu;var fp=0,_i=class extends Ki{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fp++}),this.uuid=Li(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new me(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ln,this.stencilZFail=Ln,this.stencilZPass=Ln,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let n=this[t];n!==void 0?n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};function n(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(i.blending=this.blending),this.side!==0&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==204&&(i.blendSrc=this.blendSrc),this.blendDst!==205&&(i.blendDst=this.blendDst),this.blendEquation!==100&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ln&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ln&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ln&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData),t){let s=n(e.textures),a=n(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let n=t.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},je=class extends _i{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fe,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Kf=gp();function gp(){let r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),i=new Uint32Array(512),n=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(i[l]=0,i[256|l]=32768,n[l]=24,n[256|l]=24):c<-14?(i[l]=1024>>-c-14,i[256|l]=1024>>-c-14|32768,n[l]=-c-1,n[256|l]=-c-1):c<=15?(i[l]=c+15<<10,i[256|l]=c+15<<10|32768,n[l]=13,n[256|l]=13):c<128?(i[l]=31744,i[256|l]=64512,n[l]=24,n[256|l]=24):(i[l]=31744,i[256|l]=64512,n[l]=13,n[256|l]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(8388608&c);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:n,mantissaTable:s,exponentTable:a,offsetTable:o}}var St=new S,oa=new J,vp=0,ke=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ua,this.updateRanges=[],this.gpuType=yi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)oa.fromBufferAttribute(this,t),oa.applyMatrix3(e),this.setXY(t,oa.x,oa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix3(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=vi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=nt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=vi(t,this.array)),t}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=vi(t,this.array)),t}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=vi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=vi(t,this.array)),t}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),i=nt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),i=nt(i,this.array),n=nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e*=this.itemSize,this.normalized&&(t=nt(t,this.array),i=nt(i,this.array),n=nt(n,this.array),s=nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ua&&(e.usage=this.usage),e}};var ps=class extends ke{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var ms=class extends ke{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var ge=class extends ke{constructor(e,t,i){super(new Float32Array(e),t,i)}},_p=0,ai=new fe,Il=new _t,sr=new S,ei=new Zt,$r=new Zt,At=new S,Ue=class r extends Ki{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_p++}),this.uuid=Li(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kc(e)?ms:ps)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Le().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ai.makeRotationFromQuaternion(e),this.applyMatrix4(ai),this}rotateX(e){return ai.makeRotationX(e),this.applyMatrix4(ai),this}rotateY(e){return ai.makeRotationY(e),this.applyMatrix4(ai),this}rotateZ(e){return ai.makeRotationZ(e),this.applyMatrix4(ai),this}translate(e,t,i){return ai.makeTranslation(e,t,i),this.applyMatrix4(ai),this}scale(e,t,i){return ai.makeScale(e,t,i),this.applyMatrix4(ai),this}lookAt(e){return Il.lookAt(e),Il.updateMatrix(),this.applyMatrix4(Il.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(sr).negate(),this.translate(sr.x,sr.y,sr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let n=0,s=e.length;n<s;n++){let a=e[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ge(i,3))}else{let i=Math.min(e.length,t.count);for(let n=0;n<i;n++){let s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),void this.boundingBox.set(new S(-1/0,-1/0,-1/0),new S(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){let s=t[i];ei.setFromBufferAttribute(s),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,ei.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,ei.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(ei.min),this.boundingBox.expandByPoint(ei.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new oi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),void this.boundingSphere.set(new S,1/0);if(e){let i=this.boundingSphere.center;if(ei.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];$r.setFromBufferAttribute(o),this.morphTargetsRelative?(At.addVectors(ei.min,$r.min),ei.expandByPoint(At),At.addVectors(ei.max,$r.max),ei.expandByPoint(At)):(ei.expandByPoint($r.min),ei.expandByPoint($r.max))}ei.getCenter(i);let n=0;for(let s=0,a=e.count;s<a;s++)At.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(At));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)At.fromBufferAttribute(o,c),l&&(sr.fromBufferAttribute(e,c),At.add(sr)),n=Math.max(n,i.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let i=t.position,n=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ke(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let P=0;P<i.count;P++)o[P]=new S,l[P]=new S;let c=new S,h=new S,d=new S,p=new J,u=new J,m=new J,g=new S,f=new S;function v(P,I,G){c.fromBufferAttribute(i,P),h.fromBufferAttribute(i,I),d.fromBufferAttribute(i,G),p.fromBufferAttribute(s,P),u.fromBufferAttribute(s,I),m.fromBufferAttribute(s,G),h.sub(c),d.sub(c),u.sub(p),m.sub(p);let k=1/(u.x*m.y-m.x*u.y);isFinite(k)&&(g.copy(h).multiplyScalar(m.y).addScaledVector(d,-u.y).multiplyScalar(k),f.copy(d).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(k),o[P].add(g),o[I].add(g),o[G].add(g),l[P].add(f),l[I].add(f),l[G].add(f))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let P=0,I=_.length;P<I;++P){let G=_[P],k=G.start;for(let O=k,N=k+G.count;O<N;O+=3)v(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let x=new S,y=new S,T=new S,w=new S;function R(P){T.fromBufferAttribute(n,P),w.copy(T);let I=o[P];x.copy(I),x.sub(T.multiplyScalar(T.dot(I))).normalize(),y.crossVectors(w,I);let G=y.dot(l[P])<0?-1:1;a.setXYZW(P,x.x,x.y,x.z,G)}for(let P=0,I=_.length;P<I;++P){let G=_[P],k=G.start;for(let O=k,N=k+G.count;O<N;O+=3)R(e.getX(O+0)),R(e.getX(O+1)),R(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ke(new Float32Array(3*t.count),3),this.setAttribute("normal",i);else for(let p=0,u=i.count;p<u;p++)i.setXYZ(p,0,0,0);let n=new S,s=new S,a=new S,o=new S,l=new S,c=new S,h=new S,d=new S;if(e)for(let p=0,u=e.count;p<u;p+=3){let m=e.getX(p+0),g=e.getX(p+1),f=e.getX(p+2);n.fromBufferAttribute(t,m),s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,f),h.subVectors(a,s),d.subVectors(n,s),h.cross(d),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,f),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(f,c.x,c.y,c.z)}else for(let p=0,u=t.count;p<u;p+=3)n.fromBufferAttribute(t,p+0),s.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),h.subVectors(a,s),d.subVectors(n,s),h.cross(d),i.setXYZ(p+0,h.x,h.y,h.z),i.setXYZ(p+1,h.x,h.y,h.z),i.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)At.fromBufferAttribute(e,t),At.normalize(),e.setXYZ(t,At.x,At.y,At.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,p=new c.constructor(l.length*h),u=0,m=0;for(let g=0,f=l.length;g<f;g++){u=o.isInterleavedBufferAttribute?l[g]*o.data.stride+o.offset:l[g]*h;for(let v=0;v<h;v++)p[m++]=c[u++]}return new ke(p,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,i=this.index.array,n=this.attributes;for(let o in n){let l=e(n[o],i);t.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,d=c.length;h<d;h++){let p=e(c[h],i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let n={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,p=c.length;d<p;d++){let u=c[d];h.push(u.toJSON(e.data))}h.length>0&&(n[l]=h,s=!0)}s&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let n=e.attributes;for(let c in n){let h=n[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],d=s[c];for(let p=0,u=d.length;p<u;p++)h.push(d[p].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Oh=new fe,Pn=new mn,la=new oi,zh=new S,ca=new S,ha=new S,ua=new S,Ll=new S,da=new S,Gh=new S,pa=new S,re=class extends _t{constructor(e=new Ue,t=new je){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}getVertexPosition(e,t){let i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);let o=this.morphTargetInfluences;if(s&&o){da.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],d=s[l];h!==0&&(Ll.fromBufferAttribute(d,e),a?da.addScaledVector(Ll,h):da.addScaledVector(Ll.sub(t),h))}t.add(da)}return t}raycast(e,t){let i=this.geometry,n=this.material,s=this.matrixWorld;if(n!==void 0){if(i.boundingSphere===null&&i.computeBoundingSphere(),la.copy(i.boundingSphere),la.applyMatrix4(s),Pn.copy(e.ray).recast(e.near),la.containsPoint(Pn.origin)===!1&&(Pn.intersectSphere(la,zh)===null||Pn.origin.distanceToSquared(zh)>(e.far-e.near)**2))return;Oh.copy(s).invert(),Pn.copy(e.ray).applyMatrix4(Oh),i.boundingBox!==null&&Pn.intersectsBox(i.boundingBox)===!1||this._computeIntersections(e,t,Pn)}}_computeIntersections(e,t,i){let n,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,p=s.groups,u=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,g=p.length;m<g;m++){let f=p[m],v=a[f.materialIndex];for(let _=Math.max(f.start,u.start),x=Math.min(o.count,Math.min(f.start+f.count,u.start+u.count));_<x;_+=3)n=ma(this,v,e,i,c,h,d,o.getX(_),o.getX(_+1),o.getX(_+2)),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=f.materialIndex,t.push(n))}else for(let m=Math.max(0,u.start),g=Math.min(o.count,u.start+u.count);m<g;m+=3)n=ma(this,a,e,i,c,h,d,o.getX(m),o.getX(m+1),o.getX(m+2)),n&&(n.faceIndex=Math.floor(m/3),t.push(n));else if(l!==void 0)if(Array.isArray(a))for(let m=0,g=p.length;m<g;m++){let f=p[m],v=a[f.materialIndex];for(let _=Math.max(f.start,u.start),x=Math.min(l.count,Math.min(f.start+f.count,u.start+u.count));_<x;_+=3)n=ma(this,v,e,i,c,h,d,_,_+1,_+2),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=f.materialIndex,t.push(n))}else for(let m=Math.max(0,u.start),g=Math.min(l.count,u.start+u.count);m<g;m+=3)n=ma(this,a,e,i,c,h,d,m,m+1,m+2),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}};function ma(r,e,t,i,n,s,a,o,l,c){r.getVertexPosition(o,ca),r.getVertexPosition(l,ha),r.getVertexPosition(c,ua);let h=(function(d,p,u,m,g,f,v,_){let x;if(x=p.side===1?m.intersectTriangle(v,f,g,!0,_):m.intersectTriangle(g,f,v,p.side===0,_),x===null)return null;pa.copy(_),pa.applyMatrix4(d.matrixWorld);let y=u.ray.origin.distanceTo(pa);return y<u.near||y>u.far?null:{distance:y,point:pa.clone(),object:d}})(r,e,t,i,ca,ha,ua,Gh);if(h){let d=new S;Pi.getBarycoord(Gh,ca,ha,ua,d),n&&(h.uv=Pi.getInterpolatedAttribute(n,o,l,c,d,new J)),s&&(h.uv1=Pi.getInterpolatedAttribute(s,o,l,c,d,new J)),a&&(h.normal=Pi.getInterpolatedAttribute(a,o,l,c,d,new S),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let p={a:o,b:l,c,normal:new S,materialIndex:0};Pi.getNormal(ca,ha,ua,p.normal),h.face=p,h.barycoord=d}return h}var qe=class r extends Ue{constructor(e=1,t=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};let o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],d=[],p=0,u=0;function m(g,f,v,_,x,y,T,w,R,P,I){let G=y/R,k=T/P,O=y/2,N=T/2,U=w/2,V=R+1,j=P+1,K=0,$=0,ue=new S;for(let Se=0;Se<j;Se++){let _e=Se*k-N;for(let Ae=0;Ae<V;Ae++){let ne=Ae*G-O;ue[g]=ne*_,ue[f]=_e*x,ue[v]=U,c.push(ue.x,ue.y,ue.z),ue[g]=0,ue[f]=0,ue[v]=w>0?1:-1,h.push(ue.x,ue.y,ue.z),d.push(Ae/R),d.push(1-Se/P),K+=1}}for(let Se=0;Se<P;Se++)for(let _e=0;_e<R;_e++){let Ae=p+_e+V*Se,ne=p+_e+V*(Se+1),ae=p+(_e+1)+V*(Se+1),se=p+(_e+1)+V*Se;l.push(Ae,ne,se),l.push(ne,ae,se),$+=6}o.addGroup(u,$,I),u+=$,p+=K}m("z","y","x",-1,-1,i,t,e,a,s,0),m("z","y","x",1,-1,i,t,-e,a,s,1),m("x","z","y",1,1,e,i,t,n,a,2),m("x","z","y",1,-1,e,i,-t,n,a,3),m("x","y","z",1,-1,e,t,i,n,s,4),m("x","y","z",-1,-1,e,t,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new ge(c,3)),this.setAttribute("normal",new ge(h,3)),this.setAttribute("uv",new ge(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Gn(r){let e={};for(let t in r){e[t]={};for(let i in r[t]){let n=r[t][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone():Array.isArray(n)?e[t][i]=n.slice():e[t][i]=n}}return e}function Vt(r){let e={};for(let t=0;t<r.length;t++){let i=Gn(r[t]);for(let n in i)e[n]=i[n]}return e}function Vc(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var ed={clone:Gn,merge:Vt},st=class extends _i{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Gn(e.uniforms),this.uniformsGroups=(function(t){let i=[];for(let n=0;n<t.length;n++)i.push(t[n].clone());return i})(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let s=this.uniforms[n].value;s&&s.isTexture?t.uniforms[n]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[n]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[n]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[n]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[n]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[n]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[n]={type:"m4",value:s.toArray()}:t.uniforms[n]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Sr=class extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=Ji,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},un=new S,kh=new J,Vh=new J,Lt=class extends Sr{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*vr*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*pr*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*vr*Math.atan(Math.tan(.5*pr*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(un.x,un.y).multiplyScalar(-e/un.z),un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(un.x,un.y).multiplyScalar(-e/un.z)}getViewSize(e,t){return this.getViewBounds(e,kh,Vh),t.subVectors(Vh,kh)}setViewOffset(e,t,i,n,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*pr*this.fov)/this.zoom,i=2*t,n=this.aspect*i,s=-.5*n,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*n/l,t-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ar=-90,Ba=class extends _t{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let n=new Lt(ar,1,e,t);n.layers=this.layers,this.add(n);let s=new Lt(ar,1,e,t);s.layers=this.layers,this.add(s);let a=new Lt(ar,1,e,t);a.layers=this.layers,this.add(a);let o=new Lt(ar,1,e,t);o.layers=this.layers,this.add(o);let l=new Lt(ar,1,e,t);l.layers=this.layers,this.add(l);let c=new Lt(ar,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,n,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===Ji)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==us)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,d=e.getRenderTarget(),p=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,n),e.render(t,s),e.setRenderTarget(i,1,n),e.render(t,a),e.setRenderTarget(i,2,n),e.render(t,o),e.setRenderTarget(i,3,n),e.render(t,l),e.setRenderTarget(i,4,n),e.render(t,c),i.texture.generateMipmaps=g,e.setRenderTarget(i,5,n),e.render(t,h),e.setRenderTarget(d,p,u),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},fs=class extends zt{constructor(e=[],t=301,i,n,s,a,o,l,c,h){super(e,t,i,n,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Oa=class extends Ni{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new fs(n),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new qe(5,5,5),s=new st({name:"CubemapFromEquirect",uniforms:Gn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;let a=new re(n,s),o=t.minFilter;return t.minFilter===Bn&&(t.minFilter=Di),new Ba(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,n=!0){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(s)}},Ee=class extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}},xp={type:"move"},br=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ee,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ee,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new S,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new S),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ee,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new S,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new S),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let g of e.hand.values()){let f=t.getJointPose(g,i),v=this._getHandJoint(c,g);f!==null&&(v.matrix.fromArray(f.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=f.radius),v.visible=f!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],p=h.position.distanceTo(d.position),u=.02,m=.005;c.inputState.pinching&&p>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(xp)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Ee;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}};var fn=class extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fe,this.environmentIntensity=1,this.environmentRotation=new Fe,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},gs=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ua,this.updateRanges=[],this.version=0,this.uuid=Li()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,s=this.stride;n<s;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Li()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Li()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Ht=new S,Tr=class r{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=vi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=nt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=nt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=vi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=vi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=vi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=vi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),i=nt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),i=nt(i,this.array),n=nt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=nt(t,this.array),i=nt(i,this.array),n=nt(n,this.array),s=nt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return new ke(new this.array.constructor(t),this.itemSize,this.normalized)}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Gt=class extends _i{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new me(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},or,Qr=new S,lr=new S,cr=new S,hr=new J,es=new J,td=new fe,fa=new S,ts=new S,ga=new S,Hh=new J,Ul=new J,Wh=new J,Wt=class extends _t{constructor(e=new Gt){if(super(),this.isSprite=!0,this.type="Sprite",or===void 0){or=new Ue;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new gs(t,5);or.setIndex([0,1,2,0,2,3]),or.setAttribute("position",new Tr(i,3,0,!1)),or.setAttribute("uv",new Tr(i,2,3,!1))}this.geometry=or,this.material=e,this.center=new J(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),lr.setFromMatrixScale(this.matrixWorld),td.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),cr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&lr.multiplyScalar(-cr.z);let i=this.material.rotation,n,s;i!==0&&(s=Math.cos(i),n=Math.sin(i));let a=this.center;va(fa.set(-.5,-.5,0),cr,a,lr,n,s),va(ts.set(.5,-.5,0),cr,a,lr,n,s),va(ga.set(.5,.5,0),cr,a,lr,n,s),Hh.set(0,0),Ul.set(1,0),Wh.set(1,1);let o=e.ray.intersectTriangle(fa,ts,ga,!1,Qr);if(o===null&&(va(ts.set(-.5,.5,0),cr,a,lr,n,s),Ul.set(0,1),o=e.ray.intersectTriangle(fa,ga,ts,!1,Qr),o===null))return;let l=e.ray.origin.distanceTo(Qr);l<e.near||l>e.far||t.push({distance:l,point:Qr.clone(),uv:Pi.getInterpolation(Qr,fa,ts,ga,Hh,Ul,Wh,new J),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function va(r,e,t,i,n,s){hr.subVectors(r,t).addScalar(.5).multiply(i),n!==void 0?(es.x=s*hr.x-n*hr.y,es.y=n*hr.x+s*hr.y):es.copy(hr),r.copy(e),r.x+=es.x,r.y+=es.y,r.applyMatrix4(td)}var $f=new S,Qf=new S;var eg=new S,tg=new Ke,ig=new Ke,ng=new S,rg=new fe,sg=new S,ag=new oi,og=new fe,lg=new mn;var za=class extends zt{constructor(e=null,t=1,i=1,n,s,a,o,l,c=1003,h=1003,d,p){super(null,a,o,l,c,h,n,s,d,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},cg=new fe,hg=new fe;var wr=class extends ke{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ur=new fe,Xh=new fe,_a=[],jh=new Zt,yp=new fe,is=new re,ns=new oi,Ct=class extends re{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new wr(new Float32Array(16*i),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,yp)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Zt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ur),jh.copy(e.boundingBox).applyMatrix4(ur),this.boundingBox.union(jh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new oi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ur),ns.copy(e.boundingSphere).applyMatrix4(ur),this.boundingSphere.union(ns)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,3*e)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,16*e)}getMorphAt(e,t){let i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,s=e*(i.length+1)+1;for(let a=0;a<i.length;a++)i[a]=n[s+a]}raycast(e,t){let i=this.matrixWorld,n=this.count;if(is.geometry=this.geometry,is.material=this.material,is.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ns.copy(this.boundingSphere),ns.applyMatrix4(i),e.ray.intersectsSphere(ns)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,ur),Xh.multiplyMatrices(i,ur),is.matrixWorld=Xh,is.raycast(e,_a);for(let a=0,o=_a.length;a<o;a++){let l=_a[a];l.instanceId=s,l.object=this,t.push(l)}_a.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new wr(new Float32Array(3*this.instanceMatrix.count).fill(1),3)),t.toArray(this.instanceColor.array,3*e)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,16*e)}setMorphAt(e,t){let i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new za(new Float32Array(n*this.count),n,this.count,Ro,yi));let s=this.morphTexture.source.data.data,a=0;for(let c=0;c<i.length;c++)a+=i[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=n*e;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Dl=new S,Mp=new S,Sp=new Le,Ri=class{constructor(e=new S(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let n=Dl.subVectors(i,t).cross(Mp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Dl),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Sp.getNormalMatrix(e),n=this.coplanarPoint(Dl).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},In=new oi,bp=new J(.5,.5),xa=new S,gn=class{constructor(e=new Ri,t=new Ri,i=new Ri,n=new Ri,s=new Ri,a=new Ri){this.planes=[e,t,i,n,s,a]}set(e,t,i,n,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3,i=!1){let n=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],d=s[5],p=s[6],u=s[7],m=s[8],g=s[9],f=s[10],v=s[11],_=s[12],x=s[13],y=s[14],T=s[15];if(n[0].setComponents(c-a,u-h,v-m,T-_).normalize(),n[1].setComponents(c+a,u+h,v+m,T+_).normalize(),n[2].setComponents(c+o,u+d,v+g,T+x).normalize(),n[3].setComponents(c-o,u-d,v-g,T-x).normalize(),i)n[4].setComponents(l,p,f,y).normalize(),n[5].setComponents(c-l,u-p,v-f,T-y).normalize();else if(n[4].setComponents(c-l,u-p,v-f,T-y).normalize(),t===Ji)n[5].setComponents(c+l,u+p,v+f,T+y).normalize();else{if(t!==us)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);n[5].setComponents(l,p,f,y).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),In.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),In.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(In)}intersectsSprite(e){In.center.set(0,0,0);let t=bp.distanceTo(e.center);return In.radius=.7071067811865476+t,In.applyMatrix4(e.matrixWorld),this.intersectsSphere(In)}intersectsSphere(e){let t=this.planes,i=e.center,n=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let n=t[i];if(xa.x=n.normal.x>0?e.max.x:e.min.x,xa.y=n.normal.y>0?e.max.y:e.min.y,xa.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(xa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ai=new fe,Ci=new gn,Ga=class r{constructor(){this.coordinateSystem=Ji}intersectsObject(e,t){if(!t.isArrayCamera||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Ai.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Ci.setFromProjectionMatrix(Ai,n.coordinateSystem,n.reversedDepth),Ci.intersectsObject(e))return!0}return!1}intersectsSprite(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Ai.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Ci.setFromProjectionMatrix(Ai,n.coordinateSystem,n.reversedDepth),Ci.intersectsSprite(e))return!0}return!1}intersectsSphere(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Ai.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Ci.setFromProjectionMatrix(Ai,n.coordinateSystem,n.reversedDepth),Ci.intersectsSphere(e))return!0}return!1}intersectsBox(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Ai.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Ci.setFromProjectionMatrix(Ai,n.coordinateSystem,n.reversedDepth),Ci.intersectsBox(e))return!0}return!1}containsPoint(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Ai.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Ci.setFromProjectionMatrix(Ai,n.coordinateSystem,n.reversedDepth),Ci.containsPoint(e))return!0}return!1}clone(){return new r}};var jl=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,i,n){let s=this.pool,a=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let o=s[this.index];a.push(o),this.index++,o.start=e,o.count=t,o.z=i,o.index=n}reset(){this.list.length=0,this.index=0}},ug=new fe,dg=new me(1,1,1),pg=new gn,mg=new Ga,fg=new Zt,gg=new oi,vg=new S,_g=new S,xg=new S,yg=new jl,Mg=new re;var Sg=new S,bg=new S,Tg=new fe,wg=new mn,Eg=new oi,Ag=new S,Cg=new S;var Rg=new S,Pg=new S;var ka=class extends _i{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},qh=new fe,ql=new mn,ya=new oi,Ma=new S,$i=class extends _t{constructor(e=new Ue,t=new ka){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,n=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ya.copy(i.boundingSphere),ya.applyMatrix4(n),ya.radius+=s,e.ray.intersectsSphere(ya)===!1)return;qh.copy(n).invert(),ql.copy(e.ray).applyMatrix4(qh);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null)for(let d=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);d<p;d++){let u=c.getX(d);Ma.fromBufferAttribute(h,u),Yh(Ma,u,l,n,e,t,this)}else for(let d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);d<p;d++)Ma.fromBufferAttribute(h,d),Yh(Ma,d,l,n,e,t,this)}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}};function Yh(r,e,t,i,n,s,a){let o=ql.distanceSqToPoint(r);if(o<t){let l=new S;ql.closestPointToPoint(r,l),l.applyMatrix4(i);let c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var xi=class extends zt{constructor(e,t,i,n,s,a,o,l,c){super(e,t,i,n,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},vs=class extends zt{constructor(e,t,i=1014,n,s,a,o=1003,l=1003,c,h=1026,d=1){if(h!==zs&&h!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super({width:e,height:t,depth:d},n,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new yr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},_s=class extends zt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Er=class r extends Ue{constructor(e=1,t=1,i=4,n=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:n,heightSegments:s},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),n=Math.max(3,Math.floor(n)),s=Math.max(1,Math.floor(s));let a=[],o=[],l=[],c=[],h=t/2,d=Math.PI/2*e,p=t,u=2*d+p,m=2*i+s,g=n+1,f=new S,v=new S;for(let _=0;_<=m;_++){let x=0,y=0,T=0,w=0;if(_<=i){let I=_/i,G=I*Math.PI/2;y=-h-e*Math.cos(G),T=e*Math.sin(G),w=-e*Math.cos(G),x=I*d}else if(_<=i+s){let I=(_-i)/s;y=I*t-h,T=e,w=0,x=d+I*p}else{let I=(_-i-s)/i,G=I*Math.PI/2;y=h+e*Math.sin(G),T=e*Math.cos(G),w=e*Math.sin(G),x=d+p+I*d}let R=Math.max(0,Math.min(1,x/u)),P=0;_===0?P=.5/n:_===m&&(P=-.5/n);for(let I=0;I<=n;I++){let G=I/n,k=G*Math.PI*2,O=Math.sin(k),N=Math.cos(k);v.x=-T*N,v.y=y,v.z=T*O,o.push(v.x,v.y,v.z),f.set(-T*N,w,T*O),f.normalize(),l.push(f.x,f.y,f.z),c.push(G+P,R)}if(_>0){let I=(_-1)*g;for(let G=0;G<n;G++){let k=I+G,O=I+G+1,N=_*g+G,U=_*g+G+1;a.push(k,O,N),a.push(O,U,N)}}}this.setIndex(a),this.setAttribute("position",new ge(o,3)),this.setAttribute("normal",new ge(l,3)),this.setAttribute("uv",new ge(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},Ar=class r extends Ue{constructor(e=1,t=32,i=0,n=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);let s=[],a=[],o=[],l=[],c=new S,h=new J;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,p=3;d<=t;d++,p+=3){let u=i+d/t*n;c.x=e*Math.cos(u),c.y=e*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[p]/e+1)/2,h.y=(a[p+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new ge(a,3)),this.setAttribute("normal",new ge(o,3)),this.setAttribute("uv",new ge(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Me=class r extends Ue{constructor(e=1,t=1,i=1,n=32,s=1,a=!1,o=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;n=Math.floor(n),s=Math.floor(s);let h=[],d=[],p=[],u=[],m=0,g=[],f=i/2,v=0;function _(x){let y=m,T=new J,w=new S,R=0,P=x===!0?e:t,I=x===!0?1:-1;for(let k=1;k<=n;k++)d.push(0,f*I,0),p.push(0,I,0),u.push(.5,.5),m++;let G=m;for(let k=0;k<=n;k++){let O=k/n*l+o,N=Math.cos(O),U=Math.sin(O);w.x=P*U,w.y=f*I,w.z=P*N,d.push(w.x,w.y,w.z),p.push(0,I,0),T.x=.5*N+.5,T.y=.5*U*I+.5,u.push(T.x,T.y),m++}for(let k=0;k<n;k++){let O=y+k,N=G+k;x===!0?h.push(N,N+1,O):h.push(N+1,N,O),R+=3}c.addGroup(v,R,x===!0?1:2),v+=R}(function(){let x=new S,y=new S,T=0,w=(t-e)/i;for(let R=0;R<=s;R++){let P=[],I=R/s,G=I*(t-e)+e;for(let k=0;k<=n;k++){let O=k/n,N=O*l+o,U=Math.sin(N),V=Math.cos(N);y.x=G*U,y.y=-I*i+f,y.z=G*V,d.push(y.x,y.y,y.z),x.set(U,w,V).normalize(),p.push(x.x,x.y,x.z),u.push(O,1-I),P.push(m++)}g.push(P)}for(let R=0;R<n;R++)for(let P=0;P<s;P++){let I=g[P][R],G=g[P+1][R],k=g[P+1][R+1],O=g[P][R+1];(e>0||P!==0)&&(h.push(I,G,O),T+=3),(t>0||P!==s-1)&&(h.push(G,k,O),T+=3)}c.addGroup(v,T,0),v+=T})(),a===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new ge(d,3)),this.setAttribute("normal",new ge(p,3)),this.setAttribute("uv",new ge(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},li=class r extends Me{constructor(e=1,t=1,i=32,n=1,s=!1,a=0,o=2*Math.PI){super(0,e,t,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},vn=class r extends Ue{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};let s=[],a=[];function o(u,m,g,f){let v=f+1,_=[];for(let x=0;x<=v;x++){_[x]=[];let y=u.clone().lerp(g,x/v),T=m.clone().lerp(g,x/v),w=v-x;for(let R=0;R<=w;R++)_[x][R]=R===0&&x===v?y:y.clone().lerp(T,R/w)}for(let x=0;x<v;x++)for(let y=0;y<2*(v-x)-1;y++){let T=Math.floor(y/2);y%2==0?(l(_[x][T+1]),l(_[x+1][T]),l(_[x][T])):(l(_[x][T+1]),l(_[x+1][T+1]),l(_[x+1][T]))}}function l(u){s.push(u.x,u.y,u.z)}function c(u,m){let g=3*u;m.x=e[g+0],m.y=e[g+1],m.z=e[g+2]}function h(u,m,g,f){f<0&&u.x===1&&(a[m]=u.x-1),g.x===0&&g.z===0&&(a[m]=f/2/Math.PI+.5)}function d(u){return Math.atan2(u.z,-u.x)}function p(u){return Math.atan2(-u.y,Math.sqrt(u.x*u.x+u.z*u.z))}(function(u){let m=new S,g=new S,f=new S;for(let v=0;v<t.length;v+=3)c(t[v+0],m),c(t[v+1],g),c(t[v+2],f),o(m,g,f,u)})(n),(function(u){let m=new S;for(let g=0;g<s.length;g+=3)m.x=s[g+0],m.y=s[g+1],m.z=s[g+2],m.normalize().multiplyScalar(u),s[g+0]=m.x,s[g+1]=m.y,s[g+2]=m.z})(i),(function(){let u=new S;for(let m=0;m<s.length;m+=3){u.x=s[m+0],u.y=s[m+1],u.z=s[m+2];let g=d(u)/2/Math.PI+.5,f=p(u)/Math.PI+.5;a.push(g,1-f)}(function(){let m=new S,g=new S,f=new S,v=new S,_=new J,x=new J,y=new J;for(let T=0,w=0;T<s.length;T+=9,w+=6){m.set(s[T+0],s[T+1],s[T+2]),g.set(s[T+3],s[T+4],s[T+5]),f.set(s[T+6],s[T+7],s[T+8]),_.set(a[w+0],a[w+1]),x.set(a[w+2],a[w+3]),y.set(a[w+4],a[w+5]),v.copy(m).add(g).add(f).divideScalar(3);let R=d(v);h(_,w+0,m,R),h(x,w+2,g,R),h(y,w+4,f,R)}})(),(function(){for(let m=0;m<a.length;m+=6){let g=a[m+0],f=a[m+2],v=a[m+4],_=Math.max(g,f,v),x=Math.min(g,f,v);_>.9&&x<.1&&(g<.2&&(a[m+0]+=1),f<.2&&(a[m+2]+=1),v<.2&&(a[m+4]+=1))}})()})(),this.setAttribute("position",new ge(s,3)),this.setAttribute("normal",new ge(s.slice(),3)),this.setAttribute("uv",new ge(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},Va=class r extends vn{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,n=1/i;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Sa=new S,ba=new S,Nl=new S,Ta=new Pi,Ha=class extends Ue{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let n=Math.pow(10,4),s=Math.cos(pr*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),p={},u=[];for(let m=0;m<l;m+=3){a?(c[0]=a.getX(m),c[1]=a.getX(m+1),c[2]=a.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);let{a:g,b:f,c:v}=Ta;if(g.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),v.fromBufferAttribute(o,c[2]),Ta.getNormal(Nl),d[0]=`${Math.round(g.x*n)},${Math.round(g.y*n)},${Math.round(g.z*n)}`,d[1]=`${Math.round(f.x*n)},${Math.round(f.y*n)},${Math.round(f.z*n)}`,d[2]=`${Math.round(v.x*n)},${Math.round(v.y*n)},${Math.round(v.z*n)}`,d[0]!==d[1]&&d[1]!==d[2]&&d[2]!==d[0])for(let _=0;_<3;_++){let x=(_+1)%3,y=d[_],T=d[x],w=Ta[h[_]],R=Ta[h[x]],P=`${y}_${T}`,I=`${T}_${y}`;I in p&&p[I]?(Nl.dot(p[I].normal)<=s&&(u.push(w.x,w.y,w.z),u.push(R.x,R.y,R.z)),p[I]=null):P in p||(p[P]={index0:c[_],index1:c[x],normal:Nl.clone()})}}for(let m in p)if(p[m]){let{index0:g,index1:f}=p[m];Sa.fromBufferAttribute(o,g),ba.fromBufferAttribute(o,f),u.push(Sa.x,Sa.y,Sa.z),u.push(ba.x,ba.y,ba.z)}this.setAttribute("position",new ge(u,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},ii=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,n=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(n),t.push(s),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),n=0,s=i.length,a;a=t||e*i[s-1];let o,l=0,c=s-1;for(;l<=c;)if(n=Math.floor(l+(c-l)/2),o=i[n]-a,o<0)l=n+1;else{if(!(o>0)){c=n;break}c=n-1}if(n=c,i[n]===a)return n/(s-1);let h=i[n];return(n+(a-h)/(i[n+1]-h))/(s-1)}getTangent(e,t){let n=e-1e-4,s=e+1e-4;n<0&&(n=0),s>1&&(s=1);let a=this.getPoint(n),o=this.getPoint(s),l=t||(a.isVector2?new J:new S);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new S,n=[],s=[],a=[],o=new S,l=new fe;for(let u=0;u<=e;u++){let m=u/e;n[u]=this.getTangentAt(m,new S)}s[0]=new S,a[0]=new S;let c=Number.MAX_VALUE,h=Math.abs(n[0].x),d=Math.abs(n[0].y),p=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),p<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),a[0].crossVectors(n[0],s[0]);for(let u=1;u<=e;u++){if(s[u]=s[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(n[u-1],n[u]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Ne(n[u-1].dot(n[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(o,m))}a[u].crossVectors(n[u],s[u])}if(t===!0){let u=Math.acos(Ne(s[0].dot(s[e]),-1,1));u/=e,n[0].dot(o.crossVectors(s[0],s[e]))>0&&(u=-u);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(n[m],u*m)),a[m].crossVectors(n[m],s[m])}return{tangents:n,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Cr=class extends ii{constructor(e=0,t=0,i=1,n=1,s=0,a=2*Math.PI,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new J){let i=t,n=2*Math.PI,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(s=a?0:n),this.aClockwise!==!0||a||(s===n?s=-n:s-=n);let o=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),p=l-this.aX,u=c-this.aY;l=p*h-u*d+this.aX,c=p*d+u*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Wa=class extends Cr{constructor(e,t,i,n,s,a){super(e,t,i,i,n,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Hc(){let r=0,e=0,t=0,i=0;function n(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){n(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,d){let p=(a-s)/c-(o-s)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+d)+(l-o)/d;p*=h,u*=h,n(a,o,p,u)},calc:function(s){let a=s*s;return r+e*s+t*a+i*(a*s)}}}var wa=new S,Fl=new Hc,Bl=new Hc,Ol=new Hc,Rr=class extends ii{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new S){let i=t,n=this.points,s=n.length,a=(s-(this.closed?0:1))*e,o,l,c=Math.floor(a),h=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?o=n[(c-1)%s]:(wa.subVectors(n[0],n[1]).add(n[0]),o=wa);let d=n[c%s],p=n[(c+1)%s];if(this.closed||c+2<s?l=n[(c+2)%s]:(wa.subVectors(n[s-1],n[s-2]).add(n[s-1]),l=wa),this.curveType==="centripetal"||this.curveType==="chordal"){let u=this.curveType==="chordal"?.5:.25,m=Math.pow(o.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(p),u),f=Math.pow(p.distanceToSquared(l),u);g<1e-4&&(g=1),m<1e-4&&(m=g),f<1e-4&&(f=g),Fl.initNonuniformCatmullRom(o.x,d.x,p.x,l.x,m,g,f),Bl.initNonuniformCatmullRom(o.y,d.y,p.y,l.y,m,g,f),Ol.initNonuniformCatmullRom(o.z,d.z,p.z,l.z,m,g,f)}else this.curveType==="catmullrom"&&(Fl.initCatmullRom(o.x,d.x,p.x,l.x,this.tension),Bl.initCatmullRom(o.y,d.y,p.y,l.y,this.tension),Ol.initCatmullRom(o.z,d.z,p.z,l.z,this.tension));return i.set(Fl.calc(h),Bl.calc(h),Ol.calc(h)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new S().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Zh(r,e,t,i,n){let s=.5*(i-e),a=.5*(n-t),o=r*r;return(2*t-2*i+s+a)*(r*o)+(-3*t+3*i-2*s-a)*o+s*r+t}function os(r,e,t,i){return(function(n,s){let a=1-n;return a*a*s})(r,e)+(function(n,s){return 2*(1-n)*n*s})(r,t)+(function(n,s){return n*n*s})(r,i)}function ls(r,e,t,i,n){return(function(s,a){let o=1-s;return o*o*o*a})(r,e)+(function(s,a){let o=1-s;return 3*o*o*s*a})(r,t)+(function(s,a){return 3*(1-s)*s*s*a})(r,i)+(function(s,a){return s*s*s*a})(r,n)}var xs=class extends ii{constructor(e=new J,t=new J,i=new J,n=new J){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new J){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(ls(e,n.x,s.x,a.x,o.x),ls(e,n.y,s.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},_n=class extends ii{constructor(e=new S,t=new S,i=new S,n=new S){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new S){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(ls(e,n.x,s.x,a.x,o.x),ls(e,n.y,s.y,a.y,o.y),ls(e,n.z,s.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ys=class extends ii{constructor(e=new J,t=new J){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new J){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new J){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Xa=class extends ii{constructor(e=new S,t=new S){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new S){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new S){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ms=class extends ii{constructor(e=new J,t=new J,i=new J){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new J){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(os(e,n.x,s.x,a.x),os(e,n.y,s.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ss=class extends ii{constructor(e=new S,t=new S,i=new S){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new S){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(os(e,n.x,s.x,a.x),os(e,n.y,s.y,a.y),os(e,n.z,s.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},bs=class extends ii{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new J){let i=t,n=this.points,s=(n.length-1)*e,a=Math.floor(s),o=s-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],d=n[a>n.length-3?n.length-1:a+2];return i.set(Zh(o,l.x,c.x,h.x,d.x),Zh(o,l.y,c.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new J().fromArray(n))}return this}},ja=Object.freeze({__proto__:null,ArcCurve:Wa,CatmullRomCurve3:Rr,CubicBezierCurve:xs,CubicBezierCurve3:_n,EllipseCurve:Cr,LineCurve:ys,LineCurve3:Xa,QuadraticBezierCurve:Ms,QuadraticBezierCurve3:Ss,SplineCurve:bs}),qa=class extends ii{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ja[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),n=this.getCurveLengths(),s=0;for(;s<n.length;){if(n[s]>=i){let a=n[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let n=0,s=this.curves;n<s.length;n++){let a=s[n],o=a.isEllipseCurve?2*e:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(new ja[n.type]().fromJSON(n))}return this}},Ts=class extends qa{constructor(e){super(),this.type="Path",this.currentPoint=new J,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new ys(this.currentPoint.clone(),new J(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){let s=new Ms(this.currentPoint.clone(),new J(e,t),new J(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,s,a){let o=new xs(this.currentPoint.clone(),new J(e,t),new J(i,n),new J(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new bs(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,n,s,a),this}absarc(e,t,i,n,s,a){return this.absellipse(e,t,i,i,n,s,a),this}ellipse(e,t,i,n,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,n,s,a,o,l),this}absellipse(e,t,i,n,s,a,o,l){let c=new Cr(e,t,i,n,s,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Xt=class extends Ts{constructor(e){super(e),this.uuid=Li(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,n=this.holes.length;i<n;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(new Ts().fromJSON(n))}return this}};function Tp(r,e,t=2){let i=e&&e.length,n=i?e[0]*t:r.length,s=Jh(r,0,n,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(i&&(s=(function(h,d,p,u){let m=[];for(let g=0,f=d.length;g<f;g++){let v=Jh(h,d[g]*u,g<f-1?d[g+1]*u:h.length,u,!1);v===v.next&&(v.steiner=!0),m.push(Lp(v))}m.sort(Rp);for(let g=0;g<m.length;g++)p=Pp(m[g],p);return p})(r,e,s,t)),r.length>80*t){o=1/0,l=1/0;let h=-1/0,d=-1/0;for(let p=t;p<n;p+=t){let u=r[p],m=r[p+1];u<o&&(o=u),m<l&&(l=m),u>h&&(h=u),m>d&&(d=m)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return ws(s,a,t,o,l,c,0),a}function Jh(r,e,t,i,n){let s;if(n===(function(a,o,l,c){let h=0;for(let d=o,p=l-c;d<l;d+=c)h+=(a[p]-a[d])*(a[d+1]+a[p+1]),p=d;return h})(r,e,t,i)>0)for(let a=e;a<t;a+=i)s=Kh(a/i|0,r[a],r[a+1],s);else for(let a=t-i;a>=e;a-=i)s=Kh(a/i|0,r[a],r[a+1],s);return s&&Pr(s,s.next)&&(As(s),s=s.next),s}function Dn(r,e){if(!r)return r;e||(e=r);let t,i=r;do if(t=!1,i.steiner||!Pr(i,i.next)&&ft(i.prev,i,i.next)!==0)i=i.next;else{if(As(i),i=e=i.prev,i===i.next)break;t=!0}while(t||i!==e);return e}function ws(r,e,t,i,n,s,a){if(!r)return;!a&&s&&(function(l,c,h,d){let p=l;do p.z===0&&(p.z=Yl(p.x,p.y,c,h,d)),p.prevZ=p.prev,p.nextZ=p.next,p=p.next;while(p!==l);p.prevZ.nextZ=null,p.prevZ=null,(function(u){let m,g=1;do{let f,v=u;u=null;let _=null;for(m=0;v;){m++;let x=v,y=0;for(let w=0;w<g&&(y++,x=x.nextZ,x);w++);let T=g;for(;y>0||T>0&&x;)y!==0&&(T===0||!x||v.z<=x.z)?(f=v,v=v.nextZ,y--):(f=x,x=x.nextZ,T--),_?_.nextZ=f:u=f,f.prevZ=_,_=f;v=x}_.nextZ=null,g*=2}while(m>1)})(p)})(r,i,n,s);let o=r;for(;r.prev!==r.next;){let l=r.prev,c=r.next;if(s?Ep(r,i,n,s):wp(r))e.push(l.i,r.i,c.i),As(r),r=c.next,o=c.next;else if((r=c)===o){a?a===1?ws(r=Ap(Dn(r),e),e,t,i,n,s,2):a===2&&Cp(r,e,t,i,n,s):ws(Dn(r),e,t,i,n,s,1);break}}}function wp(r){let e=r.prev,t=r,i=r.next;if(ft(e,t,i)>=0)return!1;let n=e.x,s=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=Math.min(n,s,a),d=Math.min(o,l,c),p=Math.max(n,s,a),u=Math.max(o,l,c),m=i.next;for(;m!==e;){if(m.x>=h&&m.x<=p&&m.y>=d&&m.y<=u&&ss(n,o,s,l,a,c,m.x,m.y)&&ft(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Ep(r,e,t,i){let n=r.prev,s=r,a=r.next;if(ft(n,s,a)>=0)return!1;let o=n.x,l=s.x,c=a.x,h=n.y,d=s.y,p=a.y,u=Math.min(o,l,c),m=Math.min(h,d,p),g=Math.max(o,l,c),f=Math.max(h,d,p),v=Yl(u,m,e,t,i),_=Yl(g,f,e,t,i),x=r.prevZ,y=r.nextZ;for(;x&&x.z>=v&&y&&y.z<=_;){if(x.x>=u&&x.x<=g&&x.y>=m&&x.y<=f&&x!==n&&x!==a&&ss(o,h,l,d,c,p,x.x,x.y)&&ft(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=u&&y.x<=g&&y.y>=m&&y.y<=f&&y!==n&&y!==a&&ss(o,h,l,d,c,p,y.x,y.y)&&ft(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=v;){if(x.x>=u&&x.x<=g&&x.y>=m&&x.y<=f&&x!==n&&x!==a&&ss(o,h,l,d,c,p,x.x,x.y)&&ft(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=_;){if(y.x>=u&&y.x<=g&&y.y>=m&&y.y<=f&&y!==n&&y!==a&&ss(o,h,l,d,c,p,y.x,y.y)&&ft(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Ap(r,e){let t=r;do{let i=t.prev,n=t.next.next;!Pr(i,n)&&nd(i,t,t.next,n)&&Es(i,n)&&Es(n,i)&&(e.push(i.i,t.i,n.i),As(t),As(t.next),t=r=n),t=t.next}while(t!==r);return Dn(t)}function Cp(r,e,t,i,n,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Up(a,o)){let l=rd(a,o);return a=Dn(a,a.next),l=Dn(l,l.next),ws(a,e,t,i,n,s,0),void ws(l,e,t,i,n,s,0)}o=o.next}a=a.next}while(a!==r)}function Rp(r,e){let t=r.x-e.x;return t===0&&(t=r.y-e.y,t===0)&&(t=(r.next.y-r.y)/(r.next.x-r.x)-(e.next.y-e.y)/(e.next.x-e.x)),t}function Pp(r,e){let t=(function(n,s){let a=s,o=n.x,l=n.y,c,h=-1/0;if(Pr(n,a))return a;do{if(Pr(n,a.next))return a.next;if(l<=a.y&&l>=a.next.y&&a.next.y!==a.y){let g=a.x+(l-a.y)*(a.next.x-a.x)/(a.next.y-a.y);if(g<=o&&g>h&&(h=g,c=a.x<a.next.x?a:a.next,g===o))return c}a=a.next}while(a!==s);if(!c)return null;let d=c,p=c.x,u=c.y,m=1/0;a=c;do{if(o>=a.x&&a.x>=p&&o!==a.x&&id(l<u?o:h,l,p,u,l<u?h:o,l,a.x,a.y)){let g=Math.abs(l-a.y)/(o-a.x);Es(a,n)&&(g<m||g===m&&(a.x>c.x||a.x===c.x&&Ip(c,a)))&&(c=a,m=g)}a=a.next}while(a!==d);return c})(r,e);if(!t)return e;let i=rd(t,r);return Dn(i,i.next),Dn(t,t.next)}function Ip(r,e){return ft(r.prev,r,e.prev)<0&&ft(e.next,r,r.next)<0}function Yl(r,e,t,i,n){return(r=1431655765&((r=858993459&((r=252645135&((r=16711935&((r=(r-t)*n|0)|r<<8))|r<<4))|r<<2))|r<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-i)*n|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function Lp(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function id(r,e,t,i,n,s,a,o){return(n-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(n-a)*(i-o)}function ss(r,e,t,i,n,s,a,o){return!(r===a&&e===o)&&id(r,e,t,i,n,s,a,o)}function Up(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!(function(t,i){let n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==i.i&&n.next.i!==i.i&&nd(n,n.next,t,i))return!0;n=n.next}while(n!==t);return!1})(r,e)&&(Es(r,e)&&Es(e,r)&&(function(t,i){let n=t,s=!1,a=(t.x+i.x)/2,o=(t.y+i.y)/2;do n.y>o!=n.next.y>o&&n.next.y!==n.y&&a<(n.next.x-n.x)*(o-n.y)/(n.next.y-n.y)+n.x&&(s=!s),n=n.next;while(n!==t);return s})(r,e)&&(ft(r.prev,r,e.prev)||ft(r,e.prev,e))||Pr(r,e)&&ft(r.prev,r,r.next)>0&&ft(e.prev,e,e.next)>0)}function ft(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Pr(r,e){return r.x===e.x&&r.y===e.y}function nd(r,e,t,i){let n=Aa(ft(r,e,t)),s=Aa(ft(r,e,i)),a=Aa(ft(t,i,r)),o=Aa(ft(t,i,e));return n!==s&&a!==o||!(n!==0||!Ea(r,t,e))||!(s!==0||!Ea(r,i,e))||!(a!==0||!Ea(t,r,i))||!(o!==0||!Ea(t,e,i))}function Ea(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Aa(r){return r>0?1:r<0?-1:0}function Es(r,e){return ft(r.prev,r,r.next)<0?ft(r,e,r.next)>=0&&ft(r,r.prev,e)>=0:ft(r,e,r.prev)<0||ft(r,r.next,e)<0}function rd(r,e){let t=Zl(r.i,r.x,r.y),i=Zl(e.i,e.x,e.y),n=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=n,n.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Kh(r,e,t,i){let n=Zl(r,e,t);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function As(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Zl(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}var Jl=class{static triangulate(e,t,i=2){return Tp(e,t,i)}},Ii=class r{static area(e){let t=e.length,i=0;for(let n=t-1,s=0;s<t;n=s++)i+=e[n].x*e[s].y-e[s].x*e[n].y;return .5*i}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let i=[],n=[],s=[];$h(e),Qh(i,e);let a=e.length;t.forEach($h);for(let l=0;l<t.length;l++)n.push(a),a+=t[l].length,Qh(i,t[l]);let o=Jl.triangulate(i,n);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};function $h(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Qh(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var Jt=class r extends Ue{constructor(e=new Xt([new J(.5,.5),new J(-.5,.5),new J(-.5,-.5),new J(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,n=[],s=[];for(let o=0,l=e.length;o<l;o++)a(e[o]);function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1,p=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:u-.1,g=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3,v=t.extrudePath,_=t.UVGenerator!==void 0?t.UVGenerator:Dp,x,y,T,w,R,P=!1;v&&(x=v.getSpacedPoints(h),P=!0,p=!1,y=v.computeFrenetFrames(h,!1),T=new S,w=new S,R=new S),p||(f=0,u=0,m=0,g=0);let I=o.extractPoints(c),G=I.shape,k=I.holes;if(!Ii.isClockWise(G)){G=G.reverse();for(let D=0,M=k.length;D<M;D++){let C=k[D];Ii.isClockWise(C)&&(k[D]=C.reverse())}}function O(D){let M=10000000000000001e-36,C=D[0];for(let B=1;B<=D.length;B++){let L=B%D.length,Y=D[L],H=Y.x-C.x,W=Y.y-C.y,te=H*H+W*W,le=Math.max(Math.abs(Y.x),Math.abs(Y.y),Math.abs(C.x),Math.abs(C.y));te<=M*le*le?(D.splice(L,1),B--):C=Y}}O(G),k.forEach(O);let N=k.length,U=G;for(let D=0;D<N;D++){let M=k[D];G=G.concat(M)}function V(D,M,C){return M||console.error("THREE.ExtrudeGeometry: vec does not exist"),D.clone().addScaledVector(M,C)}let j=G.length;function K(D,M,C){let B,L,Y,H=D.x-M.x,W=D.y-M.y,te=C.x-D.x,le=C.y-D.y,ie=H*H+W*W,de=H*le-W*te;if(Math.abs(de)>Number.EPSILON){let xe=Math.sqrt(ie),be=Math.sqrt(te*te+le*le),Ve=M.x-W/xe,Qe=M.y+H/xe,et=((C.x-le/be-Ve)*le-(C.y+te/be-Qe)*te)/(H*le-W*te);B=Ve+H*et-D.x,L=Qe+W*et-D.y;let ce=B*B+L*L;if(ce<=2)return new J(B,L);Y=Math.sqrt(ce/2)}else{let xe=!1;H>Number.EPSILON?te>Number.EPSILON&&(xe=!0):H<-Number.EPSILON?te<-Number.EPSILON&&(xe=!0):Math.sign(W)===Math.sign(le)&&(xe=!0),xe?(B=-W,L=H,Y=Math.sqrt(ie)):(B=H,L=W,Y=Math.sqrt(ie/2))}return new J(B/Y,L/Y)}let $=[];for(let D=0,M=U.length,C=M-1,B=D+1;D<M;D++,C++,B++)C===M&&(C=0),B===M&&(B=0),$[D]=K(U[D],U[C],U[B]);let ue=[],Se,_e,Ae=$.concat();for(let D=0,M=N;D<M;D++){let C=k[D];Se=[];for(let B=0,L=C.length,Y=L-1,H=B+1;B<L;B++,Y++,H++)Y===L&&(Y=0),H===L&&(H=0),Se[B]=K(C[B],C[Y],C[H]);ue.push(Se),Ae=Ae.concat(Se)}if(f===0)_e=Ii.triangulateShape(U,k);else{let D=[],M=[];for(let C=0;C<f;C++){let B=C/f,L=u*Math.cos(B*Math.PI/2),Y=m*Math.sin(B*Math.PI/2)+g;for(let H=0,W=U.length;H<W;H++){let te=V(U[H],$[H],Y);Te(te.x,te.y,-L),B===0&&D.push(te)}for(let H=0,W=N;H<W;H++){let te=k[H];Se=ue[H];let le=[];for(let ie=0,de=te.length;ie<de;ie++){let xe=V(te[ie],Se[ie],Y);Te(xe.x,xe.y,-L),B===0&&le.push(xe)}B===0&&M.push(le)}}_e=Ii.triangulateShape(D,M)}let ne=_e.length,ae=m+g;for(let D=0;D<j;D++){let M=p?V(G[D],Ae[D],ae):G[D];P?(w.copy(y.normals[0]).multiplyScalar(M.x),T.copy(y.binormals[0]).multiplyScalar(M.y),R.copy(x[0]).add(w).add(T),Te(R.x,R.y,R.z)):Te(M.x,M.y,0)}for(let D=1;D<=h;D++)for(let M=0;M<j;M++){let C=p?V(G[M],Ae[M],ae):G[M];P?(w.copy(y.normals[D]).multiplyScalar(C.x),T.copy(y.binormals[D]).multiplyScalar(C.y),R.copy(x[D]).add(w).add(T),Te(R.x,R.y,R.z)):Te(C.x,C.y,d/h*D)}for(let D=f-1;D>=0;D--){let M=D/f,C=u*Math.cos(M*Math.PI/2),B=m*Math.sin(M*Math.PI/2)+g;for(let L=0,Y=U.length;L<Y;L++){let H=V(U[L],$[L],B);Te(H.x,H.y,d+C)}for(let L=0,Y=k.length;L<Y;L++){let H=k[L];Se=ue[L];for(let W=0,te=H.length;W<te;W++){let le=V(H[W],Se[W],B);P?Te(le.x,le.y+x[h-1].y,x[h-1].x+C):Te(le.x,le.y,d+C)}}}function se(D,M){let C=D.length;for(;--C>=0;){let B=C,L=C-1;L<0&&(L=D.length-1);for(let Y=0,H=h+2*f;Y<H;Y++){let W=j*Y,te=j*(Y+1);E(M+B+W,M+L+W,M+L+te,M+B+te)}}}function Te(D,M,C){l.push(D),l.push(M),l.push(C)}function De(D,M,C){b(D),b(M),b(C);let B=n.length/3,L=_.generateTopUV(i,n,B-3,B-2,B-1);z(L[0]),z(L[1]),z(L[2])}function E(D,M,C,B){b(D),b(M),b(B),b(M),b(C),b(B);let L=n.length/3,Y=_.generateSideWallUV(i,n,L-6,L-3,L-2,L-1);z(Y[0]),z(Y[1]),z(Y[3]),z(Y[1]),z(Y[2]),z(Y[3])}function b(D){n.push(l[3*D+0]),n.push(l[3*D+1]),n.push(l[3*D+2])}function z(D){s.push(D.x),s.push(D.y)}(function(){let D=n.length/3;if(p){let M=0,C=j*M;for(let B=0;B<ne;B++){let L=_e[B];De(L[2]+C,L[1]+C,L[0]+C)}M=h+2*f,C=j*M;for(let B=0;B<ne;B++){let L=_e[B];De(L[0]+C,L[1]+C,L[2]+C)}}else{for(let M=0;M<ne;M++){let C=_e[M];De(C[2],C[1],C[0])}for(let M=0;M<ne;M++){let C=_e[M];De(C[0]+j*h,C[1]+j*h,C[2]+j*h)}}i.addGroup(D,n.length/3-D,0)})(),(function(){let D=n.length/3,M=0;se(U,M),M+=U.length;for(let C=0,B=k.length;C<B;C++){let L=k[C];se(L,M),M+=L.length}i.addGroup(D,n.length/3-D,1)})()}this.setAttribute("position",new ge(n,3)),this.setAttribute("uv",new ge(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,i,n){if(n.shapes=[],Array.isArray(t))for(let s=0,a=t.length;s<a;s++){let o=t[s];n.shapes.push(o.uuid)}else n.shapes.push(t.uuid);return n.options=Object.assign({},i),i.extrudePath!==void 0&&(n.options.extrudePath=i.extrudePath.toJSON()),n})(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let i=[];for(let s=0,a=e.shapes.length;s<a;s++){let o=t[e.shapes[s]];i.push(o)}let n=e.options.extrudePath;return n!==void 0&&(e.options.extrudePath=new ja[n.type]().fromJSON(n)),new r(i,e.options)}},Dp={generateTopUV:function(r,e,t,i,n){let s=e[3*t],a=e[3*t+1],o=e[3*i],l=e[3*i+1],c=e[3*n],h=e[3*n+1];return[new J(s,a),new J(o,l),new J(c,h)]},generateSideWallUV:function(r,e,t,i,n,s){let a=e[3*t],o=e[3*t+1],l=e[3*t+2],c=e[3*i],h=e[3*i+1],d=e[3*i+2],p=e[3*n],u=e[3*n+1],m=e[3*n+2],g=e[3*s],f=e[3*s+1],v=e[3*s+2];return Math.abs(o-h)<Math.abs(a-c)?[new J(a,1-l),new J(c,1-d),new J(p,1-m),new J(g,1-v)]:[new J(o,1-l),new J(h,1-d),new J(u,1-m),new J(f,1-v)]}},Qi=class r extends vn{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2;super([-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},xn=class r extends Ue{constructor(e=[new J(0,-.5),new J(.5,0),new J(0,.5)],t=12,i=0,n=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:n},t=Math.floor(t),n=Ne(n,0,2*Math.PI);let s=[],a=[],o=[],l=[],c=[],h=1/t,d=new S,p=new J,u=new S,m=new S,g=new S,f=0,v=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:f=e[_+1].x-e[_].x,v=e[_+1].y-e[_].y,u.x=1*v,u.y=-f,u.z=0*v,g.copy(u),u.normalize(),l.push(u.x,u.y,u.z);break;case e.length-1:l.push(g.x,g.y,g.z);break;default:f=e[_+1].x-e[_].x,v=e[_+1].y-e[_].y,u.x=1*v,u.y=-f,u.z=0*v,m.copy(u),u.x+=g.x,u.y+=g.y,u.z+=g.z,u.normalize(),l.push(u.x,u.y,u.z),g.copy(m)}for(let _=0;_<=t;_++){let x=i+_*h*n,y=Math.sin(x),T=Math.cos(x);for(let w=0;w<=e.length-1;w++){d.x=e[w].x*y,d.y=e[w].y,d.z=e[w].x*T,a.push(d.x,d.y,d.z),p.x=_/t,p.y=w/(e.length-1),o.push(p.x,p.y);let R=l[3*w+0]*y,P=l[3*w+1],I=l[3*w+0]*T;c.push(R,P,I)}}for(let _=0;_<t;_++)for(let x=0;x<e.length-1;x++){let y=x+_*e.length,T=y,w=y+e.length,R=y+e.length+1,P=y+1;s.push(T,w,P),s.push(R,P,w)}this.setIndex(s),this.setAttribute("position",new ge(a,3)),this.setAttribute("uv",new ge(o,2)),this.setAttribute("normal",new ge(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},Ya=class r extends vn{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Fi=class r extends Ue{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};let s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,d=e/o,p=t/l,u=[],m=[],g=[],f=[];for(let v=0;v<h;v++){let _=v*p-a;for(let x=0;x<c;x++){let y=x*d-s;m.push(y,-_,0),g.push(0,0,1),f.push(x/o),f.push(1-v/l)}}for(let v=0;v<l;v++)for(let _=0;_<o;_++){let x=_+c*v,y=_+c*(v+1),T=_+1+c*(v+1),w=_+1+c*v;u.push(x,y,w),u.push(y,T,w)}this.setIndex(u),this.setAttribute("position",new ge(m,3)),this.setAttribute("normal",new ge(g,3)),this.setAttribute("uv",new ge(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},Za=class r extends Ue{constructor(e=.5,t=1,i=32,n=1,s=0,a=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i);let o=[],l=[],c=[],h=[],d=e,p=(t-e)/(n=Math.max(1,n)),u=new S,m=new J;for(let g=0;g<=n;g++){for(let f=0;f<=i;f++){let v=s+f/i*a;u.x=d*Math.cos(v),u.y=d*Math.sin(v),l.push(u.x,u.y,u.z),c.push(0,0,1),m.x=(u.x/t+1)/2,m.y=(u.y/t+1)/2,h.push(m.x,m.y)}d+=p}for(let g=0;g<n;g++){let f=g*(i+1);for(let v=0;v<i;v++){let _=v+f,x=_,y=_+i+1,T=_+i+2,w=_+1;o.push(x,y,w),o.push(y,T,w)}}this.setIndex(o),this.setAttribute("position",new ge(l,3)),this.setAttribute("normal",new ge(c,3)),this.setAttribute("uv",new ge(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Ja=class r extends Ue{constructor(e=new Xt([new J(0,.5),new J(-.5,-.5),new J(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],n=[],s=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;function c(h){let d=n.length/3,p=h.extractPoints(t),u=p.shape,m=p.holes;Ii.isClockWise(u)===!1&&(u=u.reverse());for(let f=0,v=m.length;f<v;f++){let _=m[f];Ii.isClockWise(_)===!0&&(m[f]=_.reverse())}let g=Ii.triangulateShape(u,m);for(let f=0,v=m.length;f<v;f++){let _=m[f];u=u.concat(_)}for(let f=0,v=u.length;f<v;f++){let _=u[f];n.push(_.x,_.y,0),s.push(0,0,1),a.push(_.x,_.y)}for(let f=0,v=g.length;f<v;f++){let _=g[f],x=_[0]+d,y=_[1]+d,T=_[2]+d;i.push(x,y,T),l+=3}}this.setIndex(i),this.setAttribute("position",new ge(n,3)),this.setAttribute("normal",new ge(s,3)),this.setAttribute("uv",new ge(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,i){if(i.shapes=[],Array.isArray(t))for(let n=0,s=t.length;n<s;n++){let a=t[n];i.shapes.push(a.uuid)}else i.shapes.push(t.uuid);return i})(this.parameters.shapes,e)}static fromJSON(e,t){let i=[];for(let n=0,s=e.shapes.length;n<s;n++){let a=t[e.shapes[n]];i.push(a)}return new r(i,e.curveSegments)}},at=class r extends Ue{constructor(e=1,t=32,i=16,n=0,s=2*Math.PI,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new S,p=new S,u=[],m=[],g=[],f=[];for(let v=0;v<=i;v++){let _=[],x=v/i,y=0;v===0&&a===0?y=.5/t:v===i&&l===Math.PI&&(y=-.5/t);for(let T=0;T<=t;T++){let w=T/t;d.x=-e*Math.cos(n+w*s)*Math.sin(a+x*o),d.y=e*Math.cos(a+x*o),d.z=e*Math.sin(n+w*s)*Math.sin(a+x*o),m.push(d.x,d.y,d.z),p.copy(d).normalize(),g.push(p.x,p.y,p.z),f.push(w+y,1-x),_.push(c++)}h.push(_)}for(let v=0;v<i;v++)for(let _=0;_<t;_++){let x=h[v][_+1],y=h[v][_],T=h[v+1][_],w=h[v+1][_+1];(v!==0||a>0)&&u.push(x,y,w),(v!==i-1||l<Math.PI)&&u.push(y,T,w)}this.setIndex(u),this.setAttribute("position",new ge(m,3)),this.setAttribute("normal",new ge(g,3)),this.setAttribute("uv",new ge(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},Ka=class r extends vn{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Rt=class r extends Ue{constructor(e=1,t=.4,i=12,n=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:s},i=Math.floor(i),n=Math.floor(n);let a=[],o=[],l=[],c=[],h=new S,d=new S,p=new S;for(let u=0;u<=i;u++)for(let m=0;m<=n;m++){let g=m/n*s,f=u/i*Math.PI*2;d.x=(e+t*Math.cos(f))*Math.cos(g),d.y=(e+t*Math.cos(f))*Math.sin(g),d.z=t*Math.sin(f),o.push(d.x,d.y,d.z),h.x=e*Math.cos(g),h.y=e*Math.sin(g),p.subVectors(d,h).normalize(),l.push(p.x,p.y,p.z),c.push(m/n),c.push(u/i)}for(let u=1;u<=i;u++)for(let m=1;m<=n;m++){let g=(n+1)*u+m-1,f=(n+1)*(u-1)+m-1,v=(n+1)*(u-1)+m,_=(n+1)*u+m;a.push(g,f,_),a.push(f,v,_)}this.setIndex(a),this.setAttribute("position",new ge(o,3)),this.setAttribute("normal",new ge(l,3)),this.setAttribute("uv",new ge(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},$a=class r extends Ue{constructor(e=1,t=.4,i=64,n=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:n,p:s,q:a},i=Math.floor(i),n=Math.floor(n);let o=[],l=[],c=[],h=[],d=new S,p=new S,u=new S,m=new S,g=new S,f=new S,v=new S;for(let x=0;x<=i;++x){let y=x/i*s*Math.PI*2;_(y,s,a,e,u),_(y+.01,s,a,e,m),f.subVectors(m,u),v.addVectors(m,u),g.crossVectors(f,v),v.crossVectors(g,f),g.normalize(),v.normalize();for(let T=0;T<=n;++T){let w=T/n*Math.PI*2,R=-t*Math.cos(w),P=t*Math.sin(w);d.x=u.x+(R*v.x+P*g.x),d.y=u.y+(R*v.y+P*g.y),d.z=u.z+(R*v.z+P*g.z),l.push(d.x,d.y,d.z),p.subVectors(d,u).normalize(),c.push(p.x,p.y,p.z),h.push(x/i),h.push(T/n)}}for(let x=1;x<=i;x++)for(let y=1;y<=n;y++){let T=(n+1)*(x-1)+(y-1),w=(n+1)*x+(y-1),R=(n+1)*x+y,P=(n+1)*(x-1)+y;o.push(T,w,P),o.push(w,R,P)}function _(x,y,T,w,R){let P=Math.cos(x),I=Math.sin(x),G=T/y*x,k=Math.cos(G);R.x=w*(2+k)*.5*P,R.y=w*(2+k)*I*.5,R.z=w*Math.sin(G)*.5}this.setIndex(o),this.setAttribute("position",new ge(l,3)),this.setAttribute("normal",new ge(c,3)),this.setAttribute("uv",new ge(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},Qa=class r extends Ue{constructor(e=new Ss(new S(-1,-1,0),new S(-1,1,0),new S(1,1,0)),t=64,i=1,n=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:n,closed:s};let a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new S,l=new S,c=new J,h=new S,d=[],p=[],u=[],m=[];function g(f){h=e.getPointAt(f/t,h);let v=a.normals[f],_=a.binormals[f];for(let x=0;x<=n;x++){let y=x/n*Math.PI*2,T=Math.sin(y),w=-Math.cos(y);l.x=w*v.x+T*_.x,l.y=w*v.y+T*_.y,l.z=w*v.z+T*_.z,l.normalize(),p.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,d.push(o.x,o.y,o.z)}}(function(){for(let f=0;f<t;f++)g(f);g(s===!1?t:0),(function(){for(let f=0;f<=t;f++)for(let v=0;v<=n;v++)c.x=f/t,c.y=v/n,u.push(c.x,c.y)})(),(function(){for(let f=1;f<=t;f++)for(let v=1;v<=n;v++){let _=(n+1)*(f-1)+(v-1),x=(n+1)*f+(v-1),y=(n+1)*f+v,T=(n+1)*(f-1)+v;m.push(_,x,T),m.push(x,y,T)}})()})(),this.setIndex(m),this.setAttribute("position",new ge(d,3)),this.setAttribute("normal",new ge(p,3)),this.setAttribute("uv",new ge(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new ja[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},eo=class extends Ue{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,n=new S,s=new S;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let d=l[c],p=d.start;for(let u=p,m=p+d.count;u<m;u+=3)for(let g=0;g<3;g++){let f=o.getX(u+g),v=o.getX(u+(g+1)%3);n.fromBufferAttribute(a,f),s.fromBufferAttribute(a,v),eu(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,d=3*o+(c+1)%3;n.fromBufferAttribute(a,h),s.fromBufferAttribute(a,d),eu(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new ge(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function eu(r,e,t){let i=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,n=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(i)!==!0&&t.has(n)!==!0&&(t.add(i),t.add(n),!0)}var Ig=Object.freeze({__proto__:null,BoxGeometry:qe,CapsuleGeometry:Er,CircleGeometry:Ar,ConeGeometry:li,CylinderGeometry:Me,DodecahedronGeometry:Va,EdgesGeometry:Ha,ExtrudeGeometry:Jt,IcosahedronGeometry:Qi,LatheGeometry:xn,OctahedronGeometry:Ya,PlaneGeometry:Fi,PolyhedronGeometry:vn,RingGeometry:Za,ShapeGeometry:Ja,SphereGeometry:at,TetrahedronGeometry:Ka,TorusGeometry:Rt,TorusKnotGeometry:$a,TubeGeometry:Qa,WireframeGeometry:eo});var dt=class extends _i{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fe,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},lt=class extends dt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new J(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ne(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new me(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new me(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new me(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Cs=class extends _i{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fe,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},to=class extends _i{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},io=class extends _i{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ca(r,e){return r&&r.constructor!==e?typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r):r}function Np(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}var Nn=class{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,n=t[i],s=t[i-1];i:{e:{let a;t:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<s)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=n,n=t[++i],e<n)break e}a=t.length;break t}if(!(e>=s)){let o=t[1];e<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=s,s=t[--i-1],e>=s)break e}a=i,i=0;break t}break i}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(n=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,n)}return this.interpolate_(i,s,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=e*n;for(let a=0;a!==n;++a)t[a]=i[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},no=class extends Nn{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Vl,endingEnd:Vl}}intervalChanged_(e,t,i){let n=this.parameterPositions,s=e-2,a=e+1,o=n[s],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case Hl:s=e,o=2*t-i;break;case Wl:s=n.length-2,o=t+n[s]-n[s+1];break;default:s=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Hl:a=e,l=2*i-t;break;case Wl:a=1,l=i+n[1]-n[0];break;default:a=e-1,l=t}let c=.5*(i-t),h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,p=this._weightPrev,u=this._weightNext,m=(i-t)/(n-t),g=m*m,f=g*m,v=-p*f+2*p*g-p*m,_=(1+p)*f+(-1.5-2*p)*g+(-.5+p)*m+1,x=(-1-u)*f+(1.5+u)*g+.5*m,y=u*f-u*g;for(let T=0;T!==o;++T)s[T]=v*a[h+T]+_*a[c+T]+x*a[l+T]+y*a[d+T];return s}},ro=class extends Nn{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(n-t),d=1-h;for(let p=0;p!==o;++p)s[p]=a[c+p]*d+a[l+p]*h;return s}},so=class extends Nn{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}},ti=class{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ca(t,this.TimeBufferType),this.values=Ca(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Ca(e.times,Array),values:Ca(e.values,Array)};let n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new so(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ro(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new no(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case cs:t=this.InterpolantFactoryMethodDiscrete;break;case La:t=this.InterpolantFactoryMethodLinear;break;case Ra:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(i);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return cs;case this.InterpolantFactoryMethodLinear:return La;case this.InterpolantFactoryMethodSmooth:return Ra}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e}return this}trim(e,t){let i=this.times,n=i.length,s=0,a=n-1;for(;s!==n&&i[s]<e;)++s;for(;a!==-1&&i[a]>t;)--a;if(++a,s!==0||a!==n){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,n=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(n!==void 0&&Np(n))for(let o=0,l=n.length;o!==l;++o){let c=n[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===Ra,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o];if(c!==e[o+1]&&(o!==1||c!==e[0]))if(n)l=!0;else{let h=o*i,d=h-i,p=h+i;for(let u=0;u!==i;++u){let m=t[h+u];if(m!==t[d+u]||m!==t[p+u]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*i,d=a*i;for(let p=0;p!==i;++p)t[d+p]=t[h+p]}++a}}if(s>0){e[a]=e[s];for(let o=s*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=new this.constructor(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};ti.prototype.ValueTypeName="",ti.prototype.TimeBufferType=Float32Array,ti.prototype.ValueBufferType=Float32Array,ti.prototype.DefaultInterpolation=La;var dn=class extends ti{constructor(e,t,i){super(e,t,i)}};dn.prototype.ValueTypeName="bool",dn.prototype.ValueBufferType=Array,dn.prototype.DefaultInterpolation=cs,dn.prototype.InterpolantFactoryMethodLinear=void 0,dn.prototype.InterpolantFactoryMethodSmooth=void 0;var ao=class extends ti{constructor(e,t,i,n){super(e,t,i,n)}};ao.prototype.ValueTypeName="color";var oo=class extends ti{constructor(e,t,i,n){super(e,t,i,n)}};oo.prototype.ValueTypeName="number";var lo=class extends Nn{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(n-t),c=e*o;for(let h=c+o;c!==h;c+=4)$e.slerpFlat(s,0,a,c-o,a,c,l);return s}},Rs=class extends ti{constructor(e,t,i,n){super(e,t,i,n)}InterpolantFactoryMethodLinear(e){return new lo(this.times,this.values,this.getValueSize(),e)}};Rs.prototype.ValueTypeName="quaternion",Rs.prototype.InterpolantFactoryMethodSmooth=void 0;var pn=class extends ti{constructor(e,t,i){super(e,t,i)}};pn.prototype.ValueTypeName="string",pn.prototype.ValueBufferType=Array,pn.prototype.DefaultInterpolation=cs,pn.prototype.InterpolantFactoryMethodLinear=void 0,pn.prototype.InterpolantFactoryMethodSmooth=void 0;var co=class extends ti{constructor(e,t,i,n){super(e,t,i,n)}};co.prototype.ValueTypeName="vector";var Pa={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}},ho=class{constructor(e,t,i){let n=this,s,a=!1,o=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.abortController=new AbortController,this.itemStart=function(h){l++,a===!1&&n.onStart!==void 0&&n.onStart(h,o,l),a=!0},this.itemEnd=function(h){o++,n.onProgress!==void 0&&n.onProgress(h,o,l),o===l&&(a=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(h){n.onError!==void 0&&n.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,p=c.length;d<p;d+=2){let u=c[d],m=c[d+1];if(u.global&&(u.lastIndex=0),u.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},sd=new ho,Ir=class{constructor(e){this.manager=e!==void 0?e:sd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(n,s){i.load(e,n,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Ir.DEFAULT_MATERIAL_NAME="__DEFAULT";var dr=new WeakMap,uo=class extends Ir{constructor(e){super(e)}load(e,t,i,n){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=Pa.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let d=dr.get(a);d===void 0&&(d=[],dr.set(a,d)),d.push({onLoad:t,onError:n})}return a}let o=_r("img");function l(){h(),t&&t(this);let d=dr.get(this)||[];for(let p=0;p<d.length;p++){let u=d[p];u.onLoad&&u.onLoad(this)}dr.delete(this),s.manager.itemEnd(e)}function c(d){h(),n&&n(d),Pa.remove(`image:${e}`);let p=dr.get(this)||[];for(let u=0;u<p.length;u++){let m=p[u];m.onError&&m.onError(d)}dr.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Pa.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}};var Ps=class extends Ir{constructor(e){super(e)}load(e,t,i,n){let s=new zt,a=new uo(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},i,n),s}},Lr=class extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new me(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Is=class extends Lr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new me(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},zl=new fe,tu=new S,iu=new S,po=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new J(512,512),this.mapType=Oi,this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gn,this._frameExtents=new J(1,1),this._viewportCount=1,this._viewports=[new Ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;tu.setFromMatrixPosition(e.matrixWorld),t.position.copy(tu),iu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(iu),t.updateMatrixWorld(),zl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zl,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(zl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),this.mapSize.x===512&&this.mapSize.y===512||(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var nu=new fe,rs=new S,Gl=new S,Kl=class extends po{constructor(){super(new Lt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new J(4,2),this._viewportCount=6,this._viewports=[new Ke(2,1,1,1),new Ke(0,1,1,1),new Ke(3,1,1,1),new Ke(1,1,1,1),new Ke(3,0,1,1),new Ke(1,0,1,1)],this._cubeDirections=[new S(1,0,0),new S(-1,0,0),new S(0,0,1),new S(0,0,-1),new S(0,1,0),new S(0,-1,0)],this._cubeUps=[new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,0,1),new S(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,n=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),rs.setFromMatrixPosition(e.matrixWorld),i.position.copy(rs),Gl.copy(i.position),Gl.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Gl),i.updateMatrixWorld(),n.makeTranslation(-rs.x,-rs.y,-rs.z),nu.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nu,i.coordinateSystem,i.reversedDepth)}},Pt=class extends Lr{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new Kl}get power(){return 4*this.intensity*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Ls=class extends Sr{constructor(e=-1,t=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2,s=i-e,a=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},$l=class extends po{constructor(){super(new Ls(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Us=class extends Lr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new $l}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Lg=new fe,Ug=new fe,Dg=new fe;var mo=class extends Lt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Ng=new S,Fg=new $e,Bg=new S,Og=new S,zg=new S;var Gg=new S,kg=new $e,Vg=new S,Hg=new S;var Wc="\\[\\]\\.:\\/",Fp=new RegExp("["+Wc+"]","g"),kl="[^"+Wc+"]",Bp="[^"+Wc.replace("\\.","")+"]",Op=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",kl)+/(WCOD+)?/.source.replace("WCOD",Bp)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",kl)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",kl)+"$"),zp=["material","materials","bones","map"],ot=class r{constructor(e,t,i){this.path=t,this.parsedPath=i||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,i):new r(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Fp,"")}static parseTrackName(e){let t=Op.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){let s=i.nodeName.substring(n+1);zp.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,n=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[i]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[i]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let a=e[n];if(a===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",e)}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ot.Composite=class{constructor(r,e,t){let i=t||ot.parseTrackName(e);this._targetGroup=r,this._bindings=r.subscribe_(e,i)}getValue(r,e){this.bind();let t=this._targetGroup.nCachedObjects_,i=this._bindings[t];i!==void 0&&i.getValue(r,e)}setValue(r,e){let t=this._bindings;for(let i=this._targetGroup.nCachedObjects_,n=t.length;i!==n;++i)t[i].setValue(r,e)}bind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].bind()}unbind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].unbind()}},ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ot.prototype.GetterByBindingType=[ot.prototype._getValue_direct,ot.prototype._getValue_array,ot.prototype._getValue_arrayElement,ot.prototype._getValue_toArray],ot.prototype.SetterByBindingTypeAndVersioning=[[ot.prototype._setValue_direct,ot.prototype._setValue_direct_setNeedsUpdate,ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_array,ot.prototype._setValue_array_setNeedsUpdate,ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_arrayElement,ot.prototype._setValue_arrayElement_setNeedsUpdate,ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_fromArray,ot.prototype._setValue_fromArray_setNeedsUpdate,ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Wg=new Float32Array(1);var ru=new fe,Ds=class{constructor(e,t,i=0,n=1/0){this.ray=new mn(e,t),this.near=i,this.far=n,this.camera=null,this.layers=new Mr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return ru.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ru),this}intersectObject(e,t=!0,i=[]){return Ql(e,this,i,t),i.sort(su),i}intersectObjects(e,t=!0,i=[]){for(let n=0,s=e.length;n<s;n++)Ql(e[n],this,i,t);return i.sort(su),i}};function su(r,e){return r.distance-e.distance}function Ql(r,e,t,i){let n=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(n=!1),n===!0&&i===!0){let s=r.children;for(let a=0,o=s.length;a<o;a++)Ql(s[a],e,t,!0)}}var Xg=new J;var jg=new S,qg=new S,Yg=new S,Zg=new S,Jg=new S,Kg=new S,$g=new S;var Qg=new S;var e0=new S,t0=new fe,i0=new fe;var n0=new S,r0=new me,s0=new me;var a0=new S,o0=new S,l0=new S;var c0=new S,h0=new Sr;var u0=new Zt;var d0=new S;function Xc(r,e,t,i){let n=(function(s){switch(s){case Oi:case sc:return{byteLength:1,components:1};case Fr:case ac:case Br:return{byteLength:2,components:1};case Ao:case Co:return{byteLength:2,components:4};case On:case Eo:case yi:return{byteLength:4,components:1};case oc:case lc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)})(i);switch(t){case 1021:return r*e;case Ro:case Po:return r*e/n.components*n.byteLength;case 1030:case 1031:return r*e*2/n.components*n.byteLength;case 1022:return r*e*3/n.components*n.byteLength;case Mi:case 1033:return r*e*4/n.components*n.byteLength;case 33776:case 33777:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(r,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(r,8)*Math.max(e,8)/2;case 36196:case 37492:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37808:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(r/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(r/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Rd(){let r=null,e=!1,t=null,i=null;function n(s,a){t(s,a),i=r.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&(i=r.requestAnimationFrame(n),e=!0)},stop:function(){r.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function jp(r){let e=new WeakMap;return{get:function(t){return t.isInterleavedBufferAttribute&&(t=t.data),e.get(t)},remove:function(t){t.isInterleavedBufferAttribute&&(t=t.data);let i=e.get(t);i&&(r.deleteBuffer(i.buffer),e.delete(t))},update:function(t,i){if(t.isInterleavedBufferAttribute&&(t=t.data),t.isGLBufferAttribute){let s=e.get(t);return void((!s||s.version<t.version)&&e.set(t,{buffer:t.buffer,type:t.type,bytesPerElement:t.elementSize,version:t.version}))}let n=e.get(t);if(n===void 0)e.set(t,(function(s,a){let o=s.array,l=s.usage,c=o.byteLength,h=r.createBuffer(),d;if(r.bindBuffer(a,h),r.bufferData(a,o,l),s.onUploadCallback(),o instanceof Float32Array)d=r.FLOAT;else if(typeof Float16Array<"u"&&o instanceof Float16Array)d=r.HALF_FLOAT;else if(o instanceof Uint16Array)d=s.isFloat16BufferAttribute?r.HALF_FLOAT:r.UNSIGNED_SHORT;else if(o instanceof Int16Array)d=r.SHORT;else if(o instanceof Uint32Array)d=r.UNSIGNED_INT;else if(o instanceof Int32Array)d=r.INT;else if(o instanceof Int8Array)d=r.BYTE;else if(o instanceof Uint8Array)d=r.UNSIGNED_BYTE;else{if(!(o instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+o);d=r.UNSIGNED_BYTE}return{buffer:h,type:d,bytesPerElement:o.BYTES_PER_ELEMENT,version:s.version,size:c}})(t,i));else if(n.version<t.version){if(n.size!==t.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(s,a,o){let l=a.array,c=a.updateRanges;if(r.bindBuffer(o,s),c.length===0)r.bufferSubData(o,0,l);else{c.sort((d,p)=>d.start-p.start);let h=0;for(let d=1;d<c.length;d++){let p=c[h],u=c[d];u.start<=p.start+p.count+1?p.count=Math.max(p.count,u.start+u.count-p.start):(++h,c[h]=u)}c.length=h+1;for(let d=0,p=c.length;d<p;d++){let u=c[d];r.bufferSubData(o,u.start*l.BYTES_PER_ELEMENT,l,u.start,u.count)}a.clearUpdateRanges()}a.onUploadCallback()})(n.buffer,t,i),n.version=t.version}}}}var Be={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:"gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},oe={common:{diffuse:{value:new me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Le}},envmap:{envMap:{value:null},envMapRotation:{value:new Le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Le},normalScale:{value:new J(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0},uvTransform:{value:new Le}},sprite:{diffuse:{value:new me(16777215)},opacity:{value:1},center:{value:new J(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}}},zi={basic:{uniforms:Vt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:Vt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new me(0)}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:Vt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new me(0)},specular:{value:new me(1118481)},shininess:{value:30}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:Vt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:Vt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new me(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:Vt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:Vt([oe.points,oe.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:Vt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:Vt([oe.common,oe.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:Vt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:Vt([oe.sprite,oe.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Le}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distanceRGBA:{uniforms:Vt([oe.common,oe.displacementmap,{referencePosition:{value:new S},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distanceRGBA_vert,fragmentShader:Be.distanceRGBA_frag},shadow:{uniforms:Vt([oe.lights,oe.fog,{color:{value:new me(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};zi.physical={uniforms:Vt([zi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Le},clearcoatNormalScale:{value:new J(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Le},sheen:{value:0},sheenColor:{value:new me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Le},transmissionSamplerSize:{value:new J},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Le},attenuationDistance:{value:0},attenuationColor:{value:new me(0)},specularColor:{value:new me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Le},anisotropyVector:{value:new J},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Le}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};var No={r:0,b:0,g:0},kn=new Fe,qp=new fe;function Yp(r,e,t,i,n,s,a){let o=new me(0),l,c,h=s===!0?0:1,d=null,p=0,u=null;function m(f){let v=f.isScene===!0?f.background:null;return v&&v.isTexture&&(v=(f.backgroundBlurriness>0?t:e).get(v)),v}function g(f,v){f.getRGB(No,Vc(r)),i.buffers.color.setClear(No.r,No.g,No.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(f,v=1){o.set(f),h=v,g(o,h)},getClearAlpha:function(){return h},setClearAlpha:function(f){h=f,g(o,h)},render:function(f){let v=!1,_=m(f);_===null?g(o,h):_&&_.isColor&&(g(_,1),v=!0);let x=r.xr.getEnvironmentBlendMode();x==="additive"?i.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))},addToRenderList:function(f,v){let _=m(v);_&&(_.isCubeTexture||_.mapping===Bs)?(c===void 0&&(c=new re(new qe(1,1,1),new st({name:"BackgroundCubeMaterial",uniforms:Gn(zi.backgroundCube.uniforms),vertexShader:zi.backgroundCube.vertexShader,fragmentShader:zi.backgroundCube.fragmentShader,side:Ut,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(x,y,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),kn.copy(v.backgroundRotation),kn.x*=-1,kn.y*=-1,kn.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(kn.y*=-1,kn.z*=-1),c.material.uniforms.envMap.value=_,c.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(qp.makeRotationFromEuler(kn)),c.material.toneMapped=Je.getTransfer(_.colorSpace)!==rt,d===_&&p===_.version&&u===r.toneMapping||(c.material.needsUpdate=!0,d=_,p=_.version,u=r.toneMapping),c.layers.enableAll(),f.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new re(new Fi(2,2),new st({name:"BackgroundMaterial",uniforms:Gn(zi.background.uniforms),vertexShader:zi.background.vertexShader,fragmentShader:zi.background.fragmentShader,side:yn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=Je.getTransfer(_.colorSpace)!==rt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),d===_&&p===_.version&&u===r.toneMapping||(l.material.needsUpdate=!0,d=_,p=_.version,u=r.toneMapping),l.layers.enableAll(),f.unshift(l,l.geometry,l.material,0,0,null))},dispose:function(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}}}function Zp(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},n=c(null),s=n,a=!1;function o(v){return r.bindVertexArray(v)}function l(v){return r.deleteVertexArray(v)}function c(v){let _=[],x=[],y=[];for(let T=0;T<t;T++)_[T]=0,x[T]=0,y[T]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:_,enabledAttributes:x,attributeDivisors:y,object:v,attributes:{},index:null}}function h(){let v=s.newAttributes;for(let _=0,x=v.length;_<x;_++)v[_]=0}function d(v){p(v,0)}function p(v,_){let x=s.newAttributes,y=s.enabledAttributes,T=s.attributeDivisors;x[v]=1,y[v]===0&&(r.enableVertexAttribArray(v),y[v]=1),T[v]!==_&&(r.vertexAttribDivisor(v,_),T[v]=_)}function u(){let v=s.newAttributes,_=s.enabledAttributes;for(let x=0,y=_.length;x<y;x++)_[x]!==v[x]&&(r.disableVertexAttribArray(x),_[x]=0)}function m(v,_,x,y,T,w,R){R===!0?r.vertexAttribIPointer(v,_,x,T,w):r.vertexAttribPointer(v,_,x,y,T,w)}function g(){f(),a=!0,s!==n&&(s=n,o(s.object))}function f(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:function(v,_,x,y,T){let w=!1,R=(function(P,I,G){let k=G.wireframe===!0,O=i[P.id];O===void 0&&(O={},i[P.id]=O);let N=O[I.id];N===void 0&&(N={},O[I.id]=N);let U=N[k];return U===void 0&&(U=c(r.createVertexArray()),N[k]=U),U})(y,x,_);s!==R&&(s=R,o(s.object)),w=(function(P,I,G,k){let O=s.attributes,N=I.attributes,U=0,V=G.getAttributes();for(let j in V)if(V[j].location>=0){let K=O[j],$=N[j];if($===void 0&&(j==="instanceMatrix"&&P.instanceMatrix&&($=P.instanceMatrix),j==="instanceColor"&&P.instanceColor&&($=P.instanceColor)),K===void 0||K.attribute!==$||$&&K.data!==$.data)return!0;U++}return s.attributesNum!==U||s.index!==k})(v,y,x,T),w&&(function(P,I,G,k){let O={},N=I.attributes,U=0,V=G.getAttributes();for(let j in V)if(V[j].location>=0){let K=N[j];K===void 0&&(j==="instanceMatrix"&&P.instanceMatrix&&(K=P.instanceMatrix),j==="instanceColor"&&P.instanceColor&&(K=P.instanceColor));let $={};$.attribute=K,K&&K.data&&($.data=K.data),O[j]=$,U++}s.attributes=O,s.attributesNum=U,s.index=k})(v,y,x,T),T!==null&&e.update(T,r.ELEMENT_ARRAY_BUFFER),(w||a)&&(a=!1,(function(P,I,G,k){h();let O=k.attributes,N=G.getAttributes(),U=I.defaultAttributeValues;for(let V in N){let j=N[V];if(j.location>=0){let K=O[V];if(K===void 0&&(V==="instanceMatrix"&&P.instanceMatrix&&(K=P.instanceMatrix),V==="instanceColor"&&P.instanceColor&&(K=P.instanceColor)),K!==void 0){let $=K.normalized,ue=K.itemSize,Se=e.get(K);if(Se===void 0)continue;let _e=Se.buffer,Ae=Se.type,ne=Se.bytesPerElement,ae=Ae===r.INT||Ae===r.UNSIGNED_INT||K.gpuType===Eo;if(K.isInterleavedBufferAttribute){let se=K.data,Te=se.stride,De=K.offset;if(se.isInstancedInterleavedBuffer){for(let E=0;E<j.locationSize;E++)p(j.location+E,se.meshPerAttribute);P.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let E=0;E<j.locationSize;E++)d(j.location+E);r.bindBuffer(r.ARRAY_BUFFER,_e);for(let E=0;E<j.locationSize;E++)m(j.location+E,ue/j.locationSize,Ae,$,Te*ne,(De+ue/j.locationSize*E)*ne,ae)}else{if(K.isInstancedBufferAttribute){for(let se=0;se<j.locationSize;se++)p(j.location+se,K.meshPerAttribute);P.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let se=0;se<j.locationSize;se++)d(j.location+se);r.bindBuffer(r.ARRAY_BUFFER,_e);for(let se=0;se<j.locationSize;se++)m(j.location+se,ue/j.locationSize,Ae,$,ue*ne,ue/j.locationSize*se*ne,ae)}}else if(U!==void 0){let $=U[V];if($!==void 0)switch($.length){case 2:r.vertexAttrib2fv(j.location,$);break;case 3:r.vertexAttrib3fv(j.location,$);break;case 4:r.vertexAttrib4fv(j.location,$);break;default:r.vertexAttrib1fv(j.location,$)}}}}u()})(v,_,x,y),T!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(T).buffer))},reset:g,resetDefaultState:f,dispose:function(){g();for(let v in i){let _=i[v];for(let x in _){let y=_[x];for(let T in y)l(y[T].object),delete y[T];delete _[x]}delete i[v]}},releaseStatesOfGeometry:function(v){if(i[v.id]===void 0)return;let _=i[v.id];for(let x in _){let y=_[x];for(let T in y)l(y[T].object),delete y[T];delete _[x]}delete i[v.id]},releaseStatesOfProgram:function(v){for(let _ in i){let x=i[_];if(x[v.id]===void 0)continue;let y=x[v.id];for(let T in y)l(y[T].object),delete y[T];delete x[v.id]}},initAttributes:h,enableAttribute:d,disableUnusedAttributes:u}}function Jp(r,e,t){let i;function n(s,a,o){o!==0&&(r.drawArraysInstanced(i,s,a,o),t.update(a,i,o))}this.setMode=function(s){i=s},this.render=function(s,a){r.drawArrays(i,s,a),t.update(a,i,1)},this.renderInstances=n,this.renderMultiDraw=function(s,a,o){if(o===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,s,0,a,0,o);let l=0;for(let c=0;c<o;c++)l+=a[c];t.update(l,i,1)},this.renderMultiDrawInstances=function(s,a,o,l){if(o===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<s.length;h++)n(s[h],a[h],l[h]);else{c.multiDrawArraysInstancedWEBGL(i,s,0,a,0,l,0,o);let h=0;for(let d=0;d<o;d++)h+=a[d]*l[d];t.update(h,i,1)}}}function Kp(r,e,t,i){let n;function s(p){if(p==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";p="mediump"}return p==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=t.precision!==void 0?t.precision:"highp",o=s(a);o!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",o,"instead."),a=o);let l=t.logarithmicDepthBuffer===!0,c=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),d=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS);return{isWebGL2:!0,getMaxAnisotropy:function(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){let p=e.get("EXT_texture_filter_anisotropic");n=r.getParameter(p.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n},getMaxPrecision:s,textureFormatReadable:function(p){return p===Mi||i.convert(p)===r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT)},textureTypeReadable:function(p){let u=p===Br&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(p!==Oi&&i.convert(p)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&p!==yi&&!u)},precision:a,logarithmicDepthBuffer:l,reversedDepthBuffer:c,maxTextures:h,maxVertexTextures:d,maxTextureSize:r.getParameter(r.MAX_TEXTURE_SIZE),maxCubemapSize:r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),maxAttributes:r.getParameter(r.MAX_VERTEX_ATTRIBS),maxVertexUniforms:r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),maxVaryings:r.getParameter(r.MAX_VARYING_VECTORS),maxFragmentUniforms:r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),vertexTextures:d>0,maxSamples:r.getParameter(r.MAX_SAMPLES)}}function $p(r){let e=this,t=null,i=0,n=!1,s=!1,a=new Ri,o=new Le,l={value:null,needsUpdate:!1};function c(h,d,p,u){let m=h!==null?h.length:0,g=null;if(m!==0){if(g=l.value,u!==!0||g===null){let f=p+4*m,v=d.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<f)&&(g=new Float32Array(f));for(let _=0,x=p;_!==m;++_,x+=4)a.copy(h[_]).applyMatrix4(v,o),a.normal.toArray(g,x),g[x+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,g}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let p=h.length!==0||d||i!==0||n;return n=d,i=h.length,p},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=c(h,d,0)},this.setState=function(h,d,p){let u=h.clippingPlanes,m=h.clipIntersection,g=h.clipShadows,f=r.get(h);if(!n||u===null||u.length===0||s&&!g)s?c(null):(function(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0})();else{let v=s?0:i,_=4*v,x=f.clippingState||null;l.value=x,x=c(u,d,_,p);for(let y=0;y!==_;++y)x[y]=t[y];f.clippingState=x,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=v}}}function Qp(r){let e=new WeakMap;function t(n,s){return s===Nr?n.mapping=Dr:s===To&&(n.mapping=Fn),n}function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping;if(s===Nr||s===To){if(e.has(n))return t(e.get(n).texture,n.mapping);{let a=n.image;if(a&&a.height>0){let o=new Oa(a.height);return o.fromEquirectangularTexture(r,n),e.set(n,o),n.addEventListener("dispose",i),t(o.texture,n.mapping)}return null}}}return n},dispose:function(){e=new WeakMap}}}var ad=[.125,.215,.35,.446,.526,.582],ks=20,jc=new Ls,od=new me,qc=null,Yc=0,Zc=0,Jc=!1,Hn=(1+Math.sqrt(5))/2,zr=1/Hn,ld=[new S(-Hn,zr,0),new S(Hn,zr,0),new S(-zr,0,Hn),new S(zr,0,Hn),new S(0,Hn,-zr),new S(0,Hn,zr),new S(-1,1,-1),new S(1,1,-1),new S(-1,1,1),new S(1,1,1)],em=new S,kr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,n=100,s={}){let{size:a=256,position:o=em}=s;qc=this._renderer.getRenderTarget(),Yc=this._renderer.getActiveCubeFace(),Zc=this._renderer.getActiveMipmapLevel(),Jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,n,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ud(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(qc,Yc,Zc),this._renderer.xr.enabled=Jc,e.scissorTest=!1,Fo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Dr||e.mapping===Fn?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),qc=this._renderer.getRenderTarget(),Yc=this._renderer.getActiveCubeFace(),Zc=this._renderer.getActiveMipmapLevel(),Jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Di,minFilter:Di,generateMipmaps:!1,type:Br,format:Mi,colorSpace:Un,depthBuffer:!1},n=cd(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cd(e,t,i);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=(function(a){let o=[],l=[],c=[],h=a,d=a-4+1+ad.length;for(let p=0;p<d;p++){let u=Math.pow(2,h);l.push(u);let m=1/u;p>a-4?m=ad[p-a+4-1]:p===0&&(m=0),c.push(m);let g=1/(u-2),f=-g,v=1+g,_=[f,f,v,f,v,v,f,f,v,v,f,v],x=6,y=6,T=3,w=2,R=1,P=new Float32Array(T*y*x),I=new Float32Array(w*y*x),G=new Float32Array(R*y*x);for(let O=0;O<x;O++){let N=O%3*2/3-1,U=O>2?0:-1,V=[N,U,0,N+2/3,U,0,N+2/3,U+1,0,N,U,0,N+2/3,U+1,0,N,U+1,0];P.set(V,T*y*O),I.set(_,w*y*O);let j=[O,O,O,O,O,O];G.set(j,R*y*O)}let k=new Ue;k.setAttribute("position",new ke(P,T)),k.setAttribute("uv",new ke(I,w)),k.setAttribute("faceIndex",new ke(G,R)),o.push(k),h>4&&h--}return{lodPlanes:o,sizeLods:l,sigmas:c}})(s)),this._blurMaterial=(function(a,o,l){let c=new Float32Array(ks),h=new S(0,1,0);return new st({name:"SphericalGaussianBlur",defines:{n:ks,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:ah(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})})(s,e,t)}return n}_compileMaterial(e){let t=new re(this._lodPlanes[0],e);this._renderer.compile(t,jc)}_sceneToCubeUV(e,t,i,n,s){let a=new Lt(90,1,t,i),o=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],c=this._renderer,h=c.autoClear,d=c.toneMapping;c.getClearColor(od),c.toneMapping=en,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(n),c.clearDepth(),c.setRenderTarget(null));let p=new je({name:"PMREM.Background",side:Ut,depthWrite:!1,depthTest:!1}),u=new re(new qe,p),m=!1,g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,m=!0):(p.color.copy(od),m=!0);for(let f=0;f<6;f++){let v=f%3;v===0?(a.up.set(0,o[f],0),a.position.set(s.x,s.y,s.z),a.lookAt(s.x+l[f],s.y,s.z)):v===1?(a.up.set(0,0,o[f]),a.position.set(s.x,s.y,s.z),a.lookAt(s.x,s.y+l[f],s.z)):(a.up.set(0,o[f],0),a.position.set(s.x,s.y,s.z),a.lookAt(s.x,s.y,s.z+l[f]));let _=this._cubeSize;Fo(n,v*_,f>2?_:0,_,_),c.setRenderTarget(n),m&&c.render(u,a),c.render(e,a)}u.geometry.dispose(),u.material.dispose(),c.toneMapping=d,c.autoClear=h,e.background=g}_textureToCubeUV(e,t){let i=this._renderer,n=e.mapping===Dr||e.mapping===Fn;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=ud()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hd());let s=n?this._cubemapMaterial:this._equirectMaterial,a=new re(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let o=this._cubeSize;Fo(t,0,0,3*o,2*o),i.setRenderTarget(t),i.render(a,jc)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let n=this._lodPlanes.length;for(let s=1;s<n;s++){let a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=ld[(n-s-1)%ld.length];this._blur(e,s-1,s,a,o)}t.autoClear=i}_blur(e,t,i,n,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,n,"latitudinal",s),this._halfBlur(a,e,i,i,n,"longitudinal",s)}_halfBlur(e,t,i,n,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new re(this._lodPlanes[n],c),d=c.uniforms,p=this._sizeLods[i]-1,u=isFinite(s)?Math.PI/(2*p):2*Math.PI/39,m=s/u,g=isFinite(s)?1+Math.floor(3*m):ks;g>ks&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to 20`);let f=[],v=0;for(let y=0;y<ks;++y){let T=y/m,w=Math.exp(-T*T/2);f.push(w),y===0?v+=w:y<g&&(v+=2*w)}for(let y=0;y<f.length;y++)f[y]=f[y]/v;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:_}=this;d.dTheta.value=u,d.mipInt.value=_-i;let x=this._sizeLods[n];Fo(t,3*x*(n>_-4?n-_+4:0),4*(this._cubeSize-x),3*x,2*x),l.setRenderTarget(t),l.render(h,jc)}};function cd(r,e,t){let i=new Ni(r,e,t);return i.texture.mapping=Bs,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Fo(r,e,t,i,n){r.viewport.set(e,t,i,n),r.scissor.set(e,t,i,n)}function hd(){return new st({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ah(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function ud(){return new st({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ah(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function ah(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function tm(r){let e=new WeakMap,t=null;function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping,a=s===Nr||s===To,o=s===Dr||s===Fn;if(a||o){let l=e.get(n),c=l!==void 0?l.texture.pmremVersion:0;if(n.isRenderTargetTexture&&n.pmremVersion!==c)return t===null&&(t=new kr(r)),l=a?t.fromEquirectangular(n,l):t.fromCubemap(n,l),l.texture.pmremVersion=n.pmremVersion,e.set(n,l),l.texture;if(l!==void 0)return l.texture;{let h=n.image;return a&&h&&h.height>0||o&&h&&(function(d){let p=0,u=6;for(let m=0;m<u;m++)d[m]!==void 0&&p++;return p===u})(h)?(t===null&&(t=new kr(r)),l=a?t.fromEquirectangular(n):t.fromCubemap(n),l.texture.pmremVersion=n.pmremVersion,e.set(n,l),n.addEventListener("dispose",i),l.texture):null}}}return n},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function im(r){let e={};function t(i){if(e[i]!==void 0)return e[i];let n;switch(i){case"WEBGL_depth_texture":n=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=r.getExtension(i)}return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let n=t(i);return n===null&&xr("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function nm(r,e,t,i){let n={},s=new WeakMap;function a(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let d in c.attributes)e.remove(c.attributes[d]);c.removeEventListener("dispose",a),delete n[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),i.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function o(l){let c=[],h=l.index,d=l.attributes.position,p=0;if(h!==null){let g=h.array;p=h.version;for(let f=0,v=g.length;f<v;f+=3){let _=g[f+0],x=g[f+1],y=g[f+2];c.push(_,x,x,y,y,_)}}else{if(d===void 0)return;{let g=d.array;p=d.version;for(let f=0,v=g.length/3-1;f<v;f+=3){let _=f+0,x=f+1,y=f+2;c.push(_,x,x,y,y,_)}}}let u=new(kc(c)?ms:ps)(c,1);u.version=p;let m=s.get(l);m&&e.remove(m),s.set(l,u)}return{get:function(l,c){return n[c.id]===!0||(c.addEventListener("dispose",a),n[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let h in c)e.update(c[h],r.ARRAY_BUFFER)},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&o(l)}else o(l);return s.get(l)}}}function rm(r,e,t){let i,n,s;function a(o,l,c){c!==0&&(r.drawElementsInstanced(i,l,n,o*s,c),t.update(l,i,c))}this.setMode=function(o){i=o},this.setIndex=function(o){n=o.type,s=o.bytesPerElement},this.render=function(o,l){r.drawElements(i,l,n,o*s),t.update(l,i,1)},this.renderInstances=a,this.renderMultiDraw=function(o,l,c){if(c===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,l,0,n,o,0,c);let h=0;for(let d=0;d<c;d++)h+=l[d];t.update(h,i,1)},this.renderMultiDrawInstances=function(o,l,c,h){if(c===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let p=0;p<o.length;p++)a(o[p]/s,l[p],h[p]);else{d.multiDrawElementsInstancedWEBGL(i,l,0,n,o,0,h,0,c);let p=0;for(let u=0;u<c;u++)p+=l[u]*h[u];t.update(p,i,1)}}}function sm(r){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,i,n){switch(e.calls++,i){case r.TRIANGLES:e.triangles+=n*(t/3);break;case r.LINES:e.lines+=n*(t/2);break;case r.LINE_STRIP:e.lines+=n*(t-1);break;case r.LINE_LOOP:e.lines+=n*t;break;case r.POINTS:e.points+=n*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",i)}}}}function am(r,e,t){let i=new WeakMap,n=new Ke;return{update:function(s,a,o){let l=s.morphTargetInfluences,c=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=c!==void 0?c.length:0,d=i.get(a);if(d===void 0||d.count!==h){let P=function(){w.dispose(),i.delete(a),a.removeEventListener("dispose",P)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,u=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],_=0;p===!0&&(_=1),u===!0&&(_=2),m===!0&&(_=3);let x=a.attributes.position.count*_,y=1;x>e.maxTextureSize&&(y=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let T=new Float32Array(x*y*4*h),w=new ds(T,x,y,h);w.type=yi,w.needsUpdate=!0;let R=4*_;for(let I=0;I<h;I++){let G=g[I],k=f[I],O=v[I],N=x*y*4*I;for(let U=0;U<G.count;U++){let V=U*R;p===!0&&(n.fromBufferAttribute(G,U),T[N+V+0]=n.x,T[N+V+1]=n.y,T[N+V+2]=n.z,T[N+V+3]=0),u===!0&&(n.fromBufferAttribute(k,U),T[N+V+4]=n.x,T[N+V+5]=n.y,T[N+V+6]=n.z,T[N+V+7]=0),m===!0&&(n.fromBufferAttribute(O,U),T[N+V+8]=n.x,T[N+V+9]=n.y,T[N+V+10]=n.z,T[N+V+11]=O.itemSize===4?n.w:1)}}d={count:h,texture:w,size:new J(x,y)},i.set(a,d),a.addEventListener("dispose",P)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)o.getUniforms().setValue(r,"morphTexture",s.morphTexture,t);else{let p=0;for(let m=0;m<l.length;m++)p+=l[m];let u=a.morphTargetsRelative?1:1-p;o.getUniforms().setValue(r,"morphTargetBaseInfluence",u),o.getUniforms().setValue(r,"morphTargetInfluences",l)}o.getUniforms().setValue(r,"morphTargetsTexture",d.texture,t),o.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}}}function om(r,e,t,i){let n=new WeakMap;function s(a){let o=a.target;o.removeEventListener("dispose",s),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:function(a){let o=i.render.frame,l=a.geometry,c=e.get(a,l);if(n.get(c)!==o&&(e.update(c),n.set(c,o)),a.isInstancedMesh&&(a.hasEventListener("dispose",s)===!1&&a.addEventListener("dispose",s),n.get(a)!==o&&(t.update(a.instanceMatrix,r.ARRAY_BUFFER),a.instanceColor!==null&&t.update(a.instanceColor,r.ARRAY_BUFFER),n.set(a,o))),a.isSkinnedMesh){let h=a.skeleton;n.get(h)!==o&&(h.update(),n.set(h,o))}return c},dispose:function(){n=new WeakMap}}}var Pd=new zt,dd=new vs(1,1),Id=new ds,Ld=new Fa,Ud=new fs,pd=[],md=[],fd=new Float32Array(16),gd=new Float32Array(9),vd=new Float32Array(4);function Vr(r,e,t){let i=r[0];if(i<=0||i>0)return r;let n=e*t,s=pd[n];if(s===void 0&&(s=new Float32Array(n),pd[n]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Tt(r,e){if(r.length!==e.length)return!1;for(let t=0,i=r.length;t<i;t++)if(r[t]!==e[t])return!1;return!0}function wt(r,e){for(let t=0,i=e.length;t<i;t++)r[t]=e[t]}function zo(r,e){let t=md[e];t===void 0&&(t=new Int32Array(e),md[e]=t);for(let i=0;i!==e;++i)t[i]=r.allocateTextureUnit();return t}function lm(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function cm(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2fv(this.addr,e),wt(t,e)}}function hm(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;r.uniform3fv(this.addr,e),wt(t,e)}}function um(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4fv(this.addr,e),wt(t,e)}}function dm(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,i))return;vd.set(i),r.uniformMatrix2fv(this.addr,!1,vd),wt(t,i)}}function pm(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,i))return;gd.set(i),r.uniformMatrix3fv(this.addr,!1,gd),wt(t,i)}}function mm(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,i))return;fd.set(i),r.uniformMatrix4fv(this.addr,!1,fd),wt(t,i)}}function fm(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function gm(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2iv(this.addr,e),wt(t,e)}}function vm(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;r.uniform3iv(this.addr,e),wt(t,e)}}function _m(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4iv(this.addr,e),wt(t,e)}}function xm(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function ym(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2uiv(this.addr,e),wt(t,e)}}function Mm(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;r.uniform3uiv(this.addr,e),wt(t,e)}}function Sm(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4uiv(this.addr,e),wt(t,e)}}function bm(r,e,t){let i=this.cache,n=t.allocateTextureUnit(),s;i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),this.type===r.SAMPLER_2D_SHADOW?(dd.compareFunction=zc,s=dd):s=Pd,t.setTexture2D(e||s,n)}function Tm(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||Ld,n)}function wm(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||Ud,n)}function Em(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||Id,n)}function Am(r,e){r.uniform1fv(this.addr,e)}function Cm(r,e){let t=Vr(e,this.size,2);r.uniform2fv(this.addr,t)}function Rm(r,e){let t=Vr(e,this.size,3);r.uniform3fv(this.addr,t)}function Pm(r,e){let t=Vr(e,this.size,4);r.uniform4fv(this.addr,t)}function Im(r,e){let t=Vr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Lm(r,e){let t=Vr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Um(r,e){let t=Vr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Dm(r,e){r.uniform1iv(this.addr,e)}function Nm(r,e){r.uniform2iv(this.addr,e)}function Fm(r,e){r.uniform3iv(this.addr,e)}function Bm(r,e){r.uniform4iv(this.addr,e)}function Om(r,e){r.uniform1uiv(this.addr,e)}function zm(r,e){r.uniform2uiv(this.addr,e)}function Gm(r,e){r.uniform3uiv(this.addr,e)}function km(r,e){r.uniform4uiv(this.addr,e)}function Vm(r,e,t){let i=this.cache,n=e.length,s=zo(t,n);Tt(i,s)||(r.uniform1iv(this.addr,s),wt(i,s));for(let a=0;a!==n;++a)t.setTexture2D(e[a]||Pd,s[a])}function Hm(r,e,t){let i=this.cache,n=e.length,s=zo(t,n);Tt(i,s)||(r.uniform1iv(this.addr,s),wt(i,s));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||Ld,s[a])}function Wm(r,e,t){let i=this.cache,n=e.length,s=zo(t,n);Tt(i,s)||(r.uniform1iv(this.addr,s),wt(i,s));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||Ud,s[a])}function Xm(r,e,t){let i=this.cache,n=e.length,s=zo(t,n);Tt(i,s)||(r.uniform1iv(this.addr,s),wt(i,s));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||Id,s[a])}var $c=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=(function(n){switch(n){case 5126:return lm;case 35664:return cm;case 35665:return hm;case 35666:return um;case 35674:return dm;case 35675:return pm;case 35676:return mm;case 5124:case 35670:return fm;case 35667:case 35671:return gm;case 35668:case 35672:return vm;case 35669:case 35673:return _m;case 5125:return xm;case 36294:return ym;case 36295:return Mm;case 36296:return Sm;case 35678:case 36198:case 36298:case 36306:case 35682:return bm;case 35679:case 36299:case 36307:return Tm;case 35680:case 36300:case 36308:case 36293:return wm;case 36289:case 36303:case 36311:case 36292:return Em}})(t.type)}},Qc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=(function(n){switch(n){case 5126:return Am;case 35664:return Cm;case 35665:return Rm;case 35666:return Pm;case 35674:return Im;case 35675:return Lm;case 35676:return Um;case 5124:case 35670:return Dm;case 35667:case 35671:return Nm;case 35668:case 35672:return Fm;case 35669:case 35673:return Bm;case 5125:return Om;case 36294:return zm;case 36295:return Gm;case 36296:return km;case 35678:case 36198:case 36298:case 36306:case 35682:return Vm;case 35679:case 36299:case 36307:return Hm;case 35680:case 36300:case 36308:case 36293:return Wm;case 36289:case 36303:case 36311:case 36292:return Xm}})(t.type)}},eh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let n=this.seq;for(let s=0,a=n.length;s!==a;++s){let o=n[s];o.setValue(e,t[o.id],i)}}},Kc=/(\w+)(\])?(\[|\.)?/g;function _d(r,e){r.seq.push(e),r.map[e.id]=e}function jm(r,e,t){let i=r.name,n=i.length;for(Kc.lastIndex=0;;){let s=Kc.exec(i),a=Kc.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o|=0),c===void 0||c==="["&&a+2===n){_d(t,c===void 0?new $c(o,r,e):new Qc(o,r,e));break}{let h=t.map[o];h===void 0&&(h=new eh(o),_d(t,h)),t=h}}}var Gr=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){let s=e.getActiveUniform(t,n);jm(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,i,n){let s=this.map[t];s!==void 0&&s.setValue(e,i,n)}setOptional(e,t,i){let n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){let i=[];for(let n=0,s=e.length;n!==s;++n){let a=e[n];a.id in t&&i.push(a)}return i}};function xd(r,e,t){let i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),i}var qm=0,yd=new Le;function Md(r,e,t){let i=r.getShaderParameter(e,r.COMPILE_STATUS),n=(r.getShaderInfoLog(e)||"").trim();if(i&&n==="")return"";let s=/ERROR: 0:(\d+)/.exec(n);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+n+`

`+(function(o,l){let c=o.split(`
`),h=[],d=Math.max(l-6,0),p=Math.min(l+6,c.length);for(let u=d;u<p;u++){let m=u+1;h.push(`${m===l?">":" "} ${m}: ${c[u]}`)}return h.join(`
`)})(r.getShaderSource(e),a)}return n}function Ym(r,e){let t=(function(i){Je._getMatrix(yd,Je.workingColorSpace,i);let n=`mat3( ${yd.elements.map(s=>s.toFixed(4))} )`;switch(Je.getTransfer(i)){case hs:return[n,"LinearTransferOETF"];case rt:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[n,"LinearTransferOETF"]}})(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Zm(r,e){let t;switch(e){case Iu:t="Linear";break;case Lu:t="Reinhard";break;case Uu:t="Cineon";break;case bo:t="ACESFilmic";break;case Nu:t="AgX";break;case Fu:t="Neutral";break;case Du:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Bo=new S;function Jm(){return Je.getLuminanceCoefficients(Bo),["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${Bo.x.toFixed(4)}, ${Bo.y.toFixed(4)}, ${Bo.z.toFixed(4)} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Vs(r){return r!==""}function Sd(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bd(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Km=/^[ \t]*#include +<([\w\d./]+)>/gm;function th(r){return r.replace(Km,Qm)}var $m=new Map;function Qm(r,e){let t=Be[e];if(t===void 0){let i=$m.get(e);if(i===void 0)throw new Error("Can not resolve #include <"+e+">");t=Be[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i)}return th(t)}var ef=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Td(r){return r.replace(ef,tf)}function tf(r,e,t,i){let n="";for(let s=parseInt(e);s<parseInt(t);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function wd(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function nf(r,e,t,i){let n=r.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=(function(k){let O="SHADOWMAP_TYPE_BASIC";return k.shadowMapType===tc?O="SHADOWMAP_TYPE_PCF":k.shadowMapType===fo?O="SHADOWMAP_TYPE_PCF_SOFT":k.shadowMapType===Bi&&(O="SHADOWMAP_TYPE_VSM"),O})(t),c=(function(k){let O="ENVMAP_TYPE_CUBE";if(k.envMap)switch(k.envMapMode){case Dr:case Fn:O="ENVMAP_TYPE_CUBE";break;case Bs:O="ENVMAP_TYPE_CUBE_UV"}return O})(t),h=(function(k){let O="ENVMAP_MODE_REFLECTION";return k.envMap&&k.envMapMode===Fn&&(O="ENVMAP_MODE_REFRACTION"),O})(t),d=(function(k){let O="ENVMAP_BLENDING_NONE";if(k.envMap)switch(k.combine){case Cu:O="ENVMAP_BLENDING_MULTIPLY";break;case Ru:O="ENVMAP_BLENDING_MIX";break;case Pu:O="ENVMAP_BLENDING_ADD"}return O})(t),p=(function(k){let O=k.envMapCubeUVHeight;if(O===null)return null;let N=Math.log2(O)-2,U=1/O;return{texelWidth:1/(3*Math.max(Math.pow(2,N),112)),texelHeight:U,maxMip:N}})(t),u=(function(k){return[k.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",k.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Vs).join(`
`)})(t),m=(function(k){let O=[];for(let N in k){let U=k[N];U!==!1&&O.push("#define "+N+" "+U)}return O.join(`
`)})(s),g=n.createProgram(),f,v,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Vs).join(`
`),f.length>0&&(f+=`
`),v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Vs).join(`
`),v.length>0&&(v+=`
`)):(f=[wd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Vs).join(`
`),v=[wd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==en?"#define TONE_MAPPING":"",t.toneMapping!==en?Be.tonemapping_pars_fragment:"",t.toneMapping!==en?Zm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,Ym("linearToOutputTexel",t.outputColorSpace),Jm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Vs).join(`
`)),a=th(a),a=Sd(a,t),a=bd(a,t),o=th(o),o=Sd(o,t),o=bd(o,t),a=Td(a),o=Td(o),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,f=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,v=["#define varying in",t.glslVersion===Gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);let x=_+f+a,y=_+v+o,T=xd(n,n.VERTEX_SHADER,x),w=xd(n,n.FRAGMENT_SHADER,y);function R(k){if(r.debug.checkShaderErrors){let O=n.getProgramInfoLog(g)||"",N=n.getShaderInfoLog(T)||"",U=n.getShaderInfoLog(w)||"",V=O.trim(),j=N.trim(),K=U.trim(),$=!0,ue=!0;if(n.getProgramParameter(g,n.LINK_STATUS)===!1)if($=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,g,T,w);else{let Se=Md(n,T,"vertex"),_e=Md(n,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(g,n.VALIDATE_STATUS)+`

Material Name: `+k.name+`
Material Type: `+k.type+`

Program Info Log: `+V+`
`+Se+`
`+_e)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):j!==""&&K!==""||(ue=!1);ue&&(k.diagnostics={runnable:$,programLog:V,vertexShader:{log:j,prefix:f},fragmentShader:{log:K,prefix:v}})}n.deleteShader(T),n.deleteShader(w),P=new Gr(n,g),I=(function(O,N){let U={},V=O.getProgramParameter(N,O.ACTIVE_ATTRIBUTES);for(let j=0;j<V;j++){let K=O.getActiveAttrib(N,j),$=K.name,ue=1;K.type===O.FLOAT_MAT2&&(ue=2),K.type===O.FLOAT_MAT3&&(ue=3),K.type===O.FLOAT_MAT4&&(ue=4),U[$]={type:K.type,location:O.getAttribLocation(N,$),locationSize:ue}}return U})(n,g)}let P,I;n.attachShader(g,T),n.attachShader(g,w),t.index0AttributeName!==void 0?n.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(g,0,"position"),n.linkProgram(g),this.getUniforms=function(){return P===void 0&&R(this),P},this.getAttributes=function(){return I===void 0&&R(this),I};let G=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return G===!1&&(G=n.getProgramParameter(g,37297)),G},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qm++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=T,this.fragmentShader=w,this}var rf=0,ih=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new nh(e),t.set(e,i)),i}},nh=class{constructor(e){this.id=rf++,this.code=e,this.usedTimes=0}};function sf(r,e,t,i,n,s,a){let o=new Mr,l=new ih,c=new Set,h=[],d=n.logarithmicDepthBuffer,p=n.vertexTextures,u=n.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(f){return c.add(f),f===0?"uv":`uv${f}`}return{getParameters:function(f,v,_,x,y){let T=x.fog,w=y.geometry,R=f.isMeshStandardMaterial?x.environment:null,P=(f.isMeshStandardMaterial?t:e).get(f.envMap||R),I=P&&P.mapping===Bs?P.image.height:null,G=m[f.type];f.precision!==null&&(u=n.getMaxPrecision(f.precision),u!==f.precision&&console.warn("THREE.WebGLProgram.getParameters:",f.precision,"not supported, using",u,"instead."));let k=w.morphAttributes.position||w.morphAttributes.normal||w.morphAttributes.color,O=k!==void 0?k.length:0,N,U,V,j,K=0;if(w.morphAttributes.position!==void 0&&(K=1),w.morphAttributes.normal!==void 0&&(K=2),w.morphAttributes.color!==void 0&&(K=3),G){let Ft=zi[G];N=Ft.vertexShader,U=Ft.fragmentShader}else N=f.vertexShader,U=f.fragmentShader,l.update(f),V=l.getVertexShaderID(f),j=l.getFragmentShaderID(f);let $=r.getRenderTarget(),ue=r.state.buffers.depth.getReversed(),Se=y.isInstancedMesh===!0,_e=y.isBatchedMesh===!0,Ae=!!f.map,ne=!!f.matcap,ae=!!P,se=!!f.aoMap,Te=!!f.lightMap,De=!!f.bumpMap,E=!!f.normalMap,b=!!f.displacementMap,z=!!f.emissiveMap,D=!!f.metalnessMap,M=!!f.roughnessMap,C=f.anisotropy>0,B=f.clearcoat>0,L=f.dispersion>0,Y=f.iridescence>0,H=f.sheen>0,W=f.transmission>0,te=C&&!!f.anisotropyMap,le=B&&!!f.clearcoatMap,ie=B&&!!f.clearcoatNormalMap,de=B&&!!f.clearcoatRoughnessMap,xe=Y&&!!f.iridescenceMap,be=Y&&!!f.iridescenceThicknessMap,Ve=H&&!!f.sheenColorMap,Qe=H&&!!f.sheenRoughnessMap,et=!!f.specularMap,ce=!!f.specularColorMap,we=!!f.specularIntensityMap,Ge=W&&!!f.transmissionMap,Nt=W&&!!f.thicknessMap,ve=!!f.gradientMap,tt=!!f.alphaMap,He=f.alphaTest>0,hi=!!f.alphaHash,Vi=!!f.extensions,F=en;f.toneMapped&&($!==null&&$.isXRRenderTarget!==!0||(F=r.toneMapping));let Et={shaderID:G,shaderType:f.type,shaderName:f.name,vertexShader:N,fragmentShader:U,defines:f.defines,customVertexShaderID:V,customFragmentShaderID:j,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:u,batching:_e,batchingColor:_e&&y._colorsTexture!==null,instancing:Se,instancingColor:Se&&y.instanceColor!==null,instancingMorph:Se&&y.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:$===null?r.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Un,alphaToCoverage:!!f.alphaToCoverage,map:Ae,matcap:ne,envMap:ae,envMapMode:ae&&P.mapping,envMapCubeUVHeight:I,aoMap:se,lightMap:Te,bumpMap:De,normalMap:E,displacementMap:p&&b,emissiveMap:z,normalMapObjectSpace:E&&f.normalMapType===Hu,normalMapTangentSpace:E&&f.normalMapType===Vu,metalnessMap:D,roughnessMap:M,anisotropy:C,anisotropyMap:te,clearcoat:B,clearcoatMap:le,clearcoatNormalMap:ie,clearcoatRoughnessMap:de,dispersion:L,iridescence:Y,iridescenceMap:xe,iridescenceThicknessMap:be,sheen:H,sheenColorMap:Ve,sheenRoughnessMap:Qe,specularMap:et,specularColorMap:ce,specularIntensityMap:we,transmission:W,transmissionMap:Ge,thicknessMap:Nt,gradientMap:ve,opaque:f.transparent===!1&&f.blending===kt&&f.alphaToCoverage===!1,alphaMap:tt,alphaTest:He,alphaHash:hi,combine:f.combine,mapUv:Ae&&g(f.map.channel),aoMapUv:se&&g(f.aoMap.channel),lightMapUv:Te&&g(f.lightMap.channel),bumpMapUv:De&&g(f.bumpMap.channel),normalMapUv:E&&g(f.normalMap.channel),displacementMapUv:b&&g(f.displacementMap.channel),emissiveMapUv:z&&g(f.emissiveMap.channel),metalnessMapUv:D&&g(f.metalnessMap.channel),roughnessMapUv:M&&g(f.roughnessMap.channel),anisotropyMapUv:te&&g(f.anisotropyMap.channel),clearcoatMapUv:le&&g(f.clearcoatMap.channel),clearcoatNormalMapUv:ie&&g(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&g(f.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&g(f.iridescenceMap.channel),iridescenceThicknessMapUv:be&&g(f.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&g(f.sheenColorMap.channel),sheenRoughnessMapUv:Qe&&g(f.sheenRoughnessMap.channel),specularMapUv:et&&g(f.specularMap.channel),specularColorMapUv:ce&&g(f.specularColorMap.channel),specularIntensityMapUv:we&&g(f.specularIntensityMap.channel),transmissionMapUv:Ge&&g(f.transmissionMap.channel),thicknessMapUv:Nt&&g(f.thicknessMap.channel),alphaMapUv:tt&&g(f.alphaMap.channel),vertexTangents:!!w.attributes.tangent&&(E||C),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!w.attributes.color&&w.attributes.color.itemSize===4,pointsUvs:y.isPoints===!0&&!!w.attributes.uv&&(Ae||tt),fog:!!T,useFog:f.fog===!0,fogExp2:!!T&&T.isFogExp2,flatShading:f.flatShading===!0&&f.wireframe===!1,sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ue,skinning:y.isSkinnedMesh===!0,morphTargets:w.morphAttributes.position!==void 0,morphNormals:w.morphAttributes.normal!==void 0,morphColors:w.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:K,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:f.dithering,shadowMapEnabled:r.shadowMap.enabled&&_.length>0,shadowMapType:r.shadowMap.type,toneMapping:F,decodeVideoTexture:Ae&&f.map.isVideoTexture===!0&&Je.getTransfer(f.map.colorSpace)===rt,decodeVideoTextureEmissive:z&&f.emissiveMap.isVideoTexture===!0&&Je.getTransfer(f.emissiveMap.colorSpace)===rt,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===gt,flipSided:f.side===Ut,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionClipCullDistance:Vi&&f.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Vi&&f.extensions.multiDraw===!0||_e)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()};return Et.vertexUv1s=c.has(1),Et.vertexUv2s=c.has(2),Et.vertexUv3s=c.has(3),c.clear(),Et},getProgramCacheKey:function(f){let v=[];if(f.shaderID?v.push(f.shaderID):(v.push(f.customVertexShaderID),v.push(f.customFragmentShaderID)),f.defines!==void 0)for(let _ in f.defines)v.push(_),v.push(f.defines[_]);return f.isRawShaderMaterial===!1&&((function(_,x){_.push(x.precision),_.push(x.outputColorSpace),_.push(x.envMapMode),_.push(x.envMapCubeUVHeight),_.push(x.mapUv),_.push(x.alphaMapUv),_.push(x.lightMapUv),_.push(x.aoMapUv),_.push(x.bumpMapUv),_.push(x.normalMapUv),_.push(x.displacementMapUv),_.push(x.emissiveMapUv),_.push(x.metalnessMapUv),_.push(x.roughnessMapUv),_.push(x.anisotropyMapUv),_.push(x.clearcoatMapUv),_.push(x.clearcoatNormalMapUv),_.push(x.clearcoatRoughnessMapUv),_.push(x.iridescenceMapUv),_.push(x.iridescenceThicknessMapUv),_.push(x.sheenColorMapUv),_.push(x.sheenRoughnessMapUv),_.push(x.specularMapUv),_.push(x.specularColorMapUv),_.push(x.specularIntensityMapUv),_.push(x.transmissionMapUv),_.push(x.thicknessMapUv),_.push(x.combine),_.push(x.fogExp2),_.push(x.sizeAttenuation),_.push(x.morphTargetsCount),_.push(x.morphAttributeCount),_.push(x.numDirLights),_.push(x.numPointLights),_.push(x.numSpotLights),_.push(x.numSpotLightMaps),_.push(x.numHemiLights),_.push(x.numRectAreaLights),_.push(x.numDirLightShadows),_.push(x.numPointLightShadows),_.push(x.numSpotLightShadows),_.push(x.numSpotLightShadowsWithMaps),_.push(x.numLightProbes),_.push(x.shadowMapType),_.push(x.toneMapping),_.push(x.numClippingPlanes),_.push(x.numClipIntersection),_.push(x.depthPacking)})(v,f),(function(_,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),_.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),_.push(o.mask)})(v,f),v.push(r.outputColorSpace)),v.push(f.customProgramCacheKey),v.join()},getUniforms:function(f){let v=m[f.type],_;if(v){let x=zi[v];_=ed.clone(x.uniforms)}else _=f.uniforms;return _},acquireProgram:function(f,v){let _;for(let x=0,y=h.length;x<y;x++){let T=h[x];if(T.cacheKey===v){_=T,++_.usedTimes;break}}return _===void 0&&(_=new nf(r,v,f,s),h.push(_)),_},releaseProgram:function(f){if(--f.usedTimes===0){let v=h.indexOf(f);h[v]=h[h.length-1],h.pop(),f.destroy()}},releaseShaderCache:function(f){l.remove(f)},programs:h,dispose:function(){l.dispose()}}}function af(){let r=new WeakMap;return{has:function(e){return r.has(e)},get:function(e){let t=r.get(e);return t===void 0&&(t={},r.set(e,t)),t},remove:function(e){r.delete(e)},update:function(e,t,i){r.get(e)[t]=i},dispose:function(){r=new WeakMap}}}function of(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function Ed(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Ad(){let r=[],e=0,t=[],i=[],n=[];function s(a,o,l,c,h,d){let p=r[e];return p===void 0?(p={id:a.id,object:a,geometry:o,material:l,groupOrder:c,renderOrder:a.renderOrder,z:h,group:d},r[e]=p):(p.id=a.id,p.object=a,p.geometry=o,p.material=l,p.groupOrder=c,p.renderOrder=a.renderOrder,p.z=h,p.group=d),e++,p}return{opaque:t,transmissive:i,transparent:n,init:function(){e=0,t.length=0,i.length=0,n.length=0},push:function(a,o,l,c,h,d){let p=s(a,o,l,c,h,d);l.transmission>0?i.push(p):l.transparent===!0?n.push(p):t.push(p)},unshift:function(a,o,l,c,h,d){let p=s(a,o,l,c,h,d);l.transmission>0?i.unshift(p):l.transparent===!0?n.unshift(p):t.unshift(p)},finish:function(){for(let a=e,o=r.length;a<o;a++){let l=r[a];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(a,o){t.length>1&&t.sort(a||of),i.length>1&&i.sort(o||Ed),n.length>1&&n.sort(o||Ed)}}}function lf(){let r=new WeakMap;return{get:function(e,t){let i=r.get(e),n;return i===void 0?(n=new Ad,r.set(e,[n])):t>=i.length?(n=new Ad,i.push(n)):n=i[t],n},dispose:function(){r=new WeakMap}}}function cf(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new S,color:new me};break;case"SpotLight":t={position:new S,direction:new S,color:new me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new S,color:new me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new S,skyColor:new me,groundColor:new me};break;case"RectAreaLight":t={color:new me,position:new S,halfWidth:new S,halfHeight:new S}}return r[e.id]=t,t}}}var hf=0;function uf(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function df(r){let e=new cf,t=(function(){let o={};return{get:function(l){if(o[l.id]!==void 0)return o[l.id];let c;switch(l.type){case"DirectionalLight":case"SpotLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case"PointLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J,shadowCameraNear:1,shadowCameraFar:1e3}}return o[l.id]=c,c}}})(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let o=0;o<9;o++)i.probe.push(new S);let n=new S,s=new fe,a=new fe;return{setup:function(o){let l=0,c=0,h=0;for(let R=0;R<9;R++)i.probe[R].set(0,0,0);let d=0,p=0,u=0,m=0,g=0,f=0,v=0,_=0,x=0,y=0,T=0;o.sort(uf);for(let R=0,P=o.length;R<P;R++){let I=o[R],G=I.color,k=I.intensity,O=I.distance,N=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)l+=G.r*k,c+=G.g*k,h+=G.b*k;else if(I.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(I.sh.coefficients[U],k);T++}else if(I.isDirectionalLight){let U=e.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let V=I.shadow,j=t.get(I);j.shadowIntensity=V.intensity,j.shadowBias=V.bias,j.shadowNormalBias=V.normalBias,j.shadowRadius=V.radius,j.shadowMapSize=V.mapSize,i.directionalShadow[d]=j,i.directionalShadowMap[d]=N,i.directionalShadowMatrix[d]=I.shadow.matrix,f++}i.directional[d]=U,d++}else if(I.isSpotLight){let U=e.get(I);U.position.setFromMatrixPosition(I.matrixWorld),U.color.copy(G).multiplyScalar(k),U.distance=O,U.coneCos=Math.cos(I.angle),U.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),U.decay=I.decay,i.spot[u]=U;let V=I.shadow;if(I.map&&(i.spotLightMap[x]=I.map,x++,V.updateMatrices(I),I.castShadow&&y++),i.spotLightMatrix[u]=V.matrix,I.castShadow){let j=t.get(I);j.shadowIntensity=V.intensity,j.shadowBias=V.bias,j.shadowNormalBias=V.normalBias,j.shadowRadius=V.radius,j.shadowMapSize=V.mapSize,i.spotShadow[u]=j,i.spotShadowMap[u]=N,_++}u++}else if(I.isRectAreaLight){let U=e.get(I);U.color.copy(G).multiplyScalar(k),U.halfWidth.set(.5*I.width,0,0),U.halfHeight.set(0,.5*I.height,0),i.rectArea[m]=U,m++}else if(I.isPointLight){let U=e.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),U.distance=I.distance,U.decay=I.decay,I.castShadow){let V=I.shadow,j=t.get(I);j.shadowIntensity=V.intensity,j.shadowBias=V.bias,j.shadowNormalBias=V.normalBias,j.shadowRadius=V.radius,j.shadowMapSize=V.mapSize,j.shadowCameraNear=V.camera.near,j.shadowCameraFar=V.camera.far,i.pointShadow[p]=j,i.pointShadowMap[p]=N,i.pointShadowMatrix[p]=I.shadow.matrix,v++}i.point[p]=U,p++}else if(I.isHemisphereLight){let U=e.get(I);U.skyColor.copy(I.color).multiplyScalar(k),U.groundColor.copy(I.groundColor).multiplyScalar(k),i.hemi[g]=U,g++}}m>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=c,i.ambient[2]=h;let w=i.hash;w.directionalLength===d&&w.pointLength===p&&w.spotLength===u&&w.rectAreaLength===m&&w.hemiLength===g&&w.numDirectionalShadows===f&&w.numPointShadows===v&&w.numSpotShadows===_&&w.numSpotMaps===x&&w.numLightProbes===T||(i.directional.length=d,i.spot.length=u,i.rectArea.length=m,i.point.length=p,i.hemi.length=g,i.directionalShadow.length=f,i.directionalShadowMap.length=f,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=f,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=_+x-y,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=y,i.numLightProbes=T,w.directionalLength=d,w.pointLength=p,w.spotLength=u,w.rectAreaLength=m,w.hemiLength=g,w.numDirectionalShadows=f,w.numPointShadows=v,w.numSpotShadows=_,w.numSpotMaps=x,w.numLightProbes=T,i.version=hf++)},setupView:function(o,l){let c=0,h=0,d=0,p=0,u=0,m=l.matrixWorldInverse;for(let g=0,f=o.length;g<f;g++){let v=o[g];if(v.isDirectionalLight){let _=i.directional[c];_.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(n),_.direction.transformDirection(m),c++}else if(v.isSpotLight){let _=i.spot[d];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(n),_.direction.transformDirection(m),d++}else if(v.isRectAreaLight){let _=i.rectArea[p];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),a.identity(),s.copy(v.matrixWorld),s.premultiply(m),a.extractRotation(s),_.halfWidth.set(.5*v.width,0,0),_.halfHeight.set(0,.5*v.height,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),p++}else if(v.isPointLight){let _=i.point[h];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),h++}else if(v.isHemisphereLight){let _=i.hemi[u];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(m),u++}}},state:i}}function Cd(r){let e=new df(r),t=[],i=[],n={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:function(s){n.camera=s,t.length=0,i.length=0},state:n,setupLights:function(){e.setup(t)},setupLightsView:function(s){e.setupView(t,s)},pushLight:function(s){t.push(s)},pushShadow:function(s){i.push(s)}}}function pf(r){let e=new WeakMap;return{get:function(t,i=0){let n=e.get(t),s;return n===void 0?(s=new Cd(r),e.set(t,[s])):i>=n.length?(s=new Cd(r),n.push(s)):s=n[i],s},dispose:function(){e=new WeakMap}}}function mf(r,e,t){let i=new gn,n=new J,s=new J,a=new Ke,o=new to({depthPacking:ku}),l=new io,c={},h=t.maxTextureSize,d={[yn]:Ut,[Ut]:yn,[gt]:gt},p=new st({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new J},radius:{value:4}},vertexShader:`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragmentShader:`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`}),u=p.clone();u.defines.HORIZONTAL_PASS=1;let m=new Ue;m.setAttribute("position",new ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new re(m,p),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tc;let v=this.type;function _(w,R){let P=e.update(g);p.defines.VSM_SAMPLES!==w.blurSamples&&(p.defines.VSM_SAMPLES=w.blurSamples,u.defines.VSM_SAMPLES=w.blurSamples,p.needsUpdate=!0,u.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Ni(n.x,n.y)),p.uniforms.shadow_pass.value=w.map.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,r.setRenderTarget(w.mapPass),r.clear(),r.renderBufferDirect(R,null,P,p,g,null),u.uniforms.shadow_pass.value=w.mapPass.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,r.setRenderTarget(w.map),r.clear(),r.renderBufferDirect(R,null,P,u,g,null)}function x(w,R,P,I){let G=null,k=P.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(k!==void 0)G=k;else if(G=P.isPointLight===!0?l:o,r.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let O=G.uuid,N=R.uuid,U=c[O];U===void 0&&(U={},c[O]=U);let V=U[N];V===void 0&&(V=G.clone(),U[N]=V,R.addEventListener("dispose",T)),G=V}return G.visible=R.visible,G.wireframe=R.wireframe,G.side=I===Bi?R.shadowSide!==null?R.shadowSide:R.side:R.shadowSide!==null?R.shadowSide:d[R.side],G.alphaMap=R.alphaMap,G.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,G.map=R.map,G.clipShadows=R.clipShadows,G.clippingPlanes=R.clippingPlanes,G.clipIntersection=R.clipIntersection,G.displacementMap=R.displacementMap,G.displacementScale=R.displacementScale,G.displacementBias=R.displacementBias,G.wireframeLinewidth=R.wireframeLinewidth,G.linewidth=R.linewidth,P.isPointLight===!0&&G.isMeshDistanceMaterial===!0&&(r.properties.get(G).light=P),G}function y(w,R,P,I,G){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&G===Bi)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,w.matrixWorld);let O=e.update(w),N=w.material;if(Array.isArray(N)){let U=O.groups;for(let V=0,j=U.length;V<j;V++){let K=U[V],$=N[K.materialIndex];if($&&$.visible){let ue=x(w,$,I,G);w.onBeforeShadow(r,w,R,P,O,ue,K),r.renderBufferDirect(P,null,O,ue,w,K),w.onAfterShadow(r,w,R,P,O,ue,K)}}}else if(N.visible){let U=x(w,N,I,G);w.onBeforeShadow(r,w,R,P,O,U,null),r.renderBufferDirect(P,null,O,U,w,null),w.onAfterShadow(r,w,R,P,O,U,null)}}let k=w.children;for(let O=0,N=k.length;O<N;O++)y(k[O],R,P,I,G)}function T(w){w.target.removeEventListener("dispose",T);for(let R in c){let P=c[R],I=w.target.uuid;I in P&&(P[I].dispose(),delete P[I])}}this.render=function(w,R,P){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||w.length===0)return;let I=r.getRenderTarget(),G=r.getActiveCubeFace(),k=r.getActiveMipmapLevel(),O=r.state;O.setBlending(Mn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let N=v!==Bi&&this.type===Bi,U=v===Bi&&this.type!==Bi;for(let V=0,j=w.length;V<j;V++){let K=w[V],$=K.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;n.copy($.mapSize);let ue=$.getFrameExtents();if(n.multiply(ue),s.copy($.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/ue.x),n.x=s.x*ue.x,$.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/ue.y),n.y=s.y*ue.y,$.mapSize.y=s.y)),$.map===null||N===!0||U===!0){let _e=this.type!==Bi?{minFilter:Ui,magFilter:Ui}:{};$.map!==null&&$.map.dispose(),$.map=new Ni(n.x,n.y,_e),$.map.texture.name=K.name+".shadowMap",$.camera.updateProjectionMatrix()}r.setRenderTarget($.map),r.clear();let Se=$.getViewportCount();for(let _e=0;_e<Se;_e++){let Ae=$.getViewport(_e);a.set(s.x*Ae.x,s.y*Ae.y,s.x*Ae.z,s.y*Ae.w),O.viewport(a),$.updateMatrices(K,_e),i=$.getFrustum(),y(R,P,$.camera,K,this.type)}$.isPointLightShadow!==!0&&this.type===Bi&&_($,P),$.needsUpdate=!1}v=this.type,f.needsUpdate=!1,r.setRenderTarget(I,G,k)}}var ff={[go]:vo,[_o]:Mo,[xo]:So,[Fs]:yo,[vo]:go,[Mo]:_o,[So]:xo,[yo]:Fs};function gf(r,e){let t=new function(){let M=!1,C=new Ke,B=null,L=new Ke(0,0,0,0);return{setMask:function(Y){B===Y||M||(r.colorMask(Y,Y,Y,Y),B=Y)},setLocked:function(Y){M=Y},setClear:function(Y,H,W,te,le){le===!0&&(Y*=te,H*=te,W*=te),C.set(Y,H,W,te),L.equals(C)===!1&&(r.clearColor(Y,H,W,te),L.copy(C))},reset:function(){M=!1,B=null,L.set(-1,0,0,0)}}},i=new function(){let M=!1,C=!1,B=null,L=null,Y=null;return{setReversed:function(H){if(C!==H){let W=e.get("EXT_clip_control");H?W.clipControlEXT(W.LOWER_LEFT_EXT,W.ZERO_TO_ONE_EXT):W.clipControlEXT(W.LOWER_LEFT_EXT,W.NEGATIVE_ONE_TO_ONE_EXT),C=H;let te=Y;Y=null,this.setClear(te)}},getReversed:function(){return C},setTest:function(H){H?ae(r.DEPTH_TEST):se(r.DEPTH_TEST)},setMask:function(H){B===H||M||(r.depthMask(H),B=H)},setFunc:function(H){if(C&&(H=ff[H]),L!==H){switch(H){case go:r.depthFunc(r.NEVER);break;case vo:r.depthFunc(r.ALWAYS);break;case _o:r.depthFunc(r.LESS);break;case Fs:r.depthFunc(r.LEQUAL);break;case xo:r.depthFunc(r.EQUAL);break;case yo:r.depthFunc(r.GEQUAL);break;case Mo:r.depthFunc(r.GREATER);break;case So:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}L=H}},setLocked:function(H){M=H},setClear:function(H){Y!==H&&(C&&(H=1-H),r.clearDepth(H),Y=H)},reset:function(){M=!1,B=null,L=null,Y=null,C=!1}}},n=new function(){let M=!1,C=null,B=null,L=null,Y=null,H=null,W=null,te=null,le=null;return{setTest:function(ie){M||(ie?ae(r.STENCIL_TEST):se(r.STENCIL_TEST))},setMask:function(ie){C===ie||M||(r.stencilMask(ie),C=ie)},setFunc:function(ie,de,xe){B===ie&&L===de&&Y===xe||(r.stencilFunc(ie,de,xe),B=ie,L=de,Y=xe)},setOp:function(ie,de,xe){H===ie&&W===de&&te===xe||(r.stencilOp(ie,de,xe),H=ie,W=de,te=xe)},setLocked:function(ie){M=ie},setClear:function(ie){le!==ie&&(r.clearStencil(ie),le=ie)},reset:function(){M=!1,C=null,B=null,L=null,Y=null,H=null,W=null,te=null,le=null}}},s=new WeakMap,a=new WeakMap,o={},l={},c=new WeakMap,h=[],d=null,p=!1,u=null,m=null,g=null,f=null,v=null,_=null,x=null,y=new me(0,0,0),T=0,w=!1,R=null,P=null,I=null,G=null,k=null,O=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,U=0,V=r.getParameter(r.VERSION);V.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(V)[1]),N=U>=1):V.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),N=U>=2);let j=null,K={},$=r.getParameter(r.SCISSOR_BOX),ue=r.getParameter(r.VIEWPORT),Se=new Ke().fromArray($),_e=new Ke().fromArray(ue);function Ae(M,C,B,L){let Y=new Uint8Array(4),H=r.createTexture();r.bindTexture(M,H),r.texParameteri(M,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(M,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let W=0;W<B;W++)M===r.TEXTURE_3D||M===r.TEXTURE_2D_ARRAY?r.texImage3D(C,0,r.RGBA,1,1,L,0,r.RGBA,r.UNSIGNED_BYTE,Y):r.texImage2D(C+W,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Y);return H}let ne={};function ae(M){o[M]!==!0&&(r.enable(M),o[M]=!0)}function se(M){o[M]!==!1&&(r.disable(M),o[M]=!1)}ne[r.TEXTURE_2D]=Ae(r.TEXTURE_2D,r.TEXTURE_2D,1),ne[r.TEXTURE_CUBE_MAP]=Ae(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[r.TEXTURE_2D_ARRAY]=Ae(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ne[r.TEXTURE_3D]=Ae(r.TEXTURE_3D,r.TEXTURE_3D,1,1),t.setClear(0,0,0,1),i.setClear(1),n.setClear(0),ae(r.DEPTH_TEST),i.setFunc(Fs),b(!1),z(ec),ae(r.CULL_FACE),E(Mn);let Te={[Ur]:r.FUNC_ADD,[cu]:r.FUNC_SUBTRACT,[hu]:r.FUNC_REVERSE_SUBTRACT};Te[uu]=r.MIN,Te[du]=r.MAX;let De={[pu]:r.ZERO,[mu]:r.ONE,[fu]:r.SRC_COLOR,[vu]:r.SRC_ALPHA,[bu]:r.SRC_ALPHA_SATURATE,[Mu]:r.DST_COLOR,[xu]:r.DST_ALPHA,[gu]:r.ONE_MINUS_SRC_COLOR,[_u]:r.ONE_MINUS_SRC_ALPHA,[Su]:r.ONE_MINUS_DST_COLOR,[yu]:r.ONE_MINUS_DST_ALPHA,[Tu]:r.CONSTANT_COLOR,[wu]:r.ONE_MINUS_CONSTANT_COLOR,[Eu]:r.CONSTANT_ALPHA,[Au]:r.ONE_MINUS_CONSTANT_ALPHA};function E(M,C,B,L,Y,H,W,te,le,ie){if(M!==Mn){if(p===!1&&(ae(r.BLEND),p=!0),M===lu)Y=Y||C,H=H||B,W=W||L,C===m&&Y===v||(r.blendEquationSeparate(Te[C],Te[Y]),m=C,v=Y),B===g&&L===f&&H===_&&W===x||(r.blendFuncSeparate(De[B],De[L],De[H],De[W]),g=B,f=L,_=H,x=W),te.equals(y)!==!1&&le===T||(r.blendColor(te.r,te.g,te.b,le),y.copy(te),T=le),u=M,w=!1;else if(M!==u||ie!==w){if(m===Ur&&v===Ur||(r.blendEquation(r.FUNC_ADD),m=Ur,v=Ur),ie)switch(M){case kt:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Ns:r.blendFunc(r.ONE,r.ONE);break;case ic:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case nc:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",M)}else switch(M){case kt:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Ns:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case ic:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case nc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",M)}g=null,f=null,_=null,x=null,y.set(0,0,0),T=0,u=M,w=ie}}else p===!0&&(se(r.BLEND),p=!1)}function b(M){R!==M&&(M?r.frontFace(r.CW):r.frontFace(r.CCW),R=M)}function z(M){M!==au?(ae(r.CULL_FACE),M!==P&&(M===ec?r.cullFace(r.BACK):M===ou?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):se(r.CULL_FACE),P=M}function D(M,C,B){M?(ae(r.POLYGON_OFFSET_FILL),G===C&&k===B||(r.polygonOffset(C,B),G=C,k=B)):se(r.POLYGON_OFFSET_FILL)}return{buffers:{color:t,depth:i,stencil:n},enable:ae,disable:se,bindFramebuffer:function(M,C){return l[M]!==C&&(r.bindFramebuffer(M,C),l[M]=C,M===r.DRAW_FRAMEBUFFER&&(l[r.FRAMEBUFFER]=C),M===r.FRAMEBUFFER&&(l[r.DRAW_FRAMEBUFFER]=C),!0)},drawBuffers:function(M,C){let B=h,L=!1;if(M){B=c.get(C),B===void 0&&(B=[],c.set(C,B));let Y=M.textures;if(B.length!==Y.length||B[0]!==r.COLOR_ATTACHMENT0){for(let H=0,W=Y.length;H<W;H++)B[H]=r.COLOR_ATTACHMENT0+H;B.length=Y.length,L=!0}}else B[0]!==r.BACK&&(B[0]=r.BACK,L=!0);L&&r.drawBuffers(B)},useProgram:function(M){return d!==M&&(r.useProgram(M),d=M,!0)},setBlending:E,setMaterial:function(M,C){M.side===gt?se(r.CULL_FACE):ae(r.CULL_FACE);let B=M.side===Ut;C&&(B=!B),b(B),M.blending===kt&&M.transparent===!1?E(Mn):E(M.blending,M.blendEquation,M.blendSrc,M.blendDst,M.blendEquationAlpha,M.blendSrcAlpha,M.blendDstAlpha,M.blendColor,M.blendAlpha,M.premultipliedAlpha),i.setFunc(M.depthFunc),i.setTest(M.depthTest),i.setMask(M.depthWrite),t.setMask(M.colorWrite);let L=M.stencilWrite;n.setTest(L),L&&(n.setMask(M.stencilWriteMask),n.setFunc(M.stencilFunc,M.stencilRef,M.stencilFuncMask),n.setOp(M.stencilFail,M.stencilZFail,M.stencilZPass)),D(M.polygonOffset,M.polygonOffsetFactor,M.polygonOffsetUnits),M.alphaToCoverage===!0?ae(r.SAMPLE_ALPHA_TO_COVERAGE):se(r.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:b,setCullFace:z,setLineWidth:function(M){M!==I&&(N&&r.lineWidth(M),I=M)},setPolygonOffset:D,setScissorTest:function(M){M?ae(r.SCISSOR_TEST):se(r.SCISSOR_TEST)},activeTexture:function(M){M===void 0&&(M=r.TEXTURE0+O-1),j!==M&&(r.activeTexture(M),j=M)},bindTexture:function(M,C,B){B===void 0&&(B=j===null?r.TEXTURE0+O-1:j);let L=K[B];L===void 0&&(L={type:void 0,texture:void 0},K[B]=L),L.type===M&&L.texture===C||(j!==B&&(r.activeTexture(B),j=B),r.bindTexture(M,C||ne[M]),L.type=M,L.texture=C)},unbindTexture:function(){let M=K[j];M!==void 0&&M.type!==void 0&&(r.bindTexture(M.type,null),M.type=void 0,M.texture=void 0)},compressedTexImage2D:function(){try{r.compressedTexImage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexImage3D:function(){try{r.compressedTexImage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texImage2D:function(){try{r.texImage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texImage3D:function(){try{r.texImage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},updateUBOMapping:function(M,C){let B=a.get(C);B===void 0&&(B=new WeakMap,a.set(C,B));let L=B.get(M);L===void 0&&(L=r.getUniformBlockIndex(C,M.name),B.set(M,L))},uniformBlockBinding:function(M,C){let B=a.get(C).get(M);s.get(C)!==B&&(r.uniformBlockBinding(C,B,M.__bindingPointIndex),s.set(C,B))},texStorage2D:function(){try{r.texStorage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texStorage3D:function(){try{r.texStorage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texSubImage2D:function(){try{r.texSubImage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texSubImage3D:function(){try{r.texSubImage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexSubImage2D:function(){try{r.compressedTexSubImage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexSubImage3D:function(){try{r.compressedTexSubImage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},scissor:function(M){Se.equals(M)===!1&&(r.scissor(M.x,M.y,M.z,M.w),Se.copy(M))},viewport:function(M){_e.equals(M)===!1&&(r.viewport(M.x,M.y,M.z,M.w),_e.copy(M))},reset:function(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),i.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),o={},j=null,K={},l={},c=new WeakMap,h=[],d=null,p=!1,u=null,m=null,g=null,f=null,v=null,_=null,x=null,y=new me(0,0,0),T=0,w=!1,R=null,P=null,I=null,G=null,k=null,Se.set(0,0,r.canvas.width,r.canvas.height),_e.set(0,0,r.canvas.width,r.canvas.height),t.reset(),i.reset(),n.reset()}}}function vf(r,e,t,i,n,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),c=new J,h=new WeakMap,d,p=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(E,b){return u?new OffscreenCanvas(E,b):_r("canvas")}function g(E,b,z){let D=1,M=De(E);if((M.width>z||M.height>z)&&(D=z/Math.max(M.width,M.height)),D<1){if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let C=Math.floor(D*M.width),B=Math.floor(D*M.height);d===void 0&&(d=m(C,B));let L=b?m(C,B):d;return L.width=C,L.height=B,L.getContext("2d").drawImage(E,0,0,C,B),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+M.width+"x"+M.height+") to ("+C+"x"+B+")."),L}return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+M.width+"x"+M.height+")."),E}return E}function f(E){return E.generateMipmaps}function v(E){r.generateMipmap(E)}function _(E){return E.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?r.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function x(E,b,z,D,M=!1){if(E!==null){if(r[E]!==void 0)return r[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let C=b;if(b===r.RED&&(z===r.FLOAT&&(C=r.R32F),z===r.HALF_FLOAT&&(C=r.R16F),z===r.UNSIGNED_BYTE&&(C=r.R8)),b===r.RED_INTEGER&&(z===r.UNSIGNED_BYTE&&(C=r.R8UI),z===r.UNSIGNED_SHORT&&(C=r.R16UI),z===r.UNSIGNED_INT&&(C=r.R32UI),z===r.BYTE&&(C=r.R8I),z===r.SHORT&&(C=r.R16I),z===r.INT&&(C=r.R32I)),b===r.RG&&(z===r.FLOAT&&(C=r.RG32F),z===r.HALF_FLOAT&&(C=r.RG16F),z===r.UNSIGNED_BYTE&&(C=r.RG8)),b===r.RG_INTEGER&&(z===r.UNSIGNED_BYTE&&(C=r.RG8UI),z===r.UNSIGNED_SHORT&&(C=r.RG16UI),z===r.UNSIGNED_INT&&(C=r.RG32UI),z===r.BYTE&&(C=r.RG8I),z===r.SHORT&&(C=r.RG16I),z===r.INT&&(C=r.RG32I)),b===r.RGB_INTEGER&&(z===r.UNSIGNED_BYTE&&(C=r.RGB8UI),z===r.UNSIGNED_SHORT&&(C=r.RGB16UI),z===r.UNSIGNED_INT&&(C=r.RGB32UI),z===r.BYTE&&(C=r.RGB8I),z===r.SHORT&&(C=r.RGB16I),z===r.INT&&(C=r.RGB32I)),b===r.RGBA_INTEGER&&(z===r.UNSIGNED_BYTE&&(C=r.RGBA8UI),z===r.UNSIGNED_SHORT&&(C=r.RGBA16UI),z===r.UNSIGNED_INT&&(C=r.RGBA32UI),z===r.BYTE&&(C=r.RGBA8I),z===r.SHORT&&(C=r.RGBA16I),z===r.INT&&(C=r.RGBA32I)),b===r.RGB&&(z===r.UNSIGNED_INT_5_9_9_9_REV&&(C=r.RGB9_E5),z===r.UNSIGNED_INT_10F_11F_11F_REV&&(C=r.R11F_G11F_B10F)),b===r.RGBA){let B=M?hs:Je.getTransfer(D);z===r.FLOAT&&(C=r.RGBA32F),z===r.HALF_FLOAT&&(C=r.RGBA16F),z===r.UNSIGNED_BYTE&&(C=B===rt?r.SRGB8_ALPHA8:r.RGBA8),z===r.UNSIGNED_SHORT_4_4_4_4&&(C=r.RGBA4),z===r.UNSIGNED_SHORT_5_5_5_1&&(C=r.RGB5_A1)}return C!==r.R16F&&C!==r.R32F&&C!==r.RG16F&&C!==r.RG32F&&C!==r.RGBA16F&&C!==r.RGBA32F||e.get("EXT_color_buffer_float"),C}function y(E,b){let z;return E?b===null||b===On||b===Or?z=r.DEPTH24_STENCIL8:b===yi?z=r.DEPTH32F_STENCIL8:b===Fr&&(z=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===On||b===Or?z=r.DEPTH_COMPONENT24:b===yi?z=r.DEPTH_COMPONENT32F:b===Fr&&(z=r.DEPTH_COMPONENT16),z}function T(E,b){return f(E)===!0||E.isFramebufferTexture&&E.minFilter!==Ui&&E.minFilter!==Di?Math.log2(Math.max(b.width,b.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?b.mipmaps.length:1}function w(E){let b=E.target;b.removeEventListener("dispose",w),(function(z){let D=i.get(z);if(D.__webglInit===void 0)return;let M=z.source,C=p.get(M);if(C){let B=C[D.__cacheKey];B.usedTimes--,B.usedTimes===0&&P(z),Object.keys(C).length===0&&p.delete(M)}i.remove(z)})(b),b.isVideoTexture&&h.delete(b)}function R(E){let b=E.target;b.removeEventListener("dispose",R),(function(z){let D=i.get(z);if(z.depthTexture&&(z.depthTexture.dispose(),i.remove(z.depthTexture)),z.isWebGLCubeRenderTarget)for(let C=0;C<6;C++){if(Array.isArray(D.__webglFramebuffer[C]))for(let B=0;B<D.__webglFramebuffer[C].length;B++)r.deleteFramebuffer(D.__webglFramebuffer[C][B]);else r.deleteFramebuffer(D.__webglFramebuffer[C]);D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer[C])}else{if(Array.isArray(D.__webglFramebuffer))for(let C=0;C<D.__webglFramebuffer.length;C++)r.deleteFramebuffer(D.__webglFramebuffer[C]);else r.deleteFramebuffer(D.__webglFramebuffer);if(D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer),D.__webglMultisampledFramebuffer&&r.deleteFramebuffer(D.__webglMultisampledFramebuffer),D.__webglColorRenderbuffer)for(let C=0;C<D.__webglColorRenderbuffer.length;C++)D.__webglColorRenderbuffer[C]&&r.deleteRenderbuffer(D.__webglColorRenderbuffer[C]);D.__webglDepthRenderbuffer&&r.deleteRenderbuffer(D.__webglDepthRenderbuffer)}let M=z.textures;for(let C=0,B=M.length;C<B;C++){let L=i.get(M[C]);L.__webglTexture&&(r.deleteTexture(L.__webglTexture),a.memory.textures--),i.remove(M[C])}i.remove(z)})(b)}function P(E){let b=i.get(E);r.deleteTexture(b.__webglTexture);let z=E.source;delete p.get(z)[b.__cacheKey],a.memory.textures--}let I=0;function G(E,b){let z=i.get(E);if(E.isVideoTexture&&(function(D){let M=a.render.frame;h.get(D)!==M&&(h.set(D,M),D.update())})(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&z.__version!==E.version){let D=E.image;if(D===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(D.complete!==!1)return void K(z,E,b);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}else E.isExternalTexture&&(z.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,z.__webglTexture,r.TEXTURE0+b)}let k={[fr]:r.REPEAT,[gr]:r.CLAMP_TO_EDGE,[Ia]:r.MIRRORED_REPEAT},O={[Ui]:r.NEAREST,[Bu]:r.NEAREST_MIPMAP_NEAREST,[Os]:r.NEAREST_MIPMAP_LINEAR,[Di]:r.LINEAR,[wo]:r.LINEAR_MIPMAP_NEAREST,[Bn]:r.LINEAR_MIPMAP_LINEAR},N={[Wu]:r.NEVER,[Ju]:r.ALWAYS,[Xu]:r.LESS,[zc]:r.LEQUAL,[ju]:r.EQUAL,[Zu]:r.GEQUAL,[qu]:r.GREATER,[Yu]:r.NOTEQUAL};function U(E,b){if(b.type!==yi||e.has("OES_texture_float_linear")!==!1||b.magFilter!==Di&&b.magFilter!==wo&&b.magFilter!==Os&&b.magFilter!==Bn&&b.minFilter!==Di&&b.minFilter!==wo&&b.minFilter!==Os&&b.minFilter!==Bn||console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(E,r.TEXTURE_WRAP_S,k[b.wrapS]),r.texParameteri(E,r.TEXTURE_WRAP_T,k[b.wrapT]),E!==r.TEXTURE_3D&&E!==r.TEXTURE_2D_ARRAY||r.texParameteri(E,r.TEXTURE_WRAP_R,k[b.wrapR]),r.texParameteri(E,r.TEXTURE_MAG_FILTER,O[b.magFilter]),r.texParameteri(E,r.TEXTURE_MIN_FILTER,O[b.minFilter]),b.compareFunction&&(r.texParameteri(E,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(E,r.TEXTURE_COMPARE_FUNC,N[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Ui||b.minFilter!==Os&&b.minFilter!==Bn||b.type===yi&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){let z=e.get("EXT_texture_filter_anisotropic");r.texParameterf(E,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,n.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function V(E,b){let z=!1;E.__webglInit===void 0&&(E.__webglInit=!0,b.addEventListener("dispose",w));let D=b.source,M=p.get(D);M===void 0&&(M={},p.set(D,M));let C=(function(B){let L=[];return L.push(B.wrapS),L.push(B.wrapT),L.push(B.wrapR||0),L.push(B.magFilter),L.push(B.minFilter),L.push(B.anisotropy),L.push(B.internalFormat),L.push(B.format),L.push(B.type),L.push(B.generateMipmaps),L.push(B.premultiplyAlpha),L.push(B.flipY),L.push(B.unpackAlignment),L.push(B.colorSpace),L.join()})(b);if(C!==E.__cacheKey){M[C]===void 0&&(M[C]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,z=!0),M[C].usedTimes++;let B=M[E.__cacheKey];B!==void 0&&(M[E.__cacheKey].usedTimes--,B.usedTimes===0&&P(b)),E.__cacheKey=C,E.__webglTexture=M[C].texture}return z}function j(E,b,z){return Math.floor(Math.floor(E/z)/b)}function K(E,b,z){let D=r.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(D=r.TEXTURE_2D_ARRAY),b.isData3DTexture&&(D=r.TEXTURE_3D);let M=V(E,b),C=b.source;t.bindTexture(D,E.__webglTexture,r.TEXTURE0+z);let B=i.get(C);if(C.version!==B.__version||M===!0){t.activeTexture(r.TEXTURE0+z);let L=Je.getPrimaries(Je.workingColorSpace),Y=b.colorSpace===zn?null:Je.getPrimaries(b.colorSpace),H=b.colorSpace===zn||L===Y?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,H);let W=g(b.image,!1,n.maxTextureSize);W=Te(b,W);let te=s.convert(b.format,b.colorSpace),le=s.convert(b.type),ie,de=x(b.internalFormat,te,le,b.colorSpace,b.isVideoTexture);U(D,b);let xe=b.mipmaps,be=b.isVideoTexture!==!0,Ve=B.__version===void 0||M===!0,Qe=C.dataReady,et=T(b,W);if(b.isDepthTexture)de=y(b.format===Gs,b.type),Ve&&(be?t.texStorage2D(r.TEXTURE_2D,1,de,W.width,W.height):t.texImage2D(r.TEXTURE_2D,0,de,W.width,W.height,0,te,le,null));else if(b.isDataTexture)if(xe.length>0){be&&Ve&&t.texStorage2D(r.TEXTURE_2D,et,de,xe[0].width,xe[0].height);for(let ce=0,we=xe.length;ce<we;ce++)ie=xe[ce],be?Qe&&t.texSubImage2D(r.TEXTURE_2D,ce,0,0,ie.width,ie.height,te,le,ie.data):t.texImage2D(r.TEXTURE_2D,ce,de,ie.width,ie.height,0,te,le,ie.data);b.generateMipmaps=!1}else be?(Ve&&t.texStorage2D(r.TEXTURE_2D,et,de,W.width,W.height),Qe&&(function(ce,we,Ge,Nt){let ve=ce.updateRanges;if(ve.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,we.width,we.height,Ge,Nt,we.data);else{ve.sort((F,Et)=>F.start-Et.start);let tt=0;for(let F=1;F<ve.length;F++){let Et=ve[tt],Ft=ve[F],pt=Et.start+Et.count,Tn=j(Ft.start,we.width,4),wn=j(Et.start,we.width,4);Ft.start<=pt+1&&Tn===wn&&j(Ft.start+Ft.count-1,we.width,4)===Tn?Et.count=Math.max(Et.count,Ft.start+Ft.count-Et.start):(++tt,ve[tt]=Ft)}ve.length=tt+1;let He=r.getParameter(r.UNPACK_ROW_LENGTH),hi=r.getParameter(r.UNPACK_SKIP_PIXELS),Vi=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,we.width);for(let F=0,Et=ve.length;F<Et;F++){let Ft=ve[F],pt=Math.floor(Ft.start/4),Tn=Math.ceil(Ft.count/4),wn=pt%we.width,jr=Math.floor(pt/we.width),js=Tn;r.pixelStorei(r.UNPACK_SKIP_PIXELS,wn),r.pixelStorei(r.UNPACK_SKIP_ROWS,jr),t.texSubImage2D(r.TEXTURE_2D,0,wn,jr,js,1,Ge,Nt,we.data)}ce.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,He),r.pixelStorei(r.UNPACK_SKIP_PIXELS,hi),r.pixelStorei(r.UNPACK_SKIP_ROWS,Vi)}})(b,W,te,le)):t.texImage2D(r.TEXTURE_2D,0,de,W.width,W.height,0,te,le,W.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){be&&Ve&&t.texStorage3D(r.TEXTURE_2D_ARRAY,et,de,xe[0].width,xe[0].height,W.depth);for(let ce=0,we=xe.length;ce<we;ce++)if(ie=xe[ce],b.format!==Mi)if(te!==null)if(be){if(Qe)if(b.layerUpdates.size>0){let Ge=Xc(ie.width,ie.height,b.format,b.type);for(let Nt of b.layerUpdates){let ve=ie.data.subarray(Nt*Ge/ie.data.BYTES_PER_ELEMENT,(Nt+1)*Ge/ie.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ce,0,0,Nt,ie.width,ie.height,1,te,ve)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ce,0,0,0,ie.width,ie.height,W.depth,te,ie.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ce,de,ie.width,ie.height,W.depth,0,ie.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else be?Qe&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ce,0,0,0,ie.width,ie.height,W.depth,te,le,ie.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ce,de,ie.width,ie.height,W.depth,0,te,le,ie.data)}else{be&&Ve&&t.texStorage2D(r.TEXTURE_2D,et,de,xe[0].width,xe[0].height);for(let ce=0,we=xe.length;ce<we;ce++)ie=xe[ce],b.format!==Mi?te!==null?be?Qe&&t.compressedTexSubImage2D(r.TEXTURE_2D,ce,0,0,ie.width,ie.height,te,ie.data):t.compressedTexImage2D(r.TEXTURE_2D,ce,de,ie.width,ie.height,0,ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):be?Qe&&t.texSubImage2D(r.TEXTURE_2D,ce,0,0,ie.width,ie.height,te,le,ie.data):t.texImage2D(r.TEXTURE_2D,ce,de,ie.width,ie.height,0,te,le,ie.data)}else if(b.isDataArrayTexture)if(be){if(Ve&&t.texStorage3D(r.TEXTURE_2D_ARRAY,et,de,W.width,W.height,W.depth),Qe)if(b.layerUpdates.size>0){let ce=Xc(W.width,W.height,b.format,b.type);for(let we of b.layerUpdates){let Ge=W.data.subarray(we*ce/W.data.BYTES_PER_ELEMENT,(we+1)*ce/W.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,we,W.width,W.height,1,te,le,Ge)}b.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,W.width,W.height,W.depth,te,le,W.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,de,W.width,W.height,W.depth,0,te,le,W.data);else if(b.isData3DTexture)be?(Ve&&t.texStorage3D(r.TEXTURE_3D,et,de,W.width,W.height,W.depth),Qe&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,W.width,W.height,W.depth,te,le,W.data)):t.texImage3D(r.TEXTURE_3D,0,de,W.width,W.height,W.depth,0,te,le,W.data);else if(b.isFramebufferTexture){if(Ve)if(be)t.texStorage2D(r.TEXTURE_2D,et,de,W.width,W.height);else{let ce=W.width,we=W.height;for(let Ge=0;Ge<et;Ge++)t.texImage2D(r.TEXTURE_2D,Ge,de,ce,we,0,te,le,null),ce>>=1,we>>=1}}else if(xe.length>0){if(be&&Ve){let ce=De(xe[0]);t.texStorage2D(r.TEXTURE_2D,et,de,ce.width,ce.height)}for(let ce=0,we=xe.length;ce<we;ce++)ie=xe[ce],be?Qe&&t.texSubImage2D(r.TEXTURE_2D,ce,0,0,te,le,ie):t.texImage2D(r.TEXTURE_2D,ce,de,te,le,ie);b.generateMipmaps=!1}else if(be){if(Ve){let ce=De(W);t.texStorage2D(r.TEXTURE_2D,et,de,ce.width,ce.height)}Qe&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,te,le,W)}else t.texImage2D(r.TEXTURE_2D,0,de,te,le,W);f(b)&&v(D),B.__version=C.version,b.onUpdate&&b.onUpdate(b)}E.__version=b.version}function $(E,b,z,D,M,C){let B=s.convert(z.format,z.colorSpace),L=s.convert(z.type),Y=x(z.internalFormat,B,L,z.colorSpace),H=i.get(b),W=i.get(z);if(W.__renderTarget=b,!H.__hasExternalTextures){let te=Math.max(1,b.width>>C),le=Math.max(1,b.height>>C);M===r.TEXTURE_3D||M===r.TEXTURE_2D_ARRAY?t.texImage3D(M,C,Y,te,le,b.depth,0,B,L,null):t.texImage2D(M,C,Y,te,le,0,B,L,null)}t.bindFramebuffer(r.FRAMEBUFFER,E),se(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,D,M,W.__webglTexture,0,ae(b)):(M===r.TEXTURE_2D||M>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&M<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,D,M,W.__webglTexture,C),t.bindFramebuffer(r.FRAMEBUFFER,null)}function ue(E,b,z){if(r.bindRenderbuffer(r.RENDERBUFFER,E),b.depthBuffer){let D=b.depthTexture,M=D&&D.isDepthTexture?D.type:null,C=y(b.stencilBuffer,M),B=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,L=ae(b);se(b)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,L,C,b.width,b.height):z?r.renderbufferStorageMultisample(r.RENDERBUFFER,L,C,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,C,b.width,b.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,B,r.RENDERBUFFER,E)}else{let D=b.textures;for(let M=0;M<D.length;M++){let C=D[M],B=s.convert(C.format,C.colorSpace),L=s.convert(C.type),Y=x(C.internalFormat,B,L,C.colorSpace),H=ae(b);z&&se(b)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,H,Y,b.width,b.height):se(b)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,H,Y,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,Y,b.width,b.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Se(E,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,E),!b.depthTexture||!b.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let z=i.get(b.depthTexture);z.__renderTarget=b,z.__webglTexture&&b.depthTexture.image.width===b.width&&b.depthTexture.image.height===b.height||(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),G(b.depthTexture,0);let D=z.__webglTexture,M=ae(b);if(b.depthTexture.format===zs)se(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,D,0,M):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,D,0);else{if(b.depthTexture.format!==Gs)throw new Error("Unknown depthTexture format");se(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,D,0,M):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,D,0)}}function _e(E){let b=i.get(E),z=E.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==E.depthTexture){let D=E.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),D){let M=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,D.removeEventListener("dispose",M)};D.addEventListener("dispose",M),b.__depthDisposeCallback=M}b.__boundDepthTexture=D}if(E.depthTexture&&!b.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");let D=E.texture.mipmaps;D&&D.length>0?Se(b.__webglFramebuffer[0],E):Se(b.__webglFramebuffer,E)}else if(z){b.__webglDepthbuffer=[];for(let D=0;D<6;D++)if(t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[D]),b.__webglDepthbuffer[D]===void 0)b.__webglDepthbuffer[D]=r.createRenderbuffer(),ue(b.__webglDepthbuffer[D],E,!1);else{let M=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,C=b.__webglDepthbuffer[D];r.bindRenderbuffer(r.RENDERBUFFER,C),r.framebufferRenderbuffer(r.FRAMEBUFFER,M,r.RENDERBUFFER,C)}}else{let D=E.texture.mipmaps;if(D&&D.length>0?t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=r.createRenderbuffer(),ue(b.__webglDepthbuffer,E,!1);else{let M=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,C=b.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,C),r.framebufferRenderbuffer(r.FRAMEBUFFER,M,r.RENDERBUFFER,C)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}let Ae=[],ne=[];function ae(E){return Math.min(n.maxSamples,E.samples)}function se(E){let b=i.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Te(E,b){let z=E.colorSpace,D=E.format,M=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||z!==Un&&z!==zn&&(Je.getTransfer(z)===rt?D===Mi&&M===Oi||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),b}function De(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=function(){let E=I;return E>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+n.maxTextures),I+=1,E},this.resetTextureUnits=function(){I=0},this.setTexture2D=G,this.setTexture2DArray=function(E,b){let z=i.get(E);E.isRenderTargetTexture===!1&&E.version>0&&z.__version!==E.version?K(z,E,b):t.bindTexture(r.TEXTURE_2D_ARRAY,z.__webglTexture,r.TEXTURE0+b)},this.setTexture3D=function(E,b){let z=i.get(E);E.isRenderTargetTexture===!1&&E.version>0&&z.__version!==E.version?K(z,E,b):t.bindTexture(r.TEXTURE_3D,z.__webglTexture,r.TEXTURE0+b)},this.setTextureCube=function(E,b){let z=i.get(E);E.version>0&&z.__version!==E.version?(function(D,M,C){if(M.image.length!==6)return;let B=V(D,M),L=M.source;t.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture,r.TEXTURE0+C);let Y=i.get(L);if(L.version!==Y.__version||B===!0){t.activeTexture(r.TEXTURE0+C);let H=Je.getPrimaries(Je.workingColorSpace),W=M.colorSpace===zn?null:Je.getPrimaries(M.colorSpace),te=M.colorSpace===zn||H===W?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,M.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,M.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let le=M.isCompressedTexture||M.image[0].isCompressedTexture,ie=M.image[0]&&M.image[0].isDataTexture,de=[];for(let ve=0;ve<6;ve++)de[ve]=le||ie?ie?M.image[ve].image:M.image[ve]:g(M.image[ve],!0,n.maxCubemapSize),de[ve]=Te(M,de[ve]);let xe=de[0],be=s.convert(M.format,M.colorSpace),Ve=s.convert(M.type),Qe=x(M.internalFormat,be,Ve,M.colorSpace),et=M.isVideoTexture!==!0,ce=Y.__version===void 0||B===!0,we=L.dataReady,Ge,Nt=T(M,xe);if(U(r.TEXTURE_CUBE_MAP,M),le){et&&ce&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Nt,Qe,xe.width,xe.height);for(let ve=0;ve<6;ve++){Ge=de[ve].mipmaps;for(let tt=0;tt<Ge.length;tt++){let He=Ge[tt];M.format!==Mi?be!==null?et?we&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,tt,0,0,He.width,He.height,be,He.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,tt,Qe,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):et?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,tt,0,0,He.width,He.height,be,Ve,He.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,tt,Qe,He.width,He.height,0,be,Ve,He.data)}}}else{if(Ge=M.mipmaps,et&&ce){Ge.length>0&&Nt++;let ve=De(de[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Nt,Qe,ve.width,ve.height)}for(let ve=0;ve<6;ve++)if(ie){et?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,de[ve].width,de[ve].height,be,Ve,de[ve].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,Qe,de[ve].width,de[ve].height,0,be,Ve,de[ve].data);for(let tt=0;tt<Ge.length;tt++){let He=Ge[tt].image[ve].image;et?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,tt+1,0,0,He.width,He.height,be,Ve,He.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,tt+1,Qe,He.width,He.height,0,be,Ve,He.data)}}else{et?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,be,Ve,de[ve]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,Qe,be,Ve,de[ve]);for(let tt=0;tt<Ge.length;tt++){let He=Ge[tt];et?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,tt+1,0,0,be,Ve,He.image[ve]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,tt+1,Qe,be,Ve,He.image[ve])}}}f(M)&&v(r.TEXTURE_CUBE_MAP),Y.__version=L.version,M.onUpdate&&M.onUpdate(M)}D.__version=M.version})(z,E,b):t.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture,r.TEXTURE0+b)},this.rebindTextures=function(E,b,z){let D=i.get(E);b!==void 0&&$(D.__webglFramebuffer,E,E.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),z!==void 0&&_e(E)},this.setupRenderTarget=function(E){let b=E.texture,z=i.get(E),D=i.get(b);E.addEventListener("dispose",R);let M=E.textures,C=E.isWebGLCubeRenderTarget===!0,B=M.length>1;if(B||(D.__webglTexture===void 0&&(D.__webglTexture=r.createTexture()),D.__version=b.version,a.memory.textures++),C){z.__webglFramebuffer=[];for(let L=0;L<6;L++)if(b.mipmaps&&b.mipmaps.length>0){z.__webglFramebuffer[L]=[];for(let Y=0;Y<b.mipmaps.length;Y++)z.__webglFramebuffer[L][Y]=r.createFramebuffer()}else z.__webglFramebuffer[L]=r.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){z.__webglFramebuffer=[];for(let L=0;L<b.mipmaps.length;L++)z.__webglFramebuffer[L]=r.createFramebuffer()}else z.__webglFramebuffer=r.createFramebuffer();if(B)for(let L=0,Y=M.length;L<Y;L++){let H=i.get(M[L]);H.__webglTexture===void 0&&(H.__webglTexture=r.createTexture(),a.memory.textures++)}if(E.samples>0&&se(E)===!1){z.__webglMultisampledFramebuffer=r.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let L=0;L<M.length;L++){let Y=M[L];z.__webglColorRenderbuffer[L]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,z.__webglColorRenderbuffer[L]);let H=s.convert(Y.format,Y.colorSpace),W=s.convert(Y.type),te=x(Y.internalFormat,H,W,Y.colorSpace,E.isXRRenderTarget===!0),le=ae(E);r.renderbufferStorageMultisample(r.RENDERBUFFER,le,te,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+L,r.RENDERBUFFER,z.__webglColorRenderbuffer[L])}r.bindRenderbuffer(r.RENDERBUFFER,null),E.depthBuffer&&(z.__webglDepthRenderbuffer=r.createRenderbuffer(),ue(z.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(C){t.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture),U(r.TEXTURE_CUBE_MAP,b);for(let L=0;L<6;L++)if(b.mipmaps&&b.mipmaps.length>0)for(let Y=0;Y<b.mipmaps.length;Y++)$(z.__webglFramebuffer[L][Y],E,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+L,Y);else $(z.__webglFramebuffer[L],E,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+L,0);f(b)&&v(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(B){for(let L=0,Y=M.length;L<Y;L++){let H=M[L],W=i.get(H),te=r.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(te=E.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(te,W.__webglTexture),U(te,H),$(z.__webglFramebuffer,E,H,r.COLOR_ATTACHMENT0+L,te,0),f(H)&&v(te)}t.unbindTexture()}else{let L=r.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(L=E.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(L,D.__webglTexture),U(L,b),b.mipmaps&&b.mipmaps.length>0)for(let Y=0;Y<b.mipmaps.length;Y++)$(z.__webglFramebuffer[Y],E,b,r.COLOR_ATTACHMENT0,L,Y);else $(z.__webglFramebuffer,E,b,r.COLOR_ATTACHMENT0,L,0);f(b)&&v(L),t.unbindTexture()}E.depthBuffer&&_e(E)},this.updateRenderTargetMipmap=function(E){let b=E.textures;for(let z=0,D=b.length;z<D;z++){let M=b[z];if(f(M)){let C=_(E),B=i.get(M).__webglTexture;t.bindTexture(C,B),v(C),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(E){if(E.samples>0){if(se(E)===!1){let b=E.textures,z=E.width,D=E.height,M=r.COLOR_BUFFER_BIT,C=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,B=i.get(E),L=b.length>1;if(L)for(let H=0;H<b.length;H++)t.bindFramebuffer(r.FRAMEBUFFER,B.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+H,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,B.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+H,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,B.__webglMultisampledFramebuffer);let Y=E.texture.mipmaps;Y&&Y.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,B.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,B.__webglFramebuffer);for(let H=0;H<b.length;H++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(M|=r.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(M|=r.STENCIL_BUFFER_BIT)),L){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,B.__webglColorRenderbuffer[H]);let W=i.get(b[H]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,W,0)}r.blitFramebuffer(0,0,z,D,0,0,z,D,M,r.NEAREST),l===!0&&(Ae.length=0,ne.length=0,Ae.push(r.COLOR_ATTACHMENT0+H),E.depthBuffer&&E.resolveDepthBuffer===!1&&(Ae.push(C),ne.push(C),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,ne)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Ae))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),L)for(let H=0;H<b.length;H++){t.bindFramebuffer(r.FRAMEBUFFER,B.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+H,r.RENDERBUFFER,B.__webglColorRenderbuffer[H]);let W=i.get(b[H]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,B.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+H,r.TEXTURE_2D,W,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,B.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){let b=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[b])}}},this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=$,this.useMultisampledRTT=se}function _f(r,e){return{convert:function(t,i=zn){let n,s=Je.getTransfer(i);if(t===Oi)return r.UNSIGNED_BYTE;if(t===Ao)return r.UNSIGNED_SHORT_4_4_4_4;if(t===Co)return r.UNSIGNED_SHORT_5_5_5_1;if(t===oc)return r.UNSIGNED_INT_5_9_9_9_REV;if(t===lc)return r.UNSIGNED_INT_10F_11F_11F_REV;if(t===sc)return r.BYTE;if(t===ac)return r.SHORT;if(t===Fr)return r.UNSIGNED_SHORT;if(t===Eo)return r.INT;if(t===On)return r.UNSIGNED_INT;if(t===yi)return r.FLOAT;if(t===Br)return r.HALF_FLOAT;if(t===Ou)return r.ALPHA;if(t===zu)return r.RGB;if(t===Mi)return r.RGBA;if(t===zs)return r.DEPTH_COMPONENT;if(t===Gs)return r.DEPTH_STENCIL;if(t===Ro)return r.RED;if(t===Po)return r.RED_INTEGER;if(t===Gu)return r.RG;if(t===cc)return r.RG_INTEGER;if(t===hc)return r.RGBA_INTEGER;if(t===Io||t===Lo||t===Uo||t===Do)if(s===rt){if(n=e.get("WEBGL_compressed_texture_s3tc_srgb"),n===null)return null;if(t===Io)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(t===Lo)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(t===Uo)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(t===Do)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(n=e.get("WEBGL_compressed_texture_s3tc"),n===null)return null;if(t===Io)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(t===Lo)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(t===Uo)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(t===Do)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(t===uc||t===dc||t===pc||t===mc){if(n=e.get("WEBGL_compressed_texture_pvrtc"),n===null)return null;if(t===uc)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(t===dc)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(t===pc)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(t===mc)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(t===fc||t===gc||t===vc){if(n=e.get("WEBGL_compressed_texture_etc"),n===null)return null;if(t===fc||t===gc)return s===rt?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(t===vc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC}if(t===_c||t===xc||t===yc||t===Mc||t===Sc||t===bc||t===Tc||t===wc||t===Ec||t===Ac||t===Cc||t===Rc||t===Pc||t===Ic){if(n=e.get("WEBGL_compressed_texture_astc"),n===null)return null;if(t===_c)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(t===xc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(t===yc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(t===Mc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(t===Sc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(t===bc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(t===Tc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(t===wc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(t===Ec)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(t===Ac)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(t===Cc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(t===Rc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(t===Pc)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(t===Ic)return s===rt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}if(t===Lc||t===Uc||t===Dc){if(n=e.get("EXT_texture_compression_bptc"),n===null)return null;if(t===Lc)return s===rt?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(t===Uc)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(t===Dc)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(t===Nc||t===Fc||t===Bc||t===Oc){if(n=e.get("EXT_texture_compression_rgtc"),n===null)return null;if(t===Nc)return n.COMPRESSED_RED_RGTC1_EXT;if(t===Fc)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(t===Bc)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(t===Oc)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return t===Or?r.UNSIGNED_INT_24_8:r[t]!==void 0?r[t]:null}}}var rh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new _s(e.texture);e.depthNear===t.depthNear&&e.depthFar===t.depthFar||(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new st({vertexShader:`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fragmentShader:`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new re(new Fi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},sh=class extends Ki{constructor(e,t){super();let i=this,n=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,p=null,u=null,m=null,g=typeof XRWebGLBinding<"u",f=new rh,v={},_=t.getContextAttributes(),x=null,y=null,T=[],w=[],R=new J,P=null,I=new Lt;I.viewport=new Ke;let G=new Lt;G.viewport=new Ke;let k=[I,G],O=new mo,N=null,U=null;function V(ne){let ae=w.indexOf(ne.inputSource);if(ae===-1)return;let se=T[ae];se!==void 0&&(se.update(ne.inputSource,ne.frame,c||a),se.dispatchEvent({type:ne.type,data:ne.inputSource}))}function j(){n.removeEventListener("select",V),n.removeEventListener("selectstart",V),n.removeEventListener("selectend",V),n.removeEventListener("squeeze",V),n.removeEventListener("squeezestart",V),n.removeEventListener("squeezeend",V),n.removeEventListener("end",j),n.removeEventListener("inputsourceschange",K);for(let ne=0;ne<T.length;ne++){let ae=w[ne];ae!==null&&(w[ne]=null,T[ne].disconnect(ae))}N=null,U=null,f.reset();for(let ne in v)delete v[ne];e.setRenderTarget(x),u=null,p=null,d=null,n=null,y=null,Ae.stop(),i.isPresenting=!1,e.setPixelRatio(P),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}function K(ne){for(let ae=0;ae<ne.removed.length;ae++){let se=ne.removed[ae],Te=w.indexOf(se);Te>=0&&(w[Te]=null,T[Te].disconnect(se))}for(let ae=0;ae<ne.added.length;ae++){let se=ne.added[ae],Te=w.indexOf(se);if(Te===-1){for(let E=0;E<T.length;E++){if(E>=w.length){w.push(se),Te=E;break}if(w[E]===null){w[E]=se,Te=E;break}}if(Te===-1)break}let De=T[Te];De&&De.connect(se)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let ae=T[ne];return ae===void 0&&(ae=new br,T[ne]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(ne){let ae=T[ne];return ae===void 0&&(ae=new br,T[ne]=ae),ae.getGripSpace()},this.getHand=function(ne){let ae=T[ne];return ae===void 0&&(ae=new br,T[ne]=ae),ae.getHandSpace()},this.setFramebufferScaleFactor=function(ne){s=ne,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){o=ne,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(ne){c=ne},this.getBaseLayer=function(){return p!==null?p:u},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(n,t)),d},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(ne){if(n=ne,n!==null){if(x=e.getRenderTarget(),n.addEventListener("select",V),n.addEventListener("selectstart",V),n.addEventListener("selectend",V),n.addEventListener("squeeze",V),n.addEventListener("squeezestart",V),n.addEventListener("squeezeend",V),n.addEventListener("end",j),n.addEventListener("inputsourceschange",K),_.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(R),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let ae=null,se=null,Te=null;_.depth&&(Te=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=_.stencil?Gs:zs,se=_.stencil?Or:On);let De={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:s};d=this.getBinding(),p=d.createProjectionLayer(De),n.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),y=new Ni(p.textureWidth,p.textureHeight,{format:Mi,type:Oi,depthTexture:new vs(p.textureWidth,p.textureHeight,se,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{let ae={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(n,t,ae),n.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new Ni(u.framebufferWidth,u.framebufferHeight,{format:Mi,type:Oi,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),Ae.setContext(n),Ae.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};let $=new S,ue=new S;function Se(ne,ae){ae===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(ae.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(n===null)return;let ae=ne.near,se=ne.far;f.texture!==null&&(f.depthNear>0&&(ae=f.depthNear),f.depthFar>0&&(se=f.depthFar)),O.near=G.near=I.near=ae,O.far=G.far=I.far=se,N===O.near&&U===O.far||(n.updateRenderState({depthNear:O.near,depthFar:O.far}),N=O.near,U=O.far),O.layers.mask=6|ne.layers.mask,I.layers.mask=3&O.layers.mask,G.layers.mask=5&O.layers.mask;let Te=ne.parent,De=O.cameras;Se(O,Te);for(let E=0;E<De.length;E++)Se(De[E],Te);De.length===2?(function(E,b,z){$.setFromMatrixPosition(b.matrixWorld),ue.setFromMatrixPosition(z.matrixWorld);let D=$.distanceTo(ue),M=b.projectionMatrix.elements,C=z.projectionMatrix.elements,B=M[14]/(M[10]-1),L=M[14]/(M[10]+1),Y=(M[9]+1)/M[5],H=(M[9]-1)/M[5],W=(M[8]-1)/M[0],te=(C[8]+1)/C[0],le=B*W,ie=B*te,de=D/(-W+te),xe=de*-W;if(b.matrixWorld.decompose(E.position,E.quaternion,E.scale),E.translateX(xe),E.translateZ(de),E.matrixWorld.compose(E.position,E.quaternion,E.scale),E.matrixWorldInverse.copy(E.matrixWorld).invert(),M[10]===-1)E.projectionMatrix.copy(b.projectionMatrix),E.projectionMatrixInverse.copy(b.projectionMatrixInverse);else{let be=B+de,Ve=L+de,Qe=le-xe,et=ie+(D-xe),ce=Y*L/Ve*be,we=H*L/Ve*be;E.projectionMatrix.makePerspective(Qe,et,ce,we,be,Ve),E.projectionMatrixInverse.copy(E.projectionMatrix).invert()}})(O,I,G):O.projectionMatrix.copy(I.projectionMatrix),(function(E,b,z){z===null?E.matrix.copy(b.matrixWorld):(E.matrix.copy(z.matrixWorld),E.matrix.invert(),E.matrix.multiply(b.matrixWorld)),E.matrix.decompose(E.position,E.quaternion,E.scale),E.updateMatrixWorld(!0),E.projectionMatrix.copy(b.projectionMatrix),E.projectionMatrixInverse.copy(b.projectionMatrixInverse),E.isPerspectiveCamera&&(E.fov=2*vr*Math.atan(1/E.projectionMatrix.elements[5]),E.zoom=1)})(ne,O,Te)},this.getCamera=function(){return O},this.getFoveation=function(){if(p!==null||u!==null)return l},this.setFoveation=function(ne){l=ne,p!==null&&(p.fixedFoveation=ne),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=ne)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(O)},this.getCameraTexture=function(ne){return v[ne]};let _e=null,Ae=new Rd;Ae.setAnimationLoop(function(ne,ae){if(h=ae.getViewerPose(c||a),m=ae,h!==null){let se=h.views;u!==null&&(e.setRenderTargetFramebuffer(y,u.framebuffer),e.setRenderTarget(y));let Te=!1;se.length!==O.cameras.length&&(O.cameras.length=0,Te=!0);for(let E=0;E<se.length;E++){let b=se[E],z=null;if(u!==null)z=u.getViewport(b);else{let M=d.getViewSubImage(p,b);z=M.viewport,E===0&&(e.setRenderTargetTextures(y,M.colorTexture,M.depthStencilTexture),e.setRenderTarget(y))}let D=k[E];D===void 0&&(D=new Lt,D.layers.enable(E),D.viewport=new Ke,k[E]=D),D.matrix.fromArray(b.transform.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale),D.projectionMatrix.fromArray(b.projectionMatrix),D.projectionMatrixInverse.copy(D.projectionMatrix).invert(),D.viewport.set(z.x,z.y,z.width,z.height),E===0&&(O.matrix.copy(D.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Te===!0&&O.cameras.push(D)}let De=n.enabledFeatures;if(De&&De.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&g){d=i.getBinding();let E=d.getDepthInformation(se[0]);E&&E.isValid&&E.texture&&f.init(E,n.renderState)}if(De&&De.includes("camera-access")&&g){e.state.unbindTexture(),d=i.getBinding();for(let E=0;E<se.length;E++){let b=se[E].camera;if(b){let z=v[b];z||(z=new _s,v[b]=z);let D=d.getCameraImage(b);z.sourceTexture=D}}}}for(let se=0;se<T.length;se++){let Te=w[se],De=T[se];Te!==null&&De!==void 0&&De.update(Te,ae,c||a)}_e&&_e(ne,ae),ae.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ae}),m=null}),this.setAnimationLoop=function(ne){_e=ne},this.dispose=function(){}}},Vn=new Fe,xf=new fe;function yf(r,e){function t(n,s){n.matrixAutoUpdate===!0&&n.updateMatrix(),s.value.copy(n.matrix)}function i(n,s){n.opacity.value=s.opacity,s.color&&n.diffuse.value.copy(s.color),s.emissive&&n.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(n.map.value=s.map,t(s.map,n.mapTransform)),s.alphaMap&&(n.alphaMap.value=s.alphaMap,t(s.alphaMap,n.alphaMapTransform)),s.bumpMap&&(n.bumpMap.value=s.bumpMap,t(s.bumpMap,n.bumpMapTransform),n.bumpScale.value=s.bumpScale,s.side===Ut&&(n.bumpScale.value*=-1)),s.normalMap&&(n.normalMap.value=s.normalMap,t(s.normalMap,n.normalMapTransform),n.normalScale.value.copy(s.normalScale),s.side===Ut&&n.normalScale.value.negate()),s.displacementMap&&(n.displacementMap.value=s.displacementMap,t(s.displacementMap,n.displacementMapTransform),n.displacementScale.value=s.displacementScale,n.displacementBias.value=s.displacementBias),s.emissiveMap&&(n.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,n.emissiveMapTransform)),s.specularMap&&(n.specularMap.value=s.specularMap,t(s.specularMap,n.specularMapTransform)),s.alphaTest>0&&(n.alphaTest.value=s.alphaTest);let a=e.get(s),o=a.envMap,l=a.envMapRotation;o&&(n.envMap.value=o,Vn.copy(l),Vn.x*=-1,Vn.y*=-1,Vn.z*=-1,o.isCubeTexture&&o.isRenderTargetTexture===!1&&(Vn.y*=-1,Vn.z*=-1),n.envMapRotation.value.setFromMatrix4(xf.makeRotationFromEuler(Vn)),n.flipEnvMap.value=o.isCubeTexture&&o.isRenderTargetTexture===!1?-1:1,n.reflectivity.value=s.reflectivity,n.ior.value=s.ior,n.refractionRatio.value=s.refractionRatio),s.lightMap&&(n.lightMap.value=s.lightMap,n.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,n.lightMapTransform)),s.aoMap&&(n.aoMap.value=s.aoMap,n.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,n.aoMapTransform))}return{refreshFogUniforms:function(n,s){s.color.getRGB(n.fogColor.value,Vc(r)),s.isFog?(n.fogNear.value=s.near,n.fogFar.value=s.far):s.isFogExp2&&(n.fogDensity.value=s.density)},refreshMaterialUniforms:function(n,s,a,o,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?i(n,s):s.isMeshToonMaterial?(i(n,s),(function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)})(n,s)):s.isMeshPhongMaterial?(i(n,s),(function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)})(n,s)):s.isMeshStandardMaterial?(i(n,s),(function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),h.envMap&&(c.envMapIntensity.value=h.envMapIntensity)})(n,s),s.isMeshPhysicalMaterial&&(function(c,h,d){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Ut&&c.clearcoatNormalScale.value.negate())),h.dispersion>0&&(c.dispersion.value=h.dispersion),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=d.texture,c.transmissionSamplerSize.value.set(d.width,d.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))})(n,s,l)):s.isMeshMatcapMaterial?(i(n,s),(function(c,h){h.matcap&&(c.matcap.value=h.matcap)})(n,s)):s.isMeshDepthMaterial?i(n,s):s.isMeshDistanceMaterial?(i(n,s),(function(c,h){let d=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(d.matrixWorld),c.nearDistance.value=d.shadow.camera.near,c.farDistance.value=d.shadow.camera.far})(n,s)):s.isMeshNormalMaterial?i(n,s):s.isLineBasicMaterial?((function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))})(n,s),s.isLineDashedMaterial&&(function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale})(n,s)):s.isPointsMaterial?(function(c,h,d,p){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*d,c.scale.value=.5*p,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(n,s,a,o):s.isSpriteMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(n,s):s.isShadowMaterial?(n.color.value.copy(s.color),n.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function Mf(r,e,t,i){let n={},s={},a=[],o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(d,p,u,m){let g=d.value,f=p+"_"+u;if(m[f]===void 0)return m[f]=typeof g=="number"||typeof g=="boolean"?g:g.clone(),!0;{let v=m[f];if(typeof g=="number"||typeof g=="boolean"){if(v!==g)return m[f]=g,!0}else if(v.equals(g)===!1)return v.copy(g),!0}return!1}function c(d){let p={boundary:0,storage:0};return typeof d=="number"||typeof d=="boolean"?(p.boundary=4,p.storage=4):d.isVector2?(p.boundary=8,p.storage=8):d.isVector3||d.isColor?(p.boundary=16,p.storage=12):d.isVector4?(p.boundary=16,p.storage=16):d.isMatrix3?(p.boundary=48,p.storage=48):d.isMatrix4?(p.boundary=64,p.storage=64):d.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",d),p}function h(d){let p=d.target;p.removeEventListener("dispose",h);let u=a.indexOf(p.__bindingPointIndex);a.splice(u,1),r.deleteBuffer(n[p.id]),delete n[p.id],delete s[p.id]}return{bind:function(d,p){let u=p.program;i.uniformBlockBinding(d,u)},update:function(d,p){let u=n[d.id];u===void 0&&((function(f){let v=f.uniforms,_=0,x=16;for(let T=0,w=v.length;T<w;T++){let R=Array.isArray(v[T])?v[T]:[v[T]];for(let P=0,I=R.length;P<I;P++){let G=R[P],k=Array.isArray(G.value)?G.value:[G.value];for(let O=0,N=k.length;O<N;O++){let U=c(k[O]),V=_%x,j=V%U.boundary,K=V+j;_+=j,K!==0&&x-K<U.storage&&(_+=x-K),G.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=_,_+=U.storage}}}let y=_%x;y>0&&(_+=x-y),f.__size=_,f.__cache={}})(d),u=(function(f){let v=(function(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0})();f.__bindingPointIndex=v;let _=r.createBuffer(),x=f.__size,y=f.usage;return r.bindBuffer(r.UNIFORM_BUFFER,_),r.bufferData(r.UNIFORM_BUFFER,x,y),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,v,_),_})(d),n[d.id]=u,d.addEventListener("dispose",h));let m=p.program;i.updateUBOMapping(d,m);let g=e.render.frame;s[d.id]!==g&&((function(f){let v=n[f.id],_=f.uniforms,x=f.__cache;r.bindBuffer(r.UNIFORM_BUFFER,v);for(let y=0,T=_.length;y<T;y++){let w=Array.isArray(_[y])?_[y]:[_[y]];for(let R=0,P=w.length;R<P;R++){let I=w[R];if(l(I,y,R,x)===!0){let G=I.__offset,k=Array.isArray(I.value)?I.value:[I.value],O=0;for(let N=0;N<k.length;N++){let U=k[N],V=c(U);typeof U=="number"||typeof U=="boolean"?(I.__data[0]=U,r.bufferSubData(r.UNIFORM_BUFFER,G+O,I.__data)):U.isMatrix3?(I.__data[0]=U.elements[0],I.__data[1]=U.elements[1],I.__data[2]=U.elements[2],I.__data[3]=0,I.__data[4]=U.elements[3],I.__data[5]=U.elements[4],I.__data[6]=U.elements[5],I.__data[7]=0,I.__data[8]=U.elements[6],I.__data[9]=U.elements[7],I.__data[10]=U.elements[8],I.__data[11]=0):(U.toArray(I.__data,O),O+=V.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,G,I.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)})(d),s[d.id]=g)},dispose:function(){for(let d in n)r.deleteBuffer(n[d]);a=[],n={},s={}}}}var Oo=class{constructor(e={}){let{canvas:t=Ku(),context:i=null,depth:n=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:p=!1}=e,u;if(this.isWebGLRenderer=!0,i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=a;let m=new Uint32Array(4),g=new Int32Array(4),f=null,v=null,_=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=en,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,T=!1;this._outputColorSpace=xt;let w=0,R=0,P=null,I=-1,G=null,k=new Ke,O=new Ke,N=null,U=new me(0),V=0,j=t.width,K=t.height,$=1,ue=null,Se=null,_e=new Ke(0,0,j,K),Ae=new Ke(0,0,j,K),ne=!1,ae=new gn,se=!1,Te=!1,De=new fe,E=new S,b=new Ke,z={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},D=!1;function M(){return P===null?$:1}let C,B,L,Y,H,W,te,le,ie,de,xe,be,Ve,Qe,et,ce,we,Ge,Nt,ve,tt,He,hi,Vi,F=i;function Et(A,X){return t.getContext(A,X)}try{let A={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",Tn,!1),t.addEventListener("webglcontextrestored",wn,!1),t.addEventListener("webglcontextcreationerror",jr,!1),F===null){let X="webgl2";if(F=Et(X,A),F===null)throw Et(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}function Ft(){C=new im(F),C.init(),He=new _f(F,C),B=new Kp(F,C,e,He),L=new gf(F,C),B.reversedDepthBuffer&&p&&L.buffers.depth.setReversed(!0),Y=new sm(F),H=new af,W=new vf(F,C,L,H,B,He,Y),te=new Qp(y),le=new tm(y),ie=new jp(F),hi=new Zp(F,ie),de=new nm(F,ie,Y,hi),xe=new om(F,de,ie,Y),Nt=new am(F,B,W),ce=new $p(H),be=new sf(y,te,le,C,B,hi,ce),Ve=new yf(y,H),Qe=new lf,et=new pf(C),Ge=new Yp(y,te,le,L,xe,u,l),we=new mf(y,xe,B),Vi=new Mf(F,Y,B,L),ve=new Jp(F,C,Y),tt=new rm(F,C,Y),Y.programs=be.programs,y.capabilities=B,y.extensions=C,y.properties=H,y.renderLists=Qe,y.shadowMap=we,y.state=L,y.info=Y}Ft();let pt=new sh(y,F);function Tn(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function wn(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let A=Y.autoReset,X=we.enabled,Z=we.autoUpdate,Q=we.needsUpdate,q=we.type;Ft(),Y.autoReset=A,we.enabled=X,we.autoUpdate=Z,we.needsUpdate=Q,we.type=q}function jr(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function js(A){let X=A.target;X.removeEventListener("dispose",js),(function(Z){(function(Q){let q=H.get(Q).programs;q!==void 0&&(q.forEach(function(ee){be.releaseProgram(ee)}),Q.isShaderMaterial&&be.releaseShaderCache(Q))})(Z),H.remove(Z)})(X)}function sl(A,X,Z){A.transparent===!0&&A.side===gt&&A.forceSinglePass===!1?(A.side=Ut,A.needsUpdate=!0,Ys(A,X,Z),A.side=yn,A.needsUpdate=!0,Ys(A,X,Z),A.side=gt):Ys(A,X,Z)}this.xr=pt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let A=C.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=C.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(A){A!==void 0&&($=A,this.setSize(j,K,!1))},this.getSize=function(A){return A.set(j,K)},this.setSize=function(A,X,Z=!0){pt.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(j=A,K=X,t.width=Math.floor(A*$),t.height=Math.floor(X*$),Z===!0&&(t.style.width=A+"px",t.style.height=X+"px"),this.setViewport(0,0,A,X))},this.getDrawingBufferSize=function(A){return A.set(j*$,K*$).floor()},this.setDrawingBufferSize=function(A,X,Z){j=A,K=X,$=Z,t.width=Math.floor(A*Z),t.height=Math.floor(X*Z),this.setViewport(0,0,A,X)},this.getCurrentViewport=function(A){return A.copy(k)},this.getViewport=function(A){return A.copy(_e)},this.setViewport=function(A,X,Z,Q){A.isVector4?_e.set(A.x,A.y,A.z,A.w):_e.set(A,X,Z,Q),L.viewport(k.copy(_e).multiplyScalar($).round())},this.getScissor=function(A){return A.copy(Ae)},this.setScissor=function(A,X,Z,Q){A.isVector4?Ae.set(A.x,A.y,A.z,A.w):Ae.set(A,X,Z,Q),L.scissor(O.copy(Ae).multiplyScalar($).round())},this.getScissorTest=function(){return ne},this.setScissorTest=function(A){L.setScissorTest(ne=A)},this.setOpaqueSort=function(A){ue=A},this.setTransparentSort=function(A){Se=A},this.getClearColor=function(A){return A.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(A=!0,X=!0,Z=!0){let Q=0;if(A){let q=!1;if(P!==null){let ee=P.texture.format;q=ee===hc||ee===cc||ee===Po}if(q){let ee=P.texture.type,he=ee===Oi||ee===On||ee===Fr||ee===Or||ee===Ao||ee===Co,pe=Ge.getClearColor(),ye=Ge.getClearAlpha(),Ce=pe.r,Pe=pe.g,Re=pe.b;he?(m[0]=Ce,m[1]=Pe,m[2]=Re,m[3]=ye,F.clearBufferuiv(F.COLOR,0,m)):(g[0]=Ce,g[1]=Pe,g[2]=Re,g[3]=ye,F.clearBufferiv(F.COLOR,0,g))}else Q|=F.COLOR_BUFFER_BIT}X&&(Q|=F.DEPTH_BUFFER_BIT),Z&&(Q|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Tn,!1),t.removeEventListener("webglcontextrestored",wn,!1),t.removeEventListener("webglcontextcreationerror",jr,!1),Ge.dispose(),Qe.dispose(),et.dispose(),H.dispose(),te.dispose(),le.dispose(),xe.dispose(),hi.dispose(),Vi.dispose(),be.dispose(),pt.dispose(),pt.removeEventListener("sessionstart",mh),pt.removeEventListener("sessionend",fh),En.stop()},this.renderBufferDirect=function(A,X,Z,Q,q,ee){X===null&&(X=z);let he=q.isMesh&&q.matrixWorld.determinant()<0,pe=(function(We,mt,It,ze,Ie){mt.isScene!==!0&&(mt=z),W.resetTextureUnits();let ui=mt.fog,ll=ze.isMeshStandardMaterial?mt.environment:null,Zs=P===null?y.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Un,rn=(ze.isMeshStandardMaterial?le:te).get(ze.envMap||ll),wi=ze.vertexColors===!0&&!!It.attributes.color&&It.attributes.color.itemSize===4,Yn=!!It.attributes.tangent&&(!!ze.normalMap||ze.anisotropy>0),Hi=!!It.morphAttributes.position,cl=!!It.morphAttributes.normal,Zn=!!It.morphAttributes.color,Mh=en;ze.toneMapped&&(P!==null&&P.isXRRenderTarget!==!0||(Mh=y.toneMapping));let Sh=It.morphAttributes.position||It.morphAttributes.normal||It.morphAttributes.color,ip=Sh!==void 0?Sh.length:0,Xe=H.get(ze),np=v.state.lights;if(se===!0&&(Te===!0||We!==G)){let si=We===G&&ze.id===I;ce.setState(ze,We,si)}let di=!1;ze.version===Xe.__version?Xe.needsLights&&Xe.lightsStateVersion!==np.state.version||Xe.outputColorSpace!==Zs||Ie.isBatchedMesh&&Xe.batching===!1?di=!0:Ie.isBatchedMesh||Xe.batching!==!0?Ie.isBatchedMesh&&Xe.batchingColor===!0&&Ie.colorTexture===null||Ie.isBatchedMesh&&Xe.batchingColor===!1&&Ie.colorTexture!==null||Ie.isInstancedMesh&&Xe.instancing===!1?di=!0:Ie.isInstancedMesh||Xe.instancing!==!0?Ie.isSkinnedMesh&&Xe.skinning===!1?di=!0:Ie.isSkinnedMesh||Xe.skinning!==!0?Ie.isInstancedMesh&&Xe.instancingColor===!0&&Ie.instanceColor===null||Ie.isInstancedMesh&&Xe.instancingColor===!1&&Ie.instanceColor!==null||Ie.isInstancedMesh&&Xe.instancingMorph===!0&&Ie.morphTexture===null||Ie.isInstancedMesh&&Xe.instancingMorph===!1&&Ie.morphTexture!==null||Xe.envMap!==rn||ze.fog===!0&&Xe.fog!==ui?di=!0:Xe.numClippingPlanes===void 0||Xe.numClippingPlanes===ce.numPlanes&&Xe.numIntersection===ce.numIntersection?(Xe.vertexAlphas!==wi||Xe.vertexTangents!==Yn||Xe.morphTargets!==Hi||Xe.morphNormals!==cl||Xe.morphColors!==Zn||Xe.toneMapping!==Mh||Xe.morphTargetsCount!==ip)&&(di=!0):di=!0:di=!0:di=!0:di=!0:(di=!0,Xe.__version=ze.version);let An=Xe.currentProgram;di===!0&&(An=Ys(ze,mt,Ie));let bh=!1,qr=!1,hl=!1,Mt=An.getUniforms(),sn=Xe.uniforms;if(L.useProgram(An.program)&&(bh=!0,qr=!0,hl=!0),ze.id!==I&&(I=ze.id,qr=!0),bh||G!==We){L.buffers.depth.getReversed()&&We.reversedDepth!==!0&&(We._reversedDepth=!0,We.updateProjectionMatrix()),Mt.setValue(F,"projectionMatrix",We.projectionMatrix),Mt.setValue(F,"viewMatrix",We.matrixWorldInverse);let si=Mt.map.cameraPosition;si!==void 0&&si.setValue(F,E.setFromMatrixPosition(We.matrixWorld)),B.logarithmicDepthBuffer&&Mt.setValue(F,"logDepthBufFC",2/(Math.log(We.far+1)/Math.LN2)),(ze.isMeshPhongMaterial||ze.isMeshToonMaterial||ze.isMeshLambertMaterial||ze.isMeshBasicMaterial||ze.isMeshStandardMaterial||ze.isShaderMaterial)&&Mt.setValue(F,"isOrthographic",We.isOrthographicCamera===!0),G!==We&&(G=We,qr=!0,hl=!0)}if(Ie.isSkinnedMesh){Mt.setOptional(F,Ie,"bindMatrix"),Mt.setOptional(F,Ie,"bindMatrixInverse");let si=Ie.skeleton;si&&(si.boneTexture===null&&si.computeBoneTexture(),Mt.setValue(F,"boneTexture",si.boneTexture,W))}Ie.isBatchedMesh&&(Mt.setOptional(F,Ie,"batchingTexture"),Mt.setValue(F,"batchingTexture",Ie._matricesTexture,W),Mt.setOptional(F,Ie,"batchingIdTexture"),Mt.setValue(F,"batchingIdTexture",Ie._indirectTexture,W),Mt.setOptional(F,Ie,"batchingColorTexture"),Ie._colorsTexture!==null&&Mt.setValue(F,"batchingColorTexture",Ie._colorsTexture,W));let ul=It.morphAttributes;ul.position===void 0&&ul.normal===void 0&&ul.color===void 0||Nt.update(Ie,It,An),(qr||Xe.receiveShadow!==Ie.receiveShadow)&&(Xe.receiveShadow=Ie.receiveShadow,Mt.setValue(F,"receiveShadow",Ie.receiveShadow)),ze.isMeshGouraudMaterial&&ze.envMap!==null&&(sn.envMap.value=rn,sn.flipEnvMap.value=rn.isCubeTexture&&rn.isRenderTargetTexture===!1?-1:1),ze.isMeshStandardMaterial&&ze.envMap===null&&mt.environment!==null&&(sn.envMapIntensity.value=mt.environmentIntensity),qr&&(Mt.setValue(F,"toneMappingExposure",y.toneMappingExposure),Xe.needsLights&&(pi=hl,(Ei=sn).ambientLightColor.needsUpdate=pi,Ei.lightProbe.needsUpdate=pi,Ei.directionalLights.needsUpdate=pi,Ei.directionalLightShadows.needsUpdate=pi,Ei.pointLights.needsUpdate=pi,Ei.pointLightShadows.needsUpdate=pi,Ei.spotLights.needsUpdate=pi,Ei.spotLightShadows.needsUpdate=pi,Ei.rectAreaLights.needsUpdate=pi,Ei.hemisphereLights.needsUpdate=pi),ui&&ze.fog===!0&&Ve.refreshFogUniforms(sn,ui),Ve.refreshMaterialUniforms(sn,ze,$,K,v.state.transmissionRenderTarget[We.id]),Gr.upload(F,xh(Xe),sn,W));var Ei,pi;if(ze.isShaderMaterial&&ze.uniformsNeedUpdate===!0&&(Gr.upload(F,xh(Xe),sn,W),ze.uniformsNeedUpdate=!1),ze.isSpriteMaterial&&Mt.setValue(F,"center",Ie.center),Mt.setValue(F,"modelViewMatrix",Ie.modelViewMatrix),Mt.setValue(F,"normalMatrix",Ie.normalMatrix),Mt.setValue(F,"modelMatrix",Ie.matrixWorld),ze.isShaderMaterial||ze.isRawShaderMaterial){let si=ze.uniformsGroups;for(let dl=0,rp=si.length;dl<rp;dl++){let Th=si[dl];Vi.update(Th,An),Vi.bind(Th,An)}}return An})(A,X,Z,Q,q);L.setMaterial(Q,he);let ye=Z.index,Ce=1;if(Q.wireframe===!0){if(ye=de.getWireframeAttribute(Z),ye===void 0)return;Ce=2}let Pe=Z.drawRange,Re=Z.attributes.position,Oe=Pe.start*Ce,ht=(Pe.start+Pe.count)*Ce;ee!==null&&(Oe=Math.max(Oe,ee.start*Ce),ht=Math.min(ht,(ee.start+ee.count)*Ce)),ye!==null?(Oe=Math.max(Oe,0),ht=Math.min(ht,ye.count)):Re!=null&&(Oe=Math.max(Oe,0),ht=Math.min(ht,Re.count));let vt=ht-Oe;if(vt<0||vt===1/0)return;let yt;hi.setup(q,Q,pe,Z,ye);let ut=ve;if(ye!==null&&(yt=ie.get(ye),ut=tt,ut.setIndex(yt)),q.isMesh)Q.wireframe===!0?(L.setLineWidth(Q.wireframeLinewidth*M()),ut.setMode(F.LINES)):ut.setMode(F.TRIANGLES);else if(q.isLine){let We=Q.linewidth;We===void 0&&(We=1),L.setLineWidth(We*M()),q.isLineSegments?ut.setMode(F.LINES):q.isLineLoop?ut.setMode(F.LINE_LOOP):ut.setMode(F.LINE_STRIP)}else q.isPoints?ut.setMode(F.POINTS):q.isSprite&&ut.setMode(F.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)xr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(C.get("WEBGL_multi_draw"))ut.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let We=q._multiDrawStarts,mt=q._multiDrawCounts,It=q._multiDrawCount,ze=ye?ie.get(ye).bytesPerElement:1,Ie=H.get(Q).currentProgram.getUniforms();for(let ui=0;ui<It;ui++)Ie.setValue(F,"_gl_DrawID",ui),ut.render(We[ui]/ze,mt[ui])}else if(q.isInstancedMesh)ut.renderInstances(Oe,vt,q.count);else if(Z.isInstancedBufferGeometry){let We=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,mt=Math.min(Z.instanceCount,We);ut.renderInstances(Oe,vt,mt)}else ut.render(Oe,vt)},this.compile=function(A,X,Z=null){Z===null&&(Z=A),v=et.get(Z),v.init(X),x.push(v),Z.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(v.pushLight(q),q.castShadow&&v.pushShadow(q))}),A!==Z&&A.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(v.pushLight(q),q.castShadow&&v.pushShadow(q))}),v.setupLights();let Q=new Set;return A.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let ee=q.material;if(ee)if(Array.isArray(ee))for(let he=0;he<ee.length;he++){let pe=ee[he];sl(pe,Z,q),Q.add(pe)}else sl(ee,Z,q),Q.add(ee)}),v=x.pop(),Q},this.compileAsync=function(A,X,Z=null){let Q=this.compile(A,X,Z);return new Promise(q=>{function ee(){Q.forEach(function(he){H.get(he).currentProgram.isReady()&&Q.delete(he)}),Q.size!==0?setTimeout(ee,10):q(A)}C.get("KHR_parallel_shader_compile")!==null?ee():setTimeout(ee,10)})};let al=null;function mh(){En.stop()}function fh(){En.start()}let En=new Rd;function ol(A,X,Z,Q){if(A.visible===!1)return;if(A.layers.test(X.layers)){if(A.isGroup)Z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(X);else if(A.isLight)v.pushLight(A),A.castShadow&&v.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ae.intersectsSprite(A)){Q&&b.setFromMatrixPosition(A.matrixWorld).applyMatrix4(De);let ee=xe.update(A),he=A.material;he.visible&&f.push(A,ee,he,Z,b.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ae.intersectsObject(A))){let ee=xe.update(A),he=A.material;if(Q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),b.copy(A.boundingSphere.center)):(ee.boundingSphere===null&&ee.computeBoundingSphere(),b.copy(ee.boundingSphere.center)),b.applyMatrix4(A.matrixWorld).applyMatrix4(De)),Array.isArray(he)){let pe=ee.groups;for(let ye=0,Ce=pe.length;ye<Ce;ye++){let Pe=pe[ye],Re=he[Pe.materialIndex];Re&&Re.visible&&f.push(A,ee,Re,Z,b.z,Pe)}}else he.visible&&f.push(A,ee,he,Z,b.z,null)}}let q=A.children;for(let ee=0,he=q.length;ee<he;ee++)ol(q[ee],X,Z,Q)}function gh(A,X,Z,Q){let q=A.opaque,ee=A.transmissive,he=A.transparent;v.setupLightsView(Z),se===!0&&ce.setGlobalState(y.clippingPlanes,Z),Q&&L.viewport(k.copy(Q)),q.length>0&&qs(q,X,Z),ee.length>0&&qs(ee,X,Z),he.length>0&&qs(he,X,Z),L.buffers.depth.setTest(!0),L.buffers.depth.setMask(!0),L.buffers.color.setMask(!0),L.setPolygonOffset(!1)}function vh(A,X,Z,Q){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[Q.id]===void 0&&(v.state.transmissionRenderTarget[Q.id]=new Ni(1,1,{generateMipmaps:!0,type:C.has("EXT_color_buffer_half_float")||C.has("EXT_color_buffer_float")?Br:Oi,minFilter:Bn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));let q=v.state.transmissionRenderTarget[Q.id],ee=Q.viewport||k;q.setSize(ee.z*y.transmissionResolutionScale,ee.w*y.transmissionResolutionScale);let he=y.getRenderTarget(),pe=y.getActiveCubeFace(),ye=y.getActiveMipmapLevel();y.setRenderTarget(q),y.getClearColor(U),V=y.getClearAlpha(),V<1&&y.setClearColor(16777215,.5),y.clear(),D&&Ge.render(Z);let Ce=y.toneMapping;y.toneMapping=en;let Pe=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),v.setupLightsView(Q),se===!0&&ce.setGlobalState(y.clippingPlanes,Q),qs(A,Z,Q),W.updateMultisampleRenderTarget(q),W.updateRenderTargetMipmap(q),C.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let Oe=0,ht=X.length;Oe<ht;Oe++){let vt=X[Oe],yt=vt.object,ut=vt.geometry,We=vt.material,mt=vt.group;if(We.side===gt&&yt.layers.test(Q.layers)){let It=We.side;We.side=Ut,We.needsUpdate=!0,_h(yt,Z,Q,ut,We,mt),We.side=It,We.needsUpdate=!0,Re=!0}}Re===!0&&(W.updateMultisampleRenderTarget(q),W.updateRenderTargetMipmap(q))}y.setRenderTarget(he,pe,ye),y.setClearColor(U,V),Pe!==void 0&&(Q.viewport=Pe),y.toneMapping=Ce}function qs(A,X,Z){let Q=X.isScene===!0?X.overrideMaterial:null;for(let q=0,ee=A.length;q<ee;q++){let he=A[q],pe=he.object,ye=he.geometry,Ce=he.group,Pe=he.material;Pe.allowOverride===!0&&Q!==null&&(Pe=Q),pe.layers.test(Z.layers)&&_h(pe,X,Z,ye,Pe,Ce)}}function _h(A,X,Z,Q,q,ee){A.onBeforeRender(y,X,Z,Q,q,ee),A.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),q.onBeforeRender(y,X,Z,Q,A,ee),q.transparent===!0&&q.side===gt&&q.forceSinglePass===!1?(q.side=Ut,q.needsUpdate=!0,y.renderBufferDirect(Z,X,Q,q,A,ee),q.side=yn,q.needsUpdate=!0,y.renderBufferDirect(Z,X,Q,q,A,ee),q.side=gt):y.renderBufferDirect(Z,X,Q,q,A,ee),A.onAfterRender(y,X,Z,Q,q,ee)}function Ys(A,X,Z){X.isScene!==!0&&(X=z);let Q=H.get(A),q=v.state.lights,ee=v.state.shadowsArray,he=q.state.version,pe=be.getParameters(A,q.state,ee,X,Z),ye=be.getProgramCacheKey(pe),Ce=Q.programs;Q.environment=A.isMeshStandardMaterial?X.environment:null,Q.fog=X.fog,Q.envMap=(A.isMeshStandardMaterial?le:te).get(A.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&A.envMap===null?X.environmentRotation:A.envMapRotation,Ce===void 0&&(A.addEventListener("dispose",js),Ce=new Map,Q.programs=Ce);let Pe=Ce.get(ye);if(Pe!==void 0){if(Q.currentProgram===Pe&&Q.lightsStateVersion===he)return yh(A,pe),Pe}else pe.uniforms=be.getUniforms(A),A.onBeforeCompile(pe,y),Pe=be.acquireProgram(pe,ye),Ce.set(ye,Pe),Q.uniforms=pe.uniforms;let Re=Q.uniforms;return(A.isShaderMaterial||A.isRawShaderMaterial)&&A.clipping!==!0||(Re.clippingPlanes=ce.uniform),yh(A,pe),Q.needsLights=(function(Oe){return Oe.isMeshLambertMaterial||Oe.isMeshToonMaterial||Oe.isMeshPhongMaterial||Oe.isMeshStandardMaterial||Oe.isShadowMaterial||Oe.isShaderMaterial&&Oe.lights===!0})(A),Q.lightsStateVersion=he,Q.needsLights&&(Re.ambientLightColor.value=q.state.ambient,Re.lightProbe.value=q.state.probe,Re.directionalLights.value=q.state.directional,Re.directionalLightShadows.value=q.state.directionalShadow,Re.spotLights.value=q.state.spot,Re.spotLightShadows.value=q.state.spotShadow,Re.rectAreaLights.value=q.state.rectArea,Re.ltc_1.value=q.state.rectAreaLTC1,Re.ltc_2.value=q.state.rectAreaLTC2,Re.pointLights.value=q.state.point,Re.pointLightShadows.value=q.state.pointShadow,Re.hemisphereLights.value=q.state.hemi,Re.directionalShadowMap.value=q.state.directionalShadowMap,Re.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Re.spotShadowMap.value=q.state.spotShadowMap,Re.spotLightMatrix.value=q.state.spotLightMatrix,Re.spotLightMap.value=q.state.spotLightMap,Re.pointShadowMap.value=q.state.pointShadowMap,Re.pointShadowMatrix.value=q.state.pointShadowMatrix),Q.currentProgram=Pe,Q.uniformsList=null,Pe}function xh(A){if(A.uniformsList===null){let X=A.currentProgram.getUniforms();A.uniformsList=Gr.seqWithValue(X.seq,A.uniforms)}return A.uniformsList}function yh(A,X){let Z=H.get(A);Z.outputColorSpace=X.outputColorSpace,Z.batching=X.batching,Z.batchingColor=X.batchingColor,Z.instancing=X.instancing,Z.instancingColor=X.instancingColor,Z.instancingMorph=X.instancingMorph,Z.skinning=X.skinning,Z.morphTargets=X.morphTargets,Z.morphNormals=X.morphNormals,Z.morphColors=X.morphColors,Z.morphTargetsCount=X.morphTargetsCount,Z.numClippingPlanes=X.numClippingPlanes,Z.numIntersection=X.numClipIntersection,Z.vertexAlphas=X.vertexAlphas,Z.vertexTangents=X.vertexTangents,Z.toneMapping=X.toneMapping}En.setAnimationLoop(function(A){al&&al(A)}),typeof self<"u"&&En.setContext(self),this.setAnimationLoop=function(A){al=A,pt.setAnimationLoop(A),A===null?En.stop():En.start()},pt.addEventListener("sessionstart",mh),pt.addEventListener("sessionend",fh),this.render=function(A,X){if(X!==void 0&&X.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(T===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),pt.enabled===!0&&pt.isPresenting===!0&&(pt.cameraAutoUpdate===!0&&pt.updateCamera(X),X=pt.getCamera()),A.isScene===!0&&A.onBeforeRender(y,A,X,P),v=et.get(A,x.length),v.init(X),x.push(v),De.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),ae.setFromProjectionMatrix(De,Ji,X.reversedDepth),Te=this.localClippingEnabled,se=ce.init(this.clippingPlanes,Te),f=Qe.get(A,_.length),f.init(),_.push(f),pt.enabled===!0&&pt.isPresenting===!0){let ee=y.xr.getDepthSensingMesh();ee!==null&&ol(ee,X,-1/0,y.sortObjects)}ol(A,X,0,y.sortObjects),f.finish(),y.sortObjects===!0&&f.sort(ue,Se),D=pt.enabled===!1||pt.isPresenting===!1||pt.hasDepthSensing()===!1,D&&Ge.addToRenderList(f,A),this.info.render.frame++,se===!0&&ce.beginShadows();let Z=v.state.shadowsArray;we.render(Z,A,X),se===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();let Q=f.opaque,q=f.transmissive;if(v.setupLights(),X.isArrayCamera){let ee=X.cameras;if(q.length>0)for(let he=0,pe=ee.length;he<pe;he++)vh(Q,q,A,ee[he]);D&&Ge.render(A);for(let he=0,pe=ee.length;he<pe;he++){let ye=ee[he];gh(f,A,ye,ye.viewport)}}else q.length>0&&vh(Q,q,A,X),D&&Ge.render(A),gh(f,A,X);P!==null&&R===0&&(W.updateMultisampleRenderTarget(P),W.updateRenderTargetMipmap(P)),A.isScene===!0&&A.onAfterRender(y,A,X),hi.resetDefaultState(),I=-1,G=null,x.pop(),x.length>0?(v=x[x.length-1],se===!0&&ce.setGlobalState(y.clippingPlanes,v.state.camera)):v=null,_.pop(),f=_.length>0?_[_.length-1]:null},this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(A,X,Z){let Q=H.get(A);Q.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),H.get(A.texture).__webglTexture=X,H.get(A.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:Z,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,X){let Z=H.get(A);Z.__webglFramebuffer=X,Z.__useDefaultFramebuffer=X===void 0};let Qd=F.createFramebuffer();this.setRenderTarget=function(A,X=0,Z=0){P=A,w=X,R=Z;let Q=!0,q=null,ee=!1,he=!1;if(A){let pe=H.get(A);if(pe.__useDefaultFramebuffer!==void 0)L.bindFramebuffer(F.FRAMEBUFFER,null),Q=!1;else if(pe.__webglFramebuffer===void 0)W.setupRenderTarget(A);else if(pe.__hasExternalTextures)W.rebindTextures(A,H.get(A.texture).__webglTexture,H.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Pe=A.depthTexture;if(pe.__boundDepthTexture!==Pe){if(Pe!==null&&H.has(Pe)&&(A.width!==Pe.image.width||A.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");W.setupDepthRenderbuffer(A)}}let ye=A.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(he=!0);let Ce=H.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(q=Array.isArray(Ce[X])?Ce[X][Z]:Ce[X],ee=!0):q=A.samples>0&&W.useMultisampledRTT(A)===!1?H.get(A).__webglMultisampledFramebuffer:Array.isArray(Ce)?Ce[Z]:Ce,k.copy(A.viewport),O.copy(A.scissor),N=A.scissorTest}else k.copy(_e).multiplyScalar($).floor(),O.copy(Ae).multiplyScalar($).floor(),N=ne;if(Z!==0&&(q=Qd),L.bindFramebuffer(F.FRAMEBUFFER,q)&&Q&&L.drawBuffers(A,q),L.viewport(k),L.scissor(O),L.setScissorTest(N),ee){let pe=H.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+X,pe.__webglTexture,Z)}else if(he){let pe=X;for(let ye=0;ye<A.textures.length;ye++){let Ce=H.get(A.textures[ye]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+ye,Ce.__webglTexture,Z,pe)}}else if(A!==null&&Z!==0){let pe=H.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,pe.__webglTexture,Z)}I=-1},this.readRenderTargetPixels=function(A,X,Z,Q,q,ee,he,pe=0){if(!A||!A.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=H.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&he!==void 0&&(ye=ye[he]),ye){L.bindFramebuffer(F.FRAMEBUFFER,ye);try{let Ce=A.textures[pe],Pe=Ce.format,Re=Ce.type;if(!B.textureFormatReadable(Pe))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");if(!B.textureTypeReadable(Re))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");X>=0&&X<=A.width-Q&&Z>=0&&Z<=A.height-q&&(A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+pe),F.readPixels(X,Z,Q,q,He.convert(Pe),He.convert(Re),ee))}finally{let Ce=P!==null?H.get(P).__webglFramebuffer:null;L.bindFramebuffer(F.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(A,X,Z,Q,q,ee,he,pe=0){if(!A||!A.isWebGLRenderTarget)throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=H.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&he!==void 0&&(ye=ye[he]),ye){if(X>=0&&X<=A.width-Q&&Z>=0&&Z<=A.height-q){L.bindFramebuffer(F.FRAMEBUFFER,ye);let Ce=A.textures[pe],Pe=Ce.format,Re=Ce.type;if(!B.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!B.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Oe=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Oe),F.bufferData(F.PIXEL_PACK_BUFFER,ee.byteLength,F.STREAM_READ),A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+pe),F.readPixels(X,Z,Q,q,He.convert(Pe),He.convert(Re),0);let ht=P!==null?H.get(P).__webglFramebuffer:null;L.bindFramebuffer(F.FRAMEBUFFER,ht);let vt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await $u(F,vt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Oe),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ee),F.deleteBuffer(Oe),F.deleteSync(vt),ee}throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,X=null,Z=0){let Q=Math.pow(2,-Z),q=Math.floor(A.image.width*Q),ee=Math.floor(A.image.height*Q),he=X!==null?X.x:0,pe=X!==null?X.y:0;W.setTexture2D(A,0),F.copyTexSubImage2D(F.TEXTURE_2D,Z,0,0,he,pe,q,ee),L.unbindTexture()};let ep=F.createFramebuffer(),tp=F.createFramebuffer();this.copyTextureToTexture=function(A,X,Z=null,Q=null,q=0,ee=null){let he,pe,ye,Ce,Pe,Re,Oe,ht,vt;ee===null&&(q!==0?(xr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ee=q,q=0):ee=0);let yt=A.isCompressedTexture?A.mipmaps[ee]:A.image;if(Z!==null)he=Z.max.x-Z.min.x,pe=Z.max.y-Z.min.y,ye=Z.isBox3?Z.max.z-Z.min.z:1,Ce=Z.min.x,Pe=Z.min.y,Re=Z.isBox3?Z.min.z:0;else{let wi=Math.pow(2,-q);he=Math.floor(yt.width*wi),pe=Math.floor(yt.height*wi),ye=A.isDataArrayTexture?yt.depth:A.isData3DTexture?Math.floor(yt.depth*wi):1,Ce=0,Pe=0,Re=0}Q!==null?(Oe=Q.x,ht=Q.y,vt=Q.z):(Oe=0,ht=0,vt=0);let ut=He.convert(X.format),We=He.convert(X.type),mt;X.isData3DTexture?(W.setTexture3D(X,0),mt=F.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(W.setTexture2DArray(X,0),mt=F.TEXTURE_2D_ARRAY):(W.setTexture2D(X,0),mt=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,X.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,X.unpackAlignment);let It=F.getParameter(F.UNPACK_ROW_LENGTH),ze=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Ie=F.getParameter(F.UNPACK_SKIP_PIXELS),ui=F.getParameter(F.UNPACK_SKIP_ROWS),ll=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,yt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,yt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ce),F.pixelStorei(F.UNPACK_SKIP_ROWS,Pe),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Re);let Zs=A.isDataArrayTexture||A.isData3DTexture,rn=X.isDataArrayTexture||X.isData3DTexture;if(A.isDepthTexture){let wi=H.get(A),Yn=H.get(X),Hi=H.get(wi.__renderTarget),cl=H.get(Yn.__renderTarget);L.bindFramebuffer(F.READ_FRAMEBUFFER,Hi.__webglFramebuffer),L.bindFramebuffer(F.DRAW_FRAMEBUFFER,cl.__webglFramebuffer);for(let Zn=0;Zn<ye;Zn++)Zs&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,H.get(A).__webglTexture,q,Re+Zn),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,H.get(X).__webglTexture,ee,vt+Zn)),F.blitFramebuffer(Ce,Pe,he,pe,Oe,ht,he,pe,F.DEPTH_BUFFER_BIT,F.NEAREST);L.bindFramebuffer(F.READ_FRAMEBUFFER,null),L.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(q!==0||A.isRenderTargetTexture||H.has(A)){let wi=H.get(A),Yn=H.get(X);L.bindFramebuffer(F.READ_FRAMEBUFFER,ep),L.bindFramebuffer(F.DRAW_FRAMEBUFFER,tp);for(let Hi=0;Hi<ye;Hi++)Zs?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,wi.__webglTexture,q,Re+Hi):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,wi.__webglTexture,q),rn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Yn.__webglTexture,ee,vt+Hi):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Yn.__webglTexture,ee),q!==0?F.blitFramebuffer(Ce,Pe,he,pe,Oe,ht,he,pe,F.COLOR_BUFFER_BIT,F.NEAREST):rn?F.copyTexSubImage3D(mt,ee,Oe,ht,vt+Hi,Ce,Pe,he,pe):F.copyTexSubImage2D(mt,ee,Oe,ht,Ce,Pe,he,pe);L.bindFramebuffer(F.READ_FRAMEBUFFER,null),L.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else rn?A.isDataTexture||A.isData3DTexture?F.texSubImage3D(mt,ee,Oe,ht,vt,he,pe,ye,ut,We,yt.data):X.isCompressedArrayTexture?F.compressedTexSubImage3D(mt,ee,Oe,ht,vt,he,pe,ye,ut,yt.data):F.texSubImage3D(mt,ee,Oe,ht,vt,he,pe,ye,ut,We,yt):A.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ee,Oe,ht,he,pe,ut,We,yt.data):A.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ee,Oe,ht,yt.width,yt.height,ut,yt.data):F.texSubImage2D(F.TEXTURE_2D,ee,Oe,ht,he,pe,ut,We,yt);F.pixelStorei(F.UNPACK_ROW_LENGTH,It),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ze),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ie),F.pixelStorei(F.UNPACK_SKIP_ROWS,ui),F.pixelStorei(F.UNPACK_SKIP_IMAGES,ll),ee===0&&X.generateMipmaps&&F.generateMipmap(mt),L.unbindTexture()},this.initRenderTarget=function(A){H.get(A).__webglFramebuffer===void 0&&W.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?W.setTextureCube(A,0):A.isData3DTexture?W.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?W.setTexture2DArray(A,0):W.setTexture2D(A,0),L.unbindTexture()},this.resetState=function(){w=0,R=0,P=null,L.reset(),hi.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};function ni(r,e=!1){let t=r[0].index!==null,i=new Set(Object.keys(r[0].attributes)),n=new Set(Object.keys(r[0].morphAttributes)),s={},a={},o=r[0].morphTargetsRelative,l=new Ue,c=0;for(let h=0;h<r.length;++h){let d=r[h],p=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let u in d.attributes){if(!i.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;s[u]===void 0&&(s[u]=[]),s[u].push(d.attributes[u]),p++}if(p!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let u in d.morphAttributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[u]===void 0&&(a[u]=[]),a[u].push(d.morphAttributes[u])}if(e){let u;if(t)u=d.index.count;else if(d.attributes.position!==void 0)u=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,u,h),c+=u}}if(t){let h=0,d=[];for(let p=0;p<r.length;++p){let u=r[p].index;for(let m=0;m<u.count;++m)d.push(u.getX(m)+h);h+=r[p].attributes.position.count}l.setIndex(d)}for(let h in s){let d=Dd(s[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in a){let d=a[h][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let p=0;p<d;++p){let u=[];for(let g=0;g<a[h].length;++g)u.push(a[h][g][p]);let m=Dd(u);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function Dd(r){let e,t,i,n=-1,s=0;for(let c=0;c<r.length;++c){let h=r[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=h.gpuType),n!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*t}let a=new e(s),o=new ke(a,t,i),l=0;for(let c=0;c<r.length;++c){let h=r[c];if(h.isInterleavedBufferAttribute){let d=l/t;for(let p=0,u=h.count;p<u;p++)for(let m=0;m<t;m++){let g=h.getComponent(p,m);o.setComponent(p+d,m,g)}}else a.set(h.array,l);l+=h.count*t}return n!==void 0&&(o.gpuType=n),o}function Go(r,e=Math.PI/3){let t=Math.cos(e),i=(1+1e-10)*100,n=[new S,new S,new S],s=new S,a=new S,o=new S,l=new S;function c(g){let f=~~(g.x*i),v=~~(g.y*i),_=~~(g.z*i);return`${f},${v},${_}`}let h=r.index?r.toNonIndexed():r,d=h.attributes.position,p={};for(let g=0,f=d.count/3;g<f;g++){let v=3*g,_=n[0].fromBufferAttribute(d,v+0),x=n[1].fromBufferAttribute(d,v+1),y=n[2].fromBufferAttribute(d,v+2);s.subVectors(y,x),a.subVectors(_,x);let T=new S().crossVectors(s,a).normalize();for(let w=0;w<3;w++){let R=n[w],P=c(R);P in p||(p[P]=[]),p[P].push(T)}}let u=new Float32Array(d.count*3),m=new ke(u,3,!1);for(let g=0,f=d.count/3;g<f;g++){let v=3*g,_=n[0].fromBufferAttribute(d,v+0),x=n[1].fromBufferAttribute(d,v+1),y=n[2].fromBufferAttribute(d,v+2);s.subVectors(y,x),a.subVectors(_,x),o.crossVectors(s,a).normalize();for(let T=0;T<3;T++){let w=n[T],R=c(w),P=p[R];l.set(0,0,0);for(let I=0,G=P.length;I<G;I++){let k=P[I];o.dot(k)>t&&l.add(k)}l.normalize(),m.setXYZ(v+T,l.x,l.y,l.z)}}return h.setAttribute("normal",m),h}var Nd=[{p:[-16,3.7607,-7],n:[-.02138,.88933,.45677],kind:"turret"},{p:[-16,.9173,-4],n:[-.13038,.96573,-.22443],kind:"plate"},{p:[-16,1.3029,-1.4],n:[-.28043,.72137,-.63323],kind:"plate"},{p:[-16,.8593,4],n:[-.13165,.96213,.2387],kind:"vent"},{p:[-16,3.7901,7],n:[-.03244,.89729,-.44025],kind:"plate"},{p:[-13,1.8718,-1.4],n:[-.24242,.97015,.00627],kind:"plate"},{p:[-13,1.8528,1.4],n:[-.24202,.97025,.0068],kind:"vent"},{p:[-13,3.8599,7],n:[-.02244,.86988,-.49275],kind:"turret"},{p:[-10,2.4306,-4],n:[-.24203,.97025,.00652],kind:"plate"},{p:[-10,2.4129,-1.4],n:[-.24185,.97029,.00666],kind:"vent"},{p:[-10,2.3938,1.4],n:[-.24189,.97028,.00661],kind:"plate"},{p:[-10,2.3757,4],n:[-.24227,.97018,.00722],kind:"plate"},{p:[-7,1.2164,-7],n:[-.00698,.89308,-.44985],kind:"vent"},{p:[-7,2.5171,-4],n:[-.00928,.99992,.00887],kind:"plate"},{p:[-7,2.4977,-1.4],n:[-.0089,.99993,.00734],kind:"turret"},{p:[-7,2.4771,1.4],n:[-.0089,.99993,.00734],kind:"vent"},{p:[-7,2.4583,4],n:[-.00896,.99993,.00754],kind:"plate"},{p:[-7,1.1334,7],n:[-.00848,.88602,.46357],kind:"plate"},{p:[-4,.7692,-7],n:[.07028,.9975,.00748],kind:"vent"},{p:[-4,2.1767,-4],n:[.15502,.74202,-.6522],kind:"plate"},{p:[-4,2.2464,-1.4],n:[.08736,.99615,.00751],kind:"plate"},{p:[-4,2.225,1.4],n:[.08743,.99614,.00736],kind:"turret"},{p:[-4,2.1741,4],n:[.15215,.73255,.66349],kind:"plate"},{p:[-4,.6954,7],n:[.07068,.99747,.0079],kind:"plate"},{p:[-1,1.5496,-4],n:[.15508,.74171,-.65254],kind:"vent"},{p:[-1,1.983,-1.4],n:[.08907,.996,.00649],kind:"plate"},{p:[-1,1.9618,1.4],n:[.08735,.99614,.00806],kind:"plate"},{p:[-1,1.5506,4],n:[.15223,.73208,.66399],kind:"vent"},{p:[2,.9224,-4],n:[.15508,.74171,-.65254],kind:"turret"},{p:[2,1.7143,-1.4],n:[.08804,.99609,.00684],kind:"plate"},{p:[2,1.6931,1.4],n:[.08794,.9961,.00758],kind:"vent"},{p:[2,.9268,4],n:[.15223,.73208,.66399],kind:"plate"},{p:[5,.3536,-4],n:[.13303,.74309,-.65583],kind:"plate"},{p:[5,1.4767,1.4],n:[.21054,.85972,.46535],kind:"vent"},{p:[5,.3633,4],n:[.12933,.73382,.66692],kind:"plate"},{p:[8,1.2261,-1.4],n:[.05337,.99611,.07009],kind:"turret"},{p:[8,1.1989,1.4],n:[.05113,.99767,-.04525],kind:"vent"},{p:[11,1.4165,-1.4],n:[.03472,.99937,.00729],kind:"plate"},{p:[11,1.3954,1.4],n:[.0347,.99937,.00755],kind:"plate"},{p:[14,1.0915,-1.4],n:[.10412,.99316,.05289],kind:"vent"}];var Bd={name:"Voyager Sovereign-class carrier",source:"Original Voyager design (fleet-hero.mjs)"},$t=0,ko=1,ri=2,oh=3,Hr=4,Ho=(r=0,e=0,t=0)=>new S(r,e,t);function Gi(r,e){let t=r.attributes.position.count,i=new Float32Array(t).fill(e);return r.setAttribute("paint",new ke(i,1)),r}function Hs(r,{pos:e=[0,0,0],rot:t=[0,0,0],scale:i=[1,1,1]}={}){return r.applyMatrix4(new fe().compose(Ho(...e),new $e().setFromEuler(new Fe(...t)),Ho(...i))),r}function Vo(r,e=24){let t=[],i=[];for(let[l,c,h,d=0,p=.55]of r)for(let u=0;u<e;u++){let m=u/e*Math.PI*2,g=Math.cos(m),f=Math.sin(m),_=1+(1/Math.pow(Math.pow(Math.abs(g),4)+Math.pow(Math.abs(f),4),.25)-1)*p;t.push(l,d+f*h*_,g*c*_)}let n=r.length;for(let l=0;l<n-1;l++)for(let c=0;c<e;c++){let h=l*e+c,d=l*e+(c+1)%e,p=h+e,u=d+e;i.push(h,d,p,d,u,p)}let s=t.length/3,a=s+1;t.push(r[0][0],r[0][3]||0,0,r[n-1][0],r[n-1][3]||0,0);for(let l=0;l<e;l++){i.push(s,(l+1)%e,l);let c=(n-1)*e;i.push(a,c+l,c+(l+1)%e)}let o=new Ue;return o.setAttribute("position",new ge(t,3)),o.setIndex(i),o.computeVertexNormals(),o.toNonIndexed()}function bt(r,e,t,i,n){return Gi(Hs(new qe(r,e,t).toNonIndexed(),n),i)}function tn(r,e,t,i,n,s=20){let a=new Me(r,e,t,s);return a.rotateZ(-Math.PI/2),Gi(Hs(a.toNonIndexed(),n),i)}function lh(r,e,t,i){let n=new Xt(r.map(([a,o])=>new J(a,o))),s=new Jt(n,{depth:e,bevelEnabled:!0,bevelThickness:.05,bevelSize:.05,bevelSegments:1});return s.rotateX(Math.PI/2),s.translate(0,e/2,0),Gi(Hs(s,i),t)}function Fd(r,e,t,i){let n=new Xt(r.map(([a,o])=>new J(a,o))),s=new Jt(n,{depth:e,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:1});return s.translate(0,0,-e/2),Gi(Hs(s,i),t)}function Od(){let r=[];r.push(Gi(Vo([[20,.5,.35,-.2,.2],[17.5,1.6,1,-.1,.4],[13,3,1.9,0,.55],[7,4.3,2.5,0,.6],[0,4.8,2.7,0,.65],[-8,4.8,2.6,0,.7],[-15,4.2,2.4,0,.7],[-19.4,3.4,2.1,-.1,.75]],28),$t)),r.push(Gi(Vo([[14,1.4,.6,-2.4,.6],[4,2.4,1,-2.9,.7],[-10,2.4,1,-2.9,.7],[-17,1.6,.7,-2.6,.6]],16),ri));for(let t of[8,-2,-12])r.push(tn(.55,.55,1.2,Hr,{pos:[t,-3.9,0],rot:[0,0,Math.PI/2]},16));r.push(bt(13,.9,6.4,$t,{pos:[-5,2.3,0]})),r.push(bt(12.2,.14,5.6,ko,{pos:[-5,2.8,0]})),r.push(bt(5,2,3.6,$t,{pos:[2.5,3.4,0]})),r.push(bt(4.6,.5,3.7,oh,{pos:[2.6,3.95,0]})),r.push(bt(3.4,.6,2.4,ri,{pos:[2.6,4.7,0]})),r.push(tn(.08,.14,1.6,Hr,{pos:[1.6,5.6,0],rot:[0,0,Math.PI/2]},8));for(let t of[-1,1]){r.push(lh([[9,4.2],[4,8.9],[-13,9.4],[-17,8.6],[-17,4.2]].map(([i,n])=>[i,n*t]),1.5,$t,{pos:[0,.1,0]})),r.push(lh([[8,4.3],[3.4,8.6],[-12.6,9.1],[-16.4,8.3],[-16.4,4.3]].map(([i,n])=>[i,n*t]),.18,ko,{pos:[0,.95,0]})),r.push(bt(2.2,1.1,2.6,ri,{pos:[5.2,.1,t*6.5],rot:[0,t*-.62,0]})),r.push(bt(14,.08,.2,oh,{pos:[-6,.98,t*8.9]})),r.push(Gi(Vo([[-4,1.5,1.1,2.4,.7],[-8,1.9,1.45,2.4,.75],[-16,1.9,1.45,2.4,.75],[-18.6,1.6,1.2,2.3,.75]],18).applyMatrix4(new fe().makeTranslation(0,0,t*7)),$t)),r.push(bt(9,.12,2.6,ko,{pos:[-12,3.9,t*7]})),r.push(tn(1.05,1.15,1.6,Hr,{pos:[-19.2,2.3,t*7]},18)),r.push(tn(.8,1.05,.5,ri,{pos:[-20,2.3,t*7]},18)),r.push(tn(1.55,1.75,5.2,ri,{pos:[-17.4,-.35,t*4.7]},24)),r.push(tn(1.35,1.55,.9,Hr,{pos:[-19.5,-.35,t*4.7]},24)),r.push(tn(.95,1.05,3.6,ri,{pos:[-18.2,-.6,t*1.25]},20)),r.push(tn(.82,.95,.7,Hr,{pos:[-19.9,-.6,t*1.25]},20)),r.push(bt(5,1.2,1.4,$t,{pos:[-16,.9,t*4.7]}));for(let i=0;i<4;i++)r.push(bt(3.2,.05,.9,ri,{pos:[-16.5+i*.1,1.7+i*.22,t*(6.2+i*.1)],rot:[t*.35,0,0]}));r.push(Fd([[-12,-2.2],[-18.8,-2.2],[-19.6,-4.9],[-15,-4.6]],.3,$t,{pos:[0,0,t*2.6],rot:[t*.55,0,0]})),r.push(Fd([[15.5,.4],[11.5,.4],[11,2.1],[14.4,1.9]],.22,$t,{pos:[0,0,t*2.3],rot:[t*-.5,0,0]}));for(let i=0;i<6;i++)r.push(bt(1.6,.22,.5,ri,{pos:[12-i*2.3,-1.5,t*(2.2+i*.3)]}));for(let i=0;i<9;i++)r.push(bt(1.1,.6,.12,ri,{pos:[9-i*2.9,.6,t*4.72]})),r.push(bt(1.1,.12,.12,oh,{pos:[9-i*2.9,1.1,t*4.74]}));for(let i=0;i<5;i++)r.push(bt(.5,.2,1.6,ri,{pos:[-2-i*2.4,2.9,t*2.1]}))}r.push(bt(6,.45,1.2,ri,{pos:[14,-1.2,0]})),r.push(bt(10,.5,1.4,$t,{pos:[8.5,2.3,0]})),r.push(bt(9,.12,.9,ko,{pos:[8.5,2.58,0]})),r.push(bt(2.8,3.6,4.2,ri,{pos:[-19.2,-.4,0]})),r.push(Gi(Hs(new at(.9,16,8,0,Math.PI*2,0,Math.PI/2).toNonIndexed(),{pos:[-14,4.2,0],rot:[0,0,Math.PI/2]}),Hr));let e=ni(r.map(t=>{let i=t.attributes.position.count;t.attributes.paint||Gi(t,$t),t.attributes.normal||t.computeVertexNormals();for(let n of Object.keys(t.attributes))["position","normal","paint"].includes(n)||t.deleteAttribute(n);return t}),!1);return e.computeBoundingBox(),e.computeVertexNormals(),e}function zd(){let r=[Gi(Vo([[20,.5,.35,-.2,.2],[13,3,1.9,0,.55],[0,4.8,2.7,0,.65],[-15,4.2,2.4,0,.7],[-19.4,3.4,2.1,-.1,.75]],12),$t),bt(13,.9,6.4,$t,{pos:[-5,2.3,0]}),bt(5,2,3.6,$t,{pos:[2.5,3.4,0]})];for(let t of[-1,1])r.push(lh([[9,4.2],[4,8.9],[-13,9.4],[-17,8.6],[-17,4.2]].map(([i,n])=>[i,n*t]),1.5,$t,{pos:[0,.1,0]})),r.push(tn(1.55,1.75,5.2,ri,{pos:[-17.4,-.35,t*4.7]},10));let e=ni(r.map(t=>{for(let i of Object.keys(t.attributes))["position","normal","paint"].includes(i)||t.deleteAttribute(i);return t}),!1);return e.computeVertexNormals(),e}function Wo(r,e){let t=new re(r,new je({side:gt})),i=new Ds,n=[];for(let s of e){let a=Ho(s.x,s.below?-30:30,s.z),o=Ho(0,s.below?1:-1,0);i.set(a,o);let l=i.intersectObject(t,!1)[0];if(l){let c=l.face.normal.clone();c.y<0&&!s.below&&c.negate(),n.push({...s,hit:!0,p:[l.point.x,l.point.y,l.point.z],n:[c.x,c.y,c.z]})}else n.push({...s,hit:!1,p:[s.x,s.fallbackY??0,s.z],n:[0,1,0]})}return t.material.dispose(),n}var Sf=new S(0,1,0);function bf(r,e,t){let i=r/2,n=t/2,s=.08,a=new Xt;a.moveTo(-i+s,-n),a.lineTo(i-s,-n),a.lineTo(i,-n+s),a.lineTo(i,n-s),a.lineTo(i-s,n),a.lineTo(-i+s,n),a.lineTo(-i,n-s),a.lineTo(-i,-n+s),a.closePath();let o=new Jt(a,{depth:e,bevelEnabled:!0,bevelThickness:.013,bevelSize:.014,bevelSegments:2,steps:1});return o.rotateX(-Math.PI/2),o.translate(0,-e/2,0),o}function Tf(r){return Math.min(7,Math.max(0,Math.floor((r.x+20)/5)))+8*(r.z<-1.8?0:r.z>1.8?2:1)+24*(r.y>.8?1:0)}function Gd(r,e,t,i){let n=Wo(i,Nd.map(p=>({x:p.p[0],z:p.p[2],kind:p.kind,fallbackY:p.p[1]}))).filter(p=>p.hit),s=[new lt({color:9016994,metalness:.88,roughness:.31,normalMap:t.normalMap,normalScale:new J(.25,.25),envMapIntensity:.9}),new dt({color:2503488,metalness:.65,roughness:.57}),new lt({color:11057349,metalness:.12,roughness:.42,clearcoat:.3,normalMap:t.normalMap,normalScale:new J(.35,.35)}),new dt({color:8833509,emissive:4753075,emissiveIntensity:1.3,roughness:.25,metalness:.25})],a=new Map,o=new Map,l=0;function c(p,u,m,g,f){let v=new _t;v.position.copy(m),v.quaternion.copy(g),v.updateMatrix(),p=p.index?p.toNonIndexed():p,p.applyMatrix4(v.matrix),l+=p.attributes.position.count/3,a.has(u)||a.set(u,[]),a.get(u).push(p);let _=Tf(f);o.has(_)||o.set(_,new Map);let x=o.get(_);x.has(u)||x.set(u,[]),x.get(u).push(p)}for(let[p,u]of n.entries()){let m=new S(...u.p),g=new S(...u.n),f=new $e().setFromUnitVectors(Sf,g),v=(x,y,T)=>new S(x,y,T).applyQuaternion(f).add(m),_=(x,y,T,w,R,P,I)=>c(new qe(x,y,T),I,v(w,R,P),f,m);_(1.6,.07,.78,0,.05,0,1),c(bf(1.48,.055,.67),p%5===0?0:2,v(0,.11,0),f,m);for(let x of[-.64,.64])for(let y of[-.25,.25])c(new Me(.038,.042,.035,8),0,v(x,.155,y),f,m);if(u.kind==="vent"){_(.95,.045,.46,0,.155,0,1);for(let x=0;x<8;x++)_(.055,.055,.4,-.39+x*.11,.195,0,0)}else if(u.kind==="turret"&&u.p[0]!==-7&&u.p[0]!==-4){c(new Me(.27,.34,.2,24),0,v(0,.24,0),f,m),_(.52,.18,.46,0,.4,0,1);let x=new $e().setFromAxisAngle(new S(0,0,1),-Math.PI/2),y=f.clone().multiply(x);for(let T of[-.135,.135])c(new Me(.036,.052,.85,12),0,v(.46,.4,T),y,m),c(new Me(.052,.052,.18,12),1,v(.87,.4,T),y,m)}else p%4===0&&_(.58,.025,.025,0,.16,.22,3)}let h=new Ee;h.name="Physical hull fittings",r.add(h);for(let[p,u]of a){let m=new re(ni(u),s[p]);m.castShadow=p!==3,m.receiveShadow=!0,h.add(m)}for(let[p,u]of o){let m=e.find(g=>g.key===p);if(m)for(let[g,f]of u){let v=ni(f);v.translate(-m.center.x,-m.center.y,-m.center.z);let _=new re(v,s[g]);_.castShadow=g!==3,_.receiveShadow=!0,m.mesh.add(_)}}let d=ni([...a].filter(([p])=>p!==3).flatMap(([,p])=>p));for(let p of a.values())p.forEach(u=>u.dispose());return{assembled:h,escortGeometry:d,escortMaterial:s[0],anchors:n.length,triangles:l}}var ci=(r=0,e=0,t=0)=>new S(r,e,t),wf=ci(0,1,0),$_=ci(1,0,0),Hd=["corvette","frigate","carrier","lancer","tender"],qo=["siege","raider","marauder","destroyer","torpedo"],jo=["needle","scout","interceptor","bomber","dart","raptor"];function Wn(r){let e=new Map;return{add(t,i,n=ci(),s=new Fe,a=ci(1,1,1)){if(t.index){let o=t;t=t.toNonIndexed(),o.dispose()}t.applyMatrix4(new fe().compose(n,new $e().setFromEuler(s),a)),e.has(i)||e.set(i,[]),e.get(i).push(t)},finish(){let t=0;for(let[i,n]of e){let s=ni(n),a=new re(s,i);a.castShadow=!i.isMeshBasicMaterial,a.receiveShadow=!0,r.add(a),t+=s.attributes.position.count/3,n.forEach(o=>o.dispose())}return t}}}function jt(r,e,t=.1){let i=new Me(t,t,r.distanceTo(e),8);return i.applyQuaternion(new $e().setFromUnitVectors(wf,e.clone().sub(r).normalize())),i.translate(...r.clone().add(e).multiplyScalar(.5).toArray()),i}function it(r,e,t,i=.07){let n=new Xt,s=r/2,a=t/2,o=Math.min(i,r*.12,t*.12);n.moveTo(-s+o,-a),n.lineTo(s-o,-a),n.lineTo(s,-a+o),n.lineTo(s,a-o),n.lineTo(s-o,a),n.lineTo(-s+o,a),n.lineTo(-s,a-o),n.lineTo(-s,-a+o),n.closePath();let l=new Jt(n,{depth:e,bevelEnabled:!0,bevelThickness:o*.45,bevelSize:o*.45,bevelSegments:1,steps:1});return l.rotateX(-Math.PI/2),l.translate(0,-e/2,0),l}function Xo(r,e){let t=new Xt;r.forEach(([n,s],a)=>a?t.lineTo(n,s):t.moveTo(n,s)),t.closePath();let i=new Jt(t,{depth:e,bevelEnabled:!0,bevelSize:.08,bevelThickness:.055,bevelSegments:1,steps:1});return i.rotateX(Math.PI/2),i.translate(0,e/2,0),i}function kd(r){let e=[],t=[],i=[];for(let a=0;a<r.length;a++){let[o,l,c,h=0]=r[a];for(let d=0;d<8;d++){let p=d*Math.PI/4+Math.PI/8;e.push(o,h+Math.sin(p)*c,Math.cos(p)*l),t.push(o/9,d/4)}}for(let a=0;a<r.length-1;a++)for(let o=0;o<8;o++){let l=a*8+o,c=a*8+(o+1)%8,h=l+8,d=c+8;i.push(l,h,c,c,h,d)}for(let a=1;a<7;a++){i.push(0,a,a+1);let o=(r.length-1)*8;i.push(o,o+a+1,o+a)}let n=new Ue;n.setAttribute("position",new ge(e,3)),n.setAttribute("uv",new ge(t,2)),n.setIndex(i),n.computeVertexNormals();let s=Go(n,.45);return n.dispose(),s}var Ef={corvette:[[-18,1.9,1.7],[-14,3.8,2.3],[-4,4.6,2.5],[7,3.4,1.7],[19,.18,.3]],frigate:[[-18,4,2],[-11,5,2.5],[5,5,2.5],[14,3,2],[20,.7,.7]],carrier:[[-18,7,2.8],[-13,7.8,3],[11,7.8,3],[18,5,2.6],[20,3,1.8]],lancer:[[-18,2.2,1.5],[-9,2.7,1.9],[9,1.8,1.5],[21,.04,.04]],tender:[[-18,4.8,2.8],[-11,5.3,3.4],[7,4.6,3.4],[17,3,2.2],[19,2.3,1.5]],siege:[[-21,7,3.4],[-12,8.5,4.2],[4,8.2,4.2],[17,6,3],[21,2,2]],raider:[[-19,3,1.7],[-9,4,2.8],[3,3,2.6],[16,1,1.2],[20,.05,.15]],marauder:[[-18,3.5,3],[-9,6.4,3.7],[7,6,3.2],[18,.5,1]],destroyer:[[-20,2.6,2.2],[-13,4.5,2.4],[8,4,2.6],[21,.9,.8]],torpedo:[[-18,4,2.2],[-10,5,2.6],[7,3,1.6],[19,.25,.45]]},Vd={corvette:[2389718,12835050,"Cobalt"],frigate:[13525810,14271649,"Copper"],carrier:[7688884,13156316,"Violet"],lancer:[2526850,10999246,"Teal"],tender:[12819765,14274728,"Gold"],siege:[10436417,3292233,"Crimson"],raider:[10645557,3160899,"Bronze"],marauder:[6639754,3423565,"Plum"],destroyer:[4747869,2636345,"Olive"],torpedo:[4026763,3029063,"Steel blue"],needle:[4499651,12048611,"Ice blue"],scout:[15115324,4739941,"Amber"],interceptor:[13129296,13811129,"Scarlet"],bomber:[6464125,12898751,"Jade"],dart:[9072842,13813477,"Lilac"],raptor:[14252194,14205907,"Rose"]};function Ti(r,e,{enemy:t=!1,serial:i=1}={}){let n=new Ee;n.name=r+" / "+i;let s=jo.includes(r),a=s?jo.indexOf(r):0,o=Ef[r]||[[-17,1.9,1.4],[-8,2.8,2],[5,2.2,1.7],[20,.08,.2]],l=(N,U=.44,V=.68)=>new lt({color:N,map:e.map,normalMap:e.normalMap,normalScale:new J(.32,.32),roughnessMap:e.orm,roughness:U,metalness:V,clearcoat:.17,clearcoatRoughness:.4,envMapIntensity:1.05}),c=Vd[r]||Vd.corvette,h=l(c[0],.7,.3),d=l(c[1],.62,.5),p=l(8227736,.52,.92),u=l(1516333,.9,.65),m=new lt({color:729392,roughness:.12,metalness:.55,clearcoat:1,clearcoatRoughness:.08}),g=new je({color:t?16756087:11004159,toneMapped:!1}),f=Wn(n),v=(N,U,V=0,j=0,K=0,$)=>f.add(N,U,ci(V,j,K),$),_=(N,U,V,j,K,$,ue)=>v(it(N,U,V),j,K,$,ue);v(kd(o),h);let x=N=>{for(let U=1;U<o.length;U++)if(N<=o[U][0]){let V=o[U-1],j=o[U],K=(N-V[0])/(j[0]-V[0]);return{w:Si.lerp(V[1],j[1],K),h:Si.lerp(V[2],j[2],K)*.924}}return{w:1,h:1}};for(let N=-13;N<12;N+=3.4){let{w:U,h:V}=x(N);for(let j of[-1,1]){_(3.1,.14,Math.max(.55,U*.52),d,N,V+.03,j*U*.48),_(2.35,.09,.42,u,N,V+.16,j*U*.48);for(let K=0;K<5;K++)_(.1,.12,.38,p,N-.9+K*.44,V+.24,j*U*.48);_(.11,.07,.11,p,N-1.3,V+.2,j*U*.75),_(.11,.07,.11,p,N+1.3,V+.2,j*U*.75)}}let y=(N,U,V=0)=>v(Xo(U.map(([j,K])=>[j,K*N]),.38),h,0,V,0),T=[],w=(N,U,V,j)=>{let K=new Me(j*.85,j,3.4,20);K.rotateZ(Math.PI/2),v(K,u,N+1,U,V);for(let $ of[-.6,.1,1.8])K=new Rt(j,.14,6,24),K.rotateY(Math.PI/2),v(K,p,N+$,U,V);K=new Me(j*.72,j*.64,.1,20),K.rotateZ(Math.PI/2),v(K,g,N-.62,U,V),T.push({p:ci(N-.8,U,V),r:j})};if(s){for(let N of[-1,1])if(y(N,[[[7,1],[-10,10],[-16,9],[-9,1]],[[3,1],[-6,13],[-10,12],[-14,1]],[[9,1],[-5,8],[-15,7],[-10,1]],[[2,1],[-3,9],[-15,9],[-16,1]],[[13,1],[-12,7],[-16,4],[-8,1]],[[7,1],[-9,11],[-6,6],[-14,2]]][a],a===5?.6:0),w(-15,0,N*(a===3?6:3),a===3?1.2:.9),_(6,.6,.65,u,-3,.25,N*(a===3?8:6)),_(3,.3,.3,p,1,.25,N*(a===3?8:6)),a===1||a===5){let V=Xo([[-13,0],[-8,0],[-13,5],[-16,3]],.22);V.rotateX(Math.PI/2),v(V,d,0,1,N*3)}}else if(["frigate","destroyer"].includes(r))for(let N of[-1,1])y(N,[[7,2],[0,10],[-14,10],[-18,4]],-.5),_(17,2.5,2.7,d,-6,0,N*8),w(-17,0,N*8,1.3),_(14,1,1,u,12,1,N*4);else if(["carrier","siege"].includes(r)){for(let N of[-1,1]){_(34,1,2,d,-1,3.1,N*6.7),_(17,1.8,2.6,u,1,1.1,N*7.6);for(let U=0;U<8;U++)_(.22,1.4,2.8,p,-6+U*2,1.2,N*7.7);w(-20,0,N*5,1.7),w(-20,0,N*1.7,1.35)}if(_(6,2.5,3,d,-8,4.2,-2),_(3.9,1.1,2.4,m,-6.6,5.5,-2),r==="siege")for(let N of[-1,1])_(13,2.5,4,d,13,0,N*6),_(9,.7,.8,u,20,.5,N*6)}else if(["tender","torpedo"].includes(r))for(let N of[-1,1]){f.add(jt(ci(-12,0,N*3),ci(4,0,N*9),.3),p);for(let U=0;U<3;U++){_(6,2.6,2.8,U%2?d:h,-10+U*7,0,N*7);for(let V of[-2,2])_(.2,2.8,3,p,-10+U*7+V,0,N*7)}w(-18,0,N*3,1.5)}else if(r==="marauder"){for(let N of[-1,1])y(N,[[15,1],[2,14],[-14,12],[-10,4]],-.7),_(11,2,2,d,-9,0,N*10),w(-17,0,N*10,1.3);w(-18,0,0,2)}else if(r==="raider")for(let N of[-1,1]){y(N,[[12,1],[-5,13],[-15,12],[-10,3]],-1);let U=Xo([[-13,0],[-4,0],[-14,6],[-18,3]],.35);U.rotateX(Math.PI/2),v(U,d,0,2,N*3),w(-18,-.5,N*4,1.4)}else{for(let N of[-1,1])y(N,[[6,1],[-9,r==="lancer"?8:11],[-17,9],[-11,2]],-.6),w(-18,0,N*4,1.3),_(10,.65,.6,p,5,-.4,N*3.5);r==="lancer"&&_(15,.9,.9,u,14,-.5,0)}for(let N=-12;N<12;N+=4){let{w:U,h:V}=x(N);for(let j of[-1,1]){_(3.7,V*.65,.22,u,N,-.1,j*(U*.92+.04)),_(3.25,V*.43,.18,d,N,.12,j*(U*.92+.2));for(let K of[-1.4,1.4])_(.11,V*.5,.21,p,N+K,.1,j*(U*.92+.32));_(2.2,.07,.06,g,N,-V*.17,j*(U*.92+.32))}}if(!s)for(let N of[-1,1]){let{w:U,h:V}=x(-3);v(Xo([[-13,U*.7],[-7,U+1.1],[8,U*.8],[13,U*.45]],.2),d,0,V*.5,0,N===-1?new Fe(Math.PI,0,0):void 0)}let R=s?4:-6,P=x(R).h+.4;v(kd([[R-3,1.3,.4,P],[R-1,1.5,.9,P],[R+4,.3,.2,P]]),m);for(let N of[-1.3,1.3])f.add(jt(ci(R-3,P+.2,N),ci(R+3,P+.3,N*.28),.07),p);s||(_(4,.6,1.5,d,-12,x(-12).h+.55,0),f.add(jt(ci(-12,3.3,0),ci(-12,6,0),.09),p),_(.8,.12,3,p,-12,6,0));for(let N of[-1,1]){let U=s?-3:4,V=x(U).h+.55,j=N*(s?2:2.4);v(new Me(.6,.8,.45,16),p,U,V,j),_(1.7,.65,1.1,u,U,V+.45,j);for(let K of[-.32,.32]){let $=new Me(.11,.15,3.1,12);$.rotateZ(-Math.PI/2),v($,p,U+1.7,V+.5,j+K);let ue=new Rt(.14,.035,6,12);ue.rotateY(Math.PI/2),v(ue,u,U+3.25,V+.5,j+K)}_(.55,.07,.13,g,-10,x(-10).h+.3,N*x(-10).w*.85)}let I=f.finish(),G=new li(1,1,16,3,!0);G.rotateZ(Math.PI/2),G.translate(-.5,0,0);let k=new st({transparent:!0,depthWrite:!1,side:gt,uniforms:{power:{value:.5},time:{value:0},tint:{value:new me(t?16753777:10018815)}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:"varying vec2 vUv;uniform float power;uniform float time;uniform vec3 tint;void main(){float a=pow(1.-vUv.y,1.7)*(.67+.13*cos(vUv.y*42.-time*9.))*power;gl_FragColor=vec4(mix(tint,vec3(1.),pow(1.-vUv.y,6.)),a*.48);}"}),O=new Ee;n.add(O);for(let{p:N,r:U}of T){let V=new re(G,k);V.position.copy(N),V.scale.set(6,U*.78,U*.78),O.add(V)}return n.userData={modelType:r,livery:c[2],paintColour:c[0],triangles:I,engines:O,update:(N,U=.7)=>{k.uniforms.time.value=N,k.uniforms.power.value=U;for(let V of O.children)V.scale.x=3+U*6+.1*Math.sin(N*11)}},n}var qt=(r=0,e=0,t=0)=>new S(r,e,t),Af=qt(0,1,0),Wr=class{constructor(e,{rounds:t=160,muzzles:i=64,hits:n=96,sparks:s=512,calibre:a=1}={}){this.calibre=a,this.root=new Ee,this.root.name="Ballistic rounds / timed muzzle and hull impacts",e.add(this.root),this.shots=[],this.m=new fe,this.q=new $e,this.p=qt(),this.s=qt(),this.dir=qt(),this.activeMuzzles=0,this.activeHits=0,this.indexDirty=!0,this.sortedShots=[],this.gunShots=new Map,this.maxFlight=0,this.colours=[new me(16765596),new me(11460607)];let o=(d,p,u,m=!1,g=1)=>{let f=new Ct(d,new je({color:p,toneMapped:!1,transparent:m,opacity:g,depthWrite:!m}),u);return f.instanceMatrix.setUsage(Kt),f.frustumCulled=!1,f.count=0,this.root.add(f),f},l=new Me(1,1,1,8),c=new li(1,1,12),h=new at(1,12,8);this.rounds=o(l,16774615,t),this.halo=o(l,16755297,t,!0,.26),this.flashes=o(c,16772552,i,!0,.8),this.hitFlashes=o(h,16765082,n,!0,.8),this.sparks=o(l,16761987,s,!0,.8),this.lights=[0,1].map(()=>{let d=new Pt(16762508,0,15,2);return this.root.add(d),d})}schedule({start:e,end:t,interval:i=.7,burst:n=3,spacing:s=.085,muzzle:a,target:o,speed:l=95,side:c=0,gun:h=0}){this.indexDirty=!0;for(let d=e;d<t;d+=i)for(let p=0;p<n;p++){let u=d+p*s;if(u>=t)continue;let m=a(u,p).clone(),g=o(u,p).clone(),f=g.clone().sub(m),v=f.length();f.normalize(),this.shots.push({at:u,hit:u+v/l,from:m,to:g,direction:f,speed:l,side:c,gun:h})}}index(){if(this.indexDirty){this.sortedShots=this.shots.slice().sort((e,t)=>e.at-t.at),this.gunShots.clear(),this.maxFlight=0;for(let e of this.sortedShots)this.gunShots.has(e.gun)||this.gunShots.set(e.gun,[]),this.gunShots.get(e.gun).push(e),this.maxFlight=Math.max(this.maxFlight,e.hit-e.at);this.indexDirty=!1}}recoil(e,t){this.index();let i=0,n=this.gunShots.get(e);if(!n)return i;let s=Yr(n,t);for(let a=$s(n,t-.17);a<s;a++){let o=t-n[a].at;o<.17&&(i=Math.max(i,Math.exp(-o*22)*.25))}return i}put(e,t,i,n,s,a){this.q.setFromUnitVectors(Af,n),this.s.set(s,a,s),this.m.compose(i,this.q,this.s),e.setMatrixAt(t,this.m)}update(e){let t=0,i=0,n=0,s=0;this.lights.forEach(l=>l.intensity=0),this.root.visible=!0,this.index();let a=$s(this.sortedShots,e-this.maxFlight-.38),o=Yr(this.sortedShots,e);this.scannedShots=o-a;for(let l=a;l<o;l++){let c=this.sortedShots[l],h=e-c.at,d=c.hit-c.at;if(h<0||h>d+.38)continue;if(h<d&&t<this.rounds.instanceMatrix.count){let u=Math.min(1.6*this.calibre,c.speed*d*.09),m=Math.max(.03,h*c.speed);this.p.copy(c.from).addScaledVector(c.direction,m),this.put(this.rounds,t,this.p,c.direction,.026*this.calibre,u),this.put(this.halo,t,this.p,c.direction,.09*this.calibre,u*1.18);let g=this.colours[c.side?1:0];this.rounds.setColorAt(t,g),this.halo.setColorAt(t,g),t++}if(h<.065&&i<this.flashes.instanceMatrix.count){let u=1-h/.065;this.p.copy(c.from).addScaledVector(c.direction,.32),this.put(this.flashes,i++,this.p,c.direction,.2*u*this.calibre,.7*u*this.calibre);let m=this.lights[c.side%2];m.position.copy(c.from),m.intensity=Math.max(m.intensity,u*24)}let p=e-c.hit;if(p>=0&&p<.38&&n<this.hitFlashes.instanceMatrix.count){let u=1-p/.38;this.put(this.hitFlashes,n++,c.to,c.direction,.1+p*.4,.15+p*.6);for(let m=0;m<6&&s<this.sparks.instanceMatrix.count;m++){let g=m*2.3999+c.at*8;this.dir.set(Math.cos(g),Math.sin(g*1.7),Math.sin(g)).addScaledVector(c.direction,-1.3).normalize(),this.p.copy(c.to).addScaledVector(this.dir,p*(2+m*.8)),this.put(this.sparks,s++,this.p,this.dir,.012*u,.1+u*.22)}}}for(let[l,c]of[[this.rounds,t],[this.halo,t],[this.flashes,i],[this.hitFlashes,n],[this.sparks,s]])l.count=c,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0);this.activeMuzzles=i,this.activeHits=n}hide(){this.root.visible=!1,this.lights.forEach(e=>e.intensity=0)}diagnostic(){return{gunRounds:this.rounds.count,muzzleFlashes:this.activeMuzzles,gunImpacts:this.activeHits,weaponTiming:"finite-speed / muzzle-to-impact",scheduledRounds:this.shots.length,scannedRounds:this.scannedShots||0}}},Yo=class{constructor(e,t){this.root=new Ee,this.root.name="Hero articulated dorsal batteries",e.add(this.root),this.mounts=[qt(-7,2.8,-1.4),qt(-4,2.53,1.4)],this.heads=[],this.barrels=[];let i=new lt({color:8754079,metalness:.87,roughness:.35,normalMap:t.normalMap,normalScale:new J(.3,.3)}),n=new dt({color:2306623,metalness:.7,roughness:.55});for(let s of this.mounts){let a=new re(new Me(.6,.75,.3,24),i);a.position.copy(s),this.root.add(a);let o=new Ee;o.position.copy(s).add(qt(0,.34,0)),this.root.add(o);let l=new re(new qe(1,.55,1.05),n);o.add(l);let c=[];for(let h of[-.23,.23]){let d=new Ee;d.position.z=h,o.add(d);let p=new re(new Me(.08,.13,1.65,16),i);p.rotation.z=-Math.PI/2,p.position.x=.95,d.add(p);for(let m of[.4,1.66]){let g=new re(new Rt(.12,.035,8,16),n);g.rotation.y=Math.PI/2,g.position.x=m,d.add(g)}let u=new re(new Ar(.08,12),n);u.rotation.y=Math.PI/2,u.position.x=1.79,d.add(u),c.push(d)}this.heads.push(o),this.barrels.push(c)}}pose(e){return{position:qt(-4+Math.sin(e*.28)*.9,Math.sin(e*.38)*.35,0),q:new $e().setFromEuler(new Fe(Math.sin(e*.35)*.012,-.08+Math.sin(e*.23)*.025,Math.sin(e*.3)*.018))}}muzzleAt(e,t,i=0){let{position:n,q:s}=this.pose(t),a=qt(25,2,-12).sub(n).applyQuaternion(s.clone().invert()),o=this.mounts[e].clone().add(qt(0,.34,0)),l=new $e().setFromUnitVectors(qt(1,0,0),a.sub(o).normalize());return qt(1.8,0,i%2?.23:-.23).applyQuaternion(l).add(o).applyQuaternion(s).add(n)}update(e,t,i,n){if(this.root.visible=e!==1||t>=11,!this.root.visible)return;let s=i.worldToLocal(qt(25,2,-12));this.heads.forEach((a,o)=>{a.quaternion.setFromUnitVectors(qt(1,0,0),e===4?s.clone().sub(a.position).normalize():qt(1,0,0)),this.barrels[o].forEach(l=>l.position.x=e===4?-n.recoil(o,t):0)})}};var Jo=r=>Math.max(0,Math.min(1,r)),ch=r=>(r=Jo(r),r*r*(3-2*r)),Cf=new S(1,0,0),nx=new S(0,1,0),nn=new S,Xn=new S,Wd=new S,Rf=new S;function Zo(r,e=48){let t=new xn(r.map(i=>new J(...i)),e);return t.rotateZ(-Math.PI/2),t}function Pf(){let r=document.createElement("canvas");r.width=1024,r.height=2048;let e=r.getContext("2d");e.fillStyle="#b9c2c9",e.fillRect(0,0,r.width,r.height);for(let i=0;i<10;i++){let n=i*204.8;e.fillStyle=i%3===0?"#a4b0bb":"#c2cbd1",e.fillRect(0,n,1024,201),e.fillStyle="#5c6c78",e.fillRect(0,n+202,1024,2)}e.fillStyle="#a4793d",e.fillRect(0,1570,1024,48),e.fillStyle="#243644",e.fillRect(0,1620,1024,9);for(let i of[55,565]){e.save(),e.translate(i,1150),e.rotate(Math.PI/2),e.fillStyle="#263845",e.font="600 46px monospace",e.fillText("VOYAGER / VX-09",0,0),e.font="20px monospace",e.fillText("GUIDED TORPEDO  \u2022  SERVICE 009",0,38),e.restore();for(let n=400;n<1500;n+=170)e.fillStyle="#667582",e.fillRect(i,n,7,13),e.fillRect(i+280,n,7,13)}let t=new xi(r);return t.colorSpace=xt,t.anisotropy=8,t}var Xd=`
 float h(vec3 p){p=fract(p*.3183099+vec3(.13,.27,.41));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){return n(p)*.57+n(p*2.03)*.28+n(p*4.07)*.15;}
`;function If(){let r=new st({transparent:!0,depthWrite:!1,side:gt,blending:kt,uniforms:{time:{value:0},power:{value:0}},vertexShader:"varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;uniform float time;void main(){vUv=uv;vec3 p=position;p.yz*=1.0+.04*sin(p.x*13.0-time*41.0);vec4 mv=modelViewMatrix*vec4(p,1.0);vView=-mv.xyz;vNormal=normalMatrix*normal;gl_Position=projectionMatrix*mv;}",fragmentShader:"varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;uniform float time;uniform float power;void main(){float tip=1.0-vUv.y;float shock=.72+.28*cos(tip*44.0-time*9.0);float edge=pow(abs(dot(normalize(vNormal),normalize(vView))),.4);vec3 c=mix(vec3(.75,.23,.055),vec3(1.0,.88,.62),pow(vUv.y,1.3));gl_FragColor=vec4(c,power*pow(vUv.y,.65)*shock*(.16+.56*edge));}"}),e=new Me(.235,0,3.8,24,9,!0);e.rotateZ(-Math.PI/2),e.translate(-3.8,0,0);let t=new re(e,r);return t.frustumCulled=!1,t}function hh(r){let e=new Ee,t=[new lt({map:Pf(),normalMap:r.normalMap,normalScale:new J(.32,.32),metalness:.14,roughness:.39,clearcoat:.36,clearcoatRoughness:.26}),new lt({color:6714754,metalness:.95,roughness:.27,anisotropy:.35,envMapIntensity:1}),new lt({color:1450542,metalness:.52,roughness:.45}),new lt({color:463644,metalness:.4,roughness:.065,clearcoat:1,clearcoatRoughness:.045})],i=new Map,n=(l,c,h=0,d=0,p=0,u=0)=>{l.rotateX(u),l.translate(h,d,p),l.index&&(l=l.toNonIndexed()),i.has(c)||i.set(c,[]),i.get(c).push(l)};n(Zo([[.2,-1.72],[.265,-1.62],[.28,-1.5],[.28,1.05],[.273,1.22],[.245,1.43],[.18,1.72],[.1,1.94],[.025,2.1],[0,2.12]]),0);for(let l of[-1.5,-.85,.8,1.22])n(Zo([[.28,-.04],[.293,-.025],[.293,.025],[.28,.04]]),1,l);n(Zo([[.135,-2.02],[.21,-1.94],[.24,-1.76],[.25,-1.63],[.18,-1.63],[.15,-1.78],[.105,-1.94],[.135,-2.02]]),1),n(Zo([[0,1.91],[.096,1.91],[.077,2.02],[.04,2.1],[0,2.115]],40),3);let s=new Xt;s.moveTo(-1.55,.245),s.lineTo(-.65,.245),s.lineTo(-1.17,.77),s.lineTo(-1.75,.7),s.closePath();for(let l=0;l<4;l++){let c=new Jt(s,{depth:.045,bevelEnabled:!0,bevelSize:.012,bevelThickness:.012,bevelSegments:1,steps:1});c.translate(0,0,-.0225),n(c,0,0,0,0,l*Math.PI/2),n(new qe(.8,.06,.075),1,-1.1,Math.cos(l*Math.PI/2)*.29,Math.sin(l*Math.PI/2)*.29,l*Math.PI/2)}for(let[l,c]of i){let h=new re(ni(c),t[l]);h.castShadow=!0,h.receiveShadow=!0,e.add(h),c.forEach(d=>d.dispose())}let a=If();e.add(a);let o=new re(new at(.13,20,12),new je({color:16770220,toneMapped:!1,transparent:!0,opacity:0}));return o.scale.set(.3,1,1),o.position.x=-1.96,e.add(o),e.userData={plume:a,throat:o},e}function Lf(){let e=new Float32Array(366),t=new Float32Array(244),i=[];for(let o=0;o<=60;o++)if(t.set([o/60,0,o/60,1],o*4),o<60){let l=o*2;i.push(l,l+1,l+2,l+1,l+3,l+2)}let n=new Ue;n.setAttribute("position",new ke(e,3).setUsage(Kt)),n.setAttribute("uv",new ke(t,2)),n.setIndex(i);let s=new st({transparent:!0,depthWrite:!1,side:gt,blending:kt,uniforms:{time:{value:0},fade:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:"varying vec2 vUv;uniform float time;uniform float fade;void main(){float edge=pow(max(0.0,1.0-abs(vUv.y*2.0-1.0)),2.8);float turbulent=.72+.15*sin(vUv.x*53.0-time*3.0)+.13*cos(vUv.x*97.0+vUv.y*13.0);float a=edge*turbulent*pow(1.0-vUv.x,1.5)*smoothstep(0.0,.08,vUv.x)*fade*.18;vec3 c=mix(vec3(.84,.56,.29),vec3(.44,.49,.54),smoothstep(0.0,.3,vUv.x));gl_FragColor=vec4(c,a);}"}),a=new re(n,s);return a.frustumCulled=!1,a}var Uf;function jn(r){let e=new Ee;for(let t=0;t<4;t++){let i=new st({transparent:!0,depthWrite:!1,uniforms:{age:{value:0},time:{value:0},seed:{value:r+t*6.2}},vertexShader:`varying vec3 vLocal;varying vec3 vN;varying vec3 vView;uniform float age;uniform float seed;${Xd}void main(){vec3 p=position;float f=fbm(p*2.5+seed);p*=.55+f*.95;vLocal=p;vec4 mv=modelViewMatrix*vec4(p,1.0);vView=-mv.xyz;vN=normalMatrix*normal;gl_Position=projectionMatrix*mv;}`,fragmentShader:`varying vec3 vLocal;varying vec3 vN;varying vec3 vView;uniform float age;uniform float time;uniform float seed;${Xd}void main(){float facing=max(0.0,dot(normalize(vN),normalize(vView)));float turbulent=fbm(vLocal*3.4+vec3(seed,time*.37,seed));float heat=clamp(turbulent*1.45-age*1.05,0.0,1.0);vec3 ember=mix(vec3(.16,.055,.022),vec3(.96,.34,.075),smoothstep(.18,.77,heat));ember=mix(ember,vec3(1.0,.88,.58),smoothstep(.72,.98,heat));float light=.4+.6*max(0.0,dot(normalize(vN),normalize(vec3(-.4,.8,1.0))));vec3 smoke=vec3(.14,.17,.20)*light;vec3 c=mix(ember,smoke,smoothstep(.10,.94,age)*(1.0-heat*.5));float a=pow(facing,.45)*(.62+turbulent*.36)*(1.0-smoothstep(.5,1.0,age));gl_FragColor=vec4(c,a);}`}),n=new re(Uf||=new Qi(1,5),i);n.userData.index=t,e.add(n)}return e}var Ko=class{constructor(e,t){this.root=new Ee,this.root.name="Guided torpedoes and physical impacts",e.add(this.root),this.shots=[],this.target=new S(25,2,-12),this.matrix=new fe,this.quaternion=new $e,this.scale=new S,this.origin=new S,this.debrisOffset=new S,this.debrisEuler=new Fe;for(let i=0;i<8;i++){let n=3.8+i*1.1,s=n+2.2+i%3*.3,a=new S(2.5,-1.1,[-4.1,4.1,-2.7][i%3]),o=new S(-4+Math.sin(n*.28)*.9,Math.sin(n*.38)*.35,0),l=new Fe(Math.sin(n*.35)*.012,-.08+Math.sin(n*.23)*.025,Math.sin(n*.3)*.018);a.applyEuler(l).add(o);let c=this.target.clone().add(new S((i%3-1)*1.4,i%2*.8,(i%3-1)*1.2)),h=a.clone().add(new S(5,-1.3,i===1?5:-5)),d=c.clone().add(new S(-13,8+i*1.6,i===1?10:-3)),p=new _n(a,h,d,c),u=hh(t),m=Lf(),g=jn(i*13.9);g.position.copy(c),this.root.add(u,m,g),this.shots.push({launch:n,hit:s,curve:p,model:u,ribbon:m,blast:g,end:c})}this.debris=new Ct(new Qi(.14,0),new dt({color:7306374,metalness:.85,roughness:.48}),128),this.debris.instanceMatrix.setUsage(Kt),this.debris.frustumCulled=!1,this.root.add(this.debris),this.light=new Pt(16758635,0,60,2),this.root.add(this.light)}progress(e,t){let i=Jo((t-e.launch)/(e.hit-e.launch));return .16*i+.84*i*i}position(e,t,i){return e.curve.getPoint(this.progress(e,t),i)}update(e,t,i){if(this.root.visible=e===4,e!==4){this.light.intensity=0;return}let n=0,s=0;for(let[a,o]of this.shots.entries()){let l=t-o.launch,c=this.progress(o,t),h=ch((l-.16)/.3),d=t>=o.launch&&t<o.hit;o.model.visible=d,d&&(this.position(o,t,o.model.position),o.model.quaternion.setFromUnitVectors(Cf,o.curve.getTangent(c,nn)),o.model.rotateX(.13*Math.sin(t*1.8+a)),o.model.userData.plume.material.uniforms.time.value=t,o.model.userData.plume.material.uniforms.power.value=h,o.model.userData.throat.material.opacity=h);let p=Jo((o.hit+1.65-t)/1.65);if(o.ribbon.visible=l>.2&&p>0,o.ribbon.visible){let g=o.ribbon.geometry.attributes.position;for(let f=0;f<=60;f++){let v=Math.max(o.launch,t-f*.033),_=Math.min(v,o.hit),x=this.progress(o,_);this.position(o,_,nn),Wd.subVectors(i.position,nn),Xn.crossVectors(o.curve.getTangent(x,Rf),Wd).normalize();let y=(.07+.35*f/60)*Math.min(1,Math.max(0,v-o.launch)*3);g.setXYZ(f*2,nn.x+Xn.x*y,nn.y+Xn.y*y,nn.z+Xn.z*y),g.setXYZ(f*2+1,nn.x-Xn.x*y,nn.y-Xn.y*y,nn.z-Xn.z*y)}g.needsUpdate=!0,o.ribbon.material.uniforms.time.value=t,o.ribbon.material.uniforms.fade.value=p*h}let u=t-o.hit,m=Jo(u/4.5);if(o.blast.visible=u>=0&&u<4.5,o.blast.visible){for(let g of o.blast.children){let f=g.userData.index,v=.38+ch(m*3)*(2.4+f*.5);g.scale.set(v,v*(.75+f*.1),v),g.position.set(Math.sin(f*2.7+a)*m*4,Math.cos(f*1.3)*m*2,Math.cos(f*2.7+a)*m*3),g.rotation.set(m*.6,f*.6+m*.5,m*.2),g.material.uniforms.age.value=m,g.material.uniforms.time.value=t}s+=Math.exp(-u*5)*230;for(let g=0;g<16;g++){let f=g*2.39996+a,v=1.6+g%5*.65;this.origin.copy(o.end).add(this.debrisOffset.set(Math.cos(f)*u*v,Math.sin(g*5.3)*u*v*.6,Math.sin(f)*u*v)),this.quaternion.setFromEuler(this.debrisEuler.set(g+u*(g%3+1),u*.7,g*.31));let _=1-ch((u-2.2)/2.3);this.scale.set(.6+g%3,1.2+g%4*.5,.4).multiplyScalar(_),this.matrix.compose(this.origin,this.quaternion,this.scale),this.debris.setMatrixAt(n++,this.matrix)}}}this.debris.count=n,this.debris.visible=n>0,this.debris.instanceMatrix.needsUpdate=!0,this.light.position.copy(this.target),this.light.intensity=s}diagnostic(){return{missiles:this.shots.filter(e=>e.model.visible).length,impacts:this.shots.filter(e=>e.blast.visible).length,missileParts:this.shots[0].model.children.length,flightPaths:"guided cubic Bezier",impactGeometry:"3D turbulence meshes"}}};var Ws=r=>Math.max(0,Math.min(1,r)),Sn=r=>(r=Ws(r),r*r*r*(r*(r*6-15)+10)),Ye=(r=0,e=0,t=0)=>new S(r,e,t),jd=Ye(1,0,0),Yd=Ye(0,1,0);function Df(r){let e=new Map;return{add(t,i,n=Ye(),s=new Fe){t=t.index?t.toNonIndexed():t,t.applyMatrix4(new fe().compose(n,new $e().setFromEuler(s),Ye(1,1,1))),e.has(i)||e.set(i,[]),e.get(i).push(t)},finish(){for(let[t,i]of e){let n=new re(ni(i),t);n.castShadow=!0,n.receiveShadow=!0,r.add(n),i.forEach(s=>s.dispose())}}}}function Nf(r,e,t,i,n){n.position.copy(r).add(e).multiplyScalar(.5),n.quaternion.setFromUnitVectors(Yd,n.direction.subVectors(e,r).normalize()),n.scale.set(t,r.distanceTo(e),t),i.compose(n.position,n.quaternion,n.scale)}function Ff(){let r=document.createElement("canvas");r.width=4096,r.height=640;let e=r.getContext("2d");e.fillStyle="#071827",e.fillRect(0,0,4096,640),e.strokeStyle="#7cd8ff",e.lineWidth=12,e.strokeRect(20,20,4056,600),e.fillStyle="#effaff",e.textAlign="center",e.textBaseline="middle",e.font="700 286px Rajdhani, sans-serif",e.shadowColor="#57baff",e.shadowBlur=22,e.fillText("THE UNPROFESSIONALS",2048,278,3750),e.shadowBlur=0,e.font="600 83px Rajdhani, sans-serif",e.fillStyle="#91d7ff",e.fillText("VOYAGER COMMAND  /  ORBITAL DEFENCE",2048,502);let t=new xi(r);return t.colorSpace=xt,t.anisotropy=4,t}function qd(r){let e=new Zt;for(let t of r.children)t.isMesh&&(t.geometry.computeBoundingBox(),e.union(t.geometry.boundingBox));return e}var $o=class{constructor(e,t,i,n){this.root=new Ee,this.root.name="Unprofessionals base raid / 28 seconds",this.root.visible=!1,e.add(this.root),this.matrix=new fe,this.scratch={position:Ye(),direction:Ye(),scale:Ye(),quaternion:new $e},this.point=Ye(),this.tangent=Ye(),this.scale=Ye(),this.quat=new $e,this.debrisOffset=Ye(),this.debrisEuler=new Fe,this.baseOrigin=Ye(-28,-9,7),this.baseScale=1.3;let s=(a,o=.52,l=.7)=>new dt({color:a,map:t.map,normalMap:t.normalMap,normalScale:new J(.35,.35),roughnessMap:t.orm,metalness:l,roughness:o,envMapIntensity:.9});this.armour=s(10531520,.65,.5),this.dark=s(2569022,.6,.8),this.blue=s(2511211,.58,.65),this.red=s(6307903,.65,.7),this.warm=new je({color:16752464,toneMapped:!1}),this.cyan=new je({color:8773631,toneMapped:!1}),this.white=new je({color:15070719,toneMapped:!1}),this.maps=t,this.makeBase(),this.makeFleet(i,n),this.makeWeapons(t),this.makeExplosions(n),this.metrics={raidDuration:28,raidEnemyShips:5,raidInterceptors:6,raidTurrets:this.turrets.length,raidScheduledRounds:this.gunfire.shots.length,raidMissileLaunches:this.shots.length,raidImpactEvents:this.blasts.length,raidEnemyHullLengths:this.enemyHullLengths,raidInterceptorHullLength:this.interceptorHullLength,raidBaseScale:this.baseScale,raidBaseSign:"THE UNPROFESSIONALS",raidDefensiveRounds:this.gunfire.shots.filter(a=>a.side===1).length}}basePoint(e,t,i,n=Ye()){return n.set(e,t,i).multiplyScalar(this.baseScale).add(this.baseOrigin)}makeBase(){this.base=new Ee,this.base.position.copy(this.baseOrigin),this.base.scale.setScalar(this.baseScale),this.root.add(this.base);let e=Df(this.base),t=(a,o,l,c,h,d)=>e.add(a,o,Ye(l,c,h),d);t(new Me(18,20,2.3,12),this.armour,0,-2,0),t(new Me(16.9,18,1.2,12),this.dark,0,-.3,0),t(new Me(12,13.5,2.3,10),this.blue,-2,1.1,-3),t(new Me(24,27,2.8,16),this.dark,0,-4.3,0),t(new Me(23.5,24,1.2,16),this.armour,0,-2.6,0),t(it(47,2.6,21,.5),this.armour,-1,-1.7,23),t(it(45,.3,19,.35),this.dark,-1,-.25,23);for(let[a,o]of[[-22,-15],[-23,6],[-17,24],[14,25],[23,7],[22,-17]]){t(new Me(4,5,2.2,8),this.blue,a,.5,o),t(new Me(4.1,4.1,.3,8),this.armour,a,1.7,o);for(let l=0;l<6;l++){let c=l*Math.PI/3;t(it(.65,.12,.4),this.cyan,a+Math.cos(c)*3.5,1.9,o+Math.sin(c)*3.5)}}for(let a=0;a<28;a++){let o=a*Math.PI/14;t(it(1.6,2.7,1.1),this.blue,Math.cos(o)*24,-3.7,Math.sin(o)*24,new Fe(0,-o,0))}for(let a=0;a<24;a++){let o=a*Math.PI/12,l=Math.cos(o)*18.7,c=Math.sin(o)*18.7;t(new qe(1.3,2.8,1),a%3?this.dark:this.armour,l,-1.5,c,new Fe(0,-o,0)),t(new qe(.9,.11,.22),this.cyan,Math.cos(o)*18.1,.2,Math.sin(o)*18.1,new Fe(0,-o,0))}for(let a of[-1,1]){t(new qe(10,1.4,16),this.armour,a*20,-1,2),t(new qe(8,.3,14),this.dark,a*20,-.1,2);for(let o=0;o<8;o++)t(new qe(.2,.08,1),this.cyan,a*23,.1,-4+o*1.7),t(new qe(1,.09,.18),this.warm,a*18,.1,-4+o*1.7)}this.hangars=[];for(let a=0;a<3;a++){let o=-13+a*13;t(new qe(26,1,12),this.armour,4,2,o),t(new qe(26,.6,12.8),this.armour,4,8.8,o);for(let l of[-1,1])t(new qe(26,5.8,.45),this.blue,4,5.5,o+l*6.2);t(new qe(.5,5.8,12),this.dark,-9,5.5,o);for(let l of[-1,1])t(new qe(24,.09,.12),this.cyan,4,2.6,o+l*5.4),t(new qe(.18,5.8,.18),this.cyan,17.2,5.5,o+l*5.9);this.hangars.push(this.basePoint(4,5.3,o))}for(let a=0;a<5;a++){let o=7.3-a*.8;t(new Me(o*.5,(o+.7)*.5,1.8,6),a%2?this.blue:this.armour,-15,3.5+a*1.9,-6),t(new Me(o*.51,o*.51,.15,6),this.cyan,-15,4.15+a*1.9,-6)}t(new Me(.17,.3,5,8),this.armour,-15,14,-6),t(new at(.4,12,8),this.cyan,-15,16.4,-6);for(let a of[-19,-16,-13])t(new Me(1,1,3,12),this.dark,a,2.4,8),t(new Rt(1,.12,6,16),this.armour,a,3.7,8,new Fe(Math.PI/2,0,0));for(let a=0;a<14;a++)t(new qe(1.1,.12,3.4),this.dark,-12+a*1.7,.45,13),t(new qe(.12,.06,2.7),this.armour,-11.6+a*1.7,.53,13);for(let a=0;a<18;a++){let o=a*Math.PI/9,l=Math.cos(o)*16,c=Math.sin(o)*16;t(it(2.3,.22,1.3),this.dark,l,.55,c,new Fe(0,-o,0));for(let h=0;h<3;h++)t(it(.12,.12,1.1),this.armour,l+(h-1)*.45,.74,c,new Fe(0,-o,0))}for(let a of[8.6,10.2])e.add(jt(Ye(-17,1,a),Ye(4,1,a),.18),this.armour);for(let a of[-16,-13])for(let o=0;o<9;o++)t(new qe(.1,2.1,4),this.dark,a+o*.24,2.4,-10);for(let a=0;a<9;a++)t(new qe(.9,.08,.15),this.armour,-18,3+a*.8,-6.5);for(let a of[-13,0,13])for(let o of[-5,3,11]){t(it(6.8,.12,10.4),this.blue,o,9.16,a),t(it(4.6,.15,1.2),this.dark,o,9.3,a-3.5);for(let l=0;l<7;l++)t(it(.16,.14,1.1),this.armour,o-1.8+l*.6,9.45,a-3.5)}e.finish(),this.sign=new Ee,this.sign.name="THE UNPROFESSIONALS / illuminated base sign",this.sign.position.set(-2,8.5,31),this.sign.rotation.y=0,this.base.add(this.sign);let i=new re(it(44.8,7,.8,.2),this.blue);this.sign.add(i);let n=new re(new Fi(44,6.875),new je({map:Ff(),toneMapped:!1}));n.position.z=.56,this.sign.add(n);for(let a of[-21.8,21.8]){let o=new re(it(.65,8.8,.8),this.armour);o.position.set(a,-5.4,-.2),this.sign.add(o);let l=new re(new at(.2,12,8),this.cyan);l.position.set(a,3.7,0),this.sign.add(l)}this.turrets=[];let s=[[-22,2,-15],[-23,2,6],[-17,2,24],[14,2,25],[23,2,7],[22,2,-17],[-2,9.4,-13],[10,9.4,-13],[-2,9.4,0],[10,9.4,0],[-2,9.4,13],[10,9.4,13]];for(let[a,o]of s.entries()){let l=new Ee;l.position.set(o[0],o[1]+1,o[2]),this.base.add(l);let c=new re(new Me(1.8,2.2,1,10),this.dark);l.add(c);let h=new Ee;h.position.y=1,l.add(h);let d=new re(it(3,1.7,2.8,.2),this.armour);h.add(d);let p=[],u=[];for(let m of[-1,1]){let g=new re(new Me(.18,.26,3.9,12),this.dark);g.rotation.x=Math.PI/2,g.position.set(m*.85,.3,2.5),h.add(g),p.push(g);let f=new re(new Rt(.2,.055,6,10),this.cyan);f.position.set(m*.85,.3,4.48),h.add(f),u.push(f)}this.turrets.push({g:l,head:h,barrels:p,tips:u,origin:this.basePoint(o[0],o[1]+2.3,o[2])})}this.shutters=[];for(let a=0;a<3;a++){let o=-13+a*13;for(let l of[-1,1]){let c=new re(it(.22,5.8,6),this.dark);c.position.set(17.1,5.5,o+l*3),this.base.add(c),this.shutters.push({door:c,z:o,side:l})}}this.radars=[];for(let[a,o]of[[-18,-3],[-13,11]]){let l=new Ee;l.position.set(a,6,o);let c=new re(new at(1.6,20,12,0,Math.PI*2,0,.7),this.armour);c.rotation.z=.9,l.add(c);let h=new re(new Me(.12,.2,3,8),this.dark);h.position.y=-1.5,l.add(h),this.base.add(l),this.radars.push(l)}this.shield=new re(new at(21,40,24),new st({transparent:!0,depthWrite:!1,uniforms:{power:{value:0}},vertexShader:"varying vec3 vN;varying vec3 vP;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vP=p.xyz;vN=normalMatrix*normal;gl_Position=projectionMatrix*p;}",fragmentShader:"varying vec3 vN;varying vec3 vP;uniform float power;void main(){float edge=pow(1.-max(0.,dot(normalize(vN),normalize(-vP))),3.);gl_FragColor=vec4(.16,.6,1.,edge*power*.32);}"})),this.shield.scale.set(1.5,.72,1.5),this.shield.position.y=1.5,this.base.add(this.shield),this.base.updateMatrixWorld(!0)}updateBase(e){let t=Sn((e-5.6)/1.25);for(let{door:i}of this.shutters)i.position.y=5.5+t*6.2;this.radars.forEach((i,n)=>i.rotation.y=e*(.28+n*.1))}enemyPosition(e,t,i=Ye()){let n=Sn((t-e*.25)/4),s=Sn((t-21.8-e*.18)/4.4);return i.set(36+e%2*13+(1-n)*(28+e*3)+s*55,11+e%3*5+Math.sin(t*.31+e)*.55+s*10,-22+e*8-s*12)}interceptorPosition(e,t,i=Ye()){return this.fighterPaths[e].getPoint(Ws((t-this.fighterLaunch[e])/15.8),i)}interceptorMuzzle(e,t){return this.interceptorPosition(e,t).addScaledVector(this.fighterPaths[e].getTangent(Ws((t-this.fighterLaunch[e])/15.8)).normalize(),this.fighterNoses[e])}makeFleet(e,t){this.enemies=[];for(let i=0;i<5;i++){let n=Ti(qo[i],this.maps,{enemy:!0,serial:i+1});n.rotation.y=Math.PI,n.scale.setScalar(i===0?.48:.26+i*.025),this.root.add(n),this.enemies.push(n)}this.enemyHullLengths=this.enemies.map(i=>qd(i).getSize(Ye()).x*i.scale.x),this.interceptorHullLength=this.enemyHullLengths.reduce((i,n)=>i+n,0)/this.enemies.length,this.fighters=[],this.fighterPaths=[],this.fighterLaunch=[],this.fighterNoses=[];for(let i=0;i<6;i++){let n=Ti(jo[i],this.maps,{serial:i+1}),s=qd(n);n.scale.setScalar(this.interceptorHullLength/s.getSize(Ye()).x),this.fighterNoses.push(s.max.x*n.scale.x+.2),this.root.add(n),this.fighters.push(n);let a=i%3-1,o=Math.floor(i/3),l=this.hangars[i%3].clone();this.fighterLaunch.push(7+i%3*.55+o*2.8),this.fighterPaths.push(new Rr([l,l.clone().add(Ye(24*this.baseScale,0,0)),Ye(17,7+o*5,a*16+7),Ye(24+o*9,10+a*3+o*7,a*16-6),Ye(39+o*9,22+a*2+o*7,a*16-4),Ye(25+o*4,25+a*3+o*7,a*16+12),Ye(-3-o*4,23+a*2+o*5,a*16+25),Ye(-35,18+o*5,a*16+35)],!1,"catmullrom",.25))}}turretMuzzle(e,t,i=0){let n=this.turrets[e].origin.clone(),s=this.enemyPosition(e%5,t).sub(n).normalize(),a=Ye().crossVectors(Yd,s).normalize();return n.addScaledVector(s,4.48*this.baseScale).addScaledVector(a,(i%2?.85:-.85)*this.baseScale)}baseImpact(e){return e%3===2?this.basePoint(-21+e%5*10,2.1,e%2?23:-19):this.basePoint(-5+e%4*5.5,9.5,[-13,0,13][e%3]+Math.sin(e*2.4)*3.2)}makeWeapons(e){this.shots=[];let t=(s,a,o,l,c,h)=>{let d=o.clone().add(Ye(c===0?-5:7,6+h,c===0?4:-3)),p=l.clone().add(Ye(c===0?10:-10,7+h,-3));this.shots.push({launch:s,hit:s+a,side:c,curve:new _n(o,d,p,l),end:l})};for(let s=0;s<84;s++){let a=3.1+s*.23,o=1.85+s%4*.16,l=this.enemyPosition(s%5,a).add(Ye(-5,-.5,0)),c=this.baseImpact(s);t(a,o,l,c,0,s%4)}for(let s=0;s<78;s++){let a=4.8+s*.22,o=1.9+s%3*.17,l=this.turretMuzzle(s%this.turrets.length,a),c=this.enemyPosition(s%5,a+o);t(a,o,l,c,1,s%4)}for(let s=0;s<42;s++){let a=11.3+s*.24,o=1.5+s%3*.15,l=this.interceptorMuzzle(s%6,a),c=this.enemyPosition((s+1)%5,a+o);t(a,o,l,c,1,2)}let i=hh(e);this.missileMeshes=[];for(let s of i.children)if(s.isMesh&&s.material.isMeshPhysicalMaterial){let a=new Ct(s.geometry,s.material,64);a.instanceMatrix.setUsage(Kt),a.frustumCulled=!1,this.root.add(a),this.missileMeshes.push(a)}let n=new Me(1,1,1,5);this.redTrails=new Ct(n,new je({color:16752221,transparent:!0,opacity:.48,depthWrite:!1,toneMapped:!1}),768),this.blueTrails=new Ct(n,new je({color:9097215,transparent:!0,opacity:.48,depthWrite:!1,toneMapped:!1}),768);for(let s of[this.redTrails,this.blueTrails])s.instanceMatrix.setUsage(Kt),s.frustumCulled=!1,this.root.add(s);this.gunfire=new Wr(this.root,{rounds:384,muzzles:128,hits:192,sparks:1152,calibre:1.7});for(let s=0;s<this.turrets.length;s++)this.gunfire.schedule({start:4.3+s*.065,end:22.8,interval:.31,burst:5,spacing:.052,gun:s,side:1,muzzle:(a,o)=>this.turretMuzzle(s,a,o),target:(a,o)=>this.enemyPosition(s%5,a+.65).add(Ye((o-2)*.5,(s%3-1)*.4,0)),speed:130});for(let s=0;s<5;s++)this.gunfire.schedule({start:3.1+s*.12,end:22.2,interval:.39,burst:5,spacing:.06,gun:40+s,side:0,muzzle:a=>this.enemyPosition(s,a).add(Ye(-5,1.2,0)),target:(a,o)=>this.baseImpact(s*7+o),speed:115});for(let s=0;s<6;s++)this.gunfire.schedule({start:11+s*.22,end:22.3,interval:.32,burst:4,spacing:.055,gun:60+s,side:1,muzzle:a=>this.interceptorMuzzle(s,a),target:a=>this.enemyPosition(s%5,a+.45),speed:140});this.endPoint=Ye(),this.beginPoint=Ye()}makeExplosions(e){this.blasts=this.shots.map((t,i)=>({at:t.hit,end:t.end.clone(),scale:t.side===0?1.45:1.9,seed:i}));for(let t=0;t<60;t++){let i=8+t*.255,n=t%3===0;this.blasts.push({at:i,end:n?this.baseImpact(t+11):this.enemyPosition(t%5,i).add(Ye((t%3-1)*3,1,t%2?2:-2)),scale:n?1.65:2.5,seed:204+t})}this.blastCapacity=Math.max(...this.blasts.map(t=>this.blasts.filter(i=>i.at<=t.at&&i.at>=t.at-2.8).length))+2,this.blastPool=[];for(let t=0;t<this.blastCapacity;t++){let i=jn(t*17.3),n=new Wt(new Gt({map:e,color:16767664,transparent:!0,depthWrite:!1,toneMapped:!1}));i.add(n);let s=new re(new Rt(1,.025,6,48),new je({color:16763278,transparent:!0,depthWrite:!1,toneMapped:!1,opacity:0}));i.add(s),this.root.add(i),this.blastPool.push({g:i,flash:n,ring:s})}this.debris=new Ct(new Qi(.15,0),this.dark,this.blastCapacity*12),this.debris.instanceMatrix.setUsage(Kt),this.debris.frustumCulled=!1,this.root.add(this.debris),this.sparkGeo=new Ue,this.sparkGeo.setAttribute("position",new ke(new Float32Array(this.blastCapacity*40*3),3)),this.sparkGeo.setAttribute("opacity",new ke(new Float32Array(this.blastCapacity*40),1)),this.sparks=new $i(this.sparkGeo,new st({transparent:!0,depthWrite:!1,uniforms:{height:{value:1080}},vertexShader:"attribute float opacity;varying float a;uniform float height;void main(){a=opacity;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(height*.12/-p.z,1.,5.);}",fragmentShader:"varying float a;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(1.,.66,.27,a*max(0.,1.-r));}"})),this.sparks.frustumCulled=!1,this.root.add(this.sparks),this.lights=[];for(let t=0;t<3;t++){let i=new Pt(16757082,0,35,2);this.root.add(i),this.lights.push(i)}}shotProgress(e,t){let i=Ws((t-e.launch)/(e.hit-e.launch));return .25*i+.75*i*i}update(e,t){this.root.visible=!0;for(let[u,m]of this.enemies.entries())m.visible=e<26.2,this.enemyPosition(u,e,m.position),m.rotation.set(.018*Math.sin(e*.5+u),Math.PI+Sn((e-21.5)/3)*.35,Math.sin(e*.3+u)*.025),m.userData.update(e,.65+Sn((e-22)/3)*.5);let i=0;for(let u=0;u<6;u++){let m=this.fighters[u],g=e-this.fighterLaunch[u],f=Ws(g/15.8);m.visible=g>=0&&f<1,m.visible&&(i++,this.interceptorPosition(u,e,m.position),this.tangent.copy(this.fighterPaths[u].getTangent(f)).normalize(),m.quaternion.setFromUnitVectors(jd,this.tangent),m.rotateX(Math.sin(f*Math.PI*2)*.42*Sn((f-.16)/.1)),m.userData.update(e,.8))}for(let[u,m]of this.turrets.entries()){let g=this.enemyPosition(u%5,e);m.head.lookAt(g)}let n=0,s=0,a=0;for(let u of this.shots){let m=this.shotProgress(u,e);if(e>=u.launch&&e<u.hit){u.curve.getPoint(m,this.point),this.tangent.copy(u.curve.getTangent(m)),this.quat.setFromUnitVectors(jd,this.tangent),this.scale.setScalar(.38),this.matrix.compose(this.point,this.quat,this.scale);for(let g of this.missileMeshes)g.setMatrixAt(n,this.matrix);n++}if(!(e<u.launch||e>u.hit+.3))for(let g=0;g<12;g++){let f=Math.min(e,u.hit)-g*.055;if(f<u.launch)break;u.curve.getPoint(this.shotProgress(u,f),this.beginPoint),u.curve.getPoint(this.shotProgress(u,Math.max(u.launch,f-.06)),this.endPoint),Nf(this.beginPoint,this.endPoint,.045*(1-g/14),this.matrix,this.scratch),u.side===0?this.redTrails.setMatrixAt(s++,this.matrix):this.blueTrails.setMatrixAt(a++,this.matrix)}}for(let u of this.missileMeshes)u.count=n,u.instanceMatrix.needsUpdate=!0;for(let[u,m]of[[this.redTrails,s],[this.blueTrails,a]])u.count=m,u.instanceMatrix.needsUpdate=!0;this.gunfire.update(e);for(let[u,m]of this.turrets.entries()){let g=this.gunfire.recoil(u,e);for(let f of m.barrels)f.position.z=2.5-g;for(let f of m.tips)f.position.z=4.48-g}this.updateBase(e);let o=0,l=0,c=0,h=0;this.lights.forEach(u=>u.intensity=0);let d=this.sparkGeo.attributes.position,p=this.sparkGeo.attributes.opacity;for(let u of this.blasts){let m=e-u.at;if(m<0||m>2.8||o>=this.blastCapacity)continue;let g=m/2.8,f=this.blastPool[o++];f.g.visible=!0,f.g.position.copy(u.end);for(let v=0;v<4;v++){let _=f.g.children[v],x=(.18+Sn(g*2.7)*(1.3+v*.35))*u.scale;_.scale.set(x,x*(.8+v*.07),x),_.position.set(Math.sin(v*2.7+u.seed)*g*u.scale*1.8,g*(1.2+v*.6),Math.cos(v*2.7+u.seed)*g*u.scale*1.4),_.material.uniforms.age.value=g,_.material.uniforms.time.value=e}if(f.flash.scale.setScalar(u.scale*(3+m*9)),f.flash.material.opacity=Math.exp(-m*11)*.85,f.ring.quaternion.copy(t.quaternion),f.ring.scale.setScalar((.2+m*7)*u.scale),f.ring.material.opacity=Math.exp(-m*5)*.09,m<.35){let v=this.lights[(o-1)%3];v.position.copy(u.end),v.intensity=Math.max(v.intensity,Math.exp(-m*6)*145),u.end.x<0&&(h=Math.max(h,Math.exp(-m*6)*.18))}for(let v=0;v<12;v++){let _=v*2.39996+u.seed,x=1.2+v%5*.7;this.point.copy(u.end).add(this.debrisOffset.set(Math.cos(_)*m*x,Math.sin(_*2)*m*x-m*m*.35,Math.sin(_)*m*x)),this.quat.setFromEuler(this.debrisEuler.set(v+m*(1+v%3),m*.8,v*.7)),this.scale.set(.7+v%3,.5,1.7).multiplyScalar(1-Sn(g)),this.matrix.compose(this.point,this.quat,this.scale),this.debris.setMatrixAt(l++,this.matrix)}for(let v=0;v<40;v++){let _=v*2.39996+u.seed*1.9,x=m*(2+v%9*.65);d.setXYZ(c,u.end.x+Math.cos(_)*x,u.end.y+Math.sin(v*8.1)*x*.7-m*m*.5,u.end.z+Math.sin(_)*x),p.setX(c++,Math.pow(1-g,2)*.9)}}for(let u=o;u<this.blastPool.length;u++)this.blastPool[u].g.visible=!1;this.debris.count=l,this.debris.instanceMatrix.needsUpdate=!0,this.sparkGeo.setDrawRange(0,c),d.needsUpdate=!0,p.needsUpdate=!0,this.sparks.material.uniforms.height.value=innerHeight,this.shield.material.uniforms.power.value=h,this.shield.visible=h>.005,Object.assign(this.metrics,{raidExplosionCapacity:this.blastCapacity,raidActiveMissiles:n,raidActiveImpacts:o,raidActiveInterceptors:i,raidLaserBolts:this.gunfire.rounds.count,raidMuzzleFlashes:this.gunfire.activeMuzzles,raidShipModels:this.enemies.map(u=>u.userData.modelType),interceptorModels:this.fighters.map(u=>u.userData.modelType)})}diagnostic(){return this.metrics}};var Ze=(r=0,e=0,t=0)=>new S(r,e,t),Zd=Ze(0,1,0),Bf=r=>Math.max(0,Math.min(1,r)),uh=r=>(r=Bf(r),r*r*(3-2*r));function Qo(r,e,t,i=1){r.position.copy(e).add(t).multiplyScalar(.5),r.quaternion.setFromUnitVectors(Zd,t.clone().sub(e).normalize()),r.scale.set(i,e.distanceTo(t),i)}var el=class{constructor(e,t,i){this.root=new Ee,this.root.name="Orbital construction drydock",e.add(this.root),this.arms=[],this.cranes=[],this.clamps=[];let n=(g,f=.65)=>new lt({color:g,map:t.map,normalMap:t.normalMap,normalScale:new J(.23,.23),roughness:f,metalness:.75,clearcoat:.12}),s=window.VoyagerFleetLook==="space",a=n(s?8096151:9280681,s?.55:.65),o=n(s?2239027:2371902),l=n(s?2899790:3165797),c=n(s?11044414:12098387,s?.5:.65),h=new lt({color:1060418,roughness:.15,metalness:.55}),d=new je({color:13954559,toneMapped:!1}),p=new je({color:16762745,toneMapped:!1}),u=Wn(this.root),m=(g,f,v,_,x,y,T)=>u.add(it(g,f,v),_,Ze(x,y,T));for(let g of[-1,1]){m(56,.8,3,o,0,-7,g*13),m(55,.16,.25,a,0,-6.4,g*12.2),m(55,.16,.25,a,0,-6.4,g*13.8);for(let f=-27;f<=27;f+=3)m(.12,.1,2.6,a,f,-6.52,g*13),m(.12,1.2,.12,a,f,-5.9,g*14.3),u.add(jt(Ze(f,-7,g*13),Ze(f+2.8,-9,g*13),.1),a),u.add(jt(Ze(f,-9,g*13),Ze(f+2.8,-7,g*13),.1),a),m(.6,.06,.15,f%2?d:p,f,-6.48,g*11.7);m(56,.1,.1,a,0,-5.3,g*14.3),m(55,.25,.4,a,0,-9,g*13);for(let f of[-24,24]){m(1,20,1,l,f,3,g*13),m(1.3,.5,1.3,c,f,12.9,g*13),u.add(jt(Ze(f,-6,g*13),Ze(f-5*Math.sign(f),4,g*13),.18),a);for(let v=-6;v<12;v+=2)m(.15,.08,.9,a,f+.6,v,g*13)}m(50,.6,.7,a,0,13,g*13),m(50,.18,.18,d,0,13.4,g*13);for(let f of[-17,18]){m(3.8,2,2,l,f,-5.8,g*13),m(2.5,.25,2.1,o,f,-4.75,g*13);for(let v=0;v<7;v++)m(.15,1.4,.12,a,f-1.2+v*.4,-5.8,g*11.94)}}for(let g of[-23,0,23]){m(1.3,.65,26,o,g,-7,0);for(let f of[-1,1])u.add(jt(Ze(g,-7,f*12),Ze(g,-3,f*7),.25),a)}for(let g=0;g<2;g++){let f=new Ee;this.root.add(f);let v=Wn(f),_=(R,P,I)=>v.add(R,P,I);_(it(1.1,.6,27),l,Ze(0,13,0)),_(it(.45,.3,27),a,Ze(0,15,0));for(let R=-13;R<13;R+=2)_(jt(Ze(0,13,R),Ze(0,15,R+2),.12),a),_(jt(Ze(0,15,R),Ze(0,13,R+2),.12),a);for(let R of[-1,1]){_(it(2.5,1.2,2),c,Ze(0,13,R*13));for(let P of[-.8,.8]){let I=new Me(.42,.42,.25,16);I.rotateX(Math.PI/2),_(I,o,Ze(P,12.6,R*13))}}v.finish();let x=new Ee;f.add(x);let y=Wn(x);y.add(it(2.8,1.1,2.2),c,Ze(0,12.6,0)),y.add(new Me(.55,.55,1.6,20),a,Ze(0,12.1,0),new Fe(Math.PI/2,0,0)),y.add(it(1.4,1,1.3),h,Ze(1.6,12.1,0)),y.finish();let T=[];for(let R=0;R<2;R++){let P=new re(new Me(1,1,1,6),o);P.castShadow=!0,this.root.add(P),T.push(P)}let w=new re(it(.7,.24,1.6),c);this.root.add(w),this.cranes.push({g:f,trolley:x,cables:T,yoke:w,index:g})}for(let g=0;g<4;g++){let f=new Ee,v=g%2?1:-1;f.position.set(g<2?-11:10,-5.7,v*11),this.root.add(f);let _=new re(new Me(.85,1.1,1,20),l);f.add(_);let x=[];for(let P=0;P<2;P++){let I=new re(new Me(1,1,1,10),P?a:l);I.castShadow=!0,f.add(I),x.push(I)}let y=new re(new at(.55,16,12),c);f.add(y);let T=new Wt(new Gt({map:i,color:14939647,transparent:!0,depthWrite:!1,toneMapped:!1}));T.scale.setScalar(1.1),f.add(T);let w=new re(new li(.22,.8,12),o);f.add(w);let R=new re(new Me(1,1,1,6),o);f.add(R),this.arms.push({g:f,tip:T,links:x,elbow:y,nozzle:w,cable:R,s:v})}for(let g=0;g<6;g++){let f=g%2?1:-1,v=new Ee;v.position.set(-14+Math.floor(g/2)*14,-4.4,f*8.3),this.root.add(v);let _=new re(it(3,1.2,2),c);v.add(_);let x=new re(it(2,.6,1.5),o);x.position.set(0,.8,-f*.4),v.add(x),this.clamps.push({g:v,s:f})}u.finish(),this.tugs=[];for(let g=0;g<2;g++){let f=Ti(g?"scout":"tender",t,{serial:90+g});f.scale.setScalar(.095),this.root.add(f),this.tugs.push(f)}}update(e,t,i,n){let s=uh(e===2?(t-.8)/3:(t-10.5)/2);this.root.updateMatrixWorld(!0),n.updateMatrixWorld(!0),this.clamps.forEach(({g:a,s:o})=>{a.position.z=o*(8.3+s*4),a.rotation.x=o*s*.45});for(let[a,o]of this.cranes.entries()){let l=i.filter(d=>d.mesh.visible&&d.progress>0&&d.progress<.98&&d.center.y>0).sort((d,p)=>d.center.x-p.center.x),c=l[a?l.length-1:0],h=Ze(a?8:-10,3,0);e===1&&t<10.6&&c&&(c.mesh.getWorldPosition(h),this.root.worldToLocal(h)),o.g.position.x=Si.lerp(h.x,a?23:-23,s),o.trolley.position.z=Si.lerp(h.z,0,s);for(let d=0;d<2;d++){let p=Ze(o.g.position.x,12.2,o.trolley.position.z+(d?-.5:.5)),u=h.clone().add(Ze(0,.3,d?-.5:.5));u.lerp(Ze(p.x,11,p.z),s),o.yoke.position.copy(u).add(Ze(0,-.2,d?.5:-.5)),Qo(o.cables[d],p,u,.035),o.cables[d].visible=e===1||s<1}}for(let[a,o]of this.arms.entries()){o.g.position.x=(a<2?-15:1)+uh(t/10)*8;let l=1-s,c=o.s,h=Ze(Math.sin(t*.7+a)*2.5,5.6+Math.sin(t*.9+a)*.5,-c*(4.9+Math.sin(t*.4+a)*.8));h.lerp(Ze(0,2,-c),s);let d=Ze(-1.4+Math.sin(t*.6+a)*.5,4.6,-c*2.1);d.lerp(Ze(0,2.8,-c*.8),s),o.elbow.position.copy(d),Qo(o.links[0],Ze(0,.4,0),d,.28),Qo(o.links[1],d,h,.2),Qo(o.cable,Ze(.4,.7,c*.3),d.clone().add(Ze(.4,.2,0)),.065),o.tip.position.copy(h),o.nozzle.position.copy(h).add(Ze(0,.25,0)),o.nozzle.quaternion.setFromUnitVectors(Zd,h.clone().sub(d).normalize()),o.tip.material.opacity=e===1&&t>1&&t<10?l*(.45+.25*Math.sin(t*39+a)**2):0}this.tugs.forEach((a,o)=>{a.position.set(-19+t*.7,-3.3+Math.sin(t*.8+o)*.4,(o?1:-1)*(17+s*9)),a.rotation.y=o?.22:-.22,a.userData.update(t,.3+s*.5)})}diagnostic(){return{constructionCranes:2,weldingArms:4,releaseClamps:6,serviceTugs:2}}};var ct=(r=0,e=0,t=0)=>new S(r,e,t),dh=ct(0,1,0),Of=r=>Math.max(0,Math.min(1,r)),bn=r=>(r=Of(r),r*r*(3-2*r)),zf=[{p:[-10,2.3757,4],n:[-.24227,.97018,.00722],r:1.35},{p:[-1,1.9618,1.4],n:[.08735,.99614,.00806],r:1.15},{p:[5,.3633,4],n:[.12933,.73382,.66692],r:1.2}];function Jd(r,e,t,i){let n=t.clone().sub(e);r.position.copy(e).add(t).multiplyScalar(.5),r.quaternion.setFromUnitVectors(dh,n.normalize()),r.scale.set(i,e.distanceTo(t),i)}function Gf(r){let e=[],t=[],i=[];for(let s=0;s<=40;s++){let a=s/40*Math.PI*2,o=.05*Math.sin(s*6.23)+.035*Math.cos(s*1.17);for(let l of[0,1]){let c=r*(l?1.18+o:1+o);e.push(Math.cos(a)*c,l?.02:.07+Math.max(0,Math.sin(s*1.91))*.16,Math.sin(a)*c),t.push(s/8,l)}}for(let s=0;s<40;s++){let a=s*2;i.push(a,a+1,a+2,a+1,a+3,a+2)}let n=new Ue;return n.setAttribute("position",new ge(e,3)),n.setAttribute("uv",new ge(t,2)),n.setIndex(i),n.computeVertexNormals(),n}function kf(r,e,t=!1){let i=new Ee,n=Wn(i),s=new lt({color:t?15100454:[14462526,4565687,8891224][e%3],map:r.map,normalMap:r.normalMap,normalScale:new J(.2,.2),metalness:.45,roughness:.48,clearcoat:.25}),a=new dt({color:10925765,metalness:.85,roughness:.3}),o=new dt({color:1517363,metalness:.7,roughness:.5}),l=new je({color:t?16768194:12119295,toneMapped:!1});n.add(it(1.9,.75,1.4),s),n.add(it(.6,.24,.8),o,ct(.7,.45,0)),n.add(new at(.15,12,8),l,ct(1.04,.16,0));for(let d of[-1,1])n.add(jt(ct(0,0,0),ct(-.2,0,d*1.1),.12),a),n.add(new Me(.35,.42,.9,16),o,ct(-.2,0,d*1.1)),n.add(new Rt(.34,.065,6,16),a,ct(-.2,.45,d*1.1),new Fe(Math.PI/2,0,0)),n.add(new Me(.22,.22,.03,12),l,ct(-.2,-.47,d*1.1));if(t)for(let d of[-1,1])n.add(new Er(.28,.9,3,10),a,ct(-.6,.15,d*.52),new Fe(0,0,Math.PI/2));else for(let d=0;d<4;d++)n.add(it(.13,.12,.7),a,ct(-.4+d*.25,.46,0));n.finish();let c=new re(new Me(1,1,1,10),a);i.add(c);let h=new re(new li(.14,.5,12),o);return i.add(h),i.userData={arm:c,tool:h,firefighter:t},i}var tl=class{constructor(e,t,i,n,s,a=zf){this.hero=e,this.SITES=a,this.root=new Ee,this.root.name="Battle damage / drone fire suppression / hull repairs",e.add(this.root),this.enabled={value:0},this.local={value:new fe},this.holes={value:a.map(d=>new Ke(...d.p,d.r))},this.sites=[],this.drones=[],this.metrics={repairDrones:5,repairBreaches:3};let o=d=>{let p=d.onBeforeCompile.bind(d),u=d.customProgramCacheKey.bind(d);d.onBeforeCompile=g=>{p(g),Object.assign(g.uniforms,{damageEnabled:this.enabled,damageLocal:this.local,damageHoles:this.holes}),g.vertexShader=`varying vec3 vDamageLocal;uniform mat4 damageLocal;
`+g.vertexShader,g.vertexShader=g.vertexShader.replace("#include <project_vertex>",`vDamageLocal=(damageLocal*modelMatrix*vec4(transformed,1.0)).xyz;
#include <project_vertex>`),g.fragmentShader=`varying vec3 vDamageLocal;uniform float damageEnabled;uniform vec4 damageHoles[3];
`+g.fragmentShader,g.fragmentShader=g.fragmentShader.replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
if(damageEnabled>0.5){for(int i=0;i<3;i++){if(damageHoles[i].w>0.01 && distance(vDamageLocal,damageHoles[i].xyz)<damageHoles[i].w)discard;}}`)};let m=u();d.customProgramCacheKey=()=>m+"-repair-holes-1.8",d.needsUpdate=!0},l=new Set([t]);i.assembled.traverse(d=>{d.material&&l.add(d.material)}),l.forEach(o);for(let[d,p]of a.entries()){let u=new Ee;u.position.fromArray(p.p),u.quaternion.setFromUnitVectors(dh,ct(...p.n).normalize()),this.root.add(u);let m=p.r,g=new dt({color:1185563,roughness:1,metalness:.35,side:gt}),f=new lt({color:4932931,metalness:.84,roughness:.65,emissive:14109459,emissiveIntensity:.35,side:gt,normalMap:n.normalMap}),v=new re(Gf(m),f);u.add(v);let _=new re(new xn([new J(.05,-.8*m),new J(m*.45,-.7*m),new J(m*.85,-.35*m),new J(m*1.03,.01)],32),g);u.add(_);let x=new Ee;u.add(x);for(let P=0;P<3;P++){let I=new re(jt(ct(-m*.65,-.45,-.4+P*.4),ct(m*.65,-.45,-.4+P*.4),.06),new dt({color:5661549,metalness:.8,roughness:.5}));x.add(I)}let y=new re(it(m*2.3,.08,m*2.3,.14),new lt({color:d===1?2386594:10663881,normalMap:n.normalMap,normalScale:new J(.3,.3),metalness:.6,roughness:.4,clearcoat:.3}));y.position.y=.13,u.add(y);let T=jn(90+d*9);u.add(T);for(let P of T.children)P.material.uniforms.strength={value:1},P.material.fragmentShader=`uniform float strength;
`+P.material.fragmentShader.replace("gl_FragColor=vec4(c,a);","gl_FragColor=vec4(c,a*strength);");let w=new Wt(new Gt({map:s,color:15267839,transparent:!0,depthWrite:!1,toneMapped:!1}));u.add(w);let R=new Pt(16747325,0,12,2);R.position.set(0,1,0).applyQuaternion(u.quaternion).add(u.position),this.root.add(R),this.sites.push({g:u,rim:v,cup:_,internals:x,patch:y,fire:T,flare:w,lamp:R,site:p})}for(let d=0;d<5;d++){let p=kf(n,d,d>=3);this.root.add(p);let u=new re(new Me(1,1,1,8),new je({color:12775679,transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));this.root.add(u),p.userData.arc=u,this.drones.push(p)}let c=new at(1,6,4);this.mist=new Ct(c,new je({color:12707827,transparent:!0,opacity:.25,depthWrite:!1,toneMapped:!1}),180),this.mist.instanceMatrix.setUsage(Kt),this.mist.frustumCulled=!1,this.root.add(this.mist),this.matrix=new fe,this.q=new $e,this.sparksGeo=new Ue,this.sparksGeo.setAttribute("position",new ke(new Float32Array(360*3),3)),this.sparksGeo.setAttribute("alpha",new ke(new Float32Array(360),1));let h=new st({transparent:!0,depthWrite:!1,uniforms:{height:{value:1080}},vertexShader:"attribute float alpha;varying float a;uniform float height;void main(){a=alpha;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(height*.10/-p.z,1.,5.);}",fragmentShader:"varying float a;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(1.,.8,.45,max(0.,1.-r)*a);}"});this.sparks=new $i(this.sparksGeo,h),this.sparks.frustumCulled=!1,this.root.add(this.sparks)}update(e,t){let i=e===5,n=e===4;if(this.root.visible=i||n,this.enabled.value=i||n?1:0,this.sites.forEach(p=>p.lamp.intensity=0),!this.root.visible)return;this.hero.updateMatrixWorld(!0),this.local.value.copy(this.hero.matrixWorld).invert();let s=0,a=0,o=0,l=0,c=0,h=this.sparksGeo.attributes.position,d=this.sparksGeo.attributes.alpha;for(let[p,u]of this.sites.entries()){let m=8+p*.9,g=n?bn((t-m)/.3):1,f=i?bn((t-3-p*.4)/2.7):0,v=i?bn((t-6.4-p*.45)/3.6):0,_=g*(1-f),x=u.site.r*g*(1-v);this.holes.value[p].w=x,u.g.visible=g>.001,u.rim.visible=u.cup.visible=u.internals.visible=x>.02,u.rim.scale.setScalar(Math.max(.001,x/u.site.r)),u.cup.scale.copy(u.rim.scale),u.internals.scale.copy(u.rim.scale),u.rim.material.emissiveIntensity=_*.5,u.patch.visible=i&&v>.01,u.patch.scale.set(bn(v*2.1),1,bn(v*1.3)),u.fire.visible=_>.015,u.lamp.intensity=_*(7+Math.sin(t*23+p)*2),u.fire.visible&&s++,x>.025&&a++,o+=v/3,u.fire.children.forEach((R,P)=>{let I=(t*.7+P*.23+p*.13)%1;R.position.set(Math.sin(P*2.4+t)*.3,.35+I*(1.4+P*.24),Math.cos(P*3+t)*.3),R.scale.set((.5+P*.08)*(1-I*.5),(.9+P*.22)*(1-I*.45),(.5+P*.08)*(1-I*.5)),R.material.uniforms.age.value=.08+I*.38,R.material.uniforms.time.value=t,R.material.uniforms.strength.value=_*(1-I*.6)});let y=i&&t>6.1+p*.4&&t<10.5+p*.4,T=t*4+p,w=ct(Math.cos(T)*u.site.r*(1-v*.5),.18,Math.sin(T)*u.site.r*(1-v*.5));if(u.flare.visible=y,u.flare.position.copy(w),u.flare.scale.setScalar(.75+Math.sin(t*51)**2*.25),y||_>.3)for(let R=0;R<70;R++){let P=(t*2+R*.037)%1,I=R*2.39996+p,G=y?1.5:2.4,k=y?w:ct(0,.2,0),O=k.clone().add(ct(Math.cos(I)*P*G,Math.sin(R*3.1)*P*.7+.2-P*P*.8,Math.sin(I)*P*G));O.applyQuaternion(u.g.quaternion).add(u.g.position),h.setXYZ(c,...O.toArray()),d.setX(c++,(1-P)**2*(y?.8:.35))}}for(let[p,u]of this.drones.entries()){if(u.userData.arc.visible=!1,u.visible=i&&t>.6&&t<13.3,!u.visible)continue;let m=this.sites[p<3?p:p===3?0:2],g=ct(...m.site.n),f=ct(...m.site.p),v=bn((t-.7-p*.16)/2),_=bn((t-11.4-p*.1)/1.7),x=f.clone().addScaledVector(g,p<3?3:5).add(ct(p<3?-1.7:2,0,p<3?1.3:-1.5)),y=ct(-27+p*13,10+p%2*4,19+p*2);u.position.copy(y).lerp(x,v).lerp(y.clone().add(ct(12,18,-3)),_),u.position.y+=Math.sin(t*1.4+p)*.12,u.rotation.set(.08*Math.sin(t+p),-.4+p*.2,.05*Math.cos(t+p)),u.updateMatrix();let T=f.clone().sub(u.position).applyQuaternion(u.quaternion.clone().invert()),w=T.clone().normalize().multiplyScalar(p<3?1.8:1.4);if(Jd(u.userData.arm,ct(.6,-.2,0),w,.09),u.userData.tool.position.copy(w),u.userData.tool.quaternion.setFromUnitVectors(dh,T.clone().normalize()),p<3&&t>6.1+p*.4&&t<10.5+p*.4){let I=bn((t-6.4-p*.45)/3.6),G=t*4+p,k=ct(Math.cos(G)*m.site.r*(1-I*.5),.18,Math.sin(G)*m.site.r*(1-I*.5)).applyQuaternion(m.g.quaternion).add(m.g.position),O=w.clone().applyQuaternion(u.quaternion).add(u.position);Jd(u.userData.arc,O,k,.018),u.userData.arc.visible=!0}if(t>2.7&&t<6.2&&v>.95&&_===0){let I=w.clone().applyQuaternion(u.quaternion).add(u.position);for(let G=0;G<30;G++){let k=(t*2+G/30)%1,O=k*.38,N=I.clone().lerp(f,k).add(ct(Math.sin(G*8)*O,Math.cos(G*5)*O,Math.sin(G*3)*O));this.matrix.compose(N,this.q,ct(.025+k*.08,.025+k*.08,.07+k*.12)),this.mist.setMatrixAt(l++,this.matrix)}}}this.mist.count=l,this.mist.instanceMatrix.needsUpdate=!0,this.mist.visible=i&&l>0,this.sparksGeo.setDrawRange(0,c),h.needsUpdate=!0,d.needsUpdate=!0,this.sparks.material.uniforms.height.value=innerHeight,Object.assign(this.metrics,{activeFires:s,openBreaches:a,repairProgress:Math.round(o*100),repairMode:i?"drone repair":n?"battle damage":"off",suppressionParticles:l})}diagnostic(){return this.metrics}};var Vf=r=>Math.max(0,Math.min(1,r)),ki=r=>(r=Vf(r),r*r*r*(r*(r*6-15)+10)),Yt=Si.lerp,Hf=[[-27,11,-1],[-36,10,19],[-39,16,-16],[-39,7,29],[-46,18,9]],Wf=[[30,12,-20],[42,7,-5],[44,18,-38],[54,11,-18],[53,24,-51]],il=class{constructor(e,t){this.root=new Ee,this.root.name="Gift subscriptions / approaching enemy fleet",this.root.visible=!1,e.add(this.root),this.enemies=qo.map((i,n)=>{let s=Ti(i,t,{enemy:!0,serial:n+1});return s.scale.setScalar([.49,.32,.37,.34,.32][n]),this.root.add(s),s}),this.phase="idle",this.visibleEnemies=0}update(e,t,i,n){this.root.visible=!0;let s=ki(e/6),a=ki((e-6)/6),o=ki((e-11)/4),l=.55;t.scale.setScalar(.78),t.position.set(Yt(-30,-12,s),6+Math.sin(e*.3)*.25,6),t.rotation.set(Math.sin(e*.3)*.008,Yt(-.08,l,a),-.045*Math.sin(a*Math.PI));let c=Math.min(5,Math.max(2,Math.ceil(Math.sqrt(Math.max(1,Number(n)||1)))+1));return i.forEach((h,d)=>{if(h.visible=d<c,!h.visible)return;let p=ki((e-.9-d*.55)/6.4),u=ki((e-6.4-d*.25)/5.6),m=Hf[d],g=d%2?1:-1;h.scale.setScalar([.38,.36,.37,.34,.32][d]),h.position.set(Yt(-84-d*7,m[0],p),Yt(m[1]+4,m[1],p)+Math.sin(e*.35+d)*.16,Yt(m[2]+10,m[2],p)),h.rotation.set(g*.025*(1-u),Yt(-.08,l,u),g*.13*Math.sin(u*Math.PI)),h.userData.update(e+d,Yt(1.05,.3,o))}),this.visibleEnemies=0,this.enemies.forEach((h,d)=>{let p=2.5+d*.4,u=ki((e-p)/10.2),m=Wf[d];if(h.visible=e>=p,!h.visible)return;this.visibleEnemies++,h.position.set(Yt(m[0]+67+d*5,m[0],u),Yt(m[1]+9,m[1],u)+Math.sin(e*.22+d)*.12,Yt(m[2]-58-d*5,m[2],u));let g=t.position.x-h.position.x,f=t.position.z-h.position.z;h.rotation.set(.018*Math.sin(e*.25+d)*(1-o),Math.atan2(-f,g),.035*Math.sin(e*.4+d)*(1-o)),h.userData.update(e+d*.6,Yt(.95,.27,ki((e-12-d*.15)/3.5)))}),this.phase=e<3?"assembling":e<11?"enemy-approach":e<14.5?"forming-battle-line":"ready-to-face-off",{camera:[Yt(31,38,ki((e-2)/9)),Yt(37,43,ki((e-2)/9)),Yt(124,143,ki((e-2)/9))],look:[0,5,-9],thrust:Yt(.8,.28,o)}}diagnostic(){return{giftBackdrop:"enemy-fleet",faceoffVisible:this.root.visible,faceoffPhase:this.root.visible?this.phase:"idle",approachingEnemyModels:this.enemies.map(e=>e.userData.modelType),approachingEnemyColours:this.enemies.map(e=>e.userData.livery),approachingEnemies:this.root.visible?this.visibleEnemies:0}}};var Kd=(r=0,e=0,t=0)=>new S(r,e,t);var nl=class{constructor(e,t,i){this.root=new Ee,this.root.name="Crossfire damage / timed secondary explosions",e.add(this.root),this.events=t.filter((n,s)=>s%9===0&&n.hit<17).map((n,s)=>({at:n.hit,p:n.to.clone(),scale:n.side?.45:.27,seed:s})),this.pool=[];for(let n=0;n<16;n++){let s=jn(n*6.31),a=new Wt(new Gt({map:i,color:16766624,transparent:!0,depthWrite:!1,toneMapped:!1}));s.add(a),this.root.add(s),this.pool.push({g:s,flash:a})}this.debris=new Ct(new qe(.12,.08,.23),new dt({color:7833234,metalness:.8,roughness:.55}),256),this.debris.instanceMatrix.setUsage(Kt),this.debris.frustumCulled=!1,this.root.add(this.debris),this.m=new fe,this.q=new $e,this.position=Kd(),this.scale=Kd(),this.euler=new Fe,this.light=new Pt(16756074,0,60,2),this.root.add(this.light)}update(e,t,i){if(this.root.visible=e===4,this.light.intensity=0,e!==4)return;let n=0,s=0;for(let a of this.events){let o=t-a.at;if(o<0||o>1.5||n>=this.pool.length)continue;let l=o/1.5,{g:c,flash:h}=this.pool[n++];c.visible=!0,c.position.copy(a.p);for(let d=0;d<4;d++){let p=c.children[d],u=(.12+(1-Math.exp(-o*5))*(1.2+d*.2))*a.scale;p.scale.set(u,u*(1+d*.1),u),p.position.set(Math.sin(d*2.7+a.seed)*o*.5,Math.cos(d*1.1)*o*.4,Math.cos(d*3+a.seed)*o*.5),p.material.uniforms.age.value=l,p.material.uniforms.time.value=t}h.scale.setScalar((.5+o*3)*a.scale),h.material.opacity=Math.exp(-o*13)*.8,o<.16&&(this.light.position.copy(a.p),this.light.intensity=Math.max(this.light.intensity,Math.exp(-o*10)*65));for(let d=0;d<10;d++){let p=d*2.399+a.seed,u=this.position.set(Math.cos(p),Math.sin(d*3.7),Math.sin(p)).multiplyScalar(o*(1+d%3)).add(a.p);this.q.setFromEuler(this.euler.set(o+d,o*2,d)),this.m.compose(u,this.q,this.scale.setScalar(1-l)),this.debris.setMatrixAt(s++,this.m)}}for(let a=n;a<this.pool.length;a++)this.pool[a].g.visible=!1;this.debris.count=s,this.debris.instanceMatrix.needsUpdate=!0,this.active=n}diagnostic(){return{secondaryExplosionEvents:this.events.length,activeSecondaryExplosions:this.active||0}}};var rl=class extends fn{constructor(){super();let e=new qe;e.deleteAttribute("uv");let t=new dt({side:Ut}),i=new dt,n=new Pt(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let s=new re(e,t);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);let a=new Ct(e,i,6),o=new _t;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let l=new re(e,Xr(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new re(e,Xr(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new re(e,Xr(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let d=new re(e,Xr(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let p=new re(e,Xr(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);let u=new re(e,Xr(100));u.position.set(0,20,0),u.scale.set(1,.1,1),this.add(u)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Xr(r){return new Cs({color:0,emissive:16777215,emissiveIntensity:r})}window.VoyagerFleetPerformance={NoiseBank:Ks,SoundTimeline:Js};var Xs=(r,e=0,t=1)=>Math.max(e,Math.min(t,r)),Dt=r=>(r=Xs(r),r*r*r*(r*(r*6-15)+10)),qn=Si.lerp;function $d(r){let e=Go(r,.72),t=e.attributes.position,i=e.attributes.normal,n=e.attributes.paint,s=new me("#5a6670"),a=new Float32Array(t.count*2),o=new Float32Array(t.count*3),l=new Float32Array(t.count*2),c=new me("#c5d0d7"),h=new me("#1965ac"),d=new me("#3c4855"),p=new me("#061523"),u=new me,m=new S,g=new S,f=new S,v=new S;for(let _=0;_<t.count;_+=3){m.fromBufferAttribute(t,_),g.fromBufferAttribute(t,_+1),f.fromBufferAttribute(t,_+2),v.subVectors(g,m).cross(f.sub(m)).normalize();let x=Math.abs(v.y)>Math.max(Math.abs(v.x),Math.abs(v.z))?1:Math.abs(v.x)>Math.abs(v.z)?0:2;for(let y=_;y<_+3;y++){let T=t.getX(y),w=t.getY(y),R=t.getZ(y),P=Math.abs(R);a[y*2]=(x===0?R:T)/8+.5,a[y*2+1]=(x===1?R:w)/8+.5;let I,G,k;if(n){let N=Math.round(n.getX(y));I=N===1,G=N===2||N===4,k=N===3,u.copy(k?p:I?h:N===4?s:G?d:c)}else I=P>2.9&&P<5.6&&T<12&&w>-.6||P<1.4&&T>3&&w>.2||T<-12&&w>1,G=w<-2.1||T<-17.4,k=T>-14&&T<-6&&w>2.3&&w<4&&Math.abs(i.getY(y))<.6||T>17.7&&w>-.2&&w<.8,u.copy(k?p:I?h:G?d:c);let O=.96+.025*Math.sin(T*.7)*Math.cos(R*.8);u.multiplyScalar(O),o.set([u.r,u.g,u.b],y*3),l.set([G?1:0,k?1:0],y*2)}}return e.setAttribute("uv",new ke(a,2)),e.setAttribute("color",new ke(o,3)),e.setAttribute("finish",new ke(l,2)),e}function Xf(r){let e=r.attributes.position,t=new Map;for(let i=0;i<e.count;i+=3){let n=(e.getX(i)+e.getX(i+1)+e.getX(i+2))/3,s=(e.getY(i)+e.getY(i+1)+e.getY(i+2))/3,a=(e.getZ(i)+e.getZ(i+1)+e.getZ(i+2))/3,o=Math.min(7,Math.max(0,Math.floor((n+20)/5))),l=a<-1.8?0:a>1.8?2:1,c=s>.8?1:0,h=o+8*l+24*c;t.has(h)||t.set(h,[]),t.get(h).push(i,i+1,i+2)}return[...t].map(([i,n])=>{let s=new Ue;for(let[o,l]of Object.entries(r.attributes)){let c=new Float32Array(n.length*l.itemSize);n.forEach((h,d)=>{for(let p=0;p<l.itemSize;p++)c[d*l.itemSize+p]=l.array[h*l.itemSize+p]}),s.setAttribute(o,new ke(c,l.itemSize))}s.computeBoundingBox();let a=s.boundingBox.getCenter(new S);return s.translate(-a.x,-a.y,-a.z),{geo:s,center:a,key:i}})}function jf(){let r=document.createElement("canvas");r.width=r.height=128;let e=r.getContext("2d"),t=e.createRadialGradient(64,64,0,64,64,64);return t.addColorStop(0,"#fff"),t.addColorStop(.06,"#fff"),t.addColorStop(.15,"rgba(255,255,255,.6)"),t.addColorStop(.4,"rgba(255,255,255,.12)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,128,128),new xi(r)}function qf(){let r=document.createElement("canvas");r.width=256,r.height=64;let e=r.getContext("2d");for(let t=0;t<256;t++){let i=t/255,n=4+i*21,s=e.createLinearGradient(0,32-n,0,32+n);s.addColorStop(0,"#ffffff00"),s.addColorStop(.35,`rgba(255,255,255,${(1-i)**1.6*.3})`),s.addColorStop(.5,`rgba(255,255,255,${(1-i)**1.4})`),s.addColorStop(.65,`rgba(255,255,255,${(1-i)**1.6*.3})`),s.addColorStop(1,"#ffffff00"),e.fillStyle=s,e.fillRect(255-t,0,1,64)}return new xi(r)}function Yf(){let r=window.__fleetLK||null,e=new fn,t=document.createElement("canvas");t.width=1024,t.height=512;let i=t.getContext("2d"),n=i.createLinearGradient(0,0,0,512);n.addColorStop(0,"#05070f"),n.addColorStop(.55,"#070b16"),n.addColorStop(1,"#0a1322"),i.fillStyle=n,i.fillRect(0,0,1024,512);for(let[p,u,m,g]of[[700,180,260,"rgba(90,60,160,.16)"],[300,300,200,"rgba(30,90,160,.14)"],[820,330,150,"rgba(160,70,110,.10)"]]){let f=i.createRadialGradient(p,u,0,p,u,m);f.addColorStop(0,g),f.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=f,i.fillRect(0,0,1024,512)}let s=7,a=()=>(s=s*16807%2147483647,s/2147483647);for(let p=0;p<900;p++){let u=a()*1024,m=a()*512,g=a()<.08?1.6:a()*.9+.3,f=.35+a()*.65;i.fillStyle=`rgba(${220+a()*35|0},${225+a()*30|0},255,${f})`,i.beginPath(),i.arc(u,m,g,0,7),i.fill()}let o=new xi(t);o.colorSpace=xt,o.mapping=Nr,e.add(new re(new at(60,32,16),new je({map:o,side:Ut})));let l=new re(new at(3.2,24,16),new je({color:new me().setRGB(160,140,110)}));l.position.set(r&&Number.isFinite(r[6])?r[6]:16,r&&Number.isFinite(r[7])?r[7]:30,r&&Number.isFinite(r[8])?r[8]:30).normalize().multiplyScalar(50),e.add(l);let c=new re(new at(9,24,16),new je({color:new me().setRGB(4,3.4,2.6),transparent:!0,opacity:.45}));c.position.copy(l.position),e.add(c);let h=new re(new at(34,32,16),new je({color:new me().setRGB(.22,.42,.95)}));h.position.set(4,-62,18),e.add(h);let d=new re(new at(34.2,32,16),new je({color:132104,transparent:!0,opacity:.75}));return d.position.set(-14,-66,-8),e.add(d),e}function Zf(r,e,t){e.computeBoundingBox();let i=e.boundingBox,n=new S;i.getCenter(n);let s=(d,p,u)=>{let m=new Wt(new Gt({map:t,color:d,transparent:!0,depthWrite:!1,blending:Ns,toneMapped:!1}));return m.position.copy(p),m.scale.setScalar(u),r.add(m),m},a=s(16726843,new S(n.x+2,n.y+.4,i.min.z+.6),1.1),o=s(3932010,new S(n.x+2,n.y+.4,i.max.z-.6),1.1),l=s(16777215,new S(n.x-3,i.max.y+.3,n.z),1.6),c=s(16777215,new S(i.min.x+1.2,i.max.y-.6,n.z),.9),h=s(16771524,new S(i.max.x-1,n.y-.2,n.z),1.3);return{update(d,p){let u=p!==1||d>11,m=.65+.35*Math.sin(d*2.6);a.material.opacity=o.material.opacity=u?m*.9:0;let g=d*1.25%1;l.material.opacity=u&&(g<.06||g>.12&&g<.17)?1:0,c.material.opacity=u?.7:0,h.material.opacity=u?.55+.25*Math.sin(d*1.1):0}}}var ph=class{constructor(e,{quality:t="auto",look:i="studio"}={}){this.canvas=e,this.quality=t,this.visualLook=i,window.VoyagerFleetLook=i;let n=(()=>{try{let h=new URLSearchParams(location.search).get("lk");return h?h.split(",").map(Number):null}catch{return null}})();this.LK=n,window.__fleetLK=n;let s=(h,d)=>n&&Number.isFinite(n[h])?n[h]:d;this.renderScale=t==="auto"?Math.min(1,1920/Math.min(innerWidth,3840)):1,this.pendingScale=this.renderScale,this.targetFPS=60,this.lastShadow=-1,this.samples=[],this.scaleCooldown=0,this.stats={fps:0,width:0,height:0,scale:1,quality:t},this.look=new S,this.armPositions=Array.from({length:4},()=>new S),this.tempMatrix=new fe,this.lastStage=0,this.contextLost=!1,this.renderer=new Oo({canvas:e,alpha:!0,antialias:!0,powerPreference:"high-performance",premultipliedAlpha:!0}),this.renderer.setPixelRatio(1),this.renderer.outputColorSpace=xt,this.renderer.toneMapping=bo,this.renderer.toneMappingExposure=1,this.renderer.setClearColor(0,0),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=fo,this.renderer.shadowMap.autoUpdate=!1,this.scene=new fn,this.scene.background=null,this.camera=new Lt(31,16/9,.2,700),this.camera.position.set(32,19,45),this.camera.lookAt(0,-1,0),this.clock=0,this.active=!1,this.surface=null,this.parts=[],this.fleet=[],this.sparks=[],this.lasers=[],this.missiles=[],this.glowMap=jf(),this.plumeMap=qf();let a=this.visualLook==="space",o=a?Yf():new rl,l=new kr(this.renderer);this.envTarget=l.fromScene(o,a?.02:.035),this.scene.environment=this.envTarget.texture,this.scene.environmentIntensity=a?s(5,.9):.7,o.traverse?.(h=>{h.geometry?.dispose?.(),h.material?.map?.dispose?.(),h.material?.dispose?.()}),o.dispose?.(),l.dispose(),a&&(this.renderer.toneMappingExposure=s(4,1.2)),this.scene.add(new Is(a?4871270:13096937,a?329742:1120547,a?s(3,.14):.3));let c=(h,d,p)=>{let u=new Us(h,d);return u.position.set(...p),this.scene.add(u),u};this.key=c(a?16773590:16773340,a?s(0,4.4):3.1,a?[s(6,16),s(7,30),s(8,30)]:[22,32,19]),this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048),Object.assign(this.key.shadow.camera,{left:-40,right:40,top:30,bottom:-30,near:1,far:140}),this.key.shadow.bias=-35e-5,this.key.shadow.normalBias=.04,c(a?8369407:11259107,a?s(1,.3):1.25,a?[-28,10,-34]:[-25,15,-29]),c(a?6131680:11651804,a?s(2,.55):.45,a?[4,-24,18]:[0,-14,30]),this.weldLight=new Pt(8773631,0,30,2),this.scene.add(this.weldLight),this.battleLight=new Pt(16744504,0,100,2),this.scene.add(this.battleLight),this.resize(),e.addEventListener("webglcontextlost",h=>{h.preventDefault(),this.contextLost=!0,this.ready=!1}),e.addEventListener("webglcontextrestored",()=>{this.contextLost=!1,this.ready=!!this.assetsReady,this.lastShadow=-1})}resize(){let e=this.quality==="balanced"?1920:3840,t=Math.min(1,e/innerWidth)*this.renderScale,i=Math.max(1,Math.round(innerWidth*t)),n=Math.max(1,Math.round(innerHeight*t));(this.canvas.width!==i||this.canvas.height!==n)&&this.renderer.setSize(i,n,!1),this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),Object.assign(this.stats,{width:i,height:n,scale:this.renderScale})}frameTiming(e,t){if(e<4||e>250||(this.samples.push(e),this.samples.length<90))return;let i=this.samples.slice().sort((l,c)=>l-c),n=i[Math.floor(i.length/2)],s=1e3/(this.samples.reduce((l,c)=>l+c)/this.samples.length);if(this.samples.length=0,this.stats.fps=Math.round(s),this.quality!=="auto"||t<this.scaleCooldown)return;let a=this.pendingScale,o=Math.min(1,1280/Math.min(innerWidth,3840));n>20?a=Math.max(o,a-.1):n<17.7&&s>58&&(a=Math.min(1,a+.05)),a!==this.pendingScale&&(this.pendingScale=a,this.scaleCooldown=t+4500)}diagnostic(){return{...this.stats,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,transparent:this.renderer.getClearAlpha()===0,contextLost:this.contextLost,heroTriangles:this.heroFaces,heroModel:Bd.name,detailFittings:this.hullDetails?.anchors,detailTriangles:this.hullDetails?.triangles,pbrMaps:4096,visualBuild:"1.14",noiseBuffers:window.VoyagerFleetAudioStats?.generated||0,autoResize:"between alerts",escortModels:this.fleet.map(e=>e.userData.modelType),escortColours:this.fleet.map(e=>e.userData.livery),...this.repairs?.diagnostic(),...this.faceoff?.diagnostic(),...this.combat?.diagnostic(),...this.shipyard?.diagnostic(),...this.gunfire?.diagnostic(),...this.ordnance?.diagnostic(),...this.raid?.diagnostic()}}async init(){let e={},t=new Ps;await Promise.all(Object.entries(window.VoyagerFleetSurfaces).map(async([o,l])=>{let c=await t.loadAsync(l);c.wrapS=c.wrapT=fr,c.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy()),o==="map"&&(c.colorSpace=xt),e[o]=c})),this.surface=new lt({map:e.map,normalMap:e.normalMap,aoMap:e.orm,aoMapIntensity:.65,roughnessMap:e.orm,metalnessMap:e.orm,vertexColors:!0,color:16777215,metalness:1,roughness:1,normalScale:new J(.72,.72),clearcoat:.28,clearcoatRoughness:.34,envMapIntensity:1,side:gt}),this.surface.onBeforeCompile=o=>{o.vertexShader=`attribute vec2 finish; varying vec2 vFinish;
`+o.vertexShader,o.vertexShader=o.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vFinish=finish;`),o.fragmentShader=`varying vec2 vFinish;
`+o.fragmentShader,o.fragmentShader=o.fragmentShader.replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor=mix(metalnessFactor,.88,vFinish.x);`),o.fragmentShader=o.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor=mix(roughnessFactor,.09,vFinish.y);`)},this.surface.customProgramCacheKey=()=>"voyager-hull-pbr-1.3";let i=Od();this.heroFaces=i.attributes.position.count/3,this.heroSurface=i.clone();let n=$d(i);this.hero=new Ee,this.shipRoot=new Ee,this.hero.add(this.shipRoot),this.scene.add(this.hero),this.parts=Xf(n).map((o,l)=>{let c=new re(o.geo,this.surface);return c.position.copy(o.center),c.castShadow=!0,c.receiveShadow=!0,this.shipRoot.add(c),{...o,mesh:c,order:(o.center.x+20)/40*.7+l%3*.09}}),this.assembled=new re(n,this.surface),this.assembled.castShadow=!0,this.assembled.receiveShadow=!0,this.hero.add(this.assembled),this.hullDetails=Gd(this.hero,this.parts,e,this.heroSurface);let s=zd();this.fleetGeo=$d(s),this.ghost=new re(this.fleetGeo,new je({color:4496883,wireframe:!0,transparent:!0,opacity:.035,depthWrite:!1})),this.hero.add(this.ghost),this.hero.userData.engines=this.engines(this.hero),this.shipyard=new el(this.scene,e,this.glowMap),this.dock=this.shipyard.root,this.arms=this.shipyard.arms,this.createFX(),this.ordnance=new Ko(this.scene,e),this.enemy=Ti("marauder",e,{enemy:!0}),this.enemy.scale.setScalar(.31),this.enemy.rotation.y=Math.PI,this.enemy.position.set(25,2,-12),this.scene.add(this.enemy),this.battleEnemies=[this.enemy];for(let[o,l]of["raider","destroyer"].entries()){let c=Ti(l,e,{enemy:!0,serial:o+2});c.scale.setScalar(.24+o*.035),c.rotation.y=Math.PI,c.position.set(...o?[36,-1,6]:[15,10,-24]),this.scene.add(c),this.battleEnemies.push(c)}for(let o=0;o<5;o++){let l=Ti(Hd[o],e,{serial:o+1});this.fleet.push(l),this.scene.add(l)}this.visualLook==="space"&&(this.navLights=Zf(this.hero,n,this.glowMap)),this.faceoff=new il(this.scene,e),this.repairs=new tl(this.hero,this.surface,this.hullDetails,e,this.glowMap,Wo(this.heroSurface,[{x:-10,z:4,r:1.35},{x:-1,z:1.4,r:1.15},{x:5,z:4,r:1.2}])),this.gunfire=new Wr(this.scene),this.heroWeapons=new Yo(this.hero,e);let a=(o,l)=>{let c=l.clone();return c.applyEuler(new Fe(Math.sin(o*.35)*.012,-.08+Math.sin(o*.23)*.025,Math.sin(o*.3)*.018)),c.add(new S(-4+Math.sin(o*.28)*.9,Math.sin(o*.38)*.35,0))};for(let o=0;o<2;o++)this.gunfire.schedule({start:2.2+o*.18,end:15.8,interval:.51,burst:4,spacing:.085,gun:o,side:1,muzzle:(l,c)=>this.heroWeapons.muzzleAt(o,l,c),target:(l,c)=>new S(24.8,2+(c-1)*.2,-12+(o%2?-.5:.5)),speed:100});this.gunfire.schedule({start:3.1,end:15.5,interval:.59,burst:4,spacing:.09,side:0,gun:10,muzzle:o=>new S(21,3.1,-12),target:o=>a(o,new S(3,.8,3.3)),speed:85});for(let o=0;o<3;o++){let l=o%2?1:-1,c=new S(-13-o*5,6+o*3,l*(10+o*2));this.gunfire.schedule({start:2.5+o*.2,end:15.6,interval:.63,burst:4,spacing:.08,gun:20+o,side:1,muzzle:h=>c.clone().add(new S(3,1.5,0)),target:h=>this.battleEnemies[o].position.clone().add(new S(0,.8,0)),speed:100})}for(let o=1;o<3;o++)this.gunfire.schedule({start:3.4+o*.2,end:15.6,interval:.68,burst:4,spacing:.085,gun:10+o,side:0,muzzle:l=>this.battleEnemies[o].position.clone().add(new S(-3,.8,0)),target:l=>a(l,new S(-10+o*7,1.5,4)),speed:90});this.combat=new nl(this.scene,this.gunfire.shots,this.glowMap),this.raid=new $o(this.scene,e,this.fleetGeo,this.glowMap),this.shield.visible=!0,this.ready=!0;for(let o of Object.values(e))this.renderer.initTexture(o);this.renderer.compileAsync&&await this.renderer.compileAsync(this.scene,this.camera);for(let[o,l]of[[1,5],[2,7],[3,8],[4,0],[4,8.6],[4,12],[5,5],[5,9],[6,12],[6,24]])this.render(o,l),await new Promise(c=>setTimeout(c,0));return this.assetsReady=!0,this.lastStage=0,this.clear(),this}engines(e){let t=new Ee;e.add(t);let i=[[-18.6,-.35,-4.7],[-18.6,-.35,4.7],[-19,-.6,-1.25],[-19,-.6,1.25]],n=[],s=[],a=[];for(let c=0;c<4;c++){let h=i[c],d=c<2?.58:.34;for(let u of[0,Math.PI/2])for(let[m,g]of[[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]]){let f=(g-.5)*d*2;n.push(-m*8,f*Math.cos(u),f*Math.sin(u)),s.push(m,g),a.push(...h)}let p=new Wt(new Gt({map:this.glowMap,color:12641791,transparent:!0,depthWrite:!1,blending:kt,toneMapped:!1,opacity:.7}));p.position.set(...h),p.scale.setScalar(d*2.8),t.add(p)}let o=new Ue;o.setAttribute("position",new ge(n,3)),o.setAttribute("uv",new ge(s,2)),o.setAttribute("origin",new ge(a,3));let l=new st({transparent:!0,depthWrite:!1,side:gt,blending:kt,uniforms:{power:{value:0},time:{value:0}},vertexShader:"attribute vec3 origin;varying vec2 vUv;uniform float power;uniform float time;void main(){vUv=uv;vec3 p=position;p.x*=power;p.yz*=.65+power*.35;p.y+=sin(time*2.0+uv.x*8.0)*.012*uv.x;gl_Position=projectionMatrix*modelViewMatrix*vec4(p+origin,1.0);}",fragmentShader:"varying vec2 vUv;uniform float power;uniform float time;void main(){float fall=pow(1.0-vUv.x,2.0);float core=exp(-pow((vUv.y-.5)*6.0,2.0));float diamonds=.86+.14*cos(vUv.x*40.0-time*3.0);float a=core*fall*diamonds*min(1.0,power)*.65;vec3 c=mix(vec3(.2,.52,.85),vec3(.82,.94,1.0),core*(1.0-vUv.x));gl_FragColor=vec4(c,a);}"});return t.add(new re(o,l)),t.userData.plume=l,t}createFX(){let e=new Float32Array(1620),t=new Float32Array(540);this.particles=new Ue,this.particles.setAttribute("position",new ke(e,3)),this.particles.setAttribute("opacity",new ke(t,1)),this.sparkMat=new st({transparent:!0,depthWrite:!1,blending:kt,uniforms:{size:{value:.18},resolution:{value:innerHeight},colour:{value:new me(12315391)}},vertexShader:"attribute float opacity; varying float vAlpha; uniform float size; uniform float resolution; void main(){vAlpha=opacity;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*resolution/-mv.z,1.0,8.0);}",fragmentShader:"varying float vAlpha; uniform vec3 colour; void main(){float a=max(0.0,1.0-length(gl_PointCoord-.5)*2.0);gl_FragColor=vec4(colour,a*a*vAlpha);}"}),this.sparkPoints=new $i(this.particles,this.sparkMat),this.scene.add(this.sparkPoints),this.burst=new Ee,this.scene.add(this.burst),this.flash=new Wt(new Gt({map:this.glowMap,color:16759927,transparent:!0,blending:kt,depthWrite:!1,toneMapped:!1})),this.burst.add(this.flash),this.ring=new re(new Rt(1,.018,8,96),new je({color:9362687,transparent:!0,blending:kt,depthWrite:!1,toneMapped:!1})),this.burst.add(this.ring);let i=new st({transparent:!0,depthWrite:!1,blending:kt,uniforms:{age:{value:0},time:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:`varying vec2 vUv;uniform float age;uniform float time;
 float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){return noise(p)*.55+noise(p*2.07)*.28+noise(p*4.13)*.17;}
 void main(){vec2 q=vUv*2.0-1.0;float r=length(q);if(r>1.0)discard;float z=sqrt(max(0.0,1.0-dot(q,q)));float n=fbm(vec3(q*3.1,z*2.0-time*.42));float edge=1.0-smoothstep(.40+n*.34,.77+n*.2,r);float pockets=fbm(vec3(q*6.0+time*.2,z*4.0));float heat=clamp(n*1.1+pockets*.4-age*.7,0.0,1.0);vec3 ember=mix(vec3(.13,.052,.025),vec3(.9,.24,.035),heat);vec3 c=mix(ember,vec3(1.0,.85,.5),smoothstep(.63,.94,heat));float light=.45+.55*max(0.0,dot(normalize(vec3(q,z)),normalize(vec3(-.4,.7,1.0))));c=mix(c,vec3(.13,.15,.17)*light,smoothstep(.28,.95,age)*(1.0-heat*.7));float a=edge*(1.0-smoothstep(.6,1.0,age))*.92;gl_FragColor=vec4(c,a);}`});this.fireball=new re(new Fi(2,2),i),this.burst.add(this.fireball),this.shield=new re(new at(1,64,32),new st({transparent:!0,side:yn,depthWrite:!1,blending:kt,uniforms:{strength:{value:0},time:{value:0}},vertexShader:"varying vec3 vNormal; varying vec3 vPosition;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p;}",fragmentShader:"varying vec3 vNormal;varying vec3 vPosition;uniform float strength;uniform float time;void main(){float f=pow(1.0-max(0.0,dot(normalize(vNormal),normalize(-vPosition))),3.5);float scan=.85+.15*sin(vPosition.y*1.8+time*1.2);gl_FragColor=vec4(.16,.58,1.0,clamp(f*strength*scan,0.0,.28));}"})),this.shield.scale.set(23,8,13),this.hero.add(this.shield)}setEngines(e,t,i){e.visible=t>.001,e.userData.plume.uniforms.power.value=t,e.userData.plume.uniforms.time.value=i;for(let n of e.children)n.isSprite&&(n.material.opacity=Xs(t)*.65)}render(e,t,i=18,n=1){if(!this.ready||this.contextLost)return;if(e===6){if(this.gunfire.hide(),!this.raidHidden){this.raidHidden=new Map;for(let u of this.scene.children)u!==this.raid.root&&!u.isLight&&(this.raidHidden.set(u,u.visible),u.visible=!1)}this.weldLight.intensity=0,this.battleLight.intensity=0,this.raid.update(t,this.camera);let p=Dt((t-6)/6)*(1-Dt((t-18)/6));this.camera.position.set(76-p*4,70-p*3,170-p*6),this.camera.lookAt(0,-16,0),(t-this.lastShadow>.1||t<this.lastShadow||this.lastStage!==6)&&(this.renderer.shadowMap.needsUpdate=!0,this.lastShadow=t),this.lastStage=6,this.active=!0,this.clock=t,this.renderer.render(this.scene,this.camera);return}if(this.raidHidden){for(let[p,u]of this.raidHidden)p.visible=u;this.raidHidden=null}this.raid.root.visible=!1,this.active=!0,this.clock=t,this.hero.visible=!0;let s=e===1&&t<11;this.shipRoot.visible=s,this.assembled.visible=!s,this.hullDetails.assembled.visible=!s,this.hero.position.set(0,0,0),this.battleEnemies.forEach(p=>p.visible=!1),this.hero.rotation.set(0,0,0),this.hero.scale.setScalar(1),this.dock.visible=e===1||e===2,this.dock.position.set(0,0,0),this.ghost.visible=!1;let a=Dt((t-3)/9),o=.1;if(s)for(let p of this.parts){let u=1.1+p.order*6,m=Dt((t-u)/2.9),g=1-m;p.progress=m,p.mesh.position.copy(p.center),p.mesh.position.y+=g*(2.4+p.key%2*.6),p.mesh.position.z+=Math.sign(p.center.z||1)*g*.8,p.mesh.position.x+=g*.4,p.mesh.rotation.set(g*.02*Math.sin(p.key),g*.03*Math.cos(p.key),g*.02),p.mesh.visible=t>=u}this.faceoff.root.visible=!1,this.fleet.forEach(p=>{p.visible=!1,p.rotation.set(0,0,0)}),this.weldLight.intensity=0,this.battleLight.intensity=0,this.shield.material.uniforms.strength.value=0,this.burst.visible=!1,this.ring.visible=e===5,this.gunfire.hide(),this.missiles.forEach(p=>p.visible=!1);let l=32,c=19,h=45,d=this.look.set(0,-1,0);if(e===1&&(l=qn(40,36,Dt(t/15)),c=qn(29,26,Dt(t/15)),h=qn(96,90,Dt((t-6)/9)),d.set(0,-4,0),this.dock.visible=!0,o=t<2?0:.07+Dt((t-10)/3)*.3,this.dock.position.y=-Dt((t-12)/3)*9,this.hero.position.y=Dt((t-11)/3)*1.8,this.weldLight.color.set(10147327),this.weldLight.intensity=Dt((t-1)/.5)*(1-Dt((t-9.5)/1))*24,this.weldLight.position.set(-15+Xs((t-1)/9)*30,3,4)),e===2){let p=Dt((t-1)/3.5),u=Xs((t-6)/9.7),m=u*u;this.hero.position.set(m*35,p*5+m*115,-m*38),this.hero.rotation.z=.04+Dt((t-3.5)/3.5)*.75,this.hero.rotation.y=-.08-m*.24,this.dock.position.y=-p*1.2,l=36,c=26,h=92,d.set(0,-4,0),o=.12+Dt((t-1.5)/3)*1.3+m*.9}if(e===3){this.dock.visible=!1;let p=this.faceoff.update(t,this.hero,this.fleet,n);[l,c,h]=p.camera,d.set(...p.look),o=p.thrust}if(e===4){this.dock.visible=!1,this.hero.position.set(-4+Math.sin(t*.28)*.9,Math.sin(t*.38)*.35,0),this.hero.rotation.set(Math.sin(t*.35)*.012,-.08+Math.sin(t*.23)*.025,Math.sin(t*.3)*.018);let p=Dt((t-3.2)/3.3)*(1-Dt((t-8.7)/3));l=qn(40,34,p),c=qn(32,27,p),h=qn(99,92,p),d.set(qn(0,5,p),0,-4),o=1;for(let u=0;u<3;u++){let m=this.fleet[u];m.visible=!0,m.scale.setScalar(.4),m.position.set(-13-u*5,6+u*3,(u%2?1:-1)*(10+u*2)),m.rotation.y=-.07,m.userData.update(t+u,.8)}this.battleEnemies.forEach((u,m)=>{u.visible=t<16.5+m*.3,u.userData.update(t,.85)}),this.hero.updateMatrixWorld(!0),this.battle(t)}e===5&&(this.dock.visible=!1,l=32,c=29,h=64,d.set(0,0,0),this.hero.rotation.y=-.12,this.hero.rotation.z=Math.sin(t*.45)*.012,o=.12,this.burst.visible=!1,this.ring.visible=!1),this.navLights&&this.navLights.update(t,e),this.setEngines(this.hero.userData.engines,o,t),this.hero.updateMatrixWorld(!0),this.dock.updateMatrixWorld(!0),this.shipyard.update(e,t,this.parts,this.hero),this.heroWeapons.update(e,t,this.hero,this.gunfire),this.repairs.update(e,t),this.enemy.userData.update(t,.65),this.updateSparks(e,t),this.camera.position.set(l,c,h),this.camera.lookAt(d),this.ordnance.update(e,t,this.camera),this.combat.update(e,t,this.camera),this.fireball.quaternion.copy(this.camera.quaternion),this.shield.visible=this.shield.material.uniforms.strength.value>.001,(e!==this.lastStage||t<this.lastShadow||t-this.lastShadow>=1/30)&&(this.renderer.shadowMap.needsUpdate=!0,this.lastShadow=t),this.lastStage=e,this.renderer.render(this.scene,this.camera)}updateSparks(e,t){let i=this.particles.attributes.position,n=this.particles.attributes.opacity,s=e===1&&t>1&&t<11;if(this.sparkPoints.visible=s,!!s){if(this.sparkMat.uniforms.resolution.value=this.renderer.domElement.height,this.sparkMat.uniforms.colour.value.set(e===4?16757612:16770749),e===1)for(let a=0;a<4;a++)this.arms[a].tip.getWorldPosition(this.armPositions[a]);for(let a=0;a<n.count;a++){let o=a*12.9898,l=(t*1.8+a*.037)%1,c=o%6.283,h=Math.sin(o*2.7),d=2+(Math.sin(o)*.5+.5)*8,p,u,m;if(e===1){let g=this.armPositions[a%4];p=g.x+Math.cos(c)*l*d*.35,u=g.y+h*l*d*.3-l*l*4,m=g.z+Math.sin(c)*l*d*.45}else{let g=e===4?Xs((t-11)/3):(t+a*.005)%3/3,f=(e===4?10:25)*g;p=(e===4?25:0)+Math.cos(c)*f,u=h*f*.6,m=(e===4?-12:0)+Math.sin(c)*f}i.setXYZ(a,p,u,m),n.setX(a,(1-l)**2*(e===1?.8:.65))}i.needsUpdate=!0,n.needsUpdate=!0}}battle(e){this.gunfire.update(e),this.shield.material.uniforms.strength.value=e>8.2&&e<9.2?Math.sin((e-8.2)*Math.PI)*.35:0,this.shield.material.uniforms.time.value=e}clear(){this.active=!1,this.quality==="auto"&&this.pendingScale!==this.renderScale&&(this.renderScale=this.pendingScale,this.resize()),this.samples.length=0,this.renderer.setClearColor(0,0),this.renderer.clear()}dispose(){this.clear();let e=new Set,t=new Set,i=new Set;this.scene.traverse(n=>{n.geometry&&e.add(n.geometry);for(let s of n.material?Array.isArray(n.material)?n.material:[n.material]:[]){t.add(s);for(let a of Object.values(s))a?.isTexture&&i.add(a)}}),e.forEach(n=>n.dispose()),t.forEach(n=>n.dispose()),i.forEach(n=>n.dispose()),this.envTarget.dispose(),this.renderer.dispose()}};window.VoyagerFleetScene=ph;})();
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
