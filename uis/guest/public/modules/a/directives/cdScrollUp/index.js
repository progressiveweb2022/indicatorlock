angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $(window).scroll(function() {
                if ($(this).scrollTop() > 100) {
                    element.fadeIn();
                } else {
                    element.fadeOut();
                }
            });
            element.on('click', function() {
                $("body").animate({
                    scrollTop: 0
                }, "slow");
            });
        }
    }
}]);
