import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, Paperclip, MoreVertical, ArrowLeft, Users } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  isOwn: boolean
}

interface User {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey there! Welcome to ChatVerse! 👋',
      sender: 'Alice Johnson',
      timestamp: new Date(Date.now() - 300000),
      isOwn: false
    },
    {
      id: '2',
      text: 'Thanks! This looks amazing. Love the design!',
      sender: 'You',
      timestamp: new Date(Date.now() - 240000),
      isOwn: true
    },
    {
      id: '3',
      text: 'Right? The real-time messaging works perfectly. Try sending a message!',
      sender: 'Alice Johnson',
      timestamp: new Date(Date.now() - 180000),
      isOwn: false
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [selectedChat, setSelectedChat] = useState('alice')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const users: User[] = [
    {
      id: 'alice',
      name: 'Alice Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'online'
    },
    {
      id: 'bob',
      name: 'Bob Smith',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'away'
    },
    {
      id: 'carol',
      name: 'Carol Davis',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'offline'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'You',
      timestamp: new Date(),
      isOwn: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more.",
        "I totally agree with you on that.",
        "Haha, that's funny! 😄",
        "Thanks for sharing that with me.",
        "What do you think about this?",
        "That sounds like a great idea!"
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: users.find(u => u.id === selectedChat)?.name || 'Unknown',
        timestamp: new Date(),
        isOwn: false
      }
      
      setMessages(prev => [...prev, responseMessage])
    }, 1000 + Math.random() * 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const selectedUser = users.find(u => u.id === selectedChat)

  return (
    <div className="h-screen flex bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <div className="w-80 glass border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Chats</h1>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              onClick={() => setSelectedChat(user.id)}
              className={`p-4 cursor-pointer border-b border-white/5 ${
                selectedChat === user.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user.name}</p>
                  <p className="text-gray-400 text-sm capitalize">{user.status}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="glass border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={selectedUser?.avatar}
                  alt={selectedUser?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(selectedUser?.status || 'offline')}`} />
              </div>
              <div>
                <h2 className="text-white font-semibold">{selectedUser?.name}</h2>
                <p className="text-gray-400 text-sm capitalize">{selectedUser?.status}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`chat-bubble p-3 rounded-2xl ${message.isOwn ? 'sent' : 'received'}`}>
                  <p className="text-white text-sm">{message.text}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {format(message.timestamp, 'HH:mm')}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="glass border-t border-white/10 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPage