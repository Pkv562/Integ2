export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  updatedAt: string
  avatar?: string
}

export interface Pet {
  id: string
  name: string
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'other'
  breed: string
  age: number
  gender: 'male' | 'female'
  ownerId: string
  ownerName: string
  status: 'healthy' | 'sick' | 'recovering'
  createdAt: string
  updatedAt: string
  image?: string
  notes?: string
}

export interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'admin' | 'user' | 'moderator'
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  email?: string
  username?: string
  role?: 'admin' | 'user' | 'moderator'
  status?: 'active' | 'inactive' | 'suspended'
}

export interface CreatePetData {
  name: string
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'other'
  breed: string
  age: number
  gender: 'male' | 'female'
  ownerId: string
  notes?: string
}

export interface UpdatePetData {
  name?: string
  species?: 'dog' | 'cat' | 'bird' | 'fish' | 'other'
  breed?: string
  age?: number
  gender?: 'male' | 'female'
  status?: 'healthy' | 'sick' | 'recovering'
  notes?: string
  ownerId?: string
}
