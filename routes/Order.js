var utils = require('../shared/js/utils.js'),
    async = require('../shared/js/async.js'),
    mongoose = require('mongoose'),
    Order = mongoose.model('Order'),
    Cart = mongoose.model('Cart'),
    cartSrvc = require('../libraries/cartSrvc');

var TEST_MODE = 1,
    PASSWORD = 'Q9aK4mUFZQ1EH4XmqQiT',
    MERCHANT = 'BABYTRENDGE',
    CURRENCY = 'GEL',
    LANG = 'KA',
    DELIVERY_PRICE = 5;

function buildResultXML(resultCode, resultDesc, check) {
    return '<result>' +
        '<resultcode>' + resultCode + '</resultcode>' +
        '<resultdesc>' + resultDesc + '</resultdesc>' +
        '<check>' + check + '</check>' +
        '<data></data>' +
        '</result>';
}

module.exports = {

    getFiltered: {
        description: 'Filter orders',
        method: 'get',
        auth: true,
        cache: false,
        handlers: [function (req, res, next) {
            var data = req.query;
            var query = {};

            if (data.status) {
                query.status = data.status;
            }

            Order
                .find(query)
                .sort(data.sort)
                .select(data.select)
                .populate('items.product')
                .paginate(data.offset, data.length, res.handle(function (result) {
                    res.send(result);
                }));
        }]
    },

    create: {
        method: 'post',
        auth: false,
        handlers: [cartSrvc.parseCart({
            populate: 'items.product'
        }), function (req, res, next) {
            var cart = req.cart;
            async.each(cart.items, function (item, callback) {
                item.validateProduct(callback);
            }, res.handle(function () {
                next();
            }));
        }, function (req, res) {
            var cart = req.cart,
                data = req.body,
                host = req.protocol + '://' + req.get('Host');

            var totalPrice = cart.items.reduce(function (p, n) {
                return p + n.quantity * n.product.price;
            }, 0);

            var namePrices = cart.items.reduce(function (p, n, index) {
                var i = index + 2;
                p['item' + i + '_price'] = n.product.price * n.quantity + ' ' + CURRENCY;
                return p;
            }, {
                item1_price: DELIVERY_PRICE + ' ' + CURRENCY
            });

            var orderData = utils.extend({
                items: cart.items,
                phone: data.phone,
                address: data.address,

                merchant: MERCHANT,
                amount: (totalPrice + DELIVERY_PRICE) * 100,
                currency: CURRENCY,
                clientname: '',
                ispreauth: 0,
                lng: LANG,
                testmode: TEST_MODE,
                password: PASSWORD
            }, [namePrices]);

            var order = new Order(orderData);
            order.save(res.handle(function (order) {
                cart.save(res.handle(function () {
                    res.send(utils.extend({
                        password: order.password,
                        merchant: order.merchant,
                        ordercode: order.ordercode,
                        amount: order.amount,
                        currency: order.currency,
                        description: order.description,
                        clientname: order.clientname,
                        customdata: order.customdata,
                        lng: order.lng,
                        testmode: order.testmode,
                        ispreauth: order.ispreauth,
                        check: order.check,
                        callbackurl: host + '/api/order/callback?',
                        cancelurl: host + '/guest/cart?',
                        errorurl: host + '/guest/cart/result/failed?',
                        successurl: host + '/guest/cart/result/success?'
                    }, [namePrices]));
                }));
            }));
        }]
    },

    callback: {
        method: 'get',
        auth: false,
        handlers: [function (req, res) {
            var data = req.query;
            var str = [
                data.status,
                data.transactioncode,
                data.amount,
                data.currency,
                data.ordercode,
                data.paymethod,
                data.paymethod === 'PAYTERM' ? data.payedamount : '',
                data.customdata,
                data.testmode + '',
                PASSWORD
            ].filter(function (n) {
                return n;
            }).join('');

            function getResultCheck(resultCode, resultDesc) {
                return Order.encryptCheck([
                    resultCode,
                    resultDesc,
                    data.transactioncode,
                    PASSWORD
                ].join(''));
            }

            var isValidCheck = Order.encryptCheck(str) === data.check.toLowerCase();
            if (!isValidCheck) {
                var code = getResultCheck(-3, 'check mismatch');
                var xml = buildResultXML(-3, 'check mismatch', code);
                res.send(xml);
                console.log('check mismatch. xml: ', xml);
            } else {
                Order.findOne({
                    _id: data.ordercode
                }, function (err, order) {
                    if (err) {
                        var code = getResultCheck(-1, 'server error');
                        var xml = buildResultXML(-1, 'server error', code);
                        res.send(xml);
                        console.log(err);
                    } else if (!order) {
                        var code = getResultCheck(-2, 'order does not exist');
                        var xml = buildResultXML(-2, 'order does not exist', code);
                        res.send(xml);
                        console.log('order does not exist. xml: ', xml);
                    } else if (order.resolved) {
                        var code = getResultCheck(1, 'order is resolved');
                        var xml = buildResultXML(1, 'order is resolved', code);
                        res.send(xml);
                        console.log('order is resolved. xml: ', xml);
                    } else {
                        order.resolvedAt = Date.now();
                        order.save(function (err) {
                            if (err) {
                                var code = getResultCheck(-1, 'server error');
                                var xml = buildResultXML(-1, 'server error', code);
                                res.send(xml);
                                console.log(err);
                            } else {
                                var code = getResultCheck(0, 'Ok');
                                var xml = buildResultXML(0, 'Ok', code);
                                res.send(xml);
                                console.log('success. xml: ', xml);
                            }
                        });
                    }
                });
            }
        }]
    },

    success: {
        method: 'post',
        auth: false,
        handlers: [cartSrvc.parseCart(), function (req, res) {
            var data = req.body,
                cart = req.cart;

            var str = [
                data.status,
                data.transactioncode,
                data.date,
                data.amount,
                data.currency,
                data.ordercode,
                data.paymethod,
                data.customdata,
                data.testmode + '',
                PASSWORD
            ].filter(function (n) {
                return n;
            }).join('');

            var isValidCheck = Order.encryptCheck(str) === data.check.toLowerCase();
            if (!isValidCheck) {
                res.status(500).send('საკონტროლო კოდი არასწორია');
            } else {
                Order.findOne({
                    _id: data.ordercode
                }).populate('items.product').exec(res.handle(function (order) {
                    if (!order) {
                        res.status(404).send('შეკვეთა არ მოიძებნა');
                    } else if (order.resolvedAt) {
                        res.status(500).send('შეკვეთა უკვე დასრულებულია');
                    } else {
                        order.status = data.status;
                        order.save(res.handle(function (order) {
                            Order.populate(order.items, {
                                path: 'items.product',
                                model: 'Product'
                            }, res.handle(function () {
                                async.each(order.items, function (item, callback) {
                                    item.validateProduct(res.handle(function (result) {
                                        result.ageRange.leftQuantity -= item.quantity;
                                        item.product.save(callback);
                                    }));
                                }, res.handle(function () {
                                    cart.items.length = 0;
                                    cart.markModified('items');
                                    cart.save(res.handle(function () {
                                        res.send();
                                    }));
                                }));
                            }));
                        }));
                    }
                }));
            }
        }]
    }

};
