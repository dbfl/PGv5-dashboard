/**
 * @author athan
 */

var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";

if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}

var isAdmin = $.cookie("isAdmin");
var bits = 256;
var merchantGUID = $.cookie("superGuid");
var KEY_ENC = $.cookie("pkey");

$('#message').maxlength({
    events: [], // Array of events to be triggered
    maxCharacters: 1500, // Characters limit
    status: true, // True to show status indicator below the element
    statusClass: "status", // The class on the status div
    statusText: "character left", // The status text
    notificationClass: "notification",  // Will be added when maxlength is reached
    showAlert: false, // True to show a regular alert message
    alertText: "You have typed too many characters.", // Text in alert message
    slider: false // True Use counter slider
 });

$("#smsSend").unbind("click").click(function(){
	$(this).text('Please wait ...').attr('disabled','disabled');
	var rawData = "numbersToReceiveCSV="+$("#numbersToReceiveCSV").val()+"&title="+$("#title").val()+"&message="+$("#message").val()+"&callback=?&reqMemNo="+merchantGUID;
	var method = 'GET';
	param = rawData;
	var url = TARGET_URI+'v5/v5ctest/adminsms?_method=GET&';
	 
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		if(data.data.cdKey=="SESSION_EXPIRED"){
			alert(data.data.cdKey);
			$.removeCookie("superGuid");
			$.removeCookie("pkey");
			$.removeCookie("isAdmin");
			//$.removeCookie("loadedPage");
			
			$.cookie("superGuid", null,{path: '/', domain: 'paygate.net',secure: true});
			$.cookie("pkey", null,{path: '/', domain: 'paygate.net',secure: true});
			$.cookie("isAdmin",null,{path: '/', domain: 'paygate.net',secure: true});
			
			window.location = 'login.html';	
		}else{
			alert(data.status);
		};
		$("#smsSend").text('send');
		$("#smsSend").removeAttr('disabled');
	});
	
});