(function() {
	'use strict';

	angular
		.module('inspinia')
		.factory('Utils', Utils);

	Utils.$inject = ['$http', '$timeout', '$q', '$rootScope', '$state', '$log' ,'extraParams' ,'$translate' ,'notify' ,'$location'];
	
	function Utils($http, $timeout, $q, $rootScope, $state, $log ,extraParams ,$translate ,notify ,$location ) {
		var service = {};
		service.isUndefinedOrNull = isUndefinedOrNull;
		service.isNullOrUndifined = isNullOrUndifined;
		service.goPreviousAdminPage = goPreviousAdminPage;
		service.getHostUri= getHostUri;
		service.getSwitchURL =getSwitchURL;
		service.getUrl =getUrl;
		service.requestAPILogin =requestAPILogin;
		service.requestAPI  = requestAPI ;
		service.requestAPISms  = requestAPISms ;
		service.requestSession  = requestSession ;
		service.putAPI  = putAPI ;
		service.isObject  = isObject ;
		service.getJsonObj = getJsonObj;
		service.dateFormat = dateFormat;
		service.getKoreanCrrncy = getKoreanCrrncy;
		service.getKoreanBelowPoint = getKoreanBelowPoint;
		service.getExtraParams = getExtraParams;
		service.getErrorHanler = getErrorHanler;
		service.setSimpleNoti = setSimpleNoti;
		service.setLinkNoti = setLinkNoti;
		service.setCustomNoti  = setCustomNoti ;
		service.saveToTxt  = saveToTxt ;
		service.resetTest = resetTest;
		service.sessionExpand  = sessionExpand ;
		service.openNewTab = openNewTab;
		service.openPopUp  = openPopUp ;

		service.setTerminatedPopUps = setTerminatedPopUps;
        service.setModalInstance = setModalInstance;
        service.stopTimer = stopTimer;
        
        service.setBlockId = setBlockId;
        service.getBlockId = getBlockId;
        return service;
        
        var modalInstance = null;
        var blockId = null;
        
        function setBlockId(_blockId){
        	blockId = _blockId;
        }
        function getBlockId(){
        	return blockId;
        }
       
        function setModalInstance(instance){
        	modalInstance = instance;
        }
        function setTerminatedPopUps(){
        	console.log(modalInstance);
        	if(!(isNullOrUndifined(modalInstance))){
        		modalInstance.dismiss('cancel');
        	}
        }
        
        function isUndefinedOrNull (obj) {
			return angular.isDefined(obj) || obj === null;
		}
		//참고 : 상단의 isUndefinedOrNull 메서드 명과 리턴 되는 값이 상이합니다. 호출은 isUndefined 이고, 호출 시에는 isDefind로 체크하여  결과 리턴값이 메서드 명과 반대로 출력되고 있습니다.
		//undefined 체크를 위한 메서드를 만들었습니다.
        
		function isNullOrUndifined(val) {
			return angular.isUndefined(val) || val === null
		}
		function goPreviousAdminPage() {
			/**
			 * 소스 주석 및 수정 added by atlas 2017.10.25
			 * host 별로 분기 
			 * */
			//var url = "https://v5.paygate.net/AdminDashboard/login.html"+"?redirectFrom='newAdmin'";

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

		function getHostUri() {
			//return 'https://v5.paygate.net/';
			//return 'https://stg5.paygate.net/';
			//return 'https://dev5.paygate.net/';

			if (window.location.toString().indexOf("localhost") != -1) {
//				return 'http://localhost:8080/';
				return 'https://dev5.paygate.net/';
				/*return 'https://stg5.paygate.net/' ;*/
			} else if (window.location.toString().indexOf("file://") != -1) {
				return 'https://dev5.paygate.net/';
//				return 'https://stg5.paygate.net/';
//				return 'http://localhost:8080/';
			//					return 'http://localhost:8080/';
			} else {
				return window.location.origin + "/";
			}
		}
		function getSwitchURL(beforeUrl, afterUrl) {
			$rootScope.beforeUrl = beforeUrl;
			$rootScope.afterUrl = afterUrl;

		}
		function getUrl() {

			var tmpArray = [
				$rootScope.beforeUrl,
				$rootScope.afterUrl,
			];
			return tmpArray;
		}
		function requestAPILogin(path_api) {
			$log.debug("call:" + path_api);
			var deferred = $q.defer();
			var url = getHostUri() + path_api + '&callback=JSON_CALLBACK';
			$http.jsonp(url).success(function(data, status, headers, config) {
				$log.debug(data);
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				$log.debug(status);
				deferred.reject(status);
			});
			return deferred.promise;

		}
		function requestAPI(path_api, paramStr) {
			
//			console.log($rootScope.globals.currentUser.superGuid)
			var reqMemGuid = $rootScope.globals.currentUser.superGuid;
			var key = $rootScope.globals.currentUser.pkey;
		
			var params = 'callback=data&reqMemGuid=' + reqMemGuid;

			if (paramStr != '') {
				params += '&' + paramStr;
			}

			var tmpP = 'reqMemGuid=' + reqMemGuid + '&encReq=' + encodeURIComponent(encParams(params, key));

			//	        	var tmpUrl = this.getHostUri() + path_api +paramStr +'&reqMemGuid=' + reqMemGuid;
			var beforeEnc = getHostUri() + path_api + paramStr + '&reqMemGuid=' + reqMemGuid;
			//$log.debug("url before encrypt:" + beforeEnc);

			var p = 'reqMemGuid=' + reqMemGuid + '&encReq=' + encodeURIComponent(encParams(params, key));

			var deferred = $q.defer();
			var url = getHostUri() + path_api + p + '&callback=JSON_CALLBACK';
           // $log.debug("url after encrypt:" + url);

			
			getSwitchURL(beforeEnc, url);

			
			$http.jsonp(url).success(function(data, status, headers, config) {
				resetTest();
				
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
			return deferred.promise;

		}
		function requestAPISms(path_api, paramStr) {
			// guid 보내는 파라미터명을  reqMemNo로 해서 보내줘야합니다. 
			// 하지만 현재 Guid 를 파라미터로 붙이지 않더라고 Sms 전송은 가능합니다. 
			var reqMemGuid = $rootScope.globals.currentUser.superGuid;
			var url = getHostUri() + path_api +paramStr+'&reqMemNo=' + reqMemGuid+'&callback=JSON_CALLBACK';
			
			var deferred = $q.defer();
//			$log.debug("url after encrypt:" + url);
			
			getSwitchURL(url, url);
			$http.jsonp(url).success(function(data, status, headers, config) {
				$log.debug(data);
				resetTest();
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				$log.debug(status);
				deferred.reject(status);
			});
			return deferred.promise;

		}
		function requestSession() {
			var url = getHostUri()+'v5a/v5ctest/string';
			var deferred = $q.defer();
			var headers = {
					'Access-Control-Allow-Origin' : '*',
					'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
					'Content-Type': 'text/plain',
					'Accept': 'application/json'
				};
			var req ={
				method : 'GET' ,
				url :url,
				headers   : headers,
			}
			$http(req).success(function(result){
				console.log(result.status);
				if(result.status == "SUCCESS"){
					console.log('session expanded');
					resetTest();
					deferred.resolve(result.status);
				}
			}).error(function(data,status,headers,config){
				console.log('session expand failed');
				deferred.reject(status);
			});
			
			return deferred.promise;
		}

		function putAPI(path_api) {
			var deferred = $q.defer();
			var url = getHostUri() + path_api + '&callback=JSON_CALLBACK';

			$http.put(url)
				.success(function(data, status, headers, config) {
					$log.debug(data);
					deferred.resolve(data);
				})
				.error(function(data, status, header, config) {
					$log.debug(status);
					deferred.reject(status);
				});
			return deferred.promise;
		}

		function isObject(value) {
			return value != null && (typeof value === 'object' || typeof value === 'function');
		}
		function getJsonObj(response) {
//			$log.debug("response:" + response);
			if (isObject(response))
				return response;
			else {
				var s = response.replace(/[\n\r]/g, ' ');
				if (s.indexOf('angular.callbacks._') != -1) {
					s = s.replace("angular.callbacks._", "");
					var index = s.indexOf("(");
					s=s.slice( index + 1, -1);
				}else{
					s = response;
				}
				$log.debug("response--s:" + s);
	        	return $.parseJSON(s);
        	}
			
        }
        
        function dateFormat(){
        	return {
        		yyyyMMddHHmmss: 'yyyy-MM-dd HH:mm:ss',
        		yyyyMMdd: 'yyyy-MM-dd'
        		
        	}
        }
        function getKoreanCrrncy(num){
            var arrNumberWord = new Array("","일","이","삼","사","오","육","칠","팔","구");
            var arrDigitWord = new  Array("","십","백","천");
            var arrManWord = new  Array("","만 ","억 ", "조 ");
        	
    	  var num_value = num;
          var num_length = num_value.length;

          if(isNaN(num_value) == true)
                return;
          var han_value = "";
          var man_count = 0;      // 만단위 0이 아닌 금액 카운트.

          for(i=0; i < num_value.length; i++)
          {
                var strTextWord = arrNumberWord[num_value.charAt(i)];
                if(strTextWord != ""){
                      man_count++;
                      strTextWord += arrDigitWord[(num_length - (i+1)) % 4];
                }
                if(man_count != 0 && (num_length - (i+1)) % 4 == 0){
                      man_count = 0;
                      strTextWord = strTextWord + arrManWord[(num_length - (i+1)) / 4];
                }

                han_value += strTextWord;
          }

          if(num_value != 0)
                han_value = han_value + "";

          	return han_value;
              
        }
        function getKoreanBelowPoint(num){
        	var arrNumberWord = new Array("","일","이","삼","사","오","육","칠","팔","구");
			var num_value = num;
            var num_length = num_value.length;

             if(isNaN(num_value) == true)
                   return;
             var han_value = "";
             var man_count = 0;      // 만단위 0이 아닌 금액 카운트.

             for(i=0; i < num_value.length; i++)
             {
                   var strTextWord = arrNumberWord[num_value.charAt(i)];
                   han_value += strTextWord;
             }

             if(num_value != 0)
                   han_value = " 점 "+han_value;
             		//han_value = " 점 "+han_value + " 원";
//             console.log(han_value);
             return han_value;

        }
        function getExtraParams(){
//        	 localStorageService.get('currentPage');
        	return "?"+extraParams+"="+moment(new Date()).format("DDhh"); 
        }
        function getErrorHanler(code , desc){
        	var comments = "" ;
        	if(code == 'UNKNOWN_ERROR'){
        		// UNKNOWN_ERROR시 유저에게는 세션 만료한것으로 안내
        		comments = "세션이 만료되어 로그인 창으로 이동합니다." ;
				console.log(code + ":" + desc);
        	}else{
        		comments = code + " : " + desc ;
        		
        	}
        	
        	swal({
        	  title: $translate.instant('ERROR'),
        	  text: comments,
        	  type: "error",
        	  confirmButtonText: $translate.instant('btnOK')
        	});
        	
        	//SESSION_EXPIRES
        	if(code == 'UNKNOWN_ERROR'){
    			$state.go('login');
				if (!$rootScope.$$phase) $rootScope.$apply();
        	}
        }
        function setSimpleNoti(_text ,_duration , _class){
        	notify.config({
 		       duration: _duration
 		    });
        	var inspiniaTemplate = 'views/common/notify.html';
        	//'구) 관리자 페이지에서도 서비스 이용이 가능합니다.'
        	notify({ message: _text, classes: _class ,templateUrl: inspiniaTemplate});
        }
        function setLinkNoti(_text ,_duration , _class){
        	notify.config({
 		       duration: _duration
 		    });
        	var inspiniaTemplate = 'views/common/notify.html';
        	//'구) 관리자 페이지에서도 서비스 이용이 가능합니다.'
        	notify({ message: _text, classes: _class ,templateUrl: inspiniaTemplate});
        }
        function setCustomNoti(_text ,_duration , tmplate , _class){
        	notify.config({
 		       duration: _duration
 		    });
        	//'구) 관리자 페이지에서도 서비스 이용이 가능합니다.'
        	notify({ message: _text, classes: _class, templateUrl: tmplate});
    	
            /*@samples
             * 
             * notify({ message: 'Info - This is a Inspinia info notification', classes: 'alert-info', templateUrl: tmplate});
            notify({ message: 'Success - This is a Inspinia success notification', classes: 'alert-success', templateUrl: tmplate});
            notify({ message: 'Warning - This is a Inspinia warning notification', classes: 'alert-warning', templateUrl: tmplate});
           notify({ message: 'Danger - This is a Inspinia danger notification', classes: 'alert-danger', templateUrl: tmplate});*/
        }

        function saveToTxt(data,filename){
        	if(!data) {
	            console.error('Console.save: No data')
	            return;
	        }
        	var HOST_URI = window.location.hostname;
			var TARGET = "";
			var TARGET_URI = "";

			if (HOST_URI == "dev5.paygate.net") {
				/* TARGET_URI = "https://dev5.paygate.net/AdminDashboard/login.html"; */
				TARGET = "DEV5";
				TARGET_URI = "https://dev5.paygate.net/dashboard/app/index.html";
			}else if (HOST_URI == "stg5.paygate.net") {
				/* TARGET_URI = "https://stg5.paygate.net/AdminDashboard/login.html"; */
				TARGET = "STG5";
				TARGET_URI = "https://stg5.paygate.net/dashboard/app/index.html";
			}else if (HOST_URI == "v5.paygate.net") {
				/* TARGET_URI = "https://v5.paygate.net/AdminDashboard/login.html"; */
				TARGET = "V5";
				TARGET_URI = "https://v5.paygate.net/dashboard/app/index.html";
				//== > 이 도메인으로 들어올수 있도록 시스템 팀에게 요청하기 ... 
			}else{
				TARGET = "unverified";
				TARGET_URI = "unverified";
			}
			
			if(!filename) {
	        	filename = 'noName.txt'
	        }else{
	        	filename += "_"+TARGET+".txt"
	        	data     += "\r\n \r\n *** this keyP is valid at [" + TARGET_URI + "] ***";
	        }
	        	
	        	
	        var blob = new Blob([data], {type: 'text/plain'}),
	            e    = document.createEvent('MouseEvents'),
	            a    = document.createElement('a')
		  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
		      window.navigator.msSaveOrOpenBlob(blob, filename);
		  }
		  else{
		      var e = document.createEvent('MouseEvents'),
		          a = document.createElement('a');

		      a.download = filename;
		      a.href = window.URL.createObjectURL(blob);
		      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
		      e.initEvent('click', true, false, window,
		          0, 0, 0, 0, 0, false, false, false, false, 0, null);
		      a.dispatchEvent(e);
		  }
        }
        function resetTest(){
    		$rootScope.$emit('resetTimer',"");
        }
        function stopTimer(){
        	$rootScope.$emit('stopTimer',"");
        }
        function sessionExpand(){
        	notify.closeAll();
        	requestSession();
        }
        function openNewTab(url){
        	// local
        	//var test = 'http://'+$location.host()+'/web/dashboard/app/index.html'+url;
        	
        	//dev/stg/prod
        	var test = getHostUri()+'dashboard/app/index.html'+url;
        	window.open(test);
        }
        function openPopUp(url){
        	//local
        	//var test = 'http://'+$location.host()+'/web/dashboard/app/index.html'+url;
        	
        	//dev/stg/prod
        	var test = getHostUri()+'dashboard/app/index.html'+url;
        	window.open(test, '_blank', 'width=1000,height=900,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');

        	
        	/*var innerContents = document.getElementById('test').innerHTML;
            var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body>' + innerContents + '</html>');
            popupWinindow.document.close();
        	*/

        	
        }
        
    	
        

        
        
        
        
    }
    
    

})();