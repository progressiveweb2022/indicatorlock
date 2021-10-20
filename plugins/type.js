var utils = require('../shared/js/utils');

module.exports = function(schema, options){
	var type = options.type;

	utils.extend(schema.statics, [{
		getAll: function(criteria, projection){
			return this.find.call(this, criteria, projection)
				.where('deletedAt').equals(null)
				.where('type').equals(options.type);
		},

		getOne: function(criteria, projection){
			return this.findOne.call(this, criteria, projection)
				.where('deletedAt').equals(null)
				.where('type').equals(options.type);
		}
	}]);

	schema.pre('save', function(next){
		this.type = options.type;
		next();
	});
};