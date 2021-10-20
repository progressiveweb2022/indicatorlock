var mongoose = require('mongoose'),
    auth = require('../libraries/auth'),
    utils = require('../shared/js/utils'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User'),
    Token = mongoose.model('Token');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function (email, password, done) {
    User.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user || !user.authenticate(password)) {
            return done(null, false);
        }
        return done(null, user);
    });
}));
module.exports = {

    getCurrentUser: {
        description: 'Get logged in user',
        method: 'get',
        auth: true,
        handlers: [auth.populate(), function (req, res, next) {
            res.send(req.token.user);
        }]
    },
    register: {
        description: 'Register new user',
        method: 'post',
        auth: false,
        handlers: [function (req, res, next) {
            var data = req.body;
            User.register({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                password: data.password
            }, res.handle(function (user) {
                Token.create(user, res.handle(function (token) {
                    res.cookie('token', token.value, {
                        maxAge: 90000000,
                        httpOnly: false
                    });
                    res.send();
                }));
            }));
        }]
    },
    authenticate: {
        description: 'Authenticate user',
        method: 'post',
        auth: false,
        handlers: [function(req, res, next) {
            var data = req.body;
            if (!utils.isNonEmptyString(data.email) || !utils.isNonEmptyString(data.password)) {
                return res.status(500).send('Options wrong');
            }

            User.findOne({
                email: data.email
            }).exec(res.handle(function(user) {
                if (!user) {
                    res.status(500).send('User not found');
                } else if (user.authenticate(data.password)) {
                    Token.create(user._id, res.handle(function(token) {
                        res.cookie('token', token.value, {
                            maxAge: 90000000,
                            httpOnly: false
                        });
                        res.send(token);
                    }));
                }
            }));
        }]
    },
    existsemail: {
        description: 'Check if email exists',
        method: 'post',
        auth: false,
        handlers: [function(req, res, next) {
            User.getOne({
                email: req.body.email
            }).exec(function(err, user) {
                if (err) {
                    res.status(500).send();
                    console.log(err);
                } else
                    res.send({
                        exists: !!user
                    });
            });
        }]
    },
    getUserProfileInfo: {
        description: 'Get user profile info',
        method: 'get',
        auth: true,
        handlers: [function(req, res, next) {
            var data = req.query;
            User.findOne({
                _id: data.userId
            }).exec(res.handle(function(user) {
                res.send(user);
            }));
        }]
    },
    localauth: {
        description: 'Authenticate guest',
        method: 'post',
        auth: false,
        handlers: [auth.parse, function (req, res, next) {
            var token = req.token;
            passport.authenticate('local', res.handle(function (user, info) {
                if (!user) {
                    res.status(500).send('Email or password are wrong');
                } else {
                    Token.create(user, res.handle(function (token) {
                        res.cookie('token', token.value, {
                            maxAge: 90000000,
                            httpOnly: false
                        });
                        res.send(token);
                    }));
                }
            })).apply(passport, arguments);
        }]
    },
    logOut: {
        description: 'Log out',
        method: 'post',
        auth: false,
        handlers: [auth.parse, function(req, res, next){
            var token = req.token;
            if(token && token.authenticated){
                token.authenticated = false;
                token.cart = [];
                token.save(res.handle(function(token){
                    res.send();
                }));
            }
            else
                res.send();
        }]
    },

};
