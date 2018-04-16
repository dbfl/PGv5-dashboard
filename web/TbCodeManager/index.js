var lastSelection;
function editRow(id) {
	if (id && id !== lastSelection) {
        var grid = $("#jqGrid1");
        grid.jqGrid('restoreRow',lastSelection);
        grid.jqGrid('editRow',id, {keys: true} );
        lastSelection = id;
    }
}; 

function fontColorFormat(cellvalue, options, rowObject){
	 var color = "blue";
	 var cellHtml = "<span style='color:#666666;font-weight:bold;margin-left:3px;' originalValue='" + cellvalue + "'>" + cellvalue + "</span>";
	 return cellHtml;
};

function getSelectedRows() {
    var grid = $("#jqGrid1");
    var rowKey = grid.getGridParam("selrow");

    if (!rowKey)
        alert("No rows are selected");
    else {
        var selectedIDs = grid.getGridParam("selarrrow");
        var result = "";
        for (var i = 0; i < selectedIDs.length; i++) {
            result += selectedIDs[i] + ",";
        }

        alert(result);
    }                
}

$(document).ready(function () {
	var domain = "https://dev5.paygate.net/v5a";
	//var domain = "https://stg5.paygate.net/v5a";
	//var domain = "https://v5.paygate.net/v5a";
	//var domain = "http://localhost:8080/v5a";
	
	$(".radio").click(function(){
		var value = $(this).val();
		
		if(value == "development"){
			domain = "https://dev5.paygate.net/v5a";
			//domain = "http://localhost:8080/v5a";
			$('#jqGrid1').jqGrid('clearGridData');
			$("#jqGrid1").setGridParam({datatype: 'jsonp', url:domain + '/code/group/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			$("#jqGrid1").trigger("reloadGrid");
			
			$('#jqGrid2').jqGrid('clearGridData');
			$("#jqGrid2").setGridParam({datatype: 'jsonp', url:domain + '/code/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			$("#jqGrid2").trigger("reloadGrid");
			
			$('#jqGrid3').jqGrid('clearGridData');
			$("#jqGrid3").setGridParam({datatype: 'jsonp', url:domain + '/code/detail/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			$("#jqGrid3").trigger("reloadGrid");
			
			$('#jqGrid6').jqGrid('clearGridData');
			$("#jqGrid6").setGridParam({datatype: 'jsonp', url:domain + '/code/detail/all/lang?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data.codes'}, page:1});
			$("#jqGrid6").trigger("reloadGrid");
			
		};
		
		if(value == "staging"){
			domain = "http://52.69.145.143/v5a";
			$('#jqGrid1').jqGrid('clearGridData');
			$("#jqGrid1").setGridParam({datatype: 'jsonp', url:domain + '/code/group/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			$("#jqGrid1").trigger("reloadGrid");
			
			$('#jqGrid2').jqGrid('clearGridData');
			$("#jqGrid2").setGridParam({datatype: 'jsonp', url:domain + '/code/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			$("#jqGrid2").trigger("reloadGrid");
			
			$('#jqGrid3').jqGrid('clearGridData');
			$("#jqGrid3").setGridParam({datatype: 'jsonp', url:domain + '/code/detail/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			$("#jqGrid3").trigger("reloadGrid");
			
			$('#jqGrid6').jqGrid('clearGridData');
			$("#jqGrid6").setGridParam({datatype: 'jsonp', url:domain + '/code/detail/all/lang?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data.codes'}, page:1});
			$("#jqGrid6").trigger("reloadGrid");
			
		};
		
		if(value == "production"){
			domain = "https://v5.paygate.net/v5a";
			//domain = "http://localhost:8080/v5a";
			$('#jqGrid1').jqGrid('clearGridData');
			$("#jqGrid1").setGridParam({datatype: 'jsonp', url:domain + '/code/group/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			$("#jqGrid1").trigger("reloadGrid");
			
			$('#jqGrid2').jqGrid('clearGridData');
			$("#jqGrid2").setGridParam({datatype: 'jsonp', url:domain + '/code/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			$("#jqGrid2").trigger("reloadGrid");
			
			$('#jqGrid3').jqGrid('clearGridData');
			$("#jqGrid3").setGridParam({datatype: 'jsonp', url:domain + '/code/detail/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			$("#jqGrid3").trigger("reloadGrid");
			
			$('#jqGrid6').jqGrid('clearGridData');
			$("#jqGrid6").setGridParam({datatype: 'jsonp', url:domain + '/code/detail/all/lang?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data.codes'}, page:1});
			$("#jqGrid6").trigger("reloadGrid");
		};
		
	});
	
	
	
	 $("#dialog" ).dialog({ 
		autoOpen: false,
		width:'500',
		height: 'auto',
		modal: true,
		position: { my: 'top', at: 'top+45' },
		close : function(){
			//$("#loadbackground").fadeOut();
		},
		open: function (event, ui) {
		    //$('#guideContainer').css('overflow', 'hidden');
		}
	 });
	 
	 $("#addCodedialog").dialog({ 
		autoOpen: false,
		height: 'auto',
		modal: true,
		position: { my: 'top', at: 'top+60' },
		close : function(){
			//$("#loadbackground").fadeOut();
		},
		open: function (event, ui) {
		    //$('#guideContainer').css('overflow', 'hidden');
		}
	 });
	 
	 //create groups functions
	 $("#createGroup").click(function(){
		 var params = $("#createGroupForm").serialize();
		 $.ajax({
 		    url:domain + "/code/group?callback=?&_method=POST&"+params,
 	        type: "POST",
 	        dataType: "jsonp",
 	        error:function(data){alert("error");},
 	        success:function(data){
 	        	if(data=="1"){
 	        		alert("success");
 	        		$("#jqGrid1").trigger("reloadGrid");
 		        	$('#jqGrid1').jqGrid('clearGridData');
 	        	}
 	        }
 	    });
	 });
	 
	//create code functions
	$("#createCode").click(function(){
		 var params = $("#createCodeDetailForm").serialize();
		 $.ajax({
 		    url:domain + "/code/group?callback=?&_method=POST&"+params,
 	        type: "POST",
 	        dataType: "jsonp",
 	        error:function(data){alert("error");},
 	        success:function(data){
 	        	if(data=="1"){
 	        		alert("success");
 	        		$("#jqGrid3").trigger("reloadGrid");
 	        		$('#jqGrid3').jqGrid('clearGridData');
 	        	};
 	        }
 	    });
	 });
	 
	 $("#tab-1").addClass("current");
	 $('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	});
	 
    $("#jqGrid1").jqGrid({
        url: domain + '/code/group/all?callback=?&_method=GET',
        mtype: "GET",
        datatype: "jsonp",
        jsonReader: {root: 'data'},
        colModel: [
            { label: 'Group Key', name: 'grpKey', width: 100,editable: true},
            { label: 'Group Name', name: 'grpNm', width: 135,editable: true},
            { label: 'Group Description', name: 'grpDesc', width: 190,editable: true },
            { label: 'Lang code', name: 'langCd', width: 45,editable: true,edittype:"select",editoptions:{value:'ko:ko;en:en;jp:jp;cn:cn'}},
            { label: 'Action', name:'act',index:'act', width:34,sortable:false, search:false },
        ],
        multiselect: true,
        viewrecords: true,
        sortorder: 'desc',
        rowNum: 15,
        gridview: true,
        localReader : {id:'grpKey'},
        loadonce: true,
        rowList:[5,10,15],
        width: 967,
        height: 410,
        pager: "#jqGridPager1",
        gridComplete: function(){
        	var ids = $("#jqGrid1").jqGrid('getDataIDs');
    		for(var i=0;i < ids.length;i++){
    			var cl = ids[i];
    			be = "<input style='height:22px;width:20px;color:blue;' type='button' class='edit myEditor' value='E' onclick=\"jQuery('#jqGrid1').editRow('"+cl+"');\"  />"; 
    			se = "<input style='height:22px;width:20px;color:green;' type='button' value='S' class='save myEditor' onclick=\"jQuery('#jqGrid1').saveRow('"+cl+"');\"  />";
    			//de = "<input style='height:22px;width:20px;color:red;' type='button' value='D' class='delete myEditor' onclick=\"jQuery('#jqGrid1').saveRow('"+cl+"');\"  />";
    			ce = "<input style='height:22px;width:20px;color:#666666;' type='button' value='C' class='myEditor' onclick=\"jQuery('#jqGrid1').restoreRow('"+cl+"');\" />"; 
    			$("#jqGrid1").jqGrid('setRowData',ids[i],{act:be+se+ce});
    		}	
    		
    		$('#jqGrid1').find('.edit').each(function() {
                $(this).click(function(){
                    var therowid = $(this).parents('tr:last').attr('id');
                    $('#jqGrid1').jqGrid('setSelection', therowid );
                });
            });
    		
    		$(".save").click(function(){
    			var rowId = $("#jqGrid1").jqGrid('getGridParam','selrow');  
    			var rowData = jQuery("#jqGrid1").getRowData(rowId);
    			var grpKey = rowData['grpKey'];  
    			var grpNm = rowData['grpNm'];
    			var grpDesc = rowData['grpDesc'];
    			var langCd = rowData['langCd'];
    			
    			var groupEditParams = "grpKey="+grpKey+"&grpNm="+grpNm+"&grpDesc="+grpDesc+"&langCd="+langCd;
    			
    			$.ajax({
    	 		    url:domain + "/code/group?callback=?&_method=POST",
    	 		    type: "POST",
    	 		    data:{grpKey:grpKey,grpNm:grpNm,grpDesc:grpDesc,langCd:langCd},
    	 		    dataType: "jsonp",
    	 	        error:function(data){alert("error");},
    	 	        success:function(data){
    	 	        	//if(data=="1"){
    	 	        		//alert("update successful!");
    	 	        		$("#jqGrid1").trigger("reloadGrid",[{current:true}]);
        		        	//$('#jqGrid1').jqGrid('clearGridData');
    	 	        	//}
    	 	        }
	    	 	 });
    		});
    		
    		$('#jqGrid1').find('.delete').each(function(){
    			$(this).click(function(){
                    var therowid = $(this).parents('tr:last').attr('id');
                    $('#jqGrid1').jqGrid('setSelection', therowid );
                    var rowId = $("#jqGrid1").jqGrid('getGridParam','selrow');  
        			var rowData = jQuery("#jqGrid1").getRowData(rowId);
        			var colData = rowData['grpKey'];  
        			alert(colData);
                    
                });
    		});
    		
        }
    });
    
    $('#jqGrid1').filterToolbar({
        // JSON stringify all data from search, including search toolbar operators
        stringResult: true,
        autosearch: true,
        // instuct the grid toolbar to show the search options
        searchOperators: false,
        searchOnEnter : false
        //sopt: ['grpKey','grpNm'] 
    });
    
    $('#jqGrid1').navGrid('#jqGridPager1',
       { 
    	edit: false, 
    	add: false, 
    	del: false, 
    	search: false, 
    	refresh: false, 
    	view: false, 
    	position: "left", 
    	cloneToTop: false })
    	.navButtonAdd('#jqGridPager1',{ 
    				caption:"Add", buttonicon:'ui-icon-plus', 
    				onClickButton: function(){
    					var rowId = $("#jqGrid1").jqGrid('getGridParam','selrow');  
    	    			var rowData = jQuery("#jqGrid1").getRowData(rowId);
    	    			var grpKey = rowData['grpKey'];  
    	    			var grpNm = rowData['grpNm'];
    	    			var grpDesc = rowData['grpDesc'];
    	    			var langCd = rowData['langCd'];
    	    			var data = {grpKey:grpKey,grpNm:grpNm,grpDesc:grpDesc,langCd:langCd};
    	    			var p = $('#jqGrid1').getGridParam();
	    			     if (p.data){
	    			        var rowId = $.jgrid.randId();
	    			        $("#jqGrid1").jqGrid('addRowData', rowId, data);
	    			     }    
    	    			
    	    		},
    	position:"last" }
    	).navButtonAdd('#jqGridPager1',{  
			caption:"SaveToDev", buttonicon:'ui-icon-disk', 
			onClickButton: function(){
				var selRowIds = $("#jqGrid1").jqGrid ('getGridParam', 'selarrrow');
				var grid = $("#jqGrid1");
	            var ids = grid.jqGrid('getDataIDs');
	
	            for (var i = 0; i < ids.length; i++) {
	                grid.jqGrid('saveRow', ids[i]);
	            }
				
				if (selRowIds.length>0) {
                    var saveDatas = [];
                    for (var i=0, il=selRowIds.length; i < il; i++) {
                    	var grpKey = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'grpKey');
                        var grpNm = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'grpNm');
                        var grpDesc = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'grpDesc');
                        var langCd = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'langCd');
                        
                        $.ajax({
                 		    url:"https://dev5.paygate.net/v5a/code/group?callback=?&_method=POST",
                 		    type: "POST",
                 	        dataType: "jsonp",
                 	        data:{grpKey:grpKey,grpNm:grpNm,grpDesc:grpDesc,langCd:langCd},
                 	        error:function(data){alert("error");},
                 	        success:function(data){
                 	        	if(data=="1"){
                 	        		//alert("success");
                 	        		$("#jqGrid1").trigger("reloadGrid");
                 	        		$('#jqGrid1').jqGrid('clearGridData');
                 	        	};
                 	        }
                 	    }); 
                    }
                    //alert(saveDatas.join(','));
				};
			},
		position:"last" })
		.navButtonAdd('#jqGridPager1',{  
			caption:"SaveToStg", buttonicon:'ui-icon-disk', 
			onClickButton: function(){
				var selRowIds = $("#jqGrid1").jqGrid ('getGridParam', 'selarrrow');
				var grid = $("#jqGrid1");
	            var ids = grid.jqGrid('getDataIDs');
	
	            for (var i = 0; i < ids.length; i++) {
	                grid.jqGrid('saveRow', ids[i]);
	            }
				
	            if (confirm("Do you really want to save to Staging?")) {
				if (selRowIds.length>0) {
                    var saveDatas = [];
                    for (var i=0, il=selRowIds.length; i < il; i++) {
                    	var grpKey = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'grpKey');
                        var grpNm = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'grpNm');
                        var grpDesc = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'grpDesc');
                        var langCd = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'langCd');
                        $.ajax({
                 		    url:"http://52.69.145.143/v5a/code/group?callback=?&_method=POST",
                 		    type: "POST",
                 	        dataType: "jsonp",
                 	        data:{grpKey:grpKey,grpNm:grpNm,grpDesc:grpDesc,langCd:langCd},
                 	        error:function(data){alert("error");},
                 	        success:function(data){}
                 	    });  
                    }
				} else {};
                    //alert(saveDatas.join(','));
				};
			},
		position:"last" })
		.navButtonAdd('#jqGridPager1',{  
			caption:"SaveToProd", buttonicon:'ui-icon-disk', 
			onClickButton: function(){
				var selRowIds = $("#jqGrid1").jqGrid ('getGridParam', 'selarrrow');
				var grid = $("#jqGrid1");
	            var ids = grid.jqGrid('getDataIDs');
	
	            for (var i = 0; i < ids.length; i++) {
	                grid.jqGrid('saveRow', ids[i]);
	            }
				
	            if (confirm("Do you really want to save to Production?")) {
				if (selRowIds.length>0) {
                    var saveDatas = [];
                    for (var i=0, il=selRowIds.length; i < il; i++) {
                    	var grpKey = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'grpKey');
                        var grpNm = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'grpNm');
                        var grpDesc = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'grpDesc');
                        var langCd = $("#jqGrid1").jqGrid('getCell', selRowIds[i], 'langCd');
                        	
                        	$.ajax({
                     		    url:"https://v5.paygate.net/v5a/code/group?callback=?&_method=POST",
                     		    type: "POST",
                     	        dataType: "jsonp",
                     	        data:{grpKey:grpKey,grpNm:grpNm,grpDesc:grpDesc,langCd:langCd},
                     	        error:function(data){alert("error");},
                     	        success:function(data){}
                     	    }); 
                 	       
                    }
				} else {};
                    //alert(saveDatas.join(','));
				};
			},
		position:"last" });
	
	$("#jqGrid2").jqGrid({
        url: domain + '/code/all?callback=?&_method=GET',
    	multiselect: true,
        mtype: "GET",
        //caption:"Code",
        datatype: "jsonp",
        jsonReader: {root: 'data'},
        colModel: [
            { label: 'Group Key', name: 'grpKey', width: 100 },       
            { label: 'Code Key', name: 'cdKey', width: 200 }
        ],
        viewrecords: true,
        sortorder: 'desc',
        rowNum: 15,
        gridview: true,
        loadonce: true,
        rowList:[5,10,15],
        width: 967,
        height: 410,
        pager: "#jqGridPager2",
        gridComplete: function(){}
    });
    
    $('#jqGrid2').navGrid('#jqGridPager2',
       { 
    	edit: false, 
    	add: false, 
    	del: false, 
    	search: false, 
    	refresh: false, 
    	view: false, 
    	position: "left", 
    	cloneToTop: false })
    	.navButtonAdd('#jqGridPager2',{ 
				caption:"Delete", buttonicon:'ui-icon-trash', 
				onClickButton: function(){
					var rowId = $("#jqGrid2").jqGrid('getGridParam','selrow');  
	    			var rowData = jQuery("#jqGrid2").getRowData(rowId);
	    			var grpKey = rowData['grpKey'];  
	    			
	    		},
    	position:"last" });
    	
    	$('#jqGrid2').filterToolbar({
        // JSON stringify all data from search, including search toolbar operators
        stringResult: true,
        autosearch: true,
        // instuct the grid toolbar to show the search options
        searchOperators: false,
        searchOnEnter : false
        //sopt: ['grpKey','grpNm'] 
    });
    
    
    function addLog(log) {
       $("#codeData").val($("#codeData").val() + log);
	};
    
    $("#jqGrid3").jqGrid({
        url: domain + '/code/detail/all?callback=?&_method=GET',
        mtype: "GET",
        datatype: "jsonp",
        jsonReader: {root: 'data'},
        multiselect: true,
        multiboxonly: true,
        ondblClickRow: function(rowid, iRow,iCol, e){
		    var row_id = $("#jqGrid3").getGridParam('selrow');
		    //$("#jqGrid3").find('#'+row_id+'input[type=checkbox]').prop('checked',true); 
		    $('#jqGrid3').editRow(row_id, true);
		    $('#jqGrid3').jqGrid('setSelection',row_id);
		    
		    var ids = $("#jqGrid3").jqGrid('getDataIDs');
    		for(var i=0;i < ids.length;i++){
    			var cl = ids[i];
    			//alert(cl);
    		}
		},
        //caption:"Get All Code Detail",
        colModel: [
            { label: 'Group Key', name: 'grpKey', width: 100,editable: true },
            { label: 'code Key', name: 'cdKey', width: 150,editable: true },
            { label: 'Code Name', name: 'cdNm', width: 190, editable: true },
            { label: 'Code Description', name: 'cdDesc', editable: true, width: 100 },
            { label: 'Lang code', name: 'langCd', width: 50,editable: true,edittype:"select",editoptions:{value:'ko:ko;en:en;jp:jp;cn:cn'} },
            { label: 'Action', name:'act',index:'act', width:30,sortable:false,  search:false }
        ],
		viewrecords: true,
		viewrecords: true,
        sortorder: 'desc',
        rowNum: 15,
        gridview: true,
        loadonce: true,
        rowList:[5,10,15],
        width: 967,
        height: 410,
        refreshstate:'current',
        reloadAfterSubmit:true,
        pager: "#jqGridPager3",
        gridComplete: function(){
        	var ids = $("#jqGrid3").jqGrid('getDataIDs');
    		for(var i=0;i < ids.length;i++){
    			var cl = ids[i];
    			//be = "<input style='height:22px;width:20px;color:blue;' type='button' class='editDetail myEditor' value='E' onclick=\"jQuery('#jqGrid3').editRow('"+cl+"');\"  />"; 
    			se = "<input style='height:22px;width:20px;color:green;' type='button' value='S' class='saveDetail myEditor' onclick=\"jQuery('#jqGrid3').saveRow('"+cl+"');\"  />";
    			//de = "<input style='height:22px;width:20px;color:red;' type='button' value='D' class='deleteDetail myEditor' onclick=\"jQuery('#jqGrid3').saveRow('"+cl+"');\"  />";
    			ce = "<input style='height:22px;width:20px;color:#666666;' type='button' value='C' class='myEditorDetail' onclick=\"jQuery('#jqGrid3').restoreRow('"+cl+"');\" />"; 
    			$("#jqGrid3").jqGrid('setRowData',ids[i],{act:se+ce});
    		}	
    		
    		$('#jqGrid3').find('.editDetail').each(function() {
                $(this).click(function(){
                    var therowid = $(this).parents('tr:last').attr('id');
                    $('#jqGrid3').jqGrid('setSelection', therowid );
                });
            });
    		
    		$(".saveDetail").click(function(){
    			var rowId = $("#jqGrid3").jqGrid('getGridParam','selrow');  
    			var rowData = jQuery("#jqGrid3").getRowData(rowId);
    			var grpKey = rowData['grpKey'];  
    			var cdKey = rowData['cdKey'];
    			var cdNm = rowData['cdNm'];
    			var cdDesc = rowData['cdDesc'];
    			var langCd = rowData['langCd'];
    			
    			var codeEditParams = "grpKey="+grpKey+"&cdKey="+cdKey+"&cdNm="+cdNm+"&langCd="+langCd+"&cdDesc="+cdDesc;
    			 $.ajax({
    	 		    url:domain + "/code/detail?callback=?&_method=POST",
    	 	        type: "POST",
    	 	        data:{grpKey:grpKey,cdKey:cdKey,cdNm:cdNm,langCd:langCd,cdDesc:cdDesc},
    	 	        dataType: "jsonp",
    	 	        error:function(data){alert("error");},
    	 	        success:function(data){
    	 	        	if(data=="1"){
    	 	        		alert("update successful!");
    	 	        		$("#jqGrid3").trigger("reloadGrid");
        		        	$('#jqGrid3').jqGrid('clearGridData');
    	 	        	}
    	 	        }
    	 	    });
    		});
    		
    		$('#jqGrid3').find('.deleteDetail').each(function(){
    			$(this).click(function(){
                    var therowid = $(this).parents('tr:last').attr('id');
                    $('#jqGrid3').jqGrid('setSelection', therowid );
                    var rowId = $("#jqGrid1").jqGrid('getGridParam','selrow');  
        			var rowData = jQuery("#jqGrid1").getRowData(rowId);
        			var colData = rowData['grpKey'];  
        			alert(colData);
                    
                });
    		});
    	}
	});
    
    $('#jqGrid3').filterToolbar({
        stringResult: true,
        autosearch: true,
        searchOperators: false,
        searchOnEnter : false
    });
    
    $('#jqGrid3').navGrid('#jqGridPager3',
	   { 
		edit: false, 
		add: false, 
		del: false, 
		search: false, 
		refresh: true,
		view: false, 
		position: "left", 
		cloneToTop: false })
		.navButtonAdd('#jqGridPager3',{ caption:"Add", buttonicon:'ui-icon-plus', 
			onClickButton: function(){
				var rowId = $("#jqGrid3").jqGrid('getGridParam','selrow');  
    			var rowData = jQuery("#jqGrid3").getRowData(rowId);
    			var grpKey = rowData['grpKey'];
    			var cdKey = rowData['cdKey'];  
    			var cdNm = rowData['cdNm'];
    			var cdDesc = rowData['cdDesc'];
    			var langCd = rowData['langCd'];
    			var data = {grpKey:grpKey,cdKey:cdKey,cdNm:cdNm,cdDesc:cdDesc,langCd:langCd};
    			 var p = $('#jqGrid3').getGridParam();
			     if (p.data){
			        var rowId = $.jgrid.randId();
			        $("#jqGrid3").jqGrid('addRowData', rowId, data);
			     }    
    	    			
			}, 
		position:"last" }).navButtonAdd('#jqGridPager3',{
			caption:"SaveToDev", buttonicon:'ui-icon-disk', 
			onClickButton: function(){
				var selRowIds = $("#jqGrid3").jqGrid ('getGridParam', 'selarrrow');
				var grid = $("#jqGrid3");
	            var ids = grid.jqGrid('getDataIDs');
	            for (var i = 0; i < ids.length; i++) {
	                grid.jqGrid('saveRow', ids[i]);
	            }
	            var pageNumber = $("#jqGrid3").jqGrid("getGridParam", "page");
    			if (selRowIds.length>0) {
                    var saveDatas = [];
                    for (var i=0, il=selRowIds.length; i < il; i++) {
                    	var grpKey = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'grpKey');
                    	var cdKey = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'cdKey');
                        var cdNm = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'cdNm');
                        var cdDesc = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'cdDesc');
                        var langCd = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'langCd');
            				
            			$.ajax({
                 		    url:"https://dev5.paygate.net/v5a/code/detail?callback=?&_method=POST",
                 		    type: "POST",
                 	        dataType: "jsonp",
                 	        data:{grpKey:grpKey,cdKey:cdKey,cdNm:cdNm,cdDesc:cdDesc,langCd:langCd},
                 	        error:function(data){alert("error");},
                 	        success:function(data){}
                 	    });
                    }
            	};
			},
		position:"last" })
		.navButtonAdd('#jqGridPager3',{
			caption:"SaveToStg", buttonicon:'ui-icon-disk', 
			onClickButton: function(){
				var selRowIds = $("#jqGrid3").jqGrid ('getGridParam', 'selarrrow');
				var grid = $("#jqGrid3");
	            var ids = grid.jqGrid('getDataIDs');
	            for (var i = 0; i < ids.length; i++) {
	                grid.jqGrid('saveRow', ids[i]);
	            }
	            var pageNumber = $("#jqGrid3").jqGrid("getGridParam", "page");
	            if (confirm("Do you really want to save to Staging?")) {
    			if (selRowIds.length>0) {
                    var saveDatas = [];
                    for (var i=0, il=selRowIds.length; i < il; i++) {
                    	var grpKey = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'grpKey');
                    	var cdKey = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'cdKey');
                        var cdNm = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'cdNm');
                        var cdDesc = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'cdDesc');
                        var langCd = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'langCd');
            			 	$.ajax({
                     		    url:"http://52.69.145.143/v5a/code/detail?callback=?&_method=POST",
                     		    type: "POST",
                     	        dataType: "jsonp",
                     	        data:{grpKey:grpKey,cdKey:cdKey,cdNm:cdNm,cdDesc:cdDesc,langCd:langCd},
                     	        error:function(data){alert("error");},
                     	        success:function(data){}
                     	    });
                        }
                    }
    			else{}
            	};
			},
		position:"last" })
		.navButtonAdd('#jqGridPager3',{
			caption:"SaveToProd", buttonicon:'ui-icon-disk', 
			onClickButton: function(){
				var selRowIds = $("#jqGrid3").jqGrid ('getGridParam', 'selarrrow');
				var grid = $("#jqGrid3");
	            var ids = grid.jqGrid('getDataIDs');
	            for (var i = 0; i < ids.length; i++) {
	                grid.jqGrid('saveRow', ids[i]);
	            }
	            var pageNumber = $("#jqGrid3").jqGrid("getGridParam", "page");
	            if (confirm("Do you really want to save to Production?")) {
    			if (selRowIds.length>0) {
                    var saveDatas = [];
                    for (var i=0, il=selRowIds.length; i < il; i++) {
                    	var grpKey = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'grpKey');
                    	var cdKey = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'cdKey');
                        var cdNm = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'cdNm');
                        var cdDesc = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'cdDesc');
                        var langCd = $("#jqGrid3").jqGrid('getCell', selRowIds[i], 'langCd');
            			 	$.ajax({
	                 		    url:"https://v5.paygate.net/v5a/code/detail?callback=?&_method=POST",
	                 		    type: "POST",
	                 	        dataType: "jsonp",
	                 	        data:{grpKey:grpKey,cdKey:cdKey,cdNm:cdNm,cdDesc:cdDesc,langCd:langCd},
	                 	        error:function(data){alert("error");},
	                 	        success:function(data){}
	                 	    });
                     	}
                    }
    			else{}
            	};
			},
		position:"last" })
		.navButtonAdd('#jqGridPager3',{
			caption:"GenerateCode", buttonicon:'ui-icon-print', 
			onClickButton: function(){
			$("#codeData").val('');
			var groupKeys;
			    var prefixPackage = "package net.paygate.v5c.util;";
				var prefixClass = "public class CD {";
				var prefixInterface = "public interface CDGroup {}"; 
				var prefixofgroup="public enum ";
				var postfixofgroup=" implements CDGroup { ";
				var endofgroup=";}";
				var lastGroupName = 'not_defined';
				var isNewGroup = false;
				
				var prefixGroupKey = "public enum GRP_KEY {";
				var endOfGroupKey = "}";
				var endofClass=";}";
				$.ajax({
         		    url:domain + "/code/detail/all/ordered?callback=?&_method=GET",
         		    type: "GET",
         		    jsonReader: {root: 'data'},
         	        dataType: "jsonp",
         	        error:function(data){alert("error");},
         	        success:function(code){
         	        	addLog(prefixPackage);
         	        	addLog('\n');
         	        	addLog(prefixClass);
         	        	addLog('\n');
         	        	addLog(prefixInterface);
         	        	addLog('\n');
         	        	for(var i=0; i < code.data.length; i++){
         	        		var keys = Object.keys(code.data[i]);
         	        		for(var k=0; k < keys.length; k++) {
         	        			var val = code.data[i][keys[k]];
         	        			
         	        			if(lastGroupName != val.grpKey) {
         	        				lastGroupName = val.grpKey;
         	        				isNewGroup = false;
         	        				
         	        				addLog(prefixofgroup);
         	        				addLog(lastGroupName);
         	        				addLog(postfixofgroup);
         	        			}
         	        			addLog('\n');
         	        			addLog('/** ');
         	        			var cdDesc = val.cdDesc;
         	        			
         	        			if(cdDesc=="" || cdDesc==null){
         	        				cdDesc = val.cdNm;	
         	        			}
         	        			cdDesc = cdDesc.replace('?',''); 
         	        			addLog(cdDesc);
         	        			addLog('  */ ');
         	        			addLog('\n');
         	        			addLog(val.cdKey);
         	        			addLog(',');
         	        			addLog('\n');
         	        		}
         	        		addLog(endofgroup);
         	        		addLog('\n');
         	        	}
         	        	
         	        	$.ajax({
		         		    url:domain + "/code/group/all?callback=?&_method=GET",
		         		    type: "GET",
		         		    jsonReader: {root: 'data'},
		         	        dataType: "jsonp",
		         	        error:function(data){alert("error");},
		         	        success:function(group){
		         	        	addLog(prefixGroupKey);
		         	        	for(var i=0;i < group.data.length;i++){
		         	        		groupKeys = group.data[i].grpKey+',';
		         	        	}
		         	        	
		         	        	var uniqueGroupKey = group.data.reduce(function (a, d) {
								       if (a.indexOf(d.grpKey) === -1) {
								         a.push(d.grpKey);
								       }
								       return a;
								}, []);
    								 
    							addLog(uniqueGroupKey);
		         	        	addLog(endOfGroupKey);
		         	        	addLog('\n');
		         	        	addLog(endofClass);
		         	    	}
		         	    });	
         	        }
         	    });	 	 
				
			$("#dialog").dialog( "open" );
			},
		position:"last" });
		
		$("#jqGrid6").jqGrid({
	       url: domain + '/code/detail/all/lang?_method=GET',
	        mtype: "GET",
	        multiboxonly: true,
	        datatype: "jsonp",
	        jsonReader: {root: 'data.codes'},
	        ondblClickRow: function(rowid, iRow,iCol, e){
			    var row_id = $("#jqGrid6").getGridParam('selrow');
			    $('#jqGrid6').editRow(row_id, true);
			    $('#jqGrid6').jqGrid('setSelection',row_id);
			    
			    var ids = $("#jqGrid6").jqGrid('getDataIDs');
	    		for(var i=0;i < ids.length;i++){
	    			var cl = ids[i];
	    		}
			},
	        colModel: [
	            { label: 'Group Key', name: 'grpKey', width: 100,editable: false},
	            { label: 'Code Key', name: 'cdKey', width: 100,editable: false},
	            { label: 'Name', name: 'ko', width: 135,editable: true},
	            { label: 'Description', name: 'koDesc', width: 190,editable: true },
	            { label: 'Name', name: 'en', width: 135,editable: true},
	            { label: 'Description', name:'enDesc', width:190,editable: true},
	        ],
	        multiselect: true,
	        viewrecords: true,
	        sortorder: 'desc',
	        rowNum: 15,
	        gridview: true,
	        loadonce: true,
	        rowList:[5,10,15],
	        width: 967,
	        height: 410,
	        localReader : {id:'grpKey'},
	        pager: "#jqGridPager6",
	        loadComplete: function () {
				   /* var $this = $(this), ids = $this.jqGrid('getDataIDs'), i, l = ids.length;
				    for (i = 0; i < l; i++) {
				        $this.jqGrid('editRow', ids[i], true);
				    }*/
				}
	    });
    
	    jQuery("#jqGrid6").jqGrid('setGroupHeaders', {
			  useColSpanStyle: true, 
			  groupHeaders:[
				{startColumnName: 'ko', numberOfColumns: 2, titleText: 'Korean'},
				{startColumnName: 'en', numberOfColumns: 2, titleText: 'English'}
			  ]	
		});
		
		$('#jqGrid6').filterToolbar({
        stringResult: true,
        multipleSearch: true,
        autosearch: true,
        searchOperators: false,
        searchOnEnter : false
      });
		
	  $('#jqGrid6').navGrid('#jqGridPager6',
       { 
    	edit: false, 
    	add: false, 
    	del: false, 
    	search: false, 
    	refresh: false, 
    	view: false, 
    	position: "left", 
    	cloneToTop: false })
    	.navButtonAdd('#jqGridPager6',{  
			caption:"Save", buttonicon:'ui-icon-disk', 
			onClickButton: function(){
				var selRowIds = $("#jqGrid6").jqGrid ('getGridParam', 'selarrrow');
				var grid = $("#jqGrid6");
	            var ids = grid.jqGrid('getDataIDs');
	
	            for (var i = 0; i < ids.length; i++) {
	                grid.jqGrid('saveRow', ids[i]);
	            }
				
				if (selRowIds.length>0) {
                    var saveDatas = [];
                    for (var i=0, il=selRowIds.length; i < il; i++) {
                    	var grpKey = $("#jqGrid6").jqGrid('getCell', selRowIds[i], 'grpKey');
                        var cdKey = $("#jqGrid6").jqGrid('getCell', selRowIds[i], 'cdKey');
                        
                        var koCdNm = $("#jqGrid6").jqGrid('getCell', selRowIds[i], 'ko');
                        var koDesc = $("#jqGrid6").jqGrid('getCell', selRowIds[i], 'koDesc');
                        
                        var enCdNm = $("#jqGrid6").jqGrid('getCell', selRowIds[i], 'en');
                        var engDesc = $("#jqGrid6").jqGrid('getCell', selRowIds[i], 'enDesc');
                        
                        //alert(grpKey+cdKey+koCdNm+koDesc+enCdNm+engDesc);
                        
                        $.ajax({
                 		    url:domain+"/code/detail?callback=?&_method=PUT",
    	 	        		type: "PUT",
		    	 	        data:{grpKey:grpKey,cdKey:cdKey,cdNm:koCdNm,cdDesc:koDesc,langCd:'ko'},
                 	        dataType: "jsonp",
                 	        error:function(data){alert("error");},
                 	        success:function(data){
                 	        	$.ajax({
		                 		    url:domain+"/code/detail?callback=?&_method=PUT",
    	 	        				type: "PUT",
				    	 	        data:{grpKey:grpKey,cdKey:cdKey,cdNm:enCdNm,cdDesc:engDesc,langCd:'en'},
		                 	        dataType: "jsonp",
		                 	        error:function(data){alert("error");},
		                 	        success:function(data){
		                 	        	//$("#jqGrid6").trigger("reloadGrid");
		                 	        	//$('#jqGrid6').jqGrid('clearGridData');
		                 	        }
		                 	    }); 
                 	        }
                 	    });
                 	}
            	};
			},
	position:"last" });
		
	$("#jqGrid7").jqGrid({
		url:'https://dev5.paygate.net/v5a/code/detail/all?callback=?&_method=GET',
		mtype: "GET",
		datatype: "jsonp",
		multiselect: true,
		multiboxonly: true,
		altRows:true,
		jsonReader: {root: 'data'},
		ondblClickRow: function(rowid, iRow,iCol, e){},
		caption:"Development Code Detail",
		colModel: [
		    { label: 'Group Key', name: 'grpKey', width: 100,editable: true },
            { label: 'code Key', name: 'cdKey', width: 150,editable: true },
            { label: 'Code Name', name: 'cdNm', width: 190, editable: true,hidden:true },
            { label: 'Code Description', name: 'cdDesc', editable: true,hidden:true },
            { label: 'Lang code', name: 'langCd', width: 50,editable: true,hidden:true}
		],
		viewrecords: true,
		sortorder: 'desc',
		rowNum: 8,
		gridview: true,
        localReader : {id:'grpKey'},
		pager: "#jqGridPager7",
		loadonce: true,
		rowList:[5,10,15],
		width: 470,
		height: 210
	});
	
	 $('#jqGrid7').navGrid('#jqGridPager7',
	   { 
		edit: false, 
		add: false, 
		del: false, 
		search: false, 
		refresh: false,
		//refreshstate: current", 
		view: false, 
		position: "left", 
		cloneToTop: false 
	   }).navButtonAdd('#jqGridPager7',{
			caption:"SaveToStg&Prod", buttonicon:'ui-icon-disk', 
			onClickButton: function(){
				var selRowIds = $("#jqGrid7").jqGrid ('getGridParam', 'selarrrow');
				var grid = $("#jqGrid7");
	            var ids = grid.jqGrid('getDataIDs');
	            for (var i = 0; i < ids.length; i++) {
	                grid.jqGrid('saveRow', ids[i]);
	            }
	            if (confirm("Do you really want to save to Staging and Production?")) {
    			if (selRowIds.length>0) {
                    var saveDatas = [];
                    for (var i=0, il=selRowIds.length; i < il; i++) {
                    	var grpKey = $("#jqGrid7").jqGrid('getCell', selRowIds[i], 'grpKey');
                    	var cdKey = $("#jqGrid7").jqGrid('getCell', selRowIds[i], 'cdKey');
                        var cdNm = $("#jqGrid7").jqGrid('getCell', selRowIds[i], 'cdNm');
                        var cdDesc = $("#jqGrid7").jqGrid('getCell', selRowIds[i], 'cdDesc');
                        var langCd = $("#jqGrid7").jqGrid('getCell', selRowIds[i], 'langCd');
            			
                       $.ajax({
                 		    url:"https://stg5.paygate.net/v5a/code/detail?callback=?&_method=POST",
                 		    type: "POST",
                 	        dataType: "jsonp",
                 	        data:{grpKey:grpKey,cdKey:cdKey,cdNm:cdNm,cdDesc:cdDesc,langCd:langCd},
                 	        error:function(data){alert("error");},
                 	        success:function(data){
                 	        	$.ajax({
                         		    url:"https://v5.paygate.net/v5a/code/detail?callback=?&_method=POST",
                         		    type: "POST",
                         	        dataType: "jsonp",
                         	        data:{grpKey:grpKey,cdKey:cdKey,cdNm:cdNm,cdDesc:cdDesc,langCd:langCd},
                         	        error:function(data){alert("error");},
                         	        success:function(data){}
                         	    });
                 	        }
                 	   });
                    }
    			 }else{};
            	};
	        },
	   position:"last" });
	
	
	$("#jqGrid8").jqGrid({
		url: 'https://v5.paygate.net/v5a/code/detail/all?callback=?&_method=GET',
		mtype: "GET",
		datatype: "jsonp",
		multiselect: true,
		altRows:true,
		jsonReader: {root: 'data'},
		ondblClickRow: function(rowid, iRow,iCol, e){},
		caption:"Production Code Detail",
		colModel: [
		    { label: 'Group Key', name: 'grpKey', width: 100,editable: true },
            { label: 'code Key', name: 'cdKey', width: 150,editable: true },
            { label: 'Code Name', name: 'cdNm', width: 190, editable: true,hidden:true },
            { label: 'Code Description', name: 'cdDesc', editable: true,hidden:true },
            { label: 'Lang code', name: 'langCd', width: 50,editable: true,hidden:true}
		],
		viewrecords: true,
		loadonce: true,
		sortorder: 'desc',
		rowNum: 8,
		gridview: true,
        localReader : {id:'grpKey'},
		pager: "#jqGridPager8",
		rowList:[5,10,15],
		width: 470,
		height: 210
	});
	
	$('#jqGrid8').navGrid('#jqGridPager8',
	   { 
		edit: false, 
		add: false, 
		del: false, 
		search: false, 
		refresh: false,
		//refreshstate: current", 
		view: false, 
		position: "left", 
		cloneToTop: false 
	   }).navButtonAdd('#jqGridPager8',{
			caption:"Reload", buttonicon:'ui-icon-disk', 
			onClickButton: function(){
				
				var requestedPage = $("#jqGrid8").getGridParam("page");
			    var lastPage = $("#jqGrid8").getGridParam("lastpage");
			    $('#jqGrid8').jqGrid('clearGridData');
			    $("#jqGrid8").setGridParam({datatype: 'jsonp', url:'https://v5.paygate.net/v5a/code/detail/all?callback=?&_method=GET', mtype: "GET",jsonReader: {root: 'data'}, page:1});
			    $("#jqGrid8").trigger("reloadGrid");
				
	        },
		position:"last" });
	
	$("#jqGrid7").jqGrid('gridDnD',{connectWith:'#jqGrid8'});

	$("#jqGrid8").jqGrid('gridDnD',{connectWith:'#jqGrid7'});
	
	 $('#jqGrid7').filterToolbar({
	        // JSON stringify all data from search, including search toolbar operators
	        stringResult: true,
	        autosearch: true,
	        // instuct the grid toolbar to show the search options
	        searchOperators: false,
	        searchOnEnter : false
	        //sopt: ['grpKey','grpNm'] 
	 });
	 
	 $('#jqGrid8').filterToolbar({
	        // JSON stringify all data from search, including search toolbar operators
	        stringResult: true,
	        autosearch: true,
	        // instuct the grid toolbar to show the search options
	        searchOperators: false,
	        searchOnEnter : false
	        //sopt: ['grpKey','grpNm'] 
	 });
	 
	 
	$.ajax({
		url:'https://dev5.paygate.net/v5a/code/detail/all?callback=?&_method=GET',
		type:'GET',
		dataType:'jsonp',
		error:function(){alert("error");},
		success:function(data){
			//var devCode = [JSON.stringify(data)];
			var devCode = data;
			 $.ajax({
				url:'https://v5.paygate.net/v5a/code/detail/all?callback=?&_method=GET',
				type:'GET',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data2){
					//var prodCode = [JSON.stringify(data)];
					var prodCode = data2;
					
					/* Array.prototype.contains = function(needle){
						  for (var i=0; i<this.length; i++)
						    if (this[i] == needle) return true;
						
						  return false;
					};
					
					Array.prototype.diff = function(compare) {
					    return this.filter(function(elem) {return !compare.contains(elem);});
					};
		 			var res = JSON.stringify(devCode.diff(prodCode));	
		 			alert(devCode);
					var delta = jsondiffpatch.diff(devCode, prodCode); 
					var res = JSON.stringify(delta);	
					
		 			
					jQuery("#jqGrid9").jqGrid({
				        colModel: [
							    { label: 'Group Key', name: 'grpKey', width: 100},
					            { label: 'code Key', name: 'cdKey', width: 150},
					            { label: 'Code Name', name: 'cdNm', width: 190},
					            { label: 'Code Description', name: 'cdDesc'},
					            { label: 'Lang code', name: 'langCd', width: 50}
				        ],
				        pager: '#jqGridPager9',
				        rowNum: 8,
				        datatype: 'jsonstring',
				        datastr: delta,
				        //jsonReader: {root: 'data',repeatitems: false},
				        viewrecords: true,
				        caption: "Compare Data Result",
				        height: 250,
				        width:967
				    });*/
				}
			});
			 
	    }
	});

});
