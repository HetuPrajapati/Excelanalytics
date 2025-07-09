const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin.model")

exports.adminProtect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Get token from header
    token = req.headers.authorization.split(" ")[1]
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if it's an admin token
    if (decoded.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized as admin",
      })
    }

    // Get admin from the token
    req.user = await Admin.findById(decoded.id)

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      })
    }

    // Check if admin is active
    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Admin account is deactivated",
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }
}

// Check specific permissions
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${permission}`,
      })
    }
    next()
  }
}
