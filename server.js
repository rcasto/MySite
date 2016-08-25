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

// Setup PoetJS for Blogging
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

// Set views directory and view engine, used for rendering blog posts
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

// Setup static routes
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Homepage route
app.get('/', function (req, res) {
    res.render('index', {
        environment: environment
    });
});

// Blog API endpoint
app.get('/api/blog/:post?', function (req, res) {
    if (req.params.post) {
        var post = poet.helpers.getPost(req.params.post);
        if (post) {
            res.json(post);
        } else {
            res.sendStatus(404);
        }
    } else {
         var numPosts = poet.helpers.getPostCount();
         var posts = poet.helpers.getPosts(0, numPosts);
         res.json(posts);
    }
});

// Start the server
app.listen(port, function () {
  console.log('Server listening on port', port);
});