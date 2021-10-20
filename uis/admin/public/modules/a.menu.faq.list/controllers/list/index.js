angular.module(module.name).controller(module.name + '.c.' + current.name, [
	'$scope',
	'$state',
	'Faq',

	function(scope, state, Faq){
		scope.callback = function(params){
			return Faq.filter(params).$promise;
		};

		scope.columns = [{
			name: 'question.en',
			caption: 'Query',
			type: 'textbox-like'
		}];

		scope.buttons = [{
			caption: '<span class="glyphicon glyphicon-arrow-up"></span>',
			classname: 'btn-info',
			action: function(record){
				Faq.changePriority({ _id: record._id, diff: 1 }, function(){
					state.go(state.current, state.params, { reload: true });
				});
			}
		}, {
			caption: '<span class="glyphicon glyphicon-arrow-down"></span>',
			classname: 'btn-info',
			action: function(record){
				Faq.changePriority({ _id: record._id, diff: -1 }, function(){
					state.go(state.current, state.params, { reload: true });
				});
			}
		}, {
			caption: 'Edit',
			classname: 'btn-primary',
			action: function(record){
				state.go('^.modify', { _id: record._id });
			}
		}, {
			caption: 'Delete',
			classname: 'btn-danger',
			action: function(record){
				if(confirm('Are you sure you want to do this?'))
					Faq.remove(record, function(){
						state.go(state.current, state.params, { reload: true });
					});
			}
		}];

		scope.params = {
			offset: 0,
			length: 20,
			sort: { priority: -1 },
			query: {}
		};
	}
]);