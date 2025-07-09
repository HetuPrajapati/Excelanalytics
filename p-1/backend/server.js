const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth.routes")
const fileRoutes = require("./routes/file.routes")
const chartRoutes = require("./routes/chart.routes")
const adminRoutes = require("./routes/admin.routes")
const { errorHandler } = require("./middleware/error.middleware")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/charts", chartRoutes)
app.use("/api/admin", adminRoutes)

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to RareBlocks API" })
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
