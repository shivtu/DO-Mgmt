const mongoose = require("mongoose");

const statusTypes = [
  "created",
  "in-progress",
  "on-hold",
  "fixed",
  "canceled"
];
const impactTypes = [
  "critical",
  "high",
  "medium",
  "low"
]; /* Describes the priority an assigned developer/user should give to the assigned task
Priorities can be changed in an already created request depending upon the task at hand
priorities are not related/coupled with time lines (end date, start date) */

const bugFixSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  SRID: {
    type: String,
    required: true,
    index: true,
    unique: true
  } /* Set index to true for faster search on DB */,
  customerName: { type: String, required: true },
  product: { type: String, required: true },
  affectedVersions: { type: Array, required: true },
  serviceType: { type: String, default: "Bug Fix Request" },
  impact: { type: String, required: true, enum: impactTypes },
  createdOn: { type: Date, default: Date.now(), min: Date.now() },
  priority: { type: String, required: true },
  createdBy: { type: String, required: true },
  assignedTo: { type: String },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  recreationSteps: { type: Array, required: true },
  status: { type: String, required: true, enum: statusTypes },
  closedOn: { type: Date, required: true, min: Date.now() },
  resolutionNotes: { type: String },
  updateNotes: { type: Array, default: [] },
  NPRId: { type: String },
  files: { type: Array }
});

module.exports = mongoose.model("Bugfix", bugFixSchema);
