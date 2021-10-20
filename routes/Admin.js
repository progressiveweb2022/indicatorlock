var utils = require('../shared/js/utils.js'),
    file = require('../libraries/file'),
    enums = require('../shared/js/enums.js');

module.exports = {
    uploadFile: {
        description: 'Upload image',
        method: 'post',
        auth: false,
        handlers: [file.uploadfile('./uis/guest/public', './uploads/img/ckeditor')]
    }
};
