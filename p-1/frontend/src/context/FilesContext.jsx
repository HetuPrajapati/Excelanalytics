"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

const FilesContext = createContext(null)

export const FilesProvider = ({ children }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        // For now, we'll use localStorage
        const storedFiles = localStorage.getItem("uploadedFiles")
        if (storedFiles) {
          const parsedFiles = JSON.parse(storedFiles)
          // Filter files to only show the current user's files
          const userFiles = user ? parsedFiles.filter((file) => file.uploadedBy?.id === user.id) : parsedFiles
          setFiles(userFiles)
        } else {
          setFiles([])
        }
      } catch (error) {
        console.error("Error loading files:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [user])

  const uploadFile = async (file) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
            }
          : null,
        // In a real app, you'd parse the Excel file here
        rows: Math.floor(Math.random() * 1000) + 100,
        columns: Math.floor(Math.random() * 10) + 5,
      }

      // Get existing files or initialize empty array
      const existingFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]")

      // Add new file to the array
      const updatedFiles = [...existingFiles, newFile]

      // Save back to localStorage
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))

      // Update state
      setFiles((prev) => [...prev, newFile])

      return newFile
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  const deleteFile = async (fileId) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      const existingFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]")
      const updatedFiles = existingFiles.filter((file) => file.id !== fileId)
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))

      // Update state
      setFiles((prev) => prev.filter((file) => file.id !== fileId))

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      throw error
    }
  }

  const getFileData = async (fileId) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      const existingFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]")
      const file = existingFiles.find((file) => file.id === fileId)

      if (!file) {
        throw new Error("File not found")
      }

      // Simulate file data
      const mockData = {
        headers: ["Month", "Sales", "Revenue", "Profit"],
        rows: Array.from({ length: file.rows }, (_, i) => ({
          Month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12],
          Sales: Math.floor(Math.random() * 1000),
          Revenue: Math.floor(Math.random() * 10000),
          Profit: Math.floor(Math.random() * 5000),
        })),
      }

      return mockData
    } catch (error) {
      console.error("Error getting file data:", error)
      throw error
    }
  }

  const value = {
    files,
    loading,
    uploadFile,
    deleteFile,
    getFileData,
  }

  return <FilesContext.Provider value={value}>{children}</FilesContext.Provider>
}

export const useFiles = () => {
  const context = useContext(FilesContext)
  if (context === null) {
    throw new Error("useFiles must be used within a FilesProvider")
  }
  return context
}
