var mongoose = require('mongoose');

var systemSchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    description: String
});

module.exports = mongoose.model('System', systemSchema);