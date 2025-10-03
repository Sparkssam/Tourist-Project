# SQL Diagnostic Queries

## 1. Check the handle_new_user() function

```sql
-- See what the trigger function does
SELECT
    proname as function_name,
    prosrc as function_body
FROM pg_proc
WHERE proname = 'handle_new_user';
```

## 2. Check if there are any errors in the function

```sql
-- Get detailed function definition
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'handle_new_user';
```

## 3. Temporarily disable the trigger (CAUTION!)

```sql
-- This will allow user creation while we fix the issue
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
```

## 4. After fixing, re-enable the trigger

```sql
-- Re-enable after fixing
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
```

## 5. Clean up duplicate profiles

```sql
-- First, let's see the duplicates
SELECT
    id,
    email,
    first_name,
    last_name,
    created_at,
    has_auth_account
FROM profiles
WHERE email = 'derickmhidze7@gmail.com'
ORDER BY created_at;

-- Keep only the oldest one, delete the rest
-- (Run this AFTER confirming which ones to keep)
DELETE FROM profiles
WHERE email = 'derickmhidze7@gmail.com'
AND id NOT IN (
    SELECT id
    FROM profiles
    WHERE email = 'derickmhidze7@gmail.com'
    ORDER BY created_at
    LIMIT 1
);
```
