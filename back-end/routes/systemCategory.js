var express = require('express');
var router = express.Router();
var SystemCategory = require('../models/SystemCategory.js');

// check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.user) {//isAuthenticated()
        return next();
    }
    return res.json({ msg: 'need to login' });
}

// ejs test route
router.get('/new', function (req, res, next) {
    res.render('systemCategory_new', { title: "Add system category" });
});

// // POST new system category
// router.post('/', (req, res, next) => {
//     var newCategory = new SystemCategory();
//     // newCategory.variable = req.body.variable;
//     newCategory.name = req.body.name;
//     newCategory.description = req.body.description;
//     newCategory.color = req.body.color;

//     newCategory.save((err, category) => {
//         handleErr(err);
//         console.log("System Category saved to data collection", category);
//         // res.json(category);
//         // next();
//         res.redirect('back');
//     });
//     // res.redirect('/');
// });

// POST new system after checking if it already exists
router.post('/', (req, res, next) => { //~
    // set upsert to set up data https://stackoverflow.com/a/33401897/1446598
    var q = SystemCategory.findOneAndUpdate(
        // query
        { name: req.body.name },
        // update
        {
            description: req.body.description,
            color: req.body.color,
            $push: { values: req.body.system_category }
        },
        // options
        { upsert: true, new: true }
    );
    q.exec(function (err, data) {
        console.log('added system category document', data);
        res.redirect('back');
        // res.json(data);
    });

    // res.redirect('back');
});


// helper method
function handleErr(err) {
    if (err) return next(err);
}

module.exports = router;