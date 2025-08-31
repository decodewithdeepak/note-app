#!/bin/bash

echo "🚀 Starting build process..."

# Install root dependencies first
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Build frontend first
echo "🔨 Building frontend..."
cd frontend 
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
echo "✅ Frontend build complete"
cd ..

# Build backend
echo "🔨 Building backend..."
cd backend 
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi
echo "✅ Backend build complete"
cd ..

# Create public directory and copy frontend build
echo "📁 Copying frontend build to backend..."
mkdir -p backend/dist/public
if [ -d "frontend/dist" ]; then
    cp -r frontend/dist/* backend/dist/public/ 2>/dev/null || true
    echo "✅ Frontend copied to backend/dist/public"
else
    echo "⚠️  Frontend dist folder not found"
fi

# Verify build files exist
if [ -f "backend/dist/server.js" ]; then
    echo "✅ Backend server.js found"
else
    echo "❌ Backend server.js NOT found - build failed"
    ls -la backend/dist/
    exit 1
fi

echo "✅ Build completed successfully!"
