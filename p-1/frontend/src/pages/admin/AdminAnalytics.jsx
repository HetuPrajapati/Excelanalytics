"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, FileSpreadsheet, BarChart3, Download, Activity, PieChart } from "lucide-react"
import { adminAPI } from "../../services/api"
import { toast } from "react-toastify"

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30") // days

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getStats()
      setStats(response.data.data)
    } catch (error) {
      console.error("Error loading analytics:", error)
      toast.error("Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive insights and system analytics</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 md:mt-0 flex gap-3"
            >
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button className="bg-white text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 border">
                <Download size={18} />
                Export Report
              </button>
            </motion.div>
          </div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Total Users</h3>
                <Users className="text-blue-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{stats?.recentUsers || 0} this month</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Files Uploaded</h3>
                <FileSpreadsheet className="text-green-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalFiles || 0}</p>
              <div className="flex items-center mt-2">
                <Activity size={16} className="text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">{stats?.fileStats?.[0]?.count || 0} this month</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Charts Created</h3>
                <BarChart3 className="text-purple-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalCharts || 0}</p>
              <div className="flex items-center mt-2">
                <PieChart size={16} className="text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">Analytics generated</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Storage Used</h3>
                <Activity className="text-orange-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.fileStats?.reduce((total, stat) => total + (stat.totalSize || 0), 0)
                  ? (
                      stats.fileStats.reduce((total, stat) => total + (stat.totalSize || 0), 0) /
                      1024 /
                      1024 /
                      1024
                    ).toFixed(2)
                  : "0.00"}
                GB
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">Data storage</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* User Growth Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                <Users className="text-gray-500" size={20} />
              </div>

              <div className="h-64 flex items-end justify-between gap-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const height = Math.random() * 200 + 20
                  return (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <motion.div
                        className="bg-blue-500 rounded-t-md w-full"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}px` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <div className="h-full relative">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                            {Math.floor(height / 10)}
                          </span>
                        </div>
                      </motion.div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(2024, i).toLocaleDateString("en", { month: "short" })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* File Upload Trends */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">File Upload Trends</h3>
                <FileSpreadsheet className="text-gray-500" size={20} />
              </div>

              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <motion.path
                    d="M0,150 Q150,100 300,120 T600,80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M0,150 Q150,100 300,120 T600,80 L600,200 L0,200 Z"
                    fill="rgba(16, 185, 129, 0.1)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Top Users and Chart Types */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Active Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Top Active Users</h3>
                <Users className="text-gray-500" size={20} />
              </div>

              <div className="space-y-4">
                {stats?.topUsers?.slice(0, 5).map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.user.name}</p>
                        <p className="text-sm text-gray-500">{user.user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{user.fileCount} files</p>
                      <p className="text-sm text-gray-500">{(user.totalSize / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Chart Type Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Chart Type Distribution</h3>
                <BarChart3 className="text-gray-500" size={20} />
              </div>

              <div className="space-y-4">
                {[
                  { type: "Bar Charts", count: Math.floor((stats?.totalCharts || 0) * 0.4), color: "bg-blue-500" },
                  { type: "Pie Charts", count: Math.floor((stats?.totalCharts || 0) * 0.3), color: "bg-green-500" },
                  { type: "Line Charts", count: Math.floor((stats?.totalCharts || 0) * 0.2), color: "bg-purple-500" },
                  { type: "Other", count: Math.floor((stats?.totalCharts || 0) * 0.1), color: "bg-orange-500" },
                ].map((item, index) => (
                  <div key={item.type} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{item.type}</span>
                        <span className="text-sm text-gray-500">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.count / (stats?.totalCharts || 1)) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* System Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">System Performance</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      className="text-green-500"
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.85) }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">85%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">Server Uptime</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>

              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      className="text-blue-500"
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.72) }}
                      transition={{ duration: 2, delay: 0.7 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">72%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">Storage Usage</p>
                <p className="text-xs text-gray-500">Of allocated space</p>
              </div>

              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      className="text-purple-500"
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.94) }}
                      transition={{ duration: 2, delay: 0.9 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">94%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">User Satisfaction</p>
                <p className="text-xs text-gray-500">Based on feedback</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminAnalytics
