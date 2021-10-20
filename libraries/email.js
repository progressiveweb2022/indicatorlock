var nodemailer = require('nodemailer'),
    fs = require('fs'),
    tempFileName = './configTemp.json',
    mongoose = require('mongoose'),
    Subscribe = mongoose.model('Subscribe'),
    setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
    from = setting.email,
    subject = setting.siteName,
    user = setting.userEmail,
    pass = setting.userPass;
module.exports = {
    send: function(to, frm, subj, body, callback) {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: user,
                pass: pass
            }
        });
        transporter.sendMail({
            from: frm,
            to: to,
            subject: subj,
            html: body
        }, callback);
    },
    sendAll: function(subj, body, callback) {
        Subscribe.getAll().exec(function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            if (subj)
                subject = subj;
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: user,
                    pass: pass
                }
            });
            var to = null;
            data.forEach(function(item, i) {
                (function(index) {
                    setTimeout(function() {
                        to = item.email;
                        transporter.sendMail({
                            from: from,
                            to: to,
                            subject: subject,
                            html: body
                        }, callback);

                    }, i * 1000);
                })(i);
            });
        });
    }
};
