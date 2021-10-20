angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$rootScope',
    '$scope',
    '$state',
    'productsData',
    'Reddit',
    'Category',
    '$stateParams',

    function(rootScope, scope, state, productsData, Reddit, Category, stateParams) {
        scope.categoryId = stateParams.category_id;
        if (scope.categoryId) {
            scope.reddit = {
                items: []
            }
            scope.reddit.items.push(Category.getById({ _id: scope.category_id }));
        }
        else {
            scope.reddit = new Reddit(Category);
        }
        rootScope.isPreMenu = false;
        scope.products = productsData.records;
    }
]);
