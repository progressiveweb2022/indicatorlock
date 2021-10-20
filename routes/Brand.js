var mongoose = require('mongoose'),
    auth = require('../libraries/auth'),
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils'),
    Brand = mongoose.model('Brand');


module.exports = {

    getById: {
        description: 'Get brand by id',
        method: 'get',
        auth: false,
        handlers: [function (req, res, next) {
            var data = req.query;
            
            Brand.findOne({
                _id: data._id
            }).select(data.select).exec(res.handle(function (brand) {
                if (!brand) {
                    res.status(404).send();
                } else {
                    res.send(brand);
                }
            }));
        }]
    },

    getFiltered: {
        description: 'Filter brands',
        method: 'get',
        auth: false,
        cache: false,
        handlers: [auth.parse, function (req, res, next) {
            var data = req.query;
            var query = {};

            Brand
                .find(query)
                .sort(data.sort)
                .select(data.select)
                .paginate(data.offset, data.length, res.handle(function (result) {
                    res.send(result);
                }));
        }]
    },

    save: {
        description: 'Save brand',
        method: 'post',
        auth: true,
        handlers: [function(req, res, next){
            var _id = req.body._id;
            if(_id) {
                Brand.findOne({ _id: req.body._id }).exec(res.handle(function(record){
                    if(!record) {
                        res.status(404).send();
                    } else {
                        utils.extend(record, [req.body]);
                        record.save(save);
                    }
                }));
            } else {
                (new Brand(req.body).save(save));
            }

            function save(err, record){
                res.handle(function (record) {
                    res.send(record);
                })(err, record);
            }
        }]
    },

    remove: {
        description: 'Remove brand',
        method: 'delete',
        auth: true,
        handlers: [function(req, res, next){
            var data = req.query;

            if (!utils.isNonEmptyString(data._id)) {
                return res.status(500).send('პარამეტრები არასწორია');
            }

            Brand.remove({ _id: data._id }).exec(res.handle(function () {
                res.send();
            }));
        }]
    },

    getAll: {
        description: 'Get all brands',
        method: 'get',
        auth: false,
        cache: true,
        isArray: true,
        handlers: [auth.parse, function (req, res, next) {
            var data = req.query;
            Brand
                .find()
                .select(data.select)
                .exec(res.handle(function (records) {
                    res.send(records);
                }));
        }]
    }

};
