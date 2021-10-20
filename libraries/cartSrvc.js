var mongoose = require('mongoose'),
    Cart = mongoose.model('Cart');

module.exports = {
    parseCart: function (options){
        options = options || {};
        return function (req, res, next) {
            var cartId = req.cookies.cart || req.query.cart || req.body.cart;
            if(!cartId) {
                createNewCart();
            } else {
                var pr = Cart.findOne({ _id: cartId });
                if (options.populate) {
                    pr = pr.populate(options.populate);
                }

                pr.exec(res.handle(function(cart){
                    if (!cart) {
                        createNewCart();
                    } else {
                        req.cart = cart;
                        next();
                    }
                }));
            }

            function createNewCart() {
                var cart = new Cart();
                cart.save(res.handle(function (cart) {
                    req.cart = cart;
                    res.cookie('cart', cart._id, {
                        maxAge: 90000000,
                        httpOnly: false
                    });
                    next();
                }));
            }
        }
    }
};