import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader } from 'lucide-react'

function Explore() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users')
        setUsers(response.data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-secondary border border-gray-700 rounded-lg p-4 hover:border-accent transition cursor-pointer text-center"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-16 h-16 rounded-full mx-auto mb-3"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-3" />
            )}
            <h3 className="font-semibold">{user.username}</h3>
            <p className="text-gray-400 text-sm">{user.followers?.length || 0} followers</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Explore
