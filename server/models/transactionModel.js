const mongoose = require("mongoose");

const orderedItemsSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const transactionSchema = new mongoose.Schema({
  totalPrice: { type: String, required: true },
  amountPaid: { type: String, required: true },
  change: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderedItems: [orderedItemsSchema],
});

module.exports = mongoose.model("Transaction", transactionSchema);
