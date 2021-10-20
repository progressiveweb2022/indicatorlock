angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: '/modify?category_id',
            templateUrl: module.path + '/views/layout.html',
            controller: module.name + '.c.modify',
            resolve: {
                category: ['$stateParams', 'Category', function (stateParams, Category) {
                    return stateParams.category_id ? Category.getById({
                        _id: stateParams.category_id
                    }).$promise : new Category();
                }],

                parentCategories: ['$stateParams', 'Category', function (stateParams, Category) {
                    var query = {
                        parent_id: 'none'
                    };

                    if (stateParams.category_id) {
                        query['_id:ne'] = stateParams.category_id;
                    }

                    return Category.getFiltered(query).$promise.then(function (result) {
                        return result.records;
                    });
                }]
            }
        });
    }]);
