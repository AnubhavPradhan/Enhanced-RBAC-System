import React, { useState, useEffect } from 'react'

const Permissions = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingPermission, setEditingPermission] = useState(null)
  
  // Initialize permissions from localStorage or use default data
  const [permissions, setPermissions] = useState(() => {
    const savedPermissions = localStorage.getItem('rbac-permissions')
    return savedPermissions ? JSON.parse(savedPermissions) : [
    {
      id: 1,
      name: 'Create',
      description: 'Create new resources',
      category: 'Content Management',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Read',
      description: 'View existing resources',
      category: 'Content Management',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Update',
      description: 'Modify existing resources',
      category: 'Content Management',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Delete',
      description: 'Remove resources',
      category: 'Content Management',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Manage Users',
      description: 'Add, edit, or remove users',
      category: 'User Management',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Manage Roles',
      description: 'Create and modify roles',
      category: 'User Management',
      status: 'Active'
    },
    {
      id: 7,
      name: 'View Analytics',
      description: 'Access analytics and reports',
      category: 'Analytics',
      status: 'Active'
    },
    {
      id: 8,
      name: 'System Settings',
      description: 'Modify system configuration',
      category: 'System',
      status: 'Inactive'
    },
    ]
  })

  // Save to localStorage whenever permissions change
  useEffect(() => {
    localStorage.setItem('rbac-permissions', JSON.stringify(permissions))
  }, [permissions])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Content Management',
    status: 'Active'
  })

  const categories = ['Content Management', 'User Management', 'Analytics', 'System']

  const handleSubmitPermission = (e) => {
    e.preventDefault()
    if (editingPermission) {
      // Update existing permission
      setPermissions(permissions.map(permission => 
        permission.id === editingPermission.id ? { ...permission, ...formData } : permission
      ))
    } else {
      // Add new permission
      const newPermission = {
        id: permissions.length > 0 ? Math.max(...permissions.map(p => p.id)) + 1 : 1,
        ...formData
      }
      setPermissions([...permissions, newPermission])
    }
    setFormData({ name: '', description: '', category: 'Content Management', status: 'Active' })
    setEditingPermission(null)
    setShowModal(false)
  }

  const handleEditPermission = (permission) => {
    setEditingPermission(permission)
    setFormData({
      name: permission.name,
      description: permission.description,
      category: permission.category,
      status: permission.status
    })
    setShowModal(true)
  }

  const handleAddNew = () => {
    setEditingPermission(null)
    setFormData({ name: '', description: '', category: 'Content Management', status: 'Active' })
    setShowModal(true)
  }

  const handleDeletePermission = (id) => {
    setPermissions(permissions.filter(permission => permission.id !== id))
  }

  const toggleStatus = (id) => {
    setPermissions(permissions.map(permission => 
      permission.id === id 
        ? { ...permission, status: permission.status === 'Active' ? 'Inactive' : 'Active' }
        : permission
    ))
  }

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {})

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Permissions Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Permission
        </button>
      </div>

      {/* Permissions by Category */}
      <div className="space-y-6">
        {Object.entries(groupedPermissions).map(([category, perms]) => (
          <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">{category}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {perms.map((permission) => (
                <div key={permission.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{permission.name}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          permission.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {permission.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{permission.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleStatus(permission.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          permission.status === 'Active'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {permission.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleEditPermission(permission)}
                        className="text-blue-600 hover:text-blue-800 px-3"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeletePermission(permission.id)}
                        className="text-red-600 hover:text-red-800 px-3"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Permission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingPermission ? 'Edit Permission' : 'Add New Permission'}
            </h2>
            <form onSubmit={handleSubmitPermission}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Permission Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingPermission(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPermission ? 'Update Permission' : 'Add Permission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Permissions
