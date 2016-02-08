var express = require('express');
var path = require('path');

var port = process.env.PORT || 3000;
var app = express();

// Setup static routes
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Middleware to apply CORS headers for GitHub
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Homepage route
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'), function (err) {
        if (err) {
            console.error('Error sending home page:', JSON.stringify(error));
        }
        console.log('Sent client home page successfully');
    });
});

// Start the server
app.listen(port, function () {
  console.log('Server listening on port', port);
});