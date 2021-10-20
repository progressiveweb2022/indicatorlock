angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: 'app',
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					app: ['App', function(App){
						return App.getOne().$promise;
					}]
				},
				controller: ['$scope', 'app', function(scope, app){
					scope.app = app;

					scope.adddesc = function(){
						scope.app.answers.push({});
					};

					scope.removedesc = function(item){
						var ps = scope.app.answers;
						ps.splice(ps.indexOf(item), 1);
					};
					scope.adddescBot = function(){
						scope.app.subtexts.push({});
					};

					scope.removedescBot = function(item){
						var ps = scope.app.subtexts;
						ps.splice(ps.indexOf(item), 1);
					};
					scope.save = function(){
						scope.app.$save(function(){
							alert('Data successfully updated');
						});
					};
				}]
			});
	}]);