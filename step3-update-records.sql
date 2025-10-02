-- Step 3: Update existing records (run this third)
UPDATE public.profiles SET has_auth_account = TRUE WHERE id IN (SELECT id FROM auth.users);