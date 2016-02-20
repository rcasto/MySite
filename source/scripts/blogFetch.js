var Blog = (function () {
    
    // Grab blog template
    var template = document.getElementById('blogTemplate');
    var blog_api_endpoint = "/api/blog/";
    
    function fetch(blogTitle) {
        return new Promise(function (resolve, reject) {
            Request.get(blog_api_endpoint + blogTitle).then(function (post) {
                try {
                    let blogTemplate = document.importNode(template.content, true);
                    let blogEntry = blogTemplate.querySelector('.blog');
                    post = JSON.parse(post);
                    // Check if preview mode or full mode should be rendered
                    if (Helpers.queryBag().preview) {
                        console.log('Load the preview!');
                        blogEntry.innerHTML = post.preview;
                    } else {
                        console.log('Load the main Shindig!');
                        blogEntry.innerHTML = post.content;
                    }
                    document.body.appendChild(blogTemplate);
                    resolve(post);
                } catch (err) {
                    console.error('Error loading blog:', err);
                    reject(err);
                }
            }, function (err) {
                console.log(err);
            });
        });
    }
    
    function fetchAll() {
        
    }
    
    // Testing
    fetch('test1');
    
    return {
        fetch: fetch  
    };
    
}());