var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	firstName: {type: String, required: [true, 'need to proide a first name']}, 
	lastName: {type: String, required: [true, 'need to proide a last name']}, 
	username: {type: String, required: [true, 'need to proide a username']}, 
	email: {type: String, required: [true, 'need to provide a valid email']}
});

var options = ({ missingUsernameError: "Wrong Username", missingPasswordError: "Wrong Password" });
userSchema.plugin(plm, options);

module.exports = mongoose.model('User', userSchema);