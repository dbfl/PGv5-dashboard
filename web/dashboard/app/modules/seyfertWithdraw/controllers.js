(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('SeyfertWithdrawController', SeyfertWithdrawController);

    SeyfertWithdrawController.$inject = ['$scope','$rootScope','$state', 'SeyfertWithdrawService', '$translate', 'Utils', '$log' , '$timeout' ,'$httpParamSerializer', 'MemberService', '$uibModal', '$http'];
    function SeyfertWithdrawController($scope, $rootScope, $state, SeyfertWithdrawService, $translate, Utils, $log, $timeout, $httpParamSerializer, MemberService, $uibModal, $http) {
        var vm = this;
        $scope.isPushed = false;
        
        (function initController() {
        	$log.debug("SeyfertWithdrawController init");
			seyfertList();
			getCurrencyList();
        })();
        
        

        vm.isAdmin = $rootScope.globals.currentUser.isAdmin;
        
        $scope.currencyList = [];
		$scope.seyfertList = {};
		$scope.memberList = {};
		$scope.loadInquiryBalance =  true;
		$scope.showMemberList =  false;
		$scope.withdrawSuccess=  false;
		
		vm.selectMemberGuid = function(guid){
			$log.debug('guid slect: ' + guid);
			$scope.showMemberList = false;
			vm.seyfertWithdrawForm.dstMemGuid = guid;
			vm.inquiryBalances(false);
			$scope.showMemberList =  false;
		};
		vm.inquiryBalances = function(show){
			$log.debug('inquiryBalance::======>: ' + $scope.textText);
			//compare here
			$scope.invalidParam = false;
			if(vm.seyfertWithdrawForm.dstMemGuid == null || vm.seyfertWithdrawForm.dstMemGuid == ''){
				return;
			}
			$scope.inquiryBalanceProcessing = true;
			$log.debug('inquiryBalance::dstMemGuid: ' + vm.seyfertWithdrawForm.dstMemGuid);
			var param = "dstMemGuid="  + vm.seyfertWithdrawForm.dstMemGuid ;
			SeyfertWithdrawService.inquiryBalances(param).then(function (response) {
        		$log.debug(response.status);
				if(response.status == 'SUCCESS'){
					$log.debug("moneyPairs:" + response.data.moneyPairs);
					$scope.loadInquiryBalance =  true;
					$scope.moneyPairs = response.data.moneyPairs;
				}else if(response.status == "ERROR"){
					$scope.loadInquiryBalance = false;
					if(response.data.cdKey == 'INVALID_PARAM_FORMAT'){
						$scope.invalidParam = true;
					}
				}
				
            });
			if(show){
				param = "fullname="  + vm.seyfertWithdrawForm.dstMemGuid + "&page=1&limit=10";
				SeyfertWithdrawService.memberList(param).then(function (response) {
					if(handleResponse(response)){
						$log.debug("memberList:" + response.data.resultList);
						$scope.loadInquiryBalance =  true;
						$scope.memberList = response.data.resultList;
					}
					var count = Object.keys($scope.memberList).length;
					
					$log.debug("length memberList:" + count);
					
					if(count > 0){
						$log.debug("showMemberList");
						$scope.showMemberList =  true;
					}else{
						$scope.invalidParam = true;
					}
					$scope.inquiryBalanceProcessing = false;
				});
			}
		}
		
		$scope.getMemberDetail = function(memberDetail) {
			$log.debug('memberDetail: ' + JSON.stringify(memberDetail));
			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'modules/member/views/memberDetail.html',
				controller : 'MemberDetailController',
				size : 'lg',
				backdrop : 'false',
				keyboard : true,
				windowClass : 'zindex',
				resolve : {
					memberDetail : function() {
						$log.debug('memberDetail: '
								+ JSON.stringify(memberDetail));
						return memberDetail;
					}
				}
			});

			modalInstance.result.then(function(newNameSt, newPennySt) {
				$log.debug('newNameSt: ' + newNameSt);
				$log.debug('newPennySt: ' + newPennySt);
				$scope.selected = selectedItem;
			}, function() {
				$log.debug('Modal dismissed  at: ' + new Date());
			});
		};
		
        function seyfertList() {
        	$log.debug("seyfertList");
			$scope.loadDataForm = true;
			SeyfertWithdrawService.seyfertList().then(function (response) {
        		$log.debug(response.status);
				if(handleResponse(response)){
					$log.debug("SeyfertList:" + response.data);
					$log.debug("SeyfertList:" + response.data.data);
					$scope.seyfertList = response.data.result.SeyfertList;
					$scope.loadDataForm = false;
				}
            });
        };
        
        function getCurrencyList() {
        	$log.debug("getCurrencyList");
			$scope.loadDataForm = true;
			$http.get('data/listCurrency.json').then(function(response) {
				$scope.currencyList = response.data;
				$scope.loadDataForm = false;
			});
        };
		
		vm.seyfertWithdraw = function(){
        	$log.debug("seyfertList");
			$scope.loadDataForm = true;
			$scope.isPushed = true;
			
			
			//$log.debug("depositAction:" + vm.seyfertWithdrawForm.depositAction);
			$log.debug("params:" + $httpParamSerializer(vm.seyfertWithdrawForm));
				
//			dstMemGuid=testabcd3923
			
			/**
			 * modified by atlas
			 * @contents Admin 계정권한 소유 시 dstGuid 입력 하도록 수정 . 
			 *           admin 권한 없으면 자기 dstGuid = 로그인한 guid 로 설정 해서 API request
			 * */ 
			var params ='';
			if(!(vm.isAdmin)){
				var currentGuid = $rootScope.globals.currentUser.superGuid;
				params = $httpParamSerializer(vm.seyfertWithdrawForm) +"&dstMemGuid="+ currentGuid;
			}else{
				params = $httpParamSerializer(vm.seyfertWithdrawForm);
			}
			
			SeyfertWithdrawService.seyfertWithdraw(params).then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'ERROR'){
    				if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
    					swal({
							title: $translate.instant('ERROR'),
							text: $translate.instant('errorComments'),
							type: "error",
							confirmButtonText: $translate.instant('btnOK')
						});
						$state.go('login');
	    				if (!$rootScope.$$phase) $rootScope.$apply();
	    				
	    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
	    				Utils.getErrorHanler(response.data.cdKey , response.data.cdDesc);
	    			}else {
	    				swal({
							title: $translate.instant('ERROR'),
							text: response.data.cdKey + ":" + response.data.cdDesc,
							type: "error",
							confirmButtonText: $translate.instant('btnOK')
						});
	    			}
    				return false;
    			}else if(response.status == 'SUCCESS'){
    				$log.debug("data:" + response.data);
    				$log.debug(response.data);
    				seyfertList();
					vm.inquiryBalances();
					$scope.withdrawSuccess=  true;
    			} 
				$scope.loadDataForm = false;
				$scope.isPushed = false;
			});
        };
		
        function handleResponse(response){
			if(response.status == 'ERROR'){
				if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
					swal({
						title: $translate.instant('ERROR'),
						text: $translate.instant('errorComments'),
						type: "error",
						confirmButtonText: $translate.instant('btnOK')
					});
					$state.go('login');
    				if (!$rootScope.$$phase) $rootScope.$apply();
    				
    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
    				Utils.getErrorHanler(response.data.cdKey , response.data.cdDesc);
    			}else {
    				swal({
						title: $translate.instant('ERROR'),
						text: response.data.cdKey + ":" + response.data.cdDesc,
						type: "error",
						confirmButtonText: $translate.instant('btnOK')
					});
    			}
				return false;
			}else if(response.status == 'SUCCESS'){
				$log.debug("data:" + response.data);
				$log.debug(response.data);
				
				
				var obj = Utils.getJsonObj(response.data);
				
				if(Utils.isUndefinedOrNull(obj.status)){
					if(obj.status != "SUCCESS"){
						if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
							swal({
								title: $translate.instant('ERROR'),
								text: $translate.instant('errorComments'),
								type: "error",
								confirmButtonText: $translate.instant('btnOK')
							});
							$state.go('login');
		    				if (!$rootScope.$$phase) $rootScope.$apply();
		    				
		    			}else if(obj.data.cdKey == 'UNKNOWN_ERROR'){
		    				Utils.getErrorHanler(obj.data.cdKey , obj.data.cdDesc);
		    			}else {
		    				swal({
								title: $translate.instant('ERROR'),
								text: obj.data.cdKey + ":" + obj.data.cdDesc,
								type: "error",
								confirmButtonText: $translate.instant('btnOK')
							});
		    			}
					}
					return false;
				}else{
					return true;
				}
			} 
		}
        $scope.formatKorCrrncy = function(){
			if(Utils.isNullOrUndifined(vm.seyfertWithdrawForm)
					|| Utils.isNullOrUndifined(vm.seyfertWithdrawForm.amount)){
				$scope.koreanCurrency = '';
				return;
			}
			var resltStr;
			//var formatStr = vm.seyfertWithdrawForm.amount.replace(/[^0-9.]/g, "");
			var arrays = vm.seyfertWithdrawForm.amount.split('.');
		    //console.log(arrays[0] + " , "+ arrays[1]);
			var length = arrays.length;
			if(length >= 3){
				resltStr = "입력하신 숫자의 특수문자를 확인해주세요."
			}else{
				var formatStr = arrays[0].replace(/[^0-9.]/g, "");
				resltStr = Utils.getKoreanCrrncy(formatStr);
				/*console.log(resltStr);*/
				if(!(Utils.isNullOrUndifined(arrays[1]))){
					resltStr += Utils.getKoreanBelowPoint(arrays[1]);
				}else{
					/*resltStr = resltStr+" 원";*/
					resltStr;
				}
				
			}
			$scope.koreanCurrency = resltStr;
		}
		
        
    }
    
   
})();
