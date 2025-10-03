import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone, role, adminSecret } = body

    console.log('🔐 Simple Auth Creation - Admin Secret Validation')
    
    // Validate admin secret
    if (adminSecret !== process.env.SUPER_ADMIN_SECRET) {
      return NextResponse.json({ 
        error: 'Unauthorized - Admin secret does not match'
      }, { status: 401 })
    }

    console.log('✅ Admin secret validated')

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('📝 Creating auth user:', email)

    // Try creating the auth user with minimal metadata
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password: password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: phone || null
      }
    })

    if (authError) {
      console.error('❌ Auth creation error:', authError)
      return NextResponse.json({ 
        error: 'Failed to create auth user: ' + authError.message,
        details: authError
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'No user returned from auth creation'
      }, { status: 400 })
    }

    console.log('✅ Auth user created:', authData.user.id)

    // Now create/update the profile
    console.log('📝 Creating profile...')
    
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone?.trim() || null,
        role: role,
        status: 'active',
        has_auth_account: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('⚠️ Profile creation error:', profileError)
      // Auth user exists but profile failed
      return NextResponse.json({ 
        success: true,
        warning: 'Auth user created but profile sync failed',
        user: {
          id: authData.user.id,
          email: email,
          firstName,
          lastName,
          role,
          password: password,
          note: 'User can login, but profile may need manual creation'
        }
      }, { status: 201 })
    }

    console.log('✅ Profile created successfully')

    return NextResponse.json({
      success: true,
      message: 'User created successfully with authentication',
      user: {
        id: authData.user.id,
        email: email,
        firstName,
        lastName,
        role,
        password: password
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
