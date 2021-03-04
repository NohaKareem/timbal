var mongoose = require('mongoose');

var systemCategorySchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    description: String,
    system: { type: mongoose.Schema.Types.ObjectId, ref: 'System' },
    values: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    ],
    color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' }
}, { collection: 'systemCategories' });

module.exports = mongoose.model('SystemCategory', systemCategorySchema);