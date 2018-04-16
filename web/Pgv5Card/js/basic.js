var DOMAIN = "http://localhost:8080";
$(document).ready(function(){
  	$("#submitForm").click(function(){
 		var param = $("#PGIOForm").serialize();
 		var method="GET";
 		var url = DOMAIN + "/v5/card/basic?callback=?&_method=POST&";
 		console.log(url + param);
 		AJAX_REQUEST.AJAX.CALL_SERVICE(url,method,param,function(data,status){
 			$(".jsonOutClass").show();
 			$("#jsonOutput").val(url + param + ' =======> ' + JSON.stringify( data.data));
 		});	
 	});
});