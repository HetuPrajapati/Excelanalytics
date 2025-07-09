const express = require("express")
const { check } = require("express-validator")
const {
  adminLogin,
  getAdminProfile,
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  deleteUser,
  getAllFiles,
  deleteFile,
  getAllCharts,
  deleteChart,
  createAdmin,
  updateAdminProfile,
  updateSystemSettings,
  getSystemSettings,
} = require("../controllers/admin.controller")
const { adminProtect, checkPermission } = require("../middleware/adminAuth.middleware")

const router = express.Router()

// Auth routes
router.post(
  "/login",
  [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
  adminLogin,
)

router.get("/me", adminProtect, getAdminProfile)

// Dashboard
router.get("/stats", adminProtect, checkPermission("analytics"), getDashboardStats)

// User management
router.get("/users", adminProtect, checkPermission("users"), getAllUsers)
router.get("/users/:id", adminProtect, checkPermission("users"), getUserDetails)
router.delete("/users/:id", adminProtect, checkPermission("users"), deleteUser)

// File management
router.get("/files", adminProtect, checkPermission("files"), getAllFiles)
router.delete("/files/:id", adminProtect, checkPermission("files"), deleteFile)

// Chart management
router.get("/charts", adminProtect, checkPermission("charts"), getAllCharts)
router.delete("/charts/:id", adminProtect, checkPermission("charts"), deleteChart)

// Get single chart details
router.get(
  "/charts/:id",
  adminProtect,
  checkPermission("charts"),
  (req, res, next) => {
    // Set admin role for chart access
    req.user.role = "admin"
    next()
  },
  require("../controllers/chart.controller").getChart,
)

// Admin management
router.post("/create", adminProtect, createAdmin)

// Profile management
router.put("/profile", adminProtect, updateAdminProfile)

// System settings
router.get("/system-settings", adminProtect, getSystemSettings)
router.put("/system-settings", adminProtect, updateSystemSettings)

module.exports = router
