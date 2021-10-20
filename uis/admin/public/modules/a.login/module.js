var app = angular
    .module(module.name, module.dependencies)
    .config([
        '$stateProvider',
        function(stateProvider) {
            stateProvider.state(module.name, {
                url: '/login?returnUrl',
                templateUrl: module.path + '/views/layout.html',
                controller: module.name + '.c.login'
            });
        }
    ]);