angular.module(module.name).directive(current.name, [
	'$state',
	'facebookSrvc',
	'stateHelper',
	function(state, facebookSrvc, stateHelper){
		return {
			restrict: 'E',
			replace: true,
			templateUrl: current.path + '/index.html',
			scope: {
				pageurl: '='
			},
			link: function(scope, element, attrs){
				var currentstate = stateHelper.getStateContext(element) || state.current;
				scope.href = scope.pageurl || state.href(currentstate, state.params);
				facebookSrvc.init().then(function(){
					FB.XFBML.parse(element.parent().get(0));
				});
			}
		};
	}
]);