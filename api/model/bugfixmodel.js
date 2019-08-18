const mongoose = require('mongoose');

const bugFixSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    SRID: String,
    customerName: String,
    serviceType: String,
    priority: Number,
    createdOn: Number,
    createdBy: String
});

module.exports = mongoose.model('Bugfix', bugFixSchema);