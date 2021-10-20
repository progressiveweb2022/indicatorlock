angular.module(module.name).directive(current.name, [function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			scope.$watch(attrs[current.name], function(value) {
			    if (value)
			        $('html, body').animate({
				        scrollTop: element.offset().top
				    }, 200);
			});
		}
	};
}]);