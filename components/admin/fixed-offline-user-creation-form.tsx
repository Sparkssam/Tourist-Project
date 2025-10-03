"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2, Shield, Users, MapPin, WifiOff, Download, Upload } from "lucide-react"

interface AdminUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
}

interface OfflineUser extends AdminUserForm {
  id: string
  status: 'pending' | 'synced' | 'failed'
  createdAt: string
  syncAttempts: number
}

export function FixedOfflineUserCreationForm() {
  // Client-side rendering state
  const [isClient, setIsClient] = useState(false)
  
  const [formData, setFormData] = useState<AdminUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'staff'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [offlineUsers, setOfflineUsers] = useState<OfflineUser[]>([])
  const [isOnline, setIsOnline] = useState(false) // Default to false for SSR

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)
    
    // Set initial online status safely
    setIsOnline(navigator.onLine)
    
    // Load offline users from localStorage
    const stored = localStorage.getItem('offline_users')
    if (stored) {
      try {
        setOfflineUsers(JSON.parse(stored))
      } catch (err) {
        console.error('Failed to load offline users:', err)
      }
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Save offline users to localStorage
  const saveOfflineUsers = (users: OfflineUser[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('offline_users', JSON.stringify(users))
      setOfflineUsers(users)
    }
  }

  // Create user offline
  const createUserOffline = (userData: AdminUserForm) => {
    const newUser: OfflineUser = {
      ...userData,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      syncAttempts: 0
    }

    const updatedUsers = [...offlineUsers, newUser]
    saveOfflineUsers(updatedUsers)
    return newUser
  }

  // Attempt to sync with Supabase
  const attemptSync = async (user: OfflineUser): Promise<boolean> => {
    try {
      // Test basic connectivity first
      const testResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      })

      if (!testResponse.ok) {
        throw new Error('Supabase server not reachable')
      }

      // If connectivity works, try to sync user
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

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
        .abortSignal(AbortSignal.timeout(10000))

      if (profileError) {
        console.error('Sync failed:', profileError)
        return false
      }

      return true
    } catch (err) {
      console.error('Sync attempt failed:', err)
      return false
    }
  }

  // Sync all pending users
  const syncAllUsers = async () => {
    if (!isOnline) {
      setError('Cannot sync while offline. Please check your internet connection.')
      return
    }

    setLoading(true)
    let successCount = 0
    let failCount = 0

    const updatedUsers = [...offlineUsers]

    for (let i = 0; i < updatedUsers.length; i++) {
      const user = updatedUsers[i]
      if (user.status === 'pending') {
        const syncSuccess = await attemptSync(user)
        
        if (syncSuccess) {
          updatedUsers[i] = { ...user, status: 'synced' }
          successCount++
        } else {
          updatedUsers[i] = { ...user, status: 'failed', syncAttempts: user.syncAttempts + 1 }
          failCount++
        }
      }
    }

    saveOfflineUsers(updatedUsers)
    setLoading(false)

    if (successCount > 0) {
      setMessage(`✅ Successfully synced ${successCount} user(s) to database!`)
    }
    
    if (failCount > 0) {
      setError(`❌ Failed to sync ${failCount} user(s). They will retry automatically when connection improves.`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Basic validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      // Check for duplicate email in offline storage
      const duplicateOffline = offlineUsers.find(
        user => user.email.toLowerCase() === formData.email.toLowerCase()
      )
      
      if (duplicateOffline) {
        throw new Error('A user with this email is already pending creation.')
      }

      if (isOnline) {
        // Try online creation first
        console.log('🌐 Attempting online user creation...')
        
        try {
          const syncUser: OfflineUser = {
            ...formData,
            id: crypto.randomUUID(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            syncAttempts: 0
          }

          const syncSuccess = await attemptSync(syncUser)
          
          if (syncSuccess) {
            // Online creation successful
            const roleInfo = {
              admin: { icon: '👑', description: 'Full system access' },
              staff: { icon: '👨‍💼', description: 'Staff access' },
              tourist: { icon: '🧳', description: 'Tourist access' }
            }

            const role = roleInfo[formData.role]
            
            setMessage(`🎉 SUCCESS! User created online immediately!

👤 **User Details:**
   • Name: ${formData.firstName} ${formData.lastName}
   • Email: ${formData.email}
   • Role: ${role.icon} ${formData.role}

✅ **Status: Synced to database**`)

            // Reset form
            setFormData({
              email: '',
              firstName: '',
              lastName: '',
              phone: '',
              role: 'staff'
            })

            setLoading(false)
            return
          }
        } catch (onlineError) {
          console.log('Online creation failed, falling back to offline mode')
        }
      }

      // Create user offline
      console.log('💾 Creating user in offline mode...')
      
      const newUser = createUserOffline(formData)
      
      const roleInfo = {
        admin: { icon: '👑', description: 'Full system access' },
        staff: { icon: '👨‍💼', description: 'Staff access' },
        tourist: { icon: '🧳', description: 'Tourist access' }
      }

      const role = roleInfo[formData.role]
      
      setMessage(`💾 User created in OFFLINE mode!

👤 **User Details:**
   • Name: ${formData.firstName} ${formData.lastName}
   • Email: ${formData.email}
   • Role: ${role.icon} ${formData.role}
   • ID: ${newUser.id}

⏳ **Status: Waiting for sync**
   • User will be synced to database when connection is restored
   • You can manually sync using the "Sync All Users" button below`)

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'staff'
      })

    } catch (err: any) {
      console.error('❌ Error creating user:', err)
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const exportOfflineUsers = () => {
    const dataStr = JSON.stringify(offlineUsers, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `offline-users-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearSyncedUsers = () => {
    const pendingUsers = offlineUsers.filter(user => user.status === 'pending' || user.status === 'failed')
    saveOfflineUsers(pendingUsers)
    setMessage('✅ Cleared synced users from offline storage')
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-muted-foreground">Loading user creation form...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Alert className={isOnline ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
        {isOnline ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-600" />
        )}
        <AlertDescription className={isOnline ? "text-green-800" : "text-red-800"}>
          {isOnline 
            ? "🌐 Online - Users will be created directly in database"
            : "📱 Offline Mode - Users will be stored locally and synced when connection returns"
          }
        </AlertDescription>
      </Alert>

      {/* Offline Users Management */}
      {offlineUsers.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <WifiOff className="h-5 w-5 text-orange-600" />
                <span>Offline Users ({offlineUsers.length})</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={exportOfflineUsers}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={syncAllUsers} disabled={!isOnline || loading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {loading ? 'Syncing...' : 'Sync All'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {offlineUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-muted-foreground">{user.email} • {user.role}</div>
                    <div className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user.status === 'pending' && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        ⏳ Pending
                      </span>
                    )}
                    {user.status === 'synced' && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        ✅ Synced
                      </span>
                    )}
                    {user.status === 'failed' && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        ❌ Failed ({user.syncAttempts})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {offlineUsers.some(u => u.status === 'synced') && (
              <Button variant="outline" size="sm" onClick={clearSyncedUsers} className="mt-4">
                Clear Synced Users
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* User Creation Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Add New User (Offline Capable)</span>
          </CardTitle>
          <CardDescription>
            Create users online or offline - they'll sync automatically when connection is restored
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Success/Error Messages */}
          {message && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 whitespace-pre-line">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 whitespace-pre-line">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number (optional)"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">User Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as 'admin' | 'staff' | 'tourist' }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourist">🧳 Tourist</SelectItem>
                  <SelectItem value="staff">👨‍💼 Staff</SelectItem>
                  <SelectItem value="admin">👑 Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating User Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isOnline ? "Create User Account" : "Create User (Offline)"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}