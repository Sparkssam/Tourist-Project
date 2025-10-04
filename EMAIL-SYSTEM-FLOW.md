# 📊 Safari Email System - Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER EXPERIENCE                             │
└─────────────────────────────────────────────────────────────────────┘

1. User visits homepage
   │
   ├─→ Scrolls to "Free Safari Planning Guide" section
   │
   ├─→ Enters email: user@example.com
   │
   ├─→ Clicks "Get Free Guide" button
   │
   ├─→ Sees loading spinner (🔄)
   │
   ├─→ Sees success message (✅)
   │
   └─→ Receives beautiful email (📧)


┌─────────────────────────────────────────────────────────────────────┐
│                      TECHNICAL FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Homepage        │  User enters email
│  email-lead-     │  and clicks button
│  magnet.tsx      │
└────────┬─────────┘
         │
         │ POST /api/send-safari-guide
         │ { "email": "user@example.com" }
         │
         ▼
┌──────────────────┐
│  API Route       │  1. Validate email
│  send-safari-    │  2. Check XSS
│  guide/route.ts  │  3. Sanitize input
└────────┬─────────┘
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼                                     ▼
┌──────────────────┐                  ┌──────────────────┐
│  Supabase DB     │                  │  Resend Email    │
│  safari_guide_   │                  │  Service         │
│  subscribers     │                  │                  │
└────────┬─────────┘                  └────────┬─────────┘
         │                                     │
         │ Store subscriber                    │ Send HTML email
         │ (email, timestamp)                  │ using template
         │                                     │
         ▼                                     ▼
┌──────────────────┐                  ┌──────────────────┐
│  Database Table  │                  │  User's Inbox    │
│  ✅ Stored        │                  │  📧 Email        │
└──────────────────┘                  │  delivered       │
                                      └──────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      FILE STRUCTURE                                 │
└─────────────────────────────────────────────────────────────────────┘

kekeosafaris/
│
├── components/
│   └── email-lead-magnet.tsx           ← Form component (MODIFIED)
│
├── lib/
│   ├── email-templates/
│   │   └── safari-guide.tsx            ← Email template (NEW)
│   └── security/
│       └── xss-protection.ts           ← Email validation (EXISTING)
│
├── app/
│   ├── api/
│   │   └── send-safari-guide/
│   │       └── route.ts                ← API endpoint (NEW)
│   └── admin/
│       └── safari-subscribers/
│           └── page.tsx                ← Admin dashboard (NEW)
│
├── create-safari-guide-subscribers-table.sql  ← Database setup (NEW)
├── EMAIL-SETUP-GUIDE.md                       ← Setup guide (NEW)
├── IMPLEMENTATION-SUMMARY.md                  ← Full docs (NEW)
├── QUICK-START-EMAIL.md                       ← Quick start (NEW)
└── .env.example                               ← Env template (NEW)


┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                                │
└─────────────────────────────────────────────────────────────────────┘

Table: safari_guide_subscribers
┌──────────────┬─────────────┬─────────────────────────────────────┐
│ Column       │ Type        │ Description                         │
├──────────────┼─────────────┼─────────────────────────────────────┤
│ id           │ uuid        │ Primary key (auto-generated)        │
│ email        │ text        │ Subscriber email (unique)           │
│ subscribed_at│ timestamptz │ When user subscribed                │
│ source       │ text        │ Where subscription came from        │
│ created_at   │ timestamptz │ Record creation time                │
│ updated_at   │ timestamptz │ Last update time                    │
└──────────────┴─────────────┴─────────────────────────────────────┘

Indexes:
• idx_safari_guide_subscribers_email (faster lookups)
• idx_safari_guide_subscribers_subscribed_at (date filtering)

Security (RLS):
• Anonymous users: Can INSERT (for public form)
• Admin users: Can SELECT (view all subscribers)
• Service role: Full access


┌─────────────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                                │
└─────────────────────────────────────────────────────────────────────┘

URL: /admin/safari-subscribers

┌─────────────────────────────────────────────────────────────────────┐
│  Safari Guide Subscribers                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   Total     │  │   Today     │  │  This Week  │  │This Month │ │
│  │    125      │  │     5       │  │     23      │  │    47     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Email               │ Subscribed Date      │ Source           │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │ user1@gmail.com     │ Oct 5, 2025, 10:30  │ home_page_lead.. │ │
│  │ user2@yahoo.com     │ Oct 5, 2025, 09:15  │ home_page_lead.. │ │
│  │ user3@hotmail.com   │ Oct 4, 2025, 18:45  │ home_page_lead.. │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      EMAIL TEMPLATE                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Subject: 🦁 Your Free Safari Planning Guide - Kekeo Safaris        │
│  From: Kekeo Safaris <noreply@kekeosafaris.com>                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                   🦁                                          │ │
│  │    Your Safari Planning Guide is Here!                       │ │
│  │         (Brown gradient header background)                   │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Hello Safari Adventurer,                                          │
│                                                                     │
│  Thank you for downloading our comprehensive Safari Planning       │
│  Guide! We're thrilled to help you prepare for the adventure of   │
│  a lifetime in Tanzania.                                           │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 📚 What's Inside Your Guide:                                  │ │
│  │                                                                │ │
│  │ • Best Times to Visit                                         │ │
│  │ • Complete Packing List                                       │ │
│  │ • Safari Etiquette                                            │ │
│  │ • Photography Tips                                            │ │
│  │ • Health & Safety                                             │ │
│  │ • Budget Planning                                             │ │
│  │ • Insider Tips                                                │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  This 25-page guide is packed with insights from our team of       │
│  experienced safari guides who have been leading tours across      │
│  Tanzania for over a decade.                                       │
│                                                                     │
│              ┌─────────────────────────────┐                       │
│              │  Browse Our Safari Tours    │  ← Button             │
│              └─────────────────────────────┘                       │
│                                                                     │
│  Ready to book your dream safari?                                  │
│  Contact us for a personalized itinerary tailored to your          │
│  interests, budget, and travel dates.                              │
│                                                                     │
│  ──────────────────────────────────────────────────────────────    │
│                                                                     │
│  Kekeo Safaris                                                     │
│  Experience the Magic of Tanzania                                  │
│                                                                     │
│  Visit Our Website | Contact Us                                    │
│                                                                     │
│  Unsubscribe                                                       │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      SETUP CHECKLIST                                │
└─────────────────────────────────────────────────────────────────────┘

Prerequisites:
□ Website deployed on Vercel
□ Supabase project set up
□ Database tables created

Setup Steps:
□ 1. Create Resend account (https://resend.com)
□ 2. Get API key from Resend dashboard
□ 3. Add RESEND_API_KEY to Vercel environment variables
□ 4. Redeploy site from Vercel
□ 5. Run SQL file in Supabase (create table)
□ 6. Test email sending with your email
□ 7. Verify email received
□ 8. Check subscriber in database
□ 9. Verify admin page shows subscriber

Optional (for production):
□ 10. Verify domain in Resend (24-48 hours)
□ 11. Add DNS records (SPF, DKIM, DMARC)
□ 12. Update 'from' address to use your domain
□ 13. Test from production domain


┌─────────────────────────────────────────────────────────────────────┐
│                      SUCCESS METRICS                                │
└─────────────────────────────────────────────────────────────────────┘

After setup, you can track:

📊 Total Subscribers: All-time count
📅 Daily Growth: New subscribers each day
📈 Weekly Trends: 7-day rolling average
📆 Monthly Stats: Current month performance

Location: /admin/safari-subscribers


┌─────────────────────────────────────────────────────────────────────┐
│                      SUPPORT & RESOURCES                            │
└─────────────────────────────────────────────────────────────────────┘

Documentation:
• QUICK-START-EMAIL.md      → 15-minute setup guide
• EMAIL-SETUP-GUIDE.md       → Complete setup instructions
• IMPLEMENTATION-SUMMARY.md  → Technical documentation

External Resources:
• Resend Docs:    https://resend.com/docs
• Resend Support: https://resend.com/support
• Resend API:     https://resend.com/api-keys
• Resend Domains: https://resend.com/domains


┌─────────────────────────────────────────────────────────────────────┐
│                      PRICING (Resend)                               │
└─────────────────────────────────────────────────────────────────────┘

FREE TIER (Perfect for starting):
• 3,000 emails/month
• 100 emails/day
• 1 verified domain
• ✅ Recommended for your needs

PAID PLANS (if needed later):
• $20/month: 50,000 emails
• $80/month: 100,000 emails
• No daily limits


┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT STEPS                                     │
└─────────────────────────────────────────────────────────────────────┘

1. ✅ Code implementation: COMPLETE
2. 🔧 Setup Resend account: YOUR ACTION NEEDED
3. 🔧 Add API key to Vercel: YOUR ACTION NEEDED
4. 🔧 Create database table: YOUR ACTION NEEDED
5. 🧪 Test email sending: YOUR ACTION NEEDED

Follow: QUICK-START-EMAIL.md (15 minutes to complete)


═══════════════════════════════════════════════════════════════════════

🎉 You're ready to capture leads and grow your email list! 🦁

═══════════════════════════════════════════════════════════════════════
```
