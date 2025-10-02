-- Step 2: Add tracking column (run this second)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_auth_account BOOLEAN DEFAULT FALSE;