"use client"

import { Navigate } from "react-router-dom"
import { useAdmin } from "../context/AdminContext"

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminProtectedRoute