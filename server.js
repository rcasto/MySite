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
    routes: { }  // Use custom routes defined below
});

function getPostsForPage(page) {
    var postsPerPage = poet.helpers.options.postsPerPage;
    return poet.helpers.getPosts(
        (page - 1) * postsPerPage,
        page * postsPerPage
    );
}

function isValidPage(page) {
    var numPages = poet.helpers.getPageCount();
    return page > 0 && page <= numPages;
}

// Setup PoetJS for Blogging
poet.init().then(function () {
    console.log('Poet blog engine initialized');
    console.log('Post Count:', poet.helpers.getPostCount());
    console.log('Page Count:', poet.helpers.getPageCount());
    console.log('Options:', JSON.stringify(poet.helpers.options));
}, function (err) {
    console.error(err);
});

poet.addRoute('/blog/:post', function (req, res) {
    var post = poet.helpers.getPost(req.params.post);
    if (post) {
        res.render('blog', {
            environment: environment,
            post: post
        });
    } else {
        res.status(404).send('Thats not a valid post title');
    }
});

poet.addRoute('/blogs/:page', function (req, res) {
    var page = req.params.page;
    if (isValidPage(page)) {
        res.render('blogs', {
            environment: environment,
            posts: getPostsForPage(page),
            page: page
        });
    } else {
        res.status(404).send('Thats an invalid page number');
    }
});

// Set views directory and view engine, used for rendering blog posts
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

// Setup static routes
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Homepage route
app.get('/', function (req, res) {
    res.render('blogs', {
        environment: environment,
        posts: getPostsForPage(1),
        page: 1
    });
});

// Start the server
app.listen(port, function () {
    console.log('Server listening on port', port);
});