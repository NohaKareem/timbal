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

// POST new day
// router.post('/days', (req, res, next) => {
//   Day.find({ _id: req.params.id }, (err, days) => {
//     handleErr(err);
//     res.json(days);
//   }).sort({ date: 'desc' });
// });

router.get('/categories', (req, res, next) => {
    Category.find((err, categories) => {
      handleErr(err);
      res.json(categories);
    }).sort({ code: 'asc' });
});

// GET category with specific id
router.get('/categories/:id', (req, res, next) => {
  Category.find({ _id: req.params.id }, (err, categories) => {
    handleErr(err);
    res.json(categories);
  }).sort({ code: 'asc' });
});

// GET all top-level/non top-level categories, according to flag parameter (true/false)
router.get('/categories/top-level/:flag', (req, res, next) => {
  Category.find({ is_top_level: req.params.flag }, (err, categories) => {
    handleErr(err);
    res.json(categories);
  }).sort({ code: 'asc' });
});

// ejs test route
router.get('/category/new', function(req, res, next) {
  res.render('category_new', { title: "Add category" });
});

// router.get('/', function(req, res, next) {
//   res.render('index', { title: APP_NAME });
// });


// POST new category
router.post('/category', (req, res, next) => {
  var newCategory = new Category(); 
  newCategory.variable = req.body.variable;
  newCategory.code = req.body.code;
  newCategory.description = req.body.description;
  newCategory.is_top_level = req.body.is_top_level;
  newCategory.color = req.body.color;

  newCategory.save((err, data) => { 
    handleErr(err);
    console.log("Category saved to data collection", data);
    console.log(data);
  });

  res.redirect('/');
});

// GET all variables
router.get('/variables', (req, res, next) => {
  Variable.find((err, variables) => {
    handleErr(err);
    res.json(variables);
  }).sort({ code: 'asc' });
});

// GET variable with specific id
router.get('/variables/:id', (req, res, next) => {
  Variable.find({ _id: req.params.id }, (err, variables) => {
    handleErr(err);
    res.json(variables);
  }).sort({ code: 'asc' });
});

// GET all categories for variable with specific id
router.get('/variables/:id/categories', (req, res, next) => {
  Category.find({ variable: req.params.id }, (err, categories) => {
    handleErr(err);
    res.json(categories);
  }).sort({ code: 'asc' });
});

// GET all systems
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
// test eat 5e6afdf8d2ff2246345cdb13 
// variable id 5e3316671c71657e18823380
router.get('/days/category/:id', (req, res,next) => {
    Day.find({
      'variables.log_data.full_category': req.params.id 
    }, (err, days) => {
    handleErr(err);
    res.json(days);
  });
});

// testing routes
// test build 5e61102fb705711710a1b286
// test eat 5e6afdf8d2ff2246345cdb13
// test work 5e6110efb705711710a1b288 
// test variable(tasks) id 5e3316671c71657e18823380 
router.get('/testing/:id', (req, res, next) => {
  Day.find({
      'variables.log_data.full_category': req.params.id
  }, (err, days) => {
    handleErr(err);
    res.json(days);
  });
}); 

// GET all logs for a specific variable
// test 5e3316671c71657e18823380
router.get('/days/variables/:id', (req, res, next) => {
    Day.find({ 
      'variables.variable': req.params.id  
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