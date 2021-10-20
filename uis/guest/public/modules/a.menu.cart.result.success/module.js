angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function (stateProvider) {
        stateProvider.state(module.name, {
            url: '/success?status?transactioncode?date?amount?currency?ordercode?paymethod?customdata?testmode?check',
            resolve: {
                success: ['$stateParams', '$state', 'Order', function (stateParams, state, Order) {
                    return Order.success(stateParams).$promise.then(function () {
                        alert('Purchase was successful');
                        state.go('a.menu.product.filter.list', {
                            reload: true
                        });
                    });
                }]
            }
        });
    }]);
