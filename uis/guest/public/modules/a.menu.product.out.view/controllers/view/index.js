angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'Product',
    'product',
    '$rootScope',
    '$modal',
    'Cart',
    '$log',

    function(scope, state, Product, product, rootScope, modal, Cart, log) {
        scope.product = product;
        scope.activeImage = product.images[0];
        rootScope.isPreMenu = false;

        scope.item = {
            quantity: 1,
            color: scope.product
        };

        scope.prevLink = Product.getCPage({
            category_id: scope.product.category.id,
            product_id: scope.product._id,
            reqv: "gt"
        });

        scope.nextLink = Product.getCPage({
            category_id: scope.product.category.id,
            product_id: scope.product._id,
            reqv: "lt"
        });

        scope.animationsEnabled = true;
        scope.open = function(url, size) {
            var modalInstance = modal.open({
                animation: scope.animationsEnabled,
                templateUrl: module.path + '/views/modal.html',
                controller: module.name + '.c.' + 'modal',
                size: size,
                resolve: {
                    url: function() {
                        return url;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                //...
            }, function() {
                log.info('Modal dismissed at: ' + new Date());
            });
        };

        scope.addToCart = function() {
            Cart.addToCart({
                color: scope.item.color.name,
                quantity: scope.item.quantity,
                product_id: scope.product._id
            }, function() {
                state.reload();
            });
        };
    }
]);
