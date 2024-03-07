const {
  newTransaction,
  getAllTransactions,
} = require("../controllers/transactionController");
const protect = require("../middleware/authMiddleware");

const router = require("express").Router();

router
  .route("/")
  .post(protect, newTransaction)
  .get(protect, getAllTransactions);

module.exports = router;
