"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2, Shield, Users, MapPin } from "lucide-react"

interface AdminUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
}

export function AdminUserCreationForm() {
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
      // Validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields')
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      console.log('🚀 Admin user creation started')
      const { supabase } = await import('@/lib/supabase/client')

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', formData.email.toLowerCase().trim())
        .single()

      if (existingUser) {
        throw new Error('A user with this email address already exists!')
      }

      // Generate UUID for the profile
      const userId = crypto.randomUUID()
      
      console.log('📝 Creating user profile...')

      // Create user profile
      const profileData = {
        id: userId,
        email: formData.email.toLowerCase().trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        status: 'active' as const,
        has_auth_account: false, // Profile created by admin, user can register later
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError)
        throw new Error(`Failed to create user: ${profileError.message}`)
      }

      console.log('✅ User created successfully!')

      // Success message with role-specific information
      const roleInfo = {
        admin: {
          icon: '👑',
          description: 'Full system access - can manage users, view all data, and configure settings'
        },
        staff: {
          icon: '👨‍💼',
          description: 'Staff access - can view tourist inquiries and manage tour bookings'
        },
        tourist: {
          icon: '🧳',
          description: 'Tourist access - can create inquiries and make tour bookings'
        }
      }

      const role = roleInfo[formData.role]
      
      setMessage(`✅ SUCCESS! User account created successfully!

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
    }
  }

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return <Shield className="h-4 w-4 text-purple-600" />
      case 'staff': return <Users className="h-4 w-4 text-blue-600" />
      case 'tourist': return <MapPin className="h-4 w-4 text-green-600" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const getRoleDescription = (role: string) => {
    switch(role) {
      case 'admin': return 'Full access to all system features and user management'
      case 'staff': return 'Access to tourist inquiries and tour management'
      case 'tourist': return 'Can create inquiries and book tours'
      default: return ''
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Add New User</span>
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
                <SelectItem value="staff">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Staff Member</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span>Administrator</span>
                  </div>
                </SelectItem>
                <SelectItem value="tourist">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>Tourist</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {formData.role && (
              <p className="text-sm text-gray-600 mt-1">
                {getRoleIcon(formData.role)}
                <span className="ml-1">{getRoleDescription(formData.role)}</span>
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
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

        {/* Role Information */}
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800 flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Role Permissions
            </h4>
            <div className="text-sm text-blue-700 space-y-2">
              <div><strong>👑 Admin:</strong> Manage users, view all data, system settings</div>
              <div><strong>👨‍💼 Staff:</strong> View inquiries, manage bookings, customer support</div>
              <div><strong>🧳 Tourist:</strong> Create inquiries, book tours, view own bookings</div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-green-800">✅ After Creation</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• User profile is immediately active in the system</li>
              <li>• User appears in the admin dashboard user list</li>
              <li>• User can register using their email to get full access</li>
              <li>• You can edit or deactivate the user at any time</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}