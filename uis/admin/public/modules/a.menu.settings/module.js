angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: 'settings',
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					setting: ['Setting', function(Setting){
						return Setting.getOne().$promise;
					}]
				},
				controller: ['$scope', 'setting', function(scope, setting){
					scope.setting = setting;
					scope.setting.type = "Setting";
					scope.save = function(){
						scope.setting.$save(function(){
							alert('Successfully updated');
						});
					};
				}]
			});
	}]);