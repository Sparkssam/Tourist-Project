-- ============================================
-- STEP 5: Re-enable the trigger after fixing
-- ============================================
-- Run this AFTER you've fixed the function with step4

ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- Now the trigger should work properly when creating new users
