function stringToNum(str) {
    var num = parseInt(str, 10);
    return (!isNaN(num) && str === ('' + num)) ? num : NaN;
}

function getBasePath(path) {
    if (path) {
        let pathTokens = path.split('/');
        let pathToken = pathTokens[0];
        if (path.length > 0 &&
            path[0] === '/') {
            pathToken = pathTokens[1];
        }
        return '/' + pathToken;
    }
    return null;
}

module.exports = {
    stringToNum: stringToNum,
    getBasePath: getBasePath
};