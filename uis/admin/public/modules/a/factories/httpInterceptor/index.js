angular
    .module(module.name)
    .factory(current.name, ['$q', '$injector', '$location', '$rootScope', function(q, injector, location, rootScope) {
        var loading = 0;

        return {
            request: function (config) {
                if(++loading === 1) rootScope.$broadcast('loading:progress');
                return config || $q.when(config);
            },

            response: function (response) {
                if(--loading === 0) rootScope.$broadcast('loading:finish');
                return response || $q.when(response);
            },

            responseError: function (response) {
                var state = injector.get('$state');
                switch(response.status){
                    case 404:
                        if(response.data.error) alert(response.data.error);
                    break;
                    case 500:
                        if(response.data.error) alert(response.data.error);
                    break;
                    case 413:
                        if(response.data.error) alert(response.data.error);
                    break;
                }

                if(--loading === 0) rootScope.$broadcast('loading:finish');
                return q.reject(response);
            }
        };
    }])
    .config(['$httpProvider', function(httpProvider){
        httpProvider.interceptors.push(current.name);
    }]);