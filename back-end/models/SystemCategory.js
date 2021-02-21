var mongoose = require('mongoose');

var systemCategorySchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    description: String,
    values: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    ],
    color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' }
});

module.exports = mongoose.model('SystemCategory', systemCategorySchema);