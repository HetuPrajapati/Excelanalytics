"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Menu, X, LogOut, User, Bell } from "lucide-react"
import { useAdmin } from "../context/AdminContext"

const AdminNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAdmin()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  return (
    <motion.nav
      className="fixed w-full z-50 py-4 bg-gray-900 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/admin/dashboard">
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
            <span className="text-red-500 font-bold">/</span>
            <span className="font-bold text-white">ADMIN PANEL</span>
          </motion.div>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-gray-300">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/admin/dashboard">
            <motion.span
              className={`${isActive("/admin/dashboard") ? "text-white font-medium" : "text-gray-300"} hover:text-white transition-colors`}
              whileHover={{ y: -2 }}
            >
              Dashboard
            </motion.span>
          </Link>
          <Link to="/admin/users">
            <motion.span
              className={`${isActive("/admin/users") ? "text-white font-medium" : "text-gray-300"} hover:text-white transition-colors`}
              whileHover={{ y: -2 }}
            >
              Users
            </motion.span>
          </Link>
          <Link to="/admin/files">
            <motion.span
              className={`${isActive("/admin/files") ? "text-white font-medium" : "text-gray-300"} hover:text-white transition-colors`}
              whileHover={{ y: -2 }}
            >
              Files
            </motion.span>
          </Link>
          <Link to="/admin/charts">
            <motion.span
              className={`${isActive("/admin/charts") ? "text-white font-medium" : "text-gray-300"} hover:text-white transition-colors`}
              whileHover={{ y: -2 }}
            >
              Charts
            </motion.span>
          </Link>
          <Link to="/admin/analytics">
            <motion.span
              className={`${isActive("/admin/analytics") ? "text-white font-medium" : "text-gray-300"} hover:text-white transition-colors`}
              whileHover={{ y: -2 }}
            >
              Analytics
            </motion.span>
          </Link>
          <Link to="/admin/settings">
            <motion.span
              className={`${isActive("/admin/settings") ? "text-white font-medium" : "text-gray-300"} hover:text-white transition-colors`}
              whileHover={{ y: -2 }}
            >
              Settings
            </motion.span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {admin && (
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-white">{admin.name}</span>
                  <span className="text-xs text-gray-300">{admin.email}</span>
                </div>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </div>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-300 hover:text-red-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-gray-800 shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <span
                className={`block py-2 ${isActive("/admin/dashboard") ? "text-white font-medium" : "text-gray-300"}`}
              >
                Dashboard
              </span>
            </Link>
            <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)}>
              <span className={`block py-2 ${isActive("/admin/users") ? "text-white font-medium" : "text-gray-300"}`}>
                Users
              </span>
            </Link>
            <Link to="/admin/files" onClick={() => setMobileMenuOpen(false)}>
              <span className={`block py-2 ${isActive("/admin/files") ? "text-white font-medium" : "text-gray-300"}`}>
                Files
              </span>
            </Link>
            <Link to="/admin/charts" onClick={() => setMobileMenuOpen(false)}>
              <span className={`block py-2 ${isActive("/admin/charts") ? "text-white font-medium" : "text-gray-300"}`}>
                Charts
              </span>
            </Link>
            <Link to="/admin/analytics" onClick={() => setMobileMenuOpen(false)}>
              <span
                className={`block py-2 ${isActive("/admin/analytics") ? "text-white font-medium" : "text-gray-300"}`}
              >
                Analytics
              </span>
            </Link>
            <Link to="/admin/settings" onClick={() => setMobileMenuOpen(false)}>
              <span
                className={`block py-2 ${isActive("/admin/settings") ? "text-white font-medium" : "text-gray-300"}`}
              >
                Settings
              </span>
            </Link>
            <div className="pt-4 border-t border-gray-700 flex flex-col space-y-4">
              {admin && (
                <>
                  <div className="py-2">
                    <span className="font-medium text-white">{admin.name}</span>
                    <span className="block text-sm text-gray-300">{admin.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 py-2 text-red-400 font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default AdminNavbar
