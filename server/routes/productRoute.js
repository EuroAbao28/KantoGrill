const {
  addNewItem,
  updateItem,
  deleteItem,
  getAllItem,
  searchItem,
} = require("../controllers/productController");
const upload = require("../middleware/multer");
const protect = require("../middleware/authMiddleware");

const router = require("express").Router();

router
  .route("/")
  .get(protect, getAllItem)
  .post(protect, upload.single("productImage"), addNewItem);
router
  .route("/:id")
  .delete(protect, deleteItem)
  .patch(protect, upload.single("productImage"), updateItem);
router.get("/search", searchItem);

module.exports = router;
