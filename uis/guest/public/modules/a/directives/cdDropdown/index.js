angular.module(module.name).directive(current.name, [
	'User',
	function(User){
		return {
			restrict: 'E',
			templateUrl: current.path + '/index.html',
			replace: true,
			require: 'ngModel',
			scope: {
				options: '=',
				captionProp: '@',
				valueProp: '@',
				noValueCaption: '@',
				disabled: '=ngDisabled',
				comparer: '=',
				required: '=ngRequired'
			},

			link: function(scope, element, attrs, ngModel){
				function isNullOrUndefined(v){
					return v === undefined || v === null;
				}

				scope.getOptionValue = function(option){
					return scope.valueProp ? utils.getProp(option, scope.valueProp) : option;
				};

				scope.getOptionCaption = function(option){
					return scope.captionProp ? utils.getProp(option, scope.captionProp) : option;
				};

				scope.getSelectedCaption = function(){
					if(scope.options)
						for(var i = 0; i < scope.options.length; i++){
							var option = scope.options[i];
							var compare = scope.valueProp ? utils.getProp(option, scope.valueProp) : option;
							if(utils.equals(compare, ngModel.$modelValue, scope.comparer))
								return isNullOrUndefined(option) ? undefined : scope.getOptionCaption(option);
						}
					return scope.noValueCaption;
				};

				scope.select = function(option){
					var value = isNullOrUndefined(option) ? undefined : scope.getOptionValue(option);
					ngModel.$setViewValue(value);
				};
			}
		};
	}
]);