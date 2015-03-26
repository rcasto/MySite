var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
	name: String
});

module.exports = mongoose.model('Blog', blogSchema);