'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { User } from '@/types'

// Pet type from API response
interface ApiPet {
  _id: string
  owner: string | { _id: string, username: string }
  name: string
  type: string
}

// Pet image mapping based on type/breed
const getPetImage = (type: string): string => {
  const petType = type.toLowerCase()
  
  // Dog breeds
  if (petType.includes('labrador') || petType.includes('lab')) {
    return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('bulldog')) {
    return 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('husky')) {
    return 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('golden retriever') || petType.includes('retriever')) {
    return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('german shepherd') || petType.includes('shepherd')) {
    return 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('poodle')) {
    return 'https://images.unsplash.com/photo-1616190264687-b7ebf7aa6469?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('beagle')) {
    return 'https://images.unsplash.com/photo-1505628346881-b72b27e84993?w=150&h=150&fit=crop&crop=faces'
  }
  
  // Cat breeds
  if (petType.includes('persian') || petType.includes('cat')) {
    return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('siamese')) {
    return 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('maine coon')) {
    return 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=150&fit=crop&crop=faces'
  }
  
  // Other animals
  if (petType.includes('bird') || petType.includes('canary') || petType.includes('parrot')) {
    return 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('fish') || petType.includes('goldfish')) {
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('rabbit') || petType.includes('bunny')) {
    return 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=150&h=150&fit=crop&crop=faces'
  }
  if (petType.includes('hamster')) {
    return 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=150&h=150&fit=crop&crop=faces'
  }
  
  // Default dog image for unknown types or general "dog"
  return 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=150&h=150&fit=crop&crop=faces'
}

export default function PetsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [serverMessage, setServerMessage] = useState('')
  const [allPets, setAllPets] = useState<ApiPet[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const [ctfOwnerId, setCtfOwnerId] = useState('')
  const [ctfPetName, setCtfPetName] = useState('')
  const [ctfPetType, setCtfPetType] = useState<string>('dog')
  const [showCtfCreate, setShowCtfCreate] = useState(false)
  const [persistentMessage, setPersistentMessage] = useState('')
  const [showGetAllModal, setShowGetAllModal] = useState(false)
  const [getAllUserId, setGetAllUserId] = useState('')
  const [getAllLoading, setGetAllLoading] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsMessage, setStatsMessage] = useState('')
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null)
  const [createLoading, setCreateLoading] = useState(false)

  // Load users data (keeping this for form functionality)
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
      }
    ]
    setUsers(mockUsers)
  }, [])

  // Fetch all pets from backend on component mount
  useEffect(() => {
    const fetchAllPets = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('https://prelim-exam.onrender.com/pets/')
        const json = await res.json()
        
        if (json?.pets) {
          setAllPets(json.pets)
        }
        
        if (json?.message) {
          setPersistentMessage(json.message)
          try { sessionStorage.setItem('petsPersistentMessage', json.message) } catch {}
        }
      } catch (error) {
        setPersistentMessage('Failed to fetch pets from server. Please try again.')
        setAllPets([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllPets()
  }, [])

  // Helper: fetch pets for a specific userId
  const fetchPetsByUserId = async (userId: string) => {
    const id = userId.trim()
    if (!id) return
    try {
      // Use user-scoped endpoint to fetch ONLY this user's pets
      const res = await fetch(`https://prelim-exam.onrender.com/users/${id}/pets`)
      const json = await res.json()
      if (json?.pets) setAllPets(json.pets)
      const message = typeof json === 'string' ? json : json?.message
      if (message) {
        setPersistentMessage(message)
        try { sessionStorage.setItem('petsPersistentMessage', message) } catch {}
      }
    } catch {
      setPersistentMessage('Failed to fetch pets for this user. Please try again.')
    }
  }

  // Load persistent message on mount
  useEffect(() => {
    try {
      const msg = sessionStorage.getItem('petsPersistentMessage')
      if (msg) setPersistentMessage(msg)
    } catch {}
  }, [])

  // Filter pets based on search term
  const filteredPets = allPets.filter(pet => {
    const searchLower = searchTerm.toLowerCase()
    const ownerName = typeof pet.owner === 'string' 
      ? pet.owner 
      : pet.owner?.username || pet.owner?._id || ''
    
    return (
      pet.name.toLowerCase().includes(searchLower) ||
      pet.type.toLowerCase().includes(searchLower) ||
      ownerName.toLowerCase().includes(searchLower) ||
      pet._id.toLowerCase().includes(searchLower)
    )
  })

  // Reset to first page when list or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, allPets])

  const totalPages = Math.max(1, Math.ceil(filteredPets.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedPets = filteredPets.slice(startIndex, startIndex + pageSize)

  // Build a compact pagination range like: < 1, 2, 3 ... 56 >
  const getPaginationRange = (current: number, total: number) => {
    const delta = 1 // number of neighbors on each side
    const range: (number | string)[] = []
    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)

    range.push(1)
    if (left > 2) range.push('...')
    for (let i = left; i <= right; i++) range.push(i)
    if (right < total - 1) range.push('...')
    if (total > 1) range.push(total)
    return range
  }

  const handleGetStats = async () => {
    setStatsLoading(true)
    setStatsMessage('')
    try {
      const res = await fetch('https://prelim-exam.onrender.com/stats/pets/count')
      const json = await res.json()
      const message = json?.message || 'Stats retrieved successfully'
      
      setStatsMessage(message)
      setPersistentMessage(message)
      try { sessionStorage.setItem('petsPersistentMessage', message) } catch {}
      
    } catch {
      setStatsMessage('Failed to fetch stats. Please try again.')
    } finally {
      setStatsLoading(false)
    }
  }

  const handleGetAllPets = async () => {
    if (!getAllUserId.trim()) return
    
    setGetAllLoading(true)
    try {
      const res = await fetch(`https://prelim-exam.onrender.com/pets/?userId=${getAllUserId.trim()}`)
      const json = await res.json()
      const message = typeof json === 'string' ? json : json?.message
      
      if (message) {
        setPersistentMessage(message)
        try { sessionStorage.setItem('petsPersistentMessage', message) } catch {}
      }
      
      // If there are pets in the response, show them
      if (json?.pets) {
        setAllPets(json.pets)
      }
      
      setShowGetAllModal(false)
      setGetAllUserId('')
    } catch {
      setPersistentMessage('Failed to fetch all pets. Please try again.')
    } finally {
      setGetAllLoading(false)
    }
  }

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) return
    
    setDeletingPetId(petId)
    try {
      const res = await fetch(`https://prelim-exam.onrender.com/pets/${petId}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      const message = typeof json === 'string' ? json : json?.message || 'Pet deleted successfully'
      
      // Update persistent message with delete response
      setPersistentMessage(message)
      try { sessionStorage.setItem('petsPersistentMessage', message) } catch {}
      
      // Remove the deleted pet from the current pets list
      setAllPets(allPets.filter(pet => pet._id !== petId))
      
    } catch {
      setPersistentMessage('Failed to delete pet. Please try again.')
      try { sessionStorage.setItem('petsPersistentMessage', 'Failed to delete pet. Please try again.') } catch {}
    } finally {
      setDeletingPetId(null)
    }
  }

  const handleCreatePet = async () => {
    if (!ctfOwnerId.trim() || !ctfPetName.trim()) return
    
    setCreateLoading(true)
    setServerMessage('')
    try {
      const res = await fetch('https://prelim-exam.onrender.com/pets/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ownerId: ctfOwnerId.trim(), 
          name: ctfPetName.trim(), 
          type: ctfPetType 
        })
      })
      const json = await res.json()
      const message = typeof json === 'string' ? json : json?.message
      const petId = json?.petId
      
      let composed = message || 'Pet created.'
      if (petId) composed += `\nPet ID: ${petId}`
      
      setPersistentMessage(composed)
      try { sessionStorage.setItem('petsPersistentMessage', composed) } catch {}
      
      // Refresh the pets list
      const refreshRes = await fetch('https://prelim-exam.onrender.com/pets/')
      const refreshJson = await refreshRes.json()
      if (refreshJson?.pets) {
        setAllPets(refreshJson.pets)
      }
      
      setShowCtfCreate(false)
      setServerMessage('')
      setCtfOwnerId('')
      setCtfPetName('')
      setCtfPetType('dog')
    } catch {
      setServerMessage('Failed to create pet. Please try again.')
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <DashboardLayout title="Pets Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="heading-2">Pets Management</h1>
            <p className="text-gray-400 mt-2">Manage pet profiles and health records</p>
          </div>
          <button
            onClick={() => setShowCtfCreate(true)}
            className="btn-primary mt-4 sm:mt-0"
          >
            Add New Pet
          </button>
        </div>

        {persistentMessage && (
          <div className="rounded-md border border-purple-700/40 bg-purple-900/20 p-3 text-purple-200 text-sm whitespace-pre-wrap break-words">
            {persistentMessage}
          </div>
        )}

        {/* Search and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search pets by name, type, owner, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const term = searchTerm.trim()
                    if (/^[a-fA-F0-9]{24}$/.test(term)) {
                      fetchPetsByUserId(term)
                    }
                  }
                }}
                className="input-field input-with-left-icon pr-4 w-full"
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
              onClick={() => setShowGetAllModal(true)}
              className="btn-secondary whitespace-nowrap"
            >
              Filter by User
            </button>
            <button
              onClick={() => setShowStatsModal(true)}
              className="btn-secondary whitespace-nowrap"
            >
              Stats
            </button>
          </div>
          <div className="text-xs text-gray-400">
            {allPets.length} pets total • {filteredPets.length} shown
          </div>
        </div>

        {/* Stats Modal */}
        {showStatsModal && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md rounded-2xl p-6 bg-gray-900 border border-gray-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-3">Pet Statistics</h3>
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => {
                    setShowStatsModal(false)
                    setStatsMessage('')
                  }}
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
              
              <div className="mt-4 flex gap-2">
                <button
                  className="btn-primary flex-1"
                  disabled={statsLoading}
                  onClick={handleGetStats}
                >
                  {statsLoading ? 'Loading...' : 'Get Stats'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowStatsModal(false)
                    setStatsMessage('')
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Get All Pets Modal */}
        {showGetAllModal && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md rounded-2xl p-6 bg-gray-900 border border-gray-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-3">Filter Pets by User</h3>
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => {
                    setShowGetAllModal(false)
                    setGetAllUserId('')
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="getAllUserId" className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                  <input 
                    id="getAllUserId" 
                    className="input-field" 
                    value={getAllUserId} 
                    onChange={(e) => setGetAllUserId(e.target.value)} 
                    placeholder="68bae84a350915f39792f1f2" 
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="btn-primary"
                  disabled={getAllLoading || !getAllUserId.trim()}
                  onClick={handleGetAllPets}
                >
                  {getAllLoading ? 'Loading...' : 'Filter Pets'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowGetAllModal(false)
                    setGetAllUserId('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTF Create Pet Modal */}
        {showCtfCreate && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md rounded-2xl p-6 bg-gray-900 border border-gray-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-3">Create New Pet</h3>
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => {
                    setShowCtfCreate(false)
                    setServerMessage('')
                    setCtfOwnerId('')
                    setCtfPetName('')
                    setCtfPetType('dog')
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              {serverMessage && (
                <div className="mb-4 rounded-md border border-red-700/40 bg-red-900/20 p-3 text-red-200 text-sm whitespace-pre-wrap break-words">
                  {serverMessage}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label htmlFor="ctfOwnerId" className="block text-sm font-medium text-gray-300 mb-2">Owner ID</label>
                  <input 
                    id="ctfOwnerId" 
                    className="input-field" 
                    value={ctfOwnerId} 
                    onChange={(e) => setCtfOwnerId(e.target.value)} 
                    placeholder="68b..." 
                  />
                </div>
                <div>
                  <label htmlFor="ctfPetName" className="block text-sm font-medium text-gray-300 mb-2">Pet Name</label>
                  <input 
                    id="ctfPetName" 
                    className="input-field" 
                    value={ctfPetName} 
                    onChange={(e) => setCtfPetName(e.target.value)} 
                    placeholder="Luna" 
                  />
                </div>
                <div>
                  <label htmlFor="ctfPetType" className="block text-sm font-medium text-gray-300 mb-2">Type/Breed</label>
                  <input 
                    id="ctfPetType" 
                    className="input-field" 
                    value={ctfPetType} 
                    onChange={(e) => setCtfPetType(e.target.value)} 
                    placeholder="Labrador, Persian Cat, Canary, etc." 
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="btn-primary"
                  disabled={createLoading || !ctfOwnerId.trim() || !ctfPetName.trim()}
                  onClick={handleCreatePet}
                >
                  {createLoading ? 'Creating...' : 'Create Pet'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowCtfCreate(false)
                    setServerMessage('')
                    setCtfOwnerId('')
                    setCtfPetName('')
                    setCtfPetType('dog')
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pets Table */}
        <div className="card">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center space-y-4">
                <svg className="animate-spin h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-400">Loading pets...</p>
              </div>
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center space-y-4">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-400">No pets found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or add a new pet</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pet ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {paginatedPets.map((pet) => (
                    <tr key={pet._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-700"
                            src={getPetImage(pet.type)}
                            alt={`${pet.name} - ${pet.type}`}
                            onError={(e) => {
                              // Fallback to default dog image if image fails to load
                              const target = e.target as HTMLImageElement
                              target.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=150&h=150&fit=crop&crop=faces'
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-white font-mono break-all max-w-[120px]">
                          {pet._id}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-gray-300 break-all max-w-[150px]">
                          {typeof pet.owner === 'string'
                            ? pet.owner
                            : pet.owner?.username || pet.owner?._id || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm font-medium text-white">
                          {pet.name}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-gray-300 capitalize">
                          {pet.type}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeletePet(pet._id)}
                          disabled={deletingPetId === pet._id}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deletingPetId === pet._id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              {filteredPets.length > pageSize && (
                <div className="flex items-center justify-between mt-4 text-sm">
                  <div className="text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn-secondary px-3 py-1"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      aria-label="Previous page"
                    >
                      &lt;
                    </button>
                    {getPaginationRange(currentPage, totalPages).map((item, idx) => {
                      if (typeof item === 'string') {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                        )
                      }
                      const isActive = item === currentPage
                      return (
                        <button
                          key={item}
                          className={`${isActive ? 'btn-primary' : 'btn-secondary'} px-3 py-1`}
                          onClick={() => setCurrentPage(item)}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item}
                        </button>
                      )
                    })}
                    <button
                      className="btn-secondary px-3 py-1"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      aria-label="Next page"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}