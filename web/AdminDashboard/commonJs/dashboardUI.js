/**
 * @author athan
 */
	
	/**URI host declartion and initialization **/
	var HOST_URI = window.location.hostname;
	var TARGET_URI = "http://localhost:8080/";
	
	if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
	if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
	if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
	
	/**Declare Variables***/
	var num = 1;
	var rowsPerPage = 19;
	var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;
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
	
	/**INITIALIZE VARIABLES**/
	var isAdmin = $.cookie("isAdmin");
	merchantGUID = $.cookie("superGuid");
	KEY_ENC = $.cookie("pkey");
	
	$('span').tooltip();
	
	/**Check Login session**/
	if(typeof merchantGUID === 'undefined'){
		//window.location.href = 'login.html';
	}
	
	var koreanLanguage = function(){
		$("#dashStatisticLabel").text(STATISTICS_KR);
		$("#top10NameHeader").text(TRANSACTION_ID_KR);
		$("#menuDashboard").text(DASHBOARD_KR);
		$("#menuTransaction").text(TRANSACTION_KR);
		$("#menuSeyfert").text(SEYFERT_KR);
		$("#menuMerchant").text(MERCHANT_KR);
		$("#menuMember").text(MEMBER_KR);
		$("#memberTotalAmount").text(MEMBER_KR);
		$("#menuGrandTotal").text(GRAND_TOTAL_KR);
		$("#menuRoles").text(ROLES_KR);
		$("#createRoles").text(CREATE_ROLES_KR);
		$("#assignMemRoles").text(ASSIGN_MEMBER_ROLES_KR);
		$("#assignAPIRoles").text(ASSIGN_API_ROLES_KR);
		$("#memberVerification").text(NOTICE_KR);
		$("#tabNotice").text(NOTICE_KR);
		$("#noticeList").text(NOTICE_LIST_KR);
		$("#reloadNotice").text(RELOAD_KR);
		$("#createTicket").text(CREATE_TICKET_KR);
		$("#ticketTitle").text(TICKET_TITLE_KR);
		$("#ticketCreator").text(TICKET_CREATOR_KR);
		$("#ticketEmail").text(TICKET_EMAIL_KR);
		$("#ticketDate").text(TICKET_DATE_KR);
		$("#statistics").text(STATISTICS_KR);
		$("#sendQueries").text(SEND_QUERIES_KR);
		$("#createNotiName").text(NAME_KR);
		$("#createNotiEmail").text(EMAIL_KR);
		$("#createNotiTitle").text(TITLE_KR);
		$("#createNotiContent").text(CONTENT_KR);
		$("#createNotiSubmit").text(SUBMIT_KR);
		$("#totalAmountDaily").text(SEYFERT_TOTAL_AMOUNT_KR);
		$("#totalAmount").text(SEYFERT_DAILY_TOTAL_AMOUNT_KR);
		$("#registerMembered").text(REGISTERED_MEMBER_KR);
		$("#transactionFrequencyPerDay").text(TRANSACTION_FREQUENCY_PER_DAY_KR);
		$("#top50TransactionList").text(TOP_50_TRANSACTION_LIST_KR);
		$("#top10Highest").text(TOP_10_HIGHEST_ACCOUNT_KR);
		$("#top10HighestFollower").text(TOP_10_MEMBERS_WITH_HIGHEST_FOLLOWERS_KR);
		$("#hourBarChart").text(HOUR_KR);
		$("#dayBarChart").text(TODAY_KR);
		$("#top10Amt").text(AMT_KR);
		$("#top50NameHeader").text(TID_KR);
		$("#top50amtHeader").text(AMT_KR);
		$("#top50curHeader").text(DATE_KR);
		$("#top10amtHeader").text(AMT_KR);
		$("#top10curHeader").text(DATE_KR);
		$("#top10MFollowers").text(FOLLOWERS_KR);
		$("#grandTotalAmt").text(GRAND_TOTAL_KR);
		$("#grandTotalInfo").text(GRAND_TOTAL_INFO_KR);
		$("#dailyTotalAmt").text(TODAY_AMOUNT_TOTAL_KR);
		$("#registeredMember").text(REGISTERED_MEMBER_KR);
		$("#trnctnDetailList").text(PARENT_TRANSACTION_ID_KR);
		$("#completeListperTID").text(COMPLETE_LIST_PER_TID_KR);
		$("#transDetailPayAmtLabel").text(PAY_AMOUNT_KR);
		$("#transDetailPayCurncyLabel").text(PAY_CURRENCY_KR);
		$("#transDetailReqMemGuid").text(REQUEST_MEMBER_GUID_KR);
		$("#transDetailSourceMemGuid").text(SOURCE_MEMBER_GUID_KR);
		$("#transDetailDesMemGuid").text(DESTINATION_MEMBER_GUID_KR);
		$("#transDetailTransDate").text(TRANSACTION_DATE_KR);
		$("#transDetailLastTransStatusLabel").text(LAST_TRASACTION_STATUS_KR);
		//$("#transDetailTransTypeDef").text(SOURCE_MEMBER_GUID_EN);		
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
		$("#listtype").text(TYPE_KR);
		$("#listrefid").text(REFERENCE_ID_KR);
		$("#listtitle").text(TITLE_KR);		
		$("#listtransdate").text(TRANSACTION_DATE_KR);
   };
   
   var englishLanguage = function(){
	   $("#dashStatisticLabel").text(STATISTICS_EN);
   	   $("#top10NameHeader").text(TRANSACTION_ID_EN);
	   $("#menuDashboard").text(DASHBOARD_EN);
	   $("#menuTransaction").text(TRANSACTION_EN);
	   $("#menuSeyfert").text(SEYFERT_EN);
	   $("#menuMerchant").text(MERCHANT_EN);
	   $("#menuMember").text(MEMBER_EN);
	   $("#memberTotalAmount").text(MEMBER_EN);
	   $("#menuGrandTotal").text(GRAND_TOTAL_EN);
	   $("#menuRoles").text(ROLES_EN);
	   $("#createRoles").text(CREATE_ROLES_EN);
	   $("#assignMemRoles").text(ASSIGN_MEMBER_ROLES_EN);
	   $("#assignAPIRoles").text(ASSIGN_API_ROLES_EN);
	   $("#memberVerification").text(NOTICE_EN);
	   $("#tabNotice").text(NOTICE_EN);
	   $("#noticeList").text(NOTICE_LIST_EN);
	   $("#reloadNotice").text(RELOAD_EN);
	   $("#createTicket").text(CREATE_TICKET_EN);
	   $("#ticketTitle").text(TICKET_TITLE_EN);
	   $("#ticketCreator").text(TICKET_CREATOR_EN);
	   $("#ticketEmail").text(TICKET_EMAIL_EN);
	   $("#ticketDate").text(TICKET_DATE_EN);
	   $("#statistics").text(STATISTICS_EN);
	   $("#sendQueries").text(SEND_QUERIES_EN);
	   $("#createNotiName").text(NAME_EN);
	   $("#createNotiEmail").text(EMAIL_EN);
	   $("#createNotiTitle").text(TITLE_EN);
	   $("#createNotiContent").text(CONTENT_EN);
	   $("#createNotiSubmit").text(SUBMIT_EN);
	   $("#totalAmountDaily").text(SEYFERT_TOTAL_AMOUNT_EN);
	   $("#totalAmount").text(SEYFERT_DAILY_TOTAL_AMOUNT_EN);
	   $("#registerMembered").text(REGISTERED_MEMBER_EN);
	   $("#transactionFrequencyPerDay").text(TRANSACTION_FREQUENCY_PER_DAY_EN);
	   $("#top50TransactionList").text(TOP_50_TRANSACTION_LIST_EN);
	   $("#top10Highest").text(TOP_10_HIGHEST_ACCOUNT_EN);
	   $("#top10HighestFollower").text(TOP_10_MEMBERS_WITH_HIGHEST_FOLLOWERS_EN);
	   $("#hourBarChart").text(HOUR_EN);
	   $("#dayBarChart").text(TODAY_EN);
	   $("#top10Amt").text(AMT_EN);
	   $("#top50NameHeader").text(TID_EN);
	   $("#top50amtHeader").text(AMT_EN);
	   $("#top50curHeader").text(DATE_EN);
	   $("#top10amtHeader").text(AMT_EN);
	   $("#top10curHeader").text(DATE_EN);
	   $("#top10MFollowers").text(FOLLOWERS_EN);
	   $("#grandTotalAmt").text(GRAND_TOTAL_EN);
	   $("#grandTotalInfo").text(GRAND_TOTAL_INFO_EN);
	   $("#dailyTotalAmt").text(TODAY_AMOUNT_TOTAL_EN);
	   $("#registeredMember").text(REGISTERED_MEMBER_EN);
	   $("#trnctnDetailList").text(PARENT_TRANSACTION_ID_EN);
	   $("#completeListperTID").text(COMPLETE_LIST_PER_TID_EN);
	   $("#transDetailPayAmtLabel").text(PAY_AMOUNT_EN);
	   $("#transDetailPayCurncyLabel").text(PAY_CURRENCY_EN);
	   $("#transDetailReqMemGuid").text(REQUEST_MEMBER_GUID_EN);
	   $("#transDetailSourceMemGuid").text(SOURCE_MEMBER_GUID_EN);
	   $("#transDetailDesMemGuid").text(DESTINATION_MEMBER_GUID_EN);
	   $("#transDetailTransDate").text(TRANSACTION_DATE_EN);
	   $("#transDetailLastTransStatusLabel").text(LAST_TRASACTION_STATUS_EN);
	   //$("#transDetailTransTypeDef").text(SOURCE_MEMBER_GUID_EN);		
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
	
	
	/**Draw Table**/
	$('.footable').footable();
	
	var globalTicketNum;
	var viewTicket = function(ticketNumber){
		rawData = 'limit=1&page=1&listType=viewTicket&ticketNo='+ticketNumber+'&callback=?&reqMemGuid='+merchantGUID;
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/freshDesk?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			$("#ticketContent").html(data.data.result.ticketDescription);
			var ticketReponseArr = [];
			for(var i = 0;i < data.data.result.ticketResponse.length;i++){
				ticketReponseArr.push("<tr style='height:100px;border-bottom:1px solid #444444;'>");
				ticketReponseArr.push("<td>");
				ticketReponseArr.push("<div>");
				ticketReponseArr.push("<strong> Date </strong>");
				ticketReponseArr.push(data.data.result.ticketResponse[i].updateDate +"<br>");
				ticketReponseArr.push("</div>");
				ticketReponseArr.push("<div>");
				ticketReponseArr.push("<strong> From </strong>");
				ticketReponseArr.push(data.data.result.ticketResponse[i].fromEmail +"<br>");
				ticketReponseArr.push("</div>");
				ticketReponseArr.push("<div>");
				ticketReponseArr.push("<strong> To </strong>");
				ticketReponseArr.push(data.data.result.ticketResponse[i].toEmail +"<br>");
				ticketReponseArr.push("</div>");
				ticketReponseArr.push("<div>");
				ticketReponseArr.push("<strong> Content </strong>");
				ticketReponseArr.push(data.data.result.ticketResponse[i].replyContent +"<br>");
				ticketReponseArr.push("</div>");
				ticketReponseArr.push("</td>");
				ticketReponseArr.push("</tr>");
			}
			$("#loader").hide();		
			$("#ticketContentContainer").show();
			$("#ticketDetailContainer").show();			
			$("#ticketResponse").html(ticketReponseArr.join(""));
		});
	};
	
	$("#dashStatisticsTab").click(function(){
		$("#pagerFooter").hide();
	});
	
	$("#noticeTab").click(function(){
		$("#pagerFooter").show();
	});
	
	var loadTicketListPaging = function(page){
		loadTicketList(page);
	};
	
	/*
	 * noticeUpdateDisplay function
	 * 
	 */
	
	var noticeUpdateDisplay = function(verify,ticketNo,currentPage) {				
		rawData = 'limit='+rowsPerPage+'&page='+currentPage+'&listType=updateTicketStatus&callback=?&reqMemGuid='+merchantGUID+'&ticketDisplay='+verify+'&ticketNo='+ticketNo;
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/freshDesk?_method=GET&';			
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			if(data.status=="SUCCESS"){
				alert(data.status);
				loadTicketList(currentPage);
			} else{
				alert("error");
			}
		});
		
	};
	
	var loadTicketList = function(page){
		if(page == null || page < 1){
			page = 0;
		};
		currentPage  = page;
    	rawData = 'limit='+rowsPerPage+'&page='+currentPage+'&listType=listAll&callback=?&reqMemGuid='+merchantGUID;
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/freshDesk?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			if(status=="success"){
				var ticketList = [];
				if (data.data.result.ticketList != undefined && data.data.result.ticketList != null && data.data.result.ticketList !='') {
					for(var i = 0; i < data.data.result.ticketList.length;i++){
						ticketList.push("<tr class='gradeX' style='height:30px;'>");
						ticketList.push("<td style='color:#444444;cursor:pointer'><a><strong style='overflow:hidden; text-overflow: ellipsis; word-wrap: break-word;white-space: nowrap;display:block;width:250px;' class='viewTicket' data-email-attr="+data.data.result.ticketList[i].creatorEmail+" data="+data.data.result.ticketList[i].ticketItemNo+">"+data.data.result.ticketList[i].ticketTitle+"</strong></a></td>");
						ticketList.push("<td>"+data.data.result.ticketList[i].ticketItemNo+"</strong></td>");
						ticketList.push("<td style='color:#586B7D;cursor:pointer'><strong  data-placement='top' data-toggle='tooltip' href='#' data-original-title='vew detail'>"+data.data.result.ticketList[i].user+"</strong></td>");
						ticketList.push("<td>"+data.data.result.ticketList[i].creatorEmail+"</strong></td>");
						var createDate = new Date(data.data.result.ticketList[i].createDt);
						var standardDate = createDate.toUTCString();
						ticketList.push("<td>"+standardDate+"</strong></td>");
						
						if(data.data.result.ticketList[i].ticketDisplay == "true") {
							ticketList.push("<td> <span style='cursor:pointer;font-weight:bold;' class='CancelButton text-navy'> <i class='fa fa-check-square-o'></i> inView  </span>");													 							
						} else if(data.data.result.ticketList[i].ticketDisplay == "false") {
							ticketList.push("<td> <span style='cursor:pointer;font-weight:bold;' class='AcceptButton  text-danger'> <i class='fa fa-question-circle'></i> verify </span>");
						}						 
						
						//var checkTicketDisplay = data.data.result.ticketList[i].ticketDisplay;
						/*var checkTicketDisplay = 'false';
						 *
						 * 
						if(checkTicketDisplay=="true"){
							ticketList.push("<td> <a class='text-success' style='cursor:pointer;font-weight:bold;' datas='false'> Verified  </a></td>");
						}
						else{
							ticketList.push("<td> <a class='updateViewStatus text-danger' style='cursor:pointer;font-weight:bold;' datas='true'> verify </a></td>");	
						}
						*/
						ticketList.push("</tr>");
					}
					
					total = data.data.result.ticketList[0].totalRows;
					
					$("#ticketList").html(ticketList.join(""));
					
					/*
					 *	noticeUpdateDisplay function call
					 */
							
					var ticketNo;
					
					$('.AcceptButton').click(function() {
					ticketNo = $(this).closest("tr").find("td strong:eq(0)").attr("data");											
						
						noticeUpdateDisplay(true,ticketNo,currentPage);						
 						
					});	
					
					
					$('.CancelButton').click(function() {
					ticketNo = $(this).closest("tr").find("td strong:eq(0)").attr("data");
						
						noticeUpdateDisplay(false,ticketNo,currentPage);								
						
					});
					
					
					$(".viewTicket").click(function(){
						$("#ticketContentContainer").hide();
						$("#ticketDetailContainer").hide();
						$("#loader").show();			
						$("#ticketResponse").empty();
						$("#ticketContent").empty();
						$("#openTicktDetails").trigger("click");
						var ticketNumber = $(this).attr("data");
						var creatorEmail = $(this).attr("data-email-attr");
						globalTicketNum = ticketNumber;
						viewTicket(ticketNumber);
						$("#replyTicketItemNo").val(ticketNumber);
						$("#replyEmail").val(creatorEmail);
					});
					/*
					$('.updateViewStatus').click(function(){
						var tstatus = $(this).attr("datas");
						var upTicketNo = $(this).closest("tr").find("td strong:eq(0)").attr("data");
						
						alert(tstatus);
						alert(upTicketNo);
						
						rawData = 'limit=1&page=1&listType=updateTicketStatus&callback=?&reqMemGuid='+merchantGUID;
						param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
						url = TARGET_URI+'v5a/service/freshDesk?_method=GET&';
						method = 'PUT';
						AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
							alert(data.status);
							if(data.status=="true"){
								loadTicketList();	
							}else{};
						});
					});
					*/
					/***Add paging event***/
					var limitView = rowsPerPage*page;
					var paggingTxt = pagging_ajax(total, rowsPerPage, "loadTicketListPaging",page);
					$(".pagingCon").html(paggingTxt['start'] + paggingTxt['list'] + paggingTxt['end']);
					
				}else{
					$("#ticketList").html("No data to display");
				};
			}				
		});
    };
   	
   	$("#createTicketCall").click(function(){
   		$("#openCreateTicket").trigger("click");
   		$("#createTicketButton").click(function(){
   			var checkSendTo = $("#receiver").val();
   			if(checkSendTo == "none"){
   				alert("Please select sendTo option!");
   			}else{
	   			rawData = 'limit=4&page=1&listType=createTicket&callback=?&reqMemGuid='+merchantGUID+'&'+$("#createTicketForm").serialize();
	   			param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
				url = TARGET_URI+'v5a/service/freshDesk?_method=GET&';
				method = 'GET';
				AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
					alert(data.status);
					loadTicketList(1);
				});		
			};		
		});
   	});
   	
   	$("#replyTicket").click(function(){
		var username = $("#replyUsername").val();
		var replyEmail = $("#replyEmail").val();
		var replyContent = $("#replyContent").val();
		var replyDomain = $("#replyDomain").val();
		var replyTicketItemNo = $("#replyTicketItemNo").val();
		if(isAdmin=="true"){
			userType = "admin";
			$("#replyEmail").attr("placeholder","Receiver's email");
		}else{
			userType = "merchant";
			$("#replyEmail").attr("placeholder","Sender's email");
		}
		rawData = 'userType='+userType+'&limit=40&page=1&listType=replyTicket&callback=?&guid='+merchantGUID+'&commentUsername='+username+'&commentEmail='+replyEmail+'&commentTicketItemNo='+replyTicketItemNo+'&commentContent='+replyContent+'&commentDomain='+replyDomain;
		url = TARGET_URI+'v5a/service/freshDesk?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,rawData,function(data,status){
			alert(data.status);
			viewTicket(globalTicketNum);
		});
	});
   
    var loadTopFiftyTransaction = function(){
    	rawData = 'reqMemGuid='+merchantGUID+'&top=fifty&callback=data&limit=50&page=1';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/admin/transaction/top?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			responseData = data;
			var translist = [];
			if (responseData.data.transactionList != undefined && responseData.data.transactionList != null && responseData.data.transactionList !='') {
				if(status=="success"){
					for(var i = 0; i < responseData.data.transactionList.length;i++){
						translist.push("<tr class='gradeX' style=height:30px;>");
						translist.push("<td style='color:#586B7D;cursor:pointer'><strong class='getransDetail top' data-placement='top' data-toggle='tooltip' href='#' data-original-title='view detail' >"+responseData.data.transactionList[i].tid+"</strong></td>");
						if(data.data.transactionList[i].orgCrrncy=="USD"){
							translist.push("<td><i class='fa fa-dollar'></i> "+ currencyFormat(responseData.data.transactionList[i].orgAmt)+"</td>");	
						}
						
						if(data.data.transactionList[i].orgCrrncy=="CNY"){
							translist.push("<td><i class='fa fa-cny'></i> "+ currencyFormat(responseData.data.transactionList[i].orgAmt)+"</td>");	
						}
						
						if(data.data.transactionList[i].orgCrrncy=="KRW"){
							translist.push("<td><i class='fa fa-won'></i> "+ currencyFormat(responseData.data.transactionList[i].orgAmt)+"</td>");	
						}
						transactionDate = dateFunction(data.data.transactionList[i].trnsctnDt);
						//transactionDate = new Date(responseData.data.transactionList[i].trnsctnDt);
						//standardDate = transactionDate.toUTCString();
						//standardDate = transactionDate;
						
						
						translist.push("<td>"+transactionDate+"</td>");
						translist.push("</tr>");	
					}
					
					$("#dashTop50").html(translist.join('')).trigger('footable_redraw');
					$('strong').tooltip();
					
					$(".getransDetail").click(function(){
						var tid = $(this).text();
						$.cookie("transactionId", tid);
						PopupCenterDual('transactionUI/detailContent.html','Transaction details','900','800');
					});
				}
			}else{}
		});		
	};	
	
	var loadMemberHigFollower = function(){
		rawData = 'callback=?&reqMemGuid='+merchantGUID;
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/member/mostFollowed?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			var memberlist = [];
			if (data.data.resultList != undefined && data.data.resultList != null && data.data.resultList !='') {
				for(var i = 0; i < data.data.resultList.length;i++){
							memberlist.push("<tr class='gradeX' style='height:30px;'>");
							memberlist.push("<td style='color:#586B7D;cursor:pointer'><strong class='getMemberDetail top' data-placement='top' data-toggle='tooltip' href='#' data-original-title='view detail'>"+data.data.resultList[i].guid+"</strong></td>");
							memberlist.push("<td>"+data.data.resultList[i].followers_count+"</td>");
							memberlist.push("</tr>");	
				}
				
				$("#top10MemberList").html(memberlist.join('')).trigger('footable_redraw');
				$('strong').tooltip();
				
				/**Get Detail Info**/
				$(".getMemberDetail").click(function(){
					var destinationGuid = $(this).text();
					$.cookie("destinationGuid", destinationGuid);
					PopupCenterDual('memberUI/detailContent.html','Member details','900','800');
				});
			};
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
							translist.push("<tr class='gradeX' style='height:30px;'>");
							translist.push("<td style='color:#586B7D;cursor:pointer'><strong class='getMemberDetail' data-placement='top' data-toggle='tooltip' href='#' data-original-title='view detail'>"+data.data.transactionList[i].reqMemGuid+"</strong></td>");
							
							if(data.data.transactionList[i].orgCrrncy=="USD"){
								translist.push("<td><i class='fa fa-dollar'></i> "+ currencyFormat(data.data.transactionList[i].orgAmt)+"</td>");	
							}
							
							if(data.data.transactionList[i].orgCrrncy=="CNY"){
								translist.push("<td><i class='fa fa-cny'></i> "+ currencyFormat(data.data.transactionList[i].orgAmt)+"</td>");	
							}
							
							if(data.data.transactionList[i].orgCrrncy=="KRW"){
								translist.push("<td><i class='fa fa-won'></i> "+ currencyFormat(data.data.transactionList[i].orgAmt)+"</td>");	
							}
							
							
							translist.push("</tr>");	
						}
						
					$("#dashTop10").html(translist.join('')).trigger('footable_redraw');
					loadMemberHigFollower();
				}	
			};
		});
	};	
	
	var loadgisteredMembers = function(){
    	rawData = 'callback=?&rowsperpage=50&page=0&reqMemGuid='+merchantGUID+'&listType=top&topfifty=topFifty';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/member/count?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			if (data.data.result != undefined && data.data.result != null && data.data.result !='') {
				if(status=="success"){
					$("#registerMembers").text(data.data.result.totalCount);
				}
			};
		});	
	};
	
	var loadSeyfertTotalKRW = function(){
    	rawData = 'callback=?&rowsperpage=10&page=0&reqMemGuid='+merchantGUID+'&listType=totalAmt&crrncyCd=KRW';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				if(data.status=="SUCCESS"){
					for(var i=0;i < data.data.result.SeyfertList.length;i++){
						if(data.data.result.SeyfertList.length <=0){
							$("#dashTotalAmount").text(currencyFormat(0));
							$("#dashTotalAmountToday").text(0);
							$("#dashTotalAmountDaily").text(0);
						}else{
							
							$("#grandTotalWon").text("");
							$("#todayTotalWon").text("");
							$("#calWonGrandTotal").text("");
							
							$("#grandTotalWon").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
							$("#todayTotalWon").text(currencyFormat(data.data.result.SeyfertList[i].todayAmt));
							$("#calWonGrandTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
						}	
					};
					/*$("#dashTotalAmount").click(function(){
						$("#seyfertNaviMenu").trigger("click");
					});
					
					$("#registerMembers").click(function(){
						$("#memberNaviMenu").trigger("click");
					});
					*/
					loadgisteredMembers();
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
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				if(status=="success"){
					for(var i=0;i < data.data.result.SeyfertList.length;i++){
						if(data.data.result.SeyfertList.length <=0){
							$("#dashTotalAmount").text(currencyFormat(0));
							$("#dashTotalAmountToday").text(0);
							//$("#dashTotalAmountDaily").text(0);
						}else{
							
							$("#grandTotalDollar").text("");
							$("#todayTotalDollar").text("");
							$("#calUsdGrandTotal").text("");
							
							$("#grandTotalDollar").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
							$("#todayTotalDollar").text(currencyFormat(data.data.result.SeyfertList[i].todayAmt));
							$("#calUsdGrandTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
						}	
					};
					
					/*$("#dashTotalAmount").click(function(){
						$("#seyfertNaviMenu").trigger("click");
					});
					
					$("#registerMembers").click(function(){
						$("#memberNaviMenu").trigger("click");
					});
					*/
					//loadSeyfertTotalKRW();
				}
			};
		});	
	};
	
	var loadSeyfertTotalJPY = function(){
    	rawData = 'callback=?&rowsperpage=10&page=0&reqMemGuid='+merchantGUID+'&listType=totalAmt&crrncyCd=JPY';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				if(status=="success"){
					for(var i=0;i < data.data.result.SeyfertList.length;i++){
						if(data.data.result.SeyfertList.length <=0){
							$("#dashTotalAmount").text(currencyFormat(0));
							$("#dashTotalAmountToday").text(0);
							//$("#dashTotalAmountDaily").text(0);
						}else{
							
							$("#grandTotalJpy").text("");
							$("#todayTotalJpy").text("");
							$("#calJpyGrandTotal").text("");
							
							$("#grandTotalJpy").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
							$("#todayTotalJpy").text(currencyFormat(data.data.result.SeyfertList[i].todayAmt));
							$("#calJpyGrandTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
						}	
					};
				}
			};
		});	
	};
	
	var loadSeyfertMerchantTotalUSD = function(){
		rawData = 'rowsperpage=7&page=0&callback=?&reqMemGuid='+merchantGUID+'&listType=merTotalAmt&crrncyCd=USD';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$("#merchantUsdTotal").text("");
					$("#merchantUsdTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));	
				}
			};
		});
		
		loadSeyfertMerchantTotalKRW();
	};
	
	var loadSeyfertMerchantTotalJPY = function(){
		rawData = 'rowsperpage=7&page=0&callback=?&reqMemGuid='+merchantGUID+'&listType=merTotalAmt&crrncyCd=JPY';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$("#merchantJpyTotal").text("");
					$("#merchantJpyTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));	
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
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$("#merchantWonTotal").text("");
					//alert(data.data.result.SeyfertList[i].totalAmt);
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
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$("#memberUsdTotal").text("");
					$("#memberUsdTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
				}	
			};
		});
		
		loadSeyfertMemberTotalKRW();
	};
	
	var loadSeyfertMemberTotalJPY = function(){
		rawData = 'rowsperpage=7&page=0&callback=?&reqMemGuid='+merchantGUID+'&listType=memTotalAmt&crrncyCd=JPY';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/service/seyfertList?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$("#memberJpyTotal").text("");
					$("#memberJpyTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
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
			if (data.data.result.SeyfertList != undefined && data.data.result.SeyfertList != null && data.data.result.SeyfertList !='') {
				for(var i=0;i < data.data.result.SeyfertList.length;i++){
					$("#memberWonTotal").text("");
					$("#memberWonTotal").text(currencyFormat(data.data.result.SeyfertList[i].totalAmt));
				}	
			};
		});
	};
    
    var callhourChart = function(){
		$("#barChartTitle").text("Transaction frequency per hour ");
		rawData = 'callback=?&rowsperpage=10&page=0&reqMemGuid='+merchantGUID+'&graph=hour';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/admin/transaction/graph?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			if(data.status !="SUCCESS" || status !="success"){
				$.removeCookie("superGuid");
				$.removeCookie("pkey");
				$.removeCookie("isAdmin");
				//$.removeCookie("loadedPage");
				
				$.cookie("superGuid", null,{path: '/', domain: 'paygate.net',secure: true});
				$.cookie("pkey", null,{path: '/', domain: 'paygate.net',secure: true});
				$.cookie("isAdmin",null,{path: '/', domain: 'paygate.net',secure: true});
				
				//window.location = 'login.html';					
			}
			else{
				var datas = [];
				if (data.data.graphList != undefined && data.data.graphList != null && data.data.graphList !='') {
					for(var i = 0; i < data.data.graphList.length;i++){
						//datas.push([data.data.result.trnsctnList[i].minute, data.data.result.trnsctnList[i].orgTotAmt]);
						datas.push([data.data.graphList[i].mm, data.data.graphList[i].cnt]);
					}
				};
				
				var barData = [{
			        label: "Transaction",
			        data: datas
	    		}];
	    		
	    		var barOptions = {
				    series: {
				    	//stack: true,
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
				    colors: ["#EF597B"],
				    grid: {color: "#999999",hoverable: true,clickable: true,tickColor: "#D4D4D4",borderWidth:0},
				    legend: {show: true},
				    tooltip: true,
				    tooltipOpts: {content: "min: %x, cnt: %y"}
				};
				
				$.plot($("#flot-dashboard-Hourchart"),barData, barOptions);		
			}
		});
	};	
	
	var callDayChart = function(){
		$("#barChartTitle").text("Transaction frequency per day ");
		rawData = 'callback=?&rowsperpage=10&page=0&reqMemGuid='+merchantGUID+'&graph=day';
		param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
		url = TARGET_URI+'v5a/admin/transaction/graph?_method=GET&';
		method = 'GET';
		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
			var countDatas = [];
			var amounData = [];
			
			if (data.data.graphList != undefined && data.data.graphList != null && data.data.graphList !='') {
				for(var i = 0; i < data.data.graphList.length;i++){
					countDatas.push([data.data.graphList[i].hh, data.data.graphList[i].cnt]);
					//amounData.push([data.data.graphList[i].hh, data.data.graphList[i].orgTotAmt]);
				}
			};
			
			var series = [{
		        data: countDatas,
		        label: "count"
		    }/*,
		    {
		        data: amounData,
		        label: "amount"
		    }*/];
		    
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
			    colors: ["#EF597B"],
			    grid: {color: "#999999",hoverable: true,clickable: true,tickColor: "#D4D4D4",borderWidth:0},
			    legend: {show: true},
			    tooltip: true,
			    tooltipOpts: {content: "hh: %x, cnt: %y"}
			};
			
			/***DRAW CHART****/
			$.plot($("#flot-dashboard-Daychart"),series, barOptions);
		});
	};
	
	$("#reloadNotice").click(function(){
		alert("coming soon!");
	});
	
	$("#createTicket").click(function(){
		/*$("#noticeContainerButton").trigger("click");*/
		alert("coming soon!");
	});
	
	$("#hourBarChart").click(function(){
		$("#flot-dashboard-Daychart").fadeOut(function(){
			$("#flot-dashboard-Hourchart").fadeIn();	
		});
		callhourChart();	
		$(".transCharBut").removeClass('active');
		$(this).addClass('active');
	});
	
	$("#dayBarChart").click(function(){
		$("#flot-dashboard-Hourchart").fadeOut(function(){
			$("#flot-dashboard-Daychart").fadeIn();	
		});
		callDayChart();
		$(".transCharBut").removeClass('active');
		$(this).addClass('active');
	});
	
	$("#maxdashChart").click(function(){
		$("#dashGrandTotalDetailContainer").fadeOut(function(){
			$("#maxdashChart").hide();
			$("#mindashChart").show();
			$("#dashChartContainer").removeClass("col-lg-8");
			$("#dashChartContainer").addClass("col-lg-12");		
		});
	});
	
	$("#minGrandTotalDetail").click(function(){
		$("#maxdashChart").hide();
		$("#mindashChart").show();
		$("#dashGrandTotalDetailContainer").fadeOut(function(){
			$("#dashChartContainer").removeClass("col-lg-8");
			$("#dashChartContainer").addClass("col-lg-12");		
		});
	});
	
	$("#mindashChart").click(function(){
		$("#maxdashChart").show();
		$("#mindashChart").hide();
		$("#dashChartContainer").removeClass("col-lg-12");
		$("#dashChartContainer").addClass("col-lg-8");
		$("#dashGrandTotalDetailContainer").fadeIn();
	});
	
	$("#24HrsTransaction").click(function(){
		$("#flot-dashboard-DaychartContainer").show();
		$("#flot-dashboard-HourchartContainer").hide();
	});
	
	$("#hourTransaction").click(function(){
		$("#flot-dashboard-DaychartContainer").hide();
		$("#flot-dashboard-HourchartContainer").show();
	});
	
	/*
   setInterval(function(){
   		callhourChart();
   		callDayChart();
   		loadSeyfertTotal();
   		loadegisteredMembers();
   },10000);
   */
    
/**INTIALIZE FIRST FUNCTION***/

callDayChart();
callhourChart();
loadSeyfertTotalUSD();
loadSeyfertTotalKRW();
loadSeyfertTotalJPY();
loadTopFiftyTransaction();
loadTopTenAcccountBalance();
loadSeyfertMerchantTotalUSD();
loadSeyfertMerchantTotalJPY();
loadSeyfertMemberTotalUSD();
loadSeyfertMemberTotalJPY();
loadTicketList(1);
