(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('SettingController', SettingController)
        .controller('SeyfertKeyPController', SeyfertKeyPController);

    SettingController.$inject = ['$scope','$rootScope','$state', '$translate', 'SettingService','Utils','$log', '$timeout', '$uibModal', '$sce', 'localStorageService', '$httpParamSerializer', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$filter' ,'SeyfertWithdrawService' ,'MemberService'];
    function SettingController($scope, $rootScope, $state,$translate, SettingService, Utils, $log, $timeout, $uibModal, $sce, localStorageService, $httpParamSerializer, DTOptionsBuilder, DTColumnDefBuilder, $filter , SeyfertWithdrawService ,MemberService) {
        var vm = this;
        	
    	if(Utils.isNullOrUndifined($rootScope.tmpTestUserm)){
    		vm.isAdmin = $rootScope.globals.currentUser.isAdmin;
    	}else{
    		if($rootScope.tmpTestUserm == false){
    			vm.isAdmin = $rootScope.tmpTestUserm;
    			main.isViewAs = true;
    			vm.userName = 'Example user';		
    		}else{
    			vm.isAdmin = $rootScope.globals.currentUser.isAdmin;
    		}
    	}
    	vm.isViewAsActivated = localStorageService.get('viewas');
    	if(Utils.isNullOrUndifined(vm.isViewAsActivated)){
    		vm.isViewAsActivated = false;
    	}
    	
    	$scope.tempSearchForm = 'modules/member/views/searchForm.html'+Utils.getExtraParams();
    	
    	 vm.tabSelected = function(tab) {
 			$log.debug('tabSelected: ' + tab);
 			console.log(tab);
 			
 			if(tab == 'index.settings' || tab == 'index.settings.general'){
 				console.log('general');
 				getCategory();
 			}else if(tab == 'account'){
 				console.log('account page');
 				getTempNoti();
 			}else if(tab == 'index.settings.roles'){
 				listMemberRoles();
 			}else if(tab == 'index.settings.api'){
 				getListAPIRoles();
 			}else if(tab == 'index.settings.contract'){
 				
 				if(!(Utils.isNullOrUndifined($scope.params.guid)) && $scope.params.guid !=''){
 					vm.memContract ={};
 					vm.memContract.srcMemGuid = $scope.params.guid;
	 	        	console.log($scope.params.guid);
 					
 				}
 			}else if(tab == 'index.settings.noti'){
 				if(!(Utils.isNullOrUndifined($scope.params.guid))  && $scope.params.guid !='') {
	 				vm.dstMemGuid = $scope.params.guid;
	 	        	console.log($scope.params.guid);
 				}
 				
 				if(!(Utils.isNullOrUndifined($scope.params.testUrl))  && $scope.params.testUrl !='') {
	 	        	vm.testValidUrl = $scope.params.testUrl;
	 	        	console.log($scope.params.testUrl);
 				}
 				
 				
 				if(!vm.isAdmin){
 					getRegistedNotiUrl();
 				}else{
 					$scope.tranStatusRows = [];
 		    		$scope.payinListRows = [];
 				}
 				
 				
 			}else if(tab == 'index.settings.options'){
 				getNotiStatus();
 			}
 		};
 		
    	
    	(function initController() {
        	$log.debug("Setting init");
        	
        	$scope.$emit('$stateChangeSuccess','');
        	
        	/*var params = $state.params;
        	console.log(params);*/
        	//vm.tabSelected( $state.current.name, params);

        })();
    	
    	 $scope.$on('$stateChangeSuccess', function(event, toState) {
    		 	/*console.log(toState.name);
    		 	console.log(toState);*/
    		 	if(toState.name.indexOf('index.settings') != -1){
				  	var stateNameComponents = toState.name.split('.');
				    var stateName = stateNameComponents[(stateNameComponents.length - 1)];
				    
				    $scope.tabs = {
				      general : false,
				      account : false,
				      roles : false,
				      api : false,
				      contract : false,
				      noti : false,
				      options : false
				    };
				    
				    
				    if(stateName == 'settings'){
				    	//stateName = 'general';
				    	stateName = vm.isAdmin == true  ? 'general' : 'account';
				    	
				    	if(vm.isViewAsActivated == true){
				    		stateName = 'noti';
				    	}
				    }
				    
				    $scope.tabs[stateName] = true;
				    
				    $scope.params = $state.params;
		        	console.log($scope.params);
    		 	}
		  });
    	
       
		
		vm.categories = [];
		vm.options = [];
		$scope.tempTabGeneral = 'modules/settings/views/general.html'+Utils.getExtraParams();
//		$scope.tempTabAccount1 = 'modules/settings/views/accountFrame.html'+Utils.getExtraParams();
		$scope.tempTabAccount = 'modules/settings/views/account.html'+Utils.getExtraParams();
		$scope.tempTabRoles = 'modules/settings/views/roles.html'+Utils.getExtraParams();
		$scope.tempTabAPI = 'modules/settings/views/api.html'+Utils.getExtraParams();
		$scope.tempTabContract = 'modules/settings/views/contract.html'+Utils.getExtraParams();
		$scope.tempTabNoti = 'modules/settings/views/noti.html'+Utils.getExtraParams()
		$scope.tempTabOptions = 'modules/settings/views/options.html'+Utils.getExtraParams();
		
		$scope.tempKeyPActive = 'modules/settings/views/keyPCtrl.html'+Utils.getExtraParams();
		
		$scope.dtOptionsMember = DTOptionsBuilder
		.newOptions()
		.withPaginationType('numbers')
		.withDisplayLength(10)
		.withOption('paging', false)
		.withOption('searching', false)
		.withOption('lengthChange', false)
		.withOption('ordering', true)
		.withOption('info', false)
		.withOption('pagingType', false)
		.withBootstrap()
		.withBootstrapOptions({
			TableTools : {
				classes : {
					container : 'btn-group',
					buttons : {
						normal : 'btn btn-danger'
					}
				}
			},
			ColVis : {
				classes : {
					masterButton : 'btn btn-primary'
				}
			},
			pagination : {
				classes : {
					ul : 'pagination pagination-sm'
				}
			}
		})
		.withButtons(
				[]);

		/**
		 * @method keyP 상태 활성화 / 비활성화 상태 변경 
		 * */
		function changeKeyPStatus(dstInfo){
			$scope.params = dstInfo;
			swal({
				   title: $translate.instant('lblKeyPStatusTitle'),
				   text: $translate.instant('lblKeyPStatusContent'),
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",
				   confirmButtonText: $translate.instant('YES'),
				   cancelButtonText: $translate.instant('NO'),
				   closeOnConfirm: true,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
					   if($scope.keyStatus == 'ACTIVATED'){
						   //TODO enable 
						   setKeyPDisable($scope.params);
						}else  if($scope.keyStatus == 'INACTIVATED'){
						   //TODO disable
							setKeyPEnable($scope.params);
						}
				   } else {
				      swal("", $translate.instant('VCNotiMsgCancel'), "error");
				   }
				});
		}
		vm.changeKeyPStatus = changeKeyPStatus;
		
		/**
		 * @method keyP 활성화 호출  
		 * */
		function setKeyPEnable(param){
			
			var params = param.dstMemGuid;
			params = 'dstMemGuid='+params;
			SettingService.setKeyPEnable(params).then(function(value) {
				
				$scope.keyStatus == 'ACTIVATED';

				var params = {};
			   	params.dstMemGuid = vm.mkeyStatus.dstMemGuid;
			    $scope.getMemberDetail(params);
			    
			}, function(reason) {
				var response = reason;
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
				}
			});
		}
		/**
		 * @method keyP 비활성화 호출   
		 * */
		function setKeyPDisable(param){
			var params = '';
			var params = param.dstMemGuid;
			params = 'dstMemGuid='+params;
			
			SettingService.setKeyPDisable(params).then(function(value) {
				
				$scope.keyStatus == 'INACTIVATED';

				var params = {};
			   	params.dstMemGuid = vm.mkeyStatus.dstMemGuid;
			   	
			    $scope.getMemberDetail(params);
			}, function(reason) {
				var response = reason;
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
				}	
			});
		}
		
		
		function getTempNoti(){
			var msg = $translate.instant('lblTmpNotiMsg');
			Utils.setSimpleNoti(msg,'6000','alert-warning');
			
		}
		// 상단알림바 show/hide 변경시 로컬 스토리지에 적용 .
		vm.change = function(param){
			var userName = $rootScope.globals.currentUser.username;
			var array = [vm.viewAs,vm.viewUrl, userName];
			localStorageService.set('notiBar', array);
		}
		// admin 일시 상단바 상태 값 가져오기 (boolean)
		function getNotiStatus(){
			if(!vm.isAdmin){
				return;
			}
			vm.viewAs  = $rootScope.viewAs ; // viewAs show/hide
			vm.viewUrl = $rootScope.viewUrl ; // url show/hide
		}
		// 노티 변경후 등록하면 화면 데이터 refresh .
		vm.notibarSubmit = function(){
			$state.go($state.current,{},{reload:true});
		}

		vm.transStatusList;
		vm.payInList;
		vm.testValidUrl;
		vm.resultComments = "";
		vm.resultResponse = "";
		$scope.notiProgressSuccess = true;
		$scope.notiProgressStart = false

		function setResultStatus(status){
			$scope.notiProgressStart = true;
			if(status == 'ERROR'){
				vm.resultComments = "Http network connection failed";
				$scope.notiProgressSuccess = false;
				
			}else if(status == 'SUCCESS'){
				vm.resultComments = "Success!";
				$scope.notiProgressSuccess = true;	
			}
			vm.resultResponse = "";
		}
		
		function setResultStatusMsg(status , msg){
			$scope.notiProgressStart = true;
			if(status == 'ERROR'){
				vm.resultComments = msg
				$scope.notiProgressSuccess = false;
				
			}else if(status == 'SUCCESS'){
				vm.resultComments = msg;
				$scope.notiProgressSuccess = true;	
			}
			vm.resultResponse = "";
		}
		
		function setResultStatusForUrlValid(result){
			$scope.notiProgressStart = true;
			if(result.status == 'ERROR'){
				vm.resultComments = "Http network connection failed";
				$scope.notiProgressSuccess = false;
				
			}else if(result.status == 'SUCCESS'){
				vm.resultComments = "httpStatus : "+result.data.httpStatus;
				vm.resultResponse = "httpResponse : "+result.data.httpResponse;
				
				$scope.notiProgressSuccess = true;	
			}
		}
		
        /**
         * @method + 버튼 클릭시 거래내역 noti 등록 로우 추가 
         * */
        function addRow(){
        	console.log($scope.tranStatusRows.length);

        	$scope.tranStatusCount = $scope.tranStatusRows.length;	
        	$scope.tranStatusRows[$scope.tranStatusCount] = '';
        	
    		$scope.tranStatusCount++;
        	$scope.isTranStatusMax = $scope.tranStatusCount > 1 ? true : false;    		
    		
    		$scope.itemTranStatusDisabled = true;
        };

        /**
         * @method 거래상태내역 noti URL 등록    
         * */
/*		$scope.ok = function() {
			$log.debug("OK click");
			$uibModalInstance.close($scope.selected.item);
		};

		$scope.cancel = function() {
			$log.debug("cancel click");
			$uibModalInstance.dismiss('cancel');
		};*/
		function notiConfirm(url){
			swal({
				   title: "Confirm",
				   text: "[ "+url +" ] 로 \n 등록 하시겠습니까?",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "YES",
				   cancelButtonText: "NO",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){
					   if (isConfirm) {
						   swal("변경완료!", "정상적으로 등록 되었습니다.", "success");
					   }else{
						   swal("변경취소", "등록이 취소되었습니다.", "error");
					   }
				});
		}
        function registRow(index){
        	var tmpUrl = vm.transStatusList;
        	tmpUrl = getParameter(tmpUrl);
        	//notiConfirm(vm.transStatusList);
        	swal({
			   title: "Confirm",
			   text: "[ "+vm.transStatusList +" ] 로 \n 등록 하시겠습니까?",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",confirmButtonText: "YES",
			   cancelButtonText: "NO",
			   closeOnConfirm: false,
			   closeOnCancel: false }, 
			function(isConfirm){
				   if (isConfirm) {
			        	SettingService.registNotiTransactionStatus(tmpUrl).then(function (response) {
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
							}else if(response.status == 'SUCCESS'){
								var result = response.data;
								//등록 완료 확인 후 리스트 재 조회
								vm.transStatusList= "";
					        	$scope.itemTranStatusDisabled = false;
								swal("변경완료!", "정상적으로 등록 되었습니다.", "success");
								getRegistedNotiUrl();
							}
			        		setResultStatus(response.status);
			        	});
				   }else{
					   swal("변경취소", "등록이 취소되었습니다.", "error");
				   }
			}); 
        };
        
        /**
         * @method 거래상태내역 등록된 noti 삭제   
         * */
        function removeRow(index){
        	var tmpUrl =$scope.tranStatusRows[index].sendTo;
        	tmpUrl = getParameter(tmpUrl);
        	console.log(tmpUrl);
        	swal({
				   title: "Confirm",
				   text: "[ "+$scope.tranStatusRows[index].sendTo+" ] 를 \n 삭제 하시겠습니까?",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "YES",
				   cancelButtonText: "NO",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){
					   if (isConfirm) {
						   SettingService.removeNotiTransactionStatus(tmpUrl).then(function (response) {
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
								}else if(response.status == 'SUCCESS'){
									var result = response.data;

									$scope.tranStatusRows.splice(index,1);
						        	vm.transStatusList = "";
						        	$scope.tranStatusCount--;
						        	
						        	$scope.isTranStatusMax = $scope.tranStatusCount > 1 ? true : false;
						        	console.log($scope.tranStatusRows.length);
						        	
						    		if($scope.tranStatusRows != null && $scope.tranStatusRows.length > 0){
						    			$scope.itemTranStatusDisabled = $scope.tranStatusRows[0] == null ? true : false;
						    			console.log($scope.itemTranStatusDisabled);
						    		}else{
						    			$scope.itemTranStatusDisabled = false;	
						    		}
						    		swal("변경완료!", "정상적으로 삭제 되었습니다.", "success");
						    		getRegistedNotiUrl();
								}
				        		setResultStatus(response.status);
				        	});
					   }else{
						   swal("변경취소", "취소되었습니다.", "error");
					   }
				});
        	
        	
        };

        /**
         * @method + 버튼 눌러서 로우 추가    
         * */
        function addPayInListRow(){
        	$scope.pCount = $scope.payinListRows.length;	

        	$scope.payinListRows[$scope.pCount] = '';
    		$scope.pCount++;
    		$scope.isMax = $scope.pCount > 1 ? true : false;

    		$scope.itemDisabled = true; 
    		
        };

        /**
         * @method 입금내역 noti URL 등록    
         * */
        function registPayInRow (index){
        	var tmpUrl = vm.payInList;
        	tmpUrl = getParameter(tmpUrl);
        	
        	swal({
				   title: "Confirm",
				   text: "[ "+vm.payInList+" ] 로 \n 등록 하시겠습니까?",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "YES",
				   cancelButtonText: "NO",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){
					   if (isConfirm) {
						   SettingService.registNotiPayIn(tmpUrl).then(function (response) {
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
								}else if(response.status == 'SUCCESS'){
									var result = response.data;
									vm.payInList= "";
						        	$scope.itemDisabled = false;
						        	swal("변경완료!", "정상적으로 등록 되었습니다.", "success");
									getRegistedNotiUrl();
								}
				        		setResultStatus(response.status);
				        	});
					   }else{
						   swal("변경취소", "등록이 취소되었습니다.", "error");
					   }
				});
        };

        /**
         * @method 입금내역 등록된 noti 삭제   
         * */
        function removePayInRow(index){
        	var tmpUrl =$scope.payinListRows[index].sendTo;
        	tmpUrl = getParameter(tmpUrl);
        	console.log(tmpUrl);
        	
        	swal({
				   title: "Confirm",
				   text: "[ "+$scope.payinListRows[index].sendTo+" ] 를 \n 삭제 하시겠습니까?",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "YES",
				   cancelButtonText: "NO",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){
					   if (isConfirm) {
						   SettingService.removeNotiPayIn(tmpUrl).then(function (response) {
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
								}else if(response.status == 'SUCCESS'){
									var result = response.data;

									$scope.payinListRows.splice(index,1);
						        	vm.payInList = "";
						        	$scope.pCount--;
						        	$scope.isMax = $scope.pCount > 1 ? true : false;
						        	
						     		if($scope.payinListRows != null && $scope.payinListRows.length > 0){
						    			$scope.itemDisabled = $scope.payinListRows[0] == null ? true : false;
						    		}else{
						    			$scope.itemDisabled = false;	
						    		}
								    swal("변경완료!", "정상적으로 삭제 되었습니다.", "success");
						    		getRegistedNotiUrl();
								}
				        		setResultStatus(response.status);
				        	});

					   }else{

						   swal("변경취소", "취소되었습니다.", "error");
					   }
				});
           };
        
        /**
         * @method 등록된 noti 조회  
         * */
        function getRegistedNotiUrl(){
        	var tmpParam = '';
        	if(vm.isAdmin){
        		var dstMemGuid = vm.dstMemGuid;
	        	if(dstMemGuid == null || dstMemGuid.length < 1 || dstMemGuid == ""){
	        		$scope.itemTranStatusDisabled = false;
	        		setResultStatusMsg("ERROR","There is no guid");
	        		return;
	        	}
        		tmpParam = "reqDataMemGuid="+encodeURIComponent(dstMemGuid);
        	}else{
        		var userGuid = $rootScope.globals.currentUser.superGuid;
        		tmpParam = "reqDataMemGuid="+encodeURIComponent(userGuid);
        	}
        	SettingService.getRegistedNotiUrl(tmpParam).then(function (response) {
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
				}else if(response.status == 'SUCCESS'){
					var result = response.data;
					classifyResultCD(result);
					swal("조회완료", "GUID 조회가 완료되었습니다.", "success");
				}
        	});
        }
        
        vm.urlBalance = getRegistedNotiUrl;
        
        function getParameter(url){
        	var tmpUrl = url;
        	
        	if(tmpUrl == null || tmpUrl.length < 1 || tmpUrl == ""){
        		$scope.itemTranStatusDisabled = false;
        		setResultStatusMsg("ERROR","There is no url to regist");
        		return ;
        	}
        	if(vm.isAdmin){
	        	var dstMemGuid = vm.dstMemGuid;
	        	if(dstMemGuid == null || dstMemGuid.length < 1 || dstMemGuid == ""){
	        		$scope.itemTranStatusDisabled = false;
	        		setResultStatusMsg("ERROR","There is no guid");
	        		return ;
	        	}
	        	tmpUrl = "url="+encodeURIComponent(tmpUrl.trim())+"&reqDataMemGuid="+encodeURIComponent(dstMemGuid.trim());
        	}else{
        		var userGuid = $rootScope.globals.currentUser.superGuid;
        		tmpUrl = "url="+encodeURIComponent(tmpUrl.trim())+"&reqDataMemGuid="+encodeURIComponent(userGuid);
        	}
        	return tmpUrl; 
        }
        /**
         * @method getRegistedNotiUrl() 메서드를 통해 가져온 데이타를 분기 
         * */
    	function classifyResultCD(result){

    		if(result == null || result.length < 0){
    			return;
    		}
    		$scope.tranStatusRows = [];
    		$scope.payinListRows = [];
    		var data = result.noticeList;
    		var tCount = 0;
    		var pCount = 0;
    		
    		for(var i = 0 ; i < data.length ; i++){
    			if(data[i].msgCd == "TRNSCTN_ST_CHANGED"){
    				$scope.tranStatusRows.push(data[i]);
    				tCount++;
    			}else if(data[i].msgCd == "VIRTUAL_ACCOUNT_PAYIN"){
    				$scope.payinListRows.push(data[i]);
    				pCount++;
    			}
    		}
    		
    		$scope.isTranStatusMax = tCount > 1 ? true : false;
    		$scope.itemTranStatusDisabled = tCount > 1 ? true : false;
    		
    		$scope.isMax = pCount > 1 ? true : false;
    		$scope.itemDisabled = pCount > 1 ? true : false;
    		
    		$scope.tranStatusCount = tCount;
    		$scope.pCount = pCount;
    		
    	}
    	
    	/**
         * @method URL 테스트 API 
         * */
    	
    	function urlValidTest(){
    		if(vm.testValidUrl == null 
    				|| vm.testValidUrl.length < 0
    				|| vm.testValidUrl == ''){
    			setResultStatusMsg("ERROR","There is no url to test");
    			return;
    		}
    		
    		var tmpGuid = '';
    		if(vm.isAdmin){
        		var dstMemGuid = vm.dstMemGuid;
	        	if(dstMemGuid == null || dstMemGuid.length < 1 || dstMemGuid == ""){
	        		$scope.itemTranStatusDisabled = false;
	        		setResultStatusMsg("ERROR","There is no guid");
	        		return;
	        	}
	        	tmpGuid = "reqDataMemGuid="+encodeURIComponent(dstMemGuid);
        	}else{
        		var userGuid = $rootScope.globals.currentUser.superGuid;
        		tmpGuid = "reqDataMemGuid="+encodeURIComponent(userGuid);
        	}
    		
    		//TODO url에서 param 분리해서 쓰기 
    		var tmpStr = vm.testValidUrl.trim();
    		var array = tmpStr.split('?');
    		
    		if(array.length > 2){
    			setResultStatusMsg("ERROR","SyntaxError ");
    			return;
    		}
    		var host = array[0];
    		var param = array[1] != null ? array[1] : "";
    	
    		var tmpParam = tmpGuid+"&url="+encodeURIComponent(host)+"&param="+encodeURIComponent(param);
    	
    	 	SettingService.testValidUrl(tmpParam).then(function (response) {
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
				}else if(response.status == 'SUCCESS'){
					var result = response.data;
				}
        		setResultStatusForUrlValid(response);
        	});
    	}
    	
    	
    	//Guid 검색시 사용하는 소스
    	//allinfo & fullname = "" 
    	//  mem_name 의 fullname 은 암호회되어 저장이 되는데 운용이 가능할 것인가? 
    	
    	
    	/*vm.inquiryBalances = function(show){
			
    		vm.invalidParam = false;
			$log.debug("params:" + $httpParamSerializer(vm.notiForm));
			
			if(vm.notiForm.dstMemGuid == null || vm.notiForm.dstMemGuid == ''){
				return;
			}
			
			$scope.inquiryBalanceProcessing = true;
			if(show){
				var param = "fullname="  + vm.notiForm.dstMemGuid + "&page=1&limit=10";
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
						vm.invalidParam = true;
					}
					$scope.inquiryBalanceProcessing = false;
				});
			}
		}
    	
    	 function handleResponse(response){
 			if(response.status == 'ERROR'){
 				swal({
 				  title: $translate.instant('ERROR'),
 				  text: response.data.cdKey + ":" + response.data.cdDesc,
 				  type: "error",
 				  confirmButtonText: $translate.instant('btnOK')
 				});
 					
 				if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
 					$state.go('login');;
 					if (!$rootScope.$$phase) $rootScope.$apply();
 				}
 				return false;
 			}else if(response.status == 'SUCCESS'){
 				$log.debug("data:" + response.data);
 				var obj = Utils.getJsonObj(response.data);
 				
 				if(Utils.isUndefinedOrNull(obj.status)){
 					if(obj.status != "SUCCESS"){
 						swal({
 						  title: $translate.instant('ERROR'),
 						  text: obj.data.cdKey + ":" + obj.data.cdDesc,
 						  type: "error",
 						  confirmButtonText: $translate.instant('btnOK')
 						});
 						if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
 							$state.go('login');
 							if (!$rootScope.$$phase) $rootScope.$apply();
 						}
 					}
 					return false;
 				}else{
 					return true;
 				}
 			} 
 		}*/
    	
    	$scope.addRow = addRow;
    	$scope.registRow = registRow; 
    	$scope.removeRow = removeRow;
    	$scope.addPayInListRow = addPayInListRow; 
    	$scope.registPayInRow = registPayInRow; 
    	$scope.removePayInRow = removePayInRow; 
    	$scope.urlValidTest = urlValidTest;

		$scope.tempDebug = 'modules/settings/views/debug.html'+Utils.getExtraParams();;

		
    	
		$scope.dtOptions = { paging: false, searching: true , lengthChange: false, ordering: false, info: false, pagingType: "numbers"};
		
		$scope.dtOptionsContract = DTOptionsBuilder.newOptions()
		.withPaginationType('numbers')
		.withDisplayLength(10)
		.withOption('paging',false)
		.withOption('searching',false)
		.withOption('lengthChange',false)
		.withOption('ordering',true)
		.withOption('info',false)
		.withOption('pagingType',false)
		.withBootstrap();
		
		$scope.dtOptionsRoles = DTOptionsBuilder.newOptions()
		.withPaginationType('numbers')
		.withDisplayLength(10)
		.withOption('paging',false)
		.withOption('searching',false)
		.withOption('lengthChange',false)
		.withOption('ordering',true)
		.withOption('info',false)
		.withOption('pagingType',false)
		.withBootstrap()
        .withBootstrapOptions({
            TableTools: {
                classes: {
                    container: 'btn-group',
                    buttons: {
                        normal: 'btn btn-danger'
                    }
                }
            },
            ColVis: {
                classes: {
                    masterButton: 'btn btn-primary'
                }
            },
            pagination: {
                classes: {
                    ul: 'pagination pagination-sm'
                }
            }
        });
		
		
		$scope.categoryIdActive = 0;
		$scope.categoryActive = function (strValue) {
			if(strValue == $scope.categoryIdActive){
				return 'mnuSettingActive';
			}else{
				return 'show-cursor';
			}
		}
		
		$scope.styleArrowOpt = '';
		$scope.selectedView = '';
		$scope.categoryTitle = '';
		$scope.optTitle = '';
		
		vm.listValueByOptId =  {};
		var listValueByOptIdTemp = {};
		vm.optForm = {};
		$scope.changeOptValueStatus = false;
		$scope.msgSuccess = '';
		$scope.searchOpt = '';
		$scope.searchCat = '';
		vm.optForm.selectedOption = null;
		$scope.matchPass = false;
		$scope.msgConfirmKeyP = false;
		$scope.successKeyP = false;
		$scope.msgResult = '';
		var keyP = $rootScope.globals.currentUser.pkey;
		$scope.keyP = keyP.substring(0,10) + "***********" + keyP.substring(keyP.length - 10, keyP.length);
		
		vm.confirmKeyP = false;
		
		
		vm.submitChangeKeyP = function(){
			$scope.successKeyP = false;
			$scope.msgConfirmKeyP = false;
			$log.debug('submitChangeKeyP: ' + vm.confirmKeyP);
			//alert 창 띄워서 컨펌 받도록 수정 
			///$translate.instant('lblTmpNotiMsg');
			swal({
				   title: $translate.instant('VCNotiTitle'),
				   text: $translate.instant('lblKeyPComments'),
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",
				   confirmButtonText: $translate.instant('VCNotiYes'),
				   cancelButtonText: $translate.instant('VCNotiNo'),
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
					   SettingService.changeKeyP().then(function (response) {
							if(response.status == 'SUCCESS'){
								//keyP 중복 변경 방지 
								vm.confirmKeyP = false;
								var newKeyP = decParams(response.data.result,keyP);
								//$scope.msgResultKeyP = "SUCCESS, new KeyP: " + newKeyP;
								$scope.msgResultKeyP = "SUCCESS ,check the file downloaded";
								$scope.successKeyP = true;
								
								//TODO key 다운로드 지원 /2017.11.17  
								/*
								 * 2018.01.05 다운로드시  guid 확인 할 수 있도록 추가 
								 * */
								var fileText = "Guid : "+response.data.memGuid+" \r\n" +  "New keyP : " + newKeyP;
								var fileName = "keyP";
								Utils.saveToTxt(fileText, fileName);
								swal("", $translate.instant('lblKeyPSuccess'), "success");
								
							}else{
								$scope.msgResultKeyP = response.data.cdKey + ": " + response.data.cdDesc;
								$scope.msgConfirmKeyP = true;
							}
						})
				   } else {
				      swal("", $translate.instant('lblKeyPCancel'), "error");
				   }
				});
			
			
			///
			
			
			/*if(vm.confirmKeyP){
				SettingService.changeKeyP().then(function (response) {
					if(response.status == 'SUCCESS'){
						var newKeyP = decParams(response.data.result,keyP);
						//$scope.msgResultKeyP = "SUCCESS, new KeyP: " + newKeyP;
						$scope.msgResultKeyP = "SUCCESS ,check the file downloaded";
						$scope.successKeyP = true;
						
						
						//TODO key 다운로드 지원 
						
						 * 2017.11.17 by atlas 
						 * 
						var fileText = "new keyP : " + newKeyP;
						var fileName = "keyP";
						Utils.saveToTxt(fileText, fileName);
						
					}else{
						$scope.msgResultKeyP = response.data.cdKey + ": " + response.data.cdDesc;
						$scope.msgConfirmKeyP = true;
					}
				})
			}else{
				$scope.msgResultKeyP = "Please Confirm Change KeyP!!!";
				$scope.msgConfirmKeyP = true;
			}*/			
		}
		
		
		$scope.listAPIRoles = null;
		function getListAPIRoles(){
			$log.debug('listRoles: ');
			SettingService.getListAPIRoles().then(function (response) {
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
        		}else if(response.status == 'SUCCESS'){
        			var result = response.data;
        			$log.debug("listAPIRoles");
    				$scope.listAPIRoles = result.resultList;
				}
			})
		};
		
		$scope.listMemberRoles = null;
		function listMemberRoles(){
			$log.debug('listMemberRoles: ');
			SettingService.getListMemberRoles().then(function (response) {
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
				}else if(response.status == 'SUCCESS'){
					var result = response.data;
					$log.debug("listRoles");
					$scope.listMemberRoles = result.resultList;
				}
			})
		};
		
		$scope.tempMemRoleForm = 'modules/settings/views/memRoleForm.html'+Utils.getExtraParams();
		$scope.tempAssignRoleForm = 'modules/settings/views/assignRoleForm.html'+Utils.getExtraParams();

		$scope.loadDataForm = true;
		vm.initCreateMemRole  = function() {
			$log.debug('initMemRoleForm: ' + $scope.isCollapsed);
			$scope.isCollapsed = ($scope.isCollapsed) ? false : true;
			$scope.loadDataForm = false;
			$scope.isCollapsedAssign = false;
		};
		
		$scope.successCreateRole = 0;
		vm.submitMemRoleForm = function() {
			$scope.successCreateRole = false;
			$log.debug('memberRole: ' + JSON.stringify(vm.memRole));
			$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.memRole));
			SettingService.createMemRole($httpParamSerializer(vm.memRole)).then(function (response) {
				$log.debug('response.status: ' + response.status);
				$log.debug('response: ' + JSON.stringify(response));
				if(response.status == 'SUCCESS'){
					$scope.msgResult = response.data.result.role;
					$scope.successCreateRole = 1;
					$scope.isCollapsed = false;// close searchForm
				}else{
					$scope.isCollapsed = true;
					$scope.msgResult = response.data.cdKey + ": " + response.data.cdDesc;
					$scope.successCreateRole = 2;
				}
			})
		};
		
		vm.initAssignRole  = function() {
			$log.debug('initAssignRole: ' + $scope.isCollapsedAssign);
			$scope.isCollapsedAssign = ($scope.isCollapsedAssign) ? false : true;
			$scope.loadDataForm = false;
			$scope.isCollapsed = false;
			SettingService.getListRoles().then(function (response) {
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
					//Utils.getErrorHanler(response.data.cdKey , response.data.cdDesc);
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
				}else if(response.status == 'SUCCESS'){
					var result = response.data;
					$log.debug("listRoles");
					$scope.listRoles = result.resultList;
				}
			})
			
			$scope.aclOptions = [0,100,200,300,400,500,600,700,800,900,1000];
		};
		
		$scope.successAssignRole = 0;
		vm.submitAssignRoleForm = function() {
			$scope.isCollapsed = false;
			$scope.successAssignRole = false;
			$log.debug('memberRole: ' + JSON.stringify(vm.memRole));
			$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.memRole));
			SettingService.assignMemRole($httpParamSerializer(vm.memRole)).then(function (response) {
				$log.debug('response.status: ' + response.status);
				$log.debug('response: ' + JSON.stringify(response));
				if(response.status == 'SUCCESS'){
					$scope.msgResult = "Assign GUID: " + vm.memRole.dstMemGuid + "to role: " +  response.data.result.role + " successful";
					$scope.successAssignRole = 1;
					$scope.isCollapsedAssign = false;// close searchForm
				}else{
					$scope.isCollapsedAssign = true;
					$scope.msgResult = response.data.cdKey + ": " + response.data.cdDesc;
					$scope.successAssignRole = 2;
				}
			})
		};
		
		vm.removeMemRoles = function(role){
			alert("removeMemRoles" + JSON.stringify(role));
		}
		
		vm.editMemRoles = function(role){
			alert("editMemRoles" + JSON.stringify(role));
		}
		
		vm.removeAPIRoles = function(role){
			alert("removeAPIRoles" + JSON.stringify(role));
		}
		
		vm.editAPIRoles = function(role){
			alert("editAPIRoles" + JSON.stringify(role));
		}
		
		vm.submitChangePass = function(){
			$log.debug('submitChangePass: ' + JSON.stringify(vm.mForm));
			$scope.matchPass = false;
			$scope.dataLoading = true;
			if(vm.mForm.newPassword != vm.mForm.renewPassword){
				$scope.matchPass = true;
				$scope.msgResult = 'Passwords don\'t match';
			}else{
				vm.mForm.oldPassowrd = encodeURIComponent(vm.mForm.oldPassowrd);
				vm.mForm.newPassowrd = encodeURIComponent(vm.mForm.newPassowrd);
				vm.mForm.renewPassword = encodeURIComponent(vm.mForm.renewPassword);
				
				SettingService.changePass($httpParamSerializer(vm.mForm)).then(function (response) {
					if(response.status == 'SUCCESS'){
						$scope.successPass = true;
						$scope.msgResult = "Password changed, success";
						
						// TODO 동작안함
						swal({
		                  	  title: $translate.instant('SUCCESS'),
		                  	  text: "Password changed, success",
		                  	  type: "succcess",
		                  	  confirmButtonText: $translate.instant('btnOK')
		                  	});
							
		        			$state.go('login');
		        		/////////////////////////
					}else{
						$scope.matchPass = true;
						$scope.msgResult = response.data.cdKey + ": " + response.data.cdDesc;
					}
				})
			}
		}
		
		$scope.listCurrency = [{"accmTp" : "","dstCrrncy" : "", "srcCrrncy" : "USD"},
		                       {"accmTp" : "","dstCrrncy" : "", "srcCrrncy" : "KRW"},
		                       {"accmTp" : "","dstCrrncy" : "", "srcCrrncy" : "JPY"},
		                       {"accmTp" : "","dstCrrncy" : "", "srcCrrncy" : "CNY"}
		                       ];
		$scope.accmTpList = ["LAST_MONTH", "LAST_WEEK","MONTHLY_ACCUM"];
		$scope.currencyBaseList = ["XE", "PAYGATE"];
		$scope.exchangeTypeList = ["ALL2ALL", "E2E"];
		
		$scope.showCurrencyContract = false;
		$scope.showMsgContract = false;
		vm.submitCreateContract = function(){
			$log.debug('submitCreateContract: ' + JSON.stringify(vm.memContract));
			SettingService.createContract($httpParamSerializer(vm.memContract)).then(function (response) {
				if(response.status == 'SUCCESS'){
					$log.debug('response: ' + JSON.stringify(response));
					$scope.showCurrencyContract = true;
					$scope.msgResultContract = "SUCCESS";
					vm.memContract = angular.extend(vm.memContract, response.data.result)
					//vm.memContract.srcMemGuid = vm.memContract.srcMemGuid
					//vm.memContract = response.data.result;
					$log.debug('vm.memContract: ' + JSON.stringify(vm.memContract));
					listContractCurrency();
				}else{
					$scope.msgResultContract = response.data.cdKey + ": " + response.data.cdDesc;
					$scope.showMsgContract = true;
					$scope.showCurrencyContract = false;
					$scope.showCurrencyRate = false;
				}
			})
			
		}
		
		$scope.showMsgCurrency = 0;
		vm.submitCreateCurrencyContract  = function(){
			var currency = '{"currency": ['+JSON.stringify(vm.currency)+']}';
			var p = "contractId="+vm.memContract.id+"&currency=" + currency;
			$log.debug('submitCreateCurrencyContract: ' + p);
			SettingService.createCurrencyContract(p).then(function (response) {
				if(response.status == 'SUCCESS'){
					$log.debug('response: ' + JSON.stringify(response));
					listContractCurrency();
					$scope.showMsgCurrency = 2;
					$scope.msgResultCurrency = response.data.result.srcCrrncy + ": " + response.data.result.dstCrrncy;
				}else{
					$scope.msgResultCurrency = response.data.cdKey + ": " + response.data.cdDesc;
					$scope.showMsgCurrency = 1;
					$scope.showCurrencyRate = false;
				}
			})
			
		}
		$scope.showCurrencyRate = false;
		$scope.currencyRateActive = null;
		vm.setCurrencyRate  = function(currencyRate){
			$log.debug('setCurrencyRate: ' + JSON.stringify(currencyRate));
			$scope.showCurrencyRate = true;
			$scope.currencyRateTitle = " srcCrrncy: " + currencyRate.srcCrrncy + " | " + "dstCrrncy: " + currencyRate.dstCrrncy;
			$scope.currencyRateActive = currencyRate.id;
			listRateCurrency(currencyRate.currencyContractId);
		}
		
		vm.editCurrencyRate = function(currencyRate){
			vm.currencyRate = currencyRate;
			vm.currencyRate.crrncyBase = $scope.currencyBaseList[0];//TODO: need server response
		}
		
		$scope.showMsgRateCurrency = 0;
		vm.submitCurrencyRate = function(){
			$log.debug('submitCurrencyRate: ' + JSON.stringify(vm.currencyRate));
			$log.debug('submitCurrencyRate: ' + $httpParamSerializer(vm.currencyRate));
			
			vm.currencyRate.contractCurrencyId = $scope.contractCurrencyId;
			vm.currencyRate.marginTp = "percent";
			var rate = '{"rates": ['+JSON.stringify(vm.currencyRate)+']}';
			var p = "srcMemGuid="+vm.memContract.srcMemGuid+"&reviewSt=APPROVED&crrncyBase=" + vm.currencyRate.crrncyBase; 
				p += "&rates=" + rate;
			
			$log.debug('submitCurrencyRate: p:' + p);
			SettingService.createRateCurrency(p).then(function (response) {
				if(response.status == 'SUCCESS'){
					$log.debug('response: ' + JSON.stringify(response));
					listRateCurrency($scope.contractCurrencyId);
					$scope.showMsgRateCurrency = 2;
					$scope.msgResultRateCurrency = "SUCCESS"
				}else{
					$scope.msgResultRateCurrency = response.data.cdKey + ": " + response.data.cdDesc;
					$scope.showMsgRateCurrency = 1;
				}
			})
		}
		
		$scope.keyStatus ='';
		
		$scope.getMemberDetail = function(memberDetail) {
			//create contract request parameter is: srcMemGuid, not have dstMemGuid --> fake dstMemGuid
			
			//TODO guid 업체명 등 그리고 API 연동 작업 . 
			console.log(memberDetail);
			console.log(memberDetail.dstMemGuid);
			var params = 'dstMemGuid='+memberDetail.dstMemGuid
			
			
			SettingService.checkStatusOfKeyP(params).then(function (response) {
				console.log(response);
				if(response.status == 'ERROR'){
					$scope.keyStatus = '';
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
				}else if(response.status == 'SUCCESS'){
					console.log(response.data.result);
					if(response.data.result == true){
						$scope.keyStatus = 'ACTIVATED';
					}else if(response.data.result == false){
						$scope.keyStatus = 'INACTIVATED';
					}
					
					if (!$rootScope.$$phase) $rootScope.$apply();
				}
			})
			
			
			
			//  해당  guid 정보를 가져오는 부분 아이디 관련 이름 관련 등등 ... 
			getListMember(1, 20, $httpParamSerializer(memberDetail));
			
			
			
			
			
			
			
			/*$log.debug('p memberDetail: ' + JSON.stringify(memberDetail));
			var modalInstance = $uibModal.open({
				animation :true,
				templateUrl : 'modules/member/views/memberDetail.html'+Utils.getExtraParams(),
				controller : 'MemberDetailController',
				size : 'lg',
				backdrop : 'false',
				keyboard : true,
				windowClass : 'zindex',
				resolve : {
					memberDetail : function() {
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
			});*/
		};
		
		function getListMember(page, limit, paramStr) {
			$log.debug('start getListMember: ' + new Date());
			/*vm.dataLoading1 = true;
			vm.dataLoading2 = true;*/
			console.log(paramStr);
			MemberService
					.getListMember(page, limit, paramStr)
					.then(
							function(response) {
								$log.debug(response.status);
								if (response.status == 'ERROR') {
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
								} else if (response.status == 'SUCCESS') {
									$log.debug("data:" + response.data);
									var obj = Utils.getJsonObj(response.data);

									if (Utils.isUndefinedOrNull(obj.status)) {
										if (obj.status == "ERROR") {
											
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
									} else {
										$log.debug("resultList:");
										$log.debug(obj.resultList);
										vm.content = obj.resultList;

										// pagination config
										//  페이지 9999 개 제한으로 주석 해놓음 
//										vm.totalItems = $scope.totalMember.grandTotal;
										//page limit 
										//vm.totalItems = $scope.totalMember.grandTotal > 9999 ? 9999 : $scope.totalMember.grandTotal; 
										
										//vm.itemsPerPage = vm.viewby;
										/*$log.debug("totalItems:"
												+ vm.totalItems);
										$log.debug("itemsPerPage:"
												+ vm.itemsPerPage);
										vm.dataTablesInfo = 'Showing '
												+ ((vm.currentPage - 1)
														* vm.itemsPerPage + 1)
												+ ' to '
												+ ((vm.currentPage
														* vm.itemsPerPage > vm.totalItems) ? vm.totalItems
														: vm.currentPage
																* vm.itemsPerPage)
												+ ' of ' + vm.totalItems
												+ ' entries';*/

									}
								}
//								vm.dataLoading1 = false;
//								vm.dataLoading2 = false;
							});

		};

		
		
		
		function listRateCurrency(contractCurrencyId){
			///member/listContractCurrency
			//$httpParamSerializer(vm.memContract)
			$scope.contractCurrencyId = contractCurrencyId;
			var p = "srcMemGuid="+vm.memContract.srcMemGuid+"&contractCurrencyId=" + contractCurrencyId;
			SettingService.listRateCurrency(p).then(function (response) {
				if(response.status == 'SUCCESS'){
					$log.debug('response: ' + JSON.stringify(response));
					$scope.listRateCurrency = response.data.result;
				}else{
					$scope.msgResultKeyP = response.data.cdKey + ": " + response.data.cdDesc;
					$scope.msgConfirmKeyP = true;
				}
			})
		}
		
		function listContractCurrency(){
			///member/listContractCurrency
			//$httpParamSerializer(vm.memContract)
			var p = "srcMemGuid=" + vm.memContract.srcMemGuid;
			SettingService.listContractCurrency(p).then(function (response) {
				if(response.status == 'SUCCESS'){
					$log.debug('response: ' + JSON.stringify(response));
					$scope.listContractCurrency = response.data.result;
				}else{
					$scope.msgResultCurrency = response.data.cdKey + ": " + response.data.cdDesc;
				}
			})
		}
		
		
		vm.submitOptValue = function(){
			$log.debug('submitOptValue: ' + JSON.stringify(vm.listValueByOptId));
			$log.debug('listValueByOptIdTemp: ' + JSON.stringify(listValueByOptIdTemp));
			
			angular.forEach(vm.listValueByOptId, function(objValue, key) {
				if((objValue.optValId ==  listValueByOptIdTemp[key].optValId) && (objValue.value !=  listValueByOptIdTemp[key].value)){
					
					$log.debug('submitOptValue:update ' + JSON.stringify(objValue));
					
					var paramStr = "optId=" + objValue.optId + "&listValue=" + objValue.listValue + "&value=" + objValue.value + "&listValueGrp=" + objValue.listValueGrp;
					var method = "POST";
					
					SettingService.optValues(paramStr, method).then(function (response) {
						if(response.status == 'SUCCESS'){
		        			var result = response.data;
		        			if(result.result.optValId != ""){
		        				$log.debug("changeOptValueStatus");
		        				$scope.changeOptValueStatus = true;
		        			}
						}
						$scope.msgSuccess = 'Update ' + result.result.listValue;
						$scope.dataValueLoading = false;
					})
					
				}else{
					$log.debug('submitOptValue:skip ' + JSON.stringify(objValue));
				}
			});
		}
		
		vm.changeRadioValue = function(objValue) {
			$scope.dataValueLoading = true;
			$log.debug('changeRadioValue: ' + JSON.stringify(objValue));
			if(objValue != null){
				var paramStr = "optValId=" + objValue.optValId + "&listValue=" + objValue.listValue + "&listValueGrp=" + objValue.listValueGrp;
				var method = "PUT";
				SettingService.optValues(paramStr, method).then(function (response) {
					if(response.status == 'SUCCESS'){
	        			var result = response.data;
	        			if(result.result.optValId != ""){
	        				$log.debug("changeOptValueStatus");
	        				$scope.changeOptValueStatus = true;
	        			}
					}
					$scope.msgSuccess = 'Update ' + result.result.listValue;
					$scope.dataValueLoading = false;
				});
			}
		}
		
		vm.changeSelectOptValue = function() {
			$scope.dataValueLoading = true;
			var objValue = vm.optForm.selectedOption;
			$log.debug('changeSelectOptValue: ' + JSON.stringify(objValue));
			if(objValue != null){
				var paramStr = "optValId=" + objValue.optValId + "&listValue=" + objValue.listValue + "&listValueGrp=" + objValue.listValueGrp;
				var method = "PUT";
				SettingService.optValues(paramStr, method).then(function (response) {
					if(response.status == 'SUCCESS'){
	        			var result = response.data;
	        			if(result.result.optValId != ""){
	        				$log.debug("changeOptValueStatus");
	        				$scope.changeOptValueStatus = true;
	        			}
					}
					$scope.msgSuccess = 'Update ' + result.result.listValue;
					$scope.dataValueLoading = false;
				});
			}
		}
		
		
		vm.changeOptValue = function(objValue) {
			$scope.changeOptValueStatus = false;
			$scope.dataValueLoading = true;
			$log.debug('changeOptValue:objValue: ' + JSON.stringify(objValue));
			var method = "", paramStr = "";
			if(objValue.checked){
				paramStr = "optId=" + objValue.optId + "&listValue=" + objValue.listValue + "&listValueGrp=" + objValue.listValueGrp;
				method = "POST";
				$scope.msgSuccess = 'Update ' + objValue.listValue;
			}else{
				paramStr = "optValId=" + objValue.optValId;
				method = "DELETE";
				$scope.msgSuccess = 'Remove ' + objValue.listValue;
			}
			
			SettingService.optValues(paramStr, method).then(function (response) {
				if(response.status == 'SUCCESS'){
        			var result = response.data;
        			$log.debug("changeOptValue:" + method + "---" + JSON.stringify(result));
        			$log.debug("changeOptValue:" + method + "---" + result.result.optValId);
        			if(result.result.optValId != ""){
        				$log.debug("changeOptValueStatus:");
        				$scope.changeOptValueStatus = true;
        			}
				}
				$scope.dataValueLoading = false;
			});
		};
	      
		vm.getValueByOptId = function(opt, index){
			$scope.dataValueLoading = true;
			$scope.changeOptValueStatus = false;
			vm.listValueByOptId = {};
			listValueByOptIdTemp = null;
			$log.debug('getValueByOptId:index' + index);
			var marginTop = '';
			var plusIndex = 40;
			if(index == 0){
				marginTop = 20;
			} else if(index >= 1){
				marginTop = (plusIndex*index) + 15;
			}
			$scope.styleArrowOpt = 'margin-top:'+marginTop+'px';
			$log.debug('getValueByOptId:listTp' + opt.listTp);
			$scope.selectedView = opt.listTp;
			$scope.optTitle = opt.optNm;
			
			var paramStr = '&categoryId='+opt.categoryId;
			paramStr += '&optId='+opt.optId;
			SettingService.optValues(paramStr, "GET").then(function (response) {
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
        		}else if(response.status == 'SUCCESS'){
        			var resultList = response.data.resultList;
        			var listValueByOptId = [];
        			angular.forEach(opt.availableCodes, function(value, key) {
        				var objValue = findValues(resultList, value.cdKey);
        				$log.debug('availableCodes:objValue::' + objValue);
        				if(objValue == null){
        					objValue = { optValId: opt.categoryId, optId: opt.optId, listValue: value.cdKey, listValueGrp: value.grpKey, role: "", checked: false};
        				}else{
        					vm.optForm.selectedOption = objValue;
        				}
        				listValueByOptId.push(objValue);
					});
        			
        			$log.debug('listValueByOptId: ' + JSON.stringify(listValueByOptId));
        			vm.listValueByOptId = listValueByOptId;
        			listValueByOptIdTemp = angular.copy(listValueByOptId);
				}else{
					$scope.showErrorStatus = true;
				}
				$scope.dataValueLoading = false;				
            });
			
		}
		
		function findValues(listObjValue, cdKey){
			var v = null;
			angular.forEach(listObjValue, function(value, key) {
				if(value.listValue == cdKey){
					v = value;
					angular.extend(v, {checked: true});
				}
			});
			return v;
		}
		
		vm.getOptionByCatId = function(category){
			vm.options = null;
			vm.listValueByOptId = null;
			$scope.dataOptionLoading = true;
			$scope.changeOptValueStatus = false;
			$scope.styleArrowOpt = '';
			$scope.selectedView = '';
			$scope.optTitle = '';
			$scope.categoryTitle = category.categoryNm;
			$log.debug('getOptionByCatId:' + category.categoryId);
			$scope.categoryIdActive = category.categoryId;
			var paramStr = '&categoryId='+category.categoryId;
			SettingService.getOption(paramStr).then(function (response) {
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
        		}else if(response.status == 'SUCCESS'){
        			vm.options = response.data.resultList;
				}else{
					$scope.showErrorStatus = true;
				}
				$scope.dataOptionLoading = false;				
            });
		}
		
		
		
		
		function getCategory() {
			$log.debug('getCategory');
			$scope.dataLoading = true;
			$scope.changeOptValueStatus = false;
			SettingService.getCategory().then(function (response) {
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
        		}else if(response.status == 'SUCCESS'){
        			vm.categories = '';
        			vm.categories = response.data.resultList;
        			console.log(vm.categories);
        			
				}else{
					$scope.showErrorStatus = true;
				}
				$scope.dataLoading = false;				
            });
		}
		
    }
    
    function SeyfertKeyPController($scope, $rootScope, $state,$translate){
    	console.log("11111");
    }
    
    
})();

