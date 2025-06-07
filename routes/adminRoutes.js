const express = require("express");
const router = express.Router();
const {
  fileCase,
  dissmissBooking,
  findMediators,
  checkBooking,
  unVerifiedUsers,
  unVerifiedMediators,
  verifyUser,
  verifyMediator,
} = require("../controllers/adminController");

router.get("/getMediators", findMediators);
router.get("/checkBookings", checkBooking);
router.get("/unverifiedUsers", unVerifiedUsers);
router.get("/unverifiedMediators", unVerifiedMediators);
router.post("/verifyMediator/:id/:status", verifyMediator);
router.post("/verifyUser/:id/:status", verifyUser);
router.post("/fileCase/:id/:booking_id", fileCase);
router.post("/dismissBooking/:id/:booking_id", dissmissBooking);

module.exports = router;
