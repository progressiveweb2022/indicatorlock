angular.module(module.name).filter(current.name, [function(){
	return function(items, data){
		if(!items) return [];
		if(!data.letter) return items;
		
		return items.filter(function(item){
			var v = utils.getProp(item, data.prop);
			return v.indexOf(data.letter) === 0;
		});
	};
}]);