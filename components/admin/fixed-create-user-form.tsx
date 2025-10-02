"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2 } from "lucide-react"

interface FixedUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
}

export function FixedCreateUserForm() {
  const [formData, setFormData] = useState<FixedUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'staff'
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    setStep('')

    try {
      // Validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields')
      }

      console.log('🚀 Fixed user creation started')
      const { supabase } = await import('@/lib/supabase/client')

      // Step 1: Create auth user first
      setStep('Creating authentication account...')
      console.log('👤 Step 1: Creating auth user')
      
      // Generate a temporary password for the user
      const tempPassword = crypto.randomUUID().slice(0, 12) + 'A1!'
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: tempPassword,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
          },
          emailRedirectTo: undefined // Disable email confirmation
        }
      })

      if (authError) {
        console.error('❌ Auth user creation failed:', authError)
        throw new Error(`Authentication error: ${authError.message}`)
      }

      if (!authData.user?.id) {
        throw new Error('No user ID returned from authentication')
      }

      console.log('✅ Auth user created:', authData.user.id)

      // Step 2: Create/update profile
      setStep('Creating user profile...')
      console.log('📝 Step 2: Creating profile')

      const profileData = {
        id: authData.user.id, // Use the auth user ID
        email: formData.email.toLowerCase().trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData) // Use upsert in case profile already exists

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError)
        throw new Error(`Profile creation error: ${profileError.message}`)
      }

      console.log('✅ Profile created successfully')

      // Step 3: Success
      setStep('Complete!')
      setMessage(`✅ SUCCESS! User account created successfully!

👤 Name: ${formData.firstName} ${formData.lastName}
📧 Email: ${formData.email}
🔐 Role: ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
🆔 ID: ${authData.user.id}
🔑 Temp Password: ${tempPassword}

The user can now:
1. Login with their email and temporary password
2. Reset their password using "Forgot Password"
3. Access features based on their role (${formData.role})`)
      
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
      setStep('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Fixed User Creation</span>
        </CardTitle>
        <CardDescription>
          Proper auth user + profile creation flow (following database constraints)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Loading Step Indicator */}
        {loading && step && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <AlertDescription className="text-blue-800">
              {step}
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
                disabled={loading}
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
              placeholder="john.doe@kekeosafaris.com"
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">User Role *</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'admin' | 'staff' | 'tourist') => 
                setFormData(prev => ({ ...prev, role: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff Member</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="tourist">Tourist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step || "Creating User..."}
              </>
            ) : (
              "Create User Account"
            )}
          </Button>
        </form>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">How this works:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Creates authentication account in Supabase Auth</li>
            <li>2. Creates profile record linked to the auth account</li>
            <li>3. Generates temporary password for immediate access</li>
            <li>4. User can login and reset password as needed</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}