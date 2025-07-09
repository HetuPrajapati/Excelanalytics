"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Shield, Database, Bell, Save, Eye, EyeOff } from "lucide-react"
import { useAdmin } from "../../context/AdminContext"
import { toast } from "react-toastify"
import { adminAPI } from "../../services/api"

const AdminSettings = () => {
  const { admin } = useAdmin()
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [systemSettingsLoading, setSystemSettingsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [systemSettings, setSystemSettings] = useState({
    maxFileSize: "10",
    allowedFileTypes: ["xlsx", "xls", "csv"],
    maxFilesPerUser: "100",
    dataRetentionDays: "365",
    enableNotifications: true,
    enableAnalytics: true,
  })

  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.name || "",
        email: admin.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [admin])

  useEffect(() => {
    loadSystemSettings()
  }, [])

  const loadSystemSettings = async () => {
    try {
      setSystemSettingsLoading(true)
      const response = await adminAPI.getSystemSettings()
      setSystemSettings(response.data.data)
    } catch (error) {
      console.error("Error loading system settings:", error)
      // Use default settings if loading fails
    } finally {
      setSystemSettingsLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate passwords if changing
      if (profileData.newPassword) {
        if (profileData.newPassword !== profileData.confirmPassword) {
          toast.error("New passwords do not match")
          return
        }
        if (profileData.newPassword.length < 6) {
          toast.error("Password must be at least 6 characters")
          return
        }
      }

      // Make API call to update profile
      await adminAPI.updateProfile({
        name: profileData.name,
        email: profileData.email,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
      })

      toast.success("Profile updated successfully")

      // Clear password fields
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      console.error("Error updating profile:", error)
      const errorMessage = error.response?.data?.message || "Failed to update profile"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSystemSettingsUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Make API call to update system settings
      await adminAPI.updateSystemSettings(systemSettings)

      toast.success("System settings updated successfully")
    } catch (error) {
      console.error("Error updating system settings:", error)
      const errorMessage = error.response?.data?.message || "Failed to update system settings"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Admin Settings</h1>
              <p className="text-gray-600">Manage your profile and system configuration</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-md p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "profile"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <User size={20} />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "security"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Shield size={20} />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab("system")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "system"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Database size={20} />
                    System Settings
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "notifications"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Bell size={20} />
                    Notifications
                  </button>
                </nav>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={profileData.currentPassword}
                                onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                              type={showPassword ? "text" : "password"}
                              value={profileData.newPassword}
                              onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                              type={showPassword ? "text" : "password"}
                              value={profileData.confirmPassword}
                              onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="bg-red-500 text-white px-6 py-2 rounded-md font-medium hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Save size={18} />
                          {loading ? "Saving..." : "Save Changes"}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                )}

                {/* System Settings */}
                {activeTab === "system" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
                    <form onSubmit={handleSystemSettingsUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                          <input
                            type="number"
                            value={systemSettings.maxFileSize}
                            onChange={(e) => setSystemSettings({ ...systemSettings, maxFileSize: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            min="1"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Files Per User</label>
                          <input
                            type="number"
                            value={systemSettings.maxFilesPerUser}
                            onChange={(e) => setSystemSettings({ ...systemSettings, maxFilesPerUser: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            min="1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (Days)</label>
                        <input
                          type="number"
                          value={systemSettings.dataRetentionDays}
                          onChange={(e) => setSystemSettings({ ...systemSettings, dataRetentionDays: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          min="30"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Enable Notifications</h3>
                            <p className="text-sm text-gray-500">Send system notifications to users</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemSettings.enableNotifications}
                              onChange={(e) =>
                                setSystemSettings({ ...systemSettings, enableNotifications: e.target.checked })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Enable Analytics</h3>
                            <p className="text-sm text-gray-500">Collect usage analytics and statistics</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemSettings.enableAnalytics}
                              onChange={(e) =>
                                setSystemSettings({ ...systemSettings, enableAnalytics: e.target.checked })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="bg-red-500 text-white px-6 py-2 rounded-md font-medium hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Save size={18} />
                          {loading ? "Saving..." : "Save Settings"}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-yellow-800 mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-yellow-700 mb-4">
                          Add an extra layer of security to your admin account
                        </p>
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors">
                          Enable 2FA
                        </button>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Login Sessions</h3>
                        <p className="text-sm text-blue-700 mb-4">Manage your active login sessions</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                          View Sessions
                        </button>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-red-800 mb-2">Account Security</h3>
                        <p className="text-sm text-red-700 mb-4">Review recent security events and login attempts</p>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                          Security Log
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-500">Receive email alerts for important events</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">New User Registrations</h3>
                            <p className="text-sm text-gray-500">Get notified when new users register</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">System Alerts</h3>
                            <p className="text-sm text-gray-500">Receive alerts for system issues and maintenance</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                            <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminSettings
