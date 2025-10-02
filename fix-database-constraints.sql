-- Fix for Kekeo Safaris Database - Remove Foreign Key Constraint
-- Run this in your Supabase SQL Editor to allow standalone profiles

-- 1. Drop the existing foreign key constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Make the profiles table standalone (no dependency on auth.users)
-- The ID will just be a UUID, not necessarily linked to auth.users

-- 3. Add a new column to track if user has auth account
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_auth_account BOOLEAN DEFAULT FALSE;

-- 4. Update existing profiles to mark them as having auth accounts
UPDATE public.profiles 
SET has_auth_account = TRUE 
WHERE id IN (SELECT id FROM auth.users);

-- 5. Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_has_auth ON public.profiles(has_auth_account);

-- 6. Update RLS policies if needed (optional)
-- This allows profiles to exist independently of auth users

COMMENT ON TABLE public.profiles IS 'User profiles - can exist with or without auth accounts';
COMMENT ON COLUMN public.profiles.has_auth_account IS 'TRUE if user has corresponding auth account, FALSE if profile-only';

-- Now profiles can be created without auth.users dependency!