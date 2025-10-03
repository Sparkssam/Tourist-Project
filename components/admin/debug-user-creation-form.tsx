"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2, Shield, Users, MapPin, Bug } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

interface AdminUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
}

interface DebugStep {
  step: string
  status: 'pending' | 'success' | 'error'
  message: string
  timestamp: Date
  details?: any
}

export function DebugUserCreationForm() {
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
  const [debugSteps, setDebugSteps] = useState<DebugStep[]>([])

  const addDebugStep = (step: string, status: 'pending' | 'success' | 'error', message: string, details?: any) => {
    const newStep: DebugStep = {
      step,
      status,
      message,
      timestamp: new Date(),
      details
    }
    setDebugSteps(prev => [...prev, newStep])
    console.log(`[DEBUG] ${step}: ${message}`, details || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    setDebugSteps([])

    try {
      addDebugStep('FORM_VALIDATION', 'pending', 'Starting form validation...')
      
      // Validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        addDebugStep('FORM_VALIDATION', 'error', 'Missing required fields')
        throw new Error('Please fill in all required fields')
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        addDebugStep('FORM_VALIDATION', 'error', 'Invalid email format')
        throw new Error('Please enter a valid email address')
      }

      addDebugStep('FORM_VALIDATION', 'success', 'Form validation passed')

      // Initialize Supabase client
      addDebugStep('SUPABASE_INIT', 'pending', 'Initializing Supabase client...')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        addDebugStep('SUPABASE_INIT', 'error', 'Missing Supabase environment variables')
        throw new Error('Supabase configuration is missing')
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      addDebugStep('SUPABASE_INIT', 'success', 'Supabase client initialized')

      // Test database connection
      addDebugStep('DB_CONNECTION', 'pending', 'Testing database connection...')
      
      try {
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true })
        
        if (testError) {
          addDebugStep('DB_CONNECTION', 'error', `Database connection failed: ${testError.message}`, testError)
          throw new Error(`Database connection failed: ${testError.message}`)
        }
        
        addDebugStep('DB_CONNECTION', 'success', `Database connected successfully. Profile count: ${testData}`)
      } catch (dbErr: any) {
        addDebugStep('DB_CONNECTION', 'error', `Database error: ${dbErr.message}`, dbErr)
        throw new Error(`Database connection error: ${dbErr.message}`)
      }

      // Check if email already exists
      addDebugStep('EMAIL_CHECK', 'pending', `Checking if email exists: ${formData.email}`)
      
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', formData.email.toLowerCase().trim())
        .maybeSingle()

      if (checkError) {
        addDebugStep('EMAIL_CHECK', 'error', `Email check failed: ${checkError.message}`, checkError)
        throw new Error(`Failed to check email: ${checkError.message}`)
      }

      if (existingUser) {
        addDebugStep('EMAIL_CHECK', 'error', 'Email already exists in database')
        throw new Error('A user with this email address already exists!')
      }

      addDebugStep('EMAIL_CHECK', 'success', 'Email is available')

      // Generate UUID for the profile
      addDebugStep('USER_ID_GENERATION', 'pending', 'Generating user ID...')
      const userId = crypto.randomUUID()
      addDebugStep('USER_ID_GENERATION', 'success', `User ID generated: ${userId}`)

      // Create user profile
      addDebugStep('PROFILE_CREATION', 'pending', 'Creating user profile in database...')
      
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

      addDebugStep('PROFILE_CREATION', 'pending', 'Inserting profile data...', profileData)

      const { error: profileError, data: insertedData } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()

      if (profileError) {
        addDebugStep('PROFILE_CREATION', 'error', `Profile creation failed: ${profileError.message}`, profileError)
        throw new Error(`Failed to create user: ${profileError.message}`)
      }

      addDebugStep('PROFILE_CREATION', 'success', 'User profile created successfully!', insertedData)

      // Success message
      const roleInfo = {
        admin: { icon: '👑', description: 'Full system access' },
        staff: { icon: '👨‍💼', description: 'Staff access' },
        tourist: { icon: '🧳', description: 'Tourist access' }
      }

      const role = roleInfo[formData.role]
      
      setMessage(`✅ SUCCESS! User account created successfully!

👤 **User Details:**
   • Name: ${formData.firstName} ${formData.lastName}
   • Email: ${formData.email}
   • Phone: ${formData.phone || 'Not provided'}
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

    } catch (err: any) {
      addDebugStep('ERROR_HANDLER', 'error', `Final error: ${err.message}`, err)
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
      addDebugStep('PROCESS_COMPLETE', 'success', `Process completed. Loading state: false`)
    }
  }

  const getStepIcon = (status: 'pending' | 'success' | 'error') => {
    switch(status) {
      case 'pending': return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
      case 'success': return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bug className="h-5 w-5 text-orange-600" />
            <span>Debug User Creation Form</span>
          </CardTitle>
          <CardDescription>
            Enhanced form with detailed debugging to identify the loading issue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Debug Steps */}
          {debugSteps.length > 0 && (
            <Card className="mb-6 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">Debug Steps</CardTitle>
              </CardHeader>
              <CardContent className="max-h-60 overflow-y-auto">
                <div className="space-y-2 text-sm">
                  {debugSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 rounded border">
                      {getStepIcon(step.status)}
                      <div className="flex-1">
                        <div className="font-medium">{step.step}</div>
                        <div className="text-muted-foreground">{step.message}</div>
                        <div className="text-xs text-gray-500">
                          {step.timestamp.toLocaleTimeString()}
                        </div>
                        {step.details && (
                          <pre className="text-xs bg-gray-50 p-1 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(step.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                  <SelectItem value="tourist">🧳 Tourist - Can make inquiries and bookings</SelectItem>
                  <SelectItem value="staff">👨‍💼 Staff - Can manage tours and view inquiries</SelectItem>
                  <SelectItem value="admin">👑 Admin - Full system access</SelectItem>
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
                  Creating User Account... ({debugSteps.length} steps completed)
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User Account (Debug Mode)
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}