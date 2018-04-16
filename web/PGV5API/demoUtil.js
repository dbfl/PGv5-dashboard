/**
 * @author athan
 */

$.fn.serializeAndEncode = function() {
	return $.map(this.serializeArray(), function(val) {
		return [val.name, encodeURIComponent(val.value)].join('=');
	}).join('&');
};

$.fn.serializeObject = function() {
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

/**MEMBER RELATED CODE BEGIN***/
$(".menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});

$(".navigator").click(function() {
	$(".navigator").removeClass("active");
	$(this).addClass("active");
});

$(".showExtraParams").click(function(e) {
	e.preventDefault();

	if ($(this).find('span').html() == "+") {
		$(this).find('span').html("-");
	} else {
		$(this).find('span').html("+");
	}

	$(this).siblings(".extraParams").toggle();
});

$("#toggleConsole").click(function(e) {
	e.preventDefault();
	//$("#itemContent").toggle();
	$("#itemContent").toggle(function() {
		var isVisible = $("#itemContent").is(":visible");
		if (isVisible === true) {
			$("#toggleIcon").html("[-]");
			$("#page-content-wrapper").css("height", "589px");
			$("#footer").css("position", "");
			$("#footer").css("bottom", "");
		} else {
			$("#toggleIcon").html("[+]");
			$("#page-content-wrapper").css("height", "100%");
			$("#footer").css("position", "fixed");
			$("#footer").css("bottom", "0");
		}
	});
});

$("#memberMenu").click(function() {
	$(".memberSubMenu").toggle(function() {
		var isVisible = $(".memberSubMenu").is(":visible");
		if (isVisible === true) {
			$("#memberToggleIcon").html("[-]");
			$("#createMember").trigger("click");
		} else {
			$("#memberToggleIcon").html("[+]");
		}
	});

	if ($(".transactionSubMenu").is(":visible") === true) {
		$(".transactionSubMenu").toggle();
		$("#transactionToggleIcon").html("[+]");
	}

	if ($(".recurringSubMenu").is(":visible") === true) {
		$(".recurringSubMenu").toggle();
		$("#recurringToggleIcon").html("[+]");
	}

	if ($(".exchangeSubMenu").is(":visible") === true) {
		$(".exchangeSubMenu").toggle();
		$("#exchangeToggleIcon").html("[+]");
	}

});

$("#transactionMenu").click(function() {
	$(".transactionSubMenu").toggle(function() {
		var isVisible = $(".transactionSubMenu").is(":visible");
		if (isVisible === true) {
			$("#transactionToggleIcon").html("[-]");
			$("#seyfertBalance").trigger("click");
		} else {
			$("#transactionToggleIcon").html("[+]");
		}
	});

	if ($(".memberSubMenu").is(":visible") === true) {
		$(".memberSubMenu").toggle();
		$("#memberToggleIcon").html("[+]");
	}

	if ($(".recurringSubMenu").is(":visible") === true) {
		$(".recurringSubMenu").toggle();
		$("#recurringToggleIcon").html("[+]");
	}

	if ($(".exchangeSubMenu").is(":visible") === true) {
		$(".exchangeSubMenu").toggle();
		$("#exchangeToggleIcon").html("[+]");
	}
});

$("#recurringMenu").click(function() {
	$(".recurringSubMenu").toggle(function() {
		var isVisible = $(".recurringSubMenu").is(":visible");
		if (isVisible === true) {
			$("#recurringToggleIcon").html("[-]");
			$("#payRecurring").trigger("click");
		} else {
			$("#recurringToggleIcon").html("[+]");
		}
	});

	if ($(".transactionSubMenu").is(":visible") === true) {
		$(".transactionSubMenu").toggle();
		$("#transactionToggleIcon").html("[+]");
	}

	if ($(".memberSubMenu").is(":visible") === true) {
		$(".memberSubMenu").toggle();
		$("#memberToggleIcon").html("[+]");
	}

	if ($(".exchangeSubMenu").is(":visible") === true) {
		$(".exchangeSubMenu").toggle();
		$("#exchangeToggleIcon").html("[+]");
	}
});

$("#exchangeMenu").click(function() {
	$(".exchangeSubMenu").toggle(function() {
		var isVisible = $(".exchangeSubMenu").is(":visible");
		if (isVisible === true) {
			$("#exchangeToggleIcon").html("[-]");
			$("#exchangeInquiry").trigger("click");
		} else {
			$("#exchangeToggleIcon").html("[+]");
		}
	});

	if ($(".transactionSubMenu").is(":visible") === true) {
		$(".transactionSubMenu").toggle();
		$("#transactionToggleIcon").html("[+]");
	}

	if ($(".memberSubMenu").is(":visible") === true) {
		$(".memberSubMenu").toggle();
		$("#memberToggleIcon").html("[+]");
	}

	if ($(".recurringSubMenu").is(":visible") === true) {
		$(".recurringSubMenu").toggle();
		$("#recurringToggleIcon").html("[+]");
	}
});

$("#chargeToAccountBut").click(function() {
	if ($(".transactionSubMenu").is(":visible") !== true) {
		$(".transactionSubMenu").show();
		$("#transactionToggleIcon").html("[-]");
		$("#seyfertBalance").trigger("click");
	}

	if ($(".memberSubMenu").is(":visible") === true) {
		$(".memberSubMenu").toggle();
		$("#memberToggleIcon").html("[+]");
	}

	if ($(".recurringSubMenu").is(":visible") === true) {
		$(".recurringSubMenu").toggle();
		$("#recurringToggleIcon").html("[+]");
	}

	if ($(".exchangeSubMenu").is(":visible") === true) {
		$(".exchangeSubMenu").toggle();
		$("#exchangeToggleIcon").html("[+]");
	}
});

$("#decryptMsgBut").click(function() {
	var bits = 256;
	var encryptedStr = $("#encryptedMsgTxt").val();
	var KEY_ENC = $("#encryptKey").val();
	var utf8encoded = pidCryptUtil.encodeUTF8(encryptedStr);
	var aes = new pidCrypt.AES.CTR();

	var decryptedStr = aes.decryptText(encryptedStr, KEY_ENC, {
		nBits : bits
	});
	$("#decryptedMsgTxt").val(decryptedStr);
});

/**ENCRYPT DATA GENERATOR**/
$(".resultSet").val('');
$("#generateButton").click(function() {
	var guid = $("#reqMemGuidg").val();
	var KEY_ENC = $("#keyg").val();

	if ($("#paramSet").val() == '' || $("#reqUri").val() == '') {
		alert("Required Field cannont be null");
	} else {
		var rawData = "reqMemGuid=" + guid + "&" + $("#paramSet").val();
		var readyEncryptData = rawData.replace(/\s/g, '');
		var enCryptData = ENCRYPT_REQUEST_PARAMETERS(readyEncryptData, KEY_ENC);
		var url = $("#reqUri").val();
		var method = $("#method").val();
		var param = "reqMemGuid=" + guid + "&encReq=" + ENCODE_URI_COMPONENT(enCryptData);

		$("#plainReq").val(url + "?_method=" + method + "&" + readyEncryptData);
		$("#encryptReq").val(url + "?_method=" + method + "&" + param);
	}
});

var scrollTop = function() {
	var objDiv = document.getElementById("itemContent");
	objDiv.scrollTop = objDiv.scrollHeight;
};

var responseDataConsole = [];

var generatePlainNEncryptData = function(serviceURL, formData, params, title) {
	var setRestMethod;
	responseDataConsole.push("<span style=color:#0051A8><b>" + title + "</b> </span> <br>");
	responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>" + serviceURL + "<br>");
	if (title == "ASSIGN VIRTUAL ACCOUNT") {
		setRestMethod = "PUT";
	} else if (title == "ADD MEMBER INFO" || title == "SEYFERT BALANCE") {
		setRestMethod = "GET";
	} else {
		setRestMethod = "POST";
	}
	responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br><p style=word-break: break-all;>_method=" + setRestMethod + "&" + formData + "</p><br>");
	responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br><p style=word-break: break-all;>_method=" + setRestMethod + "&" + params + "</p><br>");
};

var generateFormParamTable = function(formNamePlusField) {
	var items = $(formNamePlusField).map(function(index, elm) {
		return {
			name : elm.name,
			type : elm.type,
			value : $(elm).val()
		};
	});

	var paramsTable = [];
	paramsTable.push("<table border=1 style=width:40%>");
	paramsTable.push("<tr style='color:#D9534F;'>");
	paramsTable.push("<th class=thMargin>Param</th>");
	paramsTable.push("<th class=thMargin>Value</th>");
	paramsTable.push("</tr>");
	paramsTable.push("<tr>");

	$.each(items, function(i, d) {
		//$("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
		paramsTable.push("<tr>");
		paramsTable.push("<td class=thMargin><b>" + d.name + "</b></td>");
		paramsTable.push("<td class=thMargin>" + d.value + "</td>");
		paramsTable.push("</tr>");
	});
	paramsTable.push("</table>");
	responseDataConsole.push("<span><b>Parameters Details:</b></span><br>" + paramsTable.join('') + "<br>");
};

var generateSuccessField = function(data) {
	responseDataConsole.push("<b>Response Status: " + data.status + "</b><br>");
	responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
	responseDataConsole.push("=========================== <br>");
	return responseDataConsole.join('');
};

var generateResponseErrorField = function(data) {
	responseDataConsole.push("<b>Response Status: " + data.status + "</b><br>");
	responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
	responseDataConsole.push("=========================== <br>");

	return responseDataConsole.join('');
};

var generateConnectionErrorField = function(data) {
	responseDataConsole.push("<b>Response Status: " + data.status + "</b><br>");
	responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
	responseDataConsole.push("=========================== <br>");
	return responseDataConsole.join('');
};

var generateGlobalParameters = function() {
	var itemss = $("#globalParametersForm :input").map(function(index, elm) {
		return {
			name : elm.name,
			title: elm.title,
			type : elm.type,
			value : $(elm).val()
		};
	});
	
	var globalparamsTable = [];
	$.each(itemss, function(i, d) {
		globalparamsTable.push("<div class='labels'>");
		globalparamsTable.push("<span>" + d.title + "</span>");
		globalparamsTable.push("</div>");
		globalparamsTable.push("<div class='inpuControl'>");
		globalparamsTable.push("<input type='text' class='textBoxs "+d.name+"' name="+d.name+"  value='"+d.value+"'>");
		globalparamsTable.push("</div>");
	});
	
	var myGlobalData = 	globalparamsTable.join('');
	$(".globalParamContainer").empty();
	$(".globalParamContainer").html(myGlobalData);
};
