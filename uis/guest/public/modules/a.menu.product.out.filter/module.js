angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider.state(module.name, {
            url: '?priceFrom?priceTo?category_id',
            //url: '?priceFrom?priceTo?category_id?subCategory_id?brand_id',
            templateUrl: module.path + '/views/layout.html',
            controller: module.name + '.c.filter',
            abstract: true,
            resolve: {
                categories: ['Category', function(Category) {
                    return Category.getAll({
                        select: '',
                        parent_id: 'none'
                    }).$promise;
                }],
                category: ['$stateParams', 'Category', function(stateParams, Category) {
                    return Category.getById({
                        _id: stateParams.category_id
                    }).$promise;
                }]
            }
        });
    }]);
