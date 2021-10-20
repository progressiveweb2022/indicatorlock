var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils');

var schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

utils.extend(schema.methods, [{
    validateProduct: function (callback) {
        var item = this;
        var color = utils.findOne(item.product.colors, {
            name: item.color
        });

        if (!color) {
            callback(item.product.name + ' მოცემული ფერით არ მოიძებნა');
        } else {
            var ageRange = utils.findOne(color.ageRanges, {
                from: item.ageFrom,
                to: item.ageTo
            });

            if (!ageRange) {
                callback(item.product.name + 'მოცემული ზომით არ მოიძებნა');
            } else if (ageRange.leftQuantity < item.quantity) {
                callback('დარჩენილია ' + ageRange.leftQuantity + ' ცალი ' + item.product.name);
            } else {
                callback(null, {
                    color: color,
                    ageRange: ageRange
                });
            }
        }
    }
}]);

module.exports = schema;