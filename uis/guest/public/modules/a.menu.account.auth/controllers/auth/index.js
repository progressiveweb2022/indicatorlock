angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'User',
    'stateHelper',

    function(scope, state, User, stateHelper) {

        scope.returnUrl = state.params.returnUrl || '/';
        scope.registerData = {
            lastname: '',
            firstname: ''
        };
        scope.loginData = {
            email: '',
            password: ''
        };
        scope.login = function () {
            User.localauth(scope.loginData, goToReturnUrl);
        };
        scope.register = function() {
            User.register(scope.registerData, goToReturnUrl);
        };

        function goToReturnUrl() {
            var returnstatedata = stateHelper.resolveFromUrl(scope.returnUrl);
            state.go(returnstatedata.state.name, returnstatedata.params, {
                reload: true,
                location: 'replace'
            });
        }
    }
]);
