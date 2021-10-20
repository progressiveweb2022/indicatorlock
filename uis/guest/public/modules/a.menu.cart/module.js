angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider.state(module.name, {
            url: 'cart',
            template: '<div ui-view></div>',
            abstract: true,
            resolve: {
                currentUser: ['User', function(User) {
                    return User.getCurrentUser().$promise;
                }]
            },
            controller: ['$rootScope', '$scope', 'currentUser', function(rootScope, scope, currentUser) {
                rootScope.currentUser = currentUser;
            }]
        });
    }]);
