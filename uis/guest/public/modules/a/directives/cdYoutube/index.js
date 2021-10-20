angular.module(module.name).directive(current.name, ['$sce', function(sce) {
    return {
        restrict: 'E',
        scope: {
            code: '='
        },
        replace: true,
        template: '<iframe class="iframe-video" src="{{url}}" frameborder="0" allowfullscreen></iframe>',

        link: function(scope) {
            scope.$watch('code', function(code) {
                if (code)
                    scope.url = sce.trustAsResourceUrl("http://www.youtube.com/embed/" + code);
            });
        }
    };
}]);
