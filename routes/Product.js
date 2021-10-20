var mongoose = require('mongoose'),
    auth = require('../libraries/auth'),
    enums = require('../shared/js/enums'),
    utils = require('../shared/js/utils'),
    async = require('../shared/js/async'),
    Product = mongoose.model('Product'),
    Grid = require('gridfs-stream'),
    gm = require('gm').subClass({
        imageMagick: true
    }),
    fs = require('fs');


module.exports = {

    getById: {
        description: 'Get product by id',
        method: 'get',
        auth: false,
        handlers: [function(req, res, next) {
            var data = req.query;

            var pr = Product.findOne({
                _id: data._id
            });

            if (data.populate) {
                pr.populate(data.populate)
            }

            pr.select(data.select).exec(res.handle(function(product) {
                if (!product) {
                    res.status(404).send();
                } else {
                    res.send(product);
                }
            }));
        }]
    },

    getFiltered: {
        description: 'Filter products',
        method: 'get',
        auth: false,
        cache: false,
        handlers: [auth.parse, function(req, res, next) {
            var data = req.query;
            var query = {};

            if (data.targetGender) {
                query['targetGender'] = data.targetGender;
            }
            if (data.priceFrom || data.priceTo) {
                query['price'] = {};

                if (data.priceFrom) {
                    query['price'].$gte = data.priceFrom
                }
                if (data.priceTo) {
                    query['price'].$lte = data.priceTo;
                }
            }
            if (data.category_id) {
                query['category'] = data.category_id;
            }
            if (data.subCategory_id) {
                query['subCategory'] = data.subCategory_id;
            }
            if (data.brand_id) {
                query['brand'] = data.brand_id;
            }

            Product
                .find(query)
                .sort(data.sort)
                .select(data.select)
                .paginate(data.offset, data.length, res.handle(function(result) {
                    res.send(result);
                }));
        }]
    },
    getCPage: {
        description: 'getCPage products',
        method: 'get',
        auth: false,
        cache: false,
        handlers: [function(req, res, next) {
            var data = req.query;
            var query = {};
            var index = 0;
            if (data.category_id && data.product_id && data.reqv) {
                if (data.reqv == "gt") {
                    query = {
                        category: data.category_id,
                        _id: {
                            "$gt": data.product_id
                        }
                    }
                }
                if (data.reqv == "lt") {
                    query = {
                        category: data.category_id,
                        _id: {
                            "$lt": data.product_id
                        }
                    }
                    index = 1;
                }
            }

            Product
                .find(query)
                .select()
                .exec(res.handle(function(result) {
                    if (index)
                        index = result.length - 1;
                    res.send(result[index]);
                }));
        }]
    },
    getSearch: {
        description: 'Search products',
        method: 'get',
        auth: false,
        cache: false,
        handlers: [auth.parse, function(req, res, next) {
            var data = req.query;
            var query = {};

            if (data.findText) {
                query['name'] = data.findText;
            }
            Product
                .find()
                .or([{
                    'name': {
                        $regex: query['name']
                    }
                }, {
                    'description': {
                        $regex: query['name']
                    }
                }, {
                    'pantNumber': {
                        $regex: query['name']
                    }
                }])
                .sort(data.sort)
                .paginate(data.offset, data.length, res.handle(function(result) {
                    res.send(result);
                }));
        }]
    },
    getAll: {
        description: 'Get all Product',
        method: 'get',
        isArray: true,
        auth: false,
        handlers: [function(req, res, next) {
            Product
                .find().select('').exec(function(err, records) {
                    if (err) {
                        res.status(500).send();
                        console.log(err);
                    } else
                        res.send(records);
                });
        }]
    },
    getTotal: {
        description: 'Get total',
        method: 'get',
        isArray: true,
        auth: false,
        handlers: [function(req, res, next) {
            var data = req.query;
            if (!data) return;
            Product
                .find({category: data.category_id}).select('').exec(function(err, records) {
                    if (err) {
                        res.status(500).send();
                        console.log(err);
                    } else
                        res.send({
                            total: records.length
                        });
                });
        }]
    },
    save: {
        description: 'Save product',
        method: 'post',
        auth: true,
        handlers: [function(req, res, next) {
            var _id = req.body._id;
            if (_id) {
                Product.findOne({
                    _id: req.body._id
                }).exec(res.handle(function(record) {
                    if (!record) {
                        res.status(404).send();
                    } else {
                        utils.extend(record, [req.body]);
                        record.save(save);
                    }
                }));
            } else {
                (new Product(req.body).save(save));
            }

            function save(err, record) {
                res.handle(function(record) {
                    res.send(record);
                })(err, record);
            }
        }]
    },

    remove: {
        description: 'Remove product',
        method: 'delete',
        auth: true,
        handlers: [function(req, res, next) {
            var data = req.query;

            if (!utils.isNonEmptyString(data._id)) {
                return res.status(500).send('Options wrong');
            }

            Product.remove({
                _id: data._id
            }).exec(res.handle(function() {
                res.send();
            }));
        }]
    },

    uploadProductImage: {
        description: 'Upload Profile picture',
        method: 'post',
        auth: true,
        handlers: [function(req, res) {
            var gfs = Grid(mongoose.connection.db, mongoose.mongo),
                file = req.files[Object.keys(req.files)[0]],
                resolutions = [{
                    width: 100,
                    height: 100
                }, {
                    width: 540,
                    height: 540
                }, {
                    width: 900,
                    height: 900
                }];

            async.each(resolutions, function(resolution, callback) {
                var wstream = gfs.createWriteStream({
                    filename: file.name + '-' + resolution.width + 'x' + resolution.height,
                    mode: 'w',
                    metadata: {
                        originalname: file.originalname,
                        mimetype: file.mimetype
                    }
                });

                gm(fs.createReadStream(file.path))
                    .resize(resolution.width, resolution.height)
                    .stream()
                    .pipe(wstream);

                wstream.on('close', function() {
                    callback();
                });

                wstream.on('error', function(err) {
                    callback(err);
                });
            }, res.handle(function() {
                fs.unlink(file.path, res.handle(function() {
                    res.send('/gridfs/' + file.name);
                }));
            }));
        }]
    }

};
