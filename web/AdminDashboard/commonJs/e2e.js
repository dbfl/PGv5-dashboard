var my = {};
function genKeyRandom() {
	var ck = false, randomBytes = null, getRandomValues = null, bytes = new Array(
			16), h = sjcl.codec.hex;
	sjcl.random = new sjcl.prng(10);// paranoia 0->10
	sjcl.random.setDefaultParanoia(10, false);
	sjcl.random.startCollectors();
	var array = null;
	var crypto = false;
	try {
		if (window.crypto && window.crypto.getRandomValues) {
			ck = true;
			crypto = window.crypto;// .getRandomValues(array);
		} else if (window.msCrypto && window.msCrypto.getRandomValues) {
			ck = true;
			crypto = window.msCrypto;// .getRandomValues(array);
		}
		if (ck && crypto) {
			array = new Uint32Array(128);// 6----32, 128---1024
			crypto.getRandomValues(array);
			sjcl.random.addEntropy(array, 1024, "crypto.getRandomValues");// crypto['getRandomValues']
		} else {
			array = [];
			for (var i = 0; i < 128; i++) {
				array[i] = 0;
			}
			sjcl.random.addEntropy(array, 1024, "loadtime");
			sjcl.random.addEntropy(array, 1024, "mousemove");
			sjcl.random.addEntropy(array, 1024, "accelerometer");
			sjcl.random.addEntropy(array, 1024, "keypress");
		}
		if (sjcl.random.isReady(10)) {

			sjcl.random.stopCollectors();
			randomBytes = sjcl.random.randomWords(bytes.length, 10);
			if (randomBytes) {
				for (var i = 0; i < randomBytes.length; i++)
					bytes[i] = randomBytes[i];
			} else {
				console.log("Error: random data null");
			}
		} else {
			console.log("Error: notready exception");
		}

	} catch (e) {
		console.log("exception");
	}
	return h.fromBits(bytes);
}

function createElementJS(src){
	this.domreq = document.createElement("script");
	this.domreq.setAttribute("language", "JavaScript");
	this.domreq.setAttribute("type", "text/javascript");
	this.domreq.setAttribute("charset", "UTF-8");
	this.domreq.setAttribute("src", src); 
	document.getElementsByTagName('head').item(0).appendChild(this.domreq);	
}

function globalEvalJson(data){
	var jsData = JSON.stringify(data).replace(/\\"/g, '"');
		jsData = jsData.substring(1, jsData.length - 1);
	globalEval(jsData);
}
var globalEval = function globalEval(src) {
    if (window.execScript) {
        window.execScript(src);
        return;
    }
    var fn = function() {
        window.eval.call(window,src);
    };
    fn();
};

function SHA256(s){
	
 	var chrsz   = 8;
	var hexcase = 0;
	 
		function safe_add (x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}
	 
		function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
		function R (X, n) { return ( X >>> n ); }
		function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
		function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
		function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
		function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
		function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
		function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
	 
		function core_sha256 (m, l) {
			var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
			var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
			var W = new Array(64);
			var a, b, c, d, e, f, g, h, i, j;
			var T1, T2;
	 
			m[l >> 5] |= 0x80 << (24 - l % 32);
			m[((l + 64 >> 9) << 4) + 15] = l;
	 
			for ( var i = 0; i<m.length; i+=16 ) {
				a = HASH[0];
				b = HASH[1];
				c = HASH[2];
				d = HASH[3];
				e = HASH[4];
				f = HASH[5];
				g = HASH[6];
				h = HASH[7];
	 
				for ( var j = 0; j<64; j++) {
					if (j < 16) W[j] = m[j + i];
					else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
	 
					T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
					T2 = safe_add(Sigma0256(a), Maj(a, b, c));
	 
					h = g;
					g = f;
					f = e;
					e = safe_add(d, T1);
					d = c;
					c = b;
					b = a;
					a = safe_add(T1, T2);
				}
	 
				HASH[0] = safe_add(a, HASH[0]);
				HASH[1] = safe_add(b, HASH[1]);
				HASH[2] = safe_add(c, HASH[2]);
				HASH[3] = safe_add(d, HASH[3]);
				HASH[4] = safe_add(e, HASH[4]);
				HASH[5] = safe_add(f, HASH[5]);
				HASH[6] = safe_add(g, HASH[6]);
				HASH[7] = safe_add(h, HASH[7]);
			}
			return HASH;
		}
	 
		function str2binb (str) {
			var bin = Array();
			var mask = (1 << chrsz) - 1;
			for(var i = 0; i < str.length * chrsz; i += chrsz) {
				bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
			}
			return bin;
		}
	 
		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
	 
			for (var n = 0; n < string.length; n++) {
	 
				var c = string.charCodeAt(n);
	 
				if (c < 128) { 
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
	 
			}
	 
			return utftext;
		}
	 
		function binb2hex (binarray) {
			var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
			var str = "";
			for(var i = 0; i < binarray.length * 4; i++) {
				str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
				hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
			}
			return str;
		}
	 
		s = Utf8Encode(s);
		return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(message){this.toString=function(){return"CORRUPT: "+this.message};this.message=message},invalid:function(message){this.toString=function(){return"INVALID: "+this.message};this.message=message},bug:function(message){this.toString=function(){return"BUG: "+this.message};this.message=message},notReady:function(message){this.toString=function(){return"NOT READY: "+this.message};this.message=message}}};
if(typeof module!=="undefined"&&module.exports)module.exports=sjcl;
sjcl.prng=function(defaultParanoia){this._pools=[new sjcl.hash.sha256];this._poolEntropy=[0];this._reseedCount=0;this._robins={};this._eventId=0;this._collectorIds={};this._collectorIdNext=0;this._strength=0;this._poolStrength=0;this._nextReseed=0;this._key=[0,0,0,0,0,0,0,0];this._counter=[0,0,0,0];this._cipher=undefined;this._defaultParanoia=defaultParanoia;this._collectorsStarted=false;this._callbacks={progress:{},seeded:{}};this._callbackI=0;this._NOT_READY=0;this._READY=1;this._REQUIRES_RESEED=
2;this._MAX_WORDS_PER_BURST=65536;this._PARANOIA_LEVELS=[0,48,64,96,128,192,256,384,512,768,1024];this._MILLISECONDS_PER_RESEED=3E4;this._BITS_PER_RESEED=80};
sjcl.prng.prototype={randomWords:function(nwords,paranoia){var out=[],i,readiness=this.isReady(paranoia),g;if(readiness===this._NOT_READY)throw new sjcl.exception.notReady("generator isn't seeded");else if(readiness&this._REQUIRES_RESEED){this._reseedFromPools(!(readiness&this._READY))}for(i=0;i<nwords;i+=4){if((i+1)%this._MAX_WORDS_PER_BURST===0)this._gate();g=this._gen4words();
out.push(g[0],g[1],g[2],g[3])}this._gate();return out.slice(0,nwords)},setDefaultParanoia:function(paranoia,allowZeroParanoia){if(paranoia===0&&allowZeroParanoia!=="Setting paranoia=0 will ruin your security; use it only for testing")throw"Setting paranoia=0 will ruin your security; use it only for testing";this._defaultParanoia=paranoia},addEntropy:function(data,estimatedEntropy,source){source=source||"user";var id,i,tmp,t=(new Date).valueOf(),robin=this._robins[source],oldReady=this.isReady(),err=
0,objName;id=this._collectorIds[source];if(id===undefined)id=this._collectorIds[source]=this._collectorIdNext++;if(robin===undefined)robin=this._robins[source]=0;this._robins[source]=(this._robins[source]+1)%this._pools.length;switch(typeof data){case "number":if(estimatedEntropy===undefined)estimatedEntropy=1;this._pools[robin].update([id,this._eventId++,1,estimatedEntropy,t,1,data|0]);break;case "object":objName=Object.prototype.toString.call(data);if(objName==="[object Uint32Array]"){tmp=[];for(i=
0;i<data.length;i++)tmp.push(data[i]);data=tmp}else{if(objName!=="[object Array]")err=1;for(i=0;i<data.length&&!err;i++)if(typeof data[i]!=="number")err=1}if(!err){if(estimatedEntropy===undefined){estimatedEntropy=0;for(i=0;i<data.length;i++){tmp=data[i];while(tmp>0){estimatedEntropy++;tmp=tmp>>>1}}}this._pools[robin].update([id,this._eventId++,2,estimatedEntropy,t,data.length].concat(data))}break;case "string":if(estimatedEntropy===undefined)estimatedEntropy=data.length;this._pools[robin].update([id,
this._eventId++,3,estimatedEntropy,t,data.length]);this._pools[robin].update(data);break;default:err=1}if(err)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this._poolEntropy[robin]+=estimatedEntropy;this._poolStrength+=estimatedEntropy;if(oldReady===this._NOT_READY){if(this.isReady()!==this._NOT_READY)this._fireEvent("seeded",Math.max(this._strength,this._poolStrength));this._fireEvent("progress",this.getProgress())}},isReady:function(paranoia){var entropyRequired=
this._PARANOIA_LEVELS[paranoia!==undefined?paranoia:this._defaultParanoia];if(this._strength&&this._strength>=entropyRequired)return this._poolEntropy[0]>this._BITS_PER_RESEED&&(new Date).valueOf()>this._nextReseed?this._REQUIRES_RESEED|this._READY:this._READY;else return this._poolStrength>=entropyRequired?this._REQUIRES_RESEED|this._NOT_READY:this._NOT_READY},getProgress:function(paranoia){var entropyRequired=this._PARANOIA_LEVELS[paranoia?paranoia:this._defaultParanoia];if(this._strength>=entropyRequired)return 1;
else return this._poolStrength>entropyRequired?1:this._poolStrength/entropyRequired},startCollectors:function(){if(this._collectorsStarted)return;this._eventListener={loadTimeCollector:this._bind(this._loadTimeCollector),mouseCollector:this._bind(this._mouseCollector),keyboardCollector:this._bind(this._keyboardCollector),accelerometerCollector:this._bind(this._accelerometerCollector)};if(window.addEventListener){window.addEventListener("load",this._eventListener.loadTimeCollector,false);window.addEventListener("mousemove",
this._eventListener.mouseCollector,false);window.addEventListener("keypress",this._eventListener.keyboardCollector,false);window.addEventListener("devicemotion",this._eventListener.accelerometerCollector,false)}else if(document.attachEvent){document.attachEvent("onload",this._eventListener.loadTimeCollector);document.attachEvent("onmousemove",this._eventListener.mouseCollector);document.attachEvent("keypress",this._eventListener.keyboardCollector)}else throw new sjcl.exception.bug("can't attach event");
this._collectorsStarted=true},stopCollectors:function(){if(!this._collectorsStarted)return;if(window.removeEventListener){window.removeEventListener("load",this._eventListener.loadTimeCollector,false);window.removeEventListener("mousemove",this._eventListener.mouseCollector,false);window.removeEventListener("keypress",this._eventListener.keyboardCollector,false);window.removeEventListener("devicemotion",this._eventListener.accelerometerCollector,false)}else if(document.detachEvent){document.detachEvent("onload",
this._eventListener.loadTimeCollector);document.detachEvent("onmousemove",this._eventListener.mouseCollector);document.detachEvent("keypress",this._eventListener.keyboardCollector)}this._collectorsStarted=false},addEventListener:function(name,callback){this._callbacks[name][this._callbackI++]=callback},removeEventListener:function(name,cb){var i,j,cbs=this._callbacks[name],jsTemp=[];for(j in cbs)if(cbs.hasOwnProperty(j)&&cbs[j]===cb)jsTemp.push(j);for(i=0;i<jsTemp.length;i++){j=jsTemp[i];delete cbs[j]}},
_bind:function(func){var that=this;return function(){func.apply(that,arguments)}},_gen4words:function(){for(var i=0;i<4;i++){this._counter[i]=this._counter[i]+1|0;if(this._counter[i])break}return this._cipher.encrypt(this._counter)},_gate:function(){this._key=this._gen4words().concat(this._gen4words());this._cipher=new sjcl.cipher.aes(this._key)},_reseed:function(seedWords){this._key=sjcl.hash.sha256.hash(this._key.concat(seedWords));this._cipher=new sjcl.cipher.aes(this._key);for(var i=0;i<4;i++){this._counter[i]=
this._counter[i]+1|0;if(this._counter[i])break}},_reseedFromPools:function(full){var reseedData=[],strength=0,i;this._nextReseed=reseedData[0]=(new Date).valueOf()+this._MILLISECONDS_PER_RESEED;for(i=0;i<16;i++)reseedData.push(Math.random()*4294967296|0);for(i=0;i<this._pools.length;i++){reseedData=reseedData.concat(this._pools[i].finalize());strength+=this._poolEntropy[i];this._poolEntropy[i]=0;if(!full&&this._reseedCount&1<<i)break}if(this._reseedCount>=1<<this._pools.length){this._pools.push(new sjcl.hash.sha256);
this._poolEntropy.push(0)}this._poolStrength-=strength;if(strength>this._strength)this._strength=strength;this._reseedCount++;this._reseed(reseedData)},_keyboardCollector:function(){console.log("sjclLib:keyboardCollector");this._addCurrentTimeToEntropy(1)},_mouseCollector:function(ev){console.log("sjclLib:mouseCollector");var x=ev.x||ev.clientX||ev.offsetX||0,y=ev.y||ev.clientY||ev.offsetY||0;sjcl.random.addEntropy([x,y],2,"mouse");this._addCurrentTimeToEntropy(0)},_loadTimeCollector:function(){console.log("sjclLib:loadTimeCollector");this._addCurrentTimeToEntropy(2)},_addCurrentTimeToEntropy:function(estimatedEntropy){if(window&&
window.performance&&typeof window.performance.now==="function")sjcl.random.addEntropy(window.performance.now(),estimatedEntropy,"loadtime");else sjcl.random.addEntropy((new Date).valueOf(),estimatedEntropy,"loadtime")},_accelerometerCollector:function(ev){console.log("sjclLib:accelerometerCollector");var ac=ev.accelerationIncludingGravity.x||ev.accelerationIncludingGravity.y||ev.accelerationIncludingGravity.z;if(window.orientation){var or=window.orientation;if(typeof or==="number")sjcl.random.addEntropy(or,1,"accelerometer")}if(ac)sjcl.random.addEntropy(ac,
2,"accelerometer");this._addCurrentTimeToEntropy(0)},_fireEvent:function(name,arg){var j,cbs=sjcl.random._callbacks[name],cbsTemp=[];for(j in cbs)if(cbs.hasOwnProperty(j))cbsTemp.push(cbs[j]);for(j=0;j<cbsTemp.length;j++)cbsTemp[j](arg)}};sjcl.hash.sha256=function(hash){if(!this._key[0])this._precompute();if(hash){this._h=hash._h.slice(0);this._buffer=hash._buffer.slice(0);this._length=hash._length}else this.reset()};sjcl.hash.sha256.hash=function(data){return(new sjcl.hash.sha256).update(data).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this._h=this._init.slice(0);this._buffer=[];this._length=0;return this},update:function(data){if(typeof data==="string")data=sjcl.codec.utf8String.toBits(data);var i,b=this._buffer=sjcl.bitArray.concat(this._buffer,data),ol=this._length,nl=this._length=ol+sjcl.bitArray.bitLength(data);for(i=512+ol&-512;i<=nl;i+=512)this._block(b.splice(0,16));return this},finalize:function(){var i,b=this._buffer,h=this._h;b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,
1)]);for(i=b.length+2;i&15;i++)b.push(0);b.push(Math.floor(this._length/4294967296));b.push(this._length|0);while(b.length)this._block(b.splice(0,16));this.reset();return h},_init:[],_key:[],_precompute:function(){var i=0,prime=2,factor;function frac(x){return(x-Math.floor(x))*4294967296|0}outer:for(;i<64;prime++){for(factor=2;factor*factor<=prime;factor++)if(prime%factor===0)continue outer;if(i<8)this._init[i]=frac(Math.pow(prime,1/2));this._key[i]=frac(Math.pow(prime,1/3));i++}},_block:function(words){var i,
tmp,a,b,w=words.slice(0),h=this._h,k=this._key,h0=h[0],h1=h[1],h2=h[2],h3=h[3],h4=h[4],h5=h[5],h6=h[6],h7=h[7];for(i=0;i<64;i++){if(i<16)tmp=w[i];else{a=w[i+1&15];b=w[i+14&15];tmp=w[i&15]=(a>>>7^a>>>18^a>>>3^a<<25^a<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+w[i&15]+w[i+9&15]|0}tmp=tmp+h7+(h4>>>6^h4>>>11^h4>>>25^h4<<26^h4<<21^h4<<7)+(h6^h4&(h5^h6))+k[i];h7=h6;h6=h5;h5=h4;h4=h3+tmp|0;h3=h2;h2=h1;h1=h0;h0=tmp+(h1&h2^h3&(h1^h2))+(h1>>>2^h1>>>13^h1>>>22^h1<<30^h1<<19^h1<<10)|0}h[0]=h[0]+h0|0;h[1]=h[1]+h1|
0;h[2]=h[2]+h2|0;h[3]=h[3]+h3|0;h[4]=h[4]+h4|0;h[5]=h[5]+h5|0;h[6]=h[6]+h6|0;h[7]=h[7]+h7|0}};sjcl.codec.hex={fromBits:function(arr){var out="",i;for(i=0;i<arr.length;i++)out+=((arr[i]|0)+0xf00000000000).toString(16).substr(4);return out.substr(0,sjcl.bitArray.bitLength(arr)/4)},toBits:function(str){var i,out=[],len;str=str.replace(/\s|0x/g,"");len=str.length;str=str+"00000000";for(i=0;i<str.length;i+=8)out.push(parseInt(str.substr(i,8),16)^0);return sjcl.bitArray.clamp(out,len*4)}};
sjcl.bitArray={bitSlice:function(a,bstart,bend){a=sjcl.bitArray._shiftRight(a.slice(bstart/32),32-(bstart&31)).slice(1);return bend===undefined?a:sjcl.bitArray.clamp(a,bend-bstart)},extract:function(a,bstart,blength){var x,sh=Math.floor(-bstart-blength&31);if((bstart+blength-1^bstart)&-32)x=a[bstart/32|0]<<32-sh^a[bstart/32+1|0]>>>sh;else x=a[bstart/32|0]>>>sh;return x&(1<<blength)-1},concat:function(a1,a2){if(a1.length===0||a2.length===0)return a1.concat(a2);var last=a1[a1.length-1],shift=sjcl.bitArray.getPartial(last);
if(shift===32)return a1.concat(a2);else return sjcl.bitArray._shiftRight(a2,shift,last|0,a1.slice(0,a1.length-1))},bitLength:function(a){var l=a.length,x;if(l===0)return 0;x=a[l-1];return(l-1)*32+sjcl.bitArray.getPartial(x)},clamp:function(a,len){if(a.length*32<len)return a;a=a.slice(0,Math.ceil(len/32));var l=a.length;len=len&31;if(l>0&&len)a[l-1]=sjcl.bitArray.partial(len,a[l-1]&2147483648>>len-1,1);return a},partial:function(len,x,_end){if(len===32)return x;return(_end?x|0:x<<32-len)+len*1099511627776},
getPartial:function(x){return Math.round(x/1099511627776)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return false;var x=0,i;for(i=0;i<a.length;i++)x|=a[i]^b[i];return x===0},_shiftRight:function(a,shift,carry,out){var i,last2=0,shift2;if(out===undefined)out=[];for(;shift>=32;shift-=32){out.push(carry);carry=0}if(shift===0)return out.concat(a);for(i=0;i<a.length;i++){out.push(carry|a[i]>>>shift);carry=a[i]<<32-shift}last2=a.length?a[a.length-1]:0;shift2=sjcl.bitArray.getPartial(last2);
out.push(sjcl.bitArray.partial(shift+shift2&31,shift+shift2>32?carry:out.pop(),1));return out},_xor4:function(x,y){return[x[0]^y[0],x[1]^y[1],x[2]^y[2],x[3]^y[3]]}};
sjcl.cipher.aes=function(key){if(!this._tables[0][0][0])this._precompute();var i,j,tmp,encKey,decKey,sbox=this._tables[0][4],decTable=this._tables[1],keyLen=key.length,rcon=1;if(keyLen!==4&&keyLen!==6&&keyLen!==8)throw new sjcl.exception.invalid("invalid aes key size");this._key=[encKey=key.slice(0),decKey=[]];for(i=keyLen;i<4*keyLen+28;i++){tmp=encKey[i-1];if(i%keyLen===0||keyLen===8&&i%keyLen===4){tmp=sbox[tmp>>>24]<<24^sbox[tmp>>16&255]<<16^sbox[tmp>>8&255]<<8^sbox[tmp&255];if(i%keyLen===0){tmp=
tmp<<8^tmp>>>24^rcon<<24;rcon=rcon<<1^(rcon>>7)*283}}encKey[i]=encKey[i-keyLen]^tmp}for(j=0;i;j++,i--){tmp=encKey[j&3?i:i-4];if(i<=4||j<4)decKey[j]=tmp;else decKey[j]=decTable[0][sbox[tmp>>>24]]^decTable[1][sbox[tmp>>16&255]]^decTable[2][sbox[tmp>>8&255]]^decTable[3][sbox[tmp&255]]}};
sjcl.cipher.aes.prototype={encrypt:function(data){return this._crypt(data,0)},decrypt:function(data){return this._crypt(data,1)},_tables:[[[],[],[],[],[]],[[],[],[],[],[]]],_precompute:function(){var encTable=this._tables[0],decTable=this._tables[1],sbox=encTable[4],sboxInv=decTable[4],i,x,xInv,d=[],th=[],x2,x4,x8,s,tEnc,tDec;for(i=0;i<256;i++)th[(d[i]=i<<1^(i>>7)*283)^i]=i;for(x=xInv=0;!sbox[x];x^=x2||1,xInv=th[xInv]||1){s=xInv^xInv<<1^xInv<<2^xInv<<3^xInv<<4;s=s>>8^s&255^99;sbox[x]=s;sboxInv[s]=
x;x8=d[x4=d[x2=d[x]]];tDec=x8*16843009^x4*65537^x2*257^x*16843008;tEnc=d[s]*257^s*16843008;for(i=0;i<4;i++){encTable[i][x]=tEnc=tEnc<<24^tEnc>>>8;decTable[i][s]=tDec=tDec<<24^tDec>>>8}}for(i=0;i<5;i++){encTable[i]=encTable[i].slice(0);decTable[i]=decTable[i].slice(0)}},_crypt:function(input,dir){if(input.length!==4)throw new sjcl.exception.invalid("invalid aes block size");var key=this._key[dir],a=input[0]^key[0],b=input[dir?3:1]^key[1],c=input[2]^key[2],d=input[dir?1:3]^key[3],a2,b2,c2,nInnerRounds=
key.length/4-2,i,kIndex=4,out=[0,0,0,0],table=this._tables[dir],t0=table[0],t1=table[1],t2=table[2],t3=table[3],sbox=table[4];for(i=0;i<nInnerRounds;i++){a2=t0[a>>>24]^t1[b>>16&255]^t2[c>>8&255]^t3[d&255]^key[kIndex];b2=t0[b>>>24]^t1[c>>16&255]^t2[d>>8&255]^t3[a&255]^key[kIndex+1];c2=t0[c>>>24]^t1[d>>16&255]^t2[a>>8&255]^t3[b&255]^key[kIndex+2];d=t0[d>>>24]^t1[a>>16&255]^t2[b>>8&255]^t3[c&255]^key[kIndex+3];kIndex+=4;a=a2;b=b2;c=c2}for(i=0;i<4;i++){out[dir?3&-i:i]=sbox[a>>>24]<<24^sbox[b>>16&255]<<
16^sbox[c>>8&255]<<8^sbox[d&255]^key[kIndex++];a2=a;a=b;b=c;c=d;d=a2}return out}};

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';
    
    var rx_one = /^[\],:{}\s]*$/,
        rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        rx_four = /(?:^|:|,)(?:\s*\[)+/g,
        rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 
            ? '0' + n 
            : n;
    }
    
    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate()) + 'T' +
                        f(this.getUTCHours()) + ':' +
                        f(this.getUTCMinutes()) + ':' +
                        f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) 
            ? '"' + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' 
            : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) 
                ? String(value) 
                : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                    ? ': ' 
                                    : ':'
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                    ? ': ' 
                                    : ':'
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, '@')
                        .replace(rx_three, ']')
                        .replace(rx_four, '')
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

function SHA256(s){
	
 	var chrsz   = 8;
	var hexcase = 0;
	 
		function safe_add (x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}
	 
		function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
		function R (X, n) { return ( X >>> n ); }
		function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
		function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
		function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
		function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
		function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
		function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
	 
		function core_sha256 (m, l) {
			var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
			var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
			var W = new Array(64);
			var a, b, c, d, e, f, g, h, i, j;
			var T1, T2;
	 
			m[l >> 5] |= 0x80 << (24 - l % 32);
			m[((l + 64 >> 9) << 4) + 15] = l;
	 
			for ( var i = 0; i<m.length; i+=16 ) {
				a = HASH[0];
				b = HASH[1];
				c = HASH[2];
				d = HASH[3];
				e = HASH[4];
				f = HASH[5];
				g = HASH[6];
				h = HASH[7];
	 
				for ( var j = 0; j<64; j++) {
					if (j < 16) W[j] = m[j + i];
					else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
	 
					T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
					T2 = safe_add(Sigma0256(a), Maj(a, b, c));
	 
					h = g;
					g = f;
					f = e;
					e = safe_add(d, T1);
					d = c;
					c = b;
					b = a;
					a = safe_add(T1, T2);
				}
	 
				HASH[0] = safe_add(a, HASH[0]);
				HASH[1] = safe_add(b, HASH[1]);
				HASH[2] = safe_add(c, HASH[2]);
				HASH[3] = safe_add(d, HASH[3]);
				HASH[4] = safe_add(e, HASH[4]);
				HASH[5] = safe_add(f, HASH[5]);
				HASH[6] = safe_add(g, HASH[6]);
				HASH[7] = safe_add(h, HASH[7]);
			}
			return HASH;
		}
	 
		function str2binb (str) {
			var bin = Array();
			var mask = (1 << chrsz) - 1;
			for(var i = 0; i < str.length * chrsz; i += chrsz) {
				bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
			}
			return bin;
		}
	 
		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
	 
			for (var n = 0; n < string.length; n++) {
	 
				var c = string.charCodeAt(n);
	 
				if (c < 128) { 
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
	 
			}
	 
			return utftext;
		}
	 
		function binb2hex (binarray) {
			var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
			var str = "";
			for(var i = 0; i < binarray.length * 4; i++) {
				str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
				hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
			}
			return str;
		}
	 
		s = Utf8Encode(s);
		return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}


var cryptico = (function() {
	my = {};
	my.getKeys = function(data,callback) {
		var base = this;
		base.getKeys = function() {
			keys = new base.getKeyPair(data.e,data.n,data.maxdigits);
			if (callback && typeof(callback) === "function") {
				callback.call(callback, keys);
		    }
		};

		base.getKeyPair = function(encryptionExponent, modulus, maxdigits) {
			setMaxDigits(parseInt(maxdigits,10));
			this.e = biFromHex(encryptionExponent);
			this.m = biFromHex(modulus);
			this.chunkSize = 2 * biHighIndex(this.m);
			this.radix = 16;
			this.barrett = new BarrettMu(this.m);
		};
		
		base.getKeys();
	};
	
	my.getMyKeys = function(data,callback) {
		var base = this;
		base.getMyKeys = function(data) {
			keys = new base.getMyKeyPair(data.e,data.n,data.maxdigits);

			if (callback && typeof(callback) === "function") {
				callback.call(this, keys);
		    } 
		};

		base.getMyKeyPair = function(encryptionExponent, modulus, maxdigits) {
			setMaxDigits(parseInt(maxdigits,10));
			this.e = biFromHex(encryptionExponent);
			this.m = biFromHex(modulus);
			this.chunkSize = 2 * biHighIndex(this.m);
			this.radix = 16;
			this.barrett = new BarrettMu(this.m);
		};

		base.getMyKeys(data);
	};
	
	my.encrypt = function(string,keyPair,callback) {
		var charSum = 0;
		for(var i = 0; i < string.length; i++){
			charSum += string.charCodeAt(i);
		}
		var tag = '0123456789abcdef';
		var hex = '';
		hex += tag.charAt((charSum & 0xF0) >> 4) + tag.charAt(charSum & 0x0F);

		var taggedString = hex + string;

		var encrypt = [];
		var j = 0;

		while (j < taggedString.length) {
			encrypt[j] = taggedString.charCodeAt(j);
			j++;
		}

		while (encrypt.length % keyPair.chunkSize !== 0) {
			encrypt[j++] = 0;
		}

		function encryption(encryptObject) {
			var charCounter = 0;
			var j, block;
			var encrypted = "";
			function encryptChar() {
				block = new BigInt();
				j = 0;
				for (var k = charCounter; k < charCounter+keyPair.chunkSize; ++j) {
					block.digits[j] = encryptObject[k++];
					block.digits[j] += encryptObject[k++] << 8;
				}
				var crypt = keyPair.barrett.powMod(block, keyPair.e);
				var text = keyPair.radix == 16 ? biToHex(crypt) : biToString(crypt, keyPair.radix);
				encrypted += text + " ";
				charCounter += keyPair.chunkSize;
				if (charCounter < encryptObject.length) {
					setTimeout(encryptChar, 1);
				} else {
					var encryptedString = encrypted.substring(0, encrypted.length - 1);
					if (callback && typeof(callback) === "function") {
						callback(encryptedString);
					} else {
					 	return encryptedString;
					}
				}
			}
			setTimeout(encryptChar, 1);
		}
		encryption(encrypt);
	};
	
	my.encryptAes = function(value,password, callback) {
		var encryptedString = Aes.Ctr.encrypt(value, password,256);
		encryptedString = encodeURIComponent(encryptedString);
		if (callback && typeof(callback) === "function") {
			callback(encryptedString);
		} else {
		 	return encryptedString;
		}
	};
	
	my.decryptAes = function(value,password, callback) {
		var decryptedString =  Aes.Ctr.decrypt(value, password,256);
		if (callback && typeof(callback) === "function") {
			callback(decryptedString);
		} else {
		 	return decryptedString;
		}
	};
	
	return my;

}());



var mycryptico = (function() {
	var my = {};
	my.getKeys = function(data,callback) {
		var base = this;
		base.getKeys = function() {
			keys = new base.getKeyPair(data.e,data.n,data.maxdigits);
			if (callback && typeof(callback) === "function") {  
				callback.call(this, keys);
		    } 
		};

		base.getKeyPair = function(encryptionExponent, modulus, maxdigits) {
			setMaxDigits(parseInt(maxdigits,10));
			this.e = biFromHex(encryptionExponent);
			this.m = biFromHex(modulus);
			this.chunkSize = 2 * biHighIndex(this.m);
			this.radix = 16;
			this.barrett = new BarrettMu(this.m);
		};

		base.getKeys();
	};
	
	my.encrypt = function(string,keyPair) {
		var charSum = 0;
		for(var i = 0; i < string.length; i++){
			charSum += string.charCodeAt(i);
		}
		var tag = '0123456789abcdef';
		var hex = '';
		hex += tag.charAt((charSum & 0xF0) >> 4) + tag.charAt(charSum & 0x0F);

		var taggedString = hex + string;

		var encrypt = [];
		var j = 0;

		while (j < taggedString.length) {
			encrypt[j] = taggedString.charCodeAt(j);
			j++;
		}

		while (encrypt.length % keyPair.chunkSize !== 0) {
			encrypt[j++] = 0;
		}

		function encryption(encryptObject) {
			var charCounter = 0;
			var j, block;
			var encrypted = "";
			function encryptChar() {
				block = new BigInt();
				j = 0;
				for (var k = charCounter; k < charCounter+keyPair.chunkSize; ++j) {
					block.digits[j] = encryptObject[k++];
					block.digits[j] += encryptObject[k++] << 8;
				}
				var crypt = keyPair.barrett.powMod(block, keyPair.e);
				var text = keyPair.radix == 16 ? biToHex(crypt) : biToString(crypt, keyPair.radix);
				encrypted += text + " ";
				charCounter += keyPair.chunkSize;
				if (charCounter < encryptObject.length) {
					setTimeout(encryptChar, 1);
				} else {
					var encryptedString = encrypted.substring(0, encrypted.length - 1);
					if (callback && typeof(callback) === "function") {
						callback(encryptedString);
					} else {
					 	return encryptedString;
					}
				}
			}
			setTimeout(encryptChar, 1);
		}
		encryption(encrypt);
	};
	
	my.encryptAes = function(value,password, callback) {
		var encryptedString = Aes.Ctr.encrypt(value, password,256);
		encryptedString = encodeURIComponent(encryptedString);
		if (callback && typeof(callback) === "function") {
			callback(encryptedString);
		} else {
		 	return encryptedString;
		}
	};
	
	my.decryptAes = function(value,password, callback) {
		var decryptedString =  Aes.Ctr.decrypt(value, password,256);
		if (callback && typeof(callback) === "function") {
			callback(decryptedString);
		} else {
		 	return decryptedString;
		}
	};
	
	return my;

}());



var biRadixBase = 2;
var biRadixBits = 16;
var bitsPerDigit = biRadixBits;
var biRadix = 1 << 16;
var biHalfRadix = biRadix >>> 1;
var biRadixSquared = biRadix * biRadix;
var maxDigitVal = biRadix - 1;
var maxInteger = 9999999999999998;
var maxDigits;
var ZERO_ARRAY = new Array();
var bigZero, bigOne;
var dpl10 = 15;
var highBitMasks = new Array(0x0000, 0x8000, 0xC000, 0xE000, 0xF000, 0xF800,
0xFC00, 0xFE00, 0xFF00, 0xFF80, 0xFFC0, 0xFFE0,
0xFFF0, 0xFFF8, 0xFFFC, 0xFFFE, 0xFFFF);

var hexatrigesimalToChar = new Array(
'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
'u', 'v', 'w', 'x', 'y', 'z'
);

var hexToChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
'a', 'b', 'c', 'd', 'e', 'f');

var lowBitMasks = new Array(0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF);

function setMaxDigits(value) {
	maxDigits = value;
	ZERO_ARRAY = new Array(maxDigits);
	for (var iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
	bigZero = new BigInt();
	bigOne = new BigInt();
	bigOne.digits[0] = 1;
}

function BigInt(flag) {
	if (typeof flag == "boolean" && flag == true) {
		this.digits = null;
	}
	else {
		this.digits = ZERO_ARRAY.slice(0);
	}
	this.isNeg = false;
}

function biFromDecimal(s) {
	var isNeg = s.charAt(0) == '-';
	var i = isNeg ? 1 : 0;
	var result;
	while (i < s.length && s.charAt(i) == '0') ++i;
	if (i == s.length) {
		result = new BigInt();
	}
	else {
		var digitCount = s.length - i;
		var fgl = digitCount % dpl10;
		if (fgl == 0) fgl = dpl10;
		result = biFromNumber(Number(s.substr(i, fgl)));
		i += fgl;
		while (i < s.length) {
			result = biAdd(biMultiply(result, biFromNumber(1000000000000000)),
			biFromNumber(Number(s.substr(i, dpl10))));
			i += dpl10;
		}
		result.isNeg = isNeg;
	}
	return result;
}

function biCopy(bi) {
	var result = new BigInt(true);
	result.digits = bi.digits.slice(0);
	result.isNeg = bi.isNeg;
	return result;
}

function biFromNumber(i) {
	var result = new BigInt();
	result.isNeg = i < 0;
	i = Math.abs(i);
	var j = 0;
	while (i > 0) {
		result.digits[j++] = i & maxDigitVal;
		i >>= biRadixBits;
	}
	return result;
}

function reverseStr(s) {
	var result = "";
	for (var i = s.length - 1; i > -1; --i) {
		result += s.charAt(i);
	}
	return result;
}

function biToString(x, radix) {
	var b = new BigInt();
	b.digits[0] = radix;
	var qr = biDivideModulo(x, b);
	var result = hexatrigesimalToChar[qr[1].digits[0]];
	while (biCompare(qr[0], bigZero) == 1) {
		qr = biDivideModulo(qr[0], b);
		digit = qr[1].digits[0];
		result += hexatrigesimalToChar[qr[1].digits[0]];
	}
	return (x.isNeg ? "-" : "") + reverseStr(result);
}

function biToDecimal(x) {
	var b = new BigInt();
	b.digits[0] = 10;
	var qr = biDivideModulo(x, b);
	var result = String(qr[1].digits[0]);
	while (biCompare(qr[0], bigZero) == 1) {
		qr = biDivideModulo(qr[0], b);
		result += String(qr[1].digits[0]);
	}
	return (x.isNeg ? "-" : "") + reverseStr(result);
}

function digitToHex(n) {
	var mask = 0xf;
	var result = "";
	for (i = 0; i < 4; ++i) {
		result += hexToChar[n & mask];
		n >>>= 4;
	}
	return reverseStr(result);
}

function biToHex(x) {
	var result = "";
	var n = biHighIndex(x);
	for (var i = biHighIndex(x); i > -1; --i) {
		result += digitToHex(x.digits[i]);
	}
	return result;
}

function charToHex(c) {
	var ZERO = 48;
	var NINE = ZERO + 9;
	var littleA = 97;
	var littleZ = littleA + 25;
	var bigA = 65;
	var bigZ = 65 + 25;
	var result;

	if (c >= ZERO && c <= NINE) {
		result = c - ZERO;
	} else if (c >= bigA && c <= bigZ) {
		result = 10 + c - bigA;
	} else if (c >= littleA && c <= littleZ) {
		result = 10 + c - littleA;
	} else {
		result = 0;
	}
	return result;
}

function hexToDigit(s) {
	var result = 0;
	var sl = Math.min(s.length, 4);
	for (var i = 0; i < sl; ++i) {
		result <<= 4;
		result |= charToHex(s.charCodeAt(i))
	}
	return result;
}

function biFromHex(s) {
	var result = new BigInt();
	var sl = s.length;
	for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
		result.digits[j] = hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
	}
	return result;
}

function biFromString(s, radix) {
	var isNeg = s.charAt(0) == '-';
	var istop = isNeg ? 1 : 0;
	var result = new BigInt();
	var place = new BigInt();
	place.digits[0] = 1; // radix^0
	for (var i = s.length - 1; i >= istop; i--) {
		var c = s.charCodeAt(i);
		var digit = charToHex(c);
		var biDigit = biMultiplyDigit(place, digit);
		result = biAdd(result, biDigit);
		place = biMultiplyDigit(place, radix);
	}
	result.isNeg = isNeg;
	return result;
}

function biDump(b) {
	return (b.isNeg ? "-" : "") + b.digits.join(" ");
}

function biAdd(x, y) {
	var result;

	if (x.isNeg != y.isNeg) {
		y.isNeg = !y.isNeg;
		result = biSubtract(x, y);
		y.isNeg = !y.isNeg;
	}
	else {
		result = new BigInt();
		var c = 0;
		var n;
		for (var i = 0; i < x.digits.length; ++i) {
			n = x.digits[i] + y.digits[i] + c;
			result.digits[i] = n & 0xffff;
			c = Number(n >= biRadix);
		}
		result.isNeg = x.isNeg;
	}
	return result;
}

function biSubtract(x, y) {
	var result;
	if (x.isNeg != y.isNeg) {
		y.isNeg = !y.isNeg;
		result = biAdd(x, y);
		y.isNeg = !y.isNeg;
	} else {
		result = new BigInt();
		var n, c;
		c = 0;
		for (var i = 0; i < x.digits.length; ++i) {
			n = x.digits[i] - y.digits[i] + c;
			result.digits[i] = n & 0xffff;
			if (result.digits[i] < 0) result.digits[i] += biRadix;
			c = 0 - Number(n < 0);
		}
		if (c == -1) {
			c = 0;
			for (var i = 0; i < x.digits.length; ++i) {
				n = 0 - result.digits[i] + c;
				result.digits[i] = n & 0xffff;
				if (result.digits[i] < 0) result.digits[i] += biRadix;
				c = 0 - Number(n < 0);
			}
			result.isNeg = !x.isNeg;
		} else {
			result.isNeg = x.isNeg;
		}
	}
	return result;
}

function biHighIndex(x) {
	var result = x.digits.length - 1;
	while (result > 0 && x.digits[result] == 0) --result;
	return result;
}

function biNumBits(x) {
	var n = biHighIndex(x);
	var d = x.digits[n];
	var m = (n + 1) * bitsPerDigit;
	var result;
	for (result = m; result > m - bitsPerDigit; --result) {
		if ((d & 0x8000) != 0) break;
		d <<= 1;
	}
	return result;
}

function biMultiply(x, y) {
	var result = new BigInt();
	var c;
	var n = biHighIndex(x);
	var t = biHighIndex(y);
	var u, uv, k;

	for (var i = 0; i <= t; ++i) {
		c = 0;
		k = i;
		for (j = 0; j <= n; ++j, ++k) {
			uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
			result.digits[k] = uv & maxDigitVal;
			c = uv >>> biRadixBits;
		}
		result.digits[i + n + 1] = c;
	}
	result.isNeg = x.isNeg != y.isNeg;
	return result;
}

function biMultiplyDigit(x, y) {
	var n, c, uv;

	result = new BigInt();
	n = biHighIndex(x);
	c = 0;
	for (var j = 0; j <= n; ++j) {
		uv = result.digits[j] + x.digits[j] * y + c;
		result.digits[j] = uv & maxDigitVal;
		c = uv >>> biRadixBits;
	}
	result.digits[1 + n] = c;
	return result;
}

function arrayCopy(src, srcStart, dest, destStart, n) {
	var m = Math.min(srcStart + n, src.length);
	for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
		dest[j] = src[i];
	}
}



function biShiftLeft(x, n) {
	var digitCount = Math.floor(n / bitsPerDigit);
	var result = new BigInt();
	arrayCopy(x.digits, 0, result.digits, digitCount,result.digits.length - digitCount);
	var bits = n % bitsPerDigit;
	var rightBits = bitsPerDigit - bits;
	for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
		result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) |
		((result.digits[i1] & highBitMasks[bits]) >>>
		(rightBits));
	}
	result.digits[0] = ((result.digits[i] << bits) & maxDigitVal);
	result.isNeg = x.isNeg;
	return result;
}

function biShiftRight(x, n) {
	var digitCount = Math.floor(n / bitsPerDigit);
	var result = new BigInt();
	arrayCopy(x.digits, digitCount, result.digits, 0,x.digits.length - digitCount);
	var bits = n % bitsPerDigit;
	var leftBits = bitsPerDigit - bits;
	for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
		result.digits[i] = (result.digits[i] >>> bits) |
		((result.digits[i1] & lowBitMasks[bits]) << leftBits);
	}
	result.digits[result.digits.length - 1] >>>= bits;
	result.isNeg = x.isNeg;
	return result;
}

function biMultiplyByRadixPower(x, n) {
	var result = new BigInt();
	arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
	return result;
}

function biDivideByRadixPower(x, n)
{
	var result = new BigInt();
	arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
	return result;
}

function biModuloByRadixPower(x, n)
{
	var result = new BigInt();
	arrayCopy(x.digits, 0, result.digits, 0, n);
	return result;
}

function biCompare(x, y) {
	if (x.isNeg != y.isNeg) {
		return 1 - 2 * Number(x.isNeg);
	}
	for (var i = x.digits.length - 1; i >= 0; --i) {
		if (x.digits[i] != y.digits[i]) {
			if (x.isNeg) {
				return 1 - 2 * Number(x.digits[i] > y.digits[i]);
			} else {
				return 1 - 2 * Number(x.digits[i] < y.digits[i]);
			}
		}
	}
	return 0;
}

function biDivideModulo(x, y) {
	var nb = biNumBits(x);
	var tb = biNumBits(y);
	var origYIsNeg = y.isNeg;
	var q, r;
	if (nb < tb) {
		if (x.isNeg) {
			q = biCopy(bigOne);
			q.isNeg = !y.isNeg;
			x.isNeg = false;
			y.isNeg = false;
			r = biSubtract(y, x);
			x.isNeg = true;
			y.isNeg = origYIsNeg;
		} else {
			q = new BigInt();
			r = biCopy(x);
		}
		return new Array(q, r);
	}

	q = new BigInt();
	r = x;

	var t = Math.ceil(tb / bitsPerDigit) - 1;
	var lambda = 0;
	while (y.digits[t] < biHalfRadix) {
		y = biShiftLeft(y, 1);
		++lambda;
		++tb;
		t = Math.ceil(tb / bitsPerDigit) - 1;
	}

	r = biShiftLeft(r, lambda);
	nb += lambda;
	var n = Math.ceil(nb / bitsPerDigit) - 1;

	var b = biMultiplyByRadixPower(y, n - t);
	while (biCompare(r, b) != -1) {
		++q.digits[n - t];
		r = biSubtract(r, b);
	}
	for (var i = n; i > t; --i) {
		var ri = (i >= r.digits.length) ? 0 : r.digits[i];
		var ri1 = (i - 1 >= r.digits.length) ? 0 : r.digits[i - 1];
		var ri2 = (i - 2 >= r.digits.length) ? 0 : r.digits[i - 2];
		var yt = (t >= y.digits.length) ? 0 : y.digits[t];
		var yt1 = (t - 1 >= y.digits.length) ? 0 : y.digits[t - 1];
		if (ri == yt) {
			q.digits[i - t - 1] = maxDigitVal;
		} else {
			q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
		}

		var c1 = q.digits[i - t - 1] * ((yt * biRadix) + yt1);
		var c2 = (ri * biRadixSquared) + ((ri1 * biRadix) + ri2);
		while (c1 > c2) {
			--q.digits[i - t - 1];
			c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
			c2 = (ri * biRadix * biRadix) + ((ri1 * biRadix) + ri2);
		}

		b = biMultiplyByRadixPower(y, i - t - 1);
		r = biSubtract(r, biMultiplyDigit(b, q.digits[i - t - 1]));
		if (r.isNeg) {
			r = biAdd(r, b);
			--q.digits[i - t - 1];
		}
	}
	r = biShiftRight(r, lambda);

	q.isNeg = x.isNeg != origYIsNeg;
	if (x.isNeg) {
		if (origYIsNeg) {
			q = biAdd(q, bigOne);
		} else {
			q = biSubtract(q, bigOne);
		}
		y = biShiftRight(y, lambda);
		r = biSubtract(y, r);
	}

	if (r.digits[0] == 0 && biHighIndex(r) == 0) r.isNeg = false;

	return new Array(q, r);
}

function biDivide(x, y) {
	return biDivideModulo(x, y)[0];
}

function biModulo(x, y) {
	return biDivideModulo(x, y)[1];
}

function biMultiplyMod(x, y, m) {
	return biModulo(biMultiply(x, y), m);
}

function biPow(x, y) {
	var result = bigOne;
	var a = x;
	while (true) {
		if ((y & 1) != 0) result = biMultiply(result, a);
		y >>= 1;
		if (y == 0) break;
		a = biMultiply(a, a);
	}
	return result;
}

function biPowMod(x, y, m) {
	var result = bigOne;
	var a = x;
	var k = y;
	while (true) {
		if ((k.digits[0] & 1) != 0) result = biMultiplyMod(result, a, m);
		k = biShiftRight(k, 1);
		if (k.digits[0] == 0 && biHighIndex(k) == 0) break;
		a = biMultiplyMod(a, a, m);
	}
	return result;
}

function BarrettMu(m) {
	this.modulus = biCopy(m);
	this.k = biHighIndex(this.modulus) + 1;
	var b2k = new BigInt();
	b2k.digits[2 * this.k] = 1;
	this.mu = biDivide(b2k, this.modulus);
	this.bkplus1 = new BigInt();
	this.bkplus1.digits[this.k + 1] = 1;
	this.modulo = BarrettMu_modulo;
	this.multiplyMod = BarrettMu_multiplyMod;
	this.powMod = BarrettMu_powMod;
}

function BarrettMu_modulo(x) {
	var q1 = biDivideByRadixPower(x, this.k - 1);
	var q2 = biMultiply(q1, this.mu);
	var q3 = biDivideByRadixPower(q2, this.k + 1);
	var r1 = biModuloByRadixPower(x, this.k + 1);
	var r2term = biMultiply(q3, this.modulus);
	var r2 = biModuloByRadixPower(r2term, this.k + 1);
	var r = biSubtract(r1, r2);
	if (r.isNeg) {
		r = biAdd(r, this.bkplus1);
	}
	var rgtem = biCompare(r, this.modulus) >= 0;
	while (rgtem) {
		r = biSubtract(r, this.modulus);
		rgtem = biCompare(r, this.modulus) >= 0;
	}
	return r;
}

function BarrettMu_multiplyMod(x, y) {
	var xy = biMultiply(x, y);
	return this.modulo(xy);
}

function BarrettMu_powMod(x, y) {
	var result = new BigInt();
	result.digits[0] = 1;
	while (true) {
		if ((y.digits[0] & 1) != 0) result = this.multiplyMod(result, x);
		y = biShiftRight(y, 1);
		if (y.digits[0] == 0 && biHighIndex(y) == 0) break;
		x = this.multiplyMod(x, x);
	}
	return result;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES implementation in JavaScript (c) Chris Veness 2005-2012                                   */
/*   - see http://csrc.nist.gov/publications/PubsFIPS.html#197                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Aes = {};  // Aes namespace

/**
 * AES Cipher function: encrypt 'input' state with Rijndael algorithm
 *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage
 *
 * @param {Number[]} input 16-byte (128-bit) input state array
 * @param {Number[][]} w   Key schedule as 2D byte-array (Nr+1 x Nb bytes)
 * @returns {Number[]}     Encrypted output state array
 */
Aes.cipher = function(input, w) {    // main Cipher function [§5.1]
  var Nb = 4;               // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nr = w.length/Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

  var state = [[],[],[],[]];  // initialise 4xNb byte-array 'state' with input [§3.4]
  for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

  state = Aes.addRoundKey(state, w, 0, Nb);

  for (var round=1; round<Nr; round++) {
    state = Aes.subBytes(state, Nb);
    state = Aes.shiftRows(state, Nb);
    state = Aes.mixColumns(state, Nb);
    state = Aes.addRoundKey(state, w, round, Nb);
  }

  state = Aes.subBytes(state, Nb);
  state = Aes.shiftRows(state, Nb);
  state = Aes.addRoundKey(state, w, Nr, Nb);

  var output = new Array(4*Nb);  // convert state to 1-d array before returning [§3.4]
  for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];
  return output;
}

/**
 * Perform Key Expansion to generate a Key Schedule
 *
 * @param {Number[]} key Key as 16/24/32-byte array
 * @returns {Number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes)
 */
Aes.keyExpansion = function(key) {  // generate Key Schedule (byte-array Nr+1 x Nb) from Key [§5.2]
  var Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nk = key.length/4  // key length (in words): 4/6/8 for 128/192/256-bit keys
  var Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys

  var w = new Array(Nb*(Nr+1));
  var temp = new Array(4);

  for (var i=0; i<Nk; i++) {
    var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
    w[i] = r;
  }

  for (var i=Nk; i<(Nb*(Nr+1)); i++) {
    w[i] = new Array(4);
    for (var t=0; t<4; t++) temp[t] = w[i-1][t];
    if (i % Nk == 0) {
      temp = Aes.subWord(Aes.rotWord(temp));
      for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
    } else if (Nk > 6 && i%Nk == 4) {
      temp = Aes.subWord(temp);
    }
    for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
  }

  return w;
}

/*
 * ---- remaining routines are private, not called externally ----
 */
 
Aes.subBytes = function(s, Nb) {    // apply SBox to state S [§5.1.1]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
  }
  return s;
}

Aes.shiftRows = function(s, Nb) {    // shift row r of state S left by r bytes [§5.1.2]
  var t = new Array(4);
  for (var r=1; r<4; r++) {
    for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  // shift into temp copy
    for (var c=0; c<4; c++) s[r][c] = t[c];         // and copy back
  }          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
  return s;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
}

Aes.mixColumns = function(s, Nb) {   // combine bytes of each col of state S [§5.1.3]
  for (var c=0; c<4; c++) {
    var a = new Array(4);  // 'a' is a copy of the current column from 's'
    var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
    for (var i=0; i<4; i++) {
      a[i] = s[i][c];
      b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;

    }
    // a[n] ^ b[n] is a•{03} in GF(2^8)
    s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
    s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
    s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
    s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
  }
  return s;
}

Aes.addRoundKey = function(state, w, rnd, Nb) {  // xor Round Key into state S [§5.1.4]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
  }
  return state;
}

Aes.subWord = function(w) {    // apply SBox to 4-byte word w
  for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
  return w;
}

Aes.rotWord = function(w) {    // rotate 4-byte word w left by one byte
  var tmp = w[0];
  for (var i=0; i<3; i++) w[i] = w[i+1];
  w[3] = tmp;
  return w;
}

// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
             0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
             0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
             0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
             0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
             0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
             0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
             0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
             0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
             0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
             0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
             0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
             0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
             0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
             0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
             0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
             [0x01, 0x00, 0x00, 0x00],
             [0x02, 0x00, 0x00, 0x00],
             [0x04, 0x00, 0x00, 0x00],
             [0x08, 0x00, 0x00, 0x00],
             [0x10, 0x00, 0x00, 0x00],
             [0x20, 0x00, 0x00, 0x00],
             [0x40, 0x00, 0x00, 0x00],
             [0x80, 0x00, 0x00, 0x00],
             [0x1b, 0x00, 0x00, 0x00],
             [0x36, 0x00, 0x00, 0x00] ]; 


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES Counter-mode implementation in JavaScript (c) Chris Veness 2005-2012                      */
/*   - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

Aes.Ctr = {};  // Aes.Ctr namespace: a subclass or extension of Aes

/** 
 * Encrypt a text using AES encryption in Counter mode of operation
 *
 * Unicode multi-byte character safe
 *
 * @param {String} plaintext Source text to be encrypted
 * @param {String} password  The password to use to generate a key
 * @param {Number} nBits     Number of bits to be used in the key (128, 192, or 256)
 * @returns {string}         Encrypted text
 */
Aes.Ctr.encrypt = function(plaintext, password, nBits) {
  var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
  plaintext = Utf8.encode(plaintext);
  password = Utf8.encode(password);
  //var t = new Date();  // timer
	
  // use AES itself to encrypt password to get cipher key (using plain password as source for key 
  // expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
  var nBytes = nBits/8;  // no bytes in key (16/24/32)
  var pwBytes = new Array(nBytes);
  for (var i=0; i<nBytes; i++) {  // use 1st 16/24/32 chars of password for key
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));  // gives us 16-byte key
  key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

  // initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec, 
  // [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
  var counterBlock = new Array(blockSize);
  
  var nonce = (new Date()).getTime();  // timestamp: milliseconds since 1-Jan-1970
  var nonceMs = nonce%1000;
  var nonceSec = Math.floor(nonce/1000);
  var nonceRnd = Math.floor(Math.random()*0xffff);
  
  for (var i=0; i<2; i++) counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
  for (var i=0; i<2; i++) counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
  for (var i=0; i<4; i++) counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;
  
  // and convert it to a string to go on the front of the ciphertext
  var ctrTxt = '';
  for (var i=0; i<8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

  // generate key schedule - an expansion of the key into distinct Key Rounds for each round
  var keySchedule = Aes.keyExpansion(key);
  
  var blockCount = Math.ceil(plaintext.length/blockSize);
  var ciphertxt = new Array(blockCount);  // ciphertext as array of strings
  
  for (var b=0; b<blockCount; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
    for (var c=0; c<4; c++) counterBlock[15-c] = (b >>> c*8) & 0xff;
    for (var c=0; c<4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c*8)

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // -- encrypt counter block --
    
    // block size is reduced on final block
    var blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
    var cipherChar = new Array(blockLength);
    
    for (var i=0; i<blockLength; i++) {  // -- xor plaintext with ciphered counter char-by-char --
      cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
      cipherChar[i] = String.fromCharCode(cipherChar[i]);
    }
    ciphertxt[b] = cipherChar.join(''); 
  }

  // Array.join is more efficient than repeated string concatenation in IE
  var ciphertext = ctrTxt + ciphertxt.join('');
  ciphertext = Base64.encode(ciphertext);  // encode in base64
  
  //alert((new Date()) - t);
  return ciphertext;
}

/** 
 * Decrypt a text encrypted by AES in counter mode of operation
 *
 * @param {String} ciphertext Source text to be encrypted
 * @param {String} password   The password to use to generate a key
 * @param {Number} nBits      Number of bits to be used in the key (128, 192, or 256)
 * @returns {String}          Decrypted text
 */
Aes.Ctr.decrypt = function(ciphertext, password, nBits) {
  var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
  ciphertext = Base64.decode(ciphertext);
  password = Utf8.encode(password);
  //var t = new Date();  // timer
  // use AES to encrypt password (mirroring encrypt routine)
  var nBytes = nBits/8;  // no bytes in key
  var pwBytes = new Array(nBytes);
  for (var i=0; i<nBytes; i++) {
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
  key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

  // recover nonce from 1st 8 bytes of ciphertext
  var counterBlock = new Array(8);
  ctrTxt = ciphertext.slice(0, 8);
  for (var i=0; i<8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);
  
  // generate key schedule
  var keySchedule = Aes.keyExpansion(key);

  // separate ciphertext into blocks (skipping past initial 8 bytes)
  var nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
  var ct = new Array(nBlocks);
  for (var b=0; b<nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
  ciphertext = ct;  // ciphertext is now array of block-length strings

  // plaintext will get generated block-by-block into array of block-length strings
  var plaintxt = new Array(ciphertext.length);

  for (var b=0; b<nBlocks; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    for (var c=0; c<4; c++) counterBlock[15-c] = ((b) >>> c*8) & 0xff;
    for (var c=0; c<4; c++) counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // encrypt counter block

    var plaintxtByte = new Array(ciphertext[b].length);
    for (var i=0; i<ciphertext[b].length; i++) {
      // -- xor plaintxt with ciphered counter byte-by-byte --
      plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
      plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
    }
    plaintxt[b] = plaintxtByte.join('');
  }

  // join array of blocks into single plaintext string
  var plaintext = plaintxt.join('');
  plaintext = Utf8.decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars
  //alert((new Date()) - t);
  return plaintext;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2012                          */
/*    note: depends on Utf8 class                                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Base64 = {};  // Base64 namespace

Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, no newlines are added.
 *
 * @param {String} str The string to be encoded as base-64
 * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded 
 *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
 * @returns {String} Base64-encoded string
 */ 
Base64.encode = function(str, utf8encode) {  // http://tools.ietf.org/html/rfc4648
  utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
  var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
  var b64 = Base64.code;
   
  plain = utf8encode ? str.encodeUTF8() : str;
  
  c = plain.length % 3;  // pad string to length of multiple of 3
  if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
  // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars
   
  for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c+1);
    o3 = plain.charCodeAt(c+2);
      
    bits = o1<<16 | o2<<8 | o3;
      
    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    // use hextets to index into code string
    e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join('');  // join() is far faster than repeated string concatenation in IE
  
  // replace 'A's from padded nulls with '='s
  coded = coded.slice(0, coded.length-pad.length) + pad;
   
  return coded;
}

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, newlines are not catered for.
 *
 * @param {String} str The string to be decoded from base-64
 * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded 
 *   from UTF8 after conversion from base64
 * @returns {String} decoded string
 */ 
Base64.decode = function(str, utf8decode) {
  utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
  var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;
  var b64 = Base64.code;

  coded = utf8decode ? str.decodeUTF8() : str;
  
  
  for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
    h1 = b64.indexOf(coded.charAt(c));
    h2 = b64.indexOf(coded.charAt(c+1));
    h3 = b64.indexOf(coded.charAt(c+2));
    h4 = b64.indexOf(coded.charAt(c+3));
      
    bits = h1<<18 | h2<<12 | h3<<6 | h4;
      
    o1 = bits>>>16 & 0xff;
    o2 = bits>>>8 & 0xff;
    o3 = bits & 0xff;
    
    d[c/4] = String.fromCharCode(o1, o2, o3);
    // check for padding
    if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
    if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
  }
  plain = d.join('');  // join() is far faster than repeated string concatenation in IE
   
  return utf8decode ? plain.decodeUTF8() : plain; 
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2012                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace
/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
  // use regular expressions & String.replace callback function for better efficiency 
  // than procedural approaches
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
};

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */