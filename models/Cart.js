var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils'),
    async = require('../shared/js/async'),
    itemSchema = require('../schemas/Item');

var schema = new Schema({
    items: [itemSchema]
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

schema.virtual('totalPrice').get(function () {
    return this.items.reduce(function (p, n) {
        return p + n.product.price * n.quantity;
    }, 0);
});

utils.extend(schema.methods, [{
    fix: function (callback) {
        var cart = this;
        async.each(cart.items, function (item, callback) {
            if (!item.product) {
                item.remove();
                cart.save(callback);
            } else {
                callback();
            }
        }, callback);
    }
}]);

mongoose.model('Cart', schema);