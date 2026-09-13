#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this as root: sudo bash setup-hetzner.sh"
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl ufw

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "Docker is ready. Copy the project here, create .env, then run:"
echo "  docker compose up -d --build"
