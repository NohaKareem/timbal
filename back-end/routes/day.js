var express = require('express');
var router = express.Router();
var Day = require('../models/Day.js');

const APP_NAME = "Timbal";


// ~repeated in populate?
// GET a day's log for a specific variable
// testing: { dayId: many vars: 5e611877b705711710a1b28d, task only: 5e6aff42d2ff2246345cdb15, 
//  tasks varId:5e3316671c71657e18823380, energy varId: 5e70f222aba2813dac23b9d8 }
router.get('/:dayId/var/:varId', (req, res, next) => {
    Day.findOne({ _id: req.params.dayId, 
        'variables.variable': req.params.varId }, { 'variables.variable.$': req.params.varId }, (err, day) => {
      handleErr(err);
      console.log(day.variables.variable)
      res.json(day);
    });
  });
  
// // GET a day's log for a specific variable with category details
// router.get('/:dayId/var/:varId/detail', (req, res, next) => {
//   let logDetails = {
//     log: []
//   };
//   Day.findOne({ _id: req.params.dayId, 
//       'variables.variable': req.params.varId }, { 'variables.variable.$': req.params.varId }, (err, day) => {
//         day.variables[0].log_data.forEach((dataPoint) => {
//           // console.log(dataPoint);
//           handleErr(err);
        
//           // get cateogry data
//           let categories = [];
//           dataPoint.full_category.forEach((category) => {
//             Category.findOne({ _id: category }, (err, categoryData) => {
//               categories.push(categoryData);
//             });
//           });

//           // ~wait till cateogries are populated
//           setTimeout(() => {
//             logDetails.log.push({ ///~~~~
//               cateogry: categories,
//               time: Math.abs(
//                 (dataPoint.start_time.getHours() * 60 + dataPoint.start_time.getMinutes())
//                 - (dataPoint.end_time.getHours() * 60 + dataPoint.end_time.getMinutes())
//               ) / 60
//             });
//             // console.log(categories)
//     res.json(logDetails);
//     // console.log(logDetails)
//           }, 700);
//         });
//     // res.json(logDetails);
//     // res.json(day);
//   });
// });

// GET a day's categories' visualization for a particular variable ~USING POPULATE
// example (eat) http://localhost:3000/day/5e6aff42d2ff2246345cdb15/var/5e3316671c71657e18823380/details
// example (many categories) http://localhost:3000/day/5e611877b705711710a1b28d/var/5e3316671c71657e18823380/details
router.get('/:dayId/var/:varId/details', (req, res, next) => {
  Day.findOne({ _id: req.params.dayId, 
  'variables.variable' : req.params.varId 
  }, { 'variables.variable.$': req.params.varId }, (err, day) => {
  res.json(day);
  // res.render('vis/actualTimeSeries', { day: day });
  }).populate('variables.log_data.full_category');
}); 

router.get('/:dayId/var/:varId/vis', (req, res, next) => {
  Day.find({ _id: req.params.dayId, 
  'variables.variable' : req.params.varId 
  }, (err, day) => {
  // res.json(day);
  res.render('vis/actualTimeSeries', { day: day });
  }).populate('variables.log_data.full_category');
}); 

// testing aggregate https://stackoverflow.com/a/42395156 https://docs.mongodb.com/manual/reference/operator/aggregation/add/
// https://docs.mongodb.com/manual/reference/operator/aggregation/arrayElemAt/
router.get('/:dayId/var/:varId/testing', (req, res, next) => {
  Day.aggregate([
    { $match: { _id: req.params.dayId, 'variables.variable' : req.params.varId } },
    { $project: { '$variables.variable': 1, 
            '$variables.log_data.full_category[0].code' : 1,
    duration: Math.abs((variables.log_data.start_time.getHours() * 60 + variables.log_data.start_time.getMinutes())
            - (variables.log_data.end_time.getHours() * 60 + variables.log_data.end_time.getMinutes()))
    } }
  ],
  (err, day) => {
  res.json(day);
  // res.render('vis/actualTimeSeries', { day: day });
  }).populate('variables.log_data.full_category');
}); 

// testing

// // ~GET a day's categories' visulization for a variable with _id of varId
// router.get('/:dayId/var/:varId/vis', (req, res, next) => {
//   Day.find({ _id: req.params.dayId, 
//       'variables.variable': req.params.varId }, (err, day) => {
//     handleErr(err);

//     let log_data = [];
//     console.log(day)
//     day = day[0];
//     // console.log(day[0]);
//     // console.log(day[0].variables);

//     // return only relevant log data
//     day.variables.forEach(variable => {
//     if (variable.variable == req.params.varId) {
//       log_data = variable.log_data;//~
//         // variable.log_data
//         // count frequency for top level categories
//         variable.log_data.forEach(logEntry => {
//           logEntry.full_category.forEach(category => {
//             //   if (isTopLevel(category)) { //TODO
//                   //     logSet.push({
//                   //       category
//                   //     });
//                   //   }
//                   // increment occurence or add ~~~TODO increment by minutes
//                         // let log_time = 1;
//                         // log_data[category.toString()] = log_data[category.toString()] ? log_data[category.toString()] + log_time : log_time;
//                         // console.log(log_data)
//                   // console.log("array AFTER " + log_data[category.toString()]);
//                   });
//         });
    
//       }
//     });
//     // log_data = JSON.stringify(log_data)
//     console.log(log_data)
//     res.render('vis/day_vis', { log_data: log_data });
//     // res.json(log_data);
//   });
// });

// ejs test route
router.get('/new', function(req, res, next) {
  Day.find((err, days) => {
  handleErr(err);
  // res.json(days);
  res.render('day_new', { title: "Add day", days: days });
  }).sort({ date: 'desc' });
});

// GET day document if exists (check by date)
router.get('/date/:date', function(req, res, next) {
  Day.findOne({ date: req.params.date }, (err, day) => {
  console.log('day date query result', day)
  handleErr(err);
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
  handleErr(err);
  console.log("Day saved to data collection", data);
  res.json(data);
  });
});

// Update day document
router.post('/:id/variable/:varId', (req, res, next) => {
  // ~TODO check if variable already exists to modify update query findOne then findOneAndUpdate https://stackoverflow.com/a/43867483
  

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
  {  _id: req.params.id,
      'variables': {"$elemMatch": { "variable": req.params.varId }} 
  }, { //~var id 
  $push: {
      // using push https://stackoverflow.com/a/23577266/1446598 https://stackoverflow.com/a/33049923/1446598
          'variables.$.log_data': { //~if no var => variables.variable
              start_time: start_time, 
              end_time: end_time, 
              full_category: req.body.full_category
          }
  }}
  );
  q.exec(function(err, data) {
    console.log('updated day document - index', data);
    res.json(data);
  });
});

// delete a day document
router.post('/day/:id/delete', (req, res, next) => {
console.log('in delete')
var q = Day.findOneAndDelete({  _id: req.params.id });
q.exec(function(err, mydata) {
console.log('deleted day document');
});
res.redirect('/');
});
  
  
// helper method
function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;