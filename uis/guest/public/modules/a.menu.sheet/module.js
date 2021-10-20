angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: 'sheet',
            templateUrl: module.path + '/views/layout.html',
            abstract: true
        });
    }]);