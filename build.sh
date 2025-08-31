#!/bin/bash

echo "🚀 Starting build process..."

# Install dependencies for both frontend and backend
echo "📦 Installing dependencies..."
npm run install

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
