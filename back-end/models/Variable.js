var mongoose = require('mongoose');

var variableSchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String, 
    description: String
}); //, {collection: 'variables'}

module.exports = mongoose.model('Variable', variableSchema);