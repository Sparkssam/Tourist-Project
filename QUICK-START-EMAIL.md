# 🚀 Quick Start Guide - Safari Email Feature

## ⏱️ 15-Minute Setup

Follow these 4 simple steps to activate email sending:

---

## Step 1: Create Resend Account (3 minutes)

1. Go to: **https://resend.com/signup**
2. Sign up with your email
3. Verify your email address
4. Go to: **https://resend.com/api-keys**
5. Click **"Create API Key"**
6. Name: `Kekeo Safaris Production`
7. **Copy the key** (starts with `re_...`)

---

## Step 2: Add API Key to Vercel (2 minutes)

1. Go to: **https://vercel.com**
2. Select your project: **Tourist-Project**
3. Go to: **Settings → Environment Variables**
4. Click **"Add New"**
   - Name: `RESEND_API_KEY`
   - Value: _Paste your API key from Step 1_
5. Click **"Save"**
6. Go to **Deployments** tab
7. Click **"Redeploy"** on latest deployment
8. Wait 2-3 minutes

---

## Step 3: Create Database Table (2 minutes)

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click **"SQL Editor"** (left sidebar)
4. Click **"New Query"**
5. Open file: `create-safari-guide-subscribers-table.sql`
6. **Copy all the SQL code**
7. **Paste** into Supabase SQL Editor
8. Click **"Run"** (green button)
9. Verify: Go to **Table Editor** → see `safari_guide_subscribers`

---

## Step 4: Test It! (3 minutes)

### For Testing (Temporary):

While waiting for domain verification, update this line in `app/api/send-safari-guide/route.ts`:

**Line 48, change:**

```typescript
from: 'Kekeo Safaris <noreply@kekeosafaris.com>',
```

**To:**

```typescript
from: 'Kekeo Safaris <onboarding@resend.dev>',
```

Then commit and push this change to trigger a redeploy.

### Test the Feature:

1. Go to your website: **https://your-site.vercel.app/**
2. Scroll to **"Free Safari Planning Guide"**
3. Enter your email address
4. Click **"Get Free Guide"**
5. You should see:
   - ⏳ Loading spinner
   - ✅ Success message: "Check Your Email!"
6. Check your inbox (and spam folder)
7. You should receive a beautiful email! 📧

---

## 🎯 What You Get

✅ **Beautiful Email Template** - Professional HTML design  
✅ **Instant Delivery** - Emails sent in seconds  
✅ **Subscriber Tracking** - Database stores all subscribers  
✅ **Admin Dashboard** - View all subscribers at `/admin/safari-subscribers`  
✅ **Loading States** - Professional UX with spinners and success messages  
✅ **Error Handling** - Shows helpful error messages  
✅ **Free Tier** - 3,000 emails/month included

---

## 📋 Verification Checklist

After completing all 4 steps, verify:

- [ ] Resend account created ✓
- [ ] API key copied ✓
- [ ] API key added to Vercel ✓
- [ ] Site redeployed ✓
- [ ] Database table created ✓
- [ ] Test email sent ✓
- [ ] Email received ✓
- [ ] Subscriber in database ✓
- [ ] Admin page shows subscriber ✓

---

## 🔄 Optional: Verify Your Domain (24-48 hours)

To send from `noreply@kekeosafaris.com` instead of `onboarding@resend.dev`:

1. Go to: **https://resend.com/domains**
2. Click **"Add Domain"**
3. Enter: `kekeosafaris.com`
4. Resend will show **3 DNS records** to add
5. Go to your **domain registrar** (where you bought the domain)
6. Find **"DNS Settings"** or **"DNS Management"**
7. Add all **3 TXT records** from Resend
8. Wait **24-48 hours** for DNS propagation
9. Go back to Resend → click **"Verify"**
10. Change `route.ts` line 48 back to: `noreply@kekeosafaris.com`
11. Commit, push, and redeploy

---

## 🎉 You're Done!

Your website now:

- Captures email leads automatically
- Sends professional safari guides instantly
- Builds your email list for future marketing
- Tracks all subscribers in admin dashboard

**View subscribers at:** `/admin/safari-subscribers`

---

## 🆘 Need Help?

- **Full Setup Guide:** See `EMAIL-SETUP-GUIDE.md`
- **Implementation Details:** See `IMPLEMENTATION-SUMMARY.md`
- **Resend Docs:** https://resend.com/docs
- **Resend Support:** https://resend.com/support

---

## 📊 What's Next?

Once emails are working:

1. Monitor subscribers in admin dashboard
2. Export emails for marketing campaigns
3. Add PDF attachment if you have a guide
4. Set up automated follow-up emails
5. Track conversion rates

**Happy emailing! 🦁✨**
