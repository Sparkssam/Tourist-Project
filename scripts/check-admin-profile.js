#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function checkAdminProfile() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🔍 Checking Admin Profile Status...\n')

  try {
    // Check profiles table
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')

    if (error) {
      console.log('❌ Error fetching profiles:', error.message)
      return
    }

    if (!profiles || profiles.length === 0) {
      console.log('❌ NO ADMIN PROFILE FOUND!')
      console.log('\n💡 This is why login is hanging!')
      console.log('   The user was created in auth.users but NOT in profiles table.')
      console.log('\n🔧 FIX: Run this SQL in Supabase SQL Editor:')
      console.log(`
-- First, check auth.users to get the user ID:
SELECT id, email, created_at FROM auth.users WHERE email LIKE '%admin%';

-- Then create the profile (replace USER_ID with actual ID):
INSERT INTO public.profiles (id, email, first_name, last_name, phone, role, status)
VALUES (
  'USER_ID_HERE'::uuid,
  'admin@kekeosafaris.com',
  'Admin',
  'User',
  '0000000000',
  'admin',
  'active'
);
      `)
    } else {
      console.log('✅ ADMIN PROFILE FOUND!')
      console.log('═══════════════════════════════\n')
      profiles.forEach(profile => {
        console.log(`👤 Name: ${profile.first_name} ${profile.last_name}`)
        console.log(`📧 Email: ${profile.email}`)
        console.log(`🆔 ID: ${profile.id}`)
        console.log(`🔐 Role: ${profile.role}`)
        console.log(`✅ Status: ${profile.status}`)
        console.log(`📅 Created: ${profile.created_at}`)
        console.log(`📱 Phone: ${profile.phone || 'N/A'}`)
        console.log('')
      })
      
      console.log('\n🎯 Login should work now!')
      console.log('   Go to: http://localhost:3000/login')
      console.log(`   Email: ${profiles[0].email}`)
      console.log('   Password: [the password you set]')
    }

  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

checkAdminProfile()