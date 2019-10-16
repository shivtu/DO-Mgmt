const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true },
  group: { type: Number, required: true },
  userId: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, require: true, default: "X" },
  Gender: {
    type: String,
    required: true,
    enum: ["male", "female", "unspecified"]
  },
  Bio: { type: JSON },
  createdBy: { type: String, required: true },
  createdOn: { type: Date, required: true, default: Date.now() },
  displayPicture: { type: String }
});

module.exports = mongoose.model("User", userSchema);
