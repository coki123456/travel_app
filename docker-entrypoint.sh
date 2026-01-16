#!/bin/sh
set -e

echo "🔄 Running database migrations..."
node_modules/.bin/prisma migrate deploy

echo "✅ Migrations completed"
echo "🚀 Starting Next.js server..."

exec node server.js
