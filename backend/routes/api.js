const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/userData");

router.post("/records", auth, createRecord);
router.get("/records", auth, getRecord);
router.patch("/records/:id", auth, updateRecord);
router.delete("/records/:id", auth, deleteRecord);
module.exports = router;
