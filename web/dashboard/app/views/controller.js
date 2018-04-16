angular.module('inspinia')
	.controller('PopUpCtrl', PopUpCtrl);

PopUpCtrl.$inject = ['$scope','Utils'];

function PopUpCtrl($scope, Utils, $close){
	
	
	var vm = this;
	vm.getPreviousAdmin = function(){
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
	
	vm.requestSessionExpand = function(){
		//closeAll();
		Utils.sessionExpand();
		
	}
	vm.close = function(){
		
		$close;
	}
	
}