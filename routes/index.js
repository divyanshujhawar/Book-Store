var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
   /*res.render('index', {success: false, errors: req.session.error});
   req.session.errors = null;*/
   res.render('hi');
});


router.get('/welcome/:id', function(req, res, next) {
  res.render('welcome', {output: req.params.id});
});


router.post('/register', function(req,res,next){
     
  var first_name = req.body.user;
  var email = req.body.email;
  var password = req.body.pass1;  

  var newUser = new User({

      first_name: first_name,
      email:email,
      password: password
    });

  User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    console.log('user saved.........');
    //req.flash('success_msg', 'You are registered and can now login');
    res.redirect('welcome/' + first_name);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid password'});
      }
    });
   });
  }));

  passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});



router.post('/login',
  passport.authenticate('local', {successRedirect:'welcome/success', failureRedirect:'welcome/failed',failureFlash: true}),
  function(req, res) {
    res.redirect('welcome/success');
  });



module.exports = router;
