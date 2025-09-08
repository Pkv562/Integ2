'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import UserTable from '@/components/Users/UserTable'
import UserForm from '@/components/Users/UserForm'
import { User, CreateUserData, UpdateUserData } from '@/types'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loginMessage, setLoginMessage] = useState('')
  const [serverMessage, setServerMessage] = useState('')
  const [apiUser, setApiUser] = useState<null | {
    _id: string
    username: string
    age: number
    code: string
    role: string
  }>(null)
  const [apiUsernameEdit, setApiUsernameEdit] = useState('')
  const [currentUser, setCurrentUser] = useState<{
    id: string
    username: string
    code: string
    signupTime: string
  } | null>(null)
  const [userInfo, setUserInfo] = useState<{
    _id: string
    username: string
    age: number
    code: string
    role: string
  } | null>(null)
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false)
  const [roleUpdateMessage, setRoleUpdateMessage] = useState('')
  const [manualUserId, setManualUserId] = useState('')
  const [isEditingRole, setIsEditingRole] = useState(false)
  
  // Stats modal states
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [statsMessage, setStatsMessage] = useState('')
  
  // Add Info modal states
  const [isAddInfoModalOpen, setIsAddInfoModalOpen] = useState(false)
  const [addInfoUserId, setAddInfoUserId] = useState('')

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-16T14:20:00Z',
        updatedAt: '2024-01-16T14:20:00Z'
      },
      {
        id: '3',
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob@example.com',
        role: 'moderator',
        status: 'inactive',
        createdAt: '2024-01-17T09:15:00Z',
        updatedAt: '2024-01-17T09:15:00Z'
      },
      {
        id: '4',
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@example.com',
        role: 'user',
        status: 'suspended',
        createdAt: '2024-01-18T16:45:00Z',
        updatedAt: '2024-01-18T16:45:00Z'
      }
    ]
    setUsers(mockUsers)
  }, [])

  useEffect(() => {
    try {
      const msg = sessionStorage.getItem('loginResultMessage')
      if (msg) {
        setLoginMessage(msg)
        sessionStorage.removeItem('loginResultMessage')
      }
    } catch {}
  }, [])

  // Load current user data from localStorage and fetch user info
  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData')
      console.log('User data from localStorage:', userData) // Debug log
      if (userData) {
        const parsed = JSON.parse(userData)
        console.log('Parsed user data:', parsed) // Debug log
        setCurrentUser(parsed)
        // Fetch user info using the saved ID from signup
        if (parsed.id) {
          console.log('Fetching user info for ID:', parsed.id) // Debug log
          fetchUserInfo(parsed.id)
        }
      } else {
        console.log('No user data found in localStorage') // Debug log
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }, [])

  const fetchUserInfo = async (userId: string) => {
    setIsLoadingUserInfo(true)
    try {
      console.log('Making API call to:', `https://prelim-exam.onrender.com/users/${userId}`) // Debug log
      const res = await fetch(`https://prelim-exam.onrender.com/users/${userId}`)
      const json = await res.json()
      console.log('API response:', json) // Debug log
      const user = json?.user
      if (user && user._id) {
        console.log('Setting user info:', user) // Debug log
        setUserInfo({
          _id: user._id,
          username: user.username,
          age: user.age,
          code: user.code,
          role: user.role
        })
      } else {
        console.log('No user found in API response') // Debug log
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    } finally {
      setIsLoadingUserInfo(false)
    }
  }

  const handleManualIdSubmit = async () => {
    if (!manualUserId.trim()) return
    
    setIsLoadingUserInfo(true)
    try {
      console.log('Fetching user info for manual ID:', manualUserId)
      await fetchUserInfo(manualUserId.trim())
    } catch (error) {
      console.error('Failed to fetch user info for manual ID:', error)
    } finally {
      setIsLoadingUserInfo(false)
    }
  }

  // When searching by a 24-char hex ID, fetch user from external API and show details panel
  useEffect(() => {
    const term = searchTerm.trim()
    const isMongoId = /^[a-fA-F0-9]{24}$/.test(term)
    if (!isMongoId) {
      setApiUser(null)
      setApiUsernameEdit('')
      return
    }
    let aborted = false
    ;(async () => {
      try {
        const res = await fetch(`https://prelim-exam.onrender.com/users/${term}`)
        const json = await res.json()
        const user = json?.user
        if (!aborted && user && user._id) {
          setApiUser({
            _id: user._id,
            username: user.username,
            age: user.age,
            code: user.code,
            role: user.role
          })
          setApiUsernameEdit('')
        } else if (!aborted) {
          setApiUser(null)
        }
      } catch {
        if (!aborted) setApiUser(null)
      }
    })()
    return () => { aborted = true }
  }, [searchTerm])

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true
    // Allow searching by ID for this step
    return (
      user.id.toLowerCase().includes(term) ||
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    )
  })

  const handleCreateUser = async (data: CreateUserData) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        ...data,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setUsers([...users, newUser])
      setIsFormOpen(false)
      setIsLoading(false)
    }, 1000)
  }

  const handleUpdateUser = async (data: UpdateUserData) => {
    if (!editingUser) return
    
    setIsLoading(true)
    try {
      // If only username is present, call the external endpoint
      if (data.username && Object.keys(data).length === 1) {
        const res = await fetch(`https://prelim-exam.onrender.com/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: data.username })
        })
        const result = await res.json()
        const message = typeof result === 'string' ? result : result.message
        if (message) setServerMessage(message)
      }

      // Update local state
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, ...data, updatedAt: new Date().toISOString() }
          : user
      ))
      setEditingUser(undefined)
      setIsFormOpen(false)
    } catch (e) {
      setServerMessage('Failed to update user. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDeleteUserFromList = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      // Simulate API call
      setTimeout(() => {
        setUsers(users.filter(user => user.id !== userId))
      }, 500)
    }
  }

  const handleStatusChange = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    // Simulate API call
    setTimeout(() => {
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, status, updatedAt: new Date().toISOString() }
          : user
      ))
    }, 500)
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingUser(undefined)
  }

  const handleFormSubmit = (data: CreateUserData | UpdateUserData) => {
    if (editingUser) {
      handleUpdateUser(data as UpdateUserData)
    } else {
      handleCreateUser(data as CreateUserData)
    }
  }

  const handleRoleUpdate = async (newRole: string) => {
    if (!userInfo) return
    
    // Use the user's ID from the fetched user info
    const userId = userInfo._id
    
    setIsLoadingUserInfo(true)
    setRoleUpdateMessage('')
    
    try {
      const res = await fetch(`https://prelim-exam.onrender.com/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      const json = await res.json()
      const message = typeof json === 'string' ? json : json?.message
      if (message) {
        setRoleUpdateMessage(message)
      }
      
      // Update local user info
      setUserInfo({ ...userInfo, role: newRole })
      
      // Exit edit mode after successful update
      setIsEditingRole(false)
    } catch (error) {
      setRoleUpdateMessage('Failed to update role. Please try again.')
    } finally {
      setIsLoadingUserInfo(false)
    }
  }

  const handleDeleteCurrentUser = async () => {
    if (!userInfo) return
    
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoadingUserInfo(true)
      try {
        const res = await fetch(`https://prelim-exam.onrender.com/users/${userInfo._id}`, {
          method: 'DELETE'
        })
        const json = await res.json()
        const message = typeof json === 'string' ? json : json?.message
        if (message) {
          setRoleUpdateMessage(message)
        }
        
        // Clear user data and redirect to login
        localStorage.removeItem('userData')
        window.location.href = '/login'
      } catch (error) {
        setRoleUpdateMessage('Failed to delete account. Please try again.')
      } finally {
        setIsLoadingUserInfo(false)
      }
    }
  }

  // Stats functions
  const fetchStats = async (type: 'ages' | 'count') => {
    setIsLoadingStats(true)
    setStatsMessage('')
    
    try {
      const url = type === 'ages' 
        ? 'https://prelim-exam.onrender.com/stats/users/ages'
        : 'https://prelim-exam.onrender.com/stats/users/count'
      
      const res = await fetch(url)
      const json = await res.json()
      const message = typeof json === 'string' ? json : json?.message
      
      if (message) {
        setStatsMessage(message)
      } else {
        setStatsMessage('No message received from server')
      }
    } catch (error) {
      setStatsMessage('Failed to fetch stats. Please try again.')
    } finally {
      setIsLoadingStats(false)
    }
  }

  const openStatsModal = () => {
    setIsStatsModalOpen(true)
    setStatsMessage('')
  }

  const closeStatsModal = () => {
    setIsStatsModalOpen(false)
    setStatsMessage('')
  }

  // Add Info modal functions
  const openAddInfoModal = () => {
    setIsAddInfoModalOpen(true)
    setAddInfoUserId('')
  }

  const closeAddInfoModal = () => {
    setIsAddInfoModalOpen(false)
    setAddInfoUserId('')
  }

  const handleAddInfoSubmit = async () => {
    if (!addInfoUserId.trim()) return
    
    setIsLoadingUserInfo(true)
    try {
      console.log('Fetching user info for add info ID:', addInfoUserId)
      const userId = addInfoUserId.trim()
      
      // Make the API call directly
      const res = await fetch(`https://prelim-exam.onrender.com/users/${userId}`)
      const json = await res.json()
      console.log('API response:', json)
      const user = json?.user
      
      if (user && user._id) {
        console.log('Setting user info:', user)
        setUserInfo({
          _id: user._id,
          username: user.username,
          age: user.age,
          code: user.code,
          role: user.role
        })
        
        // Also set currentUser so the display logic works
        const userData = {
          id: user._id,
          username: user.username,
          code: user.code,
          signupTime: new Date().toISOString()
        }
        setCurrentUser(userData)
        
        // Save to localStorage so it persists across page navigation
        try {
          localStorage.setItem('userData', JSON.stringify(userData))
          console.log('User data saved to localStorage:', userData)
        } catch (error) {
          console.error('Failed to save user data to localStorage:', error)
        }
      }
      
      closeAddInfoModal()
    } catch (error) {
      console.error('Failed to fetch user info for add info ID:', error)
    } finally {
      setIsLoadingUserInfo(false)
    }
  }

  return (
    <DashboardLayout title="Users Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="heading-2">Users Management</h1>
            <p className="text-gray-400 mt-2">Manage user accounts and permissions</p>
          </div>
        </div>

        {loginMessage && (
          <div className="rounded-md border border-purple-700/40 bg-purple-900/20 p-3 text-purple-200 text-sm whitespace-pre-wrap break-words">
            {loginMessage}
          </div>
        )}

        {serverMessage && (
          <div className="rounded-md border border-green-700/40 bg-green-900/20 p-3 text-green-200 text-sm whitespace-pre-wrap break-words">
            {serverMessage}
          </div>
        )}

        {roleUpdateMessage && (
          <div className="rounded-md border border-blue-700/40 bg-blue-900/20 p-3 text-blue-200 text-sm whitespace-pre-wrap break-words">
            {roleUpdateMessage}
          </div>
        )}

        {/* Current User Info Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="heading-3">Your Account Information</h3>
            {userInfo && !isEditingRole && (
              <button
                onClick={() => setIsEditingRole(true)}
                className="btn-secondary flex items-center gap-2 text-sm px-3 py-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>
          {!currentUser ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                No account information loaded. Add your User ID to view your account details.
              </div>
              <button
                onClick={openAddInfoModal}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Info
              </button>
            </div>
          ) : isLoadingUserInfo ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-2 text-gray-400">Loading user information...</span>
            </div>
          ) : userInfo ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">User ID</div>
                  <div className="text-white break-all">{userInfo._id}</div>
                </div>
                <div>
                  <div className="text-gray-400">Username</div>
                  <div className="text-white">{userInfo.username}</div>
                </div>
                <div>
                  <div className="text-gray-400">Age</div>
                  <div className="text-white">{userInfo.age}</div>
                </div>
                <div>
                  <div className="text-gray-400">Code</div>
                  <div className="text-white">{userInfo.code}</div>
                </div>
                <div>
                  <div className="text-gray-400">Current Role</div>
                  <div className="text-white capitalize">{userInfo.role}</div>
                </div>
                <div>
                  <div className="text-gray-400">Account Created</div>
                  <div className="text-white">{currentUser?.signupTime ? new Date(currentUser.signupTime).toLocaleString() : 'N/A'}</div>
                </div>
              </div>

              {/* Role Editing Section */}
              {isEditingRole && (
                <div className="border-t border-gray-700 pt-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="roleSelect" className="block text-sm font-medium text-gray-300 mb-2">
                        Select New Role
                      </label>
                      <select
                        id="roleSelect"
                        className="input-field bg-gray-800 text-white border-gray-600 focus:border-purple-500"
                        defaultValue={userInfo.role}
                        onChange={(e) => {
                          if (e.target.value !== userInfo.role) {
                            handleRoleUpdate(e.target.value)
                          }
                        }}
                        disabled={isLoadingUserInfo}
                      >
                        <option value="vet" className="bg-gray-800 text-white">Vet</option>
                        <option value="admin" className="bg-gray-800 text-white">Admin</option>
                        <option value="faculty" className="bg-gray-800 text-white">Faculty</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditingRole(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Manual ID Entry Section */}
              <div className="bg-blue-900/20 border border-blue-700/40 rounded-md p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Enter Your User ID</h4>
                <p className="text-gray-300 text-sm mb-4">
                  If you already have an account and know your User ID, enter it below to view your information.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualUserId}
                    onChange={(e) => setManualUserId(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Enter your 24-character User ID"
                    maxLength={24}
                  />
                  <button
                    onClick={handleManualIdSubmit}
                    disabled={!manualUserId.trim() || isLoadingUserInfo}
                    className="btn-primary"
                  >
                    {isLoadingUserInfo ? 'Loading...' : 'Load Info'}
                  </button>
                </div>
                {currentUser && (
                  <div className="mt-3 text-xs text-gray-400">
                    Your saved ID: {currentUser.id}
                  </div>
                )}
              </div>

              {/* Retry Section */}
              <div className="text-center py-4">
                <div className="text-red-400 mb-2">❌ Failed to load user information</div>
                <div className="text-gray-400 text-sm mb-4">
                  Could not fetch your account details from the server.
                </div>
                <div className="text-gray-500 text-xs mb-4">
                  Debug info: Saved user ID: {currentUser?.id || 'None'}
                </div>
                <button 
                  onClick={() => currentUser?.id && fetchUserInfo(currentUser.id)}
                  className="btn-primary"
                >
                  Retry with Saved ID
                </button>
              </div>
            </div>
          )}
        </div>

        {apiUser && (
          <div className="card">
            <h3 className="heading-3 mb-4">User Details (from API)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">ID</div>
                <div className="text-white break-all">{apiUser._id}</div>
              </div>
              <div>
                <div className="text-gray-400">Role</div>
                <div className="text-white">{apiUser.role}</div>
              </div>
              <div>
                <div className="text-gray-400">Username</div>
                <div className="text-white">{apiUser.username}</div>
              </div>
              <div>
                <div className="text-gray-400">Age</div>
                <div className="text-white">{apiUser.age}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-gray-400">Code</div>
                <div className="text-white">{apiUser.code}</div>
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="apiUsernameEdit" className="block text-sm font-medium text-gray-300 mb-2">
                Edit Username (CTF step)
              </label>
              <div className="flex gap-2">
                <input
                  id="apiUsernameEdit"
                  name="apiUsernameEdit"
                  type="text"
                  value={apiUsernameEdit}
                  onChange={(e) => setApiUsernameEdit(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Enter new username"
                />
                <button
                  className="btn-primary"
                  disabled={!apiUsernameEdit.trim() || isLoading}
                  onClick={async () => {
                    if (!apiUser || !apiUsernameEdit.trim()) return
                    setIsLoading(true)
                    setServerMessage('')
                    try {
                      const res = await fetch(`https://prelim-exam.onrender.com/users/${apiUser._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: apiUsernameEdit.trim() })
                      })
                      const json = await res.json()
                      const message = typeof json === 'string' ? json : json?.message
                      if (message) setServerMessage(message)
                      // Reflect updated username locally
                      setApiUser({ ...apiUser, username: apiUsernameEdit.trim() })
                      setApiUsernameEdit('')
                    } catch {
                      setServerMessage('Failed to update username. Please try again.')
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar with Stats Button */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field input-with-left-icon pr-4"
            />
            <svg
              className="pointer-events-none absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={openStatsModal}
            className="btn-secondary h-[48px] px-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Stats
          </button>
        </div>

        {/* Users Table (hidden when viewing API user by ID) */}
        {!apiUser && (
          <UserTable
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUserFromList}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* User Form Modal */}
        {isFormOpen && (
          <UserForm
            user={editingUser}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading}
          />
        )}

        {/* Stats Modal */}
        {isStatsModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md rounded-2xl p-6 bg-gray-900 border border-gray-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-3">User Statistics</h3>
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={closeStatsModal}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              
              {statsMessage && (
                <div className="mb-4 rounded-md border border-purple-700/40 bg-purple-900/20 p-3 text-purple-200 text-sm whitespace-pre-wrap break-words">
                  {statsMessage}
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => fetchStats('ages')}
                  disabled={isLoadingStats}
                  className="btn-primary flex items-center justify-center gap-2 px-6"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {isLoadingStats ? 'Loading...' : 'Age Stats'}
                </button>
                <button
                  onClick={() => fetchStats('count')}
                  disabled={isLoadingStats}
                  className="btn-primary flex items-center justify-center gap-2 px-6"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  {isLoadingStats ? 'Loading...' : 'Count Stats'}
                </button>
              </div>

              {isLoadingStats && (
                <div className="flex items-center justify-center py-4 mt-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  <span className="ml-2 text-gray-400 text-sm">Fetching statistics...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Info Modal */}
        {isAddInfoModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Add Your User ID</h3>
                <button
                  onClick={closeAddInfoModal}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="addInfoUserId" className="block text-sm font-medium text-gray-300 mb-2">
                    User ID
                  </label>
                  <input
                    id="addInfoUserId"
                    type="text"
                    value={addInfoUserId}
                    onChange={(e) => setAddInfoUserId(e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter your 24-character User ID"
                    maxLength={24}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter the User ID you received when you created your account.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddInfoSubmit}
                    disabled={!addInfoUserId.trim() || isLoadingUserInfo}
                    className="btn-primary flex-1"
                  >
                    {isLoadingUserInfo ? 'Loading...' : 'Load Info'}
                  </button>
                  <button
                    onClick={closeAddInfoModal}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}