var mongoose = require('mongoose'),
    PageSchema = require('../schemas/Page'),
    basicPlugin = require('../plugins/basic'),
    typePlugin = require('../plugins/type'),
    enums = require('../shared/js/enums');

var schema = module.exports = new PageSchema({
    title: String,
    answers: [{
        number: String,
        desc: String
    }],
    downtitle: String,
    subtexts: [{
        number: String,
        title: String,
        desc: String
    }],
    img: String
}, {
    collection: 'pages',
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
mongoose.model('App', schema);
