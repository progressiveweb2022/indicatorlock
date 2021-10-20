angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider){
        stateProvider
            .state(module.name, {
                url: 'message',
                template: '<div ui-view></div>',
                abstract: true
            });
    }]);
