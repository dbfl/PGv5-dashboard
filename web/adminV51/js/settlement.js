var DOMAIN = "http://localhost:8080";
var logContent = '';
var showLoading = '<tr><td colspan="14" style="text-align: center;">Loading ...</td></tr>';
$(document).ready(function(){
	defaultLoadData();
	$("#submitSearchForm").click(function(){
		$("#tableSettlement").html(showLoading);
 		var params = $("#searchForm").serialize();
 		console.log("params:"+params);
 		getSettlementListV51(params,10,1);
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
	$("#tableSettlement").html(showLoading);
	var params = '_method=GET';
	params += '&tid=';
	params += '&trnsctnTp=';
	params += '&fromDate=';
	params += '&toDate=';
	params += '&orgCrrncy=';
	params += '&orgAmt=';
	getSettlementListV51(params,10,1);
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


function getSettlementListV51(params, rowsperpage, page){
	$.ajax({
		url:DOMAIN+'/v5a/service/settlementListV51?callback=?&' + params + '&rowsperpage=' + rowsperpage + '&page=' + page + "&logContent=" + logContent,
		type:'GET',
		dataType:'jsonp',
		error:function(data){alert("error");},
		success:function(data){
			var items = data.data.result.settlementListV51;
			var total = data.data.result.total;			
			$("#total").html("(" + total + ")");
			setDataToTable(items)
			console.log("total:" + total);
			$('#pagTableSettlement').bootpag({
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
				$("#tableSettlement").html(showLoading);
				$.ajax({
					url:DOMAIN+'/v5a/service/settlementListV51?callback=?&' + params + '&rowsperpage=' + rowsperpage + '&page=' + num,
					type:'GET',
					dataType:'jsonp',
					error:function(data){alert("error");},
					success:function(data){
						var items = data.data.result.settlementListV51;
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

function getSttlTrnListV51(params, rowsperpage, page){
	$.ajax({
		url:DOMAIN+'/v5a/service/sttlTrnListV51?callback=?&' + params + '&rowsperpage=' + rowsperpage + '&page=' + page + "&logContent=" + logContent,
		type:'GET',
		dataType:'jsonp',
		error:function(data){alert("error");},
		success:function(data){
			var items = data.data.result.getSttlTrnListV51;
			var total = data.data.result.total;			
			$("#total").html("(" + total + ")");
			setSttlTrnToTable(items)
			console.log("total:" + total);
			$('#pagTableSttlTrn').bootpag({
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
				$.ajax({
					url:DOMAIN+'/v5a/service/sttlTrnListV51?callback=?&' + params + '&rowsperpage=' + rowsperpage + '&page=' + num,
					type:'GET',
					dataType:'jsonp',
					error:function(data){alert("error");},
					success:function(data){
						var items = data.data.result.getSttlTrnListV51;
						total = data.data.result.total;
						console.log(total);
						$("#total").html("(" + total + ")");
						console.log("total1:" + total);
						setSttlTrnToTable(items);
					}
				});
				
			}); 
			
			
			
		}
	});

}
function setDataToTable(items){
	var dataHtml = [];
	if(items.length >= 0){
		$.each(items, function(i, d){
			dataHtml.push("<tr>");
			dataHtml.push("<td>"+(i+1)+"</td>");		    
			dataHtml.push("<td>"+d.iSttl+"</td>");		    
			dataHtml.push("<td>"+d.mem+"</td>");		    
			dataHtml.push("<td>"+d.stItm+"</td>");		    
			dataHtml.push('<td>'+d.stAmtMem+'</td>');		    
			dataHtml.push("<td>"+d.stAmtFeePG+"</td>");		    
			dataHtml.push("<td>"+d.stAmtFeenPG+"</td>");		    
			dataHtml.push("<td>"+d.cur+"</td>");		    
			dataHtml.push('<td><button type="button" class="showSttlTrn btn btn-default" data-toggle="modal" data-target="#myModal" data-id="'+d.mem+'">List</button></td>');		    
			dataHtml.push("</tr>");
		});
	}else{
		dataHtml.push = '<tr><td colspan="14" style="text-align: center;">NO DATA</td></tr>';
	}
	$("#tableSettlement").html(dataHtml.join(''));
}

function setSttlTrnToTable(items){
	var dataHtml = [];
	$.each(items, function(i, d){
		dataHtml.push("<tr>");
		dataHtml.push("<td>"+d.trnsctnNo+"</td>");		    
		dataHtml.push("<td>"+d.payAmt+"</td>");		    
		dataHtml.push("<td>"+d.amtFeepg+"</td>");		    
		dataHtml.push("<td>"+d.rt+"</td>");		    
		dataHtml.push("<td>"+d.amtTotal+"</td>");		    
		dataHtml.push("</tr>");
	});
	
	$(".modal-body #tableSttlTrn").html( dataHtml.join('') );
}

$(document).on("click", ".showSttlTrn", function () {
	
    var memNo = $(this).data('id');
    var params = '_method=GET';
	params += '&memNoV51=' + memNo;
	$(".modal-body #tableSttlTrn").html(showLoading);
	getSttlTrnListV51(params, 10, 1);    
});
