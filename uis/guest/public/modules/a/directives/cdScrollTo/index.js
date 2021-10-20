angular.module(module.name).directive(current.name, [function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			element.click(function(){
				var selector = attrs[current.name];
			    if (selector)
			        angular.element('html, body').animate({
				        scrollTop: angular.element(selector).offset().top
				    }, 200);
			});
		}
	};
}]);