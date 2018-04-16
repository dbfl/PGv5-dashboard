(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('LectureService', LectureService);

    LectureService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function LectureService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
        var service = {};
        service.getNextLucture= getNextLucture;
        service.getListLucture= getListLucture;
        service.voteLecture= voteLecture;
        service.addLecture= addLecture;
        return service;

        

        function addLecture(paramStr){
        	return Utils.requestAPI('v5a/lesson?_method=POST&', paramStr);
        }
        
        function voteLecture(paramStr){
        	return Utils.requestAPI('v5a/lesson/vote?_method=POST&', paramStr);
        }
        
        function getNextLucture(){
        	return Utils.requestAPI('v5a/lesson/nextSession?_method=GET&', '');
        }
        function getListLucture(){
        	return Utils.requestAPI('v5a/lesson?_method=GET&', '');
        }
    }

})();
