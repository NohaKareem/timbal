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

// POST new system after checking if it already exists (by name)
router.post('/', (req, res, next) => { //~
    var q = SystemCategory.findOneAndUpdate(
        { name: req.body.name },
        {
            system: req.body.system,
            description: req.body.description,
            color: req.body.color,
            $push: { values: req.body.system_category }
        },
        { upsert: true, new: true }
    );
    q.exec(function (err, data) {
        console.log('added system category document', data);
        res.redirect('back');
        // res.json(data);
    });
    // res.redirect('back');
});

// delete a system category document
router.post('/:id/delete', (req, res, next) => {
    var q = System.findOneAndDelete({ _id: req.params.id });
    q.exec(function (err, mydata) {
        res.json(true)
        console.log('deleted system category document');
    });
    res.json(false)
    // res.redirect('/');
});


// helper method
function handleErr(err) {
    if (err) return next(err);
}

module.exports = router;