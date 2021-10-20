var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	PageSchema = require('../schemas/Page'),
    typePlugin = require('../plugins/type'),
    basicPlugin = require('../plugins/basic'),
    utils = require('../shared/js/utils'),
    enums = require('../shared/js/enums');

var schema = module.exports = new PageSchema({
	subject: String,
    body: String,
    type: String,
    typeTxt: String,
    name: String,
    read: {
        type: Boolean,
        default: false
    },
    from: {
        _id: Schema.Types.ObjectId,
        email: String
    },
    to: {
        _id: Schema.Types.ObjectId,
        email: String
    },
    recipientDeletedAt: Date,
    senderDeletedAt: Date
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

schema.plugin(basicPlugin);
schema.plugin(typePlugin, {
    type: enums.pagetype.about.value
});
mongoose.model('Message', schema);