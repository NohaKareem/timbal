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


// GET a day's system categories' details for a particular system using populate
router.get('/:dayId/system/:systemId/details', (req, res, next) => {
  Day.findOne({
    _id: req.params.dayId,
    'variables.variable': req.params.systemId
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
// test query localhost:3000/day/date/2020-01-30T15:00:00.000Z
router.get('/date/:date', function (req, res, next) {
  Day.findOne({
    "date": {
      "$gte": new Date(req.params.date).setHours(1, 0, 0),
      "$lte": new Date(req.params.date).setHours(23, 59, 59)
    }
  }, (err, day) => {
    console.log('day date query result', day)
    handleErr(err, next);
    if (day)
      res.json(day);
    else res.json(false);
  });
});

// GET day document's specified variable log data if exists, within a time frame
// test query localhost:3000/day/start/2020-01-30T15:00:00.000Z/end/2020-02-30T15:00:00.000Z/variable/5e3316671c71657e18823380
router.get('/start/:startDate/end/:endDate/variable/:variable', function (req, res, next) {
  Day.find({
    "date": {
      "$gte": new Date(req.params.startDate).setHours(00, 00, 00, 00),
      "$lte": new Date(req.params.endDate).setHours(23, 59, 59)
    },
    "variables.variable": req.params.variable
  }, { 'variables.variable.$': 1, 'variables.log_data': 1 }, (err, day) => {
    console.log('day date query result', day)
    handleErr(err, next);
    if (day)
      res.json(day);
    else res.json(false);
  }).populate('variables.log_data.full_category').sort({ date: 'asc' });
});

// test query localhost:3000/day/start/2020-01-30T15:00:00.000Z/end/2020-02-30T15:00:00.000Z/variable/5e3316671c71657e18823380/hourly
router.get('/start/:startDate/end/:endDate/variable/:variable/hourly', function (req, res, next) {
  Day.find({
    "variables.log_data.start_time": {
      "$gte": new Date("Thu, 30 Jan 2020 15:00:00 GMT"),
      "$lte": new Date("Fri, 28 Feb 2020 00:00:00 GMT")
    },
    // groupby categorical var (val) and hour
    // aggregate all start times by hr (every line), then by var val (every color)
    "variables.variable": req.params.variable
  }, { 'variables.variable.$': 1, 'variables.log_data.start_time': 1, 'date': 1 }, (err, day) => {
    handleErr(err, next);
    if (day) {
      console.log(day)
      res.json(day);
    }
    else res.json(false);
  });
});

// test query 
// localhost:3000/day/start/2020-01-30T15:00:00.000Z/end/2020-02-30T15:00:00.000Z/variable/5e3316671c71657e18823380/aggregate
router.get('/aggregate', function (req, res, next) {
  Day.aggregate(
    [
      {
        "$group": {
          "_id": { "$hour": "$variables" }
        }
      }
    ], (err, day) => {
      handleErr(err, next);
      if (day) {
        console.log(day)
        res.json(day);
      }
      else res.json(false);
    });
});

// computed time per task
// TODO: needs testing
router.get('/taskTimes', function (req, res, next) {
  Day.aggregate(
    [
      {
        "$group": {
          "_id": { "$sum": [{ "$subtract": ["$variables.log_data.end_time", "$variables.log_data.start_time"] }] }
        }
      }
    ], (err, day) => {
      handleErr(err, next);
      if (day) {
        console.log(day)
        res.json(day);
      }
      else res.json(false);
    });
});

// POST new day document
router.post('/', (req, res, next) => {
  console.log('sent', req.body)
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
  newDay.date = req.body.date;
  newDay.variables = [{
    variable: req.body.variable,
    log_data: [{
      start_time: start_time,
      end_time: end_time,
      // TODO handle if new category
      full_category: req.body.full_category
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
  // TODO add check for date, needs to be same date date as body date for time
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
    }, { 
    $push: {
      'variables.$.log_data': {
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
  var q = Day.findOneAndDelete({ _id: req.params.id });
  q.exec(function (err, mydata) {
    console.log('deleted day document');
  });
  res.redirect('/');
});


// helper method
function handleErr(err, next) {
  console.log(err)
  if (err) return next(err);
}

module.exports = router;