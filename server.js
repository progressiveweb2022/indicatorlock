var clargs = require('optimist').argv,
    express = require('express'),
    app = express(),
    port = process.env.PORT || clargs.port || 8886,
    server = app.listen(port),
    path = require('path'),
    mongoose = require('mongoose'),
    multer = require('multer'),
    Grid = require('gridfs-stream'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    core = require('./libraries/core'),
    errorhandler = require('./libraries/errorhandler'),
    fs = require('fs'),
    config = require('./config'),
    enums = require('./shared/js/enums'),
    tempFileName = './configTemp.json',
    environment = app.get('env'),
    paypal = require('paypal-rest-sdk');

// configure payPal
paypal.configure(config.payPal);

// additional libraries
require('./libraries/mongoose-query');

// connect to database
mongoose.connect(config.mongoUrl);

// moddleware
app.use(cookieParser());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(multer({
    dest: __dirname + '/temp'
}));
app.use(errorhandler());

// init core
core.createModels();
core.listenRoutes(app);
var setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
// read user interfaces
var uis = fs.readdirSync(config.uisPath);

uis.forEach(function(ui) {
    // mount sub app
    var subApp = express();
    app.use('/' + ui, subApp);

    // serve static files
    var staticFolderPath = environment === 'development' ? config.publicPath : config.buildPath;
    subApp.use(express.static(path.join(__dirname, config.uisPath, ui, staticFolderPath), {
        index: 'none'
    }));

    // serve layout
    subApp.get('/' + setting.siteLang + '/product/out/view', function(req, res) {
        var product_id = req.query.product_id;
        if (!product_id) {
            res.status(404).send();
        } else {
            mongoose.model('Product')
                .findOne({
                    _id: product_id
                })
                .exec(res.handle(function(product) {
                    handleMainHtml(product.name, htmlToText(product.description) + 'f', req.protocol + '://' + req.get('Host') + product.images[0] + '-540x540', setting.siteUrl + '/guest/en/product/out/view?product_id=' + product._id)(req, res);
                }));
        }
    });

    subApp.get('*', function(req, res) {
        handleMainHtml(setting.siteName, setting.siteDesc, req.protocol + '://' + req.get('Host') + '/guest/img/about.png', setting.siteUrl)(req, res);
    });
    function htmlToText(myString) {
        return myString.replace(/<(?:.|\n)*?>/gm, '');
    }
    function handleMainHtml(fbPreviewName, fbPreviewDesc, fbPreviewImage, fbPreviewUrl) {
        return function(req, res) {
            var mainHtmlPath = path.resolve(__dirname, config.uisPath, ui, staticFolderPath, './index.html');
            fs.readFile(mainHtmlPath, 'utf8', res.handle(function(html) {
                html = html
                    .replace('<%= metaKey %>', setting.metaKeywords)
                    .replace('<%= metaDesc %>', setting.metaDesc)
                    .replace('<%= fbAppId %>', config.fbAppId)
                    .replace('<%= fbPreviewName %>', fbPreviewName)
                    .replace('<%= fbPreviewDesc %>', fbPreviewDesc)
                    .replace('<%= fbPreviewUrl %>', fbPreviewUrl)
                    .replace('<%= fbPreviewImage %>', fbPreviewImage);
                res.send(html);
            }));
        }
    }
});
// create pages
var Page = mongoose.model('Page');
enums.enumerate('pagetype').forEach(function(pt) {
    Page.getOne({
        type: pt.value
    }).exec(function(err, page) {
        if (err)
            console.log(err);
        else if (!page) {
            page = new Page({
                type: pt.value
            });
            page.save(function(err, page) {
                if (err)
                    console.log(err);
                else if (clargs.env === 'dev')
                    console.log('Page', pt.value, 'created');
            });
        }
    });
});
// serves images from mongo
app.get('/gridfs/:filename', function(req, res) {
    var gfs = Grid(mongoose.connection.db, mongoose.mongo),
        filename = req.params.filename;

    gfs.exist({
        'filename': filename
    }, res.handle(function(exists) {
        if (!exists) {
            res.status(404).send();
        } else {
            var rs = gfs.createReadStream({
                'filename': filename
            });

            rs.on('error', function(err) {
                res.handle(function() {})(err);
            });

            rs.pipe(res);
        }
    }));
});

// redirect to guest interface
app.get('/', function(req, res) {
    var tempFileName = './configTemp.json',
        setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
    var lang = setting.siteLang || 'en';
    res.redirect('/guest/' + lang + '/');
});
//The 404 Route
app.get('*', function(req, res) {
    var tempFileName = './configTemp.json',
        setting = JSON.parse(fs.readFileSync(tempFileName, 'utf8'));
    var lang = setting.siteLang || 'en';
    res.redirect('/guest/' + lang + '/err404');
});
app.get('/api', function(req, res) {
    res.send("Indicatorlock API");
});
// app.get('/api/admin/uploadFile', function(req, res) {
//     res.send("Indicatorlock API");
// });
