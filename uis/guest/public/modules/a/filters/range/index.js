angular.module(module.name).filter(current.name, [function(){
	return function(items, data){
		if(!items) return [];
		
		return items.filter(function(item){
			var v = utils.getProp(item, data.prop);
			return v >= data.min && v < data.max;
		});
	};
}]);