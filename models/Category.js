var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils');

var schema = new Schema({
    name: String,
    description: String,
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

mongoose.model('Category', schema);