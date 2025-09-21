import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import MessageList from './MessageList';
import UserList from './UserList';
import MessageInput from './MessageInput';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:3000', {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to server with socket ID:', newSocket.id);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      newSocket.on('private_message', (message) => {
        console.log('Received private message:', message);
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg._id === message._id);
          if (!exists) {
            return [...prev, message];
          }
          return prev;
        });
      });

      newSocket.on('message_sent', (message) => {
        console.log('Message sent confirmation:', message);
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg._id === message._id);
          if (!exists) {
            return [...prev, message];
          }
          return prev;
        });
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      setSocket(newSocket);

      return () => {
        console.log('Cleaning up socket connection');
        newSocket.close();
      };
    }
  }, [token]);

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data.filter(u => u._id !== user.id));
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, [user.id]);

  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser && socket) {
      const loadMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/chat/messages/${selectedUser._id}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      };

      loadMessages();
    }
  }, [selectedUser, socket]);

  // Search users
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/chat/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSendMessage = (text, attachments) => {
    if (selectedUser && socket && (text.trim() || attachments.length > 0)) {
      console.log('Sending message to:', selectedUser._id, 'Text:', text, 'Attachments:', attachments);
      
      const messageData = {
        to: selectedUser._id,
        text: text.trim(),
        attachments: attachments || []
      };
      
      socket.emit('private_message', messageData);
    } else {
      console.log('Cannot send message - missing requirements:', {
        selectedUser: !!selectedUser,
        socket: !!socket,
        hasText: text.trim(),
        hasAttachments: attachments.length > 0
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-800 shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-100">{user.name}</h2>
                <p className="text-sm text-gray-50">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-50 hover:text-gray-100"
                title="Profile"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-50 hover:text-gray-100"
                title="Logout"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-500">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg placeholder:text-gray-500 text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                {searchResults.map(user => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className="p-3 hover:bg-gray-500 cursor-pointer border-b border-gray-500 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-gray-50 text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white-100">{user.name}</p>
                        <p className="text-sm text-gray-50">@{user.username}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User List */}
        <UserList 
          users={users} 
          selectedUser={selectedUser} 
          onUserSelect={setSelectedUser} 
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-500 bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-50">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-300">@{selectedUser.username}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
              <MessageList messages={messages} currentUserId={user.id} />
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-50">No conversation selected</h3>
              <p className="mt-1 text-sm text-gray-300">Choose a user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
