"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, FileSpreadsheet, BarChart3, TrendingUp, Activity, Calendar, Download, UserPlus, X } from "lucide-react"
import { useAdmin } from "../../context/AdminContext"
import { adminAPI } from "../../services/api"
import { toast } from "react-toastify"

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { admin } = useAdmin()

  const [showAddAdminModal, setShowAddAdminModal] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [adminPermissions, setAdminPermissions] = useState({
    users: true,
    files: true,
    charts: true,
    analytics: true,
  })
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminAPI.getStats()
        setStats(response.data.data)
      } catch (error) {
        console.error("Error loading stats:", error)
        toast.error("Failed to load dashboard statistics")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const loadUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await adminAPI.getUsers({ limit: 100 })
      setUsers(response.data.data)
    } catch (error) {
      console.error("Error loading users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!selectedUser) {
      toast.error("Please select a user")
      return
    }

    try {
      const user = users.find((u) => u._id === selectedUser)
      const permissions = Object.keys(adminPermissions).filter((key) => adminPermissions[key])

      await adminAPI.createAdmin({
        name: user.name,
        email: user.email,
        password: "defaultPassword123", // In real app, this should be generated or set by user
        permissions,
      })

      toast.success("Admin created successfully")
      setShowAddAdminModal(false)
      setSelectedUser("")
      setAdminPermissions({
        users: true,
        files: true,
        charts: true,
        analytics: true,
      })
    } catch (error) {
      console.error("Error creating admin:", error)
      toast.error("Failed to create admin")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {admin?.name}! Here's what's happening today.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 md:mt-0 flex gap-3"
            >
              <button className="bg-white text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 border">
                <Download size={18} />
                Export Data
              </button>
              <button
                onClick={() => {
                  setShowAddAdminModal(true)
                  loadUsers()
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <UserPlus size={18} />
                Add Admin
              </button>
            </motion.div>
          </div>

          {/* Stats Cards */}
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
              <p className="text-sm text-green-600 mt-2">+{stats?.recentUsers || 0} this month</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Total Files</h3>
                <FileSpreadsheet className="text-green-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalFiles || 0}</p>
              <p className="text-sm text-blue-600 mt-2">
                {stats?.fileStats?.length > 0 ? `+${stats.fileStats[0].count}` : "+0"} this month
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Total Charts</h3>
                <BarChart3 className="text-purple-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalCharts || 0}</p>
              <p className="text-sm text-purple-600 mt-2">Analytics generated</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Active Admins</h3>
                <TrendingUp className="text-red-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalAdmins || 0}</p>
              <p className="text-sm text-red-600 mt-2">System administrators</p>
            </motion.div>
          </motion.div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* File Upload Trends */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">File Upload Trends</h3>
                <Activity className="text-gray-500" size={20} />
              </div>

              <div className="h-64 flex items-end justify-between gap-2">
                {stats?.fileStats
                  ?.slice(0, 6)
                  .reverse()
                  .map((stat, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <motion.div
                        className="bg-red-500 rounded-t-md w-full"
                        initial={{ height: 0 }}
                        animate={{
                          height: `${Math.max((stat.count / Math.max(...stats.fileStats.map((s) => s.count))) * 200, 10)}px`,
                        }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="h-full relative">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                            {stat.count}
                          </span>
                        </div>
                      </motion.div>
                      <span className="text-xs text-gray-500 mt-2">
                        {stat._id.month}/{stat._id.year}
                      </span>
                    </div>
                  ))}
              </div>
            </motion.div>

            {/* Top Users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Top Users</h3>
                <Users className="text-gray-500" size={20} />
              </div>

              <div className="space-y-4">
                {stats?.topUsers?.slice(0, 5).map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-medium">
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
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors group"
              >
                <Users className="text-gray-500 group-hover:text-red-500 mb-2" size={24} />
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-500">View and manage all users</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <FileSpreadsheet className="text-gray-500 group-hover:text-green-500 mb-2" size={24} />
                <p className="font-medium text-gray-900">File Management</p>
                <p className="text-sm text-gray-500">Monitor file uploads</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
              >
                <BarChart3 className="text-gray-500 group-hover:text-purple-500 mb-2" size={24} />
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-500">View detailed analytics</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <Calendar className="text-gray-500 group-hover:text-blue-500 mb-2" size={24} />
                <p className="font-medium text-gray-900">Reports</p>
                <p className="text-sm text-gray-500">Generate system reports</p>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Add Admin Modal */}
        {showAddAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Add New Admin</h3>
                  <button onClick={() => setShowAddAdminModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                    {loadingUsers ? (
                      <div className="text-center py-4">Loading users...</div>
                    ) : (
                      <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select a user...</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                    <div className="space-y-2">
                      {Object.keys(adminPermissions).map((permission) => (
                        <label key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={adminPermissions[permission]}
                            onChange={(e) =>
                              setAdminPermissions({
                                ...adminPermissions,
                                [permission]: e.target.checked,
                              })
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 capitalize">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowAddAdminModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAdmin}
                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Create Admin
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
