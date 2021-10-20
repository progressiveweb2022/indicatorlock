var utils = require('../shared/js/utils.js'),
    enums = require('../shared/js/enums.js'),
    async = require('../shared/js/async.js'),
    fs = require('fs'),
    tempFileName = './configTemp.json',
    config = require('../config'),
    auth = require('../libraries/auth'),
    mongoose = require('mongoose'),
    Message = mongoose.model('Message'),
    Setting = mongoose.model('Setting'),
    Subscribe = mongoose.model('Subscribe');

module.exports = {

    getAll: {
        description: 'Get all slides',
        method: 'get',
        isArray: true,
        auth: false,
        handlers: [function(req, res, next) {
            Subscribe.getAll().exec(function(err, records) {
                if (err) {
                    res.status(500).send();
                    console.log(err);
                } else
                    res.send(records);
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
                Subscribe.getOne({
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
                (new Subscribe(req.body).save(save));

            function save(err, record) {
                if (err)
                    res.status(500).send();
                else
                    res.send(record);
            }
        }]
    }
};
