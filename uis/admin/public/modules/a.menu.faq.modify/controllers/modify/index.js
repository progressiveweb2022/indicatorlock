angular.module(module.name).controller(module.name + '.c.' + current.name, [
	'$scope',
	'$state',
	'faq',

	function(scope, state, faq){
		scope.faq = faq;
		scope.redirectto = '^.list';

		scope.save = function(){
			scope.faq.$save(function(faq){
				var params = utils.merge(state.params, { _id: faq._id }, [Array]);
				state.go(scope.redirectto, params, { reload: true });
			});
		};
	}
]);