angular.module(module.name).controller(module.name + '.c.' + current.name, [
	'$scope',
	'$state',
	'Message',
	'message',

	function(scope, state, Message, message){
		scope.message = message;
		scope.model = {
			subject: null,
			body: null,
			type: null,
			name: null,
			from: null
		};
		scope.model.type = scope.message.typeTxt.toUpperCase();
		scope.model.name = scope.message.name;
		scope.model.from = scope.message.from;
		scope.message.read = true;
		scope.message.$save(function () {});
		scope.reply = function(){
			Message.sendToClient(scope.model, function(sentMessage){
				state.go('^.list', { message_id: sentMessage._id });
			});
		};
	}
]);