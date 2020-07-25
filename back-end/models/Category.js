var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    variable: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable' }, 
    code: String,
    description: String, 
    is_top_level: Boolean,
    color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' }
}); 

module.exports = mongoose.model('Category', categorySchema);