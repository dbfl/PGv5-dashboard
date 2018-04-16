/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    var inspinia = angular.module('inspinia', [
        'ui.router',                    // Routing
        'ui.bootstrap',                 // Bootstrap
        'oc.lazyLoad',                  // ocLazyLoad
        'LocalStorageModule',
        'pascalprecht.translate',       // Angular Translate
        'ngCookies',
        'daterangepicker',
        'datePicker',
        'cgNotify',
        "oitozero.ngSweetAlert",
        "ngIdle",
        'timer',
        'ngSanitize',
		'ngAnimate',
        'chart.js',
		'localytics.directives',
		'datatables','datatables.buttons','datatables.bootstrap'
    ])
})();