angular
    .module(module.name, module.dependencies)
    .config(['$stateProvider', function(stateProvider) {
        stateProvider
            .state(module.name, {
                url: 'about',
                templateUrl: module.path + '/views/layout.html',
                resolve: {
                    about: ['About', function(About) {
                        return About.getOne().$promise;
                    }],
                    setting: ['Setting', function(Setting) {
                        return Setting.getOne().$promise;
                    }]
                },
                controller: ['$scope', 'about', 'setting', function(scope, about, setting) {
                    scope.about = about;
                    scope.setting = setting;
                    scope.emailResult = setting.emailBulk ? 'enabled' : 'disabled';
                    scope.onChecked = function() {
                        scope.setting.$save(function(result) {
                            scope.emailResult = result.emailBulk ? 'enabled' : 'disabled';
                            alert('Email delivery ' + scope.emailResult);
                        });
                    };
                    scope.addparagraph = function() {
                        scope.about.paragraphs.push({});
                    };

                    scope.removeparagraph = function(paragraph) {
                        var ps = scope.about.paragraphs;
                        ps.splice(ps.indexOf(paragraph), 1);
                    };

                    scope.save = function() {
                        scope.about.$save(function() {
                            alert('Data successfully updated');
                        });
                    };
                }]
            });
    }]);
