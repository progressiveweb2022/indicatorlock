var mongoose = require('mongoose'),
	nodeutils = require('util'),
	utils = require('../shared/js/utils'),
	enums = require('../shared/js/enums'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

function Notification() {
	var self = this;
    Schema.apply(self, arguments);

    self.add({
		text: String,
		type: {
			type: String,
			enums: enums.getValues('notificationtype')
		}
    });
}

nodeutils.inherits(Notification, Schema);
module.exports = Notification;