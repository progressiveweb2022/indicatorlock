angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: '/modify?_id',
				templateUrl: module.path + '/views/layout.html',
				controller: module.name + '.c.modify',
				resolve: {
					faq: ['$stateParams', 'Faq', function(stateParams, Faq){
						return stateParams._id ? Faq.getById({ _id: stateParams._id }).$promise : new Faq();
					}]
				}
			});
	}]);