angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'productsData',
    'Product',
    'setting',

    function(scope, state, productsData, Product, setting) {
        scope.products = productsData.records;
        scope.total = productsData.total;
        scope.search = "";
        scope.setting = setting;
        scope.onChecked = function() {
            scope.setting.$save(function(result) {
                var emailResult = result.emailBulk ? 'enabled' : 'disabled';
                alert('Email delivery ' + emailResult);
            });
        };
        scope.removeRecord = function(recordId) {
            if (confirm('Are you sure you want to delete?')) {
                Product.remove({
                    _id: recordId
                }, function() {
                    state.reload();
                });
            }
        };
    }
]);
