var Helpers = (function () {
    
    var onWindowLoad = (function () {
        var oldWindowLoad = window.onload;
        return function (cb) {
            if (oldWindowLoad) {
                oldWindowLoad();
            }
            cb();
        };
    }());
    
}());