var helpers = require('./helpers');

function hasLayout(req, res, next) {
    req.hasLayout = !(req.query.haslayout &&
                    req.query.haslayout.toLowerCase() === 'false');
    next();
}

function getView(req, res, next) {
    var hasLayout = req.hasLayout, view;
    var basePath = helpers.getBasePath(req.path);
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
}

function logger(req, res, next) {
    console.log(JSON.stringify({
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        path: req.path,
        query: JSON.stringify(req.query)
    }));
    next();
}

module.exports = {
    hasLayout: hasLayout,
    getView: getView,
    logger: logger
};