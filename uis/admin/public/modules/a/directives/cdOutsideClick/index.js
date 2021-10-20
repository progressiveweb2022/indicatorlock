angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.click(function(e){
                var target = angular.element(e.target);
            });
        }
    }
}]);
