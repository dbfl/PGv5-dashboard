/**
 * @author athan
 */

function pagging_ajax(total,perPage,funcajax,page){
	var startBlock	=	'';
    var endBlock	=	'';
	var totalPage		=	Math.ceil(total/perPage);
	var currentPage	=	page;
	currentPage	 =	currentPage > totalPage ? totalPage:currentPage;
	currentPage	 =	currentPage <= 0?1: currentPage;
	var pagePre	 =	(currentPage-1)>0?(currentPage-1):1;
	var pageNext =	(currentPage+3) < totalPage?(currentPage+3):totalPage;
	var pageLast =	totalPage;
	var uPaging  = 	'<ul class="pagination pull-right">';
	var myArray  = new Array(); 
	myArray["start"] = "";
	myArray["end"] = "";
	myArray["total"] = "";
	myArray["list"] = "";
	myArray["totalpage"] = "";
	
	if(totalPage == 1) return myArray;
	if(total==0){
		startBlock	=	'<!--';
		endBlock	=	'-->';
		currentPage	=	0;
	}
	
	if((currentPage-1)>0){
		           
		uPaging += "<li class='footable-page-arrow'> <a href='#null' onclick =\"" + funcajax + "(1);\">«</a></li>";
	}else{
		uPaging += "<li class='footable-page-arrow'> <a href='#null' onclick =\"return false;\">«</a></li>";
	}
	var preString = currentPage -1;
	if( preString > 0){
		uPaging += "<li class='footable-page-arrow'><a href='#null' onclick=\"" + funcajax + "("+ preString +");\">‹</a></li>";
	}else{
		uPaging += "<li class='footable-page-arrow'><a href='#null' onclick=\"return false;\">‹</a></li>";
	}
	
	
	for(var i = Math.abs(currentPage - 2); i <(Math.abs(currentPage-2)+5); i++){
		var classactive = "";
		var onclick = "";
		if(i <= totalPage && i>0){
			if(currentPage == i)
			{
				classactive = "class='activePage'";
				onclick = "";
			}
			else
			{
				classactive = "";
				onclick = funcajax + "(" + i + ");";
			}
			uPaging += "<li class='footable-page'><a href='#' "+classactive+" onclick=\"" + onclick + "\">"+ i + "</a></li>";
		}
	}
	
	var next = currentPage+1;
	if(next <= totalPage){
					
		uPaging += "<li class='footable-page-arrow'><a href='#null' onclick=\"" + funcajax + "("+ next +");\">›</a></li>";
	}else{
		uPaging += "<li class='footable-page-arrow'><a href='#null' onclick=\"return false;\">›</a></li>";
	}
	
	if((currentPage+1) <= totalPage){
		uPaging += "<li class='footable-page-arrow'><a href='#null' onclick=\"" + funcajax + "(" + totalPage + ");\">»</a></li>";
	}else{
		uPaging += "<li class='footable-page-arrow'><a href='#null' onclick=\"return false;\">» </a></li>";
	}
	
	
	uPaging += "</ul>";
	
	myArray["start"] = startBlock;
	myArray["end"] = endBlock;
	myArray["total"] = total;
	myArray["list"] = uPaging;
	myArray["totalpage"] = totalPage;
	return myArray;
}