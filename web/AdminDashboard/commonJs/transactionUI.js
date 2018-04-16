/**
 * @author athan
 */
/**URI host declaration and initialization **/
$("button").tooltip();
$('span').tooltip();
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

/**Declare Variables***/
var num = 1;
var rowsPerPage = $("#rowsPerPage").val();
var singleSearchVal = false;
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

var BROWSER_LANG = window.navigator.userLanguage || window.navigator.language;
var koreanLanguage = function() {
	$("#menuDashboard").text(DASHBOARD_KR);
	$("#menuTransaction").text(TRANSACTION_KR);
	$("#menuSeyfert").text(SEYFERT_KR);
	$("#menuMember").text(MEMBER_KR);
	$("#totalAmt").text(TOTAL_AMOUNT_KR);
	$("#statistics").text(STATISTICS_KR);
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
	$("#listDownload").text(DOWNLOAD_KR);

	$("#transDetailBasicInfo").text(BASIC_INFO_KR);
	$("#trnctnDetailList").text(PARENT_TRANSACTION_ID_KR);
	$("#transDetailRefId").text(REFERENCE_ID_KR);
	$("#completeListperTID").text(COMPLETE_LIST_PER_TID_KR);
	$("#transDetailPayAmtLabel").text(PAY_AMOUNT_KR);
	$("#transDetailPayCurncyLabel").text(PAY_CURRENCY_KR);
	$("#transDetailReqMemGuid").text(REQUEST_MEMBER_GUID_KR);
	$("#transDetailSourceMemGuid").text(SOURCE_MEMBER_GUID_KR);
	$("#transDetailDesMemGuid").text(DESTINATION_MEMBER_GUID_KR);
	$("#transDetailTransDate").text(TRANSACTION_DATE_KR);
	$("#transDetailLastTransStatusLabel").text(LAST_TRASACTION_STATUS_KR);
	//$("#transDetailTransTypeDef").text(SOURCE_MEMBER_GUID_EN);

	$("#listcompletedate").text(COMPLETION_DATE_KR);
	$("#transDetailTransStat").text(TRANSACTION_STATUS_KR);
	$("#transDetailTransTp").text(TRANSACTION_TYPE_KR);
	$("#transDetailUpdateDt").text(UPDATE_DATE_KR);
	$("#transDetailOriginAmt").text(ORIGINAL_AMOUNT_KR);
	$("#transDetailOriginCurr").text(ORIGINAL_CURRENCY_KR);
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

var englishLanguage = function() {
	$("#menuDashboard").text(DASHBOARD_EN);
	$("#menuTransaction").text(TRANSACTION_EN);
	$("#menuSeyfert").text(SEYFERT_EN);
	$("#menuMember").text(MEMBER_EN);
	$("#totalamt").text(TOTAL_AMOUNT_EN);
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
	$("#labelOriginAmount").text(ORIGINAL_AMOUNT_EN);
	$("#labelCurrency").text(CURRENCY_EN);
	$("#labelRefid").text(REFERENCE_ID_EN);
	$("#labelReqmemguid").text(REQUEST_MEMBER_GUID_EN);
	$("#labelSrcmemguid").text(SOURCE_MEMBER_GUID_EN);
	$("#labelDesmemguid").text(DESTINATION_MEMBER_GUID_EN);
	$("#labelTransDate").text(TRANSACTION_DATE_EN);
	$("#labelUpdateDate").text(UPDATE_DATE_EN);

	$("#trnctnDetailList").text(PARENT_TRANSACTION_ID_KR);
	$("#completeListperTID").text(COMPLETE_LIST_PER_TID_EN);
	$("#transDetailPayAmtLabel").text(PAY_AMOUNT_EN);
	$("#transDetailPayCurncyLabel").text(PAY_CURRENCY_EN);
	$("#transDetailReqMemGuid").text(REQUEST_MEMBER_GUID_EN);
	$("#transDetailSourceMemGuid").text(SOURCE_MEMBER_GUID_EN);
	$("#transDetailDesMemGuid").text(DESTINATION_MEMBER_GUID_EN);
	$("#transDetailTransDate").text(TRANSACTION_DATE_EN);
	$("#transDetailLastTransStatusLabel").text(LAST_TRASACTION_STATUS_EN);
	//$("#transDetailTransTypeDef").text(SOURCE_MEMBER_GUID_EN);
	$("#listcompletedate").text(COMPLETION_DATE_EN);
	$("#transDetailTransStat").text(TRANSACTION_STATUS_EN);
	$("#transDetailTransTp").text(TRANSACTION_TYPE_EN);
	$("#transDetailUpdateDt").text(UPDATE_DATE_EN);
	$("#transDetailOriginAmt").text(ORIGINAL_AMOUNT_EN);
	$("#transDetailOriginCurr").text(ORIGINAL_CURRENCY_EN);
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
	$("#listtype").text(TYPE_EN);
	$("#listrefid").text(REFERENCE_ID_EN);
	$("#listtitle").text(TITLE_EN);
	$("#listtransdate").text(TRANSACTION_DATE_EN);
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

$("#koreanLang").click(function() {
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

/**INITIALIZE VARIABLES**/
var isAdmin = $.cookie("isAdmin");
merchantGUID = $.cookie("superGuid");
KEY_ENC = $.cookie("pkey");

/***Date Picker setting**/
$('#data_1 .input-group.date').datepicker({
	todayBtn : "linked",
	keyboardNavigation : false,
	forceParse : false,
	calendarWeeks : true,
	autoclose : true,
	format : 'yyyymmdd'
});

/**initialize transaction type and status selectbox value***/
var transactionTypeList = [];
var transactionStatusList = [];

transactionTypeList.push("<option value=''>ALL</option>");
for (var k = 0; k < transactionType.data.length; k++) {
	transactionTypeList.push("<option value=" + transactionType.data[k].cd_key + ">" + transactionType.data[k].cd_key + "</option>");
};

$("#trnsctnTp").html(transactionTypeList.join(""));

$("#trnsctnTp").chosen({
	width : "100%;"
});

transactionStatusList.push("<option value=''>ALL</option>");
for (var k = 0; k < transactionStatus.data.length; k++) {
	transactionStatusList.push("<option value=" + transactionStatus.data[k].cd_key + ">" + transactionStatus.data[k].cd_key + "</option>");
};

$("#trnsctnSt").html(transactionStatusList.join(""));
$("#trnsctnSt").chosen({
	width : "100%;"
});

$("#orgCrrncy").chosen({
	width : "108px;"
});
$("#payCrrncy").chosen({
	width : "108px;"
});

var transactionListPage = function(page) {
	loadTransactionList(page);
};

var loadTransactionList = function(page) {
	$("#vloader").modal("show");
	if (page == null || page < 0) {
		page = 0;
	};

	currentPage = page;
	var searchParams = decodeURIComponent($("#searchForm :input").filter(function(index, element) {
		return $(element).val() != "";
	}).serialize());

	if (singleSearchVal === false) {
		rawData = searchParams + '&limit=' + rowsPerPage + '&page=' + currentPage + '&callback=data&reqMemGuid=' + merchantGUID;
	} else {
		rawData = 'limit=' + rowsPerPage + '&page=1&callback=data&reqMemGuid=' + merchantGUID + '&date=' + singleSearchVal;
	}

	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/admin/transaction/list?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var translist = [];
		var childTransaction;
		$('#transListJsonFormat').val(JSON.stringify(data.data.transactionList));
		if (data.data.transactionList.length <= 0) {
			translist.push("<tr class='gradeX' style='height:30px;'> <td colspan=7 style=text-align:center;color:red> <strong> Sorry there is no data available. </strong> </td></tr>");
			$("#transactionList").html(translist.join(''));
		} else {
			var toolTip;
			for (var i = 0; i < data.data.transactionList.length; i++) {
				translist.push("<tr class='gradeX' style='height:30px;'>");
				//alert(data.data.transactionList[i].childCTransactions.length);
				if (data.data.transactionList[i].childCTransactions.length != 0) {
					translist.push("<td style=cursor:pointer;color:#586B7D> <a class='parentTid' style='font-weight:bold;cursor:pointer;font-size:16px;'>+</a> <strong class='getransDetail top' data-placement='top' data-toggle='tooltip' href='#' data-original-title='view detail'>" + data.data.transactionList[i].tid + "</strong></td>");
				} else {
					translist.push("<td style=cursor:pointer;color:#586B7D> <a> - </a> <strong class='getransDetail top' data-placement='top' data-toggle='tooltip' href='#' data-original-title='view detail'>" + data.data.transactionList[i].tid + "</strong></td>");
				}
				var title = data.data.transactionList[i].title;
				var dataTitle;

				if (title == "undefined" || title == "" || title == null) {
					dataTitle = "--";
				} else {
					dataTitle = title;
				}

				translist.push("<td>" + dataTitle + "</td>");

				if (data.data.transactionList[i].orgCrrncy == "USD") {
					toolTip = "orginal-amount";
					translist.push("<td><i class='fa fa-dollar'></i> <strong data-placement='top' data-toggle='tooltip' href='#' data-original-title="+toolTip+">" + currencyFormat(data.data.transactionList[i].orgAmt) + "</strong></td>");
				}

				if (data.data.transactionList[i].orgCrrncy == "CNY") {
					toolTip = "orginal-amount";
					translist.push("<td><i class='fa fa-cny'></i> <strong data-placement='top' data-toggle='tooltip' href='#' data-original-title="+toolTip+">" + currencyFormat(data.data.transactionList[i].orgAmt) + "</strong></td>");
				}

				if (data.data.transactionList[i].orgCrrncy == "KRW") {
					toolTip = "orginal-amount";
					translist.push("<td><i class='fa fa-won'></i> <strong data-placement='top' data-html='true' data-toggle='tooltip' href='#' data-original-title="+toolTip+">" + currencyFormat(data.data.transactionList[i].orgAmt) + "</strong></td>");
				}

				if (data.data.transactionList[i].orgCrrncy == "JPY") {
					toolTip = "orginal-amount";
					translist.push("<td><i class='fa fa-jpy'></i> <strong data-placement='top' data-toggle='tooltip' href='#' data-original-title="+toolTip+">" + currencyFormat(data.data.transactionList[i].orgAmt) + "</strong></td>");
				}

				translist.push("<td style='display:none;'>" + data.data.transactionList[i].orgCrrncy + "</td>");

				if (data.data.transactionList[i].payCrrncy == "USD") {
					translist.push("<td style='display:none'><i class='fa fa-dollar'></i> " + currencyFormat(data.data.transactionList[i].payAmt) + "</td>");
				}

				if (data.data.transactionList[i].payCrrncy == "CNY") {
					translist.push("<td style='display:none'><i class='fa fa-cny'></i> " + currencyFormat(data.data.transactionList[i].payAmt) + "</td>");
				}

				if (data.data.transactionList[i].payCrrncy == "KRW") {
					translist.push("<td style='display:none'><i class='fa fa-won'></i> " + currencyFormat(data.data.transactionList[i].payAmt) + "</td>");
				}

				if (data.data.transactionList[i].payCrrncy == "JPY") {
					translist.push("<td style='display:none'><i class='fa fa-jpy'></i> " + currencyFormat(data.data.transactionList[i].payAmt) + "</td>");
				}

				translist.push("<td style='display:none;'>" + data.data.transactionList[i].payCrrncy + "</td>");

				translist.push("<td><a style='color:#444444;' class='transType' data-placement='top' data-toggle='tooltip' href='#' data-original-title='transaction  type'>" + data.data.transactionList[i].trnsctnTp + "</a></td>");

				//translist.push("<td>"+data.data.transactionList[i].payAmt+"</td>");
				//translist.push("<td>"+data.data.transactionList[i].payAmt+"</td>");
				//transactionDate = new Date(data.data.transactionList[i].trnsctnDt);
				//standardDate = transactionDate.toUTCString();

				/***Temporary replace transaction date with update date***/
				var tdate = data.data.transactionList[i].updateDt;
				var transdate = dateFunction(tdate);

				translist.push("<td>" + data.data.transactionList[i].trnsctnSt + "</td>");
				translist.push("<td><i class='fa fa-clock-o'></i> " + transdate + "</td>");

				/*var cdate = data.data.transactionList[i].cmpltDt;
				 if(cdate =="undefined" || cdate =="" || cdate ==null ){
				 translist.push("<td>---</td>");
				 }else{
				 translist.push("<td><i class='fa fa-clock-o'></i> " + dateFunction(cdate)+"</td>");
				 }*/

				translist.push("</tr>");
				if (data.data.transactionList[i].childCTransactions != 'undefined' || data.data.transactionList[i].childCTransactions != null) {
					for (var k = 0; k < data.data.transactionList[i].childCTransactions.length; k++) {
						//alert(data.data.transactionList[i].childCTransactions[k].tid);
						translist.push("<tr class='gradeX childRows' style='height:30px;display:none;color:#E6E6DC'>");
						translist.push("<td style=cursor:pointer;color:#ffffff> <a style='margin-left:3px;color:#ffffff'> <i class='fa fa-hand-o-right'></i> </a> <strong class='getransDetail top' data-placement='top' data-toggle='tooltip' href='#' data-original-title='view detail'>" + data.data.transactionList[i].childCTransactions[k].tid + "</strong></td>");
						var title = data.data.transactionList[i].title;
						var dataTitle;

						if (title == "undefined" || title == "" || title == null) {
							dataTitle = "--";
						} else {
							dataTitle = title;
						}

						translist.push("<td>" + dataTitle + "</td>");

						if (data.data.transactionList[i].orgCrrncy == "USD") {
							toolTip = "orginal-amount";
							translist.push("<td><i class='fa fa-dollar'></i> <strong data-placement='top' data-toggle='tooltip' href='#' data-original-title="+toolTip+">" + currencyFormat(data.data.transactionList[i].childCTransactions[k].orgAmt) + "</strong></td>");
						}

						if (data.data.transactionList[i].orgCrrncy == "CNY") {
							toolTip = "orginal-amount";
							translist.push("<td><i class='fa fa-cny'></i> <strong data-placement='top' data-toggle='tooltip' href='#' data-original-title="+toolTip+">" + currencyFormat(data.data.transactionList[i].childCTransactions[k].orgAmt) + "</strong></td>");
						}

						if (data.data.transactionList[i].orgCrrncy == "KRW") {
							toolTip = "orginal-amount";
							translist.push("<td><i class='fa fa-won'></i> <strong data-placement='top' data-toggle='tooltip' href='#' data-original-title="+toolTip+">" + currencyFormat(data.data.transactionList[i].childCTransactions[k].orgAmt) + "</strong></td>");
						}

						if (data.data.transactionList[i].orgCrrncy == "JPY") {
							toolTip = "orginal-amount";
							translist.push("<td><i class='fa fa-jpy'></i> <strong data-placement='top' data-toggle='tooltip' href='#' data-original-title="+toolTip+">" + currencyFormat(data.data.transactionList[i].childCTransactions[k].orgAmt) + "</strong></td>");
						}

						translist.push("<td style='display:none;'>" + data.data.transactionList[i].orgCrrncy + "</td>");

						if (data.data.transactionList[i].payCrrncy == "USD") {
							translist.push("<td style='display:none'><i class='fa fa-dollar'></i> " + currencyFormat(data.data.transactionList[i].childCTransactions[k].payAmt) + "</td>");
						}

						if (data.data.transactionList[i].payCrrncy == "CNY") {
							translist.push("<td style='display:none'><i class='fa fa-cny'></i> " + currencyFormat(data.data.transactionList[i].childCTransactions[k].payAmt) + "</td>");
						}

						if (data.data.transactionList[i].payCrrncy == "KRW") {
							translist.push("<td style='display:none'><i class='fa fa-won'></i> " + currencyFormat(data.data.transactionList[i].payAmt) + "</td>");
						}

						if (data.data.transactionList[i].payCrrncy == "JPY") {
							translist.push("<td style='display:none'><i class='fa fa-jpy'></i> " + currencyFormat(data.data.transactionList[i].childCTransactions[k].payAmt) + "</td>");
						}

						translist.push("<td style='display:none;'>" + data.data.transactionList[i].childCTransactions[k].payCrrncy + "</td>");

						translist.push("<td><a class='transType' style='color:#ffffff' data-placement='top' data-toggle='tooltip' href='#' data-original-title='transaction  type'>" + data.data.transactionList[i].childCTransactions[k].trnsctnTp + "</a></td>");

						/***Temporary replace transaction date with update date***/
						var tdates = data.data.transactionList[i].updateDt;
						var transdates = dateFunction(tdates);

						translist.push("<td>" + data.data.transactionList[i].trnsctnSt + "</td>");
						translist.push("<td><i class='fa fa-clock-o'></i> " + transdates + "</td>");

						translist.push("</tr>");
					}
				}
			}

			//childTransaction = data.data.transactionList[i].childCTransactions;
		}

		$("#transactionList").html(translist.join('')).trigger('footable_redraw');
		$('.footable-page a').filter('[data-page="0"]').trigger('click');
		$("#vloader").modal("hide");
		$('strong').tooltip({html: true});
		$('.transType').tooltip();

		//var total = data.data.result.totalCount;
		var total = data.data.totalRecord;
		var limitView = rowsPerPage * page;
		var paggingTxt = pagging_ajax(total, rowsPerPage, "transactionListPage", page);
		$(".pagingCon").html(paggingTxt['start'] + paggingTxt['list'] + paggingTxt['end']);

		$("tr.childRows:odd").css("background-color", "#8C9C9A");
		$("tr.childRows:even").css("background-color", "#8C9C9A");

		$(".parentTid").click(function() {

			if ($(this).text() == "+") {
				$(this).text("-");
				$(this).closest("tr").nextAll(".childRows").show();
			} else {
				$(this).text("+");
				$(this).closest("tr").nextAll(".childRows").hide();
			};
			//$curRow = $(this).parent().parent();
			/*$newRow = [];
			 arrChildList = childTransaction;

			 $newRow.push("<tr>");
			 $newRow.push("<td>1</td>");
			 $newRow.push("<td>3</td>");
			 $newRow.push("<td>4</td>");
			 $newRow.push("<td>5</td>");
			 $newRow.push("<td>6</td>");
			 $newRow.push("<td>7</td>");
			 $newRow.push("<td>8</td>");
			 $newRow.push("</tr>");
			 $curRow.after($newRow.join(''));*/
		});

		$(".getransDetail").click(function() {
			var tid = $(this).text();
			$.cookie("transactionId", tid);
			PopupCenterDual('transactionUI/detailContent.html', 'Transaction details', '900', '860');
		});
	});
};

var loadHourChart = function() {
	$("#barChartTitle").text("Transaction frequency per hour ");
	rawData = 'callback=?&rowsperpage=10&page=0&reqMemGuid=' + merchantGUID + '&graph=hour';
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/admin/transaction/graph?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (data.status != "SUCCESS" || status != "success") {
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
			var datas = [];
			for (var i = 0; i < data.data.graphList.length; i++) {
				//datas.push([data.data.result.trnsctnList[i].minute, data.data.result.trnsctnList[i].orgTotAmt]);
				datas.push([data.data.graphList[i].mm, data.data.graphList[i].cnt]);
			};

			var barData = [{
				label : "Transaction",
				data : datas
			}];

			var barOptions = {
				series : {
					//stack: true,
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
				colors : ["#EF597B"],
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
					content : "mm: %x, cnt: %y"
				}
			};

			$.plot($("#flot-dashboard-chart_hour"), barData, barOptions);
		}
	});
};

var loadDayChart = function() {
	rawData = 'callback=?&rowsperpage=10&page=0&reqMemGuid=' + merchantGUID + '&graph=day';
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/admin/transaction/graph?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (status == "success") {
			var datas = [];
			for (var i = 0; i < data.data.graphList.length; i++) {
				datas.push([data.data.graphList[i].hh, data.data.graphList[i].cnt]);
			};

			var barData = [{
				label : "Transaction",
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
				colors : ["#EF597B"],
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
					content : "hh: %x, cnt: %y"
				}
			};

			$.plot($("#flot-dashboard-chart_day"), barData, barOptions);

			$("#flot-dashboard-chart_day").bind("plotclick", function(event, pos, item) {
				/*$("#listType").val('advance');

				 var isAdmin = $.cookie("isAdmin");

				 if(isAdmin=="true"){
				 $("#searchMemGuid").val('');
				 }else{
				 $("#searchMemGuid").val('');
				 //$("#searchMemGuid").val($.cookie("superGuid"));
				 }
				 */
				if (item) {
					alert(item.dataIndex);
					var now = new Date();
					var fromDate = yyyymmdd(now);
					var toDate = yyyymmdd(now);
					var starthour = item.dataIndex;
					var endhour = item.dataIndex + 1;

					$("#fromDate").val(fromDate);
					$("#toDate").val(toDate);
					$("#fromTime").val(starthour + "0000");
					$("#toTime").val(endhour + "0000");
					//$("#advSearchTrigger").trigger("click");
				}
			});
		}
	});

	loadHourChart();
};

var loadTotalAmount = function() {
	rawData = 'callback=?&limit=12&page=1&reqMemGuid=' + merchantGUID + '';
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/admin/transaction/total?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		if (status == "success") {
			if (data.data.total.length <= 0) {
				$("#transTotalAmount").text(0);
				$("#transDailyTotal").text(0);
				$("#trans24hrsTotal").text(0);
				//$("#transLastWeekTotal").text(0);
			} else {
				for (var i = 0; i < data.data.total.length; i++) {
					if (data.data.total[i].orgCrrncy == "KRW" && data.data.total[i].payCrrncy == "KRW") {
						$("#transTotalAmount").text(currencyFormat(data.data.total[i].payAmt));
						$("#transDailyTotal").text(currencyFormat(data.data.total[i].todayPayAmt));
						$("#trans24hrsTotal").text(currencyFormat(data.data.total[i].yesterdayPayAmt));
					} else {
					}
				}
			}
		}
	});
};

$("#24HrsTransaction").click(function() {
	$("#flot-dashboard-chart_dayContainer").show();
	$("#flot-dashboard-chart_hourContainer").hide();
});

$("#hourTransaction").click(function() {
	$("#flot-dashboard-chart_dayContainer").hide();
	$("#flot-dashboard-chart_hourContainer").show();
});

$("#closeAdvSearchCon").click(function() {
	$("#searchMemGuid").val('');
	$("#searchContainer").fadeOut(function() {
		$("#chartContainer").fadeIn();
	});
});

$("#advanceBut").click(function() {
	$("#singleSearchVal").val('');
	$("#chartContainer").fadeOut(function() {
		$("#searchContainer").fadeIn();
	});
});

$("#advSearchTrigger").click(function() {
	if ($('#titleLike').is(":checked")) {
		$("#transactionTitle").attr("name", "titleLike");
	} else {
		$("#transactionTitle").attr("name", "title");
	}

	if ($('#referenceLike').is(":checked")) {
		$("#transactionReferenceId").attr("name", "refIdLike");
	} else {
		$("#transactionReferenceId").attr("name", "refId");
	};

	if ($("#transactionTidMulti").is(":checked")) {
		$("#transactionTid").attr("name", "tidList");
	} else {
		$("#transactionTid").attr("name", "tid");
	};

	loadTransactionList(1);
});

$("#rowsPerPage").change(function() {
	var value = $(this).val();
	rowsPerPage = value;
	loadTransactionList(1);
});

$(".filterBut").click(function() {
	$(".filterBut").removeClass("active");
	$(".listAll").removeClass("active");
	$(this).addClass("active");
	// var searchValue = $(this).val();
	// singleSearchVal = searchValue;
	$('#searchForm').trigger("reset");
	checkSelectedBut($(this).val());
	loadTransactionList(1);
});

$(".listAll").click(function() {
	$(".filterBut").removeClass("active");
	$(".listAll").addClass("active");
	singleSearchVal = false;
	$('#searchForm').trigger("reset");
	loadTransactionList(1);
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
}

var checkSelectedBut = function(val) {
	console.log("===> checkSelectedBut args : " + val);
	singleSearchVal = false;
	var date = new Date();
	var month = ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
	var day = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
	var dateStr = date.getFullYear() + "" + month + "" + day;
	var todaysDate = dateStr;
	var yesterdaysDate = date.getFullYear() + "" + month + "" + day - 1;
	
	//Last week
	var beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000),
    day = beforeOneWeek.getDay(),
    diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1),
    lastMonday = new Date(beforeOneWeek.setDate(diffToMonday)),
    lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));

	var lastWeekStart = new Date(lastMonday).toDateString("yyyymmdd");
	var lastWeekEnd = new Date(lastSunday).toDateString("yyyymmdd");

   var formatLastWeekStart  = formatDate(lastWeekStart);
   var formatLastWeekEnd  = formatDate(lastWeekEnd);
   
   //Last month
   var now = new Date();
   var lastday  = new Date(now.getFullYear(), now.getMonth(), 0);
   var firstday = new Date(lastday.getFullYear(), lastday.getMonth(), 1);
   var lastMonth = firstday.getDate()+'/'+(firstday.getMonth()+1)+'/'+firstday.getFullYear()+' - '+lastday.getDate()+'/'+(firstday.getMonth()+1)+'/'+lastday.getFullYear();
        
   var formatLastMonthStart  = formatDate(firstday);
   var formatLastMonthEnd  = formatDate(lastday);   
   
   if (val == "today") {
		$("#trnsctnDtFrom").val(todaysDate);
		$("#trnsctnDtTo").val(todaysDate);
	} else if (val == "yesterday") {
		$("#trnsctnDtFrom").val(yesterdaysDate);
		$("#trnsctnDtTo").val(yesterdaysDate);
	} else if (val == "lastweek") {
		$("#trnsctnDtFrom").val(formatLastWeekStart);
		$("#trnsctnDtTo").val(formatLastWeekEnd);
	} else if (val == "lastmonth") {
		$("#trnsctnDtFrom").val(formatLastMonthStart);
		$("#trnsctnDtTo").val(formatLastMonthEnd);
	}else {
		$("#trnsctnDtFrom").val('');
		$("#trnsctnDtTo").val('');
	}
};

$("#downloadTransExcel").click(function() {
	/**Method 1**/
	/*var data = $('#transListJsonFormat').val();
	if(data == '')
	return;
	JSONToCSVConvertor(data, "Acl Data", true);
	*/
	/***Method 2****/
	$("#transactionTable").btechco_excelexport({
		containerid : "transactionTable",
		datatype : $datatype.Table
	});
	$(this).attr('download', 'ExportToExcel.xls');
});

checkSelectedBut('today');
loadTransactionList(1);
loadDayChart();
loadHourChart();
loadTotalAmount();

/***Set interval****/
/*setInterval(function(){
 loadHourChart();
 },10000);*/
