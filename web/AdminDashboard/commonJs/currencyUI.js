/**
 * @author Gabriel
 */

var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";

if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
var isAdmin = $.cookie("isAdmin");
var num = 1;
var rowsPerPage = 6;
var $this;

var memberListPage = function(page){
	memberList(page);
};


var exchangeEightAmRate = function(page){
	if(page == null || page < 1){
		page = 0;
	};
	currentPage  = page;
	var bits = 256;
	
	var merchantGUID = $.cookie("superGuid");
	var KEY_ENC = $.cookie("pkey");

	var formData = decodeURIComponent('callback=?&reqMemGuid='+merchantGUID);
	var utf8encoded = pidCryptUtil.decodeUTF8(formData);
	
	var aes = new pidCrypt.AES.CTR();
	aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
	
	var crypted = aes.encrypt();
	var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
	$.ajax({
		url:TARGET_URI+'v5a/service/eightAmExchangeRate?_method=GET&'+params,
		type:'GET',
		async:false,
		dataType:'jsonp',
		error:function(){alert("Error");},
		success:function(data){
			var currencyValues = [];
			if (data.status != "SUCCESS") {
				if(data.data.cdDesc=="SESSION_EXPIRED"){
					alert(data.data.cdDesc);
					$.removeCookie("superGuid");
					$.removeCookie("pkey");
					$.removeCookie("isAdmin");
					//$.removeCookie("loadedPage");
					
					$.cookie("superGuid", null,{path: '/', domain: 'paygate.net',secure: true});
					$.cookie("pkey", null,{path: '/', domain: 'paygate.net',secure: true});
					$.cookie("isAdmin",null,{path: '/', domain: 'paygate.net',secure: true});
					
					window.location = 'login.html';	
				}else{
					alert(data.data.cdDesc);	
				}	
			}else{
				if (data.data.result != undefined && data.data.result != null && data.data.result != '') {
					for(var i=0;i<data.data.result.length;i++){
						$("#currencyRate").text(data.data.result[i].crrncyRate);	
					}
				}else{
					$("#currencyRate").text("0.00");
				}
			}
		}
	});
		

};
	
$(document).ready(function(){
	$("#srcCrrncy,#dstCrrncyForm").chosen();
	clearInterval(timer);
	//exchangeEightAmRate();
	if (isAdmin == "true") {
		$("#merchantExchange").hide();
	}

	var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;
	var koreanLanguage = function(){
		$("#statistics").text(STATISTICS_KR);
		$("#tabExchange").text(EXCHANGE_KR);
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
		$("#menuBaseCurrency").text(BASE_CURRENCY_KR);
		$("#menuDesCurrency").text(DESTINATION_CURRENCY_KR);
		$("#menuRate").text(EXCHANGE_RATE_KR);
		$("#xeExValues").text(XE_CURRENCY_EXCHANGE_VALUES_KR);
		$("#xeBaseCurrency").text(BASE_CURRENCY_KR);
		$("#xeDesCurrency").text(DESTINATION_CURRENCY_KR);
		$("#xeRate").text(EXCHANGE_RATE_KR);
		$("#xeDate").text(DATE_KR);
		$("#crrncyExchangeSimulator").text(CURRENCY_EXCHANGE_SIMULATOR_KR);
		$("#exchangeAmount").text(AMOUNT_KR);
		$("#baseCurrency").text(BASE_CURRENCY_KR);
		$("#destinationCurrency").text(DESTINATION_CURRENCY_KR);
		$("#simulate").text(SIMULATE_KR);
		$("#exchangeRate").text(EXCHANGE_RATE_KR);
		$("#exchange").text(EXCHANGE_KR);
		$("#exchangeRate").text(EXCHANGE_RATE_KR);
		$("#expectedDtlLabel").text(EXPECTED_AMOUNT_KR);
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
		$("#expectedDtlLabel").text(EXPECTED_AMOUNT_EN);
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
	
	
	$("#memberSearchForm :input").val('');
	
	var bits = 256;
	var merchantGUID = $.cookie("superGuid");
	var KEY_ENC = $.cookie("pkey");
	
	if(typeof merchantGUID === 'undefined'){
		window.location.href = 'login.html';
	}
	
	$("#dstGuid").val('');
	$("#fullname").val('');
	$("#email").val('');
	$("#phone").val('');
	
	var formData = decodeURIComponent('callback=?&reqMemGuid='+merchantGUID);
	var utf8encoded = pidCryptUtil.decodeUTF8(formData);
	var aes = new pidCrypt.AES.CTR();
	aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
	var crypted = aes.encrypt();
	var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
	
	
	$('.footable').footable();
    $("#advanceBut").click(function(){
    	$("#frequencyChartCon").fadeOut(function(){
    		$("#frequencyChartCon2").fadeOut(function(){
    			$("#advSearchCon").fadeIn();	
    		});
    	});
    });
	
	$("#closeAdvSearchCon").click(function(){
		$("#advSearchCon").fadeOut(function(){
			$("#frequencyChartCon").fadeIn();
			$("#frequencyChartCon2").fadeIn();
		});
		$("#memberSearchForm :input").val('');
	});	
	
	/**Timer***/
	var myCounter = new Countdown({  
	    seconds:59,  // number of seconds to count down
	    onUpdateStatus: function(sec){
	    	$("#doExchange").removeAttr("disabled");
	    	$("#counterText").text(sec + " Seconds left to exchange with current rate..");
	    	//$this.button('reset');
	    },
	    onCounterEnd: function(){ 
	    	$("#counterText").css("color","#BD362F");
	    	$("#counterText").text('Time out, please simulate exchange rate again!');
	    	$("#doExchange").attr("disabled","disabled");
	    	$("#expectedRateAmount").text("0.00");
			$("#rateDtl").text("0.00");
			$("#expectedAmountContainer").hide();
	    }
	});
	
	$("#simulateCurrencyExchange").click(function(){
		var tid = $(this).text();
		$("#simulate").text('Please wait ...');
		$(this).prop('disabled', true);
		$("#counterText").css("color","#0055B3");
		//loadingPannel.show();
		//$("#detailPage").load("currencyUI/detailContent.html#currencyDtlCon",function(){			
			var bits = 256;
			
			var merchantGUID = $.cookie("superGuid");
			var KEY_ENC = $.cookie("pkey");
			
			var formSrcAmt = ENCODE_URI_COMPONENT($("#srcAmt").val());
			var formDstCrrncy = ENCODE_URI_COMPONENT($("#dstCrrncyForm").val());
			var formSrcCrrncy = ENCODE_URI_COMPONENT($("#srcCrrncy").val());

			var formData = 'callback=?&reqMemGuid='+ENCODE_URI_COMPONENT(merchantGUID)+'&srcAmt=' + formSrcAmt + "&dstCrrncy=" + formDstCrrncy + "&srcCrrncy=" + formSrcCrrncy;
			var utf8encoded = pidCryptUtil.decodeUTF8(formData);
						
			var aes = new pidCrypt.AES.CTR();
			aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
			
			var crypted = aes.encrypt();
			
			var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
			
			if (formSrcAmt != undefined && formSrcAmt != "" && formDstCrrncy != undefined && formDstCrrncy != "" && formSrcCrrncy != undefined && formSrcCrrncy != "") {	
				$.ajax({
						url:TARGET_URI+'v5a/exchange/inquiry?_method=POST&'+params,
						type:'GET',
						async:false,
						dataType:'jsonp',
						error:function(){
							alert("Error");
							$this.button('reset');
							//loadingPannel.hide();
						},
						success:function(data){
							//loadingPannel.hide();
							myCounter.start();
							var status = data.status;
							if (status != "SUCCESS") {
								//$this.button('reset');
								if(data.data.cdDesc=="SESSION_EXPIRED"){
									alert(data.data.cdDesc);
									$.removeCookie("superGuid");
									$.removeCookie("pkey");
									$.removeCookie("isAdmin");
									//$.removeCookie("loadedPage");
									
									$.cookie("superGuid", null,{path: '/', domain: 'paygate.net',secure: true});
									$.cookie("pkey", null,{path: '/', domain: 'paygate.net',secure: true});
									$.cookie("isAdmin",null,{path: '/', domain: 'paygate.net',secure: true});
									
									window.location = 'login.html';	
								}else{
									alert(data.data.cdDesc);	
								}
								
							}else {
								var orginalAmt = data.data.srcAmt + " " + data.data.srcCrrncy;
								var dstAmt = data.data.dstAmt + " " + data.data.dstCrrncy;
								var rate = data.data.rate;
								
								$("#rateDtl").text(rate);
								
								$("#expectedRateAmount").text(dstAmt);
								$("#expectedAmountContainer").show();
								$("#doExchange").show();
								$("#counterText").show();
							}
							
							$("#simulateCurrencyExchange").removeAttr("disabled");
							$('#simulateCurrencyExchange').html('<i class="fa fa-simplybuilt"></i> <span id="simulate" style="font-weight:bold;font-size: 14px;">Simulate</span>');
						}
					});		
			} else {
				$("#simulateCurrencyExchange").removeAttr("disabled");
				$('#simulateCurrencyExchange').html('<i class="fa fa-simplybuilt"></i> <span id="simulate" style="font-weight:bold;font-size: 14px;">Simulate</span>');
				alert("Please fill the form correctly");
				//loadingPannel.hide();
			}
			
			$("#doExchange").click(function(){
				$(this).text('Please wait ...');
				$(this).prop('disabled', true);
				var expectedRate = $("#rateDtl").text();
				var formData2 = 'callback=?&reqMemGuid='+ENCODE_URI_COMPONENT(merchantGUID)+'&srcAmt=' + formSrcAmt + "&dstCrrncy=" + formDstCrrncy + "&srcCrrncy=" + formSrcCrrncy + "&expectedRate=" + expectedRate;
				var utf8encoded2 = pidCryptUtil.decodeUTF8(formData2);
							
				var aes2 = new pidCrypt.AES.CTR();
				aes2.initEncrypt(utf8encoded2, KEY_ENC, {nBits: bits});
				
				var crypted2 = aes2.encrypt();
				
				var params2 = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted2);
				
				$.ajax({
					url:TARGET_URI+'v5a/exchange/process?_method=POST&'+params2,
					type:'GET',
					async:false,
					dataType:'jsonp',
					error:function(){
						alert("Error");
						//loadingPannel.hide();
					},
					success:function(data){
						$("#detailButon").trigger("click");		
						//loadingPannel.hide();
						
						var orginalAmt = data.data.srcAmt + " " + data.data.srcCrrncy;
						var dstAmt = data.data.dstAmt + " " + data.data.dstCrrncy;
						var rate = data.data.rate;

						var status = data.status;
						
						if (status != "SUCCESS") {
							if (data.data.cdKey == "NOT_ENOUGH_SEYFERT_BALANCE"){
								alert("Not enough Seyfert Balance. Please charge more money");
							}	
							else if (data.data.cdKey == "EXPECTED_RATE_INCORRECT"){
								alert("Rate has changed, please make a new simulation");
							}
							else if(data.data.cdDesc=="SESSION_EXPIRED"){
								alert(data.data.cdDesc);
								$.removeCookie("superGuid");
								$.removeCookie("pkey");
								$.removeCookie("isAdmin");
								//$.removeCookie("loadedPage");
								
								$.cookie("superGuid", null,{path: '/', domain: 'paygate.net',secure: true});
								$.cookie("pkey", null,{path: '/', domain: 'paygate.net',secure: true});
								$.cookie("isAdmin",null,{path: '/', domain: 'paygate.net',secure: true});
								
								window.location = 'login.html';	
							}
							else{
								alert("Error: " + data.data.cdKey);
							}	

						} else {
							alert('Money exchanged: ' + orginalAmt + " to " + dstAmt);
						}
						
						$("#doExchange").removeAttr("disabled");
						$("#doExchange").html('<i class="fa fa-exchange"></i> <span style="font-weight:bold;font-size: 14px;" id="exchange">Exchange</span>');
					}
				});		
			});
		//});
	});
});