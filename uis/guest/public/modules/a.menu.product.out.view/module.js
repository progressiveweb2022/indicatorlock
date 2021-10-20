angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: '/view?product_id',
            templateUrl: module.path + '/views/layout.html',
            controller: module.name + '.c.view',
            resolve: {
                product: ['$stateParams', 'Product', function (stateParams, Product) {
                    return Product.getById({
                        _id: stateParams.product_id,
                        select: '',
                        populate: 'brand category subCategory'
                    }).$promise;
                }]
            }
        });
    }]);
