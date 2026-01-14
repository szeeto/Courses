#!/bin/bash

# Deploy all Supabase Edge Functions

echo "🚀 Deploying Supabase Edge Functions..."

# Auth functions
echo "📝 Deploying auth functions..."
supabase functions deploy auth-register
supabase functions deploy auth-login
supabase functions deploy auth-admin-login
supabase functions deploy auth-logout
supabase functions deploy auth-profile

# API functions
echo "🔗 Deploying API functions..."
supabase functions deploy api-courses

# Admin functions
echo "👑 Deploying admin functions..."
supabase functions deploy admin-users

echo "✅ All functions deployed successfully!"
echo ""
echo "📋 Function URLs:"
echo "- Register: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-register"
echo "- Login: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-login"
echo "- Admin Login: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-admin-login"
echo "- Logout: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-logout"
echo "- Profile: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/auth-profile"
echo "- Courses: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/api-courses"
echo "- Admin Users: https://xuzqgxffbnpiezlkxmsv.supabase.co/functions/v1/admin-users"