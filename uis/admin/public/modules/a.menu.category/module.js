angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: 'category',
            template: '<div ui-view></div>',
            abstract: true
        });
    }]);
