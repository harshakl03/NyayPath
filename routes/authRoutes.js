const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { createUser } = require("../controllers/userController");
const { createMediator } = require("../controllers/mediatorController");

router.post("/login", login);
router.post("/registerUser", createUser);
router.post("/registerMediator", createMediator);

module.exports = router;
