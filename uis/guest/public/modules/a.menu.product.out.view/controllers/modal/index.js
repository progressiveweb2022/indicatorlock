angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$modalInstance',
    'url',

    function(scope, modalInstance, url) {
        scope.url = url;
        scope.cancel = function() {
            modalInstance.dismiss('cancel');
        };
    }
]);
