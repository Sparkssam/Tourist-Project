import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'staff' | 'tourist'
}

/**
 * Verify that the request is from an authenticated user
 * Returns the user object if authenticated, null otherwise
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
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

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      role: profile.role
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

/**
 * Verify that the request is from an admin user
 * Returns the user object if admin, null otherwise
 */
export async function verifyAdminAuth(request: NextRequest): Promise<AuthUser | null> {
  const user = await verifyAuth(request)
  
  if (!user || user.role !== 'admin') {
    return null
  }
  
  return user
}

/**
 * Verify that the request is from a staff or admin user
 * Returns the user object if staff/admin, null otherwise
 */
export async function verifyStaffAuth(request: NextRequest): Promise<AuthUser | null> {
  const user = await verifyAuth(request)
  
  if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
    return null
  }
  
  return user
}

/**
 * Create a standard unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized access') {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Create a standard forbidden response
 */
export function forbiddenResponse(message: string = 'Access forbidden') {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' }
  })
}
