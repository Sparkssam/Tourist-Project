# Quick Fix Guide for User Creation Error

## Problem

"Database error creating new user" - caused by a buggy trigger function

## Solution - Follow These Steps

### Step 1: Check What's Wrong

1. Open Supabase Dashboard → SQL Editor
2. Open the file: `step1-check-function.sql`
3. Copy ALL the SQL code
4. Paste into SQL Editor
5. Click "Run"
6. **Tell me what output you see** (copy and paste the result)

---

### Step 2: Clean Up Duplicates

1. Open the file: `step2-cleanup-duplicates.sql`
2. Copy the **first SQL query** (SELECT statement)
3. Run it in SQL Editor
4. You'll see 4 duplicate profiles
5. Then uncomment and run the DELETE statement to remove them

---

### Step 3: Quick Fix - Disable Trigger

1. Open the file: `step3-disable-trigger.sql`
2. Copy and run the SQL
3. This temporarily disables the broken trigger

---

### Step 4: Create Your User NOW

1. Go to: http://localhost:3001/admin/users/create-simple
2. Create your user:
   - Email: derickmhidze7@gmail.com
   - Password: YourPassword123!
   - Name: Derick Mhidze
   - Role: admin
   - Admin Secret: kekeo_safari_super_admin_2024_secret_key
3. ✅ This should work now!

---

### Step 5: Fix the Function (Optional)

1. Open the file: `step4-fix-function.sql`
2. Copy and run the SQL
3. This creates a corrected version of the function

---

### Step 6: Re-enable Trigger (Optional)

1. Open the file: `step5-enable-trigger.sql`
2. Copy and run the SQL
3. This re-enables the trigger with the fixed function

---

## Quick Path (If you want to create users RIGHT NOW)

Just do:

1. ✅ Step 3 (disable trigger)
2. ✅ Step 4 (create user at the website)
3. ✅ Done! You can login

Later, when you have time:

- Run Step 5 & 6 to properly fix the trigger

---

## How to Use the SQL Files

**DO NOT** try to run the `.sql` files directly in Supabase!

**INSTEAD:**

1. Open the `.sql` file in VS Code (or any text editor)
2. **Copy the SQL code** (just the SQL, not the comments if you want)
3. Open Supabase Dashboard
4. Go to SQL Editor
5. Click "New Query"
6. **Paste** the SQL code
7. Click "Run"

---

## Need Help?

If Step 1 shows you the function code, **share it with me** and I'll give you the exact fix for YOUR specific function.

Or just do Steps 3 & 4 to create your user immediately!
