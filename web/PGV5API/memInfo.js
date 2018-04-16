$.fn.serializeAndEncode = function() {
    return $.map(this.serializeArray(), function(val) {
        return [val.name, encodeURIComponent(val.value)].join('=');
    }).join('&');
};
$(document).ready(function(){
	var encryptData;
	var bits = 256;
	var merchantGUID;
	var KEY_ENC;
	var ENCRYPTION = "OFF";
	var responseDataConsole = [];
	
	var HOST_URI = window.location.hostname;
	var TARGET_URI = "https://dev5.paygate.net/";
	
	
	if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
	if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
	if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
	
	var domain = TARGET_URI;
	var createMemInfo_uri = TARGET_URI +'v5a/member/createMemInfo';
	var memInfoTypes_uri = TARGET_URI + 'v5/code/listOf/memInfoTypes/ko';
	
	$(".navigator").click(function(){
    	$(".navigator").removeClass("active");
    	$(this).addClass("active");
    });
    
    ENCRYPTION = "OFF";
    
    $("#firstSection").click(function(){
    	$("#createContractMenu").trigger("click");
    	merchantGUID = $("#masterGuid").val();
		KEY_ENC = $("#encryptKey").val();
		$(".merchantMemGuid").val($("#masterGuid").val());
     });   
    //infoCdList
	$.ajax({
		url:memInfoTypes_uri+'?callback=?&_method=GET',
		type:'GET',
		dataType:'jsonp',
		error:function(data){alert("error get info Code");},
		success:function(data){
			var infoTypes = [];
			infoTypes.push("<select name='infoCd' id='infoCd'>");
			infoTypes.push("<option value='0'>---Select info code---</option>");
			for(var i = 0; i < data.data.length;i++){
				infoTypes.push("<option value="+data.data[i].cdKey+">"+data.data[i].cdDesc+"</option>");
			}
			infoTypes.push("</select>");
			$("#infoCdList").html(infoTypes.join(''));
		}
	});	
    $("#createMemInfoBut").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#createMemInfoForm").serializeAndEncode());
		var utf8encoded = pidCryptUtil.decodeUTF8(formData);
		var aes = new pidCrypt.AES.CTR();
		aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
		var crypted = aes.encrypt();
		var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
		
		var infoCd = $("#infoCd").val();
		if(infoCd == '0'){
			alert('Please Select info code');
			return false;
		}
		if(ENCRYPTION=="ON"){
			sendRequestParam = params; 
		}else if(ENCRYPTION=="OFF"){
			sendRequestParam = formData;
		}else{}
    	
    	responseDataConsole.push("<span style=color:#0051A8><b>CREATE CONTRACT</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ createMemInfo_uri +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+params+"</p><br>");
		
		var items = $("#createMemInfoForm :input").map(function(index, elm) {
		    return {name: elm.name, type:elm.type, value: $(elm).val()};
		});
		
		var paramsTable = [];
		paramsTable.push("<table border=1 style=width:40%>");
		paramsTable.push("<tr style='color:#D9534F;'>");
		paramsTable.push("<th class=thMargin>Param</th>");
		paramsTable.push("<th class=thMargin>Value</th>");
		paramsTable.push("</tr>");
		paramsTable.push("<tr>");
		
		$.each(items, function(i, d){
		    //$("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
    	
    	$.ajax({
			url: createMemInfo_uri +'?callback=?&_method=POST&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){alert("error");},
			success:function(data){
				
				responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
				alert(data.status);
				
				if(data.status=="SUCCESS"){
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				else if(data.status !="SUCCESS") {
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
		    }
		});
	 }); 
	 
});	