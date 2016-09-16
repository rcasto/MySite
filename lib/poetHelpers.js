var poet = null;

function getPostsForPage(page) {
    var postsPerPage = poet.helpers.options.postsPerPage;
    return poet.helpers.getPosts(
        (page - 1) * postsPerPage,
        page * postsPerPage
    );
}

function getPost(post) {
    return poet.helpers.getPost(post);
}

function isValidPage(page) {
    var numPages = getPageCount();
    return page > 0 && page <= numPages;
}

function getPostCount() {
    return poet.helpers.getPostCount();
}

function getPageCount() {
    return poet.helpers.getPageCount();
}

function getOptions() {
    return poet.helpers.options;
}

module.exports = function (poetInstance) {
    // return empty API if no instance/nothing was passed in
    if (!poetInstance) {
        return { };
    }
    poet = poetInstance;
    return {
        getPostsForPage: getPostsForPage,
        getPost: getPost,
        isValidPage: isValidPage,
        getPostCount: getPostCount,
        getPageCount: getPageCount,
        getOptions: getOptions
    };
};