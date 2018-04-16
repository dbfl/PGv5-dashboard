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
var loadMemberRoles = function(page){
	if(page == null || page < 1){
			page = 1;
	};
	currentPage  = page;
	rawData = 'callback=?&reqMemGuid='+merchantGUID+'&dstMemGuid='+merchantGUID;
	param = 'reqMemGuid=' + merchantGUID + '&encReq=' + ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/member/role?_method=GET&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url, method, param, function(data, status) {
		var roleList = [];
		for(var j = 0;j < data.data.resultList.length; j++){
	 		roleList.push("<tr class='gradeX' style='height:30px;'>");
			roleList.push("<td><span class='settingLabel'> "+data.data.resultList[j].guid+"</span></td>");
			roleList.push("<td><span class='settingLabel'>"+data.data.resultList[j].role+"</span></td>");
			roleList.push("<td><span class='settingLabel'>"+data.data.resultList[j].baseAcl+"</span></td>");
			roleList.push("<td>");
			//roleList.push("<button type='button' class='btn btn-info btn-xs updateRoles' data-toggle='modal' data-target='#myModal5'><strong><i class='fa fa-pencil'></i></strong> Update</button>");
			roleList.push(" <a id=usdMinMaxBut class='removeRoles'> <i class='fa fa-trash'></i> remove</a> </span>");
			roleList.push("</td>");
			roleList.push("</tr>");	
	 	}		
	 	
	 	$("#memberRolesData").html(roleList.join(''));	
	});
		/*if(page == null || page < 1){
				page = 0;
		};
		currentPage  = page;
		//var rolesData = decodeURIComponent('callback=?&page='+currentPage+'&limit=6&reqMemGuid='+merchantGUID+'&page=0&limit=6&dstMemGuid='+merchantGUID);
		var rolesData = decodeURIComponent('callback=?&page='+currentPage+'&limit=6&reqMemGuid='+merchantGUID+');
		var utf8encoded = pidCryptUtil.decodeUTF8(rolesData);
		var aes = new pidCrypt.AES.CTR();
		aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
		var crypted = aes.encrypt();
		var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
		alert(TARGET_URI+'v5a/member/role?_method=GET&'+rolesData);
		$.ajax({
			url:TARGET_URI+'v5a/member/role?_method=GET&'+params,
			type:'GET',
			dataType:'jsonp',
			error:function(){alert("error");},
			success:function(data){
				var roleList = [];
				for(var j = 0;j < data.data.resultList.length; j++){
			 		roleList.push("<tr class='gradeX' style='height:30px;'>");
					roleList.push("<td><span class='settingLabel'> "+data.data.resultList[j].guid+"</span></td>");
					roleList.push("<td><span class='settingLabel'>"+data.data.resultList[j].role+"</span></td>");
					roleList.push("<td><span class='settingLabel'>"+data.data.resultList[j].baseAcl+"</span></td>");
					roleList.push("<td>");
					//roleList.push("<button type='button' class='btn btn-info btn-xs updateRoles' data-toggle='modal' data-target='#myModal5'><strong><i class='fa fa-pencil'></i></strong> Update</button>");
					roleList.push(" <a id=usdMinMaxBut class='removeRoles'> <i class='fa fa-trash'></i> remove</a> </span>");
					roleList.push("</td>");
					roleList.push("</tr>");	
			 	}		
			 	
			 	$("#memberRolesData").html(roleList.join(''));
			 	
			 	var total = 50;//data.data.totalCount;
				var limitView = rowsPerPage*page;
				var paggingTxt = pagging_ajax(total, rowsPerPage, "memberRolesPage",page);
				$(".pagingCon").html(paggingTxt['start'] + paggingTxt['list'] + paggingTxt['end']);	
			 	
			},
			
			complete:function(){
				$(".removeRoles").click(function(){
					var guid = $(this).closest('tr').find('td span:eq(0)').text();
					var role = $(this).closest('tr').find('td span:eq(1)').text();
					
					rawData = 'callback=?&reqMemGuid='+merchantGUID+'&role='+role+'&dstMemGuid='+guid;
					param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));   
					url = TARGET_URI+'v5a/member/role?_method=DELETE&';
					method = 'GET';
					AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
						if(data.status==="SUCCESS"){
							  alert(data.status);
							  $(this).closest('tr').remove();
						}else{
							alert(data.status);
						}
					});
					*/					
					/*var rolesData = decodeURIComponent('callback=?&reqMemGuid='+merchantGUID+'&role='+role+'&dstMemGuid='+guid);
					var utf8encoded = pidCryptUtil.decodeUTF8(rolesData);
					var aes = new pidCrypt.AES.CTR();
					aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
					var crypted = aes.encrypt();
					var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
				
				   $.ajax({
						url:TARGET_URI+'v5a/member/role?_method=GET&'+params,
						type:'POST',
						dataType:'jsonp',
						context: this,
						error:function(){alert("error");},
						success:function(data){
							if(data.status==="SUCCESS"){
								  alert(data.status);
								  $(this).closest('tr').remove();
							}else{
								alert(data.status);
							}
						}
					}); */	
				//});
			//}
		//});	
	};

$("#createRolesBut").click(function(){
	var role = $("#roleName").val();
	var desc = $("#roleDescription").val();
	
	rawData = 'callback=?&reqMemGuid='+merchantGUID+'&roleDesc='+desc+'&role='+role;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/member/role/cd?_method=POST&';
	method = 'POST';
	
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		if(data.status=="SUCCESS"){
			alert(data.status);
			$("#roleName").val('');
			$("#roleDescription").val('');
			loadMemberRoles(0);
		}else{
			alert(data.status + ':::' + data.data.cdDesc);
		}
	});
});
	
$("#assignRoleBut").click(function(){
	rawData = 'callback=?&reqMemGuid='+merchantGUID+'&role='+$("#memberRolesOption").val()+'&baseAcl='+$("#aclOptions").val()+'&dstMemGuid='+$("#dstGuid").val();
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/member/role?_method=POST&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		if(data.status=="SUCCESS"){
			alert(data.status);
			loadMemberRoles(0);
		}else{
			alert(data.status + ':::' + data.data.cdDesc );
		}
	});
});

var aclOptions = [0,100,200,300,400,500,600,700,800,900,1000];
for(var i = 0;i < aclOptions.length; i++){
	$("#aclOptions").append("<option value="+aclOptions[i]+">"+aclOptions[i]+"</option>");
}

/****Load available roles****/
rawData = 'callback=?&reqMemGuid='+merchantGUID;
param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
url = TARGET_URI+'v5a/member/role/cd?_method=GET&';
method = 'GET';

AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
	for(var k = 0;k < data.data.resultList.length; k++){
 		$("#memberRolesOption").append("<option value="+data.data.resultList[k].role+">"+data.data.resultList[k].role+"</option>");
 	}	
});


var koreanLanguage = function(){
	$("#roles").text(ROLES_KR);
	$("#memberRolesSettings").text(MEMBER_ROLES_SETTINGS_KR);
	$("#tabRoles").text(ROLES_KR);
	$("#tabCreateRoles").text(CREATE_ROLES_KR);
	$("#tabAssignRoles").text(ASSIGN_ROLES_KR);
	$("#labelCreateRoles").text(ROLES_KR);
	$("#labelCreateDescript").text(DESCRIPTION_KR);
	$("#labelAssignDesGuid").text(DESTINATION_MEMBER_GUID_KR);
	$("#labelAssignRoles").text(ROLES_KR);
	$("#labelAssignACL").text(ACL_KR);
	$("#labelAssign").text(ASSIGN_ROLES_KR);
	$("#listGuid").text(GUID_KR);
	$("#listRoles").text(ROLES_KR);
	$("#listACL").text(ACL_KR);
	$("#listAction").text(ACTION_KR);
};

var englishLanguage = function(){
	$("#roles").text(ROLES_EN);
	$("#memberRolesSettings").text(MEMBER_ROLES_SETTINGS_EN);
	$("#tabRoles").text(ROLES_EN);
	$("#tabCreateRoles").text(CREATE_ROLES_EN);
	$("#tabAssignRoles").text(ASSIGN_ROLES_EN);
	$("#labelCreateRoles").text(ROLES_EN);
	$("#labelCreateDescript").text(DESCRIPTION_EN);
	$("#labelAssignDesGuid").text(DESTINATION_MEMBER_GUID_EN);
	$("#labelAssignRoles").text(ROLES_EN);
	$("#labelAssignACL").text(ACL_EN);
	$("#labelAssign").text(ASSIGN_ROLES_EN);
	$("#listGuid").text(GUID_EN);
	$("#listRoles").text(ROLES_EN);
	$("#listACL").text(ACL_EN);
	$("#listAction").text(ACTION_EN);
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

/**INITIALIZE VARIABLES**/
/*var isAdmin = $.cookie("isAdmin");
merchantGUID = $.cookie("superGuid");
KEY_ENC = $.cookie("pkey");
*/
/**Acl roles definition***/
/*var aclOptions = [0,100,200,300,400,500,600,700,800,900,1000];
for(var i = 0;i < aclOptions.length; i++){
	$("#aclOptions").append("<option value="+aclOptions[i]+">"+aclOptions[i]+"</option>");
}
*/
/****Load available roles****/
/*rawData = 'callback=?&reqMemGuid='+merchantGUID;
param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
url = TARGET_URI+'v5a/member/role/cd?_method=GET&';
method = 'GET';

alert(url+rawData);
alert("hello"+url+param);

AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
	for(var k = 0;k < data.data.resultList.length; k++){
 		$("#memberRolesOption").append("<option value="+data.data.resultList[k].role+">"+data.data.resultList[k].role+"</option>");
 	}	
});
 	
	
var memberRolesPage = function(page){
	loadMemberRoles(page);
};

var memberRolesAssignPage = function(page){
	loadAssignRoles(page);
};

var loadMemberRoles = function(page){
		if(page == null || page < 1){
				page = 0;
		};
			
		currentPage  = page;
		
		//var rolesData = decodeURIComponent('callback=?&page='+currentPage+'&limit=6&reqMemGuid='+merchantGUID+'&page=0&limit=6&dstMemGuid='+merchantGUID);
		var rolesData = decodeURIComponent('callback=?&page='+currentPage+'&limit=6&reqMemGuid='+merchantGUID+');
		var utf8encoded = pidCryptUtil.decodeUTF8(rolesData);
		var aes = new pidCrypt.AES.CTR();
		aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
		var crypted = aes.encrypt();
		var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
		alert(TARGET_URI+'v5a/member/role?_method=GET&'+rolesData);
		$.ajax({
			url:TARGET_URI+'v5a/member/role?_method=GET&'+params,
			type:'GET',
			dataType:'jsonp',
			error:function(){alert("error");},
			success:function(data){
				var roleList = [];
				for(var j = 0;j < data.data.resultList.length; j++){
			 		roleList.push("<tr class='gradeX' style='height:30px;'>");
					roleList.push("<td><span class='settingLabel'> "+data.data.resultList[j].guid+"</span></td>");
					roleList.push("<td><span class='settingLabel'>"+data.data.resultList[j].role+"</span></td>");
					roleList.push("<td><span class='settingLabel'>"+data.data.resultList[j].baseAcl+"</span></td>");
					roleList.push("<td>");
					//roleList.push("<button type='button' class='btn btn-info btn-xs updateRoles' data-toggle='modal' data-target='#myModal5'><strong><i class='fa fa-pencil'></i></strong> Update</button>");
					roleList.push(" <a id=usdMinMaxBut class='removeRoles'> <i class='fa fa-trash'></i> remove</a> </span>");
					roleList.push("</td>");
					roleList.push("</tr>");	
			 	}		
			 	
			 	$("#memberRolesData").html(roleList.join(''));
			 	
			 	var total = 50;//data.data.totalCount;
				var limitView = rowsPerPage*page;
				var paggingTxt = pagging_ajax(total, rowsPerPage, "memberRolesPage",page);
				$(".pagingCon").html(paggingTxt['start'] + paggingTxt['list'] + paggingTxt['end']);	
			 	
			},
			
			complete:function(){
				$(".removeRoles").click(function(){
					var guid = $(this).closest('tr').find('td span:eq(0)').text();
					var role = $(this).closest('tr').find('td span:eq(1)').text();
					
					rawData = 'callback=?&reqMemGuid='+merchantGUID+'&role='+role+'&dstMemGuid='+guid;
					param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));   
					url = TARGET_URI+'v5a/member/role?_method=DELETE&';
					method = 'GET';
					AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
						if(data.status==="SUCCESS"){
							  alert(data.status);
							  $(this).closest('tr').remove();
						}else{
							alert(data.status);
						}
					});
										
					/*var rolesData = decodeURIComponent('callback=?&reqMemGuid='+merchantGUID+'&role='+role+'&dstMemGuid='+guid);
					var utf8encoded = pidCryptUtil.decodeUTF8(rolesData);
					var aes = new pidCrypt.AES.CTR();
					aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
					var crypted = aes.encrypt();
					var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
				
				   $.ajax({
						url:TARGET_URI+'v5a/member/role?_method=GET&'+params,
						type:'POST',
						dataType:'jsonp',
						context: this,
						error:function(){alert("error");},
						success:function(data){
							if(data.status==="SUCCESS"){
								  alert(data.status);
								  $(this).closest('tr').remove();
							}else{
								alert(data.status);
							}
						}
					}); */	
				/*});
			}
		});	
	};
	*/
/*$("#createRolesBut").click(function(){
	var role = $("#roleName").val();
	var desc = $("#roleDescription").val();
	
	rawData = 'callback=?&reqMemGuid='+merchantGUID+'&roleDesc='+desc+'&role='+role;
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/member/role/cd?_method=POST&';
	method = 'POST';
	
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		if(data.status=="SUCCESS"){
			alert(data.status);
			$("#roleName").val('');
			$("#roleDescription").val('');
			loadMemberRoles(0);
		}else{
			alert(data.status + ':::' + data.data.cdDesc);
		}
	});
});
	
$("#assignRoleBut").click(function(){
	rawData = 'callback=?&reqMemGuid='+merchantGUID+'&role='+$("#memberRolesOption").val()+'&baseAcl='+$("#aclOptions").val()+'&dstMemGuid='+$("#dstGuid").val();
	param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));
	url = TARGET_URI+'v5a/member/role?_method=POST&';
	method = 'GET';
	AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		if(data.status=="SUCCESS"){
			alert(data.status);
			loadMemberRoles(0);
		}else{
			alert(data.status + ':::' + data.data.cdDesc );
		}
	});
});	*/
