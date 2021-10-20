angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'User',
    'stateHelper',

    function (scope, state, User, stateHelper) {
        scope.returnUrl = state.params.returnUrl || '/';
        scope.model = {
            email: 'info@indicatorlock.com',
            password: '12312'
        };

        scope.login = function() {
            return User.authenticate(scope.model, function() {
                var returnstatedata = stateHelper.resolveFromUrl(scope.returnUrl);
                state.go(returnstatedata.state.name, returnstatedata.params, {
                    reload: true,
                    location: 'replace'
                });
            });
        };
    }
]);