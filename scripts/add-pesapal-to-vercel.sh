#!/usr/bin/env bash
# Script to add Pesapal environment variables to Vercel
# Run this from your project directory after installing Vercel CLI

echo "🚀 Adding Pesapal credentials to Vercel..."

# Install Vercel CLI if not already installed
# npm install -g vercel

# Login to Vercel
vercel login

# Add environment variables
echo "Adding PESAPAL_CONSUMER_KEY..."
echo "dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk" | vercel env add PESAPAL_CONSUMER_KEY production
echo "dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk" | vercel env add PESAPAL_CONSUMER_KEY preview
echo "dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk" | vercel env add PESAPAL_CONSUMER_KEY development

echo "Adding PESAPAL_CONSUMER_SECRET..."
echo "/6P0u8YouUHngXCrrh7Oe9he+Mk=" | vercel env add PESAPAL_CONSUMER_SECRET production
echo "/6P0u8YouUHngXCrrh7Oe9he+Mk=" | vercel env add PESAPAL_CONSUMER_SECRET preview
echo "/6P0u8YouUHngXCrrh7Oe9he+Mk=" | vercel env add PESAPAL_CONSUMER_SECRET development

echo "Adding PESAPAL_BASE_URL..."
echo "https://cybqa.pesapal.com/pesapalv3" | vercel env add PESAPAL_BASE_URL production
echo "https://cybqa.pesapal.com/pesapalv3" | vercel env add PESAPAL_BASE_URL preview
echo "https://cybqa.pesapal.com/pesapalv3" | vercel env add PESAPAL_BASE_URL development

echo "Adding NEXT_PUBLIC_SITE_URL..."
echo "https://tourist-project-eight.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL production
echo "https://tourist-project-eight.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL preview
echo "https://tourist-project-eight.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL development

echo "✅ All environment variables added!"
echo "🔄 Redeploying your project..."
vercel --prod

echo "🎉 Done! Your Pesapal integration should now work."
