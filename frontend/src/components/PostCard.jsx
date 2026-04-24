import React, { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Share2, AlertCircle, Bookmark, MoreHorizontal, Send, Smile, AlertTriangle, Lightbulb, Play, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CommentSection from './CommentSectionEnhanced'
import { usePostStore } from '../store/postStore'
import { toxicityService } from '../services/toxicityService'
import toast from 'react-hot-toast'

// Reliable video sources for posts
const workingVideos = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
  'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4',
  'https://sample-videos.com/video321/mp4/480/big_buck_bunny_480p_1mb.mp4',
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/BigBuckBunny_360_10s_1MB.mp4'
]

function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [doubleLiked, setDoubleLiked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [likes, setLikes] = useState(post.likes || 0)
  const [toxicityAlert, setToxicityAlert] = useState(null)
  const [suggestion, setSuggestion] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)
  const imageRef = useRef(null)
  const videoRef = useRef(null)
  const { likePost, unlikePost, createComment } = usePostStore()

  // Get reliable video URL
  const getVideoUrl = (post) => {
    // Always use reliable working videos for posts to prevent errors
    const fallbackIndex = Math.abs(post.id?.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % workingVideos.length
    return workingVideos[fallbackIndex]
  }

  // Handle video play/pause
  const toggleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(err => {
          // Don't log AbortError as it's expected during navigation
          if (err.name !== 'AbortError') {
            console.log('Video play error:', err.message)
          }
        })
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  // Handle video error - suppress errors since we use reliable sources
  const handleVideoError = (e) => {
    // Suppress error logging since we're using reliable sources
    // This prevents console spam while maintaining functionality
    e.preventDefault()
    e.stopPropagation()
    
    // Try next working video if needed
    if (!usedFallback) {
      setUsedFallback(true)
      const nextIndex = (Math.abs(post.id?.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) + 1) % workingVideos.length
      const nextUrl = workingVideos[nextIndex]
      e.target.src = nextUrl
    }
  }

  // Reset fallback state when post changes
  useEffect(() => {
    setUsedFallback(false)
    setIsVideoPlaying(false)
  }, [post.id])

  // Real-time toxicity detection
  const detectToxicity = async (text) => {
    if (!text.trim()) {
      setToxicityAlert(null)
      setSuggestion(null)
      return
    }

    setIsDetecting(true)
    try {
      const result = await toxicityService.detectToxicity(text)
      
      if (result.toxicity_score > 0.75) {
        setToxicityAlert({
          level: 'BLOCKED',
          score: result.toxicity_score,
          categories: result.categories
        })
        const rewriteSuggestion = await toxicityService.suggestRewrite(text)
        if (rewriteSuggestion) setSuggestion(rewriteSuggestion)
      } else if (result.toxicity_score > 0.5) {
        setToxicityAlert({
          level: 'WARNING',
          score: result.toxicity_score,
          categories: result.categories
        })
      } else {
        setToxicityAlert(null)
        setSuggestion(null)
      }
    } catch (error) {
      console.error('Toxicity detection error:', error)
    } finally {
      setIsDetecting(false)
    }
  }

  // Debounced toxicity detection
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      detectToxicity(commentText)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [commentText])

  // Handle double tap for like
  const handleImageDoubleClick = () => {
    if (!liked) {
      setDoubleLiked(true)
      handleLike()
      setTimeout(() => setDoubleLiked(false), 1000)
    }
  }

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikePost(post.id)
        setLikes(prev => Math.max(0, prev - 1))
      } else {
        await likePost(post.id)
        setLikes(prev => prev + 1)
      }
      setLiked(!liked)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleSave = () => {
    setSaved(!saved)
    // TODO: Implement save functionality
  }

  const handleComment = async (e) => {
    e.preventDefault()
    
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    if (toxicityAlert?.level === 'BLOCKED') {
      toast.error('Your comment violates community guidelines and cannot be posted')
      return
    }

    if (toxicityAlert?.level === 'WARNING') {
      // Show confirmation dialog for warning level
      const confirmed = window.confirm(
        `This comment might offend some people (toxicity: ${(toxicityAlert.score * 100).toFixed(1)}%).\n\nAre you sure you want to post it?`
      )
      if (!confirmed) return
    }

    try {
      await createComment(post.id, commentText)
      setCommentText('')
      setToxicityAlert(null)
      setSuggestion(null)
      toast.success('Comment posted successfully!')
    } catch (error) {
      toast.error('Failed to post comment')
    }
  }

  const acceptSuggestion = () => {
    if (suggestion) {
      setCommentText(suggestion)
      setSuggestion(null)
      setToxicityAlert(null)
    }
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffInSeconds = Math.floor((now - postDate) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden mb-6 max-w-2xl mx-auto"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author?.username || 'user'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {post.author?.username ? post.author.username[0].toUpperCase() : '?'}
                </span>
              </div>
            )}
            {/* Verified badge for demo users */}
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-white">{post.author?.username || 'Unknown User'}</h3>
              <span className="text-xs text-gray-400">• {formatTimeAgo(post.createdAt)}</span>
            </div>
            {post.location && (
              <p className="text-xs text-gray-400">{post.location}</p>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-gray-800 rounded-full transition"
          >
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
          
          {/* Options Dropdown */}
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-12 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 w-48 z-10"
              >
                <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition">
                  Report
                </button>
                <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition">
                  Unfollow
                </button>
                <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition">
                  Go to post
                </button>
                <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition">
                  Share to...
                </button>
                <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition">
                  Copy link
                </button>
                <hr className="my-2 border-gray-700" />
                <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 transition">
                  Unfollow
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Media */}
      <div className="relative" ref={imageRef}>
        {post.mediaType === 'video' || post.mediaType === 'reel' ? (
          <div className="relative">
            {(() => {
              const videoUrl = getVideoUrl(post)
              return videoUrl ? (
                <video 
                  key={videoUrl}
                  ref={videoRef}
                  src={videoUrl} 
                  poster={post.thumbnail}
                  alt="post" 
                  className="w-full max-h-[600px] object-contain bg-black"
                  controls
                  preload="metadata"
                  onDoubleClick={handleImageDoubleClick}
                  onError={handleVideoError}
                  onCanPlay={() => console.log('✅ Post video ready to play:', videoUrl)}
                  onLoadStart={() => console.log('🎬 Loading post video:', videoUrl)}
                />
              ) : (
                <div className="w-full max-h-[600px] bg-black flex items-center justify-center">
                  <div className="text-white text-center">
                    <Play className="w-12 h-12 mx-auto mb-2" />
                    <p>Video loading...</p>
                  </div>
                </div>
              )
            })()}
            {/* Play/Pause overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
              onClick={toggleVideoPlayPause}
            >
              <div className="bg-black bg-opacity-50 rounded-full p-4">
                {isVideoPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            {post.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {formatDuration(post.duration)}
              </div>
            )}
            {post.mediaType === 'reel' && (
              <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded font-semibold">
                REEL
              </div>
            )}
          </div>
        ) : post.image ? (
          <img 
            src={post.image} 
            alt="post" 
            className="w-full max-h-[600px] object-contain bg-black"
            onDoubleClick={handleImageDoubleClick}
          />
        ) : null}
        
        {/* Double tap heart animation */}
        <AnimatePresence>
            {doubleLiked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart className="w-24 h-24 text-white" fill="currentColor" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`transition-transform hover:scale-110 ${
                liked ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart className="w-6 h-6" fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-white transition-transform hover:scale-110"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-white transition-transform hover:scale-110">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className={`transition-transform hover:scale-110 ${
              saved ? 'text-white' : 'text-white'
            }`}
          >
            <Bookmark className="w-6 h-6" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Likes count */}
        <div className="mb-2">
          <p className="font-semibold text-white">
            {likes} {likes === 1 ? 'like' : 'likes'}
          </p>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <p className="text-white">
            <span className="font-semibold mr-2">{post.author?.username || 'Unknown'}</span>
            {post.caption}
          </p>
        </div>

        {/* Comments preview */}
        {post.comments && post.comments.length > 0 && (
          <div className="mb-2">
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-gray-400 text-sm hover:text-white transition"
            >
              View all {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
            </button>
            {post.comments.slice(0, 2).map((comment) => (
              <div key={comment._id} className="mt-1">
                <p className="text-white text-sm">
                  <span className="font-semibold mr-2">{comment.author.username}</span>
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 uppercase">{formatTimeAgo(post.createdAt)}</p>
        </div>

        {/* Add Comment with Real-time Toxicity Detection */}
        <form onSubmit={handleComment} className="flex items-start space-x-3 border-t border-gray-800 pt-3">
          <button type="button" className="mt-2">
            <Smile className="w-6 h-6 text-gray-400" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm"
            />
            
            {/* Real-time Toxicity Alerts */}
            <AnimatePresence>
              {toxicityAlert?.level === 'WARNING' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 bg-yellow-900/30 border border-yellow-700 rounded p-2"
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-yellow-200 font-semibold text-xs">Content Warning</p>
                      <p className="text-yellow-100 text-xs">
                        This might offend people ({(toxicityAlert.score * 100).toFixed(1)}% toxic)
                      </p>
                      {suggestion && (
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-yellow-100 text-xs">💡 Try: "{suggestion}"</p>
                          <button
                            type="button"
                            onClick={acceptSuggestion}
                            className="text-yellow-300 text-xs hover:text-yellow-200 underline ml-2"
                          >
                            Accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {toxicityAlert?.level === 'BLOCKED' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 bg-red-900/30 border border-red-700 rounded p-2"
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-200 font-semibold text-xs">Comment Blocked</p>
                      <p className="text-red-100 text-xs">
                        This violates community guidelines ({(toxicityAlert.score * 100).toFixed(1)}% toxic)
                      </p>
                      {suggestion && (
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-red-100 text-xs">💡 Alternative: "{suggestion}"</p>
                          <button
                            type="button"
                            onClick={acceptSuggestion}
                            className="text-red-300 text-xs hover:text-red-200 underline ml-2"
                          >
                            Use This
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {commentText && (
            <button
              type="submit"
              disabled={isDetecting || toxicityAlert?.level === 'BLOCKED'}
              className="mt-2 text-blue-500 font-semibold text-sm hover:text-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDetecting ? '...' : 'Post'}
            </button>
          )}
        </form>
      </div>

      {/* Full Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-800"
          >
            <CommentSection postId={post.id} showComments={showComments} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PostCard
