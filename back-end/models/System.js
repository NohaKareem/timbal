var mongoose = require('mongoose');

var systemSchema = new mongoose.Schema({
    name: String, 
    description: String, 
    values: [
       {
        system_category_value: String, 
        variable_categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
       }
    ],
    color: [//~~ change to string
        {
            red: Number, 
            green: Number, 
            blue: Number
        }
    ]
}); 

module.exports = mongoose.model('System', systemSchema);