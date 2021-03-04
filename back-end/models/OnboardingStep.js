var mongoose = require('mongoose');

var onboardingStepSchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    heading: String,
    text: String,
    button: String,
    attachTo: String,
    order: Number
}, { collection: 'onboardingSteps' });

module.exports = mongoose.model('OnboardingStep', onboardingStepSchema);