var mongoose = require('mongoose');

var systemSchema = new mongoose.Schema({
    name: String, 
    description: String, 
    values: [
       {
        system_category_value: String, 
        variable_values: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
       }
    ],
    color: [
        {
            red: Number, 
            green: Number, 
            blue: Number
        }
    ]
}); //~, { collection: 'systems' }

module.exports = mongoose.model('System', systemSchema);