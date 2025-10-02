#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
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

const askPassword = (question) => {
  return new Promise((resolve) => {
    const stdin = process.stdin
    const stdout = process.stdout
    
    stdout.write(question)
    stdin.setRawMode(true)
    stdin.resume()
    
    let password = ''
    
    const onData = (char) => {
      char = char.toString()
      
      switch (char) {
        case '\n':
        case '\r':
          stdin.setRawMode(false)
          stdin.pause()
          stdin.removeListener('data', onData)
          stdout.write('\n')
          resolve(password)
          break
        case '\u0003':
          process.exit()
          break
        case '\u007f':
          if (password.length > 0) {
            password = password.slice(0, -1)
            stdout.write('\b \b')
          }
          break
        default:
          password += char
          stdout.write('*')
          break
      }
    }
    
    stdin.on('data', onData)
  })
}

async function debugCreate() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('🔧 DEBUG: Manual Admin Creation')
    console.log('===============================\n')

    const email = await askQuestion('📧 Email: ')
    const password = await askPassword('🔒 Password: ')

    console.log('\n🔄 Step 1: Creating auth user...')

    // Try creating user without metadata first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password
    })

    if (authError) {
      console.error('❌ Auth Error:', authError.message)
      console.error('Full error:', JSON.stringify(authError, null, 2))
      process.exit(1)
    }

    console.log('✅ Auth user created!')
    console.log('User ID:', authData.user?.id)

    if (authData.user) {
      console.log('\n🔄 Step 2: Creating profile manually...')
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email.trim(),
          first_name: 'Admin',
          last_name: 'User',
          phone: '0000000000',
          role: 'admin',
          status: 'active'
        })
        .select()

      if (profileError) {
        console.error('❌ Profile Error:', profileError.message)
        console.error('Full error:', JSON.stringify(profileError, null, 2))
        
        // Try to check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          
        if (existingProfile && existingProfile.length > 0) {
          console.log('✅ Profile already exists (created by trigger)!')
          console.log('Profile data:', existingProfile[0])
        }
      } else {
        console.log('✅ Profile created manually!')
        console.log('Profile data:', profileData)
      }

      console.log('\n🎉 SUCCESS!')
      console.log(`📧 Email: ${email}`)
      console.log(`🆔 User ID: ${authData.user.id}`)
      console.log('\n🚀 You can now login at: http://localhost:3000/login')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    rl.close()
  }
}

debugCreate()