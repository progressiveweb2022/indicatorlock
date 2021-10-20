var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    basicPlugin = require('../plugins/basic'),
    priorityPlugin = require('../plugins/priority'),
    utils = require('../shared/js/utils');

var schema = module.exports = new Schema({
    type: String,
    siteName: String,
    siteDesc: String,
    siteUrl: String,
    metaKeywords: String,
    metaDesc: String,
    siteLang: {
        type: String,
        default: 'en'
    },
    email: String,
    emailBulk: {
        type: Boolean,
        default: true
    },
    userEmail: String,
    userPass: String
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
mongoose.model('Setting', schema);