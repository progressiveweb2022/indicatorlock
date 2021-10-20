var mongoose = require('mongoose'),
    auth = require('../libraries/auth'),
    utils = require('../shared/js/utils.js'),
	enums = require('../shared/js/enums.js'),
	Faq = mongoose.model('Faq');

module.exports = {

	getById: {
		description: 'Get faq by _id',
		method: 'get',
		cache: false,
		auth: false,
		handlers: [function(req, res, next){
			Faq.getOne({ _id: req.query._id }).exec(function(err, record){
				if(err){
					res.status(500).send();
					console.log(err);
				}
				else
					res.send(record);
			});
		}]
	},

	getAll: {
		description: 'Get all faqs',
		method: 'get',
		isArray: true,
		auth: false,
		handlers: [function(req, res, next){
			Faq.getAll().exec(function(err, records){
		    	if(err){
					res.status(500).send();
					console.log(err);
				}
				else
					res.send(records);
		    });
		}]
	},

	filter: {
		description: 'Filter faqs',
		method: 'post',
		auth: false,
		handlers: [function(req, res, next){
			Faq
            	.getAll()
            	.filter(req.body.query)
            	.sort(req.body.sort)
            	.paginate(req.body.offset, req.body.length, function(err, result){
            		if(err){
						res.status(500).send();
						console.log("Error: "+err);
					}
					else
						res.send(result);
            	});
		}]
	},

	save: {
		description: 'Save faq',
		method: 'post',
		auth: [enums.usertype.admin.value],
		handlers: [function(req, res, next){
			var _id = req.body._id;
			if(_id)
				Faq.getOne({ _id: req.body._id }).exec(function(err, record){
					if(err) {
						res.status(500).send();
						console.log(err);
					}
					if(!record)
						res.status(404).send();
					else {
						utils.extend(record, [req.body]);
						record.save(save);
					}
				});
			else
				(new Faq(req.body).save(save));

			function save(err, record){
				if(err)
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
		handlers: [function(req, res){
			var _id = req.body._id,
				diff = req.body.diff;

			Faq.getOne({ _id: _id }).exec(function(err, record){
				if(err){
					res.status(500).send();
					console.log(err);
				}
				else if(!record)
					res.status(404).send();
				else
					record.changepriority(diff, function(err){
						if(err){
							res.status(500).send();
							console.log(err);
						}
						else
							res.send();
					});
			});
		}]
	},

	remove: {
		description: 'Remove faq',
		method: 'post',
		auth: [enums.usertype.admin.value],
		handlers: [function(req, res, next){
			Faq
				.getOne({ _id: req.body._id })
				.exec(function(err, record){
					if(err){
						res.status(500).send();
						console.log(err);
					}
					else if(!record)
						res.status(404).send();
					else
						record.markDeleted(function(err){
							if(err){
								res.status(500).send();
								console.log(err);
							}
							else
								res.send();
						});
				});
		}]
	}

};