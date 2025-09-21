#!/bin/bash

echo "🚀 Setting up MERN Chat Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: sudo systemctl start mongod"
    echo "   Or run: mongod"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Create uploads directory
echo "📁 Creating uploads directory..."
cd ../backend
mkdir -p uploads

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOF
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
MONGO_URI=mongodb://127.0.0.1:27017/chat-app
PORT=3000
FRONTEND_URL=http://localhost:5173
EOF
    echo "✅ .env file created. Please update JWT_SECRET with a secure value."
fi

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start MongoDB: sudo systemctl start mongod"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
