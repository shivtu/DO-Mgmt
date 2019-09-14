const mongoose = require('mongoose');

const failFixSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SRID: String,
    customerName: String,
    serviceType: String,
    priority: Number,
    createdOn: String,
    createdBy: String,
    summary: String,
    description: String,
    status: String,
    endDate: Date,
    NPRId: String,
    updates: JSON,
    files: JSON
});

module.exports = mongoose.model('Failfix', failFixSchema);