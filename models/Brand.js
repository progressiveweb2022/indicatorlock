var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils');

var schema = new Schema({
    name: String
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

mongoose.model('Brand', schema);