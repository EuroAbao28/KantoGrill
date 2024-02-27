const {
  editUser,
  deleteUser,
  createNewUser,
  login,
  getAllUser,
  checkUser,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const router = require("express").Router();

router
  .route("/")
  .post(upload.single("userImage"), createNewUser)
  .get(protect, getAllUser);
router.route("/:id").patch(protect, editUser).delete(protect, deleteUser);
router.post("/login", login);
router.get("/checkUser", protect, checkUser);

module.exports = router;
