var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils'),
    fs = require('fs'),
    tempFileName = './configTemp.json',
    os = require("os");


var schema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    name: String,
    description: String,
    pantNumber: String,
    price: Number,
    symbol: String,
    upc: String,
    retail: String,
    finish: String,
    grade: String,
    discount: {
        type: Number,
        default: 0
    },
    status: String,
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    images: [String],
    isCombined: Boolean,
    leftAmount: {
        type: Number,
        default: 0
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

schema.virtual('oldPrice').get(function() {
    return this.price + this.discount;
});

schema.virtual('discountPercent').get(function() {
    return Math.round(this.discount * 100 / this.oldPrice);
});

schema.post('save', function(doc) {
    var setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
    if (setting.emailBulk) {
        var hostname = setting.siteUrl || os.hostname();
        var emailBody = '<em>Date: ' + doc.createdAt + '</em><br /><br /><strong style="color: gray">Added New Product</strong><br /><br /><img alt src="' + hostname + doc.images[0] + '-445x350" /><br />' + '<h3>' + doc.name + '</h3>' + '<p>' + doc.description + '</p><div style="color: green"><b>Price: <i>' + doc.price + doc.priceS + '</i></b></div><br /><a target="_blank" href="' + hostname + '/guest/' + setting.siteLang + '/product/out/view?product_id=' + doc._id + '">learn more</a>';
        emailservice = require('../libraries/email')
        var i = 0;
        console.log('\r\n ID: %s\r\n Name: %s\r\n Has been saved\r\n', doc._id, doc.name);
        emailservice.sendAll(null, emailBody, function(err) {
            if (err) {
                console.log('Error sending email: ', err);
                return;
            }
            console.log((++i) + ") Good job!");
        });
    }
});

mongoose.model('Product', schema);
