const express = require("express");
const router = express.Router();
const {
  createUser,
  findUsers,
  findUserById,
  deleteUserById,
  bookCase,
} = require("../controllers/userController");

router.get("/", findUsers);
router.get("/:id", findUserById);
router.post("/bookCase/:id", bookCase);
router.delete("/:id", deleteUserById);

module.exports = router;
