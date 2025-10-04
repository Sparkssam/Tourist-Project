# 📧 Safari Guide Email Setup Guide

## ✅ What Has Been Implemented

Your Free Safari Planning Guide now sends emails to users automatically! Here's what was added:

### 1. **Email Service Integration** ✅

- Installed **Resend** package for reliable email delivery
- Free tier: 3,000 emails/month, 100 emails/day
- Excellent deliverability rates

### 2. **Professional Email Template** ✅

- Beautiful HTML email with your brand colors
- Includes guide highlights and call-to-action
- Mobile-responsive design
- File: `lib/email-templates/safari-guide.tsx`

### 3. **API Endpoint** ✅

- Route: `/api/send-safari-guide`
- Validates email addresses
- Stores subscribers in database
- Sends beautiful HTML email
- Includes error handling

### 4. **Enhanced Form Component** ✅

- Loading states (spinner while sending)
- Error messages if something goes wrong
- Success confirmation with email icon
- "Send Another Guide" button
- File: `components/email-lead-magnet.tsx`

### 5. **Subscriber Database** ✅

- Table: `safari_guide_subscribers`
- Stores email, subscription date, and source
- Prevents duplicate subscriptions
- Admins can view all subscribers
- SQL file: `create-safari-guide-subscribers-table.sql`

---

## 🔧 Setup Required

### Step 1: Create Resend Account (FREE)

1. **Sign up at Resend:**

   - Go to: https://resend.com/signup
   - Sign up with your email
   - Verify your email address

2. **Get Your API Key:**

   - Go to: https://resend.com/api-keys
   - Click "Create API Key"
   - Name it: "Kekeo Safaris Production"
   - Copy the API key (starts with `re_...`)

3. **Add API Key to Vercel:**

   - Go to: https://vercel.com/derick-mhidzes-projects/tourist-project/settings/environment-variables
   - Click "Add New"
   - Name: `RESEND_API_KEY`
   - Value: Paste your API key
   - Click "Save"

4. **Redeploy Your Site:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Wait 2-3 minutes for deployment to complete

### Step 2: Verify Your Domain in Resend

To send emails from `noreply@kekeosafaris.com`, you need to verify your domain:

1. **Add Your Domain:**

   - Go to: https://resend.com/domains
   - Click "Add Domain"
   - Enter: `kekeosafaris.com`

2. **Add DNS Records:**
   - Resend will give you 3 DNS records to add:
     - SPF record (TXT)
     - DKIM record (TXT)
     - DMARC record (TXT)
3. **Where to Add DNS Records:**

   - Go to your domain registrar (where you bought kekeosafaris.com)
   - Common registrars: Namecheap, GoDaddy, Google Domains, Cloudflare
   - Find "DNS Settings" or "DNS Management"
   - Add the 3 TXT records provided by Resend
   - Wait 24-48 hours for DNS propagation

4. **Verify in Resend:**
   - After 24-48 hours, click "Verify" in Resend
   - Status should change to "Verified" ✅

### Step 3: Create Database Table

1. **Go to Supabase:**

   - Dashboard: https://supabase.com/dashboard
   - Select your project

2. **Run SQL:**

   - Click "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy the entire contents of `create-safari-guide-subscribers-table.sql`
   - Paste into the SQL editor
   - Click "Run"

3. **Verify Table Creation:**
   - Click "Table Editor"
   - You should see `safari_guide_subscribers` table
   - Columns: id, email, subscribed_at, source, created_at, updated_at

---

## 🧪 Testing the Email Functionality

### Option 1: Test with Resend's Test Email (Before Domain Verification)

While waiting for domain verification, you can test with Resend's default sending domain:

1. **Update API Route Temporarily:**

   - Open: `app/api/send-safari-guide/route.ts`
   - Change line 48:

   ```typescript
   from: 'Kekeo Safaris <onboarding@resend.dev>',  // Temporary for testing
   ```

2. **Test the Form:**

   - Go to: https://your-site.vercel.app/
   - Scroll to "Free Safari Planning Guide"
   - Enter your email
   - Click "Get Free Guide"
   - Check your email inbox (and spam folder)

3. **Revert After Testing:**
   - Change back to:
   ```typescript
   from: 'Kekeo Safaris <noreply@kekeosafaris.com>',
   ```

### Option 2: Test with Verified Domain (After DNS Setup)

Once your domain is verified in Resend:

1. **Go to Your Website:**

   - https://your-site.vercel.app/

2. **Submit the Form:**

   - Scroll to "Free Safari Planning Guide"
   - Enter your email address
   - Click "Get Free Guide"
   - You should see a loading spinner
   - Then a success message: "Check Your Email!"

3. **Check Your Inbox:**

   - Check your email (including spam folder)
   - You should receive a beautiful email with:
     - Subject: "🦁 Your Free Safari Planning Guide - Kekeo Safaris"
     - Professional HTML design
     - Guide highlights
     - Call-to-action button

4. **Check Database:**
   - Go to Supabase → Table Editor
   - Open `safari_guide_subscribers`
   - Your email should be listed

---

## 📎 Adding PDF Attachment (Optional)

If you have a PDF Safari Planning Guide you want to attach:

1. **Add PDF to Project:**

   - Create folder: `public/downloads/`
   - Add your PDF: `public/downloads/safari-planning-guide.pdf`

2. **Update API Route:**

   - Open: `app/api/send-safari-guide/route.ts`
   - Uncomment lines 53-58:

   ```typescript
   attachments: [
     {
       filename: 'Safari-Planning-Guide.pdf',
       path: './public/downloads/safari-planning-guide.pdf',
     },
   ],
   ```

3. **Alternative: Use Public URL:**
   ```typescript
   attachments: [
     {
       filename: 'Safari-Planning-Guide.pdf',
       content: await fetch('https://your-site.com/downloads/safari-planning-guide.pdf')
         .then(res => res.arrayBuffer())
         .then(buffer => Buffer.from(buffer))
     },
   ],
   ```

---

## 🎨 Customizing the Email Template

Edit `lib/email-templates/safari-guide.tsx` to customize:

### Change Colors:

```css
.header {
  background: linear-gradient(135deg, #8b4513 0%, #d2691e 100%);
}
```

### Change Content:

```tsx
<h1>Your Safari Planning Guide is Here!</h1>
```

### Add More Highlights:

```tsx
<li>
  <strong>New Item:</strong> Description here
</li>
```

### Change Links:

```tsx
<a href="https://kekeosafaris.com/tours" className="cta-button">
  Browse Our Safari Tours
</a>
```

---

## 📊 Viewing Subscribers (Admin)

Create an admin page to view all subscribers:

```typescript
// app/admin/safari-subscribers/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function SafariSubscribersPage() {
  const supabase = await createClient();

  const { data: subscribers } = await supabase
    .from("safari_guide_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  return (
    <div>
      <h1>Safari Guide Subscribers</h1>
      <p>Total: {subscribers?.length || 0}</p>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscribed At</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {subscribers?.map((sub) => (
            <tr key={sub.id}>
              <td>{sub.email}</td>
              <td>{new Date(sub.subscribed_at).toLocaleDateString()}</td>
              <td>{sub.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🚨 Troubleshooting

### Email Not Sending?

1. **Check API Key:**

   - Verify `RESEND_API_KEY` is set in Vercel
   - Make sure you redeployed after adding the key

2. **Check Browser Console:**

   - Open Developer Tools (F12)
   - Look for errors in the Console tab

3. **Check Network Tab:**

   - Look for `/api/send-safari-guide` request
   - Check the response status and message

4. **Check Vercel Logs:**
   - Go to: Vercel Dashboard → Your Project → Logs
   - Look for errors related to email sending

### Email Goes to Spam?

1. **Verify Your Domain:**

   - Make sure domain is verified in Resend
   - Add all DNS records (SPF, DKIM, DMARC)
   - Wait 24-48 hours after adding DNS records

2. **Use Professional Content:**
   - Avoid spam trigger words
   - Include unsubscribe link
   - Use proper HTML formatting

### Database Error?

1. **Check Table Exists:**

   - Go to Supabase → Table Editor
   - Verify `safari_guide_subscribers` table exists

2. **Check RLS Policies:**
   - Make sure anonymous inserts are allowed
   - Run the SQL file again if needed

---

## 💰 Resend Pricing

### Free Tier:

- **3,000 emails/month**
- **100 emails/day**
- **1 verified domain**
- **Perfect for getting started!**

### Paid Plans (if you need more):

- **$20/month**: 50,000 emails/month
- **$80/month**: 100,000 emails/month
- No daily limits on paid plans

---

## ✅ Checklist

Before going live, make sure:

- [ ] Resend account created
- [ ] API key added to Vercel environment variables
- [ ] Site redeployed after adding API key
- [ ] Domain verified in Resend (or using test domain temporarily)
- [ ] DNS records added (SPF, DKIM, DMARC)
- [ ] Database table created in Supabase
- [ ] Tested email sending with your own email
- [ ] Email received successfully (check spam folder)
- [ ] Subscriber stored in database
- [ ] Email template looks good on desktop and mobile
- [ ] PDF attached (if you have one)

---

## 📧 Support

If you need help:

1. **Resend Documentation:** https://resend.com/docs
2. **Resend Support:** https://resend.com/support
3. **Check Browser Console** for JavaScript errors
4. **Check Vercel Logs** for server errors
5. **Check Supabase Logs** for database errors

---

## 🎉 You're All Set!

Once setup is complete, users will:

1. Enter their email on your homepage
2. Click "Get Free Guide"
3. See a success message
4. Receive a beautiful email with the safari guide
5. Be stored in your database for future marketing

**Enjoy your new email marketing system!** 🦁✨
