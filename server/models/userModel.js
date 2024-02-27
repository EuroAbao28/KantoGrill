const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    middlename: { type: String },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: true },
    public_id: { type: String, required: true },
    adminType: {
      type: String,
      required: true,
      enum: ["cashier", "admin", "super_admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", adminSchema);
