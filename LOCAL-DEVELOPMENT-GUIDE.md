# 🏠 Local Development Setup Guide

This guide will help you run the Kekeo Safaris website on your local machine (localhost).

---

## ✅ Prerequisites

Before starting, make sure you have:

- [x] **Node.js** installed (v18 or higher)
- [x] **npm** or **pnpm** package manager
- [x] **Git** (if cloning from repository)
- [x] **Supabase account** with project created
- [x] **Text editor** (VS Code recommended)

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages locally in the `node_modules` folder.

### Step 2: Environment Variables

Your `.env.local` file is already configured with:
- ✅ Supabase URL
- ✅ Supabase Anon Key
- ✅ Supabase Service Role Key
- ✅ Super Admin Secret

**For Resend Email (if using email feature):**

Add this line to your `.env.local` file:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

Get your Resend API key from: https://resend.com/api-keys

### Step 3: Verify Database Tables

Make sure all database tables are created in Supabase:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor"
4. Run these SQL files (if not already done):
   - `supabase-schema.sql`
   - `update-inquiries-and-reviews-tables.sql`
   - `create-safari-guide-subscribers-table.sql`

### Step 4: Start Development Server

Run the development server:

```bash
npm run dev
```

You should see:

```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
○ Network: http://192.168.x.x:3000
```

### Step 5: Open in Browser

Open your browser and go to:

```
http://localhost:3000
```

🎉 **Your website is now running locally!**

---

## 📝 Available Scripts

### Development

```bash
npm run dev
```
- Starts development server on http://localhost:3000
- Auto-reloads when you make changes
- Shows errors in real-time

### Build (Test Production Build)

```bash
npm run build
```
- Creates optimized production build
- Tests for any build errors
- Use this before deploying

### Start Production Server

```bash
npm run start
```
- Runs production build locally
- Must run `npm run build` first
- Uses port 3000 by default

### Lint

```bash
npm run lint
```
- Checks code for errors
- Helps maintain code quality

### Custom Scripts

```bash
npm run create-super-admin
```
- Creates a super admin account
- Interactive CLI tool

```bash
npm run create-admin
```
- Creates regular admin account
- Simpler than super admin

---

## 🔧 Configuration Files

### `.env.local` (Your Environment Variables)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://llojsesjbjbzdccddonp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPER_ADMIN_SECRET=kekeo_safari_super_admin_2024_secret_key
RESEND_API_KEY=your_resend_key (optional for email)
```

**Important:** 
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Keep your keys secret
- Use different keys for local and production

### `package.json` (Project Configuration)
- Lists all dependencies
- Defines npm scripts
- Already configured for local development

### `next.config.mjs` (Next.js Configuration)
- Next.js settings
- Security headers
- Image domains
- Already optimized

---

## 🌐 Local URLs

After starting the dev server, you can access:

### Public Pages
- Home: http://localhost:3000/
- About: http://localhost:3000/about
- Tours: http://localhost:3000/tours
- Gallery: http://localhost:3000/gallery
- Blog: http://localhost:3000/blog
- Contact: http://localhost:3000/contact
- Reviews: http://localhost:3000/reviews

### Authentication
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register

### Admin Dashboard
- Admin Home: http://localhost:3000/admin
- User Management: http://localhost:3000/admin/users
- Inquiries: http://localhost:3000/admin/inquiries
- Reviews: http://localhost:3000/admin/reviews
- Subscribers: http://localhost:3000/admin/safari-subscribers

### Staff Dashboard
- Staff Home: http://localhost:3000/staff
- Staff Inquiries: http://localhost:3000/staff/inquiries
- Staff Profile: http://localhost:3000/staff/profile

### Tourist Dashboard
- Tourist Home: http://localhost:3000/tourist
- My Tours: http://localhost:3000/tourist/tours
- My Inquiries: http://localhost:3000/tourist/inquiries

---

## 🔍 Troubleshooting

### Port 3000 Already in Use

If you see: `Error: Port 3000 is already in use`

**Solution 1: Kill the process**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Solution 2: Use a different port**
```bash
npm run dev -- -p 3001
```
Then visit: http://localhost:3001

### Module Not Found Errors

If you see: `Error: Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Supabase Connection Errors

If you see: `Error: Invalid API key`

**Solution:**
1. Check `.env.local` file exists
2. Verify Supabase keys are correct
3. Restart dev server: `Ctrl+C` then `npm run dev`

### "Module not found: Can't resolve '@/...'

If you see import errors:

**Solution:**
1. Check `tsconfig.json` has correct paths
2. Restart VS Code
3. Restart dev server

### Build Errors

If `npm run build` fails:

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 🔐 Security for Local Development

### What's Safe Locally:
✅ Using `.env.local` for secrets
✅ Testing with real Supabase data
✅ Creating test users
✅ Testing payment flows

### What to Avoid:
❌ Committing `.env.local` to Git
❌ Sharing your local environment variables
❌ Using production keys in local development
❌ Testing with real customer data

---

## 📊 Development vs Production

### Local Development (localhost:3000)
- Fast reload
- Detailed error messages
- Debug tools available
- Uses `.env.local`
- Not accessible from internet

### Production (Vercel)
- Optimized build
- Generic error messages
- Performance optimized
- Uses Vercel environment variables
- Accessible worldwide

---

## 🔄 Typical Development Workflow

1. **Start Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit files in VS Code
   - Save files
   - Browser auto-refreshes

3. **Test Changes**
   - Check in browser
   - Test all features
   - Fix any errors

4. **Build & Test**
   ```bash
   npm run build
   npm run start
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

6. **Deploy**
   - Vercel auto-deploys from GitHub
   - Or manually deploy from Vercel dashboard

---

## 📦 Project Structure

```
kekeosafaris/
├── .env.local              ← Your local environment variables
├── .next/                  ← Build output (auto-generated)
├── node_modules/           ← Dependencies (auto-generated)
├── app/                    ← Pages and routes
│   ├── page.tsx           ← Home page
│   ├── layout.tsx         ← Root layout
│   ├── admin/             ← Admin pages
│   ├── staff/             ← Staff pages
│   └── api/               ← API routes
├── components/             ← Reusable components
├── lib/                    ← Utility functions
│   ├── supabase/          ← Supabase clients
│   ├── auth/              ← Authentication
│   └── security/          ← Security utilities
├── public/                 ← Static files (images, etc.)
├── styles/                 ← CSS files
├── middleware.ts           ← Route protection
├── package.json            ← Dependencies and scripts
├── next.config.mjs         ← Next.js configuration
└── tsconfig.json           ← TypeScript configuration
```

---

## 🎯 Testing Locally

### Test User Registration
1. Go to: http://localhost:3000/register
2. Fill in the form
3. Check Supabase → Authentication → Users

### Test Admin Features
1. Create admin: `npm run create-admin`
2. Login at: http://localhost:3000/login
3. Access: http://localhost:3000/admin

### Test Staff Features
1. Create staff user in admin panel
2. Login with staff credentials
3. Access: http://localhost:3000/staff

### Test Email Feature
1. Go to homepage
2. Enter email in "Free Safari Guide"
3. Check terminal for logs
4. Check email inbox

---

## 🚀 Ready for Production?

Before deploying to Vercel:

### Checklist:
- [ ] `npm run build` succeeds without errors
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database migrations completed
- [ ] Security features tested
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Loading states added

### Deploy to Vercel:
1. Push code to GitHub
2. Vercel auto-deploys
3. Add environment variables in Vercel
4. Test production site

---

## 💡 Tips for Local Development

### Hot Reload
- Next.js automatically reloads when you save files
- If it doesn't work, restart dev server

### Console Logs
- Use `console.log()` for debugging
- Check browser console (F12) for errors
- Check terminal for server-side logs

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Browser DevTools
- Press F12 to open developer tools
- Check Console tab for JavaScript errors
- Check Network tab for API calls
- Check Application tab for cookies/storage

---

## 📞 Need Help?

### Documentation Files:
- `EMAIL-SETUP-GUIDE.md` - Email feature setup
- `SECURITY.md` - Security documentation
- `ADMIN_USER_GUIDE.md` - Admin features guide

### Common Issues:
- Database errors? Check Supabase dashboard
- Authentication errors? Verify environment variables
- Build errors? Clear `.next` folder and rebuild
- Module errors? Delete `node_modules` and reinstall

---

## ✅ Success!

If you can see your website at http://localhost:3000 and can:
- ✅ Navigate all pages
- ✅ Register/login users
- ✅ Access admin dashboard
- ✅ Submit forms
- ✅ See real data from Supabase

**Congratulations! Your local development environment is ready!** 🎉

---

## 🎓 Next Steps

1. Explore the codebase
2. Make small changes and see them live
3. Test new features locally before deploying
4. Build something amazing!

Happy coding! 🚀
