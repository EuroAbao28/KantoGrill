const {
  newTransaction,
  getAllTransactions,
  getTransactionByMonth,
} = require("../controllers/transactionController");
const protect = require("../middleware/authMiddleware");

const router = require("express").Router();

router
  .route("/")
  .post(protect, newTransaction)
  .get(protect, getAllTransactions);
router.get("/byMonth", getTransactionByMonth);

module.exports = router;
