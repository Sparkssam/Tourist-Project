# PowerShell script to add Pesapal credentials to Vercel
# Run this after installing Vercel CLI: npm install -g vercel

Write-Host "🚀 Adding Pesapal credentials to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Login to Vercel
Write-Host "🔐 Logging in to Vercel..." -ForegroundColor Cyan
vercel login

Write-Host "`n📝 Adding environment variables..." -ForegroundColor Cyan

# PESAPAL_CONSUMER_KEY
Write-Host "Adding PESAPAL_CONSUMER_KEY..." -ForegroundColor White
"dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk" | vercel env add PESAPAL_CONSUMER_KEY production
"dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk" | vercel env add PESAPAL_CONSUMER_KEY preview
"dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk" | vercel env add PESAPAL_CONSUMER_KEY development

# PESAPAL_CONSUMER_SECRET
Write-Host "Adding PESAPAL_CONSUMER_SECRET..." -ForegroundColor White
"/6P0u8YouUHngXCrrh7Oe9he+Mk=" | vercel env add PESAPAL_CONSUMER_SECRET production
"/6P0u8YouUHngXCrrh7Oe9he+Mk=" | vercel env add PESAPAL_CONSUMER_SECRET preview
"/6P0u8YouUHngXCrrh7Oe9he+Mk=" | vercel env add PESAPAL_CONSUMER_SECRET development

# PESAPAL_BASE_URL
Write-Host "Adding PESAPAL_BASE_URL..." -ForegroundColor White
"https://cybqa.pesapal.com/pesapalv3" | vercel env add PESAPAL_BASE_URL production
"https://cybqa.pesapal.com/pesapalv3" | vercel env add PESAPAL_BASE_URL preview
"https://cybqa.pesapal.com/pesapalv3" | vercel env add PESAPAL_BASE_URL development

# NEXT_PUBLIC_SITE_URL
Write-Host "Adding NEXT_PUBLIC_SITE_URL..." -ForegroundColor White
"https://tourist-project-eight.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL production
"https://tourist-project-eight.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL preview
"https://tourist-project-eight.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL development

Write-Host "`n✅ All environment variables added!" -ForegroundColor Green
Write-Host "🔄 Redeploying your project..." -ForegroundColor Cyan

vercel --prod

Write-Host "`n🎉 Done! Your Pesapal integration should now work." -ForegroundColor Green
Write-Host "Visit: https://tourist-project-eight.vercel.app" -ForegroundColor Cyan
