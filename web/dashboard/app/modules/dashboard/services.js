(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('DashboardService', DashboardService);

    DashboardService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function DashboardService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
        var service = {};
			service.topTransaction = topTransaction;
			service.topFollowed = topFollowed;
			service.getTotalInfo = getTotalInfo;
			service.getListCntTrans = getListCntTrans;
			service.getListNotice = getListNotice;
			service.getCurrencyExchageRate = getCurrencyExchageRate;
			service.createTicket = createTicket;
			service.getSeyfertTotalAmt = getSeyfertTotalAmt;
        return service;
		
		
		
		function createTicket(paramStr){
        	return Utils.requestAPI('v5a/service/freshDesk?_method=GET&',params);
        }
		
		function getListNotice(limit,page){
			var params = '&limit='+limit+'&page='+page + '&listType=listAll';
			return Utils.requestAPI('v5a/service/freshDesk?_method=GET&', params);
        }
		
		function topTransaction(limit,page,paramStr){
        	var params = '&limit='+limit+'&page='+page + '&' + paramStr;
			return Utils.requestAPI('v5a/admin/transaction/top?_method=GET&', params);
        }
		
		
		function getCurrencyExchageRate(paramStr){
			var params = '&page=0&rowsPerPage=10&' + paramStr;
			return Utils.requestAPI('v5a/service/exchange?_method=GET&', params);
        }
		
		function getListCntTrans(paramStr){
			var params = '&page=0&rowsperpage=10&' + paramStr;
			return Utils.requestAPI('v5a/admin/transaction/graph?_method=GET&', params);
        }
		
		function getTotalInfo(paramStr){
			var params = '&page=0&rowsperpage=10&' + paramStr;
			return Utils.requestAPI('v5a/service/seyfertList?_method=GET&', params);
        }
		
		
		function topFollowed(){
        	return Utils.requestAPI('v5a/member/mostFollowed?_method=GET&', '');
        }
		
		function getSeyfertTotalAmt (){
			return Utils.requestAPI('v5a/admin/seyfertTotalAmt?_method=GET&','');
		}
    }

})();
