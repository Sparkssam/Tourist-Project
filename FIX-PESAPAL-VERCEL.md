# 🚨 URGENT FIX: Pesapal Credentials Missing on Vercel

## Problem

Your deployed website shows:
```
Payment Error
Failed to authenticate: Pesapal credentials not configured
```

**Root Cause:** Environment variables exist in `.env.local` (local) but NOT on Vercel (production).

---

## ✅ SOLUTION: Add Variables to Vercel

### **Method 1: Vercel Dashboard (Recommended - 5 minutes)**

#### Step 1: Go to Vercel
1. Open: **https://vercel.com/dashboard**
2. Find and click: **"tourist-project"** (or your project name)

#### Step 2: Open Settings
1. Click **"Settings"** tab (top menu)
2. Click **"Environment Variables"** (left sidebar)

#### Step 3: Add Variables

Click **"Add New"** and add each of these:

**Variable 1:**
```
Key: PESAPAL_CONSUMER_KEY
Value: dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Key: PESAPAL_CONSUMER_SECRET
Value: /6P0u8YouUHngXCrrh7Oe9he+Mk=
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 3:**
```
Key: PESAPAL_BASE_URL
Value: https://cybqa.pesapal.com/pesapalv3
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 4:**
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://tourist-project-eight.vercel.app
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 5 (Optional):**
```
Key: PESAPAL_IPN_ID
Value: your-ipn-id-here
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Step 4: Redeploy
1. Go to **"Deployments"** tab
2. Click **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for deployment to complete

#### Step 5: Test
1. Visit: https://tourist-project-eight.vercel.app
2. Click "Pay Now"
3. Fill payment form
4. Should now work! ✅

---

### **Method 2: Using Vercel CLI (For Developers)**

If you prefer command line:

#### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

#### Step 2: Run Script
We've created a script for you:

```powershell
cd "c:\Users\Derick Mhidze\kekeosafaris"
.\scripts\add-pesapal-to-vercel.ps1
```

This will:
- Login to Vercel
- Add all environment variables
- Trigger a redeploy

---

### **Method 3: Manual CLI Commands**

```powershell
# Login to Vercel
vercel login

# Add each variable
vercel env add PESAPAL_CONSUMER_KEY production
# When prompted, enter: dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk

vercel env add PESAPAL_CONSUMER_SECRET production
# When prompted, enter: /6P0u8YouUHngXCrrh7Oe9he+Mk=

vercel env add PESAPAL_BASE_URL production
# When prompted, enter: https://cybqa.pesapal.com/pesapalv3

vercel env add NEXT_PUBLIC_SITE_URL production
# When prompted, enter: https://tourist-project-eight.vercel.app

# Redeploy
vercel --prod
```

---

## 🔍 How to Verify It's Fixed

### Check 1: Vercel Dashboard
1. Go to: Settings → Environment Variables
2. You should see all 4-5 Pesapal variables listed

### Check 2: Deployment Logs
1. Go to: Deployments → Latest Deployment → Logs
2. Should NOT see: "Missing Pesapal credentials"
3. Should see: "Authentication successful" when testing payment

### Check 3: Test Payment
1. Visit: https://tourist-project-eight.vercel.app
2. Click "Pay Now" button
3. Fill payment form
4. Click "Proceed to Payment"
5. Should redirect to Pesapal payment page (not show error)

---

## ❓ Troubleshooting

### Issue: Variables added but still getting error

**Solution:**
1. Check variable names are EXACTLY:
   - `PESAPAL_CONSUMER_KEY` (not CONSUMER_KEY)
   - `PESAPAL_CONSUMER_SECRET` (not SECRET)
2. Check for typos in values (no extra spaces)
3. Ensure "Production" environment is checked
4. **MUST redeploy** after adding variables
5. Clear browser cache and try again

### Issue: Vercel CLI not working

**Solution:**
```powershell
# Install/reinstall Vercel CLI
npm uninstall -g vercel
npm install -g vercel

# Login again
vercel login
```

### Issue: Can't find my project in Vercel

**Solution:**
1. Check you're logged into correct Vercel account
2. Project might be named differently
3. Go to: https://vercel.com/dashboard
4. Look for "tourist-project" or "kekeosafaris"

---

## 📋 Checklist

Before testing:
- [ ] All 4 Pesapal variables added to Vercel
- [ ] All variables have "Production" checked
- [ ] No typos in variable names or values
- [ ] Redeployed after adding variables
- [ ] Waited for deployment to complete
- [ ] Cleared browser cache

After adding variables:
- [ ] No error in Vercel logs about missing credentials
- [ ] Payment modal opens without error
- [ ] "Proceed to Payment" button works
- [ ] Redirects to Pesapal page

---

## 🎯 Expected Behavior After Fix

### Before Fix (Current):
```
❌ Click "Pay Now"
❌ Error: "Pesapal credentials not configured"
❌ Logs: "Missing Pesapal credentials: { hasConsumerKey: false }"
```

### After Fix (Expected):
```
✅ Click "Pay Now"
✅ Payment modal opens
✅ Fill form and click "Proceed to Payment"
✅ Redirects to Pesapal payment page
✅ Logs: "Authentication successful" or "Order created successfully"
```

---

## 🚨 IMPORTANT Notes

### Security:
- ⚠️ **Never commit** `.env.local` to Git (it's already in .gitignore ✅)
- ⚠️ Variables in Vercel are encrypted and secure
- ⚠️ Only add variables through Vercel dashboard or CLI

### Environments:
- **Production** = Live website (tourist-project-eight.vercel.app)
- **Preview** = Pull request previews
- **Development** = Local development (vercel dev)

---

## 📞 Still Not Working?

### Option 1: Check Vercel Status
Visit: https://www.vercel-status.com/
(Might be a platform issue)

### Option 2: Contact Support
- **Vercel Support:** https://vercel.com/support
- **Their Discord:** https://vercel.com/discord

### Option 3: Double-Check Credentials
The test earlier showed: `"invalid_consumer_key_or_secret_provided"`

This means:
1. Credentials might be wrong
2. Might be for Production instead of Sandbox
3. Need activation in Pesapal dashboard

Contact Pesapal:
- Email: support@pesapal.com
- Phone: +254 20 2350950

---

## ⚡ Quick Summary

**What to do RIGHT NOW:**

1. Go to: https://vercel.com/dashboard
2. Open your project → Settings → Environment Variables
3. Add 4 Pesapal variables (see Variable 1-4 above)
4. Click "Save" for each
5. Go to Deployments → Redeploy latest
6. Wait 2-3 minutes
7. Test payment at: https://tourist-project-eight.vercel.app

**Time Required:** 5-10 minutes

**After this:** Your payment integration should work! 🎉

---

## 📚 Related Documentation

- **PESAPAL-QUICK-START.md** - Quick reference
- **PESAPAL-INTEGRATION-GUIDE.md** - Full guide
- **VERCEL-DEPLOYMENT-GUIDE.md** - Deployment help

---

**Need more help?** Re-run this guide or check the full documentation files.
