-- Step 1: Remove the foreign key constraint (run this first)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;