function Perror(message) {
    var self = this;
    self.name = 'Perror';
    self.message = message || 'Server Error';
}

Perror.prototype = Object.create(Error.prototype);
Perror.prototype.constructor = Perror;

module.exports = Perror;