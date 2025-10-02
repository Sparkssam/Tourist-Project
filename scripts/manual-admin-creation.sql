-- Manual Super Admin Creation Script
-- Run this in Supabase SQL Editor if the web/terminal creation keeps failing

-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the sidebar
-- 3. Copy and paste this entire script
-- 4. MODIFY the values below with your details:
--    - Replace 'admin@kekeosafaris.com' with your email
--    - Replace 'your-secure-password-here' with your password (min 8 chars)
--    - Replace 'Derick' and 'Mhidze' with your name
-- 5. Click "Run" to execute

-- Step 1: Create the auth user
-- Note: You need to do this through the Supabase dashboard manually
-- Go to: Authentication > Users > Add user
-- Email: admin@kekeosafaris.com
-- Password: your-secure-password-here
-- Auto confirm user: YES (check this box)

-- Step 2: After creating the user in dashboard, copy the User ID
-- Then run this SQL (replace USER_ID_HERE with the actual UUID):

-- INSERT INTO public.profiles (id, email, first_name, last_name, phone, role, status)
-- VALUES (
--   'USER_ID_HERE'::uuid,  -- Replace with actual user ID from dashboard
--   'admin@kekeosafaris.com',
--   'Derick',
--   'Mhidze',
--   '0760309999',
--   'admin',
--   'active'
-- );

-- Alternative: If trigger created a profile but with wrong role, update it:
-- UPDATE public.profiles
-- SET role = 'admin', status = 'active'
-- WHERE email = 'admin@kekeosafaris.com';

-- Verify the admin was created:
-- SELECT id, email, first_name, last_name, role, status, created_at
-- FROM public.profiles
-- WHERE role = 'admin';

-- EASIER MANUAL METHOD:
-- =====================
-- Instead of SQL, use the Supabase Dashboard:
-- 
-- 1. Go to Authentication > Users
-- 2. Click "Add user" (or "Invite user")
-- 3. Fill in:
--    - Email: admin@kekeosafaris.com
--    - Password: [your password]
--    - Check "Auto confirm user" ✓
-- 4. Click "Add user"
-- 5. Copy the User ID that appears
-- 6. Go to Table Editor > profiles
-- 7. Click "Insert row"
-- 8. Fill in:
--    - id: [paste the User ID]
--    - email: admin@kekeosafaris.com
--    - first_name: Derick
--    - last_name: Mhidze
--    - phone: 0760309999
--    - role: admin (select from dropdown)
--    - status: active (select from dropdown)
-- 9. Click "Save"
-- 
-- Done! Now you can login at http://localhost:3000/login