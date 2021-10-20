angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: '',
				abstract: true,
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					pages: ['Page', function(Page){
						return Page.getAll().$promise;
					}]
				},
				controller: ['$scope', 'pages', function(scope, pages){
					scope.pages = pages;
				}]
			});
	}]);