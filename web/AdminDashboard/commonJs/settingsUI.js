var TARGET_URI = 'http://localhost:8080/';

if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
var rawData;
var param;
var url;
var method;
var categoryId;
var optionId;
var listValueGroup;
var merchantGUID = $.cookie("superGuid");
var KEY_ENC;

KEY_ENC = $.cookie("pkey");

var loadCategory = function() {
	rawData = 'callback=data&reqMemGuid='+merchantGUID;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI + 'v5a/settings/category?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var catList = [];
		if(data.data.resultList=="undefined" || data.data.resultList==undefined){
			alert("session time out!");
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
		}else{
			for (var i = 0; i < data.data.resultList.length; i++) {
				catList.push("<li> <span data-attr = " + data.data.resultList[i].categoryId + " class='categoryItem'> " + data.data.resultList[i].categoryNm + " <span> </li>");
			}	
			if(data.status=="SUCCESS"){
				
				$("#categoryList").html(catList.join(""));
				
				$(".categoryItem").click(function() {
					$("#categoryListOptions span").html("loading..");
					$(".categoryItem").css("color", "#666666");
					$(this).css("color", "#0055AA");
					categoryId = $(this).attr("data-attr");
					
					rawData = 'callback=data&reqMemGuid='+merchantGUID+'&categoryId='+categoryId;
					param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
					url = TARGET_URI + 'v5a/settings/option?_method=GET&';
					method = 'GET';
					AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
						var catListOption = [];
						for (var i = 0; i < data.data.resultList.length; i++) {
							catListOption.push("<li>");
							catListOption.push("<div class=col-lg-5><span class='categoryItem'> " + data.data.resultList[i].optNm + " <span/></div>");
							catListOption.push("<div class=col-lg-3 style='text-align:center;'>");
							catListOption.push("</div>");
							catListOption.push("<div class=col-lg-4><span class='pull-right optionValEdit' ui-type=" + data.data.resultList[i].listTp + " data-attr = " + data.data.resultList[i].optId + "> <i class='fa fa-edit'></i> view</span></div>");
							catListOption.push("</li>");
							catListOption.push("<li class='optionCon' style='display:none;'>");
							catListOption.push("<div class='settingOptionClass'>");
							catListOption.push("<div class='itemCon'>");
							catListOption.push("<form class='optionForm'>");
							catListOption.push("<input type=hidden name='categoryId' value=" + data.data.resultList[i].categoryId + ">");
							catListOption.push("<input type=hidden name='optId' value=" + data.data.resultList[i].optId + ">");
							catListOption.push("<div class=itemLoader> loading.. </div>");
							catListOption.push("</form>");
							catListOption.push("</div>");
							catListOption.push("</div>");
							catListOption.push("</li>");
						}
						
						$("#categoryListOptions").html(catListOption.join(""));
						
						$(".optionValEdit").click(function() {
							var thisItemBut = $(this);
							thisItemBut.closest("li").next(".optionCon").find(".itemLoader").html("");
							optionId = $(this).attr("data-attr");
							var uiType = $(this).attr("ui-type");
							var settngType = $(this).closest("div").prev().find("span.setType").attr("dataAttr");
							var drawOptionsField = [];
							rawData = 'callback=data&reqMemGuid='+merchantGUID+'&categoryId='+categoryId+'&optId=' + optionId;
							param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
							url = TARGET_URI + 'v5a/settings/option?_method=GET&';
							method = 'GET';
							AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
								if (uiType == "CHECKBOX") {
									var itemArr = [];
									var checkAvailListCode;
									for (var k = 0; k < data.data.resultList.length; k++) {
										checkAvailListCode = data.data.resultList[k].listCd;
										for (var l = 0; l < data.data.resultList[k].availableCodes.length; l++) {
											itemArr.push(data.data.resultList[k].availableCodes[l].cdKey);
											itemArr.push(" <input type='checkbox' class='checkBoxVal' value='' data-arr=" + data.data.resultList[k].availableCodes[l].cdKey + "> ");
										}
									}
									//itemArr.push(" <a class=getAvailableCodes> save</a>");
									thisItemBut.closest("li").next(".optionCon").find(".itemLoader").html(itemArr.join(""));
									var datas = [];
									var checkVal = $('.checkBoxVal');
									var datas = [];
									$(checkVal).each(function() {
										var sThisVal = ($(this).attr("data-arr"));
										datas.push(sThisVal);
									});
	
									var datas1 = datas.join(",");
									var datas2;
									
									rawData = 'callback=data&reqMemGuid='+merchantGUID+'&categoryId='+categoryId+'&optId=' + optionId;
									param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
									url = TARGET_URI + 'v5a/settings/optValues?_method=GET&';
									method = 'GET';
									AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
										var defData = [];
										var defDataHidden = [];
										for (var def = 0; def < data.data.resultList.length; def++) {
											if (data.data.resultList[def].listValueGrp != '' || data.data.resultList[def].listValueGrp != null || data.data.resultList[def].listValueGrp != undefined) {
												listValueGroup = data.data.resultList[def].listValueGrp;
											} else {
												listValueGroup = "null";
											}
											defData.push(data.data.resultList[def].listValue);
											defDataHidden.push("<input class='texthiddenOpt' type='hidden' data-attr=" + data.data.resultList[def].listValue + " value=" + data.data.resultList[def].optValId + ">");
										}
	
										datas2 = defData;
										for (var chkDef = 0; chkDef < datas2.length; chkDef++) {
											$(checkVal).each(function() {
												if ($(this).attr("data-arr") == datas2[chkDef]) {
													$(this).attr('checked', true);
												}
											});
										}
	
										thisItemBut.closest("li").next(".optionCon").find(".itemLoader").append(defDataHidden.join(""));
										$(".texthiddenOpt").each(function() {
											var valueAttr = $(this).attr("data-attr");
											var value = $(this).attr("value");
											$(".checkBoxVal").each(function() {
												if ($(this).attr('data-arr') == valueAttr) {
													$(this).attr('value', value);
												}
											});
										});
									});
									var checkBox = $(this).parent().find("input.checkBoxVal");
									$(".checkBoxVal").click(function() {
										var optionValue = $(this).attr("data-arr");
										var optionValId = $(this).attr("value");
										var optionUrl;
										var initData;
										if ($(this).is(':checked')) {
											initData = "callback=?&reqMemGuid="+merchantGUID+"&optId=" + optionId + "&listValue=" + optionValue + "&listValueGrp=" + listValueGroup;
											optionUrl = TARGET_URI + 'v5a/settings/optValues?_method=POST&';
										} else {
											initData = "callback=?&reqMemGuid="+merchantGUID+"&optValId=" + optionValId;
											optionUrl = TARGET_URI + 'v5a/settings/optValues?_method=DELETE&';
										}
										
										rawData = initData;
										param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
										url = optionUrl;
										method = 'GET';
										AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {});
									});
								}else if(uiType == "RADIO"){
									var itemArr = [];
									for (var k = 0; k < data.data.resultList.length; k++) {
										for (var l = 0; l < data.data.resultList[k].availableCodes.length; l++) {
											itemArr.push(data.data.resultList[k].availableCodes[l].cdKey);
											itemArr.push(" <input type='radio' class='radioButVal' name=radiogroup value='' data-arr=" + data.data.resultList[k].availableCodes[l].cdKey + "> ");
										}
									}
									//itemArr.push(" <a class=getAvailableCodes> add</a>");
									thisItemBut.closest("li").next(".optionCon").find(".itemLoader").html(itemArr.join(""));
	
									var datas = [];
									var checkVal = $('.radioButVal');
									var datas = [];
									$(checkVal).each(function() {
										var sThisVal = ($(this).attr("data-arr"));
										datas.push(sThisVal);
									});
	
									var datas1 = datas.join(",");
									var datas2;
									var defDataHiddenr = [];
									rawData = 'callback=data&reqMemGuid='+merchantGUID+'&categoryId='+categoryId+'&optId=' + optionId;
									param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
									url = TARGET_URI + 'v5a/settings/optValues?_method=GET&';
									method = 'GET';
									AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
										var defData = [];
										for (var def = 0; def < data.data.resultList.length; def++) {
											defData.push(data.data.resultList[def].listValue);
											listValueGroup = data.data.resultList[def].listValueGrp;
											defDataHiddenr.push("<input class='texthiddenOptr' type='hidden' data-attr=" + data.data.resultList[def].listValue + " value=" + data.data.resultList[def].optValId + ">");
										}
										datas2 = defData;
										for (var chkDef = 0; chkDef < datas2.length; chkDef++) {
											$(checkVal).each(function() {
												if ($(this).attr("data-arr") == datas2[chkDef]) {
													$(this).attr('checked', true);
												}
											});
										}
	
										thisItemBut.closest("li").next(".optionCon").find(".itemLoader").append(defDataHiddenr.join(""));
	
										$(".texthiddenOptr").each(function() {
											var valueAttr = $(this).attr("data-attr");
											var value = $(this).attr("value");
											$(".radioButVal").each(function() {
												//if ($(this).attr('data-arr') == valueAttr) {
												$(this).attr('value', value);
												//}
											});
										});
									});
									
									var checkRadio = $(this).parent().find("input.radioButVal");
									$(".radioButVal").click(function() {
										var optionValue = $(this).attr("data-arr");
										var optionValId = $(this).attr("value");
										var optionUrl;
										rawData = 'callback=data&reqMemGuid='+merchantGUID+'&optValId='+optionValId+'&listValue=' + optionValue+'&listValueGrp='+listValueGroup;
										param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
										url = TARGET_URI + 'v5a/settings/optValues?_method=PUT&';
										method = 'GET';
										AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {});
									});
								}else if(uiType == "SELECTBOX"){
									var itemArr = [];
									var getOptionData;
									for (var k = 0; k < data.data.resultList.length; k++) {
										listValueGroup = data.data.resultList[k].listCd;
										itemArr.push("<select class='selectBoxSave'>");
										for (var l = 0; l < data.data.resultList[k].availableCodes.length; l++) {
											itemArr.push(" <option data-arr=" + data.data.resultList[k].availableCodes[l].cdKey + ">" + data.data.resultList[k].availableCodes[l].cdKey + "</option> ");
										}
										itemArr.push("</select>");
									}
									//itemArr.push(" <a class=getAvailableCodes> save</a>");
									thisItemBut.closest("li").next(".optionCon").find(".itemLoader").html(itemArr.join(""));
									var optionValId;
									rawData = 'callback=data&reqMemGuid='+merchantGUID+'&categoryId='+categoryId+'&optId=' + optionId;
									param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
									url = TARGET_URI + 'v5a/settings/optValues?_method=GET&';
									method = 'GET';
									AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
										for (var def = 0; def < data.data.resultList.length; def++) {
											getOptionData = data.data.resultList[def].listValue;
											optionValId = data.data.resultList[def].optValId;
											$(".selectBoxSave").val(getOptionData);
										}
									});
									
									$(".selectBoxSave").change(function() {
										var optionValue = $(this).val();
										rawData = 'callback=data&reqMemGuid='+merchantGUID+'&optValId='+optionValId+'&listValue=' + optionValue + '&listValueGrp='+listValueGroup;
										param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
										url = TARGET_URI + 'v5a/settings/optValues?_method=PUT&';
										method = 'GET';
										AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {});
									});
								}else if(uiType == "STR_LIST"){
									var itemArr = [];
									for (var k = 0; k < data.data.resultList.length; k++) {
										for (var l = 0; l < data.data.resultList[k].availableCodes.length; l++) {
											itemArr.push(data.data.resultList[k].availableCodes[l].cdKey);
											itemArr.push("<input type='textbox' class='textBoxVal' value='' checkExist='false' data-arr=" + data.data.resultList[k].availableCodes[l].cdKey + "> ");
										}

										listValueGroup = data.data.resultList[k].listCd;
									}
									itemArr.push(" <a class=submitOptionValuesStr> save</a>");
									thisItemBut.closest("li").next(".optionCon").find(".itemLoader").html(itemArr.join(""));

									var datas = [];
									var checkVal = $('.textBoxVal');
									var datas = [];
									$(checkVal).each(function() {
										var sThisVal = ($(this).attr("data-arr"));
										datas.push(sThisVal);
									});

									var datas1 = datas.join(",");
									var datas2;
									var optionValId;
									rawData = 'callback=data&reqMemGuid='+merchantGUID+'&categoryId='+categoryId+'&optId=' + optionId;
									param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
									url = TARGET_URI + 'v5a/settings/optValues?_method=GET&';
									method = 'GET';
									
									$.ajax({
										url : url+param,
										type : method,
										dataType : 'jsonp',
										error : function(xhr, textStatus) {
											alert(xhr.status);
										},
										success : function(data, textStatus) {
											var defData = [];
											for (var def = 0; def < data.data.resultList.length; def++) {
												defData.push("<input class='texthidden' type='hidden' data-arr=" + data.data.resultList[def].listValue + " value=" + data.data.resultList[def].value + ">");
												optionValId = data.data.resultList[def].optValId;
											}
											thisItemBut.closest("li").next(".optionCon").find(".itemLoader").append(defData.join(""));
	
											$(".texthidden").each(function() {
												var dataArr = $(this).attr("data-arr");
												var value = $(this).attr("value");
												$(".textBoxVal").each(function() {
													if ($(this).attr('data-arr') == dataArr) {
														$(this).attr('value', value);
														$(this).attr('checkExist', 'true');
													} else {
													}
												});
											});
										},
										complete:function(){
											$(".submitOptionValuesStr").click(function() {
												$(this).text("loading..");
												var but = $(this);
												var strUrl;
												var checkExist;
												var listValue;
												var value;
												$(".textBoxVal").each(function() {
													checkExist = $(this).attr("checkExist");
													listValue = $(this).attr("data-arr");
													value = $(this).val();
													if (checkExist == "true") {
														//update Put data
														rawData = 'callback=data&reqMemGuid='+merchantGUID+'&optValId='+optionValId+'&listValue=' + listValue +'&value='+ value + '&listValueGrp='+listValueGroup;
														param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
														url = TARGET_URI + 'v5a/settings/optValues?_method=PUT&';
														method = 'GET';
														AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
															if(data.status=="SUCCESS"){
																$(but).text("save");	
															}
															else{alert(status);}
														});
													} else {
														//First time call Post data
														//strUrl = TARGET_URI + "optId=" + optionId + "&listValue=" + listValue + "&value=" + value + "&listValueGrp=" + listValueGroup;
														rawData = 'callback=data&reqMemGuid='+merchantGUID+'&optId='+optionId+'&listValue=' + listValue +'&value='+ value + '&listValueGrp='+listValueGroup;
														param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
														url = TARGET_URI + 'v5a/settings/optValues?_method=POST&';
														method = 'GET';
														AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
															if(data.status=="SUCCESS"){
																$(but).text("save");	
															}
															else{alert(status);}
														});
													}
												});
											});
										}
									});
								}
							});
							$(this).closest("li").next(".optionCon").toggle();
							$(this).closest("li").next(".optionCon").css("height", "200px");
						});		
						
					});
				});	
				$(".categoryItem:first").trigger("click");	
			}else{
				alert(data.status);
			}
		}
	});
};
