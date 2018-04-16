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
	var TARGET_URI = "http://localhost:8080/";
	
	
	
	if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
	if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
	if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
	
	var domain = TARGET_URI;
	
	$(".navigator").click(function(){
    	$(".navigator").removeClass("active");
    	$(this).addClass("active");
    });
    
    ENCRYPTION = "ON";
    
    $("#addRates").click(function(){
    	var ratesArr = [];
    	ratesArr.push('<div class="rateClass">');
    	ratesArr.push('<span class="conversionRateType"> Bound</span> <input  class="rateConvertType"  type="text" /> ');
    	ratesArr.push('<span class="conversionRateType"> Margin</span> <input  class="rateConvertType2"  type="text" /> ');
    	ratesArr.push('<span class="conversionRateType2"> ExchangeType</span> <input  class="rateConvertType3"  type="text" value="ALL2ALL"/>');
    	ratesArr.push('</div>');
    	$("#rateContainer").append(ratesArr.join(''));
    });
    
    $("#firstSection").click(function(){
    	$("#createContractMenu").trigger("click");
    	merchantGUID = $("#masterGuid").val();
		KEY_ENC = $("#encryptKey").val();
		$(".merchantMemGuid").val($("#masterGuid").val());
     });   
    
    $("#createContractBut").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#createContractForm").serializeAndEncode());
		var utf8encoded = pidCryptUtil.decodeUTF8(formData);
		var aes = new pidCrypt.AES.CTR();
		aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
		var crypted = aes.encrypt();
		var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
		
		if(ENCRYPTION=="ON"){
			sendRequestParam = params; 
		}else if(ENCRYPTION=="OFF"){
			sendRequestParam = formData;
		}else{}
    	
    	responseDataConsole.push("<span style=color:#0051A8><b>CREATE CONTRACT</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5a/member/createContract' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+params+"</p><br>");
		
		var items = $("#createContractForm :input").map(function(index, elm) {
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
			url: domain+'v5a/member/createContract?callback=?&_method=POST&'+sendRequestParam,
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
	 
	  
	 $("#createCurrencyContractBut").click(function(){
	 	$("#console").empty();
		var formData = decodeURIComponent($("#createCurrencyContractForm").serializeAndEncode());
		var utf8encoded = pidCryptUtil.decodeUTF8(formData);
		var aes = new pidCrypt.AES.CTR();
		aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
		var crypted = aes.encrypt();
		var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
		
		if(ENCRYPTION=="ON"){
			sendRequestParam = params; 
		}else if(ENCRYPTION=="OFF"){
			sendRequestParam = formData;
		}else{}
    	
    	responseDataConsole.push("<span style=color:#0051A8><b>CREATE CURRENCY CONTRACT</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5a/member/createContractCurrency' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+params+"</p><br>");
		
		var items = $("#createCurrencyContractForm :input").map(function(index, elm) {
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
			url: domain+'v5a/member/createContractCurrency?callback=?&_method=POST&'+sendRequestParam,
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
	 
	 $("#createContractRateBut").unbind("click").click(function(){
	 	var rateInput = $(".rateConvertType").length;
	 	alert(rateInput);
	 	var ratesValJson;
	 	ratesValJson = [];
	 	for(var i=0;i<rateInput;i++){
	 		$(".rateConvertType").each(function() {
	 			var bound = $(this).val();
	 			$(".rateConvertType2").each(function() {
	 				var margin = $(this).val();
	 				$(".rateConvertType3").each(function() {
	 					var exchangeType = $(this).val();
	 					var contractId = $("#contractCurrencyId").val();
			    		ratesValJson.push("{\"contractCurrencyId\" : "+contractId+",\"bound\" : "+bound+", \"marginTp\" : \"percent\", \"margin\" : "+margin+", \"exchangeTp\" : "+exchangeType+"}");
			   });
			    });
			});
	 	}
	 	var myRates = "{rates:["+ratesValJson.join(',')+"]}";
	 	
	 	$("#rates").val(myRates);
	 	
	 	$("#console").empty();
		var formData = decodeURIComponent($("#createContractRateForm").serializeAndEncode());
		var utf8encoded = pidCryptUtil.decodeUTF8(formData);
		var aes = new pidCrypt.AES.CTR();
		aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
		var crypted = aes.encrypt();
		var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
		
		if(ENCRYPTION=="ON"){
			sendRequestParam = params; 
		}else if(ENCRYPTION=="OFF"){
			sendRequestParam = formData;
		}else{}
    	
    	responseDataConsole.push("<span style=color:#0051A8><b>CREATE CONTRACT RATE</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5a/member/createContractRate' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+params+"</p><br>");
		
		var items = $("#createContractRateForm :input").map(function(index, elm) {
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
			url: domain+'v5a/member/createContractRate?callback=?&_method=POST&'+sendRequestParam,
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