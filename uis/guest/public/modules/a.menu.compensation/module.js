angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: 'compensation',
            templateUrl: module.path + '/views/layout.html'
        });
    }]);
