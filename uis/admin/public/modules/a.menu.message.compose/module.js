angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: '/compose?message_id',
				controller: module.name + '.c.compose',
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					message: ['Message', '$stateParams', function(Message, stateParams){
						return Message.getReceivedById({ _id: stateParams.message_id }).$promise;
					}]
				}
			});
	}]);