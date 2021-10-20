angular.module(module.name).controller(module.name + '.c.' + current.name, [
	'$scope',
	'$state',
	'slide',

	function(scope, state, slide){
		scope.slide = slide;
		scope.redirectto = '^.list';

		scope.save = function(){
			scope.slide.$save(function(slide){
				var params = utils.merge(state.params, { _id: slide._id }, [Array]);
				state.go(scope.redirectto, params, { reload: true });
			});
		};
	}
]);