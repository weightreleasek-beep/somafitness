#!/usr/bin/env bash
set -o errexit

# Install Node.js if not available
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>/dev/null || true
    apt-get install -y nodejs 2>/dev/null || true
fi

# If still no node, use nvm
if ! command -v node &> /dev/null; then
    echo "Installing Node.js via nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
fi

echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

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
