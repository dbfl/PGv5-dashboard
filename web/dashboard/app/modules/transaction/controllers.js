
(function() {
	'use strict';

	angular
		.module('inspinia')
		.controller('TransactionController', TransactionController)
		.controller('TransactionDetailController', TransactionDetailController)
		.controller('TransactionChartController', TransactionChartController);



	TransactionController.$inject = [ '$scope', '$rootScope', '$state', '$translate', 'TransactionService', 'Utils', '$log', '$timeout', '$uibModal', '$sce', 'localStorageService', '$httpParamSerializer', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$filter', '$http' ];

	function TransactionController($scope, $rootScope, $state, $translate, TransactionService, Utils, $log, $timeout, $uibModal, $sce, localStorageService, $httpParamSerializer, DTOptionsBuilder, DTColumnDefBuilder, $filter, $http) {
		var vm = this;
		//var timer;
		var animationsEnabled = true;
		var sizeModal = 'lg';

		vm.isAdmin = $rootScope.globals.currentUser.isAdmin;
		
		var limit = localStorageService.get('limit');
		if (limit == null) {
			limit = 20;
		}
		vm.content = [];
		vm.trans = {};
		vm.dataTablesInfo = null;
		vm.rangeDate = {
			startDate : null,
			endDate : null
		};
		vm.rangeUpdateDt = {
			startDate : null,
			endDate : null
		};
		vm.maxSize = 5;
		vm.totalItems = 64;
		vm.currentPage = 1;
		$scope.tempSearchForm = 'modules/transaction/views/searchForm.html'+Utils.getExtraParams();

		$scope.listData = [];


		vm.optionsViewBy = [ '20', '30', '50' ];
		vm.viewby = limit;

		$scope.transactionDetail = '';
		$scope.sortType = 'tid'; // set the default sort type
		$scope.sortReverse = false; // set the default sort order

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
				/*{
					extend : 'print',
					text : "<i class='fa fa-print text-success'></i>&nbsp;|&nbsp;Print",
					//className: '',
					exportOptions : {
						modifier : {
							page : 'all'
						}
					}
				},
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

		(function initController() {
			$log.debug("Transaction init");
			
			$scope.params = $state.params;
		    console.log($scope.params);
		    
		    
		    if(!(Utils.isNullOrUndifined($scope.params.tid)) && $scope.params.tid != ''){
		    	vm.trans.tid =$state.params.tid;
			}
			if(!(Utils.isNullOrUndifined($scope.params.srcGuid)) && $scope.params.srcGuid != ''){
				vm.trans.srcMemGuid = $state.params.srcGuid;
			}
			if(!(Utils.isNullOrUndifined($scope.params.dstGuid)) && $scope.params.dstGuid != ''){
				vm.trans.dstMemGuid =$state.params.dstGuid;
			}
			
			
		})();
		
		vm.setItemsPerPage = function() {
			$log.debug('viewby: ' + vm.viewby);
			$log.debug('currentPage: ' + vm.currentPage);
			localStorageService.set('limit', vm.viewby);
			vm.currentPage = 1;
			var paramStr = getParamViewByTime();
			transactionList(vm.currentPage, vm.viewby, paramStr);
		};


		$scope.viewByTime = localStorageService.get('viewByTime');
		if ($scope.viewByTime == null) {
			$scope.viewByTime = 'today';
		}

		
		$scope.$watch('viewByTime', function(newVal, oldVal) {
			$log.debug('newVal: ' + newVal);
			$log.debug('oldVal: ' + oldVal);
			if ($state.current.name == 'index.transaction') {
				localStorageService.set('viewByTime', newVal);
				var paramStr = getParamViewByTime();
				// added by 초기 검색조건의 type =  SEYFERT_TRANSFER_PND  으로 지정 
				var hasParams = false;
				vm.trans.trnsctnTp = 'SEYFERT_TRANSFER_PND' ;
				
			    if(!(Utils.isNullOrUndifined($scope.params.tid)) && $scope.params.tid != ''){
			    	vm.trans.tid =$state.params.tid;
			    	hasParams = true;
				}
				if(!(Utils.isNullOrUndifined($scope.params.srcGuid)) && $scope.params.srcGuid != ''){
					vm.trans.srcMemGuid = $state.params.srcGuid;
					hasParams = true;
				}
				if(!(Utils.isNullOrUndifined($scope.params.dstGuid)) && $scope.params.dstGuid != ''){
					vm.trans.dstMemGuid =$state.params.dstGuid;
					hasParams = true;
				}
				
				if(hasParams){
					vm.advSearch();
				}else{
					transactionList(1, limit, paramStr+"trnsctnTp=SEYFERT_TRANSFER_PND");
				}
				
			}
		});

		vm.pageChanged = function() {
			$log.debug('Page changed to: ' + vm.currentPage);
			$log.debug('viewby: ' + vm.viewby);
			
			// 상세조건 조회후 페이지 이동 할 때 이전에 조회했던 파라미터의 값 유무 확인 
			var paramStr = Utils.isNullOrUndifined($scope.pagingParamStr) ? getParamViewByTime() : $scope.pagingParamStr;
			transactionList(vm.currentPage, vm.viewby, paramStr);
		};


		vm.searchSubmit = function() {
			$log.debug('search: ' + $scope.search);
			if ($scope.search == '') {
				return;
			}
			var paramStr = 'date=true';
			transactionList(1, limit, paramStr);
		};

		var paramExportAll = '';
		function exportTransactionExcel() {
			$log.debug('exportTransactionExcel param: ' + $httpParamSerializer(vm.trans));
			$log.debug('vm.totalItems: ' + vm.totalItems);
			var fileName = "List_Transaction_All_" + $filter('date')(new Date(), 'yyyy-MM-dd');
			TransactionService.getList(1, vm.totalItems, paramExportAll).then(function(response) {
				$log.debug(response.status);
				if (response.status == 'ERROR') {
					swal({
						title : $translate.instant('ERROR'),
						text : "Error!!! Can not download",
						type : "error",
						confirmButtonText : $translate.instant('btnOK')
					});
				} else if (response.status == 'SUCCESS') {
					$log.debug("data:" + response.data);
					var obj = Utils.getJsonObj(response.data);

					if (Utils.isUndefinedOrNull(obj.status)) {
						swal({
							title : $translate.instant('ERROR'),
							text : "Error!!! Can not download",
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					} else {
						$log.debug("jsonToExcel:");
						jsonToExcel(obj.transactionList, fileName);
					}
				}
			});
		}


		function jsonToExcel(jsonData, fileName) {
			var types = {
				"tid" : "String",
				"title" : "String",
				"orgAmt" : "String",
				"orgCrrncy" : "String",
				"trnsctnTp" : "String",
				"trnsctnSt" : "String",
				"updateDt" : "String"
			};

			var lableHeader = [
				"TID", "Title", "Amout", "Crrncy", "Type", "Status", "Date"
			];

			var cols = [ "tid", "title", "orgAmt", "orgCrrncy", "trnsctnTp", "trnsctnSt", "updateDt" ];
			var objTrans = {
				tid : "",
				title : "",
				orgAmt : "",
				orgCrrncy : "",
				trnsctnTp : "",
				trnsctnSt : "",
				updateDt : ""
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
		function getParamViewByTime() {
			//$log.debug('getParamViewByTime------vm.trans------->: ' + vm.trans);
			//$log.debug('getParamViewByTime------vm.trans2------->: ' + $httpParamSerializer(vm.trans));
			var paramStr = 'date=true';
			//$log.debug('getParamViewByTime------vm.trans-3------>: ' + paramStr);
			
			var now = new Date();
			var newVal = $scope.viewByTime;
			if (newVal == 'today') {
				paramStr = 'trnsctnDtFrom=' + $filter('date')(now, 'yyyyMMdd');
				paramStr += '&trnsctnDtTo=' + $filter('date')(now, 'yyyyMMdd');
			} else if (newVal == 'yesterday') {
				var yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
				paramStr = 'trnsctnDtFrom=' + $filter('date')(yesterday, 'yyyyMMdd');
				paramStr += '&trnsctnDtTo=' + $filter('date')(yesterday, 'yyyyMMdd');
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
				
				paramStr = 'trnsctnDtFrom=' + $filter('date')(lastMonday, 'yyyyMMdd');
				paramStr += '&trnsctnDtTo=' + $filter('date')(lastSunday, 'yyyyMMdd');
			} else if (newVal == 'lastmonth') {
				var lastday = new Date(now.getFullYear(), now.getMonth(), 0);
				var firstday = new Date(lastday.getFullYear(), lastday.getMonth(), 1);
				paramStr = 'trnsctnDtFrom=' + $filter('date')(firstday, 'yyyyMMdd');
				paramStr += '&trnsctnDtTo=' + $filter('date')(lastday, 'yyyyMMdd');
			}else if(newVal == 'thisweek'){
				
				
				var thisMonday = new Date();
				var diffToMonday = thisMonday.getDate() - thisMonday.getDay() + (thisMonday.getDay() === 0 ? -6 : 1);
				var firstday = new Date(now.setDate(diffToMonday));
				
				paramStr = 'trnsctnDtFrom=' + $filter('date')(firstday, 'yyyyMMdd');
				paramStr += '&trnsctnDtTo=' + $filter('date')(new Date(), 'yyyyMMdd');
				
			}
			$log.debug(paramStr);
			
			return paramStr + "&" +$httpParamSerializer(vm.trans);
		}
		
		$scope.typeList = [];
		$scope.statusList = [];
		$scope.currencyList = [];

		$scope.loadDataForm = true;
		$scope.invalidAdvSearch = false;
		vm.initAdvSearch = function() {
			var currentlang = getCurrentLangFromLocalStorage();
			//TODO 
			//1. 로컬스토리지의 값을 가져옴 
			//2. 브라우저의 지정된 언어를 확인함 
			//3. 그래도 없을 시에는 디폴트 언어설정 en 으로 

			$log.debug('initAdvSearch: ' + $scope.isCollapsed);
			/*$scope.isCollapsed = ($scope.isCollapsed) ? false : true;*/

			//for i18n
			$scope.jsonTypeUrl = "";
			$scope.jsonStatusUrl = "";
			if (angular.equals(currentlang, $scope.defaultLangKr)) {
				$scope.jsonTypeUrl = "data/listType-kr.json";
				$scope.jsonStatusUrl = "data/listStatus-kr.json";
			} else {
				//				jsononUrl = "https://localhost:8080/dashboard/appdata/listTypeEn.json";
				$scope.jsonTypeUrl = "data/listType-en.json";
				$scope.jsonStatusUrl = "data/listStatus-en.json";

			}
			$http.get($scope.jsonTypeUrl).then(function(response) {
				$scope.typeList = response.data;
			});

			$http.get($scope.jsonStatusUrl).then(function(response) {
				$scope.statusList = response.data;
				//TODO 언어팩에 따른 값 리플레이스 

			});
			$scope.loadDataForm = false;
		};
		//get options list 
		vm.initAdvSearch();
		
		vm.advSearch = function() {
			vm.dataLoading1 = true;
			$scope.invalidAdvSearch = false;
			
			var trnsctnDtFrom = '',
				trnsctnDtTo = '';
			var updateDtFrom = '',
				updateDtTo = '';


			if ((vm.rangeDate.startDate != null) && (vm.rangeDate.endDate != null)) {
				trnsctnDtFrom = moment(vm.rangeDate.startDate).format("YYYYMMDD");
				trnsctnDtTo = moment(vm.rangeDate.endDate).format("YYYYMMDD");
			}
			if ((vm.rangeUpdateDt.startDate != null) && (vm.rangeUpdateDt.endDate != null)) {
				updateDtFrom = moment(vm.rangeUpdateDt.startDate).format("YYYYMMDD");
				updateDtTo = moment(vm.rangeUpdateDt.endDate).format("YYYYMMDD");
			}
			vm.dataLoading1 = false;
			if ((Object.keys(vm.trans).length == 0) && (trnsctnDtFrom == '' || updateDtFrom == '')) {
				$log.debug('invalidAdvSearch');
				$scope.isCollapsed = true;
				$scope.invalidAdvSearch = true;

			} else {
				$scope.isCollapsed = false; // close searchForm
				$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.trans));
				var param = 'trnsctnDtFrom=' + trnsctnDtFrom + '&trnsctnDtTo=' + trnsctnDtTo + '&updateDtFrom=' + updateDtFrom + '&updateDtTo=' + updateDtTo;
				param += "&" + $httpParamSerializer(vm.trans)
				$log.debug('param1111: ' + param);
				//reqMemGuid=merchantGuid  

				transactionList(1, limit, param);
			}
		};

		$scope.getStyleStatus = function(status) {
			var htmlContent = '';
			
			if (status.indexOf('_FINISHED') != -1)
				htmlContent = '<span class="label label-success">FINISHED</span>';
			else if (status.indexOf('_FINISH_') != -1)
				htmlContent = '<span class="label label-success">FINISHED</span>';
			else if (status.indexOf('완료')  != -1)
				htmlContent = '<span class="label label-success"> 완료</span>';
			else if ((status.indexOf('에스크로 이체 원거래 해제됨') != -1)
				&& (!(status.indexOf('세이퍼트 펜딩 원거래 해제됨')) != -1)) //에스크로 이체 원거래 해제됨
				htmlContent = '<span class="label label-success"> 완료</span>';
			else if (status.indexOf('_TIME_OUT') != -1)
				htmlContent = '<span class="label label-warning">TIME_OUT</span>';
			else if (status.indexOf('요청 시간 경과') != -1)
				htmlContent = '<span class="label label-warning">요청시간경과</span>';
			else if (status.indexOf('_INIT') != -1)
				htmlContent = '<span class="label label-primary">INIT</span>';
			else if (status.indexOf('조기화') != -1)
				htmlContent = '<span class="label label-primary">초기화</span>';
			else if (status.indexOf('_IGNORED') != -1)
				htmlContent = '<span class="label label-info">IGNORED</span>';
			else if (status.indexOf('_FAILED') != -1)
				htmlContent = '<span class="label label-danger">FAILED</span>';
			else if (status.indexOf('_CANCELED') != -1)
				htmlContent = '<span class="label label-danger">CANCELED</span>';
			else if (status.indexOf('취소') != -1)
				htmlContent = '<span class="label label-danger">취소</span>';
			else if (status.indexOf('_DENIED') != -1)
				htmlContent = '<span class="label label-danger">DENIED</span>';
			else if (status.indexOf('요청 거부') != -1)
				htmlContent = '<span class="label label-danger">요청 거부</span>';
			else if (status.indexOf('거절') != -1)
				htmlContent = '<span class="label label-danger">거절</span>';
			else if ((status.indexOf('실패') != -1) && (!(status.indexOf('롤백')) != -1))
				htmlContent = '<span class="label label-danger">실패</span>';
			else if (status.indexOf('_TRYING') != -1)
				htmlContent = '<span class="label label-primary">TRYING</span>';
			else if (status.indexOf('승인 처리중') != -1)
				htmlContent = '<span class="label label-primary">승인 처리 중</span>';
			else if (status.indexOf('대기') != -1)
				htmlContent = '<span class="label label-primary">대기</span>';
			else if (status.indexOf('_RELEASED') != -1)
				htmlContent = '<span class="label label-info">RELEASED</span>';
			else if (status.indexOf('_MONEY_REQUSTED') != -1)
				htmlContent = '<span class="label label-default">MONEY_REQUSTED</span>';
			else if (status.indexOf('_REQ_HOLD') != -1)
				htmlContent = '<span class="label label-info">REQ_HOLD</span>';
			else if (status.indexOf('_AGRREED') != -1)
				htmlContent = '<span class="label label-success">AGRREED</span>';
			else if (status.indexOf('거래 동의') != -1)
				htmlContent = '<span class="label label-success">거래 동의</span>';
			else if (status.indexOf(('세이퍼트 펜딩 원거래 해제됨') != -1 ) || (status.indexOf('세이퍼트 펜딩 거래 해제') != -1))
				htmlContent = '<span class="label label-info">세이퍼트 펜딩 원거래 해제됨</span>';
			else
				htmlContent = '<span class="label label-default">' + status + '</span>';

			return $sce.trustAsHtml(htmlContent);
		}

		$scope.transactionChart = 'modules/transaction/views/transactionChart.html'+Utils.getExtraParams();

		
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
				// 팝업창이 닫히면 최신 거래 조건으로 목록 리프레쉬
				$scope.refreshTransactionList();
				
			});
		};
		$scope.getTransactionDetailInDash = function(transactionDetail) {

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
	
		$scope.refreshTransactionList = function(){
			var page = $scope.tmpPage;
			var limit = $scope.limit;
			var pagingParamStr = $scope.pagingParamStr;
			transactionList(page,limit,pagingParamStr);
		}
		
		
		function transactionList(page, limit, paramStr) {
			$scope.tmpPage = page;
			$scope.limit = limit;
			$scope.pagingParamStr = paramStr;
			
			paramExportAll = paramStr;
			$log.debug('start transactionList ' + new Date());
			vm.dataLoading1 = true;
			vm.dataLoading2 = true;
			TransactionService.getList(page, limit, paramStr).then(function(response) {
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
					var obj = response.data;

					vm.content = obj.transactionList;

					var currentLang = getCurrentLangFromLocalStorage();
					// 타입 
					if (angular.equals(currentLang, $scope.defaultLangKr)) {
						angular.forEach(vm.content, function(value, key) {
							if ($scope.typeList != "") {
								angular.forEach($scope.typeList, function(tpValue, tpkey) {
									if (value.trnsctnTp == tpValue.cd_key) {
										//TODO
										vm.content[key].trnsctnTp = tpValue.cd_nm;
									}
								});
							}
						});
					}
					//state 
					if (angular.equals(currentLang, $scope.defaultLangKr)) {
						angular.forEach(vm.content, function(value, key) {
							if ($scope.statusList != "") {
								angular.forEach($scope.statusList, function(tpValue, tpkey) {
									if (value.trnsctnSt == tpValue.cd_key) {
										//TODO 한국어인지 영어인지 언어팩키지 구붆서 보여지도록 
										vm.content[key].trnsctnSt = tpValue.cd_nm;
									}
								});
							}
						});
					}

					//pagination config
					vm.totalItems = obj.totalRecord;
                    vm.totalItems = vm.totalItems.length > 9999 ? 9999 : vm.totalItems  
                    
					vm.itemsPerPage = vm.viewby;
					vm.maxSize = 5; // Number of pager buttons to show
					$log.debug("totalItems:" + vm.totalItems);
					$log.debug("itemsPerPage:" + vm.itemsPerPage);
					vm.dataTablesInfo = 'Showing ' + ((vm.currentPage - 1) * vm.itemsPerPage + 1) + ' to ' + ((vm.currentPage * vm.itemsPerPage > vm.totalItems) ? vm.totalItems : vm.currentPage * vm.itemsPerPage) + ' of ' + vm.totalItems + ' entries';
					vm.dataLoading1 = false;
					vm.dataLoading2 = false;
				//					
				}
			});

		}
		;



		function getCurrentLangFromLocalStorage() {
			$scope.defaultLangKr = "kr";
			var storedLang = localStorage.getItem("paygateAdmin.currentLang");

			//			console.log("stroedLang " + storedLang);
			if (!(Utils.isNullOrUndifined(storedLang))) {
				var array = storedLang.split("");
				var aLength = array.length;
				// initialize 
				storedLang = "";
				//localStorage 로 통해서 내려온 값이 ""kr"" 처럼 큰 따옴표로 감싸 있어서 unwrapping 하기위함.
				angular.forEach(array, function(value, key) {
					if (key == 0 || key == (aLength - 1)) {
						//Cause angularJs doesn't work continue; ,coded this way.
					} else {
						//						console.log(value);
						storedLang += value;
					}
				});
			} else {
				var result = getCurrentLangFromBrower();
				storedLang = result;
			}
			return storedLang;
		}
		;

		/**
		 * @method  : Get language used in browser
		 * @return  : It'll be returned between "kr" and "en", if there is needed to add another language, you need to modify 
		 * */
		function getCurrentLangFromBrower() {
			var result = "";
			var tmpLang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
			if (Utils.isNullOrUndifined(tmpLang)) {
				result = "en";
			} else {
				//result = tmpLang.toLocaleLowerCase().includes("kr") ? "kr" : "en";
				result = tmpLang.toLocaleLowerCase().indexOf("kr") ? "kr" : "en";
			}

			return result;
		}

		
	}

	function TransactionChartController($scope, $state, Utils, $timeout, $log, $translate, $rootScope, TransactionService) {
		var vm = this;
		$scope.totalAmt = {};
		$scope.defaultValue = 0;
		$scope.dataTotalLoading = true;
		$scope.dataChartLoading = true;

		
		//total amount

		function getTotal(){
			$scope.dataTotalLoading = false;
//			TransactionService.getTotal().then(function(response) {
//				$log.debug(response.status);
//				if (response.status == 'ERROR') {
//					swal({
//						title : $translate.instant('ERROR'),
//						text : response.data.cdKey + ":" + response.data.cdDesc,
//						type : "error",
//						confirmButtonText : $translate.instant('btnOK')
//					});
//
//					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
//						$state.go('login');
//						;
//						if (!$rootScope.$$phase) $rootScope.$apply();
//					}
//				} else if (response.status == 'SUCCESS') {
//					var obj = Utils.getJsonObj(response.data);
//					$log.debug("getTotal obj:" );
//					$log.debug(obj);
//					
//					$scope.totalAmt = obj.total;
//				}
//				$scope.dataTotalLoading = false;
//			});
		}
		getTotal();
		$scope.colors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360' ];
		$scope.options = {
			responsive : true,
			maintainAspectRatio : false,
			legend : {
				display : true
			}
		};

		$scope.totalChart = {};
		$scope.labels = [];
		$scope.data = [];
		$scope.viewChartByTime = 'day';

		//total amount chart
		function getTotalChart(pTime) {
			$scope.dataChartLoading = false;
			$scope.showErrorChart = true;
		/*var paramStr = 'graph=' + pTime;
			$scope.showErrorChart = false;
			TransactionService.getTotalChart(paramStr).then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					var resultList = response.data.graphList;
					if (resultList == null) {
						$scope.showErrorChart = true;
					}
					angular.forEach(resultList, function(value, key) {
						if (pTime == 'hour') {
							$scope.labels.push(value.mm);
						} else {
							$scope.labels.push(value.hh);
						}
						$scope.data.push(value.cnt);
						if (value.cnt == 0) {
							$scope.showErrorChart = true;
						}
					});
				} else {
					$scope.showErrorChart = true;
				}
				$scope.dataChartLoading = false;
			});*/
		}




		$scope.$watch('viewChartByTime', function(newVal, oldVal) {
			$log.debug('newVal: ' + newVal);
			$log.debug('oldVal: ' + oldVal);
			$scope.dataChartLoading = true;
			getTotalChart(newVal);
		});

	}

	function TransactionDetailController($scope, $rootScope , $uibModalInstance, Utils, transactionDetail, $log, TransactionService, MemberService ,$state ,$location ,$uibModal , printer ,$filter ,localStorageService, $translate ) {
		$scope.transactionDetail = {};
		$scope.dateFormat = Utils.dateFormat().yyyyMMddHHmmss;
		$scope.dataLoading = false;
		//added by atlas
		$scope.selectStatus = "";
		$scope.changeStatusReason = "";
		$scope.isChangeable = false;
		$scope.isDisabled = true;
		
		Utils.setModalInstance($uibModalInstance);
		
		
		$scope.transactionDetail.title = transactionDetail.title;

		$scope.ok = function() {
			$log.debug("OK click");
			$uibModalInstance.close($scope.selected.item);
		};

		$scope.cancel = function() {
			$log.debug("cancel click");
			$uibModalInstance.dismiss('cancel');
		};
		getTransactionDetail(transactionDetail.tid);
		
		//select box 아이템 변경시 사용되는 메서드 
		$scope.onChange = function(option){
			// select box 에서 선택한 아이템을 파라미터로 받아옴 
            var str = option;
            if(Utils.isNullOrUndifined(str) || str.length <= 0){
            	//$scope.isChangeable 변경가능 유무를 설정하는 파라미터로 true 일 시 변경이유를 적는 ng-show = "" 를 설정하는 변수  
            	$scope.isChangeable = false;
            	$scope.changeStatusReason = "";
            }else{
            	$scope.isChangeable = true;
            }
        };
        // ACL 에 다른 style 설정 
        $scope.getItemClass = function(style)
        {
           return style ? "select-item-gray" : "select-item-white";
        }

		//거래 요청 자 이름 
        function getReqFullName(array){
        	var length = array.length;
        	for(var i = 0 ; i < length ; i++ ){
        		if(array[i].priority == '1' ){
        			return array[i].fullname;
        		} 
        	}
        }

        //sender 이름 
        function getOrgFullName(array){
        	var length = array.length;
        	for(var i = 0 ; i < length ; i++ ){
        		if(array[i].priority == '1' ){
        			return array[i].fullname;
        		} 
        	}
        }
        //sender 전화번호 
        function getOrgPhoneNum(array){
        	var length = array.length;
        	for(var i = 0 ; i < length ; i++ ){
        		if(array[i].priority == '1' ){
        			return array[i].phoneNo;
        		} 
        	}
        }
        
        
        // Receiver full Name
        function getDstFullName(array){
        	var length = array.length;
        	for(var i = 0 ; i < length ; i++ ){
        		if(array[i].priority == '1' ){
        			return array[i].fullname;
        		} 
        	}
        }
        
        //Receiver 은행 계좌 
        function getDstBankNo(array){
        	var length = array.length;
        	for(var i = 0 ; i < length ; i++ ){
        		if(array[i].priority == '1' ){
        			return array[i].accntNo;
        		} 
        	}
        }
        //Receiver 은행 코드 .         
        function getDstBankCd(array){
        	var length = array.length;
        	for(var i = 0 ; i < length ; i++ ){
        		if(array[i].priority == '1' ){
        			return array[i].bnkCd;
        		} 
        	}
        }
        function getListBanks(){
        	$scope.dataFormLoading = true;
			MemberService.getAllListBankEn().then(function(response) {
				$log.debug(response.status);
				console.log(response);
				if (response.status == 'SUCCESS') {
					$scope.listBank = response.data;
					//console.log($scope.listBank);
					}
				$scope.dataFormLoading = false;
			});
        }
        function getListBanksKr(){
        	$scope.dataFormLoading = true;
        	
			MemberService.getAllListBankKr().then(function(response) {
//				$log.debug(response.status);
				console.log(response);
				if (response.status == 'SUCCESS') {
					$scope.listBank = response.data;
//					console.log($scope.listBank);
					}
				$scope.dataFormLoading = false;
			});
        }
        function getBankName(mBankCd){
        	var listBank = $scope.listBank;
			var length =listBank.length;
			for(var i = 0 ; i < length ; i++){
				if(listBank[i].cdKey == mBankCd){
//					console.log(listBank[i].cdNm);
					return listBank[i].cdNm;
				}
			}
        }
        
        $scope.executePrint = function(certificate){
        	var url ;
        	var info ;
        	
        	
        	swal('',$translate.instant('printInfo'),'info');
        	
        	if(certificate == 'PAY_EN'){
        		url = 'modules/transaction/views/printSendMoney.html';
        			
        		var _requestor = getReqFullName($scope.reqMemDetail.namesList);
        		
        		var _payAmt = $filter('number')($scope.transactionDetail.payAmt) +" " + transactionDetail.payCrrncy;
        		var _tid =$scope.transactionDetail.tid;
        		var _refId = $scope.transactionDetail.refId;
        		
        		var _sender = getOrgFullName($scope.orgMemDetail.namesList);
        		var _senderAddrss = getOrgPhoneNum($scope.orgMemDetail.phonesList);
        		var _receiver = getDstFullName($scope.dstMemDetail.namesList);
        		var _receiverAccnt = getBankName(getDstBankCd($scope.dstMemDetail.bnkAccnt))+"  "+getDstBankNo($scope.dstMemDetail.bnkAccnt);
        		
        		var _updateDate =  $filter('date')($scope.transactionDetail.updateDt, 'yyyy-MM-dd HH:mm:ss');
        		var _confirmDate = $filter('date')(new Date(), 'yyyy.MM.dd');
        		
        		//console.log(_payAmt);
        		info = {data: 
		        			{
		        			  requestor :_requestor,  
		        			  orgAmt :_payAmt,
		        			  tid :_tid,
		        			  refId:_refId, 
		        			  sender :_sender,  
		        			  senderAddrss :_senderAddrss,  
		        			  receiver :_receiver,  
		        			  receiverAccnt:_receiverAccnt, 
		        			  updateDate :_updateDate  ,
		        			  confirmDate :_confirmDate  ,
		        			}
        				};
        		
        	}else if(certificate == 'PAY_KR'){
        		// 한글 버전은 기능은 구현 완료 UI 에서는 보이지 않도록 해놓은 상태 
        		url = 'modules/transaction/views/printSendMoneyKr.html';
        		var crrncy  = transactionDetail.payCrrncy == "KRW" ? "원" : transactionDetail.payCrrncy;
        		if(Utils.isNullOrUndifined(crrncy)){
        			crrncy = '원';
        		}
        		var _requestor = getReqFullName($scope.reqMemDetail.namesList);
        		var _payAmt = $filter('number')($scope.transactionDetail.payAmt) +" " +crrncy;
        		
        		var _tid =$scope.transactionDetail.tid;
        		var _refId = $scope.transactionDetail.refId;
        		
        		var _sender = getOrgFullName($scope.orgMemDetail.namesList);
        		var _senderAddrss = getOrgPhoneNum($scope.orgMemDetail.phonesList);
        		var _receiver = getDstFullName($scope.dstMemDetail.namesList);
        		var _receiverAccnt = getBankName(getDstBankCd($scope.dstMemDetail.bnkAccnt))+"  "+getDstBankNo($scope.dstMemDetail.bnkAccnt);
        		
        		var _updateDate =  $filter('date')($scope.transactionDetail.updateDt, 'yyyy-MM-dd HH:mm:ss');
        		var _confirmDate = $filter('date')(new Date(), 'yyyy.MM.dd');
        		
        		console.log(_payAmt);
        		info = {data: 
		        			{
		        			  requestor :_requestor,  
		        			  orgAmt :_payAmt,
		        			  tid :_tid,
		        			  refId:_refId, 
		        			  sender :_sender,  
		        			  senderAddrss :_senderAddrss,  
		        			  receiver :_receiver,  
		        			  receiverAccnt:_receiverAccnt, 
		        			  updateDate :_updateDate  ,
		        			  confirmDate :_confirmDate  ,
		        			}
        				};
        	}else if(certificate == 'WITH'){
        		url = 'modules/transaction/views/printWithdraw.html';
        		var crrncy  = transactionDetail.payCrrncy == "KRW" ? "원" : transactionDetail.payCrrncy;
        		if(Utils.isNullOrUndifined(crrncy)){
        			crrncy = '원';
        		}
        		var _requestor = getReqFullName($scope.reqMemDetail.namesList);
        		var _payAmt = $filter('number')($scope.transactionDetail.payAmt) +" " +crrncy;
        		var _tid =$scope.transactionDetail.tid;
        		var _refId = $scope.transactionDetail.refId;
        		var _receiver = getDstFullName($scope.dstMemDetail.namesList);
        		var _receiverAccnt = getBankName(getDstBankCd($scope.dstMemDetail.bnkAccnt))+"  "+getDstBankNo($scope.dstMemDetail.bnkAccnt);
        		var _updateDate =  $filter('date')($scope.transactionDetail.updateDt, 'yyyy-MM-dd HH:mm:ss');
        		var _confirmDate = $filter('date')(new Date(), 'yyyy년 MM월 dd일 ');
        		
        		info = {data: 
			    			{
			    			  requestor :_requestor,  
			    			  orgAmt :_payAmt,
			    			  tid :_tid,
			    			  refId:_refId, 
			    			  receiver :_receiver,  
			    			  receiverAccnt:_receiverAccnt, 
			    			  updateDate :_updateDate  ,
			    			  confirmDate :_confirmDate  ,
			    			}
						};
        		
        		
        	}else if(certificate == 'BRRW'){
        		url = 'modules/transaction/views/printDepositLoan.html';
        		var crrncy  = transactionDetail.payCrrncy == "KRW" ? "원" : transactionDetail.payCrrncy;
        		if(Utils.isNullOrUndifined(crrncy)){
        			crrncy = '원';
        		}
        		var _requestor = getReqFullName($scope.reqMemDetail.namesList);
        		var _payAmt = $filter('number')($scope.transactionDetail.payAmt) +" " +crrncy;
        		var _tid =$scope.transactionDetail.tid;
        		var _refId = $scope.transactionDetail.refId;
        		var _borrower = getDstFullName($scope.dstMemDetail.namesList);
        		var _borrowerAccnt = getBankName(getDstBankCd($scope.dstMemDetail.bnkAccnt))+"  "+getDstBankNo($scope.dstMemDetail.bnkAccnt);
        		var _updateDate =  $filter('date')($scope.transactionDetail.updateDt, 'yyyy-MM-dd HH:mm:ss');
        		var _confirmDate = $filter('date')(new Date(), 'yyyy년 MM월 dd일 ');
        		info = {data: 
			    			{
			    			  requestor :_requestor,  
			    			  orgAmt :_payAmt,
			    			  tid :_tid,
			    			  refId:_refId, 
			    			  borrower :_borrower,  
			    			  borrowerAccnt:_borrowerAccnt, 
			    			  updateDate :_updateDate  ,
			    			  confirmDate :_confirmDate  ,
			    			}
						};
        	}
        	url = url + Utils.getExtraParams();
        	printer.print(url, info);

        }
        
		/**
		 * @method : request status of Transaction Detail what you clicked & get status what you requested   
		 * 
		 * */
		function getTranstionStatus(){
			
			var typeGrp = $scope.transactionDetail.trnsctnTpGrp;
			var type = $scope.transactionDetail.trnsctnTp;
			var statusGrp = $scope.transactionDetail.trnsctnStGrp;
			var status = $scope.transactionDetail.trnsctnSt;
			
			console.log("typeGrp : " + typeGrp +" type :  " + type + " statusGRp : " +statusGrp + " status : " +status);
			TransactionService.getTransactionStatus(typeGrp,type,statusGrp,status).then(function(response) {
				if(response.status == 'SUCCESS'){
				//test 	
					var list = response.data.list;
					var listLength = list.length;
					
					if(!(Utils.isNullOrUndifined(list)) && listLength > 0){
						console.log("it successed");
						console.log(list);
						
						var baseAcl = response.data.baseAcl;
						var tmpArray = list;
						
						var resultArray = [];
//						
						for(var i = 0 ; i < listLength; i++){
							var resultItem = {
									disabled : null,
									list : []
							};
							resultItem.disabled = baseAcl < tmpArray[i].adminAllow ? true : false ;
							resultItem.list = tmpArray[i];
							resultArray[i] = resultItem;
						}
						
						$scope.availableStatus = resultArray;
					}else{
						$scope.availableStatus = [];
						console.log("there is no status you can use");
					}
					
				}
			});
		}
		
		function requestStatusChange(status) {
			/* TODO
			 * pre-work
			 * 
			 * 1. 상태변경으로 받아온 상태값으로 서버에 요청하는 작업
			 * 2. 팝업창으로 변경 할 것인지 한번 더 확인하기 . 
			 * 3. 받아온 값 처리해서 알려주기  (팝업창 ) 
			 * 
			 * */
			var tmpStatus = status.trim();
			swal({
				   title: "Are you sure?",
				   text: tmpStatus+" 로 \n 거래상태 변경을 정말로 진행하시겠습니까?",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "네, 진행하겠습니다.",
				   cancelButtonText: "아니오",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
				      var changeStatus;
				      var listLength = $scope.availableStatus.length;
				      var list = $scope.availableStatus;

				      for(var i = 0 ; i< listLength ; i++){
							if(list[i].list.status == tmpStatus){
								changeStatus = list[i].list;
								break;
							} 
						}
				      
						var tid = $scope.transactionDetail.tid;
						var statusLast = changeStatus.statusLast; // 이게 현재 status 
						var type = changeStatus.type;
						var typeGrp = changeStatus.typeGrp;
						var statusLastGrp = changeStatus.statusLastGrp;
						var statusGrp = changeStatus.statusGrp;
						var status = changeStatus.status; 
						
						var changeReason = $scope.changeStatusReason.trim();

						TransactionService.getTranscationStatusChange(tid,typeGrp,type,statusLastGrp,statusLast,statusGrp,status,changeReason).then(function(response) {
							console.log(response);
							if(response.status == 'SUCCESS'){
								var result = response.data;
								if(result.status == true){
									swal("변경완료!", "요청하신 상태변경이 정상적으로 적용되었습니다.", "success");
									$scope.cancel();
									
								}else{
									console.log("status 값 false ");
									swal("결과값 에러", "상태변경이 적용되지 않았습니다. ", "error");
								}
							}else{
								console.log("status 값 false ");
								swal("통신 에러", "다시 시도해 주세요.", "error");
							}						
						});
				   } else {
				      swal("변경취소", "상태 변경이 취소되었습니다.", "error");
				   }
				});
		}
		$scope.requestStatusChange = requestStatusChange;
		 
//		$scope.getTranstionStatus = getTranstionStatus;
		
		$scope.isPrintableWithdraw = false;
		$scope.isPrintableSend = false;
		$scope.isPrintableBorrow = false;
		
		function getTransactionDetail(tid) {
			$scope.dataLoading = true;
			$log.debug("getTransactionDetail--tid:" + tid);
			var paramStr = 'listType=detailList&tid=' + tid;
			TransactionService.getTransactionDetail(paramStr).then(function(response) {
				$log.debug(response.status);
				if (response.status == 'SUCCESS') {
					$scope.transactionDetail = response.data.detailList[0];
					if($scope.transactionDetail.trnsctnTp == 'SEYFERT_WITHDRAW'){
						if($scope.transactionDetail.trnsctnSt.indexOf('FINISHED') != -1){
							getListBanksKr();
							// 출금증명서 줄력 가능 
							
							if(!(Utils.isNullOrUndifined($scope.transactionDetail.transferReason))){
								if($scope.transactionDetail.transferReason == 'P2P_BORROWER'){
									// 대출증명서 출력 가능 
									$scope.isPrintableBorrow = true;
									$scope.isPrintableWithdraw = false;
								}else{
									$scope.isPrintableWithdraw = true;
								}
							}else{
								$scope.isPrintableWithdraw = true;
							}
						}
					}else if($scope.transactionDetail.trnsctnTp == 'SEND_MONEY'){
						if($scope.transactionDetail.trnsctnSt.indexOf('FINISHED') != -1){
							//송금증명서 출력 가능 
							getListBanks();
							$scope.isPrintableSend = true;
						}
					}
					// OrgAmt 이 0 이 나오면 안된 ... .
					$log.debug("getTransactionDetail--detail:" + JSON.stringify($scope.transactionDetail));
					if ($scope.transactionDetail == null) {
						$scope.showErrorDetail = true;
					}
					getMemberDetail();
					getTranstionStatus();
				} else {
					$scope.showErrorDetail = true;
				}
				$scope.dataLoading = false;
			});
		}

		function getMemberDetail() {
			$scope.dataLoading = true;
			//reqMemGuid
			/***Requester****/
			if ($scope.transactionDetail.reqMemGuid != null) {
				var paramStr = "dstMemGuid=" + $scope.transactionDetail.reqMemGuid;
				MemberService.getMemberDetail(paramStr).then(function(response) {
					$log.debug(response.status);
					if (response.status == 'SUCCESS') {
						$log.debug("data:" + response.data);
						var obj = Utils.getJsonObj(response.data);
						$scope.reqMemDetail = obj.result;
					}
					$scope.dataLoading = false;
				});
			}
			

			//srcMemGuid
			/***Payer Info***/
			if ($scope.transactionDetail.srcMemGuid != null) {
				paramStr = "dstMemGuid=" + $scope.transactionDetail.srcMemGuid;
				MemberService.getMemberDetail(paramStr).then(function(response) {
					$log.debug(response.status);
					if (response.status == 'SUCCESS') {
						$log.debug("data:" + response.data);
						var obj = Utils.getJsonObj(response.data);
						$scope.srcMemDetail = obj.result;
					}
					$scope.dataLoading = false;
				});
			}

			/***Sender Info***/
			if ($scope.transactionDetail.orgMemGuid != null) {
				paramStr = "dstMemGuid=" + $scope.transactionDetail.orgMemGuid;
				MemberService.getMemberDetail(paramStr).then(function(response) {
					$log.debug(response.status);
					if (response.status == 'SUCCESS') {
						$log.debug("data:" + response.data);
						var obj = Utils.getJsonObj(response.data);
						$scope.orgMemDetail = obj.result;
					}
					$scope.dataLoading = false;
				});
			}


			//dstMemGuid
			/***Reciever Info***/
			if ($scope.transactionDetail.dstMemGuid != null) {
				paramStr = "dstMemGuid=" + $scope.transactionDetail.dstMemGuid;
				MemberService.getMemberDetail(paramStr).then(function(response) {
					$log.debug(response.status);
					if (response.status == 'SUCCESS') {
						$log.debug("data:");
						$log.debug(response.data);
						
						var obj = Utils.getJsonObj(response.data);
						$scope.dstMemDetail = obj.result;
					}
					$scope.dataLoading = false;
				});
			}
		}
	}


})();