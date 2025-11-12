const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

(async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing Supabase admin credentials in .env.local');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const email = 'samwelmsuya10@gmail.com';

  console.log('Checking profiles table for email:', email);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Error querying profiles:', error);
  } else if (!data) {
    console.log('No profile found for', email);
  } else {
    console.log('Profile found:', data);
  }

  // Check auth users
  console.log('\nChecking auth.users for the email (requires service role)...');
  const { data: users, error: usersErr } = await supabase.rpc('get_user_by_email', { _email: email }).catch(()=>({ data: null, error: 'rpc missing' }));
  if (usersErr) {
    console.log('RPC get_user_by_email not available. Falling back to auth.users via admin API');
    try {
      const res = await supabase.auth.admin.listUsers();
      const found = res.users.find(u => u.email === email);
      if (found) console.log('Auth user found:', { id: found.id, email: found.email, confirmed_at: found.confirmed_at });
      else console.log('Auth user not found in auth.users');
    } catch (e) {
      console.error('Could not list auth users:', e.message || e);
    }
  } else {
    console.log('RPC returned:', users);
  }

  process.exit(0);
})();