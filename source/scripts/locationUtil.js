var Location = (function () {
  
    function query(queryKey) {
        return queryDict()[queryKey];
    }
    
    function queryString() {
        var query = location.search;
        if (query.length === 1) {
            return "";
        }
        return query.slice(1);
    }
    
    function queryDict() {
        var qs = queryString();
        var qsTokens = qs.split('&');
        var qsDict = {};
        qsTokens.forEach(function (qsToken) {
            var tokens = qsToken.split('=');
            if (tokens.length < 2) {
                qsDict[tokens[0]] = null;
            } else {
                qsDict[tokens[0]] = tokens[1];   
            }
        });
        return qsDict;
    }
    
    return {
        query: query,
        queryString: queryString,
        queryDict: queryDict  
    };
    
}());