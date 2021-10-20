angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: 'faq',
				template: '<div ui-view></div>',
				abstract: true
			});
	}]);