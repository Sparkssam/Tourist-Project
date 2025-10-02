# How to Get Your Supabase Service Role Key

## Quick Steps:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `kekeosafaris`
3. **Go to Settings**: Click Settings in the left sidebar
4. **Click API**: In the settings menu
5. **Find "service_role"**: Look for the "service_role" key (NOT anon key)
6. **Copy the key**: It's a long JWT token starting with `eyJ...`

## Example:

```
Your anon key (current): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsb2pzZXNqYmpiemRjY2Rkb25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTk2MzIsImV4cCI6MjA3NDg5NTYzMn0...

Your service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsb2pzZXNqYmpiemRjY2Rkb25wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMxOTYzMiwiZXhwIjoyMDc0ODk1NjMyfQ...
                                                                                                                                              ^^^^^^^^^^
                                                                                                                                        Notice "service_role"
```

## Add to .env.local:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

## Security Note:

⚠️ The service role key has admin privileges - keep it secret!
✅ Only use it on server-side (API routes, not client-side)
