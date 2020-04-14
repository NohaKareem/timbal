var express = require('express');
var router = express.Router();
var System = require('../models/System.js');

const APP_NAME = "Timbal";

// GET all systems
router.get('/', (req, res, next) => {
    System.find((err, systems) => {
        handleErr(err);
        res.json(systems);
    }).sort({ name: 'asc' });
});

//~todo: test id routes (except cateogries tested)
router.get('/:id', (req, res, next) => { 
    System.find({ _id: req.params.id }, (err, systems) => {
        handleErr(err);
        res.json(systems);
    }).sort({ name: 'asc' });
});

// helper method
function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;