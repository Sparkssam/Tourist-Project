"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Wifi, WifiOff, Database, Upload, RefreshCw } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

interface OfflineUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
  status: 'pending' | 'synced' | 'failed'
  createdAt: string
  syncAttempts: number
}

export function SyncDiagnosticTool() {
  const [testing, setTesting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [offlineUsers, setOfflineUsers] = useState<OfflineUser[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setResults(prev => [...prev, `${timestamp}: ${message}`])
    console.log(message)
  }

  const loadOfflineUsers = () => {
    try {
      const stored = localStorage.getItem('offline_users')
      if (stored) {
        const users = JSON.parse(stored)
        setOfflineUsers(users)
        addResult(`📋 Loaded ${users.length} offline users from storage`)
        return users
      } else {
        addResult('📋 No offline users found in storage')
        return []
      }
    } catch (err) {
      addResult(`❌ Error loading offline users: ${err}`)
      return []
    }
  }

  const testNetworkConnectivity = async () => {
    setTesting(true)
    setResults([])
    setError('')

    try {
      addResult('🔧 Starting comprehensive network diagnostics...')

      // Load offline users first
      const users = loadOfflineUsers()

      // Test basic internet connectivity
      addResult('🌐 Testing basic internet connectivity...')
      try {
        const googleTest = await fetch('https://www.google.com', {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        })
        addResult(`✅ Internet connection: ${googleTest.status} OK`)
      } catch (netErr: any) {
        addResult(`❌ Internet test failed: ${netErr.message}`)
        throw new Error('No internet connectivity')
      }

      // Test Supabase URL accessibility
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      addResult(`📋 Supabase URL: ${supabaseUrl}`)
      addResult(`📋 Supabase Key: ${supabaseKey ? 'Present' : 'Missing'}`)

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing')
      }

      addResult('🔗 Testing Supabase server accessibility...')
      try {
        const supabaseTest = await fetch(supabaseUrl, {
          method: 'HEAD',
          signal: AbortSignal.timeout(8000)
        })
        addResult(`✅ Supabase server: ${supabaseTest.status} ${supabaseTest.statusText}`)
      } catch (supabaseErr: any) {
        addResult(`❌ Supabase server test failed: ${supabaseErr.message}`)
        throw new Error('Supabase server not accessible')
      }

      // Initialize Supabase client
      addResult('🔌 Initializing Supabase client...')
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Test database query
      addResult('📊 Testing database query...')
      try {
        const { data, error: queryError } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true })
          .abortSignal(AbortSignal.timeout(10000))

        if (queryError) {
          addResult(`❌ Database query failed: ${queryError.message}`)
          throw new Error(`Database query error: ${queryError.message}`)
        }

        addResult(`✅ Database query successful! Profile count: ${data}`)
      } catch (dbErr: any) {
        addResult(`❌ Database query error: ${dbErr.message}`)
        throw new Error(`Database not accessible: ${dbErr.message}`)
      }

      // Test simple insert (if we have offline users)
      if (users.length > 0) {
        addResult('🧪 Testing database insert capability...')
        
        const testUser = users[0] // Use first offline user for testing
        const profileData = {
          id: `test-${Date.now()}`, // Use different ID for test
          email: `test-${Date.now()}@example.com`, // Use different email for test
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          phone: testUser.phone || null,
          role: testUser.role,
          status: 'active' as const,
          has_auth_account: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        try {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(profileData)
            .abortSignal(AbortSignal.timeout(10000))

          if (insertError) {
            addResult(`❌ Insert test failed: ${insertError.message}`)
            
            if (insertError.message.includes('permission denied')) {
              addResult('🔒 Issue: Row Level Security (RLS) is blocking inserts')
            } else if (insertError.message.includes('duplicate key')) {
              addResult('🔑 Issue: Duplicate key constraint')
            }
          } else {
            addResult('✅ Insert test successful! Database is ready for sync')
            
            // Clean up test data
            await supabase
              .from('profiles')
              .delete()
              .eq('id', profileData.id)
            
            addResult('🧹 Test data cleaned up')
          }
        } catch (insertErr: any) {
          addResult(`❌ Insert test error: ${insertErr.message}`)
        }
      }

      addResult('🎉 Network diagnostics completed successfully!')
      addResult('✅ Your network connection to Supabase is working!')
      
      setMessage('🎉 Great news! Your network connection to Supabase is working. You can now sync your offline users!')

    } catch (err: any) {
      addResult(`💥 Network diagnostic failed: ${err.message}`)
      setError(`Network issue detected: ${err.message}`)
    } finally {
      setTesting(false)
    }
  }

  const syncOfflineUsers = async () => {
    setSyncing(true)
    setError('')
    setMessage('')

    try {
      const users = loadOfflineUsers()
      if (users.length === 0) {
        setMessage('No offline users to sync')
        return
      }

      const pendingUsers = users.filter(user => user.status === 'pending' || user.status === 'failed')
      if (pendingUsers.length === 0) {
        setMessage('All users are already synced!')
        return
      }

      addResult(`🚀 Starting sync process for ${pendingUsers.length} users...`)

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing')
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      
      let successCount = 0
      let failCount = 0
      const updatedUsers = [...users]

      for (let i = 0; i < users.length; i++) {
        const user = users[i]
        if (user.status === 'pending' || user.status === 'failed') {
          addResult(`📝 Syncing user: ${user.firstName} ${user.lastName} (${user.email})`)

          try {
            const profileData = {
              id: user.id,
              email: user.email.toLowerCase().trim(),
              first_name: user.firstName.trim(),
              last_name: user.lastName.trim(),
              phone: user.phone.trim() || null,
              role: user.role,
              status: 'active' as const,
              has_auth_account: false,
              created_at: user.createdAt,
              updated_at: new Date().toISOString()
            }

            const { error: profileError } = await supabase
              .from('profiles')
              .insert(profileData)
              .abortSignal(AbortSignal.timeout(15000))

            if (profileError) {
              addResult(`❌ Failed to sync ${user.email}: ${profileError.message}`)
              updatedUsers[i] = { ...user, status: 'failed', syncAttempts: user.syncAttempts + 1 }
              failCount++
            } else {
              addResult(`✅ Successfully synced ${user.email}`)
              updatedUsers[i] = { ...user, status: 'synced' }
              successCount++
            }
          } catch (syncErr: any) {
            addResult(`❌ Sync error for ${user.email}: ${syncErr.message}`)
            updatedUsers[i] = { ...user, status: 'failed', syncAttempts: user.syncAttempts + 1 }
            failCount++
          }

          // Small delay between syncs
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }

      // Save updated users back to localStorage
      localStorage.setItem('offline_users', JSON.stringify(updatedUsers))
      setOfflineUsers(updatedUsers)

      addResult(`🏁 Sync completed! Success: ${successCount}, Failed: ${failCount}`)

      if (successCount > 0) {
        setMessage(`🎉 Successfully synced ${successCount} user(s) to the database!`)
      }

      if (failCount > 0) {
        setError(`❌ Failed to sync ${failCount} user(s). Check the diagnostic results for details.`)
      }

    } catch (err: any) {
      addResult(`💥 Sync process failed: ${err.message}`)
      setError(`Sync failed: ${err.message}`)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Sync Diagnostic Tool</span>
          </CardTitle>
          <CardDescription>
            Test your network connection and sync offline users to the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Button 
              onClick={testNetworkConnectivity}
              disabled={testing}
              variant="outline"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Network...
                </>
              ) : (
                <>
                  <Wifi className="mr-2 h-4 w-4" />
                  Test Network Connection
                </>
              )}
            </Button>

            <Button 
              onClick={syncOfflineUsers}
              disabled={syncing}
              variant="default"
            >
              {syncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing Users...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Sync Offline Users
                </>
              )}
            </Button>

            <Button 
              onClick={loadOfflineUsers}
              variant="ghost"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          {/* Status Messages */}
          {message && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Offline Users Display */}
          {offlineUsers.length > 0 && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-2">Offline Users ({offlineUsers.length}):</h4>
              {offlineUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                    <span className="text-sm text-gray-600 ml-2">({user.email})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.status === 'synced' 
                        ? 'bg-green-100 text-green-800' 
                        : user.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status === 'synced' && '✅ Synced'}
                      {user.status === 'pending' && '⏳ Pending'}
                      {user.status === 'failed' && `❌ Failed (${user.syncAttempts})`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Diagnostic Results */}
          {results.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg max-h-80 overflow-y-auto font-mono text-sm">
              <h4 className="text-white font-medium mb-2">Diagnostic Results:</h4>
              {results.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}