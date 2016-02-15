var Request = (function () {
    
    function jsonP(url, callback) {
        var script = document.createElement('script');
        // Save the callback internally to this function
        // Only globally accessible functions can be called with JSONP    
        jsonP.callback = callback;
        // check if url already has query string, if not add it
        if (url.indexOf('?') < 0) {
            url += '?';
        } else if (url[url.length - 1] !== '&') {
            url += '&';
        }
        if (url.indexOf('callback=') < 0) {
            url += 'callback=Request.jsonP.callback';
        }
        script.src = url
        document.body.appendChild(script);
    }
    
    function cors(url, success, error) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = success;
        xhr.onerror = error;
        xhr.send();
        return xhr;
    }
    
    function get(url, success, failure) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState > 3 && xhr.status === 200) {
                success(xhr.responseText);
            }
        };
        xhr.onerror = failure;
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
        return xhr;
    }
    
    function post(url, data, success) {
        var params = typeof data === 'string' ? data : 
            Object.keys(data).map(function (k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
            }).join('&');
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
        };
        
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.send(params);
        return xhr;
    }
    
    return {
        get: get,
        post: post,
        jsonP: jsonP,
        cors: cors
    };
    
}());