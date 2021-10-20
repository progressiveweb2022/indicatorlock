angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: 'sheet',
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					page: ['Sheet', function(Sheet){
						return Sheet.getOne().$promise;
					}]
				},
				controller: ['$scope', 'page', function(scope, page){
					scope.page = page;

					scope.move = function(img, diff){
						var index = scope.page.colls.indexOf(img);
						scope.page.colls.splice(index + diff, 0, scope.page.colls.splice(index, 1)[0]);
					};

					scope.addsheet = function(){
						scope.page.colls.push({});
					};

					scope.removesheet = function(img){
						var ps = scope.page.colls;
						ps.splice(ps.indexOf(img), 1);
					};

					scope.save = function(){
						scope.page.$save(function(){
							alert('Successfully updated');
						});
					};
				}]
			});
	}]);