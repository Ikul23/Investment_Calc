const express = require("express");
const router = express.Router();
const { generateReport } = require("../controllers/reportController");

router.get("/report/:projectId", generateReport);

module.exports = router;
