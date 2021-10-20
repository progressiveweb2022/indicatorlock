angular.module(module.name).directive(current.name, ['$filter', '$injector', '$q', function(filter, injector, q){

	return {
		restrict: 'E',
		templateUrl: current.path + '/index.html',
		scope: {
			columns: '=columns',
			params: '=params',
			callback: '=callback',
			buttons: '=buttons'
		},

		link: function(scope, element, attrs){
			scope.pages = function(){
				var total = scope.result ? scope.result.total : 0;
				var pages = Math.ceil(total / scope.params.length);

				var ps = [];
				if (pages)
					for (var p = 1; p <= pages; p++)
						ps.push(p);
				return ps;
			};

			scope.toPage = function(page){
				scope.params.offset = (page - 1) * scope.params.length;
				scope.initData();
			};

			scope.initData = function(){
				scope.callback(scope.params).then(function(result){
					scope.result = result;
				});
			};

			scope.startFilter = function(){
				scope.params.offset = 0;
				scope.initData();
			};

			scope.resetFilter = function(){
				scope.params.query = {};
				scope.initData();
			};

			scope.getCaption = function(column, data){
                var value = utils.getProp(data, column.name);
                switch(column.type){
                    case 'textbox-like':
                    case 'textbox-exact':
                    case 'textbox-id':
                    case 'html':
                        return value;
                        break;
                    case 'dropdown':
                        var option = utils.findOne(column.options, { value: value });
                        return option ? option.caption : value;
                        break;
                    case 'textbox-date':
                        return filter('date')(value, 'dd/MM/yyyy');
                        break;
                }
            };

			scope.sortBy = function(column){
				var sort = {};
				sort[column.name] = scope.params.sort && scope.params.sort[column.name] ? -scope.params.sort[column.name] : 1;
				scope.params.sort = sort;
				scope.initData();
			};

			scope.columns.forEach(function(column){
				for(var dn in column.resolve){
					var dv = column.resolve[dn],
						pd = injector.invoke(dv);
					
					q.when(pd).then(function(result){
						column[dn] = result;
					});
				}
			});

			scope.$watch('params.length', scope.initData);
		}
	};

}]);