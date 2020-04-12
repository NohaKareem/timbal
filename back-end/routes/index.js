var express = require('express');
var path = require('path');
var router = express.Router();
var Day = require('../models/Day.js');
var Category = require('../models/Category.js');
var System = require('../models/System.js');
var Variable = require('../models/Variable.js');
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

router.get('/days', (req, res, next) => {
    Day.find((err, days) => {
      handleErr(err);
      res.json(days);
    }).sort({ date: 'desc' });
});

// ~repeated in populate?
// GET a day's log for a specific variable
// testing: { dayId: many vars: 5e611877b705711710a1b28d, task only: 5e6aff42d2ff2246345cdb15, 
//  tasks varId:5e3316671c71657e18823380, energy varId: 5e70f222aba2813dac23b9d8 }
router.get('/day/:dayId/var/:varId', (req, res, next) => {
  Day.findOne({ _id: req.params.dayId, 
      'variables.variable': req.params.varId }, { 'variables.variable.$': req.params.varId }, (err, day) => {
    handleErr(err);
    console.log(day.variables.variable)
    res.json(day);
  });
});

    // // GET a day's log for a specific variable with category details
    // router.get('/day/:dayId/var/:varId/detail', (req, res, next) => {
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
router.get('/day/:dayId/var/:varId/details', (req, res, next) => {
  Day.findOne({ _id: req.params.dayId, 
    'variables.variable' : req.params.varId 
  }, { 'variables.variable.$': req.params.varId }, (err, day) => {
      res.json(day);
      // res.render('vis/actualTimeSeries', { day: day });
  }).populate('variables.log_data.full_category');
}); 

router.get('/day/:dayId/var/:varId/vis', (req, res, next) => {
  Day.find({ _id: req.params.dayId, 
    'variables.variable' : req.params.varId 
  }, (err, day) => {
      // res.json(day);
      res.render('vis/actualTimeSeries', { day: day });
  }).populate('variables.log_data.full_category');
}); 

// testing aggregate https://stackoverflow.com/a/42395156 https://docs.mongodb.com/manual/reference/operator/aggregation/add/
// https://docs.mongodb.com/manual/reference/operator/aggregation/arrayElemAt/
router.get('/day/:dayId/var/:varId/testing', (req, res, next) => {
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
// router.get('/day/:dayId/var/:varId/vis', (req, res, next) => {
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

router.get('/days/:id', (req, res, next) => {
  Day.find({ _id: req.params.id }, (err, days) => {
    handleErr(err);
    res.json(days);
  }).sort({ date: 'desc' });
});

// GET all logs for a specific variable
router.get('/days/variables/:id', (req, res, next) => {
  Day.find({ 
    'variables.variable': req.params.id  
  }, (err, days) => {
  handleErr(err);
  res.json(days);
});
});

// GET all days with a specific category
router.get('/days/category/:id', (req, res,next) => {
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

// ejs test route
router.get('/day/new', function(req, res, next) {
  Day.find((err, days) => {
    handleErr(err);
    // res.json(days);
    res.render('day_new', { title: "Add day", days: days });
  }).sort({ date: 'desc' });
});

// GET variable id by name
router.get('/variable/name/:name', function(req, res, next) {
  // capitalize input https://stackoverflow.com/a/49003361
  let taskName = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);
  Variable.findOne({ name: taskName }, (err, variable) => {
    handleErr(err);
    if (variable)
        res.json(variable._id);
    else res.json(false);
  });
});

async function findCategoryIds(categories) {
  let category_ids = [];
  categories.split('.').forEach(categoryCode => {
    console.log(categoryCode)
    Category.findOne({ code: categoryCode }, (err, category) => {
      handleErr(err);
      category_ids.push(category._id);
    console.log('category_ids', category_ids);
  }).sort({ code: 'asc' });
    // console.log('category_ids here', category_ids);
    return category_ids;
});
}

// POST new day document
var category_ids;
router.post('/day', (req, res, next) => {
  var newDay = new Day(); 

  console.log('_____________________________')
  console.log('date', req.body.date)
  console.log('Date(date)', new Date(req.body.date))
  console.log('start_time', req.body.start_time)
  console.log('end_time', req.body.end_time)
  let start_time = req.body.start_time;
  let end_time = req.body.end_time;
  let temp_date = new Date(req.body.date);//.setTime(hours, minutes);
  console.log('temp)date before time',temp_date)
  console.log('split',start_time.split(':'))
  temp_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);
  console.log('temp)date after time',temp_date) ///~~~~~changed~
  start_time = temp_date;

  let temp_end_time = new Date(req.body.date);
  console.log('temp_end_time after time',temp_end_time) ///~~~~~changed~
  temp_end_time.setHours(end_time.split(':')[0], end_time.split(':')[1]);
  console.log('temp_end_time after time',temp_end_time) ///~~~~~changed~
  end_time = temp_end_time;

  console.log('START date WITH TIME ' + start_time.toString())
  console.log('END date WITH TIME ' + end_time.toString())

  console.log('req.body.full_category.split')
  console.log(req.body.full_category.split('.'))

  console.log(start_time, '<= start time')
  console.log((start_time).toTimeString(), '<= ISODate start time')
// start_time = start_time.toTimeString();
  // get the ids for the categories 
  // using promise.all to ensure categories are populated before saving in day object 
  // https://stackoverflow.com/a/39474742/1446598 
  // category_ids = [];
//  Promise.all(() => {
    // Promise.all(
      // category_ids = findCategoryIds(req.body.full_category)
      findCategoryIds(req.body.full_category).then((category_ids) => {

        // let category_ids = [];
        // req.body.full_category.split('.').forEach(categoryCode => {
        //   console.log(categoryCode)
        //   Category.findOne({ code: categoryCode }, (err, category) => {
        //     handleErr(err);
        //     category_ids.push(category._id);
        //   console.log('category_ids', category_ids);
        // }).sort({ code: 'asc' });
      // )
//  })
// .then(() => {
        /// adding save
        newDay.date = req.body.date; //~ check if exists, format
        console.log('_________________________________________')
        console.log('category_ids TESTING', category_ids)
        newDay.variables = [{
          variable: req.body.variable,
          log_data: [{//[0]
            start_time: start_time, //~ parse input, discenr am and pm
            end_time: end_time, //~
            // start_time: new Date(req.body.date.setTime(req.body.start_time)), //~
            // end_time: req.body.end_time,
            full_category: category_ids //req.body.full_category.split('.') //~ handle if new category
          }]
        }];
        // console.log(newDay);
        console.log('is this undefined? ', newDay.full_category);
        // console.log(newDay.variables[0].log_data);
        // newDay.variables[0].log_data = ; //~ add to array
        /// adding save
              
        newDay.save((err, data) => { 
          // data.populate('variables.log_data.full_category')
          handleErr(err);
          console.log("Day saved to data collection", data);
          // console.log(data.variables.log_data.full_category)
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      });
//  }).catch((error) => {
   
//  })
///~~~~~~~~~~~~ save was here
    
}).catch(error => {
  console.error(error);
})

  res.redirect('/');
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

// ejs test route
router.get('/variable/new', function(req, res, next) {
  res.render('variable_new', { title: "Add variable" });
});

// POST new variable
router.post('/variable', (req, res, next) => {
  var newVariable = new Variable(); 
  newVariable.name = req.body.name;
  newVariable.description = req.body.description;

  newVariable.save((err, data) => { 
    handleErr(err);
    console.log("Variable saved to data collection", data);
  });

  res.redirect('/');
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