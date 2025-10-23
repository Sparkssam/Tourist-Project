import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email and password are required' 
        },
        { status: 400 } // Bad Request
      )
    }

    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore - middleware will handle session refresh
            }
          },
        },
      }
    )

    // Attempt sign in with Supabase (which uses bcrypt hashing internally)
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // Return 401 for invalid credentials
    if (signInError) {
      // Log error only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Login failed:', signInError.message)
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password' // Generic message for security
        },
        { status: 401 } // Unauthorized - invalid credentials
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password' // Generic message
        },
        { status: 401 } // Unauthorized
      )
    }

    // Fetch user profile to get role and status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status, first_name, last_name')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      // Log error only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Profile fetch error:', profileError)
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Could not load user profile. Please try again.' 
        },
        { status: 500 } // Internal server error
      )
    }

    // Check if user account is active
    if (profile.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Your account is inactive. Please contact support.'
        },
        { status: 403 } // Forbidden - account inactive
      )
    }

    // Update last login timestamp
    await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', authData.user.id)

    // Return success with proper 200 status
    return NextResponse.json(
      { 
        success: true,
        role: profile.role,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          first_name: profile.first_name,
          last_name: profile.last_name
        }
      },
      { status: 200 } // OK - successful login
    )
  } catch (error) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Login API error:', error)
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'An unexpected error occurred. Please try again.' 
      },
      { status: 500 } // Internal server error
    )
  }
}
