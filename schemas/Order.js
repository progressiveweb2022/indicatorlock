var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils'),
    crypto = require('crypto'),
    itemSchema = require('./Item');

var schema = new Schema({
    totalPrice: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

module.exports = schema;