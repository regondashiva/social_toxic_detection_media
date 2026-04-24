import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { usePostStore } from '../store/postStore'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import StoriesBar from '../components/StoriesBar'
import ReelsSection from '../components/ReelsSection'
import DirectMessages from '../components/DirectMessages'
import { Loader, Home, Search, PlusSquare, Heart, User, Send, Bookmark, MessageCircle, Play, Grid, Film } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Feed() {
  const { posts, loading, fetchPosts, createPost, likePost, unlikePost } = usePostStore()
  const [activeTab, setActiveTab] = useState('home')
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([])
  const [currentView, setCurrentView] = useState('feed') // feed, reels, messages

  // Optimized fetch with memoization
  const optimizedFetchPosts = useCallback(() => {
    fetchPosts()
  }, [fetchPosts])

  // Memoized filtered posts for search
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts
    return posts.filter(post => 
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [posts, searchQuery])

  useEffect(() => {
    optimizedFetchPosts()
    // Simulate real-time updates
    const interval = setInterval(optimizedFetchPosts, 30000)
    return () => clearInterval(interval)
  }, [optimizedFetchPosts])

  // Performance optimized animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const handleNewPost = async (postData) => {
    await createPost(postData)
    setShowNewPostModal(false)
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    if (tab === 'home') setCurrentView('feed')
    else if (tab === 'reels') setCurrentView('reels')
    else if (tab === 'messages') setCurrentView('messages')
  }

  // Render different views based on currentView
  if (currentView === 'reels') {
    return <ReelsSection onBackToHome={() => setCurrentView('feed')} />
  }

  if (currentView === 'messages') {
    return <DirectMessages />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Stories Bar */}
      <StoriesBar />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Tab Navigation */}
        <div className="flex items-center justify-center mb-6 border-b border-gray-800">
          <div className="flex space-x-12">
            <button
              onClick={() => setCurrentView('feed')}
              className={`pb-3 border-b-2 transition ${
                currentView === 'feed' 
                  ? 'border-white' 
                  : 'border-transparent hover:border-gray-600'
              }`}
            >
              <Grid className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentView('reels')}
              className={`pb-3 border-b-2 transition ${
                currentView === 'reels' 
                  ? 'border-white' 
                  : 'border-transparent hover:border-gray-600'
              }`}
            >
              <Film className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentView('messages')}
              className={`pb-3 border-b-2 transition relative ${
                currentView === 'messages' 
                  ? 'border-white' 
                  : 'border-transparent hover:border-gray-600'
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
              )}
            </button>
          </div>
        </div>

        {/* Create Post */}
        <CreatePost onPostCreated={handleNewPost} />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && posts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <Loader className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-gray-400">Loading amazing content...</p>
            </div>
          </div>
        ) : (
          /* Posts Feed */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <div className="mb-4">
                    <Search className="w-16 h-16 mx-auto text-gray-600" />
                  </div>
                  <p className="text-gray-400 text-lg">No posts found</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {searchQuery ? 'Try a different search term' : 'Follow users to see their posts!'}
                  </p>
                </motion.div>
              ) : (
                filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    layout
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 md:hidden">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => handleTabClick('home')}
            className={`p-3 ${activeTab === 'home' ? 'text-white' : 'text-gray-400'}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleTabClick('search')}
            className={`p-3 ${activeTab === 'search' ? 'text-white' : 'text-gray-400'}`}
          >
            <Search className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView('reels')}
            className={`p-3 ${currentView === 'reels' ? 'text-white' : 'text-gray-400'}`}
          >
            <Play className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView('messages')}
            className={`p-3 relative ${currentView === 'messages' ? 'text-white' : 'text-gray-400'}`}
          >
            <MessageCircle className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabClick('profile')}
            className={`p-3 ${activeTab === 'profile' ? 'text-white' : 'text-gray-400'}`}
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Feed
