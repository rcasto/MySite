(function () {
    var navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(function (navItem) {
        var route = navItem.dataset.route;
        if (route) {
            navItem.onclick = function () {
                page(route);
            };
        }
    });

    // Client side routes
    // page('/about', function () {
        
    // }); 
}());