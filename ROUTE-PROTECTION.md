# Route Protection & Authentication Middleware

## Overview
This document describes the comprehensive authentication middleware that protects all sensitive routes in the Kekeo Safaris application.

---

## 🛡️ Protected Routes

### Admin Routes (`/admin/*`)
**Access:** Admin role only

**Protection Layers:**
1. ✅ Valid session required
2. ✅ Non-expired token verification
3. ✅ Profile existence check
4. ✅ Active account status verification
5. ✅ Admin role requirement

**Unauthorized Access:**
- No session → Redirect to `/login?redirect=/admin&error=session_required`
- Expired token → Redirect to `/login?redirect=/admin&error=session_expired`
- No profile → Redirect to `/login?error=profile_error`
- Inactive account → Redirect to `/login?error=account_inactive`
- Non-admin role → Redirect to appropriate dashboard with `error=unauthorized`

---

### Staff Routes (`/staff/*`)
**Access:** Staff or Admin role

**Protection Layers:**
1. ✅ Valid session required
2. ✅ Non-expired token verification
3. ✅ Profile existence check
4. ✅ Active account status verification
5. ✅ Staff or Admin role requirement

**Unauthorized Access:**
- No session → Redirect to `/login?redirect=/staff&error=session_required`
- Expired token → Redirect to `/login?redirect=/staff&error=session_expired`
- Tourist role → Redirect to `/tourist?error=unauthorized`
- Other roles → Redirect to `/` with error

---

### Tourist Routes (`/tourist/*`)
**Access:** Tourist or Admin role

**Protection Layers:**
1. ✅ Valid session required
2. ✅ Non-expired token verification
3. ✅ Profile existence check
4. ✅ Active account status verification
5. ✅ Tourist or Admin role requirement

**Unauthorized Access:**
- No session → Redirect to `/login?redirect=/tourist&error=session_required`
- Expired token → Redirect to `/login?redirect=/tourist&error=session_expired`
- Staff role → Redirect to `/staff?error=unauthorized`
- Other roles → Redirect to `/` with error

---

## 🔐 Security Checks (5-Layer Protection)

### Layer 1: Session Validation
```typescript
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (!user || authError) {
  // Redirect to login
}
```
**Purpose:** Ensures user has an authenticated session

---

### Layer 2: Token Verification
```typescript
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  // Session expired - redirect to login
}
```
**Purpose:** Verifies JWT token is valid and not expired

**Token Details:**
- Access token expires: 1 hour (default)
- Refresh token expires: 60 days (default)
- Automatic refresh via middleware

---

### Layer 3: Profile Verification
```typescript
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('role, status')
  .eq('id', user.id)
  .single()

if (profileError || !profile) {
  // Profile not found - redirect to login
}
```
**Purpose:** Ensures user profile exists in database

---

### Layer 4: Account Status Check
```typescript
if (profile.status !== 'active') {
  // Account inactive - redirect to login
}
```
**Purpose:** Blocks suspended/banned users from accessing the system

**Account Statuses:**
- `active` - Can access system ✅
- `inactive` - Cannot access system ❌
- `suspended` - Cannot access system ❌
- `banned` - Cannot access system ❌

---

### Layer 5: Role-Based Access Control (RBAC)
```typescript
if (profile.role !== 'admin') {
  // Insufficient permissions - redirect
}
```
**Purpose:** Ensures user has required role for the route

**Role Hierarchy:**
```
Admin (highest privileges)
  ↓
Staff (moderate privileges)
  ↓
Tourist (basic privileges)
```

---

## 🔄 Authentication Flow

```
User Requests Protected Route (/admin/dashboard)
           ↓
┌──────────────────────────────────────────┐
│  Middleware (middleware.ts)              │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│  Check 1: Session Valid?                 │
│  • User object exists                    │
│  • No auth error                         │
└──────────────────────────────────────────┘
           ↓
      YES  │  NO → Redirect to /login
           ↓
┌──────────────────────────────────────────┐
│  Check 2: Token Valid?                   │
│  • Session exists                        │
│  • Token not expired                     │
└──────────────────────────────────────────┘
           ↓
      YES  │  NO → Redirect to /login
           ↓
┌──────────────────────────────────────────┐
│  Check 3: Profile Exists?                │
│  • Profile found in database             │
│  • No profile error                      │
└──────────────────────────────────────────┘
           ↓
      YES  │  NO → Redirect to /login
           ↓
┌──────────────────────────────────────────┐
│  Check 4: Account Active?                │
│  • status === 'active'                   │
└──────────────────────────────────────────┘
           ↓
      YES  │  NO → Redirect to /login
           ↓
┌──────────────────────────────────────────┐
│  Check 5: Has Required Role?             │
│  • Admin for /admin/*                    │
│  • Staff/Admin for /staff/*              │
│  • Tourist/Admin for /tourist/*          │
└──────────────────────────────────────────┘
           ↓
      YES  │  NO → Redirect to appropriate dashboard
           ↓
    ┌─────────┐
    │ GRANTED │ ✅
    │ ACCESS  │
    └─────────┘
```

---

## 🚨 Error Handling

### Error Codes
| Error Code | Meaning | Action |
|-----------|---------|--------|
| `session_required` | No valid session | Must login |
| `session_expired` | Token expired | Must re-authenticate |
| `profile_error` | Profile not found/error | Contact support |
| `account_inactive` | Account suspended/banned | Contact support |
| `unauthorized` | Insufficient permissions | Access denied |

### Error Message Display
Errors can be displayed to users via query parameters:

```typescript
// In your login page or error handler
const searchParams = useSearchParams()
const error = searchParams.get('error')

const errorMessages = {
  session_required: 'Please log in to continue',
  session_expired: 'Your session has expired. Please log in again.',
  profile_error: 'Unable to load your profile. Please contact support.',
  account_inactive: 'Your account is inactive. Please contact support.',
  unauthorized: 'You do not have permission to access this page.'
}
```

---

## 📍 Redirect Behavior

### Login Redirects
When redirected to login, the original URL is preserved:
```
/admin/dashboard → /login?redirect=/admin/dashboard
```

After successful login, user is redirected back to original destination.

### Role-Based Redirects
Users are redirected to their appropriate dashboard:

| User Role | Attempting to Access | Redirected To |
|-----------|---------------------|---------------|
| Tourist | `/admin/*` | `/tourist?error=unauthorized` |
| Tourist | `/staff/*` | `/tourist?error=unauthorized` |
| Staff | `/admin/*` | `/staff?error=unauthorized` |
| Staff | `/tourist/*` | `/staff?error=unauthorized` |
| Admin | Any protected route | ✅ Allowed |

---

## 🔧 Configuration

### Session Timeout
Configure in Supabase Dashboard:
- **Access Token:** 1 hour (3600 seconds)
- **Refresh Token:** 60 days (5184000 seconds)

### Middleware Matcher
Routes protected by middleware (in `middleware.ts`):
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

This matches **all routes except:**
- `/_next/static` (Next.js static files)
- `/_next/image` (Next.js image optimization)
- `/favicon.ico`
- Image files (svg, png, jpg, etc.)

---

## 🧪 Testing Route Protection

### Test 1: Access Admin Without Login
```powershell
# Should redirect to /login?redirect=/admin&error=session_required
Start-Process "http://localhost:3000/admin"
```

### Test 2: Access Admin as Tourist
1. Login as tourist user
2. Navigate to `http://localhost:3000/admin`
3. Should redirect to `/tourist?error=unauthorized`

### Test 3: Access with Expired Session
1. Login and wait for token expiration (1 hour)
2. Try accessing `/admin`
3. Should redirect to `/login?error=session_expired`

### Test 4: Access with Inactive Account
1. Set user status to 'inactive' in database
2. Try logging in
3. Should redirect with `error=account_inactive`

---

## 🔍 Debugging

### Development Logging
Detailed logs appear in development mode:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Admin route access granted:', user.email)
  console.log('Admin route access denied: No valid session')
}
```

### Check Logs:
```powershell
# Terminal running npm run dev will show:
Admin route access denied: No valid session
Admin route access denied: Session expired
Admin route access denied: Account inactive
Admin route access granted: admin@example.com
```

### Production Mode
In production, detailed logs are suppressed for security.

---

## 🔐 Security Best Practices

### ✅ Implemented
- Multi-layer authentication (5 checks)
- Session validation and token verification
- Account status verification
- Role-based access control
- Secure redirects with original URL preservation
- Development-only logging
- Generic error messages in production

### 🎯 Additional Recommendations

#### 1. Rate Limiting
Add rate limiting to prevent brute force attacks:
```typescript
// Consider adding rate limiting middleware
// Example: 10 requests per minute per IP
```

#### 2. CSRF Protection
Supabase provides built-in CSRF protection for auth endpoints.

#### 3. Security Headers
Already configured in `next.config.mjs`:
- X-XSS-Protection
- X-Content-Type-Options
- X-Frame-Options
- Content-Security-Policy

#### 4. Audit Logging
Consider logging access attempts:
```typescript
// Log admin access
await supabase.from('audit_log').insert({
  user_id: user.id,
  action: 'admin_access',
  route: url.pathname,
  timestamp: new Date().toISOString()
})
```

---

## 📊 Route Protection Summary

| Route | Session Required | Token Valid | Profile Check | Status Check | Role Check |
|-------|-----------------|-------------|---------------|--------------|-----------|
| `/admin/*` | ✅ | ✅ | ✅ | ✅ | Admin only |
| `/staff/*` | ✅ | ✅ | ✅ | ✅ | Staff/Admin |
| `/tourist/*` | ✅ | ✅ | ✅ | ✅ | Tourist/Admin |
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | Any role |
| `/login` | ❌ | ❌ | ❌ | ❌ | Public |
| `/register` | ❌ | ❌ | ❌ | ❌ | Public |
| `/` (home) | ❌ | ❌ | ❌ | ❌ | Public |

---

## 🆘 Troubleshooting

### Issue: Constant Redirect Loop
**Cause:** Session not persisting  
**Solution:** Check Supabase URL and keys in `.env.local`

### Issue: "profile_error" After Login
**Cause:** Profile not created during signup  
**Solution:** Check database trigger creates profile on signup

### Issue: Admin Can't Access Admin Route
**Cause:** Role not set correctly  
**Solution:** 
```sql
-- Check user role in database
SELECT id, email, role, status FROM profiles WHERE email = 'admin@example.com';

-- Update role if needed
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

### Issue: Session Expires Too Quickly
**Cause:** Token expiration set too short  
**Solution:** Update in Supabase Dashboard → Authentication → Settings

---

## 📚 Related Documentation

- `AUTHENTICATION-SECURITY.md` - Login security and password hashing
- `SECURITY-UPDATES-SUMMARY.md` - Recent security improvements
- `middleware.ts` - Middleware implementation
- `lib/auth/auth-context.tsx` - Authentication context

---

**Last Updated:** October 23, 2025  
**Maintained By:** Kekeo Safaris Development Team  
**Security Status:** ✅ Production-Ready
