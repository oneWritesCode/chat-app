# Chat App Deployment Guide

## Backend Deployment

### 1. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URI=your-mongodb-connection-string

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3000

# Frontend URLs (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
CLIENT_URL=https://your-backend-domain.com
```

### 2. Backend Deployment Steps
1. Install dependencies: `npm install`
2. Set up your MongoDB database
3. Configure environment variables
4. Start the server: `npm run prod`

## Frontend Deployment

### 1. Environment Variables
Create a `.env` file in the frontend directory with the following variables:

```env
# Replace with your deployed backend URL
VITE_API_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
```

### 2. Frontend Deployment Steps
1. Install dependencies: `npm install`
2. Configure environment variables
3. Build for production: `npm run build`
4. Deploy the `dist` folder to your hosting service

## Production Checklist

### Backend
- [ ] MongoDB database configured
- [ ] Environment variables set
- [ ] CORS configured for production domains
- [ ] File upload directory exists and is writable
- [ ] JWT secret is strong and secure

### Frontend
- [ ] Environment variables point to production backend
- [ ] Build completed successfully
- [ ] Static files served correctly

## Common Deployment Platforms

### Backend
- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **Heroku**: Popular platform
- **DigitalOcean**: VPS deployment
- **AWS**: EC2 or Elastic Beanstalk

### Frontend
- **Vercel**: Excellent for React/Vite apps
- **Netlify**: Great for static sites
- **GitHub Pages**: Free hosting
- **Firebase Hosting**: Google's platform

## Security Considerations

1. **JWT Secret**: Use a strong, random secret
2. **CORS**: Only allow your frontend domain
3. **File Uploads**: Implement file type and size validation
4. **Environment Variables**: Never commit .env files
5. **HTTPS**: Always use HTTPS in production

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check CORS configuration and frontend URL
2. **Database Connection**: Verify MongoDB URI
3. **File Uploads**: Ensure uploads directory exists
4. **Socket Connection**: Check WebSocket support on hosting platform

### Debug Steps
1. Check server logs for errors
2. Verify environment variables
3. Test API endpoints
4. Check browser console for frontend errors
