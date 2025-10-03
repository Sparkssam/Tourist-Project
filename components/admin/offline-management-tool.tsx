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

export function OfflineManagementTool() {
  const [offlineUsers, setOfflineUsers] = useState<OfflineUser[]>([])
  const [message, setMessage] = useState('')
  const [sqlScript, setSqlScript] = useState('')

  useEffect(() => {
    loadOfflineUsers()
  }, [])

  const loadOfflineUsers = () => {
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
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
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
WHERE id IN (${pendingUsers.map(u => `'${u.id}'`).join(', ')})
ORDER BY created_at DESC;

-- Success message
SELECT '${pendingUsers.length} users inserted successfully' as result;`

    setSqlScript(script)
  }

  const exportAsJson = () => {
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
    if (offlineUsers.length === 0) {
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
    navigator.clipboard.writeText(sqlScript)
    setMessage('✅ SQL script copied to clipboard')
  }

  const markAsSynced = (userId: string) => {
    const updatedUsers = offlineUsers.map(user => 
      user.id === userId ? { ...user, status: 'synced' as const } : user
    )
    localStorage.setItem('offline_users', JSON.stringify(updatedUsers))
    setOfflineUsers(updatedUsers)
    setMessage(`✅ Marked user as synced manually`)
  }

  const clearSyncedUsers = () => {
    const pendingUsers = offlineUsers.filter(user => user.status !== 'synced')
    localStorage.setItem('offline_users', JSON.stringify(pendingUsers))
    setOfflineUsers(pendingUsers)
    setMessage('✅ Cleared synced users from local storage')
  }

  const clearAllUsers = () => {
    localStorage.removeItem('offline_users')
    setOfflineUsers([])
    setSqlScript('')
    setMessage('✅ All offline users cleared from local storage')
  }

  const pendingUsers = offlineUsers.filter(u => u.status === 'pending' || u.status === 'failed')
  const syncedUsers = offlineUsers.filter(u => u.status === 'synced')

  return (
    <div className="space-y-6">
      {/* Network Status Alert */}
      <Alert className="border-red-200 bg-red-50">
        <WifiOff className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>No Internet Connection Detected</strong><br />
          Your system cannot reach external servers. Use the manual sync options below to manage your offline users.
        </AlertDescription>
      </Alert>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{offlineUsers.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
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
            <div className="text-2xl font-bold">{syncedUsers.length}</div>
            <div className="text-sm text-muted-foreground">Synced</div>
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
                Manage users created while offline
              </CardDescription>
            </CardHeader>
            <CardContent>
              {offlineUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No offline users found</p>
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
                Copy this SQL script and run it in your Supabase SQL Editor when internet connection is restored
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
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
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
                Download your offline users in different formats
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
              <CardTitle>Network Troubleshooting Guide</CardTitle>
              <CardDescription>
                Steps to resolve your internet connectivity issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Current Issue:</strong> Your system cannot reach external servers (google.com test failed).
                  This suggests a fundamental internet connectivity problem.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">🔧 Immediate Steps:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Check if other websites work in your browser</li>
                    <li>Try restarting your router/modem</li>
                    <li>Switch to mobile hotspot temporarily</li>
                    <li>Check network cables and WiFi connection</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">🌐 Network Diagnostics:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Open Command Prompt and run: <code>ping google.com</code></li>
                    <li>Check network settings in Windows</li>
                    <li>Temporarily disable firewall/antivirus</li>
                    <li>Try different DNS servers (8.8.8.8, 1.1.1.1)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">📊 Manual Sync Options:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Use the "SQL Script" tab to generate manual sync code</li>
                    <li>Export users as JSON/CSV for backup</li>
                    <li>Run SQL manually in Supabase when connection returns</li>
                    <li>Mark users as synced after manual database insertion</li>
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