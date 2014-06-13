var test = angular.module("test", []);

test.service("Jokes", function($q){
	this.get = function(){
		var deferred = $q.defer();
		var request = new XMLHttpRequest();
		request.open('GET', 'http://api.icndb.com/jokes/random');
		request.onload = function() {
	    	if (request.status == 200) {
	        	deferred.resolve(request.response); // we got data here, so resolve the Promise
	      	} else {
	      		deferred.reject(request.statusText);
	        	
	      	}
	    };
		 
	    request.onerror = function() {
	    	deferred.reject('Error fetching data.');
	    };
		 
		request.send(); //send the request

		return deferred.promise;
	};
});


test.controller("TestController", function($scope, Jokes){
	Jokes.get()
		.then(function(response){
			$scope.name = response;
			console.log(response);
		},
		function(error){
			console.log(error);
		}
	);
});