#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function checkSupabaseSettings() {
  console.log('🔍 Checking Supabase Configuration Issues...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing environment variables!')
    return
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  console.log('📋 DIAGNOSIS CHECKLIST:')
  console.log('═══════════════════════\n')
  
  // Check 1: Basic connectivity
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (error) {
      console.log('❌ 1. Database Connection: FAILED')
      console.log('   Error:', error.message)
    } else {
      console.log('✅ 1. Database Connection: OK')
    }
  } catch (err) {
    console.log('❌ 1. Database Connection: FAILED')
    console.log('   Error:', err.message)
  }
  
  // Check 2: Auth settings
  console.log('\n📧 2. Email Confirmation Settings:')
  console.log('   The "Database error saving new user" often means:')
  console.log('   - Email confirmation is ENABLED in Supabase')
  console.log('   - But email delivery is not configured properly')
  
  console.log('\n🔧 SOLUTION STEPS:')
  console.log('═════════════════════')
  console.log('1. Go to your Supabase Dashboard')
  console.log('2. Navigate to: Authentication > Settings')
  console.log('3. Find "Email Confirmation" section')
  console.log('4. DISABLE "Enable email confirmations"')
  console.log('5. Click "Save"')
  console.log('6. Try creating admin account again')
  
  console.log('\n🌐 Dashboard URL:')
  const projectRef = supabaseUrl.split('//')[1].split('.')[0]
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/auth/users`)
  
  console.log('\n💡 Alternative: Set up email provider')
  console.log('   If you want email confirmation enabled:')
  console.log('   - Configure SMTP settings in Authentication > Settings')
  console.log('   - Or use a service like SendGrid, Resend, etc.')
  
  console.log('\n🎯 After disabling email confirmation:')
  console.log('   - Users will be automatically confirmed')
  console.log('   - No email verification required')
  console.log('   - Your admin creation should work')
}

checkSupabaseSettings()