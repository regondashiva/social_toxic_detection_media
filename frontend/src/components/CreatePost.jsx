import React, { useState, useRef } from 'react'
import { ImagePlus, X, MapPin, Smile, Hash, Calendar, UserPlus, Video, Music, FileText, Palette, Crop } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePostStore } from '../store/postStore'
import toast from 'react-hot-toast'

function CreatePost({ onPostCreated }) {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [mediaType, setMediaType] = useState('image') // 'image', 'video', 'reel'
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [location, setLocation] = useState('')
  const [feeling, setFeeling] = useState('')
  const [duration, setDuration] = useState('')
  const fileInputRef = useRef(null)
  const { createPost } = usePostStore()

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const maxSize = mediaType === 'video' || mediaType === 'reel' ? 100 * 1024 * 1024 : 10 * 1024 * 1024
      if (file.size > maxSize) {
        const sizeLimit = mediaType === 'video' || mediaType === 'reel' ? '100MB' : '10MB'
        toast.error(`${mediaType === 'image' ? 'Image' : 'Video'} size should be less than ${sizeLimit}`)
        return
      }
      
      if (mediaType === 'image') {
        setImage(file)
        setVideo(null)
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(file)
      } else {
        setVideo(file)
        setImage(null)
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(file)
        
        // Get video duration
        const videoElement = document.createElement('video')
        videoElement.src = URL.createObjectURL(file)
        videoElement.onloadedmetadata = () => {
          setDuration(Math.floor(videoElement.duration))
          URL.revokeObjectURL(videoElement.src)
        }
      }
    }
  }

  const handleSubmit = async () => {
    if (!caption.trim() && !image && !video) {
      toast.error('Add a caption or media')
      return
    }

    setLoading(true)
    try {
      const postData = {
        caption: caption.trim(),
        mediaType,
        image: mediaType === 'image' ? preview : null,
        video: (mediaType === 'video' || mediaType === 'reel') ? preview : null,
        duration: duration || null,
        location: location.trim() || null,
        feeling: feeling.trim() || null,
        createdAt: new Date().toISOString()
      }

      await createPost(postData)
      setCaption('')
      setImage(null)
      setVideo(null)
      setPreview(null)
      setDuration('')
      setLocation('')
      setFeeling('')
      onPostCreated(postData)
      toast.success('Post created successfully!')
    } catch (error) {
      toast.error('Failed to create post')
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearMedia = () => {
    setImage(null)
    setVideo(null)
    setPreview(null)
    setDuration('')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      if (imageFile.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB')
        return
      }
      setImage(imageFile)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(imageFile)
    }
  }

  const feelings = [
    '😊 Happy', '😢 Sad', '😡 Angry', '😴 Tired', 
    '🎉 Excited', '😍 In Love', '🤔 Thinking', '😎 Cool'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-lg"
            rows="1"
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
          />
        </div>
      </div>

      {/* Image Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative mb-4 rounded-xl overflow-hidden"
          >
            <img src={preview} alt="preview" className="w-full max-h-[400px] object-contain bg-black" />
            <button
              onClick={() => {
                setImage(null)
                setPreview(null)
              }}
              className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            {/* Image overlay options */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between">
              <div className="flex space-x-2">
                <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition">
                  <Palette className="w-4 h-4 text-white" />
                </button>
                <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition">
                  <Crop className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Options */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 space-y-3"
          >
            {/* Location */}
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Add location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            {/* Feeling */}
            <div className="flex items-center space-x-2">
              <Smile className="w-4 h-4 text-gray-400" />
              <select
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
              >
                <option value="">Add feeling</option>
                {feelings.map((feeling) => (
                  <option key={feeling} value={feeling}>{feeling}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Type Selection */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setMediaType('image')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mediaType === 'image'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <ImagePlus className="w-4 h-4 inline mr-2" />
          Photo
        </button>
        <button
          onClick={() => setMediaType('video')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mediaType === 'video'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Video className="w-4 h-4 inline mr-2" />
          Video
        </button>
        <button
          onClick={() => setMediaType('reel')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            mediaType === 'reel'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Music className="w-4 h-4 inline mr-2" />
          Reel
        </button>
      </div>

      {/* Media Upload Area */}
      {!preview && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-700 rounded-xl p-8 mb-4 text-center hover:border-purple-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              {mediaType === 'image' ? (
                <ImagePlus className="w-8 h-8 text-gray-400" />
              ) : mediaType === 'video' ? (
                <Video className="w-8 h-8 text-gray-400" />
              ) : (
                <Music className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-white font-semibold">
                {mediaType === 'image' ? 'Drag photos here' : 
                 mediaType === 'video' ? 'Drag videos here' : 'Drag reels here'}
              </p>
              <p className="text-gray-400 text-sm">or click to browse</p>
            </div>
            <p className="text-gray-500 text-xs">
              {mediaType === 'image' ? 'Recommended: Upload high-quality photos' :
               mediaType === 'video' ? 'Maximum size: 100MB' : 'Maximum size: 100MB, under 60 seconds'}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Media Options */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 text-gray-400 hover:text-purple-500 transition"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-sm">Photo</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-500 transition">
            <Video className="w-5 h-5" />
            <span className="text-sm">Video</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-500 transition">
            <Music className="w-5 h-5" />
            <span className="text-sm">Music</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-500 transition">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Article</span>
          </button>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-gray-400 hover:text-purple-500 transition"
          >
            <Hash className="w-5 h-5" />
            <span className="text-sm">More</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setCaption('')
              setImage(null)
              setPreview(null)
              setLocation('')
              setFeeling('')
              setShowAdvanced(false)
            }}
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading || (!caption.trim() && !image)}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={mediaType === 'image' ? 'image/*' : 'video/*'}
        onChange={handleMediaChange}
        className="hidden"
      />

      {/* Character count */}
      {caption.length > 0 && (
        <div className="mt-2 text-right">
          <span className={`text-xs ${caption.length > 2000 ? 'text-red-500' : 'text-gray-400'}`}>
            {caption.length}/2000
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default CreatePost
