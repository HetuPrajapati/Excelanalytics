"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Menu, X, LogOut } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <motion.nav
      className={`fixed w-full z-50 py-4 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-gray-50"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/">
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
            <span className="text-red-500 font-bold">/</span>
            <span className="font-bold text-gray-900">EXCELANALYTICS</span>
          </motion.div>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 hover:text-gray-900">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard">
            <motion.span
              className={`${isActive("/dashboard") ? "text-gray-900 font-medium" : "text-gray-700"} hover:text-gray-900 transition-colors`}
              whileHover={{ y: -2 }}
            >
              Dashboard
            </motion.span>
          </Link>
          <Link to="/upload">
            <motion.span
              className={`${isActive("/upload") ? "text-gray-900 font-medium" : "text-gray-700"} hover:text-gray-900 transition-colors`}
              whileHover={{ y: -2 }}
            >
              Upload File
            </motion.span>
          </Link>
          <Link to="/history">
            <motion.span
              className={`${isActive("/history") ? "text-gray-900 font-medium" : "text-gray-700"} hover:text-gray-900 transition-colors`}
              whileHover={{ y: -2 }}
            >
              File History
            </motion.span>
          </Link>
          <Link to="/about">
            <motion.span
              className={`${isActive("/about") ? "text-gray-900 font-medium" : "text-gray-700"} hover:text-gray-900 transition-colors`}
              whileHover={{ y: -2 }}
            >
              About ExcelAnalytics
            </motion.span>
          </Link>
          <Link to="/admin">
            <motion.span
              className={`${isActive("/admin") ? "text-gray-900 font-medium" : "text-gray-700"} hover:text-gray-900 transition-colors`}
              whileHover={{ y: -2 }}
            >
              Admin
            </motion.span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-500 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </motion.button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <motion.span
                  className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign in
                </motion.span>
              </Link>
              <Link to="/signup">
                <motion.span
                  className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create free account
                </motion.span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <span className={`block py-2 ${isActive("/dashboard") ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                Dashboard
              </span>
            </Link>
            <Link to="/upload" onClick={() => setMobileMenuOpen(false)}>
              <span className={`block py-2 ${isActive("/upload") ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                Upload File
              </span>
            </Link>
            <Link to="/history" onClick={() => setMobileMenuOpen(false)}>
              <span className={`block py-2 ${isActive("/history") ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                File History
              </span>
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              <span className={`block py-2 ${isActive("/about") ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                About Rareblocks
              </span>
            </Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
              <span className={`block py-2 ${isActive("/admin") ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                Admin
              </span>
            </Link>
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-4">
              {user ? (
                <>
                  <div className="py-2">
                    <span className="font-medium text-gray-900">{user.name}</span>
                    <span className="block text-sm text-gray-500">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 py-2 text-red-500 font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <span className="py-2 text-gray-900 font-medium">Sign in</span>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <span className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium text-center block">
                      Create free account
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
