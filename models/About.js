var mongoose = require('mongoose'),
    PageSchema = require('../schemas/Page'),
    basicPlugin = require('../plugins/basic'),
    typePlugin = require('../plugins/type'),
    enums = require('../shared/js/enums'),
    fs = require('fs'),
    tempFileName = './configTemp.json',
    os = require("os");

var schema = module.exports = new PageSchema({
    title: String,
    paragraphs: [{
        title: String,
        description: String
    }],
    epilogue: String
}, {
    collection: 'pages',
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
schema.post('save', function(doc) {
    var setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
    if (setting.emailBulk) {
        var hostname = setting.siteUrl || os.hostname();
        var index = doc.paragraphs.length - 1;
        if (doc.paragraphs[index]) {
            var emailBody = '<em>Date: ' + doc.createdAt + '</em><br /><br /><strong style="color: gray">Indicator Lock News</strong>' + '<h3>' + doc.paragraphs[index].title + '</h3>' + '<div>' + doc.paragraphs[index].description + '</div><br /><a target="_blank" href="' + hostname + '/guest/' + setting.siteLang + '/aboutus/view">learn more</a>';
            emailservice = require('../libraries/email');
            var i = 0;
            console.log('\r\n ID: %s\r\n Title: %s\r\n Has been saved\r\n', doc._id, doc.paragraphs[index].title);
            emailservice.sendAll(null, emailBody, function(err) {
                if (err) {
                    console.log('Error sending email: ', err);
                    return;
                }
                console.log((++i) + ") Good job!");
            });
        }
    }
});
schema.plugin(basicPlugin);
schema.plugin(typePlugin, {
    type: enums.pagetype.about.value
});
mongoose.model('About', schema);
