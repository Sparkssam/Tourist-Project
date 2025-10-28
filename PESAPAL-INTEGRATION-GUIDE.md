# 💳 Pesapal Payment Integration Guide

## Overview

Your Kekeo Safaris website is now integrated with **Pesapal Payment Gateway** for secure online payments. This guide covers setup, testing, and going live.

---

## ✅ Integration Status

### **Completed:**
- ✅ Pesapal API credentials configured
- ✅ Authentication endpoint (`/api/pesapal/auth`)
- ✅ Order submission endpoint (`/api/pesapal/submit-order`)
- ✅ Payment modal component (`PesapalPaymentModal`)
- ✅ Payment callback page (`/payment/callback`)
- ✅ Sandbox environment configured

### **Your Credentials:**
```
Consumer Key: dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk
Consumer Secret: /6P0u8YouUHngXCrrh7Oe9he+Mk=
Environment: Sandbox (Testing)
```

---

## 🚀 Quick Start Guide

### **Step 1: Register IPN URL with Pesapal**

IPN (Instant Payment Notification) tells your website when payments are completed.

1. **Log in to Pesapal Dashboard:**
   - Go to: https://www.pesapal.com/dashboard
   - Use your Pesapal account credentials

2. **Navigate to IPN Settings:**
   - Go to **Settings** → **IPN Settings** (or **Webhooks**)

3. **Register Your IPN URL:**
   - **URL:** `https://your-domain.com/api/pesapal/ipn`
   - **For Local Testing:** `http://localhost:3000/api/pesapal/ipn`
   - **Method:** POST
   - Click **Register** or **Save**

4. **Copy the IPN ID:**
   - After registration, you'll get an **IPN ID**
   - Copy this ID

5. **Update Environment Variable:**
   - Open your `.env.local` file
   - Update: `PESAPAL_IPN_ID=your-copied-ipn-id`

---

### **Step 2: Test Payment Flow (Sandbox)**

Currently, you're in **Sandbox Mode** (testing environment).

#### **A) Start Your Development Server**
```powershell
cd "c:\Users\Derick Mhidze\kekeosafaris"
npm run dev
```

#### **B) Test the Payment Flow**

1. **Visit Your Website:**
   - Go to: http://localhost:3000

2. **Trigger Payment Modal:**
   - Click "Pay Now" button in the footer
   - Or navigate to a tour and click "Book Now"

3. **Fill Payment Form:**
   - **Amount:** Enter test amount (e.g., 500)
   - **Currency:** USD (or TZS for Tanzanian Shillings)
   - **Email:** Your test email
   - **Phone:** Test phone number
   - **Name:** Your name
   - Click **"Proceed to Payment"**

4. **Complete Test Payment:**
   - You'll be redirected to Pesapal's payment page
   - Use Pesapal's test card numbers:
     - **Card Number:** 4111 1111 1111 1111
     - **CVV:** 123
     - **Expiry:** Any future date
     - **OTP:** 123456

5. **Verify Callback:**
   - After payment, you'll be redirected to `/payment/callback`
   - Check the status message

---

### **Step 3: Monitor Payment Status**

#### **Check Browser Console:**
```javascript
// Look for these logs:
[v0] Getting authentication token...
[v0] Authentication successful, got token
[v0] Submitting order to Pesapal
[v0] Order created successfully
[v0] Redirecting to Pesapal payment page
```

#### **Check Terminal Logs:**
```bash
Order submission request received
[v0] Getting authentication token...
[v0] Pesapal auth response status: 200
[v0] Pesapal authentication successful
[v0] Submitting order to Pesapal: { orderId: 'KEKEO-...', amount: 500 }
[v0] Pesapal order response status: 200
[v0] Order created successfully
```

---

## 🔧 Configuration Details

### **Environment Variables**

Your `.env.local` file now contains:

```bash
# Pesapal Payment Gateway Configuration
PESAPAL_CONSUMER_KEY=dtbMlEWrPGjWUDGhltgIYAs9EnVtouKk
PESAPAL_CONSUMER_SECRET=/6P0u8YouUHngXCrrh7Oe9he+Mk=

# Sandbox URL (for testing)
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3

# Your website URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# IPN ID (register this in Pesapal dashboard)
PESAPAL_IPN_ID=your-ipn-id-here
```

---

## 📡 API Endpoints

### **1. Authentication Endpoint**
**File:** `app/api/pesapal/auth/route.ts`

**Purpose:** Gets OAuth token from Pesapal

**Request:**
```javascript
POST /api/pesapal/auth
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiryDate": "2025-10-28T12:00:00Z"
}
```

---

### **2. Order Submission Endpoint**
**File:** `app/api/pesapal/submit-order/route.ts`

**Purpose:** Creates payment order and gets payment URL

**Request:**
```javascript
POST /api/pesapal/submit-order
Content-Type: application/json

{
  "amount": 500,
  "currency": "USD",
  "description": "Safari Tour Booking",
  "customerEmail": "customer@example.com",
  "customerPhone": "+255712345678",
  "customerName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "KEKEO-1730123456789-abc123xyz",
  "paymentUrl": "https://cybqa.pesapal.com/iframe/...",
  "orderTrackingId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

---

### **3. Payment Callback**
**File:** `app/payment/callback/page.tsx`

**Purpose:** Handles user return after payment

**URL Parameters:**
- `OrderTrackingId`: Pesapal's tracking ID
- `OrderMerchantReference`: Your order ID (KEKEO-...)
- `OrderNotificationType`: Payment status

---

## 🧪 Testing Guide

### **Test Credit Cards (Sandbox)**

Use these test cards in Pesapal sandbox:

| Card Type | Card Number | CVV | Status |
|-----------|-------------|-----|--------|
| Visa | 4111 1111 1111 1111 | 123 | Success |
| Mastercard | 5500 0000 0000 0004 | 123 | Success |
| Declined | 4000 0000 0000 0002 | 123 | Declined |

**Test OTP:** 123456

---

### **Test Scenarios**

#### **Scenario 1: Successful Payment**
1. Enter amount: $100
2. Use card: 4111 1111 1111 1111
3. OTP: 123456
4. Expected: Redirect to callback with success

#### **Scenario 2: Failed Payment**
1. Enter amount: $50
2. Use declined card: 4000 0000 0000 0002
3. Expected: Payment declined message

#### **Scenario 3: Missing Fields**
1. Leave email empty
2. Click "Proceed to Payment"
3. Expected: Validation error

---

## 🔐 Security Features

Your integration includes:

✅ **OAuth 2.0 Authentication** - Secure token-based API access  
✅ **HTTPS Only** - All production traffic encrypted  
✅ **Input Validation** - Server-side validation of all fields  
✅ **Sanitized Logging** - No sensitive customer data in logs  
✅ **Environment Variables** - Credentials stored securely  
✅ **CSRF Protection** - Next.js built-in protection  

---

## 🌍 Going Live (Production)

When you're ready to accept real payments:

### **Step 1: Get Production Credentials**

1. **Contact Pesapal Support:**
   - Email: support@pesapal.com
   - Request production credentials
   - Complete KYC verification

2. **Get Production Keys:**
   - Consumer Key (production)
   - Consumer Secret (production)

---

### **Step 2: Update Environment Variables**

**For Local Development:**
Update `.env.local`:
```bash
PESAPAL_CONSUMER_KEY=your_production_key
PESAPAL_CONSUMER_SECRET=your_production_secret
PESAPAL_BASE_URL=https://pay.pesapal.com/v3
NEXT_PUBLIC_SITE_URL=https://kekeosafaris.vercel.app
```

**For Vercel Deployment:**
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update these variables:
   - `PESAPAL_CONSUMER_KEY` = Your production key
   - `PESAPAL_CONSUMER_SECRET` = Your production secret
   - `PESAPAL_BASE_URL` = `https://pay.pesapal.com/v3`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`
   - `PESAPAL_IPN_ID` = Your production IPN ID

5. Click **"Save"**
6. **Redeploy** your application

---

### **Step 3: Register Production IPN**

1. Log in to Pesapal production dashboard
2. Register IPN URL: `https://your-domain.com/api/pesapal/ipn`
3. Copy the production IPN ID
4. Update `PESAPAL_IPN_ID` in Vercel

---

### **Step 4: Test Production**

Before going live:
1. Make a small test transaction (e.g., $1)
2. Use a real credit/debit card
3. Verify payment completes
4. Check callback receives correct status
5. Verify IPN notification arrives

---

## 💰 Supported Payment Methods

Pesapal supports:

✅ **Credit/Debit Cards:** Visa, Mastercard, Amex  
✅ **Mobile Money:** M-Pesa, Airtel Money, Tigo Pesa  
✅ **Bank Transfers:** Direct bank payments  
✅ **PayPal:** International payments  

---

## 🔄 Payment Workflow

```
1. Customer clicks "Pay Now"
   ↓
2. PesapalPaymentModal opens
   ↓
3. Customer enters payment details
   ↓
4. Frontend calls /api/pesapal/auth (get token)
   ↓
5. Frontend calls /api/pesapal/submit-order (create order)
   ↓
6. Customer redirected to Pesapal payment page
   ↓
7. Customer completes payment on Pesapal
   ↓
8. Pesapal redirects to /payment/callback
   ↓
9. Backend receives IPN notification (async)
   ↓
10. Order status updated in database
```

---

## 📊 Monitoring Payments

### **Check Payment Status**

To verify a payment:

```javascript
// Call Pesapal transaction status API
GET https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus
Headers:
  Authorization: Bearer {token}
  orderTrackingId: {tracking-id}
```

### **Database Integration**

Store payment records in Supabase:

```sql
-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(255) UNIQUE NOT NULL,
  tracking_id UUID,
  customer_email VARCHAR(255),
  amount DECIMAL(10, 2),
  currency VARCHAR(3),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🐛 Troubleshooting

### **Issue 1: "Missing Pesapal credentials"**

**Solution:**
- Check `.env.local` file exists
- Verify `PESAPAL_CONSUMER_KEY` and `PESAPAL_CONSUMER_SECRET` are set
- Restart development server: `npm run dev`

---

### **Issue 2: "Authentication failed"**

**Solution:**
- Verify credentials are correct (no extra spaces)
- Check you're using correct environment (sandbox vs production)
- Test credentials in Pesapal dashboard

---

### **Issue 3: "Failed to create order"**

**Solution:**
- Check all required fields are provided
- Verify token is valid (not expired)
- Check API response in browser console
- Look for detailed error in terminal logs

---

### **Issue 4: "Payment not redirecting back"**

**Solution:**
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Check callback URL in Pesapal dashboard
- Ensure `/payment/callback` page exists
- Test callback URL in browser

---

### **Issue 5: "IPN not received"**

**Solution:**
- Verify IPN URL is registered in Pesapal
- Check IPN ID is correct in `.env.local`
- Create IPN endpoint: `/api/pesapal/ipn`
- Test IPN URL is publicly accessible (use ngrok for local testing)

---

## 📞 Support & Resources

### **Pesapal Resources:**
- **Dashboard:** https://www.pesapal.com/dashboard
- **API Documentation:** https://developer.pesapal.com
- **Support Email:** support@pesapal.com
- **Phone:** +254 20 2350950 (Kenya)

### **Your Integration:**
- **Auth Endpoint:** `/api/pesapal/auth`
- **Order Endpoint:** `/api/pesapal/submit-order`
- **Callback Page:** `/payment/callback`
- **Payment Modal:** `components/pesapal-payment-modal.tsx`

---

## 🎯 Next Steps

1. **✅ Credentials Added** - Your Pesapal keys are configured
2. **⏳ Register IPN** - Add IPN URL in Pesapal dashboard
3. **⏳ Test Payments** - Use sandbox to test flow
4. **⏳ Create IPN Handler** - Build `/api/pesapal/ipn` endpoint
5. **⏳ Database Integration** - Store payment records
6. **⏳ Production Setup** - Switch to live credentials
7. **⏳ Go Live!** - Accept real payments

---

## 🚨 Important Notes

### **Security Reminders:**
- ⚠️ **Never commit** `.env.local` to Git
- ⚠️ **Never expose** credentials in frontend code
- ⚠️ **Always validate** payment status via IPN, not just callback
- ⚠️ **Use HTTPS** in production
- ⚠️ **Verify transactions** server-side before fulfilling orders

### **Cost Considerations:**
- Pesapal charges transaction fees (typically 3-5%)
- Check your agreement for exact rates
- Consider these fees in your pricing

---

## ✅ Integration Checklist

Before going live:

- [x] Pesapal credentials configured
- [x] Sandbox testing environment setup
- [ ] IPN URL registered with Pesapal
- [ ] IPN handler endpoint created
- [ ] Payment database table created
- [ ] Test payments completed successfully
- [ ] Error handling tested
- [ ] Production credentials obtained
- [ ] Production environment configured
- [ ] Real payment test completed
- [ ] Customer support process defined
- [ ] Refund process documented

---

**Your Pesapal integration is ready for testing! 🎉**

Start by registering your IPN URL and testing the payment flow in sandbox mode.
