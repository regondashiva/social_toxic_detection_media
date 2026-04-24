import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Send, Paperclip, Smile, Phone, Video, Info, MoreHorizontal, Check, CheckCheck, Home, ArrowLeft, Mic, Camera, Sticker } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const DirectMessages = () => {
  const navigate = useNavigate()
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showChatInfo, setShowChatInfo] = useState(false)
  const [messages, setMessages] = useState({})
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const mockChats = [
    {
      id: '1',
      username: 'alice_demo',
      avatar: '',
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2m ago',
      unread: 2,
      online: true,
      verified: true
    },
    {
      id: '2',
      username: 'bob_demo',
      avatar: '',
      lastMessage: 'The new feature looks amazing!',
      timestamp: '15m ago',
      unread: 0,
      online: true,
      verified: false
    },
    {
      id: '3',
      username: 'jane_demo',
      avatar: '',
      lastMessage: 'Thanks for sharing! 📸',
      timestamp: '1h ago',
      unread: 0,
      online: false,
      verified: true
    },
    {
      id: '4',
      username: 'tech_demo',
      avatar: '',
      lastMessage: 'Let\'s catch up tomorrow',
      timestamp: '3h ago',
      unread: 1,
      online: false,
      verified: true
    }
  ]

  const mockMessages = {
    '1': [
      { id: '1', text: 'Hey! How are you doing?', sender: 'alice_demo', timestamp: '10:30 AM', read: true },
      { id: '2', text: "I'm doing great! Just working on some new features", sender: 'me', timestamp: '10:32 AM', read: true },
      { id: '3', text: 'That sounds exciting! What are you building?', sender: 'alice_demo', timestamp: '10:33 AM', read: true },
      { id: '4', text: 'An Instagram clone with AI features 🚀', sender: 'me', timestamp: '10:35 AM', read: false },
    ],
    '2': [
      { id: '1', text: 'The new feature looks amazing!', sender: 'bob_demo', timestamp: '9:15 AM', read: true },
      { id: '2', text: 'Thanks! I\'m really happy with how it turned out', sender: 'me', timestamp: '9:20 AM', read: true },
    ]
  }

  // Initialize messages state
  useEffect(() => {
    setMessages(mockMessages)
  }, [])

  const currentChat = mockChats.find(chat => chat.id === selectedChat)
  const currentMessages = messages[selectedChat] || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        timestamp: formatTime(new Date()),
        read: false
      }
      
      setMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMessage]
      }))
      
      setMessage('')
      toast.success('Message sent!')
      
      // Simulate reply after 2 seconds
      setTimeout(() => {
        const replyMessage = {
          id: (Date.now() + 1).toString(),
          text: getAutoReply(message),
          sender: currentChat?.username,
          timestamp: formatTime(new Date()),
          read: true
        }
        
        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), replyMessage]
        }))
      }, 2000)
    }
  }

  const getAutoReply = (userMessage) => {
    const replies = [
      "That's interesting! Tell me more.",
      "I totally agree with you!",
      "Wow, that sounds amazing!",
      "Thanks for sharing that with me!",
      "That's a great point!",
      "I'd love to hear more about this.",
      "That's really cool! 😊",
      "You're absolutely right!",
      "That makes perfect sense!",
      "I'm so glad you told me about this!"
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      toast.success(`File "${file.name}" uploaded!`)
      // In a real app, you'd handle the file upload here
    }
  }

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      toast.success('Recording started...')
    } else {
      toast.success('Voice message sent!')
    }
  }

  const handleNewMessage = (username) => {
    const newChat = {
      id: Date.now().toString(),
      username: username,
      avatar: '',
      lastMessage: 'Start a conversation...',
      timestamp: 'Just now',
      unread: 0,
      online: true,
      verified: false
    }
    mockChats.unshift(newChat)
    setSelectedChat(newChat.id)
    setShowNewMessageModal(false)
    toast.success(`Started conversation with ${username}`)
  }

  const formatTime = (timestamp) => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const filteredChats = mockChats.filter(chat =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* Chat List Sidebar */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-gray-200 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Back to Home"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold">Direct Messages</h1>
            </div>
            <button 
              onClick={() => setShowNewMessageModal(true)}
              className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
            >
              New Message
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => setSelectedChat(chat.id)}
              className="flex items-center space-x-3 p-4 cursor-pointer border-b border-gray-100"
            >
              <div className="relative">
                {chat.avatar ? (
                  <img src={chat.avatar} alt={chat.username} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {chat.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900">{chat.username}</span>
                    {chat.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat && (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="relative">
                {currentChat?.avatar ? (
                  <img src={currentChat.avatar} alt={currentChat.username} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {currentChat?.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
                {currentChat?.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">{currentChat?.username}</span>
                  {currentChat?.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-green-500">Active now</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setShowChatInfo(!showChatInfo)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Info className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {currentMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === 'me' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <div className={`flex items-center justify-end space-x-1 mt-1 ${
                    msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    <span className="text-xs">{msg.timestamp}</span>
                    {msg.sender === 'me' && (
                      msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-100 rounded-full px-4 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <button 
                    type="button" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    title="Add emoji"
                  >
                    <Smile className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    type="button" 
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    title="Add sticker"
                  >
                    <Sticker className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={handleVoiceRecord}
                className={`p-2 rounded-full transition-colors ${
                  isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
                }`}
                title={isRecording ? 'Stop recording' : 'Record voice'}
              >
                <Mic className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            
            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-20 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
                >
                  <div className="grid grid-cols-8 gap-2">
                    {['😀', '😂', '😍', '🤔', '😎', '😭', '😱', '👍', '👎', '👌', '✌️', '🤝', '❤️', '💔', '🔥', '✨'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Chat Info Sidebar */}
      <AnimatePresence>
        {showChatInfo && selectedChat && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="hidden md:block w-80 border-l border-gray-200 bg-white"
          >
            <div className="p-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-4">
                  <span className="text-white text-2xl font-bold">
                    {currentChat?.username[0].toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{currentChat?.username}</h2>
                <p className="text-gray-500 text-sm">{currentChat?.username.toLowerCase()}@socialhub.com</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  View Profile
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Mute Notifications
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Clear Chat
                </button>
                <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
                  Delete Chat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Message Modal */}
      <AnimatePresence>
        {showNewMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowNewMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-96 max-w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">New Message</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {mockChats.slice(0, 3).map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleNewMessage(chat.username)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {chat.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{chat.username}</p>
                        <p className="text-sm text-gray-500">{chat.username.toLowerCase()}@socialhub.com</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DirectMessages
