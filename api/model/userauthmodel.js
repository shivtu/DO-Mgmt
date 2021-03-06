const mongoose = require("mongoose");

const userAuthSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  phone: {type: String, index: true, unique : true, dropDups: true, required : true },
  email: { type: String, unique : true, required : true, dropDups: true, index: true },
  group: { type: String, required: true, enum: ["customer", "internal", "vendor"] },
  userId: { type: String, unique : true, required : true, dropDups: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "dev", "dev-ops", "product-owner", "project-manager", "sales"] },
  status: { type: String, required: true, enum: ["Active", "In-Active"] }
});

module.exports = mongoose.model("UserAuth", userAuthSchema);
