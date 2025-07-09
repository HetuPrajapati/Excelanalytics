"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  FileSpreadsheet,
  Upload,
  Table,
  BarChart3,
  PieChartIcon,
  LineChart,
  Download,
  BarChart2,
  Activity,
  TrendingUp,
  ChevronDown,
  Box as Cube,
  Disc,
  ArrowDown,
  ArrowRight,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { filesAPI, chartsAPI } from "../services/api"
import { toast } from "react-toastify"

const Dashboard = () => {
  const [files, setFiles] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState("bar") // bar, pie, line, area, scatter
  const { user } = useAuth()
  const [chartMenuOpen, setChartMenuOpen] = useState(false)
  const [xAxis, setXAxis] = useState("month")
  const [yAxis, setYAxis] = useState("value")
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: [],
    values: [],
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [charts, setCharts] = useState([])

  useEffect(() => {
    // Load files from API
    const loadData = async () => {
      setLoading(true)
      try {
        const filesResponse = await filesAPI.getFiles()
        const files = filesResponse.data.data
        setFiles(files)

        // Load saved charts
        const chartsResponse = await chartsAPI.getCharts()
        setCharts(chartsResponse.data.data)

        // If we have files, load the first one's data for charts
        if (files.length > 0) {
          setSelectedFile(files[0])
          const fileDataResponse = await filesAPI.getFileData(files[0]._id)

          // Process data for charts
          const fileData = fileDataResponse.data.data
          if (fileData && fileData.rows && fileData.rows.length > 0) {
            // Generate sample chart data
            const labels = fileData.headers || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
            const values = generateRandomData(labels.length)

            setChartData({
              labels,
              values,
            })
          } else {
            // Fallback to random data
            setChartData({
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              values: generateRandomData(6),
            })
          }
        }
      } catch (error) {
        console.error("Error loading data:", error)
        toast.error("Failed to load dashboard data")

        // Fallback to random data
        setChartData({
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: generateRandomData(6),
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  // Generate random data for charts
  const generateRandomData = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 100))
  }

  const pieChartData = {
    labels: ["Category A", "Category B", "Category C", "Category D"],
    values: generateRandomData(4),
  }

  const scatterData = Array.from({ length: 20 }, () => ({
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  }))

  // Calculate total rows and columns
  const totalRows = files.reduce((sum, file) => sum + file.rows, 0)
  const totalColumns = files.reduce((sum, file) => sum + file.columns, 0)

  const handleDownloadChart = async () => {
    if (!chartRef.current) return

    try {
      // Create a temporary canvas
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Get the chart container dimensions
      const chartContainer = chartRef.current
      const rect = chartContainer.getBoundingClientRect()

      // Set canvas size (double for better quality)
      canvas.width = rect.width * 2
      canvas.height = rect.height * 2
      ctx.scale(2, 2)

      // Set background
      ctx.fillStyle = "#f9fafb"
      ctx.fillRect(0, 0, rect.width, rect.height)

      // For SVG charts (line, area, scatter)
      const svgElement = chartContainer.querySelector("svg")
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
        const url = URL.createObjectURL(svgBlob)

        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height)
          downloadCanvas(canvas)
          URL.revokeObjectURL(url)
        }
        img.src = url
      } else {
        // For div-based charts (bar, pie, 3D charts)
        // We'll use a different approach - create a data URL from the chart
        const chartDataToDraw = {
          type: chartType,
          data: chartType.includes("pie") ? pieChartData : chartData,
          xAxis,
          yAxis,
        }

        // Draw chart based on type
        drawChartOnCanvas(ctx, chartDataToDraw, rect.width, rect.height)
        downloadCanvas(canvas)
      }
    } catch (error) {
      console.error("Error downloading chart:", error)
      toast.error("Failed to download chart")
    }
  }

  const drawChartOnCanvas = (ctx, chartData, width, height) => {
    ctx.fillStyle = "#f9fafb"
    ctx.fillRect(0, 0, width, height)

    const chartArea = {
      x: 40,
      y: 20,
      width: width - 80,
      height: height - 80,
    }

    if (chartType === "bar" || chartType === "bar3d") {
      drawBarChart(ctx, chartData.data || chartData, chartArea)
    } else if (chartType === "pie" || chartType === "pie3d") {
      drawPieChart(ctx, chartData.data || pieChartData, chartArea)
    }

    // Add title
    ctx.fillStyle = "#374151"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`, width / 2, 15)
  }

  const drawBarChart = (ctx, data, area) => {
    const values = data.values || chartData.values
    const labels = data.labels || chartData.labels
    const barWidth = (area.width / values.length) * 0.8
    const maxValue = Math.max(...values)

    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * area.height
      const x = area.x + (index * area.width) / values.length + (area.width / values.length - barWidth) / 2
      const y = area.y + area.height - barHeight

      // Draw bar
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value on top
      ctx.fillStyle = "#374151"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)

      // Draw label
      ctx.fillText(labels[index] || `Item ${index + 1}`, x + barWidth / 2, area.y + area.height + 15)
    })
  }

  const drawPieChart = (ctx, data, area) => {
    const centerX = area.x + area.width / 2
    const centerY = area.y + area.height / 2
    const radius = Math.min(area.width, area.height) / 2 - 20

    const total = data.values.reduce((sum, value) => sum + value, 0)
    const colors = ["#ef4444", "#f97316", "#f59e0b", "#10b981"]

    let currentAngle = -Math.PI / 2

    data.values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = colors[index % colors.length]
      ctx.fill()

      // Draw percentage
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY)

      currentAngle += sliceAngle
    })
  }

  const downloadCanvas = (canvas) => {
    const link = document.createElement("a")
    link.download = `chart-${chartType}-${new Date().toISOString().slice(0, 10)}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
    toast.success("Chart downloaded successfully")
  }

  // Save chart to backend
  const saveChart = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first")
      return
    }

    try {
      const chartDataToSave = {
        title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${selectedFile.name}`,
        type: chartType,
        fileId: selectedFile._id,
        xAxis,
        yAxis,
        data: {
          labels: chartData.labels,
          values: chartData.values,
        },
      }

      const response = await chartsAPI.createChart(chartDataToSave)

      // Add the new chart to the charts array
      setCharts([...charts, response.data.data])

      toast.success("Chart saved successfully")
    } catch (error) {
      console.error("Error saving chart:", error)
      toast.error("Failed to save chart")
    }
  }

  // Delete a chart
  const deleteChart = async (chartId) => {
    if (window.confirm("Are you sure you want to delete this chart?")) {
      try {
        await chartsAPI.deleteChart(chartId)
        setCharts(charts.filter((chart) => chart._id !== chartId))
        toast.success("Chart deleted successfully")
      } catch (error) {
        console.error("Error deleting chart:", error)
        toast.error("Failed to delete chart")
      }
    }
  }

  // Render different chart types
  const renderChart = () => {
    const chartContainer = (
      <div ref={chartRef} className="relative">
        {chartType === "bar" && (
          <div className="h-64 flex items-end justify-between gap-2 pt-5">
            {chartData.values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-red-500 rounded-t-md w-full"
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-full relative">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">{value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {chartType === "bar3d" && (
          <div className="h-64 flex items-end justify-between gap-2 pt-5" style={{ perspective: "1000px" }}>
            {chartData.values.map((value, index) => (
              <motion.div
                key={index}
                className="relative w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Back face */}
                <motion.div
                  className="absolute inset-0 bg-red-800 rounded-t-md origin-bottom"
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    transform: "translateZ(-8px) translateX(4px)",
                    transformStyle: "preserve-3d",
                  }}
                />
                {/* Right face */}
                <motion.div
                  className="absolute inset-0 bg-red-700 rounded-t-md origin-bottom"
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    transform: "translateZ(-4px) translateX(2px)",
                    transformStyle: "preserve-3d",
                  }}
                />
                {/* Front face */}
                <motion.div
                  className="bg-red-500 rounded-t-md w-full origin-bottom relative"
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                    {value}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}

        {chartType === "pie" && (
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {pieChartData.values.map((value, index) => {
                const total = pieChartData.values.reduce((a, b) => a + b, 0)
                const percentage = (value / total) * 100
                const colors = ["#ef4444", "#f97316", "#f59e0b", "#10b981"]

                // Calculate the position for the label
                const angle = (index / pieChartData.values.length) * 2 * Math.PI
                const labelX = 80 * Math.cos(angle) + 96
                const labelY = 80 * Math.sin(angle) + 96

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div
                      className="absolute inset-0 rounded-full overflow-hidden"
                      style={{
                        clipPath: `polygon(50% 50%, 100% 50%, ${100 - percentage}% 0%)`,
                        backgroundColor: colors[index % colors.length],
                        transform: `rotate(${index * 90}deg)`,
                      }}
                    ></div>
                    <div
                      className="absolute text-xs font-medium text-gray-700"
                      style={{
                        left: `${labelX}px`,
                        top: `${labelY}px`,
                      }}
                    >
                      {Math.round(percentage)}%
                    </div>
                  </motion.div>
                )
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white w-24 h-24 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {chartType === "pie3d" && (
          <div className="h-64 flex items-center justify-center" style={{ perspective: "1000px" }}>
            <div
              className="relative w-48 h-48"
              style={{
                transform: "rotateX(60deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {pieChartData.values.map((value, index) => {
                const total = pieChartData.values.reduce((a, b) => a + b, 0)
                const percentage = (value / total) * 100
                const colors = ["#ef4444", "#f97316", "#f59e0b", "#10b981"]
                const startAngle = pieChartData.values.slice(0, index).reduce((sum, v) => sum + (v / total) * 360, 0)

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Main slice */}
                    <div
                      className="absolute inset-0 rounded-full overflow-hidden"
                      style={{
                        background: `conic-gradient(from ${startAngle}deg, ${colors[index % colors.length]} ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                        transform: "translateZ(10px)",
                        transformStyle: "preserve-3d",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                    {/* Side depth */}
                    <div
                      className="absolute inset-0 rounded-full overflow-hidden"
                      style={{
                        background: `conic-gradient(from ${startAngle}deg, ${colors[index % colors.length]}dd ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                        transform: "translateZ(5px)",
                        transformStyle: "preserve-3d",
                      }}
                    />
                    {/* Percentage label */}
                    <div
                      className="absolute text-xs font-medium text-white"
                      style={{
                        left: `${50 + Math.cos(((startAngle + (percentage * 3.6) / 2) * Math.PI) / 180) * 25}%`,
                        top: `${50 + Math.sin(((startAngle + (percentage * 3.6) / 2) * Math.PI) / 180) * 25}%`,
                        transform: "translate(-50%, -50%) translateZ(15px)",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                      }}
                    >
                      {Math.round(percentage)}%
                    </div>
                  </motion.div>
                )
              })}
              {/* Center hole */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: "translateZ(12px)" }}
              >
                <div className="bg-white w-16 h-16 rounded-full shadow-lg" />
              </div>
            </div>
          </div>
        )}

        {chartType === "line" && (
          <div className="h-64 relative">
            {/* Chart grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((_, i) => (
                <div key={i} className="border-t border-gray-200 w-full h-0"></div>
              ))}
            </div>

            {/* Line chart */}
            <div className="absolute inset-0 pt-5 pb-5">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <motion.path
                  d={`M0,${200 - chartData.values[0] * 2} ${chartData.values
                    .map((value, i) => {
                      const x = (i / (chartData.values.length - 1)) * 600
                      const y = 200 - value * 2
                      return `L${x},${y}`
                    })
                    .join(" ")}`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {chartData.values.map((value, i) => {
                  const x = (i / (chartData.values.length - 1)) * 600
                  const y = 200 - value * 2
                  return (
                    <motion.circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#ef4444"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1.5 + i * 0.1 }}
                    />
                  )
                })}
              </svg>
            </div>

            {/* Y-axis labels */}
            <div className="absolute inset-y-0 left-0 w-10 flex flex-col justify-between items-end pr-2 text-xs text-gray-500">
              {[100, 75, 50, 25, 0].map((value) => (
                <div key={value}>{value}</div>
              ))}
            </div>
          </div>
        )}

        {chartType === "area" && (
          <div className="h-64 relative">
            {/* Chart grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((_, i) => (
                <div key={i} className="border-t border-gray-200 w-full h-0"></div>
              ))}
            </div>

            {/* Area chart */}
            <div className="absolute inset-0 pt-5 pb-5">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <motion.path
                  d={`M0,${200 - chartData.values[0] * 2} ${chartData.values
                    .map((value, i) => {
                      const x = (i / (chartData.values.length - 1)) * 600
                      const y = 200 - value * 2
                      return `L${x},${y}`
                    })
                    .join(" ")} L600,200 L0,200 Z`}
                  fill="rgba(239, 68, 68, 0.2)"
                  stroke="#ef4444"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              </svg>
            </div>

            {/* Y-axis labels */}
            <div className="absolute inset-y-0 left-0 w-10 flex flex-col justify-between items-end pr-2 text-xs text-gray-500">
              {[100, 75, 50, 25, 0].map((value) => (
                <div key={value}>{value}</div>
              ))}
            </div>
          </div>
        )}

        {chartType === "scatter" && (
          <div className="h-64 relative">
            {/* Chart grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((_, i) => (
                <div key={i} className="border-t border-gray-200 w-full h-0"></div>
              ))}
            </div>
            <div className="absolute inset-0 flex justify-between">
              {[0, 1, 2, 3, 4].map((_, i) => (
                <div key={i} className="border-l border-gray-200 h-full w-0"></div>
              ))}
            </div>

            {/* Scatter plot */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {scatterData.map((point, i) => (
                  <motion.circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="1.5"
                    fill="#ef4444"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  />
                ))}
              </svg>
            </div>
          </div>
        )}

        {/* Axes labels */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <ArrowRight className="text-gray-500 mr-1" size={16} />
            <span className="text-sm text-gray-700 capitalize">{xAxis}</span>
          </div>
          <div className="flex items-center">
            <ArrowDown className="text-gray-500 mr-1" size={16} />
            <span className="text-sm text-gray-700 capitalize">{yAxis}</span>
          </div>
        </div>
      </div>
    )

    return chartContainer
  }

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Excel Analytics Dashboard</h1>
            <p className="text-gray-600">
              {files.length > 0
                ? `Analyzing ${files.length} file${files.length > 1 ? "s" : ""} with ${totalRows.toLocaleString()} rows of data`
                : "Upload Excel files to see analytics"}
            </p>
          </motion.div>

          <Link to="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Upload size={18} />
              Upload More Files
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        ) : files.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <FileSpreadsheet size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Excel Files Uploaded</h2>
            <p className="text-gray-600 mb-6">Upload Excel or CSV files to see analytics and insights</p>
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <Upload size={18} />
                Upload Files
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Dashboard Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Files Uploaded</h3>
                  <FileSpreadsheet className="text-red-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{files.length}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Total Rows</h3>
                  <Table className="text-red-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalRows.toLocaleString()}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Total Columns</h3>
                  <BarChart3 className="text-red-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalColumns}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Data Points</h3>
                  <PieChartIcon className="text-red-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{(totalRows * totalColumns).toLocaleString()}</p>
              </motion.div>
            </motion.div>

            {/* Dashboard Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md mb-8"
            >
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      activeTab === "overview"
                        ? "border-b-2 border-red-500 text-red-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("files")}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      activeTab === "files"
                        ? "border-b-2 border-red-500 text-red-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Files
                  </button>
                  <button
                    onClick={() => setActiveTab("charts")}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      activeTab === "charts"
                        ? "border-b-2 border-red-500 text-red-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Charts
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Data Overview</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex justify-end mb-4">
                        <div className="relative inline-block text-left">
                          <div>
                            <button
                              type="button"
                              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              id="chart-options"
                              aria-expanded="true"
                              aria-haspopup="true"
                              onClick={() => setChartMenuOpen(!chartMenuOpen)}
                            >
                              <span className="mr-2">
                                {chartType === "bar" && <BarChart2 size={18} />}
                                {chartType === "pie" && <PieChartIcon size={18} />}
                                {chartType === "line" && <LineChart size={18} />}
                                {chartType === "area" && <Activity size={18} />}
                                {chartType === "scatter" && <TrendingUp size={18} />}
                                {chartType === "bar3d" && <Cube size={18} />}
                              </span>
                              {chartType.includes("3d")
                                ? chartType.replace("3d", " 3D")
                                : chartType.charAt(0).toUpperCase() + chartType.slice(1)}{" "}
                              Chart
                              <ChevronDown size={18} className="ml-2" />
                            </button>
                          </div>

                          {chartMenuOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                              <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="chart-options"
                              >
                                <button
                                  onClick={() => {
                                    setChartType("bar")
                                    setChartMenuOpen(false)
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm ${
                                    chartType === "bar" ? "text-red-500 bg-gray-100" : "text-gray-700"
                                  } hover:bg-gray-100 w-full text-left`}
                                  role="menuitem"
                                >
                                  <BarChart2 size={18} className="mr-2" /> Bar Chart
                                </button>
                                <button
                                  onClick={() => {
                                    setChartType("bar3d")
                                    setChartMenuOpen(false)
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm ${
                                    chartType === "bar3d" ? "text-red-500 bg-gray-100" : "text-gray-700"
                                  } hover:bg-gray-100 w-full text-left`}
                                  role="menuitem"
                                >
                                  <Cube size={18} className="mr-2" /> Bar 3D Chart
                                </button>
                                <button
                                  onClick={() => {
                                    setChartType("pie")
                                    setChartMenuOpen(false)
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm ${
                                    chartType === "pie" ? "text-red-500 bg-gray-100" : "text-gray-700"
                                  } hover:bg-gray-100 w-full text-left`}
                                  role="menuitem"
                                >
                                  <PieChartIcon size={18} className="mr-2" /> Pie Chart
                                </button>
                                <button
                                  onClick={() => {
                                    setChartType("pie3d")
                                    setChartMenuOpen(false)
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm ${
                                    chartType === "pie3d" ? "text-red-500 bg-gray-100" : "text-gray-700"
                                  } hover:bg-gray-100 w-full text-left`}
                                  role="menuitem"
                                >
                                  <Disc size={18} className="mr-2" /> Pie 3D Chart
                                </button>
                                <button
                                  onClick={() => {
                                    setChartType("line")
                                    setChartMenuOpen(false)
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm ${
                                    chartType === "line" ? "text-red-500 bg-gray-100" : "text-gray-700"
                                  } hover:bg-gray-100 w-full text-left`}
                                  role="menuitem"
                                >
                                  <LineChart size={18} className="mr-2" /> Line Chart
                                </button>
                                <button
                                  onClick={() => {
                                    setChartType("area")
                                    setChartMenuOpen(false)
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm ${
                                    chartType === "area" ? "text-red-500 bg-gray-100" : "text-gray-700"
                                  } hover:bg-gray-100 w-full text-left`}
                                  role="menuitem"
                                >
                                  <Activity size={18} className="mr-2" /> Area Chart
                                </button>
                                <button
                                  onClick={() => {
                                    setChartType("scatter")
                                    setChartMenuOpen(false)
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm ${
                                    chartType === "scatter" ? "text-red-500 bg-gray-100" : "text-gray-700"
                                  } hover:bg-gray-100 w-full text-left`}
                                  role="menuitem"
                                >
                                  <TrendingUp size={18} className="mr-2" /> Scatter Plot
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">X-Axis</label>
                          <select
                            value={xAxis}
                            onChange={(e) => setXAxis(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="month">Month</option>
                            <option value="category">Category</option>
                            <option value="product">Product</option>
                            <option value="region">Region</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Y-Axis</label>
                          <select
                            value={yAxis}
                            onChange={(e) => setYAxis(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="value">Value</option>
                            <option value="sales">Sales</option>
                            <option value="revenue">Revenue</option>
                            <option value="profit">Profit</option>
                          </select>
                        </div>
                      </div>

                      {/* File selector */}
                      <div className="col-span-2 mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
                        <select
                          value={selectedFile?._id || ""}
                          onChange={(e) => {
                            const fileId = e.target.value
                            const file = files.find((f) => f._id === fileId)
                            setSelectedFile(file)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          {files.map((file) => (
                            <option key={file._id} value={file._id}>
                              {file.name} ({file.rows} rows)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Chart */}
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 col-span-2"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-700">
                            {selectedFile ? selectedFile.name : "Data Visualization"}
                          </h3>
                          <div className="flex gap-2">
                            {chartType === "bar" && <BarChart2 size={18} className="text-gray-500" />}
                            {chartType === "pie" && <PieChartIcon size={18} className="text-gray-500" />}
                            {chartType === "line" && <LineChart size={18} className="text-gray-500" />}
                            {chartType === "area" && <Activity size={18} className="text-gray-500" />}
                            {chartType === "scatter" && <TrendingUp size={18} className="text-gray-500" />}
                            <button
                              onClick={handleDownloadChart}
                              className="text-gray-500 hover:text-gray-700"
                              title="Download Chart"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </div>

                        {renderChart()}

                        {chartType !== "pie" && chartType !== "scatter" && (
                          <div className="flex justify-between mt-2">
                            {chartData.labels.map((label, index) => (
                              <span key={index} className="text-xs text-gray-500">
                                {label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Save chart button */}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={saveChart}
                            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                          >
                            Save Chart
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "files" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Uploaded Files</h2>
                      <button className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium">
                        <Download size={16} />
                        Export All
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              File Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Uploaded By
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Size
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Rows
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Columns
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Last Modified
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {files.map((file, index) => (
                            <motion.tr
                              key={file._id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              whileHover={{ backgroundColor: "#f9fafb" }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FileSpreadsheet size={20} className="text-red-500 mr-2" />
                                  <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{file.uploadedBy?.name || "Unknown"}</div>
                                <div className="text-xs text-gray-500">{file.uploadedBy?.email || ""}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{file.rows.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{file.columns}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {new Date(file.lastModified).toLocaleDateString()}
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === "charts" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Data Visualization</h2>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setChartType("bar")}
                          className={`p-2 rounded-md ${
                            chartType === "bar" ? "bg-red-100 text-red-500" : "text-gray-500 hover:bg-gray-100"
                          }`}
                          title="Bar Chart"
                        >
                          <BarChart2 size={20} />
                        </button>
                        <button
                          onClick={() => setChartType("bar3d")}
                          className={`p-2 rounded-md ${
                            chartType === "bar3d" ? "bg-red-100 text-red-500" : "text-gray-500 hover:bg-gray-100"
                          }`}
                          title="3D Bar Chart"
                        >
                          <Cube size={20} />
                        </button>
                        <button
                          onClick={() => setChartType("pie")}
                          className={`p-2 rounded-md ${
                            chartType === "pie" ? "bg-red-100 text-red-500" : "text-gray-500 hover:bg-gray-100"
                          }`}
                          title="Pie Chart"
                        >
                          <PieChartIcon size={20} />
                        </button>
                        <button
                          onClick={() => setChartType("pie3d")}
                          className={`p-2 rounded-md ${
                            chartType === "pie3d" ? "bg-red-100 text-red-500" : "text-gray-500 hover:bg-gray-100"
                          }`}
                          title="3D Pie Chart"
                        >
                          <Disc size={20} />
                        </button>
                        <button
                          onClick={() => setChartType("line")}
                          className={`p-2 rounded-md ${
                            chartType === "line" ? "bg-red-100 text-red-500" : "text-gray-500 hover:bg-gray-100"
                          }`}
                          title="Line Chart"
                        >
                          <LineChart size={20} />
                        </button>
                        <button
                          onClick={() => setChartType("area")}
                          className={`p-2 rounded-md ${
                            chartType === "area" ? "bg-red-100 text-red-500" : "text-gray-500 hover:bg-gray-100"
                          }`}
                          title="Area Chart"
                        >
                          <Activity size={20} />
                        </button>
                        <button
                          onClick={() => setChartType("scatter")}
                          className={`p-2 rounded-md ${
                            chartType === "scatter" ? "bg-red-100 text-red-500" : "text-gray-500 hover:bg-gray-100"
                          }`}
                          title="Scatter Plot"
                        >
                          <TrendingUp size={20} />
                        </button>
                        <button
                          onClick={handleDownloadChart}
                          className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                          title="Download Chart"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Saved Charts */}
                    {charts.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Charts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {charts.map((chart, index) => (
                            <motion.div
                              key={chart._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <h4 className="font-medium text-gray-900">{chart.title}</h4>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setChartType(chart.type)
                                      setXAxis(chart.xAxis)
                                      setYAxis(chart.yAxis)
                                      // Set chart data if available
                                      if (chart.data && chart.data.labels && chart.data.values) {
                                        setChartData({
                                          labels: chart.data.labels,
                                          values: chart.data.values,
                                        })
                                      }
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                    title="Load Chart"
                                  >
                                    <RefreshCw size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteChart(chart._id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete Chart"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="text-sm text-gray-500 mb-2">
                                  <span className="font-medium">Type:</span>{" "}
                                  {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)}
                                </div>
                                <div className="text-sm text-gray-500 mb-2">
                                  <span className="font-medium">File:</span> {chart.file?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-500 mb-2">
                                  <span className="font-medium">Axes:</span> {chart.xAxis} vs {chart.yAxis}
                                </div>
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium">Created:</span>{" "}
                                  {new Date(chart.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                      {/* Chart */}
                      <motion.div whileHover={{ y: -5 }} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-700">
                            {chartType === "bar" && "Bar Chart"}
                            {chartType === "pie" && "Pie Chart"}
                            {chartType === "line" && "Line Chart"}
                            {chartType === "area" && "Area Chart"}
                            {chartType === "scatter" && "Scatter Plot"}
                          </h3>
                          {chartType === "bar" && <BarChart2 size={18} className="text-gray-500" />}
                          {chartType === "pie" && <PieChartIcon size={18} className="text-gray-500" />}
                          {chartType === "line" && <LineChart size={18} className="text-gray-500" />}
                          {chartType === "area" && <Activity size={18} className="text-gray-500" />}
                          {chartType === "scatter" && <TrendingUp size={18} className="text-gray-500" />}
                        </div>

                        {renderChart()}

                        {chartType !== "pie" && chartType !== "scatter" && (
                          <div className="flex justify-between mt-2">
                            {chartData.labels.map((label, index) => (
                              <span key={index} className="text-xs text-gray-500">
                                {label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Save chart button */}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={saveChart}
                            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                          >
                            Save Chart
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default Dashboard
