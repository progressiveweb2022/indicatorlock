var async = require('../shared/js/async.js'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    gm = require('gm').subClass({ imageMagick: true });

module.exports = {
	resolutions: function(req, res, next){
        var resolutions = req.body.resolutions;
        if(typeof resolutions === 'string'){
            try {
                req.body.resolutions = JSON.parse(resolutions);
                next();
            }
            catch(ex){
                res.status(500).send();
                console.log(ex);
            }
        }
        else if(resolutions)
            next();
        else
            res.status(500).send();
    },

    uploadfile: function(modulePath, saveToPath){
        return function(req, res, next){
            var files = req.files;
            Object.keys(files).forEach(function(key){
                var finfo = files[key],
                    dir = path.resolve(modulePath, saveToPath, finfo.name);

                mkdirp(path.resolve(modulePath, saveToPath), function(err){
                    if(err){
                        res.status(500).send();
                        console.log(err);
                    }
                    else
                        fs.rename(finfo.path, dir, function(err){
                            if(err){
                                res.status(500).send();
                                console.log(err);
                            }
                            else {
                                var absSrc = req.protocol + '://' + req.get('Host') + '/guest/' + path.join(saveToPath, finfo.name);
                                res.send(absSrc.split(path.sep).join('/'));
                            }
                        });
                });
            });
        };
    },

    uploadImage: function(modulePath, saveToPath){
    	return function(req, res, next) {
        	var resolutions = req.body.resolutions,
                files = req.files;
            Object.keys(files).forEach(function(key){
                var finfo = files[key],
                    dir = path.resolve(modulePath, saveToPath, finfo.name);

                mkdirp(dir, function(err){
                    if(err){
                        res.status(500).send("");
                        console.log(err);
                    }
                    else
                        fs.rename(finfo.path, path.join(dir, 'original.' + finfo.extension), function(err){
                            if(err){
                                res.status(500).send("");
                                console.log(err);
                            }
                            else
                                async.parallel(resolutions.map(function(resolution){
                                    return function(callback){
                                        gm(path.join(dir, 'original.' + finfo.extension))
                                            .resize(resolution.width, resolution.height)
                                            .write(path.join(dir, resolution.width + 'x' + resolution.height), callback);
                                    };
                                }), function(err){
                                    if(err){
                                        res.status(500).send("");
                                        console.log(err);
                                    }
                                    else {
                                        var absSrc = req.protocol + '://' + req.get('Host') + '/guest/' + path.join(saveToPath, finfo.name);
                                        res.send(absSrc.split(path.sep).join('/'));
                                    }
                                });
                        });
                });
            });
        };
    }
}