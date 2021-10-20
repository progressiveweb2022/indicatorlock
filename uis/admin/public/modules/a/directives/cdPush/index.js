angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        
        link: function(scope, element, attr, ngModel) {
            ngModel.$parsers.push(function parser(item) {
                var existings = ngModel.$modelValue ? [].concat(ngModel.$modelValue) : [];
                if(existings.indexOf(item) === -1) {
                    existings.push(item);
                }
                return existings;
            });
        }
    };
}]);