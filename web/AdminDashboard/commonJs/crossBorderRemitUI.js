//https://stg5.paygate.net/v5a/code/detail/query
/**URI host declartion and initialization **/
var HOST_URI = window.location.hostname;
var TARGET_URI = "https://dev5.paygate.net/";

if (HOST_URI == "dev5.paygate.net") {
	TARGET_URI = "https://dev5.paygate.net/";
}
if (HOST_URI == "stg5.paygate.net") {
	TARGET_URI = "https://stg5.paygate.net/";
}
if (HOST_URI == "v5.paygate.net") {
	TARGET_URI = "https://v5.paygate.net/";
}


/**Global Variables**/
var isAdmin = $.cookie("isAdmin");
var sourceGuid, destinationGuid, referenceId;
var param,url,KEY_ENC,rawData,passportImage,merchantGUID;
KEY_ENC = $.cookie("pkey");
/**INITIALIZE VARIABLES**/
merchantGUID = $.cookie("superGuid");
param = 'callback=?&_method=GET&grpKey=BNK_CD&langCd=en';
url = TARGET_URI + 'v5a/code/detail/query?';
method = "GET";

/**** Test get image 
var imgsss = Get base64 response from service;
var modify = imgsss.replace(/ /g, '+');
console.log(modify);
$("#passportTest").attr("href",modify);
*/
if(isAdmin=="true"){
	$("#verificationTab").show();	
	loadComplianceData();
}else{
	$("#verificationTab").hide();
}
/**INITIATE IMAGE CONVERSION TO BASE-64 AND APPEND TO PREVIEW IMAGE SRC**/
var readImage = function() {
	if (this.files && this.files[0]) {
		var FR = new FileReader();
		FR.onload = function(e) {
			$('#img').attr("src", e.target.result);
			$('#img2').attr("src", e.target.result);
			passportImage = e.target.result;
			$(".hiddens").show();
		};
		FR.readAsDataURL(this.files[0]);
		$("#fileName").text(this.files[0].name);
	}
};

/**INITILIZE FILE UPLOAD FUNCTION**/
$("#inputImage").change(readImage);

/**LOGIC TO ENABLE AND DISABLE CASH PICKUP RELATED FIELD***/
$("#cashPickup").change(function() {
	var val = $(this).val();
	if (val == "Yes") {
		$("#bankDeposit").val("No");
		$(".bankInfoEnable").attr("disabled", "disabled");
	} else {
		$("#bankDeposit").val("Yes");
		$(".bankInfoEnable").removeAttr("disabled");
	}

});

$("#senderAddressCountryCode").change(function() {
	var scountryCode = $(this).val();
	$("#senderPhoneCountryCode").val(scountryCode);
});

$("#receiverAddressCountryCode").change(function() {
	var rcountryCode = $(this).val();
	$("#receiverPhoneCountryCode").val(rcountryCode);
});
$("#receiverPhoneCountryCode").val($("#receiverAddressCountryCode").val());

/**INITIATE AJAX CALL SERVICE**/
AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
	var bankCodes = [];

	for (var i = 0; i < data.data.length; i++) {
		bankCodes.push("<option value=" + data.data[i].cdKey + ">" + data.data[i].cdNm + "</option>");
	}

	$(".bankCode").html(bankCodes.join(""));
	$(".bankCode").chosen({
		width : "100%;"
	});
});

param = 'callback=?&grpKey=COUNTRY&callback=?&_method=GET';
url = TARGET_URI + 'v5a/code/detail/all?';
method = "GET";

AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
	//alert(data);<option value="" selected="selected">003</option>
	var countryCodes = [];
	for (var i = 0; i < data.data.length; i++) {
		countryCodes.push("<option value=" + data.data[i].cdKey + ">" + data.data[i].cdNm + "</option>");
	}
	$(".countryCode").html(countryCodes.join(""));
	$(".countryCode").chosen({
		width : "100%;"
	});
});

/***List complaiance verification list***/
var checkSrcVerifyStatus;
var checkRcvrVerifyStatus;
var checkPassportVerifyStatus;
var checkYrtlyVerifyStatus;
var checkTrnAmtVerifyStatus;

/***Todo: nned to think more ***
var updateDashboardKey = function(){
	var dashboardVerifyKey = $("#dashboardVerifyKey").text();
	val = "IN_PROGRESS";
	key = dashboardVerifyKey;
	alert(key);
	rawData = "callback=?&verifyKey="+key+"&verifySt="+val+"&reqMemGuid="+merchantGUID;
	alert(rawData);
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	method = "GET";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		alert(data.status);		
		loadComplianceData();
	});	
};
***/
var loadComplianceData = function(){
	rawData = "callback=?&_method=GET&reqMemGuid="+merchantGUID;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI +"v5a/complianceDashboard?";
	method = "GET";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if(data.status=="SUCCESS"){
			var comlianceList = [];
			var verifyStatus;
			
			if(data.data != undefined && data.data != null && data.data !=''){
				for(var i=0;i< data.data.length;i++){
					comlianceList.push("<tr class='gradeX' style='height:30px;'>");
					//comlianceList.push("<td> <strong> "+ data.data[i].refId +" </strong> </td>");
					comlianceList.push("<td> <a class='getMemberDetail text-primary'>"+data.data[i].merchantGuid+"</a> </td>");
					comlianceList.push("<td> <a class='getMemberDetail text-primary'>"+data.data[i].srcGuid+"</a> </td>");
					comlianceList.push("<td> <a class='getMemberDetail text-primary'>"+data.data[i].dstGuid+"</a> </td>");
					verifyStatus = data.data[i].dashboardVerifySt.verifySt;
					
					if(verifyStatus=="VERIFIED"){
						comlianceList.push("<td> <a style='color:#0075B0;font-weight:bold;'> VERIFIED </a> </td>");
					}/*else if(verifyStatus=="IN_PROGRESS"){
						comlianceList.push("<td> <a style='color:0075B0;'> IN_PROGRESS </a> </td>");
					}*/
					else{
						comlianceList.push("<td> <a style='color:#D9534F;font-weight:bold;'> UNVERIFIED </a> </td>");
					}
					
					comlianceList.push("<td> "+ dateFunction(data.data[i].dashboardVerifySt.updateDt) +" </td>");
					
					if(verifyStatus=="VERIFIED"){
						comlianceList.push("<td> <a style='cursor:pointer;color:#0075B0;font-weight:bold;' data-toggle='modal' class='assignVa'");
						/**Dashboard verification***/
						comlianceList.push(" dashboardVerifyStverifyKey="+data.data[i].dashboardVerifySt.verifyKey+"");
						comlianceList.push(" dashboardVerifyType="+data.data[i].dashboardVerifySt.type+"");
						comlianceList.push(" dashboardVerifyStatus="+data.data[i].dashboardVerifySt.verifySt+"");
						comlianceList.push(" dashboardVerifyUpdateDate="+ dateFunction(data.data[i].dashboardVerifySt.updateDt) +"");
						/**source verification***/
						comlianceList.push(" sourceVerifyStverifyKey="+data.data[i].srcMemVerification.verifyKey+"");
						comlianceList.push(" sourceVerifyType="+data.data[i].srcMemVerification.type+"");
						comlianceList.push(" sourceVerifyStatus="+data.data[i].srcMemVerification.verifySt+"");
						comlianceList.push(" sourceVerifyUpdateDate="+ dateFunction(data.data[i].srcMemVerification.updateDt) +"");
						/**destination verification***/
						comlianceList.push(" destinationVerifyStverifyKey="+data.data[i].dstMemVerification.verifyKey+"");
						comlianceList.push(" destinationVerifyType="+data.data[i].dstMemVerification.type+"");
						comlianceList.push(" destinationVerifyStatus="+data.data[i].dstMemVerification.verifySt+"");
						comlianceList.push(" destinationVerifyUpdateDate="+ dateFunction(data.data[i].dstMemVerification.updateDt) +"");
						/**passport verification***/
						comlianceList.push(" passportVerifyStverifyKey="+data.data[i].passportVerification.verifyKey+"");
						comlianceList.push(" passportVerifyType="+data.data[i].passportVerification.type+"");
						comlianceList.push(" passportVerifyStatus="+data.data[i].passportVerification.verifySt+"");
						comlianceList.push(" passportVerifyUpdateDate="+ dateFunction(data.data[i].passportVerification.updateDt) +"");
						/**yearly amount verification***/
						comlianceList.push(" yearlyAmtVerifyStverifyKey="+data.data[i].yearlyAmtVerification.verifyKey+"");
						comlianceList.push(" yearlyAmtVerifyType="+data.data[i].yearlyAmtVerification.type+"");
						comlianceList.push(" yearlyAmtVerifyStatus="+data.data[i].yearlyAmtVerification.verifySt+"");
						comlianceList.push(" yearlyAmtVerifyUpdateDate="+ dateFunction(data.data[i].yearlyAmtVerification.updateDt) +"");
						/**transaction amount verification***/
						comlianceList.push(" transAmtVerifyStverifyKey="+data.data[i].trnAmtVerification.verifyKey+"");
						comlianceList.push(" transAmtVerifyType="+data.data[i].trnAmtVerification.type+"");
						comlianceList.push(" transAmtVerifyStatus="+data.data[i].trnAmtVerification.verifySt+"");
						comlianceList.push(" transAmtVerifyUpdateDate="+ dateFunction(data.data[i].trnAmtVerification.updateDt)+"");
						comlianceList.push("><i class='fa fa-check-square-o'></i> assignVirtualAcnt");
						comlianceList.push("</a>");
						comlianceList.push("</td> ");
					}else
					{
						comlianceList.push("<td> <a style='cursor:pointer;color:#D9534F;font-weight:bold;' data-toggle='modal' class='updateStatus'");
						/**Dashboard verification***/
						comlianceList.push(" dashboardVerifyStverifyKey="+data.data[i].dashboardVerifySt.verifyKey+"");
						comlianceList.push(" dashboardVerifyType="+data.data[i].dashboardVerifySt.type+"");
						comlianceList.push(" dashboardVerifyStatus="+data.data[i].dashboardVerifySt.verifySt+"");
						comlianceList.push(" dashboardVerifyUpdateDate="+ dateFunction(data.data[i].dashboardVerifySt.updateDt) +"");
						/**source verification***/
						comlianceList.push(" sourceVerifyStverifyKey="+data.data[i].srcMemVerification.verifyKey+"");
						comlianceList.push(" sourceVerifyType="+data.data[i].srcMemVerification.type+"");
						comlianceList.push(" sourceVerifyStatus="+data.data[i].srcMemVerification.verifySt+"");
						comlianceList.push(" sourceVerifyUpdateDate="+ dateFunction(data.data[i].srcMemVerification.updateDt) +"");
						/**destination verification***/
						comlianceList.push(" destinationVerifyStverifyKey="+data.data[i].dstMemVerification.verifyKey+"");
						comlianceList.push(" destinationVerifyType="+data.data[i].dstMemVerification.type+"");
						comlianceList.push(" destinationVerifyStatus="+data.data[i].dstMemVerification.verifySt+"");
						comlianceList.push(" destinationVerifyUpdateDate="+ dateFunction(data.data[i].dstMemVerification.updateDt) +"");
						/**passport verification***/
						comlianceList.push(" passportVerifyStverifyKey="+data.data[i].passportVerification.verifyKey+"");
						comlianceList.push(" passportVerifyType="+data.data[i].passportVerification.type+"");
						comlianceList.push(" passportVerifyStatus="+data.data[i].passportVerification.verifySt+"");
						comlianceList.push(" passportVerifyUpdateDate="+ dateFunction(data.data[i].passportVerification.updateDt) +"");
						/**yearly amount verification***/
						comlianceList.push(" yearlyAmtVerifyStverifyKey="+data.data[i].yearlyAmtVerification.verifyKey+"");
						comlianceList.push(" yearlyAmtVerifyType="+data.data[i].yearlyAmtVerification.type+"");
						comlianceList.push(" yearlyAmtVerifyStatus="+data.data[i].yearlyAmtVerification.verifySt+"");
						comlianceList.push(" yearlyAmtVerifyUpdateDate="+ dateFunction(data.data[i].yearlyAmtVerification.updateDt) +"");
						/**transaction amount verification***/
						comlianceList.push(" transAmtVerifyStverifyKey="+data.data[i].trnAmtVerification.verifyKey+"");
						comlianceList.push(" transAmtVerifyType="+data.data[i].trnAmtVerification.type+"");
						comlianceList.push(" transAmtVerifyStatus="+data.data[i].trnAmtVerification.verifySt+"");
						comlianceList.push(" transAmtVerifyUpdateDate="+ dateFunction(data.data[i].trnAmtVerification.updateDt)+"");
						 
						comlianceList.push("><i class='fa fa-edit'></i> verify-member-in");
						comlianceList.push("</a>");
						comlianceList.push("</td>");
					}
					comlianceList.push("</tr>");
				}	
				
				$("#complianceListContainer").html(comlianceList.join(""));
				
				/***View member detail*****/
				$(".getMemberDetail").click(function(){
					var destinationGuid = $(this).text();
					$.cookie("destinationGuid", destinationGuid);
					PopupCenterDual('memberUI/detailContent.html','Member details','900','810');
				});
				
				/****detail view status****/
				var dashboardVerifyKey;
				var checkSenderVerify;
				var checkReceiverVerify;
				var checkPassportVerify;
				var checkYrAmtVerify;
				var checkTrnAmtVerify;
				var senderGuid;
				var orgMemGuid;
				$(".assignVa").click(function(){
					$(".resultSpanv").hide();
					$("#noticeSpanv").css("color","#EF5352");
					$("#noticeSpanvText").text("Make sure that the Guid & Bank code are correctly provided before assigning virtual account.");
					orgMemGuid = $(this).closest("tr").find("td a:eq(0)").text();
					senderGuid = $(this).closest("tr").find("td a:eq(1)").text();
					$("#assignVirtualAccountDstMemGuid").val(senderGuid);
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
						$("#assignVirtualBankCode").append(banklist.join(''));
					});
					$("#showAssignVaWindow")[0].click();
					
					$("#assignVirtualAccountMemberBut").unbind("click").click(function(){
						assignVirtualAccount(senderGuid, orgMemGuid);
					});
				});
				
				$(".updateStatus").click(function(){
					orgMemGuid = $(this).closest("tr").find("td a:eq(0)").text();
					senderGuid = $(this).closest("tr").find("td a:eq(1)").text();
					$("#dashboardVerifyKey").text($(this).attr("dashboardVerifyStverifyKey"));
					$("#dashboardVerifyType").text($(this).attr("dashboardVerifyType"));
					$("#dashboardVerifyStatus").text($(this).attr("dashboardVerifyStatus"));
					$("#dashboardVerifyUpdateDate").text($(this).attr("dashboardVerifyUpdateDate"));
					
					dashboardVerifyKey = $(this).attr("dashboardVerifyStverifyKey");
					
					checkSenderVerify =  $(this).attr("sourceVerifyStatus");
					checkReceiverVerify =  $(this).attr("destinationVerifyStatus");
					checkPassportVerify =  $(this).attr("passportVerifyStatus");
					checkYrAmtVerify =  $(this).attr("yearlyAmtVerifyStatus");
					checkTrnAmtVerify =  $(this).attr("transAmtVerifyStatus");
					
					var checkStatus = $(this).attr("dashboardVerifyStatus");
					if(checkStatus=="VERIFIED"){
						$("#verifyConfirmBut").hide();
						//$("#assignVirtualAccountBut").show();
					}else{
						$("#verifyConfirmBut").show();
						//$("#assignVirtualAccountBut").hide();
					};
					
					$("#srcVerifyKey").text($(this).attr("sourceVerifyStverifyKey"));
					$("#srcVerifyType").text($(this).attr("sourceVerifyType"));
					$("#srcVerifyUpdateDate").text($(this).attr("sourceVerifyUpdateDate"));
					if(checkSenderVerify=="UNVERIFIED"){
						$("#srcVerifyStatus").text(checkSenderVerify);
						$("#verifySenderContainer").show();
						$("#verifiedSender").hide();		
					}else{
						$("#srcVerifyStatus").text(checkSenderVerify);
						$("#verifiedSender").show();
						$("#verifySenderContainer").hide();
					}
					
					$("#dstVerifyKey").text($(this).attr("destinationVerifyStverifyKey"));
					$("#dstVerifyType").text($(this).attr("destinationVerifyType"));
					$("#dstVerifyUpdateDate").text($(this).attr("destinationVerifyUpdateDate"));
					if(checkReceiverVerify=="UNVERIFIED"){
						$("#dstVerifyStatus").text(checkReceiverVerify);
						$("#verifyReceiverContainer").show();
						$("#verifiedReceiver").hide();	
					}else{
						$("#dstVerifyStatus").text(checkReceiverVerify);
						$("#verifiedReceiver").show();
						$("#verifyReceiverContainer").hide();
					}
					
					$("#passportVerifyKey").text($(this).attr("passportVerifyStverifyKey"));
					$("#passportVerifyType").text($(this).attr("passportVerifyType"));
					$("#passportVerifyUpdateDate").text($(this).attr("passportVerifyUpdateDate"));
					if(checkPassportVerify==="UNVERIFIED"){
						$("#passportVerifyStatus").text(checkPassportVerify);
						$("#passportVerifyStatusLabel").text("VERIFY");
						$("#verifyPassportContainer").show();
						$("#verifiedPassport").hide();	
					}else{
						$("#passportVerifyStatusLabel").text("VERIFIED");
						$("#passportVerifyStatus").text(checkPassportVerify);
						$("#verifiedPassport").show();
						$("#verifyPassportContainer").hide();
						/*if(checkPassportVerify=="IN_PROGRESS"){
							$("#passportVerifyStatusLabel").text("IN-PROGRESS");
							$("#passportVerifyStatus").text(checkPassportVerify);
						}else if(checkPassportVerify=="VERIFIED"){
							$("#passportVerifyStatusLabel").text("VERIFIED");
							$("#passportVerifyStatus").text(checkPassportVerify);
							$("#verifiedPassport").show();
						}else{
							$("#passportVerifyStatusLabel").text("VERIFY");
							$("#passportVerifyStatus").text(checkPassportVerify);
						};
						*/
					};
					
					$("#yrAmtVerifyKey").text($(this).attr("yearlyAmtVerifyStverifyKey"));
					$("#yrAmtVerifyType").text($(this).attr("yearlyAmtVerifyType"));
					$("#yrAmtVerifyUpdateDate").text($(this).attr("yearlyAmtVerifyUpdateDate"));
					if(checkYrAmtVerify=="UNVERIFIED"){
						$("#yrAmtVerifyStatus").text(checkYrAmtVerify);
						$("#verifyYrAmtContainer").show();
						$("#verifiedYearAmount").hide();
					}else{
						$("#yrAmtVerifyStatus").text(checkYrAmtVerify);
						$("#verifiedYearAmount").show();
						$("#verifyYrAmtContainer").hide();
					}
					
					$("#trnAmtVerifyKey").text($(this).attr("transAmtVerifyStverifyKey"));
					$("#trnAmtVerifyType").text($(this).attr("transAmtVerifyType"));
					$("#trnAmtVerifyUpdateDate").text($(this).attr("transAmtVerifyUpdateDate"));
					
					if(checkTrnAmtVerify=="UNVERIFIED"){
						$("#trnAmtVerifyStatus").text(checkTrnAmtVerify);
						$("#verifyYrTrnContainer").show();
						$("#verifiedYearTrn").hide();
					}else{
						$("#trnAmtVerifyStatus").text(checkTrnAmtVerify);
						$("#verifiedYearTrn").show();
						$("#verifyYrTrnContainer").hide();
					}
					$("#showVerifyWindow")[0].click();
					
				});
				
				/***Update verification status***/
				var val;
				var key;
				var url = TARGET_URI +"v5a/member/verify?_method=PUT&";
				$('#verifySender').click(function(){
					val = "VERIFIED";
					key = $("#srcVerifyKey").text();
					rawData = "&callback=?&verifyKey="+key+"&verifySt="+val+"&reqMemGuid="+merchantGUID;
					param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
					method = "GET";
					AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
						if(data.status=="SUCCESS"){
							$("#verifiedSender").show();
							$("#verifySenderContainer").hide();
							$("#srcVerifyStatus").text("VERIFIED");
							//updateDashboardKey();
							loadComplianceData();
						}else{};		
					});
				});
				
				$('#verifyReceiver').click(function(){
					val = "VERIFIED";
					key = $("#dstVerifyKey").text();
					rawData = "&callback=?&verifyKey="+key+"&verifySt="+val+"&reqMemGuid="+merchantGUID;
					param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
					method = "GET";
					AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
						if(data.status=="SUCCESS"){
							$("#verifiedReceiver").show();
							$("#verifyReceiverContainer").hide();
							$("#dstVerifyStatus").text("VERIFIED");
							//updateDashboardKey();
							loadComplianceData();
						}else{};		
					});
				});
				
				$("#getPassportImage").click(function(){
					var PassportUrl = TARGET_URI+"v5a/member/passport?_method=GET&";
					rawData = "&callback=?&reqMemGuid="+merchantGUID+"&dstMemGuid="+senderGuid;
					param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
					AJAX_REQUEST.AJAX.CALL_SERVICE(PassportUrl, method, param, function(data, status) {
						if(data.status=="SUCCESS"){
							var passprtImg = data.data.result.passportImg.img; 
							var initPassportImage = passprtImg.replace(/ /g, '+');
							$("#passportImage").attr("src",initPassportImage);
							$("#pNo").text(data.data.result.passportNo);
							$("#pGender").text(data.data.result.gender);
							$("#pNationality").text(data.data.result.nationality);
							$("#pDob").text(dateFunction(data.data.result.dateOfBirth));
							$("#pIssuePlace").text(data.data.result.issuePlace);
							$("#pIssueDate").text(dateFunction(data.data.result.issuanceDt));
							$("#pExpirationDt").text(dateFunction(data.data.result.expirationDt));
						}
					});	
				});
				
				$('#verifyPassport').click(function(){
					val = "VERIFIED";
					key = $("#passportVerifyKey").text();
					rawData = "&callback=?&verifyKey="+key+"&verifySt="+val+"&reqMemGuid="+merchantGUID;
					param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
					method = "GET";
					
					AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
						if(data.status=="SUCCESS"){
							$("#verifiedPassport").show();
							$("#verifyPassportContainer").hide();
							$('#verifyPassportWindow').modal('hide');
							$("#passportVerifyStatus").text("VERIFIED");
							//updateDashboardKey();
							loadComplianceData();
						}else{};		
					});
				});
				
				$('#verifyYrAmt').click(function(){
					val = "VERIFIED";
					key = $("#yrAmtVerifyKey").text();
					rawData = "&callback=?&verifyKey="+key+"&verifySt="+val+"&reqMemGuid="+merchantGUID;
					param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
					method = "GET";
					
					AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
						if(data.status=="SUCCESS"){
							$("#verifiedYearAmount").show();
							$("#verifyYrAmtContainer").hide();
							$("#yrAmtVerifyStatus").text("VERIFIED");
							//updateDashboardKey();
							loadComplianceData();
						}else{};		
					});
				});
				
				$('#verifyYrTrn').click(function(){
					val = "VERIFIED";
					key = $("#trnAmtVerifyKey").text();
					rawData = "&callback=?&verifyKey="+key+"&verifySt="+val+"&reqMemGuid="+merchantGUID;
					param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
					method = "GET";
					
					AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
						if(data.status=="SUCCESS"){
							$("#verifiedYearTrn").show();
							$("#verifyYrTrnContainer").hide();
							$("#trnAmtVerifyStatus").text("VERIFIED");
							//updateDashboardKey();
							loadComplianceData();
						}else{};		
					});
				});
				
				checkSenderVerify =  $(this).attr("sourceVerifyStatus");
				checkReceiverVerify =  $(this).attr("destinationVerifyStatus");
				checkPassportVerify =  $(this).attr("passportVerifyStatus");
				checkYrAmtVerify =  $(this).attr("yearlyAmtVerifyStatus");
				checkTrnAmtVerify =  $(this).attr("transAmtVerifyStatus");
				
				
				$("#verifyConfirmBut").click(function(){
					//alert("checkSenderVerify>"+checkSenderVerify+'&checkReceiverVerify>'+checkReceiverVerify+'&checkPassportVerify>'+checkPassportVerify+'&checkYrAmtVerify>'+checkYrAmtVerify+'&checkTrnAmtVerify>'+checkTrnAmtVerify);
					if(checkSenderVerify==="VERIFIED" && checkSenderVerify==="VERIFIED" && checkPassportVerify==="VERIFIED" && checkYrAmtVerify==="VERIFIED" && checkTrnAmtVerify==="VERIFIED"){
						val = "VERIFIED";
						key = dashboardVerifyKey;
						rawData = "&callback=?&verifyKey="+key+"&verifySt="+val+"&reqMemGuid="+merchantGUID;
						param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
						method = "GET";
						
						AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
							if(data.status=="SUCCESS"){
								alert("Member info is now verified. Assign virtual account to the member.");
								$("#verifyConfirmBut").hide(function(){
									$("#assignVirtualAccountBut").show();	
								});
								
								loadComplianceData();
							}else{};		
						});
						
					}else{
						alert("Please make sure all the member info are verified !");
					}
				});
				
			}else{};
		}else{};
	});
};

/***********update sender information*************/
var updateSenderMemberInformation = function(memGuid) {
	var remittersformData = $("#remittersBasicForm").serialize();
	rawData = "callback=?&" + remittersformData + "&reqMemGuid=" + merchantGUID + "&dstMemGuid=" + memGuid;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/member/allInfo?_method=PUT&";
	method = "POST";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			//assignVirtualAccount(dstGuid);
			registerSendersPassport(memGuid);
			$("#sendersGUID").val(memGuid);
		} else{};
	});
};

var assignVirtualAccount = function(senderGuid, orgMemGuid) {
	var bankCode = $("#assignVirtualBankCode").val();
	rawData = 'reqMemGuid='+merchantGUID+'&orgMemGuid='+orgMemGuid+'&dstMemGuid='+senderGuid+'&bnkCd='+bankCode+'&callback=?';
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/member/assignVirtualAccount?_method=PUT&';
	method = 'POST';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			alert(data.status);
			$("#noticeSpanvText").text("Generated merchant virtual account info:");
			$("#noticeSpanv").css("color","#18A689");
			$(".resultSpanv").show();
			$("#assignVirtualAccountBankCode").text(data.data.bnkCd);
			$("#assignVirtualAccountNum").text(data.data.accntNo);
		} else {
			alert(data.data.cdDesc);
		};
	});
};

var registerSendersPassport = function(memGuid) {
	var remittersPassportForm = $("#remittersPassportForm").serialize();
	rawData = 'callback=?&reqMemGuid=' + merchantGUID + '&dstMemGuid=' + memGuid + '&passportImg=' + passportImage + '&' + remittersPassportForm;
	param = 'reqMemGuid=' + merchantGUID;
	url = TARGET_URI + 'v5a/member/passport?&';
	method = 'POST';
	//var enCryptPassportImage = passportImage;
	//var enCryptPassportImage = ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(passportImage));
	var formData = new FormData();
	formData.append("encReq", ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData)));
	$.ajax({
		  url: url+param,  
		  type: "POST",        
		  data: formData,
		  dataType: 'json',
		  contentType: false,   
		  cache: false,   
		  processData:false,
		  error:function(xhtr){},
		  success: function(data,status){},
		  complete: function(xhr, textStatus) {
		        /*if(xhr.status==200){
		     		createReceiverMember();   	
		        }else{alert("Error! Please try again.");}
		        */
		       createReceiverMember();
		    } 
	});
};

var createReceiverMember = function() {
	var receiversPhone = $("#receiverPhoneNo").val();
	var receiversPhoneCountryCode = $("#receiverPhoneCountryCode").val();
	rawData = 'reqMemGuid=' + merchantGUID + '&callback=?&keyTp=PHONE&phoneNo=' + receiversPhone + '&phoneCntryCd=' + receiversPhoneCountryCode;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/member/createMember?_method=POST&';
	method = 'POST';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			 var receiverMemGuid = data.data.memGuid;
			 updateReceiverMemberInformation(receiverMemGuid);
			 destinationGuid = receiverMemGuid;
			 $("#receiversGUID").val(receiverMemGuid);
		} else {
		};
	});
};

var updateReceiverMemberInformation = function(receiverMemGuid) {
	var receiverRemittenceForm = $("#receiversRemittenceForm").serialize();
	rawData = "callback=?&" + receiverRemittenceForm + "&reqMemGuid=" + merchantGUID + "&dstMemGuid=" + receiverMemGuid;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/member/allInfo?_method=PUT&";
	method = "POST";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			receiverBankInformation(receiverMemGuid);
		} else {
		};
	});
};

/**Insert receivers bank code begin***/
var info_cd;
var priority = 1;
var info;
var desc;
var getCashPickUpVal = function(receiverMemGuid){
	info_cd = "CASH_PICKUP";
	info = $("#cashPickup").val();
	desc = "receiver cash pickup";
    rawData = "callback=?&infoCd="+info_cd+"&priority="+priority+"&info=" + info + "&desc="+desc+"&reqMemGuid=" + merchantGUID + "&dstMemGuid=" + receiverMemGuid;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/member/createMemInfo?_method=POST&";
	method = "POST";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			getBankDepositVal(receiverMemGuid);
		} else {
		};
	});
};

var getBankDepositVal = function(receiverMemGuid){
	info_cd = "BANK_DEPOSIT";
	info = $("#bankDeposit").val();
	desc = "receiver bank deposit";
    rawData = "callback=?&infoCd="+info_cd+"&priority="+priority+"&info=" + info + "&desc="+desc+"&reqMemGuid=" + merchantGUID + "&dstMemGuid=" + receiverMemGuid;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/member/createMemInfo?_method=POST&";
	method = "POST";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			getAccountNumberVal(receiverMemGuid);
		} else {
		};
	});
};
var getAccountNumberVal = function(receiverMemGuid){
	info_cd = "BANK_ACCOUNT_NUMBER";
	info = $("#bnkAccountNumber").val();
	desc = "receiver bank account number";
    rawData = "callback=?&infoCd="+info_cd+"&priority="+priority+"&info=" + info + "&desc="+desc+"&reqMemGuid=" + merchantGUID + "&dstMemGuid=" + receiverMemGuid;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/member/createMemInfo?_method=POST&";
	method = "POST";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			getBankNameVal(receiverMemGuid);
		} else {
		};
	});
};
var getBankNameVal = function(receiverMemGuid){
	info_cd = "BANK_NAME";
	info = $("#bnkName").val();
	desc = "receiver bank name";
    rawData = "callback=?&infoCd="+info_cd+"&priority="+priority+"&info=" + info + "&desc="+desc+"&reqMemGuid=" + merchantGUID + "&dstMemGuid=" + receiverMemGuid;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/member/createMemInfo?_method=POST&";
	method = "POST";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			getBankBranchNameVal(receiverMemGuid);
		} else {
		};
	});
};
var getBankBranchNameVal = function(receiverMemGuid){
	info_cd = "BANK_BRANCH_NAME";
	info = $("#bnkBranchName").val();
	desc = "receiver bank branch name";
    rawData = "callback=?&infoCd="+info_cd+"&priority="+priority+"&info=" + info + "&desc="+desc+"&reqMemGuid=" + merchantGUID + "&dstMemGuid=" + receiverMemGuid;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/member/createMemInfo?_method=POST&";
	method = "POST";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			getCashCommentVal(receiverMemGuid);
		} else {
		};
	});
};
var getCashCommentVal = function(receiverMemGuid){
	info_cd = "COMMENT";
	info = $("#comment").val();
	desc = "comment";
    rawData = "callback=?&infoCd="+info_cd+"&priority="+priority+"&info=" + info + "&desc="+desc+"&reqMemGuid=" + merchantGUID + "&dstMemGuid=" + receiverMemGuid;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/member/createMemInfo?_method=POST&";
	method = "POST";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			pushToRemmitanceDashBoard();
		} else {
		};
	});
};
var receiverBankInformation = function(receiverMemGuid) {
	getCashPickUpVal(receiverMemGuid);
};
var pushToRemmitanceDashBoard = function(){
	referenceId = $("#referenceID").val();
	sourceGuid  = $("#sendersGUID").val();
	destinationGuid = $("#receiversGUID").val();
	rawData = "callback=?&reqMemGuid=" + merchantGUID + "&srcMemGuid="+sourceGuid+"&dstMemGuid=" + destinationGuid + '&merchantMemGuid=PayGateNET&comment=Cross border compliance&refId='+referenceId;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/complianceDashboard?_method=POST&";
	
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			alert("Thank you, member virtual account number will be issued after verification is completed.");
			loadComplianceData();
		}
	});	
};

/**Submit remittence form**/
$("#submitRemitForm").click(function() {
	/**Create sender member By email**/
	var remittersEmail = $("#remittersEmail").val();
	rawData = "keyTp=EMAIL&callback=?&emailAddrss=" + remittersEmail + "&emailTp=PERSONAL&reqMemGuid=" + merchantGUID;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + "v5a/member/createMember?_method=POST&";
	method = "POST";
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status == "SUCCESS") {
			var memGuid = data.data.memGuid;
			updateSenderMemberInformation(memGuid);
		} else {
			
		}
	});
});

$("#resetSendersForm").click(function(){
	$('#remittersBasicForm')[0].reset();
	$('#remittersPassportForm')[0].reset();
});

$("#resetReceiversForm").click(function(){
	$('#receiversRemittenceForm')[0].reset();
	$('#receiversBankForm')[0].reset();	
});

