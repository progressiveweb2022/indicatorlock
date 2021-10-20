var mongoose = require('mongoose'),
    config = require('../config'),
    fs = require('fs'),
    tempFileName = './configTemp.json',
    utils = require('../shared/js/utils.js'),
    auth = require('../libraries/auth'),
    file = require('../libraries/file'),
    enums = require('../shared/js/enums.js'),
    Setting = mongoose.model('Setting');

module.exports = {

    getOne: {
        description: 'Get setting',
        method: 'get',
        cache: false,
        auth: false,
        handlers: [function(req, res, next) {
            Setting.getOne().exec(function(err, record) {
                if (err) {
                    res.status(500).send();
                    console.log(err);
                } else
                    res.send(record);
            });
        }]
    },
    save: {
        description: 'Save setting',
        method: 'post',
        auth: [enums.usertype.admin.value],
        handlers: [function(req, res, next) {
            var _id = req.body._id;
            if (_id)
                Setting.getOne({
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
                (new Setting(req.body).save(save));

            function save(err, record) {
                if (err)
                    res.status(500).send();
                else {
                    res.send(record);
                    var userTemp = record;
                    fs.writeFile(tempFileName, JSON.stringify(userTemp, null, 4), function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Configuration saved!");
                        }
                    });

                    fs.readFile(tempFileName, 'utf8', function(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        data = JSON.parse(data);
                        console.info(data);
                    });
                }
            }
        }]
    },
    uploadImage: {
        description: 'Upload image',
        method: 'post',
        auth: [enums.usertype.admin.value],
        handlers: [file.resolutions, file.uploadImage('./uis/guest/public', './uploads/img')]
    }

};
