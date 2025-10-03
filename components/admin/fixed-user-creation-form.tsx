"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2, Shield, Users, MapPin } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

interface AdminUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
}

export function FixedUserCreationForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      console.log('🚀 Starting user creation process...')
      
      // Form validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      console.log('✅ Form validation passed')

      // Initialize Supabase with timeout
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration is missing. Please check environment variables.')
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      console.log('✅ Supabase client initialized')

      // Skip problematic connection test and go directly to email check
      console.log('🔍 Checking if email already exists...')
      
      // Set a timeout for the email check
      const emailCheckPromise = supabase
        .from('profiles')
        .select('id, email')
        .eq('email', formData.email.toLowerCase().trim())
        .maybeSingle()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timed out after 10 seconds')), 10000)
      )

      const { data: existingUser, error: checkError } = await Promise.race([
        emailCheckPromise,
        timeoutPromise
      ]) as any

      if (checkError) {
        console.error('❌ Email check failed:', checkError)
        throw new Error(`Database error: ${checkError.message}. This might be a permissions issue.`)
      }

      if (existingUser) {
        throw new Error('A user with this email address already exists!')
      }

      console.log('✅ Email is available')

      // Generate user ID
      const userId = crypto.randomUUID()
      console.log('✅ Generated user ID:', userId)

      // Create user profile with timeout
      console.log('📝 Creating user profile...')
      
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

      const insertPromise = supabase
        .from('profiles')
        .insert(profileData)
        .select()

      const insertTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile creation timed out after 15 seconds')), 15000)
      )

      const { error: profileError, data: insertedData } = await Promise.race([
        insertPromise,
        insertTimeoutPromise
      ]) as any

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError)
        
        // Provide specific error messages based on common issues
        let errorMessage = `Failed to create user: ${profileError.message}`
        
        if (profileError.message.includes('permission denied') || profileError.message.includes('RLS')) {
          errorMessage = `Database permissions error: The profiles table has Row Level Security (RLS) policies that are blocking the insert. Please contact your administrator to disable RLS or add proper policies for user creation.`
        } else if (profileError.message.includes('duplicate key')) {
          errorMessage = `A user with this email or ID already exists.`
        } else if (profileError.message.includes('foreign key')) {
          errorMessage = `Database constraint error: There might be a foreign key constraint issue. Please check your database configuration.`
        }
        
        throw new Error(errorMessage)
      }

      console.log('✅ User profile created successfully!')

      // Success message
      const roleInfo = {
        admin: { icon: '👑', description: 'Full system access - can manage users, view all data, and configure settings' },
        staff: { icon: '👨‍💼', description: 'Staff access - can view tourist inquiries and manage tour bookings' },
        tourist: { icon: '🧳', description: 'Tourist access - can create inquiries and make tour bookings' }
      }

      const role = roleInfo[formData.role]
      
      setMessage(`🎉 SUCCESS! User account created successfully!

👤 **User Details:**
   • Name: ${formData.firstName} ${formData.lastName}
   • Email: ${formData.email}
   • Phone: ${formData.phone || 'Not provided'}
   • User ID: ${userId}

${role.icon} **Role: ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}**
   ${role.description}

📋 **Next Steps:**
   • User profile is now active in the system
   • User can register at /register using this email
   • They'll be able to login and access ${formData.role} features
   • You can see this user in the User Management table`)
      
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
      console.log('🏁 Process completed')
    }
  }

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return <Shield className="h-4 w-4 text-purple-600" />
      case 'staff': return <Users className="h-4 w-4 text-blue-600" />
      case 'tourist': return <MapPin className="h-4 w-4 text-green-600" />
      default: return null
    }
  }

  const getRoleDescription = (role: string) => {
    switch(role) {
      case 'admin': return 'Full access to all system features and user management'
      case 'staff': return 'Can manage tour bookings and view customer inquiries'
      case 'tourist': return 'Can make inquiries and book tours'
      default: return ''
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Add New User (Fixed Version)</span>
        </CardTitle>
        <CardDescription>
          Create new admin, staff, or tourist accounts for the Kekeo Safaris system
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
                <SelectItem value="tourist">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon('tourist')}
                    <span>Tourist</span>
                  </div>
                </SelectItem>
                <SelectItem value="staff">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon('staff')}
                    <span>Staff</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon('admin')}
                    <span>Admin</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {getRoleDescription(formData.role)}
            </p>
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
  )
}