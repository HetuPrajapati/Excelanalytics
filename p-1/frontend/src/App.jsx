"use client"

import { useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom"

import Navbar from "./components/Navbar"
import AdminLayout from "./components/AdminLayout"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import UploadFile from "./pages/UploadFile"
import FileHistory from "./pages/FileHistory"
import About from "./pages/About"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminFiles from "./pages/admin/AdminFiles"
import AdminCharts from "./pages/admin/AdminCharts"
import AdminAnalytics from "./pages/admin/AdminAnalytics"
import AdminSettings from "./pages/admin/AdminSettings"

import { AuthProvider, useAuth } from "./context/AuthContext"
import { AdminProvider } from "./context/AdminContext"
import AdminProtectedRoute from "./components/AdminProtectedRoute"
import AOS from "aos"
import "aos/dist/aos.css"

// Protected route for normal users
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Layout with Navbar for main user-facing pages
const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
)

function AppContent() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Admin Routes - all wrapped inside AdminProvider */}
        <Route
          path="/admin/*"
          element={
            <AdminProvider>
              <Routes>
                <Route path="login" element={<AdminLogin />} />

                <Route
                  path="dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                <Route
                  path="users"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminUsers />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                <Route
                  path="files"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminFiles />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                <Route
                  path="charts"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminCharts />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                <Route
                  path="analytics"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminAnalytics />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                <Route
                  path="settings"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <AdminSettings />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }
                />

                <Route path="" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AdminProvider>
          }
        />

        {/* Main site routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadFile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <FileHistory />
              </ProtectedRoute>
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
