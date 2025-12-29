import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/users', name: 'Users', icon: '👥' },
    { path: '/roles', name: 'Roles', icon: '🔐' },
    { path: '/permissions', name: 'Permissions', icon: '🛡️' },
    { path: '/analytics', name: 'Analytics', icon: '📈' },
    { path: '/reports', name: 'Reports', icon: '📋' },
    { path: '/audit-logs', name: 'Audit Logs', icon: '📝' },
    { path: '/settings', name: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen fixed top-0 left-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">RBAC System</h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
