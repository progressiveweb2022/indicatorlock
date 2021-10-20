var mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    auth = require('./auth'),
    utils = require('../shared/js/utils'),
    routesFolderPath = path.resolve(__dirname, '../routes/'),
    modelsFolderPath = path.resolve(__dirname, '../models/');

module.exports = {
    createModels: function () {
        fs.readdirSync(modelsFolderPath).forEach(function(modelFile) {
            require(path.resolve(modelsFolderPath, modelFile));
        });
    },

    getRoutes: function () {
        return fs.readdirSync(routesFolderPath)
            .map(function (routeFile) {
                var name = routeFile.substring(0, routeFile.indexOf('.js'));
                var route = require(path.resolve(routesFolderPath, routeFile));

                Object.keys(route).forEach(function (m) {
                    route[m] = utils.extend({
                        url: '/api/' + name.toLowerCase() + '/' + m
                    }, [route[m]]);
                });

                return {
                    name: name,
                    route: route
                };
            })
            .reduce(function (p, n) {
                p[n.name] = n.route;
                return p;
            }, {});
    },

    listenRoutes: function (app) {
        var routes = this.getRoutes();
        Object.keys(routes).forEach(function (model) {
            for (var m in routes[model])
                (function (p) {
                    var params = [p.url];
                    if (p.auth !== false) {
                        params.push(auth.parse);
                        params.push(auth.check(p.auth));
                    }
                    app[p.method].apply(app, params.concat(p.handlers));
                })(routes[model][m]);
        });
    }
};
