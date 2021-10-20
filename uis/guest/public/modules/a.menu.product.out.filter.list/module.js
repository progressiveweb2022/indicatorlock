angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: '/list?page?length',
            templateUrl: module.path + '/views/layout.html',
            controller: module.name + '.c.list',
            resolve: {
                productsData: [
                    '$stateParams', 'Product',
                    function (stateParams, Product) {
                        return Product.getFiltered({
                            select: '-description',
                            sort: '-createdAt',
                            priceFrom: stateParams.priceFrom,
                            priceTo: stateParams.priceTo,
                            category_id: stateParams.category_id
                        }).$promise;
                    }
                ]
            }
        });
    }]);
