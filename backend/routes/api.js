const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createRecord,
  getRecord,
  updateRecord,
} = require("../controllers/userData");

router.post("/records", auth, createRecord);
router.get("/records", auth, getRecord);
router.patch("/records/:id", auth, updateRecord);
module.exports = router;
