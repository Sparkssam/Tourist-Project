-- Comprehensive database diagnostics for timeout issues
-- Run these queries in your Supabase SQL Editor to identify the problem

-- 1. Check if the profiles table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check table size and row count
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename = 'profiles';

-- 3. Check for any locks or long-running queries
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- 4. Check RLS status and policies
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN 'RLS ENABLED' 
        ELSE 'RLS DISABLED' 
    END as rls_status
FROM pg_tables 
WHERE tablename = 'profiles';

-- 5. List all policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 6. Check indexes on profiles table
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'profiles';

-- 7. Test basic operations with timing
\timing on

-- Simple count query
SELECT COUNT(*) as total_profiles FROM profiles;

-- Simple select query  
SELECT id, email, role FROM profiles LIMIT 5;

-- Check for any foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='profiles';

-- 8. Check database statistics
SELECT 
    datname,
    numbackends,
    xact_commit,
    xact_rollback,
    blks_read,
    blks_hit,
    tup_returned,
    tup_fetched,
    tup_inserted,
    tup_updated,
    tup_deleted
FROM pg_stat_database 
WHERE datname = current_database();

-- 9. Try a simple insert to test permissions
DO $$
DECLARE
    test_id uuid;
    test_email text;
BEGIN
    test_id := gen_random_uuid();
    test_email := 'timeout-test-' || extract(epoch from now()) || '@example.com';
    
    -- Try insert
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
        test_id,
        test_email,
        'Timeout',
        'Test',
        'tourist',
        'active',
        false,
        now(),
        now()
    );
    
    RAISE NOTICE 'INSERT successful - ID: %', test_id;
    
    -- Clean up
    DELETE FROM profiles WHERE id = test_id;
    RAISE NOTICE 'Test data cleaned up';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'INSERT failed: %', SQLERRM;
END $$;

-- 10. Final diagnostic summary
SELECT 'Database diagnostic queries completed' as status;