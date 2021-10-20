angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'categoriesData',
    'Category',

    function (scope, state, categoriesData, Category) {
        scope.categories = categoriesData.records;
        scope.total = categoriesData.total;

        scope.removeRecord = function (recordId) {
            if (confirm('Are you sure you want to delete?')) {
                Category.remove({ _id: recordId }, function () {
                    state.reload();
                });
            }
        };
    }
]);