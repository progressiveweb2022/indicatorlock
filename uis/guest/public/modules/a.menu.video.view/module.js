angular
	.module(module.name, module.dependencies)
	.config(['$stateProvider', function(stateProvider){
		stateProvider
			.state(module.name, {
				url: '/view/:video_id',
				templateUrl: module.path + '/views/layout.html',
				resolve: {
					video: ['$stateParams', 'Videos', function(stateParams, Videos){
						return Videos.getOne().$promise.then(function(result){
							return utils.findOne(result.videos, { _id: stateParams.video_id });
						});
					}]
				},
				controller: ['$scope', 'video', function(scope, video){
					scope.video = video;
				}]
			});
	}]);