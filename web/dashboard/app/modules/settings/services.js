(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('SettingService', SettingService);

    SettingService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function SettingService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
        var service = {};
        service.getCategory = getCategory;
        service.getOption = getOption;
        service.optValues = optValues;
        service.changePass = changePass;
        service.changeKeyP = changeKeyP;
        service.getListAPIRoles = getListAPIRoles;
        service.getListRoles = getListRoles;
        service.getListMemberRoles = getListMemberRoles;
        service.createMemRole = createMemRole;
        service.assignMemRole = assignMemRole;
        service.createContract = createContract;
        service.createCurrencyContract = createCurrencyContract;
        service.listContractCurrency = listContractCurrency;
        service.listRateCurrency = listRateCurrency;
        service.createRateCurrency = createRateCurrency;
        service.getRegistedNotiUrl = getRegistedNotiUrl;
        service.registNotiTransactionStatus = registNotiTransactionStatus;
        service.removeNotiTransactionStatus = removeNotiTransactionStatus;
        service.registNotiPayIn = registNotiPayIn;
        service.removeNotiPayIn = removeNotiPayIn;
        service.testValidUrl = testValidUrl;
        
        service.checkStatusOfKeyP = checkStatusOfKeyP;
        service.setKeyPEnable = setKeyPEnable;
        service.setKeyPDisable = setKeyPDisable;
        
        return service;

        

        // private functions
        function createRateCurrency(paramStr){
        	return Utils.requestAPI('v5a/member/createContractRate?_method=POST&',paramStr);
        }
        function listRateCurrency(paramStr){
        	return Utils.requestAPI('v5a/member/listContractRateDetail?_method=GET&',paramStr);
        }
        function createCurrencyContract(paramStr){
        	return Utils.requestAPI('v5a/member/createContractCurrency?_method=POST&',paramStr);
        }
        function listContractCurrency(paramStr){
        	return Utils.requestAPI('v5a/member/listContractCurrency?_method=GET&',paramStr);
        }
        
        function createContract(paramStr){
        	return Utils.requestAPI('v5a/member/createContract?_method=POST&',paramStr);
        }
        
        function getListAPIRoles(){
        	return Utils.requestAPI('v5a/api/role?_method=GET&','');
        }
        
        function getListRoles(){
        	return Utils.requestAPI('v5a/member/role/cd?_method=GET&', '');
        }
        
        function getListMemberRoles(){
        	return Utils.requestAPI('v5a/member/role?_method=GET&', '');
        }
        		
        function getCategory(){
        	return Utils.requestAPI('v5a/settings/category?_method=GET&', '');
        }
        
        
        function changeKeyP(){
        	return Utils.requestAPI('v5a/member/login/keyp?_method=GET&', '');
        }
        
        function createMemRole(paramStr){
        	return Utils.requestAPI('v5a/member/role/cd?_method=POST&',paramStr);
        }
        
        function assignMemRole(paramStr){
        	return Utils.requestAPI('v5a/member/role?_method=POST&', paramStr);
        }
        
        function changePass(paramStr){
        	return Utils.requestAPI('v5a/login/password?_method=PUT&', paramStr);
        }
        
        function getOption(paramStr){
        	return Utils.requestAPI('v5a/settings/option?_method=GET&', paramStr);
        }
        
        function optValues(paramStr, method){
        	return Utils.requestAPI('v5a/settings/optValues?_method=' + method+"&", paramStr);
        }
        // added by dongju 
        // 등록된 노티 조회
        function getRegistedNotiUrl(paramStr){
        	return Utils.requestAPI('v5a/admin/notice/info?_method=GET&', paramStr);
        }
        // 거래상태 내역 노티 등록 및 삭제 
        function registNotiTransactionStatus(paramStr){
           	return Utils.requestAPI('v5a/admin/notice/trnsctnStChanged?_method=PUT&',paramStr);
        }
        function removeNotiTransactionStatus(paramStr){
        	return Utils.requestAPI('v5a/admin/notice/trnsctnStChanged?_method=DELETE&', paramStr);
        }
        //입금내역 등록 및 삭제
        function registNotiPayIn(paramStr){
          return Utils.requestAPI('v5a/admin/notice/vaPayin?_method=PUT&', paramStr);
        }
        function removeNotiPayIn(paramStr){
         return Utils.requestAPI('v5a/admin/notice/vaPayin?_method=DELETE&', paramStr);
        }        
        function testValidUrl(paramStr){
        	return Utils.requestAPI('v5a/admin/notice/validUrl?_method=GET&',paramStr);
        }
        
        function checkStatusOfKeyP(paramStr){
        	return Utils.requestAPI('v5a/member/login/keyp/checkStatus?_method=GET&',paramStr);
        }
        
        function setKeyPEnable(paramStr){
        	return Utils.requestAPI('v5a/member/login/keyp/enable?_method=POST&',paramStr);
        }
        
        function setKeyPDisable(paramStr){
        	return Utils.requestAPI('v5a/member/login/keyp/disable?_method=POST&',paramStr);
        }
        
        
    }
})();
