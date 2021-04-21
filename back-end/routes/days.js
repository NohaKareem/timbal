var express = require('express');
var router = express.Router();
var Day = require('../models/Day.js');

const APP_NAME = "Timbal";

// check if user is logged in
function isLoggedIn(req, res, next) {
	if(req.user) {//isAuthenticated()
		return next();
  }
  return  res.json({ msg: 'need to login' });
}

router.get('/', (req, res, next) => {
  Day.find((err, days) => {
    handleErr(err);
    res.json(days);
  }).sort({ date: 'desc' });
});


router.get('/:id', (req, res, next) => {
  Day.find({ _id: req.params.id }, (err, days) => {
    handleErr(err);
    res.json(days);
  }).sort({ date: 'desc' });
});

// GET all logs for a specific variable
router.get('/variables/:id', (req, res, next) => {
  Day.find({ 
    'variables.variable': req.params.id  
  }, (err, days) => {
  handleErr(err);
  res.json(days);
});
});

// GET all days with a specific category
router.get('/category/:id', (req, res,next) => {
  Day.find({
    'variables.log_data.full_category': req.params.id 
  }, (err, days) => {
  handleErr(err);
  res.json(days);
  });
});

// GET all days within a specific date frame 
// start time eg. 2020-01-30T18:25:43.520+00:00
// end time eg. 2020-01-30T19:25:50.521+00:00
router.get('/start/:startdate/end/:enddate', (req, res, next) => {
  // d = new Date(2020, 01, 30, 18, 25, 43);//2020-01-30T18:25:43.511+00:00
  // console.log(d.toString());
  Day.find( 
    {
      "date": {
      "$gte": req.params.startdate,
      "$lt": req.params.enddate
    }}, (err, days) => {
      handleErr(err);
      res.json(days);
    });
});

// helper method
function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;