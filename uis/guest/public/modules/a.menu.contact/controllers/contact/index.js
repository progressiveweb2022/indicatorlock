angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$rootScope',
    '$scope',
    '$state',
    'Message',

    function(rootScope, scope, state, Message) {
        scope.model = {
            type: null,
            email: null,
            body: null,
            subject: null,
            name: null
        };
        scope.markers = rootScope.globalPG.contact;

        scope.send = function() {
            Message.sendToAdmin({
                type: scope.model.type,
                email: scope.model.email,
                name: scope.model.name,
                subject: scope.model.subject,
                body: scope.model.body
            }, function() {
                state.reload();
                rootScope.$broadcast('notification:success', 'Message send!');
            });
        };
    }
]);
