#!/bin/bash
# Run on Ubuntu VPS after uploading project folder
set -e
cd "$(dirname "$0")"

if ! command -v docker >/dev/null 2>&1; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER" 2>/dev/null || true
  echo "Log out and back in if docker permission denied, then run this script again."
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env - edit ADMIN_PASSWORD and JWT_SECRET before going live:"
  echo "  nano .env"
  exit 1
fi

# Ensure production port
if ! grep -q '^HTTP_PORT=80' .env; then
  if grep -q '^HTTP_PORT=' .env; then
    sed -i 's/^HTTP_PORT=.*/HTTP_PORT=80/' .env
  else
    echo 'HTTP_PORT=80' >> .env
  fi
fi

echo "Building and starting..."
docker compose up -d --build

echo "Seeding sample data (first time)..."
docker compose exec -T api python seed_data.py || true

if command -v ufw >/dev/null 2>&1; then
  sudo ufw allow 22/tcp 2>/dev/null || true
  sudo ufw allow 80/tcp 2>/dev/null || true
  echo "y" | sudo ufw enable 2>/dev/null || true
fi

IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || hostname -I | awk '{print $1}')
echo ""
echo "Done."
echo "  Site:  http://${IP}"
echo "  Admin: http://${IP}/admin/login"
echo "  Check: docker compose ps"
