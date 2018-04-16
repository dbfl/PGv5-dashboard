(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('CommonService', CommonService);

    CommonService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function CommonService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
        var service = {};
        service.requestSessionExpand = requestSessionExpand;
        
        return service;

        

        // private functions
        function requestSessionExpand(){
        	return Utils.requestSession('v5a/v5ctest/string');
        }

    }
})();
