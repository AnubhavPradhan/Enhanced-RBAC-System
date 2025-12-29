import React, { useState, useEffect } from 'react'

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '0', icon: '👥', color: 'bg-blue-500' },
    { label: 'Active Roles', value: '0', icon: '🔐', color: 'bg-green-500' },
    { label: 'Permissions', value: '0', icon: '🛡️', color: 'bg-purple-500' },
    { label: 'Admin Users', value: '0', icon: '⚡', color: 'bg-orange-500' },
  ])

  useEffect(() => {
    // Load data from localStorage
    const users = JSON.parse(localStorage.getItem('rbac-users') || '[]')
    const roles = JSON.parse(localStorage.getItem('rbac-roles') || '[]')
    const permissions = JSON.parse(localStorage.getItem('rbac-permissions') || '[]')

    // Calculate real-time statistics
    const totalUsers = users.length
    const activeRoles = roles.length
    const totalPermissions = permissions.filter(p => p.status === 'Active').length
    const adminUsers = users.filter(u => u.role === 'Admin').length

    setStats([
      { label: 'Total Users', value: totalUsers.toString(), icon: '👥', color: 'bg-blue-500' },
      { label: 'Active Roles', value: activeRoles.toString(), icon: '🔐', color: 'bg-green-500' },
      { label: 'Permissions', value: totalPermissions.toString(), icon: '🛡️', color: 'bg-purple-500' },
      { label: 'Admin Users', value: adminUsers.toString(), icon: '⚡', color: 'bg-orange-500' },
    ])
  }, [])

  const recentActivity = []

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-4 rounded-lg text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{activity.user}</p>
                    <p className="text-gray-500 text-sm">{activity.action}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
