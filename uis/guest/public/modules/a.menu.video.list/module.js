angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider
            .state(module.name, {
                url: '/list',
                templateUrl: module.path + '/views/layout.html',
                resolve: {
                    page: ['Videos', function(Videos) {
                        return Videos.filter({
							sort: {
								"videos.desc": -1
							}
                        }).$promise;
                    }]
                },
                controller: ['$rootScope', '$scope', 'page', function (rootScope, scope, page) {
                    rootScope.isPreMenu = false;
                    scope.page = page;
                }]
            });
    }]);
