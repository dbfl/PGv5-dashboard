(function () {
    'use strict';

    angular
        .module('inspinia')
        .controller('LectureController', LectureController);

    LectureController.$inject = ['$scope','$rootScope','$state', 'LectureService', '$translate', 'Utils', '$log' , '$timeout' ,'$httpParamSerializer', '$http', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'localStorageService'];
    function LectureController($scope, $rootScope, $state, LectureService, $translate, Utils, $log, $timeout, $httpParamSerializer, $http, DTOptionsBuilder, DTColumnDefBuilder, localStorageService) {
        var vm = this;
        
        $scope.nextLucture = '';
        $scope.listLucture = null;
        $scope.errorLectureForm = false;
        (function initController() {
        	$log.debug("Lecture init");
        	getNextLucture();
        	getListLucture();
        })();

        $scope.dtOptionsLecture = DTOptionsBuilder.newOptions()
		.withPaginationType('numbers')
		.withDisplayLength(10)
		.withOption('paging',true)
		.withOption('searching',true)
		.withOption('lengthChange',false)
		.withOption('ordering',true)
		.withOption('info',true)
		.withOption('pagingType',"full_numbers")
		.withBootstrap();
        
        function getNextLucture() {
        	$scope.dataLoading = true;
        	LectureService.getNextLucture().then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$scope.nextLucture = response.data.result;
				}else{
					$scope.showErrorStatus = true;
				}
				$scope.dataLoading = false;				
            });
        };
        
        $scope.tempAddForm = 'modules/lecture/views/addForm.html'+Utils.getExtraParams();
        vm.initAddLecture = function () {
        	$scope.isCollapsed = ($scope.isCollapsed) ? false : true;
        };
        
        vm.addLecture = function () {
        	$log.debug('addLecture: ' + JSON.stringify(vm.lectureForm));
        	$scope.errorLectureForm = false;
			$log.debug('httpParamSerializer: ' + $httpParamSerializer(vm.lectureForm));
			LectureService.addLecture($httpParamSerializer(vm.lectureForm)).then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			getListLucture();
        			$scope.isCollapsed = false;// close searchForm
				}else{
					$scope.isCollapsed = true;
					$scope.errorLectureForm = true;
				}
				$scope.dataLoading = false;				
            });
        };
        
        vm.voteLecture = function (id) {
        	$log.debug("voteLecture");
        	$scope.dataLoading = true;
        	var paramStr = "id=" + id;
        	LectureService.voteLecture(paramStr).then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			getListLucture();
				}
				$scope.dataLoading = false;				
            });
        };
        
        function getListLucture() {
        	$scope.dataLoading = true;
        	LectureService.getListLucture().then(function (response) {
        		$log.debug(response.status);
        		if(response.status == 'SUCCESS'){
        			$scope.listLucture = response.data.result;
				}else{
					$scope.showErrorStatus = true;
				}
				$scope.dataLoading = false;				
            });
        };
    }

})();
