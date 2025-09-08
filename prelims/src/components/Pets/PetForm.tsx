'use client'

import { useState, useEffect } from 'react'
import { Pet, CreatePetData, UpdatePetData, User } from '@/types'

interface PetFormProps {
  pet?: Pet
  users: User[]
  onSubmit: (data: CreatePetData | UpdatePetData) => Promise<void> | void
  onCancel: () => void
  isLoading: boolean
}

export default function PetForm({ pet, users, onSubmit, onCancel, isLoading }: PetFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat' | 'bird' | 'fish' | 'other',
    breed: '',
    age: 0,
    gender: 'male' as 'male' | 'female',
    ownerId: '',
    notes: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        ownerId: pet.ownerId,
        notes: pet.notes || ''
      })
    }
  }, [pet])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Pet name is required'
    }
    if (!formData.breed.trim()) {
      newErrors.breed = 'Breed is required'
    }
    if (formData.age < 0) {
      newErrors.age = 'Age must be a positive number'
    }
    if (!formData.ownerId) {
      newErrors.ownerId = 'Please select an owner'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'age' ? parseInt(e.target.value) || 0 : e.target.value
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="heading-3 mb-6">
          {pet ? 'Edit Pet' : 'Add New Pet'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Pet Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Buddy"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="species" className="block text-sm font-medium text-gray-300 mb-2">
                Species
              </label>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="input-field"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="fish">Fish</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-300 mb-2">
              Breed
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className={`input-field ${errors.breed ? 'border-red-500' : ''}`}
              placeholder="Golden Retriever"
            />
            {errors.breed && (
              <p className="text-red-400 text-sm mt-1">{errors.breed}</p>
            )}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
              Age (years)
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              className={`input-field ${errors.age ? 'border-red-500' : ''}`}
              placeholder="3"
            />
            {errors.age && (
              <p className="text-red-400 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          <div>
            <label htmlFor="ownerId" className="block text-sm font-medium text-gray-300 mb-2">
              Owner
            </label>
            <select
              id="ownerId"
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className={`input-field ${errors.ownerId ? 'border-red-500' : ''}`}
            >
              <option value="">Select an owner</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
            {errors.ownerId && (
              <p className="text-red-400 text-sm mt-1">{errors.ownerId}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Any additional notes about the pet..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Saving...' : (pet ? 'Update Pet' : 'Create Pet')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
