var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    variable: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable' }, 
    category_values: [
        {
            parent_category_prefix: String, 
            subcategories: [
                {
                    category_value: String, 
                    category_description: String
                }
            ], 
            color: [
                {
                    red: Number, 
                    green: Number, 
                    blue: Number
                }
            ]
        }
    ]
}); //, {collection: 'categories'}

module.exports = mongoose.model('Category', categorySchema);