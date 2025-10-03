-- ============================================
-- STEP 3: Temporarily disable the problematic trigger
-- ============================================
-- This will allow you to create users while we fix the function

ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- After running this, you can create users at:
-- http://localhost:3001/admin/users/create-simple
