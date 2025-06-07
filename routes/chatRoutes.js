const express = require("express");
const { queryChatbot } = require("../controllers/chatController");
const router = express.Router();

router.post("/query", queryChatbot);

module.exports = router;
