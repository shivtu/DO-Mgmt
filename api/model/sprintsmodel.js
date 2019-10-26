const mongoose = require("mongoose");

const phases = [
  "open",
  "sprinting",
  "closed"
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

const sprintsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  NPRID: {type: String, required: true, index: true },
  EPCID: {type: String, required: true, index: true },
  SRID: {
    type: String,
    required: true,
    index: true,
    unique: true
  } /* Set index to true for faster search on DB. This field is auto generated */,
  customerName: { type: String },
  product: { type: String },
  productVersion: { type: Array, require: true, default: [] },
  serviceType: { type: String, default: "Epic" },
  createdOn: { type: Date, default: Date.now(), min: Date.now() },
  createdBy: { type: JSON, required: true },
  summary: { type: String, required: true },
  toDo: { type:Array },
  doing: { type:Array },
  done: { type:Array },
  labels: { type: String },
  files: { type: Array, default: [] },
});

/**backLog structure:
 * backLogs: [
 *  { "to-do": [],
 *    "doing": [],  
 *    "done": [],  
 *  }
 * ]
 */

module.exports = mongoose.model("Sprints", sprintsSchema);
