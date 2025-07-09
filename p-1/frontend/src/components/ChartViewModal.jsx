"use client"

import { useState, useRef } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import html2canvas from "html2canvas"

const ChartViewModal = ({ isOpen, onClose, chart }) => {
  const [activeTab, setActiveTab] = useState("chart")
  const chartRef = useRef(null)

  if (!isOpen || !chart) return null

  const downloadChart = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
          logging: false,
          useCORS: true,
        })

        const link = document.createElement("a")
        link.download = `${chart.title || "chart"}-${Date.now()}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      } catch (error) {
        console.error("Error downloading chart:", error)
        alert("Failed to download chart. Please try again.")
      }
    }
  }

  const renderChart = () => {
    if (!chart.data || !Array.isArray(chart.data) || chart.data.length === 0) {
      return <div className="flex items-center justify-center h-64 text-gray-500">No data available for this chart</div>
    }

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff", "#00ffff"]

    switch (chart.type?.toLowerCase()) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xAxis || "name"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chart.yAxis || "value"} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xAxis || "name"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={chart.yAxis || "value"} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey={chart.yAxis || "value"}
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xAxis || "name"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={chart.yAxis || "value"} stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xAxis || "name"} />
              <YAxis dataKey={chart.yAxis || "value"} />
              <Tooltip />
              <Legend />
              <Scatter name="Data" data={chart.data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xAxis || "name"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chart.yAxis || "value"} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Chart Details</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadChart}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("chart")}
            className={`px-6 py-3 font-medium ${
              activeTab === "chart" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Chart View
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 font-medium ${
              activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`px-6 py-3 font-medium ${
              activeTab === "data" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Data Preview
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "chart" && (
            <div ref={chartRef} className="bg-white p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-center">{chart.title}</h3>
              {renderChart()}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{chart.title || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg capitalize">{chart.type || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {chart.createdBy?.name || chart.userId || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source File</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {chart.sourceFile?.filename || chart.fileName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">X-Axis</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{chart.xAxis || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Y-Axis</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{chart.yAxis || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {chart.createdAt ? new Date(chart.createdAt).toLocaleString() : "N/A"}
                </p>
              </div>
              {chart.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{chart.description}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "data" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
              {chart.data && Array.isArray(chart.data) && chart.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(chart.data[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {chart.data.slice(0, 10).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {value?.toString() || "N/A"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {chart.data.length > 10 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Showing first 10 rows of {chart.data.length} total rows
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No data available for this chart</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChartViewModal
