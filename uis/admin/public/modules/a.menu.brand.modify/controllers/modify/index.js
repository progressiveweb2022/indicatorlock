angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'brand',

    function (scope, state, brand) {
        scope.brand = brand;

        scope.save = function () {
            scope.brand.$save(function () {
                state.go('^.list', state.params);
            });
        };
    }
]);
