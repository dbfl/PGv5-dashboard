//controllers.js

(function() {
	'use strict';
		
	angular.module('inspinia')
			.controller('SmsSRController', SmsSRController);

	SmsSRController.$inject = [ '$scope', '$rootScope', '$state',
		'$translate', 'Utils', '$log', '$timeout',
		'$uibModal', '$sce', 'localStorageService', '$httpParamSerializer',
		'DTOptionsBuilder', 'DTColumnDefBuilder', '$filter', 'SmsSRService' ];
	
	function SmsSRController($scope, $rootScope, $state, $translate,
			 Utils, $log, $timeout, $uibModal, $sce,
			localStorageService, $httpParamSerializer, DTOptionsBuilder,
			DTColumnDefBuilder, $filter, SmsSRService) {

		var vm = this;
		var animationsEnabled = true;
		var sizeModal = 'lg';
		
		//Used for search is first search or load more option.
		var isFirstSearch = '1';
		var endDate = moment();
		var startDate = moment();
		
		self.smsSRSearch = smsSRSearch;
		
		vm.contents = [];
		vm.maxSize = 5;
		vm.totalItems = 0;

		$scope.edit = false;
		vm.phoneNo = '';
		vm.startDt = '';
		vm.endDt = '';

		$scope.smsSRSearchForm = {};
		$scope.smsSRSearchForm.phoneNumber = '';
		$scope.smsSRSearchForm.startDt = '';
		$scope.smsSRSearchForm.endDt = '';
		$scope.smsSRSearch = smsSRSearch;
		
		(function initController(){
			console.log("INIT SmsSRList call by memberDetail : " + $state.params.phoneNumber);

			var phoneNumber = '';
			
			if(!(Utils.isNullOrUndifined($state.params.phoneNumber)) && ($state.params.phoneNumber != '') ){
				$scope.smsSRSearchForm.phoneNumber = $state.params.phoneNumber;
				smsSRSearch('');
			}
		})();

		$scope.dtOptions = DTOptionsBuilder
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
						/*
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
						*/
						{
							text : "<i class='fa fa-file-excel-o text-navy'></i>&nbsp;|&nbsp;Download All",
							action : function(e, dt, node, config) {
								$log.debug('Button Download All activated');
								exportBlockedMemberToExcel();
							}
						}
				]);

		if ($rootScope.globals.currentUser.isAdmin) {
			$scope.edit = true;
		}

		function smsSRSearch(searchOption){
			//first search
			if ( searchOption == '' ){
				endDate = moment();
				startDate = moment();

				$scope.endDt = endDate.format('YYYYMMDD');
				startDate = startDate.subtract(30, 'days');
				$scope.startDt = startDate.format('YYYYMMDD');
				
				//clear vm.contents data when first search. 
				vm.contents = [];
				isFirstSearch = '1';
			}
			//load more data - 30 days
			else if ( searchOption == '7D'){
				endDate = startDate.subtract(1, "days");
				$scope.endDt = endDate.format('YYYYMMDD');
				startDate = endDate.subtract(6, 'days');
				$scope.startDt = startDate.format('YYYYMMDD');
				isFirstSearch = '0';
			}
			//load more data - 30 days
			else if ( searchOption == '30D'){
				endDate = startDate.subtract(1, "days");
				$scope.endDt = endDate.format('YYYYMMDD');
				startDate = endDate.subtract(29, 'days');
				$scope.startDt = startDate.format('YYYYMMDD');
				isFirstSearch = '0';
			}
			//load more data - 30 days
			console.log("==> PhoneNumber : " + $scope.smsSRSearchForm.phoneNumber + " startDate : " + $scope.startDt + " / endDate : " + $scope.endDt);
			
			getSmsSRList(0, 9999, $scope.smsSRSearchForm.phoneNumber, isFirstSearch);
		}

		function getSmsSRList (page, limit, phoneNumber, loadMoreFlag) {
			var reqMemGuid = $rootScope.globals.currentUser.superGuid;
			var paramStr = "&offset="  + page +
			               "&limit="   + limit +
			               "&phoneNo=" + $scope.smsSRSearchForm.phoneNumber +
			               "&startDt=" + $scope.startDt +
			               "&endDt="   + $scope.endDt 
			               ;

			vm.dataLoading1 = true;

			SmsSRService
					.getSmsSRList(paramStr)
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
										$log.debug("== SMS SR ResultList:");
										$log.debug("== obj.list:");
										$log.debug(obj.list);
										$log.debug("==> obj.list.length : " +obj.list.length);
										
										if ( loadMoreFlag == '1' )
											vm.contents = obj.list;
										else{
											objectPush(vm.contents, obj.list);
										}
										vm.totalItems = vm.contents.length > 9999 ? 9999 : vm.contents.length;
									} else {
										console.log("===> response.status == else");
										vm.contents = obj.list;
										vm.totalItems = $scope.contents.length > 9999 ? 9999 : $scope.contents.length;
									}
								}
								vm.dataLoading1 = false;
							});
		};
		
		//push search result obj.list to vm.contents
		function objectPush(source, target){
			for(i=0; i < target.length; i++){
				source.push(target[i]);
			}
		}

		function exportBlockedMemberToExcel() {
			var fileName = "List_SmsSRList_" + $filter('date')(new Date(), 'yyyy-MM-dd');
			jsonToExcel(vm.contents, fileName);
		}

		function jsonToExcel(jsonData, fileName) {
			var types = {
				"askDt" : "String",
				"channel" : "String",
				"detectDt" : "String",
				"moMtType" : "String",
				"msgType" : "String",
				"res" : "String",
				"resDesc" : "String",
				"telecom" : "String",
				"subject" : "String",
				"text" : "String",
			};

			var lableHeader = [
				"SMS전송 요청시각", "채널", "처리시각", "송수신", "문자타입", "결과", "상세", "통신사", "문자 제목", "문자내용",  
			];

			var cols = [ "askDt",  "channel", "detectDt", "moMtType", "msgType",  "res", "resDesc", "telecom", "subject", "text",];
			var objTrans = {
					askDt : "",
					channel : "",
					detectDt : "",
					moMtType : "",
					msgType : "",
					res : "",
					resDesc : "",
					telecom : "",
					subject : "",
					text : ""
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
			download(jsonToSsXml(jsonData), fileName + ".xls", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		}
	
	}


})();