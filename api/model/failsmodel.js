const mongoose = require('mongoose');

const statusTypes = ['created', 'in-progress', 'on-hold', 'completed', 'canceled'];
const priorityTypes = [1,2,3,4,5]; /* Describes the priority an assigned developer/user should give to the assigned task
Priorities can be changed in an already created request depending upon the task at hand
priorities are not related/coupled with time lines (end date, start date) */

const failFixSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SRID: {type :String, required: true, index: true, unique: true}, /* Set index to true for faster search on DB */
    customerName: {type: String, required: true},
    serviceType: {type: String, default: 'Failed Apps Fix'},
    priority: {type: Number, required: true, enum: priorityTypes},
    createdOn: {type: Date, default: Date.now(), min: Date.now()},
    createdBy: {type: String, required: true},
    summary: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, required: true, enum: statusTypes},
    endDate: {type: Date, required: true, min: Date.now()},
    assignedTo: {type: String},
    NPRId: {type: String, required: true},
    updates: {type: JSON},
    files: {type: JSON}
});

module.exports = mongoose.model('Failfix', failFixSchema);