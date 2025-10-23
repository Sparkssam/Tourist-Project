'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

  if (signInError) {
    return { 
      success: false, 
      error: signInError.message 
    }
  }

  if (!authData.user) {
    return { 
      success: false, 
      error: 'Login failed - no user returned' 
    }
  }

  // Fetch user profile to determine role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    return { 
      success: false, 
      error: 'Could not load user profile' 
    }
  }

  // Return success with role - let the client handle redirect
  return { 
    success: true, 
    role: profile.role,
    user: authData.user 
  }
}
