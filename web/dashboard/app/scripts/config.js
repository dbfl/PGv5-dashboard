/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */

//set the global variable

config.$inject = ['$stateProvider', '$urlRouterProvider','$ocLazyLoadProvider','localStorageServiceProvider', '$logProvider' ,'extraParams' ,'IdleProvider' ];
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, localStorageServiceProvider, $logProvider ,extraParams ,IdleProvider ) {
	$urlRouterProvider.otherwise("/index/dashboard");
	console.log("config::config:");

	/*IdleProvider.idle(1);
	  IdleProvider.timeout(60*60);*/
	/*
	 *  configuration block - only providers and constants can be injected into configuration block .
	 *  if you want to change parameters of template . you should change config.js and utils.js (getExtraParams)
	 *  
	 *  config 는 다시 불러오려면 refresh 를 해줘야한다.
	 *  하지만 StateProvider 를 통해서 refresh를 하지않고 template cache 작업을 하려면  여기는 하드코딩으로 수정해주는 수밖에 없다.
	 *   
	 * */
	
	$logProvider.debugEnabled(true);
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    localStorageServiceProvider.setPrefix('paygateAdmin');
    
    $stateProvider

        .state('index', {
        	cache : false,
            abstract: true,
            url: "/index",
            params:{cache : null}, 
            templateUrl: "views/common/content.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        })
        .state('index.monitoring', {
        	cache : false,
            url: "/monitoring",
			controller: 'DashboardController',
            controllerAs: 'vm',
            templateUrl: "modules/dashboard/views/monitoring.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Monitoring' }
        })
        .state('index.dashboard', {
        	cache : false,
            url: "/dashboard",
            controller: 'DashboardController',
            controllerAs: 'vm',
            templateUrl: "modules/dashboard/views/dashboard.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Dashboard Admin' },
            resolve: {
	            loadPlugin: function ($ocLazyLoad) {
	                return $ocLazyLoad.load([
	                    {
	                        files: ['scripts/e2e.js',]
	                    }
	                ]);
	            }
	        }
        })
        .state('index.transaction', {
        	cache : false,
            url: "/transaction?tid&srcGuid&dstGuid",
            controller: 'TransactionController',
            controllerAs: 'vm',
            templateUrl: "modules/transaction/views/transaction.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Transaction' }
        })
        
        
        .state('index.member', {
//        	abastract : true,
        	cache : false,
            url: "/member",
            controller: 'MemberController',
            controllerAs: 'vm',
            templateUrl: "modules/member/views/member.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh") ,
            data: { pageTitle: 'Member' }
        })
        .state('index.member.statistics', {
        	url:'/statistics?guid&name&phone&email&vaccount&account',
        	view:{ 
        		'statistics' : {
        			templateUrl : "modules/member/views/statistics.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'MemberController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.member.createMember', {
        	url:'/createMember',
        	view:{
        		'createMember' : {
        			templateUrl : "modules/member/views/createMember.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'MemberController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.member.assignLogin', {
        	url:'/assignLogin?guid&name&loginId',
        	view:{ 
        		'assignLogin' : {
        			templateUrl : "modules/member/views/assignLogin.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'MemberController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.member.assignBank', {
        	url:'/assignBank?guid&bankNm&account$country',
        	view:{ 
        		'assignBank' : {
        			templateUrl : "modules/member/views/assignBank.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'MemberController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.member.resetPassword', {
        	url:'/resetPassword?id',
        	view:{ 
        		'resetPassword' : {
        			templateUrl : "modules/member/views/resetPassword.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'MemberController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.member.withdrawalBlockManagement', {
        	url:'/withdrawalBlockManagement?id',
        	view:{ 
        		'withdrawalBlockManagement' : {
        			templateUrl : "modules/member/views/withdrawalBlockManagement.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'MemberController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.currencyExchange', {
        	cache : false,
            url: "/currencyExchange",
            controller: 'ToolsController',
            controllerAs: 'vm',
            templateUrl: "modules/tools/views/currencyExchange.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Currency Exchange' }
        })
        .state('index.chargeAccount', {
        	cache : false,
            url: "/chargeAccount",
            controller: 'ChargeAccController',
            controllerAs: 'vm',
            templateUrl: "modules/tools/views/chargeAccount.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Charge Account' }
        })
        .state('index.seyfertWithdraw', {
        	cache : false,
            url: "/seyfertWithdraw",
			controller: 'SeyfertWithdrawController',
            controllerAs: 'vm',
            templateUrl: "modules/seyfertWithdraw/views/seyfertWithdraw.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Seyfert Withdraw' }
        })
        .state('index.crossBorderRemit', {
        	cache : false,
            url: "/crossBorderRemit",
			controller: 'RemitController',
            templateUrl: "modules/crossBorderRemit/views/remit.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Cross Border Remit' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['styles/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
		.state('index.crossBorderRemit.step_one', {
			cache : false,
            url: "/step_one",
            templateUrl: "modules/crossBorderRemit/views/step_one.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Cross Border Remit' }
        })
		.state('index.crossBorderRemit.step_two', {
			cache : false,
            url: "/step_two",
            templateUrl: "modules/crossBorderRemit/views/step_two.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Cross Border Remit' }
        })
		
        .state('index.smsService', {
        	cache : false,
            url: "/smsService?to&title&msg",
            controller: 'SMSController',
            controllerAs: 'vm',
            templateUrl: "modules/tools/views/smsService.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'SMS Service' }
        })
        .state('index.settings', {
        	abastract : true,
        	cache : false,
            url: "/settings",
            controller: 'SettingController',
            controllerAs: 'vm',
            templateUrl: "modules/settings/views/setting.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Settings' }
        })
        
        .state('index.settings.general', {
        	url:'/general?param1&param2',
        	view:{
        		'general' : {
        			templateUrl : "modules/settings/views/general.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SettingController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.settings.account', {
        	url:'/account',
        	view:{ 
        		'account' : {
        			templateUrl : "modules/settings/views/account.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SettingController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.settings.roles', {
        	url:'/roles',
        	view:{ 
        		'roles' : {
        			templateUrl : "modules/settings/views/roles.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SettingController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.settings.api', {
        	url:'/api',
        	view:{ 
        		'api' : {
        			templateUrl : "modules/settings/views/api.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SettingController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.settings.contract', {
        	url:'/contract?guid',
        	view:{ 
        		'contract' : {
        			templateUrl : "modules/settings/views/contract.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SettingController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.settings.noti', {
        	url:'/noti?guid&testUrl',
        	/*view:{ 
        		'noti' : {
        			templateUrl : "modules/settings/views/noti.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},*/
        	controller: 'SettingController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.settings.options', {
        	url:'/options', // param은 필요한 페이제만 추가하기 
        	view:{
        		'options' : {
        			templateUrl : "modules/settings/views/options.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SettingController',
        	sticky :true,
        	deepStateRedirect : true
        })

        
        .state('index.lecture', {
        	cache : false,
            url: "/lecture",
            controller: 'LectureController',
            controllerAs: 'vm',
            templateUrl: "modules/lecture/views/lecture.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Lecture' }
            
        })
        .state('login', {
        	cache : false,
        	url: "/login",
        	controller: 'LoginController',
            controllerAs: 'vm',
            templateUrl: "modules/authentication/views/login.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Login'}
        })
        .state('index.seyfertAccounting', {
//        	abastract : true,
        	cache : false,
            url: "/seyfertAccounting",
            controller: 'SeyfertAccountController',
            controllerAs: 'vm',
            templateUrl: "modules/seyfertAccounting/views/seyfertAllAccounting.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'SeyfertAccounting' }
            
        })
        .state('index.seyfertAccounting.all', {
        	url:'/all',
        	view:{ 
        		'all' : {
        			templateUrl : "modules/member/views/seyfertAllAccounting.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SeyfertAccountController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.seyfertAccounting.deposit', {
        	url:'/deposit?crn&startDate&endDate&crrncy',
        	view:{ 
        		'deposit' : {
        			templateUrl : "modules/member/views/deposit.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SeyfertAccountController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.seyfertAccounting.commission', {
        	url:'/commission?crn&startDate&endDate',
        	view:{ 
        		'commission' : {
        			templateUrl : "modules/member/views/commission.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SeyfertAccountController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.seyfertAccounting.settlement', {
        	url:'/settlement?crn&startDate&endDate',
        	view:{ 
        		'settlement' : {
        			templateUrl : "modules/member/views/settlement.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SeyfertAccountController',
        	sticky :true,
        	deepStateRedirect : true
        })
        .state('index.seyfertAccounting.mtAccountBalance', {
        	url:'/mtAccountBalance',
        	view:{ 
        		'mtAccountBalance' : {
        			templateUrl : "modules/member/views/mtAccountBalance.html" +"?"+extraParams+"="+moment(new Date()).format("DDhh"),
        		}
        	},
        	controller: 'SeyfertAccountController',
        	sticky :true,
        	deepStateRedirect : true
        })        
        
        .state('index.seyfertAccount', {
        	cache : false,
            url: "/seyfertAccount",
            controller: 'SeyfertAccountController',
            controllerAs: 'vm',
            templateUrl: "modules/seyfertAccounting/views/seyfertAccount.html"+"?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'SeyfertAccount' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable',
                            files: ['scripts/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        .state('index.seyfertFluctuation',{
        	cache : false,
        	url: "/seyfertFluctuation/:guid/:tid",
            controller: 'FluctuationController',
            controllerAs: 'vm',
            templateUrl: "modules/seyfertFluctuation/views/seyfertFluctuation.html?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Seyfert Fluctuation' }
        })
        .state('index.seyfertKeyPSetting',{
        	cache : false,
        	url: "/seyfertKeyPController",
            controller: 'SeyfertKeyPController',
            controllerAs: 'vm',
            templateUrl: "modules/settings/views/keyPCtrl.html?"+extraParams+"="+moment(new Date()).format("DDhh"),
            data: { pageTitle: 'Seyfert KeyP controller' }
        })
        .state('index.smsSRList',{
        	cache : false,
        	url: "/smsSRList/:phoneNumber",
		    controller: 'SmsSRController',
		    controllerAs: 'vm',
		    templateUrl: "modules/sms/views/smsSRList.html?"+extraParams+"="+moment(new Date()).format("DDhh"),
		    data: { pageTitle: 'Sms Send/Recieve List' }
		})
      ;
}

run.$inject = ['$rootScope', '$cookieStore', '$http', '$state', '$templateCache', 'localStorageService', '$location' ,'extraParams'  ];

function run($rootScope, $cookieStore, $http, $state, $log, localStorageService, $location , extraParams ) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};

    $rootScope.$log = $log;
    $rootScope.$state = $state;
    
    console.log("config::run:");
//    console.log(extraParams);
    var loggedIn = $rootScope.globals.currentUser;
    if (angular.isUndefined(loggedIn)) {
    	console.log("config::isUndefined");
    	$location.path('/login');
    }
    
    if (loggedIn) {
    	console.log("config::run:Authorization");
    	$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }
    
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
    	// redirect to login page if not logged in and trying to access a restricted page
    	var loggedIn = $rootScope.globals.currentUser;
        var restrictedPage = $.inArray($state, ['login']) === -1;
        console.log("locationChangeStart" + next + "---" +  current);
        
        if (restrictedPage && !loggedIn) {
        	console.log("locationChangeStart:login");
        	$state.go('login');
        	
        }else{
        	if ($state.current.name != null || $state.current.name != '') {
        		console.log($state.current.name);
        		//index.seyfertAccount
        		localStorageService.set('currentPage', $state.current.name);
        		//$state.go($state.current.name,{});
        	}
        }
    });
   

    
}

function commaToDecimal(){
    return function(value) {
        return value ? parseFloat(value).toFixed(2).toString().replace('.', ',') : null;
    };
}

function extraParams(){
    return function() {
        return "?pce="+moment(new Date()).format("DDhh");
    };
}

angular
    .module('inspinia')
    .constant('extraParams',"pce")
    .config(config)
	.filter('commaToDecimal', commaToDecimal)
    .run(run);

