# Testing Contact & Enquiry Forms

## Quick Test

### Step 1: Restart Your Dev Server (REQUIRED!)
```bash
# Stop the server (Ctrl+C in the terminal)
# Then restart:
npm run dev
```

### Step 2: Test the API Directly (Already Confirmed Working ✅)
The API test showed:
```json
{
  "success": true,
  "emailSent": true,
  "resendConfigured": true
}
```

This means emails ARE being sent! Check your inbox at `samsuya999@gmail.com`.

### Step 3: Test the Frontend Forms

#### Test the Contact Form:
1. Go to your contact page (usually `/contact`)
2. Fill in the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Subject: "Test"
   - Message: "This is a test message"
3. Click "Send Message"
4. **Check the browser console (F12) for any errors**

#### Test the Inquiry Form:
1. Go to `/inquiry`
2. Fill in the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "1234567890"
   - Preferred Route: Select any tour
   - Message: "This is a test enquiry"
3. Click "Submit Enquiry"
4. **Check the browser console (F12) for any errors**

### Step 4: Check Server Logs

When you submit a form, you should see in your terminal:
```
Email configuration: { recipient, resendConfigured: true, ... }
Attempting to send email via Resend...
Resend email result: true
```

**If you see these logs**, the email was sent successfully!

**If you don't see these logs**, the API route isn't being called (frontend issue).

### Step 5: Check for Error Messages

The forms now show detailed error messages. Common errors:

#### "Missing required fields (name, email, message)"
**Cause:** You didn't fill in all required fields
**Solution:** Make sure name, email, AND message are filled

#### "Server error"
**Cause:** Something crashed in the API
**Solution:** Check the terminal logs for the actual error

#### Network error
**Cause:** Can't reach the API
**Solution:** Make sure the dev server is running on port 3000

## What to Expect

### Success:
- Form shows green success message: "Enquiry Received!"
- You receive an email at `samsuya999@gmail.com`
- Server logs show: `Resend email result: true`

### Failure:
- Form shows red error message with specific error details
- Check browser console (F12) for JavaScript errors
- Check terminal for server-side errors

## Debugging Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] Server shows no errors on startup
- [ ] `.env.local` has `RESEND_API_KEY` set (no asterisk before it)
- [ ] Browser console (F12) shows no errors when submitting
- [ ] Terminal shows email configuration logs when submitting
- [ ] Email arrives in `samsuya999@gmail.com` (check spam folder too)

## Common Issues

### Issue: "Resend send failed" in terminal
**Cause:** Invalid API key or unverified sender email
**Check:**
1. Is `RESEND_API_KEY` correct in `.env.local`?
2. Is the "from" email verified in Resend dashboard?
3. Try changing `FROM_EMAIL` to `onboarding@resend.dev` for testing

### Issue: Form shows "Server error"
**Cause:** API route is crashing
**Check:**
1. Look at the terminal for the actual error message
2. Make sure you restarted the dev server after changing `.env.local`
3. Check that all environment variables are set correctly

### Issue: Nothing happens when clicking submit
**Cause:** JavaScript error or form not connected to API
**Check:**
1. Open browser console (F12) and look for errors
2. Make sure the form has `onSubmit` handler
3. Check that the fetch URL is correct (`/api/contact`)

### Issue: Email not received
**Cause:** Email sent but not delivered
**Check:**
1. Spam/junk folder
2. Resend dashboard logs (https://resend.com/emails)
3. Verify sender domain in Resend

## Still Not Working?

1. **Open browser console (F12)** and submit the form
2. **Copy any error messages** you see
3. **Check the terminal** for server logs
4. **Share the exact error message** so I can help debug

The error messages will now be displayed on the form, so you'll see exactly what's wrong!