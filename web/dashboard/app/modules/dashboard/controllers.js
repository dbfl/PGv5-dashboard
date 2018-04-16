(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope','$rootScope','$state', '$translate', 'DashboardService', 'MemberService', 'SeyfertWithdrawService' ,'Utils','$log', '$timeout', '$uibModal', '$sce', 'localStorageService', '$httpParamSerializer', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$filter'];
    function DashboardController($scope, $rootScope, $state,$translate, DashboardService, MemberService, SeyfertWithdrawService , Utils, $log, $timeout, $uibModal, $sce, localStorageService, $httpParamSerializer, DTOptionsBuilder, DTColumnDefBuilder, $filter) {
        var vm = this;
		var timeTotalMember;
		var timeTotalInfo;
		var timeTopTransaction;
		var timeMemberVerifiedStatus;
		
		var isMonitoring = false;
		$scope.systemStatus = true;
		(function initController() {
        	$log.debug("dashboard init");
			if($state.current.name == 'index.monitoring'){
				//getCurrencyExchageRate();
				getMemberVerifiedStatus();
			}
			if($state.current.name == 'index.dashboard'){
				topFollowed();
			}
			getTotalMember();
			topTransaction();
			getTotalInfo();
			topMember();
			vm.isAdmin = $rootScope.globals.currentUser.isAdmin;
			if(vm.isAdmin){
				getSeyfertTotalAmt();
			}
			
			
        })();

		
		$scope.tempTabStatistics = 'modules/dashboard/views/statistics.html'+Utils.getExtraParams();
		$scope.tempTabNotice = 'modules/dashboard/views/notice.html'+Utils.getExtraParams();
		//$scope.tempDashboardChart = 'modules/transaction/views/transactionChart.html';
		$scope.tempDashboardChart = 'modules/dashboard/views/dashboardChart.html'+Utils.getExtraParams();
		
        $scope.dtOptions = { paging: false, searching: false , lengthChange: false, ordering: false, info: false, pagingType: "numbers"};
		
		$scope.dtOptionsTrans = DTOptionsBuilder.newOptions()
		.withPaginationType('numbers')
		.withDisplayLength(10)
		.withOption('paging',true)
		.withOption('searching',false)
		.withOption('lengthChange',false)
		.withOption('ordering',false)
		.withOption('info',false)
		.withOption('pagingType',"numbers")
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
            }
        })
		.withButtons([
            {
				extend: 'print',
				text: "<i class='fa fa-print text-navy'></i>&nbsp;|&nbsp;Print",
				//className: '',
				exportOptions: {
					modifier: {
						page: 'all'
					}
				}
			},
			{
				extend: 'excel',
				filename: 'Top_50_Transaction_' + $filter('date')(new Date(), 'yyyy-MM-dd'),
				text: "<i class='fa fa-file-excel-o text-navy'></i>&nbsp;|&nbsp;Excel",
				exportOptions: {
					modifier: {
						page: 'all'
					}
				}
			},
			{
				extend: 'pdf',
				filename: 'Top_50_Transaction_' + $filter('date')(new Date(), 'yyyy-MM-dd'),
				text: "<i class='fa fa-file-pdf-o text-danger'></i>&nbsp;|&nbsp;PDF",
				exportOptions: {
					modifier: {
						page: 'all'
					}
				}
			}
        ]);

		$scope.options = { 
    			responsive: true,
    		    maintainAspectRatio: false, 
    		    legend: { display: false }
    	};
		
		$scope.seriesTrans = ['Member'];
		
		$scope.viewChartByTime = 'Day';
		$scope.$watch('viewChartByTime', function (newVal, oldVal) {
        	$log.debug('newVal: ' + newVal);
        	$log.debug('oldVal: ' + oldVal);
			if($state.current.name == 'index.dashboard'){
				getListCntTrans(newVal);
			}
        });
		
		vm.tabSelected = function(tab) {
			$log.debug('tabSelected: ' + tab);
			if(tab == 'statistics'){
				
			}else if(tab == 'notice'){
				getListNotice(20,1);
			}
		};
		
		$scope.tempTicketForm = 'modules/dashboard/views/noticeForm.html'+Utils.getExtraParams();

		$scope.loadDataForm = true;
		$scope.showError = false;
		vm.initTicketForm  = function() {
			$log.debug('initTicketForm: ' + $scope.isCollapsed);
			$scope.isCollapsed = ($scope.isCollapsed) ? false : true;
			$scope.loadDataForm = false;
		};
		
		vm.createTicket = function() {
			vm.dataLoading = true;
			
			$log.debug('ticket: ' + JSON.stringify(vm.ticket));
			$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.ticket));
			DashboardService.createTicket($httpParamSerializer(vm.ticket)).then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			getListNotice(20,1);
					$scope.isCollapsed = false;// close searchForm
				}else{
					$scope.showError = true;
				}
			});
		};
		
		function getTotalMember() {
			$log.debug('getTotalMember');
			//count 건수 9999 로 제한 
//			$scope.totalMemberRegister = "9999";
			$scope.dataTotalLoading = true;
			MemberService.getTotalMember().then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			var objTotal = response.data.result;
					$scope.totalMemberRegister = objTotal.totalCount;
				}else{
					$timeout.cancel(timeTotalMember);
					$scope.showErrorStatus = true;
				}
				$scope.dataTotalLoading = false;				
            });
			if($state.current.name == 'index.monitoring'){
				timeTotalMember = $timeout(getTotalMember, 30000);
			}else{
				$timeout.cancel(timeTotalMember);
			}
		}
		
		function getMemberVerifiedStatus() {
			
			$scope.dataTotalLoading = true;
			MemberService.getTotalPhoneStatus().then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			var objTotal = response.data.result;
					$scope.verifiedPhones = objTotal.verified_phones;
				}else{
					$timeout.cancel(timeMemberVerifiedStatus)
					$scope.showErrorStatus = true;
				}
				$scope.dataTotalLoading = false;				
            });
			MemberService.getTotalEmailStatus().then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			var objTotal = response.data.result;
					$scope.verifiedEmails = objTotal.verified_emails;
				}else{
					$timeout.cancel(timeMemberVerifiedStatus)
					$scope.showErrorStatus = true;
				}
				$scope.dataTotalLoading = false;				
            });
			if($state.current.name == 'index.monitoring'){
				timeMemberVerifiedStatus = $timeout(getMemberVerifiedStatus, 30000);
			}else{
				$timeout.cancel(timeMemberVerifiedStatus);
			}
		}
		
		function getCurrencyExchageRate() {
			
			DashboardService.getCurrencyExchageRate('baseCrrncy=USD&dstCrrncy=KRW').then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$scope.crrncyRate = response.data.result[0].crrncyRate;
				}else{
					$scope.showError = true;
				}
			});
		}
		
		function getListNotice(limit, page) {
			$scope.dataNoticeLoading = true;
			DashboardService.getListNotice(limit, page).then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			vm.listTicket = response.data.result.ticketList;
				}else{
					$scope.showErrorNotice = true;
				}
				$scope.dataNoticeLoading = false;
			});
		}
		function getListCntTrans(bytime) {
			$scope.dataTrans = [];
			$scope.labelsTrans = [];
			$scope.dataChartLoading = true;
			
			var param = 'graph=day';
			
			if(bytime == 'Hour'){
				param = 'graph=hour';
			}
			$scope.showErrorChart = false;
			DashboardService.getListCntTrans(param).then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			var resultList = response.data.graphList;
					angular.forEach(resultList, function(value, key) {
						if(bytime == 'Hour'){
							$scope.labelsTrans.push(value.mm);
						}else{
							$scope.labelsTrans.push(value.hh);
						}
						if(value.cnt == 0){
							$scope.showErrorChart = true;
						}
						$scope.dataTrans.push(value.cnt);
					});
					$log.debug('$scope.dataTrans: ' + $scope.dataTrans);
        	
				}else{
					$scope.showErrorChart = true;
				}
				$scope.dataChartLoading = false;		
			});
			
		}
		
		function getTotalInfo(){
			var totalToday = {};
			var totalGrand = {};
			var totalMerchant = {};
			var totalMember = {};
			
			$scope.array =[];
			
			/*totalToday.won    = 0;
			totalGrand.won    = 0;
			totalToday.usd    = 0;
			totalGrand.usd    = 0;
			totalToday.jpy    = 0;
			totalGrand.jpy    = 0;
			totalMerchant.won = 0;
			totalMerchant.usd = 0;
			totalMerchant.jpy = 0;
			totalMember.won   = 0;
			totalMember.usd   = 0;
			totalMember.jpy   = 0;*/
			
			//total KRW
			vm.dataTotalLoading = true;
			DashboardService.getTotalInfo('listType=totalAmt&crrncyCd=KRW').then(function (response) {
				$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			console.log( response.data);
        			$log.debug("data:" + response.data);
					var dt = response.data.result.SeyfertList;
					$log.debug("data response.result.SeyfertList:" + dt[0].todayAmt);
					totalToday.won = dt[0].todayAmt;
					totalGrand.won = dt[0].totalAmt;
					
					var tmpGrand = [];
					tmpGrand.amount = totalGrand.won;
					tmpGrand.crrncyCd = "KRW";
					$scope.array.push(tmpGrand);
					
					
        		}else{
					$timeout.cancel(timeTotalInfo);
				}
				vm.dataTotalLoading = false;
            });
			
			//total USD
			vm.dataTotalLoading = true;
			DashboardService.getTotalInfo('listType=totalAmt&crrncyCd=USD').then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$log.debug("data:" + response.data);
					var dt = response.data.result.SeyfertList;
					$log.debug("data response.result.SeyfertList:" + dt[0].totalAmt);
					totalToday.usd = dt[0].todayAmt;
					totalGrand.usd = dt[0].totalAmt;
					
					var tmpGrand = [];
					tmpGrand.amount = totalGrand.usd;
					tmpGrand.crrncyCd = "USD";
					$scope.array.push(tmpGrand);
        		}else{
					$timeout.cancel(timeTotalInfo);
				}
				vm.dataTotalLoading = false;
            });
			
			//total JPY
			vm.dataTotalLoading = true;
			DashboardService.getTotalInfo('listType=totalAmt&crrncyCd=JPY').then(function (response) {
				$log.debug(response.status);
				if(response.status == 'SUCCESS'){
					$log.debug("data:" + response.data);
					var dt = response.data.result.SeyfertList;
					$log.debug("data response.result.SeyfertList:" + dt[0].totalAmt);
					totalToday.jpy = dt[0].todayAmt;
					totalGrand.jpy = dt[0].totalAmt;
					
					var tmpGrand = [];
					tmpGrand.amount = totalGrand.jpy;
					tmpGrand.crrncyCd = "JPY";
					$scope.array.push(tmpGrand);
					
				}else{
					$timeout.cancel(timeTotalInfo);
				}
				vm.dataTotalLoading = false;
			});
			
			
			//merchant WON
			vm.dataTotalLoading = true;
			DashboardService.getTotalInfo('listType=merTotalAmt&crrncyCd=KRW').then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$log.debug("data:" + response.data);
					var dt = response.data.result.SeyfertList;
					$log.debug("data response.result.SeyfertList:" + dt[0]);
					totalMerchant.won = dt[0].totalAmt;
        		}else{
					$timeout.cancel(timeTotalInfo);
				}
				vm.dataTotalLoading = false;
            });
			
			
			
			//merchant USD
			vm.dataTotalLoading = true;
			DashboardService.getTotalInfo('listType=merTotalAmt&crrncyCd=USD').then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$log.debug("data:" + response.data);
					var dt = response.data.result.SeyfertList;
					$log.debug("data response.result.SeyfertList:" + dt[0]);
					totalMerchant.usd = dt[0].totalAmt;
        		}else{
					$timeout.cancel(timeTotalInfo);
				}
				vm.dataTotalLoading = false;
            });
			
			//merchant JPY
			vm.dataTotalLoading = true;
			DashboardService.getTotalInfo('listType=merTotalAmt&crrncyCd=JPY').then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$log.debug("data:" + response.data);
					var dt = response.data.result.SeyfertList;
					$log.debug("data response.result.SeyfertList:" + dt[0]);
					totalMerchant.jpy = dt[0].totalAmt;
        		}else{
					$timeout.cancel(timeTotalInfo);
				}
				vm.dataTotalLoading = false;
            });
			
			//member WON
			vm.dataTotalLoading = true;
			DashboardService.getTotalInfo('listType=memTotalAmt&crrncyCd=WON').then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$log.debug("data:" + response.data);
					var dt = response.data.result.SeyfertList;
					$log.debug("data response.result.SeyfertList:" + dt[0]);
					totalMember.won = dt[0].totalAmt;
        		}else{
					$timeout.cancel(timeTotalInfo);
				}
				vm.dataTotalLoading = false;
            });
			
			//member USD
			vm.dataTotalLoading = true;
			DashboardService.getTotalInfo('listType=memTotalAmt&crrncyCd=USD').then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$log.debug("data:" + response.data);
					var dt = response.data.result.SeyfertList;
					$log.debug("data response.result.SeyfertList:" + dt[0]);
					totalMember.usd = dt[0].totalAmt;
					
        		}else{
					$timeout.cancel(timeTotalInfo);
				}
				vm.dataTotalLoading = false;
            });
			
			
			
			//member JPY
			vm.dataTotalLoading = true;
			DashboardService.getTotalInfo('listType=memTotalAmt&crrncyCd=JPY').then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$log.debug("data:" + response.data);
					var dt = response.data.result.SeyfertList;
					$log.debug("data response.result.SeyfertList:" + dt[0]);
					totalMember.jpy = dt[0].totalAmt;
					
        		}else{
					$timeout.cancel(timeTotalInfo);
				}
				vm.dataTotalLoading = false;
            });
			
			
			$scope.totalToday = totalToday;
			$scope.totalGrand = totalGrand;
			$scope.totalMerchant = totalMerchant;
			$scope.totalMember = totalMember;
			
			if($state.current.name == 'index.monitoring'){
				timeTotalInfo = $timeout(getTotalInfo, 20000);
			}else{
				$timeout.cancel(timeTotalInfo);
			}
			
		}
		
		function topTransaction(){
			$log.debug("topTransaction");
			vm.topTransaction = [];
			vm.topTransactionLoading = true;
			DashboardService.topTransaction(50,1,'top=fifty').then(function (response) {
        		$log.debug(response.status);
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
        			
//        			
//        			if(response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
//        				$state.go('login');;
//                    	if (!$rootScope.$$phase) $rootScope.$apply();
//        			}else{
//        				throw resonse;
//        			}
        			
        		}else if(response.status == 'SUCCESS'){
        			$log.debug(response.data);
					vm.topTransactionLoading = false;
					vm.topTransaction = response.data.transactionList;
					
        		}   
            });
			if($state.current.name == 'index.monitoring'){
				timeTopTransaction = $timeout(topTransaction, 40000);
			}else{
				$timeout.cancel(timeTopTransaction);
			}
			
		}
		
		function topMember(){
			vm.topMember = [];
			DashboardService.topTransaction(10,1,'top=ten').then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'ERROR'){
        			
					$scope.systemStatus = false;
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
					
//					Utils.getErrorHanler(response.data.cdKey , response.data.cdDesc);
//					vm.searchDisalbed = false;
//        			vm.loadDataForm = false;
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
        			$log.debug("data:" + response.data);
					vm.dataFormLoading = false;
					vm.topMember = response.data.transactionList;
					$scope.systemStatus = true;
        		}   
            });
		}
		
		function topFollowed(){
			vm.topFollowed = [];
			DashboardService.topFollowed().then(function (response) {
        		$log.debug(response.status);
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
        			$log.debug("data:" + response.data);
					vm.dataFormLoading = false;
					vm.topFollowed = response.data.resultList;
					
        		}   
            });
		}
		
	    function getSeyfertTotalAmt(){
	    	 
	    	$log.debug("getSeyfertTotalAmt");
	    	$scope.seyfertTotalAmt = [];
			$scope.loadDataForm = true;
			DashboardService.getSeyfertTotalAmt().then(function (response) {
	    		$log.debug(response.status);
	    		if(response.status == 'SUCCESS'){
	    			$log.debug("getSeyfertTotalAmt" + response.data );
					$scope.seyfertTotalAmt = response.data;
					$log.debug("getSeyfertTotalAmt crrncyCd:" + response.data[0].crrncyCd);
					$log.debug("getSeyfertTotalAmt totAmt:" + response.data[0].totAmt);
					$scope.loadDataForm = false;	
	    		}	
	    		else{
	    			$log.debug("DashboardService.getSeyfertTotalAmt ERROR");
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
   
	    //ADD MORE CODE HERE
	    
    }// END CONTROLLER   

})();
