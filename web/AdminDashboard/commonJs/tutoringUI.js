/**
 * @author Gabriel
 */

var HOST_URI = window.location.hostname;
var TARGET_URI = "http://localhost:8080/";

if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
var isAdmin = $.cookie("isAdmin");
var num = 1;
var rowsPerPage = 6;

var memberListPage = function(page){
	memberList(page);
};

var bits = 256;
var merchantGUID = $.cookie("superGuid");
var KEY_ENC = $.cookie("pkey");
var cookieLanguage = $.cookie("language");

function getNextDt() {
	var url = TARGET_URI + 'v5a/lesson/nextSession?_method=GET&';
	var method = 'GET';
	var rawData = 'reqMemGuid=' + merchantGUID;

    param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));

    AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		var date = new Date(data.data.result);
		
		$('#nextLecture').text(date);
	});
}


function getLecturesList() {
	var url = TARGET_URI + 'v5a/lesson?_method=GET&';
	var method = 'GET';
	var rawData = 'reqMemGuid=' + merchantGUID;

    param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));

    AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		var resList = data.data.result;
		var size = resList.length;
		var uiRes = [];

		
		for(var i = 0; i < size; i++){
			var button = "";
			if (resList[i].login == undefined)
				button = '<a id="' + resList[i].id + '" class="endorseButton"> <i class="fa fa-thumbs-o-up"> </i></a>';

			uiRes.push("<tr class='gradeX' style='height:30px;'>");
			uiRes.push("<td>" + resList[i].desc + "</td>");
			uiRes.push("<td>" + resList[i].creator + "</td>");
			uiRes.push("<td>" + button + "</td>");
			uiRes.push("</tr>");
		}
		
		$("#lecturesData").html(uiRes.join('')).trigger('footable_redraw');
		
		$('.endorseButton').click(function() {
			var id = $(this).attr('id');
			
			var url = TARGET_URI + 'v5a/lesson/vote?_method=POST&';
			var method = 'POST';
			var rawData = 'reqMemGuid=' + merchantGUID + '&id=' + id;

		    param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));

		    AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
		    	getLecturesList();
		    	alert("Voted!");
		    });
		});
		
	});
}

$(document).ready(function(){

		
	if(typeof merchantGUID === 'undefined'){
		window.location.href = 'login.html';
	}
	
	getNextDt();
	getLecturesList();
	
	$('#addLecture').click(function() {
		var newLecture = $("#newLectureTitle").val();
		
		var url = TARGET_URI + 'v5a/lesson?_method=POST&';
		var method = 'POST';
		var rawData = 'reqMemGuid=' + merchantGUID + "&studyDesc=" + newLecture;

	    param = 'reqMemGuid='+merchantGUID+'&encReq='+ENCODE_URI_COMPONENT(ENCRYPT_REQUEST_PARAMETERS(rawData));

	    AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
	    	alert("Lecture added!");
	    	getLecturesList();
	    });
	});
});