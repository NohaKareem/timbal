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

// GET all systems
router.get('/', (req, res, next) => {
    System.find((err, systems) => {
        handleErr(err);
        res.json(systems);
    }).sort({ name: 'asc' });
});

// GET a system, given id
router.get('/:id', (req, res, next) => {
    System.find({ _id: req.params.id }, (err, systems) => {
        handleErr(err);
        res.json(systems);
    });
});

// todo merge
// // GET all categories for variable with specific id
// router.get('/:id/categories', (req, res, next) => {
//     Category.find({ variable: req.params.id }, (err, categories) => {
//         handleErr(err);
//         res.json(categories);
//     }).sort({ code: 'asc' });
// });

// helper method
function handleErr(err) {
    if (err) return next(err);
}

module.exports = router;