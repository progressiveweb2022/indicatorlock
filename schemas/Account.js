var mongoose = require('mongoose'),
	crypto = require('crypto'),
	nodeutils = require('util'),
	utils = require('../shared/js/utils'),
	enums = require('../shared/js/enums'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Schema.Types.ObjectId;

function AccountSchema() {
	var self = this;
    Schema.apply(self, arguments);

    // add fields
    self.add({
		hashedpassword: String,
		salt: String
    });

    // sensitive data
    self.set('toJSON', {
	    transform: function(doc, user, options) {
	        delete user.__v;
		    delete user.id;
	        delete user.hashedpassword;
	        delete user.salt;
	        return user;
	    }
	});

	self.virtual('password').set(function(plainText){
		this.salt = this.makeSalt();
		this.hashedpassword = this.encryptPassword(plainText);
	});

	// extend model methods
	utils.extend(self.methods, [{
		authenticate: function(plainText){
			return this.encryptPassword(plainText) === this.hashedpassword;
		},

		encryptPassword: function(password){
			return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
		},

		makeSalt: function(){
			return Math.round((new Date().valueOf() * Math.random())) + '';
		}
	}]);
}

nodeutils.inherits(AccountSchema, Schema);
module.exports = AccountSchema;