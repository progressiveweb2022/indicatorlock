var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    async = require('../shared/js/async'),
    Perror = require('../libraries/Perror'),
    utils = require('../shared/js/utils');

var schema = new Schema({
    hashedpassword: String,
    salt: String,
    email: String,
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true,
        transform: function(doc, user, options) {
            delete user.__v;
            delete user.id;
            delete user.hashedpassword;
            delete user.salt;
            return user;
        }
    }
});

schema.virtual('password').set(function(plainText) {
    this.salt = this.makeSalt();
    this.hashedpassword = this.encryptPassword(plainText);
});

schema.virtual('fullname').get(function() {
    return this.firstname + ' ' + this.lastname;
});

utils.extend(schema.methods, [{
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedpassword;
    },

    encryptPassword: function(password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    },

    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    getUnknownNeighbours: function() {
        var self = this,
            User = self.constructor;

        return User.find({
            $and: [{
                _id: {
                    $ne: self._id
                }
            }]
        });
    },

    joinNeighbourhood: function(callback) {
        var self = this,
            today = new Date();

        self.getUnknownNeighbours().exec(function(err, neighbours) {
            if (err) {
                callback(err);
            } else {
                self.save(function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        async.each(neighbours, function(neighbour, cb) {
                            neighbour.save(cb);
                        }, callback);
                    }
                });
            }
        });
    }
}]);

utils.extend(schema.statics, [{
    register: function(data, callback) {
        var User = this;
        User.findOne({
            email: data.email
        }).count().exec(function(err, count) {
            if (err) {
                callback(err);
            } else if (count > 0) {
                callback(new Perror('Mail already exists'));
            } else {
                var user = new User(data);
                user.save(function(err, user) {
                    if (err) {
                        callback(err);
                    } else {
                        user.joinNeighbourhood(function(err) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, user);
                            }
                        });
                    }
                });
            }
        });
    }
}]);
mongoose.model('User', schema);
