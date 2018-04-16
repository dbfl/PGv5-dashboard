var DOMAIN = "http://localhost:8080";
var logContent = '';
var showLoading = '<tr><td colspan="14" style="text-align: center;">Loading ...</td></tr>';
$(document).ready(function(){
	defaultLoadData();
	$("#submitSearchForm").click(function(){
		$("#tableTransactions").html(showLoading);
 		var params = $("#searchForm").serialize();
 		console.log("params:"+params);
 		getTransactionList(params,10,1);
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
	$("#tableTransactions").html(showLoading);
	logContent = "functino name here line 19:" + new Date();
	var params = '_method=GET';
	params += '&tid=';
	params += '&trnsctnTp=';
	params += '&fromDate=';
	params += '&toDate=';
	params += '&orgCrrncy=';
	params += '&orgAmt=';
	getTransactionList(params,10,1);
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


function getTransactionList(params, rowsperpage, page){
	logContent += "function name getTransactionList: line 59---" + new Date();
	console.log("function name getTransactionList: line 59:" + params + "---" + new Date());
	$.ajax({
		url:DOMAIN+'/v5a/service/transactionListV51?callback=?&' + params + '&rowsperpage=' + rowsperpage + '&page=' + page + "&logContent=" + logContent,
		type:'GET',
		dataType:'jsonp',
		error:function(data){alert("error");},
		success:function(data){
			var items = data.data.result.trnsctnList;
			var total = data.data.result.total;			
			$("#total").html("(" + total + ")");
			setDataToTable(items)
			console.log("total:" + total);
			$('#pagTableTransactions').bootpag({
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
				$("#tableTransactions").html(showLoading);
				$.ajax({
					url:DOMAIN+'/v5a/service/transactionListV51?callback=?&' + params + '&rowsperpage=' + rowsperpage + '&page=' + num,
					type:'GET',
					dataType:'jsonp',
					error:function(data){alert("error");},
					success:function(data){
						var items = data.data.result.trnsctnList;
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
		var crdApprvlNo = d.crdApprvlNo;
		if(typeof(d.crdApprvlNo)  === "undefined"){
			crdApprvlNo = "";
		}
		var merchantNo = d.merchantNo;
		if(typeof(d.merchantNo)  === "undefined"){
			merchantNo = "";
		}
		
		var crdPrefix = d.crdPrefix;
		if(typeof(d.crdPrefix)  === "undefined"){
			crdPrefix = "";
		}
		
		var vanNo = d.vanNo;
		if(typeof(d.vanNo)  === "undefined"){
			vanNo = "";
		}
		
		var terminalNo = d.terminalNo;
		if(typeof(d.terminalNo)  === "undefined"){
			terminalNo = "";
		}
		var payRsltMsg = d.payRsltMsg;
		if(typeof(d.payRsltMsg)  === "undefined"){
			payRsltMsg = "";
		}
		
		dataHtml.push("<tr>");
		dataHtml.push("<td>"+(i+1)+"</td>");		    
		dataHtml.push("<td>"+d.tid+"</td>");		    
		dataHtml.push("<td>"+d.trnsctnTp+"</td>");		    
		dataHtml.push("<td>"+d.trnsctnSt+"</td>");		    
		dataHtml.push("<td>"+d.fullName+"</td>");		    
		dataHtml.push("<td>"+crdApprvlNo+"</td>");		    
		dataHtml.push("<td>"+merchantNo+"</td>");		    
		dataHtml.push("<td>"+crdPrefix+"</td>");		    
		dataHtml.push("<td>"+vanNo+"</td>");		    
		dataHtml.push("<td>"+terminalNo+"</td>");		    
		dataHtml.push("<td>"+d.orgAmt+"</td>");		    
		dataHtml.push("<td>"+payRsltMsg+"</td>");		    
		dataHtml.push("<td>"+formatTime(d.trnsctnDt)+"</td>");		    
		var cancelBtn = '';
		var res = new Array();
		res = d.trnsctnSt.split("_");
		console.log(res[res.length - 1]);
		if(res[res.length - 1] == "APPROVED"){
			dataHtml.push('<td><span class="btn btn-primary" id="cancel_'+d.tid+'">Cancel</span></td>');
		}else{
			dataHtml.push('<td></td>');
		}
		dataHtml.push("</tr>");
	});
	
	$("#tableTransactions").html(dataHtml.join(''));
}