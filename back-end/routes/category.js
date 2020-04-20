var express = require('express');
var router = express.Router();
var Category = require('../models/Category.js');

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
    res.render('category_new', { title: "Add category" });
  });
  
// POST new category
router.post('/', (req, res, next) => {
    var newCategory = new Category(); 
    newCategory.variable = req.body.variable;
    newCategory.code = req.body.code;
    newCategory.description = req.body.description;
    newCategory.is_top_level = req.body.is_top_level;
    newCategory.color = req.body.color;

    newCategory.save((err, category) => { 
        handleErr(err);
        console.log("Category saved to data collection", category);
        // res.json(category);
        // next();
        res.redirect('back');
    });
    // res.redirect('/');
});
  
// helper method
function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;