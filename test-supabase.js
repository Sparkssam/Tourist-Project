require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('SUPABASE_URL:', supabaseUrl ? '✓ Set' : '❌ Missing')
  console.log('SUPABASE_KEY:', supabaseKey ? '✓ Set' : '❌ Missing')
  process.exit(1)
}

console.log('🔧 Testing Supabase Connection...')
console.log('📍 URL:', supabaseUrl)
console.log('🔑 Key:', supabaseKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n1️⃣ Testing basic connection...')
    
    // Test 1: Basic health check
    const { data: healthData, error: healthError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })
    
    if (healthError) {
      console.error('❌ Health check failed:', healthError.message)
      return false
    }
    
    console.log('✅ Health check passed')
    
    // Test 2: Try to read profiles
    console.log('\n2️⃣ Testing profile read...')
    const { data: profiles, error: readError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(3)
    
    if (readError) {
      console.error('❌ Profile read failed:', readError.message)
      return false
    }
    
    console.log('✅ Profile read successful')
    console.log('📊 Found', profiles?.length || 0, 'profiles')
    if (profiles?.length) {
      profiles.forEach(p => console.log(`   - ${p.email} (${p.role})`))
    }
    
    // Test 3: Try to insert a test record
    console.log('\n3️⃣ Testing profile insert...')
    const testUser = {
      id: crypto.randomUUID(),
      email: `test_${Date.now()}@example.com`,
      first_name: 'Test',
      last_name: 'User',
      role: 'staff',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert(testUser)
      .select()
    
    if (insertError) {
      console.error('❌ Profile insert failed:', insertError.message)
      console.error('   Full error:', insertError)
      return false
    }
    
    console.log('✅ Profile insert successful')
    console.log('📝 Created:', insertData)
    
    // Test 4: Clean up the test record
    console.log('\n4️⃣ Cleaning up test record...')
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', testUser.id)
    
    if (deleteError) {
      console.warn('⚠️ Failed to delete test record:', deleteError.message)
    } else {
      console.log('✅ Test record cleaned up')
    }
    
    console.log('\n🎉 All tests passed! Supabase connection is working perfectly.')
    return true
    
  } catch (error) {
    console.error('❌ Connection test failed with exception:', error.message)
    return false
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ CONNECTION TEST: SUCCESS')
      console.log('Your Supabase setup is working correctly.')
    } else {
      console.log('\n❌ CONNECTION TEST: FAILED')
      console.log('There are issues with your Supabase configuration.')
    }
  })
  .catch(error => {
    console.error('\n💥 UNEXPECTED ERROR:', error)
  })