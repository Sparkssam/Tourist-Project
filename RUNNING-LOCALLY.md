# 🏠 Running Locally - Quick Reference

## ✅ Your Setup Status: READY ✓

All checks passed! Your project is configured for local development.

---

## 🚀 Start Development Server

```bash
npm run dev
```

**Then open:** http://localhost:3000

**What you'll see:**
- ⚡ Server starts in 3-5 seconds
- 🔄 Auto-reload when you save files
- 🐛 Error messages in terminal and browser
- 📊 Development mode (detailed errors)

**To stop:** Press `Ctrl + C` in terminal

---

## 📋 Essential Commands

### Development
```bash
npm run dev          # Start dev server (localhost:3000)
npm run verify       # Check your local setup
```

### Building & Testing
```bash
npm run build        # Build for production
npm run start        # Run production build locally
npm run lint         # Check code quality
```

### User Management
```bash
npm run create-admin        # Create admin user
npm run create-super-admin  # Create super admin
```

---

## 🌐 Local URLs (After Running `npm run dev`)

### Public Pages
- Home: http://localhost:3000
- About: http://localhost:3000/about
- Tours: http://localhost:3000/tours
- Contact: http://localhost:3000/contact

### Admin Area
- Login: http://localhost:3000/login
- Admin Dashboard: http://localhost:3000/admin
- User Management: http://localhost:3000/admin/users
- Inquiries: http://localhost:3000/admin/inquiries
- Reviews: http://localhost:3000/admin/reviews
- Email Subscribers: http://localhost:3000/admin/safari-subscribers

---

## 🔧 Your Configuration

### ✅ Installed
- Node.js v22.19.0
- All npm packages
- Next.js 14.2.33
- Supabase integration
- Resend email package

### ✅ Environment Variables (.env.local)
- NEXT_PUBLIC_SUPABASE_URL ✓
- NEXT_PUBLIC_SUPABASE_ANON_KEY ✓
- SUPABASE_SERVICE_ROLE_KEY ✓
- SUPER_ADMIN_SECRET ✓
- RESEND_API_KEY ℹ️ (add for email feature)

### ✅ Project Structure
- app/ directory ✓
- components/ directory ✓
- lib/ directory ✓
- public/ directory ✓
- All configuration files ✓

---

## 🎯 Typical Workflow

1. **Start Server**
   ```bash
   npm run dev
   ```

2. **Open Browser**
   - Go to: http://localhost:3000

3. **Make Changes**
   - Edit any file in VS Code
   - Save the file (Ctrl+S)
   - Browser automatically refreshes

4. **Check for Errors**
   - Look at terminal for server errors
   - Press F12 in browser for console errors

5. **Test Features**
   - Register/login users
   - Test admin features
   - Submit forms
   - Check database

---

## 🐛 Quick Troubleshooting

### Server Won't Start?
```bash
# Kill existing process
taskkill /F /IM node.exe

# Or use different port
npm run dev -- -p 3001
```

### Port 3000 in use?
```bash
# Use different port
npm run dev -- -p 3001
# Then visit: http://localhost:3001
```

### Module errors?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Environment variables not working?
```bash
# Restart dev server
# Press Ctrl+C, then run again:
npm run dev
```

### Build errors?
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## 🔒 Security Note

Your project runs **locally only** when using `npm run dev`:

✅ **What this means:**
- Only accessible on your computer
- Uses localhost (127.0.0.1)
- Can use local network IP (192.168.x.x)
- Safe for development and testing
- Environment variables stay on your machine
- Not visible on the internet

❌ **NOT accessible:**
- From other computers (unless on same network)
- From the internet
- From other devices

🌐 **For internet access:**
- Deploy to Vercel
- Your production site is still online at:
  https://tourist-project-git-main-derick-mhidzes-projects.vercel.app/

---

## 📊 Development vs Production

### Local (npm run dev)
- ⚡ Fast reload
- 🐛 Detailed errors
- 🔧 Debug tools
- 📝 Console logs visible
- 🏠 Only on your computer

### Production (Vercel)
- 🚀 Optimized & fast
- 🔒 Generic errors
- 📊 Analytics
- 🌐 Accessible worldwide
- ☁️ Hosted in cloud

---

## 💡 Pro Tips

### 1. Use Two Terminals
- Terminal 1: Run `npm run dev` (keep it running)
- Terminal 2: Run other commands (git, npm, etc.)

### 2. Browser DevTools (F12)
- Console: See JavaScript errors
- Network: Check API calls
- Application: View cookies/storage

### 3. VS Code Extensions
- ESLint: Code quality
- Prettier: Code formatting
- Tailwind CSS IntelliSense: CSS help

### 4. Hot Reload
- Save files and see changes instantly
- No need to restart server
- If not working, restart: Ctrl+C then `npm run dev`

---

## 📱 Access from Phone/Tablet (Same Network)

1. Start dev server: `npm run dev`
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Look for: `Network: http://192.168.x.x:3000`
4. Open that URL on your phone
5. Must be on same WiFi network

---

## ✅ Success Checklist

After running `npm run dev`, you should be able to:

- [ ] Open http://localhost:3000
- [ ] See the homepage
- [ ] Navigate to different pages
- [ ] Register a new user
- [ ] Login as admin
- [ ] Access admin dashboard
- [ ] Submit a form
- [ ] See changes when you edit code

If all checked ✓ = **You're successfully running locally!** 🎉

---

## 📚 More Information

- Full Guide: **LOCAL-DEVELOPMENT-GUIDE.md**
- Email Setup: **EMAIL-SETUP-GUIDE.md**
- Security: **SECURITY.md**
- Admin Guide: **ADMIN_USER_GUIDE.md**

---

## 🆘 Need Help?

1. Run verification: `npm run verify`
2. Check terminal for errors
3. Check browser console (F12)
4. Read LOCAL-DEVELOPMENT-GUIDE.md
5. Restart dev server

---

**🎉 You're running locally! Happy coding!** 🚀
