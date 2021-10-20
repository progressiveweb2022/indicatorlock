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
    User = mongoose.model('User');

module.exports = {
    getById: {
        description: 'Get message by id',
        method: 'get',
        auth: false,
        handlers: [function(req, res, next) {
            var data = req.query;

            var pr = Message.findOne({
                _id: data._id
            });

            pr.select(data.select).exec(res.handle(function(mess) {
                if (!mess) {
                    res.status(404).send();
                } else {
                    res.send(mess);
                }
            }));
        }]
    },
    getReceivedById: {
        description: 'Get received message by _id',
        method: 'get',
        cache: false,
        auth: [enums.usertype.admin.value, enums.usertype.user.value],
        handlers: [auth.populate(), function(req, res, next) {
            var token = req.token,
                message_id = req.query._id,
                query = {
                    _id: message_id,
                    recipientDeletedAt: null
                };

            if (token.usertype === enums.usertype.admin.value)
                query.to = null;
            else if (token.usertype === enums.usertype.user.value) {
                query['to._id'] = token.user._id;
                query['to.email'] = token.user.email;
            }

            Message
                .getOne(query)
                .exec(res.handle(function(message) {
                    if (!message)
                        res.status(404).send();
                    else
                        res.send(message);
                }));
        }]
    },
    getSumMess: {
        description: 'Get message summary',
        method: 'post',
        auth: false,
        cache: false,
        handlers: [auth.parse, function(req, res, next) {
            Message
                .find({
                    read: false
                })
                .select('')
                .exec(function(err, records) {
                    if (err) {
                        res.status(500).send();
                        console.log(err);
                    } else
                        res.send({
                            length: records.length
                        });
                });
        }]
    },
    getReceiveds: {
        description: 'Get received messages',
        method: 'post',
        cache: false,
        auth: false,
        handlers: [auth.populate(), function(req, res, next) {
            Message
                .getAll()
                .filter(req.body.query)
                .sort(req.body.sort)
                .paginate(req.body.offset, req.body.length, res.handle(function(result) {
                    res.send(result);
                }));
        }]
    },
    getAll: {
        description: 'Get all message',
        method: 'get',
        isArray: true,
        auth: false,
        handlers: [function(req, res, next) {
            Message
                .find().select('').exec(function(err, records) {
                    if (err) {
                        res.status(500).send();
                        console.log(err);
                    } else
                        res.send(records);
                });
        }]
    },
    save: {
        description: 'Save message',
        method: 'post',
        auth: true,
        handlers: [function(req, res, next) {
            var _id = req.body._id;
            if (_id) {
                Message.findOne({
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
                (new Message(req.body).save(save));
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

            Message.remove({
                _id: data._id
            }).exec(res.handle(function() {
                res.send();
            }));
        }]
    },
    sendToAdmin: {
        description: 'Send message to admin',
        method: 'post',
        auth: false,
        handlers: [function(req, res, next) {
            var message = new Message({
                from: {
                    email: req.body.email
                },
                to: null,
                subject: req.body.subject,
                body: req.body.body,
                typeTxt: req.body.type,
                name: req.body.name
            });

            message.save(res.handle(function(message) {
                res.send(message);
            }));
            var emailservice = require('../libraries/email');
            var setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
            emailservice.user = setting.userEmail;
            emailservice.pass = setting.userPass;
            var senderEmail = req.body.email;
            var senderName = req.body.name;
            var theme = req.body.subject || '(No theme)';
            Setting.getAll().exec(function(err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
                setting = Object.create(data)[0];
                var company = setting.siteName || "Company";
                var emailSubject = company + ' : ' + theme;
                var date = new Date();
                var emailBody = '<em>Date: ' + date + '</em><br /><br /><strong style="color: gray">Message Type: ' + req.body.type.toUpperCase() + '</strong><br /><h5>Name: ' + req.body.name + '</h5>' + '<p>' + req.body.body + '</p><br/><div style="color: green"><b>' + req.body.email + '</b></div>';
                var contactEmail = setting.email;
                setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
                emailservice.send(contactEmail, req.body.email, emailSubject, emailBody, function(err) {
                    if (err) {
                        res.status(500).send('Error sending email');
                        console.log('Error sending email: ', err);
                        return;
                    }
                    console.log("Good job!");
                    res.status(200).send();
                });
            });

        }]
    },
    sendToClient: {
        description: 'Send message to client',
        method: 'post',
        auth: false,
        handlers: [auth.parse, auth.populate(), function(req, res, next) {
            var emailservice = require('../libraries/email');
            var setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
            emailservice.user = setting.userEmail;
            emailservice.pass = setting.userPass;
            var senderEmail = req.body.from.email,
                senderName = req.body.name,
                emailBody = req.body.body,
                messType = req.body.type,
                theme = req.body.subject || '(No theme)';
            Setting.getAll().exec(function(err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
                setting = Object.create(data)[0];
                var company = setting.siteName || "Company";
                var emailSubject = company + ' : ' + theme;
                var date = new Date();
                console.log(req.body);
                var contactEmail = setting.email;
                setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
                emailBody = '<i>Hello ' + senderName + '</i><br />' + emailBody + '<br /><h6>Message Type: ' + messType + '</h6>';
                emailservice.send(senderEmail, contactEmail, emailSubject, emailBody, function(err) {
                    if (err) {
                        res.status(500).send('Error sending email');
                        console.log('Error sending email: ', err);
                        return;
                    }
                    console.log((++i) + ") Good Job!");
                    res.status(200).send();
                });
            });
        }]
    },
    sendToAll: {
        description: 'Send message to All',
        method: 'post',
        auth: false,
        handlers: [auth.parse, auth.populate(), function(req, res, next) {
            var emailservice = require('../libraries/email');
            var setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
            emailservice.user = setting.userEmail;
            emailservice.pass = setting.userPass;
            var emailBody = req.body.body,
                subject = req.body.subject || 'Info';
            if (req.body.theme)
                emailBody = '<h4>Theme: ' + req.body.theme + '</h4><br />' + emailBody;
            Setting.getAll().exec(function(err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
                setting = Object.create(data)[0];
                var company = setting.siteName || "Company";
                var emailSubject = company + ' : ' + subject;
                var date = new Date();
                setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
                var i = 0;
                emailservice.sendAll(emailSubject, emailBody, function(err) {
                    if (err) {
                        res.status(500).send('Error sending email');
                        console.log('Error sending email: ', err);
                        return;
                    }
                    console.log((++i) + ") Good Job!");
                    res.status(200).send();
                });
            });
        }]
    }

};
