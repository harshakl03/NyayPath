const express = require("express");
const router = express.Router();
const {
  findMediatorById,
  deleteMediatorById,
  changeStatus,
  fetchMyCases,
  uploadDocument,
} = require("../controllers/mediatorController");

router.get("/:id", findMediatorById);
router.patch("/changeStatus/:id", changeStatus);
router.delete("/:id", deleteMediatorById);
router.get("/fetchMyCase/:id", fetchMyCases);
router.patch("/uploadDocument/:case_id/:mediator_id", uploadDocument);

module.exports = router;
