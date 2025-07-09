import axios from "axios"

const API_URL = "https://excelanalytics-backend-y5qy.onrender.com/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Create admin axios instance
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a request interceptor to add the admin token to requests
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle admin token expiration
adminApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Admin token expired or invalid
      localStorage.removeItem("adminToken")
      localStorage.removeItem("admin")
      window.location.href = "/admin/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
  logout: () => api.get("/auth/logout"),
}

// Files API
export const filesAPI = {
  uploadFile: (formData) => {
    return api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  getFiles: () => api.get("/files"),
  getFile: (id) => api.get(`/files/${id}`),
  getFileData: (id) => api.get(`/files/${id}/data`),
  deleteFile: (id) => api.delete(`/files/${id}`),
}

// Charts API
export const chartsAPI = {
  createChart: (chartData) => api.post("/charts", chartData),
  getCharts: () => api.get("/charts"),
  getChart: (id) => api.get(`/charts/${id}`),
  updateChart: (id, chartData) => api.put(`/charts/${id}`, chartData),
  deleteChart: (id) => api.delete(`/charts/${id}`),
}

// Admin API
export const adminAPI = {
  login: (credentials) => adminApi.post("/admin/login", credentials),
  getProfile: () => adminApi.get("/admin/me"),
  getStats: () => adminApi.get("/admin/stats"),

  // User management
  getUsers: (params) => adminApi.get("/admin/users", { params }),
  getUserDetails: (id) => adminApi.get(`/admin/users/${id}`),
  deleteUser: (id) => adminApi.delete(`/admin/users/${id}`),

  // File management
  getFiles: (params) => adminApi.get("/admin/files", { params }),
  deleteFile: (id) => adminApi.delete(`/admin/files/${id}`),

  // Chart management
  getCharts: (params) => adminApi.get("/admin/charts", { params }),
  getChartDetails: (id) => adminApi.get(`/admin/charts/${id}`),
  deleteChart: (id) => adminApi.delete(`/admin/charts/${id}`),

  // Admin management
  createAdmin: (adminData) => adminApi.post("/admin/create", adminData),

  // Profile and Settings
  updateProfile: (profileData) => adminApi.put("/admin/profile", profileData),
  getSystemSettings: () => adminApi.get("/admin/system-settings"),
  updateSystemSettings: (settings) => adminApi.put("/admin/system-settings", settings),
}

export default api
