angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: '/list',
            templateUrl: module.path + '/views/layout.html',
            controller: module.name + '.c.list',
            resolve: {
                categoriesData: ['Category', function (Category) {
                    return Category.getFiltered({
                        select: '',
                        populate: 'parent'
                    }).$promise;
                }]
            }
        });
    }]);
