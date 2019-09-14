const mongoose = require('mongoose');

const bugFixSchema = mongoose.Schema({
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
    files: JSON
});

module.exports = mongoose.model('Bugfix', bugFixSchema);