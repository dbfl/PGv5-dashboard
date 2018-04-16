/**
 * @author athan
 */

/***Serialize encode***/
$.fn.serializeAndEncode = function() {
	return $.map(this.serializeArray(), function(val) {
		return [val.name, encodeURIComponent(val.value)].join('=');
	}).join('&');
};

/**Currency Util**/
var currencyFormat = function(num) {
	return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

/**
 * UTC Date Util
 *  **/
var UTC_DATE_TIME = function(data) {
	var convertToUtcDateTime = new Date(data);
	return convertToUtcDateTime.toUTCString();
};

/**
 * YYYYMMDD Date Format Util
 *  **/
var yyyymmdd = function(dateIn) {
	var yyyy = dateIn.getFullYear();
	var mm = dateIn.getMonth() + 1;
	// getMonth() is zero-based
	var dd = dateIn.getDate();
	return String(10000 * yyyy + 100 * mm + dd);
	// Leading zeros for mm and dd
};

var dateFunction = function(date) {
	var date = new Date(date);
	var month = ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
	var day = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
	var hour = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
	var minute = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	var dateStr = date.getFullYear() + "/" + month + "/" + day + " " + hour + ":" + minute;

	var finalDate = dateStr;
	return finalDate;
};

var dateTimeMinutesFunction = function(date) {
	var date = new Date(date);
	var month = ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
	var day = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
	var hour = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
	var minute = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	var seconds = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
	var dateStr = date.getFullYear() + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + seconds;

	var finalDate = dateStr;
	return finalDate;
};

/**
 * Encode URI component Util
 *  **/
var ENCODE_URI_COMPONENT = function(data) {
	return encodeURIComponent(data);
};

/**
 * Decode URI component Util
 *  **/
var DECODE_URI_COMPONENT = function(data) {
	return decodeURIComponent(data);
};

/**
 * Encryption Util
 * **/
var ENCRYPT_REQUEST_PARAMETERS = function(data) {
	var bits = 256;
	var utf8encoded = pidCryptUtil.decodeUTF8(data);
	var aes = new pidCrypt.AES.CTR();
	aes.initEncrypt(utf8encoded, KEY_ENC, {
		nBits : bits
	});
	var crypted = aes.encrypt();

	return crypted;
};

/**
 * Encryption Util type2
 * **/
var ENCRYPT_REQUEST_PARAMETERS_TYPE = function(data, keyp) {
	var bits = 256;
	var KEY_ENC = keyp;
	var utf8encoded = pidCryptUtil.decodeUTF8(data);
	var aes = new pidCrypt.AES.CTR();
	aes.initEncrypt(utf8encoded, KEY_ENC, {
		nBits : bits
	});
	var crypted = aes.encrypt();

	return crypted;
};

/**
 * Generate 64bit ransom key
 * **/

var generat64BitKey = function() {
	/**Generate Key**/
	var i,
	    j,
	    k = "";
	var i,
	    j,
	    k = "";
	addEntropyTime();
	var seed = keyFromEntropy();
	var prng = new AESprng(seed);
	var hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+=-_/@#$";

	for ( i = 0; i < 64; i++) {
		k += hexDigits.charAt(prng.nextInt(15));
	}
	delete prng;
	var myGenerated64BitKey = k;
	return myGenerated64BitKey;
};

/**
 * Ajax request util
 * **/
var AJAX_REQUEST = {};
var CHECK_COMPLETE_STATUS;
AJAX_REQUEST.AJAX = (function() {
	return {
		CALL_SERVICE : function(url, method, param, callback) {
			$.ajax({
				url : url + param,
				type : method,
				dataType : 'jsonp',
				error : function() {
					// alert("connection error");
					console.log("connection error");
				},
				success : function(data, textStatus) {
					callback(data, textStatus);
				},
				complete : function(xhr, textStatus) {
					/****
					 * CHECK_COMPLETE_STATUS = xhr.status;
					 * CHECK_COMPLETE_STATUS = textStatus;
					 */
				}
			});
		}
	};
})();

/**
 *
 *Jquery download file util
 *
 */
jQuery.download = function(url, data, method) {
	//url and data options required
	if (url && data) {
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function() {
			var pair = this.split('=');
			inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
		});
		//send request
		jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
	};
};

/**
 * Convert Json to Excel
 * **/
var JSONToCSVConvertor = function(JSONData, ReportTitle, ShowLabel) {
	//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

	var CSV = '';
	//Set Report title in first row or line

	CSV += ReportTitle + '\r\n\n';

	//This condition will generate the Label/Header
	if (ShowLabel) {
		var row = "";

		//This loop will extract the label from 1st index of on array
		for (var index in arrData[0]) {

			//Now convert each value to string and comma-seprated
			row += index + ',';
		}

		row = row.slice(0, -1);

		//append Label row with line break
		CSV += row + '\r\n';
	}

	//1st loop is to extract each row
	for (var i = 0; i < arrData.length; i++) {
		var row = "";

		//2nd loop will extract each column and convert it in string comma-seprated
		for (var index in arrData[i]) {
			row += '"' + arrData[i][index] + '",';
		}

		row.slice(0, row.length - 1);

		//add a line break after each row
		CSV += row + '\r\n';
	}

	if (CSV == '') {
		alert("Invalid data");
		return;
	}

	//Generate a file name
	var fileName = "MyReport_";
	//this will remove the blank-spaces from the title and replace it with an underscore
	fileName += ReportTitle.replace(/ /g, "_");

	//Initialize file format you want csv or xls
	var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

	// Now the little tricky part.
	// you can use either>> window.open(uri);
	// but this will not work in some browsers
	// or you will not get the correct file extension

	//this trick will generate a temp <a /> tag
	var link = document.createElement("a");
	link.href = uri;

	//set the visibility hidden so it will not effect on your web-layout
	link.style = "visibility:hidden";
	link.download = fileName + ".csv";

	//this part will append the anchor tag and remove it after automatic click
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

/**Popup window**/
var PopupCenterDual = function(url, title, w, h) {
	// Fixes dual-screen position Most browsers Firefox
	var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
	var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
	width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	var left = ((width / 2) - (w / 2)) + dualScreenLeft;
	var top = ((height / 2) - (h / 2)) + dualScreenTop;
	var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

	// Puts focus on the newWindow
	if (window.focus) {
		newWindow.focus();
	}
};

/*****Timer****/
var timer;
var Countdown = function(options) {
	var instance = this,
	    seconds = options.seconds || 10,
	    updateStatus = options.onUpdateStatus ||
	function() {
	},
	    counterEnd = options.onCounterEnd ||
	function() {
	};

	function decrementCounter() {
		updateStatus(seconds);
		if (seconds === 0) {
			counterEnd();
			instance.stop();
		}
		seconds--;
	}

	this.start = function() {
		clearInterval(timer);
		timer = 0;
		seconds = options.seconds;
		timer = setInterval(decrementCounter, 1000);
	};

	this.stop = function() {
		clearInterval(timer);
	};
}; 