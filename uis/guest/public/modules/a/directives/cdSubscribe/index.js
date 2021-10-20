angular
    .module(module.name)
    .directive(current.name, [
        '$cookieStore',
        'Subscribe',
        function(cookieStore, Subscribe) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: current.path + '/index.html',
                scope: {
                    show: '='
                },
                link: function(scope, element, attrs, ctrl) {
                    if (scope.show) {
                        element.hide();
                        return;
                    }
                    scope.model = {
                        email: null,
                        ip: null
                    }
                    scope.close = function() {
                        cookieStore.put('subscribe', true);
                        element.fadeOut(100)
                    }
                    scope.save = function() {
                        $.getJSON("http://jsonip.com?callback=?", function(data) {
                            var ip = data.ip || '0.0.0.0';
                            scope.model.ip = ip;
                            Subscribe.save({
                                email: scope.model.email,
                                ip: scope.model.ip
                            }, function(rec) {
                                console.log(rec);
                                var now = new Date(),
                                    exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
                                $.cookie('subscribe', true, {
                                    expires: exp
                                });
                                element.fadeOut(100)
                            });
                        });
                    }
                    setTimeout(function() {
                        element.fadeIn(200)
                    }, 1000)
                }
            };
        }
    ]);
