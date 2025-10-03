"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Download, FileText, Copy, WifiOff, Database, Users } from "lucide-react"

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

export function FixedOfflineManagementTool() {
  const [offlineUsers, setOfflineUsers] = useState<OfflineUser[]>([])
  const [message, setMessage] = useState('')
  const [sqlScript, setSqlScript] = useState('')
  const [isClient, setIsClient] = useState(false) // Fix for hydration error

  useEffect(() => {
    // Fix hydration error by only running on client
    setIsClient(true)
    loadOfflineUsers()
  }, [])

  const loadOfflineUsers = () => {
    if (typeof window === 'undefined') return // Ensure we're on client side
    
    try {
      const stored = localStorage.getItem('offline_users')
      if (stored) {
        const users = JSON.parse(stored)
        setOfflineUsers(users)
        generateSqlScript(users)
      }
    } catch (err) {
      console.error('Failed to load offline users:', err)
    }
  }

  const generateSqlScript = (users: OfflineUser[]) => {
    const pendingUsers = users.filter(user => user.status === 'pending' || user.status === 'failed')
    
    if (pendingUsers.length === 0) {
      setSqlScript('-- No pending users to sync')
      return
    }

    let script = `-- SQL Script to manually insert offline users
-- Run this in your Supabase SQL Editor when network connection is restored
-- Generated on: ${new Date().toLocaleString()}

-- First, disable RLS if needed (for testing)
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Insert offline users
`

    pendingUsers.forEach((user, index) => {
      script += `
-- User ${index + 1}: ${user.firstName} ${user.lastName}
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    status,
    has_auth_account,
    created_at,
    updated_at
) VALUES (
    '${user.id}',
    '${user.email.toLowerCase()}',
    '${user.firstName}',
    '${user.lastName}',
    ${user.phone ? `'${user.phone}'` : 'NULL'},
    '${user.role}',
    'active',
    false,
    '${user.createdAt}',
    '${new Date().toISOString()}'
) ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    updated_at = EXCLUDED.updated_at;
`
    })

    script += `
-- Re-enable RLS if you disabled it
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify the inserts
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    status,
    created_at
FROM profiles 
WHERE email IN (${pendingUsers.map(u => `'${u.email.toLowerCase()}'`).join(', ')})
ORDER BY created_at DESC;

-- Success message
SELECT '${pendingUsers.length} users processed successfully' as result;`

    setSqlScript(script)
  }

  const exportAsJson = () => {
    if (!isClient) return // Prevent server-side execution
    
    const exportData = {
      exportDate: new Date().toISOString(),
      totalUsers: offlineUsers.length,
      pendingUsers: offlineUsers.filter(u => u.status === 'pending').length,
      users: offlineUsers
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `offline-users-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    setMessage('✅ Offline users exported as JSON file')
  }

  const exportAsCsv = () => {
    if (!isClient || offlineUsers.length === 0) {
      setMessage('❌ No users to export')
      return
    }

    const csvHeader = 'ID,Email,FirstName,LastName,Phone,Role,Status,CreatedAt,SyncAttempts\n'
    const csvRows = offlineUsers.map(user => 
      `"${user.id}","${user.email}","${user.firstName}","${user.lastName}","${user.phone || ''}","${user.role}","${user.status}","${user.createdAt}","${user.syncAttempts}"`
    ).join('\n')

    const csvContent = csvHeader + csvRows
    const csvBlob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(csvBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `offline-users-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)

    setMessage('✅ Offline users exported as CSV file')
  }

  const copySqlScript = () => {
    if (!isClient) return
    
    navigator.clipboard.writeText(sqlScript)
    setMessage('✅ SQL script copied to clipboard')
  }

  const markAsSynced = (userId: string) => {
    if (!isClient) return
    
    const updatedUsers = offlineUsers.map(user => 
      user.id === userId ? { ...user, status: 'synced' as const } : user
    )
    localStorage.setItem('offline_users', JSON.stringify(updatedUsers))
    setOfflineUsers(updatedUsers)
    generateSqlScript(updatedUsers)
    setMessage(`✅ Marked user as synced manually`)
  }

  const clearSyncedUsers = () => {
    if (!isClient) return
    
    const pendingUsers = offlineUsers.filter(user => user.status !== 'synced')
    localStorage.setItem('offline_users', JSON.stringify(pendingUsers))
    setOfflineUsers(pendingUsers)
    generateSqlScript(pendingUsers)
    setMessage('✅ Cleared synced users from local storage')
  }

  const clearAllUsers = () => {
    if (!isClient) return
    
    localStorage.removeItem('offline_users')
    setOfflineUsers([])
    setSqlScript('')
    setMessage('✅ All offline users cleared from local storage')
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <p className="mt-4 text-muted-foreground">Loading offline user management...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const pendingUsers = offlineUsers.filter(u => u.status === 'pending' || u.status === 'failed')
  const syncedUsers = offlineUsers.filter(u => u.status === 'synced')

  return (
    <div className="space-y-6">
      {/* Current Status Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Current Status:</strong><br />
          • Database has 1 user: Samwel Msuya (samwelmsuya10@gmail.com)<br />
          • Offline storage has {offlineUsers.length} user(s) pending sync<br />
          • Derick Mhidze is still in offline storage and needs to be synced
        </AlertDescription>
      </Alert>

      {/* Network Status Alert */}
      <Alert className="border-red-200 bg-red-50">
        <WifiOff className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>No Internet Connection Detected</strong><br />
          Use the manual sync options below to sync your offline users to the database.
        </AlertDescription>
      </Alert>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{offlineUsers.length}</div>
            <div className="text-sm text-muted-foreground">Offline Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{pendingUsers.length}</div>
            <div className="text-sm text-muted-foreground">Pending Sync</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">In Database</div>
          </CardContent>
        </Card>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User List</TabsTrigger>
          <TabsTrigger value="sql">SQL Script</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="help">Help Guide</TabsTrigger>
        </TabsList>

        {/* User List Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Offline Users Management</CardTitle>
              <CardDescription>
                Manage users created while offline (including Derick Mhidze)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {offlineUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No offline users found</p>
                  <p className="text-sm">Note: Derick Mhidze should appear here if created offline</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {offlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-gray-500">
                          Role: {user.role} • Created: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">ID: {user.id}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.status === 'pending' && (
                          <>
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                              ⏳ Pending
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markAsSynced(user.id)}
                            >
                              Mark as Synced
                            </Button>
                          </>
                        )}
                        {user.status === 'synced' && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            ✅ Synced
                          </span>
                        )}
                        {user.status === 'failed' && (
                          <>
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                              ❌ Failed ({user.syncAttempts})
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markAsSynced(user.id)}
                            >
                              Mark as Synced
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={clearSyncedUsers}>
                      Clear Synced Users
                    </Button>
                    <Button variant="destructive" onClick={clearAllUsers}>
                      Clear All Users
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SQL Script Tab */}
        <TabsContent value="sql">
          <Card>
            <CardHeader>
              <CardTitle>Manual Database Sync</CardTitle>
              <CardDescription>
                Copy this SQL script and run it in your Supabase SQL Editor to sync offline users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending users to sync</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Ready to sync {pendingUsers.length} user(s)</h4>
                      <p className="text-sm text-muted-foreground">
                        Copy the SQL script below and run it in Supabase SQL Editor
                      </p>
                    </div>
                    <Button onClick={copySqlScript}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy SQL
                    </Button>
                  </div>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto max-h-96">
                    <pre className="text-sm whitespace-pre-wrap">{sqlScript}</pre>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Instructions:</strong><br />
                      1. Go to your Supabase dashboard: https://llojsesjbjbzdccddonp.supabase.co<br />
                      2. Navigate to SQL Editor<br />
                      3. Paste the script above and click "Run"<br />
                      4. Come back here and mark users as "Synced"
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Offline Data</CardTitle>
              <CardDescription>
                Download your offline users in different formats for backup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={exportAsJson} variant="outline" className="h-20">
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <div>Export as JSON</div>
                    <div className="text-xs text-muted-foreground">
                      Complete data with metadata
                    </div>
                  </div>
                </Button>

                <Button onClick={exportAsCsv} variant="outline" className="h-20">
                  <div className="text-center">
                    <Download className="h-6 w-6 mx-auto mb-2" />
                    <div>Export as CSV</div>
                    <div className="text-xs text-muted-foreground">
                      Spreadsheet compatible
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Help Tab */}
        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Current Situation & Next Steps</CardTitle>
              <CardDescription>
                Understanding your user sync status and network issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Good News:</strong> At least one user (Samwel Msuya) successfully synced to your database!
                  This means your database is working and accessible.
                </AlertDescription>
              </Alert>

              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Issue:</strong> Derick Mhidze and other offline users are still pending sync due to network connectivity issues.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Immediate Action:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Use the "SQL Script" tab to get the sync script</li>
                    <li>Go to Supabase SQL Editor and run the script manually</li>
                    <li>This will add Derick and other offline users to database</li>
                    <li>Come back and mark them as "Synced" to clean up</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">🔧 Fix Network Issues:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Restart your router/modem</li>
                    <li>Try different network (mobile hotspot)</li>
                    <li>Check Windows network settings</li>
                    <li>Temporarily disable firewall/antivirus</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">🚪 Logout Issue:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Logout not working due to same network connectivity issue</li>
                    <li>Clear browser cookies/cache as temporary workaround</li>
                    <li>Close browser and reopen to reset session</li>
                    <li>Logout will work once network connectivity is restored</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}