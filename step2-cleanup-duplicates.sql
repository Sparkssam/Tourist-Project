-- ============================================
-- STEP 2: Clean up duplicate profiles
-- ============================================

-- First, see all the duplicate profiles for derickmhidze7@gmail.com
SELECT 
    id,
    email,
    first_name,
    last_name,
    created_at,
    has_auth_account
FROM profiles
WHERE email = 'derickmhidze7@gmail.com'
ORDER BY created_at;

-- After reviewing, delete all of them (we'll recreate properly)
-- Uncomment the line below and run it:
-- DELETE FROM profiles WHERE email = 'derickmhidze7@gmail.com';
