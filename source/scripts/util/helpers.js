var Helpers = (function () {
    // This function will print out a date string in the following form
    // ex) January 15, 2017
    // If no date object is passed in the current date will be used
    function simpleDateString(date) {
        date = date || new Date();
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return `${monthNames[monthIndex]} ${day} ${year}`;
    }
    
    // Creates a query bag for the current path
    function queryBag() {
        var queryString = window.location.search;
        var bag = {};
        // trim off the beginning '?' from the query string then split
        var queryPairs = queryString && queryString.slice(1).split('&');
        if (queryString) {
            let pairTokens;
            queryPairs.forEach(function (queryPair) {
                pairTokens = queryPair.split('=');
                bag[pairTokens[0]] = pairTokens[1] || {};
            });
        }
        return bag;
    }

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