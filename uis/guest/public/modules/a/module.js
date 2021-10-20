var app = angular
    .module(module.name, [
        'ui.bootstrap',
        'angular-flexslider',
        'ui.router',
        'ngResource',
        'ngSanitize',
        'ngAnimate',
        'ngCookies',
        'angulartics',
        'angulartics.google.analytics',
        'infinite-scroll',
        'LocalStorageModule'
    ].concat(module.dependencies))
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$cookiesProvider',
        function(stateProvider, urlRouterProvider, locationProvider, cookiesProvider) {
            stateProvider.state(module.name, {
                url: '/:lang',
                template: '<div ui-view></div>',
                resolve: {
                    lang: ['$stateParams', function(stateParams) {
                        return stateParams.lang;
                    }]
                },
                abstract: true,
                controller: ['$rootScope', '$scope', 'lang', function(rootScope, scope, lang) {
                    rootScope.lang = lang || "en";
                }]
            });
            urlRouterProvider.otherwise("/en/err404");
            locationProvider.html5Mode(true).hashPrefix('!');
        }
    ])
    .run(['$rootScope', '$state', '$location', 'enums', 'api',
        function(rootScope, state, location, enums, api) {

            rootScope.enums = enums;
            rootScope.api = api;

            rootScope.$on('$stateChangeError', function(e, ns, np, cs, cp, res) {
                var targetAbsUrl = state.href(ns, np, {
                absolute: true
            });
            var hostWithPrefix = location.absUrl().substring(0, location.absUrl().lastIndexOf(location.url()))
                if (res.status === 401)
                    state.go('a.menu.account.auth', angular.extend(cp, {
                        returnUrl: targetAbsUrl.substring(hostWithPrefix.length)
                    }), {
                        reload: true
                    });
            });
        }
    ]);

jQuery.getJSON('./api.json', function(api) {
    for (var an in api)
        (function(name, params) {
            app.factory(name, ['$resource', function(resource) {
                var c = {};

                for (var m in params) {
                    c[m] = params[m];
                }

                return resource('/', {}, c);
            }]);
        })(an, api[an]);

    app.value('api', api);
    app.value('enums', enums);

    angular.bootstrap(document, [app.name]);
});
