var mongoose = require('mongoose');

var daySchema = new mongoose.Schema({
    date: {
        type: Date, 
        required:[true, 'A day document must at least have a date'],
    }, 
    variables: [
        {
            variable: { type: mongoose.Schema.Types.ObjectId, ref: 'Variable' },
            log_data: [
                {
                    start_time: Date, 
                    end_time: Date, 
                    full_category: [
                        { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
                    ],
                    // full_category: [{
                    //     category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, 
                    //     }], 
                    notes: String
                }
            ] 
        }
    ]
}); // { collection: 'days' }

module.exports = mongoose.model('Day', daySchema);