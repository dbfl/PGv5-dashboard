$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

 
$(document).ready(function(){
	var parentid;
	var reqMemguid;
	var refId;
	var title;
	var encryptData;
	var bits = 256;
	var merchantGUID;
	var KEY_ENC;
	var ENCRYPTION = "OFF";
	var sendRequestParam;
	var responseMessage;
	var responseDataConsole = [];
	window.location = "CardDemo.html#page1";
	
	//$( "#itemContent" ).wrap( "<div class='scroll'></div>" );
 	/**CARD PAYMENT RELATED CODE BEGIN***/
   
    $(".menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    
    $(".navigator").click(function(){
    	$(".navigator").removeClass("active");
    	$(this).addClass("active");
    });
    
    $("#firstSection").click(function(){
    	$("#cardRegisterLab").trigger("click");
    	merchantGUID = $("#masterGuid").val();
		KEY_ENC = $("#encryptKey").val();
		$(".merchantMemGuid").val($("#masterGuid").val());
	 });
    
     $("#cancelMenu").click(function(){
    	$(".cancelSubMenu").toggle(
        function(){
        	var isVisible = $( ".cancelSubMenu" ).is( ":visible" );
        	if(isVisible===true){
        		$("#cancelToggleIcon").html("[-]");
        		$("#fullCancel").trigger("click");		
        	}else{
        		$("#cancelToggleIcon").html("[+]");
        	}
        });
    });
    
    $(".singleMenu").click(function(){
    	 if($( ".cancelSubMenu" ).is( ":visible" )===true){
        	$( ".cancelSubMenu" ).toggle();
        	$("#cancelToggleIcon").html("[+]");
        }
    });
    
    $("#toggleConsole").click(function(e) {
        e.preventDefault();
        //$("#itemContent").toggle();
       $("#itemContent").toggle(
        function(){
        	var isVisible = $( "#itemContent" ).is( ":visible" );
        	if(isVisible===true){
        		$("#toggleIcon").html("[-]");		
        	}else{
        		$("#toggleIcon").html("[+]");
        	}
        });
    });
  	/****
	 * List of domain:
	 * var domain = "https://dev5.paygate.net/";
	 * var domain = "http://52.69.145.143/";
	 * var domain = "https://v5.paygate.net/";
	 * var domain = "http://localhost:8080/";
	 */
	
	var HOST_URI = window.location.hostname;
	var TARGET_URI = "http://localhost:8080/";
	
	if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
	if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
	if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
	
	var domain = TARGET_URI;
	
	/****
	 * ENCRYPTION specifies how data would be send; either in encrypted format or un-encrypted format.
	 * To send un-encrypted data, comment out the statement ENCRYPTION = "ON". 
	 */
	//ENCRYPTION = "ON";
	 
	$("#pageTop").trigger("click"); 
	
	$.fn.serializeAndEncode = function() {
	    return $.map(this.serializeArray(), function(val) {
	        return [val.name, encodeURIComponent(val.value)].join('=');
	    }).join('&');
	};
	
	$("#registerCardButton").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#registerCardForm").serializeAndEncode());
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
		
		responseDataConsole.push("<span style=color:#0051A8><b>REGISTER CARD</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/card/registCard' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+params+"</p><br>");
		
		var items = $("#registerCardForm :input").map(function(index, elm) {
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
		    $("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
		$.ajax({
			url:domain+'v5/card/registCard?callback=?&_method=POST&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){
				alert("error");
				responseDataConsole.push("<br><span style='background-color:navy;color:#ffffff'> <b>URL ERROR:</b> <br>" + JSON.stringify(data) + "</span><br>");
				responseDataConsole.push("=========================== <br>");
				$("#console").append(responseDataConsole.join(""));
				
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
			},
			success:function(data){
				responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
				if(data.status=="SUCCESS"){
					alert(data.data.status);
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
				}
				
				else if(data.status !="SUCCESS"){
					var errorArray = [];
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
			}
		});		
		
		$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  		return false;
	});
	
	$("#getRegisterCardButton").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#getRegisteredCardForm").serializeAndEncode());
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
		
		responseDataConsole.push("<span style=color:#0051A8><b>GET REGISTERED CARD</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/card/getRegistered' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+params+"</p><br>");
		
		var items = $("#getRegisteredCardForm :input").map(function(index, elm) {
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
		    $("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
		
		$.ajax({
			url:domain+'v5/card/getRegistered?callback=?&_method=GET&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){
				alert("error");
				responseDataConsole.push("<br><span style='background-color:navy;color:#ffffff'> <b>URL ERROR:</b> <br>" + JSON.stringify(data) + "</span><br>");
				responseDataConsole.push("=========================== <br>");
				$("#console").append(responseDataConsole.join(""));
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
			},
			success:function(data){
				responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
				if(data.status=="SUCCESS"){
					alert(data.data.status);
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
					
					$("#getRegisterCardLabButton").trigger("click");
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				
				else if(data.status!="SUCCESS"){
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
			}
		});		
		
		$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  		return false;
	});
	
	$("#getAACodeButton").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#getAACodeForm").serializeAndEncode());
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
		
		responseDataConsole.push("<span style=color:#0051A8><b>GET AA CODE</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/card/getAACode' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+params+"</p><br>");
		
		var items = $("#getAACodeForm :input").map(function(index, elm) {
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
		    $("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
		$.ajax({
			url:domain+'v5/card/getAACode?callback=?&_method=GET&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){
				alert("error");
				responseDataConsole.push("<br><span style='background-color:navy;color:#ffffff'> <b>URL ERROR:</b> <br>" + JSON.stringify(data) + "</span><br>");
				responseDataConsole.push("=========================== <br>");
				$("#console").append(responseDataConsole.join(""));
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
			},
			success:function(data){
				responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
				if(data.status=="SUCCESS"){
					alert(data.data.status);
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				
				else if(data.status!="SUCCESS"){
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
			}
		});
		
		$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  		return false;
	});
	
	$("#getAAAprovalButton").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#getAAApprovalForm").serializeAndEncode());
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
		
		responseDataConsole.push("<span style=color:#0051A8><b>AA APPROVAL</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/card/AAApproval' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+params+"</p><br>");
		
		var items = $("#getAAApprovalForm :input").map(function(index, elm) {
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
		    $("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
		$.ajax({
			url:domain+'v5/card/AAApproval?callback=?&_method=GET&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){
				alert("error");
				responseDataConsole.push("<br><span style='background-color:navy;color:#ffffff'> <b>URL ERROR:</b> <br>" + JSON.stringify(data) + "</span><br>");
				responseDataConsole.push("=========================== <br>");
				$("#console").append(responseDataConsole.join(""));
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
			},
			success:function(data){
				responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
				if(data.status=="SUCCESS"){
					alert(data.data.status);
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				
				else if(data.status!="SUCCESS"){
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
			}
		});
		$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  		return false;
	});
	
	$("#captureButton").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#captureImageForm").serializeAndEncode());
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
		
		responseDataConsole.push("<span style=color:#0051A8><b>CAPTURE IMAGE</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/card/capture' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+params+"</p><br>");
		
		var items = $("#captureImageForm :input").map(function(index, elm) {
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
		    $("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
		$.ajax({
			url:domain+'v5/card/capture?callback=?&_method=GET&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){
				alert("error");
				responseDataConsole.push("<br><span style='background-color:navy;color:#ffffff'> <b>URL ERROR:</b> <br>" + JSON.stringify(data) + "</span><br>");
				responseDataConsole.push("=========================== <br>");
				$("#console").append(responseDataConsole.join(""));
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
			},
			success:function(data){
				responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
				if(data.status=="SUCCESS"){
					alert(data.data.status);
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				
				else if(data.status!="SUCCESS"){
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
			}
		});
		
		$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  		return false;
	});
	
	
	$("#cardBasicButton").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#cardBasicForm").serializeAndEncode());
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
		
		responseDataConsole.push("<span style=color:#0051A8><b>CARD BASIC</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/card/basic' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+params+"</p><br>");
		
		var items = $("#cardBasicForm :input").map(function(index, elm) {
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
		    $("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
		
		$.ajax({
			url:domain+'v5/basic/card?callback=?&_method=POST&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){
				alert("error");
				responseDataConsole.push("<br><span style='background-color:navy;color:#ffffff'> <b>URL ERROR:</b> <br>" + JSON.stringify(data) + "</span><br>");
				responseDataConsole.push("=========================== <br>");
				$("#console").append(responseDataConsole.join(""));
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
			},
			success:function(data){
				responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
				if(data.status=="SUCCESS"){
					alert(data.data.status);
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				
				else if(data.status!="SUCCESS"){
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
			}
		});
		
		$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  		return false;
	});
	
	$("#cardTokenButton").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#cardTokenForm").serializeAndEncode());
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
		
		responseDataConsole.push("<span style=color:#0051A8><b>CARD TOKEN</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/card/token' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=POST&"+params+"</p><br>");
		
		var items = $("#cardTokenForm :input").map(function(index, elm) {
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
		    $("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
		
		$.ajax({
			url:domain+'v5/card/token?callback=?&_method=POST&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){
				alert("error");
				responseDataConsole.push("<br><span style='background-color:navy;color:#ffffff'> <b>URL ERROR:</b> <br>" + JSON.stringify(data) + "</span><br>");
				responseDataConsole.push("=========================== <br>");
				$("#console").append(responseDataConsole.join(""));
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
			},
			success:function(data){
				responseDataConsole.push("<b>Response Status: "+data.status+":"+ data.data.status+"</b><br>");
				if(data.status=="SUCCESS"){
					alert(data.data.status);
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				
				else if(data.status!="SUCCESS"){
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
			}
		});
		
		$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  		return false;
	});
	
	
	$("#fullCancelButton").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#cardTokenForm").serializeAndEncode());
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
		
		responseDataConsole.push("<span style=color:#0051A8><b>FULL CANCEL</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/card/cancel' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+params+"</p><br>");
		
		var items = $("#cardTokenForm :input").map(function(index, elm) {
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
		    $("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
		$.ajax({
			url:domain+'v5/card/cancel?callback=?&_method=GET&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){
				alert("error");
				responseDataConsole.push("<br><span style='background-color:navy;color:#ffffff'> <b>URL ERROR:</b> <br>" + JSON.stringify(data) + "</span><br>");
				responseDataConsole.push("=========================== <br>");
				$("#console").append(responseDataConsole.join(""));
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
			},
			success:function(data){
				responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
				if(data.status=="SUCCESS"){
					alert(data.data.status);
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				
				else if(data.status!="SUCCESS"){
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
			}
		});
		$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  		return false;
	});
	
	$("#partialCancelButton").click(function(){
		$("#console").empty();
		var formData = decodeURIComponent($("#partialCancelForm").serializeAndEncode());
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
		
		responseDataConsole.push("<span style=color:#0051A8><b>PARTIAL CANCEL</b> </span> <br>");
		responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/card/cancel' +"<br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+formData+"</p><br>");
		responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>callback=?&_method=GET&"+params+"</p><br>");
		
		var items = $("#partialCancelForm :input").map(function(index, elm) {
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
		    $("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		    paramsTable.push("<tr>");
			paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");		    
			paramsTable.push("<td class=thMargin>"+d.value+"</td>");
			paramsTable.push("</tr>");
		});
		paramsTable.push("</table>");
		responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");
		$.ajax({
			url:domain+'v5/card/cancel?callback=?&_method=GET&'+sendRequestParam,
			type:'POST',
			dataType:'jsonp',
			error:function(data){
				alert("error");
				responseDataConsole.push("<br><span style='background-color:navy;color:#ffffff'> <b>URL ERROR:</b> <br>" + JSON.stringify(data) + "</span><br>");
				responseDataConsole.push("=========================== <br>");
				$("#console").append(responseDataConsole.join(""));
				$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  				return false;
			},
			success:function(data){
				responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
				if(data.status=="SUCCESS"){
					alert(data.data.status);
					responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
				
				else if(data.status!="SUCCESS"){
					alert("please try again");
					responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
					responseDataConsole.push("=========================== <br>");
					$("#console").append(responseDataConsole.join(""));
					
					$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  					return false;
				}
			}
		});
		$("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
  		return false;
	});
});


