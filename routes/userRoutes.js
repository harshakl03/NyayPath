const express = require("express");
const router = express.Router();
const {
  createUser,
  findUsers,
  findUserById,
  deleteUserById,
} = require("../controllers/userController");
const { login } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", findUsers);
router.get("/:id", findUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
