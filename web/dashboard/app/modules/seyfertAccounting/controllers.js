(function() {
	'use strict';

	angular
		.module('inspinia')
		.controller('SeyfertAccountController', SeyfertAccountController)
		.controller('SeyfertAccountDetailController', SeyfertAccountDetailController)

	SeyfertAccountController.$inject = [ '$scope', '$rootScope', "$log", '$httpParamSerializer', '$location', '$state', '$uibModal', 'AccountService', '$window', "DTOptionsBuilder", "$filter", '$translate', 'Utils', '$q' ,'$timeout' ,'SweetAlert'];
	function SeyfertAccountController($scope, $rootScope, $log, $httpParamSerializer, $location, $state, $uibModal, AccountService, $window, DTOptionsBuilder, $filter, $translate, Utils, $q ,$timeout ,SweetAlert) {
		var vm = this;
		//test LOg
		var isTest = false;
		//related to date time
		vm.dates ;
		var startMonthDt;
		var endMonthDt;

		var mtStartMonthDt;
		var mtEndMonthDt;

		vm.isMonthToMonth = 'range'; // month | range
		vm.isMonthToMonthB = 'range'; // month | range

		vm.loadDataForm = false;
		//response Data 
		vm.commissionList = [];
		vm.commissionDetailList = [];

		vm.settlementList = [];
		var settlementOrgList = [];
		vm.settlementDetailList = [];

		vm.depositList = [];
		vm.depositDetailList = [];

		vm.depositMemberList = [];

		vm.mtAccntBalList = [];
		vm.mtAccntBalDetailList = [];

		//transaction Date 
		vm.rangeCommisnDate = {
			startDate : null,
			endDate : null
		};
		vm.rangeSettleMnntDate = {
			startDate : null,
			endDate : null
		};
		vm.rangeDepositDate = {
			startDate : null,
			endDate : null
		};
		vm.rangeDepositMemDate = {
			startDate : null,
			endDate : null
		};
		vm.rangeMtAccntBalDate = {
			startDate : null,
			endDate : null
		};
		// crn 		
		vm.transCmmssn = {};
		vm.transSttmnt = {};
		vm.transDepost = {};

		// 잔액조회 
		vm.transMtAccntBalance = {};
		vm.transMtAccntBalance.type = "0";
		//		vm.mtAccntBalance.type
		//items for selecting currency on deposit
		vm.crrncy = [
			{
				crrncy : "KRW"
			},
			{
				crrncy : "USD"
			},
		];

		vm.accntType = [];
		//		1.예치입금, 2. 투자출금, 3.상환입금, 4.반환출금.
		vm.transType = [];
		vm.transType1 = [
			{
				type : "전체조회",
				code : "0"
			},
			{
				type : "입금전체",
				code : "I"
			},
			{
				type : "출금전체",
				code : "O"
			}
		];
		vm.transType2 = [
			{
				type : "전체조회",
				code : "0"
			},
			{
				type : "입금전체",
				code : "I"
			},
			{
				type : "출금전체",
				code : "O"
			},
			{
				type : "예치입금",
				code : "1"
			},
			{
				type : "상환입금",
				code : "C"
			},
			{
				type : "반환출금",
				code : "4"
			},
			{
				type : "투자출금",
				code : "2"
			}
		];
		
	/*	vm.accntList = [
			{
				type : "전체",
				code : "0"
			},
			{
				type : "농협1",
				code : "1"
			},
			{
				type : "농협2",
				code : "2"
			},
			{
				type : "농협3",
				code : "4"
			},
			{
				type : "농협 4",
				code : "c"
			},
		];*/

		/*{ type : "예치입금" , code = "1"},
		{ type : "투자출금" , code = "2"},
		{ type : "상환입금" , code = "3"},
		{ type : "반환출금" , code = "4"},*/

		vm.commission = 'modules/seyfertAccounting/views/commission.html' + Utils.getExtraParams();
		vm.settlement = 'modules/seyfertAccounting/views/settlement.html' + Utils.getExtraParams();

		vm.deposit = 'modules/seyfertAccounting/views/deposit.html' + Utils.getExtraParams();
		vm.deposit_mem = 'modules/seyfertAccounting/views/depositMember.html' + Utils.getExtraParams();

		vm.mtAccntBalance = 'modules/seyfertAccounting/views/mtAccountBalance.html' + Utils.getExtraParams();
//		vm.mtAccntBalance = 'modules/seyfertAccounting/views/mtAccountBalanceDetail.html' + Utils.getExtraParams();


		/*console.log(moment(new Date()).format("YYYYMMDDhh"));
		console.log(encodeURIComponent(moment(new Date()).format("YYYYMMDDhh")));
		*/
		const COMMISSION = "commission";
		const SETTLEMENT = "settlement";
		const DEPOSIT = "deposit";
		const DEPOSIT_MEMBER = "depositMember"

		const COMMISSION_DETAIL = "commissionDetail";
		const SETTLEMENT_DETAIL = "settlementDetail";
		const DEPOSIT_DETAIL = "depositDetail";
		const DEPOSIT_MEMBER_DETAIL = "depositMemberDetail";

		const MT_ACCOUNT_BALANCE = "mtAccntBalance";
		const MT_ACCOUNT_BALANCE_DETAIL = "mtAccntBalanceDetail";

		var tmpRateType;

		const Type = {
			commission : {
				startDate : '',
				endDate : '',
				crn : '',
				offset : 0,
				offsetDetails : 0,
				reqDataMemGuid : '',
				currentPage : ''
			},
			settlement : {
				startDate : '',
				endDate : '',
				crn : '',
				offset : 0,
				offsetDetails : 0,
				reqDataMemGuid : '',
				currentPage : '',
				rateType : ''
			},
			deposit : {
				startDate : '',
				endDate : '',
				crn : '',
				offset : 0,
				offsetMem : 0,
				offsetDetails : 0,
				reqDataMemGuid : '',
				currentPage : '',
				crrncy : ''
			},
			mtaccntbal : {
				startDate : '',
				endDate : '',
				offset : 0,
				offsetDetails : 0,
				reqDataMemGuid : '',
				currentPage : '',
				type : '0',
				currentSearchType : '',
				mthrAccntId : '' ,
				accountNm : ''
					
			}
		}

		vm.searchDisalbed = false;
		vm.loadMoreCommisnDisalbed = true;
		vm.loadMoreSettmntDisalbed = true;
		vm.loadMoreDepostDisalbed = true;

		//commission
		const cmmssHeader = [
			"GUID",
			"업체",
			"사업자번호",
			"총거래 금액 ",
			"수수료"
		];
		const cmmssDetailHeader = [
			"거래일자",
			"거래타입",
			"org_amt",
			"pay_amt",
			"margin(%)",
			"TID",
			"xe 기준율",
			"환전소 USD 예수금",
			"환전소 원화 예수금",
			"레미턴스 매출",
			"환전소 예수금 잔액",
			"환전소 USD 잔액",
			"원화 환산 거래금액",
			"원화 환산 잔액",
			"이동평균"
		];

		const cmmssCols = [
			"guid",
			"name",
			"crn",
			"total",
			"commission"
		];
		const cmmssDetailCols = [
			"date",
			"trType",
			"frgnTrrnsAmt",
			"funcCnvrtedTrmsAmt",
			"margin",
			"tid",
			"middleRate",
			"frgnTrrnsAmt2",
			"trrnsAmt",
			"commissionAmt",
			"frgnDepoBalance",
			"frgnBalance",
			"krwTrrnsAmt",
			"funcCnvrtedBalance",
			"movingAverage"
		];

		const cmmssObjTrans = {
			guid : "",
			name : "",
			crn : "",
			total : "",
			commissio : ""
		};
		const cmmssObjDetailTrans = {
			date : "",
			trType : "",
			frgnTrrnsAmt : "",
			funcCnvrtedTrmsAmt : "",
			margin : "",
			tid : "",
			middleRate : "",
			frgnTrrnsAmt2 : "",
			trrnsAmt : "",
			commissionAmt : "",
			frgnDepoBalance : "",
			frgnBalance : "",
			krwTrrnsAmt : "",
			funcCnvrtedBalance : "",
			movingAverage : ""
		};


		//settlements
		const sttmntHeader = [
			"GUID",
			"멤버명",
			"사업자 번호",
			"수수료 대상 VA 갯수",
			"총 이제 금액",
			"총 이제 건수",
			"수수료대상 거래 총액",
			"수수료대상 거래 건수",
			"수수료 유형", // 수수료 계산 방식 부터 2차 개발 
			"수수료 ",
			"최종 수수료 대상",
			"최종 청구 수수료"

		]
		const sttmntDetailHeader = [
			"TID",
			"거래일자 ",
			"거래내용",
			"거래타입",
			"금   액"
		];

		/*const ttt={
				"guid" : "String",
				"name" : "String",
				"crn" : "String",
				"vaCount" : "String",
				"totalAmount" : "String",
				"totalCount" : "String",
				"rateTrrcnAmount" : "String",
				"rateCount" : "String",
				"rateType " : "String",
				"fee" : "String",
				"finalRateAmount" : "String",
				"chargingFee" : "String"
		};
		*/
		const sttmntType = {
			"guid" : "String",
			"name" : "String",
			"crn" : "String",
			"vaCount" : "Number",
			"totalAmount" : "Number",
			"totalCount" : "Number",
			"rateTrrcnAmount" : "Number",
			"rateCount" : "Number",
			"rateType " : "String",
			"fee" : "Number",
			"finalRateAmount" : "Number",
			"chargingFee" : "Number"
		};

		const sttmntCols = [
			"guid",
			"name",
			"crn",
			"vaCount",
			"totalAmount",
			"totalCount",
			"rateTrrcnAmount",
			"rateCount",
			"rateType",
			"fee",
			"finalRateAmount",
			"chargingFee"
		];
		const sttmntDetailCols = [
			"tid",
			"tDate",
			"tContents",
			"tType",
			"tAmount"
		];

		const sttmntObjTrans = {
			guid : "",
			name : "",
			crn : "",
			vaCount : "",
			totalAmount : "",
			totalCount : "",
			rateTrrcnAmount : "",
			rateCount : "",
			rateType : "",
			fee : "",
			finalRateAmount : "",
			chargingFee : ""
		};
		const sttmntDetailObjTrans = {
			tid : "",
			tDate : "",
			tContents : "",
			tType : "",
			tAmount : ""
		};


		//deposit
		const depostHeader = [
			"GUID ",
			"멤버명",
			"사업자번호",
			"건수",
			"예수금 "
		];
		const depostDetailHeader = [
			"TID",
			"GUID ",
			"거래일자",
			"거래내용",
			"거래타입",
			"거래금액",
			"잔액"
		];

		const depostCol = [
			"guid",
			"name",
			"crn",
			"count",
			"amount"
		];
		const depostDetailCol = [
			"tid",
			"guid",
			"tDate",
			"tContents",
			"tType",
			"tAmount",
			"tResultAmount"
		];

		const depostObjTrans = {
			guid : "",
			name : "",
			crn : "",
			count : "",
			amount : ""
		};
		const depostDetailObjTrans = {
			tid : "",
			guid : "",
			tDate : "",
			tContents : "",
			tType : "",
			tAmount : "",
			tResultAmount : ""
		};
		// 잔액조회
		
		const balanseHeader = [
			"거래번호 ",
			"거래일자",
			"거래타입",
			"거래금액",
			"잔액"
		];
		
		const balanceCol = [
			"trNo",
			"trDate",
			"trType",
			"trAmt",
			"balance"
		];
		
		const balanceObjTrans = {
				trNo : "" ,
				trDate : "" ,
				trType : "" ,
				trAmt : "" ,
				balance : "" 
			};
		
		
		//
		vm.options = {
			view : 'month',
			format : 'MMMM YYYY',
			maxView : 'false',
			minView : 'month'
		}
		vm.formats = [
			"MMMM YYYY",
			"DD MMM YYYY",
			"ddd MMM DD YYYY",
			"D MMM YYY HH:mm",
			"|||"
		]

		//dataTable attribute setting 
		vm.dtOptionsMember = DTOptionsBuilder
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
						vm.loadDataForm = true;
						exportTransactionExcel();
					}
				}
			]);
		

        var buttonOps = DTOptionsBuilder
        .newOptions()
        .withPaginationType('numbers')
        .withDisplayLength(10)
        .withOption('paging', false)
        .withOption('searching', false)
        .withOption('lengthChange', false)
        .withOption('ordering', true)
        .withOption('info', false)
        .withOption('order',[1,'desc'])
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
			},
			/*{
				extend : 'pdf',
				filename : 'balance'+ $filter('date')(new Date(), 'yyyy-MM-dd'),
				text : "<i class='fa fa-file-pdf-o text-danger'></i>&nbsp;|&nbsp;PDF",
				exportOptions : {
					modifier : {
						page : 'all'
					}
				}
			},*/
			{
				text : "<i class='fa fa-file-excel-o text-navy'></i>&nbsp;|&nbsp;Download All",
				action : function(e, dt, node, config) {
					$log.debug('Button Download All activated');
					vm.loadDataForm = true;
					exportTransactionExcel();
				}
			}
        ]);

        var noButtonOps = DTOptionsBuilder
        .newOptions()
        .withPaginationType('numbers')
        .withDisplayLength(10)
        .withOption('paging', false)
        .withOption('searching', false)
        .withOption('lengthChange', false)
        .withOption('ordering', true)
        .withOption('info', false)
        .withOption('order',[1,'desc'])
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
        	
        ]);
        
        
        (function initController(){
        	console.log('account tab init');
        	
        	
        	$scope.$emit('$stateChangeSuccess','');
        })();
      	 $scope.$on('$stateChangeSuccess', function(event, toState) {
 		 	console.log(toState.name);
 		 	console.log(toState);
 		 	
 		 	if(toState.name.indexOf('index.seyfertAccounting') != -1){
			  	var stateNameComponents = toState.name.split('.');
			    var stateName = stateNameComponents[(stateNameComponents.length - 1)];
			    
			    $scope.tabs = {
			      all : false,
			      deposit : false,
			      commission : false,
			      settlement : false,
			      mtAccountBalance : false
			    };
			    if(stateName == 'seyfertAccounting'){
			    	stateName = 'all';
			    }
			    
			    $scope.tabs[stateName] = true;
			    $scope.params = $state.params;
			    console.log($scope.params);
			    console.log($scope.params);
			    console.log($scope.params);
			    console.log($scope.params);
			    
		 	}
 	  });
        
        
        
		var paramExportAll = '';
		// SC 이체 PROD 에서만 가능하도록 
		var HOST_URI = window.location.hostname;
		
		if (HOST_URI == "dev5.paygate.net") {
			vm.isTrasfering = true;
		}else if (HOST_URI == "stg5.paygate.net") {
			vm.isTrasfering = true;
		}else if (HOST_URI == "v5.paygate.net") {
			vm.isTrasfering = false;
		}else{
			vm.isTrasfering = true;
		}
		
		
		function exportTransactionExcel() {
			//			var fileName = "List_Transaction_All_" + $filter('date')(new Date(), 'yyyy-MM-dd');

			var comments = "Excel 파일 다운로드 합니다. \n 다소 시간이 소요 되오니 참고 부탁드립니다. \n 파일 다운로드 완료 팝업창이 뜰 때 까지 기다려 주세요 ";
			swal("안내!", comments, "info");
			jsonToExcel();
		}
		function jsonToExcel(jsonData, fileName) {
			//TODO current 페이지가 어딘지 보기 .. 
			/*console.log($scope.currentPage);
			console.log($scope.currentPage == 'settlement');*/

			var types = {
				"date" : "String",
				"trType" : "String",
				"frgnTrrnsAmt" : "String",
				"funcCnvrtedTrmsAmt" : "String",
				"margin" : "String",
				"tid" : "String",
				"middleRate" : "String",
				"frgnTrrnsAmt2" : "String",
				"trrnsAmt" : "String",
				"commissionAmt" : "String",
				"frgnDepoBalance" : "String",
				"frgnBalance" : "String",
				"krwTrrnsAmt" : "String",
				"funcCnvrtedBalance" : "String",
				"movingAverage" : "String"
			};
			/*var ttt={
					"guid" : "String",
					"name" : "String",
					"crn" : "String",
					"vaCount" : "String",
					"totalAmount" : "String",
					"totalCount" : "String",
					"rateTrrcnAmount" : "String",
					"rateCount" : "String",
					"rateType " : "String",
					"fee" : "String",
					"finalRateAmount" : "String",
					"chargingFee" : "String"
			};
			*/
			var lableHeader = [];
			var cols = [];
			var objTrans = {};

			var emitXmlHeader = function() {
				var headerRow = '<ss:Row>\n';
				for (var i = 0; i < lableHeader.length; i++) {
					headerRow += '  <ss:Cell>\n';
					headerRow += '    <ss:Data ss:Type="String">';
					headerRow += lableHeader[i] + '</ss:Data>\n';
					headerRow += '  </ss:Cell>\n';
				}
				headerRow += '</ss:Row>\n';

				/*'<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +*/
				/*return '<?xml version="1.0"?>\n' +
					'<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
					'<ss:Worksheet ss:Name="Accounting">\n' +
					'<ss:Table>\n\n' + headerRow;*/
				return '<?xml version="1.0"?>\n' +
					'<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
					'<ss:ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">' +
					"</ss:ExcelWorkbook>" +
					'<ss:Worksheet ss:Name="Accounting">\n' +
					'<ss:Table>\n\n' + headerRow;
			};
			var emitXmlFooter = function() {
				return '\n</ss:Table>\n' +
					'</ss:Worksheet>\n' +
					'</ss:Workbook>\n';
			};
			var offsetExcel = 0;
			//
			var execDownDt;

			// 수입수수료 조회
			function getCommissionAllList() {
				return $q(function(resolve, reject) {

					var params = "startDt=" + Type.commission.startDate + "&endDt=" + Type.commission.endDate + "&offset=" + offsetExcel + "&limit=10";

					if (Type.commission.crn != null
						&& Type.commission.crn != '') {
						var params = "startDt=" + Type.commission.startDate + "&endDt=" + Type.commission.endDate + "&" + Type.commission.crn + "&offset=" + offsetExcel + "&limit=10";
					}

					execDownDt = "comission_" + Type.commission.startDate + "_" + Type.commission.endDate;
					console.log(params);

					AccountService.getCommissionExchange(params).then(function(response) {

						if (response.status == 'ERROR') {
							reject("ERROR");
							/*swal({
								title: $translate.instant('ERROR'),
								text: response.data.cdKey + ":" + response.data.cdDesc,
								type: "error",
								confirmButtonText: $translate.instant('btnOK')
							});
							
							if(response.data.cdKey == 'SESSION_EXPIRED' 
								|| response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'
								|| response.data.cdKey == 'UNKNOWN_ERROR'){
								$state.go('login');;
								if (!$rootScope.$$phase) $rootScope.$apply();
							}*/
							if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
								swal({
									title : $translate.instant('ERROR'),
									text : $translate.instant('errorComments'),
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});

								$state.go('login');
								if (!$rootScope.$$phase) $rootScope.$apply();

							} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
								Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
							} else {
								swal({
									title : $translate.instant('ERROR'),
									text : response.data.cdKey + ":" + response.data.cdDesc,
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							}
						} else if (response.status == 'SUCCESS') {

							var obj = Utils.getJsonObj(response.data.list);

							if (Utils.isUndefinedOrNull(obj.status)) {
								reject("ERROR");
								swal({
									title : $translate.instant('ERROR'),
									text : "Error!!! Can not download",
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							} else {
								var jsonObject = response.data.list;
								if (jsonObject == null ||
									jsonObject.length <= 0) {
									if (isTest) {
										console.log("데이터 송신완료");
									}

									reject(xml);
								} else {
									var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
									//								jsonToExcel(obj.transactionList, fileName);
									for (row = 0; row < data.length; row++) {
										xml += '<ss:Row>\n';
										var dataCol = angular.extend(objTrans, data[row]);
										for (col in dataCol) {
											if (cols.indexOf(col) != -1) {
												var cell = data[row][col];
												if (cell == undefined) {
													cell = "";
												}

												xml += '  <ss:Cell>';
												if (col == "total"
													|| col == "commission"
												) {
													xml += '    <ss:Data ss:Type="Number">';
												} else {
													xml += '    <ss:Data ss:Type="String">';
												}
												xml += cell + '</ss:Data>';
												xml += '  </ss:Cell>';

											}
										}
										xml += '</ss:Row>\n';
										resolve(xml);
									}
								}
							}
						}
					});
				});
			}

			//수입수수료 상세정보 
			function getAPIResponse(data) {
				return $q(function(resolve, reject) {
					var params = "startDt=" + Type.commission.startDate + "&endDt=" + Type.commission.endDate + "&offset=" + offsetExcel + "&limit=10&reqDataMemGuid=" + Type.commission.reqDataMemGuid;

					if (Type.commission.crn != null
						&& Type.commission.crn != '') {
						var params = "startDt=" + Type.commission.startDate + "&endDt=" + Type.commission.endDate + "&" + Type.commission.crn + "&offset=" + offsetExcel + "&limit=10&reqDataMemGuid=" + Type.commission.reqDataMemGuid;
					}

					execDownDt = "comission_detail_" + Type.commission.startDate + "_" + Type.commission.endDate;

					if (isTest) {
						console.log(params);
					}
					//					var param = "startDt=20160101&endDt=20161231&offset="+offsetExcel+"&limit=10&reqDataMemGuid=PayGateNet" ;
					AccountService.getCommisionExchangeDetails(params).then(function(response) {
						if (response.status == 'ERROR') {
							reject("ERROR");
							swal({
								title : $translate.instant('ERROR'),
								text : "Error!!! Can not download",
								type : "error",
								confirmButtonText : $translate.instant('btnOK')
							});

						} else if (response.status == 'SUCCESS') {
							var obj = Utils.getJsonObj(response.data.list);

							if (Utils.isUndefinedOrNull(obj.status)) {
								reject("ERROR");
								swal({
									title : $translate.instant('ERROR'),
									text : "Error!!! Can not download",
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							} else {
								var jsonObject = response.data.list;

								if (jsonObject == null ||
									jsonObject.length <= 0) {
									if (isTest) {
										console.log("데이터 수신완료");
									}

									reject(xml);
								} else {
									for (row = 0; row < jsonObject.length; row++) {
										jsonObject[row].frgnTrrnsAmt2 = jsonObject[row].frgnTrrnsAmt;
									}
									var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
									//									jsonToExcel(obj.transactionList, fileName);
									for (row = 0; row < data.length; row++) {
										xml += '<ss:Row>\n';
										var dataCol = angular.extend(objTrans, data[row]);
										for (col in dataCol) {
											if (cols.indexOf(col) != -1) {
												var cell = data[row][col];
												//												
												if (cell == undefined) {
													cell = "";
												}
												xml += '  <ss:Cell>';
												if (col == "tid"
													|| col == "date"
													|| col == "trType"
												) {
													xml += '    <ss:Data ss:Type="String">';
												} else {
													xml += '    <ss:Data ss:Type="Number">';
												}
												xml += cell + '</ss:Data>';
												xml += '  </ss:Cell>';


											}
										}
										xml += '</ss:Row>\n';
										resolve(xml);
									}
								}
							}
						}


					});
				});


			}

			//월별 정산내역 조회 
			function getSettlementAllList() {
				return $q(function(resolve, reject) {
					var params = "startDt=" + Type.settlement.startDate + "&endDt=" + Type.settlement.endDate + "&offset=" + offsetExcel + "&limit=10";

					if (Type.settlement.crn != null
						&& Type.settlement.crn != '') {
						var params = "startDt=" + Type.settlement.startDate + "&endDt=" + Type.settlement.endDate + "&" + Type.settlement.crn + "&offset=" + offsetExcel + "&limit=10";
					//						execDownDt = Type.settlement.startDate +"_" +Type.settlement.endDate;
					}

					execDownDt = "settlement_" + Type.settlement.startDate + "_" + Type.settlement.endDate;

					if (isTest) {
						console.log(params);

					}

					AccountService.getSettlement(params).then(function(response) {
						if (response.status == 'ERROR') {
							reject("ERROR");
							/*swal({
								title: $translate.instant('ERROR'),
								text: response.data.cdKey + ":" + response.data.cdDesc,
								type: "error",
								confirmButtonText: $translate.instant('btnOK')
							});
							
							if(response.data.cdKey == 'SESSION_EXPIRED' 
								|| response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'
								|| response.data.cdKey == 'UNKNOWN_ERROR'){
								$state.go('login');;
								if (!$rootScope.$$phase) $rootScope.$apply();
							}*/
							if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
								swal({
									title : $translate.instant('ERROR'),
									text : $translate.instant('errorComments'),
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});

								$state.go('login');
								if (!$rootScope.$$phase) $rootScope.$apply();

							} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
								Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
							} else {
								swal({
									title : $translate.instant('ERROR'),
									text : response.data.cdKey + ":" + response.data.cdDesc,
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							}
						} else if (response.status == 'SUCCESS') {

							var obj = Utils.getJsonObj(response.data.list);

							if (Utils.isUndefinedOrNull(obj.status)) {
								reject("ERROR");
								swal({
									title : $translate.instant('ERROR'),
									text : "Error!!! Can not download ",
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							} else {
								var jsonObject = response.data.list;
								if (jsonObject == null ||
									jsonObject.length <= 0) {
									if (isTest) {
										console.log("completed");
									}
									reject(xml);
								} else {
									var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
									//								jsonToExcel(obj.transactionList, fileName);
									for (row = 0; row < data.length; row++) {
										xml += '<ss:Row>\n';
										var dataCol = angular.extend(objTrans, data[row]);
										for (col in dataCol) {
											if (cols.indexOf(col) != -1) {
												var cell = data[row][col];
												if (cell == undefined) {
													cell = "";
												}
												xml += '  <ss:Cell>';
												if (col == "guid"
													|| col == "name"
													|| col == "crn"
													|| col == "rateType"
												) {
													xml += '    <ss:Data ss:Type="String">';
												} else {
													xml += '    <ss:Data ss:Type="Number">';
												}
												if (col == "finalRateAmount") {
													if (cell == '' || cell == null) {
														/*														cell = data[row]['rateTrrcnAmount'];
																												cell = Utils.isNullOrUndifined(cell) ? "0" : cell;
																												*/

														cell = data[row]['finalRateAmount'];
														// 최정 수수료 청구 대상 값이 널이거나 값이 없을 때 
														if (cell == null || cell == '') {
															var rateType = data[row]['rateType'];
															if (rateType == '릴리즈/펀딩') {
																var tmpValue = data[row]['rateTrrcnAmount'] == null || data[row]['rateTrrcnAmount'] == '' ? 0 : data[row]['rateTrrcnAmount'];
																//																cell = cell == null || cell == '' ? tmpValue : cell ;
																cell = tmpValue;
																//																console.log(cell);

															} else if (rateType == '대출상환계좌 운영 개수') {
																var tmpValue = data[row]['vaCount'] == null || data[row]['vaCount'] == '' ? 0 : data[row]['vaCount'];
																//																cell = cell == null || cell == '' ? tmpValue : cell ;
																cell = tmpValue;
															} else {
																// 나머지는 수수료 대상 건수로 판별 .
																var tmpCount = data[row]['rateCount'] == null || data[row]['rateCount'] == '' ? 0 : data[row]['rateCount'];
																//cell = cell == null ||   cell  == '' ?  tmpCount :  cell ;
																cell = tmpCount;
															}
														}
													}
												}

												if (col == 'chargingFee') {
													if (cell == '' || cell == null) {
														cell = data[row]['fee'];
														cell = Utils.isNullOrUndifined(cell) ? "0" : cell;
													}
												}

												xml += cell + '</ss:Data>';
												xml += '  </ss:Cell>';
											}
										}
										xml += '</ss:Row>\n';
										resolve(xml);
									}
								}
							}
						}
					});
				});
			}


			function getSettlementAllDetailList() {
				return $q(function(resolve, reject) {
					var params = "startDt=" + Type.settlement.startDate + "&endDt=" + Type.settlement.endDate + "&offset=" + offsetExcel + "&limit=10&reqDataMemGuid=" + Type.settlement.reqDataMemGuid + "&rateType=" + encodeURIComponent(Type.settlement.rateType);
					if (Type.commission.crn != null
						&& Type.commission.crn != '') {
						var params = "startDt=" + Type.settlement.startDate + "&endDt=" + Type.settlement.endDate + "&" + Type.settlement.crn + "&offset=" + offsetExcel + "&limit=10&reqDataMemGuid=" + Type.settlement.reqDataMemGuid + "&rateType=" + encodeURIComponent(Type.settlement.rateType);
					}
					execDownDt = "settlement_detail_" + Type.settlement.startDate + "_" + Type.settlement.endDate;
					if (isTest) {
						console.log(params);

					}
					AccountService.getSettlementDetails(params).then(function(response) {
						if (response.status == 'ERROR') {
							reject("ERROR");
							/*swal({
								title: $translate.instant('ERROR'),
								text: response.data.cdKey + ":" + response.data.cdDesc,
								type: "error",
								confirmButtonText: $translate.instant('btnOK')
							});
							
							if(response.data.cdKey == 'SESSION_EXPIRED' 
								|| response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'
								|| response.data.cdKey == 'UNKNOWN_ERROR'){
								$state.go('login');;
								if (!$rootScope.$$phase) $rootScope.$apply();
							}*/
							if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
								swal({
									title : $translate.instant('ERROR'),
									text : $translate.instant('errorComments'),
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});

								$state.go('login');
								if (!$rootScope.$$phase) $rootScope.$apply();

							} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
								Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
							} else {
								swal({
									title : $translate.instant('ERROR'),
									text : response.data.cdKey + ":" + response.data.cdDesc,
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							}
						} else if (response.status == 'SUCCESS') {

							var obj = Utils.getJsonObj(response.data.list);

							if (Utils.isUndefinedOrNull(obj.status)) {
								reject("ERROR");
								swal({
									title : $translate.instant('ERROR'),
									text : "Error!!! Can not download",
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							} else {
								var jsonObject = response.data.list;
								if (jsonObject == null ||
									jsonObject.length <= 0) {
									if (isTest) {
										console.log("completed");

									}
									reject(xml);
								} else {
									var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
									//								jsonToExcel(obj.transactionList, fileName);
									for (row = 0; row < data.length; row++) {
										xml += '<ss:Row>\n';
										var dataCol = angular.extend(objTrans, data[row]);
										for (col in dataCol) {
											if (cols.indexOf(col) != -1) {
												var cell = data[row][col];
												if (cell == undefined) {
													cell = "";
												}
												xml += '  <ss:Cell>';
												if (col == "tAmount") {
													xml += '    <ss:Data ss:Type="Number">';
												} else {
													xml += '    <ss:Data ss:Type="String">';
												}
												xml += cell + '</ss:Data>';
												xml += '  </ss:Cell>';
											}
										}
										xml += '</ss:Row>\n';
										resolve(xml);
									}
								}
							}
						}
					});
				});
			}

			function getDepositAllList() {
				return $q(function(resolve, reject) {
					var params = "startDt=" + Type.deposit.startDate + "&endDt=" + Type.deposit.endDate + "&offset=" + offsetExcel + "&limit=10";
					if (Type.deposit.crn != null
						&& Type.deposit.crn != '') {
						var params = "startDt=" + Type.deposit.startDate + "&endDt=" + Type.deposit.endDate + "&" + Type.deposit.crn + "&offset=" + offsetExcel + "&limit=10";
					}

					params += "&crrncy=" + Type.deposit.crrncy;

					execDownDt = "deposit_" + Type.deposit.startDate + "_" + Type.deposit.endDate;
					if (isTest) {
						console.log(params);

					}
					AccountService.getDeposit(params).then(function(response) {
						if (response.status == 'ERROR') {
							reject("ERROR");
							/*swal({
								title: $translate.instant('ERROR'),
								text: response.data.cdKey + ":" + response.data.cdDesc,
								type: "error",
								confirmButtonText: $translate.instant('btnOK')
							});
							
							if(response.data.cdKey == 'SESSION_EXPIRED' 
								|| response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED'
								|| response.data.cdKey == 'UNKNOWN_ERROR'){
								$state.go('login');;
								if (!$rootScope.$$phase) $rootScope.$apply();
							}*/
							if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
								swal({
									title : $translate.instant('ERROR'),
									text : $translate.instant('errorComments'),
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});

								$state.go('login');
								if (!$rootScope.$$phase) $rootScope.$apply();

							} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
								Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
							} else {
								swal({
									title : $translate.instant('ERROR'),
									text : response.data.cdKey + ":" + response.data.cdDesc,
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							}
						} else if (response.status == 'SUCCESS') {

							var obj = Utils.getJsonObj(response.data.list);

							if (Utils.isUndefinedOrNull(obj.status)) {
								reject("ERROR");
								swal({
									title : $translate.instant('ERROR'),
									text : "Error!!! Can not download",
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							} else {
								var jsonObject = response.data.list;
								if (jsonObject == null ||
									jsonObject.length <= 0) {
									if (isTest) {
										console.log("completed");

									}
									reject(xml);
								} else {
									var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
									//								jsonToExcel(obj.transactionList, fileName);
									for (row = 0; row < data.length; row++) {
										xml += '<ss:Row>\n';
										var dataCol = angular.extend(objTrans, data[row]);
										for (col in dataCol) {
											if (cols.indexOf(col) != -1) {
												var cell = data[row][col];
												if (cell == undefined) {
													cell = "";
												}
												xml += '  <ss:Cell>';
												if (col == "amount"
													|| col == "count") {
													xml += '    <ss:Data ss:Type="Number">';
												} else {
													xml += '    <ss:Data ss:Type="String">';
												}
												xml += cell + '</ss:Data>';
												xml += '  </ss:Cell>';
											}
										}
										xml += '</ss:Row>\n';
										resolve(xml);
									}
								}
							}
						}
					});
				});
			}

			function getDepositMemberAllList() {
				return $q(function(resolve, reject) {
					var params = "startDt=" + Type.deposit.startDate + "&endDt=" + Type.deposit.endDate + "&offset=" + offsetExcel + "&limit=10";
					if (Type.deposit.crn != null
						&& Type.deposit.crn != '') {
						var params = "startDt=" + Type.deposit.startDate + "&endDt=" + Type.deposit.endDate + "&" + Type.deposit.crn + "&offset=" + offsetExcel + "&limit=10";
					}

					params += "&crrncy=" + Type.deposit.crrncy;

					execDownDt = "deposit_member_" + Type.deposit.startDate + "_" + Type.deposit.endDate;
					if (isTest) {
						console.log(params);

					}
					AccountService.getDepositMember(params).then(function(response) {
						if (response.status == 'ERROR') {
							reject("ERROR");
							
							if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
								swal({
									title : $translate.instant('ERROR'),
									text : $translate.instant('errorComments'),
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});

								$state.go('login');
								if (!$rootScope.$$phase) $rootScope.$apply();

							} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
								Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
							} else {
								swal({
									title : $translate.instant('ERROR'),
									text : response.data.cdKey + ":" + response.data.cdDesc,
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							}
						} else if (response.status == 'SUCCESS') {

							var obj = Utils.getJsonObj(response.data.list);

							if (Utils.isUndefinedOrNull(obj.status)) {
								reject("ERROR");
								swal({
									title : $translate.instant('ERROR'),
									text : "Error!!! Can not download ",
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							} else {
								var jsonObject = response.data.list;
								if (jsonObject == null ||
									jsonObject.length <= 0) {
									if (isTest) {
										console.log("completed");

									}
									reject(xml);
								} else {
									var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
									//								jsonToExcel(obj.transactionList, fileName);
									for (row = 0; row < data.length; row++) {
										xml += '<ss:Row>\n';
										var dataCol = angular.extend(objTrans, data[row]);
										for (col in dataCol) {
											if (cols.indexOf(col) != -1) {
												var cell = data[row][col];
												if (cell == undefined) {
													cell = "";
												}

												xml += '  <ss:Cell>';
												if (col == "amount"
													|| col == "count") {
													xml += '    <ss:Data ss:Type="Number">';
												} else {
													xml += '    <ss:Data ss:Type="String">';
												}
												xml += cell + '</ss:Data>';
												xml += '  </ss:Cell>';

											}
										}
										xml += '</ss:Row>\n';
										resolve(xml);
									}
								}
							}
						}
					});
				});
			}
			function getDepositAllDetailList() {
				return $q(function(resolve, reject) {
					var params = "startDt=" + Type.deposit.startDate + "&endDt=" + Type.deposit.endDate + "&offset=" + offsetExcel + "&limit=10";
					if (Type.deposit.crn != null
						&& Type.deposit.crn != '') {
						var params = "startDt=" + Type.deposit.startDate + "&endDt=" + Type.deposit.endDate + "&" + Type.deposit.crn + "&offset=" + offsetExcel + "&limit=10";
					}

					params += "&crrncy=" + Type.deposit.crrncy + "&reqDataMemGuid=" + Type.deposit.reqDataMemGuid;

					execDownDt = "deposit_detail_" + Type.deposit.startDate + "_" + Type.deposit.endDate;
					if (isTest) {
						console.log(params);

					}

					AccountService.getDepositDetails(params).then(function(response) {
						if (response.status == 'ERROR') {
							reject("ERROR");
							if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
								swal({
									title : $translate.instant('ERROR'),
									text : $translate.instant('errorComments'),
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});

								$state.go('login');
								if (!$rootScope.$$phase) $rootScope.$apply();

							} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
								Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
							} else {
								swal({
									title : $translate.instant('ERROR'),
									text : response.data.cdKey + ":" + response.data.cdDesc,
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							}
						} else if (response.status == 'SUCCESS') {
							
							var obj = Utils.getJsonObj(response.data.list);

							if (Utils.isUndefinedOrNull(obj.status)) {
								reject("ERROR");
								swal({
									title : $translate.instant('ERROR'),
									text : "Error!!! Can not download",
									type : "error",
									confirmButtonText : $translate.instant('btnOK')
								});
							} else {
								var jsonObject = response.data.list;
								if (jsonObject == null ||
									jsonObject.length <= 0) {
									if (isTest) {
										console.log("completed");

									}
									reject(xml);
								} else {
									var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
									//								jsonToExcel(obj.transactionList, fileName);
									for (row = 0; row < data.length; row++) {
										xml += '<ss:Row>\n';
										var dataCol = angular.extend(objTrans, data[row]);
										for (col in dataCol) {
											if (cols.indexOf(col) != -1) {
												var cell = data[row][col];
												if (cell == undefined) {
													cell = "";
												}
												xml += '  <ss:Cell>';
												if (col == "tAmount"
													|| col == "tResultAmount") {
													xml += '    <ss:Data ss:Type="Number">';
												} else {
													xml += '    <ss:Data ss:Type="String">';
												}
												xml += cell + '</ss:Data>';
												xml += '  </ss:Cell>';

											}
										}
										xml += '</ss:Row>\n';
										resolve(xml);
									}
								}
							}
						}
					});
				});
			}

			function getMTAccntBalanceDetailList(){
				return $q(function(resolve, reject) {
					execDownDt = "balance_" + Type.mtaccntbal.startDate + "_" + Type.mtaccntbal.endDate;
					var limit = 500000;
					/*var limit = 10;*/
				    var params = 
				    	'startDt=' + Type.mtaccntbal.startDate + 
				    	'&endDt='  + Type.mtaccntbal.endDate + 
				    	"&offset=" + offsetExcel + 
				    	"&limit="  + limit + 
				    	"&trType=" + Type.mtaccntbal.type + 
				    	"&mthrAccntId="+Type.mtaccntbal.mthrAccntId;
				    
				    AccountService.getMTAccountBalanceDetails(params).then(function(response) {
					      //console.log(response);

					      if (response.status == 'ERROR') {
					        vm.loadDataForm = false;
				    		reject("ERROR");
					        if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
					          swal({
					            title : $translate.instant('ERROR'),
					            text : $translate.instant('errorComments'),
					            type : "error",
					            confirmButtonText : $translate.instant('btnOK')
					          });
					          $state.go('login');
					          if (!$rootScope.$$phase) $rootScope.$apply();

					        } else if (response.data.cdKey == 'UNKNOWN_ERROR') {
					          Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
					        } else {
					          swal({
					            title : $translate.instant('ERROR'),
					            text : response.data.cdKey + ":" + response.data.cdDesc,
					            type : "error",
					            confirmButtonText : $translate.instant('btnOK')
					          });
					        }

					      } else if (response.status == 'SUCCESS') {
					        var result = response.data;
					        var jsonObject = response.data.list;
					        
					        //console.log(response.data.list.length);
					        
					        var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
					        
					        var length = result.list.length;
					          if (result.list == null ||
					            result.list.length <= 0) {
					            vm.loadDataForm = false;
					            reject(xml);
					            //swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
					            return;
					          } else {
						        for (row = 0; row < data.length; row++) {
						          xml += '<ss:Row>\n';
						          var dataCol = angular.extend(objTrans, data[row]);
						          for (col in dataCol) {
						            if (cols.indexOf(col) != -1) {
						              var cell = data[row][col];
						              if (cell == undefined) {
						                cell = "";
						              }
						              xml += '  <ss:Cell>';
						              if (col == "trAmt"
						                || col == "balance") {
						                xml += '    <ss:Data ss:Type="Number">';
						              } else {
						                xml += '    <ss:Data ss:Type="String">';
						              }
						              
						              if(col == "trType"){
						            	  if(cell == "1"){
								              cell = "예치입금";
								            }else if(cell == "2"){
								            	cell = "투자출금";
								            }else if(cell == "4"){
								            	cell = "반환출금";
								            }else if(cell == "C"){
								            	cell = "상환입금";
								            }else if(cell == "I"){
								            	cell = "입금";
								            }else if(cell == "O"){
								            	cell = "출금";
								            }
						              }
						              xml += cell + '</ss:Data>';
						              xml += '  </ss:Cell>';
						            }
						          }
						          xml += '</ss:Row>\n';
						          resolve(xml);
						        }
					        }
					      }
					    });
				});
			}
			function getAPIList(currentPage) {
				var promise;
				if (currentPage == COMMISSION) {
					promise = getCommissionAllList();
				} else if (currentPage == COMMISSION_DETAIL) {
					promise = getAPIResponse();
				} else if (currentPage == SETTLEMENT) {
					promise = getSettlementAllList();
				} else if (currentPage == SETTLEMENT_DETAIL) {
					promise = getSettlementAllDetailList();
				} else if (currentPage == DEPOSIT) {
					promise = getDepositAllList();
				} else if (currentPage == DEPOSIT_DETAIL
					|| currentPage == DEPOSIT_MEMBER_DETAIL) {
					promise = getDepositAllDetailList();
				} else if (currentPage == DEPOSIT_MEMBER) {
					promise = getDepositMemberAllList();
				} else if (currentPage == MT_ACCOUNT_BALANCE_DETAIL) {
					promise = getMTAccntBalanceDetailList();
				}else {
					console.log("There is no definition");
					vm.loadDataForm = false;
					return;
				}

				promise.then(function(value) {
					if(currentPage == MT_ACCOUNT_BALANCE_DETAIL){
						offsetExcel += 500000 ;
					}else{
						offsetExcel += 10 ;
					}
					getAPIList(currentPage);

				}, function(reason) {
					if (reason == 'ERROR') {
						console.log("FAILED .... ");
						swal("", " 파일 다운로드에 실패 했습니다. 다시 시도 해 주세요. ", "error");
					} else {
						// 성공시에는 xml 정보가 넘어옴 .. 
						console.log("SUCCEESS");
						getDownLoad(reason);
					}
					vm.loadDataForm = false;
				});

			}

			var xml;
			var row;
			var col;
			var jsonToSsXml = function() {
								console.log($scope.currentPage);
				var tmpCurrentPage = '';
				if ($scope.currentPage == 'commission') {
					tmpCurrentPage = Type.commission.currentPage;
				} else if ($scope.currentPage == 'settlement') {
					tmpCurrentPage = Type.settlement.currentPage;
				} else if ($scope.currentPage == 'deposit'
					|| $scope.currentPage == DEPOSIT_DETAIL
					|| $scope.currentPage == DEPOSIT_MEMBER
					|| $scope.currentPage == DEPOSIT_MEMBER_DETAIL) {
					tmpCurrentPage = Type.deposit.currentPage;
				}else if($scope.currentPage == MT_ACCOUNT_BALANCE_DETAIL){
					
					
					tmpCurrentPage = Type.mtaccntbal.currentPage;
				}
				// 현재 페이지의 따른 엑셀 meta data 설정 
				setHeaderMetaData(tmpCurrentPage)
				// xml 헤더 설정 
				xml = emitXmlHeader();
				// 데이터 로우 쓰기
				//				return;
				//				console.log(tmpCurrentPage);
				if (tmpCurrentPage == null || tmpCurrentPage == '') {
					vm.loadDataForm = false;
					var comments = "조회 후 이용 바랍니다.";
					swal("", comments, "error");
					return;
				} else {
					var comments = "Excel 파일 다운로드 합니다. \n 다소 시간이 소요 되오니 \n 파일 다운로드 완료 팝업창이 뜰 때 까지 기다려 주세요 ";
					swal("안내!", comments, "info");
					getAPIList(tmpCurrentPage); // 이걸로는 리턴값을 XML 나오게 만들어서 할까나...
				}

			//TODO 비동기 통신으로 받아오는 정보가 다르다.. 그래서
			// promise pattern 으로 
			// 결과 받고 다시 요청하고 결과 받고 또 요청하고 이런 식으로 하기 .
			//				return xml;
			};
			function setHeaderMetaData(currentPage) {
				if (isTest) {
					console.log(currentPage);
				}
				if (currentPage == null || currentPage == '') {
					console.log("can not set header");
					return;
				}

				if (currentPage == COMMISSION) {
					lableHeader = cmmssHeader;
					cols = cmmssCols;
					objTrans = cmmssObjTrans;
				} else if (currentPage == COMMISSION_DETAIL) {
					lableHeader = cmmssDetailHeader;
					cols = cmmssDetailCols;
					objTrans = cmmssObjDetailTrans;
				} else if (currentPage == SETTLEMENT) {
					lableHeader = sttmntHeader;
					cols = sttmntCols;
					objTrans = sttmntObjTrans;
				//					types = sttmntType;
				} else if (currentPage == SETTLEMENT_DETAIL) {
					lableHeader = sttmntDetailHeader;
					cols = sttmntDetailCols;
					objTrans = sttmntDetailObjTrans;
				} else if (currentPage == DEPOSIT) {
					lableHeader = depostHeader;
					cols = depostCol;
					objTrans = depostObjTrans;
				} else if (currentPage == DEPOSIT_DETAIL
					|| currentPage == DEPOSIT_MEMBER_DETAIL) {
					lableHeader = depostDetailHeader;
					cols = depostDetailCol;
					objTrans = depostDetailObjTrans;
				} else if (currentPage == DEPOSIT_MEMBER) {
					//TODO member header 따로 세팅이 필요함 .. 
					lableHeader = depostHeader;
					cols = depostCol;
					objTrans = depostObjTrans;
				}else if(currentPage == MT_ACCOUNT_BALANCE_DETAIL){
					lableHeader = balanseHeader;
					cols = balanceCol;
					objTrans = balanceObjTrans;
				}

			}

			function getDownLoad(xml) {
				xml += emitXmlFooter();
				/*download(xml, "Accounting_"+$filter('date')(new Date(), 'yyyy-MM-dd') + ".xls", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');*/
				download(xml, "Accounting_" + execDownDt + ".xls", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			}
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

			jsonToSsXml();
		}

		/**
		 * @method 수수료 환전 조회 vm.rangeCommisnDate
		 *  
		 * */
		function searchExchangeCommission(isSearch, offset) {
			//			console.log("11");
			Type.commission.currentPage = COMMISSION;

			//			console.log(Type.commission.currentPage);
			vm.searchDisalbed = true;
			vm.loadDataForm = true;
			var startDt = '',
				endDt = '';
			var params = '';
			if ((vm.rangeCommisnDate.startDate != null) && (vm.rangeCommisnDate.endDate != null)) {

				var limit = 10;
				// == 09.28 수정 
				if (isSearch) {
					startDt = moment(vm.rangeCommisnDate.startDate).format("YYYYMMDD");
					endDt = moment(vm.rangeCommisnDate.endDate).format("YYYYMMDD");
					params = 'startDt=' + startDt + '&endDt=' + endDt + "&offset=" + offset + "&limit=" + limit;
					/*if(startDt != Type.commission.startDate
							|| endDt != Type.commission.endDate){
						vm.commissionList =[];
						Type.commission.offset = 0;
					}else{
						if(isSearch){
							vm.commissionList =[];
							Type.commission.offset = 0;
						}else{
						}
					}*/

					vm.commissionList = [];
					Type.commission.offset = 0;

					Type.commission.startDate = startDt;
					Type.commission.endDate = endDt;
				} else {
					params = 'startDt=' + Type.commission.startDate + '&endDt=' + Type.commission.endDate + "&offset=" + offset + "&limit=" + limit;
				}
				if (isTest) {
					console.log(params);

				}

			} else {
				vm.searchDisalbed = false;
				swal("", "조회 기간을 설정해주세요 ", "error");
				console.log("기간을 설정해 주삼!!!!!!");
				return;
			}
			var crn;
			if (isSearch) {
				crn = vm.transCmmssn.crn;
				if (crn != null && crn != '' && crn.length > 0) {
					crn = vm.transCmmssn.crn;
					Type.commission.crn = crn;
					params += "&crn=" + crn;
				} else {

				}
			} else {
				if (Type.commission.crn != null && crn != '' && Type.commission.crn.length > 0) {
					crn = Type.commission.crn;
					params += "&crn=" + crn;
				}
			}

			if (isTest) {

				console.log(params);
			}

			AccountService.getCommissionExchange(params).then(function(response) {

				if (response.status == 'ERROR') {
					
					vm.searchDisalbed = false;
					vm.loadDataForm = false;
					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
						swal({
							title : $translate.instant('ERROR'),
							text : $translate.instant('errorComments'),
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
						$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();

					} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
						Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
					} else {
						swal({
							title : $translate.instant('ERROR'),
							text : response.data.cdKey + ":" + response.data.cdDesc,
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					}
				} else if (response.status == 'SUCCESS') {

					var result = response.data;
					if (isTest) {
						console.log(result);

					}

					if (result.list == ''
						|| result.list.length <= 0
						|| result.list.length == null
					) {

						swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
						vm.searchDisalbed = false;
						vm.loadDataForm = false;
						return;
					}

					if (vm.commissionList == ''
						|| vm.commissionList.length < 0
						|| vm.commissionList == null) {
						vm.commissionList = result.list;
						if (isTest) {
							console.log("init");

						}
					} else {
						if (isTest) {
							console.log(result.list);
							console.log(result.list.length);
						}

						var length = result.list.length;
						if (result.list == null ||
							result.list.length <= 0) {
							vm.loadDataForm = false;
							vm.searchDisalbed = false;
							swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
							return;
						} else {
							for (var i = 0; i < length; i++) {

								vm.commissionList.push(result.list[i]);
							}
						}
					}
					vm.loadDataForm = false;
					vm.searchDisalbed = false;
					vm.loadMoreCommisnDisalbed = false;
				}
			});
		}
		vm.searchExchangeCommission = searchExchangeCommission;


		/**
		 *  @method 수수료 환전 상세 조회 
		 * 
		 * */
		var offset = 0;
		//		var offsetDetails = 0;
		var limit = 10;
		//		var tmpreqDataMemGuid ;
		function searchExchangeCommissionDetails(reqDataMemGuid, offset) {
			var startDt = '',
				endDt = '';
			var params = '';
			vm.loadDataForm = true;
			Type.commission.currentPage = COMMISSION_DETAIL;

			//유효성 검사 
			if ((Type.commission.startDate != null) && (Type.commission.endDate != null)) {
				startDt = Type.commission.startDate;
				endDt = Type.commission.endDate;
				params = 'startDt=' + startDt + '&endDt=' + endDt + "&offset=" + offset + "&limit=" + limit;
				vm.rangeCmmssnDetails = {};
				vm.rangeCmmssnDetails.startDate = startDt;
				vm.rangeCmmssnDetails.endDate = endDt;

			} else {
				swal("", "조회 기간을 설정해주세요 ", "error");
				return;
			}

			var crn = Type.commission.crn;
			if (crn != null && crn != '' && crn.length > 0) {
				params += "&" + crn;
			}

			Type.commission.reqDataMemGuid = reqDataMemGuid;
			params += "&reqDataMemGuid=" + reqDataMemGuid;

			AccountService.getCommisionExchangeDetails(params).then(function(response) {
				if (response.status == 'ERROR') {
					vm.searchDisalbed = false;
					vm.loadDataForm = false;
					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
						swal({
							title : $translate.instant('ERROR'),
							text : $translate.instant('errorComments'),
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
						$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();

					} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
						Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
					} else {
						swal({
							title : $translate.instant('ERROR'),
							text : response.data.cdKey + ":" + response.data.cdDesc,
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					}

				} else if (response.status == 'SUCCESS') {
					var result = response.data;
					if (isTest) {
						console.log(result);

					}

					if (result.list == ''
						|| result.list.length <= 0
						|| result.list.length == null
					) {

						vm.loadDataForm = false;
						vm.searchDisalbed = false;
						swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
						return;
					}
					if (vm.commissionDetailList == '' ||
						vm.commissionDetailList.length < 0
						|| vm.commissionDetailList == null) {
						vm.commissionDetailList = result.list;
						vm.commission = 'modules/seyfertAccounting/views/commissionDetail.html' + Utils.getExtraParams();
					} else {
						var length = result.list.length;
						if (result.list == null ||
							result.list.length <= 0) {
							vm.loadDataForm = false;
							vm.searchDisalbed = false;
							swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
							return;
						} else {
							for (var i = 0; i < length; i++) {
								vm.commissionDetailList.push(result.list[i]);
							}
						}
					}
					vm.searchDisalbed = false;
					vm.loadDataForm = false;
				}
			});
		}
		vm.searchExchangeCommissionDetails = searchExchangeCommissionDetails;
/*		vm.ddd='';*/
		vm.showDate = {};
		vm.dateChange = function() {
			//			console.log(vm.dates);
			var year = moment(vm.dates).format("YYYY");
			var mon = moment(vm.dates).format("MM");

			var firstDay = (new Date(year, mon)).getDate();
			var lastDay = (new Date(year, mon, 0)).getDate();

			var tmp = moment(vm.dates).format("YYYYMM");

			
			console.log($scope.currentPage);
			// TODO if currentPage = sttlement else mtaccntbalance 
			if ($scope.currentPage == SETTLEMENT) {
				startMonthDt = tmp + "0" + firstDay;
				endMonthDt = tmp + lastDay;
			} else if ($scope.currentPage == MT_ACCOUNT_BALANCE
					|| $scope.currentPage == MT_ACCOUNT_BALANCE_DETAIL) {
				mtStartMonthDt = tmp + "0" + firstDay;
				mtEndMonthDt = tmp + lastDay;
				//console.log(mtStartMonthDt);
				
				/*vm.rangeMtAccntBalDate.startDate = mtStartMonthDt;
				vm.rangeMtAccntBalDate.endDate = mtEndMonthDt;*/
				
			}
				/*console.log(mtStartMonthDt);
				console.log(mtEndMonthDt);*/

		}

		// 현재 월의 첫날 및 마지막 날 구하는 Method 
		function initMonth() {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;

			month = month < 10 ? "0" + month : month;

			var tmp = year + "" + month;

			var firstDay = (new Date(year, month)).getDate();
			var lastDay = (new Date(year, month, 0)).getDate();

			startMonthDt = tmp + "0" + firstDay;
			endMonthDt = tmp + lastDay;
		}
		//		initMonth();

		/**
		 * @method 월 별 정산 조회  param isSearch = 검색으로 클릭했는지 더보기로 클릭했는지 분기여부 .. 
		 * */
		function searchSettlementList(isSearch, offset) {
			Type.settlement.currentPage = SETTLEMENT;
			vm.searchDisalbed = true;
			vm.loadDataForm = true;

			var startDt = '',
				endDt = '';
			$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.trans));
			//			$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.rangeDate));

			var params = '';
			var limit = 10;
			if (vm.isMonthToMonth == 'range') {
				if ((vm.rangeSettleMnntDate.startDate != null) && (vm.rangeSettleMnntDate.endDate != null)) {
					//					var tmpStorage = endDt-startDt;
					//					var limit = 10;  // Type.settlement.offset
					startDt = moment(vm.rangeSettleMnntDate.startDate).format("YYYYMMDD");
					endDt = moment(vm.rangeSettleMnntDate.endDate).format("YYYYMMDD");

					if (isTest) console.log(params);
					vm.isUnEditable = true;
				} else {
					swal("", "조회 기간을 설정해주세요 ", "error");
					vm.loadDataForm = false;
					vm.searchDisalbed = false;
					if (isTest) console.log("기간을 설정해 주세요");

					return;
				}

			} else if (vm.isMonthToMonth == 'month') {
				startDt = startMonthDt;
				endDt = endMonthDt;

				if (Utils.isNullOrUndifined(startDt)
					|| Utils.isNullOrUndifined(endDt)) {

					swal("", "조회 기간을 설정해주세요 ", "error");

					vm.loadDataForm = false;
					vm.searchDisalbed = false;
					return;
				}

				vm.isUnEditable = false;
				if (isTest) {
					console.log(startDt);
					console.log(endDt);
				}
			}

			if (isSearch) {
				params = 'startDt=' + startDt + '&endDt=' + endDt + "&offset=" + offset + "&limit=" + limit;

				vm.settlementList = [];
				settlementOrgList = [];
				Type.settlement.offset = 0;

				Type.settlement.startDate = startDt;
				Type.settlement.endDate = endDt;
			} else {
				params = 'startDt=' + Type.settlement.startDate + '&endDt=' + Type.settlement.endDate + "&offset=" + offset + "&limit=" + limit;
			}

			var crn;
			if (isSearch) {
				crn = $httpParamSerializer(vm.transSttmnt)
				if (crn != null && crn != '' && crn.length > 0) {
					//					console.log("11111"  + $httpParamSerializer(vm.trans));
					crn = $httpParamSerializer(vm.transSttmnt);
					Type.settlement.crn = crn;
					//					params = 'startDt=' + startDt + '&endDt=' + endDt +"&offset="+offset+"&limit="+limit +"&"+ crn;
					params += "&" + crn;
				} else {

				}
			} else {
				if (Type.settlement.crn != null && crn != '' && Type.settlement.crn.length > 0) {
					crn = Type.settlement.crn;
					params += "&" + crn;
				}
			}
			if (isTest) {
				console.log(params);
			}
			AccountService.getSettlement(params).then(function(response) {
				if (response.status == 'ERROR') {

					vm.searchDisalbed = false;
					vm.loadDataForm = false;
					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
						swal({
							title : $translate.instant('ERROR'),
							text : $translate.instant('errorComments'),
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
						$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();

					} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
						/*$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();
						Utils.getErrorHanler(response.data.cdKey , response.data.cdDesc);*/
						Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);

					} else {
						swal({
							title : $translate.instant('ERROR'),
							text : response.data.cdKey + ":" + response.data.cdDesc,
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					}


				} else if (response.status == 'SUCCESS') {
					var result = response.data;
					if (isTest) {

						console.log(result);
					}

					if (result.list == ''
						|| result.list.length <= 0
						|| result.list.length == null
					) {
						vm.searchDisalbed = false;
						vm.loadDataForm = false;
						swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
						return;
					}
					if (vm.settlementList == '' ||
						vm.settlementList.length < 0
						|| vm.settlementList == null) {
						//vm.settlementList = result.list;

						if (isTest) {
							console.log("init");
						}
						//added 최종수수료 대상 널일 때 수수료 유형 별로 값넣어주기  
						var stLength = result.list.length;
						for (var i = 0; i < stLength; i++) {
							if (result.list[i].finalRateAmount == null || result.list[i].finalRateAmount == '') {
								if (result.list[i].rateType == '릴리즈/펀딩') {
									var tmpValue = result.list[i].rateTrrcnAmount == null || result.list[i].rateTrrcnAmount == '' ? 0 : result.list[i].rateTrrcnAmount;
									result.list[i].finalRateAmount = tmpValue;
								} else if (result.list[i].rateType == '대출상환계좌 운영 개수') {
									var tmpValue = result.list[i].vaCount == null || result.list[i].vaCount == '' ? 0 : result.list[i].vaCount;
									result.list[i].finalRateAmount = tmpValue;
								} else {
									// 나머지는 수수료 대상 건수로 판별 .
									var tmpCount = result.list[i].rateCount == null || result.list[i].rateCount == '' ? 0 : result.list[i].rateCount;
									//									var tmpValue =  result.list[i].finalRateAmount == null || result.list[i].finalRateAmount == '' ?  tmpCount : result.list[i].finalRateAmount;
									result.list[i].finalRateAmount = tmpCount;
								}
							}
						}
						// 최종수수료 대상 널일 때 수수료 유형 별로 값넣어주기
						vm.settlementList = result.list;
					} else {
						if (isTest) {
							console.log(result.list);
							console.log(result.list.length);
							console.log("=====");

						}

						var length = result.list.length;
						if (result.list == null ||
							result.list.length <= 0) {
							vm.loadDataForm = false;
							vm.searchDisalbed = false;
							swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
							return;
						} else {
							for (var i = 0; i < length; i++) {
								settlementOrgList.push(result.list[i]);

								if (result.list[i].finalRateAmount == null || result.list[i].finalRateAmount == '') {
									if (result.list[i].rateType == '릴리즈/펀딩') {
										var tmpValue = result.list[i].rateTrrcnAmount == null || result.list[i].rateTrrcnAmount == '' ? 0 : result.list[i].rateTrrcnAmount;
										result.list[i].finalRateAmount = tmpValue;
									} else if (result.list[i].rateType == '대출상환계좌 운영 개수') {
										var tmpValue = result.list[i].vaCount == null || result.list[i].vaCount == '' ? 0 : result.list[i].vaCount;
										result.list[i].finalRateAmount = tmpValue;
									} else {
										// 나머지는 수수료 대상 건수로 판별 .
										var tmpCount = result.list[i].rateCount == null || result.list[i].rateCount == '' ? 0 : result.list[i].rateCount;
										//										var tmpValue =  result.list[i].finalRateAmount == null || result.list[i].finalRateAmount == '' ?  tmpCount : result.list[i].finalRateAmount;
										result.list[i].finalRateAmount = tmpCount;
									}
								}

								vm.settlementList.push(result.list[i]);
							}
						}
					}
					vm.loadDataForm = false;
					vm.searchDisalbed = false;
					vm.loadMoreSettmntDisalbed = false;

				}

			});

		}
		vm.searchSettlementList = searchSettlementList;
		//		var tmpRateType;

		/**
		 * @method 월 별 정산 상세 조회 
		 * */
		function searchSettlementListDetails(reqDataMemGuid, rateType, offset) {
			vm.loadDataForm = true;
			Type.settlement.currentPage = SETTLEMENT_DETAIL;
			var startDt = '',
				endDt = '';

			var params = '';
			if ((Type.settlement.startDate != null) && (Type.settlement.endDate != null)) {
				startDt = Type.settlement.startDate;
				endDt = Type.settlement.endDate
				tmpRateType = rateType;
				// rateType은 URL encoding 해서 request .
				vm.rangeSttlmnDetails = {};
				vm.rangeSttlmnDetails.startDate = startDt;
				vm.rangeSttlmnDetails.endDate = endDt;
				Type.settlement.rateType = tmpRateType;
				//				
				params = 'startDt=' + startDt + '&endDt=' + endDt + "&offset=" + offset + "&limit=" + limit + "&rateType=" + encodeURIComponent(rateType);
				console.log(params);

			} else {
				swal("", "조회 기간을 설정해주세요 ", "error");
				if (isTest) {
					console.log("기간을 설정해 주삼!!!!!!");

				}
				return;
			}

			var crn = Type.settlement.crn;
			if (crn != null && crn != '' && crn.length > 0) {
				params += "&" + crn;
			}

			Type.settlement.reqDataMemGuid = reqDataMemGuid;
			params += "&reqDataMemGuid=" + reqDataMemGuid;
			if (isTest) {
				console.log(params);

			}

			AccountService.getSettlementDetails(params).then(function(response) {
				if (response.status == 'ERROR') {
					vm.loadDataForm = false;
					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
						swal({
							title : $translate.instant('ERROR'),
							text : $translate.instant('errorComments'),
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
						$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();

					} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
						Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
					} else {
						swal({
							title : $translate.instant('ERROR'),
							text : response.data.cdKey + ":" + response.data.cdDesc,
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					}

				} else if (response.status == 'SUCCESS') {
					var result = response.data;
					console.log(result);

					if (result.list == ''
						|| result.list.length <= 0
						|| result.list.length == null
					) {
						vm.loadDataForm = false;

						swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
						return;
					}

					if (vm.settlementDetailList == '' ||
						vm.settlementDetailList.length < 0
						|| vm.settlementDetailList == null) {
						vm.settlementDetailList = result.list;
						vm.settlement = 'modules/seyfertAccounting/views/settlementDetail.html' + Utils.getExtraParams();
					} else {

						if (isTest) {
							console.log(result.list);
							console.log(result.list.length);
						}

						var length = result.list.length;
						if (result.list == null ||
							result.list.length <= 0) {
							vm.loadDataForm = false;

							swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
							return;
						} else {
							for (var i = 0; i < length; i++) {
								vm.settlementDetailList.push(result.list[i]);
							}
						}
					}
					vm.loadDataForm = false;
				}
			});
		}
		vm.searchSettlementListDetails = searchSettlementListDetails;

		/**
		 * @method 예수금 조회 required parameter startDate & endDate & crrncy  
		 * */
		function searchDepositList(isSearch, offset) {
			vm.loadDataForm = true;
			vm.searchDisalbed = true;
			Type.deposit.currentPage = DEPOSIT;
			$scope.currentPage = DEPOSIT;


			$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.transDepost));

			//			vm.searchDisalbed = true;
			var startDt = '',
				endDt = '';
			//			vm.rangeDepositDate
			var params = '';
			if ((vm.rangeDepositDate.startDate != null) && (vm.rangeDepositDate.endDate != null)) {
				var limit = 10;
				if (isSearch) {
					startDt = moment(vm.rangeDepositDate.startDate).format("YYYYMMDD");
					endDt = moment(vm.rangeDepositDate.endDate).format("YYYYMMDD");
					params = 'startDt=' + startDt + '&endDt=' + endDt + "&offset=" + offset + "&limit=" + limit;
					/*if(startDt != Type.deposit.startDate
							|| endDt != Type.deposit.endDate){
						vm.depositList =[];
						Type.deposit.offset = 0;
					}else{
						if(isSearch){
							vm.depositList =[];
							Type.deposit.offset = 0;
						}
					}
					
					Type.deposit.startDate = moment(vm.rangeDepositDate.startDate).format("YYYYMMDD");
					Type.deposit.endDate =  moment(vm.rangeDepositDate.endDate).format("YYYYMMDD");
					*/

					vm.depositList = [];
					Type.deposit.offset = 0;

					Type.deposit.startDate = startDt;
					Type.deposit.endDate = endDt;


					vm.rangeDepositMemDate.startDate = Type.deposit.startDate;
					vm.rangeDepositMemDate.endDate = Type.deposit.endDate;
				} else {
					params = 'startDt=' + Type.deposit.startDate + '&endDt=' + Type.deposit.endDate + "&offset=" + offset + "&limit=" + limit;
				}

				if (isTest) {
					console.log(params);

				}

			} else {
				vm.searchDisalbed = false;
				swal("", "조회 기간을 설정해주세요 ", "error");
				if (isTest) {
					console.log("기간을 설정해 주삼!!!!!!");

				}
				return;
			}

			var crrncy = '';
			if (isSearch) {
				crrncy = vm.transDepost.crrncy;
				if (crrncy != null && crrncy != '' && crrncy.length > 0) {
					crrncy = vm.transDepost.crrncy;
					Type.deposit.crrncy = crrncy;
					params += "&crrncy=" + crrncy;
				} else {
					//화폐 지정 유효성 검사 .
					return;
				}

			} else {
				if (Type.deposit.crrncy != null && crn != '' && Type.deposit.crrncy.length > 0) {
					crrncy = Type.deposit.crrncy;
					params += "&crrncy=" + crrncy;
				}
			}

			var crn;
			if (isSearch) {
				crn = vm.transDepost.crn;
				if (crn != null && crn != '' && crn.length > 0) {
					crn = vm.transDepost.crn;
					Type.deposit.crn = crn;
					params += "&crn=" + crn;
				} else {

				}
			} else {
				if (Type.deposit.crn != null && crn != '' && Type.deposit.crn.length > 0) {
					crn = Type.deposit.crn;
					params += "&crn=" + crn;
				}
			}

			if (isTest) {
				console.log(params);

			}
			AccountService.getDeposit(params).then(function(response) {

				if (response.status == 'ERROR') {
					vm.searchDisalbed = false;
					vm.loadDataForm = false;
					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
						swal({
							title : $translate.instant('ERROR'),
							text : $translate.instant('errorComments'),
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
						$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();

					} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
						Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);

					} else {
						swal({
							title : $translate.instant('ERROR'),
							text : response.data.cdKey + ":" + response.data.cdDesc,
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					}
				} else if (response.status == 'SUCCESS') {

					var result = response.data;
					console.log(result);

					if (result.list == ''
						|| result.list.length <= 0
						|| result.list.length == null
					) {
						vm.loadDataForm = false;
						swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
						vm.searchDisalbed = false;
						return;
					}

					if (vm.depositList == ''
						|| vm.depositList.length < 0
						|| vm.depositList == null) {

						vm.depositList = result.list;
//						console.log("inininini");

					} else {
						//						vm.commissionDetailList += result.list;
						console.log(result.list);
						console.log(result.list.length);

						var length = result.list.length;
						// response 데이터가 없을 시에는 조회 할 데이터가 없는것임 .. 
						if (result.list == null ||
							result.list.length <= 0) {
							vm.loadDataForm = false;
							swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
							return;
						} else {
							for (var i = 0; i < length; i++) {
//								console.log("11")
								vm.depositList.push(result.list[i]);
							}
						}
					}
					vm.loadDataForm = false;
					vm.searchDisalbed = false;
					vm.loadMoreDepostDisalbed = false;
				}
			});

		}
		vm.searchDepositList = searchDepositList

		function searchDepositMemberList(isSearch, offset) {
			vm.loadDataForm = true;
			vm.searchDisalbed = true;
			Type.deposit.currentPage = DEPOSIT_MEMBER;
			$scope.currentPage = DEPOSIT_MEMBER;

			var startDt = '',
				endDt = '';
			var params = '';

			$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.transDepost));

			if ((vm.rangeDepositDate.startDate != null) && (vm.rangeDepositDate.endDate != null)) {

				var limit = 10;
				if (isSearch) {
					startDt = moment(vm.rangeDepositDate.startDate).format("YYYYMMDD");
					endDt = moment(vm.rangeDepositDate.endDate).format("YYYYMMDD");
					params = 'startDt=' + startDt + '&endDt=' + endDt + "&offset=" + offset + "&limit=" + limit;
					//					if(startDt != Type.deposit.startDate
					//							|| endDt != Type.deposit.endDate){
					//						vm.depositMemberList =[];
					//						Type.deposit.offsetMem = 0;
					//					}else{
					//						if(isSearch){
					/*vm.depositMemberList =[];
					Type.deposit.offsetMem = 0;*/
					/*	}
					}*/

					/*Type.deposit.startDate = moment(vm.rangeDepositDate.startDate).format("YYYYMMDD");
					Type.deposit.endDate =  moment(vm.rangeDepositDate.endDate).format("YYYYMMDD");*/

					vm.depositMemberList = [];
					Type.deposit.offsetMem = 0;

					Type.deposit.startDate = startDt;
					Type.deposit.endDate = endDt;
				} else {
					params = 'startDt=' + Type.deposit.startDate + '&endDt=' + Type.deposit.endDate + "&offset=" + offset + "&limit=" + limit;
				}
				if (isTest) {
					console.log(params);

				}

			} else {
				vm.searchDisalbed = false;
				vm.loadDataForm = false;
				swal("", "조회 기간을 설정해주세요 ", "error");
				if (isTest) {
					console.log("기간을 설정해 주삼!!!!!!");

				}
				return;
			}

			var crrncy = vm.transDepost.crrncy;
			if (crrncy != null && crrncy != '' && crrncy.length > 0) {
				crrncy = vm.transDepost.crrncy;
				Type.deposit.crrncy = crrncy;
				params += "&crrncy=" + crrncy;
			} else {
				//화폐 지정 유효성 검사 .
				return;
			}

			var crn;
			if (isSearch) {
				crn = vm.transDepost.crn;
				if (crn != null && crn != '' && crn.length > 0) {
					crn = vm.transDepost.crn;
					Type.deposit.crn = crn;
					params += "&crn=" + crn;
				} else {

				}
			} else {
				if (Type.deposit.crn != null && crn != '' && Type.deposit.crn.length > 0) {
					crn = Type.deposit.crn;
					params += "&crn=" + crn;
				}
			}

			if (isTest) {
				console.log(params);

			}

			AccountService.getDepositMember(params).then(function(response) {

				if (response.status == 'ERROR') {
					vm.searchDisalbed = false;
					vm.loadDataForm = false;
					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
						swal({
							title : $translate.instant('ERROR'),
							text : $translate.instant('errorComments'),
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
						$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();

					} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
						Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
					} else {
						swal({
							title : $translate.instant('ERROR'),
							text : response.data.cdKey + ":" + response.data.cdDesc,
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					}

				} else if (response.status == 'SUCCESS') {

					var result = response.data;
					console.log(result);

					if (result.list == ''
						|| result.list.length <= 0
						|| result.list.length == null
					) {

						swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
						vm.searchDisalbed = false;
						vm.loadDataForm = false;
						return;
					}

					if (vm.depositMemberList == ''
						|| vm.depositMemberList.length < 0
						|| vm.depositMemberList == null) {
						vm.depositMemberList = result.list;
						vm.loadDataForm = false;
						console.log("Member data loaded  ");

						vm.deposit = 'modules/seyfertAccounting/views/depositMember.html' + Utils.getExtraParams();
					} else {
						if (isTest) {
							console.log(result.list);
							console.log(result.list.length);
						}
						var length = result.list.length;

						if (result.list == null ||
							result.list.length <= 0) {
							vm.loadDataForm = false;
							vm.searchDisalbed = false;
							swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
							return;
						} else {

							for (var i = 0; i < length; i++) {
								//								console.log("11")
								vm.depositMemberList.push(result.list[i]);
							}
						}
					}
					vm.loadDataForm = false;
					vm.searchDisalbed = false;
					vm.loadMoreDepostDisalbed = false;
				}
			});
		}

		vm.searchDepositMemberList = searchDepositMemberList;

		/**
		 * @method 예수금 상세조회  
		 * */
		function searchDepositListDetails(reqDataMemGuid, offset) {
			console.log(reqDataMemGuid);

			if (Utils.isNullOrUndifined(reqDataMemGuid)) {
				//				console.log("Go 개인 ");
				searchDepositMemberList(true, 0);
				return;
			} else {
				if ($scope.currentPage == DEPOSIT) {
					$scope.currentPage = DEPOSIT_DETAIL;
					Type.deposit.currentPage = DEPOSIT_DETAIL;
				} else if ($scope.currentPage == DEPOSIT_MEMBER) {
					$scope.currentPage = DEPOSIT_MEMBER_DETAIL;
					Type.deposit.currentPage = DEPOSIT_MEMBER_DETAIL;
				}
			}
			var startDt = '',
				endDt = '';
			var params = '';
			if ((Type.deposit.startDate != null) && (Type.deposit.endDate != null)) {
				startDt = Type.deposit.startDate;
				endDt = Type.deposit.endDate

				vm.rangeDepostDetails = {};
				vm.rangeDepostDetails.startDate = startDt;
				vm.rangeDepostDetails.endDate = endDt;

				params = 'startDt=' + startDt + '&endDt=' + endDt + "&offset=" + offset + "&limit=" + limit;
				//console.log(params);
			} else {
				swal("", "조회 기간을 설정해주세요 ", "error");
				console.log("기간을 설정해 주삼!!!!!!");
				return;
			}

			var crrncy = Type.deposit.crrncy;
			if (crrncy != null && crrncy != '' && crrncy.length > 0) {
				Type.commission.crrncy = crrncy;
				params += "&crrncy=" + crrncy;
			} else {
				return;
			}

			var crn = Type.deposit.crn;
			//console.log(vm.transDepost.crn);

			if (crn != null && crn != '' && crn.length > 0) {
				Type.commission.crn = crn;
				params += "&crn=" + crn;
			}
			Type.deposit.reqDataMemGuid = reqDataMemGuid;
			params += "&reqDataMemGuid=" + reqDataMemGuid;
			if (isTest) {
				console.log(params);
			}

			AccountService.getDepositDetails(params).then(function(response) {
				if (response.status == 'ERROR') {
					vm.searchDisalbed = false;
					vm.loadDataForm = false;
					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
						swal({
							title : $translate.instant('ERROR'),
							text : $translate.instant('errorComments'),
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
						$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();

					} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
						Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
					} else {
						swal({
							title : $translate.instant('ERROR'),
							text : response.data.cdKey + ":" + response.data.cdDesc,
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					}
				} else if (response.status == 'SUCCESS') {
					var result = response.data;
					//console.log(result);

					if (result.list == ''
						|| result.list.length <= 0
						|| result.list.length == null
					) {
						vm.loadDataForm = false;
						vm.searchDisalbed = false;
						vm.deposit = 'modules/seyfertAccounting/views/depositDetail.html' + Utils.getExtraParams();
						swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
						return;
					}

					if (vm.depositDetailList == '' ||
						vm.depositDetailList.length < 0
						|| vm.depositDetailList == null) {
						vm.depositDetailList = result.list;
						vm.loadDataForm = false;
						//						vm.searchDisalbed = false;
						vm.deposit = 'modules/seyfertAccounting/views/depositDetail.html' + Utils.getExtraParams();
					} else {
						if (isTest) {

							console.log(result.list);
							console.log(result.list.length);
							console.log("=====");
						}
						var length = result.list.length;
						if (result.list == null ||
							result.list.length <= 0) {
							vm.loadDataForm = false;
							//							vm.searchDisalbed = false;
							swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
							return;
						} else {
							for (var i = 0; i < length; i++) {
								vm.depositDetailList.push(result.list[i]);
							}
						}
					}
				}
			});
		}
		vm.searchDepositListDetails = searchDepositListDetails;

		/**
		 * @method 잔액조회 
		 * vm.mtAccntBalList = [];
		 * */
		function searchMtAccntBalanceList(isSearch, offset) {
			vm.loadDataForm = true;
			vm.searchDisalbed = true;
			Type.mtaccntbal.currentPage = MT_ACCOUNT_BALANCE;
			vm.mtAccntBalList = [];
			
			AccountService.getMTAccountBalance().then(function(response) {
				if (response.status == 'ERROR') {
					vm.searchDisalbed = false;
					vm.loadDataForm = false;
					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
						swal({
							title : $translate.instant('ERROR'),
							text : $translate.instant('errorComments'),
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
						$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();

					} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
						Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
					} else {
						swal({
							title : $translate.instant('ERROR'),
							text : response.data.cdKey + ":" + response.data.cdDesc,
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					}
				} else if (response.status == 'SUCCESS') {
					var result = response.data;
					if (isTest) console.log(result);

					if (result.list == ''
						|| result.list.length <= 0
						|| result.list.length == null) {

						vm.searchDisalbed = false;
						vm.loadDataForm = false;
						swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
						return;
					}
					if (vm.mtAccntBalList == '' ||
						vm.mtAccntBalList.length < 0
						|| vm.mtAccntBalList == null) {
						if (isTest) console.log("init");
						vm.mtAccntBalList = result.list;
						vm.myAccntOriginList = result.list;
						//test
						/*var test = [
							  {"mthrAccntId":"V5_NH_P2P_DEV","name":"가상계좌","accntNoDisp":"7901******7408","amount":316,"bnkCd":"NONGHYUP_011"},
							  {"mthrAccntId":"V5_IBK_XXX","name":"개발 가상계좌","accntNoDisp":"7901******7408","amount":316,"bnkCd":"NONGHYUP_011"},
							  {"mthrAccntId":"V5_SC_XXX","name":"농협P2P 가상계좌","accntNoDisp":"7901******7408","amount":316,"bnkCd":"NONGHYUP_011"},
							  {"mthrAccntId":"V5_NH_FIN_XXX","name":"개발기 농협P2P 가상계좌","accntNoDisp":"7901******7408","amount":316,"bnkCd":"NONGHYUP_011"},  
							];
						vm.mtAccntBalList = test;	
						vm.myAccntOriginList = test;*/
						//end test
						
						
						/*for(var i = 0 ; i< test.length ; i ++){
							vm.accntTypep[i].name = test[i].name 
						}*/
						/*var length vm.mtAccntBalList.length; 
						for (var i = 0 ; i < length ; i++){
//							result.list[i].name	
						}  */
					} else {

						var length = result.list.length;
						if (result.list == null ||
							result.list.length <= 0) {
							vm.loadDataForm = false;
							vm.searchDisalbed = false;
							swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
							return;
						} else {
							for (var i = 0; i < length; i++) {
								vm.mtAccntBalList.push(result.list[i]);
							}
						}
					}
					vm.loadDataForm = false;
					vm.searchDisalbed = false;
					vm.loadMoreSettmntDisalbed = false;
				}
			});


			
		}
		vm.searchMtAccntBalanceList = searchMtAccntBalanceList;
		

		/**
		 * @method 농협 P2P 거래누락 관련 히스토리 조회 request
		 * */
		
		function checkNHP2PTransHistory(mtAccountId){
			return $q(function(resolve, reject) {
				if(!(mtAccountId.startsWith('V5_NH_P2P_'))){
					resolve("SUCCESS");
				}else{
					Utils.setSimpleNoti("농협 P2P 거래 누락 건 조회 중입니다. 잠시만  기다려주세요 ","1500","alert-warning");
					AccountService.checkNHP2PTransHis().then(function(response) {
						console.log(response);
						//resolve("SUCCESS");
						if (response.status == 'ERROR') {
							console.log("api 호출 에러 ");
							reject("ERROR");
						}else if(response.status == 'SUCCESS'){
							if(response.data.status == 'ERROR'){
								reject("ERROR");
							}else if(response.data.status == 'SUCCESS'){
								Utils.setSimpleNoti("농협 P2P 거래내역 이상 없습니다. ","1500","alert-success");
								resolve("SUCCESS");
							}
						}
						
					});
				}
			});
		}
		
		/**
		 * @method 잔액 상세 조회 가져오는 메서드
		 * */
		
		function getMtAccntBalanceDetails(mtAccountId ,account, type, offset ,dateType , isSearch){
			return $q(function (resolve, reject){
				if(mtAccountId !=''){
					Type.mtaccntbal.mthrAccntId = mtAccountId;
				}
				vm.transType = Type.mtaccntbal.mthrAccntId.startsWith('V5_NH_P2P_') ? vm.transType2 : vm.transType1; 
				vm.dtOptionsAccount = Type.mtaccntbal.mthrAccntId.startsWith('V5_NH_P2P_') ? buttonOps : noButtonOps; 
				vm.loadDataForm = true;

				if(account != ''){
					vm.account  = account;
					Type.mtaccntbal.accountNm = account;
				}
				
				Type.mtaccntbal.currentPage = MT_ACCOUNT_BALANCE_DETAIL;
				$scope.currentPage = MT_ACCOUNT_BALANCE_DETAIL ;
				var startDt = '', endDt = '';
				Type.mtaccntbal.currentSearchType = dateType; 

				if(dateType == 0){
					startDt = Type.mtaccntbal.startDate;
					endDt = Type.mtaccntbal.endDate
				}else if(dateType == 1 ){
					if (vm.isMonthToMonthB == 'range') {
						if ((vm.rangeMtAccntBalDate.startDate != null) && (vm.rangeMtAccntBalDate.endDate != null)) {
							startDt = moment(vm.rangeMtAccntBalDate.startDate).format("YYYYMMDD");
							endDt = moment(vm.rangeMtAccntBalDate.endDate).format("YYYYMMDD");
							if (isTest) console.log(params);
						} else {
							vm.loadDataForm = false;
							vm.searchDisalbed = false;
							return;
						}
					} else if (vm.isMonthToMonthB == 'month') {
						startDt = mtStartMonthDt;
						endDt = mtEndMonthDt;
						
						if (Utils.isNullOrUndifined(startDt)
							|| Utils.isNullOrUndifined(endDt)) {
							swal("", "조회 기간을 설정해주세요 ", "error");
							vm.loadDataForm = false;
							vm.searchDisalbed = false;
							return;
						}
						if (isTest) console.log("startDate : " + startDt + "/ endDate : " + endDt);
					}
					
					
				}
				if(isSearch){
					vm.mtAccntBalDetailList = [];
				}
				
				if(isTest)console.log(startDt);
				if(isTest)console.log(endDt);
				var params = '';
				if(isTest)console.log(params);
				params = 'startDt=' + startDt + '&endDt=' + endDt + "&offset=" + offset + "&limit=" + limit +"&trType="+type +"&mthrAccntId="+Type.mtaccntbal.mthrAccntId;
				
				Type.mtaccntbal.startDate = startDt ; 
				Type.mtaccntbal.endDate = endDt ;
				Type.mtaccntbal.offsetDetails = offset;
				Type.mtaccntbal.type = type;
				
				vm.showDate.startDate = getDateByKorean(startDt); 
				vm.showDate.endDate = getDateByKorean(endDt);
				AccountService.getMTAccountBalanceDetails(params).then(function(response) {
					//console.log(response);
					if (response.status == 'ERROR') {
						vm.loadDataForm = false;
						if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
							swal({
								title : $translate.instant('ERROR'),
								text : $translate.instant('errorComments'),
								type : "error",
								confirmButtonText : $translate.instant('btnOK')
							});
							$state.go('login');
							if (!$rootScope.$$phase) $rootScope.$apply();

						} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
							Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
						} else {
							swal({
								title : $translate.instant('ERROR'),
								text : response.data.cdKey + ":" + response.data.cdDesc,
								type : "error",
								confirmButtonText : $translate.instant('btnOK')
							});
						}

					} else if (response.status == 'SUCCESS') {
						var result = response.data;
						//console.log(result);

						if (result.list == ''
							|| result.list.length <= 0
							|| result.list.length == null
						) {
							vm.loadDataForm = false;

							swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
							//vm.mtAccntBalance = 'modules/seyfertAccounting/views/mtAccountBalanceDetail.html' + Utils.getExtraParams();
							return;
						}

						if (vm.mtAccntBalDetailList == '' ||
							vm.mtAccntBalDetailList.length < 0
							|| vm.mtAccntBalDetailList == null) {
							
							var length = result.list.length;
							for(var i = 0; i < length ; i++){
								if(result.list[i].trType == "1"){
									result.list[i].trType = "예치입금"; 
								}else if(result.list[i].trType == "2"){
									result.list[i].trType = "투자출금";
								}else if(result.list[i].trType == "4"){
									result.list[i].trType = "반환출금";
								}else if(result.list[i].trType == "C"){
									result.list[i].trType = "상환입금";
								}else if(result.list[i].trType == "I"){
									result.list[i].trType = "입금";
								}else if(result.list[i].trType == "O"){
									result.list[i].trType = "출금";
								}
							}
							
							vm.mtAccntBalDetailList = result.list;
							vm.mtAccntBalance = 'modules/seyfertAccounting/views/mtAccountBalanceDetail.html' + Utils.getExtraParams();
						} else {

							if (isTest) {
								console.log(result.list);
								console.log(result.list.length);
							}

							var length = result.list.length;
							if (result.list == null ||
								result.list.length <= 0) {
								vm.loadDataForm = false;

								swal("조회완료!", "더이상의 데이터가 없습니다..", "success");
								return;
							} else {
								for (var i = 0; i < length; i++) {
									if(result.list[i].trType == "1"){
										result.list[i].trType = "예치입금"; 
									}else if(result.list[i].trType == "2"){
										result.list[i].trType = "투자출금";
									}else if(result.list[i].trType == "4"){
										result.list[i].trType = "반환출금";
									}else if(result.list[i].trType == "C"){
										result.list[i].trType = "상환입금";
									}else if(result.list[i].trType == "I"){
										result.list[i].trType = "입금";
									}else if(result.list[i].trType == "O"){
										result.list[i].trType = "출금";
									}
									vm.mtAccntBalDetailList.push(result.list[i]);
								}
							}
						}
						vm.loadDataForm = false;
					}
				});

				
			});
		}
		
		/**
		 * @method 잔액 상세조회 
		 * 			vm.mtAccntBalDetailList = [];
		 * */
		function searchMtAccntBalanceDetails(mtAccountId ,account, type, offset ,dateType , isSearch) {
			
			if(isTest)  console.log(mtAccountId);
			if(isTest)	console.log(type);
			
			//TODO 농협 p2p 일시 누락 거래내역 조회  
			var promise = checkNHP2PTransHistory(mtAccountId);
			promise.then(function(value) {
				//resolve
				getMtAccntBalanceDetails(mtAccountId ,account, type, offset ,dateType , isSearch);
			}, function(reason) {
				//reject 
				if (reason == 'ERROR') {
					swal("", "거래 내역의 누락 건이 발견 되었습니다. \n 기술실로  문의 부탁드립니다. ", "error");
				} 
				getMtAccntBalanceDetails(mtAccountId ,account, type, offset ,dateType , isSearch);
				
			});
		}
		
		vm.searchMtAccntBalanceDetails = searchMtAccntBalanceDetails;

		
		vm.checkP2P = function(mthrAccntId){
			var isP2P = mthrAccntId.startsWith('V5_NH_P2P_') ? true : false;
			return isP2P;
		}
		
		function transferFromP2PToSC(){
			vm.isTrasfering = true;
			vm.loadDataForm = true;
			SweetAlert.swal({
				   title: '',
				   text: '농협P2P 에서 SC로 10억 이체를 진행하려고 합니다. \n 김민홍 차장님의 승인을 받으셨습니까? ',
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",
				   confirmButtonText: $translate.instant('VCNotiYes'),
				   cancelButtonText: $translate.instant('VCNotiNo'),
				   closeOnConfirm: true,
				   closeOnCancel: false }, 
				   function(isConfirm){ 
				   if (isConfirm) {
					 AccountService.setTransferFromNP2PToSC().then(function(response) {
							if (response.status == 'ERROR') {
								vm.loadDataForm = false;
								if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
									swal({
										title : $translate.instant('ERROR'),
										text : $translate.instant('errorComments'),
										type : "error",
										confirmButtonText : $translate.instant('btnOK')
									});
									$state.go('login');
									if (!$rootScope.$$phase) $rootScope.$apply();

								} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
									Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
								} else {
									swal({
										title : $translate.instant('ERROR'),
										text : response.data.cdKey + ":" + response.data.cdDesc,
										type : "error",
										confirmButtonText : $translate.instant('btnOK')
									});
								}
							} else if (response.status == 'SUCCESS') {
								//swal("", "이체가 정상적으로 진행 되었습니다. ", "success");
								vm.loadDataForm = false ;
								var msg = "[농협 P2P] 에서 [SC](으)로 10억 이체가 완료 되었습니다.최신정보가 반영되려면 1 ~ 2분 정도가 소요됩니다. "; 
								Utils.setSimpleNoti(msg,'6000','alert-warning');
								$timeout(enableButton ,600);
								
							}
						});
					 
				   } else {
					  vm.loadDataForm = false ;
				      swal("", "이체 취소 ", "error");
				      $timeout(enableButton ,600)
				   }
				});
		}
		
		function enableButton(){
			vm.isTrasfering = false ;
			if (!$rootScope.$$phase) $rootScope.$apply();
		}
		
		vm.transfer = transferFromP2PToSC;
		vm.sortableOptions = {
			connectWith : ".connectList"
		};

		//TODO 변수명 바꾸기 
		function loadList() {
			if ($scope.currentPage == 'commission') {
				Type.commission.offset += 10;
				vm.searchExchangeCommission(false, Type.commission.offset);
			} else if ($scope.currentPage == 'settlement') {
				Type.settlement.offset += 10 ;
				vm.searchSettlementList(false, Type.settlement.offset);
			} else if ($scope.currentPage == 'deposit') {
				Type.deposit.offset += 10 ;
				vm.searchDepositList(false, Type.deposit.offset);
			} else if ($scope.currentPage == DEPOSIT_MEMBER) {
				Type.deposit.offsetMem += 10 ;
				searchDepositMemberList(false, Type.deposit.offsetMem);
			}
		}
		vm.loadList = loadList;

		//TODO 변수명 바꾸기 
		function loadDetailMore() {
			//console.log($scope.currentPage);
			if ($scope.currentPage == 'commission') {
				Type.commission.offsetDetails += 10;
				searchExchangeCommissionDetails(Type.commission.reqDataMemGuid, Type.commission.offsetDetails);
			} else if ($scope.currentPage == 'settlement') {
				Type.settlement.offsetDetails += 10;
				searchSettlementListDetails(Type.settlement.reqDataMemGuid, tmpRateType, Type.settlement.offsetDetails);
			} else if ($scope.currentPage == DEPOSIT_DETAIL
				|| $scope.currentPage == DEPOSIT_MEMBER_DETAIL) {
				Type.deposit.offsetDetails += 10;
				searchDepositListDetails(Type.deposit.reqDataMemGuid, Type.deposit.offsetDetails);
			}else if($scope.currentPage == MT_ACCOUNT_BALANCE_DETAIL){
				Type.mtaccntbal.offsetDetails +=10;
//				function searchMtAccntBalanceDetails(account, type, offset ,dateType , isSearch)
				//searchMtAccntBalanceDetails(Type.mtaccntbal.mthrAccntId,Type.mtaccntbal.accountNm, Type.mtaccntbal.type ,Type.mtaccntbal.offsetDetails , Type.mtaccntbal.currentSearchType ,false);
				getMtAccntBalanceDetails(Type.mtaccntbal.mthrAccntId,Type.mtaccntbal.accountNm, Type.mtaccntbal.type ,Type.mtaccntbal.offsetDetails , Type.mtaccntbal.currentSearchType ,false);
			}
		}
		vm.loadDetailMore = loadDetailMore;

		vm.tabSelected = function(index) {
			if (index == 'index.seyfertAccounting.commission') {
				$scope.currentPage = index;
				//TODO 여기다가 파라미터 적성 .
				if(!(Utils.isNullOrUndifined($scope.params.crn)) && $scope.params.crn != ''){
					vm.transCmmssn.crn = $scope.params.crn;
				}
				vm.commission = 'modules/seyfertAccounting/views/commission.html' + Utils.getExtraParams();
				/*if(!(Utils.isNullOrUndifined($scope.params.startDate)) && $scope.params.startDate != ''){
					vm.rangeCommisnDate.startDate = $scope.params.startDate;
				}
				if(!(Utils.isNullOrUndifined($scope.params.endDate)) && $scope.params.endDate != ''){
					vm.rangeCommisnDate.endDate = $scope.params.endDate;
				}*/
				
			} else if (index == 'index.seyfertAccounting.settlement') {
				$scope.currentPage = index;
				vm.settlement = 'modules/seyfertAccounting/views/settlement.html' + Utils.getExtraParams();				
				if(!(Utils.isNullOrUndifined($scope.params.crn)) && $scope.params.crn != ''){
					vm.transSttmnt.crn = $scope.params.crn;
				}
				/*if(!(Utils.isNullOrUndifined($scope.params.startDate)) && $scope.params.startDate != ''){
					vm.rangeSettleMnntDate.startDate = $scope.params.startDate;
				}
				if(!(Utils.isNullOrUndifined($scope.params.endDate)) && $scope.params.endDate != ''){
					vm.rangeSettleMnntDate.endDate = $scope.params.endDate;
				}*/

			} else if (index == 'index.seyfertAccounting.deposit') {
				$scope.currentPage = index;
				vm.deposit = 'modules/seyfertAccounting/views/deposit.html' + Utils.getExtraParams();
				if(!(Utils.isNullOrUndifined($scope.params.crn)) && $scope.params.crn != ''){
					vm.transDepost.crn = $scope.params.crn;
				}
				/*if(!(Utils.isNullOrUndifined($scope.params.startDate)) && $scope.params.startDate != ''){
					vm.rangeDepositDate.startDate = $scope.params.startDate;
				}
				if(!(Utils.isNullOrUndifined($scope.params.endDate)) && $scope.params.endDate != ''){
					vm.rangeDepositDate.endDate = $scope.params.endDate;
				}
				if(!(Utils.isNullOrUndifined($scope.params.crrncy)) && $scope.params.crrncy != ''){
					vm.transDepost.crrncy = $scope.params.endDate;
				}*/
				

			} else if (index == 'index.seyfertAccounting.mtAccountBalance') {
				
				$scope.currentPage = index;
				vm.mtAccntBalance = 'modules/seyfertAccounting/views/mtAccountBalance.html' + Utils.getExtraParams();
				var msg = "농협P2P를 제외한 계좌는 거래내역을 상세하게 표시할 수 없습니다." +
						  " (잔액은 정확하지만, 멤버의 입금/출금내역만 표시됩니다.) " +
						  " 최신정보가 반영 되려면 1~2분 정도 시간이 소요될 수 있습니다.";
				//vm.comments = $translate.instant('lblTransComments');
				vm.comments = msg;
				$scope.$emit('vm.viewByTime',"");
				Utils.setSimpleNoti(msg,'3000','alert-warning');
				searchMtAccntBalanceList(true,0);
				
				
			}
		}

		var animationsEnabled = true;

		function goBack() {
			if ($scope.currentPage == 'commission') {
				vm.commissionDetailList = [];
				Type.commission.offsetDetails = 0;
				Type.commission.currentPage = 'commission'

				vm.commission = 'modules/seyfertAccounting/views/commission.html' + Utils.getExtraParams();
			} else if ($scope.currentPage == 'settlement') {
				vm.settlementDetailList = [];
				Type.settlement.offsetDetails = 0;
				Type.settlement.currentPage = 'settlement'

				vm.settlement = 'modules/seyfertAccounting/views/settlement.html' + Utils.getExtraParams();
			} else if ($scope.currentPage == 'deposit') {
				vm.depositDetailList = [];
				Type.deposit.offsetDetails = 0;
				Type.deposit.currentPage = 'deposit'

				vm.deposit = 'modules/seyfertAccounting/views/deposit.html' + Utils.getExtraParams();

			} else if ($scope.currentPage == DEPOSIT_MEMBER) {
				$scope.currentPage = DEPOSIT;
				vm.depositMemberList = [];
				Type.deposit.offsetMem = 0 ;

				Type.deposit.currentPage = DEPOSIT;
				vm.deposit = 'modules/seyfertAccounting/views/deposit.html' + Utils.getExtraParams();
			} else if ($scope.currentPage == DEPOSIT_MEMBER_DETAIL) {
				$scope.currentPage = DEPOSIT_MEMBER;
				vm.depositDetailList = [];
				Type.deposit.offsetDetails = 0;

				Type.deposit.currentPage = DEPOSIT_MEMBER;

				vm.deposit = 'modules/seyfertAccounting/views/depositMember.html' + Utils.getExtraParams();
			} else if ($scope.currentPage == DEPOSIT_DETAIL) {
				$scope.currentPage = DEPOSIT;
				vm.depositDetailList = [];
				Type.deposit.offsetDetails = 0 ;
				Type.deposit.currentPage = DEPOSIT;

				vm.deposit = 'modules/seyfertAccounting/views/deposit.html' + Utils.getExtraParams();
			} else if ($scope.currentPage == MT_ACCOUNT_BALANCE_DETAIL) {
//				console.log("잔액상세 ==>> 잔액조회");
				vm.mtAccntBalDetailList = [];
				Type.mtaccntbal.offsetDetails = 0 ;
				Type.mtaccntbal.currentPage = MT_ACCOUNT_BALANCE;
				
//				Type.mtaccntbal.type = vm.transMtAccntBalance.type;
				Type.mtaccntbal.type = vm.transMtAccntBalance.type = '0';
				
				vm.mtAccntBalance = 'modules/seyfertAccounting/views/mtAccountBalance.html' + Utils.getExtraParams();
			}
		}

		vm.goBack = goBack;

		var sizeModal = 'lg'; // isn't there another option? 
		function adjAmtDetail(transactionDetail, type, index) {
			if (vm.isUnEditable) {
				swal("", " 월별 기간 지정을  해주세요 . ", "error");
				return;
			} else {

			}

			var param = {
				type : '',
				guid : '',
				amount : '',
				desc : '',
			}
			param.type = 'Fee';
			param.guid = transactionDetail;

			AccountService.setData(vm.settlementList[index]);
			var modalInstance = $uibModal
				.open({
					animation : animationsEnabled,
					templateUrl : 'modules/seyfertAccounting/views/settlementPopUp.html' + Utils.getExtraParams(),
					controller : 'SeyfertAccountDetailController',
					backdrop : 'static',
					//				windowClass :'app-modal-window',
					keyboard : false,
					resolve : {
						param : function() {
							$log.debug('trans detail: ' + JSON.stringify(param));
							return param;
						}
					}
				});

			modalInstance.result.then(function(selectedItem) {
				$log.debug('result.then: ' + selectedItem);
				$scope.selected = selectedItem;
			}, function() {
				$log.debug('Modal dismissed at: ' + new Date());
			// TODO 팝업창이 닫히면 최신 거래 조건으로 목록 리프레쉬
			//			$scope.refreshTransactionList();
			});

		}

		vm.adjAmtDetail = adjAmtDetail;

		function editLastChargingFee(transactionDetail, index, amount) {
			if (vm.isUnEditable) {
				swal("", " 월 단위 선택을 해주세요 . ", "error");
				return;
			} else {

			}

			var param = {
				type : '',
				guid : '',
				amount : '',
				desc : '',
			}

			param.type = 'FeeAmt';
			param.amount = amount;
			param.guid = transactionDetail;


			if (!(Utils.isNullOrUndifined(vm.settlementList[index].cfDesc))) {
				param.desc = vm.settlementList[index].cfDesc;
			} else {
				param.desc = '' ;
			}

			var modalInstance = $uibModal
				.open({
					animation : animationsEnabled,
					templateUrl : 'modules/seyfertAccounting/views/sttmntInputFeePopUp.html' + Utils.getExtraParams(),
					controller : 'SeyfertAccountDetailController',
					backdrop : 'static',
					//				windowClass :'app-modal-window',
					keyboard : false,
					resolve : {
						param : function() {
							$log.debug('trans amount: ' + JSON.stringify(param));
							return param;
						}
					}
				});
			modalInstance.result.then(function(obj) {
				$log.debug(obj);

				//console.log(index);

				vm.settlementList[index].chargingFee = obj.chargingFee;
				vm.settlementList[index].cfDesc = obj.cfDesc;

				console.log(vm.settlementList);

			}, function() {
				$log.debug('Modal dismissed  at: ' + new Date());
			});

		}
		vm.editLastChargingFee = editLastChargingFee;

		function editLastChargingAllAmt(transactionDetail, index, amount) {
			if (vm.isUnEditable) {
				swal("", " 월 단위 선택을 해주세요 . ", "error");
				return;
			} else {

			}
			var param = {
				type : '',
				guid : '',
				amount : '',
				desc : '',
			}
			param.type = 'AllAmt';
			param.amount = amount;
			param.guid = transactionDetail;

			if (!(Utils.isNullOrUndifined(vm.settlementList[index].fraDesc))) {
				param.desc = vm.settlementList[index].fraDesc;
			} else {
				param.desc = '' ;
			}


			var modalInstance = $uibModal
				.open({
					animation : animationsEnabled,
					templateUrl : 'modules/seyfertAccounting/views/sttmntInputAmtPopUp.html' + Utils.getExtraParams(),
					controller : 'SeyfertAccountDetailController',
					backdrop : 'static',
					//				windowClass :'app-modal-window',
					keyboard : false,
					resolve : {
						param : function() {
							$log.debug('trans amount: ' + JSON.stringify(param));

							return param;
						}
					}
				});

			modalInstance.result.then(function(obj) {
				$log.debug(obj);

				console.log(index);

				vm.settlementList[index].finalRateAmount = obj.finalRateAmount;
				vm.settlementList[index].fraDesc = obj.fraDesc;

				//console.log(vm.settlementList);

			}, function() {
				$log.debug('Modal dismissed  at: ' + new Date());
			});

		}
		vm.editLastChargingAllAmt = editLastChargingAllAmt;

		function lastConfirmRequest(index, guid, rateType) {
			console.log("최종 청구 확인 :" + guid);

			var tmpList = vm.settlementList[index];
		/*	console.log(tmpList.chargingFee);
			console.log(tmpList.cfDesc);
			console.log(tmpList.finalRateAmount);
			console.log(tmpList.fraDesc);
*/
			// TODO undefine 이면 return ??? 최종청구 요청하는 걸 고민하기 ... 

			var params = "reqDataMemGuid=" + guid +
			"&feeType=" + rateType +
			"&date= " + Type.settlement.startDate +
			"&finalRateAmount=" + tmpList.finalRateAmount +
			"&fraDesc=" + encodeURIComponent(tmpList.fraDesc) +
			"&chargingFee=" + tmpList.chargingFee +
			"&cfDesc=" + encodeURIComponent(tmpList.cfDesc);


			//console.log(params);
			AccountService.setSettlementChargingFee(params).then(function(response) {

				if (response.status == 'ERROR') {
			
					if (response.data.cdKey == 'SESSION_EXPIRED' || response.data.cdKey == 'API_REQ_CAN_NOT_BE_DECRYPTED') {
						swal({
							title : $translate.instant('ERROR'),
							text : $translate.instant('errorComments'),
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});

						$state.go('login');
						if (!$rootScope.$$phase) $rootScope.$apply();

					} else if (response.data.cdKey == 'UNKNOWN_ERROR') {
						Utils.getErrorHanler(response.data.cdKey, response.data.cdDesc);
					} else {
						swal({
							title : $translate.instant('ERROR'),
							text : response.data.cdKey + ":" + response.data.cdDesc,
							type : "error",
							confirmButtonText : $translate.instant('btnOK')
						});
					}

				} else if (response.status == 'SUCCESS') {
//					console.log(response);

					vm.loadDataForm = false;
					vm.searchDisalbed = false;
					vm.loadMoreDepostDisalbed = false;
					//classifyResultCD(result);
					swal("요청완료!", "최종 청구 요청이 완료 되었습니다.", "success");
				}
			});

		}
		vm.lastConfirmRequest = lastConfirmRequest;

		var isClicked = false ;
		function errorService() {
			//			console.log("111");
			Utils.getErrorHanler('UNKNOWN_ERROR', 'Test description ');
		}
	//		errorService();
		
		
		vm.viewByTime = 'month';
		vm.testComment ='';
		
		/*vm.selectAccount = function(){
			console.log(vm.transMtAccntBalance.list);
//			 = 에다가 선택한 아이를 넣도록 ;
//			myAccntOriginList
			var length = vm.myAccntOriginList.length; 
			for(var i =0; i < length ; i++){
				if(vm.transMtAccntBalance.list == vm.myAccntOriginList[i].name){
					//console.log(vm.myAccntOriginList[i]);
//					vm.mtAccntBalList =  vm.myAccntOriginList[i];
				}
			}
		}*/
		vm.myAccntOriginList =[];
		$scope.$watch('vm.transMtAccntBalance.list', function(newVal, oldVal) {
			$log.debug('newVal list: ' + newVal);
			$log.debug('oldVal list: ' + oldVal);
			
			if ($state.current.name == 'index.seyfertAccounting.mtAccountBalance') {
				console.log(vm.transMtAccntBalance.list);
				if(Utils.isNullOrUndifined(newVal)){
					vm.mtAccntBalList = [];
					vm.mtAccntBalList = vm.myAccntOriginList;
				}else{
					var length = vm.myAccntOriginList.length;
					if(newVal == 'ALL'){
						vm.mtAccntBalList = [];
						vm.mtAccntBalList = vm.myAccntOriginList;
					}else{
						for(var i =0; i < length ; i++){
							if(vm.transMtAccntBalance.list == vm.myAccntOriginList[i].name){
								vm.mtAccntBalList = [];
								vm.mtAccntBalList.push(vm.myAccntOriginList[i]);
							}
						}	
					}
					if (!$rootScope.$$phase) $rootScope.$apply();
				}
			}
		});
		
		
		vm.selectDetailType = function(){
			Type.mtaccntbal.type = vm.transMtAccntBalance.type; 
			//searchMtAccntBalanceDetails(Type.mtaccntbal.mthrAccntId ,Type.mtaccntbal.accountNm ,Type.mtaccntbal.type , 0 , Type.mtaccntbal.currentSearchType ,true);
			getMtAccntBalanceDetails(Type.mtaccntbal.mthrAccntId ,Type.mtaccntbal.accountNm ,Type.mtaccntbal.type , 0 , Type.mtaccntbal.currentSearchType ,true);
		}

		
		$scope.$watch('vm.viewByTime', function(newVal, oldVal) {
			$log.debug('newVal: ' + newVal);
			$log.debug('oldVal: ' + oldVal);
			
			vm.testComment = newVal;
			if ($state.current.name.indexOf('index.seyfertAccounting') != -1) {
				//localStorageService.set('viewByTime', newVal);
				
				vm.isMonthToMonthB = 'range';
				var now = new Date();
				getParamViewByTime(newVal);
				//
				var startDt = Type.mtaccntbal.startDate;
				var endDt = Type.mtaccntbal.endDate;
				
				console.log(startDt);
				console.log(endDt);
				
				var startYear = startDt.substr(0,4);
				var startMonth = startDt.substr(4,2);
				var startDay = startDt.substr(6,2);
//				vm.rangeMtAccntBalDate.startDate =new Date(y,m-1,d);
				vm.rangeMtAccntBalDate.startDate =new Date(startYear,startMonth-1,startDay);
				
				var endYear = endDt.substr(0,4);
				var endMonth = endDt.substr(4,2);
				var endDay = endDt.substr(6,2);
				
//				vm.rangeMtAccntBalDate.endDate =new Date(y,m-1,d);
				vm.rangeMtAccntBalDate.endDate =new Date(endYear,endMonth-1,endDay);
				
				
				if(newVal == oldVal){
					//searchMtAccntBalanceDetails(Type.mtaccntbal.reqDataMemGuid ,0 , 0 , isClicked);
				}else{
					Type.mtaccntbal.type = Type.mtaccntbal.type != null || Type.mtaccntbal.type != '' ? Type.mtaccntbal.type : 0 ;
					/*console.log(Type.mtaccntbal.type);*/
					vm.transMtAccntBalance.type = Type.mtaccntbal.type; 
					//searchMtAccntBalanceDetails(Type.mtaccntbal.mthrAccntId ,Type.mtaccntbal.accountNm ,vm.transMtAccntBalance.type , 0 , 0 , true );
					getMtAccntBalanceDetails(Type.mtaccntbal.mthrAccntId ,Type.mtaccntbal.accountNm ,vm.transMtAccntBalance.type , 0 , 0 , true );
				}
			}
		});
		function getParamViewByTime(dateType) {
			var newVal = dateType;
			
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			
			//console.log("today");
			
			month = month < 10 ? "0"+month : month;
			day =  day < 10 ? "0"+day : day;
			
			//console.log(year + " / " + month + " / " + day);
			Type.mtaccntbal.endDate = ""+year+month+day;
			
			if (newVal == 'month') {
				// 오늘 기준 한달 
				//console.log("one month");

				var tmp = date.getMonth() - 1;
				var lastMonth ;
				if(tmp < 0){
					year = year - 1 ;
					var fistDateofMonth = new Date(date.getFullYear(),date.getMonth(), 1);
					lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
					month = (lastMonth2.getMonth()) + 1;
				}else{
					month = month -1 ;
				}
				
				if(day == 31 ){
					if(month == 2){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}else if(month == 4 ||month == 6 ||month == 9 ||month == 11){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}
				}
				
				if(day == 30|| day == 29){
					if(month == 2){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}
				}
				
				month = month < 10 ? "0"+month : month;
//				day =  day < 10 ? "0"+day : day;
				Type.mtaccntbal.startDate = ""+year+month+day;
				//console.log(year + " / " + month + " / " + day);
				
			} else if (newVal == 'quarter') {
				//오늘 기준 3달  
				var tmp  = date.getMonth() - 3;
				var lastMonth2 ;
				if(tmp < 0){
					year = year - 1 ;
					if(month == 1){
						var fistDateofMonth = new Date(date.getFullYear(),date.getMonth(), 1);
						lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
						month = (lastMonth2.getMonth()-2) + 1;
					}else if(month == 2){
						var fistDateofMonth = new Date(date.getFullYear(),(date.getMonth()-1), 1);
						lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
						month = (lastMonth2.getMonth()-1) + 1;
					}else if(month == 3){
						var fistDateofMonth = new Date(date.getFullYear(),(date.getMonth()-2), 1);
						lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
						month = (lastMonth2.getMonth()) + 1;
					}
					
				}else {
					month = month - 3; 
				}
				//console.log(day);
				if(day == 31 ){
					if(month == 2){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}else if(month == 4 ||month == 6 ||month == 9 ||month == 11 ){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}
				}
				
				if(day == 30|| day == 29){
					if(month == 2){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}
				}
				month = month < 10 ? "0"+month : month;
				Type.mtaccntbal.startDate = ""+year+month+day;
				//console.log(year + " / " + month + " / " + day);

			} else if (newVal == 'half') {
				// 오늘 기준 6개월 
				var tmp  = date.getMonth() - 6;
				if(tmp < 0){
					year = year - 1 ;
					if(month == 1){
						var fistDateofMonth = new Date(date.getFullYear(),date.getMonth(), 1);
						lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
						month = (lastMonth2.getMonth()-5) + 1;
					}else if(month == 2){
						var fistDateofMonth = new Date(date.getFullYear(),(date.getMonth()-1), 1);
						lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
						month = (lastMonth2.getMonth()-4) + 1;
					}else if(month == 3){
						var fistDateofMonth = new Date(date.getFullYear(),(date.getMonth()-2), 1);
						lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
						month = (lastMonth2.getMonth()-3) + 1;
					}else if(month == 4){
						var fistDateofMonth = new Date(date.getFullYear(),(date.getMonth()-3), 1);
						lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
						month = (lastMonth2.getMonth()-2) + 1;
					}else if(month == 5){
						var fistDateofMonth = new Date(date.getFullYear(),(date.getMonth()-4), 1);
						lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
						month = (lastMonth2.getMonth()-1) + 1;
					}else if(month == 6){
						var fistDateofMonth = new Date(date.getFullYear(),(date.getMonth()-5), 1);
						lastMonth2 = new Date(fistDateofMonth.setDate(fistDateofMonth.getDate()-1));
						month = (lastMonth2.getMonth()) + 1;
					}
				}else {
					month = month - 6; 
					
				}
				
				if(day == 31 ){
					if(month == 2){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}else if(month == 4 ||month == 6 ||month == 9 ||month == 11 ){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}
				}
				
				if(day == 30|| day == 29){
					if(month == 2){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}
				}
				
				month = month < 10 ? "0"+month : month;
				Type.mtaccntbal.startDate = ""+year+month+day;
				//console.log(year + " / " + month + " / " + day);
				
			} else if (newVal == 'year') {
				
				if(day == 28 || day == 29){
					if(month == 2){
						var lastDay = (new Date(year, month, 0)).getDate();
						day = lastDay;
					}
				}
				year = year - 1 ;
				Type.mtaccntbal.startDate = ""+year+month+day;
			}
			
//			return paramStr + "&" +$httpParamSerializer(vm.trans);
		}
	
		function getDateByKorean(str){
			var resultStr = str;
			var year  = str.substring(0, 4);
			var month = str.substring(4, 6);
			var day = str.substring(6, 8);;
			
			resultStr = year +" 년 "+ month +" 월 "+ day+" 일 ";
			return resultStr;
		}
	
	}

	
	
	//$state 를 통한 설정 .. .
	SeyfertAccountDetailController.$inject = [
		'$scope', "$log", '$httpParamSerializer', '$location', '$state', "$uibModal",
		'AccountService', '$uibModalInstance', 'Utils', 'param' ];
	function SeyfertAccountDetailController($scope, $log, $httpParamSerializer, $location, $state, $uibModal,
		AccountService, $uibModalInstance, Utils, param) {
		var vm = this;

		$scope.allFeeAmt = {
			finalRateAmount : '',
			fraDesc : ''
		};
		$scope.allFee = {
			chargingFee : '',
			cfDesc : ''
		};

		if (!(Utils.isNullOrUndifined(param))) {
			if (param.type == 'AllAmt') {
				$scope.guid = param.guid;
				$scope.allFeeAmt.finalRateAmount = param.amount;
				$scope.allFeeAmt.fraDesc = param.desc;
			} else if (param.type == 'FeeAmt') {
				$scope.guid = param.guid;
				$scope.allFee.chargingFee = param.amount;
				$scope.allFee.cfDesc = param.desc;
			} else if (param.type == 'Fee') {
				$scope.guid = param.guid;
				if (!(Utils.isNullOrUndifined(AccountService.getData()))) {
					var data = AccountService.getData();
					$scope.feeDataList = data.feeDetail;
				}
			}
		}
		$scope.ok = function() {
			$log.debug("OK click");
			var test = $httpParamSerializer($scope.allFeeAmt);

			var obj = {};
			obj.finalRateAmount = $scope.allFeeAmt.finalRateAmount;
			obj.fraDesc = $scope.allFeeAmt.fraDesc;

			$uibModalInstance.close(obj);
		};

		$scope.okFee = function() {
			$log.debug("OK click");
			var test = $httpParamSerializer($scope.allFee);

			var obj = {};
			obj.chargingFee = $scope.allFee.chargingFee;
			obj.cfDesc = $scope.allFee.cfDesc;

			$uibModalInstance.close(obj);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	}
})();