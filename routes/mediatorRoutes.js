const express = require("express");
const router = express.Router();
const {
  createMediator,
  findMediators,
  findMediatorById,
  deleteMediatorById,
} = require("../controllers/mediatorController");

router.get("/", findMediators);
router.get("/:id", findMediatorById);
router.delete("/:id", deleteMediatorById);

module.exports = router;
