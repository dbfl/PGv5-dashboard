'use strict';
angular.module('inspinia')
    .factory('printer', ['$rootScope', '$compile', '$http', '$timeout', '$q',
        function ($rootScope, $compile, $http, $timeout, $q) {
            var printHtml = function (html) {
                var deferred = $q.defer();
                var htmlContent = "<!doctype html>" +
                        "<html>" +
                        	'<body>' +
                                html +
                            '</body>' +
                        "</html>";
                
                var doc = window.open();
                doc.document.write(htmlContent);
                doc.document.close();
                doc.focus();
                doc.print();
                doc.close();

                return deferred.promise;
            };
            var print = function (templateUrl, data) {
                $rootScope.isBeingPrinted = true;
                $http.get(templateUrl).then(function (templateData) {
                    var template = templateData.data;
                    var printScope = $rootScope.$new();
                    angular.extend(printScope, data);
                    var element = $compile($('<div>' + template + '</div>'))(printScope);
                    var renderAndPrintPromise = $q.defer();
                    var waitForRenderAndPrint = function () {
                        if (printScope.$$phase || $http.pendingRequests.length) {
                            $timeout(waitForRenderAndPrint, 1000);
                        } else {
                    		printHtml(element.html()).then(function () {
                                $rootScope.isBeingPrinted = false;
                                renderAndPrintPromise.resolve();
                            });
                            printScope.$destroy();
                        }
                        return renderAndPrintPromise.promise;
                    };
                    waitForRenderAndPrint();
                });
            };
            return {
                print: print,
            };
        }]);