const mongoose = require("mongoose");

const statusTypes = [
  "created",
  "in-progress",
  "on-hold",
  "completed",
  "canceled"
];
const closingStatusTypes = [
  "resolved",
  "fix not available",
  "not a bug",
  "already fixed"
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
  affectedVersions: { type: JSON, required: true },
  serviceType: { type: String, default: "Bug Fix Request" },
  impact: { type: String, required: true, enum: impactTypes },
  createdOn: { type: Date, default: Date.now(), min: Date.now() },
  priority: { type: String, required: true },
  tag: { type: String, enum: ["server-side", "web-ui", "web-app", "desktop-app", "desktop-ui"]},
  createdBy: { type: JSON, required: true },
  assignedTo: { type: String },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  recreationSteps: { type: JSON, required: true },
  status: { type: String, required: true, enum: statusTypes },
  closedOn: { type: Date, min: Date.now() },
  resolutionNotes: { type: String },
  updateNotes: { type: JSON, default: [] },
  closingStatus: { type: String, required: false, enum: closingStatusTypes },
  closingNote: { type: String, required: false },
  NPRId: { type: String },
  files: { type: Array }
});

module.exports = mongoose.model("Bugfix", bugFixSchema);
