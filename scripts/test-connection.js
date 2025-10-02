#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n')
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing environment variables!')
    console.log('Make sure .env.local has:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL')
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return
  }
  
  console.log('✅ Environment variables found')
  console.log(`📡 URL: ${supabaseUrl}`)
  console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...`)
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Test basic connection
    console.log('\n🔄 Testing database connection...')
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Database Error:', error.message)
      
      if (error.message.includes('relation "public.profiles" does not exist')) {
        console.log('\n💡 Solution: The database schema needs to be deployed!')
        console.log('Run the SQL schema in your Supabase SQL Editor.')
      }
    } else {
      console.log('✅ Database connection successful!')
      console.log('✅ profiles table exists and is accessible')
    }
    
    // Test auth
    console.log('\n🔄 Testing authentication...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('❌ Auth Error:', authError.message)
    } else {
      console.log('✅ Authentication service accessible')
    }
    
    console.log('\n🎯 Connection test complete!')
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

testConnection()