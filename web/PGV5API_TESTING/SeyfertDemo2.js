/****
 * List of domain:
 * var domain = "https://dev5.paygate.net/";
 * var domain = "http://52.69.145.143/";
 * var domain = "http://localhost:8080/";
 */
var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";

if (HOST_URI == "dev5.paygate.net") {
	TARGET_URI = "https://dev5.paygate.net/";
}
if (HOST_URI == "stg5.paygate.net") {
	TARGET_URI = "https://stg5.paygate.net/";
}
if (HOST_URI == "v5.paygate.net") {
	TARGET_URI = "https://v5.paygate.net/";
}

var domain = TARGET_URI;

$(document).ready(function() {
	var globalParameters = $("#globalParametersForm").serializeAndEncode();
	var formData,params,rawData,param,serviceURL, url,method,formNamePlusField,originalAmount,confirmAmount,parentid,reqMemguid,refId,title,encryptData,merchantGUID,KEY_ENC,sendRequestParam,responseMessage;
	var bits = 256;
	var ENCRYPTION = "ON";
	var responseDataConsole = [];
	window.location = "SeyfertDemo2.html#page1";
	$("#pageTop").trigger("click");

	/***List available banks***/
	rawData = 'callback=?';
	param = rawData;
	url = TARGET_URI + 'v5a/vaccount/listAvailableBanks?_method=GET&';
	method = 'GET';

	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var banklist = [];
		for (var i = 0; i < data.data.length; i++) {
			banklist.push("<option value=" + data.data[i].bankCode + ">" + data.data[i].bankCode + "</option>");
		}
		$("#availBankList").append(banklist.join(''));
	});

	/**Get bank codes***/
	rawData = 'grpKey=BNK_CD&langCd=ko&callback=?';
	param = rawData;
	url = TARGET_URI + 'v5a/code/detail/query?_method=GET&';
	method = 'GET';

	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var banklist = [];
		for (var i = 0; i < data.data.length; i++) {
			banklist.push("<option value=" + data.data[i].cdKey + ">" + data.data[i].cdKey + "</option>");
		}
		$("#bnkCd").append(banklist.join(''));
		$("#bnkCdMem").append(banklist.join(''));
	});
	
	$("#firstSection").click(function() {
		if ($(".memberSubMenu").is(":visible") !== true) {
			$(".memberSubMenu").toggle();
			$("#memberToggleIcon").html("[-]");
			$("#createMember").trigger("click");
		}
	
		if ($(".transactionSubMenu").is(":visible") === true) {
			$(".transactionSubMenu").toggle();
			$("#transactionToggleIcon").html("[+]");
		}
	
		if ($(".recurringSubMenu").is(":visible") === true) {
			$(".recurringSubMenu").toggle();
			$("#recurringToggleIcon").html("[+]");
		}
	
		if ($(".exchangeSubMenu").is(":visible") === true) {
			$(".exchangeSubMenu").toggle();
			$("#exchangeToggleIcon").html("[+]");
		}
	
		merchantGUID = $("#masterGuid").val();
		KEY_ENC = $("#encryptKey").val();
		$(".merchantMemGuid").val($("#masterGuid").val());
	});

	$("#createMemberBut").click(function() {
		$("#console").empty();
		
		formData = decodeURIComponent($("#createForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5a/member/createMember?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		/**Set params Encrypt or Plain**/
		param = sendRequestParam;

		/**Console code**/
		title = "CREATE MEMBER";
		serviceURL = TARGET_URI+"v5a/member/createMember";
		generatePlainNEncryptData(serviceURL, formData, params, title);
		
		formNamePlusField = "#createForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			if (status != "success") {
				alert("error");
				$("#console").append(generateConnectionErrorField(data));
			} else {
				alert(data.status);
				if (data.status == "SUCCESS") {
					$(".toMemGuid").val(data.data.memGuid);
					$("#fromMemGuid").val(data.data.memGuid);
					reqMemguid = data.data.memGuid;
					$("#createMemberWithEmail")[0].click();
					$("#console").append(generateSuccessField(data));
					scrollTop();
				} else if (data.status != "SUCCESS") {
					var errorArray = [];
					alert("please try again");
					$("#console").append(generateResponseErrorField(data));
					scrollTop();
				}
			}
		});
		scrollTop();
	});

	$("#createMemberWithEmailBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#createWithEmailForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5a/member/createMember?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "CREATE MEMBER WITH EMAIL";
		serviceURL = TARGET_URI+"v5a/member/createMember";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		formNamePlusField = "#createWithEmailForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			if (status != "success") {
				alert("error");
				$("#console").append(generateConnectionErrorField(data));
			} else {
				
				alert(data.status);
				if (data.status == "SUCCESS") {
					$(".toMemGuid").val(data.data.memGuid);
					$("#fromMemGuid").val(data.data.memGuid);
					reqMemguid = data.data.memGuid;
					$("#createMemberWithPhone")[0].click();
					$("#console").append(generateSuccessField(data));
					scrollTop();
				} else if (data.status != "SUCCESS") {
					var errorArray = [];
					alert("please try again");
					$("#console").append(generateResponseErrorField(data));
					scrollTop();
				}
			}
		});
		scrollTop();
	});

	$("#createMemberWithPhoneBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#createWithPhoneForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5a/member/createMember?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;
		/**Console code**/
		title = "CREATE MEMBER WITH PHONE";
		serviceURL = TARGET_URI+"v5a/member/createMember";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#createWithPhoneForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			if (status != "success") {
				alert("error");
				$("#console").append(generateConnectionErrorField(data));
			} else {
				
				alert(data.status);
				if (data.status == "SUCCESS") {
					$(".toMemGuid").val(data.data.memGuid);
					$("#fromMemGuid").val(data.data.memGuid);
					
					$("#createMemberWithBnkAccnt")[0].click();
					
					reqMemguid = data.data.memGuid;
					$("#console").append(generateSuccessField(data));
					scrollTop();
				} else if (data.status != "SUCCESS") {
					var errorArray = [];
					alert("please try again");
					$("#console").append(generateResponseErrorField(data));
					scrollTop();
				}
			}
		});

		scrollTop();
	});

	$("#createMemberWithBnkBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#createWithBnkForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5a/member/createMember?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;
		/**Console code**/
		title = "CREATE MEMBER WITH BANK ACCOUNT";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#createWithBnkForm :input";
		serviceURL = TARGET_URI+"v5a/member/createMember";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			if (status != "success") {
				alert("error");
				$("#console").append(generateConnectionErrorField(data));
			} else {
				
				alert(data.status);
				if (data.status == "SUCCESS") {
					$(".toMemGuid").val(data.data.memGuid);
					$("#fromMemGuid").val(data.data.memGuid);
					reqMemguid = data.data.memGuid;
					
					$("#assignVirtualAccount")[0].click();
					
					$("#console").append(generateSuccessField(data));
					scrollTop();
				} else if (data.status != "SUCCESS") {
					var errorArray = [];
					alert("please try again");
					$("#console").append(generateResponseErrorField(data));
					scrollTop();
				}
			}
		});

		scrollTop();
	});

	$("#assignVirtualBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#assignVirtualAccountForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5a/member/assignVirtualAccount?_method=PUT&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "ASSIGN VIRTUAL ACCOUNT";
		serviceURL = TARGET_URI+"v5a/member/assignVirtualAccount";
		generatePlainNEncryptData(serviceURL, formData, params, title);
		
		var formNamePlusField = "#assignVirtualAccountForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			$("#assignVirtualAccountResponse").html(JSON.stringify(data));
			$("#assignVirtualAccountResponseCon").show();
			$("#bankCodeSey").text(data.data.bnkCd);
			$("#virtualAccountNo").text(data.data.accntNo);
			if (data.status == "SUCCESS") {
				$("#addMemName")[0].click();
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("please try again");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});
		scrollTop();
	});

	$("#addMemNameBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#addMemNameForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5a/member/name?_method=GET&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;
		/**Console code**/
		title = "ADD MEMBER INFO";
		serviceURL = TARGET_URI+"v5a/member/name";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#addMemNameForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			$("#assignVirtualAccountResponse").html(JSON.stringify(data));
			$("#assignVirtualAccountResponseCon").show();
			$("#bankCodeSey").text(data.data.bnkCd);
			$("#virtualAccountNo").text(data.data.accntNo);
			if (data.status == "SUCCESS") {
				$("#chargeToAccount")[0].click();
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("please try again");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#assignBankAccountBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#assignBankAccountForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5a/member/bnk?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "ASSIGN BANK ACCOUNT";
		serviceURL = TARGET_URI+"v5a/member/bnk";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#assignBankAccountForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#inquireAccountName")[0].click();
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#inquireBankAccountOwnerNameBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#inquireBankAccountOwnerNameForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/seyfert/checkbankname?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;
		/**Console code**/
		title = "INQUIRE BANK ACCOUNT OWNER NAME";
		serviceURL = TARGET_URI+"v5/transaction/seyfert/checkbankname";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#inquireBankAccountOwnerNameForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			if (status != "success") {
				alert("error");
				$("#console").append(generateConnectionErrorField(data));
			} else {
				alert(data.status);
				
				if (data.status == "SUCCESS") {
					$("#inquireAccountOwner")[0].click();
					$("#console").append(generateSuccessField(data));
					scrollTop();
				} else if (data.status != "SUCCESS") {
					alert("Please try again!");
					$("#console").append(generateResponseErrorField(data));
					scrollTop();
				}
			}
		});

		scrollTop();
	});

	$("#inquireBankAccountOwnerBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#inquireBankAccountForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/seyfert/checkbankcode?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "INQUIRE BANK ACCOUNT OWNER";
		serviceURL = TARGET_URI+"v5/transaction/seyfert/checkbankcode";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#inquireBankAccountForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			if (status != "success") {
				alert("error");
				$("#console").append(generateConnectionErrorField(data));
			} else {
				alert(data.status);
				if (data.status == "SUCCESS") {
					$("#console").append(generateSuccessField(data));
					scrollTop();
				} else if (data.status != "SUCCESS") {
					alert("Please try again!");
					$("#console").append(generateResponseErrorField(data));
					scrollTop();
				}
			}
		});

		scrollTop();
	});

	/**MEMBER RELATED CODE END***/

	/**TRANSACTION RELATED CODE BEGIN***/
	$("#seyfertBalanceInquiry").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#seyfertBalanceInquiryForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/member/seyfert/inquiry/balance?_method=GET&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;
		
		/**Console code**/
		title = "SEYFERT BALANCE";
		serviceURL = TARGET_URI+"v5/member/seyfert/inquiry/balance";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#seyfertBalanceInquiryForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			$("#seyfertBalanceResponse").html(JSON.stringify(data));
			$("#seyfertBalanceResponseCon").show();

			$("#seyfertBalanceResponse2").html(JSON.stringify(data));
			$("#seyfertBalanceResponseCon2").show();
			
			if (data.status == "SUCCESS") {
				
				$("#seyfertTransfeReserve")[0].click();
				
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});
		scrollTop();
	});

	var counter = 0;
	var time = [];
	while (counter <= 59) {
		counter = counter + 1;
		time.push("<option value=" + counter + ">" + counter + "</option>");
	}
	$("#timeout").append(time.join(''));
	$("#globalTimeOut").append(time.join(''));

	$("#seyfertTransferReserved").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#seyfertTransferReservedForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/seyfertTransfer/requestReserved?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "SEYFERT TRANSFER RESERVE";
		serviceURL = TARGET_URI+"v5/transaction/seyfertTransfer/requestReserved";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#seyfertTransferReservedForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				parentid = data.data.tid;
				$("#escrowParentId").val(parentid);
				$("#seyfertCancelParentId").val(parentid);
				refId = data.data.info.refId;
				title = data.data.info.title;
				
				$("#seyfertTransfer")[0].click();
				
				$("#console").append(generateSuccessField(data));

				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));

				scrollTop();
			}
		});

		scrollTop();
	});

	$("#seyfertTransferInquiry").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#seyfertTransferInquiryForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/seyfert/transfer?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "SEYFERT TRANSFER";
		serviceURL = TARGET_URI+"v5/transaction/seyfert/transfer";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#seyfertTransferInquiryForm :input";
		generateFormParamTable(formNamePlusField);

		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				parentid = data.data.tid;
				$("#escrowParentId").val(parentid);
				$("#seyfertCancelParentId").val(parentid);
				refId = data.data.info.refId;
				title = data.data.info.title;
				$("#sendMoneyTitle").val(title);
					
				$("#escrowRelease")[0].click();
					
				$("#console").append(generateSuccessField(data));

				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));

				scrollTop();
			}
		});

		scrollTop();
	});

	$("#escrowReleaseInquiry").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#escrowReleaseContainer").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/escrowRelease/request?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "ESCROW RELEASE REQUEST";
		serviceURL = TARGET_URI+"v5/transaction/escrowRelease/request";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#escrowReleaseContainer :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#seyfertWithdraw")[0].click();
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#seyfertWithdrawBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#seyfertWithdrawForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/seyfert/withdraw?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "SEYFERT WITHDRAW";
		serviceURL = TARGET_URI+"v5/transaction/seyfert/withdraw";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#seyfertWithdrawForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#seyfertPending")[0].click();
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#seyfertTransferPendingBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#seyfertTransferPendingForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/seyfert/transferPending?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "SEYFERT TRANSFER PENDING";
		serviceURL = TARGET_URI+"v5/transaction/seyfert/transferPending";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#seyfertTransferPendingForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			$("#seyfertTransferResponse").html(JSON.stringify(data));
			$("#seyfertTransferResponseCon").show();
			
			if (data.status == "SUCCESS") {
				parentid = data.data.tid;
				$("#escrowParentId").val(parentid);
				$("#seyfertPendingCancelParentId").val(parentid);
				$("#seyfertPendingReleaseParentId").val(parentid);
				refId = data.data.info.refId;
				title = data.data.info.title;
				
				$("#seyfertPendingRelease")[0].click();

				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#seyfertPendingReleaseBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#seyfertPendingReleaseForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/pending/release?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "SEYFERT TRANSFER PENDING RELEASE";
		serviceURL = TARGET_URI+"v5/transaction/pending/release";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#seyfertPendingReleaseForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#seyfertPendingCancel")[0].click();
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));

				scrollTop();
			}
		});

		scrollTop();
	});

	$("#seyfertPendingCancelBut").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#seyfertPendingCancelForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/seyfertTransferPending/cancel?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "SEYFERT TRANSFER PENDING CANCEL";
		serviceURL = TARGET_URI+"v5/transaction/seyfertTransferPending/cancel";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#seyfertPendingCancelForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#seyfertCancel")[0].click();
				$("#console").append(generateSuccessField(data));

				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));

				scrollTop();
			}
		});

		scrollTop();
	});

	$("#seyfertCancelRequest").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#seyfertCancelContainer").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/seyfertTransfer/cancel?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "SEYFERT CANCEL";
		serviceURL = TARGET_URI+"v5/transaction/seyfertTransfer/cancel";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#seyfertCancelContainer :input";
		generateFormParamTable(formNamePlusField);
			
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else	
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#recurringPayButton").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#recurringPayForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/registerRecurring?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "RECURRING PAY";
		serviceURL = TARGET_URI+"v5/transaction/registerRecurring";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#recurringPayForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#payParentCancel")[0].click();
				parentid = data.data.tid;
				$("#escrowParentId").val(parentid);
				$("#recurringPayCancelParentId").val(parentid);
				refId = data.data.info.refId;
				title = data.data.info.title;

				$("#console").append(generateSuccessField(data));
				scrollTop();

			} else {
				alert("Please try again!");

				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#cancelRecurringParentPayButton").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#recurringPayParentCancelForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/cancelRecurringParent?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "CANCEL PARENT RECURRING PAY";
		serviceURL = TARGET_URI+"v5/transaction/cancelRecurringParent";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#recurringPayParentCancelForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#payChildCancel")[0].click();
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#cancelRecurringChildPayButton").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#recurringPayChildCancelForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/cancelRecurringChild?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "CANCEL CHILD RECURRING PAY";
		serviceURL = TARGET_URI+"v5/transaction/cancelRecurringChild";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#recurringPayChildCancelForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#unlimitedReserve")[0].click();
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#unlimitedReserveButton").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#unlimitedReserveForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/unlimitedReserve?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "UNLIMITED RESERERVED TRANSFER";
		serviceURL = TARGET_URI+"v5/transaction/unlimitedReserve";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#unlimitedReserveForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				parentid = data.data.tid;
				$("#escrowParentId").val(parentid);
				$("#cancelUnlimitedReserve").val(parentid);
				refId = data.data.info.refId;
				title = data.data.info.title;

				$("#cancelUnlimitedReserve")[0].click();
				
				$("#console").append(generateSuccessField(data));
				scrollTop();

			} else {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#cancelUnlimitedReserveButton").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#cancelUnlimitedReserveForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/cancelUnlimitedReserve?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "CANCEL UNLIMTED RESERVED TRANSFER";
		serviceURL = TARGET_URI+"v5/transaction/cancelUnlimitedReserve";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#cancelUnlimitedReserveForm :input";
		generateFormParamTable(formNamePlusField);

		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#sendMoneyButton").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#sendMoneyForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/sendMoney?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "SEND MONEY";
		serviceURL = TARGET_URI+"v5/transaction/sendMoney";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#sendMoneyForm :input";
		generateFormParamTable(formNamePlusField);
		
		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	var caseCheck = $(".exchangeInquiryClass:checked").val();
	if (caseCheck == "case1") {
		$("#exchangeInquiryDstAmt").val('');
	} else {
		$("#exchangeInquirySrcAmt").val('');
	}

	$(".exchangeInquiryClass").click(function() {
		var value = $(this).val();
		if (value == "case1") {
			$("#exchangeInquiryDstAmt").val('');
		} else {
			$("#exchangeInquirySrcAmt").val('');
		}
	});

	$("#exchangeInquiryButton").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#exchangeInquiryForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/exchange/inquiry?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "EXCHANG INQUIRY";
		serviceURL = TARGET_URI+"v5/exchange/inquiry";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#exchangeInquiryForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#exhangeMoney").val(parentid);
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	var caseCheck = $(".exchangeMoneyClass:checked").val();
	if (caseCheck == "case1") {
		$("#exchangeMoneyDstAmt").val('');
	} else {
		$("#exchangeMoneySrcAmt").val('');
	}

	$(".exchangeMoneyClass").click(function() {
		var value = $(this).val();
		if (value == "case1") {
			$("#exchangeMoneyDstAmt").val('');
		} else {
			$("#exchangeMoneySrcAmt").val('');
		}
	});

	$("#exchangeMoneyButton").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#exchangeMoneyForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/exchange/process?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "EXCHANGE MONEY";
		serviceURL = TARGET_URI+"v5/exchange/process";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#exchangeMoneyForm :input";
		generateFormParamTable(formNamePlusField);

		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#smsMoButton").click(function() {
		$("#console").empty();
		formData = decodeURIComponent($("#smsMoForm").serializeAndEncode() + '&callback=?');
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));
		url = TARGET_URI + 'v5/transaction/util/mo?_method=POST&';
		method = 'POST';

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		param = sendRequestParam;

		/**Console code**/
		title = "SMS MO";
		serviceURL = TARGET_URI+"v5/transaction/util/mo";
		generatePlainNEncryptData(serviceURL, formData, params, title);

		var formNamePlusField = "#smsMoForm :input";
		generateFormParamTable(formNamePlusField);

		if($.trim($(".globalParamContainer").html())==''){
			alert("Please fill the global parameters.");
			$("#seyfertBalance")[0].click();
		}
		else
		AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
			alert(data.status);
			
			if (data.status == "SUCCESS") {
				$("#console").append(generateSuccessField(data));
				scrollTop();
			} else if (data.status != "SUCCESS") {
				alert("Please try again!");
				$("#console").append(generateResponseErrorField(data));
				scrollTop();
			}
		});

		scrollTop();
	});

	$("#uploadMemberImageForm").submit(function() {
		formData = decodeURIComponent($("#uploadMemberImageForm").serialize());
		params = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(formData, KEY_ENC));

		if (ENCRYPTION == "ON") {
			sendRequestParam = params;
		} else if (ENCRYPTION == "OFF") {
			sendRequestParam = formData;
		} else {
		}

		$("#uploadMemberImageForm").attr("action", domain + "v5/member/uploadMemImg");
		$("#uploadMemberImageForm").submit(params);

		$("#uploadResult").load(function() {
			var frame = $("#uploadResult").contents().find("body").html();
			alert(frame);
		});

		document.getElementById('uploadResult').onload = function() {
			var frame = document.getElementById('uploadResult').contentWindow.document.body.innerHTML;
			;
			$("#uploadResult").html(frame);
		};

	});

	/**Set Global params**/
	/**donot allow empty space**/
	$("input#globalNonce, input.transNonce").on({
		keydown : function(e) {
			if (e.which === 32)
				return false;
		},
		change : function() {
			this.value = this.value.replace(/\s/g, "");
		}
	});

	$("#setGlobalParams").click(function() {
		generateGlobalParameters();
		
		var nonceValue = $("#globalNonce").val();
		if (nonceValue.length > 0 || nonceValue.length != '') {
			$(".nonce").val($("#globalNonce").val());
		} else {
			$(".nonce").val("");
		}
		
		alert("success");
		
		$(".showExtraParams").show();
		$("#closeModal").trigger("click");
	});
}); 