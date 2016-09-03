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

function getPostsForPage(page) {
    var postsPerPage = poet.helpers.options.postsPerPage;
    return poet.helpers.getPosts(
        (page - 1) * postsPerPage,
        page * postsPerPage
    );
}

function getBasePath(path) {
    if (path) {
        let pathTokens = path.split('/');
        let pathToken = pathTokens[0];
        if (path.length > 0 &&
            path[0] === '/') {
            pathToken = pathTokens[1];
        }
        return '/' + pathToken;
    }
    return null;
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

// Set views directory and view engine, used for rendering blog posts
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

// Setup static routes
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// hasLayout middleware
app.use(function (req, res, next) {
    req.hasLayout = !(req.query.haslayout &&
                    req.query.haslayout.toLowerCase() === 'false');
    next();
});

// Choose correct view middleware
app.use(function (req, res, next) {
    var hasLayout = req.hasLayout, view;
    var basePath = getBasePath(req.path);
    switch(basePath) {
        case '/':
            view = hasLayout ? 'blogs-page' : 'blogs';
            break;
        case '/about':
            view = hasLayout ? 'about-page' : 'about';
            break;
        case '/resume':
            view = hasLayout ? 'resume-page' : 'resume';
            break;
        case '/blogs':
            view = hasLayout ? 'blogs-page' : 'blogs';
            break;
        case '/blog':
            view = hasLayout ? 'blog-page' : 'blog';
            break;
    }
    req.view = view;
    next();
});

// Request Logger middleware
app.use(function (req, res, next) {
    console.log(JSON.stringify({
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        path: req.path,
        query: JSON.stringify(req.query)
    }));
    next();
});

function onRoute(req, res, data) {
    res.render(req.view, data);
}

// Home page route, same as /blogs/1
app.get('/', (req, res) => onRoute(req, res, {
    environment: environment,
    posts: getPostsForPage(1),
    page: 1
}));

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
    var page = req.params.page;
    if (isValidPage(page)) {
        onRoute(req, res, {
            environment: environment,
            posts: getPostsForPage(page),
            page: page
        });
    } else {
        res.status(404).send('Thats an invalid page number');
    }
});

// Individual blog route
poet.addRoute('/blog/:post', (req, res) => {
    var post = poet.helpers.getPost(req.params.post);
    if (post) {
        onRoute(req, res, {
            environment: environment,
            post: post
        });
    } else {
        res.status(404).send('Thats not a valid post title');
    }
});

// Start the server
app.listen(port, function () {
    console.log('Server listening on port', port);
});