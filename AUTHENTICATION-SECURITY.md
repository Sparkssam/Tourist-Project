# Authentication Security Documentation

## Overview
This document outlines the security measures implemented in the Kekeo Safaris authentication system.

---

## 🔒 Password Security

### Password Hashing
**Implementation:** Supabase Auth (Built-in bcrypt)

Supabase automatically handles password hashing using **bcrypt** with the following security features:

#### 1. **Bcrypt Algorithm**
- Industry-standard password hashing algorithm
- Automatically salted (prevents rainbow table attacks)
- Adaptive cost factor (can increase computational cost as hardware improves)
- Default cost factor: 10 rounds (configurable in Supabase dashboard)

#### 2. **Salt Generation**
- Unique salt generated for each password
- Salt is automatically prepended to the hash
- Prevents identical passwords from producing identical hashes

#### 3. **Hash Storage**
```
Password: "MySecurePassword123!"
↓
Bcrypt Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
                 ↑   ↑  ↑                              ↑
                 │   │  │                              └─ Hash (31 chars)
                 │   │  └─ Salt (22 chars)
                 │   └─ Cost factor (10)
                 └─ Algorithm identifier (2a = bcrypt)
```

#### 4. **Password Requirements**
- Minimum 8 characters (configurable in Supabase)
- Enforced at both client and server level
- No maximum length (bcrypt handles truncation securely)

---

## 🛡️ Login Security

### HTTP Status Codes
Proper HTTP status codes are now returned for all authentication scenarios:

| Status Code | Scenario | Response |
|------------|----------|----------|
| **200 OK** | Successful login | Returns user data and role |
| **400 Bad Request** | Missing email or password | "Email and password are required" |
| **401 Unauthorized** | Invalid credentials | "Invalid email or password" |
| **403 Forbidden** | Account inactive | "Your account is inactive. Please contact support." |
| **500 Internal Server Error** | Server/database error | "An unexpected error occurred. Please try again." |

### Generic Error Messages
For security, we return generic error messages to prevent:
- **User enumeration attacks** (can't determine if email exists)
- **Information disclosure** (don't reveal why login failed)

❌ **Bad Practice:**
```javascript
// Don't do this - reveals too much information
if (!userExists) return "No account found with this email"
if (!passwordMatch) return "Password is incorrect"
```

✅ **Good Practice:**
```javascript
// Always return generic message
if (signInError) return "Invalid email or password"
```

---

## 🔐 Authentication Endpoints

### 1. Server Action (app/login/actions.ts)
```typescript
export async function loginAction(email: string, password: string)
```
**Features:**
- Server-side validation
- Returns statusCode with response
- Checks account status (active/inactive)
- Updates last_login_at timestamp
- Development-only error logging

### 2. API Route (app/api/auth/login/route.ts)
```typescript
POST /api/auth/login
```
**Features:**
- RESTful API endpoint
- Proper HTTP status codes
- Input validation
- Account status verification
- Secure error handling

**Request:**
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "role": "tourist",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

## 🚨 Security Features

### 1. **Account Status Verification**
```typescript
if (profile.status !== 'active') {
  return { statusCode: 403, error: 'Account inactive' }
}
```
- Prevents suspended/banned users from logging in
- Returns 403 Forbidden status

### 2. **Session Management**
- Supabase handles JWT tokens automatically
- Access token expires after 1 hour (default)
- Refresh token valid for 60 days (default)
- Automatic token refresh via middleware

### 3. **Last Login Tracking**
```typescript
await supabase
  .from('profiles')
  .update({ last_login_at: new Date().toISOString() })
  .eq('id', authData.user.id)
```
- Tracks user login activity
- Useful for security audits
- Can detect unauthorized access

### 4. **Development-Only Logging**
```typescript
if (process.env.NODE_ENV === 'development') {
  console.error('Login failed:', signInError.message)
}
```
- Detailed errors logged in development
- No sensitive information logged in production
- Prevents information leakage in production logs

---

## 🔧 Configuration

### Supabase Auth Configuration
Access via: **Supabase Dashboard → Authentication → Settings**

#### Password Requirements
```
Minimum Password Length: 8 characters
Password Strength: Medium (recommended)
```

#### Session Settings
```
JWT Expiry: 3600 seconds (1 hour)
Refresh Token Lifetime: 5184000 seconds (60 days)
Refresh Token Rotation: Enabled (recommended)
```

#### Security Settings
```
Enable Captcha: Recommended for production
Rate Limiting: Enabled by default
Email Confirmations: Enabled for new signups
```

---

## 📋 Security Checklist

### Password Security
- ✅ Passwords hashed with bcrypt (Supabase automatic)
- ✅ Unique salt per password (Supabase automatic)
- ✅ Minimum 8 character requirement
- ✅ No plaintext password storage
- ✅ No password in logs or error messages

### Authentication Security
- ✅ Proper HTTP status codes (200, 401, 403, 500)
- ✅ Generic error messages (prevent user enumeration)
- ✅ Account status verification
- ✅ Last login timestamp tracking
- ✅ Development-only error logging

### Session Security
- ✅ JWT tokens with expiration
- ✅ Automatic token refresh
- ✅ Secure cookie storage (httpOnly)
- ✅ CSRF protection (Supabase built-in)
- ✅ Session validation via middleware

### API Security
- ✅ Input validation
- ✅ Rate limiting (Supabase built-in)
- ✅ CORS configuration
- ✅ Error handling without information disclosure
- ✅ No sensitive data in responses

---

## 🧪 Testing Authentication

### Test Invalid Credentials (401)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@example.com","password":"wrongpassword"}'
```

Expected Response:
```json
HTTP/1.1 401 Unauthorized
{
  "success": false,
  "error": "Invalid email or password"
}
```

### Test Valid Credentials (200)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"valid@example.com","password":"correctpassword"}'
```

Expected Response:
```json
HTTP/1.1 200 OK
{
  "success": true,
  "role": "tourist",
  "user": {
    "id": "...",
    "email": "valid@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Test Inactive Account (403)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"inactive@example.com","password":"password"}'
```

Expected Response:
```json
HTTP/1.1 403 Forbidden
{
  "success": false,
  "error": "Your account is inactive. Please contact support."
}
```

---

## 🔄 Password Change Flow (Future Enhancement)

For additional security, consider implementing:

1. **Password Change Endpoint**
   - Require current password verification
   - Enforce password strength requirements
   - Send email notification on password change

2. **Password Reset Flow**
   - Already handled by Supabase Auth
   - Secure token-based reset
   - Email verification required

3. **Multi-Factor Authentication (MFA)**
   - Supabase supports TOTP-based MFA
   - Enable via Supabase Dashboard
   - Recommended for admin accounts

---

## 📚 References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Bcrypt Algorithm](https://en.wikipedia.org/wiki/Bcrypt)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## 🛠️ Maintenance

### Regular Security Reviews
- Review Supabase auth logs weekly
- Monitor failed login attempts
- Update password requirements as needed
- Review and rotate API keys quarterly

### Incident Response
If a security incident occurs:
1. Lock affected accounts immediately
2. Review auth logs for suspicious activity
3. Force password reset for affected users
4. Update security measures as needed
5. Document incident and response

---

**Last Updated:** October 23, 2025  
**Maintained By:** Kekeo Safaris Development Team
