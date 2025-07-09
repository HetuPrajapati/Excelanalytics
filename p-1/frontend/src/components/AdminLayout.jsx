"use client"

import AdminNavbar from "./AdminNavbar"

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  )
}

export default AdminLayout