const mongoose = require("mongoose")

const ChartSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a chart title"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Please specify chart type"],
    enum: ["bar", "bar3d", "pie", "pie3d", "line", "area", "scatter"],
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  xAxis: {
    type: String,
    required: true,
  },
  yAxis: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Chart", ChartSchema)
