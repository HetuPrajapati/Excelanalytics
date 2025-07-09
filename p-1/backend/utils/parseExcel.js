const xlsx = require("xlsx")

/**
 * Parse Excel or CSV file and extract data
 * @param {string} filePath - Path to the file
 * @returns {Object} - Extracted data
 */
exports.parseExcelFile = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet)

    // Extract headers
    const headers = data.length > 0 ? Object.keys(data[0]) : []

    return {
      headers,
      rows: data,
      rowCount: data.length,
      columnCount: headers.length,
    }
  } catch (error) {
    console.error("Error parsing Excel file:", error)
    throw new Error("Failed to parse Excel file")
  }
}

/**
 * Generate chart data from Excel data
 * @param {Object} data - Excel data
 * @param {string} xAxis - X-axis field
 * @param {string} yAxis - Y-axis field
 * @returns {Object} - Chart data
 */
exports.generateChartData = (data, xAxis, yAxis) => {
  try {
    const { rows } = data

    // Group data by x-axis value
    const groupedData = rows.reduce((acc, row) => {
      const xValue = row[xAxis] || "Unknown"
      const yValue = Number.parseFloat(row[yAxis]) || 0

      if (!acc[xValue]) {
        acc[xValue] = 0
      }

      acc[xValue] += yValue
      return acc
    }, {})

    // Convert to arrays for chart
    const labels = Object.keys(groupedData)
    const values = Object.values(groupedData)

    return {
      labels,
      values,
    }
  } catch (error) {
    console.error("Error generating chart data:", error)
    throw new Error("Failed to generate chart data")
  }
}
