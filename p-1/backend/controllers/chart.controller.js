const Chart = require("../models/Chart.model")
const File = require("../models/File.model")

// @desc    Create chart
// @route   POST /api/charts
// @access  Private
exports.createChart = async (req, res, next) => {
  try {
    const { title, type, fileId, xAxis, yAxis, data } = req.body

    // Check if file exists
    const file = await File.findById(fileId)
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
        message: "Not authorized to use this file",
      })
    }

    // Create chart
    const chart = await Chart.create({
      title,
      type,
      file: fileId,
      xAxis,
      yAxis,
      data,
      createdBy: req.user.id,
    })

    res.status(201).json({
      success: true,
      data: chart,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all charts
// @route   GET /api/charts
// @access  Private
exports.getCharts = async (req, res, next) => {
  try {
    const charts = await Chart.find({ createdBy: req.user.id })
      .populate("file", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: charts.length,
      data: charts,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single chart
// @route   GET /api/charts/:id
// @access  Private
exports.getChart = async (req, res, next) => {
  try {
    const chart = await Chart.findById(req.params.id).populate("file", "name data").populate("createdBy", "name email")

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found",
      })
    }

    // Check if user owns the chart or is admin
    if (chart.createdBy._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this chart",
      })
    }

    res.status(200).json({
      success: true,
      data: chart,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update chart
// @route   PUT /api/charts/:id
// @access  Private
exports.updateChart = async (req, res, next) => {
  try {
    let chart = await Chart.findById(req.params.id)

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found",
      })
    }

    // Check if user owns the chart
    if (chart.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this chart",
      })
    }

    // Update chart
    chart = await Chart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: chart,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete chart
// @route   DELETE /api/charts/:id
// @access  Private
exports.deleteChart = async (req, res, next) => {
  try {
    const chart = await Chart.findById(req.params.id)

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found",
      })
    }

    // Check if user owns the chart
    if (chart.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this chart",
      })
    }

    await chart.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
