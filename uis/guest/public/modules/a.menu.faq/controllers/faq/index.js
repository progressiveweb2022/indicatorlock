angular.module(module.name).controller(module.name + '.c.' + current.name, [
	'$scope',
	'faqs',

	function(scope, faqs){
		scope.faqs = faqs;
	}
]);
