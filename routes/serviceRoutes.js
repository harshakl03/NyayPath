const express = require("express");
const router = express.Router();
const {
  initializeMeetingScheduler,
  translateContent,
} = require("../controllers/serviceControllers");

router.post("/initialize-meeting-scheduler", initializeMeetingScheduler);
router.post("/translate", translateContent);

module.exports = router;
