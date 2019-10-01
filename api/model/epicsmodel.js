const mongoose = require("mongoose");

const priorityTypes = [
  1,
  2,
  3,
  4,
  5
]; /* Describes the priority an assigned developer/user should give to the assigned task.
Priorities can be changed in an already created request depending upon the task at hand
priorities are not related/coupled with time lines (end date, start date) */

const epicsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  NPRID: {type: String, required: true, index: true },
  SRID: {
    type: String,
    required: true,
    index: true,
    unique: true
  } /* Set index to true for faster search on DB. This field is auto generated */,
  customerName: { type: String },
  product: { type: String, require: true, index: true },
  productVersion: { type: Array },
  serviceType: { type: String, default: "Epic" },
  createdOn: { type: Date, default: Date.now(), min: Date.now() },
  createdBy: { type: String, required: true },
  summary: { type: String, required: true },
  backLogs: { type: Array, required: true },
  priority: { type: Number, enum: priorityTypes},
  files: { type: Array, default: [] },
  sprints: { type: Array }
});

module.exports = mongoose.model("Epics", epicsSchema);
