import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with service role (for admin operations)
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceKey) {
    throw new Error('Service role key not configured')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, phone, role, adminSecret } = body

    // Validate admin secret
    if (adminSecret !== process.env.SUPER_ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('🔧 Server: Creating user with admin privileges')
    
    try {
      // Try with service role first
      const supabaseAdmin = createAdminClient()
      
      // Generate a secure temporary password
      const tempPassword = crypto.randomUUID().slice(0, 12) + 'Aa1!'
      
      console.log('👤 Creating auth user with service role...')
      
      // Create user with admin client (bypasses email confirmation)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase().trim(),
        password: tempPassword,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        }
      })

      if (authError) {
        console.error('❌ Service role auth creation failed:', authError)
        throw authError
      }

      if (!authData.user?.id) {
        throw new Error('No user ID returned from service role creation')
      }

      console.log('✅ Auth user created with service role:', authData.user.id)

      // Create profile
      console.log('📝 Creating profile...')
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: email.toLowerCase().trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone?.trim() || null,
          role: role,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError)
        throw profileError
      }

      console.log('✅ User created successfully with service role')

      return NextResponse.json({
        success: true,
        user: {
          id: authData.user.id,
          email: email,
          firstName,
          lastName,
          role,
          tempPassword
        }
      })

    } catch (serviceError) {
      console.warn('⚠️ Service role failed, trying direct profile creation...')
      
      // Fallback: Create profile without auth (for testing)
      const { supabase } = await import('@/lib/supabase/client')
      
      const userId = crypto.randomUUID()
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email.toLowerCase().trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone?.trim() || null,
          role: role,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('❌ Fallback profile creation failed:', profileError)
        throw profileError
      }

      console.log('✅ Fallback profile created successfully')

      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email: email,
          firstName,
          lastName,
          role,
          tempPassword: 'N/A (Profile only - no auth account)',
          note: 'Created as profile only. User needs to register separately.'
        }
      })
    }

  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}