var express = require('express');
var router = express.Router();

var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: "Home - Richie Casto's Website" });
});

router.get('/admin', function (req, res) {
	res.render('admin', { title: "Admin - Administrative panel", errors: [] });
});

router.get('/admin/login', function (req, res) {
	res.render('login', { title: "Admin - Administrator Login", errors: [] });
});

router.post('/admin/login', passport.authenticate('local', {
	successRedirect: '/admin/',
	failureRedirect: '/admin/login'
}));

module.exports = router;