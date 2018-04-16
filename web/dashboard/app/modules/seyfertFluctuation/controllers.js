(function(){
	'use strict';
	
	angular
		.module('inspinia')
		.controller('FluctuationController',FluctuationController);
	
	FluctuationController.inject = ['$scope','$rootScope' ,'Utils' ,'MemberService'
		,'$log' ,'$httpParamSerializer', 'DTOptionsBuilder', 'DTColumnDefBuilder',
		'$filter' ,'TransactionService' , '$uibModal' , '$state' ,'$translate' , '$q'];
	function FluctuationController($scope , $rootScope , 
			Utils , MemberService , $log ,$httpParamSerializer ,
			DTOptionsBuilder,	DTColumnDefBuilder, $filter ,TransactionService ,$uibModal ,
			$state ,$translate ,$q){
		console.log("hell o ");
		var vm = this;
		vm.trans = {};
		
		(function initController(){
			console.log("init FluctuationController");
			console.log($state.params.guid);
			console.log($state.params.tid);
			
			var guid = $state.params.guid;
			var tid = $state.params.tid;
			if(!(Utils.isNullOrUndifined(guid)) 
				&& !(Utils.isNullOrUndifined(tid))
				&& (guid != '') && (tid !='') 
				){
				
				
				var param = "dstMemGuid="+guid+"&tid="+tid;
				$log.debug('param1111: ' + param);
				$scope.pagingParamStr = param;
				var limit = 20; 
				vm.trans.dstMemGuid = guid;
				vm.trans.tid = tid;
				
				var promise = transactionList(1, limit, param);
				
				promise.then(function(value) {
					$scope.getTransactionDetail(value[0]);
				}, function(reason) {
				})
				
			}else if(!(Utils.isNullOrUndifined(guid)) && (guid != '')){
				var param = "dstMemGuid="+guid;
				$log.debug('param1111: ' + param);
				$scope.pagingParamStr = param;
				var limit = 20; 
				vm.trans.dstMemGuid = guid;
				
				transactionList(1, limit, param);
			}
		})();
		
		
		
		$scope.isCollapsed = true;
		$scope.tempSearchForm = 'modules/seyfertFluctuation/views/searchForm.html'+Utils.getExtraParams();

		vm.content = [];
		
		vm.dataTablesInfo = null;
		vm.rangeDate = {
				startDate : null,
				endDate : null
		};
		vm.optionsViewBy = [ '20', '30', '50' ];
		vm.rangeUpdateDt = {
			startDate : null,
			endDate : null
		};
		vm.maxSize = 5;
		vm.totalItems = 64;
		vm.currentPage = 1;
		var limit = 20 ;
		
		var animationsEnabled = true;
		var sizeModal = 'lg';
		
		$scope.dateFormat = Utils.dateFormat().yyyyMMddHHmmss;
		
		$scope.dtOptionsTrans = DTOptionsBuilder.newOptions()
		.withPaginationType('full_numbers')
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
		.withButtons([
			{
				extend : 'print',
				text : "<i class='fa fa-print text-success'></i>&nbsp;|&nbsp;Print",
				//className: '',
				exportOptions : {
					modifier : {
						page : 'all'
					}
				}
			}
/*			,
			{
				extend : 'excel',
				filename : 'List_Transaction_p' + vm.currentPage + "_" + $filter('date')(new Date(), 'yyyy-MM-dd'),
				text : "<i class='fa fa-file-excel-o text-navy'></i>&nbsp;|&nbsp;Excel",
				exportOptions : {
					modifier : {
						page : 'all'
					}
				}
			},
			{
				extend : 'pdf',
				filename : 'List_Transaction_p' + vm.currentPage + "_" + $filter('date')(new Date(), 'yyyy-MM-dd'),
				text : "<i class='fa fa-file-pdf-o text-danger'></i>&nbsp;|&nbsp;PDF",
				exportOptions : {
					modifier : {
						page : 'all'
					}
				}
			},
			{
				text : "<i class='fa fa-file-excel-o text-navy'></i>&nbsp;|&nbsp;Download All",
				action : function(e, dt, node, config) {
					$log.debug('Button Download All activated');
					exportTransactionExcel();
				}
			}*/
		]);
		
		vm.advSearch = function() {
			vm.dataLoading1 = true;
			$scope.invalidAdvSearch = false;
			
			var trnsctnDtFrom = '',
				trnsctnDtTo = '';
			

			if ((vm.rangeDate.startDate != null) && (vm.rangeDate.endDate != null)) {
				trnsctnDtFrom = moment(vm.rangeDate.startDate).format("YYYYMMDD");
				trnsctnDtTo = moment(vm.rangeDate.endDate).format("YYYYMMDD");
			}
			
			vm.dataLoading1 = false;
			if ((Object.keys(vm.trans).length == 0) && (trnsctnDtFrom == '')) {
				$log.debug('invalidAdvSearch');
//				$scope.isCollapsed = true;
				$scope.invalidAdvSearch = true;

			} else {
				var param = $httpParamSerializer(vm.trans)+'&fromDt=' + trnsctnDtFrom + '&toDt=' + trnsctnDtTo ;
				$log.debug('param1111: ' + param);
				$scope.pagingParamStr = param;
				transactionList(1, limit, param);
			}
		};
		var paramExportAll = '';
		vm.viewby = limit;
		function transactionList(page, limit, paramStr) {
			return $q(function(resolve,reject){
				$scope.transaction = {};
				$scope.transaction.list = {};
				
				console.log("TransactionList");
				console.log(paramStr);
				
				MemberService
				.getRecentTransaction(paramStr)
				.then(
						function(response) {
							$log.debug(response.status);
							if (response.status == 'SUCCESS') {
								$scope.transaction.list = response.data.list;
								console.log(response.data);
								
								vm.totalItems = response.data.totalCount;
			                    vm.totalItems = vm.totalItems.length > 9999 ? 9999 : vm.totalItems  
			                    
								vm.itemsPerPage = vm.viewby;
								vm.maxSize = 5; // Number of pager buttons to show
								$log.debug("totalItems:" + vm.totalItems);
								$log.debug("itemsPerPage:" + vm.itemsPerPage);
								vm.dataTablesInfo = 'Showing ' + ((vm.currentPage - 1) * vm.itemsPerPage + 1) + ' to ' + ((vm.currentPage * vm.itemsPerPage > vm.totalItems) ? vm.totalItems : vm.currentPage * vm.itemsPerPage) + ' of ' + vm.totalItems + ' entries';
								
								resolve($scope.transaction.list);
							}
							else if (response.status == "ERROR") {
								/*if (response.data.cdKey == 'INVALID_PARAM_FORMAT') {
									$log.debug("INVALID_PARAM_FORMAT");
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
								
								reject();
							}
						});
			});
			/*
			 *  //TODO 프로그레스바 추가하기 
			vm.dataLoading1 = true;
			vm.dataLoading2 = true;
			*/
		
			
		};

		vm.pageChanged = function() {
			$log.debug('Page changed to: ' + vm.currentPage);
			$log.debug('viewby: ' + vm.viewby);
			var paramStr = $scope.pagingParamStr +"&page="+vm.currentPage +"&limit=" +vm.viewby;
			transactionList(vm.currentPage, vm.viewby, paramStr);
		};
		function getParamViewByTime() {
			var paramStr = '';
			var now = new Date();
			var newVal = $scope.viewByTime;
			if (newVal == 'today') {
				paramStr = 'fromDt=' + $filter('date')(now, 'yyyyMMdd');
				paramStr += '&toDt=' + $filter('date')(now, 'yyyyMMdd');
			} else if (newVal == 'yesterday') {
				var yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
				paramStr = 'fromDt=' + $filter('date')(yesterday, 'yyyyMMdd');
				paramStr += '&toDt=' + $filter('date')(yesterday, 'yyyyMMdd');
			} else if (newVal == 'lastweek') {
				var lastweek = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
				var day = lastweek.getDay();
				var diffToMonday = lastweek.getDate() - day + (day === 0 ? -6 : 1);
				
				var lastMonday = new Date(lastweek.setDate(diffToMonday));
				var lastSunday = new Date(lastweek.setDate(diffToMonday + 6));
				
				if(lastSunday.getDate() < lastMonday.getDate()){
					var now = new Date();
					lastSunday = (new Date(now.getFullYear(), now.getMonth(), lastSunday.getDate()));
				}
				
				paramStr = 'fromDt=' + $filter('date')(lastMonday, 'yyyyMMdd');
				paramStr += '&toDt=' + $filter('date')(lastSunday, 'yyyyMMdd');
			} else if (newVal == 'lastmonth') {
				var lastday = new Date(now.getFullYear(), now.getMonth(), 0);
				var firstday = new Date(lastday.getFullYear(), lastday.getMonth(), 1);
				paramStr = 'fromDt=' + $filter('date')(firstday, 'yyyyMMdd');
				paramStr += '&toDt=' + $filter('date')(lastday, 'yyyyMMdd');
			}else if(newVal == 'thisweek'){
				
				
				var thisMonday = new Date();
				var diffToMonday = thisMonday.getDate() - thisMonday.getDay() + (thisMonday.getDay() === 0 ? -6 : 1);
				var firstday = new Date(now.setDate(diffToMonday));
				
				paramStr = 'fromDt=' + $filter('date')(firstday, 'yyyyMMdd');
				paramStr += '&toDt=' + $filter('date')(new Date(), 'yyyyMMdd');
				
			}
			$log.debug(paramStr);
			
			return paramStr + "&" +$httpParamSerializer(vm.trans);
		}
		
		$scope.getTransactionDetail = function(transactionDetail) {

			var modalInstance = $uibModal
				.open({
					animation : animationsEnabled,
					templateUrl : 'modules/transaction/views/transactionDetail.html'+Utils.getExtraParams(),
					controller : 'TransactionDetailController',
					size : sizeModal,
					backdrop : 'static',
					keyboard : false,
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
		
		$scope.setItemsPerPage = function() {
			$log.debug('viewby: ' + vm.viewby);
			$log.debug('currentPage: ' + vm.currentPage);
			vm.currentPage = 1;
			var paramStr = $scope.pagingParamStr +"&page="+vm.currentPage +"&limit=" +vm.viewby;
			transactionList(vm.currentPage, vm.viewby, paramStr);
		};
		$scope.$watch('viewByTime', function(newVal, oldVal) {
			$log.debug('newVal: ' + newVal);
			$log.debug('oldVal: ' + oldVal);
			if ($state.current.name == 'index.seyfertFluctuation') {
				if(!(Utils.isNullOrUndifined(newVal)) && !(Utils.isNullOrUndifined(oldVal))){
					vm.currentPage = 1;
					var paramStr = getParamViewByTime() +"&page="+vm.currentPage +"&limit=" +vm.viewby;
					transactionList(1, limit, paramStr);
				}else{
					
				}
				
				
			}
		});
	}
	
	function FluctuationDetailsController(){
		
	}	
})();