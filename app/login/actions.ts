'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function loginAction(email: string, password: string) {
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  // Sign in with email and password
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
    
    return { 
      success: false,
      statusCode: 401, // Unauthorized - invalid credentials
      error: 'Invalid email or password' // Generic message for security
    }
  }

  if (!authData.user) {
    return { 
      success: false,
      statusCode: 401, // Unauthorized
      error: 'Invalid email or password' // Generic message
    }
  }

  // Fetch user profile to determine role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Profile fetch error:', profileError)
    }
    
    return { 
      success: false,
      statusCode: 500, // Internal server error
      error: 'Could not load user profile. Please try again.' 
    }
  }

  // Check if user account is active
  if (profile.status !== 'active') {
    return {
      success: false,
      statusCode: 403, // Forbidden - account inactive
      error: 'Your account is inactive. Please contact support.'
    }
  }

  // Update last login timestamp
  await supabase
    .from('profiles')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', authData.user.id)

  // Return success with role - let the client handle redirect
  return { 
    success: true,
    statusCode: 200, // OK
    role: profile.role,
    user: authData.user 
  }
}
