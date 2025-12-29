import React, { useState } from 'react'

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const reportTypes = [
    { 
      id: 1, 
      name: 'User Activity Report', 
      description: 'Detailed user login and activity logs',
      icon: '📊',
      color: 'bg-blue-500'
    },
    { 
      id: 2, 
      name: 'Permission Audit', 
      description: 'Changes to permissions and access rights',
      icon: '🔍',
      color: 'bg-green-500'
    },
    { 
      id: 3, 
      name: 'Role Assignment Report', 
      description: 'Role changes and assignments over time',
      icon: '👥',
      color: 'bg-purple-500'
    },
    { 
      id: 4, 
      name: 'Security Summary', 
      description: 'Security events and access violations',
      icon: '🛡️',
      color: 'bg-red-500'
    },
    { 
      id: 5, 
      name: 'Compliance Report', 
      description: 'Regulatory compliance and access control',
      icon: '📋',
      color: 'bg-orange-500'
    },
    { 
      id: 6, 
      name: 'System Usage', 
      description: 'Overall system usage statistics',
      icon: '📈',
      color: 'bg-indigo-500'
    },
  ]

  const recentReports = [
    { name: 'User Activity Report', date: '2025-12-28', status: 'Completed', size: '2.4 MB' },
    { name: 'Security Summary', date: '2025-12-27', status: 'Completed', size: '1.8 MB' },
    { name: 'Permission Audit', date: '2025-12-26', status: 'Completed', size: '3.1 MB' },
    { name: 'Role Assignment Report', date: '2025-12-25', status: 'Completed', size: '1.2 MB' },
  ]

  const handleGenerateReport = (reportType) => {
    setSelectedReport(reportType)
    alert(`Generating ${reportType.name}...`)
  }

  const handleExport = (format) => {
    alert(`Exporting report as ${format}...`)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Reports</h1>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Report Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${report.color} text-white p-3 rounded-lg text-2xl`}>
                  {report.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{report.description}</p>
              <button
                onClick={() => handleGenerateReport(report)}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Generate Report
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Reports</h2>
          <div className="space-x-2">
            <button
              onClick={() => handleExport('PDF')}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport('Excel')}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Export Excel
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Report Name</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Generated Date</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Size</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{report.name}</td>
                  <td className="py-3 px-4 text-gray-600">{report.date}</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-sm">
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{report.size}</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-500 hover:text-blue-700 mr-3">Download</button>
                    <button className="text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports
