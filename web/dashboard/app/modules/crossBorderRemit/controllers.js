(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('RemitController', RemitController);

    RemitController.$inject = ['$scope','$rootScope','$state', 'RemitService', 'MemberService', '$translate', 'Utils', '$log' , '$timeout' ,'$httpParamSerializer'];
    function RemitController($scope, $rootScope, $state, RemitService,MemberService, $translate, Utils, $log, $timeout, $httpParamSerializer) {
        var vm = this;
        
		$scope.countryList = [{
			name: "Pay-In",
			value: "payin"
		},
		{
			name: "Pay-Out",
			value: "payout"
		},
		];
		
		var staticValue = { "nmLangCd": "en", "emailTp": "PERSONAL"};
		$scope.remitFormData = {};
		$scope.beFormData = {};
        (function initController() {
        	$log.debug("Remit init");
            getListCountry();
			getListBank();
        })();

		function getListCountry() {
			$scope.dataFormLoading = true;
			MemberService.getListCountry().then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$scope.countryList = response.data;
				}
				$scope.dataFormLoading = false;		
			});
		}
		
		function getListBank() {
			$scope.dataFormLoading = true;
			MemberService.getListBank().then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
					$scope.listBank = response.data;
				}
				$scope.dataFormLoading = false;		
			});
		}
		
		$scope.processRemitForm = function(){
			$log.debug('RemitForm: ' + JSON.stringify($scope.remitFormData));
			
			$log.debug('httpParamSerializer1: ' + $httpParamSerializer($scope.remitFormData));
			
			$log.debug('beFormData: ' + JSON.stringify($scope.beFormData));
			
			$log.debug('httpParamSerializer2: ' + $httpParamSerializer($scope.beFormData));
		}
		
    }

})();
