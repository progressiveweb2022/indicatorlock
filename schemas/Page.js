var mongoose = require('mongoose'),
	nodeutils = require('util'),
	utils = require('../shared/js/utils'),
	enums = require('../shared/js/enums'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

function PageSchema() {
	var self = this;
    Schema.apply(self, arguments);

    self.add({
    	type: String
    });
}

nodeutils.inherits(PageSchema, Schema);
module.exports = PageSchema;