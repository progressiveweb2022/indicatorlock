var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    basicPlugin = require('../plugins/basic'),
    utils = require('../shared/js/utils');

var schema = new Schema({
	email: String,
    ip: String
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

schema.plugin(basicPlugin);
mongoose.model('Subscribe', schema);