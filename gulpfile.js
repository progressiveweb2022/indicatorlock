var gulp = require('gulp'),
    shell = require('gulp-shell'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-watch'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    config = require('./config'),
    core = require('./libraries/core'),
    fs = require('fs'),
    async = require('./shared/js/async'),
    mkdirp = require('mkdirp'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    useref = require('gulp-useref');

var uis = fs.readdirSync(config.uisPath);

gulp.task('build-ngpack', shell.task(uis.map(function (ui) {
    return 'cd ' + path.join(config.uisPath, ui) + '&& ngpack build';
})));

gulp.task('watch-ngpack', ['build-ngpack'], function () {
    uis.forEach(function (ui) {
        var uiPath = path.join(config.uisPath, ui),
            moduleJSFilesPath = path.join(uiPath, config.publicPath, 'modules', './**/*.js'),
            ngpackConfigPath = path.join(uiPath, 'ngpack.json');

        watch([moduleJSFilesPath, ngpackConfigPath], function () {
            gulp.start('build-ngpack');
        });
    });
});

gulp.task('move-ngpack-html', function () {
    uis.forEach(function (ui) {
        var uiPath = path.join(config.uisPath, ui),
            moduleHTMLBasePath = path.join(uiPath, config.publicPath, 'modules');
            moduleHTMLFilesPath = path.join(moduleHTMLBasePath, './**/*.html');

        gulp
            .src(moduleHTMLFilesPath, { base: path.join(uiPath, config.publicPath) })
            .pipe(gulp.dest(path.join(config.uisPath, ui, config.buildPath)));
    });
});

gulp.task('move-shared', function () {
    var s = gulp.src('./shared/**', { base: './shared' });
    uis.forEach(function (ui) {
        s.pipe(gulp.dest(path.join(config.uisPath, ui, config.publicPath, 'shared_components')));
    });
});

gulp.task('watch-shared', ['move-shared'], function () {
    watch(['./shared/**/*.js'], function () {
        gulp.start('move-shared');
    });
});

gulp.task('start-server', function () {
    return nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['node_modules/*', 'uis/*'],
        env: {
            'NODE_ENV': 'development'
        }
    });
});

gulp.task('write-api', function (callback) {
    core.createModels();
    var routesAsJSON = JSON.stringify(core.getRoutes());
    async.each(uis, function (ui, cb) {
        var publicAbsPath = path.join(config.uisPath, ui, config.publicPath);
        mkdirp(publicAbsPath, function (err) {
            if (err) {
                cb(err);
            } else {
                fs.writeFile(path.join(publicAbsPath, 'api.json'), routesAsJSON, cb);
            }
        });
    }, callback);
});

gulp.task('watch-api', ['write-api'], function () {
    gulp.watch(['./routes/*.js'], ['write-api']);
});

gulp.task('install-bower-packages', shell.task(uis.map(function (ui) {
    return 'cd ' + path.join(config.uisPath, ui) + '&& bower install --allow-root';
})));

gulp.task('start', [
    'install-bower-packages',
    'watch-ngpack',
    'watch-shared',
    'watch-api',
    'start-server'
], function () {
    
});

gulp.task('database-drop', function (callback) {
    mongoose.connect(config.mongoUrl);
    mongoose.connection.on('open', function () {
        mongoose.connection.db.dropDatabase(function (err) {
            if (err) {
                callback(err);
            } else {
                mongoose.connection.close(callback);
            }
        });
    });
});

gulp.task('populate-products', function () {
    return gulp
        .src('')
        .pipe(shell(['node ./populations/populate-products']));
});

gulp.task('populate-users', function () {
    return gulp
        .src('')
        .pipe(shell(['node ./populations/populate-users']));
});

gulp.task('drop-and-populate', ['database-drop', 'populate-users'], function () {
    
});

// build
gulp.task('build-html-assets', ['install-bower-packages', 'build-ngpack', 'move-shared'], function () {
    uis.forEach(function (ui) {
        var assets = useref.assets();
    
        return gulp.src(path.join(config.uisPath, ui, config.publicPath, 'index.html'))
            .pipe(assets)
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', minifyCss({
                keepSpecialComments: 0
            })))
            .pipe(assets.restore())
            .pipe(useref())
            .pipe(gulp.dest(path.join(config.uisPath, ui, config.buildPath))); 
    });
});

gulp.task('move-bootstrap-fonts', ['install-bower-packages'], function () {
    uis.forEach(function (ui) {
        return gulp.src(path.join(config.uisPath, ui, config.publicPath, 'bower_components/bootstrap/fonts/**'))
            .pipe(gulp.dest(path.join(config.uisPath, ui, config.buildPath, 'fonts'))); 
    });
});

gulp.task('move-custom-fonts', function () {
    uis.forEach(function (ui) {
        return gulp.src(path.join(config.uisPath, ui, config.publicPath, 'fonts/**'))
            .pipe(gulp.dest(path.join(config.uisPath, ui, config.buildPath, 'fonts'))); 
    });
});

gulp.task('move-images', function () {
    uis.forEach(function (ui) {
        return gulp.src(path.join(config.uisPath, ui, config.publicPath, 'img/**'))
            .pipe(gulp.dest(path.join(config.uisPath, ui, config.buildPath, 'img'))); 
    });
});

gulp.task('move-api-json', ['write-api'], function () {
    uis.forEach(function (ui) {
        return gulp.src(path.join(config.uisPath, ui, config.publicPath, 'api.json'))
            .pipe(gulp.dest(path.join(config.uisPath, ui, config.buildPath))); 
    });
});

gulp.task('build', [
    'build-html-assets',
    'move-ngpack-html',
    'move-bootstrap-fonts',
    'move-custom-fonts',
    'move-images',
    'move-api-json'
], function (){

});