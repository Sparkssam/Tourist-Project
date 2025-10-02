#!/usr/bin/env node

console.log('🔑 Your Super Admin Secret Key is:\n')
console.log('kekeo_safari_super_admin_2024_secret_key')
console.log('\nCopy the line above (without quotes) when prompted.\n')

// Load environment
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
        case '\u0003': // Ctrl+C
          process.exit()
          break
        case '\u007f': // Backspace
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

async function createAdmin() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const superAdminSecret = process.env.SUPER_ADMIN_SECRET

    if (!supabaseUrl || !supabaseKey || !superAdminSecret) {
      console.log('❌ Missing environment variables!')
      process.exit(1)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('\n🦁 KEKEO SAFARIS - Quick Super Admin Creation')
    console.log('===============================================\n')

    // Get secret key
    const secretKey = await askQuestion('🔑 Enter Secret Key: ')
    
    if (secretKey.trim() !== superAdminSecret.trim()) {
      console.log('❌ Invalid secret key!')
      console.log('💡 Expected: kekeo_safari_super_admin_2024_secret_key')
      process.exit(1)
    }

    console.log('✅ Secret verified!\n')

    // Get user details with defaults
    const firstName = await askQuestion('👤 First Name [Samwel]: ') || 'Samwel'
    const lastName = await askQuestion('👤 Last Name [Msuya]: ') || 'Msuya'
    const email = await askQuestion('📧 Email [samwelmsuya10@gmail.com]: ') || 'samwelmsuya10@gmail.com'
    const phone = await askQuestion('📱 Phone [0760309999]: ') || '0760309999'
    
    const password = await askPassword('🔒 Password (min 8 chars): ')

    if (password.length < 8) {
      console.log('❌ Password too short!')
      process.exit(1)
    }

    console.log('\n🔄 Creating admin account...')

    // Create user with minimal data first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          role: 'admin'
        }
      }
    })

    if (authError) {
      console.error('❌ Error:', authError.message)
      
      if (authError.message.includes('User already registered')) {
        console.log('💡 Try a different email or check if user exists')
      }
      
      process.exit(1)
    }

    console.log('✅ Account created!')

    if (authData.user) {
      console.log('⏳ Setting up profile...')
      
      // Wait for trigger
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Ensure admin role
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: email.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          role: 'admin',
          status: 'active'
        })

      if (updateError) {
        console.log('⚠️  Profile update warning:', updateError.message)
      } else {
        console.log('✅ Profile configured!')
      }

      console.log('\n🎉 SUCCESS! Super Admin Created!')
      console.log('================================')
      console.log(`👤 ${firstName} ${lastName}`)
      console.log(`📧 ${email}`)
      console.log(`📱 ${phone}`)
      console.log(`🔐 Role: Admin`)
      console.log(`🆔 ID: ${authData.user.id}`)
      
      console.log('\n🚀 Next Steps:')
      console.log('1. Start your app: npm run dev')
      console.log('2. Go to: http://localhost:3000/login')
      console.log(`3. Login with: ${email}`)
      console.log('4. Access admin dashboard: http://localhost:3000/admin')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  } finally {
    rl.close()
  }
}

createAdmin()