var querystring = require('querystring'),
	urlparser = require('url'),
	utils = require('../shared/js/utils');

var Request = module.exports = function(options, protocol){
	var self = this;
	self.provider = require(protocol);
	self.options = options;
};

utils.extend(Request.prototype, {

	send: function(options, data, callback){
		var self = this,
			opts = utils.merge(self.options, options),
			req = self.provider.request(opts, self._collectChunks(callback));

		if(options.method === 'POST') req.write(JSON.stringify(data), 'utf8');
		req.on('error', callback);
		req.end();
	},

	_collectChunks: function(callback){
		return function(res){
			var chunks = '';
			res.setEncoding('utf8');

			res.on('data', function (chunk) {
				chunks += chunk;
			});

			res.on('end', function(){
				try {
					var result = JSON.parse(chunks);
					callback(null, result, res);
				}
				catch(err){
					callback(err);
				}
			});
		}
	},

	get: function(pathname, query, callback){
		var self = this,
			path = urlparser.format({ pathname: pathname, query: query || {} });

		self.send({ path: path, method: 'GET' }, null, callback);
	},

	post: function(pathname, query, data, callback){
		var self = this,
			path = urlparser.format({ pathname: pathname, query: query || {} });

		self.send({ path: path, method: 'POST' }, data, callback);
	}

}, [Array]);