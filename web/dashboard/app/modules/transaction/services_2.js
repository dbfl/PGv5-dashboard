(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('TransactionService', TransactionService);

    TransactionService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function TransactionService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
    	
    	var service = {};
        	service.getList = getList;
			service.getTotal = getTotal;
			service.getTotalChart = getTotalChart;
			service.getListDataSearchForm = getListDataSearchForm;
        return service;

        // private functions
        function getList(page, limit, paramStr){
        	$log.debug("paramStr:" + paramStr);
        	
			var deferred = $q.defer();
			
			page = parseInt(page) -1;
        	
        	var reqMemGuid = $rootScope.globals.currentUser.superGuid;
        	var key = $rootScope.globals.currentUser.pkey;
        	var params = 'limit=' + limit + '&page='+ page + '&callback=data&reqMemGuid=' + reqMemGuid;
        	
			if(paramStr != ''){
				params += '&' + paramStr;
			}
			
        	$log.debug("params:" + params);
			
        	var p = 'reqMemGuid=' + reqMemGuid + '&encReq=' +  encodeURIComponent(encParams(params, key));
			return Utils.requestAPI('v5a/adminv2/transaction/list?_method=GET&' + p);
        }
		
		//adminv2/transaction/total
		function getTotal(){        	
			var deferred = $q.defer();
        	
        	var reqMemGuid = $rootScope.globals.currentUser.superGuid;
        	var key = $rootScope.globals.currentUser.pkey;
        	var params = 'callback=data&reqMemGuid=' + reqMemGuid;
        	
        	var p = 'reqMemGuid=' + reqMemGuid + '&encReq=' +  encodeURIComponent(encParams(params, key));
			return Utils.requestAPI('v5a/adminv2/transaction/total?_method=GET&' + p);
        }
        
		//adminv2/transaction/graph
		function getTotalChart(paramStr){        	
			var deferred = $q.defer();
        	
        	var reqMemGuid = $rootScope.globals.currentUser.superGuid;
        	var key = $rootScope.globals.currentUser.pkey;
        	var params = 'callback=data&reqMemGuid=' + reqMemGuid;
        	
			if(paramStr != ''){
				params += '&' + paramStr;
			}
			
        	var p = 'reqMemGuid=' + reqMemGuid + '&encReq=' +  encodeURIComponent(encParams(params, key));
			return Utils.requestAPI('v5a/adminv2/transaction/graph?_method=GET&' + p);
        }

		function getListDataSearchForm(){        	
			var deferred = $q.defer();
        	
        	var reqMemGuid = $rootScope.globals.currentUser.superGuid;
        	var key = $rootScope.globals.currentUser.pkey;
        	var params = 'callback=data&reqMemGuid=' + reqMemGuid;
        	
        	var p = 'reqMemGuid=' + reqMemGuid + '&encReq=' +  encodeURIComponent(encParams(params, key));
			return Utils.requestAPI('v5a/adminv2/transaction/searchForm?_method=GET&' + p);
        }
		
    }

})();
