const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  middleName: { type: String, default: "NA" },
  lastName: { type: String, required: true },
  email: { type: String, unique : true, required : true, dropDups: true },
  group: { type: Number, required: true },
  userId: { type: String, unique : true, required : true, dropDups: true },
  initPwd: { type: String, required: true },
  role: { type: String, require: true, default: "X" },
  status: { type: String, required: true, default: "Active" },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "unspecified"]
  },
  bio: { type: JSON },
  createdBy: { type: String, required: true },
  createdOn: { type: Date, required: true, default: Date.now() },
  displayPicture: { type: Array }
});

module.exports = mongoose.model("User", userSchema);
