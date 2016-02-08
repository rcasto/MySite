/*
    In Progress:
    Pass in a username to initialize with the profile information for that user
    
    To be done:
    If no username is passed in you will be prompted to provide a username, when provided
    the user profile info for that user will be displayed
*/
(function (username) {
    var baseUrl = "https://api.github.com/";
    var userUrl = baseUrl + "users/";
    
    // Apparently getting access tokens from Github requires using a server proxy
    // it can't be done from a client side only application, thus the Oauth process
    // cannot be done
    
    // Extract only the needed info from the user object
    function getUserInfo(userName, cb) {
        Request.get(userUrl + userName, function (data) {
            data = parseJSON(data);
            cb({
                name: data.name,
                username: data.login,
                avatar: data.avatar_url,
                profile: data.url,
                followers: data.followers,
                following: data.following
            });
        });
    }
    
    function render(userInfo, repoInfo) {
        
    }
    
    // Extract only the necessary info from each repo and return that object
    function getUserRepoInfo(userName, cb) {
        Request.get(userUrl.concat(userName, '/repos'), function (repos) {
            repos = parseJSON(repos);
            cb(repos.map(function (repo) {
                return {
                    name: repo.name,
                    url: repo.url,
                    lastUpdated: repo.updated_at
                };
            }));
        });
    }
    
    // Convenience method to parse JSON, catches errors here in one place
    // The error would come from the data not being valid JSON
    function parseJSON(data) {
        try {
            return JSON.parse(data);
        } catch (err) {
            console.error(err);
        }
    }
    
    window.onload = (function (oldFunc) {
        return function () {
            oldFunc && oldFunc();
           
           getUserInfo(username, function (data) {
               console.log(data);
           });
           
           getUserRepoInfo(username, function (data) {
               console.log(data);
           });
        };
    }(window.onload));
    
}("rcasto"));