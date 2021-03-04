var express = require('express');
var router = express.Router();
var Day = require('../models/Day.js');

const APP_NAME = "Timbal";

// check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.user) {//isAuthenticated()
    return next();
  }
  return res.json({ msg: 'need to login' });
}

// GET a day's log for a specific variable
// testing: { dayId: many vars: 5e611877b705711710a1b28d, task only: 5e6aff42d2ff2246345cdb15, 
//  tasks varId:5e3316671c71657e18823380, energy varId: 5e70f222aba2813dac23b9d8 }
router.get('/:dayId/var/:varId', (req, res, next) => {
  Day.findOne({
    _id: req.params.dayId,
    'variables.variable': req.params.varId
  }, { 'variables.variable.$': req.params.varId }, (err, day) => {
    handleErr(err, next);
    console.log(day.variables.variable)
    res.json(day);
  });
});

// GET a day's categories' details for a particular variable using populate
router.get('/:dayId/var/:varId/details', (req, res, next) => {
  console.log(req.params.dayId)
  Day.findOne({
    _id: req.params.dayId,
    'variables.variable': req.params.varId
  }, { 'variables.variable.$': 1, 'variables.log_data': 1 }, (err, day) => {
    res.json(day);
    console.log(day)
    console.error(err)
    // res.render('vis/actualTimeSeries', { day: day });
  }).populate('variables.log_data.full_category');
});

router.get('/:dayId/var/:varId/vis', (req, res, next) => {
  Day.find({
    _id: req.params.dayId,
    'variables.variable': req.params.varId
  }, (err, day) => {
    // res.json(day);
    res.render('vis/actualTimeSeries', { day: day });
  }).populate('variables.log_data.full_category');
});

// ejs test route
router.get('/new', function (req, res, next) {
  Day.find((err, days) => {
    handleErr(err, next);
    // res.json(days);
    res.render('day_new', { title: "Add day", days: days });
  }).sort({ date: 'desc' });
});

// GET day document if exists (check by date)
router.get('/date/:date', function (req, res, next) {
  Day.findOne({
    "date": {
      "$gte": new Date(req.params.date).setHours(1, 0, 0),
      "$lte": new Date(req.params.date).setHours(23, 59, 59)
    }
  }, (err, day) => {
    // console.log('original', req.params.date)
    // console.log('start', new Date(req.params.date).setHours(1, 0, 0))
    // console.log('end', new Date(req.params.date).setHours(23, 59, 59))
    console.log('day date query result', day)
    handleErr(err, next);
    if (day)
      res.json(day);
    else res.json(false);
  });
});

// POST new day document
router.post('/', (req, res, next) => {
  // formatting time input
  let start_time = req.body.start_time;
  let end_time = req.body.end_time;
  let temp_date = new Date(req.body.date);//.setTime(hours, minutes);
  temp_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);
  start_time = temp_date;
  let temp_end_time = new Date(req.body.date);
  temp_end_time.setHours(end_time.split(':')[0], end_time.split(':')[1]);
  end_time = temp_end_time;

  // saving data
  var newDay = new Day();
  newDay.date = req.body.date; //~ check if exists, format
  newDay.variables = [{
    variable: req.body.variable,
    log_data: [{//[0]
      start_time: start_time, //~ parse input, discenr am and pm
      end_time: end_time, //~
      full_category: req.body.full_category //req.body.full_category.split('.') //~ handle if new category
    }]
  }];
  newDay.save((err, data) => {
    // data.populate('variables.log_data.full_category')
    handleErr(err, next);
    console.log("Day saved to data collection", data);
    res.json(data);
  });
});

// Update day document
router.post('/:id/variable/:varId', (req, res, next) => {
  // check if variable already exists to modify update query findOne then findOneAndUpdate https://stackoverflow.com/a/43867483

  // formatting time input
  let start_time = req.body.start_time;
  let end_time = req.body.end_time;
  // ~date needs to be same date date as body date for time
  let temp_date = new Date(req.body.date);
  temp_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);
  start_time = temp_date;
  let temp_end_time = new Date(req.body.date);
  temp_end_time.setHours(end_time.split(':')[0], end_time.split(':')[1]);
  end_time = temp_end_time;

  // updating data
  var q = Day.findOneAndUpdate(
    {
      _id: req.params.id,
      'variables': { "$elemMatch": { "variable": req.params.varId } }
    }, { //~var id 
    $push: {
      // using push https://stackoverflow.com/a/23577266/1446598 https://stackoverflow.com/a/33049923/1446598
      'variables.$.log_data': { //~if no var => variables.variable
        start_time: start_time,
        end_time: end_time,
        full_category: req.body.full_category
      }
    }
  }
  );
  q.exec(function (err, data) {
    console.log('updated day document - index', data);
    res.json(data);
  });
});

// delete a day document
router.post('/day/:id/delete', (req, res, next) => {
  console.log('in delete')
  var q = Day.findOneAndDelete({ _id: req.params.id });
  q.exec(function (err, mydata) {
    console.log('deleted day document');
  });
  res.redirect('/');
});


// helper method
function handleErr(err) {
  if (err) return next(err);
}

module.exports = router;