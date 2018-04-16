var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;
var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";

if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}

var domainUrl = TARGET_URI;
var pg_e2e_url = domainUrl + "v5l/e2e/";
var pubkeys = "", keyB;
var redirectUrl;
var appNm;	
var expTime;
var hash;
var nonce;
var encrMessage;
var GUID;
var pubKey2;
var myNewKeyB;

var encrE2EKeyB;
var $this;
var username;
var password;


keyB = generatKey(64);

var cookieTimeOut;
var c_date = new Date();
//cookie live 20 minutes 
c_date.setTime(c_date.getTime() + (20 * 60 * 1000));

/**
 * @method URL parser added by atlas 2017.10.25
 * */
function URLParser(u){
    var path="",query="",hash="",params;
    if(u.indexOf("#") > 0){
        hash = u.substr(u.indexOf("#") + 1);
        u = u.substr(0 , u.indexOf("#"));
    }
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        params= query.split('&');
    }else
        path = u;
    return {
        getHost: function(){
            var hostexp = /\/\/([\w.-]*)/;
            var match = hostexp.exec(path);
            if (match != null && match.length > 1)
                return match[1];
            return "";
        },
        getPath: function(){
            var pathexp = /\/\/[\w.-]*(?:\/([^?]*))/;
            var match = pathexp.exec(path);
            if (match != null && match.length > 1)
                return match[1];
            return "";
        },
        getHash: function(){
            return hash;
        },
        getParams: function(){
            return params
        },
        getQuery: function(){
            return query;
        },
        setHash: function(value){
            if(query.length > 0)
                query = "?" + query;
            if(value.length > 0)
                query = query + "#" + value;
            return path + query;
        },
        setParam: function(name, value){
            if(!params){
                params= new Array();
            }
            params.push(name + '=' + value);
            for (var i = 0; i < params.length; i++) {
                if(query.length > 0)
                    query += "&";
                query += params[i];
            }
            if(query.length > 0)
                query = "?" + query;
            if(hash.length > 0)
                query = query + "#" + hash;
            return path + query;
        },
        getParam: function(name){
            if(params){
                for (var i = 0; i < params.length; i++) {
                    var pair = params[i].split('=');
                    if (decodeURIComponent(pair[0]) == name)
                        return decodeURIComponent(pair[1]);
                }
            }
            console.log('Query variable %s not found', name);
        },
        hasParam: function(name){
            if(params){
                for (var i = 0; i < params.length; i++) {
                    var pair = params[i].split('=');
                    if (decodeURIComponent(pair[0]) == name)
                        return true;
                }
            }
            console.log('Query variable %s not found', name);
        },
        removeParam: function(name){
            query = "";
            if(params){
                var newparams = new Array();
                for (var i = 0;i < params.length;i++) {
                    var pair = params[i].split('=');
                    if (decodeURIComponent(pair[0]) != name)
                          newparams .push(params[i]);
                }
                params = newparams ;
                for (var i = 0; i < params.length; i++) {
                    if(query.length > 0)
                        query += "&";
                    query += params[i];
                }
            }
            if(query.length > 0)
                query = "?" + query;
            if(hash.length > 0)
                query = query + "#" + hash;
            return path + query;
        },
    }
};


function generatKey(nbBits){
	/**Generate Key**/
    var i, j = "";
    var i, j = "";
    var myGeneratedKey = "";

    addEntropyTime();
    var seed = keyFromEntropy();
    var prng = new AESprng(seed);
    var hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+=-_/@#$";
    
    for (i = 0; i < nbBits; i++) {
    	myGeneratedKey += hexDigits.charAt(prng.nextInt(15));
    }
    
    delete prng;
   
    return myGeneratedKey;
};

function storeInCookie(key, value) {
	if (TARGET_URI == "http://localhost:8080/")
		$.cookie(key, value);
	else
		$.cookie(key, value,{path: '/', domain: 'paygate.net',secure: false, expires: c_date});
};

function getPublicKey(data){
	var status = data.status;
		
	if(status == "SUCCESS"){
		if(data.publicKey != null){
			pubkeys = data.publicKey;
			getEncrKeyB();
		}
	} else if (data.data.cdKey == "SESSION_EXPIRED") {
		$this.button('reset');
		reInit();
	} else{
		$this.button('reset');
		if(data.data.cdKey=="GUID_NOT_FOUND"){
			alert("Login id not found!");
		}else{
			alert(data.data.cdKey);	
		}
	}
}

function getEncrKeyB(){
	cryptico.getMyKeys(pubkeys, function(receivedKeys) {
		console.log("receivedKeys n:" + receivedKeys.n);

		cryptico.encrypt(keyB, receivedKeys, function(encrypted_key) {
			console.log("encrypted_key:" + encrypted_key);
			
			encrE2EKeyB = encrypted_key;
        	
        	url = domainUrl+"v5l/e2e/keysExchange?";
        	method = "GET";
            param = "encKeyb=" + encrE2EKeyB + "&login=" + username + "&_method=" + "PUT";
	        
	        AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
	        	if (data.status != undefined) {
	        		if (data.status == "SUCCESS") {
	        			sendEncPassword(); 
	        		} else if (data.status == "ERROR")
	        			if (data.data.cdKey == "KEY_EXPIRED") {
	        				alert("Service unavailable, please contact the customer service");
	        			} else
	             			alert("Error please try again");
	             } else
	            	 alert("Error please try again");
	            	 
	        });
		});
	});
};

function sendEncPassword() {
	cryptico.encryptAes(password, keyB, function(encryptedPassword) {
    	url = domainUrl+"v5l/login/authenticate?";
    	method = "GET";
        param = "e2e_password=" + encryptedPassword + "&login=" + username + "&_method=" + "GET";
        
        AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
       	 if (data.status != undefined) {
       		 if (data.status == "SUCCESS")
       			getTmpLoginKeyp(data.signature);
       		 else if (data.status == "ERROR") {
       			$this.button('reset');
       			if (data.data.cdKey == "KEY_EXPIRED") {
       				alert("Service unavailable, please contact the customer service");
       			} else	if (data.data.cdKey == "WRONG_LOGIN_PWD") {
       				alert("Wrong login / password, please try again");
       			} else	if (data.data.cdKey == "ACCOUNT_LOCKED") {
       				alert("Account locked, please contact the customer service");
       			} else{
            		alert("Error please try again");
       			}
            } else if (data.status == "REQUIRE_INIT_PWD" || data.status == "PASSWORD_EXPIRED") {
            	$this.button('reset');
            	passwordExpired(data.encrLimitedGuid, data.encrLimitedKeyp);
            }
            else{
             $this.button('reset');	
           	 alert("Error please try again");
            }
       	 }
       });
       $this.button('reset');
	});
}

function getTmpLoginKeyp(encSignature) {
	cryptico.decryptAes(encSignature, keyB, function(decSignature) {
		url = domainUrl+"v5a/login/authConfirm?";
    	method = "GET";
        param = "signature=" + decSignature + "&_method=" + "GET";
        
        AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
       	 if (data.status != undefined) {
       		 if (data.status == "SUCCESS") {
       			var encrGuid = data.encrGuid;
       			var encrKeyp = data.encrKeyp;
       			var isAdmin = data.isAdmin;
       			decryptAndStoreTmpCredentials(encrGuid, encrKeyp, isAdmin);
       		 } else if (data.status == "ERROR"){
       			$this.button('reset'); 
       			if (data.data.cdKey != undefined) {
       				alert("Error please try again: " + data.data.cdKey);
       			} else{
            		alert("Error please try again");
       			}
       		 }	
            } else{
            	$this.button('reset');
            	alert("Error please try again");
            }
        });
	});
}

function decryptAndStoreTmpCredentials(encrGuid, encrKeyp, isAdmin) {
	cryptico.decryptAes(encrGuid, keyB, function(decrGuid) {
		cryptico.decryptAes(encrKeyp, keyB, function(decrKeyp) {
			storeInCookie("superGuid", decrGuid);
			storeInCookie("pkey", decrKeyp);
			storeInCookie("isAdmin", isAdmin);
			$this.button('reset');
			window.location = 'admin.html';
		});
	});
}


function passwordExpired(tmpLimitedGuid, tmpLimitedKeyp) {
	cryptico.decryptAes(tmpLimitedGuid, keyB, function(decGuid) {
		cryptico.decryptAes(tmpLimitedKeyp, keyB, function(decKeyp) {
			storeInCookie("superGuid", decGuid);
			storeInCookie("pkey", decKeyp);
		});
	});
	
	alert("Your password has expired, you will be redirected");
	window.location="renewPassword.html";
}

function adminlogin(){
	var bits = 256;
	var KEY_ENC = myNewKeyB; 
	storeInCookie("superGuid", GUID);
	storeInCookie("pkey", myNewKeyB);
	storeInCookie("isAdmin",isAdmin);
	window.location = 'index.html';
};

function reInit() {
	url = domainUrl+"v5a/login/init?";
    method = "GET";
    param = "_method=GET";
	
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
        url = domainUrl+"v5l/e2e/keysExchange?";
        
        if (data.status != undefined) {
        	if (data.status == "ERROR")
        		if (data.data.cdKey == "KEY_EXPIRED") {
        			alert("Service unavailable, please contact the customer service");
        		}
        }
        
        getServerMessageParam = "encrMessage=" + ENCODE_URI_COMPONENT(data.encrMessage) + "&appGuid=" + data.appGuid + "&hash=" + ENCODE_URI_COMPONENT(data.hash) + "&nonce=" + data.nonce;
        username = $("#LOGIN_ID_FIELD").val();
        password = $("#LOGIN_PASSWORD_FIELD").val();
        param = getServerMessageParam + "&login=" + username;
        
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
        	getPublicKey(data);
        });  		
        
	});		
}

$(document).ready(function() {
	ce();                           
    mouseMotionEntropy(60);
    var redirectUrl;
    var encrMessage;
    var appNm;
    var timeout;
    var hash;
    var nonce;
    var url = domainUrl+"v5a/login/init?";
    var method = "GET";
    var param = "_method=GET";
    var loginUrl;
    var loginParam;
	var KEY_ENC = keyB;
	//alert(KEY_ENC);
	
	var cookieLanguage = $.cookie("language");
	
    function englishLanguage () {
		$("#english").css("color","#EC4758");
		$("#korean").css("color","#666666");
		
		$("#LOGIN_HEADER").text(LOGIN_HEADER_EN);
		$("#LOGIN_TITLE").text(LOGIN_TITLE_EN);
		$("#LOGIN_REQUEST").text(LOGIN_REQUEST_EN);
		$("#LOGIN_ID_FIELD").attr("placeholder",LOGIN_ID_FIELD_EN);
		$("#LOGIN_PASSWORD_FIELD").attr("placeholder",LOGIN_PASSWORD_FIELD_EN);
		$("#LOGIN_LABEL").text(LOGIN_BUTTON_EN);
		$("#FORGOT_LOGIN").text(FORGOT_LOGIN_ID_EN);
		$("#PASSWORD_RECOVER").text(PASSWORD_RECOVER_EN);
		$("#PASSWORD_RENEW_BUTTON").text(PASSWORD_RENEW_BUTTON_EN);
		$("#COPY_RIGHT1").text(COPYRIGHT_TEXT1_EN);
		$("#COPY_RIGHT2").text(COPYRIGHT_TEXT2_EN);
		$("#COPY_RIGHT3").text(COPYRIGHT_TEXT3_EN);
		$("#loginContainer").show();
	}
	
	function koreanLanguage() {
		$("#korean").css("color","#EC4758");
		$("#english").css("color","#666666");
		
		$("#LOGIN_HEADER").text(LOGIN_HEADER_KR);
		$("#LOGIN_TITLE").text(LOGIN_TITLE_KR);
		$("#LOGIN_REQUEST").text(LOGIN_REQUEST_KR);
		$("#LOGIN_ID_FIELD").attr("placeholder",LOGIN_ID_FIELD_KR);
		$("#LOGIN_PASSWORD_FIELD").attr("placeholder",LOGIN_PASSWORD_FIELD_KR);
		$("#LOGIN_LABEL").text(LOGIN_BUTTON_KR);
		$("#FORGOT_LOGIN").text(FORGOT_LOGIN_ID_KR);
		$("#PASSWORD_RECOVER").text(PASSWORD_RECOVER_KR);
		$("#PASSWORD_RENEW_BUTTON").text(PASSWORD_RENEW_BUTTON_KR);
		$("#COPY_RIGHT1").text(COPYRIGHT_TEXT1_KR);
		$("#COPY_RIGHT2").text(COPYRIGHT_TEXT2_KR);
		$("#COPY_RIGHT3").text(COPYRIGHT_TEXT3_KR);
		$("#loginContainer").show();
	}
	

		
	var cookieLanguage = $.cookie("language");
	if (cookieLanguage != undefined && cookieLanguage != null) {
		if (cookieLanguage == "korean"){
			koreanLanguage();
			$("#koreanLang").css("color","#0088CC");
		}else{
			englishLanguage();
			$("#englishLang").css("color","#0088CC");
		}
	}else{
		if(BROWSER_LANG == "en-US" || BROWSER_LANG == "en"){
			englishLanguage();
			$("#englishLang").css("color","#0088CC");
			$("#koreanLang").css("color","");
		}
		else{
			koreanLanguage();
			$("#koreanLang").css("color","#0088CC");
			$("#englishLang").css("color","");
		};	
	};
	
	$("#koreanLang").click(function(){
		$.cookie("language", "korean");
		$("#englishLang").css("color","");
		$("#koreanLang").css("color","#0088CC");
		koreanLanguage();
	});
	
	$("#englishLang").click(function(){
		$.cookie("language", "english");
		$("#englishLang").css("color","#0088CC");
		$("#koreanLang").css("color","");
		englishLanguage();
	});
	// 신 관리자 페이지에서 구 관리자 페이지 리다이렉트 파라미터 체크
	var HOST_URI = window.location.hostname;
	var param = URLParser(window.location.href).getParam('redirectFrom');
	var TARGET_URI = "";
	
	if(param != null || param != ''){
		if(param != 'newAdmin'){ 
			if(HOST_URI == 'localhost'){
				TARGET_URI = "http://localhost/web/dashboard/app/index.html";
			}
			
			if (HOST_URI == "dev5.paygate.net") {
				TARGET_URI = "https://dev5.paygate.net/dashboard/app/index.html"; 
			}else if (HOST_URI == "stg5.paygate.net") {
				TARGET_URI = "https://stg5.paygate.net/dashboard/app/index.html"; 
			}else if (HOST_URI == "v5.paygate.net") {
				TARGET_URI = "https://v5.paygate.net/dashboard/app/index.html"; 
			}
			window.location.replace(TARGET_URI);
			return;
		}
	}
	
	var loader = function(){
		 $this = $("#LOGIN_BUTTON");
		 $this.button('loading');
	};
	
	var commonLoginEvent = function(){
		username = $("#LOGIN_ID_FIELD").val().trim();
        password = $("#LOGIN_PASSWORD_FIELD").val().trim();
        
        storeInCookie("userName",username);
        
        param = getServerMessageParam + "&login=" + username;
        
        if(username.length<=0 && password.length <=0){
        	alert("missing loginID & password");
        	$this.button('reset');
        }else{
        	if(username.length<=0){
        		alert("missing loginID");
        		$this.button('reset');
        	}else if(password.length <=0){
        		alert("missing password");
        		$this.button('reset');
        	}else{
      			AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
		        	getPublicKey(data);
		        });  		
        	}
        }
    };
		
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
        url = domainUrl+"v5l/e2e/keysExchange?";
        
        if (data.status != undefined) {
        	if (data.status == "ERROR")
        		if (data.data.cdKey == "KEY_EXPIRED") {
        			alert("Service unavailable, please contact the customer service");
        		}
        }
        
        getServerMessageParam = "encrMessage=" + ENCODE_URI_COMPONENT(data.encrMessage) + "&appGuid=" + data.appGuid + "&hash=" + ENCODE_URI_COMPONENT(data.hash) + "&nonce=" + data.nonce;
        	
        $("#LOGIN_BUTTON").click(function() {
        	console.log("22");
        	loader();
        	commonLoginEvent();
        });
        
        $('input[type=password]').on('keydown', function(e) {
    	    if (e.which == 13) {
    	        e.preventDefault();
    	        loader();
    	        commonLoginEvent();
    	    }else{}
    	});
        
    });  
	                 
});
