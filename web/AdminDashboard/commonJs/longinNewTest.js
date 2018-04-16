var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;
var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";
​
if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
​
var domain = TARGET_URI;
var pg_e2e_url = domain + "v5l/e2e/";
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
​
var encrE2EKeyB;
​
var username;
var password;
​
keyB = generat64BitKey();
 
function generat64BitKey(){
	/**Generate Key**/
    var i, j, k = "";
    var i, j, k = "";
    addEntropyTime();
    var seed = keyFromEntropy();
    var prng = new AESprng(seed);
    var hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+=-_/@#$";
    
    for (i = 0; i < 64; i++) {
        k += hexDigits.charAt(prng.nextInt(15));
    }
    
    delete prng;
   
    var myGenerated64BitKey = k;
    return myGenerated64BitKey;
};
​
function getPublicKey(data){
	var status = data.status;
		
	if(status == "SUCCESS"){
		if(data.publicKey != null){
			pubkeys = "";
			pubKey2 = data.publicKey;
			console.log("pubkeys:" + pubKey2);
			console.log("e:" + pubKey2.e);
			console.log("n:" + pubKey2.n);
			console.log("maxdigits:" + pubKey2.maxdigits);
​
			getEncrKeyB();
		}
	}else{
		alert("status: " + status + "::Content: " + data.data);
	}
}
​
function getEncrKeyB(){
	// keyB = generat64BitKey();
	// myNewKeyB = keyB;
	alert("keyB: " + keyB);
​
	cryptico.getMyKeys(pubKey2, function(receivedKeys) {
		console.log("receivedKeys n:" + receivedKeys.n);
​
		cryptico.encrypt(keyB, receivedKeys, function(encrypted_key) {
			alert(encrypted_key);
			console.log("encrypted_key:" + encrypted_key);
			
			encrE2EKeyB = encrypted_key;
        	alert("encKey2: " + encrE2EKeyB);
​
        	url = domain+"v5l/e2e/keysExchange?";
        	method = "PUT";
            param = "encKeyb=" + encrE2EKeyB + "&login=" + username + "&_method=" + "PUT";
	        
	        AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
	        	if (data.status != undefined) {
	        		if (data.status == "SUCCESS") {
	        			alert("Send password...");
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
​
function sendEncPassword() {
	cryptico.encryptAes(password, keyB, function(encryptedPassword) {
    	url = domain+"v5l/login/authenticate?";
    	method = "GET";
        param = "e2e_password=" + encryptedPassword + "&login=" + username + "&_method=" + "GET";
        
        AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
       	 if (data.status != undefined) {
       		 if (data.status == "SUCCESS")
       			 alert("signature: " + data.signature); 
       		 else if (data.status == "ERROR")
       			if (data.data.cdKey == "KEY_EXPIRED") {
       				alert("Service unavailable, please contact the customer service");
       			} else
            			alert("Error please try again");
            } else
           	 alert("Error please try again");
           	 
       });
	});
}
​
var isAdmin;
function callbackSendReceiveSharedkey(data){
	GUID = data.data.guid;
	isAdmin = data.data.isAdmin;
	if(data.data.alert!=undefined){
		passwordExpired();
	}else{
		adminlogin();	
	}
};
​
function passwordExpired(){
	$.cookie("superGuid", GUID);
	$.cookie("pkey", myNewKeyB);
	$.cookie("isAdmin",isAdmin);
	
	alert("Your password has expired, you will be redirected");
	window.location="renewPassword.html";
}
​
function adminlogin(){
	var bits = 256;
	var KEY_ENC = myNewKeyB; 
	$.cookie("superGuid", GUID);
	$.cookie("pkey", myNewKeyB);
	$.cookie("isAdmin",isAdmin);
	window.location = 'admin.html';
};
​
$(document).ready(function() {
	ce();                           
    mouseMotionEntropy(60);
    var redirectUrl;
    var encrMessage;
    var appNm;
    var timeout;
    var hash;
    var nonce;
    var url = domain+"v5a/login/init?";
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
		$("#LOGIN_BUTTON").text(LOGIN_BUTTON_EN);
		$("#FORGOT_LOGIN").text(FORGOT_LOGIN_ID_EN);
		$("#PASSWORD_RECOVER").text(PASSWORD_RECOVER_EN);
		$("#PASSWORD_RENEW_BUTTON").text(PASSWORD_RENEW_BUTTON_EN);
		$("#COPY_RIGHT1").text(COPYRIGHT_TEXT1_EN);
		$("#COPY_RIGHT2").text(COPYRIGHT_TEXT2_EN);
		$("#COPY_RIGHT3").text(COPYRIGHT_TEXT3_EN);
	}
	
	function koreanLanguage() {
		$("#korean").css("color","#EC4758");
		$("#english").css("color","#666666");
		
		$("#LOGIN_HEADER").text(LOGIN_HEADER_KR);
		$("#LOGIN_TITLE").text(LOGIN_TITLE_KR);
		$("#LOGIN_REQUEST").text(LOGIN_REQUEST_KR);
		$("#LOGIN_ID_FIELD").attr("placeholder",LOGIN_ID_FIELD_KR);
		$("#LOGIN_PASSWORD_FIELD").attr("placeholder",LOGIN_PASSWORD_FIELD_KR);
		$("#LOGIN_BUTTON").text(LOGIN_BUTTON_KR);
		$("#FORGOT_LOGIN").text(FORGOT_LOGIN_ID_KR);
		$("#PASSWORD_RECOVER").text(PASSWORD_RECOVER_KR);
		$("#PASSWORD_RENEW_BUTTON").text(PASSWORD_RENEW_BUTTON_KR);
		$("#COPY_RIGHT1").text(COPYRIGHT_TEXT1_KR);
		$("#COPY_RIGHT2").text(COPYRIGHT_TEXT2_KR);
		$("#COPY_RIGHT3").text(COPYRIGHT_TEXT3_KR);
	}
		
	 var cookieLanguage = $.cookie("language");
		
	   	if (cookieLanguage != undefined && cookieLanguage != null) {
	   		if (cookieLanguage == "english")
	   			englishLanguage();
	   		else
	   			koreanLanguage();
	   	} else {
			if(BROWSER_LANG == "en-US" || BROWSER_LANG == "en"){
				englishLanguage();
			}
			else{
				koreanLanguage();
			}
	   	}
	   	
	   	$("#koreanLang").click(function(){
			$.cookie("language", "korean");
			koreanLanguage();
		});
		
		$("#englishLang").click(function(){
			$.cookie("language", "english");
			englishLanguage();
		});
		
		
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
        url = domain+"v5l/e2e/keysExchange?";
        
        if (data.status != undefined) {
        	if (data.status == "ERROR")
        		if (data.data.cdKey == "KEY_EXPIRED") {
        			alert("Service unavailable, please contact the customer service");
        		}
        }
        
        getServerMessageParam = "encrMessage=" + ENCODE_URI_COMPONENT(data.encrMessage) + "&appGuid=" + data.appGuid + "&hash=" + ENCODE_URI_COMPONENT(data.hash) + "&nonce=" + data.nonce;
        	
        $("#LOGIN_BUTTON").click(function() {     
        	username = $("#LOGIN_ID_FIELD").val();
            password = $("#LOGIN_PASSWORD_FIELD").val();
            
            param = getServerMessageParam + "&login=" + username;
	        
	        AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status) {
	        	getPublicKey(data);   	
	        }); 
        });
    });                
	                 
});