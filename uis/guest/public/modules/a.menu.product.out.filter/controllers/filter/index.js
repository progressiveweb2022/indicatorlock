angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$stateParams',
    'categories',
    'category',

    function (scope, stateParams, categories, category) {
        scope.query = {
            priceFrom: stateParams.priceFrom,
            priceTo: stateParams.priceTo
        };
        scope.targetGender = stateParams.targetGender;
        scope.category_id = stateParams.category_id;
        scope.categories = categories;
        scope.category = category;
        scope.catIns = stateParams.category_id ? category.name : 'All';
    }
]);