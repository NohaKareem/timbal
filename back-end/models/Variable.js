var mongoose = require('mongoose');

var variableSchema = new mongoose.Schema({
    name: String, 
    description: String
}); //, {collection: 'variables'}

module.exports = mongoose.model('Variable', variableSchema);