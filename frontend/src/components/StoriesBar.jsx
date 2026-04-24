import React, { useState, useEffect, useRef } from 'react'
import { Plus, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const StoriesBar = () => {
  const [stories, setStories] = useState([])
  const [activeStory, setActiveStory] = useState(null)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef(null)
  const progressInterval = useRef(null)

  // Enhanced stories data with real content
  useEffect(() => {
    const mockStories = [
      {
        id: '1',
        username: 'Your Story',
        avatar: '',
        isOwn: true,
        hasStory: false
      },
      {
        id: '2',
        username: 'alice_demo',
        avatar: 'https://picsum.photos/seed/alice/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        content: [
          {
            type: 'image',
            url: 'https://picsum.photos/seed/alice1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 5000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/alice3/400/600.jpg',
            duration: 3000
          }
        ]
      },
      {
        id: '3',
        username: 'bob_demo',
        avatar: 'https://picsum.photos/seed/bob/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: true,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 4000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/bob2/400/600.jpg',
            duration: 3000
          }
        ]
      },
      {
        id: '4',
        username: 'jane_demo',
        avatar: 'https://picsum.photos/seed/jane/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 3500
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/jane1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 4500
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/jane3/400/600.jpg',
            duration: 2500
          }
        ]
      },
      {
        id: '5',
        username: 'tech_demo',
        avatar: 'https://picsum.photos/seed/tech/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 4000
          }
        ]
      },
      {
        id: '6',
        username: 'travel_demo',
        avatar: 'https://picsum.photos/seed/travel/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 3000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/travel1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 4000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/travel2/400/600.jpg',
            duration: 3000
          }
        ]
      },
      {
        id: '7',
        username: 'food_demo',
        avatar: 'https://picsum.photos/seed/food/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: true,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 5000
          }
        ]
      },
      {
        id: '8',
        username: 'nature_demo',
        avatar: 'https://picsum.photos/seed/nature/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 4000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/nature1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 6000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/nature2/400/600.jpg',
            duration: 3000
          }
        ]
      },
      {
        id: '9',
        username: 'art_demo',
        avatar: 'https://picsum.photos/seed/art/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 3500
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/art1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 3500
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/art2/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 5000
          }
        ]
      },
      {
        id: '10',
        username: 'sports_demo',
        avatar: 'https://picsum.photos/seed/sports/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: true,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 4500
          }
        ]
      },
      {
        id: '11',
        username: 'music_demo',
        avatar: 'https://picsum.photos/seed/music/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 3000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/music1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 4000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/music2/400/600.jpg',
            duration: 3000
          }
        ]
      },
      {
        id: '12',
        username: 'fashion_demo',
        avatar: 'https://picsum.photos/seed/fashion/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 3000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/fashion1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 3000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/fashion2/400/600.jpg',
            duration: 3000
          }
        ]
      },
      {
        id: '13',
        username: 'pets_demo',
        avatar: 'https://picsum.photos/seed/pets/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 5000
          }
        ]
      },
      {
        id: '14',
        username: 'fitness_demo',
        avatar: 'https://picsum.photos/seed/fitness/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: true,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 4000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/fitness1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 6000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/fitness2/400/600.jpg',
            duration: 3000
          }
        ]
      },
      {
        id: '15',
        username: 'gaming_demo',
        avatar: 'https://picsum.photos/seed/gaming/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 4500
          }
        ]
      },
      {
        id: '16',
        username: 'photography_demo',
        avatar: 'https://picsum.photos/seed/photography/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        content: [
          {
            type: 'image',
            url: 'https://picsum.photos/seed/photo1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 4000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/photo2/400/600.jpg',
            duration: 3000
          }
        ]
      },
      {
        id: '17',
        username: 'cooking_demo',
        avatar: 'https://picsum.photos/seed/cooking/100/100.jpg',
        isOwn: false,
        hasStory: true,
        viewed: true,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        content: [
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            duration: 5000
          },
          {
            type: 'image',
            url: 'https://picsum.photos/seed/cooking1/400/600.jpg',
            duration: 3000
          },
          {
            type: 'video',
            url: 'https://www.w3schools.com/html/movie.mp4',
            duration: 4000
          }
        ]
      }
    ]
    setStories(mockStories)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (activeStory && isPlaying) {
      const currentContent = activeStory.content[currentStoryIndex]
      if (currentContent) {
        setProgress(0)
        
        // Clear existing interval
        if (progressInterval.current) {
          clearInterval(progressInterval.current)
        }
        
        // Start progress animation
        progressInterval.current = setInterval(() => {
          setProgress(prev => {
            const increment = 100 / (currentContent.duration / 100)
            const newProgress = prev + increment
            
            if (newProgress >= 100) {
              clearInterval(progressInterval.current)
              // Move to next content or story
              if (currentStoryIndex < activeStory.content.length - 1) {
                setCurrentStoryIndex(prev => prev + 1)
              } else {
                // Move to next story
                const currentStoryIdx = stories.findIndex(s => s.id === activeStory.id)
                if (currentStoryIdx < stories.length - 1) {
                  const nextStory = stories[currentStoryIdx + 1]
                  setActiveStory(nextStory)
                  setCurrentStoryIndex(0)
                  // Mark current story as viewed
                  setStories(prev => prev.map(s => 
                    s.id === activeStory.id ? { ...s, viewed: true } : s
                  ))
                } else {
                  // End of stories
                  setActiveStory(null)
                }
              }
              return 0
            }
            
            return newProgress
          })
        }, 100)
      }
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [activeStory, currentStoryIndex, isPlaying, stories])

  // Cleanup video when switching stories
  useEffect(() => {
    if (videoRef.current && activeStory) {
      const currentContent = activeStory.content[currentStoryIndex]
      if (currentContent?.type === 'video') {
        // Pause video when switching stories
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [currentStoryIndex, activeStory])

  // Handle video play/pause
  useEffect(() => {
    if (videoRef.current && activeStory) {
      const currentContent = activeStory.content[currentStoryIndex]
      if (currentContent?.type === 'video') {
        if (isPlaying) {
          videoRef.current.play().catch(err => {
            // Don't log AbortError as it's expected during navigation
            if (err.name !== 'AbortError') {
              console.log('Video play error:', err.message)
            }
          })
        } else {
          videoRef.current.pause()
        }
      }
    }
  }, [isPlaying, currentStoryIndex, activeStory])

  const handleStoryClick = (story) => {
    if (story.isOwn && !story.hasStory) {
      console.log('Create new story')
    } else if (story.hasStory) {
      setActiveStory(story)
      setCurrentStoryIndex(0)
      setIsPlaying(true)
      setProgress(0)
      // Mark as viewed
      setStories(prev => prev.map(s => 
        s.id === story.id ? { ...s, viewed: true } : s
      ))
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const goToNextStory = () => {
    const currentStoryIdx = stories.findIndex(s => s.id === activeStory.id)
    if (currentStoryIdx < stories.length - 1) {
      const nextStory = stories[currentStoryIdx + 1]
      setActiveStory(nextStory)
      setCurrentStoryIndex(0)
      setProgress(0)
    }
  }

  const goToPreviousStory = () => {
    const currentStoryIdx = stories.findIndex(s => s.id === activeStory.id)
    if (currentStoryIdx > 0) {
      const prevStory = stories[currentStoryIdx - 1]
      setActiveStory(prevStory)
      setCurrentStoryIndex(0)
      setProgress(0)
    }
  }

  const goToNextContent = () => {
    if (currentStoryIndex < activeStory.content.length - 1) {
      setCurrentStoryIndex(prev => prev + 1)
    } else {
      goToNextStory()
    }
  }

  const goToPreviousContent = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1)
    }
  }

  return (
    <>
      {/* Stories Container */}
      <div className="bg-gray-950 border-b border-gray-800 p-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center space-y-1 cursor-pointer flex-shrink-0"
              onClick={() => handleStoryClick(story)}
            >
              {/* Story Circle */}
              <div className="relative">
                {story.isOwn ? (
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className={`w-16 h-16 rounded-full p-0.5 ${
                    story.viewed === true 
                      ? 'bg-gray-700' 
                      : 'bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500'
                  }`}>
                    <div className="w-full h-full rounded-full bg-gray-900 p-0.5">
                      <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                        {story.avatar ? (
                          <img 
                            src={story.avatar} 
                            alt={story.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">
                              {story.username[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Live indicator for recent stories */}
                {story.viewed === false && story.hasStory && (
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              {/* Username */}
              <span className="text-xs text-white truncate w-16 text-center">
                {story.isOwn ? 'Your story' : story.username}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setActiveStory(null)}
          >
            <div className="relative max-w-md w-full h-full">
              {/* Story Progress Bar */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="flex space-x-1">
                  {activeStory.content.map((_, index) => (
                    <div key={index} className="flex-1 bg-white/30 h-1 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: index === currentStoryIndex ? 0 : '100%' }}
                        animate={{ 
                          width: index === currentStoryIndex ? `${progress}%` : '100%'
                        }}
                        transition={{ 
                          duration: index === currentStoryIndex ? 100 : 0,
                          ease: 'linear'
                        }}
                        className="h-full bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Story Content */}
              <div className="flex items-center justify-center h-full">
                <div className="relative w-full h-full">
                  {activeStory.content[currentStoryIndex]?.type === 'video' ? (
                    <video
                      key={activeStory.content[currentStoryIndex].url}
                      ref={videoRef}
                      src={activeStory.content[currentStoryIndex].url}
                      className="w-full h-full object-cover"
                      autoPlay={isPlaying}
                      muted={isMuted}
                      loop={false}
                      playsInline
                      onClick={togglePlayPause}
                    />
                  ) : (
                    <img
                      key={activeStory.content[currentStoryIndex].url}
                      src={activeStory.content[currentStoryIndex].url}
                      alt="Story content"
                      className="w-full h-full object-cover"
                      onClick={togglePlayPause}
                    />
                  )}

                  {/* Play/Pause overlay */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Play className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                </div>
              </div>

              {/* Story Header */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {activeStory.username[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-semibold">{activeStory.username}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveStory(null)
                  }}
                  className="text-white/80 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Controls */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPreviousStory()
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNextStory()
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              {/* Media Controls */}
              <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlayPause()
                  }}
                  className="text-white/80 hover:text-white"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMute()
                  }}
                  className="text-white/80 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>

              {/* Content Navigation */}
              <div className="absolute bottom-4 left-4 right-20 z-10">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      goToPreviousContent()
                    }}
                    disabled={currentStoryIndex === 0}
                    className="text-white/60 hover:text-white disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      goToNextContent()
                    }}
                    disabled={currentStoryIndex === activeStory.content.length - 1}
                    className="text-white/60 hover:text-white disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}

export default StoriesBar
