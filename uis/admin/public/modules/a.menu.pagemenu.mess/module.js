angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: 'mess',
				templateUrl: module.path + '/views/layout.html',
				controller: module.name + '.c.mess',
				resolve: {
					sumMess: ['Message', function(Message){
						return Message.getSumMess().$promise;
					}]
				},
				abstract: false
			});
	}]);