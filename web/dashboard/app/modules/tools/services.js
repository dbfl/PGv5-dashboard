(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('ToolsService', ToolsService);

    ToolsService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function ToolsService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
        var service = {};
		service.getListCurrencyForm = getListCurrencyForm;
		service.exchangeInquiry = exchangeInquiry;
		service.exchangeProcess = exchangeProcess;
		service.smsSend = smsSend;
		service.chargeAcc = chargeAcc;
        return service;

        

        function getListCurrencyForm(){     
        	return Utils.requestAPI('v5a/adminv2/currencyList?_method=GET&','');
        }
		
		function exchangeInquiry(paramStr){
			return Utils.requestAPI('v5a/exchange/inquiry?_method=POST&',paramStr);
        }
		
		function exchangeProcess(paramStr){  
        	return Utils.requestAPI('v5a/exchange/process?_method=POST&', paramStr);
        }
		
		function smsSend(paramStr){        	
			return Utils.requestAPISms('v5/v5ctest/adminsms?_method=GET&', paramStr);
        }
		
		function chargeAcc(paramStr, typePay){        	
			var url = null;
			 // amount=100&crrncy=USD&depositAction=payin
			if(typePay == "payout") {
				url = "v5a/transaction/bankDepositPayout?_method=POST&";
			} else if (typePay == "payin"){
				url = "v5a/transaction/bankDepositPayin?_method=POST&";
			} else if (typePay == "deduct"){
				url = "v5/transaction/seyfertSettlement?_method=POST&";
			}
			// TODO 여기서는 기존의 방식대로 paramStr을Utils.requestAPI(url,paramStr); 해주면 된다. .. 
			return Utils.requestAPI(url,paramStr);
			
        }
    }

})();
