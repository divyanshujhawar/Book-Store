var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	first_name: {
		type: String,
		index:true
	},
	
	email: {
		type: String
	},
	password: {
		type: String
	}

});
	
	var User = module.exports = mongoose.model('User', UserSchema);

	module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
		console.log('password ebcrytpeprf.........');
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {first_name: username};
	console.log('user recived is ' + username);
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}