(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('RemitService', RemitService);

    RemitService.$inject = ['$http'];
    function RemitService($http) {
        var service = {};

        return service;

        

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
