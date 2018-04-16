/**
 * @author athan
 */
/**URI host declaration and initialization **/
	$("a").tooltip();
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
	var nullResponse;
	var currentPage = 0;
	var memberDetailArr = [];
	/**INITIALIZE VARIABLES**/
	var isAdmin = $.cookie("isAdmin");
	merchantGUID = $.cookie("superGuid");
	KEY_ENC = $.cookie("pkey");
	var destinationGuid = $.cookie("destinationGuid");
	var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;
	var koreanLanguage = function(){
	$("#menuDashboard").text(DASHBOARD_KR);
	$("#menuTransaction").text(TRANSACTION_KR);
	$("#menuSeyfert").text(SEYFERT_KR);
	$("#menuMember").text(MEMBER_KR);
	$("#last24Hrs").text(LAST_24_HOURS_KR);
	$("#lastWeekTotal").text(LAST_WEEK_KR);
	$("#lastMonthTotal").text(LAST_MONTH_KR);
	$("#grandTotal").text(GRAND_TOTAL_KR);
	$("#memberRegfreq").text(MEMBER_REGISTRATION_FREQUENCY_KR);
	$("#hourChart").text(HOUR_KR);
	$("#dayChart").text(TODAY_KR);
	$("#weekChart").text(WEEK_KR);
	$("#emailVerifistatus").text(EMAIL_VERIFICATION_STATUS_KR);
	$("#phoneVerifistatus").text(PHONE_VERIFICATION_STATUS_KR);
	$("#mainmemberList").text(MEMBER_LIST_KR);
	$("#listAll").text(LIST_ALL_KR);
	$("#advance").text(ADVANCE_SEARCH_KR);
	$("#advanceSubSearch").text(SEARCH_KR);
	$("#memberSearch").text(MEMBER_SEARCH_KR);
	$("#advSearchTrigger").text(SEARCH_KR);
	$("#closeAdvSearchCon").text(CLOSE_KR);
	$("#labelGuid").text(GUID_KR);
	$("#labelName").text(NAME_KR);
	$("#labelEmail").text(EMAIL_KR);
	$("#labelPhone").text(PHONE_KR);
	$("#memberguid").text(GUID_KR);
	$("#membername").text(NAME_KR);
	$("#memberemail").text(EMAIL_KR);
	$("#memberphone").text(PHONE_KR);
	$("#memberlang").text(LANGUAGE_KR);
	$("#memberprio").text(PRIORITY_KR);
	$("#emailverifistat").text(EMAIL_VERIFICATION_STATUS_KR);
	$("#phoneverifistat").text(PHONE_VERIFICATION_STATUS_KR);
	$("#memberDtl").text(MEMBER_DETAIL_KR);
	$("#memberDetailComplete").text(COMPLETE_LIST_PER_GUID_KR);
	$("#memberDetailPhoneList").text(MEMBER_PHONE_LIST_KR);
	$("#memberDetailPhoneNum").text(PHONE_NUMBER_KR);
	$("#memberDetailPhoneType").text(PHONE_TYPE_KR);
	$("#memberDetailPCountry").text(COUNTRY_KR);
	$("#memberDetailVerifyStat").text(VERIFY_STATUS_KR);
	$("#memberDetailPVerifyStat").text(VERIFY_STATUS_KR);
	$("#memberDetailPPrio").text(PRIORITY_KR);
	$("#memberDetailMemEmailList").text(MEMBER_EMAIL_LIST_KR);
	$("#memberDetailEmail").text(EMAIL_KR);
	$("#memberDetailEmailType").text(EMAIL_TYPE_KR);
	$("#memberDetailEVerifyStat").text(VERIFY_STATUS_KR);
	$("#memberDetailEPrio").text(PRIORITY_KR);
	$("#memberDetailMemAddressList").text(MEMBER_ADDRESS_LIST_KR);
	$("#memberDetailAddress").text(ADDRESS_KR);
	$("#memberDetailStreet").text(STREET_KR);
	$("#memberDetailCity").text(CITY_KR);
	$("#memberDetailCountry").text(COUNTRY_KR);
	$("#memberDetailAddressType").text(ADDRESS_TYPE_KR);
	$("#memberDetailVirAccList").text(VIRTUAL_ACCOUNT_LIST_KR);
	$("#memberDetailVirAccNo").text(ACCOUNT_NO_KR);
	$("#memberDetailVirAccBank").text(BANK_KR);
	$("#memberDetailVirAccKYC").text(KYC_KR);
	$("#memberDetailRealAccList").text(REAL_ACCOUNT_LIST_KR);
	$("#memberDetailRealAccNo").text(ACCOUNT_NO_KR);
	$("#memberDetailRealAccBank").text(BANK_KR);
	$("#memberDetailRealAccCountry").text(COUNTRY_KR);
	$("#memberDetailRealAccPrio").text(PRIORITY_KR);
};

var englishLanguage = function(){
	$("#menuDashboard").text(DASHBOARD_EN);
	$("#menuTransaction").text(TRANSACTION_EN);
	$("#menuSeyfert").text(SEYFERT_EN);
	$("#menuMember").text(MEMBER_EN);
	$("#last24Hrs").text(LAST_24_HOURS_EN);
	$("#lastWeekTotal").text(LAST_WEEK_EN);
	$("#lastMonthTotal").text(LAST_MONTH_EN);
	$("#grandTotal").text(GRAND_TOTAL_EN);
	$("#memberRegfreq").text(MEMBER_REGISTRATION_FREQUENCY_EN);
	$("#hourChart").text(HOUR_EN);
	$("#dayChart").text(TODAY_EN);
	$("#weekChart").text(WEEK_EN);
	$("#emailVerifistatus").text(EMAIL_VERIFICATION_STATUS_EN);
	$("#phoneVerifistatus").text(PHONE_VERIFICATION_STATUS_EN);
	$("#mainmemberList").text(MEMBER_LIST_EN);
	$("#listAll").text(LIST_ALL_EN);
	$("#advance").text(ADVANCE_SEARCH_EN);
	$("#advanceSubSearch").text(SEARCH_EN);
	$("#memberSearch").text(MEMBER_SEARCH_EN);
	$("#advSearchTrigger").text(SEARCH_EN);
	$("#closeAdvSearchCon").text(CLOSE_EN);
	$("#labelGuid").text(GUID_EN);
	$("#labelName").text(NAME_EN);
	$("#labelEmail").text(EMAIL_EN);
	$("#labelPhone").text(PHONE_EN);
	$("#memberguid").text(GUID_EN);
	$("#membername").text(NAME_EN);
	$("#memberemail").text(EMAIL_EN);
	$("#memberphone").text(PHONE_EN);
	$("#memberlang").text(LANGUAGE_EN);
	$("#memberprio").text(PRIORITY_EN);
	$("#emailverifistat").text(EMAIL_VERIFICATION_STATUS_EN);
	$("#phoneverifistat").text(PHONE_VERIFICATION_STATUS_EN);
	$("#memberDtl").text(MEMBER_DETAIL_EN);
	$("#memberDetailComplete").text(COMPLETE_LIST_PER_GUID_EN);
	$("#memberDetailPhoneList").text(MEMBER_PHONE_LIST_EN);
	$("#memberDetailPhoneNum").text(PHONE_NUMBER_EN);
	$("#memberDetailPhoneType").text(PHONE_TYPE_EN);
	$("#memberDetailPCountry").text(COUNTRY_EN);
	$("#memberDetailVerifyStat").text(VERIFY_STATUS_EN);
	$("#memberDetailPVerifyStat").text(VERIFY_STATUS_EN);
	$("#memberDetailPPrio").text(PRIORITY_EN);
	$("#memberDetailMemEmailList").text(MEMBER_EMAIL_LIST_EN);
	$("#memberDetailEmail").text(EMAIL_EN);
	$("#memberDetailEmailType").text(EMAIL_TYPE_EN);
	$("#memberDetailEVerifyStat").text(VERIFY_STATUS_EN);
	$("#memberDetailEPrio").text(PRIORITY_EN);
	$("#memberDetailMemAddressList").text(MEMBER_ADDRESS_LIST_EN);
	$("#memberDetailAddress").text(ADDRESS_EN);
	$("#memberDetailStreet").text(STREET_EN);
	$("#memberDetailCity").text(CITY_EN);
	$("#memberDetailCountry").text(COUNTRY_EN);
	$("#memberDetailAddressType").text(ADDRESS_TYPE_EN);
	$("#memberDetailVirAccList").text(VIRTUAL_ACCOUNT_LIST_EN);
	$("#memberDetailVirAccNo").text(ACCOUNT_NO_EN);
	$("#memberDetailVirAccBank").text(BANK_EN);
	$("#memberDetailVirAccKYC").text(KYC_EN);
	$("#memberDetailRealAccList").text(REAL_ACCOUNT_LIST_EN);
	$("#memberDetailRealAccNo").text(ACCOUNT_NO_EN);
	$("#memberDetailRealAccBank").text(BANK_EN);
	$("#memberDetailRealAccCountry").text(COUNTRY_EN);
	$("#memberDetailRealAccPrio").text(PRIORITY_EN);
};	

var bankKoreanLanguage = function(){
	$("#memberListTitle").text(REGISTERED_BANK_LIST_KR);
	$("#dtlBankAccountNo").text(DTL_ACCOUNT_NO_KR);
	$("#dtlBank").text(DTL_BANK_KR);
	$("#dtlCountry").text(DTL_COUNTRY_CODE_KR);
	$("#dtlPriority").text(DTL_PRIORITY_KR);
};

var bankEnglishLanguage = function(){
	$("#memberListTitle").text(REGISTERED_BANK_LIST_EN);
	$("#dtlBankAccountNo").text(DTL_ACCOUNT_NO_EN);
	$("#dtlBank").text(DTL_BANK_EN);
	$("#dtlCountry").text(DTL_COUNTRY_CODE_EN);
	$("#dtlPriority").text(DTL_PRIORITY_EN);
};

var nameKoreanLanguage = function(){
	$("#memberListTitle").text(REGISTERED_NAME_LIST_KR);
	$("#dtl_name").text(DTL_NAME_KR);
	$("#dtl_nameLangCode").text(DTL_LANG_CODE_KR);
	$("#dtl_nameStatus").text(DTL_STATUS_KR);
	$("#dtl_namePriority").text(DTL_PRIORITY_KR);
};

var nameEnglishLanguage = function(){
	$("#memberListTitle").text(REGISTERED_NAME_LIST_EN);
	$("#dtl_name").text(DTL_NAME_EN);
	$("#dtl_nameLangCode").text(DTL_LANG_CODE_EN);
	$("#dtl_nameStatus").text(DTL_STATUS_EN);
	$("#dtl_namePriority").text(DTL_PRIORITY_EN);
};

var emailKoreanLanguage = function(){
	$("#memberListTitle").text(REGISTERED_EMAIL_LIST_KR);
	$("#dtlEmail").text(DTL_EMAIL_KR);
	$("#dtlEmailType").text(DTL_TYPE_KR);
	$("#dtlEmailCountryCode").text(DTL_COUNTRY_CODE_KR);
	$("#dtlEmailPriority").text(DTL_PRIORITY_KR);
	$("#dtlEmailStatus").text(DTL_STATUS_KR);
};

var emailEnglishLanguage = function(){
	$("#memberListTitle").text(REGISTERED_EMAIL_LIST_EN);
	$("#dtlEmail").text(DTL_EMAIL_EN);
	$("#dtlEmailType").text(DTL_TYPE_EN);
	$("#dtlEmailCountryCode").text(DTL_COUNTRY_CODE_EN);
	$("#dtlEmailPriority").text(DTL_PRIORITY_EN);
	$("#dtlEmailStatus").text(DTL_STATUS_EN);
};

var phoneKoreanLanguage = function(){
	$("#memberListTitle").text(REGISTERED_PHONE_LIST_KR);
	$("#dtlPhone").text(DTL_PHONE_KR);
	$("#dtlPhoneType").text(DTL_TYPE_KR);
	$("#dtlPhoneCountry").text(DTL_COUNTRY_CODE_KR);
	$("#dtlPhonePriority").text(DTL_PRIORITY_KR);
	$("#dtlPhoneStatus").text(DTL_STATUS_KR);
};

var phoneEnglishLanguage = function(){
	$("#memberListTitle").text(REGISTERED_PHONE_LIST_EN);
	$("#dtlPhone").text(DTL_PHONE_EN);
	$("#dtlPhoneType").text(DTL_TYPE_EN);
	$("#dtlPhoneCountry").text(DTL_COUNTRY_CODE_EN);
	$("#dtlPhonePriority").text(DTL_PRIORITY_EN);
	$("#dtlPhoneStatus").text(DTL_STATUS_EN);
};

var addressKoreanLanguage = function(){
	$("#memberListTitle").text(REGISTERED_ADDRESS_LIST_KR);
	$("#dtlAddress").text(DTL_ADDRESS_KR);
	$("#dtlAddressStreet").text(DTL_STREET_KR);
	$("#dtlAddressCity").text(DTL_CITY_KR);
	$("#dtlAddressCountry").text(DTL_COUNTRY_CODE_KR);
	$("#dtlAddressType").text(DTL_TYPE_KR);
};

var addressEnglishLanguage = function(){
	$("#memberListTitle").text(REGISTERED_ADDRESS_LIST_EN);
	$("#dtlAddress").text(DTL_ADDRESS_EN);
	$("#dtlAddressStreet").text(DTL_STREET_EN);
	$("#dtlAddressCity").text(DTL_CITY_EN);
	$("#dtlAddressCountry").text(DTL_COUNTRY_CODE_EN);
	$("#dtlAddressType").text(DTL_TYPE_EN);
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
	
	
$(document).ready(function(){
	$("#vloader").modal("show");
	rawData = 'callback=?&reqMemGuid='+merchantGUID+'&dstMemGuid='+destinationGuid;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/member/privateInfo?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		/**Capture all data object list****/
		var nameList = data.data.result.namesList;
		var phoneList = data.data.result.phonesList;
		var emailList = data.data.result.emailsList;
		var addressList = data.data.result.addrssList;
		var bankList = data.data.result.bnkAccnt;
		var vAccountList = data.data.result.virtualAccnt;
		$("#guidData").text(destinationGuid);
		displayNameList(nameList);
		displayPhoneList(phoneList);
		displayEmailList(emailList);
		displayAddressList(addressList);
		displayBankList(bankList);
		displayVAccountList(vAccountList);
		$("#vloader").modal("hide");
	});
});
	
var displayBankList = function(displayBankList){
	var memberBankAccount = [];
	if (displayBankList != undefined && displayBankList != null && displayBankList !='') {
		for(var i=0;i<displayBankList.length;i++){
			$("#bankAccountNo").text(displayBankList[0].accntNo);
			$("#bank").text(displayBankList[0].bnkCd);
			$("#bankCountry").text(displayBankList[0].cntryCd);
			$("#bankPriority").text(displayBankList[0].priority);
		}
	}
	else{
		$("#bankAccountNo").text("Bank Account not existed.");
		$("#bank").text("******");
		$("#bankCountry").text("******");
		$("#bankPriority").text("******");
	};	
	
	
	var bankListLength = displayBankList.length;
	$("#viewMoreBank").html(bankListLength);
	
	$("#viewMoreBank").click(function(){
		var bankListArr = [];
		bankListArr.push("<table style='width:100%' class='footable table-striped'>");
		bankListArr.push("<thead>");
		bankListArr.push("<tr style='height:30px;background-color:#586B7D;color:#ffffff;'>");
		bankListArr.push("<th> <span style='position:relative;padding-left:2px;' id='dtlBankAccountNo'> Account.no </span> </th>");
		bankListArr.push("<th> <span id='dtlBank'> Bank </span> </th>");
		bankListArr.push("<th> <span id='dtlCountry'> Country </span> </th>");
		bankListArr.push("<th> <span id='dtlPriority'> Priority </span> </th>");
		bankListArr.push("</tr>");
		bankListArr.push("</thead>");
		bankListArr.push("<tbody>");
		for(var k=0;k<displayBankList.length;k++){
			bankListArr.push("<tr style='height:30px;color:#666666;'>");
			bankListArr.push("<td>"+displayBankList[k].accntNo+"</td>");
			bankListArr.push("<td> "+displayBankList[k].bnkCd+" </td>");
			bankListArr.push("<td> "+displayBankList[k].cntryCd+" </td>");
			bankListArr.push("<td> "+displayBankList[k].priority+" </td>");
			bankListArr.push("</tr>");
		}
		
		$("#memberListContainer").empty();
		$("#memberListContainer").html(bankListArr.join(""));
		
		if (cookieLanguage != undefined && cookieLanguage != null) {
			if (cookieLanguage == "korean"){
				bankKoreanLanguage();
			}else{
				bankEnglishLanguage();
			}
		}else{
			if(BROWSER_LANG == "en-US" || BROWSER_LANG == "en"){
				bankEnglishLanguage();
			}
			else{
				bankKoreanLanguage();
			};	
		};
		
		
	});
};

var displayVAccountList = function(vAccountList){
	var memberVaccount = [];
	if (vAccountList != undefined && vAccountList != null && vAccountList != '') {
		$("#vAccountNo").text(vAccountList.accntNo);
		$("#vBank").text(vAccountList.bnkCd);
		$("#vKyc").text(vAccountList.kycVAccnt);
	}
	else{
		$("#vAccountNo").text("Virtual Account not existed.");
		$("#vBank").text("******");
		$("#vKyc").text("******");
	};
};	

var displayNameList = function(nameList){
	if (nameList != undefined && nameList != null && nameList != '') {
		for(var i=0;i<nameList.length;i++){
			var verify = nameList[i].verify;
			var verifySt = "";
			if (verify != undefined && verify != null && verify.verifySt != undefined && verify.verifySt != null)
			{
				verifySt = verify.verifySt;	
			}
			
			$("#memFullName").text(nameList[0].fullname);
			$("#nameLangCode").text(nameList[0].langCd);
			$("#nameVerifyStatus").text(verifySt);
			$("#namePriority").text(nameList[0].priority);
		}
	}else{
			$("#memFullName").text("name info not exist");
			$("#nameLangCode").text("******");
			$("#nameVerifyStatus").text("******");
			$("#namePriority").text("******");
	};
	
	var nameListLength = nameList.length;
	$("#viewMoreName").text(nameListLength);
	
	 $("#viewMoreName").click(function(){
	 		var nameListArr = [];
			nameListArr.push("<table table style='width:100%' class='footable table-striped'>");
			nameListArr.push("<thead>");
			nameListArr.push("<tr style='height:30px;background-color:#586B7D;color:#ffffff;'>");
			nameListArr.push("<th><span style='position:relative;padding-left:2px;' id='dtl_name'> Name </span></th>");
			nameListArr.push("<th><span id='dtl_nameLangCode'> Lang code </span> </th>");
			nameListArr.push("<th><span id='dtl_nameStatus'> Status </span> </th>");
			nameListArr.push("<th><span id='dtl_namePriority'> Priority </span> </th>");
			nameListArr.push("</tr>");
			nameListArr.push("</thead>");
			nameListArr.push("<tbody>");
			
			for(var k=0;k<nameList.length;k++){
				nameListArr.push("<tr style='height:30px;color:#666666;'>");
				nameListArr.push("<td> <strong> "+nameList[k].fullname+" </strong> </td>");
				nameListArr.push("<td> "+nameList[k].langCd+" </td>");
				var verify = nameList[k].verify;
				var verifySt = "";
				if (verify != undefined && verify != null && verify.verifySt != undefined && verify.verifySt != null)
				{
					verifySt = verify.verifySt;	
				}
				
				nameListArr.push("<td> "+verifySt+" </td>");
				nameListArr.push("<td> "+nameList[k].priority+" </td>");
				nameListArr.push("</tr>");	
			}
			nameListArr.push("</tbody>");
			nameListArr.push("</table>");
			
			$("#memberListContainer").empty();
			$("#memberListContainer").html(nameListArr.join(""));
			
			if (cookieLanguage != undefined && cookieLanguage != null) {
				if (cookieLanguage == "korean"){
					nameKoreanLanguage();
				}else{
					nameEnglishLanguage();
				}
			}else{
				if(BROWSER_LANG == "en-US" || BROWSER_LANG == "en"){
					nameEnglishLanguage();
				}
				else{
					nameKoreanLanguage();
				};	
			};
	});
};

var displayEmailList = function(emailList){
	var memberEmailList = [];
	if (emailList != undefined && emailList != null && emailList != '') {
		for(var i=0;i<emailList.length;i++){
			$("#memEmail").text(emailList[0].emailAddrss);
			$("#memEmailType").text(emailList[0].emailTp);
			$("#memEmailPriority").text(emailList[0].priority);
			
			var verify = emailList[i].verify;
			var verifySt = "";
			if (verify != undefined && verify != null && verify.verifySt != undefined && verify.verifySt != null)
			{
				verifySt = verify.verifySt;	
			}
			
			$("#memEmailVerifySatatus").text(verifySt);	
		}
	}else{
			$("#memEmail").text("Email info not exist");
			$("#memEmailType").text("******");
			$("#memEmailPriority").text("******");
			$("#memEmailVerifySatatus").text("******");
	};
	
	var emailListLength = emailList.length;
	$("#viewMoreEmail").html(emailListLength);
	
	$("#viewMoreEmail").click(function(){
		var emailListArr = [];
		emailListArr.push("<table table style='width:100%' class='footable table-striped'>");
		emailListArr.push("<thead>");
		emailListArr.push("<tr style='height:30px;background-color:#586B7D;color:#ffffff;'>");
		emailListArr.push("<th> <span style='position:relative;padding-left:2px;' id='dtlEmail'> Email </span> </th>");
		emailListArr.push("<th> <span id='dtlEmailType'> Type </span> </th>");
		emailListArr.push("<th> <span id='dtlEmailCountryCode'> Country Code </span> </th>");
		emailListArr.push("<th> <span id='dtlEmailPriority'> Priority </span></th>");
		emailListArr.push("<th> <span id='dtlEmailStatus'> Status </span></th>");
		emailListArr.push("</tr>");
		emailListArr.push("</thead>");
		emailListArr.push("<tbody>");
		
		for(var k=0;k<emailList.length;k++){
			emailListArr.push("<tr style='height:30px;color:#666666;'>");
			emailListArr.push("<td> "+emailList[k].emailAddrss+" </td>");
			emailListArr.push("<td> "+emailList[k].emailTp+" </td>");
			emailListArr.push("<td> "+emailList[k].cntryCd+" </td>");
			emailListArr.push("<td> "+emailList[k].priority+" </td>");
			var verify = emailList[k].verify;
			var verifySt = "";
			if (verify != undefined && verify != null && verify.verifySt != undefined && verify.verifySt != null)
			{
				verifySt = verify.verifySt;	
			}
			emailListArr.push("<td> "+verifySt+" </td>");
			emailListArr.push("</tr>");	
		}
		emailListArr.push("</tbody>");
		emailListArr.push("</table>");
		
		$("#memberListContainer").empty();
		$("#memberListContainer").html(emailListArr.join(""));
		
		if (cookieLanguage != undefined && cookieLanguage != null) {
			if (cookieLanguage == "korean"){
				emailKoreanLanguage();
			}else{
				emailEnglishLanguage();
			}
		}else{
			if(BROWSER_LANG == "en-US" || BROWSER_LANG == "en"){
				emailEnglishLanguage();
			}
			else{
				emailKoreanLanguage();
			};	
		};
		
	});
};

var displayPhoneList = function(phoneList){
	var memberPhoneList = [];
	if (phoneList != undefined && phoneList != null && phoneList != '') {
		for(var i=0;i<phoneList.length;i++){
			$("#memPhoneNo").text(phoneList[0].phoneNo);
			$("#memPhoneType").text(phoneList[0].phoneTp);
			$("#memPhoneCountry").text(phoneList[0].cntryCd);
			$("#memPhonePriority").text(phoneList[0].priority);
			var verify = phoneList[i].verify;
			var verifySt = "";
			if (verify != undefined && verify != null && verify.verifySt != undefined && verify.verifySt != null)
			{
				verifySt = verify.verifySt;	
			}
			
			$("#memPhoneVerifySatatus").text(verifySt);
		}
	}else{
			$("#memPhoneNo").text("phone info not exist");
			$("#memPhoneType").text("******");
			$("#memPhoneCountry").text("******");
			$("#memPhonePriority").text("******");
			$("#memPhoneVerifySatatus").text("******");
	};
	
	var phoneListLength = phoneList.length;
	$("#viewMorePhone").html(phoneListLength);
	
	$("#viewMorePhone").click(function(){
			$(this).attr("data-target","#myModal");
			var phoneListArr = [];
			phoneListArr.push("<table style='width:100%' class='footable table-striped'>");
			phoneListArr.push("<thead>");
			phoneListArr.push("<tr style='height:30px;background-color:#586B7D;color:#ffffff;'>");
			phoneListArr.push("<th> <span style='position:relative;padding-left:2px;' id='dtlPhone''> Phone </span> </th>");
			phoneListArr.push("<th> <span id='dtlPhoneType'> Type </span> </th>");
			phoneListArr.push("<th> <span id='dtlPhoneCountry'> Country Code </span> </th>");
			phoneListArr.push("<th> <span id='dtlPhonePriority'> Priority </span> </th>");
			phoneListArr.push("<th> <span id='dtlPhoneStatus'> Status </span> </th>");
			phoneListArr.push("</tr>");
			phoneListArr.push("</thead>");
			phoneListArr.push("<tbody>");
			
			for(var k=0;k<phoneList.length;k++){
				phoneListArr.push("<tr  style='height:30px;color:#666666;'>");
				phoneListArr.push("<td> "+phoneList[k].phoneNo+"</td>");
				phoneListArr.push("<td> "+phoneList[k].phoneTp+" </td>");
				phoneListArr.push("<td> "+phoneList[k].cntryCd+" </td>");
				phoneListArr.push("<td> "+phoneList[k].priority+" </td>");
				var verify = phoneList[k].verify;
				var verifySt = "";
				if (verify != undefined && verify != null && verify.verifySt != undefined && verify.verifySt != null)
				{
					verifySt = verify.verifySt;	
				}
				phoneListArr.push("<td> "+verifySt+" </td>");
				phoneListArr.push("</tr>");	
			}
			phoneListArr.push("</tbody>");
			phoneListArr.push("</table>");
			
			$("#memberListContainer").empty();
			$("#memberListContainer").html(phoneListArr.join(""));
			
			if (cookieLanguage != undefined && cookieLanguage != null) {
				if (cookieLanguage == "korean"){
					phoneKoreanLanguage();
				}else{
					phonekEnglishLanguage();
				}
			}else{
				if(BROWSER_LANG == "en-US" || BROWSER_LANG == "en"){
					phoneEnglishLanguage();
				}
				else{
					phoneKoreanLanguage();
				};	
			};
			
	});
};

var displayAddressList = function(addressList){
	var memberAddressList = [];
	if (addressList != undefined && addressList != null && addressList != '') {
		for(var i=0;i<addressList.length;i++){
			$("#memAddress").text(addressList[0].addrss1);
			$("#memAddressStreet").text(addressList[0].addrss2);
			$("#memCity").text(addressList[0].city);
			$("#memCountry").text(addressList[0].cntryCd);
			$("#memAddressType").text(addressList[0].addrssTp);
		}
	}else{
			$("#memAddress").text("address info not exist");
			$("#memAddressStreet").text("******");
			$("#memCity").text("******");
			$("#memCountry").text("******");
			$("#memAddressType").text("******");
	};
	
	var addressListLength = addressList.length;
	$("#viewMoreAddress").html(addressListLength);
	
	$("#viewMoreAddress").click(function(){
		var addressListArr = [];
		addressListArr.push("<table style='width:100%' class='footable table-striped'>");
		addressListArr.push("<thead>");
		addressListArr.push("<tr  style='height:30px;background-color:#586B7D;color:#ffffff;'>");
		addressListArr.push("<th> <span style='position:relative;padding-left:2px;' id='dtlAddress'> Address </span> </th>");
		addressListArr.push("<th> <span id='dtlAddressStreet'> Street </span> </th>");
		addressListArr.push("<th> <span id='dtlAddressCity'> City </span> </th>");
		addressListArr.push("<th> <span id='dtlAddressCountry'> Country </span> </th>");
		addressListArr.push("<th> <span id='dtlAddressType'> Type </span> </th>");
		addressListArr.push("</tr>");
		addressListArr.push("</thead>");
		addressListArr.push("<tbody>");
		
		for(var k=0;k<addressList.length;k++){
			addressListArr.push("<tr style='height:30px;color:#666666;'>");
			addressListArr.push("<td>"+addressList[k].addrss1+" </td>");
			addressListArr.push("<td> "+addressList[k].addrss2+" </td>");
			addressListArr.push("<td> "+addressList[k].city+" </td>");
			addressListArr.push("<td> "+addressList[k].cntryCd+" </td>");
			addressListArr.push("<td> "+addressList[k].addrssTp+" </td>");
			addressListArr.push("</tr>");	
		}
		addressListArr.push("</tbody>");
		addressListArr.push("</table>");
		
		$("#memberListContainer").empty();
		$("#memberListContainer").html(addressListArr.join(""));
		
		if (cookieLanguage != undefined && cookieLanguage != null) {
			if (cookieLanguage == "korean"){
				addressKoreanLanguage();
			}else{
				addressEnglishLanguage();
			}
		}else{
			if(BROWSER_LANG == "en-US" || BROWSER_LANG == "en"){
				addressEnglishLanguage();
			}
			else{
				addressKoreanLanguage();
			};	
		};
		
	});
};
