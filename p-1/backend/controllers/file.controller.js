const File = require("../models/File.model")
const xlsx = require("xlsx")
const path = require("path")
const fs = require("fs")

// @desc    Upload file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      })
    }

    // Process Excel/CSV file
    const filePath = path.join(__dirname, "../uploads", req.file.filename)
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet)

    // Count rows and columns
    const rows = data.length
    const columns = rows > 0 ? Object.keys(data[0]).length : 0

    // Create file record
    const file = await File.create({
      name: req.file.originalname,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      type: req.file.mimetype,
      rows,
      columns,
      data: {
        headers: rows > 0 ? Object.keys(data[0]) : [],
        rows: data,
      },
      uploadedBy: req.user.id,
    })

    res.status(201).json({
      success: true,
      data: file,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all files
// @route   GET /api/files
// @access  Private
exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find({ uploadedBy: req.user.id })
      .populate("uploadedBy", "name email")
      .sort({ uploadedAt: -1 })

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single file
// @route   GET /api/files/:id
// @access  Private
exports.getFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id).populate("uploadedBy", "name email")

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      })
    }

    // Check if user owns the file
    if (file.uploadedBy._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this file",
      })
    }

    res.status(200).json({
      success: true,
      data: file,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      })
    }

    // Check if user owns the file
    if (file.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this file",
      })
    }

    // Delete file from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }

    await file.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get file data for charts
// @route   GET /api/files/:id/data
// @access  Private
exports.getFileData = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      })
    }

    // Check if user owns the file
    if (file.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this file",
      })
    }

    res.status(200).json({
      success: true,
      data: file.data,
    })
  } catch (error) {
    next(error)
  }
}
