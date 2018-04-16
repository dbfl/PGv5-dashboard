(function () {
    'use strict';
    
    angular
        .module('inspinia')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q','Utils'];
    function AuthenticationService($http, $cookieStore, $rootScope, $timeout,$q,Utils) {
        var service = {};

        service.init = init;
        service.getKeysExchange = getKeysExchange;
        service.putKeysExchange = putKeysExchange;
        service.sendEncPassword = sendEncPassword;
        service.getTmpLoginKeyp = getTmpLoginKeyp;
        service.decryptAndStoreTmpCredentials = decryptAndStoreTmpCredentials;
       
        service.clearCredentials = clearCredentials;
        service.renewPassword = renewPassword;

        return service;

        
        function init() {
        	return Utils.requestAPILogin('v5a/login/init?_method=GET');        	
        }
        
        function renewPassword(oldPassword, newPassword) {
        	var params = 'oldPassword=' + encodeURIComponent(oldPassword) + '&newPassword=' + encodeURIComponent(newPassword);
			return Utils.requestAPI('v5a/login/password?_method=PUT&',params);
        }
        
        function getKeysExchange(username) {
        	var params = 'login=' + username + 
        	'&encrMessage=' + encodeURIComponent($rootScope.initData.encrMessage) + 
        	'&appGuid=' + $rootScope.initData.appGuid +
        	'&hash=' + $rootScope.initData.hash +
        	'&nonce=' + $rootScope.initData.nonce;
        	return Utils.requestAPILogin('v5l/e2e/keysExchange?_method=GET&' + params);
        }
        
        function putKeysExchange(username,enc_keyB) {
        	var params = 'login=' + username + '&encKeyb=' + enc_keyB;
			return Utils.requestAPILogin('v5l/e2e/keysExchange?_method=PUT&' + params);
        }
        
        function sendEncPassword(username,encPassword){
        	var params = 'login=' + username + '&e2e_password=' + encPassword;
			return Utils.requestAPILogin('v5l/login/authenticate?_method=GET&' + params);  
        }
        
        function getTmpLoginKeyp(decSignature){
        	var params = 'signature=' + decSignature;
			return Utils.requestAPILogin('v5a/login/authConfirm?_method=GET&' + params);
        }
        
        function decryptAndStoreTmpCredentials(username,password,response, keyB) {
        	cryptico.decryptAes(response.encrGuid, keyB, function(decrGuid) {
        		cryptico.decryptAes(response.encrKeyp, keyB, function(decrKeyp) {
        			var authdata = Base64.encode(username + ':' + password);

                    $rootScope.globals = {
                        currentUser: {
                            username: username,
                            authdata: authdata,
                            superGuid: decrGuid,
                            pkey: decrKeyp,
                            isAdmin: response.isAdmin,
                        }
                    };

                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
                    $cookieStore.put('globals', $rootScope.globals);
        		});
        	});
        }
        
       function clearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }

    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();