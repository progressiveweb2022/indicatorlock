var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    basicPlugin = require('../plugins/basic'),
    priorityPlugin = require('../plugins/priority'),
    utils = require('../shared/js/utils');

var schema = module.exports = new Schema({
	question: {
        en: String
    },
    answer: {
        en: String
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

schema.plugin(basicPlugin);
schema.plugin(priorityPlugin);
mongoose.model('Faq', schema);