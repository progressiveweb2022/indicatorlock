angular.module(module.name).directive(current.name, ['$compile', function(compile) {
    return {
		restrict: 'A',
		require: 'ngModel',
		scope: {
			options: '=cdUploader'
		},
		link: function (scope, elem, attrs, ngModel) {
			function wrap(fns){
				return function(){
					var args = arguments;
					var self = this;
					scope.$apply(function(){
						fns.forEach(function(fn){
							(fn || angular.noop).apply(self, args);
						});
					});
				};
			}

			var uploader = new AjaxUpload(elem.get(0), angular.extend({}, scope.options, {
				onChange: wrap([scope.options.onChange]),
				onSubmit: wrap([scope.options.onSubmit]),
				onComplete: wrap([scope.options.onComplete, function(name, src){
					ngModel.$setViewValue(src);
				}])
			}));

			scope.$watch('options.enabled', function(val){
				uploader[val? 'enable' : 'disable'](val);
			});

			// remove file inputs on scope destroy
			scope.$on('$destroy', function() {
				if(uploader._input)
	    			uploader._input.parentNode.parentNode.removeChild(uploader._input.parentNode);
	    	});
		}
	};
}]);