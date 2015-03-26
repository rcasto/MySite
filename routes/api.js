var express = require('express');
var router = express.Router();

var Blog = require('../models/Blog');

router.get('/blog', function(req, res) {
});

router.post('/blog', function (req, res) {
	if (!req.body.blogTitle) {
		res.render('admin', { 
			title: "Admin - Administrative panel",
			errors: [{
				msg: "Invalid blog title provided"
			}]
		});
	}
});

module.exports = router;