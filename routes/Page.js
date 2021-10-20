var utils = require('../shared/js/utils.js'),
	enums = require('../shared/js/enums.js'),
	Page = require('mongoose').model('Page');

module.exports = {

	getAll: {
		description: 'Get all pages',
		method: 'get',
		isArray: true,
		auth: false,
		handlers: [function(req, res, next){
			Page.getAll().exec(function(err, records){
		    	if(err){
					res.status(500).send();
					console.log(err);
				}
				else
					res.send(records);
		    });
		}]
	}

};