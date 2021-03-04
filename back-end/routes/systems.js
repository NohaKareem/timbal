var express = require('express');
var router = express.Router();
var System = require('../models/System.js');
var SystemCategory = require('../models/SystemCategory.js');

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

// GET all categories for system with specific id
router.get('/:id/categories', (req, res, next) => {
    SystemCategory.find({ system: req.params.id }, (err, systemCategories) => {
        handleErr(err);
        res.json(systemCategories);
    }).sort({ name: 'asc' });
});

// helper method
function handleErr(err) {
    if (err) return next(err);
}

module.exports = router;