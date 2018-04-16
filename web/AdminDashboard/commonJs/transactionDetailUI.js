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
	var rowsPerPage = 3;
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
	$("#menuDashboard").text(DASHBOARD_KR);
	$("#menuTransaction").text(TRANSACTION_KR);
	$("#menuSeyfert").text(SEYFERT_KR);
	$("#menuMember").text(MEMBER_KR);
	$("#totalAmt").text(TOTAL_AMOUNT_KR);
	$("#dailyTotalAmt").text(TODAY_AMOUNT_TOTAL_KR);
	$("#24hTotalAmt").text(LAST24h_AMOUNT_TOTAL_KR);
	$("#24HrsTotal").text(LAST_24_HOURS_KR);
	$("#lastWeekTotal").text(LAST_WEEK_KR);
	$("#transactionFrequency").text(TRANSACTION_FREQUENCY_KR);
	$("#maintransactionList").text(TRANSACTION_LIST_KR);
	$("#transactionSearch").text(TRANSACTION_SEARCH_KR);
	$("#advSearchTrigger").text(SEARCH_KR);
	$("#closeAdvSearchCon").text(CLOSE_KR);
	$("#labelParentTid").text(PARENT_TRANSACTION_ID_KR);
	$("#labelType").text(TYPE_KR);
	$("#labelStatus").text(STATUS_KR);
	$("#labelTitle").text(TITLE_KR);
	$("#labelPayAmount").text(PAY_AMOUNT_KR);
	$("#labelCurrency").text(CURRENCY_KR);
	$("#labelRefid").text(REFERENCE_ID_KR);
	$("#labelOriginAmount").text(ORIGINAL_AMOUNT_KR);
	$("#labelReqmemguid").text(REQUEST_MEMBER_GUID_KR);
	$("#labelSrcmemguid").text(SOURCE_MEMBER_GUID_KR);
	$("#labelDesmemguid").text(DESTINATION_MEMBER_GUID_KR);
	$("#labelTransDate").text(TRANSACTION_DATE_KR);
	$("#labelUpdateDate").text(UPDATE_DATE_KR);
	$("#transDetailBasicInfo").text(BASIC_INFO_KR);
	$("#transDetailExInfo").text(EXCHANGE_INFO_KR);
	$("#transDetailBaseCrr").text(BASE_CURRENCY_KR);
	$("#transDetailDesCrr").text(DESTINATION_CURRENCY_KR);
	$("#transDetailBaseAmt").text(BASE_AMOUNT_KR);
	$("#transDetailExAmt").text(EXCHANGE_AMOUNT_KR);
	$("#transDetailMargin").text(MARGIN_KR);
	$("#transDetailRate").text(EXCHANGE_RATE_KR);
	$("#transDetailFee").text(FEE_KR);
	$("#transDetailRegisterMem").text(REQUEST_MEMBER_KR);
	$("#transDetailSenderMem").text(SENDER_MEMBER_KR);
	$("#transDetailReceiverMem").text(RECEIVER_MEMBER_KR);
	$("#transDetailCompletionDt").text(COMPLETION_DATE_KR);

	$("#trnctnDetailList").text(PARENT_TRANSACTION_ID_KR);
	$("#transDetailRefId").text(REFERENCE_ID_KR);
	$("#completeListperTID").text(COMPLETE_LIST_PER_TID_KR);
	$("#transDetailPayAmtLabel").text(PAY_AMOUNT_KR);
	$("#transDetailPayCurncyLabel").text(PAY_CURRENCY_KR);
	$("#transDetailOrgAmtLabel").text(ORIGINAL_AMOUNT_KR);
	$("#transDetailOrgCurncyLabel").text(ORIGINAL_CURRENCY_KR);
	$("#transDetailReqMemGuid").text(REQUEST_MEMBER_GUID_KR);
	$("#transDetailReqMemName").text(NAME_KR);
	$("#transDetailReqMemEmail").text(EMAIL_KR);
	$("#transDetailReqMemPhone").text(PHONE_KR);
	$("#transDetailReqMemAdd").text(TRANSACTION_ADDRESS_KR);
	$("#transDetailReqMemCnt").text(COUNTRY_KR);
	$("#transDetailSrcMemName").text(NAME_KR);
	$("#transDetailSrcMemPrio").text(PRIORITY_KR);
	$("#transDetailSrcMemPhone").text(PHONE_KR);
	$("#transDetailSrcMemEmail").text(EMAIL_KR);
	$("#transDetailSrcMemVirAccNo").text(VIRTUAL_ACCOUNT_NO_KR);
	$("#transDetailSrcMemVirBank").text(BANK_CD_KR);
	$("#transDetailSrcMemRealAccNo").text(REAL_ACCOUNT_NO_KR);
	$("#transDetailSrcMemRealBank").text(BANK_CD_KR);
	$("#transDetailSourceMemGuid").text(SOURCE_MEMBER_GUID_KR);
	$("#transDetailDesMemName").text(NAME_KR);
	$("#transDetailDesMemPrio").text(PRIORITY_KR);
	$("#transDetailDesMemPhone").text(PHONE_KR);
	$("#transDetailDesMemEmail").text(EMAIL_KR);
	$("#transDetailDesMemVirAccNo").text(VIRTUAL_ACCOUNT_NO_KR);
	$("#transDetailDesMemVirBank").text(BANK_CD_KR);
	$("#transDetailDesMemRealAccNo").text(REAL_ACCOUNT_NO_KR);
	$("#transDetailDesMemRealBank").text(BANK_CD_KR);
	$("#transDetailDesMemGuid").text(DESTINATION_MEMBER_GUID_KR);
	$("#transDetailTransDate").text(TRANSACTION_DATE_KR);
	$("#transDetailLastTransStatusLabel").text(LAST_TRASACTION_STATUS_KR);
	$("#transDetailTransStat").text(TRANSACTION_STATUS_KR);
	$("#transDetailTransTp").text(TRANSACTION_TYPE_KR);
	$("#transDetailUpdateDt").text(UPDATE_DATE_KR);
	$("#transDetailCreationDt").text(CREATION_DATE_KR);
	$("#transDetailVerifiFlg").text(VERIFY_FLAG_KR);
	$("#transDetailClose").text(CLOSE_KR);
	$("#hourChart").text(HOUR_KR);
	$("#dayChart").text(TODAY_KR);
	$("#today").text(TODAY_KR);
	$("#weekChart").text(WEEK_KR);
	$("#last24h").text(LAST_24_HOURS_KR);
	$("#lastweek").text(LAST_WEEK_KR);
	$("#lastmonth").text(LAST_MONTH_KR);
	$("#lastyear").text(LAST_YEAR_KR);
	$("#listall").text(LIST_ALL_KR);
	$("#advance").text(ADVANCE_SEARCH_KR);
	$("#advanceSearchBut").text(SEARCH_KR);
	$("#listpayamount").text(PAY_AMOUNT_KR);
	$("#listorgamount").text(ORIGINAL_AMOUNT_KR);
	$("#listtype").text(TYPE_KR);
	$("#listrefid").text(REFERENCE_ID_KR);
	$("#listtitle").text(TITLE_KR);
	$("#listtransdate").text(TRANSACTION_DATE_KR);
};

var englishLanguage = function(){
	$("#menuDashboard").text(DASHBOARD_EN);
	$("#menuTransaction").text(TRANSACTION_EN);
	$("#menuSeyfert").text(SEYFERT_EN);
	$("#menuMember").text(MEMBER_EN);
	$("#totalAmt").text(TOTAL_AMOUNT_EN);
	$("#dailyTotalAmt").text(TODAY_AMOUNT_TOTAL_EN);
	$("#24hTotalAmt").text(LAST24h_AMOUNT_TOTAL_EN);
	$("#24HrsTotal").text(LAST_24_HOURS_EN);
	$("#lastWeekTotal").text(LAST_WEEK_EN);
	$("#transactionFrequency").text(TRANSACTION_FREQUENCY_EN);
	$("#maintransactionList").text(TRANSACTION_LIST_EN);
	$("#transactionSearch").text(TRANSACTION_SEARCH_EN);
	$("#advSearchTrigger").text(SEARCH_EN);
	$("#closeAdvSearchCon").text(CLOSE_EN);
	$("#labelParentTid").text(PARENT_TRANSACTION_ID_EN);
	$("#labelType").text(TYPE_EN);
	$("#labelStatus").text(STATUS_EN);
	$("#labelTitle").text(TITLE_EN);
	$("#labelPayAmount").text(PAY_AMOUNT_EN);
	$("#labelCurrency").text(CURRENCY_EN);
	$("#labelRefid").text(REFERENCE_ID_EN);
	$("#labelOriginAmount").text(ORIGINAL_AMOUNT_EN);
	$("#labelReqmemguid").text(REQUEST_MEMBER_GUID_EN);
	$("#labelSrcmemguid").text(SOURCE_MEMBER_GUID_EN);
	$("#labelDesmemguid").text(DESTINATION_MEMBER_GUID_EN);
	$("#labelTransDate").text(TRANSACTION_DATE_EN);
	$("#labelUpdateDate").text(UPDATE_DATE_EN);
	$("#transDetailBasicInfo").text(BASIC_INFO_EN);
	$("#transDetailExInfo").text(EXCHANGE_INFO_EN);
	$("#transDetailBaseCrr").text(BASE_CURRENCY_EN);
	$("#transDetailDesCrr").text(DESTINATION_CURRENCY_EN);
	$("#transDetailBaseAmt").text(BASE_AMOUNT_EN);
	$("#transDetailExAmt").text(EXCHANGE_AMOUNT_EN);
	$("#transDetailMargin").text(MARGIN_EN);
	$("#transDetailRate").text(EXCHANGE_RATE_EN);
	$("#transDetailFee").text(FEE_EN);
	$("#transDetailRegisterMem").text(REQUEST_MEMBER_EN);
	$("#transDetailSenderMem").text(SENDER_MEMBER_EN);
	$("#transDetailReceiverMem").text(RECEIVER_MEMBER_EN);
	$("#transDetailCompletionDt").text(COMPLETION_DATE_EN);
	
	$("#trnctnDetailList").text(PARENT_TRANSACTION_ID_EN);
	$("#transDetailRefId").text(REFERENCE_ID_EN);
	$("#completeListperTID").text(COMPLETE_LIST_PER_TID_EN);
	$("#transDetailPayAmtLabel").text(PAY_AMOUNT_EN);
	$("#transDetailPayCurncyLabel").text(PAY_CURRENCY_EN);
	$("#transDetailOrgAmtLabel").text(ORIGINAL_AMOUNT_EN);
	$("#transDetailOrgCurncyLabel").text(ORIGINAL_CURRENCY_EN);
	$("#transDetailReqMemGuid").text(REQUEST_MEMBER_GUID_EN);
	$("#transDetailReqMemName").text(NAME_EN);
	$("#transDetailReqMemEmail").text(EMAIL_EN);
	$("#transDetailReqMemPhone").text(PHONE_EN);
	$("#transDetailReqMemAdd").text(TRANSACTION_ADDRESS_EN);
	$("#transDetailReqMemCnt").text(COUNTRY_EN);
	$("#transDetailSrcMemName").text(NAME_EN);
	$("#transDetailSrcMemPrio").text(PRIORITY_EN);
	$("#transDetailSrcMemPhone").text(PHONE_EN);
	$("#transDetailSrcMemEmail").text(EMAIL_EN);
	$("#transDetailSrcMemVirAccNo").text(VIRTUAL_ACCOUNT_NO_EN);
	$("#transDetailSrcMemVirBank").text(BANK_CD_EN);
	$("#transDetailSrcMemRealAccNo").text(REAL_ACCOUNT_NO_EN);
	$("#transDetailSrcMemRealBank").text(BANK_CD_EN);
	$("#transDetailSourceMemGuid").text(SOURCE_MEMBER_GUID_EN);
	$("#transDetailDesMemName").text(NAME_EN);
	$("#transDetailDesMemPrio").text(PRIORITY_EN);
	$("#transDetailDesMemPhone").text(PHONE_EN);
	$("#transDetailDesMemEmail").text(EMAIL_EN);
	$("#transDetailDesMemVirAccNo").text(VIRTUAL_ACCOUNT_NO_EN);
	$("#transDetailDesMemVirBank").text(BANK_CD_EN);
	$("#transDetailDesMemRealAccNo").text(REAL_ACCOUNT_NO_EN);
	$("#transDetailDesMemRealBank").text(BANK_CD_EN);
	$("#transDetailDesMemGuid").text(DESTINATION_MEMBER_GUID_EN);
	$("#transDetailTransDate").text(TRANSACTION_DATE_EN);
	$("#transDetailLastTransStatusLabel").text(LAST_TRASACTION_STATUS_EN);
	$("#transDetailTransStat").text(TRANSACTION_STATUS_EN);
	$("#transDetailTransTp").text(TRANSACTION_TYPE_EN);
	$("#transDetailUpdateDt").text(UPDATE_DATE_EN);
	$("#transDetailCreationDt").text(CREATION_DATE_EN);
	$("#transDetailVerifiFlg").text(VERIFY_FLAG_EN);
	$("#transDetailClose").text(CLOSE_EN);
	$("#hourChart").text(HOUR_EN);
	$("#dayChart").text(TODAY_EN);
	$("#today").text(TODAY_EN);
	$("#weekChart").text(WEEK_EN);
	$("#last24h").text(LAST_24_HOURS_EN);
	$("#lastweek").text(LAST_WEEK_EN);
	$("#lastmonth").text(LAST_MONTH_EN);
	$("#lastyear").text(LAST_YEAR_EN);
	$("#listall").text(LIST_ALL_EN);
	$("#advance").text(ADVANCE_SEARCH_EN);
	$("#advanceSearchBut").text(SEARCH_EN);
	$("#listpayamount").text(PAY_AMOUNT_EN);
	$("#listorgamount").text(ORIGINAL_AMOUNT_EN);
	$("#listtype").text(TYPE_EN);
	$("#listrefid").text(REFERENCE_ID_EN);
	$("#listtitle").text(TITLE_EN);
	$("#listtransdate").text(TRANSACTION_DATE_EN);
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
	
	/**INITIALIZE VARIABLES**/
	var isAdmin = $.cookie("isAdmin");
	merchantGUID = $.cookie("superGuid");
	KEY_ENC = $.cookie("pkey");
	var transactionId = $.cookie("transactionId");
	
	$(document).ready(function(){
		$("#vloader").modal("show");
		rawData = 'rowsperpage=6&page=0&callback=?&reqMemGuid='+merchantGUID+'&listType=detailList&tid='+transactionId;
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/admin/transaction/detail?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			$("#vloader").modal("hide");
			for(var i=0;i<data.data.detailList.length;i++){
				$("#detailTid").text(data.data.detailList[i].tid);
				$("#refId").text(data.data.detailList[i].refId);
				var creationDate = new Date(data.data.detailList[i].createDt);
				creationDate= creationDate.toUTCString();
				$("#createDate").text(creationDate);
				
				/*var transactionDate = new Date(data.data.detailList[i].trnsctnDt);
				transactionDate= transactionDate.toUTCString();
				*/
				/***Temporary replace transaction date with update date***/
				var transactionDate = dateTimeMinutesFunction(data.data.detailList[i].updateDt);
				$("#transactionDate").text(transactionDate);
				
				var completionDate = data.data.detailList[i].cmpltDt;
				
				if(completionDate =="undefined" || completionDate =="" || completionDate ==null){
					$("#completionDate").text("---");
				}else{
					$("#completionDate").text(dateTimeMinutesFunction(completionDate));
				}
				
				$("#payAmount").text(currencyFormat(data.data.detailList[i].payAmt));
				$("#payCurrency").text(data.data.detailList[i].payCrrncy);
				$("#originalAmount").text(currencyFormat(data.data.detailList[i].orgAmt));
				$("#originalCurrency").text(data.data.detailList[i].orgCrrncy);	
				
				$("#requesterGuid").text(data.data.detailList[i].reqMemGuid);
				$("#payerGuid").text(data.data.detailList[i].srcMemGuid);
				$("#senderGuid").text(data.data.detailList[i].orgMemGuid);
				$("#senderGuidHidden").val(data.data.detailList[i].orgMemGuid);
				$("#receiverGuid").text(data.data.detailList[i].dstMemGuid);
				
				if(data.data.detailList[i].exchangeRate == undefined ){
					$(".exchangeClass").hide();
				}else{
					$(".exchangeClass").show();
					$("#baseCurrency").text(data.data.detailList[i].exchangeSrcCrrncy);
					$("#destinationCurrency").text(data.data.detailList[i].exchangeDstCrrncy);
					$("#baseAmount").text(data.data.detailList[i].exchangeSrcAmt);
					$("#destinationAmount").text(data.data.detailList[i].exchangeDstAmt);
					$("#exchangeRate").text(data.data.detailList[i].exchangeRate);
					$("#exchangeAmountResult").text(data.data.detailList[i].exchangeResultAmt);
				}
			}
			
			/***Requester****/
			var requesterGuid = $("#requesterGuid").text();
			rawData = 'callback=?&reqMemGuid='+merchantGUID+'&dstMemGuid='+requesterGuid;
			param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
			url = TARGET_URI+'v5a/member/privateInfo?_method=GET&';
			method = 'GET';
			AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
				if (data.data.result.namesList != undefined && data.data.result.namesList != null && data.data.result.namesList !='') {
					for(var i=0;i<data.data.result.namesList.length;i++){
						 $("#requesterName").text(data.data.result.namesList[0].fullname);
					};
				}else{}
				
				if (data.data.result.phonesList != undefined && data.data.result.phonesList != null && data.data.result.phonesList !='') {
					for(var i=0;i<data.data.result.phonesList.length;i++){
						 $("#requesterPhone").text(data.data.result.phonesList[0].phoneNo);
					};
				}else{};
				
				if (data.data.result.emailsList != undefined && data.data.result.emailsList != null && data.data.result.emailsList !='') {
					for(var i=0;i<data.data.result.emailsList.length;i++){
						 $("#requesterEmail").text(data.data.result.emailsList[0].emailAddrss);
					};
				}else{};
			
			});
			
			/***Payer Info***/
			var payerGuid = $("#payerGuid").text();
			rawData = 'callback=?&reqMemGuid='+merchantGUID+'&dstMemGuid='+payerGuid;
			param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
			url = TARGET_URI+'v5a/member/privateInfo?_method=GET&';
			method = 'GET';
			AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
				if (data.data.result.namesList != undefined && data.data.result.namesList != null && data.data.result.namesList !='') {
					for(var i=0;i<data.data.result.namesList.length;i++){
						 $("#payerName").text(data.data.result.namesList[0].fullname);
						 $("#payerPriority").text(data.data.result.namesList[0].priority);
					};
				}else{};
				
				if (data.data.result.phonesList != undefined && data.data.result.phonesList != null && data.data.result.phonesList !='') {
					for(var i=0;i<data.data.result.phonesList.length;i++){
						 $("#payerPhone").text(data.data.result.phonesList[0].phoneNo);
					};
				}else{};
				
				if (data.data.result.emailsList != undefined && data.data.result.emailsList != null && data.data.result.emailsList !='') {
					for(var i=0;i<data.data.result.emailsList.length;i++){
						 $("#payerEmail").text(data.data.result.emailsList[0].emailAddrss);
					};
				}else{};
				
				if (data.data.result.virtualAccnt != undefined && data.data.result.virtualAccnt != null && data.data.result.virtualAccnt !='') {
				//for(var i=0;i<data.data.result.virtualAccnt.length;i++){
					 $("#payerVaccountNo").text(data.data.result.virtualAccnt.accntNo);
					 $("#payerVaccountBankCode").text(data.data.result.virtualAccnt.bnkCd);
				//};
				}else{};
				
				if (data.data.result.bnkAccnt != undefined && data.data.result.bnkAccnt != null && data.data.result.bnkAccnt !='') {
					for(var i=0;i<data.data.result.bnkAccnt.length;i++){
						 $("#payerBankAccountNo").text(data.data.result.bnkAccnt[0].accntNo);
						 $("#payerBankCode").text(data.data.result.bnkAccnt[0].bnkCd);
					}
				}else{};
			});
			
			/***Sender Info***/
			var orgGuid = $("#senderGuidHidden").val();
			if($("#senderGuidHidden").val()==''){$(".senderClass").hide();}
			else{
				$(".senderClass").show();
				rawData = 'callback=?&reqMemGuid='+merchantGUID+'&dstMemGuid='+orgGuid;
				param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
				url = TARGET_URI+'v5a/member/privateInfo?_method=GET&';
				method = 'GET';
				AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
					if (data.data.result.namesList != undefined && data.data.result.namesList != null && data.data.result.namesList !='') {
						for(var i=0;i<data.data.result.namesList.length;i++){
							 $("#senderName").text(data.data.result.namesList[0].fullname);
							 $("#senderPriority").text(data.data.result.namesList[0].priority);
						};
					}else{};
					
					if (data.data.result.phonesList != undefined && data.data.result.phonesList != null && data.data.result.phonesList !='') {
						for(var i=0;i<data.data.result.phonesList.length;i++){
							 $("#senderPhone").text(data.data.result.phonesList[0].phoneNo);
						};
					}else{};
					
					if (data.data.result.emailsList != undefined && data.data.result.emailsList != null && data.data.result.emailsList !='') {
						for(var i=0;i<data.data.result.emailsList.length;i++){
							 $("#senderEmail").text(data.data.result.emailsList[0].emailAddrss);
						}
					}else{};
					
					if (data.data.result.virtualAccnt != undefined && data.data.result.virtualAccnt != null && data.data.result.virtualAccnt !='') {
					//for(var i=0;i<data.data.result.virtualAccnt.length;i++){
						 $("#senderVaccountNo").text(data.data.result.virtualAccnt.accntNo);
						 $("#senderVaccountBankCode").text(data.data.result.virtualAccnt.bnkCd);
					//};
					}else{};
					
					if (data.data.result.bnkAccnt != undefined && data.data.result.bnkAccnt != null && data.data.result.bnkAccnt !='') {
						for(var i=0;i<data.data.result.bnkAccnt.length;i++){
							 $("#senderBankAccountNo").text(data.data.result.bnkAccnt[0].accntNo);
							 $("#senderBankCode").text(data.data.result.bnkAccnt[0].bnkCd);
						}
					}else{};
				});
			}
			
			/***Reciever Info***/
			var receiverGuid = $("#receiverGuid").text();
			rawData = 'callback=?&reqMemGuid='+merchantGUID+'&dstMemGuid='+receiverGuid;
			param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
			url = TARGET_URI+'v5a/member/privateInfo?_method=GET&';
			method = 'GET';
			AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
				
				if (data.data.result.namesList != undefined && data.data.result.namesList != null && data.data.result.namesList !='') {
					for(var i=0;i<data.data.result.namesList.length;i++){
						 $("#receiverName").text(data.data.result.namesList[0].fullname);
						 $("#receiverPriority").text(data.data.result.namesList[0].priority);
					};
				}else{};
				
				if (data.data.result.phonesList != undefined && data.data.result.phonesList != null && data.data.result.phonesList !='') {
					for(var i=0;i<data.data.result.phonesList.length;i++){
						 $("#receiverPhone").text(data.data.result.phonesList[0].phoneNo);
					};
				}else{};
				
				if (data.data.result.emailsList != undefined && data.data.result.emailsList != null && data.data.result.emailsList !='') {
					for(var i=0;i<data.data.result.emailsList.length;i++){
						 $("#receiverEmail").text(data.data.result.emailsList[0].emailAddrss);
					};
				}else{};
				
				if (data.data.result.virtualAccnt != undefined && data.data.result.virtualAccnt != null && data.data.result.virtualAccnt !='') {
				//for(var i=0;i<data.data.result.virtualAccnt.length;i++){
					 $("#receiverVaccountNo").text(data.data.result.virtualAccnt.accntNo);
					 $("#receiverVaccountBankCode").text(data.data.result.virtualAccnt.bnkCd);
				//};
				}else{};
				
				if (data.data.result.bnkAccnt != undefined && data.data.result.bnkAccnt != null && data.data.result.bnkAccnt !='') {	 
					for(var i=0;i<data.data.result.bnkAccnt.length;i++){
						 $("#receiverBankAccountNo").text(data.data.result.bnkAccnt[0].accntNo);
						 $("#receiverBankCode").text(data.data.result.bnkAccnt[0].bnkCd);
					}
				}else{};
			});
			
			/******** Call Currency Exhange TODO 
			rawData = 'callback=?&reqMemGuid='+merchantGUID+'&tid='+transactionId;
			param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
			url = TARGET_URI+'v5/exchange/getTransactionExchange?_method=POST&';
			method = 'POST';
			
			AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
				for(var i=0;i<data.data.result.length;i++){
					$("#baseCurrency").text(data.data.result[i].srcCrrncy);
					$("#destinationCurrency").text(data.data.result[i].dstCrrncy);
					$("#baseAmount").text(data.data.result[i].srcAmt);
					$("#exchangeAmount").text(data.data.result[i].resultAmt);
					$("#margin").text(data.data.result[i].margin);
					$("#rate").text(data.data.result[i].rateBase);
					$("#fee").text(data.data.result[i].tid);
				}
			});
			
			********/
		});
		
		$(".transGuid").click(function(){
			var guid = $(this).text();
			$.cookie("destinationGuid", guid);
			PopupCenterDual('../transactionUI/detailContent_2.html','Member details','900','800');
		});
	});
	
