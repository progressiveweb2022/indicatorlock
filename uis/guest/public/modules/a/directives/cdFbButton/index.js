angular.module(module.name).directive(current.name, [
    '$state',
    '$templateCache',
    '$q',
    '$http',
    '$compile',
    'facebookSrvc',
    'stateHelper',

    function (state, templateCache, q, http, compile, facebookSrvc, stateHelper) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div style="display: inline-block;"></div>',
            scope: {
                pageurl: '=',
                add: '=',
                type: '@'
            },
            link: function (scope, element, attrs) {
                var currentstate = stateHelper.getStateContext(element) || state.current;
                scope.href = scope.pageurl || state.href(currentstate, state.params);

                var templatePromise = http
                    .get(current.path + '/' + scope.type + '.html', { cache: templateCache })
                    .then(function(result){
                        return result.data;
                    });

                var fbInitPromise = facebookSrvc.init();

                q.all([templatePromise, fbInitPromise]).then(function (results) {
                    element.html(results[0]);
                    compile(element.contents())(scope);
                    setTimeout(function () {
                        FB.XFBML.parse(element.get(0));
                    }, 1000);
                });
            }
        };
    }
]);
