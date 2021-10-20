angular.module(module.name).filter(current.name, [function(){
	return function(items, separator){
		return items.join(separator);
	};
}]);