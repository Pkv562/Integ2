'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    age: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState<string>('')
  const [showAgeInput, setShowAgeInput] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setServerMessage('')

    try {
      const hasAge = showAgeInput && formData.age.trim().length > 0
      const payload: Record<string, any> = {
        username: formData.username,
        password: formData.password
      }
      if (hasAge) {
        payload.age = Number(formData.age)
      }

      const res = await fetch('https://prelim-exam.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      // First attempt with only username/password
      if (!hasAge) {
        setServerMessage(typeof data === 'string' ? data : data.message || 'Unexpected response')
        // Reveal age field immediately when message appears
        setShowAgeInput(true)
        return
      }

      // Second attempt with age included
      const message = typeof data === 'string' ? data : data.message
      const id = (data as any)?.id
      const code = (data as any)?.code

      // Store message to show on login page
      if (message) {
        try {
          sessionStorage.setItem('signupResultMessage', JSON.stringify({ message, id, code }))
        } catch {}
      }

      // Save user ID and code to localStorage for CTF challenge
      if (id && code) {
        try {
          const userData = {
            id: id,
            code: code,
            username: formData.username,
            signupTime: new Date().toISOString()
          }
          localStorage.setItem('userData', JSON.stringify(userData))
          console.log('User data saved:', userData)
        } catch (error) {
          console.error('Failed to save user data:', error)
        }
      }

      router.push('/login')
    } catch (err) {
      setServerMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-gradient inline-block mb-2">
            PetManager
          </Link>
          <h1 className="heading-2">Create Account</h1>
          <p className="text-gray-400">Start with username and password only</p>
        </div>

        {/* Signup Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter a username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter a password"
                required
              />
            </div>

            {serverMessage && (
              <div className="rounded-md border border-purple-700/40 bg-purple-900/20 p-3 text-purple-200 text-sm whitespace-pre-wrap break-words">
                {serverMessage}
              </div>
            )}

            {showAgeInput && (
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your age"
                  min={1}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-lg"
            >
              {isLoading ? 'Submitting...' : showAgeInput ? 'Create Account' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-400 hover:text-gray-300 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
