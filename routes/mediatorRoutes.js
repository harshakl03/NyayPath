const express = require("express");
const router = express.Router();
const {
  createMediator,
  findMediators,
  findMediatorById,
  deleteMediatorById,
  changeStatus,
} = require("../controllers/mediatorController");

router.get("/", findMediators);
router.get("/:id", findMediatorById);
router.patch("/changeStatus/:id", changeStatus);
router.delete("/:id", deleteMediatorById);

module.exports = router;
