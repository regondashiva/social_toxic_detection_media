import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Home, Compass, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'

function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-secondary border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
          <span className="text-xl font-bold">SocialHub</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className="hover:text-accent transition flex items-center space-x-1"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to={`/profile/${user?._id}`}
            className="hover:text-accent transition"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent" />
            )}
          </Link>
          
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center space-x-1 hover:text-red-500 transition"
          >
            <LogOut className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-primary border-t border-gray-700 p-4"
        >
          {navLinks.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className="flex items-center space-x-2 p-2 hover:bg-secondary rounded"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 p-2 text-red-500 hover:bg-secondary rounded mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
