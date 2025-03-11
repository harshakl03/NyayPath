const express = require("express");
const router = express.Router();
const {
  fileCase,
  acceptCase,
  fetchMyCases,
  rejectCase,
  uploadDocument,
} = require("../controllers/caseController");

router.post("/fileCase/:id", fileCase);
router.post("/acceptCase/:id/:case_id", acceptCase);
router.post("/rejectCase/:id/:case_id", rejectCase);
router.get("/fetchMyCase/:id", fetchMyCases);
router.patch("/uploadDocument/:case_id/:mediator_id", uploadDocument);

module.exports = router;
