angular.module(module.name).controller(module.name + '.c.' + current.name, [
	'$scope',
	'$state',
    'User',

	function (scope, state, User){
		scope.links = [{
			state: '.pagemenu.globals',
			caption: 'Globals'
		},
		{
			state: '.slide.list',
			caption: 'Sliders'
		},
		{
			state: '.product.list',
			caption: 'Products'
		},
		{
			state: '.category.list',
			caption: 'Category'
		},
		{
			state: '.faq.list',
			caption: 'FAQ'
		},
		{
			state: '.settings',
			caption: 'Settings'
		}];

		scope.logout = function(){
			User.logOut(function(){
				state.go('a.login', state.params);
			});
		};
	}
]);