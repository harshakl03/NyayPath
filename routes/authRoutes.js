const express = require("express");
const router = express.Router();
const { login, secret, logOut } = require("../controllers/authController");
const { createUser } = require("../controllers/userController");
const { createMediator } = require("../controllers/mediatorController");

router.post("/login", login);
router.post("/logout", logOut);
router.get("/secret", secret);
router.post("/registerUser", createUser);
router.post("/registerMediator", createMediator);

module.exports = router;
