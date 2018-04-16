//controllers.js

(function() {
	'use strict';

	angular.module('inspinia')
			.controller('MemberController', MemberController)
			.controller('MemberDetailController', MemberDetailController)
			.controller('MemberBlockController', MemberBlockController)
			.controller('ChangeStatusController', ChangeStatusController);

	MemberController.$inject = [ '$scope', '$rootScope', '$state',
			'$translate', 'MemberService', 'Utils', '$log', '$timeout',
			'$uibModal', '$sce', 'localStorageService', '$httpParamSerializer',
			'DTOptionsBuilder', 'DTColumnDefBuilder', '$filter' ];

	
	function MemberController($scope, $rootScope, $state, $translate,
			MemberService, Utils, $log, $timeout, $uibModal, $sce,
			localStorageService, $httpParamSerializer, DTOptionsBuilder,
			DTColumnDefBuilder, $filter) {
		var vm = this;
		var animationsEnabled = true;
		var timeListMemberToday;
		var sizeModal = 'lg';
		var opValidate;
		$scope.edit = false;
		if ($rootScope.globals.currentUser.isAdmin) {
			$scope.edit = true;
		}


		vm.isAdmin = $rootScope.globals.currentUser.isAdmin;

		//Utils.setModalInstance($uibModal);

		$scope.listLang = [ {
			name : "Korean",
			value : "ko"
		}, {
			name : "English",
			value : "en"
		} ];

		var limit = 20;
		var limitBlockedMemberList = 10000;

		//		$scope.tempTabCreateMember = 'modules/member/views/createMember.html'+Utils.getExtraParams();
		$scope.tempTabCreateMember = 'modules/member/views/createMemberFrame.html'+Utils.getExtraParams();

		$scope.tempTabStatistics = 'modules/member/views/statistics.html'+Utils.getExtraParams();
		$scope.tempTabAssignLogin = 'modules/member/views/assignLogin.html'+Utils.getExtraParams();
		$scope.tempTabAssignVirtual = 'modules/member/views/assignVirtual.html'+Utils.getExtraParams();
		$scope.tempTabAssignBank = 'modules/member/views/assignBank.html'+Utils.getExtraParams();
		$scope.tempMemberChart = 'modules/member/views/memberChart.html'+Utils.getExtraParams();
		$scope.tempResetPassword = 'modules/member/views/resetPassword.html'+Utils.getExtraParams();
		$scope.tempWithdrawalBlockManagement = 'modules/member/views/withdrawalBlockManagement.html'+Utils.getExtraParams();

		$scope.showError = false;
		$scope.showErrorStatus = false;
		$scope.showErrorChart = false;
		$scope.dataChartLoading = false;
		$scope.dataLoading1 = false;
		$scope.dataLoading2 = false;
		$scope.dataLoading3 = false;
		$scope.dataLoading4 = false;

		$scope.createMemberSuccess = false;
		$scope.assignLoginSuccess = false;
		$scope.assignVirtualSuccess = false;
		$scope.resetPasswordSuccess = false;
		$scope.assignBankSuccess = false;
		// 통계성 API 주석처리로 인한 grandTotal  default 9999 로 수정 .
		$scope.totalMember = {
			last24Hrs : 0,
			lastWeek : 0,
			grandTotal : 9999
		};

		$scope.blockedMemberTotalMember = {
				last24Hrs : 0,
				lastWeek : 0,
				grandTotal : 9999
			};


		vm.content = [];
		vm.maxSize = 5;
		vm.totalItems = 0;

		vm.currentPage = 1;
		vm.optionsViewBy = [ '20', '30', '50' ];

		//Member account blocked  related. seperated because two data list on same page.
		vm.blockedMemberContents = [];
		vm.blockedMemberTotalItems = 0;
		vm.blockedMemberMaxSize = 5;
		vm.blockedMemberItemsPerPage = 20;
		vm.blockedMemberCurrentPage = 1;
		vm.blockedMemberOptionsViewBy = [ '20', '30', '50' ];
		vm.blockedMemberViewby = 20;


		$scope.dtOptionsMemberBlocked = DTOptionsBuilder
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
				[
//						{
//							extend : 'print',
//							text : "<i class='fa fa-print text-navy'></i>&nbsp;|&nbsp;Print",
//							exportOptions : {
//								modifier : {
//									page : 'all'
//								}
//							}
//						},
//						{
//							extend : 'excel',
//							filename : 'List_Member_p'
//									+ vm.currentPage
//									+ "_"
//									+ $filter('date')(new Date(),
//											'yyyy-MM-dd'),
//							text : "<i class='fa fa-file-excel-o text-navy'></i>&nbsp;|&nbsp;Excel",
//							exportOptions : {
//								modifier : {
//									page : 'all'
//								}
//							}
//						},
//						{
//							text : "<i class='fa fa-file-excel-o text-navy'></i>&nbsp;|&nbsp;Download All",
//							action : function(e, dt, node, config) {
//								$log.debug('Button Download All activated');
//								exportBlockedMemberToExcel();
//							}
//						}
				]);



		//Blocked member account related ends here.

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
						[
								{
									extend : 'print',
									text : "<i class='fa fa-print text-navy'></i>&nbsp;|&nbsp;Print",
									exportOptions : {
										modifier : {
											page : 'all'
										}
									}
								},
								{
									extend : 'excel',
									filename : 'List_Member_p'
											+ vm.currentPage
											+ "_"
											+ $filter('date')(new Date(),
													'yyyy-MM-dd'),
									text : "<i class='fa fa-file-excel-o text-navy'></i>&nbsp;|&nbsp;Excel",
									exportOptions : {
										modifier : {
											page : 'all'
										}
									}
								},
								{
									extend : 'pdf',
									filename : 'List_Member_p'
											+ vm.currentPage
											+ "_"
											+ $filter('date')(new Date(),
													'yyyy-MM-dd'),
									text : "<i class='fa fa-file-pdf-o text-danger'></i>&nbsp;|&nbsp;PDF",
									exportOptions : {
										modifier : {
											page : 'all'
										}
									}
								} ]);

		vm.assForm = {};
		vm.assForm.bnkCd = '';
		vm.assForm.nmLangCd = '';
		vm.assForm.cntryCd = '';
		vm.memberForm = {};
		vm.memberForm.phoneCntryCd = '';
		vm.memberForm.nmLangCd = '';
		vm.memberForm.addrssCntryCd = '';

		function validateSelectOption() {
			if (vm.assForm.bnkCd == '') {
				$("#opAssBnk .chosen-single")
						.css("border", "1px solid #ed5565");
			} else {
				$("#opAssBnk .chosen-single")
						.css("border", "1px solid #e5e6e7");
			}
			if (vm.assForm.nmLangCd == '') {
				$("#opAssLang .chosen-single").css("border",
						"1px solid #ed5565");
			} else {
				$("#opAssLang .chosen-single").css("border",
						"1px solid #e5e6e7");
			}

			if (vm.memberForm.phoneCntryCd == '') {
				$("#phoneCd .chosen-single").css("border", "1px solid #ed5565");
			} else {
				$("#phoneCd .chosen-single").css("border", "1px solid #e5e6e7");
			}

			if (vm.memberForm.nmLangCd == '') {
				$("#langCd .chosen-single").css("border", "1px solid #ed5565");
			} else {
				$("#langCd .chosen-single").css("border", "1px solid #e5e6e7");
			}

			if (vm.memberForm.addrssCntryCd == '' || vm.assForm.cntryCd == '') {
				$("#countryCd .chosen-single").css("border",
						"1px solid #ed5565");
			} else {
				$("#countryCd .chosen-single").css("border",
						"1px solid #e5e6e7");
			}
			opValidate = $timeout(validateSelectOption, 100);
		}


		vm.tabSelected = function(tab) {
			$log.debug('tabSelected: ' + tab);
			vm.assForm ={};
			vm.assForm.dstMemGuid = '';

			if (tab == 'index.member.statistics') {
				$timeout.cancel(opValidate);

				vm.member= {};

				var hasParams = false;
				if(!(Utils.isNullOrUndifined($scope.params.guid)) && $scope.params.guid != ''){
					vm.member.dstMemGuid = $scope.params.guid;
					hasParams = true;
				}
				if(!(Utils.isNullOrUndifined($scope.params.name)) && $scope.params.name != ''){
					vm.member.fullname = $scope.params.name;
					hasParams = true;
				}
				if(!(Utils.isNullOrUndifined($scope.params.email)) && $scope.params.email != ''){
					vm.member.emailAddrss = $scope.params.email;
					hasParams = true;
				}
				if(!(Utils.isNullOrUndifined($scope.params.phone)) && $scope.params.phone != ''){
					vm.member.phoneNo = $scope.params.phone;
					hasParams = true;
				}
				if(!(Utils.isNullOrUndifined($scope.params.vaccount)) && $scope.params.vaccount != ''){
					vm.member.virtualAccntNo = $scope.params.vaccount;
					hasParams= true;
				}
				if(!(Utils.isNullOrUndifined($scope.params.account)) && $scope.params.account != ''){
					vm.member.bnkAccntNo = $scope.params.account;
					hasParams = true;
				}

				if(hasParams){
					//if it has parameters , request
					console.log('excuted search =============');
					vm.advSearch();
				}


			} else if (tab == 'index.member.createMember') {
				$scope.tempInner = 'modules/member/views/createMember.html'+Utils.getExtraParams();
				getListCountry();

			} else if (tab == 'index.member.assignLogin') {
				// load lang?
				if(!(Utils.isNullOrUndifined($scope.params.guid)) && $scope.params.guid != ''){
					vm.assForm.dstMemGuid = $scope.params.guid;
				}
				if(!(Utils.isNullOrUndifined($scope.params.name)) && $scope.params.name != ''){
					vm.assForm.fullname = $scope.params.name;
				}
				if(!(Utils.isNullOrUndifined($scope.params.loginId)) && $scope.params.loginId != ''){
					vm.assForm.login = $scope.params.loginId;
				}

			} else if (tab == 'index.member.assignVirtual') {
				// this tab was included in member's detail .
				getListVB();
				$scope.tempInner = 'modules/member/views/assignVirtual.html'+Utils.getExtraParams();
			} else if (tab == 'index.member.assignBank') {
				getListCountry();
				getListBank();

				console.log('try assign banks ');
				if(!(Utils.isNullOrUndifined($scope.params.guid)) && $scope.params.guid != ''){
					vm.assForm.dstMemGuid = $scope.params.guid;
				}
				if(!(Utils.isNullOrUndifined($scope.params.guid)) && $scope.params.guid != ''){
					vm.assForm.accntNo = $scope.params.account;
				}


			}else if(tab == 'index.member.resetPassword'){
				console.log("Entered resetPassword html ");
				if(!(Utils.isNullOrUndifined($scope.params.id)) && $scope.params.id != ''){
					vm.assForm.dstMemGuid = $scope.params.id;
				}

			}
			else if(tab == 'index.member.withdrawalBlockManagement'){
				console.log("== Entered withdrawalBlockManagement html ");
				/**
				if(!(Utils.isNullOrUndifined($scope.params.id)) && $scope.params.id != ''){
					vm.assForm.dstMemGuid = $scope.params.id;
				}
				**/
				console.log("=================>> start withdrawalBlockManagement");
				$scope.getBlockedListMember(0, limitBlockedMemberList, '');
			}

			validateSelectOption();
		};

		(function initController() {
			$log.debug("Member init");
			limit = localStorageService.get('limit');
			if (limit == null) {
				limit = 20;
			}
			var params = $state.params;

			if ($state.current.name == 'index.member.statistics' || $state.current.name == 'index.member') {
				// to avoid "Cannot reinitialise DataTable"
				if(Utils.isNullOrUndifined(params.guid)
						&& Utils.isNullOrUndifined(params.name)
						&& Utils.isNullOrUndifined(params.phone)
						&& Utils.isNullOrUndifined(params.email)
						&& Utils.isNullOrUndifined(params.vaccount)
						&& Utils.isNullOrUndifined(params.account))
				{
					getListMemberToday();
					getTotalMember();
					getTotalStatusMember();

					getListMember(1, limit, '');

				}
			}
        	$scope.$emit('$stateChangeSuccess','');
		})();

		$scope.$on('$stateChangeSuccess', function(event, toState) {
			 	console.log(toState.name);
			 	console.log(toState);
	
			 	if(toState.name.indexOf('index.member') != -1){
				  	var stateNameComponents = toState.name.split('.');
				    var stateName = stateNameComponents[(stateNameComponents.length - 1)];
	
				    $scope.tabs = {
				      statistics : false,
				      createMember : false,
				      assignLogin : false,
				      assignBank : false,
				      resetPassword : false
				    };
				    if(stateName == 'member'){
				    	stateName = 'statistics';
				    }
	
				    $scope.tabs[stateName] = true;
				    $scope.params = $state.params;
				    console.log($scope.params);
	
			 	}
	 	});
		
		//for blockedMemberList refresh

		$scope.$on('$blockeListRefresh', function(event, toState) {
		 	$scope.getBlockedListMember(0, limitBlockedMemberList, '');
		});

		vm.viewby = limit;
		vm.setItemsPerPage = function() {
			$log.debug('viewby: ' + vm.viewby);
			$log.debug('currentPage: ' + vm.currentPage);
			localStorageService.set('limit', vm.viewby);
			vm.currentPage = 1;
			getListMember(vm.currentPage, vm.viewby, '');
		};

		vm.pageChanged = function() {
			$log.debug('Page changed to: ' + vm.currentPage);
			$log.debug('viewby: ' + vm.viewby);
			getListMember(vm.currentPage, vm.viewby, '');
		};


		/////////////////////////////////////////////////////////////
		//START : Used in member account withdrawal block
		// set page items which text info
		vm.setCurrentPageItemInfo = function(){
			vm.dataTablesInfoBlockedMember = 'Showing '
				+ ((vm.blockedMemberCurrentPage - 1)
						* vm.blockedMemberItemsPerPage + 1)
				+ ' to '
				+ ((vm.blockedMemberCurrentPage
						* vm.blockedMemberItemsPerPage > vm.blockedMemberTotalItems) ? vm.blockedMemberTotalItems
						: vm.blockedMemberCurrentPage
								* vm.blockedMemberItemsPerPage)
				+ ' of ' + vm.blockedMemberTotalItems
				+ ' entries';
		}

		//change view item count per page
		vm.setItemsPerPageBlockedMember = function() {
			$log.debug('==> setItemsPerPageBlockedMember Blocked member viewby: ' + vm.blockedMemberViewby);
			$log.debug('==> setItemsPerPageBlockedMember Blocked member currentPage: ' + vm.blockedMemberCurrentPage);
			localStorageService.set('Blocked member limit', vm.blockedMemberViewby);
			vm.blockedMemberCurrentPage = 1;
			vm.blockedMemberItemsPerPage = vm.blockedMemberViewby;
			vm.setCurrentPageItemInfo();
		};

		//change page.
		vm.pageChangedBlockedMember = function(page) {
			if ( page <= 0 ) {//do noting if page go to minus.
				return;
			}else if ( Math.floor(vm.blockedMemberTotalItems / vm.blockedMemberViewby) +1 < page ) { //do nothing if page go to beyond limit.
				return;
			}

			vm.blockedMemberCurrentPage = page;
			vm.setCurrentPageItemInfo();
		};
		//END : Used in member account withdrawal block  here.
		////////////////////////////////////////////////////////


		vm.assignVirtual = function() {
			vm.dataFormLoading = true;
			$log.debug('assignVirtual 11111 : ' + JSON.stringify(vm.assForm));

			MemberService
					.assignVirtual($httpParamSerializer(vm.assForm))
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
								} else if (response.status == 'SUCCESS') {
									$log.debug("data:" + response.data);
									vm.dataFormLoading = false;
									if (response.data.status == 'ASSIGN_VACCNT_FINISHED') {
										$scope.assignVirtualSuccess = true;
										$scope.assignVirtualResult = response.data;
									} else {
										$scope.assignVirtualSuccess = false;
										swal({
											title : $translate.instant('ERROR'),
											text : "잘못된 파라미터 포멧 : dstMemGuid : [dstMemGuid]",
											type : "error",
											confirmButtonText : $translate
													.instant('btnOK')
										});
									}

								}
							});
		};

		vm.assignBank = function() {
			vm.dataFormLoading = true;
			$log.debug('assignBank: ' + JSON.stringify(vm.assForm));
			MemberService
					.assignBank($httpParamSerializer(vm.assForm))
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
									$scope.assignBankSuccess = true;
									$scope.assignBankResult = response.data;
								}
								vm.dataFormLoading = false;
							});
		};

		// 계좌번호로 계좌주 조회 2016.12.05, by aajik, add
		vm.getMemberAccntName = function() {
			// https://dev5.paygate.net/v5a/bank/inquirebnkname?reqMemGuid=guid71&accntNo=06212432101022&bnkCd=KIUP_003
			var accntNo = $scope.vm.assForm.accntNo; // 2016.12.05, by aajik,
			// add, assignBank.html에
			// 정의 함.
			var bnkCd = $scope.vm.assForm.bnkCd; // 2016.12.05, by aajik,
			// add, assignBank.html에 정의
			// 함.
			if (!bnkCd || bnkCd == 'undefined') {
				alert('The Bank code is empty.');
				return;
			}

			if (!accntNo || accntNo == 'undefined') {
				alert('The Account number is empty.');
				return;
			}
			var params = "accntNo=" + accntNo + "&bnkCd=" + bnkCd;
			var reqMemGuid = $rootScope.globals.currentUser.superGuid; // guid71

			MemberService.getMemberAccntName(params).then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					$log.debug("data:" + response.data);
					$scope.vm.assForm.accntName = response.data.bankOwnerName;
				} else {
					$scope.showError = true;
					$scope.vm.assForm.accntName = response.data.cdNm;
				}
			});
		};

		vm.assignLogin = function() {
			vm.dataFormLoading = true;
			$log.debug('assignLogin: ' + JSON.stringify(vm.assForm));
			MemberService
					.assignLogin($httpParamSerializer(vm.assForm))
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
									vm.dataFormLoading = false;
									$scope.assignLoginSuccess = true;
								}
							});
		};

		vm.createMember = function() {
			vm.dataFormLoading = true;
			$log.debug('trans: ' + JSON.stringify(vm.memberForm));
			MemberService
					.createMember($httpParamSerializer(vm.memberForm))
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
									var obj = Utils.getJsonObj(response.data);
									$log.debug("data:" + obj);
									$log.debug("memGuid:" + obj.memGuid);
									vm.dataFormLoading = false;
									$scope.createMemberSuccess = true;
									$scope.memGuid = obj.memGuid;
									$scope.keyP = obj.result.key;
									vm.memberForm = {};
								}
							});
		};

		vm.resetPassword = function(assForm){
			// 추후 메일 서비스 API 완성되면 parameter 바꾸기 .
//			var mailAddress = assForm.preAddress +"@" + assForm.siteAddress;
//			var paramStr = "reset=true&dstMemGuid=" + assForm.dstMemGuid
//							+"&mailAddress" + mailAddress ;
			// 현재는 2017.07.21 은 ID 로만 하게끔 하고
			// 추후 비밀번호 통보 e-mail 지정 서비스 준비
			var paramStr = "reset=true&login=" + assForm.dstMemGuid;
			console.log(paramStr);
			$scope.resetPasswordSuccess =true;
			$scope.procceedID = vm.assForm.dstMemGuid;

			MemberService
			.requestResetPassword(paramStr)
			.then(
					function(response) {
						//$log.debug(response);
						$log.debug(response.status);

						if (response.status == 'ERROR') {
							$scope.resetPasswordSuccess = false;

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
							console.log("변경요청 성공!!! ");
									$scope.resetPasswordSuccess = true;
									$scope.procceedID = vm.assForm.dstMemGuid;
						}
					});
		}
		$scope.isSelect = true;
		vm.directInput = function(){
			$scope.isSelect = !$scope.isSelect;
		}

		$scope.tempSearchForm = 'modules/member/views/searchForm.html'+Utils.getExtraParams();

		$scope.loadDataForm = true;
		vm.initAdvSearch = function() {
			$log.debug('initAdvSearch: ' + $scope.isCollapsed);
			$scope.isCollapsed = ($scope.isCollapsed) ? false : true;
			$scope.loadDataForm = false;
		};

		vm.advSearch = function() {
			vm.dataLoading1 = true;
			$scope.isCollapsed = false;// close searchForm

			$log.debug('member: ' + JSON.stringify(vm.member));

			$log.debug('httpParamSerializer: '
					+ $httpParamSerializer(vm.member));
			getListMember(1, limit, $httpParamSerializer(vm.member));
		};

		$scope.labelsStatus = [ "Unverified", "Verified keys", "Verified",
				"UnverifiedKey" ];

		$scope.colors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD',
				'#FDB45C', '#949FB1', '#4D5360' ];
		$scope.options = {
			responsive : true,
			maintainAspectRatio : false,
			legend : {
				display : true
			}
		};

		$scope.colorsMemberToday = [ '#803690' ];
		$scope.seriesMemberToday = [ 'Member' ];
		$scope.getMemberDetail = function(memberDetail) {
			$log.debug('memberDetail: ' + JSON.stringify(memberDetail));
			// memberDetail is undefined
			// you need setter parameter memberDetail
			var modalInstance = $uibModal.open({
				animation : animationsEnabled,
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

			modalInstance.result.then(function(newNameSt, newPennySt, newKycSt) {
				$log.debug('newNameSt: ' + newNameSt);
				$log.debug('newPennySt: ' + newPennySt);
				$log.debug('newKycSt: ' + newKycSt);
				$scope.selected = selectedItem;
			}, function() {
				$log.debug('Modal dismissed  at: ' + new Date());
			});

		};

		function getListMember(page, limit, paramStr) {
			$log.debug('start getListMember: ' + new Date());
			vm.dataLoading1 = true;
			vm.dataLoading2 = true;
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
										vm.totalItems = $scope.totalMember.grandTotal > 9999 ? 9999 : $scope.totalMember.grandTotal;

										vm.itemsPerPage = vm.viewby;
										$log.debug("totalItems:"
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
												+ ' entries';

									}
								}
								vm.dataLoading1 = false;
								vm.dataLoading2 = false;
							});

		}
		;

		function getListCountry() {
			$scope.dataFormLoading = true;
			MemberService.getListCountry().then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					$scope.listCountry = response.data;
				}
				$scope.dataFormLoading = false;
			});
		}

		function getListBank() {
			$scope.dataFormLoading = true;

			MemberService.getListBank().then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					$scope.listBank = response.data;
				}
				$scope.dataFormLoading = false;
			});
		}

		function getListVB() {
			$scope.dataFormLoading = true;
			MemberService.getListVB().then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					$log.debug("data" + response.data);
					$scope.listBank = response.data;
				}
				$scope.dataFormLoading = false;
			});
		}

		function getListMemberToday() {
			$scope.dataMemberToday = [];
			$scope.labelsMemberToday = [];
			//
			/*$scope.dataChartLoading = true;
			$scope.showErrorChart = false;
			MemberService.getListMemberToday().then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					var resultList = response.data.resultList;
					angular.forEach(resultList, function(value, key) {
						$scope.labelsMemberToday.push(value.hh);
						$scope.dataMemberToday.push(value.count);
						if (value.count == 0) {
							$scope.showErrorChart = true;
						}
					});
				} else {
					$scope.showErrorChart = true;
				}
				$scope.dataChartLoading = false;
			});
			if ($state.current.name == 'index.monitoring') {
				timeListMemberToday = $timeout(getListMemberToday, 30000);
			} else {
				$timeout.cancel(timeListMemberToday);
			}*/
		}
		function getTotalStatusMember() {
			$scope.dataPhone = [];
			$scope.dataEmail = [];

			/*$scope.dataTotalLoading = true;
			MemberService.getTotalPhoneStatus().then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					var objTotal = response.data.result;
					$scope.dataPhone.push(objTotal.unverified_phones);
					$scope.dataPhone.push(objTotal.verified_key_phones);
					$scope.dataPhone.push(objTotal.verified_phones);
					$scope.dataPhone.push(objTotal.unverified_key_phones);
				} else {
					$scope.showErrorStatus = true;
				}
				$scope.dataTotalLoading = false;
			});
			MemberService.getTotalEmailStatus().then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					var objTotal = response.data.result;
					$scope.dataEmail.push(objTotal.unverified_emails);
					$scope.dataEmail.push(objTotal.verified_key_emails);
					$scope.dataEmail.push(objTotal.verified_emails);
					$scope.dataEmail.push(objTotal.unverified_key_emails);
				} else {
					$scope.showErrorStatus = true;
				}
				$scope.dataTotalLoading = false;
			});*/
		}
		//statics - last 24hours / last week / Grand total
		function getTotalMember() {
			$log.debug("Member getTotal 24hs");

			/*$scope.dataTotalLoading = true;
			MemberService
					.getTotalByDate("startDt=yesterday")
					.then(
							function(response) {
								$log.debug(response.status);
								if (response.status == 'SUCCESS') {
									console.log("last 24 hours");
									$log.debug(response);
									var obj = Utils.getJsonObj(response.data);
									if (Utils.isUndefinedOrNull(obj.status)) {
										$scope.showError = true;
									} else {
										$scope.totalMember.last24Hrs = obj.result.count;
									}

								} else {
									$scope.showError = true;
								}
								$scope.dataTotalLoading = false;
							});

			MemberService.getTotalByDate("startDt=lastWk").then(
					function(response) {
						$log.debug(response.status);
						if (response.status == 'SUCCESS') {
							console.log("last week ");
							$log.debug(response);
							var obj = Utils.getJsonObj(response.data);
							if (Utils.isUndefinedOrNull(obj.status)) {
								$scope.showError = true;
							} else {
								$scope.totalMember.lastWeek = obj.result.count;
							}

						} else {
							$scope.showError = true;
						}
						$scope.dataTotalLoading = false;
					});

			MemberService.getTotal().then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
//					$log.debug(response.data);
					console.log("Grand Total");
					$log.debug(response);
					var obj = Utils.getJsonObj(response.data);
					if (Utils.isUndefinedOrNull(obj.status)) {
						$scope.showError = true;
					} else {
						$scope.totalMember.grandTotal = obj.result.totalCount;
					}

				} else {
					$scope.showError = true;
				}
				$scope.dataTotalLoading = false;
			});*/
		}
		;

		vm.resetVirtualAccount = function(assForm) {
			$scope.datas = angular.copy($scope.initial);

			$scope.assignVirtualResult = {};
			$scope.reset = true;
			var paramStr = "reset=true&dstMemGuid=" + assForm.dstMemGuid + "&bnkCd=" + assForm.bnkCd;
			//alert('paramStr' + paramStr);

			MemberService
					.resetVirtualAccount(paramStr)
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
									$log.debug(response.data);
									var obj = Utils.getJsonObj(response.data);

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
										} else {
										$scope.resetVirtualAccount = obj.result;
										swal("",$translate.instant('VCResetSuccess'),"success");
									}
								}

								// now you need call to service - API

							});
		};

		vm.getInnerPage = function(page){
			if(page == 'createMember'){
				$scope.test1 = 'modules/member/views/createMember.html'+Utils.getExtraParams();
			}else if(page == 'assignVirtual'){
				getListVB();
				$scope.test1 = 'modules/member/views/assignVirtual.html'+Utils.getExtraParams();
			}
		}


		// member account withdrawal block list.
		//function getBlockedListMember(page, limit, paramStr) {
		$scope.getBlockedListMember = function (page, limit, paramStr) {
			$log.debug('==Enter getBlockedListMember: ' + new Date());

			var reqMemGuid = $rootScope.globals.currentUser.superGuid;
			var paramStr = "&offset="+page+
			               "&limit="+limit;

			vm.dataLoading3 = true;
			vm.dataLoading4 = true;

			console.log("===>> paramStr : " + paramStr);

			MemberService
					.setMemberWithdrawalBlockedList(paramStr)
					.then(
							function(response) {
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
									console.log("===> response.status == 'SUCCESS' 1096");

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

										$log.debug("=============================================");
										$log.debug("== Blocked Member ResultList:");
										vm.blockedMemberContents = obj.list;
										$log.debug(vm.blockedMemberContents);
										$log.debug("===============================================END ");

										// pagination config
										//  페이지 9999 개 제한으로 주석 해놓음
//										vm.totalItems = $scope.totalMember.grandTotal;
										//page limit

										vm.blockedMemberTotalItems = vm.blockedMemberContents.length > 9999 ? 9999 : vm.blockedMemberContents.length;
										vm.blockedMemberItemsPerPage = vm.blockedMemberViewby;
										$log.debug("== totalItems:" + vm.blockedMemberTotalItems);
										$log.debug("== itemsPerPage:" + vm.blockedMemberItemsPerPage);

										vm.setCurrentPageItemInfo();

									} else {
										console.log("===> response.status == else 1242");

										vm.blockedMemberContents = obj.list;
										vm.blockedMemberTotalItems = $scope.blockedMemberTotalMember.grandTotal > 9999 ? 9999 : $scope.blockedMemberTotalMember.grandTotal;

										vm.blockedMemberItemsPerPage = vm.blockedMemberViewby;
										vm.setCurrentPageItemInfo();

									}
								}
								vm.dataLoading3 = false;
								vm.dataLoading4 = false;
							});

		};

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		//차단 해제 하시겠습니까 팝업 - 작업해야함.
		console.log($scope.blockId);
		$scope.openBlockReleasePopup = function(blockId) {
			$log.debug('===> Block release - blockId : ' + blockId);

			Utils.setBlockId(blockId);

			var modalInstance = $uibModal.open({
				animation : animationsEnabled,
				templateUrl : 'modules/member/views/memberAccountBlockReleasePopup.html'+Utils.getExtraParams(),
				controller : 'MemberBlockController',
				size : 'lg',
				backdrop : 'false',
				keyboard : true,
				windowClass : 'zindex',

				resolve : {
					blockId : function(){
						return blockId;
					}
				}

			});
			Utils.setModalInstance(modalInstance);

			// handle closing and dismissing events
			modalInstance.result.then(function(newNameSt, newPennySt, newKycSt) {
				//modal.close() will get into here.
				$scope.selected = selectedItem;

			}, function() {
				//dismissed here.
				// handle escape key press and etc...
				$log.debug('Modal dismissed  at: ' + new Date());
			});

		};


		///////////////////////////////////////////////////////////////////////////////////////////////////////
		//
		//EXPORT EXCEL start here.
		//

		var paramExportAll = '';
		function exportBlockedMemberToExcel() {
			var fileName = "List_MemberBlocked_All_" + $filter('date')(new Date(), 'yyyy-MM-dd');

			$log.debug("==> fileName : " + fileName);

			jsonToExcel(vm.blockedMemberContents, fileName);
		}

		function jsonToExcel(jsonData, fileName) {
			var types = {
				"blockDt" : "String",
				"blockId" : "String",
				"blockReason" : "String",
				"blockTarget" : "String",
				"blockType" : "String",
				"blockValue" : "String",
				"creatorName" : "String",
				"desc" : "String",
			};

			var lableHeader = [
				"차단일", "차단 번호", "차단사유", "차단대상", "차단유형", "차단값", "차단자", "상세",
			];

			var cols = [ "creatorName",  "blockId", "blockTarget", "blockType", "blockReason",  "blockValue", "blockDt", "desc" ];
			var objTrans = {
					blockDt : "",
					blockId : "",
					blockReason : "",
					blockTarget : "",
					blockType : "",
					blockValue : "",
					creatorName : "",
					desc : "",
			};

			var emitXmlHeader = function() {
				var headerRow = '<ss:Row>\n';
				for (var i = 0; i < lableHeader.length; i++) {
					headerRow += '  <ss:Cell>\n';
					headerRow += '    <ss:Data ss:Type="String">';
					headerRow += lableHeader[i] + '</ss:Data>\n';
					headerRow += '  </ss:Cell>\n';
				}
				headerRow += '</ss:Row>\n';
				return '<?xml version="1.0"?>\n' +
					'<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
					'<ss:Worksheet ss:Name="Sheet1">\n' +
					'<ss:Table>\n\n' + headerRow;
			};
			var emitXmlFooter = function() {
				return '\n</ss:Table>\n' +
					'</ss:Worksheet>\n' +
					'</ss:Workbook>\n';
			};

			var jsonToSsXml = function(jsonObject) {
				var row;
				var col;
				var xml;
				var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;

				xml = emitXmlHeader();

				for (row = 0; row < data.length; row++) {
					xml += '<ss:Row>\n';

					var dataCol = angular.extend(objTrans, data[row]);

					for (col in dataCol) {
						if (cols.indexOf(col) != -1) {
							var cell = data[row][col];
							if (col == "updateDt") {
								cell = $filter('date')(cell, 'yyyy-MM-dd HH:ss')
							}
							if (cell == undefined) {
								cell = "";
							}

							xml += '  <ss:Cell>\n';
							xml += '    <ss:Data ss:Type="' + types[col] + '">';
							xml += cell + '</ss:Data>\n';
							xml += '  </ss:Cell>\n';
						}
					}
					xml += '</ss:Row>\n';
				}

				xml += emitXmlFooter();
				return xml;
			};

			var download = function(content, fileName, contentType) {
				if (!contentType)
					contentType = 'application/octet-stream';
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				var blob = new Blob([ content ], {
					'type' : contentType
				});
				var url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = fileName;
				a.click();
				window.URL.revokeObjectURL(url);
			};

			$log.debug(jsonToSsXml(jsonData));

			download(jsonToSsXml(jsonData), fileName + ".xls", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

		}


		//
		// EXPORT EXCEL ENDS here.
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		$scope.ok = function() {
			//$uibModal.close($scope.selected.item);
		};

		$scope.cancel = function() {
			$log.debug("cancel click");
			Utils.setTerminatedPopUps()
			return false;
		};

		//
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////

	}// end resetVirtualAccount

	function MemberBlockController($rootScope, $scope, $state, $translate,
			MemberService, Utils, $log, $timeout, $uibModal, $sce,
			localStorageService, $httpParamSerializer, DTOptionsBuilder,
			DTColumnDefBuilder, $filter, blockId){

		var vm = this;

		console.log("==> MemberBlockController");
		Utils.getBlockId();
		console.log("==> blockId : "+blockId);

		
		
		//차단 해제 - 작업해야함.
		$scope.setWithdrawalBlockRelease = function() {
			var params = "&blockId=" + Utils.getBlockId();;
			console.log("==> setWithdrawBlock PARAMS : " + params);

			MemberService
					.setMemberWithdrawalBlockRelease(params)
					.then(
							function(response) {
								$log.debug("Member account withdrawal block response : " + response.status);
								if (response.status == 'ERROR') {
									if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
										swal({
											title: $translate.instant('ERROR'),
											text: $translate.instant('errorComments'),
											type: "error",
											confirmButtonText: $translate.instant('btnOK')
										});
										$scope.cancel();
										$state.go('login');
					    				if (!$rootScope.$$phase) $rootScope.$apply();

					    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
					    				$scope.cancel();
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
									$log.debug(response.data);
									vm.dataFormLoading = false;
									
									if (response.data.status == 'SUCCESS') {
										swal({
											title : $translate.instant('SUCCESS'),
											text : "Member account withdrawal successfully released.",
											type : "success",
											confirmButtonText : $translate
													.instant('btnOK')
										});
										//broadcast event for blockedMemberList refresh 
										$rootScope.$broadcast('$blockeListRefresh');
										$scope.cancel();
									} else {
										$scope.assignVirtualSuccess = false;
										swal({
											title : $translate.instant('ERROR'),
											text : "잘못된 파라미터 포멧. ",
											type : "error",
											confirmButtonText : $translate
													.instant('btnOK')
										});
									}

								}
							});
		};

		$scope.cancel = function() {
			$log.debug("==> MemberBlockController - cancel click");
			//$uibModal.dismiss('cancel');
			//$scope.modalInstance.dismiss('cancel');
			//$uibModalInstance.dismiss('cancel');
			Utils.setTerminatedPopUps()

			return false;
		};

	}

	function MemberDetailController($scope, $rootScope, $state,
			$uibModalInstance, MemberService, SeyfertWithdrawService, Utils ,
			memberDetail, $log, $translate, DTOptionsBuilder,
			DTColumnDefBuilder, $uibModal ,$httpParamSerializer ,$q , $location ,$cookieStore ,localStorageService ,$timeout) {
		var vm = this;
		$scope.isAdmin  = $rootScope.globals.currentUser.isAdmin;
		//$scope.isAdmin  = false;

		console.log(Utils.getBlockId());
		Utils.setModalInstance($uibModalInstance);

		$scope.vaRegit    = 'modules/member/views/vaRegistration.html' + Utils.getExtraParams();
		$scope.vaRevoke = 'modules/member/views/vaRevoke.html' + Utils.getExtraParams();
		$scope.vaChage = 'modules/member/views/vaHolderChange.html' + Utils.getExtraParams();

		var animationsEnabled = true;
		var sizeModal = 'lg';

		$scope.memberDetailResult = {};
		$scope.balance = {};
		$scope.dateFormat = Utils.dateFormat().yyyyMMddHHmmss;
		$scope.dataLoading = false;
		$scope.edit = false;
		$scope.array =[];
		var arrayList =[];

		$scope.newVAHolder = {};
		$scope.bank = {};
		//$scope.assignVirtual  = 'modules/member/views/assignVirtual.html' + Utils.getExtraParams();

		if ($rootScope.globals.currentUser.isAdmin) {
			$scope.edit = true;
		}
		// dstMemGuid
		var guid = memberDetail.guid;
		if (guid == null) {
			$log.debug("guid == null");
			guid = memberDetail.reqMemGuid;
		}
		if (guid == null) {
			$log.debug("guid dstMemGuid set here");
			guid = memberDetail.dstMemGuid;
		}
		$log.debug("memberDetail:guid11::" + guid);

		getMemberDetail(guid);
		getSeyfertBalance(guid);
		getRecentTransaction(guid);

		getListVB();

		$scope.dtOptionsMemDetail = DTOptionsBuilder.newOptions()
				.withPaginationType('numbers').withDisplayLength(10)
				.withOption('paging', true).withOption('searching', false)
				.withOption('lengthChange', false)
				.withOption('ordering', false).withOption('info', false)
				.withOption('pagingType', "numbers").withBootstrap();

		$scope.dtOptionsMemFollowed = DTOptionsBuilder.newOptions()
		.withPaginationType('numbers').withDisplayLength(10)
		.withOption('paging', false).withOption('searching', false)
		.withOption('lengthChange', false)
		.withOption('ordering', false).withOption('info', false)
		.withOption('pagingType', false).withBootstrap();


		$scope.namesList = [];
		// 2016.12.01, add aajik, 변경할 수 있도록 SFT-290-->
		$scope.editMemberName = function() {
			var fullname = $scope.memberDetailResult.namesList[0].fullname; // 2016.12.02,
			// by
			// aajik,
			// add,
			// memberDetail.html에
			// memberDetailResult으로
			// 정의
			// 함.

			if (!fullname || fullname == 'undefined') {
				alert('The name is empty.');
				return;
			}
			var params = "nmLangCd=ko&fullname=" + fullname + "&dstMemGuid="+ guid;
			// alert(fullname); return;
			MemberService
					.editMemberName(params)
					.then(
							function(response) {
								$log.debug("--->response.status-->"
										+ response.status);
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
									$log.debug("data editMemberName:"
											+ response.data);
									alert('SUCCESS');
								}
							});
		};

		// 2016.12.01, add aajik, 변경할 수 있도록 SFT-290-->
		$scope.editMemberemailAddrss = function() {
			var emailAddrss = $scope.memberDetailResult.emailsList[0].emailAddrss; // 2016.12.02,
			// by
			// aajik,
			// add,
			// memberDetail.html에
			// memberDetailResult으로
			// 정의
			// 함.
			if (!emailAddrss || emailAddrss == 'undefined') {
				alert('The email is empty.');
				return;
			}
			var emailTp = $scope.memberDetailResult.emailsList[0].emailTp;
			if(Utils.isNullOrUndifined(emailTp)){
				emailTp = "PERSONAL";
			}
			var params = "emailTp=" + emailTp + "&emailAddrss=" + emailAddrss
			+ "&dstMemGuid=" + guid;
			MemberService
					.editMemberemailAddrss(params)
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
									$log.debug("data editMemberemailAddrss:"
											+ response.data);
									alert('SUCCESS');
								}
							});

		};

		// 2016.12.01, add aajik, 변경할 수 있도록 SFT-290-->
		$scope.editMemberPhoneNo = function() {
			var phoneNo = $scope.memberDetailResult.phonesList[0].phoneNo; // 2016.12.02,
			// by
			// aajik,
			// add,
			// memberDetail.html에
			// memberDetailResult으로
			// 정의
			// 함.
			if (!phoneNo || phoneNo == 'undefined') {
				alert('The phone number is empty.');
				return;
			}
			// alert(phoneNo); return;
			var params = "phoneNo=" + phoneNo + "&phoneCntryCd=KOR&dstMemGuid="
					+ guid;
			var reqMemGuid = $rootScope.globals.currentUser.superGuid;

			MemberService
					.editMemberPhoneNo(params)
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
									$log.debug("data editMemberPhoneNo:"
											+ response.data);
									alert('SUCCESS');
								}
							});

		};

		function getMemberDetail(guid) {
			$scope.dataLoading = true;
			var paramStr = "dstMemGuid=" + guid;
			//var paramStr = "scrMemGuid=" + guid;change like this, all function before worked error
			MemberService
					.getMemberDetail(paramStr)
					.then(
							function(response) {
								$log.debug(response.status);
								if (response.status == 'ERROR') {
									$scope.cancel();
									if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
										swal({
											title: $translate.instant('ERROR'),
											text: $translate.instant('errorComments'),
											type: "error",
											confirmButtonText: $translate.instant('btnOK')
										});
										$scope.cancel();
										$state.go('login');
					    				if (!$rootScope.$$phase) $rootScope.$apply();

					    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
					    				$scope.cancel();
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
											$scope.cancel();
											if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
												swal({
													title: $translate.instant('ERROR'),
													text: $translate.instant('errorComments'),
													type: "error",
													confirmButtonText: $translate.instant('btnOK')
												});
												$scope.cancel();
												$state.go('login');
							    				if (!$rootScope.$$phase) $rootScope.$apply();

							    			}else if(obj.data.cdKey == 'UNKNOWN_ERROR'){
							    				$scope.cancel();
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
										$scope.memberDetailResult = obj.result;
									}
								}
								$scope.dataLoading = false;
							});
		}

		$scope.ok = function() {
			$log.debug("OK click");
			$uibModalInstance.close($scope.selected.item);
		};

		$scope.cancel = function() {
			$log.debug("cancel click");
			//Utils.getData();
			$uibModalInstance.dismiss('cancel');
			return false;
		};

		$scope.getChangeStatus = function(bnkAccnt) {
//			$log.debug('bnkAccnt: ' + JSON.stringify(bnkAccnt));
//			$log.debug('$scope.memberDetailResult: '
//					+ JSON.stringify($scope.memberDetailResult));

			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'modules/member/views/changeStatus.html'+Utils.getExtraParams(),
				controller : 'ChangeStatusController',
				size : 'lg',// lg
				backdrop : 'static',
				keyboard : true,
				windowClass : 'zindex-second',
				resolve : {
					bnkAccnt : function() {
						$log.debug('bnkAccnt: ' + JSON.stringify(bnkAccnt));
						bnkAccnt.guid = guid;
						return bnkAccnt;
					}
				}
			});

			modalInstance.result
					.then(
							function(objStatus) {
								// $scope.memberDetailResult
								// step1: search this bnkAccnt from list
								// memberDetailResult.bnkAccnt 1 item or >1
								// set
								// memberDetailResult.bnkAccnt.nmVerify.verifySt
								// =
								// objStatus.radioModelName
								// set
								// memberDetailResult.bnkAccnt.verify.verifySt =
								// objStatus.radioModelPenny
								angular
										.forEach(
												$scope.memberDetailResult.bnkAccnt,
												function(value, key) {// loop
													// list
													if (angular.equals(value,
															bnkAccnt)) {
														$scope.memberDetailResult.bnkAccnt[key].nmVerify.verifySt = objStatus.radioModelName;
														$scope.memberDetailResult.bnkAccnt[key].verify.verifySt = objStatus.radioModelPenny;
														$scope.memberDetailResult.bnkAccnt[key].priviledgeVerify.verifySt = objStatus.radioModelKyc;
													}
												});

							},
							function() {
								$log.debug('Modal dismissed at: ' + new Date());
							});

		};

		$scope.getAssignVirtualAccount = function(assignVirtual) {


			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'modules/member/views/assignVirtual.html'+Utils.getExtraParams(),
				controller : 'MemberController',
				size : 'lg',
				backdrop : 'false',
				keyboard : true,
				windowClass : 'zindex-second',
				resolve : {
					memberDetail : function() {
						$log.debug('memberDetail: '
								+ JSON.stringify(memberDetail));
						return memberDetail;
					}
				}
			});

			$scope.cancel = function() {
				$log.debug("cancel click");
				$uibModalInstance.dismiss('cancel');
				return false;
			};

			modalInstance.result.then(function(newNameSt, newPennySt, newKycSt) {
				$log.debug('newNameSt: ' + newNameSt);
				$log.debug('newPennySt: ' + newPennySt);
				$log.debug('newKycSt: ' + newKycSt);
				$scope.selected = selectedItem;
			}, function() {
				$log.debug('Modal dismissed  at: ' + new Date());
			});


		};

		$scope.getResetVirtualAccount = function(resetVirtual) {

			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'modules/member/views/resetVirtual.html'+Utils.getExtraParams(),
				controller : 'MemberController',
				size : 'lg',
				backdrop : 'false',
				keyboard : true,
				windowClass : 'zindex-second',
				resolve : {
					memberDetail : function() {
						$log.debug('memberDetail: '
								+ JSON.stringify(memberDetail));
						return memberDetail;
					}
				}
			});

			$scope.cancel = function() {
				$log.debug("cancel click");
				$uibModalInstance.dismiss('cancel');
				return false;
			};

			modalInstance.result.then(function(newNameSt, newPennySt, newKycSt) {
				$log.debug('newNameSt: ' + newNameSt);
				$log.debug('newPennySt: ' + newPennySt);
				$log.debug('newKycSt: ' + newKycSt);
				$scope.selected = selectedItem;
			}, function() {
				$log.debug('Modal dismissed  at: ' + new Date());
			});


		};

		$scope.getAssignBankAccount = function(assignBank) {


			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'modules/member/views/assignBank.html'+Utils.getExtraParams(),
				controller : 'MemberController',
				size : 'lg',
				backdrop : 'false',
				keyboard : true,
				windowClass : 'zindex-second',
				resolve : {
					memberDetail : function() {
						$log.debug('memberDetail: '
								+ JSON.stringify(memberDetail));
						return memberDetail;
					}
				}
			});

			$scope.cancel = function() {
				$log.debug("cancel click");
				$uibModalInstance.dismiss('cancel');
				return false;
			};

			modalInstance.result.then(function(newNameSt, newPennySt, newKycSt) {
				$log.debug('newNameSt: ' + newNameSt);
				$log.debug('newPennySt: ' + newPennySt);
				$log.debug('newKycSt: ' + newKycSt);
				$scope.selected = selectedItem;
			}, function() {
				$log.debug('Modal dismissed  at: ' + new Date());
			});


		};

		$scope.getAddLoginCredential = function(assignLogin) {


			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'modules/member/views/assignLogin.html'+Utils.getExtraParams(),
				controller : 'MemberController',
				size : 'lg',
				backdrop : 'false',
				keyboard : true,
				windowClass : 'zindex-second',
				resolve : {
					memberDetail : function() {
						$log.debug('memberDetail: '
								+ JSON.stringify(memberDetail));
						return memberDetail;
					}
				}
			});


			$scope.cancel = function() {
				$log.debug("cancel click");
				$uibModalInstance.dismiss('cancel');
				return false;
			};

			modalInstance.result.then(function(newNameSt, newPennySt, newKycSt) {
				$log.debug('newNameSt: ' + newNameSt);
				$log.debug('newPennySt: ' + newPennySt);
				$log.debug('newKycSt: ' + newKycSt);
				$scope.selected = selectedItem;
			}, function() {
				$log.debug('Modal dismissed  at: ' + new Date());
			});


		};

		function getRecentTransaction(guid) {
			$scope.transaction = {};
			$scope.transaction.list = {};
			var paramStr = "dstMemGuid=" + guid;
			$log.debug('getRecentTransaction::dstMemGuid: ' + paramStr);
			MemberService
					.getRecentTransaction(paramStr)
					.then(
							function(response) {
								$log.debug(response.status);
								if (response.status == 'SUCCESS') {
									$scope.transaction.list = response.data.list;
									console.log(response.data);
								}
								else if (response.status == "ERROR") {
									if (response.data.cdKey == 'INVALID_PARAM_FORMAT') {
										$log.debug("INVALID_PARAM_FORMAT");
									}
								}

							});
		}

		function getSeyfertBalance(guid) {
			$scope.balances = {};
			$scope.balances.moneyPair = {};
			var paramStr = "dstMemGuid=" + guid;// ?? param currency=?
			$log.debug('inquiryBalance::dstMemGuid: ' + paramStr);
			SeyfertWithdrawService
					.inquiryBalances(paramStr)
					.then(
							function(response) {
								$log.debug(response.status);
								if (response.status == 'SUCCESS') {
									$log.info(response);
									$log.info(response.data.moneyPairs);
									$scope.balances.moneyPairs = response.data.moneyPairs;
								} else if (response.status == "ERROR") {
									if (response.data.cdKey == 'INVALID_PARAM_FORMAT') {
										$log.debug("INVALID_PARAM_FORMAT");
									}
								}
							});

			/*
			 * MemberService.getSeyfertBalance(paramStr).then(function
			 * (response) { $log.debug(response.status); if(response.status ==
			 * 'ERROR'){ swal({ title: $translate.instant('ERROR'), text:
			 * response.data.cdKey + ":" + response.data.cdDesc, type: "error",
			 * confirmButtonText: $translate.instant('btnOK') });
			 *
			 * if(response.data.cdKey == 'SESSION_EXPIRED' ||
			 * response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
			 * $state.go('login');; if (!$rootScope.$$phase)
			 * $rootScope.$apply(); } }else if(response.status == 'SUCCESS'){
			 * $log.debug("data:" + response.data); var obj =
			 * Utils.getJsonObj(response.data);
			 *
			 * if(Utils.isUndefinedOrNull(obj.status)){ if(obj.status ==
			 * "ERROR"){ swal({ title: $translate.instant('ERROR'), text:
			 * obj.data.cdKey + ":" + obj.data.cdDesc +"\nTry login again" ,
			 * type: "error", confirmButtonText: $translate.instant('btnOK') });
			 * if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey ==
			 * 'API_REQ_CAN_NOT_BE_DECRYPTED'){ $state.go('login'); if
			 * (!$rootScope.$$phase) $rootScope.$apply(); } } }else{
			 * $scope.balance = obj.result; } } $scope.dataLoading = false; });
			 */
		}


		//added by atlas
		function getListVB() {
			$scope.dataFormLoading = true;
			MemberService.getListVB().then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					$log.debug(response.data);
					$scope.listBank = response.data;
				}
				$scope.dataFormLoading = false;
			});
		}

		$scope.assForm;
		/**
		 * @method 가상계좌 할당
		 * @date 2017-11-13 by atlas
		 *
		 * */
		function assignVirtual() {
			vm.dataFormLoading = true;
			$log.debug('assignVirtual: ' + JSON.stringify($scope.assForm));

			if(!Utils.isNullOrUndifined($scope.memberDetailResult.virtualAccnt)){
				console.log("할당된 가상계좌가 없습니다. ");
				swal('WARNING','할당 받은 계좌가 있습니다.','warning');
				return;
			}

			console.log($httpParamSerializer($scope.assForm)+ "&dstMemGuid=" + guid );
			var params = ''
			params = 'bnkCd='+$scope.bank.bnkCd+ "&dstMemGuid=" + guid ;
			//return;//
			MemberService
					.assignVirtual(params)
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
										$scope.cancel();
										$state.go('login');
					    				if (!$rootScope.$$phase) $rootScope.$apply();

					    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
					    				$scope.cancel();
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
									$log.debug(response.data);
									vm.dataFormLoading = false;
									if (response.data.status == 'ASSIGN_VACCNT_FINISHED') {
										getListVB();
										getMemberDetail(guid);
									} else {
										$scope.assignVirtualSuccess = false;
										swal({
											title : $translate.instant('ERROR'),
											text : "잘못된 파라미터 포멧 : dstMemGuid : [dstMemGuid]",
											type : "error",
											confirmButtonText : $translate
													.instant('btnOK')
										});
									}

								}
							});
		};
		/**
		 * @method 가상계좌 재할당
		 * @date 2017-11-13 by atlas
		 *
		 * */
		function resetVirtual(){
			console.log("reset");
			console.log($httpParamSerializer($scope.assForm)+ "&dstMemGuid=" + guid );

			if(Utils.isNullOrUndifined($scope.memberDetailResult.virtualAccnt)){
				console.log("할당된 가상계좌가 없습니다. ");
				swal('WARNING','할당된 가상계좌가 없습니다.','warning');
				return;
			}
			$scope.reset = true;
			var paramStr = "reset=true&dstMemGuid=" + guid + '&bnkCd='+ $scope.bank.bnkCd;
//			alert('paramStr' + paramStr);

			MemberService
					.resetVirtualAccount(paramStr)
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
										$scope.cancel();
										$state.go('login');
					    				if (!$rootScope.$$phase) $rootScope.$apply();

					    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
					    				$scope.cancel();
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
									$log.debug(response.data);
									var obj = Utils.getJsonObj(response.data);
									if (obj.status == "ERROR") {
										if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
											swal({
												title: $translate.instant('ERROR'),
												text: $translate.instant('errorComments'),
												type: "error",
												confirmButtonText: $translate.instant('btnOK')
											});
											$scope.cancel();
											$state.go('login');
						    				if (!$rootScope.$$phase) $rootScope.$apply();

						    			}else if(obj.data.cdKey == 'UNKNOWN_ERROR'){
						    				$scope.cancel();
						    				Utils.getErrorHanler(obj.data.cdKey , obj.data.cdDesc);
						    			}else {
						    				swal({
												title: $translate.instant('ERROR'),
												text: obj.data.cdKey + ":" + obj.data.cdDesc,
												type: "error",
												confirmButtonText: $translate.instant('btnOK')
											});
						    			}
									}else {
										//console.log(obj);

										getMemberDetail(guid);
										getListVB();
									}
								}
								// now you need call to service - API
							});
		}

		/**
		 * @method 가상계좌 해지
		 * @date 2017-11-13 by atlas
		 *
		 * */
		function unassignVitualAccount(){
			console.log("unassignVitualAccount");

			swal({
				   title: $translate.instant('VCNotiTitle'),
				   text: $translate.instant('VCNotiComments'),
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",
				   confirmButtonText: $translate.instant('VCNotiYes'),
				   cancelButtonText: $translate.instant('VCNotiNo'),
				   closeOnConfirm: false,
				   closeOnCancel: false },
				function(isConfirm){
				   if (isConfirm) {

					   console.log("bnkCd="+$scope.memberDetailResult.virtualAccnt.bnkCd+"&accntNo="+$scope.memberDetailResult.virtualAccnt.accntNo+ "&dstMemGuid=" + guid );
					   var params ="bnkCd="+$scope.memberDetailResult.virtualAccnt.bnkCd+"&accntNo="+$scope.memberDetailResult.virtualAccnt.accntNo+ "&dstMemGuid=" + guid;
						MemberService.unassignVitualAccount(params).then(function(response){
						   $log.debug(response.status);
							if (response.status == 'ERROR') {
								if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
									swal({
										title: $translate.instant('ERROR'),
										text: $translate.instant('errorComments'),
										type: "error",
										confirmButtonText: $translate.instant('btnOK')
									});
									$scope.cancel();
									$state.go('login');
				    				if (!$rootScope.$$phase) $rootScope.$apply();

				    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
				    				$scope.cancel();
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
								$log.debug(response.data);
								var obj = Utils.getJsonObj(response.data);
								if (obj.status == "ERROR") {
									if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
										swal({
											title: $translate.instant('ERROR'),
											text: $translate.instant('errorComments'),
											type: "error",
											confirmButtonText: $translate.instant('btnOK')
										});
										$scope.cancel();
										$state.go('login');
					    				if (!$rootScope.$$phase) $rootScope.$apply();

					    			}else if(obj.data.cdKey == 'UNKNOWN_ERROR'){
					    				$scope.cancel();
					    				Utils.getErrorHanler(obj.data.cdKey , obj.data.cdDesc);
					    			}else {
					    				swal({
											title: $translate.instant('ERROR'),
											text: obj.data.cdKey + ":" + obj.data.cdDesc,
											type: "error",
											confirmButtonText: $translate.instant('btnOK')
										});
					    			}
								}else {
									//console.log(obj);
									swal("", $translate.instant('VCNotiMsgSuccess'), "success");
									getMemberDetail(guid);
									getListVB();
								}
							}

						});
				   } else {
				      swal("", $translate.instant('VCNotiMsgCancel'), "error");
				   }
				});

		}

		/**
		 * @method
		 * @use only for Root Admin
		 * */
		function getFollowedMerchant(){
			var params = "dstMemGuid="+guid;
			MemberService.getFollowedMerchants(params).then(function(response){
				console.log(response);

				if(response.status == "ERROR"){

				}else if(response.status == "SUCCESS"){
					var result = response.data.merchantGuidList;
					if(result.length <= 0 || result == null ){

					}else{
						for(var i = 0 ; i < result.length ; i++){
							console.log(result[i]);
								var item = {};
								item.guid = result[i];
								arrayList.push(item);
						}

						/*arrayList = [
							{guid : 'guid71'},
							{guid : 'testabcd3921'},
							{guid : 'testabcd3922'},
							{guid : 'QvGTPB84xE5LmSdNadXxXP'},
							{guid : 'XGS6SRV6wiWzJ1dsvTG93j'},
						];*/
						$scope.listLength = arrayList.length;
						$scope.count = 0;
						getMerchantsNames(arrayList[$scope.count].guid);
					}
				}
			});

		}

		getFollowedMerchant();
		$scope.getFollowedMerchant = getFollowedMerchant;

		function  getMerchantsNames(_guid){
			var promise = getMemberName(_guid);
			promise.then(function(value) {
				var item = {};
				item.guid = value[0].guid;
				item.name = value[0].fullname;
				$scope.array.push(item);

				$scope.count++;
				if(($scope.count+1) > $scope.listLength){
					if (!$rootScope.$$phase) $rootScope.$apply();
				}else{
					getMerchantsNames(arrayList[$scope.count].guid);
				}
			}, function(reason) {

			});
		}

		function getMemberName(_dstMemguid) {
			return $q(function(resolve,reject){
				if(Utils.isNullOrUndifined(_dstMemguid)){
					console.log("byebye");
					reject();
					return;
				}
				var paramStr = "dstMemGuid=" + _dstMemguid;
				MemberService
				.getListMember(1, 1, paramStr)
				.then(
						function(response) {
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
									resolve(obj.resultList);
								}
							}
							vm.dataLoading1 = false;
							vm.dataLoading2 = false;
						});
			});
		}

		$scope.getFollowedMemberDetail = function(memberDetail){
			console.log(memberDetail);
			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'modules/member/views/memberDetail.html'+Utils.getExtraParams(),
				controller : 'MemberDetailController',
				size : 'lg',
				backdrop : 'true',
				keyboard : true,
				windowClass : 'zindex',
				resolve : {
					memberDetail : function() {
						$log.debug('memberDetail: '
								+ JSON.stringify(memberDetail));
						//팝업창 스택처리를 어떻게 하면 좋을지 구상.
						$scope.cancel();
						return memberDetail;
					}
				}
			});


		}

		function goInqueryDetails(_tid){
			$state.go('index.seyfertFluctuation',{guid : guid , tid : _tid} );
			$scope.cancel();
		}
		function openNewPopUp(_tid){
			var url = $state.href('index.seyfertFluctuation',{guid : guid});
			Utils.openPopUp(url);
		}

		function openNewTab(){
			var url = $state.href('index.seyfertFluctuation',{guid : guid});
			Utils.openNewTab(url);
		}
		function goSmsSRList(phoneNumber){
			console.log("==>> goSmsSRList called. phoneNumber : " + phoneNumber);
			$state.go('index.smsSRList',{phoneNumber : phoneNumber} );
			$scope.cancel();
		}

/*	상세화면에서 이중팝업창으로 처리할시 사용 .
 *		 $scope.getTransactionDetail = function(transactionDetail) {

			var modalInstance = $uibModal
				.open({
					animation : animationsEnabled,
					templateUrl : 'modules/transaction/views/transactionDetail.html'+Utils.getExtraParams(),
					controller : 'TransactionDetailController',
					size : sizeModal,
					backdrop : 'static',
					keyboard : false,
					windowClass : 'zindex-second',
					resolve : {
						transactionDetail : function() {
							$log.debug('trans detail: ' + JSON.stringify(transactionDetail));
							return transactionDetail;
						}
					}
				});

			modalInstance.result.then(function(selectedItem) {
				$log.debug('result.then: ' + selectedItem);
				$scope.selected = selectedItem;
			}, function() {
				$log.debug('Modal dismissed at: ' + new Date());

			});
		};
*/
				/**
		 * 예금주 변경을 위한 method call flow
		 * 1. editAccntHolderName(_new name) : 예금주 변경
		 * 2. unassnVAByChangeAHolder()		 : 가상계좌 해지
		 * 3. reAssignVirtualAccount()         :  기존의 은행으로 가상계좌 재할당 .
		 * */
		function editAccntHolderName(name) {
			return $q(function(resolve , reject){
				var fullname = name // 2016.12.02,
				if (!fullname || fullname == 'undefined') {
					alert('The name is empty.');
					return;
				}
				var params = "nmLangCd=ko&fullname=" + fullname + "&dstMemGuid="+ guid;
				MemberService
						.editMemberName(params)
						.then(
								function(response) {
									$log.debug("--->response.status-->"
											+ response.status);
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
										$log.debug("data editMemberName:"
												+ response.data);
										//alert('SUCCESS');
										resolve("VACCNT_HOLDER_EDITED");
									}
								});
			});
		};

		function unassnVAByChangeAHolder(){
			return $q(function(resolve , reject){
				console.log("unassignVitualAccount");
				   console.log("bnkCd="+$scope.memberDetailResult.virtualAccnt.bnkCd+"&accntNo="+$scope.memberDetailResult.virtualAccnt.accntNo+ "&dstMemGuid=" + guid );
				   var params ="bnkCd="+$scope.memberDetailResult.virtualAccnt.bnkCd+"&accntNo="+$scope.memberDetailResult.virtualAccnt.accntNo+ "&dstMemGuid=" + guid;
				   MemberService.unassignVitualAccount(params).then(function(response){
					   $log.debug(response.status);
						if (response.status == 'ERROR') {
							if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
								swal({
									title: $translate.instant('ERROR'),
									text: $translate.instant('errorComments'),
									type: "error",
									confirmButtonText: $translate.instant('btnOK')
								});
								$scope.cancel();
								$state.go('login');
			    				if (!$rootScope.$$phase) $rootScope.$apply();

			    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
			    				$scope.cancel();
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
							$log.debug(response.data);
							var obj = Utils.getJsonObj(response.data);
							if (obj.status == "ERROR") {
								if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
									swal({
										title: $translate.instant('ERROR'),
										text: $translate.instant('errorComments'),
										type: "error",
										confirmButtonText: $translate.instant('btnOK')
									});
									$scope.cancel();
									$state.go('login');
				    				if (!$rootScope.$$phase) $rootScope.$apply();

				    			}else if(obj.data.cdKey == 'UNKNOWN_ERROR'){
				    				$scope.cancel();
				    				Utils.getErrorHanler(obj.data.cdKey , obj.data.cdDesc);
				    			}else {
				    				swal({
										title: $translate.instant('ERROR'),
										text: obj.data.cdKey + ":" + obj.data.cdDesc,
										type: "error",
										confirmButtonText: $translate.instant('btnOK')
									});
				    			}
							}else {
								//console.log(obj);
								/*swal("", $translate.instant('VCNotiMsgSuccess'), "success");
								getMemberDetail(guid);
								getListVB();*/
								resolve("VA_REBOKED");

								//
							}
						}

					});
			});
		}

		function reAssignVirtualAccount() {
			return $q(function(resolve ,reject){
				//$log.debug('assignVirtual: ' + JSON.stringify($scope.assForm));
				/*console.log(status);
				$scope.assignStatus = status;*/
				var params = ''
				params = 'bnkCd='+$scope.memberDetailResult.virtualAccnt.bnkCd+ "&dstMemGuid=" + guid ;

				console.log(params);
				MemberService
						.assignVirtual(params)
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
											$scope.cancel();
											$state.go('login');
						    				if (!$rootScope.$$phase) $rootScope.$apply();

						    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
						    				$scope.cancel();
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
										$log.debug(response.data);
										vm.dataFormLoading = false;
										if (response.data.status == 'ASSIGN_VACCNT_FINISHED') {
											//TODO 할당 및 재발급에 따른 안내 메시지 분리해서 안내하기.
											resolve("DONE");
										} else {
											$scope.assignVirtualSuccess = false;
											swal({
												title : $translate.instant('ERROR'),
												text : "잘못된 파라미터 포멧 : dstMemGuid : [dstMemGuid]",
												type : "error",
												confirmButtonText : $translate
														.instant('btnOK')
											});
										}

									}
								});

			});
		};

		//promise pattern 방식으로 동기식 호출
		function getReAssignProgress(method){
			var promise = method;
			promise.then(function(value) {
				if(value == 'VACCNT_HOLDER_EDITED'){
					if(Utils.isNullOrUndifined($scope.memberDetailResult.virtualAccnt.bnkCd)){
						swal('','할당된 가상계좌가 없습니다.','error');
						return;
					}
					getReAssignProgress(unassnVAByChangeAHolder());
				}else if(value == 'VA_REBOKED'){
					getReAssignProgress(reAssignVirtualAccount());
				}else if(value == 'DONE'){
					$scope.newVAHolder.name = '';
					getListVB();
					getMemberDetail(guid);

				}

			}, function(reason) {
				console.log(reason);
			});

		}

		function changeAccntHolder(){
			swal({
				   title: $translate.instant('lblTitleOfChangeAccntHolder'),
				   text: $translate.instant('lblCommentsOfChangeAccntHolder'),
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",
				   confirmButtonText: $translate.instant('lblCommonYES'),
				   cancelButtonText: $translate.instant('lblCommonNO'),
				   closeOnConfirm: true,
				   closeOnCancel: true },
				   function(isConfirm){
					   if (isConfirm) {
							$scope.dataLoading = true;
						    var newNm = $scope.newVAHolder.name;

							getReAssignProgress(editAccntHolderName(newNm.trim()));
					   }else{

					   }
				   });
		}


		$scope.setViewAs = function(dstMemGuid){
			swal({
				title: 'VIEW AS' ,
				text:  $translate.instant('commentsOfViewAs',{field : $scope.memberDetailResult.namesList[0].fullname}) ,
				type: 'info',
				showCancelButton: true,
				   confirmButtonColor: "#DD6B55",
				   confirmButtonText: $translate.instant('YES'),
				   cancelButtonText: $translate.instant('NO'),
				   closeOnConfirm: true,
				   closeOnCancel: true },
				function(isConfirm){
				   if (isConfirm) {
					   executeViewAs(dstMemGuid);
				   } else {

				   }
			});
		}
		/**
		 * @method ViewAs 기능 지원 메서드
		 * @TT SUI-110
		 * */
		function executeViewAs(dstMemGuid){
				// 파라미터 및 리턴값 복호화 용도의 keyb
			    $scope.keyB = generatKey(64);

			    var params = 'dstMemGuid='+dstMemGuid+"&keyb="+$scope.keyB;
			    MemberService.getTmpGuidAndTmpKeyp(params).then(function(response) {
			    	$log.debug(response.status);
					if (response.status == 'ERROR') {
						if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
							swal({
								title: $translate.instant('ERROR'),
								text: $translate.instant('errorComments'),
								type: "error",
								confirmButtonText: $translate.instant('btnOK')
							});
							$scope.cancel();
							$state.go('login');
		    				if (!$rootScope.$$phase) $rootScope.$apply();

		    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
		    				$scope.cancel();
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
						//$log.debug(response);

						$cookieStore.put('temp', $rootScope.globals);
						cryptico.decryptAes(response.encrGuid, $scope.keyB, function(decrGuid) {
							cryptico.decryptAes(response.encrKeyp, $scope.keyB, function(decrKeyp) {
								console.log("decrypted ");
								$rootScope.globals.currentUser.superGuid = decrGuid;
								$rootScope.globals.currentUser.pkey = decrKeyp;
							});
						});

						$rootScope.globals.currentUser.isAdmin = response.isAdmin;
						// UI 이름 등록
						$rootScope.globals.currentUser.username = $scope.memberDetailResult.namesList[0].fullname;
						//쿠키에 viewas 할 정보 저장
		                $cookieStore.put('globals', $rootScope.globals);
		                localStorageService.set('viewas', true);

		                // 현재 타이머 기능 정지
		                Utils.stopTimer();
		                // 팝업창 닫기
		                $scope.cancel();
		                $state.go('index.dashboard',{},{reload : true});
					}

			    }, function(reason) {
			    	console.log(reason);
			    });
		}

		$scope.assignVirtual = assignVirtual;
		$scope.resetVirtual = resetVirtual;
		$scope.unassignVitualAccount = unassignVitualAccount;
		$scope.changeAccntHolder = changeAccntHolder;
		$scope.goInqueryDetails = goInqueryDetails;
		$scope.openNewPopUp = openNewPopUp;
		$scope.openNewTab = openNewTab;
		$scope.goSmsSRList = goSmsSRList;

		//////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////
		//Start of member account blocking

		$scope.blockForm = {};
		$scope.blockForm.blockType = '';
		$scope.blockForm.blockTarget = '';
		$scope.blockForm.desc = '';

		$scope.blockReleaseForm = {};

		//block type
		$scope.blockTypeArr = [
			  {label : "lblPayOutTrn", value: "PAYOUT_TRN", },//it's default and only used option.
			  //{label : "lblPayInTrn", value: "PAYIN_TRN", },//Currently not using.
		];

		//block target
		$scope.blockTargetArr = [
			  {label : "lblGuid", value: "GUID", },
			  {label : "lblAccountNumber", value: "ACCNT_NO", },
			  //{label : "PHONE_NO", value: "PHONE_NO", },//Currently not using.
			  //{label : "EMAIL", value: "EMAIL", },//Currently not using.
		];

		//block reason
		$scope.blockReasonArr = [
			  {label : "FAKE_TRADES", value: "FAKE_TRADES", },
			  //{label : "PHONE_NO", value: "PHONE_NO", },//Currently not using.
			  //{label : "EMAIL", value: "EMAIL", },//Currently not using.
		];

		$scope.blockForm.blockType = $scope.blockTypeArr[0].value;
		$scope.blockForm.blockTarget = $scope.blockTargetArr[0].value;
		$scope.blockForm.blockReason = $scope.blockReasonArr[0].value;

		$scope.openMemberWithdrawalBlockPopup = function(memberDetail) {
			$log.debug('memberDetail: ' + JSON.stringify(memberDetail));
			// memberDetail is undefined
			// you need setter parameter memberDetail

			//$timeout(valueInit, 1000);
			var modalInstance = $uibModal.open({
				animation : animationsEnabled,
				templateUrl : 'modules/member/views/memberAccountBlockPopup.html'+Utils.getExtraParams(),
				controller : 'MemberDetailController',
				size : 'lg',
				backdrop : 'false',
				keyboard : true,
				windowClass : 'zindex-second',
				resolve : {
					memberDetail : function() {
						$log.debug('memberDetail: '
								+ JSON.stringify(memberDetail));
						return memberDetail;
					}
				}
			});

			modalInstance.result.then(function(newNameSt, newPennySt, newKycSt) {
				$scope.selected = selectedItem;
			}, function() {
				$log.debug('Modal dismissed  at: ' + new Date());
			});

		};

		$scope.setWithdrawalBlock = function() {
			// use when logged in merchants
			var blockType = 'PAYOUT_TRN';
			var blockTarget = 'GUID';
			var blockReason = 'FAKE_TRADES';
			// use when logged in merchants. ends here.

			if ($rootScope.globals.currentUser.isAdmin) {
				blockType = $scope.blockForm.blockType;
				blockTarget = $scope.blockForm.blockTarget;
				blockReason = $scope.blockForm.blockReason;

				//Doesn't need block reason
				if(Utils.isNullOrUndifined($scope.blockForm.blockType)){
					console.log("출금 차단 유형 미입력.");
					swal({
						title: $translate.instant('error'),
						text: $translate.instant('lblWithdrawalBlockMsgBlockType'),
						type: "error",
						confirmButtonText: $translate.instant('btnOK')
					});
					return;
				}
				if(Utils.isNullOrUndifined($scope.blockForm.blockTarget)){
					console.log("출금 차단 대상 미입력.");
					swal({
						title: $translate.instant('ERROR'),
						text: $translate.instant('lblWithdrawalBlockMsgBlockTarget'),
						type: "error",
						confirmButtonText: $translate.instant('btnOK')
					});
					return;
				}
				if(Utils.isNullOrUndifined($scope.blockForm.blockReason)){
					console.log("출금 차단 사유 미입력.");
					swal({
						title: $translate.instant('ERROR'),
						text: $translate.instant('lblWithdrawalBlockMsgBlockReason'),

						type: "error",
						confirmButtonText: $translate.instant('btnOK')
					});
					return;
				}
			}
			else{
				//Need block reason
				if(Utils.isNullOrUndifined($scope.blockForm.desc)){
					console.log("출금 차단 사유 상세 미입력.");
					swal({
						title: $translate.instant('ERROR'),
						text: $translate.instant('lblWithdrawalBlockMsgBlockDesc'),
						type: "error",
						confirmButtonText: $translate.instant('btnOK')
					});
					return;
				}
			}

			//POST&reqMemGuid=#{reqMemGuid}&dstMemGuid=#{dstMemGuid}&blockType=#{BLOCK_TYPE}&blockTarget=#{BLOCK_TARGET}&blockReason=#{BLOCK_REASON}&desc=#{상세사유}
			console.log("$scope blockType             : " + blockType);
			console.log("$scope blockTarget           : " + blockTarget);
			console.log("$scope blockReason           : " + blockReason);
			console.log("$scope $scope.blockForm.desc : " + $scope.blockForm.desc);

			var reqMemGuid = $rootScope.globals.currentUser.superGuid;

			var params = ''
			params = "&dstMemGuid=" + guid +
			         "&blockType=" + blockType +
			         "&blockTarget=" + blockTarget +
			         "&blockReason=FAKE_TRADES" +
			         "&desc=" + $scope.blockForm.desc;

			console.log("setWithdrawBlock PARAMS : " + params);

			MemberService
					.setMemberWithdrawalBlock(params)
					.then(
							function(response) {
								$log.debug("Member account withdrawal block response : " + response.status);
								if (response.status == 'ERROR') {
									if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
										swal({
											title: $translate.instant('ERROR'),
											text: $translate.instant('errorComments'),
											type: "error",
											confirmButtonText: $translate.instant('btnOK')
										});
										$scope.cancel();
										$state.go('login');
					    				if (!$rootScope.$$phase) $rootScope.$apply();

					    			}else if(response.data.cdKey == 'UNKNOWN_ERROR'){
					    				$scope.cancel();
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
									$log.debug(response.data);
									vm.dataFormLoading = false;
									if (response.data.status == 'SUCCESS') {
										swal({
											title : $translate.instant('SUCCESS'),
											text : "Member account withdrawal successfully blocked.",
											type : "success",
											confirmButtonText : $translate
													.instant('btnOK')
										});
										$scope.cancel();
									} else {
										$scope.assignVirtualSuccess = false;
										swal({
											title : $translate.instant('ERROR'),
											text : "잘못된 파라미터 포멧. ",
											type : "error",
											confirmButtonText : $translate
													.instant('btnOK')
										});
									}

								}
							});
		};

		


	}

	function ChangeStatusController($scope, $rootScope, $state,
			$uibModalInstance, MemberService, Utils, bnkAccnt, $log,
			$translate, DTOptionsBuilder, DTColumnDefBuilder, $uibModal, $http) {
		var vm = this;

		$scope.memberDetailResult = {};
		$scope.dateFormat = Utils.dateFormat().yyyyMMddHHmmss;
		$scope.dataLoading = false;
		$scope.edit = false;

		if ($rootScope.globals.currentUser.isAdmin) {
			$scope.edit = true;
		}


//		$log.debug("bnkAccnt == accntNo:" + bnkAccnt.accntNo);
//		$log.debug("bnkAccnt == bnkCd:" + bnkAccnt.bnkCd);
//		$log.debug("bnkAccnt == cntryCd:" + bnkAccnt.cntryCd);
//		$log.debug("bnkAccnt == verifyStPenny:" + bnkAccnt.verify.verifySt);
//		$log.debug("bnkAccnt == verifyStName:" + bnkAccnt.nmVerify.verifySt);
//		$log.debug("bnkAccnt == verifyStOwn:" + bnkAccnt.priviledgeVerify.verifySt);
//		$log.debug("bnkAccnt == priority:" + bnkAccnt.priority);
		// dstMemGuid
		var guid = bnkAccnt.guid;
//		$log.debug("bnkAccnt:guid::" + guid);
		$scope.radioModelName = bnkAccnt.nmVerify.verifySt;
		$scope.radioModelPenny = bnkAccnt.verify.verifySt;
		$scope.radioModelKyc = bnkAccnt.priviledgeVerify.verifySt;

		$scope.changeNameStatus = function() {

			var paramStr = "dstMemGuid=" + guid + "&verifyKey="
					+ bnkAccnt.nmVerify.verifyKey;bnkAccnt.ownVerify
			paramStr += "&verifySt=" + $scope.radioModelName;
			$log.debug("getChangeStatus:" + paramStr);
			$log.debug("radioModelName:" + $scope.radioModelName);

			MemberService
					.getChangeStatus(paramStr)
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
										$scope.memberDetailResult = obj.result;
									}
								}

							});
		}

		$scope.changePennyStatus = function() {

			var paramStr = "dstMemGuid=" + guid + "&verifyKey="
					+ bnkAccnt.verify.verifyKey;
			paramStr += "&verifySt=" + $scope.radioModelPenny;
			$log.debug("getKeysOfBanks:" + paramStr);
			$log.debug("radioModelPenny:" + $scope.radioModelPenny);// read
			// ng-model
			// from
			// view

			MemberService
					.getKeysOfBanks(paramStr)
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
										$scope.memberDetailResult = obj.result;
									}
								}
							});
		}

		$scope.changeKYCStatus = function() {
			console.log("===================");
			var paramStr = "dstMemGuid=" + guid + "&verifyKey="
					+ bnkAccnt.priviledgeVerify.verifyKey;
			paramStr += "&verifySt=" + $scope.radioModelKyc;
			$log.debug("getChangeOwnershipStatus:" + paramStr);
			$log.debug("radioModelKyc:" + $scope.radioModelKyc);

			MemberService
					.getChangeOwnershipStatus(paramStr)
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
									console.log('--------------------------------')
									$log.debug(response.data);
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
										$scope.memberDetailResult = obj.result;
										$scope.memberDetailResult = obj.result;
										console.log('--------------------------------')

									}
								}
							});
		}

		$scope.cancel = function() {
//			$log.debug("cancel click" + $scope.radioModelPenny);
//			$log.debug("cancel click1" + $scope.radioModelName);
//			$log.debug("cancel click2" + $scope.radioModelKyc);
			// newNameSt,newPennySt

			var obj = {};
			obj.radioModelName = $scope.radioModelName;
			obj.radioModelPenny = $scope.radioModelPenny;
			obj.radioModelKyc = $scope.radioModelKyc;

			$uibModalInstance.close(obj);
			// $uibModalInstance.dismiss('cancel');
			// return false;
		};

	}




})();
