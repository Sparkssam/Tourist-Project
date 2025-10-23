import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  try {
    // Update the session and get response
    const response = await updateSession(request)
    
    const url = request.nextUrl.clone()
    
    // Create Supabase client to check auth
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // Not needed for reading
          },
        },
      }
    )
    
  // Get user and validate session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  // SECURITY: Protect admin routes with enhanced authentication
  if (url.pathname.startsWith('/admin')) {
    // Check 1: Validate user session exists
    if (!user || authError) {
      // Invalid session or not logged in - redirect to login
      if (process.env.NODE_ENV === 'development') {
        console.log('Admin route access denied: No valid session')
      }
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      url.searchParams.set('error', 'session_required')
      return NextResponse.redirect(url)
    }
    
    // Check 2: Verify session token is not expired
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Admin route access denied: Session expired')
      }
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      url.searchParams.set('error', 'session_expired')
      return NextResponse.redirect(url)
    }
    
    // Check 3: Fetch user profile and verify role + status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile) {
      // Profile not found or error
      if (process.env.NODE_ENV === 'development') {
        console.error('Admin route access denied: Profile error', profileError)
      }
      url.pathname = '/login'
      url.searchParams.set('error', 'profile_error')
      return NextResponse.redirect(url)
    }
    
    // Check 4: Verify account is active
    if (profile.status !== 'active') {
      if (process.env.NODE_ENV === 'development') {
        console.log('Admin route access denied: Account inactive', profile.status)
      }
      url.pathname = '/login'
      url.searchParams.set('error', 'account_inactive')
      return NextResponse.redirect(url)
    }
    
    // Check 5: Verify user has admin role
    if (profile.role !== 'admin') {
      // Not an admin - redirect to appropriate dashboard or home
      if (process.env.NODE_ENV === 'development') {
        console.log('Admin route access denied: Insufficient permissions', profile.role)
      }
      
      // Redirect to user's appropriate dashboard
      if (profile.role === 'staff') {
        url.pathname = '/staff'
      } else if (profile.role === 'tourist') {
        url.pathname = '/tourist'
      } else {
        url.pathname = '/'
      }
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }
    
    // All checks passed - allow access to admin route
    if (process.env.NODE_ENV === 'development') {
      console.log('Admin route access granted:', user.email)
    }
  }  // SECURITY: Protect staff routes with enhanced authentication
  if (url.pathname.startsWith('/staff')) {
    // Check 1: Validate user session exists
    if (!user || authError) {
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      url.searchParams.set('error', 'session_required')
      return NextResponse.redirect(url)
    }
    
    // Check 2: Verify session token
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      url.searchParams.set('error', 'session_expired')
      return NextResponse.redirect(url)
    }
    
    // Check 3: Fetch user profile and verify role + status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile) {
      url.pathname = '/login'
      url.searchParams.set('error', 'profile_error')
      return NextResponse.redirect(url)
    }
    
    // Check 4: Verify account is active
    if (profile.status !== 'active') {
      url.pathname = '/login'
      url.searchParams.set('error', 'account_inactive')
      return NextResponse.redirect(url)
    }
    
    // Check 5: Verify user has staff or admin role
    if (profile.role !== 'staff' && profile.role !== 'admin') {
      // Redirect to appropriate dashboard
      if (profile.role === 'tourist') {
        url.pathname = '/tourist'
      } else {
        url.pathname = '/'
      }
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }
  }
  
  // SECURITY: Protect tourist dashboard with enhanced authentication
  if (url.pathname.startsWith('/tourist')) {
    // Check 1: Validate user session exists
    if (!user || authError) {
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      url.searchParams.set('error', 'session_required')
      return NextResponse.redirect(url)
    }
    
    // Check 2: Verify session token
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      url.searchParams.set('error', 'session_expired')
      return NextResponse.redirect(url)
    }
    
    // Check 3: Fetch user profile and verify role + status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile) {
      url.pathname = '/login'
      url.searchParams.set('error', 'profile_error')
      return NextResponse.redirect(url)
    }
    
    // Check 4: Verify account is active
    if (profile.status !== 'active') {
      url.pathname = '/login'
      url.searchParams.set('error', 'account_inactive')
      return NextResponse.redirect(url)
    }
    
    // Check 5: Verify user has tourist or admin role
    if (profile.role !== 'tourist' && profile.role !== 'admin') {
      // Redirect to appropriate dashboard
      if (profile.role === 'staff') {
        url.pathname = '/staff'
      } else {
        url.pathname = '/'
      }
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }
  }
  
  // Handle dashboard redirects based on user role
  if (url.pathname === '/dashboard') {
    if (!user || authError) {
      // Not logged in - redirect to login
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // Fetch user profile to get role and status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile) {
      // Profile error - redirect to login
      url.pathname = '/login'
      url.searchParams.set('error', 'profile_error')
      return NextResponse.redirect(url)
    }
    
    // Check if account is active
    if (profile.status !== 'active') {
      url.pathname = '/login'
      url.searchParams.set('error', 'account_inactive')
      return NextResponse.redirect(url)
    }
    
    // Redirect based on role
    if (profile.role === 'admin') {
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    } else if (profile.role === 'staff') {
      url.pathname = '/staff'
      return NextResponse.redirect(url)
    } else if (profile.role === 'tourist') {
      url.pathname = '/tourist'
      return NextResponse.redirect(url)
    }
    
    // Unknown role - redirect to home
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware error:', error)
    }
    // Return the response without exposing error details
    return NextResponse.next()
  }
}