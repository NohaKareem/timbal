var mongoose = require('mongoose');

var systemSchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String, 
    description: String, 
    categories: [
    // values: [
    //    {
        // system_category_value: String, 
        // support further multi-variate systems
        // variable: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable' },
        // variable_categories:
         { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    //    }
    ],

    color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' }
}); 

module.exports = mongoose.model('System', systemSchema);