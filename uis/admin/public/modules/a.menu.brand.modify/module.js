angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: '/modify?brand_id',
            templateUrl: module.path + '/views/layout.html',
            controller: module.name + '.c.modify',
            resolve: {
                brand: ['$stateParams', 'Brand', function (stateParams, Brand) {
                    return stateParams.brand_id ? Brand.getById({
                        _id: stateParams.brand_id
                    }).$promise : new Brand();
                }]
            }
        });
    }]);
