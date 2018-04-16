/**
 * @author athan
 */

var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";
var num = 1;
var rowsPerPage = $("#rowsPerPage").val();
var bits = 256;
var merchantGUID = $.cookie("superGuid");
var KEY_ENC = $.cookie("pkey");
var formData;
var param;
var method = 'GET';
var rawData;
var isAdmin = $.cookie("isAdmin");
var numberPattern = /^[0-9]*(?:\.\d{1,2})?$/;
var emailPAttern = /\S+@\S+\.\S+/;

$('#memberSearchForm').trigger("reset");
$('.footable').footable();

$("#memberSearchForm :input").val('');

if (HOST_URI == "dev5.paygate.net") {
	TARGET_URI = "https://dev5.paygate.net/";
}
if (HOST_URI == "stg5.paygate.net") {
	TARGET_URI = "https://stg5.paygate.net/";
}
if (HOST_URI == "v5.paygate.net") {
	TARGET_URI = "https://v5.paygate.net/";
}

/*if(typeof merchantGUID === 'undefined'){
 window.location.href = 'login.html';
 }
 */
$("#dstGuid").val('');
$("#fullname").val('');
$("#email").val('');
$("#phone").val('');

var memberListPage = function(page) {
	memberList(page);
};

var memberList = function(page) {
	$("#vloader").modal("show");
	if (page == null || page < 1) {
		page = 0;
	};

	currentPage = page;
	var searchParams = decodeURIComponent($("#memberSearchForm :input").filter(function(index, element) {
		return $(element).val() != "";
	}).serialize());

	if (searchParams == '' || searchParams == null) {
		rawData = 'callback=?&page=' + currentPage + '&limit=' + rowsPerPage + '&reqMemGuid=' + merchantGUID;
	} else {
		rawData = searchParams + '&callback=?&page=' + currentPage + '&limit=' + rowsPerPage + '&reqMemGuid=' + merchantGUID;
	}

	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/member/allInfo?_method=GET&';

	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var memberList = [];
		if (data.status != "SUCCESS") {
			if(data.data.cdKey=="API_REQ_CAN_NOT_BE_DECRYPTED"){
				alert(data.data.cdKey+":PLEASE LOGIN AGAIN");
				$.removeCookie("superGuid");
				$.removeCookie("pkey");
				$.removeCookie("isAdmin");
				
				$.cookie("superGuid", null, {
					path : '/',
					domain : 'paygate.net',
					secure : true
				});
				$.cookie("pkey", null, {
					path : '/',
					domain : 'paygate.net',
					secure : true
				});
				$.cookie("isAdmin", null, {
					path : '/',
					domain : 'paygate.net',
					secure : true
				});
	
				window.location = 'login.html';
			}
			else if (data.data.cdDesc == "SESSION_EXPIRED") {
				$.removeCookie("superGuid");
				$.removeCookie("pkey");
				$.removeCookie("isAdmin");
				//$.removeCookie("loadedPage");

				$.cookie("superGuid", null, {
					path : '/',
					domain : 'paygate.net',
					secure : true
				});
				$.cookie("pkey", null, {
					path : '/',
					domain : 'paygate.net',
					secure : true
				});
				$.cookie("isAdmin", null, {
					path : '/',
					domain : 'paygate.net',
					secure : true
				});

				window.location = 'login.html';
			} else {
				alert(data.data.cdDesc);
				$("#vloader").modal("hide");
			}
		} else {
			if (data.data.resultList.length <= 0) {
				memberList.push("<tr class='gradeX' style='height:30px;'> <td colspan=7 style=text-align:center;color:red> <strong> Sorry there is no data available. </strong> </td></tr>");
				$("#memberList").html(memberList.join(''));
			} else {
				for (var i = 0; i < data.data.resultList.length; i++) {
					memberList.push("<tr style='height:30px;'>");
					memberList.push("<td style=cursor:pointer;color:#586B7D><strong class='getMemberDetail' data-placement='top' data-toggle='tooltip' href='#' data-original-title='view detail'>" + data.data.resultList[i].guid + "</strong></td>");
					if (data.data.resultList[i].fullname == null || data.data.resultList[i].fullname == "undefined") {
						memberList.push("<td data-hide='phone,tablet'><i class='fa fa-bookmark'></i> not available</td>");
					} else {
						memberList.push("<td data-hide='phone,tablet'><i class='fa fa-bookmark'></i> " + data.data.resultList[i].fullname + "</td>");
					}

					if (data.data.resultList[i].email_addrss == null || data.data.resultList[i].email_addrss == "undefined") {
						memberList.push("<td data-hide='phone,tablet'><i class='fa fa-bookmark'></i> not available</td>");
					} else {
						memberList.push("<td data-hide='phone,tablet'><i class='fa fa-bookmark'></i> " + data.data.resultList[i].email_addrss + "</td>");
					}

					if (data.data.resultList[i].phone_no == null || data.data.resultList[i].phone_no == "undefined") {
						memberList.push("<td data-hide='phone,tablet'> not available</td>");
					} else {
						memberList.push("<td data-hide='phone,tablet'>" + data.data.resultList[i].phone_no + "</td>");
					}

					memberList.push("</tr>");
				}

				$("#memberList").html(memberList.join(''));
			}
			$("#vloader").modal("hide");

			var total = $("#memberGrandTotal").text();
			var limitView = rowsPerPage * page;
			var paggingTxt = pagging_ajax(total, rowsPerPage, "memberListPage", page);
			$(".pagingCon").html(paggingTxt['start'] + paggingTxt['list'] + paggingTxt['end']);

			/**Get Detail Info**/
			$(".getMemberDetail").click(function() {
				var destinationGuid = $(this).text();
				$.cookie("destinationGuid", destinationGuid);
				PopupCenterDual('memberUI/detailContent.html', 'Member details', '900', '800');
			});
		};
		$('strong').tooltip();
	});
};

var BROWSER_LANG = window.navigator.userLanguage || window.navigator.language;

var koreanLanguage = function() {
	$("#memberguid").text(DESTINATION_MEMBER_GUID_KR);
	$("#statistics").text(STATISTICS_KR);
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
	$("#membername").text(NAME_KR);
	$("#memberemail").text(EMAIL_KR);
	$("#emailverifistat").text(EMAIL_VERIFICATION_STATUS_KR);
	$("#memberphone").text(PHONE_KR);
	$("#phoneverifistat").text(PHONE_VERIFICATION_STATUS_KR);
	$("#memberDtl").text(MEMBER_DETAIL_KR);
	$("#memberDetailComplete").text(COMPLETE_LIST_PER_GUID_KR);
	$("#memberDetailPhoneList").text(MEMBER_PHONE_LIST_KR);
	$("#memberDetailPhoneNum").text(PHONE_NUMBER_KR);
	$("#memberDetailPhoneType").text(PHONE_TYPE_KR);
	$("#memberDetailPCountry").text(COUNTRY_KR);
	$("#memberDetailPVerifyStat").text(VERIFY_STATUS_KR);
	$("#memberDetailPPrio").text(PRIORITY_KR);
	$("#memberDetailMemEmailList").text(MEMBER_EMAIL_LIST_KR);
	$("#memberDetailEmail").text(EMAIL_KR);
	$("#memberDetailEmailType").text(EMAIL_TYPE_KR);
	$("#memberDetailEVerifyStat").text(VERIFY_STATUS_KR);
	$("#memberDetailEPrio").text(PRIORITY_KR);

	$("#createMembers").text(CREATE_MEMBER_TAB_MENU_KR);
	$("#basicInfo").text(CREATE_MEMBER_TAB_BASIC_INFO_KR);

	$("#fullNameLabel").text(CREATE_MEMBER_TAB_FULL_NAME_KR);
	$("#languageLabel").text(CREATE_MEMBER_TAB_LANGUAGE_KR);
	$("#phoneNumberLabel").text(CREATE_MEMBER_TAB_PHONE_NUMBER_KR);
	$("#phoneCountryCodeLabel").text(CREATE_MEMBER_TAB_PHONE_COUNTRY_CODE_KR);
	$("#emailAddressLabel").text(CREATE_MEMBER_TAB_EMAIL_ADDRESS_KR);
	$("#createMemberFullName").attr("placeholder", CREATE_MEMBER_FULL_NAME_PLACE_HOLDER_KR);

	$("#addressInfo").text(CREATE_MEMBER_TAB_ADDRESS_INFO_KR);
	$("#countryLabel").text(CREATE_MEMBER_TAB_COUNTRY_KR);
	$("#cityLabel").text(CREATE_MEMBER_TAB_CITY_KR);
	$("#addressLine1Label").text(CREATE_MEMBER_TAB_ADDRESS_LINE1_KR);
	$("#addressLine2Label").text(CREATE_MEMBER_TAB_ADDRESS_LINE2_KR);
	$("#postalCodeLabel").text(CREATE_MEMBER_TAB_POSTAL_CODE_KR);

	$("#optionalInfo").text(CREATE_MEMBER_TAB_OPTIONAL_INFO_KR);
	$("#firtNameLabel").text(CREATE_MEMBER_TAB_FIRST_NAME_KR);
	$("#middleNameLabel").text(CREATE_MEMBER_TAB_MIDDLE_NAME_KR);
	$("#lastNameLabel").text(CREATE_MEMBER_TAB_LAST_NAME_KR);
	$("#addressTypeLabel").text(CREATE_MEMBER_TAB_ADDRESS_TYPE_KR);
	$("#stateLabel").text(CREATE_MEMBER_TAB_STATE_KR);

	$("#createMemberBut").text(CREATE_MEMBER_BUTTON_KR);
	$("#resetButton").text(CREATE_MEMBER_RESET_KR);

	$("#resultSuccessMessageTitle").text(RESULT_SUCCESS_MESSAGE_TITLE_KR);
	$("#resultErrorMessageTitle").text(RESULT_ERROR_MESSAGE_TITLE_KR);

	$("#assignMemberLoginCredentials").text(ASSIGN_LOGIN_CREDENTIALS_TAB_KR);
	$("#assignMemberLoginCredentialsTitle").text(ASSIGN_MEMBER_LOGIN_CREDENTIALS_TITLE_KR);
	$("#assignMemberLoginCredentialsMerchantGuid").text(ASSIGN_VIRTUAL_ACCOUNT_TAB_MERCHANT_GUID_KR);
	$("#createMemberLoginCredentialsFullName").text(CREATE_MEMBER_TAB_FULL_NAME_KR);
	$("#createMemberLoginCredentialsLoginId").text(ASSIGN_LOGIN_CREDENTIALS_LOGIN_ID_KR);
	$("#createMemberLoginCredentialsLanguage").text(CREATE_MEMBER_TAB_LANGUAGE_KR);
	$("#assignMemberCredentialsBut").text(ASSIGN_BANK_ACCOUNT_BUTTON_KR);
	$("#assignCredentialsWarningMessage").text(ASSIGN_MEMBER_LOGIN_CREDENTIALS_NOTICE_KR);
	$("#assignMemberCredentialRedirectBut").text(ASSIGN_MEMBER_LOGIN_CREDENTIALS_TITLE_KR);

	$("#assignVirtualAccountTitle").text(ASSIGN_VIRTUAL_ACCOUNT_TTILE_KR);
	$("#assignVirtualAccountMembers").text(ASSIGN_VIRTUAL_ACCOUNT_TAB_MENU_KR);
	$("#virtualAccountMerchantGuidLabel").text(ASSIGN_VIRTUAL_ACCOUNT_TAB_MERCHANT_GUID_KR);
	$("#virtualAccountBankLabel").text(ASSIGN_VIRTUAL_ACCOUNT_TAB_BANK_KR);
	$("#assignVirtualAccountMemberBut").text(ASSIGN_VIRTUAL_ACCOUNT_BUTTON_KR);

	$("#assignVirtualWarningMessage").text(ASSIGN_VIRTUAL_WARNING_MESSAGE_KR);
	$("#assignVirtualGuidLabel").text(ASSIGN_VIRTUAL_RESULT_GUID_LABEL_KR);
	$("#assignVirtualBankCodeLabel").text(ASSIGN_VIRTUAL_RESULT_BANK_CODE_LABEL_KR);
	$("#assignVirtualAccountLabel").text(ASSIGN_VIRTUAL_RESULT_ACCOUNT_LABEL_KR);

	$("#assignBankAccountTitle").text(ASSIGN_BANK_ACCOUNT_TITLE_KR);
	$("#assignBankMemberBut").text(ASSIGN_BANK_ACCOUNT_BUTTON_KR);
	$("#assignBankMembers").text(ASSIGN_BANK_ACCOUNT_TAB_MENU_KR);
	$("#bankAccountMerchantGuidLabel").text(ASSIGN_BANK_ACCOUNT_TAB_MERCHANT_GUID_KR);
	$("#bankAccountBankLabel").text(ASSIGN_BANK_ACCOUNT_TAB_BANK_KR);
	$("#bankAccountNumberLabel").text(ASSIGN_BANK_ACCOUNT_TAB_ACCOUNT_NUMBER_KR);
	$("#bankAccountCountryLabel").text(ASSIGN_BANK_ACCOUNT_TAB_COUNTRY_KR);

	$("#assignBankWarningMessage").text(ASSIGN_BANK_WARNING_MESSAGE_KR);
	$("#assignBankGuidLabel").text(ASSIGN_BANK_GUID_LABEL_KR);
	$("#assignBankCodeLabel").text(ASSIGN_BANK_CODE_LABEL_KR);
	$("#assignBankAccountNumberLabel").text(ASSIGN_BANK_ACCOUNT_LABEL_KR);

};

var englishLanguage = function() {
	$("#memberguid").text(DESTINATION_MEMBER_GUID_EN);
	$("#statistics").text(STATISTICS_EN);
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
	$("#membername").text(NAME_EN);
	$("#memberemail").text(EMAIL_EN);
	$("#emailverifistat").text(EMAIL_VERIFICATION_STATUS_EN);
	$("#memberphone").text(PHONE_EN);
	$("#phoneverifistat").text(PHONE_VERIFICATION_STATUS_EN);
	$("#memberDtl").text(MEMBER_DETAIL_EN);
	$("#memberDetailComplete").text(COMPLETE_LIST_PER_GUID_EN);
	$("#memberDetailPhoneList").text(MEMBER_PHONE_LIST_EN);
	$("#memberDetailPhoneNum").text(PHONE_NUMBER_EN);
	$("#memberDetailPhoneType").text(PHONE_TYPE_EN);
	$("#memberDetailPCountry").text(COUNTRY_EN);
	$("#memberDetailPVerifyStat").text(VERIFY_STATUS_EN);
	$("#memberDetailPPrio").text(PRIORITY_EN);
	$("#memberDetailMemEmailList").text(MEMBER_EMAIL_LIST_EN);
	$("#memberDetailEmail").text(EMAIL_EN);
	$("#memberDetailEmailType").text(EMAIL_TYPE_EN);
	$("#memberDetailEVerifyStat").text(VERIFY_STATUS_EN);
	$("#memberDetailEPrio").text(PRIORITY_EN);

	$("#createMembers").text(CREATE_MEMBER_TAB_MENU_EN);
	$("#basicInfo").text(CREATE_MEMBER_TAB_BASIC_INFO_EN);

	$("#fullNameLabel").text(CREATE_MEMBER_TAB_FULL_NAME_EN);
	$("#languageLabel").text(CREATE_MEMBER_TAB_LANGUAGE_EN);
	$("#phoneNumberLabel").text(CREATE_MEMBER_TAB_PHONE_NUMBER_EN);
	$("#phoneCountryCodeLabel").text(CREATE_MEMBER_TAB_PHONE_COUNTRY_CODE_EN);
	$("#emailAddressLabel").text(CREATE_MEMBER_TAB_EMAIL_ADDRESS_EN);
	$("#createMemberFullName").attr("placeholder", CREATE_MEMBER_FULL_NAME_PLACE_HOLDER_EN);

	$("#addressInfo").text(CREATE_MEMBER_TAB_ADDRESS_INFO_EN);
	$("#countryLabel").text(CREATE_MEMBER_TAB_COUNTRY_EN);
	$("#cityLabel").text(CREATE_MEMBER_TAB_CITY_EN);
	$("#addressLine1Label").text(CREATE_MEMBER_TAB_ADDRESS_LINE1_EN);
	$("#addressLine2Label").text(CREATE_MEMBER_TAB_ADDRESS_LINE2_EN);
	$("#postalCodeLabel").text(CREATE_MEMBER_TAB_POSTAL_CODE_EN);

	$("#optionalInfo").text(CREATE_MEMBER_TAB_OPTIONAL_INFO_EN);
	$("#firtNameLabel").text(CREATE_MEMBER_TAB_FIRST_NAME_EN);
	$("#middleNameLabel").text(CREATE_MEMBER_TAB_MIDDLE_NAME_EN);
	$("#lastNameLabel").text(CREATE_MEMBER_TAB_LAST_NAME_EN);
	$("#addressTypeLabel").text(CREATE_MEMBER_TAB_ADDRESS_TYPE_EN);
	$("#stateLabel").text(CREATE_MEMBER_TAB_STATE_EN);

	$("#createMemberBut").text(CREATE_MEMBER_BUTTON_EN);
	$("#resetButton").text(CREATE_MEMBER_RESET_EN);

	$("#resultSuccessMessageTitle").text(RESULT_SUCCESS_MESSAGE_TITLE_EN);
	$("#resultErrorMessageTitle").text(RESULT_ERROR_MESSAGE_TITLE_EN);

	$("#assignMemberLoginCredentials").text(ASSIGN_LOGIN_CREDENTIALS_TAB_EN);
	$("#assignMemberLoginCredentialsTitle").text(ASSIGN_MEMBER_LOGIN_CREDENTIALS_TITLE_EN);
	$("#assignMemberLoginCredentialsMerchantGuid").text(ASSIGN_VIRTUAL_ACCOUNT_TAB_MERCHANT_GUID_EN);
	$("#createMemberLoginCredentialsFullName").text(CREATE_MEMBER_TAB_FULL_NAME_EN);
	$("#createMemberLoginCredentialsLoginId").text(ASSIGN_LOGIN_CREDENTIALS_LOGIN_ID_EN);
	$("#createMemberLoginCredentialsLanguage").text(CREATE_MEMBER_TAB_LANGUAGE_EN);
	$("#assignMemberCredentialsBut").text(ASSIGN_BANK_ACCOUNT_BUTTON_EN);
	$("#assignCredentialsWarningMessage").text(ASSIGN_MEMBER_LOGIN_CREDENTIALS_NOTICE_EN);
	$("#assignMemberCredentialRedirectBut").text(ASSIGN_MEMBER_LOGIN_CREDENTIALS_TITLE_EN);

	$("#assignVirtualAccountTitle").text(ASSIGN_VIRTUAL_ACCOUNT_TTILE_EN);
	$("#assignVirtualAccountMembers").text(ASSIGN_VIRTUAL_ACCOUNT_TAB_MENU_EN);
	$("#virtualAccountMerchantGuidLabel").text(ASSIGN_VIRTUAL_ACCOUNT_TAB_MERCHANT_GUID_EN);
	$("#virtualAccountBankLabel").text(ASSIGN_VIRTUAL_ACCOUNT_TAB_BANK_EN);
	$("#assignVirtualAccountMemberBut").text(ASSIGN_VIRTUAL_ACCOUNT_BUTTON_EN);

	$("#assignVirtualWarningMessage").text(ASSIGN_VIRTUAL_WARNING_MESSAGE_EN);
	$("#assignVirtualGuidLabel").text(ASSIGN_VIRTUAL_RESULT_GUID_LABEL_EN);
	$("#assignVirtualBankCodeLabel").text(ASSIGN_VIRTUAL_RESULT_BANK_CODE_LABEL_EN);
	$("#assignVirtualAccountLabel").text(ASSIGN_VIRTUAL_RESULT_ACCOUNT_LABEL_EN);

	$("#assignBankAccountTitle").text(ASSIGN_BANK_ACCOUNT_TITLE_EN);
	$("#assignBankMemberBut").text(ASSIGN_BANK_ACCOUNT_BUTTON_EN);
	$("#assignBankMembers").text(ASSIGN_BANK_ACCOUNT_TAB_MENU_EN);
	$("#bankAccountMerchantGuidLabel").text(ASSIGN_BANK_ACCOUNT_TAB_MERCHANT_GUID_EN);
	$("#bankAccountBankLabel").text(ASSIGN_BANK_ACCOUNT_TAB_BANK_EN);
	$("#bankAccountNumberLabel").text(ASSIGN_BANK_ACCOUNT_TAB_ACCOUNT_NUMBER_EN);
	$("#bankAccountCountryLabel").text(ASSIGN_BANK_ACCOUNT_TAB_COUNTRY_EN);

	$("#assignBankWarningMessage").text(ASSIGN_BANK_WARNING_MESSAGE_EN);
	$("#assignBankGuidLabel").text(ASSIGN_BANK_GUID_LABEL_EN);
	$("#assignBankCodeLabel").text(ASSIGN_BANK_CODE_LABEL_EN);
	$("#assignBankAccountNumberLabel").text(ASSIGN_BANK_ACCOUNT_LABEL_EN);
};

var cookieLanguage = $.cookie("language");
if (cookieLanguage != undefined && cookieLanguage != null) {
	if (cookieLanguage == "korean") {
		koreanLanguage();
		$("#koreanLang").css("color", "#0088CC");
	} else {
		englishLanguage();
		$("#englishLang").css("color", "#0088CC");
	}
} else {
	if (BROWSER_LANG == "en-US" || BROWSER_LANG == "en") {
		englishLanguage();
		$("#englishLang").css("color", "#0088CC");
		$("#koreanLang").css("color", "");
	} else {
		koreanLanguage();
		$("#koreanLang").css("color", "#0088CC");
		$("#englishLang").css("color", "");
	};
};

/*$("#koreanLang").click(function() {
	$.cookie("language", "korean");
	$("#englishLang").css("color", "");
	$("#koreanLang").css("color", "#0088CC");
	koreanLanguage();
});

$("#englishLang").click(function() {
	$.cookie("language", "english");
	$("#englishLang").css("color", "#0088CC");
	$("#koreanLang").css("color", "");
	englishLanguage();
});
*/
rawData = 'callback=?&reqMemGuid=' + merchantGUID;
param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
url = TARGET_URI + 'v5a/member/email/stCnt?_method=GET&';
AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
	var data = [{
		label : "Unverified",
		data : data.data.result.unverified_emails,
		color : "#bababa",
	}, {
		label : "Verified keys",
		data : data.data.result.verified_key_emails,
		color : "#269ABC",
	}, {
		label : "Verified",
		data : data.data.result.verified_emails,
		color : "#4A6A89",
	}, {
		label : "UnverifiedKey",
		data : data.data.result.unverified_key_emails,
		color : "#EA7D7D"
	}];

	var plotObj = $.plot($("#email-pie-chart"), data, {
		series : {
			pie : {
				show : true
			}
		},
		grid : {
			hoverable : true
		},
		tooltip : true,
		tooltipOpts : {
			content : "%p.0%, %s", // show percentages, rounding to 2 decimal places
			shifts : {
				x : 20,
				y : 0
			},
			defaultTheme : false
		}
	});

	/**On Complete**/
	rawData = 'callback=?&reqMemGuid=' + merchantGUID;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/member/phone/stCnt?_method=GET&';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var data = [{
			label : "unverified",
			data : data.data.result.unverified_phones,
			color : "#bababa",
		}, {
			label : "Verified Keys",
			data : data.data.result.verified_key_phones,
			color : "#269ABC",
		}, {
			label : "Verified",
			data : data.data.result.verified_phones,
			color : "#4A6A89",
		}, {
			label : "Unverifiedkeys",
			data : data.data.result.unverified_key_phones,
			color : "#EA7D7D",
		}];

		var plotObj = $.plot($("#phone-pie-chart"), data, {
			series : {
				pie : {
					show : true
				}
			},
			grid : {
				hoverable : true
			},
			tooltip : true,
			tooltipOpts : {
				content : "%p.0%, %s", // show percentages, rounding to 2 decimal places
				shifts : {
					x : 20,
					y : 0
				},
				defaultTheme : false
			}
		});

		memberList(0);
	});
});

$("#hourChart").click(function() {
	rawData = 'callback=?&reqMemGuid=' + merchantGUID;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = 'v5a/member/create/hour?_method=GET&';

	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var datas = [];
		for (var i = 0; i < data.data.resultList.length; i++) {
			datas.push([data.data.resultList[i].mm, data.data.resultList[i].count]);
		};

		var barData = [{
			label : "Member",
			data : datas
		}];

		var barOptions = {
			series : {
				bars : {
					show : true,
					barWidth : 0.6,
					fill : true,
					fillColor : {
						colors : [{
							opacity : 0.8
						}, {
							opacity : 0.8
						}]
					}
				}
			},
			xaxis : {
				tickDecimals : 0
			},
			colors : ["#269ABC"],
			grid : {
				color : "#999999",
				hoverable : true,
				clickable : true,
				tickColor : "#D4D4D4",
				borderWidth : 0
			},
			legend : {
				show : true
			},
			tooltip : true,
			tooltipOpts : {
				content : "minute: %x, count: %y"
			}
		};

		$.plot($("#flot-dashboard-chart"), barData, barOptions);
	});

	$(".transCharBut").removeClass('active');
	$(this).addClass('active');
});

$("#dayChart").click(function() {
	rawData = 'callback=?&reqMemGuid=' + merchantGUID;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/member/create/day?_method=GET&';

	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var datas = [];
		for (var i = 0; i < data.data.resultList.length; i++) {
			datas.push([data.data.resultList[i].hh, data.data.resultList[i].count]);
		};

		var barData = [{
			label : "Member",
			data : datas
		}];

		var barOptions = {
			series : {
				bars : {
					show : true,
					barWidth : 0.6,
					fill : true,
					fillColor : {
						colors : [{
							opacity : 0.8
						}, {
							opacity : 0.8
						}]
					}
				}
			},
			xaxis : {
				tickDecimals : 0
			},
			colors : ["#269ABC"],
			grid : {
				color : "#999999",
				hoverable : true,
				clickable : true,
				tickColor : "#D4D4D4",
				borderWidth : 0
			},
			legend : {
				show : true
			},
			tooltip : true,
			tooltipOpts : {
				content : "time: %x, count: %y"
			}
		};

		$.plot($("#flot-dashboard-chart"), barData, barOptions);
	});

	$(".transCharBut").removeClass('active');
	$(this).addClass('active');
});

$("#weekChart").click(function() {
	rawData = 'callback=?&reqMemGuid=' + merchantGUID;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/member/create/day?_method=GET&';

	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var datas = [];
		for (var i = 0; i < data.data.resultList.length; i++) {
			datas.push([data.data.resultList[i].hh, data.data.resultList[i].count]);
		};

		var barData = [{
			label : "Member",
			data : datas
		}];

		var barOptions = {
			series : {
				bars : {
					show : true,
					barWidth : 0.6,
					fill : true,
					fillColor : {
						colors : [{
							opacity : 0.8
						}, {
							opacity : 0.8
						}]
					}
				}
			},
			xaxis : {
				tickDecimals : 0
			},
			colors : ["#269ABC"],
			grid : {
				color : "#999999",
				hoverable : true,
				clickable : true,
				tickColor : "#D4D4D4",
				borderWidth : 0
			},
			legend : {
				show : true
			},
			tooltip : true,
			tooltipOpts : {
				content : "day: %x, count: %y"
			}
		};

		$.plot($("#flot-dashboard-chart"), barData, barOptions);
	});

	$(".transCharBut").removeClass('active');
	$(this).addClass('active');
});

/**Get last 24 hrs***/
rawData = 'startDt=yesterday&callback=?&reqMemGuid=' + merchantGUID;
param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
url1 = TARGET_URI + 'v5a/member/byDt?_method=GET&';

AJAX_REQUEST.AJAX.CALL_SERVICE(url1, method, param, function(data, status) {
	if (data.data.result.count.length <= 0) {
	} else {
		$("#memberLast24HrsTotal").text(data.data.result.count);
	}
});

/**Get last week***/
rawData = 'startDt=lastWk&callback=?&reqMemGuid=' + merchantGUID;
param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
url2 = TARGET_URI + 'v5a/member/byDt?_method=GET&';

AJAX_REQUEST.AJAX.CALL_SERVICE(url2, method, param, function(data, status) {
	if (data.data.result.count.length <= 0) {
	} else {
		$("#memberLastWeekTotal").text(data.data.result.count);
	}
});

/**Get total***/

rawData = 'callback=?&reqMemGuid=' + merchantGUID;
param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
url3 = TARGET_URI + 'v5a/member/count?_method=GET&';

AJAX_REQUEST.AJAX.CALL_SERVICE(url3, method, param, function(data, status) {
	if (data.data.result.totalCount.length <= 0) {
	} else {
		$("#memberGrandTotal").text(data.data.result.totalCount);
	}
});

$("#statisticTab").click(function() {
	$("#pagerFooter").show();
});

$("#createMemberTab, #assignBankMembers, #assignVirtualAccountMemberTab").click(function() {
	$("#pagerFooter").hide();
});

/***GET country code****/
param = 'callback=?&grpKey=COUNTRY&callback=?&_method=GET';
url = TARGET_URI + 'v5a/code/detail/all?';
method = "GET";

AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
	var countryCodes = [];
	countryCodes.push("<option value='' selected=selected> </option>");
	for (var i = 0; i < data.data.length; i++) {
		countryCodes.push("<option value=" + data.data[i].cdKey + ">" + data.data[i].cdNm + "</option>");
	}
	$(".countryCode").html(countryCodes.join(""));
	$(".countryCode, .langCode, #addressType").chosen({
		width : "100%;"
	});
});

/**Get bank codes***/
param = 'grpKey=BNK_CD&langCd=ko&callback=?';
url = TARGET_URI + 'v5a/code/detail/query?_method=GET&';
method = 'GET';

AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
	var banklist = [];
	for (var i = 0; i < data.data.length; i++) {
		banklist.push("<option value=" + data.data[i].cdKey + ">" + data.data[i].cdNm + "</option>");
	}
	$("#bankCode").append(banklist.join(''));
	
	$("#bankCode").chosen({
		width : "100%;"
	});
});

var vaBankAccountEngLbl = function(loadData){
	var vaBanklist = [];
	for (var i = 0; i < loadData.data.length; i++) {
		var bankCodeDesc = loadData.data[i].bankCode;
		if(bankCodeDesc=="KEB_005"){bankCodeDesc="KEB";}
		else if(bankCodeDesc=="KIUP_003"){bankCodeDesc="IBK";}
		else if(bankCodeDesc=="NONGHYUP_011"){bankCodeDesc="NONGHYUP";}
		else if(bankCodeDesc=="SC_023"){bankCodeDesc="STANDARD CHARTERED";}
		else if(bankCodeDesc=="SHINHAN_088"){bankCodeDesc="SHINHAN";}
		
		vaBanklist.push("<option value=" + loadData.data[i].bankCode + ">" + bankCodeDesc + "</option>");
	}
	
	$("#assignVirtualBankCode").append(vaBanklist.join(''));
	$("#assignVirtualBankCode").chosen({
		width : "100%;"
	});
};

var vaBankAccountKorLbl = function(loadData){
	var vaBanklist = [];
	for (var i = 0; i < loadData.data.length; i++) {
		var bankCodeDesc = loadData.data[i].bankCode;
		if(bankCodeDesc=="KEB_005"){bankCodeDesc="외환은행";}
		else if(bankCodeDesc=="KIUP_003"){bankCodeDesc="기업은행";}
		else if(bankCodeDesc=="NONGHYUP_011"){bankCodeDesc="농협";}
		else if(bankCodeDesc=="SC_023"){bankCodeDesc="SC제일은행";}
		else if(bankCodeDesc=="SHINHAN_088"){bankCodeDesc="신한은행";}
		
		vaBanklist.push("<option value=" + loadData.data[i].bankCode + ">" + bankCodeDesc + "</option>");
	}
	
	$("#assignVirtualBankCode").append(vaBanklist.join(''));
	$("#assignVirtualBankCode").chosen({
		width : "100%;"
	});
};
/**Get bank codes virtual account ***/
param = 'callback=?';
url = TARGET_URI + 'v5/code/listOf/availableVABanks?_method=GET&';
method = 'GET';

AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
	var vaBanklist = [];
	var loadData = data;
	if (cookieLanguage != undefined && cookieLanguage != null) {
		if (cookieLanguage == "korean") {
			vaBankAccountKorLbl(loadData);		
		}
		else{
			vaBankAccountEngLbl(loadData);	
		}
		
	}else{
		if (BROWSER_LANG == "en-US" || BROWSER_LANG == "en") {
			vaBankAccountEngLbl(loadData);
		}else{
			vaBankAccountKorLbl(loadData);
		}
	}
	
	$("#koreanLang").click(function() {
		$.cookie("language", "korean");
		$("#englishLang").css("color", "");
		$("#koreanLang").css("color", "#0088CC");
		koreanLanguage();
		vaBankAccountKorLbl(loadData);
	});
	
	$("#englishLang").click(function() {
		$.cookie("language", "english");
		$("#englishLang").css("color", "#0088CC");
		$("#koreanLang").css("color", "");
		englishLanguage();
		vaBankAccountEngLbl(loadData);
	});
});


$("#resetButton").click(function() {
	merchantKeyPtmp.text("xxxxxx");
	merchantGuidtmp.text("xxxxxx");
	$("#merchantExist").val('');
	$("#keypContainer").val('');
	$('#createMemberForm')[0].reset();
});

$("#createMemberBut").click(function() {
	var keyp = $.cookie("pkey");
	rawData = decodeURIComponent($("#createMemberForm").serializeAndEncode() + '&callback=?&reqMemGuid=' + merchantGUID);
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData, keyp));
	url = TARGET_URI + 'v5a/member/createMember?_method=POST&';
	method = 'POST';
	$(".hideClass").show();
	
	var createMemberFullName = $("#createMemberFullName").val();
	var nmLangCd = $("#nmLangCd").val();
	var phoneNo = $("#phoneNo").val();
	var phoneCntryCd = $("#phoneCntryCd").val();
	var emailAddrss = $("#emailAddrss").val();
	var addrssCntryCd = $("#addrssCntryCd").val();
	var city = $("#city").val();
	
	if(createMemberFullName.length<=0 && nmLangCd.length<=0 && phoneNo.length<=0 && phoneCntryCd.length<=0 && emailAddrss.length<=0 && addrssCntryCd.length<=0 && city.length<=0)
	{
		alert("Required field should not be empty.");
	}else{
		if(createMemberFullName.length<=0){alert("Name cannot be empty.");$("#createMemberFullName").focus();}
		else if(nmLangCd.length<=0){alert("please select the langcode.");$("#nmLangCd").focus();}
		else if(phoneNo.length<=0){alert("please provide phone number");$("#phoneNo").focus();}
		else if(phoneCntryCd.length<=0){alert("please select phone country code.");$("#phoneCntryCd").focus();}
		else if(emailAddrss.length<=0){alert("please provide email address.");$("#emailAddrss").focus();}
		else if(addrssCntryCd.length<=0){alert("Please select the country code.");$("#addrssCntryCd").focus();}
		else if(city.length<=0){alert("Please enter the city.");$("#city").focus();}
		else{
			if (!numberPattern.test($("#phoneNo").val())){
				alert("Please enter valid phone number");
			}else{
				if(!emailPAttern.test($("#emailAddrss").val())){
					alert("Please provide valid email");
				}else{
					$('#createMemberBut').text('Please wait ...').attr('disabled','disabled');
					AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
						if (status != "success") {
							alert("error");
						} else {
							if (data.status == "SUCCESS") {
								if (data.data.result == 'undefined' || data.data.result == undefined) {
									$("#merchantGuidtmp").text(data.data.memGuid);
									$("#merchantGuid").val(data.data.memGuid);
									$("#merchantExist").show();
									$("#keypContainer").hide();
									$("#tmpMerInfo").show();
									$("#assignMemberCredentialRedirectBut").hide();
								} else {
									$("#tmpMerInfo").show();
									$("#merchantExist").hide();
									$("#keypContainer").show();
									$("#merchantGuidtmp").text(data.data.memGuid);
									$("#merchantKeyPtmp").text(data.data.result.key);
				
									$("#merchantGuid").val(data.data.memGuid);
									$("#merchantKeyP").val(data.data.result.key);
				
									$("#assignMemberCredentialRedirectBut").show();
								}
								$("#viewGenerateMerGuid").trigger("click");
							} else if (data.status != "SUCCESS") {
								alert(data.status);
							}
						}
						$('#createMemberBut').text('Create member').attr('disabled','disabled');
						$('#createMemberBut').removeAttr('disabled');
					});	
				}
			}
		}
	}
});

$("#assignMemberCredentialRedirectBut").click(function() {
	$('#myModal').modal('hide');
	$("#assignMemberCredentials").trigger("click");
	$("#assignLoginDstGuid").val($("#merchantGuid").val());
	$("#assignLoginFullName").val($("#createMemberFullName").val());
});

$("#assignMemberCredentialsBut").click(function() {
	var keyp = $.cookie("pkey");
	rawData = decodeURIComponent($("#assignMemberCredentialsForm").serializeAndEncode() + '&callback=?&reqMemGuid=' + merchantGUID);
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData, keyp));
	url = TARGET_URI + 'v5a/login/user?_method=POST&';
	method = 'POST';
	
	var assignLoginDstGuid = $("#assignLoginDstGuid").val();
	var assignLoginFullName = $("#assignLoginFullName").val();
	var loginId = $("#loginId").val();
	var userCredentialsNmLangCd = $("#userCredentialsNmLangCd").val();
	
	if(assignLoginDstGuid.length<=0 && assignLoginFullName.length<=0 && loginId.length<=0 && userCredentialsNmLangCd_chosen.length<=0){
		alert("Required field should not be empty.");
	}else{
		if(assignLoginDstGuid.length<=0){alert("Guid cannot be empty.");$("#assignLoginDstGuid").focus();}
		else if(assignLoginFullName.length<=0){alert("Full name is empty.");$("#assignLoginFullName").focus();}
		else if(loginId.length<=0){alert("please provide login ID");$("#loginId").focus();}
		else if(userCredentialsNmLangCd.length<=0){alert("Please select language code.");$("#userCredentialsNmLangCd").focus();}
		else{
			$('#assignMemberCredentialsBut').text('Please wait ...').attr('disabled','disabled');
			AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
				if (data.status == "SUCCESS") {
					alert(data.status);
				} else {
					if(data.data.cdDesc=="잘못된 파라미터 포멧 : dstMemGuid : [dstMemGuid]" || data.data.cdDesc=="??? ???? ?? : dstMemGuid : [dstMemGuid]"){
						alert("Guid is invalid");
					}else{
						alert(data.data.cdDesc);	
					}
				}
				$('#assignMemberCredentialsBut').removeAttr('disabled');
				$('#assignMemberCredentialsBut').text('Submit');
			});
		}
	}
});

$("#assignVirtualAccountMemberBut").click(function() {
	var keyp = $.cookie("pkey");
	rawData = decodeURIComponent($("#assignVirtualAccountForm").serializeAndEncode() + '&callback=?&reqMemGuid=' + merchantGUID);
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData, keyp));
	url = TARGET_URI + 'v5a/member/assignVirtualAccount?_method=PUT&';
	method = 'POST';
	
	var assignVirtualAccountDstMemGuid = $("#assignVirtualAccountDstMemGuid").val();
	var assignVirtualBankCode = $("#assignVirtualBankCode").val();
	
	if(assignVirtualAccountDstMemGuid.length<=0 && assignVirtualBankCode.length<=0){
		alert("Required field should not be empty.");
	}else{
		if(assignVirtualAccountDstMemGuid.length<=0){alert("Guid cannot be empty.");$("#assignVirtualAccountDstMemGuid").focus();}
		else if(assignVirtualBankCode.length<=0){alert("please select bank.");$("#assignVirtualBankCode").focus();}
		else{
			$('#assignVirtualAccountMemberBut').text('Please wait ...').attr('disabled','disabled');
			AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
				if (data.status == "SUCCESS") {
					alert(data.status);
					$("#noticeSpanv").hide();
					$(".resultSpanv").show();
					$("#assignVirtualGuid").text($("#assignVirtualAccountDstMemGuid").val());
					$("#assignVirtualAccountBankCode").text(data.data.bnkCd);
					$("#assignVirtualAccountNum").text(data.data.accntNo);
				} else if (data.status != "SUCCESS") {
					if(data.data.cdDesc=="잘못된 파라미터 포멧 : dstMemGuid : [dstMemGuid]"){
						alert("Guid is invalid");
					}else{
						alert(data.data.cdDesc);	
					}
				}
				$('#assignVirtualAccountMemberBut').removeAttr('disabled');
				$('#assignVirtualAccountMemberBut').text('Submit');
			});	
		}
	}
});

$("#assignBankMemberBut").click(function() {
	var keyp = $.cookie("pkey");
	rawData = decodeURIComponent($("#assignBankAccountForm").serializeAndEncode() + '&callback=?&reqMemGuid=' + merchantGUID);
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData, keyp));
	url = TARGET_URI + 'v5a/member/bnk?_method=POST&';
	method = 'POST';
	
	var assignDstMemGuid = $("#assignDstMemGuid").val();
	var bankCode = $("#bankCode").val();
	var accntNo = $("#accntNo").val();
	var assignBankCountryCode = $("#assignBankCountryCode").val();
	
	if(assignDstMemGuid.length<=0 && bankCode.length<=0 && accntNo.length<=0 && assignBankCountryCode.length<=0){
		alert("Required field should not be empty.");
	}else{
		if(assignDstMemGuid.length<=0){alert("Guid cannot be empty.");$("#assignDstMemGuid").focus();}
		else if(bankCode.length<=0){alert("please select bank.");$("#bankCode").focus();}
		else if(accntNo.length<=0){alert("please account number.");$("#accntNo").focus();}
		else if(assignBankCountryCode.length<=0){alert("please select country code.");$("#assignBankCountryCode").focus();}
		else{
			if (!numberPattern.test($("#accntNo").val())){
				alert("Please enter valid account number");
			}else{
				$('#assignBankMemberBut').text('Please wait ...').attr('disabled','disabled');
				AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
					if (data.status == "SUCCESS") {
						alert(data.status);
						$("#noticeSpan").hide();
						$(".resultSpan").show();
						$("#noticeSpan").hide();
						$("#resultSpan").show();
						$("#assignGuid").text($("#assignDstMemGuid").val());
						$("#assignBankCode").text(data.data.bnkCd);
						$("#assignAccountNum").text(data.data.accntNo);
					} else if (data.status != "SUCCESS") {
						if(data.data.cdDesc=="잘못된 파라미터 포멧 : dstMemGuid : [dstMemGuid]"){
							alert("Guid is invalid");
						}else{
							alert(data.data.cdDesc);	
						}
					}
					$('#assignBankMemberBut').text('Submit');
					$('#assignBankMemberBut').removeAttr('disabled');
				});
			};
		}
	}
});

$("#dayChart").trigger("click");

$("#rowsPerPage").change(function() {
	var value = $(this).val();
	rowsPerPage = value;
	memberList(0);
});

$("#advanceSearchMemberBut").click(function() {
	$(".graphContainer").fadeOut(function() {
		$("#memberSearchContainer").fadeIn();
	});
});

$("#closeMemSearch").click(function() {
	$("#memberSearchContainer").fadeOut(function() {
		$(".graphContainer").fadeIn();
	});
});

$("#searchMemberBtn").click(function() {
	memberList(0);
});

$("#listAll").click(function() {
	rowsPerPage = 12;
	$('#memberSearchForm').trigger("reset");
	memberList(0);
});

/*$("#koreanLang").click(function() {
	koreanLanguage();
});

$("#englishLang").click(function() {
	englishLanguage();
});
*/
$(window).resize(function() {
	memberList(0);
});
