angular
	.module(module.name)
	.directive(current.name, [
		'User',

		function(User){
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function(scope, element, attrs, ngModel){
					element.on('blur', function(){
						User.existsemail({ email: ngModel.$modelValue }, function(result){
							ngModel.$setValidity('exists', !result.exists);
						});
					});
				}
			};
		}
	]);