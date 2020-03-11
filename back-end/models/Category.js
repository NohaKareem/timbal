var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    variable: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable' }, 
    code: String,
    description: String, 
    is_top_level: Boolean,
    color: String //~~for top level
}); 

module.exports = mongoose.model('Category', categorySchema);