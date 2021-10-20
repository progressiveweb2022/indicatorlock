angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'category',
    'parentCategories',

    function (scope, state, category, parentCategories) {
        scope.category = category;
        scope.parentCategories = parentCategories;

        scope.save = function () {
            scope.category.$save(function () {
                state.go('^.list', state.params);
            });
        };
    }
]);
