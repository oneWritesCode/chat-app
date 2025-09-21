# MERN Stack Chat Application

A real-time chat application built with MongoDB, Express.js, React, and Node.js, featuring user authentication, real-time messaging, and file sharing capabilities.

## Features

- 🔐 **User Authentication**: Sign up and login with email, username, or mobile number
- 💬 **Real-time Chat**: Instant messaging using Socket.IO
- 👥 **User Search**: Find users by username or email
- 📁 **File Sharing**: Upload and share images and videos
- 🎨 **Modern UI**: Clean and responsive design with Tailwind CSS
- 🔒 **JWT Authentication**: Secure token-based authentication
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd CHAT\ APP
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
MONGO_URI=mongodb://127.0.0.1:27017/chat-app
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or start MongoDB service
sudo systemctl start mongod
```

## Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd backend
npm run dev
```

2. **Start the frontend development server:**
```bash
cd frontend
npm run dev
```

3. **Open your browser:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Production Mode

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Start the backend:**
```bash
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Chat
- `GET /api/chat/messages/:userId` - Get messages between users
- `GET /api/chat/chats` - Get all chats for current user
- `GET /api/chat/search` - Search users
- `POST /api/chat/upload` - Upload files

### Users
- `GET /api/users` - Get all users

## Socket.IO Events

### Client to Server
- `private_message` - Send a private message
- `connection` - User connects

### Server to Client
- `private_message` - Receive a private message
- `message_sent` - Message sent confirmation
- `error` - Error occurred

## File Upload

The application supports uploading:
- **Images**: JPEG, PNG, GIF
- **Videos**: MP4, WebM, MOV
- **Maximum file size**: 10MB per file

Files are stored in the `backend/uploads` directory and served statically.

## Database Schema

### User Schema
```javascript
{
  name: String (required),
  username: String (required, unique),
  email: String (required, unique),
  mobile: String (optional, unique),
  password: String (hashed),
  avatar: String (optional),
  isOnline: Boolean,
  lastSeen: Date,
  createdAt: Date
}
```

### Message Schema
```javascript
{
  chatId: String (required),
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  text: String,
  attachments: [{
    filename: String,
    url: String,
    mimeType: String,
    size: Number
  }],
  createdAt: Date,
  edited: Boolean,
  deleted: Boolean
}
```

## Project Structure

```
CHAT APP/
├── backend/
│   ├── controllers/
│   │   └── authcontroller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── socketAuth.js
│   ├── models/
│   │   ├── User.js
│   │   └── MessageModel.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   └── user.js
│   ├── uploads/ (created automatically)
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── UserList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)
- `JWT_SECRET` - Secret key for JWT tokens
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB is accessible on the specified port

2. **Socket.IO Connection Issues**
   - Check if backend server is running
   - Verify CORS settings
   - Ensure token is properly set in localStorage

3. **File Upload Issues**
   - Check uploads directory permissions
   - Verify file size limits
   - Ensure supported file types

4. **Authentication Issues**
   - Check JWT_SECRET in environment variables
   - Verify token expiration
   - Clear localStorage if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Message encryption
- [ ] Group chats
- [ ] Voice messages
- [ ] Video calls
- [ ] Message reactions
- [ ] Push notifications
- [ ] Dark mode
- [ ] Message search
- [ ] User presence indicators
- [ ] Message read receipts
