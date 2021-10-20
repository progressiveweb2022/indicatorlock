angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'brandsData',
    'Brand',

    function (scope, state, brandsData, Brand) {
        scope.brands = brandsData.records;
        scope.total = brandsData.total;

        scope.removeRecord = function (recordId) {
            alert('Forbidden!'); return;
            if (confirm('Are you sure you want to delete?')) {
                Brand.remove({ _id: recordId }, function () {
                    state.reload();
                });
            }
        };
    }
]);