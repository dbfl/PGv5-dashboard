/**
 * INSPINIA - Responsive Admin Theme
 *
 */
function config($translateProvider, $translatePartialLoaderProvider) {
	var langKey = 'en';
	var pathData = '../app/data/';
	if (window.location.toString().indexOf("localhost") !=-1) {
		pathData = '../app/data/';
	}
	
	$translateProvider.useStaticFilesLoader({
	  prefix: pathData + 'i18n/locale-',
	  suffix: '.json'
	});
		
    $translateProvider.preferredLanguage(langKey);
    
}

angular
    .module('inspinia')
    .config(config)
