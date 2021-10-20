angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: '/view',
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					about: ['About', function(About){
						return About.getOne().$promise;
					}]
				},
				controller: ['$rootScope', '$scope', 'about', function(rootScope, scope, about){
					rootScope.isPreMenu = false;
					scope.about = about;
				}]
			});
	}]);