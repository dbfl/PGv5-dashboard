var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;
var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";
if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
var domain = TARGET_URI;
var $this;
KEY_ENC = $.cookie("pkey");
$(document).ready(function(){
	$("#passwordPolicyCheck").click(function(){
		$("#passwordPolicyContainer").toggle("fadeIn");
		$(this).toggleClass("colorA colorB");
	}); 
	var reNewPassword = function(){
		 var keyB = $.cookie("pkey");
	        var resetGUID = $.cookie("superGuid");
	        var oldPassword = ENCODE_URI_COMPONENT($("#OLD_PASSWORD").val());
	        var newPassword = ENCODE_URI_COMPONENT($("#NEW_PASSWORD").val());
	        var newPasswordConfirm = ENCODE_URI_COMPONENT($("#NEW_PASSWORD_CONFIRMATION").val());
	        
	        var KEY_ENC = keyB;
	        
	        var rawData = 'callback=?&reqMemGuid='+resetGUID+'&oldPassword='+oldPassword+'&newPassword='+newPassword;
	        var param = 'reqMemGuid='+resetGUID+'&_method=PUT&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	        var url = domain+'v5a/login/password?';
	        var method = 'GET';
	        
	        if (newPassword != newPasswordConfirm) {
	            alert("Password does not match the confirm password");
	            $this.button('reset');
	            return;
	        }
	        
	        AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
	            if(data.status=="SUCCESS"){
	            	$this.button('reset');
	                alert("Password changed, please login");
	                window.location.href = "login.html";  
	            }else{
	            	$this.button('reset');
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
	};
	
	var loader = function(){
		 $this = $("#RENEW_PASSWORD_BUTTON");
		 $this.button('loading');
	};
	
    $("#RENEW_PASSWORD_BUTTON").click(function(){
       loader();
       reNewPassword();
    });
    
    $('#NEW_PASSWORD_CONFIRMATION').on('keydown', function(e) {
	    if (e.which == 13) {
	        e.preventDefault();
	        loader();
	        reNewPassword();
	    }else{}
	});
    
    $("#PREVIOUS_PAGE").click(function(){
        history.go(-1);
    });
}); 