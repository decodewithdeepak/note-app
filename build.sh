#!/bin/bash

echo "🚀 Starting build process..."

# Install dependencies for both frontend and backend
echo "📦 Installing dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Build frontend
echo "🔨 Building frontend..."
cd frontend && npm run build && cd ..

# Build backend
echo "🔨 Building backend..."
cd backend && npm run build && cd ..

# Copy frontend build to backend public folder
echo "📁 Copying frontend build..."
mkdir -p backend/dist/public
cp -r frontend/dist/* backend/dist/public/ 2>/dev/null || true

echo "✅ Build completed successfully!"
