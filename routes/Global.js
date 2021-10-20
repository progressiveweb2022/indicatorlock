var mongoose = require('mongoose'),
	utils = require('../shared/js/utils.js'),
	auth = require('../libraries/auth'),
	file = require('../libraries/file'),
	enums = require('../shared/js/enums.js'),
	Global = mongoose.model('Global');

module.exports = {

	getOne: {
		description: 'Get global',
		method: 'get',
		cache: false,
		auth: false,
		handlers: [function(req, res, next){
			Global.getOne().exec(function(err, record){
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
		description: 'Save global',
		method: 'post',
		auth: [enums.usertype.admin.value],
		handlers: [function(req, res, next){
			var _id = req.body._id;
			if(_id)
				Global.getOne({ _id: req.body._id }).exec(function(err, record){
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
		handlers: [file.resolutions, file.uploadImage('./uis/guest/public', './uploads/img/global')]
	}

};