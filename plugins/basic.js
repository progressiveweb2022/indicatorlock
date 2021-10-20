var utils = require('../shared/js/utils');

module.exports = function(schema){
	schema.add({
		hidden: {
			type: Boolean,
			default: false
		},

		createdAt: {
			type: Date,
			default: Date.now
		},

		deletedAt: {
			type: Date
		}
	});

	schema.pre('save', function (next) {
	    this.wasNew = this.isNew;
	    next();
	});

	utils.extend(schema.statics, [{
		getAll: function(criteria, projection){
			return this.find.call(this, criteria, projection).where('deletedAt').equals(null);
		},

		getOne: function(criteria, projection){
			return this.findOne.call(this, criteria, projection).where('deletedAt').equals(null);
		},

		count: function(){
			return this.count().where('deletedAt').equals(null);
		}
	}]);

	utils.extend(schema.methods, [{
		markDeleted: function(callback){
			this.deletedAt = Date.now();
			this.save(callback);
		}
	}]);
};