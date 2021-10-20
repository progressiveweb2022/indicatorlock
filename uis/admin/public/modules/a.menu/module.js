angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: '/',
				templateUrl: module.path + '/views/layout.html',
				controller: module.name + '.c.menu',
	            abstract: true,
	            resolve: {
	                currentUser: ['User', function (User) {
	                    return User.getCurrentUser().$promise;
	                }]
	            }
			});
		}]);