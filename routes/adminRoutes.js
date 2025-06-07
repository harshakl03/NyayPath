const express = require("express");
const router = express.Router();
const { fileCase, dissmissBooking } = require("../controllers/adminController");

router.post("/fileCase/:id/:booking_id", fileCase);
router.post("/dismissBooking/:id/:booking_id", dissmissBooking);

module.exports = router;
