
/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl($rootScope, $scope, $log, Utils, $timeout ,localStorageService,$window,$state ,$cookieStore) {
	var main = this;
	this.userName = 'Example user';
	this.helloText = 'Welcome in SeedProject';
	this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';
	
	this.isAdmin = $rootScope.globals.currentUser.isAdmin;
	
	let SIZE_S = 200 ; 
	let SIZE_M = SIZE_S * 2 ;
	let SIZE_L = SIZE_S * 3 ; 

	
	if ($rootScope.globals.currentUser) {
		this.userName = $rootScope.globals.currentUser.username;
	}
	// VIEWAS start
    $rootScope.isViewAsActivated = localStorageService.get('viewas');
    if(!(Utils.isNullOrUndifined($rootScope.isViewAsActivated))){
		main.isViewAs = $rootScope.isViewAsActivated;
		
	}
    
    this.isAdmin = $rootScope.globals.currentUser.isAdmin;
	// VIEWAS end 
	console.log("MainCtrl:" + this.isAdmin);

	//if (location.href.includes(Utils.getHostUri)) {
	if (location.href.indexOf(Utils.getHostUri) != -1 ) {
		$scope.stateURI = '';
	} else {
		$scope.stateURI = "   Your targetted API is supposed to be : " + Utils.getHostUri();
	}
	
	$scope.usernameForViewAs = this.userName;
	console.log("Username:" + this.userName);

	$scope.close = function() {
		console.log("cancel click");
		main.viewUrl = $rootScope.viewUrl = !$rootScope.viewUrl;
		var array = [main.viewAs,$rootScope.viewUrl,this.userName];
		localStorageService.set('notiBar', array);
		//reloadMainPage();
	}
	
	/**
	 *상단 알림 바 show/hide
	 * array[0] : boolean , ViewAs 
	 * array[1] : boolean , ViewUrl
	 * array[2] : String  , user name 
	 * */
	if(this.isAdmin){
		var array = localStorageService.get('notiBar');
		if(array != null){
			if(this.userName == array[2]){
				main.viewAs  = $rootScope.viewAs  = array[0];
				main.viewUrl = $rootScope.viewUrl = array[1];
			}else{
				main.viewAs  = $rootScope.viewAs  = true;
				main.viewUrl = $rootScope.viewUrl = true;
			}
		}else{
			main.viewAs  = $rootScope.viewAs  = true;
			main.viewUrl = $rootScope.viewUrl = true;
		}
	}else{ 

	}
	/**
	 * 
	 * tmpArray[0] : url before encrypt
	 * tmpArray[1] : url after encrypt
	 * 
	 * */
	var tmpArray;
	var setThinBanner = function() {
		if(Utils.isNullOrUndifined(Utils.getUrl())){
			$scope.switchURL0 = "" ; //	
			return;
		}
		tmpArray = Utils.getUrl();
		$scope.switchURL0 = "Before :" + "\n"+ tmpArray[0];
	}
	
	$timeout(setThinBanner, 500);
	
	
	var isEncrypted = false; 
	function getAfterEncryptedURL()  {
		setThinBanner();
		isEncrypted = !isEncrypted;
		$scope.switchURL0 = isEncrypted ? "After :" + tmpArray[1] : "Before :" + tmpArray[0];
	}

	main.getAfterEncryptedURL = getAfterEncryptedURL;
	
	function goPreviousAdminPage(){
		Utils.goPreviousAdminPage();
	}
	
	main.goPreviousAdminPage = goPreviousAdminPage;
	
	//VIEWAS start // tesing for View as 
	
	function inActivatedViewAs() {
		
		main.isViewAs = false;
		localStorageService.set('viewas', false);
		$rootScope.globals = $cookieStore.get('temp');
		$cookieStore.put('globals', $rootScope.globals);
        $cookieStore.remove('temp');
        Utils.stopTimer();
        
        
		reloadMainPage();
	}
	/**
	 * @method when admin will change user using view-as , it would reload main page/
	 *  way1.5 : $state.reload();  way2 : $window.location.reload(true); 
	 * */
	function reloadMainPage(){
		//way1  it's more faster than way 2 
		$state.go($state.current,{},{reload:true});
	}
	main.inActivatedViewAs= inActivatedViewAs;
	
	
	//VIEW AS end 
	// 스크롤시 화면 상단 바 고정 되는 부분 
	$scope.offset = SIZE_S;
	 angular.element($window).bind("scroll", function() {
		 $scope.offset = SIZE_S;
         if (this.pageYOffset > $scope.offset) {
        	 $scope.boolChangeClass = "test";
        	 $scope.btest = false;

              var el = angular.element(document.querySelector('#tt'));
              el.addClass('navbar-fixed-top');
          } else if(this.pageYOffset > 50 && this.pageYOffset <  $scope.offset) {
        	  $scope.boolChangeClass = 'false';
        	  $scope.btest = true;
        	  var el = angular.element(document.querySelector('#tt'));
              el.removeClass('navbar-fixed-top');
          }
         $scope.$apply();
     });
	 
	 /**
	  * 브라우저 너비에 따른 상단 메뉴 버튼 fix off set 설정 
	  * 원인 : 브라우저 너비에 따른 컴포넌트 겹침현상으로 깜빡힘 현상 발생 .
	  * 수정 : 너비의 따른 상단 fix offset 설정 
	  * */
	 
	 angular.element($window).bind("resize",function(){
		 var size = $window.outerWidth;
		 var tmpS = 0;
		 
		 if(size > 1500){
			 tempS = SIZE_S;
			 $scope.offset = tmpS ;
			 return;
		 }
		 
		 tmpS = size > 1000 ? SIZE_M : SIZE_L;
		 $scope.offset = tmpS ;
	 }).resize();
	 
	 $scope.callbackTimer={};
	    $scope.callbackTimer.status='Running';
	    $scope.callbackTimer.callbackCount=0;
	    $scope.callbackTimer.finished=function(){
	        $scope.callbackTimer.status='COMPLETE!!';
	        $scope.callbackTimer.callbackCount++;
	        $scope.$apply();
	    }
		

}
;

//TODO  
/*function chooseHostURI(HOST_URI) {
	if (HOST_URI == "dev5.paygate.net")
		return "https://dev5.paygate.net/";
	else if (HOST_URI == "stg5.paygate.net")
		return "https://stg5.paygate.net/";
	else if (HOST_URI == "v5.paygate.net")
		return "https://v5.paygate.net/";
	
	return "http://localhost:8080/";
}*/


/*
 * function getAccessedBrower(){
	var agent = navigator.userAgent.toLowerCase();
	if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
		console.log("인터넷 익스플로러 브라우저 입니다.");
	}else {
		console.log("인터넷 익스플로러 브라우저가 아닙니다.");
	}
}*/

/**
 * translateCtrl - Controller for translate
 */
function translateCtrl($translate, $scope,$rootScope, localStorageService, $log ,Utils ,$filter ,Idle ,notify ,$timeout,$state,CommonService ,$cookieStore ) {
	var currentLang = localStorageService.get('currentLang');
	$log.debug("load lang check" + currentLang);
	
	var date = new Date();
	var currentTime = $filter('date')(date, 'MMddHHmmss');
	currentTime = Number(currentTime);
	
	var duration = localStorageService.get("popup");
	
	// 팝업을 보여주는 시간부터 5초 동안 동일한 팝업창이 뜨지 않도록 
	if(Utils.isNullOrUndifined(duration)){
		showPopUp(currentTime);
	}else{
		duration = Number(duration);
		if(duration < currentTime ){
			showPopUp(currentTime);
		}
	}
	
	function showPopUp(crrntTime){
		
		var tmpNoti = 'views/common/notifyLink.html'+Utils.getExtraParams();
		var msg = ' 구) 관리자 페이지에서도 서비스 이용이 가능합니다. ';
		Utils.setCustomNoti(msg,'5000',tmpNoti,'alert-danger');
		
		var limitTime = Number(crrntTime) + 5;
		localStorageService.set("popup", limitTime);
	}

	if (currentLang != null || currentLang != '') {
		$log.debug("load lang");
		$translate.use(currentLang);
		focusLang(currentLang);
	}

	$translate('WARNING').then(function(paragraph) {
		$scope.WARNING = paragraph;
	}, function(translationId) {
		$scope.WARNING = translationId;
	});

	$scope.changeLanguage = function(langKey) {
		localStorageService.set('currentLang', langKey);
		focusLang(langKey);
		$translate.use(langKey);
	};

	function focusLang(langKey) {
		$log.debug("focusLang:" + langKey);
		if (langKey == 'kr') {
			$scope.langEn = '';
			$scope.langKr = 'btn btn-outline btn-info';
		} else {
			$scope.langEn = 'btn btn-outline btn-info';
			$scope.langKr = '';
		}
		
	}
	

/*	
 * when using Idle libs 
 * Idle.watch();
	$scope.$on('IdleStart', function () {
        notify({
            message: 'Idle time - You can call any function after idle timeout.',
            classes: 'alert-warning',
            templateUrl: 'views/common/notify.html'
        });
        $scope.customAlert = true;

    });

    // function you want to fire when the user becomes active again
    $scope.$on('IdleEnd', function () {
        notify({
            message: 'You are back, Great that you decided to move a mouse.',
            classes: 'alert-success',
            templateUrl: 'views/common/notify.html'
        });
        $scope.customAlert = false;
    });*/
	//TODO 이것도 권한에 따른 default 시간 설정 추가 하기 
	
	var isAdmin = $rootScope.globals.currentUser.isAdmin;
	if(isAdmin){
		$scope.defaultTimeLimit = 60 * 60;
	}else{
		$scope.defaultTimeLimit = 15 * 60;
	}
	
	$scope.requestSessionExpand = function(){
		Utils.sessionExpand();
	}
	$scope.timerReset = function(){
		$scope.$broadcast('timer-reset');
		$scope.$broadcast('timer-start');
	}
	
	$scope.test = function(){
		Utils.stopTimer();
	}
	$scope.requestTimerStop = function(){
		$scope.$broadcast('timer-stop');
		
		
	}
	$rootScope.$on('resetTimer',function(event,args){
		$scope.timerReset();		
	});
	var unbindWatcher =	$rootScope.$on('stopTimer',function(event,args){
		$scope.requestTimerStop();
		unbindTimeTicker();
	});
	
	function sesstionPopUp(crrnTime){
		var limitTime = Number(crrnTime) + 1;
		localStorageService.set("sessionExpand", limitTime);
		var tmpNoti = 'views/common/notifyButton.html'+Utils.getExtraParams();
		var msg = '로그인 연장을 진행하시겠습니까?';
		Utils.setCustomNoti(msg,'10000',tmpNoti,'alert-warning');
	}
	
	var unbindTimeTicker = $scope.$on('timer-tick',function(event,args){
		$timeout(function(){
			var left = args.millis;
			if(args.millis == 61000){
				var date = new Date();
				var currentTime = $filter('date')(date, 'MMddHHmmss');
				currentTime = Number(currentTime);
				var duration = localStorageService.get("sessionExpand");
				if(Utils.isNullOrUndifined(duration)){
					sesstionPopUp(currentTime);
				}else{
					duration = Number(duration);
					if(duration < currentTime ){
						sesstionPopUp(currentTime);
					}
				}
			}
			//3590000
//			console.log(left);
			if(args.millis == 1000){
				var comments = "" ;
				//켜져있는 팝업창이 있으면 종료시키기 
				Utils.setTerminatedPopUps();
				comments = "세션이 만료되어 로그인 창으로 이동합니다." ;
				swal({
	            	  title: $translate.instant('ERROR'),
	            	  text: comments,
	            	  type: "error",
	            	  confirmButtonText: $translate.instant('btnOK')
	            	});
				
					var isViewAs = localStorageService.get('viewas');
					if(isViewAs){
						localStorageService.set('viewas', false);
						$rootScope.globals = $cookieStore.get('temp');
						$cookieStore.put('globals', $rootScope.globals);
				        $cookieStore.remove('temp');
					}
					
					//
		        	//SESSION_EXPIRES
        			$state.go('login');
					if (!$rootScope.$$phase) $rootScope.$apply();
			}
		});
	});
	
}

/*stateURI: function(){
	
	if (window.location.origin("https://dev5.paygate.net/") !=-1) {
		System.out.println( "This is for Development");
	}  else if (window.location.origin("https://stg5.paygate.net/") !=-1) {
		System.out.println("This is Test Server");
	}	else if (window.location.origin("https://v5.paygate.net/") !=-1){
		System.out.println("This is PROD server.");
	}	else{
		System.out.println("This is using LocalHost.");
	}
}
*/

angular.module('inspinia')
	.controller('MainCtrl', MainCtrl)
	.controller('translateCtrl', translateCtrl);