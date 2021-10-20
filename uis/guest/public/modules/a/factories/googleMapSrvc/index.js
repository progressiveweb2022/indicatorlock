angular.module(module.name).provider(current.name, [function(){
    var provider = this;
    provider.callbackName = 'googleMapInitialized';

    var callbacks = [];
    var ready = false;

    window[provider.callbackName] = function(){
        ready = true;
        callbacks.forEach(function (callback) {
            callback();
        });
    };

    provider.$get = ['$q', '$window', function(q, window){
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
                        if (ready) {
                            callback();
                        } else {
                            callbacks.push(callback);
                            if (!d.getElementById(id)) {
                                js = d.createElement(s); js.id = id;
                                js.src = "//maps.googleapis.com/maps/api/js?callback=" + provider.callbackName;
                                fjs.parentNode.insertBefore(js, fjs);
                            }
                        }
                    }(document, 'script', 'google-map'));
                });
            }
        };
    }];
}]);