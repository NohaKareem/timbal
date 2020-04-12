var mongoose = require('mongoose');

var colorSchema = new mongoose.Schema({
    // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, 
    color: String 
}); 

module.exports = mongoose.model('Color', colorSchema);