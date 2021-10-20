angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: '/modify?_id',
				templateUrl: module.path + '/views/layout.html',
				controller: module.name + '.c.modify',
				resolve: {
					slide: ['$stateParams', 'Slide', function(stateParams, Slide){
						return stateParams._id ? Slide.getById({ _id: stateParams._id }).$promise : new Slide({ createdAt: new Date() });
					}]
				}
			});
	}]);