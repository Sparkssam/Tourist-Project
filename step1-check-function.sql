-- ============================================
-- STEP 1: Check the handle_new_user() function
-- ============================================
-- Copy and run this query in Supabase SQL Editor

SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- This will show you the exact code of the function that's causing the error
