const mongoose = require("mongoose");

const phases = [
  "toDo",
  "doing",
  "done",
]; /**While ammending this array,
make sure no methods in Vlidate.js gets affected  */

const priorityTypes = [
  1,
  2,
  3,
  4,
  5
]; /* Describes the priority an assigned developer/user should give to the assigned task.
Priorities can be changed in an already created request depending upon the task at hand
priorities are not related/coupled with time lines (end date, start date) */

const sprintScema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  SRID: {
    type: String,
    required: true,
    index: true,
    unique: true
  } /* Set index to true for faster search on DB. This field is auto generated */,
  serviceType: { type: String, default: "Sprint" },
  priority: { type: Number, required: true, enum: priorityTypes },
  createdOn: { type: Date, default: Date.now(), min: Date.now() },
  createdBy: { type: String, required: true },
  startDate: { type: Date, require: true },
  endDate: { type: Date, require: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  backLogs: { type: JSON },
  assignedTo: { type: String },
  phase: { type: String, required: true, enum: phases },
  updateNotes: { type: Array, default: [] },
  lifeCycle: {
    type: Array, default: []
  } /**{assignedUser: userName, assignedOn: Date} */,
  files: { type: Array, default: [] },
  deliveredOn: { type: Date }
});

module.exports = mongoose.model("Sprint", sprintScema);
