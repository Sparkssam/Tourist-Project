#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function tryDifferentEmail() {
  console.log('🎯 Let\'s try creating admin with a different email...\n')
  
  const testEmails = [
    'admin@kekeosafaris.com',
    'samwel.admin@kekeosafaris.com',
    'superadmin@kekeosafaris.com',
    'admin.samwel@gmail.com'
  ]
  
  console.log('🔍 Checking available email addresses:\n')
  
  for (const email of testEmails) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
      
      if (!error && (!data || data.length === 0)) {
        console.log(`✅ ${email} - Available`)
      } else {
        console.log(`❌ ${email} - Already exists`)
      }
    } catch (err) {
      console.log(`❓ ${email} - Could not check`)
    }
  }
  
  console.log('\n💡 Recommendation: Use one of the available emails above')
  console.log('   for creating your super admin account.\n')
  
  console.log('🔄 Now run: npm run create-admin')
  console.log('   And use an available email when prompted.')
}

tryDifferentEmail()