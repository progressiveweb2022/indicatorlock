angular.module(module.name).directive(current.name, [
	function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				scope.$watch(attrs[current.name], function (html) {
					element.html(html);
				});
			}
		};
	}
]);