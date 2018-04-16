(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('SeyfertWithdrawService', SeyfertWithdrawService);

    SeyfertWithdrawService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function SeyfertWithdrawService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
        var service = {};
		service.seyfertList = seyfertList;
		service.inquiryBalances = inquiryBalances;
		service.memberList = memberList;
		service.seyfertWithdraw = seyfertWithdraw;
		
        return service;

        

        function seyfertList(){        	
			var params = 'rowsperpage=10&page=0&listType=totalAmt&crrncyCd=KRW';
			return Utils.requestAPI('v5a/service/seyfertList?_method=GET&', params);
        }
		
		function inquiryBalances(paramStr){        	
			return Utils.requestAPI('v5/member/seyfert/inquiry/balances?_method=GET&', paramStr);
        }
		
		function memberList(paramStr){        	
			return Utils.requestAPI('v5a/member/allInfo?_method=GET&', paramStr);
        }
		
		function seyfertWithdraw(paramStr){        	
			return Utils.requestAPI('v5/transaction/seyfert/withdraw?_method=POST&', paramStr);
        }
		
		
    }

})();
