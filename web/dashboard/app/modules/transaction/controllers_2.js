(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('TransactionController', TransactionController)
    	.controller('TransactionDetailController', TransactionDetailController)
    	.controller('TransactionChartController', TransactionChartController);
		
    

    TransactionController.$inject = ['$scope','$rootScope','$state', '$translate', 'TransactionService','Utils','$log', '$timeout', '$uibModal', '$sce', 'localStorageService', '$httpParamSerializer'];
	
    function TransactionController($scope, $rootScope, $state,$translate, TransactionService, Utils, $log, $timeout, $uibModal, $sce, localStorageService, $httpParamSerializer) {
        var vm = this;
        var timer;
        var animationsEnabled = true;
        var sizeModal = 'lg';
        
		var limit = localStorageService.get('limit');
		if(limit == null){
			limit = 20;
		}
		
		(function initController() {
        	$log.debug("Transaction init");
        })();
        
		vm.content = [];
        vm.trans = {};
		vm.dataTablesInfo = null;
		vm.rangeDate = {startDate: null, endDate: null};
        vm.maxSize = 5;
        vm.totalItems = 64;
        vm.currentPage = 1;
        $scope.tempSearchForm = 'modules/transaction/views/searchForm.html';
		
		$scope.listData = [];
		
        
        vm.optionsViewBy = ['20', '30', '50'];
        vm.viewby = limit;
        
        $scope.transactionDetail = '';
		$scope.sortType     = 'tid'; // set the default sort type
		$scope.sortReverse  = false;  // set the default sort order
  
        $scope.dateFormat = Utils.dateFormat().yyyyMMddHHmmss;
        
		$scope.dtOptionsTrans = DTOptionsBuilder.newOptions()
		.withPaginationType('numbers')
		.withDisplayLength(10)
		.withOption('paging',true)
		.withOption('searching',false)
		.withOption('lengthChange',false)
		.withOption('ordering',false)
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
        })
		.withButtons([
            {
				extend: 'print',
				text: "<i class='fa fa-print'></i>&nbsp;|&nbsp;Print",
				//className: '',
				exportOptions: {
					modifier: {
						page: 'all'
					}
				}
			},
			{
				extend: 'excel',
				filename: 'List_Transaction_p' + vm.currentPage+ "_" + $filter('date')(new Date(), 'yyyy-MM-dd'),
				text: "<i class='fa fa-file-excel-o'></i>&nbsp;|&nbsp;Excel",
				exportOptions: {
					modifier: {
						page: 'all'
					}
				}
			},
			{
				extend: 'pdf',
				filename: 'List_Transaction_p' + vm.currentPage+ "_"  + $filter('date')(new Date(), 'yyyy-MM-dd'),
				text: "<i class='fa fa-file-pdf-o'></i>&nbsp;|&nbsp;PDF",
				exportOptions: {
					modifier: {
						page: 'all'
					}
				}
			}
        ]);
		
		
        vm.setItemsPerPage = function() {
        	$log.debug('viewby: ' + vm.viewby);
			$log.debug('currentPage: ' + vm.currentPage);
			localStorageService.set('limit', vm.viewby);
			transactionList(vm.currentPage,vm.viewby,'');
        };
        
		
		$scope.viewByTime = localStorageService.get('viewByTime');
		if($scope.viewByTime == null || $scope.viewByTime == 'All'){
			$log.debug('viewByTime1111111: ');
			$scope.viewByTime = 'Day';
		}
		$log.debug('viewByTime: ' + $scope.viewByTime);
        $scope.$watch('viewByTime', function (newVal, oldVal) {
        	$log.debug('newVal: ' + newVal);
        	$log.debug('oldVal: ' + oldVal);
			localStorageService.set('viewByTime', newVal);
			var paramStr = 'viewByTime='+ newVal;
			transactionList(1,limit, paramStr);
        });
        
        

        vm.pageChanged = function() {
          $log.debug('Page changed to: ' + vm.currentPage);
		  $log.debug('viewby: ' + vm.viewby);
		  var paramStr = 'viewByTime='+ $scope.viewByTime;
		  transactionList(vm.currentPage,vm.viewby, paramStr);
        };

		        
        vm.searchSubmit = function() {
			$log.debug('search: ' + $scope.search);
			if($scope.search == ''){
				return;
			}
			var paramStr = 'searchText='+ $scope.search + '&viewByTime=All';
			transactionList(1,limit, paramStr);
		};

		$scope.typeList = [];
		$scope.statusList = [];
		$scope.currencyList = [];
		
		$scope.loadDataForm = true;
		vm.initAdvSearch  = function() {
			$log.debug('initAdvSearch: ' + $scope.isCollapsed);
			$scope.isCollapsed = ($scope.isCollapsed) ? false : true;
			TransactionService.getListDataSearchForm().then(function (response) {
        		$log.debug(response.status);
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
        		}else if(response.status == 'SUCCESS'){
        			$log.debug("data:" + response.data);
        			var obj = Utils.getJsonObj(response.data);
					if(Utils.isUndefinedOrNull(obj.status)){
        				if(obj.status == "ERROR"){
	        				swal({
	                      	  title: $translate.instant('ERROR'),
	                      	  text: obj.data.cdKey + ":" + obj.data.cdDesc +"\nTry login again" ,
	                      	  type: "error",
	                      	  confirmButtonText: $translate.instant('btnOK')
	                      	});
	        				if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
	            				$state.go('login');
	                        	if (!$rootScope.$$phase) $rootScope.$apply();
	            			}
        				}
        			}else{
        				$scope.typeList = obj.result.typeList;
						$scope.statusList = obj.result.statusList;
						$scope.currencyList = obj.result.currencyList;
					}
					
				}
				$scope.loadDataForm = false;				
            });
					
		};
		
		vm.advSearch = function() {
			vm.dataLoading1 = true;
			$log.debug('trans: ' + JSON.stringify(vm.trans));
			
			$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.trans));
			
			vm.dataLoading1 = false;
			$scope.isCollapsed = false;// close searchForm
			
			transactionList(1,limit, $httpParamSerializer(vm.trans) + '&searchText=&viewByTime=All');
		};
			       
		$scope.getStyleStatus = function (status){
			var htmlContent = ''; 
			if(status.includes('_FINISHED') || status.includes('_FINISH_'))
				htmlContent =  '<span class="label label-success">FINISHED</span>';
			else if(status.includes('_TIME_OUT'))
				htmlContent = '<span class="label label-warning">TIME_OUT</span>';
			else if(status.includes('_INIT'))
				htmlContent = '<span class="label label-primary">INIT</span>';
			else if(status.includes('_IGNORED'))
				htmlContent = '<span class="label label-info">IGNORED</span>';
			else if(status.includes('_FAILED'))
				htmlContent = '<span class="label label-danger">FAILED</span>';
			else if(status.includes('_CANCELED'))
				htmlContent = '<span class="label label-danger">CANCELED</span>';
			else if(status.includes('_DENIED'))
				htmlContent = '<span class="label label-danger">DENIED</span>';
			else if(status.includes('_TRYING'))
				htmlContent = '<span class="label label-primary">TRYING</span>';
			else if(status.includes('_RELEASED'))
				htmlContent = '<span class="label label-info">RELEASED</span>';
			else if(status.includes('_MONEY_REQUSTED'))
				htmlContent = '<span class="label label-default">MONEY_REQUSTED</span>';
			else if(status.includes('_REQ_HOLD'))
				htmlContent = '<span class="label label-info">REQ_HOLD</span>';
			else if(status.includes('_AGRREED'))
				htmlContent = '<span class="label label-success">AGRREED</span>';
			else 
				htmlContent = '<span class="label label-default">' + status + '</span>';

			return $sce.trustAsHtml(htmlContent);
		}

		$scope.transactionChart = 'modules/transaction/views/transactionChart.html';
		
		
		$scope.getTransactionDetail = function(transactionDetail) {

			var modalInstance = $uibModal
					.open({
						animation : animationsEnabled,
						templateUrl : 'modules/transaction/views/transactionDetail.html',
						controller : 'TransactionDetailController',
						size : sizeModal,
						backdrop: 'static',
						keyboard: false,
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
		
		function transactionList(page, limit, paramStr) {
			$log.debug('start transactionList: ' + new Date());
        	vm.dataLoading1 = true;
			vm.dataLoading2 = true;
        	TransactionService.getList(page, limit, paramStr).then(function (response) {
        		$log.debug(response.status);
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
        		}else if(response.status == 'SUCCESS'){
        			$log.debug("data:" + response.data);
        			var obj = Utils.getJsonObj(response.data);
        			
        			if(Utils.isUndefinedOrNull(obj.status)){
        				//fix bug server response, format not standard
        				//server response data have '\n'
        				if(obj.status == "ERROR"){
	        				swal({
	                      	  title: $translate.instant('ERROR'),
	                      	  text: obj.data.cdKey + ":" + obj.data.cdDesc +"\nTry login again" ,
	                      	  type: "error",
	                      	  confirmButtonText: $translate.instant('btnOK')
	                      	});
	        				if(obj.data.cdKey == 'SESSION_EXPIRED' || obj.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'){
	            				$state.go('login');
	                        	if (!$rootScope.$$phase) $rootScope.$apply();
	            			}
        				}
        			}else{
        				$log.debug("transactionList:");
	        			$log.debug(obj.result.transactionList);
	        			vm.content = obj.result.transactionList;

	        			//pagination config
	        			vm.totalItems = obj.result.total;
	        			vm.itemsPerPage = vm.viewby;
	        			vm.maxSize = 5; // Number of pager buttons to show
						$log.debug("totalItems:" + vm.totalItems);
						$log.debug("itemsPerPage:" + vm.itemsPerPage);
						vm.dataTablesInfo = 'Showing ' + ((vm.currentPage -1)*vm.itemsPerPage + 1) + ' to ' + ((vm.currentPage*vm.itemsPerPage > vm.totalItems) ? vm.totalItems : vm.currentPage*vm.itemsPerPage) + ' of ' + vm.totalItems + ' entries';
	        			vm.dataLoading1 = false;
						vm.dataLoading2 = false;
        			}
        		}   
            });
        	
        };		
    }

    function TransactionChartController($scope, Utils, $timeout, $log, $translate, $rootScope, TransactionService) {
		$scope.totalAmt = {};
		$scope.defaultValue = 0;
		$scope.dataTotalLoading = true;
    	$scope.dataChartLoading = true;
		//total amount
		TransactionService.getTotal().then(function (response) {
			$log.debug(response.status);
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
			}else if(response.status == 'SUCCESS'){
				var obj = Utils.getJsonObj(response.data);
				$log.debug("getTotal obj:" + obj);
				$scope.totalAmt = obj.result.totalList;
			}   
			$scope.dataTotalLoading = false;
		});
			
    	
    	$scope.colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
    	$scope.options = { 
    			responsive: true,
    		    maintainAspectRatio: false, 
    		    legend: { display: true }
    	};
		
		$scope.totalChart = {};
		$scope.labels = [];
		$scope.data = [];
		$scope.datasetOverride = [];
		$scope.viewChartByTime = 'Day';
		
		//total amount chart
		function getTotalChart(pTime){
			var paramStr = 'viewBy='+ pTime;
			TransactionService.getTotalChart(paramStr).then(function (response) {
				$log.debug(response.status);
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
				}else if(response.status == 'SUCCESS'){
					var obj = Utils.getJsonObj(response.data);
					$log.debug("getTotal obj:" + obj);
					var totalChartList = obj.result.totalList;
					
					var totalTrans = [];
					
					
					$scope.listCurrency = [];
					$scope.datasetOverride = [];
					$scope.labels = [];
					$scope.data = [];
					  
					var listCurrency = [];
					var listCreateDate = [];
					  
					var totalChartListChange = [];
					  
					angular.forEach(totalChartList, function(value, key) {
						$log.debug(key + ': ' + value.orgCrrncy);
						//if exits totalChartListChange[value.orgCrrncy]
						var crd = totalChartListChange[value.orgCrrncy];
						if(crd != null){
							crd = crd + ", " + key;
						}else{
							crd = key;
						}
						totalChartListChange[value.orgCrrncy] =crd;
						
						if(!~listCreateDate.indexOf(value.createDt)) {
							listCreateDate.push(value.createDt);
							$scope.labels.push(value.createDt)
						}
						
						if(!~listCurrency.indexOf(value.orgCrrncy)) {
							var c = {
								label: value.orgCrrncy,
								borderWidth: 1,
								type: 'bar',
							}
							listCurrency.push(value.orgCrrncy);
							$scope.datasetOverride.push(c);
						}
						totalTrans.push(value.totalTrans);						
					});
					  
					angular.forEach(listCurrency, function(value, key) {
						var listKey = totalChartListChange[value].toString();
						var res = listKey.split(",");
						var subListData = [];
						
						$log.debug("listKey" + listKey);
						
						for(i=0;i<listCreateDate.length;i++){
							subListData.push(0);
						}

						for(i=0;i<res.length;i++){

							var obj = totalChartList[parseInt(res[i])];

							$log.debug("obj:" + obj.createDt);

							var pos = listCreateDate.indexOf(obj.createDt)
							$log.debug("pos value:" + pos);

							subListData[pos] = parseInt(obj.totalAmt);
						}

						$log.debug("after change subListData:" + subListData);

						$scope.data.push(subListData);
						$log.debug(subListData);
					});

					var ttr = {
								label: "Total transactions",
								borderWidth: 3,
								hoverBackgroundColor: "rgba(255,99,132,0.4)",
								hoverBorderColor: "rgba(255,99,132,1)",
								type: 'line'
							} 
					$scope.datasetOverride.push(ttr);
					$scope.data.push(totalTrans);
				}   
				$scope.dataChartLoading = false;
			});
		}
		
		
		
		
        $scope.$watch('viewChartByTime', function (newVal, oldVal) {
        	$log.debug('newVal: ' + newVal);
        	$log.debug('oldVal: ' + oldVal);
			$scope.dataChartLoading = true;
			getTotalChart(newVal);
        });
        
    }
    
    function TransactionDetailController($scope, $uibModalInstance, Utils , transactionDetail, $log) {
		
		$scope.transactionDetail = transactionDetail;
		$scope.dateFormat = Utils.dateFormat().yyyyMMddHHmmss;
		
		$scope.ok = function() {
			$log.debug("OK click");
			$uibModalInstance.close($scope.selected.item);
		};

		$scope.cancel = function() {
			$log.debug("cancel click");
			$uibModalInstance.dismiss('cancel');
		};
	}

    
})();