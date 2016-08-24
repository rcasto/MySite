var express = require('express');
var path = require('path');
var Poet = require('poet');

var port = process.env.PORT || 3000;
var environment = process.env.NODE_ENV || 'development';
var app = express();

var poet = Poet(app, {
   posts: './posts/',
   postsPerPage: 5,
   metaFormat: 'json'
});

poet.addRoute('/blog/:post', function (req, res) {
    var post = poet.helpers.getPost(req.params.post);
    if (post) {
        res.render('blog', post);
    } else {
        res.sendStatus(404);
    }
}).init().then(function () {
   console.log('Poet blog engine initialized'); 
}, function (err) {
    console.error(err);
});

// set views directory, used for rendering blog posts
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

// Setup static routes
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Middleware to apply CORS headers for GitHub
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Homepage route
app.get('/', function (req, res) {
    res.render('index', {
        environment: environment
    });
});

// blog api endpoint
app.get('/api/blog/:post', function (req, res) {
    var post = poet.helpers.getPost(req.params.post);
    if (post) {
        res.json(post);
    } else {
        res.sendStatus(404);
    }
});

// Start the server
app.listen(port, function () {
  console.log('Server listening on port', port);
});