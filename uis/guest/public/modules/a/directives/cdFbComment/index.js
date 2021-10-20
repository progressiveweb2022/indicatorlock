angular.module(module.name).directive(current.name, [
    '$state',
    '$templateCache',
    '$q',
    '$http',
    '$compile',
    'facebookSrvc',
    '$location',
    'stateHelper',

    function (state, templateCache, q, http, compile, facebookSrvc, location, stateHelper) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div style="display: inline-block;"></div>',
            scope: {
                url: '@',
                pageurl: '='
            },
            link: function (scope, element, attrs) {
                scope.url = scope.url || 'http://mysite.com';
                var currentstate = stateHelper.getStateContext(element) || state.current;
                scope.href = scope.pageurl || scope.url + state.href(currentstate, state.params);

                var templatePromise = http
                    .get(current.path + '/index.html', { cache: templateCache })
                    .then(function(result){
                        return result.data;
                    });

                var fbInitPromise = facebookSrvc.init();

                q.all([templatePromise, fbInitPromise]).then(function (results) {
                    element.html(results[0]);
                    compile(element.contents())(scope);
                    setTimeout(function () {
                        FB.XFBML.parse(element.get(0));
                    }, 300);
                });
            }
        };
    }
]);
