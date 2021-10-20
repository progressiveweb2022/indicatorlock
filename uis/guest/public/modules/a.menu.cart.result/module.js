angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: '/result',
            templateUrl: module.path + '/views/layout.html',
            controller: module.name + '.c.result',
            abstract: true
        });
    }]);
