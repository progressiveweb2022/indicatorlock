var utils = require('../shared/js/utils'),
	async = require('../shared/js/async');

module.exports = function(schema){
	schema.add({
		priority: Number
	});

	schema.pre('save', function(next){
		var current = this,
			Model = current.constructor;

		if(current.priority)
			next();
		else
			Model
				.getOne({
					_id: { $ne: current._id }
				})
				.sort({ priority: -1 }).exec(function(err, last){
					if(err)
						next(err);
					else {
						current.priority = last? last.priority + 1 : 1;
						next();
					}
				});
	});

	utils.extend(schema.methods, [{
		changepriority: function(diff, callback){
			var current = this,
				Model = current.constructor,
				targetpriority = current.priority + diff;

			Model.getOne({ priority: targetpriority }).exec(function(err, target){
				if(err)
					callback(err);
				else if(!target)
					callback();
				else
					async.parallel([
						function(callback){
							target.priority = current.priority;
							target.save(callback);
						},
						function(callback){
							current.priority = targetpriority;
							current.save(callback);
						}
					], callback);
			});
		}
	}]);
};