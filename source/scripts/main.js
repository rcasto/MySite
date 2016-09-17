(function () {
    var cacheExpirationTime = 900000; // 15 minutes
    var isLocalStorageSupported = Helpers.isLocalStorageSupported();
    var path = window.location.pathname;
    var pageControls = document.querySelector('page-controls');

    // Page elements
    var contentContainer = document.querySelector('.content');

    function init() {
        // Cache the latest data for the current page
        if (isLocalStorageSupported) {
            localStorage.setItem(getPath(path), JSON.stringify({
                data: contentContainer.innerHTML,
                timestamp: (new Date()).getTime()
            }));
        }
        // Fetch the total # of pages from the server
        Helpers.getPageCount().then(function (pageCount) {
            pageControls.dataset.totalPages = pageCount;
        });
        pageControls.addEventListener('navigate-page', function (event) {
            var page = event.detail;
            onBlogsRoute({
                path: `/blogs/${page}`,
                params: {
                    page: page
                }
            });
        });
        // Attach actions
        attachNavBarAction();
        attachReadMoreLinkAction();
        // Start routing, the dispatch of false prevents client side routes from 
        // running on initial page load from server
        page({
            // dispatch: false
        });
    }

    // Attach route navigation to nav-bar
    function attachNavBarAction() {
        var navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(function (navItem) {
            var route = navItem.dataset.route;
            if (route) {
                navItem.onkeydown = function (event) {
                    if (event.which === 13 &&
                        path !== route) {
                        page(route);
                    }
                };
                navItem.onclick = function () {
                    if (path !== route) {
                        page(route);
                    }
                };
            }
        });
    }

    // Attach blog navigation to "read more" links
    function attachReadMoreLinkAction() {
        var readMoreLinks = document.querySelectorAll('.read-more-link');
        readMoreLinks.forEach(function (readMoreLink) {
            var link = readMoreLink.dataset.link;
            if (link) {
                readMoreLink.onclick = function (event) {
                    page(link);
                    return false;
                };
            }
        });
    }

    function isCached(key) {
        if (isLocalStorageSupported) {
            let cachedItem = JSON.parse(localStorage.getItem(key));
            return !!(cachedItem && 
                   (new Date()).getTime() - cachedItem.timestamp < cacheExpirationTime);
        }
        return false;
    }

    function getPath(path) {
        if (path === '/') {
            return '/blogs/1';
        }
        return path ? path : null;
    }

    function hasPageControls(path) {
        return path && (path === '/' || path.toLowerCase().indexOf('/blogs/') === 0);
    }

    /*
        Set information specific to page:
        - does it have page controls?
        - need read more link actions (TODO)
        - need navbar action? (TODO)
    */
    function setPageState(path) { }

    // Route handling
    function onSuccess(ctx, html) {
        // Store the result in local storage, so we don't have to fetch it again
        if (isLocalStorageSupported) {
            localStorage.setItem(getPath(ctx.path), JSON.stringify({
                data: html,
                timestamp: (new Date()).getTime()
            }));
        }
        contentContainer.innerHTML = html;
    }

    function onFailure(ctx, error) {
        // Fallback to cached content in case of failure if available
        if (isLocalStorageSupported) {
            let fallback = localStorage.getItem(getPath(ctx.path));
            if (fallback) {
                contentContainer.innerHTML = JSON.parse(fallback).data;
            }
        }
        console.error(JSON.stringify(ctx), error);
        return error;
    }

    function onRoute(ctx) {
        return new Promise(function (resolve, reject) {
            // if local storage is supported, let's cache the data
            path = getPath(ctx.path);
            pageControls.hidden = true;
            if (isCached(path)) {
                resolve(onSuccess(ctx, JSON.parse(localStorage.getItem(path)).data));
            } else {
                Request.get(path + '?haslayout=false')
                    .then((html) => resolve(onSuccess(ctx, html)), 
                        (error) => reject(onFailure(ctx, error)));
            }
        });
    }

    function onBlogsRoute(ctx) {
        var page = ctx.path === '/' ? 1 : parseInt(ctx.params.page, 10);
        return onRoute(ctx).then(function () {
            attachReadMoreLinkAction();
            pageControls.hidden = false;
            pageControls.dataset.page = page;
        });;
    }

    // Client side routes
    page('/', onBlogsRoute);
    page('/about', onRoute);
    page('/resume', onRoute);
    page('/blogs/:page', onBlogsRoute);
    page('/blog/:post', onRoute);

    // Initialize
    init();
}());