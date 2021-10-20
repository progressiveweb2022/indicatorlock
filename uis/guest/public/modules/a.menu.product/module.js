angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: 'product',
            template: '<div ui-view></div>',
            abstract: true
        });
    }]);
