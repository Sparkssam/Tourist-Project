import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // This is a diagnostic endpoint to check environment variables
  // DELETE THIS FILE AFTER DEBUGGING!
  
  return NextResponse.json({
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSuperAdminSecret: !!process.env.SUPER_ADMIN_SECRET,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Show first few characters to verify (NOT the full secrets!)
    superAdminSecretPrefix: process.env.SUPER_ADMIN_SECRET?.substring(0, 10) + '...',
    serviceRoleKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...',
    
    // Show the exact length to help debug
    superAdminSecretLength: process.env.SUPER_ADMIN_SECRET?.length,
    
    // Environment check
    nodeEnv: process.env.NODE_ENV
  })
}
