var utils = require('../shared/js/utils.js'),
	enums = require('../shared/js/enums.js'),
	About = require('mongoose').model('About');

module.exports = {

	getOne: {
		description: 'Get about',
		method: 'get',
		cache: false,
		auth: false,
		handlers: [function(req, res, next){
			About.getOne().exec(function(err, record){
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
		description: 'Save about',
		method: 'post',
		auth: [enums.usertype.admin.value],
		handlers: [function(req, res, next){
			var _id = req.body._id;
			if(_id)
				About.getOne({ _id: req.body._id }).exec(function(err, record){
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