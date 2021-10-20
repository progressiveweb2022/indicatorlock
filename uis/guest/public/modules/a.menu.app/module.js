angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: 'app',
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					app: ['App', function(App){
						return App.getOne().$promise;
					}]
				},
				controller: ['$scope', 'app', function(scope, app){
					scope.app = app;
				}]
			});
	}]);