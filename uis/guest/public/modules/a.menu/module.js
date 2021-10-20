angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider.state(module.name, {
            url: '/',
            templateUrl: module.path + '/views/layout.html',
            abstract: true,
            resolve: {
                global: ['Global', function(Global) {
                    return Global.getOne().$promise;
                }],
                cartSummary: ['Cart', function(Cart) {
                    return Cart.getCartSummary().$promise;
                }],
                currentUser: ['User', function(User) {
                    return User.getCurrentUser().$promise.then(function (u) { return u; }, function () { return null });
                }]
            },
            controller: ['$rootScope', '$scope', 'currentUser', 'global', '$cookieStore', 'cartSummary', function(rootScope, scope, currentUser, global, cookieStore, cartSummary) {
                rootScope.user = currentUser;
                rootScope.globalPG = global;
                rootScope.isLoading = true;
                rootScope.isPreMenu = false;
                scope.cartSummary = cartSummary;
                scope.model = {
                    search: ''
                };

                scope.subscribe = {
                    show: cookieStore.get('subscribe')
                }
                scope.menuDown = [{
                    state: ".main",
                    caption: "Home"
                }, {
                    state: ".product.out.filter.list",
                    caption: "Online Store"
                }, {
                    state: ".sheet.list",
                    caption: "Cut Sheet"
                }, {
                    state: ".video.list",
                    caption: "Installation Video"
                }, {
                    state: ".app",
                    caption: "Application"
                }, {
                    state: ".faq",
                    caption: "FAQ"
                }, {
                    state: ".contact",
                    caption: "Contact Us"
                }]
            }]
        });
    }]);
