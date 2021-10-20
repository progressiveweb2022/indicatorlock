var utils = require('../shared/js/utils'),
    enums = require('../shared/js/enums'),
    file = require('../libraries/file'),
    Slide = require('mongoose').model('Slide');

module.exports = {

    getById: {
        description: 'Get slide by _id',
        method: 'get',
        cache: false,
        auth: false,
        handlers: [function(req, res, next) {
            Slide.getOne({
                _id: req.query._id
            }).exec(function(err, record) {
                if (err) {
                    res.status(500).send();
                    console.log(err);
                } else
                    res.send(record);
            });
        }]
    },

    getAll: {
        description: 'Get all slides',
        method: 'get',
        isArray: true,
        auth: false,
        handlers: [function(req, res, next) {
            Slide.getAll().exec(function(err, records) {
                if (err) {
                    res.status(500).send();
                    console.log(err);
                } else
                    res.send(records);
            });
        }]
    },

    filter: {
        description: 'Filter slides',
        method: 'post',
        auth: false,
        handlers: [function(req, res, next) {
            Slide
                .getAll()
                .filter(req.body.query)
                .sort(req.body.sort)
                .paginate(req.body.offset, req.body.length, function(err, result) {
                    if (err) {
                        res.status(500).send();
                        console.log(err);
                    } else
                        res.send(result);
                });
        }]
    },

    save: {
        description: 'Save slide',
        method: 'post',
        auth: [enums.usertype.admin.value],
        handlers: [function(req, res, next) {
            var _id = req.body._id;
            if (_id)
                Slide.getOne({
                    _id: req.body._id
                }).exec(function(err, record) {
                    if (err) {
                        res.status(500).send();
                        console.log(err);
                    }
                    if (!record)
                        res.status(404).send();
                    else {
                        utils.extend(record, [req.body]);
                        record.save(save);
                    }
                });
            else
                (new Slide(req.body).save(save));

            function save(err, record) {
                if (err)
                    res.status(500).send();
                else
                    res.send(record);
            }
        }]
    },

    changePriority: {
        description: 'Set priority',
        method: 'post',
        auth: [enums.usertype.admin.value],
        handlers: [function(req, res) {
            var _id = req.body._id,
                diff = req.body.diff;

            Slide.getOne({
                _id: _id
            }).exec(function(err, record) {
                if (err) {
                    res.status(500).send();
                    console.log(err);
                } else if (!record)
                    res.status(404).send();
                else
                    record.changepriority(diff, function(err) {
                        if (err) {
                            res.status(500).send();
                            console.log(err);
                        } else
                            res.send();
                    });
            });
        }]
    },

    remove: {
        description: 'Remove slide',
        method: 'post',
        auth: [enums.usertype.admin.value],
        handlers: [function(req, res, next) {
            Slide
                .getOne({
                    _id: req.body._id
                })
                .exec(function(err, record) {
                    if (err) {
                        res.status(500).send();
                        console.log(err);
                    } else if (!record)
                        res.status(404).send();
                    else
                        record.markDeleted(function(err) {
                            if (err) {
                                res.status(500).send();
                                console.log(err);
                            } else
                                res.send();
                        });
                });
        }]
    },
    uploadImage: {
        description: 'Upload image',
        method: 'post',
        auth: [enums.usertype.admin.value],
        handlers: [file.resolutions, file.uploadImage('./uis/guest/public', './uploads/img/slide')]
    }

};
