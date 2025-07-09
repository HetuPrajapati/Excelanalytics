"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { adminAPI } from "../services/api"
import { toast } from "react-toastify"

const AdminContext = createContext(null)

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    const storedAdmin = localStorage.getItem("admin")

    if (token && storedAdmin && storedAdmin !== "undefined") {
      try {
        const parsedAdmin = JSON.parse(storedAdmin)
        setAdmin(parsedAdmin)

        // Validate token with backend
        adminAPI
          .getProfile()
          .then((response) => {
            setAdmin(response.data.data)
          })
          .catch((error) => {
            console.error("Admin token validation failed:", error)
            localStorage.removeItem("adminToken")
            localStorage.removeItem("admin")
            setAdmin(null)
          })
          .finally(() => {
            setLoading(false)
          })
      } catch (error) {
        console.error("Error parsing admin from localStorage:", error)
        localStorage.removeItem("admin")
        setAdmin(null)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const response = await adminAPI.login(credentials)
      const { token, data } = response.data

      if (token && data) {
        localStorage.setItem("adminToken", token)
        localStorage.setItem("admin", JSON.stringify(data))
        setAdmin(data)
      }

      return { success: true }
    } catch (error) {
      console.error("Admin login error:", error)
      const message = error.response?.data?.message || "Login failed. Please check your credentials."
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem("adminToken")
      localStorage.removeItem("admin")
      setAdmin(null)
    } catch (error) {
      console.error("Admin logout error:", error)
    }
  }

  return <AdminContext.Provider value={{ admin, login, logout, loading }}>{children}</AdminContext.Provider>
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
