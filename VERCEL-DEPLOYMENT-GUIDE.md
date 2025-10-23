# 🚀 Vercel Deployment Guide for Kekeo Safaris

## Prerequisites Checklist ✅

Before deploying, ensure you have:
- [x] GitHub account
- [x] Vercel account (sign up at https://vercel.com)
- [x] Git installed locally
- [x] Your code pushed to a GitHub repository
- [x] All environment variables ready

---

## Step 1: Prepare Your Repository for Deployment

### 1.1 Check Git Status
```powershell
cd "c:\Users\Derick Mhidze\kekeosafaris"
git status
```

### 1.2 Commit All Changes (if any)
```powershell
git add .
git commit -m "Prepare for Vercel deployment"
```

### 1.3 Push to GitHub
```powershell
git push origin main
```

---

## Step 2: Deploy to Vercel (3 Methods)

### **Method A: Deploy via Vercel Dashboard (Recommended for First-Time)**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Choose `Tourist-Project` (derick328/Tourist-Project)
   - Click "Import"

3. **Configure Project**
   - **Project Name**: `kekeosafaris` (or your preferred name)
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `pnpm build` (or leave default)
   - **Output Directory**: `.next` (leave default)
   - **Install Command**: `pnpm install` (or leave default)

4. **Add Environment Variables** (CRITICAL!)
   Click "Environment Variables" and add these:

   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   SUPER_ADMIN_SECRET=<your-super-admin-secret>
   RESEND_API_KEY=<your-resend-api-key>
   NODE_ENV=production
   ```

   **Where to find these values:**
   - Check your `.env.local` file (DON'T commit this file!)
   - Supabase Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
   - Resend Dashboard: https://resend.com/api-keys

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes for the build to complete
   - You'll get a URL like: `https://kekeosafaris.vercel.app`

---

### **Method B: Deploy via Vercel CLI (For Developers)**

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```powershell
   vercel login
   ```

3. **Deploy**
   ```powershell
   cd "c:\Users\Derick Mhidze\kekeosafaris"
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `kekeosafaris`
   - In which directory is your code located? `./`
   - Want to override settings? **N**

5. **Add Environment Variables**
   ```powershell
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add SUPER_ADMIN_SECRET
   vercel env add RESEND_API_KEY
   ```

6. **Deploy to Production**
   ```powershell
   vercel --prod
   ```

---

### **Method C: One-Click Deploy Button (Easiest)**

1. Click this button to deploy:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/derick328/Tourist-Project)

2. Follow the same environment variable setup from Method A

---

## Step 3: Post-Deployment Configuration

### 3.1 Update Supabase Redirect URLs

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add your Vercel URL to **Site URL**:
   ```
   https://kekeosafaris.vercel.app
   ```

5. Add to **Redirect URLs**:
   ```
   https://kekeosafaris.vercel.app/auth/callback
   https://kekeosafaris.vercel.app/login
   https://kekeosafaris.vercel.app/admin
   ```

### 3.2 Update CORS Settings (if needed)

In your Supabase project, go to **Settings** → **API** → **CORS**:
- Add your Vercel domain: `https://kekeosafaris.vercel.app`

### 3.3 Test Your Deployment

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Login works
- ✅ Admin dashboard accessible
- ✅ Tours page displays
- ✅ Contact form submits
- ✅ Email notifications send

---

## Step 4: Custom Domain Setup (Optional)

### 4.1 Add Your Domain

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Click "Add Domain"
5. Enter: `www.kekeosafaris.com` (or your domain)

### 4.2 Configure DNS

Add these DNS records at your domain registrar:

**For Apex Domain (kekeosafaris.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain (www.kekeosafaris.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.3 Update Supabase URLs

Add your custom domain to Supabase redirect URLs:
```
https://kekeosafaris.com
https://www.kekeosafaris.com
```

---

## Step 5: Enable Analytics & Monitoring

### 5.1 Vercel Analytics (Already Integrated!)
Your project already has `@vercel/analytics` installed. It will automatically start tracking once deployed.

### 5.2 View Analytics
- Go to Vercel Dashboard → Your Project → Analytics
- Monitor page views, top pages, and performance

### 5.3 Speed Insights
- Go to Vercel Dashboard → Your Project → Speed Insights
- Track Core Web Vitals and performance metrics

---

## Environment Variables Reference

Here's the complete list of environment variables needed:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin) | ✅ Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPER_ADMIN_SECRET` | Secret for creating super admin | ✅ Yes | `your-super-secret-key-123` |
| `RESEND_API_KEY` | Resend email API key | ✅ Yes | `re_123abc456def` |
| `NODE_ENV` | Environment mode | ✅ Yes | `production` |

---

## Troubleshooting Common Issues

### Issue 1: Build Fails with TypeScript Errors
**Solution:** Your `next.config.mjs` already has `ignoreBuildErrors: true`, so this shouldn't happen. If it does:
```javascript
typescript: {
  ignoreBuildErrors: true,
}
```

### Issue 2: Environment Variables Not Working
**Solution:** 
- Verify all variables are added in Vercel Dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue 3: Login Not Working After Deployment
**Solution:**
- Update Supabase redirect URLs (see Step 3.1)
- Check that `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set

### Issue 4: Images Not Loading
**Solution:** Your `next.config.mjs` already has:
```javascript
images: {
  unoptimized: true,
}
```
This allows images from any source.

### Issue 5: 404 on Routes
**Solution:**
- Check that middleware.ts is properly configured ✅ (already done)
- Verify all pages exist in `app/` directory
- Clear Vercel cache: Settings → General → Clear Cache

### Issue 6: Email Not Sending
**Solution:**
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for logs
- Ensure sender email is verified in Resend

---

## Continuous Deployment (Auto-Deploy)

Once connected to GitHub, Vercel automatically deploys:
- ✅ **Every push to `main` branch** → Production deployment
- ✅ **Every pull request** → Preview deployment
- ✅ **Every commit** gets a unique URL

To disable auto-deploy:
1. Go to Vercel Dashboard → Your Project → Settings
2. Git → Production Branch
3. Uncheck "Automatic Deployments"

---

## Deployment Checklist

Before going live, ensure:

- [ ] All environment variables added to Vercel
- [ ] Supabase redirect URLs updated with Vercel domain
- [ ] Custom domain configured (if applicable)
- [ ] DNS records propagated (wait 24-48 hours)
- [ ] SSL certificate active (Vercel auto-generates)
- [ ] Test login functionality
- [ ] Test admin dashboard
- [ ] Test email notifications
- [ ] Test payment flow (if applicable)
- [ ] Check all routes work (404 page shows for invalid routes)
- [ ] Mobile responsiveness verified
- [ ] Performance metrics reviewed

---

## Post-Deployment Best Practices

1. **Monitor Performance**
   - Check Vercel Analytics daily
   - Monitor Core Web Vitals
   - Track error rates

2. **Set Up Alerts**
   - Vercel Dashboard → Settings → Notifications
   - Enable deployment notifications
   - Enable error alerts

3. **Regular Updates**
   - Push updates to GitHub
   - Vercel auto-deploys
   - Check deployment logs

4. **Backup Strategy**
   - Supabase has automatic backups
   - Keep local `.env.local` file secure
   - Document all configuration changes

5. **Security**
   - Never commit `.env` files to Git ✅ (already in `.gitignore`)
   - Rotate API keys regularly
   - Monitor Supabase logs for suspicious activity
   - Keep dependencies updated

---

## Quick Commands Reference

```powershell
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Pull environment variables locally
vercel env pull

# Redeploy without changes
vercel --prod --force

# Open project in Vercel Dashboard
vercel open
```

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Supabase Documentation**: https://supabase.com/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: https://github.com/vercel/next.js/discussions

---

## Your Deployment URLs

After deployment, you'll have:

- **Production**: `https://kekeosafaris.vercel.app` (or your custom domain)
- **Preview**: `https://kekeosafaris-git-branch.vercel.app` (for each branch)
- **Development**: `http://localhost:3000` (local)

---

## 🎉 You're All Set!

Once deployed, your Kekeo Safaris website will be:
- ✅ **Globally available** with CDN caching
- ✅ **Automatically scaled** to handle traffic
- ✅ **SSL secured** with HTTPS
- ✅ **Auto-deployed** on every Git push
- ✅ **Monitored** with analytics
- ✅ **Fast** with edge functions

**Next Steps:**
1. Follow Method A (Dashboard) or Method B (CLI) above
2. Test your deployment thoroughly
3. Share your live URL with the world! 🌍

---

**Need help?** Check the troubleshooting section or create an issue on GitHub.
