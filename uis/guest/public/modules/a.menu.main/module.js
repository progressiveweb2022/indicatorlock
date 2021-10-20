angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider.state(module.name, {
            url: '', // Main
            templateUrl: module.path + '/views/layout.html',
            resolve: {
                slides: ['Slide', function(Slide) {
                    return Slide.filter({
                        sort: {
                            createdAt: -1
                        },
                        query: {
                            'active.from': {
                                'textbox-date-lt': 'today'
                            },
                            'active.until': {
                                'textbox-date-gte': 'today'
                            }
                        }
                    }).$promise.then(function(result) {
                        return result.records;
                    });
                }],
                productsData: ['Product', function (Product) {
                    return Product.getAll().$promise;
                }]
            },
            controller: ['$rootScope', '$scope', 'slides', 'productsData', function(rootScope, scope, slides, productsData) {
                rootScope.isPreMenu = true;
                scope.slides = slides;
                scope.products = productsData;
            }]
        });
    }]);
