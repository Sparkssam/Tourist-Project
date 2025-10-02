const fetch = require('node-fetch')

async function testAPI() {
  try {
    console.log('🔧 Testing Admin API...')
    
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'staff',
        adminSecret: 'kekeo_safari_super_admin_2024_secret_key'
      })
    })

    const result = await response.json()
    
    console.log('📊 Response Status:', response.status)
    console.log('📋 Response Body:', JSON.stringify(result, null, 2))

    if (response.ok) {
      console.log('✅ API test successful!')
    } else {
      console.log('❌ API test failed')
    }

  } catch (error) {
    console.error('💥 API test error:', error.message)
  }
}

testAPI()