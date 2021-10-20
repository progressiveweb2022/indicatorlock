angular.module(module.name).directive(current.name, ['dateFilter', function(dateFilter) {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            element.focus(function() {
                element.parent(".input-box").css("width", "100%");
            });
            element.blur(function() {
                element.parent(".input-box").css("width", "200px");
            });
        }
    }
}]);
