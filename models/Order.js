var mongoose = require('mongoose'),
    schema = require('../schemas/Order');

mongoose.model('Order', schema);