var mongoose = require('mongoose'),
	async = require('../shared/js/async'),
	utils = require('../shared/js/utils'),
	enums = require('../shared/js/enums');

mongoose.Query.prototype.filter = function(params) {
    var query = this;
    for(var prop in params){
        var o = params[prop];
        for(var type in o){
            var value = o[type];
            if(value !== undefined)
                switch(type){
                    case 'textbox-in':
                        query._conditions[prop] = {
                            $in: value
                        };
                        break;
                    case 'textbox-gte':
                        query._conditions[prop] = {
                            $gte: value
                        };
                        break;
                    case 'textbox-lt':
                        query._conditions[prop] = {
                            $lt: value
                        };
                        break;
                    case 'textbox-ne':
                        query._conditions[prop] = {
                            $ne: value
                        };
                        break;
                    case 'textbox-startswith':
                        query._conditions[prop] = new RegExp('^' + value, 'i');
                        break;
                    case 'textbox-like':
                        query._conditions[prop] = new RegExp(value, 'i');
                        break;
                    case 'dropdown':
                    case 'textbox-exact':
                    case 'textbox-date':
                        query._conditions[prop] = value;
                        break;
                }
        }
    }
    return query;
};

mongoose.Query.prototype.paginate = function (offset, length, callback) {
    var query = this;
    async.parallel({
        total: function (cb) {
            query.model
                .find(query._conditions)
                .count()
                .exec(cb);
        },
        records: function (cb) {
            if (offset) query.skip(offset);
            if (length) query.limit(length);
            query.exec(cb);
        }
    }, callback);
};
