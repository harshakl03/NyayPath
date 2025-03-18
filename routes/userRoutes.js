const express = require("express");
const router = express.Router();
const {
  createUser,
  findUsers,
  findUserById,
  deleteUserById,
} = require("../controllers/userController");

router.get("/", findUsers);
router.get("/:id", findUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
