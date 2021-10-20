angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            var myself = false;
            scope.$watchCollection(attrs[current.name], function(currents){
                var items = scope.$eval(attrs[current.name + 'Full']);
                var comparer = scope.$eval(attrs[current.name + 'Comparer']);
                if(currents && items && items.length)
                    scope.$eval(attrs.ngModel + '=' + items.every(function(item){
                        return utils.contains(currents, item, comparer);
                    }));
            });

            scope.$watchCollection(attrs[current.name + 'Full'], function(items){
                var currents = scope.$eval(attrs[current.name]);
                var comparer = scope.$eval(attrs[current.name + 'Comparer']);
                if(currents && items && items.length)
                    scope.$eval(attrs.ngModel + '=' + items.every(function(item){
                        return utils.contains(currents, item, comparer);
                    }));
            });

            ngModel.$parsers.push(function(allchecked){
                var currents = scope.$eval(attrs[current.name]);
                var items = scope.$eval(attrs[current.name + 'Full']);
                var comparer = scope.$eval(attrs[current.name + 'Comparer']);

                if(myself)
                    myself = false;
                else {
                    if(allchecked)
                        items.forEach(function(item){
                            if(!utils.contains(currents, item, comparer))
                                currents.push(item);
                        });
                    else
                        currents.splice(0, currents.length);
                }
                return allchecked;
            });
        }
    };
}]);