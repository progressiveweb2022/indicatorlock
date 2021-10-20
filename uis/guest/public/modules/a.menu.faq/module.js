angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: 'faq',
				controller: module.name + '.c.faq',
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					faqs: ['Faq', function(Faq){
						return Faq.filter({
							sort: {
								priority: -1
							}
						}).$promise.then(function(result){
							return result.records;
						});
					}]
				}
			});
	}]);