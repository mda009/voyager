(()=>{function Vs(r,e,t="at"){let i=0,n=r.length;for(;i<n;){let s=i+n>>>1;r[s][t]<e?i=s+1:n=s}return i}function Gr(r,e,t="at"){let i=0,n=r.length;for(;i<n;){let s=i+n>>>1;r[s][t]<=e?i=s+1:n=s}return i}var Gs=class{constructor(e){this.rows=e.slice().sort((t,i)=>t.at-i.at)}visit(e,t,i,n){let s=Math.max(Gr(this.rows,e),Vs(this.rows,t-i)),a=Gr(this.rows,t);for(let o=s;o<a;o++)n(this.rows[o])}},ks=class{constructor(){this.buffers=new Map,this.generated=0}get(e,t){let i=e.sampleRate+":"+t;if(!this.buffers.has(i)){let n=e.createBuffer(1,Math.floor(e.sampleRate*t),e.sampleRate),s=n.getChannelData(0);for(let a=0;a<s.length;a++)s[a]=(Math.random()*2-1)*(1-a/s.length)**2;this.buffers.set(i,n),this.generated++}return this.buffers.get(i)}prepare(e){for(let t of[.09,.16,.22,.35,.75,1.4,2.5,2.7])this.get(e,t)}};var Ma="180";var Xh=0,kl=1,jh=2;var Vl=1,so=2,Li=3,pn=0,Vt=1,vt=2,mn=0,Ot=1,Hl=2,Wl=3,Xl=4,qh=5,Ar=100,Yh=101,Zh=102,Jh=103,Kh=104,$h=200,Qh=201,eu=202,tu=203,iu=204,nu=205,ru=206,su=207,au=208,ou=209,lu=210,cu=211,hu=212,uu=213,du=214,ao=0,oo=1,lo=2,As=3,co=4,ho=5,uo=6,po=7,pu=0,mu=1,fu=2,Ji=0,gu=1,vu=2,_u=3,mo=4,xu=5,yu=6,Mu=7;var jl=300,Cr=301,Ln=302,fo=303,go=304,Cs=306,hr=1e3,ur=1001,Sa=1002,Ai=1003,Su=1004;var Rs=1005;var Ci=1006,vo=1007;var Un=1008;var Ui=1009,ql=1010,Yl=1011,Rr=1012,_o=1013,Dn=1014,fi=1015,Pr=1016,xo=1017,yo=1018,Ir=1020,Zl=35902,Jl=35899,bu=1021,Tu=1022,gi=1023,Ps=1026,Is=1027,Mo=1028,So=1029,wu=1030,Kl=1031;var $l=1033,bo=33776,To=33777,wo=33778,Eo=33779,Ql=35840,ec=35841,tc=35842,ic=35843,nc=36196,rc=37492,sc=37496,ac=37808,oc=37809,lc=37810,cc=37811,hc=37812,uc=37813,dc=37814,pc=37815,mc=37816,fc=37817,gc=37818,vc=37819,_c=37820,xc=37821,yc=36492,Mc=36494,Sc=36495,bc=36283,Tc=36284,wc=36285,Ec=36286;var ts=2300,ba=2301,xa=2302,Pl=2400,Il=2401,Ll=2402;var Eu=3201;var Au=0,Cu=1,Nn="",Mt="srgb",An="srgb-linear",is="linear",nt="srgb";var En=7680;var Ru=512,Pu=513,Iu=514,Ac=515,Lu=516,Uu=517,Du=518,Nu=519,Ta=35044,Yt=35048;var Cc="300 es",ji=2e3,ns=2001;var qi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i!==void 0&&i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let n=i[e];if(n!==void 0){let s=n.indexOf(t);s!==-1&&n.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let n=i.slice(0);for(let s=0,a=n.length;s<a;s++)n[s].call(this,e);e.target=null}}},Nt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dh=1234567,lr=Math.PI/180,dr=180/Math.PI;function Ei(){let r=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,i=4294967295*Math.random()|0;return(Nt[255&r]+Nt[r>>8&255]+Nt[r>>16&255]+Nt[r>>24&255]+"-"+Nt[255&e]+Nt[e>>8&255]+"-"+Nt[e>>16&15|64]+Nt[e>>24&255]+"-"+Nt[63&t|128]+Nt[t>>8&255]+"-"+Nt[t>>16&255]+Nt[t>>24&255]+Nt[255&i]+Nt[i>>8&255]+Nt[i>>16&255]+Nt[i>>24&255]).toLowerCase()}function Ne(r,e,t){return Math.max(e,Math.min(t,r))}function Ul(r,e){return(r%e+e)%e}function $r(r,e,t){return(1-t)*r+t*e}function di(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function it(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(4294967295*r);case Uint16Array:return Math.round(65535*r);case Uint8Array:return Math.round(255*r);case Int32Array:return Math.round(2147483647*r);case Int16Array:return Math.round(32767*r);case Int8Array:return Math.round(127*r);default:throw new Error("Invalid component type.")}}var vi={DEG2RAD:lr,RAD2DEG:dr,generateUUID:Ei,clamp:Ne,euclideanModulo:Ul,mapLinear:function(r,e,t,i,n){return i+(r-e)*(n-i)/(t-e)},inverseLerp:function(r,e,t){return r!==e?(t-r)/(e-r):0},lerp:$r,damp:function(r,e,t,i){return $r(r,e,1-Math.exp(-t*i))},pingpong:function(r,e=1){return e-Math.abs(Ul(r,2*e)-e)},smoothstep:function(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e))*r*(3-2*r)},smootherstep:function(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e))*r*r*(r*(6*r-15)+10)},randInt:function(r,e){return r+Math.floor(Math.random()*(e-r+1))},randFloat:function(r,e){return r+Math.random()*(e-r)},randFloatSpread:function(r){return r*(.5-Math.random())},seededRandom:function(r){r!==void 0&&(dh=r);let e=dh+=1831565813;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296},degToRad:function(r){return r*lr},radToDeg:function(r){return r*dr},isPowerOfTwo:function(r){return!(r&r-1)&&r!==0},ceilPowerOfTwo:function(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))},floorPowerOfTwo:function(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))},setQuaternionFromProperEuler:function(r,e,t,i,n){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),h=a((e+i)/2),d=s((e-i)/2),p=a((e-i)/2),u=s((i-e)/2),m=a((i-e)/2);switch(n){case"XYX":r.set(o*h,l*d,l*p,o*c);break;case"YZY":r.set(l*p,o*h,l*d,o*c);break;case"ZXZ":r.set(l*d,l*p,o*h,o*c);break;case"XZX":r.set(o*h,l*m,l*u,o*c);break;case"YXY":r.set(l*u,o*h,l*m,o*c);break;case"ZYZ":r.set(l*m,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}},normalize:it,denormalize:di},J=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ne(this.x,e.x,t.x),this.y=Ne(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ne(this.x,e,t),this.y=Ne(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ne(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ne(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),n=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*n+e.x,this.y=s*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},et=class{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,s,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],d=i[n+3],p=s[a+0],u=s[a+1],m=s[a+2],g=s[a+3];if(o===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=d);if(o===1)return e[t+0]=p,e[t+1]=u,e[t+2]=m,void(e[t+3]=g);if(d!==g||l!==p||c!==u||h!==m){let f=1-o,v=l*p+c*u+h*m+d*g,_=v>=0?1:-1,x=1-v*v;if(x>Number.EPSILON){let E=Math.sqrt(x),b=Math.atan2(E,v*_);f=Math.sin(f*b)/E,o=Math.sin(o*b)/E}let y=o*_;if(l=l*f+p*y,c=c*f+u*y,h=h*f+m*y,d=d*f+g*y,f===1-o){let E=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=E,c*=E,h*=E,d*=E}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,n,s,a){let o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],d=s[a],p=s[a+1],u=s[a+2],m=s[a+3];return e[t]=o*m+h*d+l*u-c*p,e[t+1]=l*m+h*p+c*d-o*u,e[t+2]=c*m+h*u+o*p-l*d,e[t+3]=h*m-o*d-l*p-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,n=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),d=o(s/2),p=l(i/2),u=l(n/2),m=l(s/2);switch(a){case"XYZ":this._x=p*h*d+c*u*m,this._y=c*u*d-p*h*m,this._z=c*h*m+p*u*d,this._w=c*h*d-p*u*m;break;case"YXZ":this._x=p*h*d+c*u*m,this._y=c*u*d-p*h*m,this._z=c*h*m-p*u*d,this._w=c*h*d+p*u*m;break;case"ZXY":this._x=p*h*d-c*u*m,this._y=c*u*d+p*h*m,this._z=c*h*m+p*u*d,this._w=c*h*d-p*u*m;break;case"ZYX":this._x=p*h*d-c*u*m,this._y=c*u*d+p*h*m,this._z=c*h*m-p*u*d,this._w=c*h*d+p*u*m;break;case"YZX":this._x=p*h*d+c*u*m,this._y=c*u*d+p*h*m,this._z=c*h*m-p*u*d,this._w=c*h*d-p*u*m;break;case"XZY":this._x=p*h*d-c*u*m,this._y=c*u*d-p*h*m,this._z=c*h*m+p*u*d,this._w=c*h*d+p*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],n=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],p=i+o+d;if(p>0){let u=.5/Math.sqrt(p+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(a-n)*u}else if(i>o&&i>d){let u=2*Math.sqrt(1+i-o-d);this._w=(h-l)/u,this._x=.25*u,this._y=(n+a)/u,this._z=(s+c)/u}else if(o>d){let u=2*Math.sqrt(1+o-i-d);this._w=(s-c)/u,this._x=(n+a)/u,this._y=.25*u,this._z=(l+h)/u}else{let u=2*Math.sqrt(1+d-i-o);this._w=(a-n)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ne(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,n=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+n*c-s*l,this._y=n*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,n=this._y,s=this._z,a=this._w,o=a*e._w+i*e._x+n*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let u=1-t;return this._w=u*a+t*this._w,this._x=u*i+t*this._x,this._y=u*n+t*this._y,this._z=u*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,p=Math.sin(t*h)/c;return this._w=a*d+this._w*p,this._x=i*d+this._x*p,this._y=n*d+this._y*p,this._z=s*d+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},S=class r{constructor(e=0,t=0,i=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ph.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ph.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*n,this.y=s[1]*t+s[4]*i+s[7]*n,this.z=s[2]*t+s[5]*i+s[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,n=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*n-o*i),h=2*(o*t-s*n),d=2*(s*i-a*t);return this.x=t+l*c+a*d-o*h,this.y=i+l*h+o*c-s*d,this.z=n+l*d+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*n,this.y=s[1]*t+s[5]*i+s[9]*n,this.z=s[2]*t+s[6]*i+s[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ne(this.x,e.x,t.x),this.y=Ne(this.y,e.y,t.y),this.z=Ne(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ne(this.x,e,t),this.y=Ne(this.y,e,t),this.z=Ne(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ne(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,n=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return tl.copy(this).projectOnVector(e),this.sub(tl)}reflect(e){return this.sub(tl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ne(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=2*Math.random()-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},tl=new S,ph=new et,Le=class r{constructor(e,t,i,n,s,a,o,l,c){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c)}set(e,t,i,n,s,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],p=i[2],u=i[5],m=i[8],g=n[0],f=n[3],v=n[6],_=n[1],x=n[4],y=n[7],E=n[2],b=n[5],R=n[8];return s[0]=a*g+o*_+l*E,s[3]=a*f+o*x+l*b,s[6]=a*v+o*y+l*R,s[1]=c*g+h*_+d*E,s[4]=c*f+h*x+d*b,s[7]=c*v+h*y+d*R,s[2]=p*g+u*_+m*E,s[5]=p*f+u*x+m*b,s[8]=p*v+u*y+m*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*s*h+i*o*l+n*s*c-n*a*l}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,p=o*l-h*s,u=c*s-a*l,m=t*d+i*p+n*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/m;return e[0]=d*g,e[1]=(n*c-h*i)*g,e[2]=(o*i-n*a)*g,e[3]=p*g,e[4]=(h*t-n*l)*g,e[5]=(n*s-o*t)*g,e[6]=u*g,e[7]=(i*l-c*t)*g,e[8]=(a*t-i*s)*g,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-n*c,n*l,-n*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(il.makeScale(e,t)),this}rotate(e){return this.premultiply(il.makeRotation(-e)),this}translate(e,t){return this.premultiply(il.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},il=new Le;function Rc(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function pr(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Fu(){let r=pr("canvas");return r.style.display="block",r}var mh={};function mr(r){r in mh||(mh[r]=!0,console.warn(r))}function Bu(r,e,t){return new Promise(function(i,n){setTimeout(function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:n();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}},t)})}var fh=new Le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),gh=new Le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Vd(){let r={enabled:!0,workingColorSpace:An,spaces:{},convert:function(n,s,a){return this.enabled!==!1&&s!==a&&s&&a&&(this.spaces[s].transfer===nt&&(n.r=Xi(n.r),n.g=Xi(n.g),n.b=Xi(n.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[s].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===nt&&(n.r=cr(n.r),n.g=cr(n.g),n.b=cr(n.b))),n},workingToColorSpace:function(n,s){return this.convert(n,this.workingColorSpace,s)},colorSpaceToWorking:function(n,s){return this.convert(n,s,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===""?is:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,s=this.workingColorSpace){return n.fromArray(this.spaces[s].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,s,a){return n.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,s){return mr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(n,s)},toWorkingColorSpace:function(n,s){return mr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(n,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return r.define({[An]:{primaries:e,whitePoint:i,transfer:is,toXYZ:fh,fromXYZ:gh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Mt},outputColorSpaceConfig:{drawingBufferColorSpace:Mt}},[Mt]:{primaries:e,whitePoint:i,transfer:nt,toXYZ:fh,fromXYZ:gh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Mt}}}),r}var Ze=Vd();function Xi(r){return r<.04045?.0773993808*r:Math.pow(.9478672986*r+.0521327014,2.4)}function cr(r){return r<.0031308?12.92*r:1.055*Math.pow(r,.41666)-.055}var Xn,wa=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Xn===void 0&&(Xn=pr("canvas")),Xn.width=e.width,Xn.height=e.height;let n=Xn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),i=Xn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=pr("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let n=i.getImageData(0,0,e.width,e.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=255*Xi(s[a]/255);return i.putImageData(n,0,0),t}if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(255*Xi(t[i]/255)):t[i]=Xi(t[i]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Hd=0,fr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Hd++}),this.uuid=Ei(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(nl(n[a].image)):s.push(nl(n[a]))}else s=nl(n);i.url=s}return t||(e.images[this.uuid]=i),i}};function nl(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?wa.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Wd=0,rl=new S,Bt=class r extends qi{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,i=1001,n=1001,s=1006,a=1008,o=1023,l=1009,c=r.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Ei(),this.name="",this.source=new fr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new J(0,0),this.repeat=new J(1,1),this.center=new J(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(rl).x}get height(){return this.source.getSize(rl).y}get depth(){return this.source.getSize(rl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let n=this[t];n!==void 0?n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[t]=i:console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`)}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==jl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case hr:e.x=e.x-Math.floor(e.x);break;case ur:e.x=e.x<0?0:1;break;case Sa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case hr:e.y=e.y-Math.floor(e.y);break;case ur:e.y=e.y<0?0:1;break;case Sa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Bt.DEFAULT_IMAGE=null,Bt.DEFAULT_MAPPING=jl,Bt.DEFAULT_ANISOTROPY=1;var Je=class r{constructor(e=0,t=0,i=0,n=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,s,l=e.elements,c=l[0],h=l[4],d=l[8],p=l[1],u=l[5],m=l[9],g=l[2],f=l[6],v=l[10];if(Math.abs(h-p)<.01&&Math.abs(d-g)<.01&&Math.abs(m-f)<.01){if(Math.abs(h+p)<.1&&Math.abs(d+g)<.1&&Math.abs(m+f)<.1&&Math.abs(c+u+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,y=(u+1)/2,E=(v+1)/2,b=(h+p)/4,R=(d+g)/4,I=(m+f)/4;return x>y&&x>E?x<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(x),n=b/i,s=R/i):y>E?y<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(y),i=b/n,s=I/n):E<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(E),i=R/s,n=I/s),this.set(i,n,s,t),this}let _=Math.sqrt((f-m)*(f-m)+(d-g)*(d-g)+(p-h)*(p-h));return Math.abs(_)<.001&&(_=1),this.x=(f-m)/_,this.y=(d-g)/_,this.z=(p-h)/_,this.w=Math.acos((c+u+v-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ne(this.x,e.x,t.x),this.y=Ne(this.y,e.y,t.y),this.z=Ne(this.z,e.z,t.z),this.w=Ne(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ne(this.x,e,t),this.y=Ne(this.y,e,t),this.z=Ne(this.z,e,t),this.w=Ne(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ne(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ea=class extends qi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ci,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Je(0,0,e,t),this.scissorTest=!1,this.viewport=new Je(0,0,e,t);let n={width:e,height:t,depth:i.depth},s=new Bt(n);this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:Ci,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i,this.textures[n].isArrayTexture=this.textures[n].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new fr(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ri=class extends Ea{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},rs=class extends Bt{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Ai,this.minFilter=Ai,this.wrapR=ur,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Aa=class extends Bt{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Ai,this.minFilter=Ai,this.wrapR=ur,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var jt=class{constructor(e=new S(1/0,1/0,1/0),t=new S(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ci.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ci.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=ci.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ci):ci.fromBufferAttribute(s,a),ci.applyMatrix4(e.matrixWorld),this.expandByPoint(ci);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Hs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Hs.copy(i.boundingBox)),Hs.applyMatrix4(e.matrixWorld),this.union(Hs)}let n=e.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ci),ci.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(kr),Ws.subVectors(this.max,kr),jn.subVectors(e.a,kr),qn.subVectors(e.b,kr),Yn.subVectors(e.c,kr),en.subVectors(qn,jn),tn.subVectors(Yn,qn),Sn.subVectors(jn,Yn);let t=[0,-en.z,en.y,0,-tn.z,tn.y,0,-Sn.z,Sn.y,en.z,0,-en.x,tn.z,0,-tn.x,Sn.z,0,-Sn.x,-en.y,en.x,0,-tn.y,tn.x,0,-Sn.y,Sn.x,0];return!!sl(t,jn,qn,Yn,Ws)&&(t=[1,0,0,0,1,0,0,0,1],!!sl(t,jn,qn,Yn,Ws)&&(Xs.crossVectors(en,tn),t=[Xs.x,Xs.y,Xs.z],sl(t,jn,qn,Yn,Ws)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ci).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(ci).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Gi)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Gi=[new S,new S,new S,new S,new S,new S,new S,new S],ci=new S,Hs=new jt,jn=new S,qn=new S,Yn=new S,en=new S,tn=new S,Sn=new S,kr=new S,Ws=new S,Xs=new S,bn=new S;function sl(r,e,t,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){bn.fromArray(r,s);let o=n.x*Math.abs(bn.x)+n.y*Math.abs(bn.y)+n.z*Math.abs(bn.z),l=e.dot(bn),c=t.dot(bn),h=i.dot(bn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Xd=new jt,Vr=new S,al=new S,ti=class{constructor(e=new S,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Xd.setFromPoints(e).getCenter(i);let n=0;for(let s=0,a=e.length;s<a;s++)n=Math.max(n,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Vr.subVectors(e,this.center);let t=Vr.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),n=.5*(i-this.radius);this.center.addScaledVector(Vr,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(al.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Vr.copy(e.center).add(al)),this.expandByPoint(Vr.copy(e.center).sub(al))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ki=new S,ol=new S,js=new S,nn=new S,ll=new S,qs=new S,cl=new S,Cn=class{constructor(e=new S,t=new S(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ki)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ki.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ki.copy(this.origin).addScaledVector(this.direction,t),ki.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){ol.copy(e).add(t).multiplyScalar(.5),js.copy(t).sub(e).normalize(),nn.copy(this.origin).sub(ol);let s=.5*e.distanceTo(t),a=-this.direction.dot(js),o=nn.dot(this.direction),l=-nn.dot(js),c=nn.lengthSq(),h=Math.abs(1-a*a),d,p,u,m;if(h>0)if(d=a*l-o,p=a*o-l,m=s*h,d>=0)if(p>=-m)if(p<=m){let g=1/h;d*=g,p*=g,u=d*(d+a*p+2*o)+p*(a*d+p+2*l)+c}else p=s,d=Math.max(0,-(a*p+o)),u=-d*d+p*(p+2*l)+c;else p=-s,d=Math.max(0,-(a*p+o)),u=-d*d+p*(p+2*l)+c;else p<=-m?(d=Math.max(0,-(-a*s+o)),p=d>0?-s:Math.min(Math.max(-s,-l),s),u=-d*d+p*(p+2*l)+c):p<=m?(d=0,p=Math.min(Math.max(-s,-l),s),u=p*(p+2*l)+c):(d=Math.max(0,-(a*s+o)),p=d>0?s:Math.min(Math.max(-s,-l),s),u=-d*d+p*(p+2*l)+c);else p=a>0?-s:s,d=Math.max(0,-(a*p+o)),u=-d*d+p*(p+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),n&&n.copy(ol).addScaledVector(js,p),u}intersectSphere(e,t){ki.subVectors(e.center,this.origin);let i=ki.dot(this.direction),n=ki.dot(ki)-i*i,s=e.radius*e.radius;if(n>s)return null;let a=Math.sqrt(s-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return!(e.radius<0)&&this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,p=this.origin;return c>=0?(i=(e.min.x-p.x)*c,n=(e.max.x-p.x)*c):(i=(e.max.x-p.x)*c,n=(e.min.x-p.x)*c),h>=0?(s=(e.min.y-p.y)*h,a=(e.max.y-p.y)*h):(s=(e.max.y-p.y)*h,a=(e.min.y-p.y)*h),i>a||s>n?null:((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),d>=0?(o=(e.min.z-p.z)*d,l=(e.max.z-p.z)*d):(o=(e.max.z-p.z)*d,l=(e.min.z-p.z)*d),i>l||o>n?null:((o>i||i!=i)&&(i=o),(l<n||n!=n)&&(n=l),n<0?null:this.at(i>=0?i:n,t)))}intersectsBox(e){return this.intersectBox(e,ki)!==null}intersectTriangle(e,t,i,n,s){ll.subVectors(t,e),qs.subVectors(i,e),cl.crossVectors(ll,qs);let a,o=this.direction.dot(cl);if(o>0){if(n)return null;a=1}else{if(!(o<0))return null;a=-1,o=-o}nn.subVectors(this.origin,e);let l=a*this.direction.dot(qs.crossVectors(nn,qs));if(l<0)return null;let c=a*this.direction.dot(ll.cross(nn));if(c<0||l+c>o)return null;let h=-a*nn.dot(cl);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ge=class r{constructor(e,t,i,n,s,a,o,l,c,h,d,p,u,m,g,f){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c,h,d,p,u,m,g,f)}set(e,t,i,n,s,a,o,l,c,h,d,p,u,m,g,f){let v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=n,v[1]=s,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=h,v[10]=d,v[14]=p,v[3]=u,v[7]=m,v[11]=g,v[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,n=1/Zn.setFromMatrixColumn(e,0).length(),s=1/Zn.setFromMatrixColumn(e,1).length(),a=1/Zn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,n=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let p=a*h,u=a*d,m=o*h,g=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=u+m*c,t[5]=p-g*c,t[9]=-o*l,t[2]=g-p*c,t[6]=m+u*c,t[10]=a*l}else if(e.order==="YXZ"){let p=l*h,u=l*d,m=c*h,g=c*d;t[0]=p+g*o,t[4]=m*o-u,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=u*o-m,t[6]=g+p*o,t[10]=a*l}else if(e.order==="ZXY"){let p=l*h,u=l*d,m=c*h,g=c*d;t[0]=p-g*o,t[4]=-a*d,t[8]=m+u*o,t[1]=u+m*o,t[5]=a*h,t[9]=g-p*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let p=a*h,u=a*d,m=o*h,g=o*d;t[0]=l*h,t[4]=m*c-u,t[8]=p*c+g,t[1]=l*d,t[5]=g*c+p,t[9]=u*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let p=a*l,u=a*c,m=o*l,g=o*c;t[0]=l*h,t[4]=g-p*d,t[8]=m*d+u,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=u*d+m,t[10]=p-g*d}else if(e.order==="XZY"){let p=a*l,u=a*c,m=o*l,g=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=p*d+g,t[5]=a*h,t[9]=u*d-m,t[2]=m*d-u,t[6]=o*h,t[10]=g*d+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(jd,e,qd)}lookAt(e,t,i){let n=this.elements;return Zt.subVectors(e,t),Zt.lengthSq()===0&&(Zt.z=1),Zt.normalize(),rn.crossVectors(i,Zt),rn.lengthSq()===0&&(Math.abs(i.z)===1?Zt.x+=1e-4:Zt.z+=1e-4,Zt.normalize(),rn.crossVectors(i,Zt)),rn.normalize(),Ys.crossVectors(Zt,rn),n[0]=rn.x,n[4]=Ys.x,n[8]=Zt.x,n[1]=rn.y,n[5]=Ys.y,n[9]=Zt.y,n[2]=rn.z,n[6]=Ys.z,n[10]=Zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],p=i[9],u=i[13],m=i[2],g=i[6],f=i[10],v=i[14],_=i[3],x=i[7],y=i[11],E=i[15],b=n[0],R=n[4],I=n[8],L=n[12],G=n[1],H=n[5],O=n[9],N=n[13],U=n[2],k=n[6],j=n[10],K=n[14],$=n[3],ue=n[7],Me=n[11],_e=n[15];return s[0]=a*b+o*G+l*U+c*$,s[4]=a*R+o*H+l*k+c*ue,s[8]=a*I+o*O+l*j+c*Me,s[12]=a*L+o*N+l*K+c*_e,s[1]=h*b+d*G+p*U+u*$,s[5]=h*R+d*H+p*k+u*ue,s[9]=h*I+d*O+p*j+u*Me,s[13]=h*L+d*N+p*K+u*_e,s[2]=m*b+g*G+f*U+v*$,s[6]=m*R+g*H+f*k+v*ue,s[10]=m*I+g*O+f*j+v*Me,s[14]=m*L+g*N+f*K+v*_e,s[3]=_*b+x*G+y*U+E*$,s[7]=_*R+x*H+y*k+E*ue,s[11]=_*I+x*O+y*j+E*Me,s[15]=_*L+x*N+y*K+E*_e,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],n=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],p=e[10],u=e[14];return e[3]*(+s*l*d-n*c*d-s*o*p+i*c*p+n*o*u-i*l*u)+e[7]*(+t*l*u-t*c*p+s*a*p-n*a*u+n*c*h-s*l*h)+e[11]*(+t*c*d-t*o*u-s*a*d+i*a*u+s*o*h-i*c*h)+e[15]*(-n*o*h-t*l*d+t*o*p+n*a*d-i*a*p+i*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],p=e[10],u=e[11],m=e[12],g=e[13],f=e[14],v=e[15],_=d*f*c-g*p*c+g*l*u-o*f*u-d*l*v+o*p*v,x=m*p*c-h*f*c-m*l*u+a*f*u+h*l*v-a*p*v,y=h*g*c-m*d*c+m*o*u-a*g*u-h*o*v+a*d*v,E=m*d*l-h*g*l-m*o*p+a*g*p+h*o*f-a*d*f,b=t*_+i*x+n*y+s*E;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/b;return e[0]=_*R,e[1]=(g*p*s-d*f*s-g*n*u+i*f*u+d*n*v-i*p*v)*R,e[2]=(o*f*s-g*l*s+g*n*c-i*f*c-o*n*v+i*l*v)*R,e[3]=(d*l*s-o*p*s-d*n*c+i*p*c+o*n*u-i*l*u)*R,e[4]=x*R,e[5]=(h*f*s-m*p*s+m*n*u-t*f*u-h*n*v+t*p*v)*R,e[6]=(m*l*s-a*f*s-m*n*c+t*f*c+a*n*v-t*l*v)*R,e[7]=(a*p*s-h*l*s+h*n*c-t*p*c-a*n*u+t*l*u)*R,e[8]=y*R,e[9]=(m*d*s-h*g*s-m*i*u+t*g*u+h*i*v-t*d*v)*R,e[10]=(a*g*s-m*o*s+m*i*c-t*g*c-a*i*v+t*o*v)*R,e[11]=(h*o*s-a*d*s-h*i*c+t*d*c+a*i*u-t*o*u)*R,e[12]=E*R,e[13]=(h*g*n-m*d*n+m*i*p-t*g*p-h*i*f+t*d*f)*R,e[14]=(m*o*n-a*g*n-m*i*l+t*g*l+a*i*f-t*o*f)*R,e[15]=(a*d*n-h*o*n+h*i*l-t*d*l-a*i*p+t*o*p)*R,this}scale(e){let t=this.elements,i=e.x,n=e.y,s=e.z;return t[0]*=i,t[4]*=n,t[8]*=s,t[1]*=i,t[5]*=n,t[9]*=s,t[2]*=i,t[6]*=n,t[10]*=s,t[3]*=i,t[7]*=n,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),n=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,s,a){return this.set(1,i,s,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){let n=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,d=o+o,p=s*c,u=s*h,m=s*d,g=a*h,f=a*d,v=o*d,_=l*c,x=l*h,y=l*d,E=i.x,b=i.y,R=i.z;return n[0]=(1-(g+v))*E,n[1]=(u+y)*E,n[2]=(m-x)*E,n[3]=0,n[4]=(u-y)*b,n[5]=(1-(p+v))*b,n[6]=(f+_)*b,n[7]=0,n[8]=(m+x)*R,n[9]=(f-_)*R,n[10]=(1-(p+g))*R,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){let n=this.elements,s=Zn.set(n[0],n[1],n[2]).length(),a=Zn.set(n[4],n[5],n[6]).length(),o=Zn.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),e.x=n[12],e.y=n[13],e.z=n[14],hi.copy(this);let l=1/s,c=1/a,h=1/o;return hi.elements[0]*=l,hi.elements[1]*=l,hi.elements[2]*=l,hi.elements[4]*=c,hi.elements[5]*=c,hi.elements[6]*=c,hi.elements[8]*=h,hi.elements[9]*=h,hi.elements[10]*=h,t.setFromRotationMatrix(hi),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,n,s,a,o=2e3,l=!1){let c=this.elements,h=2*s/(t-e),d=2*s/(i-n),p=(t+e)/(t-e),u=(i+n)/(i-n),m,g;if(l)m=s/(a-s),g=a*s/(a-s);else if(o===ji)m=-(a+s)/(a-s),g=-2*a*s/(a-s);else{if(o!==ns)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);m=-a/(a-s),g=-a*s/(a-s)}return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=d,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,n,s,a,o=2e3,l=!1){let c=this.elements,h=2/(t-e),d=2/(i-n),p=-(t+e)/(t-e),u=-(i+n)/(i-n),m,g;if(l)m=1/(a-s),g=a/(a-s);else if(o===ji)m=-2/(a-s),g=-(a+s)/(a-s);else{if(o!==ns)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);m=-1/(a-s),g=-s/(a-s)}return c[0]=h,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=d,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Zn=new S,hi=new ge,jd=new S(0,0,0),qd=new S(1,1,1),rn=new S,Ys=new S,Zt=new S,vh=new ge,_h=new et,ze=class r{constructor(e=0,t=0,i=0,n=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let n=e.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],d=n[2],p=n[6],u=n[10];switch(t){case"XYZ":this._y=Math.asin(Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ne(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(p,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return vh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(vh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return _h.setFromEuler(this),this.setFromQuaternion(_h,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ze.DEFAULT_ORDER="XYZ";var ss=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Yd=0,xh=new S,Jn=new et,Vi=new ge,Zs=new S,Hr=new S,Zd=new S,Jd=new et,yh=new S(1,0,0),Mh=new S(0,1,0),Sh=new S(0,0,1),bh={type:"added"},Kd={type:"removed"},Kn={type:"childadded",child:null},hl={type:"childremoved",child:null},gt=class r extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yd++}),this.uuid=Ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new S,t=new ze,i=new et,n=new S(1,1,1);t._onChange(function(){i.setFromEuler(t,!1)}),i._onChange(function(){t.setFromQuaternion(i,void 0,!1)}),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new ge},normalMatrix:{value:new Le}}),this.matrix=new ge,this.matrixWorld=new ge,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ss,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Jn.setFromAxisAngle(e,t),this.quaternion.multiply(Jn),this}rotateOnWorldAxis(e,t){return Jn.setFromAxisAngle(e,t),this.quaternion.premultiply(Jn),this}rotateX(e){return this.rotateOnAxis(yh,e)}rotateY(e){return this.rotateOnAxis(Mh,e)}rotateZ(e){return this.rotateOnAxis(Sh,e)}translateOnAxis(e,t){return xh.copy(e).applyQuaternion(this.quaternion),this.position.add(xh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(yh,e)}translateY(e){return this.translateOnAxis(Mh,e)}translateZ(e){return this.translateOnAxis(Sh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Vi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Zs.copy(e):Zs.set(e,t,i);let n=this.parent;this.updateWorldMatrix(!0,!1),Hr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Vi.lookAt(Hr,Zs,this.up):Vi.lookAt(Zs,Hr,this.up),this.quaternion.setFromRotationMatrix(Vi),n&&(Vi.extractRotation(n.matrixWorld),Jn.setFromRotationMatrix(Vi),this.quaternion.premultiply(Jn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(bh),Kn.child=e,this.dispatchEvent(Kn),Kn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Kd),hl.child=e,this.dispatchEvent(hl),hl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Vi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Vi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Vi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(bh),Kn.child=e,this.dispatchEvent(Kn),Kn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){let s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,e,Zd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,Jd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let n={};function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON())),this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));n.material=o}else n.material=s(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];n.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),p=a(e.skeletons),u=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),p.length>0&&(i.skeletons=p),u.length>0&&(i.animations=u),m.length>0&&(i.nodes=m)}return i.object=n,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let n=e.children[i];this.add(n.clone())}return this}};gt.DEFAULT_UP=new S(0,1,0),gt.DEFAULT_MATRIX_AUTO_UPDATE=!0,gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ui=new S,Hi=new S,ul=new S,Wi=new S,$n=new S,Qn=new S,Th=new S,dl=new S,pl=new S,ml=new S,fl=new Je,gl=new Je,vl=new Je,Ti=class r{constructor(e=new S,t=new S,i=new S){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),ui.subVectors(e,t),n.cross(ui);let s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(e,t,i,n,s){ui.subVectors(n,t),Hi.subVectors(i,t),ul.subVectors(e,t);let a=ui.dot(ui),o=ui.dot(Hi),l=ui.dot(ul),c=Hi.dot(Hi),h=Hi.dot(ul),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;let p=1/d,u=(c*l-o*h)*p,m=(a*h-o*l)*p;return s.set(1-u-m,m,u)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,Wi)!==null&&Wi.x>=0&&Wi.y>=0&&Wi.x+Wi.y<=1}static getInterpolation(e,t,i,n,s,a,o,l){return this.getBarycoord(e,t,i,n,Wi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Wi.x),l.addScaledVector(a,Wi.y),l.addScaledVector(o,Wi.z),l)}static getInterpolatedAttribute(e,t,i,n,s,a){return fl.setScalar(0),gl.setScalar(0),vl.setScalar(0),fl.fromBufferAttribute(e,t),gl.fromBufferAttribute(e,i),vl.fromBufferAttribute(e,n),a.setScalar(0),a.addScaledVector(fl,s.x),a.addScaledVector(gl,s.y),a.addScaledVector(vl,s.z),a}static isFrontFacing(e,t,i,n){return ui.subVectors(i,t),Hi.subVectors(e,t),ui.cross(Hi).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ui.subVectors(this.c,this.b),Hi.subVectors(this.a,this.b),.5*ui.cross(Hi).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,s){return r.getInterpolation(e,this.a,this.b,this.c,t,i,n,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,n=this.b,s=this.c,a,o;$n.subVectors(n,i),Qn.subVectors(s,i),dl.subVectors(e,i);let l=$n.dot(dl),c=Qn.dot(dl);if(l<=0&&c<=0)return t.copy(i);pl.subVectors(e,n);let h=$n.dot(pl),d=Qn.dot(pl);if(h>=0&&d<=h)return t.copy(n);let p=l*d-h*c;if(p<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector($n,a);ml.subVectors(e,s);let u=$n.dot(ml),m=Qn.dot(ml);if(m>=0&&u<=m)return t.copy(s);let g=u*c-l*m;if(g<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(Qn,o);let f=h*m-u*d;if(f<=0&&d-h>=0&&u-m>=0)return Th.subVectors(s,n),o=(d-h)/(d-h+(u-m)),t.copy(n).addScaledVector(Th,o);let v=1/(f+g+p);return a=g*v,o=p*v,t.copy(i).addScaledVector($n,a).addScaledVector(Qn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ou={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},sn={h:0,s:0,l:0},Js={h:0,s:0,l:0};function _l(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+6*(e-r)*t:t<.5?e:t<2/3?r+6*(e-r)*(2/3-t):r}var ve=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,i,n=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ze.colorSpaceToWorking(this,n),this}setHSL(e,t,i,n=Ze.workingColorSpace){if(e=Ul(e,1),t=Ne(t,0,1),i=Ne(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=_l(a,s,e+1/3),this.g=_l(a,s,e),this.b=_l(a,s,e-1/3)}return Ze.colorSpaceToWorking(this,n),this}setStyle(e,t=Mt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mt){let i=Ou[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xi(e.r),this.g=Xi(e.g),this.b=Xi(e.b),this}copyLinearToSRGB(e){return this.r=cr(e.r),this.g=cr(e.g),this.b=cr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mt){return Ze.workingToColorSpace(Ft.copy(this),e),65536*Math.round(Ne(255*Ft.r,0,255))+256*Math.round(Ne(255*Ft.g,0,255))+Math.round(Ne(255*Ft.b,0,255))}getHexString(e=Mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(Ft.copy(this),t);let i=Ft.r,n=Ft.g,s=Ft.b,a=Math.max(i,n,s),o=Math.min(i,n,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case i:l=(n-s)/d+(n<s?6:0);break;case n:l=(s-i)/d+2;break;case s:l=(i-n)/d+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(Ft.copy(this),t),e.r=Ft.r,e.g=Ft.g,e.b=Ft.b,e}getStyle(e=Mt){Ze.workingToColorSpace(Ft.copy(this),e);let t=Ft.r,i=Ft.g,n=Ft.b;return e!==Mt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*i)},${Math.round(255*n)})`}offsetHSL(e,t,i){return this.getHSL(sn),this.setHSL(sn.h+e,sn.s+t,sn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(sn),e.getHSL(Js);let i=$r(sn.h,Js.h,t),n=$r(sn.s,Js.s,t),s=$r(sn.l,Js.l,t);return this.setHSL(i,n,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,n=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*n,this.g=s[1]*t+s[4]*i+s[7]*n,this.b=s[2]*t+s[5]*i+s[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ft=new ve;ve.NAMES=Ou;var $d=0,pi=class extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=Ei(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ve(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=En,this.stencilZFail=En,this.stencilZPass=En,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let n=this[t];n!==void 0?n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};function n(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(i.blending=this.blending),this.side!==0&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==204&&(i.blendSrc=this.blendSrc),this.blendDst!==205&&(i.blendDst=this.blendDst),this.blendEquation!==100&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==En&&(i.stencilFail=this.stencilFail),this.stencilZFail!==En&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==En&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData),t){let s=n(e.textures),a=n(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let n=t.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},rt=class extends pi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ze,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Pf=Qd();function Qd(){let r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),i=new Uint32Array(512),n=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(i[l]=0,i[256|l]=32768,n[l]=24,n[256|l]=24):c<-14?(i[l]=1024>>-c-14,i[256|l]=1024>>-c-14|32768,n[l]=-c-1,n[256|l]=-c-1):c<=15?(i[l]=c+15<<10,i[256|l]=c+15<<10|32768,n[l]=13,n[256|l]=13):c<128?(i[l]=31744,i[256|l]=64512,n[l]=24,n[256|l]=24):(i[l]=31744,i[256|l]=64512,n[l]=13,n[256|l]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(8388608&c);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:n,mantissaTable:s,exponentTable:a,offsetTable:o}}var yt=new S,Ks=new J,ep=0,ke=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ep++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ta,this.updateRanges=[],this.gpuType=fi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ks.fromBufferAttribute(this,t),Ks.applyMatrix3(e),this.setXY(t,Ks.x,Ks.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=di(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=it(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=di(t,this.array)),t}setX(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=di(t,this.array)),t}setY(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=di(t,this.array)),t}setZ(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=di(t,this.array)),t}setW(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=it(t,this.array),i=it(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=it(t,this.array),i=it(i,this.array),n=it(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e*=this.itemSize,this.normalized&&(t=it(t,this.array),i=it(i,this.array),n=it(n,this.array),s=it(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ta&&(e.usage=this.usage),e}};var as=class extends ke{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var os=class extends ke{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var fe=class extends ke{constructor(e,t,i){super(new Float32Array(e),t,i)}},tp=0,ei=new ge,xl=new gt,er=new S,Jt=new jt,Wr=new jt,Et=new S,De=class r extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=Ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Rc(e)?os:as)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Le().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ei.makeRotationFromQuaternion(e),this.applyMatrix4(ei),this}rotateX(e){return ei.makeRotationX(e),this.applyMatrix4(ei),this}rotateY(e){return ei.makeRotationY(e),this.applyMatrix4(ei),this}rotateZ(e){return ei.makeRotationZ(e),this.applyMatrix4(ei),this}translate(e,t,i){return ei.makeTranslation(e,t,i),this.applyMatrix4(ei),this}scale(e,t,i){return ei.makeScale(e,t,i),this.applyMatrix4(ei),this}lookAt(e){return xl.lookAt(e),xl.updateMatrix(),this.applyMatrix4(xl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(er).negate(),this.translate(er.x,er.y,er.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let n=0,s=e.length;n<s;n++){let a=e[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new fe(i,3))}else{let i=Math.min(e.length,t.count);for(let n=0;n<i;n++){let s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),void this.boundingBox.set(new S(-1/0,-1/0,-1/0),new S(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){let s=t[i];Jt.setFromBufferAttribute(s),this.morphTargetsRelative?(Et.addVectors(this.boundingBox.min,Jt.min),this.boundingBox.expandByPoint(Et),Et.addVectors(this.boundingBox.max,Jt.max),this.boundingBox.expandByPoint(Et)):(this.boundingBox.expandByPoint(Jt.min),this.boundingBox.expandByPoint(Jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ti);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),void this.boundingSphere.set(new S,1/0);if(e){let i=this.boundingSphere.center;if(Jt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];Wr.setFromBufferAttribute(o),this.morphTargetsRelative?(Et.addVectors(Jt.min,Wr.min),Jt.expandByPoint(Et),Et.addVectors(Jt.max,Wr.max),Jt.expandByPoint(Et)):(Jt.expandByPoint(Wr.min),Jt.expandByPoint(Wr.max))}Jt.getCenter(i);let n=0;for(let s=0,a=e.count;s<a;s++)Et.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(Et));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Et.fromBufferAttribute(o,c),l&&(er.fromBufferAttribute(e,c),Et.add(er)),n=Math.max(n,i.distanceToSquared(Et))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let i=t.position,n=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ke(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let I=0;I<i.count;I++)o[I]=new S,l[I]=new S;let c=new S,h=new S,d=new S,p=new J,u=new J,m=new J,g=new S,f=new S;function v(I,L,G){c.fromBufferAttribute(i,I),h.fromBufferAttribute(i,L),d.fromBufferAttribute(i,G),p.fromBufferAttribute(s,I),u.fromBufferAttribute(s,L),m.fromBufferAttribute(s,G),h.sub(c),d.sub(c),u.sub(p),m.sub(p);let H=1/(u.x*m.y-m.x*u.y);isFinite(H)&&(g.copy(h).multiplyScalar(m.y).addScaledVector(d,-u.y).multiplyScalar(H),f.copy(d).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(H),o[I].add(g),o[L].add(g),o[G].add(g),l[I].add(f),l[L].add(f),l[G].add(f))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let I=0,L=_.length;I<L;++I){let G=_[I],H=G.start;for(let O=H,N=H+G.count;O<N;O+=3)v(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let x=new S,y=new S,E=new S,b=new S;function R(I){E.fromBufferAttribute(n,I),b.copy(E);let L=o[I];x.copy(L),x.sub(E.multiplyScalar(E.dot(L))).normalize(),y.crossVectors(b,L);let G=y.dot(l[I])<0?-1:1;a.setXYZW(I,x.x,x.y,x.z,G)}for(let I=0,L=_.length;I<L;++I){let G=_[I],H=G.start;for(let O=H,N=H+G.count;O<N;O+=3)R(e.getX(O+0)),R(e.getX(O+1)),R(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ke(new Float32Array(3*t.count),3),this.setAttribute("normal",i);else for(let p=0,u=i.count;p<u;p++)i.setXYZ(p,0,0,0);let n=new S,s=new S,a=new S,o=new S,l=new S,c=new S,h=new S,d=new S;if(e)for(let p=0,u=e.count;p<u;p+=3){let m=e.getX(p+0),g=e.getX(p+1),f=e.getX(p+2);n.fromBufferAttribute(t,m),s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,f),h.subVectors(a,s),d.subVectors(n,s),h.cross(d),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,f),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(f,c.x,c.y,c.z)}else for(let p=0,u=t.count;p<u;p+=3)n.fromBufferAttribute(t,p+0),s.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),h.subVectors(a,s),d.subVectors(n,s),h.cross(d),i.setXYZ(p+0,h.x,h.y,h.z),i.setXYZ(p+1,h.x,h.y,h.z),i.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Et.fromBufferAttribute(e,t),Et.normalize(),e.setXYZ(t,Et.x,Et.y,Et.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,p=new c.constructor(l.length*h),u=0,m=0;for(let g=0,f=l.length;g<f;g++){u=o.isInterleavedBufferAttribute?l[g]*o.data.stride+o.offset:l[g]*h;for(let v=0;v<h;v++)p[m++]=c[u++]}return new ke(p,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,i=this.index.array,n=this.attributes;for(let o in n){let l=e(n[o],i);t.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,d=c.length;h<d;h++){let p=e(c[h],i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let n={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,p=c.length;d<p;d++){let u=c[d];h.push(u.toJSON(e.data))}h.length>0&&(n[l]=h,s=!0)}s&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let n=e.attributes;for(let c in n){let h=n[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],d=s[c];for(let p=0,u=d.length;p<u;p++)h.push(d[p].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},wh=new ge,Tn=new Cn,$s=new ti,Eh=new S,Qs=new S,ea=new S,ta=new S,yl=new S,ia=new S,Ah=new S,na=new S,se=class extends gt{constructor(e=new De,t=new rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}getVertexPosition(e,t){let i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);let o=this.morphTargetInfluences;if(s&&o){ia.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],d=s[l];h!==0&&(yl.fromBufferAttribute(d,e),a?ia.addScaledVector(yl,h):ia.addScaledVector(yl.sub(t),h))}t.add(ia)}return t}raycast(e,t){let i=this.geometry,n=this.material,s=this.matrixWorld;if(n!==void 0){if(i.boundingSphere===null&&i.computeBoundingSphere(),$s.copy(i.boundingSphere),$s.applyMatrix4(s),Tn.copy(e.ray).recast(e.near),$s.containsPoint(Tn.origin)===!1&&(Tn.intersectSphere($s,Eh)===null||Tn.origin.distanceToSquared(Eh)>(e.far-e.near)**2))return;wh.copy(s).invert(),Tn.copy(e.ray).applyMatrix4(wh),i.boundingBox!==null&&Tn.intersectsBox(i.boundingBox)===!1||this._computeIntersections(e,t,Tn)}}_computeIntersections(e,t,i){let n,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,p=s.groups,u=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,g=p.length;m<g;m++){let f=p[m],v=a[f.materialIndex];for(let _=Math.max(f.start,u.start),x=Math.min(o.count,Math.min(f.start+f.count,u.start+u.count));_<x;_+=3)n=ra(this,v,e,i,c,h,d,o.getX(_),o.getX(_+1),o.getX(_+2)),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=f.materialIndex,t.push(n))}else for(let m=Math.max(0,u.start),g=Math.min(o.count,u.start+u.count);m<g;m+=3)n=ra(this,a,e,i,c,h,d,o.getX(m),o.getX(m+1),o.getX(m+2)),n&&(n.faceIndex=Math.floor(m/3),t.push(n));else if(l!==void 0)if(Array.isArray(a))for(let m=0,g=p.length;m<g;m++){let f=p[m],v=a[f.materialIndex];for(let _=Math.max(f.start,u.start),x=Math.min(l.count,Math.min(f.start+f.count,u.start+u.count));_<x;_+=3)n=ra(this,v,e,i,c,h,d,_,_+1,_+2),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=f.materialIndex,t.push(n))}else for(let m=Math.max(0,u.start),g=Math.min(l.count,u.start+u.count);m<g;m+=3)n=ra(this,a,e,i,c,h,d,m,m+1,m+2),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}};function ra(r,e,t,i,n,s,a,o,l,c){r.getVertexPosition(o,Qs),r.getVertexPosition(l,ea),r.getVertexPosition(c,ta);let h=function(d,p,u,m,g,f,v,_){let x;if(x=p.side===1?m.intersectTriangle(v,f,g,!0,_):m.intersectTriangle(g,f,v,p.side===0,_),x===null)return null;na.copy(_),na.applyMatrix4(d.matrixWorld);let y=u.ray.origin.distanceTo(na);return y<u.near||y>u.far?null:{distance:y,point:na.clone(),object:d}}(r,e,t,i,Qs,ea,ta,Ah);if(h){let d=new S;Ti.getBarycoord(Ah,Qs,ea,ta,d),n&&(h.uv=Ti.getInterpolatedAttribute(n,o,l,c,d,new J)),s&&(h.uv1=Ti.getInterpolatedAttribute(s,o,l,c,d,new J)),a&&(h.normal=Ti.getInterpolatedAttribute(a,o,l,c,d,new S),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let p={a:o,b:l,c,normal:new S,materialIndex:0};Ti.getNormal(Qs,ea,ta,p.normal),h.face=p,h.barycoord=d}return h}var qe=class r extends De{constructor(e=1,t=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};let o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],d=[],p=0,u=0;function m(g,f,v,_,x,y,E,b,R,I,L){let G=y/R,H=E/I,O=y/2,N=E/2,U=b/2,k=R+1,j=I+1,K=0,$=0,ue=new S;for(let Me=0;Me<j;Me++){let _e=Me*H-N;for(let Ae=0;Ae<k;Ae++){let ne=Ae*G-O;ue[g]=ne*_,ue[f]=_e*x,ue[v]=U,c.push(ue.x,ue.y,ue.z),ue[g]=0,ue[f]=0,ue[v]=b>0?1:-1,h.push(ue.x,ue.y,ue.z),d.push(Ae/R),d.push(1-Me/I),K+=1}}for(let Me=0;Me<I;Me++)for(let _e=0;_e<R;_e++){let Ae=p+_e+k*Me,ne=p+_e+k*(Me+1),ae=p+(_e+1)+k*(Me+1),re=p+(_e+1)+k*Me;l.push(Ae,ne,re),l.push(ne,ae,re),$+=6}o.addGroup(u,$,L),u+=$,p+=K}m("z","y","x",-1,-1,i,t,e,a,s,0),m("z","y","x",1,-1,i,t,-e,a,s,1),m("x","z","y",1,1,e,i,t,n,a,2),m("x","z","y",1,-1,e,i,-t,n,a,3),m("x","y","z",1,-1,e,t,i,n,s,4),m("x","y","z",-1,-1,e,t,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new fe(c,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Fn(r){let e={};for(let t in r){e[t]={};for(let i in r[t]){let n=r[t][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone():Array.isArray(n)?e[t][i]=n.slice():e[t][i]=n}}return e}function zt(r){let e={};for(let t=0;t<r.length;t++){let i=Fn(r[t]);for(let n in i)e[n]=i[n]}return e}function Pc(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}var zu={clone:Fn,merge:zt},st=class extends pi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fn(e.uniforms),this.uniformsGroups=function(t){let i=[];for(let n=0;n<t.length;n++)i.push(t[n].clone());return i}(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let s=this.uniforms[n].value;s&&s.isTexture?t.uniforms[n]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[n]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[n]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[n]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[n]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[n]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[n]={type:"m4",value:s.toArray()}:t.uniforms[n]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},gr=class extends gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ge,this.projectionMatrix=new ge,this.projectionMatrixInverse=new ge,this.coordinateSystem=ji,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},an=new S,Ch=new J,Rh=new J,It=class extends gr{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*dr*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*lr*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*dr*Math.atan(Math.tan(.5*lr*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){an.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(an.x,an.y).multiplyScalar(-e/an.z),an.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(an.x,an.y).multiplyScalar(-e/an.z)}getViewSize(e,t){return this.getViewBounds(e,Ch,Rh),t.subVectors(Rh,Ch)}setViewOffset(e,t,i,n,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*lr*this.fov)/this.zoom,i=2*t,n=this.aspect*i,s=-.5*n,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*n/l,t-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},tr=-90,Ca=class extends gt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let n=new It(tr,1,e,t);n.layers=this.layers,this.add(n);let s=new It(tr,1,e,t);s.layers=this.layers,this.add(s);let a=new It(tr,1,e,t);a.layers=this.layers,this.add(a);let o=new It(tr,1,e,t);o.layers=this.layers,this.add(o);let l=new It(tr,1,e,t);l.layers=this.layers,this.add(l);let c=new It(tr,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,n,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===ji)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==ns)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,d=e.getRenderTarget(),p=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,n),e.render(t,s),e.setRenderTarget(i,1,n),e.render(t,a),e.setRenderTarget(i,2,n),e.render(t,o),e.setRenderTarget(i,3,n),e.render(t,l),e.setRenderTarget(i,4,n),e.render(t,c),i.texture.generateMipmaps=g,e.setRenderTarget(i,5,n),e.render(t,h),e.setRenderTarget(d,p,u),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},ls=class extends Bt{constructor(e=[],t=301,i,n,s,a,o,l,c,h){super(e,t,i,n,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ra=class extends Ri{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new ls(n),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new qe(5,5,5),s=new st({name:"CubemapFromEquirect",uniforms:Fn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;let a=new se(n,s),o=t.minFilter;return t.minFilter===Un&&(t.minFilter=Ci),new Ca(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,n=!0){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(s)}},Ee=class extends gt{constructor(){super(),this.isGroup=!0,this.type="Group"}},ip={type:"move"},vr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ee,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ee,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new S,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new S),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ee,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new S,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new S),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let g of e.hand.values()){let f=t.getJointPose(g,i),v=this._getHandJoint(c,g);f!==null&&(v.matrix.fromArray(f.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=f.radius),v.visible=f!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],p=h.position.distanceTo(d.position),u=.02,m=.005;c.inputState.pinching&&p>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ip)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Ee;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}};var Rn=class extends gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ze,this.environmentIntensity=1,this.environmentRotation=new ze,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},cs=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ta,this.updateRanges=[],this.version=0,this.uuid=Ei()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,s=this.stride;n<s;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Gt=new S,_r=class r{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=di(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=it(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=di(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=di(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=di(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=di(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=it(t,this.array),i=it(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=it(t,this.array),i=it(i,this.array),n=it(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=it(t,this.array),i=it(i,this.array),n=it(n,this.array),s=it(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return new ke(new this.array.constructor(t),this.itemSize,this.normalized)}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},kt=class extends pi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ve(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ir,Xr=new S,nr=new S,rr=new S,sr=new J,jr=new J,Gu=new ge,sa=new S,qr=new S,aa=new S,Ph=new J,Ml=new J,Ih=new J,qt=class extends gt{constructor(e=new kt){if(super(),this.isSprite=!0,this.type="Sprite",ir===void 0){ir=new De;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new cs(t,5);ir.setIndex([0,1,2,0,2,3]),ir.setAttribute("position",new _r(i,3,0,!1)),ir.setAttribute("uv",new _r(i,2,3,!1))}this.geometry=ir,this.material=e,this.center=new J(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),nr.setFromMatrixScale(this.matrixWorld),Gu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),rr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&nr.multiplyScalar(-rr.z);let i=this.material.rotation,n,s;i!==0&&(s=Math.cos(i),n=Math.sin(i));let a=this.center;oa(sa.set(-.5,-.5,0),rr,a,nr,n,s),oa(qr.set(.5,-.5,0),rr,a,nr,n,s),oa(aa.set(.5,.5,0),rr,a,nr,n,s),Ph.set(0,0),Ml.set(1,0),Ih.set(1,1);let o=e.ray.intersectTriangle(sa,qr,aa,!1,Xr);if(o===null&&(oa(qr.set(-.5,.5,0),rr,a,nr,n,s),Ml.set(0,1),o=e.ray.intersectTriangle(sa,aa,qr,!1,Xr),o===null))return;let l=e.ray.origin.distanceTo(Xr);l<e.near||l>e.far||t.push({distance:l,point:Xr.clone(),uv:Ti.getInterpolation(Xr,sa,qr,aa,Ph,Ml,Ih,new J),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function oa(r,e,t,i,n,s){sr.subVectors(r,t).addScalar(.5).multiply(i),n!==void 0?(jr.x=s*sr.x-n*sr.y,jr.y=n*sr.x+s*sr.y):jr.copy(sr),r.copy(e),r.x+=jr.x,r.y+=jr.y,r.applyMatrix4(Gu)}var If=new S,Lf=new S;var Uf=new S,Df=new Je,Nf=new Je,Ff=new S,Bf=new ge,Of=new S,zf=new ti,Gf=new ge,kf=new Cn;var Pa=class extends Bt{constructor(e=null,t=1,i=1,n,s,a,o,l,c=1003,h=1003,d,p){super(null,a,o,l,c,h,n,s,d,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Vf=new ge,Hf=new ge;var xr=class extends ke{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ar=new ge,Lh=new ge,la=[],Uh=new jt,np=new ge,Yr=new se,Zr=new ti,At=class extends se{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new xr(new Float32Array(16*i),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,np)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new jt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ar),Uh.copy(e.boundingBox).applyMatrix4(ar),this.boundingBox.union(Uh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ti),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ar),Zr.copy(e.boundingSphere).applyMatrix4(ar),this.boundingSphere.union(Zr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,3*e)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,16*e)}getMorphAt(e,t){let i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,s=e*(i.length+1)+1;for(let a=0;a<i.length;a++)i[a]=n[s+a]}raycast(e,t){let i=this.matrixWorld,n=this.count;if(Yr.geometry=this.geometry,Yr.material=this.material,Yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Zr.copy(this.boundingSphere),Zr.applyMatrix4(i),e.ray.intersectsSphere(Zr)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,ar),Lh.multiplyMatrices(i,ar),Yr.matrixWorld=Lh,Yr.raycast(e,la);for(let a=0,o=la.length;a<o;a++){let l=la[a];l.instanceId=s,l.object=this,t.push(l)}la.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new xr(new Float32Array(3*this.instanceMatrix.count).fill(1),3)),t.toArray(this.instanceColor.array,3*e)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,16*e)}setMorphAt(e,t){let i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Pa(new Float32Array(n*this.count),n,this.count,Mo,fi));let s=this.morphTexture.source.data.data,a=0;for(let c=0;c<i.length;c++)a+=i[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=n*e;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Sl=new S,rp=new S,sp=new Le,bi=class{constructor(e=new S(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let n=Sl.subVectors(i,t).cross(rp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Sl),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||sp.getNormalMatrix(e),n=this.coplanarPoint(Sl).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},wn=new ti,ap=new J(.5,.5),ca=new S,cn=class{constructor(e=new bi,t=new bi,i=new bi,n=new bi,s=new bi,a=new bi){this.planes=[e,t,i,n,s,a]}set(e,t,i,n,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3,i=!1){let n=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],d=s[5],p=s[6],u=s[7],m=s[8],g=s[9],f=s[10],v=s[11],_=s[12],x=s[13],y=s[14],E=s[15];if(n[0].setComponents(c-a,u-h,v-m,E-_).normalize(),n[1].setComponents(c+a,u+h,v+m,E+_).normalize(),n[2].setComponents(c+o,u+d,v+g,E+x).normalize(),n[3].setComponents(c-o,u-d,v-g,E-x).normalize(),i)n[4].setComponents(l,p,f,y).normalize(),n[5].setComponents(c-l,u-p,v-f,E-y).normalize();else if(n[4].setComponents(c-l,u-p,v-f,E-y).normalize(),t===ji)n[5].setComponents(c+l,u+p,v+f,E+y).normalize();else{if(t!==ns)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);n[5].setComponents(l,p,f,y).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),wn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),wn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(wn)}intersectsSprite(e){wn.center.set(0,0,0);let t=ap.distanceTo(e.center);return wn.radius=.7071067811865476+t,wn.applyMatrix4(e.matrixWorld),this.intersectsSphere(wn)}intersectsSphere(e){let t=this.planes,i=e.center,n=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let n=t[i];if(ca.x=n.normal.x>0?e.max.x:e.min.x,ca.y=n.normal.y>0?e.max.y:e.min.y,ca.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(ca)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Mi=new ge,Si=new cn,Ia=class r{constructor(){this.coordinateSystem=ji}intersectsObject(e,t){if(!t.isArrayCamera||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Mi.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Si.setFromProjectionMatrix(Mi,n.coordinateSystem,n.reversedDepth),Si.intersectsObject(e))return!0}return!1}intersectsSprite(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Mi.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Si.setFromProjectionMatrix(Mi,n.coordinateSystem,n.reversedDepth),Si.intersectsSprite(e))return!0}return!1}intersectsSphere(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Mi.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Si.setFromProjectionMatrix(Mi,n.coordinateSystem,n.reversedDepth),Si.intersectsSphere(e))return!0}return!1}intersectsBox(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Mi.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Si.setFromProjectionMatrix(Mi,n.coordinateSystem,n.reversedDepth),Si.intersectsBox(e))return!0}return!1}containsPoint(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let n=t.cameras[i];if(Mi.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),Si.setFromProjectionMatrix(Mi,n.coordinateSystem,n.reversedDepth),Si.containsPoint(e))return!0}return!1}clone(){return new r}};var Dl=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,i,n){let s=this.pool,a=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let o=s[this.index];a.push(o),this.index++,o.start=e,o.count=t,o.z=i,o.index=n}reset(){this.list.length=0,this.index=0}},Wf=new ge,Xf=new ve(1,1,1),jf=new cn,qf=new Ia,Yf=new jt,Zf=new ti,Jf=new S,Kf=new S,$f=new S,Qf=new Dl,eg=new se;var tg=new S,ig=new S,ng=new ge,rg=new Cn,sg=new ti,ag=new S,og=new S;var lg=new S,cg=new S;var La=class extends pi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ve(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Dh=new ge,Nl=new Cn,ha=new ti,ua=new S,Yi=class extends gt{constructor(e=new De,t=new La){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,n=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ha.copy(i.boundingSphere),ha.applyMatrix4(n),ha.radius+=s,e.ray.intersectsSphere(ha)===!1)return;Dh.copy(n).invert(),Nl.copy(e.ray).applyMatrix4(Dh);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null)for(let d=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);d<p;d++){let u=c.getX(d);ua.fromBufferAttribute(h,u),Nh(ua,u,l,n,e,t,this)}else for(let d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);d<p;d++)ua.fromBufferAttribute(h,d),Nh(ua,d,l,n,e,t,this)}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}};function Nh(r,e,t,i,n,s,a){let o=Nl.distanceSqToPoint(r);if(o<t){let l=new S;Nl.closestPointToPoint(r,l),l.applyMatrix4(i);let c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Pi=class extends Bt{constructor(e,t,i,n,s,a,o,l,c){super(e,t,i,n,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},hs=class extends Bt{constructor(e,t,i=1014,n,s,a,o=1003,l=1003,c,h=1026,d=1){if(h!==Ps&&h!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super({width:e,height:t,depth:d},n,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new fr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},us=class extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},yr=class r extends De{constructor(e=1,t=1,i=4,n=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:n,heightSegments:s},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),n=Math.max(3,Math.floor(n)),s=Math.max(1,Math.floor(s));let a=[],o=[],l=[],c=[],h=t/2,d=Math.PI/2*e,p=t,u=2*d+p,m=2*i+s,g=n+1,f=new S,v=new S;for(let _=0;_<=m;_++){let x=0,y=0,E=0,b=0;if(_<=i){let L=_/i,G=L*Math.PI/2;y=-h-e*Math.cos(G),E=e*Math.sin(G),b=-e*Math.cos(G),x=L*d}else if(_<=i+s){let L=(_-i)/s;y=L*t-h,E=e,b=0,x=d+L*p}else{let L=(_-i-s)/i,G=L*Math.PI/2;y=h+e*Math.sin(G),E=e*Math.cos(G),b=e*Math.sin(G),x=d+p+L*d}let R=Math.max(0,Math.min(1,x/u)),I=0;_===0?I=.5/n:_===m&&(I=-.5/n);for(let L=0;L<=n;L++){let G=L/n,H=G*Math.PI*2,O=Math.sin(H),N=Math.cos(H);v.x=-E*N,v.y=y,v.z=E*O,o.push(v.x,v.y,v.z),f.set(-E*N,b,E*O),f.normalize(),l.push(f.x,f.y,f.z),c.push(G+I,R)}if(_>0){let L=(_-1)*g;for(let G=0;G<n;G++){let H=L+G,O=L+G+1,N=_*g+G,U=_*g+G+1;a.push(H,O,N),a.push(O,U,N)}}}this.setIndex(a),this.setAttribute("position",new fe(o,3)),this.setAttribute("normal",new fe(l,3)),this.setAttribute("uv",new fe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},Mr=class r extends De{constructor(e=1,t=32,i=0,n=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);let s=[],a=[],o=[],l=[],c=new S,h=new J;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,p=3;d<=t;d++,p+=3){let u=i+d/t*n;c.x=e*Math.cos(u),c.y=e*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[p]/e+1)/2,h.y=(a[p+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new fe(a,3)),this.setAttribute("normal",new fe(o,3)),this.setAttribute("uv",new fe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Se=class r extends De{constructor(e=1,t=1,i=1,n=32,s=1,a=!1,o=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;n=Math.floor(n),s=Math.floor(s);let h=[],d=[],p=[],u=[],m=0,g=[],f=i/2,v=0;function _(x){let y=m,E=new J,b=new S,R=0,I=x===!0?e:t,L=x===!0?1:-1;for(let H=1;H<=n;H++)d.push(0,f*L,0),p.push(0,L,0),u.push(.5,.5),m++;let G=m;for(let H=0;H<=n;H++){let O=H/n*l+o,N=Math.cos(O),U=Math.sin(O);b.x=I*U,b.y=f*L,b.z=I*N,d.push(b.x,b.y,b.z),p.push(0,L,0),E.x=.5*N+.5,E.y=.5*U*L+.5,u.push(E.x,E.y),m++}for(let H=0;H<n;H++){let O=y+H,N=G+H;x===!0?h.push(N,N+1,O):h.push(N+1,N,O),R+=3}c.addGroup(v,R,x===!0?1:2),v+=R}(function(){let x=new S,y=new S,E=0,b=(t-e)/i;for(let R=0;R<=s;R++){let I=[],L=R/s,G=L*(t-e)+e;for(let H=0;H<=n;H++){let O=H/n,N=O*l+o,U=Math.sin(N),k=Math.cos(N);y.x=G*U,y.y=-L*i+f,y.z=G*k,d.push(y.x,y.y,y.z),x.set(U,b,k).normalize(),p.push(x.x,x.y,x.z),u.push(O,1-L),I.push(m++)}g.push(I)}for(let R=0;R<n;R++)for(let I=0;I<s;I++){let L=g[I][R],G=g[I+1][R],H=g[I+1][R+1],O=g[I][R+1];(e>0||I!==0)&&(h.push(L,G,O),E+=3),(t>0||I!==s-1)&&(h.push(G,H,O),E+=3)}c.addGroup(v,E,0),v+=E})(),a===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new fe(d,3)),this.setAttribute("normal",new fe(p,3)),this.setAttribute("uv",new fe(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ii=class r extends Se{constructor(e=1,t=1,i=32,n=1,s=!1,a=0,o=2*Math.PI){super(0,e,t,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},hn=class r extends De{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};let s=[],a=[];function o(u,m,g,f){let v=f+1,_=[];for(let x=0;x<=v;x++){_[x]=[];let y=u.clone().lerp(g,x/v),E=m.clone().lerp(g,x/v),b=v-x;for(let R=0;R<=b;R++)_[x][R]=R===0&&x===v?y:y.clone().lerp(E,R/b)}for(let x=0;x<v;x++)for(let y=0;y<2*(v-x)-1;y++){let E=Math.floor(y/2);y%2==0?(l(_[x][E+1]),l(_[x+1][E]),l(_[x][E])):(l(_[x][E+1]),l(_[x+1][E+1]),l(_[x+1][E]))}}function l(u){s.push(u.x,u.y,u.z)}function c(u,m){let g=3*u;m.x=e[g+0],m.y=e[g+1],m.z=e[g+2]}function h(u,m,g,f){f<0&&u.x===1&&(a[m]=u.x-1),g.x===0&&g.z===0&&(a[m]=f/2/Math.PI+.5)}function d(u){return Math.atan2(u.z,-u.x)}function p(u){return Math.atan2(-u.y,Math.sqrt(u.x*u.x+u.z*u.z))}(function(u){let m=new S,g=new S,f=new S;for(let v=0;v<t.length;v+=3)c(t[v+0],m),c(t[v+1],g),c(t[v+2],f),o(m,g,f,u)})(n),function(u){let m=new S;for(let g=0;g<s.length;g+=3)m.x=s[g+0],m.y=s[g+1],m.z=s[g+2],m.normalize().multiplyScalar(u),s[g+0]=m.x,s[g+1]=m.y,s[g+2]=m.z}(i),function(){let u=new S;for(let m=0;m<s.length;m+=3){u.x=s[m+0],u.y=s[m+1],u.z=s[m+2];let g=d(u)/2/Math.PI+.5,f=p(u)/Math.PI+.5;a.push(g,1-f)}(function(){let m=new S,g=new S,f=new S,v=new S,_=new J,x=new J,y=new J;for(let E=0,b=0;E<s.length;E+=9,b+=6){m.set(s[E+0],s[E+1],s[E+2]),g.set(s[E+3],s[E+4],s[E+5]),f.set(s[E+6],s[E+7],s[E+8]),_.set(a[b+0],a[b+1]),x.set(a[b+2],a[b+3]),y.set(a[b+4],a[b+5]),v.copy(m).add(g).add(f).divideScalar(3);let R=d(v);h(_,b+0,m,R),h(x,b+2,g,R),h(y,b+4,f,R)}})(),function(){for(let m=0;m<a.length;m+=6){let g=a[m+0],f=a[m+2],v=a[m+4],_=Math.max(g,f,v),x=Math.min(g,f,v);_>.9&&x<.1&&(g<.2&&(a[m+0]+=1),f<.2&&(a[m+2]+=1),v<.2&&(a[m+4]+=1))}}()}(),this.setAttribute("position",new fe(s,3)),this.setAttribute("normal",new fe(s.slice(),3)),this.setAttribute("uv",new fe(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},Ua=class r extends hn{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,n=1/i;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},da=new S,pa=new S,bl=new S,ma=new Ti,Da=class extends De{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let n=Math.pow(10,4),s=Math.cos(lr*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),p={},u=[];for(let m=0;m<l;m+=3){a?(c[0]=a.getX(m),c[1]=a.getX(m+1),c[2]=a.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);let{a:g,b:f,c:v}=ma;if(g.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),v.fromBufferAttribute(o,c[2]),ma.getNormal(bl),d[0]=`${Math.round(g.x*n)},${Math.round(g.y*n)},${Math.round(g.z*n)}`,d[1]=`${Math.round(f.x*n)},${Math.round(f.y*n)},${Math.round(f.z*n)}`,d[2]=`${Math.round(v.x*n)},${Math.round(v.y*n)},${Math.round(v.z*n)}`,d[0]!==d[1]&&d[1]!==d[2]&&d[2]!==d[0])for(let _=0;_<3;_++){let x=(_+1)%3,y=d[_],E=d[x],b=ma[h[_]],R=ma[h[x]],I=`${y}_${E}`,L=`${E}_${y}`;L in p&&p[L]?(bl.dot(p[L].normal)<=s&&(u.push(b.x,b.y,b.z),u.push(R.x,R.y,R.z)),p[L]=null):I in p||(p[I]={index0:c[_],index1:c[x],normal:bl.clone()})}}for(let m in p)if(p[m]){let{index0:g,index1:f}=p[m];da.fromBufferAttribute(o,g),pa.fromBufferAttribute(o,f),u.push(da.x,da.y,da.z),u.push(pa.x,pa.y,pa.z)}this.setAttribute("position",new fe(u,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},$t=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,n=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(n),t.push(s),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),n=0,s=i.length,a;a=t||e*i[s-1];let o,l=0,c=s-1;for(;l<=c;)if(n=Math.floor(l+(c-l)/2),o=i[n]-a,o<0)l=n+1;else{if(!(o>0)){c=n;break}c=n-1}if(n=c,i[n]===a)return n/(s-1);let h=i[n];return(n+(a-h)/(i[n+1]-h))/(s-1)}getTangent(e,t){let n=e-1e-4,s=e+1e-4;n<0&&(n=0),s>1&&(s=1);let a=this.getPoint(n),o=this.getPoint(s),l=t||(a.isVector2?new J:new S);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new S,n=[],s=[],a=[],o=new S,l=new ge;for(let u=0;u<=e;u++){let m=u/e;n[u]=this.getTangentAt(m,new S)}s[0]=new S,a[0]=new S;let c=Number.MAX_VALUE,h=Math.abs(n[0].x),d=Math.abs(n[0].y),p=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),p<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),a[0].crossVectors(n[0],s[0]);for(let u=1;u<=e;u++){if(s[u]=s[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(n[u-1],n[u]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Ne(n[u-1].dot(n[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(o,m))}a[u].crossVectors(n[u],s[u])}if(t===!0){let u=Math.acos(Ne(s[0].dot(s[e]),-1,1));u/=e,n[0].dot(o.crossVectors(s[0],s[e]))>0&&(u=-u);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(n[m],u*m)),a[m].crossVectors(n[m],s[m])}return{tangents:n,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Sr=class extends $t{constructor(e=0,t=0,i=1,n=1,s=0,a=2*Math.PI,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new J){let i=t,n=2*Math.PI,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(s=a?0:n),this.aClockwise!==!0||a||(s===n?s=-n:s-=n);let o=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),p=l-this.aX,u=c-this.aY;l=p*h-u*d+this.aX,c=p*d+u*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Na=class extends Sr{constructor(e,t,i,n,s,a){super(e,t,i,i,n,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Ic(){let r=0,e=0,t=0,i=0;function n(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){n(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,d){let p=(a-s)/c-(o-s)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+d)+(l-o)/d;p*=h,u*=h,n(a,o,p,u)},calc:function(s){let a=s*s;return r+e*s+t*a+i*(a*s)}}}var fa=new S,Tl=new Ic,wl=new Ic,El=new Ic,br=class extends $t{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new S){let i=t,n=this.points,s=n.length,a=(s-(this.closed?0:1))*e,o,l,c=Math.floor(a),h=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?o=n[(c-1)%s]:(fa.subVectors(n[0],n[1]).add(n[0]),o=fa);let d=n[c%s],p=n[(c+1)%s];if(this.closed||c+2<s?l=n[(c+2)%s]:(fa.subVectors(n[s-1],n[s-2]).add(n[s-1]),l=fa),this.curveType==="centripetal"||this.curveType==="chordal"){let u=this.curveType==="chordal"?.5:.25,m=Math.pow(o.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(p),u),f=Math.pow(p.distanceToSquared(l),u);g<1e-4&&(g=1),m<1e-4&&(m=g),f<1e-4&&(f=g),Tl.initNonuniformCatmullRom(o.x,d.x,p.x,l.x,m,g,f),wl.initNonuniformCatmullRom(o.y,d.y,p.y,l.y,m,g,f),El.initNonuniformCatmullRom(o.z,d.z,p.z,l.z,m,g,f)}else this.curveType==="catmullrom"&&(Tl.initCatmullRom(o.x,d.x,p.x,l.x,this.tension),wl.initCatmullRom(o.y,d.y,p.y,l.y,this.tension),El.initCatmullRom(o.z,d.z,p.z,l.z,this.tension));return i.set(Tl.calc(h),wl.calc(h),El.calc(h)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new S().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Fh(r,e,t,i,n){let s=.5*(i-e),a=.5*(n-t),o=r*r;return(2*t-2*i+s+a)*(r*o)+(-3*t+3*i-2*s-a)*o+s*r+t}function Qr(r,e,t,i){return function(n,s){let a=1-n;return a*a*s}(r,e)+function(n,s){return 2*(1-n)*n*s}(r,t)+function(n,s){return n*n*s}(r,i)}function es(r,e,t,i,n){return function(s,a){let o=1-s;return o*o*o*a}(r,e)+function(s,a){let o=1-s;return 3*o*o*s*a}(r,t)+function(s,a){return 3*(1-s)*s*s*a}(r,i)+function(s,a){return s*s*s*a}(r,n)}var ds=class extends $t{constructor(e=new J,t=new J,i=new J,n=new J){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new J){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(es(e,n.x,s.x,a.x,o.x),es(e,n.y,s.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},un=class extends $t{constructor(e=new S,t=new S,i=new S,n=new S){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new S){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(es(e,n.x,s.x,a.x,o.x),es(e,n.y,s.y,a.y,o.y),es(e,n.z,s.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ps=class extends $t{constructor(e=new J,t=new J){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new J){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new J){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Fa=class extends $t{constructor(e=new S,t=new S){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new S){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new S){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ms=class extends $t{constructor(e=new J,t=new J,i=new J){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new J){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(Qr(e,n.x,s.x,a.x),Qr(e,n.y,s.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fs=class extends $t{constructor(e=new S,t=new S,i=new S){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new S){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(Qr(e,n.x,s.x,a.x),Qr(e,n.y,s.y,a.y),Qr(e,n.z,s.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},gs=class extends $t{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new J){let i=t,n=this.points,s=(n.length-1)*e,a=Math.floor(s),o=s-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],d=n[a>n.length-3?n.length-1:a+2];return i.set(Fh(o,l.x,c.x,h.x,d.x),Fh(o,l.y,c.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new J().fromArray(n))}return this}},Ba=Object.freeze({__proto__:null,ArcCurve:Na,CatmullRomCurve3:br,CubicBezierCurve:ds,CubicBezierCurve3:un,EllipseCurve:Sr,LineCurve:ps,LineCurve3:Fa,QuadraticBezierCurve:ms,QuadraticBezierCurve3:fs,SplineCurve:gs}),Oa=class extends $t{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ba[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),n=this.getCurveLengths(),s=0;for(;s<n.length;){if(n[s]>=i){let a=n[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let n=0,s=this.curves;n<s.length;n++){let a=s[n],o=a.isEllipseCurve?2*e:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(new Ba[n.type]().fromJSON(n))}return this}},vs=class extends Oa{constructor(e){super(),this.type="Path",this.currentPoint=new J,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new ps(this.currentPoint.clone(),new J(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){let s=new ms(this.currentPoint.clone(),new J(e,t),new J(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,s,a){let o=new ds(this.currentPoint.clone(),new J(e,t),new J(i,n),new J(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new gs(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,n,s,a),this}absarc(e,t,i,n,s,a){return this.absellipse(e,t,i,i,n,s,a),this}ellipse(e,t,i,n,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,n,s,a,o,l),this}absellipse(e,t,i,n,s,a,o,l){let c=new Sr(e,t,i,n,s,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ni=class extends vs{constructor(e){super(e),this.uuid=Ei(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,n=this.holes.length;i<n;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(new vs().fromJSON(n))}return this}};function op(r,e,t=2){let i=e&&e.length,n=i?e[0]*t:r.length,s=Bh(r,0,n,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(i&&(s=function(h,d,p,u){let m=[];for(let g=0,f=d.length;g<f;g++){let v=Bh(h,d[g]*u,g<f-1?d[g+1]*u:h.length,u,!1);v===v.next&&(v.steiner=!0),m.push(fp(v))}m.sort(dp);for(let g=0;g<m.length;g++)p=pp(m[g],p);return p}(r,e,s,t)),r.length>80*t){o=1/0,l=1/0;let h=-1/0,d=-1/0;for(let p=t;p<n;p+=t){let u=r[p],m=r[p+1];u<o&&(o=u),m<l&&(l=m),u>h&&(h=u),m>d&&(d=m)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return _s(s,a,t,o,l,c,0),a}function Bh(r,e,t,i,n){let s;if(n===function(a,o,l,c){let h=0;for(let d=o,p=l-c;d<l;d+=c)h+=(a[p]-a[d])*(a[d+1]+a[p+1]),p=d;return h}(r,e,t,i)>0)for(let a=e;a<t;a+=i)s=Oh(a/i|0,r[a],r[a+1],s);else for(let a=t-i;a>=e;a-=i)s=Oh(a/i|0,r[a],r[a+1],s);return s&&Tr(s,s.next)&&(ys(s),s=s.next),s}function Pn(r,e){if(!r)return r;e||(e=r);let t,i=r;do if(t=!1,i.steiner||!Tr(i,i.next)&&mt(i.prev,i,i.next)!==0)i=i.next;else{if(ys(i),i=e=i.prev,i===i.next)break;t=!0}while(t||i!==e);return e}function _s(r,e,t,i,n,s,a){if(!r)return;!a&&s&&function(l,c,h,d){let p=l;do p.z===0&&(p.z=Fl(p.x,p.y,c,h,d)),p.prevZ=p.prev,p.nextZ=p.next,p=p.next;while(p!==l);p.prevZ.nextZ=null,p.prevZ=null,function(u){let m,g=1;do{let f,v=u;u=null;let _=null;for(m=0;v;){m++;let x=v,y=0;for(let b=0;b<g&&(y++,x=x.nextZ,x);b++);let E=g;for(;y>0||E>0&&x;)y!==0&&(E===0||!x||v.z<=x.z)?(f=v,v=v.nextZ,y--):(f=x,x=x.nextZ,E--),_?_.nextZ=f:u=f,f.prevZ=_,_=f;v=x}_.nextZ=null,g*=2}while(m>1)}(p)}(r,i,n,s);let o=r;for(;r.prev!==r.next;){let l=r.prev,c=r.next;if(s?cp(r,i,n,s):lp(r))e.push(l.i,r.i,c.i),ys(r),r=c.next,o=c.next;else if((r=c)===o){a?a===1?_s(r=hp(Pn(r),e),e,t,i,n,s,2):a===2&&up(r,e,t,i,n,s):_s(Pn(r),e,t,i,n,s,1);break}}}function lp(r){let e=r.prev,t=r,i=r.next;if(mt(e,t,i)>=0)return!1;let n=e.x,s=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=Math.min(n,s,a),d=Math.min(o,l,c),p=Math.max(n,s,a),u=Math.max(o,l,c),m=i.next;for(;m!==e;){if(m.x>=h&&m.x<=p&&m.y>=d&&m.y<=u&&Kr(n,o,s,l,a,c,m.x,m.y)&&mt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function cp(r,e,t,i){let n=r.prev,s=r,a=r.next;if(mt(n,s,a)>=0)return!1;let o=n.x,l=s.x,c=a.x,h=n.y,d=s.y,p=a.y,u=Math.min(o,l,c),m=Math.min(h,d,p),g=Math.max(o,l,c),f=Math.max(h,d,p),v=Fl(u,m,e,t,i),_=Fl(g,f,e,t,i),x=r.prevZ,y=r.nextZ;for(;x&&x.z>=v&&y&&y.z<=_;){if(x.x>=u&&x.x<=g&&x.y>=m&&x.y<=f&&x!==n&&x!==a&&Kr(o,h,l,d,c,p,x.x,x.y)&&mt(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=u&&y.x<=g&&y.y>=m&&y.y<=f&&y!==n&&y!==a&&Kr(o,h,l,d,c,p,y.x,y.y)&&mt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=v;){if(x.x>=u&&x.x<=g&&x.y>=m&&x.y<=f&&x!==n&&x!==a&&Kr(o,h,l,d,c,p,x.x,x.y)&&mt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=_;){if(y.x>=u&&y.x<=g&&y.y>=m&&y.y<=f&&y!==n&&y!==a&&Kr(o,h,l,d,c,p,y.x,y.y)&&mt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function hp(r,e){let t=r;do{let i=t.prev,n=t.next.next;!Tr(i,n)&&Vu(i,t,t.next,n)&&xs(i,n)&&xs(n,i)&&(e.push(i.i,t.i,n.i),ys(t),ys(t.next),t=r=n),t=t.next}while(t!==r);return Pn(t)}function up(r,e,t,i,n,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&gp(a,o)){let l=Hu(a,o);return a=Pn(a,a.next),l=Pn(l,l.next),_s(a,e,t,i,n,s,0),void _s(l,e,t,i,n,s,0)}o=o.next}a=a.next}while(a!==r)}function dp(r,e){let t=r.x-e.x;return t===0&&(t=r.y-e.y,t===0)&&(t=(r.next.y-r.y)/(r.next.x-r.x)-(e.next.y-e.y)/(e.next.x-e.x)),t}function pp(r,e){let t=function(n,s){let a=s,o=n.x,l=n.y,c,h=-1/0;if(Tr(n,a))return a;do{if(Tr(n,a.next))return a.next;if(l<=a.y&&l>=a.next.y&&a.next.y!==a.y){let g=a.x+(l-a.y)*(a.next.x-a.x)/(a.next.y-a.y);if(g<=o&&g>h&&(h=g,c=a.x<a.next.x?a:a.next,g===o))return c}a=a.next}while(a!==s);if(!c)return null;let d=c,p=c.x,u=c.y,m=1/0;a=c;do{if(o>=a.x&&a.x>=p&&o!==a.x&&ku(l<u?o:h,l,p,u,l<u?h:o,l,a.x,a.y)){let g=Math.abs(l-a.y)/(o-a.x);xs(a,n)&&(g<m||g===m&&(a.x>c.x||a.x===c.x&&mp(c,a)))&&(c=a,m=g)}a=a.next}while(a!==d);return c}(r,e);if(!t)return e;let i=Hu(t,r);return Pn(i,i.next),Pn(t,t.next)}function mp(r,e){return mt(r.prev,r,e.prev)<0&&mt(e.next,r,r.next)<0}function Fl(r,e,t,i,n){return(r=1431655765&((r=858993459&((r=252645135&((r=16711935&((r=(r-t)*n|0)|r<<8))|r<<4))|r<<2))|r<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-i)*n|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function fp(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function ku(r,e,t,i,n,s,a,o){return(n-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(n-a)*(i-o)}function Kr(r,e,t,i,n,s,a,o){return!(r===a&&e===o)&&ku(r,e,t,i,n,s,a,o)}function gp(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!function(t,i){let n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==i.i&&n.next.i!==i.i&&Vu(n,n.next,t,i))return!0;n=n.next}while(n!==t);return!1}(r,e)&&(xs(r,e)&&xs(e,r)&&function(t,i){let n=t,s=!1,a=(t.x+i.x)/2,o=(t.y+i.y)/2;do n.y>o!=n.next.y>o&&n.next.y!==n.y&&a<(n.next.x-n.x)*(o-n.y)/(n.next.y-n.y)+n.x&&(s=!s),n=n.next;while(n!==t);return s}(r,e)&&(mt(r.prev,r,e.prev)||mt(r,e.prev,e))||Tr(r,e)&&mt(r.prev,r,r.next)>0&&mt(e.prev,e,e.next)>0)}function mt(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Tr(r,e){return r.x===e.x&&r.y===e.y}function Vu(r,e,t,i){let n=va(mt(r,e,t)),s=va(mt(r,e,i)),a=va(mt(t,i,r)),o=va(mt(t,i,e));return n!==s&&a!==o||!(n!==0||!ga(r,t,e))||!(s!==0||!ga(r,i,e))||!(a!==0||!ga(t,r,i))||!(o!==0||!ga(t,e,i))}function ga(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function va(r){return r>0?1:r<0?-1:0}function xs(r,e){return mt(r.prev,r,r.next)<0?mt(r,e,r.next)>=0&&mt(r,r.prev,e)>=0:mt(r,e,r.prev)<0||mt(r,r.next,e)<0}function Hu(r,e){let t=Bl(r.i,r.x,r.y),i=Bl(e.i,e.x,e.y),n=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=n,n.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Oh(r,e,t,i){let n=Bl(r,e,t);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function ys(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Bl(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}var Ol=class{static triangulate(e,t,i=2){return op(e,t,i)}},wi=class r{static area(e){let t=e.length,i=0;for(let n=t-1,s=0;s<t;n=s++)i+=e[n].x*e[s].y-e[s].x*e[n].y;return .5*i}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let i=[],n=[],s=[];zh(e),Gh(i,e);let a=e.length;t.forEach(zh);for(let l=0;l<t.length;l++)n.push(a),a+=t[l].length,Gh(i,t[l]);let o=Ol.triangulate(i,n);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};function zh(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Gh(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var mi=class r extends De{constructor(e=new ni([new J(.5,.5),new J(-.5,.5),new J(-.5,-.5),new J(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,n=[],s=[];for(let o=0,l=e.length;o<l;o++)a(e[o]);function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1,p=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:u-.1,g=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3,v=t.extrudePath,_=t.UVGenerator!==void 0?t.UVGenerator:vp,x,y,E,b,R,I=!1;v&&(x=v.getSpacedPoints(h),I=!0,p=!1,y=v.computeFrenetFrames(h,!1),E=new S,b=new S,R=new S),p||(f=0,u=0,m=0,g=0);let L=o.extractPoints(c),G=L.shape,H=L.holes;if(!wi.isClockWise(G)){G=G.reverse();for(let D=0,M=H.length;D<M;D++){let C=H[D];wi.isClockWise(C)&&(H[D]=C.reverse())}}function O(D){let M=10000000000000001e-36,C=D[0];for(let B=1;B<=D.length;B++){let P=B%D.length,Y=D[P],V=Y.x-C.x,W=Y.y-C.y,te=V*V+W*W,le=Math.max(Math.abs(Y.x),Math.abs(Y.y),Math.abs(C.x),Math.abs(C.y));te<=M*le*le?(D.splice(P,1),B--):C=Y}}O(G),H.forEach(O);let N=H.length,U=G;for(let D=0;D<N;D++){let M=H[D];G=G.concat(M)}function k(D,M,C){return M||console.error("THREE.ExtrudeGeometry: vec does not exist"),D.clone().addScaledVector(M,C)}let j=G.length;function K(D,M,C){let B,P,Y,V=D.x-M.x,W=D.y-M.y,te=C.x-D.x,le=C.y-D.y,ie=V*V+W*W,de=V*le-W*te;if(Math.abs(de)>Number.EPSILON){let xe=Math.sqrt(ie),be=Math.sqrt(te*te+le*le),Ve=M.x-W/xe,Ke=M.y+V/xe,$e=((C.x-le/be-Ve)*le-(C.y+te/be-Ke)*te)/(V*le-W*te);B=Ve+V*$e-D.x,P=Ke+W*$e-D.y;let ce=B*B+P*P;if(ce<=2)return new J(B,P);Y=Math.sqrt(ce/2)}else{let xe=!1;V>Number.EPSILON?te>Number.EPSILON&&(xe=!0):V<-Number.EPSILON?te<-Number.EPSILON&&(xe=!0):Math.sign(W)===Math.sign(le)&&(xe=!0),xe?(B=-W,P=V,Y=Math.sqrt(ie)):(B=V,P=W,Y=Math.sqrt(ie/2))}return new J(B/Y,P/Y)}let $=[];for(let D=0,M=U.length,C=M-1,B=D+1;D<M;D++,C++,B++)C===M&&(C=0),B===M&&(B=0),$[D]=K(U[D],U[C],U[B]);let ue=[],Me,_e,Ae=$.concat();for(let D=0,M=N;D<M;D++){let C=H[D];Me=[];for(let B=0,P=C.length,Y=P-1,V=B+1;B<P;B++,Y++,V++)Y===P&&(Y=0),V===P&&(V=0),Me[B]=K(C[B],C[Y],C[V]);ue.push(Me),Ae=Ae.concat(Me)}if(f===0)_e=wi.triangulateShape(U,H);else{let D=[],M=[];for(let C=0;C<f;C++){let B=C/f,P=u*Math.cos(B*Math.PI/2),Y=m*Math.sin(B*Math.PI/2)+g;for(let V=0,W=U.length;V<W;V++){let te=k(U[V],$[V],Y);Te(te.x,te.y,-P),B===0&&D.push(te)}for(let V=0,W=N;V<W;V++){let te=H[V];Me=ue[V];let le=[];for(let ie=0,de=te.length;ie<de;ie++){let xe=k(te[ie],Me[ie],Y);Te(xe.x,xe.y,-P),B===0&&le.push(xe)}B===0&&M.push(le)}}_e=wi.triangulateShape(D,M)}let ne=_e.length,ae=m+g;for(let D=0;D<j;D++){let M=p?k(G[D],Ae[D],ae):G[D];I?(b.copy(y.normals[0]).multiplyScalar(M.x),E.copy(y.binormals[0]).multiplyScalar(M.y),R.copy(x[0]).add(b).add(E),Te(R.x,R.y,R.z)):Te(M.x,M.y,0)}for(let D=1;D<=h;D++)for(let M=0;M<j;M++){let C=p?k(G[M],Ae[M],ae):G[M];I?(b.copy(y.normals[D]).multiplyScalar(C.x),E.copy(y.binormals[D]).multiplyScalar(C.y),R.copy(x[D]).add(b).add(E),Te(R.x,R.y,R.z)):Te(C.x,C.y,d/h*D)}for(let D=f-1;D>=0;D--){let M=D/f,C=u*Math.cos(M*Math.PI/2),B=m*Math.sin(M*Math.PI/2)+g;for(let P=0,Y=U.length;P<Y;P++){let V=k(U[P],$[P],B);Te(V.x,V.y,d+C)}for(let P=0,Y=H.length;P<Y;P++){let V=H[P];Me=ue[P];for(let W=0,te=V.length;W<te;W++){let le=k(V[W],Me[W],B);I?Te(le.x,le.y+x[h-1].y,x[h-1].x+C):Te(le.x,le.y,d+C)}}}function re(D,M){let C=D.length;for(;--C>=0;){let B=C,P=C-1;P<0&&(P=D.length-1);for(let Y=0,V=h+2*f;Y<V;Y++){let W=j*Y,te=j*(Y+1);w(M+B+W,M+P+W,M+P+te,M+B+te)}}}function Te(D,M,C){l.push(D),l.push(M),l.push(C)}function Ue(D,M,C){T(D),T(M),T(C);let B=n.length/3,P=_.generateTopUV(i,n,B-3,B-2,B-1);z(P[0]),z(P[1]),z(P[2])}function w(D,M,C,B){T(D),T(M),T(B),T(M),T(C),T(B);let P=n.length/3,Y=_.generateSideWallUV(i,n,P-6,P-3,P-2,P-1);z(Y[0]),z(Y[1]),z(Y[3]),z(Y[1]),z(Y[2]),z(Y[3])}function T(D){n.push(l[3*D+0]),n.push(l[3*D+1]),n.push(l[3*D+2])}function z(D){s.push(D.x),s.push(D.y)}(function(){let D=n.length/3;if(p){let M=0,C=j*M;for(let B=0;B<ne;B++){let P=_e[B];Ue(P[2]+C,P[1]+C,P[0]+C)}M=h+2*f,C=j*M;for(let B=0;B<ne;B++){let P=_e[B];Ue(P[0]+C,P[1]+C,P[2]+C)}}else{for(let M=0;M<ne;M++){let C=_e[M];Ue(C[2],C[1],C[0])}for(let M=0;M<ne;M++){let C=_e[M];Ue(C[0]+j*h,C[1]+j*h,C[2]+j*h)}}i.addGroup(D,n.length/3-D,0)})(),function(){let D=n.length/3,M=0;re(U,M),M+=U.length;for(let C=0,B=H.length;C<B;C++){let P=H[C];re(P,M),M+=P.length}i.addGroup(D,n.length/3-D,1)}()}this.setAttribute("position",new fe(n,3)),this.setAttribute("uv",new fe(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return function(t,i,n){if(n.shapes=[],Array.isArray(t))for(let s=0,a=t.length;s<a;s++){let o=t[s];n.shapes.push(o.uuid)}else n.shapes.push(t.uuid);return n.options=Object.assign({},i),i.extrudePath!==void 0&&(n.options.extrudePath=i.extrudePath.toJSON()),n}(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let i=[];for(let s=0,a=e.shapes.length;s<a;s++){let o=t[e.shapes[s]];i.push(o)}let n=e.options.extrudePath;return n!==void 0&&(e.options.extrudePath=new Ba[n.type]().fromJSON(n)),new r(i,e.options)}},vp={generateTopUV:function(r,e,t,i,n){let s=e[3*t],a=e[3*t+1],o=e[3*i],l=e[3*i+1],c=e[3*n],h=e[3*n+1];return[new J(s,a),new J(o,l),new J(c,h)]},generateSideWallUV:function(r,e,t,i,n,s){let a=e[3*t],o=e[3*t+1],l=e[3*t+2],c=e[3*i],h=e[3*i+1],d=e[3*i+2],p=e[3*n],u=e[3*n+1],m=e[3*n+2],g=e[3*s],f=e[3*s+1],v=e[3*s+2];return Math.abs(o-h)<Math.abs(a-c)?[new J(a,1-l),new J(c,1-d),new J(p,1-m),new J(g,1-v)]:[new J(o,1-l),new J(h,1-d),new J(u,1-m),new J(f,1-v)]}},Zi=class r extends hn{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2;super([-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},dn=class r extends De{constructor(e=[new J(0,-.5),new J(.5,0),new J(0,.5)],t=12,i=0,n=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:n},t=Math.floor(t),n=Ne(n,0,2*Math.PI);let s=[],a=[],o=[],l=[],c=[],h=1/t,d=new S,p=new J,u=new S,m=new S,g=new S,f=0,v=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:f=e[_+1].x-e[_].x,v=e[_+1].y-e[_].y,u.x=1*v,u.y=-f,u.z=0*v,g.copy(u),u.normalize(),l.push(u.x,u.y,u.z);break;case e.length-1:l.push(g.x,g.y,g.z);break;default:f=e[_+1].x-e[_].x,v=e[_+1].y-e[_].y,u.x=1*v,u.y=-f,u.z=0*v,m.copy(u),u.x+=g.x,u.y+=g.y,u.z+=g.z,u.normalize(),l.push(u.x,u.y,u.z),g.copy(m)}for(let _=0;_<=t;_++){let x=i+_*h*n,y=Math.sin(x),E=Math.cos(x);for(let b=0;b<=e.length-1;b++){d.x=e[b].x*y,d.y=e[b].y,d.z=e[b].x*E,a.push(d.x,d.y,d.z),p.x=_/t,p.y=b/(e.length-1),o.push(p.x,p.y);let R=l[3*b+0]*y,I=l[3*b+1],L=l[3*b+0]*E;c.push(R,I,L)}}for(let _=0;_<t;_++)for(let x=0;x<e.length-1;x++){let y=x+_*e.length,E=y,b=y+e.length,R=y+e.length+1,I=y+1;s.push(E,b,I),s.push(R,I,b)}this.setIndex(s),this.setAttribute("position",new fe(a,3)),this.setAttribute("uv",new fe(o,2)),this.setAttribute("normal",new fe(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},za=class r extends hn{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Ii=class r extends De{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};let s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,d=e/o,p=t/l,u=[],m=[],g=[],f=[];for(let v=0;v<h;v++){let _=v*p-a;for(let x=0;x<c;x++){let y=x*d-s;m.push(y,-_,0),g.push(0,0,1),f.push(x/o),f.push(1-v/l)}}for(let v=0;v<l;v++)for(let _=0;_<o;_++){let x=_+c*v,y=_+c*(v+1),E=_+1+c*(v+1),b=_+1+c*v;u.push(x,y,b),u.push(y,E,b)}this.setIndex(u),this.setAttribute("position",new fe(m,3)),this.setAttribute("normal",new fe(g,3)),this.setAttribute("uv",new fe(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},Ga=class r extends De{constructor(e=.5,t=1,i=32,n=1,s=0,a=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i);let o=[],l=[],c=[],h=[],d=e,p=(t-e)/(n=Math.max(1,n)),u=new S,m=new J;for(let g=0;g<=n;g++){for(let f=0;f<=i;f++){let v=s+f/i*a;u.x=d*Math.cos(v),u.y=d*Math.sin(v),l.push(u.x,u.y,u.z),c.push(0,0,1),m.x=(u.x/t+1)/2,m.y=(u.y/t+1)/2,h.push(m.x,m.y)}d+=p}for(let g=0;g<n;g++){let f=g*(i+1);for(let v=0;v<i;v++){let _=v+f,x=_,y=_+i+1,E=_+i+2,b=_+1;o.push(x,y,b),o.push(y,E,b)}}this.setIndex(o),this.setAttribute("position",new fe(l,3)),this.setAttribute("normal",new fe(c,3)),this.setAttribute("uv",new fe(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},ka=class r extends De{constructor(e=new ni([new J(0,.5),new J(-.5,-.5),new J(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],n=[],s=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;function c(h){let d=n.length/3,p=h.extractPoints(t),u=p.shape,m=p.holes;wi.isClockWise(u)===!1&&(u=u.reverse());for(let f=0,v=m.length;f<v;f++){let _=m[f];wi.isClockWise(_)===!0&&(m[f]=_.reverse())}let g=wi.triangulateShape(u,m);for(let f=0,v=m.length;f<v;f++){let _=m[f];u=u.concat(_)}for(let f=0,v=u.length;f<v;f++){let _=u[f];n.push(_.x,_.y,0),s.push(0,0,1),a.push(_.x,_.y)}for(let f=0,v=g.length;f<v;f++){let _=g[f],x=_[0]+d,y=_[1]+d,E=_[2]+d;i.push(x,y,E),l+=3}}this.setIndex(i),this.setAttribute("position",new fe(n,3)),this.setAttribute("normal",new fe(s,3)),this.setAttribute("uv",new fe(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return function(t,i){if(i.shapes=[],Array.isArray(t))for(let n=0,s=t.length;n<s;n++){let a=t[n];i.shapes.push(a.uuid)}else i.shapes.push(t.uuid);return i}(this.parameters.shapes,e)}static fromJSON(e,t){let i=[];for(let n=0,s=e.shapes.length;n<s;n++){let a=t[e.shapes[n]];i.push(a)}return new r(i,e.curveSegments)}},St=class r extends De{constructor(e=1,t=32,i=16,n=0,s=2*Math.PI,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new S,p=new S,u=[],m=[],g=[],f=[];for(let v=0;v<=i;v++){let _=[],x=v/i,y=0;v===0&&a===0?y=.5/t:v===i&&l===Math.PI&&(y=-.5/t);for(let E=0;E<=t;E++){let b=E/t;d.x=-e*Math.cos(n+b*s)*Math.sin(a+x*o),d.y=e*Math.cos(a+x*o),d.z=e*Math.sin(n+b*s)*Math.sin(a+x*o),m.push(d.x,d.y,d.z),p.copy(d).normalize(),g.push(p.x,p.y,p.z),f.push(b+y,1-x),_.push(c++)}h.push(_)}for(let v=0;v<i;v++)for(let _=0;_<t;_++){let x=h[v][_+1],y=h[v][_],E=h[v+1][_],b=h[v+1][_+1];(v!==0||a>0)&&u.push(x,y,b),(v!==i-1||l<Math.PI)&&u.push(y,E,b)}this.setIndex(u),this.setAttribute("position",new fe(m,3)),this.setAttribute("normal",new fe(g,3)),this.setAttribute("uv",new fe(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},Va=class r extends hn{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Ct=class r extends De{constructor(e=1,t=.4,i=12,n=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:s},i=Math.floor(i),n=Math.floor(n);let a=[],o=[],l=[],c=[],h=new S,d=new S,p=new S;for(let u=0;u<=i;u++)for(let m=0;m<=n;m++){let g=m/n*s,f=u/i*Math.PI*2;d.x=(e+t*Math.cos(f))*Math.cos(g),d.y=(e+t*Math.cos(f))*Math.sin(g),d.z=t*Math.sin(f),o.push(d.x,d.y,d.z),h.x=e*Math.cos(g),h.y=e*Math.sin(g),p.subVectors(d,h).normalize(),l.push(p.x,p.y,p.z),c.push(m/n),c.push(u/i)}for(let u=1;u<=i;u++)for(let m=1;m<=n;m++){let g=(n+1)*u+m-1,f=(n+1)*(u-1)+m-1,v=(n+1)*(u-1)+m,_=(n+1)*u+m;a.push(g,f,_),a.push(f,v,_)}this.setIndex(a),this.setAttribute("position",new fe(o,3)),this.setAttribute("normal",new fe(l,3)),this.setAttribute("uv",new fe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},Ha=class r extends De{constructor(e=1,t=.4,i=64,n=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:n,p:s,q:a},i=Math.floor(i),n=Math.floor(n);let o=[],l=[],c=[],h=[],d=new S,p=new S,u=new S,m=new S,g=new S,f=new S,v=new S;for(let x=0;x<=i;++x){let y=x/i*s*Math.PI*2;_(y,s,a,e,u),_(y+.01,s,a,e,m),f.subVectors(m,u),v.addVectors(m,u),g.crossVectors(f,v),v.crossVectors(g,f),g.normalize(),v.normalize();for(let E=0;E<=n;++E){let b=E/n*Math.PI*2,R=-t*Math.cos(b),I=t*Math.sin(b);d.x=u.x+(R*v.x+I*g.x),d.y=u.y+(R*v.y+I*g.y),d.z=u.z+(R*v.z+I*g.z),l.push(d.x,d.y,d.z),p.subVectors(d,u).normalize(),c.push(p.x,p.y,p.z),h.push(x/i),h.push(E/n)}}for(let x=1;x<=i;x++)for(let y=1;y<=n;y++){let E=(n+1)*(x-1)+(y-1),b=(n+1)*x+(y-1),R=(n+1)*x+y,I=(n+1)*(x-1)+y;o.push(E,b,I),o.push(b,R,I)}function _(x,y,E,b,R){let I=Math.cos(x),L=Math.sin(x),G=E/y*x,H=Math.cos(G);R.x=b*(2+H)*.5*I,R.y=b*(2+H)*L*.5,R.z=b*Math.sin(G)*.5}this.setIndex(o),this.setAttribute("position",new fe(l,3)),this.setAttribute("normal",new fe(c,3)),this.setAttribute("uv",new fe(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},Wa=class r extends De{constructor(e=new fs(new S(-1,-1,0),new S(-1,1,0),new S(1,1,0)),t=64,i=1,n=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:n,closed:s};let a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new S,l=new S,c=new J,h=new S,d=[],p=[],u=[],m=[];function g(f){h=e.getPointAt(f/t,h);let v=a.normals[f],_=a.binormals[f];for(let x=0;x<=n;x++){let y=x/n*Math.PI*2,E=Math.sin(y),b=-Math.cos(y);l.x=b*v.x+E*_.x,l.y=b*v.y+E*_.y,l.z=b*v.z+E*_.z,l.normalize(),p.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,d.push(o.x,o.y,o.z)}}(function(){for(let f=0;f<t;f++)g(f);g(s===!1?t:0),function(){for(let f=0;f<=t;f++)for(let v=0;v<=n;v++)c.x=f/t,c.y=v/n,u.push(c.x,c.y)}(),function(){for(let f=1;f<=t;f++)for(let v=1;v<=n;v++){let _=(n+1)*(f-1)+(v-1),x=(n+1)*f+(v-1),y=(n+1)*f+v,E=(n+1)*(f-1)+v;m.push(_,x,E),m.push(x,y,E)}}()})(),this.setIndex(m),this.setAttribute("position",new fe(d,3)),this.setAttribute("normal",new fe(p,3)),this.setAttribute("uv",new fe(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new Ba[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Xa=class extends De{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,n=new S,s=new S;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let d=l[c],p=d.start;for(let u=p,m=p+d.count;u<m;u+=3)for(let g=0;g<3;g++){let f=o.getX(u+g),v=o.getX(u+(g+1)%3);n.fromBufferAttribute(a,f),s.fromBufferAttribute(a,v),kh(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,d=3*o+(c+1)%3;n.fromBufferAttribute(a,h),s.fromBufferAttribute(a,d),kh(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new fe(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function kh(r,e,t){let i=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,n=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(i)!==!0&&t.has(n)!==!0&&(t.add(i),t.add(n),!0)}var hg=Object.freeze({__proto__:null,BoxGeometry:qe,CapsuleGeometry:yr,CircleGeometry:Mr,ConeGeometry:ii,CylinderGeometry:Se,DodecahedronGeometry:Ua,EdgesGeometry:Da,ExtrudeGeometry:mi,IcosahedronGeometry:Zi,LatheGeometry:dn,OctahedronGeometry:za,PlaneGeometry:Ii,PolyhedronGeometry:hn,RingGeometry:Ga,ShapeGeometry:ka,SphereGeometry:St,TetrahedronGeometry:Va,TorusGeometry:Ct,TorusKnotGeometry:Ha,TubeGeometry:Wa,WireframeGeometry:Xa});var ut=class extends pi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ze,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ot=class extends ut{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new J(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ne(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ve(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ve(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ve(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Ms=class extends pi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ze,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ja=class extends pi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},qa=class extends pi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function _a(r,e){return r&&r.constructor!==e?typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r):r}function _p(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}var In=class{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,n=t[i],s=t[i-1];i:{e:{let a;t:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<s)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=n,n=t[++i],e<n)break e}a=t.length;break t}if(!(e>=s)){let o=t[1];e<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=s,s=t[--i-1],e>=s)break e}a=i,i=0;break t}break i}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(n=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,n)}return this.interpolate_(i,s,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=e*n;for(let a=0;a!==n;++a)t[a]=i[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ya=class extends In{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Pl,endingEnd:Pl}}intervalChanged_(e,t,i){let n=this.parameterPositions,s=e-2,a=e+1,o=n[s],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case Il:s=e,o=2*t-i;break;case Ll:s=n.length-2,o=t+n[s]-n[s+1];break;default:s=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Il:a=e,l=2*i-t;break;case Ll:a=1,l=i+n[1]-n[0];break;default:a=e-1,l=t}let c=.5*(i-t),h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,p=this._weightPrev,u=this._weightNext,m=(i-t)/(n-t),g=m*m,f=g*m,v=-p*f+2*p*g-p*m,_=(1+p)*f+(-1.5-2*p)*g+(-.5+p)*m+1,x=(-1-u)*f+(1.5+u)*g+.5*m,y=u*f-u*g;for(let E=0;E!==o;++E)s[E]=v*a[h+E]+_*a[c+E]+x*a[l+E]+y*a[d+E];return s}},Za=class extends In{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(n-t),d=1-h;for(let p=0;p!==o;++p)s[p]=a[c+p]*d+a[l+p]*h;return s}},Ja=class extends In{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}},Kt=class{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=_a(t,this.TimeBufferType),this.values=_a(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:_a(e.times,Array),values:_a(e.values,Array)};let n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Ja(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Za(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ya(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ts:t=this.InterpolantFactoryMethodDiscrete;break;case ba:t=this.InterpolantFactoryMethodLinear;break;case xa:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(i);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ts;case this.InterpolantFactoryMethodLinear:return ba;case this.InterpolantFactoryMethodSmooth:return xa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e}return this}trim(e,t){let i=this.times,n=i.length,s=0,a=n-1;for(;s!==n&&i[s]<e;)++s;for(;a!==-1&&i[a]>t;)--a;if(++a,s!==0||a!==n){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,n=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(n!==void 0&&_p(n))for(let o=0,l=n.length;o!==l;++o){let c=n[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===xa,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o];if(c!==e[o+1]&&(o!==1||c!==e[0]))if(n)l=!0;else{let h=o*i,d=h-i,p=h+i;for(let u=0;u!==i;++u){let m=t[h+u];if(m!==t[d+u]||m!==t[p+u]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*i,d=a*i;for(let p=0;p!==i;++p)t[d+p]=t[h+p]}++a}}if(s>0){e[a]=e[s];for(let o=s*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=new this.constructor(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};Kt.prototype.ValueTypeName="",Kt.prototype.TimeBufferType=Float32Array,Kt.prototype.ValueBufferType=Float32Array,Kt.prototype.DefaultInterpolation=ba;var on=class extends Kt{constructor(e,t,i){super(e,t,i)}};on.prototype.ValueTypeName="bool",on.prototype.ValueBufferType=Array,on.prototype.DefaultInterpolation=ts,on.prototype.InterpolantFactoryMethodLinear=void 0,on.prototype.InterpolantFactoryMethodSmooth=void 0;var Ka=class extends Kt{constructor(e,t,i,n){super(e,t,i,n)}};Ka.prototype.ValueTypeName="color";var $a=class extends Kt{constructor(e,t,i,n){super(e,t,i,n)}};$a.prototype.ValueTypeName="number";var Qa=class extends In{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(n-t),c=e*o;for(let h=c+o;c!==h;c+=4)et.slerpFlat(s,0,a,c-o,a,c,l);return s}},Ss=class extends Kt{constructor(e,t,i,n){super(e,t,i,n)}InterpolantFactoryMethodLinear(e){return new Qa(this.times,this.values,this.getValueSize(),e)}};Ss.prototype.ValueTypeName="quaternion",Ss.prototype.InterpolantFactoryMethodSmooth=void 0;var ln=class extends Kt{constructor(e,t,i){super(e,t,i)}};ln.prototype.ValueTypeName="string",ln.prototype.ValueBufferType=Array,ln.prototype.DefaultInterpolation=ts,ln.prototype.InterpolantFactoryMethodLinear=void 0,ln.prototype.InterpolantFactoryMethodSmooth=void 0;var eo=class extends Kt{constructor(e,t,i,n){super(e,t,i,n)}};eo.prototype.ValueTypeName="vector";var ya={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}},to=class{constructor(e,t,i){let n=this,s,a=!1,o=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.abortController=new AbortController,this.itemStart=function(h){l++,a===!1&&n.onStart!==void 0&&n.onStart(h,o,l),a=!0},this.itemEnd=function(h){o++,n.onProgress!==void 0&&n.onProgress(h,o,l),o===l&&(a=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(h){n.onError!==void 0&&n.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,p=c.length;d<p;d+=2){let u=c[d],m=c[d+1];if(u.global&&(u.lastIndex=0),u.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Wu=new to,wr=class{constructor(e){this.manager=e!==void 0?e:Wu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(n,s){i.load(e,n,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};wr.DEFAULT_MATERIAL_NAME="__DEFAULT";var or=new WeakMap,io=class extends wr{constructor(e){super(e)}load(e,t,i,n){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=ya.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let d=or.get(a);d===void 0&&(d=[],or.set(a,d)),d.push({onLoad:t,onError:n})}return a}let o=pr("img");function l(){h(),t&&t(this);let d=or.get(this)||[];for(let p=0;p<d.length;p++){let u=d[p];u.onLoad&&u.onLoad(this)}or.delete(this),s.manager.itemEnd(e)}function c(d){h(),n&&n(d),ya.remove(`image:${e}`);let p=or.get(this)||[];for(let u=0;u<p.length;u++){let m=p[u];m.onError&&m.onError(d)}or.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ya.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}};var bs=class extends wr{constructor(e){super(e)}load(e,t,i,n){let s=new Bt,a=new io(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},i,n),s}},Er=class extends gt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ve(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Ts=class extends Er{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ve(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Al=new ge,Vh=new S,Hh=new S,no=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new J(512,512),this.mapType=Ui,this.map=null,this.mapPass=null,this.matrix=new ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cn,this._frameExtents=new J(1,1),this._viewportCount=1,this._viewports=[new Je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;Vh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Vh),Hh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Hh),t.updateMatrixWorld(),Al.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Al,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Al)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),this.mapSize.x===512&&this.mapSize.y===512||(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Wh=new ge,Jr=new S,Cl=new S,zl=class extends no{constructor(){super(new It(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new J(4,2),this._viewportCount=6,this._viewports=[new Je(2,1,1,1),new Je(0,1,1,1),new Je(3,1,1,1),new Je(1,1,1,1),new Je(3,0,1,1),new Je(1,0,1,1)],this._cubeDirections=[new S(1,0,0),new S(-1,0,0),new S(0,0,1),new S(0,0,-1),new S(0,1,0),new S(0,-1,0)],this._cubeUps=[new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,0,1),new S(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,n=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),Jr.setFromMatrixPosition(e.matrixWorld),i.position.copy(Jr),Cl.copy(i.position),Cl.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Cl),i.updateMatrixWorld(),n.makeTranslation(-Jr.x,-Jr.y,-Jr.z),Wh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wh,i.coordinateSystem,i.reversedDepth)}},Rt=class extends Er{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new zl}get power(){return 4*this.intensity*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},ws=class extends gr{constructor(e=-1,t=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2,s=i-e,a=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Gl=class extends no{constructor(){super(new ws(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Es=class extends Er{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.target=new gt,this.shadow=new Gl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var ug=new ge,dg=new ge,pg=new ge;var ro=class extends It{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var mg=new S,fg=new et,gg=new S,vg=new S,_g=new S;var xg=new S,yg=new et,Mg=new S,Sg=new S;var Lc="\\[\\]\\.:\\/",xp=new RegExp("["+Lc+"]","g"),Rl="[^"+Lc+"]",yp="[^"+Lc.replace("\\.","")+"]",Mp=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",Rl)+/(WCOD+)?/.source.replace("WCOD",yp)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Rl)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Rl)+"$"),Sp=["material","materials","bones","map"],at=class r{constructor(e,t,i){this.path=t,this.parsedPath=i||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,i):new r(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(xp,"")}static parseTrackName(e){let t=Mp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){let s=i.nodeName.substring(n+1);Sp.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,n=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[i]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[i]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let a=e[n];if(a===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",e)}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};at.Composite=class{constructor(r,e,t){let i=t||at.parseTrackName(e);this._targetGroup=r,this._bindings=r.subscribe_(e,i)}getValue(r,e){this.bind();let t=this._targetGroup.nCachedObjects_,i=this._bindings[t];i!==void 0&&i.getValue(r,e)}setValue(r,e){let t=this._bindings;for(let i=this._targetGroup.nCachedObjects_,n=t.length;i!==n;++i)t[i].setValue(r,e)}bind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].bind()}unbind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].unbind()}},at.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},at.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},at.prototype.GetterByBindingType=[at.prototype._getValue_direct,at.prototype._getValue_array,at.prototype._getValue_arrayElement,at.prototype._getValue_toArray],at.prototype.SetterByBindingTypeAndVersioning=[[at.prototype._setValue_direct,at.prototype._setValue_direct_setNeedsUpdate,at.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[at.prototype._setValue_array,at.prototype._setValue_array_setNeedsUpdate,at.prototype._setValue_array_setMatrixWorldNeedsUpdate],[at.prototype._setValue_arrayElement,at.prototype._setValue_arrayElement_setNeedsUpdate,at.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[at.prototype._setValue_fromArray,at.prototype._setValue_fromArray_setNeedsUpdate,at.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var bg=new Float32Array(1);var Tg=new ge;var wg=new J;var Eg=new S,Ag=new S,Cg=new S,Rg=new S,Pg=new S,Ig=new S,Lg=new S;var Ug=new S;var Dg=new S,Ng=new ge,Fg=new ge;var Bg=new S,Og=new ve,zg=new ve;var Gg=new S,kg=new S,Vg=new S;var Hg=new S,Wg=new gr;var Xg=new jt;var jg=new S;function Uc(r,e,t,i){let n=function(s){switch(s){case Ui:case ql:return{byteLength:1,components:1};case Rr:case Yl:case Pr:return{byteLength:2,components:1};case xo:case yo:return{byteLength:2,components:4};case Dn:case _o:case fi:return{byteLength:4,components:1};case Zl:case Jl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}(i);switch(t){case 1021:return r*e;case Mo:case So:return r*e/n.components*n.byteLength;case 1030:case 1031:return r*e*2/n.components*n.byteLength;case 1022:return r*e*3/n.components*n.byteLength;case gi:case 1033:return r*e*4/n.components*n.byteLength;case 33776:case 33777:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(r,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(r,8)*Math.max(e,8)/2;case 36196:case 37492:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37808:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(r/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(r/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ma}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ma);function md(){let r=null,e=!1,t=null,i=null;function n(s,a){t(s,a),i=r.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&(i=r.requestAnimationFrame(n),e=!0)},stop:function(){r.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Cp(r){let e=new WeakMap;return{get:function(t){return t.isInterleavedBufferAttribute&&(t=t.data),e.get(t)},remove:function(t){t.isInterleavedBufferAttribute&&(t=t.data);let i=e.get(t);i&&(r.deleteBuffer(i.buffer),e.delete(t))},update:function(t,i){if(t.isInterleavedBufferAttribute&&(t=t.data),t.isGLBufferAttribute){let s=e.get(t);return void((!s||s.version<t.version)&&e.set(t,{buffer:t.buffer,type:t.type,bytesPerElement:t.elementSize,version:t.version}))}let n=e.get(t);if(n===void 0)e.set(t,function(s,a){let o=s.array,l=s.usage,c=o.byteLength,h=r.createBuffer(),d;if(r.bindBuffer(a,h),r.bufferData(a,o,l),s.onUploadCallback(),o instanceof Float32Array)d=r.FLOAT;else if(typeof Float16Array<"u"&&o instanceof Float16Array)d=r.HALF_FLOAT;else if(o instanceof Uint16Array)d=s.isFloat16BufferAttribute?r.HALF_FLOAT:r.UNSIGNED_SHORT;else if(o instanceof Int16Array)d=r.SHORT;else if(o instanceof Uint32Array)d=r.UNSIGNED_INT;else if(o instanceof Int32Array)d=r.INT;else if(o instanceof Int8Array)d=r.BYTE;else if(o instanceof Uint8Array)d=r.UNSIGNED_BYTE;else{if(!(o instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+o);d=r.UNSIGNED_BYTE}return{buffer:h,type:d,bytesPerElement:o.BYTES_PER_ELEMENT,version:s.version,size:c}}(t,i));else if(n.version<t.version){if(n.size!==t.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(s,a,o){let l=a.array,c=a.updateRanges;if(r.bindBuffer(o,s),c.length===0)r.bufferSubData(o,0,l);else{c.sort((d,p)=>d.start-p.start);let h=0;for(let d=1;d<c.length;d++){let p=c[h],u=c[d];u.start<=p.start+p.count+1?p.count=Math.max(p.count,u.start+u.count-p.start):(++h,c[h]=u)}c.length=h+1;for(let d=0,p=c.length;d<p;d++){let u=c[d];r.bufferSubData(o,u.start*l.BYTES_PER_ELEMENT,l,u.start,u.count)}a.clearUpdateRanges()}a.onUploadCallback()})(n.buffer,t,i),n.version=t.version}}}}var Fe={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},oe={common:{diffuse:{value:new ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Le}},envmap:{envMap:{value:null},envMapRotation:{value:new Le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Le},normalScale:{value:new J(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0},uvTransform:{value:new Le}},sprite:{diffuse:{value:new ve(16777215)},opacity:{value:1},center:{value:new J(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}}},Di={basic:{uniforms:zt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Fe.meshbasic_vert,fragmentShader:Fe.meshbasic_frag},lambert:{uniforms:zt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new ve(0)}}]),vertexShader:Fe.meshlambert_vert,fragmentShader:Fe.meshlambert_frag},phong:{uniforms:zt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new ve(0)},specular:{value:new ve(1118481)},shininess:{value:30}}]),vertexShader:Fe.meshphong_vert,fragmentShader:Fe.meshphong_frag},standard:{uniforms:zt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag},toon:{uniforms:zt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new ve(0)}}]),vertexShader:Fe.meshtoon_vert,fragmentShader:Fe.meshtoon_frag},matcap:{uniforms:zt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Fe.meshmatcap_vert,fragmentShader:Fe.meshmatcap_frag},points:{uniforms:zt([oe.points,oe.fog]),vertexShader:Fe.points_vert,fragmentShader:Fe.points_frag},dashed:{uniforms:zt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fe.linedashed_vert,fragmentShader:Fe.linedashed_frag},depth:{uniforms:zt([oe.common,oe.displacementmap]),vertexShader:Fe.depth_vert,fragmentShader:Fe.depth_frag},normal:{uniforms:zt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Fe.meshnormal_vert,fragmentShader:Fe.meshnormal_frag},sprite:{uniforms:zt([oe.sprite,oe.fog]),vertexShader:Fe.sprite_vert,fragmentShader:Fe.sprite_frag},background:{uniforms:{uvTransform:{value:new Le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fe.background_vert,fragmentShader:Fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Le}},vertexShader:Fe.backgroundCube_vert,fragmentShader:Fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fe.cube_vert,fragmentShader:Fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fe.equirect_vert,fragmentShader:Fe.equirect_frag},distanceRGBA:{uniforms:zt([oe.common,oe.displacementmap,{referencePosition:{value:new S},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fe.distanceRGBA_vert,fragmentShader:Fe.distanceRGBA_frag},shadow:{uniforms:zt([oe.lights,oe.fog,{color:{value:new ve(0)},opacity:{value:1}}]),vertexShader:Fe.shadow_vert,fragmentShader:Fe.shadow_frag}};Di.physical={uniforms:zt([Di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Le},clearcoatNormalScale:{value:new J(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Le},sheen:{value:0},sheenColor:{value:new ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Le},transmissionSamplerSize:{value:new J},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Le},attenuationDistance:{value:0},attenuationColor:{value:new ve(0)},specularColor:{value:new ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Le},anisotropyVector:{value:new J},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Le}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag};var Ao={r:0,b:0,g:0},Bn=new ze,Rp=new ge;function Pp(r,e,t,i,n,s,a){let o=new ve(0),l,c,h=s===!0?0:1,d=null,p=0,u=null;function m(f){let v=f.isScene===!0?f.background:null;return v&&v.isTexture&&(v=(f.backgroundBlurriness>0?t:e).get(v)),v}function g(f,v){f.getRGB(Ao,Pc(r)),i.buffers.color.setClear(Ao.r,Ao.g,Ao.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(f,v=1){o.set(f),h=v,g(o,h)},getClearAlpha:function(){return h},setClearAlpha:function(f){h=f,g(o,h)},render:function(f){let v=!1,_=m(f);_===null?g(o,h):_&&_.isColor&&(g(_,1),v=!0);let x=r.xr.getEnvironmentBlendMode();x==="additive"?i.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))},addToRenderList:function(f,v){let _=m(v);_&&(_.isCubeTexture||_.mapping===Cs)?(c===void 0&&(c=new se(new qe(1,1,1),new st({name:"BackgroundCubeMaterial",uniforms:Fn(Di.backgroundCube.uniforms),vertexShader:Di.backgroundCube.vertexShader,fragmentShader:Di.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(x,y,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),Bn.copy(v.backgroundRotation),Bn.x*=-1,Bn.y*=-1,Bn.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Bn.y*=-1,Bn.z*=-1),c.material.uniforms.envMap.value=_,c.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Rp.makeRotationFromEuler(Bn)),c.material.toneMapped=Ze.getTransfer(_.colorSpace)!==nt,d===_&&p===_.version&&u===r.toneMapping||(c.material.needsUpdate=!0,d=_,p=_.version,u=r.toneMapping),c.layers.enableAll(),f.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new se(new Ii(2,2),new st({name:"BackgroundMaterial",uniforms:Fn(Di.background.uniforms),vertexShader:Di.background.vertexShader,fragmentShader:Di.background.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=Ze.getTransfer(_.colorSpace)!==nt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),d===_&&p===_.version&&u===r.toneMapping||(l.material.needsUpdate=!0,d=_,p=_.version,u=r.toneMapping),l.layers.enableAll(),f.unshift(l,l.geometry,l.material,0,0,null))},dispose:function(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}}}function Ip(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},n=c(null),s=n,a=!1;function o(v){return r.bindVertexArray(v)}function l(v){return r.deleteVertexArray(v)}function c(v){let _=[],x=[],y=[];for(let E=0;E<t;E++)_[E]=0,x[E]=0,y[E]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:_,enabledAttributes:x,attributeDivisors:y,object:v,attributes:{},index:null}}function h(){let v=s.newAttributes;for(let _=0,x=v.length;_<x;_++)v[_]=0}function d(v){p(v,0)}function p(v,_){let x=s.newAttributes,y=s.enabledAttributes,E=s.attributeDivisors;x[v]=1,y[v]===0&&(r.enableVertexAttribArray(v),y[v]=1),E[v]!==_&&(r.vertexAttribDivisor(v,_),E[v]=_)}function u(){let v=s.newAttributes,_=s.enabledAttributes;for(let x=0,y=_.length;x<y;x++)_[x]!==v[x]&&(r.disableVertexAttribArray(x),_[x]=0)}function m(v,_,x,y,E,b,R){R===!0?r.vertexAttribIPointer(v,_,x,E,b):r.vertexAttribPointer(v,_,x,y,E,b)}function g(){f(),a=!0,s!==n&&(s=n,o(s.object))}function f(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:function(v,_,x,y,E){let b=!1,R=function(I,L,G){let H=G.wireframe===!0,O=i[I.id];O===void 0&&(O={},i[I.id]=O);let N=O[L.id];N===void 0&&(N={},O[L.id]=N);let U=N[H];return U===void 0&&(U=c(r.createVertexArray()),N[H]=U),U}(y,x,_);s!==R&&(s=R,o(s.object)),b=function(I,L,G,H){let O=s.attributes,N=L.attributes,U=0,k=G.getAttributes();for(let j in k)if(k[j].location>=0){let K=O[j],$=N[j];if($===void 0&&(j==="instanceMatrix"&&I.instanceMatrix&&($=I.instanceMatrix),j==="instanceColor"&&I.instanceColor&&($=I.instanceColor)),K===void 0||K.attribute!==$||$&&K.data!==$.data)return!0;U++}return s.attributesNum!==U||s.index!==H}(v,y,x,E),b&&function(I,L,G,H){let O={},N=L.attributes,U=0,k=G.getAttributes();for(let j in k)if(k[j].location>=0){let K=N[j];K===void 0&&(j==="instanceMatrix"&&I.instanceMatrix&&(K=I.instanceMatrix),j==="instanceColor"&&I.instanceColor&&(K=I.instanceColor));let $={};$.attribute=K,K&&K.data&&($.data=K.data),O[j]=$,U++}s.attributes=O,s.attributesNum=U,s.index=H}(v,y,x,E),E!==null&&e.update(E,r.ELEMENT_ARRAY_BUFFER),(b||a)&&(a=!1,function(I,L,G,H){h();let O=H.attributes,N=G.getAttributes(),U=L.defaultAttributeValues;for(let k in N){let j=N[k];if(j.location>=0){let K=O[k];if(K===void 0&&(k==="instanceMatrix"&&I.instanceMatrix&&(K=I.instanceMatrix),k==="instanceColor"&&I.instanceColor&&(K=I.instanceColor)),K!==void 0){let $=K.normalized,ue=K.itemSize,Me=e.get(K);if(Me===void 0)continue;let _e=Me.buffer,Ae=Me.type,ne=Me.bytesPerElement,ae=Ae===r.INT||Ae===r.UNSIGNED_INT||K.gpuType===_o;if(K.isInterleavedBufferAttribute){let re=K.data,Te=re.stride,Ue=K.offset;if(re.isInstancedInterleavedBuffer){for(let w=0;w<j.locationSize;w++)p(j.location+w,re.meshPerAttribute);I.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let w=0;w<j.locationSize;w++)d(j.location+w);r.bindBuffer(r.ARRAY_BUFFER,_e);for(let w=0;w<j.locationSize;w++)m(j.location+w,ue/j.locationSize,Ae,$,Te*ne,(Ue+ue/j.locationSize*w)*ne,ae)}else{if(K.isInstancedBufferAttribute){for(let re=0;re<j.locationSize;re++)p(j.location+re,K.meshPerAttribute);I.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let re=0;re<j.locationSize;re++)d(j.location+re);r.bindBuffer(r.ARRAY_BUFFER,_e);for(let re=0;re<j.locationSize;re++)m(j.location+re,ue/j.locationSize,Ae,$,ue*ne,ue/j.locationSize*re*ne,ae)}}else if(U!==void 0){let $=U[k];if($!==void 0)switch($.length){case 2:r.vertexAttrib2fv(j.location,$);break;case 3:r.vertexAttrib3fv(j.location,$);break;case 4:r.vertexAttrib4fv(j.location,$);break;default:r.vertexAttrib1fv(j.location,$)}}}}u()}(v,_,x,y),E!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(E).buffer))},reset:g,resetDefaultState:f,dispose:function(){g();for(let v in i){let _=i[v];for(let x in _){let y=_[x];for(let E in y)l(y[E].object),delete y[E];delete _[x]}delete i[v]}},releaseStatesOfGeometry:function(v){if(i[v.id]===void 0)return;let _=i[v.id];for(let x in _){let y=_[x];for(let E in y)l(y[E].object),delete y[E];delete _[x]}delete i[v.id]},releaseStatesOfProgram:function(v){for(let _ in i){let x=i[_];if(x[v.id]===void 0)continue;let y=x[v.id];for(let E in y)l(y[E].object),delete y[E];delete x[v.id]}},initAttributes:h,enableAttribute:d,disableUnusedAttributes:u}}function Lp(r,e,t){let i;function n(s,a,o){o!==0&&(r.drawArraysInstanced(i,s,a,o),t.update(a,i,o))}this.setMode=function(s){i=s},this.render=function(s,a){r.drawArrays(i,s,a),t.update(a,i,1)},this.renderInstances=n,this.renderMultiDraw=function(s,a,o){if(o===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,s,0,a,0,o);let l=0;for(let c=0;c<o;c++)l+=a[c];t.update(l,i,1)},this.renderMultiDrawInstances=function(s,a,o,l){if(o===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<s.length;h++)n(s[h],a[h],l[h]);else{c.multiDrawArraysInstancedWEBGL(i,s,0,a,0,l,0,o);let h=0;for(let d=0;d<o;d++)h+=a[d]*l[d];t.update(h,i,1)}}}function Up(r,e,t,i){let n;function s(p){if(p==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";p="mediump"}return p==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=t.precision!==void 0?t.precision:"highp",o=s(a);o!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",o,"instead."),a=o);let l=t.logarithmicDepthBuffer===!0,c=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),d=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS);return{isWebGL2:!0,getMaxAnisotropy:function(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){let p=e.get("EXT_texture_filter_anisotropic");n=r.getParameter(p.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n},getMaxPrecision:s,textureFormatReadable:function(p){return p===gi||i.convert(p)===r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT)},textureTypeReadable:function(p){let u=p===Pr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(p!==Ui&&i.convert(p)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&p!==fi&&!u)},precision:a,logarithmicDepthBuffer:l,reversedDepthBuffer:c,maxTextures:h,maxVertexTextures:d,maxTextureSize:r.getParameter(r.MAX_TEXTURE_SIZE),maxCubemapSize:r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),maxAttributes:r.getParameter(r.MAX_VERTEX_ATTRIBS),maxVertexUniforms:r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),maxVaryings:r.getParameter(r.MAX_VARYING_VECTORS),maxFragmentUniforms:r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),vertexTextures:d>0,maxSamples:r.getParameter(r.MAX_SAMPLES)}}function Dp(r){let e=this,t=null,i=0,n=!1,s=!1,a=new bi,o=new Le,l={value:null,needsUpdate:!1};function c(h,d,p,u){let m=h!==null?h.length:0,g=null;if(m!==0){if(g=l.value,u!==!0||g===null){let f=p+4*m,v=d.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<f)&&(g=new Float32Array(f));for(let _=0,x=p;_!==m;++_,x+=4)a.copy(h[_]).applyMatrix4(v,o),a.normal.toArray(g,x),g[x+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,g}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let p=h.length!==0||d||i!==0||n;return n=d,i=h.length,p},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=c(h,d,0)},this.setState=function(h,d,p){let u=h.clippingPlanes,m=h.clipIntersection,g=h.clipShadows,f=r.get(h);if(!n||u===null||u.length===0||s&&!g)s?c(null):function(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}();else{let v=s?0:i,_=4*v,x=f.clippingState||null;l.value=x,x=c(u,d,_,p);for(let y=0;y!==_;++y)x[y]=t[y];f.clippingState=x,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=v}}}function Np(r){let e=new WeakMap;function t(n,s){return s===fo?n.mapping=Cr:s===go&&(n.mapping=Ln),n}function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping;if(s===fo||s===go){if(e.has(n))return t(e.get(n).texture,n.mapping);{let a=n.image;if(a&&a.height>0){let o=new Ra(a.height);return o.fromEquirectangularTexture(r,n),e.set(n,o),n.addEventListener("dispose",i),t(o.texture,n.mapping)}return null}}}return n},dispose:function(){e=new WeakMap}}}var Xu=[.125,.215,.35,.446,.526,.582],Ls=20,Dc=new ws,ju=new ve,Nc=null,Fc=0,Bc=0,Oc=!1,zn=(1+Math.sqrt(5))/2,Lr=1/zn,qu=[new S(-zn,Lr,0),new S(zn,Lr,0),new S(-Lr,0,zn),new S(Lr,0,zn),new S(0,zn,-Lr),new S(0,zn,Lr),new S(-1,1,-1),new S(1,1,-1),new S(-1,1,1),new S(1,1,1)],Fp=new S,Dr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,n=100,s={}){let{size:a=256,position:o=Fp}=s;Nc=this._renderer.getRenderTarget(),Fc=this._renderer.getActiveCubeFace(),Bc=this._renderer.getActiveMipmapLevel(),Oc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,n,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ju(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Nc,Fc,Bc),this._renderer.xr.enabled=Oc,e.scissorTest=!1,Co(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Cr||e.mapping===Ln?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Nc=this._renderer.getRenderTarget(),Fc=this._renderer.getActiveCubeFace(),Bc=this._renderer.getActiveMipmapLevel(),Oc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Ci,minFilter:Ci,generateMipmaps:!1,type:Pr,format:gi,colorSpace:An,depthBuffer:!1},n=Yu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Yu(e,t,i);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=function(a){let o=[],l=[],c=[],h=a,d=a-4+1+Xu.length;for(let p=0;p<d;p++){let u=Math.pow(2,h);l.push(u);let m=1/u;p>a-4?m=Xu[p-a+4-1]:p===0&&(m=0),c.push(m);let g=1/(u-2),f=-g,v=1+g,_=[f,f,v,f,v,v,f,f,v,v,f,v],x=6,y=6,E=3,b=2,R=1,I=new Float32Array(E*y*x),L=new Float32Array(b*y*x),G=new Float32Array(R*y*x);for(let O=0;O<x;O++){let N=O%3*2/3-1,U=O>2?0:-1,k=[N,U,0,N+2/3,U,0,N+2/3,U+1,0,N,U,0,N+2/3,U+1,0,N,U+1,0];I.set(k,E*y*O),L.set(_,b*y*O);let j=[O,O,O,O,O,O];G.set(j,R*y*O)}let H=new De;H.setAttribute("position",new ke(I,E)),H.setAttribute("uv",new ke(L,b)),H.setAttribute("faceIndex",new ke(G,R)),o.push(H),h>4&&h--}return{lodPlanes:o,sizeLods:l,sigmas:c}}(s)),this._blurMaterial=function(a,o,l){let c=new Float32Array(Ls),h=new S(0,1,0);return new st({name:"SphericalGaussianBlur",defines:{n:Ls,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:Yc(),fragmentShader:`

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
		`,blending:mn,depthTest:!1,depthWrite:!1})}(s,e,t)}return n}_compileMaterial(e){let t=new se(this._lodPlanes[0],e);this._renderer.compile(t,Dc)}_sceneToCubeUV(e,t,i,n,s){let a=new It(90,1,t,i),o=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],c=this._renderer,h=c.autoClear,d=c.toneMapping;c.getClearColor(ju),c.toneMapping=Ji,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(n),c.clearDepth(),c.setRenderTarget(null));let p=new rt({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1}),u=new se(new qe,p),m=!1,g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,m=!0):(p.color.copy(ju),m=!0);for(let f=0;f<6;f++){let v=f%3;v===0?(a.up.set(0,o[f],0),a.position.set(s.x,s.y,s.z),a.lookAt(s.x+l[f],s.y,s.z)):v===1?(a.up.set(0,0,o[f]),a.position.set(s.x,s.y,s.z),a.lookAt(s.x,s.y+l[f],s.z)):(a.up.set(0,o[f],0),a.position.set(s.x,s.y,s.z),a.lookAt(s.x,s.y,s.z+l[f]));let _=this._cubeSize;Co(n,v*_,f>2?_:0,_,_),c.setRenderTarget(n),m&&c.render(u,a),c.render(e,a)}u.geometry.dispose(),u.material.dispose(),c.toneMapping=d,c.autoClear=h,e.background=g}_textureToCubeUV(e,t){let i=this._renderer,n=e.mapping===Cr||e.mapping===Ln;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ju()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zu());let s=n?this._cubemapMaterial:this._equirectMaterial,a=new se(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let o=this._cubeSize;Co(t,0,0,3*o,2*o),i.setRenderTarget(t),i.render(a,Dc)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let n=this._lodPlanes.length;for(let s=1;s<n;s++){let a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=qu[(n-s-1)%qu.length];this._blur(e,s-1,s,a,o)}t.autoClear=i}_blur(e,t,i,n,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,n,"latitudinal",s),this._halfBlur(a,e,i,i,n,"longitudinal",s)}_halfBlur(e,t,i,n,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new se(this._lodPlanes[n],c),d=c.uniforms,p=this._sizeLods[i]-1,u=isFinite(s)?Math.PI/(2*p):2*Math.PI/39,m=s/u,g=isFinite(s)?1+Math.floor(3*m):Ls;g>Ls&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to 20`);let f=[],v=0;for(let y=0;y<Ls;++y){let E=y/m,b=Math.exp(-E*E/2);f.push(b),y===0?v+=b:y<g&&(v+=2*b)}for(let y=0;y<f.length;y++)f[y]=f[y]/v;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:_}=this;d.dTheta.value=u,d.mipInt.value=_-i;let x=this._sizeLods[n];Co(t,3*x*(n>_-4?n-_+4:0),4*(this._cubeSize-x),3*x,2*x),l.setRenderTarget(t),l.render(h,Dc)}};function Yu(r,e,t){let i=new Ri(r,e,t);return i.texture.mapping=Cs,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Co(r,e,t,i,n){r.viewport.set(e,t,i,n),r.scissor.set(e,t,i,n)}function Zu(){return new st({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Yc(),fragmentShader:`

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
		`,blending:mn,depthTest:!1,depthWrite:!1})}function Ju(){return new st({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:mn,depthTest:!1,depthWrite:!1})}function Yc(){return`

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
	`}function Bp(r){let e=new WeakMap,t=null;function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping,a=s===fo||s===go,o=s===Cr||s===Ln;if(a||o){let l=e.get(n),c=l!==void 0?l.texture.pmremVersion:0;if(n.isRenderTargetTexture&&n.pmremVersion!==c)return t===null&&(t=new Dr(r)),l=a?t.fromEquirectangular(n,l):t.fromCubemap(n,l),l.texture.pmremVersion=n.pmremVersion,e.set(n,l),l.texture;if(l!==void 0)return l.texture;{let h=n.image;return a&&h&&h.height>0||o&&h&&function(d){let p=0,u=6;for(let m=0;m<u;m++)d[m]!==void 0&&p++;return p===u}(h)?(t===null&&(t=new Dr(r)),l=a?t.fromEquirectangular(n):t.fromCubemap(n),l.texture.pmremVersion=n.pmremVersion,e.set(n,l),n.addEventListener("dispose",i),l.texture):null}}}return n},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function Op(r){let e={};function t(i){if(e[i]!==void 0)return e[i];let n;switch(i){case"WEBGL_depth_texture":n=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=r.getExtension(i)}return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let n=t(i);return n===null&&mr("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function zp(r,e,t,i){let n={},s=new WeakMap;function a(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let d in c.attributes)e.remove(c.attributes[d]);c.removeEventListener("dispose",a),delete n[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),i.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function o(l){let c=[],h=l.index,d=l.attributes.position,p=0;if(h!==null){let g=h.array;p=h.version;for(let f=0,v=g.length;f<v;f+=3){let _=g[f+0],x=g[f+1],y=g[f+2];c.push(_,x,x,y,y,_)}}else{if(d===void 0)return;{let g=d.array;p=d.version;for(let f=0,v=g.length/3-1;f<v;f+=3){let _=f+0,x=f+1,y=f+2;c.push(_,x,x,y,y,_)}}}let u=new(Rc(c)?os:as)(c,1);u.version=p;let m=s.get(l);m&&e.remove(m),s.set(l,u)}return{get:function(l,c){return n[c.id]===!0||(c.addEventListener("dispose",a),n[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let h in c)e.update(c[h],r.ARRAY_BUFFER)},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&o(l)}else o(l);return s.get(l)}}}function Gp(r,e,t){let i,n,s;function a(o,l,c){c!==0&&(r.drawElementsInstanced(i,l,n,o*s,c),t.update(l,i,c))}this.setMode=function(o){i=o},this.setIndex=function(o){n=o.type,s=o.bytesPerElement},this.render=function(o,l){r.drawElements(i,l,n,o*s),t.update(l,i,1)},this.renderInstances=a,this.renderMultiDraw=function(o,l,c){if(c===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,l,0,n,o,0,c);let h=0;for(let d=0;d<c;d++)h+=l[d];t.update(h,i,1)},this.renderMultiDrawInstances=function(o,l,c,h){if(c===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let p=0;p<o.length;p++)a(o[p]/s,l[p],h[p]);else{d.multiDrawElementsInstancedWEBGL(i,l,0,n,o,0,h,0,c);let p=0;for(let u=0;u<c;u++)p+=l[u]*h[u];t.update(p,i,1)}}}function kp(r){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,i,n){switch(e.calls++,i){case r.TRIANGLES:e.triangles+=n*(t/3);break;case r.LINES:e.lines+=n*(t/2);break;case r.LINE_STRIP:e.lines+=n*(t-1);break;case r.LINE_LOOP:e.lines+=n*t;break;case r.POINTS:e.points+=n*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",i)}}}}function Vp(r,e,t){let i=new WeakMap,n=new Je;return{update:function(s,a,o){let l=s.morphTargetInfluences,c=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=c!==void 0?c.length:0,d=i.get(a);if(d===void 0||d.count!==h){let I=function(){b.dispose(),i.delete(a),a.removeEventListener("dispose",I)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,u=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],_=0;p===!0&&(_=1),u===!0&&(_=2),m===!0&&(_=3);let x=a.attributes.position.count*_,y=1;x>e.maxTextureSize&&(y=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let E=new Float32Array(x*y*4*h),b=new rs(E,x,y,h);b.type=fi,b.needsUpdate=!0;let R=4*_;for(let L=0;L<h;L++){let G=g[L],H=f[L],O=v[L],N=x*y*4*L;for(let U=0;U<G.count;U++){let k=U*R;p===!0&&(n.fromBufferAttribute(G,U),E[N+k+0]=n.x,E[N+k+1]=n.y,E[N+k+2]=n.z,E[N+k+3]=0),u===!0&&(n.fromBufferAttribute(H,U),E[N+k+4]=n.x,E[N+k+5]=n.y,E[N+k+6]=n.z,E[N+k+7]=0),m===!0&&(n.fromBufferAttribute(O,U),E[N+k+8]=n.x,E[N+k+9]=n.y,E[N+k+10]=n.z,E[N+k+11]=O.itemSize===4?n.w:1)}}d={count:h,texture:b,size:new J(x,y)},i.set(a,d),a.addEventListener("dispose",I)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)o.getUniforms().setValue(r,"morphTexture",s.morphTexture,t);else{let p=0;for(let m=0;m<l.length;m++)p+=l[m];let u=a.morphTargetsRelative?1:1-p;o.getUniforms().setValue(r,"morphTargetBaseInfluence",u),o.getUniforms().setValue(r,"morphTargetInfluences",l)}o.getUniforms().setValue(r,"morphTargetsTexture",d.texture,t),o.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}}}function Hp(r,e,t,i){let n=new WeakMap;function s(a){let o=a.target;o.removeEventListener("dispose",s),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:function(a){let o=i.render.frame,l=a.geometry,c=e.get(a,l);if(n.get(c)!==o&&(e.update(c),n.set(c,o)),a.isInstancedMesh&&(a.hasEventListener("dispose",s)===!1&&a.addEventListener("dispose",s),n.get(a)!==o&&(t.update(a.instanceMatrix,r.ARRAY_BUFFER),a.instanceColor!==null&&t.update(a.instanceColor,r.ARRAY_BUFFER),n.set(a,o))),a.isSkinnedMesh){let h=a.skeleton;n.get(h)!==o&&(h.update(),n.set(h,o))}return c},dispose:function(){n=new WeakMap}}}var fd=new Bt,Ku=new hs(1,1),gd=new rs,vd=new Aa,_d=new ls,$u=[],Qu=[],ed=new Float32Array(16),td=new Float32Array(9),id=new Float32Array(4);function Nr(r,e,t){let i=r[0];if(i<=0||i>0)return r;let n=e*t,s=$u[n];if(s===void 0&&(s=new Float32Array(n),$u[n]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function bt(r,e){if(r.length!==e.length)return!1;for(let t=0,i=r.length;t<i;t++)if(r[t]!==e[t])return!1;return!0}function Tt(r,e){for(let t=0,i=e.length;t<i;t++)r[t]=e[t]}function Io(r,e){let t=Qu[e];t===void 0&&(t=new Int32Array(e),Qu[e]=t);for(let i=0;i!==e;++i)t[i]=r.allocateTextureUnit();return t}function Wp(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Xp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;r.uniform2fv(this.addr,e),Tt(t,e)}}function jp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(bt(t,e))return;r.uniform3fv(this.addr,e),Tt(t,e)}}function qp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;r.uniform4fv(this.addr,e),Tt(t,e)}}function Yp(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(bt(t,i))return;id.set(i),r.uniformMatrix2fv(this.addr,!1,id),Tt(t,i)}}function Zp(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(bt(t,i))return;td.set(i),r.uniformMatrix3fv(this.addr,!1,td),Tt(t,i)}}function Jp(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(bt(t,i))return;ed.set(i),r.uniformMatrix4fv(this.addr,!1,ed),Tt(t,i)}}function Kp(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function $p(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;r.uniform2iv(this.addr,e),Tt(t,e)}}function Qp(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;r.uniform3iv(this.addr,e),Tt(t,e)}}function em(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;r.uniform4iv(this.addr,e),Tt(t,e)}}function tm(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function im(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;r.uniform2uiv(this.addr,e),Tt(t,e)}}function nm(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;r.uniform3uiv(this.addr,e),Tt(t,e)}}function rm(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;r.uniform4uiv(this.addr,e),Tt(t,e)}}function sm(r,e,t){let i=this.cache,n=t.allocateTextureUnit(),s;i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),this.type===r.SAMPLER_2D_SHADOW?(Ku.compareFunction=Ac,s=Ku):s=fd,t.setTexture2D(e||s,n)}function am(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||vd,n)}function om(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||_d,n)}function lm(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||gd,n)}function cm(r,e){r.uniform1fv(this.addr,e)}function hm(r,e){let t=Nr(e,this.size,2);r.uniform2fv(this.addr,t)}function um(r,e){let t=Nr(e,this.size,3);r.uniform3fv(this.addr,t)}function dm(r,e){let t=Nr(e,this.size,4);r.uniform4fv(this.addr,t)}function pm(r,e){let t=Nr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function mm(r,e){let t=Nr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function fm(r,e){let t=Nr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function gm(r,e){r.uniform1iv(this.addr,e)}function vm(r,e){r.uniform2iv(this.addr,e)}function _m(r,e){r.uniform3iv(this.addr,e)}function xm(r,e){r.uniform4iv(this.addr,e)}function ym(r,e){r.uniform1uiv(this.addr,e)}function Mm(r,e){r.uniform2uiv(this.addr,e)}function Sm(r,e){r.uniform3uiv(this.addr,e)}function bm(r,e){r.uniform4uiv(this.addr,e)}function Tm(r,e,t){let i=this.cache,n=e.length,s=Io(t,n);bt(i,s)||(r.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==n;++a)t.setTexture2D(e[a]||fd,s[a])}function wm(r,e,t){let i=this.cache,n=e.length,s=Io(t,n);bt(i,s)||(r.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||vd,s[a])}function Em(r,e,t){let i=this.cache,n=e.length,s=Io(t,n);bt(i,s)||(r.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||_d,s[a])}function Am(r,e,t){let i=this.cache,n=e.length,s=Io(t,n);bt(i,s)||(r.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||gd,s[a])}var Gc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=function(n){switch(n){case 5126:return Wp;case 35664:return Xp;case 35665:return jp;case 35666:return qp;case 35674:return Yp;case 35675:return Zp;case 35676:return Jp;case 5124:case 35670:return Kp;case 35667:case 35671:return $p;case 35668:case 35672:return Qp;case 35669:case 35673:return em;case 5125:return tm;case 36294:return im;case 36295:return nm;case 36296:return rm;case 35678:case 36198:case 36298:case 36306:case 35682:return sm;case 35679:case 36299:case 36307:return am;case 35680:case 36300:case 36308:case 36293:return om;case 36289:case 36303:case 36311:case 36292:return lm}}(t.type)}},kc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=function(n){switch(n){case 5126:return cm;case 35664:return hm;case 35665:return um;case 35666:return dm;case 35674:return pm;case 35675:return mm;case 35676:return fm;case 5124:case 35670:return gm;case 35667:case 35671:return vm;case 35668:case 35672:return _m;case 35669:case 35673:return xm;case 5125:return ym;case 36294:return Mm;case 36295:return Sm;case 36296:return bm;case 35678:case 36198:case 36298:case 36306:case 35682:return Tm;case 35679:case 36299:case 36307:return wm;case 35680:case 36300:case 36308:case 36293:return Em;case 36289:case 36303:case 36311:case 36292:return Am}}(t.type)}},Vc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let n=this.seq;for(let s=0,a=n.length;s!==a;++s){let o=n[s];o.setValue(e,t[o.id],i)}}},zc=/(\w+)(\])?(\[|\.)?/g;function nd(r,e){r.seq.push(e),r.map[e.id]=e}function Cm(r,e,t){let i=r.name,n=i.length;for(zc.lastIndex=0;;){let s=zc.exec(i),a=zc.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o|=0),c===void 0||c==="["&&a+2===n){nd(t,c===void 0?new Gc(o,r,e):new kc(o,r,e));break}{let h=t.map[o];h===void 0&&(h=new Vc(o),nd(t,h)),t=h}}}var Ur=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){let s=e.getActiveUniform(t,n);Cm(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,i,n){let s=this.map[t];s!==void 0&&s.setValue(e,i,n)}setOptional(e,t,i){let n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){let i=[];for(let n=0,s=e.length;n!==s;++n){let a=e[n];a.id in t&&i.push(a)}return i}};function rd(r,e,t){let i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),i}var Rm=0,sd=new Le;function ad(r,e,t){let i=r.getShaderParameter(e,r.COMPILE_STATUS),n=(r.getShaderInfoLog(e)||"").trim();if(i&&n==="")return"";let s=/ERROR: 0:(\d+)/.exec(n);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+n+`

`+function(o,l){let c=o.split(`
`),h=[],d=Math.max(l-6,0),p=Math.min(l+6,c.length);for(let u=d;u<p;u++){let m=u+1;h.push(`${m===l?">":" "} ${m}: ${c[u]}`)}return h.join(`
`)}(r.getShaderSource(e),a)}return n}function Pm(r,e){let t=function(i){Ze._getMatrix(sd,Ze.workingColorSpace,i);let n=`mat3( ${sd.elements.map(s=>s.toFixed(4))} )`;switch(Ze.getTransfer(i)){case is:return[n,"LinearTransferOETF"];case nt:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[n,"LinearTransferOETF"]}}(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Im(r,e){let t;switch(e){case gu:t="Linear";break;case vu:t="Reinhard";break;case _u:t="Cineon";break;case mo:t="ACESFilmic";break;case yu:t="AgX";break;case Mu:t="Neutral";break;case xu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ro=new S;function Lm(){return Ze.getLuminanceCoefficients(Ro),["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${Ro.x.toFixed(4)}, ${Ro.y.toFixed(4)}, ${Ro.z.toFixed(4)} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Us(r){return r!==""}function od(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ld(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Um=/^[ \t]*#include +<([\w\d./]+)>/gm;function Hc(r){return r.replace(Um,Nm)}var Dm=new Map;function Nm(r,e){let t=Fe[e];if(t===void 0){let i=Dm.get(e);if(i===void 0)throw new Error("Can not resolve #include <"+e+">");t=Fe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i)}return Hc(t)}var Fm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cd(r){return r.replace(Fm,Bm)}function Bm(r,e,t,i){let n="";for(let s=parseInt(e);s<parseInt(t);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function hd(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}function Om(r,e,t,i){let n=r.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=function(H){let O="SHADOWMAP_TYPE_BASIC";return H.shadowMapType===Vl?O="SHADOWMAP_TYPE_PCF":H.shadowMapType===so?O="SHADOWMAP_TYPE_PCF_SOFT":H.shadowMapType===Li&&(O="SHADOWMAP_TYPE_VSM"),O}(t),c=function(H){let O="ENVMAP_TYPE_CUBE";if(H.envMap)switch(H.envMapMode){case Cr:case Ln:O="ENVMAP_TYPE_CUBE";break;case Cs:O="ENVMAP_TYPE_CUBE_UV"}return O}(t),h=function(H){let O="ENVMAP_MODE_REFLECTION";return H.envMap&&H.envMapMode===Ln&&(O="ENVMAP_MODE_REFRACTION"),O}(t),d=function(H){let O="ENVMAP_BLENDING_NONE";if(H.envMap)switch(H.combine){case pu:O="ENVMAP_BLENDING_MULTIPLY";break;case mu:O="ENVMAP_BLENDING_MIX";break;case fu:O="ENVMAP_BLENDING_ADD"}return O}(t),p=function(H){let O=H.envMapCubeUVHeight;if(O===null)return null;let N=Math.log2(O)-2,U=1/O;return{texelWidth:1/(3*Math.max(Math.pow(2,N),112)),texelHeight:U,maxMip:N}}(t),u=function(H){return[H.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",H.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Us).join(`
`)}(t),m=function(H){let O=[];for(let N in H){let U=H[N];U!==!1&&O.push("#define "+N+" "+U)}return O.join(`
`)}(s),g=n.createProgram(),f,v,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Us).join(`
`),f.length>0&&(f+=`
`),v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Us).join(`
`),v.length>0&&(v+=`
`)):(f=[hd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Us).join(`
`),v=[hd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ji?"#define TONE_MAPPING":"",t.toneMapping!==Ji?Fe.tonemapping_pars_fragment:"",t.toneMapping!==Ji?Im("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Fe.colorspace_pars_fragment,Pm("linearToOutputTexel",t.outputColorSpace),Lm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Us).join(`
`)),a=Hc(a),a=od(a,t),a=ld(a,t),o=Hc(o),o=od(o,t),o=ld(o,t),a=cd(a),o=cd(o),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,f=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,v=["#define varying in",t.glslVersion===Cc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Cc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);let x=_+f+a,y=_+v+o,E=rd(n,n.VERTEX_SHADER,x),b=rd(n,n.FRAGMENT_SHADER,y);function R(H){if(r.debug.checkShaderErrors){let O=n.getProgramInfoLog(g)||"",N=n.getShaderInfoLog(E)||"",U=n.getShaderInfoLog(b)||"",k=O.trim(),j=N.trim(),K=U.trim(),$=!0,ue=!0;if(n.getProgramParameter(g,n.LINK_STATUS)===!1)if($=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,g,E,b);else{let Me=ad(n,E,"vertex"),_e=ad(n,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(g,n.VALIDATE_STATUS)+`

Material Name: `+H.name+`
Material Type: `+H.type+`

Program Info Log: `+k+`
`+Me+`
`+_e)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):j!==""&&K!==""||(ue=!1);ue&&(H.diagnostics={runnable:$,programLog:k,vertexShader:{log:j,prefix:f},fragmentShader:{log:K,prefix:v}})}n.deleteShader(E),n.deleteShader(b),I=new Ur(n,g),L=function(O,N){let U={},k=O.getProgramParameter(N,O.ACTIVE_ATTRIBUTES);for(let j=0;j<k;j++){let K=O.getActiveAttrib(N,j),$=K.name,ue=1;K.type===O.FLOAT_MAT2&&(ue=2),K.type===O.FLOAT_MAT3&&(ue=3),K.type===O.FLOAT_MAT4&&(ue=4),U[$]={type:K.type,location:O.getAttribLocation(N,$),locationSize:ue}}return U}(n,g)}let I,L;n.attachShader(g,E),n.attachShader(g,b),t.index0AttributeName!==void 0?n.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(g,0,"position"),n.linkProgram(g),this.getUniforms=function(){return I===void 0&&R(this),I},this.getAttributes=function(){return L===void 0&&R(this),L};let G=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return G===!1&&(G=n.getProgramParameter(g,37297)),G},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Rm++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=E,this.fragmentShader=b,this}var zm=0,Wc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Xc(e),t.set(e,i)),i}},Xc=class{constructor(e){this.id=zm++,this.code=e,this.usedTimes=0}};function Gm(r,e,t,i,n,s,a){let o=new ss,l=new Wc,c=new Set,h=[],d=n.logarithmicDepthBuffer,p=n.vertexTextures,u=n.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(f){return c.add(f),f===0?"uv":`uv${f}`}return{getParameters:function(f,v,_,x,y){let E=x.fog,b=y.geometry,R=f.isMeshStandardMaterial?x.environment:null,I=(f.isMeshStandardMaterial?t:e).get(f.envMap||R),L=I&&I.mapping===Cs?I.image.height:null,G=m[f.type];f.precision!==null&&(u=n.getMaxPrecision(f.precision),u!==f.precision&&console.warn("THREE.WebGLProgram.getParameters:",f.precision,"not supported, using",u,"instead."));let H=b.morphAttributes.position||b.morphAttributes.normal||b.morphAttributes.color,O=H!==void 0?H.length:0,N,U,k,j,K=0;if(b.morphAttributes.position!==void 0&&(K=1),b.morphAttributes.normal!==void 0&&(K=2),b.morphAttributes.color!==void 0&&(K=3),G){let Dt=Di[G];N=Dt.vertexShader,U=Dt.fragmentShader}else N=f.vertexShader,U=f.fragmentShader,l.update(f),k=l.getVertexShaderID(f),j=l.getFragmentShaderID(f);let $=r.getRenderTarget(),ue=r.state.buffers.depth.getReversed(),Me=y.isInstancedMesh===!0,_e=y.isBatchedMesh===!0,Ae=!!f.map,ne=!!f.matcap,ae=!!I,re=!!f.aoMap,Te=!!f.lightMap,Ue=!!f.bumpMap,w=!!f.normalMap,T=!!f.displacementMap,z=!!f.emissiveMap,D=!!f.metalnessMap,M=!!f.roughnessMap,C=f.anisotropy>0,B=f.clearcoat>0,P=f.dispersion>0,Y=f.iridescence>0,V=f.sheen>0,W=f.transmission>0,te=C&&!!f.anisotropyMap,le=B&&!!f.clearcoatMap,ie=B&&!!f.clearcoatNormalMap,de=B&&!!f.clearcoatRoughnessMap,xe=Y&&!!f.iridescenceMap,be=Y&&!!f.iridescenceThicknessMap,Ve=V&&!!f.sheenColorMap,Ke=V&&!!f.sheenRoughnessMap,$e=!!f.specularMap,ce=!!f.specularColorMap,we=!!f.specularIntensityMap,Ge=W&&!!f.transmissionMap,Ut=W&&!!f.thicknessMap,me=!!f.gradientMap,Qe=!!f.alphaMap,He=f.alphaTest>0,si=!!f.alphaHash,Oi=!!f.extensions,F=Ji;f.toneMapped&&($!==null&&$.isXRRenderTarget!==!0||(F=r.toneMapping));let wt={shaderID:G,shaderType:f.type,shaderName:f.name,vertexShader:N,fragmentShader:U,defines:f.defines,customVertexShaderID:k,customFragmentShaderID:j,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:u,batching:_e,batchingColor:_e&&y._colorsTexture!==null,instancing:Me,instancingColor:Me&&y.instanceColor!==null,instancingMorph:Me&&y.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:$===null?r.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:An,alphaToCoverage:!!f.alphaToCoverage,map:Ae,matcap:ne,envMap:ae,envMapMode:ae&&I.mapping,envMapCubeUVHeight:L,aoMap:re,lightMap:Te,bumpMap:Ue,normalMap:w,displacementMap:p&&T,emissiveMap:z,normalMapObjectSpace:w&&f.normalMapType===Cu,normalMapTangentSpace:w&&f.normalMapType===Au,metalnessMap:D,roughnessMap:M,anisotropy:C,anisotropyMap:te,clearcoat:B,clearcoatMap:le,clearcoatNormalMap:ie,clearcoatRoughnessMap:de,dispersion:P,iridescence:Y,iridescenceMap:xe,iridescenceThicknessMap:be,sheen:V,sheenColorMap:Ve,sheenRoughnessMap:Ke,specularMap:$e,specularColorMap:ce,specularIntensityMap:we,transmission:W,transmissionMap:Ge,thicknessMap:Ut,gradientMap:me,opaque:f.transparent===!1&&f.blending===Ot&&f.alphaToCoverage===!1,alphaMap:Qe,alphaTest:He,alphaHash:si,combine:f.combine,mapUv:Ae&&g(f.map.channel),aoMapUv:re&&g(f.aoMap.channel),lightMapUv:Te&&g(f.lightMap.channel),bumpMapUv:Ue&&g(f.bumpMap.channel),normalMapUv:w&&g(f.normalMap.channel),displacementMapUv:T&&g(f.displacementMap.channel),emissiveMapUv:z&&g(f.emissiveMap.channel),metalnessMapUv:D&&g(f.metalnessMap.channel),roughnessMapUv:M&&g(f.roughnessMap.channel),anisotropyMapUv:te&&g(f.anisotropyMap.channel),clearcoatMapUv:le&&g(f.clearcoatMap.channel),clearcoatNormalMapUv:ie&&g(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&g(f.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&g(f.iridescenceMap.channel),iridescenceThicknessMapUv:be&&g(f.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&g(f.sheenColorMap.channel),sheenRoughnessMapUv:Ke&&g(f.sheenRoughnessMap.channel),specularMapUv:$e&&g(f.specularMap.channel),specularColorMapUv:ce&&g(f.specularColorMap.channel),specularIntensityMapUv:we&&g(f.specularIntensityMap.channel),transmissionMapUv:Ge&&g(f.transmissionMap.channel),thicknessMapUv:Ut&&g(f.thicknessMap.channel),alphaMapUv:Qe&&g(f.alphaMap.channel),vertexTangents:!!b.attributes.tangent&&(w||C),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!b.attributes.color&&b.attributes.color.itemSize===4,pointsUvs:y.isPoints===!0&&!!b.attributes.uv&&(Ae||Qe),fog:!!E,useFog:f.fog===!0,fogExp2:!!E&&E.isFogExp2,flatShading:f.flatShading===!0&&f.wireframe===!1,sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ue,skinning:y.isSkinnedMesh===!0,morphTargets:b.morphAttributes.position!==void 0,morphNormals:b.morphAttributes.normal!==void 0,morphColors:b.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:K,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:f.dithering,shadowMapEnabled:r.shadowMap.enabled&&_.length>0,shadowMapType:r.shadowMap.type,toneMapping:F,decodeVideoTexture:Ae&&f.map.isVideoTexture===!0&&Ze.getTransfer(f.map.colorSpace)===nt,decodeVideoTextureEmissive:z&&f.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(f.emissiveMap.colorSpace)===nt,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===vt,flipSided:f.side===Vt,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionClipCullDistance:Oi&&f.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Oi&&f.extensions.multiDraw===!0||_e)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()};return wt.vertexUv1s=c.has(1),wt.vertexUv2s=c.has(2),wt.vertexUv3s=c.has(3),c.clear(),wt},getProgramCacheKey:function(f){let v=[];if(f.shaderID?v.push(f.shaderID):(v.push(f.customVertexShaderID),v.push(f.customFragmentShaderID)),f.defines!==void 0)for(let _ in f.defines)v.push(_),v.push(f.defines[_]);return f.isRawShaderMaterial===!1&&(function(_,x){_.push(x.precision),_.push(x.outputColorSpace),_.push(x.envMapMode),_.push(x.envMapCubeUVHeight),_.push(x.mapUv),_.push(x.alphaMapUv),_.push(x.lightMapUv),_.push(x.aoMapUv),_.push(x.bumpMapUv),_.push(x.normalMapUv),_.push(x.displacementMapUv),_.push(x.emissiveMapUv),_.push(x.metalnessMapUv),_.push(x.roughnessMapUv),_.push(x.anisotropyMapUv),_.push(x.clearcoatMapUv),_.push(x.clearcoatNormalMapUv),_.push(x.clearcoatRoughnessMapUv),_.push(x.iridescenceMapUv),_.push(x.iridescenceThicknessMapUv),_.push(x.sheenColorMapUv),_.push(x.sheenRoughnessMapUv),_.push(x.specularMapUv),_.push(x.specularColorMapUv),_.push(x.specularIntensityMapUv),_.push(x.transmissionMapUv),_.push(x.thicknessMapUv),_.push(x.combine),_.push(x.fogExp2),_.push(x.sizeAttenuation),_.push(x.morphTargetsCount),_.push(x.morphAttributeCount),_.push(x.numDirLights),_.push(x.numPointLights),_.push(x.numSpotLights),_.push(x.numSpotLightMaps),_.push(x.numHemiLights),_.push(x.numRectAreaLights),_.push(x.numDirLightShadows),_.push(x.numPointLightShadows),_.push(x.numSpotLightShadows),_.push(x.numSpotLightShadowsWithMaps),_.push(x.numLightProbes),_.push(x.shadowMapType),_.push(x.toneMapping),_.push(x.numClippingPlanes),_.push(x.numClipIntersection),_.push(x.depthPacking)}(v,f),function(_,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),_.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),_.push(o.mask)}(v,f),v.push(r.outputColorSpace)),v.push(f.customProgramCacheKey),v.join()},getUniforms:function(f){let v=m[f.type],_;if(v){let x=Di[v];_=zu.clone(x.uniforms)}else _=f.uniforms;return _},acquireProgram:function(f,v){let _;for(let x=0,y=h.length;x<y;x++){let E=h[x];if(E.cacheKey===v){_=E,++_.usedTimes;break}}return _===void 0&&(_=new Om(r,v,f,s),h.push(_)),_},releaseProgram:function(f){if(--f.usedTimes===0){let v=h.indexOf(f);h[v]=h[h.length-1],h.pop(),f.destroy()}},releaseShaderCache:function(f){l.remove(f)},programs:h,dispose:function(){l.dispose()}}}function km(){let r=new WeakMap;return{has:function(e){return r.has(e)},get:function(e){let t=r.get(e);return t===void 0&&(t={},r.set(e,t)),t},remove:function(e){r.delete(e)},update:function(e,t,i){r.get(e)[t]=i},dispose:function(){r=new WeakMap}}}function Vm(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function ud(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function dd(){let r=[],e=0,t=[],i=[],n=[];function s(a,o,l,c,h,d){let p=r[e];return p===void 0?(p={id:a.id,object:a,geometry:o,material:l,groupOrder:c,renderOrder:a.renderOrder,z:h,group:d},r[e]=p):(p.id=a.id,p.object=a,p.geometry=o,p.material=l,p.groupOrder=c,p.renderOrder=a.renderOrder,p.z=h,p.group=d),e++,p}return{opaque:t,transmissive:i,transparent:n,init:function(){e=0,t.length=0,i.length=0,n.length=0},push:function(a,o,l,c,h,d){let p=s(a,o,l,c,h,d);l.transmission>0?i.push(p):l.transparent===!0?n.push(p):t.push(p)},unshift:function(a,o,l,c,h,d){let p=s(a,o,l,c,h,d);l.transmission>0?i.unshift(p):l.transparent===!0?n.unshift(p):t.unshift(p)},finish:function(){for(let a=e,o=r.length;a<o;a++){let l=r[a];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(a,o){t.length>1&&t.sort(a||Vm),i.length>1&&i.sort(o||ud),n.length>1&&n.sort(o||ud)}}}function Hm(){let r=new WeakMap;return{get:function(e,t){let i=r.get(e),n;return i===void 0?(n=new dd,r.set(e,[n])):t>=i.length?(n=new dd,i.push(n)):n=i[t],n},dispose:function(){r=new WeakMap}}}function Wm(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new S,color:new ve};break;case"SpotLight":t={position:new S,direction:new S,color:new ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new S,color:new ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new S,skyColor:new ve,groundColor:new ve};break;case"RectAreaLight":t={color:new ve,position:new S,halfWidth:new S,halfHeight:new S}}return r[e.id]=t,t}}}var Xm=0;function jm(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function qm(r){let e=new Wm,t=function(){let o={};return{get:function(l){if(o[l.id]!==void 0)return o[l.id];let c;switch(l.type){case"DirectionalLight":case"SpotLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case"PointLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J,shadowCameraNear:1,shadowCameraFar:1e3}}return o[l.id]=c,c}}}(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let o=0;o<9;o++)i.probe.push(new S);let n=new S,s=new ge,a=new ge;return{setup:function(o){let l=0,c=0,h=0;for(let R=0;R<9;R++)i.probe[R].set(0,0,0);let d=0,p=0,u=0,m=0,g=0,f=0,v=0,_=0,x=0,y=0,E=0;o.sort(jm);for(let R=0,I=o.length;R<I;R++){let L=o[R],G=L.color,H=L.intensity,O=L.distance,N=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)l+=G.r*H,c+=G.g*H,h+=G.b*H;else if(L.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(L.sh.coefficients[U],H);E++}else if(L.isDirectionalLight){let U=e.get(L);if(U.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let k=L.shadow,j=t.get(L);j.shadowIntensity=k.intensity,j.shadowBias=k.bias,j.shadowNormalBias=k.normalBias,j.shadowRadius=k.radius,j.shadowMapSize=k.mapSize,i.directionalShadow[d]=j,i.directionalShadowMap[d]=N,i.directionalShadowMatrix[d]=L.shadow.matrix,f++}i.directional[d]=U,d++}else if(L.isSpotLight){let U=e.get(L);U.position.setFromMatrixPosition(L.matrixWorld),U.color.copy(G).multiplyScalar(H),U.distance=O,U.coneCos=Math.cos(L.angle),U.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),U.decay=L.decay,i.spot[u]=U;let k=L.shadow;if(L.map&&(i.spotLightMap[x]=L.map,x++,k.updateMatrices(L),L.castShadow&&y++),i.spotLightMatrix[u]=k.matrix,L.castShadow){let j=t.get(L);j.shadowIntensity=k.intensity,j.shadowBias=k.bias,j.shadowNormalBias=k.normalBias,j.shadowRadius=k.radius,j.shadowMapSize=k.mapSize,i.spotShadow[u]=j,i.spotShadowMap[u]=N,_++}u++}else if(L.isRectAreaLight){let U=e.get(L);U.color.copy(G).multiplyScalar(H),U.halfWidth.set(.5*L.width,0,0),U.halfHeight.set(0,.5*L.height,0),i.rectArea[m]=U,m++}else if(L.isPointLight){let U=e.get(L);if(U.color.copy(L.color).multiplyScalar(L.intensity),U.distance=L.distance,U.decay=L.decay,L.castShadow){let k=L.shadow,j=t.get(L);j.shadowIntensity=k.intensity,j.shadowBias=k.bias,j.shadowNormalBias=k.normalBias,j.shadowRadius=k.radius,j.shadowMapSize=k.mapSize,j.shadowCameraNear=k.camera.near,j.shadowCameraFar=k.camera.far,i.pointShadow[p]=j,i.pointShadowMap[p]=N,i.pointShadowMatrix[p]=L.shadow.matrix,v++}i.point[p]=U,p++}else if(L.isHemisphereLight){let U=e.get(L);U.skyColor.copy(L.color).multiplyScalar(H),U.groundColor.copy(L.groundColor).multiplyScalar(H),i.hemi[g]=U,g++}}m>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=c,i.ambient[2]=h;let b=i.hash;b.directionalLength===d&&b.pointLength===p&&b.spotLength===u&&b.rectAreaLength===m&&b.hemiLength===g&&b.numDirectionalShadows===f&&b.numPointShadows===v&&b.numSpotShadows===_&&b.numSpotMaps===x&&b.numLightProbes===E||(i.directional.length=d,i.spot.length=u,i.rectArea.length=m,i.point.length=p,i.hemi.length=g,i.directionalShadow.length=f,i.directionalShadowMap.length=f,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=f,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=_+x-y,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=y,i.numLightProbes=E,b.directionalLength=d,b.pointLength=p,b.spotLength=u,b.rectAreaLength=m,b.hemiLength=g,b.numDirectionalShadows=f,b.numPointShadows=v,b.numSpotShadows=_,b.numSpotMaps=x,b.numLightProbes=E,i.version=Xm++)},setupView:function(o,l){let c=0,h=0,d=0,p=0,u=0,m=l.matrixWorldInverse;for(let g=0,f=o.length;g<f;g++){let v=o[g];if(v.isDirectionalLight){let _=i.directional[c];_.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(n),_.direction.transformDirection(m),c++}else if(v.isSpotLight){let _=i.spot[d];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(n),_.direction.transformDirection(m),d++}else if(v.isRectAreaLight){let _=i.rectArea[p];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),a.identity(),s.copy(v.matrixWorld),s.premultiply(m),a.extractRotation(s),_.halfWidth.set(.5*v.width,0,0),_.halfHeight.set(0,.5*v.height,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),p++}else if(v.isPointLight){let _=i.point[h];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),h++}else if(v.isHemisphereLight){let _=i.hemi[u];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(m),u++}}},state:i}}function pd(r){let e=new qm(r),t=[],i=[],n={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:function(s){n.camera=s,t.length=0,i.length=0},state:n,setupLights:function(){e.setup(t)},setupLightsView:function(s){e.setupView(t,s)},pushLight:function(s){t.push(s)},pushShadow:function(s){i.push(s)}}}function Ym(r){let e=new WeakMap;return{get:function(t,i=0){let n=e.get(t),s;return n===void 0?(s=new pd(r),e.set(t,[s])):i>=n.length?(s=new pd(r),n.push(s)):s=n[i],s},dispose:function(){e=new WeakMap}}}function Zm(r,e,t){let i=new cn,n=new J,s=new J,a=new Je,o=new ja({depthPacking:Eu}),l=new qa,c={},h=t.maxTextureSize,d={[pn]:Vt,[Vt]:pn,[vt]:vt},p=new st({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new J},radius:{value:4}},vertexShader:`void main() {
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
}`}),u=p.clone();u.defines.HORIZONTAL_PASS=1;let m=new De;m.setAttribute("position",new ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new se(m,p),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vl;let v=this.type;function _(b,R){let I=e.update(g);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Ri(n.x,n.y)),p.uniforms.shadow_pass.value=b.map.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,r.setRenderTarget(b.mapPass),r.clear(),r.renderBufferDirect(R,null,I,p,g,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,r.setRenderTarget(b.map),r.clear(),r.renderBufferDirect(R,null,I,u,g,null)}function x(b,R,I,L){let G=null,H=I.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(H!==void 0)G=H;else if(G=I.isPointLight===!0?l:o,r.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let O=G.uuid,N=R.uuid,U=c[O];U===void 0&&(U={},c[O]=U);let k=U[N];k===void 0&&(k=G.clone(),U[N]=k,R.addEventListener("dispose",E)),G=k}return G.visible=R.visible,G.wireframe=R.wireframe,G.side=L===Li?R.shadowSide!==null?R.shadowSide:R.side:R.shadowSide!==null?R.shadowSide:d[R.side],G.alphaMap=R.alphaMap,G.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,G.map=R.map,G.clipShadows=R.clipShadows,G.clippingPlanes=R.clippingPlanes,G.clipIntersection=R.clipIntersection,G.displacementMap=R.displacementMap,G.displacementScale=R.displacementScale,G.displacementBias=R.displacementBias,G.wireframeLinewidth=R.wireframeLinewidth,G.linewidth=R.linewidth,I.isPointLight===!0&&G.isMeshDistanceMaterial===!0&&(r.properties.get(G).light=I),G}function y(b,R,I,L,G){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&G===Li)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,b.matrixWorld);let O=e.update(b),N=b.material;if(Array.isArray(N)){let U=O.groups;for(let k=0,j=U.length;k<j;k++){let K=U[k],$=N[K.materialIndex];if($&&$.visible){let ue=x(b,$,L,G);b.onBeforeShadow(r,b,R,I,O,ue,K),r.renderBufferDirect(I,null,O,ue,b,K),b.onAfterShadow(r,b,R,I,O,ue,K)}}}else if(N.visible){let U=x(b,N,L,G);b.onBeforeShadow(r,b,R,I,O,U,null),r.renderBufferDirect(I,null,O,U,b,null),b.onAfterShadow(r,b,R,I,O,U,null)}}let H=b.children;for(let O=0,N=H.length;O<N;O++)y(H[O],R,I,L,G)}function E(b){b.target.removeEventListener("dispose",E);for(let R in c){let I=c[R],L=b.target.uuid;L in I&&(I[L].dispose(),delete I[L])}}this.render=function(b,R,I){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||b.length===0)return;let L=r.getRenderTarget(),G=r.getActiveCubeFace(),H=r.getActiveMipmapLevel(),O=r.state;O.setBlending(mn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let N=v!==Li&&this.type===Li,U=v===Li&&this.type!==Li;for(let k=0,j=b.length;k<j;k++){let K=b[k],$=K.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;n.copy($.mapSize);let ue=$.getFrameExtents();if(n.multiply(ue),s.copy($.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/ue.x),n.x=s.x*ue.x,$.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/ue.y),n.y=s.y*ue.y,$.mapSize.y=s.y)),$.map===null||N===!0||U===!0){let _e=this.type!==Li?{minFilter:Ai,magFilter:Ai}:{};$.map!==null&&$.map.dispose(),$.map=new Ri(n.x,n.y,_e),$.map.texture.name=K.name+".shadowMap",$.camera.updateProjectionMatrix()}r.setRenderTarget($.map),r.clear();let Me=$.getViewportCount();for(let _e=0;_e<Me;_e++){let Ae=$.getViewport(_e);a.set(s.x*Ae.x,s.y*Ae.y,s.x*Ae.z,s.y*Ae.w),O.viewport(a),$.updateMatrices(K,_e),i=$.getFrustum(),y(R,I,$.camera,K,this.type)}$.isPointLightShadow!==!0&&this.type===Li&&_($,I),$.needsUpdate=!1}v=this.type,f.needsUpdate=!1,r.setRenderTarget(L,G,H)}}var Jm={[ao]:oo,[lo]:uo,[co]:po,[As]:ho,[oo]:ao,[uo]:lo,[po]:co,[ho]:As};function Km(r,e){let t=new function(){let M=!1,C=new Je,B=null,P=new Je(0,0,0,0);return{setMask:function(Y){B===Y||M||(r.colorMask(Y,Y,Y,Y),B=Y)},setLocked:function(Y){M=Y},setClear:function(Y,V,W,te,le){le===!0&&(Y*=te,V*=te,W*=te),C.set(Y,V,W,te),P.equals(C)===!1&&(r.clearColor(Y,V,W,te),P.copy(C))},reset:function(){M=!1,B=null,P.set(-1,0,0,0)}}},i=new function(){let M=!1,C=!1,B=null,P=null,Y=null;return{setReversed:function(V){if(C!==V){let W=e.get("EXT_clip_control");V?W.clipControlEXT(W.LOWER_LEFT_EXT,W.ZERO_TO_ONE_EXT):W.clipControlEXT(W.LOWER_LEFT_EXT,W.NEGATIVE_ONE_TO_ONE_EXT),C=V;let te=Y;Y=null,this.setClear(te)}},getReversed:function(){return C},setTest:function(V){V?ae(r.DEPTH_TEST):re(r.DEPTH_TEST)},setMask:function(V){B===V||M||(r.depthMask(V),B=V)},setFunc:function(V){if(C&&(V=Jm[V]),P!==V){switch(V){case ao:r.depthFunc(r.NEVER);break;case oo:r.depthFunc(r.ALWAYS);break;case lo:r.depthFunc(r.LESS);break;case As:r.depthFunc(r.LEQUAL);break;case co:r.depthFunc(r.EQUAL);break;case ho:r.depthFunc(r.GEQUAL);break;case uo:r.depthFunc(r.GREATER);break;case po:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}P=V}},setLocked:function(V){M=V},setClear:function(V){Y!==V&&(C&&(V=1-V),r.clearDepth(V),Y=V)},reset:function(){M=!1,B=null,P=null,Y=null,C=!1}}},n=new function(){let M=!1,C=null,B=null,P=null,Y=null,V=null,W=null,te=null,le=null;return{setTest:function(ie){M||(ie?ae(r.STENCIL_TEST):re(r.STENCIL_TEST))},setMask:function(ie){C===ie||M||(r.stencilMask(ie),C=ie)},setFunc:function(ie,de,xe){B===ie&&P===de&&Y===xe||(r.stencilFunc(ie,de,xe),B=ie,P=de,Y=xe)},setOp:function(ie,de,xe){V===ie&&W===de&&te===xe||(r.stencilOp(ie,de,xe),V=ie,W=de,te=xe)},setLocked:function(ie){M=ie},setClear:function(ie){le!==ie&&(r.clearStencil(ie),le=ie)},reset:function(){M=!1,C=null,B=null,P=null,Y=null,V=null,W=null,te=null,le=null}}},s=new WeakMap,a=new WeakMap,o={},l={},c=new WeakMap,h=[],d=null,p=!1,u=null,m=null,g=null,f=null,v=null,_=null,x=null,y=new ve(0,0,0),E=0,b=!1,R=null,I=null,L=null,G=null,H=null,O=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,U=0,k=r.getParameter(r.VERSION);k.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(k)[1]),N=U>=1):k.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),N=U>=2);let j=null,K={},$=r.getParameter(r.SCISSOR_BOX),ue=r.getParameter(r.VIEWPORT),Me=new Je().fromArray($),_e=new Je().fromArray(ue);function Ae(M,C,B,P){let Y=new Uint8Array(4),V=r.createTexture();r.bindTexture(M,V),r.texParameteri(M,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(M,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let W=0;W<B;W++)M===r.TEXTURE_3D||M===r.TEXTURE_2D_ARRAY?r.texImage3D(C,0,r.RGBA,1,1,P,0,r.RGBA,r.UNSIGNED_BYTE,Y):r.texImage2D(C+W,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Y);return V}let ne={};function ae(M){o[M]!==!0&&(r.enable(M),o[M]=!0)}function re(M){o[M]!==!1&&(r.disable(M),o[M]=!1)}ne[r.TEXTURE_2D]=Ae(r.TEXTURE_2D,r.TEXTURE_2D,1),ne[r.TEXTURE_CUBE_MAP]=Ae(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[r.TEXTURE_2D_ARRAY]=Ae(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ne[r.TEXTURE_3D]=Ae(r.TEXTURE_3D,r.TEXTURE_3D,1,1),t.setClear(0,0,0,1),i.setClear(1),n.setClear(0),ae(r.DEPTH_TEST),i.setFunc(As),T(!1),z(kl),ae(r.CULL_FACE),w(mn);let Te={[Ar]:r.FUNC_ADD,[Yh]:r.FUNC_SUBTRACT,[Zh]:r.FUNC_REVERSE_SUBTRACT};Te[Jh]=r.MIN,Te[Kh]=r.MAX;let Ue={[$h]:r.ZERO,[Qh]:r.ONE,[eu]:r.SRC_COLOR,[iu]:r.SRC_ALPHA,[lu]:r.SRC_ALPHA_SATURATE,[au]:r.DST_COLOR,[ru]:r.DST_ALPHA,[tu]:r.ONE_MINUS_SRC_COLOR,[nu]:r.ONE_MINUS_SRC_ALPHA,[ou]:r.ONE_MINUS_DST_COLOR,[su]:r.ONE_MINUS_DST_ALPHA,[cu]:r.CONSTANT_COLOR,[hu]:r.ONE_MINUS_CONSTANT_COLOR,[uu]:r.CONSTANT_ALPHA,[du]:r.ONE_MINUS_CONSTANT_ALPHA};function w(M,C,B,P,Y,V,W,te,le,ie){if(M!==mn){if(p===!1&&(ae(r.BLEND),p=!0),M===qh)Y=Y||C,V=V||B,W=W||P,C===m&&Y===v||(r.blendEquationSeparate(Te[C],Te[Y]),m=C,v=Y),B===g&&P===f&&V===_&&W===x||(r.blendFuncSeparate(Ue[B],Ue[P],Ue[V],Ue[W]),g=B,f=P,_=V,x=W),te.equals(y)!==!1&&le===E||(r.blendColor(te.r,te.g,te.b,le),y.copy(te),E=le),u=M,b=!1;else if(M!==u||ie!==b){if(m===Ar&&v===Ar||(r.blendEquation(r.FUNC_ADD),m=Ar,v=Ar),ie)switch(M){case Ot:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Hl:r.blendFunc(r.ONE,r.ONE);break;case Wl:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Xl:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",M)}else switch(M){case Ot:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Hl:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Wl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Xl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",M)}g=null,f=null,_=null,x=null,y.set(0,0,0),E=0,u=M,b=ie}}else p===!0&&(re(r.BLEND),p=!1)}function T(M){R!==M&&(M?r.frontFace(r.CW):r.frontFace(r.CCW),R=M)}function z(M){M!==Xh?(ae(r.CULL_FACE),M!==I&&(M===kl?r.cullFace(r.BACK):M===jh?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):re(r.CULL_FACE),I=M}function D(M,C,B){M?(ae(r.POLYGON_OFFSET_FILL),G===C&&H===B||(r.polygonOffset(C,B),G=C,H=B)):re(r.POLYGON_OFFSET_FILL)}return{buffers:{color:t,depth:i,stencil:n},enable:ae,disable:re,bindFramebuffer:function(M,C){return l[M]!==C&&(r.bindFramebuffer(M,C),l[M]=C,M===r.DRAW_FRAMEBUFFER&&(l[r.FRAMEBUFFER]=C),M===r.FRAMEBUFFER&&(l[r.DRAW_FRAMEBUFFER]=C),!0)},drawBuffers:function(M,C){let B=h,P=!1;if(M){B=c.get(C),B===void 0&&(B=[],c.set(C,B));let Y=M.textures;if(B.length!==Y.length||B[0]!==r.COLOR_ATTACHMENT0){for(let V=0,W=Y.length;V<W;V++)B[V]=r.COLOR_ATTACHMENT0+V;B.length=Y.length,P=!0}}else B[0]!==r.BACK&&(B[0]=r.BACK,P=!0);P&&r.drawBuffers(B)},useProgram:function(M){return d!==M&&(r.useProgram(M),d=M,!0)},setBlending:w,setMaterial:function(M,C){M.side===vt?re(r.CULL_FACE):ae(r.CULL_FACE);let B=M.side===Vt;C&&(B=!B),T(B),M.blending===Ot&&M.transparent===!1?w(mn):w(M.blending,M.blendEquation,M.blendSrc,M.blendDst,M.blendEquationAlpha,M.blendSrcAlpha,M.blendDstAlpha,M.blendColor,M.blendAlpha,M.premultipliedAlpha),i.setFunc(M.depthFunc),i.setTest(M.depthTest),i.setMask(M.depthWrite),t.setMask(M.colorWrite);let P=M.stencilWrite;n.setTest(P),P&&(n.setMask(M.stencilWriteMask),n.setFunc(M.stencilFunc,M.stencilRef,M.stencilFuncMask),n.setOp(M.stencilFail,M.stencilZFail,M.stencilZPass)),D(M.polygonOffset,M.polygonOffsetFactor,M.polygonOffsetUnits),M.alphaToCoverage===!0?ae(r.SAMPLE_ALPHA_TO_COVERAGE):re(r.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:T,setCullFace:z,setLineWidth:function(M){M!==L&&(N&&r.lineWidth(M),L=M)},setPolygonOffset:D,setScissorTest:function(M){M?ae(r.SCISSOR_TEST):re(r.SCISSOR_TEST)},activeTexture:function(M){M===void 0&&(M=r.TEXTURE0+O-1),j!==M&&(r.activeTexture(M),j=M)},bindTexture:function(M,C,B){B===void 0&&(B=j===null?r.TEXTURE0+O-1:j);let P=K[B];P===void 0&&(P={type:void 0,texture:void 0},K[B]=P),P.type===M&&P.texture===C||(j!==B&&(r.activeTexture(B),j=B),r.bindTexture(M,C||ne[M]),P.type=M,P.texture=C)},unbindTexture:function(){let M=K[j];M!==void 0&&M.type!==void 0&&(r.bindTexture(M.type,null),M.type=void 0,M.texture=void 0)},compressedTexImage2D:function(){try{r.compressedTexImage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexImage3D:function(){try{r.compressedTexImage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texImage2D:function(){try{r.texImage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texImage3D:function(){try{r.texImage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},updateUBOMapping:function(M,C){let B=a.get(C);B===void 0&&(B=new WeakMap,a.set(C,B));let P=B.get(M);P===void 0&&(P=r.getUniformBlockIndex(C,M.name),B.set(M,P))},uniformBlockBinding:function(M,C){let B=a.get(C).get(M);s.get(C)!==B&&(r.uniformBlockBinding(C,B,M.__bindingPointIndex),s.set(C,B))},texStorage2D:function(){try{r.texStorage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texStorage3D:function(){try{r.texStorage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texSubImage2D:function(){try{r.texSubImage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texSubImage3D:function(){try{r.texSubImage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexSubImage2D:function(){try{r.compressedTexSubImage2D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexSubImage3D:function(){try{r.compressedTexSubImage3D(...arguments)}catch(M){console.error("THREE.WebGLState:",M)}},scissor:function(M){Me.equals(M)===!1&&(r.scissor(M.x,M.y,M.z,M.w),Me.copy(M))},viewport:function(M){_e.equals(M)===!1&&(r.viewport(M.x,M.y,M.z,M.w),_e.copy(M))},reset:function(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),i.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),o={},j=null,K={},l={},c=new WeakMap,h=[],d=null,p=!1,u=null,m=null,g=null,f=null,v=null,_=null,x=null,y=new ve(0,0,0),E=0,b=!1,R=null,I=null,L=null,G=null,H=null,Me.set(0,0,r.canvas.width,r.canvas.height),_e.set(0,0,r.canvas.width,r.canvas.height),t.reset(),i.reset(),n.reset()}}}function $m(r,e,t,i,n,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),c=new J,h=new WeakMap,d,p=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(w,T){return u?new OffscreenCanvas(w,T):pr("canvas")}function g(w,T,z){let D=1,M=Ue(w);if((M.width>z||M.height>z)&&(D=z/Math.max(M.width,M.height)),D<1){if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let C=Math.floor(D*M.width),B=Math.floor(D*M.height);d===void 0&&(d=m(C,B));let P=T?m(C,B):d;return P.width=C,P.height=B,P.getContext("2d").drawImage(w,0,0,C,B),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+M.width+"x"+M.height+") to ("+C+"x"+B+")."),P}return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+M.width+"x"+M.height+")."),w}return w}function f(w){return w.generateMipmaps}function v(w){r.generateMipmap(w)}function _(w){return w.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?r.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function x(w,T,z,D,M=!1){if(w!==null){if(r[w]!==void 0)return r[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let C=T;if(T===r.RED&&(z===r.FLOAT&&(C=r.R32F),z===r.HALF_FLOAT&&(C=r.R16F),z===r.UNSIGNED_BYTE&&(C=r.R8)),T===r.RED_INTEGER&&(z===r.UNSIGNED_BYTE&&(C=r.R8UI),z===r.UNSIGNED_SHORT&&(C=r.R16UI),z===r.UNSIGNED_INT&&(C=r.R32UI),z===r.BYTE&&(C=r.R8I),z===r.SHORT&&(C=r.R16I),z===r.INT&&(C=r.R32I)),T===r.RG&&(z===r.FLOAT&&(C=r.RG32F),z===r.HALF_FLOAT&&(C=r.RG16F),z===r.UNSIGNED_BYTE&&(C=r.RG8)),T===r.RG_INTEGER&&(z===r.UNSIGNED_BYTE&&(C=r.RG8UI),z===r.UNSIGNED_SHORT&&(C=r.RG16UI),z===r.UNSIGNED_INT&&(C=r.RG32UI),z===r.BYTE&&(C=r.RG8I),z===r.SHORT&&(C=r.RG16I),z===r.INT&&(C=r.RG32I)),T===r.RGB_INTEGER&&(z===r.UNSIGNED_BYTE&&(C=r.RGB8UI),z===r.UNSIGNED_SHORT&&(C=r.RGB16UI),z===r.UNSIGNED_INT&&(C=r.RGB32UI),z===r.BYTE&&(C=r.RGB8I),z===r.SHORT&&(C=r.RGB16I),z===r.INT&&(C=r.RGB32I)),T===r.RGBA_INTEGER&&(z===r.UNSIGNED_BYTE&&(C=r.RGBA8UI),z===r.UNSIGNED_SHORT&&(C=r.RGBA16UI),z===r.UNSIGNED_INT&&(C=r.RGBA32UI),z===r.BYTE&&(C=r.RGBA8I),z===r.SHORT&&(C=r.RGBA16I),z===r.INT&&(C=r.RGBA32I)),T===r.RGB&&(z===r.UNSIGNED_INT_5_9_9_9_REV&&(C=r.RGB9_E5),z===r.UNSIGNED_INT_10F_11F_11F_REV&&(C=r.R11F_G11F_B10F)),T===r.RGBA){let B=M?is:Ze.getTransfer(D);z===r.FLOAT&&(C=r.RGBA32F),z===r.HALF_FLOAT&&(C=r.RGBA16F),z===r.UNSIGNED_BYTE&&(C=B===nt?r.SRGB8_ALPHA8:r.RGBA8),z===r.UNSIGNED_SHORT_4_4_4_4&&(C=r.RGBA4),z===r.UNSIGNED_SHORT_5_5_5_1&&(C=r.RGB5_A1)}return C!==r.R16F&&C!==r.R32F&&C!==r.RG16F&&C!==r.RG32F&&C!==r.RGBA16F&&C!==r.RGBA32F||e.get("EXT_color_buffer_float"),C}function y(w,T){let z;return w?T===null||T===Dn||T===Ir?z=r.DEPTH24_STENCIL8:T===fi?z=r.DEPTH32F_STENCIL8:T===Rr&&(z=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Dn||T===Ir?z=r.DEPTH_COMPONENT24:T===fi?z=r.DEPTH_COMPONENT32F:T===Rr&&(z=r.DEPTH_COMPONENT16),z}function E(w,T){return f(w)===!0||w.isFramebufferTexture&&w.minFilter!==Ai&&w.minFilter!==Ci?Math.log2(Math.max(T.width,T.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?T.mipmaps.length:1}function b(w){let T=w.target;T.removeEventListener("dispose",b),function(z){let D=i.get(z);if(D.__webglInit===void 0)return;let M=z.source,C=p.get(M);if(C){let B=C[D.__cacheKey];B.usedTimes--,B.usedTimes===0&&I(z),Object.keys(C).length===0&&p.delete(M)}i.remove(z)}(T),T.isVideoTexture&&h.delete(T)}function R(w){let T=w.target;T.removeEventListener("dispose",R),function(z){let D=i.get(z);if(z.depthTexture&&(z.depthTexture.dispose(),i.remove(z.depthTexture)),z.isWebGLCubeRenderTarget)for(let C=0;C<6;C++){if(Array.isArray(D.__webglFramebuffer[C]))for(let B=0;B<D.__webglFramebuffer[C].length;B++)r.deleteFramebuffer(D.__webglFramebuffer[C][B]);else r.deleteFramebuffer(D.__webglFramebuffer[C]);D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer[C])}else{if(Array.isArray(D.__webglFramebuffer))for(let C=0;C<D.__webglFramebuffer.length;C++)r.deleteFramebuffer(D.__webglFramebuffer[C]);else r.deleteFramebuffer(D.__webglFramebuffer);if(D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer),D.__webglMultisampledFramebuffer&&r.deleteFramebuffer(D.__webglMultisampledFramebuffer),D.__webglColorRenderbuffer)for(let C=0;C<D.__webglColorRenderbuffer.length;C++)D.__webglColorRenderbuffer[C]&&r.deleteRenderbuffer(D.__webglColorRenderbuffer[C]);D.__webglDepthRenderbuffer&&r.deleteRenderbuffer(D.__webglDepthRenderbuffer)}let M=z.textures;for(let C=0,B=M.length;C<B;C++){let P=i.get(M[C]);P.__webglTexture&&(r.deleteTexture(P.__webglTexture),a.memory.textures--),i.remove(M[C])}i.remove(z)}(T)}function I(w){let T=i.get(w);r.deleteTexture(T.__webglTexture);let z=w.source;delete p.get(z)[T.__cacheKey],a.memory.textures--}let L=0;function G(w,T){let z=i.get(w);if(w.isVideoTexture&&function(D){let M=a.render.frame;h.get(D)!==M&&(h.set(D,M),D.update())}(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&z.__version!==w.version){let D=w.image;if(D===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(D.complete!==!1)return void K(z,w,T);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}else w.isExternalTexture&&(z.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,z.__webglTexture,r.TEXTURE0+T)}let H={[hr]:r.REPEAT,[ur]:r.CLAMP_TO_EDGE,[Sa]:r.MIRRORED_REPEAT},O={[Ai]:r.NEAREST,[Su]:r.NEAREST_MIPMAP_NEAREST,[Rs]:r.NEAREST_MIPMAP_LINEAR,[Ci]:r.LINEAR,[vo]:r.LINEAR_MIPMAP_NEAREST,[Un]:r.LINEAR_MIPMAP_LINEAR},N={[Ru]:r.NEVER,[Nu]:r.ALWAYS,[Pu]:r.LESS,[Ac]:r.LEQUAL,[Iu]:r.EQUAL,[Du]:r.GEQUAL,[Lu]:r.GREATER,[Uu]:r.NOTEQUAL};function U(w,T){if(T.type!==fi||e.has("OES_texture_float_linear")!==!1||T.magFilter!==Ci&&T.magFilter!==vo&&T.magFilter!==Rs&&T.magFilter!==Un&&T.minFilter!==Ci&&T.minFilter!==vo&&T.minFilter!==Rs&&T.minFilter!==Un||console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(w,r.TEXTURE_WRAP_S,H[T.wrapS]),r.texParameteri(w,r.TEXTURE_WRAP_T,H[T.wrapT]),w!==r.TEXTURE_3D&&w!==r.TEXTURE_2D_ARRAY||r.texParameteri(w,r.TEXTURE_WRAP_R,H[T.wrapR]),r.texParameteri(w,r.TEXTURE_MAG_FILTER,O[T.magFilter]),r.texParameteri(w,r.TEXTURE_MIN_FILTER,O[T.minFilter]),T.compareFunction&&(r.texParameteri(w,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(w,r.TEXTURE_COMPARE_FUNC,N[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Ai||T.minFilter!==Rs&&T.minFilter!==Un||T.type===fi&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){let z=e.get("EXT_texture_filter_anisotropic");r.texParameterf(w,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,n.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function k(w,T){let z=!1;w.__webglInit===void 0&&(w.__webglInit=!0,T.addEventListener("dispose",b));let D=T.source,M=p.get(D);M===void 0&&(M={},p.set(D,M));let C=function(B){let P=[];return P.push(B.wrapS),P.push(B.wrapT),P.push(B.wrapR||0),P.push(B.magFilter),P.push(B.minFilter),P.push(B.anisotropy),P.push(B.internalFormat),P.push(B.format),P.push(B.type),P.push(B.generateMipmaps),P.push(B.premultiplyAlpha),P.push(B.flipY),P.push(B.unpackAlignment),P.push(B.colorSpace),P.join()}(T);if(C!==w.__cacheKey){M[C]===void 0&&(M[C]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,z=!0),M[C].usedTimes++;let B=M[w.__cacheKey];B!==void 0&&(M[w.__cacheKey].usedTimes--,B.usedTimes===0&&I(T)),w.__cacheKey=C,w.__webglTexture=M[C].texture}return z}function j(w,T,z){return Math.floor(Math.floor(w/z)/T)}function K(w,T,z){let D=r.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(D=r.TEXTURE_2D_ARRAY),T.isData3DTexture&&(D=r.TEXTURE_3D);let M=k(w,T),C=T.source;t.bindTexture(D,w.__webglTexture,r.TEXTURE0+z);let B=i.get(C);if(C.version!==B.__version||M===!0){t.activeTexture(r.TEXTURE0+z);let P=Ze.getPrimaries(Ze.workingColorSpace),Y=T.colorSpace===Nn?null:Ze.getPrimaries(T.colorSpace),V=T.colorSpace===Nn||P===Y?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,V);let W=g(T.image,!1,n.maxTextureSize);W=Te(T,W);let te=s.convert(T.format,T.colorSpace),le=s.convert(T.type),ie,de=x(T.internalFormat,te,le,T.colorSpace,T.isVideoTexture);U(D,T);let xe=T.mipmaps,be=T.isVideoTexture!==!0,Ve=B.__version===void 0||M===!0,Ke=C.dataReady,$e=E(T,W);if(T.isDepthTexture)de=y(T.format===Is,T.type),Ve&&(be?t.texStorage2D(r.TEXTURE_2D,1,de,W.width,W.height):t.texImage2D(r.TEXTURE_2D,0,de,W.width,W.height,0,te,le,null));else if(T.isDataTexture)if(xe.length>0){be&&Ve&&t.texStorage2D(r.TEXTURE_2D,$e,de,xe[0].width,xe[0].height);for(let ce=0,we=xe.length;ce<we;ce++)ie=xe[ce],be?Ke&&t.texSubImage2D(r.TEXTURE_2D,ce,0,0,ie.width,ie.height,te,le,ie.data):t.texImage2D(r.TEXTURE_2D,ce,de,ie.width,ie.height,0,te,le,ie.data);T.generateMipmaps=!1}else be?(Ve&&t.texStorage2D(r.TEXTURE_2D,$e,de,W.width,W.height),Ke&&function(ce,we,Ge,Ut){let me=ce.updateRanges;if(me.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,we.width,we.height,Ge,Ut,we.data);else{me.sort((F,wt)=>F.start-wt.start);let Qe=0;for(let F=1;F<me.length;F++){let wt=me[Qe],Dt=me[F],dt=wt.start+wt.count,_n=j(Dt.start,we.width,4),xn=j(wt.start,we.width,4);Dt.start<=dt+1&&_n===xn&&j(Dt.start+Dt.count-1,we.width,4)===_n?wt.count=Math.max(wt.count,Dt.start+Dt.count-wt.start):(++Qe,me[Qe]=Dt)}me.length=Qe+1;let He=r.getParameter(r.UNPACK_ROW_LENGTH),si=r.getParameter(r.UNPACK_SKIP_PIXELS),Oi=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,we.width);for(let F=0,wt=me.length;F<wt;F++){let Dt=me[F],dt=Math.floor(Dt.start/4),_n=Math.ceil(Dt.count/4),xn=dt%we.width,Or=Math.floor(dt/we.width),Fs=_n;r.pixelStorei(r.UNPACK_SKIP_PIXELS,xn),r.pixelStorei(r.UNPACK_SKIP_ROWS,Or),t.texSubImage2D(r.TEXTURE_2D,0,xn,Or,Fs,1,Ge,Ut,we.data)}ce.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,He),r.pixelStorei(r.UNPACK_SKIP_PIXELS,si),r.pixelStorei(r.UNPACK_SKIP_ROWS,Oi)}}(T,W,te,le)):t.texImage2D(r.TEXTURE_2D,0,de,W.width,W.height,0,te,le,W.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){be&&Ve&&t.texStorage3D(r.TEXTURE_2D_ARRAY,$e,de,xe[0].width,xe[0].height,W.depth);for(let ce=0,we=xe.length;ce<we;ce++)if(ie=xe[ce],T.format!==gi)if(te!==null)if(be){if(Ke)if(T.layerUpdates.size>0){let Ge=Uc(ie.width,ie.height,T.format,T.type);for(let Ut of T.layerUpdates){let me=ie.data.subarray(Ut*Ge/ie.data.BYTES_PER_ELEMENT,(Ut+1)*Ge/ie.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ce,0,0,Ut,ie.width,ie.height,1,te,me)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ce,0,0,0,ie.width,ie.height,W.depth,te,ie.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ce,de,ie.width,ie.height,W.depth,0,ie.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else be?Ke&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ce,0,0,0,ie.width,ie.height,W.depth,te,le,ie.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ce,de,ie.width,ie.height,W.depth,0,te,le,ie.data)}else{be&&Ve&&t.texStorage2D(r.TEXTURE_2D,$e,de,xe[0].width,xe[0].height);for(let ce=0,we=xe.length;ce<we;ce++)ie=xe[ce],T.format!==gi?te!==null?be?Ke&&t.compressedTexSubImage2D(r.TEXTURE_2D,ce,0,0,ie.width,ie.height,te,ie.data):t.compressedTexImage2D(r.TEXTURE_2D,ce,de,ie.width,ie.height,0,ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):be?Ke&&t.texSubImage2D(r.TEXTURE_2D,ce,0,0,ie.width,ie.height,te,le,ie.data):t.texImage2D(r.TEXTURE_2D,ce,de,ie.width,ie.height,0,te,le,ie.data)}else if(T.isDataArrayTexture)if(be){if(Ve&&t.texStorage3D(r.TEXTURE_2D_ARRAY,$e,de,W.width,W.height,W.depth),Ke)if(T.layerUpdates.size>0){let ce=Uc(W.width,W.height,T.format,T.type);for(let we of T.layerUpdates){let Ge=W.data.subarray(we*ce/W.data.BYTES_PER_ELEMENT,(we+1)*ce/W.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,we,W.width,W.height,1,te,le,Ge)}T.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,W.width,W.height,W.depth,te,le,W.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,de,W.width,W.height,W.depth,0,te,le,W.data);else if(T.isData3DTexture)be?(Ve&&t.texStorage3D(r.TEXTURE_3D,$e,de,W.width,W.height,W.depth),Ke&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,W.width,W.height,W.depth,te,le,W.data)):t.texImage3D(r.TEXTURE_3D,0,de,W.width,W.height,W.depth,0,te,le,W.data);else if(T.isFramebufferTexture){if(Ve)if(be)t.texStorage2D(r.TEXTURE_2D,$e,de,W.width,W.height);else{let ce=W.width,we=W.height;for(let Ge=0;Ge<$e;Ge++)t.texImage2D(r.TEXTURE_2D,Ge,de,ce,we,0,te,le,null),ce>>=1,we>>=1}}else if(xe.length>0){if(be&&Ve){let ce=Ue(xe[0]);t.texStorage2D(r.TEXTURE_2D,$e,de,ce.width,ce.height)}for(let ce=0,we=xe.length;ce<we;ce++)ie=xe[ce],be?Ke&&t.texSubImage2D(r.TEXTURE_2D,ce,0,0,te,le,ie):t.texImage2D(r.TEXTURE_2D,ce,de,te,le,ie);T.generateMipmaps=!1}else if(be){if(Ve){let ce=Ue(W);t.texStorage2D(r.TEXTURE_2D,$e,de,ce.width,ce.height)}Ke&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,te,le,W)}else t.texImage2D(r.TEXTURE_2D,0,de,te,le,W);f(T)&&v(D),B.__version=C.version,T.onUpdate&&T.onUpdate(T)}w.__version=T.version}function $(w,T,z,D,M,C){let B=s.convert(z.format,z.colorSpace),P=s.convert(z.type),Y=x(z.internalFormat,B,P,z.colorSpace),V=i.get(T),W=i.get(z);if(W.__renderTarget=T,!V.__hasExternalTextures){let te=Math.max(1,T.width>>C),le=Math.max(1,T.height>>C);M===r.TEXTURE_3D||M===r.TEXTURE_2D_ARRAY?t.texImage3D(M,C,Y,te,le,T.depth,0,B,P,null):t.texImage2D(M,C,Y,te,le,0,B,P,null)}t.bindFramebuffer(r.FRAMEBUFFER,w),re(T)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,D,M,W.__webglTexture,0,ae(T)):(M===r.TEXTURE_2D||M>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&M<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,D,M,W.__webglTexture,C),t.bindFramebuffer(r.FRAMEBUFFER,null)}function ue(w,T,z){if(r.bindRenderbuffer(r.RENDERBUFFER,w),T.depthBuffer){let D=T.depthTexture,M=D&&D.isDepthTexture?D.type:null,C=y(T.stencilBuffer,M),B=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,P=ae(T);re(T)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,P,C,T.width,T.height):z?r.renderbufferStorageMultisample(r.RENDERBUFFER,P,C,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,C,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,B,r.RENDERBUFFER,w)}else{let D=T.textures;for(let M=0;M<D.length;M++){let C=D[M],B=s.convert(C.format,C.colorSpace),P=s.convert(C.type),Y=x(C.internalFormat,B,P,C.colorSpace),V=ae(T);z&&re(T)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,V,Y,T.width,T.height):re(T)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,V,Y,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,Y,T.width,T.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Me(w,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,w),!T.depthTexture||!T.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let z=i.get(T.depthTexture);z.__renderTarget=T,z.__webglTexture&&T.depthTexture.image.width===T.width&&T.depthTexture.image.height===T.height||(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),G(T.depthTexture,0);let D=z.__webglTexture,M=ae(T);if(T.depthTexture.format===Ps)re(T)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,D,0,M):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,D,0);else{if(T.depthTexture.format!==Is)throw new Error("Unknown depthTexture format");re(T)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,D,0,M):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,D,0)}}function _e(w){let T=i.get(w),z=w.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==w.depthTexture){let D=w.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),D){let M=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,D.removeEventListener("dispose",M)};D.addEventListener("dispose",M),T.__depthDisposeCallback=M}T.__boundDepthTexture=D}if(w.depthTexture&&!T.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");let D=w.texture.mipmaps;D&&D.length>0?Me(T.__webglFramebuffer[0],w):Me(T.__webglFramebuffer,w)}else if(z){T.__webglDepthbuffer=[];for(let D=0;D<6;D++)if(t.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[D]),T.__webglDepthbuffer[D]===void 0)T.__webglDepthbuffer[D]=r.createRenderbuffer(),ue(T.__webglDepthbuffer[D],w,!1);else{let M=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,C=T.__webglDepthbuffer[D];r.bindRenderbuffer(r.RENDERBUFFER,C),r.framebufferRenderbuffer(r.FRAMEBUFFER,M,r.RENDERBUFFER,C)}}else{let D=w.texture.mipmaps;if(D&&D.length>0?t.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=r.createRenderbuffer(),ue(T.__webglDepthbuffer,w,!1);else{let M=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,C=T.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,C),r.framebufferRenderbuffer(r.FRAMEBUFFER,M,r.RENDERBUFFER,C)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}let Ae=[],ne=[];function ae(w){return Math.min(n.maxSamples,w.samples)}function re(w){let T=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Te(w,T){let z=w.colorSpace,D=w.format,M=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||z!==An&&z!==Nn&&(Ze.getTransfer(z)===nt?D===gi&&M===Ui||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),T}function Ue(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=function(){let w=L;return w>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+n.maxTextures),L+=1,w},this.resetTextureUnits=function(){L=0},this.setTexture2D=G,this.setTexture2DArray=function(w,T){let z=i.get(w);w.isRenderTargetTexture===!1&&w.version>0&&z.__version!==w.version?K(z,w,T):t.bindTexture(r.TEXTURE_2D_ARRAY,z.__webglTexture,r.TEXTURE0+T)},this.setTexture3D=function(w,T){let z=i.get(w);w.isRenderTargetTexture===!1&&w.version>0&&z.__version!==w.version?K(z,w,T):t.bindTexture(r.TEXTURE_3D,z.__webglTexture,r.TEXTURE0+T)},this.setTextureCube=function(w,T){let z=i.get(w);w.version>0&&z.__version!==w.version?function(D,M,C){if(M.image.length!==6)return;let B=k(D,M),P=M.source;t.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture,r.TEXTURE0+C);let Y=i.get(P);if(P.version!==Y.__version||B===!0){t.activeTexture(r.TEXTURE0+C);let V=Ze.getPrimaries(Ze.workingColorSpace),W=M.colorSpace===Nn?null:Ze.getPrimaries(M.colorSpace),te=M.colorSpace===Nn||V===W?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,M.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,M.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let le=M.isCompressedTexture||M.image[0].isCompressedTexture,ie=M.image[0]&&M.image[0].isDataTexture,de=[];for(let me=0;me<6;me++)de[me]=le||ie?ie?M.image[me].image:M.image[me]:g(M.image[me],!0,n.maxCubemapSize),de[me]=Te(M,de[me]);let xe=de[0],be=s.convert(M.format,M.colorSpace),Ve=s.convert(M.type),Ke=x(M.internalFormat,be,Ve,M.colorSpace),$e=M.isVideoTexture!==!0,ce=Y.__version===void 0||B===!0,we=P.dataReady,Ge,Ut=E(M,xe);if(U(r.TEXTURE_CUBE_MAP,M),le){$e&&ce&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Ut,Ke,xe.width,xe.height);for(let me=0;me<6;me++){Ge=de[me].mipmaps;for(let Qe=0;Qe<Ge.length;Qe++){let He=Ge[Qe];M.format!==gi?be!==null?$e?we&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Qe,0,0,He.width,He.height,be,He.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Qe,Ke,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$e?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Qe,0,0,He.width,He.height,be,Ve,He.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Qe,Ke,He.width,He.height,0,be,Ve,He.data)}}}else{if(Ge=M.mipmaps,$e&&ce){Ge.length>0&&Ut++;let me=Ue(de[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Ut,Ke,me.width,me.height)}for(let me=0;me<6;me++)if(ie){$e?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,de[me].width,de[me].height,be,Ve,de[me].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,Ke,de[me].width,de[me].height,0,be,Ve,de[me].data);for(let Qe=0;Qe<Ge.length;Qe++){let He=Ge[Qe].image[me].image;$e?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Qe+1,0,0,He.width,He.height,be,Ve,He.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Qe+1,Ke,He.width,He.height,0,be,Ve,He.data)}}else{$e?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,be,Ve,de[me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,Ke,be,Ve,de[me]);for(let Qe=0;Qe<Ge.length;Qe++){let He=Ge[Qe];$e?we&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Qe+1,0,0,be,Ve,He.image[me]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+me,Qe+1,Ke,be,Ve,He.image[me])}}}f(M)&&v(r.TEXTURE_CUBE_MAP),Y.__version=P.version,M.onUpdate&&M.onUpdate(M)}D.__version=M.version}(z,w,T):t.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture,r.TEXTURE0+T)},this.rebindTextures=function(w,T,z){let D=i.get(w);T!==void 0&&$(D.__webglFramebuffer,w,w.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),z!==void 0&&_e(w)},this.setupRenderTarget=function(w){let T=w.texture,z=i.get(w),D=i.get(T);w.addEventListener("dispose",R);let M=w.textures,C=w.isWebGLCubeRenderTarget===!0,B=M.length>1;if(B||(D.__webglTexture===void 0&&(D.__webglTexture=r.createTexture()),D.__version=T.version,a.memory.textures++),C){z.__webglFramebuffer=[];for(let P=0;P<6;P++)if(T.mipmaps&&T.mipmaps.length>0){z.__webglFramebuffer[P]=[];for(let Y=0;Y<T.mipmaps.length;Y++)z.__webglFramebuffer[P][Y]=r.createFramebuffer()}else z.__webglFramebuffer[P]=r.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){z.__webglFramebuffer=[];for(let P=0;P<T.mipmaps.length;P++)z.__webglFramebuffer[P]=r.createFramebuffer()}else z.__webglFramebuffer=r.createFramebuffer();if(B)for(let P=0,Y=M.length;P<Y;P++){let V=i.get(M[P]);V.__webglTexture===void 0&&(V.__webglTexture=r.createTexture(),a.memory.textures++)}if(w.samples>0&&re(w)===!1){z.__webglMultisampledFramebuffer=r.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let P=0;P<M.length;P++){let Y=M[P];z.__webglColorRenderbuffer[P]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,z.__webglColorRenderbuffer[P]);let V=s.convert(Y.format,Y.colorSpace),W=s.convert(Y.type),te=x(Y.internalFormat,V,W,Y.colorSpace,w.isXRRenderTarget===!0),le=ae(w);r.renderbufferStorageMultisample(r.RENDERBUFFER,le,te,w.width,w.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+P,r.RENDERBUFFER,z.__webglColorRenderbuffer[P])}r.bindRenderbuffer(r.RENDERBUFFER,null),w.depthBuffer&&(z.__webglDepthRenderbuffer=r.createRenderbuffer(),ue(z.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(C){t.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture),U(r.TEXTURE_CUBE_MAP,T);for(let P=0;P<6;P++)if(T.mipmaps&&T.mipmaps.length>0)for(let Y=0;Y<T.mipmaps.length;Y++)$(z.__webglFramebuffer[P][Y],w,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+P,Y);else $(z.__webglFramebuffer[P],w,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+P,0);f(T)&&v(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(B){for(let P=0,Y=M.length;P<Y;P++){let V=M[P],W=i.get(V),te=r.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(te=w.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(te,W.__webglTexture),U(te,V),$(z.__webglFramebuffer,w,V,r.COLOR_ATTACHMENT0+P,te,0),f(V)&&v(te)}t.unbindTexture()}else{let P=r.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(P=w.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(P,D.__webglTexture),U(P,T),T.mipmaps&&T.mipmaps.length>0)for(let Y=0;Y<T.mipmaps.length;Y++)$(z.__webglFramebuffer[Y],w,T,r.COLOR_ATTACHMENT0,P,Y);else $(z.__webglFramebuffer,w,T,r.COLOR_ATTACHMENT0,P,0);f(T)&&v(P),t.unbindTexture()}w.depthBuffer&&_e(w)},this.updateRenderTargetMipmap=function(w){let T=w.textures;for(let z=0,D=T.length;z<D;z++){let M=T[z];if(f(M)){let C=_(w),B=i.get(M).__webglTexture;t.bindTexture(C,B),v(C),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(w){if(w.samples>0){if(re(w)===!1){let T=w.textures,z=w.width,D=w.height,M=r.COLOR_BUFFER_BIT,C=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,B=i.get(w),P=T.length>1;if(P)for(let V=0;V<T.length;V++)t.bindFramebuffer(r.FRAMEBUFFER,B.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+V,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,B.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+V,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,B.__webglMultisampledFramebuffer);let Y=w.texture.mipmaps;Y&&Y.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,B.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,B.__webglFramebuffer);for(let V=0;V<T.length;V++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(M|=r.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(M|=r.STENCIL_BUFFER_BIT)),P){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,B.__webglColorRenderbuffer[V]);let W=i.get(T[V]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,W,0)}r.blitFramebuffer(0,0,z,D,0,0,z,D,M,r.NEAREST),l===!0&&(Ae.length=0,ne.length=0,Ae.push(r.COLOR_ATTACHMENT0+V),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Ae.push(C),ne.push(C),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,ne)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Ae))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),P)for(let V=0;V<T.length;V++){t.bindFramebuffer(r.FRAMEBUFFER,B.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+V,r.RENDERBUFFER,B.__webglColorRenderbuffer[V]);let W=i.get(T[V]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,B.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+V,r.TEXTURE_2D,W,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,B.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){let T=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[T])}}},this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=$,this.useMultisampledRTT=re}function Qm(r,e){return{convert:function(t,i=Nn){let n,s=Ze.getTransfer(i);if(t===Ui)return r.UNSIGNED_BYTE;if(t===xo)return r.UNSIGNED_SHORT_4_4_4_4;if(t===yo)return r.UNSIGNED_SHORT_5_5_5_1;if(t===Zl)return r.UNSIGNED_INT_5_9_9_9_REV;if(t===Jl)return r.UNSIGNED_INT_10F_11F_11F_REV;if(t===ql)return r.BYTE;if(t===Yl)return r.SHORT;if(t===Rr)return r.UNSIGNED_SHORT;if(t===_o)return r.INT;if(t===Dn)return r.UNSIGNED_INT;if(t===fi)return r.FLOAT;if(t===Pr)return r.HALF_FLOAT;if(t===bu)return r.ALPHA;if(t===Tu)return r.RGB;if(t===gi)return r.RGBA;if(t===Ps)return r.DEPTH_COMPONENT;if(t===Is)return r.DEPTH_STENCIL;if(t===Mo)return r.RED;if(t===So)return r.RED_INTEGER;if(t===wu)return r.RG;if(t===Kl)return r.RG_INTEGER;if(t===$l)return r.RGBA_INTEGER;if(t===bo||t===To||t===wo||t===Eo)if(s===nt){if(n=e.get("WEBGL_compressed_texture_s3tc_srgb"),n===null)return null;if(t===bo)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(t===To)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(t===wo)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(t===Eo)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(n=e.get("WEBGL_compressed_texture_s3tc"),n===null)return null;if(t===bo)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(t===To)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(t===wo)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(t===Eo)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(t===Ql||t===ec||t===tc||t===ic){if(n=e.get("WEBGL_compressed_texture_pvrtc"),n===null)return null;if(t===Ql)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(t===ec)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(t===tc)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(t===ic)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(t===nc||t===rc||t===sc){if(n=e.get("WEBGL_compressed_texture_etc"),n===null)return null;if(t===nc||t===rc)return s===nt?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(t===sc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC}if(t===ac||t===oc||t===lc||t===cc||t===hc||t===uc||t===dc||t===pc||t===mc||t===fc||t===gc||t===vc||t===_c||t===xc){if(n=e.get("WEBGL_compressed_texture_astc"),n===null)return null;if(t===ac)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(t===oc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(t===lc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(t===cc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(t===hc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(t===uc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(t===dc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(t===pc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(t===mc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(t===fc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(t===gc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(t===vc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(t===_c)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(t===xc)return s===nt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}if(t===yc||t===Mc||t===Sc){if(n=e.get("EXT_texture_compression_bptc"),n===null)return null;if(t===yc)return s===nt?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(t===Mc)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(t===Sc)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(t===bc||t===Tc||t===wc||t===Ec){if(n=e.get("EXT_texture_compression_rgtc"),n===null)return null;if(t===bc)return n.COMPRESSED_RED_RGTC1_EXT;if(t===Tc)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(t===wc)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(t===Ec)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return t===Ir?r.UNSIGNED_INT_24_8:r[t]!==void 0?r[t]:null}}}var jc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new us(e.texture);e.depthNear===t.depthNear&&e.depthFar===t.depthFar||(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new st({vertexShader:`
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

}`,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new se(new Ii(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},qc=class extends qi{constructor(e,t){super();let i=this,n=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,p=null,u=null,m=null,g=typeof XRWebGLBinding<"u",f=new jc,v={},_=t.getContextAttributes(),x=null,y=null,E=[],b=[],R=new J,I=null,L=new It;L.viewport=new Je;let G=new It;G.viewport=new Je;let H=[L,G],O=new ro,N=null,U=null;function k(ne){let ae=b.indexOf(ne.inputSource);if(ae===-1)return;let re=E[ae];re!==void 0&&(re.update(ne.inputSource,ne.frame,c||a),re.dispatchEvent({type:ne.type,data:ne.inputSource}))}function j(){n.removeEventListener("select",k),n.removeEventListener("selectstart",k),n.removeEventListener("selectend",k),n.removeEventListener("squeeze",k),n.removeEventListener("squeezestart",k),n.removeEventListener("squeezeend",k),n.removeEventListener("end",j),n.removeEventListener("inputsourceschange",K);for(let ne=0;ne<E.length;ne++){let ae=b[ne];ae!==null&&(b[ne]=null,E[ne].disconnect(ae))}N=null,U=null,f.reset();for(let ne in v)delete v[ne];e.setRenderTarget(x),u=null,p=null,d=null,n=null,y=null,Ae.stop(),i.isPresenting=!1,e.setPixelRatio(I),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}function K(ne){for(let ae=0;ae<ne.removed.length;ae++){let re=ne.removed[ae],Te=b.indexOf(re);Te>=0&&(b[Te]=null,E[Te].disconnect(re))}for(let ae=0;ae<ne.added.length;ae++){let re=ne.added[ae],Te=b.indexOf(re);if(Te===-1){for(let w=0;w<E.length;w++){if(w>=b.length){b.push(re),Te=w;break}if(b[w]===null){b[w]=re,Te=w;break}}if(Te===-1)break}let Ue=E[Te];Ue&&Ue.connect(re)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let ae=E[ne];return ae===void 0&&(ae=new vr,E[ne]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(ne){let ae=E[ne];return ae===void 0&&(ae=new vr,E[ne]=ae),ae.getGripSpace()},this.getHand=function(ne){let ae=E[ne];return ae===void 0&&(ae=new vr,E[ne]=ae),ae.getHandSpace()},this.setFramebufferScaleFactor=function(ne){s=ne,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){o=ne,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(ne){c=ne},this.getBaseLayer=function(){return p!==null?p:u},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(n,t)),d},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(ne){if(n=ne,n!==null){if(x=e.getRenderTarget(),n.addEventListener("select",k),n.addEventListener("selectstart",k),n.addEventListener("selectend",k),n.addEventListener("squeeze",k),n.addEventListener("squeezestart",k),n.addEventListener("squeezeend",k),n.addEventListener("end",j),n.addEventListener("inputsourceschange",K),_.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(R),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let ae=null,re=null,Te=null;_.depth&&(Te=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=_.stencil?Is:Ps,re=_.stencil?Ir:Dn);let Ue={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:s};d=this.getBinding(),p=d.createProjectionLayer(Ue),n.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),y=new Ri(p.textureWidth,p.textureHeight,{format:gi,type:Ui,depthTexture:new hs(p.textureWidth,p.textureHeight,re,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{let ae={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(n,t,ae),n.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new Ri(u.framebufferWidth,u.framebufferHeight,{format:gi,type:Ui,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),Ae.setContext(n),Ae.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};let $=new S,ue=new S;function Me(ne,ae){ae===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(ae.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(n===null)return;let ae=ne.near,re=ne.far;f.texture!==null&&(f.depthNear>0&&(ae=f.depthNear),f.depthFar>0&&(re=f.depthFar)),O.near=G.near=L.near=ae,O.far=G.far=L.far=re,N===O.near&&U===O.far||(n.updateRenderState({depthNear:O.near,depthFar:O.far}),N=O.near,U=O.far),O.layers.mask=6|ne.layers.mask,L.layers.mask=3&O.layers.mask,G.layers.mask=5&O.layers.mask;let Te=ne.parent,Ue=O.cameras;Me(O,Te);for(let w=0;w<Ue.length;w++)Me(Ue[w],Te);Ue.length===2?function(w,T,z){$.setFromMatrixPosition(T.matrixWorld),ue.setFromMatrixPosition(z.matrixWorld);let D=$.distanceTo(ue),M=T.projectionMatrix.elements,C=z.projectionMatrix.elements,B=M[14]/(M[10]-1),P=M[14]/(M[10]+1),Y=(M[9]+1)/M[5],V=(M[9]-1)/M[5],W=(M[8]-1)/M[0],te=(C[8]+1)/C[0],le=B*W,ie=B*te,de=D/(-W+te),xe=de*-W;if(T.matrixWorld.decompose(w.position,w.quaternion,w.scale),w.translateX(xe),w.translateZ(de),w.matrixWorld.compose(w.position,w.quaternion,w.scale),w.matrixWorldInverse.copy(w.matrixWorld).invert(),M[10]===-1)w.projectionMatrix.copy(T.projectionMatrix),w.projectionMatrixInverse.copy(T.projectionMatrixInverse);else{let be=B+de,Ve=P+de,Ke=le-xe,$e=ie+(D-xe),ce=Y*P/Ve*be,we=V*P/Ve*be;w.projectionMatrix.makePerspective(Ke,$e,ce,we,be,Ve),w.projectionMatrixInverse.copy(w.projectionMatrix).invert()}}(O,L,G):O.projectionMatrix.copy(L.projectionMatrix),function(w,T,z){z===null?w.matrix.copy(T.matrixWorld):(w.matrix.copy(z.matrixWorld),w.matrix.invert(),w.matrix.multiply(T.matrixWorld)),w.matrix.decompose(w.position,w.quaternion,w.scale),w.updateMatrixWorld(!0),w.projectionMatrix.copy(T.projectionMatrix),w.projectionMatrixInverse.copy(T.projectionMatrixInverse),w.isPerspectiveCamera&&(w.fov=2*dr*Math.atan(1/w.projectionMatrix.elements[5]),w.zoom=1)}(ne,O,Te)},this.getCamera=function(){return O},this.getFoveation=function(){if(p!==null||u!==null)return l},this.setFoveation=function(ne){l=ne,p!==null&&(p.fixedFoveation=ne),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=ne)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(O)},this.getCameraTexture=function(ne){return v[ne]};let _e=null,Ae=new md;Ae.setAnimationLoop(function(ne,ae){if(h=ae.getViewerPose(c||a),m=ae,h!==null){let re=h.views;u!==null&&(e.setRenderTargetFramebuffer(y,u.framebuffer),e.setRenderTarget(y));let Te=!1;re.length!==O.cameras.length&&(O.cameras.length=0,Te=!0);for(let w=0;w<re.length;w++){let T=re[w],z=null;if(u!==null)z=u.getViewport(T);else{let M=d.getViewSubImage(p,T);z=M.viewport,w===0&&(e.setRenderTargetTextures(y,M.colorTexture,M.depthStencilTexture),e.setRenderTarget(y))}let D=H[w];D===void 0&&(D=new It,D.layers.enable(w),D.viewport=new Je,H[w]=D),D.matrix.fromArray(T.transform.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale),D.projectionMatrix.fromArray(T.projectionMatrix),D.projectionMatrixInverse.copy(D.projectionMatrix).invert(),D.viewport.set(z.x,z.y,z.width,z.height),w===0&&(O.matrix.copy(D.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Te===!0&&O.cameras.push(D)}let Ue=n.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&g){d=i.getBinding();let w=d.getDepthInformation(re[0]);w&&w.isValid&&w.texture&&f.init(w,n.renderState)}if(Ue&&Ue.includes("camera-access")&&g){e.state.unbindTexture(),d=i.getBinding();for(let w=0;w<re.length;w++){let T=re[w].camera;if(T){let z=v[T];z||(z=new us,v[T]=z);let D=d.getCameraImage(T);z.sourceTexture=D}}}}for(let re=0;re<E.length;re++){let Te=b[re],Ue=E[re];Te!==null&&Ue!==void 0&&Ue.update(Te,ae,c||a)}_e&&_e(ne,ae),ae.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ae}),m=null}),this.setAnimationLoop=function(ne){_e=ne},this.dispose=function(){}}},On=new ze,ef=new ge;function tf(r,e){function t(n,s){n.matrixAutoUpdate===!0&&n.updateMatrix(),s.value.copy(n.matrix)}function i(n,s){n.opacity.value=s.opacity,s.color&&n.diffuse.value.copy(s.color),s.emissive&&n.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(n.map.value=s.map,t(s.map,n.mapTransform)),s.alphaMap&&(n.alphaMap.value=s.alphaMap,t(s.alphaMap,n.alphaMapTransform)),s.bumpMap&&(n.bumpMap.value=s.bumpMap,t(s.bumpMap,n.bumpMapTransform),n.bumpScale.value=s.bumpScale,s.side===Vt&&(n.bumpScale.value*=-1)),s.normalMap&&(n.normalMap.value=s.normalMap,t(s.normalMap,n.normalMapTransform),n.normalScale.value.copy(s.normalScale),s.side===Vt&&n.normalScale.value.negate()),s.displacementMap&&(n.displacementMap.value=s.displacementMap,t(s.displacementMap,n.displacementMapTransform),n.displacementScale.value=s.displacementScale,n.displacementBias.value=s.displacementBias),s.emissiveMap&&(n.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,n.emissiveMapTransform)),s.specularMap&&(n.specularMap.value=s.specularMap,t(s.specularMap,n.specularMapTransform)),s.alphaTest>0&&(n.alphaTest.value=s.alphaTest);let a=e.get(s),o=a.envMap,l=a.envMapRotation;o&&(n.envMap.value=o,On.copy(l),On.x*=-1,On.y*=-1,On.z*=-1,o.isCubeTexture&&o.isRenderTargetTexture===!1&&(On.y*=-1,On.z*=-1),n.envMapRotation.value.setFromMatrix4(ef.makeRotationFromEuler(On)),n.flipEnvMap.value=o.isCubeTexture&&o.isRenderTargetTexture===!1?-1:1,n.reflectivity.value=s.reflectivity,n.ior.value=s.ior,n.refractionRatio.value=s.refractionRatio),s.lightMap&&(n.lightMap.value=s.lightMap,n.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,n.lightMapTransform)),s.aoMap&&(n.aoMap.value=s.aoMap,n.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,n.aoMapTransform))}return{refreshFogUniforms:function(n,s){s.color.getRGB(n.fogColor.value,Pc(r)),s.isFog?(n.fogNear.value=s.near,n.fogFar.value=s.far):s.isFogExp2&&(n.fogDensity.value=s.density)},refreshMaterialUniforms:function(n,s,a,o,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?i(n,s):s.isMeshToonMaterial?(i(n,s),function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)}(n,s)):s.isMeshPhongMaterial?(i(n,s),function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)}(n,s)):s.isMeshStandardMaterial?(i(n,s),function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),h.envMap&&(c.envMapIntensity.value=h.envMapIntensity)}(n,s),s.isMeshPhysicalMaterial&&function(c,h,d){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Vt&&c.clearcoatNormalScale.value.negate())),h.dispersion>0&&(c.dispersion.value=h.dispersion),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=d.texture,c.transmissionSamplerSize.value.set(d.width,d.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))}(n,s,l)):s.isMeshMatcapMaterial?(i(n,s),function(c,h){h.matcap&&(c.matcap.value=h.matcap)}(n,s)):s.isMeshDepthMaterial?i(n,s):s.isMeshDistanceMaterial?(i(n,s),function(c,h){let d=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(d.matrixWorld),c.nearDistance.value=d.shadow.camera.near,c.farDistance.value=d.shadow.camera.far}(n,s)):s.isMeshNormalMaterial?i(n,s):s.isLineBasicMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))}(n,s),s.isLineDashedMaterial&&function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale}(n,s)):s.isPointsMaterial?function(c,h,d,p){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*d,c.scale.value=.5*p,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)}(n,s,a,o):s.isSpriteMaterial?function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)}(n,s):s.isShadowMaterial?(n.color.value.copy(s.color),n.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function nf(r,e,t,i){let n={},s={},a=[],o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(d,p,u,m){let g=d.value,f=p+"_"+u;if(m[f]===void 0)return m[f]=typeof g=="number"||typeof g=="boolean"?g:g.clone(),!0;{let v=m[f];if(typeof g=="number"||typeof g=="boolean"){if(v!==g)return m[f]=g,!0}else if(v.equals(g)===!1)return v.copy(g),!0}return!1}function c(d){let p={boundary:0,storage:0};return typeof d=="number"||typeof d=="boolean"?(p.boundary=4,p.storage=4):d.isVector2?(p.boundary=8,p.storage=8):d.isVector3||d.isColor?(p.boundary=16,p.storage=12):d.isVector4?(p.boundary=16,p.storage=16):d.isMatrix3?(p.boundary=48,p.storage=48):d.isMatrix4?(p.boundary=64,p.storage=64):d.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",d),p}function h(d){let p=d.target;p.removeEventListener("dispose",h);let u=a.indexOf(p.__bindingPointIndex);a.splice(u,1),r.deleteBuffer(n[p.id]),delete n[p.id],delete s[p.id]}return{bind:function(d,p){let u=p.program;i.uniformBlockBinding(d,u)},update:function(d,p){let u=n[d.id];u===void 0&&(function(f){let v=f.uniforms,_=0,x=16;for(let E=0,b=v.length;E<b;E++){let R=Array.isArray(v[E])?v[E]:[v[E]];for(let I=0,L=R.length;I<L;I++){let G=R[I],H=Array.isArray(G.value)?G.value:[G.value];for(let O=0,N=H.length;O<N;O++){let U=c(H[O]),k=_%x,j=k%U.boundary,K=k+j;_+=j,K!==0&&x-K<U.storage&&(_+=x-K),G.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=_,_+=U.storage}}}let y=_%x;y>0&&(_+=x-y),f.__size=_,f.__cache={}}(d),u=function(f){let v=function(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}();f.__bindingPointIndex=v;let _=r.createBuffer(),x=f.__size,y=f.usage;return r.bindBuffer(r.UNIFORM_BUFFER,_),r.bufferData(r.UNIFORM_BUFFER,x,y),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,v,_),_}(d),n[d.id]=u,d.addEventListener("dispose",h));let m=p.program;i.updateUBOMapping(d,m);let g=e.render.frame;s[d.id]!==g&&(function(f){let v=n[f.id],_=f.uniforms,x=f.__cache;r.bindBuffer(r.UNIFORM_BUFFER,v);for(let y=0,E=_.length;y<E;y++){let b=Array.isArray(_[y])?_[y]:[_[y]];for(let R=0,I=b.length;R<I;R++){let L=b[R];if(l(L,y,R,x)===!0){let G=L.__offset,H=Array.isArray(L.value)?L.value:[L.value],O=0;for(let N=0;N<H.length;N++){let U=H[N],k=c(U);typeof U=="number"||typeof U=="boolean"?(L.__data[0]=U,r.bufferSubData(r.UNIFORM_BUFFER,G+O,L.__data)):U.isMatrix3?(L.__data[0]=U.elements[0],L.__data[1]=U.elements[1],L.__data[2]=U.elements[2],L.__data[3]=0,L.__data[4]=U.elements[3],L.__data[5]=U.elements[4],L.__data[6]=U.elements[5],L.__data[7]=0,L.__data[8]=U.elements[6],L.__data[9]=U.elements[7],L.__data[10]=U.elements[8],L.__data[11]=0):(U.toArray(L.__data,O),O+=k.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,G,L.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}(d),s[d.id]=g)},dispose:function(){for(let d in n)r.deleteBuffer(n[d]);a=[],n={},s={}}}}var Po=class{constructor(e={}){let{canvas:t=Fu(),context:i=null,depth:n=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:p=!1}=e,u;if(this.isWebGLRenderer=!0,i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=a;let m=new Uint32Array(4),g=new Int32Array(4),f=null,v=null,_=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ji,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,E=!1;this._outputColorSpace=Mt;let b=0,R=0,I=null,L=-1,G=null,H=new Je,O=new Je,N=null,U=new ve(0),k=0,j=t.width,K=t.height,$=1,ue=null,Me=null,_e=new Je(0,0,j,K),Ae=new Je(0,0,j,K),ne=!1,ae=new cn,re=!1,Te=!1,Ue=new ge,w=new S,T=new Je,z={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},D=!1;function M(){return I===null?$:1}let C,B,P,Y,V,W,te,le,ie,de,xe,be,Ve,Ke,$e,ce,we,Ge,Ut,me,Qe,He,si,Oi,F=i;function wt(A,X){return t.getContext(A,X)}try{let A={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ma}`),t.addEventListener("webglcontextlost",_n,!1),t.addEventListener("webglcontextrestored",xn,!1),t.addEventListener("webglcontextcreationerror",Or,!1),F===null){let X="webgl2";if(F=wt(X,A),F===null)throw wt(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}function Dt(){C=new Op(F),C.init(),He=new Qm(F,C),B=new Up(F,C,e,He),P=new Km(F,C),B.reversedDepthBuffer&&p&&P.buffers.depth.setReversed(!0),Y=new kp(F),V=new km,W=new $m(F,C,P,V,B,He,Y),te=new Np(y),le=new Bp(y),ie=new Cp(F),si=new Ip(F,ie),de=new zp(F,ie,Y,si),xe=new Hp(F,de,ie,Y),Ut=new Vp(F,B,W),ce=new Dp(V),be=new Gm(y,te,le,C,B,si,ce),Ve=new tf(y,V),Ke=new Hm,$e=new Ym(C),Ge=new Pp(y,te,le,P,xe,u,l),we=new Zm(y,xe,B),Oi=new nf(F,Y,B,P),me=new Lp(F,C,Y),Qe=new Gp(F,C,Y),Y.programs=be.programs,y.capabilities=B,y.extensions=C,y.properties=V,y.renderLists=Ke,y.shadowMap=we,y.state=P,y.info=Y}Dt();let dt=new qc(y,F);function _n(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function xn(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let A=Y.autoReset,X=we.enabled,Z=we.autoUpdate,Q=we.needsUpdate,q=we.type;Dt(),Y.autoReset=A,we.enabled=X,we.autoUpdate=Z,we.needsUpdate=Q,we.type=q}function Or(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Fs(A){let X=A.target;X.removeEventListener("dispose",Fs),function(Z){(function(Q){let q=V.get(Q).programs;q!==void 0&&(q.forEach(function(ee){be.releaseProgram(ee)}),Q.isShaderMaterial&&be.releaseShaderCache(Q))})(Z),V.remove(Z)}(X)}function qo(A,X,Z){A.transparent===!0&&A.side===vt&&A.forceSinglePass===!1?(A.side=Vt,A.needsUpdate=!0,Os(A,X,Z),A.side=pn,A.needsUpdate=!0,Os(A,X,Z),A.side=vt):Os(A,X,Z)}this.xr=dt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let A=C.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=C.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(A){A!==void 0&&($=A,this.setSize(j,K,!1))},this.getSize=function(A){return A.set(j,K)},this.setSize=function(A,X,Z=!0){dt.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(j=A,K=X,t.width=Math.floor(A*$),t.height=Math.floor(X*$),Z===!0&&(t.style.width=A+"px",t.style.height=X+"px"),this.setViewport(0,0,A,X))},this.getDrawingBufferSize=function(A){return A.set(j*$,K*$).floor()},this.setDrawingBufferSize=function(A,X,Z){j=A,K=X,$=Z,t.width=Math.floor(A*Z),t.height=Math.floor(X*Z),this.setViewport(0,0,A,X)},this.getCurrentViewport=function(A){return A.copy(H)},this.getViewport=function(A){return A.copy(_e)},this.setViewport=function(A,X,Z,Q){A.isVector4?_e.set(A.x,A.y,A.z,A.w):_e.set(A,X,Z,Q),P.viewport(H.copy(_e).multiplyScalar($).round())},this.getScissor=function(A){return A.copy(Ae)},this.setScissor=function(A,X,Z,Q){A.isVector4?Ae.set(A.x,A.y,A.z,A.w):Ae.set(A,X,Z,Q),P.scissor(O.copy(Ae).multiplyScalar($).round())},this.getScissorTest=function(){return ne},this.setScissorTest=function(A){P.setScissorTest(ne=A)},this.setOpaqueSort=function(A){ue=A},this.setTransparentSort=function(A){Me=A},this.getClearColor=function(A){return A.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(A=!0,X=!0,Z=!0){let Q=0;if(A){let q=!1;if(I!==null){let ee=I.texture.format;q=ee===$l||ee===Kl||ee===So}if(q){let ee=I.texture.type,he=ee===Ui||ee===Dn||ee===Rr||ee===Ir||ee===xo||ee===yo,pe=Ge.getClearColor(),ye=Ge.getClearAlpha(),Ce=pe.r,Pe=pe.g,Re=pe.b;he?(m[0]=Ce,m[1]=Pe,m[2]=Re,m[3]=ye,F.clearBufferuiv(F.COLOR,0,m)):(g[0]=Ce,g[1]=Pe,g[2]=Re,g[3]=ye,F.clearBufferiv(F.COLOR,0,g))}else Q|=F.COLOR_BUFFER_BIT}X&&(Q|=F.DEPTH_BUFFER_BIT),Z&&(Q|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",_n,!1),t.removeEventListener("webglcontextrestored",xn,!1),t.removeEventListener("webglcontextcreationerror",Or,!1),Ge.dispose(),Ke.dispose(),$e.dispose(),V.dispose(),te.dispose(),le.dispose(),xe.dispose(),si.dispose(),Oi.dispose(),be.dispose(),dt.dispose(),dt.removeEventListener("sessionstart",th),dt.removeEventListener("sessionend",ih),yn.stop()},this.renderBufferDirect=function(A,X,Z,Q,q,ee){X===null&&(X=z);let he=q.isMesh&&q.matrixWorld.determinant()<0,pe=function(We,pt,Pt,Oe,Ie){pt.isScene!==!0&&(pt=z),W.resetTextureUnits();let ai=pt.fog,Jo=Oe.isMeshStandardMaterial?pt.environment:null,zs=I===null?y.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:An,$i=(Oe.isMeshStandardMaterial?le:te).get(Oe.envMap||Jo),xi=Oe.vertexColors===!0&&!!Pt.attributes.color&&Pt.attributes.color.itemSize===4,Hn=!!Pt.attributes.tangent&&(!!Oe.normalMap||Oe.anisotropy>0),zi=!!Pt.morphAttributes.position,Ko=!!Pt.morphAttributes.normal,Wn=!!Pt.morphAttributes.color,lh=Ji;Oe.toneMapped&&(I!==null&&I.isXRRenderTarget!==!0||(lh=y.toneMapping));let ch=Pt.morphAttributes.position||Pt.morphAttributes.normal||Pt.morphAttributes.color,zd=ch!==void 0?ch.length:0,Xe=V.get(Oe),Gd=v.state.lights;if(re===!0&&(Te===!0||We!==G)){let Qt=We===G&&Oe.id===L;ce.setState(Oe,We,Qt)}let oi=!1;Oe.version===Xe.__version?Xe.needsLights&&Xe.lightsStateVersion!==Gd.state.version||Xe.outputColorSpace!==zs||Ie.isBatchedMesh&&Xe.batching===!1?oi=!0:Ie.isBatchedMesh||Xe.batching!==!0?Ie.isBatchedMesh&&Xe.batchingColor===!0&&Ie.colorTexture===null||Ie.isBatchedMesh&&Xe.batchingColor===!1&&Ie.colorTexture!==null||Ie.isInstancedMesh&&Xe.instancing===!1?oi=!0:Ie.isInstancedMesh||Xe.instancing!==!0?Ie.isSkinnedMesh&&Xe.skinning===!1?oi=!0:Ie.isSkinnedMesh||Xe.skinning!==!0?Ie.isInstancedMesh&&Xe.instancingColor===!0&&Ie.instanceColor===null||Ie.isInstancedMesh&&Xe.instancingColor===!1&&Ie.instanceColor!==null||Ie.isInstancedMesh&&Xe.instancingMorph===!0&&Ie.morphTexture===null||Ie.isInstancedMesh&&Xe.instancingMorph===!1&&Ie.morphTexture!==null||Xe.envMap!==$i||Oe.fog===!0&&Xe.fog!==ai?oi=!0:Xe.numClippingPlanes===void 0||Xe.numClippingPlanes===ce.numPlanes&&Xe.numIntersection===ce.numIntersection?(Xe.vertexAlphas!==xi||Xe.vertexTangents!==Hn||Xe.morphTargets!==zi||Xe.morphNormals!==Ko||Xe.morphColors!==Wn||Xe.toneMapping!==lh||Xe.morphTargetsCount!==zd)&&(oi=!0):oi=!0:oi=!0:oi=!0:oi=!0:(oi=!0,Xe.__version=Oe.version);let Mn=Xe.currentProgram;oi===!0&&(Mn=Os(Oe,pt,Ie));let hh=!1,zr=!1,$o=!1,xt=Mn.getUniforms(),Qi=Xe.uniforms;if(P.useProgram(Mn.program)&&(hh=!0,zr=!0,$o=!0),Oe.id!==L&&(L=Oe.id,zr=!0),hh||G!==We){P.buffers.depth.getReversed()&&We.reversedDepth!==!0&&(We._reversedDepth=!0,We.updateProjectionMatrix()),xt.setValue(F,"projectionMatrix",We.projectionMatrix),xt.setValue(F,"viewMatrix",We.matrixWorldInverse);let Qt=xt.map.cameraPosition;Qt!==void 0&&Qt.setValue(F,w.setFromMatrixPosition(We.matrixWorld)),B.logarithmicDepthBuffer&&xt.setValue(F,"logDepthBufFC",2/(Math.log(We.far+1)/Math.LN2)),(Oe.isMeshPhongMaterial||Oe.isMeshToonMaterial||Oe.isMeshLambertMaterial||Oe.isMeshBasicMaterial||Oe.isMeshStandardMaterial||Oe.isShaderMaterial)&&xt.setValue(F,"isOrthographic",We.isOrthographicCamera===!0),G!==We&&(G=We,zr=!0,$o=!0)}if(Ie.isSkinnedMesh){xt.setOptional(F,Ie,"bindMatrix"),xt.setOptional(F,Ie,"bindMatrixInverse");let Qt=Ie.skeleton;Qt&&(Qt.boneTexture===null&&Qt.computeBoneTexture(),xt.setValue(F,"boneTexture",Qt.boneTexture,W))}Ie.isBatchedMesh&&(xt.setOptional(F,Ie,"batchingTexture"),xt.setValue(F,"batchingTexture",Ie._matricesTexture,W),xt.setOptional(F,Ie,"batchingIdTexture"),xt.setValue(F,"batchingIdTexture",Ie._indirectTexture,W),xt.setOptional(F,Ie,"batchingColorTexture"),Ie._colorsTexture!==null&&xt.setValue(F,"batchingColorTexture",Ie._colorsTexture,W));let Qo=Pt.morphAttributes;Qo.position===void 0&&Qo.normal===void 0&&Qo.color===void 0||Ut.update(Ie,Pt,Mn),(zr||Xe.receiveShadow!==Ie.receiveShadow)&&(Xe.receiveShadow=Ie.receiveShadow,xt.setValue(F,"receiveShadow",Ie.receiveShadow)),Oe.isMeshGouraudMaterial&&Oe.envMap!==null&&(Qi.envMap.value=$i,Qi.flipEnvMap.value=$i.isCubeTexture&&$i.isRenderTargetTexture===!1?-1:1),Oe.isMeshStandardMaterial&&Oe.envMap===null&&pt.environment!==null&&(Qi.envMapIntensity.value=pt.environmentIntensity),zr&&(xt.setValue(F,"toneMappingExposure",y.toneMappingExposure),Xe.needsLights&&(li=$o,(yi=Qi).ambientLightColor.needsUpdate=li,yi.lightProbe.needsUpdate=li,yi.directionalLights.needsUpdate=li,yi.directionalLightShadows.needsUpdate=li,yi.pointLights.needsUpdate=li,yi.pointLightShadows.needsUpdate=li,yi.spotLights.needsUpdate=li,yi.spotLightShadows.needsUpdate=li,yi.rectAreaLights.needsUpdate=li,yi.hemisphereLights.needsUpdate=li),ai&&Oe.fog===!0&&Ve.refreshFogUniforms(Qi,ai),Ve.refreshMaterialUniforms(Qi,Oe,$,K,v.state.transmissionRenderTarget[We.id]),Ur.upload(F,ah(Xe),Qi,W));var yi,li;if(Oe.isShaderMaterial&&Oe.uniformsNeedUpdate===!0&&(Ur.upload(F,ah(Xe),Qi,W),Oe.uniformsNeedUpdate=!1),Oe.isSpriteMaterial&&xt.setValue(F,"center",Ie.center),xt.setValue(F,"modelViewMatrix",Ie.modelViewMatrix),xt.setValue(F,"normalMatrix",Ie.normalMatrix),xt.setValue(F,"modelMatrix",Ie.matrixWorld),Oe.isShaderMaterial||Oe.isRawShaderMaterial){let Qt=Oe.uniformsGroups;for(let el=0,kd=Qt.length;el<kd;el++){let uh=Qt[el];Oi.update(uh,Mn),Oi.bind(uh,Mn)}}return Mn}(A,X,Z,Q,q);P.setMaterial(Q,he);let ye=Z.index,Ce=1;if(Q.wireframe===!0){if(ye=de.getWireframeAttribute(Z),ye===void 0)return;Ce=2}let Pe=Z.drawRange,Re=Z.attributes.position,Be=Pe.start*Ce,ct=(Pe.start+Pe.count)*Ce;ee!==null&&(Be=Math.max(Be,ee.start*Ce),ct=Math.min(ct,(ee.start+ee.count)*Ce)),ye!==null?(Be=Math.max(Be,0),ct=Math.min(ct,ye.count)):Re!=null&&(Be=Math.max(Be,0),ct=Math.min(ct,Re.count));let ft=ct-Be;if(ft<0||ft===1/0)return;let _t;si.setup(q,Q,pe,Z,ye);let ht=me;if(ye!==null&&(_t=ie.get(ye),ht=Qe,ht.setIndex(_t)),q.isMesh)Q.wireframe===!0?(P.setLineWidth(Q.wireframeLinewidth*M()),ht.setMode(F.LINES)):ht.setMode(F.TRIANGLES);else if(q.isLine){let We=Q.linewidth;We===void 0&&(We=1),P.setLineWidth(We*M()),q.isLineSegments?ht.setMode(F.LINES):q.isLineLoop?ht.setMode(F.LINE_LOOP):ht.setMode(F.LINE_STRIP)}else q.isPoints?ht.setMode(F.POINTS):q.isSprite&&ht.setMode(F.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)mr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ht.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(C.get("WEBGL_multi_draw"))ht.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let We=q._multiDrawStarts,pt=q._multiDrawCounts,Pt=q._multiDrawCount,Oe=ye?ie.get(ye).bytesPerElement:1,Ie=V.get(Q).currentProgram.getUniforms();for(let ai=0;ai<Pt;ai++)Ie.setValue(F,"_gl_DrawID",ai),ht.render(We[ai]/Oe,pt[ai])}else if(q.isInstancedMesh)ht.renderInstances(Be,ft,q.count);else if(Z.isInstancedBufferGeometry){let We=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,pt=Math.min(Z.instanceCount,We);ht.renderInstances(Be,ft,pt)}else ht.render(Be,ft)},this.compile=function(A,X,Z=null){Z===null&&(Z=A),v=$e.get(Z),v.init(X),x.push(v),Z.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(v.pushLight(q),q.castShadow&&v.pushShadow(q))}),A!==Z&&A.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(v.pushLight(q),q.castShadow&&v.pushShadow(q))}),v.setupLights();let Q=new Set;return A.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let ee=q.material;if(ee)if(Array.isArray(ee))for(let he=0;he<ee.length;he++){let pe=ee[he];qo(pe,Z,q),Q.add(pe)}else qo(ee,Z,q),Q.add(ee)}),v=x.pop(),Q},this.compileAsync=function(A,X,Z=null){let Q=this.compile(A,X,Z);return new Promise(q=>{function ee(){Q.forEach(function(he){V.get(he).currentProgram.isReady()&&Q.delete(he)}),Q.size!==0?setTimeout(ee,10):q(A)}C.get("KHR_parallel_shader_compile")!==null?ee():setTimeout(ee,10)})};let Yo=null;function th(){yn.stop()}function ih(){yn.start()}let yn=new md;function Zo(A,X,Z,Q){if(A.visible===!1)return;if(A.layers.test(X.layers)){if(A.isGroup)Z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(X);else if(A.isLight)v.pushLight(A),A.castShadow&&v.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ae.intersectsSprite(A)){Q&&T.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Ue);let ee=xe.update(A),he=A.material;he.visible&&f.push(A,ee,he,Z,T.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ae.intersectsObject(A))){let ee=xe.update(A),he=A.material;if(Q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),T.copy(A.boundingSphere.center)):(ee.boundingSphere===null&&ee.computeBoundingSphere(),T.copy(ee.boundingSphere.center)),T.applyMatrix4(A.matrixWorld).applyMatrix4(Ue)),Array.isArray(he)){let pe=ee.groups;for(let ye=0,Ce=pe.length;ye<Ce;ye++){let Pe=pe[ye],Re=he[Pe.materialIndex];Re&&Re.visible&&f.push(A,ee,Re,Z,T.z,Pe)}}else he.visible&&f.push(A,ee,he,Z,T.z,null)}}let q=A.children;for(let ee=0,he=q.length;ee<he;ee++)Zo(q[ee],X,Z,Q)}function nh(A,X,Z,Q){let q=A.opaque,ee=A.transmissive,he=A.transparent;v.setupLightsView(Z),re===!0&&ce.setGlobalState(y.clippingPlanes,Z),Q&&P.viewport(H.copy(Q)),q.length>0&&Bs(q,X,Z),ee.length>0&&Bs(ee,X,Z),he.length>0&&Bs(he,X,Z),P.buffers.depth.setTest(!0),P.buffers.depth.setMask(!0),P.buffers.color.setMask(!0),P.setPolygonOffset(!1)}function rh(A,X,Z,Q){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[Q.id]===void 0&&(v.state.transmissionRenderTarget[Q.id]=new Ri(1,1,{generateMipmaps:!0,type:C.has("EXT_color_buffer_half_float")||C.has("EXT_color_buffer_float")?Pr:Ui,minFilter:Un,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ze.workingColorSpace}));let q=v.state.transmissionRenderTarget[Q.id],ee=Q.viewport||H;q.setSize(ee.z*y.transmissionResolutionScale,ee.w*y.transmissionResolutionScale);let he=y.getRenderTarget(),pe=y.getActiveCubeFace(),ye=y.getActiveMipmapLevel();y.setRenderTarget(q),y.getClearColor(U),k=y.getClearAlpha(),k<1&&y.setClearColor(16777215,.5),y.clear(),D&&Ge.render(Z);let Ce=y.toneMapping;y.toneMapping=Ji;let Pe=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),v.setupLightsView(Q),re===!0&&ce.setGlobalState(y.clippingPlanes,Q),Bs(A,Z,Q),W.updateMultisampleRenderTarget(q),W.updateRenderTargetMipmap(q),C.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let Be=0,ct=X.length;Be<ct;Be++){let ft=X[Be],_t=ft.object,ht=ft.geometry,We=ft.material,pt=ft.group;if(We.side===vt&&_t.layers.test(Q.layers)){let Pt=We.side;We.side=Vt,We.needsUpdate=!0,sh(_t,Z,Q,ht,We,pt),We.side=Pt,We.needsUpdate=!0,Re=!0}}Re===!0&&(W.updateMultisampleRenderTarget(q),W.updateRenderTargetMipmap(q))}y.setRenderTarget(he,pe,ye),y.setClearColor(U,k),Pe!==void 0&&(Q.viewport=Pe),y.toneMapping=Ce}function Bs(A,X,Z){let Q=X.isScene===!0?X.overrideMaterial:null;for(let q=0,ee=A.length;q<ee;q++){let he=A[q],pe=he.object,ye=he.geometry,Ce=he.group,Pe=he.material;Pe.allowOverride===!0&&Q!==null&&(Pe=Q),pe.layers.test(Z.layers)&&sh(pe,X,Z,ye,Pe,Ce)}}function sh(A,X,Z,Q,q,ee){A.onBeforeRender(y,X,Z,Q,q,ee),A.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),q.onBeforeRender(y,X,Z,Q,A,ee),q.transparent===!0&&q.side===vt&&q.forceSinglePass===!1?(q.side=Vt,q.needsUpdate=!0,y.renderBufferDirect(Z,X,Q,q,A,ee),q.side=pn,q.needsUpdate=!0,y.renderBufferDirect(Z,X,Q,q,A,ee),q.side=vt):y.renderBufferDirect(Z,X,Q,q,A,ee),A.onAfterRender(y,X,Z,Q,q,ee)}function Os(A,X,Z){X.isScene!==!0&&(X=z);let Q=V.get(A),q=v.state.lights,ee=v.state.shadowsArray,he=q.state.version,pe=be.getParameters(A,q.state,ee,X,Z),ye=be.getProgramCacheKey(pe),Ce=Q.programs;Q.environment=A.isMeshStandardMaterial?X.environment:null,Q.fog=X.fog,Q.envMap=(A.isMeshStandardMaterial?le:te).get(A.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&A.envMap===null?X.environmentRotation:A.envMapRotation,Ce===void 0&&(A.addEventListener("dispose",Fs),Ce=new Map,Q.programs=Ce);let Pe=Ce.get(ye);if(Pe!==void 0){if(Q.currentProgram===Pe&&Q.lightsStateVersion===he)return oh(A,pe),Pe}else pe.uniforms=be.getUniforms(A),A.onBeforeCompile(pe,y),Pe=be.acquireProgram(pe,ye),Ce.set(ye,Pe),Q.uniforms=pe.uniforms;let Re=Q.uniforms;return(A.isShaderMaterial||A.isRawShaderMaterial)&&A.clipping!==!0||(Re.clippingPlanes=ce.uniform),oh(A,pe),Q.needsLights=function(Be){return Be.isMeshLambertMaterial||Be.isMeshToonMaterial||Be.isMeshPhongMaterial||Be.isMeshStandardMaterial||Be.isShadowMaterial||Be.isShaderMaterial&&Be.lights===!0}(A),Q.lightsStateVersion=he,Q.needsLights&&(Re.ambientLightColor.value=q.state.ambient,Re.lightProbe.value=q.state.probe,Re.directionalLights.value=q.state.directional,Re.directionalLightShadows.value=q.state.directionalShadow,Re.spotLights.value=q.state.spot,Re.spotLightShadows.value=q.state.spotShadow,Re.rectAreaLights.value=q.state.rectArea,Re.ltc_1.value=q.state.rectAreaLTC1,Re.ltc_2.value=q.state.rectAreaLTC2,Re.pointLights.value=q.state.point,Re.pointLightShadows.value=q.state.pointShadow,Re.hemisphereLights.value=q.state.hemi,Re.directionalShadowMap.value=q.state.directionalShadowMap,Re.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Re.spotShadowMap.value=q.state.spotShadowMap,Re.spotLightMatrix.value=q.state.spotLightMatrix,Re.spotLightMap.value=q.state.spotLightMap,Re.pointShadowMap.value=q.state.pointShadowMap,Re.pointShadowMatrix.value=q.state.pointShadowMatrix),Q.currentProgram=Pe,Q.uniformsList=null,Pe}function ah(A){if(A.uniformsList===null){let X=A.currentProgram.getUniforms();A.uniformsList=Ur.seqWithValue(X.seq,A.uniforms)}return A.uniformsList}function oh(A,X){let Z=V.get(A);Z.outputColorSpace=X.outputColorSpace,Z.batching=X.batching,Z.batchingColor=X.batchingColor,Z.instancing=X.instancing,Z.instancingColor=X.instancingColor,Z.instancingMorph=X.instancingMorph,Z.skinning=X.skinning,Z.morphTargets=X.morphTargets,Z.morphNormals=X.morphNormals,Z.morphColors=X.morphColors,Z.morphTargetsCount=X.morphTargetsCount,Z.numClippingPlanes=X.numClippingPlanes,Z.numIntersection=X.numClipIntersection,Z.vertexAlphas=X.vertexAlphas,Z.vertexTangents=X.vertexTangents,Z.toneMapping=X.toneMapping}yn.setAnimationLoop(function(A){Yo&&Yo(A)}),typeof self<"u"&&yn.setContext(self),this.setAnimationLoop=function(A){Yo=A,dt.setAnimationLoop(A),A===null?yn.stop():yn.start()},dt.addEventListener("sessionstart",th),dt.addEventListener("sessionend",ih),this.render=function(A,X){if(X!==void 0&&X.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(E===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),dt.enabled===!0&&dt.isPresenting===!0&&(dt.cameraAutoUpdate===!0&&dt.updateCamera(X),X=dt.getCamera()),A.isScene===!0&&A.onBeforeRender(y,A,X,I),v=$e.get(A,x.length),v.init(X),x.push(v),Ue.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),ae.setFromProjectionMatrix(Ue,ji,X.reversedDepth),Te=this.localClippingEnabled,re=ce.init(this.clippingPlanes,Te),f=Ke.get(A,_.length),f.init(),_.push(f),dt.enabled===!0&&dt.isPresenting===!0){let ee=y.xr.getDepthSensingMesh();ee!==null&&Zo(ee,X,-1/0,y.sortObjects)}Zo(A,X,0,y.sortObjects),f.finish(),y.sortObjects===!0&&f.sort(ue,Me),D=dt.enabled===!1||dt.isPresenting===!1||dt.hasDepthSensing()===!1,D&&Ge.addToRenderList(f,A),this.info.render.frame++,re===!0&&ce.beginShadows();let Z=v.state.shadowsArray;we.render(Z,A,X),re===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();let Q=f.opaque,q=f.transmissive;if(v.setupLights(),X.isArrayCamera){let ee=X.cameras;if(q.length>0)for(let he=0,pe=ee.length;he<pe;he++)rh(Q,q,A,ee[he]);D&&Ge.render(A);for(let he=0,pe=ee.length;he<pe;he++){let ye=ee[he];nh(f,A,ye,ye.viewport)}}else q.length>0&&rh(Q,q,A,X),D&&Ge.render(A),nh(f,A,X);I!==null&&R===0&&(W.updateMultisampleRenderTarget(I),W.updateRenderTargetMipmap(I)),A.isScene===!0&&A.onAfterRender(y,A,X),si.resetDefaultState(),L=-1,G=null,x.pop(),x.length>0?(v=x[x.length-1],re===!0&&ce.setGlobalState(y.clippingPlanes,v.state.camera)):v=null,_.pop(),f=_.length>0?_[_.length-1]:null},this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(A,X,Z){let Q=V.get(A);Q.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),V.get(A.texture).__webglTexture=X,V.get(A.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:Z,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,X){let Z=V.get(A);Z.__webglFramebuffer=X,Z.__useDefaultFramebuffer=X===void 0};let Fd=F.createFramebuffer();this.setRenderTarget=function(A,X=0,Z=0){I=A,b=X,R=Z;let Q=!0,q=null,ee=!1,he=!1;if(A){let pe=V.get(A);if(pe.__useDefaultFramebuffer!==void 0)P.bindFramebuffer(F.FRAMEBUFFER,null),Q=!1;else if(pe.__webglFramebuffer===void 0)W.setupRenderTarget(A);else if(pe.__hasExternalTextures)W.rebindTextures(A,V.get(A.texture).__webglTexture,V.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Pe=A.depthTexture;if(pe.__boundDepthTexture!==Pe){if(Pe!==null&&V.has(Pe)&&(A.width!==Pe.image.width||A.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");W.setupDepthRenderbuffer(A)}}let ye=A.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(he=!0);let Ce=V.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(q=Array.isArray(Ce[X])?Ce[X][Z]:Ce[X],ee=!0):q=A.samples>0&&W.useMultisampledRTT(A)===!1?V.get(A).__webglMultisampledFramebuffer:Array.isArray(Ce)?Ce[Z]:Ce,H.copy(A.viewport),O.copy(A.scissor),N=A.scissorTest}else H.copy(_e).multiplyScalar($).floor(),O.copy(Ae).multiplyScalar($).floor(),N=ne;if(Z!==0&&(q=Fd),P.bindFramebuffer(F.FRAMEBUFFER,q)&&Q&&P.drawBuffers(A,q),P.viewport(H),P.scissor(O),P.setScissorTest(N),ee){let pe=V.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+X,pe.__webglTexture,Z)}else if(he){let pe=X;for(let ye=0;ye<A.textures.length;ye++){let Ce=V.get(A.textures[ye]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+ye,Ce.__webglTexture,Z,pe)}}else if(A!==null&&Z!==0){let pe=V.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,pe.__webglTexture,Z)}L=-1},this.readRenderTargetPixels=function(A,X,Z,Q,q,ee,he,pe=0){if(!A||!A.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=V.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&he!==void 0&&(ye=ye[he]),ye){P.bindFramebuffer(F.FRAMEBUFFER,ye);try{let Ce=A.textures[pe],Pe=Ce.format,Re=Ce.type;if(!B.textureFormatReadable(Pe))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");if(!B.textureTypeReadable(Re))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");X>=0&&X<=A.width-Q&&Z>=0&&Z<=A.height-q&&(A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+pe),F.readPixels(X,Z,Q,q,He.convert(Pe),He.convert(Re),ee))}finally{let Ce=I!==null?V.get(I).__webglFramebuffer:null;P.bindFramebuffer(F.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(A,X,Z,Q,q,ee,he,pe=0){if(!A||!A.isWebGLRenderTarget)throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=V.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&he!==void 0&&(ye=ye[he]),ye){if(X>=0&&X<=A.width-Q&&Z>=0&&Z<=A.height-q){P.bindFramebuffer(F.FRAMEBUFFER,ye);let Ce=A.textures[pe],Pe=Ce.format,Re=Ce.type;if(!B.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!B.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Be=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Be),F.bufferData(F.PIXEL_PACK_BUFFER,ee.byteLength,F.STREAM_READ),A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+pe),F.readPixels(X,Z,Q,q,He.convert(Pe),He.convert(Re),0);let ct=I!==null?V.get(I).__webglFramebuffer:null;P.bindFramebuffer(F.FRAMEBUFFER,ct);let ft=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Bu(F,ft,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Be),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ee),F.deleteBuffer(Be),F.deleteSync(ft),ee}throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,X=null,Z=0){let Q=Math.pow(2,-Z),q=Math.floor(A.image.width*Q),ee=Math.floor(A.image.height*Q),he=X!==null?X.x:0,pe=X!==null?X.y:0;W.setTexture2D(A,0),F.copyTexSubImage2D(F.TEXTURE_2D,Z,0,0,he,pe,q,ee),P.unbindTexture()};let Bd=F.createFramebuffer(),Od=F.createFramebuffer();this.copyTextureToTexture=function(A,X,Z=null,Q=null,q=0,ee=null){let he,pe,ye,Ce,Pe,Re,Be,ct,ft;ee===null&&(q!==0?(mr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ee=q,q=0):ee=0);let _t=A.isCompressedTexture?A.mipmaps[ee]:A.image;if(Z!==null)he=Z.max.x-Z.min.x,pe=Z.max.y-Z.min.y,ye=Z.isBox3?Z.max.z-Z.min.z:1,Ce=Z.min.x,Pe=Z.min.y,Re=Z.isBox3?Z.min.z:0;else{let xi=Math.pow(2,-q);he=Math.floor(_t.width*xi),pe=Math.floor(_t.height*xi),ye=A.isDataArrayTexture?_t.depth:A.isData3DTexture?Math.floor(_t.depth*xi):1,Ce=0,Pe=0,Re=0}Q!==null?(Be=Q.x,ct=Q.y,ft=Q.z):(Be=0,ct=0,ft=0);let ht=He.convert(X.format),We=He.convert(X.type),pt;X.isData3DTexture?(W.setTexture3D(X,0),pt=F.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(W.setTexture2DArray(X,0),pt=F.TEXTURE_2D_ARRAY):(W.setTexture2D(X,0),pt=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,X.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,X.unpackAlignment);let Pt=F.getParameter(F.UNPACK_ROW_LENGTH),Oe=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Ie=F.getParameter(F.UNPACK_SKIP_PIXELS),ai=F.getParameter(F.UNPACK_SKIP_ROWS),Jo=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,_t.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,_t.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ce),F.pixelStorei(F.UNPACK_SKIP_ROWS,Pe),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Re);let zs=A.isDataArrayTexture||A.isData3DTexture,$i=X.isDataArrayTexture||X.isData3DTexture;if(A.isDepthTexture){let xi=V.get(A),Hn=V.get(X),zi=V.get(xi.__renderTarget),Ko=V.get(Hn.__renderTarget);P.bindFramebuffer(F.READ_FRAMEBUFFER,zi.__webglFramebuffer),P.bindFramebuffer(F.DRAW_FRAMEBUFFER,Ko.__webglFramebuffer);for(let Wn=0;Wn<ye;Wn++)zs&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,V.get(A).__webglTexture,q,Re+Wn),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,V.get(X).__webglTexture,ee,ft+Wn)),F.blitFramebuffer(Ce,Pe,he,pe,Be,ct,he,pe,F.DEPTH_BUFFER_BIT,F.NEAREST);P.bindFramebuffer(F.READ_FRAMEBUFFER,null),P.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(q!==0||A.isRenderTargetTexture||V.has(A)){let xi=V.get(A),Hn=V.get(X);P.bindFramebuffer(F.READ_FRAMEBUFFER,Bd),P.bindFramebuffer(F.DRAW_FRAMEBUFFER,Od);for(let zi=0;zi<ye;zi++)zs?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,xi.__webglTexture,q,Re+zi):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,xi.__webglTexture,q),$i?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Hn.__webglTexture,ee,ft+zi):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Hn.__webglTexture,ee),q!==0?F.blitFramebuffer(Ce,Pe,he,pe,Be,ct,he,pe,F.COLOR_BUFFER_BIT,F.NEAREST):$i?F.copyTexSubImage3D(pt,ee,Be,ct,ft+zi,Ce,Pe,he,pe):F.copyTexSubImage2D(pt,ee,Be,ct,Ce,Pe,he,pe);P.bindFramebuffer(F.READ_FRAMEBUFFER,null),P.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else $i?A.isDataTexture||A.isData3DTexture?F.texSubImage3D(pt,ee,Be,ct,ft,he,pe,ye,ht,We,_t.data):X.isCompressedArrayTexture?F.compressedTexSubImage3D(pt,ee,Be,ct,ft,he,pe,ye,ht,_t.data):F.texSubImage3D(pt,ee,Be,ct,ft,he,pe,ye,ht,We,_t):A.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ee,Be,ct,he,pe,ht,We,_t.data):A.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ee,Be,ct,_t.width,_t.height,ht,_t.data):F.texSubImage2D(F.TEXTURE_2D,ee,Be,ct,he,pe,ht,We,_t);F.pixelStorei(F.UNPACK_ROW_LENGTH,Pt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Oe),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ie),F.pixelStorei(F.UNPACK_SKIP_ROWS,ai),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Jo),ee===0&&X.generateMipmaps&&F.generateMipmap(pt),P.unbindTexture()},this.initRenderTarget=function(A){V.get(A).__webglFramebuffer===void 0&&W.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?W.setTextureCube(A,0):A.isData3DTexture?W.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?W.setTexture2DArray(A,0):W.setTexture2D(A,0),P.unbindTexture()},this.resetState=function(){b=0,R=0,I=null,P.reset(),si.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}};function Fi(r,e=!1){let t=r[0].index!==null,i=new Set(Object.keys(r[0].attributes)),n=new Set(Object.keys(r[0].morphAttributes)),s={},a={},o=r[0].morphTargetsRelative,l=new De,c=0;for(let h=0;h<r.length;++h){let d=r[h],p=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let u in d.attributes){if(!i.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;s[u]===void 0&&(s[u]=[]),s[u].push(d.attributes[u]),p++}if(p!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let u in d.morphAttributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[u]===void 0&&(a[u]=[]),a[u].push(d.morphAttributes[u])}if(e){let u;if(t)u=d.index.count;else if(d.attributes.position!==void 0)u=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,u,h),c+=u}}if(t){let h=0,d=[];for(let p=0;p<r.length;++p){let u=r[p].index;for(let m=0;m<u.count;++m)d.push(u.getX(m)+h);h+=r[p].attributes.position.count}l.setIndex(d)}for(let h in s){let d=xd(s[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in a){let d=a[h][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let p=0;p<d;++p){let u=[];for(let g=0;g<a[h].length;++g)u.push(a[h][g][p]);let m=xd(u);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function xd(r){let e,t,i,n=-1,s=0;for(let c=0;c<r.length;++c){let h=r[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=h.gpuType),n!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*t}let a=new e(s),o=new ke(a,t,i),l=0;for(let c=0;c<r.length;++c){let h=r[c];if(h.isInterleavedBufferAttribute){let d=l/t;for(let p=0,u=h.count;p<u;p++)for(let m=0;m<t;m++){let g=h.getComponent(p,m);o.setComponent(p+d,m,g)}}else a.set(h.array,l);l+=h.count*t}return n!==void 0&&(o.gpuType=n),o}function Lo(r,e=Math.PI/3){let t=Math.cos(e),i=(1+1e-10)*100,n=[new S,new S,new S],s=new S,a=new S,o=new S,l=new S;function c(g){let f=~~(g.x*i),v=~~(g.y*i),_=~~(g.z*i);return`${f},${v},${_}`}let h=r.index?r.toNonIndexed():r,d=h.attributes.position,p={};for(let g=0,f=d.count/3;g<f;g++){let v=3*g,_=n[0].fromBufferAttribute(d,v+0),x=n[1].fromBufferAttribute(d,v+1),y=n[2].fromBufferAttribute(d,v+2);s.subVectors(y,x),a.subVectors(_,x);let E=new S().crossVectors(s,a).normalize();for(let b=0;b<3;b++){let R=n[b],I=c(R);I in p||(p[I]=[]),p[I].push(E)}}let u=new Float32Array(d.count*3),m=new ke(u,3,!1);for(let g=0,f=d.count/3;g<f;g++){let v=3*g,_=n[0].fromBufferAttribute(d,v+0),x=n[1].fromBufferAttribute(d,v+1),y=n[2].fromBufferAttribute(d,v+2);s.subVectors(y,x),a.subVectors(_,x),o.crossVectors(s,a).normalize();for(let E=0;E<3;E++){let b=n[E],R=c(b),I=p[R];l.set(0,0,0);for(let L=0,G=I.length;L<G;L++){let H=I[L];o.dot(H)>t&&l.add(H)}l.normalize(),m.setXYZ(v+E,l.x,l.y,l.z)}}return h.setAttribute("normal",m),h}var Zc=[{p:[-16,3.7607,-7],n:[-.02138,.88933,.45677],kind:"turret"},{p:[-16,.9173,-4],n:[-.13038,.96573,-.22443],kind:"plate"},{p:[-16,1.3029,-1.4],n:[-.28043,.72137,-.63323],kind:"plate"},{p:[-16,.8593,4],n:[-.13165,.96213,.2387],kind:"vent"},{p:[-16,3.7901,7],n:[-.03244,.89729,-.44025],kind:"plate"},{p:[-13,1.8718,-1.4],n:[-.24242,.97015,.00627],kind:"plate"},{p:[-13,1.8528,1.4],n:[-.24202,.97025,.0068],kind:"vent"},{p:[-13,3.8599,7],n:[-.02244,.86988,-.49275],kind:"turret"},{p:[-10,2.4306,-4],n:[-.24203,.97025,.00652],kind:"plate"},{p:[-10,2.4129,-1.4],n:[-.24185,.97029,.00666],kind:"vent"},{p:[-10,2.3938,1.4],n:[-.24189,.97028,.00661],kind:"plate"},{p:[-10,2.3757,4],n:[-.24227,.97018,.00722],kind:"plate"},{p:[-7,1.2164,-7],n:[-.00698,.89308,-.44985],kind:"vent"},{p:[-7,2.5171,-4],n:[-.00928,.99992,.00887],kind:"plate"},{p:[-7,2.4977,-1.4],n:[-.0089,.99993,.00734],kind:"turret"},{p:[-7,2.4771,1.4],n:[-.0089,.99993,.00734],kind:"vent"},{p:[-7,2.4583,4],n:[-.00896,.99993,.00754],kind:"plate"},{p:[-7,1.1334,7],n:[-.00848,.88602,.46357],kind:"plate"},{p:[-4,.7692,-7],n:[.07028,.9975,.00748],kind:"vent"},{p:[-4,2.1767,-4],n:[.15502,.74202,-.6522],kind:"plate"},{p:[-4,2.2464,-1.4],n:[.08736,.99615,.00751],kind:"plate"},{p:[-4,2.225,1.4],n:[.08743,.99614,.00736],kind:"turret"},{p:[-4,2.1741,4],n:[.15215,.73255,.66349],kind:"plate"},{p:[-4,.6954,7],n:[.07068,.99747,.0079],kind:"plate"},{p:[-1,1.5496,-4],n:[.15508,.74171,-.65254],kind:"vent"},{p:[-1,1.983,-1.4],n:[.08907,.996,.00649],kind:"plate"},{p:[-1,1.9618,1.4],n:[.08735,.99614,.00806],kind:"plate"},{p:[-1,1.5506,4],n:[.15223,.73208,.66399],kind:"vent"},{p:[2,.9224,-4],n:[.15508,.74171,-.65254],kind:"turret"},{p:[2,1.7143,-1.4],n:[.08804,.99609,.00684],kind:"plate"},{p:[2,1.6931,1.4],n:[.08794,.9961,.00758],kind:"vent"},{p:[2,.9268,4],n:[.15223,.73208,.66399],kind:"plate"},{p:[5,.3536,-4],n:[.13303,.74309,-.65583],kind:"plate"},{p:[5,1.4767,1.4],n:[.21054,.85972,.46535],kind:"vent"},{p:[5,.3633,4],n:[.12933,.73382,.66692],kind:"plate"},{p:[8,1.2261,-1.4],n:[.05337,.99611,.07009],kind:"turret"},{p:[8,1.1989,1.4],n:[.05113,.99767,-.04525],kind:"vent"},{p:[11,1.4165,-1.4],n:[.03472,.99937,.00729],kind:"plate"},{p:[11,1.3954,1.4],n:[.0347,.99937,.00755],kind:"plate"},{p:[14,1.0915,-1.4],n:[.10412,.99316,.05289],kind:"vent"}];var rf=new S(0,1,0);function sf(r,e,t){let i=r/2,n=t/2,s=.08,a=new ni;a.moveTo(-i+s,-n),a.lineTo(i-s,-n),a.lineTo(i,-n+s),a.lineTo(i,n-s),a.lineTo(i-s,n),a.lineTo(-i+s,n),a.lineTo(-i,n-s),a.lineTo(-i,-n+s),a.closePath();let o=new mi(a,{depth:e,bevelEnabled:!0,bevelThickness:.013,bevelSize:.014,bevelSegments:2,steps:1});return o.rotateX(-Math.PI/2),o.translate(0,-e/2,0),o}function af(r){return Math.min(7,Math.max(0,Math.floor((r.x+20)/5)))+8*(r.z<-1.8?0:r.z>1.8?2:1)+24*(r.y>.8?1:0)}function yd(r,e,t){let i=[new ot({color:9016994,metalness:.88,roughness:.31,normalMap:t.normalMap,normalScale:new J(.25,.25),envMapIntensity:.9}),new ut({color:2503488,metalness:.65,roughness:.57}),new ot({color:11057349,metalness:.12,roughness:.42,clearcoat:.3,normalMap:t.normalMap,normalScale:new J(.35,.35)}),new ut({color:8833509,emissive:4753075,emissiveIntensity:1.3,roughness:.25,metalness:.25})],n=new Map,s=new Map,a=0;function o(h,d,p,u,m){let g=new gt;g.position.copy(p),g.quaternion.copy(u),g.updateMatrix(),h=h.index?h.toNonIndexed():h,h.applyMatrix4(g.matrix),a+=h.attributes.position.count/3,n.has(d)||n.set(d,[]),n.get(d).push(h);let f=af(m);s.has(f)||s.set(f,new Map);let v=s.get(f);v.has(d)||v.set(d,[]),v.get(d).push(h)}for(let[h,d]of Zc.entries()){let p=new S(...d.p),u=new S(...d.n),m=new et().setFromUnitVectors(rf,u),g=(v,_,x)=>new S(v,_,x).applyQuaternion(m).add(p),f=(v,_,x,y,E,b,R)=>o(new qe(v,_,x),R,g(y,E,b),m,p);f(1.6,.07,.78,0,.05,0,1),o(sf(1.48,.055,.67),h%5===0?0:2,g(0,.11,0),m,p);for(let v of[-.64,.64])for(let _ of[-.25,.25])o(new Se(.038,.042,.035,8),0,g(v,.155,_),m,p);if(d.kind==="vent"){f(.95,.045,.46,0,.155,0,1);for(let v=0;v<8;v++)f(.055,.055,.4,-.39+v*.11,.195,0,0)}else if(d.kind==="turret"&&d.p[0]!==-7&&d.p[0]!==-4){o(new Se(.27,.34,.2,24),0,g(0,.24,0),m,p),f(.52,.18,.46,0,.4,0,1);let v=new et().setFromAxisAngle(new S(0,0,1),-Math.PI/2),_=m.clone().multiply(v);for(let x of[-.135,.135])o(new Se(.036,.052,.85,12),0,g(.46,.4,x),_,p),o(new Se(.052,.052,.18,12),1,g(.87,.4,x),_,p)}else h%4===0&&f(.58,.025,.025,0,.16,.22,3)}let l=new Ee;l.name="Physical hull fittings",r.add(l);for(let[h,d]of n){let p=new se(Fi(d),i[h]);p.castShadow=h!==3,p.receiveShadow=!0,l.add(p)}for(let[h,d]of s){let p=e.find(u=>u.key===h);if(p)for(let[u,m]of d){let g=Fi(m);g.translate(-p.center.x,-p.center.y,-p.center.z);let f=new se(g,i[u]);f.castShadow=u!==3,f.receiveShadow=!0,p.mesh.add(f)}}let c=Fi([...n].filter(([h])=>h!==3).flatMap(([,h])=>h));for(let h of n.values())h.forEach(d=>d.dispose());return{assembled:l,escortGeometry:c,escortMaterial:i[0],anchors:Zc.length,triangles:a}}var ri=(r=0,e=0,t=0)=>new S(r,e,t),of=ri(0,1,0),P_=ri(1,0,0),bd=["corvette","frigate","carrier","lancer","tender"],No=["siege","raider","marauder","destroyer","torpedo"],Do=["needle","scout","interceptor","bomber","dart","raptor"];function Gn(r){let e=new Map;return{add(t,i,n=ri(),s=new ze,a=ri(1,1,1)){if(t.index){let o=t;t=t.toNonIndexed(),o.dispose()}t.applyMatrix4(new ge().compose(n,new et().setFromEuler(s),a)),e.has(i)||e.set(i,[]),e.get(i).push(t)},finish(){let t=0;for(let[i,n]of e){let s=Fi(n),a=new se(s,i);a.castShadow=!i.isMeshBasicMaterial,a.receiveShadow=!0,r.add(a),t+=s.attributes.position.count/3,n.forEach(o=>o.dispose())}return t}}}function Ht(r,e,t=.1){let i=new Se(t,t,r.distanceTo(e),8);return i.applyQuaternion(new et().setFromUnitVectors(of,e.clone().sub(r).normalize())),i.translate(...r.clone().add(e).multiplyScalar(.5).toArray()),i}function tt(r,e,t,i=.07){let n=new ni,s=r/2,a=t/2,o=Math.min(i,r*.12,t*.12);n.moveTo(-s+o,-a),n.lineTo(s-o,-a),n.lineTo(s,-a+o),n.lineTo(s,a-o),n.lineTo(s-o,a),n.lineTo(-s+o,a),n.lineTo(-s,a-o),n.lineTo(-s,-a+o),n.closePath();let l=new mi(n,{depth:e,bevelEnabled:!0,bevelThickness:o*.45,bevelSize:o*.45,bevelSegments:1,steps:1});return l.rotateX(-Math.PI/2),l.translate(0,-e/2,0),l}function Uo(r,e){let t=new ni;r.forEach(([n,s],a)=>a?t.lineTo(n,s):t.moveTo(n,s)),t.closePath();let i=new mi(t,{depth:e,bevelEnabled:!0,bevelSize:.08,bevelThickness:.055,bevelSegments:1,steps:1});return i.rotateX(Math.PI/2),i.translate(0,e/2,0),i}function Md(r){let e=[],t=[],i=[];for(let a=0;a<r.length;a++){let[o,l,c,h=0]=r[a];for(let d=0;d<8;d++){let p=d*Math.PI/4+Math.PI/8;e.push(o,h+Math.sin(p)*c,Math.cos(p)*l),t.push(o/9,d/4)}}for(let a=0;a<r.length-1;a++)for(let o=0;o<8;o++){let l=a*8+o,c=a*8+(o+1)%8,h=l+8,d=c+8;i.push(l,h,c,c,h,d)}for(let a=1;a<7;a++){i.push(0,a,a+1);let o=(r.length-1)*8;i.push(o,o+a+1,o+a)}let n=new De;n.setAttribute("position",new fe(e,3)),n.setAttribute("uv",new fe(t,2)),n.setIndex(i),n.computeVertexNormals();let s=Lo(n,.45);return n.dispose(),s}var lf={corvette:[[-18,1.9,1.7],[-14,3.8,2.3],[-4,4.6,2.5],[7,3.4,1.7],[19,.18,.3]],frigate:[[-18,4,2],[-11,5,2.5],[5,5,2.5],[14,3,2],[20,.7,.7]],carrier:[[-18,7,2.8],[-13,7.8,3],[11,7.8,3],[18,5,2.6],[20,3,1.8]],lancer:[[-18,2.2,1.5],[-9,2.7,1.9],[9,1.8,1.5],[21,.04,.04]],tender:[[-18,4.8,2.8],[-11,5.3,3.4],[7,4.6,3.4],[17,3,2.2],[19,2.3,1.5]],siege:[[-21,7,3.4],[-12,8.5,4.2],[4,8.2,4.2],[17,6,3],[21,2,2]],raider:[[-19,3,1.7],[-9,4,2.8],[3,3,2.6],[16,1,1.2],[20,.05,.15]],marauder:[[-18,3.5,3],[-9,6.4,3.7],[7,6,3.2],[18,.5,1]],destroyer:[[-20,2.6,2.2],[-13,4.5,2.4],[8,4,2.6],[21,.9,.8]],torpedo:[[-18,4,2.2],[-10,5,2.6],[7,3,1.6],[19,.25,.45]]},Sd={corvette:[2389718,12835050,"Cobalt"],frigate:[13525810,14271649,"Copper"],carrier:[7688884,13156316,"Violet"],lancer:[2526850,10999246,"Teal"],tender:[12819765,14274728,"Gold"],siege:[10436417,3292233,"Crimson"],raider:[10645557,3160899,"Bronze"],marauder:[6639754,3423565,"Plum"],destroyer:[4747869,2636345,"Olive"],torpedo:[4026763,3029063,"Steel blue"],needle:[4499651,12048611,"Ice blue"],scout:[15115324,4739941,"Amber"],interceptor:[13129296,13811129,"Scarlet"],bomber:[6464125,12898751,"Jade"],dart:[9072842,13813477,"Lilac"],raptor:[14252194,14205907,"Rose"]};function _i(r,e,{enemy:t=!1,serial:i=1}={}){let n=new Ee;n.name=r+" / "+i;let s=Do.includes(r),a=s?Do.indexOf(r):0,o=lf[r]||[[-17,1.9,1.4],[-8,2.8,2],[5,2.2,1.7],[20,.08,.2]],l=(N,U=.44,k=.68)=>new ot({color:N,map:e.map,normalMap:e.normalMap,normalScale:new J(.32,.32),roughnessMap:e.orm,roughness:U,metalness:k,clearcoat:.17,clearcoatRoughness:.4,envMapIntensity:1.05}),c=Sd[r]||Sd.corvette,h=l(c[0],.7,.3),d=l(c[1],.62,.5),p=l(8227736,.52,.92),u=l(1516333,.9,.65),m=new ot({color:729392,roughness:.12,metalness:.55,clearcoat:1,clearcoatRoughness:.08}),g=new rt({color:t?16756087:11004159,toneMapped:!1}),f=Gn(n),v=(N,U,k=0,j=0,K=0,$)=>f.add(N,U,ri(k,j,K),$),_=(N,U,k,j,K,$,ue)=>v(tt(N,U,k),j,K,$,ue);v(Md(o),h);let x=N=>{for(let U=1;U<o.length;U++)if(N<=o[U][0]){let k=o[U-1],j=o[U],K=(N-k[0])/(j[0]-k[0]);return{w:vi.lerp(k[1],j[1],K),h:vi.lerp(k[2],j[2],K)*.924}}return{w:1,h:1}};for(let N=-13;N<12;N+=3.4){let{w:U,h:k}=x(N);for(let j of[-1,1]){_(3.1,.14,Math.max(.55,U*.52),d,N,k+.03,j*U*.48),_(2.35,.09,.42,u,N,k+.16,j*U*.48);for(let K=0;K<5;K++)_(.1,.12,.38,p,N-.9+K*.44,k+.24,j*U*.48);_(.11,.07,.11,p,N-1.3,k+.2,j*U*.75),_(.11,.07,.11,p,N+1.3,k+.2,j*U*.75)}}let y=(N,U,k=0)=>v(Uo(U.map(([j,K])=>[j,K*N]),.38),h,0,k,0),E=[],b=(N,U,k,j)=>{let K=new Se(j*.85,j,3.4,20);K.rotateZ(Math.PI/2),v(K,u,N+1,U,k);for(let $ of[-.6,.1,1.8])K=new Ct(j,.14,6,24),K.rotateY(Math.PI/2),v(K,p,N+$,U,k);K=new Se(j*.72,j*.64,.1,20),K.rotateZ(Math.PI/2),v(K,g,N-.62,U,k),E.push({p:ri(N-.8,U,k),r:j})};if(s){for(let N of[-1,1])if(y(N,[[[7,1],[-10,10],[-16,9],[-9,1]],[[3,1],[-6,13],[-10,12],[-14,1]],[[9,1],[-5,8],[-15,7],[-10,1]],[[2,1],[-3,9],[-15,9],[-16,1]],[[13,1],[-12,7],[-16,4],[-8,1]],[[7,1],[-9,11],[-6,6],[-14,2]]][a],a===5?.6:0),b(-15,0,N*(a===3?6:3),a===3?1.2:.9),_(6,.6,.65,u,-3,.25,N*(a===3?8:6)),_(3,.3,.3,p,1,.25,N*(a===3?8:6)),a===1||a===5){let k=Uo([[-13,0],[-8,0],[-13,5],[-16,3]],.22);k.rotateX(Math.PI/2),v(k,d,0,1,N*3)}}else if(["frigate","destroyer"].includes(r))for(let N of[-1,1])y(N,[[7,2],[0,10],[-14,10],[-18,4]],-.5),_(17,2.5,2.7,d,-6,0,N*8),b(-17,0,N*8,1.3),_(14,1,1,u,12,1,N*4);else if(["carrier","siege"].includes(r)){for(let N of[-1,1]){_(34,1,2,d,-1,3.1,N*6.7),_(17,1.8,2.6,u,1,1.1,N*7.6);for(let U=0;U<8;U++)_(.22,1.4,2.8,p,-6+U*2,1.2,N*7.7);b(-20,0,N*5,1.7),b(-20,0,N*1.7,1.35)}if(_(6,2.5,3,d,-8,4.2,-2),_(3.9,1.1,2.4,m,-6.6,5.5,-2),r==="siege")for(let N of[-1,1])_(13,2.5,4,d,13,0,N*6),_(9,.7,.8,u,20,.5,N*6)}else if(["tender","torpedo"].includes(r))for(let N of[-1,1]){f.add(Ht(ri(-12,0,N*3),ri(4,0,N*9),.3),p);for(let U=0;U<3;U++){_(6,2.6,2.8,U%2?d:h,-10+U*7,0,N*7);for(let k of[-2,2])_(.2,2.8,3,p,-10+U*7+k,0,N*7)}b(-18,0,N*3,1.5)}else if(r==="marauder"){for(let N of[-1,1])y(N,[[15,1],[2,14],[-14,12],[-10,4]],-.7),_(11,2,2,d,-9,0,N*10),b(-17,0,N*10,1.3);b(-18,0,0,2)}else if(r==="raider")for(let N of[-1,1]){y(N,[[12,1],[-5,13],[-15,12],[-10,3]],-1);let U=Uo([[-13,0],[-4,0],[-14,6],[-18,3]],.35);U.rotateX(Math.PI/2),v(U,d,0,2,N*3),b(-18,-.5,N*4,1.4)}else{for(let N of[-1,1])y(N,[[6,1],[-9,r==="lancer"?8:11],[-17,9],[-11,2]],-.6),b(-18,0,N*4,1.3),_(10,.65,.6,p,5,-.4,N*3.5);r==="lancer"&&_(15,.9,.9,u,14,-.5,0)}for(let N=-12;N<12;N+=4){let{w:U,h:k}=x(N);for(let j of[-1,1]){_(3.7,k*.65,.22,u,N,-.1,j*(U*.92+.04)),_(3.25,k*.43,.18,d,N,.12,j*(U*.92+.2));for(let K of[-1.4,1.4])_(.11,k*.5,.21,p,N+K,.1,j*(U*.92+.32));_(2.2,.07,.06,g,N,-k*.17,j*(U*.92+.32))}}if(!s)for(let N of[-1,1]){let{w:U,h:k}=x(-3);v(Uo([[-13,U*.7],[-7,U+1.1],[8,U*.8],[13,U*.45]],.2),d,0,k*.5,0,N===-1?new ze(Math.PI,0,0):void 0)}let R=s?4:-6,I=x(R).h+.4;v(Md([[R-3,1.3,.4,I],[R-1,1.5,.9,I],[R+4,.3,.2,I]]),m);for(let N of[-1.3,1.3])f.add(Ht(ri(R-3,I+.2,N),ri(R+3,I+.3,N*.28),.07),p);s||(_(4,.6,1.5,d,-12,x(-12).h+.55,0),f.add(Ht(ri(-12,3.3,0),ri(-12,6,0),.09),p),_(.8,.12,3,p,-12,6,0));for(let N of[-1,1]){let U=s?-3:4,k=x(U).h+.55,j=N*(s?2:2.4);v(new Se(.6,.8,.45,16),p,U,k,j),_(1.7,.65,1.1,u,U,k+.45,j);for(let K of[-.32,.32]){let $=new Se(.11,.15,3.1,12);$.rotateZ(-Math.PI/2),v($,p,U+1.7,k+.5,j+K);let ue=new Ct(.14,.035,6,12);ue.rotateY(Math.PI/2),v(ue,u,U+3.25,k+.5,j+K)}_(.55,.07,.13,g,-10,x(-10).h+.3,N*x(-10).w*.85)}let L=f.finish(),G=new ii(1,1,16,3,!0);G.rotateZ(Math.PI/2),G.translate(-.5,0,0);let H=new st({transparent:!0,depthWrite:!1,side:vt,uniforms:{power:{value:.5},time:{value:0},tint:{value:new ve(t?16753777:10018815)}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:"varying vec2 vUv;uniform float power;uniform float time;uniform vec3 tint;void main(){float a=pow(1.-vUv.y,1.7)*(.67+.13*cos(vUv.y*42.-time*9.))*power;gl_FragColor=vec4(mix(tint,vec3(1.),pow(1.-vUv.y,6.)),a*.48);}"}),O=new Ee;n.add(O);for(let{p:N,r:U}of E){let k=new se(G,H);k.position.copy(N),k.scale.set(6,U*.78,U*.78),O.add(k)}return n.userData={modelType:r,livery:c[2],paintColour:c[0],triangles:L,engines:O,update:(N,U=.7)=>{H.uniforms.time.value=N,H.uniforms.power.value=U;for(let k of O.children)k.scale.x=3+U*6+.1*Math.sin(N*11)}},n}var Wt=(r=0,e=0,t=0)=>new S(r,e,t),cf=Wt(0,1,0),Fr=class{constructor(e,{rounds:t=160,muzzles:i=64,hits:n=96,sparks:s=512,calibre:a=1}={}){this.calibre=a,this.root=new Ee,this.root.name="Ballistic rounds / timed muzzle and hull impacts",e.add(this.root),this.shots=[],this.m=new ge,this.q=new et,this.p=Wt(),this.s=Wt(),this.dir=Wt(),this.activeMuzzles=0,this.activeHits=0,this.indexDirty=!0,this.sortedShots=[],this.gunShots=new Map,this.maxFlight=0,this.colours=[new ve(16765596),new ve(11460607)];let o=(d,p,u,m=!1,g=1)=>{let f=new At(d,new rt({color:p,toneMapped:!1,transparent:m,opacity:g,depthWrite:!m}),u);return f.instanceMatrix.setUsage(Yt),f.frustumCulled=!1,f.count=0,this.root.add(f),f},l=new Se(1,1,1,8),c=new ii(1,1,12),h=new St(1,12,8);this.rounds=o(l,16774615,t),this.halo=o(l,16755297,t,!0,.26),this.flashes=o(c,16772552,i,!0,.8),this.hitFlashes=o(h,16765082,n,!0,.8),this.sparks=o(l,16761987,s,!0,.8),this.lights=[0,1].map(()=>{let d=new Rt(16762508,0,15,2);return this.root.add(d),d})}schedule({start:e,end:t,interval:i=.7,burst:n=3,spacing:s=.085,muzzle:a,target:o,speed:l=95,side:c=0,gun:h=0}){this.indexDirty=!0;for(let d=e;d<t;d+=i)for(let p=0;p<n;p++){let u=d+p*s;if(u>=t)continue;let m=a(u,p).clone(),g=o(u,p).clone(),f=g.clone().sub(m),v=f.length();f.normalize(),this.shots.push({at:u,hit:u+v/l,from:m,to:g,direction:f,speed:l,side:c,gun:h})}}index(){if(this.indexDirty){this.sortedShots=this.shots.slice().sort((e,t)=>e.at-t.at),this.gunShots.clear(),this.maxFlight=0;for(let e of this.sortedShots)this.gunShots.has(e.gun)||this.gunShots.set(e.gun,[]),this.gunShots.get(e.gun).push(e),this.maxFlight=Math.max(this.maxFlight,e.hit-e.at);this.indexDirty=!1}}recoil(e,t){this.index();let i=0,n=this.gunShots.get(e);if(!n)return i;let s=Gr(n,t);for(let a=Vs(n,t-.17);a<s;a++){let o=t-n[a].at;o<.17&&(i=Math.max(i,Math.exp(-o*22)*.25))}return i}put(e,t,i,n,s,a){this.q.setFromUnitVectors(cf,n),this.s.set(s,a,s),this.m.compose(i,this.q,this.s),e.setMatrixAt(t,this.m)}update(e){let t=0,i=0,n=0,s=0;this.lights.forEach(l=>l.intensity=0),this.root.visible=!0,this.index();let a=Vs(this.sortedShots,e-this.maxFlight-.38),o=Gr(this.sortedShots,e);this.scannedShots=o-a;for(let l=a;l<o;l++){let c=this.sortedShots[l],h=e-c.at,d=c.hit-c.at;if(h<0||h>d+.38)continue;if(h<d&&t<this.rounds.instanceMatrix.count){let u=Math.min(1.6*this.calibre,c.speed*d*.09),m=Math.max(.03,h*c.speed);this.p.copy(c.from).addScaledVector(c.direction,m),this.put(this.rounds,t,this.p,c.direction,.026*this.calibre,u),this.put(this.halo,t,this.p,c.direction,.09*this.calibre,u*1.18);let g=this.colours[c.side?1:0];this.rounds.setColorAt(t,g),this.halo.setColorAt(t,g),t++}if(h<.065&&i<this.flashes.instanceMatrix.count){let u=1-h/.065;this.p.copy(c.from).addScaledVector(c.direction,.32),this.put(this.flashes,i++,this.p,c.direction,.2*u*this.calibre,.7*u*this.calibre);let m=this.lights[c.side%2];m.position.copy(c.from),m.intensity=Math.max(m.intensity,u*24)}let p=e-c.hit;if(p>=0&&p<.38&&n<this.hitFlashes.instanceMatrix.count){let u=1-p/.38;this.put(this.hitFlashes,n++,c.to,c.direction,.1+p*.4,.15+p*.6);for(let m=0;m<6&&s<this.sparks.instanceMatrix.count;m++){let g=m*2.3999+c.at*8;this.dir.set(Math.cos(g),Math.sin(g*1.7),Math.sin(g)).addScaledVector(c.direction,-1.3).normalize(),this.p.copy(c.to).addScaledVector(this.dir,p*(2+m*.8)),this.put(this.sparks,s++,this.p,this.dir,.012*u,.1+u*.22)}}}for(let[l,c]of[[this.rounds,t],[this.halo,t],[this.flashes,i],[this.hitFlashes,n],[this.sparks,s]])l.count=c,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0);this.activeMuzzles=i,this.activeHits=n}hide(){this.root.visible=!1,this.lights.forEach(e=>e.intensity=0)}diagnostic(){return{gunRounds:this.rounds.count,muzzleFlashes:this.activeMuzzles,gunImpacts:this.activeHits,weaponTiming:"finite-speed / muzzle-to-impact",scheduledRounds:this.shots.length,scannedRounds:this.scannedShots||0}}},Fo=class{constructor(e,t){this.root=new Ee,this.root.name="Polaris articulated dorsal batteries",e.add(this.root),this.mounts=[Wt(-7,2.8,-1.4),Wt(-4,2.53,1.4)],this.heads=[],this.barrels=[];let i=new ot({color:8754079,metalness:.87,roughness:.35,normalMap:t.normalMap,normalScale:new J(.3,.3)}),n=new ut({color:2306623,metalness:.7,roughness:.55});for(let s of this.mounts){let a=new se(new Se(.6,.75,.3,24),i);a.position.copy(s),this.root.add(a);let o=new Ee;o.position.copy(s).add(Wt(0,.34,0)),this.root.add(o);let l=new se(new qe(1,.55,1.05),n);o.add(l);let c=[];for(let h of[-.23,.23]){let d=new Ee;d.position.z=h,o.add(d);let p=new se(new Se(.08,.13,1.65,16),i);p.rotation.z=-Math.PI/2,p.position.x=.95,d.add(p);for(let m of[.4,1.66]){let g=new se(new Ct(.12,.035,8,16),n);g.rotation.y=Math.PI/2,g.position.x=m,d.add(g)}let u=new se(new Mr(.08,12),n);u.rotation.y=Math.PI/2,u.position.x=1.79,d.add(u),c.push(d)}this.heads.push(o),this.barrels.push(c)}}pose(e){return{position:Wt(-4+Math.sin(e*.28)*.9,Math.sin(e*.38)*.35,0),q:new et().setFromEuler(new ze(Math.sin(e*.35)*.012,-.08+Math.sin(e*.23)*.025,Math.sin(e*.3)*.018))}}muzzleAt(e,t,i=0){let{position:n,q:s}=this.pose(t),a=Wt(25,2,-12).sub(n).applyQuaternion(s.clone().invert()),o=this.mounts[e].clone().add(Wt(0,.34,0)),l=new et().setFromUnitVectors(Wt(1,0,0),a.sub(o).normalize());return Wt(1.8,0,i%2?.23:-.23).applyQuaternion(l).add(o).applyQuaternion(s).add(n)}update(e,t,i,n){if(this.root.visible=e!==1||t>=11,!this.root.visible)return;let s=i.worldToLocal(Wt(25,2,-12));this.heads.forEach((a,o)=>{a.quaternion.setFromUnitVectors(Wt(1,0,0),e===4?s.clone().sub(a.position).normalize():Wt(1,0,0)),this.barrels[o].forEach(l=>l.position.x=e===4?-n.recoil(o,t):0)})}};var Oo=r=>Math.max(0,Math.min(1,r)),Jc=r=>(r=Oo(r),r*r*(3-2*r)),hf=new S(1,0,0),N_=new S(0,1,0),Ki=new S,kn=new S,Td=new S,uf=new S;function Bo(r,e=48){let t=new dn(r.map(i=>new J(...i)),e);return t.rotateZ(-Math.PI/2),t}function df(){let r=document.createElement("canvas");r.width=1024,r.height=2048;let e=r.getContext("2d");e.fillStyle="#b9c2c9",e.fillRect(0,0,r.width,r.height);for(let i=0;i<10;i++){let n=i*204.8;e.fillStyle=i%3===0?"#a4b0bb":"#c2cbd1",e.fillRect(0,n,1024,201),e.fillStyle="#5c6c78",e.fillRect(0,n+202,1024,2)}e.fillStyle="#a4793d",e.fillRect(0,1570,1024,48),e.fillStyle="#243644",e.fillRect(0,1620,1024,9);for(let i of[55,565]){e.save(),e.translate(i,1150),e.rotate(Math.PI/2),e.fillStyle="#263845",e.font="600 46px monospace",e.fillText("VOYAGER / VX-09",0,0),e.font="20px monospace",e.fillText("GUIDED TORPEDO  \u2022  SERVICE 009",0,38),e.restore();for(let n=400;n<1500;n+=170)e.fillStyle="#667582",e.fillRect(i,n,7,13),e.fillRect(i+280,n,7,13)}let t=new Pi(r);return t.colorSpace=Mt,t.anisotropy=8,t}var wd=`
 float h(vec3 p){p=fract(p*.3183099+vec3(.13,.27,.41));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){return n(p)*.57+n(p*2.03)*.28+n(p*4.07)*.15;}
`;function pf(){let r=new st({transparent:!0,depthWrite:!1,side:vt,blending:Ot,uniforms:{time:{value:0},power:{value:0}},vertexShader:"varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;uniform float time;void main(){vUv=uv;vec3 p=position;p.yz*=1.0+.04*sin(p.x*13.0-time*41.0);vec4 mv=modelViewMatrix*vec4(p,1.0);vView=-mv.xyz;vNormal=normalMatrix*normal;gl_Position=projectionMatrix*mv;}",fragmentShader:"varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;uniform float time;uniform float power;void main(){float tip=1.0-vUv.y;float shock=.72+.28*cos(tip*44.0-time*9.0);float edge=pow(abs(dot(normalize(vNormal),normalize(vView))),.4);vec3 c=mix(vec3(.75,.23,.055),vec3(1.0,.88,.62),pow(vUv.y,1.3));gl_FragColor=vec4(c,power*pow(vUv.y,.65)*shock*(.16+.56*edge));}"}),e=new Se(.235,0,3.8,24,9,!0);e.rotateZ(-Math.PI/2),e.translate(-3.8,0,0);let t=new se(e,r);return t.frustumCulled=!1,t}function Kc(r){let e=new Ee,t=[new ot({map:df(),normalMap:r.normalMap,normalScale:new J(.32,.32),metalness:.14,roughness:.39,clearcoat:.36,clearcoatRoughness:.26}),new ot({color:6714754,metalness:.95,roughness:.27,anisotropy:.35,envMapIntensity:1}),new ot({color:1450542,metalness:.52,roughness:.45}),new ot({color:463644,metalness:.4,roughness:.065,clearcoat:1,clearcoatRoughness:.045})],i=new Map,n=(l,c,h=0,d=0,p=0,u=0)=>{l.rotateX(u),l.translate(h,d,p),l.index&&(l=l.toNonIndexed()),i.has(c)||i.set(c,[]),i.get(c).push(l)};n(Bo([[.2,-1.72],[.265,-1.62],[.28,-1.5],[.28,1.05],[.273,1.22],[.245,1.43],[.18,1.72],[.1,1.94],[.025,2.1],[0,2.12]]),0);for(let l of[-1.5,-.85,.8,1.22])n(Bo([[.28,-.04],[.293,-.025],[.293,.025],[.28,.04]]),1,l);n(Bo([[.135,-2.02],[.21,-1.94],[.24,-1.76],[.25,-1.63],[.18,-1.63],[.15,-1.78],[.105,-1.94],[.135,-2.02]]),1),n(Bo([[0,1.91],[.096,1.91],[.077,2.02],[.04,2.1],[0,2.115]],40),3);let s=new ni;s.moveTo(-1.55,.245),s.lineTo(-.65,.245),s.lineTo(-1.17,.77),s.lineTo(-1.75,.7),s.closePath();for(let l=0;l<4;l++){let c=new mi(s,{depth:.045,bevelEnabled:!0,bevelSize:.012,bevelThickness:.012,bevelSegments:1,steps:1});c.translate(0,0,-.0225),n(c,0,0,0,0,l*Math.PI/2),n(new qe(.8,.06,.075),1,-1.1,Math.cos(l*Math.PI/2)*.29,Math.sin(l*Math.PI/2)*.29,l*Math.PI/2)}for(let[l,c]of i){let h=new se(Fi(c),t[l]);h.castShadow=!0,h.receiveShadow=!0,e.add(h),c.forEach(d=>d.dispose())}let a=pf();e.add(a);let o=new se(new St(.13,20,12),new rt({color:16770220,toneMapped:!1,transparent:!0,opacity:0}));return o.scale.set(.3,1,1),o.position.x=-1.96,e.add(o),e.userData={plume:a,throat:o},e}function mf(){let e=new Float32Array(366),t=new Float32Array(61*4),i=[];for(let o=0;o<=60;o++)if(t.set([o/60,0,o/60,1],o*4),o<60){let l=o*2;i.push(l,l+1,l+2,l+1,l+3,l+2)}let n=new De;n.setAttribute("position",new ke(e,3).setUsage(Yt)),n.setAttribute("uv",new ke(t,2)),n.setIndex(i);let s=new st({transparent:!0,depthWrite:!1,side:vt,blending:Ot,uniforms:{time:{value:0},fade:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:"varying vec2 vUv;uniform float time;uniform float fade;void main(){float edge=pow(max(0.0,1.0-abs(vUv.y*2.0-1.0)),2.8);float turbulent=.72+.15*sin(vUv.x*53.0-time*3.0)+.13*cos(vUv.x*97.0+vUv.y*13.0);float a=edge*turbulent*pow(1.0-vUv.x,1.5)*smoothstep(0.0,.08,vUv.x)*fade*.18;vec3 c=mix(vec3(.84,.56,.29),vec3(.44,.49,.54),smoothstep(0.0,.3,vUv.x));gl_FragColor=vec4(c,a);}"}),a=new se(n,s);return a.frustumCulled=!1,a}var ff;function Vn(r){let e=new Ee;for(let t=0;t<4;t++){let i=new st({transparent:!0,depthWrite:!1,uniforms:{age:{value:0},time:{value:0},seed:{value:r+t*6.2}},vertexShader:`varying vec3 vLocal;varying vec3 vN;varying vec3 vView;uniform float age;uniform float seed;${wd}void main(){vec3 p=position;float f=fbm(p*2.5+seed);p*=.55+f*.95;vLocal=p;vec4 mv=modelViewMatrix*vec4(p,1.0);vView=-mv.xyz;vN=normalMatrix*normal;gl_Position=projectionMatrix*mv;}`,fragmentShader:`varying vec3 vLocal;varying vec3 vN;varying vec3 vView;uniform float age;uniform float time;uniform float seed;${wd}void main(){float facing=max(0.0,dot(normalize(vN),normalize(vView)));float turbulent=fbm(vLocal*3.4+vec3(seed,time*.37,seed));float heat=clamp(turbulent*1.45-age*1.05,0.0,1.0);vec3 ember=mix(vec3(.16,.055,.022),vec3(.96,.34,.075),smoothstep(.18,.77,heat));ember=mix(ember,vec3(1.0,.88,.58),smoothstep(.72,.98,heat));float light=.4+.6*max(0.0,dot(normalize(vN),normalize(vec3(-.4,.8,1.0))));vec3 smoke=vec3(.14,.17,.20)*light;vec3 c=mix(ember,smoke,smoothstep(.10,.94,age)*(1.0-heat*.5));float a=pow(facing,.45)*(.62+turbulent*.36)*(1.0-smoothstep(.5,1.0,age));gl_FragColor=vec4(c,a);}`}),n=new se(ff||=new Zi(1,5),i);n.userData.index=t,e.add(n)}return e}var zo=class{constructor(e,t){this.root=new Ee,this.root.name="Guided torpedoes and physical impacts",e.add(this.root),this.shots=[],this.target=new S(25,2,-12),this.matrix=new ge,this.quaternion=new et,this.scale=new S,this.origin=new S,this.debrisOffset=new S,this.debrisEuler=new ze;for(let i=0;i<8;i++){let n=3.8+i*1.1,s=n+2.2+i%3*.3,a=new S(2.5,-1.1,[-4.1,4.1,-2.7][i%3]),o=new S(-4+Math.sin(n*.28)*.9,Math.sin(n*.38)*.35,0),l=new ze(Math.sin(n*.35)*.012,-.08+Math.sin(n*.23)*.025,Math.sin(n*.3)*.018);a.applyEuler(l).add(o);let c=this.target.clone().add(new S((i%3-1)*1.4,i%2*.8,(i%3-1)*1.2)),h=a.clone().add(new S(5,-1.3,i===1?5:-5)),d=c.clone().add(new S(-13,8+i*1.6,i===1?10:-3)),p=new un(a,h,d,c),u=Kc(t),m=mf(),g=Vn(i*13.9);g.position.copy(c),this.root.add(u,m,g),this.shots.push({launch:n,hit:s,curve:p,model:u,ribbon:m,blast:g,end:c})}this.debris=new At(new Zi(.14,0),new ut({color:7306374,metalness:.85,roughness:.48}),128),this.debris.instanceMatrix.setUsage(Yt),this.debris.frustumCulled=!1,this.root.add(this.debris),this.light=new Rt(16758635,0,60,2),this.root.add(this.light)}progress(e,t){let i=Oo((t-e.launch)/(e.hit-e.launch));return .16*i+.84*i*i}position(e,t,i){return e.curve.getPoint(this.progress(e,t),i)}update(e,t,i){if(this.root.visible=e===4,e!==4){this.light.intensity=0;return}let n=0,s=0;for(let[a,o]of this.shots.entries()){let l=t-o.launch,c=this.progress(o,t),h=Jc((l-.16)/.3),d=t>=o.launch&&t<o.hit;o.model.visible=d,d&&(this.position(o,t,o.model.position),o.model.quaternion.setFromUnitVectors(hf,o.curve.getTangent(c,Ki)),o.model.rotateX(.13*Math.sin(t*1.8+a)),o.model.userData.plume.material.uniforms.time.value=t,o.model.userData.plume.material.uniforms.power.value=h,o.model.userData.throat.material.opacity=h);let p=Oo((o.hit+1.65-t)/1.65);if(o.ribbon.visible=l>.2&&p>0,o.ribbon.visible){let g=o.ribbon.geometry.attributes.position;for(let f=0;f<=60;f++){let v=Math.max(o.launch,t-f*.033),_=Math.min(v,o.hit),x=this.progress(o,_);this.position(o,_,Ki),Td.subVectors(i.position,Ki),kn.crossVectors(o.curve.getTangent(x,uf),Td).normalize();let y=(.07+.35*f/60)*Math.min(1,Math.max(0,v-o.launch)*3);g.setXYZ(f*2,Ki.x+kn.x*y,Ki.y+kn.y*y,Ki.z+kn.z*y),g.setXYZ(f*2+1,Ki.x-kn.x*y,Ki.y-kn.y*y,Ki.z-kn.z*y)}g.needsUpdate=!0,o.ribbon.material.uniforms.time.value=t,o.ribbon.material.uniforms.fade.value=p*h}let u=t-o.hit,m=Oo(u/4.5);if(o.blast.visible=u>=0&&u<4.5,o.blast.visible){for(let g of o.blast.children){let f=g.userData.index,v=.38+Jc(m*3)*(2.4+f*.5);g.scale.set(v,v*(.75+f*.1),v),g.position.set(Math.sin(f*2.7+a)*m*4,Math.cos(f*1.3)*m*2,Math.cos(f*2.7+a)*m*3),g.rotation.set(m*.6,f*.6+m*.5,m*.2),g.material.uniforms.age.value=m,g.material.uniforms.time.value=t}s+=Math.exp(-u*5)*230;for(let g=0;g<16;g++){let f=g*2.39996+a,v=1.6+g%5*.65;this.origin.copy(o.end).add(this.debrisOffset.set(Math.cos(f)*u*v,Math.sin(g*5.3)*u*v*.6,Math.sin(f)*u*v)),this.quaternion.setFromEuler(this.debrisEuler.set(g+u*(g%3+1),u*.7,g*.31));let _=1-Jc((u-2.2)/2.3);this.scale.set(.6+g%3,1.2+g%4*.5,.4).multiplyScalar(_),this.matrix.compose(this.origin,this.quaternion,this.scale),this.debris.setMatrixAt(n++,this.matrix)}}}this.debris.count=n,this.debris.visible=n>0,this.debris.instanceMatrix.needsUpdate=!0,this.light.position.copy(this.target),this.light.intensity=s}diagnostic(){return{missiles:this.shots.filter(e=>e.model.visible).length,impacts:this.shots.filter(e=>e.blast.visible).length,missileParts:this.shots[0].model.children.length,flightPaths:"guided cubic Bezier",impactGeometry:"3D turbulence meshes"}}};var Ds=r=>Math.max(0,Math.min(1,r)),fn=r=>(r=Ds(r),r*r*r*(r*(r*6-15)+10)),je=(r=0,e=0,t=0)=>new S(r,e,t),Ed=je(1,0,0),Cd=je(0,1,0);function gf(r){let e=new Map;return{add(t,i,n=je(),s=new ze){t=t.index?t.toNonIndexed():t,t.applyMatrix4(new ge().compose(n,new et().setFromEuler(s),je(1,1,1))),e.has(i)||e.set(i,[]),e.get(i).push(t)},finish(){for(let[t,i]of e){let n=new se(Fi(i),t);n.castShadow=!0,n.receiveShadow=!0,r.add(n),i.forEach(s=>s.dispose())}}}}function vf(r,e,t,i,n){n.position.copy(r).add(e).multiplyScalar(.5),n.quaternion.setFromUnitVectors(Cd,n.direction.subVectors(e,r).normalize()),n.scale.set(t,r.distanceTo(e),t),i.compose(n.position,n.quaternion,n.scale)}function _f(){let r=document.createElement("canvas");r.width=4096,r.height=640;let e=r.getContext("2d");e.fillStyle="#071827",e.fillRect(0,0,4096,640),e.strokeStyle="#7cd8ff",e.lineWidth=12,e.strokeRect(20,20,4056,600),e.fillStyle="#effaff",e.textAlign="center",e.textBaseline="middle",e.font="700 286px Rajdhani, sans-serif",e.shadowColor="#57baff",e.shadowBlur=22,e.fillText("THE UNPROFESSIONALS",2048,278,3750),e.shadowBlur=0,e.font="600 83px Rajdhani, sans-serif",e.fillStyle="#91d7ff",e.fillText("VOYAGER COMMAND  /  ORBITAL DEFENCE",2048,502);let t=new Pi(r);return t.colorSpace=Mt,t.anisotropy=4,t}function Ad(r){let e=new jt;for(let t of r.children)t.isMesh&&(t.geometry.computeBoundingBox(),e.union(t.geometry.boundingBox));return e}var Go=class{constructor(e,t,i,n){this.root=new Ee,this.root.name="Unprofessionals base raid / 28 seconds",this.root.visible=!1,e.add(this.root),this.matrix=new ge,this.scratch={position:je(),direction:je(),scale:je(),quaternion:new et},this.point=je(),this.tangent=je(),this.scale=je(),this.quat=new et,this.debrisOffset=je(),this.debrisEuler=new ze,this.baseOrigin=je(-28,-9,7),this.baseScale=1.3;let s=(a,o=.52,l=.7)=>new ut({color:a,map:t.map,normalMap:t.normalMap,normalScale:new J(.35,.35),roughnessMap:t.orm,metalness:l,roughness:o,envMapIntensity:.9});this.armour=s(10531520,.65,.5),this.dark=s(2569022,.6,.8),this.blue=s(2511211,.58,.65),this.red=s(6307903,.65,.7),this.warm=new rt({color:16752464,toneMapped:!1}),this.cyan=new rt({color:8773631,toneMapped:!1}),this.white=new rt({color:15070719,toneMapped:!1}),this.maps=t,this.makeBase(),this.makeFleet(i,n),this.makeWeapons(t),this.makeExplosions(n),this.metrics={raidDuration:28,raidEnemyShips:5,raidInterceptors:6,raidTurrets:this.turrets.length,raidScheduledRounds:this.gunfire.shots.length,raidMissileLaunches:this.shots.length,raidImpactEvents:this.blasts.length,raidEnemyHullLengths:this.enemyHullLengths,raidInterceptorHullLength:this.interceptorHullLength,raidBaseScale:this.baseScale,raidBaseSign:"THE UNPROFESSIONALS",raidDefensiveRounds:this.gunfire.shots.filter(a=>a.side===1).length}}basePoint(e,t,i,n=je()){return n.set(e,t,i).multiplyScalar(this.baseScale).add(this.baseOrigin)}makeBase(){this.base=new Ee,this.base.position.copy(this.baseOrigin),this.base.scale.setScalar(this.baseScale),this.root.add(this.base);let e=gf(this.base),t=(a,o,l,c,h,d)=>e.add(a,o,je(l,c,h),d);t(new Se(18,20,2.3,12),this.armour,0,-2,0),t(new Se(16.9,18,1.2,12),this.dark,0,-.3,0),t(new Se(12,13.5,2.3,10),this.blue,-2,1.1,-3),t(new Se(24,27,2.8,16),this.dark,0,-4.3,0),t(new Se(23.5,24,1.2,16),this.armour,0,-2.6,0),t(tt(47,2.6,21,.5),this.armour,-1,-1.7,23),t(tt(45,.3,19,.35),this.dark,-1,-.25,23);for(let[a,o]of[[-22,-15],[-23,6],[-17,24],[14,25],[23,7],[22,-17]]){t(new Se(4,5,2.2,8),this.blue,a,.5,o),t(new Se(4.1,4.1,.3,8),this.armour,a,1.7,o);for(let l=0;l<6;l++){let c=l*Math.PI/3;t(tt(.65,.12,.4),this.cyan,a+Math.cos(c)*3.5,1.9,o+Math.sin(c)*3.5)}}for(let a=0;a<28;a++){let o=a*Math.PI/14;t(tt(1.6,2.7,1.1),this.blue,Math.cos(o)*24,-3.7,Math.sin(o)*24,new ze(0,-o,0))}for(let a=0;a<24;a++){let o=a*Math.PI/12,l=Math.cos(o)*18.7,c=Math.sin(o)*18.7;t(new qe(1.3,2.8,1),a%3?this.dark:this.armour,l,-1.5,c,new ze(0,-o,0)),t(new qe(.9,.11,.22),this.cyan,Math.cos(o)*18.1,.2,Math.sin(o)*18.1,new ze(0,-o,0))}for(let a of[-1,1]){t(new qe(10,1.4,16),this.armour,a*20,-1,2),t(new qe(8,.3,14),this.dark,a*20,-.1,2);for(let o=0;o<8;o++)t(new qe(.2,.08,1),this.cyan,a*23,.1,-4+o*1.7),t(new qe(1,.09,.18),this.warm,a*18,.1,-4+o*1.7)}this.hangars=[];for(let a=0;a<3;a++){let o=-13+a*13;t(new qe(26,1,12),this.armour,4,2,o),t(new qe(26,.6,12.8),this.armour,4,8.8,o);for(let l of[-1,1])t(new qe(26,5.8,.45),this.blue,4,5.5,o+l*6.2);t(new qe(.5,5.8,12),this.dark,-9,5.5,o);for(let l of[-1,1])t(new qe(24,.09,.12),this.cyan,4,2.6,o+l*5.4),t(new qe(.18,5.8,.18),this.cyan,17.2,5.5,o+l*5.9);this.hangars.push(this.basePoint(4,5.3,o))}for(let a=0;a<5;a++){let o=7.3-a*.8;t(new Se(o*.5,(o+.7)*.5,1.8,6),a%2?this.blue:this.armour,-15,3.5+a*1.9,-6),t(new Se(o*.51,o*.51,.15,6),this.cyan,-15,4.15+a*1.9,-6)}t(new Se(.17,.3,5,8),this.armour,-15,14,-6),t(new St(.4,12,8),this.cyan,-15,16.4,-6);for(let a of[-19,-16,-13])t(new Se(1,1,3,12),this.dark,a,2.4,8),t(new Ct(1,.12,6,16),this.armour,a,3.7,8,new ze(Math.PI/2,0,0));for(let a=0;a<14;a++)t(new qe(1.1,.12,3.4),this.dark,-12+a*1.7,.45,13),t(new qe(.12,.06,2.7),this.armour,-11.6+a*1.7,.53,13);for(let a=0;a<18;a++){let o=a*Math.PI/9,l=Math.cos(o)*16,c=Math.sin(o)*16;t(tt(2.3,.22,1.3),this.dark,l,.55,c,new ze(0,-o,0));for(let h=0;h<3;h++)t(tt(.12,.12,1.1),this.armour,l+(h-1)*.45,.74,c,new ze(0,-o,0))}for(let a of[8.6,10.2])e.add(Ht(je(-17,1,a),je(4,1,a),.18),this.armour);for(let a of[-16,-13])for(let o=0;o<9;o++)t(new qe(.1,2.1,4),this.dark,a+o*.24,2.4,-10);for(let a=0;a<9;a++)t(new qe(.9,.08,.15),this.armour,-18,3+a*.8,-6.5);for(let a of[-13,0,13])for(let o of[-5,3,11]){t(tt(6.8,.12,10.4),this.blue,o,9.16,a),t(tt(4.6,.15,1.2),this.dark,o,9.3,a-3.5);for(let l=0;l<7;l++)t(tt(.16,.14,1.1),this.armour,o-1.8+l*.6,9.45,a-3.5)}e.finish(),this.sign=new Ee,this.sign.name="THE UNPROFESSIONALS / illuminated base sign",this.sign.position.set(-2,8.5,31),this.sign.rotation.y=0,this.base.add(this.sign);let i=new se(tt(44.8,7,.8,.2),this.blue);this.sign.add(i);let n=new se(new Ii(44,6.875),new rt({map:_f(),toneMapped:!1}));n.position.z=.56,this.sign.add(n);for(let a of[-21.8,21.8]){let o=new se(tt(.65,8.8,.8),this.armour);o.position.set(a,-5.4,-.2),this.sign.add(o);let l=new se(new St(.2,12,8),this.cyan);l.position.set(a,3.7,0),this.sign.add(l)}this.turrets=[];let s=[[-22,2,-15],[-23,2,6],[-17,2,24],[14,2,25],[23,2,7],[22,2,-17],[-2,9.4,-13],[10,9.4,-13],[-2,9.4,0],[10,9.4,0],[-2,9.4,13],[10,9.4,13]];for(let[a,o]of s.entries()){let l=new Ee;l.position.set(o[0],o[1]+1,o[2]),this.base.add(l);let c=new se(new Se(1.8,2.2,1,10),this.dark);l.add(c);let h=new Ee;h.position.y=1,l.add(h);let d=new se(tt(3,1.7,2.8,.2),this.armour);h.add(d);let p=[],u=[];for(let m of[-1,1]){let g=new se(new Se(.18,.26,3.9,12),this.dark);g.rotation.x=Math.PI/2,g.position.set(m*.85,.3,2.5),h.add(g),p.push(g);let f=new se(new Ct(.2,.055,6,10),this.cyan);f.position.set(m*.85,.3,4.48),h.add(f),u.push(f)}this.turrets.push({g:l,head:h,barrels:p,tips:u,origin:this.basePoint(o[0],o[1]+2.3,o[2])})}this.shutters=[];for(let a=0;a<3;a++){let o=-13+a*13;for(let l of[-1,1]){let c=new se(tt(.22,5.8,6),this.dark);c.position.set(17.1,5.5,o+l*3),this.base.add(c),this.shutters.push({door:c,z:o,side:l})}}this.radars=[];for(let[a,o]of[[-18,-3],[-13,11]]){let l=new Ee;l.position.set(a,6,o);let c=new se(new St(1.6,20,12,0,Math.PI*2,0,.7),this.armour);c.rotation.z=.9,l.add(c);let h=new se(new Se(.12,.2,3,8),this.dark);h.position.y=-1.5,l.add(h),this.base.add(l),this.radars.push(l)}this.shield=new se(new St(21,40,24),new st({transparent:!0,depthWrite:!1,uniforms:{power:{value:0}},vertexShader:"varying vec3 vN;varying vec3 vP;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vP=p.xyz;vN=normalMatrix*normal;gl_Position=projectionMatrix*p;}",fragmentShader:"varying vec3 vN;varying vec3 vP;uniform float power;void main(){float edge=pow(1.-max(0.,dot(normalize(vN),normalize(-vP))),3.);gl_FragColor=vec4(.16,.6,1.,edge*power*.32);}"})),this.shield.scale.set(1.5,.72,1.5),this.shield.position.y=1.5,this.base.add(this.shield),this.base.updateMatrixWorld(!0)}updateBase(e){let t=fn((e-5.6)/1.25);for(let{door:i}of this.shutters)i.position.y=5.5+t*6.2;this.radars.forEach((i,n)=>i.rotation.y=e*(.28+n*.1))}enemyPosition(e,t,i=je()){let n=fn((t-e*.25)/4),s=fn((t-21.8-e*.18)/4.4);return i.set(36+e%2*13+(1-n)*(28+e*3)+s*55,11+e%3*5+Math.sin(t*.31+e)*.55+s*10,-22+e*8-s*12)}interceptorPosition(e,t,i=je()){return this.fighterPaths[e].getPoint(Ds((t-this.fighterLaunch[e])/15.8),i)}interceptorMuzzle(e,t){return this.interceptorPosition(e,t).addScaledVector(this.fighterPaths[e].getTangent(Ds((t-this.fighterLaunch[e])/15.8)).normalize(),this.fighterNoses[e])}makeFleet(e,t){this.enemies=[];for(let i=0;i<5;i++){let n=_i(No[i],this.maps,{enemy:!0,serial:i+1});n.rotation.y=Math.PI,n.scale.setScalar(i===0?.48:.26+i*.025),this.root.add(n),this.enemies.push(n)}this.enemyHullLengths=this.enemies.map(i=>Ad(i).getSize(je()).x*i.scale.x),this.interceptorHullLength=this.enemyHullLengths.reduce((i,n)=>i+n,0)/this.enemies.length,this.fighters=[],this.fighterPaths=[],this.fighterLaunch=[],this.fighterNoses=[];for(let i=0;i<6;i++){let n=_i(Do[i],this.maps,{serial:i+1}),s=Ad(n);n.scale.setScalar(this.interceptorHullLength/s.getSize(je()).x),this.fighterNoses.push(s.max.x*n.scale.x+.2),this.root.add(n),this.fighters.push(n);let a=i%3-1,o=Math.floor(i/3),l=this.hangars[i%3].clone();this.fighterLaunch.push(7+i%3*.55+o*2.8),this.fighterPaths.push(new br([l,l.clone().add(je(24*this.baseScale,0,0)),je(17,7+o*5,a*16+7),je(24+o*9,10+a*3+o*7,a*16-6),je(39+o*9,22+a*2+o*7,a*16-4),je(25+o*4,25+a*3+o*7,a*16+12),je(-3-o*4,23+a*2+o*5,a*16+25),je(-35,18+o*5,a*16+35)],!1,"catmullrom",.25))}}turretMuzzle(e,t,i=0){let n=this.turrets[e].origin.clone(),s=this.enemyPosition(e%5,t).sub(n).normalize(),a=je().crossVectors(Cd,s).normalize();return n.addScaledVector(s,4.48*this.baseScale).addScaledVector(a,(i%2?.85:-.85)*this.baseScale)}baseImpact(e){return e%3===2?this.basePoint(-21+e%5*10,2.1,e%2?23:-19):this.basePoint(-5+e%4*5.5,9.5,[-13,0,13][e%3]+Math.sin(e*2.4)*3.2)}makeWeapons(e){this.shots=[];let t=(s,a,o,l,c,h)=>{let d=o.clone().add(je(c===0?-5:7,6+h,c===0?4:-3)),p=l.clone().add(je(c===0?10:-10,7+h,-3));this.shots.push({launch:s,hit:s+a,side:c,curve:new un(o,d,p,l),end:l})};for(let s=0;s<84;s++){let a=3.1+s*.23,o=1.85+s%4*.16,l=this.enemyPosition(s%5,a).add(je(-5,-.5,0)),c=this.baseImpact(s);t(a,o,l,c,0,s%4)}for(let s=0;s<78;s++){let a=4.8+s*.22,o=1.9+s%3*.17,l=this.turretMuzzle(s%this.turrets.length,a),c=this.enemyPosition(s%5,a+o);t(a,o,l,c,1,s%4)}for(let s=0;s<42;s++){let a=11.3+s*.24,o=1.5+s%3*.15,l=this.interceptorMuzzle(s%6,a),c=this.enemyPosition((s+1)%5,a+o);t(a,o,l,c,1,2)}let i=Kc(e);this.missileMeshes=[];for(let s of i.children)if(s.isMesh&&s.material.isMeshPhysicalMaterial){let a=new At(s.geometry,s.material,64);a.instanceMatrix.setUsage(Yt),a.frustumCulled=!1,this.root.add(a),this.missileMeshes.push(a)}let n=new Se(1,1,1,5);this.redTrails=new At(n,new rt({color:16752221,transparent:!0,opacity:.48,depthWrite:!1,toneMapped:!1}),768),this.blueTrails=new At(n,new rt({color:9097215,transparent:!0,opacity:.48,depthWrite:!1,toneMapped:!1}),768);for(let s of[this.redTrails,this.blueTrails])s.instanceMatrix.setUsage(Yt),s.frustumCulled=!1,this.root.add(s);this.gunfire=new Fr(this.root,{rounds:384,muzzles:128,hits:192,sparks:1152,calibre:1.7});for(let s=0;s<this.turrets.length;s++)this.gunfire.schedule({start:4.3+s*.065,end:22.8,interval:.31,burst:5,spacing:.052,gun:s,side:1,muzzle:(a,o)=>this.turretMuzzle(s,a,o),target:(a,o)=>this.enemyPosition(s%5,a+.65).add(je((o-2)*.5,(s%3-1)*.4,0)),speed:130});for(let s=0;s<5;s++)this.gunfire.schedule({start:3.1+s*.12,end:22.2,interval:.39,burst:5,spacing:.06,gun:40+s,side:0,muzzle:a=>this.enemyPosition(s,a).add(je(-5,1.2,0)),target:(a,o)=>this.baseImpact(s*7+o),speed:115});for(let s=0;s<6;s++)this.gunfire.schedule({start:11+s*.22,end:22.3,interval:.32,burst:4,spacing:.055,gun:60+s,side:1,muzzle:a=>this.interceptorMuzzle(s,a),target:a=>this.enemyPosition(s%5,a+.45),speed:140});this.endPoint=je(),this.beginPoint=je()}makeExplosions(e){this.blasts=this.shots.map((t,i)=>({at:t.hit,end:t.end.clone(),scale:t.side===0?1.45:1.9,seed:i}));for(let t=0;t<60;t++){let i=8+t*.255,n=t%3===0;this.blasts.push({at:i,end:n?this.baseImpact(t+11):this.enemyPosition(t%5,i).add(je((t%3-1)*3,1,t%2?2:-2)),scale:n?1.65:2.5,seed:204+t})}this.blastCapacity=Math.max(...this.blasts.map(t=>this.blasts.filter(i=>i.at<=t.at&&i.at>=t.at-2.8).length))+2,this.blastPool=[];for(let t=0;t<this.blastCapacity;t++){let i=Vn(t*17.3),n=new qt(new kt({map:e,color:16767664,transparent:!0,depthWrite:!1,toneMapped:!1}));i.add(n);let s=new se(new Ct(1,.025,6,48),new rt({color:16763278,transparent:!0,depthWrite:!1,toneMapped:!1,opacity:0}));i.add(s),this.root.add(i),this.blastPool.push({g:i,flash:n,ring:s})}this.debris=new At(new Zi(.15,0),this.dark,this.blastCapacity*12),this.debris.instanceMatrix.setUsage(Yt),this.debris.frustumCulled=!1,this.root.add(this.debris),this.sparkGeo=new De,this.sparkGeo.setAttribute("position",new ke(new Float32Array(this.blastCapacity*40*3),3)),this.sparkGeo.setAttribute("opacity",new ke(new Float32Array(this.blastCapacity*40),1)),this.sparks=new Yi(this.sparkGeo,new st({transparent:!0,depthWrite:!1,uniforms:{height:{value:1080}},vertexShader:"attribute float opacity;varying float a;uniform float height;void main(){a=opacity;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(height*.12/-p.z,1.,5.);}",fragmentShader:"varying float a;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(1.,.66,.27,a*max(0.,1.-r));}"})),this.sparks.frustumCulled=!1,this.root.add(this.sparks),this.lights=[];for(let t=0;t<3;t++){let i=new Rt(16757082,0,35,2);this.root.add(i),this.lights.push(i)}}shotProgress(e,t){let i=Ds((t-e.launch)/(e.hit-e.launch));return .25*i+.75*i*i}update(e,t){this.root.visible=!0;for(let[u,m]of this.enemies.entries())m.visible=e<26.2,this.enemyPosition(u,e,m.position),m.rotation.set(.018*Math.sin(e*.5+u),Math.PI+fn((e-21.5)/3)*.35,Math.sin(e*.3+u)*.025),m.userData.update(e,.65+fn((e-22)/3)*.5);let i=0;for(let u=0;u<6;u++){let m=this.fighters[u],g=e-this.fighterLaunch[u],f=Ds(g/15.8);m.visible=g>=0&&f<1,m.visible&&(i++,this.interceptorPosition(u,e,m.position),this.tangent.copy(this.fighterPaths[u].getTangent(f)).normalize(),m.quaternion.setFromUnitVectors(Ed,this.tangent),m.rotateX(Math.sin(f*Math.PI*2)*.42*fn((f-.16)/.1)),m.userData.update(e,.8))}for(let[u,m]of this.turrets.entries()){let g=this.enemyPosition(u%5,e);m.head.lookAt(g)}let n=0,s=0,a=0;for(let u of this.shots){let m=this.shotProgress(u,e);if(e>=u.launch&&e<u.hit){u.curve.getPoint(m,this.point),this.tangent.copy(u.curve.getTangent(m)),this.quat.setFromUnitVectors(Ed,this.tangent),this.scale.setScalar(.38),this.matrix.compose(this.point,this.quat,this.scale);for(let g of this.missileMeshes)g.setMatrixAt(n,this.matrix);n++}if(!(e<u.launch||e>u.hit+.3))for(let g=0;g<12;g++){let f=Math.min(e,u.hit)-g*.055;if(f<u.launch)break;u.curve.getPoint(this.shotProgress(u,f),this.beginPoint),u.curve.getPoint(this.shotProgress(u,Math.max(u.launch,f-.06)),this.endPoint),vf(this.beginPoint,this.endPoint,.045*(1-g/14),this.matrix,this.scratch),u.side===0?this.redTrails.setMatrixAt(s++,this.matrix):this.blueTrails.setMatrixAt(a++,this.matrix)}}for(let u of this.missileMeshes)u.count=n,u.instanceMatrix.needsUpdate=!0;for(let[u,m]of[[this.redTrails,s],[this.blueTrails,a]])u.count=m,u.instanceMatrix.needsUpdate=!0;this.gunfire.update(e);for(let[u,m]of this.turrets.entries()){let g=this.gunfire.recoil(u,e);for(let f of m.barrels)f.position.z=2.5-g;for(let f of m.tips)f.position.z=4.48-g}this.updateBase(e);let o=0,l=0,c=0,h=0;this.lights.forEach(u=>u.intensity=0);let d=this.sparkGeo.attributes.position,p=this.sparkGeo.attributes.opacity;for(let u of this.blasts){let m=e-u.at;if(m<0||m>2.8||o>=this.blastCapacity)continue;let g=m/2.8,f=this.blastPool[o++];f.g.visible=!0,f.g.position.copy(u.end);for(let v=0;v<4;v++){let _=f.g.children[v],x=(.18+fn(g*2.7)*(1.3+v*.35))*u.scale;_.scale.set(x,x*(.8+v*.07),x),_.position.set(Math.sin(v*2.7+u.seed)*g*u.scale*1.8,g*(1.2+v*.6),Math.cos(v*2.7+u.seed)*g*u.scale*1.4),_.material.uniforms.age.value=g,_.material.uniforms.time.value=e}if(f.flash.scale.setScalar(u.scale*(3+m*9)),f.flash.material.opacity=Math.exp(-m*11)*.85,f.ring.quaternion.copy(t.quaternion),f.ring.scale.setScalar((.2+m*7)*u.scale),f.ring.material.opacity=Math.exp(-m*5)*.09,m<.35){let v=this.lights[(o-1)%3];v.position.copy(u.end),v.intensity=Math.max(v.intensity,Math.exp(-m*6)*145),u.end.x<0&&(h=Math.max(h,Math.exp(-m*6)*.18))}for(let v=0;v<12;v++){let _=v*2.39996+u.seed,x=1.2+v%5*.7;this.point.copy(u.end).add(this.debrisOffset.set(Math.cos(_)*m*x,Math.sin(_*2)*m*x-m*m*.35,Math.sin(_)*m*x)),this.quat.setFromEuler(this.debrisEuler.set(v+m*(1+v%3),m*.8,v*.7)),this.scale.set(.7+v%3,.5,1.7).multiplyScalar(1-fn(g)),this.matrix.compose(this.point,this.quat,this.scale),this.debris.setMatrixAt(l++,this.matrix)}for(let v=0;v<40;v++){let _=v*2.39996+u.seed*1.9,x=m*(2+v%9*.65);d.setXYZ(c,u.end.x+Math.cos(_)*x,u.end.y+Math.sin(v*8.1)*x*.7-m*m*.5,u.end.z+Math.sin(_)*x),p.setX(c++,Math.pow(1-g,2)*.9)}}for(let u=o;u<this.blastPool.length;u++)this.blastPool[u].g.visible=!1;this.debris.count=l,this.debris.instanceMatrix.needsUpdate=!0,this.sparkGeo.setDrawRange(0,c),d.needsUpdate=!0,p.needsUpdate=!0,this.sparks.material.uniforms.height.value=innerHeight,this.shield.material.uniforms.power.value=h,this.shield.visible=h>.005,Object.assign(this.metrics,{raidExplosionCapacity:this.blastCapacity,raidActiveMissiles:n,raidActiveImpacts:o,raidActiveInterceptors:i,raidLaserBolts:this.gunfire.rounds.count,raidMuzzleFlashes:this.gunfire.activeMuzzles,raidShipModels:this.enemies.map(u=>u.userData.modelType),interceptorModels:this.fighters.map(u=>u.userData.modelType)})}diagnostic(){return this.metrics}};var Ye=(r=0,e=0,t=0)=>new S(r,e,t),Rd=Ye(0,1,0),xf=r=>Math.max(0,Math.min(1,r)),$c=r=>(r=xf(r),r*r*(3-2*r));function ko(r,e,t,i=1){r.position.copy(e).add(t).multiplyScalar(.5),r.quaternion.setFromUnitVectors(Rd,t.clone().sub(e).normalize()),r.scale.set(i,e.distanceTo(t),i)}var Vo=class{constructor(e,t,i){this.root=new Ee,this.root.name="Orbital construction drydock",e.add(this.root),this.arms=[],this.cranes=[],this.clamps=[];let n=(m,g=.65)=>new ot({color:m,map:t.map,normalMap:t.normalMap,normalScale:new J(.23,.23),roughness:g,metalness:.75,clearcoat:.12}),s=n(9280681),a=n(2371902),o=n(3165797),l=n(12098387),c=new ot({color:1060418,roughness:.15,metalness:.55}),h=new rt({color:13954559,toneMapped:!1}),d=new rt({color:16762745,toneMapped:!1}),p=Gn(this.root),u=(m,g,f,v,_,x,y)=>p.add(tt(m,g,f),v,Ye(_,x,y));for(let m of[-1,1]){u(56,.8,3,a,0,-7,m*13),u(55,.16,.25,s,0,-6.4,m*12.2),u(55,.16,.25,s,0,-6.4,m*13.8);for(let g=-27;g<=27;g+=3)u(.12,.1,2.6,s,g,-6.52,m*13),u(.12,1.2,.12,s,g,-5.9,m*14.3),p.add(Ht(Ye(g,-7,m*13),Ye(g+2.8,-9,m*13),.1),s),p.add(Ht(Ye(g,-9,m*13),Ye(g+2.8,-7,m*13),.1),s),u(.6,.06,.15,g%2?h:d,g,-6.48,m*11.7);u(56,.1,.1,s,0,-5.3,m*14.3),u(55,.25,.4,s,0,-9,m*13);for(let g of[-24,24]){u(1,20,1,o,g,3,m*13),u(1.3,.5,1.3,l,g,12.9,m*13),p.add(Ht(Ye(g,-6,m*13),Ye(g-5*Math.sign(g),4,m*13),.18),s);for(let f=-6;f<12;f+=2)u(.15,.08,.9,s,g+.6,f,m*13)}u(50,.6,.7,s,0,13,m*13),u(50,.18,.18,h,0,13.4,m*13);for(let g of[-17,18]){u(3.8,2,2,o,g,-5.8,m*13),u(2.5,.25,2.1,a,g,-4.75,m*13);for(let f=0;f<7;f++)u(.15,1.4,.12,s,g-1.2+f*.4,-5.8,m*11.94)}}for(let m of[-23,0,23]){u(1.3,.65,26,a,m,-7,0);for(let g of[-1,1])p.add(Ht(Ye(m,-7,g*12),Ye(m,-3,g*7),.25),s)}for(let m=0;m<2;m++){let g=new Ee;this.root.add(g);let f=Gn(g),v=(b,R,I)=>f.add(b,R,I);v(tt(1.1,.6,27),o,Ye(0,13,0)),v(tt(.45,.3,27),s,Ye(0,15,0));for(let b=-13;b<13;b+=2)v(Ht(Ye(0,13,b),Ye(0,15,b+2),.12),s),v(Ht(Ye(0,15,b),Ye(0,13,b+2),.12),s);for(let b of[-1,1]){v(tt(2.5,1.2,2),l,Ye(0,13,b*13));for(let R of[-.8,.8]){let I=new Se(.42,.42,.25,16);I.rotateX(Math.PI/2),v(I,a,Ye(R,12.6,b*13))}}f.finish();let _=new Ee;g.add(_);let x=Gn(_);x.add(tt(2.8,1.1,2.2),l,Ye(0,12.6,0)),x.add(new Se(.55,.55,1.6,20),s,Ye(0,12.1,0),new ze(Math.PI/2,0,0)),x.add(tt(1.4,1,1.3),c,Ye(1.6,12.1,0)),x.finish();let y=[];for(let b=0;b<2;b++){let R=new se(new Se(1,1,1,6),a);R.castShadow=!0,this.root.add(R),y.push(R)}let E=new se(tt(.7,.24,1.6),l);this.root.add(E),this.cranes.push({g,trolley:_,cables:y,yoke:E,index:m})}for(let m=0;m<4;m++){let g=new Ee,f=m%2?1:-1;g.position.set(m<2?-11:10,-5.7,f*11),this.root.add(g);let v=new se(new Se(.85,1.1,1,20),o);g.add(v);let _=[];for(let R=0;R<2;R++){let I=new se(new Se(1,1,1,10),R?s:o);I.castShadow=!0,g.add(I),_.push(I)}let x=new se(new St(.55,16,12),l);g.add(x);let y=new qt(new kt({map:i,color:14939647,transparent:!0,depthWrite:!1,toneMapped:!1}));y.scale.setScalar(1.1),g.add(y);let E=new se(new ii(.22,.8,12),a);g.add(E);let b=new se(new Se(1,1,1,6),a);g.add(b),this.arms.push({g,tip:y,links:_,elbow:x,nozzle:E,cable:b,s:f})}for(let m=0;m<6;m++){let g=m%2?1:-1,f=new Ee;f.position.set(-14+Math.floor(m/2)*14,-4.4,g*8.3),this.root.add(f);let v=new se(tt(3,1.2,2),l);f.add(v);let _=new se(tt(2,.6,1.5),a);_.position.set(0,.8,-g*.4),f.add(_),this.clamps.push({g:f,s:g})}p.finish(),this.tugs=[];for(let m=0;m<2;m++){let g=_i(m?"scout":"tender",t,{serial:90+m});g.scale.setScalar(.095),this.root.add(g),this.tugs.push(g)}}update(e,t,i,n){let s=$c(e===2?(t-.8)/3:(t-10.5)/2);this.root.updateMatrixWorld(!0),n.updateMatrixWorld(!0),this.clamps.forEach(({g:a,s:o})=>{a.position.z=o*(8.3+s*4),a.rotation.x=o*s*.45});for(let[a,o]of this.cranes.entries()){let l=i.filter(d=>d.mesh.visible&&d.progress>0&&d.progress<.98&&d.center.y>0).sort((d,p)=>d.center.x-p.center.x),c=l[a?l.length-1:0],h=Ye(a?8:-10,3,0);e===1&&t<10.6&&c&&(c.mesh.getWorldPosition(h),this.root.worldToLocal(h)),o.g.position.x=vi.lerp(h.x,a?23:-23,s),o.trolley.position.z=vi.lerp(h.z,0,s);for(let d=0;d<2;d++){let p=Ye(o.g.position.x,12.2,o.trolley.position.z+(d?-.5:.5)),u=h.clone().add(Ye(0,.3,d?-.5:.5));u.lerp(Ye(p.x,11,p.z),s),o.yoke.position.copy(u).add(Ye(0,-.2,d?.5:-.5)),ko(o.cables[d],p,u,.035),o.cables[d].visible=e===1||s<1}}for(let[a,o]of this.arms.entries()){o.g.position.x=(a<2?-15:1)+$c(t/10)*8;let l=1-s,c=o.s,h=Ye(Math.sin(t*.7+a)*2.5,5.6+Math.sin(t*.9+a)*.5,-c*(4.9+Math.sin(t*.4+a)*.8));h.lerp(Ye(0,2,-c),s);let d=Ye(-1.4+Math.sin(t*.6+a)*.5,4.6,-c*2.1);d.lerp(Ye(0,2.8,-c*.8),s),o.elbow.position.copy(d),ko(o.links[0],Ye(0,.4,0),d,.28),ko(o.links[1],d,h,.2),ko(o.cable,Ye(.4,.7,c*.3),d.clone().add(Ye(.4,.2,0)),.065),o.tip.position.copy(h),o.nozzle.position.copy(h).add(Ye(0,.25,0)),o.nozzle.quaternion.setFromUnitVectors(Rd,h.clone().sub(d).normalize()),o.tip.material.opacity=e===1&&t>1&&t<10?l*(.45+.25*Math.sin(t*39+a)**2):0}this.tugs.forEach((a,o)=>{a.position.set(-19+t*.7,-3.3+Math.sin(t*.8+o)*.4,(o?1:-1)*(17+s*9)),a.rotation.y=o?.22:-.22,a.userData.update(t,.3+s*.5)})}diagnostic(){return{constructionCranes:2,weldingArms:4,releaseClamps:6,serviceTugs:2}}};var lt=(r=0,e=0,t=0)=>new S(r,e,t),Qc=lt(0,1,0),yf=r=>Math.max(0,Math.min(1,r)),gn=r=>(r=yf(r),r*r*(3-2*r)),Pd=[{p:[-10,2.3757,4],n:[-.24227,.97018,.00722],r:1.35},{p:[-1,1.9618,1.4],n:[.08735,.99614,.00806],r:1.15},{p:[5,.3633,4],n:[.12933,.73382,.66692],r:1.2}];function Id(r,e,t,i){let n=t.clone().sub(e);r.position.copy(e).add(t).multiplyScalar(.5),r.quaternion.setFromUnitVectors(Qc,n.normalize()),r.scale.set(i,e.distanceTo(t),i)}function Mf(r){let e=[],t=[],i=[];for(let s=0;s<=40;s++){let a=s/40*Math.PI*2,o=.05*Math.sin(s*6.23)+.035*Math.cos(s*1.17);for(let l of[0,1]){let c=r*(l?1.18+o:1+o);e.push(Math.cos(a)*c,l?.02:.07+Math.max(0,Math.sin(s*1.91))*.16,Math.sin(a)*c),t.push(s/8,l)}}for(let s=0;s<40;s++){let a=s*2;i.push(a,a+1,a+2,a+1,a+3,a+2)}let n=new De;return n.setAttribute("position",new fe(e,3)),n.setAttribute("uv",new fe(t,2)),n.setIndex(i),n.computeVertexNormals(),n}function Sf(r,e,t=!1){let i=new Ee,n=Gn(i),s=new ot({color:t?15100454:[14462526,4565687,8891224][e%3],map:r.map,normalMap:r.normalMap,normalScale:new J(.2,.2),metalness:.45,roughness:.48,clearcoat:.25}),a=new ut({color:10925765,metalness:.85,roughness:.3}),o=new ut({color:1517363,metalness:.7,roughness:.5}),l=new rt({color:t?16768194:12119295,toneMapped:!1});n.add(tt(1.9,.75,1.4),s),n.add(tt(.6,.24,.8),o,lt(.7,.45,0)),n.add(new St(.15,12,8),l,lt(1.04,.16,0));for(let d of[-1,1])n.add(Ht(lt(0,0,0),lt(-.2,0,d*1.1),.12),a),n.add(new Se(.35,.42,.9,16),o,lt(-.2,0,d*1.1)),n.add(new Ct(.34,.065,6,16),a,lt(-.2,.45,d*1.1),new ze(Math.PI/2,0,0)),n.add(new Se(.22,.22,.03,12),l,lt(-.2,-.47,d*1.1));if(t)for(let d of[-1,1])n.add(new yr(.28,.9,3,10),a,lt(-.6,.15,d*.52),new ze(0,0,Math.PI/2));else for(let d=0;d<4;d++)n.add(tt(.13,.12,.7),a,lt(-.4+d*.25,.46,0));n.finish();let c=new se(new Se(1,1,1,10),a);i.add(c);let h=new se(new ii(.14,.5,12),o);return i.add(h),i.userData={arm:c,tool:h,firefighter:t},i}var Ho=class{constructor(e,t,i,n,s){this.hero=e,this.root=new Ee,this.root.name="Battle damage / drone fire suppression / hull repairs",e.add(this.root),this.enabled={value:0},this.local={value:new ge},this.holes={value:Pd.map(h=>new Je(...h.p,h.r))},this.sites=[],this.drones=[],this.metrics={repairDrones:5,repairBreaches:3};let a=h=>{let d=h.onBeforeCompile.bind(h),p=h.customProgramCacheKey.bind(h);h.onBeforeCompile=m=>{d(m),Object.assign(m.uniforms,{damageEnabled:this.enabled,damageLocal:this.local,damageHoles:this.holes}),m.vertexShader=`varying vec3 vDamageLocal;uniform mat4 damageLocal;
`+m.vertexShader,m.vertexShader=m.vertexShader.replace("#include <project_vertex>",`vDamageLocal=(damageLocal*modelMatrix*vec4(transformed,1.0)).xyz;
#include <project_vertex>`),m.fragmentShader=`varying vec3 vDamageLocal;uniform float damageEnabled;uniform vec4 damageHoles[3];
`+m.fragmentShader,m.fragmentShader=m.fragmentShader.replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
if(damageEnabled>0.5){for(int i=0;i<3;i++){if(damageHoles[i].w>0.01 && distance(vDamageLocal,damageHoles[i].xyz)<damageHoles[i].w)discard;}}`)};let u=p();h.customProgramCacheKey=()=>u+"-repair-holes-1.8",h.needsUpdate=!0},o=new Set([t]);i.assembled.traverse(h=>{h.material&&o.add(h.material)}),o.forEach(a);for(let[h,d]of Pd.entries()){let p=new Ee;p.position.fromArray(d.p),p.quaternion.setFromUnitVectors(Qc,lt(...d.n).normalize()),this.root.add(p);let u=d.r,m=new ut({color:1185563,roughness:1,metalness:.35,side:vt}),g=new ot({color:4932931,metalness:.84,roughness:.65,emissive:14109459,emissiveIntensity:.35,side:vt,normalMap:n.normalMap}),f=new se(Mf(u),g);p.add(f);let v=new se(new dn([new J(.05,-.8*u),new J(u*.45,-.7*u),new J(u*.85,-.35*u),new J(u*1.03,.01)],32),m);p.add(v);let _=new Ee;p.add(_);for(let R=0;R<3;R++){let I=new se(Ht(lt(-u*.65,-.45,-.4+R*.4),lt(u*.65,-.45,-.4+R*.4),.06),new ut({color:5661549,metalness:.8,roughness:.5}));_.add(I)}let x=new se(tt(u*2.3,.08,u*2.3,.14),new ot({color:h===1?2386594:10663881,normalMap:n.normalMap,normalScale:new J(.3,.3),metalness:.6,roughness:.4,clearcoat:.3}));x.position.y=.13,p.add(x);let y=Vn(90+h*9);p.add(y);for(let R of y.children)R.material.uniforms.strength={value:1},R.material.fragmentShader=`uniform float strength;
`+R.material.fragmentShader.replace("gl_FragColor=vec4(c,a);","gl_FragColor=vec4(c,a*strength);");let E=new qt(new kt({map:s,color:15267839,transparent:!0,depthWrite:!1,toneMapped:!1}));p.add(E);let b=new Rt(16747325,0,12,2);b.position.set(0,1,0).applyQuaternion(p.quaternion).add(p.position),this.root.add(b),this.sites.push({g:p,rim:f,cup:v,internals:_,patch:x,fire:y,flare:E,lamp:b,site:d})}for(let h=0;h<5;h++){let d=Sf(n,h,h>=3);this.root.add(d);let p=new se(new Se(1,1,1,8),new rt({color:12775679,transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));this.root.add(p),d.userData.arc=p,this.drones.push(d)}let l=new St(1,6,4);this.mist=new At(l,new rt({color:12707827,transparent:!0,opacity:.25,depthWrite:!1,toneMapped:!1}),180),this.mist.instanceMatrix.setUsage(Yt),this.mist.frustumCulled=!1,this.root.add(this.mist),this.matrix=new ge,this.q=new et,this.sparksGeo=new De,this.sparksGeo.setAttribute("position",new ke(new Float32Array(360*3),3)),this.sparksGeo.setAttribute("alpha",new ke(new Float32Array(360),1));let c=new st({transparent:!0,depthWrite:!1,uniforms:{height:{value:1080}},vertexShader:"attribute float alpha;varying float a;uniform float height;void main(){a=alpha;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(height*.10/-p.z,1.,5.);}",fragmentShader:"varying float a;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(1.,.8,.45,max(0.,1.-r)*a);}"});this.sparks=new Yi(this.sparksGeo,c),this.sparks.frustumCulled=!1,this.root.add(this.sparks)}update(e,t){let i=e===5,n=e===4;if(this.root.visible=i||n,this.enabled.value=i||n?1:0,this.sites.forEach(p=>p.lamp.intensity=0),!this.root.visible)return;this.hero.updateMatrixWorld(!0),this.local.value.copy(this.hero.matrixWorld).invert();let s=0,a=0,o=0,l=0,c=0,h=this.sparksGeo.attributes.position,d=this.sparksGeo.attributes.alpha;for(let[p,u]of this.sites.entries()){let m=8+p*.9,g=n?gn((t-m)/.3):1,f=i?gn((t-3-p*.4)/2.7):0,v=i?gn((t-6.4-p*.45)/3.6):0,_=g*(1-f),x=u.site.r*g*(1-v);this.holes.value[p].w=x,u.g.visible=g>.001,u.rim.visible=u.cup.visible=u.internals.visible=x>.02,u.rim.scale.setScalar(Math.max(.001,x/u.site.r)),u.cup.scale.copy(u.rim.scale),u.internals.scale.copy(u.rim.scale),u.rim.material.emissiveIntensity=_*.5,u.patch.visible=i&&v>.01,u.patch.scale.set(gn(v*2.1),1,gn(v*1.3)),u.fire.visible=_>.015,u.lamp.intensity=_*(7+Math.sin(t*23+p)*2),u.fire.visible&&s++,x>.025&&a++,o+=v/3,u.fire.children.forEach((R,I)=>{let L=(t*.7+I*.23+p*.13)%1;R.position.set(Math.sin(I*2.4+t)*.3,.35+L*(1.4+I*.24),Math.cos(I*3+t)*.3),R.scale.set((.5+I*.08)*(1-L*.5),(.9+I*.22)*(1-L*.45),(.5+I*.08)*(1-L*.5)),R.material.uniforms.age.value=.08+L*.38,R.material.uniforms.time.value=t,R.material.uniforms.strength.value=_*(1-L*.6)});let y=i&&t>6.1+p*.4&&t<10.5+p*.4,E=t*4+p,b=lt(Math.cos(E)*u.site.r*(1-v*.5),.18,Math.sin(E)*u.site.r*(1-v*.5));if(u.flare.visible=y,u.flare.position.copy(b),u.flare.scale.setScalar(.75+Math.sin(t*51)**2*.25),y||_>.3)for(let R=0;R<70;R++){let I=(t*2+R*.037)%1,L=R*2.39996+p,G=y?1.5:2.4,H=y?b:lt(0,.2,0),O=H.clone().add(lt(Math.cos(L)*I*G,Math.sin(R*3.1)*I*.7+.2-I*I*.8,Math.sin(L)*I*G));O.applyQuaternion(u.g.quaternion).add(u.g.position),h.setXYZ(c,...O.toArray()),d.setX(c++,(1-I)**2*(y?.8:.35))}}for(let[p,u]of this.drones.entries()){if(u.userData.arc.visible=!1,u.visible=i&&t>.6&&t<13.3,!u.visible)continue;let m=this.sites[p<3?p:p===3?0:2],g=lt(...m.site.n),f=lt(...m.site.p),v=gn((t-.7-p*.16)/2),_=gn((t-11.4-p*.1)/1.7),x=f.clone().addScaledVector(g,p<3?3:5).add(lt(p<3?-1.7:2,0,p<3?1.3:-1.5)),y=lt(-27+p*13,10+p%2*4,19+p*2);u.position.copy(y).lerp(x,v).lerp(y.clone().add(lt(12,18,-3)),_),u.position.y+=Math.sin(t*1.4+p)*.12,u.rotation.set(.08*Math.sin(t+p),-.4+p*.2,.05*Math.cos(t+p)),u.updateMatrix();let E=f.clone().sub(u.position).applyQuaternion(u.quaternion.clone().invert()),b=E.clone().normalize().multiplyScalar(p<3?1.8:1.4);if(Id(u.userData.arm,lt(.6,-.2,0),b,.09),u.userData.tool.position.copy(b),u.userData.tool.quaternion.setFromUnitVectors(Qc,E.clone().normalize()),p<3&&t>6.1+p*.4&&t<10.5+p*.4){let L=gn((t-6.4-p*.45)/3.6),G=t*4+p,H=lt(Math.cos(G)*m.site.r*(1-L*.5),.18,Math.sin(G)*m.site.r*(1-L*.5)).applyQuaternion(m.g.quaternion).add(m.g.position),O=b.clone().applyQuaternion(u.quaternion).add(u.position);Id(u.userData.arc,O,H,.018),u.userData.arc.visible=!0}if(t>2.7&&t<6.2&&v>.95&&_===0){let L=b.clone().applyQuaternion(u.quaternion).add(u.position);for(let G=0;G<30;G++){let H=(t*2+G/30)%1,O=H*.38,N=L.clone().lerp(f,H).add(lt(Math.sin(G*8)*O,Math.cos(G*5)*O,Math.sin(G*3)*O));this.matrix.compose(N,this.q,lt(.025+H*.08,.025+H*.08,.07+H*.12)),this.mist.setMatrixAt(l++,this.matrix)}}}this.mist.count=l,this.mist.instanceMatrix.needsUpdate=!0,this.mist.visible=i&&l>0,this.sparksGeo.setDrawRange(0,c),h.needsUpdate=!0,d.needsUpdate=!0,this.sparks.material.uniforms.height.value=innerHeight,Object.assign(this.metrics,{activeFires:s,openBreaches:a,repairProgress:Math.round(o*100),repairMode:i?"drone repair":n?"battle damage":"off",suppressionParticles:l})}diagnostic(){return this.metrics}};var bf=r=>Math.max(0,Math.min(1,r)),Bi=r=>(r=bf(r),r*r*r*(r*(r*6-15)+10)),Xt=vi.lerp,Tf=[[-27,11,-1],[-36,10,19],[-39,16,-16],[-39,7,29],[-46,18,9]],wf=[[30,12,-20],[42,7,-5],[44,18,-38],[54,11,-18],[53,24,-51]],Wo=class{constructor(e,t){this.root=new Ee,this.root.name="Gift subscriptions / approaching enemy fleet",this.root.visible=!1,e.add(this.root),this.enemies=No.map((i,n)=>{let s=_i(i,t,{enemy:!0,serial:n+1});return s.scale.setScalar([.49,.32,.37,.34,.32][n]),this.root.add(s),s}),this.phase="idle",this.visibleEnemies=0}update(e,t,i,n){this.root.visible=!0;let s=Bi(e/6),a=Bi((e-6)/6),o=Bi((e-11)/4),l=.55;t.scale.setScalar(.78),t.position.set(Xt(-30,-12,s),6+Math.sin(e*.3)*.25,6),t.rotation.set(Math.sin(e*.3)*.008,Xt(-.08,l,a),-.045*Math.sin(a*Math.PI));let c=Math.min(5,Math.max(2,Math.ceil(Math.sqrt(Math.max(1,Number(n)||1)))+1));return i.forEach((h,d)=>{if(h.visible=d<c,!h.visible)return;let p=Bi((e-.9-d*.55)/6.4),u=Bi((e-6.4-d*.25)/5.6),m=Tf[d],g=d%2?1:-1;h.scale.setScalar([.38,.36,.37,.34,.32][d]),h.position.set(Xt(-84-d*7,m[0],p),Xt(m[1]+4,m[1],p)+Math.sin(e*.35+d)*.16,Xt(m[2]+10,m[2],p)),h.rotation.set(g*.025*(1-u),Xt(-.08,l,u),g*.13*Math.sin(u*Math.PI)),h.userData.update(e+d,Xt(1.05,.3,o))}),this.visibleEnemies=0,this.enemies.forEach((h,d)=>{let p=2.5+d*.4,u=Bi((e-p)/10.2),m=wf[d];if(h.visible=e>=p,!h.visible)return;this.visibleEnemies++,h.position.set(Xt(m[0]+67+d*5,m[0],u),Xt(m[1]+9,m[1],u)+Math.sin(e*.22+d)*.12,Xt(m[2]-58-d*5,m[2],u));let g=t.position.x-h.position.x,f=t.position.z-h.position.z;h.rotation.set(.018*Math.sin(e*.25+d)*(1-o),Math.atan2(-f,g),.035*Math.sin(e*.4+d)*(1-o)),h.userData.update(e+d*.6,Xt(.95,.27,Bi((e-12-d*.15)/3.5)))}),this.phase=e<3?"assembling":e<11?"enemy-approach":e<14.5?"forming-battle-line":"ready-to-face-off",{camera:[Xt(31,38,Bi((e-2)/9)),Xt(37,43,Bi((e-2)/9)),Xt(124,143,Bi((e-2)/9))],look:[0,5,-9],thrust:Xt(.8,.28,o)}}diagnostic(){return{giftBackdrop:"enemy-fleet",faceoffVisible:this.root.visible,faceoffPhase:this.root.visible?this.phase:"idle",approachingEnemyModels:this.enemies.map(e=>e.userData.modelType),approachingEnemyColours:this.enemies.map(e=>e.userData.livery),approachingEnemies:this.root.visible?this.visibleEnemies:0}}};var Ld=(r=0,e=0,t=0)=>new S(r,e,t);var Xo=class{constructor(e,t,i){this.root=new Ee,this.root.name="Crossfire damage / timed secondary explosions",e.add(this.root),this.events=t.filter((n,s)=>s%9===0&&n.hit<17).map((n,s)=>({at:n.hit,p:n.to.clone(),scale:n.side?.45:.27,seed:s})),this.pool=[];for(let n=0;n<16;n++){let s=Vn(n*6.31),a=new qt(new kt({map:i,color:16766624,transparent:!0,depthWrite:!1,toneMapped:!1}));s.add(a),this.root.add(s),this.pool.push({g:s,flash:a})}this.debris=new At(new qe(.12,.08,.23),new ut({color:7833234,metalness:.8,roughness:.55}),256),this.debris.instanceMatrix.setUsage(Yt),this.debris.frustumCulled=!1,this.root.add(this.debris),this.m=new ge,this.q=new et,this.position=Ld(),this.scale=Ld(),this.euler=new ze,this.light=new Rt(16756074,0,60,2),this.root.add(this.light)}update(e,t,i){if(this.root.visible=e===4,this.light.intensity=0,e!==4)return;let n=0,s=0;for(let a of this.events){let o=t-a.at;if(o<0||o>1.5||n>=this.pool.length)continue;let l=o/1.5,{g:c,flash:h}=this.pool[n++];c.visible=!0,c.position.copy(a.p);for(let d=0;d<4;d++){let p=c.children[d],u=(.12+(1-Math.exp(-o*5))*(1.2+d*.2))*a.scale;p.scale.set(u,u*(1+d*.1),u),p.position.set(Math.sin(d*2.7+a.seed)*o*.5,Math.cos(d*1.1)*o*.4,Math.cos(d*3+a.seed)*o*.5),p.material.uniforms.age.value=l,p.material.uniforms.time.value=t}h.scale.setScalar((.5+o*3)*a.scale),h.material.opacity=Math.exp(-o*13)*.8,o<.16&&(this.light.position.copy(a.p),this.light.intensity=Math.max(this.light.intensity,Math.exp(-o*10)*65));for(let d=0;d<10;d++){let p=d*2.399+a.seed,u=this.position.set(Math.cos(p),Math.sin(d*3.7),Math.sin(p)).multiplyScalar(o*(1+d%3)).add(a.p);this.q.setFromEuler(this.euler.set(o+d,o*2,d)),this.m.compose(u,this.q,this.scale.setScalar(1-l)),this.debris.setMatrixAt(s++,this.m)}}for(let a=n;a<this.pool.length;a++)this.pool[a].g.visible=!1;this.debris.count=s,this.debris.instanceMatrix.needsUpdate=!0,this.active=n}diagnostic(){return{secondaryExplosionEvents:this.events.length,activeSecondaryExplosions:this.active||0}}};var jo=class extends Rn{constructor(){super();let e=new qe;e.deleteAttribute("uv");let t=new ut({side:Vt}),i=new ut,n=new Rt(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let s=new se(e,t);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);let a=new At(e,i,6),o=new gt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let l=new se(e,Br(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new se(e,Br(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new se(e,Br(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let d=new se(e,Br(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let p=new se(e,Br(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);let u=new se(e,Br(100));u.position.set(0,20,0),u.scale.set(1,.1,1),this.add(u)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Br(r){return new Ms({color:0,emissive:16777215,emissiveIntensity:r})}window.VoyagerFleetPerformance={NoiseBank:ks,SoundTimeline:Gs};var Ns=(r,e=0,t=1)=>Math.max(e,Math.min(t,r)),Lt=r=>(r=Ns(r),r*r*r*(r*(r*6-15)+10)),vn=vi.lerp;function Ud(r){let e=atob(r),t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return t}function Dd(r){let e=new Uint16Array(Ud(r.positions).buffer),t=new Float32Array(e.length);for(let n=0;n<t.length;n++){let s=n%3;t[n]=vn(r.bounds[0][s],r.bounds[1][s],e[n]/65535)}let i=new De;return i.setAttribute("position",new ke(t,3)),i.setIndex(new ke(new Uint32Array(Ud(r.indices).buffer),1)),i.computeVertexNormals(),i.computeBoundingBox(),i}function Nd(r){let e=Lo(r,.72),t=e.attributes.position,i=e.attributes.normal,n=new Float32Array(t.count*2),s=new Float32Array(t.count*3),a=new Float32Array(t.count*2),o=new ve("#c5d0d7"),l=new ve("#1965ac"),c=new ve("#3c4855"),h=new ve("#061523"),d=new ve,p=new S,u=new S,m=new S,g=new S;for(let f=0;f<t.count;f+=3){p.fromBufferAttribute(t,f),u.fromBufferAttribute(t,f+1),m.fromBufferAttribute(t,f+2),g.subVectors(u,p).cross(m.sub(p)).normalize();let v=Math.abs(g.y)>Math.max(Math.abs(g.x),Math.abs(g.z))?1:Math.abs(g.x)>Math.abs(g.z)?0:2;for(let _=f;_<f+3;_++){let x=t.getX(_),y=t.getY(_),E=t.getZ(_),b=Math.abs(E);n[_*2]=(v===0?E:x)/8+.5,n[_*2+1]=(v===1?E:y)/8+.5;let R=b>2.9&&b<5.6&&x<12&&y>-.6||b<1.4&&x>3&&y>.2||x<-12&&y>1,I=y<-2.1||x<-17.4,L=x>-14&&x<-6&&y>2.3&&y<4&&Math.abs(i.getY(_))<.6||x>17.7&&y>-.2&&y<.8;d.copy(L?h:R?l:I?c:o);let G=.96+.025*Math.sin(x*.7)*Math.cos(E*.8);d.multiplyScalar(G),s.set([d.r,d.g,d.b],_*3),a.set([I?1:0,L?1:0],_*2)}}return e.setAttribute("uv",new ke(n,2)),e.setAttribute("color",new ke(s,3)),e.setAttribute("finish",new ke(a,2)),e}function Ef(r){let e=r.attributes.position,t=new Map;for(let i=0;i<e.count;i+=3){let n=(e.getX(i)+e.getX(i+1)+e.getX(i+2))/3,s=(e.getY(i)+e.getY(i+1)+e.getY(i+2))/3,a=(e.getZ(i)+e.getZ(i+1)+e.getZ(i+2))/3,o=Math.min(7,Math.max(0,Math.floor((n+20)/5))),l=a<-1.8?0:a>1.8?2:1,c=s>.8?1:0,h=o+8*l+24*c;t.has(h)||t.set(h,[]),t.get(h).push(i,i+1,i+2)}return[...t].map(([i,n])=>{let s=new De;for(let[o,l]of Object.entries(r.attributes)){let c=new Float32Array(n.length*l.itemSize);n.forEach((h,d)=>{for(let p=0;p<l.itemSize;p++)c[d*l.itemSize+p]=l.array[h*l.itemSize+p]}),s.setAttribute(o,new ke(c,l.itemSize))}s.computeBoundingBox();let a=s.boundingBox.getCenter(new S);return s.translate(-a.x,-a.y,-a.z),{geo:s,center:a,key:i}})}function Af(){let r=document.createElement("canvas");r.width=r.height=128;let e=r.getContext("2d"),t=e.createRadialGradient(64,64,0,64,64,64);return t.addColorStop(0,"#fff"),t.addColorStop(.06,"#fff"),t.addColorStop(.15,"rgba(255,255,255,.6)"),t.addColorStop(.4,"rgba(255,255,255,.12)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,128,128),new Pi(r)}function Cf(){let r=document.createElement("canvas");r.width=256,r.height=64;let e=r.getContext("2d");for(let t=0;t<256;t++){let i=t/255,n=4+i*21,s=e.createLinearGradient(0,32-n,0,32+n);s.addColorStop(0,"#ffffff00"),s.addColorStop(.35,`rgba(255,255,255,${(1-i)**1.6*.3})`),s.addColorStop(.5,`rgba(255,255,255,${(1-i)**1.4})`),s.addColorStop(.65,`rgba(255,255,255,${(1-i)**1.6*.3})`),s.addColorStop(1,"#ffffff00"),e.fillStyle=s,e.fillRect(255-t,0,1,64)}return new Pi(r)}var eh=class{constructor(e,{quality:t="auto"}={}){this.canvas=e,this.quality=t,this.renderScale=t==="auto"?Math.min(1,1920/Math.min(innerWidth,3840)):1,this.pendingScale=this.renderScale,this.targetFPS=60,this.lastShadow=-1,this.samples=[],this.scaleCooldown=0,this.stats={fps:0,width:0,height:0,scale:1,quality:t},this.look=new S,this.armPositions=Array.from({length:4},()=>new S),this.tempMatrix=new ge,this.lastStage=0,this.contextLost=!1,this.renderer=new Po({canvas:e,alpha:!0,antialias:!0,powerPreference:"high-performance",premultipliedAlpha:!0}),this.renderer.setPixelRatio(1),this.renderer.outputColorSpace=Mt,this.renderer.toneMapping=mo,this.renderer.toneMappingExposure=1,this.renderer.setClearColor(0,0),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=so,this.renderer.shadowMap.autoUpdate=!1,this.scene=new Rn,this.scene.background=null,this.camera=new It(31,16/9,.2,700),this.camera.position.set(32,19,45),this.camera.lookAt(0,-1,0),this.clock=0,this.active=!1,this.surface=null,this.parts=[],this.fleet=[],this.sparks=[],this.lasers=[],this.missiles=[],this.glowMap=Af(),this.plumeMap=Cf();let i=new jo,n=new Dr(this.renderer);this.envTarget=n.fromScene(i,.035),this.scene.environment=this.envTarget.texture,this.scene.environmentIntensity=.7,i.dispose(),n.dispose(),this.scene.add(new Ts(13096937,1120547,.3));let s=(a,o,l)=>{let c=new Es(a,o);return c.position.set(...l),this.scene.add(c),c};this.key=s(16773340,3.1,[22,32,19]),this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048),Object.assign(this.key.shadow.camera,{left:-40,right:40,top:30,bottom:-30,near:1,far:140}),this.key.shadow.bias=-35e-5,this.key.shadow.normalBias=.04,s(11259107,1.25,[-25,15,-29]),s(11651804,.45,[0,-14,30]),this.weldLight=new Rt(8773631,0,30,2),this.scene.add(this.weldLight),this.battleLight=new Rt(16744504,0,100,2),this.scene.add(this.battleLight),this.resize(),e.addEventListener("webglcontextlost",a=>{a.preventDefault(),this.contextLost=!0,this.ready=!1}),e.addEventListener("webglcontextrestored",()=>{this.contextLost=!1,this.ready=!!this.assetsReady,this.lastShadow=-1})}resize(){let e=this.quality==="balanced"?1920:3840,t=Math.min(1,e/innerWidth)*this.renderScale,i=Math.max(1,Math.round(innerWidth*t)),n=Math.max(1,Math.round(innerHeight*t));(this.canvas.width!==i||this.canvas.height!==n)&&this.renderer.setSize(i,n,!1),this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),Object.assign(this.stats,{width:i,height:n,scale:this.renderScale})}frameTiming(e,t){if(e<4||e>250||(this.samples.push(e),this.samples.length<90))return;let i=this.samples.slice().sort((l,c)=>l-c),n=i[Math.floor(i.length/2)],s=1e3/(this.samples.reduce((l,c)=>l+c)/this.samples.length);if(this.samples.length=0,this.stats.fps=Math.round(s),this.quality!=="auto"||t<this.scaleCooldown)return;let a=this.pendingScale,o=Math.min(1,1280/Math.min(innerWidth,3840));n>20?a=Math.max(o,a-.1):n<17.7&&s>58&&(a=Math.min(1,a+.05)),a!==this.pendingScale&&(this.pendingScale=a,this.scaleCooldown=t+4500)}diagnostic(){var e,t,i,n,s,a,o,l,c,h;return{...this.stats,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,transparent:this.renderer.getClearAlpha()===0,contextLost:this.contextLost,heroTriangles:window.VoyagerPolaris.hero.faces,detailFittings:(e=this.hullDetails)==null?void 0:e.anchors,detailTriangles:(t=this.hullDetails)==null?void 0:t.triangles,pbrMaps:4096,visualBuild:"1.12",noiseBuffers:((i=window.VoyagerFleetAudioStats)==null?void 0:i.generated)||0,autoResize:"between alerts",escortModels:this.fleet.map(d=>d.userData.modelType),escortColours:this.fleet.map(d=>d.userData.livery),...(n=this.repairs)==null?void 0:n.diagnostic(),...(s=this.faceoff)==null?void 0:s.diagnostic(),...(a=this.combat)==null?void 0:a.diagnostic(),...(o=this.shipyard)==null?void 0:o.diagnostic(),...(l=this.gunfire)==null?void 0:l.diagnostic(),...(c=this.ordnance)==null?void 0:c.diagnostic(),...(h=this.raid)==null?void 0:h.diagnostic()}}async init(){let e={},t=new bs;await Promise.all(Object.entries(window.VoyagerFleetSurfaces).map(async([o,l])=>{let c=await t.loadAsync(l);c.wrapS=c.wrapT=hr,c.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy()),o==="map"&&(c.colorSpace=Mt),e[o]=c})),this.surface=new ot({map:e.map,normalMap:e.normalMap,aoMap:e.orm,aoMapIntensity:.65,roughnessMap:e.orm,metalnessMap:e.orm,vertexColors:!0,color:16777215,metalness:1,roughness:1,normalScale:new J(.72,.72),clearcoat:.28,clearcoatRoughness:.34,envMapIntensity:1,side:vt}),this.surface.onBeforeCompile=o=>{o.vertexShader=`attribute vec2 finish; varying vec2 vFinish;
`+o.vertexShader,o.vertexShader=o.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vFinish=finish;`),o.fragmentShader=`varying vec2 vFinish;
`+o.fragmentShader,o.fragmentShader=o.fragmentShader.replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor=mix(metalnessFactor,.88,vFinish.x);`),o.fragmentShader=o.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor=mix(roughnessFactor,.09,vFinish.y);`)},this.surface.customProgramCacheKey=()=>"voyager-hull-pbr-1.3";let i=Dd(window.VoyagerPolaris.hero),n=Nd(i);this.hero=new Ee,this.shipRoot=new Ee,this.hero.add(this.shipRoot),this.scene.add(this.hero),this.parts=Ef(n).map((o,l)=>{let c=new se(o.geo,this.surface);return c.position.copy(o.center),c.castShadow=!0,c.receiveShadow=!0,this.shipRoot.add(c),{...o,mesh:c,order:(o.center.x+20)/40*.7+l%3*.09}}),this.assembled=new se(n,this.surface),this.assembled.castShadow=!0,this.assembled.receiveShadow=!0,this.hero.add(this.assembled),this.hullDetails=yd(this.hero,this.parts,e),i.dispose();let s=Dd(window.VoyagerPolaris.fleet);this.fleetGeo=Nd(s),s.dispose(),this.ghost=new se(this.fleetGeo,new rt({color:4496883,wireframe:!0,transparent:!0,opacity:.035,depthWrite:!1})),this.hero.add(this.ghost),this.hero.userData.engines=this.engines(this.hero),this.shipyard=new Vo(this.scene,e,this.glowMap),this.dock=this.shipyard.root,this.arms=this.shipyard.arms,this.createFX(),this.ordnance=new zo(this.scene,e),this.enemy=_i("marauder",e,{enemy:!0}),this.enemy.scale.setScalar(.31),this.enemy.rotation.y=Math.PI,this.enemy.position.set(25,2,-12),this.scene.add(this.enemy),this.battleEnemies=[this.enemy];for(let[o,l]of["raider","destroyer"].entries()){let c=_i(l,e,{enemy:!0,serial:o+2});c.scale.setScalar(.24+o*.035),c.rotation.y=Math.PI,c.position.set(...o?[36,-1,6]:[15,10,-24]),this.scene.add(c),this.battleEnemies.push(c)}for(let o=0;o<5;o++){let l=_i(bd[o],e,{serial:o+1});this.fleet.push(l),this.scene.add(l)}this.faceoff=new Wo(this.scene,e),this.repairs=new Ho(this.hero,this.surface,this.hullDetails,e,this.glowMap),this.gunfire=new Fr(this.scene),this.heroWeapons=new Fo(this.hero,e);let a=(o,l)=>{let c=l.clone();return c.applyEuler(new ze(Math.sin(o*.35)*.012,-.08+Math.sin(o*.23)*.025,Math.sin(o*.3)*.018)),c.add(new S(-4+Math.sin(o*.28)*.9,Math.sin(o*.38)*.35,0))};for(let o=0;o<2;o++)this.gunfire.schedule({start:2.2+o*.18,end:15.8,interval:.51,burst:4,spacing:.085,gun:o,side:1,muzzle:(l,c)=>this.heroWeapons.muzzleAt(o,l,c),target:(l,c)=>new S(24.8,2+(c-1)*.2,-12+(o%2?-.5:.5)),speed:100});this.gunfire.schedule({start:3.1,end:15.5,interval:.59,burst:4,spacing:.09,side:0,gun:10,muzzle:o=>new S(21,3.1,-12),target:o=>a(o,new S(3,.8,3.3)),speed:85});for(let o=0;o<3;o++){let l=o%2?1:-1,c=new S(-13-o*5,6+o*3,l*(10+o*2));this.gunfire.schedule({start:2.5+o*.2,end:15.6,interval:.63,burst:4,spacing:.08,gun:20+o,side:1,muzzle:h=>c.clone().add(new S(3,1.5,0)),target:h=>this.battleEnemies[o].position.clone().add(new S(0,.8,0)),speed:100})}for(let o=1;o<3;o++)this.gunfire.schedule({start:3.4+o*.2,end:15.6,interval:.68,burst:4,spacing:.085,gun:10+o,side:0,muzzle:l=>this.battleEnemies[o].position.clone().add(new S(-3,.8,0)),target:l=>a(l,new S(-10+o*7,1.5,4)),speed:90});this.combat=new Xo(this.scene,this.gunfire.shots,this.glowMap),this.raid=new Go(this.scene,e,this.fleetGeo,this.glowMap),this.shield.visible=!0,this.ready=!0;for(let o of Object.values(e))this.renderer.initTexture(o);this.renderer.compileAsync&&await this.renderer.compileAsync(this.scene,this.camera);for(let[o,l]of[[1,5],[2,7],[3,8],[4,0],[4,8.6],[4,12],[5,5],[5,9],[6,12],[6,24]])this.render(o,l),await new Promise(c=>setTimeout(c,0));return this.assetsReady=!0,this.lastStage=0,this.clear(),this}engines(e){let t=new Ee;e.add(t);let i=[[-18.6,-.35,-4.7],[-18.6,-.35,4.7],[-19,-.6,-1.25],[-19,-.6,1.25]],n=[],s=[],a=[];for(let c=0;c<4;c++){let h=i[c],d=c<2?.58:.34;for(let u of[0,Math.PI/2])for(let[m,g]of[[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]]){let f=(g-.5)*d*2;n.push(-m*8,f*Math.cos(u),f*Math.sin(u)),s.push(m,g),a.push(...h)}let p=new qt(new kt({map:this.glowMap,color:12641791,transparent:!0,depthWrite:!1,blending:Ot,toneMapped:!1,opacity:.7}));p.position.set(...h),p.scale.setScalar(d*2.8),t.add(p)}let o=new De;o.setAttribute("position",new fe(n,3)),o.setAttribute("uv",new fe(s,2)),o.setAttribute("origin",new fe(a,3));let l=new st({transparent:!0,depthWrite:!1,side:vt,blending:Ot,uniforms:{power:{value:0},time:{value:0}},vertexShader:"attribute vec3 origin;varying vec2 vUv;uniform float power;uniform float time;void main(){vUv=uv;vec3 p=position;p.x*=power;p.yz*=.65+power*.35;p.y+=sin(time*2.0+uv.x*8.0)*.012*uv.x;gl_Position=projectionMatrix*modelViewMatrix*vec4(p+origin,1.0);}",fragmentShader:"varying vec2 vUv;uniform float power;uniform float time;void main(){float fall=pow(1.0-vUv.x,2.0);float core=exp(-pow((vUv.y-.5)*6.0,2.0));float diamonds=.86+.14*cos(vUv.x*40.0-time*3.0);float a=core*fall*diamonds*min(1.0,power)*.65;vec3 c=mix(vec3(.2,.52,.85),vec3(.82,.94,1.0),core*(1.0-vUv.x));gl_FragColor=vec4(c,a);}"});return t.add(new se(o,l)),t.userData.plume=l,t}createFX(){let e=new Float32Array(1620),t=new Float32Array(540);this.particles=new De,this.particles.setAttribute("position",new ke(e,3)),this.particles.setAttribute("opacity",new ke(t,1)),this.sparkMat=new st({transparent:!0,depthWrite:!1,blending:Ot,uniforms:{size:{value:.18},resolution:{value:innerHeight},colour:{value:new ve(12315391)}},vertexShader:"attribute float opacity; varying float vAlpha; uniform float size; uniform float resolution; void main(){vAlpha=opacity;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*resolution/-mv.z,1.0,8.0);}",fragmentShader:"varying float vAlpha; uniform vec3 colour; void main(){float a=max(0.0,1.0-length(gl_PointCoord-.5)*2.0);gl_FragColor=vec4(colour,a*a*vAlpha);}"}),this.sparkPoints=new Yi(this.particles,this.sparkMat),this.scene.add(this.sparkPoints),this.burst=new Ee,this.scene.add(this.burst),this.flash=new qt(new kt({map:this.glowMap,color:16759927,transparent:!0,blending:Ot,depthWrite:!1,toneMapped:!1})),this.burst.add(this.flash),this.ring=new se(new Ct(1,.018,8,96),new rt({color:9362687,transparent:!0,blending:Ot,depthWrite:!1,toneMapped:!1})),this.burst.add(this.ring);let i=new st({transparent:!0,depthWrite:!1,blending:Ot,uniforms:{age:{value:0},time:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:`varying vec2 vUv;uniform float age;uniform float time;
 float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){return noise(p)*.55+noise(p*2.07)*.28+noise(p*4.13)*.17;}
 void main(){vec2 q=vUv*2.0-1.0;float r=length(q);if(r>1.0)discard;float z=sqrt(max(0.0,1.0-dot(q,q)));float n=fbm(vec3(q*3.1,z*2.0-time*.42));float edge=1.0-smoothstep(.40+n*.34,.77+n*.2,r);float pockets=fbm(vec3(q*6.0+time*.2,z*4.0));float heat=clamp(n*1.1+pockets*.4-age*.7,0.0,1.0);vec3 ember=mix(vec3(.13,.052,.025),vec3(.9,.24,.035),heat);vec3 c=mix(ember,vec3(1.0,.85,.5),smoothstep(.63,.94,heat));float light=.45+.55*max(0.0,dot(normalize(vec3(q,z)),normalize(vec3(-.4,.7,1.0))));c=mix(c,vec3(.13,.15,.17)*light,smoothstep(.28,.95,age)*(1.0-heat*.7));float a=edge*(1.0-smoothstep(.6,1.0,age))*.92;gl_FragColor=vec4(c,a);}`});this.fireball=new se(new Ii(2,2),i),this.burst.add(this.fireball),this.shield=new se(new St(1,64,32),new st({transparent:!0,side:pn,depthWrite:!1,blending:Ot,uniforms:{strength:{value:0},time:{value:0}},vertexShader:"varying vec3 vNormal; varying vec3 vPosition;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p;}",fragmentShader:"varying vec3 vNormal;varying vec3 vPosition;uniform float strength;uniform float time;void main(){float f=pow(1.0-max(0.0,dot(normalize(vNormal),normalize(-vPosition))),3.5);float scan=.85+.15*sin(vPosition.y*1.8+time*1.2);gl_FragColor=vec4(.16,.58,1.0,clamp(f*strength*scan,0.0,.28));}"})),this.shield.scale.set(23,8,13),this.hero.add(this.shield)}setEngines(e,t,i){e.visible=t>.001,e.userData.plume.uniforms.power.value=t,e.userData.plume.uniforms.time.value=i;for(let n of e.children)n.isSprite&&(n.material.opacity=Ns(t)*.65)}render(e,t,i=18,n=1){if(!this.ready||this.contextLost)return;if(e===6){if(this.gunfire.hide(),!this.raidHidden){this.raidHidden=new Map;for(let u of this.scene.children)u!==this.raid.root&&!u.isLight&&(this.raidHidden.set(u,u.visible),u.visible=!1)}this.weldLight.intensity=0,this.battleLight.intensity=0,this.raid.update(t,this.camera);let p=Lt((t-6)/6)*(1-Lt((t-18)/6));this.camera.position.set(76-p*4,70-p*3,170-p*6),this.camera.lookAt(0,-16,0),(t-this.lastShadow>.1||t<this.lastShadow||this.lastStage!==6)&&(this.renderer.shadowMap.needsUpdate=!0,this.lastShadow=t),this.lastStage=6,this.active=!0,this.clock=t,this.renderer.render(this.scene,this.camera);return}if(this.raidHidden){for(let[p,u]of this.raidHidden)p.visible=u;this.raidHidden=null}this.raid.root.visible=!1,this.active=!0,this.clock=t,this.hero.visible=!0;let s=e===1&&t<11;this.shipRoot.visible=s,this.assembled.visible=!s,this.hullDetails.assembled.visible=!s,this.hero.position.set(0,0,0),this.battleEnemies.forEach(p=>p.visible=!1),this.hero.rotation.set(0,0,0),this.hero.scale.setScalar(1),this.dock.visible=e===1||e===2,this.dock.position.set(0,0,0),this.ghost.visible=!1;let a=Lt((t-3)/9),o=.1;if(s)for(let p of this.parts){let u=1.1+p.order*6,m=Lt((t-u)/2.9),g=1-m;p.progress=m,p.mesh.position.copy(p.center),p.mesh.position.y+=g*(2.4+p.key%2*.6),p.mesh.position.z+=Math.sign(p.center.z||1)*g*.8,p.mesh.position.x+=g*.4,p.mesh.rotation.set(g*.02*Math.sin(p.key),g*.03*Math.cos(p.key),g*.02),p.mesh.visible=t>=u}this.faceoff.root.visible=!1,this.fleet.forEach(p=>{p.visible=!1,p.rotation.set(0,0,0)}),this.weldLight.intensity=0,this.battleLight.intensity=0,this.shield.material.uniforms.strength.value=0,this.burst.visible=!1,this.ring.visible=e===5,this.gunfire.hide(),this.missiles.forEach(p=>p.visible=!1);let l=32,c=19,h=45,d=this.look.set(0,-1,0);if(e===1&&(l=vn(40,36,Lt(t/15)),c=vn(29,26,Lt(t/15)),h=vn(96,90,Lt((t-6)/9)),d.set(0,-4,0),this.dock.visible=!0,o=t<2?0:.07+Lt((t-10)/3)*.3,this.dock.position.y=-Lt((t-12)/3)*9,this.hero.position.y=Lt((t-11)/3)*1.8,this.weldLight.color.set(10147327),this.weldLight.intensity=Lt((t-1)/.5)*(1-Lt((t-9.5)/1))*24,this.weldLight.position.set(-15+Ns((t-1)/9)*30,3,4)),e===2){let p=Lt((t-1)/3.5),u=Ns((t-6)/9.7),m=u*u;this.hero.position.set(m*35,p*5+m*115,-m*38),this.hero.rotation.z=.04+Lt((t-3.5)/3.5)*.75,this.hero.rotation.y=-.08-m*.24,this.dock.position.y=-p*1.2,l=36,c=26,h=92,d.set(0,-4,0),o=.12+Lt((t-1.5)/3)*1.3+m*.9}if(e===3){this.dock.visible=!1;let p=this.faceoff.update(t,this.hero,this.fleet,n);[l,c,h]=p.camera,d.set(...p.look),o=p.thrust}if(e===4){this.dock.visible=!1,this.hero.position.set(-4+Math.sin(t*.28)*.9,Math.sin(t*.38)*.35,0),this.hero.rotation.set(Math.sin(t*.35)*.012,-.08+Math.sin(t*.23)*.025,Math.sin(t*.3)*.018);let p=Lt((t-3.2)/3.3)*(1-Lt((t-8.7)/3));l=vn(40,34,p),c=vn(32,27,p),h=vn(99,92,p),d.set(vn(0,5,p),0,-4),o=1;for(let u=0;u<3;u++){let m=this.fleet[u];m.visible=!0,m.scale.setScalar(.4),m.position.set(-13-u*5,6+u*3,(u%2?1:-1)*(10+u*2)),m.rotation.y=-.07,m.userData.update(t+u,.8)}this.battleEnemies.forEach((u,m)=>{u.visible=t<16.5+m*.3,u.userData.update(t,.85)}),this.hero.updateMatrixWorld(!0),this.battle(t)}e===5&&(this.dock.visible=!1,l=32,c=29,h=64,d.set(0,0,0),this.hero.rotation.y=-.12,this.hero.rotation.z=Math.sin(t*.45)*.012,o=.12,this.burst.visible=!1,this.ring.visible=!1),this.setEngines(this.hero.userData.engines,o,t),this.hero.updateMatrixWorld(!0),this.dock.updateMatrixWorld(!0),this.shipyard.update(e,t,this.parts,this.hero),this.heroWeapons.update(e,t,this.hero,this.gunfire),this.repairs.update(e,t),this.enemy.userData.update(t,.65),this.updateSparks(e,t),this.camera.position.set(l,c,h),this.camera.lookAt(d),this.ordnance.update(e,t,this.camera),this.combat.update(e,t,this.camera),this.fireball.quaternion.copy(this.camera.quaternion),this.shield.visible=this.shield.material.uniforms.strength.value>.001,(e!==this.lastStage||t<this.lastShadow||t-this.lastShadow>=1/30)&&(this.renderer.shadowMap.needsUpdate=!0,this.lastShadow=t),this.lastStage=e,this.renderer.render(this.scene,this.camera)}updateSparks(e,t){let i=this.particles.attributes.position,n=this.particles.attributes.opacity,s=e===1&&t>1&&t<11;if(this.sparkPoints.visible=s,!!s){if(this.sparkMat.uniforms.resolution.value=this.renderer.domElement.height,this.sparkMat.uniforms.colour.value.set(e===4?16757612:16770749),e===1)for(let a=0;a<4;a++)this.arms[a].tip.getWorldPosition(this.armPositions[a]);for(let a=0;a<n.count;a++){let o=a*12.9898,l=(t*1.8+a*.037)%1,c=o%6.283,h=Math.sin(o*2.7),d=2+(Math.sin(o)*.5+.5)*8,p,u,m;if(e===1){let g=this.armPositions[a%4];p=g.x+Math.cos(c)*l*d*.35,u=g.y+h*l*d*.3-l*l*4,m=g.z+Math.sin(c)*l*d*.45}else{let g=e===4?Ns((t-11)/3):(t+a*.005)%3/3,f=(e===4?10:25)*g;p=(e===4?25:0)+Math.cos(c)*f,u=h*f*.6,m=(e===4?-12:0)+Math.sin(c)*f}i.setXYZ(a,p,u,m),n.setX(a,(1-l)**2*(e===1?.8:.65))}i.needsUpdate=!0,n.needsUpdate=!0}}battle(e){this.gunfire.update(e),this.shield.material.uniforms.strength.value=e>8.2&&e<9.2?Math.sin((e-8.2)*Math.PI)*.35:0,this.shield.material.uniforms.time.value=e}clear(){this.active=!1,this.quality==="auto"&&this.pendingScale!==this.renderScale&&(this.renderScale=this.pendingScale,this.resize()),this.samples.length=0,this.renderer.setClearColor(0,0),this.renderer.clear()}dispose(){this.clear();let e=new Set,t=new Set,i=new Set;this.scene.traverse(n=>{n.geometry&&e.add(n.geometry);for(let s of n.material?Array.isArray(n.material)?n.material:[n.material]:[]){t.add(s);for(let a of Object.values(s))a!=null&&a.isTexture&&i.add(a)}}),e.forEach(n=>n.dispose()),t.forEach(n=>n.dispose()),i.forEach(n=>n.dispose()),this.envTarget.dispose(),this.renderer.dispose()}};window.VoyagerFleetScene=eh;})();
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
