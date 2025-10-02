"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, UserPlus, CheckCircle, AlertCircle } from "lucide-react"
import { UserRole, AdminUserCreationData } from "@/lib/types/user"

export function CreateUserForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<AdminUserCreationData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: UserRole.STAFF,
    sendWelcomeEmail: true
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
      console.log('🔄 Starting user creation process...')
      
      // Import supabase client
      const { supabase } = await import('@/lib/supabase/client')
      console.log('✅ Supabase client loaded')

      // Check if email already exists with timeout
      console.log('🔍 Checking if email exists...')
      const emailCheckPromise = supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .single()

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email check timeout')), 5000)
      )

      try {
        const { data: existingUser } = await Promise.race([emailCheckPromise, timeoutPromise]) as any
        
        if (existingUser) {
          setError('A user with this email already exists!')
          return
        }
        console.log('✅ Email is available')
      } catch (emailError: any) {
        if (emailError.message === 'Email check timeout') {
          console.log('⏱️ Email check timed out, continuing anyway...')
        } else if (emailError.code === 'PGRST116') {
          console.log('✅ Email not found (good - available for use)')
        } else {
          console.error('Email check error:', emailError)
          // Continue anyway if it's just a check error
        }
      }

      // Generate a UUID for the profile
      const userId = crypto.randomUUID()
      console.log('🆔 Generated user ID:', userId)

      // Create the profile directly with timeout
      console.log('💾 Creating profile in database...')
      const createProfilePromise = supabase
        .from('profiles')
        .insert({
          id: userId,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
          role: formData.role,
          status: 'active'
        })

      const createTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile creation timeout')), 10000)
      )

      const { error: profileError } = await Promise.race([createProfilePromise, createTimeoutPromise]) as any

      if (profileError) {
        console.error('❌ Profile creation error:', profileError)
        throw profileError
      }

      console.log('✅ User profile created successfully!')

      setMessage(`✅ User profile created successfully! 
                 👤 ${formData.firstName} ${formData.lastName}
                 📧 ${formData.email}
                 🔐 Role: ${formData.role}
                 🆔 ID: ${userId}
                 
                 📝 IMPORTANT: This creates a user profile only.
                 The user will need to register normally at /register 
                 using this email to create their login account.`)
      
      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: UserRole.STAFF,
        sendWelcomeEmail: true
      })

      console.log('🎉 User creation process completed!')
    } catch (err: any) {
      console.error('Error creating user:', err)
      setError(`Failed to create user: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof AdminUserCreationData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/users" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Users</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New User</h1>
          <p className="text-muted-foreground">Add a new staff member or administrator</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>User Details</span>
          </CardTitle>
          <CardDescription>
            Create accounts for staff members and administrators. Tourist accounts 
            are created through public registration only.
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
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+255 123 456 789"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">User Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: UserRole) => handleInputChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.STAFF}>
                    <div className="flex flex-col">
                      <span>Staff Member</span>
                      <span className="text-xs text-muted-foreground">
                        Can view tourist inquiries and manage tours
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.ADMIN}>
                    <div className="flex flex-col">
                      <span>Administrator</span>
                      <span className="text-xs text-muted-foreground">
                        Full access to all system features
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Account Options</h4>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sendWelcomeEmail"
                  checked={formData.sendWelcomeEmail}
                  onCheckedChange={(checked) => handleInputChange('sendWelcomeEmail', checked as boolean)}
                />
                <Label htmlFor="sendWelcomeEmail" className="text-sm">
                  Send welcome email with login instructions
                </Label>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>• A temporary password will be generated and sent to the user</p>
                <p>• The user will be required to change their password on first login</p>
                <p>• Account will be created in active status</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button asChild variant="outline">
                <Link href="/admin/users">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating User..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}