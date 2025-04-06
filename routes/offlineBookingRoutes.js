const express = require("express");
const {
  callBooking,
  smsBooking,
  smsStatusCheck,
} = require("../controllers/offlineBookingControllers");
const router = express.Router();

router.post("/call/book", callBooking);
router.get("/sms/book/:number", smsBooking);
router.get("/sms/checkstatus/:name", smsStatusCheck);

module.exports = router;
