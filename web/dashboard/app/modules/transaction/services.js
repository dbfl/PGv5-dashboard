(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('TransactionService', TransactionService);

    TransactionService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function TransactionService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
    	
    	var service = {};
    	
    		service.getData = getData;
        	service.setData = setData;
        
        	service.getList = getList;
			service.getTotal = getTotal;
			service.getTotalChart = getTotalChart;
			service.getTransactionDetail = getTransactionDetail;
			service.getListDataSearchForm = getListDataSearchForm;
			service.getTransactionStatus = getTransactionStatus;
			service.getTranscationStatusChange = getTranscationStatusChange;
			
		return service;

		
		var data ;
        function setData(paramStr){
        	data = paramStr;
        }
        function getData(){
        	return data;
        }
        // private functions
        function getList(page, limit, paramStr){
        	
        	page = parseInt(page);
        	var params = 'limit=' + limit + '&page='+ page + '&' + paramStr;
			return Utils.requestAPI('v5a/admin/transaction/list?_method=GET&', params);
        }
        
        function getTransactionDetail(paramStr){
        	var params = 'rowsperpage=6&page=0&' + paramStr;
			return Utils.requestAPI('v5a/admin/transaction/detail?_method=GET&', params);
        }
		
		function getTotal(){        	
			return Utils.requestAPI('v5a/admin/transaction/total?_method=GET&', '');
        }
        
		function getTotalChart(paramStr){        	
			return Utils.requestAPI('v5a/admin/transaction/graph?_method=GET&', paramStr);
        }

		function getListDataSearchForm(){        	
			return Utils.requestAPI('v5a/admin/transaction/searchForm?_method=GET&', '');
        }
		//it's testing to add for transaction status by atlas
		function getTransactionStatus(typeGrp,type,statusGrp,status) {
			var params = 'typeGrp=' + typeGrp + '&type=' + type + '&statusGrp=' + statusGrp + '&status=' + status;
//			console.log(params);			
			return Utils.requestAPI('v5a/admin/availableStatus?_method=GET&', params);
		}
		
		function getTranscationStatusChange(tid,typeGrp,type,statusLastGrp,statusLast,statusGrp,status,changeReason){
			var params = 'typeGrp=' + typeGrp + 
				'&type=' + type + 
				'&statusGrp=' + statusGrp + 
				'&status=' + status +
				'&tid=' + tid + 
				'&statusLastGrp=' + statusLastGrp + 
				'&statusLast=' + statusLast  + 
				'&changeMsg=' + changeReason ;
//			console.log(params);	
			return Utils.requestAPI('v5a/admin/transaction/changeStatus?_method=POST&',params);
		}
    }

})();
