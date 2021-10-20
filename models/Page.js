var PageSchema = require('../schemas/Page'),
	mongoose = require('mongoose'),
    basicPlugin = require('../plugins/basic'),
    typePlugin = require('../plugins/type'),
    enums = require('../shared/js/enums');

var schema = module.exports = new PageSchema({

}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

schema.plugin(basicPlugin);
mongoose.model('Page', schema);