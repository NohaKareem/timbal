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

// async function findCategoryIds(categories) {
//   let category_ids = [];
//   categories.split('.').forEach(categoryCode => {
//     console.log(categoryCode)
//     Category.findOne({ code: categoryCode }, (err, category) => {
//       handleErr(err);
//       category_ids.push(category._id);
//     console.log('category_ids', category_ids);
//   }).sort({ code: 'asc' });
//     // console.log('category_ids here', category_ids);
//     return category_ids;
// });
// }

router.get('/', (req, res, next) => {
    Category.find((err, categories) => {
      handleErr(err);
      res.json(categories);
    }).sort({ code: 'asc' });
});

// GET category with specific id
router.get('/:id', (req, res, next) => {
  Category.find({ _id: req.params.id }, (err, categories) => {
    handleErr(err);
    res.json(categories);
  }).sort({ code: 'asc' });
});

// GET all top-level/non top-level categories, according to flag parameter (true/false)
// test (tasks top level) http://localhost:3000/categories/variable/5e3316671c71657e18823380/top-level/true
router.get('/variable/:varId/top-level/:flag', (req, res, next) => {
  Category.find({ is_top_level: req.params.flag, variable: req.params.varId }, (err, categories) => {
    handleErr(err);
    res.json(categories);
  }).populate('color').sort({ code: 'asc' });
});

// delete a category document
router.post('/category/:id/delete', (req, res, next) => {
    var q = Day.findOneAndDelete({  _id: req.params.id });
    q.exec(function(err, mydata) {
    console.log('deleted category document');
  });
  res.redirect('/');
});
  

// helper method
function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;