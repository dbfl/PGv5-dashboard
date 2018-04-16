/**
 * @author athan
 */

/**URI host declaration and initialization **/
var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";

if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}

/**Declare Variables***/
var num = 1;
var rowsPerPage = $("#rowsPerPage").val();
var singleSearchVal = false;
var bits = 256;
var reqOriginVal = 'page';
var merchantGUID;
var KEY_ENC;
var transactionDate;
var standardDate;
var url;
var param;
var rawData;
var method;
var responseData;
var currentPage = 0;
var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;
var koreanLanguage = function(){
		$("#settings").text(SETTING_KR);
		$("#account").text(ACCOUNT_KR);
		$("#generalAccSetting").text(GENERAL_ACCOUNT_SETTINGS_KR);
		$("#menuUserName").text(USER_NAME_KR);
		$("#menuPassword").text(ACCOUNT_SETTINGS_PASSWORD_KR);
		$("#menuRenew").text(PASSWORD_RENEW_KR);
		$("#buttonRenew").text(PASSWORD_RENEW_KR);
		$("#renewOldPassword").text(OLD_PASSWORD_KR);
		$("#renewNewPassword").text(NEW_PASSWORD_KR);
		$("#confirmPassword").text(CONFIRM_PASSWORD_KR);
		$("#menuCancel").text(CANCEL_KR);
};

var englishLanguage = function(){
		$("#settings").text(SETTING_EN);
		$("#account").text(ACCOUNT_EN);
		$("#generalAccSetting").text(GENERAL_ACCOUNT_SETTINGS_EN);
		$("#menuUserName").text(USER_NAME_EN);
		$("#menuPassword").text(ACCOUNT_SETTINGS_PASSWORD_EN);
		$("#menuRenew").text(PASSWORD_RENEW_EN);
		$("#buttonRenew").text(PASSWORD_RENEW_EN);
		$("#renewOldPassword").text(OLD_PASSWORD_EN);
		$("#renewNewPassword").text(NEW_PASSWORD_EN);
		$("#confirmPassword").text(CONFIRM_PASSWORD_EN);
		$("#menuCancel").text(CANCEL_EN);
};

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

$("#accountUserName").text($.cookie("userName"));

$("#renewPassword").click(function(){
	$("#renewPasswordContainer").show();
	$("#cancelRenewPassword").show();
	$(this).hide();
});

$("#cancelRenewPassword").click(function(){
	$("#renewPasswordContainer").hide();
	$("#renewPassword").show();
	$(this).hide();
});

$("#renewKeyp").click(function(){
	var r = confirm("would you like to renew your keyp?");
	if (r == true) {
		var key = $.cookie("pkey");
		var guid = $.cookie("superGuid");

		var rawData = 'reqMemGuid=' + ENCODE_URI_COMPONENT(guid);
		var param = 'reqMemGuid=' + guid + '&_method=GET&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		var url = TARGET_URI + 'v5a/member/login/keyp?';
		var method = 'GET';

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			if (data.status == "SUCCESS") {
				var bits = 256;
				var aes = new pidCrypt.AES.CTR();
				var newKeyp = aes.decryptText(data.data.result, key, {
					nBits : bits
				});
				alert("Your keyP is successfully renewed");
				$("#keypLabel").text(newKeyp);
			}
		});
	} else {}
});

$("#renewPasswordBut").click(function(){
	var keyB = $.cookie("pkey");
	var resetGUID = $.cookie("superGuid");
	var oldPassword = ENCODE_URI_COMPONENT($("#OLD_PASSWORD").val());
	var newPassword = ENCODE_URI_COMPONENT($("#NEW_PASSWORD").val());
	var newPasswordConfirm = ENCODE_URI_COMPONENT($("#NEW_PASSWORD_CONFIRMATION").val());
	
	var KEY_ENC = keyB;
	
	var rawData = 'reqMemGuid='+resetGUID+'&oldPassword='+oldPassword+'&newPassword='+newPassword;
	var param = 'reqMemGuid='+resetGUID+'&_method=PUT&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	var url = TARGET_URI+'v5a/login/password?';
	var method = 'GET';
	
	if (newPassword != newPasswordConfirm) {
		alert("Password does not match the confirm password");
		return;
	}
	
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		if(data.status=="SUCCESS"){
			alert("Password changed, success");
			//window.location.href = "login.html";	
		}else{
			if (data.data != undefined && data.data.cdKey != undefined 
					&& data.data.cdKey == "PASSWORD_IN_HISTORY") 
				alert("Password already used in history");
			else if (data.data != undefined && data.data.cdKey != undefined 
					&& data.data.cdKey == "WRONG_PWD_CHECK_POLICY") 
				alert("New password should be compliant with the password policy");
			
			if (data.data != undefined && data.data.cdKey != undefined 
					&& data.data.cdKey == "ACCOUNT_LOCKED") 
				alert("Account locked, please wait until the end of the lockout or contact the customer service");
			else
				alert("Wrong login / Password, please try again");
		}
	});
	
});



