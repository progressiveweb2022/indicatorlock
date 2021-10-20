angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider
            .state(module.name, {
                url: '/list?pagelength?pageoffset?sortby?sortasc',
                templateUrl: module.path + '/views/layout.html',
                controller: ['$scope', 'Message', '$stateParams', function(scope, Message, stateParams) {

                    scope.pageoffset = stateParams.pageoffset ? parseInt(stateParams.pageoffset) : 0;
                    scope.pagelength = stateParams.pagelength ? parseInt(stateParams.pagelength) : 16;
                    scope.sortby = stateParams.sortby || 'priority';
                    scope.sortasc = stateParams.sortasc === 'true';
                    scope.total = 0;
                    scope.messages = [];
                    scope.selectedmessages = [];
                    loadmessages();

                    function loadmessages() {
                        var sort = {};
                        sort[scope.sortby] = scope.sortasc ? 1 : -1;

                        return Message.getReceiveds({
                            offset: scope.pageoffset,
                            length: scope.pagelength,
                            sort: sort
                        }).$promise.then(function(result) {
                            scope.total = result.total;
                            scope.messages = result.records;
                        });
                    }

                    scope.remove = function(message) {
                        if (confirm('Are you sure'))
                            Message.remove({
                                _id: message._id
                            }, function() {
                                loadmessages();
                            });
                    };

                    scope.pages = function() {
                        var total = scope.total || 0;
                        var pages = Math.ceil(total / scope.pagelength);

                        var ps = [];
                        if (pages)
                            for (var p = 1; p <= pages; p++)
                                ps.push(p);
                        return ps;
                    };
                }]
            });
    }]);