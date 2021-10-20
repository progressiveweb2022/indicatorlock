angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider
            .state(module.name, {
                url: 'account',
                templateUrl: module.path + '/views/layout.html',
                abstract: true,
            });
    }]);
