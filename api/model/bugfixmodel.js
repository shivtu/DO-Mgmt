const mongoose = require('mongoose');

const statusTypes = ['created', 'in-progress', 'on-hold', 'completed', 'canceled'];
const priorityTypes = ['critical','high','medium','low']; /* Describes the priority an assigned developer/user should give to the assigned task
Priorities can be changed in an already created request depending upon the task at hand
priorities are not related/coupled with time lines (end date, start date) */

const bugFixSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SRID: {type :String, required: true, index: true, unique: true}, /* Set index to true for faster search on DB */
    customerName: {type: String, required: true},
    serviceType: {type: String, default: 'Bug Fix Request'},
    impact: {type: String, required: true, enum: priorityTypes},
    createdOn: {type: Date, default: Date.now(), min: Date.now()},
    createdBy: {type: String, required: true},
    summary: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, required: true, enum: statusTypes},
    endDate: {type: Date, required: true, min: Date.now()},
    updates: {type: JSON},
    NPRId: {type: String, required: true},
    files: {type: JSON}
});

module.exports = mongoose.model('Bugfix', bugFixSchema);