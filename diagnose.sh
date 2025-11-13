#!/bin/bash
# Quick diagnostic to identify backend crash reason

echo "🔍 Diagnosing backend crash..."
echo ""

# Step 1: Check MySQL
echo "1️⃣  Checking MySQL connection..."


# Step 2: Check port 4000
echo ""
echo "2️⃣  Checking if port 4000 is available..."
netstat -ano | grep ":4000" || echo "✅ Port 4000 is free"

# Step 3: Check environment variables
echo ""
echo "3️⃣  Checking .env file..."
if [ -f ".env" ]; then
  echo "✅ .env exists"
  grep "GOOGLE_CLIENT_ID\|DB_HOST\|PORT" .env | head -3
else
  echo "❌ .env file missing!"
fi

# Step 4: Check backend dependencies
echo ""
echo "4️⃣  Checking backend dependencies..."
cd backend 2>/dev/null && npm list --depth=0 2>&1 | head -8

# Step 5: Run server with verbose logging
echo ""
echo "5️⃣  Starting backend server..."
cd .. 2>/dev/null
cd backend && node server.js
