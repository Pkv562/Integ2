'use client'

import { useState } from 'react'
import { Pet } from '@/types'

interface PetTableProps {
  pets: Pet[]
  onEdit: (pet: Pet) => void
  onDelete: (petId: string) => void
  onStatusChange: (petId: string, status: 'healthy' | 'sick' | 'recovering') => void
}

export default function PetTable({ pets, onEdit, onDelete, onStatusChange }: PetTableProps) {
  const [sortField, setSortField] = useState<keyof Pet>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: keyof Pet) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedPets = [...pets].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    const normalize = (val: unknown): string | number => {
      if (val === undefined || val === null) return Number.NEGATIVE_INFINITY
      if (typeof val === 'number') return val
      if (val instanceof Date) return val.getTime()
      return String(val).toLowerCase()
    }

    const aComp = normalize(aValue)
    const bComp = normalize(bValue)

    if (aComp < bComp) return sortDirection === 'asc' ? -1 : 1
    if (aComp > bComp) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      healthy: 'bg-green-500/20 text-green-400 border-green-500/30',
      sick: 'bg-red-500/20 text-red-400 border-red-500/30',
      recovering: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
    return styles[status as keyof typeof styles] || styles.healthy
  }

  const getSpeciesIcon = (species: string) => {
    const icons = {
      dog: '🐕',
      cat: '🐱',
      bird: '🐦',
      fish: '🐠',
      other: '🐾'
    }
    return icons[species as keyof typeof icons] || '🐾'
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('name')}
              >
                Pet
                {sortField === 'name' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('species')}
              >
                Species
                {sortField === 'species' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('breed')}
              >
                Breed
                {sortField === 'breed' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('age')}
              >
                Age
                {sortField === 'age' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('ownerName')}
              >
                Owner
                {sortField === 'ownerName' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('status')}
              >
                Status
                {sortField === 'status' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedPets.map((pet) => (
              <tr key={pet.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 text-lg">
                      {getSpeciesIcon(pet.species)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {pet.name}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {pet.gender}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300 capitalize">
                    {pet.species}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {pet.breed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {pet.age} {pet.age === 1 ? 'year' : 'years'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {pet.ownerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(pet.status)}`}>
                    {pet.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <select
                      value={pet.status}
                      onChange={(e) => onStatusChange(pet.id, e.target.value as 'healthy' | 'sick' | 'recovering')}
                      className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                    >
                      <option value="healthy">Healthy</option>
                      <option value="sick">Sick</option>
                      <option value="recovering">Recovering</option>
                    </select>
                    <button
                      onClick={() => onEdit(pet)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(pet.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
