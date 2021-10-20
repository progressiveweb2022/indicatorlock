angular.module(module.name).filter(current.name, ['$sce', function(sce){
	return function(html){
		return sce.trustAsHtml(html);
	};
}]);