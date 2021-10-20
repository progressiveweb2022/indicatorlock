var mongoose = require('mongoose'),
    auth = require('../libraries/auth'),
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils'),
    async = require('../shared/js/async'),
    Category = mongoose.model('Category'),
    Product = mongoose.model('Product');


module.exports = {

    getById: {
        description: 'Get category by id',
        method: 'get',
        auth: false,
        handlers: [function(req, res, next) {
            var data = req.query;
            if (utils.isEmpty(data))
                res.send(null);
            Category.findOne({
                _id: data._id
            }).select(data.select).exec(res.handle(function(category) {
                if (!category) {
                    res.status(404).send();
                } else {
                    res.send(category);
                }
            }));
        }]
    },

    getFiltered: {
        description: 'Filter categories',
        method: 'get',
        auth: false,
        cache: false,
        handlers: [auth.parse, function(req, res, next) {
            var data = req.query;
            var query = {};

            if (data.parent_id === 'none') {
                query['parent'] = null;
            } else if (data.parent_id) {
                query['parent'] = data.parent_id;
            }
            if (data['_id:ne']) {
                query['_id'] = {
                    $ne: data['_id:ne']
                };
            }

            var pr = Category.find(query);
            if (data.populate) {
                pr.populate(data.populate)
            }

            pr
                .sort(data.sort)
                .select(data.select)
                .paginate(data.offset, data.length, res.handle(function(result) {
                    res.send(result);
                }));
        }]
    },

    save: {
        description: 'Save category',
        method: 'post',
        auth: true,
        handlers: [function(req, res, next) {
            var _id = req.body._id;
            if (_id) {
                Category.findOne({
                    _id: req.body._id
                }, {
                    name: req.body.name
                }).exec(res.handle(function(record) {
                    if (!record) {
                        res.status(404).send();
                    } else {
                        utils.extend(record, [req.body]);
                        record.save(save);
                    }
                }));
            } else {
                Category.findOne({
                    name: req.body.name
                }).exec(res.handle(function(record) {
                    if (!record) {
                        (new Category(req.body).save(save));
                    } else {
                        res.status(500).send({
                            error: "Category already exists"
                        });
                    }
                }));

            }

            function save(err, record) {
                res.handle(function(record) {
                    res.send(record);
                })(err, record);
            }
        }]
    },

    remove: {
        description: 'Remove category',
        method: 'delete',
        auth: true,
        handlers: [function(req, res, next) {
            var data = req.query;

            if (!utils.isNonEmptyString(data._id)) {
                return res.status(500).send('Options wrong');
            }

            Category.remove({
                _id: data._id
            }).exec(res.handle(function() {
                res.send();
            }));
        }]
    },

    getAll: {
        description: 'Get all categories',
        method: 'get',
        auth: false,
        cache: true,
        isArray: true,
        handlers: [auth.parse, function(req, res, next) {
            var data = req.query;
            var query = {};

            if (data.parent_id === 'none') {
                query['parent'] = null;
            } else if (data.parent_id) {
                query['parent'] = data.parent_id;
            }

            Category
                .find(query)
                .select(data.select)
                .exec(res.handle(function(records) {
                    res.send(records);
                }));
        }]
    },
    getScrollData: {
        description: 'Get all categories',
        method: 'get',
        auth: false,
        cache: false,
        isArray: true,
        handlers: [function(req, res, next) {
            var data = req.query;
            var query = {};
            console.log(data.after);
            if (data.after)
                query = {
                    _id: {
                        "$gt": data.after
                    }
                };
            else
                query = {};
            Category
                .find(query)
                .limit(20)
                .exec(res.handle(function(records) {
                    if (!utils.isEmpty(records)) {
                        res.send(records);
                    }
                }));
        }]
    },
    getAllCN: {
        description: 'Get all categories',
        method: 'get',
        auth: false,
        cache: false,
        isArray: true,
        handlers: [auth.parse, function(req, res, next) {
            var data = req.query;
            var query = {};

            if (data.parent_id === 'none') {
                query['parent'] = null;
            } else if (data.parent_id) {
                query['parent'] = data.parent_id;
            }

            Category
                .find(query)
                .select(data.select)
                .exec(res.handle(function(records) {
                    res.send(records);
                }));
        }]
    }

};
