var express = require('express');
var path = require('path');
var router = express.Router();
var path = require('path');
var passport = require('passport');
var Day = require('../models/Day.js');
var Color = require('../models/Color.js');
var User = require('../models/User.js');

const AUTHENTICATED_ROUTE = 'http://localhost:8080/'; // redirect to front-end index
const LOGIN_ROUTE = 'http://localhost:8080/#/signin'; // redirect to front-end signin

const APP_NAME = "Timbal";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: APP_NAME });
});

// colors
// GET all colors
router.get('/colors', (req, res, next) => {
  Color.find((err, colors) => {
    handleErr(err);
    res.json(colors);
  }).sort({ date: 'desc' });
});

// GET a color bby id
router.get('/color/:id', (req, res, next) => {
  Color.findOne({ _id: req.params.id }, (err, colors) => {
    handleErr(err);
    res.json(colors);
  }).sort({ date: 'desc' });
});

// authentication
router.post('/signin', passport.authenticate('local'), function(req, res, next) {
	if(!req.user) {
    console.log('user not logged in')
		res.redirect(LOGIN_ROUTE);
	}
    console.log('user  logged in')
    res.redirect(AUTHENTICATED_ROUTE); 
  // return next();
});

router.post('/signup', function(req, res, next) {
	User.register(new User({
		username: req.body.username,
    email: req.body.email, 
    firstName: req.body.firstName, 
    lastName: req.body.lastName
  }),
		req.body.password,

		function(err, user) {
      if (err) { 
        // res.sendFile((path.join(__dirname, '../views', 'register.ejs')), { user:user, message: req.flash('message') });
        res.send({ user:user, message: req.flash('message', err) });
      }
      
      // automatically logs in any new user
      passport.authenticate('local')(req, res, function() {
        res.redirect(AUTHENTICATED_ROUTE);
        // return next();
      });
    });
});

// checking if user is registered. test method from https://blog.zairza.in/oauth-using-mevn-stack-4b4a383dae08
router.get("/check", (req, res) => {
  if (req.user === undefined) {
    res.json({});
  } else {
    res.json({ user: req.user });
  }
});

// facebook
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: AUTHENTICATED_ROUTE,
  failureRedirect: '/login'
}));

// helper method
function handleErr(err) {
  if(err) return next(err);
}

// testing routes
// // test build 5e61102fb705711710a1b286
// // test eat 5e6afdf8d2ff2246345cdb13
// // test work 5e6110efb705711710a1b288 
// // test variable(tasks) id 5e3316671c71657e18823380 
// router.get('/testing/:id', (req, res, next) => {
//   Day.find({
//       'variables.log_data.full_category': req.params.id
//   }, (err, days) => {
//     handleErr(err);
//     res.json(days);
//   });
// }); 

// /* GET time series Test page. */
// router.get('/timeSeries', function(req, res, next) {
//   res.sendFile('timeseries.html', { root: path.join(__dirname, '../views/vis') });
//   // res.render('vis/timeseries');
// });

// router.get('/timeline', function(req, res, next) {
//   res.sendFile('timeline.html', { root: path.join(__dirname, '../views/vis') });
//   // res.sendFile('actualTimeSeries.html', { root: path.join(__dirname, '../public') });
// });

module.exports = router;