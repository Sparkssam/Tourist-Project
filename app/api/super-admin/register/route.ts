import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone, secretKey } = body

    // Verify the super admin secret key
    const superAdminSecret = process.env.SUPER_ADMIN_SECRET
    if (!superAdminSecret || secretKey !== superAdminSecret) {
      return NextResponse.json(
        { error: 'Invalid super admin secret key' },
        { status: 401 }
      )
    }

    // Check if any admin users already exist
    const { data: existingAdmins, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkError) {
      return NextResponse.json(
        { error: 'Database error: ' + checkError.message },
        { status: 500 }
      )
    }

    // If admins already exist, prevent creation (security measure)
    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        { error: 'Super admin already exists. Contact existing admin to create new accounts.' },
        { status: 403 }
      )
    }

    // Create the super admin user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          role: 'admin'
        }
      }
    })

    if (authError) {
      return NextResponse.json(
        { error: 'Authentication error: ' + authError.message },
        { status: 400 }
      )
    }

    // If user creation was successful
    if (authData.user) {
      // The profile will be automatically created by the database trigger
      // But let's ensure the role is set to admin
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Error updating admin role:', profileError)
      }

      return NextResponse.json({
        message: 'Super admin created successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: 'admin'
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Super admin registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}