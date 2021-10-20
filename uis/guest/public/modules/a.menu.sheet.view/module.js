angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider
            .state(module.name, {
                url: '/view/:sheet_id',
                templateUrl: module.path + '/views/layout.html',
                resolve: {
                    sheet: ['$stateParams', 'Sheet', function(stateParams, Sheet) {
                        return Sheet.getOne().$promise.then(function(result) {
                            return utils.findOne(result.colls, {
                                _id: stateParams.sheet_id
                            });
                        });
                    }]
                },
                controller: ['$scope', 'sheet', function(scope, sheet) {
                    scope.sheet = sheet;
                    scope.imgType = sheet.url.substr(sheet.url.length - 3, 3);
                }]
            });
    }]);
