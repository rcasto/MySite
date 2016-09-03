(function () {
    var cacheExpirationTime = 900000; // 15 minutes
    var isLocalStorageSupported = Helpers.isLocalStorageSupported();
    var contentContainer = document.querySelector('.content');
    var contentHtml = contentContainer.innerHTML;
    var path = window.location.pathname;

    function init() {
        // Cache the latest data for the current page
        if (isLocalStorageSupported) {
            localStorage.setItem(path, JSON.stringify({
                data: contentHtml,
                timestamp: (new Date()).getTime()
            }));
        }
        attachNavBarAction();
        attachReadMoreLinkAction();
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
            var cachedItem = JSON.parse(localStorage.getItem(key));
            return !!(cachedItem && 
                   (new Date()).getTime() - cachedItem.timestamp < cacheExpirationTime);
        }
        return false;
    }

    // Route handling
    function onSuccess(ctx, html) {
        // Store the result in local storage, so we don't have to fetch it again
        if (isLocalStorageSupported) {
            localStorage.setItem(ctx.path, JSON.stringify({
                data: html,
                timestamp: (new Date()).getTime()
            }));
        }
        contentContainer.innerHTML = html;
    }

    function onFailure(ctx, error) {
        console.error(JSON.stringify(ctx), error);
    }

    function onRoute(ctx) {
        // if local storage is supported, let's cache the data
        if (isCached(ctx.path)) {
            onSuccess(ctx, JSON.parse(localStorage.getItem(ctx.path)).data);
        } else {
            Request.get(ctx.path + '?haslayout=false')
                .then((html) => onSuccess(ctx, html), 
                      (error) => onFailure(ctx, error));
        }
        path = ctx.path;
    }

    // Client side routes
    page('/', (ctx, next) => {
        onRoute(ctx);
        next();
    }, attachReadMoreLinkAction);
    page('/about', onRoute);
    page('/resume', onRoute);
    page('/blogs/:page', (ctx, next) => {
        onRoute(ctx);
        next();
    }, attachReadMoreLinkAction);
    page('/blog/:post', onRoute);

    // Initialize
    init();
}());