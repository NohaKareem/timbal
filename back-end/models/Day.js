var mongoose = require('mongoose');

var daySchema = new mongoose.Schema({
    date: Date, 
    variables: [
        {
            variable: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable' },
            log_data: [
                {
                    start_time: Date, 
                    end_time: Date, 
                    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
                }
            ] 
        }
    ]
}); // { collection: 'days' }

module.exports = mongoose.model('Day', daySchema);