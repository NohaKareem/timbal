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

// GET all variables
router.get('/', (req, res, next) => {
    Variable.find((err, variables) => {
      handleErr(err);
      res.json(variables);
    }).sort({ code: 'asc' });
  });

// GET variable with specific id
router.get('/:id', (req, res, next) => {
    Variable.find({ _id: req.params.id }, (err, variables) => {
        handleErr(err);
        res.json(variables);
    }).sort({ code: 'asc' });
});

// GET all categories for variable with specific id
router.get('/:id/categories', (req, res, next) => {
    Category.find({ variable: req.params.id }, (err, categories) => {
        handleErr(err);
        res.json(categories);
    }).sort({ code: 'asc' });
});

// helper method
function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;