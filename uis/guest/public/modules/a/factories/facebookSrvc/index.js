angular.module(module.name).provider(current.name, [function(){
	var provider = this;
	provider.defaultOptions = {
		//appId: '1625007787744511',
		status: true,
		xfbml: true,
		version: 'v2.3'
	};

	provider.$get = ['$q', function(q){
		var promisify = function(fn){
			var deferred = q.defer();
			fn(function(err, result){
				if(err) {
					deferred.reject(err);
				} else {
					deferred.resolve(result);
				}
			});
			return deferred.promise;
		};

		return {
			init: function(options){
				return promisify(function(callback){
					(function(d, s, id){
			        	var js, fjs = d.getElementsByTagName(s)[0];
			        	if (d.getElementById(id))
			        		callback();
			        	else {
				        	js = d.createElement(s); js.id = id;
				        	js.onload = function(){
				        		var options = angular.extend({}, provider.defaultOptions, options || {});
				        		FB.init(options);
				        		callback();
				        	};
				        	js.src = "//connect.facebook.net/en_US/sdk.js";
				        	fjs.parentNode.insertBefore(js, fjs);
				        }
			       	}(document, 'script', 'facebook-jssdk'));
		       	});
			},

			getLoginStatus: function(){
				return promisify(function(callback){
					FB.getLoginStatus(function(response) {
					    callback(null, response);
					});
				});
			},

			getMe: function(){
				return promisify(function(callback){
					FB.api('/me', function(response) {
					    callback(null, response);
					});
				});
			},

			login: function(){
				var self = this;
				return promisify(function(callback){
					self.getLoginStatus().then(function(response){
						if (response.status == 'connected')
						    callback(null, response);
						else if (response.status == 'not_authorized' || response.status === 'unknown')
						    FB.login(function(response) {
						        if (response.authResponse)
						            callback(null, response);
						        else
						            callback(response.error);
						    });
						else
							callback('Uncought error');
					});
				});
			}
		};
	}];
}]);