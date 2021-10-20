angular.module(module.name).directive(current.name, [function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel){
			var emailregex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			ngModel.$parsers.push(function(val){
				if(val && emailregex.test(val)){
					ngModel.$setValidity('email', true);
					return val;
				}
				ngModel.$setValidity('email', false);
			});
		}
	};
}]);