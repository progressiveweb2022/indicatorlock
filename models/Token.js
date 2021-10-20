var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    utils = require('../shared/js/utils'),
    enums = require('../shared/js/enums');

var schema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    value: String
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

utils.extend(schema.statics, [{
    create: function(user, callback){
        var Token = this;
        crypto.randomBytes(48, function(ex, buf) {
            var token = new Token({
                user: user._id,
                value: buf.toString('hex')
            });
            token.save(callback);
        });
    }
}]);

mongoose.model('Token', schema);