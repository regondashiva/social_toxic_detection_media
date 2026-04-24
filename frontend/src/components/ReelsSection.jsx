import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share2, Music, AlertTriangle, Send, Bookmark, Home, X, ChevronUp, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toxicityService } from '../services/toxicityService'
import toast from 'react-hot-toast'

// Working video URLs as fallback
const workingVideos = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
  'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4',
  'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_2mb.mp4',
  'https://sample-videos.com/video321/mp4/480/big_buck_bunny_480p_1mb.mp4',
  'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/BigBuckBunny_360_10s_1MB.mp4',
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/BigBuckBunny_720_10s_1MB.mp4',
  'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
  'https://file-examples.com/storage/fe86c4e1926ed0cc9b4d3c9/2017/10/file_example_MP4_480_1_5MG.mp4',
  'https://filesamples.com/samples/video/mp4/sample1.mp4'
];

const ReelsSection = ({ onBackToHome }) => {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [liked, setLiked] = useState({})
  const [bookmarked, setBookmarked] = useState({})
  const [following, setFollowing] = useState({})
  const [comments, setComments] = useState({})
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [toxicityAlert, setToxicityAlert] = useState(null)
  const [suggestion, setSuggestion] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [viewMode, setViewMode] = useState('reels')
  
  // Touch gesture state
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Dynamic reels data from backend
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch reel posts from backend
  useEffect(() => {
    fetchReels()
  }, [])

  const fetchReels = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/posts')
      const posts = await response.json()
      
      // Filter only reel posts and transform to reel format
      const reelPosts = posts
        .filter(post => post.mediaType === 'reel')
        .map((post, index) => ({
          id: post.id,
          thumbnail: post.thumbnail || post.image,
          username: post.author?.username || 'unknown',
          caption: post.caption,
          music: 'Original Audio',
          likes: post.likes || 0,
          comments: post.comments?.length || 0,
          shares: Math.floor(Math.random() * 100),
          views: Math.floor(Math.random() * 10000) + 1000,
          tags: post.tags || ['#reel', '#video'],
          verified: post.author?.username === 'socialhub_admin',
          duration: post.duration || 0,
          video: post.video && post.video.trim() !== '' ? post.video : workingVideos[index % workingVideos.length],
          author: post.author
        }))
      
      setReels(reelPosts)
      console.log(`📱 Loaded ${reelPosts.length} reels from database`)
    } catch (error) {
      console.error('Error fetching reels:', error)
      // Fallback to mock data
      setReels(getMockReels())
    } finally {
      setLoading(false)
    }
  }

  const getMockReels = () => [
    {
      id: '1',
      thumbnail: 'https://picsum.photos/seed/reel1/400/800.jpg',
      username: 'alex_dreams',
      caption: 'Living my best life 🌴✨ Summer vibes are calling!',
      music: 'Summer Breeze - Tropical House',
      likes: 15420,
      comments: 892,
      shares: 445,
      views: 45678,
      tags: ['#summer', '#beach', '#vibes'],
      verified: true
    },
    {
      id: '2',
      thumbnail: 'https://picsum.photos/seed/reel2/400/800.jpg',
      username: 'tech_guru',
      caption: 'New gadget alert! 📱 This changes everything!',
      music: 'Tech Beat - Electronic',
      likes: 23456,
      comments: 1234,
      shares: 678,
      views: 67890,
      tags: ['#tech', '#gadgets', '#innovation'],
      verified: true
    },
    {
      id: '3',
      thumbnail: 'https://picsum.photos/seed/reel3/400/800.jpg',
      username: 'foodie_life',
      caption: 'Homemade pasta that melts in your mouth 🍝❤️',
      music: 'Italian Dreams - Classical',
      likes: 12456,
      comments: 723,
      shares: 389,
      views: 34567,
      tags: ['#food', '#pasta', '#homemade'],
      verified: false
    },
    {
      id: '4',
      thumbnail: 'https://picsum.photos/seed/reel4/400/800.jpg',
      username: 'fitness_pro',
      caption: 'Morning workout complete! 💪💯 Consistency is key!',
      music: 'Workout Beats - High Energy',
      likes: 9876,
      comments: 445,
      shares: 178,
      views: 19876,
      tags: ['#fitness', '#workout', '#motivation'],
      verified: true
    },
    {
      id: '5',
      thumbnail: 'https://picsum.photos/seed/reel5/400/800.jpg',
      username: 'travel_addict',
      caption: 'Hidden gem discovered! 🏝️ Paradise found!',
      music: 'Island Vibes - Reggae',
      likes: 18765,
      comments: 934,
      shares: 567,
      views: 56789,
      tags: ['#travel', '#paradise', '#adventure'],
      verified: true
    },
    {
      id: '6',
      thumbnail: 'https://picsum.photos/seed/reel6/400/800.jpg',
      username: 'art_soul',
      caption: 'Creating magic with colors 🎨✨ Art therapy at its finest!',
      music: 'Creative Flow - Ambient',
      likes: 6543,
      comments: 298,
      shares: 145,
      views: 12345,
      tags: ['#art', '#creative', '#therapy'],
      verified: false
    },
    {
      id: '7',
      thumbnail: 'https://picsum.photos/seed/reel7/400/800.jpg',
      username: 'fashion_icon',
      caption: 'OOTD inspiration 👗💄 Serving looks!',
      music: 'Runway Beats - Fashion House',
      likes: 21345,
      comments: 1123,
      shares: 678,
      views: 67890,
      tags: ['#fashion', '#ootd', '#style'],
      verified: true
    },
    {
      id: '8',
      thumbnail: 'https://picsum.photos/seed/reel8/400/800.jpg',
      username: 'pet_lover',
      caption: 'My furry friend stealing hearts 🐾❤️',
      music: 'Cute Animals - Happy Vibes',
      likes: 34567,
      comments: 1567,
      shares: 890,
      views: 89012,
      tags: ['#pets', '#cute', '#animals'],
      verified: false
    },
    {
      id: '9',
      thumbnail: 'https://picsum.photos/seed/reel9/400/800.jpg',
      username: 'music_vibes',
      caption: 'Lost in the music 🎵🎶 Pure bliss!',
      music: 'Chill Vibes - LoFi',
      likes: 14321,
      comments: 789,
      shares: 432,
      views: 43210,
      tags: ['#music', '#chill', '#vibes'],
      verified: true
    },
    {
      id: '10',
      thumbnail: 'https://picsum.photos/seed/reel10/400/800.jpg',
      username: 'nature_captures',
      caption: 'Sunset painting the sky 🌅 Nature\'s masterpiece!',
      music: 'Nature Sounds - Peaceful',
      likes: 19876,
      comments: 1034,
      shares: 543,
      views: 54321,
      tags: ['#nature', '#sunset', '#beauty'],
      verified: false
    }
  ]

  // Initialize comments for each reel
  useEffect(() => {
    const initialComments = {}
    reels.forEach(reel => {
      initialComments[reel.id] = [
        { id: '1', text: 'Amazing content! 🔥', username: 'user1', timestamp: '2h ago', likes: 45 },
        { id: '2', text: 'Love this so much! ❤️', username: 'user2', timestamp: '3h ago', likes: 23 },
        { id: '3', text: 'Incredible work! 👏', username: 'user3', timestamp: '5h ago', likes: 67 }
      ]
    })
    setComments(initialComments)
  }, [reels])

  // Handle reel navigation with smooth transitions
  const handleSwipe = (direction) => {
    if (isTransitioning) return; // Prevent multiple rapid swipes
    
    let newIndex = currentReelIndex
    
    if (direction === 'up' && currentReelIndex < filteredReels.length - 1) {
      newIndex = currentReelIndex + 1
    } else if (direction === 'down' && currentReelIndex > 0) {
      newIndex = currentReelIndex - 1
    }
    
    if (newIndex !== currentReelIndex) {
      console.log(`🔄 Navigating from reel ${currentReelIndex} to ${newIndex}`)
      setIsTransitioning(true)
      setCurrentReelIndex(newIndex)
      
      // Reset video state for new reel
      setIsPlaying(false)
      
      // Clear transition state after animation
      setTimeout(() => {
        setIsTransitioning(false)
      // Auto-play new reel after transition
        if (filteredReels[newIndex]?.video) {
          setTimeout(() => {
            setIsPlaying(true)
          }, 100)
        }
      }, 300)
    }
  }

  // Touch gesture handlers with enhanced responsiveness
  const handleTouchStart = (e) => {
    const touch = e.touches[0] || e.targetTouches[0]
    setTouchStart(touch.clientY)
    console.log('👆 Touch start:', touch.clientY)
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0] || e.targetTouches[0]
    setTouchEnd(touch.clientY)
    
    // Provide visual feedback during swipe
    const diff = touchStart - touch.clientY
    if (Math.abs(diff) > 20) {
      // Add visual feedback class if needed
      e.preventDefault()
    }
  }

  const handleTouchEnd = () => {
    const swipeThreshold = 15 // Further reduced threshold for better responsiveness
    const diff = touchStart - touchEnd
    
    console.log('👆 Touch end - diff:', diff, 'threshold:', swipeThreshold)
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        console.log('👆 Swiping up')
        handleSwipe('up') // Swiped up
      } else {
        console.log('👆 Swiping down')
        handleSwipe('down') // Swiped down
      }
    }
    
    // Reset touch values
    setTouchStart(0)
    setTouchEnd(0)
  }

  // Mouse event handlers for desktop testing
  const handleMouseDown = (e) => {
    setTouchStart(e.clientY)
    console.log('🖱️ Mouse down:', e.clientY)
  }

  const handleMouseMove = (e) => {
    setTouchEnd(e.clientY)
  }

  const handleMouseUp = () => {
    const swipeThreshold = 15
    const diff = touchStart - touchEnd
    
    console.log('🖱️ Mouse up - diff:', diff, 'threshold:', swipeThreshold)
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        console.log('🖱️ Swiping up')
        handleSwipe('up')
      } else {
        console.log('🖱️ Swiping down')
        handleSwipe('down')
      }
    }
    
    setTouchStart(0)
    setTouchEnd(0)
  }

  // Wheel event handler for desktop scrolling
  const handleWheel = (e) => {
    // Debounce wheel events to prevent excessive firing
    const now = Date.now()
    if (now - lastWheelTime < 100) return // 100ms debounce
    
    setLastWheelTime(now)
    
    // Don't prevent default, just handle the navigation
    const delta = e.deltaY
    
    console.log('🖱️ Wheel event - delta:', delta)
    
    if (delta > 0) {
      console.log('🖱️ Scrolling down - next reel')
      handleSwipe('up') // Scroll down = next reel
    } else {
      console.log('🖱️ Scrolling up - previous reel')
      handleSwipe('down') // Scroll up = previous reel
    }
  }

  // Filter reels based on view mode
  const getFilteredReels = () => {
    if (!reels || reels.length === 0) return []
    
    switch (viewMode) {
      case 'trending':
        // Sort by likes (most liked first)
        return [...reels].sort((a, b) => b.likes - a.likes)
      case 'following':
        // Filter by users the current user follows (mock implementation)
        // For demo purposes, show reels from specific users
        const followedUsers = ['demo', 'socialhub_admin', 'testuser']
        const followingReels = reels.filter(reel => 
          followedUsers.includes(reel.author?.username)
        )
        
        // If no followed users have reels, show a message
        if (followingReels.length === 0) {
          return []
        }
        
        return followingReels
      default:
        return reels
    }
  }

  const filteredReels = getFilteredReels()
  const currentReel = filteredReels[currentReelIndex] || null

  // State to track if we've used fallback video
  const [usedFallback, setUsedFallback] = useState(false)

  // Debounce state for wheel events
  const [lastWheelTime, setLastWheelTime] = useState(0)

  // Enhanced video error handling video URL to use (prefer working videos)
  const getVideoUrl = (reel, index) => {
    // Always use working videos for reliability
    return workingVideos[index % workingVideos.length]
  }
  const handleVideoError = (e) => {
    console.error('Video error:', e.target.error || 'Unknown video error');
    
    // Only try fallback once per reel to prevent infinite loops
    if (!usedFallback) {
      console.log('🔄 Attempting to load fallback video...');
      setUsedFallback(true);
      
      // Try to load a fallback video
      const fallbackIndex = currentReelIndex % workingVideos.length;
      const fallbackUrl = workingVideos[fallbackIndex];
      
      console.log('🎬 Loading fallback video:', fallbackUrl);
      e.target.src = fallbackUrl;
    } else {
      console.log('❌ Fallback video also failed, showing image');
      // If fallback also fails, we'll let the conditional rendering show the image
    }
  }

  // Reset fallback state when reel changes
  useEffect(() => {
    setUsedFallback(false);
  }, [currentReelIndex]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Auto-play video when reel changes
  useEffect(() => {
    if (videoRef.current && currentReel?.video) {
      videoRef.current.currentTime = 0
      // Always try to play the video when a new reel loads
      videoRef.current.play().catch(err => {
        console.log('Auto-play prevented by browser:', err)
        setIsPlaying(false)
      })
    }
  }, [currentReelIndex, currentReel])

  // Sync video playback with isPlaying state
  useEffect(() => {
    if (videoRef.current && currentReel?.video) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          // Don't log AbortError as it's expected during navigation
          if (err.name !== 'AbortError') {
            console.log('Play prevented:', err.message)
          }
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying, currentReel])

  // Handle like functionality
  const handleLike = (reelId) => {
    setLiked(prev => ({ ...prev, [reelId]: !prev[reelId] }))
    if (!liked[reelId]) {
      toast.success('❤️ Liked!')
    }
  }

  // Handle bookmark functionality
  const handleBookmark = (reelId) => {
    setBookmarked(prev => ({ ...prev, [reelId]: !prev[reelId] }))
    if (!bookmarked[reelId]) {
      toast.success('🔖 Saved!')
    }
  }

  // Handle follow functionality
  const handleFollow = (reelId) => {
    setFollowing(prev => ({ ...prev, [reelId]: !prev[reelId] }))
    if (!following[reelId]) {
      toast.success(`✅ Following ${reels.find(r => r.id === reelId)?.username}`)
    } else {
      toast.success(`❌ Unfollowed ${reels.find(r => r.id === reelId)?.username}`)
    }
  }

  // Handle share functionality
  const handleShare = (reelId) => {
    toast.success('📤 Link copied to clipboard!')
  }

  // Handle comment submission with toxicity detection
  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    // First, detect toxicity before posting
    setIsDetecting(true)
    try {
      console.log('🔍 Detecting toxicity for reel comment:', commentText)
      const result = await toxicityService.detectToxicity(commentText)
      console.log('📊 Reel comment toxicity result:', result)
      
      if (result.toxicity_score > 0.75) {
        console.log('🚫 Reel comment blocked - Toxicity score:', result.toxicity_score)
        // Block the comment
        setToxicityAlert({
          level: 'BLOCKED',
          score: result.toxicity_score,
          categories: result.categories
        })
        
        // Get rewrite suggestion
        const rewriteSuggestion = await toxicityService.suggestRewrite(commentText)
        if (rewriteSuggestion) setSuggestion(rewriteSuggestion)
        
        toast.error('Comment blocked due to toxic content')
        setIsDetecting(false)
        return
      } else if (result.toxicity_score > 0.5) {
        console.log('⚠️ Reel comment warning - Toxicity score:', result.toxicity_score)
        // Show warning but allow posting
        setToxicityAlert({
          level: 'WARNING',
          score: result.toxicity_score,
          categories: result.categories
        })
        
        const rewriteSuggestion = await toxicityService.suggestRewrite(commentText)
        if (rewriteSuggestion) setSuggestion(rewriteSuggestion)
      } else {
        console.log('✅ Reel comment safe - Toxicity score:', result.toxicity_score)
        // Clear any existing alerts
        setToxicityAlert(null)
        setSuggestion(null)
      }
    } catch (error) {
      console.error('❌ Reel comment toxicity detection error:', error)
      // Continue with posting if detection fails
    } finally {
      setIsDetecting(false)
    }

    // If we reach here, the comment is not blocked, so proceed with posting
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      username: 'demo_user',
      timestamp: 'Just now',
      likes: 0,
      toxicityScore: toxicityAlert?.score || 0,
      toxicityCategories: toxicityAlert?.categories || {}
    }

    setComments(prev => ({
      ...prev,
      [currentReel.id]: [...(prev[currentReel.id] || []), newComment]
    }))

    setCommentText('')
    setToxicityAlert(null)
    setSuggestion(null)
    toast.success('💬 Comment posted!')
  }

  // Toxicity detection for comments
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
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [commentText])

  // Accept suggestion
  const acceptSuggestion = () => {
    if (suggestion) {
      setCommentText(suggestion)
      setSuggestion(null)
      setToxicityAlert(null)
    }
  }

  // Reset current reel index when view mode changes
  useEffect(() => {
    setCurrentReelIndex(0)
    console.log(`🔄 View mode changed to: ${viewMode}, resetting to reel 0`)
  }, [viewMode])

  // Add cleanup for wheel event listener
  useEffect(() => {
    const container = document.querySelector('.reels-container')
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [handleWheel])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') handleSwipe('up')
      if (e.key === 'ArrowDown') handleSwipe('down')
      if (e.key === ' ') {
        e.preventDefault()
        togglePlayPause()
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMute()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentReelIndex, isPlaying, isMuted])

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-black z-30 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading reels...</p>
              <p className="text-sm text-white/60">Fetching amazing content for you</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && (!reels || reels.length === 0) && (
          <div className="absolute inset-0 bg-black z-30 flex items-center justify-center">
            <div className="text-white text-center">
              <p className="text-lg font-medium">No reels available</p>
              <p className="text-sm text-white/60">Check back later for amazing content</p>
            </div>
          </div>
        )}

        {/* No Following Reels State */}
        {!loading && reels.length > 0 && filteredReels.length === 0 && viewMode === 'following' && (
          <div className="absolute inset-0 bg-black z-30 flex items-center justify-center">
            <div className="text-white text-center">
              <p className="text-lg font-medium">No following content</p>
              <p className="text-sm text-white/60">Follow more users to see their reels here</p>
              <button
                onClick={() => setViewMode('reels')}
                className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                Discover Reels
              </button>
            </div>
          </div>
        )}

        {/* Reels Content */}
        {!loading && reels.length > 0 && filteredReels.length > 0 && (
          <>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    console.log('🏠 Navigating back to home feed');
                    if (onBackToHome) {
                      onBackToHome();
                    } else {
                      navigate('/');
                    }
                  }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  title="Go to Home"
                >
                  <Home className="w-5 h-5 text-white" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('reels')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-colors ${
                      viewMode === 'reels' ? 'bg-white text-black' : 'bg-white/20 text-white'
                    }`}
                  >
                    For You
                  </button>
                  <button
                    onClick={() => setViewMode('trending')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-colors ${
                      viewMode === 'trending' ? 'bg-white text-black' : 'bg-white/20 text-white'
                    }`}
                  >
                    Trending
                  </button>
                  <button
                    onClick={() => setViewMode('following')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-colors ${
                      viewMode === 'following' ? 'bg-white text-black' : 'bg-white/20 text-white'
                    }`}
                  >
                    Following
                  </button>
                </div>

                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Main Reel Container */}
            <div 
              className={`reels-container relative w-full h-full bg-black transition-all duration-300 ${
                isTransitioning ? 'opacity-80' : 'opacity-100'
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                setTouchStart(0)
                setTouchEnd(0)
              }}
              style={{ touchAction: 'none' }}
            >
              {/* Reel Content */}
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReelIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    {currentReel?.video ? (
                      <video
                        ref={videoRef}
                        src={getVideoUrl(currentReel, currentReelIndex)}
                        poster={currentReel.thumbnail}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        onClick={togglePlayPause}
                        onError={handleVideoError}
                        onLoadStart={() => console.log('🎬 Loading video:', getVideoUrl(currentReel, currentReelIndex))}
                        onCanPlay={() => console.log('✅ Video ready to play')}
                        onLoadedData={() => console.log('📹 Video data loaded successfully')}
                      />
                    ) : currentReel ? (
                      <img
                        src={currentReel.thumbnail || currentReel.image}
                        alt={currentReel.username}
                        className="w-full h-full object-cover"
                        onClick={() => currentReel?.video && togglePlayPause()}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <p className="text-white/60">No content available</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Play/Pause Overlay */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                        <Play className="w-16 h-16 text-white" fill="currentColor" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* User Info and Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-transparent to-transparent">
                  <div className="flex items-end justify-between">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentReel?.author?.avatar || `https://ui-avatars.com/api/?name=${currentReel?.username}&background=random`}
                          alt={currentReel?.username}
                          className="w-10 h-10 rounded-full border-2 border-white/20"
                        />
                        <div>
                          <p className="text-white font-semibold text-sm">{currentReel?.username}</p>
                          <p className="text-white/80 text-xs flex items-center space-x-1">
                            {currentReel?.verified && (
                              <span className="bg-blue-500 text-white text-xs px-1 rounded-full">✓</span>
                            )}
                            <span>{currentReel?.likes?.toLocaleString() || '0'} likes</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center space-y-4">
                      {/* Play/Pause Button */}
                      {currentReel?.video && (
                        <button
                          onClick={togglePlayPause}
                          className="relative group"
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-110 transition-transform" />
                          {isPlaying ? (
                            <Pause className="w-8 h-8 relative z-10 text-white group-hover:text-blue-300 transition-colors" />
                          ) : (
                            <Play className="w-8 h-8 relative z-10 text-white group-hover:text-blue-300 transition-colors" />
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => handleLike(currentReel?.id)}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-110 transition-transform" />
                        <Heart 
                          className={`w-8 h-8 relative z-10 transition-colors ${
                            liked[currentReel?.id] ? 'text-red-500' : 'text-white hover:text-red-400'
                          }`} 
                          fill={liked[currentReel?.id] ? 'currentColor' : 'none'}
                        />
                        <span className="text-white text-xs mt-1 font-medium">
                          {liked[currentReel?.id] ? currentReel?.likes + 1 : currentReel?.likes}
                        </span>
                      </button>

                      <button
                        onClick={() => setShowComments(!showComments)}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-110 transition-transform" />
                        <MessageCircle className="w-8 h-8 relative z-10 text-white group-hover:text-blue-300 transition-colors" />
                        <span className="text-white text-xs mt-1 font-medium">
                          {comments[currentReel?.id]?.length || 0}
                        </span>
                      </button>

                      <button
                        onClick={() => handleShare(currentReel?.id)}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-110 transition-transform" />
                        <Share2 className="w-8 h-8 relative z-10 text-white group-hover:text-green-300 transition-colors" />
                        <span className="text-white text-xs mt-1 font-medium">
                          {currentReel?.shares || 0}
                        </span>
                      </button>

                      <button
                        onClick={() => handleBookmark(currentReel?.id)}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-110 transition-transform" />
                        <Bookmark className={`w-8 h-8 relative z-10 transition-colors ${
                          bookmarked[currentReel?.id] ? 'text-yellow-400' : 'text-white group-hover:text-yellow-300'
                        }`} 
                        fill={bookmarked[currentReel?.id] ? 'currentColor' : 'none'} />
                        <span className="text-white text-xs mt-1 font-medium">Save</span>
                      </button>

                      <button
                        onClick={toggleMute}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-110 transition-transform" />
                        {isMuted ? (
                          <VolumeX className="w-8 h-8 relative z-10 text-white group-hover:text-purple-300 transition-colors" />
                        ) : (
                          <Volume2 className="w-8 h-8 relative z-10 text-white group-hover:text-purple-300 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Caption and Tags */}
                  <div className="mb-4">
                    <p className="text-white text-sm mb-2">
                      {currentReel?.caption}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-white/80 text-xs mb-3">
                      <Music className="w-3 h-3" />
                      <span>{currentReel?.music}</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {currentReel?.tags?.map((tag, index) => (
                        <span key={index} className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Indicators */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                {filteredReels.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: index === currentReelIndex ? 1.2 : 1,
                      opacity: 1 
                    }}
                    className={`w-1 h-8 rounded-full transition-all duration-300 ${
                      index === currentReelIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Enhanced Swipe Hints */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                <div className="flex flex-col space-y-4 text-xs">
                  <div className={`flex items-center space-x-2 transition-opacity ${
                    currentReelIndex < filteredReels.length - 1 ? 'opacity-100' : 'opacity-30'
                  }`}>
                    <ChevronUp className="w-4 h-4" />
                    <span>Swipe up</span>
                  </div>
                  <div className={`flex items-center space-x-2 transition-opacity ${
                    currentReelIndex > 0 ? 'opacity-100' : 'opacity-30'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                    <span>Swipe down</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 border border-white/30 rounded flex items-center justify-center text-[8px]">⏸</span>
                    <span>Space</span>
                  </div>
                </div>
                
                {/* Current reel indicator */}
                <div className="absolute bottom-4 left-4 text-white/80 text-xs">
                  {currentReelIndex + 1} / {filteredReels.length}
                </div>
              </div>
            </div>

            {/* Comments Overlay */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm rounded-t-3xl p-4 h-96 overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Comments</h3>
                    <button
                      onClick={() => setShowComments(false)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {(comments[currentReel?.id] || []).map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${comment.username}&background=random`}
                          alt={comment.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm">{comment.text}</p>
                          <p className="text-white/60 text-xs">{comment.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <form onSubmit={handleComment} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                      disabled={isDetecting}
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim() || isDetecting || toxicityAlert?.level === 'BLOCKED'}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        !commentText.trim() || isDetecting || toxicityAlert?.level === 'BLOCKED'
                          ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                          : toxicityAlert?.level === 'BLOCKED'
                          ? 'bg-red-500 text-white'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isDetecting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          <span>Processing...</span>
                        </>
                      ) : toxicityAlert?.level === 'BLOCKED' ? (
                        <>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          <span>Blocked</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          <span>Post</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Toxicity Alert */}
                  {toxicityAlert && (
                    <div className={`mb-4 p-3 rounded-lg ${
                      toxicityAlert.level === 'BLOCKED' ? 'bg-red-900 border-red-700' : 'bg-yellow-900 border-yellow-700'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {toxicityAlert.level === 'BLOCKED' ? (
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="text-white text-sm">
                            {toxicityAlert.level === 'BLOCKED' ? (
                              <>
                                <strong>Comment Blocked:</strong> This content violates our community guidelines.
                                {suggestion && (
                                  <div className="mt-2">
                                    <strong>Suggested rewrite:</strong> {suggestion}
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <strong>Comment Warning:</strong> This comment may be inappropriate.
                                {suggestion && (
                                  <div className="mt-2">
                                    <strong>Suggested improvement:</strong> {suggestion}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-300 mt-1">
                            Toxicity Score: {toxicityAlert.score.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
        </div>
      </div>
  )
}

export default ReelsSection
