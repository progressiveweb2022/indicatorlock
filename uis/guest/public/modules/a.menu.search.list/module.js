angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider.state(module.name, {
            url: '/list?findText?page?length',
            templateUrl: module.path + '/views/layout.html',
            resolve: {
                findText: ['$stateParams', function(stateParams) {
                    return stateParams.findText;
                }],
                itemsPerPage: ['$stateParams', function(stateParams) {
                    return +stateParams.length || 6;
                }],
                currentPage: ['$stateParams', function(stateParams) {
                    return +stateParams.page || 1;
                }],
                pageOffset: ['currentPage', 'itemsPerPage', function(currentPage, itemsPerPage) {
                    return (currentPage - 1) * itemsPerPage;
                }],
                productsData: [
                    '$stateParams', 'Product', 'itemsPerPage', 'pageOffset', 'findText',
                    function(stateParams, Product, itemsPerPage, pageOffset, findText) {
                        return Product.getSearch({
                            offset: pageOffset,
                            length: itemsPerPage,
                            sort: '-createdAt',
                            findText: findText
                        }).$promise;
                    }
                ]
            },
            controller: [
                '$stateParams',
                '$state',
                '$rootScope',
                '$scope',
                'findText',
                'productsData',
                'currentPage',
                'pageOffset',
                'itemsPerPage',
                function(stateParams, state, rootScope, scope, findText, productsData, currentPage, pageOffset, itemsPerPage) {
                    rootScope.isPreMenu = false;
                    rootScope.isLoading = true;
                    scope.total = productsData.total;
                    scope.offset = pageOffset;
                    scope.currentPage = currentPage
                    scope.itemsPerPage = itemsPerPage;
                    scope.model.search = findText;
                    scope.products = productsData.records;
                    scope.moveToPage = function() {
                        state.go(state.current, {
                            page: scope.currentPage
                        });
                    };
                }
            ]

        });
    }]);
