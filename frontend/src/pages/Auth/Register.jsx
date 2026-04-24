import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      navigate('/')
      toast.success('Registered successfully!')
    } catch (error) {
      toast.error('Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-secondary border border-gray-700 rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <Heart className="w-12 h-12 text-red-500" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">SocialHub</h1>
          <p className="text-gray-400 text-center mb-6">Join our community</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-primary border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-primary border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-primary border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-primary border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-accent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold py-2 rounded transition"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
