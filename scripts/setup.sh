#!/usr/bin/env bash
set -euo pipefail

echo "🚀 SportPulse AI — Project Setup"
echo "================================="

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Install Node.js 20+" && exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20+ required (found v$NODE_VERSION)" && exit 1
fi
echo "✅ Node.js $(node -v)"

# Check Docker
if ! command -v docker &>/dev/null; then
  echo "❌ Docker not found. Install Docker Desktop" && exit 1
fi
echo "✅ Docker $(docker -v | cut -d' ' -f3 | tr -d ',')"

# Copy env
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
  echo "⚠️  Please edit .env and fill in your API keys before continuing"
else
  echo "ℹ️  .env already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Start infrastructure
echo ""
echo "🐳 Starting infrastructure (Postgres, Redis, Elasticsearch)..."
docker compose up postgres redis elasticsearch -d

echo ""
echo "⏳ Waiting for Postgres..."
until docker compose exec postgres pg_isready -U sportpulse &>/dev/null; do
  sleep 1
done
echo "✅ Postgres ready"

# Database setup
echo ""
echo "🗄️  Running database migrations..."
cd apps/api
npx prisma generate
npx prisma db push
cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Run 'npm run dev' to start the development servers:"
echo "  - Web: http://localhost:3000"
echo "  - API: http://localhost:3001"
echo "  - API Docs: http://localhost:3001/docs"
