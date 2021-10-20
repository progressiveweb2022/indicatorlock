angular.module(module.name).directive(current.name, [function(){
	return {
        restrict: 'E',
        replace: true,
        templateUrl: current.path + '/index.html',
        scope: {
        	timeout: '='
        },

        controller: ['$scope', '$rootScope', '$timeout', '$element', function(scope, rootScope, timeout, element){
        	scope.alerts = [];

        	scope.close = function(index){
        		scope.alerts.splice(index, 1);
                element.fadeOut(0);
        	};

            rootScope.$on('notification:error', function(e, msg){
                element.removeClass("alert-success").addClass("alert-danger").fadeIn(400);
                scope.alerts.push(msg);
                timeout(function(){
                    var index = scope.alerts.indexOf(msg);
                    if(index !== -1) scope.alerts.splice(index, 1);
                    element.fadeOut(0);
                }, (scope.timeout || 5) * 1000);
            });

            rootScope.$on('notification:success', function(e, msg){
                element.removeClass("alert-danger").addClass("alert-success").fadeIn(400);
                scope.alerts.push(msg);
                timeout(function(){
                    var index = scope.alerts.indexOf(msg);
                    if(index !== -1) scope.alerts.splice(index, 1);
                    element.fadeOut(0);
                }, (scope.timeout || 5) * 1000);
            });
        }]
    };
}]);