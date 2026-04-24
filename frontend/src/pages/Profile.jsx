import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Loader } from 'lucide-react'

function Profile() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`)
        setProfile(response.data)
        setPosts(response.data.posts || [])
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {profile && (
        <>
          <div className="bg-secondary border border-gray-700 rounded-lg p-8 mb-8">
            <div className="flex items-center space-x-6">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-accent" />
              )}
              <div>
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                <p className="text-gray-400">{profile.bio || 'No bio'}</p>
                <div className="flex space-x-6 mt-4">
                  <div>
                    <p className="font-semibold">{posts.length}</p>
                    <p className="text-gray-400 text-sm">Posts</p>
                  </div>
                  <div>
                    <p className="font-semibold">{profile.followers?.length || 0}</p>
                    <p className="text-gray-400 text-sm">Followers</p>
                  </div>
                  <div>
                    <p className="font-semibold">{profile.following?.length || 0}</p>
                    <p className="text-gray-400 text-sm">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="aspect-square bg-secondary rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer"
              >
                {post.image && (
                  <img src={post.image} alt="post" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Profile
