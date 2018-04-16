(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope','$state', '$translate' , 'AuthenticationService', '$log', 'localStorageService' , '$templateCache' ,'$q'];
    function LoginController($rootScope, $state , $translate, AuthenticationService, $log, localStorageService ,$templateCache ,$q) {
        
    	console.log("login page");
    	
    	// when you're in login page, all templates will be initialized.
    	templateRemoveAll();
    	
//    	$templateCache.removeAll();
    	var vm = this;

        vm.login = login;
        vm.renewPassword = renewPassword;
        vm.isRenewPassword =  false;
        vm.pkey = null;
        vm.superGuid = null;
        
       /* 
        * (function initController() {
			vm.dataLoading = true;
        	AuthenticationService.clearCredentials();
            
            AuthenticationService.init().then(function (response) {
            	console.log(response);
            	if(response == 'ERROR'){
            		swal({
                	  title: $translate.instant('WARNING'),
                	  text: $translate.instant('ERR_CONNECT'),
                	  type: "warning",
                	  confirmButtonText: $translate.instant('btnOK')
                	});
            	}else{
            		$rootScope.initData = response;
					vm.dataLoading = false;
            	}
            });
            
        })();
*/
        function renewPassword() {
        	vm.dataLoading = true;        	
        	AuthenticationService.renewPassword(vm.oldPassword, vm.newPassword).then(function (response) {        		
        		if (response.status == "SUCCESS") {
        			vm.isRenewPassword =  false;
        			swal({
                	  title: $translate.instant('SUCCESS'),
                	  text: "Password changed, please login",
                	  type: "success",
                	  confirmButtonText: $translate.instant('btnOK')
                	});
        			$state.go('login');
        		}else if (response.data.cdKey == "PASSWORD_IN_HISTORY") {
        			swal({
                  	  title: $translate.instant('ERROR'),
                  	  text: response.data.cdKey + ": Password already used in history",
                  	  type: "error",
                  	  confirmButtonText: $translate.instant('btnOK')
                  	});
        		}else if (response.data.cdKey == "WRONG_PWD_CHECK_POLICY") {
        			swal({
                  	  title: $translate.instant('ERROR'),
                  	  text: response.data.cdKey + ": New password should be compliant with the password policy",
                  	  type: "error",
                  	  confirmButtonText: $translate.instant('btnOK')
                  	});
        		}else if (response.data.cdKey == "ACCOUNT_LOCKED") {
        			swal({
                  	  title: $translate.instant('ERROR'),
                  	  text: response.data.cdKey + ": Account locked, please wait until the end of the lockout or contact the customer service",
                  	  type: "error",
                  	  confirmButtonText: $translate.instant('btnOK')
                  	});
        		}else{
        			swal({
                    	  title: $translate.instant('ERROR'),
                    	  text: "Wrong login / Password, please try again",
                    	  type: "error",
                    	  confirmButtonText: $translate.instant('btnOK')
                    	});
        		}
        		vm.dataLoading = false;
        	});
        };
        
        /**
         * SUI-106 added by atlas 
         * */
      function getTmpGuidAndTmpKeyP(){
    	   return $q(function(resolve,reject){
    		   AuthenticationService.clearCredentials();
               AuthenticationService.init().then(function (response) {
               	console.log(response);
               	if(response == 'ERROR'){
               		reject();
               	}else{
               		$rootScope.initData = response;
               		resolve();
               	}
               }); 
    	   });
       }
        
       function login() {
        	vm.dataLoading = true;
        	var promise =  getTmpGuidAndTmpKeyP();
        	promise.then(function(value) {
        		var keyB = generatKey(64);
            	vm.username = vm.username.trim();
            	vm.password = vm.password.trim();
            	getKeysExchange(vm.username , vm.password ,keyB);
        	}, function(reason) {
        		swal({
                 	  title: $translate.instant('WARNING'),
                 	  text: $translate.instant('ERR_CONNECT'),
                 	  type: "warning",
                 	  confirmButtonText: $translate.instant('btnOK')
                 	});
        	})
        };
        
        function getKeysExchange(username , password , _keyB){
        	var keyB = _keyB;
        	AuthenticationService.getKeysExchange(username).then(function (response) {
				if (response.status == "SUCCESS") {
					$log.debug("publicKey:" + JSON.stringify(response.publicKey));
					new cryptico.getKeys(response.publicKey, function(receivedKeys) {
		        		cryptico.encrypt(keyB, receivedKeys, function(enc_keyB) {
		        			AuthenticationService.putKeysExchange(username,enc_keyB).then(function (response) {
								if (response.status == "SUCCESS") {
									cryptico.encryptAes(password, keyB, function(encPassword) {
										AuthenticationService.sendEncPassword(username,encPassword).then(function (response) {
											if (response.status == "SUCCESS") {
												cryptico.decryptAes(response.signature, keyB, function(decSignature) {
													AuthenticationService.getTmpLoginKeyp(decSignature).then(function (response) {
														if (response.status == "SUCCESS") {
															
															AuthenticationService.decryptAndStoreTmpCredentials(username,password,response,keyB);
															var currentPage = localStorageService.get('currentPage');
															if(currentPage == null || currentPage == '' || currentPage == 'login'){
																currentPage = 'index.dashboard';
														 	}
															$state.go(currentPage);
										                	if (!$rootScope.$$phase) $rootScope.$apply();
														}else{
															$log.debug("err: getTmpLoginKeyp:" + JSON.stringify(response));
															vm.dataLoading = false;
															swal({
										                    	  title: $translate.instant('ERROR'),
										                    	  text: response.data.cdKey + ": " + response.data.cdDesc,
										                    	  type: "error",
										                    	  confirmButtonText: $translate.instant('btnOK')
										                    	});
														}
													});
												});
											}else if (response.status == "PASSWORD_EXPIRED" || response.status == "REQUIRE_INIT_PWD") {
												vm.dataLoading = false;
												vm.isRenewPassword = true;
												swal({
							                    	  title: $translate.instant('WARNING'),
							                    	  text: "PASSWORD_EXPIRED",
							                    	  type: "warning",
							                    	  confirmButtonText: $translate.instant('btnOK')
							                    	});
												cryptico.decryptAes(response.encrLimitedGuid, keyB, function(decrGuid) {
													cryptico.decryptAes(response.encrLimitedKeyp, keyB, function(decrKeyp) {
														$rootScope.globals = {
									                        currentUser: {
									                            username: null,
									                            authdata: null,
									                            superGuid: decrGuid,
									                            pkey: decrKeyp,
									                            isAdmin: null,
									                        }
									                    };
													});
												});
												
												
											}else{
												vm.dataLoading = false;
												$log.debug("err: sendEncPassword:" + JSON.stringify(response));
												swal({
							                    	  title: $translate.instant('ERROR'),
							                    	  text: response.data.cdKey + ": " + response.data.cdDesc,
							                    	  type: "error",
							                    	  confirmButtonText: $translate.instant('btnOK')
							                    	});
											}
										});
						        	});
								}else{
									vm.dataLoading = false;
									$log.debug("err: putKeysExchange:" + JSON.stringify(response));
									swal({
				                    	  title: $translate.instant('ERROR'),
				                    	  text: response.data.cdKey + ": " + response.data.cdDesc,
				                    	  type: "error",
				                    	  confirmButtonText: $translate.instant('btnOK')
				                    	});
								} 
							});
		        		});
		        	});
				}else{
					vm.dataLoading = false;
					$log.debug("err: getKeysExchange:" + JSON.stringify(response));
					
					if(response.data.cdKey == 'SESSION_EXPIRED'){
						$state.go($state.current, {}, {reload: true});
					}
				} 
        	});
        
        
        };
        
        vm.getPreviousAdmin = function(){
    		var HOST_URL = '';
    		if (window.location.toString().indexOf("file://") != -1) {
    			HOST_URL = 'https://dev5.paygate.net/'; 
    		}else if(window.location.toString().indexOf("localhost") != -1){
    			HOST_URL = "http://localhost/web/";
    		}else{
    			HOST_URL = window.location.origin + "/" ; 
    		}
    		var url = HOST_URL + "AdminDashboard/login.html"+"?redirectFrom=newAdmin";
    		
    	
    		window.open(url);
    	}
    	
        
        function templateRemoveAll(){
        	console.log("remove cache");
        	
        	$templateCache.remove('modules/dashboard/views/monitoring.html');
        	$templateCache.remove('modules/dashboard/views/dashboard.html');
        	$templateCache.remove('modules/dashboard/views/dashboardChart.html');
        	$templateCache.remove('modules/dashboard/views/notice.html');
        	$templateCache.remove('modules/dashboard/views/noticeForm.html');
        	$templateCache.remove('modules/dashboard/views/statistics.html');
        	
        	$templateCache.remove('modules/transaction/views/searchForm.html');
        	$templateCache.remove('modules/transaction/views/transaction.html');
        	$templateCache.remove('modules/transaction/views/transactionChart.html');
        	$templateCache.remove('modules/transaction/views/transactionDetail.html');
        	

        	$templateCache.remove('modules/seyfertWithdraw/views/seyfertWithdraw.html');
        	
        	$templateCache.remove('modules/crossBorderRemit/views/remit.html');
        	$templateCache.remove('modules/crossBorderRemit/views/step_one.html');
        	$templateCache.remove('modules/crossBorderRemit/views/step_two.html');
        	
        	$templateCache.remove('modules/tools/views/smsService.html');
        	$templateCache.remove('modules/tools/views/chargeAccount.html');
        	$templateCache.remove('modules/tools/views/currencyExchange.html');
        	
        	$templateCache.remove('modules/settings/views/setting.html');
        	$templateCache.remove('modules/settings/views/account.html');
        	$templateCache.remove('modules/settings/views/api.html');
        	$templateCache.remove('modules/settings/views/assignRoleForm.html');
        	$templateCache.remove('modules/settings/views/contract.html');
        	$templateCache.remove('modules/settings/views/general.html');
        	$templateCache.remove('modules/settings/views/memRoleForm.html');
        	$templateCache.remove('modules/settings/views/noti.html');
        	$templateCache.remove('modules/settings/views/options.html');
        	$templateCache.remove('modules/settings/views/roles.html');
        	
        	$templateCache.remove('modules/lecture/views/lecture.html');
        	$templateCache.remove('modules/lecture/views/addForm.html');
        	
        	$templateCache.remove('modules/authentication/views/login.html');
        	
        	$templateCache.remove('modules/seyfertAccounting/views/seyfertAllAccounting.html');
        	//added by dongju
        	$templateCache.remove('modules/seyfertAccounting/views/commission.html');
        	$templateCache.remove('modules/seyfertAccounting/views/commissionDetail.html');
        	
        	$templateCache.remove('modules/seyfertAccounting/views/deposit.html');
        	$templateCache.remove('modules/seyfertAccounting/views/depositDetail.html');
        	$templateCache.remove('modules/seyfertAccounting/views/depositMember.html');

        	$templateCache.remove('modules/seyfertAccounting/views/settlement.html');
        	$templateCache.remove('modules/seyfertAccounting/views/settlementDetail.html');
        	$templateCache.remove('modules/seyfertAccounting/views/settlementPopUp.html');
        	$templateCache.remove('modules/seyfertAccounting/views/sttmntInputAmtPopUp.html');
        	$templateCache.remove('modules/seyfertAccounting/views/sttmntInputFeePopUp.html');
        	
        	
        	$templateCache.remove('modules/member/views/member.html');
        	$templateCache.remove('modules/member/views/memberDetail.html');
        	
        	$templateCache.remove('modules/member/views/assignBank.html');
        	$templateCache.remove('modules/member/views/assignLogin.html');
        	$templateCache.remove('modules/member/views/assignVirtual.html');
        	$templateCache.remove('modules/member/views/changeStatus.html');
        	$templateCache.remove('modules/member/views/createMember.html');
        	$templateCache.remove('modules/member/views/memberChart.html');
        	$templateCache.remove('modules/member/views/resetPassword.html');
        	$templateCache.remove('modules/member/views/searchForm.html');
        	$templateCache.remove('modules/member/views/statistics.html');
        	
        }
    }
})();