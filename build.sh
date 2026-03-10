#!/usr/bin/env bash
set -o errexit

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Build frontend
cd ../frontend
npm install
REACT_APP_API_URL="" npm run build

# Copy React build to backend/static for serving
rm -rf ../backend/static
cp -r build ../backend/static

echo "Build complete!"
