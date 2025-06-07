const express = require("express");
const router = express.Router();
const {
  fetchMyCases,
  uploadDocument,
} = require("../controllers/caseController");

router.get("/fetchMyCase/:id", fetchMyCases);
router.patch("/uploadDocument/:case_id/:mediator_id", uploadDocument);

module.exports = router;
