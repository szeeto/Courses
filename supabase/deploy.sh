#!/bin/bash

# Deploy all Supabase Edge Functions

echo "🚀 Deploying Supabase Edge Functions..."

# Auth functions
echo "📝 Deploying auth functions..."
~/bin/supabase functions deploy auth-register
~/bin/supabase functions deploy auth-login
~/bin/supabase functions deploy auth-profile

# API functions
echo "🔗 Deploying API functions..."
~/bin/supabase functions deploy api-courses

# Admin functions
echo "👑 Deploying admin functions..."
~/bin/supabase functions deploy admin-users

echo "✅ All functions deployed successfully!"
echo ""
echo "📋 Function URLs:"
echo "- Register: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-register"
echo "- Login: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-login"
echo "- Profile: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-profile"
echo "- Courses: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/api-courses"
echo "- Admin Users: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/admin-users"