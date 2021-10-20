angular.module(module.name).filter(current.name, [function(){
	return function(items, data){
		if(!items) return [];
		if(!data.items) return items;
		return utils.except(items, data.items, data.query);
	};
}]);