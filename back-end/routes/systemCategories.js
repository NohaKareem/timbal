var express = require('express');
var router = express.Router();
var SystemCategory = require('../models/SystemCategory.js');

const APP_NAME = "Timbal";

// check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.user) {//isAuthenticated()
        return next();
    }
    return res.json({ msg: 'need to login' });
}

// GET all system categories
router.get('/', (req, res, next) => {
    SystemCategory.find((err, systemCategories) => {
        handleErr(err, next);
        console.log(err);
        console.log(systemCategories);
        res.json(systemCategories);
    }).sort({ name: 'asc' });
});

// GET a system category, given id
router.get('/:id', (req, res, next) => {
    SystemCategory.findOne({ _id: req.params.id }, (err, systemCategories) => {
        handleErr(err, next);
        res.json(systemCategories);
    }).populate('values');
});

// helper method
function handleErr(err, next) {
    if (err) return next(err);
}

module.exports = router;