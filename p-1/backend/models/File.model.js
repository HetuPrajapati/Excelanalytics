const mongoose = require("mongoose")

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a file name"],
    trim: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  rows: {
    type: Number,
    default: 0,
  },
  columns: {
    type: Number,
    default: 0,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("File", FileSchema)
