import React, { useState, useEffect } from 'react'

const Roles = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  
  // Initialize roles from localStorage or use default data
  const [roles, setRoles] = useState(() => {
    const savedRoles = localStorage.getItem('rbac-roles')
    return savedRoles ? JSON.parse(savedRoles) : [
      {
        id: 1,
        name: 'Admin',
        description: 'Full system access',
        permissions: ['Create', 'Read', 'Update', 'Delete'],
        users: 8
      },
      {
        id: 2,
        name: 'Editor',
        description: 'Can edit content',
        permissions: ['Create', 'Read', 'Update'],
        users: 24
      },
      {
        id: 3,
        name: 'Viewer',
        description: 'Read-only access',
        permissions: ['Read'],
        users: 156
      },
      {
        id: 4,
        name: 'Moderator',
        description: 'Can moderate content',
        permissions: ['Read', 'Update', 'Delete'],
        users: 12
      },
    ]
  })

  // Save to localStorage whenever roles change
  useEffect(() => {
    localStorage.setItem('rbac-roles', JSON.stringify(roles))
  }, [roles])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  })

  const availablePermissions = ['Create', 'Read', 'Update', 'Delete', 'Manage Users', 'Manage Roles']

  const handlePermissionToggle = (permission) => {
    if (formData.permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permission)
      })
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission]
      })
    }
  }

  const addAuditLog = (action, resource, details, severity = 'Info') => {
    const logs = JSON.parse(localStorage.getItem('rbac-audit-logs') || '[]')
    const newLog = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      timestamp: new Date().toLocaleString('en-US', { hour12: false }),
      user: 'admin@example.com',
      action,
      resource,
      details,
      severity
    }
    logs.unshift(newLog)
    localStorage.setItem('rbac-audit-logs', JSON.stringify(logs))
  }

  const handleSubmitRole = (e) => {
    e.preventDefault()
    if (editingRole) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === editingRole.id ? { ...role, ...formData } : role
      ))
      addAuditLog('Update', 'Role', `Modified role: ${formData.name}`, 'Warning')
    } else {
      // Add new role
      const newRole = {
        id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
        ...formData,
        users: 0
      }
      setRoles([...roles, newRole])
      addAuditLog('Create', 'Role', `Created new role: ${formData.name}`, 'Info')
    }
    setFormData({ name: '', description: '', permissions: [] })
    setEditingRole(null)
    setShowModal(false)
  }

  const handleEditRole = (role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    })
    setShowModal(true)
  }

  const handleAddNew = () => {
    setEditingRole(null)
    setFormData({ name: '', description: '', permissions: [] })
    setShowModal(true)
  }

  const handleDeleteRole = (id) => {
    const role = roles.find(r => r.id === id)
    setRoles(roles.filter(role => role.id !== id))
    if (role) {
      addAuditLog('Delete', 'Role', `Deleted role: ${role.name}`, 'Warning')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Roles Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{role.name}</h3>
                <p className="text-gray-500 text-sm">{role.description}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditRole(role)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Permissions:</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{role.users}</span> users assigned
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingRole ? 'Edit Role' : 'Add New Role'}
            </h2>
            <form onSubmit={handleSubmitRole}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Role Name</label>
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
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Permissions</label>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingRole(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingRole ? 'Update Role' : 'Add Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Roles
