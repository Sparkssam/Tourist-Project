"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2, Shield, Users, MapPin, Wifi, WifiOff } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

interface AdminUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
}

export function NetworkDiagnosticForm() {
  const [formData, setFormData] = useState<AdminUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'staff'
  })
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [diagnostics, setDiagnostics] = useState<string[]>([])

  const addDiagnostic = (message: string) => {
    setDiagnostics(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  const testConnection = async () => {
    setTesting(true)
    setDiagnostics([])
    setError('')

    try {
      addDiagnostic('🔧 Starting network diagnostics...')

      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      addDiagnostic(`📋 Supabase URL: ${supabaseUrl ? '✅ Present' : '❌ Missing'}`)
      addDiagnostic(`📋 Supabase Key: ${supabaseKey ? '✅ Present' : '❌ Missing'}`)

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Environment variables are missing')
      }

      // Test basic network connectivity
      addDiagnostic('🌐 Testing basic network connectivity...')
      
      try {
        const response = await fetch(supabaseUrl, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        addDiagnostic(`🌐 Network response: ${response.status} ${response.statusText}`)
      } catch (netErr: any) {
        addDiagnostic(`🌐 Network test failed: ${netErr.message}`)
        throw new Error('Network connectivity issue detected')
      }

      // Initialize Supabase
      addDiagnostic('🔌 Initializing Supabase client...')
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Test with simple ping query
      addDiagnostic('🏓 Testing with simple query...')
      
      const { data: pingData, error: pingError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })
        .abortSignal(AbortSignal.timeout(8000)) // 8 second timeout

      if (pingError) {
        addDiagnostic(`❌ Simple query failed: ${pingError.message}`)
        throw new Error(`Database query failed: ${pingError.message}`)
      }

      addDiagnostic(`✅ Simple query successful! Profile count: ${pingData}`)

      // Test select query
      addDiagnostic('📊 Testing select query...')
      
      const { data: selectData, error: selectError } = await supabase
        .from('profiles')
        .select('id, email')
        .limit(1)
        .abortSignal(AbortSignal.timeout(8000))

      if (selectError) {
        addDiagnostic(`❌ Select query failed: ${selectError.message}`)
      } else {
        addDiagnostic(`✅ Select query successful! Retrieved ${selectData?.length || 0} records`)
      }

      // Test insert capability with dummy data
      addDiagnostic('📝 Testing insert capability...')
      
      const testId = `test-${Date.now()}`
      const testEmail = `test-${Date.now()}@example.com`
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: testId,
          email: testEmail,
          first_name: 'Test',
          last_name: 'User',
          role: 'tourist',
          status: 'active',
          has_auth_account: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .abortSignal(AbortSignal.timeout(8000))

      if (insertError) {
        addDiagnostic(`❌ Insert test failed: ${insertError.message}`)
        
        // Check specific error types
        if (insertError.message.includes('permission denied')) {
          addDiagnostic('🔒 Issue: Row Level Security (RLS) is blocking inserts')
        } else if (insertError.message.includes('duplicate key')) {
          addDiagnostic('🔑 Issue: Duplicate key constraint')
        } else if (insertError.message.includes('foreign key')) {
          addDiagnostic('🔗 Issue: Foreign key constraint')
        }
      } else {
        addDiagnostic('✅ Insert test successful!')
        
        // Clean up test data
        await supabase
          .from('profiles')
          .delete()
          .eq('id', testId)
        
        addDiagnostic('🧹 Test data cleaned up')
      }

      addDiagnostic('🎉 Connection diagnostics completed!')

    } catch (err: any) {
      addDiagnostic(`💥 Diagnostic failed: ${err.message}`)
      setError(err.message)
    } finally {
      setTesting(false)
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

      console.log('🚀 Starting user creation with enhanced error handling...')

      // Initialize Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration is missing')
      }

      const supabase = createClient(supabaseUrl, supabaseKey)

      // Skip email check and directly create user (since it's timing out)
      console.log('⚡ Skipping email check - creating user directly...')
      
      const userId = crypto.randomUUID()
      const profileData = {
        id: userId,
        email: formData.email.toLowerCase().trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        status: 'active' as const,
        has_auth_account: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Use AbortSignal for timeout control
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      try {
        const { error: profileError, data: insertedData } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (profileError) {
          console.error('❌ Profile creation failed:', profileError)
          
          let errorMessage = `Database error: ${profileError.message}`
          
          if (profileError.message.includes('duplicate key')) {
            errorMessage = 'A user with this email already exists. Please use a different email address.'
          } else if (profileError.message.includes('permission denied')) {
            errorMessage = 'Database permission error. Please check Row Level Security (RLS) policies on the profiles table.'
          } else if (profileError.message.includes('foreign key')) {
            errorMessage = 'Database constraint error. Please check table relationships.'
          }
          
          throw new Error(errorMessage)
        }

        console.log('✅ User created successfully!')

        // Success message
        const roleInfo = {
          admin: { icon: '👑', description: 'Full system access' },
          staff: { icon: '👨‍💼', description: 'Staff access' },
          tourist: { icon: '🧳', description: 'Tourist access' }
        }

        const role = roleInfo[formData.role]
        
        setMessage(`🎉 SUCCESS! User account created successfully!

👤 **User Details:**
   • Name: ${formData.firstName} ${formData.lastName}
   • Email: ${formData.email}
   • User ID: ${userId}

${role.icon} **Role: ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}**
   ${role.description}`)
        
        // Reset form
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          role: 'staff'
        })

      } catch (abortError: any) {
        clearTimeout(timeoutId)
        if (abortError.name === 'AbortError') {
          throw new Error('Operation timed out. This might be a network connectivity issue or database performance problem.')
        }
        throw abortError
      }

    } catch (err: any) {
      console.error('❌ Error creating user:', err)
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Network Diagnostic Section */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-orange-600" />
            <span>Network Diagnostics</span>
          </CardTitle>
          <CardDescription>
            Test your database connection before creating users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testConnection}
            disabled={testing}
            variant="outline"
            className="mb-4"
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <Wifi className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>

          {diagnostics.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
              <h4 className="font-medium mb-2">Diagnostic Results:</h4>
              {diagnostics.map((diagnostic, index) => (
                <div key={index} className="text-sm text-gray-700 font-mono">
                  {diagnostic}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Creation Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Add New User (Network Optimized)</span>
          </CardTitle>
          <CardDescription>
            Create new user accounts with enhanced timeout handling
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
                  Create User Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}