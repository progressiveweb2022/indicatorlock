var mongoose = require('mongoose'),
	utils = require('../shared/js/utils.js'),
	auth = require('../libraries/auth'),
	enums = require('../shared/js/enums.js'),
	Videos = mongoose.model('Videos');

module.exports = {

	getOne: {
		description: 'Get video',
		method: 'get',
		cache: false,
		auth: false,
		handlers: [function(req, res, next){
			Videos.getOne().sort(req.body.sort).exec(function(err, record){
				if(err){
					res.status(500).send();
					console.log(err);
				}
				else
					res.send(record);
			});
		}]
	},
	filter: {
		description: 'Filter video',
		method: 'post',
		auth: false,
		handlers: [function(req, res, next){
			Videos
            	.getOne()
            	.sort(req.body.sort)
            	.exec(function(err, result){
            		if(err){
						res.status(500).send();
						console.log(err);
					}
					else
						res.send(result);
            	});
		}]
	},
	save: {
		description: 'Save video',
		method: 'post',
		auth: [enums.usertype.admin.value],
		handlers: [function(req, res, next){
			var _id = req.body._id;
			if(_id)
				Videos.getOne({ _id: req.body._id }).exec(function(err, record){
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
	}

};