var utils = require('../shared/js/utils.js'),
	enums = require('../shared/js/enums.js'),
	file = require('../libraries/file'),
	App = require('mongoose').model('App');

module.exports = {

	getOne: {
		description: 'Get App',
		method: 'get',
		cache: false,
		auth: false,
		handlers: [function(req, res, next){
			App.getOne().exec(function(err, record){
				if(err){
					res.status(500).send();
					console.log(err);
				}
				else
					res.send(record);
			});
		}]
	},

	save: {
		description: 'Save App',
		method: 'post',
		auth: [enums.usertype.admin.value],
		handlers: [function(req, res, next){
			var _id = req.body._id;
			if(_id)
				App.getOne({ _id: req.body._id }).exec(function(err, record){
					if(err) {
						res.status(500).send();
						console.log(err);
					}
					if(!record)
						res.status(404).send();
					else {
						utils.extend(record, [req.body]);
						record.save(function (err, record){
							if(err)
								res.status(500).send();
							else
								res.send(record);
						});
					}
				});
			else {
				res.status(500).send();
				console.log('Wrong params');
			}
		}]
	},
	uploadImage: {
		description: 'Upload image',
		method: 'post',
		auth: [enums.usertype.admin.value],
		handlers: [file.resolutions, file.uploadImage('./uis/guest/public', './uploads/img/app')]
	}
};