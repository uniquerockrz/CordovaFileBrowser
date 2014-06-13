var cfb = angular.module("CordovaFileBrowser", ['ngRoute']);

cfb.run(function(FileService){
	// Wait for Cordova to load
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
    	// load the filesystem
		window.resolveLocalFileSystemURL('cdvfile://localhost/root/', FileService.init, fail);
    }

    function fail(fail){
    	console.log("fail");
    }

});

cfb.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'partials/splash.html',
			controller: 'SplashController'
		})
		.when('/browser', {
			templateUrl: 'partials/browser.html',
			controller: 'FileBrowserController'
		})
	}
]);

cfb.factory("FileService", function($q){
	var directoryEntryObj;
	var directoryReaderObj;
	
	var fail = function(){
		console.log("Error");
	};

	return {
		init: function(fs){
			directoryEntryObj = fs;
			console.log(JSON.stringify(directoryEntryObj));
			console.log("filesystem is ready");
		},
		readCurrentDir: function(){
			var deferred = $q.defer();
			console.log("reading directories");
			directoryReaderObj = directoryEntryObj.createReader();
			directoryReaderObj.readEntries(
				function(entries){
					deferred.resolve(entries);
				},
				function(){
					deferred.reject("Error");
				}
			);
			return deferred.promise;
		}
	}
});

cfb.controller('SplashController', function(){
	// Wait for Cordova to load
    document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    function onDeviceReady() {
        setTimeout(function(){
        	location.href = "#/browser";
        }, 1000);
    }
});

cfb.controller('FileBrowserController', function($scope, FileService){
	FileService.readCurrentDir()
		.then(function(files){
			$scope.NoFiles = files.length;
			$scope.files = files;
		},
		function(){
			console.log("Error");
		}
	);
});
