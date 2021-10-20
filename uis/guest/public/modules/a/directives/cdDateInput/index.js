angular.module(module.name).directive(current.name, ['dateFilter', function(dateFilter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        
        link: function(scope, element, attrs, ngModel) {
            ngModel.$formatters.unshift(function (modelValue) {
                return dateFilter(modelValue, 'yyyy-MM-dd');
            });

            ngModel.$parsers.unshift(function(viewValue) {
                return new Date(viewValue);
            });
        }
    }
}]);
