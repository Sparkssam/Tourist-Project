-- Fix database issues that might cause user creation to hang
-- Run these commands in your Supabase SQL Editor

-- 1. Check if RLS is enabled on profiles table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 2. Disable RLS temporarily if it's causing issues (ONLY for testing)
-- WARNING: This removes security - only use for testing!
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Check existing policies on profiles table
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- 4. Create a permissive policy for authenticated users (recommended approach)
-- This allows authenticated users to insert profiles
DO $$
BEGIN
    -- Drop existing policy if it exists
    DROP POLICY IF EXISTS "Allow authenticated users to insert profiles" ON profiles;
    
    -- Create new policy
    CREATE POLICY "Allow authenticated users to insert profiles" 
    ON profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
    
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Policy already exists or could not be created: %', SQLERRM;
END $$;

-- 5. Alternative: Allow anonymous inserts for admin user creation
-- (Less secure but works for admin forms)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow anon inserts for admin" ON profiles;
    
    CREATE POLICY "Allow anon inserts for admin" 
    ON profiles FOR INSERT 
    TO anon 
    WITH CHECK (true);
    
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Policy could not be created: %', SQLERRM;
END $$;

-- 6. Check table permissions
SELECT 
    grantee, 
    privilege_type, 
    is_grantable 
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles';

-- 7. Test basic insert capability
-- This should work if permissions are correct
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    status,
    has_auth_account,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'test-admin-' || extract(epoch from now()) || '@example.com',
    'Test',
    'Admin',
    'admin',
    'active',
    false,
    now(),
    now()
) ON CONFLICT (email) DO NOTHING;

-- 8. If the above works, the issue is likely RLS policies
-- If it fails, there might be table structure issues

SELECT 'Database setup check completed' as status;