var mongoose = require('mongoose'),
    auth = require('../libraries/auth'),
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils'),
    async = require('../shared/js/async'),
    Cart = mongoose.model('Cart'),
    Order = mongoose.model('Order'),
    Product = mongoose.model('Product'),
    cartSrvc = require('../libraries/cartSrvc'),
    paypal = require('paypal-rest-sdk'),
    config = require('../config.js');

module.exports = {

    checkoutPayPal: {
        description: 'Create payment with paypal method',
        method: 'post',
        auth: true,
        handlers: [cartSrvc.parseCart({
            populate: 'items.product'
        }), function(req, res, next) {
            var cart = req.cart;
            (new Order({
                totalPrice: cart.totalPrice
            })).save(res.handle(function (order) {
                var paypalPayment = {
                    intent: 'sale',
                    payer: {
                        payment_method: 'paypal'
                    },
                    redirect_urls: {
                        return_url: 'http://localhost:8886/api/order/execute?order_id=' + order._id,
                        cancel_url: 'http://localhost:8886/aq/sheni/angular/url?order_id=' + order._id
                    },
                    transactions: [{
                        description: 'Purchase',
                        amount: {
                            currency: 'USD',
                            total: cart.totalPrice
                        }
                    }]
                };

                paypal.payment.create(paypalPayment, {}, res.handle(function (result) {
                    var link = result.links;
                    for (var i = 0; i < link.length; i++) {
                        if (link[i].rel === 'approval_url') {
                            res.send({
                                redirect: link[i].href
                            });
                        }
                    }
                }));
            }));
        }]
    },

    addToCart: {
        description: 'Add product to cart',
        method: 'post',
        auth: false,
        handlers: [cartSrvc.parseCart(), function(req, res, next) {
            var data = req.body,
                cart = req.cart;

            Product.findOne({
                '_id': data.product_id
            }).exec(res.handle(function(product) {
                if (!product) {
                    res.status(404).send('Product not found');
                } else {
                    var itemInfo = {
                        quantity: data.quantity,
                        product: data.product_id
                    };

                    var itemInCart = utils.findOne(cart.items, function(item) {
                        return item.product.equals(itemInfo.product) &&
                            item.color === itemInfo.color;
                    });

                    if (itemInCart) {
                        if (itemInCart.quantity + itemInfo.quantity) {
                            itemInCart.quantity += itemInfo.quantity;
                        } else {
                            itemInCart.quantity += itemInCart.quantity;
                        }
                    } else {
                        cart.items.push(itemInfo);
                    }


                    cart.save(res.handle(function(cart) {
                        res.send();
                    }));
                }
            }));
        }]
    },

    getCartItems: {
        description: 'Get cart items',
        method: 'get',
        auth: false,
        isArray: true,
        handlers: [cartSrvc.parseCart({
            populate: 'items.product'
        }), function(req, res, next) {
            var cart = req.cart;
            cart.fix(res.handle(function() {
                res.send(cart.items);
            }));
        }]
    },

    getCartSummary: {
        description: 'Get cart summary',
        method: 'get',
        auth: false,
        handlers: [cartSrvc.parseCart({
            populate: 'items.product'
        }), function(req, res, next) {
            var cart = req.cart;
            cart.fix(res.handle(function() {
                res.send({
                    itemCount: cart.items.length,
                    productCount: cart.items.reduce(function(p, n) {
                        return p + n.quantity;
                    }, 0)
                });
            }));
        }]
    },

    removeItem: {
        description: 'Remove item from cart',
        method: 'post',
        auth: false,
        handlers: [cartSrvc.parseCart(), function(req, res, next) {
            var cart = req.cart,
                data = req.body;

            cart.items.id(data.item_id).remove();
            cart.save(res.handle(function() {
                res.send();
            }));
        }]
    }

};
