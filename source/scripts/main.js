(function () {
    var isLocalStorageSupported = Helpers.isLocalStorageSupported();
    var navItems = document.querySelectorAll('.nav-item');
    var contentContainer = document.querySelector('.content');
    var contentHtml = contentContainer.innerHTML;
    var path = window.location.pathname;

    // Attach route navigation to nav-bar
    navItems.forEach(function (navItem) {
        var route = navItem.dataset.route;
        if (route) {
            navItem.onkeydown = function (event) {
                if (event.which === 13) {
                    page(route);
                }
            };
            navItem.onclick = function () {
                page(route);
            };
        }
    });

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

    // Route handling
    function onSuccess(ctx, html) {
        // Store the result in local storage, so we don't have to fetch it again
        if (isLocalStorageSupported) {
            localStorage.setItem(ctx.path, html);
        }
        contentContainer.innerHTML = html;
    }

    function onFailure(ctx, error) {
        console.error(JSON.stringify(ctx), error);
    }

    function onRoute(ctx) {
        // if local storage is supported, let's cache the data
        if (isLocalStorageSupported &&
            localStorage.getItem(ctx.path)) {
            onSuccess(ctx, localStorage.getItem(ctx.path));
        } else {
            Request.get(ctx.path + '?haslayout=false')
                .then((html) => onSuccess(ctx, html), 
                      (error) => onFailure(ctx, error));
        }
    }

    // Cache the latest data for the current page
    if (isLocalStorageSupported) {
        localStorage.setItem(path, contentHtml);
    }
    
    attachReadMoreLinkAction();

    // Client side routes
    page('/', (ctx, next) => {
        onRoute(ctx);
        next();
    }, attachReadMoreLinkAction);
    page('/about', onRoute);
    page('/blogs/:page', (ctx, next) => {
        onRoute(ctx);
        next();
    }, attachReadMoreLinkAction);
    page('/blog/:post', onRoute);
}());