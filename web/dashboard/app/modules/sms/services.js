 (function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('SmsSRService', SmsSRService);

    SmsSRService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function SmsSRService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
        var service = {};

			service.getSmsSRList = getSmsSRList;
			
        return service;
		
		function getSmsSRList(paramStr){
			return Utils.requestAPI('/v5a/admin/sms/history?_method=GET&',paramStr);
		}
    }

})();
