angular.module(module.name).controller(module.name + '.c.' + current.name, [
	'$scope',
	'$state',
	'Slide',

	function(scope, state, Slide){
		scope.callback = function(params){
			return Slide.filter(params).$promise;
		};

		scope.columns = [{
			name: 'name',
			caption: 'Name',
			type: 'textbox-like'
		}];

		scope.buttons = [{
			caption: 'Edit',
			classname: 'btn-primary',
			action: function(record){
				state.go('^.modify', { _id: record._id });
			}
		}, {
			caption: 'Delete',
			classname: 'btn-danger',
			action: function(record){
				if(confirm('sure?'))
					Slide.remove(record, function(){
						state.go(state.current, state.params, { reload: true });
					});
			}
		}];

		scope.params = {
			offset: 0,
			length: 20,
			sort: { createdAt: -1 },
			query: {}
		};
	}
]);