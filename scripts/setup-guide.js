#!/usr/bin/env node

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function setupGuide() {
  console.log('\n🦁 KEKEO SAFARIS - Setup Guide')
  console.log('===============================================\n')

  console.log('Welcome! Let\'s set up your Kekeo Safaris admin system.\n')
  
  console.log('📋 SETUP CHECKLIST:')
  console.log('═══════════════════\n')
  
  console.log('1. ✅ Node.js and dependencies installed')
  console.log('2. ❓ Supabase project setup')
  console.log('3. ❓ Environment variables configured')
  console.log('4. ❓ Database schema deployed')
  console.log('5. ❓ Super admin account created\n')

  const hasSupabase = await askQuestion('❓ Do you have a Supabase account and project? (y/N): ')
  
  if (hasSupabase.toLowerCase() !== 'y') {
    console.log('\n📝 STEP 1: Create Supabase Project')
    console.log('═════════════════════════════════')
    console.log('1. Go to https://supabase.com')
    console.log('2. Sign up for a free account')
    console.log('3. Create a new project')
    console.log('4. Wait for the project to be ready (2-3 minutes)')
    console.log('5. Go to Settings > API in your project dashboard')
    console.log('6. Copy your Project URL and anon/public API key\n')
    
    await askQuestion('Press Enter when you have created your Supabase project and have the credentials...')
  }

  console.log('\n📋 STEP 2: Configure Environment Variables')
  console.log('═══════════════════════════════════════════')
  console.log('I need your Supabase project credentials:\n')

  const supabaseUrl = await askQuestion('🔗 Supabase Project URL (https://xxx.supabase.co): ')
  const supabaseKey = await askQuestion('🔑 Supabase Anon/Public Key: ')
  const customSecret = await askQuestion('🛡️  Custom Super Admin Secret (or press Enter for default): ')
  
  const secretKey = customSecret.trim() || 'kekeo_safari_super_admin_2024_secret_key'

  // Create/update .env.local file
  const fs = require('fs')
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl.trim()}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey.trim()}

# Super Admin Registration Secret
SUPER_ADMIN_SECRET=${secretKey}

# Optional: Add service role key later if needed
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
`

  fs.writeFileSync('.env.local', envContent)
  console.log('\n✅ Environment variables saved to .env.local')

  console.log('\n🗄️  STEP 3: Set Up Database')
  console.log('═══════════════════════════════')
  console.log('Now you need to set up the database tables:')
  console.log('1. Go to your Supabase project dashboard')
  console.log('2. Click on "SQL Editor" in the sidebar')
  console.log('3. Copy the entire content from supabase-schema.sql')
  console.log('4. Paste it into the SQL Editor and click "Run"')
  console.log('5. Wait for all commands to execute successfully\n')
  
  console.log('📄 The SQL file is located at: supabase-schema.sql')
  console.log('💡 You can open it in VS Code and copy all the content\n')

  await askQuestion('Press Enter when you have run the database schema in Supabase...')

  console.log('\n👑 STEP 4: Create Super Admin')
  console.log('═══════════════════════════════')
  console.log('Now let\'s create your admin account:\n')

  console.log('Run this command to create your super admin:')
  console.log('👉 npm run create-super-admin\n')
  
  console.log('You will need:')
  console.log(`🔑 Secret Key: ${secretKey}`)
  console.log('📧 Your admin email address')
  console.log('🔒 A strong password (min 8 characters)')
  console.log('👤 Your name and phone number\n')

  console.log('🎯 FINAL STEPS:')
  console.log('═══════════════')
  console.log('1. Run: npm run create-super-admin')
  console.log('2. Start your app: npm run dev')
  console.log('3. Login at: http://localhost:3000/login')
  console.log('4. Access admin dashboard: http://localhost:3000/admin\n')

  console.log('✨ You\'re all set! Your Kekeo Safaris system will be ready to use.\n')

  rl.close()
}

setupGuide().catch(console.error)