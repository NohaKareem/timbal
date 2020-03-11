var express = require('express');
var router = express.Router();
var Day = require('../models/Day.js');
var Category = require('../models/Category.js');
var System = require('../models/System.js');

const APP_NAME = "Timbal";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: APP_NAME });
});

router.get('/days', (req, res, next) => {
    Day.find((err, days) => {
      handleErr(err);
      res.json(days);
    }).sort({ date: 'desc' });
});

router.get('/categories', (req, res, next) => {
    Category.find((err, categories) => {
      handleErr(err);
      res.json(categories);
    }).sort({ code: 'asc' });
});

router.get('/systems', (req, res, next) => {
  System.find((err, systems) => {
    handleErr(err);
    res.json(systems);
  }).sort({ name: 'asc' });
});

// GET all days with a specific category
router.get('/days/category/:id', (req, res, next) => {
  Day.find({ 'full_category.$': {$all: [req.params.id]} }, (err, days) => {
    // Day.find({ 'log_data.full_category': {$all: [req.params.id]} }, (err, days) => {
    handleErr(err);
    res.json(days);
  });
});

// GET all days within a specific date frame 
router.get('/days/start/:startdate/end/:enddate', (req, res, next) => {
  d = new Date(1580408743511);
  console.log(d);
  Day.find( 
    {"date": {
      "$gte": new Date(req.params.startdate), 
      "$lt": new Date(req.params.enddate) 
    }}, (err, days) => {
      handleErr(err);
      res.json(days);
    });
});

  // /** GET all occurences of a ~toplevel category (~assuming var 0) */
  // router.get('/days/toplevel/:id', (req, res, next) => {
  //   Day.find(
  //   { variables: { variable: '5e3316d51c71657e18823382' } }
  //   , (err, days) => {
  //     // Day.find({'full_category':{"$elemMatch":{'_id': req.params.id}}}, (err, days) => {
  //     handleErr(err);
  //     res.json(days);
  //   }).sort({ date: 'desc' });
  // });

/* Add time log */
// router.post('/', function(req, res, next) {
//     // return ;
// });

// helper method
function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;