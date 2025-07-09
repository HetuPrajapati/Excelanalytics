const mongoose = require("mongoose")
const Admin = require("../models/Admin.model")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected")

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@rareblocks.com" })

    if (existingAdmin) {
      console.log("Admin user already exists!")
      process.exit(0)
    }

    // Create admin user
    const admin = await Admin.create({
      name: "Super Admin",
      email: "admin@rareblocks.com",
      password: "admin123", // This will be hashed automatically
      permissions: ["users", "files", "charts", "analytics"],
    })

    console.log("Admin user created successfully!")
    console.log("Email: admin@rareblocks.com")
    console.log("Password: admin123")
    console.log("Please change the password after first login!")

    process.exit(0)
  } catch (error) {
    console.error("Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
