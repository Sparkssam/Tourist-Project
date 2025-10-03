# Complete User Creation Guide

## 🎯 Goal

Create users that can:

1. ✅ Appear in Supabase profiles table
2. ✅ Have authentication credentials (can login)
3. ✅ Work immediately without manual SQL scripts

---

## 📋 Step-by-Step Instructions

### **Step 1: Get Your Supabase Service Role Key**

1. Go to: **https://supabase.com/dashboard/projects**
2. Log in and select your project
3. Click **Settings** (gear icon in sidebar)
4. Click **API**
5. Scroll down to **Service role key**
6. Copy the long key (starts with `eyJ...`)

⚠️ **IMPORTANT**: This is different from the `anon` key!

---

### **Step 2: Update Your Environment File**

1. Open: `c:\Users\Derick Mhidze\kekeosafaris\.env.local`
2. Find the line: `SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE`
3. Replace `YOUR_SERVICE_ROLE_KEY_HERE` with the key you copied
4. Save the file

Your `.env.local` should look like:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsb2pzZXNqYmpiemRjY2Rkb25wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6...
```

---

### **Step 3: Restart Your Development Server**

In PowerShell:

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
Set-Location "C:\Users\Derick Mhidze\kekeosafaris"
npm run dev
```

---

### **Step 4: Create Your User**

1. Open browser: **http://localhost:3001/admin/users/create-proper**
2. Fill in the form:
   - **First Name**: Derick
   - **Last Name**: Mhidze
   - **Email**: derickmhidze7@gmail.com
   - **Phone**: (optional)
   - **Role**: admin
   - **Admin Secret**: `kekeo_safari_super_admin_2024_secret_key`
3. Click **"Create User Account"**

---

### **Step 5: Save the Temporary Password**

After creation, you'll see:

- ✅ User created successfully
- 🔑 Temporary password (save this!)
- The password will look like: `a1b2c3d4-e5f6-Aa1!`

⚠️ **Copy this password immediately** - you won't see it again!

---

### **Step 6: Verify in Supabase**

1. Go to Supabase Dashboard
2. Check **Authentication** → **Users** → You should see derickmhidze7@gmail.com
3. Check **Table Editor** → **profiles** → You should see the profile

---

### **Step 7: Test Login**

1. Go to: **http://localhost:3001/login**
2. Login with:
   - Email: `derickmhidze7@gmail.com`
   - Password: (the temporary password from Step 5)
3. You should be logged in successfully!

---

## 🔧 Troubleshooting

### Problem: "Unauthorized" error

**Solution**: Check that your `SUPER_ADMIN_SECRET` in `.env.local` matches what you entered in the form.

### Problem: "Service role key not configured"

**Solution**:

1. Make sure you updated `.env.local` with the service_role key
2. Restart your development server
3. Make sure you copied the **service_role** key, not the **anon** key

### Problem: "Database error creating new user"

**Solution**: The email might already exist. Try:

1. Check Supabase Auth for existing users with that email
2. Use a different email address
3. Or delete the existing user first

### Problem: User created but can't login

**Solution**: Make sure:

1. You're using the temporary password shown after creation
2. The user has `email_confirmed` = true in Supabase Auth
3. The profile has matching email in profiles table

---

## 📊 What Gets Created

When you use the proper user creation form:

### In Supabase Auth (auth.users)

- ✅ User ID (UUID)
- ✅ Email
- ✅ Encrypted password
- ✅ Email confirmed = true
- ✅ User metadata (name, phone)

### In Profiles Table (profiles)

- ✅ ID (matches auth user ID)
- ✅ Email
- ✅ First name
- ✅ Last name
- ✅ Phone
- ✅ Role (admin/staff/tourist)
- ✅ Status (active)
- ✅ has_auth_account = true

---

## 🆚 Difference from Old Method

### ❌ Old Method (Manual SQL)

- Only created profile
- No authentication
- Can't login
- Manual password setup needed

### ✅ New Method (Proper Form)

- Creates auth user + profile
- Auto-generates secure password
- Can login immediately
- Everything synced automatically

---

## 🔐 Security Notes

1. **Service Role Key**: Never commit this to git or expose publicly
2. **Temporary Passwords**: User should change password after first login
3. **Admin Secret**: Keep this secure - it's in your `.env.local`

---

## 📱 URLs Reference

- **Create User (Proper)**: http://localhost:3001/admin/users/create-proper
- **Create User (Offline)**: http://localhost:3001/admin/users/create
- **Login**: http://localhost:3001/login
- **Admin Dashboard**: http://localhost:3001/admin

---

## ✅ Success Checklist

- [ ] Got service_role key from Supabase
- [ ] Updated `.env.local` file
- [ ] Restarted development server
- [ ] Created user via proper form
- [ ] Saved temporary password
- [ ] Verified user in Supabase Auth
- [ ] Verified profile in Supabase profiles table
- [ ] Successfully logged in

---

**Need help?** Check the console logs (F12 → Console) for detailed error messages.
