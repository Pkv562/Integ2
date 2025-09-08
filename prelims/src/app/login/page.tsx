'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    authKey: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [signupMessage, setSignupMessage] = useState<string>('')
  const [serverMessage, setServerMessage] = useState<string>('')
  const [showAuthKey, setShowAuthKey] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setServerMessage('')

    try {
      const hasAuthKey = showAuthKey && formData.authKey.trim().length > 0
      const payload: Record<string, any> = {
        username: formData.username,
        password: formData.password
      }
      if (hasAuthKey) {
        payload.authKey = formData.authKey.trim()
      }

      const res = await fetch('https://prelim-exam.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (!hasAuthKey) {
        // Show the first message and reveal authKey immediately
        setServerMessage(typeof data === 'string' ? data : data.message || 'Unexpected response')
        setShowAuthKey(true)
        return
      }

      // Second step: only proceed on success message; otherwise, show error and stay here
      const message = typeof data === 'string' ? data : data.message || ''
      const isSuccess = /congrats/i.test(message)

      if (!isSuccess) {
        setServerMessage(message || 'Invalid authentication. Please try again.')
        // Ensure auth key field stays visible for correction
        setShowAuthKey(true)
        return
      }

      // Successful login: store message for dashboard and redirect
      try {
        sessionStorage.setItem('loginResultMessage', message)
      } catch {}

      // Note: User data is now saved during signup, not login
      router.push('/dashboard/users')
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

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('signupResultMessage')
      if (raw) {
        const parsed = JSON.parse(raw)
        const composed = parsed?.message && (parsed?.id || parsed?.code)
          ? `${parsed.message}\n\nID: ${parsed.id || '(hidden)'}\nCode: ${parsed.code || '(hidden)'}`
          : parsed?.message || ''
        setSignupMessage(composed)
        // Clear after showing once
        sessionStorage.removeItem('signupResultMessage')
      }
    } catch {}
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
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
          <h1 className="heading-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in with username and password first</p>
        </div>

        {/* Login Form */}
        <div className="card">
          {signupMessage && (
            <div className="mb-4 rounded-md border border-purple-700/40 bg-purple-900/20 p-3 text-purple-200 text-sm whitespace-pre-wrap break-words">
              {signupMessage}
            </div>
          )}
          {serverMessage && (
            <div className="mb-4 rounded-md border border-purple-700/40 bg-purple-900/20 p-3 text-purple-200 text-sm whitespace-pre-wrap break-words">
              {serverMessage}
            </div>
          )}
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                required
              />
            </div>

            {showAuthKey && (
              <div>
                <label htmlFor="authKey" className="block text-sm font-medium text-gray-300 mb-2">
                  Auth Key
                </label>
                <input
                  type="text"
                  id="authKey"
                  name="authKey"
                  value={formData.authKey}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your 6 character code"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-between"></div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-lg"
            >
              {isLoading ? 'Signing In...' : showAuthKey ? 'Sign In' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign up
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
