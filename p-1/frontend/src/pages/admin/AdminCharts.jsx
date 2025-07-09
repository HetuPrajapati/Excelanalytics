"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
} from "lucide-react"
import ChartViewModal from "../../components/ChartViewModal"
import { adminAPI } from "../../services/api"
import { toast } from "react-toastify"

const AdminCharts = () => {
  const [charts, setCharts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedChart, setSelectedChart] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadCharts()
  }, [currentPage, searchTerm, sortBy, sortOrder])

  const loadCharts = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getCharts({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy,
        sortOrder,
      })

      setCharts(response.data.data)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      console.error("Error loading charts:", error)
      toast.error("Failed to load charts")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteChart = async (chartId) => {
    if (window.confirm("Are you sure you want to delete this chart? This action cannot be undone.")) {
      try {
        await adminAPI.deleteChart(chartId)
        toast.success("Chart deleted successfully")
        loadCharts()
      } catch (error) {
        console.error("Error deleting chart:", error)
        toast.error("Failed to delete chart")
      }
    }
  }

  const handleViewChart = async (chartId) => {
    try {
      const response = await adminAPI.getChartDetails(chartId)
      setSelectedChart(response.data.data)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error loading chart details:", error)
      toast.error("Failed to load chart details")
    }
  }

  const getChartIcon = (type) => {
    switch (type) {
      case "bar":
      case "bar3d":
        return <BarChart3 size={20} className="text-blue-500" />
      case "pie":
      case "pie3d":
        return <PieChart size={20} className="text-green-500" />
      case "line":
        return <LineChart size={20} className="text-purple-500" />
      case "area":
        return <Activity size={20} className="text-orange-500" />
      case "scatter":
        return <TrendingUp size={20} className="text-red-500" />
      default:
        return <BarChart3 size={20} className="text-gray-500" />
    }
  }

  const getChartTypeName = (type) => {
    switch (type) {
      case "bar":
        return "Bar Chart"
      case "bar3d":
        return "3D Bar Chart"
      case "pie":
        return "Pie Chart"
      case "pie3d":
        return "3D Pie Chart"
      case "line":
        return "Line Chart"
      case "area":
        return "Area Chart"
      case "scatter":
        return "Scatter Plot"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Chart Management</h1>
              <p className="text-gray-600">Monitor and manage all created charts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 md:mt-0 flex gap-3"
            >
              <button className="bg-white text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 border">
                <Download size={18} />
                Export Charts
              </button>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
                  placeholder="Search charts by title..."
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="createdAt">Creation Date</option>
                    <option value="title">Chart Title</option>
                    <option value="type">Chart Type</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Order:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Charts Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading charts...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chart Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source File
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {charts.map((chart, index) => (
                      <motion.tr
                        key={chart._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getChartIcon(chart.type)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{chart.title}</div>
                              <div className="text-sm text-gray-500">
                                {chart.xAxis} vs {chart.yAxis}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getChartTypeName(chart.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User size={16} className="text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">{chart.createdBy?.name || "Unknown"}</div>
                              <div className="text-sm text-gray-500">{chart.createdBy?.email || ""}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{chart.file?.name || "Unknown"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar size={16} className="text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">
                                {new Date(chart.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(chart.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <motion.button
                              onClick={() => handleViewChart(chart._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View chart"
                            >
                              <Eye size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-green-600 hover:text-green-900"
                              title="Download chart"
                            >
                              <Download size={18} />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteChart(chart._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-red-600 hover:text-red-900"
                              title="Delete chart"
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

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? "z-10 bg-red-50 border-red-500 text-red-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Chart View Modal */}
          <ChartViewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} chart={selectedChart} />
        </motion.div>
      </div>
    </div>
  )
}

export default AdminCharts
