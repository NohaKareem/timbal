var mongoose = require('mongoose');

var systemSchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    description: String,
    // categories: [
    //     { type: mongoose.Schema.Types.ObjectId, ref: 'SystemCategory' }
    // ],

    // color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' }
});

module.exports = mongoose.model('System', systemSchema);