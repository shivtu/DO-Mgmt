const mongoose = require('mongoose');

const Counters = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    modelType: { type: String, unique : true, required : true, dropDups: true, index: true },
    sequence_value: { type: Number }
});

module.exports = mongoose.model('Counters', Counters);