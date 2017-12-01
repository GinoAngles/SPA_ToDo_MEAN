var app = angular.module('angularTodo', []);

app.controller('mainController', function($scope, $http) {
	//vaciamos el input cuando se carga la pagina.
	$scope.formData = {};
	//realizamos una peticion de GET para obtener los datos de la BBDD.
	$http({
	  method: 'GET',
	  url: '/api/todos'
	}).then(function successCallback(response) {
	    // this callback will be called asynchronously
	    // when the response is available
		$scope.todos = response.data;
		console.log(response.data)
	  }, function errorCallback(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
		console.log('Error durante la carga inicial de la bd: ' + response);
	  });

	// Cuando se añade un nuevo TODO, manda el texto a la API del server.js
	$scope.createTodo = function(){
		$http({
		  method: 'POST',
		  url: '/api/todos',
		  data: $scope.formData
		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
				$scope.formData = {};
				$scope.todos = response.data;
				console.log(response);
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			console.log('Error durante la creación de un ToDo: ' + response);
		  });

	};

	// Borra un TODO despues de checkearlo como acabado.
	$scope.deleteTodo = function(id) {
		$http({
		  method: 'DELETE',
		  url: '/api/todos/' + id
		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
				$scope.todos = response.data;
				console.log(response);
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			console.log('Error durante el borrado de un ToDo: ' + response);
		  });
	};

});