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
            navItem.onclick = function () {
                page(route);
            };
        }
    });

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

    // Check if current path has been cached in local storage yet
    if (isLocalStorageSupported && !localStorage.getItem(path)) {
        localStorage.setItem(path, contentHtml);
    }

    // Client side routes
    page('/', onRoute);
    page('/about', onRoute);
}());