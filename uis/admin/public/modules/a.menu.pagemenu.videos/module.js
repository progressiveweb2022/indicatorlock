angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: 'videos',
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					page: ['Videos', function(Videos){
						return Videos.getOne().$promise;
					}]
				},
				controller: ['$scope', 'page', function(scope, page){
					scope.page = page;

					scope.move = function(video, diff){
						var index = scope.page.videos.indexOf(video);
						scope.page.videos.splice(index + diff, 0, scope.page.videos.splice(index, 1)[0]);
					};

					scope.addvideo = function(){
						scope.page.videos.push({});
					};

					scope.removevideo = function(video){
						var ps = scope.page.videos;
						ps.splice(ps.indexOf(video), 1);
					};

					scope.save = function(){
						scope.page.$save(function(){
							alert('Successfully updated');
						});
					};
				}]
			});
	}]);