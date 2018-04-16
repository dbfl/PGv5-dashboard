var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";
var rowsPerPage = $("#rowsPerPage").val();
var merchantGUID = $.cookie("superGuid");
var KEY_ENC = $.cookie("pkey");
var isAdmin = $.cookie("isAdmin");
var num = 1;
var bits = 256;
var param;
var method = 'GET';
var rawData;

	
if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}

var koreanLanguage = function(){
	$("#merchantBalance").text(MERCHANT_BALANCE_KR);
	$("#merchantSeyBalance").text(MERCHANT_SEYFERT_BALANCE_KR);
	$("#memberBalance").text(MEMBER_BALANCE_KR);
	$("#memberSeyBalance").text(MEMBER_SEYFERT_BALANCE_KR);
	$("#grandTotal").text(GRAND_TOTAL_KR);
	$("#totalAccAmount").text(TOTAL_ACCUMULATED_AMOUNT_KR);
	$("#memberRegFre").text(MEMBER_REGISTRATION_FREQUENCY_KR);
	$("#memberRegLive").text(MEMBER_REGISTRATION_LIVE_KR);
	$("#regMember").text(REGISTERED_MEMBER_KR);
	$("#memberVerificationStatus").text(MEMBER_VERIFICATION_STATUS_KR);
	$("#emailStatus").text(EMAIL_KR);
	$("#phoneStatus").text(PHONE_KR);
	$("#pgv5SystemStatus").text(PGV5_SYSTEM_STATUS_KR);
	$("#currencyExchangeRate").text(CURRENCY_EXCHANGE_RATE_KR);
	$("#exchangeRate").text(EXCHANGE_RATE_KR);
	$("#highestTransAmount").text(HIGHEST_TRANSACTION_AMOUNT_KR);
};

var englishLanguage = function(){
	$("#merchantBalance").text(MERCHANT_BALANCE_EN);
	$("#merchantSeyBalance").text(MERCHANT_SEYFERT_BALANCE_EN);
	$("#memberBalance").text(MEMBER_BALANCE_EN);
	$("#memberSeyBalance").text(MEMBER_SEYFERT_BALANCE_EN);
	$("#grandTotal").text(GRAND_TOTAL_EN);
	$("#totalAccAmount").text(TOTAL_ACCUMULATED_AMOUNT_EN);
	$("#memberRegFre").text(MEMBER_REGISTRATION_FREQUENCY_EN);
	$("#memberRegLive").text(MEMBER_REGISTRATION_LIVE_EN);
	$("#regMember").text(REGISTERED_MEMBER_EN);
	$("#memberVerificationStatus").text(MEMBER_VERIFICATION_STATUS_EN);
	$("#emailStatus").text(EMAIL_EN);
	$("#phoneStatus").text(PHONE_EN);
	$("#pgv5SystemStatus").text(PGV5_SYSTEM_STATUS_EN);
	$("#currencyExchangeRate").text(CURRENCY_EXCHANGE_RATE_EN);
	$("#exchangeRate").text(EXCHANGE_RATE_EN);
	$("#highestTransAmount").text(HIGHEST_TRANSACTION_AMOUNT_EN);
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

var liveChart = function(){
	var updatingChart = $(".updating-chart").peity("line", { fill: '#269ABC',stroke:'#169c81', width: 200 });
	var updatingChart2 = $(".updating-chart2").peity("line", { fill: '#269ABC',stroke:'#169c81', width: 200 });
	var updatingChart3 = $(".updating-chart3").peity("line", { fill: '#269ABC',stroke:'#169c81', width: 200 });
	var updatingChart4 = $(".updating-chart4").peity("line", { fill: '#269ABC',stroke:'#269ABC', width: 200 });
	var random = Math.round(Math.random() * 10);
    var values = updatingChart.text().split(",");
    
    values.shift();
    values.push(random);

    updatingChart.text(values.join(",")).change();
    updatingChart2.text(values.join(",")).change();
    updatingChart3.text(values.join(",")).change();
    updatingChart4.text(values.join(",")).change();
};

var loadSeyfertTotalKRW = function(){
	rawData = 'callback=?&rowsperpage=10&page=0&reqMemGuid='+merchantGUID+'&listType=totalAmt&crrncyCd=KRW';
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
			if(status=="success"){
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$.ajaxSetup({ cache: false });
					$("#calWonGrandTotal").text("0000");
					$("#calWonGrandTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
				};
			}
		};
	});	
};

var loadSeyfertTotalUSD = function(){
	rawData = 'callback=?&rowsperpage=10&page=0&reqMemGuid='+merchantGUID+'&listType=totalAmt&crrncyCd=USD';
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		$.ajaxSetup({ cache: false });
		if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
			if(status=="success"){
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$.ajaxSetup({ cache: false });
						$("#calUsdGrandTotal").text("000");
						$("#calUsdGrandTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
					}	
				};
			}
	});	
};


var loadSeyfertMerchantTotalUSD = function(){
	rawData = 'rowsperpage=7&page=0&callback=?&reqMemGuid='+merchantGUID+'&listType=merTotalAmt&crrncyCd=USD';
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		$.ajaxSetup({ cache: false });
		if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
			for(var i=0;i < data.data.result.SeyfertList.length;i++){
				$.ajaxSetup({ cache: false });
				$("#merchantUsdTotal").text("0000");
				$("#merchantUsdTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
			}
		};
	});
};

var loadSeyfertMerchantTotalKRW = function(){
	rawData = 'rowsperpage=7&page=0&callback=?&reqMemGuid='+merchantGUID+'&listType=merTotalAmt&crrncyCd=KRW';
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		$.ajaxSetup({ cache: false });
		if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
			for(var i=0;i < data.data.result.SeyfertList.length;i++){
				$.ajaxSetup({ cache: false });
				$("#merchantWonTotal").text("0000");
				$("#merchantWonTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
				
			}
		};
	});
};

var loadSeyfertMemberTotalUSD = function(){
		rawData = 'rowsperpage=7&page=0&callback=?&reqMemGuid='+merchantGUID+'&listType=memTotalAmt&crrncyCd=USD';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			$.ajaxSetup({ cache: false });
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$.ajaxSetup({ cache: false });
					$("#memberUsdTotal").text("0000");
					$("#memberUsdTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
				}	
			};
		});
	};
	
	var loadSeyfertMemberTotalKRW = function(){
		rawData = 'rowsperpage=7&page=0&callback=?&reqMemGuid='+merchantGUID+'&listType=memTotalAmt&crrncyCd=KRW';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			$.ajaxSetup({ cache: false });
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$.ajaxSetup({ cache: false });
					$("#memberWonTotal").text("0000");
					$("#memberWonTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
				}	
			};
		});
	};



var getSeyfertLiveUpdate = function()
{
	loadSeyfertTotalKRW();
	loadSeyfertTotalUSD();
	loadSeyfertMerchantTotalUSD();
	loadSeyfertMerchantTotalKRW();
	loadSeyfertMemberTotalUSD();
	loadSeyfertMemberTotalKRW();
};

var getMemberLiveUpdate = function()
{
	rawData = 'callback=?&reqMemGuid='+merchantGUID;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/member/create/day?_method=GET&';
	
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		var datas = [];
		for(var i = 0; i < data.data.resultList.length;i++){
			datas.push([data.data.resultList[i].hh, data.data.resultList[i].count]);
		};
		
		 var barData = [{
	        label: "Member",
	        data: datas
		 }];
		
		var barOptions = {
		    series: {
		        bars: {show: true,barWidth: 0.6,fill: true,
		            fillColor: {
		                colors: [{
		                    opacity: 0.8
		                }, {
		                    opacity: 0.8
		                }]
		            }
		        }
		    },
		    xaxis: {tickDecimals: 0},
		    colors: ["#269ABC"],
		    grid: {color: "#999999",hoverable: true,clickable: true,tickColor: "#D4D4D4",borderWidth:0},
		    legend: {show: true},
		    tooltip: true,
		    tooltipOpts: {content: "time: %x, count: %y"}
		};
		
		$.plot($("#flot-dashboard-chart"),barData, barOptions);	
	});

	rawData = 'callback=?&reqMemGuid='+merchantGUID;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/member/email/stCnt?_method=GET&';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		$("#emailVerify").text(data.data.result.verified_emails);
	});
	
	rawData = 'callback=?&reqMemGuid='+merchantGUID;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/member/phone/stCnt?_method=GET&';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
	   	$("#phoneVerify").text(data.data.result.verified_phones);
	});
	
	/**Get total***/
	rawData = 'callback=?&reqMemGuid='+merchantGUID;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url3=TARGET_URI+'v5a/member/count?_method=GET&';
	
	AJAX_REQUEST.AJAX.CALL_SERVICE(url3,method,param,function(data,status){
		if(data.data.result.totalCount.length <=0){}
		else{
			$("#memberGrandTotal").text(data.data.result.totalCount);
		}
	});
};	

var getCurrencyExchageRate = function(){
	/**Get total***/
	rawData = 'callback=?&rowsPerPage=17&page=0&reqMemGuid='+merchantGUID+'&baseCrrncy=USD&dstCrrncy=KRW';
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url=TARGET_URI+'v5a/service/exchange?_method=GET&';
	
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		$("#currencyRate").text(data.data.result[0].crrncyRate);
	});	
};

var loadTopTenAcccountBalance = function(){
	rawData = 'callback=?&limit=10&page=1&reqMemGuid='+merchantGUID+'&top=ten';
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/admin/transaction/top?_method=GET&';
	method = 'GET';
	var translist = [];
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		if (data.data.transactionList != undefined && data.data.transactionList != null && data.data.transactionList !='') {
			if(status=="success"){
				for(var i = 0; i < data.data.transactionList.length;i++){
						
						$("#topGuid").text(data.data.transactionList[0].reqMemGuid);
						
						if(data.data.transactionList[0].orgCrrncy=="USD"){
							$("#topAmount").html("<i class='fa fa-dollar'></i> <span class=total> "+ currencyFormat(data.data.transactionList[0].orgAmt)+"</span>");	
						}
						
						if(data.data.transactionList[0].orgCrrncy=="CNY"){
							$("#topAmount").html("<i class='fa fa-cny'></i> <span class=total>"+ currencyFormat(data.data.transactionList[0].orgAmt)+"</span>");	
						}
						
						if(data.data.transactionList[0].orgCrrncy=="KRW"){
							$("#topAmount").html("<i class='fa fa-won'></i> <span class=total>"+ currencyFormat(data.data.transactionList[0].orgAmt)+"</span>");	
						}
					}
			}	
		};
	});
	
	var d = new Date();
	$("#todayDate").text(d.toDateString());
};


var checkSystemHealth = function(){
	/**Get total***/
	rawData = 'callback=?&limit=10&page=1&reqMemGuid='+merchantGUID+'&top=ten';
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/admin/transaction/top?_method=GET&';
	
	$.ajax({
		url:url+param,
		type: method,
		dataType:'jsonp',
		error:function(){
			$(".panel-heading").css("background-color","#CE8483");
			$("#systemStatus").text("Connection error !!");
			$("#systemStatusIcon").html("<i class='fa fa-medkit'></i>");
		},
		success:function(data, textStatus){
			if (data.data.transactionList != undefined && data.data.transactionList != null && data.data.transactionList !='') {
				$(".panel-heading").css("background-color","#586B7D");
				$("#systemStatus").text("System is stable");
				$("#systemStatusIcon").html("<i class='fa fa-heartbeat'></i>");
				$("#monitorSystemLabel").text("Monitoring system health");
				
				liveChart();
				//getCurrencyExchageRate();
				getMemberLiveUpdate();
				getSeyfertLiveUpdate();
				loadTopTenAcccountBalance();
				
				$(".updatingChart").show();
				$(".updatingChart2").show();
				$(".updatingChart3").show();
				$(".updatingChart4").show();
			}
			else{
				$(".panel-heading").css("background-color","#CE8483");
				$("#systemStatus").text("System is down !!");
				$("#systemStatusIcon").html("<i class='fa fa-medkit'></i>");	
				$("#monitorSystemLabel").text(" Please fix the issue!!!!");
			}	
		}
	});	
};

