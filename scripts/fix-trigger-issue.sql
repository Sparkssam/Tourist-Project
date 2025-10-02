-- QUICK FIX: Temporarily disable the problematic trigger, create admin, then re-enable

-- Step 1: Disable the automatic profile creation trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Now try creating your admin through the web form again
-- Go to: http://localhost:3000/super-admin-register
-- The "Database error saving new user" should not occur now

-- Step 3: After successfully creating admin, re-enable the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 4: Verify your admin exists
SELECT id, email, first_name, last_name, role, status 
FROM public.profiles 
WHERE role = 'admin';