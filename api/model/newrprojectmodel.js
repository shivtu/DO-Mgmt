const mongoose = require("mongoose");

const phases = [
  "created",
  "in-progress",
  "on-hold",
  "delivered",
  "maintenance",
  "support",
  "release"
]; /**While ammending this array,
make sure no methods in Vlidate.js gets affected  */

const priorityTypes = [
  '1',
  '2',
  '3',
  '4',
  '5'
]; /* Describes the priority an assigned developer/user should give to the assigned task.
Priorities can be changed in an already created request depending upon the task at hand
priorities are not related/coupled with time lines (end date, start date) */

const newProjectRequestSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  SRID: {
    type: String,
    required: true,
    index: true,
    unique: true
  } /* Set index to true for faster search on DB. This field is auto generated */,
  customerName: { type: String, required: true },
  product: { type: String, required: true},
  productVersion: { type: Array },
  releases: { type: Array, default: [] },
  serviceType: { type: String, default: "New Project Request" },
  priority: { type: String, required: true, enum: priorityTypes },
  createdOn: { type: Date, default: Date.now(), min: Date.now() },
  createdBy: { type: JSON, required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: String },
  phase: { type: String, required: true, enum: phases, default: "created" },
  repoLink: { type: String },
  epics: { type: Array, default: [] },
  updateNotes: { type: Array, default: [] },
  lifeCycle: {
    type: Array, default: []
  } /**{assignedUser: userName, assignedOn: Date, assignedBy: currentUser} */,
  files: { type: Array, default: [] },
  deliveredOn: { type: Date },
  sprints: {type: Array, default: [] }
});

module.exports = mongoose.model("NewProjectRequest", newProjectRequestSchema);
