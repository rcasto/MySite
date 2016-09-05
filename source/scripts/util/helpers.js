var Helpers = (function () {

    function isLocalStorageSupported() {
        try {
            return 'localStorage' in window && 
                    window['localStorage'] !== null;
        } catch(e) {
            return false;
        }
    }
    
    return {
        simpleDateString: simpleDateString,
        queryBag: queryBag,
        isLocalStorageSupported: isLocalStorageSupported
    };
}());