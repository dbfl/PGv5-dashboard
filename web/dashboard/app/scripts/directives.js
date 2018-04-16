/**
 * INSPINIA - Responsive Admin Theme
 *
 */


function pwCheck($rootScope) {
	 return {
		 	restrict: 'A',
	        scope: true,
	        require: 'ngModel',
	        link: function (scope, elem, attrs, ctrl) {
	            var firstPassword = '#' + attrs.pwCheck;
	            elem.add(firstPassword).on('keyup', function () {
	                scope.$apply(function () {
	                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
	                });
	            });
	        }
	    }
};

function appendElement() {
	return {
		restrict: 'A',
        scope: {
            data: '=appendElement'
        },
        link: function(scope, element, attrs) {
	        element.click(function(){
	        	var html = $("#addCurrnecy").clone().html();
	        	console.log("--html--copy--" + html);
	        	//element.append(html);
	        	$("#addhere").html(html);
	         })
        }
    }
};
   

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
            	var title = 'PAYGATE | Dashboard Admin';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'PAYGATE | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();
            });
        }
    };
};

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            },
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 200);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 100);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};

/**
 * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
 */
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            }
        }
    };
}

function transValueToCurrency(){
	return {
		restrict : "AC",
		scope : {
			value : "="
		},
		link : function(scope, element, attrs) {
			scope.temp = attrs.name;
			
		
			if (angular.isUndefined(scope.value) || scope.value === null ){
				scope.value = 0;
			}  
		},
		template : function(element, attrs){

			if(attrs.strong != "true"){
				return '<'+attrs.type+'><span >  <i class= "'+attrs.icon+'"></i>   {{value | currency : "" :'+ attrs.ops+'}}</span></'+attrs.type+'>';
			}else{
				return '<'+attrs.type+'> <strong> <span >  <i class= "'+attrs.icon+'"></i>   {{value | currency : "" :'+ attrs.ops+'}}</span> </strong></'+attrs.type+'>';
			}
		}
	};
}


function getMemberDetialInfo(){
	return {
		restrict : "C",
		scope : {
			method: "&",
			data: "="
		},
		link : function($scope, element, attrs) {
			
			function actionVisible() {
				this.visibleButton = true;
			}
			function actionInVisible() {
				this.visibleButton = false;
			}
			$scope.dStyle = {
				'background-color' : '',
				'margin-top' : '5px',
				'margin-left' : '20px',
			};
			
			$scope.actionVisible = actionVisible;
			$scope.actionInVisible = actionInVisible;
			$scope.tmp = $scope.data;
		},
		template :
			'<span   ng-mouseover="actionVisible();" ng-mouseleave="actionInVisible();">' +
			'<label  class="show-cursor" type="button" ng-style="back3" ng-click="method()"><h4>{{tmp.guid}}</h4></label>' +
			'<button class="btn btn-sm btn-primary m-t-n-xs" ng-style="dStyle"  type="button" ng-show="visibleButton" ng-click="method()"> detail </button>' +
			'</span>',
	};
}

function testGuidSearch(){
	return {
        restrict : "C",
        scope : {
        	
        	params : '='
        },
        link : function($scope, element, attrs) {
            $scope.textText ;
            
            function valueChange(){
                var tmp = $scope.textText;
//                console.log(tmp);
                $scope.isShow = (angular.isUndefined(tmp) || tmp === null|| tmp.length <= 0) ? false : true ;
                
                params = tmp;
            }
            
            $scope.valueChange = valueChange;
        },
        template :
            '<input type="text" ng-model="textText" ng-change="valueChange()"required placeholder="" autofocus />'+
            '<button ng-show="isShow" ng-click= "getMemberDetail(vm.memContract || vm.seyfertWithdrawForm)">lblChange</button>'
    };
	
} 


function testGuid(){
    return {
        restrict : "C",
        scope : {
        	name: "=",
        	data: "=",
        	blur: "&",
        },
        link : function($scope, element, attrs ,$ctrl) {
            // form memberDetail: {"dstMemGuid":"__"}
            $scope.invalidShow = false ;
            $scope.errorBound = "has-error"
            
           function valueChange(){
                var tmp = $scope.data;
                $scope.isShow = (angular.isUndefined(tmp) || tmp === null|| tmp.length <= 0) ? false : true;
                if($scope.isShow){
                	$scope.invalidShow = false ;
                	$scope.errorBound = ""
                }else {
                	$scope.invalidShow = true ;
                	$scope.errorBound = "has-error"
                }
               $scope.data = tmp;
//               $scope.tempval = {"dstMemGuid": tmp};
            }
          
          $scope.valueChange = valueChange;
        },
        template :
        	'<div ng-class="errorBound"> <input type="text" name="name" class="form-control" ng-blur="blur()" ng-model="data"  ng-change="valueChange()" required placeholder="Enter the GUID"  autofocus />'+
            '<p ng-show="invalidShow" class="help-block"><font color="#a94442">Invalid Guid!</font></p>'+
            '</div>'
        	
        	/*
            '<div><input type="text" name="name" class="form-control" ng-blur="blur()" ng-model="textText"  ng-change="valueChange()" required placeholder="Enter the GUID"  autofocus />'+
            '<p ng-show="invalidShow" class="help-block"><font color="#a94442">Invalid Guid!</font></p>'*/// +
//            '<button class="btn btn-outline btn-warning dim " ng-show="isShow" ng-click= "getMemberDetail(tempval)"><i class="fa fa-pencil-square-o"></i></button>'
    };
}

function formater($filter){
	 return {
	        require: '?ngModel',
	        link: function (scope, elem, attrs, ctrl) {
	            if (!ctrl) return;

	            ctrl.$formatters.unshift(function (a) {
	                return $filter(attrs.format)(ctrl.$modelValue)
	            });

	            elem.bind('blur', function(event) {
	                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
	                elem.val($filter(attrs.format)(plainNumber));
	            });
	        }
	    };
}

function onlyNumber(){
	return {
		link: function(scope, element, attr){
			
			element.on('keydown', function(event){
				var key = (event.which) ? event.which : event.keyCode;
//				console.log(key);
				if((key >=48 && key <= 57) 
						|| (key >=96 && key <= 105) 
						|| (key == 8) || (key == 9) 
						|| (key == 13) 
						|| (key == 16) 
						|| (key == 37) 
						|| (key == 39) 
						|| (key == 116)
						|| (event.ctrlKey && event.keyCode == 86)
						|| (key == 190)
						|| (key == 110)
						|| (key == 46)
				){
					return true;
				}
				else{
					
					return false;
				}
			});
			// for removing character like , ...
			element.on('keyup', function(event){
				event = event || window.event;
				var keyID = (event.which) ? event.which : event.keyCode;
//				if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 || keyID == 190 || keyID == 110) 
				if ( keyID == 190 || keyID == 110) 
					return;
				else
					event.target.value = event.target.value.replace(/[^0-9.]/g, "");

			});
			element.on('click', function(event){
				event = event || window.event;
				event.target.value = event.target.value.replace(/[^0-9.]/g, "");

			});
		}
	}
}

function lazyLoad(){
	return{
		restrict: "A",
		link: function(scope,elem){
			var scroller = elem[0];
			$(scroller).bind('scroll', function(){
				if(scroller.scrollTop + scroller.offsetHeight >= scroller.scrollHeight){
					scope.$apply('loadMore()');
				}
			});
		} 
	}
}

function getLayerSelectBox(){
	return {
		restrict : "C",
		scope : {
			method: "&",
			data: "="
		},
		link : function($scope, element, attrs) {
			
			function actionVisible() {
				this.visibleButton = true;
			}
			function actionInVisible() {
				this.visibleButton = false;
			}
			$scope.dStyle = {
				'background-color' : '',
				'margin-top' : '5px',
				'margin-left' : '20px',
			};
			
			$scope.getValue=function(){
			};
			$scope.actionVisible = actionVisible;
			$scope.actionInVisible = actionInVisible;
			$scope.tmp = $scope.data;
		},
		template :
			'<span   ng-mouseover="actionVisible();" ">' +
			'<label  class="show-cursor" type="button" ng-style="back3" ng-click="method()"><h4>{{1111111}}</h4></label>' +
			'<select ng-show="visibleButton" ng-model="tmp" ng-change="getValue()"> detail' + 
			'<option value="1"> 팝업 </option>' +
			'<option value="2"> 연장 </option>' +
			'<option value="3"> </option>' +
			'</select>' +
			'</span>',
	};
}



/**
 *
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('iboxToolsFullScreen', iboxToolsFullScreen)
	.directive('pwCheck', pwCheck)
	.directive('appendElement', appendElement)
    .directive('typeCurrency', transValueToCurrency)
    .directive('guidDetail', getMemberDetialInfo)
	.directive('test', testGuidSearch)
	.directive('guid', testGuid)
	.directive('format', formater)
	.directive('onlyNumber', onlyNumber)
	.directive('lazyLoad', lazyLoad)
	.directive('popSelect', getLayerSelectBox)
	;

