/**
 * CSRF Protection Utilities
 * Protects against Cross-Site Request Forgery attacks
 */

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const CSRF_TOKEN_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  // Generate a random token using crypto
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Set CSRF token in cookie (server-side)
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken()
  const cookieStore = await cookies()
  
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
  
  return token
}

/**
 * Get CSRF token from cookie (server-side)
 */
export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_TOKEN_NAME)?.value
}

/**
 * Verify CSRF token from request
 */
export async function verifyCsrfToken(request: NextRequest): Promise<boolean> {
  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_TOKEN_NAME)?.value
  
  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  
  // Both must exist and match
  if (!cookieToken || !headerToken) {
    return false
  }
  
  return cookieToken === headerToken
}

/**
 * Middleware helper to add CSRF protection to API routes
 */
export async function requireCsrfToken(request: NextRequest): Promise<Response | null> {
  // Skip CSRF check for GET, HEAD, OPTIONS (safe methods)
  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(request.method)
  if (safeMethod) {
    return null
  }
  
  // Verify CSRF token for unsafe methods (POST, PUT, DELETE, PATCH)
  const isValid = await verifyCsrfToken(request)
  
  if (!isValid) {
    return new Response(
      JSON.stringify({ error: 'Invalid or missing CSRF token' }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  return null
}

/**
 * Client-side: Get CSRF token from meta tag
 * Add this to your layout: <meta name="csrf-token" content={csrfToken} />
 */
export function getCsrfTokenFromMeta(): string | null {
  if (typeof document === 'undefined') return null
  
  const meta = document.querySelector('meta[name="csrf-token"]')
  return meta?.getAttribute('content') || null
}

/**
 * Client-side: Add CSRF token to fetch request
 */
export function addCsrfToken(headers: HeadersInit = {}): HeadersInit {
  const token = getCsrfTokenFromMeta()
  
  if (token) {
    return {
      ...headers,
      [CSRF_HEADER_NAME]: token,
    }
  }
  
  return headers
}
