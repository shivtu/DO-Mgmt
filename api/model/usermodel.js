const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  middleName: { type: String, default: "N/A" },
  lastName: { type: String, required: true },
  phone: {type: String, index: true, unique : true, dropDups: true, required: true },
  email: { type: String, unique : true, required : true, dropDups: true, index: true },
  group: { type: String, required: true, enum: ["customer", "internal", "vendor"] },
  userId: { type: String, unique : true, required : true, dropDups: true, index: true },
  initPwd: { type: String, required: true },
  role: { type: String, require: true, enum: ["admin", "dev", "dev-ops", "product-owner", "project-manager", "sales"] },
  status: { type: String, required: true, enum: ["Active", "In-Active"], default: "Active" },
  security: { type: Array },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "unspecified"]
  },
  bio: { type: JSON },
  createdBy: { type: JSON, required: true },
  createdOn: { type: Date, required: true, default: Date.now() },
  displayPicture: { type: Array },
  activities: { type: JSON }
});

module.exports = mongoose.model("User", userSchema);
