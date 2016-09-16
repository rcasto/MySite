var express = require('express');
var path = require('path');
var Poet = require('poet');

var middleware = require('./lib/middleware');
var helpers = require('./lib/helpers');

var port = process.env.PORT || 3000;
var environment = process.env.NODE_ENV || 'development';
var app = express();
var poet = Poet(app, {
    posts: './posts/',
    postsPerPage: 2,
    metaFormat: 'json',
    routes: { },  // Use custom routes defined below
    readMoreTag: '<!--more-->',
    readMoreLink: function (post) {
        return `
            <a class='read-more-link' tabindex='0' href data-link='${post.url}'>
                Read more
            </a>
        `;
    }
});
var poetHelpers = require('./lib/poetHelpers')(poet);

// Setup PoetJS for Blogging
poet.init().then(function () {
    console.log('Poet blog engine initialized');
    console.log('Post Count:', poetHelpers.getPostCount());
    console.log('Page Count:', poetHelpers.getPageCount());
    console.log('Options:', JSON.stringify(poetHelpers.getOptions()));
}, function (err) {
    console.error(err);
});

// Set views directory and view engine, used for rendering blog posts
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

// Setup static routes
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// hasLayout middleware
app.use(middleware.hasLayout);

// Choose correct view middleware
app.use(middleware.getView);

// Request Logger middleware
app.use(middleware.logger);

function onRoute(req, res, viewData) {
    res.render(req.view, viewData);
}

function onBlogsRoute(req, res, page) {
    if (poetHelpers.isValidPage(page)) {
        onRoute(req, res, {
            environment: environment,
            posts: poetHelpers.getPostsForPage(page),
            page: page,
            numPages: poetHelpers.getPageCount()
        });
    } else {
        res.status(404).send('Thats an invalid page number');
    }
}

// Home page route, same as /blogs/1
app.get('/', (req, res) => onBlogsRoute(req, res, 1));

// About page route
app.get('/about', (req, res) => onRoute(req, res, {
    environment: environment
}));

// Resume page route
app.get('/resume', (req, res) => onRoute(req, res, {
    environment: environment
}));

// Multi-blog route
poet.addRoute('/blogs/:page', (req, res) => {
    var page = helpers.stringToNum(req.params.page);
    if (isNaN(page)) {
        res.status(404).send('Invalid page requested.');
    } else {
        onBlogsRoute(req, res, page);
    }
});

// Individual blog route
poet.addRoute('/blog/:post', (req, res) => {
    var post = poetHelpers.getPost(req.params.post);
    if (post) {
        onRoute(req, res, {
            environment: environment,
            post: post
        });
    } else {
        res.status(404).send('Thats not a valid post title');
    }
});

// Page API
app.get('/api/pagecount', function (req, res) {
    res.status(200).json(poetHelpers.getPageCount());
});

// Start the server
app.listen(port, function () {
    console.log('Server listening on port', port);
});