angular.module(module.name).directive(current.name, [
	'$sce',
	function (sce) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				scope.$watch(attrs[current.name], function (html) {
					var ts = sce.trustAsHtml(html);
					element.html(ts);
				});
			}
		};
	}
]);