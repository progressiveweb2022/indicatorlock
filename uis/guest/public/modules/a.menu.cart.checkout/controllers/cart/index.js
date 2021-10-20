angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'cartItems',
    'Order',
    'Cart',

    function (scope, state, cartItems, Order, Cart) {
        scope.cartItems = cartItems;
        scope.getTotalPrice = function () {
            scope.cartItems.reduce(function (p, n) {
                return p + n.product.price * n.quantity;
            }, 0);
        };

        scope.checkout = function () {
            if (scope.paymentMethod === 'Credit Card') {

            } else if (scope.paymentMethod === 'PayPal') {
                Cart.checkoutPayPal(function (result) {
                    window.location.href = result.redirect;
                });
            }
        };

        scope.removeItem = function (item) {
            if (confirm('Are you sure you want to remove?')) {
                Cart.removeItem({
                    item_id: item._id
                }, function () {
                    state.reload();
                });
            }
        };
    }
]);
