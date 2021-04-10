var express = require('express');
var router = express.Router();
var System = require('../models/System.js');

const APP_NAME = "Timbal";

// check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.user) {//isAuthenticated()
    return next();
  }
  return res.json({ msg: 'need to login' });
}

// ejs test route
router.get('/new', function (req, res, next) {
  res.render('system_new', { title: "Add system" });
});

// POST new system after checking if it already exists
router.post('/', (req, res, next) => {
  var newSystem = new System();
  newSystem.name = req.body.name;
  newSystem.description = req.body.description;

  newSystem.save((err, data) => {
    handleErr(err);
    console.log("System saved to data collection", data);
  });
});

// helper method
function handleErr(err) {
  if (err) return next(err);
}

module.exports = router;