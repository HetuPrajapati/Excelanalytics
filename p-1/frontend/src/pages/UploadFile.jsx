"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { FileSpreadsheet, Upload, CheckCircle, AlertCircle, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { filesAPI } from "../services/api"
import { toast } from "react-toastify"

const UploadFile = () => {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)
  const { user } = useAuth()

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Triggers when file is dropped
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  // Triggers when file is selected with click
  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  // Handle file input
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase()
      return ["xlsx", "xls", "csv"].includes(extension)
    })

    if (newFiles.length === 0) {
      setError("Please upload Excel or CSV files only")
      return
    }

    setError(null)
    setFiles([...files, ...newFiles])
  }

  // Handle the click of the upload button
  const onButtonClick = () => {
    inputRef.current.click()
  }

  // Remove a file from the list
  const removeFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  // Handle upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload")
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Upload each file
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await filesAPI.uploadFile(formData)
        return response.data.data
      })

      const uploadedFiles = await Promise.all(uploadPromises)

      setUploadSuccess(true)
      toast.success(`Successfully uploaded ${files.length} file(s)`)

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false)
        setFiles([])
      }, 3000)
    } catch (error) {
      console.error("Upload error:", error)
      setError(error.response?.data?.message || "Failed to upload files. Please try again.")
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Upload Your Excel Files
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Upload your Excel or CSV files to analyze data and generate insights. Drag and drop your files or click to
            browse.
          </motion.p>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} className="relative">
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={handleChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            <motion.div
              className={`p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[300px] transition-colors ${
                dragActive ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
              }`}
              whileHover={{ scale: 1.01 }}
              onClick={onButtonClick}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <FileSpreadsheet size={64} className="text-red-500 mb-4" />
              </motion.div>
              <p className="text-lg font-medium text-gray-700 mb-2">Drag & Drop your Excel files here</p>
              <p className="text-sm text-gray-500 mb-4">Supports .xlsx, .xls, and .csv files</p>
              <motion.button
                type="button"
                className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload size={18} />
                Browse Files
              </motion.button>
            </motion.div>

            {dragActive && (
              <div
                className="absolute inset-0 w-full h-full"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              ></div>
            )}
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center gap-2"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet size={24} className="text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upload Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className={`px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 ${
              files.length === 0 || uploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            whileHover={files.length > 0 && !uploading ? { scale: 1.05 } : {}}
            whileTap={files.length > 0 && !uploading ? { scale: 0.95 } : {}}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle size={18} />
                Upload Complete!
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Files
              </>
            )}
          </motion.button>

          {files.length > 0 && (
            <Link to="/dashboard">
              <motion.button
                className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Dashboard
              </motion.button>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default UploadFile
