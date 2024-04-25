const {
  deleteUser,
  createNewUser,
  login,
  getAllUser,
  checkUser,
  updateUser,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const router = require("express").Router();

router
  .route("/")
  .post(protect, upload.single("userImage"), createNewUser)
  .get(protect, getAllUser);
router
  .route("/:id")
  .patch(protect, upload.single("userImage"), updateUser)
  .delete(protect, deleteUser);
router.post("/login", login);
router.get("/checkUser", protect, checkUser);

module.exports = router;
