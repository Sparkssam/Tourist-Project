#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkEmail() {
  console.log('🔍 Checking if samwelmsuya10@gmail.com already exists...\n')
  
  try {
    // Check if email exists in profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'samwelmsuya10@gmail.com')
    
    if (profileError) {
      console.log('❌ Error checking profiles:', profileError.message)
    } else if (profiles && profiles.length > 0) {
      console.log('❌ Email already exists in profiles table!')
      console.log('📋 Existing user details:')
      profiles.forEach(profile => {
        console.log(`   - ID: ${profile.id}`)
        console.log(`   - Name: ${profile.first_name} ${profile.last_name}`)
        console.log(`   - Role: ${profile.role}`)
        console.log(`   - Status: ${profile.status}`)
        console.log(`   - Created: ${profile.created_at}`)
      })
      console.log('\n💡 Solution: Use a different email address or delete this user first.')
    } else {
      console.log('✅ Email is available - not found in profiles table')
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

checkEmail()