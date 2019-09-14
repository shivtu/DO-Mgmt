const mongoose = require('mongoose');

const Counters = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    modelType: String,
    sequence_value: Number
});

module.exports = mongoose.model('Counters', Counters);