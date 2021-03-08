var express = require('express');
var router = express.Router();
var System = require('../models/System.js');

const APP_NAME = "Timbal";

// check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.user) {//isAuthenticated()
    return next();
  }
  return res.json({ msg: 'need to login' });
}

// // GET all systems
// router.get('/', (req, res, next) => {
//     System.find((err, systems) => {
//         handleErr(err);
//         res.json(systems);
//     }).sort({ name: 'asc' });
// });

// ejs test route
router.get('/new', function (req, res, next) {
  res.render('system_new', { title: "Add system" });
});

// // GET system id by name
// router.get('/name/:name', function(req, res, next) {
//     // capitalize input https://stackoverflow.com/a/49003361
//     let taskName = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);
//     System.findOne({ name: taskName }, (err, system) => {
//       handleErr(err);
//       if (system)
//           res.json(system._id);
//       else res.json(false);
//     });
//   });

// // POST new system
// router.post('/', (req, res, next) => { //~
//     var newSystem = new System(); 
//     newSystem.name = req.body.name;
//     newSystem.description = req.body.description;
//     newSystem.color = req.body.color;

//     newSystem.save((err, data) => { 
//         handleErr(err);
//         console.log("System saved to data collection", data);
//     });

//     res.redirect('back');
// });

// POST new system after checking if it already exists
router.post('/', (req, res, next) => { //~
  var newSystem = new System();
  newSystem.name = req.body.name;
  newSystem.description = req.body.description;

  newSystem.save((err, data) => {
    handleErr(err);
    console.log("System saved to data collection", data);
  });

  // // set upsert to set up data https://stackoverflow.com/a/33401897/1446598
  // var q = System.findOneAndUpdate(
  //   // query
  //   { name: req.body.name }, 
  //   // update
  //   { 
  //     description: req.body.description,
  //     color: req.body.color,
  //     $push: { categories: req.body.variable_category }
  //   }, 
  //   // options
  //   { upsert: true, new: true }
  // );
  //   q.exec(function(err, data) {
  //     console.log('added system document', data);
  //     res.redirect('back');
  //     // res.json(data);
  //   });

  // res.redirect('back');
});

// //~todo: test id routes (except cateogries tested)
// router.get('/:id', (req, res, next) => { 
//     System.find({ _id: req.params.id }, (err, systems) => {
//         handleErr(err);
//         res.json(systems);
//     }).sort({ name: 'asc' });
// });

// helper method
function handleErr(err) {
  if (err) return next(err);
}

module.exports = router;