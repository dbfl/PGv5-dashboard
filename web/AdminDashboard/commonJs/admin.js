$(document).ready(function(){
	
	$('.footable').footable();
	
	var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;
	var HOST_URI = window.location.hostname;
	var TARGET_URI = "http://localhost:8080/";
	
	if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
	if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
	if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
	
	var isAdmin = $.cookie("isAdmin");
	var liveChartUpdate = null;
	var liveChartUpdate2 = null;
	var liveMonitor = null;
	
	
	if(isAdmin == "true"){
		$("#memRoleTab").show();
		$("#apiRoleTab").show();
	}else{
		$("#memRoleTab").hide();
		$("#apiRoleTab").hide();
	}
	
	var koreanLanguage = function(){
		$("menuMonitoring").text(MONITORING_KR);
		$("#menuDashboard").text(DASHBOARD_KR);
		$("#menuTransaction").text(TRANSACTION_KR);
		$("#menuMember").text(MEMBER_KR);
		$("#menuCurrency").text(CURRENCY_KR);
		$("#menuChargeAcc").text(CHARGE_ACCOUNT_KR);
		$("#menuSettings").text(SETTING_KR);
		$("#menuSeyfertWithdraw").text(SEYFERT_WITHDRAW_KR);
		$("#menuCrossBorderRemit").text(CROSS_BORDER_REMIT_KR);
		$("#menuSms").text(SMS_SERVICE_KR);
		$("#menuPhoneAuth").text(PHONE_AUTH_KR);
		$("#menututoring").text(LECTURE_KR);

	};

	var englishLanguage = function(){
		$("menuMonitoring").text(MONITORING_EN);
		$("#menuDashboard").text(DASHBOARD_EN);
		$("#menuTransaction").text(TRANSACTION_EN);
		$("#menuMember").text(MEMBER_EN);
		$("#menuCurrency").text(CURRENCY_EN);
		$("#menuChargeAcc").text(CHARGE_ACCOUNT_EN);
		$("#menuSettings").text(SETTING_EN);
		$("#menuSeyfertWithdraw").text(SEYFERT_WITHDRAW_EN);
	    $("#menuCrossBorderRemit").text(CROSS_BORDER_REMIT_EN);
	    $("#menuSms").text(SMS_SERVICE_EN);
	    $("#menuPhoneAuth").text(PHONE_AUTH_EN);
	    $("#menututoring").text(LECTURE_EN);
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
	
	
	/**username display***/
	var getUserName = $.cookie("userName");
	$("#userName").text(getUserName);
	/**Check session***/
	var myNewKeyB = $.cookie("pkey");
	/**prevent all AJAX requests from being cached **/
	$.ajaxSetup({ cache: false });
	
	/**Enable footable**/
	$('.footable').footable();
	
	/**Configure active menu behavior**/
	$(".menuBar").click(function(){
		$(".menuBar").removeClass("active");
		$(this).addClass("active");	
	});
	
	if(myNewKeyB == "undefined" || myNewKeyB == undefined || myNewKeyB == null || myNewKeyB == "null"){
		console.log("myNewKeyB : " + myNewKeyB);
		window.location = 'login.html';
	};
	
	var logout = function(){
		$.removeCookie("superGuid");
		$.removeCookie("pkey");
		$.removeCookie("isAdmin");
		$.removeCookie("userName");
		//$.removeCookie("loadedPage");
		
		$.cookie("superGuid", null,{path: '/', domain: 'paygate.net',secure: true});
		$.cookie("pkey", null,{path: '/', domain: 'paygate.net',secure: true});
		$.cookie("isAdmin",null,{path: '/', domain: 'paygate.net',secure: true});
		$.cookie("userName",null,{path: '/', domain: 'paygate.net',secure: true});
		
		window.location = 'login.html';
	};
	
	/**Trigger Logout***/
	$("#logOut").click(function(){
		logout();
	});
	
	/**
	 * Every menu will call its own individual UI & SCRIPT. 
	 * The UI is loaded first, followed by script.
	 * **/
	
	$("#renewPassword").click(function() {
		window.location="renewPassword.html";
	});
	
	
	$("#monitoringNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		$("#pagerFooter").hide();
		
		$("#dashHeader").hide();
		$("#mainContent").hide();
		$("#dashHeader").empty();
		$("#dashMain").empty();
		$("#monitorContent").show();
		$("#monitorMain").load("dashboardUI/monitoring.html",function(){
			$.ajaxSetup({ cache: false });
			$.getScript("commonJs/monitoring.js",function(){
				var reqMemGuid = $.cookie("superGuid");
				
				if(reqMemGuid==null || reqMemGuid =="undefined" || reqMemGuid == undefined){
					alert("session invalid");
					window.location = 'login.html';
				}else{
					checkSystemHealth();  
					liveMonitor = setInterval(function() {
						checkSystemHealth();  
				    }, 100000);	
				}
			});
		});
	});
	
	$("#dasboardNaviMenu").click(function(){
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		
		$("#pagerFooter").hide();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "dashboard");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("dashboardUI/mainContent.html #dashHeaderContent",function(){
			$("#dashMain").load("dashboardUI/mainContent.html #dashMainContent",function(){
				$.ajaxSetup({ cache: false });
				$.getScript("commonJs/dashboardUI.js",function(){
					/***Set interval****/
					liveChartUpdate = setInterval(function(){
						callhourChart();
					},100000);
				});	
			});
		});
	});
	
	$("#transactionNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveMonitor);
		//liveChartUpdate = null;
		$("#pagerFooter").show();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "transaction");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("transactionUI/mainContent.html #dashHeaderContent",function(){
			$("#dashMain").load("transactionUI/mainContent.html #dashMainContent",function(){
				$.ajaxSetup({ cache: false });
				$.getScript("commonJs/transactionUI.js",function(){
					liveChartUpdate2 = setInterval(function(){
						loadHourChart();
					},100000);
				});
			});
		});
	});
	
	$("#seyfertNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").show();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "seyfert");
		$("#mainContent").empty();
		$("#mainContent").load("seyfertUI/mainContent.html#seyfertMainContent",function(){
			$.ajaxSetup({ cache: false });
			$.getScript("commonJs/seyfertUI.js");
		});
	});
	
	$("#memberNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").show();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "member");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("memberUI/mainContent.html #dashHeaderContent",function(){
			$("#dashMain").load("memberUI/mainContent.html #dashMainContent",function(){
				$.ajaxSetup({ cache: false });
				$.getScript("commonJs/memberUI.js",function(){
					if(getUserName=="PayGateAdmin" || getUserName=="paygateadmin"){
						$("#createMemberTab").show();
						$("#assignBankMemberTab").show();
						$("#assignVirtualAccountMemberTab").show();
					}else{
						$("#createMemberTab").hide();
						$("#assignBankMemberTab").hide();
						$("#assignVirtualAccountMemberTab").hide();
					}
					
					if(isAdmin=="true"){
						$("#assignMemberCredentialsTab").show();		
					}else{
						$("#assignMemberCredentialsTab").hide();
					}
				});
			});
		});
	});
	
	$("#currencyNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").hide();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "currency");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("currencyUI/mainContent.html #dashHeaderContent",function(){
			$("#dashMain").load("currencyUI/mainContent.html #dashMainContent",function(){
				$.ajaxSetup({ cache: false });
				$.getScript("commonJs/currencyUI.js",function(){});
			});
		});
	});
	
	$("#tutoringNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").hide();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "tutoring");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("tutoringUI/mainContent.html #dashHeaderContent",function(){
			$("#dashMain").load("tutoringUI/mainContent.html #dashMainContent",function(){
				$.ajaxSetup({ cache: false });
				$.getScript("commonJs/tutoringUI.js",function(){});
			});
		});
	});
	
	
	$("#chargeAccNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").hide();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "chargeAcc");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("chargeAccUI/mainContent.html #dashHeaderContent",function(){
			$("#dashMain").load("chargeAccUI/mainContent.html #dashMainContent",function(){
				$.ajaxSetup({ cache: false });
				$.getScript("commonJs/chargeAccUI.js");
			});
		});
	});
	
	$("#seyfertWithdrawMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").hide();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "seyfertWithdraw");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("seyfertWithdrawUI/mainContent.html #dashHeaderContent",function(){
			$("#dashMain").load("seyfertWithdrawUI/mainContent.html #dashMainContent",function(){
				$.ajaxSetup({ cache: false });
				$.getScript("commonJs/seyfertWithdrawUI.js");
			});
		});
	});
	
	$("#crossBorderRemitNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").hide();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "crossBorderRemit");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("crossBorderRemitUI/mainContent.html #dashHeaderContent",function(){
			$("#dashMain").load("crossBorderRemitUI/mainContent.html #dashMainContent",function(){
				$.ajaxSetup({ cache: false });
				$.getScript("commonJs/crossBorderRemitUI.js");
			});
		});
	});
	
	$("#smsNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").hide();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "smsService");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("smsUI/mainContent.html #smsHeaderContent",function(){
			$("#dashMain").load("smsUI/mainContent.html #smsMainContent",function(){
				$.getScript("commonJs/smsUI.js");
			});
		});	
	});
	
	$("#settingsNaviMenu").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").hide();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "settings");
		$("#dashHeader").empty();
		$("#dashMain").empty();
		
		$("#dashHeader").show();
		$("#mainContent").show();
		$("#monitorContent").hide();
		
		$("#dashHeader").load("settingsUI/mainContent.html #dashHeaderContent",function(){
			$("#dashMain").load("settingsUI/mainContent.html #dashMainContent",function(){
				$.ajaxSetup({ cache: false });
				//LOAD MEMBER RELATED SETTINGS
				$.getScript("commonJs/accountSetting.js");
				$.getScript("commonJs/settingsUI.js",function(){
					loadCategory();
					$.getScript("commonJs/settingsUI_MemberRoles.js",function(){
					if(isAdmin=="true"){
						loadMemberRoles();
						$.getScript("commonJs/settingsUI_ApiRoles.js",function(){
							loadServiceRoles();
						});
					}else{}
					});
				});
				
				/****Check is Admin and hide roles related query*****/
				if(isAdmin == "true"){
					$("#memRoleTab").show();
					$("#apiRoleTab").show();
				}else{
					$("#memRoleTab").hide();
					$("#apiRoleTab").hide();
				}
				
				/***Active class settings***/
				$(".roleMenuClass").click(function(){
					var identity = $(this).attr("data");
					
					
					$(".roleMenuClass").removeClass("active");
					$(this).addClass("active");
					
					if(identity=="listRole"){
						$(".roleListContainer").show();
						$("#createRoleContainer").hide();
						$("#assignRoleContainer").hide();
					};
					if(identity=="createRole"){
						$(".roleListContainer").hide();
						$("#createRoleContainer").show();
						$("#assignRoleContainer").hide();
					};
					if(identity=="assignRole"){
						$(".roleListContainer").hide();
						$("#createRoleContainer").hide();
						$("#assignRoleContainer").show();
					};
				});
			});
		});
	});
	
	$("#menuCreateRoles").click(function(){
		clearInterval(liveChartUpdate);
		clearInterval(liveChartUpdate2);
		clearInterval(liveMonitor);
		$("#pagerFooter").show();
		$.removeCookie("loadedPage");
		$.cookie("loadedPage", "member");
		$("#mainContent").empty();
		$("#mainContent").load("rolesUI/mainContent.html#memberMainContent",function(){
			$.ajaxSetup({ cache: false });
			$.getScript("commonJs/createRoles.js");
		});
	});
	
	
	if(isAdmin=="true"){
		// TODO: Add roles for admin in new style
		// $("#rolesMenuContainer").show();
		$("#currencyNaviMenu").show();
		$("#chargeAccNaviMenu").show();
		$("#chargeAccNaviMenu").show();
		$("#monitoringNaviMenu").show();
		$("#tutoringNaviMenu").show();
		$("#smsNaviMenu").show();
	}else{
		$("#rolesMenuContainer").hide();
		$("#chargeAccNaviMenu").hide();
		$("#monitoringNaviMenu").hide();
		$("#tutoringNaviMenu").hide();
		$("#smsNaviMenu").hide();
		//$("#chargeAccNaviMenu").hide();
	}
	
	/***Trigger on document ready***/
	var loadedPage = $.cookie("loadedPage");
	if(loadedPage===undefined){
		$("#dasboardNaviMenu").trigger("click");
	}else{
		if(loadedPage=="dashboard"){$("#dasboardNaviMenu").trigger("click");}
		else if(loadedPage=="transaction"){$("#transactionNaviMenu").trigger("click");}
		else if(loadedPage=="seyfert"){$("#seyfertNaviMenu").trigger("click");}
		else if(loadedPage=="member"){$("#memberNaviMenu").trigger("click");}
		else if(loadedPage=="currency"){$("#currencyNaviMenu").trigger("click");}
		else if(loadedPage=="chargeAcc"){$("#chargeAccNaviMenu").trigger("click");}
		else if(loadedPage=="seyfertWithdraw"){$("#seyfertWithdrawMenu").trigger("click");}
		else if(loadedPage=="crossBorderRemit"){$("#crossBorderRemitNaviMenu").trigger("click");}
		else if(loadedPage=="smsService"){$("#smsNaviMenu").trigger("click");}
		else if(loadedPage=="settings"){$("#settingsNaviMenu").trigger("click");}
		else if(loadedPage=="tutoring"){$("#tutoringNaviMenu").trigger("click");}
	}
});