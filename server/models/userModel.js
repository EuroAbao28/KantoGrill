const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const adminSchema = mongoose.Schema(
  {
    createdBy: reqString,
    username: { ...reqString, unique: true },
    firstname: reqString,
    lastname: reqString,
    password: reqString,
    imageUrl: reqString,
    imagePublicId: reqString,
    adminType: {
      ...reqString,
      enum: ["cashier", "admin", "super_admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", adminSchema);
