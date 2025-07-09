"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileSpreadsheet, Trash2, RefreshCw, Download, Search, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { filesAPI } from "../services/api"
import { toast } from "react-toastify"

const FileHistory = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all") // all, mine
  const [sortBy, setSortBy] = useState("newest") // newest, oldest, name
  const { user } = useAuth()

  useEffect(() => {
    // Load files from API
    const loadFiles = async () => {
      setLoading(true)
      try {
        const response = await filesAPI.getFiles()
        setFiles(response.data.data)
      } catch (error) {
        console.error("Error loading files:", error)
        toast.error("Failed to load file history")
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [])

  // Filter and sort files
  const filteredFiles = files
    .filter((file) => {
      // Apply search filter
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())

      // Apply user filter
      const matchesUser = filterBy === "all" || (filterBy === "mine" && file.uploadedBy?._id === user?.id)

      return matchesSearch && matchesUser
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "newest") {
        return new Date(b.uploadedAt) - new Date(a.uploadedAt)
      } else if (sortBy === "oldest") {
        return new Date(a.uploadedAt) - new Date(b.uploadedAt)
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  // Delete a file from history
  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file from history?")) {
      try {
        await filesAPI.deleteFile(fileId)
        setFiles(files.filter((file) => file._id !== fileId))
        toast.success("File deleted successfully")
      } catch (error) {
        console.error("Error deleting file:", error)
        toast.error("Failed to delete file")
      }
    }
  }

  // Delete all files from history
  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all file history?")) {
      try {
        // In a real app, you'd have a bulk delete endpoint
        // For now, we'll delete files one by one
        await Promise.all(files.map((file) => filesAPI.deleteFile(file._id)))
        setFiles([])
        toast.success("All files deleted successfully")
      } catch (error) {
        console.error("Error deleting all files:", error)
        toast.error("Failed to delete all files")
      }
    }
  }

  // Reuse a file (in a real app, this would copy the file to a new upload)
  const handleReuse = (file) => {
    // In a real app, this would trigger a new analysis or processing
    toast.info(`Reusing file: ${file.name}`)
  }

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">File History</h1>
            <p className="text-gray-600">
              {filteredFiles.length > 0
                ? `${filteredFiles.length} file${filteredFiles.length > 1 ? "s" : ""} in your history`
                : "No files in your history"}
            </p>
          </motion.div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Upload New File
              </motion.button>
            </Link>

            {files.length > 0 && (
              <motion.button
                onClick={handleDeleteAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Clear History
              </motion.button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Files</option>
                  <option value="mine">My Files</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">File Name</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading file history...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <FileSpreadsheet size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Files Found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterBy !== "all"
                ? "No files match your search or filter criteria"
                : "Upload Excel or CSV files to see your history"}
            </p>
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <FileSpreadsheet size={18} />
                Upload Your First File
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      File Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Uploaded By
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date Uploaded
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Data Points
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file, index) => (
                    <motion.tr
                      key={file._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileSpreadsheet size={20} className="text-red-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{file.uploadedBy?.name || "Unknown"}</div>
                        <div className="text-xs text-gray-500">{file.uploadedBy?.email || ""}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(file.uploadedAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{new Date(file.uploadedAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {file.rows.toLocaleString()} rows × {file.columns} columns
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            onClick={() => handleReuse(file)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Reuse file"
                          >
                            <RefreshCw size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-green-600 hover:text-green-900"
                            title="Download file"
                          >
                            <Download size={18} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(file._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete from history"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default FileHistory
