const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const reqNum = {
  type: Number,
  required: true,
};

const productSchema = mongoose.Schema(
  {
    name: reqString,
    price: reqNum,
    stocks: reqNum,
    category: reqString,
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
    },
    imageUrl: reqString,
    imagePublicId: { type: String, default: "" },
    addedBy: reqString,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
