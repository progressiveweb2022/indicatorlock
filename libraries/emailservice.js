var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'xiogoperus@gmail.com',
        pass: 'xiogoperus'
    }
});

module.exports = {
	send: function(to, subject, body, callback){
		transporter.sendMail({
			from: 'xiogoperus@gmail.com',
			to: to,
			subject: subject,
			html: body
		}, callback);
	}
};