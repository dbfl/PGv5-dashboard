var DOMAIN = "http://localhost:8080";
var logContent = '';
var showLoading = '<tr><td colspan="14" style="text-align: center;">Loading ...</td></tr>';
$(document).ready(function(){
	defaultLoadData();
	$("#submitSearchForm").click(function(){
		$("#tableCapt").html(showLoading);
 		var params = $("#searchForm").serialize();
 		console.log("params:"+params);
 		getCaptListV51(params,10,1);
 	});
  	
	$('#datetimepicker1').datetimepicker({
		format: 'YYYY/MM/D'
	});
	$('#datetimepicker2').datetimepicker({
		format: 'YYYY/MM/D'
	});
});

function defaultLoadData(){
	console.log("defaultLoadData");
	$("#tableCapt").html(showLoading);
	var params = '_method=GET';
	getCaptListV51(params,10,1);
}

var formatTime = function(unixTimestamp) {
    var dt = new Date(unixTimestamp);
    var d = dt.getDay();
    var m = dt.getMonth();
    var y = dt.getFullYear();
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var seconds = dt.getSeconds();

    if (d < 10) 
        d = '0' + d;
    if (m < 10) 
        m = '0' + m;
    
    if (hours < 10) 
     hours = '0' + hours;

    if (minutes < 10) 
     minutes = '0' + minutes;

    if (seconds < 10) 
     seconds = '0' + seconds;

    return y +"-"+ m + "-"+ d + " " + hours + ":" + minutes + ":" + seconds;
}       


function getCaptListV51(params, rowsperpage, page){
	$.ajax({
		url:DOMAIN+'/v5a/service/captListV51?callback=?&' + params + '&rowsperpage=' + rowsperpage + '&page=' + page + "&logContent=" + logContent,
		type:'GET',
		dataType:'jsonp',
		error:function(data){alert("error");},
		success:function(data){
			var items = data.data.result.captListV51;
			var total = data.data.result.total;			
			$("#total").html("(" + total + ")");
			setDataToTable(items)
			console.log("total:" + total);
			$('#pagTableCapt').bootpag({
			    total: total,
			    page: page,
			    maxVisible: 10,
			    leaps: true,
			    firstLastUse: true,
			    first: '←',
			    last: '→',
			    wrapClass: 'pagination',
			    activeClass: 'active',
			    disabledClass: 'disabled',
			    nextClass: 'next',
			    prevClass: 'prev',
			    lastClass: 'last',
			    firstClass: 'first'
			}).on("page", function(event, num){
				$("#tableCapt").html(showLoading);
				$.ajax({
					url:DOMAIN+'/v5a/service/captListV51?callback=?&' + params + '&rowsperpage=' + rowsperpage + '&page=' + num,
					type:'GET',
					dataType:'jsonp',
					error:function(data){alert("error");},
					success:function(data){
						var items = data.data.result.captListV51;
						total = data.data.result.total;
						console.log(total);
						$("#total").html("(" + total + ")");
						console.log("total1:" + total);
						setDataToTable(items);
					}
				});
				
			}); 
			
			
			
		}
	});

}

function setDataToTable(items){
	var dataHtml = [];
	$.each(items, function(i, d){
		dataHtml.push("<tr>");
		dataHtml.push("<td>"+i+"</td>");		    
		dataHtml.push("<td>"+d.trNo+"</td>");		    
		dataHtml.push("<td>"+d.trTpNo+"</td>");		    
		dataHtml.push("<td>"+d.trSt+"</td>");		    
		dataHtml.push('<td>'+d.crdTp+'</td>');		    
		dataHtml.push("<td>"+d.memNo+"</td>");		    
		dataHtml.push("<td></td>");		    
		dataHtml.push("<td>"+d.trDt+"</td>");		    
		dataHtml.push("</tr>");
	});
	
	$("#tableCapt").html(dataHtml.join(''));
}

