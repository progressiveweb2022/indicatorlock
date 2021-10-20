angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider){
        stateProvider.state(module.name, {
            url: 'product/modify?product_id',
            templateUrl: module.path + '/views/layout.html',
            controller: module.name + '.c.modify',
            resolve: {
                brands: ['Brand', function (Brand) {
                    return Brand.getAll({
                        select: ''
                    }).$promise;
                }],

                categories: ['Category', function (Category) {
                    return Category.getAll({
                        select: '',
                        parent_id: 'none'
                    }).$promise;
                }],

                product: ['$stateParams', 'Product', function (stateParams, Product) {
                    return stateParams.product_id ? Product.getById({
                        _id: stateParams.product_id
                    }).$promise : new Product({
                        images: []
                    });
                }]
            }
        });
    }]);