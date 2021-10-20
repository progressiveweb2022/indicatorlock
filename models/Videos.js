var mongoose = require('mongoose'),
    PageSchema = require('../schemas/Page'),
    Schema = mongoose.Schema,
    typePlugin = require('../plugins/type'),
    enums = require('../shared/js/enums'),
    basicPlugin = require('../plugins/basic');

var schema = module.exports = new PageSchema({
    videos: [{
        title: String,
        desc: String,
        youtubeid: String
    }]
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
schema.plugin(typePlugin, { type: enums.pagetype.videos.value });
mongoose.model('Videos', schema);
