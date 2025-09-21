# Testing Your Chat Application

## Quick Test Steps

### 1. Start the Application

```bash
# Terminal 1 - Start MongoDB
sudo systemctl start mongod

# Terminal 2 - Start Backend
cd backend
npm run dev

# Terminal 3 - Start Frontend  
cd frontend
npm run dev
```

### 2. Test User Registration and Login

1. Open http://localhost:5173 in your browser
2. Create two test accounts:
   - **User 1**: name="John Doe", username="john", email="john@test.com", password="123456"
   - **User 2**: name="Jane Smith", username="jane", email="jane@test.com", password="123456"

### 3. Test Real-time Chat

1. **Open two browser windows/tabs:**
   - Tab 1: Login as John
   - Tab 2: Login as Jane

2. **In John's window:**
   - Search for "jane" in the search box
   - Click on Jane to start a chat
   - Send a message: "Hello Jane!"

3. **In Jane's window:**
   - You should see the message appear instantly
   - Reply: "Hi John! How are you?"

4. **Verify both users can see the conversation in real-time**

### 4. Test File Sharing

1. **In either chat window:**
   - Click the paperclip icon to upload a file
   - Select an image or video file (under 10MB)
   - Send the message

2. **Verify:**
   - File appears in both chat windows
   - Images show as thumbnails
   - Videos show with controls
   - Files are clickable/downloadable

### 5. Check Database Storage

```bash
# Connect to MongoDB
mongosh chat-app

# Check users collection
db.users.find()

# Check messages collection  
db.messages.find()
```

## Troubleshooting

### If Socket.IO Connection Fails:

1. **Check browser console for errors**
2. **Verify backend is running on port 3000**
3. **Check if JWT_SECRET is set in .env file**
4. **Make sure MongoDB is running**

### If Messages Don't Appear:

1. **Check browser network tab for API errors**
2. **Verify both users are online (green dot)**
3. **Check backend console for Socket.IO logs**

### If File Upload Fails:

1. **Check uploads directory exists: `backend/uploads/`**
2. **Verify file size is under 10MB**
3. **Check file type is supported (images/videos)**

## Expected Behavior

✅ **Real-time messaging works instantly**  
✅ **Messages are stored in database**  
✅ **File uploads work and display properly**  
✅ **User search finds other users**  
✅ **Online status updates correctly**  
✅ **Messages persist between sessions**

## Console Logs to Watch

**Backend console should show:**
```
MongoDB connected
Server on 3000
User 64f7a1b2c3d4e5f6g7h8i9j0 connected
Received message: { to: '...', text: 'Hello Jane!' }
Message saved to DB: { ... }
Message sent to user ... from user ...
```

**Frontend console should show:**
```
Connected to server with socket ID: abc123
Sending message to: 64f7a1b2c3d4e5f6g7h8i9j0 Text: Hello Jane! Attachments: []
Received private message: { ... }
```

If you see these logs, your chat application is working correctly!
