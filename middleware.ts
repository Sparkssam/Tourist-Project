import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
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
  
  // Get user and profile
  const { data: { user } } = await supabase.auth.getUser()
  
  // Handle dashboard redirects based on user role
  if (url.pathname === '/dashboard' && user) {
    // Fetch user profile to get role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    // Redirect based on role
    if (profile?.role === 'admin') {
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    } else if (profile?.role === 'staff') {
      url.pathname = '/staff'
      return NextResponse.redirect(url)
    }
    // For tourists or no profile, stay on dashboard or redirect to home
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}