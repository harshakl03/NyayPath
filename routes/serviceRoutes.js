const express = require("express");
const router = express.Router();
const {
  initializeMeetingScheduler,
} = require("../controllers/serviceControllers");

router.post("/initialize-meeting-scheduler", initializeMeetingScheduler);

module.exports = router;
