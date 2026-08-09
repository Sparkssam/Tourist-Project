# Resend Email Troubleshooting Guide

## Issue: Forms not submitting / Emails not sending

### Step 1: Restart Your Dev Server (CRITICAL!)
After changing `.env.local`, you **MUST restart your dev server**:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
# or
pnpm dev
```

Environment variables are only loaded when the server starts, so changes won't take effect until restart.

### Step 2: Check the Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try submitting a form
4. Look for any error messages

### Step 3: Check the Terminal/Server Logs
When you submit a form, you should see logs like:
```
Email configuration: { recipient, resendConfigured, smtpConfigured, ... }
Attempting to send email via Resend...
Resend email result: true/false
```

**If you don't see these logs**, the API route isn't being called.

### Step 4: Verify Resend API Key
Your API key in `.env.local` should look like: `re_xxxxxxxxxxxx`
- Make sure there are no spaces before/after the key
- Make sure the key is valid (check your Resend dashboard)

### Step 5: Verify "From" Email Address
Resend requires the "from" email to be verified in your Resend account.

**Current configuration:**
- `FROM_EMAIL=samsuya999@gmail.com` (in .env.local)
- This email MUST be verified in your Resend dashboard

**To fix:**
1. Go to https://resend.com/domains
2. Verify that `kekeosafaris.com` is added and verified
3. Use an email from that domain, OR verify `samsuya999@gmail.com` as a sender

**Quick fix - use Resend's default domain:**
Change the from email to: `onboarding@resend.dev` (only for testing)

### Step 6: Test the API Directly
Use this curl command to test if the API works:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

You should get a response like:
```json
{
  "success": true,
  "emailSent": true,
  "resendConfigured": true
}
```

### Step 7: Common Issues

#### Issue: "Resend send failed" in logs
**Cause:** Invalid API key or unverified sender email

**Solution:**
1. Verify your API key at https://resend.com/api-keys
2. Verify your sender domain at https://resend.com/domains
3. Use a verified email address as the "from" email

#### Issue: Forms submit but no email arrives
**Cause:** Email is being sent but going to spam, or "from" email not verified

**Solution:**
1. Check spam folder
2. Verify sender domain in Resend
3. Add SPF/DKIM records for your domain

#### Issue: "Server error" response
**Cause:** API route is crashing

**Solution:**
1. Check the terminal logs for the actual error
2. Make sure all environment variables are set correctly
3. Restart the dev server

### Step 8: Quick Diagnostic Test

Add this temporary route to test Resend directly:

```typescript
// app/api/test-email/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@kekeosafaris.com',
      to: ['samsuya999@gmail.com'],
      subject: 'Test Email',
      html: '<h1>Test</h1>',
    })
    
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error?.message,
      details: error?.stack 
    }, { status: 500 })
  }
}
```

Then test with:
```bash
curl -X POST http://localhost:3000/api/test-email
```

## Current Configuration

**Environment Variables:**
- ✅ `RESEND_API_KEY` - Set
- ✅ `ENQUIRY_RECIPIENT` - Set to `samsuya999@gmail.com`
- ✅ `FROM_EMAIL` - Set to `samsuya999@gmail.com`
- ⚠️ Supabase - Not configured (using placeholders)

**Email Flow:**
1. Form submits to `/api/contact` or `/api/tour-inquiry`
2. API tries to save to Supabase (optional, won't block if fails)
3. API sends email via Resend
4. Email goes to `samsuya999@gmail.com`

## Need More Help?

Check the server logs when submitting a form. The logs will show:
- Whether Resend is configured
- What email is being sent
- Any errors from Resend API