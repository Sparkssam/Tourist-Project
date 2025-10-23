# Authentication Security Tests

## Quick Test Commands

### Prerequisites
Make sure your development server is running:
```powershell
npm run dev
```

---

## Test 1: Invalid Credentials (Should Return 401)

### PowerShell Command:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"wrong@example.com","password":"wrongpassword"}' `
  -UseBasicParsing

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
```

### Expected Result:
```
Status Code: 401
Response: {"success":false,"error":"Invalid email or password"}
```

---

## Test 2: Missing Password (Should Return 400)

### PowerShell Command:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com"}' `
  -UseBasicParsing `
  -ErrorAction SilentlyContinue

if ($response) {
  Write-Host "Status Code: $($response.StatusCode)"
  Write-Host "Response: $($response.Content)"
} else {
  Write-Host "Error occurred (this is expected for 400 status)"
}
```

### Expected Result:
```
Status Code: 400
Response: {"success":false,"error":"Email and password are required"}
```

---

## Test 3: Valid Credentials (Should Return 200)

### PowerShell Command:
Replace with your actual test credentials:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"YOUR_EMAIL","password":"YOUR_PASSWORD"}' `
  -UseBasicParsing

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
```

### Expected Result:
```
Status Code: 200
Response: {"success":true,"role":"tourist","user":{...}}
```

---

## Alternative: Using cURL (if installed)

### Test Invalid Credentials:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"wrong@example.com\",\"password\":\"wrongpassword\"}" \
  -i
```

### Test Valid Credentials:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"YOUR_EMAIL\",\"password\":\"YOUR_PASSWORD\"}" \
  -i
```

---

## Verify Password Hashing in Supabase

1. Go to your Supabase Dashboard
2. Navigate to: **Authentication → Users**
3. Click on any user
4. Note: You will **NEVER** see the actual password
5. The password is stored as a bcrypt hash (starts with `$2a$` or `$2b$`)

---

## Check Development Logs

When running `npm run dev`, you should see:

### For Invalid Login (Development Mode):
```
Login failed: Invalid login credentials
```

### For Valid Login (Development Mode):
```
[No error logs - successful]
```

### In Production Mode:
```
[No detailed error logs - only generic errors shown to user]
```

---

## Security Verification Checklist

- [ ] Invalid credentials return HTTP 401
- [ ] Missing fields return HTTP 400
- [ ] Valid credentials return HTTP 200
- [ ] Error messages are generic (don't reveal if email exists)
- [ ] Passwords are never visible in Supabase dashboard
- [ ] Development logs show detailed errors
- [ ] Production logs don't expose sensitive information
- [ ] Account status is checked before allowing login
- [ ] Last login timestamp is updated on successful login

---

## Troubleshooting

### If tests fail:

1. **Check server is running:**
   ```powershell
   # Should see "Ready" message
   npm run dev
   ```

2. **Verify Supabase connection:**
   - Check `.env.local` has correct Supabase URL and key
   - Test connection in Supabase dashboard

3. **Check for TypeScript errors:**
   ```powershell
   npm run build
   ```

4. **Review error logs:**
   - Check terminal output
   - Look for Supabase connection errors

---

## Manual Testing via Browser

1. Go to: `http://localhost:3000/login`
2. Try invalid credentials → Should see "Invalid email or password"
3. Check browser DevTools → Network tab → Should see 401 status
4. Try valid credentials → Should redirect to dashboard
5. Check Network tab → Should see 200 status

---

**Test Guide Created:** October 23, 2025
