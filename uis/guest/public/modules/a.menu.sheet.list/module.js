angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: '/list',
            templateUrl: module.path + '/views/layout.html',
            resolve: {
                sheet: ['Sheet', function(Sheet) {
                    return Sheet.getOne().$promise;
                }]
            },
            controller: ['$rootScope', '$scope', 'sheet', function(rootScope, scope, sheet) {
                rootScope.isPreMenu = false;
                scope.sheet = sheet;
                scope.isGrid = true;
                scope.switch = function(){
                    scope.isGrid = !scope.isGrid;
                }
            }]

        });
    }]);