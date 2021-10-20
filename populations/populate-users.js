var mongoose = require('mongoose'),
    utils = require('../shared/js/utils'),
    enums = require('../shared/js/enums'),
    core = require('../libraries/core'),
    async = require('../shared/js/async'),
    config = require('../config');

// init core
mongoose.connect(config.mongoUrl);
core.createModels();
var routes = core.getRoutes();

// model
var User = mongoose.model('User');

async.each([{
    email: 'info@indicatorlock.com',
    password: '123'
}], function (user, callback) {
    var user = new User(user);
    user.save(callback);
}, function (err) {
    if (err) {
        console.log(err);
    } else {
        mongoose.connection.close(function () {
            console.log('Users populated successfully');
        });
    }
});