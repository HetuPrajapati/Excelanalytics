const Admin = require("../models/Admin.model")
const User = require("../models/User.model")
const File = require("../models/File.model")
const Chart = require("../models/Chart.model")
const { validationResult } = require("express-validator")

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Check for admin
    const admin = await Admin.findOne({ email }).select("+password")

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Admin account is deactivated",
      })
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    sendTokenResponse(admin, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Get admin profile
// @route   GET /api/admin/me
// @access  Private (Admin)
exports.getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: admin,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments()
    const totalFiles = await File.countDocuments()
    const totalCharts = await Chart.countDocuments()
    const totalAdmins = await Admin.countDocuments()

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })

    // Get file upload stats by month
    const fileStats = await File.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$uploadedAt" },
            month: { $month: "$uploadedAt" },
          },
          count: { $sum: 1 },
          totalSize: { $sum: "$size" },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 },
      },
      {
        $limit: 12,
      },
    ])

    // Get top users by file uploads
    const topUsers = await File.aggregate([
      {
        $group: {
          _id: "$uploadedBy",
          fileCount: { $sum: 1 },
          totalSize: { $sum: "$size" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $sort: { fileCount: -1 },
      },
      {
        $limit: 10,
      },
    ])

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalFiles,
        totalCharts,
        totalAdmins,
        recentUsers,
        fileStats,
        topUsers,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    // Build search query
    const searchQuery = search
      ? {
          $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
        }
      : {}

    const users = await User.find(searchQuery)
      .sort({ [sortBy]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await User.countDocuments(searchQuery)

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Get user's files and charts
    const files = await File.find({ uploadedBy: user._id }).sort({ uploadedAt: -1 })
    const charts = await Chart.find({ createdBy: user._id }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: {
        user,
        files,
        charts,
        stats: {
          totalFiles: files.length,
          totalCharts: charts.length,
          totalStorage: files.reduce((sum, file) => sum + file.size, 0),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Delete user's files and charts
    await File.deleteMany({ uploadedBy: user._id })
    await Chart.deleteMany({ createdBy: user._id })

    // Delete user
    await user.deleteOne()

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all files
// @route   GET /api/admin/files
// @access  Private (Admin)
exports.getAllFiles = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const sortBy = req.query.sortBy || "uploadedAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    // Build search query
    const searchQuery = search
      ? {
          name: { $regex: search, $options: "i" },
        }
      : {}

    const files = await File.find(searchQuery)
      .populate("uploadedBy", "name email")
      .sort({ [sortBy]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await File.countDocuments(searchQuery)

    res.status(200).json({
      success: true,
      data: files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete file
// @route   DELETE /api/admin/files/:id
// @access  Private (Admin)
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      })
    }

    // Delete associated charts
    await Chart.deleteMany({ file: file._id })

    // Delete file from filesystem
    const fs = require("fs")
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }

    // Delete file record
    await file.deleteOne()

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all charts
// @route   GET /api/admin/charts
// @access  Private (Admin)
exports.getAllCharts = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    // Build search query
    const searchQuery = search
      ? {
          title: { $regex: search, $options: "i" },
        }
      : {}

    const charts = await Chart.find(searchQuery)
      .populate("createdBy", "name email")
      .populate("file", "name")
      .sort({ [sortBy]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await Chart.countDocuments(searchQuery)

    res.status(200).json({
      success: true,
      data: charts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete chart
// @route   DELETE /api/admin/charts/:id
// @access  Private (Admin)
exports.deleteChart = async (req, res, next) => {
  try {
    const chart = await Chart.findById(req.params.id)

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found",
      })
    }

    await chart.deleteOne()

    res.status(200).json({
      success: true,
      message: "Chart deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
exports.updateAdminProfile = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body

    const admin = await Admin.findById(req.user.id).select("+password")

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      })
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to change password",
        })
      }

      const isMatch = await admin.matchPassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        })
      }

      admin.password = newPassword
    }

    // Update other fields
    admin.name = name || admin.name
    admin.email = email || admin.email

    await admin.save()

    // Remove password from response
    admin.password = undefined

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: admin,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update system settings
// @route   PUT /api/admin/system-settings
// @access  Private (Admin)
exports.updateSystemSettings = async (req, res, next) => {
  try {
    const { maxFileSize, allowedFileTypes, maxFilesPerUser, dataRetentionDays, enableNotifications, enableAnalytics } =
      req.body

    // Here you would typically save to a SystemSettings model or configuration
    // For now, we'll simulate saving to a configuration collection
    const SystemSettings = require("../models/SystemSettings.model")

    let settings = await SystemSettings.findOne()

    if (!settings) {
      settings = new SystemSettings()
    }

    settings.maxFileSize = maxFileSize || settings.maxFileSize
    settings.allowedFileTypes = allowedFileTypes || settings.allowedFileTypes
    settings.maxFilesPerUser = maxFilesPerUser || settings.maxFilesPerUser
    settings.dataRetentionDays = dataRetentionDays || settings.dataRetentionDays
    settings.enableNotifications =
      enableNotifications !== undefined ? enableNotifications : settings.enableNotifications
    settings.enableAnalytics = enableAnalytics !== undefined ? enableAnalytics : settings.enableAnalytics
    settings.updatedBy = req.user.id
    settings.updatedAt = new Date()

    await settings.save()

    res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      data: settings,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get system settings
// @route   GET /api/admin/system-settings
// @access  Private (Admin)
exports.getSystemSettings = async (req, res, next) => {
  try {
    const SystemSettings = require("../models/SystemSettings.model")
    let settings = await SystemSettings.findOne()

    if (!settings) {
      // Return default settings if none exist
      settings = {
        maxFileSize: 10,
        allowedFileTypes: ["xlsx", "xls", "csv"],
        maxFilesPerUser: 100,
        dataRetentionDays: 365,
        enableNotifications: true,
        enableAnalytics: true,
      }
    }

    res.status(200).json({
      success: true,
      data: settings,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create admin
// @route   POST /api/admin/create
// @access  Private (Super Admin)
exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, permissions } = req.body

    // Check if admin exists
    let admin = await Admin.findOne({ email })

    if (admin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      })
    }

    // Create admin
    admin = await Admin.create({
      name,
      email,
      password,
      permissions: permissions || ["users", "files", "charts", "analytics"],
    })

    res.status(201).json({
      success: true,
      data: admin,
    })
  } catch (error) {
    next(error)
  }
}

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token
  const token = admin.getSignedJwtToken()

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }

  // Remove password from output
  admin.password = undefined

  res.status(statusCode).json({
    success: true,
    token,
    data: admin,
  })
}
