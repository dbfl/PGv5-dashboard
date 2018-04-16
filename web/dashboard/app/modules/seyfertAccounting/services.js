(function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('AccountService', seyfertAccountingService);

    seyfertAccountingService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function seyfertAccountingService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
        var service = {};
        
        service.getData = getData;
        service.setData = setData;
        
        service.getCommissionExchange = getCommissionExchange;
        service.getCommisionExchangeDetails = getCommisionExchangeDetails;
        service.getSettlement = getSettlement;
        service.getSettlementDetails = getSettlementDetails;
        service.getDeposit = getDeposit;
        service.getDepositMember = getDepositMember;
        service.getDepositDetails = getDepositDetails;
        service.setSettlementChargingFee = setSettlementChargingFee;
        service.getMTAccountBalance = getMTAccountBalance;
        service.getMTAccountBalanceDetails = getMTAccountBalanceDetails;
        
        service.getRegistedNotiUrl = getRegistedNotiUrl;
        service.setTransferFromNP2PToSC = setTransferFromNP2PToSC;
        service.checkNHP2PTransHis = checkNHP2PTransHis;
        
        
        return service;

        var data ;
        function setData(paramStr){
        	data = paramStr;
        }
        function getData(){
        	return data;
        }

        // private functions
        
        // test  
        function getRegistedNotiUrl(paramStr){
        	return Utils.requestAPI('v5a/admin/notice/info?_method=GET&', paramStr);
        }
        
        //수입수수료환전 전체 조회  및 검색 
        function getCommissionExchange(paramStr){
//        	return Utils.requestAPI('v5a/admin/notice/info?_method=GET&', paramStr);
        	return Utils.requestAPI('v5a/admin/account/exchangecurrency/commission/list?_method=GET&', paramStr);
        }
        //수입수수료 환전  상세조회 
        function getCommisionExchangeDetails(paramStr){
//        	return Utils.requestAPI('v5a/admin/notice/info?_method=GET&', paramStr);
//        	v5a/admin/account/exchangecurrency/commission/detail?_method=GET
        	return Utils.requestAPI('v5a/admin/account/exchangecurrency/commission/detail?_method=GET&', paramStr);
        }
        
        //정산내역 전체 조회 및 검색  completed by dongju 2017-09-20
        function getSettlement(paramStr){
        	return Utils.requestAPI('v5a/admin/account/settlement/list?_method=GET&', paramStr);
        }
        // 정산내역 상세조회 
        function getSettlementDetails(paramStr){
        	return Utils.requestAPI('v5a/admin/account/settlement/detail?_method=GET&', paramStr);
        }
        //예수금  전체 조회 및 검색 
        function getDeposit(paramStr){
        	return Utils.requestAPI('v5a/admin/account/deposit/list?_method=GET&', paramStr);
        }
        function getDepositMember(paramStr){
        	return Utils.requestAPI('v5a/admin/account/deposit/member/list?_method=GET&', paramStr);
        }
        // 예수금  상세조회 
        function getDepositDetails(paramStr){
        	return Utils.requestAPI('v5a/admin/account/deposit/detail?_method=GET&', paramStr);
        }
        // 정산내역 수정 사유 등  
        function setSettlementChargingFee(paramStr){
        	return Utils.requestAPI('v5a/admin/account/chargingFee?_method=PUT&', paramStr);
        }
        // TODO  모계좌 조회 API 연동 
        function getMTAccountBalance(){
        	return Utils.requestAPI('v5a/admin/account/motherAccount/list?_method=GET&','');
        }
        
        function getMTAccountBalanceDetails(paramStr){
        	return Utils.requestAPI('v5a/admin/account/motherAccount/history?_method=GET&', paramStr);
        }
        /**
         * @method 농협 에서 SC 모계좌로 10억씩 이체 
         * */
        function setTransferFromNP2PToSC(){
        	return Utils.requestAPI('v5a/admin/temp/nhp2p/sc/10?_method=POST&', '');
        }
        /**
         * @method 농협 P2P 거래 누락건 조회  
         * */
        function checkNHP2PTransHis(){
        //	return Utils.requestAPI('v5a/admin/account/motherAccount/list?_method=GET&','');
        	return Utils.requestAPI('v5a/admin/account/nhp2p/checkMissignTrnHis?_method=GET&', '');
        }
        
    }
})();
