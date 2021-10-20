angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider.state(module.name, {
            url: '',
            templateUrl: module.path + '/views/layout.html',
            controller: module.name + '.c.list',
            resolve: {
                productsData: ['Product', function(Product) {
                    return Product.getFiltered({
                        select: ''
                    }).$promise;
                }],
                setting: ['Setting', function(Setting) {
                    return Setting.getOne().$promise;
                }]
            }
        });
    }]);
