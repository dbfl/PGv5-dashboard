
/**URI host declartion and initialization **/
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
	var currentPage = 0;
	
	/**INITIALIZE VARIABLES**/
	var isAdmin = $.cookie("isAdmin");
	merchantGUID = $.cookie("superGuid");
	KEY_ENC = $.cookie("pkey");

var BROWSER_LANG =  window.navigator.userLanguage || window.navigator.language;
var koreanLanguage = function(){
		$("#api").text(API_KR);
		$("#apiRolesSetting").text(API_ROLES_SETTINGS_KR);
		$("#tabApiAssignRoles").text(ASSIGN_ROLES_KR);
		$("#listApiUrl").text(API_URL_KR);
		$("#listApiRoles").text(ROLES_KR);
		$("#listApiACL").text(ACL_KR);
		$("#listApiMethod").text(METHOD_KR);
		$("#listApiAction").text(ACTION_KR);
};

var englishLanguage = function(){
		$("#api").text(API_EN);
		$("#apiRolesSetting").text(API_ROLES_SETTINGS_EN);
		$("#tabApiAssignRoles").text(ASSIGN_ROLES_EN);
		$("#listApiUrl").text(API_URL_EN);
		$("#listApiRoles").text(ROLES_EN);
		$("#listApiACL").text(ACL_EN);
		$("#listApiMethod").text(METHOD_EN);
		$("#listApiAction").text(ACTION_EN);
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

var loadServiceRoles = function(page){
	if(page == null || page < 1){
			page = 0;
	};
	currentPage  = page;
	
	var searchParams =decodeURIComponent($("#searchForm :input").filter(function(index, element) {
                    return $(element).val() != "";
    }).serialize());
	
	rawData = searchParams+'callback=data&reqMemGuid='+merchantGUID;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/api/role?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var roleList = [];
			for(var j = 0;j < data.data.resultList.length; j++){
		 		roleList.push("<tr class='gradeX' style='height:30px;'>");
				roleList.push("<td> <span class='settingLabel'> "+data.data.resultList[j].serviceNm+"</span></td>");
				roleList.push("<td> <span class='settingsLabel'>"+data.data.resultList[j].role+"</span></td>");
				roleList.push("<td> <span class='settingsLabel'>"+data.data.resultList[j].minimumAcl+"</span></td>");
				roleList.push("<td> <span class='settingsLabel'>"+data.data.resultList[j].httpMethod+"</span></td>");
				roleList.push("<td> <a class='removeAPIRoles' href='#'> <i class='fa fa-trash'></i> remove</a> </span>");
				//roleList.push("<button type='button' class='btn btn-info btn-xs updateRoles' data-toggle='modal' data-target='#myModal5'><strong><i class='fa fa-pencil'></i></strong> Update</button>");
				//roleList.push("&nbsp;<button type='button' class='btn btn-danger btn-xs removeRoles'><strong><i class='fa fa-remove'></i></strong> Remove</button>");
				roleList.push("</td>");
				roleList.push("</tr>");	
		 	}		
		 	
		 	$("#memberAPIRolesData").html(roleList.join(''));
		 	
		 	var total = 2;//data.data.totalCount;
			var limitView = rowsPerPage*page;
			var paggingTxt = pagging_ajax(total, rowsPerPage, "apiRolesPage",page);
			$(".pagingCon").html(paggingTxt['start'] + paggingTxt['list'] + paggingTxt['end']);	
			
			
			$(".removeAPIRoles").unbind("click").click(function(){
				var serviceName = $(this).closest('tr').find('td span:eq(0)').text();
				var role = $(this).closest('tr').find('td span:eq(1)').text();
				var httpMethod = $(this).closest('tr').find('td span:eq(3)').text();
				
				rawData = 'reqMemGuid='+merchantGUID+'&callback=?&httpMethod='+httpMethod+'&role='+role+'&serviceNm='+serviceName;
				param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));   
				url = TARGET_URI+'v5a/api/role?_method=DELETE&';
				method = 'GET';
				AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
					if(data.status==="SUCCESS"){
						  alert(data.status);
						  $(this).closest('tr').remove();
					}else{
						alert(data.status);
					}
				});
			});
	});	
};

/***GET ROLES AND SET****/
var rolesOptions = [];
var setRolesOptions = 0;

/*url = TARGET_URI+'v5a/member/role/cd?';
method='GET';
param='reqMemGuid=guid71';
*/
rawData = 'reqMemGuid='+merchantGUID+'&callback=?';
param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
url = TARGET_URI+'v5a/member/role/cd?_method=GET&';
method = 'GET';

AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
	for(var k = 0;k < data.data.resultList.length; k++){
		rolesOptions.push("<option value="+data.data.resultList[k].role+">"+data.data.resultList[k].role+"</option>");
 	}			
 	setRolesOptions = rolesOptions.join('');
 	$("#addAPIUrlButton").click(function(){
		var myRows = [];
		myRows.push("<tr class='gradeX'>");
		myRows.push("<td class='apiTdEditor'><input type='text' placeholder='url' name='apiUrl' class='apiInputEditor'/></td>");
		myRows.push("<td class='apiTdEditor'><select name='apiRoles' class='apiRolesEditor'> "+ setRolesOptions +" </select> </td>");
		myRows.push("<td class='apiTdEditor'><input type='text' placeholder='acl' name = 'apiAcl' class='apiInputEditor'/></td>");
		myRows.push("<td class='apiTdEditor'><select class='apiSelectEditor' name = 'apiMethod'><option value='GET'>GET</option><option value='POST'>POST</option><option value='PUT'>PUT</option><option value='DELETE'>DELETE</option></select></td>");
		myRows.push("<td class='apiTdEditor'><a class='saveAPiRows'><i class='fa fa-save'></i> save </a> <a class='removeAPiRows'> <i class='fa fa-trash'></i> remove  </a> </td>");
		myRows.push("</tr>");
		$("#memberAPIRolesData").append(myRows.join(''));
		
		$(".removeAPiRows").click(function(){
			$(this).closest('tr').remove();
		});
		
		$(".saveAPiRows").unbind("click").click(function(){
			var url = $(this).closest('tr').find('input[name=apiUrl]').val();
			var role = $(this).closest('tr').find('.apiRolesEditor').val();
			var acl = $(this).closest('tr').find('input[name=apiAcl]').val();
			var method = $(this).closest('tr').find('.apiSelectEditor').val();
			rawData = 'reqMemGuid='+merchantGUID+'&callback=?&httpMethod='+method+'&role='+role+'&minimumAcl='+acl+'&serviceNm='+url;
			param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
			url = TARGET_URI+'v5a/api/role?_method=POST&';
			method = 'GET';
			
			AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
				if(data.status=="SUCCESS"){
					alert(data.status);
					loadServiceRoles();
				}else{
					alert(data.status);
				}
			});
			
			
			/*$.ajax({
				url:TARGET_URI+'v5a/api/role?_method=POST&,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					if(data.status=="SUCCESS"){
						alert(data.status);
						loadServiceRoles();
					}else{
						alert(data.status);
					}
				}
			});	*/
		});
	});
});

