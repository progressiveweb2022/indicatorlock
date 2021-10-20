angular
	.module(module.name)
	.directive(current.name, [
		function(){
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function(scope, element, attrs, ngModel){
					element.on('keypress', function(evt) {
						var charCode = (evt.which) ? evt.which : event.keyCode;
						return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 45);
					});
				}
			};
		}
	]);