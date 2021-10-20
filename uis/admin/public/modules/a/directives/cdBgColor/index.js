angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.HexRGBGen = function () {
                var arrHexSpec = new Array("c", "d", "e", "f");
                var color = "#";
                for (var i = 0; i < 6; i++) {
                    color += arrHexSpec[Math.floor(Math.random() * arrHexSpec.length)];
                }
                return color;
            }
            element.css( "background-color", scope.HexRGBGen() );
        }
    }
}]);
