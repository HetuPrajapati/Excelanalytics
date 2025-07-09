const express = require("express")
const { createChart, getCharts, getChart, updateChart, deleteChart } = require("../controllers/chart.controller")
const { protect } = require("../middleware/auth.middleware")

const router = express.Router()

router.post("/", protect, createChart)
router.get("/", protect, getCharts)
router.get("/:id", protect, getChart)
router.put("/:id", protect, updateChart)
router.delete("/:id", protect, deleteChart)

module.exports = router
