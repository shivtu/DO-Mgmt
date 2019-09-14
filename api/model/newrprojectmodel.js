const mongoose = require('mongoose');

const newProjectRequestSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SRID: String,
    customerName: String,
    serviceType: String,
    priority: Number,
    createdOn: Date,
    createdBy: String,
    summary: String,
    description: String,
    assignedTo: String,
    status: String,
    repoLink: String,
    childTask: JSON,
    files: JSON
});

module.exports = mongoose.model('NewProjectRequest', newProjectRequestSchema);