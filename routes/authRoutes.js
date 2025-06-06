const express = require("express");
const router = express.Router();
const {
  login,
  verifyMediator,
  verifyUser,
} = require("../controllers/authController");
const { createUser } = require("../controllers/userController");
const { createMediator } = require("../controllers/mediatorController");

router.post("/login", login);
router.post("/registerUser", createUser);
router.post("/registerMediator", createMediator);
router.post("/verifyMediator/:id/:status", verifyMediator);
router.post("/verifyUser/:id/:status", verifyUser);

module.exports = router;
