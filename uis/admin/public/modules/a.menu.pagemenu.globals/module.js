angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider
            .state(module.name, {
                url: 'globals',
                templateUrl: module.path + '/views/layout.html',
                resolve: {
                    global: ['Global', function(Global) {
                        return Global.getOne().$promise;
                    }]
                },
                controller: ['$scope', 'global', function(scope, global) {
                    scope.globalPG = global;
                    scope.newCompany = [];
                    scope.save = function() {
                        scope.globalPG.$save(function() {
                            alert('Successfully updated');
                        });
                    };
                    scope.move = function(img, diff){
						var index = scope.globalPG.contactsNewCompany.indexOf(img);
						scope.globalPG.contactsNewCompany.splice(index + diff, 0, scope.globalPG.contactsNewCompany.splice(index, 1)[0]);
					};

					scope.addcompany = function(){
						scope.globalPG.contactsNewCompany.push({});
					};

					scope.removecompany = function(img){
						var ps = scope.globalPG.contactsNewCompany;
						ps.splice(ps.indexOf(img), 1);
					};
					scope.addurl = function(object){
						object.urls.push({});
					};

					scope.removeurl = function(img, object){
						var ps = object.urls;
						ps.splice(ps.indexOf(img), 1);
					};
                }]
            });
    }]);
