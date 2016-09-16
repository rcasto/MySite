var Helpers = (function () {

    var pageCountApi = '/api/pagecount';

    function isLocalStorageSupported() {
        try {
            return 'localStorage' in window && 
                    window['localStorage'] !== null;
        } catch(e) {
            return false;
        }
    }

    function getPageCount() {
        return Request.get(pageCountApi).then(function (pageCount) {
            return parseInt(pageCount, 10);
        });
    }
    
    return {
        isLocalStorageSupported: isLocalStorageSupported,
        getPageCount: getPageCount
    };
}());