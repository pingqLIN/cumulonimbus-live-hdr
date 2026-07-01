(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();const ac="modulepreload",sc=function(n){return"/"+n},Vs={},oc=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){let s=function(c){return Promise.all(c.map(d=>Promise.resolve(d).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");r=s(t.map(c=>{if(c=sc(c),c in Vs)return;Vs[c]=!0;const d=c.endsWith(".css"),p=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":ac,d||(u.as="script"),u.crossOrigin="",u.href=c,l&&u.setAttribute("nonce",l),document.head.appendChild(u),d)return new Promise((m,v)=>{u.addEventListener("load",m),u.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(s){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=s,window.dispatchEvent(o),!o.defaultPrevented)throw s}return r.then(s=>{for(const o of s||[])o.status==="rejected"&&a(o.reason);return e().catch(a)})};function rl(){const n=window.matchMedia("(max-width: 760px)").matches,e=window.matchMedia("(pointer: coarse)").matches;return{narrowViewport:n,coarsePointer:e,mobileWideView:n||e,iosChrome:/\bCriOS\//i.test(navigator.userAgent)&&/iP(?:hone|ad|od)/i.test(navigator.userAgent)}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const vs="184",lc=0,Ws=1,cc=2,Sr=1,uc=2,Di=3,Fn=0,Pt=1,_n=2,xn=0,gi=1,Xs=2,qs=3,Ys=4,dc=5,Vn=100,hc=101,fc=102,pc=103,mc=104,gc=200,_c=201,vc=202,xc=203,ba=204,Ea=205,Sc=206,Mc=207,yc=208,bc=209,Ec=210,Tc=211,Ac=212,wc=213,Rc=214,Ta=0,Aa=1,wa=2,xi=3,Ra=4,Ca=5,Pa=6,La=7,al=0,Cc=1,Pc=2,an=0,sl=1,ol=2,ll=3,cl=4,ul=5,dl=6,hl=7,fl=300,$n=301,Si=302,Hr=303,Vr=304,Fr=306,Da=1e3,vn=1001,Ia=1002,Mt=1003,Lc=1004,$i=1005,At=1006,Wr=1007,Xn=1008,zt=1009,pl=1010,ml=1011,zi=1012,xs=1013,ln=1014,nn=1015,yn=1016,Ss=1017,Ms=1018,ki=1020,gl=35902,_l=35899,vl=1021,xl=1022,Yt=1023,bn=1026,qn=1027,Sl=1028,ys=1029,Kn=1030,bs=1031,Es=1033,Mr=33776,yr=33777,br=33778,Er=33779,Ua=35840,Na=35841,Fa=35842,Oa=35843,Ba=36196,za=37492,ka=37496,Ga=37488,Ha=37489,Ar=37490,Va=37491,Wa=37808,Xa=37809,qa=37810,Ya=37811,$a=37812,Ka=37813,Za=37814,ja=37815,Ja=37816,Qa=37817,es=37818,ts=37819,ns=37820,is=37821,rs=36492,as=36494,ss=36495,os=36283,ls=36284,wr=36285,cs=36286,Dc=3200,$s=0,Ic=1,Un="",Bt="srgb",Rr="srgb-linear",Cr="linear",qe="srgb",ei=7680,Ks=519,Uc=512,Nc=513,Fc=514,Ts=515,Oc=516,Bc=517,As=518,zc=519,Zs=35044,js="300 es",rn=2e3,Pr=2001;function kc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Lr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Gc(){const n=Lr("canvas");return n.style.display="block",n}const Js={};function Qs(...n){const e="THREE."+n.shift();console.log(e,...n)}function Ml(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ae(...n){n=Ml(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function We(...n){n=Ml(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function us(...n){const e=n.join(" ");e in Js||(Js[e]=!0,Ae(...n))}function Hc(n,e,t){return new Promise(function(i,r){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const Vc={[Ta]:Aa,[wa]:Pa,[Ra]:La,[xi]:Ca,[Aa]:Ta,[Pa]:wa,[La]:Ra,[Ca]:xi};class jn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let a=0,s=r.length;a<s;a++)r[a].call(this,e);e.target=null}}}const bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let eo=1234567;const Oi=Math.PI/180,Gi=180/Math.PI;function bi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(bt[n&255]+bt[n>>8&255]+bt[n>>16&255]+bt[n>>24&255]+"-"+bt[e&255]+bt[e>>8&255]+"-"+bt[e>>16&15|64]+bt[e>>24&255]+"-"+bt[t&63|128]+bt[t>>8&255]+"-"+bt[t>>16&255]+bt[t>>24&255]+bt[i&255]+bt[i>>8&255]+bt[i>>16&255]+bt[i>>24&255]).toLowerCase()}function ze(n,e,t){return Math.max(e,Math.min(t,n))}function ws(n,e){return(n%e+e)%e}function Wc(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Xc(n,e,t){return n!==e?(t-n)/(e-n):0}function Bi(n,e,t){return(1-t)*n+t*e}function qc(n,e,t,i){return Bi(n,e,1-Math.exp(-t*i))}function Yc(n,e=1){return e-Math.abs(ws(n,e*2)-e)}function $c(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Kc(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Zc(n,e){return n+Math.floor(Math.random()*(e-n+1))}function jc(n,e){return n+Math.random()*(e-n)}function Jc(n){return n*(.5-Math.random())}function Qc(n){n!==void 0&&(eo=n);let e=eo+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function eu(n){return n*Oi}function tu(n){return n*Gi}function nu(n){return(n&n-1)===0&&n!==0}function iu(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ru(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function au(n,e,t,i,r){const a=Math.cos,s=Math.sin,o=a(t/2),l=s(t/2),c=a((e+i)/2),d=s((e+i)/2),p=a((e-i)/2),u=s((e-i)/2),m=a((i-e)/2),v=s((i-e)/2);switch(r){case"XYX":n.set(o*d,l*p,l*u,o*c);break;case"YZY":n.set(l*u,o*d,l*p,o*c);break;case"ZXZ":n.set(l*p,l*u,o*d,o*c);break;case"XZX":n.set(o*d,l*v,l*m,o*c);break;case"YXY":n.set(l*m,o*d,l*v,o*c);break;case"ZYZ":n.set(l*v,l*m,o*d,o*c);break;default:Ae("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function pi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function wt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Xr={DEG2RAD:Oi,RAD2DEG:Gi,generateUUID:bi,clamp:ze,euclideanModulo:ws,mapLinear:Wc,inverseLerp:Xc,lerp:Bi,damp:qc,pingpong:Yc,smoothstep:$c,smootherstep:Kc,randInt:Zc,randFloat:jc,randFloatSpread:Jc,seededRandom:Qc,degToRad:eu,radToDeg:tu,isPowerOfTwo:nu,ceilPowerOfTwo:iu,floorPowerOfTwo:ru,setQuaternionFromProperEuler:au,normalize:wt,denormalize:pi};class Ye{static{Ye.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),a=this.x-e.x,s=this.y-e.y;return this.x=a*i-s*r+e.x,this.y=a*r+s*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ei{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,a,s,o){let l=i[r+0],c=i[r+1],d=i[r+2],p=i[r+3],u=a[s+0],m=a[s+1],v=a[s+2],M=a[s+3];if(p!==M||l!==u||c!==m||d!==v){let f=l*u+c*m+d*v+p*M;f<0&&(u=-u,m=-m,v=-v,M=-M,f=-f);let h=1-o;if(f<.9995){const y=Math.acos(f),T=Math.sin(y);h=Math.sin(h*y)/T,o=Math.sin(o*y)/T,l=l*h+u*o,c=c*h+m*o,d=d*h+v*o,p=p*h+M*o}else{l=l*h+u*o,c=c*h+m*o,d=d*h+v*o,p=p*h+M*o;const y=1/Math.sqrt(l*l+c*c+d*d+p*p);l*=y,c*=y,d*=y,p*=y}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=p}static multiplyQuaternionsFlat(e,t,i,r,a,s){const o=i[r],l=i[r+1],c=i[r+2],d=i[r+3],p=a[s],u=a[s+1],m=a[s+2],v=a[s+3];return e[t]=o*v+d*p+l*m-c*u,e[t+1]=l*v+d*u+c*p-o*m,e[t+2]=c*v+d*m+o*u-l*p,e[t+3]=d*v-o*p-l*u-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,a=e._z,s=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(r/2),p=o(a/2),u=l(i/2),m=l(r/2),v=l(a/2);switch(s){case"XYZ":this._x=u*d*p+c*m*v,this._y=c*m*p-u*d*v,this._z=c*d*v+u*m*p,this._w=c*d*p-u*m*v;break;case"YXZ":this._x=u*d*p+c*m*v,this._y=c*m*p-u*d*v,this._z=c*d*v-u*m*p,this._w=c*d*p+u*m*v;break;case"ZXY":this._x=u*d*p-c*m*v,this._y=c*m*p+u*d*v,this._z=c*d*v+u*m*p,this._w=c*d*p-u*m*v;break;case"ZYX":this._x=u*d*p-c*m*v,this._y=c*m*p+u*d*v,this._z=c*d*v-u*m*p,this._w=c*d*p+u*m*v;break;case"YZX":this._x=u*d*p+c*m*v,this._y=c*m*p+u*d*v,this._z=c*d*v-u*m*p,this._w=c*d*p-u*m*v;break;case"XZY":this._x=u*d*p-c*m*v,this._y=c*m*p-u*d*v,this._z=c*d*v+u*m*p,this._w=c*d*p+u*m*v;break;default:Ae("Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],a=t[8],s=t[1],o=t[5],l=t[9],c=t[2],d=t[6],p=t[10],u=i+o+p;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(d-l)*m,this._y=(a-c)*m,this._z=(s-r)*m}else if(i>o&&i>p){const m=2*Math.sqrt(1+i-o-p);this._w=(d-l)/m,this._x=.25*m,this._y=(r+s)/m,this._z=(a+c)/m}else if(o>p){const m=2*Math.sqrt(1+o-i-p);this._w=(a-c)/m,this._x=(r+s)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+p-i-o);this._w=(s-r)/m,this._x=(a+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,a=e._z,s=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+s*o+r*c-a*l,this._y=r*d+s*l+a*o-i*c,this._z=a*d+s*c+i*l-r*o,this._w=s*d-i*o-r*l-a*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,a=e._z,s=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,a=-a,s=-s,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,t=Math.sin(t*c)/d,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+a*t,this._w=this._w*l+s*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+a*t,this._w=this._w*l+s*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{static{B.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(to.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(to.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*r,this.y=a[1]*t+a[4]*i+a[7]*r,this.z=a[2]*t+a[5]*i+a[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,a=e.elements,s=1/(a[3]*t+a[7]*i+a[11]*r+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*r+a[12])*s,this.y=(a[1]*t+a[5]*i+a[9]*r+a[13])*s,this.z=(a[2]*t+a[6]*i+a[10]*r+a[14])*s,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,a=e.x,s=e.y,o=e.z,l=e.w,c=2*(s*r-o*i),d=2*(o*t-a*r),p=2*(a*i-s*t);return this.x=t+l*c+s*p-o*d,this.y=i+l*d+o*c-a*p,this.z=r+l*p+a*d-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r,this.y=a[1]*t+a[5]*i+a[9]*r,this.z=a[2]*t+a[6]*i+a[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,a=e.z,s=t.x,o=t.y,l=t.z;return this.x=r*l-a*o,this.y=a*s-i*l,this.z=i*o-r*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return qr.copy(this).projectOnVector(e),this.sub(qr)}reflect(e){return this.sub(qr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qr=new B,to=new Ei;class Ce{static{Ce.prototype.isMatrix3=!0}constructor(e,t,i,r,a,s,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,a,s,o,l,c)}set(e,t,i,r,a,s,o,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=o,d[3]=t,d[4]=a,d[5]=l,d[6]=i,d[7]=s,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,a=this.elements,s=i[0],o=i[3],l=i[6],c=i[1],d=i[4],p=i[7],u=i[2],m=i[5],v=i[8],M=r[0],f=r[3],h=r[6],y=r[1],T=r[4],E=r[7],P=r[2],b=r[5],L=r[8];return a[0]=s*M+o*y+l*P,a[3]=s*f+o*T+l*b,a[6]=s*h+o*E+l*L,a[1]=c*M+d*y+p*P,a[4]=c*f+d*T+p*b,a[7]=c*h+d*E+p*L,a[2]=u*M+m*y+v*P,a[5]=u*f+m*T+v*b,a[8]=u*h+m*E+v*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*s*d-t*o*c-i*a*d+i*o*l+r*a*c-r*s*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],d=e[8],p=d*s-o*c,u=o*l-d*a,m=c*a-s*l,v=t*p+i*u+r*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/v;return e[0]=p*M,e[1]=(r*c-d*i)*M,e[2]=(o*i-r*s)*M,e[3]=u*M,e[4]=(d*t-r*l)*M,e[5]=(r*a-o*t)*M,e[6]=m*M,e[7]=(i*l-c*t)*M,e[8]=(s*t-i*a)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,a,s,o){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*s+c*o)+s+e,-r*c,r*l,-r*(-c*s+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Yr.makeScale(e,t)),this}rotate(e){return this.premultiply(Yr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Yr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Yr=new Ce,no=new Ce().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),io=new Ce().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function su(){const n={enabled:!0,workingColorSpace:Rr,spaces:{},convert:function(r,a,s){return this.enabled===!1||a===s||!a||!s||(this.spaces[a].transfer===qe&&(r.r=Sn(r.r),r.g=Sn(r.g),r.b=Sn(r.b)),this.spaces[a].primaries!==this.spaces[s].primaries&&(r.applyMatrix3(this.spaces[a].toXYZ),r.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===qe&&(r.r=_i(r.r),r.g=_i(r.g),r.b=_i(r.b))),r},workingToColorSpace:function(r,a){return this.convert(r,this.workingColorSpace,a)},colorSpaceToWorking:function(r,a){return this.convert(r,a,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Un?Cr:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,a=this.workingColorSpace){return r.fromArray(this.spaces[a].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,a,s){return r.copy(this.spaces[a].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,a){return us("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,a)},toWorkingColorSpace:function(r,a){return us("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Rr]:{primaries:e,whitePoint:i,transfer:Cr,toXYZ:no,fromXYZ:io,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Bt},outputColorSpaceConfig:{drawingBufferColorSpace:Bt}},[Bt]:{primaries:e,whitePoint:i,transfer:qe,toXYZ:no,fromXYZ:io,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Bt}}}),n}const Ge=su();function Sn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function _i(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let ti;class ou{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ti===void 0&&(ti=Lr("canvas")),ti.width=e.width,ti.height=e.height;const r=ti.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=ti}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Lr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),a=r.data;for(let s=0;s<a.length;s++)a[s]=Sn(a[s]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Sn(t[i]/255)*255):t[i]=Sn(t[i]);return{data:t,width:e.width,height:e.height}}else return Ae("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let lu=0;class Rs{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:lu++}),this.uuid=bi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let s=0,o=r.length;s<o;s++)r[s].isDataTexture?a.push($r(r[s].image)):a.push($r(r[s]))}else a=$r(r);i.url=a}return t||(e.images[this.uuid]=i),i}}function $r(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ou.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ae("Texture: Unable to serialize Texture."),{})}let cu=0;const Kr=new B;class Ct extends jn{constructor(e=Ct.DEFAULT_IMAGE,t=Ct.DEFAULT_MAPPING,i=vn,r=vn,a=At,s=Xn,o=Yt,l=zt,c=Ct.DEFAULT_ANISOTROPY,d=Un){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cu++}),this.uuid=bi(),this.name="",this.source=new Rs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=a,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ye(0,0),this.repeat=new Ye(1,1),this.center=new Ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ce,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Kr).x}get height(){return this.source.getSize(Kr).y}get depth(){return this.source.getSize(Kr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ae(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ae(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==fl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Da:e.x=e.x-Math.floor(e.x);break;case vn:e.x=e.x<0?0:1;break;case Ia:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Da:e.y=e.y-Math.floor(e.y);break;case vn:e.y=e.y<0?0:1;break;case Ia:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ct.DEFAULT_IMAGE=null;Ct.DEFAULT_MAPPING=fl;Ct.DEFAULT_ANISOTROPY=1;class ht{static{ht.prototype.isVector4=!0}constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,a=this.w,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r+s[12]*a,this.y=s[1]*t+s[5]*i+s[9]*r+s[13]*a,this.z=s[2]*t+s[6]*i+s[10]*r+s[14]*a,this.w=s[3]*t+s[7]*i+s[11]*r+s[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,a;const l=e.elements,c=l[0],d=l[4],p=l[8],u=l[1],m=l[5],v=l[9],M=l[2],f=l[6],h=l[10];if(Math.abs(d-u)<.01&&Math.abs(p-M)<.01&&Math.abs(v-f)<.01){if(Math.abs(d+u)<.1&&Math.abs(p+M)<.1&&Math.abs(v+f)<.1&&Math.abs(c+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,E=(m+1)/2,P=(h+1)/2,b=(d+u)/4,L=(p+M)/4,x=(v+f)/4;return T>E&&T>P?T<.01?(i=0,r=.707106781,a=.707106781):(i=Math.sqrt(T),r=b/i,a=L/i):E>P?E<.01?(i=.707106781,r=0,a=.707106781):(r=Math.sqrt(E),i=b/r,a=x/r):P<.01?(i=.707106781,r=.707106781,a=0):(a=Math.sqrt(P),i=L/a,r=x/a),this.set(i,r,a,t),this}let y=Math.sqrt((f-v)*(f-v)+(p-M)*(p-M)+(u-d)*(u-d));return Math.abs(y)<.001&&(y=1),this.x=(f-v)/y,this.y=(p-M)/y,this.z=(u-d)/y,this.w=Math.acos((c+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class uu extends jn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:At,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:i.depth},a=new Ct(r),s=i.count;for(let o=0;o<s;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:At,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Rs(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class sn extends uu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class yl extends Ct{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class du extends Ct{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pt{static{pt.prototype.isMatrix4=!0}constructor(e,t,i,r,a,s,o,l,c,d,p,u,m,v,M,f){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,a,s,o,l,c,d,p,u,m,v,M,f)}set(e,t,i,r,a,s,o,l,c,d,p,u,m,v,M,f){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=r,h[1]=a,h[5]=s,h[9]=o,h[13]=l,h[2]=c,h[6]=d,h[10]=p,h[14]=u,h[3]=m,h[7]=v,h[11]=M,h[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,r=1/ni.setFromMatrixColumn(e,0).length(),a=1/ni.setFromMatrixColumn(e,1).length(),s=1/ni.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*s,t[9]=i[9]*s,t[10]=i[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,a=e.z,s=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(a),p=Math.sin(a);if(e.order==="XYZ"){const u=s*d,m=s*p,v=o*d,M=o*p;t[0]=l*d,t[4]=-l*p,t[8]=c,t[1]=m+v*c,t[5]=u-M*c,t[9]=-o*l,t[2]=M-u*c,t[6]=v+m*c,t[10]=s*l}else if(e.order==="YXZ"){const u=l*d,m=l*p,v=c*d,M=c*p;t[0]=u+M*o,t[4]=v*o-m,t[8]=s*c,t[1]=s*p,t[5]=s*d,t[9]=-o,t[2]=m*o-v,t[6]=M+u*o,t[10]=s*l}else if(e.order==="ZXY"){const u=l*d,m=l*p,v=c*d,M=c*p;t[0]=u-M*o,t[4]=-s*p,t[8]=v+m*o,t[1]=m+v*o,t[5]=s*d,t[9]=M-u*o,t[2]=-s*c,t[6]=o,t[10]=s*l}else if(e.order==="ZYX"){const u=s*d,m=s*p,v=o*d,M=o*p;t[0]=l*d,t[4]=v*c-m,t[8]=u*c+M,t[1]=l*p,t[5]=M*c+u,t[9]=m*c-v,t[2]=-c,t[6]=o*l,t[10]=s*l}else if(e.order==="YZX"){const u=s*l,m=s*c,v=o*l,M=o*c;t[0]=l*d,t[4]=M-u*p,t[8]=v*p+m,t[1]=p,t[5]=s*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*p+v,t[10]=u-M*p}else if(e.order==="XZY"){const u=s*l,m=s*c,v=o*l,M=o*c;t[0]=l*d,t[4]=-p,t[8]=c*d,t[1]=u*p+M,t[5]=s*d,t[9]=m*p-v,t[2]=v*p-m,t[6]=o*d,t[10]=M*p+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hu,e,fu)}lookAt(e,t,i){const r=this.elements;return It.subVectors(e,t),It.lengthSq()===0&&(It.z=1),It.normalize(),Rn.crossVectors(i,It),Rn.lengthSq()===0&&(Math.abs(i.z)===1?It.x+=1e-4:It.z+=1e-4,It.normalize(),Rn.crossVectors(i,It)),Rn.normalize(),Ki.crossVectors(It,Rn),r[0]=Rn.x,r[4]=Ki.x,r[8]=It.x,r[1]=Rn.y,r[5]=Ki.y,r[9]=It.y,r[2]=Rn.z,r[6]=Ki.z,r[10]=It.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,a=this.elements,s=i[0],o=i[4],l=i[8],c=i[12],d=i[1],p=i[5],u=i[9],m=i[13],v=i[2],M=i[6],f=i[10],h=i[14],y=i[3],T=i[7],E=i[11],P=i[15],b=r[0],L=r[4],x=r[8],A=r[12],U=r[1],R=r[5],z=r[9],W=r[13],q=r[2],I=r[6],G=r[10],H=r[14],J=r[3],Q=r[7],ce=r[11],ve=r[15];return a[0]=s*b+o*U+l*q+c*J,a[4]=s*L+o*R+l*I+c*Q,a[8]=s*x+o*z+l*G+c*ce,a[12]=s*A+o*W+l*H+c*ve,a[1]=d*b+p*U+u*q+m*J,a[5]=d*L+p*R+u*I+m*Q,a[9]=d*x+p*z+u*G+m*ce,a[13]=d*A+p*W+u*H+m*ve,a[2]=v*b+M*U+f*q+h*J,a[6]=v*L+M*R+f*I+h*Q,a[10]=v*x+M*z+f*G+h*ce,a[14]=v*A+M*W+f*H+h*ve,a[3]=y*b+T*U+E*q+P*J,a[7]=y*L+T*R+E*I+P*Q,a[11]=y*x+T*z+E*G+P*ce,a[15]=y*A+T*W+E*H+P*ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],a=e[12],s=e[1],o=e[5],l=e[9],c=e[13],d=e[2],p=e[6],u=e[10],m=e[14],v=e[3],M=e[7],f=e[11],h=e[15],y=l*m-c*u,T=o*m-c*p,E=o*u-l*p,P=s*m-c*d,b=s*u-l*d,L=s*p-o*d;return t*(M*y-f*T+h*E)-i*(v*y-f*P+h*b)+r*(v*T-M*P+h*L)-a*(v*E-M*b+f*L)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],d=e[8],p=e[9],u=e[10],m=e[11],v=e[12],M=e[13],f=e[14],h=e[15],y=t*o-i*s,T=t*l-r*s,E=t*c-a*s,P=i*l-r*o,b=i*c-a*o,L=r*c-a*l,x=d*M-p*v,A=d*f-u*v,U=d*h-m*v,R=p*f-u*M,z=p*h-m*M,W=u*h-m*f,q=y*W-T*z+E*R+P*U-b*A+L*x;if(q===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/q;return e[0]=(o*W-l*z+c*R)*I,e[1]=(r*z-i*W-a*R)*I,e[2]=(M*L-f*b+h*P)*I,e[3]=(u*b-p*L-m*P)*I,e[4]=(l*U-s*W-c*A)*I,e[5]=(t*W-r*U+a*A)*I,e[6]=(f*E-v*L-h*T)*I,e[7]=(d*L-u*E+m*T)*I,e[8]=(s*z-o*U+c*x)*I,e[9]=(i*U-t*z-a*x)*I,e[10]=(v*b-M*E+h*y)*I,e[11]=(p*E-d*b-m*y)*I,e[12]=(o*A-s*R-l*x)*I,e[13]=(t*R-i*A+r*x)*I,e[14]=(M*T-v*P-f*y)*I,e[15]=(d*P-p*T+u*y)*I,this}scale(e){const t=this.elements,i=e.x,r=e.y,a=e.z;return t[0]*=i,t[4]*=r,t[8]*=a,t[1]*=i,t[5]*=r,t[9]*=a,t[2]*=i,t[6]*=r,t[10]*=a,t[3]*=i,t[7]*=r,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),a=1-i,s=e.x,o=e.y,l=e.z,c=a*s,d=a*o;return this.set(c*s+i,c*o-r*l,c*l+r*o,0,c*o+r*l,d*o+i,d*l-r*s,0,c*l-r*o,d*l+r*s,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,a,s){return this.set(1,i,a,0,e,1,s,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,a=t._x,s=t._y,o=t._z,l=t._w,c=a+a,d=s+s,p=o+o,u=a*c,m=a*d,v=a*p,M=s*d,f=s*p,h=o*p,y=l*c,T=l*d,E=l*p,P=i.x,b=i.y,L=i.z;return r[0]=(1-(M+h))*P,r[1]=(m+E)*P,r[2]=(v-T)*P,r[3]=0,r[4]=(m-E)*b,r[5]=(1-(u+h))*b,r[6]=(f+y)*b,r[7]=0,r[8]=(v+T)*L,r[9]=(f-y)*L,r[10]=(1-(u+M))*L,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const a=this.determinant();if(a===0)return i.set(1,1,1),t.identity(),this;let s=ni.set(r[0],r[1],r[2]).length();const o=ni.set(r[4],r[5],r[6]).length(),l=ni.set(r[8],r[9],r[10]).length();a<0&&(s=-s),kt.copy(this);const c=1/s,d=1/o,p=1/l;return kt.elements[0]*=c,kt.elements[1]*=c,kt.elements[2]*=c,kt.elements[4]*=d,kt.elements[5]*=d,kt.elements[6]*=d,kt.elements[8]*=p,kt.elements[9]*=p,kt.elements[10]*=p,t.setFromRotationMatrix(kt),i.x=s,i.y=o,i.z=l,this}makePerspective(e,t,i,r,a,s,o=rn,l=!1){const c=this.elements,d=2*a/(t-e),p=2*a/(i-r),u=(t+e)/(t-e),m=(i+r)/(i-r);let v,M;if(l)v=a/(s-a),M=s*a/(s-a);else if(o===rn)v=-(s+a)/(s-a),M=-2*s*a/(s-a);else if(o===Pr)v=-s/(s-a),M=-s*a/(s-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=p,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=v,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,a,s,o=rn,l=!1){const c=this.elements,d=2/(t-e),p=2/(i-r),u=-(t+e)/(t-e),m=-(i+r)/(i-r);let v,M;if(l)v=1/(s-a),M=s/(s-a);else if(o===rn)v=-2/(s-a),M=-(s+a)/(s-a);else if(o===Pr)v=-1/(s-a),M=-a/(s-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=p,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=v,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const ni=new B,kt=new pt,hu=new B(0,0,0),fu=new B(1,1,1),Rn=new B,Ki=new B,It=new B,ro=new pt,ao=new Ei;class Zn{constructor(e=0,t=0,i=0,r=Zn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,a=r[0],s=r[4],o=r[8],l=r[1],c=r[5],d=r[9],p=r[2],u=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-s,a)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,a),this._z=0);break;case"ZXY":this._x=Math.asin(ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-p,m),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-ze(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-p,a)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-ze(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,m),this._y=0);break;default:Ae("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ro.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ro,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ao.setFromEuler(this),this.setFromQuaternion(ao,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Zn.DEFAULT_ORDER="XYZ";class bl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let pu=0;const so=new B,ii=new Ei,dn=new pt,Zi=new B,Ai=new B,mu=new B,gu=new Ei,oo=new B(1,0,0),lo=new B(0,1,0),co=new B(0,0,1),uo={type:"added"},_u={type:"removed"},ri={type:"childadded",child:null},Zr={type:"childremoved",child:null};class Nt extends jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pu++}),this.uuid=bi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Nt.DEFAULT_UP.clone();const e=new B,t=new Zn,i=new Ei,r=new B(1,1,1);function a(){i.setFromEuler(t,!1)}function s(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new pt},normalMatrix:{value:new Ce}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=Nt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.multiply(ii),this}rotateOnWorldAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.premultiply(ii),this}rotateX(e){return this.rotateOnAxis(oo,e)}rotateY(e){return this.rotateOnAxis(lo,e)}rotateZ(e){return this.rotateOnAxis(co,e)}translateOnAxis(e,t){return so.copy(e).applyQuaternion(this.quaternion),this.position.add(so.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(oo,e)}translateY(e){return this.translateOnAxis(lo,e)}translateZ(e){return this.translateOnAxis(co,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Zi.copy(e):Zi.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Ai.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(Ai,Zi,this.up):dn.lookAt(Zi,Ai,this.up),this.quaternion.setFromRotationMatrix(dn),r&&(dn.extractRotation(r.matrixWorld),ii.setFromRotationMatrix(dn),this.quaternion.premultiply(ii.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(We("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(uo),ri.child=e,this.dispatchEvent(ri),ri.child=null):We("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_u),Zr.child=e,this.dispatchEvent(Zr),Zr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(uo),ri.child=e,this.dispatchEvent(ri),ri.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ai,e,mu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ai,gu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*i-a[8]*r,a[13]+=i-a[1]*t-a[5]*i-a[9]*r,a[14]+=r-a[2]*t-a[6]*i-a[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const p=l[c];a(e.shapes,p)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));r.material=o}else r.material=a(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(a(e.animations,l))}}if(t){const o=s(e.geometries),l=s(e.materials),c=s(e.textures),d=s(e.images),p=s(e.shapes),u=s(e.skeletons),m=s(e.animations),v=s(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),p.length>0&&(i.shapes=p),u.length>0&&(i.skeletons=u),m.length>0&&(i.animations=m),v.length>0&&(i.nodes=v)}return i.object=r,i;function s(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Nt.DEFAULT_UP=new B(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class ji extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vu={type:"move"};class jr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ji,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ji,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ji,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,a=null,s=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const M of e.hand.values()){const f=t.getJointPose(M,i),h=this._getHandJoint(c,M);f!==null&&(h.matrix.fromArray(f.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=f.radius),h.visible=f!==null}const d=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],u=d.position.distanceTo(p.position),m=.02,v=.005;c.inputState.pinching&&u>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&a!==null&&(r=a),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(vu)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ji;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const El={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Cn={h:0,s:0,l:0},Ji={h:0,s:0,l:0};function Jr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Je{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ge.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Ge.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ge.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Ge.workingColorSpace){if(e=ws(e,1),t=ze(t,0,1),i=ze(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,s=2*i-a;this.r=Jr(s,a,e+1/3),this.g=Jr(s,a,e),this.b=Jr(s,a,e-1/3)}return Ge.colorSpaceToWorking(this,r),this}setStyle(e,t=Bt){function i(a){a!==void 0&&parseFloat(a)<1&&Ae("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const s=r[1],o=r[2];switch(s){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:Ae("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=r[1],s=a.length;if(s===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(a,16),t);Ae("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){const i=El[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ae("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Sn(e.r),this.g=Sn(e.g),this.b=Sn(e.b),this}copyLinearToSRGB(e){return this.r=_i(e.r),this.g=_i(e.g),this.b=_i(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return Ge.workingToColorSpace(Et.copy(this),e),Math.round(ze(Et.r*255,0,255))*65536+Math.round(ze(Et.g*255,0,255))*256+Math.round(ze(Et.b*255,0,255))}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ge.workingColorSpace){Ge.workingToColorSpace(Et.copy(this),t);const i=Et.r,r=Et.g,a=Et.b,s=Math.max(i,r,a),o=Math.min(i,r,a);let l,c;const d=(o+s)/2;if(o===s)l=0,c=0;else{const p=s-o;switch(c=d<=.5?p/(s+o):p/(2-s-o),s){case i:l=(r-a)/p+(r<a?6:0);break;case r:l=(a-i)/p+2;break;case a:l=(i-r)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=Ge.workingColorSpace){return Ge.workingToColorSpace(Et.copy(this),t),e.r=Et.r,e.g=Et.g,e.b=Et.b,e}getStyle(e=Bt){Ge.workingToColorSpace(Et.copy(this),e);const t=Et.r,i=Et.g,r=Et.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Cn),this.setHSL(Cn.h+e,Cn.s+t,Cn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Cn),e.getHSL(Ji);const i=Bi(Cn.h,Ji.h,t),r=Bi(Cn.s,Ji.s,t),a=Bi(Cn.l,Ji.l,t);return this.setHSL(i,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*r,this.g=a[1]*t+a[4]*i+a[7]*r,this.b=a[2]*t+a[5]*i+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Et=new Je;Je.NAMES=El;class xu extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Zn,this.environmentIntensity=1,this.environmentRotation=new Zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Gt=new B,hn=new B,Qr=new B,fn=new B,ai=new B,si=new B,ho=new B,ea=new B,ta=new B,na=new B,ia=new ht,ra=new ht,aa=new ht;class qt{constructor(e=new B,t=new B,i=new B){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Gt.subVectors(e,t),r.cross(Gt);const a=r.lengthSq();return a>0?r.multiplyScalar(1/Math.sqrt(a)):r.set(0,0,0)}static getBarycoord(e,t,i,r,a){Gt.subVectors(r,t),hn.subVectors(i,t),Qr.subVectors(e,t);const s=Gt.dot(Gt),o=Gt.dot(hn),l=Gt.dot(Qr),c=hn.dot(hn),d=hn.dot(Qr),p=s*c-o*o;if(p===0)return a.set(0,0,0),null;const u=1/p,m=(c*l-o*d)*u,v=(s*d-o*l)*u;return a.set(1-m-v,v,m)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,fn)===null?!1:fn.x>=0&&fn.y>=0&&fn.x+fn.y<=1}static getInterpolation(e,t,i,r,a,s,o,l){return this.getBarycoord(e,t,i,r,fn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,fn.x),l.addScaledVector(s,fn.y),l.addScaledVector(o,fn.z),l)}static getInterpolatedAttribute(e,t,i,r,a,s){return ia.setScalar(0),ra.setScalar(0),aa.setScalar(0),ia.fromBufferAttribute(e,t),ra.fromBufferAttribute(e,i),aa.fromBufferAttribute(e,r),s.setScalar(0),s.addScaledVector(ia,a.x),s.addScaledVector(ra,a.y),s.addScaledVector(aa,a.z),s}static isFrontFacing(e,t,i,r){return Gt.subVectors(i,t),hn.subVectors(e,t),Gt.cross(hn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Gt.subVectors(this.c,this.b),hn.subVectors(this.a,this.b),Gt.cross(hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return qt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return qt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,a){return qt.getInterpolation(e,this.a,this.b,this.c,t,i,r,a)}containsPoint(e){return qt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return qt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,a=this.c;let s,o;ai.subVectors(r,i),si.subVectors(a,i),ea.subVectors(e,i);const l=ai.dot(ea),c=si.dot(ea);if(l<=0&&c<=0)return t.copy(i);ta.subVectors(e,r);const d=ai.dot(ta),p=si.dot(ta);if(d>=0&&p<=d)return t.copy(r);const u=l*p-d*c;if(u<=0&&l>=0&&d<=0)return s=l/(l-d),t.copy(i).addScaledVector(ai,s);na.subVectors(e,a);const m=ai.dot(na),v=si.dot(na);if(v>=0&&m<=v)return t.copy(a);const M=m*c-l*v;if(M<=0&&c>=0&&v<=0)return o=c/(c-v),t.copy(i).addScaledVector(si,o);const f=d*v-m*p;if(f<=0&&p-d>=0&&m-v>=0)return ho.subVectors(a,r),o=(p-d)/(p-d+(m-v)),t.copy(r).addScaledVector(ho,o);const h=1/(f+M+u);return s=M*h,o=u*h,t.copy(i).addScaledVector(ai,s).addScaledVector(si,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Hi{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ht.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ht.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Ht.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=a.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,Ht):Ht.fromBufferAttribute(a,s),Ht.applyMatrix4(e.matrixWorld),this.expandByPoint(Ht);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Qi.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Qi.copy(i.boundingBox)),Qi.applyMatrix4(e.matrixWorld),this.union(Qi)}const r=e.children;for(let a=0,s=r.length;a<s;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ht),Ht.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wi),er.subVectors(this.max,wi),oi.subVectors(e.a,wi),li.subVectors(e.b,wi),ci.subVectors(e.c,wi),Pn.subVectors(li,oi),Ln.subVectors(ci,li),Bn.subVectors(oi,ci);let t=[0,-Pn.z,Pn.y,0,-Ln.z,Ln.y,0,-Bn.z,Bn.y,Pn.z,0,-Pn.x,Ln.z,0,-Ln.x,Bn.z,0,-Bn.x,-Pn.y,Pn.x,0,-Ln.y,Ln.x,0,-Bn.y,Bn.x,0];return!sa(t,oi,li,ci,er)||(t=[1,0,0,0,1,0,0,0,1],!sa(t,oi,li,ci,er))?!1:(tr.crossVectors(Pn,Ln),t=[tr.x,tr.y,tr.z],sa(t,oi,li,ci,er))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ht).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ht).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const pn=[new B,new B,new B,new B,new B,new B,new B,new B],Ht=new B,Qi=new Hi,oi=new B,li=new B,ci=new B,Pn=new B,Ln=new B,Bn=new B,wi=new B,er=new B,tr=new B,zn=new B;function sa(n,e,t,i,r){for(let a=0,s=n.length-3;a<=s;a+=3){zn.fromArray(n,a);const o=r.x*Math.abs(zn.x)+r.y*Math.abs(zn.y)+r.z*Math.abs(zn.z),l=e.dot(zn),c=t.dot(zn),d=i.dot(zn);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const ft=new B,nr=new Ye;let Su=0;class on extends jn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Su++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Zs,this.updateRanges=[],this.gpuType=nn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)nr.fromBufferAttribute(this,t),nr.applyMatrix3(e),this.setXY(t,nr.x,nr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)ft.fromBufferAttribute(this,t),ft.applyMatrix3(e),this.setXYZ(t,ft.x,ft.y,ft.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)ft.fromBufferAttribute(this,t),ft.applyMatrix4(e),this.setXYZ(t,ft.x,ft.y,ft.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)ft.fromBufferAttribute(this,t),ft.applyNormalMatrix(e),this.setXYZ(t,ft.x,ft.y,ft.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)ft.fromBufferAttribute(this,t),ft.transformDirection(e),this.setXYZ(t,ft.x,ft.y,ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=pi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=wt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=pi(t,this.array)),t}setX(e,t){return this.normalized&&(t=wt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=pi(t,this.array)),t}setY(e,t){return this.normalized&&(t=wt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=pi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=wt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=pi(t,this.array)),t}setW(e,t){return this.normalized&&(t=wt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=wt(t,this.array),i=wt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=wt(t,this.array),i=wt(i,this.array),r=wt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,a){return e*=this.itemSize,this.normalized&&(t=wt(t,this.array),i=wt(i,this.array),r=wt(r,this.array),a=wt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Zs&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Tl extends on{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Al extends on{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Mn extends on{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Mu=new Hi,Ri=new B,oa=new B;class Cs{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Mu.setFromPoints(e).getCenter(i);let r=0;for(let a=0,s=e.length;a<s;a++)r=Math.max(r,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ri.subVectors(e,this.center);const t=Ri.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Ri,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(oa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ri.copy(e.center).add(oa)),this.expandByPoint(Ri.copy(e.center).sub(oa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let yu=0;const Ot=new pt,la=new Nt,ui=new B,Ut=new Hi,Ci=new Hi,xt=new B;class En extends jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yu++}),this.uuid=bi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kc(e)?Al:Tl)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Ce().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ot.makeRotationFromQuaternion(e),this.applyMatrix4(Ot),this}rotateX(e){return Ot.makeRotationX(e),this.applyMatrix4(Ot),this}rotateY(e){return Ot.makeRotationY(e),this.applyMatrix4(Ot),this}rotateZ(e){return Ot.makeRotationZ(e),this.applyMatrix4(Ot),this}translate(e,t,i){return Ot.makeTranslation(e,t,i),this.applyMatrix4(Ot),this}scale(e,t,i){return Ot.makeScale(e,t,i),this.applyMatrix4(Ot),this}lookAt(e){return la.lookAt(e),la.updateMatrix(),this.applyMatrix4(la.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ui).negate(),this.translate(ui.x,ui.y,ui.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,a=e.length;r<a;r++){const s=e[r];i.push(s.x,s.y,s.z||0)}this.setAttribute("position",new Mn(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const a=e[r];t.setXYZ(r,a.x,a.y,a.z||0)}e.length>t.count&&Ae("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){We("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const a=t[i];Ut.setFromBufferAttribute(a),this.morphTargetsRelative?(xt.addVectors(this.boundingBox.min,Ut.min),this.boundingBox.expandByPoint(xt),xt.addVectors(this.boundingBox.max,Ut.max),this.boundingBox.expandByPoint(xt)):(this.boundingBox.expandByPoint(Ut.min),this.boundingBox.expandByPoint(Ut.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&We('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){We("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){const i=this.boundingSphere.center;if(Ut.setFromBufferAttribute(e),t)for(let a=0,s=t.length;a<s;a++){const o=t[a];Ci.setFromBufferAttribute(o),this.morphTargetsRelative?(xt.addVectors(Ut.min,Ci.min),Ut.expandByPoint(xt),xt.addVectors(Ut.max,Ci.max),Ut.expandByPoint(xt)):(Ut.expandByPoint(Ci.min),Ut.expandByPoint(Ci.max))}Ut.getCenter(i);let r=0;for(let a=0,s=e.count;a<s;a++)xt.fromBufferAttribute(e,a),r=Math.max(r,i.distanceToSquared(xt));if(t)for(let a=0,s=t.length;a<s;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)xt.fromBufferAttribute(o,c),l&&(ui.fromBufferAttribute(e,c),xt.add(ui)),r=Math.max(r,i.distanceToSquared(xt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&We('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){We("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new on(new Float32Array(4*i.count),4));const s=this.getAttribute("tangent"),o=[],l=[];for(let x=0;x<i.count;x++)o[x]=new B,l[x]=new B;const c=new B,d=new B,p=new B,u=new Ye,m=new Ye,v=new Ye,M=new B,f=new B;function h(x,A,U){c.fromBufferAttribute(i,x),d.fromBufferAttribute(i,A),p.fromBufferAttribute(i,U),u.fromBufferAttribute(a,x),m.fromBufferAttribute(a,A),v.fromBufferAttribute(a,U),d.sub(c),p.sub(c),m.sub(u),v.sub(u);const R=1/(m.x*v.y-v.x*m.y);isFinite(R)&&(M.copy(d).multiplyScalar(v.y).addScaledVector(p,-m.y).multiplyScalar(R),f.copy(p).multiplyScalar(m.x).addScaledVector(d,-v.x).multiplyScalar(R),o[x].add(M),o[A].add(M),o[U].add(M),l[x].add(f),l[A].add(f),l[U].add(f))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let x=0,A=y.length;x<A;++x){const U=y[x],R=U.start,z=U.count;for(let W=R,q=R+z;W<q;W+=3)h(e.getX(W+0),e.getX(W+1),e.getX(W+2))}const T=new B,E=new B,P=new B,b=new B;function L(x){P.fromBufferAttribute(r,x),b.copy(P);const A=o[x];T.copy(A),T.sub(P.multiplyScalar(P.dot(A))).normalize(),E.crossVectors(b,A);const R=E.dot(l[x])<0?-1:1;s.setXYZW(x,T.x,T.y,T.z,R)}for(let x=0,A=y.length;x<A;++x){const U=y[x],R=U.start,z=U.count;for(let W=R,q=R+z;W<q;W+=3)L(e.getX(W+0)),L(e.getX(W+1)),L(e.getX(W+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new on(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,m=i.count;u<m;u++)i.setXYZ(u,0,0,0);const r=new B,a=new B,s=new B,o=new B,l=new B,c=new B,d=new B,p=new B;if(e)for(let u=0,m=e.count;u<m;u+=3){const v=e.getX(u+0),M=e.getX(u+1),f=e.getX(u+2);r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,M),s.fromBufferAttribute(t,f),d.subVectors(s,a),p.subVectors(r,a),d.cross(p),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,M),c.fromBufferAttribute(i,f),o.add(d),l.add(d),c.add(d),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(M,l.x,l.y,l.z),i.setXYZ(f,c.x,c.y,c.z)}else for(let u=0,m=t.count;u<m;u+=3)r.fromBufferAttribute(t,u+0),a.fromBufferAttribute(t,u+1),s.fromBufferAttribute(t,u+2),d.subVectors(s,a),p.subVectors(r,a),d.cross(p),i.setXYZ(u+0,d.x,d.y,d.z),i.setXYZ(u+1,d.x,d.y,d.z),i.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)xt.fromBufferAttribute(e,t),xt.normalize(),e.setXYZ(t,xt.x,xt.y,xt.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,p=o.normalized,u=new c.constructor(l.length*d);let m=0,v=0;for(let M=0,f=l.length;M<f;M++){o.isInterleavedBufferAttribute?m=l[M]*o.data.stride+o.offset:m=l[M]*d;for(let h=0;h<d;h++)u[v++]=c[m++]}return new on(u,d,p)}if(this.index===null)return Ae("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new En,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let d=0,p=c.length;d<p;d++){const u=c[d],m=e(u,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,l=s.length;o<l;o++){const c=s[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let p=0,u=c.length;p<u;p++){const m=c[p];d.push(m.toJSON(e.data))}d.length>0&&(r[l]=d,a=!0)}a&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(t))}const a=e.morphAttributes;for(const c in a){const d=[],p=a[c];for(let u=0,m=p.length;u<m;u++)d.push(p[u].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,d=s.length;c<d;c++){const p=s[c];this.addGroup(p.start,p.count,p.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let bu=0;class Or extends jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bu++}),this.uuid=bi(),this.name="",this.type="Material",this.blending=gi,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ba,this.blendDst=Ea,this.blendEquation=Vn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Je(0,0,0),this.blendAlpha=0,this.depthFunc=xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ks,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ei,this.stencilZFail=ei,this.stencilZPass=ei,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ae(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ae(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==gi&&(i.blending=this.blending),this.side!==Fn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ba&&(i.blendSrc=this.blendSrc),this.blendDst!==Ea&&(i.blendDst=this.blendDst),this.blendEquation!==Vn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==xi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ks&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ei&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ei&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ei&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(a){const s=[];for(const o in a){const l=a[o];delete l.metadata,s.push(l)}return s}if(t){const a=r(e.textures),s=r(e.images);a.length>0&&(i.textures=a),s.length>0&&(i.images=s)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let a=0;a!==r;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const mn=new B,ca=new B,ir=new B,Dn=new B,ua=new B,rr=new B,da=new B;class Eu{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=mn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mn.copy(this.origin).addScaledVector(this.direction,t),mn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){ca.copy(e).add(t).multiplyScalar(.5),ir.copy(t).sub(e).normalize(),Dn.copy(this.origin).sub(ca);const a=e.distanceTo(t)*.5,s=-this.direction.dot(ir),o=Dn.dot(this.direction),l=-Dn.dot(ir),c=Dn.lengthSq(),d=Math.abs(1-s*s);let p,u,m,v;if(d>0)if(p=s*l-o,u=s*o-l,v=a*d,p>=0)if(u>=-v)if(u<=v){const M=1/d;p*=M,u*=M,m=p*(p+s*u+2*o)+u*(s*p+u+2*l)+c}else u=a,p=Math.max(0,-(s*u+o)),m=-p*p+u*(u+2*l)+c;else u=-a,p=Math.max(0,-(s*u+o)),m=-p*p+u*(u+2*l)+c;else u<=-v?(p=Math.max(0,-(-s*a+o)),u=p>0?-a:Math.min(Math.max(-a,-l),a),m=-p*p+u*(u+2*l)+c):u<=v?(p=0,u=Math.min(Math.max(-a,-l),a),m=u*(u+2*l)+c):(p=Math.max(0,-(s*a+o)),u=p>0?a:Math.min(Math.max(-a,-l),a),m=-p*p+u*(u+2*l)+c);else u=s>0?-a:a,p=Math.max(0,-(s*u+o)),m=-p*p+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(ca).addScaledVector(ir,u),m}intersectSphere(e,t){mn.subVectors(e.center,this.origin);const i=mn.dot(this.direction),r=mn.dot(mn)-i*i,a=e.radius*e.radius;if(r>a)return null;const s=Math.sqrt(a-r),o=i-s,l=i+s;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,a,s,o,l;const c=1/this.direction.x,d=1/this.direction.y,p=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,r=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,r=(e.min.x-u.x)*c),d>=0?(a=(e.min.y-u.y)*d,s=(e.max.y-u.y)*d):(a=(e.max.y-u.y)*d,s=(e.min.y-u.y)*d),i>s||a>r||((a>i||isNaN(i))&&(i=a),(s<r||isNaN(r))&&(r=s),p>=0?(o=(e.min.z-u.z)*p,l=(e.max.z-u.z)*p):(o=(e.max.z-u.z)*p,l=(e.min.z-u.z)*p),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,mn)!==null}intersectTriangle(e,t,i,r,a){ua.subVectors(t,e),rr.subVectors(i,e),da.crossVectors(ua,rr);let s=this.direction.dot(da),o;if(s>0){if(r)return null;o=1}else if(s<0)o=-1,s=-s;else return null;Dn.subVectors(this.origin,e);const l=o*this.direction.dot(rr.crossVectors(Dn,rr));if(l<0)return null;const c=o*this.direction.dot(ua.cross(Dn));if(c<0||l+c>s)return null;const d=-o*Dn.dot(da);return d<0?null:this.at(d/s,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class wl extends Or{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zn,this.combine=al,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const fo=new pt,kn=new Eu,ar=new Cs,po=new B,sr=new B,or=new B,lr=new B,ha=new B,cr=new B,mo=new B,ur=new B;class cn extends Nt{constructor(e=new En,t=new wl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,a=i.morphAttributes.position,s=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(a&&o){cr.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const d=o[l],p=a[l];d!==0&&(ha.fromBufferAttribute(p,e),s?cr.addScaledVector(ha,d):cr.addScaledVector(ha.sub(t),d))}t.add(cr)}return t}raycast(e,t){const i=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ar.copy(i.boundingSphere),ar.applyMatrix4(a),kn.copy(e.ray).recast(e.near),!(ar.containsPoint(kn.origin)===!1&&(kn.intersectSphere(ar,po)===null||kn.origin.distanceToSquared(po)>(e.far-e.near)**2))&&(fo.copy(a).invert(),kn.copy(e.ray).applyMatrix4(fo),!(i.boundingBox!==null&&kn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,kn)))}_computeIntersections(e,t,i){let r;const a=this.geometry,s=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,d=a.attributes.uv1,p=a.attributes.normal,u=a.groups,m=a.drawRange;if(o!==null)if(Array.isArray(s))for(let v=0,M=u.length;v<M;v++){const f=u[v],h=s[f.materialIndex],y=Math.max(f.start,m.start),T=Math.min(o.count,Math.min(f.start+f.count,m.start+m.count));for(let E=y,P=T;E<P;E+=3){const b=o.getX(E),L=o.getX(E+1),x=o.getX(E+2);r=dr(this,h,e,i,c,d,p,b,L,x),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=f.materialIndex,t.push(r))}}else{const v=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let f=v,h=M;f<h;f+=3){const y=o.getX(f),T=o.getX(f+1),E=o.getX(f+2);r=dr(this,s,e,i,c,d,p,y,T,E),r&&(r.faceIndex=Math.floor(f/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(s))for(let v=0,M=u.length;v<M;v++){const f=u[v],h=s[f.materialIndex],y=Math.max(f.start,m.start),T=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let E=y,P=T;E<P;E+=3){const b=E,L=E+1,x=E+2;r=dr(this,h,e,i,c,d,p,b,L,x),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=f.materialIndex,t.push(r))}}else{const v=Math.max(0,m.start),M=Math.min(l.count,m.start+m.count);for(let f=v,h=M;f<h;f+=3){const y=f,T=f+1,E=f+2;r=dr(this,s,e,i,c,d,p,y,T,E),r&&(r.faceIndex=Math.floor(f/3),t.push(r))}}}}function Tu(n,e,t,i,r,a,s,o){let l;if(e.side===Pt?l=i.intersectTriangle(s,a,r,!0,o):l=i.intersectTriangle(r,a,s,e.side===Fn,o),l===null)return null;ur.copy(o),ur.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(ur);return c<t.near||c>t.far?null:{distance:c,point:ur.clone(),object:n}}function dr(n,e,t,i,r,a,s,o,l,c){n.getVertexPosition(o,sr),n.getVertexPosition(l,or),n.getVertexPosition(c,lr);const d=Tu(n,e,t,i,sr,or,lr,mo);if(d){const p=new B;qt.getBarycoord(mo,sr,or,lr,p),r&&(d.uv=qt.getInterpolatedAttribute(r,o,l,c,p,new Ye)),a&&(d.uv1=qt.getInterpolatedAttribute(a,o,l,c,p,new Ye)),s&&(d.normal=qt.getInterpolatedAttribute(s,o,l,c,p,new B),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new B,materialIndex:0};qt.getNormal(sr,or,lr,u.normal),d.face=u,d.barycoord=p}return d}class Au extends Ct{constructor(e=null,t=1,i=1,r,a,s,o,l,c=Mt,d=Mt,p,u){super(null,s,o,l,c,d,r,a,p,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const fa=new B,wu=new B,Ru=new Ce;class Hn{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=fa.subVectors(i,t).cross(wu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const r=e.delta(fa),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/a;return i===!0&&(s<0||s>1)?null:t.copy(e.start).addScaledVector(r,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Ru.getNormalMatrix(e),r=this.coplanarPoint(fa).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gn=new Cs,Cu=new Ye(.5,.5),hr=new B;class Rl{constructor(e=new Hn,t=new Hn,i=new Hn,r=new Hn,a=new Hn,s=new Hn){this.planes=[e,t,i,r,a,s]}set(e,t,i,r,a,s){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(a),o[5].copy(s),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=rn,i=!1){const r=this.planes,a=e.elements,s=a[0],o=a[1],l=a[2],c=a[3],d=a[4],p=a[5],u=a[6],m=a[7],v=a[8],M=a[9],f=a[10],h=a[11],y=a[12],T=a[13],E=a[14],P=a[15];if(r[0].setComponents(c-s,m-d,h-v,P-y).normalize(),r[1].setComponents(c+s,m+d,h+v,P+y).normalize(),r[2].setComponents(c+o,m+p,h+M,P+T).normalize(),r[3].setComponents(c-o,m-p,h-M,P-T).normalize(),i)r[4].setComponents(l,u,f,E).normalize(),r[5].setComponents(c-l,m-u,h-f,P-E).normalize();else if(r[4].setComponents(c-l,m-u,h-f,P-E).normalize(),t===rn)r[5].setComponents(c+l,m+u,h+f,P+E).normalize();else if(t===Pr)r[5].setComponents(l,u,f,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Gn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Gn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Gn)}intersectsSprite(e){Gn.center.set(0,0,0);const t=Cu.distanceTo(e.center);return Gn.radius=.7071067811865476+t,Gn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gn)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(hr.x=r.normal.x>0?e.max.x:e.min.x,hr.y=r.normal.y>0?e.max.y:e.min.y,hr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(hr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Cl extends Ct{constructor(e=[],t=$n,i,r,a,s,o,l,c,d){super(e,t,i,r,a,s,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Mi extends Ct{constructor(e,t,i=ln,r,a,s,o=Mt,l=Mt,c,d=bn,p=1){if(d!==bn&&d!==qn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:p};super(u,r,a,s,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Rs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Pu extends Mi{constructor(e,t=ln,i=$n,r,a,s=Mt,o=Mt,l,c=bn){const d={width:e,height:e,depth:1},p=[d,d,d,d,d,d];super(e,e,t,i,r,a,s,o,l,c),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Pl extends Ct{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Vi extends En{constructor(e=1,t=1,i=1,r=1,a=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:a,depthSegments:s};const o=this;r=Math.floor(r),a=Math.floor(a),s=Math.floor(s);const l=[],c=[],d=[],p=[];let u=0,m=0;v("z","y","x",-1,-1,i,t,e,s,a,0),v("z","y","x",1,-1,i,t,-e,s,a,1),v("x","z","y",1,1,e,i,t,r,s,2),v("x","z","y",1,-1,e,i,-t,r,s,3),v("x","y","z",1,-1,e,t,i,r,a,4),v("x","y","z",-1,-1,e,t,-i,r,a,5),this.setIndex(l),this.setAttribute("position",new Mn(c,3)),this.setAttribute("normal",new Mn(d,3)),this.setAttribute("uv",new Mn(p,2));function v(M,f,h,y,T,E,P,b,L,x,A){const U=E/L,R=P/x,z=E/2,W=P/2,q=b/2,I=L+1,G=x+1;let H=0,J=0;const Q=new B;for(let ce=0;ce<G;ce++){const ve=ce*R-W;for(let ye=0;ye<I;ye++){const He=ye*U-z;Q[M]=He*y,Q[f]=ve*T,Q[h]=q,c.push(Q.x,Q.y,Q.z),Q[M]=0,Q[f]=0,Q[h]=b>0?1:-1,d.push(Q.x,Q.y,Q.z),p.push(ye/L),p.push(1-ce/x),H+=1}}for(let ce=0;ce<x;ce++)for(let ve=0;ve<L;ve++){const ye=u+ve+I*ce,He=u+ve+I*(ce+1),$e=u+(ve+1)+I*(ce+1),De=u+(ve+1)+I*ce;l.push(ye,He,De),l.push(He,$e,De),J+=6}o.addGroup(m,J,A),m+=J,u+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Wi extends En{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const a=e/2,s=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,d=l+1,p=e/o,u=t/l,m=[],v=[],M=[],f=[];for(let h=0;h<d;h++){const y=h*u-s;for(let T=0;T<c;T++){const E=T*p-a;v.push(E,-y,0),M.push(0,0,1),f.push(T/o),f.push(1-h/l)}}for(let h=0;h<l;h++)for(let y=0;y<o;y++){const T=y+c*h,E=y+c*(h+1),P=y+1+c*(h+1),b=y+1+c*h;m.push(T,E,b),m.push(E,P,b)}this.setIndex(m),this.setAttribute("position",new Mn(v,3)),this.setAttribute("normal",new Mn(M,3)),this.setAttribute("uv",new Mn(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wi(e.width,e.height,e.widthSegments,e.heightSegments)}}function yi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];if(go(r))r.isRenderTargetTexture?(Ae("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(go(r[0])){const a=[];for(let s=0,o=r.length;s<o;s++)a[s]=r[s].clone();e[t][i]=a}else e[t][i]=r.slice();else e[t][i]=r}}return e}function Rt(n){const e={};for(let t=0;t<n.length;t++){const i=yi(n[t]);for(const r in i)e[r]=i[r]}return e}function go(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Lu(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Ll(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ge.workingColorSpace}const Du={clone:yi,merge:Rt};var Iu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Uu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class $t extends Or{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Iu,this.fragmentShader=Uu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=yi(e.uniforms),this.uniformsGroups=Lu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Nu extends $t{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Fu extends Or{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Dc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ou extends Or{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const fr=new B,pr=new Ei,jt=new B;class Dl extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(fr,pr,jt),jt.x===1&&jt.y===1&&jt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fr,pr,jt.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(fr,pr,jt),jt.x===1&&jt.y===1&&jt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fr,pr,jt.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const In=new B,_o=new Ye,vo=new Ye;class Xt extends Dl{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Gi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Oi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Gi*2*Math.atan(Math.tan(Oi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){In.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(In.x,In.y).multiplyScalar(-e/In.z),In.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(In.x,In.y).multiplyScalar(-e/In.z)}getViewSize(e,t){return this.getViewBounds(e,_o,vo),t.subVectors(vo,_o)}setViewOffset(e,t,i,r,a,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Oi*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,a=-.5*r;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;a+=s.offsetX*r/l,t-=s.offsetY*i/c,r*=s.width/l,i*=s.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Ps extends Dl{constructor(e=-1,t=1,i=1,r=-1,a=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=a,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,a,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let a=i-e,s=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,s=a+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,s,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const di=-90,hi=1;class Bu extends Nt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Xt(di,hi,e,t);r.layers=this.layers,this.add(r);const a=new Xt(di,hi,e,t);a.layers=this.layers,this.add(a);const s=new Xt(di,hi,e,t);s.layers=this.layers,this.add(s);const o=new Xt(di,hi,e,t);o.layers=this.layers,this.add(o);const l=new Xt(di,hi,e,t);l.layers=this.layers,this.add(l);const c=new Xt(di,hi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,a,s,o,l]=t;for(const c of t)this.remove(c);if(e===rn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Pr)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,s,o,l,c,d]=this.children,p=e.getRenderTarget(),u=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let f=!1;e.isWebGLRenderer===!0?f=e.state.buffers.depth.getReversed():f=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,2,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,r),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(p,u,m),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class zu extends Xt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Il{static{Il.prototype.isMatrix2=!0}constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){const a=this.elements;return a[0]=e,a[2]=t,a[1]=i,a[3]=r,this}}function xo(n,e,t,i){const r=ku(i);switch(t){case vl:return n*e;case Sl:return n*e/r.components*r.byteLength;case ys:return n*e/r.components*r.byteLength;case Kn:return n*e*2/r.components*r.byteLength;case bs:return n*e*2/r.components*r.byteLength;case xl:return n*e*3/r.components*r.byteLength;case Yt:return n*e*4/r.components*r.byteLength;case Es:return n*e*4/r.components*r.byteLength;case Mr:case yr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case br:case Er:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Na:case Oa:return Math.max(n,16)*Math.max(e,8)/4;case Ua:case Fa:return Math.max(n,8)*Math.max(e,8)/2;case Ba:case za:case Ga:case Ha:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ka:case Ar:case Va:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case qa:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case $a:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Za:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case ja:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ja:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Qa:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case es:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ts:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ns:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case is:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case rs:case as:case ss:return Math.ceil(n/4)*Math.ceil(e/4)*16;case os:case ls:return Math.ceil(n/4)*Math.ceil(e/4)*8;case wr:case cs:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ku(n){switch(n){case zt:case pl:return{byteLength:1,components:1};case zi:case ml:case yn:return{byteLength:2,components:1};case Ss:case Ms:return{byteLength:2,components:4};case ln:case xs:case nn:return{byteLength:4,components:1};case gl:case _l:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vs}}));typeof window<"u"&&(window.__THREE__?Ae("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vs);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Ul(){let n=null,e=!1,t=null,i=null;function r(a,s){t(a,s),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function Gu(n){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,p=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,l,c){const d=l.array,p=l.updateRanges;if(n.bindBuffer(c,o),p.length===0)n.bufferSubData(c,0,d);else{p.sort((m,v)=>m.start-v.start);let u=0;for(let m=1;m<p.length;m++){const v=p[u],M=p[m];M.start<=v.start+v.count+1?v.count=Math.max(v.count,M.start+M.count-v.start):(++u,p[u]=M)}p.length=u+1;for(let m=0,v=p.length;m<v;m++){const M=p[m];n.bufferSubData(c,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:a,update:s}}var Hu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Vu=`#ifdef USE_ALPHAHASH
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
#endif`,Wu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$u=`#ifdef USE_AOMAP
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
#endif`,Ku=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Zu=`#ifdef USE_BATCHING
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
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ju=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ju=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Qu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ed=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,td=`#ifdef USE_IRIDESCENCE
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
#endif`,nd=`#ifdef USE_BUMPMAP
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
#endif`,id=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,rd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,od=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ld=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,cd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ud=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,dd=`#define PI 3.141592653589793
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
} // validated`,hd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,fd=`vec3 transformedNormal = objectNormal;
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
#endif`,pd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,md=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_d=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vd="gl_FragColor = linearToOutputTexel( gl_FragColor );",xd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Sd=`#ifdef USE_ENVMAP
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
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Md=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,yd=`#ifdef USE_ENVMAP
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
#endif`,bd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ed=`#ifdef USE_ENVMAP
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
#endif`,Td=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ad=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cd=`#ifdef USE_GRADIENTMAP
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
}`,Pd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ld=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Id=`uniform bool receiveShadow;
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
#endif
#include <lightprobes_pars_fragment>`,Ud=`#ifdef USE_ENVMAP
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
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
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
#endif`,Nd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Od=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,kd=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
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
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
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
		return 0.5 / max( gv + gl, EPSILON );
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
	vec3 f0 = material.specularColorBlended;
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
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
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Gd=`
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
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Hd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
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
#endif`,Vd=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wd=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Xd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$d=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Kd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Jd=`#if defined( USE_POINTS_UV )
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
#endif`,Qd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,eh=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,th=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nh=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ih=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rh=`#ifdef USE_MORPHTARGETS
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
#endif`,ah=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sh=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,oh=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ch=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uh=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dh=`#ifdef USE_NORMALMAP
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
#endif`,hh=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fh=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ph=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mh=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gh=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_h=`vec3 packNormalToRGB( const in vec3 normal ) {
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,vh=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xh=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sh=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mh=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yh=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bh=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Eh=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
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
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Th=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ah=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
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
#endif`,wh=`float getShadowMask() {
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
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
}`,Rh=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ch=`#ifdef USE_SKINNING
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
#endif`,Ph=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lh=`#ifdef USE_SKINNING
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
#endif`,Dh=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ih=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Uh=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Nh=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fh=`#ifdef USE_TRANSMISSION
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
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Oh=`#ifdef USE_TRANSMISSION
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
#endif`,Bh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,zh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gh=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Hh=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vh=`uniform sampler2D t2D;
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
}`,Wh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xh=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yh=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$h=`#include <common>
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
}`,Kh=`#if DEPTH_PACKING == 3200
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
}`,Zh=`#define DISTANCE
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
}`,jh=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
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
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Jh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qh=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ef=`uniform float scale;
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
}`,tf=`uniform vec3 diffuse;
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
}`,nf=`#include <common>
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
}`,rf=`uniform vec3 diffuse;
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
}`,af=`#define LAMBERT
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
}`,sf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,of=`#define MATCAP
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
}`,lf=`#define MATCAP
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
}`,cf=`#define NORMAL
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
}`,uf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
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
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,df=`#define PHONG
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
}`,hf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,ff=`#define STANDARD
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
}`,pf=`#define STANDARD
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,mf=`#define TOON
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
}`,gf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,_f=`uniform float size;
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
}`,vf=`uniform vec3 diffuse;
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
}`,xf=`#include <common>
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
}`,Sf=`uniform vec3 color;
uniform float opacity;
#include <common>
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
	#include <premultiplied_alpha_fragment>
}`,Mf=`uniform float rotation;
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
}`,yf=`uniform vec3 diffuse;
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
}`,Ue={alphahash_fragment:Hu,alphahash_pars_fragment:Vu,alphamap_fragment:Wu,alphamap_pars_fragment:Xu,alphatest_fragment:qu,alphatest_pars_fragment:Yu,aomap_fragment:$u,aomap_pars_fragment:Ku,batching_pars_vertex:Zu,batching_vertex:ju,begin_vertex:Ju,beginnormal_vertex:Qu,bsdfs:ed,iridescence_fragment:td,bumpmap_pars_fragment:nd,clipping_planes_fragment:id,clipping_planes_pars_fragment:rd,clipping_planes_pars_vertex:ad,clipping_planes_vertex:sd,color_fragment:od,color_pars_fragment:ld,color_pars_vertex:cd,color_vertex:ud,common:dd,cube_uv_reflection_fragment:hd,defaultnormal_vertex:fd,displacementmap_pars_vertex:pd,displacementmap_vertex:md,emissivemap_fragment:gd,emissivemap_pars_fragment:_d,colorspace_fragment:vd,colorspace_pars_fragment:xd,envmap_fragment:Sd,envmap_common_pars_fragment:Md,envmap_pars_fragment:yd,envmap_pars_vertex:bd,envmap_physical_pars_fragment:Ud,envmap_vertex:Ed,fog_vertex:Td,fog_pars_vertex:Ad,fog_fragment:wd,fog_pars_fragment:Rd,gradientmap_pars_fragment:Cd,lightmap_pars_fragment:Pd,lights_lambert_fragment:Ld,lights_lambert_pars_fragment:Dd,lights_pars_begin:Id,lights_toon_fragment:Nd,lights_toon_pars_fragment:Fd,lights_phong_fragment:Od,lights_phong_pars_fragment:Bd,lights_physical_fragment:zd,lights_physical_pars_fragment:kd,lights_fragment_begin:Gd,lights_fragment_maps:Hd,lights_fragment_end:Vd,lightprobes_pars_fragment:Wd,logdepthbuf_fragment:Xd,logdepthbuf_pars_fragment:qd,logdepthbuf_pars_vertex:Yd,logdepthbuf_vertex:$d,map_fragment:Kd,map_pars_fragment:Zd,map_particle_fragment:jd,map_particle_pars_fragment:Jd,metalnessmap_fragment:Qd,metalnessmap_pars_fragment:eh,morphinstance_vertex:th,morphcolor_vertex:nh,morphnormal_vertex:ih,morphtarget_pars_vertex:rh,morphtarget_vertex:ah,normal_fragment_begin:sh,normal_fragment_maps:oh,normal_pars_fragment:lh,normal_pars_vertex:ch,normal_vertex:uh,normalmap_pars_fragment:dh,clearcoat_normal_fragment_begin:hh,clearcoat_normal_fragment_maps:fh,clearcoat_pars_fragment:ph,iridescence_pars_fragment:mh,opaque_fragment:gh,packing:_h,premultiplied_alpha_fragment:vh,project_vertex:xh,dithering_fragment:Sh,dithering_pars_fragment:Mh,roughnessmap_fragment:yh,roughnessmap_pars_fragment:bh,shadowmap_pars_fragment:Eh,shadowmap_pars_vertex:Th,shadowmap_vertex:Ah,shadowmask_pars_fragment:wh,skinbase_vertex:Rh,skinning_pars_vertex:Ch,skinning_vertex:Ph,skinnormal_vertex:Lh,specularmap_fragment:Dh,specularmap_pars_fragment:Ih,tonemapping_fragment:Uh,tonemapping_pars_fragment:Nh,transmission_fragment:Fh,transmission_pars_fragment:Oh,uv_pars_fragment:Bh,uv_pars_vertex:zh,uv_vertex:kh,worldpos_vertex:Gh,background_vert:Hh,background_frag:Vh,backgroundCube_vert:Wh,backgroundCube_frag:Xh,cube_vert:qh,cube_frag:Yh,depth_vert:$h,depth_frag:Kh,distance_vert:Zh,distance_frag:jh,equirect_vert:Jh,equirect_frag:Qh,linedashed_vert:ef,linedashed_frag:tf,meshbasic_vert:nf,meshbasic_frag:rf,meshlambert_vert:af,meshlambert_frag:sf,meshmatcap_vert:of,meshmatcap_frag:lf,meshnormal_vert:cf,meshnormal_frag:uf,meshphong_vert:df,meshphong_frag:hf,meshphysical_vert:ff,meshphysical_frag:pf,meshtoon_vert:mf,meshtoon_frag:gf,points_vert:_f,points_frag:vf,shadow_vert:xf,shadow_frag:Sf,sprite_vert:Mf,sprite_frag:yf},le={common:{diffuse:{value:new Je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ce},alphaMap:{value:null},alphaMapTransform:{value:new Ce},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ce}},envmap:{envMap:{value:null},envMapRotation:{value:new Ce},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ce}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ce}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ce},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ce},normalScale:{value:new Ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ce},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ce}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ce}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ce}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new B},probesMax:{value:new B},probesResolution:{value:new B}},points:{diffuse:{value:new Je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ce},alphaTest:{value:0},uvTransform:{value:new Ce}},sprite:{diffuse:{value:new Je(16777215)},opacity:{value:1},center:{value:new Ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ce},alphaMap:{value:null},alphaMapTransform:{value:new Ce},alphaTest:{value:0}}},tn={basic:{uniforms:Rt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:Rt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Je(0)},envMapIntensity:{value:1}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:Rt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Je(0)},specular:{value:new Je(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:Rt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:Rt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Je(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:Rt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:Rt([le.points,le.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:Rt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:Rt([le.common,le.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:Rt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:Rt([le.sprite,le.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new Ce},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ce}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distance:{uniforms:Rt([le.common,le.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distance_vert,fragmentShader:Ue.distance_frag},shadow:{uniforms:Rt([le.lights,le.fog,{color:{value:new Je(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};tn.physical={uniforms:Rt([tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ce},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ce},clearcoatNormalScale:{value:new Ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ce},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ce},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ce},sheen:{value:0},sheenColor:{value:new Je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ce},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ce},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ce},transmissionSamplerSize:{value:new Ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ce},attenuationDistance:{value:0},attenuationColor:{value:new Je(0)},specularColor:{value:new Je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ce},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ce},anisotropyVector:{value:new Ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ce}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const mr={r:0,b:0,g:0},bf=new pt,Nl=new Ce;Nl.set(-1,0,0,0,1,0,0,0,1);function Ef(n,e,t,i,r,a){const s=new Je(0);let o=r===!0?0:1,l,c,d=null,p=0,u=null;function m(y){let T=y.isScene===!0?y.background:null;if(T&&T.isTexture){const E=y.backgroundBlurriness>0;T=e.get(T,E)}return T}function v(y){let T=!1;const E=m(y);E===null?f(s,o):E&&E.isColor&&(f(E,1),T=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?t.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(n.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function M(y,T){const E=m(T);E&&(E.isCubeTexture||E.mapping===Fr)?(c===void 0&&(c=new cn(new Vi(1,1,1),new $t({name:"BackgroundCubeMaterial",uniforms:yi(tn.backgroundCube.uniforms),vertexShader:tn.backgroundCube.vertexShader,fragmentShader:tn.backgroundCube.fragmentShader,side:Pt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(P,b,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=E,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(bf.makeRotationFromEuler(T.backgroundRotation)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Nl),c.material.toneMapped=Ge.getTransfer(E.colorSpace)!==qe,(d!==E||p!==E.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,d=E,p=E.version,u=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new cn(new Wi(2,2),new $t({name:"BackgroundMaterial",uniforms:yi(tn.background.uniforms),vertexShader:tn.background.vertexShader,fragmentShader:tn.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Ge.getTransfer(E.colorSpace)!==qe,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(d!==E||p!==E.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,d=E,p=E.version,u=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function f(y,T){y.getRGB(mr,Ll(n)),t.buffers.color.setClear(mr.r,mr.g,mr.b,T,a)}function h(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(y,T=1){s.set(y),o=T,f(s,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,f(s,o)},render:v,addToRenderList:M,dispose:h}}function Tf(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=u(null);let a=r,s=!1;function o(R,z,W,q,I){let G=!1;const H=p(R,q,W,z);a!==H&&(a=H,c(a.object)),G=m(R,q,W,I),G&&v(R,q,W,I),I!==null&&e.update(I,n.ELEMENT_ARRAY_BUFFER),(G||s)&&(s=!1,E(R,z,W,q),I!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function l(){return n.createVertexArray()}function c(R){return n.bindVertexArray(R)}function d(R){return n.deleteVertexArray(R)}function p(R,z,W,q){const I=q.wireframe===!0;let G=i[z.id];G===void 0&&(G={},i[z.id]=G);const H=R.isInstancedMesh===!0?R.id:0;let J=G[H];J===void 0&&(J={},G[H]=J);let Q=J[W.id];Q===void 0&&(Q={},J[W.id]=Q);let ce=Q[I];return ce===void 0&&(ce=u(l()),Q[I]=ce),ce}function u(R){const z=[],W=[],q=[];for(let I=0;I<t;I++)z[I]=0,W[I]=0,q[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:W,attributeDivisors:q,object:R,attributes:{},index:null}}function m(R,z,W,q){const I=a.attributes,G=z.attributes;let H=0;const J=W.getAttributes();for(const Q in J)if(J[Q].location>=0){const ve=I[Q];let ye=G[Q];if(ye===void 0&&(Q==="instanceMatrix"&&R.instanceMatrix&&(ye=R.instanceMatrix),Q==="instanceColor"&&R.instanceColor&&(ye=R.instanceColor)),ve===void 0||ve.attribute!==ye||ye&&ve.data!==ye.data)return!0;H++}return a.attributesNum!==H||a.index!==q}function v(R,z,W,q){const I={},G=z.attributes;let H=0;const J=W.getAttributes();for(const Q in J)if(J[Q].location>=0){let ve=G[Q];ve===void 0&&(Q==="instanceMatrix"&&R.instanceMatrix&&(ve=R.instanceMatrix),Q==="instanceColor"&&R.instanceColor&&(ve=R.instanceColor));const ye={};ye.attribute=ve,ve&&ve.data&&(ye.data=ve.data),I[Q]=ye,H++}a.attributes=I,a.attributesNum=H,a.index=q}function M(){const R=a.newAttributes;for(let z=0,W=R.length;z<W;z++)R[z]=0}function f(R){h(R,0)}function h(R,z){const W=a.newAttributes,q=a.enabledAttributes,I=a.attributeDivisors;W[R]=1,q[R]===0&&(n.enableVertexAttribArray(R),q[R]=1),I[R]!==z&&(n.vertexAttribDivisor(R,z),I[R]=z)}function y(){const R=a.newAttributes,z=a.enabledAttributes;for(let W=0,q=z.length;W<q;W++)z[W]!==R[W]&&(n.disableVertexAttribArray(W),z[W]=0)}function T(R,z,W,q,I,G,H){H===!0?n.vertexAttribIPointer(R,z,W,I,G):n.vertexAttribPointer(R,z,W,q,I,G)}function E(R,z,W,q){M();const I=q.attributes,G=W.getAttributes(),H=z.defaultAttributeValues;for(const J in G){const Q=G[J];if(Q.location>=0){let ce=I[J];if(ce===void 0&&(J==="instanceMatrix"&&R.instanceMatrix&&(ce=R.instanceMatrix),J==="instanceColor"&&R.instanceColor&&(ce=R.instanceColor)),ce!==void 0){const ve=ce.normalized,ye=ce.itemSize,He=e.get(ce);if(He===void 0)continue;const $e=He.buffer,De=He.type,K=He.bytesPerElement,he=De===n.INT||De===n.UNSIGNED_INT||ce.gpuType===xs;if(ce.isInterleavedBufferAttribute){const ie=ce.data,Ee=ie.stride,Re=ce.offset;if(ie.isInstancedInterleavedBuffer){for(let Te=0;Te<Q.locationSize;Te++)h(Q.location+Te,ie.meshPerAttribute);R.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Te=0;Te<Q.locationSize;Te++)f(Q.location+Te);n.bindBuffer(n.ARRAY_BUFFER,$e);for(let Te=0;Te<Q.locationSize;Te++)T(Q.location+Te,ye/Q.locationSize,De,ve,Ee*K,(Re+ye/Q.locationSize*Te)*K,he)}else{if(ce.isInstancedBufferAttribute){for(let ie=0;ie<Q.locationSize;ie++)h(Q.location+ie,ce.meshPerAttribute);R.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ie=0;ie<Q.locationSize;ie++)f(Q.location+ie);n.bindBuffer(n.ARRAY_BUFFER,$e);for(let ie=0;ie<Q.locationSize;ie++)T(Q.location+ie,ye/Q.locationSize,De,ve,ye*K,ye/Q.locationSize*ie*K,he)}}else if(H!==void 0){const ve=H[J];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(Q.location,ve);break;case 3:n.vertexAttrib3fv(Q.location,ve);break;case 4:n.vertexAttrib4fv(Q.location,ve);break;default:n.vertexAttrib1fv(Q.location,ve)}}}}y()}function P(){A();for(const R in i){const z=i[R];for(const W in z){const q=z[W];for(const I in q){const G=q[I];for(const H in G)d(G[H].object),delete G[H];delete q[I]}}delete i[R]}}function b(R){if(i[R.id]===void 0)return;const z=i[R.id];for(const W in z){const q=z[W];for(const I in q){const G=q[I];for(const H in G)d(G[H].object),delete G[H];delete q[I]}}delete i[R.id]}function L(R){for(const z in i){const W=i[z];for(const q in W){const I=W[q];if(I[R.id]===void 0)continue;const G=I[R.id];for(const H in G)d(G[H].object),delete G[H];delete I[R.id]}}}function x(R){for(const z in i){const W=i[z],q=R.isInstancedMesh===!0?R.id:0,I=W[q];if(I!==void 0){for(const G in I){const H=I[G];for(const J in H)d(H[J].object),delete H[J];delete I[G]}delete W[q],Object.keys(W).length===0&&delete i[z]}}}function A(){U(),s=!0,a!==r&&(a=r,c(a.object))}function U(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:A,resetDefaultState:U,dispose:P,releaseStatesOfGeometry:b,releaseStatesOfObject:x,releaseStatesOfProgram:L,initAttributes:M,enableAttribute:f,disableUnusedAttributes:y}}function Af(n,e,t){let i;function r(l){i=l}function a(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function s(l,c,d){d!==0&&(n.drawArraysInstanced(i,l,c,d),t.update(c,i,d))}function o(l,c,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,d);let u=0;for(let m=0;m<d;m++)u+=c[m];t.update(u,i,1)}this.setMode=r,this.render=a,this.renderInstances=s,this.renderMultiDraw=o}function wf(n,e,t,i){let r;function a(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const L=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function s(L){return!(L!==Yt&&i.convert(L)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(L){const x=L===yn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(L!==zt&&i.convert(L)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==nn&&!x)}function l(L){if(L==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(Ae("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const p=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ae("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),f=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),h=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),T=n.getParameter(n.MAX_VARYING_VECTORS),E=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reversedDepthBuffer:u,maxTextures:m,maxVertexTextures:v,maxTextureSize:M,maxCubemapSize:f,maxAttributes:h,maxVertexUniforms:y,maxVaryings:T,maxFragmentUniforms:E,maxSamples:P,samples:b}}function Rf(n){const e=this;let t=null,i=0,r=!1,a=!1;const s=new Hn,o=new Ce,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,u){const m=p.length!==0||u||i!==0||r;return r=u,i=p.length,m},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(p,u){t=d(p,u,0)},this.setState=function(p,u,m){const v=p.clippingPlanes,M=p.clipIntersection,f=p.clipShadows,h=n.get(p);if(!r||v===null||v.length===0||a&&!f)a?d(null):c();else{const y=a?0:i,T=y*4;let E=h.clippingState||null;l.value=E,E=d(v,u,T,m);for(let P=0;P!==T;++P)E[P]=t[P];h.clippingState=E,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(p,u,m,v){const M=p!==null?p.length:0;let f=null;if(M!==0){if(f=l.value,v!==!0||f===null){const h=m+M*4,y=u.matrixWorldInverse;o.getNormalMatrix(y),(f===null||f.length<h)&&(f=new Float32Array(h));for(let T=0,E=m;T!==M;++T,E+=4)s.copy(p[T]).applyMatrix4(y,o),s.normal.toArray(f,E),f[E+3]=s.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,f}}const Nn=4,So=[.125,.215,.35,.446,.526,.582],Wn=20,Cf=256,Pi=new Ps,Mo=new Je;let pa=null,ma=0,ga=0,_a=!1;const Pf=new B;class yo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,a={}){const{size:s=256,position:o=Pf}=a;pa=this._renderer.getRenderTarget(),ma=this._renderer.getActiveCubeFace(),ga=this._renderer.getActiveMipmapLevel(),_a=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(s);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=To(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Eo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(pa,ma,ga),this._renderer.xr.enabled=_a,e.scissorTest=!1,fi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===$n||e.mapping===Si?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),pa=this._renderer.getRenderTarget(),ma=this._renderer.getActiveCubeFace(),ga=this._renderer.getActiveMipmapLevel(),_a=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:At,minFilter:At,generateMipmaps:!1,type:yn,format:Yt,colorSpace:Rr,depthBuffer:!1},r=bo(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bo(e,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Lf(a)),this._blurMaterial=If(a,e,t),this._ggxMaterial=Df(a,e,t)}return r}_compileMaterial(e){const t=new cn(new En,e);this._renderer.compile(t,Pi)}_sceneToCubeUV(e,t,i,r,a){const l=new Xt(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],p=this._renderer,u=p.autoClear,m=p.toneMapping;p.getClearColor(Mo),p.toneMapping=an,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(r),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new cn(new Vi,new wl({name:"PMREM.Background",side:Pt,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,f=M.material;let h=!1;const y=e.background;y?y.isColor&&(f.color.copy(y),e.background=null,h=!0):(f.color.copy(Mo),h=!0);for(let T=0;T<6;T++){const E=T%3;E===0?(l.up.set(0,c[T],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+d[T],a.y,a.z)):E===1?(l.up.set(0,0,c[T]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+d[T],a.z)):(l.up.set(0,c[T],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+d[T]));const P=this._cubeSize;fi(r,E*P,T>2?P:0,P,P),p.setRenderTarget(r),h&&p.render(M,l),p.render(e,l)}p.toneMapping=m,p.autoClear=u,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===$n||e.mapping===Si;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=To()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Eo());const a=r?this._cubemapMaterial:this._equirectMaterial,s=this._lodMeshes[0];s.material=a;const o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;fi(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(s,Pi)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let a=1;a<r;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,a=this._pingPongRenderTarget,s=this._ggxMaterial,o=this._lodMeshes[i];o.material=s;const l=s.uniforms,c=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),p=Math.sqrt(c*c-d*d),u=0+c*1.25,m=p*u,{_lodMax:v}=this,M=this._sizeLods[i],f=3*M*(i>v-Nn?i-v+Nn:0),h=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=m,l.mipInt.value=v-t,fi(a,f,h,3*M,2*M),r.setRenderTarget(a),r.render(o,Pi),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=v-i,fi(e,f,h,3*M,2*M),r.setRenderTarget(e),r.render(o,Pi)}_blur(e,t,i,r,a){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,i,r,"latitudinal",a),this._halfBlur(s,e,i,i,r,"longitudinal",a)}_halfBlur(e,t,i,r,a,s,o){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&We("blur direction must be either latitudinal or longitudinal!");const d=3,p=this._lodMeshes[r];p.material=c;const u=c.uniforms,m=this._sizeLods[i]-1,v=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*Wn-1),M=a/v,f=isFinite(a)?1+Math.floor(d*M):Wn;f>Wn&&Ae(`sigmaRadians, ${a}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${Wn}`);const h=[];let y=0;for(let L=0;L<Wn;++L){const x=L/M,A=Math.exp(-x*x/2);h.push(A),L===0?y+=A:L<f&&(y+=2*A)}for(let L=0;L<h.length;L++)h[L]=h[L]/y;u.envMap.value=e.texture,u.samples.value=f,u.weights.value=h,u.latitudinal.value=s==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:T}=this;u.dTheta.value=v,u.mipInt.value=T-i;const E=this._sizeLods[r],P=3*E*(r>T-Nn?r-T+Nn:0),b=4*(this._cubeSize-E);fi(t,P,b,3*E,2*E),l.setRenderTarget(t),l.render(p,Pi)}}function Lf(n){const e=[],t=[],i=[];let r=n;const a=n-Nn+1+So.length;for(let s=0;s<a;s++){const o=Math.pow(2,r);e.push(o);let l=1/o;s>n-Nn?l=So[s-n+Nn-1]:s===0&&(l=0),t.push(l);const c=1/(o-2),d=-c,p=1+c,u=[d,d,p,d,p,p,d,d,p,p,d,p],m=6,v=6,M=3,f=2,h=1,y=new Float32Array(M*v*m),T=new Float32Array(f*v*m),E=new Float32Array(h*v*m);for(let b=0;b<m;b++){const L=b%3*2/3-1,x=b>2?0:-1,A=[L,x,0,L+2/3,x,0,L+2/3,x+1,0,L,x,0,L+2/3,x+1,0,L,x+1,0];y.set(A,M*v*b),T.set(u,f*v*b);const U=[b,b,b,b,b,b];E.set(U,h*v*b)}const P=new En;P.setAttribute("position",new on(y,M)),P.setAttribute("uv",new on(T,f)),P.setAttribute("faceIndex",new on(E,h)),i.push(new cn(P,null)),r>Nn&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function bo(n,e,t){const i=new sn(n,e,t);return i.texture.mapping=Fr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function fi(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Df(n,e,t){return new $t({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Cf,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Br(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:xn,depthTest:!1,depthWrite:!1})}function If(n,e,t){const i=new Float32Array(Wn),r=new B(0,1,0);return new $t({name:"SphericalGaussianBlur",defines:{n:Wn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Br(),fragmentShader:`

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
		`,blending:xn,depthTest:!1,depthWrite:!1})}function Eo(){return new $t({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Br(),fragmentShader:`

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
		`,blending:xn,depthTest:!1,depthWrite:!1})}function To(){return new $t({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Br(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xn,depthTest:!1,depthWrite:!1})}function Br(){return`

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
	`}class Fl extends sn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Cl(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Vi(5,5,5),a=new $t({name:"CubemapFromEquirect",uniforms:yi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Pt,blending:xn});a.uniforms.tEquirect.value=t;const s=new cn(r,a),o=t.minFilter;return t.minFilter===Xn&&(t.minFilter=At),new Bu(1,10,this).update(e,s),t.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const a=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,i,r);e.setRenderTarget(a)}}function Uf(n){let e=new WeakMap,t=new WeakMap,i=null;function r(u,m=!1){return u==null?null:m?s(u):a(u)}function a(u){if(u&&u.isTexture){const m=u.mapping;if(m===Hr||m===Vr)if(e.has(u)){const v=e.get(u).texture;return o(v,u.mapping)}else{const v=u.image;if(v&&v.height>0){const M=new Fl(v.height);return M.fromEquirectangularTexture(n,u),e.set(u,M),u.addEventListener("dispose",c),o(M.texture,u.mapping)}else return null}}return u}function s(u){if(u&&u.isTexture){const m=u.mapping,v=m===Hr||m===Vr,M=m===$n||m===Si;if(v||M){let f=t.get(u);const h=f!==void 0?f.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==h)return i===null&&(i=new yo(n)),f=v?i.fromEquirectangular(u,f):i.fromCubemap(u,f),f.texture.pmremVersion=u.pmremVersion,t.set(u,f),f.texture;if(f!==void 0)return f.texture;{const y=u.image;return v&&y&&y.height>0||M&&y&&l(y)?(i===null&&(i=new yo(n)),f=v?i.fromEquirectangular(u):i.fromCubemap(u),f.texture.pmremVersion=u.pmremVersion,t.set(u,f),u.addEventListener("dispose",d),f.texture):null}}}return u}function o(u,m){return m===Hr?u.mapping=$n:m===Vr&&(u.mapping=Si),u}function l(u){let m=0;const v=6;for(let M=0;M<v;M++)u[M]!==void 0&&m++;return m===v}function c(u){const m=u.target;m.removeEventListener("dispose",c);const v=e.get(m);v!==void 0&&(e.delete(m),v.dispose())}function d(u){const m=u.target;m.removeEventListener("dispose",d);const v=t.get(m);v!==void 0&&(t.delete(m),v.dispose())}function p(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:p}}function Nf(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&us("WebGLRenderer: "+i+" extension not supported."),r}}}function Ff(n,e,t,i){const r={},a=new WeakMap;function s(p){const u=p.target;u.index!==null&&e.remove(u.index);for(const v in u.attributes)e.remove(u.attributes[v]);u.removeEventListener("dispose",s),delete r[u.id];const m=a.get(u);m&&(e.remove(m),a.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(p,u){return r[u.id]===!0||(u.addEventListener("dispose",s),r[u.id]=!0,t.memory.geometries++),u}function l(p){const u=p.attributes;for(const m in u)e.update(u[m],n.ARRAY_BUFFER)}function c(p){const u=[],m=p.index,v=p.attributes.position;let M=0;if(v===void 0)return;if(m!==null){const y=m.array;M=m.version;for(let T=0,E=y.length;T<E;T+=3){const P=y[T+0],b=y[T+1],L=y[T+2];u.push(P,b,b,L,L,P)}}else{const y=v.array;M=v.version;for(let T=0,E=y.length/3-1;T<E;T+=3){const P=T+0,b=T+1,L=T+2;u.push(P,b,b,L,L,P)}}const f=new(v.count>=65535?Al:Tl)(u,1);f.version=M;const h=a.get(p);h&&e.remove(h),a.set(p,f)}function d(p){const u=a.get(p);if(u){const m=p.index;m!==null&&u.version<m.version&&c(p)}else c(p);return a.get(p)}return{get:o,update:l,getWireframeAttribute:d}}function Of(n,e,t){let i;function r(p){i=p}let a,s;function o(p){a=p.type,s=p.bytesPerElement}function l(p,u){n.drawElements(i,u,a,p*s),t.update(u,i,1)}function c(p,u,m){m!==0&&(n.drawElementsInstanced(i,u,a,p*s,m),t.update(u,i,m))}function d(p,u,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,p,0,m);let M=0;for(let f=0;f<m;f++)M+=u[f];t.update(M,i,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function Bf(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,s,o){switch(t.calls++,s){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:We("WebGLInfo: Unknown draw mode:",s);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function zf(n,e,t){const i=new WeakMap,r=new ht;function a(s,o,l){const c=s.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=d!==void 0?d.length:0;let u=i.get(o);if(u===void 0||u.count!==p){let A=function(){L.dispose(),i.delete(o),o.removeEventListener("dispose",A)};u!==void 0&&u.texture.dispose();const m=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,M=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],h=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let T=0;m===!0&&(T=1),v===!0&&(T=2),M===!0&&(T=3);let E=o.attributes.position.count*T,P=1;E>e.maxTextureSize&&(P=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const b=new Float32Array(E*P*4*p),L=new yl(b,E,P,p);L.type=nn,L.needsUpdate=!0;const x=T*4;for(let U=0;U<p;U++){const R=f[U],z=h[U],W=y[U],q=E*P*4*U;for(let I=0;I<R.count;I++){const G=I*x;m===!0&&(r.fromBufferAttribute(R,I),b[q+G+0]=r.x,b[q+G+1]=r.y,b[q+G+2]=r.z,b[q+G+3]=0),v===!0&&(r.fromBufferAttribute(z,I),b[q+G+4]=r.x,b[q+G+5]=r.y,b[q+G+6]=r.z,b[q+G+7]=0),M===!0&&(r.fromBufferAttribute(W,I),b[q+G+8]=r.x,b[q+G+9]=r.y,b[q+G+10]=r.z,b[q+G+11]=W.itemSize===4?r.w:1)}}u={count:p,texture:L,size:new Ye(E,P)},i.set(o,u),o.addEventListener("dispose",A)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",s.morphTexture,t);else{let m=0;for(let M=0;M<c.length;M++)m+=c[M];const v=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:a}}function kf(n,e,t,i,r){let a=new WeakMap;function s(c){const d=r.render.frame,p=c.geometry,u=e.get(c,p);if(a.get(u)!==d&&(e.update(u),a.set(u,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==d&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,d))),c.isSkinnedMesh){const m=c.skeleton;a.get(m)!==d&&(m.update(),a.set(m,d))}return u}function o(){a=new WeakMap}function l(c){const d=c.target;d.removeEventListener("dispose",l),i.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:s,dispose:o}}const Gf={[sl]:"LINEAR_TONE_MAPPING",[ol]:"REINHARD_TONE_MAPPING",[ll]:"CINEON_TONE_MAPPING",[cl]:"ACES_FILMIC_TONE_MAPPING",[dl]:"AGX_TONE_MAPPING",[hl]:"NEUTRAL_TONE_MAPPING",[ul]:"CUSTOM_TONE_MAPPING"};function Hf(n,e,t,i,r){const a=new sn(e,t,{type:n,depthBuffer:i,stencilBuffer:r,depthTexture:i?new Mi(e,t):void 0}),s=new sn(e,t,{type:yn,depthBuffer:!1,stencilBuffer:!1}),o=new En;o.setAttribute("position",new Mn([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Mn([0,2,0,0,2,0],2));const l=new Nu({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new cn(o,l),d=new Ps(-1,1,1,-1,0,1);let p=null,u=null,m=!1,v,M=null,f=[],h=!1;this.setSize=function(y,T){a.setSize(y,T),s.setSize(y,T);for(let E=0;E<f.length;E++){const P=f[E];P.setSize&&P.setSize(y,T)}},this.setEffects=function(y){f=y,h=f.length>0&&f[0].isRenderPass===!0;const T=a.width,E=a.height;for(let P=0;P<f.length;P++){const b=f[P];b.setSize&&b.setSize(T,E)}},this.begin=function(y,T){if(m||y.toneMapping===an&&f.length===0)return!1;if(M=T,T!==null){const E=T.width,P=T.height;(a.width!==E||a.height!==P)&&this.setSize(E,P)}return h===!1&&y.setRenderTarget(a),v=y.toneMapping,y.toneMapping=an,!0},this.hasRenderPass=function(){return h},this.end=function(y,T){y.toneMapping=v,m=!0;let E=a,P=s;for(let b=0;b<f.length;b++){const L=f[b];if(L.enabled!==!1&&(L.render(y,P,E,T),L.needsSwap!==!1)){const x=E;E=P,P=x}}if(p!==y.outputColorSpace||u!==y.toneMapping){p=y.outputColorSpace,u=y.toneMapping,l.defines={},Ge.getTransfer(p)===qe&&(l.defines.SRGB_TRANSFER="");const b=Gf[u];b&&(l.defines[b]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=E.texture,y.setRenderTarget(M),y.render(c,d),M=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),s.dispose(),o.dispose(),l.dispose()}}const Ol=new Ct,ds=new Mi(1,1),Bl=new yl,zl=new du,kl=new Cl,Ao=[],wo=[],Ro=new Float32Array(16),Co=new Float32Array(9),Po=new Float32Array(4);function Ti(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let a=Ao[r];if(a===void 0&&(a=new Float32Array(r),Ao[r]=a),e!==0){i.toArray(a,0);for(let s=1,o=0;s!==e;++s)o+=t,n[s].toArray(a,o)}return a}function _t(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function vt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function zr(n,e){let t=wo[e];t===void 0&&(t=new Int32Array(e),wo[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Vf(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Wf(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;n.uniform2fv(this.addr,e),vt(t,e)}}function Xf(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(_t(t,e))return;n.uniform3fv(this.addr,e),vt(t,e)}}function qf(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;n.uniform4fv(this.addr,e),vt(t,e)}}function Yf(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(_t(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,i))return;Po.set(i),n.uniformMatrix2fv(this.addr,!1,Po),vt(t,i)}}function $f(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(_t(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,i))return;Co.set(i),n.uniformMatrix3fv(this.addr,!1,Co),vt(t,i)}}function Kf(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(_t(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,i))return;Ro.set(i),n.uniformMatrix4fv(this.addr,!1,Ro),vt(t,i)}}function Zf(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function jf(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;n.uniform2iv(this.addr,e),vt(t,e)}}function Jf(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;n.uniform3iv(this.addr,e),vt(t,e)}}function Qf(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;n.uniform4iv(this.addr,e),vt(t,e)}}function ep(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function tp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;n.uniform2uiv(this.addr,e),vt(t,e)}}function np(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;n.uniform3uiv(this.addr,e),vt(t,e)}}function ip(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;n.uniform4uiv(this.addr,e),vt(t,e)}}function rp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let a;this.type===n.SAMPLER_2D_SHADOW?(ds.compareFunction=t.isReversedDepthBuffer()?As:Ts,a=ds):a=Ol,t.setTexture2D(e||a,r)}function ap(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||zl,r)}function sp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||kl,r)}function op(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Bl,r)}function lp(n){switch(n){case 5126:return Vf;case 35664:return Wf;case 35665:return Xf;case 35666:return qf;case 35674:return Yf;case 35675:return $f;case 35676:return Kf;case 5124:case 35670:return Zf;case 35667:case 35671:return jf;case 35668:case 35672:return Jf;case 35669:case 35673:return Qf;case 5125:return ep;case 36294:return tp;case 36295:return np;case 36296:return ip;case 35678:case 36198:case 36298:case 36306:case 35682:return rp;case 35679:case 36299:case 36307:return ap;case 35680:case 36300:case 36308:case 36293:return sp;case 36289:case 36303:case 36311:case 36292:return op}}function cp(n,e){n.uniform1fv(this.addr,e)}function up(n,e){const t=Ti(e,this.size,2);n.uniform2fv(this.addr,t)}function dp(n,e){const t=Ti(e,this.size,3);n.uniform3fv(this.addr,t)}function hp(n,e){const t=Ti(e,this.size,4);n.uniform4fv(this.addr,t)}function fp(n,e){const t=Ti(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function pp(n,e){const t=Ti(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function mp(n,e){const t=Ti(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function gp(n,e){n.uniform1iv(this.addr,e)}function _p(n,e){n.uniform2iv(this.addr,e)}function vp(n,e){n.uniform3iv(this.addr,e)}function xp(n,e){n.uniform4iv(this.addr,e)}function Sp(n,e){n.uniform1uiv(this.addr,e)}function Mp(n,e){n.uniform2uiv(this.addr,e)}function yp(n,e){n.uniform3uiv(this.addr,e)}function bp(n,e){n.uniform4uiv(this.addr,e)}function Ep(n,e,t){const i=this.cache,r=e.length,a=zr(t,r);_t(i,a)||(n.uniform1iv(this.addr,a),vt(i,a));let s;this.type===n.SAMPLER_2D_SHADOW?s=ds:s=Ol;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||s,a[o])}function Tp(n,e,t){const i=this.cache,r=e.length,a=zr(t,r);_t(i,a)||(n.uniform1iv(this.addr,a),vt(i,a));for(let s=0;s!==r;++s)t.setTexture3D(e[s]||zl,a[s])}function Ap(n,e,t){const i=this.cache,r=e.length,a=zr(t,r);_t(i,a)||(n.uniform1iv(this.addr,a),vt(i,a));for(let s=0;s!==r;++s)t.setTextureCube(e[s]||kl,a[s])}function wp(n,e,t){const i=this.cache,r=e.length,a=zr(t,r);_t(i,a)||(n.uniform1iv(this.addr,a),vt(i,a));for(let s=0;s!==r;++s)t.setTexture2DArray(e[s]||Bl,a[s])}function Rp(n){switch(n){case 5126:return cp;case 35664:return up;case 35665:return dp;case 35666:return hp;case 35674:return fp;case 35675:return pp;case 35676:return mp;case 5124:case 35670:return gp;case 35667:case 35671:return _p;case 35668:case 35672:return vp;case 35669:case 35673:return xp;case 5125:return Sp;case 36294:return Mp;case 36295:return yp;case 36296:return bp;case 35678:case 36198:case 36298:case 36306:case 35682:return Ep;case 35679:case 36299:case 36307:return Tp;case 35680:case 36300:case 36308:case 36293:return Ap;case 36289:case 36303:case 36311:case 36292:return wp}}class Cp{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=lp(t.type)}}class Pp{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Rp(t.type)}}class Lp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let a=0,s=r.length;a!==s;++a){const o=r[a];o.setValue(e,t[o.id],i)}}}const va=/(\w+)(\])?(\[|\.)?/g;function Lo(n,e){n.seq.push(e),n.map[e.id]=e}function Dp(n,e,t){const i=n.name,r=i.length;for(va.lastIndex=0;;){const a=va.exec(i),s=va.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===r){Lo(t,c===void 0?new Cp(o,n,e):new Pp(o,n,e));break}else{let p=t.map[o];p===void 0&&(p=new Lp(o),Lo(t,p)),t=p}}}class Tr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const o=e.getActiveUniform(t,s),l=e.getUniformLocation(t,o.name);Dp(o,l,this)}const r=[],a=[];for(const s of this.seq)s.type===e.SAMPLER_2D_SHADOW||s.type===e.SAMPLER_CUBE_SHADOW||s.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(s):a.push(s);r.length>0&&(this.seq=r.concat(a))}setValue(e,t,i,r){const a=this.map[t];a!==void 0&&a.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let a=0,s=t.length;a!==s;++a){const o=t[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,a=e.length;r!==a;++r){const s=e[r];s.id in t&&i.push(s)}return i}}function Do(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Ip=37297;let Up=0;function Np(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let s=r;s<a;s++){const o=s+1;i.push(`${o===e?">":" "} ${o}: ${t[s]}`)}return i.join(`
`)}const Io=new Ce;function Fp(n){Ge._getMatrix(Io,Ge.workingColorSpace,n);const e=`mat3( ${Io.elements.map(t=>t.toFixed(4))} )`;switch(Ge.getTransfer(n)){case Cr:return[e,"LinearTransferOETF"];case qe:return[e,"sRGBTransferOETF"];default:return Ae("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Uo(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+a+`

`+Np(n.getShaderSource(e),o)}else return a}function Op(n,e){const t=Fp(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Bp={[sl]:"Linear",[ol]:"Reinhard",[ll]:"Cineon",[cl]:"ACESFilmic",[dl]:"AgX",[hl]:"Neutral",[ul]:"Custom"};function zp(n,e){const t=Bp[e];return t===void 0?(Ae("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const gr=new B;function kp(){Ge.getLuminanceCoefficients(gr);const n=gr.x.toFixed(4),e=gr.y.toFixed(4),t=gr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Gp(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ii).join(`
`)}function Hp(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Vp(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const a=n.getActiveAttrib(e,r),s=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[s]={type:a.type,location:n.getAttribLocation(e,s),locationSize:o}}return t}function Ii(n){return n!==""}function No(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fo(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Wp=/^[ \t]*#include +<([\w\d./]+)>/gm;function hs(n){return n.replace(Wp,qp)}const Xp=new Map;function qp(n,e){let t=Ue[e];if(t===void 0){const i=Xp.get(e);if(i!==void 0)t=Ue[i],Ae('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return hs(t)}const Yp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Oo(n){return n.replace(Yp,$p)}function $p(n,e,t,i){let r="";for(let a=parseInt(e);a<parseInt(t);a++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function Bo(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Kp={[Sr]:"SHADOWMAP_TYPE_PCF",[Di]:"SHADOWMAP_TYPE_VSM"};function Zp(n){return Kp[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const jp={[$n]:"ENVMAP_TYPE_CUBE",[Si]:"ENVMAP_TYPE_CUBE",[Fr]:"ENVMAP_TYPE_CUBE_UV"};function Jp(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":jp[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const Qp={[Si]:"ENVMAP_MODE_REFRACTION"};function em(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Qp[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const tm={[al]:"ENVMAP_BLENDING_MULTIPLY",[Cc]:"ENVMAP_BLENDING_MIX",[Pc]:"ENVMAP_BLENDING_ADD"};function nm(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":tm[n.combine]||"ENVMAP_BLENDING_NONE"}function im(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function rm(n,e,t,i){const r=n.getContext(),a=t.defines;let s=t.vertexShader,o=t.fragmentShader;const l=Zp(t),c=Jp(t),d=em(t),p=nm(t),u=im(t),m=Gp(t),v=Hp(a),M=r.createProgram();let f,h,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Ii).join(`
`),f.length>0&&(f+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Ii).join(`
`),h.length>0&&(h+=`
`)):(f=[Bo(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ii).join(`
`),h=[Bo(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+p:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==an?"#define TONE_MAPPING":"",t.toneMapping!==an?Ue.tonemapping_pars_fragment:"",t.toneMapping!==an?zp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,Op("linearToOutputTexel",t.outputColorSpace),kp(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ii).join(`
`)),s=hs(s),s=No(s,t),s=Fo(s,t),o=hs(o),o=No(o,t),o=Fo(o,t),s=Oo(s),o=Oo(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,h=["#define varying in",t.glslVersion===js?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===js?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const T=y+f+s,E=y+h+o,P=Do(r,r.VERTEX_SHADER,T),b=Do(r,r.FRAGMENT_SHADER,E);r.attachShader(M,P),r.attachShader(M,b),t.index0AttributeName!==void 0?r.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(M,0,"position"),r.linkProgram(M);function L(R){if(n.debug.checkShaderErrors){const z=r.getProgramInfoLog(M)||"",W=r.getShaderInfoLog(P)||"",q=r.getShaderInfoLog(b)||"",I=z.trim(),G=W.trim(),H=q.trim();let J=!0,Q=!0;if(r.getProgramParameter(M,r.LINK_STATUS)===!1)if(J=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,M,P,b);else{const ce=Uo(r,P,"vertex"),ve=Uo(r,b,"fragment");We("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(M,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+ce+`
`+ve)}else I!==""?Ae("WebGLProgram: Program Info Log:",I):(G===""||H==="")&&(Q=!1);Q&&(R.diagnostics={runnable:J,programLog:I,vertexShader:{log:G,prefix:f},fragmentShader:{log:H,prefix:h}})}r.deleteShader(P),r.deleteShader(b),x=new Tr(r,M),A=Vp(r,M)}let x;this.getUniforms=function(){return x===void 0&&L(this),x};let A;this.getAttributes=function(){return A===void 0&&L(this),A};let U=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return U===!1&&(U=r.getProgramParameter(M,Ip)),U},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Up++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=P,this.fragmentShader=b,this}let am=0;class sm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),a=this._getShaderStage(i),s=this._getShaderCacheForMaterial(e);return s.has(r)===!1&&(s.add(r),r.usedTimes++),s.has(a)===!1&&(s.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new om(e),t.set(e,i)),i}}class om{constructor(e){this.id=am++,this.code=e,this.usedTimes=0}}function lm(n){return n===Kn||n===Ar||n===wr}function cm(n,e,t,i,r,a){const s=new bl,o=new sm,l=new Set,c=[],d=new Map,p=i.logarithmicDepthBuffer;let u=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return l.add(x),x===0?"uv":`uv${x}`}function M(x,A,U,R,z,W){const q=R.fog,I=z.geometry,G=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?R.environment:null,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,J=e.get(x.envMap||G,H),Q=J&&J.mapping===Fr?J.image.height:null,ce=m[x.type];x.precision!==null&&(u=i.getMaxPrecision(x.precision),u!==x.precision&&Ae("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const ve=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ye=ve!==void 0?ve.length:0;let He=0;I.morphAttributes.position!==void 0&&(He=1),I.morphAttributes.normal!==void 0&&(He=2),I.morphAttributes.color!==void 0&&(He=3);let $e,De,K,he;if(ce){const Pe=tn[ce];$e=Pe.vertexShader,De=Pe.fragmentShader}else $e=x.vertexShader,De=x.fragmentShader,o.update(x),K=o.getVertexShaderID(x),he=o.getFragmentShaderID(x);const ie=n.getRenderTarget(),Ee=n.state.buffers.depth.getReversed(),Re=z.isInstancedMesh===!0,Te=z.isBatchedMesh===!0,rt=!!x.map,Oe=!!x.matcap,Ke=!!J,it=!!x.aoMap,Fe=!!x.lightMap,mt=!!x.bumpMap,at=!!x.normalMap,Lt=!!x.displacementMap,C=!!x.emissiveMap,gt=!!x.metalnessMap,Be=!!x.roughnessMap,tt=x.anisotropy>0,oe=x.clearcoat>0,st=x.dispersion>0,S=x.iridescence>0,g=x.sheen>0,N=x.transmission>0,Y=tt&&!!x.anisotropyMap,j=oe&&!!x.clearcoatMap,ee=oe&&!!x.clearcoatNormalMap,se=oe&&!!x.clearcoatRoughnessMap,V=S&&!!x.iridescenceMap,$=S&&!!x.iridescenceThicknessMap,fe=g&&!!x.sheenColorMap,ge=g&&!!x.sheenRoughnessMap,re=!!x.specularMap,te=!!x.specularColorMap,we=!!x.specularIntensityMap,Ie=N&&!!x.transmissionMap,Xe=N&&!!x.thicknessMap,w=!!x.gradientMap,ne=!!x.alphaMap,X=x.alphaTest>0,pe=!!x.alphaHash,ae=!!x.extensions;let Z=an;x.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Z=n.toneMapping);const Se={shaderID:ce,shaderType:x.type,shaderName:x.name,vertexShader:$e,fragmentShader:De,defines:x.defines,customVertexShaderID:K,customFragmentShaderID:he,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:Te,batchingColor:Te&&z._colorsTexture!==null,instancing:Re,instancingColor:Re&&z.instanceColor!==null,instancingMorph:Re&&z.morphTexture!==null,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Ge.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:rt,matcap:Oe,envMap:Ke,envMapMode:Ke&&J.mapping,envMapCubeUVHeight:Q,aoMap:it,lightMap:Fe,bumpMap:mt,normalMap:at,displacementMap:Lt,emissiveMap:C,normalMapObjectSpace:at&&x.normalMapType===Ic,normalMapTangentSpace:at&&x.normalMapType===$s,packedNormalMap:at&&x.normalMapType===$s&&lm(x.normalMap.format),metalnessMap:gt,roughnessMap:Be,anisotropy:tt,anisotropyMap:Y,clearcoat:oe,clearcoatMap:j,clearcoatNormalMap:ee,clearcoatRoughnessMap:se,dispersion:st,iridescence:S,iridescenceMap:V,iridescenceThicknessMap:$,sheen:g,sheenColorMap:fe,sheenRoughnessMap:ge,specularMap:re,specularColorMap:te,specularIntensityMap:we,transmission:N,transmissionMap:Ie,thicknessMap:Xe,gradientMap:w,opaque:x.transparent===!1&&x.blending===gi&&x.alphaToCoverage===!1,alphaMap:ne,alphaTest:X,alphaHash:pe,combine:x.combine,mapUv:rt&&v(x.map.channel),aoMapUv:it&&v(x.aoMap.channel),lightMapUv:Fe&&v(x.lightMap.channel),bumpMapUv:mt&&v(x.bumpMap.channel),normalMapUv:at&&v(x.normalMap.channel),displacementMapUv:Lt&&v(x.displacementMap.channel),emissiveMapUv:C&&v(x.emissiveMap.channel),metalnessMapUv:gt&&v(x.metalnessMap.channel),roughnessMapUv:Be&&v(x.roughnessMap.channel),anisotropyMapUv:Y&&v(x.anisotropyMap.channel),clearcoatMapUv:j&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:ee&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:V&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:$&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:ge&&v(x.sheenRoughnessMap.channel),specularMapUv:re&&v(x.specularMap.channel),specularColorMapUv:te&&v(x.specularColorMap.channel),specularIntensityMapUv:we&&v(x.specularIntensityMap.channel),transmissionMapUv:Ie&&v(x.transmissionMap.channel),thicknessMapUv:Xe&&v(x.thicknessMap.channel),alphaMapUv:ne&&v(x.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(at||tt),vertexNormals:!!I.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!I.attributes.uv&&(rt||ne),fog:!!q,useFog:x.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||I.attributes.normal===void 0&&at===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:Ee,skinning:z.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:He,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:W.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&U.length>0,shadowMapType:n.shadowMap.type,toneMapping:Z,decodeVideoTexture:rt&&x.map.isVideoTexture===!0&&Ge.getTransfer(x.map.colorSpace)===qe,decodeVideoTextureEmissive:C&&x.emissiveMap.isVideoTexture===!0&&Ge.getTransfer(x.emissiveMap.colorSpace)===qe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===_n,flipSided:x.side===Pt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ae&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ae&&x.extensions.multiDraw===!0||Te)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Se.vertexUv1s=l.has(1),Se.vertexUv2s=l.has(2),Se.vertexUv3s=l.has(3),l.clear(),Se}function f(x){const A=[];if(x.shaderID?A.push(x.shaderID):(A.push(x.customVertexShaderID),A.push(x.customFragmentShaderID)),x.defines!==void 0)for(const U in x.defines)A.push(U),A.push(x.defines[U]);return x.isRawShaderMaterial===!1&&(h(A,x),y(A,x),A.push(n.outputColorSpace)),A.push(x.customProgramCacheKey),A.join()}function h(x,A){x.push(A.precision),x.push(A.outputColorSpace),x.push(A.envMapMode),x.push(A.envMapCubeUVHeight),x.push(A.mapUv),x.push(A.alphaMapUv),x.push(A.lightMapUv),x.push(A.aoMapUv),x.push(A.bumpMapUv),x.push(A.normalMapUv),x.push(A.displacementMapUv),x.push(A.emissiveMapUv),x.push(A.metalnessMapUv),x.push(A.roughnessMapUv),x.push(A.anisotropyMapUv),x.push(A.clearcoatMapUv),x.push(A.clearcoatNormalMapUv),x.push(A.clearcoatRoughnessMapUv),x.push(A.iridescenceMapUv),x.push(A.iridescenceThicknessMapUv),x.push(A.sheenColorMapUv),x.push(A.sheenRoughnessMapUv),x.push(A.specularMapUv),x.push(A.specularColorMapUv),x.push(A.specularIntensityMapUv),x.push(A.transmissionMapUv),x.push(A.thicknessMapUv),x.push(A.combine),x.push(A.fogExp2),x.push(A.sizeAttenuation),x.push(A.morphTargetsCount),x.push(A.morphAttributeCount),x.push(A.numDirLights),x.push(A.numPointLights),x.push(A.numSpotLights),x.push(A.numSpotLightMaps),x.push(A.numHemiLights),x.push(A.numRectAreaLights),x.push(A.numDirLightShadows),x.push(A.numPointLightShadows),x.push(A.numSpotLightShadows),x.push(A.numSpotLightShadowsWithMaps),x.push(A.numLightProbes),x.push(A.shadowMapType),x.push(A.toneMapping),x.push(A.numClippingPlanes),x.push(A.numClipIntersection),x.push(A.depthPacking)}function y(x,A){s.disableAll(),A.instancing&&s.enable(0),A.instancingColor&&s.enable(1),A.instancingMorph&&s.enable(2),A.matcap&&s.enable(3),A.envMap&&s.enable(4),A.normalMapObjectSpace&&s.enable(5),A.normalMapTangentSpace&&s.enable(6),A.clearcoat&&s.enable(7),A.iridescence&&s.enable(8),A.alphaTest&&s.enable(9),A.vertexColors&&s.enable(10),A.vertexAlphas&&s.enable(11),A.vertexUv1s&&s.enable(12),A.vertexUv2s&&s.enable(13),A.vertexUv3s&&s.enable(14),A.vertexTangents&&s.enable(15),A.anisotropy&&s.enable(16),A.alphaHash&&s.enable(17),A.batching&&s.enable(18),A.dispersion&&s.enable(19),A.batchingColor&&s.enable(20),A.gradientMap&&s.enable(21),A.packedNormalMap&&s.enable(22),A.vertexNormals&&s.enable(23),x.push(s.mask),s.disableAll(),A.fog&&s.enable(0),A.useFog&&s.enable(1),A.flatShading&&s.enable(2),A.logarithmicDepthBuffer&&s.enable(3),A.reversedDepthBuffer&&s.enable(4),A.skinning&&s.enable(5),A.morphTargets&&s.enable(6),A.morphNormals&&s.enable(7),A.morphColors&&s.enable(8),A.premultipliedAlpha&&s.enable(9),A.shadowMapEnabled&&s.enable(10),A.doubleSided&&s.enable(11),A.flipSided&&s.enable(12),A.useDepthPacking&&s.enable(13),A.dithering&&s.enable(14),A.transmission&&s.enable(15),A.sheen&&s.enable(16),A.opaque&&s.enable(17),A.pointsUvs&&s.enable(18),A.decodeVideoTexture&&s.enable(19),A.decodeVideoTextureEmissive&&s.enable(20),A.alphaToCoverage&&s.enable(21),A.numLightProbeGrids>0&&s.enable(22),x.push(s.mask)}function T(x){const A=m[x.type];let U;if(A){const R=tn[A];U=Du.clone(R.uniforms)}else U=x.uniforms;return U}function E(x,A){let U=d.get(A);return U!==void 0?++U.usedTimes:(U=new rm(n,A,x,r),c.push(U),d.set(A,U)),U}function P(x){if(--x.usedTimes===0){const A=c.indexOf(x);c[A]=c[c.length-1],c.pop(),d.delete(x.cacheKey),x.destroy()}}function b(x){o.remove(x)}function L(){o.dispose()}return{getParameters:M,getProgramCacheKey:f,getUniforms:T,acquireProgram:E,releaseProgram:P,releaseShaderCache:b,programs:c,dispose:L}}function um(){let n=new WeakMap;function e(s){return n.has(s)}function t(s){let o=n.get(s);return o===void 0&&(o={},n.set(s,o)),o}function i(s){n.delete(s)}function r(s,o,l){n.get(s)[o]=l}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:a}}function dm(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function zo(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ko(){const n=[];let e=0;const t=[],i=[],r=[];function a(){e=0,t.length=0,i.length=0,r.length=0}function s(u){let m=0;return u.isInstancedMesh&&(m+=2),u.isSkinnedMesh&&(m+=1),m}function o(u,m,v,M,f,h){let y=n[e];return y===void 0?(y={id:u.id,object:u,geometry:m,material:v,materialVariant:s(u),groupOrder:M,renderOrder:u.renderOrder,z:f,group:h},n[e]=y):(y.id=u.id,y.object=u,y.geometry=m,y.material=v,y.materialVariant=s(u),y.groupOrder=M,y.renderOrder=u.renderOrder,y.z=f,y.group=h),e++,y}function l(u,m,v,M,f,h){const y=o(u,m,v,M,f,h);v.transmission>0?i.push(y):v.transparent===!0?r.push(y):t.push(y)}function c(u,m,v,M,f,h){const y=o(u,m,v,M,f,h);v.transmission>0?i.unshift(y):v.transparent===!0?r.unshift(y):t.unshift(y)}function d(u,m){t.length>1&&t.sort(u||dm),i.length>1&&i.sort(m||zo),r.length>1&&r.sort(m||zo)}function p(){for(let u=e,m=n.length;u<m;u++){const v=n[u];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.group=null}}return{opaque:t,transmissive:i,transparent:r,init:a,push:l,unshift:c,finish:p,sort:d}}function hm(){let n=new WeakMap;function e(i,r){const a=n.get(i);let s;return a===void 0?(s=new ko,n.set(i,[s])):r>=a.length?(s=new ko,a.push(s)):s=a[r],s}function t(){n=new WeakMap}return{get:e,dispose:t}}function fm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new B,color:new Je};break;case"SpotLight":t={position:new B,direction:new B,color:new Je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new Je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new Je,groundColor:new Je};break;case"RectAreaLight":t={color:new Je,position:new B,halfWidth:new B,halfHeight:new B};break}return n[e.id]=t,t}}}function pm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let mm=0;function gm(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function _m(n){const e=new fm,t=pm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new B);const r=new B,a=new pt,s=new pt;function o(c){let d=0,p=0,u=0;for(let A=0;A<9;A++)i.probe[A].set(0,0,0);let m=0,v=0,M=0,f=0,h=0,y=0,T=0,E=0,P=0,b=0,L=0;c.sort(gm);for(let A=0,U=c.length;A<U;A++){const R=c[A],z=R.color,W=R.intensity,q=R.distance;let I=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Kn?I=R.shadow.map.texture:I=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)d+=z.r*W,p+=z.g*W,u+=z.b*W;else if(R.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(R.sh.coefficients[G],W);L++}else if(R.isDirectionalLight){const G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const H=R.shadow,J=t.get(R);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,i.directionalShadow[m]=J,i.directionalShadowMap[m]=I,i.directionalShadowMatrix[m]=R.shadow.matrix,y++}i.directional[m]=G,m++}else if(R.isSpotLight){const G=e.get(R);G.position.setFromMatrixPosition(R.matrixWorld),G.color.copy(z).multiplyScalar(W),G.distance=q,G.coneCos=Math.cos(R.angle),G.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),G.decay=R.decay,i.spot[M]=G;const H=R.shadow;if(R.map&&(i.spotLightMap[P]=R.map,P++,H.updateMatrices(R),R.castShadow&&b++),i.spotLightMatrix[M]=H.matrix,R.castShadow){const J=t.get(R);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,i.spotShadow[M]=J,i.spotShadowMap[M]=I,E++}M++}else if(R.isRectAreaLight){const G=e.get(R);G.color.copy(z).multiplyScalar(W),G.halfWidth.set(R.width*.5,0,0),G.halfHeight.set(0,R.height*.5,0),i.rectArea[f]=G,f++}else if(R.isPointLight){const G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),G.distance=R.distance,G.decay=R.decay,R.castShadow){const H=R.shadow,J=t.get(R);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,J.shadowCameraNear=H.camera.near,J.shadowCameraFar=H.camera.far,i.pointShadow[v]=J,i.pointShadowMap[v]=I,i.pointShadowMatrix[v]=R.shadow.matrix,T++}i.point[v]=G,v++}else if(R.isHemisphereLight){const G=e.get(R);G.skyColor.copy(R.color).multiplyScalar(W),G.groundColor.copy(R.groundColor).multiplyScalar(W),i.hemi[h]=G,h++}}f>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=p,i.ambient[2]=u;const x=i.hash;(x.directionalLength!==m||x.pointLength!==v||x.spotLength!==M||x.rectAreaLength!==f||x.hemiLength!==h||x.numDirectionalShadows!==y||x.numPointShadows!==T||x.numSpotShadows!==E||x.numSpotMaps!==P||x.numLightProbes!==L)&&(i.directional.length=m,i.spot.length=M,i.rectArea.length=f,i.point.length=v,i.hemi.length=h,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=E+P-b,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=L,x.directionalLength=m,x.pointLength=v,x.spotLength=M,x.rectAreaLength=f,x.hemiLength=h,x.numDirectionalShadows=y,x.numPointShadows=T,x.numSpotShadows=E,x.numSpotMaps=P,x.numLightProbes=L,i.version=mm++)}function l(c,d){let p=0,u=0,m=0,v=0,M=0;const f=d.matrixWorldInverse;for(let h=0,y=c.length;h<y;h++){const T=c[h];if(T.isDirectionalLight){const E=i.directional[p];E.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(f),p++}else if(T.isSpotLight){const E=i.spot[m];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(f),E.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(f),m++}else if(T.isRectAreaLight){const E=i.rectArea[v];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(f),s.identity(),a.copy(T.matrixWorld),a.premultiply(f),s.extractRotation(a),E.halfWidth.set(T.width*.5,0,0),E.halfHeight.set(0,T.height*.5,0),E.halfWidth.applyMatrix4(s),E.halfHeight.applyMatrix4(s),v++}else if(T.isPointLight){const E=i.point[u];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(f),u++}else if(T.isHemisphereLight){const E=i.hemi[M];E.direction.setFromMatrixPosition(T.matrixWorld),E.direction.transformDirection(f),M++}}}return{setup:o,setupView:l,state:i}}function Go(n){const e=new _m(n),t=[],i=[],r=[];function a(u){p.camera=u,t.length=0,i.length=0,r.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function l(u){r.push(u)}function c(){e.setup(t)}function d(u){e.setupView(t,u)}const p={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:p,setupLights:c,setupLightsView:d,pushLight:s,pushShadow:o,pushLightProbeGrid:l}}function vm(n){let e=new WeakMap;function t(r,a=0){const s=e.get(r);let o;return s===void 0?(o=new Go(n),e.set(r,[o])):a>=s.length?(o=new Go(n),s.push(o)):o=s[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const xm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Sm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Mm=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],ym=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],Ho=new pt,Li=new B,xa=new B;function bm(n,e,t){let i=new Rl;const r=new Ye,a=new Ye,s=new ht,o=new Fu,l=new Ou,c={},d=t.maxTextureSize,p={[Fn]:Pt,[Pt]:Fn,[_n]:_n},u=new $t({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ye},radius:{value:4}},vertexShader:xm,fragmentShader:Sm}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const v=new En;v.setAttribute("position",new on(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new cn(v,u),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sr;let h=this.type;this.render=function(b,L,x){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||b.length===0)return;this.type===uc&&(Ae("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Sr);const A=n.getRenderTarget(),U=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),z=n.state;z.setBlending(xn),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const W=h!==this.type;W&&L.traverse(function(q){q.material&&(Array.isArray(q.material)?q.material.forEach(I=>I.needsUpdate=!0):q.material.needsUpdate=!0)});for(let q=0,I=b.length;q<I;q++){const G=b[q],H=G.shadow;if(H===void 0){Ae("WebGLShadowMap:",G,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const J=H.getFrameExtents();r.multiply(J),a.copy(H.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(a.x=Math.floor(d/J.x),r.x=a.x*J.x,H.mapSize.x=a.x),r.y>d&&(a.y=Math.floor(d/J.y),r.y=a.y*J.y,H.mapSize.y=a.y));const Q=n.state.buffers.depth.getReversed();if(H.camera._reversedDepth=Q,H.map===null||W===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Di){if(G.isPointLight){Ae("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new sn(r.x,r.y,{format:Kn,type:yn,minFilter:At,magFilter:At,generateMipmaps:!1}),H.map.texture.name=G.name+".shadowMap",H.map.depthTexture=new Mi(r.x,r.y,nn),H.map.depthTexture.name=G.name+".shadowMapDepth",H.map.depthTexture.format=bn,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Mt,H.map.depthTexture.magFilter=Mt}else G.isPointLight?(H.map=new Fl(r.x),H.map.depthTexture=new Pu(r.x,ln)):(H.map=new sn(r.x,r.y),H.map.depthTexture=new Mi(r.x,r.y,ln)),H.map.depthTexture.name=G.name+".shadowMap",H.map.depthTexture.format=bn,this.type===Sr?(H.map.depthTexture.compareFunction=Q?As:Ts,H.map.depthTexture.minFilter=At,H.map.depthTexture.magFilter=At):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Mt,H.map.depthTexture.magFilter=Mt);H.camera.updateProjectionMatrix()}const ce=H.map.isWebGLCubeRenderTarget?6:1;for(let ve=0;ve<ce;ve++){if(H.map.isWebGLCubeRenderTarget)n.setRenderTarget(H.map,ve),n.clear();else{ve===0&&(n.setRenderTarget(H.map),n.clear());const ye=H.getViewport(ve);s.set(a.x*ye.x,a.y*ye.y,a.x*ye.z,a.y*ye.w),z.viewport(s)}if(G.isPointLight){const ye=H.camera,He=H.matrix,$e=G.distance||ye.far;$e!==ye.far&&(ye.far=$e,ye.updateProjectionMatrix()),Li.setFromMatrixPosition(G.matrixWorld),ye.position.copy(Li),xa.copy(ye.position),xa.add(Mm[ve]),ye.up.copy(ym[ve]),ye.lookAt(xa),ye.updateMatrixWorld(),He.makeTranslation(-Li.x,-Li.y,-Li.z),Ho.multiplyMatrices(ye.projectionMatrix,ye.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Ho,ye.coordinateSystem,ye.reversedDepth)}else H.updateMatrices(G);i=H.getFrustum(),E(L,x,H.camera,G,this.type)}H.isPointLightShadow!==!0&&this.type===Di&&y(H,x),H.needsUpdate=!1}h=this.type,f.needsUpdate=!1,n.setRenderTarget(A,U,R)};function y(b,L){const x=e.update(M);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new sn(r.x,r.y,{format:Kn,type:yn})),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(L,null,x,u,M,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(L,null,x,m,M,null)}function T(b,L,x,A){let U=null;const R=x.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)U=R;else if(U=x.isPointLight===!0?l:o,n.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){const z=U.uuid,W=L.uuid;let q=c[z];q===void 0&&(q={},c[z]=q);let I=q[W];I===void 0&&(I=U.clone(),q[W]=I,L.addEventListener("dispose",P)),U=I}if(U.visible=L.visible,U.wireframe=L.wireframe,A===Di?U.side=L.shadowSide!==null?L.shadowSide:L.side:U.side=L.shadowSide!==null?L.shadowSide:p[L.side],U.alphaMap=L.alphaMap,U.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,U.map=L.map,U.clipShadows=L.clipShadows,U.clippingPlanes=L.clippingPlanes,U.clipIntersection=L.clipIntersection,U.displacementMap=L.displacementMap,U.displacementScale=L.displacementScale,U.displacementBias=L.displacementBias,U.wireframeLinewidth=L.wireframeLinewidth,U.linewidth=L.linewidth,x.isPointLight===!0&&U.isMeshDistanceMaterial===!0){const z=n.properties.get(U);z.light=x}return U}function E(b,L,x,A,U){if(b.visible===!1)return;if(b.layers.test(L.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&U===Di)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,b.matrixWorld);const W=e.update(b),q=b.material;if(Array.isArray(q)){const I=W.groups;for(let G=0,H=I.length;G<H;G++){const J=I[G],Q=q[J.materialIndex];if(Q&&Q.visible){const ce=T(b,Q,A,U);b.onBeforeShadow(n,b,L,x,W,ce,J),n.renderBufferDirect(x,null,W,ce,b,J),b.onAfterShadow(n,b,L,x,W,ce,J)}}}else if(q.visible){const I=T(b,q,A,U);b.onBeforeShadow(n,b,L,x,W,I,null),n.renderBufferDirect(x,null,W,I,b,null),b.onAfterShadow(n,b,L,x,W,I,null)}}const z=b.children;for(let W=0,q=z.length;W<q;W++)E(z[W],L,x,A,U)}function P(b){b.target.removeEventListener("dispose",P);for(const x in c){const A=c[x],U=b.target.uuid;U in A&&(A[U].dispose(),delete A[U])}}}function Em(n,e){function t(){let w=!1;const ne=new ht;let X=null;const pe=new ht(0,0,0,0);return{setMask:function(ae){X!==ae&&!w&&(n.colorMask(ae,ae,ae,ae),X=ae)},setLocked:function(ae){w=ae},setClear:function(ae,Z,Se,Pe,ct){ct===!0&&(ae*=Pe,Z*=Pe,Se*=Pe),ne.set(ae,Z,Se,Pe),pe.equals(ne)===!1&&(n.clearColor(ae,Z,Se,Pe),pe.copy(ne))},reset:function(){w=!1,X=null,pe.set(-1,0,0,0)}}}function i(){let w=!1,ne=!1,X=null,pe=null,ae=null;return{setReversed:function(Z){if(ne!==Z){const Se=e.get("EXT_clip_control");Z?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),ne=Z;const Pe=ae;ae=null,this.setClear(Pe)}},getReversed:function(){return ne},setTest:function(Z){Z?ie(n.DEPTH_TEST):Ee(n.DEPTH_TEST)},setMask:function(Z){X!==Z&&!w&&(n.depthMask(Z),X=Z)},setFunc:function(Z){if(ne&&(Z=Vc[Z]),pe!==Z){switch(Z){case Ta:n.depthFunc(n.NEVER);break;case Aa:n.depthFunc(n.ALWAYS);break;case wa:n.depthFunc(n.LESS);break;case xi:n.depthFunc(n.LEQUAL);break;case Ra:n.depthFunc(n.EQUAL);break;case Ca:n.depthFunc(n.GEQUAL);break;case Pa:n.depthFunc(n.GREATER);break;case La:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}pe=Z}},setLocked:function(Z){w=Z},setClear:function(Z){ae!==Z&&(ae=Z,ne&&(Z=1-Z),n.clearDepth(Z))},reset:function(){w=!1,X=null,pe=null,ae=null,ne=!1}}}function r(){let w=!1,ne=null,X=null,pe=null,ae=null,Z=null,Se=null,Pe=null,ct=null;return{setTest:function(Ze){w||(Ze?ie(n.STENCIL_TEST):Ee(n.STENCIL_TEST))},setMask:function(Ze){ne!==Ze&&!w&&(n.stencilMask(Ze),ne=Ze)},setFunc:function(Ze,un,Kt){(X!==Ze||pe!==un||ae!==Kt)&&(n.stencilFunc(Ze,un,Kt),X=Ze,pe=un,ae=Kt)},setOp:function(Ze,un,Kt){(Z!==Ze||Se!==un||Pe!==Kt)&&(n.stencilOp(Ze,un,Kt),Z=Ze,Se=un,Pe=Kt)},setLocked:function(Ze){w=Ze},setClear:function(Ze){ct!==Ze&&(n.clearStencil(Ze),ct=Ze)},reset:function(){w=!1,ne=null,X=null,pe=null,ae=null,Z=null,Se=null,Pe=null,ct=null}}}const a=new t,s=new i,o=new r,l=new WeakMap,c=new WeakMap;let d={},p={},u={},m=new WeakMap,v=[],M=null,f=!1,h=null,y=null,T=null,E=null,P=null,b=null,L=null,x=new Je(0,0,0),A=0,U=!1,R=null,z=null,W=null,q=null,I=null;const G=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,J=0;const Q=n.getParameter(n.VERSION);Q.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(Q)[1]),H=J>=1):Q.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),H=J>=2);let ce=null,ve={};const ye=n.getParameter(n.SCISSOR_BOX),He=n.getParameter(n.VIEWPORT),$e=new ht().fromArray(ye),De=new ht().fromArray(He);function K(w,ne,X,pe){const ae=new Uint8Array(4),Z=n.createTexture();n.bindTexture(w,Z),n.texParameteri(w,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(w,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Se=0;Se<X;Se++)w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY?n.texImage3D(ne,0,n.RGBA,1,1,pe,0,n.RGBA,n.UNSIGNED_BYTE,ae):n.texImage2D(ne+Se,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ae);return Z}const he={};he[n.TEXTURE_2D]=K(n.TEXTURE_2D,n.TEXTURE_2D,1),he[n.TEXTURE_CUBE_MAP]=K(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),he[n.TEXTURE_2D_ARRAY]=K(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),he[n.TEXTURE_3D]=K(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),s.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),s.setFunc(xi),mt(!1),at(Ws),ie(n.CULL_FACE),it(xn);function ie(w){d[w]!==!0&&(n.enable(w),d[w]=!0)}function Ee(w){d[w]!==!1&&(n.disable(w),d[w]=!1)}function Re(w,ne){return u[w]!==ne?(n.bindFramebuffer(w,ne),u[w]=ne,w===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ne),w===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ne),!0):!1}function Te(w,ne){let X=v,pe=!1;if(w){X=m.get(ne),X===void 0&&(X=[],m.set(ne,X));const ae=w.textures;if(X.length!==ae.length||X[0]!==n.COLOR_ATTACHMENT0){for(let Z=0,Se=ae.length;Z<Se;Z++)X[Z]=n.COLOR_ATTACHMENT0+Z;X.length=ae.length,pe=!0}}else X[0]!==n.BACK&&(X[0]=n.BACK,pe=!0);pe&&n.drawBuffers(X)}function rt(w){return M!==w?(n.useProgram(w),M=w,!0):!1}const Oe={[Vn]:n.FUNC_ADD,[hc]:n.FUNC_SUBTRACT,[fc]:n.FUNC_REVERSE_SUBTRACT};Oe[pc]=n.MIN,Oe[mc]=n.MAX;const Ke={[gc]:n.ZERO,[_c]:n.ONE,[vc]:n.SRC_COLOR,[ba]:n.SRC_ALPHA,[Ec]:n.SRC_ALPHA_SATURATE,[yc]:n.DST_COLOR,[Sc]:n.DST_ALPHA,[xc]:n.ONE_MINUS_SRC_COLOR,[Ea]:n.ONE_MINUS_SRC_ALPHA,[bc]:n.ONE_MINUS_DST_COLOR,[Mc]:n.ONE_MINUS_DST_ALPHA,[Tc]:n.CONSTANT_COLOR,[Ac]:n.ONE_MINUS_CONSTANT_COLOR,[wc]:n.CONSTANT_ALPHA,[Rc]:n.ONE_MINUS_CONSTANT_ALPHA};function it(w,ne,X,pe,ae,Z,Se,Pe,ct,Ze){if(w===xn){f===!0&&(Ee(n.BLEND),f=!1);return}if(f===!1&&(ie(n.BLEND),f=!0),w!==dc){if(w!==h||Ze!==U){if((y!==Vn||P!==Vn)&&(n.blendEquation(n.FUNC_ADD),y=Vn,P=Vn),Ze)switch(w){case gi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xs:n.blendFunc(n.ONE,n.ONE);break;case qs:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ys:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:We("WebGLState: Invalid blending: ",w);break}else switch(w){case gi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case qs:We("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ys:We("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:We("WebGLState: Invalid blending: ",w);break}T=null,E=null,b=null,L=null,x.set(0,0,0),A=0,h=w,U=Ze}return}ae=ae||ne,Z=Z||X,Se=Se||pe,(ne!==y||ae!==P)&&(n.blendEquationSeparate(Oe[ne],Oe[ae]),y=ne,P=ae),(X!==T||pe!==E||Z!==b||Se!==L)&&(n.blendFuncSeparate(Ke[X],Ke[pe],Ke[Z],Ke[Se]),T=X,E=pe,b=Z,L=Se),(Pe.equals(x)===!1||ct!==A)&&(n.blendColor(Pe.r,Pe.g,Pe.b,ct),x.copy(Pe),A=ct),h=w,U=!1}function Fe(w,ne){w.side===_n?Ee(n.CULL_FACE):ie(n.CULL_FACE);let X=w.side===Pt;ne&&(X=!X),mt(X),w.blending===gi&&w.transparent===!1?it(xn):it(w.blending,w.blendEquation,w.blendSrc,w.blendDst,w.blendEquationAlpha,w.blendSrcAlpha,w.blendDstAlpha,w.blendColor,w.blendAlpha,w.premultipliedAlpha),s.setFunc(w.depthFunc),s.setTest(w.depthTest),s.setMask(w.depthWrite),a.setMask(w.colorWrite);const pe=w.stencilWrite;o.setTest(pe),pe&&(o.setMask(w.stencilWriteMask),o.setFunc(w.stencilFunc,w.stencilRef,w.stencilFuncMask),o.setOp(w.stencilFail,w.stencilZFail,w.stencilZPass)),C(w.polygonOffset,w.polygonOffsetFactor,w.polygonOffsetUnits),w.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):Ee(n.SAMPLE_ALPHA_TO_COVERAGE)}function mt(w){R!==w&&(w?n.frontFace(n.CW):n.frontFace(n.CCW),R=w)}function at(w){w!==lc?(ie(n.CULL_FACE),w!==z&&(w===Ws?n.cullFace(n.BACK):w===cc?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ee(n.CULL_FACE),z=w}function Lt(w){w!==W&&(H&&n.lineWidth(w),W=w)}function C(w,ne,X){w?(ie(n.POLYGON_OFFSET_FILL),(q!==ne||I!==X)&&(q=ne,I=X,s.getReversed()&&(ne=-ne),n.polygonOffset(ne,X))):Ee(n.POLYGON_OFFSET_FILL)}function gt(w){w?ie(n.SCISSOR_TEST):Ee(n.SCISSOR_TEST)}function Be(w){w===void 0&&(w=n.TEXTURE0+G-1),ce!==w&&(n.activeTexture(w),ce=w)}function tt(w,ne,X){X===void 0&&(ce===null?X=n.TEXTURE0+G-1:X=ce);let pe=ve[X];pe===void 0&&(pe={type:void 0,texture:void 0},ve[X]=pe),(pe.type!==w||pe.texture!==ne)&&(ce!==X&&(n.activeTexture(X),ce=X),n.bindTexture(w,ne||he[w]),pe.type=w,pe.texture=ne)}function oe(){const w=ve[ce];w!==void 0&&w.type!==void 0&&(n.bindTexture(w.type,null),w.type=void 0,w.texture=void 0)}function st(){try{n.compressedTexImage2D(...arguments)}catch(w){We("WebGLState:",w)}}function S(){try{n.compressedTexImage3D(...arguments)}catch(w){We("WebGLState:",w)}}function g(){try{n.texSubImage2D(...arguments)}catch(w){We("WebGLState:",w)}}function N(){try{n.texSubImage3D(...arguments)}catch(w){We("WebGLState:",w)}}function Y(){try{n.compressedTexSubImage2D(...arguments)}catch(w){We("WebGLState:",w)}}function j(){try{n.compressedTexSubImage3D(...arguments)}catch(w){We("WebGLState:",w)}}function ee(){try{n.texStorage2D(...arguments)}catch(w){We("WebGLState:",w)}}function se(){try{n.texStorage3D(...arguments)}catch(w){We("WebGLState:",w)}}function V(){try{n.texImage2D(...arguments)}catch(w){We("WebGLState:",w)}}function $(){try{n.texImage3D(...arguments)}catch(w){We("WebGLState:",w)}}function fe(w){return p[w]!==void 0?p[w]:n.getParameter(w)}function ge(w,ne){p[w]!==ne&&(n.pixelStorei(w,ne),p[w]=ne)}function re(w){$e.equals(w)===!1&&(n.scissor(w.x,w.y,w.z,w.w),$e.copy(w))}function te(w){De.equals(w)===!1&&(n.viewport(w.x,w.y,w.z,w.w),De.copy(w))}function we(w,ne){let X=c.get(ne);X===void 0&&(X=new WeakMap,c.set(ne,X));let pe=X.get(w);pe===void 0&&(pe=n.getUniformBlockIndex(ne,w.name),X.set(w,pe))}function Ie(w,ne){const pe=c.get(ne).get(w);l.get(ne)!==pe&&(n.uniformBlockBinding(ne,pe,w.__bindingPointIndex),l.set(ne,pe))}function Xe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),s.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),d={},p={},ce=null,ve={},u={},m=new WeakMap,v=[],M=null,f=!1,h=null,y=null,T=null,E=null,P=null,b=null,L=null,x=new Je(0,0,0),A=0,U=!1,R=null,z=null,W=null,q=null,I=null,$e.set(0,0,n.canvas.width,n.canvas.height),De.set(0,0,n.canvas.width,n.canvas.height),a.reset(),s.reset(),o.reset()}return{buffers:{color:a,depth:s,stencil:o},enable:ie,disable:Ee,bindFramebuffer:Re,drawBuffers:Te,useProgram:rt,setBlending:it,setMaterial:Fe,setFlipSided:mt,setCullFace:at,setLineWidth:Lt,setPolygonOffset:C,setScissorTest:gt,activeTexture:Be,bindTexture:tt,unbindTexture:oe,compressedTexImage2D:st,compressedTexImage3D:S,texImage2D:V,texImage3D:$,pixelStorei:ge,getParameter:fe,updateUBOMapping:we,uniformBlockBinding:Ie,texStorage2D:ee,texStorage3D:se,texSubImage2D:g,texSubImage3D:N,compressedTexSubImage2D:Y,compressedTexSubImage3D:j,scissor:re,viewport:te,reset:Xe}}function Tm(n,e,t,i,r,a,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ye,d=new WeakMap,p=new Set;let u;const m=new WeakMap;let v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(S,g){return v?new OffscreenCanvas(S,g):Lr("canvas")}function f(S,g,N){let Y=1;const j=st(S);if((j.width>N||j.height>N)&&(Y=N/Math.max(j.width,j.height)),Y<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){const ee=Math.floor(Y*j.width),se=Math.floor(Y*j.height);u===void 0&&(u=M(ee,se));const V=g?M(ee,se):u;return V.width=ee,V.height=se,V.getContext("2d").drawImage(S,0,0,ee,se),Ae("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+ee+"x"+se+")."),V}else return"data"in S&&Ae("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),S;return S}function h(S){return S.generateMipmaps}function y(S){n.generateMipmap(S)}function T(S){return S.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?n.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function E(S,g,N,Y,j,ee=!1){if(S!==null){if(n[S]!==void 0)return n[S];Ae("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let se;Y&&(se=e.get("EXT_texture_norm16"),se||Ae("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let V=g;if(g===n.RED&&(N===n.FLOAT&&(V=n.R32F),N===n.HALF_FLOAT&&(V=n.R16F),N===n.UNSIGNED_BYTE&&(V=n.R8),N===n.UNSIGNED_SHORT&&se&&(V=se.R16_EXT),N===n.SHORT&&se&&(V=se.R16_SNORM_EXT)),g===n.RED_INTEGER&&(N===n.UNSIGNED_BYTE&&(V=n.R8UI),N===n.UNSIGNED_SHORT&&(V=n.R16UI),N===n.UNSIGNED_INT&&(V=n.R32UI),N===n.BYTE&&(V=n.R8I),N===n.SHORT&&(V=n.R16I),N===n.INT&&(V=n.R32I)),g===n.RG&&(N===n.FLOAT&&(V=n.RG32F),N===n.HALF_FLOAT&&(V=n.RG16F),N===n.UNSIGNED_BYTE&&(V=n.RG8),N===n.UNSIGNED_SHORT&&se&&(V=se.RG16_EXT),N===n.SHORT&&se&&(V=se.RG16_SNORM_EXT)),g===n.RG_INTEGER&&(N===n.UNSIGNED_BYTE&&(V=n.RG8UI),N===n.UNSIGNED_SHORT&&(V=n.RG16UI),N===n.UNSIGNED_INT&&(V=n.RG32UI),N===n.BYTE&&(V=n.RG8I),N===n.SHORT&&(V=n.RG16I),N===n.INT&&(V=n.RG32I)),g===n.RGB_INTEGER&&(N===n.UNSIGNED_BYTE&&(V=n.RGB8UI),N===n.UNSIGNED_SHORT&&(V=n.RGB16UI),N===n.UNSIGNED_INT&&(V=n.RGB32UI),N===n.BYTE&&(V=n.RGB8I),N===n.SHORT&&(V=n.RGB16I),N===n.INT&&(V=n.RGB32I)),g===n.RGBA_INTEGER&&(N===n.UNSIGNED_BYTE&&(V=n.RGBA8UI),N===n.UNSIGNED_SHORT&&(V=n.RGBA16UI),N===n.UNSIGNED_INT&&(V=n.RGBA32UI),N===n.BYTE&&(V=n.RGBA8I),N===n.SHORT&&(V=n.RGBA16I),N===n.INT&&(V=n.RGBA32I)),g===n.RGB&&(N===n.UNSIGNED_SHORT&&se&&(V=se.RGB16_EXT),N===n.SHORT&&se&&(V=se.RGB16_SNORM_EXT),N===n.UNSIGNED_INT_5_9_9_9_REV&&(V=n.RGB9_E5),N===n.UNSIGNED_INT_10F_11F_11F_REV&&(V=n.R11F_G11F_B10F)),g===n.RGBA){const $=ee?Cr:Ge.getTransfer(j);N===n.FLOAT&&(V=n.RGBA32F),N===n.HALF_FLOAT&&(V=n.RGBA16F),N===n.UNSIGNED_BYTE&&(V=$===qe?n.SRGB8_ALPHA8:n.RGBA8),N===n.UNSIGNED_SHORT&&se&&(V=se.RGBA16_EXT),N===n.SHORT&&se&&(V=se.RGBA16_SNORM_EXT),N===n.UNSIGNED_SHORT_4_4_4_4&&(V=n.RGBA4),N===n.UNSIGNED_SHORT_5_5_5_1&&(V=n.RGB5_A1)}return(V===n.R16F||V===n.R32F||V===n.RG16F||V===n.RG32F||V===n.RGBA16F||V===n.RGBA32F)&&e.get("EXT_color_buffer_float"),V}function P(S,g){let N;return S?g===null||g===ln||g===ki?N=n.DEPTH24_STENCIL8:g===nn?N=n.DEPTH32F_STENCIL8:g===zi&&(N=n.DEPTH24_STENCIL8,Ae("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===ln||g===ki?N=n.DEPTH_COMPONENT24:g===nn?N=n.DEPTH_COMPONENT32F:g===zi&&(N=n.DEPTH_COMPONENT16),N}function b(S,g){return h(S)===!0||S.isFramebufferTexture&&S.minFilter!==Mt&&S.minFilter!==At?Math.log2(Math.max(g.width,g.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?g.mipmaps.length:1}function L(S){const g=S.target;g.removeEventListener("dispose",L),A(g),g.isVideoTexture&&d.delete(g),g.isHTMLTexture&&p.delete(g)}function x(S){const g=S.target;g.removeEventListener("dispose",x),R(g)}function A(S){const g=i.get(S);if(g.__webglInit===void 0)return;const N=S.source,Y=m.get(N);if(Y){const j=Y[g.__cacheKey];j.usedTimes--,j.usedTimes===0&&U(S),Object.keys(Y).length===0&&m.delete(N)}i.remove(S)}function U(S){const g=i.get(S);n.deleteTexture(g.__webglTexture);const N=S.source,Y=m.get(N);delete Y[g.__cacheKey],s.memory.textures--}function R(S){const g=i.get(S);if(S.depthTexture&&(S.depthTexture.dispose(),i.remove(S.depthTexture)),S.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(g.__webglFramebuffer[Y]))for(let j=0;j<g.__webglFramebuffer[Y].length;j++)n.deleteFramebuffer(g.__webglFramebuffer[Y][j]);else n.deleteFramebuffer(g.__webglFramebuffer[Y]);g.__webglDepthbuffer&&n.deleteRenderbuffer(g.__webglDepthbuffer[Y])}else{if(Array.isArray(g.__webglFramebuffer))for(let Y=0;Y<g.__webglFramebuffer.length;Y++)n.deleteFramebuffer(g.__webglFramebuffer[Y]);else n.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&n.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&n.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let Y=0;Y<g.__webglColorRenderbuffer.length;Y++)g.__webglColorRenderbuffer[Y]&&n.deleteRenderbuffer(g.__webglColorRenderbuffer[Y]);g.__webglDepthRenderbuffer&&n.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const N=S.textures;for(let Y=0,j=N.length;Y<j;Y++){const ee=i.get(N[Y]);ee.__webglTexture&&(n.deleteTexture(ee.__webglTexture),s.memory.textures--),i.remove(N[Y])}i.remove(S)}let z=0;function W(){z=0}function q(){return z}function I(S){z=S}function G(){const S=z;return S>=r.maxTextures&&Ae("WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+r.maxTextures),z+=1,S}function H(S){const g=[];return g.push(S.wrapS),g.push(S.wrapT),g.push(S.wrapR||0),g.push(S.magFilter),g.push(S.minFilter),g.push(S.anisotropy),g.push(S.internalFormat),g.push(S.format),g.push(S.type),g.push(S.generateMipmaps),g.push(S.premultiplyAlpha),g.push(S.flipY),g.push(S.unpackAlignment),g.push(S.colorSpace),g.join()}function J(S,g){const N=i.get(S);if(S.isVideoTexture&&tt(S),S.isRenderTargetTexture===!1&&S.isExternalTexture!==!0&&S.version>0&&N.__version!==S.version){const Y=S.image;if(Y===null)Ae("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Ae("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(N,S,g);return}}else S.isExternalTexture&&(N.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,N.__webglTexture,n.TEXTURE0+g)}function Q(S,g){const N=i.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&N.__version!==S.version){Ee(N,S,g);return}else S.isExternalTexture&&(N.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,N.__webglTexture,n.TEXTURE0+g)}function ce(S,g){const N=i.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&N.__version!==S.version){Ee(N,S,g);return}t.bindTexture(n.TEXTURE_3D,N.__webglTexture,n.TEXTURE0+g)}function ve(S,g){const N=i.get(S);if(S.isCubeDepthTexture!==!0&&S.version>0&&N.__version!==S.version){Re(N,S,g);return}t.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+g)}const ye={[Da]:n.REPEAT,[vn]:n.CLAMP_TO_EDGE,[Ia]:n.MIRRORED_REPEAT},He={[Mt]:n.NEAREST,[Lc]:n.NEAREST_MIPMAP_NEAREST,[$i]:n.NEAREST_MIPMAP_LINEAR,[At]:n.LINEAR,[Wr]:n.LINEAR_MIPMAP_NEAREST,[Xn]:n.LINEAR_MIPMAP_LINEAR},$e={[Uc]:n.NEVER,[zc]:n.ALWAYS,[Nc]:n.LESS,[Ts]:n.LEQUAL,[Fc]:n.EQUAL,[As]:n.GEQUAL,[Oc]:n.GREATER,[Bc]:n.NOTEQUAL};function De(S,g){if(g.type===nn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===At||g.magFilter===Wr||g.magFilter===$i||g.magFilter===Xn||g.minFilter===At||g.minFilter===Wr||g.minFilter===$i||g.minFilter===Xn)&&Ae("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(S,n.TEXTURE_WRAP_S,ye[g.wrapS]),n.texParameteri(S,n.TEXTURE_WRAP_T,ye[g.wrapT]),(S===n.TEXTURE_3D||S===n.TEXTURE_2D_ARRAY)&&n.texParameteri(S,n.TEXTURE_WRAP_R,ye[g.wrapR]),n.texParameteri(S,n.TEXTURE_MAG_FILTER,He[g.magFilter]),n.texParameteri(S,n.TEXTURE_MIN_FILTER,He[g.minFilter]),g.compareFunction&&(n.texParameteri(S,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(S,n.TEXTURE_COMPARE_FUNC,$e[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===Mt||g.minFilter!==$i&&g.minFilter!==Xn||g.type===nn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||i.get(g).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");n.texParameterf(S,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,r.getMaxAnisotropy())),i.get(g).__currentAnisotropy=g.anisotropy}}}function K(S,g){let N=!1;S.__webglInit===void 0&&(S.__webglInit=!0,g.addEventListener("dispose",L));const Y=g.source;let j=m.get(Y);j===void 0&&(j={},m.set(Y,j));const ee=H(g);if(ee!==S.__cacheKey){j[ee]===void 0&&(j[ee]={texture:n.createTexture(),usedTimes:0},s.memory.textures++,N=!0),j[ee].usedTimes++;const se=j[S.__cacheKey];se!==void 0&&(j[S.__cacheKey].usedTimes--,se.usedTimes===0&&U(g)),S.__cacheKey=ee,S.__webglTexture=j[ee].texture}return N}function he(S,g,N){return Math.floor(Math.floor(S/N)/g)}function ie(S,g,N,Y){const ee=S.updateRanges;if(ee.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,g.width,g.height,N,Y,g.data);else{ee.sort((ge,re)=>ge.start-re.start);let se=0;for(let ge=1;ge<ee.length;ge++){const re=ee[se],te=ee[ge],we=re.start+re.count,Ie=he(te.start,g.width,4),Xe=he(re.start,g.width,4);te.start<=we+1&&Ie===Xe&&he(te.start+te.count-1,g.width,4)===Ie?re.count=Math.max(re.count,te.start+te.count-re.start):(++se,ee[se]=te)}ee.length=se+1;const V=t.getParameter(n.UNPACK_ROW_LENGTH),$=t.getParameter(n.UNPACK_SKIP_PIXELS),fe=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,g.width);for(let ge=0,re=ee.length;ge<re;ge++){const te=ee[ge],we=Math.floor(te.start/4),Ie=Math.ceil(te.count/4),Xe=we%g.width,w=Math.floor(we/g.width),ne=Ie,X=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Xe),t.pixelStorei(n.UNPACK_SKIP_ROWS,w),t.texSubImage2D(n.TEXTURE_2D,0,Xe,w,ne,X,N,Y,g.data)}S.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,V),t.pixelStorei(n.UNPACK_SKIP_PIXELS,$),t.pixelStorei(n.UNPACK_SKIP_ROWS,fe)}}function Ee(S,g,N){let Y=n.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(Y=n.TEXTURE_2D_ARRAY),g.isData3DTexture&&(Y=n.TEXTURE_3D);const j=K(S,g),ee=g.source;t.bindTexture(Y,S.__webglTexture,n.TEXTURE0+N);const se=i.get(ee);if(ee.version!==se.__version||j===!0){if(t.activeTexture(n.TEXTURE0+N),(typeof ImageBitmap<"u"&&g.image instanceof ImageBitmap)===!1){const X=Ge.getPrimaries(Ge.workingColorSpace),pe=g.colorSpace===Un?null:Ge.getPrimaries(g.colorSpace),ae=g.colorSpace===Un||X===pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,g.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae)}t.pixelStorei(n.UNPACK_ALIGNMENT,g.unpackAlignment);let $=f(g.image,!1,r.maxTextureSize);$=oe(g,$);const fe=a.convert(g.format,g.colorSpace),ge=a.convert(g.type);let re=E(g.internalFormat,fe,ge,g.normalized,g.colorSpace,g.isVideoTexture);De(Y,g);let te;const we=g.mipmaps,Ie=g.isVideoTexture!==!0,Xe=se.__version===void 0||j===!0,w=ee.dataReady,ne=b(g,$);if(g.isDepthTexture)re=P(g.format===qn,g.type),Xe&&(Ie?t.texStorage2D(n.TEXTURE_2D,1,re,$.width,$.height):t.texImage2D(n.TEXTURE_2D,0,re,$.width,$.height,0,fe,ge,null));else if(g.isDataTexture)if(we.length>0){Ie&&Xe&&t.texStorage2D(n.TEXTURE_2D,ne,re,we[0].width,we[0].height);for(let X=0,pe=we.length;X<pe;X++)te=we[X],Ie?w&&t.texSubImage2D(n.TEXTURE_2D,X,0,0,te.width,te.height,fe,ge,te.data):t.texImage2D(n.TEXTURE_2D,X,re,te.width,te.height,0,fe,ge,te.data);g.generateMipmaps=!1}else Ie?(Xe&&t.texStorage2D(n.TEXTURE_2D,ne,re,$.width,$.height),w&&ie(g,$,fe,ge)):t.texImage2D(n.TEXTURE_2D,0,re,$.width,$.height,0,fe,ge,$.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Ie&&Xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ne,re,we[0].width,we[0].height,$.depth);for(let X=0,pe=we.length;X<pe;X++)if(te=we[X],g.format!==Yt)if(fe!==null)if(Ie){if(w)if(g.layerUpdates.size>0){const ae=xo(te.width,te.height,g.format,g.type);for(const Z of g.layerUpdates){const Se=te.data.subarray(Z*ae/te.data.BYTES_PER_ELEMENT,(Z+1)*ae/te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,Z,te.width,te.height,1,fe,Se)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,te.width,te.height,$.depth,fe,te.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,X,re,te.width,te.height,$.depth,0,te.data,0,0);else Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?w&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,te.width,te.height,$.depth,fe,ge,te.data):t.texImage3D(n.TEXTURE_2D_ARRAY,X,re,te.width,te.height,$.depth,0,fe,ge,te.data)}else{Ie&&Xe&&t.texStorage2D(n.TEXTURE_2D,ne,re,we[0].width,we[0].height);for(let X=0,pe=we.length;X<pe;X++)te=we[X],g.format!==Yt?fe!==null?Ie?w&&t.compressedTexSubImage2D(n.TEXTURE_2D,X,0,0,te.width,te.height,fe,te.data):t.compressedTexImage2D(n.TEXTURE_2D,X,re,te.width,te.height,0,te.data):Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?w&&t.texSubImage2D(n.TEXTURE_2D,X,0,0,te.width,te.height,fe,ge,te.data):t.texImage2D(n.TEXTURE_2D,X,re,te.width,te.height,0,fe,ge,te.data)}else if(g.isDataArrayTexture)if(Ie){if(Xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ne,re,$.width,$.height,$.depth),w)if(g.layerUpdates.size>0){const X=xo($.width,$.height,g.format,g.type);for(const pe of g.layerUpdates){const ae=$.data.subarray(pe*X/$.data.BYTES_PER_ELEMENT,(pe+1)*X/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,pe,$.width,$.height,1,fe,ge,ae)}g.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,fe,ge,$.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,re,$.width,$.height,$.depth,0,fe,ge,$.data);else if(g.isData3DTexture)Ie?(Xe&&t.texStorage3D(n.TEXTURE_3D,ne,re,$.width,$.height,$.depth),w&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,fe,ge,$.data)):t.texImage3D(n.TEXTURE_3D,0,re,$.width,$.height,$.depth,0,fe,ge,$.data);else if(g.isFramebufferTexture){if(Xe)if(Ie)t.texStorage2D(n.TEXTURE_2D,ne,re,$.width,$.height);else{let X=$.width,pe=$.height;for(let ae=0;ae<ne;ae++)t.texImage2D(n.TEXTURE_2D,ae,re,X,pe,0,fe,ge,null),X>>=1,pe>>=1}}else if(g.isHTMLTexture){if("texElementImage2D"in n){const X=n.canvas;if(X.hasAttribute("layoutsubtree")||X.setAttribute("layoutsubtree","true"),$.parentNode!==X){X.appendChild($),p.add(g),X.onpaint=Pe=>{const ct=Pe.changedElements;for(const Ze of p)ct.includes(Ze.image)&&(Ze.needsUpdate=!0)},X.requestPaint();return}const pe=0,ae=n.RGBA,Z=n.RGBA,Se=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,pe,ae,Z,Se,$),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(we.length>0){if(Ie&&Xe){const X=st(we[0]);t.texStorage2D(n.TEXTURE_2D,ne,re,X.width,X.height)}for(let X=0,pe=we.length;X<pe;X++)te=we[X],Ie?w&&t.texSubImage2D(n.TEXTURE_2D,X,0,0,fe,ge,te):t.texImage2D(n.TEXTURE_2D,X,re,fe,ge,te);g.generateMipmaps=!1}else if(Ie){if(Xe){const X=st($);t.texStorage2D(n.TEXTURE_2D,ne,re,X.width,X.height)}w&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,fe,ge,$)}else t.texImage2D(n.TEXTURE_2D,0,re,fe,ge,$);h(g)&&y(Y),se.__version=ee.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function Re(S,g,N){if(g.image.length!==6)return;const Y=K(S,g),j=g.source;t.bindTexture(n.TEXTURE_CUBE_MAP,S.__webglTexture,n.TEXTURE0+N);const ee=i.get(j);if(j.version!==ee.__version||Y===!0){t.activeTexture(n.TEXTURE0+N);const se=Ge.getPrimaries(Ge.workingColorSpace),V=g.colorSpace===Un?null:Ge.getPrimaries(g.colorSpace),$=g.colorSpace===Un||se===V?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,g.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,g.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,$);const fe=g.isCompressedTexture||g.image[0].isCompressedTexture,ge=g.image[0]&&g.image[0].isDataTexture,re=[];for(let Z=0;Z<6;Z++)!fe&&!ge?re[Z]=f(g.image[Z],!0,r.maxCubemapSize):re[Z]=ge?g.image[Z].image:g.image[Z],re[Z]=oe(g,re[Z]);const te=re[0],we=a.convert(g.format,g.colorSpace),Ie=a.convert(g.type),Xe=E(g.internalFormat,we,Ie,g.normalized,g.colorSpace),w=g.isVideoTexture!==!0,ne=ee.__version===void 0||Y===!0,X=j.dataReady;let pe=b(g,te);De(n.TEXTURE_CUBE_MAP,g);let ae;if(fe){w&&ne&&t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Xe,te.width,te.height);for(let Z=0;Z<6;Z++){ae=re[Z].mipmaps;for(let Se=0;Se<ae.length;Se++){const Pe=ae[Se];g.format!==Yt?we!==null?w?X&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Se,0,0,Pe.width,Pe.height,we,Pe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Se,Xe,Pe.width,Pe.height,0,Pe.data):Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):w?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Se,0,0,Pe.width,Pe.height,we,Ie,Pe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Se,Xe,Pe.width,Pe.height,0,we,Ie,Pe.data)}}}else{if(ae=g.mipmaps,w&&ne){ae.length>0&&pe++;const Z=st(re[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Xe,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(ge){w?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,re[Z].width,re[Z].height,we,Ie,re[Z].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Xe,re[Z].width,re[Z].height,0,we,Ie,re[Z].data);for(let Se=0;Se<ae.length;Se++){const ct=ae[Se].image[Z].image;w?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Se+1,0,0,ct.width,ct.height,we,Ie,ct.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Se+1,Xe,ct.width,ct.height,0,we,Ie,ct.data)}}else{w?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,we,Ie,re[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Xe,we,Ie,re[Z]);for(let Se=0;Se<ae.length;Se++){const Pe=ae[Se];w?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Se+1,0,0,we,Ie,Pe.image[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Se+1,Xe,we,Ie,Pe.image[Z])}}}h(g)&&y(n.TEXTURE_CUBE_MAP),ee.__version=j.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function Te(S,g,N,Y,j,ee){const se=a.convert(N.format,N.colorSpace),V=a.convert(N.type),$=E(N.internalFormat,se,V,N.normalized,N.colorSpace),fe=i.get(g),ge=i.get(N);if(ge.__renderTarget=g,!fe.__hasExternalTextures){const re=Math.max(1,g.width>>ee),te=Math.max(1,g.height>>ee);j===n.TEXTURE_3D||j===n.TEXTURE_2D_ARRAY?t.texImage3D(j,ee,$,re,te,g.depth,0,se,V,null):t.texImage2D(j,ee,$,re,te,0,se,V,null)}t.bindFramebuffer(n.FRAMEBUFFER,S),Be(g)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Y,j,ge.__webglTexture,0,gt(g)):(j===n.TEXTURE_2D||j>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Y,j,ge.__webglTexture,ee),t.bindFramebuffer(n.FRAMEBUFFER,null)}function rt(S,g,N){if(n.bindRenderbuffer(n.RENDERBUFFER,S),g.depthBuffer){const Y=g.depthTexture,j=Y&&Y.isDepthTexture?Y.type:null,ee=P(g.stencilBuffer,j),se=g.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Be(g)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,gt(g),ee,g.width,g.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,gt(g),ee,g.width,g.height):n.renderbufferStorage(n.RENDERBUFFER,ee,g.width,g.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,se,n.RENDERBUFFER,S)}else{const Y=g.textures;for(let j=0;j<Y.length;j++){const ee=Y[j],se=a.convert(ee.format,ee.colorSpace),V=a.convert(ee.type),$=E(ee.internalFormat,se,V,ee.normalized,ee.colorSpace);Be(g)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,gt(g),$,g.width,g.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,gt(g),$,g.width,g.height):n.renderbufferStorage(n.RENDERBUFFER,$,g.width,g.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Oe(S,g,N){const Y=g.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,S),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=i.get(g.depthTexture);if(j.__renderTarget=g,(!j.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),Y){if(j.__webglInit===void 0&&(j.__webglInit=!0,g.depthTexture.addEventListener("dispose",L)),j.__webglTexture===void 0){j.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),De(n.TEXTURE_CUBE_MAP,g.depthTexture);const fe=a.convert(g.depthTexture.format),ge=a.convert(g.depthTexture.type);let re;g.depthTexture.format===bn?re=n.DEPTH_COMPONENT24:g.depthTexture.format===qn&&(re=n.DEPTH24_STENCIL8);for(let te=0;te<6;te++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,re,g.width,g.height,0,fe,ge,null)}}else J(g.depthTexture,0);const ee=j.__webglTexture,se=gt(g),V=Y?n.TEXTURE_CUBE_MAP_POSITIVE_X+N:n.TEXTURE_2D,$=g.depthTexture.format===qn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(g.depthTexture.format===bn)Be(g)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,$,V,ee,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,$,V,ee,0);else if(g.depthTexture.format===qn)Be(g)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,$,V,ee,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,$,V,ee,0);else throw new Error("Unknown depthTexture format")}function Ke(S){const g=i.get(S),N=S.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==S.depthTexture){const Y=S.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),Y){const j=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,Y.removeEventListener("dispose",j)};Y.addEventListener("dispose",j),g.__depthDisposeCallback=j}g.__boundDepthTexture=Y}if(S.depthTexture&&!g.__autoAllocateDepthBuffer)if(N)for(let Y=0;Y<6;Y++)Oe(g.__webglFramebuffer[Y],S,Y);else{const Y=S.texture.mipmaps;Y&&Y.length>0?Oe(g.__webglFramebuffer[0],S,0):Oe(g.__webglFramebuffer,S,0)}else if(N){g.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer[Y]),g.__webglDepthbuffer[Y]===void 0)g.__webglDepthbuffer[Y]=n.createRenderbuffer(),rt(g.__webglDepthbuffer[Y],S,!1);else{const j=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=g.__webglDepthbuffer[Y];n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,ee)}}else{const Y=S.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=n.createRenderbuffer(),rt(g.__webglDepthbuffer,S,!1);else{const j=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=g.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,ee)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function it(S,g,N){const Y=i.get(S);g!==void 0&&Te(Y.__webglFramebuffer,S,S.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),N!==void 0&&Ke(S)}function Fe(S){const g=S.texture,N=i.get(S),Y=i.get(g);S.addEventListener("dispose",x);const j=S.textures,ee=S.isWebGLCubeRenderTarget===!0,se=j.length>1;if(se||(Y.__webglTexture===void 0&&(Y.__webglTexture=n.createTexture()),Y.__version=g.version,s.memory.textures++),ee){N.__webglFramebuffer=[];for(let V=0;V<6;V++)if(g.mipmaps&&g.mipmaps.length>0){N.__webglFramebuffer[V]=[];for(let $=0;$<g.mipmaps.length;$++)N.__webglFramebuffer[V][$]=n.createFramebuffer()}else N.__webglFramebuffer[V]=n.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){N.__webglFramebuffer=[];for(let V=0;V<g.mipmaps.length;V++)N.__webglFramebuffer[V]=n.createFramebuffer()}else N.__webglFramebuffer=n.createFramebuffer();if(se)for(let V=0,$=j.length;V<$;V++){const fe=i.get(j[V]);fe.__webglTexture===void 0&&(fe.__webglTexture=n.createTexture(),s.memory.textures++)}if(S.samples>0&&Be(S)===!1){N.__webglMultisampledFramebuffer=n.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let V=0;V<j.length;V++){const $=j[V];N.__webglColorRenderbuffer[V]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,N.__webglColorRenderbuffer[V]);const fe=a.convert($.format,$.colorSpace),ge=a.convert($.type),re=E($.internalFormat,fe,ge,$.normalized,$.colorSpace,S.isXRRenderTarget===!0),te=gt(S);n.renderbufferStorageMultisample(n.RENDERBUFFER,te,re,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+V,n.RENDERBUFFER,N.__webglColorRenderbuffer[V])}n.bindRenderbuffer(n.RENDERBUFFER,null),S.depthBuffer&&(N.__webglDepthRenderbuffer=n.createRenderbuffer(),rt(N.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ee){t.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture),De(n.TEXTURE_CUBE_MAP,g);for(let V=0;V<6;V++)if(g.mipmaps&&g.mipmaps.length>0)for(let $=0;$<g.mipmaps.length;$++)Te(N.__webglFramebuffer[V][$],S,g,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+V,$);else Te(N.__webglFramebuffer[V],S,g,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+V,0);h(g)&&y(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){for(let V=0,$=j.length;V<$;V++){const fe=j[V],ge=i.get(fe);let re=n.TEXTURE_2D;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(re=S.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,ge.__webglTexture),De(re,fe),Te(N.__webglFramebuffer,S,fe,n.COLOR_ATTACHMENT0+V,re,0),h(fe)&&y(re)}t.unbindTexture()}else{let V=n.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(V=S.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(V,Y.__webglTexture),De(V,g),g.mipmaps&&g.mipmaps.length>0)for(let $=0;$<g.mipmaps.length;$++)Te(N.__webglFramebuffer[$],S,g,n.COLOR_ATTACHMENT0,V,$);else Te(N.__webglFramebuffer,S,g,n.COLOR_ATTACHMENT0,V,0);h(g)&&y(V),t.unbindTexture()}S.depthBuffer&&Ke(S)}function mt(S){const g=S.textures;for(let N=0,Y=g.length;N<Y;N++){const j=g[N];if(h(j)){const ee=T(S),se=i.get(j).__webglTexture;t.bindTexture(ee,se),y(ee),t.unbindTexture()}}}const at=[],Lt=[];function C(S){if(S.samples>0){if(Be(S)===!1){const g=S.textures,N=S.width,Y=S.height;let j=n.COLOR_BUFFER_BIT;const ee=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=i.get(S),V=g.length>1;if(V)for(let fe=0;fe<g.length;fe++)t.bindFramebuffer(n.FRAMEBUFFER,se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer);const $=S.texture.mipmaps;$&&$.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,se.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let fe=0;fe<g.length;fe++){if(S.resolveDepthBuffer&&(S.depthBuffer&&(j|=n.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&(j|=n.STENCIL_BUFFER_BIT)),V){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,se.__webglColorRenderbuffer[fe]);const ge=i.get(g[fe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ge,0)}n.blitFramebuffer(0,0,N,Y,0,0,N,Y,j,n.NEAREST),l===!0&&(at.length=0,Lt.length=0,at.push(n.COLOR_ATTACHMENT0+fe),S.depthBuffer&&S.resolveDepthBuffer===!1&&(at.push(ee),Lt.push(ee),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Lt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,at))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),V)for(let fe=0;fe<g.length;fe++){t.bindFramebuffer(n.FRAMEBUFFER,se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,se.__webglColorRenderbuffer[fe]);const ge=i.get(g[fe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,ge,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.resolveDepthBuffer===!1&&l){const g=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[g])}}}function gt(S){return Math.min(r.maxSamples,S.samples)}function Be(S){const g=i.get(S);return S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function tt(S){const g=s.render.frame;d.get(S)!==g&&(d.set(S,g),S.update())}function oe(S,g){const N=S.colorSpace,Y=S.format,j=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||N!==Rr&&N!==Un&&(Ge.getTransfer(N)===qe?(Y!==Yt||j!==zt)&&Ae("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):We("WebGLTextures: Unsupported texture color space:",N)),g}function st(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(c.width=S.naturalWidth||S.width,c.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(c.width=S.displayWidth,c.height=S.displayHeight):(c.width=S.width,c.height=S.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=W,this.getTextureUnits=q,this.setTextureUnits=I,this.setTexture2D=J,this.setTexture2DArray=Q,this.setTexture3D=ce,this.setTextureCube=ve,this.rebindTextures=it,this.setupRenderTarget=Fe,this.updateRenderTargetMipmap=mt,this.updateMultisampleRenderTarget=C,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=Be,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Am(n,e){function t(i,r=Un){let a;const s=Ge.getTransfer(r);if(i===zt)return n.UNSIGNED_BYTE;if(i===Ss)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ms)return n.UNSIGNED_SHORT_5_5_5_1;if(i===gl)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===_l)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===pl)return n.BYTE;if(i===ml)return n.SHORT;if(i===zi)return n.UNSIGNED_SHORT;if(i===xs)return n.INT;if(i===ln)return n.UNSIGNED_INT;if(i===nn)return n.FLOAT;if(i===yn)return n.HALF_FLOAT;if(i===vl)return n.ALPHA;if(i===xl)return n.RGB;if(i===Yt)return n.RGBA;if(i===bn)return n.DEPTH_COMPONENT;if(i===qn)return n.DEPTH_STENCIL;if(i===Sl)return n.RED;if(i===ys)return n.RED_INTEGER;if(i===Kn)return n.RG;if(i===bs)return n.RG_INTEGER;if(i===Es)return n.RGBA_INTEGER;if(i===Mr||i===yr||i===br||i===Er)if(s===qe)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Mr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===yr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===br)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Er)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Mr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===yr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===br)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Er)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ua||i===Na||i===Fa||i===Oa)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Ua)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Na)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Fa)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Oa)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ba||i===za||i===ka||i===Ga||i===Ha||i===Ar||i===Va)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Ba||i===za)return s===qe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===ka)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ga)return a.COMPRESSED_R11_EAC;if(i===Ha)return a.COMPRESSED_SIGNED_R11_EAC;if(i===Ar)return a.COMPRESSED_RG11_EAC;if(i===Va)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Wa||i===Xa||i===qa||i===Ya||i===$a||i===Ka||i===Za||i===ja||i===Ja||i===Qa||i===es||i===ts||i===ns||i===is)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Wa)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Xa)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===qa)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ya)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$a)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ka)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Za)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ja)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ja)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Qa)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===es)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ts)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ns)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===is)return s===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===rs||i===as||i===ss)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===rs)return s===qe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===as)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ss)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===os||i===ls||i===wr||i===cs)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===os)return a.COMPRESSED_RED_RGTC1_EXT;if(i===ls)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===wr)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===cs)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ki?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const wm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Rm=`
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

}`;class Cm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Pl(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new $t({vertexShader:wm,fragmentShader:Rm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new cn(new Wi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Pm extends jn{constructor(e,t){super();const i=this;let r=null,a=1,s=null,o="local-floor",l=1,c=null,d=null,p=null,u=null,m=null,v=null;const M=typeof XRWebGLBinding<"u",f=new Cm,h={},y=t.getContextAttributes();let T=null,E=null;const P=[],b=[],L=new Ye;let x=null;const A=new Xt;A.viewport=new ht;const U=new Xt;U.viewport=new ht;const R=[A,U],z=new zu;let W=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let he=P[K];return he===void 0&&(he=new jr,P[K]=he),he.getTargetRaySpace()},this.getControllerGrip=function(K){let he=P[K];return he===void 0&&(he=new jr,P[K]=he),he.getGripSpace()},this.getHand=function(K){let he=P[K];return he===void 0&&(he=new jr,P[K]=he),he.getHandSpace()};function I(K){const he=b.indexOf(K.inputSource);if(he===-1)return;const ie=P[he];ie!==void 0&&(ie.update(K.inputSource,K.frame,c||s),ie.dispatchEvent({type:K.type,data:K.inputSource}))}function G(){r.removeEventListener("select",I),r.removeEventListener("selectstart",I),r.removeEventListener("selectend",I),r.removeEventListener("squeeze",I),r.removeEventListener("squeezestart",I),r.removeEventListener("squeezeend",I),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",H);for(let K=0;K<P.length;K++){const he=b[K];he!==null&&(b[K]=null,P[K].disconnect(he))}W=null,q=null,f.reset();for(const K in h)delete h[K];e.setRenderTarget(T),m=null,u=null,p=null,r=null,E=null,De.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(L.width,L.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){a=K,i.isPresenting===!0&&Ae("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&Ae("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return p===null&&M&&(p=new XRWebGLBinding(r,t)),p},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(T=e.getRenderTarget(),r.addEventListener("select",I),r.addEventListener("selectstart",I),r.addEventListener("selectend",I),r.addEventListener("squeeze",I),r.addEventListener("squeezestart",I),r.addEventListener("squeezeend",I),r.addEventListener("end",G),r.addEventListener("inputsourceschange",H),y.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(L),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,Ee=null,Re=null;y.depth&&(Re=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=y.stencil?qn:bn,Ee=y.stencil?ki:ln);const Te={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:a};p=this.getBinding(),u=p.createProjectionLayer(Te),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),E=new sn(u.textureWidth,u.textureHeight,{format:Yt,type:zt,depthTexture:new Mi(u.textureWidth,u.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const ie={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(r,t,ie),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),E=new sn(m.framebufferWidth,m.framebufferHeight,{format:Yt,type:zt,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await r.requestReferenceSpace(o),De.setContext(r),De.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function H(K){for(let he=0;he<K.removed.length;he++){const ie=K.removed[he],Ee=b.indexOf(ie);Ee>=0&&(b[Ee]=null,P[Ee].disconnect(ie))}for(let he=0;he<K.added.length;he++){const ie=K.added[he];let Ee=b.indexOf(ie);if(Ee===-1){for(let Te=0;Te<P.length;Te++)if(Te>=b.length){b.push(ie),Ee=Te;break}else if(b[Te]===null){b[Te]=ie,Ee=Te;break}if(Ee===-1)break}const Re=P[Ee];Re&&Re.connect(ie)}}const J=new B,Q=new B;function ce(K,he,ie){J.setFromMatrixPosition(he.matrixWorld),Q.setFromMatrixPosition(ie.matrixWorld);const Ee=J.distanceTo(Q),Re=he.projectionMatrix.elements,Te=ie.projectionMatrix.elements,rt=Re[14]/(Re[10]-1),Oe=Re[14]/(Re[10]+1),Ke=(Re[9]+1)/Re[5],it=(Re[9]-1)/Re[5],Fe=(Re[8]-1)/Re[0],mt=(Te[8]+1)/Te[0],at=rt*Fe,Lt=rt*mt,C=Ee/(-Fe+mt),gt=C*-Fe;if(he.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(gt),K.translateZ(C),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Re[10]===-1)K.projectionMatrix.copy(he.projectionMatrix),K.projectionMatrixInverse.copy(he.projectionMatrixInverse);else{const Be=rt+C,tt=Oe+C,oe=at-gt,st=Lt+(Ee-gt),S=Ke*Oe/tt*Be,g=it*Oe/tt*Be;K.projectionMatrix.makePerspective(oe,st,S,g,Be,tt),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ve(K,he){he===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(he.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let he=K.near,ie=K.far;f.texture!==null&&(f.depthNear>0&&(he=f.depthNear),f.depthFar>0&&(ie=f.depthFar)),z.near=U.near=A.near=he,z.far=U.far=A.far=ie,(W!==z.near||q!==z.far)&&(r.updateRenderState({depthNear:z.near,depthFar:z.far}),W=z.near,q=z.far),z.layers.mask=K.layers.mask|6,A.layers.mask=z.layers.mask&-5,U.layers.mask=z.layers.mask&-3;const Ee=K.parent,Re=z.cameras;ve(z,Ee);for(let Te=0;Te<Re.length;Te++)ve(Re[Te],Ee);Re.length===2?ce(z,A,U):z.projectionMatrix.copy(A.projectionMatrix),ye(K,z,Ee)};function ye(K,he,ie){ie===null?K.matrix.copy(he.matrixWorld):(K.matrix.copy(ie.matrixWorld),K.matrix.invert(),K.matrix.multiply(he.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(he.projectionMatrix),K.projectionMatrixInverse.copy(he.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Gi*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(K){l=K,u!==null&&(u.fixedFoveation=K),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=K)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(z)},this.getCameraTexture=function(K){return h[K]};let He=null;function $e(K,he){if(d=he.getViewerPose(c||s),v=he,d!==null){const ie=d.views;m!==null&&(e.setRenderTargetFramebuffer(E,m.framebuffer),e.setRenderTarget(E));let Ee=!1;ie.length!==z.cameras.length&&(z.cameras.length=0,Ee=!0);for(let Oe=0;Oe<ie.length;Oe++){const Ke=ie[Oe];let it=null;if(m!==null)it=m.getViewport(Ke);else{const mt=p.getViewSubImage(u,Ke);it=mt.viewport,Oe===0&&(e.setRenderTargetTextures(E,mt.colorTexture,mt.depthStencilTexture),e.setRenderTarget(E))}let Fe=R[Oe];Fe===void 0&&(Fe=new Xt,Fe.layers.enable(Oe),Fe.viewport=new ht,R[Oe]=Fe),Fe.matrix.fromArray(Ke.transform.matrix),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),Fe.projectionMatrix.fromArray(Ke.projectionMatrix),Fe.projectionMatrixInverse.copy(Fe.projectionMatrix).invert(),Fe.viewport.set(it.x,it.y,it.width,it.height),Oe===0&&(z.matrix.copy(Fe.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Ee===!0&&z.cameras.push(Fe)}const Re=r.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&M){p=i.getBinding();const Oe=p.getDepthInformation(ie[0]);Oe&&Oe.isValid&&Oe.texture&&f.init(Oe,r.renderState)}if(Re&&Re.includes("camera-access")&&M){e.state.unbindTexture(),p=i.getBinding();for(let Oe=0;Oe<ie.length;Oe++){const Ke=ie[Oe].camera;if(Ke){let it=h[Ke];it||(it=new Pl,h[Ke]=it);const Fe=p.getCameraImage(Ke);it.sourceTexture=Fe}}}}for(let ie=0;ie<P.length;ie++){const Ee=b[ie],Re=P[ie];Ee!==null&&Re!==void 0&&Re.update(Ee,he,c||s)}He&&He(K,he),he.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:he}),v=null}const De=new Ul;De.setAnimationLoop($e),this.setAnimationLoop=function(K){He=K},this.dispose=function(){}}}const Lm=new pt,Gl=new Ce;Gl.set(-1,0,0,0,1,0,0,0,1);function Dm(n,e){function t(f,h){f.matrixAutoUpdate===!0&&f.updateMatrix(),h.value.copy(f.matrix)}function i(f,h){h.color.getRGB(f.fogColor.value,Ll(n)),h.isFog?(f.fogNear.value=h.near,f.fogFar.value=h.far):h.isFogExp2&&(f.fogDensity.value=h.density)}function r(f,h,y,T,E){h.isNodeMaterial?h.uniformsNeedUpdate=!1:h.isMeshBasicMaterial?a(f,h):h.isMeshLambertMaterial?(a(f,h),h.envMap&&(f.envMapIntensity.value=h.envMapIntensity)):h.isMeshToonMaterial?(a(f,h),p(f,h)):h.isMeshPhongMaterial?(a(f,h),d(f,h),h.envMap&&(f.envMapIntensity.value=h.envMapIntensity)):h.isMeshStandardMaterial?(a(f,h),u(f,h),h.isMeshPhysicalMaterial&&m(f,h,E)):h.isMeshMatcapMaterial?(a(f,h),v(f,h)):h.isMeshDepthMaterial?a(f,h):h.isMeshDistanceMaterial?(a(f,h),M(f,h)):h.isMeshNormalMaterial?a(f,h):h.isLineBasicMaterial?(s(f,h),h.isLineDashedMaterial&&o(f,h)):h.isPointsMaterial?l(f,h,y,T):h.isSpriteMaterial?c(f,h):h.isShadowMaterial?(f.color.value.copy(h.color),f.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function a(f,h){f.opacity.value=h.opacity,h.color&&f.diffuse.value.copy(h.color),h.emissive&&f.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(f.map.value=h.map,t(h.map,f.mapTransform)),h.alphaMap&&(f.alphaMap.value=h.alphaMap,t(h.alphaMap,f.alphaMapTransform)),h.bumpMap&&(f.bumpMap.value=h.bumpMap,t(h.bumpMap,f.bumpMapTransform),f.bumpScale.value=h.bumpScale,h.side===Pt&&(f.bumpScale.value*=-1)),h.normalMap&&(f.normalMap.value=h.normalMap,t(h.normalMap,f.normalMapTransform),f.normalScale.value.copy(h.normalScale),h.side===Pt&&f.normalScale.value.negate()),h.displacementMap&&(f.displacementMap.value=h.displacementMap,t(h.displacementMap,f.displacementMapTransform),f.displacementScale.value=h.displacementScale,f.displacementBias.value=h.displacementBias),h.emissiveMap&&(f.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,f.emissiveMapTransform)),h.specularMap&&(f.specularMap.value=h.specularMap,t(h.specularMap,f.specularMapTransform)),h.alphaTest>0&&(f.alphaTest.value=h.alphaTest);const y=e.get(h),T=y.envMap,E=y.envMapRotation;T&&(f.envMap.value=T,f.envMapRotation.value.setFromMatrix4(Lm.makeRotationFromEuler(E)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(Gl),f.reflectivity.value=h.reflectivity,f.ior.value=h.ior,f.refractionRatio.value=h.refractionRatio),h.lightMap&&(f.lightMap.value=h.lightMap,f.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,f.lightMapTransform)),h.aoMap&&(f.aoMap.value=h.aoMap,f.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,f.aoMapTransform))}function s(f,h){f.diffuse.value.copy(h.color),f.opacity.value=h.opacity,h.map&&(f.map.value=h.map,t(h.map,f.mapTransform))}function o(f,h){f.dashSize.value=h.dashSize,f.totalSize.value=h.dashSize+h.gapSize,f.scale.value=h.scale}function l(f,h,y,T){f.diffuse.value.copy(h.color),f.opacity.value=h.opacity,f.size.value=h.size*y,f.scale.value=T*.5,h.map&&(f.map.value=h.map,t(h.map,f.uvTransform)),h.alphaMap&&(f.alphaMap.value=h.alphaMap,t(h.alphaMap,f.alphaMapTransform)),h.alphaTest>0&&(f.alphaTest.value=h.alphaTest)}function c(f,h){f.diffuse.value.copy(h.color),f.opacity.value=h.opacity,f.rotation.value=h.rotation,h.map&&(f.map.value=h.map,t(h.map,f.mapTransform)),h.alphaMap&&(f.alphaMap.value=h.alphaMap,t(h.alphaMap,f.alphaMapTransform)),h.alphaTest>0&&(f.alphaTest.value=h.alphaTest)}function d(f,h){f.specular.value.copy(h.specular),f.shininess.value=Math.max(h.shininess,1e-4)}function p(f,h){h.gradientMap&&(f.gradientMap.value=h.gradientMap)}function u(f,h){f.metalness.value=h.metalness,h.metalnessMap&&(f.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,f.metalnessMapTransform)),f.roughness.value=h.roughness,h.roughnessMap&&(f.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,f.roughnessMapTransform)),h.envMap&&(f.envMapIntensity.value=h.envMapIntensity)}function m(f,h,y){f.ior.value=h.ior,h.sheen>0&&(f.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),f.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(f.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,f.sheenColorMapTransform)),h.sheenRoughnessMap&&(f.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,f.sheenRoughnessMapTransform))),h.clearcoat>0&&(f.clearcoat.value=h.clearcoat,f.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(f.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,f.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(f.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Pt&&f.clearcoatNormalScale.value.negate())),h.dispersion>0&&(f.dispersion.value=h.dispersion),h.iridescence>0&&(f.iridescence.value=h.iridescence,f.iridescenceIOR.value=h.iridescenceIOR,f.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(f.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,f.iridescenceMapTransform)),h.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),h.transmission>0&&(f.transmission.value=h.transmission,f.transmissionSamplerMap.value=y.texture,f.transmissionSamplerSize.value.set(y.width,y.height),h.transmissionMap&&(f.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,f.transmissionMapTransform)),f.thickness.value=h.thickness,h.thicknessMap&&(f.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=h.attenuationDistance,f.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(f.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(f.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=h.specularIntensity,f.specularColor.value.copy(h.specularColor),h.specularColorMap&&(f.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,f.specularColorMapTransform)),h.specularIntensityMap&&(f.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,f.specularIntensityMapTransform))}function v(f,h){h.matcap&&(f.matcap.value=h.matcap)}function M(f,h){const y=e.get(h).light;f.referencePosition.value.setFromMatrixPosition(y.matrixWorld),f.nearDistance.value=y.shadow.camera.near,f.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Im(n,e,t,i){let r={},a={},s=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,T){const E=T.program;i.uniformBlockBinding(y,E)}function c(y,T){let E=r[y.id];E===void 0&&(v(y),E=d(y),r[y.id]=E,y.addEventListener("dispose",f));const P=T.program;i.updateUBOMapping(y,P);const b=e.render.frame;a[y.id]!==b&&(u(y),a[y.id]=b)}function d(y){const T=p();y.__bindingPointIndex=T;const E=n.createBuffer(),P=y.__size,b=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,P,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,T,E),E}function p(){for(let y=0;y<o;y++)if(s.indexOf(y)===-1)return s.push(y),y;return We("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const T=r[y.id],E=y.uniforms,P=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let b=0,L=E.length;b<L;b++){const x=Array.isArray(E[b])?E[b]:[E[b]];for(let A=0,U=x.length;A<U;A++){const R=x[A];if(m(R,b,A,P)===!0){const z=R.__offset,W=Array.isArray(R.value)?R.value:[R.value];let q=0;for(let I=0;I<W.length;I++){const G=W[I],H=M(G);typeof G=="number"||typeof G=="boolean"?(R.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,z+q,R.__data)):G.isMatrix3?(R.__data[0]=G.elements[0],R.__data[1]=G.elements[1],R.__data[2]=G.elements[2],R.__data[3]=0,R.__data[4]=G.elements[3],R.__data[5]=G.elements[4],R.__data[6]=G.elements[5],R.__data[7]=0,R.__data[8]=G.elements[6],R.__data[9]=G.elements[7],R.__data[10]=G.elements[8],R.__data[11]=0):ArrayBuffer.isView(G)?R.__data.set(new G.constructor(G.buffer,G.byteOffset,R.__data.length)):(G.toArray(R.__data,q),q+=H.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(y,T,E,P){const b=y.value,L=T+"_"+E;if(P[L]===void 0)return typeof b=="number"||typeof b=="boolean"?P[L]=b:ArrayBuffer.isView(b)?P[L]=b.slice():P[L]=b.clone(),!0;{const x=P[L];if(typeof b=="number"||typeof b=="boolean"){if(x!==b)return P[L]=b,!0}else{if(ArrayBuffer.isView(b))return!0;if(x.equals(b)===!1)return x.copy(b),!0}}return!1}function v(y){const T=y.uniforms;let E=0;const P=16;for(let L=0,x=T.length;L<x;L++){const A=Array.isArray(T[L])?T[L]:[T[L]];for(let U=0,R=A.length;U<R;U++){const z=A[U],W=Array.isArray(z.value)?z.value:[z.value];for(let q=0,I=W.length;q<I;q++){const G=W[q],H=M(G),J=E%P,Q=J%H.boundary,ce=J+Q;E+=Q,ce!==0&&P-ce<H.storage&&(E+=P-ce),z.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=E,E+=H.storage}}}const b=E%P;return b>0&&(E+=P-b),y.__size=E,y.__cache={},this}function M(y){const T={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(T.boundary=4,T.storage=4):y.isVector2?(T.boundary=8,T.storage=8):y.isVector3||y.isColor?(T.boundary=16,T.storage=12):y.isVector4?(T.boundary=16,T.storage=16):y.isMatrix3?(T.boundary=48,T.storage=48):y.isMatrix4?(T.boundary=64,T.storage=64):y.isTexture?Ae("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(T.boundary=16,T.storage=y.byteLength):Ae("WebGLRenderer: Unsupported uniform value type.",y),T}function f(y){const T=y.target;T.removeEventListener("dispose",f);const E=s.indexOf(T.__bindingPointIndex);s.splice(E,1),n.deleteBuffer(r[T.id]),delete r[T.id],delete a[T.id]}function h(){for(const y in r)n.deleteBuffer(r[y]);s=[],r={},a={}}return{bind:l,update:c,dispose:h}}const Um=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Jt=null;function Nm(){return Jt===null&&(Jt=new Au(Um,16,16,Kn,yn),Jt.name="DFG_LUT",Jt.minFilter=At,Jt.magFilter=At,Jt.wrapS=vn,Jt.wrapT=vn,Jt.generateMipmaps=!1,Jt.needsUpdate=!0),Jt}class Fm{constructor(e={}){const{canvas:t=Gc(),context:i=null,depth:r=!0,stencil:a=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:u=!1,outputBufferType:m=zt}=e;this.isWebGLRenderer=!0;let v;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=i.getContextAttributes().alpha}else v=s;const M=m,f=new Set([Es,bs,ys]),h=new Set([zt,ln,zi,ki,Ss,Ms]),y=new Uint32Array(4),T=new Int32Array(4),E=new B;let P=null,b=null;const L=[],x=[];let A=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=an,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const U=this;let R=!1,z=null;this._outputColorSpace=Bt;let W=0,q=0,I=null,G=-1,H=null;const J=new ht,Q=new ht;let ce=null;const ve=new Je(0);let ye=0,He=t.width,$e=t.height,De=1,K=null,he=null;const ie=new ht(0,0,He,$e),Ee=new ht(0,0,He,$e);let Re=!1;const Te=new Rl;let rt=!1,Oe=!1;const Ke=new pt,it=new B,Fe=new ht,mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let at=!1;function Lt(){return I===null?De:1}let C=i;function gt(_,D){return t.getContext(_,D)}try{const _={alpha:!0,depth:r,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:p};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${vs}`),t.addEventListener("webglcontextlost",Z,!1),t.addEventListener("webglcontextrestored",Se,!1),t.addEventListener("webglcontextcreationerror",Pe,!1),C===null){const D="webgl2";if(C=gt(D,_),C===null)throw gt(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(_){throw We("WebGLRenderer: "+_.message),_}let Be,tt,oe,st,S,g,N,Y,j,ee,se,V,$,fe,ge,re,te,we,Ie,Xe,w,ne,X;function pe(){Be=new Nf(C),Be.init(),w=new Am(C,Be),tt=new wf(C,Be,e,w),oe=new Em(C,Be),tt.reversedDepthBuffer&&u&&oe.buffers.depth.setReversed(!0),st=new Bf(C),S=new um,g=new Tm(C,Be,oe,S,tt,w,st),N=new Uf(U),Y=new Gu(C),ne=new Tf(C,Y),j=new Ff(C,Y,st,ne),ee=new kf(C,j,Y,ne,st),we=new zf(C,tt,g),ge=new Rf(S),se=new cm(U,N,Be,tt,ne,ge),V=new Dm(U,S),$=new hm,fe=new vm(Be),te=new Ef(U,N,oe,ee,v,l),re=new bm(U,ee,tt),X=new Im(C,st,tt,oe),Ie=new Af(C,Be,st),Xe=new Of(C,Be,st),st.programs=se.programs,U.capabilities=tt,U.extensions=Be,U.properties=S,U.renderLists=$,U.shadowMap=re,U.state=oe,U.info=st}pe(),M!==zt&&(A=new Hf(M,t.width,t.height,r,a));const ae=new Pm(U,C);this.xr=ae,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const _=Be.get("WEBGL_lose_context");_&&_.loseContext()},this.forceContextRestore=function(){const _=Be.get("WEBGL_lose_context");_&&_.restoreContext()},this.getPixelRatio=function(){return De},this.setPixelRatio=function(_){_!==void 0&&(De=_,this.setSize(He,$e,!1))},this.getSize=function(_){return _.set(He,$e)},this.setSize=function(_,D,k=!0){if(ae.isPresenting){Ae("WebGLRenderer: Can't change size while VR device is presenting.");return}He=_,$e=D,t.width=Math.floor(_*De),t.height=Math.floor(D*De),k===!0&&(t.style.width=_+"px",t.style.height=D+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,_,D)},this.getDrawingBufferSize=function(_){return _.set(He*De,$e*De).floor()},this.setDrawingBufferSize=function(_,D,k){He=_,$e=D,De=k,t.width=Math.floor(_*k),t.height=Math.floor(D*k),this.setViewport(0,0,_,D)},this.setEffects=function(_){if(M===zt){We("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(_){for(let D=0;D<_.length;D++)if(_[D].isOutputPass===!0){Ae("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(_||[])},this.getCurrentViewport=function(_){return _.copy(J)},this.getViewport=function(_){return _.copy(ie)},this.setViewport=function(_,D,k,F){_.isVector4?ie.set(_.x,_.y,_.z,_.w):ie.set(_,D,k,F),oe.viewport(J.copy(ie).multiplyScalar(De).round())},this.getScissor=function(_){return _.copy(Ee)},this.setScissor=function(_,D,k,F){_.isVector4?Ee.set(_.x,_.y,_.z,_.w):Ee.set(_,D,k,F),oe.scissor(Q.copy(Ee).multiplyScalar(De).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(_){oe.setScissorTest(Re=_)},this.setOpaqueSort=function(_){K=_},this.setTransparentSort=function(_){he=_},this.getClearColor=function(_){return _.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor(...arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha(...arguments)},this.clear=function(_=!0,D=!0,k=!0){let F=0;if(_){let O=!1;if(I!==null){const de=I.texture.format;O=f.has(de)}if(O){const de=I.texture.type,_e=h.has(de),ue=te.getClearColor(),xe=te.getClearAlpha(),Me=ue.r,Le=ue.g,Ne=ue.b;_e?(y[0]=Me,y[1]=Le,y[2]=Ne,y[3]=xe,C.clearBufferuiv(C.COLOR,0,y)):(T[0]=Me,T[1]=Le,T[2]=Ne,T[3]=xe,C.clearBufferiv(C.COLOR,0,T))}else F|=C.COLOR_BUFFER_BIT}D&&(F|=C.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),k&&(F|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F!==0&&C.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(_){_.setRenderer(this),z=_},this.dispose=function(){t.removeEventListener("webglcontextlost",Z,!1),t.removeEventListener("webglcontextrestored",Se,!1),t.removeEventListener("webglcontextcreationerror",Pe,!1),te.dispose(),$.dispose(),fe.dispose(),S.dispose(),N.dispose(),ee.dispose(),ne.dispose(),X.dispose(),se.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",Ns),ae.removeEventListener("sessionend",Fs),On.stop()};function Z(_){_.preventDefault(),Qs("WebGLRenderer: Context Lost."),R=!0}function Se(){Qs("WebGLRenderer: Context Restored."),R=!1;const _=st.autoReset,D=re.enabled,k=re.autoUpdate,F=re.needsUpdate,O=re.type;pe(),st.autoReset=_,re.enabled=D,re.autoUpdate=k,re.needsUpdate=F,re.type=O}function Pe(_){We("WebGLRenderer: A WebGL context could not be created. Reason: ",_.statusMessage)}function ct(_){const D=_.target;D.removeEventListener("dispose",ct),Ze(D)}function Ze(_){un(_),S.remove(_)}function un(_){const D=S.get(_).programs;D!==void 0&&(D.forEach(function(k){se.releaseProgram(k)}),_.isShaderMaterial&&se.releaseShaderCache(_))}this.renderBufferDirect=function(_,D,k,F,O,de){D===null&&(D=mt);const _e=O.isMesh&&O.matrixWorld.determinant()<0,ue=Ql(_,D,k,F,O);oe.setMaterial(F,_e);let xe=k.index,Me=1;if(F.wireframe===!0){if(xe=j.getWireframeAttribute(k),xe===void 0)return;Me=2}const Le=k.drawRange,Ne=k.attributes.position;let be=Le.start*Me,je=(Le.start+Le.count)*Me;de!==null&&(be=Math.max(be,de.start*Me),je=Math.min(je,(de.start+de.count)*Me)),xe!==null?(be=Math.max(be,0),je=Math.min(je,xe.count)):Ne!=null&&(be=Math.max(be,0),je=Math.min(je,Ne.count));const ut=je-be;if(ut<0||ut===1/0)return;ne.setup(O,F,ue,k,xe);let ot,Qe=Ie;if(xe!==null&&(ot=Y.get(xe),Qe=Xe,Qe.setIndex(ot)),O.isMesh)F.wireframe===!0?(oe.setLineWidth(F.wireframeLinewidth*Lt()),Qe.setMode(C.LINES)):Qe.setMode(C.TRIANGLES);else if(O.isLine){let yt=F.linewidth;yt===void 0&&(yt=1),oe.setLineWidth(yt*Lt()),O.isLineSegments?Qe.setMode(C.LINES):O.isLineLoop?Qe.setMode(C.LINE_LOOP):Qe.setMode(C.LINE_STRIP)}else O.isPoints?Qe.setMode(C.POINTS):O.isSprite&&Qe.setMode(C.TRIANGLES);if(O.isBatchedMesh)if(Be.get("WEBGL_multi_draw"))Qe.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const yt=O._multiDrawStarts,me=O._multiDrawCounts,Dt=O._multiDrawCount,Ve=xe?Y.get(xe).bytesPerElement:1,Ft=S.get(F).currentProgram.getUniforms();for(let Zt=0;Zt<Dt;Zt++)Ft.setValue(C,"_gl_DrawID",Zt),Qe.render(yt[Zt]/Ve,me[Zt])}else if(O.isInstancedMesh)Qe.renderInstances(be,ut,O.count);else if(k.isInstancedBufferGeometry){const yt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,me=Math.min(k.instanceCount,yt);Qe.renderInstances(be,ut,me)}else Qe.render(be,ut)};function Kt(_,D,k){_.transparent===!0&&_.side===_n&&_.forceSinglePass===!1?(_.side=Pt,_.needsUpdate=!0,Yi(_,D,k),_.side=Fn,_.needsUpdate=!0,Yi(_,D,k),_.side=_n):Yi(_,D,k)}this.compile=function(_,D,k=null){k===null&&(k=_),b=fe.get(k),b.init(D),x.push(b),k.traverseVisible(function(O){O.isLight&&O.layers.test(D.layers)&&(b.pushLight(O),O.castShadow&&b.pushShadow(O))}),_!==k&&_.traverseVisible(function(O){O.isLight&&O.layers.test(D.layers)&&(b.pushLight(O),O.castShadow&&b.pushShadow(O))}),b.setupLights();const F=new Set;return _.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const de=O.material;if(de)if(Array.isArray(de))for(let _e=0;_e<de.length;_e++){const ue=de[_e];Kt(ue,k,O),F.add(ue)}else Kt(de,k,O),F.add(de)}),b=x.pop(),F},this.compileAsync=function(_,D,k=null){const F=this.compile(_,D,k);return new Promise(O=>{function de(){if(F.forEach(function(_e){S.get(_e).currentProgram.isReady()&&F.delete(_e)}),F.size===0){O(_);return}setTimeout(de,10)}Be.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let kr=null;function jl(_){kr&&kr(_)}function Ns(){On.stop()}function Fs(){On.start()}const On=new Ul;On.setAnimationLoop(jl),typeof self<"u"&&On.setContext(self),this.setAnimationLoop=function(_){kr=_,ae.setAnimationLoop(_),_===null?On.stop():On.start()},ae.addEventListener("sessionstart",Ns),ae.addEventListener("sessionend",Fs),this.render=function(_,D){if(D!==void 0&&D.isCamera!==!0){We("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;z!==null&&z.renderStart(_,D);const k=ae.enabled===!0&&ae.isPresenting===!0,F=A!==null&&(I===null||k)&&A.begin(U,I);if(_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(D),D=ae.getCamera()),_.isScene===!0&&_.onBeforeRender(U,_,D,I),b=fe.get(_,x.length),b.init(D),b.state.textureUnits=g.getTextureUnits(),x.push(b),Ke.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Te.setFromProjectionMatrix(Ke,rn,D.reversedDepth),Oe=this.localClippingEnabled,rt=ge.init(this.clippingPlanes,Oe),P=$.get(_,L.length),P.init(),L.push(P),ae.enabled===!0&&ae.isPresenting===!0){const _e=U.xr.getDepthSensingMesh();_e!==null&&Gr(_e,D,-1/0,U.sortObjects)}Gr(_,D,0,U.sortObjects),P.finish(),U.sortObjects===!0&&P.sort(K,he),at=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,at&&te.addToRenderList(P,_),this.info.render.frame++,rt===!0&&ge.beginShadows();const O=b.state.shadowsArray;if(re.render(O,_,D),rt===!0&&ge.endShadows(),this.info.autoReset===!0&&this.info.reset(),(F&&A.hasRenderPass())===!1){const _e=P.opaque,ue=P.transmissive;if(b.setupLights(),D.isArrayCamera){const xe=D.cameras;if(ue.length>0)for(let Me=0,Le=xe.length;Me<Le;Me++){const Ne=xe[Me];Bs(_e,ue,_,Ne)}at&&te.render(_);for(let Me=0,Le=xe.length;Me<Le;Me++){const Ne=xe[Me];Os(P,_,Ne,Ne.viewport)}}else ue.length>0&&Bs(_e,ue,_,D),at&&te.render(_),Os(P,_,D)}I!==null&&q===0&&(g.updateMultisampleRenderTarget(I),g.updateRenderTargetMipmap(I)),F&&A.end(U),_.isScene===!0&&_.onAfterRender(U,_,D),ne.resetDefaultState(),G=-1,H=null,x.pop(),x.length>0?(b=x[x.length-1],g.setTextureUnits(b.state.textureUnits),rt===!0&&ge.setGlobalState(U.clippingPlanes,b.state.camera)):b=null,L.pop(),L.length>0?P=L[L.length-1]:P=null,z!==null&&z.renderEnd()};function Gr(_,D,k,F){if(_.visible===!1)return;if(_.layers.test(D.layers)){if(_.isGroup)k=_.renderOrder;else if(_.isLOD)_.autoUpdate===!0&&_.update(D);else if(_.isLightProbeGrid)b.pushLightProbeGrid(_);else if(_.isLight)b.pushLight(_),_.castShadow&&b.pushShadow(_);else if(_.isSprite){if(!_.frustumCulled||Te.intersectsSprite(_)){F&&Fe.setFromMatrixPosition(_.matrixWorld).applyMatrix4(Ke);const _e=ee.update(_),ue=_.material;ue.visible&&P.push(_,_e,ue,k,Fe.z,null)}}else if((_.isMesh||_.isLine||_.isPoints)&&(!_.frustumCulled||Te.intersectsObject(_))){const _e=ee.update(_),ue=_.material;if(F&&(_.boundingSphere!==void 0?(_.boundingSphere===null&&_.computeBoundingSphere(),Fe.copy(_.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),Fe.copy(_e.boundingSphere.center)),Fe.applyMatrix4(_.matrixWorld).applyMatrix4(Ke)),Array.isArray(ue)){const xe=_e.groups;for(let Me=0,Le=xe.length;Me<Le;Me++){const Ne=xe[Me],be=ue[Ne.materialIndex];be&&be.visible&&P.push(_,_e,be,k,Fe.z,Ne)}}else ue.visible&&P.push(_,_e,ue,k,Fe.z,null)}}const de=_.children;for(let _e=0,ue=de.length;_e<ue;_e++)Gr(de[_e],D,k,F)}function Os(_,D,k,F){const{opaque:O,transmissive:de,transparent:_e}=_;b.setupLightsView(k),rt===!0&&ge.setGlobalState(U.clippingPlanes,k),F&&oe.viewport(J.copy(F)),O.length>0&&qi(O,D,k),de.length>0&&qi(de,D,k),_e.length>0&&qi(_e,D,k),oe.buffers.depth.setTest(!0),oe.buffers.depth.setMask(!0),oe.buffers.color.setMask(!0),oe.setPolygonOffset(!1)}function Bs(_,D,k,F){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[F.id]===void 0){const be=Be.has("EXT_color_buffer_half_float")||Be.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[F.id]=new sn(1,1,{generateMipmaps:!0,type:be?yn:zt,minFilter:Xn,samples:Math.max(4,tt.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ge.workingColorSpace})}const de=b.state.transmissionRenderTarget[F.id],_e=F.viewport||J;de.setSize(_e.z*U.transmissionResolutionScale,_e.w*U.transmissionResolutionScale);const ue=U.getRenderTarget(),xe=U.getActiveCubeFace(),Me=U.getActiveMipmapLevel();U.setRenderTarget(de),U.getClearColor(ve),ye=U.getClearAlpha(),ye<1&&U.setClearColor(16777215,.5),U.clear(),at&&te.render(k);const Le=U.toneMapping;U.toneMapping=an;const Ne=F.viewport;if(F.viewport!==void 0&&(F.viewport=void 0),b.setupLightsView(F),rt===!0&&ge.setGlobalState(U.clippingPlanes,F),qi(_,k,F),g.updateMultisampleRenderTarget(de),g.updateRenderTargetMipmap(de),Be.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let je=0,ut=D.length;je<ut;je++){const ot=D[je],{object:Qe,geometry:yt,material:me,group:Dt}=ot;if(me.side===_n&&Qe.layers.test(F.layers)){const Ve=me.side;me.side=Pt,me.needsUpdate=!0,zs(Qe,k,F,yt,me,Dt),me.side=Ve,me.needsUpdate=!0,be=!0}}be===!0&&(g.updateMultisampleRenderTarget(de),g.updateRenderTargetMipmap(de))}U.setRenderTarget(ue,xe,Me),U.setClearColor(ve,ye),Ne!==void 0&&(F.viewport=Ne),U.toneMapping=Le}function qi(_,D,k){const F=D.isScene===!0?D.overrideMaterial:null;for(let O=0,de=_.length;O<de;O++){const _e=_[O],{object:ue,geometry:xe,group:Me}=_e;let Le=_e.material;Le.allowOverride===!0&&F!==null&&(Le=F),ue.layers.test(k.layers)&&zs(ue,D,k,xe,Le,Me)}}function zs(_,D,k,F,O,de){_.onBeforeRender(U,D,k,F,O,de),_.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,_.matrixWorld),_.normalMatrix.getNormalMatrix(_.modelViewMatrix),O.onBeforeRender(U,D,k,F,_,de),O.transparent===!0&&O.side===_n&&O.forceSinglePass===!1?(O.side=Pt,O.needsUpdate=!0,U.renderBufferDirect(k,D,F,O,_,de),O.side=Fn,O.needsUpdate=!0,U.renderBufferDirect(k,D,F,O,_,de),O.side=_n):U.renderBufferDirect(k,D,F,O,_,de),_.onAfterRender(U,D,k,F,O,de)}function Yi(_,D,k){D.isScene!==!0&&(D=mt);const F=S.get(_),O=b.state.lights,de=b.state.shadowsArray,_e=O.state.version,ue=se.getParameters(_,O.state,de,D,k,b.state.lightProbeGridArray),xe=se.getProgramCacheKey(ue);let Me=F.programs;F.environment=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?D.environment:null,F.fog=D.fog;const Le=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap;F.envMap=N.get(_.envMap||F.environment,Le),F.envMapRotation=F.environment!==null&&_.envMap===null?D.environmentRotation:_.envMapRotation,Me===void 0&&(_.addEventListener("dispose",ct),Me=new Map,F.programs=Me);let Ne=Me.get(xe);if(Ne!==void 0){if(F.currentProgram===Ne&&F.lightsStateVersion===_e)return Gs(_,ue),Ne}else ue.uniforms=se.getUniforms(_),z!==null&&_.isNodeMaterial&&z.build(_,k,ue),_.onBeforeCompile(ue,U),Ne=se.acquireProgram(ue,xe),Me.set(xe,Ne),F.uniforms=ue.uniforms;const be=F.uniforms;return(!_.isShaderMaterial&&!_.isRawShaderMaterial||_.clipping===!0)&&(be.clippingPlanes=ge.uniform),Gs(_,ue),F.needsLights=tc(_),F.lightsStateVersion=_e,F.needsLights&&(be.ambientLightColor.value=O.state.ambient,be.lightProbe.value=O.state.probe,be.directionalLights.value=O.state.directional,be.directionalLightShadows.value=O.state.directionalShadow,be.spotLights.value=O.state.spot,be.spotLightShadows.value=O.state.spotShadow,be.rectAreaLights.value=O.state.rectArea,be.ltc_1.value=O.state.rectAreaLTC1,be.ltc_2.value=O.state.rectAreaLTC2,be.pointLights.value=O.state.point,be.pointLightShadows.value=O.state.pointShadow,be.hemisphereLights.value=O.state.hemi,be.directionalShadowMatrix.value=O.state.directionalShadowMatrix,be.spotLightMatrix.value=O.state.spotLightMatrix,be.spotLightMap.value=O.state.spotLightMap,be.pointShadowMatrix.value=O.state.pointShadowMatrix),F.lightProbeGrid=b.state.lightProbeGridArray.length>0,F.currentProgram=Ne,F.uniformsList=null,Ne}function ks(_){if(_.uniformsList===null){const D=_.currentProgram.getUniforms();_.uniformsList=Tr.seqWithValue(D.seq,_.uniforms)}return _.uniformsList}function Gs(_,D){const k=S.get(_);k.outputColorSpace=D.outputColorSpace,k.batching=D.batching,k.batchingColor=D.batchingColor,k.instancing=D.instancing,k.instancingColor=D.instancingColor,k.instancingMorph=D.instancingMorph,k.skinning=D.skinning,k.morphTargets=D.morphTargets,k.morphNormals=D.morphNormals,k.morphColors=D.morphColors,k.morphTargetsCount=D.morphTargetsCount,k.numClippingPlanes=D.numClippingPlanes,k.numIntersection=D.numClipIntersection,k.vertexAlphas=D.vertexAlphas,k.vertexTangents=D.vertexTangents,k.toneMapping=D.toneMapping}function Jl(_,D){if(_.length===0)return null;if(_.length===1)return _[0].texture!==null?_[0]:null;E.setFromMatrixPosition(D.matrixWorld);for(let k=0,F=_.length;k<F;k++){const O=_[k];if(O.texture!==null&&O.boundingBox.containsPoint(E))return O}return null}function Ql(_,D,k,F,O){D.isScene!==!0&&(D=mt),g.resetTextureUnits();const de=D.fog,_e=F.isMeshStandardMaterial||F.isMeshLambertMaterial||F.isMeshPhongMaterial?D.environment:null,ue=I===null?U.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Ge.workingColorSpace,xe=F.isMeshStandardMaterial||F.isMeshLambertMaterial&&!F.envMap||F.isMeshPhongMaterial&&!F.envMap,Me=N.get(F.envMap||_e,xe),Le=F.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ne=!!k.attributes.tangent&&(!!F.normalMap||F.anisotropy>0),be=!!k.morphAttributes.position,je=!!k.morphAttributes.normal,ut=!!k.morphAttributes.color;let ot=an;F.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(ot=U.toneMapping);const Qe=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,yt=Qe!==void 0?Qe.length:0,me=S.get(F),Dt=b.state.lights;if(rt===!0&&(Oe===!0||_!==H)){const nt=_===H&&F.id===G;ge.setState(F,_,nt)}let Ve=!1;F.version===me.__version?(me.needsLights&&me.lightsStateVersion!==Dt.state.version||me.outputColorSpace!==ue||O.isBatchedMesh&&me.batching===!1||!O.isBatchedMesh&&me.batching===!0||O.isBatchedMesh&&me.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&me.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&me.instancing===!1||!O.isInstancedMesh&&me.instancing===!0||O.isSkinnedMesh&&me.skinning===!1||!O.isSkinnedMesh&&me.skinning===!0||O.isInstancedMesh&&me.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&me.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&me.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&me.instancingMorph===!1&&O.morphTexture!==null||me.envMap!==Me||F.fog===!0&&me.fog!==de||me.numClippingPlanes!==void 0&&(me.numClippingPlanes!==ge.numPlanes||me.numIntersection!==ge.numIntersection)||me.vertexAlphas!==Le||me.vertexTangents!==Ne||me.morphTargets!==be||me.morphNormals!==je||me.morphColors!==ut||me.toneMapping!==ot||me.morphTargetsCount!==yt||!!me.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Ve=!0):(Ve=!0,me.__version=F.version);let Ft=me.currentProgram;Ve===!0&&(Ft=Yi(F,D,O),z&&F.isNodeMaterial&&z.onUpdateProgram(F,Ft,me));let Zt=!1,Tn=!1,Jn=!1;const et=Ft.getUniforms(),dt=me.uniforms;if(oe.useProgram(Ft.program)&&(Zt=!0,Tn=!0,Jn=!0),F.id!==G&&(G=F.id,Tn=!0),me.needsLights){const nt=Jl(b.state.lightProbeGridArray,O);me.lightProbeGrid!==nt&&(me.lightProbeGrid=nt,Tn=!0)}if(Zt||H!==_){oe.buffers.depth.getReversed()&&_.reversedDepth!==!0&&(_._reversedDepth=!0,_.updateProjectionMatrix()),et.setValue(C,"projectionMatrix",_.projectionMatrix),et.setValue(C,"viewMatrix",_.matrixWorldInverse);const wn=et.map.cameraPosition;wn!==void 0&&wn.setValue(C,it.setFromMatrixPosition(_.matrixWorld)),tt.logarithmicDepthBuffer&&et.setValue(C,"logDepthBufFC",2/(Math.log(_.far+1)/Math.LN2)),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&et.setValue(C,"isOrthographic",_.isOrthographicCamera===!0),H!==_&&(H=_,Tn=!0,Jn=!0)}if(me.needsLights&&(Dt.state.directionalShadowMap.length>0&&et.setValue(C,"directionalShadowMap",Dt.state.directionalShadowMap,g),Dt.state.spotShadowMap.length>0&&et.setValue(C,"spotShadowMap",Dt.state.spotShadowMap,g),Dt.state.pointShadowMap.length>0&&et.setValue(C,"pointShadowMap",Dt.state.pointShadowMap,g)),O.isSkinnedMesh){et.setOptional(C,O,"bindMatrix"),et.setOptional(C,O,"bindMatrixInverse");const nt=O.skeleton;nt&&(nt.boneTexture===null&&nt.computeBoneTexture(),et.setValue(C,"boneTexture",nt.boneTexture,g))}O.isBatchedMesh&&(et.setOptional(C,O,"batchingTexture"),et.setValue(C,"batchingTexture",O._matricesTexture,g),et.setOptional(C,O,"batchingIdTexture"),et.setValue(C,"batchingIdTexture",O._indirectTexture,g),et.setOptional(C,O,"batchingColorTexture"),O._colorsTexture!==null&&et.setValue(C,"batchingColorTexture",O._colorsTexture,g));const An=k.morphAttributes;if((An.position!==void 0||An.normal!==void 0||An.color!==void 0)&&we.update(O,k,Ft),(Tn||me.receiveShadow!==O.receiveShadow)&&(me.receiveShadow=O.receiveShadow,et.setValue(C,"receiveShadow",O.receiveShadow)),(F.isMeshStandardMaterial||F.isMeshLambertMaterial||F.isMeshPhongMaterial)&&F.envMap===null&&D.environment!==null&&(dt.envMapIntensity.value=D.environmentIntensity),dt.dfgLUT!==void 0&&(dt.dfgLUT.value=Nm()),Tn){if(et.setValue(C,"toneMappingExposure",U.toneMappingExposure),me.needsLights&&ec(dt,Jn),de&&F.fog===!0&&V.refreshFogUniforms(dt,de),V.refreshMaterialUniforms(dt,F,De,$e,b.state.transmissionRenderTarget[_.id]),me.needsLights&&me.lightProbeGrid){const nt=me.lightProbeGrid;dt.probesSH.value=nt.texture,dt.probesMin.value.copy(nt.boundingBox.min),dt.probesMax.value.copy(nt.boundingBox.max),dt.probesResolution.value.copy(nt.resolution)}Tr.upload(C,ks(me),dt,g)}if(F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(Tr.upload(C,ks(me),dt,g),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&et.setValue(C,"center",O.center),et.setValue(C,"modelViewMatrix",O.modelViewMatrix),et.setValue(C,"normalMatrix",O.normalMatrix),et.setValue(C,"modelMatrix",O.matrixWorld),F.uniformsGroups!==void 0){const nt=F.uniformsGroups;for(let wn=0,Qn=nt.length;wn<Qn;wn++){const Hs=nt[wn];X.update(Hs,Ft),X.bind(Hs,Ft)}}return Ft}function ec(_,D){_.ambientLightColor.needsUpdate=D,_.lightProbe.needsUpdate=D,_.directionalLights.needsUpdate=D,_.directionalLightShadows.needsUpdate=D,_.pointLights.needsUpdate=D,_.pointLightShadows.needsUpdate=D,_.spotLights.needsUpdate=D,_.spotLightShadows.needsUpdate=D,_.rectAreaLights.needsUpdate=D,_.hemisphereLights.needsUpdate=D}function tc(_){return _.isMeshLambertMaterial||_.isMeshToonMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isShadowMaterial||_.isShaderMaterial&&_.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return q},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(_,D,k){const F=S.get(_);F.__autoAllocateDepthBuffer=_.resolveDepthBuffer===!1,F.__autoAllocateDepthBuffer===!1&&(F.__useRenderToTexture=!1),S.get(_.texture).__webglTexture=D,S.get(_.depthTexture).__webglTexture=F.__autoAllocateDepthBuffer?void 0:k,F.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(_,D){const k=S.get(_);k.__webglFramebuffer=D,k.__useDefaultFramebuffer=D===void 0};const nc=C.createFramebuffer();this.setRenderTarget=function(_,D=0,k=0){I=_,W=D,q=k;let F=null,O=!1,de=!1;if(_){const ue=S.get(_);if(ue.__useDefaultFramebuffer!==void 0){oe.bindFramebuffer(C.FRAMEBUFFER,ue.__webglFramebuffer),J.copy(_.viewport),Q.copy(_.scissor),ce=_.scissorTest,oe.viewport(J),oe.scissor(Q),oe.setScissorTest(ce),G=-1;return}else if(ue.__webglFramebuffer===void 0)g.setupRenderTarget(_);else if(ue.__hasExternalTextures)g.rebindTextures(_,S.get(_.texture).__webglTexture,S.get(_.depthTexture).__webglTexture);else if(_.depthBuffer){const Le=_.depthTexture;if(ue.__boundDepthTexture!==Le){if(Le!==null&&S.has(Le)&&(_.width!==Le.image.width||_.height!==Le.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");g.setupDepthRenderbuffer(_)}}const xe=_.texture;(xe.isData3DTexture||xe.isDataArrayTexture||xe.isCompressedArrayTexture)&&(de=!0);const Me=S.get(_).__webglFramebuffer;_.isWebGLCubeRenderTarget?(Array.isArray(Me[D])?F=Me[D][k]:F=Me[D],O=!0):_.samples>0&&g.useMultisampledRTT(_)===!1?F=S.get(_).__webglMultisampledFramebuffer:Array.isArray(Me)?F=Me[k]:F=Me,J.copy(_.viewport),Q.copy(_.scissor),ce=_.scissorTest}else J.copy(ie).multiplyScalar(De).floor(),Q.copy(Ee).multiplyScalar(De).floor(),ce=Re;if(k!==0&&(F=nc),oe.bindFramebuffer(C.FRAMEBUFFER,F)&&oe.drawBuffers(_,F),oe.viewport(J),oe.scissor(Q),oe.setScissorTest(ce),O){const ue=S.get(_.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+D,ue.__webglTexture,k)}else if(de){const ue=D;for(let xe=0;xe<_.textures.length;xe++){const Me=S.get(_.textures[xe]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+xe,Me.__webglTexture,k,ue)}}else if(_!==null&&k!==0){const ue=S.get(_.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,ue.__webglTexture,k)}G=-1},this.readRenderTargetPixels=function(_,D,k,F,O,de,_e,ue=0){if(!(_&&_.isWebGLRenderTarget)){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xe=S.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&_e!==void 0&&(xe=xe[_e]),xe){oe.bindFramebuffer(C.FRAMEBUFFER,xe);try{const Me=_.textures[ue],Le=Me.format,Ne=Me.type;if(_.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+ue),!tt.textureFormatReadable(Le)){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tt.textureTypeReadable(Ne)){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=_.width-F&&k>=0&&k<=_.height-O&&C.readPixels(D,k,F,O,w.convert(Le),w.convert(Ne),de)}finally{const Me=I!==null?S.get(I).__webglFramebuffer:null;oe.bindFramebuffer(C.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(_,D,k,F,O,de,_e,ue=0){if(!(_&&_.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=S.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&_e!==void 0&&(xe=xe[_e]),xe)if(D>=0&&D<=_.width-F&&k>=0&&k<=_.height-O){oe.bindFramebuffer(C.FRAMEBUFFER,xe);const Me=_.textures[ue],Le=Me.format,Ne=Me.type;if(_.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+ue),!tt.textureFormatReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tt.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const be=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,be),C.bufferData(C.PIXEL_PACK_BUFFER,de.byteLength,C.STREAM_READ),C.readPixels(D,k,F,O,w.convert(Le),w.convert(Ne),0);const je=I!==null?S.get(I).__webglFramebuffer:null;oe.bindFramebuffer(C.FRAMEBUFFER,je);const ut=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Hc(C,ut,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,be),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,de),C.deleteBuffer(be),C.deleteSync(ut),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(_,D=null,k=0){const F=Math.pow(2,-k),O=Math.floor(_.image.width*F),de=Math.floor(_.image.height*F),_e=D!==null?D.x:0,ue=D!==null?D.y:0;g.setTexture2D(_,0),C.copyTexSubImage2D(C.TEXTURE_2D,k,0,0,_e,ue,O,de),oe.unbindTexture()};const ic=C.createFramebuffer(),rc=C.createFramebuffer();this.copyTextureToTexture=function(_,D,k=null,F=null,O=0,de=0){let _e,ue,xe,Me,Le,Ne,be,je,ut;const ot=_.isCompressedTexture?_.mipmaps[de]:_.image;if(k!==null)_e=k.max.x-k.min.x,ue=k.max.y-k.min.y,xe=k.isBox3?k.max.z-k.min.z:1,Me=k.min.x,Le=k.min.y,Ne=k.isBox3?k.min.z:0;else{const dt=Math.pow(2,-O);_e=Math.floor(ot.width*dt),ue=Math.floor(ot.height*dt),_.isDataArrayTexture?xe=ot.depth:_.isData3DTexture?xe=Math.floor(ot.depth*dt):xe=1,Me=0,Le=0,Ne=0}F!==null?(be=F.x,je=F.y,ut=F.z):(be=0,je=0,ut=0);const Qe=w.convert(D.format),yt=w.convert(D.type);let me;D.isData3DTexture?(g.setTexture3D(D,0),me=C.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(g.setTexture2DArray(D,0),me=C.TEXTURE_2D_ARRAY):(g.setTexture2D(D,0),me=C.TEXTURE_2D),oe.activeTexture(C.TEXTURE0),oe.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,D.flipY),oe.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),oe.pixelStorei(C.UNPACK_ALIGNMENT,D.unpackAlignment);const Dt=oe.getParameter(C.UNPACK_ROW_LENGTH),Ve=oe.getParameter(C.UNPACK_IMAGE_HEIGHT),Ft=oe.getParameter(C.UNPACK_SKIP_PIXELS),Zt=oe.getParameter(C.UNPACK_SKIP_ROWS),Tn=oe.getParameter(C.UNPACK_SKIP_IMAGES);oe.pixelStorei(C.UNPACK_ROW_LENGTH,ot.width),oe.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ot.height),oe.pixelStorei(C.UNPACK_SKIP_PIXELS,Me),oe.pixelStorei(C.UNPACK_SKIP_ROWS,Le),oe.pixelStorei(C.UNPACK_SKIP_IMAGES,Ne);const Jn=_.isDataArrayTexture||_.isData3DTexture,et=D.isDataArrayTexture||D.isData3DTexture;if(_.isDepthTexture){const dt=S.get(_),An=S.get(D),nt=S.get(dt.__renderTarget),wn=S.get(An.__renderTarget);oe.bindFramebuffer(C.READ_FRAMEBUFFER,nt.__webglFramebuffer),oe.bindFramebuffer(C.DRAW_FRAMEBUFFER,wn.__webglFramebuffer);for(let Qn=0;Qn<xe;Qn++)Jn&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,S.get(_).__webglTexture,O,Ne+Qn),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,S.get(D).__webglTexture,de,ut+Qn)),C.blitFramebuffer(Me,Le,_e,ue,be,je,_e,ue,C.DEPTH_BUFFER_BIT,C.NEAREST);oe.bindFramebuffer(C.READ_FRAMEBUFFER,null),oe.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(O!==0||_.isRenderTargetTexture||S.has(_)){const dt=S.get(_),An=S.get(D);oe.bindFramebuffer(C.READ_FRAMEBUFFER,ic),oe.bindFramebuffer(C.DRAW_FRAMEBUFFER,rc);for(let nt=0;nt<xe;nt++)Jn?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,dt.__webglTexture,O,Ne+nt):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,dt.__webglTexture,O),et?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,An.__webglTexture,de,ut+nt):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,An.__webglTexture,de),O!==0?C.blitFramebuffer(Me,Le,_e,ue,be,je,_e,ue,C.COLOR_BUFFER_BIT,C.NEAREST):et?C.copyTexSubImage3D(me,de,be,je,ut+nt,Me,Le,_e,ue):C.copyTexSubImage2D(me,de,be,je,Me,Le,_e,ue);oe.bindFramebuffer(C.READ_FRAMEBUFFER,null),oe.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else et?_.isDataTexture||_.isData3DTexture?C.texSubImage3D(me,de,be,je,ut,_e,ue,xe,Qe,yt,ot.data):D.isCompressedArrayTexture?C.compressedTexSubImage3D(me,de,be,je,ut,_e,ue,xe,Qe,ot.data):C.texSubImage3D(me,de,be,je,ut,_e,ue,xe,Qe,yt,ot):_.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,de,be,je,_e,ue,Qe,yt,ot.data):_.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,de,be,je,ot.width,ot.height,Qe,ot.data):C.texSubImage2D(C.TEXTURE_2D,de,be,je,_e,ue,Qe,yt,ot);oe.pixelStorei(C.UNPACK_ROW_LENGTH,Dt),oe.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Ve),oe.pixelStorei(C.UNPACK_SKIP_PIXELS,Ft),oe.pixelStorei(C.UNPACK_SKIP_ROWS,Zt),oe.pixelStorei(C.UNPACK_SKIP_IMAGES,Tn),de===0&&D.generateMipmaps&&C.generateMipmap(me),oe.unbindTexture()},this.initRenderTarget=function(_){S.get(_).__webglFramebuffer===void 0&&g.setupRenderTarget(_)},this.initTexture=function(_){_.isCubeTexture?g.setTextureCube(_,0):_.isData3DTexture?g.setTexture3D(_,0):_.isDataArrayTexture||_.isCompressedArrayTexture?g.setTexture2DArray(_,0):g.setTexture2D(_,0),oe.unbindTexture()},this.resetState=function(){W=0,q=0,I=null,oe.reset(),ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ge._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ge._getUnpackColorSpace()}}const Om=String.raw`
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec3 uCameraPos;
            uniform vec3 uCameraTarget;
            uniform float uAspect;
            uniform float uTropopause;
            uniform float uShowGrid;
            uniform float uSurfaceVisible;
            uniform float uSurfaceMode;
            uniform float uSeed;
            uniform float uSystemCount;
            uniform float uIsOrtho;
            uniform float uOrthoSize;
            uniform float uOrthoVerticalScale;
            uniform float uStepSize;
            uniform float uMaxSteps;
            uniform float uSunIntensity;
            uniform float uAmbientIntensity;
            uniform float uSunElevation;
            uniform float uSunViewerAngle;
            uniform float uFreezingLevel;
            uniform float uWindShear;
            uniform float uFbmOctaves;
            uniform float uCloudCurl;
            uniform float uMorphologyStyle;
            uniform float uPhotographicStyle;
            uniform float uLightPreset;
            uniform float uSkyMode;
            uniform float uTransparentBackground;
            uniform float uHdr10Mode;
            uniform float uDitherEnabled;
            uniform float uHdrReferencePeakNits;
            uniform float uMobileCumulusMode;

#ifndef CUMULONIMBUS_MORPHOLOGY_STYLE
#define CUMULONIMBUS_MORPHOLOGY_STYLE 0
#endif

            float hash(float n) { return fract(sin(n) * 43758.5453123); }

            float noise(vec3 x) {
                vec3 p = floor(x);
                vec3 f = fract(x);
                f = f * f * (3.0 - 2.0 * f);
                float n = p.x + p.y * 57.0 + 113.0 * p.z + uSeed * 17.0;
                return mix(
                    mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                    mix(mix(hash(n + 113.0), hash(n + 114.0), f.x), mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
                    f.z
                );
            }

            float fbm(vec3 p) {
                float f = 0.0;
                float weight = 0.5;
                for (int i = 0; i < 4; i++) {
                    f += weight * (1.0 - abs(noise(p * 2.0 - 1.0)));
                    p = vec3(
                        p.x * 1.74 + p.z * 0.31,
                        p.y * 1.91 + p.x * 0.17,
                        p.z * 1.63 - p.y * 0.23
                    );
                    weight *= 0.5;
                }
                return f;
            }

            float fbmAdaptive(vec3 p) {
                float f = 0.0;
                float weight = 0.5;
                for (int i = 0; i < 6; i++) {
                    float octaveGate = 1.0 - step(uFbmOctaves, float(i));
                    f += octaveGate * weight * (1.0 - abs(noise(p * 2.0 - 1.0)));
                    p = vec3(
                        p.x * 1.74 + p.z * 0.31,
                        p.y * 1.91 + p.x * 0.17,
                        p.z * 1.63 - p.y * 0.23
                    );
                    weight *= 0.5;
                }
                return f;
            }

            vec3 detailDomain(vec3 p) {
                return vec3(
                    p.x * 0.82 + p.z * 0.57,
                    p.y * 1.05 + p.x * 0.13 - p.z * 0.08,
                    p.z * 0.76 - p.x * 0.42 + p.y * 0.11
                );
            }

            float domainWarp(vec3 p, float phase) {
                vec3 a = detailDomain(p * 0.18 + vec3(phase, 3.1, 7.7));
                vec3 b = detailDomain(p * 0.31 + vec3(9.4, phase * 0.7, 1.8));
                return (fbm(a) - 0.5) * 0.9 + (noise(b) - 0.5) * 0.55;
            }

            float smin(float a, float b, float k) {
                float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
                return mix(b, a, h) - k * h * (1.0 - h);
            }

            float smax(float a, float b, float k) {
                float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
                return mix(a, b, h) + k * h * (1.0 - h);
            }

            vec2 intersectAABB(vec3 ro, vec3 rd, vec3 boxMin, vec3 boxMax) {
                vec3 safeRd = rd;
                safeRd.x = abs(safeRd.x) < 0.0001 ? 0.0001 : safeRd.x;
                safeRd.y = abs(safeRd.y) < 0.0001 ? 0.0001 : safeRd.y;
                safeRd.z = abs(safeRd.z) < 0.0001 ? 0.0001 : safeRd.z;
                vec3 tMin = (boxMin - ro) / safeRd;
                vec3 tMax = (boxMax - ro) / safeRd;
                vec3 t1 = min(tMin, tMax);
                vec3 t2 = max(tMin, tMax);
                float tNear = max(max(t1.x, t1.y), t1.z);
                float tFar = min(min(t2.x, t2.y), t2.z);
                return vec2(tNear, tFar);
            }

            const float MODEL_BASE_KM = 0.5;
            const float MODEL_LOCAL_BASE = -2.5;
            const float MODEL_LOCAL_TROPO = 4.5;
            const float MODEL_LOCAL_HEIGHT = MODEL_LOCAL_TROPO - MODEL_LOCAL_BASE;
            float modelKmScale() {
                return max(0.7, (uTropopause - MODEL_BASE_KM) / MODEL_LOCAL_HEIGHT);
            }

            vec3 worldToModelSpace(vec3 p) {
                float kmScale = modelKmScale();
                return vec3(p.x / kmScale, (p.y - MODEL_BASE_KM) / kmScale + MODEL_LOCAL_BASE, p.z / kmScale);
            }

            float cellCycleAngle(float phase, float speedScale, float ageOffset) {
                return uTime * 0.113 * speedScale + phase * 0.53 + ageOffset + uSeed * 0.00082;
            }

            vec2 windShearAxis(float phase) {
                float angle = phase * 0.17 + uSeed * 0.00021;
                vec2 axis = normalize(vec2(1.0, 0.28));
                mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                return normalize(rot * axis);
            }

            float iceFactorAtHeight(float heightKm) {
                return smoothstep(uFreezingLevel, uTropopause, heightKm);
            }

            float getCell01(
                vec3 p,
                vec2 offset,
                float maxR,
                float phase,
                float maxH,
                float speedScale,
                float ageOffset,
                float earlyDecay,
                float anvilScale
            ) {
                float cycleAngle = cellCycleAngle(phase, speedScale, ageOffset);
                float cycle = sin(cycleAngle) * 0.5 + 0.5;
                float falling = smoothstep(0.44, 0.9, -cos(cycleAngle) * 0.5 + 0.5);
                float growth = smoothstep(0.08, 0.86, cycle);
                float mature = smoothstep(0.58, 0.92, cycle) * (1.0 - falling * 0.32);
                float decayStart = clamp(0.46 - earlyDecay, 0.18, 0.72);
                float decayEnd = clamp(0.92 - earlyDecay * 0.48, decayStart + 0.18, 0.98);
                float dissipating = falling * smoothstep(decayStart, decayEnd, cycle);

                vec2 baseLocal = p.xz - offset;
                float r = length(baseLocal);
                float currentR = maxR * (0.58 + 0.42 * growth) * (1.0 - dissipating * mix(0.08, 0.24, earlyDecay));
                float naturalTop = mix(MODEL_LOCAL_BASE + 1.05, maxH, growth);
                float actualTop = min(naturalTop, MODEL_LOCAL_TROPO);
                float height = max(0.5, actualTop - MODEL_LOCAL_BASE);
                float h = clamp((p.y - MODEL_LOCAL_BASE) / height, 0.0, 1.0);
                float lowerShelf = smoothstep(0.02, 0.18, h) * (1.0 - smoothstep(0.3, 0.52, h));
                float towerColumn = smoothstep(0.16, 0.42, h) * (1.0 - smoothstep(0.66, 0.88, h));
                float crownSpread = smoothstep(0.6, 0.94, h);
                float photo = uPhotographicStyle;
                float verticalProfile = mix(
                    0.56 + lowerShelf * 0.34 + towerColumn * 0.08 + crownSpread * 0.34,
                    0.48 + lowerShelf * 0.22 + towerColumn * 0.2 + crownSpread * 0.3,
                    photo
                );
                verticalProfile *= mix(1.0, 0.82, dissipating * smoothstep(0.12, 0.62, h));
                float hitLid = smoothstep(MODEL_LOCAL_TROPO - 1.5, MODEL_LOCAL_TROPO, naturalTop);
                float anvilMask = mix(
                    smoothstep(actualTop - 2.0, actualTop + 0.5, p.y),
                    smoothstep(actualTop - 1.05, actualTop + 0.35, p.y),
                    uPhotographicStyle
                );
                float anvilLife = hitLid * smoothstep(0.34, 0.82, cycle) * (1.0 - dissipating * 0.18);
                vec2 windAxis = windShearAxis(phase);
                float downwind = dot(baseLocal, windAxis);
                float crosswind = length(baseLocal - windAxis * downwind);
                float downwind01 = smoothstep(-maxR * 0.65, maxR * 2.6, downwind);
                float anvilLength = maxR * mix(1.0, mix(0.72, 2.45 + photo * 0.7, downwind01), uWindShear);
                float anvilWidth = maxR * mix(0.92, mix(0.74, 1.26 + photo * 0.36, downwind01), uWindShear);
                float anvilPlume = exp(-crosswind * crosswind / max(0.01, anvilWidth * anvilWidth))
                    * smoothstep(-maxR * 0.95, maxR * 3.25, downwind)
                    * (1.0 - smoothstep(anvilLength * 0.78, anvilLength * 1.18, downwind));
                float anvil = anvilLife * anvilMask * maxR * mix(1.48, 1.56, photo) * anvilScale * anvilPlume;
                float anvilSlab = max(abs(crosswind) - anvilWidth, max(-downwind - maxR * 0.95, downwind - anvilLength));
                float anvilThickness = mix(0.12, mix(0.68, 0.42, photo), anvilMask) * (0.4 + anvilLife * 0.6);
                float anvilVertical = abs(p.y - actualTop) - anvilThickness;
                float anvilShape = smax(anvilSlab - anvil * mix(0.36, 0.3, photo), anvilVertical, mix(0.52, 0.36, photo)) + (1.0 - anvilLife) * 4.0;
                float bodyTaper = mix(1.0, 0.58 + lowerShelf * 0.2 + towerColumn * 0.22 + crownSpread * 0.1, photo);
                float shape = smin(r - currentR * verticalProfile * bodyTaper, anvilShape, mix(0.92, 0.62, photo));
                float topDist = p.y - actualTop;

                float baseWave =
                    (noise(vec3(baseLocal * 0.26 + phase, uSeed * 0.17)) - 0.5) * 0.46 +
                    sin(baseLocal.x * 0.82 + phase * 1.7) * 0.12 +
                    cos(baseLocal.y * 0.7 - phase * 1.2) * 0.1;
                float undersideNoise = noise(vec3(baseLocal * 0.52 + phase * 0.7, uSeed * 0.31));
                float lowerPouch = smoothstep(maxR * 1.05, maxR * 0.18, r)
                    * max(0.0, undersideNoise - 0.28) * 0.48;
                float localBase = MODEL_LOCAL_BASE + baseWave - lowerPouch;
                float bottomDist = localBase - p.y;
                float verticalDist = smax(topDist, bottomDist, 0.72);

                float lowerDowndraft = smoothstep(0.04, 0.2, h) * (1.0 - smoothstep(0.58, 0.8, h));
                float coreVoid = (1.0 - smoothstep(maxR * 0.12, maxR * 0.72, r));
                float dryPocket = smoothstep(
                    0.36,
                    0.86,
                    noise(vec3(baseLocal * 0.34 + vec2(2.7, 8.4), phase + uTime * 0.035))
                );
                shape += dissipating * lowerDowndraft * coreVoid * dryPocket * maxR * 0.62;
                shape += dissipating * lowerDowndraft * (1.0 - mature * 0.35) * 0.18;
                return smax(shape, verticalDist, mix(1.2, 0.86, photo));
            }

            float getCell00(vec3 p, vec2 offset, float maxR, float phase, float maxH) {
                float r = length(p.xz - offset);
                float cycle = sin(uTime * 0.2 + phase) * 0.5 + 0.5;
                float currentR = maxR * (0.7 + 0.3 * cycle);
                float currentTop = mix(0.5, maxH, cycle);
                float anvil = smoothstep(currentTop - 1.5, currentTop + 0.5, p.y) * cycle * maxR * 1.5;
                float shape = r - currentR - anvil;
                float topDist = p.y - currentTop;
                vec2 baseLocal = p.xz - offset;
                float baseWave =
                    (noise(vec3(baseLocal * 0.24 + phase, uSeed * 0.17)) - 0.5) * 0.86 +
                    sin(baseLocal.x * 1.08 + phase * 1.7) * 0.18 +
                    cos(baseLocal.y * 0.82 - phase * 1.2) * 0.13;
                float undersideNoise = noise(vec3(baseLocal * 0.46 + phase * 0.7, uSeed * 0.31));
                float lowerPouch = smoothstep(maxR * 0.92, maxR * 0.12, r)
                    * max(0.0, undersideNoise - 0.28) * 0.72;
                float localBase = -1.5 + baseWave - max(0.0, lowerPouch);
                float bottomDist = localBase - p.y;
                float verticalDist = smax(topDist, bottomDist, 0.62);
                return smax(shape, verticalDist, 1.0);
            }

            float getCbCellKm(
                vec3 p,
                vec2 offset,
                float baseH,
                float topPotential,
                float baseR,
                float towerR,
                float anvilR,
                float phase,
                float maturity
            ) {
                float pulse = sin(uTime * 0.055 + phase) * 0.5 + 0.5;
                float topH = min(uTropopause, mix(baseH + 2.4, topPotential, maturity) + (pulse - 0.5) * 0.42);
                float height = max(1.0, topH - baseH);
                float h = clamp((p.y - baseH) / height, 0.0, 1.0);
                vec2 lean = vec2(sin(phase * 1.73), cos(phase * 1.17)) * mix(0.15, 0.82, h);
                vec2 local = p.xz - offset - lean;
                float twist = sin(p.y * 0.28 + phase) * 0.2;
                mat2 rot = mat2(cos(twist), -sin(twist), sin(twist), cos(twist));
                local = rot * local;

                float lower = smoothstep(0.0, 0.2, h) * (1.0 - smoothstep(0.46, 0.76, h));
                float tower = smoothstep(0.12, 0.42, h) * (1.0 - smoothstep(0.78, 0.98, h));
                float crown = smoothstep(0.68, 0.98, h);
                float cap = smoothstep(0.84, 1.0, h);
                float anvilSkew = mix(1.0, 0.68, cap);
                float towerDepthSkew = mix(0.96, 0.72, tower);
                float crownDepthSkew = mix(towerDepthSkew, 0.6, cap);
                vec2 shapedLocal = vec2(local.x * anvilSkew, local.y * crownDepthSkew);
                float r = length(shapedLocal);

                float radius = mix(baseR, towerR, smoothstep(0.06, 0.42, h));
                radius += lower * baseR * 0.18;
                radius += crown * anvilR * mix(0.32, 1.0, cap);
                radius += domainWarp(vec3(local.x * 0.32, p.y * 0.24, local.y * 0.32), phase) * mix(0.34, 1.08, tower + crown);
                radius *= 0.96 + pulse * 0.08;

                float baseWave =
                    (noise(vec3(local * 0.18 + phase, uSeed * 0.11)) - 0.5) * 0.72 +
                    sin(local.x * 0.42 + phase) * 0.18 +
                    cos(local.y * 0.36 - phase * 0.7) * 0.16;
                float basePouch = lower * max(0.0, noise(vec3(local * 0.38, phase + uSeed * 0.07)) - 0.3) * 0.72;
                float localBase = baseH + baseWave - basePouch;
                float coreDistance = length(local);
                float coreTopLift = (1.0 - smoothstep(towerR * 0.65, towerR * 2.25, coreDistance)) * 0.95 * maturity;
                float outerAnvilDrop = smoothstep(towerR * 1.25, towerR + anvilR + baseR * 0.72, coreDistance) * cap * 0.96;
                float topWave = (noise(vec3(local * 0.18 + phase * 0.4, uSeed * 0.19)) - 0.5) * mix(0.28, 0.96, crown);
                float localTop = min(uTropopause + 0.55, topH + topWave + coreTopLift - outerAnvilDrop);

                float shape = r - radius;
                float bottomDist = localBase - p.y;
                float topDist = p.y - localTop;
                float verticalDist = smax(topDist, bottomDist, 0.72);
                return smax(shape, verticalDist, 1.16);
            }

            float ellipsoidSdf(vec3 p, vec3 center, vec3 radius) {
                vec3 q = (p - center) / radius;
                return (length(q) - 1.0) * min(radius.x, min(radius.y, radius.z));
            }

            float cbLobe(vec3 p, vec3 center, vec3 radius, float phase, float roughness) {
                vec3 local = p - center;
                float d = ellipsoidSdf(p, center, radius);
                float broad = noise(vec3(local.x * 0.22 + phase, local.y * 0.28, local.z * 0.22 - phase));
                float scallop =
                    sin(local.x * 0.72 + phase) *
                    cos(local.y * 0.54 - phase * 0.6) *
                    sin(local.z * 0.62 + phase * 0.3);
                return d - (broad - 0.48) * roughness * 0.72 - scallop * roughness * 0.16;
            }

            float addLobe(float field, vec3 p, vec3 center, vec3 radius, float phase, float roughness, float blend) {
                return smin(field, cbLobe(p, center, radius, phase, roughness), blend);
            }

            float sphericalRecipe(float slot) {
                return hash(uSeed * 0.0137 + slot * 17.371);
            }

            float sphericalTrait(float slot, float onset, float full) {
                return smoothstep(onset, full, sphericalRecipe(slot));
            }

            float morphologyMask(float style) {
                return 1.0 - step(0.5, abs(float(CUMULONIMBUS_MORPHOLOGY_STYLE) - style));
            }

            float morphologyForcedTrait(float seeded, float style, float strength) {
                return clamp(max(seeded, morphologyMask(style) * strength), 0.0, 1.0);
            }

            vec3 sphericalRecipeAxis(float slot) {
                float angle = sphericalRecipe(slot) * 6.28318;
                float z = mix(-0.72, 0.72, sphericalRecipe(slot + 0.37));
                float xy = sqrt(max(0.001, 1.0 - z * z));
                return normalize(vec3(cos(angle) * xy, z, sin(angle) * xy));
            }

            vec3 sphericalCloudCenter() {
                return vec3(
                    (hash(uSeed * 0.017 + 11.7) - 0.5) * 0.44,
                    mix(0.24, 0.82, hash(uSeed * 0.019 + 23.1)),
                    (hash(uSeed * 0.013 + 31.4) - 0.5) * 0.36
                );
            }

            float sphericalCloudRadius() {
                return mix(2.38, 2.92, hash(uSeed * 0.021 + 41.6));
            }

            float sphericalHeightCoverage(vec3 modelP) {
                vec3 center = sphericalCloudCenter();
                float radius = sphericalCloudRadius();
                float h = clamp((modelP.y - (center.y - radius)) / max(0.001, radius * 2.0), 0.0, 1.0);
                float buoyantCore = mix(0.42, 0.58, hash(uSeed * 0.027 + 53.2));
                float falloff = mix(1.34, 1.72, hash(uSeed * 0.031 + 61.8));
                float coverage = 1.0 - pow(abs(h - buoyantCore) * falloff, 2.0);
                return clamp(coverage, 0.22, 1.0);
            }

            vec3 sphericalMorphLocal(vec3 local, float phase) {
                float radius = sphericalCloudRadius();
                float curl01 = clamp(uCloudCurl / 1.2, 0.0, 1.0);
                float flattenTrait = sphericalTrait(62.0, 0.58, 0.92);
                float skewTrait = sphericalTrait(63.0, 0.52, 0.9);
                float twistTrait = sphericalTrait(64.0, 0.62, 0.94);
                float baselineStyle = morphologyMask(1.0);
                float skewTwistStyle = morphologyMask(4.0);
                flattenTrait = morphologyForcedTrait(flattenTrait, 3.0, 1.0) * (1.0 - baselineStyle);
                skewTrait = morphologyForcedTrait(skewTrait, 4.0, 1.0) * (1.0 - baselineStyle);
                twistTrait = morphologyForcedTrait(twistTrait, 4.0, 1.0) * (1.0 - baselineStyle);
                float h = clamp(local.y / max(0.001, radius * 2.0) + 0.5, 0.0, 1.0);
                vec2 windAxis = windShearAxis(uSeed * 0.006 + 9.0);
                vec2 crossAxis = vec2(-windAxis.y, windAxis.x);

                float verticalScale = mix(1.52, mix(0.46, 0.74, sphericalRecipe(65.0)), flattenTrait);
                verticalScale *= mix(1.0, 1.16, skewTwistStyle);
                local.y /= max(0.32, verticalScale);
                float flatWideScale = mix(1.0, mix(1.28, 1.82, sphericalRecipe(66.0)), flattenTrait);
                float flatNarrowScale = mix(1.0, mix(1.12, 1.54, sphericalRecipe(68.0)), flattenTrait);
                flatWideScale *= mix(1.0, 1.56, skewTwistStyle);
                flatNarrowScale *= mix(1.0, 1.28, skewTwistStyle);
                float alongWind = dot(local.xz, windAxis);
                float crossWind = dot(local.xz, crossAxis);
                local.xz = windAxis * (alongWind / flatWideScale) + crossAxis * (crossWind * flatNarrowScale);

                float skewProfile = mix(-0.54, 0.68, sphericalRecipe(67.0));
                float skewDirection = mix(-1.0, 1.0, step(0.5, sphericalRecipe(67.0)));
                skewProfile = mix(skewProfile, skewDirection * mix(0.74, 1.04, sphericalRecipe(72.0)), skewTwistStyle);
                float skew = (h - 0.5) * radius * skewProfile
                    * max(uWindShear, mix(0.0, 0.74, skewTwistStyle))
                    * mix(1.0, 2.45, skewTwistStyle)
                    * skewTrait;
                local.xz -= windAxis * skew;

                float twistAmount = mix(-1.55, 1.55, sphericalRecipe(70.0)) * curl01 * mix(0.22, 1.0, twistTrait) * mix(1.0, 1.64, skewTwistStyle);
                float turbulentTwist = (noise(local * 0.21 + vec3(phase, uSeed * 0.005, -phase)) - 0.5) * 0.28 * curl01 * twistTrait * mix(1.0, 1.9, skewTwistStyle);
                float twist = (h - 0.5) * twistAmount + turbulentTwist;
                mat2 twistMatrix = mat2(cos(twist), -sin(twist), sin(twist), cos(twist));
                local.xz = twistMatrix * local.xz;

                float lean = (h - 0.5) * radius * mix(-0.14, 0.22, sphericalRecipe(71.0))
                    * max(uWindShear, mix(0.0, 0.68, skewTwistStyle))
                    * mix(0.35, 1.0, skewTrait)
                    * mix(1.0, 2.4, skewTwistStyle);
                local.xz -= windAxis * lean;
                return local;
            }

            float sphericalSupercontrastBoundary(vec3 local, float phase, float coverage) {
                float r = max(0.001, length(local));
                vec3 normal = local / r;
                float curl01 = clamp(uCloudCurl / 1.2, 0.0, 1.0);
                float macroTrait = sphericalTrait(60.0, 0.62, 0.95);
                float macroPulse = sphericalTrait(61.0, 0.78, 0.97);
                float baselineStyle = morphologyMask(1.0);
                macroTrait = morphologyForcedTrait(macroTrait, 2.0, 1.0);
                macroPulse = morphologyForcedTrait(macroPulse, 2.0, 0.82);
                float macroStrength = clamp(macroTrait * 1.38 + macroPulse * 0.62, 0.0, 1.75);
                macroStrength *= 1.0 - baselineStyle;
                vec3 stretchAxis = sphericalRecipeAxis(80.0);
                vec3 protrudeAxis = sphericalRecipeAxis(90.0);
                vec3 compressAxis = sphericalRecipeAxis(100.0);

                float stretchGate = sphericalTrait(83.0, 0.46, 0.86);
                float protrudeGate = sphericalTrait(93.0, 0.48, 0.88);
                float compressGate = sphericalTrait(103.0, 0.52, 0.9);
                stretchGate = morphologyForcedTrait(stretchGate, 2.0, 1.0) * (1.0 - baselineStyle);
                protrudeGate = morphologyForcedTrait(protrudeGate, 2.0, 1.0) * (1.0 - baselineStyle);
                compressGate = morphologyForcedTrait(compressGate, 2.0, 0.68) * (1.0 - baselineStyle);
                float stretchPower = mix(1.25, 3.4, sphericalRecipe(81.0));
                float stretch = pow(abs(dot(normal, stretchAxis)), stretchPower)
                    * mix(0.10, 0.74, sphericalRecipe(82.0)) * stretchGate;
                float protrude = pow(max(0.0, dot(normal, protrudeAxis)), mix(1.65, 5.8, sphericalRecipe(91.0)))
                    * mix(0.12, 0.86, sphericalRecipe(92.0)) * protrudeGate;
                float compress = pow(max(0.0, dot(normal, compressAxis)), mix(1.4, 4.8, sphericalRecipe(101.0)))
                    * mix(0.10, 0.68, sphericalRecipe(102.0)) * compressGate;

                float contour = fbmAdaptive(normal * mix(4.8, 8.8, sphericalRecipe(110.0)) + vec3(phase * 0.12, uSeed * 0.004, -phase * 0.07));
                float hardRidge = smoothstep(0.54, 0.60, contour) * (1.0 - smoothstep(0.76, 0.86, contour));
                float hardNotch = smoothstep(0.20, 0.30, contour) * (1.0 - smoothstep(0.42, 0.50, contour));
                float contourGate = sphericalTrait(112.0, 0.62, 0.94) * smoothstep(0.08, 0.42, macroStrength);
                contourGate = max(contourGate, morphologyMask(2.0) * smoothstep(0.08, 0.42, macroStrength) * 0.85);
                float profile = stretch + protrude - compress + (hardRidge - hardNotch * 0.72) * mix(0.04, 0.32, sphericalRecipe(111.0)) * contourGate;
                return profile * macroStrength * mix(0.58, 1.18, curl01) * mix(0.72, 1.14, coverage);
            }

            float sphericalRadialVariation(vec3 local, float phase) {
                float r = max(0.001, length(local));
                vec3 normal = local / r;
                float curl = clamp(uCloudCurl, 0.0, 1.2);
                float drift = uTime * mix(0.018, 0.046, curl / 1.2);
                vec3 broadDomain = normal * mix(1.52, 2.48, hash(uSeed * 0.033 + 73.0))
                    + vec3(phase * 0.13 + drift, uSeed * 0.003, -phase * 0.09);
                vec3 cellularDomain = normal * mix(3.1, 5.2, hash(uSeed * 0.039 + 83.4))
                    + vec3(-phase * 0.11, phase * 0.07 + drift, uSeed * 0.005);
                float broad = fbmAdaptive(broadDomain);
                float cellular = fbmAdaptive(cellularDomain + broad * 0.8);
                float scallop =
                    sin(normal.x * mix(8.0, 14.0, hash(uSeed * 0.043 + 97.0)) + phase) *
                    cos(normal.y * mix(7.0, 11.0, hash(uSeed * 0.047 + 103.0)) - phase * 0.6) *
                    sin(normal.z * mix(8.0, 13.0, hash(uSeed * 0.051 + 109.0)) + phase * 0.3);
                float baselineStyle = morphologyMask(1.0);
                return ((broad - 0.5) * 0.52 + (cellular - 0.47) * 0.36 + scallop * 0.075)
                    * mix(0.48, 0.92, curl / 1.2)
                    * mix(1.0, 0.32, baselineStyle);
            }

            float mapSphericalCloudMacro(vec3 p) {
                vec3 modelP = worldToModelSpace(p);
                vec3 center = sphericalCloudCenter();
                float radius = sphericalCloudRadius();
                float phase = uSeed * 0.017 + uTime * 0.018;
                vec3 local = sphericalMorphLocal(modelP - center, phase);
                float coverage = sphericalHeightCoverage(modelP);
                float radialVariation = sphericalRadialVariation(local, phase);
                float boundaryProfile = sphericalSupercontrastBoundary(local, phase, coverage);
                float buoyancyInflation = (coverage - 0.56) * mix(0.18, 0.34, clamp(uCloudCurl, 0.0, 1.2) / 1.2);
                return length(local) - (radius + radialVariation + boundaryProfile + buoyancyInflation);
            }

            float mapBuddingCloudMacro(vec3 p) {
                vec3 modelP = worldToModelSpace(p);
                vec3 center = sphericalCloudCenter();
                float radius = sphericalCloudRadius();
                float phase = uSeed * 0.017 + uTime * 0.018;
                vec2 windAxis2 = windShearAxis(uSeed * 0.006 + 9.0);
                vec3 budDir = normalize(vec3(
                    mix(0.82, 1.0, abs(windAxis2.x)) * sign(windAxis2.x + 0.001),
                    mix(0.1, 0.28, sphericalRecipe(150.0)),
                    windAxis2.y * 0.18
                ));

                vec3 mainLocal = sphericalMorphLocal(modelP - center, phase);
                float mainCoverage = sphericalHeightCoverage(modelP);
                float mainProfile = sphericalRadialVariation(mainLocal, phase) * 0.68
                    + sphericalSupercontrastBoundary(mainLocal, phase, mainCoverage) * 0.32;
                float main = length(mainLocal) - radius * 0.96 - mainProfile;

                vec3 budCenter = center + budDir * radius * mix(0.72, 0.86, sphericalRecipe(151.0));
                budCenter.y += radius * mix(-0.02, 0.16, sphericalRecipe(152.0));
                float budRadius = radius * mix(0.42, 0.58, sphericalRecipe(153.0));
                vec3 budLocal = sphericalMorphLocal(modelP - budCenter, phase + 1.7);
                float budProfile = sphericalRadialVariation(budLocal * 1.18, phase + 1.7) * 0.38
                    + sphericalSupercontrastBoundary(budLocal, phase + 1.7, 0.74) * 0.18;
                float bud = length(budLocal) - budRadius - budProfile;

                vec3 neckCenter = center + budDir * radius * 0.66;
                neckCenter.y += radius * 0.04;
                float neck = length(modelP - neckCenter) - radius * mix(0.34, 0.48, sphericalRecipe(154.0));
                return smin(smin(main, bud, radius * 0.34), neck, radius * 0.24);
            }

            float mapOriginalGiantCumulonimbusMacro(vec3 p) {
                float widthStretch = mix(1.0, 1.12, smoothstep(0.5, 2.0, uAspect));
                vec3 layoutP = p;
                layoutP.x /= widthStretch;
                vec3 modelP = worldToModelSpace(layoutP);
                float photo = uPhotographicStyle;
                float seedPhase = uSeed * 0.0027;

                float tower = getCell01(
                    modelP,
                    vec2(0.0, 0.0),
                    mix(3.55, 2.28, photo),
                    seedPhase,
                    5.35,
                    0.64,
                    1.54,
                    0.0,
                    mix(1.26, 0.94, photo)
                );
                float feederLeft = getCell01(
                    modelP,
                    vec2(-2.04, -0.64),
                    mix(2.72, 1.82, photo),
                    seedPhase + 2.1,
                    mix(4.25, 3.58, photo),
                    0.78,
                    1.16,
                    0.16,
                    mix(0.88, 0.56, photo)
                );
                float feederRight = getCell01(
                    modelP,
                    vec2(1.82, 0.56),
                    mix(2.48, 1.68, photo),
                    seedPhase + 4.2,
                    mix(4.7, 3.82, photo),
                    0.84,
                    1.92,
                    0.12,
                    mix(1.08, 0.7, photo)
                );

                float macro = smin(tower, feederLeft, mix(1.38, 0.96, photo));
                macro = smin(macro, feederRight, mix(1.24, 0.88, photo));
                float capLimiter = modelP.y - (MODEL_LOCAL_TROPO + 0.32 + (noise(vec3(modelP.xz * 0.18, uSeed * 0.23)) - 0.5) * 0.18);
                float groundLimiter = (MODEL_LOCAL_BASE - 0.42) - modelP.y;
                return smax(smax(macro, capLimiter, 0.2), groundLimiter, 0.26);
            }

            float mapMobileCumulusMacro(vec3 p) {
                float widthStretch = mix(1.0, 1.08, smoothstep(0.5, 2.0, uAspect));
                vec3 layoutP = p;
                layoutP.x /= widthStretch;
                vec3 modelP = worldToModelSpace(layoutP);
                vec3 cloudP = modelP;
                cloudP.x *= 0.82;
                cloudP.z *= 0.90;
                cloudP.y = (modelP.y + 0.62) * 0.88 - 0.62;
                float phase = uSeed * 0.017 + uTime * 0.018;

                float macro = ellipsoidSdf(cloudP, vec3(0.0, -1.34, 0.0), vec3(2.7, 0.68, 1.36));
                macro = addLobe(macro, cloudP, vec3(-1.52, -1.03, 0.08), vec3(1.0, 0.74, 0.86), phase + 0.4, 0.28, 0.46);
                macro = addLobe(macro, cloudP, vec3(-0.56, -0.58, -0.06), vec3(1.0, 0.92, 0.88), phase + 1.7, 0.26, 0.44);
                macro = addLobe(macro, cloudP, vec3(0.42, -0.46, 0.02), vec3(1.14, 0.98, 0.94), phase + 2.9, 0.26, 0.46);
                macro = addLobe(macro, cloudP, vec3(1.42, -1.0, -0.08), vec3(0.92, 0.72, 0.78), phase + 4.2, 0.28, 0.42);
                macro = addLobe(macro, cloudP, vec3(-0.18, 0.22, 0.02), vec3(0.9, 0.72, 0.76), phase + 5.4, 0.22, 0.38);
                macro = addLobe(macro, cloudP, vec3(0.74, 0.02, -0.04), vec3(0.82, 0.62, 0.7), phase + 6.2, 0.2, 0.34);

                if (uSystemCount > 1.5) {
                    vec3 secondP = cloudP - vec3(3.25, 0.08, -0.34);
                    float second = ellipsoidSdf(secondP, vec3(0.0, -1.22, 0.0), vec3(1.78, 0.58, 1.02));
                    second = addLobe(second, secondP, vec3(-0.72, -0.86, 0.02), vec3(0.72, 0.58, 0.66), phase + 7.1, 0.26, 0.34);
                    second = addLobe(second, secondP, vec3(0.34, -0.42, -0.02), vec3(0.82, 0.72, 0.70), phase + 8.3, 0.24, 0.36);
                    second = addLobe(second, secondP, vec3(0.06, 0.08, 0.04), vec3(0.66, 0.54, 0.58), phase + 9.2, 0.2, 0.30);
                    macro = smin(macro, second, 0.72);
                }

                float baseWave =
                    (noise(vec3(cloudP.xz * 0.42 + phase, uSeed * 0.17)) - 0.5) * 0.36 +
                    sin(cloudP.x * 0.78 + phase) * 0.08;
                float bottomLimiter = (MODEL_LOCAL_BASE + 0.64 + baseWave) - cloudP.y;
                float topLimiter = cloudP.y - (MODEL_LOCAL_BASE + 3.92 + baseWave * 0.08);
                float sideLimiter = length(cloudP.xz * vec2(0.52, 0.86)) - 2.72;
                return smax(smax(smax(macro, bottomLimiter, 0.44), topLimiter, 0.34), sideLimiter, 0.54);
            }

            float mapCloudMacro(vec3 p) {
                float macro = 0.0;
                if (uMobileCumulusMode > 0.5) {
                    macro = mapMobileCumulusMacro(p);
                } else {
#if CUMULONIMBUS_SINGLE_CLOUD
#if CUMULONIMBUS_MORPHOLOGY_STYLE == 7
                    macro = mapOriginalGiantCumulonimbusMacro(p);
#elif CUMULONIMBUS_MORPHOLOGY_STYLE == 6
                    macro = mapBuddingCloudMacro(p);
#else
                    macro = mapSphericalCloudMacro(p);
#endif
#else

                    float widthStretch = mix(1.0, 1.2, smoothstep(0.5, 2.0, uAspect));
                    vec3 layoutP = p;
                    layoutP.x /= widthStretch;

                    vec3 modelP = worldToModelSpace(layoutP);
                    float photo = uPhotographicStyle;
                    float layoutMode = mod(floor(abs(uSeed)), 3.0);
                    float triangleLayout = step(0.5, layoutMode) * (1.0 - step(1.5, layoutMode));
                    float clusterLayout = step(1.5, layoutMode);
                    vec2 c2Offset = mix(vec2(3.75, -1.35), vec2(-2.45, -1.28), triangleLayout);
                    c2Offset = mix(c2Offset, vec2(1.1, -0.58), clusterLayout);
                    vec2 c3Offset = mix(vec2(-3.2, 1.55), vec2(2.5, -1.12), triangleLayout);
                    c3Offset = mix(c3Offset, vec2(-0.86, 0.78), clusterLayout);
                    float c2Blend = mix(mix(1.35, 0.92, photo), mix(1.58, 1.06, photo), triangleLayout);
                    c2Blend = mix(c2Blend, mix(1.8, 1.18, photo), clusterLayout);
                    float c3Blend = mix(mix(1.45, 0.96, photo), mix(1.58, 1.06, photo), triangleLayout);
                    c3Blend = mix(c3Blend, mix(1.82, 1.2, photo), clusterLayout);

                    float c1 = getCell01(modelP, vec2(0.0, 0.0), mix(3.2, 1.95, photo), 0.0, 5.0, 1.0, 0.0, 0.02, 1.0);
                    macro = c1;
                    if (uSystemCount >= 1.5) {
                        float c2 = getCell01(modelP, c2Offset, mix(2.8, 1.65, photo), 2.0, mix(3.75, 3.35, photo), 0.82, 1.12, 0.28, mix(0.8, 0.48, photo));
                        macro = smin(macro, c2, c2Blend);
                    }
                    if (uSystemCount >= 2.5) {
                        float c3 = getCell01(modelP, c3Offset, mix(2.65, 1.75, photo), 4.0, 4.55, 1.26, 4.85, 0.1, mix(1.14, 0.74, photo));
                        macro = smin(macro, c3, c3Blend);
                    }
                    for (int i = 3; i < 10; i++) {
                        float fi = float(i);
                        if (uSystemCount < fi + 0.5) {
                            continue;
                        }
                        float phase = fi * 1.73 + 0.9;
                        float angle = fi * 2.399963 + uSeed * 0.00037;
                        float ring = mix(4.2, 8.6, hash(fi * 17.13 + uSeed * 0.004));
                        vec2 jitter = vec2(
                            hash(fi * 29.7 + uSeed * 0.011) - 0.5,
                            hash(fi * 41.1 + uSeed * 0.013) - 0.5
                        ) * 1.65;
                        vec2 offset = vec2(cos(angle), sin(angle)) * ring + jitter;
                        float maxR = mix(1.55, 2.65, hash(fi * 53.9 + uSeed * 0.007));
                        float maxH = mix(3.15, 5.0, hash(fi * 67.1 + uSeed * 0.009));
                        float speedScale = mix(0.72, 1.32, hash(fi * 71.3 + uSeed * 0.003));
                        float ageOffset = hash(fi * 83.5 + uSeed * 0.005) * 6.28318;
                        float earlyDecay = hash(fi * 97.7 + uSeed * 0.006) * 0.34;
                        float anvilScale = mix(0.58, 1.12, hash(fi * 101.9 + uSeed * 0.008));
                        float cell = getCell01(modelP, offset, maxR, phase, maxH, speedScale, ageOffset, earlyDecay, anvilScale);
                        macro = smin(macro, cell, mix(1.08, 0.82, photo));
                    }
                    float capLimiter = modelP.y - (MODEL_LOCAL_TROPO + 0.2 + (noise(vec3(modelP.xz * 0.18, uSeed * 0.23)) - 0.5) * 0.14);
                    float groundLimiter = (MODEL_LOCAL_BASE - 0.35) - modelP.y;
                    macro = smax(smax(macro, capLimiter, 0.18), groundLimiter, 0.22);
#endif
                }
                return macro;
            }

            float mapCloudFromMacro(vec3 p, float macro) {
                if (macro >= 1.0) {
                    return 0.0;
                }

                vec3 q = worldToModelSpace(p);
                if (uMobileCumulusMode > 0.5) {
                    q.x *= 0.82;
                    q.z *= 0.90;
                    q.y = (q.y + 0.62) * 0.88 - 0.62;
                }

                vec3 baseQ = q;
                q.y -= uTime * 0.25;
                q.x += uTime * 0.05;
                float heightRange = max(0.1, uTropopause - MODEL_BASE_KM);
                float height01 = clamp((p.y - MODEL_BASE_KM) / heightRange, 0.0, 1.0);

                float d = -macro;
                if (d > -1.0) {
                    float stormAngle = uTime * 0.075 + uSeed * 0.00107;
                    float stormCycle = sin(stormAngle) * 0.5 + 0.5;
                    float stormFalling = smoothstep(0.44, 0.9, -cos(stormAngle) * 0.5 + 0.5);
                    float dissipating = stormFalling * smoothstep(0.46, 0.92, stormCycle);
                    float anvilBand = smoothstep(0.72, 0.94, height01);
                    float freezing01 = clamp((uFreezingLevel - MODEL_BASE_KM) / heightRange, 0.0, 1.0);
                    float mixedPhaseBand = smoothstep(freezing01 - 0.08, freezing01 + 0.16, height01)
                        * (1.0 - smoothstep(0.72, 0.9, height01));
                    float iceFactor = iceFactorAtHeight(p.y);
                    float towerErosionBand = smoothstep(0.08, 0.24, height01) * (1.0 - smoothstep(0.58, 0.82, height01));
                    if (uMobileCumulusMode > 0.5) {
                        dissipating = 0.0;
                        anvilBand = 0.0;
                        mixedPhaseBand *= 0.35;
                        iceFactor = 0.0;
                        towerErosionBand *= 0.28;
                    }
                    float downdraftColumn = smoothstep(
                        0.38,
                        0.88,
                        noise(vec3(q.xz * 0.28 + vec2(uTime * 0.018, -uTime * 0.01), q.y * 0.22 + uSeed * 0.09))
                    );
                    float settlingAnvil = smoothstep(
                        0.44,
                        0.9,
                        noise(vec3(q.x * 0.18 - uTime * 0.015, q.z * 0.22 + uSeed * 0.05, q.y * 0.11))
                    );
                    float photo = uPhotographicStyle;
                    float mobileFullness = step(0.5, uMobileCumulusMode);
                    float carving = noise(q * 0.4 + uTime * 0.1) * mix(1.5, 1.28, photo) * mix(1.0, 0.72, mobileFullness);
                    float details = fbmAdaptive(q * 1.2) * 1.0;
                    float microBillow = fbmAdaptive(vec3(q.x * 1.9, q.y * 2.05, q.z * 1.9) + vec3(uSeed * 0.017, 1.9, uTime * 0.04));
                    float broadBillow = fbmAdaptive(vec3(q.x * 0.92, q.y * 1.24, q.z * 0.92) + vec3(uSeed * 0.023, 6.1, -uTime * 0.02));
#if CUMULONIMBUS_SINGLE_CLOUD
#if CUMULONIMBUS_MORPHOLOGY_STYLE == 7
                    float sphereCoverage = 0.74;
                    float coverageErosion = broadBillow;
                    float surfaceTrait = 0.0;
                    float silkTrait = 0.0;
                    float tearTrait = 0.0;
                    float windTear = 0.0;
                    float fuzzyShell = smoothstep(-0.36, 0.82, macro) * (1.0 - smoothstep(0.84, 1.0, macro));
                    float silkEdge = 0.0;
                    float leeEdge = 0.0;
                    float tearNoise = 0.0;
                    carving *= 0.78;
                    details *= 0.95;
#else
                    float sphereCoverage = sphericalHeightCoverage(baseQ);
                    float baselineStyle = morphologyMask(1.0);
                    float tearSilkStyle = morphologyMask(5.0);
                    float coverageErosion = fbmAdaptive(vec3(
                        baseQ.x * 0.42 + uTime * 0.036,
                        baseQ.y * 0.34 + uSeed * 0.011,
                        baseQ.z * 0.42 - uTime * 0.018
                    ));
                    float spherePhase = uSeed * 0.017 + uTime * 0.018;
                    vec3 sphereLocal = sphericalMorphLocal(baseQ - sphericalCloudCenter(), spherePhase);
                    float sphereRadius = sphericalCloudRadius();
                    vec2 sphereWindAxis = windShearAxis(uSeed * 0.006 + 9.0);
                    vec2 sphereCrossAxis = vec2(-sphereWindAxis.y, sphereWindAxis.x);
                    float sphereDownwind = dot(sphereLocal.xz, sphereWindAxis) / max(0.001, sphereRadius);
                    float sphereCrosswind = dot(sphereLocal.xz, sphereCrossAxis) / max(0.001, sphereRadius);
                    float fuzzyShell = smoothstep(-0.36, 0.82, macro) * (1.0 - smoothstep(0.84, 1.0, macro));
                    float leeEdge = smoothstep(0.04, 0.96, sphereDownwind) * fuzzyShell;
                    float fiberNoise = noise(vec3(
                        sphereDownwind * mix(3.4, 5.8, sphericalRecipe(120.0)) + uTime * 0.055,
                        sphereCrosswind * mix(7.0, 13.0, sphericalRecipe(121.0)),
                        baseQ.y * mix(1.2, 2.4, sphericalRecipe(122.0)) + uSeed * 0.018
                    ));
                    float silkEdge = smoothstep(mix(0.50, 0.62, sphericalRecipe(123.0)), 0.88, fiberNoise) * fuzzyShell;
                    float tearNoise = fbmAdaptive(vec3(
                        sphereDownwind * 2.8 + uTime * 0.04,
                        sphereCrosswind * 3.7 + uSeed * 0.009,
                        baseQ.y * 1.1 - uTime * 0.026
                    ));
                    float surfaceTrait = sphericalTrait(128.0, 0.68, 0.96);
                    float silkTrait = sphericalTrait(129.0, 0.84, 0.99);
                    float tearTrait = sphericalTrait(130.0, 0.84, 0.99);
                    surfaceTrait = morphologyForcedTrait(surfaceTrait, 5.0, 0.92) * (1.0 - baselineStyle);
                    silkTrait = morphologyForcedTrait(silkTrait, 5.0, 1.0) * (1.0 - baselineStyle);
                    tearTrait = morphologyForcedTrait(tearTrait, 5.0, 1.0) * (1.0 - baselineStyle);
                    float windTear = leeEdge * smoothstep(mix(0.40, 0.60, sphericalRecipe(124.0)), 0.86, tearNoise)
                        * mix(0.45, 1.28, uWindShear) * mix(1.0, 1.34, tearSilkStyle) * tearTrait;
                    details *= mix(0.95, 1.08 + clamp(uCloudCurl, 0.0, 1.2) * 0.1, surfaceTrait);
#endif
#endif
                    vec2 iceAxis = windShearAxis(uSeed * 0.003 + 4.0);
                    float iceFiber = noise(vec3(
                        dot(q.xz, iceAxis) * 0.18 + uTime * 0.026,
                        q.y * 1.75,
                        dot(q.xz, vec2(-iceAxis.y, iceAxis.x)) * 0.56 + uSeed * 0.011
                    ));
                    float towerBand = smoothstep(0.12, 0.58, height01) * (1.0 - smoothstep(0.78, 1.02, height01));
                    float surfaceShell = smoothstep(-0.7, 0.16, macro) * (1.0 - smoothstep(0.18, 0.82, macro));
                    d += details - carving * 0.8;
#if CUMULONIMBUS_SINGLE_CLOUD
                    float coreFullness = 1.0 - smoothstep(-0.48, 0.22, macro);
                    d += coreFullness * mix(0.18, 0.08, surfaceTrait);
                    d *= mix(0.88, 1.12, sphereCoverage);
                    d += (sphereCoverage - 0.5) * 0.14;
                    d += surfaceShell * (coverageErosion - 0.5) * mix(0.04, 0.34, surfaceTrait) * mix(0.74, 1.2, clamp(uCloudCurl, 0.0, 1.2) / 1.2);
                    d -= surfaceShell * smoothstep(0.70, 0.94, coverageErosion) * mix(0.02, 0.12, surfaceTrait);
                    d -= surfaceShell * windTear * mix(0.24, 0.64, sphericalRecipe(125.0));
                    d += fuzzyShell * silkEdge * silkTrait * mix(0.08, 0.26, sphericalRecipe(126.0)) * (1.0 - windTear * 0.5);
                    d += leeEdge * tearTrait * (1.0 - smoothstep(0.52, 0.92, tearNoise)) * mix(0.03, 0.14, sphericalRecipe(127.0));
#endif
                    d += mobileFullness * smoothstep(-0.62, 0.12, macro) * (1.0 - smoothstep(0.20, 0.74, macro)) * 0.18;
                    d += surfaceShell * towerBand * (microBillow - 0.46) * mix(0.42, 0.74, photo);
                    d += surfaceShell * (1.0 - anvilBand) * (broadBillow - 0.44) * mix(0.0, 0.42, photo);
                    d -= surfaceShell * towerBand * smoothstep(0.58, 0.94, broadBillow) * mix(0.0, 0.18, photo);
                    d += mixedPhaseBand * surfaceShell * 0.14;
                    d += anvilBand * iceFactor * (iceFiber - 0.42) * 0.38;
                    d -= anvilBand * iceFactor * smoothstep(0.72, 0.98, iceFiber) * 0.12;
                    float edgeBand = smoothstep(-0.72, 0.34, macro);
                    float edgeCuts = noise(vec3(q.x * 0.82 + uSeed * 0.019, q.y * 0.92, q.z * 0.82 - uTime * 0.03));
                    d -= edgeBand * smoothstep(0.5, 0.86, edgeCuts) * mix(0.24, 0.38, photo) * mix(1.0, 0.42, mobileFullness);
                    float raggedFloor =
                        MODEL_LOCAL_BASE +
                        (noise(vec3(baseQ.xz * 0.58 + uSeed * 0.13, uSeed * 0.29)) - 0.5) * 0.68 +
                        sin(baseQ.x * 0.72 + uSeed * 0.04) * 0.12;
                    float undersideBand = 1.0 - smoothstep(raggedFloor - 0.12, raggedFloor + 0.52, baseQ.y);
                    float undersidePocket = smoothstep(
                        0.32,
                        0.88,
                        noise(vec3(baseQ.xz * 1.18 + vec2(3.4, 7.1), uSeed * 0.41))
                    );
                    d -= undersideBand * undersidePocket * mix(0.42, 0.18, mobileFullness);
                    d -= dissipating * towerErosionBand * downdraftColumn * 0.72;
                    d -= dissipating * undersideBand * 0.22;
                    d += dissipating * anvilBand * (1.0 - settlingAnvil * 0.68) * 0.12;
                    d -= dissipating * anvilBand * settlingAnvil * 0.16;
                }
                return clamp(d, 0.0, 1.0);
            }

            float mapCloud(vec3 p) {
                return mapCloudFromMacro(p, mapCloudMacro(p));
            }

            float phaseHG(float cosTheta, float g) {
                float g2 = g * g;
                return (1.0 - g2) / (4.0 * 3.14159 * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
            }

            vec3 ACESFilm(vec3 x) {
                float a = 2.51; float b = 0.03; float c = 2.43; float d = 0.59; float e = 0.14;
                return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
            }

            vec3 nitsToPq(vec3 nits) {
                const float m1 = 2610.0 / 16384.0;
                const float m2 = 2523.0 / 32.0;
                const float c1 = 3424.0 / 4096.0;
                const float c2 = 2413.0 / 128.0;
                const float c3 = 2392.0 / 128.0;
                vec3 normalized = clamp(nits / 10000.0, 0.0, 1.0);
                vec3 powered = pow(normalized, vec3(m1));
                return clamp(pow((c1 + c2 * powered) / (1.0 + c3 * powered), vec3(m2)), 0.0, 1.0);
            }

            float sceneLinearToDisplayNits(float value, float highlightPeakNits) {
                const float diffuseWhiteNits = 203.0;
                float linear = max(0.0, value);
                if (linear <= 1.0) {
                    return linear * diffuseWhiteNits;
                }
                float highlight = 1.0 - exp(-(linear - 1.0) * 1.15);
                return diffuseWhiteNits + highlight * (max(diffuseWhiteNits, highlightPeakNits) - diffuseWhiteNits);
            }

            vec3 hdr10ReferencePreview(vec3 sceneLinear, float densityAcc, float sunHeight01, float sunForward) {
                const float clearSkyLowNits = 1000.0;
                const float clearSkyHighNits = 20000.0;
                const float sunlitCloudNits = 12000.0;
                float naturalSkyNits = mix(clearSkyLowNits, clearSkyHighNits, sunHeight01);
                float cloudForwardScatter = smoothstep(0.12, 0.92, sunForward);
                float naturalCloudNits = mix(650.0, sunlitCloudNits, sunHeight01) * mix(0.76, 1.22, cloudForwardScatter);
                float naturalSceneNits = mix(naturalSkyNits, naturalCloudNits, densityAcc);
                float highlightPeakNits = 203.0 + (uHdrReferencePeakNits - 203.0) * (1.0 - exp(-naturalSceneNits / 7200.0));
                vec3 mappedNits = vec3(
                    sceneLinearToDisplayNits(sceneLinear.r, highlightPeakNits),
                    sceneLinearToDisplayNits(sceneLinear.g, highlightPeakNits),
                    sceneLinearToDisplayNits(sceneLinear.b, highlightPeakNits)
                );
                vec3 pqCode = nitsToPq(mappedNits);
                vec3 daylightBalance = mix(vec3(0.92, 0.96, 1.04), vec3(1.06, 1.02, 0.94), sunHeight01 * (0.35 + cloudForwardScatter * 0.45));
                return clamp(pow(pqCode, vec3(1.0 / 1.18)) * daylightBalance, 0.0, 1.0);
            }

            float interleavedGradientNoise(vec2 pixel) {
                return fract(52.9829189 * fract(0.06711056 * pixel.x + 0.00583715 * pixel.y));
            }

            vec3 applyDisplayDither(vec3 displayColor) {
                if (uDitherEnabled < 0.5) {
                    return displayColor;
                }
                float dither = interleavedGradientNoise(gl_FragCoord.xy) - 0.5;
                return clamp(displayColor + vec3(dither / 255.0), 0.0, 1.0);
            }

            vec3 gridOverlay(vec3 col, vec3 ro, vec3 rd) {
                if (uShowGrid < 0.5) return col;

                if (abs(rd.y) > 0.001) {
                    float tG = (0.0 - ro.y) / rd.y;
                    if (tG > 0.0 && tG < 160.0) {
                        vec3 pG = ro + rd * tG;
                        if (length(pG.xz) <= 15.0) {
                            float radius = length(pG.xz);
                            vec2 oneKmCell = abs(fract(pG.xz + 0.5) - 0.5);
                            vec2 fiveKmCell = abs(fract(pG.xz / 5.0 + 0.5) - 0.5) * 5.0;
                            float oneKmDist = min(oneKmCell.x, oneKmCell.y);
                            float fiveKmDist = min(fiveKmCell.x, fiveKmCell.y);
                            float oneKmAa = max(fwidth(oneKmDist), 0.002);
                            float fiveKmAa = max(fwidth(fiveKmDist), 0.002);
                            float ringDist = abs(fract(radius / 5.0 + 0.5) - 0.5) * 5.0;
                            float ringAa = max(fwidth(ringDist), 0.002);
                            float minor = 1.0 - smoothstep(0.035, 0.035 + oneKmAa, oneKmDist);
                            float major = 1.0 - smoothstep(0.065, 0.065 + fiveKmAa, fiveKmDist);
                            float ring = (1.0 - smoothstep(0.07, 0.07 + ringAa, ringDist)) * smoothstep(0.8, 1.4, radius);
                            float axis = max(
                                1.0 - smoothstep(0.09, 0.09 + max(fwidth(pG.x), 0.002), abs(pG.x)),
                                1.0 - smoothstep(0.09, 0.09 + max(fwidth(pG.z), 0.002), abs(pG.z))
                            );
                            float line = max(minor * 0.38, max(major * 0.72, max(ring * 0.62, axis)));
                            vec3 gridCol = mix(vec3(0.03, 0.22, 0.46), vec3(0.08, 0.48, 0.92), max(major, axis));
                            col = mix(col, gridCol, line * exp(-tG * 0.012));
                        }
                    }
                }

                float aCyl = dot(rd.xz, rd.xz);
                float bCyl = 2.0 * dot(ro.xz, rd.xz);
                float cCyl = dot(ro.xz, ro.xz) - 0.018;
                float disc = bCyl * bCyl - 4.0 * aCyl * cCyl;
                if (disc > 0.0 && aCyl > 0.0001) {
                    float tR = (-bCyl - sqrt(disc)) / (2.0 * aCyl);
                    if (tR > 0.0 && tR < 160.0) {
                        vec3 pR = ro + rd * tR;
                        if (pR.y >= 0.0 && pR.y <= uTropopause + 1.0) {
                            float band = mod(floor(pR.y), 2.0);
                            vec3 rCol = (band < 0.5) ? vec3(0.86, 0.08, 0.08) : vec3(0.92, 0.92, 0.88);
                            float rim = smoothstep(0.2, 0.0, length(pR.xz));
                            col = mix(col, rCol * (0.35 + 0.65 * rim), 0.95);
                        }
                    }
                }
                return col;
            }

            vec3 surfaceOverlay(vec3 col, vec3 ro, vec3 rd, vec3 lightDir, vec3 ambientColor) {
                if (uSurfaceVisible < 0.5 || abs(rd.y) <= 0.001) return col;
                float tS = (0.0 - ro.y) / rd.y;
                if (tS <= 0.0 || tS > 220.0) return col;

                vec3 pS = ro + rd * tS;
                float rangeFade = 1.0 - smoothstep(28.0, 92.0, length(pS.xz));
                if (rangeFade <= 0.0) return col;

                float terrainNoise = fbm(vec3(pS.xz * 0.075, uSeed * 0.03));
                float ridge = smoothstep(0.42, 0.84, terrainNoise);
                vec3 normal = normalize(vec3(
                    noise(vec3(pS.xz * 0.12 + vec2(1.7, 0.0), uSeed * 0.04)) - 0.5,
                    1.45,
                    noise(vec3(pS.xz * 0.12 + vec2(0.0, 3.1), uSeed * 0.04)) - 0.5
                ));
                float diffuse = clamp(dot(normal, lightDir) * 0.5 + 0.5, 0.0, 1.0);
                float horizonFade = smoothstep(0.0, 0.12, -rd.y);

                vec3 oceanBase = mix(vec3(0.012, 0.11, 0.19), vec3(0.08, 0.34, 0.48), ridge);
                float wave = sin(pS.x * 0.38 + uTime * 0.35) * sin(pS.z * 0.31 - uTime * 0.22);
                float glint = pow(max(0.0, dot(reflect(rd, vec3(0.0, 1.0, 0.0)), lightDir)), 52.0);
                float horizonLine = 1.0 - smoothstep(0.006, 0.05, abs(pS.y));
                vec3 ocean = oceanBase
                    + vec3(0.05, 0.1, 0.12) * wave * 0.12
                    + vec3(0.9, 0.82, 0.55) * glint * 0.42
                    + vec3(0.12, 0.28, 0.34) * horizonLine;

                vec3 hillLow = vec3(0.12, 0.16, 0.09);
                vec3 hillHigh = vec3(0.34, 0.30, 0.18);
                vec3 hills = mix(hillLow, hillHigh, ridge) * (0.45 + diffuse * 0.62) + ambientColor * 0.24;
                vec3 surfaceColor = mix(ocean, hills, step(0.5, uSurfaceMode));
                float surfaceAlpha = rangeFade * horizonFade * mix(0.72, 0.98, smoothstep(-0.18, -0.02, rd.y));
                return mix(col, surfaceColor, surfaceAlpha);
            }

            void main() {
                vec2 res = max(uResolution, vec2(1.0));
                vec2 uv = (gl_FragCoord.xy - 0.5 * res.xy) / res.y;
                vec3 ro = uCameraPos;
                vec3 target = uCameraTarget;
                vec3 forward = normalize(target - ro);
                vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
                vec3 up = cross(right, forward);
                vec3 rd;

                if (uIsOrtho > 0.5) {
                    ro = ro + right * uv.x * uOrthoSize + up * uv.y * uOrthoSize * uOrthoVerticalScale;
                    rd = forward;
                } else {
                    float fovScale = mix(1.0, 1.2, smoothstep(0.5, 2.0, uAspect));
                    rd = normalize(forward * fovScale + uv.x * right + uv.y * up);
                }

                float sunElevationRad = radians(uSunElevation);
                float sunViewerAngleRad = radians(uSunViewerAngle);
                vec3 viewerForwardFlat = vec3(forward.x, 0.0, forward.z);
                vec3 viewerForwardXZ = dot(viewerForwardFlat, viewerForwardFlat) < 0.0001
                    ? vec3(0.0, 0.0, -1.0)
                    : normalize(viewerForwardFlat);
                vec3 viewerRightFlat = vec3(right.x, 0.0, right.z);
                vec3 viewerRightXZ = dot(viewerRightFlat, viewerRightFlat) < 0.0001
                    ? vec3(1.0, 0.0, 0.0)
                    : normalize(viewerRightFlat);
                vec3 sunAzimuthDir = normalize(viewerForwardXZ * cos(sunViewerAngleRad) + viewerRightXZ * sin(sunViewerAngleRad));
                vec3 daylightDir = normalize(sunAzimuthDir * cos(sunElevationRad) + vec3(0.0, sin(sunElevationRad), 0.0));
                vec3 goldenDir = normalize(vec3(-0.92, 0.34, 0.2));
                vec3 backlitDir = normalize(vec3(0.18, 0.52, 0.86));
                vec3 lightDir = normalize(mix(daylightDir, goldenDir, step(0.5, uLightPreset) * (1.0 - step(1.5, uLightPreset))));
                lightDir = normalize(mix(lightDir, backlitDir, step(1.5, uLightPreset)));
                float sunSin = sin(sunElevationRad);
                float forcedMoonNight = step(2.5, uSkyMode) * (1.0 - step(3.5, uSkyMode));
                float sunHeight01 = smoothstep(-0.08, 0.70, sunSin);
                float night01 = max(1.0 - smoothstep(-0.26, -0.02, sunSin), forcedMoonNight);
                vec3 lowSunLight = mix(vec3(1.0, 0.16, 0.055), vec3(1.0, 0.54, 0.24), smoothstep(-0.08, 0.14, sunSin));
                vec3 highSunLight = vec3(1.0, 0.93, 0.82);
                vec3 solarLightColor = mix(lowSunLight, highSunLight, sunHeight01);
                solarLightColor = mix(solarLightColor, vec3(1.0, 0.78, 0.52), step(0.5, uLightPreset) * (1.0 - step(1.5, uLightPreset)));
                solarLightColor = mix(solarLightColor, vec3(0.95, 0.9, 1.0), step(1.5, uLightPreset));
                vec3 moonDir = normalize(vec3(-0.34, 0.55, 0.76));
                lightDir = normalize(mix(lightDir, moonDir, night01 * 0.86));
                vec3 moonLightColor = vec3(0.038, 0.056, 0.13) * night01 * mix(0.50, 0.64, uPhotographicStyle);
                vec3 lightColor = solarLightColor * uSunIntensity * (1.0 - night01 * 0.92) + moonLightColor;
                vec3 dayAmbient = mix(vec3(0.065, 0.085, 0.16), vec3(0.18, 0.24, 0.34), max(uPhotographicStyle, sunHeight01 * 0.55)) * uAmbientIntensity;
                vec3 nightAmbient = vec3(0.005, 0.008, 0.026) * mix(0.62, 0.82, uPhotographicStyle);
                vec3 ambientColor = mix(dayAmbient, nightAmbient, night01);
                float skyT = smoothstep(0.0, 1.0, clamp(uv.y + 0.5, 0.0, 1.0));
                float screenY = clamp(gl_FragCoord.y / res.y, 0.0, 1.0);
                vec3 localhostBottomSky = vec3(0.055, 0.078, 0.145);
                vec3 localhostTopSky = vec3(0.044, 0.064, 0.125);
                vec3 workbenchSky = mix(localhostBottomSky, localhostTopSky, screenY) * uAmbientIntensity;
                vec3 clearSky = workbenchSky;
                vec3 sunsetSky = mix(vec3(0.86, 0.42, 0.22), vec3(0.08, 0.12, 0.34), skyT) * uAmbientIntensity;
                vec3 moonSky = mix(vec3(0.012, 0.020, 0.052), vec3(0.0015, 0.004, 0.018), skyT) * max(0.72, uAmbientIntensity);
                vec2 starUv = vec2(atan(rd.x, rd.z) * 0.15915494 + 0.5, asin(clamp(rd.y, -1.0, 1.0)) * 0.31830988 + 0.5);
                vec2 starCell = floor(starUv * vec2(150.0, 92.0));
                vec2 starLocal = fract(starUv * vec2(150.0, 92.0)) - 0.5;
                float starHash = hash(starCell.x + starCell.y * 193.13 + uSeed * 0.071);
                float starVisibility = smoothstep(0.02, 0.42, rd.y) * (1.0 - smoothstep(0.88, 1.0, rd.y));
                float starPoint = 1.0 - smoothstep(0.026, 0.034, length(starLocal));
                float starTwinkle = 0.68 + 0.32 * sin(uTime * 4.2 + starHash * 81.0);
                moonSky += vec3(step(0.991, starHash) * starPoint * starVisibility * starTwinkle * 0.18);
                float viewSkyT = smoothstep(mix(-0.36, -0.22, sunHeight01), mix(0.34, 0.84, sunHeight01), rd.y);
                vec3 nightHorizonSky = vec3(0.010, 0.012, 0.028);
                vec3 nightZenithSky = vec3(0.002, 0.004, 0.015);
                vec3 emberHorizonSky = vec3(0.56, 0.075, 0.032);
                vec3 emberZenithSky = vec3(0.030, 0.026, 0.064);
                vec3 duskHorizonSky = vec3(0.42, 0.19, 0.075);
                vec3 duskZenithSky = vec3(0.026, 0.045, 0.105);
                vec3 dayHorizonSky = vec3(0.070, 0.105, 0.190);
                vec3 dayZenithSky = vec3(0.018, 0.080, 0.220);
                float toEmber = smoothstep(-0.34, -0.10, sunSin);
                float toDusk = smoothstep(-0.05, 0.15, sunSin);
                float toDay = smoothstep(0.18, 0.44, sunSin);
                vec3 domeHorizonSky = mix(nightHorizonSky, emberHorizonSky, toEmber);
                domeHorizonSky = mix(domeHorizonSky, duskHorizonSky, toDusk);
                domeHorizonSky = mix(domeHorizonSky, dayHorizonSky, toDay);
                vec3 domeZenithSky = mix(nightZenithSky, emberZenithSky, toEmber);
                domeZenithSky = mix(domeZenithSky, duskZenithSky, toDusk);
                domeZenithSky = mix(domeZenithSky, dayZenithSky, toDay);
                float glowGate = smoothstep(-0.32, -0.04, sunSin) * (1.0 - smoothstep(0.20, 0.55, sunSin));
                float sunGlow = pow(max(0.0, dot(rd, daylightDir)), mix(18.0, 32.0, sunHeight01)) * mix(0.58, 0.14, sunHeight01) * glowGate;
                vec3 atmosphereSky = mix(domeHorizonSky, domeZenithSky, viewSkyT) * uAmbientIntensity;
                atmosphereSky *= mix(0.72, 1.0, sunHeight01);
                atmosphereSky += mix(vec3(1.0, 0.12, 0.04), vec3(1.0, 0.56, 0.20), toDusk) * sunGlow * uSunIntensity * 0.10;
                atmosphereSky += vec3(0.012, 0.018, 0.038) * night01;
                float clearMask = step(0.5, uSkyMode) * (1.0 - step(1.5, uSkyMode));
                float sunsetMask = step(1.5, uSkyMode) * (1.0 - step(2.5, uSkyMode));
                float moonMask = step(2.5, uSkyMode) * (1.0 - step(3.5, uSkyMode));
                float atmosphereMask = step(3.5, uSkyMode);
                vec3 col = mix(workbenchSky, clearSky, clearMask);
                col = mix(col, sunsetSky, sunsetMask);
                col = mix(col, moonSky, moonMask);
                col = mix(col, atmosphereSky, atmosphereMask);
                if (uTransparentBackground < 0.5) {
                    col = surfaceOverlay(col, ro, rd, lightDir, ambientColor);
                    col = gridOverlay(col, ro, rd);
                }

                vec3 boxMin = vec3(-18.0, 0.0, -18.0);
                vec3 boxMax = vec3(18.0, uTropopause + 1.5, 18.0);
                vec2 aabb = intersectAABB(ro, rd, boxMin, boxMax);
                float densityAcc = 0.0;
                vec3 cloudCol = vec3(0.0);

                if (aabb.x < aabb.y && aabb.y > 0.0) {
                    float stepSize = uStepSize;
                    float t = max(0.0, aabb.x);
                    float maxT = aabb.y;
                    t += stepSize * hash(uv.x * 31.0 + uv.y * 113.0);
                    float cosTheta = dot(rd, lightDir);
                    float heightRange = max(0.1, uTropopause - MODEL_BASE_KM);

                    for(int i = 0; i < 168; i++) {
                        if (float(i) > uMaxSteps || t > maxT || densityAcc > 0.955) break;
                        vec3 p = ro + rd * t;
                        if (p.y < 0.0 || p.y > uTropopause + 1.2) {
                            t += stepSize * 3.0;
                            continue;
                        }
                        float macro = mapCloudMacro(p);
                        if (macro > 2.8) {
                            t += stepSize * min(8.0, 3.4 + macro * 1.45);
                            continue;
                        }
                        if (macro > 1.15) {
                            t += stepSize * 4.5;
                            continue;
                        }
                        float density = mapCloudFromMacro(p, macro);
                        if (density > 0.012) {
                            float height01 = clamp((p.y - MODEL_BASE_KM) / heightRange, 0.0, 1.0);
                            float iceFactor = iceFactorAtHeight(p.y);
                            float phaseG = mix(0.62, 0.82, iceFactor);
                            float phase = clamp(phaseHG(cosTheta, phaseG) * mix(0.7, 0.9, iceFactor) + phaseHG(cosTheta, -0.18) * 0.28, 0.0, 1.65);
                            float shadow = 0.0;
                            vec3 lPos = p;
                            float lStep = 0.34;
                            for(int j = 0; j < 3; j++) {
                                float jitter = float(j) * 1.37 + hash(dot(p.xz, vec2(17.0, 31.0)));
                                vec3 shadowDir = normalize(lightDir + vec3(
                                    sin(jitter) * 0.16,
                                    cos(jitter * 1.7) * 0.08,
                                    cos(jitter) * 0.16
                                ));
                                lPos += shadowDir * lStep;
                                float shadowMacro = mapCloudMacro(lPos);
                                if (shadowMacro < 2.4) {
                                    shadow += mapCloudFromMacro(lPos, shadowMacro);
                                }
                            }
                            float mixedPhaseShadow = 1.0 + smoothstep(0.36, 0.7, height01) * (1.0 - smoothstep(0.78, 0.94, height01)) * mix(0.38, 0.64, uPhotographicStyle);
                            float transmittance = exp(-shadow * mix(0.86, 0.58, iceFactor) * mixedPhaseShadow);
                            float surfaceRelief = smoothstep(-0.72, 0.18, macro) * (1.0 - smoothstep(0.2, 0.92, macro));
                            float relief = fbm(vec3(p.x * 0.42, p.y * 0.58, p.z * 0.42) + uSeed * 0.021);
                            float fineRelief = 0.5;
                            if (surfaceRelief > 0.025) {
                                fineRelief = fbm(vec3(p.x * 0.9, p.y * 1.05, p.z * 0.9) + vec3(uSeed * 0.013, 4.1, uTime * 0.03));
                            }
                            float reliefLight = mix(mix(0.66, 0.52, uPhotographicStyle), mix(1.34, 1.58, uPhotographicStyle), smoothstep(0.26, 0.84, relief));
                            reliefLight *= mix(1.0, mix(0.72, 1.42, smoothstep(0.3, 0.82, fineRelief)), surfaceRelief);
                            vec3 phaseTint = mix(vec3(1.0, 0.95, 0.88), vec3(0.78, 0.9, 1.08), iceFactor);
                            phaseTint = mix(phaseTint, mix(vec3(1.16, 1.1, 1.02), vec3(0.9, 0.98, 1.1), iceFactor), uPhotographicStyle);
                            vec3 lowerWaterDarkening = mix(vec3(0.9, 0.92, 0.96), vec3(1.0), smoothstep(0.16, 0.46, height01));
                            lowerWaterDarkening = mix(lowerWaterDarkening, vec3(0.86, 0.88, 0.94), uPhotographicStyle * (1.0 - smoothstep(0.2, 0.62, height01)));
                            float upperCloudLift = smoothstep(0.22, 0.94, height01);
                            vec3 upperCloudBrightening = mix(vec3(0.78, 0.82, 0.9), vec3(1.34, 1.42, 1.62), upperCloudLift);
                            upperCloudBrightening = mix(upperCloudBrightening, vec3(1.12, 1.22, 1.48), iceFactor * upperCloudLift * uPhotographicStyle);
                            float directHeightLift = mix(0.72, 2.08, upperCloudLift) * mix(1.0, 1.16, uPhotographicStyle * upperCloudLift);
                            vec3 ambientTerm = ambientColor * lowerWaterDarkening * upperCloudBrightening;
                            vec3 directTerm = lightColor * phaseTint * transmittance * phase * reliefLight * directHeightLift;
                            vec3 lighting = ambientTerm + directTerm;
                            float cloudOpacity = mix(1.0, 0.46, uShowGrid);
                            float alpha = (1.0 - exp(-density * stepSize * 12.8)) * cloudOpacity;
                            cloudCol += (1.0 - densityAcc) * lighting * alpha;
                            densityAcc += (1.0 - densityAcc) * alpha;
                        } else if (macro > 0.35) {
                            t += stepSize * 1.55;
                        }
                        t += stepSize;
                    }
                }

                vec3 alphaCompositedCloud = col * (1.0 - densityAcc) + cloudCol;
                float lowSunEdgeBlend = 1.0 - smoothstep(0.35, 1.65, uSunIntensity);
                col = mix(mix(col, cloudCol, densityAcc), alphaCompositedCloud, lowSunEdgeBlend);
                col = mix(col, cloudCol, uTransparentBackground);
                float sunForward = dot(rd, daylightDir);
                vec3 sdrColor = pow(ACESFilm(col), vec3(1.0 / 2.2));
                vec3 hdr10Color = hdr10ReferencePreview(col, densityAcc, sunHeight01, sunForward);
                col = mix(sdrColor, hdr10Color, uHdr10Mode);
                col = applyDisplayDither(col);
                float finalAlpha = mix(1.0, densityAcc, uTransparentBackground);
                gl_FragColor = vec4(col, finalAlpha);
            }
        `,Bm=String.raw`void main() { gl_Position = vec4(position, 1.0); }`,zm=["seeded","baseline","macro-boundary","flatten","skew-twist","tear-silk","budding","giant-cumulonimbus"],Vo=.5,km=.5,Gm=.93,Hm=.24,Vm=.46,Wm=.44,Xm=.38,qm=24,Ym=.38,$m=2,Km=1,Zm=1e3,jm=1280*720,Jm="(empty shader log)",Qm=1e4;class tg{constructor(e,t={}){this.canvas=e,this.options=t,this.displayProfile=t.displayProfile??rl(),this.tropopause=ke(t.tropopause,12,4,20),this.orthoFrustumSize=this.defaultOrthoFrustumSize(),this.updateCameraFromOptions();const i={antialias:!1,alpha:t.transparentBackground??!1,premultipliedAlpha:!(t.transparentBackground??!1),powerPreference:"default",preserveDrawingBuffer:t.preserveDrawingBuffer??!1},r=e0(e,i);if(!r)throw new Error("WebGL is unavailable in this browser context.");this.renderer=new Fm({canvas:e,context:r}),this.renderer.debug.checkShaderErrors=!0,this.renderer.debug.onShaderError=(a,s,o,l)=>{throw new Error(["Cumulonimbus shader program failed to link.",`Program: ${Sa(a.getProgramInfoLog(s))}`,`Vertex: ${Sa(a.getShaderInfoLog(o))}`,`Fragment: ${Sa(a.getShaderInfoLog(l))}`].join(" "))},this.renderer.setClearColor(0,t.transparentBackground?0:1),this.renderer.setPixelRatio(1),this.material=new $t({defines:{CUMULONIMBUS_MAX_RAY_STEPS:this.staticRayStepLimit(),CUMULONIMBUS_SINGLE_CLOUD:$o(t)?1:0,CUMULONIMBUS_MORPHOLOGY_STYLE:_r(t.morphologyStyle)},vertexShader:Bm,fragmentShader:Om,uniforms:{uTime:{value:ke(t.time,0,0,1e6)},uResolution:{value:this.resolution},uCameraPos:{value:this.cameraPosition},uCameraTarget:{value:this.cameraTarget},uAspect:{value:1},uTropopause:{value:this.tropopause},uShowGrid:{value:t.showGrid?1:0},uSurfaceVisible:{value:t.surfaceMode&&t.surfaceMode!=="none"?1:0},uSurfaceMode:{value:qo(t.surfaceMode)},uSeed:{value:Yo(t.seed,574)},uFbmOctaves:{value:ke(t.fbmOctaves,5,4,6)},uCloudCurl:{value:ke(t.cloudCurl,this.displayProfile.mobileWideView?.86:.78,0,1.2)},uMorphologyStyle:{value:_r(t.morphologyStyle)},uSystemCount:{value:fs(t.systems)},uIsOrtho:{value:t.ortho?1:0},uOrthoSize:{value:this.orthoFrustumSize},uOrthoVerticalScale:{value:Km},uStepSize:{value:ke(t.stepSize,this.defaultStepSize(),.08,.6)},uMaxSteps:{value:ke(t.maxSteps,this.defaultMaxSteps(),24,144)},uSunIntensity:{value:ke(t.sunIntensity,4.6,0,10)},uAmbientIntensity:{value:ke(t.ambientIntensity,.75,0,2)},uSunElevation:{value:ke(t.sunElevation,35,-20,90)},uSunViewerAngle:{value:ke(t.sunViewerAngle,25,-180,180)},uFreezingLevel:{value:ke(t.freezingLevel,5,0,16)},uWindShear:{value:ke(t.windShear,this.displayProfile.mobileWideView?.9:.82,0,1)},uPhotographicStyle:{value:t.photographicStyle?1:0},uLightPreset:{value:Wo(t.lightPreset)},uSkyMode:{value:Xo(t.skyMode,t.photographicStyle)},uHorizonStrength:{value:ke(t.horizonStrength,1,0,1)},uTransparentBackground:{value:t.transparentBackground?1:0},uHdr10Mode:{value:t.hdr10?1:0},uDitherEnabled:{value:t.dither?1:0},uHdrReferencePeakNits:{value:Zm},uMobileCumulusMode:{value:Ko(t,this.displayProfile)}}}),this.scene.add(new cn(new Wi(2,2),this.material))}renderer;scene=new xu;camera=new Ps(-1,1,1,-1,0,1);material;cameraPosition=new B;cameraTarget=new B;resolution=new Ye;width=0;height=0;displayProfile;tropopause;orthoFrustumSize;updateOptions(e){this.options={...this.options,...e},this.tropopause=ke(this.options.tropopause,12,4,20),this.orthoFrustumSize=this.defaultOrthoFrustumSize(),this.updateCameraFromOptions();const t=this.staticRayStepLimit(),i=$o(this.options)?1:0,r=_r(this.options.morphologyStyle);this.material.defines.CUMULONIMBUS_MAX_RAY_STEPS!==t&&(this.material.defines.CUMULONIMBUS_MAX_RAY_STEPS=t,this.material.needsUpdate=!0),this.material.defines.CUMULONIMBUS_SINGLE_CLOUD!==i&&(this.material.defines.CUMULONIMBUS_SINGLE_CLOUD=i,this.material.needsUpdate=!0),this.material.defines.CUMULONIMBUS_MORPHOLOGY_STYLE!==r&&(this.material.defines.CUMULONIMBUS_MORPHOLOGY_STYLE=r,this.material.needsUpdate=!0),this.material.uniforms.uCameraPos.value=this.cameraPosition,this.material.uniforms.uCameraTarget.value=this.cameraTarget,this.material.uniforms.uTropopause.value=this.tropopause,this.material.uniforms.uShowGrid.value=this.options.showGrid?1:0,this.material.uniforms.uSurfaceVisible.value=this.options.surfaceMode&&this.options.surfaceMode!=="none"?1:0,this.material.uniforms.uSurfaceMode.value=qo(this.options.surfaceMode),this.material.uniforms.uSeed.value=Yo(this.options.seed,574),this.material.uniforms.uFbmOctaves.value=ke(this.options.fbmOctaves,5,4,6),this.material.uniforms.uCloudCurl.value=ke(this.options.cloudCurl,this.displayProfile.mobileWideView?.86:.78,0,1.2),this.material.uniforms.uMorphologyStyle.value=_r(this.options.morphologyStyle),this.material.uniforms.uSystemCount.value=fs(this.options.systems),this.material.uniforms.uIsOrtho.value=this.options.ortho?1:0,this.material.uniforms.uOrthoSize.value=this.orthoFrustumSize,this.material.uniforms.uStepSize.value=ke(this.options.stepSize,this.defaultStepSize(),.08,.6),this.material.uniforms.uMaxSteps.value=ke(this.options.maxSteps,this.defaultMaxSteps(),24,144),this.material.uniforms.uSunIntensity.value=ke(this.options.sunIntensity,4.6,0,10),this.material.uniforms.uAmbientIntensity.value=ke(this.options.ambientIntensity,.75,0,2),this.material.uniforms.uSunElevation.value=ke(this.options.sunElevation,35,-20,90),this.material.uniforms.uSunViewerAngle.value=ke(this.options.sunViewerAngle,25,-180,180),this.material.uniforms.uFreezingLevel.value=ke(this.options.freezingLevel,5,0,16),this.material.uniforms.uWindShear.value=ke(this.options.windShear,this.displayProfile.mobileWideView?.9:.82,0,1),this.material.uniforms.uPhotographicStyle.value=this.options.photographicStyle?1:0,this.material.uniforms.uLightPreset.value=Wo(this.options.lightPreset),this.material.uniforms.uSkyMode.value=Xo(this.options.skyMode,this.options.photographicStyle),this.material.uniforms.uHorizonStrength.value=ke(this.options.horizonStrength,1,0,1),this.material.uniforms.uTransparentBackground.value=this.options.transparentBackground?1:0,this.material.uniforms.uHdr10Mode.value=this.options.hdr10?1:0,this.material.uniforms.uDitherEnabled.value=this.options.dither?1:0,this.material.uniforms.uMobileCumulusMode.value=Ko(this.options,this.displayProfile)}resize(e,t){const i=this.enforcePixelBudget(e,t);i.width===this.width&&i.height===this.height||(this.width=i.width,this.height=i.height,this.renderer.setSize(i.width,i.height,!1),this.resolution.set(i.width,i.height),this.material.uniforms.uAspect.value=i.width/i.height)}render(e){this.material.uniforms.uTime.value=e,this.renderer.render(this.scene,this.camera)}dispose(){this.material.dispose(),this.renderer.dispose()}updateCameraFromOptions(){const e=ke(this.options.cameraDistance,this.resetCameraDistance(),8,160),t=Xr.degToRad(ke(this.options.cameraYawDegrees,0,-180,180)),i=Xr.degToRad(ke(this.options.cameraPitchDegrees,0,-55,70)),r=Math.cos(i)*e,a=this.displayProfile.mobileWideView?Hm:km,s=this.displayProfile.mobileWideView?Vm:Gm;this.cameraTarget.set(ke(this.options.cameraTargetOffsetX,0,-24,24),this.heightAtCloudRatio(a)+ke(this.options.cameraTargetOffsetY,0,-12,12),ke(this.options.cameraTargetOffsetZ,0,-24,24)),this.cameraPosition.set(this.cameraTarget.x+Math.sin(t)*r,this.cameraTarget.y+Math.sin(i)*e,this.cameraTarget.z-Math.cos(t)*r),this.options.cameraYawDegrees===void 0&&this.options.cameraPitchDegrees===void 0&&this.cameraPosition.set(0,this.heightAtCloudRatio(s),-e)}heightAtCloudRatio(e){return Vo+(this.tropopause-Vo)*e}defaultOrthoFrustumSize(){const e=this.tropopause+$m*2,t=this.displayProfile.mobileWideView?Xm:Wm;return Math.max(qm,e/t)}resetCameraDistance(){const e=Xr.degToRad(45);return this.defaultOrthoFrustumSize()/(2*Math.tan(e/2))*Ym}enforcePixelBudget(e,t){const i=ke(this.options.maxPixels,this.defaultMaxPixels(),16384,8294400),r=Math.max(1,e*t),a=r>i?Math.sqrt(i/r):1;return{width:Math.max(2,Math.floor(e*a/2)*2),height:Math.max(2,Math.floor(t*a/2)*2)}}defaultMaxPixels(){return this.displayProfile.iosChrome?960*540:this.displayProfile.mobileWideView?1280*720:jm}defaultStepSize(){return this.displayProfile.iosChrome?.34:this.displayProfile.mobileWideView?.28:.24}defaultMaxSteps(){return this.displayProfile.iosChrome?36:this.displayProfile.mobileWideView?44:40}staticRayStepLimit(){const e=this.displayProfile.iosChrome?40:this.displayProfile.mobileWideView?48:40;return Math.round(ke(this.options.staticMaxSteps,e,24,96))}}function Wo(n){return n==="golden-side"?1:n==="backlit-edge"?2:0}function Xo(n,e=!1){return n==="clear"?4:n==="sunset"?2:n==="moonlight"?3:n==="atmosphere"||e?4:0}function qo(n){return n==="hills"?1:0}function _r(n){switch(n){case"baseline":return 1;case"macro-boundary":return 2;case"flatten":return 3;case"skew-twist":return 4;case"tear-silk":return 5;case"budding":return 6;case"giant-cumulonimbus":return 7;default:return 0}}function fs(n){return Math.round(ke(n,1,1,10))}function Yo(n,e){return 1+(Math.floor(ke(n,e,1,Number.MAX_SAFE_INTEGER))-1)%Qm}function $o(n){return fs(n.systems)<2}function Ko(n,e){return n.mobileCumulusMode?1:0}function e0(n,e){const t=[e,{...e,powerPreference:"default"},{...e,powerPreference:"low-power"},{alpha:e.alpha,premultipliedAlpha:e.premultipliedAlpha,preserveDrawingBuffer:e.preserveDrawingBuffer}];for(const i of t){const r=n.getContext("webgl2",i)??n.getContext("webgl",i)??n.getContext("experimental-webgl",i);if(r)return r}return null}function Sa(n){const e=n?.trim();return e&&e.length>0?e:Jm}function ke(n,e,t,i){return typeof n!="number"||!Number.isFinite(n)?e:Math.min(i,Math.max(t,n))}const Dr=[{value:"seeded",label:"Seeded pool",code:"M00",intent:"Seed-driven blend of macro silhouette, surface breakup, and edge traits.",traits:["seed blend","organic edge","variable"]},{value:"baseline",label:"Base sphere",code:"M01",intent:"Near-spherical control form with reduced surface and boundary aggression.",traits:["control","round body","soft edge"]},{value:"macro-boundary",label:"Macro edge",code:"M02",intent:"Amplifies protrusions, compression, stretch, contour ridges, and hard silhouette changes.",traits:["hard contour","stretch","notches"]},{value:"flatten",label:"Flattened",code:"M03",intent:"Compresses the vertical body into a wider, lower cloud mass.",traits:["wide body","compressed","low crown"]},{value:"skew-twist",label:"Skew twist",code:"M04",intent:"Adds oblique lean, shear displacement, and visible twist to the cloud topology.",traits:["lean","twist","shear"]},{value:"tear-silk",label:"Tear silk",code:"M05",intent:"Pushes fuzzy shells, wind-tear breakup, and silk-like edge dissipation.",traits:["wispy","torn edge","dissipating"]},{value:"budding",label:"Budding",code:"M06",intent:"Smooth-union large body plus attached bud and neck for a paired cloud form.",traits:["large-small","neck","attached bud"]},{value:"giant-cumulonimbus",label:"Giant Cb",code:"M07",intent:"Original cumulonimbus tower and anvil profile preserved as a named morphology member.",traits:["tower","anvil","classic Cb"]}],t0=new Set(zm);function n0(n){return Dr.find(e=>e.value===n)??Dr[0]}function i0(n){return n!==void 0&&t0.has(n)}function Hl(n){switch(n?.toLowerCase()){case"seeded":case"seed":case"random":case"pool":case"recipe":return"seeded";case"baseline":case"base":case"sphere":case"original-sphere":return"baseline";case"macro-boundary":case"macro":case"boundary":case"contrast":case"supercontrast":return"macro-boundary";case"flatten":case"flat":case"compressed":case"compression":return"flatten";case"skew-twist":case"skew":case"twist":case"oblique":return"skew-twist";case"tear-silk":case"tear":case"silk":case"wind":case"dissipating":return"tear-silk";case"budding":case"bud":case"yeast":case"large-small":case"binary":return"budding";case"giant-cumulonimbus":case"giant":case"cumulonimbus":case"cb":case"tower":return"giant-cumulonimbus";default:return}}const Yn=1280*720,Zo=.8,r0=.18,a0=142,Ir=[{tier:"low",label:"LOW",renderScale:.45,fps:24,fbmOctaves:4,stepSize:.36,maxSteps:36,staticMaxSteps:40,maxPixels:Math.round(Yn*.45*.45),upgradeFrameBudgetMs:16},{tier:"balanced",label:"BAL",renderScale:.56,fps:24,fbmOctaves:4,stepSize:.32,maxSteps:46,staticMaxSteps:48,maxPixels:Math.round(Yn*.56*.56),upgradeFrameBudgetMs:18},{tier:"standard",label:"STD",renderScale:.68,fps:30,fbmOctaves:5,stepSize:.27,maxSteps:58,staticMaxSteps:64,maxPixels:Math.round(Yn*.68*.68),upgradeFrameBudgetMs:20},{tier:"high",label:"HIGH",renderScale:.8,fps:30,fbmOctaves:5,stepSize:.24,maxSteps:72,staticMaxSteps:72,maxPixels:Math.round(Yn*.8*.8),upgradeFrameBudgetMs:Number.POSITIVE_INFINITY}],Vl=["qualityTier","mobileQuality","qualityPreset"],s0=["autoQuality","adaptiveQuality","mobileAutoQuality"],o0=[...Vl,"fps","simFps","fbmOctaves","octaves","cloudOctaves","stepSize","rayStep","maxSteps","steps","staticMaxSteps","compileSteps","shaderSteps","maxPixels"];function l0(n,e){const t=u0(n,e),i=f0(n),r=m0(n,e),a=Xl(r.presetName),s=d0(n,e),o=e.mobileWideView?Xi(s.qualityTier):void 0,l=Math.floor(Tt(n,["seed"],a.seed??A0(),1,Number.MAX_SAFE_INTEGER));return{...a,...r,displayProfile:e,orientation:t,renderMode:i,qualityTier:s.qualityTier,autoQuality:s.autoQuality,seed:l,time:Tt(n,["time"],a.time??2.2,0,1e6),timeScale:Tt(n,["timeScale","speed"],e.mobileWideView?.3:1,0,12),fps:Tt(n,["fps","simFps"],o?.fps??30,1,360),systems:Tt(n,["systems","systemCount"],a.systems??1,1,10),tropopause:Tt(n,["tropopause","tropo"],a.tropopause??11.2,4,20),freezingLevel:Tt(n,["freezingLevel","freezing"],a.freezingLevel??4.4,0,16),windShear:Tt(n,["windShear","shear"],a.windShear??.42,0,1),fbmOctaves:Tt(n,["fbmOctaves","octaves","cloudOctaves"],o?.fbmOctaves??a.fbmOctaves??5,4,6),cloudCurl:Tt(n,["cloudCurl","curl","curliness"],a.cloudCurl??.78,0,1.2),horizonStrength:Tt(n,["horizon","horizonStrength","horizonFog"],a.horizonStrength??1,0,1),stepSize:Ma(n,["stepSize","rayStep"],o?.stepSize??a.stepSize,.08,.6),maxSteps:Ma(n,["maxSteps","steps"],o?.maxSteps??a.maxSteps,24,144),staticMaxSteps:Ma(n,["staticMaxSteps","compileSteps","shaderSteps"],o?.staticMaxSteps??a.staticMaxSteps,24,96),sunIntensity:Tt(n,["sun","sunIntensity"],a.sunIntensity??7.2,0,10),ambientIntensity:Tt(n,["ambient","amb","ambientIntensity"],a.ambientIntensity??.62,0,2),sunElevation:Tt(n,["sunElevation","sunElev","elevation"],a.sunElevation??58,-20,90),sunViewerAngle:Tt(n,["sunAngle","sunViewerAngle","viewerSunAngle"],a.sunViewerAngle??18,-180,180),photographicStyle:en(n,["photographic","photo"],a.photographicStyle??!0),lightPreset:v0(n.get("light")??n.get("lighting"))??a.lightPreset??"daylight",skyMode:x0(n.get("sky")??n.get("background")??n.get("bg"))??a.skyMode??"atmosphere",transparentBackground:y0(n),hdr10:en(n,["hdr10","hdr","hdrMode"],a.hdr10??!1),dither:en(n,["dither","displayDither"],a.dither??!1),ortho:en(n,["ortho"],a.ortho??!1),showGrid:en(n,["grid","showGrid"],a.showGrid??!1),surfaceMode:S0(n.get("surface"))??a.surfaceMode??"none",morphologyStyle:M0(n.get("morphologyStyle")??n.get("morphology")??n.get("shapeStyle")??n.get("shape"))??a.morphologyStyle??"giant-cumulonimbus",mobileCumulusMode:en(n,["mobileCumulusMode","mobileShape"],a.mobileCumulusMode??!1),cameraYawDegrees:Vt(n,["cameraYawDegrees","yawDegrees","yaw"])??a.cameraYawDegrees,cameraPitchDegrees:Vt(n,["cameraPitchDegrees","pitchDegrees","pitch"])??a.cameraPitchDegrees,cameraDistance:Vt(n,["cameraDistance","distance"])??a.cameraDistance,cameraTargetOffsetX:Vt(n,["cameraTargetOffsetX","targetOffsetX","panX"])??a.cameraTargetOffsetX,cameraTargetOffsetY:Vt(n,["cameraTargetOffsetY","targetOffsetY","panY"])??a.cameraTargetOffsetY,cameraTargetOffsetZ:Vt(n,["cameraTargetOffsetZ","targetOffsetZ","panZ"])??a.cameraTargetOffsetZ,maxPixels:T0(n,["maxPixels"],16384,3840*2160)??o?.maxPixels??a.maxPixels,simWidth:Vt(n,["simWidth","width"]),simHeight:Vt(n,["simHeight","height"]),preserveDrawingBuffer:_0(n),debugShaderDiagnostics:en(n,["debugShaders","shaderDiagnostics"],!1),controlsVisible:p0(n,i),captureFrameLimit:Math.round(Tt(n,["captureFrames"],0,0,600)),exposeRuntimeDebug:g0(n)}}function Xi(n){return Ir.find(e=>e.tier===n)??Ir[0]}function c0(n){const e=Ir.findIndex(i=>i.tier===n);return Ir[e<0?1:e+1]?.tier}function Wl(n){const e=Xi(n);return{qualityTier:e.tier,fps:e.fps,fbmOctaves:e.fbmOctaves,stepSize:e.stepSize,maxSteps:e.maxSteps,staticMaxSteps:e.staticMaxSteps,maxPixels:e.maxPixels}}function u0(n,e){const t=n.get("orientation");return t==="landscape"||t==="portrait"?t:e.mobileWideView?"portrait":"landscape"}function d0(n,e){const t=h0(b0(n,Vl)),i=E0(n,o0);return{autoQuality:e.mobileWideView&&en(n,s0,!i),qualityTier:e.mobileWideView?t??"low":void 0}}function h0(n){switch(n?.toLowerCase()){case"low":case"lowest":case"safe":case"min":case"minimum":return"low";case"balanced":case"balance":case"medium":case"mid":return"balanced";case"standard":case"std":case"normal":return"standard";case"high":case"hi":case"max":return"high";default:return}}function Xl(n){switch(n?.toLowerCase()){case"mobile":case"mobile-horizon":case"portrait-horizon":case"mobile-cumulus":{const e=Xi("low");return{seed:134,time:9.6,systems:1,tropopause:8,freezingLevel:3,windShear:.3,fps:e.fps,fbmOctaves:e.fbmOctaves,cloudCurl:.78,horizonStrength:1,stepSize:e.stepSize,maxSteps:e.maxSteps,staticMaxSteps:e.staticMaxSteps,sunIntensity:5.8,ambientIntensity:.94,sunElevation:49,sunViewerAngle:-36,skyMode:"clear",lightPreset:"daylight",photographicStyle:!1,morphologyStyle:"giant-cumulonimbus",cameraDistance:24,maxPixels:e.maxPixels,mobileCumulusMode:!1}}case"broadcast-landscape":return{seed:574,time:2.2,systems:3,tropopause:12,freezingLevel:5,windShear:.7,fbmOctaves:5,cloudCurl:.76,horizonStrength:1,stepSize:.32,maxSteps:40,staticMaxSteps:40,sunIntensity:4.6,ambientIntensity:.68,sunElevation:35,sunViewerAngle:25,skyMode:"atmosphere",lightPreset:"daylight",photographicStyle:!0,cameraPitchDegrees:-1,cameraDistance:30,maxPixels:Math.round(Yn*.64*.64)};case"night-cumulus":case"moonlight-night":return{seed:574,time:2.2,systems:1,tropopause:10.8,freezingLevel:4.2,windShear:.36,fbmOctaves:5,cloudCurl:.84,horizonStrength:1,stepSize:.3,maxSteps:54,staticMaxSteps:56,sunIntensity:1.5,ambientIntensity:.54,sunElevation:-4,sunViewerAngle:70,skyMode:"moonlight",lightPreset:"backlit-edge",photographicStyle:!0,cameraPitchDegrees:-1,cameraDistance:26,maxPixels:1280*720};case"single-cumulus-day":case"noon-blue":case void 0:return{seed:134,time:0,systems:1,tropopause:8,freezingLevel:3,windShear:.3,fbmOctaves:5,cloudCurl:.78,horizonStrength:1,stepSize:r0,maxSteps:a0,staticMaxSteps:96,sunIntensity:4,ambientIntensity:.68,sunElevation:32,sunViewerAngle:-50,skyMode:"clear",lightPreset:"daylight",photographicStyle:!1,morphologyStyle:"giant-cumulonimbus",cameraDistance:16,maxPixels:Math.round(Yn*Zo*Zo),mobileCumulusMode:!1};default:return Xl("single-cumulus-day")}}function f0(n){return n.get("capture")==="1"||n.get("live")==="1"?"canvas":"page"}function p0(n,e){if(e==="canvas")return!1;const t=n.get("controls");return t===null?!0:Ls(t)}function m0(n,e){const t=n.get("preset")??n.get("capturePreset");return t!==null&&t!==""?{presetName:t,presetSource:"query"}:e.narrowViewport?{presetName:"mobile-cumulus",presetSource:"browser-profile"}:{presetName:"single-cumulus-day",presetSource:"default"}}function g0(n){return en(n,["debug","debugRuntime"],!1)||n.has("captureFrames")||n.get("capture")==="1"||n.get("live")==="1"}function _0(n){return n.has("preserveDrawingBuffer")||n.has("preserveDrawing")||n.has("preserveBuffer")?en(n,["preserveDrawingBuffer","preserveDrawing","preserveBuffer"],!1):n.has("captureFrames")||n.get("capture")==="1"}function v0(n){if(n==="golden-side"||n==="warm-low-angle")return"golden-side";if(n==="backlit-edge"||n==="backlit")return"backlit-edge";if(n==="daylight")return"daylight"}function x0(n){switch(n?.toLowerCase()){case"clear":case"blue":case"photographic-blue":return"clear";case"sunset":case"evening":case"golden":return"sunset";case"moonlight":case"night":case"lunar":return"moonlight";case"demo3":case"atmosphere":case"sky-dome":case"skydome":return"atmosphere";case"workbench":case"dark":return"workbench";default:return}}function S0(n){if(n==="ocean"||n==="hills"||n==="none")return n}function M0(n){return Hl(n)}function y0(n){const e=n.get("transparent");if(e!==null)return Ls(e);const t=n.get("background")??n.get("bg");return t==="0"||t==="false"||t==="none"||t==="transparent"}function en(n,e,t){for(const i of e){const r=n.get(i);if(r!==null)return Ls(r)}return t}function Ls(n){const e=n.toLowerCase();return e===""||e==="1"||e==="true"||e==="yes"||e==="on"}function Vt(n,e){for(const t of e){const i=n.get(t),r=Number(i);if(i!==null&&i!==""&&Number.isFinite(r))return r}}function b0(n,e){for(const t of e){const i=n.get(t);if(i!==null&&i!=="")return i}return null}function E0(n,e){return e.some(t=>n.has(t))}function T0(n,e,t,i){const r=Vt(n,e);return r===void 0?void 0:Ds(r,t,i)}function Ma(n,e,t,i,r){const a=Vt(n,e)??t;return a===void 0?void 0:Ds(a,i,r)}function Tt(n,e,t,i,r){return Ds(Vt(n,e)??t,i,r)}function Ds(n,e,t){return Math.min(t,Math.max(e,n))}function A0(){const n=window.crypto;if(n?.getRandomValues){const e=new Uint32Array(1);return n.getRandomValues(e),Math.max(1,e[0]??1)}return Math.max(1,Math.floor((Date.now()+performance.now())%Number.MAX_SAFE_INTEGER))}function w0(n){const e=document.querySelector("#app")??document.body,t=n.presetName==="mobile-cumulus"||n.displayProfile.mobileWideView;e.innerHTML=C0(n.orientation,n.renderMode,t,n.controlsVisible),t&&R0(e);const i=jo("#render-container"),r=jo("#cloud-canvas"),a=P0(n);return r.width=a.width,r.height=a.height,{root:e,renderContainer:i,canvas:r}}function R0(n){const e=n.querySelector("#cumulonimbus-app"),t=n.querySelector("#panel-time"),i=t?.querySelector(".control-panel__title"),r=t?.querySelector(".control-panel__body"),a=t?.querySelector(".control-group--time");if(!e||!t||!r||!a)return;e.classList.add("cloud-app-shell--compact"),t.hidden=!1,t.classList.add("control-panel--mobile-time"),i&&(i.textContent="OBSERVATORY"),n.querySelector("#btn-time-reset")?.remove(),a.classList.add("control-group--mobile-time"),a.querySelector(".control-group__label")?.remove();const s=a.querySelector('label[for="slider-time"]');s&&(s.textContent="SPEED");const o=n.querySelector("#btn-time-toggle");if(o){const M=document.createElement("div");M.className="compact-transport-action",o.classList.add("compact-play-toggle"),o.dataset.playbackLabel="play",M.append(o),a.insertBefore(M,a.firstElementChild)}const l=n.querySelector("#btn-sync-system-time"),c=n.querySelector("#btn-sync-location"),d=document.createElement("label");d.className="compact-sync-toggle",d.innerHTML=`
    <input id="checkbox-sync-time" type="checkbox">
    <span>SYNC</span>
  `,l?.replaceWith(d),c?.remove();const p=n.querySelector("#btn-grid"),u=n.querySelector("#input-seed")?.closest(".slider-group");let m=null;if(u){m=document.createElement("div"),m.className="control-group control-group--compact-seed-tools",m.innerHTML='<span class="control-group__label">Seed</span>',u.querySelector("#btn-random-seed")?.replaceChildren();const M=u.querySelector("#btn-random-seed");M&&(M.setAttribute("aria-label","Randomize seed"),M.title="Randomize seed"),m.append(u)}const v=n.querySelector(".control-group--atmosphere");if(v){v.classList.add("control-group--compact-atmosphere");const M=v.querySelector(".control-group__label");M&&(M.textContent="TIME");const f=document.createElement("div");f.className="digital-group digital-group--atmosphere-time",f.innerHTML=`
      <input id="input-atmosphere-time" class="time-input" type="time" step="60" value="09:00" aria-label="Atmosphere time">
    `,f.append(d),M?.after(f),p&&v.append(p);for(const h of[".slider-group--sun",".slider-group--elevation",".slider-group--ambient",".slider-group--angle"])v.querySelector(h)?.remove()}for(const M of[a,v,m])M&&r.append(M);for(const M of["mainPanel","cloudPanel","atmospherePanel"])n.querySelector(`[data-panel-key="${M}"]`)?.remove(),n.querySelector(`[data-panel-restore="${M}"]`)?.remove()}function C0(n,e,t,i){const r=!i||e==="canvas",a=r?" hidden":"",s=r?" hidden":"",o=r||t?" hidden":"",l=r||t?" hidden":"",c=r||t?" hidden":"",d=t?' data-restore-suppressed="true"':"";return`
    <div id="cumulonimbus-app" class="cloud-app-shell" data-render-mode="${e}" data-controls-hidden="${r?"true":"false"}">
      <div id="stage-edge-fill" class="stage-edge-fill" aria-hidden="true"></div>
      <main id="render-container" class="render-stage viewport-fullscreen viewport-${n}" aria-label="Cumulonimbus cloud render">
        <canvas id="cloud-canvas" tabindex="0" aria-label="Live cumulonimbus cloud renderer. Left drag or arrow keys orbit, wheel or plus/minus zoom, right drag or shift plus drag pans."></canvas>
        <section id="cloud-hud" class="hud-panel" aria-label="Renderer status"${a}>
          <button id="btn-hud-close" class="panel-button hud-close-button" type="button" title="Close HUD">x</button>
          <div class="project-kicker">Operational volumetric study</div>
          <h1 class="project-title">Cumulonimbus Live HDR Observatory</h1>
          <p class="hud-line" id="target-label">Target: ${n==="landscape"?"16:9 Broadcast":"9:16 Mobile"}</p>
          <div class="hud-line hud-list">
            <span>Cloud form: Cb tower, convective cells, and tropopause anvil.</span>
            <span>Scale: sea level 0 km plane, 1 grid = 1 km, bold/ring = 5 km.</span>
            <span>Framing: camera center tracks the cloud-layer midpoint.</span>
            <span>Left drag / arrows: orbit | Wheel / +/- / Ctrl-drag: zoom | Right/Middle/Shift-drag or Shift+arrows: pan | Alt: precision</span>
          </div>
          <p class="hud-line muted" id="fps-counter">FPS: -- | AVG: -- | RES: -- | Time: paused</p>
        </section>
      </main>

      <div id="ui-bar" class="control-surface" aria-label="Control panels"${s}>
        <section id="panel-main" class="control-panel control-panel--main" data-panel-key="mainPanel" aria-label="Display and framing controls">
          <div class="control-panel__chrome">
            <span class="control-panel__title">MAIN PANEL // DISPLAY + FRAMING</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-minimize="mainPanel" title="Minimize">-</button>
              <button type="button" class="panel-button" data-panel-close="mainPanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--display" aria-label="Display">
              <span class="control-group__label">Display</span>
              <div class="segmented-controls">
                <button id="btn-landscape" type="button" class="segment-button">16:9</button>
                <button id="btn-portrait" type="button" class="segment-button">9:16</button>
              </div>
              <button id="btn-fullscreen" class="btn-toggle" type="button">Fullscreen</button>
              <button id="btn-toggle-other-panels" class="btn-toggle" type="button">Panels</button>
              <label class="select-group lang-select">
                <span>Language</span>
                <select id="select-language" class="tp-select">
                  <option value="zh-TW">Traditional Chinese</option>
                  <option value="en">English</option>
                </select>
              </label>
            </div>

            <div class="control-group control-group--framing" aria-label="Framing">
              <span class="control-group__label">Framing</span>
              <div class="framing-controls">
                <button id="btn-grid" class="btn-toggle" type="button">Scale ruler</button>
              </div>
              <label class="select-group">
                <span>Surface</span>
                <select id="select-surface" class="tp-select">
                  <option value="none">None</option>
                  <option value="ocean">Ocean</option>
                  <option value="hills">Hills</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <section id="panel-time" class="control-panel control-panel--time" data-panel-key="timePanel" aria-label="Time controls"${l}>
          <div class="control-panel__chrome">
            <span class="control-panel__title">TIME // CLOCK + LOCATION</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-close="timePanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--time">
              <span class="control-group__label">Time</span>
              <div class="slider-group">
                <label for="slider-time">Speed</label>
                <input id="slider-time" type="range" min="0" max="5" step="0.1" value="1">
                <span id="time-readout" class="readout">1.0x</span>
              </div>
              <button id="btn-time-toggle" class="btn-toggle" type="button" aria-label="Resume">Resume</button>
              <button id="btn-sync-system-time" class="btn-toggle" type="button">System time</button>
              <button id="btn-sync-location" class="btn-toggle" type="button" disabled title="Location sync is not connected">Location off</button>
              <button id="btn-time-reset" class="btn-toggle" type="button">Reset time</button>
              <div id="sync-status" class="sync-status" role="status" aria-live="polite" hidden></div>
            </div>
          </div>
        </section>

        <section id="panel-cloud" class="control-panel control-panel--cloud" data-panel-key="cloudPanel" aria-label="Cloud controls"${o}>
          <div class="control-panel__chrome">
          <span class="control-panel__title">CLOUD BODY // SYSTEM + POWER + STRUCTURE</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-close="cloudPanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--storm">
              <span class="control-group__label">Storm</span>
              <div class="slider-group">
                <label for="input-seed">Seed</label>
                <input id="input-seed" class="seed-input" type="number" min="1" step="1">
                <button id="btn-random-seed" class="btn-action" type="button">New</button>
              </div>
              <div class="slider-group">
                <label for="slider-systems">Convective cells</label>
                <input id="slider-systems" type="range" min="1" max="10" step="1" value="1">
                <span id="systems-readout" class="readout">1</span>
              </div>
            </div>

            <div class="control-group control-group--render">
              <span class="control-group__label">Render</span>
              <div class="slider-group">
                <label for="slider-quality">Power</label>
                <input id="slider-quality" type="range" min="0.45" max="1" step="0.01" value="0.80">
                <span id="quality-readout" class="readout">0.80x</span>
              </div>
              <button id="btn-auto-quality" class="btn-toggle quality-auto" type="button">Auto power</button>
              <button id="btn-hdr10" class="btn-toggle" type="button">HDR10</button>
              <button id="btn-dither" class="btn-toggle" type="button">Dither</button>
            </div>

            <div class="control-group control-group--cloud-structure">
              <span class="control-group__label">Cloud structure</span>
              <label class="select-group morphology-select">
                <span>Morph</span>
                <select id="select-morphology" class="tp-select">
                  ${L0()}
                </select>
              </label>
              ${D0()}
              <div class="slider-group accent-red">
                <label for="slider-tropo">Top</label>
                <input id="slider-tropo" type="range" min="8" max="18" step="0.5" value="8">
                <span id="tropo-readout" class="readout">8km</span>
              </div>
              <div class="slider-group">
                <label for="slider-freezing">Freezing</label>
                <input id="slider-freezing" type="range" min="3" max="6" step="0.25" value="3">
                <span id="freezing-readout" class="readout">3km</span>
              </div>
              <div class="slider-group">
                <label for="slider-shear">Shear</label>
                <input id="slider-shear" type="range" min="0" max="1" step="0.05" value="0.3">
                <span id="shear-readout" class="readout">0.30</span>
              </div>
            </div>
          </div>
        </section>

        <section id="panel-atmosphere" class="control-panel control-panel--atmosphere" data-panel-key="atmospherePanel" aria-label="Atmosphere controls"${c}>
          <div class="control-panel__chrome">
            <span class="control-panel__title">ATMOSPHERE // SUN GEOMETRY</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-close="atmospherePanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--atmosphere">
              <span class="control-group__label">Atmosphere</span>
              <div class="slider-group slider-group--sun">
                <span class="slider-label">
                  <span>Sun</span>
                  <button id="btn-link-sun-elevation" class="link-chip enabled" type="button" title="Unlink sun intensity from elevation"></button>
                </span>
                <input id="slider-sun" type="range" min="0" max="8" step="0.1" value="4">
                <span id="sun-readout" class="readout">4.0</span>
              </div>
              <div class="slider-group slider-group--elevation">
                <span class="slider-label">
                  <span>Elev</span>
                  <button id="btn-link-elevation-sun" class="link-chip enabled" type="button" title="Unlink sun intensity from elevation"></button>
                </span>
                <input id="slider-sun-elevation" type="range" min="-18" max="82" step="1" value="32">
                <span id="sun-elevation-readout" class="readout">32deg</span>
              </div>
              <div class="slider-group slider-group--ambient">
                <label for="slider-ambient">Ambient</label>
                <input id="slider-ambient" type="range" min="0.2" max="1.2" step="0.05" value="0.68">
                <span id="ambient-readout" class="readout">0.68</span>
              </div>
              <div class="slider-group slider-group--angle">
                <label for="slider-sun-angle">Angle</label>
                <input id="slider-sun-angle" type="range" min="-180" max="180" step="5" value="-50">
                <span id="sun-angle-readout" class="readout">-50deg</span>
              </div>
              <div id="solar-orbit-widget" class="solar-orbit-widget" aria-label="Sun and Earth relation">
                <canvas id="atm-canvas" aria-label="Atmospheric scattering model"></canvas>
                <div class="atm-dashboard">
                  <div class="atm-meter"><span>Elev <strong id="dash-elev-val">0deg</strong></span><i><b id="dash-elev-fill"></b></i></div>
                  <div class="atm-meter"><span>Direct <strong id="dash-dir-val">0%</strong></span><i><b id="dash-dir-fill"></b></i></div>
                  <div class="atm-meter"><span>Diffuse <strong id="dash-dif-val">0%</strong></span><i><b id="dash-dif-fill"></b></i></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="panel-restore-dock" class="panel-restore-dock" hidden${d} aria-label="Closed panels">
        <button type="button" data-hud-restore hidden>HUD</button>
        <button type="button" data-panel-restore="mainPanel" hidden>Main</button>
        <button type="button" data-panel-restore="timePanel" hidden>Time</button>
        <button id="dock-time-toggle" class="dock-time-toggle" type="button" hidden>PAUSE</button>
        <button type="button" data-panel-restore="cloudPanel" hidden>Cloud</button>
        <button type="button" data-panel-restore="atmospherePanel" hidden>Atmosphere</button>
      </div>
    </div>
  `}function jo(n){const e=document.querySelector(n);if(!e)throw new Error(`Missing app shell element: ${n}`);return e}function P0(n){const e=n.orientation==="landscape"?{width:960,height:540}:{width:540,height:960};return{width:Math.round(n.simWidth??e.width),height:Math.round(n.simHeight??e.height)}}function L0(){return Dr.map(n=>`<option value="${n.value}">${Ui(n.label)}</option>`).join("")}function D0(){return`
    <div id="cloud-morphology-library" class="morphology-library" aria-label="Cloud morphology library">
      <div class="morphology-library__status" aria-live="polite">
        <span class="morphology-library__eyebrow">Morphology database</span>
        <strong id="morphology-library-current">Seeded pool</strong>
        <small id="morphology-library-intent">Seed-driven blend of macro silhouette, surface breakup, and edge traits.</small>
      </div>
      <div class="morphology-library__grid" role="list" aria-label="Available morphology styles">
        ${Dr.map(e=>`
      <button class="morphology-card" type="button" data-morphology-style="${e.value}" aria-pressed="false">
        <span class="morphology-card__code">${Ui(e.code)}</span>
        <strong>${Ui(e.label)}</strong>
        <span class="morphology-card__intent">${Ui(e.intent)}</span>
        <em>${e.traits.map(Ui).join(" / ")}</em>
      </button>`).join("")}
      </div>
    </div>
  `}function Ui(n){return n.replace(/[&<>"']/g,e=>{switch(e){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";default:return"&#39;"}})}const ps=Yn,I0=900,U0=1400,Jo=2600;let Ur="zh-TW",vr;function N0(n,e){const t=F0(n);O0(t),Wt(t,e.getOptions(),e.isPaused()),B0(t,e);const i=z0(t,e);t.landscapeButton?.addEventListener("click",()=>{e.setOrientation("landscape"),Wt(t,e.getOptions(),e.isPaused())}),t.portraitButton?.addEventListener("click",()=>{e.setOrientation("portrait"),Wt(t,e.getOptions(),e.isPaused())}),t.fullscreenButton?.addEventListener("click",()=>{if(document.fullscreenElement){document.exitFullscreen();return}document.documentElement.requestFullscreen()}),t.toggleOtherPanelsButton?.addEventListener("click",()=>k0(n)),t.gridButton?.addEventListener("click",()=>{const r=!e.getOptions().showGrid;e.setOptions({showGrid:r}),t.gridButton?.classList.toggle("enabled",r)}),t.randomSeedButton?.addEventListener("click",()=>{const r=e.randomizeSeed();t.seedInput&&(t.seedInput.value=String(r))}),t.hdr10Button?.addEventListener("click",()=>{const r=!e.getOptions().hdr10;e.setOptions({hdr10:r}),t.hdr10Button?.classList.toggle("enabled",r)}),t.ditherButton?.addEventListener("click",()=>{const r=!e.getOptions().dither;e.setOptions({dither:r}),t.ditherButton?.classList.toggle("enabled",r)}),t.autoQualityButton?.addEventListener("click",()=>{const r=!t.autoQualityButton?.classList.contains("enabled");e.setOptions({...r?Wl("low"):{},autoQuality:r}),Wt(t,e.getOptions(),e.isPaused()),i()}),t.timeToggleButton?.addEventListener("click",()=>{const r=e.togglePaused();gs(t.timeToggleButton,r),_s(t.dockTimeToggleButton,r),gn(t.fpsCounter,e.getOptions(),r,t,e.getRenderStats())}),t.dockTimeToggleButton?.addEventListener("click",()=>{const r=e.togglePaused();gs(t.timeToggleButton,r),_s(t.dockTimeToggleButton,r),gn(t.fpsCounter,e.getOptions(),r,t,e.getRenderStats())}),t.timeResetButton?.addEventListener("click",()=>e.setOptions({time:2.2})),t.syncSystemTimeButton?.addEventListener("click",()=>{const r=tl(t,e);t.syncSystemTimeButton?.classList.add("enabled"),lt(t.syncStatus,`System time ${r.toLocaleTimeString()}`),t.syncStatus&&(t.syncStatus.hidden=!1),Wt(t,e.getOptions(),e.isPaused())}),t.syncTimeCheckbox?.addEventListener("change",()=>{if(!t.syncTimeCheckbox?.checked){t.syncStatus&&(t.syncStatus.hidden=!0);return}tl(t,e),Wt(t,e.getOptions(),e.isPaused())}),t.linkSunElevationButton?.addEventListener("click",()=>nl(t)),t.linkElevationSunButton?.addEventListener("click",()=>nl(t)),t.languageSelect?.addEventListener("change",()=>{Ur=t.languageSelect?.value??"zh-TW",document.documentElement.lang=Ur}),t.surfaceSelect?.addEventListener("change",()=>{const r=t.surfaceSelect?.value;e.setOptions({surfaceMode:r==="ocean"||r==="hills"?r:"none"})}),t.morphologySelect?.addEventListener("change",()=>{const r=el(t.morphologySelect?.value);e.setOptions({morphologyStyle:r}),ql(t,r)});for(const r of t.morphologyButtons)r.addEventListener("click",()=>{const a=el(r.dataset.morphologyStyle);e.setOptions({morphologyStyle:a}),Wt(t,e.getOptions(),e.isPaused())});G0(t.seedInput,r=>e.setOptions({seed:Math.max(1,Math.round(r))})),Qt(t.systemsSlider,t.systemsReadout,r=>r.toFixed(0),r=>e.setOptions({systems:Math.round(r)})),Qt(t.qualitySlider,t.qualityReadout,r=>`${r.toFixed(2)}x`,r=>{t.autoQualityButton?.classList.remove("enabled"),e.setOptions({autoQuality:!1,qualityTier:void 0,maxPixels:Math.round(ps*r*r)})},()=>gn(t.fpsCounter,e.getOptions(),e.isPaused(),t)),Qt(t.tropoSlider,t.tropoReadout,r=>`${r.toFixed(1)}km`,r=>e.setOptions({tropopause:r}),()=>gn(t.fpsCounter,e.getOptions(),e.isPaused(),t)),Qt(t.freezingSlider,t.freezingReadout,r=>`${r.toFixed(1)}km`,r=>e.setOptions({freezingLevel:r}),()=>gn(t.fpsCounter,e.getOptions(),e.isPaused(),t)),Qt(t.shearSlider,t.shearReadout,r=>r.toFixed(2),r=>e.setOptions({windShear:r}),()=>gn(t.fpsCounter,e.getOptions(),e.isPaused(),t)),Qt(t.sunSlider,t.sunReadout,r=>r.toFixed(1),r=>e.setOptions({sunIntensity:r}),()=>Ni(t,e.getOptions())),Qt(t.sunElevationSlider,t.sunElevationReadout,r=>`${r.toFixed(0)}deg`,r=>e.setOptions(X0(t,r)),()=>Ni(t,e.getOptions())),Qt(t.ambientSlider,t.ambientReadout,r=>r.toFixed(2),r=>e.setOptions({ambientIntensity:r}),()=>Ni(t,e.getOptions())),Qt(t.sunAngleSlider,t.sunAngleReadout,r=>`${r.toFixed(0)}deg`,r=>e.setOptions({sunViewerAngle:r}),()=>Ni(t,e.getOptions())),H0(t.atmosphereTimeInput,r=>{e.setOptions(Is(r)),Wt(t,e.getOptions(),e.isPaused())}),V0(t,e),Qt(t.timeSlider,t.timeReadout,r=>`${r.toFixed(1)}x`,r=>e.setOptions({timeScale:r}),()=>gn(t.fpsCounter,e.getOptions(),e.isPaused(),t)),i()}function F0(n){return{landscapeButton:n.querySelector("#btn-landscape"),portraitButton:n.querySelector("#btn-portrait"),fullscreenButton:n.querySelector("#btn-fullscreen"),toggleOtherPanelsButton:n.querySelector("#btn-toggle-other-panels"),gridButton:n.querySelector("#btn-grid"),languageSelect:n.querySelector("#select-language"),surfaceSelect:n.querySelector("#select-surface"),morphologySelect:n.querySelector("#select-morphology"),morphologyButtons:[...n.querySelectorAll("[data-morphology-style]")],morphologyCurrentLabel:n.querySelector("#morphology-library-current"),morphologyCurrentIntent:n.querySelector("#morphology-library-intent"),seedInput:n.querySelector("#input-seed"),randomSeedButton:n.querySelector("#btn-random-seed"),systemsSlider:n.querySelector("#slider-systems"),systemsReadout:n.querySelector("#systems-readout"),qualitySlider:n.querySelector("#slider-quality"),qualityReadout:n.querySelector("#quality-readout"),hdr10Button:n.querySelector("#btn-hdr10"),ditherButton:n.querySelector("#btn-dither"),tropoSlider:n.querySelector("#slider-tropo"),tropoReadout:n.querySelector("#tropo-readout"),freezingSlider:n.querySelector("#slider-freezing"),freezingReadout:n.querySelector("#freezing-readout"),shearSlider:n.querySelector("#slider-shear"),shearReadout:n.querySelector("#shear-readout"),sunSlider:n.querySelector("#slider-sun"),sunReadout:n.querySelector("#sun-readout"),sunElevationSlider:n.querySelector("#slider-sun-elevation"),sunElevationReadout:n.querySelector("#sun-elevation-readout"),ambientSlider:n.querySelector("#slider-ambient"),ambientReadout:n.querySelector("#ambient-readout"),sunAngleSlider:n.querySelector("#slider-sun-angle"),sunAngleReadout:n.querySelector("#sun-angle-readout"),atmosphereTimeInput:n.querySelector("#input-atmosphere-time"),timeSlider:n.querySelector("#slider-time"),timeReadout:n.querySelector("#time-readout"),timeToggleButton:n.querySelector("#btn-time-toggle"),timeResetButton:n.querySelector("#btn-time-reset"),syncSystemTimeButton:n.querySelector("#btn-sync-system-time"),syncLocationButton:n.querySelector("#btn-sync-location"),syncTimeCheckbox:n.querySelector("#checkbox-sync-time"),syncStatus:n.querySelector("#sync-status"),dockTimeToggleButton:n.querySelector("#dock-time-toggle"),autoQualityButton:n.querySelector("#btn-auto-quality"),linkSunElevationButton:n.querySelector("#btn-link-sun-elevation"),linkElevationSunButton:n.querySelector("#btn-link-elevation-sun"),atmosphereCanvas:n.querySelector("#atm-canvas"),elevationValue:n.querySelector("#dash-elev-val"),elevationFill:n.querySelector("#dash-elev-fill"),directValue:n.querySelector("#dash-dir-val"),directFill:n.querySelector("#dash-dir-fill"),diffuseValue:n.querySelector("#dash-dif-val"),diffuseFill:n.querySelector("#dash-dif-fill"),fpsCounter:n.querySelector("#fps-counter"),cloudCanvas:n.querySelector("#cloud-canvas")}}function O0(n){n.syncLocationButton&&(n.syncLocationButton.disabled=!0,n.syncLocationButton.classList.remove("enabled"),n.syncLocationButton.setAttribute("aria-disabled","true"),n.syncLocationButton.title="Location sync is not connected")}function B0(n,e){vr!==void 0&&cancelAnimationFrame(vr);let t=0;const i=r=>{r-t>=500&&(t=r,gn(n.fpsCounter,e.getOptions(),e.isPaused(),n,e.getRenderStats())),vr=requestAnimationFrame(i)};vr=requestAnimationFrame(i)}function z0(n,e){let t;const i=()=>{t!==void 0&&(window.clearTimeout(t),t=void 0)},r=()=>{const o=e.getOptions();return o.displayProfile.mobileWideView&&o.autoQuality},a=(o=I0)=>{i(),r()&&(t=window.setTimeout(s,o))},s=()=>{t=void 0;const o=e.getOptions();if(!r())return;if(document.documentElement.dataset.renderStatus!=="ready"){a(500);return}const l=o.qualityTier??"low",c=Xi(l),d=c0(l);if(!d){Wt(n,o,e.isPaused());return}const p=e.getRenderStats(),u=p.lastFrameDurationMs??p.averageFrameDurationMs;if(u===void 0||!Number.isFinite(u)){a(Jo);return}if(u<=c.upgradeFrameBudgetMs){e.setOptions({...Wl(d),autoQuality:!0}),Wt(n,e.getOptions(),e.isPaused()),a(U0);return}a(Jo)};return a}function Wt(n,e,t){const i=Kl(e);document.documentElement.lang=Ur,Qo(n.landscapeButton,e.orientation==="landscape"),Qo(n.portraitButton,e.orientation==="portrait"),St(n.languageSelect,Ur),St(n.surfaceSelect,e.surfaceMode??"none"),St(n.morphologySelect,e.morphologyStyle??"seeded"),ql(n,e.morphologyStyle??"seeded"),St(n.seedInput,String(e.seed??574)),St(n.systemsSlider,String(e.systems??1)),St(n.tropoSlider,String(e.tropopause??11.2)),St(n.freezingSlider,String(e.freezingLevel??4.4)),St(n.shearSlider,String(e.windShear??.42)),St(n.sunSlider,String(e.sunIntensity??7.4)),St(n.sunElevationSlider,String(e.sunElevation??62)),St(n.ambientSlider,String(e.ambientIntensity??.66)),St(n.sunAngleSlider,String(e.sunViewerAngle??18)),St(n.atmosphereTimeInput,q0($l(e))),St(n.timeSlider,String(e.timeScale??1)),St(n.qualitySlider,i.toFixed(2)),lt(n.systemsReadout,String(e.systems??1)),lt(n.tropoReadout,`${(e.tropopause??11.2).toFixed(1)}km`),lt(n.freezingReadout,`${(e.freezingLevel??4.4).toFixed(1)}km`),lt(n.shearReadout,(e.windShear??.42).toFixed(2)),lt(n.sunReadout,(e.sunIntensity??7.4).toFixed(1)),lt(n.sunElevationReadout,`${(e.sunElevation??62).toFixed(0)}deg`),lt(n.ambientReadout,(e.ambientIntensity??.66).toFixed(2)),lt(n.sunAngleReadout,`${(e.sunViewerAngle??18).toFixed(0)}deg`),lt(n.timeReadout,`${(e.timeScale??1).toFixed(1)}x`),lt(n.qualityReadout,`${i.toFixed(2)}x`),n.autoQualityButton?.classList.toggle("enabled",e.autoQuality),gs(n.timeToggleButton,t),_s(n.dockTimeToggleButton,t),Ni(n,e),gn(n.fpsCounter,e,t,n),n.gridButton?.classList.toggle("enabled",e.showGrid??!1),n.hdr10Button?.classList.toggle("enabled",e.hdr10??!1),n.ditherButton?.classList.toggle("enabled",e.dither??!1)}function k0(n){const e=["timePanel","cloudPanel","atmospherePanel"].map(i=>n.querySelector(`[data-panel-key="${i}"]`)).filter(i=>!!i),t=e.some(i=>i.hidden);for(const i of e)i.hidden=!t;ms(n),mi(n)}function ms(n){const e=n.querySelector("#panel-restore-dock");e&&delete e.dataset.restoreSuppressed}function mi(n){const e=n.querySelector("#panel-restore-dock");if(!e)return;if(e.dataset.restoreSuppressed==="true"){e.hidden=!0;return}let t=!1;for(const a of e.querySelectorAll("[data-panel-restore]")){const o=!!n.querySelector(`[data-panel-key="${a.dataset.panelRestore}"]`)?.hidden;a.hidden=!o,t||=o}const i=e.querySelector("[data-hud-restore]"),r=n.querySelector("#cloud-hud")?.hidden??!1;i&&(i.hidden=!r,t||=r),e.hidden=!t}function Qt(n,e,t,i,r){n?.addEventListener("input",()=>{const a=Number(n.value);Number.isFinite(a)&&(lt(e,t(a)),i(a),r?.())})}function G0(n,e){n?.addEventListener("change",()=>{const t=Number(n.value);Number.isFinite(t)&&e(t)})}function H0(n,e){const t=()=>{const i=Y0(n?.value??"");i!==null&&e(i)};n?.addEventListener("change",t),n?.addEventListener("input",t)}function V0(n,e){const t=n.atmosphereCanvas;if(!t)return;const i=t.closest("#solar-orbit-widget");let r=null;const a=o=>{e.setOptions(W0(t,o.clientX,o.clientY)),n.syncTimeCheckbox&&(n.syncTimeCheckbox.checked=!1),n.syncStatus&&(n.syncStatus.hidden=!0),Wt(n,e.getOptions(),e.isPaused())};t.addEventListener("pointerdown",o=>{if(!(o.pointerType==="mouse"&&o.button!==0)){r=o.pointerId;try{t.setPointerCapture(o.pointerId)}catch{}i?.classList.add("is-dragging"),o.preventDefault(),a(o)}}),t.addEventListener("pointermove",o=>{r===o.pointerId&&(o.preventDefault(),a(o))});const s=o=>{if(r===o.pointerId){try{t.hasPointerCapture(o.pointerId)&&t.releasePointerCapture(o.pointerId)}catch{}r=null,i?.classList.remove("is-dragging")}};t.addEventListener("pointerup",s),t.addEventListener("pointercancel",s),t.addEventListener("lostpointercapture",()=>{r=null,i?.classList.remove("is-dragging")})}function W0(n,e,t){const i=n.getBoundingClientRect(),r=Math.max(2,i.width||240),a=Math.max(2,i.height||110),s=r/2,o=a-16,l=Math.max(1,Math.min(r/2-12,a-25)),c=vi(e-i.left,s-l,s+l),d=vi(t-i.top,o-l,o),p=c-s,u=o-d,m=Math.hypot(p,u)<1?Math.PI/2:vi(Math.atan2(u,p),0,Math.PI),M=6+(1-m/Math.PI)*12,f=Math.round(Math.sin(m)*82);return{...Is(M),...Yl(f)}}function St(n,e){n&&(n.value=e)}function Qo(n,e){n?.classList.toggle("active",e),n?.setAttribute("aria-pressed",e?"true":"false")}function el(n){return Hl(n)??"seeded"}function ql(n,e){const t=n0(e);lt(n.morphologyCurrentLabel,t.label),lt(n.morphologyCurrentIntent,t.intent);for(const i of n.morphologyButtons){const r=i0(i.dataset.morphologyStyle)?i.dataset.morphologyStyle===t.value:!1;i.classList.toggle("active",r),i.setAttribute("aria-pressed",r?"true":"false")}}function gs(n,e){const t=n?.dataset.playbackLabel==="play"?"Play":"Resume",i=e?t:"Pause";lt(n,i),n?.classList.toggle("enabled",e),n?.setAttribute("aria-pressed",e?"true":"false"),n?.setAttribute("aria-label",i)}function _s(n,e){lt(n,e?"RESUME":"PAUSE"),n?.classList.toggle("enabled",e),n?.setAttribute("aria-label",e?"Resume":"Pause")}function lt(n,e){n&&(n.textContent=e)}function tl(n,e){const t=new Date,i=t.getHours()+t.getMinutes()/60;return e.setOptions(Is(i)),n.syncTimeCheckbox&&(n.syncTimeCheckbox.checked=!0),t}function nl(n){const e=!n.linkSunElevationButton?.classList.contains("enabled");n.linkSunElevationButton?.classList.toggle("enabled",e),n.linkElevationSunButton?.classList.toggle("enabled",e)}function X0(n,e){if(!n.linkSunElevationButton?.classList.contains("enabled"))return{sunElevation:e};const t=Yl(e),i=t.sunIntensity??0,r=t.ambientIntensity??0;return St(n.sunSlider,String(i)),lt(n.sunReadout,i.toFixed(1)),St(n.ambientSlider,String(r)),lt(n.ambientReadout,r.toFixed(2)),t}function Yl(n){const e=vi(Math.pow(Math.max(0,n)/90,.65),0,1),t=vi(Math.pow(Math.max(0,n+18)/108,.8),0,1);return{sunElevation:n,sunIntensity:Number((e*8).toFixed(1)),ambientIntensity:Number((t*1.2).toFixed(2))}}function Is(n){const e=Nr(n),t=Math.max(0,Math.sin((e-6)/12*Math.PI)),i=Math.round(-8+t*70);return{time:Number(e.toFixed(2)),sunElevation:i,sunIntensity:Number((t*7.2).toFixed(1)),ambientIntensity:Number((.36+t*.72).toFixed(2)),sunViewerAngle:Math.round((e-12)*15)}}function $l(n){return typeof n.sunViewerAngle=="number"&&Number.isFinite(n.sunViewerAngle)?Nr(12+n.sunViewerAngle/15):typeof n.time=="number"&&Number.isFinite(n.time)?Nr(n.time):9}function Nr(n){return Number.isFinite(n)?(n%24+24)%24:9}function vi(n,e,t){return Math.max(e,Math.min(t,n))}function q0(n){const e=Nr(n),t=Math.floor(e),i=Math.round((e-t)*60),r=(t+Math.floor(i/60))%24,a=i%60;return`${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")}`}function Y0(n){const e=/^(\d{1,2}):(\d{2})$/.exec(n.trim());if(!e)return null;const t=Number(e[1]),i=Number(e[2]);return!Number.isInteger(t)||!Number.isInteger(i)||t>23||i>59?null:t+i/60}function Ni(n,e){const t=n.atmosphereCanvas;if(!t)return;const i=t.getBoundingClientRect(),r=Math.max(2,Math.round(i.width||240)),a=Math.max(2,Math.round(i.height||110)),s=window.devicePixelRatio||1;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s));const o=t.getContext("2d");if(!o)return;const l=t.width,c=t.height,d=e.sunElevation??35,p=d>0?Math.min(1,Math.pow(d/90,.65)):0,u=Math.min(1,Math.pow(Math.max(0,d+18)/108,.8));lt(n.elevationValue,`${d.toFixed(1)}deg`),ya(n.elevationFill,Math.max(0,Math.min(100,d/90*100))),lt(n.directValue,`${(p*100).toFixed(0)}%`),ya(n.directFill,p*100),lt(n.diffuseValue,`${(u*100).toFixed(0)}%`),ya(n.diffuseFill,u*100),o.clearRect(0,0,l,c);const m=l/2,v=c-16*s,M=Math.min(l/2-12*s,c-25*s),f=o.createRadialGradient(m,v,M*.2,m,v,M);f.addColorStop(0,`rgba(145, 190, 255, ${.3+u*.45})`),f.addColorStop(1,`rgba(39, 84, 160, ${.55+u*.28})`),o.beginPath(),o.arc(m,v,M,Math.PI,0),o.fillStyle=f,o.fill(),o.beginPath(),o.arc(m,v,M,Math.PI,0),o.strokeStyle="rgba(255,255,255,0.44)",o.lineWidth=1*s,o.setLineDash([4*s,4*s]),o.stroke(),o.setLineDash([]),o.beginPath(),o.moveTo(m-M-20*s,v),o.lineTo(m+M+20*s,v),o.strokeStyle="rgba(255,255,255,0.38)",o.lineWidth=2*s,o.stroke();const h=$l(e),y=vi((h-6)/12,0,1),T=Math.PI-y*Math.PI,E=M+10*s,P=m+Math.cos(T)*E,b=v-Math.sin(T)*E;o.beginPath(),o.moveTo(m,v),o.lineTo(P,b),o.strokeStyle=`rgba(215, 181, 82, ${.36+p*.42})`,o.lineWidth=(4+8*p)*s,o.stroke(),o.beginPath(),o.arc(P,b,8*s,0,Math.PI*2),o.fillStyle="#efe6a7",o.fill(),o.beginPath(),o.arc(P,b,13*s,0,Math.PI*2),o.fillStyle="rgba(239, 230, 167, 0.28)",o.fill()}function ya(n,e){n&&(n.style.width=`${Math.max(0,Math.min(100,e))}%`)}function gn(n,e,t,i,r){const s=Kl(e).toFixed(2),o=i?.cloudCanvas??document.querySelector("#cloud-canvas"),l=o?.width??0,c=o?.height??0,d=l>0&&c>0?`${l}x${c}`:"--",p=l>0&&c>0?(l/c).toFixed(2):e.orientation==="landscape"?"1.78":"0.56",u=e.qualityTier?` ${Xi(e.qualityTier).label}`:"",m=xr(r?.measuredFps,1),v=xr(r?.averageFps,1),M=xr(r?.lastFrameDurationMs,1),f=xr(r?.averageFrameDurationMs,1),h=r?String(r.frameCount):"--";lt(n,`FPS: ${m} | AVG: ${v} | Frame: ${h} | Last: ${M}ms | Mean: ${f}ms | RES: ${s}x eff ${s}x${e.autoQuality?" AUTO":""}${u} | BUF: ${d} | Aspect: ${p} | Tropo: ${(e.tropopause??12).toFixed(1)}km -> ${(e.tropopause??12).toFixed(1)}km | Freeze: ${(e.freezingLevel??5).toFixed(1)}km | Shear: ${(e.windShear??.7).toFixed(2)} | Time: ${t?"paused":`${(e.timeScale??1).toFixed(1)}x`} | T: ${(e.time??0).toFixed(1)}`)}function xr(n,e){return n===void 0||!Number.isFinite(n)?"--":n.toFixed(e)}function Kl(n){return Math.sqrt((n.maxPixels??ps)/ps)}const $0=4;function K0(n){const e=[...n.querySelectorAll(".control-panel[data-panel-key]")];for(const t of e)t.dataset.panelKey&&Z0(t);for(const t of n.querySelectorAll("[data-panel-close]"))t.addEventListener("click",()=>{const i=n.querySelector(`[data-panel-key="${t.dataset.panelClose}"]`);i&&(i.hidden=!0,ms(n),mi(n))});for(const t of n.querySelectorAll("[data-panel-restore]"))t.addEventListener("click",()=>{const i=n.querySelector(`[data-panel-key="${t.dataset.panelRestore}"]`);i&&(i.hidden=!1,mi(n))});for(const t of n.querySelectorAll("[data-panel-minimize]"))t.addEventListener("click",()=>{const i=n.querySelector(`[data-panel-key="${t.dataset.panelMinimize}"]`);if(!i)return;const r=i.dataset.panelCollapsed!=="true";i.dataset.panelCollapsed=r?"true":"false",t.textContent=r?"+":"-",t.setAttribute("aria-expanded",r?"false":"true")});n.querySelector("#btn-hud-close")?.addEventListener("click",()=>{const t=n.querySelector("#cloud-hud");t&&(t.hidden=!0,ms(n),mi(n))}),n.querySelector("[data-hud-restore]")?.addEventListener("click",()=>{const t=n.querySelector("#cloud-hud");t&&(t.hidden=!1,mi(n))}),mi(n)}function Z0(n){if(n.classList.contains("control-panel--mobile-time"))return;const e=n.querySelector(".control-panel__chrome");if(!e)return;let t=!1,i=!1,r=0,a=0,s=0,o=0,l,c=0,d=0,p=!1,u;const m=()=>{u=void 0,p&&(n.style.left=`${c}px`,n.style.top=`${d}px`,n.style.right="auto",n.style.bottom="auto",n.style.transform="none",n.dataset.floatingCustomized="true",p=!1)},v=()=>{u===void 0&&(u=requestAnimationFrame(m))},M=f=>{if(!t&&!i||f&&f.pointerId!==l)return;const h=i;if(t=!1,i=!1,h&&u!==void 0?(cancelAnimationFrame(u),m()):u!==void 0&&(cancelAnimationFrame(u),u=void 0),p=!1,n.classList.remove("floating-panel--dragging"),l!==void 0&&e.hasPointerCapture(l))try{e.releasePointerCapture(l)}catch{}l=void 0};e.addEventListener("pointerdown",f=>{if(f.button!==0||n.hidden||f.target?.closest("button, input, select, textarea, a"))return;const y=n.getBoundingClientRect();t=!0,i=!1,r=f.clientX,a=f.clientY,s=y.left,o=y.top,l=f.pointerId,e.setPointerCapture(f.pointerId)}),e.addEventListener("pointermove",f=>{if(!t||f.pointerId!==l)return;const h=f.clientX-r,y=f.clientY-a;if(!i){if(Math.hypot(h,y)<$0)return;i=!0,n.classList.add("floating-panel--dragging")}c=il(s+h,8,window.innerWidth-80),d=il(o+y,8,window.innerHeight-42),p=!0,v(),f.preventDefault()}),e.addEventListener("pointerup",M),e.addEventListener("pointercancel",M),e.addEventListener("lostpointercapture",()=>M())}function il(n,e,t){return Math.max(e,Math.min(t,n))}function j0(n){const e=()=>{const i=n.getBoundingClientRect(),r=document.documentElement.style;r.setProperty("--stage-render-top",`${Math.max(0,i.top)}px`),r.setProperty("--stage-render-right",`${Math.max(0,i.right)}px`),r.setProperty("--stage-render-bottom",`${Math.max(0,i.bottom)}px`),r.setProperty("--stage-render-left",`${Math.max(0,i.left)}px`)},t=new ResizeObserver(e);return t.observe(n),window.addEventListener("resize",e),requestAnimationFrame(e),()=>{t.disconnect(),window.removeEventListener("resize",e)}}const J0=new URLSearchParams(window.location.search),Q0=rl(),Us=l0(J0,Q0),Fi=w0(Us),eg=j0(Fi.renderContainer);let Zl;document.documentElement.dataset.renderStatus="shell-ready";document.documentElement.dataset.appModuleStatus="loading";document.body.dataset.ui="tracing-paper";document.body.dataset.viewportMode="background";document.body.dataset.controlsHidden=Us.controlsVisible?"false":"true";window.addEventListener("beforeunload",()=>{eg(),Zl?.()});oc(async()=>{const{CloudApp:n}=await import("./cloud-app-pUurXJtc.js");return{CloudApp:n}},[]).then(({CloudApp:n})=>{document.documentElement.dataset.appModuleStatus="loaded";const e=new n(Fi.canvas,Us);Zl=()=>e.dispose(),N0(Fi.root,e),K0(Fi.root),e.start()}).catch(n=>{document.documentElement.dataset.appModuleStatus="error",document.documentElement.dataset.renderStatus="app-error",Fi.canvas.setAttribute("aria-label","Cloud renderer failed to load"),console.error("Cumulonimbus app startup failed:",n)});export{tg as R,A0 as c};
