# 🚀 Deployment Checklist

## Pre-Deployment Setup

### Backend (.env file)
```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com
CLIENT_URL=https://your-backend-domain.com
```

### Frontend (.env file)
```env
VITE_API_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
```

## Deployment Steps

### Backend Deployment
1. ✅ Set up MongoDB database (MongoDB Atlas recommended)
2. ✅ Configure environment variables
3. ✅ Deploy to hosting platform (Railway, Render, Heroku, etc.)
4. ✅ Test API endpoints
5. ✅ Verify file upload functionality

### Frontend Deployment
1. ✅ Update .env with production backend URL
2. ✅ Run `npm run build:prod`
3. ✅ Deploy `dist` folder to hosting platform (Vercel, Netlify, etc.)
4. ✅ Test frontend connection to backend
5. ✅ Verify chat functionality

## Post-Deployment Testing

### Backend Tests
- [ ] API endpoints responding
- [ ] Database connection working
- [ ] File uploads working
- [ ] Socket.io connections working
- [ ] CORS configured correctly

### Frontend Tests
- [ ] App loads without errors
- [ ] Login/signup working
- [ ] Chat interface functional
- [ ] File uploads working
- [ ] Profile management working

## Security Checklist
- [ ] JWT secret is strong and unique
- [ ] CORS only allows your frontend domain
- [ ] File uploads have proper validation
- [ ] Environment variables not in code
- [ ] HTTPS enabled in production

## Common Issues & Solutions

### CORS Errors
- Check FRONTEND_URL in backend .env
- Verify CORS configuration in backend

### Database Connection
- Verify MONGO_URI is correct
- Check database permissions

### File Upload Issues
- Ensure uploads directory exists
- Check file size limits
- Verify file type validation

### Socket Connection Issues
- Check VITE_SOCKET_URL in frontend
- Verify WebSocket support on hosting platform
