var mongoose = require('mongoose'),
	utils = require('../shared/js/utils'),
	enums = require('../shared/js/enums');

module.exports = {

	parse: function(req, res, next){
		if(req.token) {
			next();
		} else {
		    var Token = mongoose.model('Token');
		    var t = req.cookies.token || req.query.token || req.body.token;
		
		    if(!t) {
		        next();
		    } else {
		        Token.findOne({ value: t }).exec(res.handle(function(token){
		            if (!token) {
		                next();
		            } else {
		                req.token = token;
		                next();
		            }
		        }));
		    }
		}
    },

    check: function(auth){
		return function(req, res, next){
			if(auth === false || req.token) {
				next();
			} else {
				res.status(401).send();
			}
		}
	},

	populate: function(options){
		return function(req, res, next){
			var token = req.token;
			if(token) {
				token.populate(utils.extend({
					path: 'user',
					model: 'User'
				}, [options || {}]), res.handle(function(token){
				    next();
				}));
			} else {
				next();
			}
		};
 	}
 	
};