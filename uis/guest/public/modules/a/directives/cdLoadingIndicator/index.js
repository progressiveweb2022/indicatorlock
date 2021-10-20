angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: current.path + '/index.html',
        scope: {
            img: '@',
            status: '='
        },

        link: function(scope, element, attrs, ctrl) {
            scope.$on("loading:progress", function () {
                element.show();
            });

            scope.$on("loading:finish", function () {
                element.hide();
            });
        }
    };
}]);