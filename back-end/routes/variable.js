var express = require('express');
var router = express.Router();
var Variable = require('../models/Variable.js');

const APP_NAME = "Timbal";

// check if user is logged in
function isLoggedIn(req, res, next) {
	if(req.user) {//isAuthenticated()
		return next();
  }
  return  res.json({ msg: 'need to login' });
}

// ejs test route
router.get('/new', function(req, res, next) {
    res.render('variable_new', { title: "Add variable" });
});
  
// GET variable id by name
router.get('/name/:name', function(req, res, next) {
    // capitalize input https://stackoverflow.com/a/49003361
    let taskName = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);
    Variable.findOne({ name: taskName }, (err, variable) => {
      handleErr(err);
      if (variable)
          res.json(variable._id);
      else res.json(false);
    });
  });
  
// POST new variable
router.post('/', (req, res, next) => {
    var newVariable = new Variable(); 
    newVariable.name = req.body.name;
    newVariable.description = req.body.description;

    newVariable.save((err, data) => { 
        handleErr(err);
        console.log("Variable saved to data collection", data);
    });

    res.redirect('back');
});

// helper method
function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;