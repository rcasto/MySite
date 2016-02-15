(function () {
    
    Request.get('/posts/blah', function (data) {
       console.log(data); 
    }, function (err) {
        console.log(err);
    });
    
}());