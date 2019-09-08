const mongoose = require('mongoose');

const newProjectRequestSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SRID: String,
    customerName: String,
    serviceType: 'New Project Request',
    priority: Number,
    createdOn: Date,
    createdBy: String,
    summary: String,
    description: String,
    status: String,
    repoLink: String,
    childTask: JSON,
    file: String
});

module.exports = mongoose.model('NewProjectRequest', newProjectRequestSchema);