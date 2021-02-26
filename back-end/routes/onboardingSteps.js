var express = require('express');
var router = express.Router();
var OnboardingStep = require('../models/OnboardingStep.js');

const APP_NAME = "Timbal";

// check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.user) {//isAuthenticated()
        return next();
    }
    return res.json({ msg: 'need to login' });
}

// GET all onboarding steps
router.get('/', (req, res, next) => {
    OnboardingStep.find((err, onboardingSteps) => {
        handleErr(err, next);
        console.log(onboardingSteps)
        // console.error(err)
        res.json(onboardingSteps);
    }).sort({ order: 'asc' });
});

// GET onboarding step with specific id
router.get('/:id', (req, res, next) => {
    OnboardingStep.find({ _id: req.params.id }, (err, onboardingStep) => {
        handleErr(err, next, next);
        res.json(onboardingStep);
    }).sort({ order: 'asc' });
});


// helper method
function handleErr(err, next) {
    if (err) return next(err);
}

module.exports = router;