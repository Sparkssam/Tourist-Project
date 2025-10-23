# Route Protection Testing Guide

## Quick Test Commands

### Prerequisites
```powershell
# Make sure dev server is running
npm run dev
```

---

## 🧪 Test Scenarios

### Test 1: Admin Route Without Login
**Expected:** Redirect to login with session_required error

```powershell
# Open browser to admin route (logged out)
Start-Process "http://localhost:3000/admin"

# Expected URL after redirect:
# http://localhost:3000/login?redirect=/admin&error=session_required
```

**Verification:**
- Check URL contains `?redirect=/admin`
- Check URL contains `&error=session_required`
- User should see login form

---

### Test 2: Tourist Accessing Admin Route
**Expected:** Redirect to tourist dashboard with unauthorized error

**Steps:**
1. Login as tourist user at `http://localhost:3000/login`
2. Navigate to `http://localhost:3000/admin`
3. Should be redirected to `http://localhost:3000/tourist?error=unauthorized`

**PowerShell Test:**
```powershell
# After logging in as tourist
Start-Process "http://localhost:3000/admin"

# Expected redirect:
# http://localhost:3000/tourist?error=unauthorized
```

---

### Test 3: Staff Accessing Admin Route
**Expected:** Redirect to staff dashboard with unauthorized error

**Steps:**
1. Login as staff user at `http://localhost:3000/login`
2. Navigate to `http://localhost:3000/admin`
3. Should be redirected to `http://localhost:3000/staff?error=unauthorized`

---

### Test 4: Inactive Account Access
**Expected:** Blocked at login, can't access any protected routes

**Setup:**
```sql
-- In Supabase SQL Editor, set account to inactive
UPDATE profiles 
SET status = 'inactive' 
WHERE email = 'test@example.com';
```

**Test:**
1. Try logging in with that account
2. Should redirect to `/login?error=account_inactive`
3. Cannot access any protected routes

**Cleanup:**
```sql
-- Reset account to active
UPDATE profiles 
SET status = 'active' 
WHERE email = 'test@example.com';
```

---

### Test 5: Valid Admin Access
**Expected:** Full access to admin routes

**Steps:**
1. Login as admin user
2. Navigate to `http://localhost:3000/admin`
3. Should see admin dashboard (no redirect)
4. Check terminal for log: `Admin route access granted: admin@example.com`

---

### Test 6: Session Expiration (Long-term Test)
**Expected:** Redirect to login with session_expired error

**Manual Test:**
1. Login to admin dashboard
2. Wait 1 hour (token expires)
3. Try navigating to any admin page
4. Should redirect to `/login?error=session_expired`

**Quick Test (Development Only):**
```typescript
// Temporarily in middleware.ts for testing
if (session && session.expires_at) {
  // Force token to be "expired" for testing
  const expiresAt = new Date(session.expires_at * 1000)
  if (expiresAt > new Date()) {
    // Pretend it's expired
    return NextResponse.redirect('/login?error=session_expired')
  }
}
```

---

### Test 7: Profile Error Handling
**Expected:** Redirect to login with profile_error

**Setup (Temporarily):**
```sql
-- Temporarily remove user's profile
UPDATE profiles SET id = 'temp-backup' WHERE email = 'test@example.com';
```

**Test:**
1. Try logging in
2. Should redirect with `error=profile_error`

**Cleanup:**
```sql
-- Restore profile
UPDATE profiles SET id = (SELECT id FROM auth.users WHERE email = 'test@example.com') 
WHERE id = 'temp-backup';
```

---

## 🔍 Checking Middleware Logs

### Development Mode
Terminal will show detailed logs:

```
✅ Success:
Admin route access granted: admin@example.com

❌ Denied:
Admin route access denied: No valid session
Admin route access denied: Session expired
Admin route access denied: Account inactive
Admin route access denied: Insufficient permissions (staff)
```

### Production Mode
Logs are suppressed. Only redirects happen (no console output).

---

## 🎯 Manual Browser Testing

### Full Flow Test (Admin)
1. **Logout** (if logged in)
2. Go to `http://localhost:3000/admin/dashboard`
3. Should redirect to `/login?redirect=/admin/dashboard`
4. Login with admin credentials
5. Should redirect back to `/admin/dashboard`
6. Admin dashboard loads successfully

### Full Flow Test (Tourist)
1. **Logout** (if logged in)
2. Go to `http://localhost:3000/tourist`
3. Should redirect to `/login?redirect=/tourist`
4. Login with tourist credentials
5. Should redirect back to `/tourist`
6. Tourist dashboard loads successfully

### Cross-Access Test
1. Login as **tourist**
2. Try accessing:
   - `/admin` → Should redirect to `/tourist?error=unauthorized`
   - `/staff` → Should redirect to `/tourist?error=unauthorized`
   - `/tourist` → Should work ✅

---

## 📊 Test Checklist

### Admin Route Protection
- [ ] Logged-out users redirected to login
- [ ] Tourist users redirected to tourist dashboard
- [ ] Staff users redirected to staff dashboard
- [ ] Admin users granted access
- [ ] Inactive accounts blocked
- [ ] Session expiration handled
- [ ] Profile errors handled

### Staff Route Protection
- [ ] Logged-out users redirected to login
- [ ] Tourist users redirected to tourist dashboard
- [ ] Staff users granted access
- [ ] Admin users granted access (elevated)
- [ ] Inactive accounts blocked

### Tourist Route Protection
- [ ] Logged-out users redirected to login
- [ ] Tourist users granted access
- [ ] Staff users redirected to staff dashboard
- [ ] Admin users granted access (elevated)
- [ ] Inactive accounts blocked

### Redirect Preservation
- [ ] Original URL preserved in redirect parameter
- [ ] After login, user returns to original destination
- [ ] Error codes passed correctly in query params

---

## 🐛 Debugging Failed Tests

### Issue: Redirect Loop
**Symptoms:** Page keeps redirecting infinitely

**Check:**
1. Is user logged in? Check browser cookies
2. Is profile created? Check database
3. Is role set correctly? Check profiles table

**Debug:**
```typescript
// Add temporary logging in middleware.ts
console.log('User:', user?.email)
console.log('Profile:', profile)
console.log('Status:', profile?.status)
console.log('Role:', profile?.role)
```

---

### Issue: No Redirect Happening
**Symptoms:** Protected route loads without login

**Check:**
1. Is middleware running? Check `npm run dev` output
2. Is route matched? Check `config.matcher` in middleware.ts
3. Are environment variables set? Check `.env.local`

**Verify:**
```powershell
# Check if middleware is configured
cat middleware.ts | Select-String "export const config"
```

---

### Issue: Wrong Redirect Destination
**Symptoms:** Redirected to wrong page

**Check:**
1. User role in database
2. Logic in middleware for that role
3. Account status (active/inactive)

**SQL Query:**
```sql
SELECT 
  u.email,
  p.role,
  p.status,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'your-test-email@example.com';
```

---

## 🔐 Security Verification

### Verify 5-Layer Protection
Use browser DevTools → Network tab:

1. **Clear cookies** (logout)
2. Navigate to `/admin`
3. Check request:
   - Should get **302 redirect**
   - Location header: `/login?redirect=/admin&error=session_required`

### Verify Token Validation
1. Login to admin
2. Open DevTools → Application → Cookies
3. Note the session cookies
4. Delete session cookies
5. Try accessing `/admin`
6. Should redirect to login

### Verify Role Check
1. Login as tourist
2. Open DevTools → Network tab
3. Navigate to `/admin`
4. Check response:
   - Should get **302 redirect**
   - Location: `/tourist?error=unauthorized`

---

## 📝 Test Results Template

```
Test Date: _______________
Tester: _______________

┌─────────────────────────────────────────────┐
│ Admin Route Protection                       │
├─────────────────────────────────────────────┤
│ [ ] No session redirect to login            │
│ [ ] Expired session handled                 │
│ [ ] Tourist blocked                          │
│ [ ] Staff blocked                            │
│ [ ] Admin allowed                            │
│ [ ] Inactive account blocked                 │
│ [ ] Profile error handled                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Staff Route Protection                       │
├─────────────────────────────────────────────┤
│ [ ] No session redirect to login            │
│ [ ] Tourist blocked                          │
│ [ ] Staff allowed                            │
│ [ ] Admin allowed                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Tourist Route Protection                     │
├─────────────────────────────────────────────┤
│ [ ] No session redirect to login            │
│ [ ] Tourist allowed                          │
│ [ ] Staff blocked                            │
│ [ ] Admin allowed                            │
└─────────────────────────────────────────────┘

Notes:
_________________________________________________
_________________________________________________
_________________________________________________
```

---

**Testing Completed:** __________  
**Status:** ☐ PASS  ☐ FAIL  
**Issues Found:** __________
