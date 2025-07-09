const mongoose = require("mongoose")

const SystemSettingsSchema = new mongoose.Schema(
  {
    maxFileSize: {
      type: Number,
      default: 10,
      min: 1,
      max: 100,
    },
    allowedFileTypes: {
      type: [String],
      default: ["xlsx", "xls", "csv"],
    },
    maxFilesPerUser: {
      type: Number,
      default: 100,
      min: 1,
    },
    dataRetentionDays: {
      type: Number,
      default: 365,
      min: 30,
    },
    enableNotifications: {
      type: Boolean,
      default: true,
    },
    enableAnalytics: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Admin",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("SystemSettings", SystemSettingsSchema)
