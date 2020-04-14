var express = require('express');
var path = require('path');
var router = express.Router();
var Day = require('../models/Day.js');
// var Category = require('../models/Category.js');
// var System = require('../models/System.js');
// var Variable = require('../models/Variable.js');
var Color = require('../models/Color.js');
// var mongoose = require('mongoose');
// mongoose.Promise = Promise; //global.

const APP_NAME = "Timbal";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: APP_NAME });
});

/* GET time series Test page. */
router.get('/timeSeries', function(req, res, next) {
  res.sendFile('timeseries.html', { root: path.join(__dirname, '../views/vis') });
  // res.render('vis/timeseries');
});

// router.get('/timeSeries', function(req, res, next) {
//   res.sendFile('timeSeries.html', { root: path.join(__dirname, '../public') });
// });

// testing
      // router.get('/timeSeries2', function(req, res, next) {
      //   // res.render('vis/actualTimeSeries4');
      //   // res.sendFile('timeseries.js', { root: path.join(__dirname, '../views/vis') });
      //   res.sendFile('actualTimeSeries4.html', { root: path.join(__dirname, '../views/vis') });
      //   // res.sendFile('actualTimeSeries.html', { root: path.join(__dirname, '../public') });
      // });

router.get('/timeline', function(req, res, next) {
  res.sendFile('timeline.html', { root: path.join(__dirname, '../views/vis') });
  // res.sendFile('actualTimeSeries.html', { root: path.join(__dirname, '../public') });
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

// GET all colors
router.get('/colors', (req, res, next) => {
  Color.find((err, colors) => {
    handleErr(err);
    res.json(colors);
  }).sort({ date: 'desc' });
});

// helper method
function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;