var express = require('express');
var router = express.Router();
var Day = require('../models/Day.js');
var Category = require('../models/Category.js');
var System = require('../models/System.js');
var Variable = require('../models/Variable.js');

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

router.get('/days/:id', (req, res, next) => {
  Day.find({ _id: req.params.id }, (err, days) => {
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

router.get('/categories/:id', (req, res, next) => {
  Category.find({ _id: req.params.id }, (err, categories) => {
    handleErr(err);
    res.json(categories);
  }).sort({ code: 'asc' });
});

router.get('/variables', (req, res, next) => {
  Variable.find((err, variables) => {
    handleErr(err);
    res.json(variables);
  }).sort({ code: 'asc' });
});

router.get('/variables/:id', (req, res, next) => {
  Variable.find({ _id: req.params.id }, (err, variables) => {
    handleErr(err);
    res.json(variables);
  }).sort({ code: 'asc' });
});

router.get('/systems', (req, res, next) => {
  System.find((err, systems) => {
    handleErr(err);
    res.json(systems);
  }).sort({ name: 'asc' });
});

//~todo: test id routes (except cateogries tested)
router.get('/systems/:id', (req, res, next) => { 
  System.find({ _id: req.params.id }, (err, systems) => {
    handleErr(err);
    res.json(systems);
  }).sort({ name: 'asc' });
});

// GET all days with a specific category
// test build 5e61102fb705711710a1b286
// test eat 5e6afdf8d2ff2246345cdb13 // variable id 5e3316671c71657e18823380
router.get('/days/category/:id', (req, res,next) => {
  // Day.find({ 'full_category.$': {$all: [req.params.id]} }, (err, days) => {
    Day.find({
      // 'variables.0.log_data.full_category.category_id': { $elemMatch: req.params.id } 
      'variables.log_data.full_category': req.params.id //working but retruns only 1 not all matches
    }, (err, days) => {
      // Day.find({ 'variables.0.log_data.$.full_category.$.category_id': req.params.id }, (err, days) => {
      // Day.find({ 'variables.$.log_data.$.full_category.$': { $elemMatch: req.params.id} }, (err, days) => {
      // Day.find({ 'variables.log_data.full_category': { $elemMatch: req.params.id} }, (err, days) => {
      // Day.find({ 'variables.log_data.full_category.code': "b" }, (err, days) => {
      // Day.find({ 'variables.log_data.full_category.$': {$all: [req.params.id]} }, (err, days) => {
    // Day.find({ 'log_data.full_category': {$all: [req.params.id]} }, (err, days) => {
    handleErr(err);
    res.json(days);
  });
});

// testing routes
// test build 5e61102fb705711710a1b286
// test eat 5e6afdf8d2ff2246345cdb13
// test work 5e6110efb705711710a1b288 
// test variable(tasks) id 5e3316671c71657e18823380 //NOT 5e3316d51c71657e18823382
router.get('/testing/:id', (req, res, next) => {
  Day.find({
      'variables.log_data.full_category': req.params.id //working but retruns only 1 not all matches
      // 'variables.0.variable': req.params.id
  }, (err, days) => {
    handleErr(err);
    res.json(days);
  });
}); 

// GET all logs for a specific variable
// test 5e3316671c71657e18823380 ///5e3316d51c71657e18823382
// 0~
router.get('/days/variables/:id', (req, res, next) => {
    Day.find({ 
      'variables.variable': req.params.id  
      // 'variables.0.variable': { $elemMatch: req.params.id }  
    }, (err, days) => {
    handleErr(err);
    res.json(days);
  });
});

// GET all days within a specific date frame 
router.get('/days/start/:startdate/end/:enddate', (req, res, next) => {
  console.log('in date');
  d = new Date(2020, 01, 30, 18, 25, 43);//2020-01-30T18:25:43.511+00:00
  console.log(d.toString());
  console.log('date');
  Day.find( 
    {"date": {
      "$gte": req.params.startdate 
      // "$lt": new Date(req.params.enddate) 
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