angular.module(module.name).directive(current.name, ['$compile', 'googleMapSrvc', function(compile, googleMapSrvc) {
    return {
        restrict: 'E',
        templateUrl: current.path + '/index.html',
        scope: {
            options: '=options'
        },
        controller: ['$scope', function(scope) {

        }],
        link: function(scope, element, attrs) {
            setTimeout(function() {
                element.find('.slider-for').slick({
                    autoplay: true,
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: false,
                    asNavFor: '.slider-nav'
                });
                element.find('.slider-nav').slick({
                    autoplay: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    asNavFor: '.slider-for',
                    dots: true,
                    centerMode: true,
                    focusOnSelect: true
                });
                setTimeout(function() {

                }, 100);

            });
        }
    };
}]);
