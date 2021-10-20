angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'product',
    'brands',
    'categories',
    'Category',

    function(scope, state, product, brands, categories, Category) {
        scope.product = product;
        scope.brands = brands;
        scope.categories = categories;
        scope.product.brand = brands[0]._id;
        scope.summOld = Number(product.price) + Number(product.discount);

        scope.changeSmm = function() {
            scope.summOld = Number(product.price) + Number(product.discount);
        };

        scope.$watch('product.category', function(category_id) {
            if (category_id) {
                Category.getAll({
                    parent_id: category_id
                }, function(subCategories) {
                    scope.subCategories = subCategories;
                });
            } else {
                scope.product.subCategory = null;
                scope.subCategories = [];
            }
        });

        scope.refresh = function() {
            Category.getAllCN(function(records) {
                scope.categories = records;
            });
        };
        
        scope.moveImage = function(image, images, diff) {
            var ii = images.indexOf(image);
            images.splice(ii + diff, 0, images.splice(ii, 1)[0]);
        };

        scope.removeImage = function(image, images) {
            images.splice(images.indexOf(image), 1);
        };

        scope.save = function() {
            scope.product.$save(function() {
                state.go('^.list', state.params);
            });
        };
    }
]);
