angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        
        link: function(scope, element, attrs, ngModel) {
            scope.$watch(attrs.ngModel, validate);
            scope.$watch(attrs[current.name], validate);

            function validate() {
                var val1 = ngModel.$viewValue;
                var val2 = scope.$eval(attrs[current.name]);

                ngModel.$setValidity('equals', val1 === val2);
            }
        }
    }
}]);
