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

var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;

var koreanLanguage = function(){
	$("#tabWithdraw").text(WITHDRAW_KR);
	$("#seyfertWithdrawSimulator").text(SEYFERT_WITHDRAW_KR);
	$("#titleLbl").text(TITLE_KR);
	$("#amountLbl").text(AMOUNT_KR);
	$("#simulate").text(WITHDRAW_KR);
	$("#withdrawSuccess").text(WITHDRAW_SUCCESS_KR);
	$("#withdrawFail").text(WITHDRAW_FAIL_KR);
	$("#seyfertWithdrawWarningMessage").text(WITHRAW_DESCRIPTION_KR);
	$("#destinationGuidLabel").text(DESTINATION_MEMBER_GUID_KR);
	$("#note").text(NOTE_KR);
};

var englishLanguage = function(){
	$("#tabWithdraw").text(WITHDRAW_EN);
	$("#seyfertWithdrawSimulator").text(SEYFERT_WITHDRAW_EN);
	$("#titleLbl").text(TITLE_EN);
	$("#amountLbl").text(AMOUNT_EN);
	$("#simulate").text(WITHDRAW_EN);
	$("#withdrawSuccess").text(WITHDRAW_SUCCESS_EN);
	$("#withdrawFail").text(WITHDRAW_FAIL_EN);
	$("#seyfertWithdrawWarningMessage").text(WITHRAW_DESCRIPTION_EN);
	$("#destinationGuidLabel").text(DESTINATION_MEMBER_GUID_EN);
	$("#note").text(NOTE_EN);
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

var rawData;
var method;
var param;
var url;

var checkSeyfertBalance = function(){
	var dstGuid = $("#destinationGuid").val();
	rawData ='dstMemGuid='+dstGuid+'&crrncy=KRW&reqMemGuid='+merchantGUID+'&callback=?';
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5/member/seyfert/inquiry/balance?_method=GET&';
	method = 'POST';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		$("#totalBalanceAmt").text(currencyFormat(data.data.moneyPair.amount));
		$("#totalBalance").val(data.data.moneyPair.amount);
	});	
};

var memberList = function(){
	rawData = 'fullname='+$("#destinationGuid").val()+'&callback=?&page=1&limit=10&reqMemGuid='+merchantGUID;	
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
					$("#destinationGuid").val($(this).val());
					//$("#dstMemGuid").focus();
					$("#amount").attr("disabled","disabled");
					$("#amount").val("please wait ..");
					$(".getMemberDetail").css("color","#586B7D");
					$(this).closest('tr').find('strong.getMemberDetail').css('color','#EA394C');
					loadWonBalance();
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

var loadWonBalance = function(){
	var dstGuid = $("#destinationGuid").val();
	rawData ='dstMemGuid='+dstGuid+'&crrncy=KRW&reqMemGuid='+merchantGUID+'&callback=?';
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5/member/seyfert/inquiry/balance?_method=GET&';
	method = 'POST';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if(data.data.moneyPair !=undefined){
			$("#merchantSeyfertBalance").text(currencyFormat(data.data.moneyPair.amount));
			$("#totalBalance").val(data.data.moneyPair.amount);
			$("#balanceResultContainer").show();
			$("#checkBalance").attr('value','Check Balance');
			$("#amount").removeAttr("disabled");
			$("#amount").val("");
			$("#title").focus();	
		}else{
					
		}
	});
};

$("#destinationGuid").focusout(function(){
	var checkVal = $(this).val();
	if(checkVal !=''){
		$("#amount").attr("disabled","disabled");
		$("#amount").val("please wait ..");
		loadWonBalance();
		memberList();	 
	}else{
		//alert("Please provide the GUID");
	}
});

var loadTotalBalanceForAdmin = function(){
	rawData = 'callback=?&rowsperpage=10&page=0&reqMemGuid='+merchantGUID+'&listType=totalAmt&crrncyCd=KRW';
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
			if(data.status=="SUCCESS"){
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					if(data.data.result.SeyfertList.length <=0){
						$("#totalBalanceAmt").text(0);
					}else{
						$("#totalBalanceAmt").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
					}	
				};
			}
		}
	});			
};
if(isAdmin=="true"){
	$(".destinationGuidCon").show();
	loadTotalBalanceForAdmin();
}else{
	$(".destinationGuidCon").hide();
	$("#destinationGuid").val(merchantGUID);
	checkSeyfertBalance();
};

$("#simulateSeyfertWithdraw").click(function(){
	$(this).text('Please wait ...').attr('disabled','disabled');
	var balance = $("#totalBalance").val() * 1;
	var withdrawAmount = $("#amount").val() * 1;
	if(withdrawAmount>balance){
		alert("Sorry! In-sufficient balance.");
	}else{
		if(withdrawAmount==''||withdrawAmount=='0'){
			alert("Please check the amount!");
		}else{
			$("#simulate").text('loading ...');
			rawData = decodeURIComponent($("#seyfertWithdrawForm").serializeAndEncode() + '&callback=?&crrncy=KRW&reqMemGuid='+merchantGUID);
			method = 'POST';
			param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
			url = TARGET_URI+'v5/transaction/seyfert/withdraw?_method=POST&';
			 
			AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
				if (data.status == "SUCCESS") {
					$("#withdrawResultContainer").show(function(){
						$("#withdrawSuccess").show();
						$("#withdrawFail").hide();
						$("#withdrawResultText").text("Verification in process");
						
						if(isAdmin=="true"){
							loadTotalBalanceForAdmin();
							loadWonBalance();
						}else{
							checkSeyfertBalance();
						};
						
					});
				}else{
					if(data.data.cdKey!=undefined){
						if(data.data.cdKey=="SEESION_HAS_EXPIRED"){
							alert(data.data.cdKey);
							$.removeCookie("superGuid");
							$.removeCookie("pkey");
							$.removeCookie("isAdmin");
							$.removeCookie("userName");
							//$.removeCookie("loadedPage");
							
							$.cookie("superGuid", null,{path: '/', domain: '127.0.0.1',secure: true});
							$.cookie("pkey", null,{path: '/', domain: '127.0.0.1',secure: true});
							$.cookie("isAdmin",null,{path: '/', domain: '127.0.0.1',secure: true});
							$.cookie("userName",null,{path: '/', domain: '127.0.0.1',secure: true});
							
							window.location = 'login.html';	
						}
						else if(data.data.cdKey=="INVALID_PARAM_FORMAT"){
							alert(data.data.cdKey);
							//$("#withdrawResultText").text(data.data.cdKey);
						}else{
							$("#withdrawResultContainer").show(function(){
								$("#withdrawSuccess").hide();
								$("#withdrawFail").show();
								$("#withdrawResultText").text(data.data.cdKey);
								$("#destinationGuid").val("");
								$("#title").val("");
								$("#amount").val("");
								$("#balanceResultContainer").hide();
							});		
						}
					}
				};	
				$("#simulate").text('Withdraw');
				$('#simulateSeyfertWithdraw').removeAttr('disabled');
			});	
		}
	}
});
