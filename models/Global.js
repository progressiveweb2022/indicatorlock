var mongoose = require('mongoose'),
    PageSchema = require('../schemas/Page'),
    Schema = mongoose.Schema,
    typePlugin = require('../plugins/type'),
    enums = require('../shared/js/enums'),
    basicPlugin = require('../plugins/basic');

var schema = module.exports = new PageSchema({
    mainTitle: String,
    mainBodyDesc: String,
    mainFooterDesc: String,
    logo: String,
    contact: {
        company: String,
        address: String,
        phone: String,
        mobile: String,
        fax: String,
        email: String,
        social: {
            facebook: String,
            linkedin: String,
            twitter: String
        },
        location: {
            lat: Number,
            lng: Number
        }
    },
    contactsNewCompany: [{
        address: String,
        phone: String,
        mobile: String,
        fax: String,
        email: String,
        urls: [{
            name: String,
            link: String
        }],
        location: {
            lat: Number,
            lng: Number
        }
    }],
    onlineStoreDesc: String
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
schema.plugin(typePlugin, { type: enums.pagetype.globals.value });
mongoose.model('Global', schema);
