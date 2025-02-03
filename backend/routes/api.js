const express = require("express");
const router = express.Router();
const { createRecord, getRecord } = require("../controllers/userData");

router.post("/records", createRecord);
router.get("/records/:id", getRecord);

module.exports = router;
