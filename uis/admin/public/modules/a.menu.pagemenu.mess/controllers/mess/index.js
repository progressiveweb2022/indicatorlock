angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'Message',
    'sumMess',

    function(scope, state, Message, sumMess) {
        scope.model = {
            subject: null,
            body: null,
            theme: null
        };
        scope.sumMess = sumMess;
        scope.wait = '';
        scope.reply = function() {
            scope.wait = 'Please wait...';
            Message.sendToAll(scope.model, function(sentMessage) {
                scope.model = {
                    subject: null,
                    body: null,
                    theme: null
                };
                scope.wait = '';
                alert('The process is finished');
            });
        };
    }
]);
