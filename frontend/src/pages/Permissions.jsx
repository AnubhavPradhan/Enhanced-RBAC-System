import React, { useState, useEffect, useMemo } from 'react'

const Permissions = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingPermission, setEditingPermission] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState(null)
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  // Initialize permissions from localStorage or use default data
  const [permissions, setPermissions] = useState(() => {
    const savedPermissions = localStorage.getItem('rbac-permissions')
    return savedPermissions ? JSON.parse(savedPermissions) : [
    {
      id: 1,
      name: 'Create',
      description: 'Create new resources',
      category: 'Content Management',
      status: 'Active',
      usedBy: ['Admin', 'Editor']
    },
    {
      id: 2,
      name: 'Read',
      description: 'View existing resources',
      category: 'Content Management',
      status: 'Active',
      usedBy: ['Admin', 'Editor', 'Viewer']
    },
    {
      id: 3,
      name: 'Update',
      description: 'Modify existing resources',
      category: 'Content Management',
      status: 'Active',
      usedBy: ['Admin', 'Editor']
    },
    {
      id: 4,
      name: 'Delete',
      description: 'Remove resources',
      category: 'Content Management',
      status: 'Active',
      usedBy: ['Admin']
    },
    {
      id: 5,
      name: 'Manage Users',
      description: 'Add, edit, or remove users',
      category: 'User Management',
      status: 'Active',
      usedBy: ['Admin']
    },
    {
      id: 6,
      name: 'Manage Roles',
      description: 'Create and modify roles',
      category: 'User Management',
      status: 'Active',
      usedBy: ['Admin']
    },
    {
      id: 7,
      name: 'View Analytics',
      description: 'Access analytics and reports',
      category: 'Analytics',
      status: 'Active',
      usedBy: ['Admin', 'Manager']
    },
    {
      id: 8,
      name: 'System Settings',
      description: 'Modify system configuration',
      category: 'System',
      status: 'Inactive',
      usedBy: []
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
    status: 'Active',
    usedBy: []
  })

  const categories = ['Content Management', 'User Management', 'Analytics', 'System']

  // Filter and search permissions
  const filteredPermissions = useMemo(() => {
    return permissions.filter(permission => {
      const matchesSearch = permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           permission.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === 'All' || permission.category === filterCategory
      const matchesStatus = filterStatus === 'All' || permission.status === filterStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [permissions, searchQuery, filterCategory, filterStatus])

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

  const handleSubmitPermission = (e) => {
    e.preventDefault()
    if (editingPermission) {
      // Update existing permission
      setPermissions(permissions.map(permission => 
        permission.id === editingPermission.id ? { ...permission, ...formData } : permission
      ))
      addAuditLog('Update', 'Permission', `Modified permission: ${formData.name}`, 'Warning')
    } else {
      // Add new permission
      const newPermission = {
        id: permissions.length > 0 ? Math.max(...permissions.map(p => p.id)) + 1 : 1,
        ...formData
      }
      setPermissions([...permissions, newPermission])
      addAuditLog('Create', 'Permission', `Created new permission: ${formData.name}`, 'Info')
    }
    setFormData({ name: '', description: '', category: 'Content Management', status: 'Active', usedBy: [] })
    setEditingPermission(null)
    setShowModal(false)
  }

  const handleEditPermission = (permission) => {
    setEditingPermission(permission)
    setFormData({
      name: permission.name,
      description: permission.description,
      category: permission.category,
      status: permission.status,
      usedBy: permission.usedBy || []
    })
    setShowModal(true)
  }

  const handleAddNew = () => {
    setEditingPermission(null)
    setFormData({ name: '', description: '', category: 'Content Management', status: 'Active', usedBy: [] })
    setShowModal(true)
  }

  const handleDeletePermission = (id) => {
    const permission = permissions.find(p => p.id === id)
    if (permission) {
      setPermissionToDelete(permission)
      setShowDeleteConfirm(true)
    }
  }

  const confirmDelete = () => {
    if (permissionToDelete) {
      setPermissions(permissions.filter(permission => permission.id !== permissionToDelete.id))
      addAuditLog('Delete', 'Permission', `Removed permission: ${permissionToDelete.name}`, 'Critical')
      setShowDeleteConfirm(false)
      setPermissionToDelete(null)
    }
  }

  const toggleStatus = (id) => {
    const permission = permissions.find(p => p.id === id)
    setPermissions(permissions.map(permission => 
      permission.id === id 
        ? { ...permission, status: permission.status === 'Active' ? 'Inactive' : 'Active' }
        : permission
    ))
    if (permission) {
      addAuditLog(
        'Update', 
        'Permission', 
        `${permission.status === 'Active' ? 'Deactivated' : 'Activated'} permission: ${permission.name}`,
        'Warning'
      )
    }
  }

  // Handle bulk selection
  const toggleSelectPermission = (id) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedPermissions.length === filteredPermissions.length) {
      setSelectedPermissions([])
    } else {
      setSelectedPermissions(filteredPermissions.map(p => p.id))
    }
  }

  // Bulk actions
  const handleBulkActivate = () => {
    setPermissions(permissions.map(permission =>
      selectedPermissions.includes(permission.id) ? { ...permission, status: 'Active' } : permission
    ))
    addAuditLog('Bulk Update', 'Permission', `Activated ${selectedPermissions.length} permissions`, 'Warning')
    setSelectedPermissions([])
    setShowBulkActions(false)
  }

  const handleBulkDeactivate = () => {
    setPermissions(permissions.map(permission =>
      selectedPermissions.includes(permission.id) ? { ...permission, status: 'Inactive' } : permission
    ))
    addAuditLog('Bulk Update', 'Permission', `Deactivated ${selectedPermissions.length} permissions`, 'Warning')
    setSelectedPermissions([])
    setShowBulkActions(false)
  }

  const handleBulkDelete = () => {
    const permissionsToDelete = permissions.filter(p => selectedPermissions.includes(p.id))
    setPermissions(permissions.filter(permission => !selectedPermissions.includes(permission.id)))
    addAuditLog('Bulk Delete', 'Permission', `Deleted ${permissionsToDelete.length} permissions`, 'Critical')
    setSelectedPermissions([])
    setShowBulkActions(false)
  }

  // Get statistics
  const stats = useMemo(() => {
    return {
      total: permissions.length,
      active: permissions.filter(p => p.status === 'Active').length,
      inactive: permissions.filter(p => p.status === 'Inactive').length
    }
  }, [permissions])

  // Group permissions by category
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {})

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Permissions Management</h1>
          <p className="text-gray-600 mt-1">Define and manage access permissions for your application</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          + Add Permission
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Permissions</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Permissions</p>
              <p className="text-3xl font-bold mt-1">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium">Inactive Permissions</p>
              <p className="text-3xl font-bold mt-1">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search permissions by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        {(searchQuery || filterCategory !== 'All' || filterStatus !== 'All') && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {filteredPermissions.length} of {permissions.length} permissions
            </span>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterCategory('All')
                setFilterStatus('All')
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedPermissions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-blue-800 font-semibold">
              {selectedPermissions.length} permission{selectedPermissions.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedPermissions([])}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBulkActivate}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Activate All
            </button>
            <button
              onClick={handleBulkDeactivate}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              Deactivate All
            </button>
            <button
              onClick={() => setShowBulkActions(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Delete All
            </button>
          </div>
        </div>
      )}

      {/* Permissions List */}
      {filteredPermissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No permissions found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filterCategory !== 'All' || filterStatus !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first permission'
            }
          </p>
          {(!searchQuery && filterCategory === 'All' && filterStatus === 'All') && (
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Permission
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Select All Checkbox */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPermissions.length === filteredPermissions.length && filteredPermissions.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">
                Select all {filteredPermissions.length} permission{filteredPermissions.length > 1 ? 's' : ''}
              </span>
            </label>
          </div>

          {/* Permissions by Category */}
          <div className="space-y-6">{Object.entries(groupedPermissions).map(([category, perms]) => (
          <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  {category}
                </h2>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-600">
                  {perms.length} {perms.length === 1 ? 'permission' : 'permissions'}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {perms.map((permission) => (
                <div key={permission.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => toggleSelectPermission(permission.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{permission.name}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          permission.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {permission.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{permission.description}</p>
                      
                      {/* Used By Section */}
                      {permission.usedBy && permission.usedBy.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-500 font-medium">Used by:</span>
                          <div className="flex flex-wrap gap-1">
                            {permission.usedBy.map((role, idx) => (
                              <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleStatus(permission.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          permission.status === 'Active'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={permission.status === 'Active' ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {permission.status === 'Active' ? '⏸️ Deactivate' : '▶️ Activate'}
                      </button>
                      <button 
                        onClick={() => handleEditPermission(permission)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit permission"
                      >
                        <span className="text-xl">✏️</span>
                      </button>
                      <button
                        onClick={() => handleDeletePermission(permission.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete permission"
                      >
                        <span className="text-xl">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}</div>
        </>
      )}

      {/* Add/Edit Permission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="mr-2 text-3xl">{editingPermission ? '✏️' : '➕'}</span>
              {editingPermission ? 'Edit Permission' : 'Add New Permission'}
            </h2>
            
            <form onSubmit={handleSubmitPermission}>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Permission Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Create Posts, Delete Users"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">Give your permission a clear, descriptive name</p>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Explain what this permission allows users to do..."
                  required
                />
                <p className="text-gray-500 text-xs mt-1">Provide a detailed explanation to help others understand this permission</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="text-gray-500 text-xs mt-1">Group similar permissions together</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <p className="text-gray-500 text-xs mt-1">Control permission availability</p>
                </div>
              </div>

              {/* Help Text */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 text-xl">💡</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Tips for creating permissions</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Use clear, action-oriented names (e.g., "Create", "Edit", "Delete")</li>
                      <li>• Group related permissions in the same category</li>
                      <li>• Write descriptions that explain what users can do with this permission</li>
                      <li>• Start with "Inactive" status if you want to test before enabling</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingPermission(null)
                    setFormData({ name: '', description: '', category: 'Content Management', status: 'Active', usedBy: [] })
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  {editingPermission ? 'Update Permission' : 'Create Permission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && permissionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Permission?</h2>
              <p className="text-gray-600">
                Are you sure you want to delete the permission <strong>"{permissionToDelete.name}"</strong>?
              </p>
            </div>

            {permissionToDelete.usedBy && permissionToDelete.usedBy.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-900 mb-2">Warning</h4>
                    <p className="text-xs text-yellow-800 mb-2">
                      This permission is currently used by the following roles:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {permissionToDelete.usedBy.map((role, idx) => (
                        <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                          {role}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-yellow-800 mt-2">
                      Deleting this permission will remove it from all these roles.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>This action cannot be undone.</strong> The permission will be permanently deleted from the system.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setPermissionToDelete(null)
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Delete Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🗑️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Multiple Permissions?</h2>
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{selectedPermissions.length} permissions</strong>?
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>This action cannot be undone.</strong> All selected permissions will be permanently deleted from the system.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowBulkActions(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Permissions
