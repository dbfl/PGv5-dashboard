/**
 * @author Gabriel
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

if(typeof merchantGUID === 'undefined'){
	window.location.href = 'login.html';
}

if(isAdmin=="true"){
	// TODO: Add roles for admin in new style
	// $("#rolesMenuContainer").show();
	$("#currencyNaviMenu").show();
}else{
	$("#rolesMenuContainer").hide();
	$("#currencyNaviMenu").hide();
}

var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;

var koreanLanguage = function(){
	$("#charge").text(CHARGE_KR);
	$("#chargeToAccount").text(CHARGE_TO_ACCOUNT_KR);
	$("#chargeMerchantAccount").text(CHARGE_TO_MERCHANT_ACCOUNT_KR);
	$("#desMemGuid").text(DESTINATION_MEMBER_GUID_KR);
	$("#amount").text(AMOUNT_KR);
	$("#currency").text(CURRENCY_KR);
	$("#menuCharge").text(CHARGE_KR);
	$("#chargeByPaygate").text(CHARGE_BY_PAYGATE_KR);
	$("#typeLbl").text(DTL_TYPE_KR);
	$("#note").text(NOTE_KR);
};
var englishLanguage = function () {
	$("#charge").text(CHARGE_EN);
	$("#chargeToAccount").text(CHARGE_TO_ACCOUNT_EN);
	$("#chargeMerchantAccount").text(CHARGE_TO_MERCHANT_ACCOUNT_EN);
	$("#desMemGuid").text(DESTINATION_MEMBER_GUID_EN);
	$("#amount").text(AMOUNT_EN);
	$("#currency").text(CURRENCY_EN);
	$("#menuCharge").text(CHARGE_EN);
	$("#typeLbl").text(DTL_TYPE_EN);
	$("#note").text(NOTE_EN);
};

var rawData;
var method;
var param;
var url;
var dstGuid;

function wonBalance(){
	dstGuid = $("#dstMemGuid").val();
	rawData ='dstMemGuid='+dstGuid+'&crrncy=KRW&reqMemGuid='+merchantGUID+'&callback=?';
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5/member/seyfert/inquiry/balance?_method=GET&';
	method = 'POST';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if(data.data.moneyPair !=undefined){
			$("#krwBalance").text(currencyFormat(data.data.moneyPair.amount));
			$("#chargeAmount").removeAttr("disabled");
			$("#chargeAmount").val("");
			$("#chargeAmount").focus();
			$("#balanceContainer").show();
		}else{
			$("#balanceContainer").hide();
			$("#krwBalance").text("0.0");
		}
	});
};

function dollarBalance(){
	dstGuid = $("#dstMemGuid").val();
	rawData ='dstMemGuid='+dstGuid+'&crrncy=USD&reqMemGuid='+merchantGUID+'&callback=?';
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5/member/seyfert/inquiry/balance?_method=GET&';
	method = 'POST';
	var resData;
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if(data.data.moneyPair !=undefined){
			$("#usdBalance").text(currencyFormat(data.data.moneyPair.amount));
			$("#chargeAmount").removeAttr("disabled");
			$("#chargeAmount").val("");
			$("#chargeAmount").focus();
			$("#balanceContainer").show();
		}else{
			$("#chargeAmount").removeAttr("disabled");
			$("#chargeAmount").val("");
			$("#usdBalance").text("0.0");
		}
	});
};

var memberList = function(){
	rawData = 'fullname='+$("#dstMemGuid").val()+'&callback=?&page=1&limit=10&reqMemGuid='+merchantGUID;	
 	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
    url = TARGET_URI+'v5a/member/allInfo?_method=GET&';
 
    AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
    	var memberList = [];
    	if (data.status != "SUCCESS") {
			if(data.data.cdDesc=="SESSION_EXPIRED"){
				$.removeCookie("superGuid");
				$.removeCookie("pkey");
				$.removeCookie("isAdmin");
				
				$.cookie("superGuid", null,{path: '/', domain: 'paygate.net',secure: true});
				$.cookie("pkey", null,{path: '/', domain: 'paygate.net',secure: true});
				$.cookie("isAdmin",null,{path: '/', domain: 'paygate.net',secure: true});
				
				window.location = 'login.html';	
			}else{
				alert(data.data.cdDesc);	
			}	
		}else{
			if(data.data.resultList!='' || data.data.resultList==undefined || data.data.resultList=='undefined'){
				for(var i = 0; i < data.data.resultList.length; i++){
					memberList.push("<tr style='height:30px;'>");
					memberList.push("<td style=cursor:pointer;color:#586B7D><strong class='getMemberDetail' data-placement='top' data-toggle='tooltip' href='#' data-original-title='member guid,click me'>"+data.data.resultList[i].guid+"</strong></td>");
					if(data.data.resultList[i].fullname==null || data.data.resultList[i].fullname=="undefined"){
							memberList.push("<td data-hide='phone,tablet'><i class='fa fa-bookmark'></i> not available</td>");
						}else{
							memberList.push("<td data-hide='phone,tablet'><i class='fa fa-bookmark'></i> " +data.data.resultList[i].fullname+"</td>");	
					}
					memberList.push("<td> <input type='radio' name='guidselect' class='guidItem' style='cursor:pointer' value="+data.data.resultList[i].guid+" > </td>");
					memberList.push("</tr>");	
				}	
				$("#memberList").html(memberList.join(''));
				$("#guidList").show();
				$('strong').tooltip();
				
				$(".guidItem").click(function(){
					$("#dstMemGuid").val($(this).val());
					//$("#dstMemGuid").focus();
					$("#chargeAmount").attr("disabled","disabled");
					$("#chargeAmount").val("please wait ..");
					$(".getMemberDetail").css("color","#586B7D");
					$(this).closest('tr').find('strong.getMemberDetail').css('color','#EA394C');
					wonBalance();
					dollarBalance();
				});
				
				$(".getMemberDetail").click(function(){
					$(this).closest('tr').find('input:radio').trigger('click');
					$(".getMemberDetail").css("color","#586B7D");
					$(this).css("color","#EA394C");
				});
				
				$(".guidItem:first").trigger("click");
				
			}else{
				//alert("Name does not exist!");
				$("#memberList").html('');
				$("#guidList").hide();
			}
		};
	});
};

/*$("#getDstGuid").click(function(){
	memberList();
});
*/
$("#dstMemGuid").focusout(function(){
	var checkVal = $(this).val();
	if(checkVal !=''){
		$("#chargeAmount").attr("disabled","disabled");
		$("#chargeAmount").val("please wait ..");
		memberList();
		wonBalance();
		dollarBalance();
	}else{
		//alert("Please provide the GUID");
	}
});

 
var depValue = $("#depositAction").val();

$("#depositAction").change(function(){
	depValue = $(this).val();
});
	
function chargeAcc() {
	var currency = $('#crrncy').val();
	var amount = $('#chargeAmount').val();
	var dstMemGuid = $('#dstMemGuid').val();
	
	var formData = decodeURIComponent('callback=?&reqMemGuid='+merchantGUID+'&dstMemGuid=' + dstMemGuid + '&crrncy=' + currency + '&amount=' + amount);
	var utf8encoded = pidCryptUtil.decodeUTF8(formData);
	
	var aes = new pidCrypt.AES.CTR();
	aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
	
	var crypted = aes.encrypt();
	
	var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
	
	var url;
	if(depValue=="payin"){
		url = TARGET_URI+'v5a/transaction/bankDepositPayin?_method=POST&'+params;
	}else{
		url = TARGET_URI+'v5a/transaction/bankDepositPayout?_method=POST&'+params;
	}
	
	$.ajax({
		url:url,
		type:'GET',
		async:false,
		dataType:'jsonp',
		error:function(){alert("Error");},
		success:function(data){
			if (data.status == "SUCCESS"){
				alert(data.data.status);
			}else{
				alert("ERROR :: "+ data.data.cdDesc);
				if(data.data.cdDesc=="SESSION_EXPIRED"){
					$.removeCookie("superGuid");
					$.removeCookie("pkey");
					$.removeCookie("isAdmin");
					$.removeCookie("userName");
					//$.removeCookie("loadedPage");
					
					$.cookie("superGuid", null,{path: '/', domain: 'paygate.net',secure: true});
					$.cookie("pkey", null,{path: '/', domain: 'paygate.net',secure: true});
					$.cookie("isAdmin",null,{path: '/', domain: 'paygate.net',secure: true});
					$.cookie("userName",null,{path: '/', domain: 'paygate.net',secure: true});
					
					window.location = 'login.html';
				}
			}
			
			wonBalance();
			dollarBalance();
			$("#guidList").hide();
			$("#menuCharge").text("Charge");
			$("#chargeToAccountBut").removeAttr("disabled");
		}
	});	

};

$('#chargeToAccountBut').click(function() {
	$("#menuCharge").text("processing...");
	$(this).attr("disabled","disabled");
	chargeAcc();	
});
	
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
