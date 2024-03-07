const transactionModel = require("../models/transactionModel");
const userModel = require("../models/userModel");

const newTransaction = async (req, res) => {
  try {
    const { totalPrice, amountPaid, change, user, orderedItems } = req.body;

    console.log(req.body);

    if (!totalPrice || !amountPaid || !change || !user || !orderedItems) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // store it to database
    const response = await transactionModel.create(req.body);

    return res
      .status(200)
      .json({ message: "Transaction successful", response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel
      .find()
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "orderedItems",
        populate: {
          path: "productId",
          model: "Product",
        },
      });

    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  newTransaction,
  getAllTransactions,
};
