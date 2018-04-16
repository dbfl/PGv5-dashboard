(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('ToolsController', ToolsController)
		.controller('SMSController', SMSController)
		.controller('ChargeAccController', ChargeAccController);

    ToolsController.$inject = ['$scope','$rootScope','$state', 'ToolsService', '$translate', 'Utils', '$log' , '$timeout' ,'$httpParamSerializer', '$http', '$uibModal'];
    function ToolsController($scope, $rootScope, $state, ToolsService, $translate, Utils, $log, $timeout, $httpParamSerializer, $http) {
        var vm = this;
        
        
        
        
        $scope.currencyList = [];
		$scope.dataInquiry = {};
		$scope.dataExchange = {};
		vm.currencyForm = {};
		$scope.loadDataForm = true;
		$scope.doCalculation = false;
		$scope.canProcessing = false;
		$scope.exchangeSuccess = false;
		$scope.directiveOptions = {
			no_results_text: "Loading ..."
		};
		
		
        (function initController() {
        	$log.debug("Tools init");
			getCurrencyList();
        })();
		
		
		vm.exchangeProcess = function(dataInquiry){
			$scope.loadDataForm = true;
			$scope.exchangeSuccess = false;
			$log.debug("exchangeProcess" + JSON.stringify($scope.dataInquiry));
			if($scope.dataInquiry != null){
				$scope.dataInquiry.dstAmt = null;
				ToolsService.exchangeProcess($httpParamSerializer($scope.dataInquiry)).then(function (response) {
					if(handleResponse(response)){
						$log.debug("exchangeProcess finish:" + response.data);
						$scope.dataExchange = response.data;
						$scope.exchangeSuccess = true;
					}
					$scope.loadDataForm = false;
				});	
			}
			
		}
		vm.exchangeInquiry = function(){
			$scope.doCalculation = true;
			$scope.canProcessing = false;
			$log.debug('currencyForm: ' + JSON.stringify(vm.currencyForm));
			ToolsService.exchangeInquiry($httpParamSerializer(vm.currencyForm)).then(function (response) {
        		$log.debug(response.status);
				if(handleResponse(response)){
					$log.debug("exchangeCurrency:");
					$scope.canProcessing = true;
					$scope.doCalculation = false;
					$scope.dataInquiry = response.data;
				} 
            });
		}
		
			
			
        function getCurrencyList() {
        	$log.debug("getCurrencyList");
			$scope.loadDataForm = true;
			$http.get('data/listCurrency.json').then(function(response) {
				$scope.currencyList = response.data;
				$scope.loadDataForm = false;
			});
			/*
			ToolsService.getListCurrencyForm().then(function (response) {
        		$log.debug(response.status);
				if(handleResponse(response)){
					$log.debug("currencyList:");
					$scope.currencyList = response.data.result.currencyList;
					$scope.loadDataForm = false;
				}
            });*/
        };
		
		function handleResponse(response){
			if(response.status == 'ERROR'){
				/*swal({
				  title: $translate.instant('ERROR'),
				  text: response.data.cdKey + ":" + response.data.cdDesc,
				  type: "error",
				  confirmButtonText: $translate.instant('btnOK')
				});
					
				if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
					$state.go('login');;
					if (!$rootScope.$$phase) $rootScope.$apply();
				}*/
				
//				Utils.getErrorHanler(response.data.cdKey , response.data.cdDesc);
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
				var obj = Utils.getJsonObj(response.data);
				
				if(Utils.isUndefinedOrNull(obj.status)){
					if(obj.status != "SUCCESS"){
						/*swal({
						  title: $translate.instant('ERROR'),
						  text: obj.data.cdKey + ":" + obj.data.cdDesc,
						  type: "error",
						  confirmButtonText: $translate.instant('btnOK')
						});
						if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
							$state.go('login');
							if (!$rootScope.$$phase) $rootScope.$apply();
						}*/
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
		
    }
	
	function ChargeAccController($scope, $rootScope, $state, ToolsService, SeyfertWithdrawService,$http , $translate, Utils, $log, $timeout, $httpParamSerializer, MemberService, $uibModal) {
		$log.debug("ChargeAccController");
		var vm = this;
		vm.historyCrrncy ;
		$scope.isPushed = false;
		$scope.typeList = [{
			name: "Pay-In",
			value: "payin"
		},
		{
			name: "Pay-Out",
			value: "payout"
		},
		{
			name: "Fee Deduction",
			value: "deduct"
		},
		];
		
		$scope.loadDataForm = false;
		$scope.chargeAccSuccess=  false;
		
		$scope.currencyList = [{
			name: "KRW - South Korean Won",
			value: "KRW"
		},
		{
			name: "USD - US Dollar",
			value: "USD"
		}];
		
		
		$http.get('data/listCurrency.json').then(function(response) {
			$scope.currencyList = response.data;
		});
		$http.get('data/listCurrencySearch.json').then(function(response) {
			$scope.currencyListSearch = response.data;
		});	
		vm.selectMemberGuid = function(guid){
			$log.debug('guid slect: ' + guid);
			$scope.showMemberList = false;
			vm.chargeForm.dstMemGuid = guid;
			vm.inquiryBalances(false);
			$scope.showMemberList =  false;
			
			
		};
		vm.inquiryBalances = function(show){
			$scope.invalidParam = false;
			$scope.showMemberList =  false;
			$scope.loadDataForm = true;
			
			if(Utils.isNullOrUndifined(vm.chargeForm)
				|| vm.chargeForm.dstMemGuid == null
				|| vm.chargeForm.dstMemGuid == ''){
				console.log("NODATA");
				return;
			}
			
			$scope.inquiryBalanceProcessing = true;
			$scope.tmpDstMemGuid = vm.chargeForm.dstMemGuid
			
			var param = "dstMemGuid=" + vm.chargeForm.dstMemGuid+"&limit=1";
			MemberService.getRecentTransaction(param).then(function(response){
					if(response.status == 'SUCCESS'){
						//var param = "dstMemGuid="  + $scope.tmpDstMemGuid +"&limit="+response.data.totalCount;
						var param = "dstMemGuid="  + $scope.tmpDstMemGuid +"&limit=10";
						MemberService.getRecentTransaction(param).then(function(response){
							if(response.status == 'SUCCESS'){
								$scope.loadInquiryBalance =  true;
								$scope.history = response.data.list;
                                
                                //Count 9999 로 limit 
                                $scope.history.totalCount = response.data.totalCount > 9999 ? 9999 : response.data.totalCount
                                

							}else if(response.status == 'ERROR'){
								$scope.loadInquiryBalance = false;
								if(response.data.cdKey == 'INVALID_PARAM_FORMAT'){
									$scope.invalidParam = true;
								}
							}
						});
					}else if(response.status == 'ERROR'){
						$scope.loadInquiryBalance = false;
						if(response.data.cdKey == 'INVALID_PARAM_FORMAT'){
							$scope.invalidParam = true;
						}
					}
				
					$scope.loadDataForm = false;
			});
			
			if(show){
				var param = "fullname="  + vm.chargeForm.dstMemGuid + "&page=1&limit=10";
				SeyfertWithdrawService.memberList(param).then(function (response) {
					if(handleResponse(response)){
						$log.debug("memberList:" + response.data.resultList);
						$scope.loadInquiryBalance =  true;
						$scope.memberList = response.data.resultList;
					}
					var count = Object.keys($scope.memberList).length;
					
					$log.debug("lenght memberList:" + count);
					
					if(count > 0){
						$log.debug("showMemberList");
						$scope.showMemberList =  true;
					}else{
						$scope.showMemberList =  false;
					}
					$scope.inquiryBalanceProcessing = false;
				});
			}
		}
		
/*		vm.sortHistroyCrrncy = function(){
			// $scope.moneyPair null check
			if(Utils.isNullOrUndifined($scope.moneyPair)){
				return;
			}
			// vm.historyCrrncy check if it is "ALL" or not 
			if(vm.historyCrrncy.includes("ALL")){
				$scope.histroy = $scope.moneyPair;
				return;
			}

			$scope.histroy = [];
			var tmpArray = {
					"amount":"",
					"crrncy":"",
			};
			var length = $scope.moneyPair.length;

			 //sorting 
			for(var i=0; i < length ;i++){
				if(vm.historyCrrncy.includes($scope.moneyPair[i].crrncy)){
					tmpArray.amount = $scope.moneyPair[i].amount;
					tmpArray.crrncy = $scope.moneyPair[i].crrncy;
					$scope.histroy.push(tmpArray);
				}else{

				}
			}
		}*/
		
		
		$scope.formatKorCrrncy = function(){
			
			if(Utils.isNullOrUndifined(vm.chargeForm)
					|| Utils.isNullOrUndifined(vm.chargeForm.amount)){
				$scope.koreanCurrency = '';
				return;
			}
			
			var formatStr = vm.chargeForm.amount.replace(/[^0-9.]/g, "")
			var resltStr;
			var test1 = vm.chargeForm.amount.split('.');
			var length = test1.length;
			if(length >= 3){ 
				resltStr = "입력하신 숫자의 특수문자를 확인해주세요."
			}else{
				resltStr = Utils.getKoreanCrrncy(test1[0]);
				if(!(Utils.isNullOrUndifined(test1[1]))){
					resltStr += Utils.getKoreanBelowPoint(test1[1]);
				}else{
					resltStr ;
				}
			}
			$scope.koreanCurrency = resltStr;
		}
		
		vm.chargeAcc = function(show){
			$scope.loadDataForm = true;
			$scope.isPushed = true;
			
			$log.debug("depositAction:" + vm.chargeForm.depositAction);
			$log.debug("params:" + $httpParamSerializer(vm.chargeForm));

			ToolsService.chargeAcc( $httpParamSerializer(vm.chargeForm), vm.chargeForm.depositAction).then(function (response) {
        		$log.debug(response.status);
				if(response.status == 'SUCCESS'){
					$log.debug("chargeAcc:" + response.data);
					$log.debug("status:" + response.data.status);
					$log.debug("tid:" + response.data.tid);
					$scope.chargeAccSuccess =  true;
					$scope.chargeAccResult =  response.data;
					vm.inquiryBalances(false);
					
					angular.copy({},vm.chargeForm);
				}else{
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
				}
				$scope.isPushed = false;
				$scope.loadDataForm = false;
			});
		}
		
		/*vm.getMemberDetail = function(guid){
			$scope.dataLoading = true;
			var paramStr = "dstMemGuid=" + guid;
			//get value from object
			MemberService
					.getMemberDetail(paramStr)
					.then(
							function(response) {
								$log.debug(response.status);
								if (response.status == 'ERROR') {
									swal({
										title : $translate.instant('ERROR'),
										text : response.data.cdKey + ":"
												+ response.data.cdDesc,
										type : "error",
										confirmButtonText : $translate
												.instant('btnOK')
									});

									if (response.data.cdKey == 'SESSION_EXPIRED'
											|| response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
										$state.go('login');
										;
										if (!$rootScope.$$phase)
											$rootScope.$apply();
									}
								} else if (response.status == 'SUCCESS') {
									$log.debug("data:" + response.data);
									var obj = Utils.getJsonObj(response.data);

									if (Utils.isUndefinedOrNull(obj.status)) {
										if (obj.status == "ERROR") {
											swal({
												title : $translate
														.instant('ERROR'),
												text : obj.data.cdKey + ":"
														+ obj.data.cdDesc
														+ "\nTry login again",
												type : "error",
												confirmButtonText : $translate
														.instant('btnOK')
											});
											if (obj.data.cdKey == 'SESSION_EXPIRED'
													|| obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
												$state.go('login');
												if (!$rootScope.$$phase)
													$rootScope.$apply();
											}
										}
									} else {
										$scope.memberDetailResult = obj.result;
									}
								}
								$scope.dataLoading = false;
							});
		}*/
		
		$scope.getMemberDetail = function(memberDetail) {
			$log.debug('memberDetail: ' + JSON.stringify(memberDetail));
			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'modules/member/views/memberDetail.html'+Utils.getExtraParams(),
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
		
	}
	function SMSController($scope, $rootScope, $state, ToolsService, $translate, Utils, $log, $timeout, $httpParamSerializer) {
		$log.debug("SMSController");
		var vm = this;
		$scope.loadDataForm = false;
		$scope.sendSuccess = false;
	
		(function initController(){
			console.log('sms init');
		    $scope.params = $state.params;
		    console.log($scope.params);
		    vm.smsForm = {};
		    if(!(Utils.isNullOrUndifined($scope.params.to)) && $scope.params.to != ''){
				vm.smsForm.numbersToReceiveCSV =$state.params.to ;
			}
			if(!(Utils.isNullOrUndifined($scope.params.title)) && $scope.params.title != ''){
				vm.smsForm.title = $state.params.title;
			}
			if(!(Utils.isNullOrUndifined($scope.params.msg)) && $scope.params.msg != ''){
				vm.smsForm.message =$state.params.msg;
			}
		})();
		
		
		vm.smsSend = function(){
			$scope.loadDataForm = true;
			$scope.sendSuccess = false;
			$log.debug("smsSend:" + $httpParamSerializer(vm.smsForm));
			
			ToolsService.smsSend($httpParamSerializer(vm.smsForm)).then(function (response) {
				$log.debug("smsSend finish:" + response.status);
				if(response.status == 'SUCCESS'){
					$log.debug("smsSend finish:" + response.data);
					$scope.sendSuccess = true;
				}else{
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
				}
				$scope.loadDataForm = false;
			});	
			
		}
		
	}
	
	
	

})();
