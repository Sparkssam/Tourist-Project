#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')
require('dotenv').config({ path: '.env.local' })

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Function to ask questions
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

// Function to ask for password (hidden input)
const askPassword = (question) => {
  return new Promise((resolve) => {
    process.stdout.write(question)
    process.stdin.setRawMode(true)
    process.stdin.resume()
    
    let password = ''
    process.stdin.on('data', (char) => {
      char = char.toString()
      
      if (char === '\r' || char === '\n') {
        process.stdin.setRawMode(false)
        process.stdin.pause()
        process.stdout.write('\n')
        resolve(password)
      } else if (char === '\u0003') {
        // Ctrl+C
        process.stdout.write('\n')
        process.exit()
      } else if (char === '\u007f') {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1)
          process.stdout.write('\b \b')
        }
      } else {
        password += char
        process.stdout.write('*')
      }
    })
  })
}

async function createSuperAdmin() {
  console.log('\n🦁 KEKEO SAFARIS - Super Admin Creation Tool\n')
  console.log('===============================================\n')

  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const superAdminSecret = process.env.SUPER_ADMIN_SECRET

    if (!supabaseUrl || !supabaseKey || !superAdminSecret) {
      console.error('❌ Error: Missing required environment variables!')
      console.error('Please ensure you have set:')
      console.error('- NEXT_PUBLIC_SUPABASE_URL')
      console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY') 
      console.error('- SUPER_ADMIN_SECRET')
      console.error('in your .env.local file\n')
      process.exit(1)
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if any admin users already exist
    console.log('🔍 Checking for existing admin users...')
    const { data: existingAdmins, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkError) {
      console.error('❌ Database error:', checkError.message)
      console.error('Make sure you have run the database schema in Supabase!')
      process.exit(1)
    }

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('❌ Error: Super admin already exists!')
      console.log('Contact existing admin to create new accounts.\n')
      process.exit(1)
    }

    console.log('✅ No existing admin found. Proceeding with super admin creation...\n')

    // Get super admin secret
    const secretKey = await askQuestion('🔑 Enter Super Admin Secret Key: ')
    
    if (secretKey !== superAdminSecret) {
      console.log('❌ Error: Invalid super admin secret key!')
      process.exit(1)
    }

    console.log('✅ Secret key verified!\n')

    // Get user details
    console.log('📝 Please provide the super admin details:\n')
    
    const firstName = await askQuestion('👤 First Name: ')
    const lastName = await askQuestion('👤 Last Name: ')
    const email = await askQuestion('📧 Email Address: ')
    const phone = await askQuestion('📱 Phone Number (optional): ')
    
    const password = await askPassword('🔒 Password (min 8 characters): ')
    const confirmPassword = await askPassword('🔒 Confirm Password: ')

    // Validate input
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      console.log('❌ Error: First name, last name, and email are required!')
      process.exit(1)
    }

    if (password.length < 8) {
      console.log('❌ Error: Password must be at least 8 characters long!')
      process.exit(1)
    }

    if (password !== confirmPassword) {
      console.log('❌ Error: Passwords do not match!')
      process.exit(1)
    }

    // Create the super admin user
    console.log('\n🔄 Creating super admin account...')
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim() || null,
          role: 'admin'
        }
      }
    })

    if (authError) {
      console.error('❌ Authentication error:', authError.message)
      
      // More detailed error handling
      if (authError.message.includes('User already registered')) {
        console.log('💡 This email is already registered. Try using a different email.')
      } else if (authError.message.includes('Database error')) {
        console.log('💡 Database connection issue. Make sure:')
        console.log('   - Your Supabase project is active')
        console.log('   - The database schema has been deployed')
        console.log('   - Your internet connection is stable')
      }
      
      process.exit(1)
    }

    console.log('✅ User account created successfully!')

    if (authData.user) {
      // Wait a moment for the trigger to process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Verify the profile was created and update role if needed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('⚠️  Warning: Could not update admin role:', profileError.message)
      }

      console.log('\n✅ SUCCESS! Super admin created successfully!')
      console.log('===============================================')
      console.log(`👤 Name: ${firstName} ${lastName}`)
      console.log(`📧 Email: ${email}`)
      console.log(`🆔 User ID: ${authData.user.id}`)
      console.log(`🔐 Role: Administrator`)
      console.log('\n🚀 You can now login with these credentials:')
      console.log(`   • Email: ${email}`)
      console.log(`   • Password: [the password you entered]`)
      console.log(`   • Login URL: http://localhost:3000/login`)
      console.log('\n🎯 After login, you will be redirected to the admin dashboard.')
      console.log('\n📝 Note: You can now create additional staff and admin users')
      console.log('   through the admin dashboard user management section.')
      console.log('\n🔒 Security: This super admin creation tool will not work again')
      console.log('   now that an admin account exists.')
      console.log('\n===============================================\n')

    } else {
      console.log('❌ Error: Failed to create user account!')
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Super admin creation cancelled.')
  process.exit(0)
})

// Run the script
createSuperAdmin()