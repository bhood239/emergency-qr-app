const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createRecord, getRecord } = require("../controllers/userData");

router.post("/records", auth, createRecord);
router.get("/records/:id", auth, getRecord);

module.exports = router;
