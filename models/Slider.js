var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    basicPlugin = require('../plugins/basic'),
    utils = require('../shared/js/utils');

var schema = module.exports = new Schema({
    name: String,
    descNull: {
        type: Boolean,
        default: false
    },
    upperdescr: String,
    lowerdescr: String,
    descPos: String,
	img: String,
    logo: String,
    logoPos: String,
    url: String,
    active: {
        from: {
            type: Date
        },
        until: {
            type: Date
        }
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
mongoose.model('Slide', schema);