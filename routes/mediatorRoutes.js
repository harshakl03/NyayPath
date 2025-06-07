const express = require("express");
const router = express.Router();
const {
  findMediatorById,
  deleteMediatorById,
  changeStatus,
  fetchMyCases,
  uploadDocument,
  acceptCase,
  rejectCase,
  createMeeting,
  scheduleNewDate,
} = require("../controllers/mediatorController");

router.get("/:id", findMediatorById);
router.patch("/changeStatus/:id", changeStatus);
router.delete("/:id", deleteMediatorById);
router.get("/fetchMyCase/:id", fetchMyCases);
router.post("/acceptCase/:mediator_id/:case_id", acceptCase);
router.post("/rejectCase/:mediator_id/:case_id", rejectCase);
router.post("/createMeeting/:mediator_id/:case_id", createMeeting);
router.post("/scheduleNewDate/:mediator_id/:case_id", scheduleNewDate);
router.patch("/uploadDocument/:case_id/:mediator_id", uploadDocument);

module.exports = router;
