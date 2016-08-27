var express = require('express');
var path = require('path');
var Poet = require('poet');

var port = process.env.PORT || 3000;
var environment = process.env.NODE_ENV || 'development';
var app = express();
var poet = Poet(app, {
    posts: './posts/',
    postsPerPage: 5,
    metaFormat: 'json',
    routes: {
        '/blog/:post': 'blog',
        '/blogs/:page': 'blogs'
    }
});

// Setup PoetJS for Blogging
poet.init().then(function () {
    console.log('Poet blog engine initialized');
    console.log('Post Count:', poet.helpers.getPostCount());
    console.log('Page Count:', poet.helpers.getPageCount());
    console.log('Options:', JSON.stringify(poet.helpers.options));
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
    res.render('layout', {
        environment: environment
    });
});

// Start the server
app.listen(port, function () {
    console.log('Server listening on port', port);
});