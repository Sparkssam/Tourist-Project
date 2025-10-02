"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Wifi, WifiOff } from "lucide-react"

interface TestUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
}

export function TestCreateUserForm() {
  const [formData, setFormData] = useState<TestUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'staff'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [connectionTest, setConnectionTest] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle')

  // Test Supabase connection first
  const testConnection = async () => {
    setConnectionTest('testing')
    try {
      console.log('🔌 Testing Supabase connection...')
      
      const { supabase } = await import('@/lib/supabase/client')
      
      // Simple health check
      const { data, error } = await Promise.race([
        supabase.from('profiles').select('count', { count: 'exact', head: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 3000))
      ])

      if (error) {
        throw error
      }

      console.log('✅ Supabase connection successful')
      setConnectionTest('success')
      return true
    } catch (err: any) {
      console.error('❌ Supabase connection failed:', err)
      setConnectionTest('failed')
      setError(`Connection test failed: ${err.message}`)
      return false
    }
  }

  // Mock user creation (for testing UI)
  const createMockUser = async () => {
    console.log('🎭 Creating mock user (no database)')
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userId = `mock_${Date.now()}`
    
    setMessage(`✅ MOCK Success! User would be created:

👤 Name: ${formData.firstName} ${formData.lastName}
📧 Email: ${formData.email}
🔐 Role: ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
🆔 ID: ${userId}

⚠️ This is a TEST - no actual database changes made.`)
    
    return true
  }

  // Real user creation with enhanced debugging
  const createRealUser = async () => {
    console.log('💾 Creating real user in database...')
    
    try {
      const { supabase } = await import('@/lib/supabase/client')
      
      // Generate UUID
      const userId = crypto.randomUUID()
      
      const insertData = {
        id: userId,
        email: formData.email.toLowerCase().trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('📝 Insert data:', insertData)

      // Try with a 5-second timeout
      const { data, error } = await Promise.race([
        supabase.from('profiles').insert(insertData).select(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database insert timeout (5 seconds)')), 5000)
        )
      ]) as any

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Real user created:', data)

      setMessage(`✅ REAL Success! User created in database:

👤 Name: ${formData.firstName} ${formData.lastName}
📧 Email: ${formData.email}
🔐 Role: ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
🆔 ID: ${userId}

✨ User is now in the database and can register.`)
      
      return true
    } catch (err: any) {
      console.error('❌ Real user creation failed:', err)
      throw err
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields')
      }

      // Test connection first if not already tested
      if (connectionTest !== 'success') {
        console.log('🔍 Testing connection before user creation...')
        const connected = await testConnection()
        if (!connected) {
          // Fall back to mock creation
          console.log('⚠️ Connection failed, creating mock user instead...')
          await createMockUser()
          return
        }
      }

      // Try real creation
      await createRealUser()
      
      // Reset form on success
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'staff'
      })

    } catch (err: any) {
      console.error('❌ Error in user creation:', err)
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Test User Creation</span>
          <div className="ml-auto">
            {connectionTest === 'idle' && <Button variant="outline" size="sm" onClick={testConnection}>Test Connection</Button>}
            {connectionTest === 'testing' && <WifiOff className="h-5 w-5 text-yellow-500 animate-pulse" />}
            {connectionTest === 'success' && <Wifi className="h-5 w-5 text-green-500" />}
            {connectionTest === 'failed' && <WifiOff className="h-5 w-5 text-red-500" />}
          </div>
        </CardTitle>
        <CardDescription>
          Debug version with connection testing and fallback options
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Connection Status */}
        {connectionTest === 'testing' && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <WifiOff className="h-4 w-4 text-yellow-600 animate-pulse" />
            <AlertDescription className="text-yellow-800">
              Testing Supabase connection...
            </AlertDescription>
          </Alert>
        )}

        {connectionTest === 'success' && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <Wifi className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Supabase connection successful - ready to create real users
            </AlertDescription>
          </Alert>
        )}

        {connectionTest === 'failed' && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <WifiOff className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              ⚠️ Supabase connection failed - will create mock users for testing
            </AlertDescription>
          </Alert>
        )}

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
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
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
              placeholder="john.doe@kekeosafaris.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+255 123 456 789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">User Role *</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'admin' | 'staff' | 'tourist') => 
                setFormData(prev => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff Member</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating User..." : "Create User"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={createMockUser}
              disabled={loading}
              className="px-6"
            >
              Test Mock
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}